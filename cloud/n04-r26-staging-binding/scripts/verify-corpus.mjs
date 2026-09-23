import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

export const CORPUS_PATH = new URL("../source/iris-fragments-index.es.json", import.meta.url);
export const EXPECTED = Object.freeze({
  gitBlob: "0e297c977ce3b688186ca917981458adfd5e5ca3",
  sha256: "56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e",
  fragmentCount: 4332,
  uniqueIds: 4332,
  version: "n04-es-20260916-56f72c4d3959",
  language: "es",
  baseUrl: "https://irisgreen.eu",
});

export async function verifyCorpus() {
  const bytes = await readFile(CORPUS_PATH);
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  if (sha256 !== EXPECTED.sha256) throw new Error(`corpus sha256 mismatch: ${sha256}`);
  const corpus = JSON.parse(bytes.toString("utf8"));
  if (corpus.fragment_count !== EXPECTED.fragmentCount) throw new Error(`declared fragment_count mismatch: ${corpus.fragment_count}`);
  if (!Array.isArray(corpus.fragments) || corpus.fragments.length !== EXPECTED.fragmentCount) throw new Error(`actual fragment count mismatch: ${corpus.fragments?.length}`);
  const ids = corpus.fragments.map((f) => f.id);
  const unique = new Set(ids);
  if (unique.size !== EXPECTED.uniqueIds) throw new Error(`unique id mismatch: ${unique.size}`);
  if (corpus.language !== EXPECTED.language) throw new Error(`language mismatch: ${corpus.language}`);
  if (corpus.base_url !== EXPECTED.baseUrl) throw new Error(`base_url mismatch: ${corpus.base_url}`);
  for (const f of corpus.fragments) {
    if (typeof f.id !== "string" || !f.id) throw new Error("empty fragment id");
    if (typeof f.url !== "string" || !f.url.startsWith("https://irisgreen.eu/")) throw new Error(`non-Iris corpus URL at ${f.id}`);
  }
  return {
    bytes,
    corpus,
    evidence: {
      sha256,
      bytes: bytes.length,
      fragment_count: corpus.fragments.length,
      unique_ids: unique.size,
      declared_url_count: corpus.url_count,
      language: corpus.language,
      base_url: corpus.base_url,
      version: EXPECTED.version,
    },
  };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log(JSON.stringify((await verifyCorpus()).evidence, null, 2));
}
