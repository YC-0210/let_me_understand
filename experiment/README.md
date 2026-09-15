# Teaching × Motion experiment

Start with [AGENT-GUIDE.md](AGENT-GUIDE.md) and the [library principles](../library/README.md). Current variation: `codex/part3-connected-intuition`.

## Run

From the repository root, run `python3 -m http.server 8766 --bind 127.0.0.1`, then open `/experiment/web/?guide=course#lessons`.

The default is an article companion: six connected parts and 22 visual moments. It recalls Parts 1 and 2, follows the consequences of adding workers, and leaves code mechanics to the article. Read [CONNECTED-INTUITION.md](CONNECTED-INTUITION.md) for research, visual conventions, files, and scope.

The earlier 31-step course is at `?guide=detailed#lessons`. The search lesson and `#studies` comparisons remain available. [PART3-COVERAGE.md](PART3-COVERAGE.md), [OVERVIEW-MAPS.md](OVERVIEW-MAPS.md), and [MOTION-STUDIES.md](MOTION-STUDIES.md) document earlier implementations, not a requirement for exhaustive coverage or recommended circle-based representations.

## Use the libraries

1. Establish prior knowledge and one connected learner problem in a brief.
2. Run `python3 experiment/pipeline.py prepare`. Read its principles and ranked teaching cards before authoring. Ranking does not determine the lesson sequence.
3. Decide the high-level takeaway and which details belong in the source article. Name prerequisites before using them and specify needed visual relationships.
4. Establish one visual vocabulary for the whole lesson, then adapt motion patterns within it. Preserve meaningful distinctions and explicitly explain remapping or simplification.
5. For changes to library cards or historical plans, run `python3 experiment/pipeline.py` to rebuild the gallery and historical selection manifest. The current intuition plan is authored in `web/intuition-plan.js`; its JS/CSS needs no build.
6. Review the whole sequence for continuity, visual attention, and readability. Use the checks in [AGENT-GUIDE.md](AGENT-GUIDE.md).

`library/principles.json` is the authoritative shared policy. `library/teaching/` contains teaching moves; `library/animation/` contains visual techniques. Teaching cards do not choose renderers. Capability matching alone cannot enforce continuity. The deterministic pipeline reproduces earlier plans; it does not generate arbitrary lessons or train a model.

A01–A03 use `web/animations.js`. A04–A06 keep historical renderer identifiers for compatibility, but their recommended gallery references the current connected guide. The older motion adapters in `web/course-motion.js` belong to the detailed comparison course. Do not treat retired prose-card demos or generic-circle models as recommended visual vocabulary.

## Guidance and verification

For sequential content, establish an overview and retain a compact progress map. Wink guides attention beside the relevant object, with optional detail hidden behind its explanation. Current stops use six seconds; the standalone studies retain their historical ten-second setting. Controls and reduced-motion support allow the reader to choose the pace.

[TESTING.md](TESTING.md) records checks. Technical checks do not establish learning effectiveness; review whether a reader can connect the new material to previous parts and explain the whole system.

Recorded traces in `runs/` and `complete_server.py` support earlier technical demonstrations. Do not rerun `capture.py` or `probe_part3.py` for ordinary visual edits: those scripts launch Unix processes and replace measured recordings. The complete server is an educational example, not a complete WSGI implementation.
