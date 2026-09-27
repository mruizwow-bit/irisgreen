import test from 'node:test';
import assert from 'node:assert/strict';
import release from '../build/library-v2/release.json' with { type: 'json' };
import { createCloudLibraryQAHandler } from '../src/cloud-library-qa-handler.mjs';

const token = 't'.repeat(40);
const result = (overrides = {}) => Object.freeze({
  library_version: release.version,
  content_id: 'x', fragment_id: 'x:es:main', locale: 'es', snippet: 'sample',
  title: 'Title', heading: 'Heading', url: 'https://irisgreen.eu/es/situaciones/x/',
  source_type: 'situation', editorial_status: 'PUBLIC_MAIN_SNAPSHOT', concepts: [],
  sensitivity: 'S0_GENERAL', discovery: 'NORMAL', safe_variant_id: null,
  source_version: 'main@' + release.source_commit, source_sha256: 'a'.repeat(64), score: 101,
  citation: { fragment_id: 'x:es:main', url: 'https://irisgreen.eu/es/situaciones/x/', title: 'Title',
    heading: 'Heading', library_version: release.version, source_version: 'main@' + release.source_commit,
    source_sha256: 'a'.repeat(64), locale: 'es', score: 101 }, ...overrides
});
const library = {
  manifest: { provenance: { build_head: 'a'.repeat(40) } },
  searchLibrary(args) {
    if (args.query === 'zero') return [];
    return [result({ locale: args.locale, fragment_id: 'x:' + args.locale + ':main',
      citation: { ...result().citation, fragment_id: 'x:' + args.locale + ':main', locale: args.locale } })];
  }
};
const env = key => key === 'N04_SMOKE_TOKEN' ? token : key === 'SABIK_AI_ENABLED' ? 'false' : undefined;
const context = { deploy: { id: 'd'.repeat(24) } };
const request = (body, supplied = token) => new Request('https://draft.example/internal/n04/cloud-library/search', {
  method: 'POST', headers: { 'content-type': 'application/json', 'x-n04-smoke-token': supplied },
  body: JSON.stringify(body)
});

test('second gate rejects missing or wrong smoke credential', async () => {
  const handler = createCloudLibraryQAHandler({ readLibrary: async () => library, release, env });
  assert.equal((await handler(request({ q: 'autismo' }, 'wrong'), context)).status, 403);
});

test('HTTP ES/EN contract returns locale, citations and no-store', async () => {
  const handler = createCloudLibraryQAHandler({ readLibrary: async () => library, release, env,
    codeProvenance: { source_head: 'a'.repeat(40) } });
  for (const locale of ['es','en']) {
    const response = await handler(request({ q: 'support', locale, context: 'default', group_sources: true }), context);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const body = await response.json();
    assert.equal(body.locale, locale);
    assert.equal(body.results[0].locale, locale);
    assert.equal(body.results[0].citation.locale, locale);
    assert.deepEqual(body.source_groups[0].citations.map(c => c.fragment_id), body.results.map(r => r.fragment_id));
  }
});

test('HTTP zero results is explicit and stable', async () => {
  const handler = createCloudLibraryQAHandler({ readLibrary: async () => library, release, env });
  const response = await handler(request({ q: 'zero', locale: 'es' }), context);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).results, []);
});

test('HTTP wrong version fails closed', async () => {
  const handler = createCloudLibraryQAHandler({ readLibrary: async () => library, release, env });
  const response = await handler(request({ q: 'autismo', version: 'wrong' }), context);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'wrong_version' });
});

test('HTTP rejects unknown fields, oversize contracts and age assurance fields', async () => {
  const handler = createCloudLibraryQAHandler({ readLibrary: async () => library, release, env });
  for (const body of [
    { q: 'autismo', age: 12 },
    { q: 'autismo', dob: '2014-01-01' },
    { q: 'autismo', context: 'child', explicit_intent: 'yes' }
  ]) {
    const response = await handler(request(body), context);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'invalid_request' });
  }
});

test('HTTP storage/runtime failures are sanitized', async () => {
  const handler = createCloudLibraryQAHandler({
    readLibrary: async () => { throw new Error('SECRET_INTERNAL_STORAGE_DETAIL'); }, release, env
  });
  const response = await handler(request({ q: 'autismo' }), context);
  assert.equal(response.status, 503);
  const text = await response.text();
  assert.deepEqual(JSON.parse(text), { error: 'library_unavailable' });
  assert.ok(!text.includes('SECRET_INTERNAL_STORAGE_DETAIL'));
});
