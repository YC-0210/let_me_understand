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
  if(['cash','iou','deposit','reserves','withdraw','dealer','support'].includes(scene)){
   const config={cash:['You','Café','user','storefront','money'],iou:['You','Café','user','storefront','scroll'],deposit:['Your account','Café account','wallet','wallet','wallet'],reserves:['Bank A','Bank B','bank','bank','vault'],withdraw:['Your bank','You','bank','user','money'],dealer:['Bond holder','Dealer','user','user','scroll'],support:['Central bank','Your bank','bank','bank','vault']}[scene];
   a+=actors(...config.slice(0,4))+line(160,213,440,213,gray,true)+moving(config[4],t,motion,scene==='cash'?green:purple);
   if(['cash','iou'].includes(scene)){a+=icon('fork-knife',300,58,32)+txt(300,93,scene==='cash'?'Lunch · $5':'“$5 tomorrow”','small',scene==='cash'?green:purple);}
   if(scene==='cash'||scene==='deposit'){a+=txt(110,265,done?'$0':'$5','amount')+txt(490,265,done?'$5':'$0','amount',done?green:'');}
   if(scene==='iou'){a+=txt(300,266,done?'You still owe $5':'A promise, not cash','',purple);}
   if(scene==='reserves'){a+=txt(300, 70,'Central-bank reserves','small',purple);}
   if(scene==='withdraw'){a+=txt(300,70,'$5 balance → $5 note','',purple)+txt(300,266,done?'One-for-one':'The bank promises conversion','muted');}
   if(scene==='dealer'){a+=txt(300,70,'A bond: future payments','small')+txt(300,266,done?'Sale price can change':'Sell for money now','muted');}
   if(scene==='support'){a+=txt(300,70,'A loan of reserves','small',purple)+txt(300,266,done?'The bank now owes a loan':'Reserves for payments','muted');}
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
   a+=txt(300, 80,scene==='trust'&&active?'“Please pay cash instead.”':'Promises to pay later','small')+txt(300,225,`${n} IOUs`,'amount')+txt(300,270,scene==='trust'?(active?'Same count · harder to use':'Willingly accepted'):'Each is still the same size','small')+wink(111,109);
  }else if(scene==='rates'){
   a+=icon('bank',110,120,54)+txt(110,174,'Central bank')+txt(445,118,'Longer-term')+txt(445,149,'borrowing')+line(180,130,340,130,purple,true)+txt(300,240,active?'Influence ≠ identical changes':'One policy rate · many other rates','small')+focus(66,60);
  }else{
   a+=icon('scroll',300,140,64,purple)+txt(300,225,'Who owes? What pays? Who connects?','small')+wink(228,87);
  }
  return a;
 }
 return {render};
})();
