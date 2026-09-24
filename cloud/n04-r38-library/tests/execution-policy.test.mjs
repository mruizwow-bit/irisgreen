import test from 'node:test';
import assert from 'node:assert/strict';
import { LibraryError } from '../src/library.mjs';
import { SabikRetrievalError } from '../src/sabik-retrieval.mjs';
import { runRetrievalTask, mapRetrievalError } from '../src/execution-policy.mjs';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};
async function rejectsCode(promise, code) {
  await assert.rejects(promise, error => {
    assert.equal(error.code, code);
    assert.equal(error.message, code);
    assert.doesNotMatch(String(error), /private|secret|backend diagnostic|stack detail/i);
    return true;
  });
}

test('rejects an already-aborted caller before work starts', async () => {
  const controller = new AbortController(); controller.abort('private-reason');
  let started = false;
  await rejectsCode(runRetrievalTask(() => { started = true; }, { signal: controller.signal, timeoutMs: 50 }), 'RETRIEVAL_CANCELLED');
  assert.equal(started, false);
});

test('caller abort stops waiting, aborts only request signal and ignores late success', async () => {
  const caller = new AbortController(); const pending = deferred(); let seenSignal;
  const result = runRetrievalTask(({ signal }) => { seenSignal = signal; return pending.promise; }, { signal: caller.signal, timeoutMs: 100 });
  await Promise.resolve();
  caller.abort('private-reason');
  await rejectsCode(result, 'RETRIEVAL_CANCELLED');
  assert.equal(seenSignal.aborted, true);
  pending.resolve({ late: true });
  await delay(0);
});

test('timeout is distinct from cancellation and consumes a late rejection', async () => {
  const pending = deferred(); let seenSignal;
  const result = runRetrievalTask(({ signal }) => { seenSignal = signal; return pending.promise; }, { timeoutMs: 10 });
  await rejectsCode(result, 'RETRIEVAL_TIMEOUT');
  assert.equal(seenSignal.aborted, true);
  pending.reject(new Error('private late backend diagnostic'));
  await delay(0);
});

test('success before deadline resolves exactly once', async () => {
  let calls = 0;
  const result = await runRetrievalTask(async ({ signal }) => {
    calls++; assert.equal(signal.aborted, false); await delay(1); return { ok: true };
  }, { timeoutMs: 100 });
  assert.deepEqual(result, { ok: true });
  assert.equal(calls, 1);
});

test('engine failures are sanitized through the existing R39 mapping', async () => {
  const cases = [
    [new SabikRetrievalError('LIBRARY_UNAVAILABLE'), 'LIBRARY_UNAVAILABLE'],
    [new LibraryError('wrong_version'), 'LIBRARY_VERSION_MISMATCH'],
    [new LibraryError('corpus_integrity_mismatch'), 'LIBRARY_INTEGRITY_ERROR'],
    [new LibraryError('invalid_query'), 'INVALID_RETRIEVAL_QUERY'],
    [new Error('private query=secret-value stack detail'), 'LIBRARY_UNAVAILABLE'],
  ];
  for (const [source, expected] of cases) {
    assert.equal(mapRetrievalError(source), expected);
    await rejectsCode(runRetrievalTask(() => Promise.reject(source), { timeoutMs: 50 }), expected);
  }
});

test('two callers may share an immutable load; cancelling one does not cancel the shared load', async () => {
  const shared = deferred(); let sharedConsumers = 0;
  const work = async ({ signal }) => {
    sharedConsumers++;
    const library = await shared.promise; // Shared load deliberately receives no request signal.
    if (signal.aborted) return { ignored: true };
    return library;
  };
  const firstController = new AbortController();
  const first = runRetrievalTask(work, { signal: firstController.signal, timeoutMs: 100 });
  const second = runRetrievalTask(work, { timeoutMs: 100 });
  await Promise.resolve();
  firstController.abort();
  await rejectsCode(first, 'RETRIEVAL_CANCELLED');
  shared.resolve({ version: 'immutable' });
  assert.deepEqual(await second, { version: 'immutable' });
  assert.equal(sharedConsumers, 2);
});

test('caller abort listener is removed on success and on timeout', async () => {
  function trackedSignal() {
    const controller = new AbortController(); let adds = 0; let removes = 0;
    return {
      controller,
      signal: {
        get aborted() { return controller.signal.aborted; },
        addEventListener(...args) { adds++; return controller.signal.addEventListener(...args); },
        removeEventListener(...args) { removes++; return controller.signal.removeEventListener(...args); },
      },
      counts: () => ({ adds, removes }),
    };
  }
  const success = trackedSignal();
  assert.equal(await runRetrievalTask(() => 'ok', { signal: success.signal, timeoutMs: 50 }), 'ok');
  assert.deepEqual(success.counts(), { adds: 1, removes: 1 });

  const timed = trackedSignal();
  await rejectsCode(runRetrievalTask(() => new Promise(() => {}), { signal: timed.signal, timeoutMs: 5 }), 'RETRIEVAL_TIMEOUT');
  assert.deepEqual(timed.counts(), { adds: 1, removes: 1 });
});

test('invalid execution configuration fails before invoking work and has no hidden timeout default', async () => {
  let starts = 0;
  for (const timeoutMs of [undefined, 0, -1, Infinity, NaN]) {
    await assert.rejects(runRetrievalTask(() => { starts++; }, { timeoutMs }), /INVALID_RETRIEVAL_TIMEOUT/);
  }
  await assert.rejects(runRetrievalTask(null, { timeoutMs: 1 }), /INVALID_RETRIEVAL_WORK/);
  assert.equal(starts, 0);
});
