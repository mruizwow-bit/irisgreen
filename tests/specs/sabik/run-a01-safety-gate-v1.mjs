import fs from "node:fs";
import path from "node:path";
import {pathToFileURL,fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../../..");
const args=process.argv.slice(2);
const value=f=>{const i=args.indexOf(f);return i>=0?args[i+1]:null};
const adapterPath=value("--adapter");
if(!adapterPath){console.error("usage: node run-a01-safety-gate-v1.mjs --adapter /path/adapter.mjs");process.exit(2);}
const spec=JSON.parse(fs.readFileSync(path.join(root,"tests/specs/sabik/a01-safety-gate-v1.json"),"utf8"));
const fx=JSON.parse(fs.readFileSync(path.join(root,spec.fixture),"utf8"));
const adapter=await import(pathToFileURL(path.resolve(adapterPath)).href);
if(typeof adapter.runA01Scenario!=="function")throw new Error("adapter must export runA01Scenario");
function matchObj(exp,got,at="$"){
  const errs=[];
  for(const [k,v] of Object.entries(exp)){
    if(k==="protection_any_of"||k==="classification_any_of"||k==="subject_any_of"||k==="outcome_any_of"||k==="normal_response_allowed_any_of"){
      const realKey=k.replace("_any_of","");
      if(!v.includes(got?.[realKey]))errs.push(`${at}.${realKey}: ${JSON.stringify(got?.[realKey])} not in ${JSON.stringify(v)}`);
    } else if(k==="protection_not"||k==="classification_not"){
      const realKey=k.replace("_not","");
      if(Object.is(got?.[realKey],v))errs.push(`${at}.${realKey}: must not equal ${JSON.stringify(v)}`);
    } else if(k==="expect_one_of"){
      // handled by caller
    } else if(got?.[k]!==v) errs.push(`${at}.${k}: expected ${JSON.stringify(v)} got ${JSON.stringify(got?.[k])}`);
  }
  return errs;
}
let pass=0,fail=0;const failures=[];
for(const s of fx.scenarios){
  const result=await adapter.runA01Scenario(structuredClone(s));
  if(!result||!Array.isArray(result.steps)){fail++;failures.push({id:s.id,error:"adapter result missing steps"});continue;}
  let errs=[];
  for(let i=0;i<s.steps.length;i++){
    const expected=s.steps[i];
    const got=result.steps[i]||{};
    if(expected.expect_one_of){
      const variants=expected.expect_one_of.map(v=>matchObj(v,got,`${s.id}.steps[${i}]`));
      if(!variants.some(v=>v.length===0))errs.push(...variants[0]);
    }else errs.push(...matchObj(expected.expect||{},got,`${s.id}.steps[${i}]`));
  }
  if(errs.length){fail++;failures.push({id:s.id,errors:errs,observed:result.steps});console.log("FAIL",s.id);}
  else{pass++;console.log("PASS",s.id);}
}
console.log(JSON.stringify({gate:"A01",pass,fail,total:fx.scenarios.length,failures},null,2));
if(fail)process.exit(1);
console.log("A01_INDEPENDENT_CASES_PASS");
