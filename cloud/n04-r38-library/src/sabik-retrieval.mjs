// Server-only, provider-neutral boundary. Query text exists only during this call.
import { LibraryError, RELEASE, terms, freeze, verifyManifest } from './library.mjs';

export const RETRIEVAL_CODES = Object.freeze([
  'LIBRARY_UNAVAILABLE', 'LIBRARY_VERSION_MISMATCH',
  'LIBRARY_INTEGRITY_ERROR', 'INVALID_RETRIEVAL_QUERY',
]);
export class SabikRetrievalError extends Error {
  constructor(code) {
    const safe = RETRIEVAL_CODES.includes(code) ? code : 'LIBRARY_UNAVAILABLE';
    super(safe); this.name = 'SabikRetrievalError'; this.code = safe;
  }
}
const fail = code => { throw new SabikRetrievalError(code); };
const invalid = () => fail('INVALID_RETRIEVAL_QUERY');
const integrity = () => fail('LIBRARY_INTEGRITY_ERROR');
const inputCodes = new Set(['invalid_query', 'invalid_limit', 'invalid_filters']);
const integrityCodes = new Set(['invalid_blob_type', 'blob_too_large', 'invalid_blob_json',
  'corpus_integrity_mismatch', 'corpus_count_or_metadata_mismatch', 'duplicate_fragment_id',
  'fragment_identity_mismatch', 'invalid_publicable_fragment', 'invalid_source_url',
  'invalid_manifest', 'manifest_identity_mismatch', 'invalid_provenance']);
// Never copy a storage exception, message, cause, response, query or stack into a result.
export function retrievalFailureCode(error) {
  if (error instanceof SabikRetrievalError && RETRIEVAL_CODES.includes(error.code)) return error.code;
  if (error instanceof LibraryError) {
    if (error.code === 'wrong_version') return 'LIBRARY_VERSION_MISMATCH';
    if (inputCodes.has(error.code)) return 'INVALID_RETRIEVAL_QUERY';
    if (integrityCodes.has(error.code)) return 'LIBRARY_INTEGRITY_ERROR';
  }
  return 'LIBRARY_UNAVAILABLE';
}
function plain(value) {
  return value !== null && typeof value === 'object' &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function onlyDataKeys(value, allowed) {
  if (!plain(value)) invalid();
  for (const key of Reflect.ownKeys(value)) {
    if (!allowed.includes(key) || !('value' in Object.getOwnPropertyDescriptor(value, key))) invalid();
  }
}
function versionOf(value = RELEASE.version) {
  if (typeof value !== 'string' || !value || value.length > 128) invalid();
  if (value !== RELEASE.version) fail('LIBRARY_VERSION_MISMATCH');
  return value;
}
function filtersOf(value = {}) {
  onlyDataKeys(value, ['source_type', 'editorial_status', 'url', 'concepts']);
  const filters = {};
  for (const key of Reflect.ownKeys(value)) {
    const item = value[key];
    if (key === 'concepts') {
      if (!Array.isArray(item) || item.length > 10) invalid();
      // Array.from also exposes sparse holes as undefined for validation.
      const list = Array.from(item);
      if (list.some(v => typeof v !== 'string' || !v || v.length > 256)) invalid();
      filters[key] = list;
    } else {
      if (typeof item !== 'string' || !item || item.length > 2048) invalid();
      filters[key] = item;
    }
  }
  return freeze(filters);
}
function searchInput(input) {
  onlyDataKeys(input, ['query', 'limit', 'filters', 'libraryVersion']);
  if (typeof input.query !== 'string' || input.query.length > 300) invalid();
  const query = input.query.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/\s+/gu, ' ');
  const tokens = terms(query);
  if (!query || query.length > 300 || tokens.length === 0 || tokens.length > 32) invalid();
  const limit = input.limit === undefined ? 5 : input.limit;
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) invalid();
  return freeze({ query, limit, filters: filtersOf(input.filters), version: versionOf(input.libraryVersion) });
}
function lookupInput(input) {
  onlyDataKeys(input, ['fragmentId', 'libraryVersion']);
  if (typeof input.fragmentId !== 'string' || !input.fragmentId.trim() || input.fragmentId.length > 512) invalid();
  return freeze({ fragmentId: input.fragmentId, version: versionOf(input.libraryVersion) });
}
function cite(fragment, score, version) {
  if (!fragment || typeof fragment.id !== 'string' || !fragment.id ||
      ['text', 'title', 'heading', 'url', 'source_type'].some(k => typeof fragment[k] !== 'string') ||
      fragment.editorial_status !== 'PUBLICABLE' || !Array.isArray(fragment.concepts) ||
      fragment.concepts.some(c => typeof c !== 'string')) integrity();
  let url; try { url = new URL(fragment.url); } catch { integrity(); }
  if (url.origin !== 'https://irisgreen.eu' || url.username || url.password) integrity();
  return freeze({ library_version: version, fragment_id: fragment.id,
    snippet: fragment.text.slice(0, 480), title: fragment.title, heading: fragment.heading,
    url: fragment.url, source_type: fragment.source_type, concepts: [...fragment.concepts], score });
}
function checkedCandidates(library, results, request) {
  if (!Array.isArray(results) || results.length > request.limit) integrity();
  const ids = new Set();
  return freeze(results.map(candidate => {
    if (!candidate || typeof candidate.fragment_id !== 'string' || ids.has(candidate.fragment_id) ||
        candidate.library_version !== request.version || !Number.isSafeInteger(candidate.score) || candidate.score <= 0) integrity();
    ids.add(candidate.fragment_id);
    const fragment = library.getFragment(candidate.fragment_id);
    if (!fragment || fragment.id !== candidate.fragment_id) integrity();
    const expected = cite(fragment, candidate.score, request.version);
    for (const key of ['library_version', 'fragment_id', 'snippet', 'title', 'heading', 'url', 'source_type']) {
      if (candidate[key] !== expected[key]) integrity();
    }
    if (!Array.isArray(candidate.concepts) || candidate.concepts.length !== expected.concepts.length ||
        candidate.concepts.some((v, i) => v !== expected.concepts[i])) integrity();
    return expected;
  }));
}

/** Dependency contract for a future response pipeline; this module opens no route. */
export function createSabikRetrievalAdapter({ readLibrary } = {}) {
  if (typeof readLibrary !== 'function') fail('LIBRARY_UNAVAILABLE');
  async function withLibrary(version, action) {
    const library = await readLibrary({ version });
    if (!library || typeof library.searchLibrary !== 'function' || typeof library.getFragment !== 'function') fail('LIBRARY_UNAVAILABLE');
    verifyManifest(library.manifest);
    return action(library);
  }
  async function retrieveForSabik(input) {
    try {
      const request = searchInput(input); // Snapshot before awaiting any storage access.
      return await withLibrary(request.version, library => freeze({ library_version: request.version,
        candidates: checkedCandidates(library, library.searchLibrary(request), request) }));
    } catch (error) { throw new SabikRetrievalError(retrievalFailureCode(error)); }
  }
  async function getFragmentForSabik(input) {
    try {
      const request = lookupInput(input);
      return await withLibrary(request.version, library => {
        const fragment = library.getFragment(request.fragmentId);
        if (fragment !== null && (!fragment || fragment.id !== request.fragmentId)) integrity();
        return freeze({ library_version: request.version, candidate: fragment === null ? null : cite(fragment, null, request.version) });
      });
    } catch (error) { throw new SabikRetrievalError(retrievalFailureCode(error)); }
  }
  return Object.freeze({ retrieveForSabik, getFragmentForSabik });
}
