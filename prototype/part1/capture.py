#!/usr/bin/env python3
"""PROTOTYPE - throwaway. Runs the article's webserver1.py UNMODIFIED under a
line tracer, fires a set of different requests at it, and records for each one:
every source line executed, the exact bytes both ways, and real socket state."""
import io, json, os, runpy, socket, sys, threading, time

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, 'webserver1.py')
PORT = 8888

VARIANTS = [
 ('browser',   'What a browser sends',
  b'GET /hello HTTP/1.1\r\nHost: localhost:8888\r\nUser-Agent: curl/8.4.0\r\nAccept: */*\r\n\r\n'),
 ('telnet',    'The bare minimum, typed by hand',
  b'GET /hello HTTP/1.1\r\n\r\n'),
 ('otherpath', 'A path the server was never told about',
  b'GET /this/does/not/exist HTTP/1.1\r\n\r\n'),
 ('post',      'A POST with a body',
  b'POST /hello HTTP/1.1\r\nContent-Length: 11\r\n\r\nhello=world'),
 ('garbage',   'Not HTTP at all',
  b'i am not a http request\r\n\r\n'),
 ('partial',   'Cut off mid-word, then hung up',
  b'GET /hel'),
 ('empty',     'Connected and said nothing',
  b''),
 ('oldhttp',   'A version from 1991',
  b'GET /hello HTTP/0.9\r\n\r\n'),
]

src_lines = open(SRC).read().split('\n')
cur   = {'i': -1}
runs  = [{'key': k, 'title': t, 'request': r.decode('utf-8', 'replace'),
          'request_bytes': len(r), 'trace': [], 'sockets': [], 'response': None,
          'response_bytes': 0, 'client_saw': None}
         for k, t, r in VARIANTS]
boot = []
t0 = time.time()
def ms(): return round((time.time() - t0) * 1000, 1)

def sock_info(s):
    try:
        d = {'fd': s.fileno()}
        try: d['local'] = '%s:%d' % s.getsockname()
        except OSError: d['local'] = None
        try: d['peer'] = '%s:%d' % s.getpeername()
        except OSError: d['peer'] = None
        return d
    except Exception:
        return {'fd': -1, 'local': None, 'peer': None}

def tracer(frame, event, arg):
    if event != 'line' or frame.f_code.co_filename != SRC:
        return tracer
    ln = frame.f_lineno
    text = src_lines[ln - 1] if ln - 1 < len(src_lines) else ''
    if 'listen_socket.accept()' in text:
        cur['i'] += 1
    i = cur['i']
    if i >= len(runs):
        raise KeyboardInterrupt
    L = frame.f_locals
    step = {'t': ms(), 'line': ln, 'src': text}
    if 'request' in L and isinstance(L['request'], bytes):
        step['request'] = L['request'].decode('utf-8', 'replace')
        runs[i]['request_seen'] = step['request']
    ls, cc = L.get('listen_socket'), L.get('client_connection')
    snap = {}
    if isinstance(ls, socket.socket): snap['listen'] = sock_info(ls)
    if isinstance(cc, socket.socket): snap['conn'] = sock_info(cc)
    if snap: step['sock'] = snap
    if 'client_address' in L: step['peer'] = '%s:%d' % L['client_address']
    (boot if i < 0 else runs[i]['trace']).append(step)
    return tracer

def client():
    # NB: no readiness probe - a probe connection gets accepted like any other
    # client and would consume run slot 0, shifting every label by one.
    time.sleep(.8)
    for i, (k, t, payload) in enumerate(VARIANTS):
        time.sleep(.12)
        try:
            s = socket.create_connection(('127.0.0.1', PORT), timeout=3)
            if payload: s.sendall(payload)
            s.shutdown(socket.SHUT_WR)
            buf = b''
            while True:
                b = s.recv(4096)
                if not b: break
                buf += b
            s.close()
            runs[i]['client_saw'] = buf.decode('utf-8', 'replace')
            runs[i]['response_bytes'] = len(buf)
        except OSError as e:
            runs[i]['client_saw'] = '<error: %s>' % e
    time.sleep(.3)
    try: socket.create_connection(('127.0.0.1', PORT), timeout=1).close()
    except OSError: pass

threading.Thread(target=client, daemon=True).start()
sys.stdout = io.StringIO()
sys.settrace(tracer)
try:
    runpy.run_path(SRC, run_name='__main__')
except (KeyboardInterrupt, SystemExit):
    pass
finally:
    sys.settrace(None)
    sys.stdout = sys.__stdout__

for r in runs:
    for s in r['trace']:
        if 'http_response' in s['src'] or 'sendall' in s['src']:
            r['response'] = 'HTTP/1.1 200 OK\n\nHello, World!\n'
json.dump({'source': src_lines, 'boot': boot, 'runs': [r for r in runs if r['trace']]},
          open(os.path.join(HERE, 'part1.json'), 'w'), indent=1)
print('boot steps:', len(boot))
print('captured runs:', sum(1 for r in runs if r['trace']))
for r in runs:
    print(' %-10s steps=%-3d req=%-4d resp=%-3d saw=%r' % (
        r['key'], len(r['trace']), r['request_bytes'], r['response_bytes'],
        (r['client_saw'] or '')[:22]))
