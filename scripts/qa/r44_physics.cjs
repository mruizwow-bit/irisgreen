'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const vendorContext = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/vendor/taller/planck.js'), 'utf8'), vendorContext);
const planck = vendorContext.window.planck;
const source = fs.readFileSync(path.join(root, 'assets/ig-suite-physics.js'), 'utf8');
async function check(code) {
  const window = {planck};
  vm.runInNewContext(code, {window});
  const api = window.IGPhysics;
  const requested=[];
  assert.equal(await api.backend({load(names){requested.push(...names); return Promise.resolve();}}), 'planck');
  assert.deepEqual(requested, ['planck']);
  const world = api.createWorld('planck', {});
  const floor = world.addBody({type:'static',x:0,y:0,shape:{type:'box',w:10,h:1}});
  const ball = world.addBody({x:0,y:5,shape:{type:'circle',r:0.5}});
  for (let i=0;i<240;i++) world.step(1/60);
  const y=world.get(ball).y;
  assert.ok(y>0.95 && y<1.1, `Ball must settle on the floor, got ${y}`);
  assert.equal(world.raycast(2,4,2,-2).body,floor);
  world.destroy();
}
(async()=>{
 await check(source);
 let caught=false;
 try {await check(source.replace('opts.gravity === undefined ? -9.81 : opts.gravity','0'));} catch (_) {caught=true;}
 assert.ok(caught,'Gravity mutation must fail the contact test');
 console.log('Planck: local vendor, gravity, collision and raycast verified; gravity mutation rejected. Not a full R44 gate.');
})().catch(e=>{console.error(e);process.exitCode=1;});
