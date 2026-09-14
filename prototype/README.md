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

Rebuild after editing the template:

```
cd prototype/part1
python3 -c "import json;d=json.load(open('pages.json'));open('ask.html','w').write(open('ask.template.html').read().replace('/*__DATA__*/ null', json.dumps(d,separators=(',',':'))))"
```

## Still open

| File | Question under test |
|---|---|
| `part3/part3.html` | Can Part 3's concurrency mechanism unfold in four ideas without making a new reader carry its operating-system vocabulary all at once? |
| `part3/part3.template.html` | Layout source for Part 3; `part3.js` supplies Wink’s guided steps and the Model. |
| `part3/INVENTORY.md` | Every Part 3 mechanism classified before the drawing was made. |

Rebuild the Part 3 prototype after changing its template or source map:

```
python3 prototype/part3/build.py
```

## Settled and deleted

| What it was | What it settled |
|---|---|
| `views.html` + `capture/` | Outcome grid vs. single-run player, over real fork/zombie captures from [part 3](https://ruslanspivak.com/lsbaws-part3/). Neither: both visualized measurements rather than the mechanism. Also found that the article's `EINTR` fix is dead code on modern Python. |
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

### Part 3: standalone guided walkthrough

Open `part3/part3.html`. Wink explains the situation before the diagram, then leads
through 32 named states across four ideas. The main line assumes no prior article
reading. Code, terminology doors, and comprehension questions are optional.

- Edit `part3/part3.template.html` for layout, `part3/part3.js` for the authored Model
  and guidance; `part3/build.py` embeds both data and script in the standalone HTML.
- Build with `python3 prototype/part3/build.py`.
- Serve locally with `python3 -m http.server 8765 --bind 127.0.0.1`, then visit
  `http://127.0.0.1:8765/prototype/part3/part3.html`.
- Next/Back and the step slider show completed states. Play advances with reading
  time and illustrative message travel; it pauses for doors and stops at each idea's
  end. Reduced motion removes message interpolation.
- The missing parent close and three collection strategies are inspectable comparisons.
  The child-count parameter covers 1–8; one/all collection visibly changes the records.
- Evidence is citation-backed, explicitly labelled, with no claims of live captures.

The previous Part 3 inventory remains as source coverage history; its original
vocabulary-checklist entry and automatic looping motion are superseded by this revision.
See ADR 0005 and MISSION.md's standalone-guidance principle.
