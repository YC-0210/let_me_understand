# Mission: making a text you are reading into something you can use

## Why

I is the user.

I read technical writing — tutorials, specifications, papers — and I can follow the
sentences without being able to see the thing they describe. The words go in, a vague
picture forms, and I cannot tell whether the picture is right. Diagrams in articles do
not fix this, because a diagram shows one state and leaves me to simulate the
transitions in my head.

So this is the tool I want to read with: it takes one piece of writing and turns the
system inside it into something I can operate.

This is a spin-off of [`Ultimate Visualization`](https://github.com/YC-0210/Ultimate-visualization-).
That project makes my own running code visible. This one makes someone else's writing
visible. They share principles and vocabulary and no code at all.

## Principles

Five, and they decide arguments rather than describe them.

1. **Never show behaviour the system does not have.** A picture that is easier to
   understand and untrue is worse than no picture. When a demonstration seems to need
   invented behaviour, that is a finding about the system, not a licence.

2. **The visualization may depart from the source when the main explanation needs it.**
   Strict fidelity produced a page where nothing a reader clicked changed anything,
   which teaches less than a marked departure does. A departure is legitimate when all
   three hold: it is **checked** against several high-quality references, it is **real**
   — actually built and actually run, never mocked — and it is **marked** at the point a
   reader meets it, never in a footnote. See [ADR 0002](docs/adr/0002-departing-from-the-source.md).

3. **Never make the reader bridge an unexplained gap. Adapt to what they know, reveal
   complexity gradually, and provide context at the moment it becomes necessary.** Begin
   with what the reader already understands, keep deeper detail folded away until it is
   useful, and name each new element when it first enters the explanation. Use the source's
   own words where the source names it, while explaining unfamiliar language in place.

4. **A parameter the reader can turn, not a menu they can pick from.** A control with no
   order cannot be plotted against, so nothing can be built on top of it. This is what
   makes the ladder possible; without it there is only the ground rung wearing different
   clothes.

   Where a Parameter genuinely has no order — a page name, a method — it can still be
   **partitioned** into regions that share an outcome. Partitioning is how an unordered
   Parameter supports a Rung above the ground: not a plot, but a picture of the space
   and the regions in it.

5. **Start at the bottom of the ladder and climb with the reader.** One parameter, fully
   concrete, before any abstraction. Every abstract view must offer a way back down to
   the concrete instance behind any point in it. From Bret Victor's
   [*Up and Down the Ladder of Abstraction*](https://worrydream.com/LadderOfAbstraction/)
   and [*Media for Thinking the Unthinkable*](https://worrydream.com/MediaForThinkingTheUnthinkable/).

## Success looks like

- I open a Visualization beside an article I am reading, turn one thing, and see the
  system respond — without having to hold the rest of it in my head.
- I can climb to a view that shows every value of that parameter at once, notice a
  pattern, and click straight back down to the single case that explains it.
- Someone with no foundation opens it, understands the first screen, and chooses to go
  deeper rather than closing the tab.
- It works on a second article I did not design it around.

## Who does what

- **Claude writes the code.** This is the deliberate opposite of the parent project's
  learn-by-building constraint, decided once the visual language had taken shape.
- **The user supplies the judgement**: what helps a person learn and what gets in the
  way. Every design decision in `docs/VISUAL-LANGUAGE.md` came from that judgement being
  applied to something built and rejected.

## Out of scope

- Text with no system in it. If there is nothing to vary, there is nothing to see.
- Being a general authoring tool for other people. One reader, one article at a time,
  until that works.
- Automatic extraction. A Model is authored and checked by a person; nothing draws a
  picture straight from prose.

## Standalone guidance

Assume the reader has not read the Source. Wink establishes the situation and the
problem before asking the reader to operate anything. At each step, explain what
changed, why it matters, and what to do next. Essential explanations stay visible;
clickable terms add depth. Each new idea follows from a limitation the reader has
already seen. Do not make a vocabulary quiz the entrance requirement.

Before naming a new concept, establish the problem that makes it necessary and show
a concrete instance. Introduce its name by pointing to that instance. A definition
alone is not enough if it requires other unexplained concepts. Apply this sequence
to diagram labels and controls as well as to Wink’s narration.
