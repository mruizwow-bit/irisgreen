import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { planIncrementalImpact } from '../src/r04/incremental-impact.mjs';

const root=fileURLToPath(new URL('../../../../',import.meta.url));
const registry=JSON.parse(await readFile(new URL('../library-source-registry.json',import.meta.url),'utf8'));
if(registry?.schema!=='R51_A9_LIBRARY_SOURCE_REGISTRY/1.0') throw new Error('invalid_source_registry');

const previous=String(process.env.R51_PREVIOUS_SOURCE_SHA||registry.canonical_source?.source_sha||'').trim();
const candidate=String(process.env.R51_SOURCE_SHA||'').trim();

function assertCommit(sha,label){
  if(!/^[a-f0-9]{40}$/.test(sha)) throw new Error('invalid_'+label+'_sha');
  try{
    execFileSync('git',['cat-file','-e',sha+'^{commit}'],{cwd:root,stdio:'ignore'});
  }catch{
    throw new Error(label+'_sha_not_found');
  }
}
assertCommit(previous,'previous_source');
assertCommit(candidate,'candidate_source');

const changedText=execFileSync('git',['diff','--name-only',previous+'..'+candidate],{
  cwd:root,encoding:'utf8',maxBuffer:8*1024*1024
});
const changedPaths=changedText.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
const impact=planIncrementalImpact(registry,changedPaths);

const plan={
  schema:'R51_A9_INCREMENTAL_UPDATE_PLAN/1.0',
  previous_source_sha:previous,
  candidate_source_sha:candidate,
  changed_path_count:changedPaths.length,
  changed_paths:changedPaths,
  impact,
  status:impact.status,
  rebuild_required:impact.rebuild_required,
  affected_domains:impact.affected_domains,
  candidate_build_required:impact.rebuild_required,
  create_library_version:impact.rebuild_required,
  production_activation:false
};

const out=new URL('../build/r04/',import.meta.url);
await mkdir(out,{recursive:true});
await writeFile(new URL('incremental-update-plan.json',out),JSON.stringify(plan,null,2)+'\n');
console.log(JSON.stringify(plan,null,2));
