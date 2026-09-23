import { readFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { verifyCorpus, EXPECTED } from "./verify-corpus.mjs";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const { evidence } = await verifyCorpus();
const pkg = JSON.parse(await readFile(resolve(project, "package.json"), "utf8"));
if (pkg.dependencies?.["@netlify/blobs"] !== "11.1.0") errors.push("@netlify/blobs not exact 11.1.0");
if (pkg.devDependencies?.["netlify-cli"] !== "27.8.0") errors.push("netlify-cli not exact 27.8.0");
let lock;
try { lock = JSON.parse(await readFile(resolve(project, "package-lock.json"), "utf8")); } catch { errors.push("package-lock.json missing"); }
if (lock) {
  if (lock.packages?.[""]?.dependencies?.["@netlify/blobs"] !== "11.1.0") errors.push("lock root blobs pin mismatch");
  if (lock.packages?.[""]?.devDependencies?.["netlify-cli"] !== "27.8.0") errors.push("lock root CLI pin mismatch");
}
const manifestPath = resolve(project, ".netlify/blobs/deploy/sabik-n04-corpus/manifest.json");
const corpusPath = resolve(project, `.netlify/blobs/deploy/sabik-n04-corpus/versions/${EXPECTED.version}/corpus.json`);
for (const p of [manifestPath, corpusPath]) {
  try { if (!(await stat(p)).isFile()) errors.push(`not file: ${p}`); } catch { errors.push(`missing build output: ${p}`); }
}
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
if (manifest.runtime_expected_store !== "sabik-n04-corpus") errors.push("runtime store mismatch");
if (manifest.runtime_expected_manifest_key !== "manifest.json") errors.push("manifest key mismatch");
if (manifest.mapping_live_proof_required !== true) errors.push("mapping must require live proof");
const fn = await readFile(resolve(project, "netlify/functions/n04-storage-readback.mjs"), "utf8");
if (!fn.includes('getDeployStore(STORE)') || !fn.includes('const STORE = "sabik-n04-corpus"')) errors.push("function named store binding missing");
if (/\.set\s*\(|\.setJSON\s*\(|\.delete\s*\(|\.deleteAll\s*\(/.test(fn)) errors.push("runtime corpus write/delete detected");
if (/provider|anthropic|openai/i.test(fn)) errors.push("provider/model reference detected in storage function");
if (fn.includes("SABIK_AI_ENABLED =") || fn.includes('SABIK_AI_ENABLED","true')) errors.push("API activation mutation detected");
const forbiddenData = ["conversation_payload","private_profile","student_profile","minor_data","provider_payload"];
const corpusManifestText = JSON.stringify(manifest);
for (const t of forbiddenData) if (corpusManifestText.includes(t)) errors.push(`forbidden data marker in corpus manifest: ${t}`);
const report = {
  schema: "SABIK_N04_R26_PREDEPLOY_GATE/1.0",
  status: errors.length ? "FAIL" : "PASS",
  corpus: evidence,
  dependency_pin: pkg.dependencies["@netlify/blobs"],
  netlify_cli_pin: pkg.devDependencies["netlify-cli"],
  lockfile_present: Boolean(lock),
  file_based_upload_mapping_documented: true,
  mapping_live_equivalence_proven: false,
  mapping_live_equivalence_gate: "WAIT_EXPLICIT_DEPLOY_AUTHORIZATION",
  runtime_corpus_writes: 0,
  api_activation: false,
  forbidden_private_data: 0,
  errors,
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
