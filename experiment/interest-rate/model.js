(function(root) {
  const clamp = (v,a,b) => Math.min(b,Math.max(a,v));
  const model = {
    total: (principal, rate) => principal * (1 + rate / 100),
    overnightInterest: (principal, annualRate) => principal * annualRate / 100 / 365,
    yieldForPrice: (price, payoff=105) => (payoff/price-1)*100,
    loanRate: (benchmark, risk, margin) => benchmark + risk + margin,
    travel: (from, to, ms, delay=0) => {
      const distance = Math.hypot(to[0]-from[0],to[1]-from[1]);
      const p = distance ? clamp((ms-delay)/1000*100/distance,0,1) : 1;
      return [from[0]+(to[0]-from[0])*p, from[1]+(to[1]-from[1])*p];
    },
    curves: {normal:[2,2.4,3,3.6,4], inverted:[4.5,4.1,3.6,3.1,2.8]},
  };
  if(typeof module !== 'undefined') module.exports=model;
  else root.InterestModel=model;
})(typeof window !== 'undefined' ? window : globalThis);
