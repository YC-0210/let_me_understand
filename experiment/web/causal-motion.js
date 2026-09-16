/* Original browser adaptation. Deterministic geometry, not Manim playback. */
window.CausalMotion = (() => {
  const clamp=x=>Math.max(0,Math.min(1,x));
  const phase=(p,a,b)=>clamp((p-a)/(b-a));
  const ease=x=>x*x*(3-2*x);
  const mix=(a,b,t)=>a+(b-a)*t;
  const at=(a,b,t)=>[mix(a[0],b[0],t),mix(a[1],b[1],t)];
  const C={network:'#70d9e2',process:'#baa3ff',access:'#ffbf82',status:'#ece5ce',notice:'#f6d66c',app:'#92dfb2',muted:'#85899e',bg:'#11151e'};
  const early=['request','application','response','simple'];
  function stateAt(mode,p,chapter=0){
    p=clamp(p);
    const s={mode,p,child:0,parentHandle:0,childHandle:0,connection:true,reply:0,records:[],bell:0,exit:0,collect:0,listener:!early.includes(mode),status:'',work:0,accept:0};
    const work=['fork','roles','twoHandles','oneHandle','replyOpen','closed','wholeWork','wholeClose'];
    if(work.includes(mode)){s.child=1;s.childHandle=1;}
    if(['fork','twoHandles','wholeWork','wholeClose'].includes(mode))s.parentHandle=1;
    if(['request','simple','busy'].includes(mode))s.work=phase(p,.25,.85);
    if(mode==='request')s.status=p<.7?'One request crosses the connection':'Request received by the server';
    if(mode==='application')s.status=p<.45?'Server calls the application through WSGI':'The application returns response data';
    if(mode==='response'){s.reply=phase(p,.12,.85);s.status=p<.85?'The response follows the same connection back':'A receives the HTTP response';}
    if(mode==='simple')s.reply=phase(p,.45,.9);
    if(mode==='simple')s.status='Same exchange · a fixed reply replaces the application';
    if(mode==='busy')s.status='A keeps the handler busy · B remains at the doorway';
    if(['fork','wholeWork'].includes(mode)){s.child=ease(phase(p,.18,.65));s.childHandle=s.child;s.work=phase(p,.6,1);s.accept=mode==='wholeWork'?phase(p,.7,1):0;s.status=p<.65?'Copy access; separate the two processes':'Child handles A · parent can accept another visitor';}
    if(mode==='roles'){s.parentHandle=1;s.work=phase(p,.1,.95);s.accept=phase(p,.25,.85);s.status='Two responsibilities can progress independently';}
    if(mode==='twoHandles')s.status='Two handles → ONE underlying socket';
    if(mode==='oneHandle'){s.parentHandle=1-ease(phase(p,.2,.65));s.status=p<.65?'Parent releases only its own handle':'One handle remains · connection stays open';}
    if(mode==='replyOpen'){s.reply=phase(p,.12,.7);s.status=p<.7?'Child sends the response':'Response received ≠ connection ended';}
    if(mode==='closed'){s.reply=1;s.childHandle=chapter===3?0:1-ease(phase(p,.2,.65));s.connection=s.childHandle>0;s.status=s.connection?'Release the last remaining handle':'Socket responsibility complete · child has not exited';}
    if(mode==='wholeClose'){s.parentHandle=1-ease(phase(p,.08,.3));s.reply=phase(p,.28,.62);s.childHandle=1-ease(phase(p,.68,.9));s.connection=s.childHandle>0;s.status=p<.3?'Parent releases its copy':p<.68?'Child sends the response':'Last handle released → connection can end';}
    if(['exited','records','reapOne','notice','burst','drain','wholeReap','ready'].includes(mode)){s.connection=false;s.reply=1;s.exit=1;}
    if(mode==='exited'){s.exit=ease(phase(p,.12,.6));s.child=1-s.exit;s.records=[{id:'A',appear:phase(p,.5,.8),take:0}];s.status=p<.6?'Running work stops':'Exit status survives the running process';}
    if(['records','burst','drain'].includes(mode))s.records=['A','B','C'].map((id,i)=>({id,appear:mode==='drain'||i===0?1:phase(p,.08+i*.2,.25+i*.2),take:mode==='drain'?ease(phase(p,.12+i*.23,.29+i*.23)):0}));
    if(['notice','wholeReap'].includes(mode))s.records=[{id:'A',appear:mode==='wholeReap'?phase(p,.1,.3):1,take:['reapOne','wholeReap'].includes(mode)?ease(phase(p,mode==='wholeReap'?.55:.25,mode==='wholeReap'?.85:.75)):0}];
    if(mode==='records')s.status='Different children exit · their uncollected statuses accumulate';
    if(mode==='reapOne'){s.records=['A','B','C'].map((id,i)=>({id,appear:1,take:i===0?ease(phase(p,.25,.75)):0}));s.status=p<.75?'waitpid collects A’s retained status':'A collected · B and C still retained';}
    if(['notice','burst','drain','wholeReap'].includes(mode))s.bell=mode==='drain'?(p<.12?1:0):phase(p,mode==='wholeReap'?.3:.12,mode==='wholeReap'?.45:.3);
    if(mode==='notice')s.status='Notification draws attention · the result stays in the sheet';
    if(mode==='burst')s.status='Three ready statuses · one pending notification can suffice';
    if(mode==='drain')s.status=p<.82?'Check → collect one → check again':'No more ready statuses · return without waiting for D';
    if(mode==='wholeReap'){s.exit=ease(phase(p,.05,.3));s.child=1-s.exit;}
    if(mode==='wholeReap')s.status=p<.3?'Child exits; its status remains':p<.55?'SIGCHLD prompts a check':p<.85?'Parent collects the status':'Parent continues accepting visitors';
    if(mode==='ready'){s.accept=phase(p,.1,.8);s.status='Work delegated · access released · status collected';}
    s.handles=Number(s.parentHandle>0)+Number(s.childHandle>0);
    s.remaining=s.records.filter(r=>r.appear>0&&r.take<1).length;
    return s;
  }
  function render(svg,mode,p,chapter,title,cue,focus){
    const narrow=svg.clientWidth<550,w=narrow?440:900;
    const statusScene=['exited','records','reapOne','notice','burst','drain','wholeReap','ready'].includes(mode);
    const h=narrow?(statusScene?680:520):(early.includes(mode)?410:470);
    const pos=narrow?{browser:[62,112],socket:[212,112],parent:[285,265],child:[285,415],listener:[78,275],browserB:[78,385],notice:[350,560],record:[75,555]}:{browser:[75,175],socket:[265,175],parent:[550,125],child:[550,310],listener:[265,360],browserB:[75,360],notice:[805,405],record:[785,120]};
    const s=stateAt(mode,p,chapter),pw=narrow?190:245,ph=98;
    const esc=t=>String(t).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
    let out='';
    const text=(x,y,t,c=C.muted,size=14)=>`<text x="${x}" y="${y}" fill="${c}" style="font-size:${size}px;fill:${c}">${esc(t)}</text>`;
    const line=(a,b,c=C.network,opacity=1,dash='')=>`<path d="M${a} L${b}" fill="none" stroke="${c}" stroke-width="2" opacity="${opacity}" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
    const circle=(a,r,c,opacity=1)=>`<circle cx="${a[0]}" cy="${a[1]}" r="${r}" stroke="${c}" fill="${C.bg}" stroke-width="2" opacity="${opacity}"/>`;
    const group=(a,body,opacity=1)=>`<g transform="translate(${a})" opacity="${opacity}">${body}</g>`;
    const packet=(a,label,c=C.network)=>group(a,`<rect x="-15" y="-10" width="30" height="20" rx="3" fill="${C.bg}" stroke="${c}" stroke-width="2"/><path d="M-15-10L0 1L15-10" fill="none" stroke="${c}"/>${text(0,-20,label,c,12)}`);
    const browser=(a,name,received=false)=>group(a,`<rect x="-30" y="-26" width="60" height="52" rx="5" fill="${C.bg}" stroke="${C.network}" stroke-width="2"/><path d="M-30-13H30" stroke="${C.network}"/>${text(0,7,received?'✓':'···',C.network,20)}${text(0,49,name,C.network,14)}`);
    const proc=(a,label,sub,activity=0,opacity=1)=>group(a,`<rect x="${-pw/2}" y="-49" width="${pw}" height="${ph}" rx="9" fill="#1b1b2e" stroke="${C.process}" stroke-width="2"/><path d="M${-pw/2+12}-34l6 5-6 5m12 0h10" fill="none" stroke="${C.process}" stroke-width="2"/>${text(10,-24,label,C.process,16)}${text(0,2,sub,'#dddcec',13)}<path d="M${-pw/2+16} 28H${pw/2-16}" stroke="#353044" stroke-width="5"/><path d="M${-pw/2+16} 28h${(pw-32)*activity}" stroke="${C.process}" stroke-width="5"/>`,opacity);
    const sheet=(a,id,opacity=1)=>group(a,`<path d="M-21-28H9L21-16V28H-21ZM9-28V-16H21" fill="${C.bg}" stroke="${C.status}" stroke-width="2"/><path d="M-11-5H11M-11 4H11" stroke="${C.status}"/>${text(0,20,id,C.status,14)}${text(0,47,'Exit '+id,C.status,13)}`,opacity);
    
    // The network is a continuous track until the final handle is gone.
    out+=line([pos.browser[0]+31,pos.browser[1]],[pos.socket[0]-24,pos.socket[1]],C.network,s.connection?1:.16);
    out+=browser(pos.browser,'Browser A',s.reply>=1);
    out+=group(pos.socket,`<g opacity="${s.connection?1:.3}"><path d="M-8-23V-12M8-23V-12M-17-12H17V0a17 17 0 0 1-34 0ZM0 17v12" fill="${C.bg}" stroke="${C.network}" stroke-width="2.5"/></g>${text(0,51,'A’s socket',C.network)}${text(0,72,s.connection?(s.handles?`${s.handles} open handle${s.handles===1?'':'s'}`:'connected'):'connection ended',s.connection?C.access:C.muted,12)}`);
    if(s.listener){
      if(narrow)out+=line([pos.browserB[0],pos.browserB[1]-26],[pos.listener[0],pos.listener[1]+25],C.network,.45);
      if(!narrow)out+=line([pos.browserB[0]+30,pos.browserB[1]],[pos.listener[0]-25,pos.listener[1]],C.network,.5);
      out+=browser(pos.browserB,'Browser B');
      out+=group(pos.listener,`<path d="M-20 23V-25H20V23M-28 23H28M-9 23V-13H9V23" fill="none" stroke="${C.network}" stroke-width="2"/>${text(0,narrow?-39:47,'Listening socket',C.network,13)}`);
      if(mode==='busy')out+=text(pos.browserB[0],pos.browserB[1]+70,'waiting',C.notice,14);
      if(s.accept>0){const end=[pos.parent[0]-pw/2,pos.parent[1]];out+=line(pos.listener,end,C.network,.3,'4 5');out+=packet(at(pos.listener,end,s.accept),'B');}
    }
    // Ownership is separate geometry from the network path: two branches, one endpoint.
    const childPos=['fork','wholeWork'].includes(mode)?at(pos.parent,pos.child,s.child):pos.child;
    const handle=(owner,amount,anchor)=>{
      if(amount<=0)return;
      const start=[anchor[0]+(narrow?pw/2:-pw/2),anchor[1]+16],end=[pos.socket[0]+22,pos.socket[1]];
      const lane=owner==='parent'?405:425;
      const points=narrow?[start,[lane,start[1]],[lane,owner==='parent'?112:82],[end[0],owner==='parent'?112:82],end]:[start,end];
      const lengths=points.slice(1).map((point,i)=>Math.hypot(point[0]-points[i][0],point[1]-points[i][1]));
      const total=lengths.reduce((a,b)=>a+b,0);
      const pointAt=t=>{let left=t*total;for(let i=0;i<lengths.length;i++){if(left<=lengths[i])return at(points[i],points[i+1],lengths[i]?left/lengths[i]:0);left-=lengths[i];}return end;};
      let distance=amount*total,path=`M${start}`;
      for(let i=0;i<lengths.length;i++){if(distance>=lengths[i]){path+=` L${points[i+1]}`;distance-=lengths[i];}else{path+=` L${at(points[i],points[i+1],lengths[i]?distance/lengths[i]:0)}`;break;}}
      out+=`<path d="${path}" fill="none" stroke="${C.access}" stroke-width="2" opacity="${amount}"/>`;
      const key=pointAt(Math.min(amount,narrow?.17:.28));
      out+=group(key,`<circle cx="-8" cy="0" r="5" fill="${C.bg}" stroke="${C.access}" stroke-width="2"/><path d="M-3 0H14m-5 0v6m5-6v4" stroke="${C.access}" fill="none" stroke-width="2"/>`,amount);

    };
    handle('parent',s.parentHandle,pos.parent);handle('child',s.childHandle,childPos);
    let parentSub=early.includes(mode)?'handle request A':mode==='busy'?'busy with A':mode==='fork'?'fork()':s.records.length?'check child status':'accept next visitor';
    if(mode==='application')parentSub='call application';
    out+=proc(pos.parent,early.includes(mode)?'Server process':'Parent',parentSub,early.includes(mode)||mode==='busy'?s.work:s.accept);
    if(s.child>0)out+=proc(childPos,'Child A',['closed','wholeClose'].includes(mode)&&!s.connection?'socket closed · still running':['exited','wholeReap'].includes(mode)?'exiting':'handle request A',s.work,s.child);
    if(mode==='twoHandles'){
      // A single halo collects both ownership branches without duplicating the socket.
      out+=circle(pos.socket,34+5*Math.sin(p*Math.PI),C.access,.5);
    }
    if(['request','simple','busy'].includes(mode)&&!s.handles){
      const end=[pos.parent[0]-pw/2,pos.parent[1]];out+=line([pos.socket[0]+23,pos.socket[1]],end,C.network,.4);
      if(mode==='request'&&p<.85){const t=ease(phase(p,.1,.8));out+=packet(t<.55?at(pos.browser,pos.socket,t/.55):at(pos.socket,end,(t-.55)/.45),'request');}
      if(mode==='simple'&&p<.9)out+=packet(at(end,pos.browser,ease(phase(p,.45,.9))),'fixed reply');
    }
    if(['application','response'].includes(mode)){
      const a=[pos.parent[0],pos.parent[1]+155],from=[pos.parent[0],pos.parent[1]+49];
      out+=line(from,[a[0],a[1]-36],C.app,.7);
      out+=group(a,`<path d="M-45-32H45L62 0L45 32H-45L-62 0Z" fill="#17251f" stroke="${C.app}" stroke-width="2"/>${text(0,5,'〈 / 〉',C.app,20)}${text(0,57,'Application',C.app,14)}`);
      out+=text(a[0]+(narrow?65:90),a[1]-60,'WSGI',C.app,12);
      if(mode==='application'){const t=phase(p,.1,.9),v=t<.5?at(from,[a[0],a[1]-36],t*2):at([a[0],a[1]-36],from,(t-.5)*2);out+=packet(v,t<.5?'call':'return',C.app);}
    }
    if(s.reply>0&&s.reply<1&&['response','replyOpen','wholeClose'].includes(mode)){
      const origin=mode==='response'?pos.parent:pos.child,waypoint=[pos.socket[0],pos.socket[1]],t=s.reply;
      out+=packet(t<.55?at([origin[0]-pw/2,origin[1]],waypoint,t/.55):at(waypoint,pos.browser,(t-.55)/.45),'response');
    }
    const trayY=narrow?505:62;
    if(['exited','records','reapOne','notice','burst','drain','wholeReap'].includes(mode)){
      out+=text(narrow?160:785,trayY,'RETAINED STATUS',C.status,12);
      s.records.forEach((r,i)=>{
        const target=narrow?[75+i*80,555]:[785,120+i*95];
        const emerging=['exited','wholeReap','records','burst'].includes(mode);
        const origin=['exited','wholeReap'].includes(mode)?pos.child:[target[0],target[1]-25];
        if(['records','burst'].includes(mode)&&r.appear>0&&r.appear<1)out+=group(origin,`<rect x="-27" y="-24" width="54" height="48" rx="5" fill="${C.bg}" stroke="${C.process}"/>${text(0,5,'> '+r.id,C.process,13)}`,1-r.appear);
        const settled=emerging?at(origin,target,ease(r.appear)):target;
        const destination=[pos.parent[0],pos.parent[1]+10];
        out+=sheet(at(settled,destination,r.take),r.id,r.appear*(1-r.take));
      });
      out+=text(narrow?160:785,narrow?635:84,`${s.remaining} ready`,C.status,14);
    }
    if(s.bell>0){
      const a=pos.notice;out+=line(a,[pos.parent[0]+pw/2,pos.parent[1]],C.notice,.3,'3 6');
      out+=group(a,`<path d="M-18 12H18L12 2V-9a12 12 0 0 0-24 0V2ZM-5 19q5 6 10 0" fill="${C.bg}" stroke="${C.notice}" stroke-width="2"/>${text(0,40,'SIGCHLD',C.notice,13)}${text(0,-36,'check',C.notice,12)}`,s.bell);
      out+=circle(a,25+22*phase(p,.35,.8),C.notice,(1-phase(p,.35,.8))*.7);
      if(mode==='burst')s.records.forEach((r,i)=>{if(r.appear>0&&r.appear<1){const from=narrow?[75+i*80,555]:[785,120+i*95];out+=circle(at(from,a,r.appear),4,C.notice);}});
    }
    if(['reapOne','drain','wholeReap'].includes(mode))out+=text(pos.parent[0],pos.parent[1]+73,mode==='drain'?'waitpid(…, WNOHANG)':'waitpid()',C.status,13);
    if(mode==='drain'){
      const a=narrow?[290,415]:pos.child;
      out+=proc(a,'Child D','still running',.2+.45*p);
      out+=text(a[0],a[1]+72,'not ready · do not wait',C.muted,12);
    }
    if(mode==='ready')out+=group(narrow?[250,445]:[565,295],`${text(0,-24,'✓ work delegated',C.process,17)}${text(0,8,'✓ access released',C.access,17)}${text(0,40,'✓ status collected',C.status,17)}`);
    const fp=pos[focus]||pos.parent;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.innerHTML=`<title>${esc(title)}</title><desc>${esc(cue)} ${esc(s.status)}</desc>${out}`;
    svg.dataset.mode=mode;svg.dataset.handles=s.handles;svg.dataset.ready=s.remaining;
    const wink=svg.parentElement.querySelector('#ig-wink');
    wink.style.left=`${Math.max(22,Math.min(svg.clientWidth-22,(fp[0]+(focus==='parent'||focus==='child'?(narrow?-pw/2-20:pw/2+18):40))*svg.clientWidth/w))}px`;
    wink.style.top=`${Math.max(22,(fp[1]-46)*svg.clientWidth/w)}px`;
    return s;
  }
  return {stateAt,render};
})();
