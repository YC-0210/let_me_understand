const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{},Animations:{esc:s=>String(s)},matchMedia:()=>({matches:false})};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('experiment/web/motion-studies.js','utf8'),ctx);
const M=ctx.window.MotionStudies.models;
assert.equal(M.shared(0).handles,1);assert.equal(M.shared(3).handles,2);assert.equal(M.shared(5).handles,1);assert.equal(M.shared(10).handles,0);
assert.equal(M.cleanup(3).remaining,3);assert.equal(M.cleanup(5).remaining,2);assert.equal(M.cleanup(8).remaining,1);assert.equal(M.cleanup(10).remaining,0);
for(const f of Object.values(M))for(let i=0;i<=100;i++){const v=f(i/10);assert.ok(v.cue.length);assert.ok(!/NaN|undefined/.test(v.svg));}
console.log('Three motion models pass 303 timeline samples; handle and cleanup transitions verified.');
const {tourState,tours}=ctx.window.MotionStudies;
for(const points of tours){
 assert.equal(tourState(9.99,points).step,0);
 assert.equal(tourState(10,points).travel,true);
 assert.equal(tourState(10.5,points).remaining,10);
 assert.equal(tourState(11,points).remaining,10);
 assert.equal(tourState(20.99,points).step,1);
 assert.equal(tourState(21,points).travel,true);
 const end=10+(points.length-1)*11;
 assert.equal(tourState(end-.01,points).done,false);
 assert.equal(tourState(end,points).done,true);
}
console.log('Every tour holds each arrival for ten seconds, with separate one-second travel.');
