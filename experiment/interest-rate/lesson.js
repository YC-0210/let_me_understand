(function(){
 const $=id=>document.getElementById(id), steps=InterestPlan;
 const preview=document.body.dataset.preview, previewIDs={time:'rate',spread:'loan',curve:'curve',qe:'qe'};
 let index=preview?steps.findIndex(s=>s.id===previewIDs[preview]):0, elapsed=0, playing=false, last=0, values={}, answered=false;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const draw=()=>{$('art').innerHTML=InterestRender.render(steps[index],elapsed,values);$('scrub').value=elapsed;$('clock').textContent=Math.floor(elapsed/1000)+' / 6 s';};
 function playback(value){playing=value;last=0;$('play').textContent=playing?'Pause':elapsed>=6000?'Replay':'Play';$('play').setAttribute('aria-label',playing?'Pause animation':elapsed>=6000?'Replay animation':'Play animation');}
 function restart(){elapsed=reduced?6000:0;playback(!reduced);draw();}
 function options(labels, key, vals, initial){
   values[key]=initial;
   labels.forEach((label,i)=>{const button=document.createElement('button');button.textContent=label;button.setAttribute('aria-pressed',String(vals[i]===initial));button.onclick=()=>{
     values[key]=vals[i];$('controls').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));restart();
   };$('controls').append(button);});
 }
 function load(){
  const step=steps[index];values={};answered=false;
  $('chapter').textContent=step.chapter;$('position').textContent=(index+1)+' / '+steps.length;$('progress').max=steps.length;$('progress').value=index+1;
  $('title').textContent=step.title;$('cue').textContent=step.cue;$('detail').textContent=step.detail;
  $('picture-title').textContent=step.title;$('picture-desc').textContent=step.cue;
  $('video-source').href='https://www.youtube.com/watch?v=u3Q9BpZOhP8&t='+step.sourceTime+'s';
  $('more').open=false;$('feedback').textContent='';$('controls').replaceChildren();
  $('back').disabled=index===0;$('next').textContent=index===steps.length-1?'Back to the beginning ↺':'Continue →';
  const configs={rate:[['0%','2%','5%'],'rate',[0,2,5],2],cut:[['2%','Cut to 0%'],'cut',[2,0],2],brake:[['0%','Raise to 5%'],'cut',[0,5],0],demand:[['3 customers','6 customers'],'demand',[3,6],3],risk:[['Lower risk: 1.8%','Higher risk: 3.0%'],'risk',[1.8,3],1.8],price:[['Pay $100','Pay $102'],'price',[100,102],100],qe:[['Before buying: $100','Higher price: $102'],'price',[100,102],100],curve:[['Upward slope','Inverted curve'],'shape',['normal','inverted'],'normal'],maturity:[['Short end','Add longer terms'],'maturity',[2,5],2],expectations:[['Lower expected future rates','Higher expected future rates'],'expectations',[-1,1],-1]};
  if(step.control)options(...configs[step.control]);
  if(step.quiz){step.quiz.forEach((label,i)=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{
    playback(false);answered=i===step.answer;$('feedback').textContent=answered?step.feedback:'Look again: '+(step.id==='check-time'?'repay the original $100 as well as the interest.':step.id==='check-curve'?'the observation date stays the same.':'borrower risk and longer-term expectations can also change.');
    $('controls').querySelectorAll('button').forEach(btn=>btn.setAttribute('aria-pressed',String(btn===b)));
  };$('controls').append(b);});const reveal=document.createElement('button');reveal.textContent='Show me';reveal.onclick=()=>{playback(false);$('feedback').textContent=step.feedback;};$('controls').append(reveal);}
  restart();
  if(!preview)try{localStorage.setItem('interest-rate-2026-09-20-position',String(index));}catch{}
 }
 const chapterStarts=steps.filter((s,i)=>i===0||steps[i-1].chapter!==s.chapter);
 chapterStarts.forEach(s=>{const b=document.createElement('button');b.textContent=s.chapter;b.onclick=()=>{index=steps.indexOf(s);$('route').open=false;load();};$('sections').append(b);});
 $('back').onclick=()=>{if(index>0){index--;load();}};
 $('next').onclick=()=>{index=(index+1)%steps.length;load();};
 $('play').onclick=()=>{if(elapsed>=6000)elapsed=0;playback(!playing);draw();};
 $('scrub').oninput=()=>{playback(false);elapsed=Number($('scrub').value);draw();};
 document.addEventListener('keydown',e=>{if(e.target.closest('button,input,textarea,[contenteditable],summary'))return;if(e.key==='ArrowRight')$('next').click();if(e.key==='ArrowLeft')$('back').click();});
 function tick(now){
  if(playing&&!document.hidden){if(last)elapsed=Math.min(6000,elapsed+Math.min(100,now-last));draw();if(elapsed>=6000){if(preview&&!reduced){elapsed=0;}else playback(false);}}
  last=now;requestAnimationFrame(tick);
 }
 document.addEventListener('visibilitychange',()=>{last=0;});
 load();requestAnimationFrame(tick);
})();
