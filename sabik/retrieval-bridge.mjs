import { groupSources } from '../cloud/n04-r38-library/src/source-groups.mjs';

const CODES = new Set(['INVALID_RETRIEVAL_QUERY', 'LIBRARY_VERSION_MISMATCH',
  'LIBRARY_INTEGRITY_ERROR', 'LIBRARY_UNAVAILABLE', 'REQUEST_CANCELLED', 'REQUEST_TIMEOUT']);
const FIELDS = Object.freeze(['library_version', 'fragment_id', 'snippet', 'title', 'heading',
  'url', 'source_type', 'concepts', 'score']);
export class RetrievalBridgeError extends Error {
  constructor(code) { const safe = CODES.has(code) ? code : 'LIBRARY_UNAVAILABLE'; super(safe); this.name = 'RetrievalBridgeError'; this.code = safe; }
}
const fail = code => { throw new RetrievalBridgeError(code); };
function safeFailure(error, signal) {
  if (signal?.aborted || error?.name === 'AbortError') return new RetrievalBridgeError('REQUEST_CANCELLED');
  return new RetrievalBridgeError(error?.code);
}
function safeSourceUrl(value) {
  if (typeof value !== 'string' || !value || /[\u0000-\u0020\u007f]/u.test(value)) fail('LIBRARY_INTEGRITY_ERROR');
  let url; try { url = new URL(value); } catch { fail('LIBRARY_INTEGRITY_ERROR'); }
  if (url.origin !== 'https://irisgreen.eu' || url.username || url.password) fail('LIBRARY_INTEGRITY_ERROR');
  return value; // Validation only: grouping uses the exact original string.
}
function candidatesFromBody(body, library) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) fail('LIBRARY_INTEGRITY_ERROR');
  if (body.library_version !== library.version) fail('LIBRARY_VERSION_MISMATCH');
  if (body.corpus_sha256 !== library.corpusSha256 || body.source_git_blob !== library.sourceGitBlob ||
      !/^[a-f0-9]{40}$/.test(body.build_head ?? '') || !/^[a-f0-9]{24}$/.test(body.deploy_id ?? '') ||
      !Array.isArray(body.results) || body.results.length > 20) fail('LIBRARY_INTEGRITY_ERROR');
  const ids = new Set();
  return Object.freeze(body.results.map(result => {
    if (!result || typeof result !== 'object' || Array.isArray(result) ||
        Object.keys(result).some(key => !FIELDS.includes(key) && key !== 'editorial_status') ||
        FIELDS.some(key => !Object.hasOwn(result, key)) || result.editorial_status !== 'PUBLICABLE' ||
        result.library_version !== library.version || typeof result.fragment_id !== 'string' ||
        !result.fragment_id || ids.has(result.fragment_id) || typeof result.snippet !== 'string' ||
        result.snippet.length > 480 || !Array.isArray(result.concepts)) fail('LIBRARY_INTEGRITY_ERROR');
    ids.add(result.fragment_id);
    return Object.freeze(Object.fromEntries(FIELDS.map(key => [key,
      key === 'url' ? safeSourceUrl(result[key]) : key === 'concepts' ? Object.freeze([...result[key]]) : result[key]])));
  }));
}

/**
 * Consume a Response from an injected, authorized transport. No URL, credential,
 * fetch, storage, query history, corpus translation or ranking lives here.
 * The server verifies citations against the corpus; this boundary checks their
 * envelope/identity/shape and preserves the original values for presentation.
 */
export function createRetrievalQuery({ transport, library } = {}) {
  if (typeof transport !== 'function' || !library || typeof library.version !== 'string' || !library.version ||
      !/^[a-f0-9]{64}$/.test(library.corpusSha256 ?? '') || !/^[a-f0-9]{40}$/.test(library.sourceGitBlob ?? '') ||
      library.sourceLanguage !== 'es') throw new TypeError('Invalid retrieval composition');
  const source = Object.freeze({ version: library.version, corpusSha256: library.corpusSha256,
    sourceGitBlob: library.sourceGitBlob, sourceLanguage: library.sourceLanguage });
  return async function query(request, { signal } = {}) {
    try {
      if (signal?.aborted) fail('REQUEST_CANCELLED');
      const response = await transport(request, { signal });
      if (signal?.aborted) fail('REQUEST_CANCELLED');
      if (!(response instanceof Response) || !/^application\/json(?:;|$)/i.test(response.headers.get('content-type') ?? '')) fail('LIBRARY_UNAVAILABLE');
      const body = await response.json();
      if (signal?.aborted) fail('REQUEST_CANCELLED');
      if (!response.ok) {
        const outcome = response.headers.get('X-Sabik-Request-Outcome');
        if (outcome === 'REQUEST_CANCELLED' || outcome === 'REQUEST_TIMEOUT') fail(outcome);
        if (body?.error === 'wrong_version') fail('LIBRARY_VERSION_MISMATCH');
        if (['invalid_query', 'invalid_request', 'invalid_limit'].includes(body?.error)) fail('INVALID_RETRIEVAL_QUERY');
        fail('LIBRARY_UNAVAILABLE');
      }
      const candidates = candidatesFromBody(body, source);
      let groups;
      try { groups = groupSources(candidates); } catch { fail('LIBRARY_INTEGRITY_ERROR'); }
      return Object.freeze({ library_version: source.version, candidates, groups, source_language: source.sourceLanguage });
    } catch (error) { throw safeFailure(error, signal); }
  };
}
