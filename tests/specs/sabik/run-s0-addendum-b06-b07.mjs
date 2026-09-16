#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import process from "node:process";

const here = dirname(fileURLToPath(import.meta.url));
const basePath = resolve(here, "s0-state-contract.json");
const addendumPath = resolve(here, "s0-contract-addendum-b06-b07.json");

function parseArgs(argv) {
  const args = { module: null };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--module") args.module = argv[++i];
    else if (argv[i] === "--help") args.help = true;
    else throw new Error(`Argumento desconocido: ${argv[i]}`);
  }
  return args;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const child of Object.values(value)) deepFreeze(child);
  return value;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

function same(a, b) {
  return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
}

function mergeState(base, partial) {
  const next = clone(base);
  for (const [key, value] of Object.entries(partial || {})) {
    if (key === "adaptation" && value && typeof value === "object" && !Array.isArray(value)) {
      next.adaptation = { ...next.adaptation, ...clone(value) };
    } else {
      next[key] = clone(value);
    }
  }
  return next;
}

function partialMismatch(actual, expected, path = "") {
  for (const [key, value] of Object.entries(expected || {})) {
    const p = path ? `${path}.${key}` : key;
    if (!(key in actual)) return `falta ${p}`;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nested = partialMismatch(actual[key], value, p);
      if (nested) return nested;
    } else if (!same(actual[key], value)) {
      return `${p}: esperado ${JSON.stringify(value)}, recibido ${JSON.stringify(actual[key])}`;
    }
  }
  return null;
}

function validateCanonicalShape(state, enums, options = {}) {
  const { enforceSafetyInvariants = true } = options;
  const scalarKeys = ["operation", "dialogue", "safety", "visibility", "speech", "motion", "language"];
  for (const key of scalarKeys) {
    if (!(key in state)) throw new Error(`forma pública: falta ${key}`);
    if (["object", "function", "symbol"].includes(typeof state[key]) || state[key] === null) {
      throw new Error(`forma pública: ${key} debe ser escalar`);
    }
    if (!enums[key].includes(state[key])) throw new Error(`forma pública: ${key}=${JSON.stringify(state[key])} fuera de catálogo`);
  }
  if (!Number.isInteger(state.revision) || state.revision < 0) {
    throw new Error("forma pública: revision debe ser integer >= 0");
  }
  const a = state.adaptation;
  if (!a || typeof a !== "object" || Array.isArray(a)) throw new Error("forma pública: adaptation debe ser objeto completo");
  for (const key of ["response_length", "max_options", "question_policy", "intensity", "depth"]) {
    if (!(key in a)) throw new Error(`forma pública: falta adaptation.${key}`);
  }
  for (const metaKey of ["speech_meta", "motion_meta"]) {
    if (metaKey in state && (!state[metaKey] || typeof state[metaKey] !== "object" || Array.isArray(state[metaKey]))) {
      throw new Error(`forma pública: ${metaKey} debe ser objeto opcional`);
    }
  }
  if (enforceSafetyInvariants) {
    if (["risk", "human_handoff"].includes(state.safety) && state.motion !== "protection_static") {
      throw new Error(`seguridad: ${state.safety} exige motion=protection_static`);
    }
    if (["risk", "human_handoff"].includes(state.safety) && ["starting", "speaking", "paused"].includes(state.speech)) {
      throw new Error(`seguridad: voz ordinaria activa durante ${state.safety}`);
    }
  }
  JSON.parse(JSON.stringify(state));
}

function normalizeResult(result, input) {
  if (result && typeof result === "object" && "state" in result) {
    return { state: result.state, accepted: result.accepted !== false, reason: result.reason ?? null };
  }
  return { state: result, accepted: true, reason: null };
}

async function guardedTransition(transition, inputState, event) {
  const originalState = clone(inputState);
  const originalEvent = clone(event);
  const frozenState = deepFreeze(clone(inputState));
  const frozenEvent = deepFreeze(clone(event));
  try {
    const result = await transition(frozenState, frozenEvent);
    if (!same(frozenState, originalState)) throw new Error("mutación del estado de entrada");
    if (!same(frozenEvent, originalEvent)) throw new Error("mutación del evento de entrada");
    return normalizeResult(result, originalState);
  } catch (error) {
    return { state: originalState, accepted: false, reason: error?.message || String(error), threw: true };
  }
}

function assertMetaSemantics(row, state) {
  if (!row.meta_expectation) return;
  if (row.meta_expectation.voice_wave === false && state.motion === "voice_reactive") {
    throw new Error(`${row.id}: SPEECH_REQUEST no puede activar voice_reactive antes de audio real`);
  }
  if (row.meta_expectation.speech_energy === 0 && state.speech_meta && "energy" in state.speech_meta && state.speech_meta.energy !== 0) {
    throw new Error(`${row.id}: speech_meta.energy debe ser 0 antes de onstart`);
  }
}

async function runRow(row, base, enums, transition) {
  const input = mergeState(base, row.previous_state);
  // Las filas prohibidas pueden representar callbacks obsoletos o combinaciones hostiles.
  // Se exige forma pública válida, pero los invariantes de seguridad se validan en estados alcanzables/salidas permitidas.
  validateCanonicalShape(input, enums, { enforceSafetyInvariants: row.allowed });
  const before = clone(input);
  const event = { type: row.event, ...clone(row.payload || {}) };
  const result = await guardedTransition(transition, input, event);

  if (row.allowed) {
    if (!result.accepted) throw new Error(`${row.id}: evento permitido rechazado: ${result.reason || "sin razón"}`);
    validateCanonicalShape(result.state, enums);
    const mismatch = partialMismatch(result.state, row.expected_state);
    if (mismatch) throw new Error(`${row.id}: ${mismatch}`);
    if (row.revision === "increment_one" && result.state.revision !== before.revision + 1) {
      throw new Error(`${row.id}: revision debe aumentar exactamente en 1 (${before.revision} -> ${result.state.revision})`);
    }
    for (const key of row.preserve || []) {
      if (!same(result.state[key], before[key])) throw new Error(`${row.id}: no preservó ${key}`);
    }
    assertMetaSemantics(row, result.state);
    return result.state;
  }

  if (result.accepted) throw new Error(`${row.id}: evento prohibido aceptado`);
  if (!result.reason) throw new Error(`${row.id}: rechazo no explícito`);
  if (!same(result.state, before)) throw new Error(`${row.id}: evento prohibido modificó el estado`);
  if (row.revision === "unchanged" && result.state.revision !== before.revision) {
    throw new Error(`${row.id}: rechazo cambió revision`);
  }
  return before;
}

async function runScenarios(addendum, base, enums, transition) {
  const rows = new Map(addendum.rows.map((row) => [row.id, row]));
  for (const scenario of addendum.scenarios) {
    let state = clone(scenario.initial || base);
    validateCanonicalShape(state, enums);
    const preserved = Object.fromEntries((scenario.preserve || []).map((key) => [key, clone(state[key])]));

    for (const rowId of scenario.steps) {
      const row = rows.get(rowId);
      if (!row) throw new Error(`${scenario.id}: fila inexistente ${rowId}`);
      const pre = partialMismatch(state, row.previous_state);
      if (pre) throw new Error(`${scenario.id}/${rowId}: precondición no satisfecha: ${pre}`);
      state = await runRow(row, state, enums, transition);
    }

    const mismatch = partialMismatch(state, scenario.final_expect || {});
    if (mismatch) throw new Error(`${scenario.id}: ${mismatch}`);
    for (const [key, value] of Object.entries(preserved)) {
      if (!same(state[key], value)) throw new Error(`${scenario.id}: no preservó ${key}`);
    }
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log("Uso: node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module <módulo puro S0>");
    return;
  }

  const [baseContract, addendum] = await Promise.all([
    JSON.parse(await readFile(basePath, "utf8")),
    JSON.parse(await readFile(addendumPath, "utf8"))
  ]);

  if (addendum.status !== "NORMATIVE_FROZEN") throw new Error("adenda no está congelada como normativa");
  if (!Array.isArray(addendum.rows) || !Array.isArray(addendum.scenarios)) throw new Error("adenda incompleta");
  const ids = new Set();
  for (const row of addendum.rows) {
    if (!row.id || ids.has(row.id)) throw new Error(`fila duplicada o sin id: ${row.id}`);
    ids.add(row.id);
    if (typeof row.allowed !== "boolean") throw new Error(`${row.id}: allowed debe ser boolean`);
  }

  console.log(`QA adenda B06/B07 OK: ${addendum.rows.length} filas, ${addendum.scenarios.length} recorridos.`);
  if (!args.module) {
    console.log("NO_IMPLEMENTATION_EXECUTED: pasa --module para ejecutar la adenda contra S0.");
    return;
  }

  const modulePath = resolve(process.cwd(), args.module);
  const imported = await import(pathToFileURL(modulePath).href);
  const transition = imported.transitionSabikState ?? imported.default?.transitionSabikState;
  if (typeof transition !== "function") {
    throw new Error("La implementación debe exportar transitionSabikState(previousState, event).");
  }

  for (const row of addendum.rows) {
    await runRow(row, baseContract.initial_state, baseContract.state_enums, transition);
  }
  await runScenarios(addendum, baseContract.initial_state, baseContract.state_enums, transition);
  console.log("ACEPTA_ADENDA_B06_B07: aclaración, seguridad, voz y forma pública verificadas.");
}

main().catch((error) => {
  console.error(`BLOQUEO_QA_S0_ADENDA: ${error.message}`);
  process.exitCode = 1;
});
