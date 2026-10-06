// Same-origin private review endpoint. No credentials or corpus in browser assets.
export async function retrieveReviewedLibrary({query,locale,ageBand,limit=6},{signal,fetch:fetcher=globalThis.fetch,binding}={}){
  if(!binding||!['AGE_0_12','AGE_13_17','AGE_18_PLUS'].includes(ageBand)||!['es','en'].includes(locale))throw new Error('LIBRARY_UNAVAILABLE');
  const controller=new AbortController();
  const abort=()=>controller.abort(); signal?.addEventListener('abort',abort,{once:true});
  if(signal?.aborted)controller.abort();
  const timer=setTimeout(abort,8000);
  try{
    const response=await fetcher('/sabik-library/search',{method:'POST',credentials:'same-origin',mode:'same-origin',
      cache:'no-store',redirect:'error',headers:{'content-type':'application/json'},
      body:JSON.stringify({query,locale,ageBand,limit,version:binding.version}),signal:controller.signal});
    if(!response.ok||!/^application\/json(?:;|$)/i.test(response.headers.get('content-type')||''))throw new Error('LIBRARY_UNAVAILABLE');
    const body=await response.json();
    if(body.schema!=='SABIK_REVIEW_RESULTS/1'||body.library_version!==binding.version||body.corpus_sha256!==binding.sha256||
       body.source_language!==locale||!Array.isArray(body.results)||body.results.length>limit)throw new Error('LIBRARY_INTEGRITY');
    const ids=new Set();
    for(const row of body.results){
      const url=new URL(row.url);
      if(row.library_version!==binding.version||row.locale!==locale||ids.has(row.fragment_id)||
        typeof row.fragment_id!=='string'||!['title','snippet','heading'].every(k=>typeof row[k]==='string')||row.snippet.length>2000||
        !['S0_GENERAL','S1_SENSITIVE'].includes(row.sensitivity)||!Array.isArray(row.age_bands)||
        !row.age_bands.some(b=>b==='ALL_AGES'||b===ageBand)||url.origin!=='https://irisgreen.eu'||url.username||url.password||
        !url.pathname.startsWith('/'+locale+'/'))throw new Error('LIBRARY_INTEGRITY');
      ids.add(row.fragment_id);
    }
    if(controller.signal.aborted)throw new DOMException('Aborted','AbortError');
    return Object.freeze({library_version:body.library_version,candidates:Object.freeze(body.results),groups:Object.freeze([]),source_language:locale});
  }catch(error){
    if(signal?.aborted)throw new DOMException('Aborted','AbortError');
    if(controller.signal.aborted)throw new Error('LIBRARY_UNAVAILABLE');
    throw error;
  }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
