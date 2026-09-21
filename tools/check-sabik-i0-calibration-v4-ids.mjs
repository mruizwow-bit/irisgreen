#!/usr/bin/env node
import fs from "node:fs";

const args=process.argv.slice(2);
const candidates=[];
const refs=[];
for(let i=0;i<args.length;i+=2){
  const k=args[i],v=args[i+1];
  if(k==="--candidate")candidates.push(v);
  else if(k==="--reference")refs.push(v);
  else if(k==="--report")var reportPath=v;
  else throw new Error("Unknown argument "+k);
}
if(candidates.length!==1)throw new Error("Exactly one --candidate is required");
const read=p=>fs.readFileSync(p,"utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse);
const c=read(candidates[0]);
const candidateIds=new Set(c.map(x=>x.id));
const reused=[];
const checked={};
for(const spec of refs){
  const pos=spec.indexOf(":");
  if(pos<1)throw new Error("Expected label:path");
  const label=spec.slice(0,pos),p=spec.slice(pos+1);
  const rows=read(p);
  const ids=new Set(rows.map(x=>x.id));
  const hits=[...candidateIds].filter(id=>ids.has(id)).sort();
  checked[label]={case_count:rows.length,reused_count:hits.length};
  for(const id of hits)reused.push({candidate_id:id,against:label});
}
const report={
  checker:"sabik-i0-v4-id-independence-v1",
  candidate_count:c.length,
  candidate_unique_ids:candidateIds.size,
  checked,
  reused_ids:reused,
  pass:candidateIds.size===c.length&&reused.length===0
};
if(reportPath)fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(!report.pass)process.exit(1);
