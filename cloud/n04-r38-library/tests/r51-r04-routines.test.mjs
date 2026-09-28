import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRoutineEntities } from '../src/r04/routines-adapter.mjs';

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
