# let_me_understand — glossary

The canonical language for this repo. Use these words in code, commits and docs; when a
definition here stops being true, change it here first.

See [`MISSION.md`](MISSION.md) for why the project exists.

---

## The material

**Source**:
A piece of writing being made usable, together with any further reading it is checked
against. Carries a tier: the **primary source** is the one article the Visualization is
built for; a **reference** is a high-quality external work used to check a Departure.
_Avoid_: the article, the docs, content

**Model**:
The explicit, human-readable description of the system inside a Source — its parameters,
its states, and what it does. Everything drawn is a function of the Model; nothing is
drawn from the Source directly.
_Avoid_: the spec, the schema, the data

**Evidence**:
What backs a single claim in the Model. A **Witness** is a real event captured from
really running the system; a **Citation** is a span in a Source. A claim with neither is
marked unsupported and rendered differently.
_Avoid_: proof, provenance, backing

**Departure**:
A place where the Visualization deliberately shows something the primary Source does not
contain, because the main explanation needs it. Legitimate only when checked, real and
marked. The one-line routing change to `webserver1.py` is the first one.
_Avoid_: extension, liberty, simplification

---

## What the reader sees

**Visualization**:
The finished page for one Source — the Model made operable.
_Avoid_: the demo, the app, the widget

**Main line**:
The explanation the Visualization is built to deliver, kept to the primary Source. Always
visible once unfolded.
_Avoid_: the happy path, the core

**Branch**:
An opt-in note hanging off one element, going further than the primary Source. Carries
its tier openly: *from the article* or *beyond the article*. A Branch earns its place by
closing back onto something the reader just did.
_Avoid_: tooltip, aside, extra

**Fold**:
The boundary between what a reader sees before they have done anything and what waits
until they ask. Above it sits only what an ordinary person has already experienced.
_Avoid_: collapse, accordion, progressive disclosure

---

## The ladder

**Parameter**:
The one thing the reader turns. Its values must be either ordered or partitionable, so
that a Rung above the ground has something to lay out; a set of choices that is neither
is a menu, not a Parameter.
_Avoid_: input, option, setting, knob

**Region**:
A set of Parameter values sharing one Metric outcome. What an unordered Parameter offers
in place of an order, and what a Rung above the ground draws: the three page names the
server knows are one Region, every other name is the other.
_Avoid_: group, bucket, category

**Metric**:
The single readable outcome that a Parameter's value produces. What a Rung above the
ground plots, lists or lays out.
_Avoid_: output, result, measure

**Rung**:
One level of abstraction over the system. **Rung 0** is fully concrete: one value of the
Parameter, one moment. Each Rung above abstracts over one more dimension.
_Avoid_: level, layer, view, zoom

**Stepping down**:
Moving from a point in an abstract Rung to the concrete instance behind it. Every Rung
above the ground must offer it.
_Avoid_: drill down, zoom in, expand
