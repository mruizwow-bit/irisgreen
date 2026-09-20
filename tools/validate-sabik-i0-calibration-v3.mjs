#!/usr/bin/env node
import fs from 'node:fs';

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) throw new Error(`Unexpected argument: ${a}`);
    const k = a.slice(2);
    const v = argv[++i];
    if (!v || v.startsWith('--')) throw new Error(`Missing value for --${k}`);
    out[k] = v;
  }
  return out;
}

const args = parseArgs(process.argv);
const datasetPath = args.dataset;
const schemaPath = args.schema;
const reportPath = args.report;
if (!datasetPath || !schemaPath) {
  throw new Error('Usage: node validate-sabik-i0-calibration-v3.mjs --dataset <jsonl> --schema <schema.json> [--report <json>]');
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const lines = fs.readFileSync(datasetPath, 'utf8').split(/\r?\n/).filter(Boolean);
const rows = lines.map((line, i) => {
  try { return JSON.parse(line); }
  catch { throw new Error(`Invalid JSON at dataset line ${i + 1}`); }
});

function resolveRef(root, ref) {
  if (!ref.startsWith('#/')) throw new Error(`Unsupported ref: ${ref}`);
  return ref.slice(2).split('/').reduce((acc, p) => acc[p.replace(/~1/g, '/').replace(/~0/g, '~')], root);
}

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function typeOk(value, type) {
  if (type === 'array') return Array.isArray(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'integer') return Number.isInteger(value);
  return typeof value === type;
}

function validate(value, s, root, path = '$') {
  const errors = [];
  if (s.$ref) return validate(value, resolveRef(root, s.$ref), root, path);
  if (s.oneOf) {
    const attempts = s.oneOf.map(opt => validate(value, opt, root, path));
    const passes = attempts.filter(e => e.length === 0).length;
    if (passes !== 1) errors.push(`${path}: oneOf matched ${passes} branches`);
    return errors;
  }
  if (s.const !== undefined && !deepEqual(value, s.const)) errors.push(`${path}: expected const ${JSON.stringify(s.const)}`);
  if (s.enum && !s.enum.some(x => deepEqual(value, x))) errors.push(`${path}: value not in enum`);
  if (s.type && !typeOk(value, s.type)) {
    errors.push(`${path}: expected type ${s.type}`);
    return errors;
  }
  if (typeof value === 'string') {
    if (s.minLength !== undefined && value.length < s.minLength) errors.push(`${path}: shorter than minLength`);
    if (s.pattern && !(new RegExp(s.pattern).test(value))) errors.push(`${path}: pattern mismatch`);
  }
  if (Array.isArray(value)) {
    if (s.minItems !== undefined && value.length < s.minItems) errors.push(`${path}: fewer than minItems`);
    if (s.maxItems !== undefined && value.length > s.maxItems) errors.push(`${path}: more than maxItems`);
    if (s.uniqueItems) {
      const serial = value.map(v => JSON.stringify(v));
      if (new Set(serial).size !== serial.length) errors.push(`${path}: duplicate array items`);
    }
    if (s.items) value.forEach((v, i) => errors.push(...validate(v, s.items, root, `${path}[${i}]`)));
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const req of s.required || []) if (!(req in value)) errors.push(`${path}: missing required property ${req}`);
    const props = s.properties || {};
    for (const [k, v] of Object.entries(value)) {
      if (k in props) errors.push(...validate(v, props[k], root, `${path}.${k}`));
      else if (s.additionalProperties === false) errors.push(`${path}: unexpected property ${k}`);
      else if (s.additionalProperties && typeof s.additionalProperties === 'object') errors.push(...validate(v, s.additionalProperties, root, `${path}.${k}`));
    }
  }
  return errors;
}

const failures = [];
rows.forEach((row, i) => {
  const errs = validate(row, schema, schema, `$[${i}]`);
  if (errs.length) failures.push({ line: i + 1, id: row?.id ?? null, errors: errs.slice(0, 20) });
});

const ids = rows.map(r => r.id);
const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
const normalizedUtterances = rows.map(r => String(r.utterance || '').normalize('NFKC').toLocaleLowerCase('es').replace(/\s+/g, ' ').trim());
const duplicateUtteranceIds = rows.filter((r, i) => normalizedUtterances.indexOf(normalizedUtterances[i]) !== i).map(r => r.id);

const report = {
  validator: 'sabik-json-schema-subset-v1',
  schema_id: schema.$id || null,
  dataset: datasetPath,
  case_count: rows.length,
  schema_failures: failures,
  duplicate_ids: [...new Set(duplicateIds)],
  duplicate_utterance_ids: [...new Set(duplicateUtteranceIds)],
  pass: failures.length === 0 && duplicateIds.length === 0 && duplicateUtteranceIds.length === 0,
};

if (reportPath) fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({pass: report.pass, case_count: report.case_count, schema_failure_count: failures.length, duplicate_id_count: duplicateIds.length, duplicate_utterance_count: duplicateUtteranceIds.length}));
if (!report.pass) process.exit(1);
