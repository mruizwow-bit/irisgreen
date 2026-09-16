#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import process from "node:process";
import { validateContractConsistency, validateState, resolveStateSpec, rowsAsObjects } from "./validate-s0-contract-consistency.mjs";

const here=dirname(fileURLToPath(import.meta.url));
const contractPath=resolve(here,"s0-state-contract.json"), casesPath=resolve(here,"s0-transition-cases.json"), corpusPath=resolve(here,"../../fixtures/sabik/conversation-corpus.v1.json");
const require=createRequire(import.meta.url);
const REQUIRED_CORPUS_FIELDS=["id","idioma","entrada","contexto_anterior","intencion","objetivo","conceptos_esperados","conceptos_prohibidos","tipo_salida","accion_permitida","accion_prohibida","pregunta_si_no","recurso_humano_si_no","fuentes_aceptables","estado_final","incertidumbre"];
const FORBIDDEN_SOURCE_PATTERNS=[[/\bdocument\b/,"DOM: document"],[/\bwindow\b/,"DOM/global: window"],[/\blocalStorage\b/,"storage: localStorage"],[/\bsessionStorage\b/,"storage: sessionStorage"],[/\bindexedDB\b/,"storage: indexedDB"],[/\bfetch\s*\(/,"network: fetch"],[/\bXMLHttpRequest\b/,"network: XMLHttpRequest"],[/\bWebSocket\b/,"network: WebSocket"],[/\bspeechSynthesis\b/,"effect: speechSynthesis"],[/\bDate\.now\s*\(/,"clock: Date.now"],[/\bperformance\.now\s*\(/,"clock: performance.now"],[/\bMath\.random\s*\(/,"random: Math.random"]];
const clone=v=>JSON.parse(JSON.stringify(v));
function stable(v){if(Array.isArray(v))return v.map(stable);if(!v||typeof v!=="object")return v;return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));}
const same=(a,b)=>JSON.stringify(stable(a))===JSON.stringify(stable(b));
function deepFreeze(v){if(!v||typeof v!=="object"||Object.isFrozen(v))return v;Object.freeze(v);for(const c of Object.values(v))deepFreeze(c);return v;}
function parseArgs(argv){const o={module:null};for(let i=2;i<argv.length;i+=1){if(argv[i]==="--module")o.module=argv[++i];else if(argv[i]==="--help")o.help=true;else throw new Error(`Argumento desconocido: ${argv[i]}`);}return o;}
function partialMismatch(actual,expected,path=""){for(const[k,v]of Object.entries(expected||{})){const p=path?`${path}.${k}`:k;if(!(k in actual))return`falta ${p}`;if(v&&typeof v==="object"&&!Array.isArray(v)){const e=partialMismatch(actual[k],v,p);if(e)return e;}else if(!same(actual[k],v))return`${p}: esperado ${JSON.stringify(v)}, recibido ${JSON.stringify(actual[k])}`;}return null;}
function validateCorpus(corpus){const ids=new Set();for(const item of corpus.cases){for(const f of REQUIRED_CORPUS_FIELDS)if(!(f in item))throw new Error(`${item.id||"<sin id>"}: falta ${f}`);if(ids.has(item.id))throw new Error(`id de corpus duplicado: ${item.id}`);ids.add(item.id);if(!["es","en"].includes(item.idioma))throw new Error(`${item.id}: idioma no soportado`);if(typeof item.pregunta_si_no!=="boolean"||typeof item.recurso_humano_si_no!=="boolean")throw new Error(`${item.id}: flags inválidos`);}return ids.size;}
function normalizeResult(result,input){if(result&&typeof result==="object"&&"state" in result)return{state:result.state,accepted:result.accepted!==false,reason:result.reason??null};return{state:result,accepted:true,reason:null};}
async function guardedTransition(transition,state,event){
  const before=clone(state),eb=clone(event),fs=deepFreeze(clone(state)),fe=deepFreeze(clone(event));const o={fetch:globalThis.fetch,dateNow:Date.now,random:Math.random};let effect=null;
  globalThis.fetch=async()=>{effect="fetch";throw new Error("QA_PURITY_FETCH_FORBIDDEN");};Date.now=()=>{effect="Date.now";throw new Error("QA_PURITY_CLOCK_FORBIDDEN");};Math.random=()=>{effect="Math.random";throw new Error("QA_PURITY_RANDOM_FORBIDDEN");};
  try{const r=await transition(fs,fe);if(effect)throw new Error(`violación de pureza: ${effect}`);if(!same(fs,before))throw new Error("mutación del estado");if(!same(fe,eb))throw new Error("mutación del evento");return normalizeResult(r,before);}
  catch(e){if(effect)throw new Error(`violación de pureza: ${effect}`);return{state:before,accepted:false,reason:e?.message||String(e),threw:true};}
  finally{if(o.fetch===undefined)delete globalThis.fetch;else globalThis.fetch=o.fetch;Date.now=o.dateNow;Math.random=o.random;}
}
function stripCommentsAndStrings(s){return s.replace(/\/\*[\s\S]*?\*\//g," ").replace(/\/\/.*$/gm," ").replace(/`(?:\\.|[^`\\])*`/gs," ").replace(/"(?:\\.|[^"\\])*"/g," ").replace(/'(?:\\.|[^'\\])*'/g," ");}
async function assertStaticPurity(modulePath){const source=stripCommentsAndStrings(await readFile(modulePath,"utf8"));const v=FORBIDDEN_SOURCE_PATTERNS.filter(([p])=>p.test(source)).map(([,l])=>l);if(v.length)throw new Error(`pureza estática incumplida: ${v.join(", ")}`);}
function loadTransition(modulePath){const r=require.resolve(modulePath);delete require.cache[r];const m=require(r);const t=m.transitionSabikState??m.default?.transitionSabikState;if(typeof t!=="function")throw new Error("La implementación debe exportar transitionSabikState");return t;}

export async function runRow(row,contract,transition){
  const prev=resolveStateSpec([row.previous_ref,row.previous_revision],contract),exp=resolveStateSpec([row.expected_ref,row.expected_revision],contract),event={type:row.event,...clone(row.payload||{})};
  validateState(prev,contract,`${row.id}.input`);
  const a=await guardedTransition(transition,prev,event),b=await guardedTransition(transition,prev,event);
  if(!same(a,b))throw new Error(`${row.id}: no determinista`);
  if(row.allowed){
    if(!a.accepted)throw new Error(`${row.id}: permitido rechazado: ${a.reason||"sin razón"}`);validateState(a.state,contract,`${row.id}.output`);
    const m=partialMismatch(a.state,exp);if(m)throw new Error(`${row.id}: ${m}`);if(a.state.revision!==prev.revision+1)throw new Error(`${row.id}: revision no +1`);return a.state;
  }
  if(a.accepted)throw new Error(`${row.id}: prohibido aceptado`);if(!a.reason)throw new Error(`${row.id}: rechazo no explícito`);if(!same(a.state,prev))throw new Error(`${row.id}: rechazo mutó estado`);return clone(prev);
}
export async function runScenarios(contract,cases,transition,filterIds=null){
  const rows=new Map(rowsAsObjects(contract).map(r=>[r.id,r])),selected=filterIds?cases.cases.filter(c=>filterIds.has(c.id)):cases.cases;
  for(const item of selected){let state=resolveStateSpec(item.initial,contract);const preserved=Object.fromEntries((item.preserve||[]).map(k=>[k,clone(state[k])]));
    for(const rid of item.steps){const row=rows.get(rid);if(!row)throw new Error(`${item.id}: fila inexistente ${rid}`);const prev=resolveStateSpec([row.previous_ref,row.previous_revision],contract),m=partialMismatch(state,prev);if(m)throw new Error(`${item.id}/${rid}: precondición: ${m}`);state=await runRow(row,contract,transition);}
    const m=partialMismatch(state,item.final_expect||{});if(m)throw new Error(`${item.id}: ${m}`);for(const[k,v]of Object.entries(preserved))if(!same(state[k],v))throw new Error(`${item.id}: no preservó ${k}`);validateState(state,contract,`${item.id}.final`);
  }
}
async function runInvalidInputs(contract,transition){for(const item of contract.invalid_input_cases||[]){const r=await guardedTransition(transition,item.state,item.event);if(r.accepted)throw new Error(`${item.id}: metadato inválido aceptado`);if(!same(r.state,item.state))throw new Error(`${item.id}: rechazo mutó estado inválido`);}}
export async function loadQa(){const[contract,cases,corpus]=await Promise.all([contractPath,casesPath,corpusPath].map(async p=>JSON.parse(await readFile(p,"utf8"))));return{contract,cases,corpus};}
async function main(){
  const args=parseArgs(process.argv);if(args.help){console.log("Uso: node tests/specs/sabik/run-s0-contract.mjs [--module <módulo puro S0>]");return;}
  const{contract,cases,corpus}=await loadQa();const c=validateContractConsistency(contract,cases),n=validateCorpus(corpus);console.log(`QA contrato consolidado OK: ${c.rowCount} filas, ${c.caseCount} recorridos, ${n} casos conversacionales.`);
  if(!args.module){console.log("NO_IMPLEMENTATION_EXECUTED: estructura, referencias, recorridos, ausencia de contradicciones, enumeraciones y corpus validados.");return;}
  const modulePath=resolve(process.cwd(),args.module);await assertStaticPurity(modulePath);const transition=loadTransition(modulePath);for(const row of rowsAsObjects(contract))await runRow(row,contract,transition);await runScenarios(contract,cases,transition);await runInvalidInputs(contract,transition);console.log("ACEPTA_PUERTA_AUTOMATICA_S0");
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(e=>{console.error(`BLOQUEO_QA_S0: ${e.message}`);process.exitCode=1;});
