// Local HTTP composition over real remote Blobs; never calls the protected site URL.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getDeployStore } from '@netlify/blobs';
import { createSabikRetrievalForDeployment } from '../src/sabik-retrieval-server.mjs';
import { createQAHandler } from '../src/qa-handler.mjs';
import { LIBRARY_DEPLOY_ID, RETRIEVAL_TIMEOUT_MS } from '../src/cloud-release.mjs';
import { RELEASE, BINDING, digest } from '../src/library.mjs';
import codeProvenance from '../build/code-provenance.json' with { type: 'json' };

const siteID = '47b06e68-ff54-4097-8ad8-336b2d71758a';
const token = process.env.NETLIFY_AUTH_TOKEN;
if (!token) throw new Error('Missing operational credential');
let reads = 0; const hashes = {};
const retrieval = createSabikRetrievalForDeployment({ libraryDeployId: LIBRARY_DEPLOY_ID,
  storeFactory: options => {
    const store = getDeployStore({ ...options, siteID, token });
    return { async get(...args) {
      reads++; const data = await store.get(...args);
      hashes[args[0]] = digest(Buffer.from(data)); return data;
    } };
  } });
const localToken = 'LOCAL-HANDLER-FIXTURE-NOT-A-CLOUD-CREDENTIAL';
const handler = createQAHandler({ retrieval, codeProvenance, timeoutMs: RETRIEVAL_TIMEOUT_MS,
  env: key => key === 'N04_SMOKE_TOKEN' ? localToken : undefined });
const fixtures = JSON.parse(await readFile(new URL('../tests/fixtures/retrieval-r39.json', import.meta.url), 'utf8'));
const results = []; const start = performance.now();
for (const fixture of fixtures.cases.filter(f => !f.request.filters || Object.keys(f.request.filters).length === 0)) {
  const { query: q, limit, libraryVersion: version } = fixture.request;
  const request = new Request('https://local.invalid/internal/n04/library/search', { method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-n04-smoke-token': localToken }, body: JSON.stringify({ q, limit, version }) });
  const response = await handler(request, { deploy: { id: 'LOCAL_ONLY_NOT_A_REMOTE_FUNCTION' } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Sabik-Code-Head'), codeProvenance.source_head);
  assert.equal(response.headers.get('X-Sabik-Library-Deploy'), LIBRARY_DEPLOY_ID);
  const body = await response.json();
  assert.equal(body.build_head, 'ddd12ed4e002812f5c53e24618c029be9faf9e00');
  assert.equal(body.corpus_sha256, RELEASE.sha256);
  assert.deepEqual(body.results.map(({ fragment_id, url, score }) => ({ fragment_id, url, score })), fixture.expected);
  results.push({ fixture_id: fixture.id, status: response.status, citations: body.results.map(r => r.fragment_id) });
}
assert.equal(reads, 2);
assert.equal(hashes[BINDING.manifestKey], '4afa926282412a4df96e2f2e2837ca55d47487d7005b04b7e681e33ad1bcae3b');
assert.equal(hashes[BINDING.corpusKey], RELEASE.sha256);
console.log(JSON.stringify({ status: 'PASS', source_head: codeProvenance.source_head, source_tree: codeProvenance.source_tree,
  execution_environment: 'LOCAL_HANDLER_OVER_REAL_REMOTE_BLOBS', local_node: process.version,
  library_deploy_id: LIBRARY_DEPLOY_ID, network_blob_reads: reads, blob_hashes: hashes, writes: 0,
  fixture_count: results.length, results, elapsed_ms: +(performance.now() - start).toFixed(2),
  remote_http_requests: 0, http_function_execution_proven: false, C17: 'PENDING' }, null, 2));
