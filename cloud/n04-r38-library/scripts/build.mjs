import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RELEASE, BINDING, digest, verifyCorpus, createManifest, verifyManifest } from '../src/library.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
const source = new URL('../../n04-r26-staging-binding/source/iris-fragments-index.es.json', import.meta.url);
const bytes = await readFile(source); verifyCorpus(bytes);
if (git('hash-object', fileURLToPath(source)) !== RELEASE.sourceGitBlob) throw new Error('Source Git blob mismatch');
const files = ['src/library.mjs', 'src/qa-handler.mjs', 'netlify/functions/n04-library-qa.mjs'];
const engine = Buffer.concat(await Promise.all(files.map(f => readFile(new URL('../' + f, import.meta.url)))));
const manifest = createManifest({ build_head: git('rev-parse', 'HEAD'), build_tree: git('rev-parse', 'HEAD^{tree}'), engine_sha256: digest(engine) });
verifyManifest(manifest);
const folder = new URL('../build/library/', import.meta.url);
await mkdir(new URL(`versions/${RELEASE.version}/`, folder), { recursive: true });
await writeFile(new URL(BINDING.corpusKey, folder), bytes);
await writeFile(new URL(BINDING.manifestKey, folder), JSON.stringify(manifest, null, 2) + '\n');
// Keep corpus/manifest out of the static publish directory and legacy automatic uploader.
const dist = new URL('../dist/', import.meta.url);
await mkdir(dist, { recursive: true });
const existing = await readdir(dist);
if (existing.some(f => !['index.html', '_headers'].includes(f))) throw new Error('Unexpected public files');
await writeFile(new URL('index.html', dist), '<!doctype html><html lang="es"><meta charset="utf-8"><title>Sabik · Biblioteca N04</title><h1>Biblioteca N04 · diagnóstico privado</h1><p>NO_API_ACTIVATION</p></html>\n');
await writeFile(new URL('_headers', dist), '/*\n  Cache-Control: no-store\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n');
console.log(JSON.stringify({ status: 'PASS', manifest, manifest_sha256: digest(await readFile(new URL('manifest.json', folder))), public_files: ['index.html', '_headers'] }, null, 2));
