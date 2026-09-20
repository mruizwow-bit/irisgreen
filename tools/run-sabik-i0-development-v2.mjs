#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {predictI0V2,PROVISIONAL_FALLBACK_ACCEPT_SCORE} from "./sabik-i0-executor-v2.mjs";

const root=path.resolve(import.meta.dirname,"..");
const devPath=path.join(root,"tests/development/sabik/i0/development.v0.4.jsonl");
const output=path.resolve(process.argv[2]||path.join(root,"reports/sabik/i0/executor-v2-development"));
const D=fs.readFileSync(devPath,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const deep=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const div=(a,b)=>b?a/b:0;
const f1=(p,r)=>p+r?2*p*r/(p+r):0;
const q=(xs,p)=>{const a=[...xs].sort((x,y)=>x-y);return a.length?a[Math.min(a.length-1,Math.floor((a.length-1)*p))]:null;};
const sha256=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

function actionDiff(expected,predicted){
  const e=expected.map(x=>JSON.stringify(x)),p=predicted.map(x=>JSON.stringify(x)),used=new Set(),omitted=[],extra=[];
  for(let i=0;i<e.length;i++){const j=p.findIndex((x,k)=>!used.has(k)&&x===e[i]);if(j>=0)used.add(j);else omitted.push(expected[i]);}
  for(let j=0;j<p.length;j++)if(!used.has(j))extra.push(predicted[j]);
  let wrong=0;for(const ex of omitted)if(extra.some(pr=>pr.type===ex.type))wrong++;
  return {omitted,extra,wrong};
}
function planLabel(commands){return commands.length?commands.map(x=>x.intent).join("+"):"NO_INTENT";}
function riskGroup(c){
  const r=[...new Set((c.expected_actions||[]).map(a=>a.risk))];
  if(!r.length)return "none";
  if(r.length===1)return r[0];
  return "mixed";
}

const predictions=[];
for(const c of D){
  const train=D.filter(x=>x.id!==c.id);
  predictions.push(predictI0V2(c,train));
}

let full=0,cmdExact=0,actionExact=0,resultExact=0,eventExact=0,b3Exact=0,gateExact=0;
let clsTP=0,clsFP=0,clsFN=0,clsTN=0,execTP=0,execFP=0,execFN=0,execTN=0;
let omitted=0,extra=0,wrong=0;
const planConfusion={},resultConfusion={},errors=[],byRisk={},decisions={},scoreRows=[];
const multi={total:0,command_exact:0,action_exact:0,full_exact:0,command_exact_cases:0,action_exact_given_command_exact:0,omitted:0,extra:0,wrong:0,order_errors:0};
const neg={negative:{total:0,correct:0,false_triggers:0,ids:[]},positive:{total:0,correct:0,failures:0,ids:[]}};
const insufficient={total:0,kind_correct:0,no_action:0,not_confirmar:0,full_contract:0,full_record:0,cases:[]};

for(let i=0;i<D.length;i++){
  const c=D[i],p=predictions[i];
  const commandsOk=deep(c.expected_commands,p.predicted_commands);
  const actionsOk=deep(c.expected_actions,p.predicted_actions);
  const resultOk=c.expected_result_kind===p.predicted_result_kind;
  const eventsOk=deep(c.expected_s0_events,p.predicted_s0_events);
  const b3Ok=c.expected_b3===p.predicted_b3;
  const gateOk=c.expected_gate===p.gate;
  const fullOk=commandsOk&&actionsOk&&resultOk&&eventsOk&&b3Ok&&gateOk;
  full+=Number(fullOk);cmdExact+=Number(commandsOk);actionExact+=Number(actionsOk);resultExact+=Number(resultOk);eventExact+=Number(eventsOk);b3Exact+=Number(b3Ok);gateExact+=Number(gateOk);

  const expectedClass=c.should_classify,predictedClass=p.predicted_commands.length>0;
  if(expectedClass&&predictedClass)clsTP++;else if(!expectedClass&&predictedClass)clsFP++;else if(expectedClass&&!predictedClass)clsFN++;else clsTN++;
  const expectedExec=c.should_execute_actions,predictedExec=p.predicted_actions.length>0;
  if(expectedExec&&predictedExec)execTP++;else if(!expectedExec&&predictedExec)execFP++;else if(expectedExec&&!predictedExec)execFN++;else execTN++;

  const d=actionDiff(c.expected_actions,p.predicted_actions);omitted+=d.omitted.length;extra+=d.extra.length;wrong+=d.wrong;
  const el=planLabel(c.expected_commands),pl=planLabel(p.predicted_commands);(planConfusion[el]??={})[pl]=((planConfusion[el]||{})[pl]||0)+1;
  (resultConfusion[c.expected_result_kind]??={})[p.predicted_result_kind]=((resultConfusion[c.expected_result_kind]||{})[p.predicted_result_kind]||0)+1;
  decisions[p.predicted_result_kind]=(decisions[p.predicted_result_kind]||0)+1;

  const rg=riskGroup(c),R=byRisk[rg]??={cases:0,command_exact:0,action_exact:0,full_exact:0,expected_execute:0,predicted_execute:0,tp:0,fp:0,fn:0,tn:0};
  R.cases++;R.command_exact+=Number(commandsOk);R.action_exact+=Number(actionsOk);R.full_exact+=Number(fullOk);R.expected_execute+=Number(expectedExec);R.predicted_execute+=Number(predictedExec);
  if(expectedExec&&predictedExec)R.tp++;else if(!expectedExec&&predictedExec)R.fp++;else if(expectedExec&&!predictedExec)R.fn++;else R.tn++;
  byRisk[rg]=R;

  for(const s of p.command_scores||[])scoreRows.push({id:c.id,intent:s.intent,score:s.score,score_kind:s.score_kind,fallback:p.fallback_used});
  for(const a of p.action_decisions||[])if(a.action)scoreRows.push({id:c.id,intent:a.intent,score:a.score,score_kind:a.score_kind,risk:a.risk,action_decision:a.decision});

  if(c.expected_commands.length>1){
    multi.total++;multi.command_exact+=Number(commandsOk);multi.action_exact+=Number(actionsOk);multi.full_exact+=Number(fullOk);multi.omitted+=d.omitted.length;multi.extra+=d.extra.length;multi.wrong+=d.wrong;
    if(commandsOk){multi.command_exact_cases++;multi.action_exact_given_command_exact+=Number(actionsOk);}
    const nav=p.predicted_actions.findIndex(a=>a.type==="NAVIGATE_IRIS");if(nav>=0&&nav!==p.predicted_actions.length-1)multi.order_errors++;
  }

  if(c.tags.includes("critical_negation_negative")){
    const ok=p.predicted_actions.length===0&&!p.predicted_s0_events.some(x=>x==="PAUSE_ASSISTANT"||x==="SPEECH_STOP");
    neg.negative.total++;neg.negative.correct+=Number(ok);neg.negative.false_triggers+=Number(!ok);if(!ok)neg.negative.ids.push(c.id);
  }
  if(c.tags.includes("critical_negation_positive_control")){
    const ok=p.predicted_actions.length>0||p.predicted_s0_events.some(x=>x==="PAUSE_ASSISTANT"||x==="SPEECH_STOP");
    neg.positive.total++;neg.positive.correct+=Number(ok);neg.positive.failures+=Number(!ok);if(!ok)neg.positive.ids.push(c.id);
  }

  if(c.expected_result_kind==="insufficient"){
    const noAction=p.predicted_actions.length===0,notConfirm=p.predicted_b3!=="CONFIRMAR";
    insufficient.total++;insufficient.kind_correct+=Number(resultOk);insufficient.no_action+=Number(noAction);insufficient.not_confirmar+=Number(notConfirm);
    insufficient.full_contract+=Number(resultOk&&noAction&&notConfirm);insufficient.full_record+=Number(fullOk);
    insufficient.cases.push({id:c.id,commands_exact:commandsOk,kind:p.predicted_result_kind,actions:p.predicted_actions,b3:p.predicted_b3,full_contract:resultOk&&noAction&&notConfirm,full_record:fullOk});
  }

  if(!fullOk)errors.push({id:c.id,utterance:c.utterance,risk_group:rg,failure_reasons:[!gateOk&&"safety_gate",!commandsOk&&"classification",!resultOk&&"result_kind",!actionsOk&&(d.omitted.length?"action_omitted":d.extra.length?"action_extra":"action_wrong"),!eventsOk&&"s0_events",!b3Ok&&"b3",c.expected_commands.length>1&&"multi_action",c.tags.includes("critical_negation")&&"negation",c.expected_result_kind==="insufficient"&&"insufficient"].filter(Boolean),expected:{gate:c.expected_gate,commands:c.expected_commands,result_kind:c.expected_result_kind,actions:c.expected_actions,s0_events:c.expected_s0_events,b3:c.expected_b3},predicted:{gate:p.gate,commands:p.predicted_commands,result_kind:p.predicted_result_kind,actions:p.predicted_actions,s0_events:p.predicted_s0_events,b3:p.predicted_b3,command_scores:p.command_scores,action_decisions:p.action_decisions,fallback_used:p.fallback_used,fallback_score:p.fallback_score}});
}

for(const r of Object.values(byRisk)){const ep=div(r.tp,r.tp+r.fp),er=div(r.tp,r.tp+r.fn);r.execution_precision=ep;r.execution_recall=er;r.execution_f1=f1(ep,er);r.command_accuracy=div(r.command_exact,r.cases);r.action_accuracy=div(r.action_exact,r.cases);r.full_accuracy=div(r.full_exact,r.cases);}
const cp=div(clsTP,clsTP+clsFP),cr=div(clsTP,clsTP+clsFN),ep=div(execTP,execTP+execFP),er=div(execTP,execTP+execFN);

const fallbackAcceptScores=scoreRows.filter(x=>x.score_kind==="development_similarity").map(x=>x.score);
const contextResolutionScores=scoreRows.filter(x=>x.score_kind==="development_context_resolution").map(x=>x.score);
const allScores=scoreRows.map(x=>x.score);
const scoreDist=xs=>({n:xs.length,min:xs.length?Math.min(...xs):null,p10:q(xs,.1),p25:q(xs,.25),p50:q(xs,.5),p75:q(xs,.75),p90:q(xs,.9),max:xs.length?Math.max(...xs):null,mean:xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null});
const dist={all:scoreDist(allScores),fallback_accept:scoreDist(fallbackAcceptScores),context_resolution:scoreDist(contextResolutionScores),by_kind:{}};
for(const kind of [...new Set(scoreRows.map(x=>x.score_kind))])dist.by_kind[kind]=scoreDist(scoreRows.filter(x=>x.score_kind===kind).map(x=>x.score));

const rawCandidates=[q(fallbackAcceptScores,.1),q(fallbackAcceptScores,.25),q(fallbackAcceptScores,.5),q(fallbackAcceptScores,.75),q(fallbackAcceptScores,.9)].filter(x=>x!==null).map(x=>Number(x.toFixed(3)));
const sensitivityCandidates=[...new Set(rawCandidates)].sort((a,b)=>a-b);
const sensitivity=sensitivityCandidates.map(t=>({threshold:t,would_reject_fallback_scores:fallbackAcceptScores.filter(x=>x<t).length,would_accept_fallback_scores:fallbackAcceptScores.filter(x=>x>=t).length,changes_from_provisional:fallbackAcceptScores.filter(x=>(x>=PROVISIONAL_FALLBACK_ACCEPT_SCORE)!==(x>=t)).length}));
const calibrability={
  fixed:[
    {parameter:"safety_precedence",reason:"contractual invariant"},
    {parameter:"negation_scope",reason:"semantic/contractual invariant"},
    {parameter:"local_reversible_clear_execution",reason:"contract says clear independent reversible actions may execute"},
    {parameter:"with_loss_real_loss_block",reason:"unsentText/pendingClarification are contractual blockers"},
    {parameter:"navigation_last",reason:"contractual ordering invariant"}
  ],
  future_calibrable:[
    {parameter:"fallback_accept_score_min",score_semantics:"development_similarity evidence score, not probability",provisional_value:PROVISIONAL_FALLBACK_ACCEPT_SCORE,provisional_status:"fixed_for_V2_development_not_calibrated",development_similarity_distribution:scoreDist(fallbackAcceptScores),candidate_values:sensitivityCandidates,candidates_change_decisions:sensitivity.some(x=>x.changes_from_provisional>0),active:true}
  ],
  removed_from_calibration:[
    {parameter:"margin",reason:"V1 margin was inert; V2 has no probabilistic top1-top2 margin"},
    {parameter:"global_plan_risk_threshold",reason:"removed by per-action policy"}
  ],
  sensitivity
};

const metrics={
  version:"V2-development-only",dataset:"development_leave_one_out",total:D.length,correct:full,incorrect:D.length-full,accuracy:div(full,D.length),
  classification:{command_plan_exact:cmdExact,command_plan_accuracy:div(cmdExact,D.length),binary:{tp:clsTP,fp:clsFP,fn:clsFN,tn:clsTN,precision:cp,recall:cr,f1:f1(cp,cr)},plan_confusion:planConfusion},
  result_kind:{exact:resultExact,accuracy:div(resultExact,D.length),confusion:resultConfusion},
  safety_gate:{exact:gateExact,accuracy:div(gateExact,D.length)},
  s0_events:{exact:eventExact,accuracy:div(eventExact,D.length)},
  b3:{exact:b3Exact,accuracy:div(b3Exact,D.length)},
  execution:{action_plan_exact:actionExact,action_plan_accuracy:div(actionExact,D.length),binary:{tp:execTP,fp:execFP,fn:execFN,tn:execTN,precision:ep,recall:er,f1:f1(ep,er)},omitted_actions:omitted,extra_actions:extra,wrong_actions:wrong,action_exact_conditioned_on_command_exact:{numerator:predictions.filter((p,i)=>deep(D[i].expected_commands,p.predicted_commands)&&deep(D[i].expected_actions,p.predicted_actions)).length,denominator:cmdExact,rate:div(predictions.filter((p,i)=>deep(D[i].expected_commands,p.predicted_commands)&&deep(D[i].expected_actions,p.predicted_actions)).length,cmdExact)}},
  by_risk:byRisk,multi_action:{...multi,action_exact_given_command_exact_rate:div(multi.action_exact_given_command_exact,multi.command_exact_cases)},
  negation:neg,insufficient,score_distribution:dist,calibrability,
  errors
};

const baseline={
  version:"V1-development",full_exact:{correct:103,total:400,accuracy:.2575},
  command_plan_exact:{correct:254,total:400,accuracy:.635},
  action_plan_exact:{correct:215,total:400,accuracy:.5375},
  result_kind:{correct:205,total:400,accuracy:.5125},
  s0_events:{correct:205,total:400,accuracy:.5125},
  b3:{correct:318,total:400,accuracy:.795},
  safety_gate:{correct:394,total:400,accuracy:.985},
  execution:{tp:43,fp:1,fn:170,tn:186,precision:.9772727272727273,recall:.20187793427230047,f1:.3346303501945525},
  multi_action:{total:25,action_exact:0,full_exact:0},
  negation:{negative:{correct:4,total:4},positive:{correct:2,total:4}},
  insufficient:{full_contract:3,total:3}
};
const comparison={
  v1:baseline,
  v2:{
    full_exact:{correct:full,total:400,accuracy:div(full,400)},
    command_plan_exact:{correct:cmdExact,total:400,accuracy:div(cmdExact,400)},
    action_plan_exact:{correct:actionExact,total:400,accuracy:div(actionExact,400)},
    result_kind:{correct:resultExact,total:400,accuracy:div(resultExact,400)},
    s0_events:{correct:eventExact,total:400,accuracy:div(eventExact,400)},
    b3:{correct:b3Exact,total:400,accuracy:div(b3Exact,400)},
    safety_gate:{correct:gateExact,total:400,accuracy:div(gateExact,400)},
    execution:{tp:execTP,fp:execFP,fn:execFN,tn:execTN,precision:ep,recall:er,f1:f1(ep,er)},
    multi_action:{total:multi.total,action_exact:multi.action_exact,full_exact:multi.full_exact,action_exact_given_command_exact:multi.action_exact_given_command_exact,command_exact_cases:multi.command_exact_cases},
    negation:{negative:{correct:neg.negative.correct,total:neg.negative.total},positive:{correct:neg.positive.correct,total:neg.positive.total}},
    insufficient:{full_contract:insufficient.full_contract,total:insufficient.total}
  }
};

fs.mkdirSync(output,{recursive:true});
const writeJson=(name,x)=>fs.writeFileSync(path.join(output,name),JSON.stringify(x,null,2)+"\n");
const writeJsonl=(name,x)=>fs.writeFileSync(path.join(output,name),x.map(v=>JSON.stringify(v)).join("\n")+"\n");
writeJsonl("predictions.development.v2.jsonl",D.map((c,i)=>({id:c.id,utterance:c.utterance,expected:{gate:c.expected_gate,commands:c.expected_commands,result_kind:c.expected_result_kind,actions:c.expected_actions,s0_events:c.expected_s0_events,b3:c.expected_b3},predicted:predictions[i],correct:!errors.some(e=>e.id===c.id)})));
writeJson("metrics.development.v2.json",{...metrics,errors:undefined});
writeJson("errors.development.v2.json",{count:errors.length,errors});
writeJson("score-distribution.development.v2.json",{score_semantics:"evidence_score_not_probability",distribution:dist,calibrability});
writeJson("comparison-v1-v2.development.json",comparison);

const files=["predictions.development.v2.jsonl","metrics.development.v2.json","errors.development.v2.json","score-distribution.development.v2.json","comparison-v1-v2.development.json"];
const artifacts={};for(const f of files)artifacts[f]={sha256:sha256(path.join(output,f)),bytes:fs.statSync(path.join(output,f)).size};
writeJson("manifest.development.v2.json",{status:"I0_EXECUTOR_V2_DEVELOPMENT_RUN_COMPLETE",input:{path:"tests/development/sabik/i0/development.v0.4.jsonl",sha256:sha256(devPath),cases:D.length},calibration_loaded:false,validation_loaded:false,score_semantics:"evidence_score_not_probability",provisional_fallback_accept_score:PROVISIONAL_FALLBACK_ACCEPT_SCORE,artifacts});
console.log(JSON.stringify({status:"I0_EXECUTOR_V2_DEVELOPMENT_RUN_COMPLETE",metrics:{total:D.length,correct:full,accuracy:div(full,D.length),command_plan_exact:cmdExact,action_plan_exact:actionExact,result_kind_exact:resultExact,s0_events_exact:eventExact,b3_exact:b3Exact,safety_gate_exact:gateExact,execution:{tp:execTP,fp:execFP,fn:execFN,tn:execTN,precision:ep,recall:er,f1:f1(ep,er)},multi_action:metrics.multi_action,negation:neg,insufficient,action_exact_conditioned_on_command_exact:metrics.execution.action_exact_conditioned_on_command_exact},score_distribution:dist,calibrability,comparison,artifacts},null,2));

