import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEditorialEntities } from '../src/r04/editorial-adapters.mjs';
import ageManifest from '../sources/r51-r04/age/age-classification-r51-global.json' with { type: 'json' };
import { assertCanonicalAgeBands } from '../src/r04/age-taxonomy.mjs';

const built=await buildEditorialEntities();
const full=built.entities.filter(e=>e.source_type!=='safe_variant');
const safe=built.entities.filter(e=>e.source_type==='safe_variant');

test('R04 editorial adapters cover all 965 canonical content ids',()=>{
  assert.equal(built.report.content_ids,965);
  assert.deepEqual(built.report.content_counts,{situation:223,condition:226,everyday_life:62,data:60,research:132,support_directory:262});
  assert.equal(built.report.full_locale_entities,1668);
  assert.deepEqual(built.report.locale_counts,{es:965,en:703});
});
test('R04 editorial adapters preserve complete S2 reviewed-safe pairing',()=>{
  assert.equal(built.report.full_s2_locale_entities,32);
  assert.equal(built.report.safe_variant_entities,32);
  assert.equal(safe.length,32);
  for(const entity of full.filter(e=>e.sensitivity==='S2_HIGH_SENSITIVITY')){
    assert.ok(entity.safe_variant_id);
    assert.ok(safe.some(s=>s.entity_id===entity.safe_variant_id&&s.derived_from_entity_id===entity.entity_id));
  }
});
test('R04 Data entities always retain population period jurisdiction and a source',()=>{
  const data=full.filter(e=>e.content_type==='data');
  assert.equal(data.length,120);
  for(const e of data){
    assert.ok(e.population,'population '+e.entity_id);
    assert.ok(e.period,'period '+e.entity_id);
    assert.ok(e.jurisdiction,'jurisdiction '+e.entity_id);
    assert.ok(e.sources.length,'sources '+e.entity_id);
  }
});
test('R04 Spanish support directory is source-only ES with authority and source URL',()=>{
  const support=full.filter(e=>e.content_type==='support_directory');
  assert.equal(support.length,262);
  assert.ok(support.every(e=>e.locale==='es'&&e.source_language==='es'&&e.authority&&e.sources[0]?.url));
});

test('R04 editorial adapters emit canonical A2 age taxonomy with no fallback',()=>{
  const unique=new Map();
  for(const e of full){
    assertCanonicalAgeBands(e.audience);
    assert.ok(e.age_classification_review,'age review '+e.entity_id);
    if(!unique.has(e.content_id)) unique.set(e.content_id,e);
    else assert.deepEqual(e.audience,unique.get(e.content_id).audience);
  }
  assert.equal(unique.size,965);
  const visible={AGE_0_12:0,AGE_13_17:0,AGE_18_PLUS:0,ALL_AGES:0};
  for(const e of unique.values()){
    for(const band of ['AGE_0_12','AGE_13_17','AGE_18_PLUS']){
      if(e.audience.includes(band)||e.audience.includes('ALL_AGES')) visible[band]++;
    }
    if(e.audience.includes('ALL_AGES')) visible.ALL_AGES++;
  }
  assert.deepEqual(visible,ageManifest.totals.visible_by_filter);
  assert.equal(built.report.age_unclassified,0);
});
test('R04 safe variants inherit the reviewed content age bands instead of becoming all-age',()=>{
  for(const safeEntity of safe){
    const fullEntity=full.find(e=>e.entity_id===safeEntity.derived_from_entity_id);
    assert.ok(fullEntity);
    assert.deepEqual(safeEntity.audience,fullEntity.audience);
    assertCanonicalAgeBands(safeEntity.audience);
  }
});

test('R04 approved-package routes pending A2 stay held and out of retrieval',()=>{
  const pending=built.entities.filter(e=>e.route_status==='APPROVED_PACKAGE_PENDING_A2');
  assert.ok(pending.length>0);
  assert.equal(built.report.routes_pending_a2,full.filter(e=>e.route_status==='APPROVED_PACKAGE_PENDING_A2').length);
  assert.equal(built.report.held_pending_a2_entities,pending.length);
  for(const e of pending){
    assert.equal(e.active,false,e.entity_id);
    assert.equal(e.retrieval_eligible,false,e.entity_id);
  }
});
