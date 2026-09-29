import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWorkshopIntegratedEntities } from '../src/r04/workshop-adapter.mjs';
import { assertCanonicalAgeBands } from '../src/r04/age-taxonomy.mjs';

const {entities,report}=buildWorkshopIntegratedEntities();

test('R51 5D1 indexes the 25 Workshop studios currently integrated in A2',()=>{
  assert.equal(report.integrated_studio_ids,25);
  assert.equal(report.entities,50);
  assert.deepEqual(report.locale_counts,{es:25,en:25});
  assert.equal(new Set(entities.map(e=>e.entity_id)).size,50);
  assert.equal(report.r47_total_expected,27);
  assert.equal(report.r47_donor_pending.length,2);
});

test('R51 5D1 preserves real bilingual routes, tools, starters and exports',()=>{
  for(const e of entities){
    assert.match(e.canonical_url,e.locale==='es'
      ? /^https:\/\/irisgreen\.eu\/es\/taller\/[a-z0-9-]+\/$/
      : /^https:\/\/irisgreen\.eu\/en\/workshop\/[a-z0-9-]+\/$/);
    assert.ok(e.title&&e.tool_description&&e.starters.length&&e.export_formats);
    assert.ok(e.text.includes(e.tool_description));
  }
});

test('R51 5D1 uses explicit ALL_AGES source semantics, not a fallback',()=>{
  for(const e of entities){
    assertCanonicalAgeBands(e.audience);
    assert.deepEqual(e.audience,['ALL_AGES']);
    assert.equal(e.age_classification_reason,'R42_PATHS_EXPLICIT_ALL_PLUS_STAGE_CONTEXTS_TOOLS_NOT_GATED');
    assert.ok(e.stage_contexts.AGE_0_12);
    assert.ok(e.stage_contexts.AGE_13_17);
    assert.ok(e.stage_contexts.AGE_18_PLUS);
    assert.ok(e.stage_contexts.ALL_AGES);
  }
});

test('R51 5D1 excludes user projects and interactive state from Cloud Workshop entities',()=>{
  const banned=['project_data','canvas','files','user_code','indexeddb','opfs','history','session','answers'];
  for(const e of entities){
    for(const key of banned) assert.equal(Object.hasOwn(e,key),false,key+' leaked in '+e.entity_id);
    assert.equal(e.sensitivity,'S0_GENERAL');
    assert.equal(e.discovery,'NORMAL');
  }
});
