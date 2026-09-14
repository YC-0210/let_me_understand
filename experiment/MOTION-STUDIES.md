# Motion variations for A04–A06

Open `/experiment/web/#studies`. These are independent comparison demos; the existing chapters and animation cards remain available. The “Compare with original pattern” control displays the same case through the original box-based renderer at the corresponding stage.

- A04: explicit pointers from Python Tutor inspire handles connecting to one socket. A fork adds a handle; one close leaves another live; the last close permits the response stream to end. https://pythontutor.com/
- A05: RaftScope’s spatial message-passing view inspires requests moving between stable process locations. Child workers appear while the parent keeps accepting. This depicts request responsibility, not literal TCP packet routes or the Raft algorithm. https://raft.github.io/raftscope/index.html
- A06: Bostock’s visible movement and membership changes inspire individual exit records being collected. Three children finish before one pending notification is handled; one wait leaves two records, continuing the loop clears them. https://bost.ocks.org/mike/algorithms/#shuffling

All SVG artwork and motion here are authored adaptations. Their behaviors follow the already recorded Unix probes; the ten-second timing is explanatory, not measured wall time. A filled circle denotes a running child; a hollow circle denotes an exit record. Request and reply dots have different colors and travel in distinct directions. A04’s short transverse bar denotes the end of the sending stream; Wink explains it as it happens.

All positions and states are computed from one deterministic clock, including arbitrary scrubbing, restart, pause, and manual advancement. Reduced-motion mode skips animated travel. Wink expands the interpretation and source notes without playing over the reader. There are no idle animations.

Validation: `node experiment/tests/test_motion.cjs` checks handle/record counts and renders 303 clock samples across the three models. This establishes state and rendering consistency, not whether viewers understand the idea within ten seconds; that is the user's comparison task.

## Wink-guided playback

The default playback is now a guided tour, with five or six authored focal stops per study. Wink travels for one second, then the scene holds still for a full ten-second reading interval. A dashed, unfilled ring identifies the focus without covering it. Speech appears when Wink arrives. Play/pause stops the shared clock, including flights. Back, Next step, and the step slider allow manual inspection.

Wink uses authored docks beside the actual focus object, mapped through the SVG coordinate transform on every screen size. Speech selects nearby empty space after checking all visible SVG shapes, labels, paths, and Wink. When no safe space fits, only speech moves below the diagram. During flight the diagram renders in front of Wink, so moving guidance cannot obscure system marks. Reduced-motion mode relocates without animated travel. Hidden tabs do not consume reading time. Existing model timing remains schematic and is separate from presentation pauses.
