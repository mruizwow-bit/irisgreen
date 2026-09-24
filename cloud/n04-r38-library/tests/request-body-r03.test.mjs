import test from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { createQAHandler } from '../src/qa-handler.mjs';
import { RELEASE } from '../src/library.mjs';

const token = 'LOCAL-BODY-TEST-NOT-A-LIVE-CREDENTIAL';
const context = { deploy: { id: 'a'.repeat(24) } };
const encode = text => new TextEncoder().encode(text);
function setup({ timeoutMs = 30, retrievalWait } = {}) {
  let calls = 0;
  const retrieval = {
    async retrieveForSabik() { calls++; if (retrievalWait) await retrievalWait; return { library_version: RELEASE.version, candidates: [] }; },
    async getLibraryInfo() { return { build_head: 'b'.repeat(40) }; },
  };
  return { handler: createQAHandler({ retrieval, timeoutMs, env: key => key === 'N04_SMOKE_TOKEN' ? token : undefined }),
    get calls() { return calls; } };
}
function streamRequest({ start, cancel, signal } = {}) {
  const body = new ReadableStream({ start, cancel });
  return new Request('https://local.invalid/internal/n04/library/search', { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-n04-smoke-token': token }, body, duplex: 'half', signal });
}
async function bounded(promise) {
  let timer;
  try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Request did not settle')), 500); })]); }
  finally { clearTimeout(timer); }
}
async function closed(response, outcome) {
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('X-Sabik-Request-Outcome'), outcome);
  assert.deepEqual(await response.json(), { error: 'library_unavailable' });
}

test('incomplete body times out, cancels only its reader, releases lock and never calls retrieval', async () => {
  let cancelled = 0; const subject = setup();
  const req = streamRequest({ start(c) { c.enqueue(encode('{"q":"sens')); }, cancel() { cancelled++; } });
  await closed(await bounded(subject.handler(req, context)), 'REQUEST_TIMEOUT');
  assert.equal(cancelled, 1); assert.equal(req.body.locked, false); assert.equal(subject.calls, 0);
});

test('abort during a pending read settles without completing JSON or leaking its private reason', async () => {
  let cancelled = 0; const controller = new AbortController(); const subject = setup({ timeoutMs: 5_000 });
  const req = streamRequest({ signal: controller.signal, start(c) { c.enqueue(encode('{')); }, cancel() { cancelled++; } });
  const pending = subject.handler(req, context);
  await delay(5); controller.abort('private reason never serialize');
  await closed(await bounded(pending), 'REQUEST_CANCELLED');
  assert.equal(cancelled, 1); assert.equal(req.body.locked, false); assert.equal(subject.calls, 0);
});

test('pre-aborted body is cancelled before any retrieval work', async () => {
  let cancelled = 0; const signal = AbortSignal.abort('private'); const subject = setup();
  const req = streamRequest({ signal, cancel() { cancelled++; } });
  await closed(await bounded(subject.handler(req, context)), 'REQUEST_CANCELLED');
  assert.equal(cancelled, 1); assert.equal(subject.calls, 0); assert.equal(req.body.locked, false);
});

for (const mode of ['never resolves', 'rejects']) {
  test(`underlying stream cancellation that ${mode} cannot retain the request or cause an unhandled rejection`, async () => {
    const subject = setup(); let cancelled = 0;
    const req = streamRequest({ cancel() { cancelled++; return mode === 'rejects' ? Promise.reject(new Error('private cancel failure')) : new Promise(() => {}); } });
    await closed(await bounded(subject.handler(req, context)), 'REQUEST_TIMEOUT');
    assert.equal(cancelled, 1); assert.equal(req.body.locked, false); assert.equal(subject.calls, 0);
    await delay(0);
  });
}

test('oversized streamed body is rejected promptly even when cancel never resolves', async () => {
  let cancelled = 0; const subject = setup({ timeoutMs: 500 });
  const req = streamRequest({ start(c) { c.enqueue(encode('x'.repeat(2_049))); }, cancel() { cancelled++; return new Promise(() => {}); } });
  const response = await bounded(subject.handler(req, context));
  assert.equal(response.status, 400); assert.deepEqual(await response.json(), { error: 'invalid_request' });
  assert.equal(subject.calls, 0); assert.equal(cancelled, 1); assert.equal(req.body.locked, false);
});

test('exactly 2048 bytes including whitespace are accepted across chunks', async () => {
  const subject = setup({ timeoutMs: 1_000 }); const json = JSON.stringify({ q: 'sensorial' });
  const data = encode(json + ' '.repeat(2_048 - encode(json).length));
  const req = streamRequest({ start(c) { c.enqueue(data.slice(0, 9)); c.enqueue(data.slice(9)); c.close(); } });
  const response = await bounded(subject.handler(req, context));
  assert.equal(response.status, 200); assert.equal(subject.calls, 1); assert.equal(req.body.locked, false);
});

test('the body limit counts encoded bytes rather than characters', async () => {
  const subject = setup(); const text = JSON.stringify({ q: 'sensorial' }) + 'é'.repeat(1_100);
  assert.ok(text.length < 2_048); assert.ok(encode(text).length > 2_048);
  const req = streamRequest({ start(c) { c.enqueue(encode(text)); c.close(); } });
  assert.equal((await subject.handler(req, context)).status, 400); assert.equal(subject.calls, 0);
});

test('malformed JSON and a failing source retain safe invalid_request errors', async () => {
  for (const start of [c => { c.enqueue(encode('{bad')); c.close(); }, c => c.error(new Error('private source failure'))]) {
    const subject = setup(); const req = streamRequest({ start });
    const response = await bounded(subject.handler(req, context));
    assert.equal(response.status, 400); assert.deepEqual(await response.json(), { error: 'invalid_request' });
    assert.equal(subject.calls, 0); assert.equal(req.body.locked, false);
  }
});

test('body reading spends the same deadline budget rather than receiving a second full timeout', async () => {
  let controller; const subject = setup({ timeoutMs: 80, retrievalWait: delay(10) });
  const req = streamRequest({ start(c) { controller = c; } });
  const pending = subject.handler(req, context);
  // Force synchronous work at body completion to exceed the total deadline.
  await delay(5);
  controller.enqueue(encode('{"q":"sensorial"}')); controller.close();
  const until = performance.now() + 90; while (performance.now() < until) { /* blocked event loop */ }
  await closed(await bounded(pending), 'REQUEST_TIMEOUT');
  assert.equal(subject.calls, 0); assert.equal(req.body.locked, false);
});

test('one incomplete request cannot block another normal request', async () => {
  const subject = setup({ timeoutMs: 100 });
  const incomplete = streamRequest();
  const first = subject.handler(incomplete, context);
  const normal = streamRequest({ start(c) { c.enqueue(encode('{"q":"sensorial"}')); c.close(); } });
  assert.equal((await bounded(subject.handler(normal, context))).status, 200);
  await closed(await bounded(first), 'REQUEST_TIMEOUT');
  assert.equal(subject.calls, 1);
});

test('retrieval receives only the remaining time after a slow valid body', async () => {
  let controller; let calls = 0;
  const handler = createQAHandler({ timeoutMs: 150, env: key => key === 'N04_SMOKE_TOKEN' ? token : undefined,
    retrieval: {
      async retrieveForSabik() { calls++; await delay(80); return { library_version: RELEASE.version, candidates: [] }; },
      async getLibraryInfo() { return { build_head: 'b'.repeat(40) }; },
    } });
  const req = streamRequest({ start(c) { controller = c; } });
  const pending = handler(req, context);
  await delay(100); controller.enqueue(encode('{"q":"sensorial"}')); controller.close();
  await closed(await bounded(pending), 'REQUEST_TIMEOUT');
  assert.equal(calls, 1);
  await delay(80); // The late retrieval result cannot replace the timeout response.
});
