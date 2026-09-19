(() => {
 const $=id=>document.getElementById(id), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const preview=document.body.dataset.preview;
 let chapter=preview?Math.max(0,MoneyLesson.findIndex(c=>c.id===preview)):0,step=0,elapsed=0,playing=false,last=0,options={};
 const current=()=>MoneyLesson[chapter];
 function narrate(){const c=current(),row=c.steps[step];$('step-label').textContent=`MOMENT ${step+1} / 3`;$('step-title').textContent=row[0];$('caption').textContent=row[1];}
 function describeExploration(){
  const c=current(); const caption={
   hierarchy:()=>['International settlement: gold is the final asset in this historical example.','A bank needs higher-level money to settle; its own deposit is its promise.','To a customer, a deposit can settle a purchase; it remains a liability of the bank.'][Number(options.view)],
   ledger:()=>({separate:'Keep each account visible: the holder’s asset and issuer’s obligation are the same contract.',private:'Within the private sector, the deposit offsets. Currency remains a claim on an issuer outside this boundary.',whole:'Include the central bank: currency also offsets. Gold has no matching issuer’s liability.'}[options.boundary]),
   elasticity:()=>options.accepted?'The seller accepts an IOU. Trade can proceed, but currency is still due later.':'The seller requires currency now. This buyer has none, so this trade waits.',
   cycle:()=>`${options.quantity??[4,8,4][step]} illustrative claims; acceptance is ${Number(options.trust??[55,90,15][step])<35?'under strain':Number(options.trust??[55,90,15][step])>65?'high':'intermediate'}. Change either dimension while holding the other constant.`,
   bridges:()=>['The central bank maintains currency’s conversion into gold in this historical model.','The bank supports par: one currency unit for one deposit unit. Equal price does not mean identical instruments.','Dealers connect securities with payment money through security prices and yields.'][Number(options.bridge)],
   policy:()=>options.support?'Reserve lending adds a settlement asset and a repayment obligation to the commercial bank.':'The bank has promises to honour and needs higher-level settlement resources.'};
  $('step-label').textContent='EXPLORATION · GUIDE PAUSED';$('step-title').textContent='What changes in this case?';$('caption').textContent=caption[c.id]();
 }
 function paint(){const c=current();$('drawing').innerHTML=MoneyDrawing.render(c.id,step,reduced.matches?6:elapsed/1000,options);$('diagram-title').textContent=c.question;$('diagram-description').textContent=$('caption').textContent;$('progress').value=elapsed;$('play').textContent=playing?'Pause':'Play';}
 function controlValue(el){return el.id==='trust'?(Number(el.value)<35?'Low':Number(el.value)>65?'High':'Intermediate'):el.value;}
 function exploration(){
  const c=current();const controls={
   hierarchy:'<label>Stand here <select id="view"><option value="2">A customer</option><option value="1">A bank</option><option value="0">International settlement</option></select></label>',
   ledger:'<label>Combine these accounts <select id="boundary"><option value="separate">Keep separate</option><option value="private">Private sector</option><option value="whole">Whole system</option></select></label>',
   elasticity:'<label>Seller’s choice <select id="accepted"><option value="false">Require currency now</option><option value="true">Accept the IOU</option></select></label>',
   cycle:'<label>Number of claims <input id="quantity" type="range" min="1" max="8" value="4"><output id="quantity-value">4</output></label><label>Acceptance <input id="trust" type="range" min="0" max="100" value="55"><output id="trust-value">55</output></label>',
   bridges:'<label>Inspect a bridge <select id="bridge"><option value="2">Securities ↔ money</option><option value="1">Deposits ↔ currency</option><option value="0">Currency ↔ gold</option></select></label>',
   policy:'<label>Liquidity support <select id="support"><option value="false">Before the loan</option><option value="true">After the loan</option></select></label>'};
  $('explore').innerHTML=controls[c.id]+'<span class="small">Explore freely · changes pause the guide</span>';
  const defaults={view:[2,1,0][step],boundary:['separate','private','whole'][step],accepted:step>0,quantity:[4,8,4][step],trust:[55,90,15][step],bridge:[2,1,0][step],support:step>0};
  $('explore').querySelectorAll('select,input').forEach(el=>{el.value=String(defaults[el.id]);if($(el.id+'-value'))$(el.id+'-value').textContent=controlValue(el);el.oninput=()=>{playing=false;options[el.id]=['accepted','support'].includes(el.id)?el.value==='true':el.value;elapsed=6000;if($(el.id+'-value'))$(el.id+'-value').textContent=controlValue(el);describeExploration();paint();};});
 }
 function load(){const c=current(),s=c.steps[step];options={};elapsed=0;last=0;$('question').textContent=c.question;$('intro').textContent=c.intro;$('count').textContent=`${chapter+1} / 6 · ${c.label}`;$('step-label').textContent=`MOMENT ${step+1} / 3`;$('step-title').textContent=s[0];$('caption').textContent=s[1];$('detail').textContent=s[2];$('prompt').textContent='Think it through · '+c.prompt;$('answer').textContent=c.answer;$('reason').open=false;$('source-link').textContent=`Chapter 2 · printed pp. ${c.page} ↗`;$('source-link').href='sources.html#'+c.id;$('back').disabled=chapter===0&&step===0;$('next').textContent=chapter===5&&step===2?'Return to overview':step===2?'Next question →':'Next →';
  $('chapters').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-current',String(i===chapter)));exploration();paint();
 }
 function show(){ $('overview').hidden=true;$('lesson').hidden=false;load(); }
 function advance(){if(step<2){step++;load();}else{playing=false;paint();}}
 MoneyLesson.forEach((c,i)=>{const b=document.createElement('button');b.textContent=`0${i+1} ${c.label}`;b.onclick=()=>{chapter=i;step=0;playing=false;show();};$('chapters').appendChild(b);});
 $('begin').onclick=()=>{chapter=0;step=0;show();};
 $('overview-button').onclick=()=>{playing=false;$('overview').hidden=false;$('lesson').hidden=true;};
 $('back').onclick=()=>{playing=false;if(step>0)step--;else if(chapter>0){chapter--;step=2;}load();};
 $('next').onclick=()=>{playing=false;if(step<2)step++;else if(chapter<5){chapter++;step=0;}else{$('overview-button').click();return;}load();};
 $('play').onclick=()=>{if(Object.keys(options).length){options={};elapsed=0;narrate();exploration();}if(!playing&&elapsed>=6000){if(step===2){step=0;load();}else advance();}playing=!playing;last=0;paint();};
 $('replay').onclick=()=>{options={};narrate();elapsed=0;last=0;playing=!reduced.matches;exploration();paint();};
 $('progress').oninput=()=>{playing=false;elapsed=Number($('progress').value);paint();};
 [$('reason'),$('wink-note')].forEach(el=>el.addEventListener('toggle',()=>{if(el.open){playing=false;paint();}}));
 document.addEventListener('visibilitychange',()=>{last=0;});
 reduced.addEventListener('change',()=>{playing=false;paint();});
 $('motion-note').textContent=reduced.matches?'reduced motion · static states':'motion follows the explanation';
 function frame(now){if(playing&&!document.hidden){if(last)elapsed=Math.min(6000,elapsed+now-last);paint();if(elapsed>=6000)advance();}last=now;requestAnimationFrame(frame);}
 if(preview){document.body.classList.add('preview');show();playing=!reduced.matches;}else load();requestAnimationFrame(frame);
})();
