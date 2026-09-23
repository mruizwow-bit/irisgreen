import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const project=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const hash=async p=>createHash("sha256").update(await readFile(resolve(project,p))).digest("hex");
const buildHashes=JSON.parse(await readFile(resolve(project,"evidence/BUILD_OUTPUT_HASHES.json"),"utf8"));
const gate=JSON.parse(await readFile(resolve(project,"evidence/PREDEPLOY_GATE.json"),"utf8"));
const lockSha=await hash("package-lock.json");
const functionSha=await hash("netlify/functions/n04-storage-readback.mjs");
let gitHead="UNAVAILABLE";
try { gitHead=execFileSync("git",["rev-parse","HEAD"],{cwd:project,encoding:"utf8"}).trim(); } catch {}
const provenance={
 schema:"SABIK_N04_R26_PROVENANCE_PREDEPLOY/1.0",
 status:"PRE_DEPLOY_COMPLETE_LIVE_BINDING_PENDING",
 source:{
   candidate_git_head:gitHead,
   corpus_git_blob:"0e297c977ce3b688186ca917981458adfd5e5ca3",
   corpus_sha256:"56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e",
   corpus_version:"n04-es-20260916-56f72c4d3959",
   generator_git_blob:"fbdd6cd39374b12863352c010b1e9975d95bd963"
 },
 dependency_lock:{sha256:lockSha,blobs:"11.1.0",netlify_cli:"27.8.0",node:"22.16.0",npm:"10.9.2"},
 build:{aggregate_sha256:buildHashes.aggregate_sha256,entries:buildHashes.entries},
 planned_function:{source_sha256:functionSha,netlify_live_digest:"PENDING_DEPLOY"},
 corpus:{version:"n04-es-20260916-56f72c4d3959",sha256:"56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e",fragments:4332,unique_ids:4332},
 target:{project:"sabik-asistente",site_id:"47b06e68-ff54-4097-8ad8-336b2d71758a",context:"private staging only"},
 mapping:{file_upload_prefix:"sabik-n04-corpus",runtime_named_store:"sabik-n04-corpus",live_equivalence:"PENDING_AUTHORIZED_DEPLOY_SMOKE"},
 gate,
 api_activation:false,
 production:false
};
await writeFile(resolve(project,"PROVENANCE_PREDEPLOY.json"),JSON.stringify(provenance,null,2)+"\n");
console.log(JSON.stringify(provenance,null,2));
