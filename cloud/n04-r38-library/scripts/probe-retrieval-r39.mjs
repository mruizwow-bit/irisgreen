// Read-only operational QA. Fixtures are public, synthetic requests, never user history.
import { readFile } from 'node:fs/promises';
import { getDeployStore } from '@netlify/blobs';
import { createSabikRetrievalForDeployment } from '../src/sabik-retrieval-server.mjs';
import { RELEASE, BINDING } from '../src/library.mjs';
import { createRetrievalOnlyCaller } from '../tests/support/retrieval-only-caller.mjs';

const deployID = '6ab4c1a15435b93043ab3f6d';
const siteID = '47b06e68-ff54-4097-8ad8-336b2d71758a';
const token = process.env.NETLIFY_AUTH_TOKEN;
if (!token) throw new Error('Missing operational credential');
const fixtures = JSON.parse(await readFile(new URL('../tests/fixtures/retrieval-r39.json', import.meta.url), 'utf8'));
let storeGets = 0;
const reader = createSabikRetrievalForDeployment({ libraryDeployId: deployID, storeFactory: options => {
  const store = getDeployStore({ ...options, siteID, token });
  return { get: async (...args) => { storeGets++; return store.get(...args); } };
} });
const caller = createRetrievalOnlyCaller({ retrieval: reader });
const results = [];
const start = performance.now();
for (const fixture of fixtures.cases) {
  const t = performance.now();
  const result = await caller.run(fixture.request);
  if (result.response !== null || result.phase !== 'retrieval_only' || result.sources.library_version !== RELEASE.version) throw new Error('Caller contract mismatch');
  const citations = result.sources.candidates.map(({ fragment_id, url, score }) => ({ fragment_id, url, score }));
  if (JSON.stringify(citations) !== JSON.stringify(fixture.expected.map(({fragment_id,url,score}) => ({fragment_id,url,score})))) throw new Error('Golden ranking mismatch');
  const repeat = await reader.retrieveForSabik(fixture.request);
  if (JSON.stringify(repeat) !== JSON.stringify(result.sources)) throw new Error('Repeat mismatch');
  results.push({ fixture_id: fixture.id, library_version: result.sources.library_version, result_count: citations.length,
    elapsed_ms: +(performance.now() - t).toFixed(2), citations, outcome: 'PASS' });
}
const lookup = await reader.getFragmentForSabik({ fragmentId: 'es-biblioteca.meta' });
if (lookup.candidate?.fragment_id !== 'es-biblioteca.meta' || lookup.candidate.score !== null) throw new Error('Exact lookup mismatch');
if (storeGets !== 2) throw new Error('Corpus fetched again on a warm request');
console.log(JSON.stringify({ status: 'PASS', proof: 'R39_SERVER_ADAPTER_AND_NOOP_CALLER_OVER_ACCEPTED_R38_CLOUD_BLOBS',
  site_id: siteID, library_deploy_id: deployID, binding: BINDING, library_version: RELEASE.version, corpus_sha256: RELEASE.sha256,
  fixture_count: results.length, repeated_searches: results.length, exact_lookup: { fragment_id: lookup.candidate.fragment_id, url: lookup.candidate.url, library_version: lookup.library_version },
  network_blob_reads: storeGets, writes: 0, elapsed_ms: +(performance.now() - start).toFixed(2), results,
  execution_environment: 'Local Node process with read-only authenticated Blob access',
  http_function_execution_proven: false, provider: null, model: null, api_activation: 'NO_API_ACTIVATION', C17: 'PENDING' }, null, 2));
