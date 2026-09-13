# Part 2 inventory

Required by [`VISUAL-LANGUAGE.md` §6](../../docs/VISUAL-LANGUAGE.md). Every statement
[Let's Build A Web Server, part 2](https://ruslanspivak.com/lsbaws-part2/) makes — each
line of its code, each named part, each sentence of mechanism, each of its thirteen
figures — in exactly one of **shown**, **omitted** (with a reason), **departed** (ADR 0002).

Written **before** anything was drawn, which is the point.

## The drawing this is classified against

Provisional. Nothing below is built yet; "shown" means *intended to be shown*, and the
list is what the build is then held to.

- Three places on one horizontal axis: **You** (left) · **Server** (middle) ·
  **Application** (right).
- The independent variable is the **step**, named in the article's own words, taken from
  its seven-step recap.
- `environ` travels from server to application; `start_response` carries status and
  headers back while the application is still working; `result` returns after it.
- Four applications — Pyramid, Flask, Django, bare — every byte captured from real runs
  of the article's own `webserver2.py`. Whether the reader picks one or sees four at once
  is **open**; both are inside this inventory.

Two items are marked **unverified** rather than classified: they depend on capture that
has not run yet, and guessing them would be the exact failure ADR 0001 exists to prevent.

---

## A. `webserver2.py` — class setup

| # | Statement | | Why |
|---|---|---|---|
| 1 | `address_family = socket.AF_INET` | omitted | Part 1's material. Part 2 changes nothing about it; redrawing it spends the reader's first screen on something the article is not making a point about. |
| 2 | `socket_type = socket.SOCK_STREAM` | omitted | As #1. |
| 3 | `request_queue_size = 1` | omitted | Only becomes meaningful in part 3, where concurrency is the subject. The article itself defers it ("how do you handle more than one request at a time?"). |
| 4 | `listen_socket = socket.socket(...)` | omitted | As #1. |
| 5 | `setsockopt(SO_REUSEADDR, 1)` | omitted | As #1. |
| 6 | `listen_socket.bind(server_address)` | omitted | As #1. |
| 7 | `listen_socket.listen(request_queue_size)` | omitted | As #1. |
| 8 | `host, port = getsockname()[:2]` | shown | Behind the `SERVER_NAME`/`SERVER_PORT` door — it is where those two environ values come from. |
| 9 | `self.server_name = socket.getfqdn(host)` | shown | As #8. Real captured value, not `'localhost'` as the article's figure shows. |
| 10 | `self.server_port = port` | shown | As #8. |
| 11 | `self.headers_set = []` | shown | This empty list is the whole reason `start_response` exists. Drawn as the **held disc** in the server — a thing at rest inside a place — appearing when `start_response` is called. |

## B. Loading the application

| # | Statement | | Why |
|---|---|---|---|
| 12 | `set_app(application)` / `self.application = application` | shown | Recap step 1. The step "the server loads an application" is the first step of the drawing. |
| 13 | `SERVER_ADDRESS = (HOST, PORT) = '', 8888` | shown | Behind the `SERVER_PORT` door. |
| 14 | `make_server(server_address, application)` | omitted | Wiring, not mechanism: constructs the object and calls #12, both of which are shown. |
| 15 | `if len(sys.argv) < 2: sys.exit('Provide a WSGI application object as module:callable')` | shown | Behind the door on the application place. It is the article's own demonstration that the server has no application of its own — the sharpest statement of the whole point. |
| 16 | `module, application = app_path.split(':')` | shown | As #15 — `pyramidapp:app` is the only thing that differs between the four runs. |
| 17 | `__import__(module)` / `getattr(module, application)` | shown | As #15. |
| 18 | `print(f'WSGIServer: Serving HTTP on port {PORT} ...')` | shown | Captured verbatim into the step-1 door. |

## C. `serve_forever` / `handle_one_request`

| # | Statement | | Why |
|---|---|---|---|
| 19 | `while True:` | omitted | The drawing shows one request. The loop is part 3's subject and part 1 already showed it. |
| 20 | `accept()` → `client_connection, client_address` | shown | The channel between You and Server opens. Same mark as part 1. |
| 21 | comment: "Handle one request and close the client connection. Then loop over" | shown | It is the sentence that justifies #48; carried in that door. |
| 22 | `request_data = self.client_connection.recv(1024)` | shown | Recap step 2, "the server reads a request". |
| 23 | `.decode('utf-8')` | omitted | Representation, not mechanism. No reader question turns on it. |
| 24 | `print('< ' + line)` for each request line | shown | Not as a mark — this printed transcript **is** the capture. Its real bytes are the door content. |
| 25 | `self.parse_request(request_data)` | shown | Recap step 3. |
| 26 | `env = self.get_environ()` | shown | Recap step 4. The disc is created here. |
| 27 | `result = self.application(env, self.start_response)` | shown | Recap step 5 — the centre of the article and the centre of the drawing. |
| 28 | `self.finish_response(result)` | shown | Recap step 6. |

## D. `parse_request`

| # | Statement | | Why |
|---|---|---|---|
| 29 | `request_line = text.splitlines()[0]` | shown | Behind the parse door: only the **first line** is parsed, and the drawing should not imply headers are read. |
| 30 | `.rstrip('\r\n')` | omitted | Hygiene. Nothing observable depends on it. |
| 31 | `(method, path, version) = request_line.split()` | shown | Three values out of one line, and exactly two of them reach `environ`. |

## E. `get_environ` — eleven keys, each one a statement

| # | Key | | Why |
|---|---|---|---|
| 32 | `wsgi.version = (1, 0)` | shown | All eleven are shown, with **real captured values**, behind the environ door. The dict is the subject; showing nine of eleven would be the part-1 mistake again. |
| 33 | `wsgi.url_scheme = 'http'` | shown | |
| 34 | `wsgi.input = io.StringIO(self.request_data)` | shown | Shown as written. See the open note below — the article's value does not match PEP 3333, and saying so is a candidate Branch, not a departure. |
| 35 | `wsgi.errors = sys.stderr` | shown | |
| 36 | `wsgi.multithread = False` | shown | |
| 37 | `wsgi.multiprocess = False` | shown | |
| 38 | `wsgi.run_once = False` | shown | |
| 39 | `REQUEST_METHOD = self.request_method` | shown | |
| 40 | `PATH_INFO = self.path` | shown | |
| 41 | `SERVER_NAME = self.server_name` | shown | |
| 42 | `SERVER_PORT = str(self.server_port)` | shown | The `str()` is shown — every CGI value is a string, and it is the one type fact the code states out loud. |
| 43 | comment: "does not follow PEP8 … formatted to emphasize the required variables" | omitted | About the article's typography, not the system. |
| 44 | Figure `environ.png` — the dict drawn as a labelled box | shown | Its content is #32–#42. Our values are captured, so `SERVER_NAME` will differ from the figure's `'localhost'`. |

## F. `start_response`

| # | Statement | | Why |
|---|---|---|---|
| 45 | `server_headers = [('Date', 'Mon, 15 Jul 2019 5:54:48 GMT'), ('Server', 'WSGIServer 0.2')]` | shown | The hardcoded date is shown as-is. It is real, it is what the code does, and it is the clearest evidence of which headers the *server* adds. |
| 46 | `self.headers_set = [status, response_headers + server_headers]` | shown | The held disc, #11. Concatenation order is visible in the captured response. |
| 47 | comment: "must return a 'write' callable. For simplicity's sake we'll ignore that detail" + commented-out `return self.finish_response` | shown | The article marking its own simplification. Carried in the `start_response` door, in its words. |

## G. `finish_response`

| # | Statement | | Why |
|---|---|---|---|
| 48 | `status, response_headers = self.headers_set` | shown | The held disc is read back. |
| 49 | `response = f'HTTP/1.1 {status}\r\n'` | shown | Behind the response door, over the captured bytes. |
| 50 | header lines `'{0}: {1}\r\n'` | shown | As #49. |
| 51 | the blank `'\r\n'` separating headers from body | shown | As #49. |
| 52 | `for data in result: response += data.decode('utf-8')` | shown | `result` is **iterable**, not a string. The four applications each return a one-item list; the loop is why they could return more. |
| 53 | `print('> ' + line)` | shown | As #24 — this is the capture. |
| 54 | `sendall(response_bytes)` | shown | Recap step 7; the disc travels back to You. |
| 55 | `finally: self.client_connection.close()` | shown | **Explicitly listed because part 1 dropped exactly this line.** The channel closes; the traces remain (ADR 0003). |
| 56 | that the close is in a `finally:` | omitted | Error handling. The drawing shows no failure path, so the guarantee has nothing to guarantee. |

## H. The four applications

| # | Statement | | Why |
|---|---|---|---|
| 57 | `pyramidapp.py` — `Configurator`, `add_route('hello', '/hello')`, `add_view`, `make_wsgi_app()` | shown | Behind the application door, verbatim, when Pyramid is the application. |
| 58 | Pyramid returns `'Hello world from Pyramid!\n'`, `content_type='text/plain'` | shown | Captured. |
| 59 | `flaskapp.py` — `Flask('flaskapp')`, `@flask_app.route('/hello')`, `app = flask_app.wsgi_app` | shown | As #57. |
| 60 | Flask returns `'Hello world from Flask!\n'`, `mimetype='text/plain'` | shown | Captured. |
| 61 | `djangoapp.py` — `sys.path.insert(0, './helloworld')`, `from helloworld import wsgi`, `app = wsgi.application` | shown | As #57. |
| 62 | The `helloworld` Django project itself | **departed** | The article does not print it; it says "clone the repo". The project must be generated with `django-admin startproject` and given a `/hello` view, so what runs is **authored by us**, not by the article. ADR 0002: it will be built and really run, and marked at the point the reader meets Django. |
| 63 | `wsgiapp.py` — the barebones application, all five lines | shown | The article's "you just wrote your own minimalistic WSGI framework". The fourth application. |
| 64 | It returns `[b'Hello world from a simple WSGI application!\n']` | shown | Captured. |
| 65 | Its docstring, "This is a starting point for your own Web framework :)" | omitted | Encouragement, not mechanism. |
| 66 | `venv` creation and `pip install pyramid flask django` | omitted | Setup for the reader's machine. Done for real to produce the capture; not part of what the drawing explains. |

## I. Prose and figures

| # | Statement | | Why |
|---|---|---|---|
| 67 | Before WSGI, a server and framework worked together only if designed together (fig. `before_wsgi`) | shown | Behind the door on the application place — the *why*, folded away (Principle 3). |
| 68 | The mismatch problem (fig. `after_wsgi`) | shown | As #67. |
| 69 | Mix and match: Django/Flask/Pyramid × Gunicorn/Nginx+uWSGI/Waitress (fig. `wsgi_interop`) | shown | As #67. The named servers are quoted, not drawn — we have run none of them. |
| 70 | "Your Web server must implement the server portion … all modern frameworks already implement the framework side" | shown | The sentence that names the two sides; it names our two right-hand places. |
| 71 | It also benefits server and framework developers — specialization | omitted | About people, not the system. |
| 72 | Java has Servlet API, Ruby has Rack | omitted | Outside the system. A Branch at best, and it closes onto nothing the reader just did. |
| 73 | "just under 150 lines" | shown | In the door on the server place. |
| 74 | Running with no arguments exits with a message | shown | #15. |
| 75 | Four-step "here is how it works" list | shown | Steps 4–6 of the drawing are this list. |
| 76 | Step 4 carries "(This step is not part of the specification…)" | shown | Marked where the reader meets it. The article distinguishes what WSGI requires from what a server must do anyway, and that distinction is worth keeping. |
| 77 | Fig. `wsgi_interface`: dashed = **not in WSGI spec**, solid = part of it | omitted *as an encoding* | The distinction is kept, in words, at #76. The article's dash cannot be borrowed: dashed already means **trace / history** (ADR 0003), and a second meaning for the same stroke would make both unreadable. Closed system, §7. |
| 78 | Fig. `wsgi_interface`: `start_response` drawn as a self-loop on the framework's lifeline | shown | It is called *by the application*, back into the server — the one arrow that runs the wrong way. |
| 79 | Fig. `wsgi_interface`: `finish_response` is the server's own work, after the application returns | shown | Step 6. |
| 80 | The response has four headers not seen in part 1: `Content-Type`, `Content-Length`, `Date`, `Server` | shown | Over captured bytes. |
| 81 | "None of them are strictly required, though" | shown | In the header door. |
| 82 | Fig. `http_response_explanation`: status and response headers come from `start_response`; `Date` and `Server` are added by the server; the body is `result` | shown | This is the drawing's payoff — every part of the response coloured by who produced it. |
| 83 | `Content-Length: 26` appears though the server never sets it | **unverified** | The article groups it under "response headers (start_response)", i.e. the framework sets it. Whether the *bare* application sets one is a real difference between the four, and capture will say. Not classified until it has. |
| 84 | "A Web framework uses the information from that dictionary to decide which view to use based on route, request method etc." | shown | It is why `PATH_INFO` matters, and it is the link back to part 1's page-name parameter. |
| 85 | "…where to read the request body from and where to write errors" | shown | The door on `wsgi.input` and `wsgi.errors`. |
| 86 | Seven-step recap | shown | The step list itself. |
| 87 | Fig. `server_summary` (read → parse → build environ → call application → build response) | shown | Same seven steps in the article's own picture. |
| 88 | Fig. `wsgi_idea` (a stick figure holding a WSGI sign) | omitted | Decorative. Carries no statement. |
| 89 | Browser screenshots for Pyramid, Flask, Django, bare app | shown | As four captured response bodies rather than four screenshots. |
| 90 | "please do so … you must try it and retype everything yourself" | omitted | Instruction to the reader, not a claim about the system. |
| 91 | "How do you make your server handle more than one request at a time?" (part 3) | omitted | Deliberately: it is the next article, and part 3 has already been probed once (`views.html`, deleted). |
| 92 | Resources: Stevens, APUE, TLPI, **PEP 333** | omitted from the drawing | PEP 333/3333 becomes a **reference** for checking #62 and #34 — its tier under `CONTEXT.md`, not a thing drawn. |

---

## Totals

92 statements: **68 shown**, **22 omitted with a reason**, **1 departure** (#62, the Django
project), **1 unverified** pending capture (#83, whether the bare application sets
`Content-Length`).

## Still open, named rather than buried

- **#34** `wsgi.input = io.StringIO(...)`. PEP 3333 requires a byte stream; `StringIO` is
  text. This is shown as the article wrote it. Whether to say so is a **Branch**
  ("beyond the article"), not a Departure — we would be adding a note, not changing
  behaviour. Needs checking against PEP 3333 before any such note is written.
- **#62** The Django project is ours. Django 5.2's generated `wsgi.py` may also need
  `environ` keys this server never sets. If Django cannot be served by the article's
  unmodified server, that is a **finding to report, not to patch around** (Principle 1).

---

## Verification — the inventory checked against what was actually drawn

The inventory is worthless if it is written once and never checked. Checked after
`mix.html` was built, and it had **drifted**: three groups of items were marked *shown*
and were not drawn at all. This is the same failure the rule exists to catch, arriving by
a different route — the first version missed a line, this version claimed a line was there.

| item | claimed | was | now |
|---|---|---|---|
| #12, #15–18 — `set_app`, loading `module:callable` | shown | **not drawn** | Step 1, *"The server loads an `application` callable"*. The channel to the application does not exist until this step; the line appearing **is** the step. |
| #25, #29, #31 — `parse_request`, the first line, the three-way split | shown | **not drawn** | Step 3, *"The server parses it"*, with the caption *only the first line is parsed: method, path, version*. |
| #46–47 — `headers_set`, `start_response` | shown | **not drawn** | Step 7, *"The application calls `start_response`"*. The status and headers travel back on their own arc while the application is still running, and rest in the server as the **held disc** until step 9 consumes them. |
| #83 — does the bare application set `Content-Length`? | unverified | — | **Resolved by capture: it does not.** It is the only one of the four that does not, which is why Gunicorn has to chunk its body and Waitress buffers it. Both stated where the reader meets them. |

All seven steps of the article's recap are now drawn and labelled with their number. The
article's fifth step is opened into three, because two things come back by two routes at
two different times; only *the application works* carries no number, since the article's
sequence figure shows it but its list does not name it.

### A departure the first inventory did not contain

| # | Statement | | Why |
|---|---|---|---|
| 93 | Running **Gunicorn** and **Waitress** against the article's own application files | **departed** | The article names them (#69) but runs only its own `webserver2.py`. Both were installed and really run, so that the claim the article makes in words could be checked rather than repeated. ADR 0002: **checked** against the article's own list of servers, **real** — twelve pairs, every byte captured — and **marked** on the page where the reader meets it. Without it the server is not a Parameter at all: it would have exactly one value. |

Totals, revised: **93 statements** — 68 shown, 22 omitted with a reason, **2 departures**
(#62 the Django project, #93 the third-party servers), 1 resolved by capture (#83).
