/* One visual vocabulary for the entire article companion. No renderer switching. */
window.IntuitionGuide = (() => {
  const plan=window.IntuitionPlan, esc=window.Animations.esc;
  const colors={browser:'#8bbef8',process:'#b9a1ef',socket:'#6acdcf',handle:'#efb392',record:'#e3dfcf',notice:'#f3d36e',app:'#8ed2a0',message:'#8bbef8'};
  const originalGlyphs={
    browser:'<rect x="-32" y="-24" width="64" height="48" rx="4"/><path d="M-32-12H32M-22-18h2m5 0h2"/>',
    process:'<rect x="-44" y="-38" width="88" height="76" rx="12"/><path d="M-32-25l7 5-7 5m13 0h12"/>',
    socket:'<path d="M-15-26v12m30-12v12M-24-14H24V0a24 24 0 0 1-48 0ZM0 24v12"/>',
    listener:'<path d="M-25 29V-28h50v57M-14 29V-17h28v46M-34 29h68M-5 5h10"/>',
    handle:'<path d="M-25-8a9 9 0 1 0 0 18a9 9 0 1 0 0-18ZM-16 1H23m-9 0v10m9-10v8"/>',
    record:'<path d="M-23-30H9L23-16V30H-23ZM9-30v14h14M-13-4H13M-13 7H13M-13 18h16"/>',
    notice:'<path d="M-23 14h46l-7-10v-15a16 16 0 0 0-32 0V4ZM-6 22q6 9 12 0M0-33v6"/>',
    app:'<path d="M-19-27H19L34 0 19 27H-19L-34 0ZM-8-8l-8 8 8 8M8-8l8 8-8 8"/>',
    message:'<rect x="-18" y="-12" width="36" height="24" rx="2"/><path d="M-18-12L0 1 18-12"/>'
  };
  const comparison=new URLSearchParams(location.search).has('symbols');
  let family=new URLSearchParams(location.search).get('symbols')==='lucide'?'lucide':'phosphor';
  const glyphs={...originalGlyphs};
  function setFamily(){
    if(!comparison)return;
    Object.assign(glyphs,window.SymbolFamilies[family]);
    Object.keys(colors).forEach(k=>colors[k]='#dedfe7');
    colors.listener='#dedfe7';
  }
  setFamily();
  if(comparison){
    // Identical narration for both families: remove references to the old palette.
    for(const c of plan){
      for(const b of c.beats)b.cue=b.cue.replaceAll('purple frame','terminal symbol').replaceAll('cyan socket','socket').replaceAll('green hexagon','code symbol').replaceAll('purple frames','terminal symbols').replaceAll('purple child process','child process').replaceAll('cyan plug','plug').replaceAll('child’s frame','child’s terminal symbol');
    }
  }
  function comparisonBar(){return comparison?`<div class="symbol-compare" aria-label="Symbol comparison"><span>Same lesson · same motion</span><div role="group" aria-label="Symbol family">${['phosphor','lucide'].map(f=>`<button data-symbol-family="${f}" aria-pressed="${family===f}">${f==='phosphor'?'Phosphor · Regular':'Lucide'}</button>`).join('')}</div><small>Switch at any moment. Compare recognition, balance, and clarity in motion.</small></div>`:'';}
  function icon(kind){return `<svg viewBox="-48 -40 96 80" aria-hidden="true"><g color="${colors[kind]||colors.socket}" fill="none" stroke="${colors[kind]||colors.socket}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${glyphs[kind]}</g></svg>`;}
  // Meaning is encoded in kind; IDs preserve identity across the whole sequence.
  function model(mode){
    const m={mode,child:false,app:false,b:false,handles:0,connection:true,recordCount:0,notice:false,reply:false,parentAccess:false,childAccess:false,childExited:false,collect:false,listener:false};
    if(['application','response'].includes(mode))m.app=true;
    if(mode==='response')m.reply=true;
    if(!['request','application','response','simple'].includes(mode)){m.b=true;m.listener=true;}
    if(['fork','roles','twoHandles','oneHandle','replyOpen','closed','wholeWork','wholeClose'].includes(mode))m.child=true;
    if(['twoHandles','fork','wholeWork'].includes(mode)){m.handles=2;m.parentAccess=m.childAccess=true;}
    if(['oneHandle','replyOpen','roles'].includes(mode)){m.handles=1;m.childAccess=true;}
    if(['replyOpen','closed','wholeClose'].includes(mode))m.reply=true;
    if(['closed','exited','records','reapOne','notice','burst','drain','wholeClose','wholeReap','ready'].includes(mode))m.connection=false;
    if(['exited','records','reapOne','notice','burst','drain','wholeReap','ready'].includes(mode)){m.childExited=true;m.child=false;}
    if(['exited','reapOne','notice','wholeReap'].includes(mode))m.recordCount=1;
    if(['records','burst','drain'].includes(mode))m.recordCount=3;
    if(['notice','burst','drain','wholeReap'].includes(mode))m.notice=true;
    if(['reapOne','drain','wholeReap'].includes(mode))m.collect=true;
    return m;
  }
  let chapter=0,beat=0,overview=true,playing=false,timer=null,cleanupTimers=[],resize=null,detail=false;
  const $=s=>document.querySelector(s), cur=()=>plan[chapter], step=()=>cur().beats[beat];
  function stop(){document.querySelector('.ig-canvas')?.getAnimations({subtree:true}).forEach(a=>a.pause());playing=false;clearTimeout(timer);timer=null;cleanupTimers.forEach(clearTimeout);cleanupTimers=[];if($('#ig-play'))$('#ig-play').textContent='Play';}
  const positions=narrow=>narrow?{browser:[60,110],browserB:[60,370],socket:[200,110],listener:[200,370],parent:[345,110],child:[345,280],record:[275,485],record2:[340,485],record3:[405,485],notice:[90,485],app:[345,280],message:[60,110]}:{browser:[65,140],browserB:[65,340],socket:[260,140],listener:[260,340],parent:[460,140],child:[690,140],record:[670,340],record2:[748,340],record3:[826,340],notice:[460,340],app:[690,140],message:[65,140]};
  const tokenScale=.36, travelSpeed=180; // SVG units per second, shared by every transfer.
  const travelDuration=(from,to)=>Math.hypot(to[0]-from[0],to[1]-from[1])/travelSpeed*1000;
  function entity(id,kind,label){return `<g id="ig-${id}" data-kind="${kind}" class="ig-entity" style="opacity:0"><g transform="${['message','record'].includes(kind)?`scale(${tokenScale})`:''}" color="${colors[kind]||colors.socket}" fill="#16171e" stroke="${colors[kind]||colors.socket}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${glyphs[kind]}</g><text y="${kind==='record'?30:58}">${label}</text></g>`;}
  function canvas(){return `<div class="ig-canvas"><svg id="ig-svg" class="ig-priming" role="img" aria-labelledby="ig-svg-title ig-svg-desc"><title id="ig-svg-title"></title><desc id="ig-svg-desc"></desc><g id="ig-links"></g>${entity('browser','browser','Browser A')}${entity('browserB','browser','Browser B')}${entity('socket','socket','A’s socket')}${entity('listener','listener','Listening socket')}${entity('parent','process','Server / parent')}${entity('child','process','Child A')}${entity('app','app','Application')}${entity('record','record','Exit A')}${entity('record2','record','Exit B')}${entity('record3','record','Exit C')}${entity('notice','notice','SIGCHLD')}${entity('message','message','')}<g id="ig-handle-parent" class="ig-entity" data-kind="handle"></g><g id="ig-handle-child" class="ig-entity" data-kind="handle"></g><text id="ig-result" class="ig-small"></text><rect id="ig-focus" class="ig-focus-outline" width="104" height="122" rx="16"/></svg><button class="ig-wink" id="ig-wink" aria-label="Wink: explain this moment" aria-expanded="false"><svg viewBox="0 0 100 100" aria-hidden="true"><circle fill="#f5f0ff" cx="50" cy="50" r="46"/><ellipse fill="#4b3869" cx="38" cy="45" rx="6" ry="9"/><path d="M59 43Q67 55 75 43" stroke="#4b3869" stroke-width="4" fill="none"/><path fill="#b491f5" d="M76 10Q77 15 82 17Q77 19 76 24Q75 19 70 17Q75 15 76 10Z"/></svg></button></div>`;}
  function overviewHTML(){const c=cur();return `<div class="ig-overview"><h3>${esc(c.recall)}</h3><div class="ig-overview-flow">${[
    ...(chapter===0?[['browser','Browser'],['process','Server'],['app','Application']]:chapter===1?[['process','Parent'],['process','Child']]:chapter===2?[['process','Process'],['handle','Access'],['socket','Socket']]:chapter===3?[['process','Child exits'],['record','Status remains'],['process','Parent collects']]:chapter===4?[['notice','Check'],['record','Collect ready'],['process','Resume']]:[['browser','Request'],['process','Delegate'],['handle','Release access'],['record','Collect status']])
  ].map(([k,t],i)=>`${i?'<span aria-hidden="true">→</span>':''}<span>${icon(k)}${t}</span>`).join('')}</div><p>${chapter===0?'We will rebuild the familiar browser → server → application picture first. Then change one thing at a time.':esc(c.beats[0].cue)}</p><button id="ig-begin" class="primary">${chapter===0?'Start with Parts 1 & 2':'Follow this part'} →</button></div>`;}
  function articleLink(){return `https://ruslanspivak.com/lsbaws-part${cur().article}/#:~:text=${encodeURIComponent(cur().find)}`;}
  function mount(){
    stop();resize?.disconnect();
    $('#app').innerHTML=`<div class="intuition ${comparison?'symbol-experiment':''}">${comparisonBar()}<div class="ig-top"><div><div class="eyebrow">Part 3 · an intuition guide</div><h1>The same server. A bigger story.</h1><p>Build on Parts 1 & 2, then read Part 3 with a picture of the whole system.</p></div><a href="?guide=detailed#lessons">Earlier detailed experiment ↗</a></div><section class="ig-shell" aria-label="Connected Part 3 guide"><div class="ig-heading"><div><div class="eyebrow">${chapter+1} / ${plan.length} · ${esc(cur().title)}</div><h2 id="ig-title">${esc(overview?'See how this part fits.':step().title)}</h2></div><button id="ig-overview" aria-label="Show the overview" style="font-size:12px">Overview</button></div><div class="ig-layout"><nav class="ig-map" aria-label="Story progress">${plan.map((c,i)=>`<button data-ig-chapter="${i}" ${i===chapter?'aria-current="step"':''}><span class="ig-map-number">0${i+1}</span>${esc(['Recall the exchange','Share the work','Release access','Collect status','Check and resume','Whole story'][i])}</button>`).join('')}</nav><div>${overview?overviewHTML():canvas()}<div class="ig-speech" ${overview?'hidden':''}><p id="ig-cue" aria-live="polite"></p><button id="ig-more" aria-expanded="false">Wink, explain a little more +</button></div><div id="ig-detail" class="ig-detail" hidden><p>${esc(cur().detail)}</p></div></div></div><div class="ig-controls"><button id="ig-back" ${chapter===0&&beat===0?'disabled':''}>← Back</button><button id="ig-play" ${overview?'disabled':''}>Play</button><button id="ig-replay" ${overview?'disabled':''}>Replay part</button><button class="primary" id="ig-next">${overview?'Begin →':chapter===plan.length-1&&beat===cur().beats.length-1?'Read Part 3 ↗':'Next →'}</button><span class="ig-count" id="ig-count"></span></div><div class="ig-reading"><span>One idea at a time · 6 seconds per stop</span><a href="${articleLink()}" target="_blank" rel="noreferrer">${chapter===0?'Revisit Part 1':'Read this in Part 3'} ↗</a>${chapter===0?'<a href="https://ruslanspivak.com/lsbaws-part2/" target="_blank" rel="noreferrer">Revisit Part 2 ↗</a>':''}</div></section><details class="ig-vocabulary"><summary>The symbols keep their meaning</summary><ul>${[
    ['browser','Browser','A visitor’s client.'],['process','Process','A running program; parent and child use the same frame.'],['app','Application','The response-making code from Part 2.'],['socket','Connected socket','An endpoint for one connection.'],['listener','Listening socket','Accepts new connections.'],['handle','Handle','One process’s access to a socket.'],['record','Exit record','Status kept after a child exits.'],['notice','Notification','A prompt to check; not a result.'],['message','HTTP message','An envelope travelling along the connection.']
  ].map(([k,t,d])=>`<li>${icon(k)}<span><b>${t}</b><br>${d}</span></li>`).join('')}</ul><p>Shapes and labels carry identity; color reinforces it. This is a conceptual guide, not a packet trace.</p></details><details class="ig-choice"><summary>What to study in the article next</summary><p>Socket setup, fork return values, descriptor limits, the exact waitpid loop, and interrupted calls. Keep three questions beside the code: who does the work, who holds socket access, and what remains after a child exits?</p><a href="../CONNECTED-INTUITION.md">Research and teaching decisions</a></details></div>`;
    document.querySelectorAll('[data-symbol-family]').forEach(button=>button.onclick=()=>{
      family=button.dataset.symbolFamily;setFamily();
      const url=new URL(location.href);url.searchParams.set('symbols',family);history.replaceState(null,'',url);
      mount();
    });
    const nav=$('.ig-map'),active=nav.querySelector('[aria-current]');if(innerWidth<700)nav.scrollLeft=Math.max(0,active.offsetLeft-nav.offsetLeft-70);
    document.querySelectorAll('[data-ig-chapter]').forEach(b=>b.onclick=()=>{chapter=+b.dataset.igChapter;beat=0;overview=true;detail=false;mount();});
    $('#ig-back').onclick=()=>advance(-1);$('#ig-next').onclick=()=>advance(1);$('#ig-play').onclick=play;$('#ig-replay').onclick=()=>{stop();beat=0;update();};$('#ig-overview').onclick=()=>{overview=true;mount();};
    if(overview)$('#ig-begin').onclick=()=>{overview=false;beat=0;mount();};
    else {$('.ig-canvas').append($('.ig-speech'));$('#ig-wink').onclick=toggleDetail;$('#ig-more').onclick=toggleDetail;update();resize=new ResizeObserver(()=>draw());resize.observe($('#ig-svg'));requestAnimationFrame(()=>requestAnimationFrame(()=>$('#ig-svg')?.classList.remove('ig-priming')));}
  }
  function toggleDetail(){stop();detail=!detail;$('#ig-detail').hidden=!detail;$('#ig-wink').setAttribute('aria-expanded',String(detail));$('#ig-more').setAttribute('aria-expanded',String(detail));}
  function advance(direction){
    stop();detail=false;
    if(overview){overview=false;beat=direction<0?Math.max(0,cur().beats.length-1):0;mount();return;}
    if(beat+direction>=0&&beat+direction<cur().beats.length){beat+=direction;update();return;}
    if(chapter+direction>=0&&chapter+direction<plan.length){chapter+=direction;beat=direction>0?0:cur().beats.length-1;overview=direction>0;mount();}
    else if(direction>0)window.open('https://ruslanspivak.com/lsbaws-part3/','_blank','noopener');
  }
  function play(){if(playing){stop();return;}if(beat===cur().beats.length-1){beat=0;update();}document.querySelector('.ig-canvas')?.getAnimations({subtree:true}).forEach(a=>a.play());playing=true;$('#ig-play').textContent='Pause';schedule();}
  function schedule(){timer=setTimeout(()=>{if(!playing)return;if(beat===cur().beats.length-1){stop();return;}beat++;update();schedule();},6000);}
  function update(){
    cleanupTimers.forEach(clearTimeout);cleanupTimers=[];
    $('#ig-title').textContent=step().title;$('#ig-cue').textContent=step().cue;$('#ig-count').textContent=`Moment ${beat+1} of ${cur().beats.length}`;$('#ig-next').textContent=chapter===plan.length-1&&beat===cur().beats.length-1?'Read Part 3 ↗':beat===cur().beats.length-1?'Next part →':'Next →';$('#ig-back').disabled=chapter===0&&beat===0;$('#ig-detail').hidden=!detail;draw();animateMessage();
  }
  function animateMessage(){
    const mode=step().mode;if(!['request','response','replyOpen','wholeClose'].includes(mode))return;
    const svg=$('#ig-svg'),narrow=svg.clientWidth<500,p=positions(narrow),reverse=mode!=='request';
    const lane=p.browser[1]-70;
    const from=[reverse?p.parent[0]:p.browser[0],lane],to=[reverse?p.browser[0]:p.parent[0],lane];
    const el=$('#ig-message');el.style.transform=`translate(${to[0]}px,${to[1]}px)`;
    el.animate([{transform:`translate(${from[0]}px,${from[1]}px)`},{transform:`translate(${to[0]}px,${to[1]}px)`}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:travelDuration(from,to),easing:'linear'});
  }
  function draw(){
    const svg=$('#ig-svg');if(!svg)return;
    const narrow=svg.clientWidth<500, w=narrow?440:900,h=narrow?570:485,pos=positions(narrow),m=model(step().mode);
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);$('#ig-svg-title').textContent=step().title;$('#ig-svg-desc').textContent=step().cue;
    const show={browser:true,browserB:m.b,socket:true,listener:m.listener,parent:true,child:m.child,app:m.app,record:m.recordCount>0,record2:m.recordCount>1,record3:m.recordCount>2,notice:m.notice,message:['request','response','application','replyOpen','wholeClose'].includes(m.mode)};
    pos.message=[m.mode==='request'||m.mode==='application'?pos.parent[0]:pos.browser[0],pos.browser[1]-70];
    $('#ig-message').getAnimations().forEach(a=>a.cancel());
    for(const [id,p] of Object.entries(pos)){const el=$('#ig-'+id);if(id.startsWith('record'))el.getAnimations().forEach(a=>a.cancel());el.style.transform=`translate(${p[0]}px,${p[1]}px)`;el.style.opacity=show[id]?1:0;el.setAttribute('aria-hidden',String(!show[id]));}
    $('#ig-socket').style.opacity=m.connection?1:.38;
    $('#ig-parent text').textContent=m.child||m.childExited?'Parent':'Server process';
    const line=(a,b,color,opacity=1,dash='')=>`<path class="ig-edge" d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" fill="none" stroke="${color}" stroke-width="2" opacity="${opacity}" ${dash?'stroke-dasharray="'+dash+'"':''}/>`;
    let links=line([pos.browser[0]+32,pos.browser[1]],[pos.socket[0]-25,pos.socket[1]],colors.socket,m.connection?1:.15);
    if(m.listener)links+=line([pos.browserB[0]+32,pos.browserB[1]],[pos.listener[0]-25,pos.listener[1]],colors.socket,.6)+line([pos.listener[0]+25,pos.listener[1]],[pos.parent[0]-25,pos.parent[1]+38],colors.socket,.55);
    if(m.app)links+=line([pos.parent[0]+36,pos.parent[1]],[pos.app[0]-(narrow?0:36),pos.app[1]-(narrow?36:0)],colors.app,.65);
    if(m.mode==='busy')links+=`<text x="${pos.browserB[0]}" y="${pos.browserB[1]+82}" class="ig-small">waiting</text>`;
    if(m.child)links+=line([pos.parent[0]+44,pos.parent[1]],[pos.child[0]-44,pos.child[1]],colors.process,.5,'5 6');
    if(m.connection&&!m.child&&!m.childExited)links+=line([pos.socket[0]+25,pos.socket[1]],[pos.parent[0]-44,pos.parent[1]],colors.socket,.6);
    if(m.notice)links+=line([pos.notice[0],pos.notice[1]-30],[pos.parent[0],pos.parent[1]+60],colors.notice,.55,'3 6');
    const accessPoints=[];
    const handles=[['parent',m.parentAccess],['child',m.childAccess]];
    handles.forEach(([owner,visible])=>{
      const start=comparison?[pos[owner][0]-40,pos[owner][1]]:[pos[owner][0]-20,pos[owner][1]+35],end=comparison?[pos.socket[0]+36,pos.socket[1]+5]:[pos.socket[0]+10,pos.socket[1]+25],p=comparison?(narrow?(owner==='child'?[pos[owner][0],pos[owner][1]+110]:[pos[owner][0]-65,pos[owner][1]+85]):[pos[owner][0]-70,pos[owner][1]+115]):[start[0]*.65+end[0]*.35,start[1]*.65+end[1]*.35+35];
      const el=$('#ig-handle-'+owner);el.style.transform=`translate(${p[0]}px,${p[1]}px)`;el.style.opacity=visible?1:0;el.innerHTML=`<g color="${colors.handle}" fill="#16171e" stroke="${colors.handle}" stroke-width="2.5">${glyphs.handle}</g>`;
      if(visible){accessPoints.push(p);links+=line(start,p,colors.handle)+line(p,end,colors.handle);}
    });
    $('#ig-links').innerHTML=links;
    const r=$('#ig-result');r.setAttribute('x',pos.socket[0]);r.setAttribute('y',pos.socket[1]+82);r.textContent=m.connection?(m.handles?`${m.handles} open handle${m.handles===1?'':'s'}`:''):'connection ended';
    let fp=pos[step().focus]||pos.parent;
    const focus=$('#ig-focus');focus.setAttribute('x',fp[0]-52);focus.setAttribute('y',fp[1]-44);
    const scale=svg.clientWidth/w;
    $('#ig-wink').style.left=`${Math.max(20,(fp[0]-65)*scale)}px`;$('#ig-wink').style.top=`${(fp[1]-(narrow&&fp[1]>400?0:65))*scale}px`;
    const speech=$('.ig-speech');speech.classList.toggle('ig-local-speech',!narrow);
    if(!narrow){
      const sw=Math.min(260,svg.clientWidth*.4);speech.style.width=sw+'px';const sh=speech.offsetHeight||110;
      const obstacles=Object.entries(pos).filter(([id])=>show[id]).map(([,p])=>({x:(p[0]-57)*scale,y:(p[1]-48)*scale,w:114*scale,h:123*scale}));
      accessPoints.forEach(p=>obstacles.push({x:(p[0]-30)*scale,y:(p[1]-(comparison?36:15))*scale,w:72*scale,h:(comparison?72:30)*scale}));
      if(r.textContent)obstacles.push({x:(pos.socket[0]-65)*scale,y:(pos.socket[1]+67)*scale,w:130*scale,h:23*scale});
      // Keep speech off the network/access paths as well as off the actors.
      $('#ig-links').querySelectorAll('path').forEach(path=>{const v=path.getAttribute('d').match(/-?[\d.]+/g).map(Number);for(let t=0;t<=1;t+=.08)obstacles.push({x:(v[0]+(v[2]-v[0])*t)*scale-4,y:(v[1]+(v[3]-v[1])*t)*scale-4,w:8,h:8});});
      obstacles.push({x:parseFloat($('#ig-wink').style.left)-22,y:parseFloat($('#ig-wink').style.top)-22,w:44,h:44});
      let best=null;
      for(let y=8;y<=svg.clientHeight-sh-8;y+=12)for(let x=8;x<=svg.clientWidth-sw-8;x+=12){
        if(obstacles.some(o=>x<o.x+o.w&&x+sw>o.x&&y<o.y+o.h&&y+sh>o.y))continue;
        const dist=Math.hypot(x+sw/2-fp[0]*scale,y+sh/2-fp[1]*scale);
        if(!best||dist<best.dist)best={x,y,dist};
      }
      if(best){speech.style.width=sw+'px';speech.style.left=best.x+'px';speech.style.top=best.y+'px';}
      else{speech.classList.remove('ig-local-speech');speech.style.width='';speech.style.left='';speech.style.top='';}
    }else{speech.style.width='';speech.style.left='';speech.style.top='';}

    // Collection is deliberately separate from exit: records survive until this action.
    cleanupTimers.forEach(clearTimeout);cleanupTimers=[];
    if(m.collect){
      const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
      for(let i=0;i<m.recordCount;i++){const id=['record','record2','record3'][i],el=$('#ig-'+id);el.getAnimations().forEach(a=>a.cancel());el.animate([{transform:`translate(${pos[id][0]}px,${pos[id][1]}px)`,opacity:1},{transform:`translate(${pos.parent[0]}px,${pos.parent[1]+105}px)`,opacity:0}],{duration:reduce?0:travelDuration(pos[id],[pos.parent[0],pos.parent[1]+105]),delay:reduce?0:900+i*700,fill:'forwards',easing:'linear'});}
    }
  }
  return {mount,stop,model,icon,travelDuration,tokenScale};
})();
