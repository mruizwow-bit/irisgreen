#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root=path.resolve(import.meta.dirname,"..");
const manifestPath=process.argv[2]||path.join(root,"tests/evaluation/sabik/i0/validation/manifest.v0.4.json");
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
const errors=[];
const cases=[];

function gitBlob(buf){
  return crypto.createHash("sha1").update(Buffer.from("blob "+buf.length+"\0")).update(buf).digest("hex");
}
if(manifest.contract!=="docs/sabik-next/I0_CONTRACTS_V0_4.md") errors.push("manifest contract != v0.4");
if(manifest.dataset_role!=="external_validation_only") errors.push("manifest is not validation-only");
if(manifest.development_cases!==0) errors.push("development_cases must be 0");
if(manifest.validation_cases<300) errors.push("validation_cases < 300");
if(manifest.training_reuse_prohibited!==true) errors.push("training reuse must be prohibited");
if(!Array.isArray(manifest.shards)||manifest.shards.length!==13) errors.push("expected 13 shards");

for(const shard of manifest.shards||[]){
  const p=path.join(root,shard.path);
  if(!fs.existsSync(p)){errors.push("missing "+shard.path);continue;}
  const raw=fs.readFileSync(p);
  const sha=gitBlob(raw);
  if(sha!==shard.git_blob) errors.push("blob mismatch "+shard.path+" expected "+shard.git_blob+" got "+sha);
  const doc=JSON.parse(raw.toString("utf8"));
  if(doc.contract!==manifest.contract) errors.push("contract mismatch "+shard.path);
  if(doc.dataset_role!=="validation") errors.push("role mismatch "+shard.path);
  if(!Array.isArray(doc.cases)) errors.push("cases missing "+shard.path);
  else{
    if(doc.cases.length!==shard.count) errors.push("count mismatch "+shard.path);
    cases.push(...doc.cases);
  }
}
if(cases.length!==manifest.validation_cases) errors.push("total cases "+cases.length+" != "+manifest.validation_cases);

const req=["id","locale","utterance","expected_intent","expected_parameters","expected_action","should_execute","expected_b3","ambiguity","notes","dataset_role","tags"];
const ids=new Set();
for(let i=0;i<cases.length;i++){
  const c=cases[i];
  for(const k of req) if(!(k in c)) errors.push((c.id||"NO_ID")+" missing "+k);
  if(ids.has(c.id)) errors.push("duplicate id "+c.id); ids.add(c.id);
  const expectedId="I0-EVAL-"+String(i+1).padStart(3,"0");
  if(c.id!==expectedId) errors.push("nonsequential id "+c.id+" expected "+expectedId);
  if(!["es","en"].includes(c.locale)) errors.push(c.id+" invalid locale");
  if(typeof c.utterance!=="string"||!c.utterance.trim()) errors.push(c.id+" empty utterance");
  if(!c.expected_parameters||Array.isArray(c.expected_parameters)||typeof c.expected_parameters!=="object") errors.push(c.id+" bad parameters");
  if(typeof c.should_execute!=="boolean"||typeof c.ambiguity!=="boolean") errors.push(c.id+" bad boolean");
  if(!["PRESENTE","ORIENTAR","TRANSICIÓN","PAUSA","CONFIRMAR"].includes(c.expected_b3)) errors.push(c.id+" bad B3");
  if(c.dataset_role!=="validation") errors.push(c.id+" case role != validation");
}
const gate=cases.filter(c=>c.tags?.includes("gate_final"));
const safety=cases.filter(c=>c.tags?.includes("safety_gate"));
const critical=cases.filter(c=>c.tags?.includes("critical_negation"));
const englishText=cases.filter(c=>/^Search the site for anxiety\.$/.test(c.utterance)).length;
const spanishText=cases.length-englishText;
if(gate.length!==13) errors.push("gate_final count "+gate.length+" != 13");
if(safety.length!==16) errors.push("safety_gate count "+safety.length+" != 16");
if(critical.length!==26) errors.push("critical_negation count "+critical.length+" != 26");
if(spanishText<300) errors.push("Spanish text cases "+spanishText+" < 300");
const needed=["risk_cleared","post_safety_resolved","preference_mapping","reset_scope","navigation_last","session_preference_loss","session_only_preference","single_clarification","late_result_discard","context_reset","locale_mismatch"];
for(const tag of needed) if(!cases.some(c=>c.tags?.includes(tag))) errors.push("missing gate tag "+tag);

if(errors.length){console.error(JSON.stringify({status:"FAIL",errors},null,2));process.exit(1);}
console.log(JSON.stringify({status:"PASS",cases:cases.length,development_cases:0,spanish_text_cases:spanishText,english_text_cases:englishText,gate_final:gate.length,safety_gate:safety.length,critical_negations:critical.length,manifest_blob:gitBlob(fs.readFileSync(manifestPath))},null,2));
