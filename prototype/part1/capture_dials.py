#!/usr/bin/env python3
"""PROTOTYPE - throwaway. Sweeps the four request dials across every
combination against the article's unmodified webserver1.py, line-traced."""
import io, itertools, json, os, runpy, socket, sys, threading, time

HERE, PORT = os.path.dirname(os.path.abspath(__file__)), 8888
SRC = os.path.join(HERE, 'webserver1.py')

DIALS = {
    'method':  ['GET', 'POST', 'DELETE', 'HEAD'],
    'path':    ['/hello', '/', '/does/not/exist', '/admin?token=1'],
    'version': ['HTTP/1.1', 'HTTP/1.0', 'HTTP/0.9', 'HTTP/9.9'],
    'headers': [0, 1, 3, 8],
}
KEYS   = list(DIALS)
COMBOS = [dict(zip(KEYS, v)) for v in itertools.product(*DIALS.values())]

def build(d):
    head = '%s %s %s\r\n' % (d['method'], d['path'], d['version'])
    hs = ['Host: localhost:8888', 'User-Agent: ladder/1.0', 'Accept: */*',
          'X-Try: 1', 'X-Try: 2', 'X-Try: 3', 'X-Try: 4', 'X-Try: 5']
    return (head + ''.join(h + '\r\n' for h in hs[:d['headers']]) + '\r\n').encode()

src_lines = open(SRC).read().split('\n')
runs = [{'dials': d, 'request': build(d).decode(), 'req_bytes': len(build(d)),
         'steps': [], 'response': None, 'resp_bytes': 0} for d in COMBOS]
boot, cur, t0 = [], {'i': -1}, time.time()

def fdinfo(s):
    try:
        d = {'fd': s.fileno()}
        for k, f in (('local', s.getsockname), ('peer', s.getpeername)):
            try: d[k] = '%s:%d' % f()
            except OSError: d[k] = None
        return d
    except Exception: return {'fd': -1, 'local': None, 'peer': None}

def tracer(frame, event, arg):
    if event != 'line' or frame.f_code.co_filename != SRC: return tracer
    ln = frame.f_lineno
    if 'listen_socket.accept()' in src_lines[ln-1]: cur['i'] += 1
    i = cur['i']
    if i >= len(runs): raise KeyboardInterrupt
    L = frame.f_locals
    st = {'t': round((time.time()-t0)*1000, 1), 'line': ln}
    if isinstance(L.get('request_data'), bytes): st['got'] = L['request_data'].decode('utf-8','replace')
    for nm, key in (('listen_socket','listen'), ('client_connection','conn')):
        if isinstance(L.get(nm), socket.socket): st[key] = fdinfo(L[nm])
    if 'client_address' in L: st['peer'] = '%s:%d' % L['client_address']
    (boot if i < 0 else runs[i]['steps']).append(st)
    return tracer

def client():
    time.sleep(.8)
    for i, d in enumerate(COMBOS):
        time.sleep(.03)
        try:
            s = socket.create_connection(('127.0.0.1', PORT), timeout=3)
            s.sendall(build(d)); s.shutdown(socket.SHUT_WR)
            buf = b''
            while True:
                b = s.recv(4096)
                if not b: break
                buf += b
            s.close()
            runs[i]['response'] = buf.decode('utf-8','replace'); runs[i]['resp_bytes'] = len(buf)
        except OSError as e:
            runs[i]['response'] = '<error %s>' % e
    time.sleep(1.5)   # let the final run finish before the shutdown connection
    try: socket.create_connection(('127.0.0.1', PORT), timeout=1).close()
    except OSError: pass

threading.Thread(target=client, daemon=True).start()
sys.stdout = io.StringIO(); sys.settrace(tracer)
try: runpy.run_path(SRC, run_name='__main__')
except (KeyboardInterrupt, SystemExit): pass
finally: sys.settrace(None); sys.stdout = sys.__stdout__

done = [r for r in runs if r['steps'] and r['response']]
json.dump({'source': src_lines, 'dials': DIALS, 'boot': boot, 'runs': done},
          open(os.path.join(HERE, 'dials.json'), 'w'), separators=(',', ':'))
sizes = {r['resp_bytes'] for r in done}
print('runs captured : %d of %d' % (len(done), len(COMBOS)))
print('request sizes : %d .. %d bytes' % (min(r['req_bytes'] for r in done), max(r['req_bytes'] for r in done)))
print('response sizes: %s' % sorted(sizes))
