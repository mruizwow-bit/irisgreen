#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"..");
const executorPath=path.join(root,"tools/sabik-i0-executor-v3.mjs");
const developmentPath=path.join(root,"tests/development/sabik/i0/development.v0.4.jsonl");
const regressionPath=path.join(root,"tests/calibration/sabik/i0/calibration.v0.4.jsonl");
const source=fs.readFileSync(executorPath,"utf8");
const readJsonl=p=>fs.readFileSync(p,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const cases=[...readJsonl(developmentPath),...readJsonl(regressionPath)];
const normalize=s=>String(s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
const normalizedSource=normalize(source);
const errors=[];

if(/\bI0-(?:DEV|CAL)-\d{4}\b/u.test(source))errors.push("executor contains corpus case ID");
if(/\b(?:caseOverrides|exceptionsById|utteranceOverrides|specialCasesById|perCaseRules)\b/u.test(source))errors.push("executor contains case-by-case exception table marker");

for(const c of cases){
  const u=normalize(c.utterance);
  if(u.length<32)continue;
  if(normalizedSource.includes(u))errors.push("executor contains exact long corpus utterance: "+c.id);
}

const suspiciousObjectKeys=[...source.matchAll(/["']I0-(?:DEV|CAL)-\d{4}["']\s*:/gu)];
if(suspiciousObjectKeys.length)errors.push("executor contains corpus-ID keyed object");

console.log(JSON.stringify({
  status:errors.length?"FAIL":"PASS",
  executor:"tools/sabik-i0-executor-v3.mjs",
  development_cases:400,
  consumed_regression_cases:200,
  long_utterances_checked:cases.filter(c=>normalize(c.utterance).length>=32).length,
  errors
},null,2));
if(errors.length)process.exit(1);

