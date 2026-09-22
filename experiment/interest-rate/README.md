# Interest rate — experiment, 2026-09-20

25 manually advanced screens; source boundary 00:00–08:17 of 小Lin说's [关于利率，你需要知道的那些事儿](https://www.youtube.com/watch?v=u3Q9BpZOhP8). A new independent package, not a revision of Natural hierarchy of money. All examples are invented; no live market data or forecast.

Learner problem: “the interest rate” sounds like one number chosen by one institution. Start with a familiar $100 bike-repair loan, establish principal/interest/time, then show multiple rate ingredients, maturities, and policy versus market pricing.

## Reference review

Read the provided transcript through 8:17. Inspected selected frames/sequences directly in the video player, not uninterrupted playback of the entire segment:

- 0:50–1:02: a large $100/$102 timeline introduces time before jargon.
- 1:45: staged directional arrows connect a rate cut to spending/investment/saving.
- 1:55: recognizable goods and people around a circular spending chain.
- 2:45: concrete retail footage grounds the demand/price constraint.
- 4:05: one loan-rate bar split into benchmark, risk and margin.
- 5:40–5:45: maturity dots appear before a connecting curve and its label.
- 6:05: the same curve framework changes to a downward slope.
- 6:45–6:50: spotlight the overnight column and dim the remaining points.
- 7:15: grocery-shopping imagery with government-bond/MBS labels makes central-bank purchases concrete.
- 8:10: return to the division between short-rate steering and longer-rate influence.

Adaptations: original diagrams, local Phosphor pictograms, progressive construction, stable numeric/spatial anchors, fixed 30-unit transfer glyphs at 100 SVG units/second; bidirectional exchange lanes remain separate. Wink points at the focus and speaks directly below the graph. No copied video imagery or source narration.

## Reading and accuracy

See sources.html for primary economics references and deliberate qualifications. Unlike the source's shortcuts: rate cuts are not guaranteed prosperity/inflation, interest is not the same unit as the rate, government debt is not universally riskless, and policy expectations can strongly affect long yields. Overnight is a loan term, not the quotation basis for the rate. QE is an asset swap, not free money handed to every borrower.

## Files

- plan.js: teaching sequence, concise cues, disclosures, source timestamps.
- model.js: illustrative arithmetic and linear travel.
- render.js: standalone SVG diagrams.
- lesson.js: six-second animation clock, manual navigation, pause/replay/scrub, optional unscored predictions.
- patterns.json and preview-*.html: four direct animation-library players, associated with this experiment edition.
- lesson.json: importable application package, unique lesson and concept IDs.

No automatic understanding marks or reuse approvals. Existing app inline text edits and per-edition notes work with this package. All runtime assets are bundled offline; external links are only optional sources.

Checks: `node experiment/tests/test_interest_rate.cjs` and `python3 -m unittest discover -s mac-app/Tests -p test_interest_packaging.py`.

## Verification for this edition

- All 25 screens traversed at 1280×720 and 390×844; completed-state text boxes had no intersections or horizontal overflow.
- Exercised all 31 example/answer buttons; checked 5% gives $105 and a $102 purchase price for a $105 payment gives about 2.94%.
- Checked Wink clearances and moved it clear of return-payment and numeric labels.
- 16 Swift store tests and all 5 packaging tests pass; lesson math/motion/cutoff checks pass; no browser console errors observed.
- Installed app: Interest rate folder opens the 25-screen offline lesson; all four extracted preview pages render diagrams with advancing playback sliders.
- The lesson's teaching effectiveness still needs reader feedback. The review used transcript reading and selected visual sequences, not continuous viewing of all eight minutes.
