# Money & Banking — Natural hierarchy of money

An original, offline experiment for chapter 2 of the user's Perry Mehrling course notes.
Main line: printed pp. 7–14, PDF pp. 8–15. Research and transcript-access limitation:
[Sources](sources.html) and [economics teaching library](../../library/teaching-economics/README.md).

## Learner problem

“Money” and “credit” sound like permanent labels. This experiment asks the learner to follow
settlement through different viewpoints, then explain the claims and institutions that make
conversion possible. Six question-led sections contain three six-second moments each.
The chapter is a conceptual overview, not a complete banking or monetary-policy course.

## Files

- `plan.js`: question, explanation, deeper reading, source pages, voluntary reflection.
- `render.js`: six shared SVG diagrams; selected balance-sheet entries are deliberately incomplete.
- `lesson.js`: playback and independent exploration controls. No scoring or history adaptation.
- `symbols/`: pinned Phosphor Regular geometry, mappings and MIT license; `icons.js` embeds it offline.
- `preview-*.html`: standalone entry points sharing the same drawing and playback, not iframes.
- `lesson.json`: seven proposed concepts. App approval and understanding remain user choices.

The six pattern entries are bundled by `mac-app/scripts/package_lessons.py`. Their source key
is `money-hierarchy@2026-09-19`, so their experiment/collection placement follows the lesson.
All future-example approvals default to off. Existing saved editions and history are preserved.

## Representation contract

Gold = coins; currency = banknote; deposit = wallet; security/IOU = scroll;
institution = bank; central-bank reserves = vault. Every symbol also has a text label.
The gold-standard ladder is explicitly historical. The reserve-support scene is explicitly
modern and schematic. Counts, amounts and qualitative distances are illustrative, never data.

Travelling claim/reserve tokens have a constant 26-unit size and travel at 180 SVG units/s.
Wink identifies the active layer or relation. Ledger links draw progressively; credit-count
changes fade new entries in. Boundary changes do not destroy underlying claims. Reduced motion
renders settled states. No assets are downloaded at lesson runtime.

## Verification, 2026-09-19

The public package-output test failed when the money package was absent, then passed after
integration. All 12 Swift tests and 3 packaging tests pass. JavaScript syntax checks pass.
Browser inspection traversed all 18 moments, checked SVG text bounds/pairwise label overlaps,
changed the settlement viewpoint and independent credit controls, and checked playback reset.
At 390px the page has no horizontal overflow; the labelled diagram has its own horizontal
scroll region to retain legible labels. Desktop screenshots reviewed the hierarchy, ledger,
and policy views. Native installation status and final verification are recorded in mac-app/TESTING.md.

No measured learning-effectiveness claim. No verified transcript was available from the supplied
YouTube compilation or the author-linked instruments segment; this remains a research limitation.
