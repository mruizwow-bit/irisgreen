// Trusted release operation, NEVER imported by runtime Functions.
import { readFile } from 'node:fs/promises';
import { getDeployStore } from '@netlify/blobs';
import { RELEASE, BINDING, digest, verifyCorpus, verifyManifest, loadLibrary } from '../src/library.mjs';
import { assertAbsentOrIdentical, immutablePut } from './immutable-publish.mjs';

const siteID = '47b06e68-ff54-4097-8ad8-336b2d71758a';
const deployID = process.env.N04_DEPLOY_ID;
const token = process.env.NETLIFY_AUTH_TOKEN;
if (!/^[a-f0-9]{24}$/.test(deployID ?? '') || !token) throw new Error('Missing release credentials/context');
async function api(path) {
  const res = await fetch(`https://api.netlify.com/api/v1/${path}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Netlify API status ${res.status}`);
  return res.json();
}
const [site, deploy] = await Promise.all([api(`sites/${siteID}`), api(`deploys/${deployID}`)]);
if (site.name !== 'sabik-asistente' || site.sso_login !== true || site.sso_login_context !== 'all' ||
    site.functions_region !== BINDING.region || deploy.site_id !== siteID || deploy.state !== 'ready' ||
    deploy.context === 'production' || deploy.published_at || site.published_deploy?.id === deployID) throw new Error('Not the protected unpublished Cloud draft');
const folder = new URL('../build/library/', import.meta.url);
const manifestBytes = await readFile(new URL('manifest.json', folder));
const manifest = verifyManifest(JSON.parse(manifestBytes));
const bytes = await readFile(new URL(BINDING.corpusKey, folder)); verifyCorpus(bytes);
const store = getDeployStore({ name: BINDING.store, region: BINDING.region, deployID, siteID, token, consistency: 'strong' });
// Manifest is the commit marker and is always written last.
await assertAbsentOrIdentical(store, BINDING.manifestKey, manifestBytes);
const corpusWrite = await immutablePut(store, BINDING.corpusKey, bytes);
const manifestWrite = await immutablePut(store, BINDING.manifestKey, manifestBytes);
const start = performance.now(); const library = await loadLibrary(store); const cold = performance.now() - start;
const queries = ['sobrecarga sensorial', 'lectura fácil', 'apoyos trabajo'];
const searches = queries.map(query => {
  const t = performance.now(); const results = library.searchLibrary({ query, limit: 5 });
  const repeat = library.searchLibrary({ query, limit: 5 });
  if (JSON.stringify(results) !== JSON.stringify(repeat) || !results.length) throw new Error('Live storage retrieval mismatch');
  return { fixture: query, elapsed_ms: +(performance.now() - t).toFixed(2), results: results.map(({fragment_id, url, library_version}) => ({fragment_id, url, library_version})) };
});
console.log(JSON.stringify({ status: 'PASS', proof: 'EXPLICIT_NAMED_DEPLOY_STORE_READBACK_AND_LOCAL_SERVER_MODULE_SEARCH',
  site_id: siteID, deploy_id: deployID, binding: BINDING, version: RELEASE.version, corpus_sha256: RELEASE.sha256,
  corpus_bytes: RELEASE.bytes, fragments: RELEASE.count, unique_ids: RELEASE.count,
  manifest_sha256: digest(manifestBytes), provenance: manifest.provenance, writes: { corpusWrite, manifestWrite },
  cold_load_with_network_ms: +cold.toFixed(2), searches,
  http_function_execution_proven: false, C17: 'PENDING', provider: null, model: null, api_activation: 'NO_API_ACTIVATION' }, null, 2));
