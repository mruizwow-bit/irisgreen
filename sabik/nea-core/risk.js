(() => {
  const { normalizeText } = window.NEAKnowledge;

  function detectRisk(text, conceptIds, data) {
    const concepts = new Map((data.concepts || []).map((concept) => [concept.id, concept]));
    const hasCrisisConcept = conceptIds.some((id) => concepts.get(id)?.risk_level === "crisis");
    const normalized = normalizeText(text);
    const explicitNegatedCrisis = [
      "no quiero hacerme dano",
      "no voy a hacerme dano"
    ].some((phrase) => normalized.includes(phrase));
    const explicitOtherCrisis = [
      "pensamientos suicidas",
      "no quiero seguir viviendo"
    ].some((phrase) => normalized.includes(phrase));
    const explicitSelfHarm = normalized.includes("quiero hacerme dano") && !explicitNegatedCrisis;
    const explicitCrisis = explicitOtherCrisis || explicitSelfHarm;
    if (explicitCrisis) return "acompanamiento_en_riesgo";
    if (explicitNegatedCrisis) return "normal";
    if (hasCrisisConcept) return "acompanamiento_en_riesgo";
    if (normalized.includes("ya no puedo mas") || normalized === "no quiero seguir") return "riesgo_ambiguo";
    return "normal";
  }

  function createRiskAccompanimentPlan(nextSession, conceptIds, actions) {
    return {
      type: "risk_accompaniment",
      concepts_used: window.NEAKnowledge.unique([...conceptIds, "riesgo_suicida"]),
      fragments_used: [],
      source_urls: [],
      question: null,
      actions,
      sabik_state: nextSession.sabik_state,
      communication_open: true,
      normal_flow_disabled: true,
      can_stay_here: true,
      privacy_notice: "No envio esta conversacion fuera del navegador.",
      limits_notice: "No diagnostico ni actuo por ti. Puedo ayudarte a buscar ayuda humana."
    };
  }

  function createAmbiguousRiskPlan(nextSession) {
    return {
      type: "ambiguous_risk_clarification",
      concepts_used: [],
      fragments_used: [],
      source_urls: [],
      question: "Cuando dices eso, necesito comprobar una cosa para cuidar tu seguridad: estas en peligro ahora mismo o pensando en hacerte dano?",
      actions: [],
      sabik_state: nextSession.sabik_state,
      communication_open: true,
      normal_flow_disabled: true,
      can_stay_here: true,
      privacy_notice: "No envio esta conversacion fuera del navegador.",
      limits_notice: "No diagnostico ni asumo una crisis. Necesito una aclaracion breve para priorizar seguridad."
    };
  }

  window.NEARisk = {
    detectRisk,
    createRiskAccompanimentPlan,
    createAmbiguousRiskPlan
  };
})();
