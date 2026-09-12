# References

Work to measure this project's visualizations against. Each entry says what to take
from it, not just that it is good.

## Interactive explanation

**[The Illustrated TLS 1.3 Connection](https://tls13.xargs.org/)** ([1.2](https://tls12.xargs.org/) · [source](https://github.com/syncsynchalt/illustrated-tls13))
A real captured TLS handshake with every byte annotated — the same premise as this
project, at far greater volume, so it has had to solve the space problem properly.
Collapsible sections per phase with an "Open All" escape hatch; indentation shows which
bytes belong to which field; hex first, plain language immediately under it.
_Take_: the whole protocol is skimmable before anything is opened.

**[Bartosz Ciechanowski](https://ciechanow.ski/)**
Interactive essays on gears, GPS, watches, [colour spaces](https://ciechanow.ski/color-spaces/).
The craft benchmark. Every concept carries a simulation the reader manipulates directly.
_Take_: the control and the thing being explained are the same object — no toolbars, no
disclosure chrome around the figure.

**[An Interactive Guide to Flexbox](https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/)** ([Grid](https://www.joshwcomeau.com/css/interactive-guide-to-grid/))
Closest to this project's format: a beginner tutorial where small interactive widgets sit
inline with prose. _Take_: how little vertical space each demo occupies, and that each
demonstrates exactly one property — Principle 4 already working in the wild.

**[Introduction to A*](https://www.redblobgames.com/pathfinding/a-star/introduction.html)**
Three interaction modes on one diagram — animate, step, drag the endpoints — plus
side-by-side comparison of two algorithms. _Take_: the repeated structure
*concept → code → interactive figure*, which keeps a long page navigable.

## Framing for a reader with no foundation

**[Wizard Zines](https://wizardzines.com/comics/) / [Julia Evans](https://jvns.ca/)**
Comics, not interactives — but the best example anywhere of explaining
[network protocols](https://wizardzines.com/comics/network-protocols/) and
[HTTP](https://wizardzines.com/comics/http-apis/) to someone starting from nothing, on
exactly this project's subject. _Take_: the voice and the question-shaped entry point.

## Visual language

**[Bertin, *Semiology of Graphics* (1967)](https://www3.cs.stonybrook.edu/~mueller/teaching/cse564/bertin.pdf)** ([short version](https://www.axismaps.com/guide/visual-variables))
The seven visual variables — position, shape, orientation, colour, texture, value, size —
and which kind of meaning each can carry. _Take_: the answer to “should this be a shape or
a colour?”, which is the question [`VISUAL-LANGUAGE.md`](VISUAL-LANGUAGE.md) rests on.

**[Isotype — Neurath and Arntz](https://en.wikipedia.org/wiki/Isotype_(picture_language))** ([Arntz archive](http://gerdarntz.org/content/gerd-arntz.html))
A designed picture *language* with a grammar, not a set of icons; 4,000 symbols from one
rule set. _Take_: a tiny vocabulary scales only if the rules are strict.

**[Otl Aicher, Munich 1972](https://www.piktogramm.de/en/system)**
Every figure from one grid, fixed angles, one stroke weight. Its own documentation calls
the rules “comparable with the rules of grammar for a language”. _Take_: grammar before
vocabulary, and geometry written down rather than eyeballed.

## Method

- Bret Victor, [Up and Down the Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/) — rungs, stepping down, abstracting over a parameter.
- Bret Victor, [Media for Thinking the Unthinkable](https://worrydream.com/MediaForThinkingTheUnthinkable/) — seeing all behaviour at once; multiple representations.
- Nicky Case, [How I Make Explorable Explanations](https://blog.ncase.me/how-i-make-an-explorable-explanation/) — process rather than example.
- [awesome-explanations](https://github.com/BHSPitMonkey/awesome-explanations) — a broader list to browse.

## The primary source for the current work

- Ruslan Spivak, [Let's Build A Web Server, Part 1](https://ruslanspivak.com/lsbaws-part1/), with [Part 3](https://ruslanspivak.com/lsbaws-part3/) as the onward link for sockets.
