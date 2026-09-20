#!/usr/bin/env node
import assert from "node:assert/strict";
import {predictI0V2} from "./sabik-i0-executor-v2.mjs";
import {selectCalibrationCandidate} from "./sabik-i0-calibration-v2-selection.mjs";

const run=(text,context={})=>predictI0V2({id:"synthetic",utterance:text,context},[]);

const checks=[]; const test=(name,fn)=>{try{fn();checks.push({name,ok:true});}catch(e){checks.push({name,ok:false,error:e.message});}};

// 1 reversible simple
test("reversible_simple",()=>{
  const p=run("Pon el texto grande.");
  assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_TAMANO_TEXTO");
  assert.deepEqual(p.predicted_actions,[{type:"SET_TEXT_SIZE",parameters:{size:"large"},risk:"local_reversible"}]);
});

// 2 with_loss direct
test("with_loss_direct",()=>{
  const p=run("Abre la guía mostrada.",{optionsShown:[{slot:1,contentId:"guide-a",route:"/guide-a",title:"Guía mostrada"}],unsentText:false});
  assert.equal(p.predicted_actions.at(-1)?.type,"NAVIGATE_IRIS");
  assert.equal(p.action_decisions[0]?.decision,"execute");
});

// 3 multi reversible + reversible
test("multi_reversible_reversible",()=>{
  const p=run("Reduce el movimiento y activa vista sencilla.");
  assert.deepEqual(p.predicted_commands.map(x=>x.intent),["CAMBIAR_MOVIMIENTO","CAMBIAR_VISTA_SENCILLA"]);
  assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_MOTION","SET_SIMPLE_VIEW"]);
});

// 4 reversible + with_loss; navigation last
test("multi_reversible_with_loss_navigation_last",()=>{
  const p=run("Pon la letra grande y abre el recurso mostrado.",{optionsShown:[{slot:1,contentId:"resource",route:"/resource",title:"Recurso mostrado"}],unsentText:false});
  assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE","NAVIGATE_IRIS"]);
});

// 5 partiality permitted search + reversible
test("partiality_search_reversible",()=>{
  const p=run("Busca información sobre descansos y reduce el movimiento.");
  assert.equal(p.predicted_commands.length,2);
  assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_MOTION"]);
  assert.equal(p.predicted_result_kind,"response");
});

// 6 partiality: reversible executes, with_loss blocked by real loss
test("partiality_with_loss_blocked",()=>{
  const p=run("Pon la letra grande y abre el recurso mostrado.",{optionsShown:[{slot:1,contentId:"resource",route:"/resource",title:"Recurso mostrado"}],unsentText:true});
  assert.deepEqual(p.predicted_actions.map(x=>x.type),["SET_TEXT_SIZE"]);
  assert.equal(p.action_decisions.find(x=>x.risk==="local_with_loss")?.decision,"blocked_clarification");
  assert.equal(p.predicted_result_kind,"clarification");
});

// 7 negation action scope
test("negation_blocks_only_target",()=>{
  const p=run("No reduzcas el movimiento.");
  assert.equal(p.predicted_commands[0]?.intent,"CAMBIAR_MOVIMIENTO");
  assert.equal(p.predicted_actions.length,0);
  assert.equal(p.action_decisions[0]?.decision,"blocked_negation");
});

// 8 negated speech stop
test("negation_speech",()=>{
  const p=run("Sigue leyendo, no detengas la lectura.",{s0:{speech:"speaking"}});
  assert.equal(p.predicted_commands[0]?.intent,"DETENER");
  assert.deepEqual(p.predicted_s0_events,[]);
});

// 9 positive speech control
test("positive_speech",()=>{
  const p=run("Detén la lectura.",{s0:{speech:"speaking"}});
  assert.equal(p.predicted_commands[0]?.intent,"DETENER");
  assert.deepEqual(p.predicted_s0_events,["SPEECH_STOP"]);
});

// 10 insufficient offline human help
test("insufficient_offline_human_help",()=>{
  const p=run("Necesito ayuda humana verificada.",{offline:true,approvedHumanHelpFallback:false});
  assert.equal(p.predicted_result_kind,"insufficient");
  assert.equal(p.predicted_actions.length,0);
  assert.equal(p.predicted_b3,"PRESENTE");
});

// 11 safety before ordinary policy
test("safety_precedes_ordinary",()=>{
  const p=run("Estoy en peligro inmediato; además pon la letra grande.");
  assert.equal(p.gate,"confirmed");
  assert.equal(p.predicted_commands.length,0);
  assert.equal(p.predicted_actions.length,0);
  assert.deepEqual(p.predicted_s0_events,["RISK_CONFIRMED"]);
});

// 12 clarification
test("clarification_underspecified",()=>{
  const p=run("Vuelve a lo anterior.");
  assert.equal(p.predicted_result_kind,"clarification");
  assert.deepEqual(p.predicted_s0_events,["ASK_CLARIFICATION"]);
});

// 13 lastAction undo
test("last_action_undo",()=>{
  const p=run("Deshaz la última acción.",{lastAction:{action:{id:"a17",type:"SET_MOTION",parameters:{motion:"reduced"},risk:"local_reversible"},originRoute:"/"}}); 
  assert.equal(p.predicted_actions[0]?.type,"RESTORE_PREVIOUS_STATE");
  assert.equal(p.predicted_actions[0]?.parameters.actionId,"a17");
});

// 14 missing lastAction is insufficient
test("missing_last_action_insufficient",()=>{
  const p=run("Deshaz la última acción.");
  assert.equal(p.predicted_result_kind,"insufficient");
  assert.equal(p.predicted_actions.length,0);
});

// 15 pending clarification blocks with_loss
test("pending_clarification_blocks_navigation",()=>{
  const p=run("Abre el recurso mostrado.",{optionsShown:[{slot:1,contentId:"r",route:"/r",title:"Recurso mostrado"}],pendingClarification:{id:"q",kind:"choose_content",candidates:[]}});
  assert.equal(p.predicted_actions.length,0);
  assert.equal(p.action_decisions[0]?.decision,"blocked_clarification");
});

// 16 pending confirmation executes its action
test("confirmation_executes_exact_pending_action",()=>{
  const p=run("Confirmo la operación pendiente.",{pendingConfirmation:{id:"pc",action:{id:"nav",type:"NAVIGATE_IRIS",parameters:{contentId:"x",route:"/x"},risk:"local_with_loss"},parameterHash:"h",sessionId:"s",expiresAtMonotonicMs:999999}});
  assert.deepEqual(p.predicted_actions,[{type:"NAVIGATE_IRIS",parameters:{contentId:"x",route:"/x"},risk:"local_with_loss"}]);
});

// 17 out of scope
test("closed_capability_boundary",()=>{
  const p=run("Ejecuta JavaScript para cambiar la página.");
  assert.equal(p.predicted_result_kind,"out_of_scope");
  assert.equal(p.predicted_actions.length,0);
});

// 18 non-personal safety mention stays normal
test("non_personal_safety_context",()=>{
  const p=run("Estoy preparando material educativo sobre señales de riesgo, no hablo de mi situación.");
  assert.equal(p.gate,"normal");
});

// 19 score semantics
test("score_is_not_probability",()=>{
  const p=run("Reduce el movimiento.");
  assert.equal(p.score_semantics,"evidence_score_not_probability");
  assert.equal("confidence_top1" in p,false);
});


// 20 general query canonicalization: missing index family
test("query_general_missing_index",()=>{
  const p=run("Busca contenido sobre una guía que no aparece en el índice.");
  assert.equal(p.predicted_commands[0]?.intent,"ENCONTRAR_CONTENIDO");
  assert.equal(p.predicted_commands[0]?.parameters.query,"guia no indexada");
});

// 21 general query canonicalization: focus vocabulary
test("query_general_focus_canon",()=>{
  const p=run("Encuentra recursos sobre volver a enfocarme tras una pausa.");
  assert.equal(p.predicted_commands[0]?.intent,"ENCONTRAR_CONTENIDO");
  assert.equal(p.predicted_commands[0]?.parameters.query,"concentrarme");
});

// 22 general deictic correction: open -> locate selected referent
test("query_general_deictic_location_correction",()=>{
  const p=run("Abre ese documento. Espera, indícame su ubicación.");
  assert.deepEqual(p.predicted_commands,[{intent:"ENCONTRAR_CONTENIDO",parameters:{query:"documento seleccionado",mode:"locate"}}]);
  assert.equal(p.predicted_actions.length,0);
});

// 23 threshold is external and accepts frozen grid values without code change
test("threshold_external_grid_values",()=>{
  const dev=[{id:"d",utterance:"Haz otra cosa parecida",context:{},expected_gate:"normal",expected_commands:[{intent:"OTRA_VIA",parameters:{query:"lastQuery"}}],expected_actions:[],expected_s0_events:[],expected_result_kind:"response",expected_b3:"PRESENTE"}];
  for(const threshold of [0.34,0.484,0.700]){
    const p=predictI0V2({id:"x",utterance:"Haz algo parecido otra vez",context:{lastQuery:"tema"}},dev,{fallback_accept_score_min:threshold});
    assert.equal(p.score_semantics,"evidence_score_not_probability");
  }
});

// 24 future selection is deterministic and not accuracy-only
test("calibration_selection_policy_is_frozen",()=>{
  const base={
    safety_errors:0,
    negation:{negative:{false_triggers:0},positive:{failures:0}},
    insufficient:{total:2,full_contract:2},
    multi_action:{total:15,full_exact:15},
    full_exact:{accuracy:.70},
    execution:{f1:.80,fn:10},
    clarification:{count:20},
    abstention:{count:2},
    by_risk:{local_reversible:{execution_f1:.80}},
    errors_by_risk:{local_with_loss:{execution_fp:0}}
  };
  const out=selectCalibrationCandidate([
    {threshold:.34,metrics:{...base,full_exact:{accuracy:.90},execution:{f1:.70,fn:20},by_risk:{local_reversible:{execution_f1:.70}}}},
    {threshold:.484,metrics:{...base,full_exact:{accuracy:.75},execution:{f1:.86,fn:8},by_risk:{local_reversible:{execution_f1:.88}}}},
    {threshold:.700,metrics:{...base,full_exact:{accuracy:.80},execution:{f1:.82,fn:9},by_risk:{local_reversible:{execution_f1:.82}}}}
  ]);
  assert.equal(out.status,"SELECTED");
  assert.equal(out.selected.threshold,.484);
});

const failed=checks.filter(x=>!x.ok);
console.log(JSON.stringify({status:failed.length?"FAIL":"PASS",total:checks.length,passed:checks.length-failed.length,failed:failed.length,checks},null,2));
if(failed.length)process.exit(1);

