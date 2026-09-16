(() => {
  const {
    COGNITIVE_STATES,
    FUNCTIONAL_STATES,
    VISUAL_MODES,
    MOTION_LEVELS,
    INTERACTION_STATES,
    RESPONSE_MODES,
    PROTECTION_STATES,
    PRESENCE_STATES
  } = window.NEACoreState;

  function defaultSabikState() {
    return {
      cognitive_state: COGNITIVE_STATES.NUCLEO_BASE,
      functional_state: FUNCTIONAL_STATES.AVAILABLE,
      visual_mode: VISUAL_MODES.ABSTRACTA,
      motion_level: MOTION_LEVELS.LOW,
      low_intensity: false,
      interaction: INTERACTION_STATES.BASE,
      mode: RESPONSE_MODES.BUSQUEDA,
      stimulation: "normal",
      memory: "session",
      protection: PROTECTION_STATES.NORMAL,
      visual_presence: PRESENCE_STATES.VISIBLE
    };
  }

  function sabikStateFromLayers(cognitiveState, riskState, preferences) {
    const isRisk = riskState !== "normal";
    const isLowDemand = cognitiveState === COGNITIVE_STATES.SOBRECARGA || preferences.response_length === "short";
    const state = defaultSabikState();
    state.cognitive_state = cognitiveState;
    state.functional_state = isRisk ? FUNCTIONAL_STATES.LISTENING : FUNCTIONAL_STATES.AVAILABLE;
    state.motion_level = isLowDemand ? MOTION_LEVELS.OFF : MOTION_LEVELS.LOW;
    state.low_intensity = isLowDemand;
    state.interaction = isRisk ? INTERACTION_STATES.CLARIDAD : (isLowDemand ? INTERACTION_STATES.PAUSA : INTERACTION_STATES.BASE);
    state.mode = isRisk ? RESPONSE_MODES.PRACTICO : RESPONSE_MODES.BUSQUEDA;
    state.stimulation = isLowDemand ? "baja" : "normal";
    state.protection = isRisk ? PROTECTION_STATES.RIESGO : PROTECTION_STATES.NORMAL;
    state.visual_presence = isRisk ? PRESENCE_STATES.ESTATICA : (isLowDemand ? PRESENCE_STATES.MINIMA : PRESENCE_STATES.VISIBLE);
    return state;
  }

  window.NEASabikState = {
    defaultSabikState,
    sabikStateFromLayers
  };
})();
