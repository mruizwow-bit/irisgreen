import { timingSafeEqual } from 'node:crypto';
import { CloudLibraryError, assertCloudVersion } from './cloud-library-v2.mjs';
import { groupSources } from './source-groups.mjs';
import { runRetrievalTask, RetrievalExecutionError } from './execution-policy.mjs';
import { RETRIEVAL_TIMEOUT_MS } from './cloud-release.mjs';

const baseHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer'
};
const reply = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status, headers: { ...baseHeaders, ...extra }
});
function authorized(supplied, expected) {
  if (typeof expected !== 'string' || expected.length < 32 || typeof supplied !== 'string') return false;
  const a = Buffer.from(supplied); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
async function readBoundedJson(req, timeoutMs) {
  if (!req.body) throw new CloudLibraryError('invalid_request');
  const reader = req.body.getReader(); const chunks = []; let size = 0;
  try {
    const parsed = await runRetrievalTask(async () => {
      try {
        for (;;) {
          const { done, value } = await reader.read(); if (done) break;
          size += value.byteLength;
          if (size > 4096) throw new CloudLibraryError('invalid_request');
          chunks.push(Buffer.from(value));
        }
        return { value: JSON.parse(Buffer.concat(chunks).toString('utf8')) };
      } catch { return { invalid: true }; }
    }, { signal: req.signal, timeoutMs });
    if (parsed.invalid) throw new CloudLibraryError('invalid_request');
    return parsed.value;
  } finally {
    try { void reader.cancel().catch(() => {}); } catch {}
    reader.releaseLock();
  }
}

export function createCloudLibraryQAHandler({
  readLibrary, release, env, timeoutMs = RETRIEVAL_TIMEOUT_MS, codeProvenance
}) {
  if (typeof readLibrary !== 'function' || typeof env !== 'function') throw new TypeError('Invalid cloud library handler');
  return async (req, context) => {
    if (!authorized(req.headers.get('x-n04-smoke-token'), env('N04_SMOKE_TOKEN'))) {
      return reply(403, { error: 'forbidden' });
    }
    if (env('SABIK_AI_ENABLED') && env('SABIK_AI_ENABLED') !== 'false') {
      return reply(503, { error: 'configuration_closed' });
    }
    if (req.method !== 'POST') return reply(405, { error: 'method_not_allowed' });
    const url = new URL(req.url);
    if (url.search || !/^application\/json(?:;|$)/i.test(req.headers.get('content-type') || '')) {
      return reply(400, { error: 'invalid_request' });
    }
    const deployId = context?.deploy?.id;
    const provenanceHeaders = {
      ...(codeProvenance?.source_head && /^[a-f0-9]{40}$/.test(codeProvenance.source_head)
        ? { 'X-Sabik-Code-Head': codeProvenance.source_head } : {}),
      ...(/^[a-f0-9]{24}$/.test(deployId || '') ? { 'X-Sabik-Library-Deploy': deployId } : {})
    };
    try {
      if (!/^[a-f0-9]{24}$/.test(deployId || '')) throw new CloudLibraryError('invalid_deploy_context');
      const deadline = performance.now() + timeoutMs;
      const body = await readBoundedJson(req, timeoutMs);
      const allowed = new Set(['q','limit','version','locale','context','explicit_intent','group_sources']);
      if (!body || typeof body !== 'object' || Array.isArray(body) ||
          Object.keys(body).some(k => !allowed.has(k)) ||
          typeof body.q !== 'string' || !body.q.trim() || body.q.length > 300 ||
          (body.limit !== undefined && (!Number.isInteger(body.limit) || body.limit < 1 || body.limit > 20)) ||
          (body.locale !== undefined && !['es','en'].includes(body.locale)) ||
          (body.context !== undefined && !['default','child','teen','adult'].includes(body.context)) ||
          (body.explicit_intent !== undefined && typeof body.explicit_intent !== 'boolean') ||
          (body.group_sources !== undefined && typeof body.group_sources !== 'boolean')) {
        throw new CloudLibraryError('invalid_request');
      }
      assertCloudVersion(body.version ?? release.version, release);
      const remainingMs = Math.ceil(deadline - performance.now());
      if (remainingMs <= 0) throw new RetrievalExecutionError('REQUEST_TIMEOUT');

      const completed = await runRetrievalTask(async () => {
        const library = await readLibrary({ deployId, version: body.version ?? release.version });
        const results = library.searchLibrary({
          query: body.q,
          limit: body.limit,
          version: body.version ?? release.version,
          locale: body.locale ?? 'es',
          context: body.context ?? 'default',
          explicitIntent: body.explicit_intent ?? false
        });
        return {
          results,
          sourceGroups: body.group_sources ? groupSources(results) : undefined,
          manifest: library.manifest
        };
      }, { signal: req.signal, timeoutMs: remainingMs });

      if (req.signal.aborted) throw new RetrievalExecutionError('REQUEST_CANCELLED');
      if (performance.now() >= deadline) throw new RetrievalExecutionError('REQUEST_TIMEOUT');

      return reply(200, {
        library_version: release.version,
        corpus_sha256: release.corpus_sha256,
        source_bundle_sha256: release.source_bundle_sha256,
        source_commit: release.source_commit,
        deploy_id: deployId,
        locale: body.locale ?? 'es',
        safety_context: body.context ?? 'default',
        explicit_intent: body.explicit_intent ?? false,
        results: completed.results,
        ...(completed.sourceGroups ? { source_groups: completed.sourceGroups } : {})
      }, provenanceHeaders);
    } catch (error) {
      if (error instanceof RetrievalExecutionError) {
        return reply(503, { error: 'library_unavailable' }, {
          ...provenanceHeaders, 'X-Sabik-Request-Outcome': error.code
        });
      }
      const inputErrors = new Set([
        'invalid_request','invalid_query','invalid_limit','invalid_locale','invalid_context',
        'invalid_intent','invalid_filters','wrong_version'
      ]);
      const code = error instanceof CloudLibraryError && inputErrors.has(error.code)
        ? error.code : 'library_unavailable';
      return reply(code === 'library_unavailable' ? 503 : 400, { error: code }, provenanceHeaders);
    }
  };
}
