# Places that begin and end

Relaxes two rules in [`VISUAL-LANGUAGE.md`](../VISUAL-LANGUAGE.md) so that a **process**
can be drawn:

- §1 grammar rule 5 said *"a circle persists for the whole scene."* It now reads: a circle
  persists for as long as its place exists. A place may be **created** and may **end**
  inside one scene.
- §1 grammar rule 4 said *"a cross replaces a disc."* A cross may now also replace a
  **circle**, meaning the place that stood there is gone.

Parts 1 and 2 needed neither. Both drew a fixed cast — you, the server, the application —
that existed before the reader arrived and outlived the exchange. Part 3's entire subject
is a place that did not exist a moment ago: `os.fork()` is called once and returns twice,
and the second return is in a process that the first line of the program never mentioned.
A vocabulary in which circles cannot appear cannot draw the article.

## What a zombie is, in marks

A zombie is the case that forced the second relaxation. It is a process that has
terminated but whose parent has not yet collected its termination status, so the kernel
still holds an entry for it. It is therefore neither a place that is there nor a place
that is simply gone.

Drawn as a **cross where the circle was**: the process is absent — that is what the cross
has always meant — and the fact that the drawing still spends a position on it is the
whole problem the article is describing. The cross is removed when, and only when, the
parent waits for it. A reader who cannot get rid of the crosses has understood the
sentence *"you can't kill a zombie, you need to wait for it"* without being told it.

## Considered options

- **A second kind of circle — dashed, or half-toned — for a dead process.** Rejected:
  dashed already means trace/history ([ADR 0003](0003-the-trace-mark.md)), and a new
  value ramp for "less alive" is a new visual variable for one idea.
- **Removing the child's circle at exit and counting zombies in text.** Rejected: it makes
  the zombie invisible in the drawing and readable only in a caption, which is the part-1
  failure — a number beside a picture that does not contain it.
- **Never drawing children at all; drawing concurrency as more rings on the parent.**
  Rejected: it is untrue. The article's point is that the work moves into *another
  process*, with its own descriptors and its own death. Rings on one circle would draw a
  threaded server, which is not what the code does.

## A place may hold more than one thing at rest

§1 gives the **held disc** one size, r 22, because parts 1 and 2 never had a place holding
two things at once. Part 3 does: the parent holds a listening descriptor and one
descriptor per connection it has not closed, and the article's central claim — *"the
kernel closes the socket only when its descriptor reference count becomes 0"* — is a claim
about **how many**.

Where a place holds more than one thing, every held disc is drawn at one fixed smaller
radius, r 7, inside the circle. Fixed, because under Bertin size means quantity: if held
discs shrank as they multiplied, a place holding four would look like a place holding
less. Quantity is carried by **number**, and number alone.

## Consequences

**Instances of a place-kind stack vertically.** §4 keeps one horizontal axis per *kind* of
place — clients left, the parent centre, its children right — and multiplicity runs down
the screen. Without this, N clients and N children have nowhere to be.

**The drawing has a population, and the population is the reading.** How many circles, how
many crosses, and how many held discs are left at the end is what distinguishes the
article's six servers from one another. No new mark carries it; counting does.

**A cross is now ambiguous unless position disambiguates it.** A cross on a channel means
nothing came back; a cross on a place means the place is gone. They are never in the same
position, and the caption under every mark names which it is. If a future drawing puts
them in the same position, this ADR is what has to change.
