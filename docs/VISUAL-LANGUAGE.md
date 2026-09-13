# Visual language

The marks every visualization in this project is built from, and the rules for using
them. This is a **closed system**: a new mark or a new hue needs an ADR, not a
judgement call in the moment.

Rests on [Bertin's visual variables](https://www.axismaps.com/guide/visual-variables) —
shape carries *kind*, colour carries *state*, position carries *time*, size carries
*quantity* — and on the grammar-first approach of
[Isotype](https://en.wikipedia.org/wiki/Isotype_(picture_language)) and
[Aicher's 1972 system](https://www.piktogramm.de/en/system), where a small vocabulary
scales because its rules are strict.

See [`REFERENCES.md`](REFERENCES.md) for the wider reading.

---

## 1. The marks

Eight. Nothing else may be drawn.

| Mark | Geometry | Means |
|---|---|---|
| **Circle** outline | r 42 · stroke 2 | A **place that persists** — you, the server |
| **Disc** filled | r 8 | A **thing in motion** — one message |
| **Held disc** filled, faint | r 22 · 22% fill · stroke 2 | A thing **at rest inside a place** |
| **Line** | stroke 2 · round cap | A **channel** between two places |
| **Arrowhead** chevron | stroke 2.5 · 9px arms | **Direction of travel** |
| **Ring** sweeping arc | r = place + 9 · stroke 2.5 | **Work taking time**, around whatever is doing it |
| **Cross** two strokes | stroke 2 · 9px arms | **Absence** — nothing is there |
| **Trace** dashed line | stroke 1.5 · dash 3 4 · 45% opacity | A path something **has already taken**. History, not structure — it outlives the channel it used. [ADR 0003](adr/0003-the-trace-mark.md) |

### Grammar

1. A **disc** never exists without a **line** to travel on.
2. An **arrowhead** never exists alone — always attached to a disc or a line.
3. A **ring** only ever surrounds a **circle**, never a disc. Work is done by places, not
   by messages.
4. A **cross** replaces a disc. They never appear together.
5. A **circle** persists for the whole scene. A **disc** exists only while travelling.
6. Text **names** marks. Text never explains inside the drawing — explanation lives
   behind a door (§5).

---

## 2. Colour

Three roles. Everything else is grey.

| Role | Token | Used for |
|---|---|---|
| **Structure** | `--ink-subtle` `#8a8f98`, channels `--hair-strong` `#34343a` | Every mark that persists and does not move |
| **The reader's action** | `--accent` `#5e6ad2` | Whatever the reader caused — the request they sent |
| **Outcome: present** | `--ok` `#27a644` | A thing came back |
| **Outcome: absent** | `--no` `#d95448` | Nothing came back |

### Rules

1. **Colour never decorates.** Remove a colour; if nothing becomes unknowable, that
   colour should not have been there.
2. **Grey is the default.** A mark earns colour by carrying data. Structure is always
   grey — colouring the actors would spend the channel on something that never varies.
3. **Status is never colour alone.** Absence always carries the **cross**; the red only
   reinforces it. Measured: green against red separates by ΔE **0.9** under
   deuteranopia — indistinguishable. Accent against green separates by **26.5** and is
   safe to read by colour.
4. **One accent, forever.** No second hue for emphasis. Emphasis is size, surface lift,
   or motion.
5. **Any new hue must pass the validator** in both modes before it is used:
   `node scripts/validate_palette.js "<hex,…>" --mode dark`
   (from the `dataviz` skill). Lightness band, chroma floor, CVD separation, contrast.
6. **Text takes text colours** — never a data colour — with one exception: a value that
   *is* the datum (the page name riding the dot, the body that came back).

---

## 3. Motion

1. **Travel eases. Work is linear.** An eased progress arc reads as something moving;
   labour has no acceleration.
2. **Duration is meaning.** The longest beat belongs to the step the reader cannot
   otherwise see. The server working is 1500ms; each leg of travel is 1100ms.
3. **Nothing animates that is not happening.** No decorative pulses, no idle drift.
4. **`prefers-reduced-motion` renders the final state.** Not a faster animation — no
   animation.
5. **Time is pausable, and pausing is offered**, not hidden. Elapsed time accumulates
   only while running, so a pause freezes the exact instant.

---

## 3a. Steps

The independent variable is the **step** — a named state of the system, not a moment in
seconds. Steps are discrete, few, and drawn from what the source actually says happens.

1. Every step has a **name in the source's own terms**. If the source does not describe a
   state, there is no step for it.
2. The reader can **move to any step directly**, forwards or backwards, with a slider.
   Playing walks the same steps; it is a convenience, not the only way through.
3. A step's animation shows the **transition into** that step. Landing on a step shows its
   completed state.
4. **Every step in the source is drawn.** See §7.

## 4. Layout

- One drawing per idea. A second idea gets a second drawing.
- Places sit on one horizontal axis; the channel runs between them.
- The reader's side is **left**. The system's side is **right**.
- Names sit **below** their mark. Values ride **above** the mark carrying them.

---

## 5. Interaction

1. **The word is the door.** Captions are what the reader clicks. Marks are never
   buttons — a circle that is also a button stops being a symbol and becomes a control.
2. **A door looks like a link**: dotted underline, accent colour. Where the caption *is* the
   datum — the page name riding the dot, the body that came back — it **keeps its data
   colour** and the underline alone makes it a door. Colour rule 6 wins over the accent;
   the affordance is the underline.
3. **Every mark has a door.** "Some are clickable" is a rule a reader must discover;
   "every one is" is a rule they can guess.
4. **Opening a door stops time**, and closing it resumes from the same instant.

---

## 6. The inventory

Before drawing anything, **list every statement the source makes** — each line of its
code, each named part, each sentence of mechanism — and mark each one:

- **shown** in the drawing,
- **deliberately omitted**, with the reason, or
- **departed from**, under [ADR 0002](adr/0002-departing-from-the-source.md).

Nothing may be in none of those three buckets.

This rule exists because the first version of the part 1 drawing silently dropped
`client_connection.close()` — a line in the article's own code, present in the captured
data, and simply never drawn. It was missed because the drawing was built as a story that
ends when the telling ends, rather than as a model of what the program does. An inventory
is the cheap thing that catches it.

## 7. Changing this document

A new mark, a new hue, or a break from any rule above needs an ADR in
[`adr/`](adr/), for the same reason a Departure does: the value of a closed system is
entirely in its being closed.
