import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const gate=JSON.parse(readFileSync(new URL('../sources/r51-r04/home/SOURCE_GATE.json',import.meta.url),'utf8'));

test('R51 5F rejects the currently visible pre-v4 Home as a Cloud source',()=>{
  assert.equal(gate.observed_a2.status,'HUMAN_QA_FAIL_HOME_NOT_CANONICAL');
  assert.equal(gate.observed_a2.head,'7820dcb1ae331804cbb6e8d087c931cd67178ffa');
  assert.equal(gate.stale_home_entities_allowed,0);
  assert.equal(gate.candidate_active,false);
});

test('R51 5F pins the only accepted Home donor identity and delivery gate',()=>{
  assert.equal(gate.authority.required_donor,'Home Iris Green v4.dc.html');
  assert.equal(gate.authority.required_donor_sha256,'25e0e9b2ff96b7d629104ac1c55177f733920a882a194ebe04731206bf14f82c');
  assert.equal(gate.authority.required_marker,'A2_HOME_V4_NAVY_DEPLOY_PREVIEW_READY_FOR_ASTRA_MARIA');
});

test('R51 5F requires canonical ES/EN and age source before indexing Home',()=>{
  assert.ok(gate.unblock_when.some(x=>x.includes('ES/EN')));
  assert.ok(gate.unblock_when.some(x=>x.includes('965/965')));
  assert.ok(gate.unblock_when.some(x=>x.includes('Deploy Preview')));
});
