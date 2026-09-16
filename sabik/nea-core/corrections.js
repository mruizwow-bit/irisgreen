(() => {
  const { normalizeText, isPublicable, unique } = window.NEAKnowledge;

  function conceptTerms(concept) {
    return unique([concept.id, concept.label, ...(concept.aliases || [])]).map(normalizeText);
  }

  function detectNegations(text, data) {
    const normalized = normalizeText(text);
    const negationMarkers = ["no es", "no me molesta", "no es el", "no es la", "no quiero"];
    const concepts = (data.concepts || []).filter(isPublicable);
    return concepts
      .filter((concept) => conceptTerms(concept).some((term) =>
        negationMarkers.some((marker) => normalized.includes(`${marker} ${term}`))
      ))
      .map((concept) => concept.id);
  }

  function detectSessionPreferences(text) {
    const normalized = normalizeText(text);
    const preferences = {};
    if (normalized.includes("menos texto") || normalized.includes("dame menos texto")) {
      preferences.response_length = "short";
    }
    if (normalized.includes("una sola opcion") || normalized.includes("dame una sola opcion")) {
      preferences.max_options = 1;
    }
    if (normalized.includes("no me preguntes")) {
      preferences.question_threshold = "high";
    }
    return preferences;
  }

  window.NEACorrections = {
    conceptTerms,
    detectNegations,
    detectSessionPreferences
  };
})();
