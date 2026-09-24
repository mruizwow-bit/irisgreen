import { createHash } from 'node:crypto';

export const RELEASE = Object.freeze({
  version: 'n04-es-20260916-56f72c4d3959',
  sha256: '56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e',
  sourceGitBlob: '0e297c977ce3b688186ca917981458adfd5e5ca3',
  sourceDate: '2026-09-16T08:27:36.026851Z', bytes: 2553061, count: 4332,
});
export const BINDING = Object.freeze({
  store: 'sabik-n04-corpus', kind: 'named-deploy-store', region: 'us-east-2', manifestKey: 'manifest.json',
  corpusKey: `versions/${RELEASE.version}/corpus.json`,
});
export class LibraryError extends Error {
  constructor(code) { super(code); this.name = 'LibraryError'; this.code = code; }
}
const fail = code => { throw new LibraryError(code); };
const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x);
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
function bytesOf(value, max) {
  let bytes;
  if (value instanceof ArrayBuffer) bytes = new Uint8Array(value);
  else if (ArrayBuffer.isView(value)) bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  else fail('invalid_blob_type');
  if (bytes.byteLength > max) fail('blob_too_large');
  return bytes;
}
function parse(bytes) {
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { fail('invalid_blob_json'); }
}
// Separately exported for negative structural tests. Runtime always verifies bytes first.
export function validateCorpusStructure(corpus) {
  if (!plain(corpus) || corpus.language !== 'es' || corpus.base_url !== 'https://irisgreen.eu' ||
      corpus.generated_at !== RELEASE.sourceDate || corpus.fragment_count !== RELEASE.count ||
      !Array.isArray(corpus.fragments) || corpus.fragments.length !== RELEASE.count) fail('corpus_count_or_metadata_mismatch');
  const ids = new Set();
  const fields = new Set(['id', 'url', 'title', 'heading', 'text', 'concepts', 'editorial_status', 'source_type']);
  for (const f of corpus.fragments) {
    if (!plain(f) || Object.keys(f).some(k => !fields.has(k)) ||
        ['id', 'url', 'text', 'title', 'heading', 'source_type'].some(k => typeof f[k] !== 'string') ||
        !f.id || !f.text || f.editorial_status !== 'PUBLICABLE' || !Array.isArray(f.concepts) ||
        f.concepts.some(c => typeof c !== 'string')) fail('invalid_publicable_fragment');
    let url; try { url = new URL(f.url); } catch { fail('invalid_source_url'); }
    if (url.origin !== 'https://irisgreen.eu' || url.username || url.password) fail('invalid_source_url');
    if (ids.has(f.id)) fail('duplicate_fragment_id');
    ids.add(f.id);
  }
  if (ids.size !== RELEASE.count) fail('fragment_identity_mismatch');
  return corpus;
}
export function verifyCorpus(value) {
  const bytes = bytesOf(value, RELEASE.bytes);
  if (bytes.byteLength !== RELEASE.bytes || digest(bytes) !== RELEASE.sha256) fail('corpus_integrity_mismatch');
  return validateCorpusStructure(parse(bytes));
}
export function createManifest(provenance) {
  return {
    schema: 'SABIK_N04_LIBRARY_MANIFEST/1.0', version: RELEASE.version,
    corpus_sha256: RELEASE.sha256, corpus_bytes: RELEASE.bytes,
    fragment_count: RELEASE.count, unique_ids: RELEASE.count,
    source_date: RELEASE.sourceDate, source_git_blob: RELEASE.sourceGitBlob,
    corpus_key: BINDING.corpusKey, storage_kind: BINDING.kind, store: BINDING.store,
    region: BINDING.region, language: 'es', created_at: new Date().toISOString(), provenance,
  };
}
export function verifyManifest(manifest) {
  if (!plain(manifest)) fail('invalid_manifest');
  const expected = createManifest(null);
  for (const key of Object.keys(expected).filter(k => !['created_at', 'provenance'].includes(k))) {
    if (manifest[key] !== expected[key]) fail('manifest_identity_mismatch');
  }
  if (typeof manifest.created_at !== 'string' || !Number.isFinite(Date.parse(manifest.created_at)) ||
      !plain(manifest.provenance) ||
      !/^[a-f0-9]{40}$/.test(manifest.provenance.build_head ?? '') ||
      !/^[a-f0-9]{40}$/.test(manifest.provenance.build_tree ?? '') ||
      !/^[a-f0-9]{64}$/.test(manifest.provenance.engine_sha256 ?? '')) fail('invalid_provenance');
  return manifest;
}
export function assertVersion(version = RELEASE.version) {
  if (version !== RELEASE.version) fail('wrong_version');
  return version;
}
export function terms(text) {
  return [...new Set(text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [])];
}
function validateSearch({ query, limit = 5, filters = {}, version = RELEASE.version } = {}) {
  assertVersion(version);
  if (typeof query !== 'string' || query.length > 300 || !query.trim() || terms(query).length > 32) fail('invalid_query');
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) fail('invalid_limit');
  if (!plain(filters) || Object.keys(filters).some(k => !['source_type', 'editorial_status', 'url', 'concepts'].includes(k))) fail('invalid_filters');
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'concepts') {
      if (!Array.isArray(value) || value.length > 10 || value.some(v => typeof v !== 'string' || !v || v.length > 256)) fail('invalid_filters');
    } else if (typeof value !== 'string' || !value || value.length > 2048) fail('invalid_filters');
  }
  return { query, limit, filters };
}
function matches(f, filters) {
  return Object.entries(filters).every(([key, value]) => key === 'concepts' ? value.every(c => f.concepts.includes(c)) : f[key] === value);
}
function result(f, score) {
  return freeze({ fragment_id: f.id, snippet: f.text.slice(0, 480), url: f.url,
    title: f.title, heading: f.heading, source_type: f.source_type,
    editorial_status: f.editorial_status, concepts: [...f.concepts], score, library_version: RELEASE.version });
}
function createIndex(corpus) {
  const byId = new Map(); const postings = new Map();
  corpus.fragments.forEach((f, n) => {
    byId.set(f.id, f);
    for (const [text, weight] of [[f.text, 1], [f.title, 4], [f.heading, 3], [f.concepts.join(' '), 3]]) {
      for (const term of terms(text)) {
        if (!postings.has(term)) postings.set(term, new Map());
        const entry = postings.get(term); entry.set(n, (entry.get(n) ?? 0) + weight);
      }
    }
  });
  return {
    getFragment: id => typeof id === 'string' ? byId.get(id) ?? null : null,
    searchLibrary(args) {
      const { query, limit, filters } = validateSearch(args);
      const scores = new Map();
      for (const term of terms(query)) {
        for (const [n, weight] of postings.get(term) ?? []) scores.set(n, (scores.get(n) ?? 0) + 100 + weight);
      }
      return Object.freeze([...scores].filter(([n]) => matches(corpus.fragments[n], filters))
        .sort(([a, sa], [b, sb]) => sb - sa || (corpus.fragments[a].id < corpus.fragments[b].id ? -1 : 1))
        .slice(0, limit).map(([n, score]) => result(corpus.fragments[n], score)));
    },
  };
}
async function read(store, key, maximum, missing) {
  let value; try { value = await store.get(key, { type: 'arrayBuffer', consistency: 'strong' }); }
  catch { fail('storage_unavailable'); }
  if (value == null) fail(missing);
  return bytesOf(value, maximum);
}
export async function loadLibrary(store) {
  if (!store || typeof store.get !== 'function') fail('invalid_storage_adapter');
  const manifest = freeze(verifyManifest(parse(await read(store, BINDING.manifestKey, 16384, 'manifest_missing'))));
  const corpus = freeze(verifyCorpus(await read(store, BINDING.corpusKey, RELEASE.bytes, 'corpus_missing')));
  const index = createIndex(corpus);
  // Corpus is not exposed to HTTP adapters. Exact lookup is server-only.
  return Object.freeze({ manifest, ...index });
}
// One immutable deployment/version entry per Function instance. No query/result cache.
export function createCachedReader(getDeployStore) {
  let cache;
  return async ({ deployId, version = RELEASE.version }) => {
    assertVersion(version);
    if (!/^[a-f0-9]{24}$/.test(deployId ?? '')) fail('invalid_deploy_context');
    const key = `${deployId}:${version}`;
    if (!cache || cache.key !== key) {
      const entry = { key };
      entry.promise = Promise.resolve().then(() => loadLibrary(getDeployStore({ name: BINDING.store, region: BINDING.region, deployID: deployId, consistency: 'strong' })))
        .catch(error => { if (cache === entry) cache = undefined; throw error; });
      cache = entry;
    }
    return cache.promise;
  };
}
