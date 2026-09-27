// Trusted release operation for issue #306. Never imported by runtime Functions.
import { readFile } from 'node:fs/promises';
import { getDeployStore } from '@netlify/blobs';
import { createCloudManifest, digestV2, loadCloudLibrary } from '../src/cloud-library-v2.mjs';
import { assertAbsentOrIdentical, immutablePut } from './immutable-publish.mjs';

const siteID = '47b06e68-ff54-4097-8ad8-336b2d71758a';
const deployID = process.env.N04_DEPLOY_ID;
const token = process.env.NETLIFY_AUTH_TOKEN;
if (!/^[a-f0-9]{24}$/.test(deployID || '') || !token) throw new Error('Missing release credentials/context');

async function api(path) {
  const res = await fetch('https://api.netlify.com/api/v1/' + path, {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('Netlify API status ' + res.status);
  return res.json();
}
const [site, deploy, release, provenance] = await Promise.all([
  api('sites/' + siteID),
  api('deploys/' + deployID),
  readFile(new URL('../build/library-v2/release.json', import.meta.url), 'utf8').then(JSON.parse),
  readFile(new URL('../build/code-provenance.json', import.meta.url), 'utf8').then(JSON.parse)
]);
if (site.name !== 'sabik-asistente' || site.sso_login !== true || site.sso_login_context !== 'all' ||
    site.functions_region !== release.region || deploy.site_id !== siteID || deploy.state !== 'ready' ||
    deploy.context === 'production' || deploy.published_at || site.published_deploy?.id === deployID) {
  throw new Error('Not the protected unpublished Cloud draft');
}
if (!/^[a-f0-9]{40}$/.test(provenance.source_head || '') ||
    !/^[a-f0-9]{40}$/.test(provenance.source_tree || '')) {
  throw new Error('Invalid build provenance');
}
const corpusURL = new URL('../build/library-v2/' + release.corpus_key.replace(/^cloud-library\//, ''), import.meta.url);
const corpusBytes = await readFile(corpusURL);
if (corpusBytes.byteLength !== release.corpus_bytes || digestV2(corpusBytes) !== release.corpus_sha256) {
  throw new Error('Built corpus integrity mismatch');
}
const manifest = createCloudManifest(release, {
  build_head: provenance.source_head,
  build_tree: provenance.source_tree,
  engine_sha256: provenance.engine_sha256
});
const manifestBytes = Buffer.from(JSON.stringify(manifest) + '\n');
const store = getDeployStore({
  name: release.store, region: release.region, deployID, siteID, token, consistency: 'strong'
});

// New version, new keys. Never delete or overwrite R38 historical objects.
await assertAbsentOrIdentical(store, release.manifest_key, manifestBytes);
const corpusWrite = await immutablePut(store, release.corpus_key, corpusBytes);
const manifestWrite = await immutablePut(store, release.manifest_key, manifestBytes);

const coldStart = performance.now();
const library = await loadCloudLibrary(store, release);
const coldMs = performance.now() - coldStart;
const checks = [
  ['es-default', { query: 'sobrecarga sensorial', locale: 'es', context: 'default' }],
  ['en-default', { query: 'sensory overload', locale: 'en', context: 'default' }],
  ['safe-s2-es', { query: 'anorexia', locale: 'es', context: 'child' }],
  ['adult-explicit-en', { query: 'suicidal thoughts', locale: 'en', context: 'adult', explicitIntent: true }]
];
const searches = [];
for (const [name, args] of checks) {
  const start = performance.now();
  const results = library.searchLibrary({ ...args, limit: 5 });
  searches.push({ name, elapsed_ms: +(performance.now() - start).toFixed(2),
    result_count: results.length,
    fragment_ids: results.map(r => r.fragment_id),
    sensitivities: results.map(r => r.sensitivity) });
}
console.log(JSON.stringify({
  status: 'PASS',
  proof: 'A9_EXPLICIT_DEPLOY_STORE_READBACK_AND_CHILD_SAFE_SEARCH',
  site_id: siteID,
  deploy_id: deployID,
  context: deploy.context,
  published_at: deploy.published_at,
  version: release.version,
  corpus_sha256: release.corpus_sha256,
  corpus_bytes: release.corpus_bytes,
  fragments: release.fragment_count,
  locale_counts: release.locale_counts,
  full_s2: release.full_s2_count,
  safe_variants: release.safe_variant_count,
  source_commit: release.source_commit,
  source_bundle_sha256: release.source_bundle_sha256,
  manifest_sha256: digestV2(manifestBytes),
  writes: { corpusWrite, manifestWrite },
  cold_load_with_network_ms: +coldMs.toFixed(2),
  searches,
  production_changed: false,
  team_login_changed: false,
  secrets_changed: false,
  frontend_changed: false
}, null, 2));
