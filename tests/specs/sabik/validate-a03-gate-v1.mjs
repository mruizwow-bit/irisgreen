import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../../..");
const spec=JSON.parse(fs.readFileSync(path.join(root,"tests/specs/sabik/a03-gate-v1.json"),"utf8"));
const fx=JSON.parse(fs.readFileSync(path.join(root,spec.fixture),"utf8"));
const errors=[];
if(spec.baseline_sha!==fx.baseline_sha)errors.push("baseline mismatch");
if(!spec.frozen_before_a03_implementation||!fx.frozen_before_a03_implementation)errors.push("freeze flag missing");
if(fx.scenarios.length<10||fx.scenarios.length>14)errors.push("scenario count must be 10-14");
const ids=new Set();
for(const s of fx.scenarios){if(ids.has(s.id))errors.push("duplicate "+s.id);ids.add(s.id);if(!s.expect||!s.actions?.length)errors.push("invalid "+s.id);}
for(let i=1;i<=12;i++){const prefix=`A03-${String(i).padStart(2,"0")}`;if(!fx.scenarios.some(s=>s.id.startsWith(prefix)))errors.push("missing "+prefix);}
for(const forbidden of ["protection","functional_state","interaction","mode","visual_presence","ordinary_flow_block"]){
  if(spec.adaptation_definition.includes.includes(forbidden))errors.push("adaptation wrongly includes "+forbidden);
}
for(const required of spec.required_observables){
  const seen=fx.scenarios.some(s=>Object.keys(s.expect).some(k=>k===required||k.startsWith(required+"_")));
  if(!seen && !["protection_before","session_preferences_before","session_preferences_after","low_intensity_before","low_intensity_after","explicit_cognitive_signal"].includes(required))errors.push("observable never asserted "+required);
}
if(errors.length){console.error("A03_QA_CONTRACT_INVALID");errors.forEach(e=>console.error("- "+e));process.exit(1);}
console.log("A03_QA_CONTRACT_FROZEN");
console.log(JSON.stringify({baseline_sha:spec.baseline_sha,scenarios:fx.scenarios.length,adaptation_includes:spec.adaptation_definition.includes,adaptation_excludes:spec.adaptation_definition.excludes},null,2));
