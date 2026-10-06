import {createHash} from 'node:crypto';

const BANDS = ['AGE_0_12','AGE_13_17','AGE_18_PLUS'];
const terms = text => [...new Set(text.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[])];
const STOP = new Set('que qué me de del el la las los un una y en por para con tengo como cómo puedo what how can i the a an to of and for with my is are'.split(' '));
export function loadVerifiedCorpus(bytes, binding) {
  if(createHash('sha256').update(bytes).digest('hex') !== binding.sha256) throw new Error('integrity');
  const corpus=JSON.parse(Buffer.from(bytes).toString('utf8'));
  if(corpus.schema!=='SABIK_REVIEW_LIBRARY/1'||!Array.isArray(corpus.entities)||corpus.entities.length!==binding.active_records) throw new Error('schema');
  const ids=new Set();
  for(const row of corpus.entities){
    const url=new URL(row.url);
    if(ids.has(row.id)||typeof row.id!=='string'||!['es','en'].includes(row.locale)||
       row.active!==true||row.review!=='EXACT_CURRENT_SAFE_WEB_PARITY'||
       !['S0_GENERAL','S1_SENSITIVE'].includes(row.sensitivity)||
       !Array.isArray(row.age_bands)||!row.age_bands.length||row.age_bands.some(x=>![...BANDS,'ALL_AGES'].includes(x))||
       url.origin!=='https://irisgreen.eu'||url.username||url.password||!url.pathname.startsWith('/'+row.locale+'/')||
       !['title','text','heading'].every(k=>typeof row[k]==='string')||!row.text||row.text.length>2000) throw new Error('unsafe_row');
    ids.add(row.id);
  }
  return corpus.entities;
}
export function searchLibrary(rows, request, version) {
  if(!request||typeof request!=='object'||Array.isArray(request)||
     Object.keys(request).some(x=>!['query','locale','ageBand','version','limit'].includes(x))||
     typeof request.query!=='string'||!request.query.trim()||request.query.length>300||
     !BANDS.includes(request.ageBand)||!['es','en'].includes(request.locale)||
     request.version!==version||!Number.isInteger(request.limit)||request.limit<1||request.limit>6) throw new Error('invalid_request');
  const query=terms(request.query).filter(x=>!STOP.has(x));
  const hits=[];
  // Filter before ranking; self-declared adulthood never authorizes S2 content.
  for(const row of rows){
    if(row.active!==true||row.locale!==request.locale||!['S0_GENERAL','S1_SENSITIVE'].includes(row.sensitivity)||
       !row.age_bands.some(b=>b==='ALL_AGES'||b===request.ageBand)) continue;
    const title=terms(row.title), body=terms(row.text+' '+row.heading);
    const score=query.reduce((sum,t)=>sum+(title.includes(t)?400:0)+(body.includes(t)?100:0),0);
    if(score) hits.push({row,score});
  }
  hits.sort((a,b)=>b.score-a.score||(a.row.id<b.row.id?-1:1));
  return hits.slice(0,request.limit).map(({row,score})=>({library_version:version,
    fragment_id:row.id,snippet:row.text,title:row.title,heading:row.heading,url:row.url,
    source_type:'sabik-reviewed-library',concepts:[],score,age_bands:row.age_bands,
    sensitivity:row.sensitivity,locale:row.locale}));
}

export function createLibraryHandler({load,binding,siteId='40042464-343c-4587-b6b7-f6159836e291'}){
  const respond=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{
    'content-type':'application/json; charset=utf-8','cache-control':'no-store',
    'x-content-type-options':'nosniff','referrer-policy':'no-referrer'}});
  return async(request,context)=>{
    const url=new URL(request.url);
    // SSO protects every non-production deploy; additionally pin this service to the review alias.
    if(context?.site?.id!==siteId||context?.deploy?.context!=='branch-deploy'||
       url.origin!=='https://main-review--irisgreen-home.netlify.app')return respond({error:'unavailable'},503);
    if(url.pathname!=='/sabik-library/search'||url.search||request.method!=='POST')return respond({error:'method'},405);
    if(request.headers.get('origin')!==url.origin||request.headers.get('sec-fetch-site')!=='same-origin')return respond({error:'origin'},403);
    if(!/^application\/json(?:;|$)/i.test(request.headers.get('content-type')||''))return respond({error:'content_type'},415);
    let reader;
    try{
      reader=request.body?.getReader(); if(!reader)return respond({error:'body'},400);
      const chunks=[];let size=0;
      for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;
        if(size>4096){await reader.cancel();return respond({error:'size'},413);}chunks.push(value);}
      const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
      // Validate even when storage is unavailable.
      searchLibrary([],body,binding.version);
      const rows=await load();
      return respond({schema:'SABIK_REVIEW_RESULTS/1',library_version:binding.version,
        corpus_sha256:binding.sha256,source_language:body.locale,results:searchLibrary(rows,body,binding.version)});
    }catch(error){return respond({error:error.message==='invalid_request'?'invalid_request':'unavailable'},error.message==='invalid_request'?400:503);}
    finally{reader?.releaseLock();}
  };
}
