import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import freeze from '../sources/r51-r04/SOURCE_FREEZE.json' with { type: 'json' };
import inventory from '../sources/r51-r04/EDITORIAL_INVENTORY.json' with { type: 'json' };

test('R51 block 1 pins the observed A2 head/tree and immutable R03 base', () => {
  assert.equal(freeze.schema, 'R51_A9_SOURCE_FREEZE/1.0');
  const tree=execFileSync('git',['show','-s','--format=%T',freeze.canonical_web_source.head],{encoding:'utf8'}).trim();
  assert.equal(tree, freeze.canonical_web_source.tree);
  assert.equal(freeze.base_library.version,'sabik-es-en-20260927-r03-9216eeee6a32');
  assert.equal(freeze.base_library.immutable,true);
});
test('R51 block 1 reconciles the approved child-safe inventory to exactly 965 records', () => {
  assert.equal(inventory.total_records,965);
  assert.equal(Object.values(inventory.domains).reduce((a,b)=>a+b,0),965);
  assert.deepEqual(inventory.domains,{condition:226,situation:223,everyday_life:62,data:60,research:132,support_directory_es:262});
  assert.equal(Object.values(inventory.sensitivity).reduce((a,b)=>a+b,0),965);
  assert.equal(Object.values(inventory.discovery).reduce((a,b)=>a+b,0),965);
  assert.equal(freeze.child_safe_source.records, inventory.total_records);
  assert.equal(freeze.child_safe_source.sha256, inventory.source_package_sha256);
});
