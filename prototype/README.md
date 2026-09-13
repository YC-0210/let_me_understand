# Prototypes

Throwaway code that answered one design question each. What survives here is either
**the real thing** or **a question still open**. Everything settled has been deleted;
the code and its findings are in git history, and the decisions it produced live in
[`../docs/VISUAL-LANGUAGE.md`](../docs/VISUAL-LANGUAGE.md), [`../MISSION.md`](../MISSION.md)
and [`../docs/adr/`](../docs/adr/).

## The real thing

| File | |
|---|---|
| `part1/ask.html` | The visualization for [part 1](https://ruslanspivak.com/lsbaws-part1/). Built from `ask.template.html` plus `pages.json`. |
| `part1/ask.template.html` | Source. The page is `template + data`; edit the template, never the built file. |
| `part1/webserver1.py` | The article's server, copied verbatim. The primary source. |
| `part1/webserver1_pages.py` | The same, with **one marked line added** so the path decides the answer. See ADR 0002. |
| `part1/capture_pages.py` | Runs it under a line tracer and records real replies into `pages.json`. |
| `part1/pages.json` | 30 real page names sent to a real server. 3 answer; 27 return the same 404. |
| `part2/mix.html` | The visualization for [part 2](https://ruslanspivak.com/lsbaws-part2/). Built from `mix.template.html` plus `mix.data.json`. |
| `part2/INVENTORY.md` | Every statement part 2 makes, classified. Written before drawing, checked after. |
| `part3/fork.html` | The visualization for [part 3](https://ruslanspivak.com/lsbaws-part3/). Built from `fork.template.html` plus `fork.data.json`. |
| `part3/webserver3a…3g.py` | The article's six servers, copied verbatim apart from one marked line each. |
| `part3/capture.py` · `client3.py` | Runs every server against 1–128 simultaneous clients and polls `/proc` 400×/s while it does. |
| `part3/reduce.py` | `runs.json` → `fork.data.json`. |
| `part3/INVENTORY.md` | As part 2's. Four claims did not survive the build; they are listed. |

Rebuild after editing a template:

```
cd prototype/part1
python3 -c "import json;d=json.load(open('pages.json'));open('ask.html','w').write(open('ask.template.html').read().replace('/*__DATA__*/ null', json.dumps(d,separators=(',',':'))))"

cd prototype/part3
python3 -c "import json;d=json.load(open('fork.data.json'));open('fork.html','w').write(open('fork.template.html').read().replace('/*__DATA__*/ null', json.dumps(d,separators=(',',':'))))"
```

Re-capture part 3 from scratch (about 12 minutes — the iterative server at 128 clients is
slow on purpose):

```
cd prototype/part3 && python3 capture.py && python3 reduce.py
```

## Still open

- **Where the real pages live.** Three finished visualizations now sit in a folder called
  `prototype/`. Carried over from the part 2 handoff, still unresolved.
- **Who opens these.** `MISSION.md` says one reader. Unconfirmed.

## Settled and deleted

| What it was | What it settled |
|---|---|
| `views.html` + `capture/` | Outcome grid vs. single-run player, over real fork/zombie captures from [part 3](https://ruslanspivak.com/lsbaws-part3/). Neither: both visualized measurements rather than the mechanism. Also found that the article's `EINTR` fix is dead code on modern Python. **Both halves came back in `part3/fork.html`, and the reason they work now is that neither is the page.** The mechanism drawing is the page; the grid is the rung above it, and every cell of it steps back down. A measurement that cannot be opened into the thing it measured was the actual fault, not the measuring. The `EINTR` finding was re-established from scratch, against PEP 475, over 109 runs. |
| `three.html` | Bytes vs. sockets vs. code as the subject. None — all were the ground rung with no parameter. |
| `ladder.html`, `ladder2.html` | The ladder of abstraction, rungs 1 and 2. Rung 2 dropped; the page-name parameter did not earn abstraction. |
| `step.html` | How to move between rungs. Side-by-side won, then rung 1 was dropped entirely. |
| `symbols.html` | Whether to use symbols at all. Yes — "the dot travels" became the drawing. |
| `afford.html` | How to signal a mark is clickable. **The word is the door.** |
| `anim.html` | Four motions for the drawing. **Straight there and back** — the only one that shows the whole exchange without the reader doing anything first. Dragging the dot is more faithful to Victor but opens as a static picture that means nothing until it is discovered, and Pause plus the doors already give control of time. "The server opens" is a second explanation (*why*, not *what*) and carries the lookup-table Departure. |

### Carried forward from `anim.html`

One idea from the time-runs-down motion is worth taking without taking the motion:
**leave the journey on screen when the run finishes.** Today it ends with only the answer
held, and both strokes are gone — so the reader cannot see the whole exchange at once,
which is the thing the project keeps saying matters. Not built.
