const fs=require('node:fs'),assert=require('node:assert/strict');
const vm=require('node:vm');
const code=fs.readFileSync('assets/ig-child-safety.js','utf8');
const removed=[];
const document={
 documentElement:{dataset:{}},
 querySelectorAll(sel){
   if(sel==='[data-ig-s2-full]') return [{remove(){removed.push('full')}}];
   if(sel==='[data-ig-s2-full-loaded="true"]') return [{removeAttribute(){}}];
   return [];
 }
};
class CE{constructor(type,init){this.type=type;this.detail=init&&init.detail}}
const events=[];
const window={dispatchEvent(e){events.push(e)},CustomEvent:CE};
const ctx={window,document,CustomEvent:CE,Set};vm.createContext(ctx);vm.runInContext(code,ctx);
const P=ctx.window.IGChildSafety;
const s0={sensitivity:'S0_GENERAL',discovery:'NORMAL'};
const s2={sensitivity:'S2_HIGH_SENSITIVITY',discovery:'SAFE_VARIANT_REQUIRED'};
assert.equal(P.getAudience(),'default');
for(const a of ['default','child','teen','all']){P.setAudience(a);assert.equal(P.canDiscover(s2),false);assert.equal(P.resolveIntent(s2).kind,'safe-variant');assert.equal(P.mayLoadFull(s2,{explicitAction:true}),false)}
P.setAudience('adult');
assert.equal(P.canDiscover(s2),true);
assert.equal(P.resolveIntent(s2).kind,'adult-safe-first');
assert.equal(P.mayLoadFull(s2,{explicitAction:false}),false);
assert.equal(P.mayLoadFull(s2,{explicitAction:true}),true);
assert.equal(P.canDiscover(s0),true);
P.setAudience('child');
assert.ok(removed.includes('full'),'adult→child must purge full S2 DOM');
assert.equal(document.documentElement.dataset.igAudience,'child');
assert.deepEqual(Array.from(P.filterDiscovery([s0,s2])).map(x=>x.sensitivity),['S0_GENERAL']);
for(const bad of ['','CHILDREN','17',null]){P.setAudience(bad);assert.equal(P.getAudience(),'default')}
assert.ok(!code.match(/localStorage|sessionStorage|dateOfBirth|birthdate|diagnos/i),'policy must not persist or request age/diagnosis');
console.log('R42_CHILD_SAFETY_SHARED_POLICY_PASS');