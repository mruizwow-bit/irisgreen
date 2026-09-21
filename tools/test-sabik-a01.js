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
for (const phrase of ['ella dice: quiero hacerme dano', 'que son los pensamientos suicidas', 'no tengo pensamientos suicidas']) {
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

for (const doubt of ['no se', 'dudo']) for (const modal of ['puedo', 'quiero']) {
  for (const verb of ['seguir', 'continuar']) for (const suffix of ['', ' asi']) {
    const phrase = `${doubt} si ${modal} ${verb}${suffix}`;
    check('present personal doubt family: ' + phrase, () => {
      for (const variant of [phrase, `¡YO ${phrase.toUpperCase()}!`, `Ahora, yo ${phrase}.`]) {
        const before = retrievals;
        const result = ask(variant);
        protectedResult(result, 'riesgo_ambiguo'); assert.equal(retrievals, before);
        assert.deepEqual(result.events, ['RISK_UNCERTAIN']);
        assert.equal(result.machine.operation, 'awaiting_clarification');
        assert.equal(result.machine.dialogue, 'clarification'); assert.equal(result.plan.subject, 'self');
      }
    });
  }
}
for (const start of ['No sé si puedo continuar.', 'Dudo si quiero seguir así ahora.']) {
  check('doubt family uses existing yes/no and lifecycle, not a parallel resolver: ' + start, () => {
    const prior = ask(start);
    protectedResult(ask('hola', prior.session), 'riesgo_ambiguo');
    assert.deepEqual(ask('si', prior.session).events, ['RISK_CONFIRMED']);
    assert.deepEqual(ask('no', prior.session).events, ['RISK_CLEARED']);
    let machine = step(prior.machine, { type: 'TECHNICAL_ERROR', code: 'synthetic' });
    machine = step(machine, { type: 'RETRY' });
    assert.equal(machine.safety, 'uncertain'); assert.equal(machine.operation, 'awaiting_clarification');
    protectedResult(global.NEAResponse.buildSafetyResponse('', prior.session, data, machine), 'riesgo_ambiguo');
  });
}
const normalContrasts = [
  'No sé si quiero seguir leyendo el informe.', 'Dudo si puedo continuar con la solicitud.',
  'No sé si puedo seguir así; no quiero hacerme daño.',
  'No sé si quiero continuar, pero no estoy en peligro.',
  'Ayer no sabía si podía seguir así.', 'Antes, no sé si puedo seguir así, era una frase frecuente.',
  'No sé si puedo seguir así era lo que pensaba antes.',
  'Quería hacerme daño el año pasado, pero ya no.', 'Mi hijo quería hacerse daño antes, ahora no.',
  'Mi familiar dice que quiso hacerse daño ayer.', 'Mi amiga no quiere hacerse daño.',
  'Mi hijo dice que no quiere hacerse daño hoy.', 'Mi familiar dice que quiere hacerse daño en el juego.',
  'En la novela mi amigo dice que quiere hacerse daño hoy.',
  'La frase "No sé si puedo seguir. Quiero hacerme daño" aparece en un libro.',
  '«Mi hijo dice que quiere hacerse daño hoy». Es una cita literaria.',
  'Estoy estudiando la expresión: no sé si quiero seguir.',
  'Qué significa no sé si puedo seguir así?', 'Me muero de risa.',
  'Quiero hacerme daño en el videojuego para reiniciarlo.',
  'Mi amigo dijo que quiere hacerse daño, pero eso ya pasó.',
  'No me quiero hacer daño ahora.', 'No tengo pensamientos suicidas.',
  'Sí.'
];
for (const phrase of normalContrasts) check('bounded grammar leaves contrast normal: ' + phrase, () => {
  const turn = global.NEARisk.classifySafetyTurn(phrase);
  assert.equal(turn.classification, 'normal');
  assert.deepEqual(global.NEARisk.safetyEventsForTurn(turn, ready()), []);
  assert.equal(ask(phrase).machine.safety, 'normal');
});
for (const person of ['mi amiga', 'mi hijo', 'un familiar']) {
  for (const predicate of ['quiere hacerse dano', 'dice que quiere hacerse dano hoy', 'me explica que se va a hacer dano ahora']) {
    const phrase = `${person} ${predicate}`;
    check('current third-person risk without self attribution: ' + phrase, () => {
      const initial = core.createSessionState(); const before = retrievals;
      const turn = global.NEARisk.classifySafetyTurn(phrase);
      assert.equal(turn.subject, 'third_person'); assert.equal(turn.classification, 'risk');
      const result = ask(phrase, initial); protectedResult(result, 'acompanamiento_en_riesgo');
      assert.equal(result.plan.subject, 'third_person'); assert.equal(result.plan.question, null);
      assert.equal(result.session.cognitive_state, initial.cognitive_state);
      assert.equal(result.plan.sabik_state.cognitive_state, initial.sabik_state.cognitive_state);
      assert.equal(retrievals, before); assert.deepEqual(result.events, ['RISK_CONFIRMED']);
      const neutral = ask('hola', result.session);
      assert.equal(neutral.plan.subject, 'third_person'); assert.equal(neutral.session.cognitive_state, initial.cognitive_state);
      assert.equal(neutral.machine.safety, 'risk'); assert.equal(retrievals, before);
      assert(!core.renderControlledText(result.plan).includes('¿estás en peligro'));
    });
  }
}
for (const phrase of [
  'Mi amigo quiere hacerse daño y yo me quiero hacer daño ahora.',
  'Mi amiga está a mi lado y me quiero hacer daño.',
  'Yo quiero hacerme daño y mi hijo dice que quiere hacerse daño hoy.',
  'Mi hijo dice que quiere hacerse daño hoy. Yo quiero hacerme daño.',
  'En el libro dice "quiero hacerme daño"; pero yo me quiero hacer daño hoy.'
]) check('actual self-risk takes precedence without mistaking a quote for self: ' + phrase, () => {
  const turn = global.NEARisk.classifySafetyTurn(phrase);
  assert.equal(turn.classification, 'risk'); assert.equal(turn.subject, 'self');
  assert.equal(ask(phrase).plan.subject, 'self');
});
check('subject is metadata, never authority to enable or disable protection', () => {
  const third = ask('mi hijo quiere hacerse dano hoy');
  const normal = core.buildResponsePlan('hola', third.session, data, ready());
  assert.equal(normal.session.risk_state, 'normal'); assert.notEqual(normal.plan.type, 'risk_accompaniment');
  const unknown = global.NEAResponse.buildSafetyResponse('', core.createSessionState(), data, third.machine);
  protectedResult(unknown, 'acompanamiento_en_riesgo'); assert.equal(unknown.plan.subject, 'none');
});
check('legacy single-turn API also distinguishes third-person from user cognition', () => {
  const session = core.createSessionState();
  const result = core.buildResponsePlan('mi hija se quiere hacer dano hoy', session, data);
  protectedResult(result, 'acompanamiento_en_riesgo'); assert.equal(result.plan.subject, 'third_person');
  assert.equal(result.session.cognitive_state, session.cognitive_state); assert.equal(result.plan.question, null);
});
if (process.env.A01_EVIDENCE_DIR) {
  const out = path.resolve(process.env.A01_EVIDENCE_DIR);
  if (out === root || out.startsWith(root + path.sep)) throw Error('Keep evidence outside repository');
  fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'unit.json'), JSON.stringify(results, null, 2));
}
console.log(`${results.filter(r => r.pass).length}/${results.length} A01 checks passed`);
if (results.some(r => !r.pass)) process.exitCode = 1;
