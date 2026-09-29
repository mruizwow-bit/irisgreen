import test from 'node:test';
import assert from 'node:assert/strict';
import { diffLibraryEntities } from '../src/r04/incremental-delta.mjs';

function e(overrides={}){
  return {
    entity_id:'condition:c1:es',content_id:'condition:c1',fragment_id:'condition:c1:es:main',
    locale:'es',title:'Uno',text:'Texto base',canonical_url:'https://irisgreen.eu/es/uno/',
    source_type:'editorial',source_commit:'a',source_version:'a',source_hash:'h1',
    source_urls:['https://example.org/a'],provenance:[],
    audience:['AGE_13_17','AGE_18_PLUS'],sensitivity:'S1_SENSITIVE',discovery:'NORMAL',
    safe_variant_id:null,review_reason:null,active:true,retrieval_eligible:true,...overrides
  };
}
function one(a,b){ return diffLibraryEntities([a],[b]).changes[0]; }

test('fixture 1 textual change => MODIFIED',()=>{
  assert.equal(one(e(),e({text:'Texto cambiado',source_hash:'h2'})).change_type,'MODIFIED');
});
test('fixture 2 URL change => ROUTE_CHANGED',()=>{
  assert.equal(one(e(),e({canonical_url:'https://irisgreen.eu/es/dos/'})).change_type,'ROUTE_CHANGED');
});
test('fixture 3 S1 to S2 => SAFETY_CHANGED',()=>{
  assert.equal(one(e(),e({sensitivity:'S2_HIGH_SENSITIVITY',discovery:'INTENTIONAL_ONLY'})).change_type,'SAFETY_CHANGED');
});
test('fixture 4 reviewed safe variant content change => SAFETY_CHANGED',()=>{
  const a=e({entity_id:'condition:c1:es:safe',fragment_id:'condition:c1:es:safe',is_safe_variant:true,text:'Safe A'});
  const b={...a,text:'Safe B',source_hash:'h2'};
  assert.equal(one(a,b).change_type,'SAFETY_CHANGED');
});
test('fixture 5 removed entity => REMOVED + tombstone',()=>{
  const d=diffLibraryEntities([e()],[],{fromVersion:'r04',toVersion:'r05'});
  assert.equal(d.changes[0].change_type,'REMOVED');
  assert.equal(d.tombstones.length,1);
  assert.equal(d.tombstones[0].active,false);
});
test('fixture 6 new entity => ADDED',()=>{
  const d=diffLibraryEntities([],[e()]);
  assert.equal(d.changes[0].change_type,'ADDED');
});
test('fixture 7 EN added to existing content => LOCALE_CHANGED',()=>{
  const es=e();
  const en=e({entity_id:'condition:c1:en',fragment_id:'condition:c1:en:main',locale:'en',canonical_url:'https://irisgreen.eu/en/one/'});
  const d=diffLibraryEntities([es],[es,en]);
  assert.equal(d.changes.find(x=>x.locale==='en').change_type,'LOCALE_CHANGED');
});
test('fixture 8 EN removed while ES remains => LOCALE_CHANGED + tombstone',()=>{
  const es=e();
  const en=e({entity_id:'condition:c1:en',fragment_id:'condition:c1:en:main',locale:'en'});
  const d=diffLibraryEntities([es,en],[es]);
  assert.equal(d.changes.find(x=>x.locale==='en').change_type,'LOCALE_CHANGED');
  assert.equal(d.tombstones.length,1);
});
test('age changes remain separate from safety',()=>{
  assert.equal(one(e(),e({audience:['AGE_18_PLUS']})).change_type,'AGE_CHANGED');
});
test('fixture 11 source/citation change => SOURCE_CHANGED',()=>{
  assert.equal(one(e(),e({source_urls:['https://example.org/b']})).change_type,'SOURCE_CHANGED');
});
test('fixture 12 duplicate titles on distinct routes stay distinct',()=>{
  const a=e({entity_id:'data:uk:en',content_id:'data:uk',locale:'en',title:'Employment and autism',canonical_url:'https://irisgreen.eu/en/data/employment-and-autism-united-kingdom/'});
  const b=e({entity_id:'data:au:en',content_id:'data:au',locale:'en',title:'Employment and autism',canonical_url:'https://irisgreen.eu/en/data/employment-and-autism-australia/'});
  const d=diffLibraryEntities([a,b],[a,b]);
  assert.equal(d.changes.length,2);
  assert.equal(d.counts.UNCHANGED,2);
});
test('unchanged stays UNCHANGED and does not create content change',()=>{
  const d=diffLibraryEntities([e()],[e()]);
  assert.equal(d.changes[0].change_type,'UNCHANGED');
  assert.equal(d.content_changed,false);
});
