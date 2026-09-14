# Full Part 3 — teaching inventory before visualization

The original five-step waiting lesson becomes the opening of a complete course. The search lesson remains as a second-domain test. Plans must be written before animation components are selected.

| Chapter | Question the reader can answer | Article coverage | Evidence |
|---|---|---|---|
| 1. Why the second person waits | Why does extra queue space not make work overlap? | Iterative server, send/sleep/close, backlog | Existing real TCP captures |
| 2. Connect two programs | How can one address serve two connections? | socket/bind/listen/accept, options, client connect, endpoints, ephemeral ports, request/response | Real local endpoint capture; socket API documentation |
| 3. Give each request a worker | What changes when a program forks? | Process, PID/PPID, descriptors 0/1/2, fileno, fork's two return values, inherited descriptors, parent/child roles, concurrency | Fork/descriptor probe and TCP captures |
| 4. Close what you do not use | Why can the client still wait after its worker exits? | Separate descriptor tables, shared socket, last close, FIN, leaked descriptors, open-file limits | Real retained TCP handle + EOF probe; isolated file-limit probe |
| 5. Collect the finished work | Why does an exited child still appear in ps? | Zombie exit records, wait/reaping, blocked wait, process resources, SIGCHLD | Three real exited children; recorded process status and waitpid results |
| 6. Resume after an interruption | What happens if a signal arrives during accept? | EINTR/retry in the historical server, Python 3.5+ behavior | Current Python accept probe; PEP 475; historical path labeled reconstruction |
| 7. Handle a burst of exits | Why is one cleanup per signal insufficient? | Coalesced standard signals, waitpid(-1,WNOHANG) loop, pid=0 vs ECHILD | Block SIGCHLD around three real exits, unblock, reap once, drain remainder |
| 8. Put the server together | Can you explain each line's responsibility? | Final corrected loop, verification, WSGI extension exercise | Runnable modern Python server, concurrent client smoke test |

Use four existing teaching cards: familiar situation, limitation first, prediction with explanation, concrete idea before term. Each chapter begins with a reason to need the next idea. The term “reference” appears only after two numbered entries are visibly shown pointing to one socket. “Zombie” follows a finished child and the leftover status record. A signal is first described as a notification, then named.

Visuals are recorded cases or labeled explanatory reconstructions; they do not claim their illustrated scheduling, descriptor numbers, or tiny capacities are universal. Reference-count diagrams collapse descriptor→open-file-description→socket into one arrow; that simplification is labeled in place. Closing the last server handle permits EOF after queued response bytes in these demos; this is not a model of the complete TCP state machine or shutdown/half-close.

Resource exhaustion is only executed inside a subprocess with a small file-descriptor limit. Do not change the user's shell limits or exhaust system processes. Process exhaustion is a bounded illustrative capacity model of unreaped records, explicitly marked; the real probe uses only three children.

The final code is a learning server for Unix, not a production HTTP implementation. It reads through the request header terminator and sends a small close-delimited response. It handles ordinary cleanup and SIGCHLD races. Python 3.5+ retries accept after a returning signal handler; keep historical EINTR teaching separate from measured modern behavior. WNOHANG returns pid=0 when children exist but none are ready, and ECHILD/ChildProcessError when none remain; it does not report EWOULDBLOCK in this situation.
