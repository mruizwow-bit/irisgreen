import test from 'node:test';
import assert from 'node:assert/strict';
import { SabikRetrievalError } from '../src/sabik-retrieval.mjs';
import { R38_LIBRARY_DEPLOY_ID, createR39RuntimeTransport } from '../src/r39-runtime-transport.mjs';

function assertCode(error, code) {
  assert.ok(error instanceof SabikRetrievalError);
  assert.equal(error.code, code);
  assert.equal(error.message, code);
  return true;
}

function stubFactory(calls, implementation = async input => ({ input })) {
  return options => {
    calls.factories.push(options);
    return {
      retrieveForSabik: async input => {
        calls.inputs.push(input);
        return implementation(input);
      },
    };
  };
}

test('binds only the sealed R38 library deployment and maps the validated HTTP body to R39 input', async () => {
  const calls = { factories: [], inputs: [] };
  const transport = createR39RuntimeTransport({ createRetrieval: stubFactory(calls) });
  const result = await transport.retrieve({ q: 'sobrecarga sensorial', limit: 3, version: 'n04-es-20260916-56f72c4d3959' });
  assert.deepEqual(calls.factories, [{ libraryDeployId: R38_LIBRARY_DEPLOY_ID }]);
  assert.deepEqual(calls.inputs, [{ query: 'sobrecarga sensorial', limit: 3, libraryVersion: 'n04-es-20260916-56f72c4d3959' }]);
  assert.deepEqual(result, { input: calls.inputs[0] });
});

test('request data cannot select a deployment or add transport fields', async () => {
  const calls = { factories: [], inputs: [] };
  const transport = createR39RuntimeTransport({ createRetrieval: stubFactory(calls) });
  await assert.rejects(transport.retrieve({ q: 'apoyos', deployId: 'f'.repeat(24) }), error => assertCode(error, 'INVALID_RETRIEVAL_QUERY'));
  await assert.rejects(transport.retrieve({ q: 'apoyos', libraryDeployId: 'f'.repeat(24) }), error => assertCode(error, 'INVALID_RETRIEVAL_QUERY'));
  assert.deepEqual(calls.inputs, []);
});

test('foreign or malformed server-side deployment identity fails before retrieval construction', () => {
  let called = false;
  for (const libraryDeployId of ['f'.repeat(24), 'user-provided-invalid', '', null]) {
    assert.throws(() => createR39RuntimeTransport({
      libraryDeployId,
      createRetrieval: () => { called = true; return { retrieveForSabik() {} }; },
    }), error => assertCode(error, 'LIBRARY_UNAVAILABLE'));
  }
  assert.equal(called, false);
});

test('one retrieval composition is shared across calls and query/result caching is not introduced here', async () => {
  const calls = { factories: [], inputs: [] };
  const transport = createR39RuntimeTransport({ createRetrieval: stubFactory(calls, async input => ({ marker: input.query })) });
  const [a, b, c] = await Promise.all([
    transport.retrieve({ q: 'apoyos' }),
    transport.retrieve({ q: 'sensorial', limit: 2 }),
    transport.retrieve({ q: 'lectura f\u00e1cil' }),
  ]);
  assert.equal(calls.factories.length, 1);
  assert.deepEqual(calls.inputs.map(input => input.query), ['apoyos', 'sensorial', 'lectura f\u00e1cil']);
  assert.deepEqual([a.marker, b.marker, c.marker], ['apoyos', 'sensorial', 'lectura f\u00e1cil']);
});

test('safe R39 retrieval errors propagate without transport-specific detail', async () => {
  const transport = createR39RuntimeTransport({
    createRetrieval: () => ({ retrieveForSabik: async () => { throw new SabikRetrievalError('LIBRARY_UNAVAILABLE'); } }),
  });
  await assert.rejects(transport.retrieve({ q: 'apoyos' }), error => assertCode(error, 'LIBRARY_UNAVAILABLE'));
});

test('invalid factory and invalid parsed body fail closed', async () => {
  assert.throws(() => createR39RuntimeTransport({ createRetrieval: () => ({}) }), error => assertCode(error, 'LIBRARY_UNAVAILABLE'));
  const transport = createR39RuntimeTransport({ createRetrieval: () => ({ retrieveForSabik: async input => input }) });
  for (const value of [undefined, null, [], 'apoyos']) {
    await assert.rejects(transport.retrieve(value), error => assertCode(error, 'INVALID_RETRIEVAL_QUERY'));
  }
  const getter = {};
  Object.defineProperty(getter, 'q', { get() { assert.fail('getter must not run'); }, enumerable: true });
  await assert.rejects(transport.retrieve(getter), error => assertCode(error, 'INVALID_RETRIEVAL_QUERY'));
});
