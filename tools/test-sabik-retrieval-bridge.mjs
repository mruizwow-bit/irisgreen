import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRetrievalQuery, RetrievalBridgeError } from '../sabik/retrieval-bridge.mjs';
import { RELEASE, createManifest, loadLibrary, BINDING } from '../cloud/n04-r38-library/src/library.mjs';
import { createQAHandler } from '../cloud/n04-r38-library/src/qa-handler.mjs';

const library = Object.freeze({ version: RELEASE.version, corpusSha256: RELEASE.sha256,
  sourceGitBlob: RELEASE.sourceGitBlob, sourceLanguage: 'es' });
const manifest = createManifest({ build_head: 'a'.repeat(40), build_tree: 'b'.repeat(40), engine_sha256: 'c'.repeat(64) });
const corpusBytes = await readFile(new URL('../cloud/n04-r26-staging-binding/source/iris-fragments-index.es.json', import.meta.url));
const index = await loadLibrary({ get: async key => key === BINDING.manifestKey ? Buffer.from(JSON.stringify(manifest)) : corpusBytes });
const fixtureToken = 'LOCAL-BRIDGE-FIXTURE-NOT-A-CLOUD-CREDENTIAL';
const handler = createQAHandler({ readLibrary: async () => index, env: key => key === 'N04_SMOKE_TOKEN' ? fixtureToken : undefined });
const transport = (request, { signal } = {}) => handler(new Request('https://local.invalid/internal/n04/library/search', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-n04-smoke-token': fixtureToken }, signal,
  body: JSON.stringify({ q: request.query, limit: request.limit, version: request.libraryVersion }),
}), { deploy: { id: 'd'.repeat(24) } });
const response = body => new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
const originalBody = await (await transport({ query: 'sobrecarga sensorial' })).json();
const copy = value => JSON.parse(JSON.stringify(value));

test('authorized local handler results become exact candidates and A1 groups without changing ranking or citations', async () => {
  const query = createRetrievalQuery({ transport, library });
  const result = await query({ query: 'sobrecarga sensorial' });
  assert.equal(result.source_language, 'es'); assert.equal(result.library_version, RELEASE.version);
  assert.deepEqual(result.candidates, originalBody.results.map(({ editorial_status, ...candidate }) => candidate));
  assert.equal(result.groups.length, new Set(result.candidates.map(c => c.url)).size);
  assert.ok(result.groups.some(g => g.citations.length > 1));
  for (const group of result.groups) assert.deepEqual(group.citations, result.candidates.filter(c => c.url === group.url));
  assert.ok(Object.isFrozen(result.candidates)); assert.ok(Object.isFrozen(result.groups));
});

test('the transport receives the request without query history or secret additions', async () => {
  const request = Object.freeze({ query: 'sensorial' }); const signal = new AbortController().signal;
  const query = createRetrievalQuery({ library, transport: async (actual, options) => {
    assert.equal(actual, request); assert.equal(options.signal, signal); return response(originalBody);
  } });
  await query(request, { signal }); assert.deepEqual(Object.keys(query), []);
});

test('empty retrieval keeps explicit corpus language and empty candidates/groups', async () => {
  const result = await createRetrievalQuery({ transport, library })({ query: 'qzxvunknownterm' });
  assert.deepEqual(result, { library_version: RELEASE.version, source_language: 'es', candidates: [], groups: [] });
});

for (const [label, change, code = 'LIBRARY_INTEGRITY_ERROR'] of [
  ['different library', b => { b.library_version = 'future'; }, 'LIBRARY_VERSION_MISMATCH'],
  ['wrong corpus hash', b => { b.corpus_sha256 = 'f'.repeat(64); }],
  ['wrong source blob', b => { b.source_git_blob = 'f'.repeat(40); }],
  ['mixed candidate version', b => { b.results[0].library_version = 'future'; }],
  ['duplicate fragment', b => { b.results[1].fragment_id = b.results[0].fragment_id; }],
  ['unpublished source', b => { b.results[0].editorial_status = 'PRIVATE'; }],
  ['unknown result data', b => { b.results[0].profile = 'private'; }],
  ['external URL', b => { b.results[0].url = 'https://example.org/private'; }],
  ['credentialed URL', b => { b.results[0].url = 'https://user:secret@irisgreen.eu/es/'; }],
  ['script URL', b => { b.results[0].url = 'javascript:alert(1)'; }],
  ['whitespace URL', b => { b.results[0].url += '\n'; }],
  ['oversized excerpt', b => { b.results[0].snippet = 'x'.repeat(481); }],
  ['invalid ranking', b => { b.results[0].score = -1; }],
]) {
  test(`invalid response fails safely: ${label}`, async () => {
    const body = copy(originalBody); change(body);
    const query = createRetrievalQuery({ library, transport: async () => response(body) });
    await assert.rejects(query({ query: 'private' }), e => e instanceof RetrievalBridgeError && e.code === code && e.message === code);
  });
}

test('URLs are validated without normalization before A1 exact grouping', async () => {
  const body = copy(originalBody); body.results = body.results.slice(0, 2);
  body.results[0].url = 'https://irisgreen.eu/es/biblioteca'; body.results[1].url = 'https://irisgreen.eu/es/biblioteca/';
  const result = await createRetrievalQuery({ library, transport: async () => response(body) })({});
  assert.deepEqual(result.groups.map(g => g.url), body.results.map(c => c.url));
  assert.equal(result.groups.length, 2);
});

for (const [status, body, outcome, code] of [
  [503, { error: 'library_unavailable' }, 'REQUEST_CANCELLED', 'REQUEST_CANCELLED'],
  [503, { error: 'library_unavailable' }, 'REQUEST_TIMEOUT', 'REQUEST_TIMEOUT'],
  [400, { error: 'wrong_version' }, null, 'LIBRARY_VERSION_MISMATCH'],
  [400, { error: 'invalid_query' }, null, 'INVALID_RETRIEVAL_QUERY'],
  [403, { error: 'forbidden', message: 'private' }, null, 'LIBRARY_UNAVAILABLE'],
]) {
  test(`one transport error mapping preserves ${code}`, async () => {
    const query = createRetrievalQuery({ library, transport: async () => new Response(JSON.stringify(body), { status,
      headers: { 'content-type': 'application/json', ...(outcome ? { 'X-Sabik-Request-Outcome': outcome } : {}) } }) });
    await assert.rejects(query({}), e => e.code === code && e.message === code);
  });
}

test('HTML login response and private transport errors never become results or exposed details', async () => {
  for (const transport of [async () => new Response('<html>Login</html>', { status: 401 }), async () => { throw new Error('secret private query'); }]) {
    await assert.rejects(createRetrievalQuery({ library, transport })({}), e => e.code === 'LIBRARY_UNAVAILABLE' && e.message === 'LIBRARY_UNAVAILABLE');
  }
});

test('a cancelled consumer rejects a late successful response', async () => {
  const controller = new AbortController(); let release;
  const gate = new Promise(resolve => { release = resolve; });
  const query = createRetrievalQuery({ library, transport: async () => { await gate; return response(originalBody); } });
  const pending = query({}, { signal: controller.signal }); controller.abort(); release();
  await assert.rejects(pending, e => e.code === 'REQUEST_CANCELLED');
});

test('source language is trusted configuration, not interface language or body guesswork', async () => {
  assert.throws(() => createRetrievalQuery({ library: { ...library, sourceLanguage: 'en' }, transport }), /Invalid retrieval composition/);
  const mutable = { ...library };
  const query = createRetrievalQuery({ library: mutable, transport }); mutable.sourceLanguage = 'en';
  assert.equal((await query({ query: 'sensorial', language: 'en' })).source_language, 'es');
});
