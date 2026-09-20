#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const intents=new Set(["ENCONTRAR_CONTENIDO","ABRIR_CONTENIDO","CAMBIAR_TAMANO_TEXTO","CAMBIAR_MOVIMIENTO","CAMBIAR_PASO_A_PASO","CAMBIAR_VISTA_SENCILLA","CAMBIAR_DETALLES","SIGUIENTE","ATRAS","REPETIR_INDICACION","RESTABLECER_PREFERENCIAS","CONFIRMAR_ACCION","CANCELAR","DESHACER_ULTIMA_ACCION","RECHAZAR_RESULTADO","OTRA_VIA","DETENER","PEDIR_AYUDA_HUMANA"]);
const pseudo=new Set(["ASK_CLARIFICATION","OUT_OF_SCOPE","SAFETY_GATE","MULTI_ACTION_PLAN"]);
const gates=new Set(["normal","uncertain","confirmed","cleared","handoff"]),b3=new Set(["PRESENTE","ORIENTAR","TRANSICIÓN","PAUSA","CONFIRMAR"]),kinds=new Set(["response","action_result","clarification","insufficient","human_help","out_of_scope"]);
const files={development:"tests/development/sabik/i0/development.v0.4.jsonl",calibration:"tests/calibration/sabik/i0/calibration.v0.4.jsonl"};
const load=rel=>fs.readFileSync(path.join(root,rel),"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
let errors=[];
for(const [role,rel] of Object.entries(files)){const cases=load(rel),min=role==="development"?400:200,ids=new Set();if(cases.length<min)errors.push(`${role} has ${cases.length}, expected >=${min}`);
 for(const c of cases){for(const k of ["id","dataset_role","locale","utterance","context","expected_gate","expected_commands","expected_result_kind","expected_actions","expected_s0_events","should_execute","expected_b3","ambiguity","tags","notes"])if(!(k in c))errors.push(`${c.id||"NO_ID"} missing ${k}`);
  if(c.dataset_role!==role)errors.push(`${c.id} role mismatch`);if(ids.has(c.id))errors.push(`${c.id} duplicate`);ids.add(c.id);
  if(!gates.has(c.expected_gate))errors.push(`${c.id} bad gate`);if(!b3.has(c.expected_b3))errors.push(`${c.id} bad B3`);if(!kinds.has(c.expected_result_kind))errors.push(`${c.id} bad kind`);
  if(c.expected_commands.length>3)errors.push(`${c.id} >3 commands`);
  for(const x of c.expected_commands){if(!intents.has(x.intent))errors.push(`${c.id} non-v0.4 intent ${x.intent}`);if(pseudo.has(x.intent))errors.push(`${c.id} pseudo-intent ${x.intent}`);}
  if(c.expected_result_kind==="clarification"&&c.expected_s0_events.filter(x=>x==="ASK_CLARIFICATION").length>1)errors.push(`${c.id} repeated ASK_CLARIFICATION`);
  if(c.expected_gate!=="normal"&&c.expected_actions.length)errors.push(`${c.id} ordinary actions during safety`);
  if(c.expected_b3==="PAUSA"&&!c.expected_s0_events.includes("PAUSE_ASSISTANT"))errors.push(`${c.id} PAUSA without PAUSE_ASSISTANT`);
  if(c.expected_b3==="CONFIRMAR"&&c.expected_result_kind!=="clarification")errors.push(`${c.id} CONFIRMAR without confirmation/clarification result`);
 }}
if(errors.length){console.error(JSON.stringify({status:"FAIL",errors},null,2));process.exit(1);}
console.log(JSON.stringify({status:"PASS",development:load(files.development).length,calibration:load(files.calibration).length},null,2));
