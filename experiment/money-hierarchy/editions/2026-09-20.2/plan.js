/* Source: user-supplied Mehrling course notes, printed pp. 7–14 (PDF pp. 8–15).
   Numbers are authored examples, not estimates. See sources.html for boundaries. */
window.MoneyLesson = [
 {id:'hierarchy',label:'Find the money',question:'When you pay, where does the promise end?',page:'7–8',
  intro:'Your bank balance can pay a shop. But can your bank settle its own payments with the very same promise?',
  prompt:'If a deposit is money to you, does that stop it being credit?',answer:'No. You hold a spendable asset; the bank owes you. “Money” describes what settles at your level. “Credit” describes a promise to deliver something higher up.',
  steps:[
   ['Start with your everyday payment.','A deposit is a claim on your bank. When a seller accepts a deposit payment, it can settle what you owe the seller.','For you, deposits function as money. “Settlement” means discharging a payment obligation. We begin with the familiar payment, then ask what supports it.',2],
   ['Now stand in the bank’s place.','A bank deposit is the bank’s promise to pay currency on demand. Move up one layer to see what backs that promise.','The ladder is Mehrling’s simplified gold-standard example. Modern interbank settlement normally uses central-bank reserve balances; currency and reserves are distinct forms of central-bank money.',1],
   ['Finally, look across borders.','In this gold-standard example, currency promises gold. The same instrument changes role when you change viewpoint.','Gold is the ultimate settlement asset in this historical model. Today’s fiat currency is not generally redeemable in gold. Securities here mean debt promises, not every kind of financial asset.',0]
  ]},
 {id:'ledger',label:'Trace the promise',question:'How can one promise appear in two places?',page:'9',
  intro:'Look at the same deposit from each side. Then choose where to draw the boundary around the economy.',
  prompt:'If internal claims cancel in a combined account, have people’s debts been repaid?',answer:'No. Consolidation is an accounting viewpoint, not a payment. The original claims, payment dates and risks still matter to the separate institutions.',
  steps:[
   ['One claim. Two perspectives.','Your 100-unit deposit is your asset and the bank’s liability. These are two entries for the same promise.','Asset: something you hold or are owed. Liability: something you owe. These are selected entries, not complete balance sheets. All amounts in this lesson are illustrative.',2],
   ['Bring the issuer inside the boundary.','Combine the holder and the bank: +100 and −100 offset. Their contract still exists between them.','“Inside” depends on the chosen boundary. If both issuer and holder are included, the claim has matching sides. Adding the central bank brings its currency liability inside too.',1],
   ['Ask what has no issuer.','In this gold-standard model, physical gold has no matching issuer’s liability. That is different from a redeemable promise.','From a private-sector viewpoint, currency can be outside because the central bank is outside. From the whole-system viewpoint, currency is inside. Gold is nobody’s liability in this model.',0]
  ]},
 {id:'elasticity',label:'Make room to trade',question:'Can trade grow without more settlement money?',page:'11–12',
  intro:'Suppose a buyer has no currency today. A seller could wait—or agree to accept the buyer’s promise.',
  prompt:'Does writing another IOU create the currency needed to redeem it?',answer:'No. An accepted IOU can enable trade now, but the issuer cannot create a higher-level settlement asset just by promising to pay it. Credit provides room; settlement imposes discipline.',
  steps:[
   ['A purchase meets a constraint.','The buyer cannot supply currency now. Without an accepted alternative, this trade waits.','Scarcity here is relative: participants cannot issue the money of the layer above them. It does not mean the amount of all money is permanently fixed.',0],
   ['Let the seller accept an IOU.','A new promise lets the purchase proceed. The seller gains a claim; the buyer gains an obligation.','This is credit elasticity. We show the claim and obligation together; the IOU is not a newly created gold coin. Acceptance and credibility matter.',1],
   ['The due date brings the constraint back.','The IOU still calls for currency later. More promises do not by themselves supply that higher-level money.','Banks can expand their own liabilities and manage settlement through borrowing and other arrangements. They cannot unilaterally create central-bank reserves. This is not a fixed money-multiplier model.',2]
  ]},
 {id:'cycle',label:'Put trust under stress',question:'What changes when promises become harder to use?',page:'10–12',
  intro:'Keep two things separate: how much credit exists, and how readily people treat it as money.',
  prompt:'Could the same amount of credit become less money-like?',answer:'Yes. Outstanding claims need not disappear for people to become less willing to accept them or more eager to convert them. Quantity and moneyness are different dimensions.',
  steps:[
   ['Begin with a fixed stock of promises.','Count the claims, then ask how easily each can be used or converted. Quantity is not the whole story.','The drawing is a qualitative thought experiment, not measured economic data. A claim’s face value and its usefulness for payment are different properties.',0],
   ['In an expansion, distinctions can feel small.','Credit grows and promises are easier to pass on. The hierarchy seems flatter when conversion feels dependable.','Mehrling describes changes in both the quantity and the quality—or “moneyness”—of credit. The two controls below separate these ideas; their settings are illustrative.',1],
   ['Under stress, the higher layer matters again.','Holders seek stronger settlement assets. A promise that felt money-like yesterday may be difficult to convert today.','“Steeper” describes sharper qualitative differences, not a measured geometric law. Quantity can contract too; neither a universal cycle schedule nor a crisis forecast is implied.',2]
  ]},
 {id:'bridges',label:'Connect the layers',question:'Who keeps different promises exchangeable?',page:'12–13',
  intro:'The ladder does not connect itself. Institutions stand between layers and offer conversion at prices.',
  prompt:'If a deposit exchanges for currency at 1:1, are they the same instrument?',answer:'No. Par is a maintained conversion relationship. The bank must honour it; that work becomes harder under stress. Equal exchange value does not erase different issuers or obligations.',
  steps:[
   ['Begin at the lower bridge.','Dealers connect securities with payment money. A security’s price—and its yield—links a future promise to money now.','The chapter calls this link the interest rate. The drawing shows price/yield together to avoid treating an interest rate as the cash price of a bond. No specific pricing formula is assumed.',2],
   ['Move to the bank’s bridge.','Banks promise conversion between deposits and currency at par: one unit for one unit.','Unlike a freely moving security price, par is a price the banking system is committed to defending. Reserves help, but they are not the only means of support.',1],
   ['Reach the historical top bridge.','Under a gold standard, the central bank supports currency’s exchange rate into gold.','Mehrling views these institutions as market makers connecting different layers. His “natural hierarchy” is an analytical perspective, not a claim that institutions or political choices are irrelevant.',0]
  ]},
 {id:'policy',label:'Manage the tension',question:'Can one policy move repair every link?',page:'13–14',
  intro:'A central bank can support settlement and influence borrowing conditions. The effects still have to travel through institutions.',
  prompt:'If the overnight rate falls, must every long-term borrowing rate fall by the same amount?',answer:'No. The chapter stresses slippage between the overnight policy rate and longer-term rates. Policy influences a network of prices and institutions; it does not mechanically set every outcome.',
  steps:[
   ['Locate the pressure.','A bank may need higher-level money to honour conversion. Count settlement resources separately from its promises.','Liquidity concerns meeting payments when due. It is not the same as solvency. Extra liquidity does not automatically remove losses or make every borrower creditworthy.',0],
   ['Support the strained connection.','Central-bank lending can supply reserves to a bank. The bank also acquires a repayment obligation.','This is a schematic modern liquidity-support example extending the historical ladder. It is a loan, not free wealth. Actual lending has eligibility, collateral and other conditions.',1],
   ['Follow the influence, not a guarantee.','Policy can encourage elasticity or impose discipline. Longer-term financing conditions do not move in lockstep.','You can now ask of any promise: who issued it, what redeems it, who makes that conversion possible, and what happens under stress? Those questions carry the chapter into new examples.',2]
  ]}
];
