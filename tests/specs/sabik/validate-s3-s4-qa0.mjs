import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,"../../..");
const load=rel=>JSON.parse(fs.readFileSync(path.join(repo,rel),"utf8"));
const manifest=load("tests/specs/sabik/s3-s4-qa0-manifest.json");
const gates=load(manifest.gates_file);
const matrices=manifest.matrices.map(load);
const fixtureDocs=manifest.fixtures.map(load);
const errors=[];
const allowedGates=new Set(gates.gates.map(g=>g.id));
const fixtureMap=new Map();
for(const doc of fixtureDocs){
  if(doc.origin!=="QA0_SYNTHETIC_INDEPENDENT_NO_I0"||doc.i0_dependency!==false) errors.push(`${doc.phase}: fixtures no declaran independencia de I0`);
  for(const f of doc.fixtures){if(fixtureMap.has(f.id))errors.push(`fixture duplicado ${f.id}`);fixtureMap.set(f.id,f);}
}
const rowIds=new Set();
for(const matrix of matrices){
  if(matrix.base_sha!==manifest.base_sha)errors.push(`${matrix.phase}: base_sha distinto`);
  const coverage=new Set();
  for(const row of matrix.rows){
    if(rowIds.has(row.id))errors.push(`row duplicada ${row.id}`);rowIds.add(row.id);
    if(!allowedGates.has(row.gate))errors.push(`${row.id}: gate desconocido ${row.gate}`);
    for(const tag of row.coverage||[])coverage.add(tag);
    for(const fid of row.fixture_ids||[])if(!fixtureMap.has(fid))errors.push(`${row.id}: fixture inexistente ${fid}`);
    if(row.gate==="AUTOMATIC_BLOCKING"){
      if(!row.fixture_ids?.length)errors.push(`${row.id}: automatic sin fixtures`);
      for(const fid of row.fixture_ids||[]){const f=fixtureMap.get(fid);if(!f||!f.expected||typeof f.expected!=="object"||Array.isArray(f.expected))errors.push(`${row.id}: fixture ${fid} sin expected automático`);}
      if(row.manual_checklist)errors.push(`${row.id}: automatic no debe contener manual_checklist`);
    }
    if(row.gate==="MANUAL_BLOCKING"){
      if(!row.manual_checklist?.length)errors.push(`${row.id}: manual sin checklist`);
      if(row.fixture_ids?.length)errors.push(`${row.id}: manual no debe fingir fixture como evidencia humana`);
    }
    if(row.gate==="INFORMATIONAL"){
      for(const fid of row.fixture_ids||[]){const f=fixtureMap.get(fid);if(f?.expected)errors.push(`${row.id}: informational ${fid} no debe imponer expected binario`);}
    }
  }
  for(const required of manifest.required_coverage[matrix.phase]||[])if(!coverage.has(required))errors.push(`${matrix.phase}: falta cobertura ${required}`);
}
if(manifest.runtime_modified!==false)errors.push("manifest debe declarar runtime_modified=false");
if(manifest.i0_dependency!==false)errors.push("manifest debe declarar i0_dependency=false");
const counts={};
for(const matrix of matrices)counts[matrix.phase]=Object.fromEntries(["AUTOMATIC_BLOCKING","MANUAL_BLOCKING","INFORMATIONAL"].map(g=>[g,matrix.rows.filter(r=>r.gate===g).length]));
if(errors.length){console.error("S3_S4_QA0_CONTRACT_INVALID");errors.forEach(e=>console.error("- "+e));process.exit(1);}
console.log("S3_S4_QA0_CONTRACT_VALID");
console.log(JSON.stringify({base_sha:manifest.base_sha,counts,fixtures:fixtureMap.size,runtime_modified:false,i0_dependency:false},null,2));
