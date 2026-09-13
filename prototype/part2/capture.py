#!/usr/bin/env python3
"""PROTOTYPE - throwaway. Captures every (server, framework) pair for real.

For each pair: start the server, send one real HTTP request over a socket,
record the exact bytes that came back, and record the environ the server built
and the start_response arguments the application used.

Nothing here is authored. If a pair fails, the failure is recorded as the
result - see MISSION principle 1.
"""
import json, os, socket, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
VENV = os.environ.get('CAP_VENV')
PY = os.environ.get('CAP_PYTHON') or (os.path.join(VENV, 'bin', 'python')
                                      if VENV else sys.executable)

SERVERS = [
    ('webserver2', "the article's own server, ~150 lines"),
    ('gunicorn',   'Gunicorn, named in the article'),
    ('waitress',   'Waitress, named in the article'),
]
APPS = [
    ('wsgiapp',    'a bare WSGI application'),
    ('pyramidapp', 'Pyramid'),
    ('flaskapp',   'Flask'),
    ('djangoapp',  'Django'),
]
# Every pair runs on the article's own port, one at a time. A port per pair would
# make SERVER_PORT differ between cells for a reason the reader's knob did not cause.
PORT = 8888
REQUEST = ('GET /hello HTTP/1.1\r\n'
           'Host: localhost:%d\r\n'
           'Connection: close\r\n'
           '\r\n')

def ask(port, request):
    s = socket.create_connection(('127.0.0.1', port), timeout=6)
    s.sendall(request.encode())
    buf = b''
    while True:
        chunk = s.recv(4096)
        if not chunk:
            break
        buf += chunk
    s.close()
    return buf

def run_pair(server, app, port):
    out = os.path.join(HERE, '.cap.json')
    if os.path.exists(out):
        os.remove(out)
    env = dict(os.environ, CAP_APP=app, CAP_SERVER=server,
               CAP_PORT=str(port), CAP_OUT=out, PYTHONPATH=HERE)
    p = subprocess.Popen([PY, os.path.join(HERE, '_runner.py')], env=env, cwd=HERE,
                         stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    rec = {'server': server, 'app': app, 'request': REQUEST % port}
    try:
        # Retry the REAL request rather than probing with a throwaway connection.
        # The article's server accepts exactly one connection at a time and has no
        # error handling: an empty connection makes parse_request('') raise
        # IndexError on splitlines()[0] and the server dies. A readiness probe
        # would be measuring the harness, not the server.
        raw = None
        for _ in range(60):
            try:
                raw = ask(port, REQUEST % port)
                break
            except ConnectionRefusedError:
                if p.poll() is not None:
                    raise RuntimeError('server exited before listening')
                time.sleep(.25)
        if raw is None:
            raise RuntimeError('server never listened')
        rec['response'] = raw.decode('utf-8', 'replace')
        rec['ok'] = raw.startswith(b'HTTP/1.1 200') or raw.startswith(b'HTTP/1.0 200')
    except Exception as e:
        rec['response'] = None
        rec['ok'] = False
        rec['error'] = '%s: %s' % (type(e).__name__, e)
    finally:
        p.terminate()
        try:
            log = p.communicate(timeout=5)[0]
        except subprocess.TimeoutExpired:
            p.kill(); log = p.communicate()[0]
        rec['server_stdout'] = log.decode('utf-8', 'replace')
    if os.path.exists(out):
        rec.update(json.load(open(out)))
        os.remove(out)
    return rec

if __name__ == '__main__':
    runs = []
    for si, (server, _) in enumerate(SERVERS):
        for ai, (app, _) in enumerate(APPS):
            r = run_pair(server, app, PORT)
            time.sleep(.6)                    # let the port be released before the next pair
            runs.append(r)
            keys = len(r.get('environ', {}))
            print('%-11s x %-11s %s  environ keys: %-3s %s' % (
                server, app, 'ok ' if r['ok'] else 'FAIL',
                keys or '-', r.get('error', '')))
    json.dump({'servers': SERVERS, 'apps': APPS, 'runs': runs},
              open(os.path.join(HERE, 'runs.json'), 'w'), indent=1)
    print('\n%d runs -> runs.json' % len(runs))
