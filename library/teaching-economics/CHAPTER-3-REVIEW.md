# Chapter 3 review · 20 September 2026

## Coverage and honesty

Primary source: user-supplied Money and Banking notes, Fall 2016, printed pp. 15–21. All nine Coursera English transcripts read end to end. All nine 1280×720 videos downloaded and duration/streams verified: 62 minutes 2 seconds total. Visual scan: one frame every 20 seconds across each full timeline, 19 contact sheets, plus the native table frame. This is a sampled visual review, not continuous playback or a claim to have watched every second. Short gestures between sampled frames can be missed.

Local authorized source archive: `/Users/chen/Documents/ChatGPT/course-materials/money-banking/chapter-03`. Each numbered segment has MP4, TXT and VTT; `media-inventory.json` records media metadata. Original media and expiring signed download links are not packaged or committed. The lesson works offline without them.

## Segment inventory

- [FT: Quantitative Easing and the Fed](https://www.coursera.org/learn/money-banking/lecture/ARGmh/ft-quantitative-easing-and-the-fed) — `01-qe`: full transcript and complete 20-second visual scan.
- [Allyn Young: Money and Economic Orthodoxy](https://www.coursera.org/learn/money-banking/lecture/0l8qe/allyn-young-money-and-economic-orthodoxy) — `02-young`: full transcript and complete 20-second visual scan.
- [National Banking System, Before the Fed](https://www.coursera.org/learn/money-banking/lecture/m8Imm/national-banking-system-before-the-fed) — `03-before`: full transcript and complete 20-second visual scan.
- [Civil War Finance: Bonds and Loans](https://www.coursera.org/learn/money-banking/lecture/2ubsa/civil-war-finance-bonds-and-loans) — `04-loans`: full transcript and complete 20-second visual scan.
- [Civil War Finance: Legal Tenders](https://www.coursera.org/learn/money-banking/lecture/qeAsT/civil-war-finance-legal-tenders) — `05-tender`: full transcript and complete 20-second visual scan.
- [National Banking System: Origins](https://www.coursera.org/learn/money-banking/lecture/iGdz9/national-banking-system-origins) — `06-origins`: full transcript and complete 20-second visual scan.
- [National Banking System: Instability](https://www.coursera.org/learn/money-banking/lecture/npCnS/national-banking-system-instability) — `07-instability`: full transcript and complete 20-second visual scan.
- [Federal Reserve System: Plan](https://www.coursera.org/learn/money-banking/lecture/tP0QJ/federal-reserve-system-plan) — `08-plan`: full transcript and complete 20-second visual scan.
- [Federal Reserve System: Actual](https://www.coursera.org/learn/money-banking/lecture/JFnZd/federal-reserve-system-actual) — `09-actual`: full transcript and complete 20-second visual scan.

## Teaching sequence

One learner problem: a payment is due before acceptable means of payment are available. Trace who needs to pay, what they hold, what they owe, the response, and the next constraint. 49 screens; six compact recaps. The learner takes the Treasury, investor, supplier, country-bank, New York-bank and Fed viewpoints. The role is always explicit above the question.

User annotations determine the four central bridges: war-finance deposit → demand for gold; suspension → what deposits promise now; seasonal reserve imbalance → reserves as credit; private-commercial-credit Fed plan → wartime government financing and later active operations. The original hierarchy chapter is preserved.

The whiteboard retains assets left/liabilities right. Each transaction now reveals one entry per explicit click, with Wink by the current row and synchronized narration. The initial six-second automatic sequence was too fast; the learner now controls every entry and explanation. Transactions remain labeled “entries in progress” until the last entry. Show changes only; do not imply incomplete entries are balanced standalone transactions. Colors reinforce the current focus, not asset/liability identity. No moving tokens, resizing or speed changes are needed for these ledger reveals.

New terms are earned in the story: T-account, bond, convertibility, specie, legal tender, collateral, call loan, clearinghouse, commercial bill, rediscount, open-market operation. Each has an explicit “New word” cue. Detail disclosures hold caveats; recaps contain only Wink, bullets, transition and Continue. Checks are optional self-explanation and never mark understanding or reuse approval.

## Accounting audit

- Investor bond purchase: investor deposit −100 / bond +100; Treasury deposit +100 / debt +100. Bank liabilities change owner, no net new deposit.
- Bank loan: Treasury deposit +100 / loan +100; bank loan asset +100 / deposit liability +100. No new gold.
- Gold withdrawal: Treasury deposit −100 / gold +100; bank deposit liability −100 / gold −100. Loan remains.
- Greenback purchase: Treasury goods +100 / notes +100; supplier goods −100 / notes +100. At cost, before consumption; no omitted profit assumption.
- Note deposit: supplier notes −100 / deposit +100; bank notes +100 / deposit liability +100.
- National notes: bank deposit liability −100 / notes +100; holder deposit −100 / notes +100. Pledged collateral stays on bank assets; statutory ratios not modeled.
- Correspondent withdrawal: country bank city deposit −100 / cash +100; city bank correspondent liability −100 / cash −100.
- Rediscount: bill face 100, carrying value 99, sale price 99. Bank bill −99 / reserves +99; Fed bill +99 / reserves owed +99. Discount earnings accrue later. This avoids silently missing a $1 loss.
- Reserve-to-note conversion: bank reserve asset −99 / notes +99; Fed reserve liability −99 / notes liability +99. Continues the same $99 balance from rediscounting, avoiding an unexplained new amount.
- Secured advance: bank reserves +100 / debt to Fed +100; Fed loan +100 / reserve liability +100. Collateral remains at member bank. Distinguished from the rediscount asset sale.
- Open-market purchase from bank: Fed security +100 / reserves owed +100; bank security −100 / reserves +100. Sale at carrying value. Nonbank seller requires an extra bank-deposit entry and is disclosed rather than implied.

## Data and historical decisions

Reconstructed lecture Table 35.1 in `experiment/money-state/historical-data.json`; observation date explicitly unknown. Country reserves: 199.6 lawful money + 226.7 due from reserve agents + 17.2 redemption fund = 443.5 million. New York reserves 221.3; professor’s hypothetical 50 drain leaves 171.3 (22.6% decline). Historical starting stock and hypothetical shock are visibly labeled separately. No invented time series. Full table is available on the sources page.

Keep 1862 first legal authorization of $150m separate from rounded lecture totals ($400m) and illustrative deposit amounts. Do not imply all gold instantly disappeared after a single 1861 withdrawal. Formal 1879 resumption and late-1878 market parity differ. Avoid applying the lecture’s 2% bond reference to every 1863 instrument. Banknote inelasticity is not an absolute cap on all money. Do not draw the Fed Board as a top bank. Distinguish 1913 rediscounts from 1916 secured advances. WWI government support involved secured lending, not only direct bond holdings; no anachronistic WWI Treasury bills. Open-market powers predated their 1920s coordination.

Authoritative crosschecks and links are in the packaged sources page. The FT/QE and Young segments inform the framing and an optional sources discussion; their full arguments are not another dense detour in the main historical path.

## Validation

Public packaging seam: first added test failed because the chapter package did not exist; implementation must include all offline dependencies and three real extracted players. UI and build verification are recorded in the lesson README once completed. No claim of measured learning effectiveness; reader feedback is still needed on pace and whether role switches make the story easier to retell.

## Narrative continuity revision

Read all 49 screen openings, every entry explanation and all six recap bridges in order.
Announce switches between Treasury, investor, supplier, bank, farmer, dealer and Fed.
Make the gold drain lead into suspension; domestic greenbacks lead back to the unresolved
foreign-payment problem; clearly signal the 1879 look-ahead and 1863 rewind.
Connect the quiet-season loan to its harvest recall. Show the merchant’s bill entering a
bank before rediscounting it. Keep the same $99 through reserve-to-note conversion.
Connect wartime collateral lending to the Fed’s later ability to initiate securities trades.
The accepted Chase introduction, 49-screen count, historical data and manual entry pacing remain.
