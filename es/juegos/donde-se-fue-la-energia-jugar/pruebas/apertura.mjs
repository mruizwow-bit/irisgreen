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

const EXP={
 'semana-social':[823543,466687,356856],
 'semana-trabajo':[823543,302923,520620],
 'semana-cargada':[823543,137963,685580]
};
let bad=false;
for(const sc of D.scenarios){
  const rows=enumerate(sc), yes=rows.filter(x=>x.ok).length, no=rows.length-yes;
  const exp=EXP[sc.id];
  const pass=rows.length===exp[0]&&yes===exp[1]&&no===exp[2]&&yes>=3&&no>=1;
  console.log(sc.id,'total',rows.length,'llegan',yes,'se paran',no,pass?'PASS':'FAIL');
  if(!pass) bad=true;
}
process.exit(bad?1:0);
