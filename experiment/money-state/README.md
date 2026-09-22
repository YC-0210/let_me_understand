# Money and the state · chapter 3 experiment

Preview: http://127.0.0.1:8770/experiment/money-state/
Branch: `mac-application`. Edition: `2026-09-20`.

49 manual screens, six lean recap bridges, historical role changes, earned vocabulary,
manually stepped T-accounts, and two views of the professor’s historical reserve table.
See [sources.html](sources.html) and the [review record](../../library/teaching-economics/CHAPTER-3-REVIEW.md).

- `course-plan.js`: teaching sequence; all transaction amounts explicitly illustrative.
- `course-render.js`: shared board renderer, used by lesson and extracted library players.
- `course.js`: click-driven entry progression, previous-entry/start-over, manual next/back, story map and URL screen links.
- `historical-data.json`: transcription with units, unknown observation date and provenance.
- `preview-*.html`: three standalone animations; no lesson iframe.
- `lesson.json`: portable app manifest; proposed concepts require the app’s normal explicit approval.

## Verification · 20 September 2026

Packaging test first failed for the missing money-state package, then passed after implementation.
All four main packaging tests and sixteen Swift tests passed. JavaScript syntax and diff checks passed.
Walked through all 49 screens in the browser. Checked entry-by-entry scrubbing, pause/replay,
end states, recap-only rendering, narrow 390px accounts, and 900×330 library-player layout.
Console showed no warnings/errors in the lesson. Narrow amounts use unbroken signs and numbers.
Earlier editions and the hierarchy lesson are preserved. No understanding or reference-approval
flags are set by the lesson. Offline assets travel with the app; online source links are optional.

The research review distinguishes full transcript reading from 20-second sampled video inspection.
This is an experiment, not a claim that learning effectiveness has been measured.

## Manual pacing correction

T-accounts now start empty and have no playback clock. Each click reveals exactly one entry
and its explanation. Continue leaves the screen only after the final entry. Previous entry
and Start over are manual too, including all three extracted library players.

Page 7 is a clean role-setting interlude: only Wink, the August 1861 historical setting,
the learner’s responsibility as Salmon P. Chase, and a manual button into the bank-loan story.
The lesson still has 49 screens.

## Story continuity pass

Reviewed all screen openings, entry explanations and recap bridges in sequence. Role changes
and time jumps are now explicit; each account opens with the preceding character’s payment
problem or decision. The rediscount and note-withdrawal screens now carry the same $99 balance.
The merchant-to-bank transfer of the bill and the quiet-season-to-harvest loan recall are explicit.
