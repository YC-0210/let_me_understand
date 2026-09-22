const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const M=require('../interest-rate/model.js');
assert.equal(M.total(100,2),102);
assert.equal(M.total(100,0),100);
assert.equal(M.total(100,5),105);
assert(Math.abs(M.overnightInterest(1000,5)-0.1369863)<1e-6);
assert(Math.abs(M.yieldForPrice(100)-5)<1e-9);
assert(M.yieldForPrice(102)<M.yieldForPrice(100));
assert.equal(M.loanRate(3,1.8,.2),5);
assert.deepEqual(M.travel([0,0],[400,0],1000),[100,0]);
assert.deepEqual(M.travel([0,0],[200,0],1000),[100,0]);
assert.deepEqual(M.travel([0,0],[200,0],9000),[200,0]);
const ctx={window:{},InterestModel:M};vm.createContext(ctx);
for(const file of ['icons.js','plan.js','render.js']){
 vm.runInContext(fs.readFileSync(require.resolve('../interest-rate/'+file),'utf8'),ctx);
 if(file==='icons.js')ctx.MoneyIcons=ctx.window.MoneyIcons;
}
const plan=ctx.window.InterestPlan;
assert.equal(plan.length,25);
assert.equal(new Set(plan.map(s=>s.id)).size,plan.length);
for(const step of plan){
 assert(step.sourceTime<=497);
 assert(step.cue.split(/\s+/).length<=35);
 for(const time of [0,1000,3000,6000]){
  const svg=ctx.window.InterestRender.render(step,time,{});
  assert(!/NaN|undefined|Infinity/.test(svg),step.id);
  assert(svg.includes('Wink points here'),step.id);
 }
}
console.log('Interest-rate math, fixed-speed motion, 25 scenes and source cutoff passed.');
