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

function buildOutcomes(sc){
  const n=sc.movable.length;
  const total=7**n;
  const out=new Uint8Array(total);
  const pow=Array.from({length:n},(_,i)=>7**i);
  let yes=0;
  for(let idx=0;idx<total;idx++){
    let x=idx;
    const days=new Array(n);
    for(let i=0;i<n;i++){days[i]=x%7;x=Math.floor(x/7)}
    const placed={...sc.fixed};
    for(let i=0;i<n;i++) placed[sc.movable[i]]=days[i];
    let e=D.startEnergy, ok=true;
    for(let d=0;d<7;d++){
      let bal=0;
      for(const id in placed) if(placed[id]===d) bal+=TOK[id].value;
      e+=bal;
      if(e<0){ok=false;break}
      e=Math.min(D.maxEnergy,e);
    }
    out[idx]=ok?1:0;
    if(ok) yes++;
  }
  return {out,yes,total,pow};
}

function decisionPercent(sc){
  const {out,total,pow}=buildOutcomes(sc);
  let influential=0;
  for(let idx=0;idx<total;idx++){
    const orig=out[idx];
    let flips=false;
    for(let ax=0;ax<pow.length && !flips;ax++){
      const p=pow[ax];
      const digit=Math.floor(idx/p)%7;
      const base=idx-digit*p;
      for(let d=0;d<7;d++){
        if(d===digit) continue;
        if(out[base+d*p]!==orig){flips=true;break}
      }
    }
    if(flips) influential++;
  }
  return influential/total*100;
}

let bad=false;
for(const sc of D.scenarios){
  const p=decisionPercent(sc), pass=p>=25;
  console.log(sc.id,p.toFixed(3)+'%',pass?'PASS':'FAIL');
  if(!pass) bad=true;
}
process.exit(bad?1:0);
