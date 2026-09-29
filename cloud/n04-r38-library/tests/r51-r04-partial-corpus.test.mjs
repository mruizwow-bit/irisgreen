import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const out=new URL('../build/r04/',import.meta.url);
const corpus=JSON.parse(await readFile(new URL('r04-partial-corpus.json',out),'utf8'));

test('R51 partial R04 corpus has unique entity ids',()=>{
  assert.equal(new Set(corpus.entities.map(e=>e.entity_id)).size,corpus.entities.length);
});

test('R51 partial R04 corpus preserves held candidates as inactive',()=>{
  assert.ok(corpus.held_entity_count>=146);
  const interests=corpus.entities.filter(e=>e.content_type==='interest');
  assert.equal(interests.length,144);
  assert.ok(interests.every(e=>e.active===false&&e.retrieval_eligible===false));
});

test('R51 active entities contain canonical age ids only',()=>{
  const legacy=new Set(['INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','CUALQUIER_EDAD','children','teenagers','adults','any']);
  const active=corpus.entities.filter(e=>e.active!==false&&e.retrieval_eligible!==false);
  for(const e of active){
    assert.ok(Array.isArray(e.audience)&&e.audience.length,e.entity_id);
    assert.ok(e.audience.every(x=>!legacy.has(x)),e.entity_id);
  }
});

test('R51 partial corpus remains private candidate only',()=>{
  assert.equal(corpus.status,'PRIVATE_CANDIDATE_NOT_ACTIVE');
  assert.equal(corpus.library_version,'R04_CANDIDATE_PARTIAL_UNSEALED');
});
