#!/usr/bin/env python3
"""PROTOTYPE - throwaway. Runs each of the article's servers for real and watches
the kernel while it does.

For every (server, client-count) pair: start the article's own server, fire that
many simultaneous connections, and poll /proc four hundred times a second to see
what the kernel actually did - which children appeared, when each turned into a
zombie, when each was reaped, and how many file descriptors the parent was holding.

Nothing here is authored. If a server leaves zombies, the zombies are recorded.
If a client hangs, the hang is recorded. See ADR 0001.
"""
import json, os, resource, signal, socket, subprocess, sys, threading, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from client3 import ask_all

PORT = 8888
DELAY = float(os.environ.get('LSBAWS_DELAY', '0.5'))
POLL = 0.0025

SERVERS = [
    ('webserver3b', 'iterative, one request at a time'),
    ('webserver3c', 'fork; both sides close duplicates; nobody reaps'),
    ('webserver3d', 'fork; the parent does not close its copy'),
    ('webserver3e', 'fork; SIGCHLD handler calls os.wait() once'),
    ('webserver3f', 'fork; same handler, plus the article\'s EINTR retry'),
    ('webserver3g', 'fork; SIGCHLD handler loops on waitpid(WNOHANG)'),
]
CLIENTS = [1, 2, 3, 8, 32, 128]
REPEATS = 3

# Not the article's code. Two one-line variants used to ISOLATE what actually
# differs between webserver3e and webserver3f, which differ in two ways at once:
# the EINTR retry, and REQUEST_QUEUE_SIZE 5 -> 1024. Reported as numbers, never drawn.
DIAGNOSTICS = [
    ('webserver3e', 'REQUEST_QUEUE_SIZE = 5', 'REQUEST_QUEUE_SIZE = 1024',
     'webserver3e with 3f\'s backlog'),
    ('webserver3f', 'REQUEST_QUEUE_SIZE = 1024', 'REQUEST_QUEUE_SIZE = 5',
     'webserver3f with 3e\'s backlog'),
]


def children_of(ppid):
    """Every live process whose parent is ppid, with its state letter."""
    out = {}
    for name in os.listdir('/proc'):
        if not name.isdigit():
            continue
        try:
            with open('/proc/%s/stat' % name) as f:
                fields = f.read().rsplit(')', 1)[1].split()
        except OSError:
            continue
        if len(fields) < 2 or int(fields[1]) != ppid:
            continue
        out[int(name)] = fields[0]
    return out


def fd_count(pid):
    try:
        return len(os.listdir('/proc/%d/fd' % pid))
    except OSError:
        return None


class Observer(threading.Thread):
    """Polls /proc and writes down every change it sees. Never guesses."""

    def __init__(self, pid):
        super().__init__(daemon=True)
        self.pid, self.stop = pid, False
        self.t0 = None
        self.events, self.fds, self.seen, self.zombie, self.gone = [], [], {}, {}, {}
        self.peakChildren = 0
        self.forked = 0
        self.peakZombies = 0

    def ms(self):
        return round((time.time() - self.t0) * 1000, 1)

    def run(self):
        while self.t0 is None and not self.stop:
            time.sleep(0.001)
        lastFd = None
        while not self.stop:
            kids = children_of(self.pid)
            live = 0
            zom = 0
            for pid, state in kids.items():
                if pid not in self.seen:
                    self.seen[pid] = self.ms()
                    self.events.append({'t': self.ms(), 'kind': 'fork', 'pid': pid})
                if state == 'Z':
                    zom += 1
                    if pid not in self.zombie:
                        self.zombie[pid] = self.ms()
                        self.events.append({'t': self.ms(), 'kind': 'zombie', 'pid': pid})
                else:
                    live += 1
            for pid in list(self.seen):
                if pid not in kids and pid not in self.gone:
                    self.gone[pid] = self.ms()
                    self.events.append({'t': self.ms(), 'kind': 'reaped', 'pid': pid})
            self.peakChildren = max(self.peakChildren, len(kids))
            self.forked = len(self.seen)
            self.peakZombies = max(self.peakZombies, zom)
            n = fd_count(self.pid)
            if n is not None and n != lastFd:
                lastFd = n
                self.fds.append({'t': self.ms(), 'fds': n})
            time.sleep(POLL)

    def snapshot(self):
        kids = children_of(self.pid)
        return {'zombiesLeft': sorted(p for p, s in kids.items() if s == 'Z'),
                'liveLeft': sorted(p for p, s in kids.items() if s != 'Z'),
                'fds': fd_count(self.pid)}


def drain(proc, buf):
    """Read the server's output as it is produced, so waiting for its first line
    does not deadlock on a full pipe."""
    for chunk in iter(lambda: proc.stdout.readline(), b''):
        buf.append(chunk)


def wait_for_listen(proc, buf, budget=10.0):
    """The article's servers print 'Serving HTTP on port ...' AFTER listen()
    returns, so that line is the readiness signal. A probe connection is not
    usable: these servers have no error handling, and a connection that sends
    nothing makes handle_request fail on an empty request."""
    end = time.time() + budget
    while time.time() < end:
        if b''.join(buf).find(b'Serving HTTP on port') >= 0:
            return True
        if proc.poll() is not None:
            return False
        time.sleep(0.01)
    return False


def variant(base, old, new, tag):
    """Write a one-line variant of one of the article's files, for a diagnostic."""
    src = open(os.path.join(HERE, base + '.py')).read()
    assert src.count(old) == 1, (base, old)
    path = os.path.join(HERE, '.diag_' + tag + '.py')
    open(path, 'w').write(src.replace(old, new))
    return '.diag_' + tag


def run_pair(server, n, nofile=None):
    env = dict(os.environ, LSBAWS_DELAY=str(DELAY), PYTHONUNBUFFERED='1')
    pre = None
    if nofile:
        def pre():                                    # the article's `ulimit -n`
            resource.setrlimit(resource.RLIMIT_NOFILE, (nofile, nofile))
    p = subprocess.Popen([sys.executable, os.path.join(HERE, server + '.py')],
                         cwd=HERE, env=env, preexec_fn=pre,
                         stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    rec = {'server': server, 'clients': n, 'delay': DELAY, 'nofile': nofile}
    obs = Observer(p.pid)
    buf = []
    reader = threading.Thread(target=drain, args=(p, buf), daemon=True)
    reader.start()
    try:
        if not wait_for_listen(p, buf):
            raise RuntimeError('server never listened')
        obs.start()
        obs.t0 = time.time()
        budget = 6.0 + (n * DELAY * 1.4 if server == 'webserver3b' else DELAY * 3)
        t0, clients = ask_all(PORT, n, budget)
        rec['clients_seen'] = clients
        time.sleep(0.5 + DELAY)                        # let every child exit, and the reaper run
        rec['after'] = obs.snapshot()
    except Exception as e:
        rec['error'] = '%s: %s' % (type(e).__name__, e)
        rec.setdefault('clients_seen', [])
        rec['after'] = obs.snapshot() if obs.t0 else {}
    finally:
        obs.stop = True
        obs.join(timeout=2)
        rec['events'] = obs.events
        rec['fds'] = obs.fds
        rec['peakChildren'] = obs.peakChildren
        rec['forked'] = obs.forked
        rec['peakZombies'] = obs.peakZombies
        rec['serverAlive'] = p.poll() is None
        p.send_signal(signal.SIGTERM)
        try:
            p.wait(timeout=6)
        except subprocess.TimeoutExpired:
            p.kill()
            p.wait()
        reader.join(timeout=3)
        try:
            p.stdout.close()
        except OSError:
            pass
        rec['stdout'] = b''.join(buf).decode('utf-8', 'replace')
        # kill anything the server orphaned, so the next pair starts clean
        for pid in list(obs.seen):
            try:
                os.kill(pid, signal.SIGKILL)
            except OSError:
                pass
    return rec


def summarise(r):
    cs = r.get('clients_seen', [])
    return dict(
        served=sum(1 for c in cs if c.get('firstByte') is not None),
        hung=sum(1 for c in cs if c.get('hung')),
        failed=sum(1 for c in cs if c.get('error')),
        zombiesLeft=len(r.get('after', {}).get('zombiesLeft', [])),
        peakZombies=r.get('peakZombies', 0),
        forked=r.get('forked', 0),
        peakChildren=r.get('peakChildren', 0),
        lastMs=max([c.get('eof') or c.get('firstByte') or 0 for c in cs] or [0]),
        alive=r.get('serverAlive'),
    )


if __name__ == '__main__':
    runs = []
    for server, _ in SERVERS:
        for n in CLIENTS:
            for rep in range(REPEATS):
                r = run_pair(server, n)
                r['rep'] = rep
                runs.append(r)
                s = summarise(r)
                print('%-12s n=%-4d rep%d  served %-4d hung %-4d forked %-4d '
                      'zombies left %-4d peak %-4d  last %7.1fms %s' % (
                          server, n, rep, s['served'], s['hung'], s['forked'],
                          s['zombiesLeft'], s['peakZombies'], s['lastMs'],
                          '' if s['alive'] else 'SERVER DIED'), flush=True)
                time.sleep(0.4)

    # Isolate the two changes the article makes at once between 3e and 3f.
    diagnostics = []
    for base, old, new, label in DIAGNOSTICS:
        mod = variant(base, old, new, base[-1])
        for rep in range(REPEATS):
            r = run_pair(mod, 128)
            r.update(rep=rep, diagnostic=label, base=base)
            diagnostics.append(r)
            s = summarise(r)
            print('DIAG %-34s rep%d  served %-4d hung %-4d zombies left %-4d' % (
                label, rep, s['served'], s['hung'], s['zombiesLeft']), flush=True)
            time.sleep(0.4)
        os.remove(os.path.join(HERE, mod + '.py'))
    # The article's own two limit experiments, reproduced: a low file-descriptor
    # ceiling against the server that never closes its copy.
    for nofile in (64,):
        r = run_pair('webserver3d', 128, nofile=nofile)
        r['note'] = 'ulimit -n %d' % nofile
        runs.append(r)
        s = summarise(r)
        print('%-12s n=128 ulimit -n %d  served %d  hung %d  %s' % (
            'webserver3d', nofile, s['served'], s['hung'],
            '' if s['alive'] else 'SERVER DIED'), flush=True)
    json.dump({'servers': SERVERS, 'clients': CLIENTS, 'delay': DELAY,
               'repeats': REPEATS, 'python': sys.version, 'runs': runs,
               'diagnostics': diagnostics},
              open(os.path.join(HERE, 'runs.json'), 'w'), indent=1)
    print('\n%d runs -> runs.json' % len(runs))
