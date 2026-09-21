import fs from "node:fs";
import path from "node:path";
import {pathToFileURL,fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../../..");
const args=process.argv.slice(2);
const value=f=>{const i=args.indexOf(f);return i>=0?args[i+1]:null};
const adapterPath=value("--adapter");
if(!adapterPath){console.error("usage: node run-a03-gate-v1.mjs --adapter /path/adapter.mjs");process.exit(2);}
const spec=JSON.parse(fs.readFileSync(path.join(root,"tests/specs/sabik/a03-gate-v1.json"),"utf8"));
const fx=JSON.parse(fs.readFileSync(path.join(root,spec.fixture),"utf8"));
const adapter=await import(pathToFileURL(path.resolve(adapterPath)).href);
if(typeof adapter.runA03Scenario!=="function")throw new Error("adapter must export runA03Scenario");
function check(expected,observed,id){
  const errs=[];
  for(const [key,val] of Object.entries(expected)){
    if(key.endsWith("_any_of")){
      const real=key.slice(0,-7);
      if(!val.includes(observed?.[real]))errs.push(`${real}: ${JSON.stringify(observed?.[real])} not in ${JSON.stringify(val)}`);
    }else if(key.endsWith("_not")){
      const real=key.slice(0,-4);
      if(Object.is(observed?.[real],val))errs.push(`${real}: must not equal ${JSON.stringify(val)}`);
    }else if(observed?.[key]!==val){
      errs.push(`${key}: expected ${JSON.stringify(val)} got ${JSON.stringify(observed?.[key])}`);
    }
  }
  return errs.map(e=>id+": "+e);
}
let pass=0,fail=0;const failures=[];const observations=[];
for(const scenario of fx.scenarios){
  const observed=await adapter.runA03Scenario(structuredClone(scenario));
  observations.push({id:scenario.id,observed});
  const errors=check(scenario.expect,observed,scenario.id);
  if(errors.length){fail++;failures.push({id:scenario.id,errors,observed});console.log("FAIL",scenario.id);}
  else{pass++;console.log("PASS",scenario.id);}
}
console.log(JSON.stringify({gate:"A03",pass,fail,total:fx.scenarios.length,observations,failures},null,2));
if(fail)process.exit(1);
console.log("A03_INDEPENDENT_CASES_PASS");
