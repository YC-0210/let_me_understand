# CS educator teaching library

Read [the shared principles](../principles.json) first. This is a separate experimental teaching library, not a replacement for T01–T07 or the animation library. Its canonical, browser-loadable data is [library.js](library.js). No build step or package installation is required.

The selected educators are David J. Malan, Hal Abelson, and John Ousterhout. “Greatest” is subjective; the selection emphasizes complementary, directly inspectable examples of teaching: concrete motivation, abstraction boundaries, and reasoning about concurrent failures. The library does not reproduce a lecturer’s voice or claim endorsement.

## How to use it

1. State what the learner already knows and the question they cannot yet answer.
2. Choose a card by `when`, not by educator prestige. Read its source observation and boundary.
3. Write the learner-facing explanation using `move`; check it against `avoid` and `check`.
4. Preserve the model’s identities. Only then ask the animation library to express the necessary relationship.
5. Have the learner explain a changed case. Correct navigation and attractive animation are not evidence of understanding.

Each card includes an ID, source ID, title, trigger, teaching move, failure to avoid, learner check, and an original Part 3 example. It intentionally has no renderer, icon, geometry, or timing fields. The sources distinguish observed material from our inference and include specific links. The Part 3 plan records the card IDs it uses.

## Source review — 2026-09-16

- **Malan:** [CS50 2025 Lecture 0](https://cs50.harvard.edu/x/2025/notes/0/#algorithms), Algorithms and Pseudocode. Compared the written phone-book approaches and the transition to pseudocode and naming. Adaptation: a visible limitation motivates an API, rather than introducing the API first. CS01 and CS02 are our teaching formulations.
- **Abelson:** [SICP §2.1.2](https://sicp.sourceacademy.org/chapters/2.1.2.html), rational-number operations and abstraction-barrier figure. The comparison edition exposes the original and JavaScript adaptation. SICP is by Harold Abelson, Gerald Jay Sussman, and Julie Sussman; credit is shared. [MIT OCW’s original lecture listing](https://ocw.mit.edu/courses/6-001-structure-and-interpretation-of-computer-programs-spring-2005/resources/1a-overview-and-introduction-to-lisp/) supplies the course context, not evidence that we watched the lecture. Adaptation: keep the externally visible job stable and distinguish access from the resource. CS03 and CS04 are our extrapolations to servers, not SICP’s server lesson.
- **Ousterhout:** [CS 140 Concurrency](https://web.stanford.edu/~ouster/cgi-bin/cs140-spring20/lecture.php?topic=concurrency), especially the Too Much Milk example and successive attempts. Adaptation: evaluate a plausible rule using a case that breaks it, then state a reusable condition. CS05 and CS06 transfer this reasoning structure; we do not introduce locks into Part 3.

Reviewed these written materials, not complete lecture videos. The sources motivate design hypotheses; there is no measured claim that this version teaches better.

## Application and review

The [Part 3 experiment report](../../experiment/TEACHING-EXPERIMENT.md) maps the cards to six chapters, explains the controlled comparison, and records validation. Browse the library at `/experiment/web/?teaching=educators#teaching`. The historical teaching library remains at `?teaching=original#teaching`; the deterministic pipeline continues to use that historical library. Do not silently feed these new cards into old generated manifests.
