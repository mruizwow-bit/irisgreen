import { getDeployStore } from '@netlify/blobs';
import { searchR04Candidate } from '../../src/r04/candidate-search.mjs';
import binding from '../../build/r04/r04-candidate-binding.json' with { type: 'json' };

let cache=null;
async function loadCorpus(){
  if(cache) return cache;
  if(binding?.schema!=='R51_A9_R04_CANDIDATE_BINDING/1.0') throw new Error('invalid_candidate_binding');
  const store=getDeployStore({name:'sabik-r04-candidates',region:'us-east-2',consistency:'strong'});
  const corpus=await store.get(binding.partial_corpus_key,{type:'json'});
  if(!corpus||corpus.schema!=='R51_A9_R04_PARTIAL_CORPUS/1.0') throw new Error('candidate_corpus_missing');
  cache=corpus;
  return corpus;
}

export default async (request)=>{
  if(request.method!=='POST') return new Response(JSON.stringify({error:'method_not_allowed'}),{
    status:405,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
  });
  try{
    const body=await request.json();
    const corpus=await loadCorpus();
    const results=searchR04Candidate(corpus.entities,{
      query:body?.q,
      locale:body?.locale||'es',
      ageBand:body?.ageBand||'GENERAL',
      explicitIntent:body?.explicitIntent===true,
      limit:Number.isInteger(body?.limit)?body.limit:5
    });
    return new Response(JSON.stringify({
      schema:'R51_A9_R04_CANDIDATE_SEARCH_RESPONSE/1.0',
      library_version:corpus.library_version,
      candidate_sha:binding.github_sha,
      result_count:results.length,
      results
    }),{
      status:200,
      headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
    });
  }catch(error){
    return new Response(JSON.stringify({error:'candidate_search_failed'}),{
      status:400,
      headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
    });
  }
};

export const config={path:'/internal/r04/candidate/search'};
