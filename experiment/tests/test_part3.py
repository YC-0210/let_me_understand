import concurrent.futures,json,socket,subprocess,sys,time,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
E=json.loads((ROOT/'experiment/runs/part3-evidence.json').read_text())
class Part3Tests(unittest.TestCase):
    def test_distinct_connections_share_server_endpoint(self):
        a,b=E['endpoints'];self.assertEqual(a['server'],b['server']);self.assertNotEqual(a['client'],b['client']);self.assertNotEqual(a['accepted_fd'],a['listener_fd'])
    def test_fork_return_and_inherited_descriptor(self):
        r=E['ownership'];self.assertEqual(r['parent_fork_return'],r['child']['pid']);self.assertEqual(r['child']['fork_return'],0);self.assertEqual(r['child']['ppid'],r['parent_pid']);self.assertEqual(r['parent_fd'],r['child']['connection_fd'])
    def test_retained_handle_prevents_eof(self):
        self.assertFalse(E['ownership']['eof_while_retained']);self.assertTrue(E['ownership']['eof_after_close'])
    def test_file_limit_recovers(self):
        self.assertEqual(E['fd_limit']['error'],'EMFILE');self.assertTrue(E['fd_limit']['open_after_cleanup'])
    def test_one_notice_requires_multiple_collections(self):
        r=E['burst'];self.assertEqual(r['notifications'],1);self.assertTrue(all(s.startswith('Z') for s in r['states'].values()));self.assertEqual(r['remaining_after_one'],2)
        collected={r['first']['pid']}|{x['pid'] for x in r['drained']};self.assertEqual(collected,set(r['children']));self.assertEqual(r['terminal'],'ECHILD')
    def test_nonblocking_running_child_returns_zero(self):
        self.assertEqual(E['nonblocking']['while_running'],[0,0]);self.assertGreater(E['nonblocking']['after_exit']['pid'],0)
    def test_modern_accept_survives_returning_handler(self):
        events=E['accept_retry']['events'];self.assertLess(events.index('SIGCHLD handled'),events.index('accept returned a connection'));self.assertFalse(E['accept_retry']['interrupted_exception'])
    def test_complete_server_overlapping_clients(self):
        proc=subprocess.Popen([sys.executable,str(ROOT/'experiment/complete_server.py'),'--port','0','--delay','.5','--max-requests','4'],stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True)
        try:
            port=int(proc.stdout.readline().strip().split(':')[-1])
            def client(_):
                with socket.create_connection(('127.0.0.1',port),timeout=3) as s:
                    # Deliberately split the request across writes.
                    s.sendall(b'GET / HTTP/1.0\r\n');s.sendall(b'\r\n')
                    response=b''
                    while b'Hello, World!' not in response:
                        part=s.recv(4096)
                        if not part:raise AssertionError('Early EOF')
                        response+=part
                    answered=time.monotonic()
                    while s.recv(4096):pass
                    return answered,time.monotonic()
            with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:times=list(pool.map(client,range(4)))
            self.assertLess(max(a for a,c in times),min(c for a,c in times),'All clients should be answered while other connections still remain open')
            proc.wait(timeout=4);self.assertEqual(proc.returncode,0,proc.stderr.read())
        finally:
            if proc.poll() is None:proc.kill();proc.wait()
            proc.stdout.close();proc.stderr.close()
if __name__=='__main__':unittest.main()
