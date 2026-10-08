#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(dir,'..','index.html'),'utf8');
const match=html.match(/<script id="game-data" type="application\/json">([\s\S]*?)<\/script>/);
if(!match) throw new Error('game-data no encontrado');
const D=JSON.parse(match[1]);

function makeTok(){return Object.fromEntries(D.tokens.map(t=>[t.id,t]));}
function sim(sc,a,TOK){
  const placed={...sc.fixed};
  sc.movable.forEach((id,i)=>placed[id]=a[i]);
  let e=D.startEnergy;
  for(let d=0;d<7;d++){
    const balance=Object.keys(placed).filter(id=>placed[id]===d).reduce((s,id)=>s+TOK[id].value,0);
    e+=balance;
    if(e<0) return false;
    e=Math.min(D.maxEnergy,e);
  }
  return true;
}
function count(sc,TOK){
  let yes=0; const n=sc.movable.length;
  function rec(a){
    if(a.length===n){if(sim(sc,a,TOK))yes++;return;}
    for(let d=0;d<7;d++)rec(a.concat(d));
  }
  rec([]); return yes;
}

const TOK0=makeTok();
const base=Object.fromEntries(D.scenarios.map(sc=>[sc.id,count(sc,TOK0)]));
D.tokens.find(t=>t.id==='cama').value=1;
const TOK1=makeTok();
let changed=false;
for(const sc of D.scenarios){
  const yes=count(sc,TOK1), c=yes!==base[sc.id];
  console.log(sc.id,'base',base[sc.id],'mutado',yes,c?'CAMBIA':'NO CAMBIA');
  changed ||= c;
}
console.log(changed?'PASS: la mutación cambia la apertura':'FAIL: la mutación no cambia la apertura');
process.exit(changed?0:1);
