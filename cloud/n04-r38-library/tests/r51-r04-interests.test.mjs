import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInterestCandidateEntities } from '../src/r04/interests-adapter.mjs';

const {entities,report}=buildInterestCandidateEntities();

test('R51 5C stages all 72 Interests in ES and EN',()=>{
  assert.equal(report.interest_ids,72);
  assert.equal(report.entities,144);
  assert.deepEqual(report.locale_counts,{es:72,en:72});
  assert.equal(new Set(entities.map(e=>e.entity_id)).size,144);
});

test('R51 5C preserves pinned bilingual routes and donor provenance',()=>{
  for(const e of entities){
    assert.match(e.canonical_url,e.locale==='es'
      ? /^https:\/\/irisgreen\.eu\/es\/intereses\/temas\/\d{2}-[a-z0-9-]+\/$/
      : /^https:\/\/irisgreen\.eu\/en\/interests\/topics\/\d{2}-[a-z0-9-]+\/$/);
    assert.ok(e.title&&e.central_focus&&e.what_can_explore);
    assert.equal(e.provenance[0].authority,'R48_DONOR_EDITORIAL_DATA_ONLY');
  }
});

test('R51 5C fails closed while canonical age and safety classification are pending',()=>{
  for(const e of entities){
    assert.equal(e.active,false);
    assert.equal(e.retrieval_eligible,false);
    assert.equal(e.audience,null);
    assert.equal(e.sensitivity,null);
    assert.equal(e.age_status,'PENDING_R58_R59_CANONICAL_CLASSIFICATION');
    assert.equal(e.safety_status,'PENDING_R59_CANONICAL_CLASSIFICATION');
    assert.equal(e.discovery,'HOLD_PENDING_CLASSIFICATION');
  }
  assert.equal(report.retrieval_eligible,0);
  assert.equal(report.age_pending_ids,72);
  assert.equal(report.sealed_r04_eligible,false);
});

test('R51 5C does not silently inherit the rejected R48 experience as retrieval text',()=>{
  for(const e of entities){
    assert.equal(e.donor_experience_status,'NON_BINDING_R48_DONOR');
    if(e.donor_experience) assert.equal(e.text.includes(e.donor_experience),false);
    assert.equal(Object.hasOwn(e,'renderer'),false);
    assert.equal(Object.hasOwn(e,'map_dump'),false);
    assert.equal(Object.hasOwn(e,'geojson'),false);
    assert.equal(Object.hasOwn(e,'tiles'),false);
  }
});
