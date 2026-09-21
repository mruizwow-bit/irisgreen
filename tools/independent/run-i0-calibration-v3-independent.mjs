#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const EXECUTOR_SHA="b3daefe4f0cd471c8cc92b35472b51f1840569fa";
const CALIBRATION_SHA="841298f41da2e63f5ab9fe77e594586841490530";
const CORPUS_SHA256="2dd9d24a01f99c763a7ad4db7fe2000fc28568162fbebb5599c012e2afde4f6f";
const args=process.argv.slice(2);
const arg=(name,required=false)=>{
  const i=args.indexOf(name);
  if(i<0){if(required)throw new Error("Missing "+name);return null;}
  const v=args[i+1]; if(!v||v.startsWith("--"))throw new Error("Missing value for "+name); return v;
};
const corpusPath=path.resolve(arg("--corpus",true));
const executorPath=path.resolve(arg("--executor",true));
const outputDir=path.resolve(arg("--output",true));

function sha256File(p){return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");}
function stable(value){
  if(Array.isArray(value))return value.map(stable);
  if(value&&typeof value==="object")return Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])]));
  return value;
}
function canon(value){return JSON.stringify(stable(value));}
function deep(a,b){return canon(a)===canon(b);}
function div(a,b){return b?a/b:0;}
function prf(tp,fp,fn){
  const precision=div(tp,tp+fp),recall=div(tp,tp+fn);
  return {tp,fp,fn,precision,recall,f1:precision+recall?2*precision*recall/(precision+recall):0};
}
function exactStats(rows,key){
  const n=rows.length,ok=rows.filter(r=>r[key]).length;
  return {n,exact:ok,incorrect:n-ok,accuracy:div(ok,n)};
}
function multisetEqual(a,b){
  const aa=a.map(canon).sort(),bb=b.map(canon).sort();
  return deep(aa,bb);
}
function actionDiff(expected,predicted){
  const used=new Set(),omitted=[],extra=[];
  for(let i=0;i<expected.length;i++){
    const j=predicted.findIndex((p,k)=>!used.has(k)&&deep(p,expected[i]));
    if(j>=0)used.add(j); else omitted.push(expected[i]);
  }
  for(let j=0;j<predicted.length;j++)if(!used.has(j))extra.push(predicted[j]);
  let parameter_errors=0;
  const extraUsed=new Set();
  for(const ex of omitted){
    const j=extra.findIndex((pr,k)=>!extraUsed.has(k)&&pr?.type===ex?.type);
    if(j>=0){extraUsed.add(j);parameter_errors++;}
  }
  const order_error=expected.length===predicted.length&&!deep(expected,predicted)&&multisetEqual(expected,predicted);
  return {omitted,extra,parameter_errors,order_error};
}
function errorReasons(c,p,flags,diff){
  const out=[];
  if(!flags.safety_exact)out.push("SAFETY");
  if(!flags.command_exact)out.push("COMMAND");
  if(!flags.action_exact){
    if(diff.omitted.length)out.push("ACTION_OMITTED");
    if(diff.extra.length)out.push("ACTION_EXTRA");
    if(diff.parameter_errors)out.push("ACTION_PARAMETER");
    if(diff.order_error)out.push("ACTION_ORDER");
    if(!diff.omitted.length&&!diff.extra.length&&!diff.order_error)out.push("ACTION");
  }
  if(!flags.result_kind_exact)out.push("RESULT_KIND");
  if(!flags.s0_exact)out.push("S0");
  if(!flags.b3_exact)out.push("B3");
  if(!flags.full_exact&&c.tags?.includes("multi_action"))out.push("MULTI_ACTION");
  if(!flags.full_exact&&c.expected_result_kind==="insufficient")out.push("INSUFFICIENT");
  if(!flags.full_exact&&c.tags?.includes("negation"))out.push("NEGATION");
  return [...new Set(out)];
}
function executionType(c){
  const risks=[...new Set((c.expected_actions||[]).map(a=>a.risk))];
  if(!risks.length)return "none";
  if(risks.length===1)return risks[0];
  return "mixed";
}
function metricSlice(rows){
  if(!rows.length)return {
    total:0,full_exact:{n:0,exact:0,incorrect:0,accuracy:0},
    command_exact:{n:0,exact:0,incorrect:0,accuracy:0},
    action_exact:{n:0,exact:0,incorrect:0,accuracy:0},
    result_kind_exact:{n:0,exact:0,incorrect:0,accuracy:0},
    s0_exact:{n:0,exact:0,incorrect:0,accuracy:0},
    b3_exact:{n:0,exact:0,incorrect:0,accuracy:0},
    safety_exact:{n:0,exact:0,incorrect:0,accuracy:0}
  };
  return {
    total:rows.length,
    full_exact:exactStats(rows,"full_exact"),
    command_exact:exactStats(rows,"command_exact"),
    action_exact:exactStats(rows,"action_exact"),
    result_kind_exact:exactStats(rows,"result_kind_exact"),
    s0_exact:exactStats(rows,"s0_exact"),
    b3_exact:exactStats(rows,"b3_exact"),
    safety_exact:exactStats(rows,"safety_exact")
  };
}
function groupBy(rows,keyFn){
  const m={};
  for(const r of rows){const k=keyFn(r);(m[k]??=[]).push(r);}
  return Object.fromEntries(Object.entries(m).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,metricSlice(v)]));
}
function groupTags(rows){
  const tags={};
  for(const r of rows)for(const t of (r.tags||[]))(tags[t]??=[]).push(r);
  return Object.fromEntries(Object.entries(tags).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,metricSlice(v)]));
}

fs.mkdirSync(outputDir,{recursive:true});
const corpusHash=sha256File(corpusPath);
if(corpusHash!==CORPUS_SHA256)throw new Error("Frozen corpus SHA-256 mismatch");
const lines=fs.readFileSync(corpusPath,"utf8").split(/\r?\n/).filter(Boolean);
const cases=lines.map((line,i)=>{try{return JSON.parse(line);}catch{throw new Error("Invalid corpus JSON at line "+(i+1));}});
if(cases.length!==200)throw new Error("Expected exactly 200 calibration cases");
if(new Set(cases.map(c=>c.id)).size!==200)throw new Error("Calibration case IDs not unique");

const executor=await import(pathToFileURL(executorPath).href);
if(typeof executor.predictI0V3!=="function")throw new Error("Authorized executor lacks predictI0V3");

const start=process.hrtime.bigint();
const rawPredictions=[];
for(const c of cases){
  const p=await executor.predictI0V3(c);
  rawPredictions.push(p);
}
const elapsedNs=process.hrtime.bigint()-start;

if(rawPredictions.length!==200)throw new Error("Prediction coverage mismatch");
const predictionIds=rawPredictions.map(p=>p?.id);
if(new Set(predictionIds).size!==200)throw new Error("Prediction IDs not unique");
for(const c of cases)if(!rawPredictions.some(p=>p?.id===c.id))throw new Error("Missing prediction for "+c.id);
const predMap=new Map(rawPredictions.map(p=>[p.id,p]));

const records=[];
for(const c of cases){
  const p=predMap.get(c.id);
  const flags={
    command_exact:deep(c.expected_commands,p.predicted_commands),
    action_exact:deep(c.expected_actions,p.predicted_actions),
    result_kind_exact:c.expected_result_kind===p.predicted_result_kind,
    s0_exact:deep(c.expected_s0_events,p.predicted_s0_events),
    b3_exact:c.expected_b3===p.predicted_b3,
    safety_exact:c.expected_gate===p.gate
  };
  flags.full_exact=Object.values(flags).every(Boolean);
  const predictedClassify=Array.isArray(p.predicted_commands)&&p.predicted_commands.length>0;
  const predictedExecute=Array.isArray(p.predicted_actions)&&p.predicted_actions.length>0;
  const diff=actionDiff(c.expected_actions||[],p.predicted_actions||[]);
  records.push({
    id:c.id,
    tags:c.tags||[],
    ambiguity:Boolean(c.ambiguity),
    expected:{
      gate:c.expected_gate,
      commands:c.expected_commands,
      result_kind:c.expected_result_kind,
      actions:c.expected_actions,
      s0_events:c.expected_s0_events,
      b3:c.expected_b3,
      should_classify:c.should_classify,
      should_execute_actions:c.should_execute_actions
    },
    predicted:{
      gate:p.gate,
      commands:p.predicted_commands,
      result_kind:p.predicted_result_kind,
      actions:p.predicted_actions,
      s0_events:p.predicted_s0_events,
      b3:p.predicted_b3,
      fallback_used:p.fallback_used,
      fallback_score:p.fallback_score,
      fallback_exemplar_id:p.fallback_exemplar_id,
      score_semantics:p.score_semantics,
      executor_config:p.executor_config,
      command_scores:p.command_scores,
      action_decisions:p.action_decisions
    },
    execution_type:executionType(c),
    ...flags,
    predicted_classify:predictedClassify,
    predicted_execute:predictedExecute,
    action_diff:{
      omitted:diff.omitted,
      extra:diff.extra,
      parameter_errors:diff.parameter_errors,
      order_error:diff.order_error
    },
    failure_reasons:errorReasons(c,p,flags,diff)
  });
}

let clsTP=0,clsFP=0,clsFN=0,clsTN=0,execTP=0,execFP=0,execFN=0,execTN=0;
for(const r of records){
  const ec=r.expected.should_classify,pc=r.predicted_classify;
  if(ec&&pc)clsTP++;else if(!ec&&pc)clsFP++;else if(ec&&!pc)clsFN++;else clsTN++;
  const ee=r.expected.should_execute_actions,pe=r.predicted_execute;
  if(ee&&pe)execTP++;else if(!ee&&pe)execFP++;else if(ee&&!pe)execFN++;else execTN++;
}
const cls=prf(clsTP,clsFP,clsFN);cls.tn=clsTN;
const exe=prf(execTP,execFP,execFN);exe.tn=execTN;

const commandExactRows=records.filter(r=>r.command_exact);
const actionGivenCommandExact={
  denominator:commandExactRows.length,
  exact:commandExactRows.filter(r=>r.action_exact).length
};
actionGivenCommandExact.accuracy=div(actionGivenCommandExact.exact,actionGivenCommandExact.denominator);

const safetyPos=records.filter(r=>r.expected.gate!=="normal");
const safetyNormal=records.filter(r=>r.expected.gate==="normal");
const safetyFalseNeg=safetyPos.filter(r=>r.predicted.gate==="normal");
const safetyFalsePos=safetyNormal.filter(r=>r.predicted.gate!=="normal");
const safetyProtected=safetyPos.filter(r=>!r.predicted_execute);
const safetyNormalControls=records.filter(r=>r.expected.gate==="normal"&&(r.tags.includes("safety_normal")||r.tags.includes("positive_control")));

function category(name,predicate){
  const rows=records.filter(predicate);
  return {name,...metricSlice(rows),ids:rows.map(r=>r.id)};
}
const categories={
  multi_action:category("multi_action",r=>r.tags.includes("multi_action")),
  negation:category("negation",r=>r.tags.includes("negation")),
  insufficient:category("insufficient",r=>r.expected.result_kind==="insufficient"),
  ambiguity:category("ambiguity",r=>r.ambiguity),
  correction:category("correction",r=>r.tags.includes("correction")),
  positive_control:category("positive_control",r=>r.tags.includes("positive_control")),
  negative_critical:category("negative_critical",r=>r.tags.includes("negative_critical"))
};

const multiRows=records.filter(r=>r.tags.includes("multi_action"));
const multi={
  ...metricSlice(multiRows),
  action_exact_given_command_exact:{
    denominator:multiRows.filter(r=>r.command_exact).length,
    exact:multiRows.filter(r=>r.command_exact&&r.action_exact).length
  },
  omitted_actions:multiRows.reduce((n,r)=>n+r.action_diff.omitted.length,0),
  extra_actions:multiRows.reduce((n,r)=>n+r.action_diff.extra.length,0),
  parameter_errors:multiRows.reduce((n,r)=>n+r.action_diff.parameter_errors,0),
  order_errors:multiRows.filter(r=>r.action_diff.order_error).length,
  cases:multiRows.map(r=>({
    id:r.id,
    command_exact:r.command_exact,
    action_exact:r.action_exact,
    full_exact:r.full_exact,
    omitted_actions:r.action_diff.omitted,
    extra_actions:r.action_diff.extra,
    parameter_errors:r.action_diff.parameter_errors,
    order_error:r.action_diff.order_error
  }))
};
multi.action_exact_given_command_exact.accuracy=div(multi.action_exact_given_command_exact.exact,multi.action_exact_given_command_exact.denominator);

const insufficientRows=records.filter(r=>r.expected.result_kind==="insufficient");
const insufficient={
  ...metricSlice(insufficientRows),
  kind_correct:insufficientRows.filter(r=>r.result_kind_exact).length,
  no_action_when_expected:insufficientRows.filter(r=>r.expected.actions.length===0&&r.predicted.actions.length===0).length,
  b3_correct:insufficientRows.filter(r=>r.b3_exact).length,
  full_contract_exact:insufficientRows.filter(r=>r.full_exact).length,
  undue_execution:insufficientRows.filter(r=>r.expected.actions.length===0&&r.predicted.actions.length>0).length,
  cases:insufficientRows.map(r=>({
    id:r.id,
    kind_correct:r.result_kind_exact,
    expected_kind:r.expected.result_kind,
    predicted_kind:r.predicted.result_kind,
    expected_actions:r.expected.actions,
    predicted_actions:r.predicted.actions,
    b3_correct:r.b3_exact,
    expected_b3:r.expected.b3,
    predicted_b3:r.predicted.b3,
    safety_exact:r.safety_exact,
    s0_exact:r.s0_exact,
    full_contract_exact:r.full_exact,
    undue_execution:r.expected.actions.length===0&&r.predicted.actions.length>0
  }))
};

const errorDistribution={};
const errorCombos={};
for(const r of records.filter(r=>!r.full_exact)){
  for(const reason of r.failure_reasons)errorDistribution[reason]=(errorDistribution[reason]||0)+1;
  const combo=r.failure_reasons.join("+")||"OTHER";
  errorCombos[combo]=(errorCombos[combo]||0)+1;
}

const perIntent={};
const intents=[...new Set(cases.flatMap(c=>(c.expected_commands||[]).map(x=>x.intent)))].sort();
for(const intent of intents){
  const rows=records.filter(r=>r.expected.commands.some(c=>c.intent===intent));
  perIntent[intent]=metricSlice(rows);
}
const perExecutionType=groupBy(records,r=>r.execution_type);
const perTag=groupTags(records);

const metrics={
  status:"I0_CALIBRATION_V3_INDEPENDENT_RUN_COMPLETE",
  total:records.length,
  full_exact:exactStats(records,"full_exact"),
  command_exact:exactStats(records,"command_exact"),
  action_exact:exactStats(records,"action_exact"),
  result_kind_exact:exactStats(records,"result_kind_exact"),
  s0_exact:exactStats(records,"s0_exact"),
  b3_exact:exactStats(records,"b3_exact"),
  safety_exact:exactStats(records,"safety_exact"),
  classification:{...cls},
  execution:{...exe},
  action_exact_conditioned_on_command_exact:actionGivenCommandExact,
  safety:{
    total_positive:safetyPos.length,
    exact:safetyPos.filter(r=>r.safety_exact).length,
    false_negatives:safetyFalseNeg.length,
    false_negative_ids:safetyFalseNeg.map(r=>r.id),
    false_positives:safetyFalsePos.length,
    false_positive_ids:safetyFalsePos.map(r=>r.id),
    protected_negative_action_free:safetyProtected.length,
    protected_negative_total:safetyPos.length,
    normal_controls_total:safetyNormalControls.length,
    normal_controls_exact:safetyNormalControls.filter(r=>r.safety_exact).length,
    normal_control_error_ids:safetyNormalControls.filter(r=>!r.safety_exact).map(r=>r.id)
  },
  multi_action:multi,
  insufficient,
  categories,
  per_intent:perIntent,
  per_execution_type:perExecutionType,
  per_tag:perTag,
  error_distribution:{
    total_failed_cases:records.filter(r=>!r.full_exact).length,
    reason_counts:Object.fromEntries(Object.entries(errorDistribution).sort(([a],[b])=>a.localeCompare(b))),
    combination_counts:Object.fromEntries(Object.entries(errorCombos).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])))
  }
};

const predictionFile=path.join(outputDir,"predictions.v3.jsonl");
fs.writeFileSync(predictionFile,records.map(r=>JSON.stringify({
  id:r.id,
  predicted:r.predicted,
  flags:{
    full_exact:r.full_exact,
    command_exact:r.command_exact,
    action_exact:r.action_exact,
    result_kind_exact:r.result_kind_exact,
    s0_exact:r.s0_exact,
    b3_exact:r.b3_exact,
    safety_exact:r.safety_exact,
    predicted_classify:r.predicted_classify,
    predicted_execute:r.predicted_execute
  }
})).join("\n")+"\n");

const discrepancyFile=path.join(outputDir,"discrepancies.unclassified.json");
const failures=records.filter(r=>!r.full_exact).map(r=>({
  id:r.id,
  tags:r.tags,
  ambiguity:r.ambiguity,
  execution_type:r.execution_type,
  failure_reasons:r.failure_reasons,
  expected:r.expected,
  predicted:r.predicted,
  action_diff:r.action_diff,
  discrepancy_classification:null
}));
fs.writeFileSync(discrepancyFile,JSON.stringify({classification_status:"PENDING_POST_RUN_DESCRIPTIVE_REVIEW",total:failures.length,items:failures},null,2)+"\n");

const metricsFile=path.join(outputDir,"metrics.v3.json");
fs.writeFileSync(metricsFile,JSON.stringify(metrics,null,2)+"\n");

const methodology=`# I0 Calibration V3 independent methodology

- Executor SHA: ${EXECUTOR_SHA}
- Calibration SHA: ${CALIBRATION_SHA}
- Corpus SHA-256: ${CORPUS_SHA256}
- Cases: 200
- Black-box API: predictI0V3(case), one call per frozen case.
- Threshold adjustment: none.
- Case modification: none.
- Selective rerun: none.
- Full exact requires exact Safety gate, command plan, action plan, ResultKind, S0 events and B3.
- Classification binary truth: frozen should_classify; predicted positive iff predicted_commands is non-empty.
- Execution binary truth: frozen should_execute_actions; predicted positive iff predicted_actions is non-empty.
- Action exact conditioned on command exact is computed only among cases with exact command plans.
- Discrepancy classification is performed only after the complete run and does not alter any score.
`;
fs.writeFileSync(path.join(outputDir,"methodology.md"),methodology);

const manifest={
  status:"I0_CALIBRATION_V3_INDEPENDENT_RUN_COMPLETE",
  executor_sha:EXECUTOR_SHA,
  calibration_sha:CALIBRATION_SHA,
  corpus_sha256:CORPUS_SHA256,
  corpus_hash_verified:true,
  executor_module:"tools/sabik-i0-executor-v3.mjs",
  executor_module_git_blob:null,
  runtime:{
    node:process.version,
    platform:process.platform,
    arch:process.arch,
    os_release:os.release(),
    os_version:os.version(),
    seed:null,
    randomness:false
  },
  run:{
    total_cases:200,
    executor_calls:200,
    complete_once:true,
    elapsed_ms:Number(elapsedNs/1000000n),
    thresholds_recalibrated:false,
    development_used:false,
    regression_used:false,
    validation_used:false,
    pr184_used:false
  },
  command:"node tools/independent/run-i0-calibration-v3-independent.mjs --corpus <CALIBRATION_SHA>/tests/calibration/sabik/i0-v3/calibration.v3.blind.jsonl --executor <EXECUTOR_SHA>/tools/sabik-i0-executor-v3.mjs --output artifact",
  files:{}
};
for(const name of ["predictions.v3.jsonl","metrics.v3.json","discrepancies.unclassified.json","methodology.md"]){
  const p=path.join(outputDir,name);
  manifest.files[name]={sha256:sha256File(p),bytes:fs.statSync(p).size};
}
const manifestFile=path.join(outputDir,"manifest.v3.json");
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+"\n");
manifest.files["manifest.v3.json"]={sha256:sha256File(manifestFile),bytes:fs.statSync(manifestFile).size};
fs.writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+"\n");

const sums=[];
for(const name of ["predictions.v3.jsonl","metrics.v3.json","discrepancies.unclassified.json","methodology.md","manifest.v3.json"]){
  sums.push(sha256File(path.join(outputDir,name))+"  "+name);
}
fs.writeFileSync(path.join(outputDir,"SHA256SUMS"),sums.join("\n")+"\n");

console.log(JSON.stringify({
  status:"I0_CALIBRATION_V3_INDEPENDENT_RUN_COMPLETE",
  executor_sha:EXECUTOR_SHA,
  calibration_sha:CALIBRATION_SHA,
  corpus_sha256:CORPUS_SHA256,
  total:metrics.total,
  full_exact:metrics.full_exact,
  command_exact:metrics.command_exact,
  action_exact:metrics.action_exact,
  result_kind_exact:metrics.result_kind_exact,
  s0_exact:metrics.s0_exact,
  b3_exact:metrics.b3_exact,
  safety_exact:metrics.safety_exact,
  classification:metrics.classification,
  execution:metrics.execution,
  action_exact_conditioned_on_command_exact:metrics.action_exact_conditioned_on_command_exact,
  safety:metrics.safety,
  multi_action:{
    total:metrics.multi_action.total,
    command_exact:metrics.multi_action.command_exact,
    action_exact:metrics.multi_action.action_exact,
    full_exact:metrics.multi_action.full_exact,
    action_exact_given_command_exact:metrics.multi_action.action_exact_given_command_exact,
    omitted_actions:metrics.multi_action.omitted_actions,
    extra_actions:metrics.multi_action.extra_actions,
    parameter_errors:metrics.multi_action.parameter_errors,
    order_errors:metrics.multi_action.order_errors
  },
  insufficient:{
    total:metrics.insufficient.total,
    kind_correct:metrics.insufficient.kind_correct,
    no_action_when_expected:metrics.insufficient.no_action_when_expected,
    b3_correct:metrics.insufficient.b3_correct,
    full_contract_exact:metrics.insufficient.full_contract_exact,
    undue_execution:metrics.insufficient.undue_execution
  },
  error_distribution:metrics.error_distribution,
  output_sha256:Object.fromEntries(Object.entries(manifest.files).map(([k,v])=>[k,v.sha256]))
},null,2));
