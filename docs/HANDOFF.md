# Handoff

Written at the end of the session that built **part 3**. Kept in the repo rather than a
temp directory because this project is worked on from ephemeral containers — nothing
outside git survives.

---

## Read these first, in order

| | |
|---|---|
| [`MISSION.md`](../MISSION.md) | Why the project exists, five principles, who does what |
| [`docs/VISUAL-LANGUAGE.md`](VISUAL-LANGUAGE.md) | **The binding spec.** Eight marks, three colours, grammar, steps, the inventory rule |
| [`CONTEXT.md`](../CONTEXT.md) | Vocabulary. Use these words |
| [`docs/adr/`](adr/) | Five decisions that are hard to reverse |
| [`prototype/README.md`](../prototype/README.md) | What each dead prototype settled, and how to rebuild the live ones |
| [`DESIGN.md`](../DESIGN.md) | Surfaces, type, spacing — from `npx getdesign add linear.app` |

`docs/visual-language.html` is the spec rendered so it can be checked by eye. **It has not
been regenerated since ADR 0004 or ADR 0005** — it is stale on the ring and on places that
begin and end.

## The state of things

All three articles in the series are done.

| | page | built from |
|---|---|---|
| part 1 | `prototype/part1/ask.html` | `ask.template.html` + `pages.json` |
| part 2 | `prototype/part2/mix.html` | `mix.template.html` + `mix.data.json` |
| part 3 | `prototype/part3/fork.html` | `fork.template.html` + `fork.data.json` |

**Never edit a built `.html` directly** — each is template + data. Rebuild commands are in
[`prototype/README.md`](../prototype/README.md).

No prototypes are open. Branch: `claude/focused-mccarthy-xssltc`.

## What part 3 turned out to be

[Let's Build A Web Server, part 3](https://ruslanspivak.com/lsbaws-part3/) — `fork()`,
file descriptors, reference counts, zombies, `SIGCHLD`.

The subject is **not** "how to write a concurrent server". It is: *the same request
handling, six different decisions about what the parent does after forking, and six
different fates for the people asking.* The knobs are the article's own six programs and
the number of clients arriving at once; the readable outcome is how many clients finished,
how many were left hanging, and how many zombies are still on screen.

### What was measured

`prototype/part3/capture.py` runs each of the six servers against 1, 2, 3, 8, 32 and 128
simultaneous clients, three times each, polling `/proc` 400×/s throughout — 109 runs. Every
number on the page is the **median**, and where the runs disagreed the page shows all of
them. The article's claims all reproduced:

- `3c` leaves exactly one zombie per client, up to 128 of them.
- `3d` leaves **every** client hanging — reply delivered, connection never closed — and
  its parent's descriptor count climbs by one per client and never falls.
- `3e`/`3f` leak 1–6 zombies at 32 and 128 clients; `3g` leaks none at any size.
- Under `RLIMIT_NOFILE=64`, `3d` accepted 60 connections and died with
  `OSError: [Errno 24] Too many open files` — the article's figure, live, and the only
  traceback in the whole capture.

### Three findings about the source

Recorded in `prototype/part3/INVENTORY.md` and stated on the page where the reader meets
them:

1. **The `EINTR` fix is dead code.** Zero `EINTR` in 109 runs on Python 3.11.
   [PEP 475](https://peps.python.org/pep-0475/) (Final, Python 3.5) retries interrupted
   system calls inside the wrapper and names `socket.accept()`. The article was written in
   May 2015 and tested on 2.7.9 and 3.4. A reader retyping it today will not see the error
   they are told to expect, and will assume they made a mistake.
2. **`3e → 3f` changes two things, and the article mentions one.**
   `REQUEST_QUEUE_SIZE` goes 5 → 1024 silently. One-line variants of each were run to see
   which mattered: neither. Both leak, because both call `os.wait()` once per signal.
3. **The article's `WNOHANG` comment is wrong** — `waitpid` returns `(0, 0)`, it does not
   raise `EWOULDBLOCK`. The code beside it is right; only the comment is not.

And one hazard the article does not mention: `os.wait()` blocks when there is nothing to
collect — which the article itself gives as the reason not to call it in the main loop, and
then calls it in the signal handler. One run of `3e` at 128 clients stalled at 107 served.
It did not repeat across three runs, so **the page states it as a hazard in the code, not
as a measured effect.** Do not promote it without more runs.

### What the spec had to give

[ADR 0005](adr/0005-places-that-begin-and-end.md). Parts 1 and 2 drew a fixed cast. A
forked child is a place that did not exist a moment ago and will not exist shortly, so:

- a circle persists for as long as its **place** exists, not for the whole scene;
- a **cross** may replace a circle — which is exactly what a zombie is, a process that is
  absent while its position is still taken;
- a place may hold **several** things at rest, drawn at one fixed smaller radius so that
  quantity is number and never size;
- instances of one kind of place stack **vertically**; the kinds still run left to right.

No new mark and no new hue. All eight marks are now in use.

### The ladder, finally earned

Part 1 built rung 1 and **dropped** it — the page-name parameter did not earn abstraction.
Part 3's crowd size does: `3e`, `3f` and `3g` are indistinguishable at 1–3 clients and only
separate at 32 and 128. So the page has a rung above the ground — a six-by-six grid of
outcomes — and it exists because the ground rung cannot show the difference.

An earlier probe (`views.html`, deleted) tried an outcome grid and a single-run player and
rejected both as "visualizing measurements rather than the mechanism". Both are back, and
the reason it works now is that **neither one is the page**: the mechanism drawing is the
page, the grid is the rung above it, and every cell steps back down into the real run
behind it. A measurement you cannot open was the fault, not the measuring.

## Still open

- **Does the real page move out of `prototype/`?** Three finished visualizations now live
  in a folder named throwaway. This was "probably resolve it when part 2 needs a structure
  holding two pages". It is now three. It should probably be resolved.
- **Who opens these?** `MISSION.md` says one reader — you. The user originally said "for
  people". Different projects: one needs nothing, the other needs hosting and drawings that
  stand alone. Still unconfirmed after three pages.
- **Nothing links the three pages together.** Part 3 ends where part 2's exercise begins —
  the article's own closing line is "update the WSGI server from Part 2 and make it
  concurrent" — and there is no way to walk from one page to the next.
- **`docs/visual-language.html` is stale.** Two ADRs behind.
- **#88 in the part 3 inventory is still unverified**: the article's `ulimit -u` /
  max-user-processes experiment was not attempted in this container. It is not claimed
  anywhere on the page.
- **The next Source is not chosen.** MISSION's fourth success criterion — "it works on a
  second article I did not design it around" — is still untested: three articles by one
  author in one series is not that test.

## Decided, don't relitigate

- **Claude writes the code.** The user supplies judgement on what helps someone learn.
- Steps are the independent variable; a slider reaches any of them directly.
- The word is the door. Marks are never buttons.
- Departures are allowed when **checked, real and marked** (ADR 0002).
- Dark canvas only. One accent. Status never by colour alone.
- Capture real, present authored (ADR 0001). If something cannot be run, say so.
- Concurrency is not reproducible, so **report the median of several runs and show the
  spread**, never the best run.

## Suggested skills

- **`domain-modeling`** — if new vocabulary appears. `CONTEXT.md` is a glossary; ADRs go in
  `docs/adr/`.
- **`artifact-design`** — before writing any artifact. `DESIGN.md` and `VISUAL-LANGUAGE.md`
  take precedence over its defaults.
- **`dataviz`** — only if a real chart appears. Its `scripts/validate_palette.js` is
  required by the colour rules before any new hue ships. Part 3 avoided needing it by
  partitioning into regions instead of plotting.
- **`prototype`** — when a design question needs answering rather than arguing.
- **`grilling`** — to stress-test a direction before building.

## How to work with this user

- **One question at a time**, short. Long multi-part questions did not land.
- **Be brief.** Say the thing, stop.
- **Put every decision in one place**, at the very bottom, under the heading
  `Decision for you to make :` — never scattered through the prose.
- **Build to decide.** Every good decision came from seeing options side by side.
- **Render before publishing.** Use the headless Chromium at `/opt/pw-browsers/chromium`
  via Playwright and actually *look* at the page. In this session that caught four things
  structural assertions did not: a label running off the left edge, two labels landing on
  each other, a channel drawn straight through the middle of the parent, and — worst — two
  failure counters firing a step early, so every server looked broken mid-exchange.
- **Say what is untrue or unverified.** The user values this, and it is where most of the
  value in part 3 came from.
