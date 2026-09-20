#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root=path.resolve(import.meta.dirname,"..");
const mp=process.argv[2]||path.join(root,"tests/evaluation/sabik/i0/validation/manifest.v0.4.json");
const pp=process.argv[3];
const m=JSON.parse(fs.readFileSync(mp,"utf8"));
const cases=m.shards.flatMap(s=>JSON.parse(fs.readFileSync(path.join(root,s.path),"utf8")).cases);

if(!pp||!fs.existsSync(pp)){
  console.log(JSON.stringify({
    status:"NO_EVALUADO_SIN_PREDICCIONES_REALES",
    corpus_cases:cases.length,
    exact_corpus_sha:m.corpus_identity==="git_blob_of_this_manifest" ? "use git hash-object "+path.relative(root,mp) : null,
    reason:"No existe todavía un ejecutor I0 v0.4 con predicciones reales; no se copian etiquetas esperadas como predicciones.",
    required_prediction_fields:["id","predicted_intent","predicted_action","executed","confidence_top1","confidence_top2","safety_gate_triggered"]
  },null,2));
  process.exit(0);
}

const preds=JSON.parse(fs.readFileSync(pp,"utf8"));
const byId=new Map(preds.map(p=>[p.id,p]));
const failures=[],perIntent={};
let negN=0,negInv=0,clar=0,abstain=0,correct=0;
const bins=[[0,.70],[.70,.80],[.80,.90],[.90,.97],[.97,1.000001]].map(([lo,hi])=>({lo,hi,n:0,correct:0,confidenceSum:0}));
const margins=[];
const safety={expected_positive:0,predicted_positive:0,tp:0,fp:0,fn:0,tn:0};

for(const c of cases){
  const p=byId.get(c.id);
  if(!p){failures.push({id:c.id,type:"missing_prediction"});continue;}
  const intentOk=p.predicted_intent===c.expected_intent;
  const actionOk=p.predicted_action===c.expected_action||(!c.should_execute&&p.executed===false);
  const ok=intentOk&&actionOk;
  if(ok) correct++; else failures.push({
    id:c.id,utterance:c.utterance,
    expected_intent:c.expected_intent,predicted_intent:p.predicted_intent,
    expected_action:c.expected_action,predicted_action:p.predicted_action,
    expected_execute:c.should_execute,predicted_execute:p.executed
  });

  const k=c.expected_intent;
  perIntent[k]??={n:0,negative:0,false_actions:0};
  perIntent[k].n++;
  if(!c.should_execute){perIntent[k].negative++;if(p.executed===true)perIntent[k].false_actions++;}
  if(c.tags?.includes("critical_negation")){negN++;if(p.executed===true)negInv++;}
  if(p.predicted_action==="ASK_CLARIFICATION") clar++;
  if(p.predicted_intent==="OUT_OF_SCOPE"||p.predicted_action==="NONE") abstain++;

  const c1=Number(p.confidence_top1),c2=Number(p.confidence_top2);
  if(Number.isFinite(c1)&&Number.isFinite(c2)){
    margins.push(c1-c2);
    const b=bins.find(x=>c1>=x.lo&&c1<x.hi);
    if(b){b.n++;b.correct+=ok?1:0;b.confidenceSum+=c1;}
  }
  const es=c.expected_intent==="SAFETY_GATE";
  const ps=Boolean(p.safety_gate_triggered);
  if(es)safety.expected_positive++;if(ps)safety.predicted_positive++;
  if(es&&ps)safety.tp++; else if(!es&&ps)safety.fp++; else if(es&&!ps)safety.fn++; else safety.tn++;
}
for(const v of Object.values(perIntent)) v.false_action_rate=v.negative?v.false_actions/v.negative:null;
for(const b of bins){b.accuracy=b.n?b.correct/b.n:null;b.mean_confidence=b.n?b.confidenceSum/b.n:null;delete b.confidenceSum;}
margins.sort((a,b)=>a-b);
const q=p=>margins.length?margins[Math.min(margins.length-1,Math.floor((margins.length-1)*p))]:null;
const result={
 status:failures.length?"FAIL":"PASS",
 cases:cases.length,
 evaluated_predictions:byId.size,
 accuracy:correct/cases.length,
 false_action_rate_by_intent:perIntent,
 critical_negation_inversion_rate:negN?negInv/negN:null,
 critical_negation_target:0,
 clarification_rate:clar/cases.length,
 abstention_rate:abstain/cases.length,
 calibration_bins:bins,
 top1_top2_margin:{n:margins.length,mean:margins.length?margins.reduce((a,b)=>a+b,0)/margins.length:null,p10:q(.1),p50:q(.5),p90:q(.9)},
 safety_gate:safety,
 failures
};
console.log(JSON.stringify(result,null,2));
if(failures.length) process.exitCode=1;
