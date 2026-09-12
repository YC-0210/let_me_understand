#!/usr/bin/env python3
"""PROTOTYPE - throwaway. Fires N concurrent connections at the server."""
import socket, sys, threading, time

port = int(sys.argv[1]); n = int(sys.argv[2])
ok = [0]; fail = [0]; lock = threading.Lock()

def one():
    try:
        s = socket.create_connection(('127.0.0.1', port), timeout=5)
        s.sendall(b'GET / HTTP/1.1\r\nHost: x\r\n\r\n')
        s.recv(200); s.close()
        with lock: ok[0] += 1
    except OSError:
        with lock: fail[0] += 1

ts = []
for _ in range(n):
    t = threading.Thread(target=one); t.start(); ts.append(t)
    time.sleep(0.004)
for t in ts: t.join()
print("ok=%d fail=%d" % (ok[0], fail[0]))
