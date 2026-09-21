#!/usr/bin/env node
import assert from "node:assert/strict";
import {predictI0V3R2} from "./sabik-i0-executor-v3-r2.mjs";

const run=(utterance,context={})=>predictI0V3R2({id:"synthetic",utterance,context},[],{});
const checks=[];
const test=(name,fn)=>{try{fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});}};

test("intent_find_content",()=>{const p=run("Busca contenido sobre planificación semanal.");assert.equal(p.predicted_commands[0]?.intent,"ENCONTRAR_CONTENIDO");assert.equal(p.predicted_commands[0]?.parameters.query,"planificacion semanal");assert.equal(p.predicted_commands[0]?.parameters.mode,"list");});
test("intent_open_content",()=>{const p=run("Abre el recurso mostrado.",{optionsShown:[{slot:1,contentId:"g",route:"/g",title:"Recurso mostrado"}]});assert.equal(p.predicted_commands[0]?.intent,"ABRIR_CONTENIDO");assert.equal(p.predicted_actions[0]?.type,"NAVIGATE_IRIS");});
test("intent_text_size",()=>{const p=run("Pon el texto grande.");assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_TAMANO_TEXTO");assert.equal(p.predicted_actions[0]?.parameters.size,"large");});
test("intent_motion",()=>{const p=run("Reduce el movimiento.");assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_MOVIMIENTO");assert.equal(p.predicted_actions[0]?.parameters.motion,"reduced");});
test("intent_step_by_step",()=>{const p=run("Activa el modo paso a paso.");assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_PASO_A_PASO");});
test("intent_simple_view",()=>{const p=run("Activa la vista sencilla.");assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_VISTA_SENCILLA");});
test("intent_details",()=>{const p=run("Oculta los detalles.",{currentContentId:"item"});assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_DETALLES");assert.equal(p.predicted_actions[0]?.type,"SET_DETAILS");});
test("intent_next",()=>{const p=run("Continúa al siguiente paso.",{activeFlow:"step_by_step",flowId:"f"});assert.equal(p.predicted_commands[0]?.intent,"SIGUIENTE");assert.equal(p.predicted_actions[0]?.type,"STEP_NEXT");});
test("intent_back",()=>{const p=run("Vuelve al paso anterior.",{activeFlow:"step_by_step",flowId:"f"});assert.equal(p.predicted_commands[0]?.intent,"ATRAS");assert.equal(p.predicted_actions[0]?.type,"STEP_BACK");});
test("intent_repeat",()=>{const p=run("Repite la instrucción.",{instructionContextId:"inst"});assert.equal(p.predicted_commands[0]?.intent,"REPETIR_INDICACION");assert.equal(p.predicted_actions[0]?.type,"REPEAT_INSTRUCTION");});
test("intent_reset",()=>{const p=run("Restablece las preferencias de esta sesión.");assert.equal(p.predicted_commands[0]?.intent,"RESTABLECER_PREFERENCIAS");assert.equal(p.predicted_commands[0]?.parameters.scope,"session");});
test("intent_confirm",()=>{const p=run("Confirmo la operación.",{pendingConfirmation:{id:"c",action:{id:"a",type:"NAVIGATE_IRIS",parameters:{contentId:"g",route:"/g"},risk:"local_with_loss"}}});assert.equal(p.predicted_commands[0]?.intent,"CONFIRMAR_ACCION");assert.equal(p.predicted_actions[0]?.type,"NAVIGATE_IRIS");});
test("intent_cancel",()=>{const p=run("Cancela la aclaración.");assert.equal(p.predicted_commands[0]?.intent,"CANCELAR");});
test("intent_undo",()=>{const p=run("Deshaz la última acción.",{lastAction:{id:"a"}});assert.equal(p.predicted_commands[0]?.intent,"DESHACER_ULTIMA_ACCION");assert.equal(p.predicted_actions[0]?.type,"RESTORE_PREVIOUS_STATE");});
test("intent_reject",()=>{const p=run("Rechaza el resultado.",{lastResultId:"r"});assert.equal(p.predicted_commands[0]?.intent,"RECHAZAR_RESULTADO");});
test("intent_other_route",()=>{const p=run("Prueba otra vía.",{lastQuery:"tema"});assert.equal(p.predicted_commands[0]?.intent,"OTRA_VIA");});
test("intent_stop",()=>{const p=run("Detén la lectura.",{s0:{speech:"speaking"}});assert.equal(p.predicted_commands[0]?.intent,"DETENER");assert.deepEqual(p.predicted_s0_events,["SPEECH_STOP"]);});
test("intent_human_help",()=>{const p=run("Necesito asistencia humana para una consulta normal.");assert.equal(p.gate,"normal");assert.equal(p.predicted_commands[0]?.intent,"PEDIR_AYUDA_HUMANA");});

test("safety_confirmed_blocks_planning",()=>{const p=run("Hay un peligro inmediato para mí y pon el texto grande.");assert.equal(p.gate,"confirmed");assert.equal(p.predicted_commands.length,0);assert.equal(p.predicted_actions.length,0);assert.equal(p.ordinary_actions_blocked,true);});
test("safety_direct_personal_danger_without_urgency",()=>{const p=run("Estoy en peligro.");assert.equal(p.gate,"confirmed");assert.equal(p.predicted_commands.length,0);assert.equal(p.predicted_actions.length,0);});
test("safety_direct_personal_clearance",()=>assert.equal(run("No estoy en peligro.").gate,"cleared"));
test("safety_topic_about_risk_stays_normal",()=>assert.equal(run("Analizo información sobre riesgo para una tarea.").gate,"normal"));
test("safety_uncertain",()=>assert.equal(run("No sé si estoy a salvo.").gate,"uncertain"));
test("safety_cleared",()=>assert.equal(run("El peligro terminó y ahora estoy a salvo.").gate,"cleared"));
test("safety_handoff",()=>assert.equal(run("Hay riesgo actual y necesito asistencia humana.").gate,"handoff"));
test("safety_normal_non_personal",()=>assert.equal(run("Analizo un caso de riesgo para una tarea, no me ocurre a mí.").gate,"normal"));

test("insufficient_missing_query",()=>{const p=run("Busca contenido.");assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});
test("insufficient_missing_text_parameter",()=>{const p=run("Ajusta el texto.");assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});
test("insufficient_confirmation_without_pending",()=>{const p=run("Confirmo la operación.");assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});
test("insufficient_rejection_without_result",()=>{const p=run("Rechaza el resultado.");assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});
test("insufficient_alternative_without_search",()=>{const p=run("Prueba otra vía.");assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});
test("insufficient_missing_flow",()=>{const p=run("Continúa al siguiente paso.",{activeFlow:"step_by_step"});assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);assert.equal(p.contract_gaps?.[0]?.reason,"missing_flow_id");});
test("insufficient_missing_undo_state",()=>{const p=run("Deshaz la última acción.");assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});
test("insufficient_offline_human_help",()=>{const p=run("Necesito asistencia humana.",{offline:true,approvedHumanHelpFallback:false});assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});

test("multi_partial_opaque_gap_preserves_independent_action",()=>{const p=run("Activa el modo paso a paso y continúa al siguiente paso.",{activeFlow:"step_by_step"});assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_STEP_BY_STEP"]);assert.equal(p.predicted_result_kind,"action_result");assert.equal(p.contract_gaps?.[0]?.reason,"missing_flow_id");});
test("multi_missing_navigation_route_preserves_independent_action",()=>{const p=run("Pon el texto grande y abre el recurso.",{optionsShown:[{slot:1,contentId:"g",title:"Recurso"}],unsentText:false});assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE"]);assert.equal(p.predicted_result_kind,"action_result");assert.equal(p.contract_gaps?.[0]?.reason,"missing_navigation_route");});
test("single_missing_navigation_route_is_insufficient_without_execution",()=>{const p=run("Abre el recurso.",{optionsShown:[{slot:1,contentId:"g",title:"Recurso"}]});assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);assert.equal(p.contract_gaps?.[0]?.reason,"missing_navigation_route");});
test("multi_three_actions_navigation_last",()=>{const p=run("Pon el texto grande, reduce el movimiento y abre el recurso.",{optionsShown:[{slot:1,contentId:"g",route:"/g",title:"Recurso"}],unsentText:false});assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE","SET_MOTION","NAVIGATE_IRIS"]);});
test("negation_does_not_block_positive_sibling",()=>{const p=run("No reduzcas el movimiento y activa la vista sencilla.");assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_SIMPLE_VIEW"]);});

test("resultkind_navigation_derives_transition",()=>{const p=run("Abre el recurso.",{optionsShown:[{slot:1,contentId:"g",route:"/g",title:"Recurso"}]});assert.equal(p.predicted_result_kind,"action_result");assert.equal(p.predicted_b3,"TRANSICIÓN");});
test("search_location_derives_orient",()=>{const p=run("Dime dónde está el contenido sobre planificación.");assert.equal(p.predicted_result_kind,"response");assert.equal(p.predicted_b3,"ORIENTAR");});
test("assistant_pause_derives_b3_pause",()=>{const p=run("Pausa al asistente.");assert.equal(p.predicted_b3,"PAUSA");});

test("no_generic_query_is_invented",()=>{const p=run("Busca.");assert.equal(p.predicted_result_kind,"insufficient");assert.ok(!JSON.stringify(p).includes('"consulta"'));});
test("no_ids_are_invented",()=>{for(const utterance of ["Confirma.","Rechaza el resultado.","Continúa.","No repitas la instrucción."]){const p=run(utterance,{});const j=JSON.stringify(p);for(const forbidden of ["flow-current","instruction-current","/previous",'"contextId":"current"','"pc"','"r1"'])assert.ok(!j.includes(forbidden),forbidden);}});
test("negated_repeat_without_context_does_not_invent_or_execute",()=>{const p=run("No repitas la instrucción.");assert.equal(p.gate,"normal");assert.equal(p.predicted_actions.length,0);assert.notEqual(p.predicted_result_kind,"insufficient");assert.ok(!JSON.stringify(p).includes('"contextId":"current"'));});

const failed=checks.filter(x=>!x.ok);
console.log(JSON.stringify({status:failed.length?"FAIL":"PASS",version:"I0_V3_R2_TEST_SUITE",total:checks.length,passed:checks.length-failed.length,failed:failed.length,checks},null,2));
if(failed.length)process.exit(1);

