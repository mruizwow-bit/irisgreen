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

  function classifyIntent(text) {
    const normalized = normalizeText(text);
    if (!normalized) return INTENTS.INFORMATION_REQUEST;

    if (
      startsWithAny(normalized, ["no es", "no era", "no quiero eso", "no me referia", "no hablo de"]) ||
      includesAny(normalized, [" no es ", " no era ", "corrijo", "me explique mal"])
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
