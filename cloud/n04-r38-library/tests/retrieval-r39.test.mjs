import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { RELEASE, BINDING, LibraryError, createManifest, loadLibrary } from '../src/library.mjs';
import { createSabikRetrievalAdapter, SabikRetrievalError, retrievalFailureCode } from '../src/sabik-retrieval.mjs';
import { createSabikRetrievalForDeployment } from '../src/sabik-retrieval-server.mjs';
import { createRetrievalOnlyCaller } from './support/retrieval-only-caller.mjs';

const raw = await readFile(new URL('../../n04-r26-staging-binding/source/iris-fragments-index.es.json', import.meta.url));
const corpus = JSON.parse(raw);
const originalById = new Map(corpus.fragments.map(f => [f.id, f]));
const manifest = createManifest({ build_head: 'a'.repeat(40), build_tree: 'b'.repeat(40), engine_sha256: 'c'.repeat(64) });
const manifestBytes = Buffer.from(JSON.stringify(manifest));
const store = { get: async key => key === BINDING.manifestKey ? manifestBytes : key === BINDING.corpusKey ? raw : null };
const library = await loadLibrary(store);
const adapter = createSabikRetrievalAdapter({ readLibrary: async () => library });
const fixtures = JSON.parse(await readFile(new URL('fixtures/retrieval-r39.json', import.meta.url), 'utf8'));
const candidateKeys = ['concepts', 'fragment_id', 'heading', 'library_version', 'score', 'snippet', 'source_type', 'title', 'url'];
const rejectsCode = (promise, code) => assert.rejects(promise, error => {
  assert.ok(error instanceof SabikRetrievalError); assert.equal(error.code, code);
  assert.equal(error.message, code); assert.equal(error.cause, undefined); return true;
});

for (const fixture of fixtures.cases) {
  test(`golden R38 ranking and complete citations: ${fixture.id}`, async () => {
    const actual = await adapter.retrieveForSabik(fixture.request);
    assert.equal(actual.library_version, RELEASE.version);
    assert.deepEqual(Object.keys(actual).sort(), ['candidates', 'library_version']);
    assert.deepEqual(actual.candidates.map(({ fragment_id, score, url }) => ({ fragment_id, score, url })), fixture.expected);
    for (const c of actual.candidates) {
      assert.deepEqual(Object.keys(c).sort(), candidateKeys);
      const f = originalById.get(c.fragment_id); assert.ok(f);
      assert.equal(c.library_version, RELEASE.version); assert.equal(c.url, f.url);
      assert.equal(c.snippet, f.text.slice(0, 480)); assert.equal(c.title, f.title); assert.equal(c.heading, f.heading);
      assert.equal(c.source_type, f.source_type); assert.deepEqual(c.concepts, f.concepts);
    }
  });
}
test('deterministic repeated requests and canonically equivalent accents', async () => {
  const expected = await adapter.retrieveForSabik({ query: 'atención educación' });
  for (let i = 0; i < 8; i++) assert.deepEqual(await adapter.retrieveForSabik({ query: 'ATENCIO\u0301N   EDUCACIO\u0301N' }), expected);
});
test('normalization and defaults reach the unchanged library engine', async () => {
  let captured;
  const inspect = createSabikRetrievalAdapter({ readLibrary: async ({ version }) => {
    assert.equal(version, RELEASE.version);
    return { ...library, searchLibrary: request => { captured = request; return library.searchLibrary(request); } };
  } });
  await inspect.retrieveForSabik({ query: '  ATENCIÓN\t\nEducación  ' });
  assert.deepEqual(captured, { query: 'atencion educacion', limit: 5, filters: {}, version: RELEASE.version });
});
test('300-character boundary accepted and no-result envelope remains versioned', async () => {
  const result = await adapter.retrieveForSabik({ query: 'x'.repeat(300) });
  assert.deepEqual(result, { library_version: RELEASE.version, candidates: [] });
});

const invalidCases = [
  ['missing input', undefined], ['null', null], ['array input', []], ['missing query', {}],
  ['non-string query', { query: 42 }], ['empty', { query: '' }], ['whitespace', { query: ' \t\n ' }],
  ['punctuation-only', { query: '!!!' }], ['too long', { query: 'x'.repeat(301) }],
  ['too many terms', { query: Array.from({length: 33}, (_,i) => `t${i}`).join(' ') }],
  ['limit zero', { query: 'apoyos', limit: 0 }], ['limit 21', { query: 'apoyos', limit: 21 }],
  ['fractional limit', { query: 'apoyos', limit: 1.5 }], ['string limit', { query: 'apoyos', limit: '5' }],
  ['NaN limit', { query: 'apoyos', limit: NaN }], ['null filters', { query: 'apoyos', filters: null }],
  ['unsupported filter', { query: 'apoyos', filters: { language: 'es' } }],
  ['bad filter type', { query: 'apoyos', filters: { source_type: [] } }],
  ['bad concepts type', { query: 'apoyos', filters: { concepts: 'ruido' } }],
  ['sparse concepts', { query: 'apoyos', filters: { concepts: Array(1) } }],
  ['too many concepts', { query: 'apoyos', filters: { concepts: Array(11).fill('ruido') } }],
  ['null version', { query: 'apoyos', libraryVersion: null }],
  ['profile not accepted', { query: 'apoyos', profile: {} }],
  ['history not accepted', { query: 'apoyos', history: ['private'] }],
  ['voice not accepted', { query: 'apoyos', voice: 'private' }],
  ['getter not executed', { get query() { assert.fail('getter invoked'); } }],
];
for (const [label, input] of invalidCases) {
  test(`malformed request rejected before storage: ${label}`, async () => {
    const guard = createSabikRetrievalAdapter({ readLibrary: () => assert.fail('Invalid request reached storage') });
    await rejectsCode(guard.retrieveForSabik(input), 'INVALID_RETRIEVAL_QUERY');
  });
}
test('unsupported version fails before storage', async () => {
  const guard = createSabikRetrievalAdapter({ readLibrary: () => assert.fail('Version mismatch reached storage') });
  await rejectsCode(guard.retrieveForSabik({ query: 'apoyos', libraryVersion: 'future' }), 'LIBRARY_VERSION_MISMATCH');
});
test('exact lookup produces the frozen fragment citation without inventing a lexical score', async () => {
  const original = corpus.fragments[0];
  const result = await adapter.getFragmentForSabik({ fragmentId: original.id });
  assert.equal(result.library_version, RELEASE.version); assert.equal(result.candidate.fragment_id, original.id);
  assert.equal(result.candidate.url, original.url); assert.equal(result.candidate.snippet, original.text.slice(0,480));
  assert.equal(result.candidate.score, null);
});
test('missing exact fragment returns null; malformed ID rejected', async () => {
  assert.deepEqual(await adapter.getFragmentForSabik({ fragmentId: 'no-such-fragment' }), { library_version: RELEASE.version, candidate: null });
  await rejectsCode(adapter.getFragmentForSabik({ fragmentId: '' }), 'INVALID_RETRIEVAL_QUERY');
  await rejectsCode(adapter.getFragmentForSabik({ fragmentId: 'x'.repeat(513) }), 'INVALID_RETRIEVAL_QUERY');
  await rejectsCode(adapter.getFragmentForSabik({ fragmentId: corpus.fragments[0].id, libraryVersion: 'old' }), 'LIBRARY_VERSION_MISMATCH');
});
test('snapshot input filters before storage await; caller mutations cannot alter retrieval', async () => {
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  const slow = createSabikRetrievalAdapter({ readLibrary: async () => { await gate; return library; } });
  const request = { query: 'ruido', filters: { concepts: ['ruido'] }, limit: 2 };
  const expected = await adapter.retrieveForSabik(request);
  const pending = slow.retrieveForSabik(request);
  request.query = 'different'; request.filters.concepts[0] = 'changed'; request.limit = 20;
  release(); assert.deepEqual(await pending, expected);
});
test('result objects and concept arrays are immutable and independent of subsequent requests', async () => {
  const result = await adapter.retrieveForSabik({ query: 'ruido' });
  assert.throws(() => { result.candidates[0].url = 'https://invented.invalid'; });
  assert.throws(() => result.candidates[0].concepts.push('changed'));
  assert.throws(() => result.candidates.pop());
  assert.deepEqual(await adapter.retrieveForSabik({ query: 'ruido' }), result);
});

const errorMappings = [
  ['manifest_missing', 'LIBRARY_UNAVAILABLE'], ['corpus_missing', 'LIBRARY_UNAVAILABLE'],
  ['storage_unavailable', 'LIBRARY_UNAVAILABLE'], ['invalid_deploy_context', 'LIBRARY_UNAVAILABLE'],
  ['wrong_version', 'LIBRARY_VERSION_MISMATCH'], ['corpus_integrity_mismatch', 'LIBRARY_INTEGRITY_ERROR'],
  ['duplicate_fragment_id', 'LIBRARY_INTEGRITY_ERROR'], ['corpus_count_or_metadata_mismatch', 'LIBRARY_INTEGRITY_ERROR'],
  ['manifest_identity_mismatch', 'LIBRARY_INTEGRITY_ERROR'], ['invalid_blob_json', 'LIBRARY_INTEGRITY_ERROR'],
  ['invalid_provenance', 'LIBRARY_INTEGRITY_ERROR'], ['invalid_query', 'INVALID_RETRIEVAL_QUERY'],
  ['invalid_limit', 'INVALID_RETRIEVAL_QUERY'], ['invalid_filters', 'INVALID_RETRIEVAL_QUERY'],
];
for (const [internal, expected] of errorMappings) {
  test(`explicit safe error mapping: ${internal}`, async () => {
    const broken = createSabikRetrievalAdapter({ readLibrary: async () => { throw new LibraryError(internal); } });
    await rejectsCode(broken.retrieveForSabik({ query: 'apoyos' }), expected);
  });
}
test('unexpected storage exception and foreign error-code object expose no details', async () => {
  for (const error of [new Error('private storage URL and query must not escape'), { code: 'wrong_version', private: 'not allowed' }]) {
    const broken = createSabikRetrievalAdapter({ readLibrary: async () => { throw error; } });
    await rejectsCode(broken.retrieveForSabik({ query: 'apoyos' }), 'LIBRARY_UNAVAILABLE');
    assert.equal(retrievalFailureCode(error), 'LIBRARY_UNAVAILABLE');
  }
});
test('real loader failures traverse the adapter closed, without partial candidates', async () => {
  const corrupt = Buffer.from(raw); corrupt[20] ^= 1;
  for (const [values, expected] of [
    [{ [BINDING.manifestKey]: null }, 'LIBRARY_UNAVAILABLE'],
    [{ [BINDING.manifestKey]: manifestBytes, [BINDING.corpusKey]: null }, 'LIBRARY_UNAVAILABLE'],
    [{ [BINDING.manifestKey]: manifestBytes, [BINDING.corpusKey]: corrupt }, 'LIBRARY_INTEGRITY_ERROR'],
  ]) {
    const broken = createSabikRetrievalAdapter({ readLibrary: () => loadLibrary({ get: async key => values[key] ?? null }) });
    await rejectsCode(broken.retrieveForSabik({ query: 'apoyos' }), expected);
  }
});
test('candidate corruption, unknown IDs, changed URLs, duplicate IDs and excess results fail closed', async () => {
  const good = library.searchLibrary({ query: 'sensorial', limit: 2 });
  const alterations = [
    [ { ...good[0], fragment_id: 'fabricated-id' } ],
    [ { ...good[0], url: 'https://irisgreen.eu/fabricated' } ],
    [ { ...good[0], snippet: 'invented excerpt' } ],
    [ { ...good[0], library_version: 'old' } ],
    [ { ...good[0], score: NaN } ],
    [ { ...good[0], concepts: ['invented'] } ],
    [ good[0], good[0] ], [ good[0], good[1], good[0] ],
  ];
  for (const candidates of alterations) {
    const broken = createSabikRetrievalAdapter({ readLibrary: async () => ({ ...library, searchLibrary: () => candidates }) });
    await rejectsCode(broken.retrieveForSabik({ query: 'sensorial', limit: 2 }), 'LIBRARY_INTEGRITY_ERROR');
  }
});
test('runtime composition binds accepted deployment and caches index, never query/result', async () => {
  let reads = 0; const contexts = [];
  const connected = createSabikRetrievalForDeployment({ libraryDeployId: '6ab4c1a15435b93043ab3f6d', storeFactory: options => {
    contexts.push(options); return { get: async key => { reads++; return store.get(key); } };
  } });
  const [a, b] = await Promise.all([connected.retrieveForSabik({ query: 'apoyos' }), connected.retrieveForSabik({ query: 'sensorial' })]);
  assert.ok(a.candidates.length && b.candidates.length); assert.notDeepEqual(a, b);
  await connected.getFragmentForSabik({ fragmentId: corpus.fragments[0].id });
  assert.equal(reads, 2); assert.equal(contexts.length, 1);
  assert.deepEqual(contexts[0], { name: BINDING.store, region: BINDING.region, deployID: '6ab4c1a15435b93043ab3f6d', consistency: 'strong' });
  assert.throws(() => createSabikRetrievalForDeployment({ libraryDeployId: 'user-provided-invalid' }), /LIBRARY_UNAVAILABLE/);
});
test('no-op response caller consumes retrieval only and emits no generated answer', async () => {
  const caller = createRetrievalOnlyCaller({ retrieval: adapter });
  const result = await caller.run({ query: 'apoyos', limit: 2 });
  assert.equal(result.phase, 'retrieval_only'); assert.equal(result.response, null);
  assert.equal(result.sources.candidates.length, 2);
});
test('no-op caller has no fallback response when retrieval fails', async () => {
  const caller = createRetrievalOnlyCaller({ retrieval: createSabikRetrievalAdapter({ readLibrary: async () => { throw new Error('offline'); } }) });
  await rejectsCode(caller.run({ query: 'apoyos' }), 'LIBRARY_UNAVAILABLE');
});
test('successful and failed requests emit no query or application log', async t => {
  const logs = [];
  for (const name of ['log', 'info', 'warn', 'error', 'debug']) t.mock.method(console, name, (...args) => logs.push(args));
  await adapter.retrieveForSabik({ query: 'unique-in-memory-query-marker' });
  await rejectsCode(adapter.retrieveForSabik({ query: '', history: ['private-marker'] }), 'INVALID_RETRIEVAL_QUERY');
  const failed = createSabikRetrievalAdapter({ readLibrary: () => { throw new Error('private-marker'); } });
  await rejectsCode(failed.retrieveForSabik({ query: 'private-marker' }), 'LIBRARY_UNAVAILABLE');
  assert.deepEqual(logs, []);
});
test('adapter dependency graph adds no provider, logging, persistence or HTTP activation', async () => {
  const files = ['src/sabik-retrieval.mjs', 'src/sabik-retrieval-server.mjs'];
  const code = (await Promise.all(files.map(f => readFile(new URL('../'+f, import.meta.url), 'utf8')))).join('\n');
  assert.doesNotMatch(code, /console\.|node:fs|writeFile|appendFile|localStorage|store\.(set|setJSON|delete)\s*\(|context\.ip|context\.geo|fetch\(|\/api\/chat|openai|anthropic|embedding/i);
  const externals = [...code.matchAll(/from ['"]([^.'"][^'"]*)['"]/g)].map(m => m[1]);
  assert.deepEqual(externals, ['@netlify/blobs']);
  // R04 adds one disabled relay; the adapter itself acquires no HTTP dependency.
  assert.deepEqual((await readdir(new URL('../netlify/functions/', import.meta.url))).sort(), ['n04-library-qa.mjs', 'n04-team-transport.mjs']);
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.deepEqual(pkg.dependencies, { '@netlify/blobs': '11.1.0' });
});
