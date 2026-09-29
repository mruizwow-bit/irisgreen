import { readFile, writeFile } from 'node:fs/promises';
import { gitPathExists, routeToRepoPath } from '../src/r04/source-reader.mjs';

const out=new URL('../build/r04/',import.meta.url);
const corpus=JSON.parse(await readFile(new URL('r04-partial-corpus.json',out),'utf8'));
const registry=JSON.parse(await readFile(new URL('../library-source-registry.json',import.meta.url),'utf8'));
const sourceSha=registry.canonical_source.source_sha;

const checked=[];
const missing=[];
const invalid=[];
for(const e of corpus.entities){
  if(e.active===false||e.retrieval_eligible===false) continue;
  const raw=e.canonical_url||e.url||'';
  let url;
  try{ url=new URL(raw); }catch{ invalid.push({entity_id:e.entity_id,url:raw}); continue; }
  if(url.origin!=='https://irisgreen.eu'){
    invalid.push({entity_id:e.entity_id,url:raw,reason:'unexpected_origin'}); continue;
  }
  const path=routeToRepoPath(url.pathname+(url.hash||''));
  const exists=gitPathExists(sourceSha,path);
  checked.push({entity_id:e.entity_id,path,exists});
  if(!exists) missing.push({entity_id:e.entity_id,content_id:e.content_id,locale:e.locale,url:raw,path,source_type:e.source_type,route_status:e.route_status||null});
}
const report={
  schema:'R51_A9_R04_CITATION_ROUTE_AUDIT/1.0',
  source_sha:sourceSha,
  active_entities:corpus.active_entity_count,
  checked:checked.length,
  invalid_urls:invalid.length,
  missing_routes:missing.length,
  invalid,
  missing,
  status:invalid.length||missing.length?'FAIL':'PASS'
};
await writeFile(new URL('r04-citation-route-audit.json',out),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.status!=='PASS') process.exitCode=1;
