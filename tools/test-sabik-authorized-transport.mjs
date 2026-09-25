import test from 'node:test';
import assert from 'node:assert/strict';
import { MessageChannel } from 'node:worker_threads';
import { setTimeout as delay } from 'node:timers/promises';
import { readFile } from 'node:fs/promises';
import { createAuthorizedTransport } from '../sabik/authorized-transport.mjs';
import { startCloudConnection } from '../cloud/n04-r38-library/src/cloud-connection.mjs';
import { createTeamTransportHandler } from '../cloud/n04-r38-library/src/team-transport-handler.mjs';
import { createQAHandler } from '../cloud/n04-r38-library/src/qa-handler.mjs';
import { createRetrievalQuery } from '../sabik/retrieval-bridge.mjs';
import { RELEASE, BINDING, loadLibrary, createManifest } from '../cloud/n04-r38-library/src/library.mjs';

const cloudOrigin = `https://${'c'.repeat(24)}--sabik-asistente.netlify.app`;
const webOrigin = `https://${'b'.repeat(24)}--irisgreen-home.netlify.app`;
const context = { site: { id: '47b06e68-ff54-4097-8ad8-336b2d71758a' }, deploy: { id: 'c'.repeat(24), context: 'deploy-preview', published: false } };
const fixtureSecret = 'LOCAL-TEST-ONLY-NEVER-AN-ACTUAL-CREDENTIAL';
const config = { N04_TEAM_TRANSPORT_ENABLED: 'true', N04_WEB_ALLOWED_ORIGIN: webOrigin, N04_SMOKE_TOKEN: fixtureSecret };
const manifest = createManifest({ build_head: 'a'.repeat(40), build_tree: 'b'.repeat(40), engine_sha256: 'c'.repeat(64) });
const bytes = await readFile(new URL('../cloud/n04-r26-staging-binding/source/iris-fragments-index.es.json', import.meta.url));
const index = await loadLibrary({ get: async key => key === BINDING.manifestKey ? Buffer.from(JSON.stringify(manifest)) : bytes });
const qa = createQAHandler({ readLibrary: async () => index, env: key => config[key], timeoutMs: 500 });
const relay = createTeamTransportHandler({ qaHandler: qa, env: key => config[key] });
const library = { version: RELEASE.version, corpusSha256: RELEASE.sha256, sourceGitBlob: RELEASE.sourceGitBlob, sourceLanguage: 'es' };
const request = (body = '{"q":"sobrecarga sensorial"}', options = {}) => new Request(`${cloudOrigin}/internal/n04/team/search`, {
  method: 'POST', headers: { origin: cloudOrigin, 'sec-fetch-site': 'same-origin', 'content-type': 'application/json', ...options.headers },
  body, signal: options.signal,
});
function events() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatch(type, event) { for (const fn of listeners.get(type) ?? []) fn(event); },
  };
}
function pair({ fetch, automatic = true, requestTimeoutMs = 500, connectionTimeoutMs = 500, origin = webOrigin } = {}) {
  const calls = [], messages = []; let broker, count = 0, currentFrame = null;
  const host = { ...events(), crypto: globalThis.crypto, MessageChannel };
  const peer = { ...events(), opener: null, parent: host,
    document: { documentElement: { dataset: {} }, getElementById() { return null; } },
    postMessage(data, target, ports) {
      assert.equal(target, cloudOrigin); messages.push(data);
      queueMicrotask(() => peer.dispatch('message', { data, source: host, origin, ports }));
    },
    async fetch(path, options) { calls.push({ path, options }); return fetch ? fetch(path, options) : relay(new Request(cloudOrigin + path, {
      ...options, headers: { ...options.headers, origin: cloudOrigin, 'sec-fetch-site': 'same-origin' },
    }), context); },
  };
  host.postMessage = (data, target) => {
    assert.equal(target, origin);
    queueMicrotask(() => host.dispatch('message', { data, origin: cloudOrigin, source: peer }));
  };
  host.document = {
    body: {
      appendChild(frame) {
        count++; currentFrame = frame; frame.isConnected = true;
        assert.ok(frame.src.startsWith(`${cloudOrigin}/sabik-connect?lang=`));
        if (automatic) queueMicrotask(() => { broker = startCloudConnection({ host: peer, allowedOrigin: origin }); });
        return frame;
      },
    },
    createElement(tag) {
      assert.equal(tag, 'iframe');
      const frameEvents = events();
      return Object.assign(frameEvents, {
        contentWindow: peer, hidden: false, tabIndex: 0, isConnected: false, src: '',
        attrs: new Map(),
        setAttribute(name, value) { this.attrs.set(name, String(value)); },
        remove() { this.isConnected = false; },
      });
    },
  };
  const connection = createAuthorizedTransport({ cloudOrigin, window: host, requestTimeoutMs, connectionTimeoutMs });
  return { host, peer, connection, calls, messages,
    get opened() { return count; }, get frame() { return currentFrame; },
    close() { connection.disconnect(); broker?.stop(); } };
}

test('full local composition preserves R03 citations and A1 grouping; no browser credential', async t => {
  const p = pair(); t.after(() => p.close());
  const actual = await createRetrievalQuery({ transport: p.connection.transport, library })({ query: 'sobrecarga sensorial', limit: 12 });
  const expected = await (await qa(new Request(`${cloudOrigin}/internal/n04/library/search`, { method: 'POST',
    headers: { 'content-type': 'application/json', 'x-n04-smoke-token': fixtureSecret }, body: '{"q":"sobrecarga sensorial","limit":12}' }), context)).json();
  assert.deepEqual(actual.candidates, expected.results.map(({ editorial_status, ...candidate }) => candidate));
  assert.ok(actual.groups.some(group => group.citations.length > 1));
  for (const group of actual.groups) assert.deepEqual(group.citations, actual.candidates.filter(candidate => candidate.url === group.url));
  assert.equal(p.opened, 1); assert.equal(p.calls.length, 1);
  assert.deepEqual(Object.keys(p.calls[0].options.headers), ['content-type']);
  assert.equal(JSON.stringify(p.messages).includes(fixtureSecret), false);
  assert.equal(p.calls[0].options.credentials, 'same-origin'); assert.equal(p.calls[0].options.redirect, 'error');
});
test('two queries reuse a single connection and preserve isolated response IDs', async t => {
  const p = pair(); t.after(() => p.close());
  const results = await Promise.all(['sensorial', 'qzxvunknownterm'].map(query => createRetrievalQuery({ transport: p.connection.transport, library })({ query })));
  assert.ok(results[0].groups.length); assert.equal(results[1].groups.length, 0); assert.equal(p.opened, 1);
});
test('abort during login rejects immediately without closing another consumer connection', async t => {
  const p = pair({ automatic: false }); t.after(() => p.close());
  const signal = new AbortController(); const first = p.connection.transport({ query: 'sensorial' }, { signal: signal.signal });
  const rejected = assert.rejects(first, { code: 'REQUEST_CANCELLED' }); signal.abort(); await rejected;
  assert.equal(p.peer.closed, false); assert.equal(p.calls.length, 0);
});
test('pre-aborted query does not create a Cloud frame', async t => {
  const p = pair(); t.after(() => p.close());
  await assert.rejects(p.connection.transport({ query: 'sensorial' }, { signal: AbortSignal.abort() }), { code: 'REQUEST_CANCELLED' });
  assert.equal(p.opened, 0);
});
test('wrong origin or source cannot offer a connection port', async t => {
  const p = pair({ automatic: false, connectionTimeoutMs: 40 }); t.after(() => p.close());
  const waiting = assert.rejects(p.connection.connect(), { code: 'REQUEST_TIMEOUT' });
  p.host.dispatch('message', { origin: 'https://attacker.invalid', source: p.peer, data: { type: 'sabik:ready', version: 1 } });
  p.host.dispatch('message', { origin: cloudOrigin, source: {}, data: { type: 'sabik:ready', version: 1 } });
  await waiting; assert.equal(p.messages.length, 0); assert.equal(p.calls.length, 0);
});
test('wrong handshake nonce cannot establish a transport', async t => {
  const p = pair({ automatic: false, connectionTimeoutMs: 40 }); t.after(() => p.close());
  let receiver;
  p.peer.postMessage = (_message, _origin, ports) => { receiver = ports[0]; receiver.postMessage({ type: 'sabik:connected', nonce: 'wrong' }); };
  const waiting = assert.rejects(p.connection.connect(), { code: 'REQUEST_TIMEOUT' });
  p.host.dispatch('message', { origin: cloudOrigin, source: p.peer, data: { type: 'sabik:ready', version: 1 } });
  await waiting; receiver?.close(); assert.equal(p.calls.length, 0);
});
test('Cloud only accepts its configured parent and origin when opener is null', async t => {
  let fetches = 0;
  const parent = { postMessage() {} };
  const host = { ...events(), opener: null, parent, fetch() { fetches++; } };
  const broker = startCloudConnection({ host, allowedOrigin: webOrigin }); t.after(() => broker.stop());
  const ports = new MessageChannel(); t.after(() => { ports.port1.close(); ports.port2.close(); });
  const base = { source: parent, origin: webOrigin, ports: [ports.port1], data: { type: 'sabik:connect', version: 1, nonce: crypto.randomUUID() } };
  host.dispatch('message', { ...base, origin: 'https://attacker.invalid' });
  host.dispatch('message', { ...base, source: {} });
  ports.port2.postMessage({ type: 'sabik:query', id: '1', body: '{"q":"sensorial"}' });
  await delay(10); assert.equal(fetches, 0); assert.equal(ports.port1.onmessage, null);
});
test('one aborted consumer leaves a concurrent query operational', async t => {
  const p = pair({ fetch: async (path, options) => { await delay(30); return relay(new Request(cloudOrigin + path, {
    ...options, headers: { ...options.headers, origin: cloudOrigin, 'sec-fetch-site': 'same-origin' },
  }), context); } }); t.after(() => p.close());
  await p.connection.connect(); const control = new AbortController();
  const first = assert.rejects(p.connection.transport({ query: 'sensorial' }, { signal: control.signal }), { code: 'REQUEST_CANCELLED' });
  const second = createRetrievalQuery({ transport: p.connection.transport, library })({ query: 'sensorial' });
  await delay(10); control.abort(); await first; assert.ok((await second).groups.length); assert.equal(p.opened, 1);
});
test('iframe load failure rejects the pending connection without retry', async t => {
  const p = pair({ automatic: false, connectionTimeoutMs: 500 }); t.after(() => p.close());
  const waiting = assert.rejects(p.connection.connect(), { code: 'LIBRARY_UNAVAILABLE' });
  p.frame.dispatch('error', {});
  await waiting;
  assert.equal(p.calls.length, 0);
});
test('query cancellation aborts only its fetch and discards a late reply', async t => {
  let fetchSignal, release;
  const entered = new Promise(resolve => { release = resolve; });
  const p = pair({ fetch: async (_path, options) => { fetchSignal = options.signal; release(); await delay(30); return new Response('{}', { headers: { 'content-type': 'application/json' } }); } });
  t.after(() => p.close()); const control = new AbortController();
  const query = p.connection.transport({ query: 'sensorial' }, { signal: control.signal });
  const rejected = assert.rejects(query, { code: 'REQUEST_CANCELLED' }); await entered; control.abort(); await rejected; await delay(40);
  assert.equal(fetchSignal.aborted, true); assert.equal(p.calls.length, 1);
});
test('timeout aborts the request without retry', async t => {
  let signal;
  const p = pair({ requestTimeoutMs: 35, fetch: async (_path, options) => {
    signal = options.signal; await new Promise((resolve, reject) => options.signal.addEventListener('abort', () => reject(new Error('private detail')), { once: true }));
  } }); t.after(() => p.close());
  await assert.rejects(p.connection.transport({ query: 'sensorial' }), { code: 'REQUEST_TIMEOUT' }); await delay(10);
  assert.equal(signal.aborted, true); assert.equal(p.calls.length, 1);
});
for (const [label, result] of [
  ['login HTML', () => new Response('<html>login</html>', { headers: { 'content-type': 'text/html' } })],
  ['oversized body', () => new Response('x'.repeat(65537), { headers: { 'content-type': 'application/json' } })],
  ['fetch failure', () => { throw new Error('sensitive implementation detail'); }],
]) test(`Cloud broker closes safely on ${label}`, async t => {
  const p = pair({ fetch: result }); t.after(() => p.close());
  await assert.rejects(createRetrievalQuery({ transport: p.connection.transport, library })({ query: 'sensorial' }), { code: 'LIBRARY_UNAVAILABLE', message: 'LIBRARY_UNAVAILABLE' });
  assert.equal(p.calls.length, 1);
});
test('response transport forwards only declared non-sensitive headers', async t => {
  const p = pair({ fetch: () => new Response('{}', { headers: { 'content-type': 'application/json', 'set-cookie': 'private', 'x-private': 'hidden', 'x-sabik-code-head': 'a'.repeat(40) } }) }); t.after(() => p.close());
  const response = await p.connection.transport({ query: 'sensorial' });
  assert.equal(response.headers.get('set-cookie'), null); assert.equal(response.headers.get('x-private'), null);
  assert.equal(response.headers.get('x-sabik-code-head'), 'a'.repeat(40));
});
test('UTF-8 request cap is enforced before opening a connection', async t => {
  const p = pair(); t.after(() => p.close());
  await assert.rejects(p.connection.transport({ query: '🎨'.repeat(520) }), { code: 'INVALID_RETRIEVAL_QUERY' }); assert.equal(p.opened, 0);
});
test('unknown or production origins cannot configure the browser transport', () => {
  for (const origin of ['https://sabik-asistente.netlify.app', 'https://attacker.invalid', `${cloudOrigin}/`, `${cloudOrigin}@attacker.invalid`]) {
    assert.throws(() => createAuthorizedTransport({ cloudOrigin: origin, window: {} }), TypeError);
  }
});
for (const [label, change] of [
  ['disabled', { config: { N04_TEAM_TRANSPORT_ENABLED: undefined } }],
  ['missing credential', { config: { N04_SMOKE_TOKEN: undefined } }],
  ['different site', { context: { ...context, site: { id: 'other' } } }],
  ['production', { context: { ...context, deploy: { ...context.deploy, context: 'production' } } }],
  ['published', { context: { ...context, deploy: { ...context.deploy, published: true } } }],
]) test(`server relay refuses ${label} without invoking QA`, async () => {
  const handler = createTeamTransportHandler({ qaHandler: () => assert.fail('QA must not be invoked'), env: key => ({ ...config, ...change.config })[key] });
  const response = await handler(request(), change.context ?? context); assert.equal(response.status, 503);
});
for (const extra of [{ origin: 'https://attacker.invalid' }, { 'sec-fetch-site': 'cross-site' }, { origin: '' }, { 'sec-fetch-site': '' }]) test(`CSRF rejection ${JSON.stringify(extra)}`, async () => {
  const response = await relay(request(undefined, { headers: extra }), context); assert.equal(response.status, 403);
});
test('client-supplied credential and cookies are never forwarded; server credential is used', async () => {
  const handler = createTeamTransportHandler({ env: key => config[key], qaHandler: async forwarded => {
    assert.equal(forwarded.headers.get('cookie'), null); assert.equal(forwarded.headers.get('authorization'), null);
    assert.equal(forwarded.headers.get('x-n04-smoke-token'), fixtureSecret);
    assert.deepEqual([...forwarded.headers.keys()].sort(), ['content-type', 'x-n04-smoke-token']); return new Response('{}');
  } });
  await handler(request(undefined, { headers: { cookie: 'platform-session-must-not-leave', authorization: 'user-supplied', 'x-n04-smoke-token': 'untrusted' } }), context);
});
test('R03 body limit, invalid version and pre-abort semantics survive the server relay', async () => {
  assert.equal((await relay(request('x'.repeat(2049)), context)).status, 400);
  const version = await relay(request('{"q":"sensorial","version":"future"}'), context);
  assert.equal(version.status, 400); assert.equal((await version.json()).error, 'wrong_version');
  const aborted = await relay(request(undefined, { signal: AbortSignal.abort() }), context);
  assert.equal(aborted.headers.get('x-sabik-request-outcome'), 'REQUEST_CANCELLED');
});
test('connection document is bilingual, allowlisted, credential-free, uncached and unframeable', async () => {
  for (const language of ['es', 'en']) {
    const response = await relay(new Request(`${cloudOrigin}/sabik-connect?lang=${language}`), context);
    const html = await response.text(); assert.equal(response.status, 200); assert.ok(html.includes(`lang="${language}"`));
    assert.ok(html.includes(webOrigin)); assert.equal(html.includes(fixtureSecret), false); assert.ok(html.includes('role="status"'));
    assert.equal(response.headers.get('cache-control'), 'no-store'); assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.ok(response.headers.get('content-security-policy').includes("connect-src 'self'"));
  }
  const unsafe = createTeamTransportHandler({ qaHandler: qa, env: key => key === 'N04_WEB_ALLOWED_ORIGIN' ? 'https://attacker.invalid' : config[key] });
  assert.equal((await unsafe(new Request(`${cloudOrigin}/sabik-connect`), context)).status, 503);
});
test('exact PR preview origin works without an immutable-deploy configuration cycle', async t => {
  const origin = 'https://deploy-preview-244--irisgreen-home.netlify.app';
  const p = pair({ origin }); t.after(() => p.close());
  const result = await createRetrievalQuery({ transport: p.connection.transport, library })({ query: 'sensorial' });
  assert.ok(result.groups.length);
  const handler = createTeamTransportHandler({ qaHandler: qa, env: key => key === 'N04_WEB_ALLOWED_ORIGIN' ? origin : config[key] });
  const document = await handler(new Request(cloudOrigin+'/sabik-connect'), context);
  assert.equal(document.status, 200); assert.ok((await document.text()).includes(origin));
});
test('origin formats never allow production, wildcard, paths or foreign preview sites', async () => {
  for (const origin of ['https://irisgreen.eu', 'https://irisgreen-home.netlify.app', 'https://*--irisgreen-home.netlify.app',
    'https://deploy-preview-244--attacker.netlify.app', 'https://deploy-preview-244--irisgreen-home.netlify.app/path', 'https://deploy-preview-0--irisgreen-home.netlify.app']) {
    const handler = createTeamTransportHandler({ qaHandler: qa, env: key => key === 'N04_WEB_ALLOWED_ORIGIN' ? origin : config[key] });
    assert.equal((await handler(new Request(cloudOrigin+'/sabik-connect'), context)).status, 503);
    assert.equal(startCloudConnection({ host: { opener: {} }, allowedOrigin: origin }), null);
  }
});
test('private HTTP correlation exposes only current status and permitted provenance, never a query or secret', async t => {
  const p = pair({ fetch: () => new Response('{}', { headers: { 'content-type': 'application/json',
    'x-sabik-code-head': 'a'.repeat(40), 'x-sabik-library-deploy': 'b'.repeat(24), 'set-cookie': fixtureSecret } }) }); t.after(() => p.close());
  await p.connection.transport({ query: 'synthetic-current-query' });
  assert.deepEqual(p.peer.document.documentElement.dataset, { n04Request: '1', n04Status: '200', n04ContentType: 'application/json', n04CodeHead: 'a'.repeat(40), n04LibraryDeploy: 'b'.repeat(24) });
  await p.connection.transport({ query: 'next-synthetic-query' });
  assert.equal(p.peer.document.documentElement.dataset.n04Request, '2');
  assert.equal(JSON.stringify(p.peer.document.documentElement.dataset).includes('query'), false);
});
