/* Original diagrams; Phosphor glyphs are bundled with their MIT license. */
window.InterestRender = (function(){
 const M=InterestModel, ink='#e5e5eb', muted='#9798a7', accent='#b9adff', line='#464551';
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 const text=(x,y,s,size=18,color=ink,anchor='middle')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}">${esc(s)}</text>`;
 const icon=(name,x,y,size=48)=>`<svg x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" viewBox="0 0 256 256" fill="${ink}">${MoneyIcons[name]||MoneyIcons.coins}</svg>`;
 const ln=(x,y,a,b,color=line)=>`<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="${color}" stroke-width="2"/>`;
 const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="6" fill="${accent}"/>`;
 const wink=(x,y)=>`<g transform="translate(${x},${y})" aria-label="Wink points here"><path d="M-15 12l-11 10" stroke="${accent}" stroke-width="2"/><circle r="17" fill="${accent}"/><ellipse cx="-6" cy="-2" rx="2" ry="3" fill="#302740"/><path d="M3 -1q4 5 8 0M-3 7q4 3 7-1" stroke="#302740" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
 const label=(x,y,name,sub)=>icon(name,x,y)+text(x,y+51,sub,17);
 const token=(x,y,kind='money')=>icon(kind,x,y,30);
 const transfer=(from,to,ms,delay=0,kind='money')=>token(...M.travel(from,to,ms,delay),kind);
 const badge=(x,y,s,w=120)=>`<rect x="${x-w/2}" y="${y-25}" width="${w}" height="44" rx="9" fill="#24212f" stroke="#655c85"/>`+text(x,y+3,s,18,accent);
 function curve(ms,shape='normal',short=undefined,long=0,show=5,policy=false){
  const values=[...M.curves[shape]]; if(short!==undefined) values[0]=short;
  for(let i=1;i<5;i++) values[i]+=long*i/4;
  const xs=[85,190,295,400,505], ys=values.map(v=>252-v*36), names=[policy?'1 night':'3 mo','1 yr','2 yr','5 yr','10 yr'];
  let out=ln(60,40,60,258)+ln(60,258,545,258)+text(60,26,'Yearly yield',15,muted,'start')+text(545,309,'Time until repayment →',15,muted,'end');
  [0,2,4,6].forEach(v=>out+=text(44,257-v*36,v+'%',13,muted)+ln(60,252-v*36,540,252-v*36,'#262730'));
  const n=Math.min(show,1+Math.floor(ms/650));
  for(let i=0;i<n;i++) { if(i) out+=ln(xs[i-1],ys[i-1],xs[i],ys[i],accent);out+=dot(xs[i],ys[i])+text(xs[i],ys[i]-14,values[i].toFixed(1)+'%',15,accent); }
  xs.forEach((x,i)=>out+=text(x,282,names[i],14,muted));
  return out;
 }
 function render(step,ms,v){
  const phase=Math.min(1,ms/2200); let s=''; const scene=step.scene;
  if(scene==='time'||scene==='saving'){
   const rate=v.rate??step.rate??2, total=M.total(100,rate), saving=scene==='saving';
   s+=text(145,48,'TODAY',14,muted)+text(440,48,'ONE YEAR LATER',14,muted);
   s+=ln(145,186,440,186)+ln(145,177,145,195)+ln(440,177,440,195);
   s+=icon(saving?'vault':'wallet',145,103,50)+icon(saving?'wallet':'bank',440,103,50);
   s+=text(145,158,'$100',29)+text(440,158,'$'+(step.id==='start'||step.reveal||ms>1700?total.toFixed(0):'…'),29,accent);
   s+=transfer([177,186],[405,186],ms);
   s+=badge(292,80,rate+'% / year',140);
   if(ms>2000||step.reveal)s+=text(440,238,'$100 + $'+rate,23)+text(440,265,'original + interest',15,muted);
   s+=wink(497,99);
  } else if(scene==='choice'){
   const rate=v.cut??(step.control==='brake'?5:2);
   s+=badge(300,48,rate+'% / year',140);
   s+=label(142,155,'vault','Save $100')+label(450,155,'storefront','Borrow $100');
   s+=text(142,259,'Earn $'+rate,25,accent)+text(450,259,'Pay $'+rate+' extra',25,accent);
   s+=ln(280,90,169,119)+ln(320,90,423,119)+wink(507,133);
  } else if(scene==='flow'){
   s+=label(100,98,'user','You')+label(300,98,'storefront','Bike shop')+label(500,98,'coins','Supplier');
   s+=ln(100,199,500,199);
   s+=ms<2200?transfer([100,199],[300,199],ms,200):transfer([300,199],[500,199],ms,2400);
   s+=text(300,276,ms<2400?'A payment for a repair':'The shop buys a replacement part',19,accent)+wink(ms<2400?344:544,56);
  } else if(scene==='capacity'){
   const demand=v.demand??3;
   s+=label(430,122,'storefront','Same shop capacity');
   for(let i=0;i<demand;i++)s+=icon('user',80+i%3*69,99+Math.floor(i/3)*80,38);
   s+=ln(265,149,370,149)+text(150,260,demand+' customers',22,accent)+text(430,264,'3 repairs per day',20)+wink(490,75);
  } else if(scene==='many'){
   [['vault','Savings','2%'],['user','Home loan','5%'],['storefront','Business loan','7%']].forEach(([ic,l,r],i)=>{s+=label(110+i*190,119,ic,l)+text(110+i*190,241,r,32,accent);}); s+=wink(355,65);
  } else if(scene==='spread'){
   const risk=step.control==='risk'?1.8+((v.risk??1.8)-1.8)*phase:1.8, parts=[3,risk,.2], names=['Benchmark','Risk','Costs + margin'], fills=['#7c73b5','#a497dc','#ded7fa'];
   let x=65;parts.forEach((n,i)=>{const w=n*65; s+=`<rect x="${x}" y="94" width="${w*(step.id==='loan'?phase:1)}" height="45" rx="3" fill="${fills[i]}"/>`;x+=w;});
   parts.forEach((n,i)=>s+=text(105+i*190,192,n.toFixed(1)+'%',25,accent)+text(105+i*190,219,names[i],16,muted));
   s+=text(300,284,'Loan quote: '+M.loanRate(...parts).toFixed(1)+'%',25)+wink(529,104);
  } else if(scene==='bond'){
   s+=label(135,124,'bank','Government')+label(445,124,'scroll','Bond holder');
   s+=ln(195,122,385,122)+transfer([197,122],[383,122],ms,0,'scroll');
   s+=text(300,247,'A promise to pay on an agreed date',21,accent)+wink(504,77);
  } else if(scene==='price'){
   const price=v.price??100, yieldRate=M.yieldForPrice(price);
   s+=icon('money',135,103)+icon('scroll',445,103);
   s+=text(135,49,'PRICE TODAY',14,muted)+text(445,49,'PAYMENT IN ONE YEAR',14,muted);
   s+=text(135,168,'$'+price,32,accent)+text(445,168,'$105',32);
   s+=ln(186,112,386,112)+transfer([193,112],[380,112],ms);
   s+=text(300,246,'Your yearly yield: '+yieldRate.toFixed(2)+'%',26,accent)+text(300,278,'Same promised payment, different return',16,muted)+wink(530,107);
  } else if(scene==='curve'){
   s+=curve(ms,v.shape??'normal',undefined,0,v.maturity??5)+wink(561,81);
  } else if(scene==='policy'){
   s+='<rect x="70" y="70" width="30" height="188" fill="#b9adff" opacity=".09"/>';
   s+=curve(6000,'normal',2,(v.expectations??0)*phase,5,true)+wink(140,134);
   s+=text(170,60,'Policy steers the short end',16,accent,'start');
  } else if(scene==='overnight'){
   const back=ms>=3000;
   s+=label(122,98,'bank','Bank A')+label(470,98,'bank','Bank B');
   s+=text(300,40,back?'TOMORROW':'TONIGHT',14,muted)+ln(164,193,428,193);
   s+=back?transfer([428,193],[164,193],ms,3000):transfer([164,193],[428,193],ms);
   s+=text(300,247,back?'$1,000 + about $0.14 returned':'$1,000 lent for one night',22,accent)+text(300,280,'Illustrative rate: 5% per year',16,muted)+wink(back?174:522,52);
  } else if(scene==='qe'){
   s+=label(115,83,'bank','Central bank')+label(480,83,'user','Seller + bank');
   s+=ln(169,173,426,173)+ln(169,236,426,236);
   s+=transfer([426,173],[169,173],ms,0,'scroll')+transfer([169,236],[426,236],ms,0,'money');
   s+=text(300,148,'Bond ←',15,muted)+text(300,282,'→ Payment',15,muted)+wink(529,207);
  } else {
   s+=curve(6000,'normal',undefined,0,5,true)+text(370,40,'Market-priced longer yields',16,accent)+wink(551,86);
   s+=text(130,100,'Policy',17,accent);
  }
  return s;
 }
 return {render};
})();
