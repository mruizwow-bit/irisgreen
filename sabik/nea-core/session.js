(() => {
  const { COGNITIVE_STATES } = window.NEACoreState;
  const { unique, normalizeText } = window.NEAKnowledge;
  const { defaultSabikState, sabikStateFromLayers } = window.NEASabikState;

  function createSessionState() {
    return {
      current_need: null,
      topic_query: null,
      last_plan: null,
      awaiting_correction: false,
      explanation_index: 0,
      user_statements: [],
      user_negations: [],
      user_corrections: [],
      active_concepts: [],
      vetoed_concepts: [],
      rejected_fragments: [],
      rejected_concepts: [],
      rejected_response_types: [],
      shown_fragments: [],
      asked_questions: [],
      session_preferences: {
        response_length: "normal",
        max_options: 3,
        question_threshold: "normal",
        question_policy: "normal",
        low_intensity: false
      },
      cognitive_state: COGNITIVE_STATES.NUCLEO_BASE,
      sabik_state: defaultSabikState(),
      privacy_state: "session_only"
    };
  }

  function applySessionUpdate(session, text, conceptIds, negatedIds, preferences, riskState, cognitiveState) {
    const next = typeof structuredClone === "function" ? structuredClone(session) : JSON.parse(JSON.stringify(session));
    next.current_need = text || next.current_need;
    if (text) next.user_statements.push(text);
    next.user_negations = unique([...next.user_negations, ...negatedIds]);
    next.vetoed_concepts = unique([...next.vetoed_concepts, ...negatedIds]);
    next.active_concepts = unique(conceptIds).filter((id) =>
      !next.vetoed_concepts.includes(id) && !next.rejected_concepts.includes(id));
    next.session_preferences = {
      ...next.session_preferences,
      ...preferences
    };
    next.risk_state = riskState;
    next.cognitive_state = cognitiveState;
    next.sabik_state = sabikStateFromLayers(cognitiveState, riskState, next.session_preferences);
    return next;
  }

  function registerPlanRejection(session, plan, reason = "rejected_by_user") {
    const next = typeof structuredClone === "function" ? structuredClone(session) : JSON.parse(JSON.stringify(session));
    const rejectsQuestionOnly = plan?.type === "clarifying_question";
    const selectedConcepts = ((plan && plan.decision && plan.decision.selected) || [])
      .map((possibility) => possibility.concept_id)
      .filter(Boolean);
    const shownConcepts = rejectsQuestionOnly
      ? []
      : (selectedConcepts.length ? selectedConcepts : ((plan && plan.concepts_used) || []).slice(0, 1));
    next.user_corrections = unique([...next.user_corrections, reason]);
    const scope = reason === "buscar_otra_via" || reason === "fragment" ? "fragment"
      : reason === "response_type" || rejectsQuestionOnly ? "response_type" : "hypothesis";
    next.rejected_fragments = unique([
      ...(next.rejected_fragments || []),
      ...(scope === "fragment" ? (plan?.fragments_used || []) : [])
    ]);
    next.rejected_response_types = unique([
      ...(next.rejected_response_types || []),
      scope === "response_type" ? plan?.type : null
    ]);
    next.rejected_concepts = unique([
      ...(next.rejected_concepts || []),
      ...(scope === "hypothesis" ? shownConcepts : [])
    ]);
    next.active_concepts = next.active_concepts.filter(id => !next.rejected_concepts.includes(id));
    next.awaiting_correction = scope === "hypothesis";
    next.last_rejection = { scope, reason };
    return next;
  }

  function resolveSessionContext(session, text, mentionedConcepts) {
    const normalized = normalizeText(text);
    const changed = /^(?:cambio de tema|cambiemos de tema|otra cosa|ahora quiero hablar de)(?: |$)/u.test(normalized);
    const followup = !changed && !session.awaiting_correction && (
      /\b(?:eso|esto|ello|lo anterior|esa respuesta|ese tema|explicamelo|puedes explicarlo)\b/u.test(normalized) ||
      /^(?:y (?:entonces|despues|ahora|en|si|que hago)|por que|como lo hago|que puedo hacer|dime mas|continua|sigue)(?: |$)/u.test(normalized) ||
      (session.last_plan?.type === "clarifying_question" && mentionedConcepts.length === 1)
    );
    const blocked = new Set([...session.vetoed_concepts, ...session.rejected_concepts]);
    const inherited = followup && !mentionedConcepts.length
      ? session.active_concepts.filter(id => !blocked.has(id)) : [];
    const hasContext = followup && Boolean(session.topic_query);
    return {
      query: hasContext ? `${session.topic_query} ${text}` : text,
      inherited,
      mode: changed ? "topic_change" : hasContext ? "followup" : "new_query",
      unresolved: followup && !hasContext
    };
  }

  function rememberPlan(session, plan) {
    const next = structuredClone(session);
    next.last_plan = structuredClone(plan);
    next.shown_fragments = unique([...next.shown_fragments, ...(plan.fragments_used || [])]);
    if (plan.decision?.question_id && plan.type === "clarifying_question") {
      next.asked_questions = unique([...next.asked_questions, plan.decision.question_id]);
    }
    return { session: next, plan };
  }

  function applyConversationControl(session, plan, control) {
    if (control === "reject_hypothesis") return registerPlanRejection(session, plan, "no_es_esto");
    if (control === "other_route") return registerPlanRejection(session, plan, "buscar_otra_via");
    if (control === "shorter") return setSessionPreferences(session, { response_length: "short" });
    if (control === "one_option") return setSessionPreferences(session, { max_options: 1 });
    if (control === "no_questions") return setSessionPreferences(session, { question_policy: "none", question_threshold: "high" });
    if (control === "rephrase") {
      const next = structuredClone(session);
      next.explanation_index += 1;
      return next;
    }
    throw new Error(`Unknown conversation control: ${control}`);
  }

  function setSessionPreferences(session, preferences) {
    const next = typeof structuredClone === "function" ? structuredClone(session) : JSON.parse(JSON.stringify(session));
    next.session_preferences = {
      ...next.session_preferences,
      ...preferences
    };
    const riskState = next.risk_state || "normal";
    next.sabik_state = sabikStateFromLayers(next.cognitive_state, riskState, next.session_preferences);
    return next;
  }

  window.NEASession = {
    createSessionState,
    applySessionUpdate,
    resolveSessionContext,
    rememberPlan,
    applyConversationControl,
    registerPlanRejection,
    setSessionPreferences
  };
})();
