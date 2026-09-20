#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import {rawPredict,applyPolicy} from "./sabik-i0-reference-executor.mjs";

const root=path.resolve(import.meta.dirname,"..");
const args=process.argv.slice(2);
const arg=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;};
const output=path.resolve(arg("--output",path.join(root,"reports/sabik/i0/calibration-v1")));
const configPath=path.resolve(arg("--config",path.join(root,"config/sabik/i0/calibration-run-v1.json")));
const devPath=path.join(root,"tests/development/sabik/i0/development.v0.4.jsonl");
const calPath=path.join(root,"tests/calibration/sabik/i0/calibration.v0.4.jsonl");
const schemaPath=path.join(root,"tests/schemas/sabik/i0/i0-layered-case-v0.4.schema.json");
const readJsonl=p=>fs.readFileSync(p,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const D=readJsonl(devPath),C=readJsonl(calPath),cfg=JSON.parse(fs.readFileSync(configPath,"utf8"));
const deep=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const sha256File=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const div=(a,b)=>b?a/b:0;
const f1=(p,r)=>p+r?2*p*r/(p+r):0;
const quantile=(xs,p)=>{const a=[...xs].sort((x,y)=>x-y);return a.length?a[Math.min(a.length-1,Math.floor((a.length-1)*p))]:null;};

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

function label(commands){return commands.length?commands.map(x=>x.intent).join("+"):"NO_INTENT";}

function evaluate(cases,predictions,name){
  const preds=new Map(predictions.map(x=>[x.id,x]));
  let full=0,cmdExact=0,resultExact=0,actionExact=0,eventExact=0,gateExact=0,b3Exact=0;
  let clsTP=0,clsFP=0,clsFN=0,clsTN=0,execTP=0,execFP=0,execFN=0,execTN=0;
  let actionOmitted=0,actionExtra=0,actionWrong=0;
  const resultConfusion={},planConfusion={},decisions={},errors=[],records=[],perIntent={};
  const multi={total:0,command_exact:0,action_exact:0,full_exact:0,omitted_actions:0,extra_actions:0,wrong_actions:0,order_errors:0,cases:[]};
  const insufficient={total:0,kind_correct:0,no_action:0,not_confirmar:0,full:0,cases:[]};
  const negation={negative:{total:0,correct:0,false_triggers:0,cases:[]},positive:{total:0,correct:0,failures:0,cases:[]}};
  const top1s=[],margins=[];

  for(const c of cases){
    const p=preds.get(c.id);
    if(!p)throw new Error("Missing prediction "+c.id);
    const commandsOk=deep(c.expected_commands,p.predicted_commands);
    const resultOk=c.expected_result_kind===p.predicted_result_kind;
    const actionsOk=deep(c.expected_actions,p.predicted_actions);
    const eventsOk=deep(c.expected_s0_events,p.predicted_s0_events);
    const gateOk=c.expected_gate===p.gate;
    const b3Ok=c.expected_b3===p.predicted_b3;
    const fullOk=commandsOk&&resultOk&&actionsOk&&eventsOk&&gateOk&&b3Ok;
    cmdExact+=commandsOk;resultExact+=resultOk;actionExact+=actionsOk;eventExact+=eventsOk;gateExact+=gateOk;b3Exact+=b3Ok;full+=fullOk;

    const expClass=c.should_classify,predClass=p.predicted_commands.length>0&&p.decision!=="abstain";
    if(expClass&&predClass)clsTP++;else if(!expClass&&predClass)clsFP++;else if(expClass&&!predClass)clsFN++;else clsTN++;
    const expExec=c.should_execute_actions,predExec=p.predicted_actions.length>0;
    if(expExec&&predExec)execTP++;else if(!expExec&&predExec)execFP++;else if(expExec&&!predExec)execFN++;else execTN++;

    const ad=actionDiff(c.expected_actions,p.predicted_actions);
    actionOmitted+=ad.omitted.length;actionExtra+=ad.extra.length;actionWrong+=ad.wrong;
    decisions[p.decision]=(decisions[p.decision]||0)+1;
    top1s.push(p.confidence_top1);margins.push(p.margin);

    const er=c.expected_result_kind,pr=p.predicted_result_kind;
    if(!resultConfusion[er])resultConfusion[er]={};
    resultConfusion[er][pr]=(resultConfusion[er][pr]||0)+1;
    const el=label(c.expected_commands),pl=label(p.predicted_commands);
    if(!planConfusion[el])planConfusion[el]={};
    planConfusion[el][pl]=(planConfusion[el][pl]||0)+1;

    for(const intent of c.expected_commands.map(x=>x.intent)){
      const z=perIntent[intent]||{n:0,command_exact:0,action_exact:0,full:0};
      z.n++;z.command_exact+=Number(commandsOk);z.action_exact+=Number(actionsOk);z.full+=Number(fullOk);perIntent[intent]=z;
    }

    let orderErr=false;
    if(c.expected_commands.length>1){
      multi.total++;multi.command_exact+=Number(commandsOk);multi.action_exact+=Number(actionsOk);multi.full_exact+=Number(fullOk);
      multi.omitted_actions+=ad.omitted.length;multi.extra_actions+=ad.extra.length;multi.wrong_actions+=ad.wrong;
      const nav=p.predicted_actions.findIndex(a=>a.type==="NAVIGATE_IRIS");
      orderErr=nav>=0&&nav!==p.predicted_actions.length-1;
      multi.order_errors+=Number(orderErr);
      multi.cases.push({id:c.id,command_exact:commandsOk,action_exact:actionsOk,full_exact:fullOk,omitted:ad.omitted,extra:ad.extra,wrong:ad.wrong,order_error:orderErr});
    }

    if(c.expected_result_kind==="insufficient"){
      const noAction=p.predicted_actions.length===0,notConfirm=p.predicted_b3!=="CONFIRMAR";
      insufficient.total++;insufficient.kind_correct+=Number(resultOk);insufficient.no_action+=Number(noAction);insufficient.not_confirmar+=Number(notConfirm);
      insufficient.full+=Number(resultOk&&noAction&&notConfirm);
      insufficient.cases.push({id:c.id,predicted_kind:p.predicted_result_kind,predicted_actions:p.predicted_actions,predicted_b3:p.predicted_b3,correct:resultOk&&noAction&&notConfirm});
    }

    if(c.tags.includes("critical_negation_negative")){
      const ok=p.predicted_actions.length===0&&!p.predicted_s0_events.some(x=>x==="PAUSE_ASSISTANT"||x==="SPEECH_STOP");
      negation.negative.total++;negation.negative.correct+=Number(ok);negation.negative.false_triggers+=Number(!ok);
      negation.negative.cases.push({id:c.id,correct:ok,actions:p.predicted_actions,events:p.predicted_s0_events});
    }
    if(c.tags.includes("critical_negation_positive_control")){
      const ok=p.predicted_actions.length>0||p.predicted_s0_events.some(x=>x==="PAUSE_ASSISTANT"||x==="SPEECH_STOP");
      negation.positive.total++;negation.positive.correct+=Number(ok);negation.positive.failures+=Number(!ok);
      negation.positive.cases.push({id:c.id,correct:ok,actions:p.predicted_actions,events:p.predicted_s0_events});
    }

    const failureReasons=[];
    if(!gateOk)failureReasons.push("safety_gate");
    if(!commandsOk)failureReasons.push("classification");
    if(!resultOk)failureReasons.push("result_kind");
    if(!actionsOk){
      if(ad.omitted.length)failureReasons.push("action_omitted");
      if(ad.extra.length)failureReasons.push("action_extra");
      if(ad.wrong)failureReasons.push("action_wrong");
    }
    if(!eventsOk)failureReasons.push("s0_events");
    if(!b3Ok)failureReasons.push("b3");
    if(c.expected_commands.length>1&&!fullOk)failureReasons.push("multi_action");
    if(c.expected_result_kind==="insufficient"&&!fullOk)failureReasons.push("insufficient");
    if(c.tags.includes("critical_negation")&&!fullOk)failureReasons.push("negation");

    const rec={
      id:c.id,utterance:c.utterance,
      expected:{gate:c.expected_gate,commands:c.expected_commands,result_kind:c.expected_result_kind,actions:c.expected_actions,s0_events:c.expected_s0_events,b3:c.expected_b3,should_classify:c.should_classify,should_execute_actions:c.should_execute_actions},
      predicted:{gate:p.gate,commands:p.predicted_commands,result_kind:p.predicted_result_kind,actions:p.predicted_actions,s0_events:p.predicted_s0_events,b3:p.predicted_b3,decision:p.decision,confidence_top1:p.confidence_top1,confidence_top2:p.confidence_top2,margin:p.margin,risk_class:p.risk_class,exemplar_id:p.exemplar_id,source:p.source},
      applied_thresholds:p.applied_thresholds,
      correct:fullOk,failure_reasons:failureReasons
    };
    records.push(rec);
    if(!fullOk)errors.push(rec);
  }

  const cp=div(clsTP,clsTP+clsFP),cr=div(clsTP,clsTP+clsFN),ep=div(execTP,execTP+execFP),er=div(execTP,execTP+execFN);
  const bins=[[0,.8],[.8,.85],[.85,.9],[.9,.94],[.94,.97],[.97,1.00001]].map(([lo,hi])=>{
    const rows=predictions.filter(p=>p.confidence_top1>=lo&&p.confidence_top1<hi);
    const ids=new Set(rows.map(x=>x.id));
    const right=records.filter(x=>ids.has(x.id)&&x.correct).length;
    return {lo,hi,n:rows.length,correct:right,accuracy:div(right,rows.length),mean_confidence:rows.length?rows.reduce((s,p)=>s+p.confidence_top1,0)/rows.length:null};
  });

  return {
    dataset:name,total:cases.length,correct:full,incorrect:cases.length-full,accuracy:div(full,cases.length),
    classification:{command_plan_exact:cmdExact,command_plan_accuracy:div(cmdExact,cases.length),binary:{tp:clsTP,fp:clsFP,fn:clsFN,tn:clsTN,precision:cp,recall:cr,f1:f1(cp,cr)},plan_confusion:planConfusion,per_intent:perIntent},
    result_kind:{exact:resultExact,accuracy:div(resultExact,cases.length),confusion:resultConfusion},
    safety_gate:{exact:gateExact,accuracy:div(gateExact,cases.length)},
    b3:{exact:b3Exact,accuracy:div(b3Exact,cases.length)},
    execution:{action_plan_exact:actionExact,action_plan_accuracy:div(actionExact,cases.length),events_exact:eventExact,events_accuracy:div(eventExact,cases.length),binary:{tp:execTP,fp:execFP,fn:execFN,tn:execTN,precision:ep,recall:er,f1:f1(ep,er)},omitted_actions:actionOmitted,extra_actions:actionExtra,wrong_actions:actionWrong},
    decisions,abstention_rate:div(decisions.abstain||0,cases.length),clarification_rate:div(decisions.clarify||0,cases.length),
    confidence:{top1:{min:Math.min(...top1s),p10:quantile(top1s,.1),p50:quantile(top1s,.5),p90:quantile(top1s,.9),max:Math.max(...top1s),mean:top1s.reduce((a,b)=>a+b,0)/top1s.length},margin:{min:Math.min(...margins),p10:quantile(margins,.1),p50:quantile(margins,.5),p90:quantile(margins,.9),max:Math.max(...margins),mean:margins.reduce((a,b)=>a+b,0)/margins.length},bins},
    insufficient,multi_action:multi,negation,records,errors
  };
}

function scoreCandidate(m){
  const safetyErrors=m.total-m.safety_gate.exact;
  const withLossErrors=m.errors.filter(e=>e.expected.actions.some(a=>a.risk==="local_with_loss")).length;
  const actionErrors=m.total-m.execution.action_plan_exact;
  const unnecessaryClar=m.errors.filter(e=>e.predicted.decision==="clarify"&&e.expected.result_kind!=="clarification").length;
  return [m.execution.binary.fp,m.negation.negative.false_triggers,safetyErrors,withLossErrors,actionErrors,unnecessaryClar,m.decisions.abstain||0,-m.correct];
}
function compareScore(a,b){for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;}

function withPolicy(raws,config){
  return raws.map(raw=>{
    const p=applyPolicy(raw,config);
    p.applied_thresholds=config;
    return p;
  });
}

fs.mkdirSync(output,{recursive:true});
const rawDev=D.map(c=>rawPredict(c,D,{excludeId:c.id}));
const rawCal=C.map(c=>rawPredict(c,D,{excludeId:null}));
const candidates=[];
for(const rt of cfg.threshold_grid.local_reversible.top1)for(const rm of cfg.threshold_grid.local_reversible.margin)
for(const lt of cfg.threshold_grid.local_with_loss.top1)for(const lm of cfg.threshold_grid.local_with_loss.margin){
  const config={classify_floor:cfg.fixed.classify_floor,local_reversible:{top1:rt,margin:rm},local_with_loss:{top1:lt,margin:lm}};
  const preds=withPolicy(rawCal,config);
  const m=evaluate(C,preds,"calibration_candidate");
  candidates.push({config,selection_score:scoreCandidate(m),summary:{correct:m.correct,accuracy:m.accuracy,classification_exact:m.classification.command_plan_exact,action_exact:m.execution.action_plan_exact,execution_fp:m.execution.binary.fp,execution_fn:m.execution.binary.fn,negation_false_triggers:m.negation.negative.false_triggers,multi_full:m.multi_action.full_exact,insufficient_full:m.insufficient.full,abstention_rate:m.abstention_rate}});
}
candidates.sort((a,b)=>compareScore(a.selection_score,b.selection_score));
const selected=candidates[0].config;
const devPred=withPolicy(rawDev,selected),calPred=withPolicy(rawCal,selected);
const devMetrics=evaluate(D,devPred,"development_leave_one_out");
const calMetrics=evaluate(C,calPred,"calibration");

const inputHashes={development:sha256File(devPath),calibration:sha256File(calPath),schema:sha256File(schemaPath)};
if(inputHashes.development!==cfg.inputs.development.sha256)throw new Error("Frozen development hash mismatch");
if(inputHashes.calibration!==cfg.inputs.calibration.sha256)throw new Error("Frozen calibration hash mismatch");
if(inputHashes.schema!==cfg.inputs.schema.sha256)throw new Error("Frozen schema hash mismatch");
if(devMetrics.records.length!==400||calMetrics.records.length!==200)throw new Error("Prediction coverage mismatch");
if(new Set(calMetrics.records.map(x=>x.id)).size!==200)throw new Error("Calibration duplicate IDs");

const groups={};
for(const rec of [...devMetrics.errors.map(x=>({...x,dataset:"development"})),...calMetrics.errors.map(x=>({...x,dataset:"calibration"}))]){
  for(const reason of rec.failure_reasons){
    const g=groups[reason]||{count:0,ids:[]};g.count++;g.ids.push(rec.id);groups[reason]=g;
  }
}

const writeJson=(name,x)=>fs.writeFileSync(path.join(output,name),JSON.stringify(x,null,2)+"\n");
const writeJsonl=(name,x)=>fs.writeFileSync(path.join(output,name),x.map(v=>JSON.stringify(v)).join("\n")+"\n");
writeJsonl("predictions.development.jsonl",devMetrics.records);
writeJsonl("predictions.calibration.jsonl",calMetrics.records);
writeJsonl("candidates.jsonl",candidates);
writeJson("metrics.development.json",{...devMetrics,records:undefined,errors:undefined});
writeJson("metrics.calibration.json",{...calMetrics,records:undefined,errors:undefined});
writeJson("errors.json",{total:devMetrics.errors.length+calMetrics.errors.length,groups,development:devMetrics.errors,calibration:calMetrics.errors});

const filesBeforeManifest=["predictions.development.jsonl","predictions.calibration.jsonl","candidates.jsonl","metrics.development.json","metrics.calibration.json","errors.json"];
const artifactHashes={};
for(const f of filesBeforeManifest)artifactHashes[f]={sha256:sha256File(path.join(output,f)),bytes:fs.statSync(path.join(output,f)).size};

const manifest={
  status:"I0_CALIBRATION_RUN_COMPLETE",
  run_version:"V1",
  dataset_head:cfg.dataset_head,
  source_commit:process.env.GITHUB_SHA||null,
  runtime:{node:process.version,platform:process.platform,arch:process.arch,seed:null,randomness:false,hostname:os.hostname()},
  command:"node tools/run-sabik-i0-calibration-v1.mjs --config config/sabik/i0/calibration-run-v1.json --output reports/sabik/i0/calibration-v1",
  inputs:cfg.inputs,input_hashes_verified:true,
  executor:cfg.executor,
  threshold_grid:cfg.threshold_grid,
  candidates_evaluated:candidates.length,
  selection_criterion:cfg.selection_criterion,
  selected_thresholds:selected,
  prediction_coverage:{development:{expected:400,received:devMetrics.records.length,unique:new Set(devMetrics.records.map(x=>x.id)).size},calibration:{expected:200,received:calMetrics.records.length,unique:new Set(calMetrics.records.map(x=>x.id)).size,extras:0,missing:0}},
  validation_173_used_for_tuning:false,
  validation_paths_loaded:[],
  artifacts:artifactHashes
};
writeJson("run-manifest.json",manifest);

const summary={
  status:"I0_CALIBRATION_RUN_COMPLETE",
  selected_thresholds:selected,
  candidates_evaluated:candidates.length,
  development:{total:devMetrics.total,correct:devMetrics.correct,incorrect:devMetrics.incorrect,accuracy:devMetrics.accuracy,classification:devMetrics.classification,execution:devMetrics.execution,result_kind:devMetrics.result_kind,safety_gate:devMetrics.safety_gate,b3:devMetrics.b3,decisions:devMetrics.decisions,abstention_rate:devMetrics.abstention_rate,clarification_rate:devMetrics.clarification_rate,confidence:devMetrics.confidence,insufficient:devMetrics.insufficient,multi_action:devMetrics.multi_action,negation:devMetrics.negation},
  calibration:{total:calMetrics.total,correct:calMetrics.correct,incorrect:calMetrics.incorrect,accuracy:calMetrics.accuracy,classification:calMetrics.classification,execution:calMetrics.execution,result_kind:calMetrics.result_kind,safety_gate:calMetrics.safety_gate,b3:calMetrics.b3,decisions:calMetrics.decisions,abstention_rate:calMetrics.abstention_rate,clarification_rate:calMetrics.clarification_rate,confidence:calMetrics.confidence,insufficient:calMetrics.insufficient,multi_action:calMetrics.multi_action,negation:calMetrics.negation},
  errors:{total:devMetrics.errors.length+calMetrics.errors.length,groups},
  no_validation_tuning:true
};
writeJson("summary.json",summary);

for(const f of ["run-manifest.json","summary.json"])artifactHashes[f]={sha256:sha256File(path.join(output,f)),bytes:fs.statSync(path.join(output,f)).size};
console.log(JSON.stringify({status:"I0_CALIBRATION_RUN_COMPLETE",selected_thresholds:selected,candidates_evaluated:candidates.length,development:{total:devMetrics.total,correct:devMetrics.correct,accuracy:devMetrics.accuracy},calibration:{total:calMetrics.total,correct:calMetrics.correct,accuracy:calMetrics.accuracy},prediction_coverage:manifest.prediction_coverage,artifact_hashes:artifactHashes},null,2));

