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

| File | The question |
|---|---|
| `part1/anim.html` | Four motions for the drawing — there-and-back, time running down, dragging the dot, the server opening. Undecided. |

## Settled and deleted

| What it was | What it settled |
|---|---|
| `views.html` + `capture/` | Outcome grid vs. single-run player, over real fork/zombie captures from [part 3](https://ruslanspivak.com/lsbaws-part3/). Neither: both visualized measurements rather than the mechanism. Also found that the article's `EINTR` fix is dead code on modern Python. |
| `three.html` | Bytes vs. sockets vs. code as the subject. None — all were the ground rung with no parameter. |
| `ladder.html`, `ladder2.html` | The ladder of abstraction, rungs 1 and 2. Rung 2 dropped; the page-name parameter did not earn abstraction. |
| `step.html` | How to move between rungs. Side-by-side won, then rung 1 was dropped entirely. |
| `symbols.html` | Whether to use symbols at all. Yes — "the dot travels" became the drawing. |
| `afford.html` | How to signal a mark is clickable. **The word is the door.** |
