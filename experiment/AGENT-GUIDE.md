# Guide for the next experiment

## Start here

The current default is the shorter connected intuition variation; read [CONNECTED-INTUITION.md](CONNECTED-INTUITION.md) for its research, visual contract, and files. Its source is `web/intuition-plan.js`, `web/intuition.js`, and `web/intuition.css`. The previous detailed course is accessible at `?guide=detailed#lessons`.

This folder is the active learning prototype: a full Part 3 server lesson, a search lesson, reference libraries, and comparison demos. Use `experiment/web/`, not the older `prototype/part3/` implementation.

The shared baseline is on `codex/astra_prototype`. Check your current branch and working tree before editing; use a separate experiment branch when comparing alternatives. Do not assume another agent's localhost server is serving your checkout.

From the repository root:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open `http://127.0.0.1:8766/experiment/web/#lessons`. Use `#studies` for the A04–A06 comparisons. No package installation or API key is needed. If port 8766 is already in use, reuse the server only if it serves this checkout, or choose another port. The course remembers its last step in browser storage; use the chapter menu to navigate.

## Where to change things

| Goal | Source |
| --- | --- |
| Change teaching order, prerequisites, questions, or Wink's words | `plans/server.json` (or `plans/search.json`) |
| Change course controls, pacing, or Wink positioning | `web/part3.js` |
| Change the current A04–A06 course diagrams | `web/course-motion.js` |
| Change technical state and evidence-to-scene mapping | `web/part3-models.js` |
| Change overview maps and their progress mapping | `web/course-overview.js` |
| Change standalone motion comparisons | `web/motion-studies.js` |
| Change layout and visual styling | `web/style.css` |
| Change reference cards | `../library/teaching/` and `../library/animation/` |

`web/animations.js` implements A01–A03. `web/part3-renderers.js` retains the old A04–A06 cards for gallery/comparison views; editing it will not change the current course motion diagrams. `web/app.js` handles navigation, galleries, and the search lesson.

`web/data.js` and `runs/selection-manifest.json` are generated. After editing plans, cards, recorded inputs, or `complete_server.py`, run from the repository root:

```sh
python3 experiment/pipeline.py
```

Do not hand-edit generated data. JavaScript/CSS-only edits need no build. Refresh the page; if cached assets persist, update the affected asset's version query in `web/index.html`.

## How to experiment

1. State the learner problem and one change to test. Keep teaching decisions separate from animation choices: plans request visual capabilities, not renderer names.
2. Assume the reader has not read the article. Establish the problem and explain new terms before relying on them.
3. Preserve the accepted guidance: overview first, compact synchronized map during details, Wink beside the actual focus, and additional prose inside Wink. The course pauses for six seconds; standalone studies currently pause for ten.
4. Make motion explain the system at a glance. Avoid replacing diagrams with prose in boxes. Preserve distinctions such as reply versus EOF, handle versus socket, and running child versus exit record.
5. Check the affected sequence from its overview through its result. Verify play/pause, stepping, scrubbing, restart, overview reopening, and Wink disclosure. Inspect desktop and 390px mobile layouts for covered objects, unreadable labels, and overflow.

Keep recorded evidence unless intentionally rerunning a probe. `capture.py` and `probe_part3.py` launch local processes and change measured recordings; ordinary visual experiments do not need them.

## Verify and hand off

Run the checks relevant to your changes; the available suite is:

```sh
python3 -m unittest discover -s experiment/tests -p 'test_*.py'
node experiment/tests/test_models.cjs
node experiment/tests/test_motion.cjs
node experiment/tests/test_course_guide.cjs
node experiment/tests/test_overview.cjs
node experiment/tests/test_intuition.cjs
git diff --check
```

Passing tests does not establish teaching quality. Record what changed, which learner question it addresses, what you inspected, and what still needs reader feedback. Include the branch/commit, preview route, and whether it was pushed when handing off.

For context, read `PART3-COVERAGE.md` (technical coverage), `MOTION-STUDIES.md` (visual sources), `OVERVIEW-MAPS.md` (chapter mapping), and `TESTING.md` (verification history).
