#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const args=process.argv.slice(2),arg=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;};
const root=path.resolve(import.meta.dirname,"..");
const dev=arg("--development",path.join(root,"tests/development/sabik/i0/development.v0.4.jsonl"));
const cal=arg("--calibration",path.join(root,"tests/calibration/sabik/i0/calibration.v0.4.jsonl"));
const valDir=arg("--validation-dir",path.join(root,"tests/evaluation/sabik/i0/validation"));
const norm=s=>s.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").trim().replace(/\s+/g," ");
const tok=s=>new Set(norm(s).split(" ").filter(Boolean)),jac=(a,b)=>{const A=tok(a),B=tok(b),i=[...A].filter(x=>B.has(x)).length,u=new Set([...A,...B]).size;return u?i/u:0;};
const ng=s=>{const t=norm(s).split(" ").filter(Boolean),o=new Set();for(let i=0;i+3<=t.length;i++)o.add(t.slice(i,i+3).join(" "));return o;},ngo=(a,b)=>{const A=ng(a),B=ng(b);if(!A.size||!B.size)return 0;return [...A].filter(x=>B.has(x)).length/Math.min(A.size,B.size);};
const jsonl=p=>fs.readFileSync(p,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const validation=d=>{if(!fs.existsSync(d))return[];const o=[];for(const f of fs.readdirSync(d).filter(x=>/^i0-intents-v0\.4\.part-.*\.json$/u.test(x)).sort()){const j=JSON.parse(fs.readFileSync(path.join(d,f),"utf8"));o.push(...(j.cases||[]));}return o;};
const sets={development:jsonl(dev),calibration:jsonl(cal),validation:validation(valDir)},sus=[];
for(const [an,bn] of [["development","calibration"],["development","validation"],["calibration","validation"]])for(const a of sets[an])for(const b of sets[bn]){
 const na=norm(a.utterance),nb=norm(b.utterance);if(na===nb){sus.push({type:"exact_or_normalized",sets:[an,bn],a:a.id,b:b.id,aText:a.utterance,bText:b.utterance,score:1});continue;}
 const A=na.split(" "),B=nb.split(" ");let one=false;if(A.length===B.length&&A.length>=3){let d=0;for(let i=0;i<A.length;i++)if(A[i]!==B[i])d++;one=d===1;}
 const j=jac(a.utterance,b.utterance),n=ngo(a.utterance,b.utterance);if(one||j>=.82||n>=.80)sus.push({type:one?"one_token_variant":"high_similarity",sets:[an,bn],a:a.id,b:b.id,aText:a.utterance,bText:b.utterance,jaccard:+j.toFixed(3),trigram_overlap:+n.toFixed(3)});
}
console.log(JSON.stringify({status:"REPORT_ONLY",counts:Object.fromEntries(Object.entries(sets).map(([k,v])=>[k,v.length])),suspicious_count:sus.length,suspicious:sus},null,2));
