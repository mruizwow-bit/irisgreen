const REQUIRED = Object.freeze([
  'library_version', 'fragment_id', 'snippet', 'title', 'heading',
  'url', 'source_type', 'concepts', 'score',
]);

function plain(value) {
  return value !== null && typeof value === 'object' &&
    [Object.prototype, null].includes(Object.getPrototypeOf(value));
}

function validCandidate(candidate) {
  if (!plain(candidate)) return false;
  if (Reflect.ownKeys(candidate).some(key => typeof key !== 'string')) return false;
  if (REQUIRED.some(key => !Object.hasOwn(candidate, key))) return false;
  if (typeof candidate.library_version !== 'string' || !candidate.library_version) return false;
  if (typeof candidate.fragment_id !== 'string' || !candidate.fragment_id) return false;
  if (typeof candidate.snippet !== 'string') return false;
  if (typeof candidate.title !== 'string') return false;
  if (typeof candidate.heading !== 'string') return false;
  if (typeof candidate.url !== 'string' || !candidate.url) return false;
  if (typeof candidate.source_type !== 'string') return false;
  if (!Array.isArray(candidate.concepts) || candidate.concepts.some(v => typeof v !== 'string')) return false;
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
    score: candidate.score,
  });
}

/**
 * Presentation-only grouping for already-ranked R39 candidates.
 *
 * - Groups by exact URL string, never by normalized/path-equivalent URL.
 * - Preserves first-appearance source order and candidate order inside each source.
 * - Preserves every citation field needed to trace the ranked fragment.
 * - Never mutates, reorders, filters, reranks, or expands the caller's candidates.
 *
 * The caller keeps the original raw candidates separately. This function returns
 * only the grouped presentation view.
 */
export function groupSources(candidates) {
  if (!Array.isArray(candidates)) throw new TypeError('INVALID_SOURCE_CANDIDATES');

  const byUrl = new Map();
  const groups = [];

  for (const candidate of candidates) {
    if (!validCandidate(candidate)) throw new TypeError('INVALID_SOURCE_CANDIDATE');

    let group = byUrl.get(candidate.url);
    if (!group) {
      group = { url: candidate.url, citations: [] };
      byUrl.set(candidate.url, group);
      groups.push(group);
    }
    group.citations.push(citation(candidate));
  }

  return Object.freeze(groups.map(group => Object.freeze({
    url: group.url,
    citations: Object.freeze(group.citations),
  })));
}
