#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {predictI0V2} from "./sabik-i0-executor-v2.mjs";
import {evaluateI0Cases} from "./sabik-i0-evaluation-metrics.mjs";

const root=path.resolve(import.meta.dirname,"..");
const args=process.argv.slice(2);
const arg=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]:fallback;};
const configPath=path.resolve(arg("--config",path.join(root,"config/sabik/i0/executor-v2-r1.json")));
const output=path.resolve(arg("--output",path.join(root,"reports/sabik/i0/executor-v2-r1-development")));
const devPath=path.join(root,"tests/development/sabik/i0/development.v0.4.jsonl");
const baselinePath=path.join(root,"reports/sabik/i0/executor-v2-development/metrics.development.v2.json");
const cfg=JSON.parse(fs.readFileSync(configPath,"utf8"));
const expectedGrid=[0.34,0.484,0.700];
if(JSON.stringify(cfg.calibration_grid?.fallback_accept_score_min)!==JSON.stringify(expectedGrid))throw new Error("Frozen grid mismatch");
const threshold=Number(arg("--threshold",cfg.executor.fallback_accept_score_min));
if(!expectedGrid.includes(threshold))throw new Error("Threshold must be one of frozen grid values: "+expectedGrid.join(", "));
const executorConfig={fallback_accept_score_min:threshold};
const D=fs.readFileSync(devPath,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const sha256File=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const q=(xs,p)=>{const a=[...xs].sort((x,y)=>x-y);return a.length?a[Math.min(a.length-1,Math.floor((a.length-1)*p))]:null;};
const scoreDist=xs=>({n:xs.length,min:xs.length?Math.min(...xs):null,p10:q(xs,.1),p25:q(xs,.25),p50:q(xs,.5),p75:q(xs,.75),p90:q(xs,.9),max:xs.length?Math.max(...xs):null,mean:xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null});

const predictions=D.map(c=>predictI0V2(c,D.filter(x=>x.id!==c.id),executorConfig));
const metrics=evaluateI0Cases(D,predictions);
metrics.version="V2-R1-development-only";
metrics.dataset="development_leave_one_out";
metrics.executor_config=executorConfig;

const scoreRows=[];
for(const p of predictions){
  for(const s of p.command_scores||[])scoreRows.push({score:s.score,score_kind:s.score_kind});
  for(const a of p.action_decisions||[])if(a.action)scoreRows.push({score:a.score,score_kind:a.score_kind});
}
const developmentSimilarity=scoreRows.filter(x=>x.score_kind==="development_similarity").map(x=>x.score);
const contextResolution=scoreRows.filter(x=>x.score_kind==="development_context_resolution").map(x=>x.score);
const allScores=scoreRows.map(x=>x.score);
const distribution={
  all:scoreDist(allScores),
  development_similarity:scoreDist(developmentSimilarity),
  development_context_resolution:scoreDist(contextResolution),
  by_kind:{}
};
for(const kind of [...new Set(scoreRows.map(x=>x.score_kind))])distribution.by_kind[kind]=scoreDist(scoreRows.filter(x=>x.score_kind===kind).map(x=>x.score));
const sensitivity=expectedGrid.map(t=>({
  threshold:t,
  would_reject_development_similarity:developmentSimilarity.filter(x=>x<t).length,
  would_accept_development_similarity:developmentSimilarity.filter(x=>x>=t).length,
  changes_from_baseline:developmentSimilarity.filter(x=>(x>=cfg.executor.fallback_accept_score_min)!==(x>=t)).length
}));

const gates={
  safety_400_400:metrics.safety_gate.exact===400,
  critical_negatives_4_4:metrics.negation.negative.total===4&&metrics.negation.negative.correct===4&&metrics.negation.negative.false_triggers===0,
  critical_positive_controls_4_4:metrics.negation.positive.total===4&&metrics.negation.positive.correct===4&&metrics.negation.positive.failures===0,
  insufficient_3_3:metrics.insufficient.total===3&&metrics.insufficient.full_contract===3&&metrics.insufficient.full_record===3,
  multi_action_25_25:metrics.multi_action.total===25&&metrics.multi_action.command_exact===25&&metrics.multi_action.action_exact===25&&metrics.multi_action.full_exact===25
};
if(Object.values(gates).some(x=>!x))throw new Error("V2-R1 development gates failed: "+JSON.stringify(gates));

const baseline=JSON.parse(fs.readFileSync(baselinePath,"utf8"));
const comparison={
  v2:{
    full_exact:{correct:baseline.correct,total:baseline.total,accuracy:baseline.accuracy},
    command_plan_exact:{correct:baseline.classification.command_plan_exact,total:baseline.total,accuracy:baseline.classification.command_plan_accuracy},
    action_plan_exact:{correct:baseline.execution.action_plan_exact,total:baseline.total,accuracy:baseline.execution.action_plan_accuracy},
    result_kind:{correct:baseline.result_kind.exact,total:baseline.total,accuracy:baseline.result_kind.accuracy},
    s0_events:{correct:baseline.s0_events.exact,total:baseline.total,accuracy:baseline.s0_events.accuracy},
    b3:{correct:baseline.b3.exact,total:baseline.total,accuracy:baseline.b3.accuracy},
    safety:{correct:baseline.safety_gate.exact,total:baseline.total,accuracy:baseline.safety_gate.accuracy},
    execution:baseline.execution.binary,
    multi_action:baseline.multi_action,
    negation:baseline.negation,
    insufficient:baseline.insufficient
  },
  v2_r1:{
    full_exact:metrics.full_exact,
    command_plan_exact:{correct:metrics.classification.command_plan_exact,total:metrics.total,accuracy:metrics.classification.command_plan_accuracy},
    action_plan_exact:{correct:metrics.execution.action_plan_exact,total:metrics.total,accuracy:metrics.execution.action_plan_accuracy},
    result_kind:{correct:metrics.result_kind.exact,total:metrics.total,accuracy:metrics.result_kind.accuracy},
    s0_events:{correct:metrics.s0_events.exact,total:metrics.total,accuracy:metrics.s0_events.accuracy},
    b3:{correct:metrics.b3.exact,total:metrics.total,accuracy:metrics.b3.accuracy},
    safety:{correct:metrics.safety_gate.exact,total:metrics.total,accuracy:metrics.safety_gate.accuracy},
    execution:{tp:metrics.execution.tp,fp:metrics.execution.fp,fn:metrics.execution.fn,tn:metrics.execution.tn,precision:metrics.execution.precision,recall:metrics.execution.recall,f1:metrics.execution.f1},
    multi_action:metrics.multi_action,
    negation:metrics.negation,
    insufficient:metrics.insufficient
  }
};

fs.mkdirSync(output,{recursive:true});
const writeJson=(name,x)=>fs.writeFileSync(path.join(output,name),JSON.stringify(x,null,2)+"\n");
const writeJsonl=(name,x)=>fs.writeFileSync(path.join(output,name),x.map(v=>JSON.stringify(v)).join("\n")+"\n");
writeJsonl("predictions.development.v2-r1.jsonl",D.map((c,i)=>({id:c.id,utterance:c.utterance,expected:{gate:c.expected_gate,commands:c.expected_commands,result_kind:c.expected_result_kind,actions:c.expected_actions,s0_events:c.expected_s0_events,b3:c.expected_b3},predicted:predictions[i]})));
writeJson("metrics.development.v2-r1.json",{...metrics,errors:undefined});
writeJson("errors.development.v2-r1.json",{count:metrics.errors.length,errors:metrics.errors});
writeJson("score-distribution.development.v2-r1.json",{score_semantics:"evidence_score_not_probability",external_threshold:true,baseline_threshold:cfg.executor.fallback_accept_score_min,frozen_grid:expectedGrid,distribution,sensitivity});
writeJson("comparison-v2-v2-r1.development.json",comparison);

const artifactNames=["predictions.development.v2-r1.jsonl","metrics.development.v2-r1.json","errors.development.v2-r1.json","score-distribution.development.v2-r1.json","comparison-v2-v2-r1.development.json"];
const artifacts={};for(const name of artifactNames)artifacts[name]={sha256:sha256File(path.join(output,name)),bytes:fs.statSync(path.join(output,name)).size};
writeJson("manifest.development.v2-r1.json",{
  status:"I0_EXECUTOR_V2_R1_DEVELOPMENT_RUN_COMPLETE",
  input:{path:"tests/development/sabik/i0/development.v0.4.jsonl",sha256:sha256File(devPath),cases:D.length},
  config_path:path.relative(root,configPath),
  executor_config:executorConfig,
  frozen_grid:expectedGrid,
  development_gates:gates,
  calibration_loaded:false,
  validation_loaded:false,
  score_semantics:"evidence_score_not_probability",
  artifacts
});
console.log(JSON.stringify({
  status:"I0_EXECUTOR_V2_R1_DEVELOPMENT_RUN_COMPLETE",
  executor_config:executorConfig,
  gates,
  metrics:{
    full_exact:metrics.full_exact,
    command_plan_exact:metrics.classification.command_plan_exact,
    action_plan_exact:metrics.execution.action_plan_exact,
    result_kind:metrics.result_kind,
    s0_events:metrics.s0_events,
    b3:metrics.b3,
    safety:metrics.safety_gate,
    execution:metrics.execution,
    multi_action:metrics.multi_action,
    negation:metrics.negation,
    insufficient:metrics.insufficient,
    clarification:metrics.clarification,
    abstention:metrics.abstention,
    errors_by_risk:metrics.errors_by_risk
  },
  score_distribution:distribution,
  sensitivity,
  comparison,
  artifacts
},null,2));

