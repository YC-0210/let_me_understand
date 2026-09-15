const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const box={window:{}};vm.createContext(box);
for(const f of ['data.js','animations.js','course-overview.js'])vm.runInContext(fs.readFileSync(`experiment/web/${f}`,'utf8'),box);
const O=box.window.CourseOverview,D=box.window.LIBRARY_DATA,course=D.lessons.find(x=>x.id==='server');
assert.equal(Object.keys(O.maps).length,course.chapters.length);
for(const s of course.steps){
 for(let n=0;n<Math.max(1,s.frames.length);n++){
  const state=O.state(s.chapter,s.scene,n,0);
  assert.ok(state.active>=0&&state.active<O.maps[s.chapter].nodes.length);
  for(const expanded of [true,false])assert.ok(!/undefined|NaN/.test(O.render(s.chapter,s.scene,n,0,expanded)));
 }
}
assert.deepEqual([0,1,2,3].map(n=>O.state('connect','setup',n,0).active),[0,0,1,2]);
assert.equal(O.state('connect','accept',1,0).active,3);
assert.equal(O.state('copies','missing-close',2,0).warning,'Parent handle still open');
assert.equal(O.state('children','wait',1,0).warning,'Blocking here');
assert.equal(O.state('burst','drain',2,0).detail,'2 of 3 collected');
assert.equal(O.state('burst','not-ready',1,0).active,4);
assert.ok(O.maps.fork.edges.some(([a,b])=>a===1&&b===2));
assert.ok(O.maps.fork.edges.some(([a,b])=>a===1&&b===3));
console.log('Eight chapter maps cover every step; setup order, branches, loop counts, and exceptions pass.');
