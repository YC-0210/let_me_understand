/* Original novice-first teaching. Amounts are illustrative; source extensions are marked. */
window.MoneyCourse = [
  {
    "topic": "elasticity",
    "title": "You’re buying a $5 lunch.",
    "say": "Hi, I’m Wink. You have a $5 note. The café wants $5. Let’s pay and see what changes.",
    "scene": "cash",
    "action": "Pay with your $5",
    "result": "The café has the $5. You owe nothing for this lunch. That payment is finished.",
    "focus": "you",
    "page": "7",
    "more": "This everyday example introduces settlement: a payment obligation has been discharged. All amounts are illustrative."
  },
  {
    "topic": "elasticity",
    "title": "What if you forgot your cash?",
    "say": "You offer a note saying “I’ll pay $5 tomorrow.” Must the café accept it?",
    "scene": "iou",
    "choices": [
      "Yes, it is worth $5",
      "No, the café can refuse"
    ],
    "correct": 1,
    "result": "The café can refuse. A promise to pay $5 is different from having $5 to hand over.",
    "hint": "Your note says $5—but the café still has to trust you to pay later.",
    "focus": "promise",
    "page": "11–12",
    "more": "An IOU is a promise to pay. Its ability to enable a trade depends on whether the other party accepts it."
  },
  {
    "topic": "elasticity",
    "title": "Suppose the owner knows you.",
    "say": "The owner agrees to wait until tomorrow. Try offering your promise again.",
    "scene": "iou",
    "action": "Offer your IOU",
    "result": "You get lunch today. The café is owed $5, and you still have to pay. That is credit.",
    "focus": "shop",
    "page": "11–12",
    "more": "Accepting credit can enable a transaction without increasing the amount of higher-level settlement money. Goods are implicit in this simplified drawing."
  },
  {
    "topic": "elasticity",
    "title": "Tomorrow arrives. What clears the IOU?",
    "say": "You return with $5. Watch the cash change hands—and the unpaid promise disappear.",
    "scene": "repay-iou",
    "action": "Pay back the café",
    "result": "The café has cash instead of your IOU. Your debt is gone. Creating credit and settling it are different events.",
    "focus": "promise",
    "page": "11–12; extension: 22–26",
    "more": "From the chapter: credit postpones settlement. Beyond chapter 2: this repayment follows the payment accounting in lecture 4. We show only the $5 principal, with no interest. The banknote changes owner; no new cash is created."
  },
  {
    "topic": "hierarchy",
    "title": "Now try your bank account.",
    "say": "You and the café use the same bank. You have $5 in your account. Tap to pay for lunch from your balance.",
    "scene": "deposit",
    "action": "Pay from your account",
    "result": "The bank now owes the café $5 instead of you. No note moved. The bank changed its records.",
    "focus": "you",
    "page": "7–8",
    "more": "A bank balance is called a deposit. This is a same-bank transfer between existing positive balances, not a loan or overdraft. Total deposits are unchanged; no interbank reserves need move. The travelling marker represents the account update, not a physical wallet. Lecture 5, printed p. 32."
  },
  {
    "topic": "hierarchy",
    "title": "Who owes you that bank balance?",
    "say": "Go back to before lunch. That $5 balance is your bank’s promise to pay. Look from your side, then the bank’s.",
    "scene": "pair",
    "action": "Look from the bank’s side",
    "result": "To you: money you can spend. To the bank: an obligation to pay you. Same balance, two viewpoints.",
    "focus": "bank",
    "page": "7–9",
    "more": "A bank deposit is a claim on the bank, redeemable in currency on demand under the account’s terms. The name of the instrument stays the same when the viewpoint changes."
  },
  {
    "topic": "hierarchy",
    "title": "Where could that balance come from?",
    "say": "Suppose your account is empty. The bank approves a $5 loan and adds $5 to your balance. What promises appear?",
    "scene": "loan",
    "action": "Create the loan and deposit",
    "result": "The bank owes you $5 you can spend now. You owe the bank $5 later. Two promises—not a gift.",
    "focus": "bank",
    "page": "11–12; extension: 16–17, 23",
    "more": "Beyond chapter 2: bank lending can create a deposit. The bank gains a loan asset and a deposit liability; you gain a deposit asset and a loan liability. It does not require someone else’s deposit to fall first. New reserves are not created by this entry. Borrower demand, repayment risk, funding costs, capital and liquidity rules constrain lending. Interest omitted. Mehrling lectures 3–4; Bank of England (2014), Money creation, pp. 14–20.",
    "source": "creation"
  },
  {
    "topic": "hierarchy",
    "title": "The café uses a different bank this time.",
    "say": "Your bank is A; the café’s is B. Banks have accounts at a central bank. Those balances are reserves. Follow this $5 payment.",
    "scene": "interbank",
    "action": "Pay the café at Bank B",
    "result": "Your deposit falls; the café’s rises. Between the banks, A’s reserves fall and B’s rise. The café holds a claim on its own bank.",
    "focus": "bank",
    "page": "8",
    "more": "Beyond chapter 2: one completed gross payment, not every payment system’s timing. Both banks hold accounts at the central bank. Total reserves and total customer deposits are unchanged by this transfer; one does not turn into the other. Real arrangements can use netting, correspondents and intraday credit. The markers represent account updates. Mehrling lectures 5–6; BIS (2025), Money and trust.",
    "source": "settlement"
  },
  {
    "topic": "hierarchy",
    "title": "A balance at a bank. A bank’s balance.",
    "say": "Follow the two layers. Each participant needs something the other side will accept to finish a payment.",
    "scene": "two-layers",
    "action": "Trace the two layers",
    "result": "The café accepts its bank’s promise. The banks settle using the central bank’s balances. “What settles this payment?” reveals the hierarchy.",
    "focus": "deposit",
    "page": "7–8",
    "more": "Money and credit are relative to a payment relationship, not just a person’s opinion. Accepting a bank deposit can settle the purchase even while the bank continues to owe the depositor. Reserves are not generally accounts available to ordinary households. Issuer, access, timing and convertibility matter."
  },
  {
    "topic": "hierarchy",
    "title": "Was gold always part of this?",
    "say": "Let’s step into the past. Under a gold standard, currency promised gold. Today’s ordinary banknotes generally do not.",
    "scene": "gold",
    "action": "See the historical promise",
    "result": "In that historical example: deposits promise currency; currency promises gold. Keep this separate from today’s fiat-money system.",
    "focus": "gold",
    "page": "7–8",
    "more": "Mehrling uses a simplified gold-standard hierarchy. Backing a currency with gold makes a redemption promise more credible; it does not turn the currency itself into gold."
  },
  {
    "topic": "ledger",
    "title": "One $5 promise, or two?",
    "say": "Your bank records “I owe you $5.” You record “the bank owes me $5.” How many promises is that?",
    "scene": "pair",
    "choices": [
      "One promise, seen twice",
      "Two separate promises"
    ],
    "correct": 0,
    "result": "One promise. Your asset is the bank’s liability. Those words mean what you hold and what you owe.",
    "hint": "Both entries describe the same bank owing the same person the same $5.",
    "focus": "promise",
    "page": "9",
    "more": "These are selected entries, not full balance sheets. The lesson does not imply that an asset alone balances an institution’s entire accounts."
  },
  {
    "topic": "ledger",
    "title": "Put both sides in one group.",
    "say": "Draw a boundary around you and the bank. The same $5 appears as your claim and the bank’s debt. Do they add to $10?",
    "scene": "boundary",
    "action": "Draw the boundary",
    "result": "For this claim, the group’s net position is zero. But the bank still owes you $5. Combining accounts did not repay you.",
    "focus": "promise",
    "page": "9",
    "more": "Consolidation is an accounting viewpoint, not settlement or debt cancellation. Who owes whom, payment dates and risks remain important."
  },
  {
    "topic": "ledger",
    "title": "What if the issuer is outside?",
    "say": "Group only private people and banks. The central bank stays outside. Its currency is then a claim on someone outside the group.",
    "scene": "outside",
    "action": "Bring the central bank inside",
    "result": "The boundary changed; the instrument did not. “Inside” and “outside” money depend on whose accounts you combine.",
    "focus": "bank",
    "page": "9",
    "more": "Within a boundary containing its issuer, currency has a matching liability. Physical gold has no issuer’s liability in the chapter’s model."
  },
  {
    "topic": "elasticity",
    "title": "Did your IOU create any cash?",
    "say": "Back when you wrote the lunch IOU, did writing it also create the $5 note needed to repay it?",
    "scene": "iou",
    "choices": [
      "Yes, another $5 note exists",
      "No, the payment is still due"
    ],
    "correct": 1,
    "result": "No extra cash appeared. Your IOU expanded credit; the bank’s loan created a deposit. Neither act created central-bank reserves.",
    "hint": "The café holds your written promise, not a new banknote.",
    "focus": "promise",
    "page": "11–12",
    "more": "From the chapter: an issuer can expand its own credit, but cannot simply issue another institution’s settlement money. That is not a fixed money-multiplier rule. Banks can obtain reserves through incoming payments, borrowing, asset sales or eligible central-bank operations. This does not make lending unlimited. A cash IOU repayment transfers cash; repayment of bank-loan principal using a deposit reduces both that loan and deposits. See Bank of England (2014).",
    "source": "creation"
  },
  {
    "topic": "cycle",
    "title": "More promises can circulate.",
    "say": "Start a separate café example: two regulars have unpaid IOUs. Two more buy on credit. Watch how many promises now remain unpaid.",
    "scene": "quantity",
    "action": "Add two IOUs",
    "result": "Four unpaid IOUs now exist. That is more credit outstanding. Paying them off would reduce the count.",
    "focus": "promise",
    "page": "10",
    "more": "A stock is the amount outstanding at a moment; new credit adds to it and repayment reduces it. These quantities are illustrative. An accepted personal IOU is not automatically counted in a statistical money supply."
  },
  {
    "topic": "cycle",
    "title": "Can these promises pay the supplier?",
    "say": "Keep those four IOUs. The café needs to pay its supplier today. The supplier wants payment now, not customers’ promises.",
    "scene": "trust",
    "action": "Make the owner cautious",
    "result": "Four IOUs still exist. But they cannot make this payment unless someone accepts, buys or lends against them. Their usefulness depends on the payment.",
    "focus": "shop",
    "page": "10–12",
    "more": "The chapter distinguishes quantity from moneyness. A claim can become harder to use without its face amount changing or its issuer already defaulting. Timing, acceptance, conversion markets and access to finance matter—not just confidence. The supplier’s refusal is an illustrative changed case, not a prediction."
  },
  {
    "topic": "bridges",
    "title": "Why can a balance buy the same lunch?",
    "say": "Banks promise to exchange deposits for currency one-for-one. Start with $5 in your account and no cash. Try a withdrawal.",
    "scene": "withdraw",
    "action": "Withdraw $5",
    "result": "Your balance is now $0; you hold a $5 note. One-for-one is called par. The withdrawal changed the form, not the amount, of your money.",
    "focus": "bank",
    "page": "12–13",
    "more": "Ignore fees and assume an available on-demand withdrawal. The bank gives up cash and reduces what it owes you. Par is supported by settlement arrangements, liquidity management and public institutions; it is not a promise that every bank or every financial product is riskless."
  },
  {
    "topic": "bridges",
    "title": "Same price. Same thing?",
    "say": "A $5 bank balance and a $5 note exchange one-for-one. Does that make them the same instrument?",
    "scene": "withdraw",
    "choices": [
      "Yes, they are identical",
      "No, the bank still owes the balance"
    ],
    "correct": 1,
    "result": "Equal exchange value does not erase the promise. Under stress, getting from one instrument to the other matters.",
    "hint": "Think back to who owes you the bank balance.",
    "focus": "promise",
    "page": "13",
    "more": "Reserves help defend par, but are not the only means of support. The chapter emphasizes that fixed conversion prices can come under strain."
  },
  {
    "topic": "bridges",
    "title": "Need money before a promise comes due?",
    "say": "You hold a bond promising $10 next year. A dealer offers $9 today. Watch the bond and the payment change owners.",
    "scene": "dealer",
    "action": "Sell for $9 today",
    "result": "You have $9 now; the dealer holds the claim to $10 later. The issuer still owes the bond payment. Selling is not repayment.",
    "focus": "dealer",
    "page": "12–13",
    "more": "Beyond chapter 2: a one-payment bond and an illustrative dealer quote. The issuer stays liable; only the creditor changes. The dealer buys on its own account, unlike a broker who only arranges a trade. Price can reflect timing, repayment risk, liquidity and funding conditions. The animation separates the two legs for visibility, not a prescribed settlement procedure. Lectures 9–10.",
    "source": "dealers"
  },
  {
    "topic": "bridges",
    "title": "What if the dealer offers only $8?",
    "say": "The bond still promises $10 next year. A new quote offers $8 today. Which amount changed?",
    "scene": "bond-price",
    "choices": [
      "The promised $10 payment",
      "The price you can get today"
    ],
    "correct": 1,
    "result": "Today’s price changed; the promised payment did not. If paid in full, $10 from an $8 price is a 25% one-year return.",
    "hint": "The issuer’s promise is unchanged. Look at what the dealer is willing to pay now.",
    "focus": "promise",
    "page": "12–13; extension: 67–73",
    "more": "Illustrative one-year, single-payment bond, no fees. At a $9 price, the return if paid in full is ($10−$9)/$9 ≈ 11.1%; at $8 it is ($10−$8)/$8 = 25%. A higher promised yield is not guaranteed profit: repayment may fail. Coupons, spreads and term structure belong to later lessons.",
    "source": "dealers"
  },
  {
    "topic": "bridges",
    "title": "Now the chapter’s ladder has a purpose.",
    "say": "Each link answers a familiar question: how do I turn this claim into the payment I need?",
    "scene": "ladder",
    "action": "Follow the links",
    "result": "Dealers connect securities to money. Banks support deposit conversion. Under a gold standard, central banks support currency-to-gold conversion.",
    "focus": "bank",
    "page": "12–13",
    "more": "This is Mehrling’s historical, simplified hierarchy. His “natural hierarchy” is an analytical perspective; it does not mean institutions or political decisions are irrelevant."
  },
  {
    "topic": "policy",
    "title": "Can tomorrow’s income pay today’s bill?",
    "say": "The café must pay its supplier $5 today. Customers will pay the café $10 tomorrow. Is tomorrow’s money available today?",
    "scene": "timing",
    "choices": [
      "Yes, the café has enough overall",
      "No, it still needs payment money today"
    ],
    "correct": 1,
    "result": "The café has a timing gap. It needs cash on hand, a willing lender or a buyer for a claim. That is a liquidity problem.",
    "hint": "Compare the two dates. A payment due today cannot wait unless someone agrees.",
    "focus": "shop",
    "page": "extension: 28–31",
    "more": "Beyond chapter 2: liquidity is the ability to meet payments when due. Solvency concerns the value of all assets versus all liabilities. Expected future receipts do not guarantee either one. Here the $10 is assumed collectible and all other obligations are omitted. Forced sales and funding costs can turn a timing problem into losses. Lecture 4.",
    "source": "liquidity"
  },
  {
    "topic": "policy",
    "title": "What if a bank needs reserves now?",
    "say": "A bank can face a timing gap too. It needs reserves to pay another bank. An eligible central-bank loan can create those reserves.",
    "scene": "support",
    "action": "Show the reserve loan",
    "result": "The bank gains reserves and a repayment obligation. This can bridge a timing gap; it does not erase losses or create real goods.",
    "focus": "bank",
    "page": "13–14",
    "more": "Beyond the historical illustration: modern central-bank credit creates a reserve liability and a loan asset at the central bank, with matching entries at the borrowing bank. The bank may first seek market funding; support is conditional, often collateralised, and not automatic. Liquidity support and repairing insolvency are different tasks. A domestic-currency issuer cannot thereby create foreign currency. Lectures 4, 6 and 12.",
    "source": "liquidity"
  },
  {
    "topic": "policy",
    "title": "Does cheaper borrowing remove every obstacle?",
    "say": "The central bank can influence short-term borrowing costs. If it lowers them, must a risky business get an equally cheaper loan?",
    "scene": "rates",
    "choices": [
      "Yes, every loan gets the same cut",
      "No, lenders still consider repayment risk"
    ],
    "correct": 1,
    "result": "Cheaper funding can help. But lenders still assess repayment and market conditions. One policy rate does not set every loan rate.",
    "hint": "A lower funding cost does not guarantee that this particular borrower can repay.",
    "focus": "bank",
    "page": "13–14",
    "more": "From chapter 2: transmission to longer-term rates can be uneven. Beyond it: expectations, credit risk, maturity and funding conditions also matter. This is a conceptual illustration, not a rule that loan rates cannot fall, a description of every monetary regime, or a policy forecast."
  },
  {
    "topic": "policy",
    "title": "One last café puzzle.",
    "say": "The café has your $5 IOU, but its supplier accepts only a bank payment. Has the IOU alone solved the café’s payment problem?",
    "scene": "finish",
    "result": "Exactly. Ask who owes, when payment is due, what will settle it, and who can help convert the claim. That is the money hierarchy in action.",
    "focus": "promise",
    "page": "7–14",
    "more": "This changed case returns to the opening with a new payment relationship. Reading or answering does not mark understanding in the app; those choices remain yours.",
    "choices": [
      "Yes, both are labelled $5",
      "No, it needs an accepted means of payment"
    ],
    "correct": 1,
    "hint": "Equal amounts do not make two promises equally usable for the next payment."
  }
];
