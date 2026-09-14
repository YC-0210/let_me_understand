# Verification report

Verified locally on 2026-09-14. This is a functional experiment, not a learner study.

## Automated checks: 8 passed

- Both algorithms find every target in 1–16; every retained range keeps the target.
- Binary search takes at most five inspected values on this fixture.
- Target 1 is a counterexample: sequential search uses one check; binary search uses four.
- All six local-server recordings preserve request → answer → close order and the deliberate pause.
- Early B arrivals wait in the serial server; forked handling and late arrivals have no comparable queue wait.
- Both plans satisfy declared prerequisite order and have supported visual capabilities.
- Validation rejects an undeclared prerequisite, an unknown teaching card, and a renderer chosen inside a teaching step.

Command: `python3 -m unittest discover -s experiment/tests -v`

Both JavaScript files pass `node --check`.

The prerequisite validator checks declared metadata, not the meaning of every word in the prose. The agent additionally reviewed the wording and introduced “server,” “connection,” and “process” explicitly. That review can still miss a beginner’s difficulty.

## Browser checks

Verified through the in-app browser:

- Play begins changing the scene immediately; completion, replay, restart, and manual scrub are available.
- Both five-step lessons can be navigated.
- Correct server prediction and incorrect search prediction produce explanatory feedback.
- The server comparison displays the recorded waiting difference. The late-arrival parameter removes the long wait.
- Search for 13 completes in 13 versus 4 checks. Changing the target to 1 displays 1 versus 4.
- Each animation gallery demo changes state using the same renderer as the lessons.
- Both library pages render and expose their source/interpretation details.
- Search and gallery layouts have no horizontal overflow at a 390-pixel viewport; a mobile screenshot was visually inspected. Desktop timeline layout was also inspected.
- No browser console warnings or errors were observed during these checks.

Reduced-motion behavior is implemented as manual discrete advancement; its operating-system preference path was not separately browser-tested.

## What remains unproven

Whether the examples teach better than the earlier prototypes; whether these few patterns transfer broadly; whether a new agent can reliably choose and apply them with less intervention. Those are the next evaluation questions, not claims established by passing tests.

## Full Part 3 extension — 2026-09-14

16 Python tests pass, including a fresh four-client run of the downloadable server. All four responses arrive before the first connection closes, verifying real overlap while the artificial pause is active. The finite server exits after collecting its children.

The added evidence checks verify distinct endpoint pairs sharing one server address, fork return values, inherited descriptor numbers, no EOF while the parent retains a socket, EOF after its close, EMFILE and recovery inside an isolated limit, three zombie records, one coalesced notice, full reaping, WNOHANG returning PID 0 for a running child, and a returning SIGCHLD handler during modern accept.

`node experiment/tests/test_models.cjs` checks ownership and cleanup invariants and renders 73 authored visual states without undefined values. It checks that closing one handle leaves one reference, last close leaves none, and one wait after a burst leaves two records.

Browser verification traversed all 31 course steps, completed all visual timelines, and exercised the explanatory feedback on every question. Pause was verified. Chapter navigation and mobile ownership layout were inspected at 390px without horizontal overflow. No console warnings or errors were observed. The previous search lesson remains available.

Historical EINTR behavior is labeled as a reconstruction and was not executed under Python 2.7/3.4. The measured modern result uses Python 3.14.6. Process-slot exhaustion is explained without exhausting the machine. These checks establish technical behavior and UI operation, not learner comprehension.

The final browser pass also checked the three added gallery demos, source-code line highlighting, and code-panel containment at 390px. The temporary viewport override was reset before delivery.
