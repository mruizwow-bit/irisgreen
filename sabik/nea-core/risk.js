(() => {
  const { normalizeText } = window.NEAKnowledge;

  function classifySafetyTurn(text) {
    const normalized = normalizeText(text);
    const clauses = String(text || "").split(/[.!?;\n]+|\bpero\b|\bsin embargo\b/iu).map(normalizeText);
    // Bounded grammar over the current utterance, never inherited concepts or
    // session state. Reported speech is not evidence about the speaker.
    const personal = clauses.filter(clause => !/\b(?:dice|dijo|dicen|ha dicho|pregunta)\b/u.test(clause));
    const selfHarm = /^(?:yo )?(?:(?:quiero|voy a|pienso|estoy pensando en) hacerme dano|me (?:quiero|voy a|pienso) hacer dano)(?: |$)/u;
    const selfCrisis = /^(?:yo )?(?:no quiero seguir viviendo|(?:tengo|estoy teniendo) pensamientos suicidas)(?: |$)/u;
    const risk = personal.some(clause => selfHarm.test(clause) || selfCrisis.test(clause));
    const uncertain = personal.some(clause => /^(?:yo )?ya no puedo mas(?: |$)/u.test(clause) || clause === "no quiero seguir");
    return {
      classification: risk ? "risk" : uncertain ? "uncertain" : "normal",
      answer: /^(?:si|yes)$/u.test(normalized) ? "affirmative"
        : /^(?:no|no estoy en peligro ni pensando en hacerme dano)$/u.test(normalized) ? "negative" : null,
      requests_human_help: personal.some(clause => /^(?:yo )?(?:quiero|necesito|ayudame a) (?:buscar |contactar con |hablar con )?(?:ayuda humana|una persona|alguien)(?: |$)/u.test(clause))
    };
  }

  function safetyEventsForTurn(turn, machine) {
    if (!["ready", "retrieving", "composing", "presenting", "awaiting_clarification"].includes(machine.operation)) return [];
    if (machine.safety === "human_handoff") return [];
    const pending = machine.safety === "uncertain" && machine.operation === "awaiting_clarification" && machine.dialogue === "clarification";
    const events = [];
    if (machine.safety !== "risk" && (turn.classification === "risk" || (pending && turn.answer === "affirmative"))) events.push("RISK_CONFIRMED");
    else if (machine.safety === "normal" && turn.classification === "uncertain") events.push("RISK_UNCERTAIN");
    else if (pending && turn.answer === "negative") events.push("RISK_CLEARED");
    if (turn.requests_human_help && !events.includes("RISK_CLEARED") &&
        (machine.safety !== "normal" || events.length)) events.push("HUMAN_HANDOFF");
    return events;
  }

  function riskStateFromSafety(machine) {
    if (machine.safety === "uncertain") return "riesgo_ambiguo";
    if (["risk", "human_handoff"].includes(machine.safety)) return "acompanamiento_en_riesgo";
    if (machine.safety === "normal") return "normal";
    throw new Error("Invalid S0 safety snapshot");
  }

  function detectRisk(text) {
    return riskStateFromSafety({ safety: classifySafetyTurn(text).classification });
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
    classifySafetyTurn,
    safetyEventsForTurn,
    riskStateFromSafety,
    detectRisk,
    createRiskAccompanimentPlan,
    createAmbiguousRiskPlan
  };
})();
