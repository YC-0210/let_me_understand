"""PROTOTYPE - throwaway. Runs one (server, application) pair for capture.

The application is wrapped so the capture records the exact `environ` the server
built and the exact arguments the application passed to `start_response`. The
wrapper never touches the result iterable - the response body is read off the
wire by the client, not from here.
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

APP, SERVER, PORT, OUT = (os.environ['CAP_APP'], os.environ['CAP_SERVER'],
                          int(os.environ['CAP_PORT']), os.environ['CAP_OUT'])

def show(v):
    """A stable display string: repr, with memory addresses stripped."""
    if isinstance(v, (str, int, float, bool, tuple, type(None))):
        return repr(v)
    return re.sub(r' at 0x[0-9a-f]+', '', repr(v))

def wrap(app):
    def wrapped(environ, start_response):
        rec = {'environ': {k: show(v) for k, v in sorted(environ.items())}}
        def sr(status, response_headers, exc_info=None):
            rec['status'] = status
            rec['headers'] = [list(h) for h in response_headers]
            json.dump(rec, open(OUT, 'w'), indent=1)
            return start_response(status, response_headers, exc_info)
        return app(environ, sr)
    return wrapped

app = wrap(getattr(__import__(APP), 'app'))

if __name__ == '__main__':
    if SERVER == 'webserver2':
        import webserver2
        webserver2.SERVER_ADDRESS = ('', PORT)
        httpd = webserver2.make_server(('', PORT), app)
        httpd.serve_forever()
    elif SERVER == 'waitress':
        from waitress import serve
        serve(app, host='127.0.0.1', port=PORT, threads=1, clear_untrusted_proxy_headers=True)
    elif SERVER == 'gunicorn':
        from gunicorn.app.base import BaseApplication
        class Runner(BaseApplication):
            def load_config(self):
                self.cfg.set('bind', '127.0.0.1:%d' % PORT)
                self.cfg.set('workers', 1)
                self.cfg.set('loglevel', 'error')
            def load(self): return app
        Runner().run()
