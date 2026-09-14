const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..');const box={window:{}};vm.createContext(box);
for(const f of ['data.js','animations.js','part3-renderers.js','part3-models.js'])vm.runInContext(fs.readFileSync(path.join(root,'experiment/web',f),'utf8'),box);
const D=box.window.LIBRARY_DATA,M=box.window.Part3Models,A=box.window.Animations;
const shared=M.ownership('shared',1);assert.equal(shared.resources.find(r=>r.title==='Connection A').count,2);
assert.equal(M.ownership('close-copies',1).resources.find(r=>r.title==='Connection A').count,1);
assert.equal(M.ownership('close-copies',3).resources.find(r=>r.title==='Connection A').count,0);
assert.equal(M.ownership('missing-close',2).resources.find(r=>r.title==='Connection A').count,1);
assert.equal(M.ownership('missing-close',3).resources.find(r=>r.title==='Connection A').count,0);
const burst=M.records('burst',2,D.part3_evidence);assert.equal(burst.notice.value,'1');assert.equal(burst.records.filter(x=>x.state==='ready').length,2);
assert.equal(M.records('drain',3,D.part3_evidence).records.filter(x=>x.state==='ready').length,0);
assert.equal(M.records('not-ready',1,D.part3_evidence).records[0].state,'running');
let rendered=0;
for(const s of D.lessons.find(p=>p.id==='server').steps){
 for(let n=0;n<s.frames.length;n++){
  const cap=s.visual_requirements[0];if(cap==='compare-amounts')continue;
  const input=cap==='show-stages'?M.stage(s.scene,n,D.part3_evidence):cap==='show-ownership'?M.ownership(s.scene,n):M.records(s.scene,n,D.part3_evidence);
  const c=D.animation.find(c=>c.capabilities.includes(cap));const html=A[c.renderer](input);
  assert.ok(html.length>50);assert.ok(!html.includes('undefined'));rendered++;
 }
}
console.log(`Ownership and cleanup invariants pass; ${rendered} authored visual states render without undefined values.`);
