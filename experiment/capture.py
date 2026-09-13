"""Capture real loopback sockets; animation displays these recorded events."""
import json, os, socket, subprocess, sys, threading, time
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def server(mode):
    listener=socket.socket(); listener.setsockopt(socket.SOL_SOCKET,socket.SO_REUSEADDR,1)
    listener.bind(('127.0.0.1',0)); listener.listen(5)
    print(listener.getsockname()[1],flush=True)
    children=[]
    for _ in range(2):
        connection,_=listener.accept()
        if mode=='fork':
            pid=os.fork()
            if pid:
                children.append(pid); connection.close(); continue
            listener.close()
        connection.recv(4096)
        connection.sendall(b'HTTP/1.0 200 OK\r\n\r\nHello World!\n')
        time.sleep(.6)
        connection.close()
        if mode=='fork': os._exit(0)
    listener.close()
    for pid in children: os.waitpid(pid,0)

def record(mode,arrival):
    proc=subprocess.Popen([sys.executable,__file__,'server',mode],stdout=subprocess.PIPE,text=True)
    events=[]; failures=[]; start=None
    try:
        port=int(proc.stdout.readline()); start=time.monotonic()
        def client(name,delay):
            try:
                time.sleep(delay)
                with socket.create_connection(('127.0.0.1',port),timeout=4) as sock:
                    events.append({'who':name,'kind':'request','time':time.monotonic()-start})
                    sock.sendall(b'GET / HTTP/1.0\r\n\r\n')
                    payload=b''
                    while b'Hello World!' not in payload:
                        chunk=sock.recv(4096)
                        if not chunk: raise ValueError('Connection ended before expected response')
                        payload+=chunk
                    events.append({'who':name,'kind':'answer','time':time.monotonic()-start})
                    while sock.recv(4096): pass
                    events.append({'who':name,'kind':'close','time':time.monotonic()-start})
            except Exception as exc: failures.append(str(exc))
        threads=[threading.Thread(target=client,args=('A',0)),threading.Thread(target=client,args=('B',arrival))]
        for thread in threads: thread.start()
        for thread in threads: thread.join()
        proc.wait(timeout=5)
        if failures or proc.returncode: raise RuntimeError(failures or proc.returncode)
        return {'mode':mode,'arrival':arrival,'events':sorted(events,key=lambda e:e['time'])}
    finally:
        if proc.poll() is None: proc.kill(); proc.wait()
        proc.stdout.close()

def search_trace(target,binary=True):
    items=list(range(1,17)); lo,hi=0,15; trace=[]
    while lo<=hi:
        i=(lo+hi)//2 if binary else lo
        found=items[i]==target
        old=[lo,hi]
        if not found:
            if binary and items[i]>target: hi=i-1
            else: lo=i+1
        trace.append({'index':i,'value':items[i],'before':old,'remaining':[lo,hi],'found':found})
        if found: return trace
    return trace

def capture():
    (ROOT/'runs/server-traces.json').write_text(json.dumps([record(mode,arrival) for arrival in [.12,.36,.8] for mode in ['serial','fork']],indent=2))
    (ROOT/'runs/search-traces.json').write_text(json.dumps({str(t):{'linear':search_trace(t,False),'binary':search_trace(t)} for t in range(1,17)},indent=2))
if __name__=='__main__':
    if len(sys.argv)>1: server(sys.argv[2])
    else: capture()
