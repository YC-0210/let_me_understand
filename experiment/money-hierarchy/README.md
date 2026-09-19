# Money & Banking — Natural hierarchy of money

An original offline experiment based on chapter 2 of Perry Mehrling’s course notes,
printed pp. 7–14 (PDF pp. 8–15). See [sources](sources.html) and the
[economics teaching library](../../library/teaching-economics/README.md).

## Beginner-first edition · 2026-09-19.2

Start with buying a $5 lunch, then distinguish payment from a promise. Introduce bank
balances, reserves, paired claims and the historical hierarchy only after their everyday
motivation. Twenty-one short screens each contain one diagram, visible Wink guidance and
one next action or a two-choice question. Additional explanation and the route map are
optional. Animations last six seconds; advancing is always manual. No scoring or adaptation.

- `course-plan.js`: original examples, questions, guidance and deeper explanation.
- `course-render.js`: shared SVG drawing and Wink focus; selected ledger entries are incomplete.
- `course.js` / `course.css`: manual progression, feedback, pause/replay and responsive layout.
- `preview-*.html`: six standalone players sharing the actual lesson renderer, without iframes.
- `lesson.json`: seven proposed concepts; approval and understanding remain user choices.
- `overview-edition.html`: preserved previous overview, using `plan.js`, `render.js`, `lesson.js` and `style.css`.

The new package key is `money-hierarchy@2026-09-19.2`; saved previous editions are preserved.
Linked animation placement follows the new edition. Future-example approval defaults to off.

## Representation contract

Pinned Phosphor Regular geometry is embedded offline, with labelled objects and its MIT
license in `symbols/`. Gold = coins; currency = banknote; deposit = wallet; IOU = scroll;
reserves = vault; café = storefront; lunch = fork and knife. Historical gold conversion is
explicitly distinguished from modern reserves. Amounts and distances are illustrative.

Moving tokens remain 26 SVG units and travel at 180 SVG units/second. Wink points to the
active object while its speech tells the reader what to do or watch. Refused IOUs do not move.
Consolidation does not repay debt. Reduced motion displays settled states. No runtime downloads.

## Verification

The new edition packaging assertion failed before integration and passed afterward.
All 12 Swift and 3 Python packaging tests pass. Browser review traversed all 21 screens,
checked label collisions, manual progression, feedback and pause/resume. At 390px the opening
fits without horizontal scrolling. See mac-app/TESTING.md for installation verification.

The Brilliant reference was sampled, not completed; no learning-effectiveness claim is made.
No verified video transcript was available; the source page retains that limitation.
