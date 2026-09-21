import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,"../../..");
const load=rel=>JSON.parse(fs.readFileSync(path.join(repo,rel),"utf8"));
const manifest=load("tests/specs/sabik/s3-s4-qa0-manifest.json");
const matrices=manifest.matrices.map(load);
const fixtureDocs=manifest.fixtures.map(load);
const fixtures=new Map(fixtureDocs.flatMap(d=>d.fixtures).map(f=>[f.id,f]));
const args=process.argv.slice(2);
const value=flag=>{const i=args.indexOf(flag);return i>=0?args[i+1]:null;};
const phase=value("--phase")||"all";
const adapterPath=value("--adapter");
const evidencePath=value("--manual-evidence");
const selected=matrices.filter(m=>phase==="all"||m.phase===phase);
if(!selected.length)throw new Error("Fase desconocida: "+phase);
let adapter=null;if(adapterPath)adapter=await import(pathToFileURL(path.resolve(adapterPath)).href);
let manualEvidence={rows:{}};if(evidencePath)manualEvidence=JSON.parse(fs.readFileSync(path.resolve(evidencePath),"utf8"));
function subset(expected,actual,at="$root"){
  if(expected===null||typeof expected!=="object")return Object.is(expected,actual)?[]:[`${at}: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`];
  if(Array.isArray(expected)){if(!Array.isArray(actual))return[`${at}: expected array`];if(expected.length!==actual.length)return[`${at}: expected array length ${expected.length} got ${actual.length}`];return expected.flatMap((v,i)=>subset(v,actual[i],`${at}[${i}]`));}
  if(!actual||typeof actual!=="object")return[`${at}: expected object`];
  return Object.entries(expected).flatMap(([k,v])=>subset(v,actual[k],`${at}.${k}`));
}
const result={automatic:{pass:0,fail:0,pending:0},manual:{pass:0,fail:0,pending:0},informational:0,failures:[]};
for(const matrix of selected){
  for(const row of matrix.rows){
    if(row.gate==="INFORMATIONAL"){result.informational++;console.log(`INFO ${row.id} ${row.requirement}`);continue;}
    if(row.gate==="MANUAL_BLOCKING"){const status=manualEvidence.rows?.[row.id]||"PENDIENTE_EVIDENCIA_REAL";if(status==="PASS_REAL")result.manual.pass++;else if(status==="FAIL_REAL"){result.manual.fail++;result.failures.push({id:row.id,type:"MANUAL_BLOCKING"});}else result.manual.pending++;console.log(`MANUAL ${row.id} ${status}`);continue;}
    if(!adapter){result.automatic.pending++;console.log(`AUTOMATIC ${row.id} CONTRACT_READY_NO_RUNTIME`);continue;}
    const fn=matrix.phase==="S3"?adapter.evaluateS3:adapter.evaluateS4;
    if(typeof fn!=="function")throw new Error(`Adapter no exporta evaluate${matrix.phase}`);
    let rowFailed=false;
    for(const fid of row.fixture_ids){const fixture=fixtures.get(fid);try{const observation=await fn(structuredClone(fixture));const mismatches=subset(fixture.expected,observation);if(mismatches.length){rowFailed=true;result.failures.push({id:row.id,fixture:fid,type:"AUTOMATIC_BLOCKING",mismatches});}}catch(error){rowFailed=true;result.failures.push({id:row.id,fixture:fid,type:"AUTOMATIC_BLOCKING",error:String(error?.stack||error)});}}
    if(rowFailed)result.automatic.fail++;else result.automatic.pass++;
    console.log(`AUTOMATIC ${row.id} ${rowFailed?"FAIL":"PASS"}`);
  }
}
console.log(JSON.stringify(result,null,2));
if(!adapter)console.log("NO_RUNTIME_EXECUTED: contrato, fixtures y clasificación de puertas listos.");
if(result.manual.pending)console.log(`MANUAL_BLOCKING_PENDING: ${result.manual.pending}`);
if(result.informational)console.log(`INFORMATIONAL_REPORTED: ${result.informational}`);
if(result.automatic.fail||result.manual.fail)process.exitCode=1;
