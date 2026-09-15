/* Course adapters for the three motion-study techniques. Old gallery renderers stay available for comparison. */
window.CourseMotion=(()=>{
 const M=window.Part3Models,e=window.Animations.esc;
 const mix=(a,b,t)=>a+(b-a)*t;
 const line=(a,b,color='#ac98ec',opacity=1)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="3" opacity="${opacity}" marker-end="url(#course-arrow)"/>`;
 const label=(x,y,t,size=15)=>`<text x="${x}" y="${y}" text-anchor="middle" fill="#e5dff0" font-size="${size}">${e(t)}</text>`;
 const node=(x,y,r,fill='#292238',stroke='#ac98ec',extra='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3" ${extra}/>`;
 const focus=(x,y,dx=x>430?-64:64,dy=0)=>node(x,y,36,'none','#d8c9f3',`data-motion-focus="true" data-dock="${dx}" data-dock-y="${dy}" stroke-dasharray="3 5"`);
 const packet=(a,b,t)=>t>0&&t<1?node(mix(a[0],b[0],t),mix(a[1],b[1],t),6,'#80d9b0','#80d9b0'):'';
 function ownership(scene,n,E,t){
  const now=M.ownership(scene,n),prev=M.ownership(scene,Math.max(0,n-1));let s='',spot=[140,90];
  const resources=now.resources;
  const position=title=>[title==='Listening socket'&&resources.length>1?190:title==='Connection A'&&resources.length>1?410:300,260];
  now.owners.forEach((o,i)=>{
   const base=[i?460:140,90],old=prev.owners[i],birth=old?1:t;
   o.entries.forEach((h,j)=>{const end=position(h.target),before=old?.entries.find(x=>x.target===h.target),opacity=mix(before?.open?1:0,h.open?1:0,t);
    if(resources.some(r=>r.title===h.target)){s+=line([base[0],112],[end[0],end[1]-28],'#ac98ec',opacity);s+=node(mix(base[0],end[0],.24),mix(112,end[1],.24),10,'#191820','#ac98ec',`opacity="${opacity}"`);s+=`<g opacity="${opacity}">${label(mix(base[0],end[0],.24),mix(112,end[1],.24)+4,h.label,12)}</g>`;}
    else s+=label(105+j*95,230,`${h.label} · ${['Input','Output','Error'][j]}`,13);
   });
   s+=node(mix(140,base[0],birth),90,27*birth,o.inactive?'#191820':'#30263f');s+=label(base[0],43,i?'Child':'Parent');
  });
  resources.forEach(r=>{let [x,y]=position(r.title);s+=node(x,y,25,r.count?'#30263f':'#191820',r.count?'#ac98ec':'#777180')+label(x,y+55,r.title,14)+label(x,y+6,String(r.count),18);});
  if(scene==='descriptors')spot=n?position(n===1?'Listening socket':'Connection A'):[140,90];
  else if(scene==='shared')spot=n===0?[140,90]:n===1?[460,90]:[300,260];
  else if(scene==='close-copies')spot=n===1?[140,90]:n===2?[460,90]:n===3?position('Connection A'):[140,90];
  else spot=n===0?[140,90]:[300,260];
  if(['missing-close','close-copies'].includes(scene)){
   const r=resources.find(r=>r.title==='Connection A'),pos=position('Connection A');
   s+=line([pos[0],286],[pos[0],347],'#80d9b0',r.count?1:.25)+node(pos[0],365,15,'#191820','#8f879c')+label(pos[0],403,'Browser',14);
   if(scene==='missing-close'&&n>=1||scene==='close-copies'&&n===3)s+=packet([pos[0],285],[pos[0],350],t);
   if(!r.count)s+=label(pos[0],371,'✓',18)+label(pos[0]+67,368,'EOF',13);
   else if(scene==='missing-close'&&n===2)s+=label(pos[0]+80,368,'still open',13);
  }
  return {svg:s+focus(...spot),key:'A04',legend:'Lines = open handles · circles below = shared sockets · numbers inside = open handles'};
 }
 function records(scene,n,E,t){
  const now=M.records(scene,n,E),prev=M.records(scene,Math.max(0,n-1),E),xs=now.records.length===1?[300]:[130,300,470];let s='',spot=[xs[0],90];
  now.records.forEach((r,i)=>{let old=prev.records[i].state,x=xs[i],r0=old==='collected'?0:27,r1=r.state==='collected'?0:27;
   let radius=mix(r0,r1,t);if(radius>0)s+=node(x,90,radius,r.state==='running'?'#514170':'#191820',r.state==='running'?'#ac98ec':'#f1c17c');
   if(r.state==='running')s+=`<path d="M ${x-7} 82 l 15 8 l -15 8 Z" fill="#d4c3f8"/>`;
   s+=label(x,42,now.records.length===1?'Child':`Child ${i+1}`,14);
   if(r.state==='collected'){if(old!=='collected')s+=packet([x,90],[300,310],t);if(old==='collected'||t===1)s+=label(x,97,'✓',20);}
   if(old==='running'&&r.state==='ready')s+=packet([x,120],[300,220],t);
   if(old!==r.state)spot=[x,90];
  });
  const notice=now.notice.value,blocked=notice==='Blocked in wait';
  s+=node(300,310,27,blocked?'#45321e':'#30263f',blocked?'#f1c17c':'#ac98ec')+label(300,362,'Parent');
  if(/signal|burst|drain|not-ready/.test(scene)){s+=node(300,220,19)+label(300,226,notice==='1'||notice==='0'?notice:notice==='PID 0'?'0':notice==='Child PID returned'?'PID':'—',17)+label(395,225,scene==='not-ready'?'wait result':'notice',13);}
  if(blocked)s+=label(300,315,'Ⅱ',20);
  if(['wait','not-ready'].includes(scene)&&n===1)spot=scene==='wait'?[300,310]:[300,220];
  if(['signal','burst'].includes(scene)&&n===1||scene==='drain'&&(n===0||n===4))spot=[300,220];
  if(scene==='burst'&&n===2){const left=now.records.findIndex(r=>r.state==='ready');spot=[xs[left],90];}
  if(scene==='wait'){
   s+=node(120,310,12,'#191820','#8f879c')+label(120,350,'New visitor',13)+line([135,310],[265,310],'#80d9b0',blocked?.25:.7);
   if(blocked)s+=label(205,317,'Ⅱ',20);else s+=packet([135,310],[265,310],t);
  }
  if(scene==='drain'&&n===4)s+=label(300,315,'✓',20)+label(440,315,'no children left',13);
  return {svg:s+focus(...spot,spot[1]===220?-64:spot[0]>430?-64:64),key:'A06',legend:'Filled = running · hollow = exit record · moving result / ✓ = collected'};
 }
 function stages(scene,n,E,t){
  const now=M.stage(scene,n,E),prev=M.stage(scene,Math.max(0,n-1),E);let s='',spot=[150,180];
  const count=now.actors.length,positions=count===1?[[300,170]]:count===3?[[130,105],[440,200],[130,300]]:[[150,180],[450,180]];
  now.actors.forEach((a,i)=>{if(scene==='lifecycle'&&n===0&&i===1)return;let [x,y]=positions[i],old=prev.actors[i],born=old?1:t;
   if(!old){x=mix(positions[0][0],x,born);y=mix(positions[0][1],y,born);}
   s+=node(x,y,30*born,a.active?'#493862':'#211e29');
   const short=scene==='endpoints'?a.label:scene==='setup'?(i?'Kernel':'Listener'):scene==='accept'?(i?'Connection B':'Listener'):scene==='retry'?(i?'Modern Python':'Historical Python'):scene==='code'?['SIGCHLD','fork()','Parent','Child','waitpid()'][n]:a.label.replace('CONNECTED SOCKET','Connection B');
   s+=label(positions[i][0],positions[i][1]-55,short,scene==='endpoints'?13:15);
   if(scene==='endpoints'){
    const addr=a.title.split(':');s+=label(positions[i][0],positions[i][1]+55,addr.length===2?addr[0]:'port pending',13);
    if(addr.length===2)s+=label(positions[i][0],positions[i][1]+77,':'+addr[1],15);
   }
   if(scene==='process')s+=label(x,y+65,a.title,14)+(n===2&&i===1?label(x,y+88,a.detail,13):'');
   if(a.active)s+=`<circle cx="${x}" cy="${y}" r="39" fill="none" stroke="#ac98ec" stroke-width="3" stroke-dasharray="${n?130:60} 250"/>`;
  });
  const focusIndex={network:[0,1,1],setup:[0,0,0,1],endpoints:[0,1,2],accept:[0,1,1,1],process:[0,1,1],fork:[0,1,0],interrupted:[0,1,0],retry:[0,1,1],lifecycle:[0,0,1,1,0],code:[0,0,0,0,0]}[scene][n];
  spot=positions[Math.min(focusIndex,count-1)];
  if(count>1&&!(scene==='lifecycle'&&n===0)){
   let a=positions[0],b=positions[1];
   // Relationship/assignment paths, not literal packet routes.
   if(scene==='endpoints'&&n===2){a=positions[2];}
   s+=line([a[0]+35,a[1]],[b[0]-35,b[1]],'#766c91',.5);
   if(n>0)s+=packet(a,b,t);
   if(scene==='network'&&n===2)s+=label(300,240,'TCP · HTTP bytes',14);
   if(scene==='fork'&&n>0)s+=label(150,240,'child PID',14)+label(450,240,'0',14);
   if(scene==='accept'&&n===3)s+=label(450,240,'reply → close',14);
  }
  if(scene==='setup'){
   if(n===1)s+=`<path d="M125 160 A28 28 0 1 1 123 199" fill="none" stroke="#80d9b0" stroke-width="3"/>`+label(150,270,'reuse address',14);
   if(n>=2)s+=label(150,275,'127.0.0.1:8888',15);
   if(n===3){for(let i=0;i<3;i++)s+=node(390+i*32,275,7,'#f1c17c','#f1c17c');s+=label(450,310,'queued connections',14);}
  }
  if(scene==='accept'){
   if(n===0){s+=label(450,240,'not accepted yet',14);for(let i=0;i<3;i++)s+=node(105+i*35,265,7,'#f1c17c','#f1c17c');s+=label(150,300,'queued',14);}
   else {s+=label(150,270,'still listening',14);if(n===2)s+=label(450,270,'request bytes ↓',14);}
  }
  if(scene==='interrupted'){s+=label(150,270,n===0?'accept: waiting':n===1?'handler runs':'EINTR',15);if(n===1)s+=packet([450,180],[150,180],t);}
  if(scene==='retry'){const x=n?450:150;s+=`<path d="M ${x-30} 225 Q ${x} 285 ${x+30} 225" fill="none" stroke="#80d9b0" stroke-width="3"/>`+label(x,290,'retry accept',14);}
  if(scene==='lifecycle'){
   const client=[450,325];s+=node(...client,16,'#191820','#8f879c')+label(450,370,'Browser',14);
   if(n===2||n===3){s+=line([450,215],[450,305],'#80d9b0',.6)+packet([450,215],[450,305],t);}
   if(n===3)s+=label(450,330,'✓',17)+label(450,260,'close · exit',14);
   if(n===4)s+=packet([450,180],[150,180],t)+label(150,265,'collect exit result',14);
  }
  if(scene==='code'){
   s+=node(130,295,22)+label(130,343,'Parent',14)+node(470,295,22)+label(470,343,'Child',14);
   s+=line([280,195],[150,278],'#ac98ec',.6)+line([320,195],[450,278],'#ac98ec',.6);
   s+=packet([300,170],n===3?[470,295]:[130,295],t);
  }
  return {svg:s+focus(...spot,0,spot[1]<120?70:-90),key:'A05',legend:'Circles = participants · bright ring = current responsibility · moving dot = handoff or event'};
 }
 const owns=['descriptors','shared','close-copies','missing-close'],recs=['exit-record','zombie','wait','signal','burst','drain','not-ready'];
 function render(scene,n,E,t=1){const model=owns.includes(scene)?ownership:recs.includes(scene)?records:stages;const r=model(scene,n,E,t);return `<div class="course-motion" data-pattern="${r.key}"><svg viewBox="0 0 600 410" role="img" aria-label="${e(scene)} system diagram"><defs><marker id="course-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0 L10 5 L0 10 Z" fill="#ac98ec"/></marker></defs>${r.svg}</svg><div class="motion-key">${e(r.legend)}</div></div>`;}
 return {render};
})();
