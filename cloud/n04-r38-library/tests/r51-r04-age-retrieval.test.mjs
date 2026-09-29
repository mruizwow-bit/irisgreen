import test from 'node:test';
import assert from 'node:assert/strict';
import { filterBeforeRanking } from '../src/r04/age-retrieval.mjs';

function e(id,audience,{sensitivity='S0_GENERAL',source_type='editorial',active=true,retrieval_eligible=true}={}){
  return {entity_id:id,content_id:id,locale:'es',audience,sensitivity,source_type,active,retrieval_eligible};
}
const all=[
  e('child',['AGE_0_12']),
  e('teen',['AGE_13_17']),
  e('adult',['AGE_18_PLUS']),
  e('all',['ALL_AGES']),
  e('adult-s2',['AGE_18_PLUS'],{sensitivity:'S2_HIGH_SENSITIVITY'}),
  e('safe-variant',['AGE_0_12','AGE_13_17','AGE_18_PLUS'],{sensitivity:'S1_SENSITIVE',source_type:'safe_variant'}),
  e('inactive',['ALL_AGES'],{active:false}),
  e('held',['ALL_AGES'],{retrieval_eligible:false})
];

test('GENERAL keeps age-neutral discovery but stays safe-by-default',()=>{
  const ids=filterBeforeRanking(all,{ageBand:'GENERAL'}).map(x=>x.entity_id);
  assert.ok(ids.includes('child'));
  assert.ok(ids.includes('teen'));
  assert.ok(ids.includes('adult'));
  assert.ok(ids.includes('all'));
  assert.ok(!ids.includes('adult-s2'));
});

test('AGE_0_12 allows child and ALL_AGES, never adult-only',()=>{
  const ids=filterBeforeRanking(all,{ageBand:'AGE_0_12'}).map(x=>x.entity_id);
  assert.ok(ids.includes('child'));
  assert.ok(ids.includes('all'));
  assert.ok(ids.includes('safe-variant'));
  assert.ok(!ids.includes('adult'));
  assert.ok(!ids.includes('adult-s2'));
});

test('AGE_13_17 allows teen and ALL_AGES',()=>{
  const ids=filterBeforeRanking(all,{ageBand:'AGE_13_17'}).map(x=>x.entity_id);
  assert.ok(ids.includes('teen'));
  assert.ok(ids.includes('all'));
  assert.ok(!ids.includes('child'));
  assert.ok(!ids.includes('adult'));
});

test('AGE_18_PLUS allows adult and ALL_AGES, full S2 only with explicit intent',()=>{
  const safe=filterBeforeRanking(all,{ageBand:'AGE_18_PLUS',explicitIntent:false}).map(x=>x.entity_id);
  const explicit=filterBeforeRanking(all,{ageBand:'AGE_18_PLUS',explicitIntent:true}).map(x=>x.entity_id);
  assert.ok(safe.includes('adult'));
  assert.ok(safe.includes('all'));
  assert.ok(!safe.includes('adult-s2'));
  assert.ok(explicit.includes('adult-s2'));
});

test('ALL_AGES returns only entities explicitly classified ALL_AGES',()=>{
  const ids=filterBeforeRanking(all,{ageBand:'ALL_AGES'}).map(x=>x.entity_id);
  assert.deepEqual(ids,['all']);
});

test('inactive or retrieval-held entities are removed before ranking',()=>{
  const ids=filterBeforeRanking(all,{ageBand:'GENERAL'}).map(x=>x.entity_id);
  assert.ok(!ids.includes('inactive'));
  assert.ok(!ids.includes('held'));
});
