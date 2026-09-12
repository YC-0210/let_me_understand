#!/usr/bin/env python3
"""PROTOTYPE - throwaway. One parameter: the path. Sends the article's own
hand-typed request shape, GET <path> HTTP/1.1, for many paths, and records
what really came back from the article's unmodified webserver1.py."""
import io, json, os, runpy, socket, sys, threading, time

HERE, PORT = os.path.dirname(os.path.abspath(__file__)), 8888
SRC = os.path.join(HERE, 'webserver1.py')

PATHS = ['/hello', '/', '/hello/', '/Hello', '/HELLO', '/hell', '/helloo',
         '/hello.html', '/index.html', '/goodbye', '/world', '/home', '/about',
         '/hello/world', '/a/b/c/d', '/hello?name=you', '/search?q=cat',
         '/favicon.ico', '/robots.txt', '/static/style.css', '/api/users',
         '/login', '/admin', '/404']

runs = [{'path': p, 'request': 'GET %s HTTP/1.1\r\n\r\n' % p, 'response': None} for p in PATHS]
cur = {'i': -1}

def tracer(frame, event, arg):
    if event != 'line' or frame.f_code.co_filename != SRC: return tracer
    if 'listen_socket.accept()' in open(SRC).read().split('\n')[frame.f_lineno-1]:
        cur['i'] += 1
        if cur['i'] >= len(runs): raise KeyboardInterrupt
    return tracer

def client():
    time.sleep(.8)
    for r in runs:
        time.sleep(.04)
        try:
            s = socket.create_connection(('127.0.0.1', PORT), timeout=3)
            s.sendall(r['request'].encode()); s.shutdown(socket.SHUT_WR)
            buf = b''
            while True:
                b = s.recv(4096)
                if not b: break
                buf += b
            s.close(); r['response'] = buf.decode('utf-8', 'replace')
        except OSError as e:
            r['response'] = '<error %s>' % e
    time.sleep(1.5)
    try: socket.create_connection(('127.0.0.1', PORT), timeout=1).close()
    except OSError: pass

threading.Thread(target=client, daemon=True).start()
sys.stdout = io.StringIO(); sys.settrace(tracer)
try: runpy.run_path(SRC, run_name='__main__')
except (KeyboardInterrupt, SystemExit): pass
finally: sys.settrace(None); sys.stdout = sys.__stdout__

json.dump({'runs': runs}, open(os.path.join(HERE, 'paths.json'), 'w'), indent=1)
print('paths sent      :', len(runs))
print('distinct replies:', len({r['response'] for r in runs}))
print('the reply       :', repr(sorted({r['response'] for r in runs})[0]))
