'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../../assets/ig-suite-transit.js'),'utf8');
function api(code){const c={};vm.runInNewContext(code,c);return c.IGTransit;}
function check(T){
 const p=T.defaults();p.phase=0;p.noise=0;
 assert.ok(T.validate(p));assert.ok(!T.validate({...p,cadence:0}));assert.ok(!T.validate({...p,radius:NaN}));
 assert.ok(Math.abs(T.position(p,0).flux-.99)<1e-12,'Central depth is radius ratio squared');
 assert.equal(T.position(p,T.period(p)/2).flux,1,'A planet behind the star cannot dim its light');
 assert.equal(T.position({...p,inclination:60},0).flux,1,'An inclined non-transiting orbit has no dip');
 const q={...p,a:p.a*2};assert.ok(Math.abs(T.period(q)/T.period(p)-Math.sqrt(8))<1e-12,'Kepler scaling');
 for(const d of [0,.899999,.9,.900001,.95,1,1.099999,1.1,2]){
  const a=T.occulted(d,.1);assert.ok(Number.isFinite(a)&&a>=-1e-12&&a<=.010000001,'Grazing overlap bounded');
 }
 const atIngress=T.period(p)*Math.asin(1/p.a)/(2*Math.PI);
 const short=T.sample({...p,cadence:2},atIngress).expected;
 const long=T.sample({...p,cadence:120},atIngress).expected;
 assert.ok(Math.abs(short-long)>1e-5,'Exposure averaging affects ingress');
 assert.ok(T.period({...p,a:30})/2<20000,'One orbit fits the retained data table at minimum cadence');
}
check(api(source));
for(const [name,from,to] of [
 ['depth','return r*r;','return r;'],
 ['inclination','i=p.inclination*Math.PI/180','i=Math.PI/2'],
 ['front/back','z>0?occulted','true?occulted'],
 ['exposure','minutes+((i+0.5)/20-0.5)*p.cadence','minutes']
]){
 assert.ok(source.includes(from),name+' mutation target exists');let failed=false;
 try{check(api(source.replace(from,to)));}catch(e){failed=true;}
 assert.ok(failed,name+' mutation must be detected');
}
console.log('C07 geometry, finite exposure, validation and Kepler scaling verified. Four mutations rejected.');
