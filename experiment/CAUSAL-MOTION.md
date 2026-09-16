# Part 3 — causal motion experiment

## Preview and scope

Branch: `codex/part3-causal-motion`.
Base: `2362a31` on `codex/part3-teaching-library`, the checkout serving the user’s latest preview on port 8767. That checkout was clean. The separate symbol-comparison checkout had the uncommitted symbol work; it was not used as the base.

```sh
python3 -m http.server 8773
# Open http://127.0.0.1:8773/experiment/web/?guide=course&symbols=phosphor#lessons
```

This version replaces all 22 animated moments. The chapter introductions, sequence, questions, narration, Wink explanations, takeaways, reading links, and teaching library are preserved. `intuition-plan-original.js`, `intuition-plan.js`, and the teaching library are byte-for-byte unchanged from the base. The original preview remains in its own checkout.

Animation colors and diagram geometry are independent of the Phosphor query parameter. The existing overview and vocabulary icons are retained. Cyan carries connections/messages, lavender identifies processes, peach marks ownership, ivory identifies retained status, yellow marks notifications, and green identifies the application. Text and shapes also identify each role.

## What was transferred from the algebra experiments

- **Preserve the object while changing the relationship.** Both ownership branches converge on one socket. Fork separates two process frames instead of replacing one icon with another.
- **Intermediate states must explain the operation.** Releasing the parent’s handle leaves the child’s branch and the network connection intact. A received response does not prematurely end the connection.
- **Show what survives an operation.** The process stops; its status sheet remains. Collecting A leaves B and C visible. Notifications never substitute for status sheets.
- **Separate the model from its picture.** `CausalMotion.stateAt(mode, progress, chapter)` is deterministic; the SVG renderer consumes that state. Scrubbing backwards reconstructs the same frame without reversing a chain of DOM side effects.
- **Keep teaching clear of motion.** The narration sits below the diagram. Wink remains beside the relevant object. Mobile ownership branches take separate routes around the process frames.

These are original SVG animations informed by the earlier 3Blue1Brown-inspired experiments. No 3Blue1Brown source, artwork, video, or Manim runtime is incorporated here. This is not a reproduction of a 3Blue1Brown scene.

## Coverage

| Part | Modes | Visible relationship |
|---|---|---|
| Keep the promise | request, application, response | Request travels through the socket; local WSGI call/return; response returns to A. |
| Free the parent | simple, busy, fork, roles | Fixed reply; B waits; child separates from parent; work and accepting become separate responsibilities. |
| Count the handles | twoHandles, oneHandle, replyOpen, closed | Two branches share one plug; one branch retracts; reply arrives while access remains; final release ends the connection. |
| Collect the status | closed, exited, records, reapOne | Socket already ended; process stops; A persists while B/C statuses accumulate; collecting A leaves B/C. |
| Check what is ready | notice, burst, drain | Bell attracts attention; several exits can share a notification; collect A/B/C while D remains running. |
| Explain it back | wholeWork, wholeClose, wholeReap, ready | Same operations in sequence: delegate, release access, reply, release last handle, exit, notify, collect, resume. |

The `closed` mode deliberately has two starting states: in the access chapter it demonstrates the last release; in the status chapter that release is already complete. Chapter overviews establish fresh conceptual examples. The geometry is illustrative, not a packet trace or CPU schedule. Child D is an explicitly labeled still-running example used to show why collection must not block.

## Playback

Entering a moment plays its six-second transition once, then holds. Pause freezes that exact frame. Play resumes and continues through the current part. The slider inspects any point and pauses playback. Back, Next, Replay part, and Overview retain their existing navigation roles. Reduced-motion preference starts at the completed frame; the slider remains available, and explicit Play opts into motion. Resizing redraws the same progress rather than restarting the scene.

## Extension points

- `web/causal-motion.js`: pure semantic state and responsive drawing. Add an operation here, keeping ownership, connection, process lifetime, and status distinct.
- `web/intuition.js`: existing lesson shell plus a single animation clock. Keep narration in the plan files; do not duplicate it in renderer code.
- `web/intuition.css`: styles scoped to `.causal-canvas` and `.cm-*`.
- `tests/test_causal_motion.cjs`: samples every authored moment at 101 positions in both layouts. Add invariants for intermediate states, not just the last frame.

`IntuitionGuide.model`, `icon`, `tokenScale`, and `travelDuration` remain compatibility exports for existing tests and vocabulary. The new renderer uses `CausalMotion.stateAt`; it does not use the legacy endpoint model or the old fixed token speed.

## Verification

- Existing Python suite: 16 tests pass.
- Existing models, motion, course guide, overview, intuition, and teaching-library Node suites pass.
- New suite: 2,222 timeline samples, each rendered at desktop and narrow widths; finite geometry and ownership/status invariants pass.
- Browser: all 22 moments reached through the lesson controls; slider endpoints, halfway collection, replay, pause, and Wink inspected.
- Desktop screenshots reviewed; 390px iframe review caught and corrected ownership paths crossing process frames. A collection-counter/record-label overlap was also corrected.
- Teaching plan and library files unchanged against the base commit.

Native touch dragging, assistive-technology use, and learning effectiveness have not been evaluated. Reduced-motion handling is implemented, but native OS preference switching was not exercised in this browser review.
