(() => {
  const { COGNITIVE_STATES } = window.NEACoreState;
  const { normalizeText, isPublicable, unique } = window.NEAKnowledge;
  const { conceptTerms } = window.NEACorrections;
  const STOP_WORDS = new Set([
    "a", "al", "algo", "ante", "asi", "cada", "como", "con", "contra", "cual", "cuando",
    "de", "del", "desde", "donde", "dos", "el", "ella", "ellos", "en", "entre", "era",
    "es", "esa", "ese", "eso", "esta", "este", "esto", "ha", "hay", "la", "las", "le",
    "les", "lo", "los", "mas", "me", "mi", "mis", "muy", "no", "o", "para", "pero",
    "depende", "por", "que", "se", "si", "sin", "son", "su", "sus", "te", "ti", "tu", "tus",
    "un", "una", "uno", "y", "ya"
  ]);
  const MIN_MATCH_STRENGTH = 18;

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function termMatches(normalizedText, term) {
    const normalizedTerm = normalizeText(term);
    if (!normalizedTerm) return false;
    const pattern = new RegExp(`(^|\\s)${escapeRegExp(normalizedTerm)}($|\\s)`, "u");
    return pattern.test(normalizedText);
  }

  function tokenizeSearchText(text) {
    return unique(normalizeText(text)
      .split(" ")
      .filter((term) => term.length >= 3 && !STOP_WORDS.has(term)));
  }

  function phraseMatches(normalizedText, phrase) {
    const normalizedPhrase = normalizeText(phrase);
    if (!normalizedPhrase || normalizedPhrase.length < 6) return false;
    return termMatches(normalizedText, normalizedPhrase);
  }

  function detectConcepts(text, data) {
    const normalized = normalizeText(text);
    return (data.concepts || [])
      .filter(isPublicable)
      .filter((concept) => conceptTerms(concept).some((term) => termMatches(normalized, term)))
      .map((concept) => concept.id);
  }

  function detectRelations(text, data) {
    const normalized = normalizeText(text);
    return (data.relations || [])
      .filter(isPublicable)
      .filter((relation) => {
        const from = normalizeText(relation.from);
        return from && termMatches(normalized, from);
      })
      .map((relation) => relation.to);
  }

  function detectCognitiveState(text, preferences, riskState) {
    const normalized = normalizeText(text);
    if (riskState !== "normal") return COGNITIVE_STATES.SOBRECARGA;
    if (
      normalized.includes("no puedo pensar") ||
      normalized.includes("estoy saturad") ||
      normalized.includes("sobrecarga")
    ) {
      return COGNITIVE_STATES.SOBRECARGA;
    }
    if (normalized.includes("profundiza") || normalized.includes("quiero entender") || normalized.includes("a fondo")) {
      return COGNITIVE_STATES.HIPERFOCO;
    }
    if (normalized.includes("no se que siento") || normalized.includes("necesito poner palabras")) {
      return COGNITIVE_STATES.VOZ_INTERIOR;
    }
    if (normalized.includes("acompaname") || normalized.includes("quedate")) {
      return COGNITIVE_STATES.VINCULO;
    }
    if (normalized.includes("idea") || normalized.includes("crear") || normalized.includes("imagin")) {
      return COGNITIVE_STATES.CREATIVIDAD;
    }
    return COGNITIVE_STATES.NUCLEO_BASE;
  }

  function findFragments(conceptIds, data) {
    const wanted = new Set(conceptIds);
    return (data.fragmentsIndex || [])
      .filter(isPublicable)
      .filter((fragment) => (fragment.concepts || []).some((concept) => wanted.has(concept)));
  }

  function fragmentHasVetoedConcept(fragment, session) {
    const vetoed = new Set([...(session?.vetoed_concepts || []), ...(session?.rejected_concepts || [])]);
    return (fragment.concepts || []).some((concept) => vetoed.has(concept));
  }

  function scoreFragmentLexically(fragment, text, directConceptIds, relationConceptIds) {
    const query = normalizeText(text);
    const tokens = tokenizeSearchText(text);
    const title = normalizeText(fragment.title);
    const heading = normalizeText(fragment.heading);
    const body = normalizeText(fragment.text);
    const concepts = new Set(fragment.concepts || []);
    const directConcepts = new Set(directConceptIds || []);
    const relationConcepts = new Set(relationConceptIds || []);
    const reasons = new Set();
    const matchedTokens = new Set();
    let strength = 0;

    if (query && phraseMatches(title, query)) {
      strength += 90;
      reasons.add("exact_phrase");
      reasons.add("title_match");
    }
    if (query && phraseMatches(heading, query)) {
      strength += 80;
      reasons.add("exact_phrase");
      reasons.add("heading_match");
    }
    if (query && phraseMatches(body, query)) {
      strength += 45;
      reasons.add("exact_phrase");
      reasons.add("body_match");
    }

    const directOverlap = [...directConcepts].filter((concept) => concepts.has(concept)).length;
    const relationOverlap = [...relationConcepts].filter((concept) => concepts.has(concept)).length;
    if (directOverlap) {
      strength += directOverlap * 50;
      reasons.add("direct_concept");
    }
    if (relationOverlap) {
      strength += relationOverlap * 25;
      reasons.add("editorial_relation");
    }

    tokens.forEach((token) => {
      if (termMatches(title, token)) {
        strength += 16;
        reasons.add("title_match");
        matchedTokens.add(token);
      }
      if (termMatches(heading, token)) {
        strength += 13;
        reasons.add("heading_match");
        matchedTokens.add(token);
      }
      if (termMatches(body, token)) {
        strength += token.length >= 8 ? 8 : 4;
        reasons.add("body_match");
        matchedTokens.add(token);
      }
    });

    if (tokens.length && matchedTokens.size >= 2 && matchedTokens.size / tokens.length >= 0.5) {
      strength += 40;
      reasons.add("token_coverage");
    }

    return {
      fragment,
      match_strength: strength,
      match_reasons: [...reasons]
    };
  }

  function retrieveFragmentCandidates(text, directConceptIds, relationConceptIds, data, session) {
    const conceptIds = unique([...(directConceptIds || []), ...(relationConceptIds || [])]);
    return (data.fragmentsIndex || [])
      .filter(isPublicable)
      .filter((fragment) => !fragmentHasVetoedConcept(fragment, session))
      .filter((fragment) => !(session?.rejected_fragments || []).includes(fragment.id))
      .map((fragment) => scoreFragmentLexically(fragment, text, directConceptIds, relationConceptIds))
      .filter((candidate) => candidate.match_strength >= MIN_MATCH_STRENGTH || (fragmentMatchesConcept(candidate.fragment, conceptIds)));
  }

  function fragmentMatchesConcept(fragment, conceptIds) {
    const wanted = new Set(conceptIds);
    return (fragment.concepts || []).some((concept) => wanted.has(concept));
  }

  function conceptSlugs(conceptIds, data) {
    const concepts = new Map((data.concepts || []).map((concept) => [concept.id, concept]));
    return conceptIds.flatMap((id) => {
      const concept = concepts.get(id);
      return unique([
        id.replace(/_/g, "-"),
        concept?.label,
        ...(concept?.aliases || [])
      ])
        .map((value) => normalizeText(value).replace(/\s+/g, "-"))
        .filter(Boolean);
    });
  }

  function selectBestFragments(fragments, conceptIds, data, maxCount = 3) {
    const slugs = conceptSlugs(conceptIds, data);
    const concepts = new Set(conceptIds);
    const scored = fragments.map((fragment, index) => {
      const haystack = normalizeText([fragment.title, fragment.heading, fragment.text].join(" "));
      const url = fragment.url || "";
      const overlap = (fragment.concepts || []).filter((concept) => concepts.has(concept)).length;
      const slugScore = slugs.some((slug) => url.includes(slug)) ? 100 : 0;
      const titleScore = slugs.some((slug) => normalizeText(fragment.title).replace(/\s+/g, "-").includes(slug)) ? 50 : 0;
      const headingScore = slugs.some((slug) => normalizeText(fragment.heading).replace(/\s+/g, "-").includes(slug)) ? 30 : 0;
      const textScore = slugs.some((slug) => haystack.includes(slug.replace(/-/g, " "))) ? 10 : 0;
      const sourceScore = fragment.source_type === "meta_description" ? 8 : 0;
      return {
        fragment,
        index,
        score: slugScore + titleScore + headingScore + textScore + sourceScore + overlap
      };
    });

    const selected = [];
    const seenUrls = new Set();
    scored
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .forEach(({ fragment }) => {
        if (selected.length >= maxCount) return;
        if (seenUrls.has(fragment.url)) return;
        seenUrls.add(fragment.url);
        selected.push(fragment);
      });

    return selected;
  }

  function selectBestCandidates(candidates, maxCount = 3) {
    const selected = [];
    const seenUrls = new Set();
    candidates
      .sort((a, b) => b.match_strength - a.match_strength || String(a.fragment.id).localeCompare(String(b.fragment.id)))
      .forEach((candidate) => {
        if (selected.length >= maxCount) return;
        if (seenUrls.has(candidate.fragment.url)) return;
        seenUrls.add(candidate.fragment.url);
        selected.push(candidate);
      });
    return selected;
  }

  function findActions(conceptIds, riskState, data) {
    const wanted = new Set(conceptIds);
    return (data.actions || [])
      .filter(isPublicable)
      .filter((action) => {
        if (riskState === "acompanamiento_en_riesgo") return action.risk_level === "crisis";
        return (action.concepts || []).some((concept) => wanted.has(concept)) || action.id === "ver_fuente";
      });
  }

  function findQuestion(conceptIds, riskState, data) {
    if (riskState !== "normal") return null;
    const wanted = new Set(conceptIds);
    return (data.questions || [])
      .filter(isPublicable)
      .find((question) => wanted.has(question.concept_a) || wanted.has(question.concept_b)) || null;
  }

  window.NEARetrieval = {
    termMatches,
    tokenizeSearchText,
    detectConcepts,
    detectRelations,
    detectCognitiveState,
    findFragments,
    retrieveFragmentCandidates,
    selectBestFragments,
    selectBestCandidates,
    findActions,
    findQuestion
  };
})();
