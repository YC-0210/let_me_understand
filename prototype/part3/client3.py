#!/usr/bin/env python3
"""PROTOTYPE - throwaway. The article's client3.py, rewritten to RECORD.

The article's client forks and prints. This one opens the same simultaneous
connections and writes down, per connection, when it connected, when the first
byte arrived, and whether the connection was ever closed by the server. That
last one is the whole point of webserver3d: the reply arrives and the
connection never ends.

Nothing here is authored. A connection that hangs is recorded as hanging.
"""
import json, socket, sys, threading, time

REQUEST = b'GET /hello HTTP/1.1\r\nHost: localhost:8888\r\n\r\n'

def one(addr, idx, t0, deadline, out):
    rec = {'i': idx, 'connect': None, 'firstByte': None, 'eof': None,
           'hung': False, 'error': None, 'bytes': 0}
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(max(0.1, deadline - time.time()))
        s.connect(addr)
        rec['connect'] = round((time.time() - t0) * 1000, 1)
        s.sendall(REQUEST)
        buf = b''
        while True:
            s.settimeout(max(0.05, deadline - time.time()))
            try:
                chunk = s.recv(4096)
            except socket.timeout:
                rec['hung'] = True
                break
            if rec['firstByte'] is None and chunk:
                rec['firstByte'] = round((time.time() - t0) * 1000, 1)
            if not chunk:
                rec['eof'] = round((time.time() - t0) * 1000, 1)
                break
            buf += chunk
        rec['bytes'] = len(buf)
        rec['body'] = buf.decode('utf-8', 'replace')
        s.close()
    except Exception as e:
        rec['error'] = '%s: %s' % (type(e).__name__, e)
    out[idx] = rec

def ask_all(port, n, budget):
    """Fire n connections as close to simultaneously as threads allow."""
    addr = ('127.0.0.1', port)
    out = [None] * n
    gate = threading.Barrier(n + 1)
    # set after every thread exists, so the clock starts when they are all waiting
    t0 = deadline = None
    threads = []
    for i in range(n):
        def work(i=i):
            gate.wait()
            one(addr, i, t0, deadline, out)
        t = threading.Thread(target=work, daemon=True)
        t.start()
        threads.append(t)
    t0 = time.time()
    deadline = t0 + budget
    gate.wait()
    for t in threads:
        t.join(timeout=max(1.0, deadline - time.time() + 2))
    return t0, [r for r in out if r]

if __name__ == '__main__':
    t0, recs = ask_all(int(sys.argv[1]), int(sys.argv[2]), float(sys.argv[3]))
    print(json.dumps(recs, indent=1))
