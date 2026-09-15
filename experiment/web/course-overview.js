/* A chapter's big picture comes before its details. Maps show the current focus,
   not a claim that every earlier operation has completed in every scenario. */
window.CourseOverview=(()=>{
 const e=window.Animations.esc;
 const maps={
  wait:{title:'A reply is not the end',intro:'Follow one connection from arrival to close. A single worker cannot take the next visitor until it finishes this job.',nodes:['Request','Reply','Still open','Close','Next visitor'],icons:['→','↗','◷','×','→'],edges:[[0,1],[1,2],[2,3],[3,4]]},
  connect:{title:'Open the door, then serve visitors',intro:'The server creates a communication endpoint called a socket. Give it an address and start listening. Accept one visitor’s connection, read the request, and reply; then accept the next visitor.',nodes:['Socket','Bind address','Listen','Accept','Read → reply'],icons:['○','⌖','◖','✓','⇄'],edges:[[0,1],[1,2],[2,3],[3,4],[4,3]],loop:'Repeat for each visitor'},
  fork:{title:'One arrival, two responsibilities',intro:'Fork creates a second running process. The original process (parent) keeps accepting visitors. The new process (child) finishes this request.',nodes:['Accept','Fork','Parent: accept','Child: reply'],icons:['→','⑂','↻','↗'],edges:[[0,1],[1,2],[1,3]],branch:true},
  copies:{title:'Keep only the handles each process needs',intro:'Fork copies access to the same sockets. The parent keeps the listener; the child keeps this connection. The last connection handle must close for the browser to see the end.',nodes:['Fork: copies','Parent: close connection','Child: close listener','Child: reply','Last close → end'],icons:['⑂','×','×','↗','✓'],edges:[[0,1],[0,2],[2,3],[1,4],[3,4]],branch:true},
  children:{title:'Finishing work leaves a result to collect',intro:'A child stops running when it exits. An exit record remains until the parent collects it. A notification lets the parent check without waiting for every child to finish.',nodes:['Child works','Child exits','Record remains','Notify parent','Collect result'],icons:['▶','□','◯','!','✓'],edges:[[0,1],[1,2],[1,3],[2,4],[3,4]]},
  interrupt:{title:'Handle the signal, then resume',intro:'A child can finish while the parent waits for a visitor. Run cleanup, then resume accepting. Older Python needs explicit retry; modern Python normally retries this socket call for you.',nodes:['Wait in accept','Child signal','Cleanup handler','Resume accept'],icons:['◷','!','✓','↻'],edges:[[0,1],[1,2],[2,3],[3,0]],loop:'Return to accepting'},
  burst:{title:'One notice can mean several results',intro:'A notification tells the parent to check, not how many children finished. Collect ready results one at a time, then stop when none are ready.',nodes:['Children exit','One notice','Collect one','Check again','Resume accept'],icons:['□□□','!','✓','↻','→'],edges:[[0,1],[1,2],[2,3],[3,2],[3,4]],loop:'Repeat only while a result is ready'},
  together:{title:'The whole server in one view',intro:'The parent accepts and forks. The parent keeps welcoming visitors; each child replies, closes, and exits. The parent also collects finished children.',nodes:['Accept','Fork','Parent: accept','Child: reply → close','Exit → collect'],icons:['→','⑂','↻','↗','✓'],edges:[[0,1],[1,2],[1,3],[3,4],[4,2]],branch:true}
 };
 function state(chapter,scene,n,progress){
  const states={
   one:progress===0?0:progress<.85?2:3,serial:progress===0?0:progress<.5?2:4,
   network:0,setup:[0,0,1,2][n],endpoints:3,accept:[2,3,4,4][n],
   process:1,descriptors:1,fork:[0,1,2][n],compare:2,explore:2,
   shared:0,'close-copies':[0,1,2,4][n],'missing-close':[0,1,1,4][n],'file-limit':1,
   'exit-record':[0,1,2][n],zombie:n===2?4:2,wait:n===0?0:4,signal:[0,3,4][n],
   interrupted:[0,2,3][n],retry:3,
   burst:[0,1,2][n],drain:[1,2,2,2,4][n],'not-ready':[3,4,2][n],
   lifecycle:[0,1,3,3,4][n],code:[4,1,2,3,4][n]
  };
  let active=states[scene]??maps[chapter].nodes.length-1;
  const warning=scene==='missing-close'&&(n===1||n===2)?'Parent handle still open':scene==='wait'&&n===1?'Blocking here':scene==='interrupted'&&n===2?'Historical: EINTR':null;
  const detail=scene==='drain'&&n>0&&n<4?`${n} of 3 collected`:scene==='setup'&&n===1?'Socket · reuse option':null;
  return {active,warning,detail};
 }
 function render(chapter,scene,n,progress,expanded){
  const map=maps[chapter],s=state(chapter,scene,n,progress);
  // Same spatial arrangement in the opening map and the compact companion.
  const positions=map.branch?(chapter==='copies'?[[100,30],[48,125],[162,125],[162,220],[100,310]]:[[100,30],[100,110],[48,200],[162,200],[162,295]]).slice(0,map.nodes.length):map.nodes.map((_,i)=>[40,30+i*63]);
  let lines=map.edges.map(([a,b])=>{const [x,y]=positions[a],[u,v]=positions[b];
   return b<a?`<path d="M${map.branch?x+18:x-18} ${y} C${map.branch?210:0} ${y},${map.branch?210:0} ${v},${map.branch?u+18:u-18} ${v}" class="map-edge loop"/>`:`<path d="M${x} ${y+16} L${u} ${v-16}" class="map-edge"/>`;
  }).join('');
  const height=map.branch?(chapter==='fork'?280:365):map.nodes.length*63+16;
  const svg=`<svg viewBox="0 0 210 ${height}" role="img" aria-label="${e(map.title)}"><defs><marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10" fill="none" stroke="#777086" stroke-width="2"/></marker></defs>${lines}${map.nodes.map((label,i)=>{let [x,y]=positions[i];const parts=map.branch?label.split(': '):[label];return `<g class="map-node ${!expanded&&s.active===i?'current':''}" ${!expanded&&s.active===i?'aria-current="step"':''}><circle cx="${x}" cy="${y}" r="16"/><text x="${x}" y="${y+5}" class="map-icon">${map.icons[i]}</text>${map.branch?`<rect x="${x-49}" y="${y+20}" width="98" height="${parts.length*13}" fill="#16151c"/>`:''}<text x="${map.branch?x:x+27}" y="${map.branch?y+32:y+5}" class="map-label" text-anchor="${map.branch?'middle':'start'}">${parts.map((part,j)=>`<tspan x="${map.branch?x:x+27}" dy="${j?13:0}">${e(part)}</tspan>`).join('')}</text></g>`;}).join('')}</svg>`;
  const mobile=`<ol class="sequence-mini">${map.nodes.map((label,i)=>`<li ${s.active===i?'aria-current="step"':''}><span aria-hidden="true">${map.icons[i]}</span>${e(label)}</li>`).join('')}</ol>`;
  return `<div class="sequence-heading">${expanded?'THE BIG PICTURE':'YOU ARE HERE'}</div>${expanded?`<h3>${e(map.title)}</h3><p class="sequence-intro">${e(map.intro)}</p>`:''}${svg}${expanded?'':mobile}${map.loop?`<p class="sequence-loop">${e(map.loop)}</p>`:''}${!expanded?`<p class="sequence-current">${e(s.warning||s.detail||map.nodes[s.active])}</p>`:''}<button type="button" id="sequence-toggle">${expanded?'Explore the details →':'See overview'}</button>`;
 }
 return {maps,state,render};
})();
