import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
async function filesUnder(dir) {
  const out = [];
  async function walk(p) {
    for (const e of await readdir(p, { withFileTypes: true })) {
      const f = resolve(p, e.name);
      if (e.isDirectory()) await walk(f);
      else if (e.isFile()) out.push(f);
    }
  }
  await walk(dir);
  return out.sort();
}
const roots = [resolve(project, ".netlify/blobs/deploy"), resolve(project, "dist"), resolve(project, "build/function-plan")];
const entries = [];
for (const r of roots) for (const p of await filesUnder(r)) {
  const b = await readFile(p);
  entries.push({ path: relative(project, p).replaceAll("\\","/"), bytes: b.length, sha256: createHash("sha256").update(b).digest("hex") });
}
const canonical = JSON.stringify(entries);
const manifest = { schema:"SABIK_N04_R26_BUILD_OUTPUT_HASHES/1.0", entries, aggregate_sha256:createHash("sha256").update(canonical).digest("hex") };
await writeFile(resolve(project, "evidence/BUILD_OUTPUT_HASHES.json"), JSON.stringify(manifest,null,2)+"\n");
console.log(JSON.stringify(manifest,null,2));
