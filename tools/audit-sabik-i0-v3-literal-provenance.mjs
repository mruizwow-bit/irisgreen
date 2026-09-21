#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"..");
const args=process.argv.slice(2);
const arg=(name,fallback)=>{const i=args.indexOf(name);return i>=0?args[i+1]:fallback;};
const executorPath=path.resolve(arg("--executor",path.join(root,"tools/sabik-i0-executor-v3.mjs")));
const developmentPath=path.resolve(arg("--development",path.join(root,"tests/development/sabik/i0/development.v0.4.jsonl")));
const regressionPath=path.resolve(arg("--regression",path.join(root,"tests/calibration/sabik/i0/calibration.v0.4.jsonl")));
const contractPath=path.resolve(arg("--contract",path.join(root,"docs/sabik-next/I0_CONTRACTS_V0_4.md")));
const outputPath=path.resolve(arg("--output",path.join(root,"docs/sabik-next/I0_V3_LITERAL_PROVENANCE_AUDIT.json")));

const normalize=s=>String(s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase()
  .replace(/[^\p{L}\p{N}\s]/gu," ").replace(/\s+/g," ").trim();
const words=s=>normalize(s).split(/\s+/u).filter(Boolean);
const readJsonl=p=>fs.readFileSync(p,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse);
const sourceText=fs.readFileSync(executorPath,"utf8");
const contractText=normalize(fs.readFileSync(contractPath,"utf8"));
const datasets=[
  {name:"development",cases:readJsonl(developmentPath)},
  {name:"consumed_regression",cases:readJsonl(regressionPath)}
];

const GENERAL_PRODUCT_LEXICON=new Set([
  "vista completa","vista sencilla","vista simple","interfaz completa","interfaz sencilla",
  "presentacion sencilla","pantalla despejada","modo simple","elementos secundarios","carga visual",
  "informacion secundaria","informacion adicional","informacion ampliada","bloque complementario","lo secundario",
  "movimiento normal","animaciones habituales","movimiento estandar","nivel habitual","cantidad normal",
  "tamano base","nivel estandar","escala normal","extra grande","sin movimiento",
  "paso a paso","modo paso","recorrido por pasos","una instruccion cada vez","de uno en uno"
]);

function technicalLiteral(raw){
  if(!/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/u.test(raw))return true;
  if(raw.includes("_")||raw.includes("/")||raw.includes(".mjs")||raw.includes(".json")||raw.includes("sha256"))return true;
  if(/^[A-Z0-9_:-]+$/u.test(raw))return true;
  if(/^[a-z]+(?:[A-Z][A-Za-z0-9]*)+$/u.test(raw))return true;
  if(/^(?:flow|instruction|action|content|result|request|session)-/u.test(raw))return true;
  return false;
}

function extractStrings(text){
  const out=[];
  const re=/(["'])(?:(?=(\\?))\2.)*?\1/gsu;
  for(const m of text.matchAll(re)){
    const raw=m[0].slice(1,-1);
    if(!raw||technicalLiteral(raw))continue;
    const normalized=normalize(raw);
    if(!normalized)continue;
    out.push({raw,normalized,tokens:words(raw).length,index:m.index});
  }
  return out;
}

function overlap(literal,c){
  const u=normalize(c.utterance),ut=words(c.utterance);
  const exact=u===literal.normalized;
  const contained=u.includes(literal.normalized);
  const reverse=literal.normalized.includes(u);
  const coverage=contained?literal.tokens/Math.max(1,ut.length):0;
  const reverseCoverage=reverse?ut.length/Math.max(1,literal.tokens):0;
  return {exact,contained,reverse,coverage,reverseCoverage};
}

function contractTerm(normalized){
  if(!normalized)return false;
  if(words(normalized).length===1)return new RegExp("(?:^| )"+normalized.replace(/[.*+?^\x24{}()|[\]\\]/g,"\\$&")+"(?: |$)","u").test(contractText);
  return contractText.includes(normalized);
}

function approvedClass(literal){
  if(contractTerm(literal.normalized))return "CONTRACT_TERM";
  if(GENERAL_PRODUCT_LEXICON.has(literal.normalized))return "GENERAL_PRODUCT_LEXICON";
  return null;
}

const literals=extractStrings(sourceText);
const entries=[];
const forbidden=[];
const hitByDataset={development:new Set(),consumed_regression:new Set()};

for(const literal of literals){
  let max=null;
  for(const dataset of datasets){
    dataset.cases.forEach((c,index)=>{
      const o=overlap(literal,c);
      if(!(o.exact||o.contained||o.reverse))return;
      const record={dataset:dataset.name,id:c.id,index,coverage:o.coverage,reverse_coverage:o.reverseCoverage,exact:o.exact};
      if(!max||Math.max(o.coverage,o.reverseCoverage)>Math.max(max.coverage,max.reverse_coverage))max=record;
    });
  }
  const approved=approvedClass(literal);
  const suspicious=Boolean(max)&&(
    max.exact||
    (literal.tokens<=3&&literal.tokens>=2&&max.coverage>=0.50)||
    (literal.tokens>=4&&max.coverage>=0.45)||
    max.reverse_coverage>=0.80
  );
  const classification=approved||(suspicious?"CASE_SHAPED_FORBIDDEN":"GENERAL_LANGUAGE_RULE");
  const entry={
    literal:literal.raw,
    normalized:literal.normalized,
    tokens:literal.tokens,
    classification,
    reason:approved==="CONTRACT_TERM"?"present_in_normative_contract":
      approved==="GENERAL_PRODUCT_LEXICON"?"documented_general_product_lexicon":
      suspicious?"corpus_overlap_exceeds_case_shape_threshold":"general_grammar_or_parser_lexeme",
    max_corpus_overlap:max
  };
  entries.push(entry);
  if(classification==="CASE_SHAPED_FORBIDDEN"){
    forbidden.push(entry);
    if(max)hitByDataset[max.dataset].add(max.index);
  }
}

// Consecutive-family clusters: three or more consecutive cases hit by unapproved literals.
const clusters=[];
for(const dataset of datasets){
  const indexes=[...hitByDataset[dataset.name]].sort((a,b)=>a-b);
  let run=[];
  for(const idx of indexes){
    if(!run.length||idx===run.at(-1)+1)run.push(idx);
    else{if(run.length>=3)clusters.push({dataset:dataset.name,indexes:[...run]});run=[idx];}
  }
  if(run.length>=3)clusters.push({dataset:dataset.name,indexes:[...run]});
}

// Phrase-table heuristic: arrays containing >=3 multiword unapproved strings with >=2 corpus-overlap hits.
const phraseTables=[];
for(const m of sourceText.matchAll(/\[(?:[^\[\]]|\\.){0,1200}\]/gsu)){
  const arr=extractStrings(m[0]).filter(x=>x.tokens>=2&&!approvedClass(x));
  if(arr.length<3)continue;
  let matched=0;
  for(const lit of arr){
    if(datasets.some(ds=>ds.cases.some(c=>{
      const o=overlap(lit,c);return o.exact||o.coverage>=0.45||o.reverseCoverage>=0.8;
    })))matched++;
  }
  if(matched>=2)phraseTables.push({source_index:m.index,phrase_literals:arr.map(x=>x.raw),matched_literals:matched});
}

// Regex fragments: fail only on long near-verbatim natural-language sequences.
const regexCaseMatches=[];
for(const m of sourceText.matchAll(/\/((?:\\.|[^\/\n])+)\/[dgimsuvy]*/gu)){
  const body=m[1];
  const fragments=body.split("|").map(x=>normalize(x.replace(/\\[bBsSwWdD]/g," ").replace(/\(\?:/g," ").replace(/\[[^\]]*\]/g," ").replace(/\{[^}]*\}/g," "))).filter(Boolean);
  for(const fragment of fragments){
    const ft=words(fragment).length;
    if(ft<4)continue;
    for(const ds of datasets)for(const c of ds.cases){
      const u=normalize(c.utterance),ut=words(c.utterance);
      if(u.includes(fragment)&&ft/Math.max(1,ut.length)>=0.75&&!contractTerm(fragment)&&!GENERAL_PRODUCT_LEXICON.has(fragment)){
        regexCaseMatches.push({dataset:ds.name,id:c.id,fragment,coverage:ft/ut.length,source_index:m.index});
      }
    }
  }
}

for(const cluster of clusters)forbidden.push({classification:"CASE_SHAPED_FORBIDDEN",reason:"consecutive_case_family_cluster",...cluster});
for(const table of phraseTables)forbidden.push({classification:"CASE_SHAPED_FORBIDDEN",reason:"phrase_table_matching_corpus",...table});
for(const match of regexCaseMatches)forbidden.push({classification:"CASE_SHAPED_FORBIDDEN",reason:"regex_near_verbatim_corpus_fragment",...match});

const counts={CONTRACT_TERM:0,GENERAL_PRODUCT_LEXICON:0,GENERAL_LANGUAGE_RULE:0,CASE_SHAPED_FORBIDDEN:forbidden.length};
for(const e of entries)if(e.classification!=="CASE_SHAPED_FORBIDDEN")counts[e.classification]++;

const audit={
  version:"I0_V3_LITERAL_PROVENANCE_AUDIT_V1",
  scope:"Natural-language string literals and long regex fragments participating in executor parsing. Technical identifiers, paths and diagnostic reason codes are excluded.",
  inputs:{
    executor:path.relative(root,executorPath),
    development:path.relative(root,developmentPath),
    consumed_regression:path.relative(root,regressionPath),
    contract:path.relative(root,contractPath)
  },
  classifications:["CONTRACT_TERM","GENERAL_PRODUCT_LEXICON","GENERAL_LANGUAGE_RULE","CASE_SHAPED_FORBIDDEN"],
  general_product_lexicon:[...GENERAL_PRODUCT_LEXICON].sort(),
  counts,
  CASE_SHAPED_FORBIDDEN:forbidden.length,
  consecutive_clusters:clusters,
  phrase_tables:phraseTables,
  regex_case_matches:regexCaseMatches,
  entries:entries.sort((a,b)=>a.classification.localeCompare(b.classification)||a.normalized.localeCompare(b.normalized))
};

fs.mkdirSync(path.dirname(outputPath),{recursive:true});
fs.writeFileSync(outputPath,JSON.stringify(audit,null,2)+"\n");
console.log(JSON.stringify({status:forbidden.length?"FAIL":"PASS",output:path.relative(root,outputPath),counts,clusters:clusters.length,phrase_tables:phraseTables.length,regex_case_matches:regexCaseMatches.length},null,2));
if(forbidden.length)process.exit(1);

