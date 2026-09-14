/* Domain-independent animation library additions. */
Object.assign(window.Animations, {
  relationshipMap({owners, resources}) {
    const e=window.Animations.esc;
    return `<div class="ownership"><div class="owner-grid">${owners.map(o=>`<section class="owner ${o.inactive?'inactive':''}"><h3>${e(o.title)}</h3><p class="micro">${e(o.subtitle||'Own list of numbered handles')}</p>${o.entries.map(x=>`<div class="handle ${x.open?'open':'closed'}"><code>${e(x.label)}</code><span>${x.open?'→':'×'}</span><span>${e(x.target)}</span><small>${x.open?'open':'closed'}</small></div>`).join('')}</section>`).join('')}</div><div class="resource-grid">${resources.map(r=>`<div class="resource ${r.count?'':'released'}"><div class="eyebrow">ONE SHARED RESOURCE</div><b>${e(r.title)}</b><span class="resource-count">${r.count}</span><small>open server ${r.count===1?'handle':'handles'}</small><p>${e(r.detail)}</p></div>`).join('')}</div></div>`;
  },
  stageFlow({actors,history}) {
    const e=window.Animations.esc;
    return `<div class="actor-grid">${actors.map(a=>`<div class="actor ${a.active?'active':''}"><div class="eyebrow">${e(a.label)}</div><h3>${e(a.title)}</h3><p>${e(a.detail)}</p></div>`).join('')}</div><ol class="event-history">${history.map((h,i)=>`<li class="${i===history.length-1?'current-event':''}"><span>${i+1}</span>${e(h)}</li>`).join('')}</ol>`;
  },
  recordLedger({records,notice,result}) {
    const e=window.Animations.esc;
    return `<div class="notice"><span>${e(notice.label)}</span><strong>${e(notice.value)}</strong></div><div class="record-grid">${records.map(r=>`<div class="record ${e(r.state)}"><small>${e(r.label)}</small><b>${e(r.title)}</b><p>${e(r.detail)}</p></div>`).join('')}</div><div class="ledger-result">${e(result)}</div>`;
  }
});
