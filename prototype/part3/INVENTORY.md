# Part 3 inventory

Primary Source: Ruslan Spivak, [Let's Build A Web Server, Part 3](https://ruslanspivak.com/lsbaws-part3/).

This inventory precedes the drawing. Part 3 is much longer than Parts 1 and 2, so the
first prototype groups statements by the mechanism they support. Each code family and
named concept still lands in one of the three required buckets.

## Drawing under test

Four ideas are revealed in order:

1. An iterative server leaves a second request waiting while it finishes the first.
2. `fork()` gives each accepted request a child process while the parent returns to
   `accept()`.
3. Parent and child inherit references to the same sockets; both duplicate descriptors
   must be closed for the connection to finish.
4. An exited child remains recorded until its parent waits for it; a `SIGCHLD` handler
   using `waitpid(..., WNOHANG)` collects every finished child without blocking.

The independent variable remains the article's named step. Each idea has its own drawing.

## A. Iterative server and the waiting client

| Source statement | Classification | Treatment |
|---|---|---|
| The Part 1/2 server handles one request at a time. | shown | Two requests arrive close together; request B remains at the listening server while request A is handled. |
| A new connection is not accepted until the current request finishes. | shown | The accept step for B follows the end of A's sleep and the close of A's connection. |
| `time.sleep(60)` blocks the server process. | shown | A static arc marks the process as occupied; Wink and the caption name the 60-second sleep. Playback uses illustrative reading time, not a measured clock. |
| The first curl responds immediately, then remains open during the sleep. | shown | A response travels back before A's connection closes. |
| The second curl connects but has no immediate output. | shown | B waits in the kernel's incoming connection queue. |
| Processing is sequential/iterative. | shown | The first chapter uses plain wording first and introduces the source term at the point of need. |
| Full `webserver3a.py` and `webserver3b.py` listings. | omitted | Only the lines causing the visible transition are shown in the code lens; unchanged setup was already covered in Parts 1 and 2. |
| Terminal commands and screenshots for the two curls. | omitted | The interactive drawing performs the same comparison directly. The original article remains available from the source door. |

## B. Socket foundations

| Source statement | Classification | Treatment |
|---|---|---|
| A socket is a communication endpoint represented by a file descriptor. | shown later | Defined at the first descriptor copy, not on entry. |
| A TCP connection is uniquely identified by local/foreign IP addresses and ports. | omitted | Correct background, but not needed to understand the concurrency mechanism. Available through the primary-source link. |
| Server sequence: socket, options, bind, listen, accept. | shown selectively | `listen`/queue and `accept` appear because they decide whether B waits. Earlier setup steps are omitted as Part 1 material. |
| Client sequence: socket, connect, send, receive. | shown selectively | Request and response travel are drawn; setup calls are omitted as already established. |
| Ephemeral and well-known ports. | omitted | They do not change the outcome of any Part 3 mechanism in this prototype. |
| BACKLOG is a kernel queue for incoming connections. | shown | The waiting position for request B is named and has an in-place explanation. |
| Increasing BACKLOG does not make a server concurrent. | shown | The queue explicitly holds rather than processes B. |

## C. Processes and file descriptors

| Source statement | Classification | Treatment |
|---|---|---|
| A process is an instance of a running program and has a PID. | shown when needed | Parent and child are introduced as running copies; PID is available behind their labels. |
| Every user process has a parent and PPID. | shown when needed | The fork chapter names the parent/child relation. Shell ancestry is omitted. |
| File descriptors are non-negative integers used by the kernel to identify open files and sockets. | shown | Descriptor tokens appear only in chapter 3, with an in-place explanation. |
| Standard input/output/error use descriptors 0, 1 and 2. | omitted | Accurate foundation but unrelated to the socket lifetime being visualized. |
| Python exposes a socket descriptor through `fileno()`. | omitted | API detail not required by the mechanism. |
| `ps`, `getpid`, `getppid`, `fileno`, and `os.write` demonstrations. | omitted | Supporting exercises whose outcomes do not change the model. |

## D. Fork-per-connection concurrency

| Source statement | Classification | Treatment |
|---|---|---|
| The simplest concurrent Unix server in the article uses `fork()`. | shown | Chapter 2 is the direct contrast with chapter 1. |
| `fork()` is called once and returns twice. | shown | One parent place becomes a parent plus child place; return values are labelled `child PID` and `0`. |
| Each child handles one request independently while the parent accepts another. | shown | Requests A and B occupy separate children at the same step. |
| The parent accepts, forks, and loops; it does not handle requests. | shown | Parent work is represented only around accept/fork, never around request handling. |
| Parent and child receive copies of the same file descriptors. | shown | Chapter 3 begins at the copied descriptor state. |
| Child closes its listening-socket copy and parent closes its connected-socket copy. | shown | Each close is a named step. |
| Full `webserver3c.py` listing and shell exercises. | omitted | The active code lens shows the changing lines; the drawing exposes the runtime effect. |
| Strict definition of concurrent events. | shown as a branch | Introduced only after both children are visibly active. |

## E. Duplicate descriptors

| Source statement | Classification | Treatment |
|---|---|---|
| The kernel closes a socket only when its descriptor reference count reaches zero. | shown | The count visibly moves 2 to 1 to 0. |
| If the parent keeps its copy, child close leaves the count at 1 and curl hangs. | shown | A "leave parent copy open" comparison stops at count 1 and no FIN. |
| Leaked descriptors eventually exhaust the process limit. | shown as a later consequence | Revealed after the single-connection mechanism is understood, not animated as hundreds of connections. |
| The article's `ulimit`, 300-client test, exception screenshot, and full `webserver3d.py`. | omitted | Scale evidence rather than a new mechanism. The source door links to the original article. |

## F. Exited children and reaping

| Source statement | Classification | Treatment |
|---|---|---|
| An exited child whose parent has not waited becomes a zombie. | shown | The child location persists with an exited label and held exit record; collection replaces that held record with absence. |
| The kernel keeps PID, termination status, and resource usage for the parent. | shown | Those three retained facts are listed in the in-place explanation. |
| A zombie cannot be killed; the parent must wait for it. | shown | `wait` removes the retained record rather than "killing" it. |
| Uncollected zombies can exhaust the process limit. | shown as a later consequence | Revealed after the one-child mechanism. |
| Plain `wait()` can block when no child has finished. | shown | The cleanup comparison explains why it cannot run in the main accept loop. |
| Child exit sends asynchronous `SIGCHLD` to the parent. | shown | A labelled notice connects the selected exits to the parent; delivery count is explicitly a possible scenario. |
| A handler can call `wait()` to collect termination status. | shown | First cleanup strategy. |
| The article's `accept()`/`EINTR` recovery is needed on its tested Python versions. | omitted and marked historical | Modern Python retries interrupted system calls under PEP 475; this is a dated behavior, not drawn as current behavior. |
| Signals are not queued, so one `wait()` can miss children exiting together. | shown | A load control increases simultaneous exits; one notification can represent several completed children. |
| `waitpid(-1, WNOHANG)` in a loop collects every finished child without blocking. | shown | Final cleanup strategy and final chapter state. |
| Full `webserver3e.py`, `3f.py`, `3g.py`, shell exercises, and screenshots. | omitted | Active lines appear in the code lens; the source door links to the original article. |
| Updating the WSGI server is left as an exercise. | omitted | The prototype explains the Part 3 mechanism itself, not the onward exercise. |

## Departures

- **Playback time is compressed.** The article's 60-second sleeps are represented in a
  few seconds so the sequence can be inspected. The label always says 60 seconds.
- **Request names A and B are added.** They distinguish two real roles in the article's
  two-curl experiment; they do not change behavior.
- **Modern Python behavior is used.** The old `EINTR` failure is not presented as a live
  current failure. It remains available as historical source context.


## Standalone guidance revision

The existing draft is revised in place. The entry now explains requests and responses
without assuming Parts 1 or 2. Wink introduces each problem and narrates each named
state above its drawing; an explicit next-step action leads through the whole sequence.
Technical code and source context remain optional. No required explanation is hidden
behind a vocabulary door. The descriptor scene separates the listening socket from
A's connected socket. Response arrival and connection closure are separate steps.
Reaping draws each of 1–8 records and removes only the records actually collected.

Evidence is labelled in the page: these are authored, citation-backed states, not a
live server or a measured timing trace. The signal comparison selects a possible case
where several exits share one pending notification; it does not predict every schedule.
The historical EINTR issue is explained behind the source door using PEP 475.

## Reference introduction revision

The third idea now starts from the client remaining connected after its worker exits.
It rewinds to one accepted connection, introduces a numbered process entry pointing
to that socket, names that link a reference and its number a file descriptor, then
shows fork copying the entry. The number 4 is explicitly illustrative, not a captured
value. The listening socket enters only after this one-socket example; cleanup controls
appear at step 6. The section has nine steps and the walkthrough now has 32 total.
