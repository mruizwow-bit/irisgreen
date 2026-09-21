#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"..");
const executorPath=path.join(root,"tools/sabik-i0-executor-v3-r2.mjs");
const developmentPath=path.join(root,"tests/development/sabik/i0/development.v0.4.jsonl");
const regressionPath=path.join(root,"tests/calibration/sabik/i0/calibration.v0.4.jsonl");
const auditPath=path.join(root,"docs/sabik-next/I0_V3_R2_LITERAL_PROVENANCE_AUDIT.json");

const normalize=s=>String(s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase()
  .replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
const words=s=>normalize(s).split(/\s+/u).filter(Boolean);
const readJsonl=p=>fs.readFileSync(p,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const source=fs.readFileSync(executorPath,"utf8");
const audit=JSON.parse(fs.readFileSync(auditPath,"utf8"));
const datasets=[
  {name:"development",cases:readJsonl(developmentPath)},
  {name:"consumed_regression",cases:readJsonl(regressionPath)}
];
const errors=[];

if(audit.CASE_SHAPED_FORBIDDEN!==0)errors.push("literal provenance audit CASE_SHAPED_FORBIDDEN != 0");
if(audit.counts?.CASE_SHAPED_FORBIDDEN!==0)errors.push("literal provenance count mismatch");

const approved=new Set([
  ...(audit.entries||[])
    .filter(e=>e.classification==="CONTRACT_TERM"||e.classification==="GENERAL_PRODUCT_LEXICON")
    .map(e=>e.normalized),
  ...(audit.general_product_lexicon||[])
]);

function technicalLiteral(raw){
  if(!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/u.test(raw))return true;
  if(raw.includes("\\")||raw.includes("_")||raw.includes("/")||raw.includes(".mjs")||raw.includes(".json")||raw.includes("sha256"))return true;
  if(raw.length<=2)return true;
  if(/^[A-Z0-9_:-]+$/u.test(raw))return true;
  if(/^[a-z]+(?:[A-Z][A-Za-z0-9]*)+$/u.test(raw))return true;
  if(/^(?:flow|instruction|action|content|result|request|session)-/u.test(raw))return true;
  return false;
}
function extractStrings(text){
  const out=[];
  for(const m of text.matchAll(/(["'])(?:(?=(\\?))\2.)*?\1/gsu)){
    const raw=m[0].slice(1,-1);
    if(!raw||technicalLiteral(raw))continue;
    const normalized=normalize(raw);
    if(normalized)out.push({raw,normalized,tokens:words(raw).length,index:m.index});
  }
  return out;
}
function overlap(lit,c){
  const u=normalize(c.utterance),ut=words(c.utterance);
  const exact=u===lit.normalized;
  const contained=u.includes(lit.normalized);
  const reverse=lit.normalized.includes(u);
  return {
    exact,contained,reverse,
    coverage:contained?lit.tokens/Math.max(1,ut.length):0,
    reverseCoverage:reverse?ut.length/Math.max(1,lit.tokens):0
  };
}

if(/\bI0-(?:DEV|CAL)-\d{4}\b/u.test(source))errors.push("executor contains corpus case ID");
if(/\b(?:caseOverrides|exceptionsById|utteranceOverrides|specialCasesById|perCaseRules|phraseMap|utteranceMap|byUtterance|exactPhrases|redactionOverrides)\b/u.test(source)){
  errors.push("executor contains case/redaction exception-table marker");
}

const literals=extractStrings(source);
const matchedIndexes={development:new Set(),consumed_regression:new Set()};
const phraseHits=[];

// Complete phrases of any length, short phrases and high-coverage fragments.
for(const lit of literals){
  const exempt=approved.has(lit.normalized);
  for(const dataset of datasets){
    dataset.cases.forEach((c,index)=>{
      const o=overlap(lit,c);
      if(!o.exact&&!o.contained&&!o.reverse)return;
      const fullPhrase=o.exact;
      const shortCoverage=lit.tokens>=2&&lit.tokens<=3&&o.coverage>=0.50;
      const longCoverage=lit.tokens>=4&&o.coverage>=0.45;
      const reverseCoverage=o.reverseCoverage>=0.80;
      if((fullPhrase||shortCoverage||longCoverage||reverseCoverage)&&!exempt){
        phraseHits.push({dataset:dataset.name,id:c.id,index,literal:lit.raw,exact:o.exact,coverage:o.coverage,reverse_coverage:o.reverseCoverage});
        matchedIndexes[dataset.name].add(index);
      }
    });
  }
}
if(phraseHits.length)errors.push("case-shaped literal/fragment matches: "+JSON.stringify(phraseHits.slice(0,20)));

// Consecutive-family clusters.
for(const dataset of datasets){
  const indexes=[...matchedIndexes[dataset.name]].sort((a,b)=>a-b);
  let run=[];
  const flush=()=>{
    if(run.length>=3)errors.push("consecutive corpus-family literal cluster in "+dataset.name+": "+run.join(","));
    run=[];
  };
  for(const idx of indexes){
    if(!run.length||idx===run.at(-1)+1)run.push(idx);
    else{flush();run=[idx];}
  }
  flush();
}

// Phrase-table heuristic: multiple non-approved multiword redactions in a single array.
for(const m of source.matchAll(/\[(?:[^\[\]]|\\.){0,1400}\]/gsu)){
  const arr=extractStrings(m[0]).filter(x=>x.tokens>=2&&!approved.has(x.normalized));
  if(arr.length<3)continue;
  const hits=arr.filter(lit=>datasets.some(ds=>ds.cases.some(c=>{
    const o=overlap(lit,c);
    return o.exact||o.coverage>=0.40||o.reverseCoverage>=0.75;
  })));
  if(hits.length>=2){
    errors.push("phrase table resembles corpus redactions at source index "+m.index+": "+JSON.stringify(hits.map(x=>x.raw)));
  }
}

// Regexes must not encode long near-verbatim corpus phrases.
const regexHits=[];
for(const m of source.matchAll(/\/((?:\\.|[^\/\n])+)\/[dgimsuvy]*/gu)){
  const body=m[1];
  const fragments=body.split("|")
    .map(x=>normalize(x.replace(/\\[bBsSwWdD]/g," ").replace(/\(\?:/g," ").replace(/\[[^\]]*\]/g," ").replace(/\{[^}]*\}/g," ")))
    .filter(Boolean);
  for(const fragment of fragments){
    const ft=words(fragment).length;
    if(ft<4||approved.has(fragment))continue;
    for(const dataset of datasets)for(const c of dataset.cases){
      const u=normalize(c.utterance),ut=words(c.utterance);
      if(u.includes(fragment)&&ft/Math.max(1,ut.length)>=0.75){
        regexHits.push({dataset:dataset.name,id:c.id,fragment,coverage:ft/ut.length,index:m.index});
      }
    }
  }
}
if(regexHits.length)errors.push("regex contains near-verbatim corpus fragments: "+JSON.stringify(regexHits.slice(0,20)));

console.log(JSON.stringify({
  status:errors.length?"FAIL":"PASS",
  version:"I0_V3_R2_ANTI_HARDCODE_V1",
  executor:"tools/sabik-i0-executor-v3-r2.mjs",
  development_cases:400,
  consumed_regression_cases:200,
  audit_case_shaped_forbidden:audit.CASE_SHAPED_FORBIDDEN,
  natural_literals_checked:literals.length,
  exact_short_fragment_hits:phraseHits.length,
  regex_case_hits:regexHits.length,
  errors
},null,2));
if(errors.length)process.exit(1);

