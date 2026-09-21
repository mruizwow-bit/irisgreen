// QA0 transport adapter: maps input/session annotations, runs the real modules,
// and projects their observations. Does not read expected, gates, or fixture IDs.
import path from 'node:path';
import vm from 'node:vm';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { runBrowserProbe } = require('./lib/sabik-s4-browser-probe.js');
const root = path.resolve(process.env.S4_WEB_ROOT || path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const modules = ['state', 'knowledge', 'language', 'sabik-state', 'risk', 'corrections', 'session', 'retrieval', 'intent', 'decision', 'response'];
let browserProbe;

function runtime() {
  const context = vm.createContext({ structuredClone, console });
  context.window = context;
  for (const name of modules) vm.runInContext(fs.readFileSync(path.join(root, 'sabik/nea-core', name + '.js'), 'utf8'), context);
  vm.runInContext(fs.readFileSync(path.join(root, 'sabik/nea-core.js'), 'utf8'), context);
  return context;
}

function dataFor(core) {
  const pub = { editorial_status: core.PUBLICABLE };
  const aliases = { ruido: [], decisiones: ['decidir', 'elegir', 'opciones'], organizacion: ['organizarme'], 'sueño': ['sueño'], luz: [], salir: ['salir de casa'] };
  return {
    concepts: Object.entries(aliases).map(([id, terms]) => ({ ...pub, id, label: id, aliases: terms })),
    fragmentsIndex: Object.keys(aliases).flatMap(id => [1, 2, 3, 4].map(n => ({
      ...pub, id: `${id}-${n}`, concepts: [id], title: id,
      text: `Informacion de prueba sobre ${id}, via ${n}.`, url: `/es/qa-synthetic/${encodeURIComponent(id)}/${n}/`
    }))),
    relations: [], actions: [], procedures: [], resources: [], questions: [], corpora: { languages: [] }
  };
}

async function load(context, data, failures) {
  const paths = Object.fromEntries(Object.keys(data).map(key => [key, key]));
  context.fetch = async key => ({ ok: !failures.includes(key), status: failures.includes(key) ? 503 : 200,
    json: async () => structuredClone(data[key]) });
  return context.NEACoreV1.loadData(paths);
}

export async function evaluateS4({ session: seed = {}, input = {} }) {
  if (input.inspection || ['RELOAD_NEW_SESSION', 'RETRY'].includes(input.action)) {
    // One complete real-browser audit per seed; storage observations are never constants.
    const texts = (seed.turns || []).filter(turn => turn.user).map(turn => turn.user);
    const topic = seed.active_concept || (seed.turns || []).find(turn => turn.active_concept)?.active_concept || 'ruido';
    const key = JSON.stringify({ texts, topic });
    if (!browserProbe || browserProbe.key !== key) browserProbe = { key, result: runBrowserProbe({
      root, seedTexts: texts, topic, data: dataFor(runtime().NEACoreV1), out: process.env.S4_EVIDENCE_DIR
    }) };
    const actual = await browserProbe.result;
    if (input.inspection) return actual.storage[input.inspection];
    return input.action === 'RETRY' ? actual.retry : actual.reload;
  }
  const context = runtime(), core = context.NEACoreV1;
  const source = dataFor(core);
  const data = await load(context, source, input.dataset_failures || []);
  let session = core.createSessionState();
  for (const turn of seed.turns || []) {
    if (turn.user) session = core.buildResponsePlan(turn.user, session, data).session;
    if (turn.active_concept) session.active_concepts = [turn.active_concept];
    if (turn.assistant && session.last_plan && turn.response_id) session.last_plan.response_id = turn.response_id;
  }
  if (seed.active_concept) session.active_concepts = [seed.active_concept];
  if (seed.rejected_concepts) session.rejected_concepts = [...seed.rejected_concepts];
  if (seed.question_policy) session = core.setSessionPreferences(session, { question_policy: seed.question_policy });
  const before = structuredClone(session);
  const actions = { NOT_THIS: 'reject_hypothesis', SEARCH_OTHER_WAY: 'other_route' };
  const result = actions[input.action]
    ? core.applyResponseControl(session, session.last_plan, actions[input.action], data)
    : core.buildResponsePlan(input.text || '', session, data);
  const next = result.session, plan = result.plan;
  const blocked = [...new Set([...next.vetoed_concepts, ...next.rejected_concepts])];
  const active = next.active_concepts[0] || null;
  const failure = Object.entries(data.availability).find(([, item]) => item.status === 'technical_error')?.[0];
  return {
    is_correction: plan.intent === 'correction',
    starts_new_topic: next.context_mode !== 'followup',
    continuation: next.context_mode === 'followup',
    context_modifier: next.context_modifier,
    active_concept: active,
    active_concept_not: blocked.find(id => !next.active_concepts.includes(id)) || null,
    previous_concept_inactive: before.active_concepts.every(id => !next.active_concepts.includes(id)),
    negated_concepts: next.vetoed_concepts,
    rejected_concepts: blocked,
    preserve_rejected_as_active: blocked.some(id => next.active_concepts.includes(id)),
    rejected_response_ids: next.rejected_response_ids,
    topic_reset: before.topic_query !== next.topic_query || (before.active_concepts.length > 0 && !next.active_concepts.length),
    route_changed: JSON.stringify(before.last_plan?.fragments_used) !== JSON.stringify(plan.fragments_used) &&
      !plan.fragments_used.some(id => before.last_plan?.fragments_used.includes(id)),
    question_policy: next.session_preferences.question_policy,
    may_ask_clarifying_question: next.session_preferences.question_policy !== 'none',
    basic_retrieval_available: data.availability.concepts.status === 'available' && data.availability.fragmentsIndex.status === 'available',
    optional_failure: failure,
    fatal_error: false, // exceptions propagate to QA0 as failures; optional load returned normally
    invented_content_count: (plan.evidence || []).filter(item => !source.fragmentsIndex.some(fragment =>
      fragment.id === item.fragment_id && fragment.text.includes(item.relevant_text))).length
  };
}
