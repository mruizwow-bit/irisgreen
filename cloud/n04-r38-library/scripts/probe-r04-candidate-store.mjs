import { getDeployStore } from '@netlify/blobs';
import { searchR04Candidate } from '../src/r04/candidate-search.mjs';

const SITE_ID='47b06e68-ff54-4097-8ad8-336b2d71758a';
const STORE='sabik-r04-candidates';
const REGION='us-east-2';
const deployID=String(process.env.N04_DEPLOY_ID||'').trim();
const token=String(process.env.NETLIFY_AUTH_TOKEN||'').trim();
const sha=String(process.env.GITHUB_SHA||'').trim();

if(!/^[a-f0-9]{24}$/.test(deployID)||!token||!/^[a-f0-9]{40}$/.test(sha)) throw new Error('missing_probe_context');
const key='r51-r04-candidates/r04-partial-corpus/'+sha+'/r04-partial-corpus.json';
const store=getDeployStore({name:STORE,region:REGION,deployID,siteID:SITE_ID,token,consistency:'strong'});
const corpus=await store.get(key,{type:'json'});
if(!corpus||corpus.schema!=='R51_A9_R04_PARTIAL_CORPUS/1.0') throw new Error('partial_corpus_missing');

const checks=[
  ['es-general',{query:'ropa',locale:'es',ageBand:'GENERAL',limit:5}],
  ['en-child',{query:'Drawing',locale:'en',ageBand:'AGE_0_12',limit:5}],
  ['es-s2-safe',{query:'abuso',locale:'es',ageBand:'GENERAL',limit:10}],
  ['es-s2-adult-explicit',{query:'abuso',locale:'es',ageBand:'AGE_18_PLUS',explicitIntent:true,limit:10}],
  ['held-interest',{query:'Cielo nocturno',locale:'es',ageBand:'GENERAL',limit:20}]
];
const results=[];
for(const [name,args] of checks){
  const rows=searchR04Candidate(corpus.entities,args);
  if(name==='es-s2-safe'&&rows.some(x=>x.sensitivity==='S2_HIGH_SENSITIVITY')) throw new Error('full_s2_leaked_safe');
  if(name==='es-s2-adult-explicit'&&!rows.some(x=>x.sensitivity==='S2_HIGH_SENSITIVITY')) throw new Error('adult_explicit_s2_missing');
  if(name==='held-interest'&&rows.some(x=>String(x.content_id).startsWith('interest:'))) throw new Error('held_interest_leaked');
  if((name==='es-general'||name==='en-child')&&!rows.length) throw new Error('expected_results_missing:'+name);
  results.push({name,result_count:rows.length,entity_ids:rows.map(x=>x.entity_id),sensitivities:rows.map(x=>x.sensitivity)});
}
console.log(JSON.stringify({
  status:'PASS',
  deploy_id:deployID,
  key,
  library_version:corpus.library_version,
  entity_count:corpus.entity_count,
  active_entity_count:corpus.active_entity_count,
  held_entity_count:corpus.held_entity_count,
  checks:results,
  production_changed:false
},null,2));
