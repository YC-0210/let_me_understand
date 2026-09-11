# Python3.7+
# The article's webserver1.py, with ONE change, marked below: the response is
# chosen by the path instead of being the same fixed string every time.
import socket

HOST, PORT = '', 8888

PAGES = {
    '/hello':    'Hello, World!',
    '/goodbye':  'Goodbye, World!',
    '/greeting': 'Nice to meet you!',
}

listen_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
listen_socket.bind((HOST, PORT))
listen_socket.listen(1)
print(f'Serving HTTP on port {PORT} ...')
while True:
    client_connection, client_address = listen_socket.accept()
    request_data = client_connection.recv(1024)
    print(request_data.decode('utf-8'))

    # --- the one change: look at the path before answering ---
    path = request_data.decode('utf-8').split(' ')[1]
    if path in PAGES:
        http_response = f'HTTP/1.1 200 OK\n\n{PAGES[path]}\n'.encode()
    else:
        http_response = b'HTTP/1.1 404 Not Found\n\nNo such page\n'

    client_connection.sendall(http_response)
    client_connection.close()
