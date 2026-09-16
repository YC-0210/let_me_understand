# Teaching and animation libraries

New experiment: [CS educator teaching library](teaching-cs/README.md), with six source-linked patterns and a Part 3 application. It is separate from the historical cards and pipeline below.

Start with [principles.json](principles.json). These user-approved design rules take precedence over the individual cards. Research and the 16-chapter source review are in [CONNECTED-INTUITION.md](../experiment/CONNECTED-INTUITION.md).

## Teaching: decide what understanding to build

Carry the relevant knowledge from previous parts forward. Build one causal story, introduce each new idea through an established relationship, and explain simplifications when they happen. Assume the reader has not read the current article; do not assume they have learned nothing before it.

The output is a guide to high-level intuition. Select the few ideas that unlock the article, and identify where to read the details. Full source coverage is not a requirement to make every topic into an animation. Use a compact overview for sequences and keep additional explanation inside Wink. Predictions are selective comprehension checks, not compulsory gates for every detail.

T01–T04 provide familiar starting points, motivated changes, selective predictions, and earned terminology. T05–T07 add continuity, an explicit scope boundary, and overview-to-detail guidance. All are optional moves within a coherent story. Teaching cards do not choose renderers.

## Animation: give that story a stable visual language

Before choosing a motion pattern, define the concepts, their shapes and labels, their color roles, and the identities that persist between sections. Distinct concepts must be recognizable without relying on color alone. Explain any change of representation. Use motion to make a relationship graspable within roughly ten seconds; text supplies further detail.

A01–A03 remain useful for comparison, overlap, and elimination when those serve the story. A04–A06 describe access to shared resources, sequences, and notification versus records. Their current reference is [intuition.js](../experiment/web/intuition.js): process frames, socket plugs, access keys, folded exit records, and notification bells. That vocabulary is a server example, not a mandatory palette for unrelated topics.

The `renderer` fields on A04–A06 exist for the earlier detailed experiment. Those HTML/CSS implementations are historical compatibility, not recommended starting points. They are labeled as such; the recommended gallery links to the current guide. Do not use prose boxes, a growing text ledger, or generic circles as substitutes for showing the system.

Wink belongs beside the current object. Keep it and its speech clear of marks, labels, and paths; mobile speech may sit below the diagram. Current guided stops default to six seconds with manual control and reduced-motion support. Ten-second standalone studies are historical comparisons, not a pacing requirement.

## How agents receive the rules

`python3 experiment/pipeline.py prepare` includes the principles alongside ranked teaching cards. Ranking is only a retrieval aid; it does not decide the teaching order or override the principles. `python3 experiment/pipeline.py` includes the same principles and cards in browser data.

The deterministic selector still reproduces the earlier detailed plans. Matching a capability does not establish whole-lesson consistency or learning quality. New experiments must review the complete story and visual vocabulary before implementing a selected pattern.

Review with these questions: What did the reader already know? Why does this next idea follow? What stays visually the same? What is deliberately left to the article? Can the reader explain the whole system after watching?
