(() => {
  const plan=window.StateCourse, board=window.StateBoard, $=id=>document.getElementById(id);
  const player=document.body.dataset.player;
  const selected=player?plan.filter(s=>s.id===player):plan;
  let index=0,revealed=0,spoken='';
  const stored=location.hash.match(/^#screen=(.+)$/)?.[1];
  if(stored) index=Math.max(0,selected.findIndex(s=>s.id===stored));
  function say(text){if(text!==spoken){$('words').textContent=text;spoken=text;}}
  function draw(){
    const s=selected[index];
    if(s.recap||s.introduction)return;
    say(board.update(s,$('board'),revealed));
    const total=s.entries?.length || 0;
    $('entry-count').textContent=`${revealed} / ${total} entries`;
    $('previous-entry').disabled=revealed===0;
    $('replay').disabled=revealed===0;
    $('play').textContent=revealed===total?'All entries shown':revealed===0?'Show first entry →':'Next entry →';
    $('play').disabled=revealed===total;
    $('next').textContent=total && revealed<total
      ? revealed===0?'Show first entry →':'Next entry →'
      : index===0?'Begin the story →':'Continue →';
  }
  function show(next,updateHash=true){
    index=Math.max(0,Math.min(selected.length-1,next));
    const s=selected[index];revealed=0;spoken='';
    const cleanPage=!!(s.recap||s.introduction);
    $('lesson').hidden=cleanPage;$('recap').hidden=!cleanPage;
    if(updateHash&&!player)history.replaceState(null,'','#screen='+s.id);
    if(cleanPage){
      $('recap-face').innerHTML=board.wink;
      $('recap-lead').textContent=s.introduction?s.lead:'So now you know…';
      $('bullets').hidden=!!s.introduction;
      $('bullets').innerHTML=(s.bullets||[]).map(b=>`<li>${board.escape(b)}</li>`).join('');
      $('bridge').textContent=s.introduction?s.words:s.bridge;
      $('recap-next').textContent=s.continueLabel||(index===selected.length-1?'Return to the beginning →':'Continue →');
    }else{
      $('position').textContent=`Chapter 3 · ${index+1} / ${selected.length}`;
      $('era').textContent=`${['','I · War and aftermath','II · A seasonal strain','III · A new central bank'][s.act]} · ${s.era}`;
      $('role').textContent=s.role;$('title').textContent=s.title;
      $('guide-face').innerHTML=board.wink;
      $('term').hidden=!s.term;$('term').textContent=s.term?'New word · '+s.term:'';
      $('why').hidden=!s.detail;$('why').open=false;$('detail').textContent=s.detail||'';
      $('back').disabled=index===0;
      $('next').textContent=index===0?'Begin the story →':'Continue →';
      $('progress-fill').style.width=`${(index+1)/selected.length*100}%`;
      board.render(s,$('board'));say(s.words);
      $('transport').hidden=!s.entries;
      draw();
    }
    document.querySelectorAll('[data-jump]').forEach(b=>b.setAttribute('aria-current',Number(b.dataset.jump)===index?'step':'false'));
    window.scrollTo(0,0);
  }
  $('back').onclick=()=>show(index-1);
  function advanceEntry(){revealed=Math.min(selected[index].entries.length,revealed+1);draw();}
  $('next').onclick=()=>{
    if(revealed<(selected[index].entries?.length || 0))advanceEntry();
    else show(index+1);
  };
  $('recap-next').onclick=()=>show(index===selected.length-1?0:index+1);
  $('play').onclick=advanceEntry;
  $('previous-entry').onclick=()=>{revealed=Math.max(0,revealed-1);draw();};
  $('replay').onclick=()=>{revealed=0;draw();};
  $('play').hidden=!player;
  const map=$('map');
  $('map-list').innerHTML=selected.map((s,i)=>`<li><button data-jump="${i}">${i+1}. ${board.escape(s.title||'Pause · connect the ideas')}</button></li>`).join('');
  $('map-list').onclick=e=>{const b=e.target.closest('[data-jump]');if(b){map.close();show(Number(b.dataset.jump));}};
  $('open-map').onclick=()=>map.showModal();$('close-map').onclick=()=>map.close();
  if(player){document.body.classList.add('player');$('back').hidden=true;$('next').hidden=true;$('progress').hidden=true;}
  addEventListener('hashchange',()=>{const id=location.hash.slice(8), n=selected.findIndex(s=>s.id===id);if(n>=0)show(n,false);});
  show(index,false);
})();
