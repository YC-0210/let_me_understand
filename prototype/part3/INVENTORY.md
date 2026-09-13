# Part 3 inventory

Required by [`VISUAL-LANGUAGE.md` §6](../../docs/VISUAL-LANGUAGE.md). Every statement
[Let's Build A Web Server, part 3](https://ruslanspivak.com/lsbaws-part3/) makes — each
line of its seven programs, each named concept, each sentence of mechanism, each of its
twenty-eight figures — in exactly one of **shown**, **omitted** (with a reason),
**departed** (ADR 0002).

Written **before** anything was drawn, which is the point. Verified against what was
actually drawn at the bottom, because part 2 proved that an inventory written once and
never checked will drift.

## The drawing this is classified against

Provisional. "Shown" means *intended to be shown*, and the list is what the build is
then held to.

- Three kinds of place, each on its own vertical: **clients** (left) · **the parent
  server** (centre) · **its children** (right). Instances of a kind stack vertically.
- Two knobs. **The server** — the article's own six programs in the article's own order,
  `3b → 3c → 3d → 3e → 3f → 3g`, each one fixing the previous one's bug. **The number of
  clients asking at once** — 1, 2, 3, and then 8, 32, 128 on the rung above.
- The independent variable is the **step**, named in the article's own words. The step
  list is a function of the server, because the article's whole subject is that these six
  programs do different things.
- A **held disc** inside a place is one open file descriptor. The reference count the
  article spends four paragraphs on is therefore *countable on the screen*: the channel
  is drawn while any place still holds a descriptor for it, and the kernel closes it —
  and the client finally finishes — only when the last held disc is gone.
- A **cross** where a child used to be is a zombie: the process is gone, its entry is
  not. It is removed when, and only when, the parent waits for it.
- Every byte, every millisecond and every zombie count comes from really running the
  article's own programs and polling `/proc` while they ran.

Three items are marked **unverified** rather than classified; they depend on capture that
has not run yet, and guessing them would be the exact failure ADR 0001 exists to prevent.

---

## A. `webserver3a.py` — the iterative server

| # | Statement | | Why |
|---|---|---|---|
| 1 | `import socket` | omitted | Language noise. No reader question turns on it. |
| 2 | `SERVER_ADDRESS = (HOST, PORT) = '', 8888` | shown | Behind the listening-socket door. |
| 3 | `REQUEST_QUEUE_SIZE = 5` | shown | Part 2 deferred this explicitly to part 3, and part 3 delivers: it is the BACKLOG, and it is why a second client can connect while the server is busy. Drawn as the queue the waiting clients sit in. |
| 4 | `handle_request`: `recv(1024)` | shown | The step "the server reads a request". |
| 5 | `print(request.decode())` | shown | Not as a mark — the printed transcript **is** the capture, and is the door content. |
| 6 | the hardcoded `HTTP/1.1 200 OK\n\nHello, World!` response | shown | Captured verbatim off the wire. |
| 7 | `client_connection.sendall(http_response)` | shown | The reply travels back. |
| 8 | `serve_forever`: `socket.socket(AF_INET, SOCK_STREAM)` | shown | Step 1. Parts 1 and 2 both omitted the socket sequence as "not what the article is making a point about". Part 3 **is** making a point about it — it has a figure for it — so it is drawn here. |
| 9 | `setsockopt(SOL_SOCKET, SO_REUSEADDR, 1)` | shown | As #8, behind the same door. The article flags it as optional and says why. |
| 10 | `bind(SERVER_ADDRESS)` | shown | As #8. |
| 11 | `listen(REQUEST_QUEUE_SIZE)` | shown | As #8. The step that makes the socket a listening socket. |
| 12 | `print('Serving HTTP on port {port} ...')` | shown | Captured verbatim into the step-1 door. |
| 13 | `while True:` | shown | Step "the parent loops over to accept another connection". Part 1 and part 2 both omitted the loop; here it is the difference between serving one client and serving many. |
| 14 | `listen_socket.accept()` → `client_connection, client_address` | shown | Step 2. |
| 15 | `handle_request(client_connection)` | shown | For the iterative server this is **the parent's own ring**, and that ring is the reason the other clients wait. |
| 16 | `client_connection.close()` | shown | The channel closes. Explicitly listed, because part 1 dropped exactly this line. |
| 17 | `if __name__ == '__main__': serve_forever()` | omitted | Wiring. |

## B. `webserver3b.py` — the same server, asleep

| # | Statement | | Why |
|---|---|---|---|
| 18 | It is `webserver3a.py` plus one line | shown | Stated in the door: the article's own instrument for making blocking observable. |
| 19 | `time.sleep(60)  # sleep and block the process for 60 seconds` | **departed** | Every server on this page sleeps the **same** amount, 0.5s, so that turning the server knob changes the design and not the clock. The article uses 60s in 3b and 3c, 3s in 3e, and nothing in 3d/3f/3g. ADR 0002: checked against the article's own stated purpose for the sleep, real (it is the constant that actually ran), marked where the reader meets the timings. |
| 20 | The two-terminal `curl` demonstration: the second `curl` hangs | shown | Reproduced for real — not with `curl` but with the recording client, which writes down the same thing `curl` shows: when the first byte arrived and whether the connection ever closed. |
| 21 | "the server finishes servicing the first request and then starts handling the second only after it sleeps" | shown | Measured: with three clients the run takes 1502ms, which is three sleeps end to end. |
| 22 | Figures `it1`, `it2`, `it3`, `it4` (queueing clients, the sleeping server, the two hanging terminals) | shown | As the drawing itself, not as screenshots. |

## C. Sockets

| # | Statement | | Why |
|---|---|---|---|
| 23 | "In order for two programs to communicate over a network, they have to use sockets" | shown | The socket Branch, already written for part 2, is reused and extended. |
| 24 | "A socket is an abstraction of a communication endpoint … using file descriptors" | shown | This sentence is the hinge of the whole article: it connects sockets to descriptors, which connects to `fork`, which is the subject. Quoted in the Branch. |
| 25 | The TCP socket pair is a 4-tuple: local IP, local port, foreign IP, foreign port | shown | In the Branch, with the real 4-tuple from our own captured connection rather than the article's invented `10.10.10.2:49152`. |
| 26 | "A socket pair uniquely identifies every TCP connection on a network" | shown | As #25. |
| 27 | The example tuples `{10.10.10.2:49152, 12.12.12.3:8888}` and its mirror | omitted **as numbers** | The claim is shown; the article's illustrative addresses are replaced by the ones that really occurred. Inventing addresses would be the one thing Principle 1 forbids. |
| 28 | Figures `it_socket`, `it_socketpair` | shown | As #23–26. |
| 29 | Server socket sequence: socket → setsockopt → bind → listen → accept (fig. `it_server_socket_sequence`) | shown | #8–#11, #14. |
| 30 | "The `listen` method is only called by servers. It tells the kernel it should accept incoming connection requests for this socket." | shown | In the listening-socket door, in the article's words. |
| 31 | Client sequence: socket → connect (fig. `it_client_socket_sequence`) | shown | What the left-hand places do. |
| 32 | The sample client code (`sock.connect`, `sendall`, `recv`, `print`) | shown | Replaced by our recording client, which does the same three calls and writes down the answers. |
| 33 | "the client doesn't call `bind` and `accept` … the kernel automatically assigns the local IP and local port when the client calls `connect`" | shown | In the ephemeral-port door. |
| 34 | **Ephemeral port** — a short-lived port (fig. `it_ephemeral_port`) | shown | With the real ephemeral ports the kernel gave our clients, not the article's `60589`. |
| 35 | **Well-known port** — 80 for HTTP, 22 for SSH | shown | As #34. |
| 36 | The `getsockname()` Python-shell demonstration | shown | Reproduced for real; its output is the door content. |

## D. Processes and file descriptors

| # | Statement | | Why |
|---|---|---|---|
| 37 | "A process is just an instance of an executing program" | shown | It is the definition of the new circle the drawing introduces. Named where the child first appears. |
| 38 | The kernel records information about a process, e.g. its process ID | shown | As #37. |
| 39 | `ps \| grep webserver3b` shows exactly one process | shown | The iterative server is **one circle**. That is why it can only do one thing. |
| 40 | PID, PPID, and the parent-child relationship (figs. `it_server_process`, `it_ppid_pid`) | shown | The line between parent and child **is** the parent-child relationship, and it is why SIGCHLD has somewhere to travel and why a zombie has somewhere to sit. Real PIDs from the capture. |
| 41 | `os.getpid()` / `os.getppid()` demonstration and its screenshot | shown | As real captured PIDs, not as a screenshot. |
| 42 | "A file descriptor is a non-negative integer that the kernel returns to a process when it opens a file … or creates a new socket" | shown | The definition of the **held disc**, given where the first one appears. |
| 43 | "in UNIX everything is a file" | shown | In the same door. |
| 44 | fd 0 = stdin, 1 = stdout, 2 = stderr (figs. `it_process_descriptors`, `it_default_descriptors`) | shown | It is why the first socket in a fresh process is descriptor 3, which the article shows next and our capture confirms. |
| 45 | `sys.stdin.fileno()` etc. returning 0, 1, 2 | shown | Reproduced for real. |
| 46 | `os.write(sys.stdout.fileno(), 'hello\n')` | omitted | A demonstration that descriptors can be used directly. Nothing in the drawing turns on it, and the article's own snippet fails on Python 3 (it passes `str` where `bytes` is required) — reproducing it would mean either correcting the article silently or showing an error about an aside. |
| 47 | `sock.fileno()` returning `3` | shown | Captured: the real descriptor number our listening socket received. |
| 48 | **BACKLOG**: "determines the size of a queue within the kernel for incoming connection requests" | shown | #3. The waiting clients are drawn in that queue. |
| 49 | "the second `curl` was able to connect because the kernel had enough space available in the incoming connection request queue" | shown | This is why a blocked server still *accepts* connections. Drawn: the line to a waiting client exists, and nothing is happening on it. |
| 50 | "increasing BACKLOG does not magically turn your server into a server that can handle multiple client requests at a time" | shown | In the same door. |
| 51 | "it is important to have a fairly large backlog … so the `accept` call could grab the new connection off the queue right away" | shown | As #50 — and see #93, where the capture has something to add to it. |
| 52 | First checkpoint: the ten-bullet recap | shown | The recap is the step vocabulary. Fig. `checkpoint` itself is omitted as decoration. |

## E. `fork()` and `webserver3c.py`

| # | Statement | | Why |
|---|---|---|---|
| 53 | "The simplest way to write a concurrent server under Unix is to use a `fork()` system call" | shown | The sentence that turns the knob. |
| 54 | `pid = os.fork()` | shown | The step. One line, and a second circle appears. |
| 55 | "you call fork once but it returns twice" (fig. `conc2_how_fork_works`) | shown | The centre of the drawing, as `environ` was the centre of part 2's. |
| 56 | "the process ID returned to the child is 0; in the parent it returns the child's PID" | shown | Both real values, from the capture, riding their own circles. |
| 57 | `if pid == 0:  # child` / `else:  # parent` | shown | The same line of code, two answers. |
| 58 | `listen_socket.close()  # close child copy` | shown | The child's held disc for the **listening** socket is dropped. The article gives this its own paragraph. |
| 59 | `handle_request(client_connection)` in the child | shown | The child's ring. |
| 60 | `client_connection.close()` in the child | shown | The child drops its held disc. |
| 61 | `os._exit(0)  # child exits here` | shown | The circle ends and a cross takes its place. |
| 62 | `client_connection.close()  # close parent copy and loop over` | shown | The parent drops its held disc. In `3d` this line is commented out, and that is the whole of `3d`. |
| 63 | `print('Parent PID (PPID): {pid}')` | shown | Captured into the door. |
| 64 | "the child process gets a copy of the parent's file descriptors" (fig. `conc2_shared_descriptors`) | shown | The held discs duplicate at fork. This is the single hardest idea in the article and the reason the held disc was chosen to carry descriptors. |
| 65 | "The kernel uses descriptor reference counts to decide whether to close a socket or not. It closes the socket only when its descriptor reference count becomes 0." | shown | Drawn as a rule the reader can watch being applied: the channel is there while any held disc remains, and gone when none does. |
| 66 | "the reference count would be 2 for the client socket … the parent … merely decrements its reference count which becomes 1" | shown | Countable on screen at every step. |
| 67 | "the child doesn't care about accepting new client connections" | shown | In the door on #58. |
| 68 | "the sole role of the server parent process now is to accept a new client connection, fork a new child … and loop over" | shown | The parent's ring becomes short and the child's long — the opposite of the iterative server, in the same marks. |
| 69 | "Two events are concurrent if you cannot tell by looking at the program which will happen first" | shown | Quoted where two children are working at once. It is also the honest caveat on our own capture: the order of near-simultaneous events is not reproducible, and the page says so. |
| 70 | Figures `conc2_service_clients`, `fork`, `conc2_concurrent_events` | shown | As the drawing. |
| 71 | Second checkpoint: the five-bullet recap | shown | As #52. |
| 72 | "I still remember how fascinated I was by fork … It looked like magic to me." | omitted | Voice, not mechanism. |

## F. `webserver3d.py` — not closing duplicates

| # | Statement | | Why |
|---|---|---|---|
| 73 | `# client_connection.close()` — the parent's close, commented out | shown | One knob value. One line of difference from `3c`. |
| 74 | `clients = []` / `clients.append(client_connection)` with the comment about garbage collection | shown | Behind the door: the list exists only to stop Python closing the socket for you, which would undo the demonstration. |
| 75 | `print(len(clients))` | shown | Captured. |
| 76 | "the `curl` printed the response … but it did not terminate and kept hanging" | shown | **Reproduced: with three clients, all three received `Hello, World!` and none of the three connections ever closed.** The reader sees the reply arrive and the client keep waiting. |
| 77 | "the termination packet (called FIN in TCP/IP parlance) was not sent" | shown | The disc that never travels. |
| 78 | "If your long-running server doesn't close duplicate file descriptors, it will eventually run out of available file descriptors" | shown | Measured: the parent's descriptor count, polled from `/proc`, climbing with every client and never falling. |
| 79 | `ulimit -a` and its full output | omitted **as a listing** | The one number that matters — `open files` — is shown, as the real limit of the process that really ran. Reproducing a screenshot of someone else's shell teaches nothing our own measurement does not. |
| 80 | `ulimit -n 256`, then `client3.py --max-clients=300`, then "your server will explode" | shown | Reproduced, by really lowering `RLIMIT_NOFILE` on the server process and really sending 128 connections. What the server printed is the door content. |
| 81 | `client3.py` in full — `argparse`, `os.fork`, `--max-conns`, `--max-clients` | **departed** | Replaced by a client that opens the same simultaneous connections but **records** per connection when the first byte arrived and whether the connection ever closed. The article's client cannot show #76 — it prints a counter and exits. ADR 0002: checked against what the article asks the reader to observe, real, and marked. |
| 82 | Figures `conc3_child_is_active`, `conc3_out_of_descriptors`, `conc3_too_many_fds_exc` | shown | As the drawing and the captured output. |

## G. Zombies

| # | Statement | | Why |
|---|---|---|---|
| 83 | "your server code actually creates zombies" | shown | The crosses left on screen. |
| 84 | `ps auxw` output with status `Z+` and `<defunct>` | shown | With our real `/proc` states, at the real times they appeared. |
| 85 | "A zombie is a process that has terminated, but its parent has not waited for it and has not received its termination status yet" | shown | The definition of the cross, given where the first one appears. |
| 86 | "the kernel … stores some information about the process for its parent to retrieve later … the process ID, the termination status, and the resource usage" | shown | In the same door: why the cross is still drawn rather than simply gone. |
| 87 | "The problem with zombies is that you can't kill them" / `kill -9` survives | shown | In the door, and it is why the reader cannot make a cross disappear by clicking it — only the reaping step removes one. |
| 88 | `ulimit -u 400`, 500 clients, `OSError: Resource temporarily unavailable` | **unverified** | Whether a process limit can be lowered and hit inside this container has not been tested. If it cannot, that is reported as a limit of the capture, not simulated. |
| 89 | "Zombies need to eat something and, in our case, it's memory" | shown | Paraphrased honestly: a zombie holds a process-table entry, which is the resource that runs out. |
| 90 | Third checkpoint: the five-bullet recap | shown | As #52. |
| 91 | Figures `conc3_zombies`, `conc3_kill_zombie`, `conc3_resource_unavailable` | shown | As the drawing. |

## H. Reaping: `webserver3e.py`, `3f`, `3g`

| # | Statement | | Why |
|---|---|---|---|
| 92 | "if you call `wait` and there is no terminated child process the call to `wait` will block your server" | shown | The article states this as the reason *not* to call `wait` in the main loop — and then calls it in the signal handler, where the same hazard exists. See #103. |
| 93 | "When a child process exits, the kernel sends a `SIGCHLD` signal" | shown | The grey disc travelling up the parent-child line. |
| 94 | "The parent process can set up a signal handler to be asynchronously notified" (figs. `conc4_signaling`, `conc4_sigchld_async`) | shown | The step. |
| 95 | "an asynchronous event means that the parent process doesn't know ahead of time that the event is going to happen" | shown | In the door. |
| 96 | `signal.signal(signal.SIGCHLD, grim_reaper)` | shown | The step that makes the parent able to reap at all. |
| 97 | `grim_reaper`: `pid, status = os.wait()` and its `print` | shown | Real reaped PIDs and statuses from the capture. |
| 98 | "The call to `accept` failed with the error EINTR" (figs. `conc4_eintr`, `conc4_eintr_error`, `conc4_eintr_accept`) | **unverified at time of writing** | The article's claim is for Python 2.7/3.4. PEP 475 changed this in Python 3.5. Whether `webserver3e.py` ever raises `EINTR` on the Python that really ran is a question the capture answers, and it is answered either way — including if the answer embarrasses the drawing. |
| 99 | `webserver3f.py`: `except IOError as e: … if code == errno.EINTR: continue` | shown | Shown, with whatever the capture says about whether it ever fires. |
| 100 | `webserver3f.py` also changes `REQUEST_QUEUE_SIZE` from 5 to 1024 | shown | **The article does not mention this**, and it changes two things at once. Which of the two accounts for the difference is a question, and it is settled by running one-line variants of each — reported as numbers, never drawn. |
| 101 | Fourth checkpoint: the three-bullet recap | shown | As #52. |
| 102 | "the child processes … exited almost at the same time causing a flood of `SIGCHLD` signals … the signals are not queued and your server process missed several signals" (fig. `conc5_signals_not_queued`) | **unverified** | The article's mechanism for why zombies come back at 128 clients. Whether *this* is what our capture shows, or something else, is not decided in advance. |
| 103 | `webserver3g.py`: `while True: … os.waitpid(-1, os.WNOHANG) … except OSError: return … if pid == 0: return` | shown | The fix, line by line, and the last step of the article. |
| 104 | "Do not block and return EWOULDBLOCK error" (the article's own comment on `WNOHANG`) | shown | Quoted in the door. It is also inaccurate — `waitpid` with `WNOHANG` returns `(0, 0)`, it does not raise `EWOULDBLOCK` — and the article's own next line, `if pid == 0`, is written against the true behaviour. Noted where the reader meets it. |
| 105 | "verify that there are no more zombies" | shown | Verified, by measurement, at every client count. |

## I. Closing material

| # | Statement | | Why |
|---|---|---|---|
| 106 | "I'll leave it as an exercise for you to update the WSGI server from Part 2 and make it concurrent" | shown | It is the link back to the part 2 page, and the only place the three articles join. |
| 107 | The link to the author's own concurrent WSGI server | omitted | Code we have not run. Naming it without running it is what #100 exists to avoid. |
| 108 | The five recommended books | omitted from the drawing | They become **references** under `CONTEXT.md`, used to check claims; not things drawn. |
| 109 | Piaget, Josh Billings and Emerson epigraphs; fig. `dig_deeper` | omitted | Framing, not mechanism. |
| 110 | "All source code from the article is available on GitHub" | omitted | Sourcing note. |
| 111 | Footnote 1 (Stevens, *Unix Network Programming*) backing #25 and #30 | shown | Carried as the citation on those quotes. |
| 112 | Footnote 2 (*The Little Book of SEMAPHORES*) backing #69 | shown | As #111. |

---

## Totals at time of writing

112 statements: **91 shown**, **16 omitted with a reason**, **2 departures** (#19 the
shared sleep constant, #81 the recording client), **3 unverified** pending capture (#88
the process-limit experiment, #98 whether EINTR still happens, #102 whether missed
signals are what we actually observe).

## Still open, named rather than buried

- **#98 / #100.** If `EINTR` never fires on Python 3.11, then the article's step from
  `3e` to `3f` fixes nothing on a modern interpreter, and the real difference between
  those two programs is the backlog it changes silently. That is a finding about the
  source, and Principle 1 says a finding is not a licence: it gets said, not smoothed.
- **#102.** Missed signals are one mechanism by which zombies survive. Blocking inside
  `os.wait()` is another, and the article does not mention it. Only the capture can say
  which one we are looking at.

---

## Verification — the inventory checked against what was actually drawn

An inventory written once and never checked is worthless; part 2 proved that by claiming
three groups of items were drawn when they were not. Checked here after `fork.html` was
built.

### Claims that did not survive the build

| item | claimed | was | now |
|---|---|---|---|
| #49 — a client can connect to a busy server, because the kernel queued it | shown | **not drawn.** The first build drew a channel only where a process held a descriptor for it, so the two clients waiting on the iterative server had *no line at all* — the drawing said they were not connected, which is the opposite of what the article spends two paragraphs establishing. | Every established connection is drawn. The value riding it reads **`queued`** until a process accepts it, and **`N holders`** after. The held discs inside the server say which. |
| #77 — the FIN that is never sent | shown | drawn, but the **cross** marking it sat on top of the reference-count label. | Cross moved to the client's end of the channel, where the close would have arrived. |
| #83 / #76 — zombies, and clients left hanging | shown | both **fired a step too early**: any connection not yet closed counted as "still waiting", so every server looked broken mid-exchange, including the ones that are not. | A client is only "still waiting" once its child has gone *and* the parent is still holding a descriptor. Until then the label shows the datum that is actually known: when the reply arrived. |
| #21 — what one client at a time costs | shown | shown, but the metric read the last **reply**, not the last **release** — which flattered `webserver3d.py`, the one server where nothing is ever released, into a 3 ms result. | The metric is `LAST CLIENT RELEASED`, and it reads **`never`** when nothing was. |

### Resolved by capture

| # | was | is |
|---|---|---|
| #98 | unverified: does `accept()` still fail with `EINTR`? | **No.** Across **109 runs** of all six servers on Python 3.11.15, including `webserver3e.py`, which has no guard, and with up to 128 children exiting at once: not one `EINTR` and not one crash. [PEP 475](https://peps.python.org/pep-0475/) (Final, Python 3.5) retries interrupted system calls inside the wrapper, and names `socket.accept()` among them. The article was written in May 2015 and tested on 2.7.9 and 3.4; Python changed four months later. |
| #100 | unverified: which of the two changes between 3e and 3f matters? | **Neither.** One-line variants were run: `3e` with 3f's backlog of 1024 left 2–4 zombies at 128 clients; `3f` with 3e's backlog of 5 left 5–8. Both leak, because both call `os.wait()` once per signal. The fix that matters is the next one the article makes, and that one is right. |
| #102 | unverified: are missed signals what we actually see? | **Consistent with it.** `webserver3e`/`3f` leak 1–6 zombies at 32 and 128 clients and none at 1–3; `webserver3g`, whose handler loops, leaks none at any size. A **second** hazard the article does not mention was also seen once and did not repeat: `os.wait()` blocks when there is nothing to collect, and one run of `3e` at 128 clients stalled at 107 served. It is stated on the page as a hazard in the code, not as a measured effect. |
| #88 | unverified: can the process limit be reached in this container? | **Not attempted.** The file-descriptor limit was, and it reproduced the article's figure exactly: `webserver3d.py` under `RLIMIT_NOFILE=64` accepted 60 connections and then died with `OSError: [Errno 24] Too many open files`. It is the only traceback in the entire capture. The process-limit experiment stays **unverified** and is not claimed anywhere on the page. |

### A second verification pass, after the page was rebuilt as a story

The first build presented the six servers as a set of options to compare, which assumes
the reader has already read the article and knows why those six exist. They do not exist
as options; they exist because each one broke and the next one fixed it. Rebuilding the
page around that arc turned up a further class of drift — **claims that were written, and
that no reader could reach.**

| item | claimed | was | now |
|---|---|---|---|
| #24, #42, #85, #98 — the Branches on sockets, descriptors, zombies and EINTR | shown | **written but unreachable.** Three of the five Branches had no link anywhere on the page; `EINTR` was reachable only through a door nothing linked to. A fourth link pointed at a Branch that does not exist, so clicking it did nothing at all. | Every Branch is linked where the reader first meets the idea, and a check now walks every chapter, step, door and Branch body and fails if any link does not resolve. |
| #37, #42 — process and file descriptor | shown | reachable **only if the reader had ticked that term in the briefing.** A Branch is opt-in by definition; gating the link as well as the wording meant a confident reader could never go deeper. | `isNew()` chooses the wording. The link is always there. |
| #94 — SIGCHLD | shown | the briefing offered "Signal and `SIGCHLD`" as a box to tick, and ticking it led nowhere. | Linked at the step where the signal is sent. |
| #3, #48 — `REQUEST_QUEUE_SIZE` as the six servers' own labels | shown | the knobs read `3b iterative`, `3d no close`. Those are filenames from an article the reader may not have read. | Each knob says what the program **does** — *one at a time*, *fork a child*, *…and never let go* — with the article's own `3b`/`3d` tag alongside, per Principle 3. |

Four term doors (`termprocess`, `termfd`, `termzombie`, `termbacklog`) were **deleted**: the
Branches now say more, and unlinked code that renders nothing is exactly how the Branches
became unreachable in the first place.

### Two findings taken off the page

The page carried three places where the article's claims do not match what the code does.
Two are now recorded here only, on the judgement that a page which stops three times to
correct a tutorial costs a reader more trust in the tutorial than the corrections are
worth. Both remain true, and both are backed by the capture:

| # | finding | why it is here and not on the page |
|---|---|---|
| #100 | The step from `webserver3e.py` to `webserver3f.py` changes `REQUEST_QUEUE_SIZE` from 5 to 1024 as well as adding the `EINTR` retry, and never says so. One-line variants of each were run: `3e` with 3f's backlog left 2–4 zombies at 128 clients, `3f` with 3e's backlog left 5–8. Neither change is what matters — both leak, because both collect one child per signal. | It is a finding about **method**, not about anything the reader is about to type. Knowing it changes nothing they would do. |
| #104 | The article's comment on `WNOHANG` says it will *"return EWOULDBLOCK error"*. It returns `(0, 0)` — which is what its own next line, `if pid == 0`, is written to catch. The code is right; only the comment is wrong. | A wrong comment beside correct code costs the reader nothing. |

**#98, the `EINTR` finding, stays on the page**, because it is the one that costs a reader
real time: the article tells them to expect a crash, they will not see one, and they will
assume they typed it in wrong. It is reached from the last chapter, where the reader meets
the two nearly-identical servers in the grid and would otherwise ask why both are there.

### A departure the first inventory did not contain

| # | Statement | | Why |
|---|---|---|---|
| 114 | The page is **seven chapters**, not six servers on a shelf | **departed** | The article is one problem and four bugs hit while fixing it; presented as a set of options, that arc is gone and only a reader who already read the article knows why the six programs exist. The chapters follow the article's own order and its own demonstrations, and each ends on the thing that makes the next one necessary. Both knobs stay, one click away, for a reader who would rather roam. ADR 0002: checked against the article's structure, real — every chapter is a captured run — and marked, in that the path and the free knobs are both offered on screen. |
| 113 | Only **1, 2 and 3** clients are drawn; 8, 32 and 128 were run but appear only on the rung above | **departed** | The article's sharpest demonstrations use 128 and 300 clients. A hundred and twenty-eight circles is not a drawing, and faking it with "and 125 more" would be a picture that lies about what it shows. So the crowd knob is drawn where it can be drawn, and abstracted where it cannot — with every cell of the grid stepping back down to what really happened in that run, which is what MISSION principle 5 requires of any Rung above the ground. Marked on the page, next to the knob and under the grid. |

## Totals, revised

114 statements: **89 shown on the page**, **16 omitted with a reason**, **4 departures**
(#19 the shared sleep constant, #81 the recording client, #113 the undrawable crowd sizes,
#114 the chapter structure), **1 still unverified** (#88, the process limit), **3 resolved
by capture** (#98, #100, #102), and **2 resolved by capture but deliberately kept off the
page** (#100, #104) for the reason given above.
