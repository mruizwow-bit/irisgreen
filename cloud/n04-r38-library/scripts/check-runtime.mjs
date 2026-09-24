import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const strict = process.argv.includes('--strict');
const checks = [];
const add = (id, pass, scope = 'a5', detail = undefined) => checks.push({ id, pass: Boolean(pass), scope, ...(detail === undefined ? {} : { detail }) });

const files = Object.fromEntries(await Promise.all([
  'src/r39-runtime-transport.mjs',
  'src/sabik-retrieval-server.mjs',
  'src/sabik-retrieval.mjs',
  'src/library.mjs',
  'src/qa-handler.mjs',
  'netlify/functions/n04-library-qa.mjs',
  'scripts/build.mjs',
  'package.json',
].map(async path => [path, await read(path)])));

const runtime = process.versions.node;
add('node_runtime_supported', runtime === '22.16.0' || /^24\./.test(runtime), 'a5', runtime);
add('transport_reuses_server_composition', files['src/r39-runtime-transport.mjs'].includes("from './sabik-retrieval-server.mjs'") &&
  files['src/r39-runtime-transport.mjs'].includes('createSabikRetrievalForDeployment'));
add('transport_has_no_direct_loader_or_blob_sdk', !/createCachedReader|getDeployStore|@netlify\/blobs/.test(files['src/r39-runtime-transport.mjs']));
add('sealed_r38_deploy_identity', files['src/r39-runtime-transport.mjs'].includes("R38_LIBRARY_DEPLOY_ID = '6ab4c1a15435b93043ab3f6d'"));
add('no_user_deploy_selector', !/body\.(deployId|libraryDeployId)|body\[['\"](?:deployId|libraryDeployId)['\"]\]/.test(files['src/r39-runtime-transport.mjs']));
add('no_provider_chat_or_persistence', !/\/api\/chat|openai|anthropic|embedding|conversation|profile|store\.(?:set|setJSON|delete)\s*\(/i.test(files['src/r39-runtime-transport.mjs']));

const pkg = JSON.parse(files['package.json']);
add('dependency_surface_unchanged', JSON.stringify(pkg.dependencies) === JSON.stringify({ '@netlify/blobs': '11.1.0' }));

const requiredProvenanceFiles = [
  'src/library.mjs',
  'src/qa-handler.mjs',
  'src/sabik-retrieval.mjs',
  'src/sabik-retrieval-server.mjs',
  'src/r39-runtime-transport.mjs',
  'netlify/functions/n04-library-qa.mjs',
];
for (const path of requiredProvenanceFiles) {
  add(`build_provenance:${path}`, files['scripts/build.mjs'].includes(`'${path}'`) || files['scripts/build.mjs'].includes(`\"${path}\"`), 'codex-integration');
}
add('function_entry_uses_r39_transport', /r39-runtime-transport/.test(files['netlify/functions/n04-library-qa.mjs']), 'codex-integration');

const a5Failures = checks.filter(check => check.scope === 'a5' && !check.pass);
const integrationPending = checks.filter(check => check.scope === 'codex-integration' && !check.pass);
const status = a5Failures.length ? 'FAIL' : integrationPending.length ? 'A5_READY_CODEX_INTEGRATION_PENDING' : 'PASS';
const report = {
  schema: 'SABIK_R39_A5_RUNTIME_CHECK/1.0',
  status,
  runtime: { node: process.version, npm_config_user_agent: process.env.npm_config_user_agent ?? null, platform: process.platform, arch: process.arch },
  sealed_library_deploy_id: '6ab4c1a15435b93043ab3f6d',
  checks,
  integration_pending: integrationPending.map(check => check.id),
};
console.log(JSON.stringify(report, null, 2));
if (a5Failures.length || (strict && integrationPending.length)) process.exit(1);
