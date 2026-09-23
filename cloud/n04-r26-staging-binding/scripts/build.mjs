import { mkdir, rm, writeFile, copyFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyCorpus, EXPECTED } from "./verify-corpus.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const project = resolve(here, "..");
const deployRoot = resolve(project, ".netlify/blobs/deploy");
const fileUploadPrefix = "sabik-n04-corpus";
const storeRoot = resolve(deployRoot, fileUploadPrefix);
const versionKey = `versions/${EXPECTED.version}/corpus.json`;
const corpusDest = resolve(storeRoot, versionKey);
const manifestDest = resolve(storeRoot, "manifest.json");
const dist = resolve(project, "dist");
const plan = resolve(project, "build/function-plan");

await rm(deployRoot, { recursive: true, force: true });
await rm(dist, { recursive: true, force: true });
await rm(resolve(project, "build"), { recursive: true, force: true });

const { bytes, corpus, evidence } = await verifyCorpus();

await mkdir(dirname(corpusDest), { recursive: true });
await writeFile(corpusDest, bytes);
const manifest = {
  schema: "SABIK_N04_CORPUS_MANIFEST/1.0",
  version: EXPECTED.version,
  corpus_sha256: EXPECTED.sha256,
  corpus_key: versionKey,
  fragment_count: evidence.fragment_count,
  unique_ids: evidence.unique_ids,
  language: corpus.language,
  source_git_blob: EXPECTED.gitBlob,
  file_upload_prefix: fileUploadPrefix,
  runtime_expected_store: "sabik-n04-corpus",
  runtime_expected_manifest_key: "manifest.json",
  mapping_live_proof_required: true,
};
await writeFile(manifestDest, JSON.stringify(manifest, null, 2) + "\n");

await mkdir(dist, { recursive: true });
await writeFile(resolve(dist, "index.html"), `<!doctype html><meta charset="utf-8"><title>Sabik N04 staging binding</title><h1>Sabik N04 staging binding candidate</h1><p>NO_API_ACTIVATION</p>`);

await mkdir(plan, { recursive: true });
await copyFile(resolve(project, "netlify/functions/n04-storage-readback.mjs"), resolve(plan, "n04-storage-readback.mjs"));
await copyFile(resolve(project, "package.json"), resolve(plan, "package.json"));
try { await copyFile(resolve(project, "package-lock.json"), resolve(plan, "package-lock.json")); } catch {}

const mapping = {
  schema: "SABIK_N04_R26_FILE_UPLOAD_MAPPING/1.0",
  generated_during_build: true,
  file_based_upload_root: ".netlify/blobs/deploy",
  generated_paths: [
    `.netlify/blobs/deploy/${fileUploadPrefix}/manifest.json`,
    `.netlify/blobs/deploy/${fileUploadPrefix}/${versionKey}`
  ],
  documented_file_upload_blob_keys: [
    `${fileUploadPrefix}/manifest.json`,
    `${fileUploadPrefix}/${versionKey}`
  ],
  runtime_expected_named_store: "sabik-n04-corpus",
  runtime_expected_keys: ["manifest.json", versionKey],
  status: "PREPARED_LIVE_EQUIVALENCE_NOT_ASSUMED",
  live_rule: "Smoke must PASS using getDeployStore('sabik-n04-corpus') + manifest.json; no fallback to prefixed key."
};
await mkdir(resolve(project, "evidence"), { recursive: true });
await writeFile(resolve(project, "evidence/FILE_UPLOAD_MAPPING.json"), JSON.stringify(mapping, null, 2) + "\n");

console.log(JSON.stringify({ corpus: evidence, manifest, mapping }, null, 2));
