/* Synthetic continuity regressions against the real local Core, never QA holdouts. */
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
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/data', name + '.es.json'), 'utf8'));
const data = { concepts: read('concepts'), relations: read('relations'), actions: read('actions'), questions: read('discriminating-questions'),
  resources: read('human-resources'), procedures: read('procedures'),
  fragmentsIndex: JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/generated/iris-fragments-index.es.json'), 'utf8')).fragments };
const results = [];
const machineApi = require('../sabik/nea-core/sabik-machine.js');
const machines = new WeakMap();
const step = machineApi.transitionSabikState;
const ready = () => step(machineApi.createInitialSabikState(), { type: 'BOOT_OK' });
const ask = (text, session = core.createSessionState()) => {
  let machine = machines.get(session) || ready();
  const events = global.NEARisk.safetyEventsForTurn(global.NEARisk.classifySafetyTurn(text), machine);
  for (const type of events) machine = step(machine, { type });
  if (machine.safety === 'normal' && machine.operation !== 'retrieving') machine = step(machine, { type: 'SUBMIT' });
  const result = core.buildResponsePlan(text, session, data, machine);
  if (machine.safety === 'normal') {
    if (result.plan.type === 'insufficient_information') machine = step(machine, { type: 'RETRIEVAL_EMPTY' });
    else {
      machine = step(machine, { type: 'RETRIEVAL_OK' });
      machine = step(machine, { type: result.plan.type === 'clarifying_question' ? 'ASK_CLARIFICATION' : 'RESPONSE_READY' });
    }
  }
  machines.set(result.session, machine);
  return { ...result, machine, events };
};
function check(name, run) {
  try { const observed = run(); results.push({ name, pass: true, observed }); console.log('PASS ' + name); }
  catch (e) { results.push({ name, pass: false, error: e.message }); console.log('FAIL ' + name + ': ' + e.message); }
}
function protectedResult(result, risk) {
  assert.equal(result.session.risk_state, risk);
  assert.equal(result.plan.type, risk === 'riesgo_ambiguo' ? 'ambiguous_risk_clarification' : 'risk_accompaniment');
  assert.equal(result.plan.normal_flow_disabled, true);
  assert.deepEqual(result.plan.fragments_used, []);
}
check('first ambiguous turn asks a safety clarification', () => protectedResult(ask('ya no puedo mas'), 'riesgo_ambiguo'));
for (const reply of ['si', 'Sí.', 'SI!', 'yes']) check('affirmative safety reply: ' + reply, () => {
  const pending = ask('ya no puedo mas');
  protectedResult(ask(reply, pending.session), 'acompanamiento_en_riesgo');
});
for (const reply of ['no', 'No.', 'NO!', 'no estoy en peligro ni pensando en hacerme dano']) check('explicit negative resolves only pending uncertainty: ' + reply, () => {
  const pending = ask('ya no puedo mas');
  const next = ask(reply, pending.session);
  assert.equal(next.session.risk_state, 'normal');
  assert.equal(next.machine.safety, 'normal'); assert(next.events.includes('RISK_CLEARED'));
  assert(!['risk_accompaniment', 'ambiguous_risk_clarification'].includes(next.plan.type));
});
for (const reply of ['hola', 'no se', 'quizas', 'cambio de tema: ruido', 'no quiero hacerme dano', 'no estoy en peligro', 'si me ayudas con ruido', 'no, pero quiero hacerme dano']) {
  check('uncertainty is not silently cleared: ' + reply, () => {
    const pending = ask('ya no puedo mas');
    const expected = reply.includes('pero quiero') ? 'acompanamiento_en_riesgo' : 'riesgo_ambiguo';
    protectedResult(ask(reply, pending.session), expected);
  });
}
for (const reply of ['hola', 'no', 'no quiero hacerme dano', 'cambio de tema: ruido', 'ya no puedo mas']) check('confirmed risk survives: ' + reply, () => {
  protectedResult(ask(reply, ask('quiero hacerme dano').session), 'acompanamiento_en_riesgo');
});
for (const message of ['ya no puedo mas', 'quiero hacerme dano']) {
  for (const action of ['shorter', 'no_questions', 'one_option', 'rephrase', 'other_route', 'reject_hypothesis']) {
    check('response control preserves safety: ' + message + '/' + action, () => {
      const pending = ask(message);
      protectedResult(core.applyResponseControl(pending.session, pending.plan, action, data, pending.machine), pending.session.risk_state);
    });
  }
}
check('a reply cannot mutate the previous session or data', () => {
  const pending = ask('ya no puedo mas'); const before = structuredClone(pending.session);
  const dataBefore = structuredClone(data);
  ask('si', pending.session); assert.deepEqual(pending.session, before);
  assert.deepEqual(data, dataBefore);
});
check('yes/no without a pending safety question do not resolve or infer risk', () => {
  for (const text of ['si', 'no']) {
    const result = ask(text); assert.equal(result.session.risk_state, 'normal');
    assert(!result.events.includes('RISK_CLEARED'));
  }
});
check('a cleared resolution is a one-turn event, not a permanent bypass', () => {
  const cleared = ask('no', ask('ya no puedo mas').session);
  const again = ask('ya no puedo mas', cleared.session);
  protectedResult(again, 'riesgo_ambiguo'); assert(!again.events.includes('RISK_CLEARED'));
});
for (const verb of ['quiero', 'voy a', 'pienso']) {
  for (const phrase of [`${verb} hacerme dano`, `me ${verb} hacer dano`]) {
    check('first person and clitic placement: ' + phrase, () => assert.equal(global.NEARisk.detectRisk(phrase), 'acompanamiento_en_riesgo'));
    check('negation scopes its own predicate: no ' + phrase, () => assert.equal(global.NEARisk.detectRisk('no ' + phrase), 'normal'));
  }
}
for (const phrase of ['mi amiga quiere hacerse dano', 'ella dice: quiero hacerme dano', 'que son los pensamientos suicidas', 'no tengo pensamientos suicidas']) {
  check('third person, report or negation is not confirmed self-risk: ' + phrase, () => {
    assert.equal(global.NEARisk.detectRisk(phrase, ['riesgo_suicida'], data), 'normal');
  });
}
check('detector does not reuse the previous session or inherited crisis concept', () => {
  ask('quiero hacerme dano');
  assert.equal(global.NEARisk.detectRisk('hola', ['riesgo_suicida'], data), 'normal');
});
check('only S0 decides protection, not forged legacy risk or last_plan', () => {
  const prior = ask('quiero hacerme dano');
  const normal = core.buildResponsePlan('ruido', prior.session, data, ready());
  assert.equal(normal.session.risk_state, 'normal'); assert.notEqual(normal.plan.type, 'risk_accompaniment');
  const uncertain = step(ready(), { type: 'RISK_UNCERTAIN' });
  const protectedPlan = core.buildResponsePlan('hola', core.createSessionState(), data, uncertain);
  protectedResult(protectedPlan, 'riesgo_ambiguo');
});
check('a stale protected plan cannot override normal S0 through a preference control', () => {
  const prior = ask('quiero hacerme dano');
  const result = core.applyResponseControl(prior.session, prior.plan, 'shorter', data, ready());
  assert.equal(result.session.risk_state, 'normal'); assert.notEqual(result.plan.type, 'risk_accompaniment');
});
check('paused S0 refuses new response/control work but can render its existing protection', () => {
  const machine = step(step(ready(), { type: 'RISK_CONFIRMED' }), { type: 'PAUSE_ASSISTANT' });
  const session = core.createSessionState();
  assert.throws(() => core.buildResponsePlan('hola', session, data, machine));
  assert.throws(() => core.applyResponseControl(session, null, 'shorter', data, machine));
  protectedResult(global.NEAResponse.buildSafetyResponse('', session, data, machine), 'acompanamiento_en_riesgo');
});
for (const safety of ['uncertain', 'risk', 'human_handoff']) check('zero ordinary retrieval under S0 ' + safety, () => {
  let machine = step(ready(), { type: safety === 'uncertain' ? 'RISK_UNCERTAIN' : 'RISK_CONFIRMED' });
  if (safety === 'human_handoff') machine = step(machine, { type: 'HUMAN_HANDOFF' });
  const before = retrievals;
  const result = core.buildResponsePlan('ruido', core.createSessionState(), data, machine);
  assert.equal(retrievals, before); assert(result.plan.normal_flow_disabled);
});
for (const safety of ['uncertain', 'risk']) check('explicit human help routes from ' + safety + ' without downgrade', () => {
  const prior = ask(safety === 'uncertain' ? 'ya no puedo mas' : 'quiero hacerme dano');
  const result = ask('necesito hablar con una persona', prior.session);
  assert.equal(result.machine.safety, 'human_handoff'); assert(result.events.includes('HUMAN_HANDOFF'));
  const next = ask('no', result.session); assert.equal(next.machine.safety, 'human_handoff');
});
check('paused/error uncertainty cannot be resolved by a yes/no turn', () => {
  const uncertain = step(ready(), { type: 'RISK_UNCERTAIN' });
  for (const type of ['PAUSE_ASSISTANT', 'TECHNICAL_ERROR']) {
    const machine = step(uncertain, { type }); const before = structuredClone(machine);
    for (const text of ['si', 'no']) assert.deepEqual(global.NEARisk.safetyEventsForTurn(global.NEARisk.classifySafetyTurn(text), machine), []);
    assert.deepEqual(machine, before);
  }
});
if (process.env.A01_EVIDENCE_DIR) {
  const out = path.resolve(process.env.A01_EVIDENCE_DIR);
  if (out === root || out.startsWith(root + path.sep)) throw Error('Keep evidence outside repository');
  fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'unit.json'), JSON.stringify(results, null, 2));
}
console.log(`${results.filter(r => r.pass).length}/${results.length} A01 checks passed`);
if (results.some(r => !r.pass)) process.exitCode = 1;
