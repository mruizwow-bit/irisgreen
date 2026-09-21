(() => {
  const { normalizeText } = window.NEAKnowledge;

  const currentTime = "(?:ahora(?: mismo)?|hoy|en este momento)";
  const firstPerson = `^(?:${currentTime} )?(?:yo )?`;
  const currentEnd = `(?: ${currentTime})?$`;
  const selfHarm = new RegExp(firstPerson + "(?:(?:quiero|voy a|pienso(?: en)?|estoy pensando en) hacerme dano|me (?:quiero|voy a|pienso) hacer dano|me (?:autolesiono|estoy autolesionando))" + currentEnd, "u");
  const selfCrisis = new RegExp(firstPerson + "(?:no quiero seguir viviendo|(?:quiero|deseo) morir(?:me)?|me (?:quiero|deseo) morir|(?:tengo|estoy teniendo) pensamientos suicidas)" + currentEnd, "u");
  const doubt = new RegExp(firstPerson + "(?:no se|dudo) si (?:puedo|quiero) (?:seguir|continuar)(?: asi)?" + currentEnd, "u");
  const denial = new RegExp(firstPerson + "(?:no (?:quiero hacerme dano|me quiero hacer dano|tengo pensamientos suicidas|estoy en peligro))(?: |$)", "u");
  const thirdPerson = "(?:(?:mi|un|una) (?:amig[oa]|hij[oa]|familiar|herman[oa]|pareja|madre|padre)|el|ella)";
  const thirdRisk = new RegExp(`^(?:${currentTime} )?${thirdPerson} (?:${currentTime} )?(?:(?:me |nos )?(?:dice|explica|afirma) que )?` +
    "(?:(?:quiere|va a|piensa(?: en)?|esta pensando en) hacerse dano|se (?:quiere|va a|piensa) hacer dano|se (?:autolesiona|esta autolesionando)|(?:quiere|desea) morir(?:se)?|se (?:quiere|desea) morir|no quiere seguir viviendo|tiene pensamientos suicidas)" + currentEnd, "u");
  const affirmativeReservation = /^(?:si|yes) (?:pero|aunque) (?:(?:ahora )?no (?:quiero|puedo)|prefiero no) (?:hablar|explicarlo|contarlo)(?: (?:de|sobre) (?:eso|ello|el tema))?(?: ahora)?$/u;

  function classifySafetyTurn(text) {
    const normalized = normalizeText(text);
    // Mask quotations before splitting clauses: punctuation inside a quote must
    // never create an apparently first-person statement outside it.
    const unquoted = String(text || "").replace(/"[^"\n]*"|'[^'\n]*'|«[^»]*»|“[^”]*”|‘[^’]*’|`[^`]*`/gu, " quoted ");
    const clauses = unquoted.split(/[.!?;\n]+|\bpero\b|\bsin embargo\b|\by (?=(?:yo|mi|un|una|el|ella|me|quiero|voy|pienso|dudo)\b|no (?:se si|quiero seguir)\b|ya no puedo\b)/iu).map(normalizeText);
    // Present-tense predicates, not keywords or inherited session concepts.
    const personal = clauses.filter(clause => !/\b(?:dice|dijo|dicen|ha dicho|pregunta)\b/u.test(clause));
    const self = personal.some(clause => selfHarm.test(clause) || selfCrisis.test(clause));
    const third = clauses.some(clause => thirdRisk.test(clause));
    const uncertainty = personal.some(clause => doubt.test(clause)) && !personal.some(clause => denial.test(clause));
    // Keep the pre-existing exhaustion rule; task-qualified exhaustion remains
    // an unresolved editorial [E] decision, not new R2 acceptance coverage.
    const legacyUncertain = personal.some(clause => /^(?:yo )?ya no puedo mas(?: |$)/u.test(clause) || clause === "no quiero seguir");
    const uncertain = uncertainty || legacyUncertain;
    return {
      classification: self || third ? "risk" : uncertain ? "uncertain" : "normal",
      subject: self ? "self" : third ? "third_person" : uncertain ? "self"
        : unquoted !== String(text || "") ? "quoted" : "none",
      answer: /^(?:si|yes)$/u.test(normalized) || affirmativeReservation.test(normalized) ? "affirmative"
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
