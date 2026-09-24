// Build/release helper only; not part of the Function import graph.
import { digest } from '../src/library.mjs';
export async function assertAbsentOrIdentical(store, key, expected) {
  const existing = await store.get(key, { type: 'arrayBuffer', consistency: 'strong' });
  if (existing === null) return false;
  if (digest(new Uint8Array(existing)) !== digest(expected)) throw new Error('Sealed key conflict; use a new deployment');
  return true;
}
export async function immutablePut(store, key, expected) {
  if (await assertAbsentOrIdentical(store, key, expected)) return 'already-identical';
  await store.set(key, expected, { onlyIfNew: true });
  if (!await assertAbsentOrIdentical(store, key, expected)) throw new Error('Immutable write readback failed');
  return 'created-and-readback-verified';
}
