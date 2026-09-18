# Learning app — design interview

Status: interview in progress. No app architecture or implementation approved yet.
Requested workflow: grill-with-docs, applying grilling and domain-modeling.

## Confirmed brief

The completed Part 3 experiment is merged into main at eeb68e4 and pushed.
The user wants a place to revisit Part 1, Part 2, and the current Part 3; remember learning and adapt teaching; browse an animation library that can evolve; eventually create visualizations from websites/files; and choose whether a visualization is used as an example for future work. A Mac application is a candidate, not yet a settled architecture.

## Existing assets and behavior

- Part 1: prototype/part1/ask.html, built from ask.template.html and pages.json.
- Part 2: prototype/part2/mix.html, built from mix.template.html; hand.html, wink-guide-prototype.html, and wink-response-prototype.html also exist. History favors mix.html as the current lesson: its latest edits integrate Wink behavior, while the Wink-only pages label themselves throwaway studies. Proposed catalog entry: mix.html, with studies kept as historical artifacts.
- Current Part 3: experiment/web/index.html?guide=course&symbols=phosphor#lessons, with question-led teaching and causal-motion.js.
- Animation library: library/animation/A01.json–A06.json; existing browser gallery under experiment/web/.
- Teaching libraries: library/teaching/ and library/teaching-cs/; shared principles in library/principles.json.
- Current lesson progress is in memory. Only the older detailed course persists its last step. Neither behavior establishes understanding.
- No learner profile, adaptive teaching, arbitrary source generation, or user-controlled exclusion from future examples exists in the inspected implementation.

## Design tree

Round 1 — answered by the user:

1. First-release scope: existing lessons/library versus source generation immediately.
   Decision: existing lessons and library first; generation is a later phase.
   Unlocks: import formats, generation review, cost/provider choices, failure recovery.
2. Audience: personal use versus separate histories for multiple learners.
   Decision: personal app with local learning history.
   Unlocks: identity, sync, data ownership, sharing, backup.
3. Exclusion meaning: retain a visualization but exclude it from future generation, also hide it, or separately exclude its teaching and animation.
   Decision: keep it in the collection; exclude it as an example for future generation.
   Unlocks: eligibility defaults, scope, version inheritance, retrospective behavior.
4. Learning evidence: self-assessment, optional checks, or completion.
   Decision: checks determine understanding. The user chose this over self-assessment; viewing/completion alone is insufficient. Assessment criteria remain open.
   Unlocks: adaptation granularity, review/forgetting, override, conflicting evidence.
5. Mac-app motivation: standalone offline collection, deeper OS integration immediately, or browser flexibility.
   Decision: standalone Mac app with offline lessons first; deep OS integration is deferred.
   Unlocks: packaging, storage boundaries, updates, signing/distribution.

Later decisions depend on these answers: exact adaptation behavior; preserving original lesson versions; preferred Part 2 variant; animation-library edits and their effect on past lessons; generation workflow and publication/reuse approval; implementation scope and acceptance criteria. Recompute the frontier after each round rather than silently adopting recommendations.

## Terminology to resolve

The existing CONTEXT.md uses “reference” for an external source used to check a Departure. The user’s “visualization as a reference” appears to mean a reusable example for future generation. Proposed term: “Reusable example,” separate from an accuracy-checking Source. The user confirmed this exclusion meaning; the glossary now distinguishes Reusable example and Example exclusion.

“Learned” needs an agreed meaning distinct from opened, viewed, and completed. “Animation library” also needs a decision about whether it contains reusable patterns, executable components, approved examples, or several explicitly distinguished collections.

## Decision recording

Update CONTEXT.md as terms become settled. Record an ADR only for a settled decision with a meaningful reversal cost, a non-obvious rationale, and a real trade-off. The local/offline product boundary is recorded in ADR 0006; technology choices remain open. App implementation awaits shared-understanding confirmation as required by the invoked grilling skill; the separately requested main merge is already complete.


## Round 2 frontier

Pending decisions: per-concept versus whole-lesson understanding; format and criteria for offline checks; adaptation behavior in this first release; initial animation-library editing scope; default reusable-example eligibility; retaining past Visualization versions; local-history backup/export requirements. Specific packaging choices and the featured Part 2 variant await the read-only inventory.


## Offline feasibility facts

Part 1 ask.html and Part 2 mix.html embed lesson data and scripts, with no runtime API dependency found. Both request Google Fonts but supply fallback fonts; fully offline packaging must bundle fonts or remove those requests. Current Part 3 uses repository-local scripts/styles, including the relative library/teaching-cs path. External article and citation links require internet. Swift 6.2.3 and macOS SDK 26.2 are installed; a Mac build is feasible without installing a toolchain. These facts do not select the application framework.
