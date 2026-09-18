# Part 3: teaching informed by CS educators

Branch: `codex/part3-teaching-library`.
Worktree: `/Users/chen/Documents/ChatGPT/let_me_understand-teaching`.
Preserved Phosphor snapshot: `f33c419` (copied from the dirty local symbol-comparison worktree, not from GitHub). The source worktree, branch, index, uncommitted files, and port 8766 were left untouched. The initial teaching experiment was local and not pushed at that stage. See the integration update below for the combined version.

## Learner problem and hypothesis

A learner can watch a successful lifecycle without being able to explain why its mechanisms are needed or diagnose a nearby failure. Test one teaching change: frame the same animation as a sequence of motivated questions, concise observations, and a few optional predictions, ending with a transferable explanation.

The references are [David Malan’s CS50 notes](https://cs50.harvard.edu/x/2025/notes/0/#algorithms), [Hal Abelson and coauthors’ SICP abstraction barriers](https://sicp.sourceacademy.org/chapters/2.1.2.html), and [John Ousterhout’s concurrency notes](https://web.stanford.edu/~ouster/cgi-bin/cs140-spring20/lecture.php?topic=concurrency). See the [new teaching library](../library/teaching-cs/README.md) for precise observations, credits, boundaries, and reuse instructions. These are complementary examples, not an objective top-three ranking.

## A teaching change with the same animation

The original 22 moments, six chapter identities, modes, focus targets, models, pictogram geometry, token scale (0.36), linear transfer speed (180 SVG units/second), and six-second play schedule are retained. The original authored plan is preserved as `web/intuition-plan-original.js`. The new `web/intuition-plan.js` overlays teaching fields and inherits the exact animated sequence. No generated pipeline files, evidence recordings, technical models, or source article are rewritten.

| Chapter | New learner question | Cards | Teaching change |
| --- | --- | --- | --- |
| Foundation | What must stay the same? | CS03, CS02 | State the request–response promise and recall WSGI. |
| Workers | Why does B have to wait? | CS01, CS02, CS03 | Test whether queue capacity fixes a busy handler before fork. |
| Access | What did fork actually copy? | CS04, CS05 | Distinguish handle/socket and reply/end; predict the retained-parent-handle bug. |
| Records | What can outlive finished work? | CS04, CS02 | Separate running child, retained status, and socket cleanup. |
| Notice | Does one bell mean one result? | CS05, CS06 | Break the one-notification/one-result shortcut and derive draining ready statuses. |
| Whole | Can you explain the whole server? | CS03, CS06 | Explain two different failures using two independent cleanup duties. |

Each overview poses its chapter question. Narration is at most 30 words per moment; Wink contains the longer explanation and existing technical caveats. Chapter endings add one takeaway. Three prediction prompts and one final explanation prompt offer a reveal, with no scoring or required answer. Reveal pauses playback so reasoning is not interrupted. The prompt and answer stay in document flow below the drawing; they do not cover actors or travel paths. The Phosphor family is fixed in the new version.

The hypothetical failure cases are described as hypothetical. The unchanged animation continues to show the original successful states. Signal coalescing and close-delimited HTTP are taught as in [the source article](https://ruslanspivak.com/lsbaws-part3/); a bell is not a stored result, a sheet is not a file, and the simplified sequence is not a guaranteed execution schedule.

## Compare locally

From this worktree run `python3 -m http.server 8767 --bind 127.0.0.1`.

- New: http://127.0.0.1:8767/experiment/web/?guide=course&symbols=phosphor#lessons
- Original teaching, same snapshot: http://127.0.0.1:8767/experiment/web/?guide=course&teaching=original&symbols=phosphor#lessons
- New teaching library: http://127.0.0.1:8767/experiment/web/?teaching=educators#teaching
- Earlier detailed course: http://127.0.0.1:8767/experiment/web/?guide=detailed#lessons

The original user preview on port 8766 remains available independently.

## Reader review

Compare with the original using the same scenes. Ask the learner, without showing the answer: (1) Why does increasing the queue not free the handler? (2) Why can A receive a reply and still wait for the end? (3) Why can a stopped child remain as a zombie? (4) Why can one notification require several collections? Then give a new retained-handle/status-accumulation case. Note whether the learner explains causes or only recalls names. Counterbalance which version is seen first if comparing multiple readers. No claim of improved understanding is made until this is tried.

## Verification

Automated: the 16 Python tests and all existing model, motion, guide, overview, and intuition suites pass. `test_teaching_library.cjs` verifies the original/new animated sequence and semantic models match, the nine Phosphor glyphs match, fixed token scale/speed remain, source/card references resolve, and all new cues fit the narration bound. JavaScript syntax and whitespace checks also apply.

Browser: inspected all 22 moments at 1280px desktop and 390px mobile. Bounding-box checks found no Wink/speech overlap with visible entities or page overflow after correcting inherited Wink placement. Sampled 96 frames across reply transfer and three-record collection at both sizes; visible tokens, labels, Wink, and speech remained separate. Collected records are opacity zero and excluded from visible-overlap checks.

Guidance-only correction: the inherited mobile Wink anchor covered a parent handle and crossed the reply lane. In the new teaching version, Wink chooses a nearby free position and speech reserves the full future token path; guidance snaps between safe positions. Actors, transfer paths, sizes, and speeds are unchanged. The original-teaching route keeps the baseline guidance layout.

Interaction checks: all chapter navigation and next steps; back; replay to the first moment; overview reopening; Wink expansion and reset on next; optional reasoning reveal pausing playback for more than six seconds; playback advancing after six seconds; both teaching-library routes; original-teaching route. The connected baseline does not provide a scrubber, so none is claimed. Reduced-motion code is preserved; OS-level reduced-motion was not toggled during browser testing. Reader learning outcomes remain untested.

## Reader refinement: question-led section openings

The six prominent overview headings now ask a question rather than state the answer. For example, “Two handles can reach the same socket” becomes “Does closing one handle close the socket?” This invites a prediction before the sequence explains the relationship. The supporting prompts, original-teaching route, and animations are unchanged. Checked with the teaching comparison suite; learner response still needs review.

## Integration update — 2026-09-19

Integrated the user’s newer animation commit `e477331` from `codex/part3-causal-motion` into `codex/part3-teaching-library` by fast-forward. It descends directly from the question-opening commit `2362a31`; no content conflict or teaching rewrite was needed. Both teaching plans and the CS teaching library remain byte-for-byte unchanged. The original animation preservation statements above describe the initial teaching experiment; [CAUSAL-MOTION.md](CAUSAL-MOTION.md) now defines the current animation and timing behavior. The older teaching query selects older narration with the new renderer.

Revalidation: all 16 Python tests and all seven Node suites pass, including 2,222 causal timeline samples rendered at both widths. Browser smoke checks reached all 22 moments with the new renderer, confirmed the six question openings, scrubbed to completed states, and confirmed optional reasoning reveal pauses playback. This integration does not assert that the legacy token-scale/speed compatibility tests validate the new renderer’s transfer speeds. No animation geometry or timing was altered during integration.
