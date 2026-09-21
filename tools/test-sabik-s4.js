/* S4 pure session/response and loader regression tests. No network or persistence. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
global.window = global;
for (const file of ["state", "knowledge", "language", "sabik-state", "risk", "corrections", "session", "retrieval", "intent", "decision", "response"]) {
  require(path.join(root, "sabik/nea-core", file + ".js"));
}
require(path.join(root, "sabik/nea-core.js"));
const core = global.NEACoreV1;
const pub = { editorial_status: core.PUBLICABLE };
const fixture = {
  concepts: ["ruido", "decisiones", "salir"].map(id => ({ ...pub, id, label: id, aliases: id === "salir" ? ["salir de casa"] : [] })),
  relations: [], actions: [], resources: [], procedures: [], corpora: { languages: [] },
  questions: [{ ...pub, id: "q-pair", concept_a: "ruido", concept_b: "decisiones", text: "Ruido o decisiones?" }],
  fragmentsIndex: [
    { ...pub, id: "n1", concepts: ["ruido"], title: "ruido", text: "El ruido de la calle. Otra explicacion del ruido.", url: "/es/test/ruido-a/" },
    { ...pub, id: "n2", concepts: ["ruido"], title: "ruido", text: "El ruido en casa. Otra frase sobre ruido.", url: "/es/test/ruido-b/" },
    { ...pub, id: "d1", concepts: ["decisiones"], title: "decisiones", text: "Las decisiones de cada dia. Una explicacion mas de decisiones.", url: "/es/test/decisiones/" },
    { ...pub, id: "s1", concepts: ["salir"], title: "salir de casa", text: "Salir de casa paso a paso.", url: "/es/test/salir/" }
  ]
};
let count = 0;
function test(name, run) { run(); count++; console.log("PASS " + name); }
async function check(name, run) { await run(); count++; console.log("PASS " + name); }
function freeze(value) { if (value && typeof value === "object") { Object.freeze(value); Object.values(value).forEach(freeze); } return value; }
freeze(fixture);
const fresh = () => core.createSessionState();
const ask = (text, session = fresh(), data = fixture) => core.buildResponsePlan(text, session, data);
const answer = () => ask("Que es ruido");
const control = (result, action) => core.applyResponseControl(result.session, result.plan, action, fixture);

async function run() {
  for (const text of ["No es facil salir de casa", "No es normal salir de casa", "No es la primera vez que salgo"]) test("first negative is a query: " + text, () => {
    const result = ask(text);
    assert.notEqual(result.plan.intent, "correction");
  });
  for (const text of ["El ruido no me molesta", "No me molesta el ruido", "El ruido no es el problema", "Ruido no, lo que me pesa es decisiones", "Eso no tiene nada que ver con el ruido"]) test("negation scope: " + text, () => {
    const result = ask(text);
    assert(result.session.vetoed_concepts.includes("ruido"));
    assert(!result.session.active_concepts.includes("ruido"));
    assert(result.plan.evidence.every(e => !e.source_url.includes("ruido")));
  });
  test("difficulty is not a concept rejection", () => {
    const data = { ...fixture, concepts: [{ ...pub, id: "decisiones", aliases: ["elegir"] }] };
    assert.deepEqual(global.NEACorrections.detectNegations("No quiero elegir entre tantas marcas", data), []);
  });
  test("negation does not veto substrings", () => assert.deepEqual(global.NEACorrections.detectNegations("No me molesta el ruidoso", fixture), []));
  test("explicit correction replaces inferred route", () => {
    const result = ask("No es el ruido, es decisiones", answer().session);
    assert.equal(result.plan.type, "correction_acknowledged");
    assert.deepEqual(result.session.active_concepts, ["decisiones"]);
    assert(core.renderControlledText(result.plan).includes("decisiones"));
  });
  for (const text of ["Y eso como se prepara", "Y que hago despues", "Dime mas", "Por que", "Y en casa", "Puedes explicarlo"]) test("context followup: " + text, () => {
    const result = ask(text, answer().session);
    assert.equal(result.session.context_mode, "followup");
    assert(result.plan.concepts_used.includes("ruido"));
    assert(result.plan.source_urls.every(url => url.includes("ruido")));
  });
  test("followup without session asks instead of retrieving", () => {
    const result = ask("Y eso como se prepara");
    assert.equal(result.plan.type, "clarifying_question"); assert.deepEqual(result.plan.fragments_used, []);
  });
  test("topic switch does not inherit prior concept", () => {
    const result = ask("Cambio de tema: decisiones", answer().session);
    assert.equal(result.session.context_mode, "topic_change");
    assert.deepEqual(result.session.active_concepts, ["decisiones"]);
    assert(!result.plan.source_urls.some(url => url.includes("ruido")));
  });
  test("new explicit topic without pronoun does not accumulate", () => assert.deepEqual(ask("Que es decisiones", answer().session).session.active_concepts, ["decisiones"]));
  test("answer rejection preserves concept/topic and records the shown answer", () => {
    const initial = answer(); const before = structuredClone(initial);
    const result = control(initial, "reject_hypothesis");
    assert.deepEqual(initial, before);
    assert.deepEqual(result.session.rejected_concepts, []);
    assert.deepEqual(result.session.active_concepts, initial.session.active_concepts);
    assert.equal(result.session.topic_query, initial.session.topic_query);
    assert.deepEqual(result.session.rejected_response_ids, [initial.plan.response_id]);
    assert.equal(result.session.last_rejection.scope, "response");
    assert.equal(result.session.awaiting_correction, true);
    assert.notEqual(core.renderControlledText(ask("Que es ruido", result.session).plan), core.renderControlledText(initial.plan));
  });
  test("rejected answer allows a followup and another source about the same concept", () => {
    const initial = ask("Que es ruido", core.setSessionPreferences(fresh(), { max_options: 1 }));
    const rejected = control(initial, "reject_hypothesis");
    const result = ask("Y en el trabajo", rejected.session);
    assert.equal(result.session.context_mode, "followup");
    assert.equal(result.session.context_modifier, "trabajo");
    assert.deepEqual(result.session.active_concepts, ["ruido"]);
    assert(result.plan.fragments_used.length > 0);
    assert(!result.plan.fragments_used.includes(initial.plan.fragments_used[0]));
  });
  test("other route rejects fragments, not concept", () => {
    const initial = ask("Que es ruido", core.setSessionPreferences(fresh(), { max_options: 1 }));
    const result = control(initial, "other_route");
    assert.deepEqual(result.session.rejected_concepts, []);
    assert.deepEqual(result.session.active_concepts, ["ruido"]);
    assert(!result.plan.fragments_used.includes(initial.plan.fragments_used[0]));
    assert(result.plan.fragments_used.length);
  });
  test("different fragment IDs cannot replay exactly the rejected answer", () => {
    const data = { ...fixture, fragmentsIndex: [fixture.fragmentsIndex[0], { ...fixture.fragmentsIndex[0], id: "duplicate" }] };
    const initial = ask("Que es ruido", core.setSessionPreferences(fresh(), { max_options: 1 }), data);
    const rejected = core.applyResponseControl(initial.session, initial.plan, "reject_hypothesis", data);
    const next = ask("Que es ruido", rejected.session, data);
    assert.equal(next.plan.repeated_response_blocked, true);
    assert.notEqual(core.renderControlledText(next.plan), core.renderControlledText(initial.plan));
    assert.deepEqual(next.session.active_concepts, ["ruido"]);
  });
  test("exhausted route reports insufficiency without repeating", () => {
    const initial = answer(); const result = control(initial, "other_route");
    assert.equal(result.plan.type, "insufficient_information"); assert.deepEqual(result.plan.fragments_used, []);
  });
  test("response type rejection preserves concepts/fragments", () => {
    const initial = ask("ruido y decisiones");
    assert.equal(initial.plan.type, "clarifying_question");
    const session = core.registerPlanRejection(initial.session, initial.plan, "response_type");
    assert.deepEqual(session.rejected_concepts, []); assert.deepEqual(session.rejected_fragments, []);
    assert.notEqual(ask("ruido y decisiones", session).plan.type, "clarifying_question");
  });
  test("asked question is recorded and not repeated", () => {
    const initial = ask("ruido y decisiones");
    assert.deepEqual(initial.session.asked_questions, ["q-pair"]);
    assert.notEqual(ask("ruido y decisiones", initial.session).plan.type, "clarifying_question");
  });
  test("answer to clarification selects explicitly named option", () => {
    const result = ask("decisiones", ask("ruido y decisiones").session);
    assert.deepEqual(result.session.active_concepts, ["decisiones"]);
    assert.deepEqual(result.plan.concepts_used, ["decisiones"]);
  });
  test("shorter reuses plan without retrieval or new statement", () => {
    const initial = ask("ruido");
    const before = structuredClone(initial);
    freeze(initial);
    const result = control(initial, "shorter");
    assert.deepEqual(result.plan.source_urls, initial.plan.source_urls);
    assert.equal(result.session.user_statements.length, initial.session.user_statements.length);
    assert.equal(result.session.session_preferences.max_options, 3);
    assert.equal(result.session.sabik_state.low_intensity, false);
    assert(core.renderControlledText(result.plan).length < core.renderControlledText(initial.plan).length);
    assert.deepEqual(initial, before);
  });
  test("rephrase uses another verbatim excerpt of same source", () => {
    const initial = answer(); const result = control(initial, "rephrase");
    assert.deepEqual(result.plan.source_urls, initial.plan.source_urls);
    assert.notEqual(result.plan.evidence[0].relevant_text, initial.plan.evidence[0].relevant_text);
    for (const e of result.plan.evidence) assert(fixture.fragmentsIndex.find(f => f.id === e.fragment_id).text.includes(e.relevant_text));
    assert.deepEqual(result.session.rejected_concepts, []); assert.deepEqual(result.session.rejected_fragments, []);
  });
  test("no alternative explanation is explicit", () => assert(control(ask("salir de casa"), "rephrase").plan.limits_notice.startsWith("No tengo otra")));
  test("one option is not shorter or less presence", () => {
    const result = control(answer(), "one_option");
    assert.equal(result.plan.source_urls.length, 1);
    assert.equal(result.session.session_preferences.response_length, "normal");
    assert.equal(result.session.sabik_state.low_intensity, false);
  });
  test("no questions affects decisions, not concept route", () => {
    const initial = ask("ruido y decisiones"); const result = control(initial, "no_questions");
    assert.notEqual(result.plan.type, "clarifying_question");
    assert.equal(result.session.session_preferences.question_policy, "none");
    assert.deepEqual(result.session.rejected_concepts, []);
  });
  test("question threshold affects ambiguity gate", () => {
    const candidates = fixture.fragmentsIndex.filter(f => ["n1", "d1"].includes(f.id)).map((fragment, i) => ({ fragment, match_strength: 20 + i * 20, match_reasons: [] }));
    const args = { intent: "personal_situation", conceptIds: ["ruido", "decisiones"], directConcepts: ["ruido", "decisiones"], relationConcepts: [], candidates, questions: fixture.questions, riskState: "normal" };
    assert.equal(core.decideCore({ ...args, session: fresh() }).decision, "ask");
    assert.equal(core.decideCore({ ...args, session: core.setSessionPreferences(fresh(), { question_threshold: "high" }) }).decision, "respond");
  });
  for (const text of ["Mas corto", "Explicamelo mas corto", "No me preguntes", "Dame una opcion", "Explicamelo de otra forma"]) test("control text is not an unrelated search: " + text, () => {
    const result = ask(text, answer().session);
    assert(result.plan.source_urls.every(url => url.includes("ruido")));
    assert.deepEqual(result.session.rejected_concepts, []);
  });
  test("deterministic and input immutable across turns", () => {
    const session = freeze(answer().session); const before = structuredClone(session);
    assert.deepEqual(ask("Y eso como se prepara", session), ask("Y eso como se prepara", session));
    assert.deepEqual(session, before);
    assert.deepEqual(fresh().user_statements, []); assert.equal(fresh().last_plan, null);
  });
  for (const type of ["risk_accompaniment", "ambiguous_risk_clarification"]) test("ordinary controls do not rewrite protection: " + type, () => {
    const initial = answer(); initial.plan.type = type;
    for (const action of ["reject_hypothesis", "other_route", "rephrase", "shorter", "one_option", "no_questions"]) {
      const result = control(initial, action);
      assert.equal(result.plan.type, type);
      assert.deepEqual(result.plan.evidence, initial.plan.evidence);
      assert.deepEqual(result.session.rejected_concepts, initial.session.rejected_concepts);
    }
  });
  test("no questions and one option preserve a followup rather than replaying topic", () => {
    const initial = ask("Y eso como se prepara", answer().session);
    for (const action of ["one_option", "no_questions"]) {
      const result = control(initial, action);
      assert.equal(result.session.current_need, initial.session.current_need);
      assert.deepEqual(result.session.user_statements, initial.session.user_statements);
      assert.equal(result.plan.source_urls[0], initial.plan.source_urls[0]);
    }
  });
  test("rejection without a prior answer does not invent a hypothesis", () => {
    const result = ask("No es esto");
    assert.equal(result.plan.type, "insufficient_information");
    assert.deepEqual(result.session.rejected_concepts, []);
  });
  const paths = Object.fromEntries(Object.keys(core.DEFAULT_PATHS).map(key => [key, key]));
  let calls, fail, payloads;
  function mock() {
    calls = []; fail = {}; payloads = structuredClone(fixture);
    global.fetch = async key => {
      calls.push(key);
      if (fail[key] === "network") throw Error("offline");
      return { ok: !fail[key], status: fail[key] || 200, json: async () => {
        if (payloads[key] === "malformed") throw Error("invalid JSON");
        return structuredClone(payloads[key]);
      }};
    };
  }
  for (const key of ["procedures", "questions", "resources", "corpora", "actions", "relations"]) for (const mode of [404, 503, "network", "malformed", "empty", "shape"]) await check(`optional ${key}: ${mode}`, async () => {
    mock();
    if (mode === "empty") payloads[key] = key === "corpora" ? { languages: [] } : [];
    else if (mode === "malformed") payloads[key] = "malformed";
    else if (mode === "shape") payloads[key] = "invalid shape";
    else fail[key] = mode;
    const data = await core.loadData(paths);
    const expected = mode === "empty" ? "editorial_absence" : mode === 404 ? "resource_unavailable" : "technical_error";
    assert.equal(data.availability[key].status, expected);
    assert(ask("Que es ruido", fresh(), data).plan.source_urls.length);
  });
  await check("missing optional path is unavailable, not editorial absence", async () => {
    mock(); const data = await core.loadData({ ...paths, questions: undefined });
    assert.equal(data.availability.questions.status, "resource_unavailable");
  });
  await check("optional retry reloads only failed data without mutating baseline", async () => {
    mock(); fail.questions = 404;
    const initial = await core.loadData(paths); const before = structuredClone(initial); freeze(initial);
    fail = {}; calls = [];
    const retried = await core.loadData(paths, initial);
    assert.deepEqual(calls, ["questions"]); assert.equal(retried.availability.questions.status, "available");
    assert.deepEqual(initial, before);
  });
  for (const key of ["concepts", "fragmentsIndex"]) await check("required failure and clean retry: " + key, async () => {
    mock(); fail[key] = 503;
    await assert.rejects(core.loadData(paths), error => error.code === "technical_error" && error.dataset === key);
    fail = {}; assert((await core.loadData(paths))[key].length);
  });
  await check("empty public index is editorial lack, not technical exception", async () => {
    mock(); payloads.fragmentsIndex = [];
    const data = await core.loadData(paths);
    assert.equal(ask("ruido", fresh(), data).plan.outcome, "editorial_absence");
  });
  test("supported data without answer is insufficiency", () => assert.equal(ask("xxxyyyzzz").plan.outcome, "insufficient_information"));
  test("runtime does not persist conversation", () => {
    const runtime = fs.readFileSync(path.join(root, "sabik/sabik-page.js"), "utf8") + ["session", "response", "corrections", "knowledge"].map(name => fs.readFileSync(path.join(root, "sabik/nea-core", name + ".js"), "utf8")).join("\n");
    assert(!/localStorage|sessionStorage|indexedDB|document\.cookie/u.test(runtime));
  });
  console.log(`\n${count}/${count} S4 checks passed`);
}
run().catch(error => { console.error(error); process.exitCode = 1; });
