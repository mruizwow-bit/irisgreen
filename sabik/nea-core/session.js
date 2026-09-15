(() => {
  const { COGNITIVE_STATES } = window.NEACoreState;
  const { unique } = window.NEAKnowledge;
  const { defaultSabikState, sabikStateFromLayers } = window.NEASabikState;

  function createSessionState() {
    return {
      current_need: null,
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
        question_threshold: "normal"
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
    next.active_concepts = unique([
      ...next.active_concepts,
      ...conceptIds.filter((id) => !next.vetoed_concepts.includes(id))
    ]).filter((id) => !next.vetoed_concepts.includes(id));
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
    next.rejected_fragments = unique([
      ...(next.rejected_fragments || []),
      ...(rejectsQuestionOnly ? [] : ((plan && plan.fragments_used) || []))
    ]);
    next.rejected_response_types = unique([
      ...(next.rejected_response_types || []),
      plan?.type
    ]);
    next.rejected_concepts = unique([
      ...(next.rejected_concepts || []),
      ...shownConcepts
    ]);
    return next;
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
    registerPlanRejection,
    setSessionPreferences
  };
})();
