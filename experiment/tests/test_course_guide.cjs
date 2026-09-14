const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:{LIBRARY_DATA:{lessons:[{id:'server',steps:[]}]},Animations:{esc:String}},matchMedia:()=>({matches:false})};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('experiment/web/part3.js','utf8'),ctx);
const {tourState}=ctx.window.Part3;
for(const count of [3,4,5,7])for(const smooth of [false,true]){
 assert.equal(tourState(9.99,count,smooth).progress,0);
 for(let n=1;n<count;n++){
  assert.equal(tourState(11*n,count,smooth).progress,n/(count-1));
  assert.equal(tourState(11*n+9.99,count,smooth).progress,n/(count-1));
 }
 const end=10+(count-1)*11;
 assert.equal(tourState(end-.01,count,smooth).done,false);
 assert.equal(tourState(end,count,smooth).done,true);
 assert.equal(tourState(end,count,smooth).progress,1);
 assert.equal(tourState(end+20,count,smooth).progress,1);
}
assert.equal(tourState(10.5,7,true).progress,.5/6);
console.log('Course guidance: ten-second holds, timeline travel, and final state verified.');
