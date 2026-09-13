# Handoff

Written at the end of the session that built part 1. The next session does **part 2**.

Kept in the repo rather than a temp directory because this project is worked on from
ephemeral containers — nothing outside git survives.

---

## Read these first, in order

| | |
|---|---|
| [`MISSION.md`](../MISSION.md) | Why the project exists, five principles, who does what |
| [`docs/VISUAL-LANGUAGE.md`](VISUAL-LANGUAGE.md) | **The binding spec.** Eight marks, three colours, grammar, steps, the inventory rule |
| [`CONTEXT.md`](../CONTEXT.md) | Vocabulary. Use these words |
| [`docs/adr/`](adr/) | Three decisions that are hard to reverse |
| [`prototype/README.md`](../prototype/README.md) | What each dead prototype settled |
| [`DESIGN.md`](../DESIGN.md) | Surfaces, type, spacing — from `npx getdesign add linear.app` |

`docs/visual-language.html` is the spec rendered so it can be checked by eye.

## The state of things

Part 1 is **done**. One page, `prototype/part1/ask.html`, built from
`ask.template.html` + `pages.json`. It draws a web request as seven named steps with a
slider, every caption a door into an explanation, and every byte captured from a real
run of the article's own server.

Rebuild command is in [`prototype/README.md`](../prototype/README.md). **Never edit
`ask.html` directly** — it is template + data.

No prototypes are open. Working tree is clean. Branch: `claude/nifty-bohr-u1hu9v`.

## What part 2 is

[Let's Build A Web Server, part 2](https://ruslanspivak.com/lsbaws-part2/) — WSGI. A
~150-line server, an `environ` dict, a `start_response` callable, and the same server
running Pyramid, Flask, Django and a bare app unchanged.

### Do this first

**The inventory** (`VISUAL-LANGUAGE.md` §6). List every statement the article makes —
each line of its code, each named part, each sentence of mechanism — and put each into
exactly one of: shown, deliberately omitted with a reason, departed from under ADR 0002.
This rule exists because part 1 silently dropped `client_connection.close()`. Do not
start drawing before the list exists.

### Three things that will test the spec

1. **Three participants, not two.** Client, server, and the framework application. The
   vocabulary was derived from two circles and one line. A third place may fit, or may
   need an ADR.
2. **The subject is a dict, not a journey.** Part 1's insight was *something travels*.
   Part 2's is *the same thing is handed to four different programs and they all
   understand it*. A disc carrying `environ` may work; it may not. This is the real test
   of whether the marks generalise, which nothing so far has established.
3. **Capture needs real frameworks.** `pip install flask pyramid django` inside the
   container, then run the article's `webserver2.py` against each. Follow
   [ADR 0001](adr/0001-capture-real-present-authored.md): capture real, present authored.
   If a framework will not install, say so rather than faking the output.

## Decided this session, don't relitigate

- **Claude writes the code.** The user supplies judgement on what helps someone learn.
- Steps are the independent variable; a slider reaches any of them directly.
- The word is the door. Marks are never buttons.
- Departures from the source are allowed when **checked, real and marked** (ADR 0002).
- Dark canvas only. One accent. Status never by colour alone.

## Still open

- **Does the real page move out of `prototype/`?** It is the product living in a folder
  named throwaway. Probably resolve it when part 2 needs a structure holding two pages.
- **Who opens this?** `MISSION.md` says one reader — you. The user originally said "for
  people". Different projects: one needs nothing, the other needs hosting and drawings
  that stand alone. Unconfirmed.

## Suggested skills

Call the Skill tool for:

- **`domain-modeling`** — when part 2 introduces vocabulary (`environ`, the application
  callable). `CONTEXT.md` is a glossary only; ADRs go in `docs/adr/`.
- **`artifact-design`** — before writing any artifact. `DESIGN.md` and
  `VISUAL-LANGUAGE.md` take precedence over its defaults.
- **`dataviz`** — only if a chart appears. Its `scripts/validate_palette.js` is required
  by the colour rules before any new hue ships.
- **`prototype`** — when a design question needs answering rather than arguing. The
  pattern that worked all session: build 2–4 variants in one switchable page, let the
  user pick, delete the losers, record what was settled.
- **`grilling`** — if the user wants to stress-test a direction before building.

## How to work with this user

- **One question at a time**, short. Long multi-part questions did not land.
- **Be brief.** Verbose answers get in the way. Say the thing, stop.
- **Put every decision in one place**, at the very bottom, under the heading
  `Decision for you to make :` — never scattered through the prose.
- **Build to decide.** Every good decision this session came from seeing options side by
  side, not from discussion.
- **Render before publishing.** Use the headless Chromium at `/opt/pw-browsers/chromium`
  via Playwright and actually look at the page. Structural assertions missed an unclosed
  `</style>` that shipped a blank page, and missed a label sitting on top of a line.
- **Say what is untrue or unverified.** The user values this; several good decisions came
  from flagging that something was fabricated or unmeasured.
