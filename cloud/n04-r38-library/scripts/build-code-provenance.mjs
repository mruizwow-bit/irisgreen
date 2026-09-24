// This records CODE provenance. It never creates or updates the R38 corpus manifest.
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';

const sha256 = data => createHash('sha256').update(data).digest('hex');
const slash = path => path.split(sep).join('/');

async function sourceModules(root, subdirectory) {
  const found = [];
  for (const entry of await readdir(resolve(root, subdirectory), { withFileTypes: true })) {
    const path = slash(`${subdirectory}/${entry.name}`);
    if (entry.isSymbolicLink()) throw new Error('Source symlinks are not allowed');
    if (entry.isDirectory()) found.push(...await sourceModules(root, path));
    else if (/\.(?:mjs|js|cjs|json)$/.test(entry.name)) found.push(path);
  }
  return found;
}

export async function createCodeProvenance({ projectRoot, libraryDeployId, release, timeoutMs }) {
  if (!/^[a-f0-9]{24}$/.test(libraryDeployId ?? '') || !Number.isInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error('Explicit library deployment and request timeout are required');
  }
  const root = resolve(projectRoot);
  const git = (...args) => execFileSync('git', ['-c', `safe.directory=${slash(resolve(root, '../..'))}`, '-C', root, ...args], { encoding: 'utf8' }).trim();
  const sourceRoot = git('rev-parse', '--show-toplevel');
  const scope = slash(relative(sourceRoot, root));
  const buildHead = git('rev-parse', 'HEAD');
  const buildTree = git('rev-parse', 'HEAD^{tree}');
  const dirty = git('status', '--porcelain', '--untracked-files=normal', '--', '.') !== '';
  // Superset inventory: all first-party runtime modules, not a fragile import regex.
  // Verify the actual bundled import graph separately with the esbuild metafile.
  const paths = [...await sourceModules(root, 'src'), ...await sourceModules(root, 'netlify/functions'),
    'package.json', 'package-lock.json', 'netlify.toml', 'scripts/build.mjs', 'scripts/build-code-provenance.mjs'];
  const unique = [...new Set(paths)].sort();
  const required = ['src/library.mjs', 'src/sabik-retrieval.mjs', 'src/sabik-retrieval-server.mjs',
    'src/qa-handler.mjs', 'src/cloud-release.mjs', 'src/execution-policy.mjs', 'netlify/functions/n04-library-qa.mjs'];
  for (const path of required) if (!unique.includes(path)) throw new Error(`Missing runtime module: ${path}`);
  const files = await Promise.all(unique.map(async path => {
    const bytes = await readFile(resolve(root, path));
    return { path, bytes: bytes.byteLength, sha256: sha256(bytes) };
  }));
  return {
    schema: 'SABIK_N04_CODE_PROVENANCE/1.0', source_head: buildHead, source_tree: buildTree,
    source_scope: scope, source_dirty: dirty,
    source_inventory_sha256: sha256(JSON.stringify(files)), files,
    library_deploy_id: libraryDeployId,
    library: { version: release.version, corpus_sha256: release.sha256,
      source_git_blob: release.sourceGitBlob },
    retrieval_timeout_ms: timeoutMs,
    runtime: { build: process.version, tested_compatibility_policy: ['22.16.0', '24.x'],
      cloud_runtime_to_verify: 'nodejs24.x' },
  };
}
