const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const M=require(path.join(root,'sabik','b3-motion.js'));
const T=JSON.parse(fs.readFileSync(path.join(root,'sabik','b3-motion-tokens.json'),'utf8'));

assert.deepEqual(M.STATES,['PRESENTE','ORIENTAR','TRANSICIÓN','PAUSA','CONFIRMAR']);
assert.deepEqual(M.LEVELS,['NORMAL','REDUCIDO','SIN_MOVIMIENTO']);
assert.equal(T.rules.continuous_loops,false);
assert.equal(T.rules.present_idle_animation,false);
for(const level of M.LEVELS){
  for(const from of M.STATES){
    for(const to of M.STATES){
      const spec=M.transition(from,to,level);
      assert.equal(spec.from,from);assert.equal(spec.to,to);assert.ok(spec.duration>=0);
      if(level==='SIN_MOVIMIENTO')assert.equal(spec.duration,0);
    }
  }
}
assert.equal(M.effectiveLevel({systemReduced:true,manual:'NORMAL'}),'REDUCIDO');
assert.equal(M.effectiveLevel({globalReduced:true}),'REDUCIDO');
assert.equal(M.effectiveLevel({manual:'SIN_MOVIMIENTO'}),'SIN_MOVIMIENTO');
assert.equal(M.effectiveLevel({manual:'NORMAL',modest:true}),'REDUCIDO');
assert.equal(M.effectiveLevel({manual:'NORMAL',modest:false}),'NORMAL');
assert.equal(M.modestDevice({hardwareConcurrency:4}),true);
assert.equal(M.modestDevice({deviceMemory:4}),true);
assert.equal(M.modestDevice({saveData:true}),true);
assert.equal(M.BASE.NORMAL.PRESENTE.duration,220);
assert.equal(M.BASE.NORMAL.PRESENTE.rotate,0);
assert.equal(M.BASE.NORMAL.PAUSA.scale,.955);
assert.ok(Math.abs(M.BASE.NORMAL['TRANSICIÓN'].rotate)<5);
assert.ok(Math.abs(M.BASE.NORMAL.ORIENTAR.x)<=8);
assert.ok(M.BASE.NORMAL.CONFIRMAR.scale<=1);
const source=fs.readFileSync(path.join(root,'sabik','b3-motion.js'),'utf8');
for(const forbidden of [/setInterval\s*\(/,/requestAnimationFrame\s*\(/,/speechSynthesis/,/SpeechSynthesisUtterance/]) assert.doesNotMatch(source,forbidden);
console.log('SABIK_B3_MOTION_R0_PASS');
