# Overview-first chapter maps

Each chapter begins with a large, plain-language overview before its first detailed visual. Entering the details reuses the same map in a small desktop column. On narrow screens, an icon-and-label strip replaces the column. “See overview” pauses playback and reopens the full map without changing the current moment.

| Chapter | Big picture | Progress and exceptions |
| --- | --- | --- |
| Why does B wait? | Request → reply → open connection → close → next visitor | Tracks the connection timeline, rather than treating reply as completion. |
| Connect two programs | Socket → bind → listen → accept → read/reply → accept again | Reuse belongs to socket setup; accept returns a connected socket while the listener remains open. |
| Give each request a worker | Accept → fork → parent/child branches | Distinguishes the parent accepting from the child serving. |
| Close the extra handles | Fork → release unused handles → reply → last close | Retained parent handle is explicitly marked as a problem, not a completed close. |
| Collect finished children | Work → exit → retained record / notification → collection | Blocking wait is marked as blocking rather than normal progress. |
| Resume after a signal | Accept → signal → handler → resume | Historical EINTR is named; the chapter explains modern automatic retry. |
| Handle a burst of exits | Exits → one notice → collect/check loop → resume | The collection count changes on repeated calls; no-ready-result returns to accepting. |
| Put it all together | Accept → fork → parent/child branches → exit/collection | Follows lifecycle moments and corresponding code responsibilities. |

Highlighting means “current explanatory focus,” not proof that preceding operations have finished. Arrows show causality, branches, or repetition. No completion trail is inferred for alternative/failure scenarios. Prediction questions keep their uncluttered question view.

Implementation: `web/course-overview.js` supplies map structure and authored state mapping; `web/part3.js` synchronizes it with the same scene, moment, and progress used by the animation. The overview is not an extra timed animation step. Six-second detail pauses remain unchanged.
