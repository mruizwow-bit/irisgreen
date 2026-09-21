(() => {
  const { normalizeText, isPublicable, unique } = window.NEAKnowledge;

  function conceptTerms(concept) {
    return unique([concept.id, concept.label, ...(concept.aliases || [])]).map(normalizeText);
  }

  function detectNegations(text, data) {
    const normalized = normalizeText(text);
    const concepts = (data.concepts || []).filter(isPublicable);
    return concepts
      .filter((concept) => conceptTerms(concept).some((term) => {
        if (!term) return false;
        // Normalized terms contain only letters/numbers/spaces. Match both
        // word orders, with an optional article, without negating a substring.
        const before = new RegExp(`(?:^| )no (?:es|era|me molesta|quiero hablar de|tiene nada que ver con)(?: el| la| los| las)? ${term}(?: |$)`, "u");
        const after = new RegExp(`(?:^| )${term} no(?: me (?:molesta|molestan|afecta)| es el problema| lo que)(?: |$)`, "u");
        return before.test(normalized) || after.test(normalized);
      }))
      .map((concept) => concept.id);
  }

  function detectSessionPreferences(text) {
    const normalized = normalizeText(text);
    const preferences = {};
    if (normalized.includes("menos texto") || normalized === "mas corto") {
      preferences.response_length = "short";
    }
    if (normalized.includes("una sola opcion") || normalized === "dame una opcion") {
      preferences.max_options = 1;
    }
    if (normalized.includes("no me preguntes")) {
      preferences.question_threshold = "high";
      preferences.question_policy = "none";
    }
    return preferences;
  }

  function detectConversationControl(text) {
    const controls = {
      "no es esto": "reject_hypothesis",
      "buscar por otra via": "other_route",
      "explicamelo de otra forma": "rephrase",
      "no me preguntes": "no_questions",
      "dame una opcion": "one_option",
      "dame una sola opcion": "one_option",
      "mas corto": "shorter"
    };
    controls["explicamelo mas corto"] = "shorter";
    controls["no es eso"] = "reject_hypothesis";
    return controls[normalizeText(text)] || null;
  }

  window.NEACorrections = {
    conceptTerms,
    detectNegations,
    detectConversationControl,
    detectSessionPreferences
  };
})();
