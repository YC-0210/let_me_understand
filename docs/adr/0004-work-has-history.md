# Work has history

The **ring** now records the work a place has already done, not only the work it is doing.
A place's jobs in one exchange divide its ring into consecutive arcs: each job begins
exactly where the previous one stopped, finished arcs stay on screen at 38% opacity, and
the arc in progress sweeps at full strength.

Part 1 needed none of this — the server worked once. In part 2 the server works three
times in a single exchange (parses the request, builds `environ`, constructs the
response) and the application works once. Drawn the part 1 way, each job was the same
circle ringing again with nothing saying which time it was, so a reader could not tell the
third job from the first.

## Considered options

Three were built and compared in `prototype/part2/work.html`:

- **Rings outward** — one ring per job, growing. Countable, but the place visibly grows,
  and under Bertin size means *quantity*: a busy server would read as a big server. It
  also crowds its neighbours and has no end.
- **A ring divided into the jobs ahead** — one radius, sliced, unreached slices faint.
  Legible, but it shows the future, which nothing else in the language does, and it
  cannot be drawn for a system still running.
- **Consecutive arcs** — chosen. Costs nothing in size or layout, needs no foreknowledge
  beyond the count, and makes consecutiveness literal: the arcs touch.

## Consequences

**Work never takes an outcome colour.** Colour rule 2 says a mark earns colour by
carrying data, and work carries none — it is the same act whatever comes back. Tinting
finished rings by the result also made earlier jobs change colour retroactively when the
response arrived, which is a lie about history.

**The finished ring is seamless**, so a place that has done all its jobs looks like a
place wearing one plain ring. The consecutiveness is legible while the exchange runs and
not after it. This is the accepted cost of the option: the alternatives paid in size or
in showing the future, and those were judged worse.

**A place's job count must be known to draw it.** The arcs divide by the number of jobs
that place has in the exchange, which the Model supplies. A place whose jobs are not
known in advance cannot use this and would need its own decision.
