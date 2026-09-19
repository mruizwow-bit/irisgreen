#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { validateContractConsistency, rowsAsObjects } from "./validate-s0-contract-consistency.mjs";
import { runRow, runScenarios } from "./run-s0-contract.mjs";

const here=dirname(fileURLToPath(import.meta.url));
const contractPath=resolve(here,"s0-state-contract.json"),casesPath=resolve(here,"s0-transition-cases.json"),indexPath=resolve(here,"s0-contract-addendum-b06-b07.json");
const require=createRequire(import.meta.url);
function parseArgs(argv){const o={module:null};for(let i=2;i<argv.length;i+=1){if(argv[i]==="--module")o.module=argv[++i];else if(argv[i]==="--help")o.help=true;else throw new Error(`Argumento desconocido: ${argv[i]}`);}return o;}
function loadTransition(modulePath){const r=require.resolve(modulePath);delete require.cache[r];const m=require(r);const t=m.transitionSabikState??m.default?.transitionSabikState;if(typeof t!=="function")throw new Error("La implementación debe exportar transitionSabikState");return t;}
async function main(){
  const args=parseArgs(process.argv);if(args.help){console.log("Uso: node tests/specs/sabik/run-s0-addendum-b06-b07.mjs [--module <módulo puro S0>]");return;}
  const[contract,cases,index]=await Promise.all([contractPath,casesPath,indexPath].map(async p=>JSON.parse(await readFile(p,"utf8"))));validateContractConsistency(contract,cases);
  if(index.status!=="HISTORICAL_SUBSET_INDEX"||index.normative_source!=="tests/specs/sabik/s0-state-contract.json")throw new Error("La adenda no es un índice de la fuente única");
  if(JSON.stringify(index.row_ids)!==JSON.stringify(contract.b06_b07_subset.row_ids)||JSON.stringify(index.scenario_ids)!==JSON.stringify(contract.b06_b07_subset.scenario_ids))throw new Error("índice B06/B07 desincronizado");
  const rows=new Map(rowsAsObjects(contract).map(r=>[r.id,r])),casesSet=new Set(cases.cases.map(c=>c.id));
  for(const id of index.row_ids)if(!rows.has(id))throw new Error(`fila inexistente ${id}`);for(const id of index.scenario_ids)if(!casesSet.has(id))throw new Error(`recorrido inexistente ${id}`);
  console.log(`QA subconjunto B06/B07 OK: ${index.row_ids.length} filas, ${index.scenario_ids.length} recorridos; 0 expectativas independientes.`);
  if(!args.module){console.log("NO_IMPLEMENTATION_EXECUTED: subconjunto validado contra la fuente consolidada.");return;}
  const t=loadTransition(resolve(process.cwd(),args.module));for(const id of index.row_ids)await runRow(rows.get(id),contract,t);await runScenarios(contract,cases,t,new Set(index.scenario_ids));console.log("ACEPTA_SUBCONJUNTO_B06_B07");
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)main().catch(e=>{console.error(`BLOQUEO_QA_S0_ADENDA: ${e.message}`);process.exitCode=1;});
