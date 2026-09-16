const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={URLSearchParams,location:{search:''},window:{Animations:{esc:x=>String(x)}}};vm.createContext(ctx);
for(const file of ['intuition-plan.js','intuition.js'])vm.runInContext(fs.readFileSync(`${__dirname}/../web/${file}`,'utf8'),ctx);
const {IntuitionGuide:G,IntuitionPlan:P}=ctx.window;
for(const chapter of P)for(const beat of chapter.beats){
 const m=G.model(beat.mode);
 assert.equal(m.handles,Number(m.parentAccess)+Number(m.childAccess),beat.mode+' handle count');
 assert.ok(m.connection||m.handles===0,beat.mode+' closed while a handle remains');
 assert.ok(!m.childExited||!m.child,beat.mode+' exited child still running');
 assert.ok(!m.collect||m.recordCount>0,beat.mode+' collecting absent status');
}
assert.equal(G.model('twoHandles').handles,2);
assert.equal(G.model('oneHandle').connection,true);
assert.equal(G.model('replyOpen').reply,true);
assert.equal(G.model('replyOpen').connection,true);
assert.equal(G.model('closed').connection,false);
assert.equal(G.model('exited').recordCount,1);
assert.equal(G.model('burst').notice,true);
assert.equal(G.model('burst').recordCount,3);
assert.equal(G.model('ready').recordCount,0);
assert.equal(P[0].article,1);
assert.match(P[0].beats.map(x=>x.cue).join(' '),/WSGI/);
const kinds=['browser','process','app','socket','listener','handle','record','notice','message'];
assert.equal(new Set(kinds.map(x=>G.icon(x))).size,kinds.length,'concepts must have distinct glyphs');
console.log(`Checked ${P.reduce((n,c)=>n+c.beats.length,0)} intuition moments: access, process status, notification, and vocabulary invariants.`);

assert.equal(G.travelDuration([0,0],[180,0]),1000);
assert.equal(G.travelDuration([0,0],[360,0]),2000);
assert.equal(G.travelDuration([0,0],[108,144]),1000);
assert.equal(G.tokenScale,.36);
