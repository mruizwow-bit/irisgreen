import { createHash, timingSafeEqual } from "node:crypto";
import { getDeployStore } from "@netlify/blobs";

const STORE = "sabik-n04-corpus";
const EXPECTED_VERSION = "n04-es-20260916-56f72c4d3959";
const EXPECTED_SHA256 = "56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e";
const EXPECTED_FRAGMENTS = 4332;
const EXPECTED_IDS = 4332;

function secretEquals(received, expected) {
  if (!received || !expected) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
function normalize(s) {
  return String(s ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
function query(corpus, text) {
  const terms = normalize(text).trim().split(/\s+/).filter(Boolean).slice(0, 16);
  if (!terms.length) return [];
  return corpus.fragments.map((f) => {
    const hay = normalize([f.title, f.heading, f.text, (f.concepts || []).join(" ")].filter(Boolean).join(" "));
    let score = 0;
    for (const t of terms) score += hay.split(t).length - 1;
    return { score, fragment_id: f.id, url: f.url, title: f.title };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.fragment_id.localeCompare(b.fragment_id)).slice(0, 5);
}

export default async (request) => {
  // Private staging diagnostic only. Never log token or payload.
  if (!secretEquals(request.headers.get("x-n04-smoke-token"), process.env.N04_SMOKE_TOKEN)) {
    return new Response("Not found", { status: 404 });
  }
  const store = getDeployStore(STORE);
  const manifest = await store.get("manifest.json", { type: "json" });
  if (!manifest) {
    return Response.json({ mapping_proof: "FAIL", reason: "manifest_missing_in_named_store", store: STORE, key: "manifest.json" }, { status: 503 });
  }
  if (manifest.version !== EXPECTED_VERSION || manifest.corpus_sha256 !== EXPECTED_SHA256) {
    return Response.json({ mapping_proof: "FAIL", reason: "manifest_identity_mismatch" }, { status: 503 });
  }
  const raw = await store.get(manifest.corpus_key, { type: "text" });
  if (raw == null) return Response.json({ mapping_proof: "FAIL", reason: "corpus_missing_in_named_store", key: manifest.corpus_key }, { status: 503 });
  const sha = createHash("sha256").update(raw).digest("hex");
  const corpus = JSON.parse(raw);
  const uniqueIds = new Set(corpus.fragments.map((f) => f.id)).size;
  if (sha !== EXPECTED_SHA256 || corpus.fragments.length !== EXPECTED_FRAGMENTS || uniqueIds !== EXPECTED_IDS) {
    return Response.json({ mapping_proof: "FAIL", reason: "readback_integrity_mismatch", sha, fragments: corpus.fragments.length, unique_ids: uniqueIds }, { status: 503 });
  }
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "sobrecarga sensorial";
  const hits = query(corpus, q);
  return Response.json({
    mapping_proof: "PASS",
    store: STORE,
    manifest_key: "manifest.json",
    corpus_key: manifest.corpus_key,
    version: manifest.version,
    sha256: sha,
    fragments: corpus.fragments.length,
    unique_ids: uniqueIds,
    citations: hits.map(({ fragment_id, url, title }) => ({ fragment_id, url, title })),
    api_activation: "NO_API_ACTIVATION"
  }, { headers: { "cache-control": "no-store" } });
};
