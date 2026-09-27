import { createHash } from 'node:crypto';

export class CloudLibraryError extends Error {
  constructor(code) { super(code); this.name = 'CloudLibraryError'; this.code = code; }
}
const fail = code => { throw new CloudLibraryError(code); };
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export const digestV2 = value => createHash('sha256').update(value).digest('hex');

function asBytes(value, max) {
  let bytes;
  if (value instanceof ArrayBuffer) bytes = new Uint8Array(value);
  else if (ArrayBuffer.isView(value)) bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  else if (Buffer.isBuffer(value)) bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  else fail('invalid_blob_type');
  if (bytes.byteLength > max) fail('blob_too_large');
  return bytes;
}
function parse(bytes) {
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { fail('invalid_blob_json'); }
}
export function freezeV2(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freezeV2); Object.freeze(value);
  }
  return value;
}
export function assertCloudRelease(release) {
  if (!plain(release) || release.schema !== 'SABIK_CLOUD_LIBRARY_RELEASE/2.0' ||
      typeof release.version !== 'string' || !/^sabik-es-en-20260927-r02-[a-f0-9]{12}$/.test(release.version) ||
      !/^[a-f0-9]{64}$/.test(release.corpus_sha256 || '') ||
      !/^[a-f0-9]{64}$/.test(release.source_bundle_sha256 || '') ||
      release.approved_child_safe_package_sha256 !== 'b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23' ||
      release.approved_safe_variants_sha256 !== '4167fe9cf767623c1188b5796297b4f83a89b0c2928a55bcc0f765690bfb3260' ||
      release.approved_safe_source_snapshot_sha256 !== '7438eeadeffb3918cacd7654c0e2943b4cfd9b16ef37ca3fb79c4367395657b6' ||
      !/^[a-f0-9]{40}$/.test(release.source_commit || '') ||
      !Number.isSafeInteger(release.corpus_bytes) || release.corpus_bytes < 1 ||
      !Number.isSafeInteger(release.fragment_count) || release.fragment_count < 1 ||
      release.unique_ids !== release.fragment_count ||
      !plain(release.locale_counts) || !Number.isSafeInteger(release.locale_counts.es) ||
      !Number.isSafeInteger(release.locale_counts.en) ||
      release.locale_counts.es + release.locale_counts.en !== release.fragment_count ||
      !Number.isSafeInteger(release.full_s2_count) || !Number.isSafeInteger(release.safe_variant_count) ||
      release.full_s2_count !== release.safe_variant_count ||
      release.store !== 'sabik-n04-corpus' || release.region !== 'us-east-2' ||
      release.storage_kind !== 'named-deploy-store' ||
      release.manifest_key !== 'cloud-library/manifest.json' ||
      release.corpus_key !== 'cloud-library/versions/' + release.version + '/corpus.json' ||
      !Array.isArray(release.source_inventory) || release.source_inventory.length < 1) fail('invalid_release');
  return release;
}
export function assertCloudVersion(version, release) {
  assertCloudRelease(release);
  if (version !== release.version) fail('wrong_version');
  return version;
}
export function createCloudManifest(release, provenance) {
  assertCloudRelease(release);
  return {
    schema: 'SABIK_CLOUD_LIBRARY_MANIFEST/2.0',
    version: release.version,
    corpus_sha256: release.corpus_sha256,
    corpus_bytes: release.corpus_bytes,
    fragment_count: release.fragment_count,
    unique_ids: release.unique_ids,
    locale_counts: release.locale_counts,
    full_s2_count: release.full_s2_count,
    safe_variant_count: release.safe_variant_count,
    source_commit: release.source_commit,
    source_bundle_sha256: release.source_bundle_sha256,
    approved_child_safe_package_sha256: release.approved_child_safe_package_sha256,
    approved_safe_variants_sha256: release.approved_safe_variants_sha256,
    approved_safe_source_snapshot_sha256: release.approved_safe_source_snapshot_sha256,
    source_inventory: release.source_inventory,
    corpus_key: release.corpus_key,
    storage_kind: release.storage_kind,
    store: release.store,
    region: release.region,
    created_at: new Date().toISOString(),
    provenance
  };
}
export function verifyCloudManifest(manifest, release) {
  if (!plain(manifest)) fail('invalid_manifest');
  const expected = createCloudManifest(release, null);
  for (const key of Object.keys(expected).filter(k => !['created_at', 'provenance'].includes(k))) {
    if (JSON.stringify(manifest[key]) !== JSON.stringify(expected[key])) fail('manifest_identity_mismatch');
  }
  if (typeof manifest.created_at !== 'string' || !Number.isFinite(Date.parse(manifest.created_at)) ||
      !plain(manifest.provenance) ||
      !/^[a-f0-9]{40}$/.test(manifest.provenance.build_head || '') ||
      !/^[a-f0-9]{40}$/.test(manifest.provenance.build_tree || '') ||
      !/^[a-f0-9]{64}$/.test(manifest.provenance.engine_sha256 || '')) fail('invalid_provenance');
  return manifest;
}

const allowedSensitivity = new Set(['S0_GENERAL', 'S1_SENSITIVE', 'S2_HIGH_SENSITIVITY']);
const allowedDiscovery = new Set(['NORMAL', 'INTENTIONAL_ONLY', 'SAFE_VARIANT_REQUIRED']);
const allowedLocale = new Set(['es', 'en']);
const allowedAudience = new Set(['INFANCIA', 'ADOLESCENCIA', 'ADULTEZ', 'TRANSVERSAL']);
const fragmentFields = new Set([
  'content_id','fragment_id','locale','url','title','heading','text','source_type','editorial_status',
  'source_version','source_sha256','source_path','library_version','audience','sensitivity','discovery',
  'safe_variant_id','concepts','source_editorial_status','derived_from_fragment_id','safe_variant_group','safety_content_id'
]);

export function validateCloudCorpusStructure(corpus, release) {
  assertCloudRelease(release);
  if (!plain(corpus) || corpus.schema !== 'SABIK_CLOUD_CORPUS/2.0' ||
      corpus.library_version !== release.version || corpus.source_commit !== release.source_commit ||
      corpus.source_bundle_sha256 !== release.source_bundle_sha256 ||
      !Array.isArray(corpus.locales) || corpus.locales.join(',') !== 'es,en' ||
      corpus.fragment_count !== release.fragment_count ||
      !Array.isArray(corpus.fragments) || corpus.fragments.length !== release.fragment_count) fail('corpus_count_or_metadata_mismatch');

  const ids = new Set(); const byId = new Map(); const localeCounts = { es: 0, en: 0 };
  for (const f of corpus.fragments) {
    if (!plain(f) || Object.keys(f).some(k => !fragmentFields.has(k)) ||
        ['content_id','fragment_id','locale','url','title','heading','text','source_type','editorial_status','source_version','source_sha256','source_path','library_version','sensitivity','discovery']
          .some(k => typeof f[k] !== 'string') ||
        !f.content_id || !f.fragment_id || !f.text || !allowedLocale.has(f.locale) ||
        f.library_version !== release.version || !/^[a-f0-9]{64}$/.test(f.source_sha256) ||
        !allowedSensitivity.has(f.sensitivity) || !allowedDiscovery.has(f.discovery) ||
        !Array.isArray(f.audience) || !f.audience.length || f.audience.some(a => !allowedAudience.has(a)) ||
        !Array.isArray(f.concepts) || f.concepts.some(c => typeof c !== 'string') ||
        !(f.safe_variant_id === null || typeof f.safe_variant_id === 'string') ||
        !(f.derived_from_fragment_id === null || typeof f.derived_from_fragment_id === 'string') ||
        !(f.safe_variant_group === null || typeof f.safe_variant_group === 'string') ||
        !(f.safety_content_id === null || typeof f.safety_content_id === 'string') ||
        !(f.source_editorial_status === null || typeof f.source_editorial_status === 'string')) fail('invalid_fragment');
    let url; try { url = new URL(f.url); } catch { fail('invalid_source_url'); }
    if (url.origin !== 'https://irisgreen.eu' || url.username || url.password) fail('invalid_source_url');
    if (ids.has(f.fragment_id)) fail('duplicate_fragment_id');
    ids.add(f.fragment_id); byId.set(f.fragment_id, f); localeCounts[f.locale]++;
  }
  if (ids.size !== release.unique_ids || localeCounts.es !== release.locale_counts.es ||
      localeCounts.en !== release.locale_counts.en) fail('fragment_identity_mismatch');

  let fullS2 = 0, safeVariants = 0;
  for (const f of corpus.fragments) {
    const full = f.sensitivity === 'S2_HIGH_SENSITIVITY' && f.source_type !== 'safe_variant';
    if (full) {
      fullS2++;
      if (f.discovery !== 'SAFE_VARIANT_REQUIRED' || !f.safe_variant_id) fail('invalid_s2_policy');
      const safe = byId.get(f.safe_variant_id);
      if (!safe || safe.source_type !== 'safe_variant' || safe.locale !== f.locale ||
          safe.content_id !== f.content_id || safe.derived_from_fragment_id !== f.fragment_id ||
          safe.sensitivity === 'S2_HIGH_SENSITIVITY') fail('invalid_s2_policy');
    }
    if (f.source_type === 'safe_variant') safeVariants++;
  }
  if (fullS2 !== release.full_s2_count || safeVariants !== release.safe_variant_count) fail('invalid_s2_policy');
  return corpus;
}
export function verifyCloudCorpus(value, release) {
  const bytes = asBytes(value, release.corpus_bytes);
  if (bytes.byteLength !== release.corpus_bytes || digestV2(bytes) !== release.corpus_sha256) fail('corpus_integrity_mismatch');
  return validateCloudCorpusStructure(parse(bytes), release);
}
export function termsV2(text) {
  return [...new Set(String(text).normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [])];
}

function validateSearch(args, release) {
  const { query, locale = 'es', context = 'default', explicitIntent = false, limit = 5, filters = {}, version = release.version } = args || {};
  assertCloudVersion(version, release);
  if (typeof query !== 'string' || !query.trim() || query.length > 300 || termsV2(query).length > 32) fail('invalid_query');
  if (!allowedLocale.has(locale)) fail('invalid_locale');
  if (!['default','child','teen','adult'].includes(context)) fail('invalid_context');
  if (typeof explicitIntent !== 'boolean') fail('invalid_intent');
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) fail('invalid_limit');
  const allowedFilters = new Set(['source_type','editorial_status','url','sensitivity','discovery','audience','content_id']);
  if (!plain(filters) || Object.keys(filters).some(k => !allowedFilters.has(k))) fail('invalid_filters');
  for (const [key, value] of Object.entries(filters)) {
    if (key === 'audience') {
      if (!Array.isArray(value) || !value.length || value.length > 4 || value.some(v => !allowedAudience.has(v))) fail('invalid_filters');
    } else if (typeof value !== 'string' || !value || value.length > 2048) fail('invalid_filters');
  }
  return { query, locale, context, explicitIntent, limit, filters };
}
function matches(f, filters) {
  return Object.entries(filters).every(([key, value]) => key === 'audience' ? value.every(v => f.audience.includes(v)) : f[key] === value);
}
function resultOf(f, score, release) {
  return freezeV2({
    library_version: release.version,
    content_id: f.content_id,
    fragment_id: f.fragment_id,
    locale: f.locale,
    snippet: f.text.slice(0, 480),
    title: f.title,
    heading: f.heading,
    url: f.url,
    source_type: f.source_type,
    editorial_status: f.editorial_status,
    concepts: [...f.concepts],
    sensitivity: f.sensitivity,
    discovery: f.discovery,
    safe_variant_id: f.safe_variant_id,
    source_version: f.source_version,
    source_sha256: f.source_sha256,
    score,
    citation: {
      fragment_id: f.fragment_id,
      url: f.url,
      title: f.title,
      heading: f.heading,
      library_version: release.version,
      source_version: f.source_version,
      source_sha256: f.source_sha256,
      locale: f.locale,
      score
    }
  });
}
function createIndex(corpus, release) {
  const byId = new Map(corpus.fragments.map(f => [f.fragment_id, f]));
  const indexes = new Map();
  for (const locale of ['es','en']) {
    for (const mode of ['safe','adult-explicit']) {
      const allowed = corpus.fragments.filter(f => {
        if (f.locale !== locale) return false;
        const fullS2 = f.sensitivity === 'S2_HIGH_SENSITIVITY' && f.source_type !== 'safe_variant';
        return mode === 'adult-explicit' || !fullS2;
      });
      const postings = new Map();
      allowed.forEach((f, n) => {
        for (const [text, weight] of [[f.text, 1],[f.title, 4],[f.heading, 3],[f.concepts.join(' '), 3]]) {
          for (const term of termsV2(text)) {
            if (!postings.has(term)) postings.set(term, new Map());
            const entry = postings.get(term); entry.set(n, (entry.get(n) || 0) + weight);
          }
        }
      });
      indexes.set(locale + ':' + mode, { allowed, postings });
    }
  }
  return {
    getFragment: id => typeof id === 'string' ? byId.get(id) || null : null,
    searchLibrary(args) {
      const input = validateSearch(args, release);
      const mode = input.context === 'adult' && input.explicitIntent ? 'adult-explicit' : 'safe';
      const index = indexes.get(input.locale + ':' + mode);
      const scores = new Map();
      for (const term of termsV2(input.query)) {
        for (const [n, weight] of index.postings.get(term) || []) scores.set(n, (scores.get(n) || 0) + 100 + weight);
      }
      return Object.freeze([...scores]
        .filter(([n]) => matches(index.allowed[n], input.filters))
        .sort(([a, sa], [b, sb]) => sb - sa || (index.allowed[a].fragment_id < index.allowed[b].fragment_id ? -1 : 1))
        .slice(0, input.limit)
        .map(([n, score]) => resultOf(index.allowed[n], score, release)));
    }
  };
}
async function read(store, key, max, missing) {
  let value; try { value = await store.get(key, { type: 'arrayBuffer', consistency: 'strong' }); }
  catch { fail('storage_unavailable'); }
  if (value == null) fail(missing);
  return asBytes(value, max);
}
export async function loadCloudLibrary(store, release) {
  assertCloudRelease(release);
  if (!store || typeof store.get !== 'function') fail('invalid_storage_adapter');
  const manifest = freezeV2(verifyCloudManifest(parse(await read(store, release.manifest_key, 65536, 'manifest_missing')), release));
  const corpus = freezeV2(verifyCloudCorpus(await read(store, release.corpus_key, release.corpus_bytes, 'corpus_missing'), release));
  return freezeV2({ manifest, ...createIndex(corpus, release) });
}
export function createCachedCloudReader(getDeployStore, release) {
  assertCloudRelease(release);
  let cache;
  return async ({ deployId, version = release.version }) => {
    assertCloudVersion(version, release);
    if (!/^[a-f0-9]{24}$/.test(deployId || '')) fail('invalid_deploy_context');
    const key = deployId + ':' + version;
    if (!cache || cache.key !== key) {
      const entry = { key };
      entry.promise = Promise.resolve().then(() => loadCloudLibrary(
        getDeployStore({ name: release.store, region: release.region, deployID: deployId, consistency: 'strong' }), release))
        .catch(error => { if (cache === entry) cache = undefined; throw error; });
      cache = entry;
    }
    return cache.promise;
  };
}
