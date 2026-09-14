/* Three visual alternatives. The clock controls every position and state. */
window.MotionStudies = (() => {
  const e=Animations.esc, clamp=x=>Math.max(0,Math.min(1,x)), ramp=(t,a,b)=>clamp((t-a)/(b-a)), lerp=(a,b,x)=>a+(b-a)*x;
  const colors={ink:'#ebe8f5',line:'#8b81bd',muted:'#8d899c',green:'#7cdaa7',purple:'#b1a0ff',amber:'#f2c47f'};
  const line=(x1,y1,x2,y2,color=colors.line,opacity=1,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="3" opacity="${opacity}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
  const text=(x,y,s,size=15,color=colors.ink)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="${color}">${e(s)}</text>`;
  const circle=(x,y,r,stroke=colors.line,fill='#191820',opacity=1)=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${stroke}" stroke-width="3" fill="${fill}" opacity="${opacity}"/>`;
  const dot=(x,y,c=colors.amber,r=7)=>circle(x,y,r,c,c);
  const ring=(x,y,r,p)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${colors.purple}" stroke-width="5" stroke-dasharray="${2*Math.PI*r*p} ${2*Math.PI*r}" transform="rotate(-90 ${x} ${y})"/>`;
  function packet(t,a,b,x1,y1,x2,y2,c=colors.green){if(t<a||t>b)return '';let p=ramp(t,a,b);return dot(lerp(x1,x2,p),lerp(y1,y2,p),c);}
  function shared(t){
    const born=ramp(t,.8,1.8),parent=1-ramp(t,3.6,4.2),child=born*(1-ramp(t,7,7.6)),closed=t>=7.6;
    const cx=lerp(145,495,born),cy=82;
    let s=line(320,231,320,326,colors.line,1-ramp(t,8.8,9.5));
    s+=line(145,105,300,197,colors.purple,parent)+line(cx,105,340,197,colors.purple,child);
    s+=circle(145,82,27)+text(145,40,'Parent');
    if(born>0)s+=circle(cx,cy,27*born)+text(cx,40,'Child');
    s+=circle(320,211,24,closed?colors.muted:colors.purple,closed?'#191820':'#30283f');
    s+=text(389,216,closed?'closed':'Socket A',14,closed?colors.muted:colors.ink);
    if(parent>0)s+=dot(160,114,colors.purple,5*parent);
    if(child>0)s+=dot(cx-15,114,colors.purple,5*child);
    s+=circle(320,343,16,colors.muted)+text(320,383,'Browser',14);
    s+=packet(t,4.6,5.8,320,239,320,324);
    if(t>=7.8&&t<8.8){let y=lerp(240,326,ramp(t,7.8,8.8));s+=line(310,y,330,y,colors.ink);}
    if(t>=8.8)s+=`<path d="M313 343 l5 5 l10 -12" fill="none" stroke="${colors.green}" stroke-width="3"/>`;
    return {svg:s,cue:t<.8?'One process holds a connection.':t<3.6?'A second handle reaches the same socket.':t<7?'One handle closes. The child can still send a reply.':t<8.8?'The last handle closes. The stream can now end.':'Both handles are closed. The browser sees the end.',phase:t<1?0:t<3.6?1:t<7?2:3,handles:(parent>.01?1:0)+(child>.01?1:0)};
  }
  function workers(t){
    const b1=ramp(t,1.2,2),b2=ramp(t,3.3,4.1),y1=lerp(205,106,b1),y2=lerp(205,300,b2),x1=lerp(190,455,b1),x2=lerp(190,455,b2);
    let s=circle(190,205,30)+text(190,261,'Parent',15)+text(190,282,t>2?'ready for arrivals':'accepts requests',12,colors.muted);
    s+=circle(45,106,13,colors.muted)+text(45,77,'A',14)+circle(45,300,13,colors.muted)+text(45,341,'B',14);
    s+=line(59,113,160,189,colors.muted,.4,'4 7')+line(59,291,160,220,colors.muted,.4,'4 7');
    if(b1>0){s+=line(218,194,x1-28,y1+10,colors.line,.4,'4 7')+circle(x1,y1,27*b1);if(b1===1)s+=text(x1,62,'Child A',14)+ring(x1,y1,35,ramp(t,2,8));}
    if(b2>0){s+=line(218,217,x2-28,y2-10,colors.line,.4,'4 7')+circle(x2,y2,27*b2);if(b2===1)s+=text(x2,356,'Child B',14)+ring(x2,y2,35,ramp(t,4.1,9.6));}
    s+=packet(t,.1,1.2,59,113,190,205,colors.amber)+packet(t,1.2,2.2,190,205,455,106,colors.amber);
    s+=packet(t,2.2,3.3,59,291,190,205,colors.amber)+packet(t,3.3,4.3,190,205,455,300,colors.amber);
    s+=packet(t,5.5,6.6,422,106,62,106)+packet(t,6.8,7.9,422,300,62,300);
    if(t>=8)s+=text(455,112,'✓',22,colors.green);
    if(t>=9.6)s+=text(455,306,'✓',22,colors.green);
    return {svg:s,cue:t<1.2?'A request reaches the parent.':t<2.2?'A child takes the first request.':t<4.3?'The parent takes another request while Child A works.':t<8?'Both children work. Each sends its own reply.':'The parent stayed available while both requests finished.',phase:t<1.2?0:t<2.2?1:t<4.3?2:3};
  }
  function cleanup(t){
    const xs=[150,320,490],ends=[1.6,2,2.4],collect=[4.2,7.1,8.5];let s='';
    const left=xs.filter((_,i)=>t<collect[i]+.5).length;
    xs.forEach((x,i)=>{const exit=ramp(t,ends[i]-.3,ends[i]),gone=ramp(t,collect[i],collect[i]+.5),r=27*(1-gone);
      if(r>0){s+=circle(x,100,r,exit?colors.amber:colors.purple,exit?'#191820':'#383045');if(!exit)s+=ring(x,100,35,ramp(t,0,ends[i]));}
      s+=text(x,52,String.fromCharCode(65+i),14,colors.muted);
      if(t>=ends[i]&&t<2.8)s+=packet(t,ends[i],2.8,x,135,320,250,colors.purple,4);
      if(t>=collect[i]&&t<collect[i]+.5)s+=packet(t,collect[i],collect[i]+.5,x,100,320,302,colors.amber);
    });
    s+=circle(320,324,27)+text(320,383,'Parent',14);
    if(t>=1.6){s+=circle(320,252,17,colors.purple,'#30263f')+text(320,258,'1',17)+text(389,257,'notice',13,colors.muted);}
    if(t>=2.8)s+=text(320,177,`${left} waiting for cleanup`,16,left?colors.amber:colors.green);
    if(t>=9)s+=text(320,331,'✓',22,colors.green);
    return {svg:s,cue:t<1.6?'Filled circles are working children.':t<2.8?'Three finish, leaving hollow exit records and one pending notice.':t<4.7?'One notice starts cleanup. One wait collects one record.':t<7.1?'Two records remain. One wait was not enough.':t<9?'Keep collecting ready records until none remain.':'One notification; all three records collected.',phase:t<1.6?0:t<2.8?1:t<7.1?2:t<7.6?3:t<9?4:5,remaining:left};
  }
  const studies=[
    {id:'A04',title:'Two handles. One connection.',intro:'Watch the lines: each is a handle keeping the socket open.',source:'Python Tutor',url:'https://pythontutor.com/',credit:'Borrowed technique: explicit links to one shared object. This is our animated adaptation, not Python Tutor’s interface.',model:shared,old:t=>{const m=Part3Models.ownership('shared',t>=1.8?1:0);for(const o of m.owners)o.entries[0].open=o.title.startsWith('Parent')?t<4.2:t<7.6;m.resources[0].count=m.owners.filter(o=>o.entries[0].open).length;return Animations.relationshipMap(m);},note:'The lines represent server handles, not network wires. The reply and stream-ending mark use the socket-to-browser line. Timing is stretched; the close behavior was checked in the retained-handle TCP probe.'},
    {id:'A05',title:'The parent keeps the door open.',intro:'Dots are requests. Growing rings show work in progress.',source:'RaftScope',url:'https://raft.github.io/raftscope/index.html',credit:'Borrowed technique: moving messages among stable process locations. Request handoff and worker creation are our adaptation, not Raft behavior.',model:workers,old:t=>Animations.stageFlow({actors:[{label:'PARENT',title:'Accept requests',detail:t<1.2?'A arrives':t<3.3?'Give A to a child; take B':'Available for new arrivals',active:true},...(t>=2?[{label:'CHILD A',title:t<8?'Working':'Finished',detail:t<6.6?'Handles A’s request':'Reply sent',active:t<8}]:[]),...(t>=4.1?[{label:'CHILD B',title:t<9.6?'Working':'Finished',detail:t<7.9?'Handles B’s request':'Reply sent',active:t<9.6}]:[])],history:[workers(t).cue]}),note:'This is a responsibility diagram. Dots mark requests being assigned, not literal TCP packet routes. Replies bypass the parent. Worker cleanup is covered separately; scheduling and durations are illustrative.'},
    {id:'A06',title:'One notice can leave work behind.',intro:'Filled circles work. Hollow circles are finished children awaiting collection.',source:'Mike Bostock · Visualizing Algorithms',url:'https://bost.ocks.org/mike/algorithms/#shuffling',credit:'Borrowed technique: individual items visibly change membership as an algorithm progresses. The notification and cleanup sequence is our adaptation.',model:cleanup,old:t=>Animations.recordLedger({records:[1.6,2,2.4].map((end,i)=>({label:'Child '+String.fromCharCode(65+i),state:t<[4.7,7.6,9][i]?(t<end?'running':'ready'):'collected',title:t<[4.7,7.6,9][i]?(t<end?'Still running':'Exited · uncollected'):'Status collected',detail:''})),notice:{label:'Notice count',value:t<1.6?'0':'1'},result:cleanup(t).cue}),note:'This shows a possible coalesced-signal case: three child exits occur before notification handling. One pending notice is not an exit count. The first wait leaves two records; continuing the nonblocking loop collects them. Verified with the three-child probe.'}
  ];
  let selected=0,time=0,playing=false,frame=0,last=0,compare=false,expanded=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,$=s=>document.querySelector(s);
  function stop(){playing=false;cancelAnimationFrame(frame);}
  function mount(){stop();const s=studies[selected];$('#app').innerHTML=`<div class="eyebrow">ANIMATION VARIATIONS / 04–06</div><h1>See the mechanism move.</h1><p class="intro">Three ten-second studies. Try the motion, then compare the original.</p><div class="study-tabs">${studies.map((x,i)=>`<button data-study="${i}" class="${selected===i?'selected':''}">${x.id.slice(1)} · ${['Shared handles','Parallel work','Cleanup'][i]}</button>`).join('')}</div><section class="study-shell"><h2>${s.title}</h2><div class="study-wink"><button id="study-wink" aria-label="${expanded?'Close':'Open'} Wink’s explanation" aria-expanded="${expanded}"><svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#F5F0FF"/><ellipse cx="38" cy="45" rx="6" ry="9" fill="#4B3869"/><path d="M59 43 Q67 55 75 43" fill="none" stroke="#4B3869" stroke-width="3"/></svg></button><p id="study-cue">${s.intro}</p></div><div class="study-details" id="study-detail" ${expanded?'':'hidden'}><p>${s.note}</p><p>${s.credit} <a href="${s.url}" target="_blank" rel="noreferrer">Study the source ↗</a></p></div><div class="study-views ${compare?'comparing':''}"><div class="study-new"><div class="study-label">VARIATION · MOTION</div><svg id="study-svg" viewBox="${selected===1?'0 0 550 410':'80 0 480 410'}" role="img" aria-label="${s.title}"></svg></div>${compare?'<div class="study-old"><div class="study-label">ORIGINAL · TEXT AND BOXES</div><div id="study-original"></div></div>':''}</div><div class="study-controls"><button id="study-play" class="primary">Play 10 seconds</button><button id="study-step">Step +</button><button id="study-reset" aria-label="Restart study">↺</button><input id="study-scrub" type="range" min="0" max="1000" value="${time*100}" aria-label="Study timeline"><span id="study-time"></span></div><label class="study-compare"><input type="checkbox" id="study-compare" ${compare?'checked':''}> Compare with original pattern</label><p class="study-note">Schematic playback · ${s.id} alternative · ${reduced?'Reduced motion: advance manually.':'Pause or scrub any moment.'}</p></section><p class="study-review">After one viewing: can you explain what stayed open, what overlapped, or what remained to clean up?</p>`;
    document.querySelectorAll('[data-study]').forEach(b=>b.onclick=()=>{selected=+b.dataset.study;time=0;expanded=false;mount();});
    $('#study-play').onclick=play;$('#study-step').onclick=()=>{stop();time=Math.min(10,time+1);draw();};$('#study-reset').onclick=()=>{stop();time=0;draw();};$('#study-scrub').oninput=x=>{stop();time=+x.target.value/100;draw();};$('#study-compare').onchange=x=>{compare=x.target.checked;mount();};$('#study-wink').onclick=()=>{expanded=!expanded;stop();$('#study-detail').hidden=!expanded;$('#study-wink').setAttribute('aria-expanded',String(expanded));$('#study-wink').setAttribute('aria-label',`${expanded?'Close':'Open'} Wink’s explanation`);draw();};draw();
  }
  function draw(){if(!$('#study-svg'))return;const s=studies[selected],result=s.model(time);$('#study-svg').innerHTML=result.svg;$('#study-cue').textContent=time===0?s.intro:result.cue;$('#study-time').textContent=time.toFixed(1)+' / 10 s';$('#study-scrub').value=Math.round(time*100);$('#study-play').textContent=playing?'Pause':time===10?'Replay':reduced?'Next second':time?'Continue':'Play 10 seconds';$('#study-step').disabled=time===10;if(compare)$('#study-original').innerHTML=s.old(time);}
  function play(){if(playing){stop();draw();return;}if(time===10)time=0;if(reduced){time=Math.min(10,time+1);draw();return;}playing=true;if(time===0)time=.1;last=performance.now();draw();frame=requestAnimationFrame(tick);}
  function tick(now){time=Math.min(10,time+(now-last)/1000);last=now;if(time===10)playing=false;draw();if(playing)frame=requestAnimationFrame(tick);}
  return {mount,stop,models:{shared,workers,cleanup}};
})();
