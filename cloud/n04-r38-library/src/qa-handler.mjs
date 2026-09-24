import { timingSafeEqual } from 'node:crypto';
import { RELEASE, LibraryError, assertVersion } from './library.mjs';
import { createSabikRetrievalAdapter, SabikRetrievalError } from './sabik-retrieval.mjs';
import { runRetrievalTask, RetrievalExecutionError } from './execution-policy.mjs';
import { RETRIEVAL_TIMEOUT_MS } from './cloud-release.mjs';

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
const response = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { ...headers, ...extra } });
function authorized(supplied, expected) {
  if (typeof expected !== 'string' || expected.length < 32 || typeof supplied !== 'string') return false;
  const a = Buffer.from(supplied); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
async function readBoundedJson(req, timeoutMs) {
  if (!req.body) throw new LibraryError('invalid_request');
  const reader = req.body.getReader(); const chunks = []; let size = 0;
  try {
    const parsed = await runRetrievalTask(async () => {
      try {
        for (;;) {
          const { done, value } = await reader.read(); if (done) break;
          size += value.byteLength;
          if (size > 2048) throw new LibraryError('invalid_request');
          chunks.push(Buffer.from(value));
        }
        return { value: JSON.parse(Buffer.concat(chunks).toString('utf8')) };
      } catch { return { invalid: true }; }
    }, { signal: req.signal, timeoutMs });
    // Keep body errors in the existing HTTP contract, outside retrieval mapping.
    if (parsed.invalid) throw new LibraryError('invalid_request');
    return parsed.value;
  } finally {
    // This reader belongs only to this request. Never wait on a hostile/slow
    // underlying cancel callback, and consume its rejection without logging it.
    try { void reader.cancel().catch(() => {}); } catch { /* already closed */ }
    reader.releaseLock();
  }
}
export function createQAHandler({ readLibrary, retrieval, env, timeoutMs = RETRIEVAL_TIMEOUT_MS, codeProvenance }) {
  const provenanceHeaders = codeProvenance ? {
    'X-Sabik-Code-Head': codeProvenance.source_head,
    'X-Sabik-Library-Deploy': codeProvenance.library_deploy_id,
  } : {};
  return async (req, context) => {
    // Existing Team Login remains the outer access control; this is a second gate.
    if (!authorized(req.headers.get('x-n04-smoke-token'), env('N04_SMOKE_TOKEN'))) return response(403, { error: 'forbidden' });
    if (env('SABIK_AI_ENABLED') && env('SABIK_AI_ENABLED') !== 'false') return response(503, { error: 'configuration_closed' });
    if (req.method !== 'POST') return response(405, { error: 'method_not_allowed' });
    if (new URL(req.url).search || !/^application\/json(?:;|$)/i.test(req.headers.get('content-type') ?? '')) return response(400, { error: 'invalid_request' });
    try {
      const deadline = performance.now() + timeoutMs;
      const body = await readBoundedJson(req, timeoutMs);
      if (!body || typeof body !== 'object' || Array.isArray(body) ||
          Object.keys(body).some(k => !['q', 'limit', 'version'].includes(k)) ||
          typeof body.q !== 'string' || !body.q.trim() || body.q.length > 300 ||
          (body.limit !== undefined && (!Number.isInteger(body.limit) || body.limit < 1 || body.limit > 20))) throw new LibraryError('invalid_request');
      assertVersion(body.version);
      const remainingMs = Math.ceil(deadline - performance.now());
      if (remainingMs <= 0) throw new RetrievalExecutionError('REQUEST_TIMEOUT');
      const completed = await runRetrievalTask(async () => {
        // Preserve the injected readLibrary test seam, using the same R39 adapter.
        // Production supplies the single deployment-bound retrieval dependency.
        let loaded;
        const read = ({ version }) => (loaded ??= Promise.resolve().then(() => readLibrary({ deployId: context?.deploy?.id, version })));
        const client = retrieval ?? createSabikRetrievalAdapter({ readLibrary: read });
        const found = await client.retrieveForSabik({ query: body.q, limit: body.limit, libraryVersion: body.version });
        const metadata = retrieval ? await client.getLibraryInfo() : (await loaded).manifest;
        const buildHead = retrieval ? metadata.build_head : metadata.provenance.build_head;
        if (!/^[a-f0-9]{40}$/.test(buildHead ?? '')) throw new LibraryError('invalid_provenance');
        // HTTP R38 retains editorial_status; the R39 adapter verifies PUBLICABLE.
        const results = found.candidates.map(candidate => ({ ...candidate, editorial_status: 'PUBLICABLE' }));
        return { results, buildHead };
      }, { signal: req.signal, timeoutMs: remainingMs });
      if (req.signal.aborted) throw new RetrievalExecutionError('REQUEST_CANCELLED');
      if (performance.now() >= deadline) throw new RetrievalExecutionError('REQUEST_TIMEOUT');
      return response(200, { library_version: RELEASE.version, corpus_sha256: RELEASE.sha256,
        deploy_id: context.deploy.id, source_git_blob: RELEASE.sourceGitBlob,
        build_head: completed.buildHead, results: completed.results }, provenanceHeaders);
    } catch (error) {
      if (error instanceof RetrievalExecutionError) {
        return response(503, { error: 'library_unavailable' }, { ...provenanceHeaders,
          'X-Sabik-Request-Outcome': error.code });
      }
      if (error instanceof SabikRetrievalError) {
        const code = error.code === 'INVALID_RETRIEVAL_QUERY' ? 'invalid_query' :
          error.code === 'LIBRARY_VERSION_MISMATCH' ? 'wrong_version' : 'library_unavailable';
        return response(code === 'library_unavailable' ? 503 : 400, { error: code }, provenanceHeaders);
      }
      const inputErrors = ['invalid_request', 'invalid_query', 'invalid_limit', 'wrong_version'];
      return response(error instanceof LibraryError && inputErrors.includes(error.code) ? 400 : 503,
        { error: error instanceof LibraryError && inputErrors.includes(error.code) ? error.code : 'library_unavailable' }, provenanceHeaders);
    }
  };
}
