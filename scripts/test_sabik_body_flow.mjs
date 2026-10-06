import test from 'node:test';
import assert from 'node:assert/strict';
import {BODY_PIVOT,bodyPoint,createBodyMesh} from '../sabik/body-flow.mjs';

test('body deformation keeps the nucleus and its immediate surroundings anchored',()=>{
 for(let phase=0;phase<30;phase+=.2)for(const strength of [0,.16,1,1.45]){
  for(const [u,v] of [BODY_PIVOT,[BODY_PIVOT[0]+.02,BODY_PIVOT[1]-.02]]){
   const p=bodyPoint(u,v,phase,strength);
   assert.ok(Math.hypot(p[0]-u,p[1]-v)<1e-12);
  }
 }
});
test('ribbon lobes change their separation rather than moving as a rigid picture',()=>{
 const a=[.72,.22],b=[.68,.68];
 const distances=[];
 for(let phase=0;phase<16;phase+=.25){
  const pa=bodyPoint(...a,phase),pb=bodyPoint(...b,phase);
  distances.push(Math.hypot(pa[0]-pb[0],pa[1]-pb[1]));
 }
 assert.ok(Math.max(...distances)-Math.min(...distances)>.08);
 for(const p of [a,b]){
  const q=bodyPoint(...p,5,0);assert.ok(Math.hypot(q[0]-p[0],q[1]-p[1])<1e-12);
 }
});
test('the ribbon mesh stays continuous without folded triangles at maximum speaking strength',()=>{
 const {uv,indices}=createBodyMesh();
 for(let phase=0;phase<40;phase+=.2){
  const vertices=[];
  for(let i=0;i<uv.length;i+=2)vertices.push(bodyPoint(uv[i],uv[i+1],phase,1.45));
  for(let i=0;i<indices.length;i+=3){
   const [a,b,c]=[vertices[indices[i]],vertices[indices[i+1]],vertices[indices[i+2]]];
   const area=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
   assert.ok(area<-.00005,`Folded ribbon at phase ${phase}, triangle ${i/3}`);
  }
 }
});
