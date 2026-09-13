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
