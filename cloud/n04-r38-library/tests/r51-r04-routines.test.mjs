import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutineEntities } from '../src/r04/routines-adapter.mjs';
import { assertCanonicalAgeBands } from '../src/r04/age-taxonomy.mjs';

const {entities,report}=buildRoutineEntities();

test('R51 5B indexes all 109 routines in ES and EN',()=>{
  assert.equal(report.routine_ids,109);
  assert.equal(report.entities,218);
  assert.deepEqual(report.locale_counts,{es:109,en:109});
  assert.equal(new Set(entities.map(e=>e.entity_id)).size,218);
});
test('R51 5B resolves every textual step and preserves canonical routine URLs',()=>{
  assert.equal(report.step_references,510);
  for(const e of entities){
    assert.ok(e.steps.length>0);
    assert.equal(e.steps.length,e.step_ids.length);
    assert.ok(e.steps.every(x=>typeof x==='string'&&x.trim()));
    assert.match(e.canonical_url,e.locale==='es'
      ? /^https:\/\/irisgreen\.eu\/es\/recursos\/rutinas-imprimibles\/#pack-[a-z0-9-]+$/
      : /^https:\/\/irisgreen\.eu\/en\/resources\/printable-routines\/#pack-[a-z0-9-]+$/);
  }
});
test('R51 5B keeps formats, watermark and attribution without embedding pictogram bytes',()=>{
  for(const e of entities){
    assert.ok(e.formats.includes('screen'));
    assert.equal(e.watermark,true);
    assert.ok(e.attribution);
    assert.equal(Object.hasOwn(e,'pictogram_bytes'),false);
    assert.equal(Object.hasOwn(e,'pdf_bytes'),false);
    assert.equal(Object.hasOwn(e,'png_bytes'),false);
  }
});

test('R51 5B Routines emits canonical AGE_* bands only',()=>{
  const legacy=new Set(['INFANCIA','ADOLESCENCIA','ADULTEZ','TRANSVERSAL','CUALQUIER_EDAD','children','teenagers','adults','any']);
  for(const e of entities){
    assertCanonicalAgeBands(e.audience);
    assert.deepEqual(e.life_stage,e.audience);
    assert.ok(e.audience.every(x=>!legacy.has(x)));
  }
});
test('R51 5B legacy inf+todas collapses to ALL_AGES only',()=>{
  const mixedIds=new Set(['routine:rutina-ponerse-y-quitarse-los-zapatos','routine:rutina-ponerse-y-quitarse-el-abrigo','routine:rutina-ponerse-y-quitarse-los-calcetines','routine:rutina-ponerse-y-quitarse-la-chaqueta']);
  const observed=entities.filter(e=>mixedIds.has(e.content_id));
  if(observed.length){
    for(const e of observed) assert.deepEqual(e.audience,['ALL_AGES']);
  }
});
