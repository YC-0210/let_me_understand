# Teaching × Motion: a two-library experiment

Branch: `codex/teaching-animation-libraries`.

Open `http://127.0.0.1:8766/experiment/web/` while the server below runs. The browser includes a complete Part 3 course (8 chapters, 31 guided steps), a five-step search lesson, four teaching cards, six independent animation demos, and an inspectable selection manifest.

## Run

From this worktree’s root:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

No package installation, model key, or build server is needed. The checked-in recordings and generated browser data make this version reproducible.

## What the libraries contain

`library/teaching/*.json` holds learner starting/ending states, explanation sequences, examples, source links, observations, interpretations, pitfalls, and comprehension checks. These cards contain no renderer names.

`library/animation/*.json` holds visual capabilities, input contracts, renderer names, source evidence, and limits. Implementations live in `experiment/web/animations.js` and `experiment/web/part3-renderers.js`. The very same functions render the library demos and lessons.

The teaching source collection is deliberately small: Grant Sanderson’s published advice and derivative lesson. Animation references include Bret Victor’s interactive essay and Manim’s numeric animation driver. Cards explicitly distinguish what those sources show from the patterns authored here. This is not a representative survey or a learned model of those creators.

## How generation happened

1. Write a learner brief under `experiment/briefs`.
2. Run `python3 experiment/pipeline.py prepare`. It ranks teaching cards by overlapping tags and saves the teaching context under `experiment/runs`. The agent reads this before authoring a lesson.
3. The coding agent authors a plan under `experiment/plans`: problem, prerequisite order, explanation, prediction, and needed visual capabilities. Plans cannot name renderers.
4. Run `python3 experiment/pipeline.py`. It validates the plan, selects compatible animation cards, writes the selection manifest, and builds the browser data file.
5. Lesson-specific adapters in `app.js`, `part3.js`, and `part3-models.js` supplies real trace data to the selected components and synchronizes the controls and explanatory captions.
6. Review teaching, animation, and their alignment separately. Improve the relevant card or its application, then regenerate.

The assembly and selection are deterministic. The agent authoring and source interpretation are not automated by this script. Two lesson-specific adapters are authored; arbitrary new topics will still need an adapter. There are no model API calls, weight updates, or fine-tuning. This tests an inspectable reference-library workflow before investing in broader automation.

## Reproduce the evidence

```sh
python3 experiment/capture.py
python3 experiment/probe_part3.py
python3 experiment/pipeline.py
python3 -m unittest discover -s experiment/tests -v
node --check experiment/web/app.js
node --check experiment/web/animations.js
node experiment/tests/test_models.cjs
```

Capture requires a Unix machine with `os.fork`. It launches temporary local serial/forked servers, records answer and EOF events for two clients at three arrival times, and reaps child processes. The artificial delay is 0.6 seconds, shortened from the article’s 60. Re-running changes exact measured timings. Search traces count inspected values, not runtime.

See `PART3-COVERAGE.md` for the complete article map and simplifications (`INVENTORY.md` preserves the original experiment) and `TESTING.md` for the verification report.

## What to review

Try the server lesson first without its source article. Can you explain why a larger queue does not remove B’s wait? Then try the search lesson and target 1. Can you explain why the supposedly faster method loses that case?

Assess the explanation, the motion, and whether they support each other. Passing technical tests does not show that a beginner learned successfully. A future evaluation should compare this against the earlier prototype with the same learning objective and independent readers; that comparison has not been performed.

## Complete Part 3

The course now covers sockets and endpoint pairs, server/client setup, file descriptors, fork and process IDs, shared socket handles, descriptor exhaustion, zombie records, blocking wait, SIGCHLD, historical EINTR and modern retries, signal coalescing, the nonblocking cleanup loop, and the final WSGI transfer exercise.

The new library components show ownership, staged responsibilities, and notification/record counts. They have independent demos in the animation gallery. The full teaching plan still specifies capabilities rather than renderer names.

`probe_part3.py` records six bounded Unix probes: local endpoints, inherited descriptors/EOF, isolated descriptor-limit exhaustion, three-child SIGCHLD coalescing and reaping, WNOHANG before a child exits, and current Python accept retry. `runs/part3-evidence.json` records their results. The SIGCHLD burst is made reproducible by temporarily blocking delivery in the isolated probe; the process-status inspection also creates a briefly-lived ps process. All probe children are collected.

`complete_server.py` is an authored runnable modern-Python learning example. It is not a production HTTP server or a complete WSGI implementation. The WSGI section is the article's transfer exercise, with explanatory feedback. The course saves the current step locally in the browser; it does not send learner progress anywhere.

## Wink guides the course

Each teaching step has a concise `wink_cue`. The course shows that cue next to the mascot, then updates it with the current visual moment. Click Wink or “Wink, tell me more” to pause and open the full explanation, code, evidence, and available event history. Diagram labels stay visible; repetitive prose is folded into Wink.

## Motion comparison studies

Open `/experiment/web/#studies` or choose Motion studies. Three guided alternatives to A04–A06 use explicit connecting lines, moving requests and worker progress rings, and disappearing exit records. Each has play/pause, scrubbing, manual stepping, Wink source notes, and an optional original-pattern comparison. The existing course remains available for comparison. See `MOTION-STUDIES.md` for sources and scope.

Wink now moves through authored focus stops. Each stop has a full ten-second hold, with a separate one-second flight to the next. Back, Next step, and a step slider allow manual pacing; pause also freezes the flight clock. Wink docks directly beside the current object inside the diagram. Speech uses the nearest clear space; if the screen is too narrow, only the speech moves below the diagram.


## Spatial guidance in the full course

The original eight-chapter Part 3 course now uses authored focus targets for every visual moment. Wink moves beside the current timeline lane, process, numbered handle, exit record, or code responsibility. A dashed outline identifies the exact target. Speech is placed after its visual row so it cannot cover another object; expanded explanations and code remain available through Wink. Playback holds each moment for six seconds, with a separate transition interval. Manual stepping, scrubbing, restart, prediction questions, and reduced-motion support remain available.
