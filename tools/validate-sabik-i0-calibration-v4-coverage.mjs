#!/usr/bin/env node
import fs from "node:fs";

const args=process.argv.slice(2);
const arg=(name,required=false)=>{const i=args.indexOf(name);if(i<0){if(required)throw new Error("Missing "+name);return null;}return args[i+1];};
const datasetPath=arg("--dataset",true);
const precommitPath=arg("--precommit",true);
const reportPath=arg("--report");
const rows=fs.readFileSync(datasetPath,"utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse);
const pre=JSON.parse(fs.readFileSync(precommitPath,"utf8"));
const norm=s=>String(s??"").normalize("NFKC").toLocaleLowerCase("es").replace(/\s+/g," ").trim();

const intentCounts={};
for(const row of rows)for(const cmd of row.expected_commands||[])intentCounts[cmd.intent]=(intentCounts[cmd.intent]||0)+1;
const countTag=t=>rows.filter(r=>(r.tags||[]).includes(t)).length;
const categories={
  safety_positive:countTag("safety"),
  negation:countTag("negation"),
  insufficient:rows.filter(r=>r.expected_result_kind==="insufficient").length,
  ambiguity:rows.filter(r=>r.ambiguity===true).length,
  correction:countTag("correction"),
  multi_action:countTag("multi_action"),
  positive_control:countTag("positive_control"),
  negative_critical:countTag("negative_critical")
};
const risks={
  none:countTag("risk:none"),
  local_reversible:countTag("risk:local_reversible"),
  local_with_loss:countTag("risk:local_with_loss"),
  mixed:countTag("risk:mixed")
};
const ids=rows.map(r=>r.id);
const utterances=rows.map(r=>norm(r.utterance));
const failures=[];
if(rows.length!==pre.total_cases)failures.push({kind:"total",expected:pre.total_cases,actual:rows.length});
if(new Set(ids).size!==rows.length)failures.push({kind:"duplicate_ids"});
if(new Set(utterances).size!==rows.length)failures.push({kind:"duplicate_normalized_utterances"});
if(ids[0]!==pre.id_namespace.first||ids.at(-1)!==pre.id_namespace.last)failures.push({kind:"id_range",first:ids[0],last:ids.at(-1)});
for(const [intent,target] of Object.entries(pre.intent_appearance_targets||{})){
  const actual=intentCounts[intent]||0;
  if(actual!==target)failures.push({kind:"intent",intent,expected:target,actual});
}
for(const [key,target] of Object.entries(pre.category_targets||{})){
  const actual=categories[key];
  if(actual!==target)failures.push({kind:"category",category:key,expected:target,actual});
}
for(const [key,target] of Object.entries(pre.risk_case_targets||{})){
  const actual=risks[key];
  if(actual!==target)failures.push({kind:"risk",risk:key,expected:target,actual});
}
for(const row of rows){
  if(row.dataset_role!=="calibration")failures.push({kind:"dataset_role",id:row.id});
  if(!/^I0-CAL-4[0-2][0-9]{2}$/.test(row.id))failures.push({kind:"v4_id_namespace",id:row.id});
}
const report={
  validator:"sabik-i0-v4-coverage-v1",
  dataset:datasetPath,
  precommit:precommitPath,
  total:rows.length,
  unique_ids:new Set(ids).size,
  unique_normalized_utterances:new Set(utterances).size,
  intent_counts:Object.fromEntries(Object.entries(intentCounts).sort()),
  category_counts:categories,
  risk_case_counts:risks,
  failures,
  pass:failures.length===0
};
if(reportPath)fs.writeFileSync(reportPath,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify(report,null,2));
if(!report.pass)process.exit(1);
