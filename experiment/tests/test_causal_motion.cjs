const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},URLSearchParams,location:{search:''}};vm.createContext(ctx);
for(const f of ['intuition-plan-original.js','intuition-plan.js','causal-motion.js'])vm.runInContext(fs.readFileSync(`${__dirname}/../web/${f}`,'utf8'),ctx);
const {stateAt,render}=ctx.window.CausalMotion;
let count=0;
for(const [chapter,c] of ctx.window.IntuitionPlan.entries())for(const beat of c.beats)for(let i=0;i<=100;i++){
  const p=i/100,s=stateAt(beat.mode,p,chapter);
  assert.equal(s.handles,Number(s.parentHandle>0)+Number(s.childHandle>0));
  assert.ok(s.connection||s.handles===0,'No closed connection with retained handle');
  assert.ok(s.remaining>=0&&s.remaining<=3);
  assert.ok(s.records.every(r=>r.appear>=0&&r.appear<=1&&r.take>=0&&r.take<=1));
  for(const width of [340,810]){
    const svg={clientWidth:width,dataset:{},setAttribute(){},parentElement:{querySelector(){return {style:{}}}}};
    render(svg,beat.mode,p,chapter,beat.title,beat.cue,beat.focus);
    assert.ok(!/NaN|undefined|Infinity/.test(svg.innerHTML));
    assert.match(svg.innerHTML,/<title>/);
  }
  count++;
}
assert.equal(stateAt('fork',0).child,0);assert.equal(stateAt('fork',1).child,1);
assert.equal(stateAt('oneHandle',0).handles,2);assert.equal(stateAt('oneHandle',1).handles,1);
assert.equal(stateAt('oneHandle',1).connection,true);
assert.equal(stateAt('replyOpen',1).reply,1);assert.equal(stateAt('replyOpen',1).connection,true);
assert.equal(stateAt('closed',0,2).handles,1);assert.equal(stateAt('closed',1,2).handles,0);
assert.equal(stateAt('closed',0,3).connection,false);assert.equal(stateAt('closed',0,3).child,1);
assert.equal(stateAt('exited',0).child,1);assert.equal(stateAt('exited',1).child,0);
assert.equal(stateAt('exited',1).remaining,1);
assert.equal(stateAt('burst',1).remaining,3);assert.equal(stateAt('burst',1).bell,1);
assert.deepEqual([0,.3,.55,.8,1].map(p=>stateAt('drain',p).remaining),[3,2,1,0,0]);
assert.equal(stateAt('reapOne',1).remaining,2);assert.equal(stateAt('wholeReap',1).remaining,0);
assert.equal(stateAt('ready',1).handles,0);
console.log(`${count} timeline samples, both layouts: causal invariants and finite SVG geometry pass.`);

assert.equal(stateAt('records',0).remaining,1,'A survives the previous exit moment');
assert.equal(stateAt('burst',0).remaining,1,'A survives the previous notice moment');
