/* One shared whiteboard renderer for the lesson and standalone animation players. */
window.StateBoard = (() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const wink = '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="currentColor"/><ellipse cx="23" cy="28" rx="3" ry="5" fill="#23202e"/><path d="M36 29q7-9 13 0M27 43q6 5 12-1" fill="none" stroke="#23202e" stroke-width="3" stroke-linecap="round"/></svg>';
  const icon = name => `<svg class="icon" viewBox="0 0 256 256" aria-hidden="true">${MoneyIcons[name] || MoneyIcons.bank}</svg>`;
  function render(step, target) {
    if(step.entries) {
      target.innerHTML = `<p class="board-note">Changes in this transaction · <span id="entry-state">entries appear one at a time</span></p><div class="accounts">${step.parties.map((party,p)=>`<section class="account" aria-label="${escape(party)} T-account"><h2>${escape(party)}</h2><div class="sides">${['a','l'].map(side=>`<div class="side"><h3>${side==='a'?'Assets':'Liabilities'}</h3>${step.entries.map((entry,i)=>entry.party===p&&entry.side===side?`<div class="entry pending" data-entry="${i}" aria-hidden="true"><span class="entry-wink">${wink}</span><span>${escape(entry.label)}</span><strong>${escape(entry.amount)}</strong></div>`:'').join('')}</div>`).join('')}</div></section>`).join('')}</div><p class="caption">${step.id==='rediscount'?'Illustrative $99 sale · $100 face value':escape(step.caption)}</p>`;
    } else if(step.primer) {
      target.innerHTML = `<section class="account primer"><h2>Your two-sided record</h2><div class="sides"><div class="side"><h3>Assets</h3>${icon('wallet')}<p>What you hold<br>or are owed</p></div><div class="side"><h3>Liabilities</h3>${icon('scroll')}<p>What you owe</p></div></div></section>`;
    } else if(step.chart) {
      const rows=step.chart==='reserves'?[['Lawful money in own bank',199.6,'coins'],['Due from reserve agents',226.7,'bank'],['Redemption fund',17.2,'vault']]:[['Starting reserve · historical table',221.3,'vault'],['After hypothetical $50m withdrawal',171.3,'vault']];
      target.innerHTML = `<figure class="chart"><figcaption>${step.chart==='reserves'?'Country-bank reserves · $443.5m total':'New York banks’ total reserves'}<small>Millions of dollars · linear scale from zero</small></figcaption>${rows.map(([label,value,ico],i)=>`<div class="bar-row" data-focus="${i}"><div class="bar-label">${icon(ico)}<span>${label}</span><strong>${value.toFixed(1)}</strong></div><div class="bar-track"><div class="bar" style="width:${value/250*100}%"></div></div></div>`).join('')}<div class="scale"><span>0</span><span>250 million</span></div><p class="caption">${step.chart==='reserves'?'Historical Table 35.1 · observation date not stated':'Historical starting value + illustrative withdrawal'}<br>Mehrling · National Banking System, Before the Fed</p></figure>`;
    } else if(step.stat) {
      target.innerHTML = `<figure class="stat">${icon('money')}<strong>${escape(step.stat.value)}</strong><figcaption>${escape(step.stat.label)}</figcaption><a href="${escape(step.stat.url)}" target="_blank" rel="noreferrer">${escape(step.stat.source)} ↗</a></figure>`;
    } else {
      target.innerHTML = `<div class="story-flow">${step.nodes.map(([ico,label],i)=>`<div class="story-node" data-focus="${i}"><span class="node-wink">${wink}</span>${icon(ico)}<strong>${escape(label)}</strong></div>${i<step.nodes.length-1?'<span class="flow-arrow" aria-hidden="true">→</span>':''}`).join('')}</div>`;
    }
  }
  function update(step,target,revealed) {
    if(!step.entries)return step.words;
    const count=Math.max(0,Math.min(step.entries.length,revealed));
    const active=count-1;
    target.querySelectorAll('[data-entry]').forEach((row,i)=>{
      const n=Number(row.dataset.entry), visible=n<count;
      row.classList.toggle('pending',!visible);row.classList.toggle('active',visible&&n===active);
      row.setAttribute('aria-hidden',String(!visible));
    });
    target.querySelector('#entry-state').textContent=count<step.entries.length?'entries in progress':'transaction complete';
    return count?step.entries[active].words:step.words;
  }
  return {render,update,wink,escape};
})();
