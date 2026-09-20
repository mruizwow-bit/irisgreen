#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"..");
const mp=process.argv[2]||path.join(root,"tests/evaluation/sabik/i0/validation/manifest.v0.4.json");
const m=JSON.parse(fs.readFileSync(mp,"utf8"));
const cases=m.shards.flatMap(s=>JSON.parse(fs.readFileSync(path.join(root,s.path),"utf8")).cases);
const norm=s=>s.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").trim().replace(/\s+/g," ");
const errors=[],seen=new Map();
for(const c of cases){
  const n=norm(c.utterance);
  if(seen.has(n)) errors.push({type:"exact",a:seen.get(n),b:c.id,text:n});
  seen.set(n,c.id);
}
for(let i=0;i<cases.length;i++){
  const a=cases[i],ta=norm(a.utterance).split(" ");
  for(let j=i+1;j<cases.length;j++){
    const b=cases[j],tb=norm(b.utterance).split(" ");
    if(ta.length!==tb.length||ta.length<3) continue;
    let d=0; for(let k=0;k<ta.length;k++) if(ta[k]!==tb[k]) d++;
    if(d===1){
      const intentional=a.contrast_group&&a.contrast_group===b.contrast_group;
      if(!intentional) errors.push({type:"one_token_variant",a:a.id,b:b.id,aText:a.utterance,bText:b.utterance});
    }
  }
}
if(errors.length){console.error(JSON.stringify({status:"FAIL",count:errors.length,errors},null,2));process.exit(1);}
console.log(JSON.stringify({status:"PASS",cases:cases.length,exact_duplicates:0,trivial_one_token_duplicates:0},null,2));
