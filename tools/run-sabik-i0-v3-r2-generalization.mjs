#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {predictI0V3R2} from "./sabik-i0-executor-v3-r2.mjs";
import {evaluateI0CasesR2} from "./sabik-i0-v3-r2-evaluation-metrics.mjs";

const root=path.resolve(import.meta.dirname,"..");
const args=process.argv.slice(2);
const arg=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]:fallback;};
const configPath=path.resolve(arg("--config",path.join(root,"config/sabik/i0/executor-v3-r2-generalization.json")));
const output=path.resolve(arg("--output",path.join(root,"reports/sabik/i0/executor-v3-r2-generalization")));
const auditPath=path.join(root,"docs/sabik-next/I0_V3_R2_LITERAL_PROVENANCE_AUDIT.json");

const cfg=JSON.parse(fs.readFileSync(configPath,"utf8"));
const audit=JSON.parse(fs.readFileSync(auditPath,"utf8"));
if(audit.CASE_SHAPED_FORBIDDEN!==0)throw new Error("R2 literal provenance audit is not clean");

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

const devPred=D.map(c=>predictI0V3R2(c,[],{}));
const regPred=R.map(c=>predictI0V3R2(c,[],{}));
const devMetrics=evaluateI0CasesR2(D,devPred);
const regMetrics=evaluateI0CasesR2(R,regPred);
devMetrics.r2.gates.CASE_SHAPED_FORBIDDEN=audit.CASE_SHAPED_FORBIDDEN;
regMetrics.r2.gates.CASE_SHAPED_FORBIDDEN=audit.CASE_SHAPED_FORBIDDEN;

function assertGates(name,m){
  const g=m.r2.gates;
  const failures=Object.entries(g).filter(([,v])=>v!==0);
  if(failures.length)throw new Error(name+" gate failure: "+JSON.stringify(failures));
}
assertGates("development",devMetrics);
assertGates("consumed_regression",regMetrics);

function compact(m){
  return {
    total:m.total,correct:m.correct,incorrect:m.incorrect,accuracy:m.accuracy,
    full_exact:m.full_exact,
    classification:m.classification,
    execution:m.execution,
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
    errors_by_risk:m.errors_by_risk,
    r2:m.r2
  };
}

fs.mkdirSync(output,{recursive:true});
const writeJson=(name,x)=>fs.writeFileSync(path.join(output,name),JSON.stringify(x,null,2)+"\n");
const writeJsonl=(name,x)=>fs.writeFileSync(path.join(output,name),x.map(v=>JSON.stringify(v)).join("\n")+"\n");

writeJsonl("predictions.development.v3-r2.jsonl",D.map((c,i)=>({id:c.id,utterance:c.utterance,predicted:devPred[i]})));
writeJsonl("predictions.regression-v2-consumed.v3-r2.jsonl",R.map((c,i)=>({id:c.id,utterance:c.utterance,predicted:regPred[i]})));
writeJson("metrics.development.v3-r2.json",{...devMetrics,errors:undefined});
writeJson("metrics.regression-v2-consumed.v3-r2.json",{...regMetrics,errors:undefined});
writeJson("errors.development.v3-r2.json",{count:devMetrics.errors.length,errors:devMetrics.errors});
writeJson("errors.regression-v2-consumed.v3-r2.json",{count:regMetrics.errors.length,errors:regMetrics.errors});
writeJson("critical-gates.v3-r2.json",{development:devMetrics.r2.gates,consumed_regression:regMetrics.r2.gates,pass:true});
writeJson("opaque-contract-gaps.v3-r2.json",{development:devMetrics.r2.opaque_contract_gaps,consumed_regression:regMetrics.r2.opaque_contract_gaps});

const artifactNames=fs.readdirSync(output).filter(x=>fs.statSync(path.join(output,x)).isFile());
const artifacts={};
for(const name of artifactNames)artifacts[name]={sha256:sha256File(path.join(output,name)),bytes:fs.statSync(path.join(output,name)).size};

const manifest={
  status:"I0_EXECUTOR_V3_R2_GENERALIZATION_RUN_COMPLETE",
  base_head:cfg.base_head,
  architecture:cfg.architecture,
  inputs:{
    development:{cases:D.length,sha256:sha256File(devPath)},
    consumed_regression:{cases:R.length,sha256:sha256File(regPath),role:"CONSUMED_DIAGNOSTIC_REGRESSION_SET"},
    schema:{sha256:sha256File(schemaPath)}
  },
  literal_provenance:{
    path:"docs/sabik-next/I0_V3_R2_LITERAL_PROVENANCE_AUDIT.json",
    CASE_SHAPED_FORBIDDEN:audit.CASE_SHAPED_FORBIDDEN,
    counts:audit.counts
  },
  gates:{development:devMetrics.r2.gates,consumed_regression:regMetrics.r2.gates},
  opaque_contract_gaps:{
    development:devMetrics.r2.opaque_contract_gaps,
    consumed_regression:regMetrics.r2.opaque_contract_gaps
  },
  reserved_calibration_v3_opened:false,
  reserved_calibration_v3_executed:false,
  reserved_calibration_v4_opened:false,
  reserved_calibration_v4_executed:false,
  validation_opened:false,
  validation_executed:false,
  datasets_modified:false,
  schema_modified:false,
  artifacts
};
writeJson("manifest.v3-r2.json",manifest);

console.log(JSON.stringify({
  status:"I0_EXECUTOR_V3_R2_GENERALIZATION_RUN_COMPLETE",
  development:compact(devMetrics),
  consumed_regression:compact(regMetrics),
  manifest
},null,2));

