#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const html=fs.readFileSync(path.join(dir,'..','index.html'),'utf8');
const match=html.match(/<script id="game-data" type="application\/json">([\s\S]*?)<\/script>/);
if(!match) throw new Error('game-data no encontrado');
const D=JSON.parse(match[1]);
const TOK=Object.fromEntries(D.tokens.map(t=>[t.id,t]));
function sim(sc,a){
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
function enumerate(sc){
  const n=sc.movable.length;
  const out=[];
  function rec(a){
    if(a.length===n){out.push({a,ok:sim(sc,a)});return}
    for(let d=0;d<7;d++) rec(a.concat(d));
  }
  rec([]);
  return out;
}

let bad=false; const vals=[];
for(const sc of D.scenarios){
  const rows=enumerate(sc), yes=rows.filter(x=>x.ok).length, p=yes/rows.length*100;
  vals.push([sc.id,p]);
  const pass=p>=15&&p<=65;
  console.log(sc.id,p.toFixed(3)+'%',pass?'PASS':'FAIL');
  if(!pass) bad=true;
}
const min=Math.min(...vals.map(x=>x[1])),max=Math.max(...vals.map(x=>x[1])),spread=max-min;
const hardest=vals.reduce((a,b)=>a[1]<b[1]?a:b)[0];
const spreadPass=spread>=15, hardestPass=hardest==='semana-cargada';
console.log('diferencia',spread.toFixed(3),'puntos',spreadPass?'PASS':'FAIL');
console.log('más difícil',hardest,hardestPass?'PASS':'FAIL');
process.exit(bad||!spreadPass||!hardestPass?1:0);
