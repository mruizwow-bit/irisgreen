import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEditorialEntities } from '../src/r04/editorial-adapters.mjs';

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
