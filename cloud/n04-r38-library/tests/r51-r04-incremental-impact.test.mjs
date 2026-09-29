import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { planIncrementalImpact } from '../src/r04/incremental-impact.mjs';

const registry=JSON.parse(readFileSync(new URL('../library-source-registry.json',import.meta.url),'utf8'));

test('fixture 9 CSS-only => NO_CONTENT_CHANGE',()=>{
  const p=planIncrementalImpact(registry,['assets/site-v23.css']);
  assert.equal(p.status,'NO_CONTENT_CHANGE');
  assert.deepEqual(p.affected_domains,[]);
  assert.equal(p.rebuild_required,false);
});
test('fixture 10 UI-only JS => NO_CONTENT_CHANGE',()=>{
  const p=planIncrementalImpact(registry,['assets/rincon-r42.js']);
  assert.equal(p.status,'NO_CONTENT_CHANGE');
  assert.deepEqual(p.affected_domains,[]);
});
test('game dataset change rebuilds only Games',()=>{
  const p=planIncrementalImpact(registry,['assets/data/juegos-iris-data.js']);
  assert.equal(p.status,'CONTENT_CHANGE');
  assert.deepEqual(p.affected_domains,['games']);
});
test('condition route file change rebuilds Conditions',()=>{
  const p=planIncrementalImpact(registry,['es/neurodiversidad/condiciones/autismo/index.html']);
  assert.deepEqual(p.affected_domains,['conditions']);
});
test('global age manifest rebuilds the six 965 editorial domains only',()=>{
  const p=planIncrementalImpact(registry,['assets/safety/age-classification-r51-global.json']);
  assert.deepEqual(p.affected_domains,[
    'conditions','data','everyday_life','research','situations','support_directory'
  ]);
  for(const d of p.affected_domains) assert.ok(p.reasons[d].some(x=>x.reason==='AGE_CHANGED'));
});
test('global safety snapshot rebuilds the six 965 editorial domains',()=>{
  const p=planIncrementalImpact(registry,['cloud/n04-r38-library/sources/r51-r04/package/content-safety-snapshot.json']);
  assert.equal(p.affected_domains.length,6);
  for(const d of p.affected_domains) assert.ok(p.reasons[d].some(x=>x.reason==='SAFETY_CHANGED'||x.reason==='SOURCE_FILE'));
});
test('Home root change affects Home but does not make root prefix match everything',()=>{
  assert.deepEqual(planIncrementalImpact(registry,['index.html']).affected_domains,['home']);
  assert.equal(planIncrementalImpact(registry,['assets/random.js']).affected_domains.includes('home'),false);
});
test('mixed UI and content change ignores UI and rebuilds only matching content domain',()=>{
  const p=planIncrementalImpact(registry,['assets/site-v23.css','assets/data/r42-routine-download-manifest.json']);
  assert.deepEqual(p.affected_domains,['routines']);
  assert.ok(p.ignored_paths.includes('assets/site-v23.css'));
});
