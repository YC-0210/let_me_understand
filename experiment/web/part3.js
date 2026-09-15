/* Full course: teaching plan first, selected animation capabilities second. */
window.Part3 = (() => {
  const data=window.LIBRARY_DATA, A=window.Animations, M=window.Part3Models;
  const p=data.lessons.find(x=>x.id==='server'), e=A.esc;
  let index=0,progress=0,playing=false,choice=null,checked=false,arrival=.12,frame=0,previous=0,lastDraw=-1,done=false,winkOpen=false,guideClock=0,guideResize,motionBlend=1;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{const n=Number(localStorage.getItem('part3-full-step'));if(Number.isInteger(n)&&n>=0&&n<p.steps.length)index=n;}catch{}
  const $=s=>document.querySelector(s),current=()=>p.steps[index];
  const timeline=()=>['one','serial','compare','explore'].includes(current().scene);
  const chapter=()=>p.chapters.find(c=>c.id===current().chapter);
  const chapterSteps=()=>p.steps.filter(s=>s.chapter===current().chapter);
  function stop(){playing=false;cancelAnimationFrame(frame);$('#wink-toggle')?.getAnimations().forEach(a=>a.pause());}
  function selected(cap,inputs){const s=p.animation_selections.find(x=>x.step===current().id&&x.reason===`Required capability: ${cap}`);if(!s)throw Error(`Missing selection for ${current().id}/${cap}`);return A[s.renderer](inputs);}
  function mount(){
    stop();guideResize?.disconnect();lastDraw=-1;
    const s=current(),ch=chapter(),local=chapterSteps(),chapterIndex=p.chapters.indexOf(ch);
    $('#app').innerHTML=`<div class="course-intro"><div class="eyebrow">LET’S BUILD A WEB SERVER / PART 3</div><h1>Build a server that<br>keeps working.</h1><p class="intro">First make room for another visitor. Then make sure every request leaves the server ready for the next one. A guided lesson from the first connection to serving many visitors without getting stuck.</p><p class="course-footnote">8 short chapters · no prior article reading needed · progress saved on this browser</p></div><div class="lesson-chooser course-chooser"><button class="selected" data-lesson="server"><small>01 / COMPLETE PART 3</small>Help more than one visitor</button><button data-lesson="search"><small>02 / SORTED SEARCH</small>Can one check rule out eight?</button></div><details class="course-map"><summary>Chapter ${chapterIndex+1} of 8 · ${e(ch.title)} <span class="muted">— browse the journey</span></summary><div class="chapter-list">${p.chapters.map((c,i)=>`<button data-chapter="${c.id}" class="${c.id===ch.id?'selected':''}"><small>CHAPTER ${i+1}</small>${e(c.title)}</button>`).join('')}</div></details>${done?`<div class="course-done" role="status"><h3>You reached the complete server.</h3><p>Try explaining why a reply can arrive while a socket is still open, and why one signal can require several cleanup calls. Those two distinctions are the heart of the later chapters.</p><button id="course-restart">Start again</button> <a href="../complete_server.py" download>Download the Python example</a></div>`:''}<section class="lesson-shell" aria-label="Part 3 guided lesson"><div class="chapter-intro"><div class="eyebrow">${String(chapterIndex+1).padStart(2,'0')} / ${e(ch.title)}</div><p>${e(ch.promise)}</p></div><div class="progress">${local.map((x,i)=>`<button data-course-step="${p.steps.indexOf(x)}" class="${p.steps.indexOf(x)<=index?'past':''}" aria-label="Chapter step ${i+1}: ${e(x.title)}"></button>`).join('')}</div><div class="lesson-content"><div class="step-counter">STEP ${local.indexOf(s)+1} OF ${local.length} · ${index+1} / ${p.steps.length} OVERALL</div><h2>${e(s.title)}</h2>${wink(s)}${s.scene==='prediction'?question(s):`${s.scene==='explore'?`<label class="parameter">B arrives <select id="course-arrival"><option value="0.12" ${arrival===.12?'selected':''}>0.12 seconds after A</option><option value="0.36" ${arrival===.36?'selected':''}>0.36 seconds after A</option><option value="0.8" ${arrival===.8?'selected':''}>0.80 seconds after A</option></select></label>`:''}<div class="board" id="course-board"></div><div class="playback"><button class="primary" id="course-play">Play these moments</button><button id="course-moment" aria-label="Advance one visual moment">Step +</button><button id="course-reset" aria-label="Restart this visual">↺</button><input id="course-scrub" type="range" min="0" max="1000" value="${progress*1000}" aria-label="Visual progress"><span id="course-status" class="micro"></span></div>`}</div><div class="lesson-bottom"><span class="micro">${e(index===0?'Start with a request and its reply.':ch.recall)}</span><button id="course-back" ${index===0?'disabled':''}>Back</button><button class="primary" id="course-next">${index===p.steps.length-1?'Finish course':p.steps[index+1].chapter!==s.chapter?'Next chapter →':'Next step →'}</button></div></section><details><summary>Why this teaching and animation choice?</summary><p><b>Teaching:</b> ${e(s.teaching_card)} — ${e(data.teaching.find(c=>c.id===s.teaching_card).title)}</p><p><b>Already established:</b> ${s.requires.map(e).join(', ')}</p><p><b>Introduces:</b> ${s.introduces.map(e).join(', ')||'Apply the ideas you already met.'}</p>${p.animation_selections.filter(x=>x.step===s.id).map(x=>`<p>${e(x.card)} · ${e(x.reason)}</p>`).join('')}${s.scene==='prediction'?'<p>A question checks understanding here; extra motion would not help.</p>':''}</details><details><summary>Article, technical references & coverage</summary><p>The course follows the problems in <a href="https://ruslanspivak.com/lsbaws-part3/" target="_blank" rel="noreferrer">Ruslan Spivak’s Part 3</a>, with authored scenes checked against the <a href="https://docs.python.org/3/library/socket.html" target="_blank" rel="noreferrer">Python socket interface</a>, <a href="https://man7.org/linux/man-pages/man2/fork.2.html" target="_blank" rel="noreferrer">fork</a>, <a href="https://man7.org/linux/man-pages/man2/waitpid.2.html" target="_blank" rel="noreferrer">waitpid</a>, <a href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noreferrer">standard signal semantics</a>, and <a href="https://peps.python.org/pep-0475/" target="_blank" rel="noreferrer">modern Python retries</a>.</p><p>Recorded experiments and explanatory reconstructions are labeled beside the visual. Tiny diagrams omit low-level networking states; they do not claim to be packet-level simulations.</p><a href="../PART3-COVERAGE.md" target="_blank">Read the full coverage map</a> · <a href="../runs/part3-evidence.json" target="_blank">Inspect the recorded probes</a></details>`;
    bind();if(s.scene!=='prediction'){
      $('.lesson-content').classList.add('spatial-course');
      draw();guideResize=new ResizeObserver(()=>placeWink());guideResize.observe($('#course-board'));
    }
  }
  function wink(s){
    const text=checked?s.question.feedback[choice]:s.wink_cue;
    return `<div class="wink-guide"><div class="wink-row"><button id="wink-toggle" aria-label="${winkOpen?'Close':'Open'} Wink’s explanation" aria-expanded="${winkOpen}" aria-controls="wink-detail"><svg viewBox="0 0 100 100" aria-hidden="true"><circle fill="#F5F0FF" cx="50" cy="50" r="46"/><ellipse fill="#4B3869" cx="38" cy="45" rx="6" ry="9.2" transform="rotate(-10 38 45)"/><path d="M59.2 42.6 Q67 54.6 74.8 42.6" stroke="#4B3869" stroke-width="3.2" fill="none" stroke-linecap="round"/><path fill="#B491F5" d="M76 10 Q77 15 82 17 Q77 19 76 24 Q75 19 70 17 Q75 15 76 10Z"/></svg></button><div class="wink-speech"><p id="wink-cue" ${checked?'class="feedback" role="status"':''}>${e(text)}</p><button id="wink-more" aria-expanded="${winkOpen}" aria-controls="wink-detail">${winkOpen?'Less detail':'Wink, tell me more'} <span aria-hidden="true">${winkOpen?'−':'+'}</span></button></div></div><div id="wink-detail" ${winkOpen?'':'hidden'}><p>${e(s.explanation)}</p><details><summary>What to notice now</summary><p id="wink-current">${e(s.wink_cue)}</p></details><details id="wink-history-wrap" hidden><summary>Steps so far</summary><div id="wink-history"></div></details>${s.code?`<details><summary>Show the code</summary><pre>${e(s.code)}</pre></details>`:''}<details><summary>How this example was checked</summary><p>${e(s.evidence||'Actual local TCP recordings. The original 60-second pause is shortened to 0.6 seconds; playback is slowed for readability. Client receipt times approximate handling intervals.')}</p></details></div></div>`;
  }
  function updateWink(){
    const board=$('#course-board'),cue=$('#wink-cue');if(!board||!cue)return;
    const observation=board.querySelector('.observation');
    if(observation){const text=observation.textContent;$('#wink-current').textContent=text;if(progress>0&&cue.textContent!==text)cue.textContent=text;else if(progress===0)cue.textContent=current().frames?.[0]?.caption||current().wink_cue;observation.remove();}
    const history=board.querySelector('.event-history');
    if(history){$('#wink-history-wrap').hidden=false;$('#wink-history').innerHTML=history.outerHTML;history.remove();}
    board.querySelectorAll('.ledger-result').forEach(x=>x.remove());
    focusWink();
  }
  function toggleWink(){
    winkOpen=!winkOpen;
    if(winkOpen){stop();if($('#course-board'))draw();}
    $('#wink-detail').hidden=!winkOpen;
    for(const id of ['#wink-toggle','#wink-more'])$(id).setAttribute('aria-expanded',String(winkOpen));
    $('#wink-toggle').setAttribute('aria-label',`${winkOpen?'Close':'Open'} Wink’s explanation`);
    $('#wink-more').innerHTML=winkOpen?'Less detail <span aria-hidden="true">−</span>':'Wink, tell me more <span aria-hidden="true">+</span>';
    placeWink();
  }
  function question(s){const q=s.question;return `<div class="choices">${q.options.map((o,i)=>`<button data-course-choice="${i}" class="${choice===i?'chosen':''}" aria-pressed="${choice===i}">${e(o)}</button>`).join('')}</div><button class="primary" id="course-check" ${choice===null?'disabled':''}>Check my prediction</button>`;}
  function go(n){stop();index=n;winkOpen=false;guideClock=0;motionBlend=1;progress=0;choice=null;checked=false;arrival=.12;done=false;try{localStorage.setItem('part3-full-step',String(index));}catch{}mount();$('.lesson-shell').scrollIntoView({block:'start',behavior:'instant'});}
  function timelineHTML(){
    const s=current(),one=s.scene==='one',both=['compare','explore'].includes(s.scene),duration=one?.7:1.5,t=progress*duration;
    const run=mode=>data.server_traces.find(x=>x.arrival===arrival&&x.mode===mode),serial=run('serial'),fork=run('fork');
    const chart=(r,title)=>`<div><div class="board-top"><b>${title}</b><span>${t.toFixed(2)} s</span></div>${selected(one?'preserve-history':'show-overlap',{events:r.events,time:t,duration,lanes:one?['A']:['A','B']})}</div>`;
    let html=`<div class="${both?'comparison':''}">${chart(serial,both?'One process':'One program')}${both?chart(fork,'A child for each request'):''}</div><div class="legend"><span>● Request arrives</span><span><i style="background:var(--amber)"></i>Waiting for answer</span><span><i style="background:var(--purple)"></i>Answer sent, connection open</span><span><i style="background:var(--green)"></i>Answer received</span><span>× Connection closes</span></div>`;
    const ev=(r,who,kind)=>r.events.find(x=>x.who===who&&x.kind===kind).time;
    let caption='Press play or Step + to follow the request, answer, and connection close.';
    if(progress>0){if(one)caption=t<ev(serial,'A','close')?'A has its answer, but the program is still occupied until this connection closes.':'A’s connection closed. The one program can take another request.';else if(t<ev(serial,'B','request'))caption='A is being handled. B has not arrived yet.';else if(t<ev(serial,'B','answer'))caption=both?'B waits in the original version. In the child version, A’s ongoing work does not keep the parent from assigning B a worker.':'B is waiting. The original program must finish with A before answering B.';else caption=arrival>.6?'B arrived after A finished. There is no long queue wait in either version here.':both?'B was answered earlier in the child version because A and B could overlap.':'The original program answered B only after A’s connection closed.';}
    if(both&&progress===1){const wait=r=>Math.round((ev(r,'B','answer')-ev(r,'B','request'))*10000)/10;html+=`<h3 style="margin-top:24px">B’s wait for an answer</h3>${selected('compare-amounts',{labels:['One process','A child for each request'],values:[wait(serial),wait(fork)],maximum:650,unit:'ms'})}`;}
    return html+`<div class="observation">${caption}</div>`;
  }
  function frameHTML(n){
    const s=current(),E=data.part3_evidence;let html='';
    if(s.scene==='file-limit'){
      const f=E.fd_limit,opened=n===0?Math.min(5,f.opened_before_error):f.opened_before_error;
      html=`<div class="board-top"><b>Isolated subprocess limit: ${f.limit} handles</b></div>${selected('compare-amounts',{labels:['Opened in this demonstration','Released by cleanup'],values:[opened,n===2?opened:0],unit:'handles',maximum:f.limit})}<div class="ledger-result">${n===1?`${e(f.error)} (${f.errno}): kernel refuses another open.`:n===2?'Opening a new resource succeeds after cleanup.':'The process already has standard input, output, and error open.'}</div>`;
    }else html=window.CourseMotion.render(s.scene,n,E,motionBlend);
    html=`<div class="moment-nav"><span>VISUAL MOMENT ${n+1} / ${s.frames.length}</span><span>${n===0?'Starting situation':n===s.frames.length-1?'Result':'Follow the change'}</span></div>`+html+`<div class="observation">${e(s.frames[n].caption)}</div>`;
    if(s.scene==='code'){
      const code=data.server_code.split('\n');const ranges=[[43,43],[52,58],[67,68],[58,66],[12,22]][n];
      html+=`<p class="code-purpose">Highlighted: ${e(M.stage('code',n,E).actors[0].title)}</p><pre class="course-code" tabindex="0" aria-label="Complete Python server"><code>${code.map((line,i)=>`<span class="code-line ${i+1>=ranges[0]&&i+1<=ranges[1]?'lit':''}"><span class="line-number">${i+1}</span>${e(line)}</span>`).join('')}</code></pre><a class="practice-link" href="../complete_server.py" download>Download the complete Python example ↗</a><details><summary>Try the complete server yourself</summary><p>Download the file, then run it from the folder where it was saved:</p><pre>python3 complete_server.py --port 8888 --delay 0.6</pre><p>In two other terminals, run this command in quick succession:</p><pre>curl http://127.0.0.1:8888/</pre><p>Both should receive the text promptly. Each connection then finishes after its short deliberate pause. The server handles requests in children and collects their exit records.</p></details>`;
    }
    return html;
  }
  let lastBlend=1;
  function draw(){
    if(!$('#course-board'))return;
    const s=current(),n=timeline()?null:Math.min(s.frames.length-1,Math.floor(progress*(s.frames.length-1)+1e-7));
    if(timeline()||n!==lastDraw||motionBlend<1||lastBlend<1){restoreWink();$('#course-board').innerHTML=timeline()?timelineHTML():frameHTML(n);lastDraw=n;if(s.scene==='code'){const panel=$('.course-code'),lit=panel.querySelector('.lit');if(lit)panel.scrollTop=Math.max(0,lit.offsetTop-panel.offsetTop-35);}}
    lastBlend=motionBlend;updateWink();
    $('#course-scrub').value=Math.round(progress*1000);$('#course-status').textContent=playing?`Next moment in ${Math.ceil(guideRemaining())}s`:guideClock>=6+(momentCount()-1)*7?'Complete':progress===0?'Ready · 6s per moment':'Paused';
    $('#course-play').textContent=playing?'Pause':progress===1?'Replay':progress?'Continue':'Play these moments';
    $('#course-moment').disabled=progress===1;
  }
  const momentCount=()=>timeline()?7:current().frames.length;
  const clockFor=n=>n===0?0:7*n;
  function guideRemaining(){return guideClock<6?6-guideClock:7-((guideClock-6)%7);}
  function syncClock(){guideClock=clockFor(Math.round(progress*(momentCount()-1)));}
  function advance(){stop();motionBlend=1;const parts=momentCount()-1;progress=Math.min(1,Math.round(progress*parts+1)/parts);syncClock();draw();}
  function play(){
    if(playing){stop();draw();return;}
    if(progress===1){progress=0;guideClock=0;lastDraw=-1;}
    $('#wink-toggle').getAnimations().forEach(a=>a.play());
    playing=true;previous=performance.now();draw();frame=requestAnimationFrame(tick);
  }
  function tick(now){
    if(!document.hidden)guideClock+=(now-previous)/1000;
    previous=now;
    const state=tourState(guideClock,momentCount(),timeline()&&!reduced);
    progress=state.progress;motionBlend=timeline()||reduced||guideClock<6?1:Math.min(1,(guideClock-6)%7);if(state.done){motionBlend=1;}if(state.done)playing=false;
    draw();if(playing)frame=requestAnimationFrame(tick);
  }
  function tourState(clock,count,interpolate=false){
    const end=6+(count-1)*7;
    if(clock>=end)return {progress:1,done:true};
    const n=clock<6?0:Math.min(count-1,Math.floor((clock-6)/7)+1);
    const travel=clock<6?1:Math.min(1,(clock-6)%7);
    return {progress:interpolate&&n>0?(n-1+travel)/(count-1):n/(count-1),done:false};
  }
  // Each selector names the object that this moment's explanation discusses.
  const targets={
    network:['.actor:nth-child(1)','.actor:nth-child(2)','.actor:nth-child(2)'],
    setup:['.actor:first-child','.actor:first-child','.actor:first-child','.actor:nth-child(2)'],
    endpoints:['.actor:first-child','.actor:nth-child(2)','.actor:nth-child(3)'],
    accept:['.actor:first-child','.actor:nth-child(2)','.actor:nth-child(2)','.actor:nth-child(2)'],
    process:['.actor:first-child','.actor:nth-child(2)','.actor:nth-child(2)'],
    descriptors:['.owner .handle:first-of-type','.owner .handle:last-child','.owner .handle:last-child'],
    fork:['.actor:first-child','.actor:nth-child(2)','.actor:first-child'],
    shared:['.owner:first-child .handle','.owner:nth-child(2) .handle','.resource'],
    'close-copies':['.owner:first-child','.owner:first-child .handle:last-child','.owner:nth-child(2) .handle:first-of-type','.resource:last-child'],
    'missing-close':['.owner:first-child .handle','.owner:first-child .handle','.resource','.resource'],
    'file-limit':['.bar-row:first-child','.bar-row:first-child','.bar-row:nth-child(2)'],
    'exit-record':['.record','.record','.record'],
    zombie:['.record:first-child','.record:nth-child(2)','.record.collected'],
    wait:['.record','.notice','.record'],signal:['.record','.notice','.record'],
    interrupted:['.actor:first-child','.actor:nth-child(2)','.actor:first-child'],
    retry:['.actor:first-child','.actor:nth-child(2)','.actor:nth-child(2)'],
    burst:['.record:first-child','.notice','.record.ready'],
    drain:['.notice','.record.collected','.record.ready','.record:last-child','.notice'],
    'not-ready':['.record','.notice','.record'],
    lifecycle:['.actor:first-child','.actor:first-child','.actor:nth-child(2)','.actor:nth-child(2)','.actor:first-child'],
    code:['.code-purpose','.code-purpose','.code-purpose','.code-purpose','.code-purpose']
  };
  let focusTarget;
  function restoreWink(){
    // Preserve controls and their event handlers before replacing the scene DOM.
    const row=$('.wink-row');row.append($('#wink-toggle'),$('.wink-speech'));
  }
  function focusWink(){
    const board=$('#course-board'),s=current(),n=Math.min(momentCount()-1,Math.floor(progress*(momentCount()-1)+1e-7));
    if(board.querySelector('.course-motion')){motionWink();return;}
    board.querySelectorAll('.course-focus').forEach(x=>x.classList.remove('course-focus'));
    let selector=targets[s.scene]?.[n];
    if(timeline()){
      const lanes=board.querySelectorAll('.lane'),which=s.scene==='one'||progress<.12?0:1;
      focusTarget=lanes[Math.min(which,lanes.length-1)];
      if(['compare','explore'].includes(s.scene)&&progress>=.5)focusTarget=lanes[3];
      if(progress===1&&board.querySelector('.bar-row'))focusTarget=board.querySelector('.bar-row:nth-child(2)');
    }else focusTarget=board.querySelector(selector);
    if(s.scene==='drain'&&n>0&&n<4){
      const before=M.records(s.scene,n-1,data.part3_evidence).records;
      const after=M.records(s.scene,n,data.part3_evidence).records;
      const changed=after.findIndex((r,i)=>r.state!==before[i].state);
      if(changed>=0)focusTarget=board.querySelectorAll('.record')[changed];
    }
    if(!focusTarget)throw Error(`Missing Wink target for ${s.scene} moment ${n}`);
    focusTarget.classList.add('course-focus');
    const avatar=$('#wink-toggle'),speech=$('.wink-speech');
    $('.lesson-content').append(avatar);
    let slot=board.querySelector('.course-speech-slot');
    if(!slot){slot=document.createElement('div');slot.className='course-speech-slot';}
    slot.remove();
    const card=focusTarget.closest('.owner,.actor,.record,.lane,.resource,.bar-row')||focusTarget;
    const grid=card.parentElement;
    // Put the caption after the current visual row, without splitting peer objects.
    let after=card;
    if(grid.matches('.owner-grid,.actor-grid,.record-grid,.resource-grid')){
      const top=card.offsetTop;for(const peer of grid.children)if(peer.offsetTop===top)after=peer;
    }
    after.after(slot);slot.append(speech);
    placeWink();
  }
  function motionWink(){
    const board=$('#course-board');
    $('.lesson-content').append($('#wink-toggle'));
    let slot=board.querySelector('.course-speech-slot');
    if(!slot){slot=document.createElement('div');slot.className='course-speech-slot';board.append(slot);}
    slot.append($('.wink-speech'));placeMotionWink();
  }
  function placeMotionWink(){
    const svg=$('.course-motion svg'),target=svg?.querySelector('[data-motion-focus]');if(!target)return;
    const content=$('.lesson-content').getBoundingClientRect(),board=$('#course-board'),bounds=board.getBoundingClientRect();
    const x=+target.getAttribute('cx')+(+target.dataset.dock),y=+target.getAttribute('cy')+(+target.dataset.dockY||0);
    let at=new DOMPoint(x,y).matrixTransform(svg.getScreenCTM());
    const avatar=$('#wink-toggle'),scene=svg.getBoundingClientRect();
    const center=new DOMPoint(+target.getAttribute('cx'),+target.getAttribute('cy')).matrixTransform(svg.getScreenCTM());
    const marks=[...svg.querySelectorAll('circle,line,path,text')].filter(n=>!n.hasAttribute('opacity')||+n.getAttribute('opacity')>0).map(n=>n.getBoundingClientRect());
    const safe=p=>p.x-20>=scene.left&&p.x+20<=scene.right&&p.y-20>=scene.top&&p.y+20<=scene.bottom&&!marks.some(r=>p.x-20<r.right+3&&p.x+20>r.left-3&&p.y-20<r.bottom+3&&p.y+20>r.top-3);
    if(!safe(at)){
      const options=[];
      for(let d=45;d<=130;d+=10)for(let angle=0;angle<Math.PI*2;angle+=Math.PI/8){const point={x:center.x+Math.cos(angle)*d,y:center.y+Math.sin(angle)*d};if(safe(point))options.push(point);}
      options.sort((a,b)=>Math.hypot(a.x-center.x,a.y-center.y)+.3*Math.hypot(a.x-at.x,a.y-at.y)-Math.hypot(b.x-center.x,b.y-center.y)-.3*Math.hypot(b.x-at.x,b.y-at.y));
      if(options.length)at=options[0];
    }
    avatar.style.left=`${at.x-content.left-16}px`;avatar.style.top=`${at.y-content.top-16}px`;
    const slot=$('.course-speech-slot'),speech=$('.wink-speech');
    slot.classList.add('motion-speech-slot');slot.style.position='relative';slot.style.left='';slot.style.top='';
    const w=speech.offsetWidth,h=speech.offsetHeight,sr=svg.getBoundingClientRect();
    const obstacles=[...svg.querySelectorAll('circle,line,path,text')].filter(n=>!n.hasAttribute('opacity')||+n.getAttribute('opacity')>0).map(n=>n.getBoundingClientRect());
    obstacles.push({left:at.x-22,right:at.x+22,top:at.y-22,bottom:at.y+22});
    const candidates=[];
    for(let top=sr.top+8;top+h<sr.bottom-8;top+=12)for(let left=sr.left+8;left+w<sr.right-8;left+=12){
      if(!obstacles.some(o=>left<o.right+8&&left+w>o.left-8&&top<o.bottom+8&&top+h>o.top-8))candidates.push({left,top});
    }
    candidates.sort((a,b)=>Math.hypot(a.left+w/2-at.x,a.top+h/2-at.y)-Math.hypot(b.left+w/2-at.x,b.top+h/2-at.y));
    if(candidates.length){const dock=candidates[0];slot.style.position='absolute';slot.style.left=`${dock.left-bounds.left}px`;slot.style.top=`${dock.top-bounds.top}px`;}
  }
  function placeWink(){
    if($('#course-board .course-motion')){placeMotionWink();return;}
    if(!focusTarget?.isConnected||!$('.spatial-course'))return;
    const target=focusTarget.getBoundingClientRect(),content=$('.lesson-content').getBoundingClientRect();
    const avatar=$('#wink-toggle');avatar.style.left=`${target.left-content.left-40}px`;
    avatar.style.top=`${target.top-content.top+Math.min(target.height/2,32)-16}px`;
  }
  function bind(){
    $('#wink-toggle').onclick=toggleWink;$('#wink-more').onclick=toggleWink;
    document.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{stop();window.selectLesson(b.dataset.lesson);});
    document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>go(p.steps.findIndex(s=>s.chapter===b.dataset.chapter)));
    document.querySelectorAll('[data-course-step]').forEach(b=>b.onclick=()=>go(+b.dataset.courseStep));
    $('#course-back').onclick=()=>go(index-1);
    $('#course-next').onclick=()=>{if(index===p.steps.length-1){stop();done=true;mount();$('.course-done').scrollIntoView({block:'start'});}else go(index+1);};
    if($('#course-restart'))$('#course-restart').onclick=()=>go(0);
    if($('#course-play'))$('#course-play').onclick=play;
    if($('#course-moment'))$('#course-moment').onclick=advance;
    if($('#course-reset'))$('#course-reset').onclick=()=>{stop();guideClock=0;motionBlend=1;progress=0;lastDraw=-1;draw();};
    if($('#course-scrub'))$('#course-scrub').oninput=x=>{stop();motionBlend=1;progress=+x.target.value/1000;syncClock();draw();};
    if($('#course-arrival'))$('#course-arrival').onchange=x=>{stop();arrival=+x.target.value;progress=0;guideClock=0;draw();};
    document.querySelectorAll('[data-course-choice]').forEach(b=>b.onclick=()=>{choice=+b.dataset.courseChoice;checked=false;mount();});
    if($('#course-check'))$('#course-check').onclick=()=>{checked=true;mount();};
  }
  return {mount,stop,tourState};
})();
