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


## The learning collection

**Personal collection**:
The Visualizations and reusable patterns a learner keeps for revisiting and future use.
Membership does not imply understanding or permission to reuse an item as an example.
_Avoid_: learned lessons, references

**Reusable example**:
A Visualization eligible to guide how a future Visualization teaches or animates an idea.
This is distinct from an external reference Source used to check accuracy.
_Avoid_: reference (when meaning an example of teaching or animation)

**Example exclusion**:
A learner’s choice to make a Visualization ineligible as a Reusable example while keeping
it available in the Personal collection.
_Avoid_: delete, hide, forget

**Learning check**:
A question or task whose assessed response provides evidence of the learner’s understanding.
Viewing or finishing a Visualization is not itself a Learning check.
_Avoid_: completion, self-assessment


**Visualization version**:
A preserved edition of a Visualization that remains revisitable when a newer edition is added.
Changes to a reusable pattern do not by themselves replace a saved edition.
_Avoid_: latest (when referring to a specific preserved edition)

**Check result**:
The recorded outcome of an assessed response to a Learning check, used as evidence of understanding.
It is distinct from viewing progress and does not itself change a Visualization’s teaching.
_Avoid_: watched, completed


**Concept**:
A distinct source-backed idea in an approved list, which may be taught by more than one Visualization.
Repeated appearances share the same Understanding mark; a changed idea is a separate Concept.
_Avoid_: paragraph, term count, slide

**Approved source set**:
The agreed subject sources used consistently to define and support Concepts, distinct from
sources used to guide explanation style.
_Avoid_: automatically selected references

**Understanding mark**:
A learner’s explicit checkbox choice that they understand a Concept, without automated assessment.
It is self-reported understanding, not a Check result or a consequence of generating or viewing a Visualization.
_Avoid_: demonstrated mastery, test score, completion


**Lesson package**:
A portable authored Visualization edition with the material needed to display it offline
and its associated concept/source information.
_Avoid_: project folder, generated URL

**Reuse approval**:
The learner’s permission for a particular Visualization version to serve as a Reusable example.
Approval of one edition does not approve a changed edition.
_Avoid_: collection membership, blanket approval
