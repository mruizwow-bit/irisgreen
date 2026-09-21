#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {predictI0V3} from "./sabik-i0-executor-v3.mjs";
import {evaluateI0Cases} from "./sabik-i0-v3-evaluation-metrics.mjs";

const root=path.resolve(import.meta.dirname,"..");
const args=process.argv.slice(2);
const arg=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]:fallback;};
const configPath=path.resolve(arg("--config",path.join(root,"config/sabik/i0/executor-v3-development.json")));
const output=path.resolve(arg("--output",path.join(root,"reports/sabik/i0/executor-v3-r1-development")));
const auditPath=path.join(root,"docs/sabik-next/I0_V3_LITERAL_PROVENANCE_AUDIT.json");
const cfg=JSON.parse(fs.readFileSync(configPath,"utf8"));
const audit=JSON.parse(fs.readFileSync(auditPath,"utf8"));
if(audit.CASE_SHAPED_FORBIDDEN!==0)throw new Error("literal audit is not clean");

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
const devMetrics=evaluateI0Cases(D,devPred);
const regMetrics=evaluateI0Cases(R,regPred);

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
if(gateFailures.length)throw new Error("V3-R1 critical gate failure: "+gateFailures.join("; "));

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

const beforeDev=JSON.parse(fs.readFileSync(path.join(root,"reports/sabik/i0/executor-v3-development/metrics.development.v3.json"),"utf8"));
const beforeReg=JSON.parse(fs.readFileSync(path.join(root,"reports/sabik/i0/executor-v3-development/metrics.regression-v2-consumed.v3.json"),"utf8"));
const comparison={
  development:{before_v3:compact(beforeDev),after_v3_r1:compact(devMetrics)},
  consumed_regression:{role:"CONSUMED_DIAGNOSTIC_REGRESSION_SET",before_v3:compact(beforeReg),after_v3_r1:compact(regMetrics)}
};

fs.mkdirSync(output,{recursive:true});
const writeJson=(name,x)=>fs.writeFileSync(path.join(output,name),JSON.stringify(x,null,2)+"\n");
const writeJsonl=(name,x)=>fs.writeFileSync(path.join(output,name),x.map(v=>JSON.stringify(v)).join("\n")+"\n");

writeJsonl("predictions.development.v3-r1.jsonl",D.map((c,i)=>({id:c.id,utterance:c.utterance,predicted:devPred[i]})));
writeJsonl("predictions.regression-v2-consumed.v3-r1.jsonl",R.map((c,i)=>({id:c.id,utterance:c.utterance,predicted:regPred[i]})));
writeJson("metrics.development.v3-r1.json",{...devMetrics,errors:undefined});
writeJson("metrics.regression-v2-consumed.v3-r1.json",{...regMetrics,errors:undefined});
writeJson("errors.development.v3-r1.json",{count:devMetrics.errors.length,errors:devMetrics.errors});
writeJson("errors.regression-v2-consumed.v3-r1.json",{count:regMetrics.errors.length,errors:regMetrics.errors});
writeJson("comparison-v3-v3-r1.json",comparison);
writeJson("critical-gates.v3-r1.json",{development:devGates,consumed_regression:regGates,pass:true});

const artifactNames=fs.readdirSync(output).filter(x=>fs.statSync(path.join(output,x)).isFile());
const artifacts={};
for(const name of artifactNames)artifacts[name]={sha256:sha256File(path.join(output,name)),bytes:fs.statSync(path.join(output,name)).size};

const manifest={
  status:"I0_EXECUTOR_V3_R1_DECONTAMINATED_RUN_COMPLETE",
  base_head:cfg.base_head,
  executor_config:executorConfig,
  score_semantics:cfg.executor.score_semantics,
  literal_provenance_audit:{
    path:"docs/sabik-next/I0_V3_LITERAL_PROVENANCE_AUDIT.json",
    CASE_SHAPED_FORBIDDEN:audit.CASE_SHAPED_FORBIDDEN,
    counts:audit.counts
  },
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
writeJson("manifest.v3-r1.json",manifest);

console.log(JSON.stringify({
  status:"I0_EXECUTOR_V3_R1_DECONTAMINATED_RUN_COMPLETE",
  development:compact(devMetrics),
  consumed_regression:compact(regMetrics),
  before_after:comparison,
  critical_gates:{development:devGates,consumed_regression:regGates},
  manifest
},null,2));

