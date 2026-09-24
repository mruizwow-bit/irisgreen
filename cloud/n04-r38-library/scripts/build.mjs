import { writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { RELEASE } from '../src/library.mjs';
import { LIBRARY_DEPLOY_ID, RETRIEVAL_TIMEOUT_MS } from '../src/cloud-release.mjs';
import { createCodeProvenance } from './build-code-provenance.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const provenance = await createCodeProvenance({ projectRoot: root,
  libraryDeployId: LIBRARY_DEPLOY_ID, release: RELEASE, timeoutMs: RETRIEVAL_TIMEOUT_MS });
if (provenance.source_dirty) throw new Error('Commit the source before building a release');
await mkdir(new URL('../build/', import.meta.url), { recursive: true });
await writeFile(new URL('../build/code-provenance.json', import.meta.url), JSON.stringify(provenance, null, 2) + '\n');
// R39 builds code only. It never regenerates or republishes the sealed R38 library.
// Retain the existing static placeholder; no new diagnostic web is introduced.
const dist = new URL('../dist/', import.meta.url);
await mkdir(dist, { recursive: true });
const existing = await readdir(dist);
if (existing.some(f => !['index.html', '_headers', 'sabik-connect.mjs'].includes(f))) throw new Error('Unexpected public files');
await copyFile(new URL('../src/cloud-connection.mjs', import.meta.url), new URL('sabik-connect.mjs', dist));
await writeFile(new URL('index.html', dist), '<!doctype html><html lang="es"><meta charset="utf-8"><title>Sabik · Biblioteca N04</title><h1>Biblioteca N04 · diagnóstico privado</h1><p>NO_API_ACTIVATION</p></html>\n');
await writeFile(new URL('_headers', dist), '/*\n  Cache-Control: no-store\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n');
console.log(JSON.stringify({ status: 'PASS', provenance, public_files: ['index.html', '_headers', 'sabik-connect.mjs'], library_writes: 0 }, null, 2));
