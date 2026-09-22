window.MoneyCourseDrawing=(()=>{
 const purple='#bdb1ff',green='#9bd8be',gold='#e7c685',gray='#606473';
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const txt=(x,y,t,cls='',color='')=>`<text x="${x}" y="${y}" text-anchor="middle" class="${cls}" ${color?`style="fill:${color}"`:''}>${escape(t)}</text>`;
 const icon=(name,x,y,size=48,color='#d0d3df')=>`<g transform="translate(${x-size/2} ${y-size/2}) scale(${size/256})" fill="currentColor" style="color:${color}">${MoneyIcons[name]}</g>`;
 const line=(x1,y1,x2,y2,color=gray,dash=false)=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="2" ${dash?'stroke-dasharray="4 6"':''}/>`;
 const box=(x,y,w,h,color=gray)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#191b22" stroke="${color}"/>`;
 const wink=(x,y)=>`<g aria-label="Wink points to the focus" transform="translate(${x} ${y})"><circle r="18" fill="${purple}"/><ellipse cx="-6" cy="-1" rx="2.2" ry="3.3" fill="#292039"/><path d="M2 0q4-5 9 0" fill="none" stroke="#292039" stroke-width="2.2" stroke-linecap="round"/><path d="M-3 9q4 3 8-1" fill="none" stroke="#292039" stroke-width="1.5"/></g>`;
 const focus=(x,y)=>wink(x,y)+`<path d="M${x+5} ${y+23}l10 12" fill="none" stroke="${purple}" stroke-width="2" stroke-linecap="round"/>`;
 const moving=(name,t,active,color=purple)=>{const x=160+(active?Math.min(280,Math.max(0,t-.3)*180):0);return icon(name,x,213,26,color);};
 const actors=(left,right,leftIcon='user',rightIcon='storefront')=>icon(leftIcon,110,123,54)+txt(110,172,left)+icon(rightIcon,490,123,54)+txt(490,172,right);
 function render(p,active,t){const motion=active&&Boolean(p.action),done=motion&&t>=1.86;let a='';const scene=p.scene;
  if(scene==='pyramid'){
   const u=motion?Math.min(1,Math.max(0,t-.3)/2.4):0;
   const grow=p.mode==='expand'?u:p.mode==='contract'?1-u:0;
   const w=110+75*grow;
   a+=txt(300,22,'Historical model · not data','small')+`<path d="M300 82L${300-w} 224H${300+w}Z" fill="${purple}" fill-opacity=".08" stroke="${purple}" stroke-width="2"/>`;
   [108,162].forEach(y=>{const half=w*(y-82)/142;a+=line(300-half,y,300+half,y,gray,true);});
   a+=icon('coins',300,59,26,gold)+txt(525,81,'Money','small')+txt(525,122,'Currency','small')+txt(525,174,'Deposits','small')+txt(525,217,'Credit','small')+line(77,211,77,65,purple)+txt(78,44,'Quality ↑','small');
   const n=3+Math.floor(grow*4);for(let i=0;i<n;i++)a+=icon('scroll',[265,300,335,230,370,195,405][i],201,26,purple);
   a+=line(300-w,242,300+w,242,green)+txt(300,274,p.mode==='read'?'← Quantity →':p.mode==='expand'?'Credit expands relative to money':'Credit contracts; distinctions return','small')+wink(128,111);
  }else if(scene==='deadline'){
   a+=actors('Café','Supplier','storefront','user');
   for(let i=0;i<4;i++)a+=icon('scroll',218+i*54,41,26,purple);
   a+=txt(300,82,'4 customer IOUs · cash unchanged','small');
   if(p.mode==='elasticity'){
    a+=line(160,213,440,213,gray,true)+moving('scroll',t,motion)+txt(300,267,done?'Café owes supplier tomorrow':'Supplier agrees to wait','small');
   }else{
    a+=line(300,191,300,244,green)+txt(300,267,active?'Payment is due now':'A deadline is approaching','small')+txt(300,183,'Today','small');
   }
   a+=wink(548,73)+line(538,94,518,112,purple);
  }else if(scene==='principles'){
   a+=icon('money',150,98,52,green)+icon('scroll',450,98,52,purple)+txt(150,155,'Settlement limits','small')+txt(450,155,'Credit can expand','small')+txt(150,195,'Currency principle','small')+txt(450,195,'Banking principle','small')+line(223,100,377,100,gray,true)+txt(300,266,active?'Both belong to the same system':'Which part can we leave out?','small')+wink(300,54);
  }else if(scene==='overnight'){
   const repay=p.mode==='repay';const dx=motion?Math.min(280,Math.max(0,t-.3)*180):0;
   a+=actors('Bank A','Bank B','bank','bank')+txt(300,32,repay?'Tomorrow · return $100 + $0.01':'Today · B lends $100 to A','small');
   a+=txt(300,72,repay?'A has received funds before repayment':'Reserves already exist','small')+line(160,213,440,213,gray,true)+icon('vault',repay?160+dx:440-dx,213,26,purple);
   a+=txt(110,268,repay?(done?'$0':'$100.01'):(done?'$100':'$0'),'amount')+txt(490,268,repay?(done?'$200.01':'$100'):(done?'$100':'$200'),'amount')+txt(300,263,'Reserves','small')+wink(repay?55:545,65)+line(repay?70:530,82,repay?95:505,96,purple);
  }else if(scene==='anchor'){
   const raise=p.mode==='raise',changed=motion&&t>=1;
   a+=txt(300,27,'An eligible lender compares','small')+icon('bank',150,100,48)+icon('bank',450,100,48)+txt(150,149,'Central bank','small')+txt(450,149,'Market borrower','small');
   a+=txt(150,199,raise&&changed?'4%':'3%','amount',purple)+txt(450,199,raise&&t>=2&&motion?'New offer?':'2%','amount')+txt(150,230,'Earn on reserves','small')+txt(450,230,'Offer to borrow','small')+txt(300,276,'Illustrative annual rates','small')+wink(55,161);
  }else if(scene==='funding'){
   const u=motion?Math.min(1,Math.max(0,t-.3)/2):0;
   a+=icon('scroll',300,47,40,purple)+txt(300,89,'Bond pays later','small')+icon('bank',110,143,42)+icon('user',490,143,42)+txt(110,190,'Lender','small')+txt(490,190,'Dealer','small')+line(180,150,420,150,gray,true);
   a+=txt(300,143,'Overnight funding','small')+txt(300,222,`${(3+2*u).toFixed(1)}% per year`,'amount',purple)+txt(300,267,'Renewed daily · invented rates','small')+wink(60,50);
  }else if(scene==='yield'){
   const u=motion?Math.min(1,Math.max(0,t-.3)/2.4):0;
   const start=p.mode==='premium'?[2,4,5]:[2,3,4];
   const end={read:[2,3,4],expect:[2,4,5],premium:[2,4.5,5.8],invert:[5.5,4.4,4]}[p.mode];
   const xs=[118,300,508],y=r=>228-r*27;
   a+=line(211,41,233,41,gray,true)+txt(272,46,'Before','small')+line(344,41,366,41,purple)+txt(398,46,'Now','small');
   a+=txt(300,20,'Annual interest rate · illustrative','small')+line(87,51,87,228)+line(87,228,546,228);
   [0,3,6].forEach(r=>{a+=txt(59,y(r)+5,r+'%','small')+line(87,y(r),546,y(r),'#343742',true);});
   a+=`<path d="M${xs.map((x,i)=>x+' '+y(start[i])).join('L')}" fill="none" stroke="${gray}" stroke-width="2" stroke-dasharray="5 6"/>`;
   a+=`<path d="M${xs.map((x,i)=>x+' '+y(start[i]+(end[i]-start[i])*u)).join('L')}" fill="none" stroke="${purple}" stroke-width="3"/>`;
   ['1 day','1 year','10 years'].forEach((label,i)=>{a+=txt(xs[i],252,label,'small');});
   a+=txt(300,280,'Time until repayment →','small');
   const longFocus=p.mode==='expect'||p.mode==='premium',fi=longFocus?2:0;
   a+=wink(longFocus?565:118,43)+line(longFocus?550:118,66,xs[fi],y(start[fi]+(end[fi]-start[fi])*u)-10,purple);
  }else if(scene==='countercycle'){
   const ease=p.mode==='ease',u=motion?Math.min(1,Math.max(0,t-.3)/2.4):0,w=ease?80+60*u:165-50*u;
   a+=icon('bank',85,96,47)+txt(85,143,'Central bank','small')+`<path d="M360 51L${360-w} 231H${360+w}Z" fill="${purple}" fill-opacity=".07" stroke="${purple}" stroke-width="2"/>`+icon('money',360,85,26,green);
   for(let i=0;i<3;i++)a+=icon('scroll',320+i*40,200,26,purple);
   a+=line(135,100,245,100,purple,true)+txt(300,273,ease?'Room to finance payments':'Pressure on new borrowing','small')+wink(40,39);
  }else
  if(scene==='loan'){
   a+=icon('user',100,52,42)+txt(100,92,'You')+icon('bank',500,52,42)+txt(500,92,'Your bank');
   a+=line(150,145,450,145,purple,true)+icon('wallet',300,145,36,purple)+txt(300,117,active?'Bank owes you $5 now':'Spendable balance','small')+txt(100,151,active?'$5':'$0','amount');
   a+=line(150,229,450,229,green,true)+icon('scroll',300,229,36,green)+txt(300,201,active?'You owe bank $5 later':'Loan to repay','small')+txt(500,235,active?'$5':'$0','amount');
   a+=txt(300,281,'Two promises · no new reserves','small')+wink(45,137);
  }else if(scene==='interbank'){
   a+=icon('wallet',100,43,34)+txt(100,83,'You · Bank A','small')+txt(100,119,done?'$0':'$5','amount')+icon('wallet',500,43,34)+txt(500,83,'Café · Bank B','small')+txt(500,119,done?'$5':'$0','amount');
   a+=txt(300,62,'Customer deposits','small')+txt(300,96,done?'Accounts updated':'One $5 purchase','small',purple);
   a+=icon('bank',100,174,38)+icon('bank',500,174,38)+txt(300,167,'At the central bank','small')+txt(300,195,'Reserves','small',purple)+line(160,222,440,222,gray,true);
   const x=160+(motion?Math.min(280,Math.max(0,t-.3)*180):0);a+=icon('vault',x,222,26,purple);
   a+=txt(100,264,done?'$15':'$20','amount')+txt(500,264,done?'$25':'$20','amount')+wink(done?555:45,167);
  }else if(scene==='dealer'){
   a+=actors('You','Dealer','user','user')+txt(300,36,'Bond: $10 next year','small');
   const dx=motion?Math.min(280,Math.max(0,t-.3)*180):0;
   a+=line(160,206,440,206,purple,true)+icon('scroll',160+dx,206,26,purple)+line(160,252,440,252,green,true)+icon('wallet',440-dx,252,26,green)+txt(300,178,'$9 today ←','small',green)+focus(done?448:68,60);
  }else if(scene==='bond-price'){
   a+=icon('scroll',300,68,46,purple)+txt(300,112,'Still promises $10 next year','small')+txt(145,176,'Old quote','small')+txt(145,213,'$9','amount')+txt(455,176,'New quote','small')+txt(455,213,'$8','amount')+line(207,200,386,200,gray,true)+txt(300,275,active?'Price changed · promise unchanged':'What changed?','small')+wink(385,144);
  }else if(scene==='timing'){
   a+=icon('storefront',300,46,40)+txt(300,83,'The café','small')+line(90,200,510,200,gray,true)+icon('money',140,140,36,green)+txt(140,179,'$5 due','amount')+txt(140,237,'Today','small')+icon('scroll',460,140,36,purple)+txt(460,179,'$10 expected','amount')+txt(460,237,'Tomorrow','small')+txt(300,278,active?'Dates matter, not only totals':'Cash available today: $0','small')+wink(65,140);
  }else if(['cash','iou','repay-iou','deposit','reserves','withdraw','support'].includes(scene)){
   const config={cash:['You','Café','user','storefront','money'],'repay-iou':['You','Café','user','storefront','money'],iou:['You','Café','user','storefront','scroll'],deposit:['Your account','Café account','wallet','wallet','wallet'],reserves:['Bank A','Bank B','bank','bank','vault'],withdraw:['Your bank','You','bank','user','money'],dealer:['Bond holder','Dealer','user','user','scroll'],support:['Central bank','Your bank','bank','bank','vault']}[scene];
   a+=actors(...config.slice(0,4))+line(160,213,440,213,gray,true)+moving(config[4],t,motion,scene==='cash'?green:purple);
   if(['cash','iou'].includes(scene)){a+=icon('fork-knife',300,58,32)+txt(300,93,scene==='cash'?'Lunch · $5':'“$5 tomorrow”','small',scene==='cash'?green:purple);}
   if(scene==='cash'||scene==='deposit'){a+=txt(110,265,done?'$0':'$5','amount')+txt(490,265,done?'$5':'$0','amount',done?green:'');}
   if(scene==='iou'){a+=txt(300,266,done?'You still owe $5':'A promise, not cash','',purple);}
   if(scene==='repay-iou'){a+=icon('scroll',300,58,34,done?gray:purple)+txt(300,93,done?'IOU paid · $0 owed':'IOU unpaid · $5 owed','small')+txt(300,267,done?'Cash received · promise settled':'Pay the existing debt','small',green);}
   if(scene==='reserves'){a+=txt(300, 70,'Central-bank reserves','small',purple);}
   if(scene==='withdraw'){a+=txt(300,70,'$5 balance → $5 note','',purple)+txt(300,266,done?'Your balance: $0 · Cash: $5':'Your balance: $5 · Cash: $0','muted');}
   if(scene==='dealer'){a+=txt(300,70,'A bond: future payments','small')+txt(300,266,done?'Sale price can change':'Sell for money now','muted');}
   if(scene==='support'){a+=txt(300,70,'A loan of reserves','small',purple)+txt(300,266,done?'New reserves · new loan owed':'Bank cannot issue its own reserves','muted');}
   a+=focus(done?448:p.focus==='shop'?448:p.focus==='promise'?265:68,!done&&p.focus==='promise'?125:60);
  }else if(scene==='pair'){
   a+=box(42,96,224,138,active?gray:purple)+box(334,96,224,138,active?purple:gray)+icon('user',154,63,36)+icon('bank',446,63,36)+txt(154,132,'You')+txt(446,132,'Your bank')+txt(154,178,'Are owed $5','',green)+txt(446,178,'Owes you $5','',purple)+txt(154,212,active?'Your asset':'','small')+txt(446,212,active?'Its liability':'','small')+line(270,167,330,167,purple,true)+txt(300,276,'One bank balance','muted')+focus(active?535: 62,45);
  }else if(scene==='boundary'||scene==='outside'){
   a+=actors(scene==='boundary'?'You':'Private sector',scene==='boundary'?'Your bank':'Central bank','user','bank')+txt(110,220,scene==='boundary'?'Claim: +$5':'Holds currency','small',green)+txt(490,220,scene==='boundary'?'Owes: −$5':'Issues currency','small',purple);
   const w=active?566:scene==='outside'?220:0;
   if(w)a+=`<rect x="17" y="79" width="${w}" height="163" rx="16" fill="none" stroke="${purple}" stroke-width="2" stroke-dasharray="5 6" opacity="${Math.min(1,t/.8)}"/>`;
   a+=txt(300,277,active?(scene==='boundary'?'+$5 − $5 = $0 inside the group':'Issuer and holder are now inside'):(scene==='outside'?'Issuer outside the boundary':'Separate accounts'),'small')+wink(300,54);
  }else if(scene==='two-layers'||scene==='gold'||scene==='ladder'){
   let rows=scene==='two-layers'?[['vault','Reserves','Banks pay banks'],['wallet','Deposits','You pay the café']]:scene==='gold'?[['coins','Gold','Historical example'],['money','Currency','Promises gold'],['wallet','Deposits','Promises currency']]:[['money','Currency','Gold standard → gold'],['wallet','Deposits','Bank → currency'],['scroll','Securities','Dealer → money']];
   rows.forEach((r,i)=>{const y=rows.length===2?95+i*112:55+i*90;a+=icon(r[0],145,y,34,i===0&&scene==='gold'?gold:purple)+txt(315,y+4,r[1])+txt(315,y+ 30,r[2],'small');if(i<rows.length-1)a+=line(103,y+23,103,y+(rows.length===2?78:65),gray,true);});
   a+=wink(74,active?55:rows.length===2?205:235);
  }else if(scene==='quantity'||scene==='trust'){
   const n=scene==='quantity'?(active?4:2):4;
   for(let i=0;i<n;i++)a+=icon('scroll',180+i*80,147,36,scene==='trust'&&active?'#979daa':purple);
   a+=txt(300, 80,scene==='trust'&&active?'Supplier: “Payment today, please.”':'Promises to pay later','small')+txt(300,225,`${n} IOUs`,'amount')+txt(300,270,scene==='trust'?(active?'Same count · harder to use':'Café accepted these IOUs'):'Each is still the same size','small')+wink(111,109);
  }else if(scene==='rates'){
   a+=icon('bank',110,120,54)+txt(110,174,'Central bank')+txt(445,118,'Business')+txt(445,149,'loan rate')+line(180,130,340,130,purple,true)+txt(300,240,active?'Influence ≠ identical changes':'One policy rate · many other rates','small')+focus(66,60);
  }else{
   a+=icon('storefront',110,102,48)+txt(110,152,'Café')+icon('scroll',110,204,34,purple)+txt(110,248,'Holds your IOU','small')+icon('user',490,102,48)+txt(490,152,'Supplier')+icon('wallet',490,204,34,green)+txt(490,248,'Wants bank payment','small')+txt(300,205,'≠','amount')+wink(300,94);
  }
  return a;
 }
 return {render};
})();
