# Teaching × Motion: a two-library experiment

Branch: `codex/teaching-animation-libraries`.

Open `http://127.0.0.1:8766/experiment/web/` while the server below runs. The browser includes two five-step lessons, four teaching cards, three independent animation demos, and an inspectable selection manifest.

## Run

From this worktree’s root:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

No package installation, model key, or build server is needed. The checked-in recordings and generated browser data make this version reproducible.

## What the libraries contain

`library/teaching/*.json` holds learner starting/ending states, explanation sequences, examples, source links, observations, interpretations, pitfalls, and comprehension checks. These cards contain no renderer names.

`library/animation/*.json` holds visual capabilities, input contracts, renderer names, source evidence, and limits. Implementations live in `experiment/web/animations.js`. The very same functions render the library demos and lessons.

The teaching source collection is deliberately small: Grant Sanderson’s published advice and derivative lesson. Animation references include Bret Victor’s interactive essay and Manim’s numeric animation driver. Cards explicitly distinguish what those sources show from the patterns authored here. This is not a representative survey or a learned model of those creators.

## How generation happened

1. Write a learner brief under `experiment/briefs`.
2. Run `python3 experiment/pipeline.py prepare`. It ranks teaching cards by overlapping tags and saves the teaching context under `experiment/runs`. The agent reads this before authoring a lesson.
3. The coding agent authors a plan under `experiment/plans`: problem, prerequisite order, explanation, prediction, and needed visual capabilities. Plans cannot name renderers.
4. Run `python3 experiment/pipeline.py`. It validates the plan, selects compatible animation cards, writes the selection manifest, and builds the browser data file.
5. A lesson-specific adapter in `app.js` supplies real trace data to the selected components and synchronizes the controls and explanatory captions.
6. Review teaching, animation, and their alignment separately. Improve the relevant card or its application, then regenerate.

The assembly and selection are deterministic. The agent authoring and source interpretation are not automated by this script. Two lesson-specific adapters are authored; arbitrary new topics will still need an adapter. There are no model API calls, weight updates, or fine-tuning. This tests an inspectable reference-library workflow before investing in broader automation.

## Reproduce the evidence

```sh
python3 experiment/capture.py
python3 experiment/pipeline.py
python3 -m unittest discover -s experiment/tests -v
node --check experiment/web/app.js
node --check experiment/web/animations.js
```

Capture requires a Unix machine with `os.fork`. It launches temporary local serial/forked servers, records answer and EOF events for two clients at three arrival times, and reaps child processes. The artificial delay is 0.6 seconds, shortened from the article’s 60. Re-running changes exact measured timings. Search traces count inspected values, not runtime.

See `INVENTORY.md` for retained concepts and simplifications and `TESTING.md` for the verification report.

## What to review

Try the server lesson first without its source article. Can you explain why a larger queue does not remove B’s wait? Then try the search lesson and target 1. Can you explain why the supposedly faster method loses that case?

Assess the explanation, the motion, and whether they support each other. Passing technical tests does not show that a beginner learned successfully. A future evaluation should compare this against the earlier prototype with the same learning objective and independent readers; that comparison has not been performed.
