(() => {
  const { normalizeText } = window.NEAKnowledge;

  const INTENTS = {
    INFORMATION_REQUEST: "information_request",
    PERSONAL_SITUATION: "personal_situation",
    CORRECTION: "correction",
    PRACTICAL_REQUEST: "practical_request",
    ACCOMPANIMENT: "accompaniment"
  };

  function startsWithAny(normalized, prefixes) {
    return prefixes.some((prefix) => normalized.startsWith(prefix));
  }

  function includesAny(normalized, terms) {
    return terms.some((term) => normalized.includes(term));
  }

  function classifyIntent(text, session, negatedIds = []) {
    const normalized = normalizeText(text);
    if (!normalized) return INTENTS.INFORMATION_REQUEST;

    if (
      startsWithAny(normalized, ["no me referia", "corrijo", "me explique mal"]) ||
      /\bno (?:es|era) (?:el|la|los|las) .+ (?:es|sino) /u.test(normalized) ||
      (session?.last_plan && (
        startsWithAny(normalized, ["no quiero eso", "no es esto", "no era eso", "no hablo de"]) ||
        negatedIds.some(id => (session.last_plan.concepts_used || []).includes(id))
      ))
    ) {
      return INTENTS.CORRECTION;
    }

    if (
      startsWithAny(normalized, ["que es", "que son", "que significa", "explicame", "define", "dime que es"]) ||
      includesAny(normalized, ["informacion sobre", "saber que es", "quiero entender que es"])
    ) {
      return INTENTS.INFORMATION_REQUEST;
    }

    if (
      includesAny(normalized, ["necesito prepararme", "como preparo", "como puedo preparar", "ayudame a preparar", "pasos para"])
    ) {
      return INTENTS.PRACTICAL_REQUEST;
    }

    if (
      includesAny(normalized, ["acompaname", "quedate conmigo", "puedes quedarte", "necesito que estes"])
    ) {
      return INTENTS.ACCOMPANIMENT;
    }

    return INTENTS.PERSONAL_SITUATION;
  }

  window.NEAIntent = {
    INTENTS,
    classifyIntent
  };
})();
