"""Bounded Unix probes, each run in its own single-threaded subprocess."""
import errno,json,os,resource,signal,socket,subprocess,sys,time
from pathlib import Path
ROOT=Path(__file__).resolve().parent

def endpoints():
    with socket.socket() as listener:
        listener.bind(('127.0.0.1',0));listener.listen(5)
        clients=[socket.create_connection(listener.getsockname()) for _ in range(2)]
        accepted=[listener.accept()[0] for _ in clients]
        rows=[dict(client=list(c.getsockname()),server=list(c.getpeername()),accepted_fd=a.fileno(),listener_fd=listener.fileno()) for c,a in zip(clients,accepted)]
        for s in clients+accepted:s.close()
        return rows

def ownership():
    listener=socket.socket();listener.bind(('127.0.0.1',0));listener.listen(1)
    client=socket.create_connection(listener.getsockname());connection,_=listener.accept()
    rd,wr=os.pipe();parent=os.getpid();fd=connection.fileno();child=os.fork()
    if child==0:
        os.close(rd);listener.close();client.close()
        payload=dict(pid=os.getpid(),ppid=os.getppid(),fork_return=0,connection_fd=connection.fileno())
        os.write(wr,json.dumps(payload).encode());os.close(wr)
        connection.sendall(b'Hello!');connection.close();os._exit(0)
    os.close(wr);child_info=json.loads(os.read(rd,4096));os.close(rd);os.waitpid(child,0)
    client.settimeout(.1);response=client.recv(4096).decode()
    try:client.recv(1);eof_while_retained=True
    except TimeoutError:eof_while_retained=False
    connection.close();eof_after_close=client.recv(1)==b''
    client.close();listener.close()
    return dict(parent_pid=parent,parent_fork_return=child,parent_fd=fd,child=child_info,response=response,eof_while_retained=eof_while_retained,eof_after_close=eof_after_close)

def fd_limit():
    old,hard=resource.getrlimit(resource.RLIMIT_NOFILE);limit=min(32,old)
    resource.setrlimit(resource.RLIMIT_NOFILE,(limit,hard));opened=[]
    try:
        while True:opened.append(os.open(os.devnull,os.O_RDONLY))
    except OSError as exc:code=exc.errno
    finally:
        for fd in opened:os.close(fd)
    fd=os.open(os.devnull,os.O_RDONLY);os.close(fd)
    return dict(limit=limit,opened_before_error=len(opened),errno=code,error=errno.errorcode[code],open_after_cleanup=True,scope='isolated subprocess only')

def burst():
    notifications=[];signal.signal(signal.SIGCHLD,lambda *_:notifications.append('SIGCHLD'))
    oldmask=signal.pthread_sigmask(signal.SIG_BLOCK,{signal.SIGCHLD});children=[]
    try:
        for code in [0,3,7]:
            child=os.fork()
            if not child:os._exit(code)
            children.append(child)
        deadline=time.monotonic()+3;statuses={}
        while time.monotonic()<deadline:
            result=subprocess.check_output(['ps','-o','pid=,stat=','-p',','.join(map(str,children))],text=True)
            statuses={int(row.split()[0]):row.split()[1] for row in result.splitlines()}
            if len(statuses)==3 and all(s.startswith('Z') for s in statuses.values()):break
            time.sleep(.01)
        if not all(statuses.get(pid,'').startswith('Z') for pid in children):raise RuntimeError('Children did not reach zombie state')
        # ps itself is reaped by subprocess; it may also cause SIGCHLD, but standard signals stay one pending bit.
        pending=signal.SIGCHLD in signal.sigpending()
        signal.pthread_sigmask(signal.SIG_SETMASK,oldmask)
        first=os.waitpid(children[0],os.WNOHANG);remaining=[]
        while True:
            try:pid,status=os.waitpid(-1,os.WNOHANG)
            except ChildProcessError:terminal='ECHILD';break
            if pid==0:terminal='pid=0';break
            remaining.append(dict(pid=pid,exit_code=os.waitstatus_to_exitcode(status)))
        return dict(children=children,states=statuses,pending=pending,notifications=len(notifications),first=dict(pid=first[0],exit_code=os.waitstatus_to_exitcode(first[1])),remaining_after_one=2,drained=remaining,terminal=terminal)
    finally:
        signal.pthread_sigmask(signal.SIG_SETMASK,oldmask)
        for pid in children:
            try:os.waitpid(pid,0)
            except ChildProcessError:pass

def nonblocking():
    rd,wr=os.pipe();child=os.fork()
    if not child:
        os.close(wr);os.read(rd,1);os.close(rd);os._exit(0)
    os.close(rd);first=os.waitpid(child,os.WNOHANG)
    os.write(wr,b'x');os.close(wr);second=os.waitpid(child,0)
    return dict(while_running=list(first),after_exit=dict(pid=second[0],exit_code=os.waitstatus_to_exitcode(second[1])))

def accept_retry():
    events=[];children=[]
    def handler(*_):events.append('SIGCHLD handled')
    signal.signal(signal.SIGCHLD,handler)
    listener=socket.socket();listener.bind(('127.0.0.1',0));listener.listen(1);listener.settimeout(3)
    child=os.fork()
    if not child:listener.close();time.sleep(.05);os._exit(0)
    children.append(child);connector=os.fork()
    if not connector:
        address=listener.getsockname();listener.close();time.sleep(.2)
        with socket.create_connection(address):pass
        os._exit(0)
    children.append(connector);events.append('accept entered')
    connection,_=listener.accept();events.append('accept returned a connection');connection.close();listener.close()
    for pid in children:os.waitpid(pid,0)
    return dict(python=sys.version.split()[0],events=events,interrupted_exception=False)

PROBES={f.__name__:f for f in [endpoints,ownership,fd_limit,burst,nonblocking,accept_retry]}
if __name__=='__main__':
    if len(sys.argv)>1:print(json.dumps(PROBES[sys.argv[1]]()))
    else:
        result={name:json.loads(subprocess.check_output([sys.executable,__file__,name],timeout=8,text=True)) for name in PROBES}
        (ROOT/'runs/part3-evidence.json').write_text(json.dumps(result,indent=2))
        print(json.dumps(result,indent=2))
