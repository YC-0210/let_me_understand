window.StateCourse = [
  {
    "id": "start",
    "act": 1,
    "era": "United States · 1861",
    "role": "The question behind the story",
    "title": "A war has begun. How will you pay?",
    "words": "A government needs food and equipment for a war before enough taxes arrive. How can it pay today? We’ll learn to read its financial records, then step into the story.",
    "nodes": [
      [
        "bank",
        "Treasury"
      ],
      [
        "fork-knife",
        "War supplies"
      ]
    ],
    "detail": "The Union is fighting the American Civil War. Salmon P. Chase runs the Treasury. This story asks how financing the war changes the money people and banks use."
  },
  {
    "id": "map",
    "act": 1,
    "era": "1861 → 1920s",
    "role": "Three connected stories",
    "title": "Every solution creates a new question.",
    "words": "We’ll follow war spending, harvest payments and the creation of the Fed. Each solution leaves a new problem to solve. First, we need a way to see who holds what—and who owes whom.",
    "nodes": [
      [
        "scroll",
        "Finance the war"
      ],
      [
        "coins",
        "Find harvest cash"
      ],
      [
        "bank",
        "Create the Fed"
      ]
    ]
  },
  {
    "id": "account-primer",
    "act": 1,
    "era": "Before we borrow",
    "role": "Read the financial records",
    "title": "What do you hold? What do you owe?",
    "words": "We’ll use a T-account to keep track. Assets go on the left: what you hold or are owed. Liabilities go on the right: what you owe.",
    "nodes": [],
    "primer": true,
    "term": "T-account",
    "detail": "We show changes, not complete balance sheets. A plus adds to an item; a minus removes from it. Entries appear one at a time to explain a single transaction; they are not separate transactions. Equity is unchanged in these principal-only examples."
  },
  {
    "id": "bond",
    "act": 1,
    "era": "1861 · Raising war funds",
    "role": "You are an investor",
    "title": "Would you lend your savings to the government?",
    "words": "First, practice as an investor with $100 in a bank deposit. The government wants to borrow it. In return, it offers a bond: a written promise to repay, usually with interest.",
    "nodes": [
      [
        "user",
        "Your deposit"
      ],
      [
        "scroll",
        "Government bond"
      ]
    ],
    "term": "Bond",
    "detail": "Our $100 amounts are teaching examples, not historical totals. We leave interest and fees out of the transaction diagrams."
  },
  {
    "id": "bond-purchase",
    "act": 1,
    "era": "1861 · A bond sale",
    "role": "You are the investor",
    "title": "Trade an existing deposit for a bond.",
    "words": "You accept the offer. Your deposit goes to the Treasury, and you receive its bond. Let’s record that exchange, beginning with what changes for you.",
    "parties": [
      "Investor",
      "Treasury"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Bank deposit",
        "amount": "−$100",
        "words": "Your bank deposit falls by $100."
      },
      {
        "party": 0,
        "side": "a",
        "label": "Government bond",
        "amount": "+$100",
        "words": "In its place, you hold the government’s promise."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Bank deposit",
        "amount": "+$100",
        "words": "The Treasury receives the $100 deposit."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Bond owed",
        "amount": "+$100",
        "words": "It now owes the bondholder $100."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only"
  },
  {
    "id": "deposit-transfer",
    "act": 1,
    "era": "1861 · Same bank, simplified",
    "role": "You are the banker",
    "title": "Did this sale create more deposits?",
    "words": "Now take the banker’s seat. You handled that bond payment. You owe the investor less and the Treasury more—but has the total amount of deposits changed?",
    "parties": [
      "Bank"
    ],
    "entries": [
      {
        "party": 0,
        "side": "l",
        "label": "Investor’s deposit",
        "amount": "−$100",
        "words": "You owe the investor $100 less."
      },
      {
        "party": 0,
        "side": "l",
        "label": "Treasury’s deposit",
        "amount": "+$100",
        "words": "You owe the Treasury $100 more. Total deposits have not increased."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "This example uses one bank to isolate the change of owner. Across banks, settlement adds another step. Government spending subsequently transfers the deposit to its suppliers."
  },
  {
    "id": "loan-context",
    "introduction": true,
    "title": "Step into Salmon P. Chase’s role",
    "lead": "Now imagine you are Salmon P. Chase.",
    "words": "It is August 1861. You are the U.S. Treasury secretary, and the Union is fighting the American Civil War.\n\nSoldiers need food and equipment now. Taxes cannot cover the war’s bills fast enough. You turn to banks for a loan.\n\nYou know how to read a T-account. Let’s use it to follow your decision.",
    "continueLabel": "Step into the story →"
  },
  {
    "id": "bank-loan",
    "act": 1,
    "era": "1861 · Borrowing from banks",
    "role": "You are the Treasury",
    "title": "The banks agree to your war loan.",
    "words": "To help you pay for supplies, the banks credit the Treasury’s account with a deposit. Let’s record what you receive and what you promise to repay.",
    "parties": [
      "Treasury",
      "Bank"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Bank deposit",
        "amount": "+$100",
        "words": "You can now spend this $100 bank deposit."
      },
      {
        "party": 0,
        "side": "l",
        "label": "Loan owed",
        "amount": "+$100",
        "words": "You must repay the bank $100."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Loan to Treasury",
        "amount": "+$100",
        "words": "The bank holds your promise to repay."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Treasury’s deposit",
        "amount": "+$100",
        "words": "The bank promises to honor your new deposit."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "This bank loan expands both balance sheets. Unlike the investor’s bond purchase, it creates a new deposit. No gold has yet moved. The lecture uses $150 million for the 1861 bank-loan arrangement. This account is an illustrative $100 slice; it is not a reconstruction of every syndicate transaction."
  },
  {
    "id": "gold-needed",
    "act": 1,
    "era": "1861 · Buying abroad",
    "role": "You are the Treasury",
    "title": "Your foreign supplier wants gold.",
    "words": "You now have a deposit to spend. But a supplier abroad wants gold. To buy those supplies, you ask the banks to convert your new deposit into gold.",
    "nodes": [
      [
        "money",
        "Your deposit"
      ],
      [
        "coins",
        "Gold"
      ],
      [
        "storefront",
        "Foreign supplier"
      ]
    ],
    "term": "Convertibility",
    "detail": "Convertibility means redeeming a claim in the promised settlement asset. Here the bank’s deposit is a promise to pay gold on demand."
  },
  {
    "id": "gold-withdrawal",
    "act": 1,
    "era": "1861 · Before buying the supplies",
    "role": "You are the Treasury",
    "title": "Your gold comes out of the bank’s reserve.",
    "words": "The bank meets your request by handing over gold from its reserve. You exchange one asset for another, while your war loan still has to be repaid.",
    "parties": [
      "Treasury",
      "Bank"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Bank deposit",
        "amount": "−$100",
        "words": "You surrender $100 of your deposit."
      },
      {
        "party": 0,
        "side": "a",
        "label": "Gold",
        "amount": "+$100",
        "words": "You take $100 in gold instead."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Treasury’s deposit",
        "amount": "−$100",
        "words": "The bank extinguishes that deposit liability."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Gold reserve",
        "amount": "−$100",
        "words": "Its stock of gold falls. Its loan to you remains."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "This stylizes the lecture’s mechanism. It does not claim that one withdrawal immediately exhausted all American gold. War financing and wider pressures preceded suspension in late 1861."
  },
  {
    "id": "suspension",
    "act": 1,
    "era": "Late 1861 · Gold payments suspended",
    "role": "You are a bank depositor",
    "title": "If gold cannot be paid out, what is your deposit?",
    "words": "As war finance strains banks’ gold reserves, gold payments are suspended in late 1861. Now you are another depositor: your claim remains, but you cannot redeem it in specie—metal coin.",
    "nodes": [
      [
        "money",
        "Deposit remains"
      ],
      [
        "coins",
        "Gold payment stops"
      ]
    ],
    "term": "Specie",
    "detail": "Specie means metallic coin. Suspension is not cancellation of every debt. The next question is what will become the domestic settlement asset instead."
  },
  {
    "id": "recap-borrow",
    "recap": true,
    "bullets": [
      "Buying a bond can transfer an existing deposit.",
      "A bank loan creates a deposit and a debt.",
      "Withdrawing gold reduces the bank’s settlement reserve."
    ],
    "bridge": "So far, we have financed spending through banks. But gold payments have stopped. What can the government and banks pay with now?"
  },
  {
    "id": "legal-tender",
    "act": 1,
    "era": "1862 · The war continues",
    "role": "You are the Treasury",
    "title": "Could your own paper pay the supplier?",
    "words": "Back at the Treasury, you still have war bills to pay. In 1862, Congress authorizes greenbacks: government paper notes with legal-tender status, meaning they can discharge the dollar debts covered by the law.",
    "nodes": [
      [
        "bank",
        "Treasury"
      ],
      [
        "money",
        "Greenbacks"
      ],
      [
        "storefront",
        "Supplier"
      ]
    ],
    "term": "Legal tender",
    "detail": "Legal tender is a rule about discharging debts, not a claim that every seller must accept any payment method. The original law had exceptions, including import duties and interest on federal debt. Greenbacks were not then redeemable in gold at par."
  },
  {
    "id": "authorization",
    "act": 1,
    "era": "25 February 1862",
    "role": "Historical record",
    "title": "How much paper can the Treasury issue?",
    "words": "This new way to pay has a legal limit. The first Legal Tender Act authorizes $150 million in United States notes—not the total issued over the whole war.",
    "nodes": [],
    "stat": {
      "value": "$150 million",
      "label": "First legal-tender note authorization",
      "source": "Federal Reserve History · National Banking Acts",
      "url": "https://www.federalreservehistory.org/essays/national-banking-acts"
    },
    "detail": "The lecture also uses a rounded $400 million amount in its schematic. We keep legal authorization, eventual circulation and illustrative transactions separate."
  },
  {
    "id": "notes-spending",
    "act": 1,
    "era": "1862 · Paying a domestic supplier",
    "role": "You are the Treasury",
    "title": "Use the new notes to pay for supplies.",
    "words": "You can now pay a domestic supplier with greenbacks. Let’s follow a $100 purchase: the Treasury receives supplies, and the supplier receives government notes.",
    "parties": [
      "Treasury",
      "Supplier"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Supplies",
        "amount": "+$100",
        "words": "You receive $100 of supplies."
      },
      {
        "party": 0,
        "side": "l",
        "label": "Greenbacks issued",
        "amount": "+$100",
        "words": "You pay by issuing $100 of government notes."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Supplies",
        "amount": "−$100",
        "words": "The supplier hands over the goods."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Greenbacks",
        "amount": "+$100",
        "words": "The supplier receives the notes."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "Goods are valued at the transaction price; profit, taxes and later wartime consumption are omitted. A note is the government’s liability and its holder’s asset."
  },
  {
    "id": "deposit-greenbacks",
    "act": 1,
    "era": "1862 · Banking after suspension",
    "role": "You are the supplier",
    "title": "Put the notes in your bank.",
    "words": "Now you are the supplier who received those notes. You put them in your bank. Follow how your government notes become a bank deposit—and what the bank holds in return.",
    "parties": [
      "Supplier",
      "Bank"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Greenbacks",
        "amount": "−$100",
        "words": "You hand $100 of notes to the bank."
      },
      {
        "party": 0,
        "side": "a",
        "label": "Bank deposit",
        "amount": "+$100",
        "words": "You receive a $100 deposit claim."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Greenback reserve",
        "amount": "+$100",
        "words": "The bank holds the notes as reserves."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Supplier’s deposit",
        "amount": "+$100",
        "words": "It owes you a deposit against that reserve."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only"
  },
  {
    "id": "paper-gold",
    "act": 1,
    "era": "Civil War · Two payment spheres",
    "role": "You are buying imports",
    "title": "A dollar in paper is not always a dollar in gold.",
    "words": "That supplier can use greenbacks at home. But remember the foreign supplier who wanted gold? Government paper and gold remain different payment instruments, and their exchange value can move apart.",
    "nodes": [
      [
        "money",
        "Paper dollar"
      ],
      [
        "arrows-left-right",
        "Changing price"
      ],
      [
        "coins",
        "Gold dollar"
      ]
    ],
    "detail": "Depreciation against gold and inflation in goods prices are related but different measures. No invented price series or undated “50 cents” is shown as historical data."
  },
  {
    "id": "resumption",
    "act": 1,
    "era": "1 January 1879 · Looking ahead",
    "role": "You are a noteholder",
    "title": "Gold redemption eventually returns.",
    "words": "Follow the greenback’s story ahead to 1879. You can finally redeem these notes in gold again. The paper has survived, while the terms for converting it have changed.",
    "nodes": [
      [
        "money",
        "Greenback"
      ],
      [
        "coins",
        "Gold at par"
      ]
    ],
    "detail": "Formal specie resumption began 1 January 1879. Market parity was reached in late 1878; these are different events. Greenbacks did not all disappear. Source: Federal Reserve, Great Depressions and Great Inflations, IFDP 898.",
    "source": "https://www.federalreserve.gov/pubs/ifdp/2007/898/ifdp898.htm"
  },
  {
    "id": "recap-paper",
    "recap": true,
    "bullets": [
      "Government notes become domestic settlement money.",
      "Bank deposits become claims on that paper.",
      "Paper’s value against gold can differ until redemption is restored."
    ],
    "bridge": "We have followed government-issued greenbacks through war and back to gold redemption. Now rewind to 1863 for a different solution: let private banks issue notes backed by government bonds."
  },
  {
    "id": "national-banks",
    "act": 2,
    "era": "1863–1864 · National Banking Acts",
    "role": "You are a national banker",
    "title": "A banknote needs backing people can trust.",
    "words": "Return to 1863. You run a bank under the new national system. To issue its notes, you must pledge government bonds as collateral—assets set aside to protect noteholders.",
    "nodes": [
      [
        "scroll",
        "Treasury bonds"
      ],
      [
        "bank",
        "National bank"
      ],
      [
        "money",
        "Banknotes"
      ]
    ],
    "term": "Collateral",
    "detail": "Collateral is an asset pledged as security. The bonds protect noteholders if the bank fails; a banknote is not an everyday right to swap directly for a Treasury bond. Federal oversight and redemption arrangements also matter."
  },
  {
    "id": "bank-bond",
    "act": 2,
    "era": "National banking · Simplified purchase",
    "role": "You are the national bank",
    "title": "First, acquire a Treasury bond.",
    "words": "To obtain that backing, your bank first buys a Treasury bond. You pay by crediting the Treasury’s account. Follow what your bank gains and what it owes.",
    "parties": [
      "National bank",
      "Treasury"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Treasury bond",
        "amount": "+$100",
        "words": "Your bank acquires a $100 government bond."
      },
      {
        "party": 0,
        "side": "l",
        "label": "Treasury’s deposit",
        "amount": "+$100",
        "words": "You credit the Treasury’s account with a $100 deposit."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Bank deposit",
        "amount": "+$100",
        "words": "On the Treasury’s side, that deposit is money it can spend."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Bond owed",
        "amount": "+$100",
        "words": "The Treasury also records the $100 it owes on the bond."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "The bond is then pledged under the national-bank note rules. Actual issuance limits, valuation rules and redemption-fund requirements are omitted; $100 here is a teaching unit, not a historical collateral ratio."
  },
  {
    "id": "supplier-paid",
    "act": 2,
    "era": "National banking · Government spending",
    "role": "You are the supplier",
    "title": "The Treasury spends its deposit.",
    "words": "The Treasury now spends the deposit your bank created. Switch to the supplier receiving that payment: you have delivered supplies and received a deposit. You ask the bank for portable notes.",
    "nodes": [
      [
        "bank",
        "Treasury deposit"
      ],
      [
        "user",
        "Supplier deposit"
      ],
      [
        "money",
        "Request banknotes"
      ]
    ],
    "detail": "For clarity we use the same bank. Spending changes the deposit’s owner; it does not remove the Treasury bond from the bank’s assets."
  },
  {
    "id": "banknotes",
    "act": 2,
    "era": "National banking · Withdrawal in notes",
    "role": "You are the banker",
    "title": "Replace a deposit with your banknotes.",
    "words": "Back at the bank, you meet the supplier’s request by replacing their deposit with banknotes. The bond you pledged remains in place. Let’s record the change in what you owe.",
    "parties": [
      "National bank",
      "Supplier"
    ],
    "entries": [
      {
        "party": 0,
        "side": "l",
        "label": "Supplier’s deposit",
        "amount": "−$100",
        "words": "The supplier gives up $100 of deposits."
      },
      {
        "party": 0,
        "side": "l",
        "label": "Banknotes issued",
        "amount": "+$100",
        "words": "Your bank issues $100 of notes instead."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Bank deposit",
        "amount": "−$100",
        "words": "The supplier no longer holds that deposit."
      },
      {
        "party": 1,
        "side": "a",
        "label": "National banknotes",
        "amount": "+$100",
        "words": "They hold currency issued by the bank."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "Assume the bank has already satisfied the applicable collateral and issuance conditions. This is a change in the form of its liabilities. A bank’s own notes are not its lawful-money reserves."
  },
  {
    "id": "two-notes",
    "act": 2,
    "era": "After the Civil War",
    "role": "You are a noteholder",
    "title": "Similar paper. Different issuers.",
    "words": "You now hold a national banknote. Compare it with the greenback from our earlier story: the bank owes the first; the Treasury owes the second. Similar paper can be someone else’s promise.",
    "nodes": [
      [
        "money",
        "Treasury → greenback"
      ],
      [
        "bank",
        "Bank → banknote"
      ]
    ],
    "detail": "These are historical instruments, not a diagram of today’s Federal Reserve notes. The distinction matters when we ask what a bank can use as a reserve."
  },
  {
    "id": "recap-notes",
    "recap": true,
    "bullets": [
      "Government bonds help back national banknotes.",
      "Issuing notes can replace an existing deposit liability.",
      "The issuer’s own banknotes are not its lawful-money reserve."
    ],
    "bridge": "We have built a currency system. But harvest payments rise each autumn. Can its reserves reach the banks that suddenly need cash?"
  },
  {
    "id": "country-bank",
    "act": 2,
    "era": "Late 19th / early 20th century · Before the Fed",
    "role": "You are a country banker",
    "title": "Where do you keep your reserve?",
    "words": "Imagine running a country bank as harvest approaches. To meet withdrawals, you keep some reserves as cash and some as deposits at larger banks. Those larger banks act as your reserve agents.",
    "nodes": [
      [
        "vault",
        "Cash in your bank"
      ],
      [
        "bank",
        "Deposit at city bank"
      ]
    ],
    "detail": "National-bank reserve rules distinguished country, reserve-city and central-reserve-city banks. Historically, required ratios included 15% for country banks and 25% for reserve-city categories, with detailed composition rules.",
    "term": "Reserve agent"
  },
  {
    "id": "real-reserves",
    "act": 2,
    "era": "National banks before the Fed · Date not stated",
    "role": "Read the professor’s actual table",
    "title": "How much “reserve” was somebody else’s deposit?",
    "words": "This was more than a possibility. The professor’s historical table shows country banks held $226.7 million with reserve agents, compared with $199.6 million of lawful money in their own banks.",
    "nodes": [],
    "chart": "reserves",
    "detail": "Recreated from Table 35.1 shown in the lecture “National Banking System, Before the Fed,” around 1:20. All figures are millions of dollars. The lecture does not identify an observation date. The $17.2m redemption fund brings total reserves to $443.5m. This is historical data, not a simulation."
  },
  {
    "id": "winter",
    "act": 2,
    "era": "A quiet season · Before the Fed",
    "role": "You are the country banker",
    "title": "Idle cash can earn something in New York.",
    "words": "Why leave funds in a city bank? In a quiet season, local customers need less cash. Your New York reserve agent can lend available funds into the securities market.",
    "nodes": [
      [
        "bank",
        "Country bank"
      ],
      [
        "bank",
        "New York bank"
      ],
      [
        "scroll",
        "Securities loans"
      ]
    ],
    "detail": "This is a mechanism, not a claim that every country bank sent all its cash directly to New York. Reserve-city intermediaries could sit between them."
  },
  {
    "id": "harvest",
    "act": 2,
    "era": "Autumn · Crops must be moved",
    "role": "You are a farmer",
    "title": "Workers need cash before crops are sold.",
    "words": "Now autumn arrives. Step into a farmer’s shoes: your crops are not yet sold, but workers need paying. You ask your country bank for currency. Where will it get the cash?",
    "nodes": [
      [
        "user",
        "Farmer needs cash"
      ],
      [
        "bank",
        "Country bank"
      ],
      [
        "bank",
        "City reserve agent"
      ]
    ],
    "detail": "The problem is timing: receipts arrive after many payments are due. Seasonal demands can be regular even when each individual payment is uncertain."
  },
  {
    "id": "reserve-drain",
    "act": 2,
    "era": "Harvest · A correspondent withdrawal",
    "role": "You are the country banker",
    "title": "Your cash rises; New York’s cash falls.",
    "words": "Back at the country bank, you need cash for that farmer. You withdraw part of your deposit in New York. Follow where your cash comes from—and whose reserve falls.",
    "parties": [
      "Country bank",
      "New York bank"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Deposit in New York",
        "amount": "−$100",
        "words": "Your claim on the New York bank falls."
      },
      {
        "party": 0,
        "side": "a",
        "label": "Cash in vault",
        "amount": "+$100",
        "words": "Your bank receives the currency."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Country bank’s deposit",
        "amount": "−$100",
        "words": "New York extinguishes that deposit liability."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Cash reserve",
        "amount": "−$100",
        "words": "Its cash reserve falls by the same amount."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "The next step, not shown here, is your customer’s withdrawal from your bank: your cash and deposit liabilities then both fall. Reserve deposits are not extra physical cash for the consolidated banking system."
  },
  {
    "id": "fifty-million",
    "act": 2,
    "era": "Professor’s worked withdrawal · Not an observed event",
    "role": "View the New York banks together",
    "title": "What would a $50 million cash drain do?",
    "words": "Now combine many country-bank withdrawals. In the professor’s hypothetical $50 million drain, New York banks’ reserves fall from $221.3 million to $171.3 million. How could they replace that cash?",
    "nodes": [],
    "chart": "drain",
    "detail": "Starting value: historical Table 35.1, observation date unstated. Withdrawal: the professor’s illustrative $50m scenario. This is not a measured historical before-and-after series. The arithmetic uses the printed table rather than the lecture’s rough “25%” description."
  },
  {
    "id": "call-loan",
    "act": 2,
    "era": "Harvest pressure reaches Wall Street",
    "role": "You are the New York banker",
    "title": "How can you get cash back quickly?",
    "words": "Remember the loans your New York bank made in the quiet season? You now ask borrowers to repay. A call loan gives you the right to demand repayment at short notice.",
    "nodes": [
      [
        "bank",
        "Bank calls loan"
      ],
      [
        "user",
        "Borrower must pay"
      ]
    ],
    "term": "Call loan",
    "detail": "The borrower may be financing securities. A callable loan is not automatically the same contract as the one-night loan introduced in chapter 2."
  },
  {
    "id": "spillover",
    "act": 2,
    "era": "A cash shortage spreads",
    "role": "You are a securities dealer",
    "title": "Sell an asset to repay the bank.",
    "words": "Now you are one of those borrowers, a securities dealer. The bank wants repayment, so you sell securities to raise cash. If many borrowers do this together, prices can fall and funding rates rise.",
    "nodes": [
      [
        "scroll",
        "Sell securities"
      ],
      [
        "coins",
        "Repay loan"
      ],
      [
        "bank",
        "Rebuild cash"
      ]
    ],
    "detail": "Higher rates could also draw gold from London. Not every harvest caused a panic; confidence, the timing of withdrawals and access to liquidity affected the outcome."
  },
  {
    "id": "recap-season",
    "recap": true,
    "bullets": [
      "A reserve deposit is a claim on another bank.",
      "Harvest withdrawals can pull cash through the bank network.",
      "Calling loans can pass that pressure into securities markets."
    ],
    "bridge": "The same reserve system can have spare cash in quiet months and too little where it is needed at harvest. How could reserves expand with payment needs—and contract afterward?"
  },
  {
    "id": "panic",
    "act": 3,
    "era": "1907 · A financial panic",
    "role": "You are a clearinghouse banker",
    "title": "Could banks settle with a shared promise?",
    "words": "Before the Fed exists, banks try their own answer during the 1907 panic. Their clearinghouse—a group that organizes settlement—issues shared credit certificates. Members can use these to settle with one another, conserving cash.",
    "nodes": [
      [
        "bank",
        "Member banks"
      ],
      [
        "scroll",
        "Shared settlement credit"
      ]
    ],
    "term": "Clearinghouse",
    "detail": "A clearinghouse organizes settlement among banks. Certificates were emergency credit, not new gold or a universal solution: membership and access were limited. The 1908 Aldrich–Vreeland emergency-currency arrangement was related but distinct."
  },
  {
    "id": "fed-context",
    "act": 3,
    "era": "1913 act · Reserve Banks open in 1914",
    "role": "You are designing the Federal Reserve",
    "title": "Make reserve money a form of credit.",
    "words": "That emergency arrangement reaches only participating banks. The new Federal Reserve creates a standing source of reserve credit for member banks. But what should banks offer in exchange?",
    "nodes": [
      [
        "scroll",
        "Eligible loan paper"
      ],
      [
        "bank",
        "Reserve Bank"
      ],
      [
        "money",
        "Reserve balance"
      ]
    ],
    "detail": "The Federal Reserve Act was signed 23 December 1913; the twelve Reserve Banks opened 16 November 1914. We consolidate the Reserve Banks for teaching, not draw the Board as a separate bank funding them."
  },
  {
    "id": "real-bill",
    "act": 3,
    "era": "The Fed’s original commercial-credit ideal",
    "role": "You are a merchant",
    "title": "Sell goods now; receive payment later.",
    "words": "Start with a merchant’s trade. You have delivered goods, but your customer will pay later. A commercial bill records that payment due. A bank can buy the bill, giving you funds sooner.",
    "nodes": [
      [
        "storefront",
        "Goods delivered"
      ],
      [
        "scroll",
        "Payment due later"
      ],
      [
        "bank",
        "Bank buys bill"
      ]
    ],
    "term": "Commercial bill",
    "detail": "“Real bills” doctrine linked credit issuance to trade. That was a historical theory and eligibility ideal, not a guarantee that all resulting credit would be safe or noninflationary. Eligibility rules excluded important forms of speculative finance."
  },
  {
    "id": "rediscount-term",
    "act": 3,
    "era": "The original Fed plan",
    "role": "You are a member banker",
    "title": "Your asset pays later. You need reserves now.",
    "words": "Now you are the bank holding that bill. You need reserves before it pays. Rediscounting means selling it on to the Fed at a discount: less than the amount due later.",
    "nodes": [
      [
        "scroll",
        "$100 due later"
      ],
      [
        "arrows-left-right",
        "Sell at a discount"
      ],
      [
        "money",
        "$99 now"
      ]
    ],
    "term": "Rediscount",
    "detail": "The $100 face value and $99 price illustrate a discount, not a historical rate. The following account uses the bill’s $99 carrying value, so the sale has no assumed gain or loss. Endorsement and recourse are omitted."
  },
  {
    "id": "rediscount",
    "act": 3,
    "era": "Fed plan · A bill exchanged for reserves",
    "role": "You are the member banker",
    "title": "Trade the bill for a reserve balance.",
    "words": "The Fed agrees to buy your bill for $99. You give up an asset that pays later and receive a reserve balance you can use now. Let’s record the exchange.",
    "parties": [
      "Member bank",
      "Federal Reserve"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Bill (value today)",
        "amount": "−$99",
        "words": "You transfer the bill, recorded on your books at $99."
      },
      {
        "party": 0,
        "side": "a",
        "label": "Reserve balance",
        "amount": "+$99",
        "words": "You receive $99 of reserves at the Fed."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Bill (value today)",
        "amount": "+$99",
        "words": "The Fed acquires the bill at $99."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Bank reserve balance",
        "amount": "+$99",
        "words": "It credits your reserve account by $99."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "Illustrative bill: face value $100, current carrying value and sale price $99. The $1 discount is earned over time, not credited as a second reserve balance at purchase."
  },
  {
    "id": "fed-cash",
    "act": 3,
    "era": "Fed system · Cash demand",
    "role": "You are the member banker",
    "title": "Turn your reserve balance into currency.",
    "words": "Your customers need cash in hand, not a balance at the Fed. You ask to exchange the $99 reserve balance you just received for $99 in notes.",
    "parties": [
      "Member bank",
      "Federal Reserve"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Reserve balance",
        "amount": "−$99",
        "words": "Your $99 reserve balance at the Fed is used up."
      },
      {
        "party": 0,
        "side": "a",
        "label": "Fed notes in vault",
        "amount": "+$99",
        "words": "Your bank receives $99 in notes for its vault."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Bank reserve balance",
        "amount": "−$99",
        "words": "The Fed removes the $99 it owed on your reserve account."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Fed notes issued",
        "amount": "+$99",
        "words": "In its place, the Fed records $99 in notes issued."
      }
    ],
    "caption": "Same illustrative $99 · reserve balance exchanged for notes",
    "detail": "This continues the $99 rediscount example. Exchanging a reserve balance for notes changes the form of the Fed’s liabilities; it does not create another $99 of total liabilities. Historical gold and collateral requirements are not shown."
  },
  {
    "id": "elastic",
    "act": 3,
    "era": "When the harvest is over",
    "role": "You are following the reserve supply",
    "title": "Can the expansion reverse?",
    "words": "Later, the merchant’s customer pays the bill. Payment through the banking system can drain reserves back to the Fed. The temporary expansion can unwind as the original payment comes due.",
    "nodes": [
      [
        "scroll",
        "Credit extended"
      ],
      [
        "money",
        "Reserves expand"
      ],
      [
        "arrows-left-right",
        "Repayment contracts"
      ]
    ],
    "detail": "The bill’s maturity payment, routed through the banking system, reduces reserve balances held at the Fed. Interest affects the Fed’s earnings. Gold constraints, eligibility and the discount rate still limited the historical system."
  },
  {
    "id": "recap-fed",
    "recap": true,
    "bullets": [
      "A Reserve Bank can issue reserves against eligible assets.",
      "Rediscounting exchanges a bank’s bill for a reserve balance.",
      "Converting reserves into notes changes their form; repayment can shrink them."
    ],
    "bridge": "So far, we have followed the Fed’s plan for helping banks finance ordinary trade. Now test that plan against another war. What changes when government financing takes priority?"
  },
  {
    "id": "world-war",
    "act": 3,
    "era": "Europe: 1914 · United States enters: 1917",
    "role": "You are the wartime Treasury",
    "title": "The new central bank faces an old demand.",
    "words": "Jump to 1917: the United States enters World War I. You now run the wartime Treasury and need to finance supplies. The Fed helps distribute your war bonds and supports their financing.",
    "nodes": [
      [
        "bank",
        "Treasury"
      ],
      [
        "scroll",
        "War bonds"
      ],
      [
        "user",
        "Banks and public"
      ]
    ],
    "detail": "The Fed’s wartime role involved substantial lending backed by government obligations. It should not be reduced to a claim that its balance sheet was mainly outright Treasury purchases."
  },
  {
    "id": "war-credit",
    "act": 3,
    "era": "1917–1918 · Financing war bonds",
    "role": "You are a bank funding a bond purchase",
    "title": "Borrow against government securities.",
    "words": "Switch to a bank buying those war bonds. You can borrow reserves from the Fed using government securities as collateral. You keep the securities, but now owe the Fed a loan.",
    "nodes": [
      [
        "scroll",
        "Government security"
      ],
      [
        "bank",
        "Fed lending"
      ],
      [
        "money",
        "Reserve balance"
      ]
    ],
    "detail": "Secured member-bank advances were authorized in 1916. Unlike the earlier outright rediscount example, pledged collateral stays on the borrowing bank’s balance sheet and the bank owes the Fed a loan. “Government securities” avoids the anachronism of wartime Treasury bills, first introduced in 1929."
  },
  {
    "id": "war-advance",
    "act": 3,
    "era": "Wartime mechanism · Principal only",
    "role": "You are the borrowing bank",
    "title": "The Fed agrees to lend against your collateral.",
    "words": "Your bank receives reserves to help finance its bond holdings. It also takes on a debt to the Fed. Let’s add those entries while the pledged securities remain on your books.",
    "parties": [
      "Member bank",
      "Federal Reserve"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Reserve balance",
        "amount": "+$100",
        "words": "You receive $100 of reserves."
      },
      {
        "party": 0,
        "side": "l",
        "label": "Loan from Fed",
        "amount": "+$100",
        "words": "You owe the Fed $100. Your collateral remains yours."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Loan to bank",
        "amount": "+$100",
        "words": "The Fed holds a secured claim on your bank."
      },
      {
        "party": 1,
        "side": "l",
        "label": "Bank reserve balance",
        "amount": "+$100",
        "words": "It owes your new reserve balance."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "The government securities are already on the bank’s balance sheet and remain pledged as collateral. The diagram records only the new secured loan, with interest omitted."
  },
  {
    "id": "after-war",
    "act": 3,
    "era": "After World War I · Into the 1920s",
    "role": "You are a Reserve Bank policymaker",
    "title": "Must you wait for a bank to ask for credit?",
    "words": "The war ends. Now sit at the Fed’s policy desk. So far, banks have come to you for loans. An open-market operation lets you initiate a purchase or sale of securities to change reserves.",
    "nodes": [
      [
        "bank",
        "Fed initiative"
      ],
      [
        "scroll",
        "Securities trade"
      ],
      [
        "money",
        "Reserves change"
      ]
    ],
    "term": "Open-market operation",
    "detail": "Outright purchases and sales were authorized by the original Federal Reserve Act. Their coordinated use developed during the 1920s, including a committee in 1923. They were not invented only after WWI."
  },
  {
    "id": "open-market",
    "act": 3,
    "era": "1920s mechanism · Illustrative bank seller",
    "role": "You are the Federal Reserve",
    "title": "Buy a security; credit the seller’s reserve account.",
    "words": "You choose to buy a government security from a bank. You pay by crediting its reserve account. Follow how your decision changes both sets of accounts.",
    "parties": [
      "Federal Reserve",
      "Member bank"
    ],
    "entries": [
      {
        "party": 0,
        "side": "a",
        "label": "Government security",
        "amount": "+$100",
        "words": "You add the $100 government security to the Fed’s assets."
      },
      {
        "party": 0,
        "side": "l",
        "label": "Bank reserve balance",
        "amount": "+$100",
        "words": "You pay by crediting $100 to the bank’s reserve account."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Government security",
        "amount": "−$100",
        "words": "On the seller’s side, the bank gives up the security."
      },
      {
        "party": 1,
        "side": "a",
        "label": "Reserve balance",
        "amount": "+$100",
        "words": "The bank receives $100 in reserves instead."
      }
    ],
    "caption": "Illustrative $100 transaction · changes only",
    "detail": "The security is sold at its carrying value; gains and losses are omitted. A sale reverses these entries. A nonbank seller would also receive a bank deposit, adding another balance sheet. More reserves do not mechanically determine every market rate."
  },
  {
    "id": "hybrid",
    "act": 3,
    "era": "From this history to chapter 2",
    "role": "You are looking at the whole system",
    "title": "Whose bank is the central bank?",
    "words": "Look back at the two problems you helped solve: banks needed settlement funds, and governments needed war finance. The central bank serves both. Those roles help explain why the hierarchy changes over time.",
    "nodes": [
      [
        "bank",
        "Banks’ settlement"
      ],
      [
        "bank",
        "Central bank"
      ],
      [
        "scroll",
        "Government finance"
      ]
    ],
    "detail": "This is the chapter’s connection to Allyn Young’s historical argument: finance matters, and neither a purely state-money nor purely private-money account captures the hybrid system. His gold-standard commitments belong to their historical setting."
  },
  {
    "id": "recap-final",
    "recap": true,
    "bullets": [
      "War finance reshaped the money banks promised to pay.",
      "Seasonal cash pressure exposed a need for elastic reserves.",
      "The Fed became both a bankers’ bank and a government’s bank."
    ],
    "bridge": "Now you can read the hierarchy as a changing historical arrangement. Try telling one story back: whose payment problem started it, which balance sheets changed, and what new problem followed?"
  }
];
