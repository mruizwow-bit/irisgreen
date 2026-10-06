import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {loadVerifiedCorpus,searchLibrary,createLibraryHandler} from '../netlify/lib/library-engine.mjs';
import {retrieveReviewedLibrary} from '../sabik/library-client.mjs';

const version='test-version';
const base={id:'safe-es',locale:'es',title:'Prueba luz',text:'Texto sintético sobre luz.',heading:'Prueba',url:'https://irisgreen.eu/es/prueba/',age_bands:['ALL_AGES'],sensitivity:'S0_GENERAL',active:true,review:'EXACT_CURRENT_SAFE_WEB_PARITY'};
const rows=[base,{...base,id:'adult-es',age_bands:['AGE_18_PLUS']},{...base,id:'safe-en',locale:'en',url:'https://irisgreen.eu/en/test/'}];
const body={query:'luz',locale:'es',ageBand:'AGE_0_12',version,limit:6};
const bytes=Buffer.from(JSON.stringify({schema:'SABIK_REVIEW_LIBRARY/1',entities:rows}));
const binding={version,sha256:createHash('sha256').update(bytes).digest('hex'),active_records:rows.length};
const context={site:{id:'40042464-343c-4587-b6b7-f6159836e291'},deploy:{context:'branch-deploy'}};
const origin='https://main-review--irisgreen-home.netlify.app';
const req=(data=body,headers={},url=origin+'/sabik-library/search')=>new Request(url,{method:'POST',headers:{origin,'sec-fetch-site':'same-origin','content-type':'application/json',...headers},body:JSON.stringify(data)});

test('verified corpus rejects tampering and unsafe records',()=>{
 assert.equal(loadVerifiedCorpus(bytes,binding).length,3);
 assert.throws(()=>loadVerifiedCorpus(Buffer.from('changed'),binding));
 const unsafe=Buffer.from(JSON.stringify({schema:'SABIK_REVIEW_LIBRARY/1',entities:[{...base,sensitivity:'S2_HIGH_SENSITIVITY'}]}));
 assert.throws(()=>loadVerifiedCorpus(unsafe,{...binding,active_records:1,sha256:createHash('sha256').update(unsafe).digest('hex')}));
});
test('age and locale filtering precede ranking; no sensitive/adult bypass',()=>{
 assert.deepEqual(searchLibrary([...rows,{...base,id:'s2',sensitivity:'S2_HIGH_SENSITIVITY'},{...base,id:'draft',active:false}],body,version).map(x=>x.fragment_id),['safe-es']);
 assert.equal(searchLibrary(rows,{...body,ageBand:'AGE_18_PLUS'},version).length,2);
 assert.throws(()=>searchLibrary(rows,{...body,ageBand:'AGE_UNSET'},version));
 assert.throws(()=>searchLibrary(rows,{...body,ageBand:'GENERAL'},version));
 assert.throws(()=>searchLibrary(rows,{...body,version:'wrong'},version));
 assert.throws(()=>searchLibrary(rows,{...body,adultVerified:true},version));
});
test('HTTP service is closed on production, other origins, absent age and oversized input',async()=>{
 let loads=0;
 const handler=createLibraryHandler({load:async()=>{loads++;return rows;},binding});
 assert.equal((await handler(req(),{...context,deploy:{context:'production'}})).status,503);
 assert.equal((await handler(req(body,{},'https://irisgreen.eu/sabik-library/search'),context)).status,503);
 assert.equal((await handler(req(body,{origin:'https://other.example'}),context)).status,403);
 assert.equal((await handler(req({...body,ageBand:'AGE_UNSET'}),context)).status,400);
 assert.equal((await handler(req({...body,query:'x'.repeat(5000)}),context)).status,413);
 assert.equal(loads,0);
 const response=await handler(req(),context);
 assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
 assert.deepEqual((await response.json()).results.map(x=>x.fragment_id),['safe-es']);
});
test('browser receives verified result through same-origin private service',async()=>{
 const handler=createLibraryHandler({load:async()=>rows,binding});
 const result=await retrieveReviewedLibrary(body,{binding,fetch:async(path,options)=>{
  assert.equal(path,'/sabik-library/search');assert.equal(options.credentials,'same-origin');
  return handler(req(JSON.parse(options.body)),context);
 }});
 assert.equal(result.candidates[0].fragment_id,'safe-es');
});
test('browser rejects sensitive results, wrong language/hash and cancelled responses',async()=>{
 const valid={schema:'SABIK_REVIEW_RESULTS/1',library_version:version,corpus_sha256:binding.sha256,source_language:'es',results:searchLibrary(rows,body,version)};
 for(const bad of [{...valid,corpus_sha256:'wrong'},{...valid,source_language:'en'},{...valid,results:[{...valid.results[0],sensitivity:'S2_HIGH_SENSITIVITY'}]}]){
  await assert.rejects(retrieveReviewedLibrary(body,{binding,fetch:async()=>new Response(JSON.stringify(bad),{headers:{'content-type':'application/json'}})}));
 }
 const controller=new AbortController();controller.abort();
 await assert.rejects(retrieveReviewedLibrary(body,{binding,signal:controller.signal,fetch:async()=>new Response(JSON.stringify(valid),{headers:{'content-type':'application/json'}})}),{name:'AbortError'});
});
