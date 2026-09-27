import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import release from '../build/library-v2/release.json' with { type: 'json' };
import {
  CloudLibraryError, createCloudManifest, verifyCloudManifest, verifyCloudCorpus,
  validateCloudCorpusStructure, loadCloudLibrary, createCachedCloudReader
} from '../src/cloud-library-v2.mjs';
import { groupSources } from '../src/source-groups.mjs';
import { RELEASE as R38_RELEASE } from '../src/library.mjs';

const corpusPath = new URL('../build/library-v2/' + release.corpus_key.replace(/^cloud-library\//, ''), import.meta.url);
const corpusBytes = await readFile(corpusPath);
const corpus = JSON.parse(corpusBytes.toString('utf8'));
const approvedSafety = JSON.parse(await readFile(new URL('../sources/a9-r02/approved-safe-variants.json', import.meta.url), 'utf8'));
const approvedById = new Map(approvedSafety.records.map(record => [record.content_id, record]));
const normalizeSafetyText = value => String(value || '').normalize('NFKC').replace(/\\s+/g, ' ').trim();
const provenance = { build_head: 'a'.repeat(40), build_tree: 'b'.repeat(40), engine_sha256: 'c'.repeat(64) };
const manifest = createCloudManifest(release, provenance);
const manifestBytes = Buffer.from(JSON.stringify(manifest) + '\n');

function ab(buffer) {
  const b = Buffer.from(buffer);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
function memoryStore({ manifestValue = manifestBytes, corpusValue = corpusBytes } = {}) {
  return {
    async get(key) {
      if (key === release.manifest_key) return ab(manifestValue);
      if (key === release.corpus_key) return ab(corpusValue);
      return null;
    }
  };
}
const expectCode = (fn, code) => assert.throws(fn, error => error instanceof CloudLibraryError && error.code === code);

test('A9 release is bilingual, versioned and R38 identity remains intact', () => {
  assert.match(release.version, /^sabik-es-en-20260927-r02-[a-f0-9]{12}$/);
  assert.equal(release.approved_child_safe_package_sha256, approvedSafety.source_package_sha256);
  assert.equal(release.approved_safe_variants_sha256, approvedSafety.source_safe_variants_sha256);
  assert.equal(release.fragment_count, 1208);
  assert.deepEqual(release.locale_counts, { es: 604, en: 604 });
  assert.equal(release.full_s2_count, 30);
  assert.equal(release.safe_variant_count, 30);
  assert.equal(R38_RELEASE.count, 4332);
  assert.equal(R38_RELEASE.sha256, '56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e');
});

test('manifest verifies and altered identity fails closed', () => {
  assert.equal(verifyCloudManifest(manifest, release).version, release.version);
  const bad = structuredClone(manifest); bad.source_commit = '0'.repeat(40);
  expectCode(() => verifyCloudManifest(bad, release), 'manifest_identity_mismatch');
});

test('corpus hash verifies and altered bytes fail closed', () => {
  assert.equal(verifyCloudCorpus(corpusBytes, release).fragment_count, release.fragment_count);
  const bad = Buffer.from(corpusBytes); bad[Math.floor(bad.length / 2)] ^= 1;
  expectCode(() => verifyCloudCorpus(bad, release), 'corpus_integrity_mismatch');
});

test('duplicate fragment ids fail closed structurally', () => {
  const copy = structuredClone(corpus);
  copy.fragments[1].fragment_id = copy.fragments[0].fragment_id;
  expectCode(() => validateCloudCorpusStructure(copy, release), 'duplicate_fragment_id');
});

test('ES retrieval returns ES sources and citable identity', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  const results = library.searchLibrary({ query: 'supermercado', locale: 'es', context: 'default', limit: 5 });
  assert.ok(results.length > 0);
  assert.ok(results.every(r => r.locale === 'es' && r.url.startsWith('https://irisgreen.eu/es/')));
  assert.ok(results.every(r => r.citation.fragment_id === r.fragment_id && r.citation.locale === 'es'));
});

test('EN retrieval returns EN sources without silent mixing', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  const results = library.searchLibrary({ query: 'supermarket', locale: 'en', context: 'default', limit: 5 });
  assert.ok(results.length > 0);
  assert.ok(results.every(r => r.locale === 'en'));
  assert.ok(results.every(r => r.citation.locale === 'en'));
});

test('zero-result query is a stable empty array', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  assert.deepEqual(library.searchLibrary({ query: 'zzzzqvwxnonexistent', locale: 'es' }), []);
});

test('wrong version fails closed with no fallback', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  expectCode(() => library.searchLibrary({ query: 'autismo', locale: 'es', version: 'wrong' }), 'wrong_version');
});

for (const context of ['default', 'child', 'teen']) {
  test(context + ' blocks full S2 before ranking and keeps safe variant', async () => {
    const library = await loadCloudLibrary(memoryStore(), release);
    const results = library.searchLibrary({ query: 'anorexia', locale: 'es', context, limit: 20 });
    assert.ok(results.some(r => r.source_type === 'safe_variant'));
    assert.ok(results.every(r => r.sensitivity !== 'S2_HIGH_SENSITIVITY'));
  });
}

test('adult without explicit intent still blocks full S2', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  const results = library.searchLibrary({ query: 'anorexia', locale: 'es', context: 'adult', limit: 20 });
  assert.ok(results.length > 0);
  assert.ok(results.every(r => r.sensitivity !== 'S2_HIGH_SENSITIVITY'));
});

test('adult plus explicit intent can retrieve allowed full S2', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  const results = library.searchLibrary({ query: 'anorexia', locale: 'es', context: 'adult', explicitIntent: true, limit: 20 });
  assert.ok(results.some(r => r.sensitivity === 'S2_HIGH_SENSITIVITY'));
});

test('every S2 safe variant is exact reviewed R42 copy and never relabelled full text', () => {
  const fullS2 = corpus.fragments.filter(f => f.sensitivity === 'S2_HIGH_SENSITIVITY' && f.source_type !== 'safe_variant');
  assert.equal(fullS2.length, 30);
  for (const full of fullS2) {
    const safe = corpus.fragments.find(f => f.fragment_id === full.safe_variant_id);
    assert.ok(safe, 'safe variant missing for ' + full.fragment_id);
    assert.equal(safe.source_type, 'safe_variant');
    assert.equal(safe.derived_from_fragment_id, full.fragment_id);
    assert.equal(safe.locale, full.locale);
    assert.equal(safe.content_id, full.content_id);
    assert.equal(safe.editorial_status, 'R42_HUMAN_REVIEWED_SAFE_VARIANT');
    const approval = approvedById.get(safe.safety_content_id);
    assert.ok(approval, 'reviewed approval missing for ' + safe.fragment_id);
    const variant = approvedSafety.variants[approval.safe_variant_group][safe.locale];
    assert.equal(safe.heading, variant.heading);
    assert.equal(safe.text, variant.summary + '\n' + variant.help);
    assert.equal(safe.source_sha256, approvedSafety.source_safe_variants_sha256);
    assert.equal(safe.source_path, approvedSafety.source_safe_variants_path);
    assert.notEqual(normalizeSafetyText(safe.text), normalizeSafetyText(full.text));
  }
});

test('duplicate EN Data titles use their canonical source slugs and research EN cites EN route', () => {
  const employment = corpus.fragments
    .filter(f => f.locale === 'en' && f.source_type === 'data' && f.title === 'Employment and autism')
    .map(f => f.url).sort();
  assert.deepEqual(employment, [
    'https://irisgreen.eu/en/data/employment-and-autism-australia/',
    'https://irisgreen.eu/en/data/employment-and-autism-united-kingdom/'
  ]);
  const researchEn = corpus.fragments.filter(f => f.locale === 'en' && f.source_type === 'research');
  assert.ok(researchEn.length > 0);
  assert.ok(researchEn.every(f => /^https:\/\/irisgreen\.eu\/en\/research\/#study-\d+$/.test(f.url)));
});

test('R39 presentation grouping preserves every ranked fragment id', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  const results = library.searchLibrary({ query: 'autismo', locale: 'es', context: 'default', limit: 20 });
  const groups = groupSources(results);
  const groupedIds = groups.flatMap(g => g.citations.map(c => c.fragment_id));
  assert.deepEqual([...groupedIds].sort(), results.map(r => r.fragment_id).sort());
});

test('concurrent cold readers perform a single deployment store load', async () => {
  let stores = 0;
  const reader = createCachedCloudReader(() => { stores++; return memoryStore(); }, release);
  const deployId = 'd'.repeat(24);
  const [a, b, c] = await Promise.all([
    reader({ deployId, version: release.version }),
    reader({ deployId, version: release.version }),
    reader({ deployId, version: release.version })
  ]);
  assert.equal(stores, 1);
  assert.equal(a, b); assert.equal(b, c);
});

test('query and locale limits fail closed', async () => {
  const library = await loadCloudLibrary(memoryStore(), release);
  expectCode(() => library.searchLibrary({ query: 'a'.repeat(301), locale: 'es' }), 'invalid_query');
  expectCode(() => library.searchLibrary({ query: 'autismo', locale: 'fr' }), 'invalid_locale');
  expectCode(() => library.searchLibrary({ query: 'autismo', locale: 'es', limit: 21 }), 'invalid_limit');
});

test('local cold and warm performance evidence is measured separately', async t => {
  const coldStart = performance.now();
  const library = await loadCloudLibrary(memoryStore(), release);
  const coldMs = performance.now() - coldStart;
  const samples = [];
  for (let i = 0; i < 100; i++) {
    const start = performance.now();
    library.searchLibrary({ query: i % 2 ? 'autismo apoyo' : 'sensory support', locale: i % 2 ? 'es' : 'en', context: 'default', limit: 5 });
    samples.push(performance.now() - start);
  }
  samples.sort((a, b) => a - b);
  const p95 = samples[Math.floor(samples.length * 0.95) - 1];
  t.diagnostic(JSON.stringify({ local_cold_load_ms: +coldMs.toFixed(2), local_warm_p95_ms: +p95.toFixed(2), heap_used_mb: +(process.memoryUsage().heapUsed / 1048576).toFixed(2) }));
  assert.ok(Number.isFinite(coldMs) && Number.isFinite(p95));
});
