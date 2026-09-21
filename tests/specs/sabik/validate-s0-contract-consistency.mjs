#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here=dirname(fileURLToPath(import.meta.url));
const contractPath=resolve(here,"s0-state-contract.json");
const casesPath=resolve(here,"s0-transition-cases.json");
const clone=v=>JSON.parse(JSON.stringify(v));
const stable=v=>{if(Array.isArray(v))return v.map(stable);if(!v||typeof v!=="object")return v;return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));};
const same=(a,b)=>JSON.stringify(stable(a))===JSON.stringify(stable(b));

export function rowsAsObjects(contract){
  return contract.rows.map((row,i)=>{
    if(!Array.isArray(row)||row.length!==contract.row_columns.length)throw new Error(`fila ${i}: columnas inválidas`);
    return Object.fromEntries(contract.row_columns.map((k,j)=>[k,row[j]]));
  });
}
function profileObject(cols,arr,label){
  if(!Array.isArray(arr)||arr.length!==cols.length)throw new Error(`${label}: perfil inválido`);
  return Object.fromEntries(cols.map((k,i)=>[k,clone(arr[i])]));
}
export function resolveStateSpec(spec,contract){
  if(!Array.isArray(spec)||spec.length!==2)throw new Error("referencia de estado inválida");
  const [ref,revision]=spec, arr=contract.state_templates?.[ref];
  if(!arr)throw new Error(`plantilla inexistente: ${ref}`);
  if(arr.length!==contract.state_columns.length)throw new Error(`${ref}: plantilla incompleta`);
  const raw=Object.fromEntries(contract.state_columns.map((k,i)=>[k,clone(arr[i])]));
  const state={};
  for(const [k,v] of Object.entries(raw)){
    if(v===null)continue;
    if(k==="adaptation"){
      const p=contract.adaptation_profiles[v];if(!p)throw new Error(`${ref}: adaptation profile ${v} inexistente`);
      state.adaptation=profileObject(contract.adaptation_columns,p,`${ref}.${v}`);
    }else if(k==="speech_meta"){
      const p=contract.speech_meta_profiles[v];if(!p)throw new Error(`${ref}: speech_meta profile ${v} inexistente`);state.speech_meta=clone(p);
    }else if(k==="motion_meta"){
      const p=contract.motion_meta_profiles[v];if(!p)throw new Error(`${ref}: motion_meta profile ${v} inexistente`);state.motion_meta=clone(p);
    }else if(k==="error_meta"){
      const p=contract.error_meta_profiles[v];if(!p)throw new Error(`${ref}: error_meta profile ${v} inexistente`);state.error_meta=clone(p);
    }else state[k]=v;
  }
  state.revision=revision;
  return state;
}
function validateMetadata(state,label){
  if("speech_meta" in state){
    const m=state.speech_meta;if(!m||typeof m!=="object"||Array.isArray(m))throw new Error(`${label}: speech_meta inválido`);
    if("energy" in m&&(typeof m.energy!=="number"||m.energy<0||m.energy>1))throw new Error(`${label}: speech_meta.energy inválido`);
    if("boundary_count" in m&&(!Number.isInteger(m.boundary_count)||m.boundary_count<0))throw new Error(`${label}: speech_meta.boundary_count inválido`);
  }
  if("motion_meta" in state){
    const m=state.motion_meta;if(!m||typeof m!=="object"||Array.isArray(m))throw new Error(`${label}: motion_meta inválido`);
    if("reduced" in m&&typeof m.reduced!=="boolean")throw new Error(`${label}: motion_meta.reduced inválido`);
  }
  if("error_meta" in state&&(!state.error_meta||typeof state.error_meta!=="object"||Array.isArray(state.error_meta)))throw new Error(`${label}: error_meta inválido`);
}
export function validateState(state,contract,label="state"){
  for(const k of contract.required_state_fields)if(!(k in state))throw new Error(`${label}: falta ${k}`);
  for(const k of ["operation","dialogue","safety","visibility","speech","motion","language"])if(!contract.state_enums[k].includes(state[k]))throw new Error(`${label}: ${k} fuera de catálogo`);
  if(!Number.isInteger(state.revision)||state.revision<0)throw new Error(`${label}: revision inválida`);
  const a=state.adaptation;if(!a||typeof a!=="object"||Array.isArray(a))throw new Error(`${label}: adaptation inválida`);
  const [rl,mo,qp,intensity,depth]=[a.response_length,a.max_options,a.question_policy,a.intensity,a.depth];
  if(!["normal","short"].includes(rl)||!Number.isInteger(mo)||mo<1||mo>6||!["normal","low","one_useful_question","none"].includes(qp)||!["normal","low"].includes(intensity)||!["normal","short","detailed"].includes(depth))throw new Error(`${label}: adaptation fuera de catálogo`);
  validateMetadata(state,label);
  if(state.safety==="uncertain"){if(state.dialogue!=="clarification")throw new Error(`${label}: uncertain exige clarification`);if(state.motion!=="protection_static")throw new Error(`${label}: uncertain exige protection_static`);}
  if(["risk","human_handoff"].includes(state.safety)){if(state.dialogue!=="human_handoff")throw new Error(`${label}: protección exige human_handoff`);if(state.motion!=="protection_static")throw new Error(`${label}: protección exige protection_static`);if(["starting","speaking","paused"].includes(state.speech))throw new Error(`${label}: voz ordinaria activa durante protección`);}
  if(state.motion==="voice_reactive"&&(state.speech!=="speaking"||state.safety!=="normal"))throw new Error(`${label}: voice_reactive incoherente`);
  if(state.operation==="error"&&state.safety==="uncertain"&&state.dialogue!=="clarification")throw new Error(`${label}: error+uncertain pierde clarification`);
  JSON.parse(JSON.stringify(state));return true;
}
function signature(row,contract){return JSON.stringify(stable({previous:resolveStateSpec([row.previous_ref,row.previous_revision],contract),event:row.event,payload:row.payload||{}}));}
export function validateContractConsistency(contract,cases){
  if(contract.schema_version!==4||contract.normative_status!=="NORMATIVE_CONSOLIDATED")throw new Error("contrato no consolidado/normativo");
  validateState(resolveStateSpec(contract.initial,contract),contract,"initial");
  const rows=rowsAsObjects(contract), ids=new Set(), sigs=new Map();let contradictions=0,impossible=0,broken=0;
  for(const row of rows){
    if(!row.id||ids.has(row.id))throw new Error(`id duplicado o ausente: ${row.id}`);ids.add(row.id);
    const prev=resolveStateSpec([row.previous_ref,row.previous_revision],contract),exp=resolveStateSpec([row.expected_ref,row.expected_revision],contract);
    try{validateState(prev,contract,`${row.id}.previous`);validateState(exp,contract,`${row.id}.expected`);}catch(e){impossible+=1;throw e;}
    if(typeof row.allowed!=="boolean")throw new Error(`${row.id}: allowed inválido`);
    if(row.allowed&&exp.revision!==prev.revision+1)throw new Error(`${row.id}: permitido sin +1 revision`);
    if(!row.allowed&&!same(prev,exp))throw new Error(`${row.id}: rechazo modifica estado`);
    if(/^SPEECH_/.test(row.event)&&Object.prototype.hasOwnProperty.call(row.payload||{},"reduced_motion"))throw new Error(`${row.id}: reduced_motion prohibido en voz`);
    if(row.event==="SPEECH_START"&&row.allowed&&prev.speech!=="starting")throw new Error(`${row.id}: SPEECH_START fuera de starting`);
    if(row.event==="SPEECH_ERROR"&&row.allowed&&exp.motion==="ambient")throw new Error(`${row.id}: SPEECH_ERROR->ambient prohibido`);
    const sig=signature(row,contract);
    if(sigs.has(sig)){const old=sigs.get(sig),oldExp=resolveStateSpec([old.expected_ref,old.expected_revision],contract);if(old.allowed!==row.allowed||!same(oldExp,exp)){contradictions+=1;throw new Error(`${row.id}: contradice ${old.id}`);}}else sigs.set(sig,row);
  }
  const caseIds=new Set();
  for(const item of cases.cases){
    if(!item.id||caseIds.has(item.id))throw new Error(`recorrido duplicado o sin id: ${item.id}`);caseIds.add(item.id);
    validateState(resolveStateSpec(item.initial,contract),contract,`${item.id}.initial`);
    for(const rid of item.steps)if(!ids.has(rid)){broken+=1;throw new Error(`${item.id}: referencia rota ${rid}`);}
  }
  for(const rid of contract.b06_b07_subset.row_ids)if(!ids.has(rid))throw new Error(`B06/B07 fila inexistente ${rid}`);
  for(const cid of contract.b06_b07_subset.scenario_ids)if(!caseIds.has(cid))throw new Error(`B06/B07 recorrido inexistente ${cid}`);
  return{contradictions,impossible,broken,rowCount:ids.size,caseCount:caseIds.size};
}
async function cli(){
  const[c,k]=await Promise.all([contractPath,casesPath].map(async p=>JSON.parse(await readFile(p,"utf8"))));
  const r=validateContractConsistency(c,k);
  console.log("PASS");console.log(`${r.contradictions} contradicciones`);console.log(`${r.impossible} estados iniciales imposibles`);console.log(`${r.broken} referencias rotas`);console.log(`${r.rowCount} filas contractuales / ${r.caseCount} recorridos canónicos`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)cli().catch(e=>{console.error(`FAIL: ${e.message}`);process.exitCode=1;});
