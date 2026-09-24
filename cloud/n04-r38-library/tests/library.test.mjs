import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { RELEASE, BINDING, digest, verifyCorpus, validateCorpusStructure, createManifest, verifyManifest, loadLibrary, createCachedReader } from '../src/library.mjs';
import { createQAHandler } from '../src/qa-handler.mjs';
import { immutablePut } from '../scripts/immutable-publish.mjs';

const raw = await readFile(new URL('../../n04-r26-staging-binding/source/iris-fragments-index.es.json', import.meta.url));
const corpus = JSON.parse(raw);
const provenance = { build_head: 'a'.repeat(40), build_tree: 'b'.repeat(40), engine_sha256: 'c'.repeat(64) };
const manifest = createManifest(provenance);
function storeWith(overrides = {}) {
  const values = { [BINDING.manifestKey]: Buffer.from(JSON.stringify(manifest)), [BINDING.corpusKey]: raw, ...overrides };
  const reads = [];
  return { reads, get: async (key, options) => { reads.push(key); assert.equal(options.consistency, 'strong'); return values[key] ?? null; },
    set: () => assert.fail('Runtime write'), delete: () => assert.fail('Runtime delete') };
}
const start = performance.now(); const heapBefore = process.memoryUsage().heapUsed;
const library = await loadLibrary(storeWith());
const coldMs = performance.now() - start;
const heapDelta = process.memoryUsage().heapUsed - heapBefore;

test('exact byte hash and 4332 unique identities', () => {
  assert.equal(raw.length, RELEASE.bytes); assert.equal(digest(raw), RELEASE.sha256);
  assert.equal(verifyCorpus(raw).fragments.length, 4332);
  assert.equal(new Set(corpus.fragments.map(f => f.id)).size, 4332);
});
test('manifest binds source date, blob, engine, exact bytes and named store', () => {
  assert.equal(verifyManifest(manifest), manifest);
  for (const key of ['version', 'corpus_sha256', 'fragment_count', 'unique_ids', 'source_date', 'source_git_blob', 'corpus_key', 'store', 'region']) {
    assert.throws(() => verifyManifest({ ...manifest, [key]: 'wrong' }));
  }
  assert.throws(() => verifyManifest({ ...manifest, provenance: {} }));
});
test('structural duplicate ID rejection independent of byte guard', () => {
  const altered = structuredClone(corpus); altered.fragments[1].id = altered.fragments[0].id;
  assert.throws(() => validateCorpusStructure(altered), /duplicate_fragment_id/);
});
test('structural count and private fields rejected', () => {
  const altered = structuredClone(corpus); altered.fragments.pop();
  assert.throws(() => validateCorpusStructure(altered), /count/);
  const privateField = structuredClone(corpus); privateField.fragments[0].profile = 'not allowed';
  assert.throws(() => validateCorpusStructure(privateField), /invalid_publicable/);
});
test('non-publicable and foreign source rejected', () => {
  for (const update of [{ editorial_status: 'PRIVATE' }, { url: 'https://outside.invalid/a' }]) {
    const altered = structuredClone(corpus); Object.assign(altered.fragments[0], update);
    assert.throws(() => validateCorpusStructure(altered));
  }
});
test('corrupted exact-size and duplicate-ID serialized corpus fail closed', async () => {
  const corrupted = Buffer.from(raw); corrupted[20] ^= 1;
  await assert.rejects(loadLibrary(storeWith({ [BINDING.corpusKey]: corrupted })), /integrity/);
  const altered = structuredClone(corpus); altered.fragments[1].id = altered.fragments[0].id;
  await assert.rejects(loadLibrary(storeWith({ [BINDING.corpusKey]: Buffer.from(JSON.stringify(altered)) })));
});
test('missing manifest, missing corpus and backend error fail closed', async () => {
  await assert.rejects(loadLibrary(storeWith({ [BINDING.manifestKey]: null })), /manifest_missing/);
  await assert.rejects(loadLibrary(storeWith({ [BINDING.corpusKey]: null })), /corpus_missing/);
  await assert.rejects(loadLibrary({ get: async () => { throw new Error('private backend diagnostic'); } }), /storage_unavailable/);
});
test('manifest wrong version/count fail before corpus read', async () => {
  for (const update of [{ version: 'future' }, { fragment_count: 1 }, { unique_ids: 1 }]) {
    const store = storeWith({ [BINDING.manifestKey]: Buffer.from(JSON.stringify({ ...manifest, ...update })) });
    await assert.rejects(loadLibrary(store)); assert.deepEqual(store.reads, ['manifest.json']);
  }
});
test('wrong query version rejected', () => assert.throws(() => library.searchLibrary({ query: 'apoyos', version: 'old' }), /wrong_version/));
test('normalization and ranking are deterministic across case, accents and repeated terms', () => {
  const expected = library.searchLibrary({ query: 'atención EDUCACIÓN' });
  assert.ok(expected.length);
  assert.deepEqual(library.searchLibrary({ query: 'educacion atencion atencion' }), expected);
  for (let i = 0; i < 10; i++) assert.deepEqual(library.searchLibrary({ query: 'atención EDUCACIÓN' }), expected);
});
test('independent reference ranking and tie order match inverted index', () => {
  const token = 'sensorial';
  const normalize = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const reference = corpus.fragments.map(f => ({ id: f.id, score:
    [[f.text, 1], [f.title, 4], [f.heading, 3], [f.concepts.join(' '), 3]].reduce((sum, [s, w]) => sum + (normalize(s).includes(token) ? w : 0), 0) }))
    .filter(x => x.score).map(x => ({ ...x, score: x.score + 100 }))
    .sort((a, b) => b.score - a.score || (a.id < b.id ? -1 : 1)).slice(0, 20);
  assert.deepEqual(library.searchLibrary({ query: token, limit: 20 }).map(r => ({ id: r.fragment_id, score: r.score })), reference);
});
test('citations and snippets derive exclusively from exact frozen fragments', () => {
  for (const query of ['sobrecarga sensorial', 'lectura fácil', 'apoyos trabajo']) {
    const results = library.searchLibrary({ query, limit: 20 }); assert.ok(results.length);
    for (const r of results) {
      const original = corpus.fragments.find(f => f.id === r.fragment_id);
      assert.ok(original); assert.equal(r.url, original.url); assert.equal(r.library_version, RELEASE.version);
      assert.equal(r.snippet, original.text.slice(0, 480)); assert.equal(r.title, original.title);
      assert.equal(r.editorial_status, 'PUBLICABLE'); assert.ok(r.score > 0);
    }
  }
});
test('exact fragment lookup and immutable records', () => {
  const fragment = library.getFragment(corpus.fragments[0].id); assert.deepEqual(fragment, corpus.fragments[0]);
  assert.equal(library.getFragment('not-a-real-id'), null);
  assert.throws(() => { fragment.text = 'changed'; });
  assert.throws(() => { fragment.concepts.push('changed'); });
  assert.equal(library.corpus, undefined);
});
test('metadata filters match independently filtered full corpus', () => {
  const first = library.searchLibrary({ query: 'apoyos', limit: 20 })[0];
  for (const filters of [{ source_type: first.source_type }, { url: first.url }, { editorial_status: 'PUBLICABLE' }, { editorial_status: 'PRIVATE' }, { concepts: ['not-a-real-concept'] }]) {
    const hits = library.searchLibrary({ query: 'apoyos', limit: 20, filters });
    const expected = corpus.fragments.filter(f => Object.entries(filters).every(([k, v]) => k === 'concepts' ? v.every(c => f.concepts.includes(c)) : f[k] === v));
    assert.ok(hits.every(r => expected.some(f => f.id === r.fragment_id)));
    if (filters.editorial_status === 'PRIVATE' || filters.concepts) assert.equal(hits.length, 0);
    else assert.ok(hits.length);
  }
  const withConcept = corpus.fragments.find(f => f.concepts.length && f.text);
  if (withConcept) {
    const hits = library.searchLibrary({ query: withConcept.text.slice(0, 150), filters: { concepts: [withConcept.concepts[0]] } });
    assert.ok(hits.length); assert.ok(hits.every(h => h.concepts.includes(withConcept.concepts[0])));
  }
});
test('result limits and invalid requests', () => {
  assert.equal(library.searchLibrary({ query: 'apoyos', limit: 1 }).length, 1);
  assert.equal(library.searchLibrary({ query: 'apoyos', limit: 20 }).length, 20);
  assert.deepEqual(library.searchLibrary({ query: 'qzxvunknownterm' }), []);
  for (const args of [{ query: '' }, { query: 'x'.repeat(301) }, { query: 'x', limit: 0 }, { query: 'x', limit: 21 }, { query: 'x', limit: 2.3 }, { query: 'x', filters: { profile: 'x' } }, { query: 'x', filters: { concepts: 'x' } }]) assert.throws(() => library.searchLibrary(args));
});
test('one cold read per immutable deployment/version; concurrent requests coalesce', async () => {
  const store = storeWith(); let calls = 0;
  const read = createCachedReader(options => { calls++; assert.equal(options.name, BINDING.store); assert.equal(options.region, BINDING.region); return store; });
  const context = { deployId: 'a'.repeat(24) };
  const [a, b] = await Promise.all([read(context), read(context)]); assert.equal(a, b);
  await read(context); assert.equal(calls, 1); assert.equal(store.reads.length, 2);
  await assert.rejects(read({ ...context, version: 'future' }), /wrong_version/); assert.equal(calls, 1);
  await read({ deployId: 'b'.repeat(24) }); assert.equal(calls, 2);
});
test('failed cache load is evicted and retried', async () => {
  let calls = 0;
  const read = createCachedReader(() => ++calls === 1 ? storeWith({ 'manifest.json': null }) : storeWith());
  await assert.rejects(read({ deployId: 'a'.repeat(24) }));
  assert.ok(await read({ deployId: 'a'.repeat(24) })); assert.equal(calls, 2);
});
test('release writes are create-only, idempotent and preserve other version keys', async () => {
  const values = new Map([['versions/old/corpus.json', Buffer.from('old version')]]);
  const store = { get: async key => values.get(key) ?? null, set: async (key, value, options) => {
    assert.equal(options.onlyIfNew, true); if (!values.has(key)) values.set(key, value);
  } };
  assert.equal(await immutablePut(store, 'versions/new/corpus.json', Buffer.from('new version')), 'created-and-readback-verified');
  assert.equal(await immutablePut(store, 'versions/new/corpus.json', Buffer.from('new version')), 'already-identical');
  await assert.rejects(immutablePut(store, 'versions/new/corpus.json', Buffer.from('mutation')), /conflict/);
  assert.equal(values.get('versions/old/corpus.json').toString(), 'old version');
});
test('release detects concurrent conflicting writer and unsuccessful write', async () => {
  let value = null;
  const racing = { get: async () => value, set: async () => { value = Buffer.from('someone else'); } };
  await assert.rejects(immutablePut(racing, 'key', Buffer.from('ours')), /conflict/);
  await assert.rejects(immutablePut({ get: async () => null, set: async () => {} }, 'key', Buffer.from('ours')), /readback/);
});

const secret = 'qa-fixture-not-a-live-secret-'.repeat(2);
const context = { deploy: { id: 'a'.repeat(24) } };
function request(body = { q: 'apoyos', limit: 3 }, options = {}) {
  return new Request('https://qa.invalid/internal/n04/library/search' + (options.query ?? ''), {
    method: options.method ?? 'POST', headers: { 'content-type': 'application/json', 'x-n04-smoke-token': options.token ?? secret },
    ...(options.method === 'GET' ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }) });
}
const handler = createQAHandler({ env: key => key === 'N04_SMOKE_TOKEN' ? secret : undefined, readLibrary: async () => library });
test('QA request returns bounded citations and provenance without echoing query or corpus', async () => {
  const res = await handler(request(), context); assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'no-store'); const body = await res.json();
  assert.equal(body.library_version, RELEASE.version); assert.equal(body.corpus_sha256, RELEASE.sha256);
  assert.equal(body.deploy_id, context.deploy.id); assert.equal(body.results.length, 3);
  assert.equal(body.q, undefined); assert.equal(body.corpus, undefined); assert.equal(body.profile, undefined);
});
test('QA rejects missing/wrong token before storage access', async () => {
  const guarded = createQAHandler({ env: () => secret, readLibrary: () => assert.fail('Unauthorized storage read') });
  assert.equal((await guarded(request({}, { token: 'wrong' }), context)).status, 403);
  const absent = createQAHandler({ env: () => undefined, readLibrary: () => assert.fail('Unconfigured storage read') });
  assert.equal((await absent(request(), context)).status, 403);
});
test('QA rejects query strings, GET, oversized body, private/unknown fields, wrong version', async () => {
  assert.equal((await handler(request({}, { method: 'GET' }), context)).status, 405);
  assert.equal((await handler(request({}, { query: '?q=not-accepted' }), context)).status, 400);
  for (const body of ['x'.repeat(3000), '{bad', [], { q: 'apoyos', conversation: 'private' }, { q: 'x', version: 'future' }, { q: 'x', limit: 21 }, { q: 'x', filters: {} }]) assert.equal((await handler(request(body), context)).status, 400);
});
test('QA fails closed on AI flag and backend errors without exposing diagnostics', async () => {
  const enabled = createQAHandler({ env: k => k === 'N04_SMOKE_TOKEN' ? secret : 'true', readLibrary: () => assert.fail('AI flag must close') });
  assert.equal((await enabled(request(), context)).status, 503);
  const failing = createQAHandler({ env: k => k === 'N04_SMOKE_TOKEN' ? secret : undefined, readLibrary: () => { throw new Error('secret backend body'); } });
  const res = await failing(request(), context); assert.equal(res.status, 503); assert.deepEqual(await res.json(), { error: 'library_unavailable' });
});
test('runtime has no writes, payload logging, chat/provider dependencies or private data storage', async () => {
  const runtimeFiles = ['src/library.mjs', 'src/qa-handler.mjs', 'netlify/functions/n04-library-qa.mjs'];
  const code = (await Promise.all(runtimeFiles.map(f => readFile(new URL('../' + f, import.meta.url), 'utf8')))).join('\n');
  assert.doesNotMatch(code, /console\.|store\.(set|setJSON|delete)\s*\(|localStorage|\/api\/chat|context\.ip|context\.geo|openai|anthropic|embedding/i);
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(pkg.dependencies), ['@netlify/blobs']);
  const functions = await readdir(new URL('../netlify/functions/', import.meta.url)); assert.deepEqual(functions, ['n04-library-qa.mjs']);
});
test('performance targets on frozen corpus: cold < 2s, p95 warm search < 50ms, heap delta <128MiB', async () => {
  const times = [];
  for (let i = 0; i < 100; i++) { const t = performance.now(); library.searchLibrary({ query: ['sobrecarga sensorial', 'lectura fácil', 'apoyos trabajo'][i % 3], limit: 20 }); times.push(performance.now() - t); }
  times.sort((a,b) => a-b); const p95 = times[94];
  assert.ok(coldMs < 2000, `cold ${coldMs}`); assert.ok(p95 < 50, `p95 ${p95}`); assert.ok(heapDelta < 128 * 1024 * 1024);
  await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
  await writeFile(new URL('../evidence/PERFORMANCE.json', import.meta.url), JSON.stringify({ corpus_fragments: 4332,
    targets: { cold_local_ms: 2000, warm_search_p95_ms: 50, heap_delta_bytes: 128 * 1024 * 1024, cold_remote_target_ms: 15000 },
    measured: { cold_local_ms: +coldMs.toFixed(2), warm_search_p95_ms: +p95.toFixed(2), heap_delta_bytes: heapDelta, searches: 100 },
    scope: 'Local Node 22.16 measurement; no claim about production p95', status: 'PASS' }, null, 2) + '\n');
});
