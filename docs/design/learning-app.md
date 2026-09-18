# Learning app — design interview

Status: interview in progress. No app architecture or implementation approved yet.
Requested workflow: grill-with-docs, applying grilling and domain-modeling.

## Confirmed brief

The completed Part 3 experiment is merged into main at eeb68e4 and pushed.
The user wants a place to revisit Part 1, Part 2, and the current Part 3; remember learning and adapt teaching; browse an animation library that can evolve; eventually create visualizations from websites/files; and choose whether a visualization is used as an example for future work. A Mac application is a candidate, not yet a settled architecture.

## Existing assets and behavior

- Part 1: prototype/part1/ask.html, built from ask.template.html and pages.json.
- Part 2: prototype/part2/mix.html, built from mix.template.html; hand.html, wink-guide-prototype.html, and wink-response-prototype.html also exist. Which variant to feature remains a product decision.
- Current Part 3: experiment/web/index.html?guide=course&symbols=phosphor#lessons, with question-led teaching and causal-motion.js.
- Animation library: library/animation/A01.json–A06.json; existing browser gallery under experiment/web/.
- Teaching libraries: library/teaching/ and library/teaching-cs/; shared principles in library/principles.json.
- Current lesson progress is in memory. Only the older detailed course persists its last step. Neither behavior establishes understanding.
- No learner profile, adaptive teaching, arbitrary source generation, or user-controlled exclusion from future examples exists in the inspected implementation.

## Design tree

Round 1 frontier — all answers pending:

1. First-release scope: existing lessons/library versus source generation immediately.
   Recommendation: existing collection first; generation later.
   Unlocks: import formats, generation review, cost/provider choices, failure recovery.
2. Audience: personal use versus separate histories for multiple learners.
   Recommendation: personal, local history first.
   Unlocks: identity, sync, data ownership, sharing, backup.
3. Exclusion meaning: retain a visualization but exclude it from future generation, also hide it, or separately exclude its teaching and animation.
   Recommendation: keep it in the collection while excluding it as a future example.
   Unlocks: eligibility defaults, scope, version inheritance, retrospective behavior.
4. Learning evidence: self-assessment, optional checks, or completion.
   Recommendation: explicit self-assessment plus optional checks; viewing is separate from understanding.
   Unlocks: adaptation granularity, review/forgetting, override, conflicting evidence.
5. Mac-app motivation: standalone offline collection, deeper OS integration immediately, or browser flexibility.
   Recommendation: standalone app reusing existing lessons, with offline access first.
   Unlocks: packaging, storage boundaries, updates, signing/distribution.

Later decisions depend on these answers: exact adaptation behavior; preserving original lesson versions; preferred Part 2 variant; animation-library edits and their effect on past lessons; generation workflow and publication/reuse approval; implementation scope and acceptance criteria. Recompute the frontier after each round rather than silently adopting recommendations.

## Terminology to resolve

The existing CONTEXT.md uses “reference” for an external source used to check a Departure. The user’s “visualization as a reference” appears to mean a reusable example for future generation. Proposed term: “Reusable example,” separate from an accuracy-checking Source. Await confirmation before changing the glossary.

“Learned” needs an agreed meaning distinct from opened, viewed, and completed. “Animation library” also needs a decision about whether it contains reusable patterns, executable components, approved examples, or several explicitly distinguished collections.

## Decision recording

Update CONTEXT.md as terms become settled. Record an ADR only for a settled decision with a meaningful reversal cost, a non-obvious rationale, and a real trade-off. No ADR is warranted yet. App implementation awaits shared-understanding confirmation as required by the invoked grilling skill; the separately requested main merge is already complete.
