#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import process from "node:process";

const here = dirname(fileURLToPath(import.meta.url));
const contractPath = resolve(here, "s0-state-contract.json");
const casesPath = resolve(here, "s0-transition-cases.json");
const corpusPath = resolve(here, "../../fixtures/sabik/conversation-corpus.v1.json");

const REQUIRED_CORPUS_FIELDS = [
  "id", "idioma", "entrada", "contexto_anterior", "intencion", "objetivo",
  "conceptos_esperados", "conceptos_prohibidos", "tipo_salida",
  "accion_permitida", "accion_prohibida", "pregunta_si_no",
  "recurso_humano_si_no", "fuentes_aceptables", "estado_final", "incertidumbre"
];

const FORBIDDEN_SOURCE_PATTERNS = [
  [/\bdocument\b/, "DOM: document"],
  [/\bwindow\b/, "DOM/global: window"],
  [/\blocalStorage\b/, "storage: localStorage"],
  [/\bsessionStorage\b/, "storage: sessionStorage"],
  [/\bindexedDB\b/, "storage: indexedDB"],
  [/\bfetch\s*\(/, "network: fetch"],
  [/\bXMLHttpRequest\b/, "network: XMLHttpRequest"],
  [/\bWebSocket\b/, "network: WebSocket"],
  [/\bspeechSynthesis\b/, "effect: speechSynthesis"],
  [/\bDate\.now\s*\(/, "clock: Date.now"],
  [/\bperformance\.now\s*\(/, "clock: performance.now"],
  [/\bMath\.random\s*\(/, "random: Math.random"]
];

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

function mergeState(base, partial) {
  const next = clone(base);
  for (const [key, value] of Object.entries(partial || {})) {
    if (key === "adaptation" && value && typeof value === "object") {
      next.adaptation = { ...next.adaptation, ...clone(value) };
    } else {
      next[key] = clone(value);
    }
  }
  return next;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

function same(a, b) {
  return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
}

function partialMatch(actual, expected, path = "") {
  for (const [key, expectedValue] of Object.entries(expected || {})) {
    const nextPath = path ? `${path}.${key}` : key;
    if (!(key in actual)) return `falta ${nextPath}`;
    if (expectedValue && typeof expectedValue === "object" && !Array.isArray(expectedValue)) {
      const err = partialMatch(actual[key], expectedValue, nextPath);
      if (err) return err;
    } else if (!same(actual[key], expectedValue)) {
      return `${nextPath}: esperado ${JSON.stringify(expectedValue)}, recibido ${JSON.stringify(actual[key])}`;
    }
  }
  return null;
}

function validateState(state, enums) {
  const required = ["operation", "dialogue", "adaptation", "safety", "visibility", "speech", "motion", "language", "revision"];
  for (const key of required) {
    if (!(key in state)) throw new Error(`estado inválido: falta ${key}`);
  }
  for (const key of ["operation", "dialogue", "safety", "visibility", "speech", "motion", "language"]) {
    if (!enums[key].includes(state[key])) throw new Error(`estado inválido: ${key}=${JSON.stringify(state[key])}`);
  }
  if (!Number.isInteger(state.revision) || state.revision < 0) throw new Error("estado inválido: revision debe ser entero >= 0");
  const a = state.adaptation;
  if (!a || typeof a !== "object" || Array.isArray(a)) throw new Error("estado inválido: adaptation");
  for (const key of ["response_length", "max_options", "question_policy", "intensity", "depth"]) {
    if (!(key in a)) throw new Error(`estado inválido: adaptation.${key}`);
  }
  if (!Number.isInteger(a.max_options) || a.max_options < 1) throw new Error("estado inválido: adaptation.max_options");
  assertNoImpossibleState(state);
  const roundTrip = JSON.parse(JSON.stringify(state));
  if (!same(state, roundTrip)) throw new Error("estado no serializable de forma estable");
}

function assertNoImpossibleState(state) {
  if (state.safety === "human_handoff" && state.dialogue !== "human_handoff") {
    throw new Error("estado imposible: safety=human_handoff sin dialogue=human_handoff");
  }
  if (["risk", "human_handoff"].includes(state.safety) && state.motion === "voice_reactive") {
    throw new Error("estado imposible: movimiento reactivo de voz durante riesgo");
  }
  if (state.motion === "voice_reactive" && !["starting", "speaking"].includes(state.speech)) {
    throw new Error("estado imposible: voice_reactive sin voz activa");
  }
  if (state.operation === "error" && state.dialogue === "insufficient") {
    throw new Error("estado imposible: error técnico representado como insuficiencia");
  }
}

function normalizeContractRows(contract) {
  if (!Array.isArray(contract.columns)) return contract.rows;
  return contract.rows.map((row, index) => {
    if (!Array.isArray(row) || row.length !== contract.columns.length) {
      throw new Error(`fila de matriz ${index} no coincide con columns`);
    }
    return Object.fromEntries(contract.columns.map((column, i) => [column, row[i]]));
  });
}

function validateContract(contract) {
  if (contract.schema_version !== 2) throw new Error("s0-state-contract.json: schema_version debe ser 2");
  contract.rows = normalizeContractRows(contract);
  const ids = new Set();
  for (const row of contract.rows) {
    for (const field of contract.required_row_fields) {
      if (!(field in row)) throw new Error(`${row.id || "<sin id>"}: falta campo ${field}`);
    }
    if (ids.has(row.id)) throw new Error(`id de matriz duplicado: ${row.id}`);
    ids.add(row.id);
    if (typeof row.allowed !== "boolean") throw new Error(`${row.id}: allowed debe ser boolean`);
    if (!Array.isArray(row.controls_active) || !Array.isArray(row.controls_disabled)) {
      throw new Error(`${row.id}: controles deben ser arrays`);
    }
    for (const control of row.controls_active) {
      if (row.controls_disabled.includes(control)) throw new Error(`${row.id}: control simultáneamente activo y desactivado: ${control}`);
    }
  }
  validateState(contract.initial_state, contract.state_enums);
  return ids;
}

function validateCases(fixtures, rowIds) {
  const ids = new Set();
  for (const item of fixtures.cases) {
    if (!item.id || ids.has(item.id)) throw new Error(`caso canónico duplicado o sin id: ${item.id}`);
    ids.add(item.id);
    if (!Array.isArray(item.steps)) throw new Error(`${item.id}: steps debe ser array`);
    for (const rowId of item.steps) {
      if (!rowIds.has(rowId)) throw new Error(`${item.id}: fila inexistente ${rowId}`);
    }
  }
}

function validateCorpus(corpus) {
  const ids = new Set();
  for (const item of corpus.cases) {
    for (const field of REQUIRED_CORPUS_FIELDS) {
      if (!(field in item)) throw new Error(`${item.id || "<sin id>"}: falta campo de corpus ${field}`);
    }
    if (ids.has(item.id)) throw new Error(`id de corpus duplicado: ${item.id}`);
    ids.add(item.id);
    if (!["es", "en"].includes(item.idioma)) throw new Error(`${item.id}: idioma no soportado`);
    if (!corpus.allowed_output_types.includes(item.tipo_salida)) throw new Error(`${item.id}: tipo_salida no registrado`);
    if (!corpus.uncertainty_levels.includes(item.incertidumbre)) throw new Error(`${item.id}: incertidumbre no registrada`);
    if (typeof item.pregunta_si_no !== "boolean" || typeof item.recurso_humano_si_no !== "boolean") {
      throw new Error(`${item.id}: pregunta_si_no y recurso_humano_si_no deben ser boolean`);
    }
  }
}

function normalizeResult(result, inputState) {
  if (result && typeof result === "object" && "state" in result) {
    return {
      state: result.state,
      accepted: result.accepted !== false,
      reason: result.reason ?? null
    };
  }
  return { state: result, accepted: true, reason: null };
}

async function guardedTransition(transition, state, event) {
  const stateBefore = clone(state);
  const eventBefore = clone(event);
  const frozenState = deepFreeze(clone(state));
  const frozenEvent = deepFreeze(clone(event));

  const originals = {
    fetch: globalThis.fetch,
    dateNow: Date.now,
    random: Math.random
  };
  let effectAttempt = null;

  globalThis.fetch = async () => {
    effectAttempt = "fetch";
    throw new Error("QA_PURITY_FETCH_FORBIDDEN");
  };
  Date.now = () => {
    effectAttempt = "Date.now";
    throw new Error("QA_PURITY_CLOCK_FORBIDDEN");
  };
  Math.random = () => {
    effectAttempt = "Math.random";
    throw new Error("QA_PURITY_RANDOM_FORBIDDEN");
  };

  try {
    const result = await transition(frozenState, frozenEvent);
    if (effectAttempt) throw new Error(`violación de pureza: ${effectAttempt}`);
    if (!same(frozenState, stateBefore)) throw new Error("mutación del estado de entrada");
    if (!same(frozenEvent, eventBefore)) throw new Error("mutación del evento de entrada");
    return normalizeResult(result, stateBefore);
  } catch (error) {
    if (effectAttempt) throw new Error(`violación de pureza: ${effectAttempt}`);
    return { state: stateBefore, accepted: false, reason: error?.message || String(error), threw: true };
  } finally {
    if (originals.fetch === undefined) delete globalThis.fetch;
    else globalThis.fetch = originals.fetch;
    Date.now = originals.dateNow;
    Math.random = originals.random;
  }
}

function stripCommentsAndStrings(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*$/gm, " ")
    .replace(/`(?:\\.|[^`\\])*`/gs, " ")
    .replace(/"(?:\\.|[^"\\])*"/g, " ")
    .replace(/'(?:\\.|[^'\\])*'/g, " ");
}

async function assertStaticPurity(modulePath) {
  const source = stripCommentsAndStrings(await readFile(modulePath, "utf8"));
  const violations = FORBIDDEN_SOURCE_PATTERNS
    .filter(([pattern]) => pattern.test(source))
    .map(([, label]) => label);
  if (violations.length) {
    throw new Error(`pureza estática incumplida en ${modulePath}: ${violations.join(", ")}`);
  }
}

async function runRow(row, contract, transition) {
  const input = mergeState(contract.initial_state, row.previous_state);
  validateState(input, contract.state_enums);
  const event = { type: row.event, ...clone(row.payload) };

  const first = await guardedTransition(transition, input, event);
  const second = await guardedTransition(transition, input, event);

  if (!same(first, second)) throw new Error(`${row.id}: no determinista`);

  if (row.allowed) {
    if (!first.accepted) throw new Error(`${row.id}: evento permitido rechazado: ${first.reason || "sin razón"}`);
    if (!first.state || typeof first.state !== "object") throw new Error(`${row.id}: transición permitida sin estado`);
    validateState(first.state, contract.state_enums);
    const mismatch = partialMatch(first.state, row.expected_state);
    if (mismatch) throw new Error(`${row.id}: ${mismatch}`);
    if (contract.state_enums.speech.includes(row.voice_expected) && first.state.speech !== row.voice_expected) {
      throw new Error(`${row.id}: voz esperada ${row.voice_expected}, recibida ${first.state.speech}`);
    }
    if (contract.state_enums.motion.includes(row.movement_expected) && first.state.motion !== row.movement_expected) {
      throw new Error(`${row.id}: movimiento esperado ${row.movement_expected}, recibido ${first.state.motion}`);
    }
    if (contract.state_enums.safety.includes(row.security_expected) && first.state.safety !== row.security_expected) {
      throw new Error(`${row.id}: seguridad esperada ${row.security_expected}, recibida ${first.state.safety}`);
    }
  } else {
    if (first.accepted) throw new Error(`${row.id}: evento prohibido aceptado`);
    if (!first.reason) throw new Error(`${row.id}: rechazo no explícito (falta razón)`);
    if (!same(first.state, input)) throw new Error(`${row.id}: evento prohibido modificó el estado`);
  }
  return first.state;
}

async function runScenarios(fixtures, contract, rowsById, transition) {
  for (const scenario of fixtures.cases) {
    let state = clone(scenario.initial || contract.initial_state);
    validateState(state, contract.state_enums);
    const preservedAtStart = Object.fromEntries((scenario.preserve || []).map((key) => [key, clone(state[key])]));

    for (const rowId of scenario.steps) {
      const row = rowsById.get(rowId);
      const preMismatch = partialMatch(state, row.previous_state);
      if (preMismatch) throw new Error(`${scenario.id}/${rowId}: precondición no satisfecha: ${preMismatch}`);

      const result = await guardedTransition(transition, state, { type: row.event, ...clone(row.payload) });
      if (row.allowed) {
        if (!result.accepted) throw new Error(`${scenario.id}/${rowId}: evento permitido rechazado: ${result.reason || "sin razón"}`);
        validateState(result.state, contract.state_enums);
        const mismatch = partialMatch(result.state, row.expected_state);
        if (mismatch) throw new Error(`${scenario.id}/${rowId}: ${mismatch}`);
        if (contract.state_enums.speech.includes(row.voice_expected) && result.state.speech !== row.voice_expected) {
          throw new Error(`${scenario.id}/${rowId}: voz esperada ${row.voice_expected}, recibida ${result.state.speech}`);
        }
        if (contract.state_enums.motion.includes(row.movement_expected) && result.state.motion !== row.movement_expected) {
          throw new Error(`${scenario.id}/${rowId}: movimiento esperado ${row.movement_expected}, recibido ${result.state.motion}`);
        }
        if (contract.state_enums.safety.includes(row.security_expected) && result.state.safety !== row.security_expected) {
          throw new Error(`${scenario.id}/${rowId}: seguridad esperada ${row.security_expected}, recibida ${result.state.safety}`);
        }
        state = result.state;
      } else {
        if (result.accepted) throw new Error(`${scenario.id}/${rowId}: evento prohibido aceptado`);
        if (!result.reason) throw new Error(`${scenario.id}/${rowId}: rechazo no explícito`);
        if (!same(result.state, state)) throw new Error(`${scenario.id}/${rowId}: evento prohibido mutó estado`);
      }
    }

    if (scenario.final_expect) {
      const mismatch = partialMatch(state, scenario.final_expect);
      if (mismatch) throw new Error(`${scenario.id}: ${mismatch}`);
    }
    for (const [key, value] of Object.entries(preservedAtStart)) {
      if (!same(state[key], value)) throw new Error(`${scenario.id}: no preservó ${key}`);
    }
    validateState(state, contract.state_enums);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log("Uso: node tests/specs/sabik/run-s0-contract.mjs [--module sabik/nea-core/sabik-machine.js]");
    return;
  }

  const [contract, fixtures, corpus] = await Promise.all(
    [contractPath, casesPath, corpusPath].map(async (path) => JSON.parse(await readFile(path, "utf8")))
  );

  const rowIds = validateContract(contract);
  validateCases(fixtures, rowIds);
  validateCorpus(corpus);

  console.log(`QA fixtures OK: ${contract.rows.length} transiciones, ${fixtures.cases.length} recorridos, ${corpus.cases.length} casos conversacionales.`);

  if (!args.module) {
    console.log("NO_IMPLEMENTATION_EXECUTED: pasa --module para ejecutar la puerta S0 contra una implementación.");
    return;
  }

  const modulePath = resolve(process.cwd(), args.module);
  await assertStaticPurity(modulePath);
  const imported = await import(`${pathToFileURL(modulePath).href}?qa=${Date.now()}`);
  const transition = imported.transitionSabikState ?? imported.default?.transitionSabikState;
  if (typeof transition !== "function") {
    throw new Error("La implementación debe exportar transitionSabikState(previousState, event).");
  }

  const rowsById = new Map(contract.rows.map((row) => [row.id, row]));
  for (const row of contract.rows) await runRow(row, contract, transition);
  await runScenarios(fixtures, contract, rowsById, transition);

  console.log("ACEPTA_PUERTA_AUTOMATICA_S0: pureza, determinismo, inmutabilidad, estados, transiciones, rechazos, invariantes y serialización verificadas.");
}

main().catch((error) => {
  console.error(`BLOQUEO_QA_S0: ${error.message}`);
  process.exitCode = 1;
});
