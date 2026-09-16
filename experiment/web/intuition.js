/* Lesson shell preserved; causal-motion.js owns the rebuilt animation. */
window.IntuitionGuide = (() => {
  const plan=window.IntuitionPlan, esc=window.Animations.esc, educators=!!window.EducatorTeaching;
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
  const comparison=educators||new URLSearchParams(location.search).has('symbols');
  let family=!educators&&new URLSearchParams(location.search).get('symbols')==='lucide'?'lucide':'phosphor';
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
  function comparisonBar(){if(educators)return `<div class="symbol-compare"><span>Guided inquiry · Causal motion</span><a href="?guide=course&teaching=original&symbols=phosphor#lessons">Compare original teaching ↗</a><a href="?teaching=educators#teaching">Explore the teaching library ↗</a></div>`;return comparison?`<div class="symbol-compare" aria-label="Symbol comparison"><span>Same lesson · same motion</span><div role="group" aria-label="Symbol family">${['phosphor','lucide'].map(f=>`<button data-symbol-family="${f}" aria-pressed="${family===f}">${f==='phosphor'?'Phosphor · Regular':'Lucide'}</button>`).join('')}</div><small>Switch at any moment. Compare recognition, balance, and clarity in motion.</small></div>`:'';}
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
  let chapter=0,beat=0,overview=true,playing=false,resize=null,detail=false;
  let progress=0,frame=null,lastTime=null,continuous=false;
  const $=s=>document.querySelector(s), cur=()=>plan[chapter], step=()=>cur().beats[beat];
  function stop(){cancelAnimationFrame(frame);frame=null;lastTime=null;playing=false;continuous=false;if($('#ig-play'))$('#ig-play').textContent='Play';}
  const tokenScale=.36, travelSpeed=180; // SVG units per second, shared by every transfer.
  const travelDuration=(from,to)=>Math.hypot(to[0]-from[0],to[1]-from[1])/travelSpeed*1000;
  function canvas(){return `<div class="ig-canvas causal-canvas"><svg id="ig-svg" role="img" aria-label="Animated server model"></svg><button class="ig-wink" id="ig-wink" aria-label="Wink: explain this moment" aria-expanded="false"><svg viewBox="0 0 100 100" aria-hidden="true"><circle fill="#f5f0ff" cx="50" cy="50" r="46"/><ellipse fill="#4b3869" cx="38" cy="45" rx="6" ry="9"/><path d="M59 43Q67 55 75 43" stroke="#4b3869" stroke-width="4" fill="none"/></svg></button><p class="cm-status" id="cm-status" aria-live="off"></p><label class="cm-scrub">Inspect the motion <input id="cm-progress" aria-label="Animation progress" type="range" min="0" max="1000" value="0"><output id="cm-time">0.0 / 6 s</output></label></div>`;}
  function overviewHTML(){const c=cur();return `<div class="ig-overview"><h3>${esc(c.recall)}</h3><div class="ig-overview-flow">${[
    ...(chapter===0?[['browser','Browser'],['process','Server'],['app','Application']]:chapter===1?[['process','Parent'],['process','Child']]:chapter===2?[['process','Process'],['handle','Access'],['socket','Socket']]:chapter===3?[['process','Child exits'],['record','Status remains'],['process','Parent collects']]:chapter===4?[['notice','Check'],['record','Collect ready'],['process','Resume']]:[['browser','Request'],['process','Delegate'],['handle','Release access'],['record','Collect status']])
  ].map(([k,t],i)=>`${i?'<span aria-hidden="true">→</span>':''}<span>${icon(k)}${t}</span>`).join('')}</div><p>${educators?esc(c.question):chapter===0?'We will rebuild the familiar browser → server → application picture first. Then change one thing at a time.':esc(c.beats[0].cue)}</p><button id="ig-begin" class="primary">${chapter===0?'Start with Parts 1 & 2':'Follow this part'} →</button></div>`;}
  function articleLink(){return `https://ruslanspivak.com/lsbaws-part${cur().article}/#:~:text=${encodeURIComponent(cur().find)}`;}
  function mount(){
    stop();resize?.disconnect();
    $('#app').innerHTML=`<div class="intuition ${comparison?'symbol-experiment':''} ${educators?'educator-teaching':''}">${comparisonBar()}<div class="ig-top"><div><div class="eyebrow">Part 3 · an intuition guide</div><h1>${educators?'Why does a working server get stuck?':'The same server. A bigger story.'}</h1><p>${educators?'Follow the system, test an explanation, then read the code.':'Build on Parts 1 & 2, then read Part 3 with a picture of the whole system.'}</p></div><a href="?guide=detailed#lessons">Earlier detailed experiment ↗</a></div><section class="ig-shell" aria-label="Connected Part 3 guide"><div class="ig-heading"><div><div class="eyebrow">${chapter+1} / ${plan.length} · ${esc(cur().title)}</div><h2 id="ig-title">${esc(overview?'See how this part fits.':step().title)}</h2></div><button id="ig-overview" aria-label="Show the overview" style="font-size:12px">Overview</button></div><div class="ig-layout"><nav class="ig-map" aria-label="Story progress">${plan.map((c,i)=>`<button data-ig-chapter="${i}" ${i===chapter?'aria-current="step"':''}><span class="ig-map-number">0${i+1}</span>${esc(c.map||['Recall the exchange','Share the work','Release access','Collect status','Check and resume','Whole story'][i])}</button>`).join('')}</nav><div>${overview?overviewHTML():canvas()}<div class="ig-speech" ${overview?'hidden':''}><p id="ig-cue" aria-live="polite"></p><button id="ig-more" aria-expanded="false">Wink, explain a little more +</button></div><div id="ig-detail" class="ig-detail" hidden><p>${esc(cur().detail)}</p></div><div id="ig-check" class="ig-check" hidden></div></div></div><div class="ig-controls"><button id="ig-back" ${chapter===0&&beat===0?'disabled':''}>← Back</button><button id="ig-play" ${overview?'disabled':''}>Play</button><button id="ig-replay" ${overview?'disabled':''}>Replay part</button><button class="primary" id="ig-next">${overview?'Begin →':chapter===plan.length-1&&beat===cur().beats.length-1?'Read Part 3 ↗':'Next →'}</button><span class="ig-count" id="ig-count"></span></div><div class="ig-reading"><span>One idea at a time · 6 seconds per stop</span><a href="${articleLink()}" target="_blank" rel="noreferrer">${chapter===0?'Revisit Part 1':'Read this in Part 3'} ↗</a>${chapter===0?'<a href="https://ruslanspivak.com/lsbaws-part2/" target="_blank" rel="noreferrer">Revisit Part 2 ↗</a>':''}</div></section><details class="ig-vocabulary"><summary>The symbols keep their meaning</summary><ul>${[
    ['browser','Browser','A visitor’s client.'],['process','Process','A running program; parent and child use the same frame.'],['app','Application','The response-making code from Part 2.'],['socket','Connected socket','An endpoint for one connection.'],['listener','Listening socket','Accepts new connections.'],['handle','Handle','One process’s access to a socket.'],['record','Exit record','Status kept after a child exits.'],['notice','Notification','A prompt to check; not a result.'],['message','HTTP message','An envelope travelling along the connection.']
  ].map(([k,t,d])=>`<li>${icon(k)}<span><b>${t}</b><br>${d}</span></li>`).join('')}</ul><p>Shapes and labels carry identity; color reinforces it. This is a conceptual guide, not a packet trace.</p></details><details class="ig-choice"><summary>What to study in the article next</summary><p>Socket setup, fork return values, descriptor limits, the exact waitpid loop, and interrupted calls. Keep three questions beside the code: who does the work, who holds socket access, and what remains after a child exits?</p><a href="${educators?'../TEACHING-EXPERIMENT.md':'../CONNECTED-INTUITION.md'}">Research and teaching decisions</a></details></div>`;
    document.querySelectorAll('[data-symbol-family]').forEach(button=>button.onclick=()=>{
      family=button.dataset.symbolFamily;setFamily();
      const url=new URL(location.href);url.searchParams.set('symbols',family);history.replaceState(null,'',url);
      mount();
    });
    const nav=$('.ig-map'),active=nav.querySelector('[aria-current]');if(innerWidth<700)nav.scrollLeft=Math.max(0,active.offsetLeft-nav.offsetLeft-70);
    document.querySelectorAll('[data-ig-chapter]').forEach(b=>b.onclick=()=>{chapter=+b.dataset.igChapter;beat=0;overview=true;detail=false;mount();});
    $('#ig-back').onclick=()=>advance(-1);$('#ig-next').onclick=()=>advance(1);$('#ig-play').onclick=play;$('#ig-replay').onclick=()=>{stop();beat=0;update();};$('#ig-overview').onclick=()=>{overview=true;mount();};
    if(overview)$('#ig-begin').onclick=()=>{overview=false;beat=0;mount();};
    else {$('.ig-canvas').append($('.ig-speech'));$('#cm-progress').oninput=e=>{stop();progress=+e.target.value/1000;draw();};$('#ig-wink').onclick=toggleDetail;$('#ig-more').onclick=toggleDetail;update();resize=new ResizeObserver(()=>draw());resize.observe($('#ig-svg'));requestAnimationFrame(()=>requestAnimationFrame(()=>$('#ig-svg')?.classList.remove('ig-priming')));}
  }
  function toggleDetail(){stop();detail=!detail;$('#ig-detail').hidden=!detail;$('#ig-wink').setAttribute('aria-expanded',String(detail));$('#ig-more').setAttribute('aria-expanded',String(detail));}
  function advance(direction){
    stop();detail=false;
    if(overview){overview=false;beat=direction<0?Math.max(0,cur().beats.length-1):0;mount();return;}
    if(beat+direction>=0&&beat+direction<cur().beats.length){beat+=direction;update();return;}
    if(chapter+direction>=0&&chapter+direction<plan.length){chapter+=direction;beat=direction>0?0:cur().beats.length-1;overview=direction>0;mount();}
    else if(direction>0)window.open('https://ruslanspivak.com/lsbaws-part3/','_blank','noopener');
  }
  function play(){if(playing){stop();return;}if(progress>=1)progress=0;startMotion(true);}
  function startMotion(chain=false){
    cancelAnimationFrame(frame);lastTime=null;continuous=chain;playing=true;$('#ig-play').textContent='Pause';
    const tick=time=>{
      if(!playing)return;
      if(lastTime!==null)progress=Math.min(1,progress+Math.min(time-lastTime,100)/6000);
      lastTime=time;draw();
      if(progress<1){frame=requestAnimationFrame(tick);return;}
      const next=continuous&&beat<cur().beats.length-1;stop();
      if(next){beat++;update();startMotion(true);}
    };
    frame=requestAnimationFrame(tick);
  }
  function update(){
    $('#ig-title').textContent=step().title;$('#ig-cue').textContent=step().cue;$('#ig-count').textContent=`Moment ${beat+1} of ${cur().beats.length}`;$('#ig-next').textContent=chapter===plan.length-1&&beat===cur().beats.length-1?'Read Part 3 ↗':beat===cur().beats.length-1?'Next part →':'Next →';$('#ig-back').disabled=chapter===0&&beat===0;$('#ig-detail').hidden=!detail;$('#ig-wink').setAttribute('aria-expanded',String(detail));$('#ig-more').setAttribute('aria-expanded',String(detail));if(educators){$('#ig-detail p').textContent=step().explain+' '+cur().detail;renderCheck();}stop();progress=matchMedia('(prefers-reduced-motion: reduce)').matches?1:0;draw();if(progress===0)startMotion(false);
  }
  function renderCheck(){
    const box=$('#ig-check'),c=cur(),check=c.check;
    box.hidden=!(check&&check.beat===beat)&&beat!==c.beats.length-1;
    if(box.hidden){box.innerHTML='';return;}
    box.innerHTML=`${beat===c.beats.length-1?`<p class="ig-takeaway"><b>Keep this idea:</b> ${esc(c.takeaway)}</p>`:''}${check&&check.beat===beat?`<p>${esc(check.prompt)}</p><button id="ig-reason" aria-expanded="false" aria-controls="ig-answer">Pause & reveal reasoning</button><p id="ig-answer" role="status" hidden>${esc(check.answer)}</p><small>Optional. Think it through, or keep following the story.</small>`:''}`;
    if($('#ig-reason'))$('#ig-reason').onclick=()=>{stop();const answer=$('#ig-answer'),open=answer.hidden;answer.hidden=!open;$('#ig-reason').setAttribute('aria-expanded',String(open));$('#ig-reason').textContent=open?'Hide reasoning':'Pause & reveal reasoning';};
  }
  function draw(){
    const svg=$('#ig-svg');if(!svg)return;
    const state=window.CausalMotion.render(svg,step().mode,progress,chapter,step().title,step().cue,step().focus);
    $('#cm-status').textContent=state.status;
    $('#cm-progress').value=Math.round(progress*1000);
    $('#cm-time').textContent=`${(progress*6).toFixed(1)} / 6 s`;
  }
  return {mount,stop,model,icon,travelDuration,tokenScale};
})();
