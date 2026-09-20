#!/usr/bin/env node
// FUTURE-ONLY runner. Do not execute before ASTRA_AUTHORIZATION · CALIBRATION_RUN_V2.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {predictI0V2} from "./sabik-i0-executor-v2.mjs";
import {evaluateI0Cases} from "./sabik-i0-evaluation-metrics.mjs";
import {selectCalibrationCandidate} from "./sabik-i0-calibration-v2-selection.mjs";

const root=path.resolve(import.meta.dirname,"..");
const args=process.argv.slice(2);
const arg=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]:fallback;};
if(!args.includes("--astra-authorized")){
  throw new Error("CALIBRATION_RUN_V2 is frozen but not authorized. Require --astra-authorized after explicit Astra authorization.");
}
const configPath=path.resolve(arg("--config",path.join(root,"config/sabik/i0/executor-v2-r1.json")));
const output=path.resolve(arg("--output",path.join(root,"reports/sabik/i0/calibration-v2")));
const cfg=JSON.parse(fs.readFileSync(configPath,"utf8"));
const grid=cfg.calibration_grid?.fallback_accept_score_min;
const expectedGrid=[0.34,0.484,0.700];
if(JSON.stringify(grid)!==JSON.stringify(expectedGrid))throw new Error("Frozen calibration grid mismatch");
const devPath=path.join(root,cfg.inputs.development.path);
const calPath=path.join(root,cfg.inputs.calibration.path);
const sha256File=p=>crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
if(sha256File(devPath)!==cfg.inputs.development.sha256)throw new Error("Development hash mismatch");
if(sha256File(calPath)!==cfg.inputs.calibration.sha256)throw new Error("Calibration hash mismatch");
const readJsonl=p=>fs.readFileSync(p,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const D=readJsonl(devPath),C=readJsonl(calPath);
if(D.length!==400)throw new Error("Expected exactly 400 development cases");
if(C.length!==200)throw new Error("Expected exactly 200 calibration cases");
const expectedIds=C.map(c=>c.id);
if(new Set(expectedIds).size!==200)throw new Error("Calibration IDs must be unique");

fs.mkdirSync(output,{recursive:true});
const writeJson=(name,x)=>fs.writeFileSync(path.join(output,name),JSON.stringify(x,null,2)+"\n");
const writeJsonl=(name,x)=>fs.writeFileSync(path.join(output,name),x.map(v=>JSON.stringify(v)).join("\n")+"\n");

const candidates=[];
for(const threshold of grid){
  const executorConfig={fallback_accept_score_min:threshold};
  const predictions=C.map(c=>predictI0V2(c,D,executorConfig));
  const ids=predictions.map(p=>p.id);
  if(ids.length!==200||new Set(ids).size!==200||JSON.stringify(ids)!==JSON.stringify(expectedIds)){
    throw new Error("Candidate "+threshold+" did not evaluate exactly the same ordered 200 calibration IDs");
  }
  const metrics=evaluateI0Cases(C,predictions);
  const candidate={threshold,executor_config:executorConfig,metrics:{
    total:metrics.total,
    full_exact:metrics.full_exact,
    classification:metrics.classification,
    execution:metrics.execution,
    safety_errors:metrics.safety_gate.errors,
    safety:metrics.safety_gate,
    negation:metrics.negation,
    multi_action:metrics.multi_action,
    insufficient:metrics.insufficient,
    clarification:metrics.clarification,
    abstention:metrics.abstention,
    by_risk:metrics.by_risk,
    errors_by_risk:metrics.errors_by_risk,
    result_kind:metrics.result_kind,
    s0_events:metrics.s0_events,
    b3:metrics.b3
  }};
  candidates.push(candidate);
  writeJsonl("predictions.threshold-"+String(threshold).replace(".","_")+".jsonl",C.map((c,i)=>({id:c.id,predicted:predictions[i]})));
  writeJson("metrics.threshold-"+String(threshold).replace(".","_")+".json",candidate.metrics);
}

const selection=selectCalibrationCandidate(candidates);
writeJson("candidates.json",{grid,candidates});
writeJson("selection.json",selection);

const artifacts={};
for(const name of fs.readdirSync(output)){
  const p=path.join(output,name);
  if(fs.statSync(p).isFile())artifacts[name]={sha256:sha256File(p),bytes:fs.statSync(p).size};
}
writeJson("manifest.json",{
  status:"I0_CALIBRATION_RUN_V2_COMPLETE",
  config_path:path.relative(root,configPath),
  frozen_grid:grid,
  selection_policy:"tools/sabik-i0-calibration-v2-selection.mjs",
  same_calibration_cases_for_all_candidates:true,
  calibration_case_count:C.length,
  calibration_ids_sha256:crypto.createHash("sha256").update(expectedIds.join("\n")).digest("hex"),
  development:{cases:D.length,sha256:sha256File(devPath)},
  calibration:{cases:C.length,sha256:sha256File(calPath)},
  validation_loaded:false,
  artifacts
});
console.log(JSON.stringify({status:"I0_CALIBRATION_RUN_V2_COMPLETE",grid,selection,artifacts},null,2));

