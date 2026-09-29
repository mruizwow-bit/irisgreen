import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { searchR04Candidate } from '../src/r04/candidate-search.mjs';

const corpus=JSON.parse(await readFile(new URL('../build/r04/r04-partial-corpus.json',import.meta.url),'utf8'));

test('R04 candidate search retrieves Workshop in EN with AGE_0_12',()=>{
  const r=searchR04Candidate(corpus.entities,{query:'Drawing',locale:'en',ageBand:'AGE_0_12',limit:10});
  assert.ok(r.some(x=>x.content_id==='workshop:workshop-01'));
});

test('R04 candidate search keeps full S2 out of GENERAL before ranking',()=>{
  const r=searchR04Candidate(corpus.entities,{query:'abuso',locale:'es',ageBand:'GENERAL',limit:20});
  assert.ok(r.length>0);
  assert.ok(r.every(x=>x.sensitivity!=='S2_HIGH_SENSITIVITY'));
});

test('R04 candidate search allows full S2 for explicit adult intent only',()=>{
  const r=searchR04Candidate(corpus.entities,{query:'abuso',locale:'es',ageBand:'AGE_18_PLUS',explicitIntent:true,limit:20});
  assert.ok(r.some(x=>x.sensitivity==='S2_HIGH_SENSITIVITY'));
});

test('R04 candidate search never returns held Interests',()=>{
  const r=searchR04Candidate(corpus.entities,{query:'Cielo nocturno',locale:'es',ageBand:'GENERAL',limit:20});
  assert.ok(r.every(x=>!String(x.content_id).startsWith('interest:')));
});

test('R04 ALL_AGES selection returns only explicit ALL_AGES entities',()=>{
  const r=searchR04Candidate(corpus.entities,{query:'Dibujo',locale:'es',ageBand:'ALL_AGES',limit:20});
  assert.ok(r.length>0);
  assert.ok(r.every(x=>x.audience.includes('ALL_AGES')));
});
