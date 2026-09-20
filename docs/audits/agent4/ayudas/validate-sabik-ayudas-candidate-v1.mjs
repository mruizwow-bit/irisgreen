#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const legacyPath = path.join(root, "es/tramites/directorio/tramites-datos.json");
const registerPath = path.join(here, "SABIK_AYUDAS_ES_VERIFICATION_REGISTER_V1.csv");
const candidatePath = path.join(here, "SABIK_AYUDAS_ES_CANDIDATE_DATASET_V1.json");
const schemaPath = path.join(here, "SABIK_AYUDAS_ES_PUBLIC_SCHEMA_V1_1.json");
const urlPath = path.join(here, "SABIK_AYUDAS_ES_URL_CHANGESET_V1.csv");
const proposalsPath = path.join(here, "SABIK_AYUDAS_ES_NEW_RESOURCE_PROPOSALS_V1.csv");
const TODAY = "2026-09-20";

function parseCSV(s) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else {
      if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
      else cell += c;
    }
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const h = rows[0];
  return rows.slice(1).filter(r => r.some(x => x !== "")).map(r => Object.fromEntries(h.map((k, j) => [k, r[j] ?? ""])));
}
function isDate(v) { return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v + "T00:00:00Z")); }
function isUri(v) { try { new URL(v); return true; } catch { return false; } }
function typeOk(v, t) {
  const one = x => x === "null" ? v === null : x === "array" ? Array.isArray(v) : x === "object" ? !!v && typeof v === "object" && !Array.isArray(v) : typeof v === x;
  return Array.isArray(t) ? t.some(one) : one(t);
}
function validateSchemaObject(obj, schema, id, errors) {
  for (const k of schema.required || []) if (!(k in obj)) errors.push(id + ": missing required " + k);
  if (schema.additionalProperties === false) for (const k of Object.keys(obj)) if (!(k in schema.properties)) errors.push(id + ": unexpected property " + k);
  for (const [k, spec] of Object.entries(schema.properties || {})) {
    if (!(k in obj)) continue;
    const v = obj[k];
    if (spec.type && !typeOk(v, spec.type)) { errors.push(id + ": type " + k); continue; }
    if (spec.enum && !spec.enum.includes(v)) errors.push(id + ": enum " + k + "=" + v);
    if (spec.const !== undefined && v !== spec.const) errors.push(id + ": const " + k);
    if (spec.minLength && typeof v === "string" && v.length < spec.minLength) errors.push(id + ": empty " + k);
    if (spec.pattern && typeof v === "string" && !(new RegExp(spec.pattern)).test(v)) errors.push(id + ": pattern " + k);
    if (spec.format === "date" && v !== null && !isDate(v)) errors.push(id + ": invalid date " + k);
    if (spec.format === "uri" && v !== null && !isUri(v)) errors.push(id + ": invalid uri " + k);
    if (spec.minItems && Array.isArray(v) && v.length < spec.minItems) errors.push(id + ": empty array " + k);
  }
}
const legacy = JSON.parse(fs.readFileSync(legacyPath, "utf8")).es;
const register = parseCSV(fs.readFileSync(registerPath, "utf8"));
const candidate = JSON.parse(fs.readFileSync(candidatePath, "utf8"));
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const urlChanges = parseCSV(fs.readFileSync(urlPath, "utf8"));
const proposals = parseCSV(fs.readFileSync(proposalsPath, "utf8"));
const legacyById = new Map(legacy.map(x => [x.id, x]));
const regById = new Map(register.map(x => [x.id, x]));
const errors = [];
const ids = new Set();
const decisions = {};
let ready = 0, hold = 0, lossCuantia = 0, lossObs = 0, lossTags = 0, lossFuente = 0, semanticLoss = 0;
let schemaValid = 0;

for (const e of candidate.records) {
  const p = e.public_record, l = legacyById.get(e.id), r = regById.get(e.id);
  if (ids.has(e.id)) errors.push("duplicate id " + e.id); ids.add(e.id);
  decisions[e.migration_decision] = (decisions[e.migration_decision] || 0) + 1;
  if (e.migration_decision === "READY") ready++; else hold++;
  if (!l || !r) { errors.push(e.id + ": missing source row"); continue; }
  validateSchemaObject(p, schema, e.id, errors);
  if (p.record_kind === "PROGRAM" && (!p.program_id || p.call_id !== null)) errors.push(e.id + ": PROGRAM relation");
  if (p.record_kind === "CALL" && (!p.program_id || !p.call_id)) errors.push(e.id + ": CALL relation");
  if (p.record_kind === "RESOURCE" && (p.program_id !== null || p.call_id !== null)) errors.push(e.id + ": RESOURCE relation");
  if (p.status === "ABIERTO" && (!p.closes_at || !p.source_is_primary)) errors.push(e.id + ": ABIERTO gate");
  if (!p.official_url || !isUri(p.official_url)) errors.push(e.id + ": official_url");
  if (!p.next_review_at || !isDate(p.next_review_at)) errors.push(e.id + ": next_review_at");
  if (p.amount_summary !== l.cuantia) lossCuantia++;
  if (p.compatibility_notes !== l.obs) lossObs++;
  if (p.keywords.join(", ") !== l.tags) lossTags++;
  if (p.official_url !== l.fuente) lossFuente++;
  const exact = p.id === l.id && p.name === l.name && p.country_code.toLowerCase() === l.country &&
    p.country_name === l.pais && p.jurisdiction === l.terr && p.jurisdiction_level === l.nivel &&
    p.scope === l.ambito && p.category === l.cat && p.summary === l.que &&
    p.eligibility_summary === l.quien && p.amount_summary === l.cuantia &&
    p.documents_summary === l.docs && p.compatibility_notes === l.obs &&
    p.source_authority === l.org && p.official_url === l.fuente && p.keywords.join(", ") === l.tags;
  if (!exact) semanticLoss++;
  schemaValid++;
}
const expected = { READY:206, HOLD_MODELING:28, HOLD_VERIFY:21, HOLD_DUPLICATE:2, HOLD_HISTORICAL:1 };
for (const [k,v] of Object.entries(expected)) if ((decisions[k] || 0) !== v) errors.push("migration count " + k);
if (candidate.records.length !== 258 || ready !== 206 || hold !== 52) errors.push("record counts");
if (legacy.length !== 258 || register.length !== 258) errors.push("source counts");
if (lossCuantia || lossObs || lossTags || lossFuente || semanticLoss) errors.push("legacy loss detected");
const openNow = candidate.records.filter(e => {
  const p=e.public_record;
  return p.status === "ABIERTO" && p.source_is_primary === true && !!p.official_url && !!p.closes_at &&
    TODAY <= p.closes_at && (!p.opens_at || TODAY >= p.opens_at) && !!p.next_review_at && TODAY <= p.next_review_at;
});
if (openNow.length !== 16) errors.push("Abiertas ahora expected 16, got " + openNow.length);
const urlStates = candidate.records.filter(e=>e.url_change).reduce((a,e)=>{a[e.url_change.state]=(a[e.url_change.state]||0)+1;return a;},{});
if ((urlStates.TECHNICALLY_CANDIDATE||0)!==7 || (urlStates.BLOCKED_MANUAL_RECHECK||0)!==1) errors.push("URL governance counts");
if (urlChanges.length !== 8) errors.push("URL changeset count");
const proposalIds = new Set(proposals.map(x=>x.id));
if (candidate.records.some(e=>proposalIds.has(e.id))) errors.push("NEW_RESOURCE_PROPOSAL leaked into 258");
const out = {
  pass: errors.length === 0,
  schema_valid_records: schemaValid,
  total_records: candidate.records.length,
  ready_valid: ready,
  holds_preserved: hold,
  migration_decisions: decisions,
  loss: { cuantia:lossCuantia, obs:lossObs, tags:lossTags, fuente:lossFuente, semantic:semanticLoss },
  abiertas_ahora: openNow.length,
  url_governance: urlStates,
  new_resource_proposals_in_candidate: 0,
  errors
};
console.log(JSON.stringify(out, null, 2));
if (errors.length) process.exit(1);
