# Connected intuition experiment

Branch: `codex/part3-connected-intuition`. Entry: `web/index.html`, route `?guide=course#lessons` (also the default lesson view). The prior 31-step course remains at `?guide=detailed#lessons`. No build is needed for these authored JS/CSS files.

## Learner problem

The previous course selected effective local animations but changed the visual vocabulary between scenes. Processes, sockets, clients, notifications, and exit records often appeared as circles. Part 2's application/WSGI bridge arrived only at the end. The learner could follow individual scenes without seeing why the second half followed from the first.

This variation is an article companion. Its purpose is to supply a connected mental picture before reading code, not reproduce every paragraph of Part 3.

## Research: 3Blue1Brown's linear algebra series

Reviewed the text adaptations of all 16 linked chapters and sampled a figure from each on 2026-09-15. This was a text-and-figure review, not a frame-by-frame review of all videos or a controlled learning study. The observations below are design interpretations, not claims about measured learning outcomes.

| Chapter / source | What carries forward |
| --- | --- |
| [1. Vectors](https://www.3blue1brown.com/lessons/vectors/) | Establishes a concrete arrow interpretation and connects coordinates to it. Addition and scaling become reusable operations. |
| [2. Span and basis](https://www.3blue1brown.com/lessons/span/) | Coordinates become instructions for scaling familiar basis arrows. Arrow-to-point shorthand is explicitly explained. |
| [3. Transformations](https://www.3blue1brown.com/lessons/linear-transformations/) | Reuses basis arrows; their destinations explain matrix columns. Space moving supplies the intuition. |
| [4. Matrix multiplication](https://www.3blue1brown.com/lessons/matrix-multiplication/) | Follows the same arrows through two transformations. Green/red basis identities link the diagram to coordinates. |
| [5. Three dimensions](https://www.3blue1brown.com/lessons/3d-transformations/) | Extends an established operation by adding an axis. Notes that a full 3D grid can obscure the important vectors. |
| [6. Determinant](https://www.3blue1brown.com/lessons/determinant/) | Measures what an already-familiar transformation does to area. Interpretation precedes calculation. |
| [7. Inverses and spaces](https://www.3blue1brown.com/lessons/inverse-matrices/) | Reverse motion explains an inverse; collapsed space connects to determinant zero. Computational methods are deferred. |
| [8. Nonsquare matrices](https://www.3blue1brown.com/lessons/nonsquare-matrices/) | Keeps basis destinations as the rule. Explains why separate input/output spaces require a changed presentation. |
| [9. Dot products](https://www.3blue1brown.com/lessons/dot-products/) | Revisits familiar vector operations through projection and transformations to a line. Its placement relies on earlier foundations. |
| [10. Cross products](https://www.3blue1brown.com/lessons/cross-products/) | Reuses area and orientation. A deeper explanation is explicitly optional. |
| [11. Extended cross products](https://www.3blue1brown.com/lessons/cross-products-extended/) | Connects the previous chapter to duality and determinants rather than introducing an unrelated trick. |
| [12. Cramer's rule](https://www.3blue1brown.com/lessons/cramers-rule/) | Returns to the unknown input of a familiar transformation; area connects geometry to a computation. |
| [13. Change of basis](https://www.3blue1brown.com/lessons/change-of-basis/) | Keeps the geometric vector while changing its coordinate description. Basis arrows remain recognizable. |
| [14. Eigenvectors](https://www.3blue1brown.com/lessons/eigenvalues/) | Explicitly recalls transformations, determinants, systems, and basis changes. A vector staying on its span supplies the central image. |
| [15. Quick eigenvalue method](https://www.3blue1brown.com/lessons/quick-eigen/) | States the prerequisite and reuses eigenvalue/area meaning before introducing a shortcut. |
| [16. Abstract vector spaces](https://www.3blue1brown.com/lessons/abstract-vector-spaces/) | Generalizes the established addition/scaling rules to functions, explaining the relationship to earlier arrows. |

The transferable rule is continuity of meaning, not a universal color chart. Green/red basis vectors recur, but colors also serve local purposes: for example, a projection has its own color in the dot-product figures. Light/dark figures also vary. Labels, spatial context, and explicit mappings are essential. Do not infer “all red objects mean one concept in every 3Blue1Brown lesson.”

## Apply to the server

[Part 1](https://ruslanspivak.com/lsbaws-part1/) establishes request/reply and sockets. [Part 2](https://ruslanspivak.com/lsbaws-part2/) adds the WSGI application. [Part 3](https://ruslanspivak.com/lsbaws-part3/) changes how the work is shared, then addresses the resources that sharing leaves behind.

The guide's six parts are: recall that exchange; add a child; release duplicated socket access; collect exited child status; check all ready results after a notification; follow the whole lifecycle. The two cleanup actions stay visibly separate. The WSGI application appears during recall; an explicit transition explains the application disappearing before later scenes follow the article's simplified fixed-response server, with the connection to Part 2 available in Wink's explanation.

Details such as exact return values, descriptor limits, setup calls, EINTR, and the complete loop are reading destinations, not additional required animations. This is deliberately less exhaustive than the previous course.

## Visual contract

| Concept | Fixed representation |
| --- | --- |
| Browser | Blue browser window |
| Running process | Purple terminal frame; parent/child labels distinguish instances |
| Application | Green hexagon inside the process |
| Accepted socket | Cyan plug; A's socket stays A's socket |
| Listening socket | Cyan doorway; distinct function within the socket family |
| Process access to a socket | Peach key and access line; not encryption |
| HTTP message | Blue envelope travelling along the network connection |
| Retained exit status | Ivory folded sheet; not a file or a message |
| SIGCHLD notification | Yellow bell; not a result or a result count |

Color reinforces shape and text. Do not repurpose any of these symbols. A different abstraction must be introduced with its relationship to the existing picture. A chapter overview may introduce the upcoming roles, but the detailed view reveals entities only when needed. The first overview uses only browser/server/application.

## Files and checks

- `web/intuition-plan.js`: teaching sequence, recap, article destinations, optional explanation.
- `web/intuition.js`: shared glyph vocabulary, conceptual state, persistent SVG objects, controls and Wink focus.
- `web/intuition.css`: compact layout and responsive presentation.
- `tests/test_intuition.cjs`: semantic invariants across the authored scenarios.

The state is illustrative, not a packet capture or an execution schedule. Connection closure as message end applies to the article's example, not every HTTP response. Modern Python's automatic retry behavior and nonblocking wait semantics are described in optional text.

Acceptance questions: Can a reader connect this to Parts 1 and 2? Can they distinguish a handle from a socket and a record from a process without relearning the diagram? Can they explain why fork creates two cleanup responsibilities? Can they locate the corresponding details in the article?
