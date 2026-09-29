import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuietSpaceEditorialEntities } from '../src/r04/quiet-space-adapter.mjs';
import { assertCanonicalAgeBands } from '../src/r04/age-taxonomy.mjs';

const {entities,report}=buildQuietSpaceEditorialEntities();

test('R51 5E1 builds six bilingual Quiet Space editorial modules',()=>{
  assert.equal(report.module_ids,6);
  assert.equal(report.entities,12);
  assert.deepEqual(report.locale_counts,{es:6,en:6});
  assert.equal(new Set(entities.map(e=>e.entity_id)).size,12);
});

test('R51 5E1 keeps the five non-crisis modules active across explicit age bands',()=>{
  const active=entities.filter(e=>e.active);
  assert.equal(active.length,10);
  for(const e of active){
    assert.equal(e.retrieval_eligible,true);
    assert.equal(e.sensitivity,'S0_GENERAL');
    assert.equal(e.discovery,'NORMAL');
    assertCanonicalAgeBands(e.audience);
    assert.deepEqual(e.audience,['AGE_0_12','AGE_13_17','AGE_18_PLUS']);
  }
});

test('R51 5E1 holds crisis help fail-closed pending copy review',()=>{
  const held=entities.filter(e=>e.content_id==='quiet-space:m-04');
  assert.equal(held.length,2);
  for(const e of held){
    assert.equal(e.active,false);
    assert.equal(e.retrieval_eligible,false);
    assert.equal(e.sensitivity,'S2_HIGH_SENSITIVITY');
    assert.equal(e.discovery,'INTENTIONAL_ONLY');
    assert.equal(e.editorial_status,'FROZEN_PENDING_CRISIS_COPY_REVIEW');
    assert.equal(e.review_reason,'CRISIS_COPY_REVIEW_PENDING');
    assert.ok(e.source_urls.length>=4);
  }
});

test('R51 5E1 indexes no audiovisual/session implementation data',()=>{
  const banned=['frames','shader','particles','session_state','temporary_player_url','iframe_src','audio_bytes'];
  for(const e of entities){
    for(const key of banned) assert.equal(Object.hasOwn(e,key),false,key+' leaked in '+e.entity_id);
    assert.ok(e.canonical_url==='https://irisgreen.eu/es/sitio-tranquilo/'||e.canonical_url==='https://irisgreen.eu/en/quiet-space/');
  }
  assert.equal(report.r53_media_indexed,false);
});
