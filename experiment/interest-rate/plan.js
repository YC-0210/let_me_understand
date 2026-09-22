window.InterestPlan = [
  {
    "id": "start",
    "chapter": "Money and time",
    "title": "What does borrowing $100 really cost?",
    "cue": "You need $100 for a bike repair. A lender asks for $102 back in one year. Follow the extra $2.",
    "scene": "time",
    "sourceTime": 49,
    "rate": 2,
    "detail": "Our made-up loan has one repayment after one year, no fees, and no payments in between. All dollar examples use one currency. No economics background needed."
  },
  {
    "id": "interest",
    "chapter": "Money and time",
    "title": "The extra $2 has a name.",
    "cue": "The $100 is the money borrowed. The extra $2 is interest. Watch them stay separate.",
    "scene": "time",
    "sourceTime": 54,
    "rate": 2,
    "reveal": true,
    "detail": "Interest is an amount of money. An interest rate expresses that amount relative to the money borrowed and the period of time."
  },
  {
    "id": "rate",
    "chapter": "Money and time",
    "title": "What changes when the rate changes?",
    "cue": "Choose a yearly rate. The original $100 stays the same; only the extra repayment changes.",
    "scene": "time",
    "sourceTime": 57,
    "rate": 2,
    "control": "rate",
    "detail": "For this one-year loan: interest = $100 × the yearly rate. A 2% rate means $2 of interest, making the total repayment $102."
  },
  {
    "id": "save",
    "chapter": "Money and time",
    "title": "What if you are the one lending?",
    "cue": "Put $100 in a savings account at 2% for a year. Now the extra $2 comes to you.",
    "scene": "saving",
    "sourceTime": 51,
    "detail": "A bank deposit is your claim on the bank. This fixed-rate example ignores taxes and fees; real savings and loan rates generally differ."
  },
  {
    "id": "check-time",
    "chapter": "Money and time",
    "title": "At 5%, how much do you repay?",
    "cue": "Start with the same $100 for one year. Count the original money and the interest.",
    "scene": "time",
    "sourceTime": 57,
    "rate": 5,
    "quiz": [
      "$5",
      "$100",
      "$105"
    ],
    "answer": 2,
    "feedback": "Yes: $100 returned + $5 interest = $105 in total.",
    "detail": "The rate is not the total amount repaid. It measures the cost relative to the principal over the stated time."
  },
  {
    "id": "cut",
    "chapter": "A useful simplification",
    "title": "Would a cheaper loan change your choice?",
    "cue": "Imagine every loan and savings rate falls together. Switch from 2% to 0% and look at the cost of waiting or borrowing.",
    "scene": "choice",
    "sourceTime": 76,
    "control": "cut",
    "detail": "This deliberately simplified world comes from the video. In reality many different rates exist, and income, confidence and access to credit also affect choices."
  },
  {
    "id": "circulation",
    "chapter": "A useful simplification",
    "title": "Your spending becomes someone’s income.",
    "cue": "You pay the bike shop. The shop pays a supplier. Trace the same payment through the two exchanges.",
    "scene": "flow",
    "sourceTime": 101,
    "detail": "Lower borrowing costs can encourage spending and investment. This is a possible chain, not a promise that everyone borrows or becomes richer."
  },
  {
    "id": "capacity",
    "chapter": "A useful simplification",
    "title": "Can the shop repair more bikes overnight?",
    "cue": "More orders arrive, but the shop still has the same capacity. Extra demand can put upward pressure on prices.",
    "scene": "capacity",
    "sourceTime": 162,
    "control": "demand",
    "detail": "Price pressure depends on spare capacity, costs and expectations. A rate cut does not automatically or immediately cause inflation; production may also rise."
  },
  {
    "id": "brake",
    "chapter": "A useful simplification",
    "title": "Why not leave rates at zero forever?",
    "cue": "Cheaper borrowing can encourage demand. More expensive borrowing can cool it. Neither change works instantly.",
    "scene": "choice",
    "sourceTime": 195,
    "control": "brake",
    "detail": "The video uses an accelerator/brake analogy. We keep its intuition while allowing for delays, uneven effects and other causes of inflation. Detailed effects on assets and exchange rates are outside this lesson."
  },
  {
    "id": "many",
    "chapter": "Many rates",
    "title": "Which rate are people talking about?",
    "cue": "A savings account, a home loan and a business loan can have different rates—even on the same day.",
    "scene": "many",
    "sourceTime": 218,
    "detail": "Rates differ with borrower risk, currency, term, collateral, funding costs and competition. The following numbers are invented teaching examples, not current offers."
  },
  {
    "id": "loan",
    "chapter": "Many rates",
    "title": "Where could a 5% loan rate come from?",
    "cue": "Build one illustrative quote: a 3% starting point, 1.8% for risk, and 0.2% for costs and margin.",
    "scene": "spread",
    "sourceTime": 235,
    "detail": "This is a teaching decomposition, not an actual bank pricing formula. Banks also consider funding, capital, liquidity, operating costs, contract options and competition."
  },
  {
    "id": "risk",
    "chapter": "Many rates",
    "title": "What if repayment looks less certain?",
    "cue": "Keep the starting point fixed. Change the risk allowance and watch only that piece grow.",
    "scene": "spread",
    "sourceTime": 251,
    "control": "risk",
    "detail": "Riskier repayment generally requires more compensation. Different loans cannot be compared by their headline rates alone."
  },
  {
    "id": "benchmark",
    "chapter": "Many rates",
    "title": "What is the starting point?",
    "cue": "A government bond is a promise to pay. Some government bonds offer a low-default-risk benchmark in their own currency.",
    "scene": "bond",
    "sourceTime": 287,
    "detail": "“Risk-free” is a modelling shorthand. Government credit quality varies; even low-default-risk bonds have inflation and market-price risk. Different currencies have different benchmarks."
  },
  {
    "id": "price",
    "chapter": "Many rates",
    "title": "The promised payment stays fixed. The price moves.",
    "cue": "This simple bond pays $105 in one year. Change what you pay today and compare what you earn.",
    "scene": "price",
    "sourceTime": 306,
    "control": "price",
    "detail": "This is a one-year zero-coupon example: yield = $105 ÷ price − 1. For bonds with coupons and multiple years, yield-to-maturity requires all payments and their timing. The video introduces the price-to-yield link here; we use a small worked example."
  },
  {
    "id": "term",
    "chapter": "A curve, not one number",
    "title": "One year or ten years: the same rate?",
    "cue": "Each time to repayment has its own rate. Place the rates next to the time you would wait.",
    "scene": "curve",
    "sourceTime": 325,
    "control": "maturity",
    "detail": "A yield curve compares yields across maturities for broadly comparable debt in the same currency, observed on the same date. These are illustrative values."
  },
  {
    "id": "curve",
    "chapter": "A curve, not one number",
    "title": "Connect the dots: a yield curve.",
    "cue": "Read left to right: a longer time until repayment. Read up: a higher yearly yield.",
    "scene": "curve",
    "sourceTime": 335,
    "detail": "This curve is a snapshot of different maturities today, not a prediction of one bond’s rate as years pass. The horizontal spacing is schematic."
  },
  {
    "id": "inverse",
    "chapter": "A curve, not one number",
    "title": "Does the line always slope upward?",
    "cue": "Switch the shape. If longer-term yields are lower than shorter-term yields, the curve is inverted.",
    "scene": "curve",
    "sourceTime": 355,
    "control": "curve",
    "detail": "An upward slope is common, not a rule. Inversion describes the relative yields; it is not a guarantee about the future. We stop at the definition, as the video does here."
  },
  {
    "id": "check-curve",
    "chapter": "A curve, not one number",
    "title": "What does the horizontal axis mean?",
    "cue": "These dots were all observed today. What changes as you move to the right?",
    "scene": "curve",
    "sourceTime": 335,
    "quiz": [
      "The date we observed the rate",
      "The time until repayment"
    ],
    "answer": 1,
    "feedback": "Exactly. Same observation date; different times until repayment.",
    "detail": "A maturity axis and a historical time series answer different questions. This graph is a maturity comparison."
  },
  {
    "id": "policy",
    "chapter": "Who moves the rates?",
    "title": "Does the central bank set every dot?",
    "cue": "Look at the shortest end. Central banks usually steer a short-term policy rate, rather than setting every loan quote.",
    "scene": "policy",
    "sourceTime": 380,
    "detail": "Implementation differs by country. For example, the Federal Reserve sets a target range for the federal funds rate and uses administered rates and operations to help steer overnight money-market rates."
  },
  {
    "id": "overnight",
    "chapter": "Who moves the rates?",
    "title": "What does “overnight” actually mean?",
    "cue": "One bank lends settlement money until tomorrow. The loan lasts one night; its quoted rate is usually annual.",
    "scene": "overnight",
    "sourceTime": 396,
    "detail": "At an illustrative 5% annual rate, one day of interest on $1,000 is about $0.14 using 365 days. Market conventions may use 360 days. It is not 5% charged for one night."
  },
  {
    "id": "long",
    "chapter": "Who moves the rates?",
    "title": "Why can the far end move differently?",
    "cue": "Today’s short rate is only one ingredient. Longer yields also reflect expected future rates and compensation for holding longer bonds.",
    "scene": "policy",
    "sourceTime": 415,
    "control": "expectations",
    "detail": "Holding the short end still while changing the long end is a thought experiment. Central-bank signals can alter expectations and long yields before any actual rate change. So “not directly set” does not mean “unaffected”."
  },
  {
    "id": "qe",
    "chapter": "Who moves the rates?",
    "title": "What if the central bank buys bonds?",
    "cue": "Follow the exchange: the central bank receives a bond, and payment goes to its seller.",
    "scene": "qe",
    "sourceTime": 428,
    "detail": "Large-scale asset purchases are called quantitative easing (QE). Payment is financed by creating central-bank reserves; when a nonbank sells, its bank receives reserves and credits the seller’s deposit. The diagram groups the seller and its bank to keep this exchange readable."
  },
  {
    "id": "qe-yield",
    "chapter": "Who moves the rates?",
    "title": "More buying can push prices up.",
    "cue": "Return to the fixed payment. A higher purchase price leaves a smaller yield for the next buyer.",
    "scene": "price",
    "sourceTime": 434,
    "control": "qe",
    "detail": "QE can put downward pressure on longer yields through several channels, including reducing term premiums. It does not pin every long rate: changing expectations and other market forces can offset it."
  },
  {
    "id": "recap",
    "chapter": "Put it together",
    "title": "Who decides “the interest rate”?",
    "cue": "There is a family of rates. The central bank steers the short end; markets price longer bonds; lenders add their own allowances.",
    "scene": "recap",
    "sourceTime": 477,
    "detail": "Our endpoint matches the video’s summary before 8:17. Later discussions of stocks, housing, gold and exchange rates are intentionally excluded. The video’s country examples are historical, not descriptions of current policy."
  },
  {
    "id": "check-final",
    "chapter": "Put it together",
    "title": "A rate cut happens. Must every loan fall equally?",
    "cue": "Use the whole picture: different maturities, market expectations and borrower risk.",
    "scene": "recap",
    "sourceTime": 485,
    "quiz": [
      "Yes—every rate falls by the same amount",
      "No—other ingredients can change"
    ],
    "answer": 1,
    "feedback": "Right. Policy influences the family of rates; it does not make them one identical number.",
    "detail": "You have reached the end of this experiment. You can replay, revisit a section, or leave a note for this edition in the app. Completing the lesson does not automatically mark any concept understood."
  }
];
