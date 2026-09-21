/* Synthetic continuity regressions against the real local Core, never QA holdouts. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
global.window = global;
for (const name of ['state', 'knowledge', 'language', 'sabik-state', 'risk', 'corrections', 'session', 'retrieval', 'intent', 'decision', 'response']) {
  require(path.join(root, 'sabik/nea-core', name + '.js'));
}
require(path.join(root, 'sabik/nea-core.js'));
const core = global.NEACoreV1;
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/data', name + '.es.json'), 'utf8'));
const data = { concepts: read('concepts'), relations: read('relations'), actions: read('actions'), questions: read('discriminating-questions'),
  resources: read('human-resources'), procedures: read('procedures'),
  fragmentsIndex: JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/generated/iris-fragments-index.es.json'), 'utf8')).fragments };
const results = [];
const ask = (text, session = core.createSessionState()) => core.buildResponsePlan(text, session, data);
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
  assert.equal(next.session.safety_resolution, 'RISK_CLEARED');
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
      protectedResult(core.applyResponseControl(pending.session, pending.plan, action, data), pending.session.risk_state);
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
    assert.notEqual(result.session.safety_resolution, 'RISK_CLEARED');
  }
});
check('a cleared resolution is a one-turn event, not a permanent bypass', () => {
  const cleared = ask('no', ask('ya no puedo mas').session);
  const again = ask('ya no puedo mas', cleared.session);
  protectedResult(again, 'riesgo_ambiguo'); assert.notEqual(again.session.safety_resolution, 'RISK_CLEARED');
});
if (process.env.A01_EVIDENCE_DIR) {
  const out = path.resolve(process.env.A01_EVIDENCE_DIR);
  if (out === root || out.startsWith(root + path.sep)) throw Error('Keep evidence outside repository');
  fs.mkdirSync(out, { recursive: true }); fs.writeFileSync(path.join(out, 'unit.json'), JSON.stringify(results, null, 2));
}
console.log(`${results.filter(r => r.pass).length}/${results.length} A01 checks passed`);
if (results.some(r => !r.pass)) process.exitCode = 1;
