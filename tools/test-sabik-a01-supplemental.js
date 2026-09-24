/* Supplemental Claude scenarios only. Never an independent QA gate. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const argument = flag => args[args.indexOf(flag) + 1];
if (!args.includes('--cases') || !args.includes('--out')) throw Error('Use --cases <original JSON> --out <external report.json>');
const inputBytes = fs.readFileSync(path.resolve(argument('--cases')));
const hash = crypto.createHash('sha256').update(inputBytes).digest('hex');
assert.equal(hash, '1f6dede5d01ad389a642be60d409c27531ec58c6d7f0ab522a3b3ba3a24c2653');
const corpus = JSON.parse(inputBytes);
assert.equal(corpus.schema_version, '1.0');
assert.equal(corpus.id, 'A01_SEMANTIC_SUGGESTED_CASES_V1');
assert.equal(corpus.status, 'suggested_not_frozen');
assert.equal(corpus.base_sha, 'fc5cdfc2f978c85033de2b07c34309f8a4a7bd18');
assert.equal(corpus.scenarios.length, 28);
assert.equal(new Set(corpus.scenarios.map(s => s.id)).size, 28);
const out = path.resolve(argument('--out'));
if (out === root || out.startsWith(root + path.sep)) throw Error('Keep evidence outside the repository');

global.window = global;
const trace = { retrievals: 0, classified: [] };
for (const name of ['state', 'knowledge', 'language', 'sabik-state', 'risk', 'corrections', 'session', 'retrieval', 'intent', 'decision', 'response']) {
  require(path.join(root, 'sabik/nea-core', name + '.js'));
  if (name === 'risk') {
    const original = global.NEARisk.classifySafetyTurn;
    global.NEARisk.classifySafetyTurn = text => {
      const result = original(text); trace.classified.push({ text, result }); return result;
    };
  }
  if (name === 'retrieval') {
    const original = global.NEARetrieval.retrieveFragmentCandidates;
    global.NEARetrieval.retrieveFragmentCandidates = (...values) => { trace.retrievals++; return original(...values); };
  }
}
require(path.join(root, 'sabik/nea-core.js'));
const core = global.NEACoreV1;
const machineApi = require('../sabik/nea-core/sabik-machine.js');
const step = machineApi.transitionSabikState;
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/data', name + '.es.json'), 'utf8'));
const data = { concepts: read('concepts'), relations: read('relations'), actions: read('actions'), questions: read('discriminating-questions'),
  resources: read('human-resources'), procedures: read('procedures'),
  fragmentsIndex: JSON.parse(fs.readFileSync(path.join(root, 'sabik/assets/NEA/generated/iris-fragments-index.es.json'), 'utf8')).fragments };
const missing = {
  question_repeated: 'Core/S0 runner observes the plan, not DOM presentation or repeated announcements.',
  resumed_original_request: 'No ordinary UI command executor is exposed by the Core/S0 adapter.'
};
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function runScenario(scenario) {
  let machine = step(machineApi.createInitialSabikState(), { type: 'BOOT_OK' });
  let session = core.createSessionState(), plan = null, lastText = '', turn = null;
  const riskyTexts = new Set(), observations = [];
  function render(result) { session = result.session; plan = result.plan; }
  function applyText(text) {
    if (machine.operation === 'error') machine = step(machine, { type: 'RETRY' });
    turn = global.NEARisk.classifySafetyTurn(text);
    for (const type of global.NEARisk.safetyEventsForTurn(turn, machine)) machine = step(machine, { type });
    if (machine.safety === 'normal' && machine.operation !== 'retrieving') machine = step(machine, { type: 'SUBMIT' });
    render(core.buildResponsePlan(text, session, data, machine));
    if (machine.safety === 'normal') {
      if (plan.type === 'insufficient_information') machine = step(machine, { type: 'RETRIEVAL_EMPTY' });
      else {
        machine = step(machine, { type: 'RETRIEVAL_OK' });
        machine = step(machine, { type: plan.type === 'clarifying_question' ? 'ASK_CLARIFICATION' : 'RESPONSE_READY' });
      }
    }
    lastText = text;
  }
  for (const row of scenario.steps) {
    const before = structuredClone({ session, machine, retrievals: trace.retrievals, classified: trace.classified.length });
    let outcome = 'accepted', error = null;
    try {
      const input = row.input;
      if (input.type === 'USER_TEXT') applyText(input.text);
      else if (input.type === 'CLARIFICATION_ANSWER') applyText(input.answer === 'yes' ? 'Si' : 'No');
      else if (input.type === 'CONTROL') render(core.applyResponseControl(session, plan, input.control, data, machine));
      else if (input.type === 'PAUSE') { machine = step(machine, { type: 'PAUSE_ASSISTANT' }); outcome = 'paused'; }
      else if (input.type === 'RESUME') { machine = step(machine, { type: 'RESUME_ASSISTANT' }); outcome = 'resumed'; }
      else if (input.type === 'TECHNICAL_ERROR') {
        machine = step(machine, { type: 'TECHNICAL_ERROR', code: 'supplemental-synthetic' }); outcome = 'error';
        if (machine.safety !== 'normal') render(global.NEAResponse.buildSafetyResponse('', session, data, machine));
      } else if (input.type === 'RETRY') {
        machine = step(machine, { type: 'RETRY' });
        if (lastText) applyText(lastText);
      } else if (input.type === 'RESET') {
        machine = step(machine, { type: 'RESET_SESSION' }); session = core.createSessionState(); plan = null; turn = null; lastText = '';
        if (machine.safety !== 'normal') render(global.NEAResponse.buildSafetyResponse('', session, data, machine));
        outcome = 'reset';
      } else throw Error('Unsupported input ' + input.type);
    } catch (e) { outcome = 'rejected'; error = e.message; }
    const newCalls = trace.classified.slice(before.classified);
    const observation = {
      classification: machine.safety === 'normal' ? 'normal' : machine.safety === 'uncertain' ? 'risk_uncertain' : 'risk_confirmed',
      protection: ({ normal: 'none', uncertain: 'clarification', risk: 'confirmed', human_handoff: 'handoff' })[machine.safety],
      clarification: machine.safety === 'uncertain' && plan?.question ? 'yes_no' : 'none',
      normal_response_allowed: machine.safety === 'normal' && !['paused', 'error', 'booting'].includes(machine.operation) && !plan?.normal_flow_disabled,
      subject: machine.safety === 'normal' ? turn?.subject || 'none' : plan?.subject || 'none',
      outcome, operation: machine.operation, safety: machine.safety, plan_type: plan?.type || null,
      ordinary_retrieval: trace.retrievals > before.retrievals,
      ordinary_action_executed: !equal(session.session_preferences, before.session.session_preferences),
      inferred_state_changed: session.cognitive_state !== before.session.cognitive_state,
      adaptation_changed: !equal(machine.adaptation, before.machine.adaptation) || !equal(session.session_preferences, before.session.session_preferences) ||
        session.sabik_state.low_intensity !== before.session.sabik_state.low_intensity,
      risk_phrase_reevaluated: newCalls.some(call => riskyTexts.has(global.NEAKnowledge.normalizeText(call.text))),
      question: plan?.question || null, rendered_text: plan ? core.renderControlledText(plan) : '', error
    };
    for (const call of newCalls) if (call.result.classification !== 'normal') riskyTexts.add(global.NEAKnowledge.normalizeText(call.text));
    observations.push(observation);
  }
  return observations;
}

function compare(expected, observed, stepIndex) {
  const mismatches = [], unavailable = [];
  for (const [key, value] of Object.entries(expected)) {
    const field = key.replace(/_(?:any_of|not)$/, '');
    if (Object.hasOwn(missing, field)) { unavailable.push({ step: stepIndex, field, reason: missing[field] }); continue; }
    if (!Object.hasOwn(observed, field)) throw Error('Unimplemented base observable ' + field);
    const matches = key.endsWith('_any_of') ? value.includes(observed[field])
      : key.endsWith('_not') ? observed[field] !== value : equal(observed[field], value);
    if (!matches) mismatches.push({ step: stepIndex, field, expected: value, rule: key, actual: observed[field] });
  }
  return { mismatches, unavailable };
}
const results = corpus.scenarios.map(scenario => {
  const observations = runScenario(scenario), mismatches = [], unavailable = [];
  scenario.steps.forEach((row, i) => {
    const alternatives = (row.expect_one_of || [row.expect || {}]).map(expected => compare(expected, observations[i], i));
    const chosen = alternatives.find(result => result.mismatches.length === 0) || alternatives[0];
    mismatches.push(...chosen.mismatches); unavailable.push(...chosen.unavailable);
    const expectedRejection = (row.expect_one_of || [row.expect || {}]).some((expected, index) =>
      expected.outcome === 'rejected' && alternatives[index].mismatches.length === 0);
    if (observations[i].error && !expectedRejection) {
      mismatches.push({ step: i, field: 'adapter_error', actual: observations[i].error });
    }
  });
  const status = mismatches.length ? 'FAIL' : unavailable.length ? 'PASS_MEASURED_OPTIONALS_UNAVAILABLE' : 'PASS';
  console.log(`${status} ${scenario.id}: ${mismatches.map(m => `${m.field}=${JSON.stringify(m.actual)}`).join(', ')}`);
  return { id: scenario.id, title: scenario.title, note: scenario.note || null, status, mismatches,
    base_mismatches: mismatches.filter(m => !Object.hasOwn(corpus.extra_observables, m.field)),
    optional_mismatches: mismatches.filter(m => Object.hasOwn(corpus.extra_observables, m.field)), unavailable, observations };
});
const git = (...args) => cp.execFileSync('git', ['-c', `safe.directory=${root.replace(/\\/g, '/')}`, ...args], { cwd: root, encoding: 'utf8' }).trim();
const report = { suite: corpus.id, status: corpus.status, fixture_sha256: hash, head: git('rev-parse', 'HEAD'),
  runtime_diff: git('diff', '--name-only', 'HEAD', '--', 'sabik/nea-core', 'sabik/sabik-page.js'),
  environment: { os: process.platform, node: process.version }, adapter: 'real local Core/data + unchanged S0; not the browser',
  limitations: { ...missing, ordinary_action_executed: 'Measures actual session preference changes, not unimplemented DOM commands.' },
  counts: { total: results.length, pass: results.filter(r => r.status === 'PASS').length,
    measured_pass_with_unavailable: results.filter(r => r.status === 'PASS_MEASURED_OPTIONALS_UNAVAILABLE').length,
    fail: results.filter(r => r.status === 'FAIL').length,
    base_observables_pass: results.filter(r => r.base_mismatches.length === 0).length,
    optional_observable_fail: results.filter(r => r.optional_mismatches.length > 0).length }, results };
fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.counts));
console.log('SUPPLEMENTAL ONLY: editorial/out-of-scope review required; not independent QA acceptance.');
if (report.counts.fail) process.exitCode = 1;
