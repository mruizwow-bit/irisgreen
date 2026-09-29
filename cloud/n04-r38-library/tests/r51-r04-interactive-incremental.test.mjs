import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGameEntities } from '../src/r04/games-adapter.mjs';
import { buildRoutineEntities } from '../src/r04/routines-adapter.mjs';

test('R51 6C2 rebuilds one game instead of all 297',()=>{
  const {entities,report}=buildGameEntities({ids:['los-cordones']});
  assert.equal(report.game_ids,1);
  assert.equal(report.entities,2);
  assert.deepEqual(report.requested_game_ids,['los-cordones']);
  assert.deepEqual(entities.map(e=>e.locale).sort(),['en','es']);
  assert.ok(entities.every(e=>e.content_id==='game:los-cordones'));
});

test('R51 6C2 rebuilds one routine instead of all 109',()=>{
  const {entities,report}=buildRoutineEntities({ids:['manana-para-salir']});
  assert.equal(report.routine_ids,1);
  assert.equal(report.entities,2);
  assert.equal(report.step_references,8);
  assert.deepEqual(report.requested_routine_ids,['manana-para-salir']);
  assert.deepEqual(entities.map(e=>e.locale).sort(),['en','es']);
  assert.ok(entities.every(e=>e.content_id==='routine:manana-para-salir'));
});

test('R51 6C2 unknown interactive IDs do not trigger a full rebuild',()=>{
  assert.equal(buildGameEntities({ids:['not-a-game']}).entities.length,0);
  assert.equal(buildRoutineEntities({ids:['not-a-routine']}).entities.length,0);
});
