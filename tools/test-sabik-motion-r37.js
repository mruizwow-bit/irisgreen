const assert = require('node:assert/strict');
const fs = require('node:fs');
const motion = require('../sabik/sabik-motion-r37');
const tick = async () => { for(let i=0;i<12;i++) await Promise.resolve(); };
let checks = 0;
function fixture(preferences=()=>({}), load=s=>Promise.resolve(s)) {
  const animations=[], frames=[];
  const element={animate(keyframes,options){
    assert.equal(animations.filter(a=>!a.cancelled).length,0);
    assert.equal(options.iterations,1); assert(options.duration>0&&options.duration<=500);
    const a={keyframes,options,cancelled:false,cancel(){this.cancelled=true;},finish(){this.onfinish?.();}};
    animations.push(a); return a;
  }};
  const controller=motion.createController({element,load,preferences,apply:(asset,state)=>frames.push({asset,state})});
  return {controller, animations, frames};
}
(async()=>{
  assert.deepEqual(motion.STATES,['presente','orientar','transicion','pausa','confirmar']);
  assert.throws(()=>motion.transition('presente','explorar','NORMAL'),RangeError);
  for(const level of motion.LEVELS) for(const from of motion.STATES) for(const to of motion.STATES){
    const f=fixture();
    await f.controller.setSabikState(from,{motionLevel:'SIN_MOVIMIENTO',hold:true,force:true});
    const done=f.controller.setSabikState(to,{motionLevel:level,hold:true}); await tick();
    if(f.controller.snapshot().active) f.animations.at(-1).finish();
    await done;
    assert.equal(f.controller.snapshot().state,to);
    assert.equal(f.controller.snapshot().active,false);
    assert.equal(f.animations.filter(a=>!a.cancelled).length,0);
    checks++;
  }
  for(const s of motion.STATES){
    assert.equal(motion.transition(s,'presente','NORMAL').duration,0);
    assert.equal(motion.transition(s,s,'NORMAL').duration,0);
    assert.equal(motion.transition('presente',s,'SIN_MOVIMIENTO').duration,0);
    if(s!=='presente') assert(motion.transition('presente',s,'REDUCIDO').duration<motion.transition('presente',s,'NORMAL').duration);
  }
  for(const l of motion.LEVELS){
    assert.notEqual(motion.effectiveLevel({motionLevel:l,systemReduced:true}),'NORMAL');
    assert.equal(motion.effectiveLevel({motionLevel:l,globalOff:true}),'SIN_MOVIMIENTO');
    assert.equal(motion.effectiveLevel({motionLevel:l,lowIntensity:true}),'SIN_MOVIMIENTO');
  }
  for(const operation of ['ready','retrieving','composing','presenting','error']) assert.equal(motion.project({operation}),'presente');
  for(const interaction of ['procesando','respuesta','espera']) assert.equal(motion.project({interaction}),'presente');
  assert.equal(motion.project({interaction:'correccion'}),'orientar');
  assert.equal(motion.project({operation:'awaiting_clarification'}),'orientar');
  assert.equal(motion.project({interaction:'pausa'}),'pausa');
  assert.equal(motion.project({interaction:'contexto'}),'transicion');
  assert.equal(motion.project({interaction:'confirmacion'}),'confirmar');
  assert.equal(motion.project({interaction:'confirmacion',operation:'awaiting_clarification'}),'confirmar');
  assert.equal(motion.project({interaction:'contexto',operation:'awaiting_clarification'}),'transicion');
  assert.equal(motion.project({interaction:'correccion',safety:'risk_confirmed'}),'presente');
  const f=fixture();
  const first=f.controller.setSabikState('orientar');await tick();
  const staleFinish=f.animations.at(-1).onfinish;
  const second=f.controller.setSabikState('pausa');await tick();
  assert.equal((await first).cancelled,true);staleFinish();
  assert.equal(f.controller.snapshot().requested,'pausa');
  f.animations.at(-1).finish();await second;
  assert.equal(f.frames.at(-1).state,'pausa');
  const c=fixture(); const confirmation=c.controller.setSabikState('confirmar');await tick();
  c.animations.at(-1).finish();await confirmation;assert.equal(c.controller.snapshot().state,'presente');
  const t=c.controller.setSabikState('transicion',{to:'orientar'});await tick();c.animations.at(-1).finish();await t;
  assert.equal(c.controller.snapshot().state,'orientar');
  const waits=new Map();const delayed=fixture(()=>({}), s=>new Promise(r=>waits.set(s,r)));
  const old=delayed.controller.setSabikState('orientar');await tick();
  const latest=delayed.controller.setSabikState('pausa',{motionLevel:'SIN_MOVIMIENTO'});await tick();
  waits.get('pausa')('pausa');await latest;waits.get('orientar')('orientar');await tick();
  assert((await old).cancelled);assert.deepEqual(delayed.frames,[{asset:'pausa',state:'pausa'}]);
  const broken=fixture(()=>({}),()=>Promise.reject(Error('asset missing')));
  assert((await broken.controller.setSabikState('orientar')).assetUnavailable);
  assert.equal(broken.controller.snapshot().state,'presente');
  const guarded=fixture(()=>({systemReduced:true}));
  const reduced=guarded.controller.setSabikState('orientar',{motionLevel:'NORMAL',systemReduced:false});await tick();
  assert.equal(guarded.controller.snapshot().level,'REDUCIDO');guarded.animations.at(-1).finish();await reduced;
  const idle=fixture();for(let i=0;i<100;i++)await idle.controller.setSabikState('presente');
  assert.equal(idle.animations.length,0);
  for(const file of ['sabik-motion-r37.js','sabik-web-r01.js']){
    const source=fs.readFileSync(require.resolve('../sabik/'+file),'utf8');
    assert.doesNotMatch(source,/requestAnimationFrame|setInterval|speechSynthesis|SpeechRecognition|localStorage|sessionStorage/);
  }
  console.log(JSON.stringify({status:'PASS',transition_matrix:checks,levels:3,interruption:true,stale_decode:true,finite:true,presente_still:true,confirmation_returns:true,projection:true}));
})().catch(e=>{console.error(e);process.exitCode=1;});
