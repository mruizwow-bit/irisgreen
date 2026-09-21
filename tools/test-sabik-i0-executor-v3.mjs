#!/usr/bin/env node
import assert from "node:assert/strict";
import {predictI0V3,any} from "./sabik-i0-executor-v3.mjs";

const cfg={fallback_accept_score_min:0.34};
const run=(utterance,context={},development=[])=>predictI0V3({id:"synthetic",utterance,context},development,cfg);
const checks=[];const test=(name,fn)=>{try{fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});}};

test("safety_confirmed_direct",()=>{const p=run("Ahora existe un peligro urgente para mí.");assert.equal(p.gate,"confirmed");assert.deepEqual(p.predicted_s0_events,["RISK_CONFIRMED"]);assert.equal(p.predicted_actions.length,0);});
test("safety_uncertain_direct",()=>{const p=run("Dudo de si mi propia seguridad está garantizada.");assert.equal(p.gate,"uncertain");assert.deepEqual(p.predicted_s0_events,["RISK_UNCERTAIN"]);});
test("safety_cleared_direct",()=>{const p=run("El peligro que había ha terminado y ahora estoy segura.");assert.equal(p.gate,"cleared");assert.deepEqual(p.predicted_s0_events,["RISK_CLEARED"]);});
test("safety_handoff_direct",()=>{const p=run("Hay un riesgo actual y necesito apoyo humano.");assert.equal(p.gate,"handoff");assert.deepEqual(p.predicted_s0_events,["HUMAN_HANDOFF"]);});
test("safety_non_personal",()=>{const p=run("Es material educativo sobre señales de riesgo; no trata de mi situación.");assert.equal(p.gate,"normal");});
test("safety_blocks_ordinary_action",()=>{const p=run("Hay un peligro inmediato para mí y pon el texto grande.");assert.equal(p.gate,"confirmed");assert.equal(p.predicted_commands.length,0);assert.equal(p.predicted_actions.length,0);});
test("safety_later_confirmed_overrides_earlier_clear",()=>{const p=run("Antes el riesgo terminó, pero ahora existe un peligro urgente.");assert.equal(p.gate,"confirmed");});
test("safety_later_clear_overrides_earlier_danger",()=>{const p=run("Antes existía peligro, pero ahora estoy fuera de riesgo.");assert.equal(p.gate,"cleared");});
test("human_help_nonurgent_not_safety",()=>{const p=run("Quiero orientación humana para una gestión sin urgencia.");assert.equal(p.gate,"normal");assert.equal(p.predicted_commands[0]?.intent,"PEDIR_AYUDA_HUMANA");});

test("negation_simple_text_size",()=>{const p=run("No pongas el texto en grande.");assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_TAMANO_TEXTO");assert.equal(p.predicted_actions.length,0);});
test("negation_with_positive_continuation",()=>{const p=run("No reduzcas el movimiento y activa la vista sencilla.");assert.deepEqual(p.predicted_commands.map(x=>x.intent),["CAMBIAR_MOVIMIENTO","CAMBIAR_VISTA_SENCILLA"]);assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_SIMPLE_VIEW"]);});
test("negation_contrast_scope",()=>{const p=run("Activa la vista sencilla, pero no reduzcas el movimiento.");assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_SIMPLE_VIEW"]);});
test("correction_replaces_prior_target",()=>{const p=run("Activa la vista sencilla; mejor usa la interfaz completa.");assert.deepEqual(p.predicted_commands,[{intent:"CAMBIAR_VISTA_SENCILLA",parameters:{enabled:false}}]);assert.deepEqual(p.predicted_actions,[{type:"SET_SIMPLE_VIEW",parameters:{enabled:false},risk:"local_reversible"}]);});
test("negated_speech_positive_other_action",()=>{const p=run("No detengas la lectura y pon el texto grande.",{s0:{speech:"speaking"}});assert.ok(!p.predicted_s0_events.includes("SPEECH_STOP"));assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE"]);});
test("negated_back_positive_repeat",()=>{const p=run("No vuelvas a la página anterior; repite la instrucción.");assert.ok(!p.predicted_actions.some(x=>x.type==="NAVIGATE_IRIS"));assert.ok(p.predicted_actions.some(x=>x.type==="REPEAT_INSTRUCTION"));});
test("negated_assistant_stop",()=>{const p=run("No pauses al asistente.",{s0:{speech:"speaking"}});assert.deepEqual(p.predicted_s0_events,[]);});
test("positive_assistant_stop",()=>{const p=run("Pausa al asistente.",{s0:{speech:"speaking"}});assert.deepEqual(p.predicted_s0_events,["PAUSE_ASSISTANT"]);});

test("multi_two_reversible",()=>{const p=run("Reduce el movimiento y activa la vista sencilla.");assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_MOTION","SET_SIMPLE_VIEW"]);});
test("multi_three_reversible",()=>{const p=run("Pon el texto grande, reduce el movimiento y activa la vista sencilla.");assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE","SET_MOTION","SET_SIMPLE_VIEW"]);});
test("multi_mixed_risk_navigation_last",()=>{const p=run("Pon el texto grande y abre la guía mostrada.",{optionsShown:[{slot:1,contentId:"guide",route:"/guide",title:"Guía mostrada"}],unsentText:false});assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE","NAVIGATE_IRIS"]);});
test("multi_mixed_risk_partial_block",()=>{const p=run("Pon el texto grande y abre la guía mostrada.",{optionsShown:[{slot:1,contentId:"guide",route:"/guide",title:"Guía mostrada"}],unsentText:true});assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE"]);assert.equal(p.predicted_result_kind,"clarification");});
test("multi_search_plus_action",()=>{const p=run("Busca información sobre descansos y aumenta el texto.");assert.deepEqual(p.predicted_commands.map(x=>x.intent),["ENCONTRAR_CONTENIDO","CAMBIAR_TAMANO_TEXTO"]);assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE"]);});
test("multi_details_repeat",()=>{const p=run("Oculta la información ampliada y repite el mensaje de guía.",{activeFlow:"step_by_step"});assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_DETAILS","REPEAT_INSTRUCTION"]);});
test("multi_step_next_preserves_two_actions",()=>{const dev=[{id:"d",utterance:"Avanza al siguiente paso.",context:{activeFlow:"step_by_step"},expected_gate:"normal",expected_commands:[{intent:"SIGUIENTE",parameters:{scope:"step"}}],expected_actions:[{type:"STEP_NEXT",parameters:{flowId:"synthetic-flow"},risk:"local_reversible"}],expected_s0_events:[],expected_result_kind:"action_result",expected_b3:"TRANSICIÓN"}];const p=run("Activa el recorrido por pasos y sigue un paso.",{activeFlow:"step_by_step"},dev);assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_STEP_BY_STEP","STEP_NEXT"]);});

test("insufficient_retrieval_empty",()=>{const p=run("Busca contenido sobre planificación.",{retrievalEmpty:true});assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);assert.equal(p.predicted_b3,"PRESENTE");});
test("insufficient_missing_undo",()=>{const p=run("Deshaz el último cambio.");assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);});
test("insufficient_offline_human_help",()=>{const p=run("Quiero asistencia humana verificada.",{offline:true,approvedHumanHelpFallback:false});assert.equal(p.predicted_result_kind,"insufficient");assert.equal(p.predicted_actions.length,0);assert.equal(p.predicted_b3,"PRESENTE");});

test("clarification_underspecified",()=>{const p=run("Vuelve a lo anterior.");assert.equal(p.predicted_result_kind,"clarification");assert.deepEqual(p.predicted_s0_events,["ASK_CLARIFICATION"]);});
test("clarification_ambiguous_open",()=>{const p=run("Abre una de esas opciones.",{optionsShown:[{slot:1,contentId:"a",route:"/a",title:"Primera ficha"},{slot:2,contentId:"b",route:"/b",title:"Segunda ficha"}]});assert.equal(p.predicted_result_kind,"clarification");assert.equal(p.predicted_actions.length,0);});
test("pending_clarification_blocks_loss",()=>{const p=run("Abre la guía mostrada.",{optionsShown:[{slot:1,contentId:"guide",route:"/guide",title:"Guía mostrada"}],pendingClarification:{id:"q",kind:"choose_content",candidates:[]}});assert.equal(p.predicted_actions.length,0);assert.equal(p.predicted_result_kind,"clarification");});
test("unsent_text_blocks_navigation",()=>{const p=run("Abre la guía mostrada.",{optionsShown:[{slot:1,contentId:"guide",route:"/guide",title:"Guía mostrada"}],unsentText:true});assert.equal(p.predicted_actions.length,0);});
test("confirmation_executes_pending_action",()=>{const p=run("Confirmo la operación pendiente.",{pendingConfirmation:{id:"pc",action:{id:"nav",type:"NAVIGATE_IRIS",parameters:{contentId:"x",route:"/x"},risk:"local_with_loss"},parameterHash:"h",sessionId:"s",expiresAtMonotonicMs:999999}});assert.deepEqual(p.predicted_actions,[{type:"NAVIGATE_IRIS",parameters:{contentId:"x",route:"/x"},risk:"local_with_loss"}]);});
test("cancel_pending_clarification",()=>{const p=run("Descarta la pregunta pendiente.");assert.deepEqual(p.predicted_commands,[{intent:"CANCELAR",parameters:{target:"clarification"}}]);});
test("deictic_second_option",()=>{const p=run("Abre el segundo recurso.",{optionsShown:[{slot:1,contentId:"a",route:"/a",title:"Recurso A"},{slot:2,contentId:"b",route:"/b",title:"Recurso B"}]});assert.equal(p.predicted_commands[0]?.parameters.contentId,"b");});
test("search_location_mode",()=>{const p=run("Dime dónde está el recurso sobre descansos.");assert.equal(p.predicted_commands[0]?.intent,"ENCONTRAR_CONTENIDO");assert.equal(p.predicted_commands[0]?.parameters.mode,"locate");});
test("navigation_is_always_last",()=>{const p=run("Reduce el movimiento, activa la vista sencilla y abre la guía mostrada.",{optionsShown:[{slot:1,contentId:"guide",route:"/guide",title:"Guía mostrada"}],unsentText:false});assert.equal(p.predicted_actions.at(-1)?.type,"NAVIGATE_IRIS");});
test("heuristic_score_not_probability",()=>{const p=run("Reduce el movimiento.");assert.equal(p.score_semantics,"evidence_score_not_probability");assert.equal("confidence_top1" in p,false);});


// V3-R1 structural ambiguity / decontamination tests.
test("any_escapes_regex_metacharacters",()=>{
  assert.equal(any("usa a.b ahora",["a.b"]),true);
  assert.equal(any("elige c++ despues",["c++"]),true);
  assert.equal(any("marca x? aqui",["x?"]),true);
  assert.equal(any("literal [abc] fin",["[abc]"]),true);
  assert.equal(any("texto ordinario",["a.b"]),false);
});
test("deictic_without_referent_paraphrase",()=>{
  const p=run("Oculta aquello por ahora.");
  assert.equal(p.predicted_result_kind,"clarification");
  assert.equal(p.reason,"deictic_without_referent");
});
test("generic_change_without_dimension_paraphrase",()=>{
  const p=run("Cambia algo de la configuración.");
  assert.equal(p.predicted_result_kind,"clarification");
});
test("generic_parameter_without_dimension_paraphrase",()=>{
  const p=run("Déjalo más grande.");
  assert.equal(p.predicted_result_kind,"clarification");
});
test("confirmation_without_pending_paraphrase",()=>{
  const p=run("Lo confirmo ahora.");
  assert.equal(p.predicted_result_kind,"clarification");
  assert.equal(p.reason,"confirmation_without_pending_operation");
});
test("rejection_without_result_paraphrase",()=>{
  const p=run("Rechaza ese resultado.");
  assert.equal(p.predicted_result_kind,"clarification");
  assert.equal(p.reason,"rejection_without_result");
});
test("cancellation_structural_paraphrase",()=>{
  const p=run("Anula la aclaración actual.");
  assert.deepEqual(p.predicted_commands,[{intent:"CANCELAR",parameters:{target:"clarification"}}]);
});
test("navigation_without_flow_paraphrase",()=>{
  const p=run("Prosigue.");
  assert.equal(p.predicted_result_kind,"clarification");
  assert.equal(p.reason,"navigation_without_active_flow");
});
test("page_navigation_without_context_paraphrase",()=>{
  const p=run("Regresa a la pantalla anterior.");
  assert.equal(p.predicted_result_kind,"clarification");
  assert.equal(p.reason,"page_navigation_without_previous_route");
});
test("alternative_without_previous_search_paraphrase",()=>{
  const p=run("Quiero otra vía.");
  assert.equal(p.predicted_result_kind,"clarification");
  assert.equal(p.reason,"alternative_without_previous_search");
});


test("generic_action_without_parameter_paraphrase",()=>{
  const p=run("Haz algo con ese ajuste.");
  assert.equal(p.predicted_result_kind,"clarification");
});
test("deictic_with_single_referent_counterexample",()=>{
  const p=run("Abre eso.",{optionsShown:[{slot:1,contentId:"guide",route:"/guide",title:"Guía"}]});
  assert.equal(p.predicted_commands[0]?.intent,"ABRIR_CONTENIDO");
});
test("confirmation_with_pending_counterexample",()=>{
  const p=run("Lo confirmo.",{pendingConfirmation:{id:"pc2",action:{id:"a",type:"NAVIGATE_IRIS",parameters:{contentId:"x",route:"/x"},risk:"local_with_loss"},parameterHash:"h",sessionId:"s",expiresAtMonotonicMs:999999}});
  assert.equal(p.predicted_commands[0]?.intent,"CONFIRMAR_ACCION");
});
test("alternative_with_previous_search_counterexample",()=>{
  const p=run("Quiero otra vía.",{lastQuery:"descansos"});
  assert.deepEqual(p.predicted_commands,[{intent:"OTRA_VIA",parameters:{query:"descansos"}}]);
});
test("navigation_with_active_flow_counterexample",()=>{
  const dev=[{id:"d",utterance:"Sigue con el paso.",context:{activeFlow:"step_by_step"},expected_gate:"normal",expected_commands:[{intent:"SIGUIENTE",parameters:{scope:"step"}}],expected_actions:[{type:"STEP_NEXT",parameters:{flowId:"synthetic-flow"},risk:"local_reversible"}],expected_s0_events:[],expected_result_kind:"action_result",expected_b3:"TRANSICIÓN"}];
  const p=run("Prosigue.",{activeFlow:"step_by_step"},dev);
  assert.equal(p.predicted_commands[0]?.intent,"SIGUIENTE");
});

const failed=checks.filter(x=>!x.ok);
console.log(JSON.stringify({status:failed.length?"FAIL":"PASS",total:checks.length,passed:checks.length-failed.length,failed:failed.length,checks},null,2));
if(failed.length)process.exit(1);

