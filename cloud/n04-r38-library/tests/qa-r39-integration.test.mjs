import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { BINDING, RELEASE, createManifest } from '../src/library.mjs';
import { createSabikRetrievalForDeployment } from '../src/sabik-retrieval-server.mjs';
import { createQAHandler } from '../src/qa-handler.mjs';
import { LIBRARY_DEPLOY_ID } from '../src/cloud-release.mjs';

const raw = await readFile(new URL('../../n04-r26-staging-binding/source/iris-fragments-index.es.json', import.meta.url));
const corpus = JSON.parse(raw);
const byId = new Map(corpus.fragments.map(fragment => [fragment.id, fragment]));
// Captured immutable R38 provenance, independent of the new Function/code deployment.
const manifest = createManifest({
  build_head: 'ddd12ed4e002812f5c53e24618c029be9faf9e00',
  build_tree: '75e227251df48b91442bee53213f087934982938',
  engine_sha256: '57d508023c11b29b85e7bbcba14d0855660847d90aaab2a54bfe75540c223f7c',
});
manifest.created_at = '2026-09-24T06:20:12.393Z';
const manifestBytes = Buffer.from(JSON.stringify(manifest));
const fixtures = JSON.parse(await readFile(new URL('fixtures/retrieval-r39.json', import.meta.url), 'utf8'));
const token = 'qa-test-token-only-not-a-real-secret-00000000';
const functionDeployId = 'f'.repeat(24);
const context = { deploy: { id: functionDeployId } };
const codeProvenance = Object.freeze({ source_head: 'e'.repeat(40), library_deploy_id: LIBRARY_DEPLOY_ID });
const deferred = () => {
  let resolve; let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

function composition({ gate, entered, overrides = {}, readError, timeoutMs = 2_000, ai = 'false' } = {}) {
  const reads = []; const stores = [];
  const values = { [BINDING.manifestKey]: manifestBytes, [BINDING.corpusKey]: raw, ...overrides };
  const retrieval = createSabikRetrievalForDeployment({ libraryDeployId: LIBRARY_DEPLOY_ID, storeFactory: options => {
    stores.push(options);
    assert.equal(options.deployID, LIBRARY_DEPLOY_ID);
    assert.notEqual(options.deployID, functionDeployId);
    assert.equal(options.name, BINDING.store);
    assert.equal(options.region, BINDING.region);
    assert.equal(options.signal, undefined, 'consumer cancellation must not enter shared storage');
    return {
      async get(key, readOptions) {
        reads.push(key);
        assert.deepEqual(readOptions, { type: 'arrayBuffer', consistency: 'strong' });
        entered?.resolve();
        if (gate) await gate.promise;
        if (readError) throw readError;
        return values[key] ?? null;
      },
      set() { assert.fail('QA retrieval attempted a storage write'); },
      delete() { assert.fail('QA retrieval attempted a storage delete'); },
    };
  } });
  const handler = createQAHandler({ retrieval, codeProvenance, timeoutMs,
    env: key => key === 'N04_SMOKE_TOKEN' ? token : key === 'SABIK_AI_ENABLED' ? ai : undefined });
  return { handler, retrieval, reads, stores };
}
function request(body = { q: 'sensorial' }, options = {}) {
  const { signal, method = 'POST', suppliedToken = token, url = 'https://qa.invalid/internal/n04/library/search',
    contentType = 'application/json', rawBody } = options;
  return new Request(url, { method, signal,
    headers: { 'x-n04-smoke-token': suppliedToken, 'content-type': contentType },
    ...(['GET', 'HEAD'].includes(method) ? {} : { body: rawBody ?? JSON.stringify(body) }) });
}
async function assertClosed(response, status, error) {
  assert.equal(response.status, status);
  assert.deepEqual(await response.json(), { error });
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
}

test('HTTP composition preserves the R38 body and exact citations while exposing separate code/library provenance', async () => {
  const { handler, reads, stores } = composition();
  const response = await handler(request(), context);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Sabik-Code-Head'), codeProvenance.source_head);
  assert.equal(response.headers.get('X-Sabik-Library-Deploy'), LIBRARY_DEPLOY_ID);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  const body = await response.json();
  assert.deepEqual(Object.keys(body).sort(), ['build_head', 'corpus_sha256', 'deploy_id', 'library_version', 'results', 'source_git_blob']);
  assert.equal(body.deploy_id, functionDeployId);
  assert.equal(body.build_head, manifest.provenance.build_head);
  assert.notEqual(body.build_head, codeProvenance.source_head);
  assert.equal(body.library_version, RELEASE.version);
  assert.equal(body.corpus_sha256, RELEASE.sha256);
  assert.equal(body.source_git_blob, RELEASE.sourceGitBlob);
  assert.deepEqual(body.results.map(({ fragment_id, score, url }) => ({ fragment_id, score, url })), fixtures.cases[0].expected);
  for (const candidate of body.results) {
    const source = byId.get(candidate.fragment_id);
    assert.ok(source);
    assert.deepEqual(Object.keys(candidate).sort(), ['concepts', 'editorial_status', 'fragment_id', 'heading', 'library_version', 'score', 'snippet', 'source_type', 'title', 'url']);
    assert.equal(candidate.editorial_status, 'PUBLICABLE');
    assert.equal(candidate.snippet, source.text.slice(0, 480));
    assert.equal(candidate.title, source.title);
    assert.equal(candidate.heading, source.heading);
    assert.equal(candidate.source_type, source.source_type);
    assert.deepEqual(candidate.concepts, source.concepts);
  }
  assert.equal(stores.length, 1);
  assert.deepEqual(reads, [BINDING.manifestKey, BINDING.corpusKey]);
});

test('multiple HTTP requests and provenance reads reuse one immutable index without caching a query result', async () => {
  const { handler, retrieval, reads, stores } = composition();
  const first = await (await handler(request({ q: 'sensorial', limit: 1 }), context)).json();
  const empty = await (await handler(request({ q: 'qzxvunknownterm' }), context)).json();
  const second = await (await handler(request({ q: 'sensorial', limit: 2 }), context)).json();
  const info = await retrieval.getLibraryInfo();
  assert.equal(first.results.length, 1);
  assert.deepEqual(empty.results, []);
  assert.equal(second.results.length, 2);
  assert.deepEqual(second.results[0], first.results[0]);
  assert.ok(Object.isFrozen(info));
  assert.equal(info.build_head, manifest.provenance.build_head);
  assert.equal(stores.length, 1);
  assert.deepEqual(reads, [BINDING.manifestKey, BINDING.corpusKey]);
});

const invalidCases = [
  ['blank query', { q: '  ' }, {}, 'invalid_request'],
  ['unknown private input', { q: 'sensorial', profile: 'private' }, {}, 'invalid_request'],
  ['caller deployment override', { q: 'sensorial', libraryDeployId: functionDeployId }, {}, 'invalid_request'],
  ['limit zero', { q: 'sensorial', limit: 0 }, {}, 'invalid_request'],
  ['version mismatch', { q: 'sensorial', version: 'future' }, {}, 'wrong_version'],
  ['punctuation query rejected by R39', { q: '!!!' }, {}, 'invalid_query'],
  ['33 terms rejected by R39', { q: Array.from({ length: 33 }, (_, n) => `q${n}`).join(' ') }, {}, 'invalid_query'],
  ['wrong content type', { q: 'sensorial' }, { contentType: 'text/plain' }, 'invalid_request'],
  ['query string disallowed', { q: 'sensorial' }, { url: 'https://qa.invalid/internal/n04/library/search?q=sensorial' }, 'invalid_request'],
  ['malformed JSON', {}, { rawBody: '{bad-json' }, 'invalid_request'],
  ['oversized body', {}, { rawBody: JSON.stringify({ q: 'sensorial', padding: 'x'.repeat(2_048) }) }, 'invalid_request'],
];
for (const [label, body, options, expected] of invalidCases) {
  test(`HTTP validation prevents all library reads: ${label}`, async () => {
    const { handler, reads, stores } = composition();
    await assertClosed(await handler(request(body, options), context), 400, expected);
    assert.deepEqual(reads, []); assert.deepEqual(stores, []);
  });
}

test('protected route and disabled-inference guard remain closed before storage', async () => {
  const normal = composition();
  await assertClosed(await normal.handler(request(undefined, { suppliedToken: 'wrong' }), context), 403, 'forbidden');
  await assertClosed(await normal.handler(request(undefined, { method: 'GET' }), context), 405, 'method_not_allowed');
  const enabled = composition({ ai: 'true' });
  await assertClosed(await enabled.handler(request(), context), 503, 'configuration_closed');
  assert.deepEqual(normal.reads, []); assert.deepEqual(enabled.reads, []);
});

const corrupt = Buffer.from(raw); corrupt[20] ^= 1;
for (const [label, options] of [
  ['missing manifest', { overrides: { [BINDING.manifestKey]: null } }],
  ['missing corpus', { overrides: { [BINDING.corpusKey]: null } }],
  ['corrupt corpus', { overrides: { [BINDING.corpusKey]: corrupt } }],
  ['backend detail', { readError: new Error('private-query token storage.internal.example must not escape') }],
]) {
  test(`real loader failure keeps existing public HTTP error: ${label}`, async () => {
    const { handler } = composition(options);
    const response = await handler(request(), context);
    assert.equal(response.headers.get('X-Sabik-Code-Head'), codeProvenance.source_head);
    assert.equal(response.headers.get('X-Sabik-Library-Deploy'), LIBRARY_DEPLOY_ID);
    await assertClosed(response, 503, 'library_unavailable');
  });
}

test('a pre-cancelled HTTP request does not start the shared loader', async () => {
  const { handler, reads } = composition();
  const controller = new AbortController(); controller.abort('private cancellation reason');
  const response = await handler(request(undefined, { signal: controller.signal }), context);
  assert.equal(response.headers.get('X-Sabik-Request-Outcome'), 'REQUEST_CANCELLED');
  await assertClosed(response, 503, 'library_unavailable');
  assert.deepEqual(reads, []);
});

test('cancelling one HTTP consumer discards its late result without aborting a parallel consumer or cached index', async () => {
  const gate = deferred(); const entered = deferred();
  const { handler, reads, stores } = composition({ gate, entered });
  const controller = new AbortController(); const published = [];
  const cancelled = handler(request(undefined, { signal: controller.signal }), context).then(value => { published.push(value); return value; });
  const unaffected = handler(request({ q: 'sensorial', limit: 2 }), context);
  await entered.promise;
  controller.abort('private reason');
  const closed = await cancelled;
  assert.equal(closed.headers.get('X-Sabik-Request-Outcome'), 'REQUEST_CANCELLED');
  await assertClosed(closed, 503, 'library_unavailable');
  gate.resolve();
  const succeeded = await unaffected;
  assert.equal(succeeded.status, 200);
  assert.equal((await succeeded.json()).results.length, 2);
  await nextTurn();
  assert.equal(published.length, 1);
  assert.equal(published[0].status, 503);
  assert.equal((await handler(request(), context)).status, 200);
  assert.equal(stores.length, 1);
  assert.deepEqual(reads, [BINDING.manifestKey, BINDING.corpusKey]);
});

test('HTTP timeout discards late results while a parallel direct consumer completes the shared load', async () => {
  const gate = deferred(); const entered = deferred();
  const { handler, retrieval, reads, stores } = composition({ gate, entered, timeoutMs: 20 });
  const pending = handler(request(), context);
  const unaffected = retrieval.retrieveForSabik({ query: 'sensorial', limit: 2 });
  await entered.promise;
  const closed = await pending;
  assert.equal(closed.headers.get('X-Sabik-Request-Outcome'), 'REQUEST_TIMEOUT');
  await assertClosed(closed, 503, 'library_unavailable');
  gate.resolve();
  assert.equal((await unaffected).candidates.length, 2);
  await nextTurn();
  assert.equal(closed.status, 503);
  assert.equal(stores.length, 1);
  assert.deepEqual(reads, [BINDING.manifestKey, BINDING.corpusKey]);
});

test('HTTP timeout safely consumes a late storage rejection and returns no diagnostics in the body', async () => {
  const gate = deferred(); const entered = deferred();
  const { handler } = composition({ gate, entered, timeoutMs: 20, readError: new Error('private storage failure') });
  const pending = handler(request(), context);
  await entered.promise;
  const response = await pending;
  assert.equal(response.headers.get('X-Sabik-Request-Outcome'), 'REQUEST_TIMEOUT');
  await assertClosed(response, 503, 'library_unavailable');
  gate.resolve();
  await nextTurn(); // node:test also fails this test on an unhandled late rejection.
});
