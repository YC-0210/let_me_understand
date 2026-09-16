const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=f=>fs.readFileSync(`${__dirname}/../../${f}`,'utf8');
function load(search){
 const ctx={URLSearchParams,location:{search},window:{Animations:{esc:x=>String(x)}}};vm.createContext(ctx);
 for(const f of ['library/teaching-cs/library.js','experiment/web/intuition-plan-original.js','experiment/web/intuition-plan.js','experiment/web/symbol-families.js','experiment/web/intuition.js'])vm.runInContext(read(f),ctx);
 return ctx.window;
}
const original=load('?teaching=original&symbols=phosphor'),current=load('?symbols=phosphor');
const signature=p=>JSON.stringify(p.map(c=>({id:c.id,article:c.article,find:c.find,beats:c.beats.map(b=>({mode:b.mode,focus:b.focus}))})));
assert.equal(signature(current.IntuitionPlan),signature(original.IntuitionPlan),'Teaching must preserve every animated state, focus, and reading destination');
for(const chapter of current.IntuitionPlan){
 for(const b of chapter.beats){
  assert.equal(JSON.stringify(current.IntuitionGuide.model(b.mode)),JSON.stringify(original.IntuitionGuide.model(b.mode)));
  assert.ok(b.cue.split(/\s+/).length<=30,'Six-second narration stays concise: '+b.title);
  assert.ok(b.explain);
 }
 for(const id of chapter.patterns)assert.ok(current.CSTeachingLibrary.cards.some(c=>c.id===id));
 if(chapter.check)assert.ok(chapter.check.beat>=0&&chapter.check.beat<chapter.beats.length);
}
assert.equal(new Set(current.CSTeachingLibrary.sources.map(s=>s.id)).size,3);
for(const card of current.CSTeachingLibrary.cards){
 assert.ok(current.CSTeachingLibrary.sources.some(s=>s.id===card.source));
 assert.ok(card.when&&card.move&&card.avoid&&card.check);
 assert.ok(!('renderer' in card),'Teaching does not select rendering');
}
for(const kind of ['browser','process','app','socket','listener','handle','record','notice','message'])assert.equal(current.IntuitionGuide.icon(kind),original.IntuitionGuide.icon(kind));
for(const guide of [original.IntuitionGuide,current.IntuitionGuide]){
 assert.equal(guide.tokenScale,.36);
 assert.equal(guide.travelDuration([0,0],[108,144]),1000);
}
assert.equal(original.EducatorTeaching,false);
console.log('Teaching comparison passes: all 22 modes/focuses/models, 9 Phosphor glyphs, fixed scale/speed, concise cues, and library references.');
