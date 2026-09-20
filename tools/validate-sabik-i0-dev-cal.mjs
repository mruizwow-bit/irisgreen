#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root=path.resolve(import.meta.dirname,"..");
const files={
  development:"tests/development/sabik/i0/development.v0.4.jsonl",
  calibration:"tests/calibration/sabik/i0/calibration.v0.4.jsonl"
};
const manifests={
  development:"tests/development/sabik/i0/manifest.v0.4.json",
  calibration:"tests/calibration/sabik/i0/manifest.v0.4.json"
};
const schemaRel="tests/schemas/sabik/i0/i0-layered-case-v0.4.schema.json";
const statsRel="docs/sabik-next/I0_DEVELOPMENT_CALIBRATION_STATS_V0_4.json";
const schema=JSON.parse(fs.readFileSync(path.join(root,schemaRel),"utf8"));
const loadJsonl=rel=>fs.readFileSync(path.join(root,rel),"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const deep=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const resolveRef=ref=>{let n=schema;for(const p of ref.replace(/^#\//,"").split("/"))n=n[p.replace(/~1/g,"/").replace(/~0/g,"~")];return n;};

function validateSchema(v,n,p="$"){
  const e=[];
  if(n.$ref)return validateSchema(v,resolveRef(n.$ref),p);
  if(n.oneOf){
    const matches=n.oneOf.map(x=>validateSchema(v,x,p)).filter(x=>x.length===0).length;
    if(matches!==1)e.push(p+" must match exactly one schema variant (matched "+matches+")");
    return e;
  }
  if(n.type){
    const ok=n.type==="array"?Array.isArray(v):
      n.type==="object"?(v!==null&&typeof v==="object"&&!Array.isArray(v)):
      n.type==="number"?(typeof v==="number"&&Number.isFinite(v)):
      typeof v===n.type;
    if(!ok)return [p+" expected "+n.type];
  }
  if(Object.prototype.hasOwnProperty.call(n,"const")&&!deep(v,n.const))e.push(p+" const mismatch");
  if(n.enum&&!n.enum.some(x=>deep(v,x)))e.push(p+" enum mismatch");
  if(typeof v==="string"){
    if(n.minLength!==undefined&&v.length<n.minLength)e.push(p+" too short");
    if(n.pattern&&!new RegExp(n.pattern,"u").test(v))e.push(p+" pattern mismatch");
  }
  if(Array.isArray(v)){
    if(n.minItems!==undefined&&v.length<n.minItems)e.push(p+" too few items");
    if(n.maxItems!==undefined&&v.length>n.maxItems)e.push(p+" too many items");
    if(n.uniqueItems&&new Set(v.map(x=>JSON.stringify(x))).size!==v.length)e.push(p+" duplicate items");
    if(n.items)v.forEach((x,i)=>e.push(...validateSchema(x,n.items,p+"["+i+"]")));
  }
  if(v!==null&&typeof v==="object"&&!Array.isArray(v)){
    for(const r of n.required||[])if(!(r in v))e.push(p+" missing "+r);
    for(const [k,x] of Object.entries(n.properties||{}))if(k in v)e.push(...validateSchema(v[k],x,p+"."+k));
    if(n.additionalProperties===false){
      const allowed=new Set(Object.keys(n.properties||{}));
      for(const k of Object.keys(v))if(!allowed.has(k))e.push(p+" unexpected "+k);
    }
  }
  return e;
}

const sha256=b=>crypto.createHash("sha256").update(b).digest("hex");
const gitBlob=b=>crypto.createHash("sha1").update(Buffer.concat([Buffer.from("blob "+b.length+"\0"),b])).digest("hex");
function statsFor(A){
  const countBy=fn=>{const o={};for(const c of A){const k=fn(c);o[k]=(o[k]||0)+1;}return o;};
  const intents={};for(const c of A)for(const x of c.expected_commands)intents[x.intent]=(intents[x.intent]||0)+1;
  return {
    cases:A.length,
    by_gate:countBy(c=>c.expected_gate),
    by_result_kind:countBy(c=>c.expected_result_kind),
    by_b3:countBy(c=>c.expected_b3),
    classification_expected:{true:A.filter(c=>c.should_classify).length,false:A.filter(c=>!c.should_classify).length},
    action_execution_expected:{true:A.filter(c=>c.should_execute_actions).length,false:A.filter(c=>!c.should_execute_actions).length},
    by_intent:intents,
    ambiguous:A.filter(c=>c.ambiguity).length,
    multi_action:A.filter(c=>c.expected_commands.length>1).length,
    safety_non_normal:A.filter(c=>c.expected_gate!=="normal").length,
    insufficient:A.filter(c=>c.expected_result_kind==="insufficient").length,
    critical_negation:{
      total:A.filter(c=>c.tags.includes("critical_negation")).length,
      negative:A.filter(c=>c.tags.includes("critical_negation_negative")).length,
      positive_control:A.filter(c=>c.tags.includes("critical_negation_positive_control")).length
    }
  };
}

const errors=[],loaded={};
for(const [role,rel] of Object.entries(files)){
  const A=loaded[role]=loadJsonl(rel);
  const expected=role==="development"?400:200;
  const prefix=role==="development"?"I0-DEV-":"I0-CAL-";
  const seen=new Set();
  if(A.length!==expected)errors.push(role+" count "+A.length+" != "+expected);
  A.forEach((c,i)=>{
    errors.push(...validateSchema(c,schema,role+"["+i+"]"));
    const expectedId=prefix+String(i+1).padStart(4,"0");
    if(c.id!==expectedId)errors.push(c.id+" expected sequential id "+expectedId);
    if(c.dataset_role!==role)errors.push(c.id+" role mismatch");
    if(seen.has(c.id))errors.push(c.id+" duplicate");seen.add(c.id);
    if(c.should_classify!==(c.expected_commands.length>0))errors.push(c.id+" should_classify mismatch");
    if(c.should_execute_actions!==(c.expected_actions.length>0))errors.push(c.id+" should_execute_actions mismatch");
    const asks=c.expected_s0_events.filter(x=>x==="ASK_CLARIFICATION").length;
    if(asks>1)errors.push(c.id+" repeated ASK_CLARIFICATION");
    if(asks===1&&(c.expected_result_kind!=="clarification"||c.expected_b3!=="PRESENTE"))errors.push(c.id+" ASK_CLARIFICATION must be clarification/PRESENTE");
    if(c.expected_result_kind==="clarification"&&c.expected_b3!=="PRESENTE")errors.push(c.id+" clarification must be PRESENTE");
    if(c.expected_result_kind==="insufficient"&&(c.expected_b3!=="PRESENTE"||c.expected_actions.length))errors.push(c.id+" insufficient must be PRESENTE without actions");
    if(c.expected_b3==="CONFIRMAR"&&(c.expected_result_kind==="clarification"||asks))errors.push(c.id+" invalid CONFIRMAR");
    if(c.expected_gate!=="normal"&&c.expected_actions.length)errors.push(c.id+" ordinary actions during safety");
    if(c.expected_b3==="PAUSA"&&!c.expected_s0_events.includes("PAUSE_ASSISTANT"))errors.push(c.id+" PAUSA without PAUSE_ASSISTANT");
    if(c.expected_actions.some((a,j)=>a.type==="NAVIGATE_IRIS"&&j!==c.expected_actions.length-1))errors.push(c.id+" navigation not last");
    if(c.expected_commands.length>1&&!c.tags.includes("multi_action"))errors.push(c.id+" multi-action missing tag");
    if(c.tags.includes("critical_negation")){
      const neg=c.tags.includes("critical_negation_negative");
      const pos=c.tags.includes("critical_negation_positive_control");
      if(neg===pos)errors.push(c.id+" critical_negation polarity invalid");
      if(neg&&(c.expected_actions.length||c.expected_s0_events.some(x=>x==="PAUSE_ASSISTANT"||x==="SPEECH_STOP")))errors.push(c.id+" negative control has executable output");
    }
  });
  const buf=fs.readFileSync(path.join(root,rel));
  const manifest=JSON.parse(fs.readFileSync(path.join(root,manifests[role]),"utf8"));
  const st=statsFor(A);
  if(manifest.case_count!==A.length)errors.push(role+" manifest case_count mismatch");
  if(manifest.bytes!==buf.length)errors.push(role+" manifest bytes mismatch");
  if(manifest.sha256!==sha256(buf))errors.push(role+" manifest sha256 mismatch");
  if(manifest.git_blob_sha1!==gitBlob(buf))errors.push(role+" manifest git blob mismatch");
  if(!deep(manifest.stats,st))errors.push(role+" manifest stats mismatch");
}
if(loaded.development.filter(c=>c.expected_result_kind==="insufficient").length<3)errors.push("development insufficient coverage <3");
if(loaded.calibration.filter(c=>c.expected_result_kind==="insufficient").length<2)errors.push("calibration insufficient coverage <2");
if(loaded.development.filter(c=>c.expected_commands.length>1).length<20||loaded.calibration.filter(c=>c.expected_commands.length>1).length<10)errors.push("multi-action coverage too low");

const statDoc=JSON.parse(fs.readFileSync(path.join(root,statsRel),"utf8"));
const schemaBuf=fs.readFileSync(path.join(root,schemaRel));
for(const role of ["development","calibration"]){
  const buf=fs.readFileSync(path.join(root,files[role]));
  if(statDoc.hashes[role].bytes!==buf.length||statDoc.hashes[role].sha256!==sha256(buf)||statDoc.hashes[role].git_blob_sha1!==gitBlob(buf))errors.push(role+" stats hash mismatch");
}
if(statDoc.hashes.schema.bytes!==schemaBuf.length||statDoc.hashes.schema.sha256!==sha256(schemaBuf)||statDoc.hashes.schema.git_blob_sha1!==gitBlob(schemaBuf))errors.push("schema stats hash mismatch");

if(errors.length){console.error(JSON.stringify({status:"FAIL",errors},null,2));process.exit(1);}
console.log(JSON.stringify({
  status:"PASS",schema_consumed:true,
  development:loaded.development.length,calibration:loaded.calibration.length,
  insufficient:{
    development:loaded.development.filter(c=>c.expected_result_kind==="insufficient").length,
    calibration:loaded.calibration.filter(c=>c.expected_result_kind==="insufficient").length
  },
  multi_action:{
    development:loaded.development.filter(c=>c.expected_commands.length>1).length,
    calibration:loaded.calibration.filter(c=>c.expected_commands.length>1).length,
    total:[...loaded.development,...loaded.calibration].filter(c=>c.expected_commands.length>1).length
  },
  b3_confirmar:{
    development:loaded.development.filter(c=>c.expected_b3==="CONFIRMAR").length,
    calibration:loaded.calibration.filter(c=>c.expected_b3==="CONFIRMAR").length
  }
},null,2));

