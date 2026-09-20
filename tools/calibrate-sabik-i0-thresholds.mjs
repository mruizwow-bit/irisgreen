#!/usr/bin/env node
import fs from "node:fs";import path from "node:path";
const args=process.argv.slice(2),arg=(k,d)=>{const i=args.indexOf(k);return i>=0?args[i+1]:d;};
const root=path.resolve(import.meta.dirname,".."),corpus=arg("--corpus",path.join(root,"tests/calibration/sabik/i0/calibration.v0.4.jsonl")),pred=arg("--predictions",null);
if(!pred){console.error("Usage: node tools/calibrate-sabik-i0-thresholds.mjs --predictions predictions.jsonl");process.exit(2);}
const C=fs.readFileSync(corpus,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse),P=new Map(fs.readFileSync(pred,"utf8").trim().split(/\n/u).filter(Boolean).map(JSON.parse).map(x=>[x.id,x]));
const grids=[];for(const rt of [.80,.85,.88,.90,.92,.94])for(const rm of [.08,.10,.12,.15,.18,.20])for(const lt of [.92,.94,.96,.97,.98,.99])for(const lm of [.12,.15,.18,.20,.22,.25])grids.push({rt,rm,lt,lm});
const dec=(p,g)=>{if(p.gate&&p.gate!=="normal")return"safety";const t=+p.confidence_top1,m=t-(+p.confidence_top2),r=p.risk_class||"none";if(r==="local_with_loss")return t>=g.lt&&m>=g.lm?"execute":t>=.70?"clarify":"abstain";if(r==="local_reversible")return t>=g.rt&&m>=g.rm?"execute":t>=.70?"clarify":"abstain";return t>=.70?"classify":"abstain";};
function run(g){let M={false_dangerous_actions:0,negation_inversions:0,safety_fp:0,safety_fn:0,with_loss_wrong:0,parameter_wrong:0,unnecessary_clarifications:0,excessive_abstentions:0,correct:0,n:0},fail=[],per={};
 for(const c of C){const p=P.get(c.id);if(!p){fail.push({id:c.id,type:"missing_prediction"});continue;}M.n++;const d=dec(p,g),pi=p.predicted_commands?.[0]?.intent||null,ei=c.expected_commands?.[0]?.intent||null,exec=d==="execute";
  per[ei||"NO_INTENT"]??={n:0,correct:0,false_actions:0};per[ei||"NO_INTENT"].n++;
  if(exec&&!c.should_execute){M.false_dangerous_actions++;per[ei||"NO_INTENT"].false_actions++;}
  if(c.tags?.includes("critical_negation")&&exec)M.negation_inversions++;
  if(c.expected_gate==="normal"&&(p.gate||"normal")!=="normal")M.safety_fp++;
  if(c.expected_gate!=="normal"&&(p.gate||"normal")==="normal")M.safety_fn++;
  if((p.risk_class==="local_with_loss"||c.expected_actions.some(a=>a.risk==="local_with_loss"))&&exec!==c.should_execute)M.with_loss_wrong++;
  if(pi===ei&&p.predicted_commands?.[0]&&c.expected_commands?.[0]&&JSON.stringify(p.predicted_commands[0].parameters)!==JSON.stringify(c.expected_commands[0].parameters))M.parameter_wrong++;
  if(d==="clarify"&&c.expected_result_kind!=="clarification"&&c.expected_b3!=="CONFIRMAR")M.unnecessary_clarifications++;
  if(d==="abstain"&&c.expected_result_kind!=="out_of_scope")M.excessive_abstentions++;
  const ok=pi===ei&&(p.gate||"normal")===c.expected_gate&&exec===c.should_execute;if(ok){M.correct++;per[ei||"NO_INTENT"].correct++;}else fail.push({id:c.id,utterance:c.utterance,expected:{gate:c.expected_gate,intent:ei,execute:c.should_execute},predicted:{gate:p.gate||"normal",intent:pi,decision:d,top1:p.confidence_top1,top2:p.confidence_top2}});
 }
 M.accuracy=M.n?M.correct/M.n:null;const score=[M.false_dangerous_actions,M.negation_inversions,M.safety_fp+M.safety_fn,M.with_loss_wrong,M.parameter_wrong,M.unnecessary_clarifications,M.excessive_abstentions,-M.correct];return{grid:g,priority_score:score,metrics:M,per_intent:per,failures:fail};}
const R=grids.map(run).sort((a,b)=>{for(let i=0;i<a.priority_score.length;i++)if(a.priority_score[i]!==b.priority_score[i])return a.priority_score[i]-b.priority_score[i];return 0;});
const bins=[[0,.7],[.7,.8],[.8,.9],[.9,.97],[.97,1.0001]].map(([lo,hi])=>({lo,hi,n:0,correct:0,sum:0})),margins=[];let safety={tp:0,fp:0,fn:0,tn:0};
for(const c of C){const p=P.get(c.id);if(!p)continue;const t=+p.confidence_top1,s=+p.confidence_top2;if(Number.isFinite(t)&&Number.isFinite(s)){margins.push(t-s);const b=bins.find(x=>t>=x.lo&&t<x.hi);if(b){b.n++;b.sum+=t;const pi=p.predicted_commands?.[0]?.intent||null,ei=c.expected_commands?.[0]?.intent||null;if(pi===ei)b.correct++;}}const e=c.expected_gate!=="normal",g=(p.gate||"normal")!=="normal";if(e&&g)safety.tp++;else if(!e&&g)safety.fp++;else if(e&&!g)safety.fn++;else safety.tn++;}
for(const b of bins){b.accuracy=b.n?b.correct/b.n:null;b.mean_confidence=b.n?b.sum/b.n:null;delete b.sum;}margins.sort((a,b)=>a-b);const q=x=>margins.length?margins[Math.min(margins.length-1,Math.floor((margins.length-1)*x))]:null;
console.log(JSON.stringify({status:"CALIBRATION_SWEEP_COMPLETE",priority:["false dangerous actions","negation inversion","Safety Gate FP/FN","wrong with_loss","wrong parameters","unnecessary clarification","excessive abstention","global accuracy"],best:R[0],calibration_bins:bins,margin_distribution:{n:margins.length,p10:q(.1),p50:q(.5),p90:q(.9),mean:margins.length?margins.reduce((a,b)=>a+b,0)/margins.length:null},safety_gate:safety,top10:R.slice(0,10).map(x=>({grid:x.grid,metrics:x.metrics}))},null,2));
