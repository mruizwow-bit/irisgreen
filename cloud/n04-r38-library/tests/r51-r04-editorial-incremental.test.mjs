import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEditorialEntities } from '../src/r04/editorial-adapters.mjs';

test('R51 6C1 rebuilds one ordinary content_id instead of all 965',async()=>{
  const {entities,report}=await buildEditorialEntities({contentIds:['global-001']});
  assert.equal(report.content_ids,1);
  assert.equal(report.full_locale_entities,2);
  assert.deepEqual(report.requested_content_ids,['global-001']);
  assert.ok(entities.every(e=>e.content_id==='global-001'));
});

test('R51 6C1 preserves reviewed safe variants when rebuilding one S2 content_id',async()=>{
  const {entities,report}=await buildEditorialEntities({contentIds:['global-188']});
  assert.equal(report.content_ids,1);
  assert.equal(report.full_s2_locale_entities,2);
  assert.equal(report.safe_variant_entities,2);
  assert.equal(entities.length,4);
  assert.ok(entities.filter(e=>e.source_type==='safe_variant').every(e=>e.editorial_status==='HUMAN_REVIEWED_S2_SAFE_VARIANT'));
});

test('R51 6C1 domain and content filters compose fail-closed',async()=>{
  const {entities,report}=await buildEditorialEntities({domains:['conditions'],contentIds:['global-001']});
  assert.equal(entities.length,0);
  assert.equal(report.content_ids,0);
  assert.deepEqual(report.requested_domains,['conditions']);
});
