#!/usr/bin/env python3
"""PROTOTYPE - throwaway. A fork-per-connection server whose design decisions
are switches, not separate files. Records real events to JSON."""
import errno, json, os, resource, signal, socket, sys, time

SW  = json.loads(sys.argv[1])
OUT = sys.argv[2]

FD_LIMIT = 32
HANDLER_DELAY = 0.08

start        = time.time()
events       = []
handler_pids = set()
reaped       = set()
leaked       = []
stop         = False

def now_ms():
    return round((time.time() - start) * 1000, 1)

def fd_count():
    try:
        return len(os.listdir('/proc/self/fd'))
    except OSError:
        return -1

def proc_state(pid):
    try:
        with open('/proc/%d/stat' % pid) as f:
            return f.read().rsplit(')', 1)[1].split()[0]
    except OSError:
        return None

def zombie_count():
    return sum(1 for p in handler_pids - reaped if proc_state(p) == 'Z')

def ev(kind, **kw):
    e = {'t': now_ms(), 'kind': kind, 'fds': fd_count(), 'zombies': zombie_count()}
    e.update(kw)
    events.append(e)

def reaper_wait(signum, frame):
    ev('sigchld')
    try:
        pid, _ = os.wait()
        reaped.add(pid)
        ev('reap', pid=pid)
    except ChildProcessError:
        pass

def reaper_nohang(signum, frame):
    ev('sigchld')
    while True:
        try:
            pid, _ = os.waitpid(-1, os.WNOHANG)
        except ChildProcessError:
            break
        if pid == 0:
            break
        reaped.add(pid)
        ev('reap', pid=pid)

def on_term(signum, frame):
    global stop
    stop = True

def handle(conn):
    time.sleep(HANDLER_DELAY)
    try:
        conn.sendall(b'HTTP/1.1 200 OK\r\nContent-Length: 2\r\n\r\nok')
    except OSError:
        pass
    conn.close()

def main():
    soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
    resource.setrlimit(resource.RLIMIT_NOFILE, (min(FD_LIMIT, hard), hard))

    ls = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    ls.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    ls.bind(('127.0.0.1', 0))
    ls.listen(128)
    ls.settimeout(0.2)
    print(ls.getsockname()[1], flush=True)

    if SW['reap'] == 'wait':
        signal.signal(signal.SIGCHLD, reaper_wait)
    elif SW['reap'] == 'waitpid_nohang':
        signal.signal(signal.SIGCHLD, reaper_nohang)
    signal.signal(signal.SIGTERM, on_term)

    ev('listen')
    accepted = 0
    while not stop:
        try:
            conn, _ = ls.accept()
        except socket.timeout:
            continue
        except OSError as e:
            name = errno.errorcode.get(e.errno, str(e.errno))
            ev('accept_error', err=name, msg=str(e))
            if e.errno == errno.EMFILE:
                time.sleep(0.05)
                continue
            if e.errno == errno.EINTR and not SW['eintr_safe']:
                ev('fatal', reason='EINTR')
                break
            continue

        accepted += 1
        ev('accept', fd=conn.fileno())

        if SW['fork']:
            pid = os.fork()
            if pid == 0:
                ls.close()
                handle(conn)
                os._exit(0)
            handler_pids.add(pid)
            ev('fork', pid=pid)
            if SW['parent_closes']:
                conn.close()
                ev('parent_close')
            else:
                leaked.append(conn)
                ev('parent_leak')
        else:
            handle(conn)
            ev('handled_inline')

    ev('shutdown')
    # restore the fd limit: writing the trace needs an fd, and a leaking
    # run has none left. The tracer was a victim of the bug it measures.
    resource.setrlimit(resource.RLIMIT_NOFILE, (hard, hard))
    errs = sorted({e['err'] for e in events if e['kind'] == 'accept_error'})
    json.dump({
        'switches': SW,
        'events': events,
        'summary': {
            'accepted':     accepted,
            'peak_fds':     max((e['fds'] for e in events), default=0),
            'fd_limit':     FD_LIMIT,
            'peak_zombies': max((e['zombies'] for e in events), default=0),
            'errors':       errs,
            'forks':        len(handler_pids),
            'reaped':       len(reaped),
            'wall_ms':      now_ms(),
        },
    }, open(OUT, 'w'), indent=1)

main()
