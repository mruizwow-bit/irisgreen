import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = new URL('../sources/a9-r01/', import.meta.url);
const safetySourceUrl = new URL('../sources/a9-r02-safety/APPROVED_SAFE_VARIANTS_R42.json', import.meta.url);
const outDir = new URL('../build/library-v2/', import.meta.url);
const SOURCE_DATE = '2026-09-27';
const ORIGIN = 'https://irisgreen.eu';

const sha256 = value => createHash('sha256').update(value).digest('hex');
const slug = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function collectText(value, key = '') {
  if (value == null) return [];
  if (typeof value === 'string') {
    if (/^(?:url|doi|by|reviewedBy|status)$/i.test(key) || /^https?:\/\//i.test(value)) return [];
    return value.trim() ? [value.trim()] : [];
  }
  if (Array.isArray(value)) return value.flatMap(v => collectText(v, key));
  if (typeof value === 'object') return Object.entries(value).flatMap(([k, v]) =>
    /^(?:sources|source|reviewed|revisarAntesDe)$/i.test(k) ? [] : collectText(v, k));
  return [];
}

const S2_CATALOG = new Map([
  ['Abuso y explotación', 'global-188'],
  ['Anorexia nerviosa', 'global-200'],
  ['Trastorno por atracón', 'global-212'],
  ['Bulimia nerviosa', 'global-224'],
  ['Trastornos de la conducta alimentaria (TCA)', 'global-237'],
  ['Otros trastornos alimentarios especificados (OSFED)', 'global-320'],
  ['TEPT / trastorno por estrés postraumático', 'global-360'],
  ['TEPT complejo', 'global-395']
]);
const S2_EVERYDAY = new Map([
  ['ARFID, TCA y pica: cuándo el apoyo cotidiano necesita atención clínica', 'library-022'],
  ['Abuso, explotación y relaciones seguras', 'library-057']
]);
const S2_RESEARCH = new Map([
  [5, 'research-005'], [36, 'research-036'], [37, 'research-037'],
  [45, 'research-045'], [46, 'research-046'], [71, 'research-071']
]);

const sourceManifest = JSON.parse(await readFile(new URL('SOURCE.json', sourceDir), 'utf8'));
if (sourceManifest?.schema !== 'SABIK_CLOUD_SOURCE_SNAPSHOT/1.0' ||
    !/^[a-f0-9]{40}$/.test(sourceManifest.source_commit || '')) {
  throw new Error('Invalid source snapshot manifest');
}

const approvedSafetyBytes = await readFile(safetySourceUrl);
const approvedSafetySha256 = sha256(approvedSafetyBytes);
const approvedSafety = JSON.parse(approvedSafetyBytes.toString('utf8'));
if (approvedSafety?.schema !== 'SABIK_A9_APPROVED_SAFE_VARIANTS/1.0' ||
    approvedSafety.source_package?.name !== 'iris-green-contenido-R02-DESIGN-CHILD-SAFE-20260927.zip' ||
    approvedSafety.source_package?.sha256 !== 'b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23' ||
    approvedSafety.source_package?.safe_variants_path !== 'SAFETY/safe-variants.json' ||
    approvedSafety.source_package?.safe_variants_sha256 !== '4167fe9cf767623c1188b5796297b4f83a89b0c2928a55bcc0f765690bfb3260' ||
    approvedSafety.source_package?.content_safety_manifest_path !== 'SAFETY/content-safety-manifest.json' ||
    approvedSafety.source_package?.content_safety_manifest_sha256 !== '51bba62b23c520f43b73630501432a8f4e2a94940f8459c7848149f77b202d5e' ||
    approvedSafety.source_package?.content_safety_manifest_records !== 965 ||
    approvedSafety.source_package?.safe_variant_records !== 16 ||
    approvedSafety.source_package?.s2_review_path !== 'SAFETY/s2-review.csv' ||
    approvedSafety.source_package?.s2_review_sha256 !== '579c4274d1de97b24ea39f9296ea66d9c61a50b1cad15a0da89e91736cdeab55' ||
    approvedSafety.source_package?.classification_review !== 'HUMAN_REVIEWED_S2' ||
    approvedSafety.records?.length !== 16) {
  throw new Error('Approved R42 child-safe source identity mismatch');
}
const approvalById = new Map(approvedSafety.records.map(record => [record.content_id, Object.freeze(record)]));
if (approvalById.size !== approvedSafety.records.length) throw new Error('Duplicate approved safety content id');

const sourceBySnapshot = new Map();
for (const item of sourceManifest.inventory) {
  const name = item.snapshot_path.split('/').pop();
  const bytes = await readFile(new URL(name, sourceDir));
  sourceBySnapshot.set(name, Object.freeze({
    bytes,
    sha256: sha256(bytes),
    gitBlobSha1: item.git_blob_sha1,
    sourcePath: item.source_path
  }));
}
const bundleMaterial = [...sourceBySnapshot].sort(([a], [b]) => a.localeCompare(b))
  .map(([name, value]) => name + ':' + value.sha256).join('\n') +
  '\napproved-safe-variants.json:' + approvedSafetySha256;
const sourceBundleSha256 = sha256(bundleMaterial);
const versionIdentity = sha256(sourceBundleSha256 + ':A9_R03_APPROVED_SAFE_EXISTING_RESEARCH_SOURCE_ROUTE');
const version = 'sabik-es-en-20260927-r03-' + versionIdentity.slice(0, 12);

async function json(name) {
  return JSON.parse(sourceBySnapshot.get(name).bytes.toString('utf8'));
}
const catalog = await json('catalog-search.json');
const dataEs = await json('data-es.json');
const dataEn = await json('data-en.json');
const everydayEs = await json('everyday-es.json');
const everydayEn = await json('everyday-en.json');
const research = await json('research-bilingual.json');

if (!Array.isArray(catalog) || catalog.length !== 372 ||
    dataEs.paginas?.length !== 49 || dataEn.paginas?.length !== 49 ||
    everydayEs.fichas?.length !== 48 || everydayEn.fichas?.length !== 48 ||
    !Array.isArray(research) || research.length !== 120) {
  throw new Error('Pinned source inventory count mismatch');
}
if (catalog.some(x => !x.en?.u || !x.en?.t || !x.en?.d)) throw new Error('Catalog bilingual pair missing');
if (research.some(x => !x.heading_en || !x.text_en || !x.means_en || !x.notProven_en)) {
  throw new Error('Research bilingual pair missing');
}

const fragments = [];
function sourceMeta(snapshotName) {
  const s = sourceBySnapshot.get(snapshotName);
  return {
    source_version: 'main@' + sourceManifest.source_commit + ':' + s.gitBlobSha1,
    source_sha256: s.sha256,
    source_path: s.sourcePath
  };
}
function pushFragment(input) {
  const fragment = {
    content_id: input.content_id,
    fragment_id: input.fragment_id,
    locale: input.locale,
    url: input.url,
    title: input.title,
    heading: input.heading || '',
    text: input.text,
    source_type: input.source_type,
    editorial_status: input.editorial_status || 'PUBLIC_MAIN_SNAPSHOT',
    ...input.source,
    library_version: version,
    audience: input.audience || ['TRANSVERSAL'],
    sensitivity: input.sensitivity || 'S1_SENSITIVE',
    discovery: input.discovery || 'NORMAL',
    safe_variant_id: input.safe_variant_id || null,
    concepts: [...new Set((input.concepts || []).filter(v => typeof v === 'string' && v.trim()).map(v => v.trim()))],
    source_editorial_status: input.source_editorial_status || null,
    derived_from_fragment_id: input.derived_from_fragment_id || null,
    safe_variant_group: input.safe_variant_group || null,
    safety_content_id: input.safety_content_id || null
  };
  fragments.push(fragment);
  return fragment;
}
function normalizeSafetyText(value) {
  return String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
}
function addApprovedSafeVariant(full, approvalId) {
  const approval = approvalById.get(approvalId);
  if (!approval) throw new Error('Missing reviewed safe variant approval ' + approvalId);
  const locale = full.locale;
  const variant = approvedSafety.groups?.[approval.safe_variant_group]?.[locale];
  if (!variant?.heading || !variant?.summary || !variant?.help) {
    throw new Error('Missing reviewed safe variant copy ' + approvalId + '/' + locale);
  }
  const expectedTitle = approval[locale === 'es' ? 'title_es' : 'title_en'];
  const researchNumber = Number(String(approvalId).replace(/^research-/, ''));
  const expectedUrl = approval.surface === 'research'
    ? ORIGIN + '/es/investigacion/#estudio-' + researchNumber
    : ORIGIN + approval[locale === 'es' ? 'canonical_url_es' : 'canonical_url_en'];
  if (full.title !== expectedTitle || full.url !== expectedUrl) {
    throw new Error('Reviewed safe variant does not match pinned source record ' + approvalId + '/' + locale);
  }
  const text = variant.summary + '\n' + variant.help;
  if (normalizeSafetyText(text) === normalizeSafetyText(full.text)) {
    throw new Error('Reviewed safe variant cannot equal full S2 text ' + approvalId + '/' + locale);
  }
  const safeId = full.fragment_id.replace(/:main$/, ':safe');
  full.safe_variant_id = safeId;
  pushFragment({
    content_id: full.content_id,
    fragment_id: safeId,
    locale,
    url: full.url,
    title: full.title,
    heading: variant.heading,
    text,
    source_type: 'safe_variant',
    editorial_status: 'R42_HUMAN_REVIEWED_SAFE_VARIANT',
    source: {
      source_version: 'r42-child-safe@' + approvedSafety.source_package.sha256,
      source_sha256: approvedSafety.source_package.safe_variants_sha256,
      source_path: approvedSafety.source_package.safe_variants_path
    },
    audience: ['INFANCIA', 'ADOLESCENCIA', 'ADULTEZ', 'TRANSVERSAL'],
    sensitivity: 'S1_SENSITIVE',
    discovery: 'NORMAL',
    concepts: [...full.concepts, approval.safe_variant_group],
    derived_from_fragment_id: full.fragment_id,
    safe_variant_group: approval.safe_variant_group,
    safety_content_id: approvalId
  });
}

catalog.forEach((x, i) => {
  const contentId = 'catalog-' + String(i + 1).padStart(3, '0');
  const safetyId = S2_CATALOG.get(x.t) || null;
  const group = safetyId ? approvalById.get(safetyId)?.safe_variant_group : null;
  if (safetyId && !group) throw new Error('Missing reviewed S2 mapping ' + safetyId);
  const es = pushFragment({
    content_id: contentId, fragment_id: contentId + ':es:main', locale: 'es',
    url: ORIGIN + x.u, title: x.t, heading: x.a || x.s || '',
    text: x.d, source_type: x.s === 'Condición' ? 'condition' : 'situation',
    source: sourceMeta('catalog-search.json'),
    sensitivity: group ? 'S2_HIGH_SENSITIVITY' : (x.s === 'Condición' ? 'S1_SENSITIVE' : 'S0_GENERAL'),
    discovery: group ? 'SAFE_VARIANT_REQUIRED' : 'NORMAL',
    concepts: [x.a, x.tipo, ...(Array.isArray(x.k) ? x.k : [])],
    safe_variant_group: group
  });
  const en = pushFragment({
    content_id: contentId, fragment_id: contentId + ':en:main', locale: 'en',
    url: ORIGIN + x.en.u, title: x.en.t, heading: x.en.a || x.en.s || '',
    text: x.en.d, source_type: x.s === 'Condición' ? 'condition' : 'situation',
    source: sourceMeta('catalog-search.json'),
    sensitivity: group ? 'S2_HIGH_SENSITIVITY' : (x.s === 'Condición' ? 'S1_SENSITIVE' : 'S0_GENERAL'),
    discovery: group ? 'SAFE_VARIANT_REQUIRED' : 'NORMAL',
    concepts: [x.en.a, x.tipo, ...(Array.isArray(x.k) ? x.k : [])],
    safe_variant_group: group
  });
  if (safetyId) { addApprovedSafeVariant(es, safetyId); addApprovedSafeVariant(en, safetyId); }
});

function addData(locale, page, index, snapshotName, basePath) {
  const contentId = 'data-' + String(page.n || index + 1).padStart(3, '0');
  pushFragment({
    content_id: contentId, fragment_id: contentId + ':' + locale + ':main', locale,
    url: ORIGIN + basePath + ((locale === 'en' ? page.slug_en : page.slug_es) || slug(page.title)) + '/', title: page.title,
    heading: page.territorio || '', text: collectText(page).join('\n'),
    source_type: 'data', source: sourceMeta(snapshotName),
    sensitivity: 'S1_SENSITIVE', concepts: [page.territorio, page.metodo, page.poblacion],
    source_editorial_status: page.status || null
  });
}
dataEs.paginas.forEach((p, i) => addData('es', p, i, 'data-es.json', '/es/datos/'));
dataEn.paginas.forEach((p, i) => addData('en', p, i, 'data-en.json', '/en/data/'));

function addEveryday(locale, card, index, snapshotName, basePath) {
  const contentId = 'everyday-' + String(index + 1).padStart(3, '0');
  const esTitle = everydayEs.fichas[index]?.title;
  const safetyId = S2_EVERYDAY.get(esTitle) || null;
  const group = safetyId ? approvalById.get(safetyId)?.safe_variant_group : null;
  if (safetyId && !group) throw new Error('Missing reviewed S2 mapping ' + safetyId);
  const full = pushFragment({
    content_id: contentId, fragment_id: contentId + ':' + locale + ':main', locale,
    url: ORIGIN + basePath + slug(card.title) + '/', title: card.title,
    heading: card.cat || '', text: collectText({ lede: card.lede, sections: card.sections }).join('\n'),
    source_type: 'everyday_life', source: sourceMeta(snapshotName),
    sensitivity: group ? 'S2_HIGH_SENSITIVITY' : 'S1_SENSITIVE',
    discovery: group ? 'SAFE_VARIANT_REQUIRED' : 'NORMAL',
    concepts: card.concepts || [], source_editorial_status: card.status || null,
    safe_variant_group: group
  });
  if (safetyId) addApprovedSafeVariant(full, safetyId);
}
everydayEs.fichas.forEach((p, i) => addEveryday('es', p, i, 'everyday-es.json', '/es/biblioteca/'));
everydayEn.fichas.forEach((p, i) => addEveryday('en', p, i, 'everyday-en.json', '/en/everyday-life/'));

research.forEach((study, i) => {
  const n = Number(study.n || i + 1);
  const contentId = 'research-' + String(n).padStart(3, '0');
  const safetyId = S2_RESEARCH.get(n) || null;
  const group = safetyId ? approvalById.get(safetyId)?.safe_variant_group : null;
  if (safetyId && !group) throw new Error('Missing reviewed S2 mapping ' + safetyId);
  const common = { source_type: 'research', source: sourceMeta('research-bilingual.json'),
    sensitivity: group ? 'S2_HIGH_SENSITIVITY' : 'S1_SENSITIVE',
    discovery: group ? 'SAFE_VARIANT_REQUIRED' : 'NORMAL', safe_variant_group: group };
  const es = pushFragment({
    ...common, content_id: contentId, fragment_id: contentId + ':es:main', locale: 'es',
    url: ORIGIN + '/es/investigacion/#estudio-' + n, title: study.heading || study.titleEs || study.titleOrig,
    heading: study.topic || '', text: [ ...(study.text || []), study.means, study.notProven ].filter(Boolean).join('\n'),
    concepts: [study.topic, study.design, study.titleOrig]
  });
  const en = pushFragment({
    ...common, content_id: contentId, fragment_id: contentId + ':en:main', locale: 'en',
    url: ORIGIN + '/es/investigacion/#estudio-' + n, title: study.heading_en || study.titleOrig,
    heading: study.topic || '', text: [ ...(study.text_en || []), study.means_en, study.notProven_en ].filter(Boolean).join('\n'),
    concepts: [study.topic, study.designKey, study.titleOrig]
  });
  if (safetyId) {
    addApprovedSafeVariant(es, safetyId);
    addApprovedSafeVariant(en, safetyId);
  }
});

const ids = new Set(fragments.map(f => f.fragment_id));
if (ids.size !== fragments.length) throw new Error('Duplicate generated fragment id');
const fullS2 = fragments.filter(f => f.sensitivity === 'S2_HIGH_SENSITIVITY' && f.source_type !== 'safe_variant');
const safeVariants = fragments.filter(f => f.source_type === 'safe_variant');
if (fullS2.length !== 30 || safeVariants.length !== 30) {
  throw new Error('Expected 15 bilingual S2 topics and paired safe variants in pinned snapshot');
}
for (const full of fullS2) {
  if (!full.safe_variant_id || !ids.has(full.safe_variant_id)) throw new Error('Missing safe variant link');
}

const corpus = {
  schema: 'SABIK_CLOUD_CORPUS/2.0',
  library_version: version,
  source_commit: sourceManifest.source_commit,
  source_bundle_sha256: sourceBundleSha256,
  locales: ['es', 'en'],
  fragment_count: fragments.length,
  fragments
};
const corpusText = JSON.stringify(corpus) + '\n';
const corpusBytes = Buffer.byteLength(corpusText);
const corpusSha256 = sha256(corpusText);
const localeCounts = Object.fromEntries(['es', 'en'].map(locale => [locale, fragments.filter(f => f.locale === locale).length]));
const sourceInventory = sourceManifest.inventory.map(item => {
  const name = item.snapshot_path.split('/').pop();
  const s = sourceBySnapshot.get(name);
  return { ...item, sha256: s.sha256, bytes: s.bytes.byteLength };
});
sourceInventory.push({
  source_path: approvedSafety.source_package.safe_variants_path,
  snapshot_path: 'sources/a9-r02-safety/APPROVED_SAFE_VARIANTS_R42.json',
  sha256: approvedSafetySha256,
  upstream_sha256: approvedSafety.source_package.safe_variants_sha256,
  bytes: approvedSafetyBytes.byteLength,
  source_package_sha256: approvedSafety.source_package.sha256
});
const release = {
  schema: 'SABIK_CLOUD_LIBRARY_RELEASE/2.0',
  version,
  created_from_snapshot: SOURCE_DATE,
  corpus_sha256: corpusSha256,
  corpus_bytes: corpusBytes,
  fragment_count: fragments.length,
  unique_ids: ids.size,
  locale_counts: localeCounts,
  full_s2_count: fullS2.length,
  safe_variant_count: safeVariants.length,
  source_commit: sourceManifest.source_commit,
  source_bundle_sha256: sourceBundleSha256,
  approved_child_safe_package_sha256: approvedSafety.source_package.sha256,
  approved_safe_variants_sha256: approvedSafety.source_package.safe_variants_sha256,
  approved_content_safety_manifest_sha256: approvedSafety.source_package.content_safety_manifest_sha256,
  approved_s2_review_sha256: approvedSafety.source_package.s2_review_sha256,
  approved_safe_source_snapshot_sha256: approvedSafetySha256,
  source_inventory: sourceInventory,
  corpus_key: 'cloud-library/versions/' + version + '/corpus.json',
  manifest_key: 'cloud-library/manifest.json',
  store: 'sabik-n04-corpus',
  storage_kind: 'named-deploy-store',
  region: 'us-east-2'
};
await mkdir(new URL('versions/' + version + '/', outDir), { recursive: true });
await writeFile(new URL('versions/' + version + '/corpus.json', outDir), corpusText);
await writeFile(new URL('release.json', outDir), JSON.stringify(release, null, 2) + '\n');
console.log(JSON.stringify({ status: 'PASS', version, corpus_sha256: corpusSha256,
  source_bundle_sha256: sourceBundleSha256, fragments: fragments.length,
  locale_counts: localeCounts, full_s2: fullS2.length, safe_variants: safeVariants.length,
  source_commit: sourceManifest.source_commit }, null, 2));
