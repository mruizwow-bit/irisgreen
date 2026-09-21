(() => {
  const { normalizeText, isPublicable, unique } = window.NEAKnowledge;
  const { detectNegations, detectSessionPreferences, detectConversationControl } = window.NEACorrections;
  const { applySessionUpdate, resolveSessionContext, resolveSafetyContext, rememberPlan: storePlan, applyConversationControl } = window.NEASession;
  const { detectRisk, createRiskAccompanimentPlan, createAmbiguousRiskPlan } = window.NEARisk;
  const { INTENTS, classifyIntent } = window.NEAIntent;
  const { decideCore } = window.NEADecision;
  const {
    detectConcepts,
    detectRelations,
    detectCognitiveState,
    retrieveFragmentCandidates,
    selectBestCandidates,
    findActions
  } = window.NEARetrieval;
  const { applyOutputLanguageGuard, formulateApprovedResponse } = window.NEALanguage;

  function sentenceCandidates(text) {
    return String(text || "")
      .split(/(?<=[.!?])\s+|\n+/u)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
  }

  function rememberPlan(session, plan) {
    let shown = { ...plan };
    const answerText = value => renderControlledText(value).replace(/\s*Fuente:\s*\S+\s*$/, "").trim();
    // Different fragment IDs can contain the same answer. Never replay rejected evidence.
    if (shown.evidence?.length && (session.rejected_responses || []).some(item => item.text === answerText(shown))) {
      shown = { ...shown, type: "insufficient_information", answer_mode: "none", outcome: "insufficient_information",
        evidence: [], fragments_used: [], source_urls: [], match_evidence: [], next_steps: [], question: null,
        limits_notice: "No tengo otra respuesta respaldada por las fuentes disponibles.", repeated_response_blocked: true };
    }
    shown.response_text = answerText(shown);
    return storePlan(session, shown);
  }

  function relevantTextForFragment(fragment, input) {
    const tokens = window.NEARetrieval.tokenizeSearchText(input);
    const scored = sentenceCandidates(fragment.text).map((sentence, index) => {
      const normalized = normalizeText(sentence);
      const score = tokens.filter((token) => window.NEARetrieval.termMatches(normalized, token)).length;
      return { sentence, index, score };
    });
    const best = scored
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .find((item) => item.score > 0) || scored[0];
    return best ? best.sentence.slice(0, 280) : String(fragment.text || "").slice(0, 280);
  }

  function evidenceFromFragments(fragments, text) {
    return fragments.map((fragment) => ({
      fragment_id: fragment.id,
      relevant_text: relevantTextForFragment(fragment, text),
      source_url: fragment.url
    }));
  }

  function planBase(type, intent, nextSession, conceptIds, fragments, candidates, question, riskState, data) {
    return {
      type,
      intent,
      answer_mode: type === "direct_information" ? "information" : (type === "source_answer" ? "situational" : "none"),
      concepts_used: conceptIds,
      vetoed_concepts: nextSession.vetoed_concepts,
      fragments_used: fragments.map((fragment) => fragment.id),
      source_urls: fragments.map((fragment) => fragment.url),
      evidence: evidenceFromFragments(fragments, nextSession.current_need),
      match_evidence: candidates.map((candidate) => ({
        fragment_id: candidate.fragment.id,
        match_strength: candidate.match_strength,
        match_reasons: candidate.match_reasons
      })),
      question: question?.text || null,
      actions: findActions(conceptIds, riskState, data),
      data_availability: data.availability || {},
      outcome: type === "insufficient_information"
        ? (data.availability?.fragmentsIndex?.status === "editorial_absence" ? "editorial_absence" : "insufficient_information")
        : "supported",
      sabik_state: nextSession.sabik_state,
      session_preferences: nextSession.session_preferences,
      privacy_notice: "Memoria de sesion, sin persistencia por defecto.",
      limits_notice: type === "insufficient_information" ? "No tengo informacion suficiente en Iris Green para responder con seguridad." : null
    };
  }

  function practicalStepsFromEvidence(evidence, maxOptions) {
    return evidence
      .slice(0, Math.max(1, maxOptions || 1))
      .map((item) => item.relevant_text)
      .filter(Boolean);
  }

  function selectedConceptsFromDecision(decision) {
    return (decision?.selected || []).map((possibility) => possibility.concept_id).filter(Boolean);
  }

  function discardedConceptsFromDecision(decision) {
    return (decision?.discarded || []).map((possibility) => possibility.concept_id).filter(Boolean);
  }

  function candidateHasConcept(candidate, concepts) {
    const wanted = new Set(concepts || []);
    return (candidate.fragment.concepts || []).some((concept) => wanted.has(concept));
  }

  function candidatesForDecision(candidates, decision) {
    const selectedConcepts = selectedConceptsFromDecision(decision);
    const discardedConcepts = discardedConceptsFromDecision(decision);
    if (!selectedConcepts.length) {
      if (decision?.reason === "lexical_evidence") {
        return (candidates || []).filter((candidate) => {
          const concepts = candidate.fragment.concepts || [];
          if (!concepts.length) return true;
          return !concepts.every((concept) => discardedConcepts.includes(concept));
        });
      }
      return [];
    }
    return (candidates || [])
      .filter((candidate) => candidateHasConcept(candidate, selectedConcepts))
      .filter((candidate) => !candidateHasConcept(candidate, discardedConcepts));
  }

  function conceptIdsForDecision(conceptIds, decision) {
    const selectedConcepts = selectedConceptsFromDecision(decision);
    if (selectedConcepts.length) return selectedConcepts;
    const discarded = new Set(discardedConceptsFromDecision(decision));
    return (conceptIds || []).filter((concept) => !discarded.has(concept));
  }

  function buildResponsePlan(text, session, data) {
    const control = detectConversationControl(text);
    if (control) return applyResponseControl(session, session.last_plan, control, data);
    const mentioned = detectConcepts(text, data);
    const relationConcepts = detectRelations(text, data);
    const negatedIds = detectNegations(text, data);
    const intent = classifyIntent(text, session, negatedIds);
    const context = resolveSessionContext(session, text, unique([...mentioned, ...relationConcepts]));
    const directConcepts = unique([...mentioned, ...context.inherited]);
    const preferences = detectSessionPreferences(text);
    const conceptIds = unique([...directConcepts, ...relationConcepts]).filter((id) =>
      !session.vetoed_concepts.includes(id) && !session.rejected_concepts.includes(id) && !negatedIds.includes(id));
    const safety = resolveSafetyContext(session, text, detectRisk(text, unique([...conceptIds, ...directConcepts]), data));
    const riskState = safety.riskState;
    const cognitiveState = detectCognitiveState(text, preferences, riskState);
    const nextSession = applySessionUpdate(session, text, conceptIds, negatedIds, preferences, riskState, cognitiveState);
    nextSession.safety_resolution = safety.resolution;
    nextSession.context_mode = context.mode;
    nextSession.context_modifier = context.modifier;
    nextSession.topic_query = context.mode === "followup" ? session.topic_query : text;
    nextSession.awaiting_correction = false;
    nextSession.explanation_index = 0;
    if (negatedIds.length) nextSession.last_rejection = { scope: "concept", concepts: [...negatedIds], reason: "explicit_negation" };
    if (intent === INTENTS.CORRECTION) nextSession.user_corrections.push(text);

    if (riskState === "acompanamiento_en_riesgo") {
      return rememberPlan(nextSession, createRiskAccompanimentPlan(nextSession, conceptIds, findActions(["riesgo_suicida"], riskState, data)));
    }

    if (riskState === "riesgo_ambiguo") {
      return rememberPlan(nextSession, createAmbiguousRiskPlan(nextSession));
    }

    if (intent === INTENTS.CORRECTION) {
      const correctionCandidates = selectBestCandidates(
        retrieveFragmentCandidates(context.query, directConcepts, relationConcepts, data, nextSession),
        nextSession.session_preferences.max_options
      );
      const correctionFragments = correctionCandidates.map((candidate) => candidate.fragment);
      return rememberPlan(nextSession, {
          ...planBase("correction_acknowledged", intent, nextSession, conceptIds, correctionFragments, correctionCandidates, null, riskState, data),
          removed_or_vetoed: negatedIds,
          communication_open: true,
          limits_notice: null
      });
    }

    if (intent === INTENTS.ACCOMPANIMENT) {
      return rememberPlan(nextSession, {
          ...planBase("accompaniment_presence", intent, nextSession, conceptIds, [], [], null, riskState, data),
          communication_open: true,
          search_required: false,
          limits_notice: null
      });
    }

    if (context.unresolved) {
      const mayAsk = nextSession.session_preferences.question_policy !== "none";
      return rememberPlan(nextSession, planBase(mayAsk ? "clarifying_question" : "insufficient_information",
        intent, nextSession, [], [], [], mayAsk ? { text: "¿Sobre qué tema quieres seguir?" } : null, riskState, data));
    }

    const decisionSession = nextSession;
    const candidates = selectBestCandidates(
      context.unresolved ? [] : retrieveFragmentCandidates(context.query, directConcepts, relationConcepts, data, decisionSession),
      nextSession.session_preferences.max_options
    );
    const questions = (data.questions || []).filter(isPublicable);
    const decision = decideCore({
      intent,
      conceptIds,
      directConcepts,
      relationConcepts,
      candidates,
      questions,
      session: decisionSession,
      riskState
    });
    const question = decision.question_id
      ? (data.questions || []).find((item) => item.id === decision.question_id)
      : null;
    const effectiveCandidates = candidatesForDecision(candidates, decision);
    const fragments = effectiveCandidates.map((candidate) => candidate.fragment);
    const effectiveConceptIds = conceptIdsForDecision(conceptIds, decision);
    const hasInterpretiveReason = effectiveCandidates.some((candidate) =>
      candidate.match_reasons.includes("direct_concept") || candidate.match_reasons.includes("editorial_relation")
    );
    let type = decision.decision === "ask"
      ? "clarifying_question"
      : decision.decision === "insufficient"
      ? "insufficient_information"
      : fragments.length
      ? (intent === INTENTS.INFORMATION_REQUEST ? "direct_information" : (hasInterpretiveReason ? "source_answer" : "direct_information"))
      : "insufficient_information";
    if (decision.decision === "offer" && intent === INTENTS.PRACTICAL_REQUEST && fragments.length) {
      type = "practical_steps";
    }
    if (nextSession.rejected_response_types.includes(type)) {
      type = fragments.length && type !== "direct_information" ? "direct_information" : "insufficient_information";
    }

    const base = planBase(type, intent, nextSession, effectiveConceptIds, fragments, effectiveCandidates, type === "clarifying_question" ? question : null, riskState, data);
    base.decision = decision;
    base.option_strengths = decision.possibilities.map((possibility) => ({
      concept: possibility.concept_id,
      option_strength: possibility.relation_strength,
      match_reasons: possibility.reasons
    }));
    if (type === "practical_steps") {
      base.answer_mode = "practical";
      base.next_steps = practicalStepsFromEvidence(base.evidence, nextSession.session_preferences.max_options);
    }

    return rememberPlan(nextSession, base);
  }

  function applyResponseControl(session, plan, control, data) {
    const protectedPlan = plan && ["risk_accompaniment", "ambiguous_risk_clarification"].includes(plan.type);
    const next = protectedPlan && ["reject_hypothesis", "other_route", "rephrase"].includes(control)
      ? structuredClone(session) : applyConversationControl(session, plan, control);
    // Safety content is not rewritten by an ordinary response control (S3).
    if (protectedPlan) {
      return rememberPlan(next, { ...structuredClone(plan), session_preferences: next.session_preferences });
    }
    if ((control === "other_route" ||
        (["no_questions", "one_option"].includes(control) && plan?.type === "clarifying_question")) && next.topic_query) {
      return buildResponsePlan(next.current_need || next.topic_query, next, data);
    }
    if (!plan || control === "reject_hypothesis") {
      const empty = planBase(plan && control === "reject_hypothesis" ? "correction_acknowledged" : "insufficient_information",
        INTENTS.CORRECTION, next, [], [], [], null, "normal", data);
      return rememberPlan(next, empty);
    }
    const revised = structuredClone(plan);
    revised.session_preferences = { ...next.session_preferences };
    revised.sabik_state = next.sabik_state;
    if (control === "shorter" && revised.type === "source_answer") revised.type = "direct_information";
    if (control === "one_option") {
      for (const field of ["fragments_used", "source_urls", "evidence", "match_evidence", "next_steps"]) {
        if (revised[field]) revised[field] = revised[field].slice(0, 1);
      }
      if (revised.decision) revised.decision.selected = revised.decision.selected.slice(0, 1);
    }
    if (control === "rephrase") {
      let changed = false;
      revised.evidence = (revised.evidence || []).map(item => {
        const fragment = (data.fragmentsIndex || []).find(f => f.id === item.fragment_id && isPublicable(f));
        const tokens = window.NEARetrieval.tokenizeSearchText(next.topic_query);
        const alternatives = sentenceCandidates(fragment?.text).filter(sentence =>
          sentence.slice(0, 280) !== item.relevant_text &&
          tokens.some(token => window.NEARetrieval.termMatches(normalizeText(sentence), token)));
        if (!alternatives.length) return item;
        changed = true;
        return { ...item, relevant_text: alternatives[(next.explanation_index - 1) % alternatives.length].slice(0, 280) };
      });
      revised.limits_notice = changed ? "Otro fragmento de la misma fuente." : "No tengo otra explicación respaldada por esta fuente.";
      if (revised.type === "practical_steps") revised.next_steps = practicalStepsFromEvidence(revised.evidence, next.session_preferences.max_options);
    }
    return rememberPlan(next, revised);
  }

  function renderControlledText(plan, options = {}) {
    const language = options.language || "es";
    return formulateApprovedResponse({
      intent: plan.intent,
      plan_type: plan.type,
      decision: plan.decision,
      selected_possibilities: plan.decision?.selected || [],
      concepts_used: plan.concepts_used || [],
      evidence: plan.evidence || [],
      source_urls: plan.source_urls || [],
      session_preferences: plan.session_preferences || {},
      cognitive_state: plan.sabik_state?.cognitive_state,
      protection_state: plan.sabik_state?.protection || "normal",
      language,
      question: plan.question,
      next_steps: plan.next_steps || []
    }).text;
  }

  window.NEAResponse = {
    classifyIntent,
    buildResponsePlan,
    applyResponseControl,
    renderControlledText
  };
})();
