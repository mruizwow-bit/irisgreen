// work/r39/irisgreen/cloud/n04-r38-library/src/source-groups.mjs
var REQUIRED = Object.freeze([
  "library_version",
  "fragment_id",
  "snippet",
  "title",
  "heading",
  "url",
  "source_type",
  "concepts",
  "score"
]);
function plain(value) {
  return value !== null && typeof value === "object" && [Object.prototype, null].includes(Object.getPrototypeOf(value));
}
function validCandidate(candidate) {
  if (!plain(candidate)) return false;
  if (Reflect.ownKeys(candidate).some((key) => typeof key !== "string")) return false;
  if (REQUIRED.some((key) => !Object.hasOwn(candidate, key))) return false;
  if (typeof candidate.library_version !== "string" || !candidate.library_version) return false;
  if (typeof candidate.fragment_id !== "string" || !candidate.fragment_id) return false;
  if (typeof candidate.snippet !== "string") return false;
  if (typeof candidate.title !== "string") return false;
  if (typeof candidate.heading !== "string") return false;
  if (typeof candidate.url !== "string" || !candidate.url) return false;
  if (typeof candidate.source_type !== "string") return false;
  if (!Array.isArray(candidate.concepts) || candidate.concepts.some((v) => typeof v !== "string")) return false;
  if (!Number.isSafeInteger(candidate.score) || candidate.score <= 0) return false;
  return true;
}
function citation(candidate) {
  return Object.freeze({
    library_version: candidate.library_version,
    fragment_id: candidate.fragment_id,
    snippet: candidate.snippet,
    title: candidate.title,
    heading: candidate.heading,
    url: candidate.url,
    source_type: candidate.source_type,
    concepts: Object.freeze([...candidate.concepts]),
    score: candidate.score
  });
}
function groupSources(candidates) {
  if (!Array.isArray(candidates)) throw new TypeError("INVALID_SOURCE_CANDIDATES");
  const byUrl = /* @__PURE__ */ new Map();
  const groups = [];
  for (const candidate of candidates) {
    if (!validCandidate(candidate)) throw new TypeError("INVALID_SOURCE_CANDIDATE");
    let group = byUrl.get(candidate.url);
    if (!group) {
      group = { url: candidate.url, citations: [] };
      byUrl.set(candidate.url, group);
      groups.push(group);
    }
    group.citations.push(citation(candidate));
  }
  return Object.freeze(groups.map((group) => Object.freeze({
    url: group.url,
    citations: Object.freeze(group.citations)
  })));
}

// work/r39/irisgreen/sabik/retrieval-bridge.mjs
var CODES = /* @__PURE__ */ new Set([
  "INVALID_RETRIEVAL_QUERY",
  "LIBRARY_VERSION_MISMATCH",
  "LIBRARY_INTEGRITY_ERROR",
  "LIBRARY_UNAVAILABLE",
  "REQUEST_CANCELLED",
  "REQUEST_TIMEOUT"
]);
var FIELDS = Object.freeze([
  "library_version",
  "fragment_id",
  "snippet",
  "title",
  "heading",
  "url",
  "source_type",
  "concepts",
  "score"
]);
var RetrievalBridgeError = class extends Error {
  constructor(code) {
    const safe = CODES.has(code) ? code : "LIBRARY_UNAVAILABLE";
    super(safe);
    this.name = "RetrievalBridgeError";
    this.code = safe;
  }
};
var fail = (code) => {
  throw new RetrievalBridgeError(code);
};
function safeFailure(error, signal) {
  if (signal?.aborted || error?.name === "AbortError") return new RetrievalBridgeError("REQUEST_CANCELLED");
  return new RetrievalBridgeError(error?.code);
}
function safeSourceUrl(value) {
  if (typeof value !== "string" || !value || /[\u0000-\u0020\u007f]/u.test(value)) fail("LIBRARY_INTEGRITY_ERROR");
  let url;
  try {
    url = new URL(value);
  } catch {
    fail("LIBRARY_INTEGRITY_ERROR");
  }
  if (url.origin !== "https://irisgreen.eu" || url.username || url.password) fail("LIBRARY_INTEGRITY_ERROR");
  return value;
}
function candidatesFromBody(body, library) {
  if (!body || typeof body !== "object" || Array.isArray(body)) fail("LIBRARY_INTEGRITY_ERROR");
  if (body.library_version !== library.version) fail("LIBRARY_VERSION_MISMATCH");
  if (body.corpus_sha256 !== library.corpusSha256 || body.source_git_blob !== library.sourceGitBlob || !/^[a-f0-9]{40}$/.test(body.build_head ?? "") || !/^[a-f0-9]{24}$/.test(body.deploy_id ?? "") || !Array.isArray(body.results) || body.results.length > 20) fail("LIBRARY_INTEGRITY_ERROR");
  const ids = /* @__PURE__ */ new Set();
  return Object.freeze(body.results.map((result) => {
    if (!result || typeof result !== "object" || Array.isArray(result) || Object.keys(result).some((key) => !FIELDS.includes(key) && key !== "editorial_status") || FIELDS.some((key) => !Object.hasOwn(result, key)) || result.editorial_status !== "PUBLICABLE" || result.library_version !== library.version || typeof result.fragment_id !== "string" || !result.fragment_id || ids.has(result.fragment_id) || typeof result.snippet !== "string" || result.snippet.length > 480 || !Array.isArray(result.concepts)) fail("LIBRARY_INTEGRITY_ERROR");
    ids.add(result.fragment_id);
    return Object.freeze(Object.fromEntries(FIELDS.map((key) => [
      key,
      key === "url" ? safeSourceUrl(result[key]) : key === "concepts" ? Object.freeze([...result[key]]) : result[key]
    ])));
  }));
}
function createRetrievalQuery({ transport, library } = {}) {
  if (typeof transport !== "function" || !library || typeof library.version !== "string" || !library.version || !/^[a-f0-9]{64}$/.test(library.corpusSha256 ?? "") || !/^[a-f0-9]{40}$/.test(library.sourceGitBlob ?? "") || library.sourceLanguage !== "es") throw new TypeError("Invalid retrieval composition");
  const source = Object.freeze({
    version: library.version,
    corpusSha256: library.corpusSha256,
    sourceGitBlob: library.sourceGitBlob,
    sourceLanguage: library.sourceLanguage
  });
  return async function query(request, { signal } = {}) {
    try {
      if (signal?.aborted) fail("REQUEST_CANCELLED");
      const response = await transport(request, { signal });
      if (signal?.aborted) fail("REQUEST_CANCELLED");
      if (!(response instanceof Response) || !/^application\/json(?:;|$)/i.test(response.headers.get("content-type") ?? "")) fail("LIBRARY_UNAVAILABLE");
      const body = await response.json();
      if (signal?.aborted) fail("REQUEST_CANCELLED");
      if (!response.ok) {
        const outcome = response.headers.get("X-Sabik-Request-Outcome");
        if (outcome === "REQUEST_CANCELLED" || outcome === "REQUEST_TIMEOUT") fail(outcome);
        if (body?.error === "wrong_version") fail("LIBRARY_VERSION_MISMATCH");
        if (["invalid_query", "invalid_request", "invalid_limit"].includes(body?.error)) fail("INVALID_RETRIEVAL_QUERY");
        fail("LIBRARY_UNAVAILABLE");
      }
      const candidates = candidatesFromBody(body, source);
      let groups;
      try {
        groups = groupSources(candidates);
      } catch {
        fail("LIBRARY_INTEGRITY_ERROR");
      }
      return Object.freeze({ library_version: source.version, candidates, groups, source_language: source.sourceLanguage });
    } catch (error) {
      throw safeFailure(error, signal);
    }
  };
}
export {
  RetrievalBridgeError,
  createRetrievalQuery
};
