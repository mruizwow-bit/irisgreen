import { timingSafeEqual } from 'node:crypto';
import { RELEASE, LibraryError, assertVersion } from './library.mjs';

const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
const response = (status, body) => new Response(JSON.stringify(body), { status, headers });
function authorized(supplied, expected) {
  if (typeof expected !== 'string' || expected.length < 32 || typeof supplied !== 'string') return false;
  const a = Buffer.from(supplied); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
async function readBoundedJson(req) {
  if (!req.body) throw new LibraryError('invalid_request');
  const reader = req.body.getReader(); const chunks = []; let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 2048) { await reader.cancel(); throw new LibraryError('invalid_request'); }
      chunks.push(Buffer.from(value));
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { throw new LibraryError('invalid_request'); }
  finally { reader.releaseLock(); }
}
export function createQAHandler({ readLibrary, env }) {
  return async (req, context) => {
    // Existing Team Login remains the outer access control; this is a second gate.
    if (!authorized(req.headers.get('x-n04-smoke-token'), env('N04_SMOKE_TOKEN'))) return response(403, { error: 'forbidden' });
    if (env('SABIK_AI_ENABLED') && env('SABIK_AI_ENABLED') !== 'false') return response(503, { error: 'configuration_closed' });
    if (req.method !== 'POST') return response(405, { error: 'method_not_allowed' });
    if (new URL(req.url).search || !/^application\/json(?:;|$)/i.test(req.headers.get('content-type') ?? '')) return response(400, { error: 'invalid_request' });
    try {
      const body = await readBoundedJson(req);
      if (!body || typeof body !== 'object' || Array.isArray(body) ||
          Object.keys(body).some(k => !['q', 'limit', 'version'].includes(k)) ||
          typeof body.q !== 'string' || !body.q.trim() || body.q.length > 300 ||
          (body.limit !== undefined && (!Number.isInteger(body.limit) || body.limit < 1 || body.limit > 20))) throw new LibraryError('invalid_request');
      assertVersion(body.version);
      const library = await readLibrary({ deployId: context?.deploy?.id, version: body.version });
      const results = library.searchLibrary({ query: body.q, limit: body.limit, version: body.version });
      return response(200, { library_version: RELEASE.version, corpus_sha256: RELEASE.sha256,
        deploy_id: context.deploy.id, source_git_blob: RELEASE.sourceGitBlob,
        build_head: library.manifest.provenance.build_head, results });
    } catch (error) {
      const inputErrors = ['invalid_request', 'invalid_query', 'invalid_limit', 'wrong_version'];
      return response(error instanceof LibraryError && inputErrors.includes(error.code) ? 400 : 503,
        { error: error instanceof LibraryError && inputErrors.includes(error.code) ? error.code : 'library_unavailable' });
    }
  };
}
