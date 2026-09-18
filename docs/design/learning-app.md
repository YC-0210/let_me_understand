# Learning app — design interview

Status: interview in progress. No app architecture or implementation approved yet.
Requested workflow: grill-with-docs, applying grilling and domain-modeling.

## Confirmed brief

The completed Part 3 experiment is merged into main at eeb68e4 and pushed.
The first release is a personal standalone Mac app for revisiting Part 1, Part 2, and current Part 3 offline, recording learning-check results, and browsing/organizing the animation library. It will NOT adapt teaching in this phase. The user will direct visualization authoring, sources, and rules through Codex. Website/file generation and automatic adaptation are future capabilities.

## Existing assets and behavior

- Part 1: prototype/part1/ask.html, built from ask.template.html and pages.json.
- Part 2: prototype/part2/mix.html, built from mix.template.html; hand.html, wink-guide-prototype.html, and wink-response-prototype.html also exist. History favors mix.html as the current lesson: its latest edits integrate Wink behavior, while the Wink-only pages label themselves throwaway studies. Proposed catalog entry: mix.html, with studies kept as historical artifacts.
- Current Part 3: experiment/web/index.html?guide=course&symbols=phosphor#lessons, with question-led teaching and causal-motion.js.
- Animation library: library/animation/A01.json–A06.json; existing browser gallery under experiment/web/.
- Teaching libraries: library/teaching/ and library/teaching-cs/; shared principles in library/principles.json.
- Current lesson progress is in memory. Only the older detailed course persists its last step. Neither behavior establishes understanding.
- No persisted learner profile, check-score-based adaptation, arbitrary source generation, or user-controlled exclusion from future examples exists. Part 2 DOES offer session-only manual unfamiliar-term choices that adjust explanations; whether to retain these is Q17.

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

Remaining decisions include concept boundaries and supporting sources, assessment criteria, the Codex-to-app authoring handoff, version-specific history/reuse rules, backup restore behavior, packaging, and acceptance criteria. Future generation and adaptation are deferred; do not design their implementation as a first-release requirement.

## Terminology to resolve

The existing CONTEXT.md uses “reference” for an external source used to check a Departure. The user’s “visualization as a reference” appears to mean a reusable example for future generation. Proposed term: “Reusable example,” separate from an accuracy-checking Source. The user confirmed this exclusion meaning; the glossary now distinguishes Reusable example and Example exclusion.

“Learned” needs an agreed meaning distinct from opened, viewed, and completed. “Animation library” also needs a decision about whether it contains reusable patterns, executable components, approved examples, or several explicitly distinguished collections.

## Decision recording

Update CONTEXT.md as terms become settled. Record an ADR only for a settled decision with a meaningful reversal cost, a non-obvious rationale, and a real trade-off. The local/offline product boundary is recorded in ADR 0006; technology choices remain open. App implementation awaits shared-understanding confirmation as required by the invoked grilling skill; the separately requested main merge is already complete.


## Round 2 — user decisions

6. Track understanding per individual concept. The user asks how concept boundaries/counts are determined and wants consistent high-quality sources. Proposed, not yet approved: a source-backed concept list reviewed by the user.
7. Use authored selectable predictions and changed scenarios, with explanations, offline.
8. No teaching adaptation in this phase. The user leads authoring in Codex, including sources and rules. Record understanding without changing the teaching sequence or suggesting personalized recaps/shortcuts.
9. Browse animation examples, edit descriptions/tags, and enable/exclude future reuse. Visual editing of animation behavior is deferred.
10. New Visualizations are ineligible as reusable examples until approved by the user.
11. Keep earlier Visualization versions; updating library patterns must not silently update saved lessons.
12. Include manual export/import for local learning history and library choices. No account or cloud sync.

## Round 3 frontier

Define the source policy and who approves concept boundaries; how checks establish per-concept evidence; when checks are offered; clarify whether “Codex section” means the existing Codex app/workspace or an embedded authoring area. Then resolve lesson-update handoff and evidence across versions without adding automatic adaptation. Recommendations are not accepted decisions until answered.


## Offline feasibility facts

Part 1 ask.html and Part 2 mix.html embed lesson data and scripts, with no runtime API dependency found. Both request Google Fonts but supply fallback fonts; fully offline packaging must bundle fonts or remove those requests. Current Part 3 uses repository-local scripts/styles, including the relative library/teaching-cs path. External article and citation links require internet. Swift 6.2.3 and macOS SDK 26.2 are installed; a Mac build is feasible without installing a toolchain. These facts do not select the application framework.


## Concept and check inventory

Part 2 exposes eight vocabulary IDs (server, framework, request, wsgi, environ, headers, callback, socket). The historical detailed Part 3 plan has 43 introduced identifiers and prerequisite sequencing validation; these are authoring identifiers, not a shared approved concept count. Current Part 3 has four reveal-only reflection prompts without submitted answers. Historical Part 3 has five multiple-choice questions with per-option feedback that may be reusable after review. Part 1 and Part 2 have no assessed checks in their current pages. There is no cross-lesson concept registry, concept-to-check mapping, or importable lesson-bundle format yet.

The subject sources already recorded are Ruslan Spivak’s web-server Parts 1–3; the educator references are a separate teaching-method layer. Proposed concept policy and evidence thresholds are pending Q13 and Q15, not inferred from the existing identifier counts. Q14 clarifies the location of Codex authoring; Q16 concerns optional check placement; Q17 concerns retaining manual Part 2 explanation choices.
