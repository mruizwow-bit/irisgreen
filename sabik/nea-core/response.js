(() => {
  const { normalizeText, isPublicable, unique } = window.NEAKnowledge;
  const { detectNegations, detectSessionPreferences } = window.NEACorrections;
  const { applySessionUpdate } = window.NEASession;
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

  function sessionForRetrieval(session, intent, directConcepts) {
    if (intent !== INTENTS.INFORMATION_REQUEST) return session;
    const reopened = new Set(directConcepts || []);
    if (!reopened.size) return session;
    return {
      ...session,
      vetoed_concepts: (session.vetoed_concepts || []).filter((concept) => !reopened.has(concept))
    };
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
    const intent = classifyIntent(text);
    const directConcepts = detectConcepts(text, data);
    const relationConcepts = detectRelations(text, data);
    const negatedIds = detectNegations(text, data);
    const preferences = detectSessionPreferences(text);
    const conceptIds = unique([...directConcepts, ...relationConcepts]).filter((id) => !session.vetoed_concepts.includes(id) && !negatedIds.includes(id));
    const riskState = detectRisk(text, unique([...conceptIds, ...directConcepts]), data);
    const cognitiveState = detectCognitiveState(text, preferences, riskState);
    const nextSession = applySessionUpdate(session, text, conceptIds, negatedIds, preferences, riskState, cognitiveState);

    if (riskState === "acompanamiento_en_riesgo") {
      return {
        session: nextSession,
        plan: createRiskAccompanimentPlan(nextSession, conceptIds, findActions(["riesgo_suicida"], riskState, data))
      };
    }

    if (riskState === "riesgo_ambiguo") {
      return {
        session: nextSession,
        plan: createAmbiguousRiskPlan(nextSession)
      };
    }

    if (intent === INTENTS.CORRECTION) {
      const correctionCandidates = selectBestCandidates(
        retrieveFragmentCandidates(text, directConcepts, relationConcepts, data, nextSession),
        nextSession.session_preferences.max_options
      );
      const correctionFragments = correctionCandidates.map((candidate) => candidate.fragment);
      return {
        session: nextSession,
        plan: {
          ...planBase("correction_acknowledged", intent, nextSession, conceptIds, correctionFragments, correctionCandidates, null, riskState, data),
          removed_or_vetoed: negatedIds,
          communication_open: true,
          limits_notice: null
        }
      };
    }

    if (intent === INTENTS.ACCOMPANIMENT) {
      return {
        session: nextSession,
        plan: {
          ...planBase("accompaniment_presence", intent, nextSession, conceptIds, [], [], null, riskState, data),
          communication_open: true,
          search_required: false,
          limits_notice: null
        }
      };
    }

    const decisionSession = sessionForRetrieval(nextSession, intent, directConcepts);
    const candidates = selectBestCandidates(
      retrieveFragmentCandidates(text, directConcepts, relationConcepts, data, decisionSession),
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

    return {
      session: nextSession,
      plan: base
    };
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
    renderControlledText
  };
})();
