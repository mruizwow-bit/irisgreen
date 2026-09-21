import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../../..");
const spec=JSON.parse(fs.readFileSync(path.join(root,"tests/specs/sabik/a01-safety-gate-v1.json"),"utf8"));
const fx=JSON.parse(fs.readFileSync(path.join(root,spec.fixture),"utf8"));
const errors=[];
if(spec.base_sha!==fx.base_sha)errors.push("base_sha mismatch");
if(!spec.frozen_before_candidate_review||!fx.frozen_before_candidate_review)errors.push("freeze flag missing");
if(fx.scenarios.length<10)errors.push("insufficient scenarios");
const ids=new Set();
for(const s of fx.scenarios){
  if(ids.has(s.id))errors.push("duplicate "+s.id);ids.add(s.id);
  if(!Array.isArray(s.steps)||!s.steps.length)errors.push("empty "+s.id);
}
const required=["AMBIGUOUS","YES","NO","CONFIRMED-NEUTRAL","CORRECTION","RETRY","PAUSE-RESUME","ERROR","RESET","NEGATED-RISK","SENSITIVE-NOT-RISK"];
for(const token of required)if(!fx.scenarios.some(s=>s.id.includes(token)))errors.push("missing coverage "+token);
if(errors.length){console.error("A01_QA_CONTRACT_INVALID");errors.forEach(e=>console.error("- "+e));process.exit(1);}
console.log("A01_QA_CONTRACT_FROZEN");
console.log(JSON.stringify({base_sha:spec.base_sha,scenarios:fx.scenarios.length,protected_s0_paths:spec.protected_s0_paths.length},null,2));
