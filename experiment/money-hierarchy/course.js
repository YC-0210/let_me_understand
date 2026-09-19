(()=>{
 const $=id=>document.getElementById(id),reduced=matchMedia('(prefers-reduced-motion: reduce)'),preview=document.body.dataset.preview;
 const labels={elasticity:'A $5 lunch',hierarchy:'Your bank balance',ledger:'Both sides of a promise',cycle:'When trust changes',bridges:'Keeping exchanges working',policy:'The central bank'};
 let index=0,active=false,elapsed=0,playing=false,last=0,answered=false;
 // Preview the lesson’s actual diagrams, with no full lesson embedded.
 const previewScenes={hierarchy:'two-layers',ledger:'boundary',elasticity:'iou',cycle:'trust',bridges:'withdraw',policy:'support'};
 if(preview)index=MoneyCourse.findIndex(p=>p.scene===previewScenes[preview]&&p.action);
 const watching={cash:'Watch your $5 move to the café.',iou:'Watch your promise reach the café owner.',deposit:'Watch the bank move $5 between the two accounts.',reserves:'Watch reserves move from Bank A to Bank B.',withdraw:'Watch the bank exchange the balance for a note.',dealer:'Watch the bond reach the dealer.',support:'Watch reserves reach the bank. They come with a loan.'};
 function page(){return MoneyCourse[index];}
 function paint(){const p=page();$('art').innerHTML=MoneyCourseDrawing.render(p,active,reduced.matches?6:elapsed/1000);$('picture-title').textContent=p.title;$('picture-desc').textContent=$('speech').textContent;$('scrub').value=elapsed;$('play').textContent=playing?'Pause':'Play';$('replay').textContent=playing?'Ⅱ':elapsed<6000&&active?'▶':'↺';$('replay').setAttribute('aria-label',playing?'Pause animation':elapsed<6000&&active?'Resume animation':'Replay animation');}
 function load(){const p=page();active=false;answered=false;elapsed=0;playing=false;last=0;$('title').textContent=p.title;$('speech').textContent=p.say;$('topic').textContent=labels[p.topic];$('position').textContent=`${index+1} / ${MoneyCourse.length}`;$('course-progress').max=MoneyCourse.length;$('course-progress').value=index+1;$('back').disabled=index===0;$('detail').textContent=p.more;$('reading').href='sources.html#'+p.topic;$('more').open=false;$('feedback').textContent='';$('choices').replaceChildren();$('replay').hidden=true;$('continue').hidden=!!p.choices;$('continue').textContent=p.action||'Continue';
  (p.choices||[]).forEach((choice,i)=>{const b=document.createElement('button');b.textContent=choice;b.setAttribute('aria-pressed','false');b.onclick=()=>{if(answered)return;$('choices').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');if(i!==p.correct){$('speech').textContent=p.hint;$('feedback').textContent='Try the other possibility.';return;}answered=true;$('feedback').textContent='';$('speech').textContent=p.result;active=true;elapsed=6000;$('choices').hidden=true;$('continue').hidden=false;$('continue').textContent='Continue';paint();};$('choices').appendChild(b);});$('choices').hidden=false;paint();}
 function run(){active=true;elapsed=reduced.matches?6000:0;playing=!reduced.matches;last=0;$('speech').textContent=!reduced.matches&&watching[page().scene]?watching[page().scene]:page().result;$('continue').textContent=index===MoneyCourse.length-1?'Start again':'Continue';$('replay').hidden=false;paint();}
 $('continue').onclick=()=>{if(!active&&!page().choices){run();return;}index=index===MoneyCourse.length-1?0:index+1;load();window.scrollTo({top:0,behavior:'instant'});};
 $('back').onclick=()=>{if(index){index--;load();}};
 $('replay').onclick=()=>{if(active&&elapsed<6000){playing=!playing;last=0;paint();}else run();};
 $('more').addEventListener('toggle',()=>{if($('more').open){playing=false;paint();}});
 $('map-button').onclick=()=>{playing=false;$('map').showModal();paint();};
 for(const [topic,label] of Object.entries(labels)){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{index=MoneyCourse.findIndex(p=>p.topic===topic);$('map').close();load();};$('map-links').appendChild(b);}
 $('play').onclick=()=>{if(!active||elapsed>=6000){active=true;elapsed=0;}playing=!playing;last=0;paint();};
 $('scrub').oninput=()=>{active=true;playing=false;elapsed=Number($('scrub').value);paint();};
 document.addEventListener('visibilitychange',()=>{last=0;});reduced.addEventListener('change',()=>{playing=false;paint();});
 function frame(now){if(playing&&!document.hidden){if(last)elapsed=Math.min(6000,elapsed+now-last);if(elapsed>=1860)$('speech').textContent=page().result;if(elapsed===6000)playing=false;paint();}last=now;requestAnimationFrame(frame);}
 load();if(preview){document.body.classList.add('preview');$('player').hidden=false;run();}requestAnimationFrame(frame);
})();
