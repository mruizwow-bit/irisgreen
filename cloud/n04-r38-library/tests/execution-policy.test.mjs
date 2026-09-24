import test from 'node:test';
import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { setImmediate as nextTurn } from 'node:timers/promises';
import { readFile } from 'node:fs/promises';
import { runRetrievalTask, RetrievalExecutionError, EXECUTION_CODES } from '../src/execution-policy.mjs';
import { SabikRetrievalError, RETRIEVAL_CODES } from '../src/sabik-retrieval.mjs';
import { createSabikRetrievalForDeployment } from '../src/sabik-retrieval-server.mjs';
import { BINDING, RELEASE, createManifest } from '../src/library.mjs';

const deferred = () => {
  let resolve; let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const internalError = (promise, code) => assert.rejects(promise, error => {
  assert.ok(error instanceof RetrievalExecutionError);
  assert.equal(error.code, code); assert.equal(error.message, code);
  assert.equal(error.cause, undefined); return true;
});
function timerEvidence(t) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const created = t.mock.method(globalThis, 'setTimeout');
  const cleared = t.mock.method(globalThis, 'clearTimeout');
  return { assertClean(signal) {
    assert.equal(cleared.mock.calls.length, created.mock.calls.length);
    for (const call of created.mock.calls) {
      assert.ok(cleared.mock.calls.some(c => c.arguments[0] === call.result));
    }
    if (signal) assert.equal(getEventListeners(signal, 'abort').length, 0);
  } };
}
test('internal outcomes do not extend the four public R39 error codes', () => {
  assert.deepEqual(EXECUTION_CODES, ['REQUEST_CANCELLED', 'REQUEST_TIMEOUT', 'INVALID_EXECUTION_OPTIONS']);
  assert.equal(RETRIEVAL_CODES.length, 4);
  assert.equal(new RetrievalExecutionError('private failure').code, 'INVALID_EXECUTION_OPTIONS');
});
const invalid = [
  ['missing options', undefined], ['null options', null], ['array options', []],
  ['missing timeout', {}], ['zero timeout', { timeoutMs: 0 }], ['negative timeout', { timeoutMs: -1 }],
  ['fractional timeout', { timeoutMs: 1.5 }], ['string timeout', { timeoutMs: '5' }],
  ['NaN timeout', { timeoutMs: NaN }], ['infinite timeout', { timeoutMs: Infinity }],
  ['overflow timer', { timeoutMs: 2147483648 }], ['inherited timeout', Object.create({ timeoutMs: 50 })],
  ['extra data', { timeoutMs: 50, secret: 'private' }], ['symbol option', { timeoutMs: 50, [Symbol()]: 1 }],
  ['getter option', { get timeoutMs() { assert.fail('getter must not run'); } }],
  ['null signal', { timeoutMs: 50, signal: null }], ['signal impostor', { timeoutMs: 50, signal: { aborted: false } }],
];
for (const [label, options] of invalid) test(`rejects ${label} before work`, async t => {
  const timers = timerEvidence(t);
  await internalError(runRetrievalTask(() => assert.fail('work ran'), options), 'INVALID_EXECUTION_OPTIONS');
  timers.assertClean();
});
test('rejects non-callable work with sanitized options error', async () => {
  await internalError(runRetrievalTask(Promise.resolve('unused'), { timeoutMs: 50 }), 'INVALID_EXECUTION_OPTIONS');
});
test('accepts the maximum supported explicit delay and null-prototype options', async t => {
  const timers = timerEvidence(t);
  const options = Object.assign(Object.create(null), { timeoutMs: 2147483647 });
  assert.equal(await runRetrievalTask(() => 42, options), 42);
  timers.assertClean();
});
test('successful work receives no signal or arguments and cleans resources', async t => {
  const timers = timerEvidence(t); const controller = new AbortController();
  const result = { candidates: [] };
  assert.equal(await runRetrievalTask(function () {
    assert.equal(arguments.length, 0); return Promise.resolve(result);
  }, { signal: controller.signal, timeoutMs: 1000 }), result);
  timers.assertClean(controller.signal);
  controller.abort(new Error('private reason after completion'));
});
for (const code of RETRIEVAL_CODES) test(`preserves sanitized R39 code ${code}`, async t => {
  const timers = timerEvidence(t); const controller = new AbortController();
  const source = new SabikRetrievalError(code); source.cause = new Error('private');
  await assert.rejects(runRetrievalTask(() => { throw source; }, { signal: controller.signal, timeoutMs: 1000 }), error => {
    assert.ok(error instanceof SabikRetrievalError); assert.notEqual(error, source);
    assert.equal(error.code, code); assert.equal(error.message, code); assert.equal(error.cause, undefined); return true;
  });
  timers.assertClean(controller.signal);
});
test('sanitizes unknown rejection without copying its message or cause', async t => {
  const timers = timerEvidence(t);
  await assert.rejects(runRetrievalTask(() => Promise.reject(new Error('secret query')), { timeoutMs: 1000 }), error => {
    assert.equal(error.code, 'LIBRARY_UNAVAILABLE'); assert.equal(error.message, 'LIBRARY_UNAVAILABLE');
    assert.equal(error.cause, undefined); return true;
  });
  timers.assertClean();
});
test('pre-cancelled request never starts work or a timer and ignores abort reason', async t => {
  const timers = timerEvidence(t); const controller = new AbortController(); controller.abort(new Error('private reason'));
  await internalError(runRetrievalTask(() => assert.fail('work ran'), { signal: controller.signal, timeoutMs: 1000 }), 'REQUEST_CANCELLED');
  timers.assertClean(controller.signal);
});
test('cancellation before the scheduled start never invokes work', async t => {
  const timers = timerEvidence(t); const controller = new AbortController();
  const task = runRetrievalTask(() => assert.fail('work ran'), { signal: controller.signal, timeoutMs: 1000 });
  const rejection = internalError(task, 'REQUEST_CANCELLED'); controller.abort('private'); await rejection;
  timers.assertClean(controller.signal);
});
test('cancellation during work discards a later resolution and releases listeners', async t => {
  const timers = timerEvidence(t); const controller = new AbortController(); const source = deferred();
  let published = 0; let started = 0;
  const task = runRetrievalTask(() => { started++; return source.promise; }, { signal: controller.signal, timeoutMs: 1000 });
  const observed = task.then(value => { published++; return value; });
  const rejection = internalError(observed, 'REQUEST_CANCELLED');
  await Promise.resolve(); assert.equal(started, 1); controller.abort(); await rejection;
  timers.assertClean(controller.signal);
  source.resolve('late'); await nextTurn(); assert.equal(published, 0);
});
test('timeout happens at the explicit boundary and consumes a later rejection', async t => {
  const timers = timerEvidence(t); const controller = new AbortController(); const source = deferred();
  let settled = false; const unhandled = [];
  const listener = reason => unhandled.push(reason); process.on('unhandledRejection', listener);
  try {
    const task = runRetrievalTask(() => source.promise, { signal: controller.signal, timeoutMs: 1000 });
    const rejection = internalError(task, 'REQUEST_TIMEOUT').then(() => { settled = true; });
    await Promise.resolve(); t.mock.timers.tick(999); await Promise.resolve(); assert.equal(settled, false);
    t.mock.timers.tick(1); await rejection; timers.assertClean(controller.signal);
    source.reject(new Error('late private query')); await nextTurn(); await nextTurn();
    assert.deepEqual(unhandled, []);
  } finally { process.off('unhandledRejection', listener); }
});
test('timeout before start skips work, and later abort cannot change the outcome', async t => {
  const timers = timerEvidence(t); const controller = new AbortController();
  const task = runRetrievalTask(() => assert.fail('work ran'), { signal: controller.signal, timeoutMs: 1000 });
  const rejection = internalError(task, 'REQUEST_TIMEOUT'); t.mock.timers.tick(1000); controller.abort();
  await rejection; timers.assertClean(controller.signal);
});
for (const reject of [false, true]) test(`deadline rejects a synchronous late ${reject ? 'error' : 'result'} before timer callback`, async t => {
  const timers = timerEvidence(t); let monotonicTime = 100;
  t.mock.method(performance, 'now', () => monotonicTime);
  const task = runRetrievalTask(() => {
    monotonicTime = 1100;
    if (reject) throw new Error('private late error');
    return 'must not publish';
  }, { timeoutMs: 1000 });
  await internalError(task, 'REQUEST_TIMEOUT'); timers.assertClean();
});
test('cancellation consumes a late rejection as well as a late resolution', async t => {
  const timers = timerEvidence(t); const controller = new AbortController(); const source = deferred();
  const task = runRetrievalTask(() => source.promise, { signal: controller.signal, timeoutMs: 1000 });
  const rejection = internalError(task, 'REQUEST_CANCELLED'); await Promise.resolve(); controller.abort(); await rejection;
  source.reject(new Error('private late failure')); await nextTurn(); timers.assertClean(controller.signal);
});

for (const outcome of ['cancel', 'timeout']) test(`two real R39 consumers share one index load after first consumer ${outcome}`, async t => {
  const timers = timerEvidence(t); const ready = deferred(); const entered = deferred(); const first = new AbortController();
  const raw = await readFile(new URL('../../n04-r26-staging-binding/source/iris-fragments-index.es.json', import.meta.url));
  const manifest = Buffer.from(JSON.stringify(createManifest({
    build_head: 'a'.repeat(40), build_tree: 'b'.repeat(40), engine_sha256: 'c'.repeat(64),
  })));
  let reads = 0; let stores = 0;
  const adapter = createSabikRetrievalForDeployment({ libraryDeployId: 'a'.repeat(24), storeFactory: () => {
    stores++;
    return { get: async (key, options) => {
      reads++; assert.equal(options.signal, undefined);
      if (key === BINDING.manifestKey) { entered.resolve(); await ready.promise; return manifest; }
      assert.equal(key, BINDING.corpusKey); return raw;
    } };
  } });
  const a = runRetrievalTask(() => adapter.retrieveForSabik({ query: 'educación' }), { signal: first.signal, timeoutMs: 1000 });
  const aRejected = internalError(a, outcome === 'cancel' ? 'REQUEST_CANCELLED' : 'REQUEST_TIMEOUT');
  const b = runRetrievalTask(() => adapter.retrieveForSabik({ query: 'educación' }), { timeoutMs: 10000 });
  await entered.promise;
  if (outcome === 'cancel') first.abort('private'); else t.mock.timers.tick(1000);
  await aRejected; ready.resolve();
  const result = await b;
  assert.equal(result.library_version, RELEASE.version); assert.ok(result.candidates.length > 0);
  assert.equal(stores, 1); assert.equal(reads, 2);
  // The same completed index remains usable; no replacement fetch or abort reaches it.
  const cached = await runRetrievalTask(() => adapter.retrieveForSabik({ query: 'educación' }), { timeoutMs: 10000 });
  assert.deepEqual(cached, result); assert.equal(reads, 2); assert.equal(stores, 1);
  timers.assertClean(first.signal);
});
