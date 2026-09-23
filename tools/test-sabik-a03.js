/* Own A03 regressions against the real Core and S0, not the frozen QA corpus. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
global.window = global;
let retrievals = 0;
for (const name of ['state', 'knowledge', 'language', 'sabik-state', 'risk', 'corrections', 'session', 'retrieval', 'intent', 'decision', 'response']) {
  require(path.join(root, 'sabik/nea-core', name + '.js'));
  if (name === 'retrieval') {
    const original = global.NEARetrieval.retrieveFragmentCandidates;
    global.NEARetrieval.retrieveFragmentCandidates = (...args) => { retrievals++; return original(...args); };
  }
}
require(path.join(root, 'sabik/nea-core.js'));
const core = global.NEACoreV1;
const { transitionSabikState: step, createInitialSabikState } = require('../sabik/nea-core/sabik-machine.js');
const { COGNITIVE_STATES: C, FUNCTIONAL_STATES: F, PROTECTION_STATES: P, PRESENCE_STATES: V,
  RESPONSE_MODES: M, INTERACTION_STATES: I } = global.NEACoreState;
const detect = global.NEARetrieval.detectCognitiveState;
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/data', name + '.es.json'), 'utf8'));
const data = { concepts: read('concepts'), relations: read('relations'), actions: read('actions'), questions: read('discriminating-questions'),
  resources: read('human-resources'), procedures: read('procedures'),
  fragmentsIndex: JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/generated/iris-fragments-index.es.json'), 'utf8')).fragments };
const results = [];
function check(name, run) {
  try { run(); results.push({ name, pass: true }); console.log('PASS ' + name); }
  catch (error) { results.push({ name, pass: false, error: error.message }); console.log('FAIL ' + name + ': ' + error.message); }
}
const ready = () => step(createInitialSabikState(), { type: 'BOOT_OK' });
const adaptation = session => ({ cognitive: session.cognitive_state, low: session.sabik_state.low_intensity,
  preferences: structuredClone(session.session_preferences) });
function fixture(preferences = {}) {
  return { machine: ready(), session: core.setSessionPreferences(core.createSessionState(), preferences), plan: null };
}
function renderProtected(context, text = '', subject = 'self') {
  const before = structuredClone(context.session), calls = retrievals;
  const result = global.NEAResponse.buildSafetyResponse(text, context.session, data, context.machine, { subject });
  assert.deepEqual(context.session, before, 'must not mutate the previous session');
  assert.equal(retrievals, calls, 'protected response must not perform ordinary retrieval');
  return { machine: context.machine, ...result };
}
function protect(context, type, text = '') {
  const machine = type === 'HUMAN_HANDOFF' ? step(context.machine, { type: 'RISK_CONFIRMED' }) : context.machine;
  return renderProtected({ ...context, machine: step(machine, { type }) }, text);
}
function assertProtection(context) {
  const s = context.session.sabik_state;
  assert.equal(context.plan.normal_flow_disabled, true);
  assert.equal(s.protection, P.RIESGO);
  assert.equal(s.functional_state, F.LISTENING);
  assert.equal(s.interaction, I.CLARIDAD);
  assert.equal(s.mode, M.PRACTICO);
  assert.equal(s.visual_presence, V.ESTATICA);
  assert.equal(context.machine.motion, 'protection_static');
}
function ask(context, text) {
  let machine = context.machine;
  for (const type of global.NEARisk.safetyEventsForTurn(global.NEARisk.classifySafetyTurn(text), machine)) {
    machine = step(machine, { type });
  }
  if (machine.safety === 'normal' && machine.operation !== 'retrieving') machine = step(machine, { type: 'SUBMIT' });
  const result = core.buildResponsePlan(text, context.session, data, machine);
  if (machine.safety === 'normal') {
    if (result.plan.type === 'insufficient_information') machine = step(machine, { type: 'RETRIEVAL_EMPTY' });
    else {
      machine = step(machine, { type: 'RETRIEVAL_OK' });
      machine = step(machine, { type: result.plan.type === 'clarifying_question' ? 'ASK_CLARIFICATION' : 'RESPONSE_READY' });
    }
  }
  return { machine, ...result };
}

for (const risk of ['normal', 'riesgo_ambiguo', 'acompanamiento_en_riesgo']) {
  for (const text of ['', 'Gracias por responder', 'Quiero hacerme dano', 'Dudo si quiero continuar']) {
    check('Safety parameter alone has no cognitive signal: ' + risk + ' / ' + text, () => {
      const preferences = Object.freeze({ response_length: 'short', max_options: 1, low_intensity: true });
      assert.equal(detect(text, preferences, risk), C.NUCLEO_BASE);
    });
  }
}
const signals = [
  ['estoy saturada', C.SOBRECARGA], ['no puedo pensar', C.SOBRECARGA],
  ['quiero entender a fondo', C.HIPERFOCO], ['necesito poner palabras', C.VOZ_INTERIOR],
  ['acompaname', C.VINCULO], ['quiero crear una historia', C.CREATIVIDAD]
];
for (const [text, cognitive] of signals) {
  for (const risk of ['normal', 'riesgo_ambiguo', 'acompanamiento_en_riesgo']) {
    check('explicit cognitive signal stays independent of Safety: ' + text + ' / ' + risk, () => {
      assert.equal(detect(text, {}, risk), cognitive);
    });
  }
  check('explicit signal remains available in ordinary Core response: ' + text, () => {
    const result = ask(fixture(), text);
    assert.equal(result.machine.safety, 'normal'); assert.equal(result.session.cognitive_state, cognitive);
  });
  check('explicit signal can coexist with protection: ' + text, () => {
    const result = protect(fixture(), 'RISK_CONFIRMED', text);
    assertProtection(result); assert.equal(result.session.cognitive_state, cognitive);
  });
}

for (const event of ['RISK_CONFIRMED', 'RISK_UNCERTAIN', 'HUMAN_HANDOFF']) {
  for (const preferences of [{}, { response_length: 'short', max_options: 1 }, { low_intensity: true }, { question_policy: 'low' }]) {
    check('protection does not add adaptation: ' + event + ' / ' + JSON.stringify(preferences), () => {
      const initial = fixture(preferences), expected = adaptation(initial.session);
      let current = protect(initial, event);
      assert.deepEqual(adaptation(current.session), expected); assertProtection(current);
      current = renderProtected(current, 'Gracias');
      assert.deepEqual(adaptation(current.session), expected); assertProtection(current);
      current.machine = step(current.machine, { type: 'PAUSE_ASSISTANT' });
      assert.equal(current.machine.operation, 'paused'); assertProtection(current);
      current.machine = step(current.machine, { type: 'RESUME_ASSISTANT' });
      current = renderProtected(current);
      assert.deepEqual(adaptation(current.session), expected); assertProtection(current);
      current.machine = step(current.machine, { type: 'TECHNICAL_ERROR', code: 'a03-test' });
      current = renderProtected(current); assert.equal(current.machine.operation, 'error');
      assert.deepEqual(adaptation(current.session), expected); assertProtection(current);
      current.machine = step(current.machine, { type: 'RETRY' });
      current = renderProtected(current);
      assert.deepEqual(adaptation(current.session), expected); assertProtection(current);
    });
  }
}
for (const phrase of ['quiero morirme', 'me quiero hacer dano', 'dudo si puedo seguir asi', 'no quiero seguir']) {
  check('actual Safety text has no implicit cognitive adaptation: ' + phrase, () => {
    const initial = fixture(), expected = adaptation(initial.session);
    const current = ask(initial, phrase);
    assert.notEqual(current.machine.safety, 'normal'); assertProtection(current);
    assert.deepEqual(adaptation(current.session), expected);
    assert.deepEqual(adaptation(ask(current, 'hola').session), expected);
  });
}
for (const phrase of ['estoy saturada', 'no puedo pensar']) {
  check('actual own-risk and cognitive clauses coexist: ' + phrase, () => {
    const current = ask(fixture(), 'quiero hacerme dano; ' + phrase);
    assert.equal(current.machine.safety, 'risk'); assertProtection(current);
    assert.equal(current.session.cognitive_state, C.SOBRECARGA);
  });
}
for (const text of ['no quiero hacerme dano', 'en un libro aparece "quiero morirme"',
  'que significa suicidio', 'gracias', 'mi hermana quiere hacerse dano']) {
  check('negative, quoted, informational, neutral or third-person Safety is not own cognition: ' + text, () => {
    const initial = fixture(), current = ask(initial, text);
    assert.deepEqual(adaptation(current.session), adaptation(initial.session));
    if (text.startsWith('mi hermana')) {
      assertProtection(current); assert.equal(current.plan.subject, 'third_person');
    } else assert.equal(current.machine.safety, 'normal');
  });
}
check('uncertainty clearance leaves no Safety-created residual, including the ordinary response', () => {
  const initial = fixture(), pending = ask(initial, 'dudo si quiero seguir');
  const expected = adaptation(initial.session);
  assert.deepEqual(adaptation(pending.session), expected);
  const clearedMachine = step(pending.machine, { type: 'RISK_CLEARED' });
  assert.equal(clearedMachine.safety, 'normal'); assert.deepEqual(adaptation(pending.session), expected);
  const cleared = ask(pending, 'no'); assert.equal(cleared.machine.safety, 'normal');
  assert.deepEqual(adaptation(cleared.session), expected);
  assert.equal(cleared.session.sabik_state.protection, P.NORMAL);
});
check('protected reset retains S0 protection and explicit preferences without adding overload', () => {
  const initial = fixture({ response_length: 'short' });
  const current = protect(initial, 'RISK_CONFIRMED');
  const reset = renderProtected({ machine: step(current.machine, { type: 'RESET_SESSION' }),
    session: core.setSessionPreferences(core.createSessionState(), current.session.session_preferences) }, '', 'none');
  assertProtection(reset); assert.deepEqual(adaptation(reset.session), adaptation(initial.session));
});
if (process.env.A03_EVIDENCE_DIR) {
  const out = path.resolve(process.env.A03_EVIDENCE_DIR);
  if (out === root || out.startsWith(root + path.sep)) throw Error('Keep evidence outside repository');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'a03-unit.json'), JSON.stringify({ os: process.platform, node: process.version, results }, null, 2));
}
console.log(`${results.filter(r => r.pass).length}/${results.length} A03 checks passed`);
if (results.some(r => !r.pass)) process.exitCode = 1;
