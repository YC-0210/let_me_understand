# First-release verification — 2026-09-19

The user confirmed five seams before tests were written: collection import/opening, learning history, library editing/reuse, backup/restore, and the visible Mac app. Work proceeded in vertical red/green slices with real temporary storage.

## Automated red → green record

1. Import survives deletion of authoring folder: failed against unimplemented importer; passed after copying into app-owned storage and reopening through the collection interface.
2. Invalid entry rejected without adding a lesson: failed against permissive import; passed after package validation and staged import.
3. Shared concept mark survives reopening and can be unticked: failed against empty history; passed after atomic local persistence. Editions remain separately accessible and duplicates are rejected.
4. Library edits and per-edition approval persist without rewriting lessons: failed against default choices; passed after persistent library choices.
5. Backup preview leaves state alone; restore has recoverable prior history: failed against unimplemented backup; passed with versioned export, validation, safety backup and replacement.
6. Changed concept cannot inherit an existing concept ID: failed against permissive concept import; passed after comparing incoming concepts to saved concepts.
7. Concept-list approval is explicit and per edition: failed against default-only approval; passed after persistence. Approval does not tick understanding.
8. Opening records a visit without understanding: failed against empty visit history; passed with separate visit persistence.
9. Packaging emits all three offline entry points and identical Part 3 animation bytes: failed without packager; passed after packaging existing assets.
10. Library defaults apply only before editing: failed against blank default choices; passed with explicit defaults that preserve deliberately empty saved values.
11. Part 1 local-file UTF-8: native inspection found garbled punctuation; packaging assertion failed, then passed after adding the declaration to the copy.

Eleven Swift tests and one Python package test (including the encoding regression) currently cover these behaviors. Final review added failing regressions for Finder metadata disrupting collection loading and a directory named index.html being accepted; both pass after hidden-file filtering and regular-file validation. No private-method tests, database side channels, internal mocks, or generated expected-value snapshots.

## Native app checks

- Built and launched the `.app`; original executable stub had no window, native implementation shows Parts 1–3 in the collection.
- All three lessons open from app-owned `file:` URLs, without a local HTTP server. Remote WebView resources are blocked by a WebKit content rule.
- Part 1 corrected UTF-8 punctuation and animated exchange observed.
- Part 2 unfamiliar-term checkboxes and “Build my explanation” produce the existing exchange controls.
- Part 3 chapter 3 opens with “Does closing one handle close the socket?”, launches the causal diagram, and pauses at 6.0 seconds with replay/next controls.
- Animation gallery displays A01–A06 and their examples.
- In isolated test storage: approve a proposed list, tick a concept, observe “1 of 3” on the shelf; save cleared animation tags and reuse approval; export history, change approval, restore via count preview, observe restored approval and safety-backup location.
- Native smoke checks complement the automated store tests; they are not a full automated UI suite or a new animation collision audit. Existing renderer bytes are preserved.

## Experiment sections and extracted players

- Added a failing store test for persistent experiment placement and linked-animation classification, then implemented placement independently of reuse approval. Existing history decodes without the optional placement field.
- Added a failing packaging test for eight standalone players with source-lesson associations; extraction now supplies original Part 1/2 drawings, A01–A03 renderers, and direct CausalMotion previews for A04–A06. Players contain no lesson/gallery navigation or iframe.
- Browser runtime checks exercised all eight players and scrubbed the extracted Part 2 and all six pattern players, checking rendered shapes, labels and no JavaScript errors.
- Native app inspection confirmed Parts 1–3 under Experiments and inline WebKit players with playback controls in Animation library. Descriptions/tags/reuse are secondary disclosures.
- Current suite: 12 Swift tests and 2 packaging tests. Original visualization source files are unchanged.

## Linear-inspired desktop design

Read the repository DESIGN.md and directly inspected Linear for Mac's list and detail layouts. Applied the existing palette to compact navigation, lesson rows, content-panel borders, restrained buttons and an optional learning inspector. Extracted preview chrome uses the same neutral surfaces and accent; renderer geometry and data are untouched. This is a presentation change, verified with the existing behavioral suite rather than tests asserting cosmetic constants.

The redesigned app compiles and all 12 Swift / 2 packaging tests pass. Final native screenshot, minimum-window-size and interaction checks for this design revision are pending: the Mac locked after Linear was inspected, and computer-use reported that manual unlock is required. Do not treat the earlier native checks as visual approval of this revision.
