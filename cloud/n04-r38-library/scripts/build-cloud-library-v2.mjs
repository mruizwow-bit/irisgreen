import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = new URL('../sources/a9-r01/', import.meta.url);
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

const SAFE_TEXT = Object.freeze({
  abuse_exploitation: {
    es: 'Si una relación, contacto o petición te hace sentir inseguridad, presión o miedo, puedes buscar apoyo y alejarte de la situación cuando sea posible. Una persona adulta de confianza, un servicio especializado o los servicios de emergencia de tu zona pueden ayudarte si hay peligro.',
    en: 'If a relationship, contact or request makes you feel unsafe, pressured or afraid, you can seek support and move away from the situation when possible. A trusted adult, a specialist service or local emergency services can help if there is immediate danger.'
  },
  eating_disorder: {
    es: 'Las dificultades con la alimentación pueden afectar a la salud y al bienestar. Si comer, evitar alimentos o la preocupación por el cuerpo está causando problemas, es importante pedir apoyo a una persona de confianza y a un profesional sanitario. Esta versión evita cifras, pesos y detalles que pueden resultar perjudiciales.',
    en: 'Eating difficulties can affect health and wellbeing. If eating, avoiding food or worries about the body are causing problems, it is important to seek support from a trusted person and a healthcare professional. This version avoids numbers, weights and details that may be harmful.'
  },
  trauma: {
    es: 'Después de una experiencia muy difícil, algunas personas tienen recuerdos, miedo, alerta intensa o evitación. El apoyo debe centrarse en la seguridad, el control de la persona y la posibilidad de pedir ayuda sin obligarla a contar detalles.',
    en: 'After a very difficult experience, some people have distressing memories, fear, intense alertness or avoidance. Support should focus on safety, the person’s control and being able to ask for help without being required to describe details.'
  },
  suicide_self_harm: {
    es: 'Si tú o alguien cercano está en peligro inmediato o puede hacerse daño, busca ayuda de emergencia en tu zona. Si aparecen pensamientos de hacerse daño o de no querer seguir, no hace falta afrontarlos a solas: habla con una persona de confianza o con un profesional y busca apoyo cuanto antes.',
    en: 'If you or someone close to you is in immediate danger or may hurt themselves, seek emergency help in your area. If thoughts of self-harm or not wanting to continue appear, they do not have to be faced alone: talk to a trusted person or a professional and seek support as soon as possible.'
  },
  sexual_adverse_experience: {
    es: 'Una experiencia sexual no deseada o una situación de presión merece apoyo y una respuesta centrada en la seguridad y el consentimiento. La persona puede buscar ayuda de alguien de confianza o de un servicio especializado sin tener que explicar más detalles de los que quiera.',
    en: 'An unwanted sexual experience or a situation involving pressure deserves support and a response focused on safety and consent. The person can seek help from someone they trust or a specialist service without having to share more detail than they want.'
  }
});

const S2_CATALOG = new Map([
  ['Abuso y explotación', 'abuse_exploitation'],
  ['Anorexia nerviosa', 'eating_disorder'],
  ['Trastorno por atracón', 'eating_disorder'],
  ['Bulimia nerviosa', 'eating_disorder'],
  ['Trastornos de la conducta alimentaria (TCA)', 'eating_disorder'],
  ['Otros trastornos alimentarios especificados (OSFED)', 'eating_disorder'],
  ['TEPT / trastorno por estrés postraumático', 'trauma'],
  ['TEPT complejo', 'trauma']
]);
const S2_EVERYDAY = new Map([
  ['ARFID, TCA y pica: cuándo el apoyo cotidiano necesita atención clínica', 'eating_disorder'],
  ['Abuso, explotación y relaciones seguras', 'abuse_exploitation']
]);
const S2_RESEARCH = new Map([
  [5, 'eating_disorder'], [36, 'suicide_self_harm'], [37, 'suicide_self_harm'],
  [45, 'eating_disorder'], [46, 'eating_disorder'], [71, 'sexual_adverse_experience']
]);

const sourceManifest = JSON.parse(await readFile(new URL('SOURCE.json', sourceDir), 'utf8'));
if (sourceManifest?.schema !== 'SABIK_CLOUD_SOURCE_SNAPSHOT/1.0' ||
    !/^[a-f0-9]{40}$/.test(sourceManifest.source_commit || '')) {
  throw new Error('Invalid source snapshot manifest');
}

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
  .map(([name, value]) => name + ':' + value.sha256).join('\n');
const sourceBundleSha256 = sha256(bundleMaterial);
const version = 'sabik-es-en-20260927-r01-' + sourceBundleSha256.slice(0, 12);

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
    safe_variant_group: input.safe_variant_group || null
  };
  fragments.push(fragment);
  return fragment;
}
function addPairSafeVariant(full, group) {
  const text = SAFE_TEXT[group]?.[full.locale];
  if (!text) throw new Error('Missing safe variant text for ' + group + '/' + full.locale);
  const safeId = full.fragment_id.replace(/:main$/, ':safe');
  full.safe_variant_id = safeId;
  pushFragment({
    content_id: full.content_id,
    fragment_id: safeId,
    locale: full.locale,
    url: full.url,
    title: full.title,
    heading: full.locale === 'es' ? 'Resumen seguro' : 'Safe summary',
    text,
    source_type: 'safe_variant',
    editorial_status: 'SAFETY_DERIVED_R01',
    source: {
      source_version: full.source_version,
      source_sha256: full.source_sha256,
      source_path: full.source_path
    },
    audience: ['INFANCIA', 'ADOLESCENCIA', 'ADULTEZ', 'TRANSVERSAL'],
    sensitivity: 'S1_SENSITIVE',
    discovery: 'NORMAL',
    concepts: [...full.concepts, group],
    derived_from_fragment_id: full.fragment_id,
    safe_variant_group: group
  });
}

catalog.forEach((x, i) => {
  const contentId = 'catalog-' + String(i + 1).padStart(3, '0');
  const group = S2_CATALOG.get(x.t) || null;
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
  if (group) { addPairSafeVariant(es, group); addPairSafeVariant(en, group); }
});

function addData(locale, page, index, snapshotName, basePath) {
  const contentId = 'data-' + String(page.n || index + 1).padStart(3, '0');
  pushFragment({
    content_id: contentId, fragment_id: contentId + ':' + locale + ':main', locale,
    url: ORIGIN + basePath + slug(page.title) + '/', title: page.title,
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
  const group = S2_EVERYDAY.get(esTitle) || null;
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
  if (group) addPairSafeVariant(full, group);
}
everydayEs.fichas.forEach((p, i) => addEveryday('es', p, i, 'everyday-es.json', '/es/biblioteca/'));
everydayEn.fichas.forEach((p, i) => addEveryday('en', p, i, 'everyday-en.json', '/en/everyday-life/'));

research.forEach((study, i) => {
  const n = Number(study.n || i + 1);
  const contentId = 'research-' + String(n).padStart(3, '0');
  const group = S2_RESEARCH.get(n) || null;
  const common = { source_type: 'research', source: sourceMeta('research-bilingual.json'),
    sensitivity: group ? 'S2_HIGH_SENSITIVITY' : 'S1_SENSITIVE',
    discovery: group ? 'SAFE_VARIANT_REQUIRED' : 'NORMAL', safe_variant_group: group };
  const es = pushFragment({
    ...common, content_id: contentId, fragment_id: contentId + ':es:main', locale: 'es',
    url: ORIGIN + '/es/investigacion/', title: study.heading || study.titleEs || study.titleOrig,
    heading: study.topic || '', text: [ ...(study.text || []), study.means, study.notProven ].filter(Boolean).join('\n'),
    concepts: [study.topic, study.design, study.titleOrig]
  });
  const en = pushFragment({
    ...common, content_id: contentId, fragment_id: contentId + ':en:main', locale: 'en',
    url: ORIGIN + '/es/investigacion/', title: study.heading_en || study.titleOrig,
    heading: study.topic || '', text: [ ...(study.text_en || []), study.means_en, study.notProven_en ].filter(Boolean).join('\n'),
    concepts: [study.topic, study.designKey, study.titleOrig]
  });
  if (group) { addPairSafeVariant(es, group); addPairSafeVariant(en, group); }
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
