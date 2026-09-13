(() => {
  function applySpanishOutputGuard(text) {
    const substitutions = [
      [/\bpara vos\b/gi, "para ti"],
      [/\bde vos\b/gi, "de ti"],
      [/\bcon vos\b/gi, "contigo"],
      [/\bsin vos\b/gi, "sin ti"],
      [/\ba vos\b/gi, "a ti"],
      [/\bpor vos\b/gi, "por ti"],
      [/\bvos\b/gi, "tú"],
      [/\btenés\b/gi, "tienes"],
      [/\btenes\b/gi, "tienes"],
      [/\bsabés\b/gi, "sabes"],
      [/\bsabes\b/gi, "sabes"],
      [/\bquerés\b/gi, "quieres"],
      [/\bqueres\b/gi, "quieres"],
      [/\bpodés\b/gi, "puedes"],
      [/\bpodes\b/gi, "puedes"],
      [/\bvenís\b/gi, "vienes"],
      [/\bvenis\b/gi, "vienes"],
      [/\bvivís\b/gi, "vives"],
      [/\bvivis\b/gi, "vives"],
      [/\bhacés\b/gi, "haces"],
      [/\bhaces\b/gi, "haces"],
      [/\bdecís\b/gi, "dices"],
      [/\bdecis\b/gi, "dices"],
      [/\bsalís\b/gi, "sales"],
      [/\bsalis\b/gi, "sales"],
      [/\bescribís\b/gi, "escribes"],
      [/\bescribis\b/gi, "escribes"],
      [/\bentendés\b/gi, "entiendes"],
      [/\bentendes\b/gi, "entiendes"],
      [/\bnecesitás\b/gi, "necesitas"],
      [/\busás\b/gi, "usas"],
      [/\busas\b/gi, "usas"],
      [/\bpensás\b/gi, "piensas"],
      [/\bpensas\b/gi, "piensas"],
      [/\bsentís\b/gi, "sientes"],
      [/\bsentis\b/gi, "sientes"],
      [/\bsos\b/gi, "eres"]
    ];
    return substitutions.reduce(
      (current, [pattern, replacement]) => current.replace(pattern, replacement),
      String(text || "")
    );
  }

  function applyOutputLanguageGuard(text, language = "es") {
    if (language !== "es") return String(text || "");
    return applySpanishOutputGuard(text);
  }

  function cleanSentence(text) {
    return String(text || "")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .trim();
  }

  function firstEvidenceText(evidence) {
    return cleanSentence((evidence || [])[0]?.relevant_text || "");
  }

  function firstSource(sourceUrls) {
    return cleanSentence((sourceUrls || [])[0] || "");
  }

  function paragraphList(paragraphs) {
    return paragraphs.map(cleanSentence).filter(Boolean);
  }

  function styleForPayload(payload) {
    const styles = ["nea_language_v6"];
    const preferences = payload.session_preferences || {};
    if (preferences.response_length === "short") styles.push("short_preference");
    if (payload.cognitive_state === "Sobrecarga") styles.push("overload_brevity");
    if (payload.protection_state && payload.protection_state !== "normal") styles.push("protection_first");
    return styles;
  }

  function limitParagraphs(paragraphs, payload) {
    const preferences = payload.session_preferences || {};
    if (payload.cognitive_state === "Sobrecarga") return paragraphList(paragraphs).slice(0, 2);
    if (preferences.response_length === "short") return paragraphList(paragraphs).slice(0, 2);
    return paragraphList(paragraphs);
  }

  function withSource(paragraphs, sourceUrls) {
    const source = firstSource(sourceUrls);
    if (!source) return paragraphs;
    return [...paragraphs, `Fuente: ${source}`];
  }

  function formulatePassthrough(payload) {
    const evidenceText = firstEvidenceText(payload.evidence);
    if (evidenceText) return [evidenceText];

    const nextStep = cleanSentence((payload.next_steps || [])[0] || "");
    if (nextStep) return [nextStep];

    const question = cleanSentence(payload.question || "");
    if (question) return [question];

    return [];
  }

  function formulateSpanish(payload) {
    const type = payload.plan_type || payload.type;
    const evidenceText = firstEvidenceText(payload.evidence);
    const sourceUrls = payload.source_urls || [];

    if (type === "risk_accompaniment") {
      return [
        "Esto necesita ayuda humana ahora.",
        "Si hay peligro inmediato, busca emergencias o una persona cercana que pueda estar contigo. Si no quieres llamar ahora, podemos quedarnos aquí y buscar una opción más segura contigo."
      ];
    }

    if (type === "ambiguous_risk_clarification") {
      return ["Cuando dices eso, necesito comprobar una cosa para cuidar tu seguridad: ¿estás en peligro ahora mismo o pensando en hacerte daño?"];
    }

    if (type === "correction_acknowledged") {
      return [
        "Entendido. Retiro esa vía.",
        "Probamos otra sin defender la anterior."
      ];
    }

    if (type === "accompaniment_presence") {
      return [
        "Estoy aquí.",
        "No hace falta ordenar todo ahora."
      ];
    }

    if (type === "clarifying_question") {
      if (payload.cognitive_state === "Sobrecarga") {
        return [
          "Ahora no te hago preguntas.",
          "Me quedo aquí con una versión pequeña y podemos ajustar después."
        ];
      }
      return [payload.question || "Necesito una sola aclaración para no equivocarme de camino."];
    }

    if (type === "practical_steps") {
      const steps = (payload.next_steps || []).slice(0, Math.max(1, payload.session_preferences?.max_options || 1));
      const base = steps.length
        ? `Podemos empezar por esto: ${cleanSentence(steps[0])}`
        : "Podemos empezar por una acción pequeña y reversible.";
      return withSource([base], sourceUrls);
    }

    if (type === "source_answer") {
      const base = evidenceText
        ? `Una posibilidad es que esto se relacione con algo que Iris Green describe así: ${evidenceText}`
        : "Una posibilidad existe, pero ahora no tengo suficiente fragmento publicado para explicarla con seguridad.";
      return withSource([base], sourceUrls);
    }

    if (type === "direct_information") {
      const base = evidenceText || "No tengo información suficiente en Iris Green para responder con seguridad.";
      return evidenceText ? withSource([base], sourceUrls) : [base];
    }

    return ["No tengo información suficiente en Iris Green para responder con seguridad."];
  }

  function formulateApprovedResponse(payload = {}) {
    const language = payload.language || "es";
    const rawParagraphs = language === "es"
      ? formulateSpanish(payload)
      : formulatePassthrough(payload);
    const paragraphs = limitParagraphs(rawParagraphs, payload);
    const guarded = paragraphs.map((paragraph) => applyOutputLanguageGuard(paragraph, language));
    return {
      text: guarded.join("\n\n"),
      paragraphs: guarded,
      style_applied: styleForPayload(payload),
      source_urls: payload.source_urls || []
    };
  }

  window.NEALanguage = {
    applySpanishOutputGuard,
    applyOutputLanguageGuard,
    formulateApprovedResponse
  };
})();
