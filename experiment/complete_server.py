"""A small Unix learning server for the Part 3 lesson. Python 3.8+.
Run: python3 experiment/complete_server.py --port 8888
It is deliberately not a production HTTP or WSGI server.
"""
import argparse
import os
import signal
import socket
import time


def reap_children(*_):
    """Collect every available exit result without waiting for running children."""
    while True:
        try:
            pid, status = os.waitpid(-1, os.WNOHANG)
        except ChildProcessError:
            return  # No children left: ECHILD.
        except InterruptedError:
            continue  # Retry this wait; do not hide unrelated errors.
        if pid == 0:
            return  # Children exist, but no result is ready.


def handle_request(connection, delay=0):
    connection.settimeout(3)
    request = b''
    while b'\r\n\r\n' not in request:
        chunk = connection.recv(4096)
        if not chunk:
            return
        request += chunk
        if len(request) > 16384:
            return  # This teaching server only accepts small request headers.
    connection.sendall(
        b'HTTP/1.0 200 OK\r\nContent-Type: text/plain\r\n'
        b'Connection: close\r\n\r\nHello, World!\n'
    )
    time.sleep(delay)  # Optional visible pause after the answer, before close.


def serve(port=8888, delay=0, max_requests=None):
    signal.signal(signal.SIGCHLD, reap_children)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listener:
        listener.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        listener.bind(('127.0.0.1', port))
        listener.listen(128)
        print(f'Listening on 127.0.0.1:{listener.getsockname()[1]}', flush=True)
        handled = 0
        while max_requests is None or handled < max_requests:
            # Modern Python retries after a returning signal handler.
            connection, address = listener.accept()
            try:
                child_pid = os.fork()
            except BaseException:
                connection.close()
                raise
            if child_pid == 0:
                listener.close()
                result = 0
                try:
                    with connection:
                        handle_request(connection, delay)
                except Exception:
                    result = 1
                os._exit(result)
            connection.close()  # Parent never serves this connection.
            handled += 1
    # Finite runs only (used by verification): collect remaining children on exit.
    if max_requests is not None:
        while True:
            try:
                os.waitpid(-1, 0)
            except ChildProcessError:
                break
            except InterruptedError:
                continue


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8888)
    parser.add_argument('--delay', type=float, default=0)
    parser.add_argument('--max-requests', type=int)
    args = parser.parse_args()
    serve(args.port, args.delay, args.max_requests)
