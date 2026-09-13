# Scope and evidence before drawing

## Server lesson
Source: https://ruslanspivak.com/lsbaws-part3/

Keep: iterative accept/receive/send/sleep/close sequence; the difference between an answer arriving and a connection closing; waiting in a queue versus being handled; child processes let the accepting process return to work. Introduce “process” through the already visible occupied program. Explain overlap before naming concurrency.

Bound this lesson to the waiting problem. Socket descriptor sharing, reference counts, close-copy discipline, and zombie collection require separate lessons; they are not slipped into this one.

Measurements: run two actual local TCP clients against serial and forked Python servers. Send a response without a content-length, then deliberately sleep 0.6 seconds before closing. The article uses 60 seconds. Three B arrival settings are captured. The response arrives before EOF, so the visualization marks these separately. Client-side receipt times include scheduling overhead; timeline handling intervals approximate server occupancy from receipt through EOF. No claim of a production performance benchmark. Playback stretches recorded seconds for readability.

## Search lesson
Source context: https://docs.python.org/3/library/bisect.html

Keep: sorted order and halving the possible range. Our authored demonstration searches for an exact member in 1…16; Python bisect returns insertion positions and is not this exact algorithm. Hidden cards represent access to one array value per check. All targets are present and distinct. Comparison counts are executed algorithm traces, not measured runtime. The target 1 is an intentional counterexample to “binary always wins.”

## Rendering
A timeline represents recorded time; positions stay fixed. Amber means unanswered wait, purple means connection remains open after the answer, green marks receipt of the answer. The card strip represents fixed positions; exclusions fade but never move. Comparison bars use one common scale and explicitly state their units.

Sources attached to library cards support their observations; adaptations are labeled interpretations. These patterns have not been validated with learners. A pleasant demo or passing test is not evidence of effective teaching.
