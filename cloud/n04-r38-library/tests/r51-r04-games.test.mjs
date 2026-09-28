import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGameEntities } from '../src/r04/games-adapter.mjs';
import { assertCanonicalAgeBands } from '../src/r04/age-taxonomy.mjs';

const {entities,report}=buildGameEntities();

test('R51 5A indexes all 297 games in ES and EN',()=>{
  assert.equal(report.game_ids,297);
  assert.equal(report.entities,594);
  assert.deepEqual(report.locale_counts,{es:297,en:297});
  assert.equal(new Set(entities.map(e=>e.entity_id)).size,594);
});
test('R51 5A uses the public deep-link contract and real game instructions',()=>{
  for(const e of entities){
    assert.match(e.canonical_url,e.locale==='es'
      ? /^https:\/\/irisgreen\.eu\/es\/recursos\/juegos\/#juego-[a-z0-9-]+$/
      : /^https:\/\/irisgreen\.eu\/en\/resources\/games\/#juego-[a-z0-9-]+$/);
    assert.ok(e.instruction&&e.text.endsWith(e.instruction));
    assert.ok(e.title&&e.context&&e.skill&&e.mechanic);
  }
});
test('R51 5A excludes interactive/user state from the Cloud game entities',()=>{
  const banned=['score','seed','events','history','answers','user','session','completed','state'];
  for(const e of entities){
    for(const key of banned) assert.equal(Object.hasOwn(e,key),false,key+' leaked in '+e.entity_id);
    assert.equal(e.sensitivity,'S0_GENERAL');
    assert.equal(e.discovery,'NORMAL');
  }
});

test('R51 5A Games emits canonical AGE_* bands only',()=>{
  const legacy=new Set(['INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','CUALQUIER_EDAD','children','teenagers','adults','any']);
  for(const e of entities){
    assertCanonicalAgeBands(e.audience);
    assert.deepEqual(e.life_stage,e.audience);
    assert.ok(e.audience.every(x=>!legacy.has(x)));
  }
});
