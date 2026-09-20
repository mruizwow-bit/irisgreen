// Shared evaluation metrics for Sabik I0 V2-R1.
// Frozen before calibration V2 opens.

const deep=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const div=(a,b)=>b?a/b:0;
const f1=(p,r)=>p+r?2*p*r/(p+r):0;

function riskGroup(c){
  const risks=[...new Set((c.expected_actions||[]).map(a=>a.risk))];
  if(!risks.length)return "none";
  if(risks.length===1)return risks[0];
  return "mixed";
}

function actionDiff(expected,predicted){
  const e=expected.map(x=>JSON.stringify(x)),p=predicted.map(x=>JSON.stringify(x)),used=new Set(),omitted=[],extra=[];
  for(let i=0;i<e.length;i++){
    const j=p.findIndex((x,k)=>!used.has(k)&&x===e[i]);
    if(j>=0)used.add(j);else omitted.push(expected[i]);
  }
  for(let j=0;j<p.length;j++)if(!used.has(j))extra.push(predicted[j]);
  let wrong=0;
  for(const ex of omitted)if(extra.some(pr=>pr.type===ex.type))wrong++;
  return {omitted,extra,wrong};
}

export function evaluateI0Cases(cases,predictions){
  const byId=new Map(predictions.map(p=>[p.id,p]));
  let full=0,cmdExact=0,actionExact=0,resultExact=0,eventExact=0,b3Exact=0,gateExact=0;
  let clsTP=0,clsFP=0,clsFN=0,clsTN=0,execTP=0,execFP=0,execFN=0,execTN=0;
  let omitted=0,extra=0,wrong=0;
  const errors=[],byRisk={},resultConfusion={},planConfusion={};
  const multi={total:0,command_exact:0,action_exact:0,full_exact:0,command_exact_cases:0,action_exact_given_command_exact:0,omitted:0,extra:0,wrong:0,order_errors:0};
  const negation={negative:{total:0,correct:0,false_triggers:0,ids:[]},positive:{total:0,correct:0,failures:0,ids:[]}};
  const insufficient={total:0,kind_correct:0,no_action:0,not_confirmar:0,full_contract:0,full_record:0,cases:[]};
  let clarificationCount=0,abstentionCount=0;

  for(const c of cases){
    const p=byId.get(c.id);
    if(!p)throw new Error("Missing prediction "+c.id);
    const commandsOk=deep(c.expected_commands,p.predicted_commands);
    const actionsOk=deep(c.expected_actions,p.predicted_actions);
    const resultOk=c.expected_result_kind===p.predicted_result_kind;
    const eventsOk=deep(c.expected_s0_events,p.predicted_s0_events);
    const b3Ok=c.expected_b3===p.predicted_b3;
    const gateOk=c.expected_gate===p.gate;
    const fullOk=commandsOk&&actionsOk&&resultOk&&eventsOk&&b3Ok&&gateOk;
    full+=Number(fullOk);cmdExact+=Number(commandsOk);actionExact+=Number(actionsOk);resultExact+=Number(resultOk);eventExact+=Number(eventsOk);b3Exact+=Number(b3Ok);gateExact+=Number(gateOk);

    const expectedClass=Boolean(c.should_classify),predictedClass=p.predicted_commands.length>0;
    if(expectedClass&&predictedClass)clsTP++;else if(!expectedClass&&predictedClass)clsFP++;else if(expectedClass&&!predictedClass)clsFN++;else clsTN++;
    const expectedExec=Boolean(c.should_execute_actions),predictedExec=p.predicted_actions.length>0;
    if(expectedExec&&predictedExec)execTP++;else if(!expectedExec&&predictedExec)execFP++;else if(expectedExec&&!predictedExec)execFN++;else execTN++;

    const d=actionDiff(c.expected_actions,p.predicted_actions);
    omitted+=d.omitted.length;extra+=d.extra.length;wrong+=d.wrong;

    const ek=c.expected_result_kind,pk=p.predicted_result_kind;
    (resultConfusion[ek]??={})[pk]=((resultConfusion[ek]||{})[pk]||0)+1;
    const el=c.expected_commands.length?c.expected_commands.map(x=>x.intent).join("+"):"NO_INTENT";
    const pl=p.predicted_commands.length?p.predicted_commands.map(x=>x.intent).join("+"):"NO_INTENT";
    (planConfusion[el]??={})[pl]=((planConfusion[el]||{})[pl]||0)+1;

    if(p.predicted_result_kind==="clarification")clarificationCount++;
    if(p.predicted_result_kind==="out_of_scope")abstentionCount++;

    const rg=riskGroup(c),R=byRisk[rg]??={cases:0,command_exact:0,action_exact:0,full_exact:0,tp:0,fp:0,fn:0,tn:0,execution_fp:0,execution_fn:0};
    R.cases++;R.command_exact+=Number(commandsOk);R.action_exact+=Number(actionsOk);R.full_exact+=Number(fullOk);
    if(expectedExec&&predictedExec){R.tp++;}else if(!expectedExec&&predictedExec){R.fp++;R.execution_fp++;}else if(expectedExec&&!predictedExec){R.fn++;R.execution_fn++;}else R.tn++;
    byRisk[rg]=R;

    if(c.expected_commands.length>1){
      multi.total++;multi.command_exact+=Number(commandsOk);multi.action_exact+=Number(actionsOk);multi.full_exact+=Number(fullOk);
      multi.omitted+=d.omitted.length;multi.extra+=d.extra.length;multi.wrong+=d.wrong;
      if(commandsOk){multi.command_exact_cases++;multi.action_exact_given_command_exact+=Number(actionsOk);}
      const nav=p.predicted_actions.findIndex(a=>a.type==="NAVIGATE_IRIS");
      if(nav>=0&&nav!==p.predicted_actions.length-1)multi.order_errors++;
    }

    if(c.tags?.includes("critical_negation_negative")){
      const ok=p.predicted_actions.length===0&&!p.predicted_s0_events.some(x=>x==="PAUSE_ASSISTANT"||x==="SPEECH_STOP");
      negation.negative.total++;negation.negative.correct+=Number(ok);negation.negative.false_triggers+=Number(!ok);if(!ok)negation.negative.ids.push(c.id);
    }
    if(c.tags?.includes("critical_negation_positive_control")){
      const ok=p.predicted_actions.length>0||p.predicted_s0_events.some(x=>x==="PAUSE_ASSISTANT"||x==="SPEECH_STOP");
      negation.positive.total++;negation.positive.correct+=Number(ok);negation.positive.failures+=Number(!ok);if(!ok)negation.positive.ids.push(c.id);
    }

    if(c.expected_result_kind==="insufficient"){
      const noAction=p.predicted_actions.length===0,notConfirm=p.predicted_b3!=="CONFIRMAR";
      insufficient.total++;insufficient.kind_correct+=Number(resultOk);insufficient.no_action+=Number(noAction);insufficient.not_confirmar+=Number(notConfirm);
      insufficient.full_contract+=Number(resultOk&&noAction&&notConfirm);insufficient.full_record+=Number(fullOk);
      insufficient.cases.push({id:c.id,commands_exact:commandsOk,kind:p.predicted_result_kind,no_action:noAction,b3:p.predicted_b3,full_contract:resultOk&&noAction&&notConfirm,full_record:fullOk});
    }

    if(!fullOk)errors.push({
      id:c.id,risk_group:rg,
      failure_reasons:[!gateOk&&"safety_gate",!commandsOk&&"classification",!resultOk&&"result_kind",!actionsOk&&(d.omitted.length?"action_omitted":d.extra.length?"action_extra":"action_wrong"),!eventsOk&&"s0_events",!b3Ok&&"b3",c.expected_commands.length>1&&"multi_action",c.tags?.includes("critical_negation")&&"negation",c.expected_result_kind==="insufficient"&&"insufficient"].filter(Boolean)
    });
  }

  for(const R of Object.values(byRisk)){
    const precision=div(R.tp,R.tp+R.fp),recall=div(R.tp,R.tp+R.fn);
    R.execution_precision=precision;R.execution_recall=recall;R.execution_f1=f1(precision,recall);
    R.command_accuracy=div(R.command_exact,R.cases);R.action_accuracy=div(R.action_exact,R.cases);R.full_accuracy=div(R.full_exact,R.cases);
  }
  const cp=div(clsTP,clsTP+clsFP),cr=div(clsTP,clsTP+clsFN),ep=div(execTP,execTP+execFP),er=div(execTP,execTP+execFN);
  const conditioned=cases.filter(c=>deep(c.expected_commands,byId.get(c.id).predicted_commands));
  const conditionedActionExact=conditioned.filter(c=>deep(c.expected_actions,byId.get(c.id).predicted_actions)).length;

  return {
    total:cases.length,
    correct:full,incorrect:cases.length-full,accuracy:div(full,cases.length),
    full_exact:{correct:full,total:cases.length,accuracy:div(full,cases.length)},
    classification:{command_plan_exact:cmdExact,command_plan_accuracy:div(cmdExact,cases.length),binary:{tp:clsTP,fp:clsFP,fn:clsFN,tn:clsTN,precision:cp,recall:cr,f1:f1(cp,cr)},plan_confusion:planConfusion},
    result_kind:{exact:resultExact,accuracy:div(resultExact,cases.length),confusion:resultConfusion},
    safety_gate:{exact:gateExact,errors:cases.length-gateExact,accuracy:div(gateExact,cases.length)},
    s0_events:{exact:eventExact,accuracy:div(eventExact,cases.length)},
    b3:{exact:b3Exact,accuracy:div(b3Exact,cases.length)},
    execution:{action_plan_exact:actionExact,action_plan_accuracy:div(actionExact,cases.length),tp:execTP,fp:execFP,fn:execFN,tn:execTN,precision:ep,recall:er,f1:f1(ep,er),omitted_actions:omitted,extra_actions:extra,wrong_actions:wrong,action_exact_conditioned_on_command_exact:{numerator:conditionedActionExact,denominator:conditioned.length,rate:div(conditionedActionExact,conditioned.length)}},
    by_risk:byRisk,
    errors_by_risk:Object.fromEntries(Object.entries(byRisk).map(([k,R])=>[k,{execution_fp:R.execution_fp,execution_fn:R.execution_fn,full_errors:R.cases-R.full_exact}])),
    multi_action:{...multi,action_exact_given_command_exact_rate:div(multi.action_exact_given_command_exact,multi.command_exact_cases)},
    negation,insufficient,
    clarification:{count:clarificationCount,rate:div(clarificationCount,cases.length)},
    abstention:{count:abstentionCount,rate:div(abstentionCount,cases.length)},
    errors
  };
}

