(() => {
  const { isPublicable, unique } = window.NEAKnowledge;
  const { INTENTS } = window.NEAIntent;

  function evidenceForConcept(concept, candidates) {
    return (candidates || [])
      .filter((candidate) => (candidate.fragment.concepts || []).includes(concept))
      .map((candidate) => ({
        fragment_id: candidate.fragment.id,
        source_url: candidate.fragment.url,
        match_strength: candidate.match_strength,
        match_reasons: candidate.match_reasons
      }));
  }

  function buildPossibility(concept, directConcepts, relationConcepts, candidates, session) {
    const direct = (directConcepts || []).includes(concept);
    const relation = (relationConcepts || []).includes(concept);
    const evidence = evidenceForConcept(concept, candidates);
    const evidenceStrength = evidence.reduce((max, item) => Math.max(max, item.match_strength), 0);
    const vetoed = (session?.vetoed_concepts || []).includes(concept);
    const rejected = (session?.rejected_concepts || []).includes(concept);
    const relation_strength =
      (direct ? 60 : 0) +
      (relation ? 35 : 0) +
      Math.min(evidenceStrength, 60);
    const reasons = unique([
      direct ? "direct_concept" : null,
      relation ? "editorial_relation" : null,
      evidenceStrength ? "evidence_match" : null,
      vetoed ? "vetoed_by_user" : null,
      rejected ? "rejected_by_user" : null
    ]);
    const source = direct ? "direct" : (relation ? "relation" : "retrieval");
    return {
      concept_id: concept,
      relation_strength,
      reasons,
      contradicted: vetoed || rejected,
      evidence,
      source
    };
  }

  function buildPossibilities(conceptIds, directConcepts, relationConcepts, candidates, session) {
    const candidateConcepts = (candidates || [])
      .flatMap((candidate) => candidate.fragment.concepts || []);
    return unique([...(conceptIds || []), ...candidateConcepts])
      .map((concept) => buildPossibility(concept, directConcepts, relationConcepts, candidates, session))
      .sort((a, b) => b.relation_strength - a.relation_strength || String(a.concept_id).localeCompare(String(b.concept_id)));
  }

  function findDiscriminatingQuestion(options, questions, session) {
    const preferences = session?.session_preferences || {};
    if (preferences.question_policy === "none" || preferences.max_options === 1 ||
        session?.rejected_response_types?.includes("clarifying_question")) return null;
    const gap = preferences.question_threshold === "high" ? 10 : 25;
    return (questions || [])
      .filter(isPublicable)
      .find((question) => {
        if (session?.asked_questions?.includes(question.id)) return false;
        const left = options.find((option) => option.concept_id === question.concept_a);
        const right = options.find((option) => option.concept_id === question.concept_b);
        if (!left || !right) return false;
        return Math.abs(left.relation_strength - right.relation_strength) <= gap;
      }) || null;
  }

  function decideCore({ intent, conceptIds, directConcepts, relationConcepts, candidates, questions, session, riskState }) {
    if (riskState && riskState !== "normal") {
      return {
        possibilities: [],
        selected: [],
        discarded: [],
        decision: "accompany",
        question_id: null,
        reason: "risk_priority"
      };
    }

    if (intent === INTENTS.ACCOMPANIMENT) {
      return {
        possibilities: [],
        selected: [],
        discarded: [],
        decision: "accompany",
        question_id: null,
        reason: "accompaniment_requested"
      };
    }

    const possibilities = buildPossibilities(conceptIds, directConcepts, relationConcepts, candidates, session);
    const discarded = possibilities.filter((possibility) => possibility.contradicted);
    const viable = possibilities.filter((possibility) => !possibility.contradicted && possibility.evidence.length);

    if (!(conceptIds || []).length && (candidates || []).length) {
      return {
        possibilities,
        selected: [],
        discarded,
        decision: "respond",
        question_id: null,
        reason: "lexical_evidence"
      };
    }

    if (intent === INTENTS.CORRECTION) {
      return {
        possibilities,
        selected: viable.slice(0, 1),
        discarded,
        decision: "respond",
        question_id: null,
        reason: "explicit_correction"
      };
    }

    if (!viable.length && (candidates || []).length) {
      return {
        possibilities,
        selected: [],
        discarded,
        decision: intent === INTENTS.PRACTICAL_REQUEST ? "offer" : "respond",
        question_id: null,
        reason: "lexical_evidence"
      };
    }

    if (!viable.length) {
      return {
        possibilities,
        selected: [],
        discarded,
        decision: "insufficient",
        question_id: null,
        reason: "no_supported_possibilities"
      };
    }

    if (intent === INTENTS.PERSONAL_SITUATION) {
      const question = findDiscriminatingQuestion(viable, questions, session);
      if (question) {
        return {
          possibilities,
          selected: viable.slice(0, 2),
          discarded,
          decision: "ask",
          question_id: question.id || null,
          reason: "close_supported_possibilities"
        };
      }
    }

    return {
      possibilities,
      selected: viable.slice(0, 1),
      discarded,
      decision: intent === INTENTS.PRACTICAL_REQUEST ? "offer" : "respond",
      question_id: null,
      reason: "dominant_relation"
    };
  }

  window.NEADecision = {
    buildPossibilities,
    decideCore
  };
})();
