import {evaluateI0Cases as evaluateBase} from "./sabik-i0-v3-evaluation-metrics.mjs";

const deep=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const div=(a,b)=>b?a/b:0;

function actionDiff(expected,predicted){
  const usedE=new Set(),usedP=new Set(),wrong=[];
  for(let i=0;i<expected.length;i++){
    const j=predicted.findIndex((p,k)=>!usedP.has(k)&&deep(p,expected[i]));
    if(j>=0){usedE.add(i);usedP.add(j);}
  }
  for(let i=0;i<expected.length;i++){
    if(usedE.has(i))continue;
    const j=predicted.findIndex((p,k)=>!usedP.has(k)&&p.type===expected[i].type);
    if(j>=0){usedE.add(i);usedP.add(j);wrong.push({expected:expected[i],predicted:predicted[j]});}
  }
  return {
    omitted:expected.filter((_,i)=>!usedE.has(i)),
    extra:predicted.filter((_,i)=>!usedP.has(i)),
    wrong
  };
}

function opaqueGapForAction(action,c,command){
  const ctx=c.context||{};
  if(!action)return false;
  if((action.type==="STEP_NEXT"||action.type==="STEP_BACK")&&!ctx.flowId){
    return {type:"opaque_flow_id",action_type:action.type};
  }
  if(action.type==="REPEAT_INSTRUCTION"&&!ctx.instructionContextId&&!ctx.currentContentId){
    return {type:"opaque_instruction_context_id",action_type:action.type};
  }
  if(action.type==="SET_DETAILS"&&!ctx.currentContentId){
    return {type:"opaque_current_content_id",action_type:action.type};
  }
  if(action.type==="NAVIGATE_IRIS"){
    if(command?.intent==="ATRAS"&&command?.parameters?.scope==="page"&&(!ctx.previousContentId||!ctx.previousRoute)){
      return {type:"opaque_previous_navigation_identity",action_type:action.type};
    }
    if(command?.intent==="ABRIR_CONTENIDO"){
      const id=command.parameters?.contentId;
      const option=(ctx.optionsShown||[]).find(o=>o.contentId===id);
      if(!option?.route)return {type:"opaque_navigation_route",action_type:action.type};
    }
  }
  return false;
}

function commandForExpectedAction(c,index){
  // Contract ordering is normally command/action aligned, except non-action commands.
  const executableIntents=new Set([
    "ABRIR_CONTENIDO","CAMBIAR_TAMANO_TEXTO","CAMBIAR_MOVIMIENTO","CAMBIAR_PASO_A_PASO",
    "CAMBIAR_VISTA_SENCILLA","CAMBIAR_DETALLES","SIGUIENTE","ATRAS","REPETIR_INDICACION",
    "RESTABLECER_PREFERENCIAS","DESHACER_ULTIMA_ACCION","CONFIRMAR_ACCION"
  ]);
  const commands=(c.expected_commands||[]).filter(x=>executableIntents.has(x.intent));
  return commands[index]||null;
}

function scorableExpectedActions(c){
  const scorable=[],gaps=[];
  (c.expected_actions||[]).forEach((a,i)=>{
    const command=commandForExpectedAction(c,i);
    const gap=opaqueGapForAction(a,c,command);
    if(gap)gaps.push({index:i,expected_action:a,command,...gap});
    else scorable.push(a);
  });
  return {scorable,gaps};
}

function positiveControlCorrect(c,p){
  if(!(c.tags||[]).includes("critical_negation_positive_control"))return null;
  const commandExact=deep(c.expected_commands,p.predicted_commands);
  if(!commandExact)return false;
  if((c.expected_s0_events||[]).length){
    return c.expected_s0_events.every(e=>(p.predicted_s0_events||[]).includes(e));
  }
  const {scorable}=scorableExpectedActions(c);
  if(!scorable.length)return true;
  const d=actionDiff(scorable,p.predicted_actions||[]);
  return d.omitted.length===0&&d.wrong.length===0;
}

export function evaluateI0CasesR2(cases,predictions){
  const base=evaluateBase(cases,predictions);
  const byId=new Map(predictions.map(p=>[p.id,p]));

  const multi={
    total:0,command_exact:0,
    scorable_expected_actions:0,
    opaque_contract_gaps:0,
    omitted_when_command_exact:0,
    extra_when_command_exact:0,
    wrong_parameters_when_command_exact:0,
    order_errors_when_command_exact:0,
    command_exact_cases:0,
    structural_gate_pass:true,
    gap_types:{}
  };

  let safetyProtectedCases=0,safetyOrdinaryCommandLeaks=0,safetyOrdinaryActionLeaks=0;
  let insufficientPredictions=0,insufficientOrdinaryExecutions=0;
  let positiveTotal=0,positiveCorrect=0;
  const positiveFailures=[];
  const gapLedger=[];

  for(const c of cases){
    const p=byId.get(c.id);
    if(!p)throw new Error("Missing prediction "+c.id);

    if(p.gate!=="normal"){
      safetyProtectedCases++;
      if((p.predicted_commands||[]).length)safetyOrdinaryCommandLeaks++;
      if((p.predicted_actions||[]).length)safetyOrdinaryActionLeaks++;
    }
    if(p.predicted_result_kind==="insufficient"){
      insufficientPredictions++;
      if((p.predicted_actions||[]).length)insufficientOrdinaryExecutions++;
    }

    const pc=positiveControlCorrect(c,p);
    if(pc!==null){
      positiveTotal++;
      if(pc)positiveCorrect++;
      else positiveFailures.push(c.id);
    }

    if((c.expected_commands||[]).length>1){
      multi.total++;
      const commandExact=deep(c.expected_commands,p.predicted_commands);
      if(commandExact){
        multi.command_exact++;
        multi.command_exact_cases++;
        const {scorable,gaps}=scorableExpectedActions(c);
        multi.scorable_expected_actions+=scorable.length;
        multi.opaque_contract_gaps+=gaps.length;
        for(const g of gaps){
          multi.gap_types[g.type]=(multi.gap_types[g.type]||0)+1;
          gapLedger.push({id:c.id,...g});
        }
        const d=actionDiff(scorable,p.predicted_actions||[]);
        multi.omitted_when_command_exact+=d.omitted.length;
        multi.extra_when_command_exact+=d.extra.length;
        multi.wrong_parameters_when_command_exact+=d.wrong.length;
        const nav=(p.predicted_actions||[]).findIndex(a=>a.type==="NAVIGATE_IRIS");
        if(nav>=0&&nav!==p.predicted_actions.length-1)multi.order_errors_when_command_exact++;
      }
    }
  }

  multi.structural_gate_pass=
    multi.omitted_when_command_exact===0&&
    multi.extra_when_command_exact===0&&
    multi.wrong_parameters_when_command_exact===0&&
    multi.order_errors_when_command_exact===0;

  const gates={
    safety_errors:base.safety_gate.errors,
    safety_ordinary_command_leaks:safetyOrdinaryCommandLeaks,
    safety_ordinary_action_leaks:safetyOrdinaryActionLeaks,
    negative_false_triggers:base.negation.negative.false_triggers,
    positive_control_failures:positiveTotal-positiveCorrect,
    insufficient_contract_errors:base.insufficient.total-base.insufficient.full_contract,
    insufficient_ordinary_executions:insufficientOrdinaryExecutions,
    multi_action_omitted_when_command_exact:multi.omitted_when_command_exact,
    multi_action_extra_when_command_exact:multi.extra_when_command_exact,
    multi_action_wrong_parameters_when_command_exact:multi.wrong_parameters_when_command_exact,
    multi_action_order_errors_when_command_exact:multi.order_errors_when_command_exact,
    CASE_SHAPED_FORBIDDEN:null
  };

  return {
    ...base,
    r2:{
      gates,
      safety_protection:{
        protected_cases:safetyProtectedCases,
        ordinary_command_leaks:safetyOrdinaryCommandLeaks,
        ordinary_action_leaks:safetyOrdinaryActionLeaks
      },
      insufficient_protection:{
        predicted_insufficient:insufficientPredictions,
        ordinary_action_executions:insufficientOrdinaryExecutions
      },
      positive_controls:{
        total:positiveTotal,
        correct:positiveCorrect,
        failures:positiveTotal-positiveCorrect,
        failure_ids:positiveFailures
      },
      multi_action_contractual:multi,
      opaque_contract_gaps:gapLedger
    }
  };
}

