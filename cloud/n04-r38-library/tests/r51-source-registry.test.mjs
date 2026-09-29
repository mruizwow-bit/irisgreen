import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import registry from '../library-source-registry.json' with { type: 'json' };
import freeze from '../sources/r51-r04/SOURCE_FREEZE.json' with { type: 'json' };
import inventory from '../sources/r51-r04/EDITORIAL_INVENTORY.json' with { type: 'json' };

test('R51 source registry covers every required library domain once', () => {
  const names=registry.domains.map(d=>d.domain);
  assert.equal(new Set(names).size,names.length);
  assert.deepEqual(names,[
    'conditions','situations','everyday_life','data','research','support_directory',
    'games','routines','interests','workshop','quiet_space','home'
  ]);
  assert.match(registry.canonical_source.source_sha,/^[a-f0-9]{40}$/);
  assert.match(registry.canonical_source.source_tree,/^[a-f0-9]{40}$/);
  assert.match(freeze.canonical_web_source.head,/^[a-f0-9]{40}$/);
  assert.match(freeze.canonical_web_source.tree,/^[a-f0-9]{40}$/);
  assert.equal(registry.canonical_source.update_mode,'CONFIGURED_CANONICAL_ONLY');
});
test('R51 registry pins approved editorial counts for the six canonical content domains', () => {
  const expected={conditions:226,situations:223,everyday_life:62,data:60,research:132,support_directory:262};
  for(const [domain,count] of Object.entries(expected)){
    const row=registry.domains.find(d=>d.domain===domain);
    assert.equal(row.expected_records,count);
  }
  assert.equal(Object.values(expected).reduce((a,b)=>a+b,0), inventory.total_records);
});
test('R51 git-backed registry sources exist at the frozen A2 source SHA', () => {
  for(const row of registry.domains.filter(d=>d.source_kind==='git')){
    for(const path of row.source_files){
      execFileSync('git',['cat-file','-e',registry.canonical_source.source_sha+':'+path],{stdio:'ignore'});
    }
    assert.equal(row.last_source_sha,registry.canonical_source.source_sha);
  }
});
test('R51 support directory remains Spanish source-only instead of silent translation', () => {
  const support=registry.domains.find(d=>d.domain==='support_directory');
  assert.deepEqual(support.locales,['es']);
  assert.equal(support.source_language,'es');
  assert.equal(support.allow_cross_locale_retrieval,true);
});
