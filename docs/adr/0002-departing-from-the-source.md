# Departing from the source

The Visualization may show behaviour the primary Source does not contain, when the main
explanation needs it. Strict fidelity was tried first and failed: the article's
`webserver1.py` answers `Hello, World!` to every request, so a reader clicking through
page names saw nothing change, learned nothing, and had no reason to continue.

A Departure is legitimate only when all three hold:

1. **Checked** — the behaviour is verified against several high-quality references, not
   asserted from memory. The routing Departure was checked against MDN on URL paths and
   RFC 9110 on resources, `200` and `404`.
2. **Real** — it is actually built and actually run, and the Visualization shows what
   really came back. `webserver1_pages.py` is the article's code with one marked line
   added; its replies were captured from a live run.
3. **Marked** — stated where a reader meets it, never in a footnote. The note sits on the
   element that departs, says what the original does instead, and cites the references.

## Considered options

Showing the article's true behaviour and accepting the flat result was rejected: it
reliably loses the reader before they reach anything worth understanding. Faking varied
replies without running anything was rejected outright — it breaks Principle 1 and there
is no way for a reader to tell.

## Consequences

Every Departure costs real work: a second runnable artefact, reference checking, and a
written note. That cost is the point — it keeps Departures rare and deliberate rather
than a habit of making things up when the truth is inconvenient.
