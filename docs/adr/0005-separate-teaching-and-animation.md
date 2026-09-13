# Separate teaching decisions from animation decisions

The user approved two independent libraries. This branch tests that separation with
small, inspectable example cards, a two-pass preparation/build workflow, and two
interactive lessons. It supersedes the single-axis and eight-mark restrictions only
inside `experiment/`: interval bars and array cells are needed to represent time and
search ranges. Their labels state what they mean. Dark surfaces and the existing
accent palette remain. Essential teaching is visible, never hidden in caption doors.

Teaching plans contain learner prerequisites, intentions, explanations, and checks;
they do not choose renderer names. A subsequent selection maps visual requirements to
animation cards. Cards distinguish observations from our interpretations and track
review status. None claim learner validation yet.

The coding agent authors plans using prepared context. The local build validates and
assembles them deterministically; it does not pretend to call an LLM or train weights.
The study collection is small and deliberately limited. The test is whether these
separate ingredients produce better explanations, not proof that automation is solved.

The original checkout and its uncommitted prototypes remain untouched. This branch
is developed in a separate git worktree based on commit 4c27a7e.
