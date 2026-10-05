'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),M=require('../model.js'),context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/data.js'),'utf8'),context);
const D=context.window.FOSSILS_DATA,pieces=D.sectors.flatMap(e=>e.pieces);let checks=0;
function test(name,fn){fn();checks++;console.log('PASS '+name)}
test('14 identidades y rutas distintas',()=>{assert.equal(pieces.length,14);assert.equal(new Set(pieces.map(p=>p.id)).size,14);assert.equal(new Set(pieces.map(p=>p.asset)).size,14);pieces.forEach(p=>assert(fs.existsSync(path.join(root,p.asset))))});
test('una zona despejada no altera otra máscara',()=>{const a=M.mask(),b=M.mask();M.clear(a,430,430,100);assert(M.isClear(a,430,430));assert(!M.isClear(b,430,430));assert(!M.isClear(a,1300,300));assert.equal(M.clear(a,430,430,100),0)});
test('14 piezas: indicio inicial insuficiente y preparación alcanzable',()=>{for(const p of pieces){const m=M.mask(),f=p.features[0];M.clear(m,p.x-p.w/2+f.x*p.w,p.y-p.h/2+f.y*p.h,Math.min(p.w,p.h)*.135*.82);assert(!M.ready(m,p),p.id+' revelado al entrar');for(let i=0;i<100&&!M.ready(m,p);i++){const q=p.samples.find(q=>!M.isClear(m,p.x-p.w/2+q[0]*p.w,p.y-p.h/2+q[1]*p.h));assert(q,p.id+' atascado');M.clear(m,p.x-p.w/2+q[0]*p.w,p.y-p.h/2+q[1]*p.h,Math.max(55,Math.min(p.w,p.h)*.19)*.82)}assert(M.ready(m,p),p.id+' inalcanzable')}});
test('transformaciones reversibles en 320/390/1440 y tres ampliaciones',()=>{for(const [w,h]of [[286,360],[356,464],[850,560]])for(const z of [.55,1.4,3]){const c=M.bound({x:680,y:490,z},w,h);for(const p of [{x:20,y:30},{x:680,y:490},{x:1600,y:1050}]){const q=M.world(M.screen(p,c,w,h),c,w,h);assert(Math.abs(p.x-q.x)<1e-8);assert(Math.abs(p.y-q.y)<1e-8)}}});
test('encuadre asistido contiene las 14 piezas completas',()=>{for(const [w,h]of [[286,360],[356,464],[850,560]])for(const p of pieces){const c=M.bound({x:p.x,y:p.y,z:Math.min(1.55,Math.min(w/(p.w+90),h/(p.h+110))/Math.min(w/820,h/580))},w,h);for(const dx of [-1,1])for(const dy of [-1,1]){const q=M.screen({x:p.x+dx*p.w/2,y:p.y+dy*p.h/2},c,w,h);assert(q.x>=0&&q.x<=w&&q.y>=0&&q.y<=h,p.id)}}});
test('fuera de mundo no cuenta como cobertura',()=>{const m=M.mask();M.clear(m,0,0,50);assert(!M.isClear(m,-1,0));assert(!M.isClear(m,1800,1100))});
console.log(checks+'/'+checks+' PASS — modelo; no navegador ni HUMAN QA.');
