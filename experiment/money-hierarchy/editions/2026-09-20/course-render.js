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
