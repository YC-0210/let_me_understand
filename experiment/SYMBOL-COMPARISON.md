# Part 3 symbol comparison

Branch: `codex/part3-symbol-comparison`.

Serve the repository root and open `/experiment/web/?guide=course&symbols=phosphor#lessons`.
The Phosphor / Lucide buttons preserve the chapter and moment, pause playback, and redraw that moment with the other family. Replay part repeats the same motion. Without `symbols`, the original guide remains available.

Both variants use the existing six-section, 22-moment lesson, neutral symbols, the same accent, positions, and six-second timing. Color-specific narration is replaced with shape descriptions in this experiment only. Comparison handles have extra spacing. Start with Share the work, Release access, then Collect status to judge duplication, connections, disappearance, and collection.

Review: Can you identify the object during movement? Do symbols have balanced visual size and weight? Are socket, handle, process, and record distinguishable? Does the process-to-record transition remain understandable?

`web/symbol-families.js` contains normalized original SVG geometry from nine symbols per family. Raw SVGs, full licenses, pinned source revisions and semantic mappings are in `web/symbols/`. Phosphor uses Regular filled-outline geometry; Lucide uses its original stroked paths. Their native weights are intentionally retained. A shared 72-unit box is a first sizing baseline, not a claim of perfect optical balance. Application is represented by code; process by a terminal.

This evaluates whole-object motion in the existing lesson. It does not establish that either family supports arbitrary internal decomposition or Manim morphing; those require a later component experiment. No third-party animation code is included.

## Learner feedback: clearance is required

Phosphor is the preferred family. Moving messages use 36% of the actor glyph size and travel above the actors, never through a socket or into a browser/process. The application has its own labeled location. Hidden children retain their destination position so their appearance cannot sweep over the parent. Exit records fade at a collection point outside the parent. Focus outlines clear the labels; speech falls below the diagram if no unobstructed location is available. Check both steady states and motion paths when changing the layout. Shared artboards do not require equal sizes for actors and travelling tokens.
