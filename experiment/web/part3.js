/* Full course: teaching plan first, selected animation capabilities second. */
window.Part3 = (() => {
  const data=window.LIBRARY_DATA, A=window.Animations, M=window.Part3Models;
  const p=data.lessons.find(x=>x.id==='server'), e=A.esc;
  let index=0,progress=0,playing=false,choice=null,checked=false,arrival=.12,frame=0,previous=0,lastDraw=-1,done=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  try{const n=Number(localStorage.getItem('part3-full-step'));if(Number.isInteger(n)&&n>=0&&n<p.steps.length)index=n;}catch{}
  const $=s=>document.querySelector(s),current=()=>p.steps[index];
  const timeline=()=>['one','serial','compare','explore'].includes(current().scene);
  const chapter=()=>p.chapters.find(c=>c.id===current().chapter);
  const chapterSteps=()=>p.steps.filter(s=>s.chapter===current().chapter);
  function stop(){playing=false;cancelAnimationFrame(frame);}
  function selected(cap,inputs){const s=p.animation_selections.find(x=>x.step===current().id&&x.reason===`Required capability: ${cap}`);if(!s)throw Error(`Missing selection for ${current().id}/${cap}`);return A[s.renderer](inputs);}
  function mount(){
    stop();lastDraw=-1;
    const s=current(),ch=chapter(),local=chapterSteps(),chapterIndex=p.chapters.indexOf(ch);
    $('#app').innerHTML=`<div class="course-intro"><div class="eyebrow">LET’S BUILD A WEB SERVER / PART 3</div><h1>Build a server that<br>keeps working.</h1><p class="intro">First make room for another visitor. Then make sure every request leaves the server ready for the next one. A guided lesson from the first connection to serving many visitors without getting stuck.</p><p class="course-footnote">8 short chapters · no prior article reading needed · progress saved on this browser</p></div><div class="lesson-chooser course-chooser"><button class="selected" data-lesson="server"><small>01 / COMPLETE PART 3</small>Help more than one visitor</button><button data-lesson="search"><small>02 / SORTED SEARCH</small>Can one check rule out eight?</button></div><details class="course-map"><summary>Chapter ${chapterIndex+1} of 8 · ${e(ch.title)} <span class="muted">— browse the journey</span></summary><div class="chapter-list">${p.chapters.map((c,i)=>`<button data-chapter="${c.id}" class="${c.id===ch.id?'selected':''}"><small>CHAPTER ${i+1}</small>${e(c.title)}</button>`).join('')}</div></details>${done?`<div class="course-done" role="status"><h3>You reached the complete server.</h3><p>Try explaining why a reply can arrive while a socket is still open, and why one signal can require several cleanup calls. Those two distinctions are the heart of the later chapters.</p><button id="course-restart">Start again</button> <a href="../complete_server.py" download>Download the Python example</a></div>`:''}<section class="lesson-shell" aria-label="Part 3 guided lesson"><div class="chapter-intro"><div class="eyebrow">${String(chapterIndex+1).padStart(2,'0')} / ${e(ch.title)}</div><p>${e(ch.promise)}</p></div><div class="progress">${local.map((x,i)=>`<button data-course-step="${p.steps.indexOf(x)}" class="${p.steps.indexOf(x)<=index?'past':''}" aria-label="Chapter step ${i+1}: ${e(x.title)}"></button>`).join('')}</div><div class="lesson-content"><div class="step-counter">STEP ${local.indexOf(s)+1} OF ${local.length} · ${index+1} / ${p.steps.length} OVERALL</div><h2>${e(s.title)}</h2><p class="guidance">${e(s.explanation)}</p>${s.scene==='prediction'?question(s):`${s.scene==='explore'?`<label class="parameter">B arrives <select id="course-arrival"><option value="0.12" ${arrival===.12?'selected':''}>0.12 seconds after A</option><option value="0.36" ${arrival===.36?'selected':''}>0.36 seconds after A</option><option value="0.8" ${arrival===.8?'selected':''}>0.80 seconds after A</option></select></label>`:''}<div class="board" id="course-board"></div><div class="playback"><button class="primary" id="course-play">Play these moments</button><button id="course-moment" aria-label="Advance one visual moment">Step +</button><button id="course-reset" aria-label="Restart this visual">↺</button><input id="course-scrub" type="range" min="0" max="1000" value="${progress*1000}" aria-label="Visual progress"><span id="course-status" class="micro"></span></div><p class="evidence-note">${e(s.evidence||'Actual local TCP recordings; the article’s 60-second pause is shortened to 0.6 seconds. Playback is slowed for readability. Client receipt times approximate the handling intervals.')}</p>${s.code?`<details><summary>Connect this idea to the code</summary><pre>${e(s.code)}</pre></details>`:''}`}</div><div class="lesson-bottom"><span class="micro">${e(index===0?'Start with a request and its reply.':ch.recall)}</span><button id="course-back" ${index===0?'disabled':''}>Back</button><button class="primary" id="course-next">${index===p.steps.length-1?'Finish course':p.steps[index+1].chapter!==s.chapter?'Next chapter →':'Next step →'}</button></div></section><details><summary>Why this teaching and animation choice?</summary><p><b>Teaching:</b> ${e(s.teaching_card)} — ${e(data.teaching.find(c=>c.id===s.teaching_card).title)}</p><p><b>Already established:</b> ${s.requires.map(e).join(', ')}</p><p><b>Introduces:</b> ${s.introduces.map(e).join(', ')||'Apply the ideas you already met.'}</p>${p.animation_selections.filter(x=>x.step===s.id).map(x=>`<p>${e(x.card)} · ${e(x.reason)}</p>`).join('')}${s.scene==='prediction'?'<p>A question checks understanding here; extra motion would not help.</p>':''}</details><details><summary>Article, technical references & coverage</summary><p>The course follows the problems in <a href="https://ruslanspivak.com/lsbaws-part3/" target="_blank" rel="noreferrer">Ruslan Spivak’s Part 3</a>, with authored scenes checked against the <a href="https://docs.python.org/3/library/socket.html" target="_blank" rel="noreferrer">Python socket interface</a>, <a href="https://man7.org/linux/man-pages/man2/fork.2.html" target="_blank" rel="noreferrer">fork</a>, <a href="https://man7.org/linux/man-pages/man2/waitpid.2.html" target="_blank" rel="noreferrer">waitpid</a>, <a href="https://man7.org/linux/man-pages/man7/signal.7.html" target="_blank" rel="noreferrer">standard signal semantics</a>, and <a href="https://peps.python.org/pep-0475/" target="_blank" rel="noreferrer">modern Python retries</a>.</p><p>Recorded experiments and explanatory reconstructions are labeled beside the visual. Tiny diagrams omit low-level networking states; they do not claim to be packet-level simulations.</p><a href="../PART3-COVERAGE.md" target="_blank">Read the full coverage map</a> · <a href="../runs/part3-evidence.json" target="_blank">Inspect the recorded probes</a></details>`;
    bind();if(s.scene!=='prediction')draw();
  }
  function question(s){const q=s.question;return `<div class="choices">${q.options.map((o,i)=>`<button data-course-choice="${i}" class="${choice===i?'chosen':''}" aria-pressed="${choice===i}">${e(o)}</button>`).join('')}</div><button class="primary" id="course-check" ${choice===null?'disabled':''}>Check my prediction</button>${checked?`<div class="feedback" role="status">${e(q.feedback[choice])}</div>`:''}${s.evidence?`<p class="evidence-note">${e(s.evidence)}</p>`:''}`;}
  function go(n){stop();index=n;progress=0;choice=null;checked=false;arrival=.12;done=false;try{localStorage.setItem('part3-full-step',String(index));}catch{}mount();$('.lesson-shell').scrollIntoView({block:'start',behavior:'instant'});}
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
    if(['descriptors','shared','close-copies','missing-close'].includes(s.scene))html=selected('show-ownership',M.ownership(s.scene,n));
    else if(['exit-record','zombie','wait','signal','burst','drain','not-ready'].includes(s.scene))html=selected('show-records',M.records(s.scene,n,E));
    else if(s.scene==='file-limit'){
      const f=E.fd_limit,opened=n===0?Math.min(5,f.opened_before_error):f.opened_before_error;
      html=`<div class="board-top"><b>Isolated subprocess limit: ${f.limit} handles</b></div>${selected('compare-amounts',{labels:['Opened in this demonstration','Released by cleanup'],values:[opened,n===2?opened:0],unit:'handles',maximum:f.limit})}<div class="ledger-result">${n===1?`${e(f.error)} (${f.errno}): kernel refuses another open.`:n===2?'Opening a new resource succeeds after cleanup.':'The process already has standard input, output, and error open.'}</div>`;
    }else html=selected('show-stages',M.stage(s.scene,n,E));
    html=`<div class="moment-nav"><span>VISUAL MOMENT ${n+1} / ${s.frames.length}</span><span>${n===0?'Starting situation':n===s.frames.length-1?'Result':'Follow the change'}</span></div>`+html+`<div class="observation">${e(s.frames[n].caption)}</div>`;
    if(s.scene==='code'){
      const code=data.server_code.split('\n');const ranges=[[43,43],[52,58],[67,68],[58,66],[12,22]][n];
      html+=`<p class="code-purpose">Highlighted: ${e(M.stage('code',n,E).actors[0].title)}</p><pre class="course-code" tabindex="0" aria-label="Complete Python server"><code>${code.map((line,i)=>`<span class="code-line ${i+1>=ranges[0]&&i+1<=ranges[1]?'lit':''}"><span class="line-number">${i+1}</span>${e(line)}</span>`).join('')}</code></pre><a class="practice-link" href="../complete_server.py" download>Download the complete Python example ↗</a><details><summary>Try the complete server yourself</summary><p>Download the file, then run it from the folder where it was saved:</p><pre>python3 complete_server.py --port 8888 --delay 0.6</pre><p>In two other terminals, run this command in quick succession:</p><pre>curl http://127.0.0.1:8888/</pre><p>Both should receive the text promptly. Each connection then finishes after its short deliberate pause. The server handles requests in children and collects their exit records.</p></details>`;
    }
    return html;
  }
  function draw(){
    if(!$('#course-board'))return;
    const s=current(),n=timeline()?null:Math.min(s.frames.length-1,Math.floor(progress*(s.frames.length-1)+1e-7));
    if(timeline()||n!==lastDraw){$('#course-board').innerHTML=timeline()?timelineHTML():frameHTML(n);lastDraw=n;if(s.scene==='code'){const panel=$('.course-code'),lit=panel.querySelector('.lit');if(lit)panel.scrollTop=Math.max(0,lit.offsetTop-panel.offsetTop-35);}}
    $('#course-scrub').value=Math.round(progress*1000);$('#course-status').textContent=playing?'Playing':progress===1?'Complete':progress===0?'Ready':'Paused';
    $('#course-play').textContent=playing?'Pause':progress===1?'Replay':reduced?'Next visual moment':progress?'Continue':'Play these moments';
    $('#course-moment').disabled=progress===1;
  }
  function advance(){stop();const parts=timeline()?6:current().frames.length-1;progress=Math.min(1,Math.round(progress*parts+1)/parts);draw();}
  function play(){if(playing){stop();draw();return;}if(progress===1){progress=0;lastDraw=-1;}if(reduced){advance();return;}playing=true;previous=performance.now();if(progress===0)progress=timeline()?.035:1/(current().frames.length-1);draw();frame=requestAnimationFrame(tick);}
  function tick(now){const duration=timeline()?6:(current().frames.length-1)*1.8;progress=Math.min(1,progress+(now-previous)/(duration*1000));previous=now;if(progress===1)playing=false;draw();if(playing)frame=requestAnimationFrame(tick);}
  function bind(){
    document.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{stop();window.selectLesson(b.dataset.lesson);});
    document.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>go(p.steps.findIndex(s=>s.chapter===b.dataset.chapter)));
    document.querySelectorAll('[data-course-step]').forEach(b=>b.onclick=()=>go(+b.dataset.courseStep));
    $('#course-back').onclick=()=>go(index-1);
    $('#course-next').onclick=()=>{if(index===p.steps.length-1){stop();done=true;mount();$('.course-done').scrollIntoView({block:'start'});}else go(index+1);};
    if($('#course-restart'))$('#course-restart').onclick=()=>go(0);
    if($('#course-play'))$('#course-play').onclick=play;
    if($('#course-moment'))$('#course-moment').onclick=advance;
    if($('#course-reset'))$('#course-reset').onclick=()=>{stop();progress=0;lastDraw=-1;draw();};
    if($('#course-scrub'))$('#course-scrub').oninput=x=>{stop();progress=+x.target.value/1000;draw();};
    if($('#course-arrival'))$('#course-arrival').onchange=x=>{stop();arrival=+x.target.value;progress=0;draw();};
    document.querySelectorAll('[data-course-choice]').forEach(b=>b.onclick=()=>{choice=+b.dataset.courseChoice;checked=false;mount();});
    if($('#course-check'))$('#course-check').onclick=()=>{checked=true;mount();};
  }
  return {mount,stop};
})();
