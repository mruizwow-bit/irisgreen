#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {predictI0V3} from "./sabik-i0-executor-v3.mjs";
import {predictI0V2} from "./sabik-i0-executor-v2.mjs";
import {evaluateI0Cases} from "./sabik-i0-v3-evaluation-metrics.mjs";

const root=path.resolve(import.meta.dirname,"..");
const args=process.argv.slice(2);
const arg=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]:fallback;};
const configPath=path.resolve(arg("--config",path.join(root,"config/sabik/i0/executor-v3-development.json")));
const output=path.resolve(arg("--output",path.join(root,"reports/sabik/i0/executor-v3-development")));
const cfg=JSON.parse(fs.readFileSync(configPath,"utf8"));
const readJsonl=p=>fs.readFileSync(p,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const sha256File=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

const devPath=path.join(root,cfg.datasets.development.path);
const regPath=path.join(root,cfg.datasets.consumed_regression.path);
const schemaPath=path.join(root,cfg.datasets.schema.path);
if(sha256File(devPath)!==cfg.datasets.development.sha256)throw new Error("development hash mismatch");
if(sha256File(regPath)!==cfg.datasets.consumed_regression.sha256)throw new Error("consumed regression hash mismatch");
if(sha256File(schemaPath)!==cfg.datasets.schema.sha256)throw new Error("schema hash mismatch");

const D=readJsonl(devPath),R=readJsonl(regPath);
if(D.length!==400)throw new Error("development count != 400");
if(R.length!==200)throw new Error("consumed regression count != 200");

const executorConfig={fallback_accept_score_min:cfg.executor.fallback_accept_score_min};
const devPred=D.map((c,i)=>predictI0V3(c,D.filter((_,j)=>j!==i),executorConfig));
const regPred=R.map(c=>predictI0V3(c,D,executorConfig));
const regBaselinePred=R.map(c=>predictI0V2(c,D,executorConfig));
const devMetrics=evaluateI0Cases(D,devPred);
const regMetrics=evaluateI0Cases(R,regPred);
const regBaselineMetrics=evaluateI0Cases(R,regBaselinePred);
const devBaseline=JSON.parse(fs.readFileSync(path.join(root,"reports/sabik/i0/executor-v2-r1-development/metrics.development.v2-r1.json"),"utf8"));

function criticalGateSummary(m){
  return {
    safety_errors:m.safety_gate.errors,
    negative_false_triggers:m.negation.negative.false_triggers,
    positive_control_failures:m.negation.positive.failures,
    insufficient_contract_errors:m.insufficient.total-m.insufficient.full_contract,
    multi_action_omitted_when_command_exact:m.multi_action.omitted_when_command_exact,
    multi_action_extra_when_command_exact:m.multi_action.extra_when_command_exact,
    multi_action_order_errors_when_command_exact:m.multi_action.order_errors_when_command_exact,
    multi_action_wrong_parameters_when_command_exact:m.multi_action.wrong_when_command_exact
  };
}
const devGates=criticalGateSummary(devMetrics),regGates=criticalGateSummary(regMetrics);
const gateFailures=[
  ...Object.entries(devGates).filter(([k,v])=>k!=="positive_control_failures"&&k!=="multi_action_wrong_parameters_when_command_exact"&&v!==0).map(([k,v])=>"development "+k+"="+v),
  ...Object.entries(regGates).filter(([k,v])=>k!=="positive_control_failures"&&k!=="multi_action_wrong_parameters_when_command_exact"&&v!==0).map(([k,v])=>"regression "+k+"="+v)
];
if(devMetrics.negation.positive.total&&devGates.positive_control_failures!==0)gateFailures.push("development positive controls fail");
if(regMetrics.negation.positive.total&&regGates.positive_control_failures!==0)gateFailures.push("regression positive controls fail");
if(gateFailures.length)throw new Error("V3 critical gate failure: "+gateFailures.join("; "));

function compact(m){
  return {
    total:m.total,correct:m.correct,incorrect:m.incorrect,accuracy:m.accuracy,
    full_exact:m.full_exact,
    classification:m.classification,
    action_execution:m.execution,
    result_kind:m.result_kind,
    s0_events:m.s0_events,
    b3:m.b3,
    safety_gate:m.safety_gate,
    negation:m.negation,
    insufficient:m.insufficient,
    multi_action:m.multi_action,
    clarification:m.clarification,
    abstention:m.abstention,
    by_risk:m.by_risk,
    errors_by_risk:m.errors_by_risk
  };
}

const comparison={
  development:{
    v2_r1:{
      full_exact:{correct:devBaseline.correct,total:devBaseline.total,accuracy:devBaseline.accuracy},
      command_plan_exact:{correct:devBaseline.classification.command_plan_exact,total:devBaseline.total,accuracy:devBaseline.classification.command_plan_accuracy},
      action_plan_exact:{correct:devBaseline.execution.action_plan_exact,total:devBaseline.total,accuracy:devBaseline.execution.action_plan_accuracy},
      result_kind:devBaseline.result_kind,s0_events:devBaseline.s0_events,b3:devBaseline.b3,safety_gate:devBaseline.safety_gate,
      execution:devBaseline.execution.binary,multi_action:devBaseline.multi_action,negation:devBaseline.negation,insufficient:devBaseline.insufficient
    },
    v3:compact(devMetrics)
  },
  consumed_regression:{
    role:"CONSUMED_DIAGNOSTIC_REGRESSION_SET",
    v2_r1:compact(regBaselineMetrics),
    v3:compact(regMetrics)
  }
};

fs.mkdirSync(output,{recursive:true});
const writeJson=(name,x)=>fs.writeFileSync(path.join(output,name),JSON.stringify(x,null,2)+"\n");
const writeJsonl=(name,x)=>fs.writeFileSync(path.join(output,name),x.map(v=>JSON.stringify(v)).join("\n")+"\n");

writeJsonl("predictions.development.v3.jsonl",D.map((c,i)=>({id:c.id,utterance:c.utterance,predicted:devPred[i]})));
writeJsonl("predictions.regression-v2-consumed.v3.jsonl",R.map((c,i)=>({id:c.id,utterance:c.utterance,predicted:regPred[i]})));
writeJson("metrics.development.v3.json",{...devMetrics,errors:undefined});
writeJson("metrics.regression-v2-consumed.v3.json",{...regMetrics,errors:undefined});
writeJson("errors.development.v3.json",{count:devMetrics.errors.length,errors:devMetrics.errors});
writeJson("errors.regression-v2-consumed.v3.json",{count:regMetrics.errors.length,errors:regMetrics.errors});
writeJson("comparison-v2-r1-v3.json",comparison);
writeJson("critical-gates.v3.json",{development:devGates,consumed_regression:regGates,pass:true});

const artifactNames=fs.readdirSync(output).filter(x=>fs.statSync(path.join(output,x)).isFile());
const artifacts={};
for(const name of artifactNames)artifacts[name]={sha256:sha256File(path.join(output,name)),bytes:fs.statSync(path.join(output,name)).size};

const manifest={
  status:"I0_EXECUTOR_V3_DEVELOPMENT_RUN_COMPLETE",
  base_head:cfg.base_head,
  executor_config:executorConfig,
  score_semantics:cfg.executor.score_semantics,
  inputs:{
    development:{cases:D.length,sha256:sha256File(devPath)},
    consumed_regression:{cases:R.length,sha256:sha256File(regPath),role:"CONSUMED_DIAGNOSTIC_REGRESSION_SET"},
    schema:{sha256:sha256File(schemaPath)}
  },
  gates:{development:devGates,consumed_regression:regGates},
  reserved_calibration_v3_opened:false,
  reserved_calibration_v3_executed:false,
  validation_opened:false,
  validation_executed:false,
  datasets_modified:false,
  schema_modified:false,
  artifacts
};
writeJson("manifest.v3.json",manifest);

console.log(JSON.stringify({
  status:"I0_EXECUTOR_V3_DEVELOPMENT_RUN_COMPLETE",
  development:compact(devMetrics),
  consumed_regression:compact(regMetrics),
  regression_baseline_v2_r1:compact(regBaselineMetrics),
  critical_gates:{development:devGates,consumed_regression:regGates},
  manifest
},null,2));

