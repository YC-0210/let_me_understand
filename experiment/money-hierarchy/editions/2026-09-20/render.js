/* Shared by the full lesson and standalone library players. */
window.MoneyDrawing = (() => {
 const C={accent:'#b9afff',gold:'#e3bf79',cyan:'#81c9d3',rose:'#e7a6b7',line:'#444651'};
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=(x,y,s,cls='label',anchor='start',fill='')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}" ${fill?`style="fill:${fill}"`:''}>${esc(s)}</text>`;
 const reveal=t=>Math.min(1,Math.max(0,t/1.4));
 const line=(x1,y1,x2,y2,color=C.line,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="6 6"':''}/>`;
 const box=(x,y,w,h,color=C.line,fill='#191a20')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${fill}" stroke="${color}"/>`;
 const icon=(name,x,y,size=34,color='#cbd0da')=>`<g transform="translate(${x-size/2} ${y-size/2}) scale(${size/256})" style="color:${color}" fill="currentColor">${MoneyIcons[name]}</g>`;
 const wink=(x,y)=>`<g aria-label="Wink focus" transform="translate(${x} ${y})"><circle r="15" fill="${C.accent}"/><ellipse cx="-5" cy="-1" rx="2" ry="3" fill="#292039"/><path d="M2 0q4-5 8 0" fill="none" stroke="#292039" stroke-width="2" stroke-linecap="round"/></g>`;
 const token=(name,a,b,seconds,color=C.accent)=>{const d=Math.hypot(b[0]-a[0],b[1]-a[1]);const p=Math.min(1,Math.max(0,(seconds-.7)*180/d));return icon(name,a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p,26,color);};
 const arrow=(x,y,color=C.accent)=>`<path d="M${x-5} ${y+5}l5-5 5 5" fill="none" stroke="${color}" stroke-width="2"/>`;
 function hierarchy(s,t,o){
  const focus=Number(o.view??[2,1,0][s]); const names=['Gold','Currency','Deposits','Securities']; const meanings=['No issuer’s promise','Promise to pay gold','Promise to pay currency','Promise of future payment'];const icons=['coins','money','wallet','scroll'];
  let a=text(55,35,'HISTORICAL MODEL · GOLD STANDARD','tiny quiet');
  names.forEach((n,i)=>{const y=88+i*84;a+=box(115,y-29,370,58,i===focus?C.accent:C.line)+icon(icons[i],147,y,32,i===0?C.gold:'#cbd0da')+text(178,y+6,n)+text(470,y+5,i<=focus?'money here':'credit here','tiny', 'end',i<=focus?C.accent:'#a5abb6');if(i<3)a+=line(90,y+28,90,y+57)+arrow(90,y+35);});
  const from=s===0?focus:[2,1][s-1], delta=(focus-from)*84, markerY=88+from*84+Math.sign(delta)*Math.min(Math.abs(delta),Math.max(0,t-.3)*180);
  a+=wink(522,markerY)+text(564,90,['International settlement','Bank settlement','Your payment'][focus],'label')+text(564,124,['Gold settles at this level.','Higher-level money is needed.','A deposit can settle your bill.'][focus],'tiny quiet');
  a+=text(564,207,'THE SAME INSTRUMENT','tiny quiet')+icon('wallet',580,248,34)+text(610,244,'Your asset','label','start',C.cyan)+text(610,272,'The bank’s obligation','tiny','start',C.rose)+text(564,335,meanings[focus],'tiny quiet');
  return a;
 }
 function ledger(s,t,o){
  const boundary=o.boundary??['separate','private','whole'][s]; let a=text(45,32,'SELECTED ENTRIES · ILLUSTRATIVE 100 UNITS','tiny quiet');
  const xs=[55,345,635],names=['Central bank','Commercial bank','You'];
  xs.forEach((x,i)=>{a+=box(x,60,210,244)+icon(i===2?'user':'bank',x+30,87,28)+text(x+56,93,names[i],'label')+line(x+15,110,x+195,110)+text(x+18,137,'ASSETS','tiny quiet')+text(x+18,215,'LIABILITIES','tiny quiet');});
  a+=icon('coins',82,166,26,C.gold)+text(108,172,'Gold','label','start',C.gold)+text(72,250,'Currency −100','label','start',C.rose)+text(363,172,'Currency +100','label','start',C.cyan)+text(363,250,'Deposit −100','label','start',C.rose)+text(652,172,'Deposit +100','label','start',C.cyan)+text(652,250,'—','label');
  a+=`<path d="M550 260L610 260L610 180L636 180" fill="none" stroke="${C.accent}" stroke-width="2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-reveal(t)}"/>`+text(587,330,'One deposit, recorded on both sides','tiny quiet','middle');
  if(boundary!=='separate'){let x=boundary==='whole'?43:333,w=boundary==='whole'?814:524;a+=`<rect x="${x}" y="47" width="${w}" height="301" rx="14" fill="none" stroke="${C.accent}" stroke-dasharray="7 5" opacity="${reveal(t)}"/>`;a+=text(450,381,boundary==='whole'?'Whole system: currency and deposits are inside. Gold has no issuer.':'Private sector: deposits are inside; central-bank currency is outside.','label','middle');}else a+=text(450,381,'Matching entries do not mean two separate piles of wealth.','label','middle');
  a+=wink(boundary==='whole'?38:320,boundary==='separate'?247:70);return a;
 }
 function elasticity(s,t,o){
  const accepted=o.accepted??s>0;let a=text(50,32,'A TRADE TODAY · A PAYMENT LATER','tiny quiet');
  a+=icon('user',170,110,56)+text(170,159,'Buyer','label','middle')+icon('user',730,110,56)+text(730,159,'Seller','label','middle');
  a+=box(70,205,220,106)+text(180,238,'Currency available now','tiny quiet','middle')+text(180,280,'0','number','middle');
  a+=box(610,205,220,106)+text(720,238,accepted?'Claim on buyer':'No accepted payment','tiny quiet','middle')+text(720,280,accepted?'+1 IOU':'Trade waits','label','middle',accepted?C.cyan:C.rose);
  a+=line(230,112,669,112,accepted?C.accent:C.line,true)+text(450,86,accepted?'Accepted promise →':'Will a promise be accepted?','tiny','middle');
  if(accepted){a+=token('scroll',[260,112],[640,112],t)+text(180,345,'Buyer owes 1','label','middle',C.rose)+text(720,345,'Seller is owed 1','label','middle',C.cyan);}else a+=icon('scroll',450,112,26,'#888b96');
  a+=wink(450,207)+text(450,247,s===2?'Due date':'Credit can enable trade','label','middle')+text(450,279,s===2?'Currency still required':'without creating currency.','tiny quiet','middle')+text(450,394,'Conceptual example: one IOU. No money is multiplied by this diagram.','tiny quiet','middle');return a;
 }
 function cycle(s,t,o){
  const count=Number(o.quantity??[4,8,4][s]),trust=Number(o.trust??[55,90,15][s]);
  let a=text(45,32,'TWO DISTINCT DIMENSIONS · SCHEMATIC, NOT DATA','tiny quiet');
  a+=text(215,81,'How many claims?','label','middle')+text(675,81,'How money-like?','label','middle');
  for(let i=0;i<count;i++){let x=95+(i%4)*80,y=145+Math.floor(i/4)*78;a+=`<g opacity="${s===1&&i>=4?reveal(t):1}">`+icon('scroll',x,y,32,C.accent)+'</g>';}
  a+=text(215,331,`${count} illustrative claims`,'label','middle');
  a+=line(440,80,440,352)+icon('money',675,125,44,C.cyan)+text(750,131,'Settlement','tiny quiet');
  const y=320-trust*1.35;
  a+=line(675,156,675,y-20,trust>60?C.cyan:C.rose,true)+icon('scroll',675,y,32,C.accent)+text(750,y+6,'Credit','tiny quiet')+text(675,342,trust>65?'Easy to pass on':trust<35?'Conversion under strain':'Some conversion friction','label','middle')+wink(525,y);
  a+=text(450,394,'Count changes quantity. Distance represents qualitative difference, not a measured scale.','tiny quiet','middle');return a;
 }
 function bridges(s,t,o){
  const focus=Number(o.bridge??[2,1,0][s]),names=['Gold','Currency','Deposits','Securities'],icons=['coins','money','wallet','scroll'];let a=text(45,32,'INSTRUMENTS                         INSTITUTIONS                            CONVERSION TERMS','tiny quiet');
  for(let i=0;i<4;i++){const y=74+92*i;a+=icon(icons[i],82,y,32,i===0?C.gold:'#cbd0da')+text(114,y+6,names[i]);}
  ['Central bank','Banking system','Security dealers'].forEach((n,i)=>{const y=120+i*92,c=i===focus?C.accent:C.line;a+=`<path d="M230 ${y-46}H300V${y+46}H230" fill="none" stroke="${c}" stroke-width="2"/>`+line(300,y,370,y,c)+icon('arrows-left-right',398,y,30,c)+text(433,y+6,n)+text(656,y+6,['Gold exchange rate','Par · 1:1','Security price / yield'][i],'label','start',i===focus?C.accent:'#a5abb6');});
  a+=wink(610,120+focus*92)+text(450,405,'A maintained price connects different instruments. It does not make them identical.','tiny quiet','middle');return a;
 }
 function policy(s,t,o){
  let a=text(45,32,'MODERN LIQUIDITY SUPPORT · SCHEMATIC DEPARTURE','tiny quiet');const supported=o.support??s>0;
  a+=icon('bank',170,105,52)+text(170,153,'Central bank','label','middle')+icon('bank',720,105,52)+text(720,153,'Commercial bank','label','middle');
  a+=line(235,105,650,105,supported?C.accent:C.line)+text(450,80,supported?'Reserve balances →':'Settlement resources needed','tiny','middle');if(supported)a+=token('vault',[260,105],[630,105],t,C.cyan);
  a+=box(60,192,245,105)+text(182,227,supported?'Asset: loan to bank':'Can supply reserves','label','middle',C.cyan)+text(182,264,supported?'Liability: reserves':'subject to lending conditions','tiny quiet','middle');
  a+=box(600,192,245,105)+text(722,227,supported?'Asset: reserves':'Promises to honour','label','middle',C.cyan)+text(722,264,supported?'Liability: central-bank loan':'Higher-level money needed','tiny quiet','middle');
  a+=wink(450,225)+text(450,268,supported?'Support is a loan.':'Find the strained link.','label','middle');
  a+=text(450,354,s===2?'Overnight rate → financing conditions → spending':'Liquidity support does not automatically cure insolvency.','label','middle')+text(450,389,s===2?'Influence with slippage, not a guaranteed one-for-one response.':'Both sides acquire entries. This is not a gift of net wealth.','tiny quiet','middle');return a;
 }
 return {render:(mode,s,t,o={})=>({hierarchy,ledger,elasticity,cycle,bridges,policy}[mode])(s,t,o)};
})();
