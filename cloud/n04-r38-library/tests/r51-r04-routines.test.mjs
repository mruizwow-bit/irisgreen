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
test('R51 5B resolves every routine step to bilingual text and uses canonical manifest URLs',()=>{
  for(const e of entities){
    assert.ok(e.steps.length>0&&e.steps.length===e.step_count,e.entity_id);
    assert.ok(e.steps.every(step=>step&&typeof step==='string'),e.entity_id);
    assert.match(e.canonical_url,e.locale==='es'
      ? /^https:\/\/irisgreen\.eu\/es\/recursos\/rutinas-imprimibles\/#pack-[a-z0-9-]+$/
      : /^https:\/\/irisgreen\.eu\/en\/resources\/printable-routines\/#pack-[a-z0-9-]+$/);
  }
});
test('R51 5B preserves formats attribution licence traceability and watermark without asset bytes',()=>{
  assert.equal(report.downloadable_svg_a4,109);
  assert.equal(report.watermarked,109);
  for(const e of entities){
    assert.ok(e.formats.includes('SVG_A4'));
    assert.match(e.pictogram_attribution,/Mulberry Symbols/);
    assert.match(e.pictogram_attribution,/CC BY-SA 4\.0/);
    assert.equal(e.pictogram_traceability,'CENTRAL_MANIFEST');
    assert.equal(e.watermark,'IRIS GREEN · irisgreen.eu');
    for(const key of ['pdf','png','svg_bytes','image_bytes','user','session','history','state']) assert.equal(Object.hasOwn(e,key),false);
  }
});
