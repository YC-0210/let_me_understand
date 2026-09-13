/* Reusable renderers: lesson-independent inputs; no teaching copy or topic logic. */
window.Animations = (() => {
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function comparisonBars({labels,values,unit,maximum,singularUnit=unit}) {
  const max=maximum||Math.max(...values,1);
  return `<div class="bar-chart">${labels.map((l,i)=>`<div class="bar-row"><div class="bar-label"><span>${esc(l)}</span><b>${esc(values[i])} ${esc(values[i]===1?singularUnit:unit)}</b></div><div class="bar-track"><div class="bar-fill tone-${i}" style="width:${Math.min(100,100*values[i]/max)}%"></div></div></div>`).join('')}</div>`;
 }
 function timeline({events,time,duration,lanes=['A','B']}) {
  const pct=t=>Math.max(0,Math.min(100,100*t/duration));
  return `<div class="timeline">${lanes.map(who=>{
    let event=k=>events.find(e=>e.who===who&&e.kind===k)?.time;
    let request=event('request'),answer=event('answer'),close=event('close');
    const status=time<request?'Not arrived':time<answer?'Waiting for answer':time<close?'Answer received · still open':'Connection closed';
    return `<div class="lane"><div class="lane-label"><b>Person ${who}</b><span>${status}</span></div><div class="lane-track"><div class="cursor" style="left:${pct(time)}%"></div>${time>=request?`<div class="interval waiting" style="left:${pct(request)}%;width:${pct(Math.min(time,answer))-pct(request)}%"></div><span class="event-dot request-dot" title="Request arrives" style="left:${pct(request)}%"></span>`:''}${time>=answer?`<div class="interval occupied" style="left:${pct(answer)}%;width:${pct(Math.min(time,close))-pct(answer)}%"></div><span class="event-dot answer-dot" title="Answer received" style="left:${pct(answer)}%"></span>`:''}${time>=close?`<span class="close-dot" title="Connection closes" style="left:${pct(close)}%">×</span>`:''}</div></div>`;
  }).join('')}<div class="axis"><span>0 seconds</span><span>${duration.toFixed(1)} seconds</span></div></div>`;
 }
 function candidateStrip({items,trace,index}) {
  const visited=trace.slice(0,index),last=visited.at(-1);
  return `<div class="candidate-strip">${items.map((value,i)=>{
   const seen=visited.some(s=>s.index===i),excluded=last&&!last.found&&(i<last.remaining[0]||i>last.remaining[1]) || last?.found&&i!==last.index;
   return `<div class="candidate ${excluded?'excluded':''} ${last?.index===i?'current':''} ${last?.found&&last.index===i?'found':''}" aria-label="Position ${i+1}: ${seen?value:'hidden'}${excluded?', excluded':''}"><small>${i+1}</small><strong>${seen?value:'?'}</strong><span>${last?.found&&last.index===i?'found':excluded?'out':seen?'checked':'possible'}</span></div>`;
  }).join('')}</div>`;
 }
 return {comparisonBars,timeline,candidateStrip,esc};
})();
