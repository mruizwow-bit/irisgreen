(() => {
  const {
    PUBLICABLE,
    COGNITIVE_STATES,
    FUNCTIONAL_STATES,
    VISUAL_MODES,
    MOTION_LEVELS,
    INTERACTION_STATES,
    RESPONSE_MODES,
    PROTECTION_STATES,
    PRESENCE_STATES
  } = window.NEACoreState;
  const {
    DEFAULT_PATHS,
    loadData,
    normalizeText,
    isPublicable
  } = window.NEAKnowledge;
  const { createSessionState, registerPlanRejection, setSessionPreferences } = window.NEASession;
  const { INTENTS, classifyIntent } = window.NEAIntent;
  const { decideCore } = window.NEADecision;
  const { buildResponsePlan, renderControlledText, applyResponseControl } = window.NEAResponse;
  const { applySpanishOutputGuard, applyOutputLanguageGuard, formulateApprovedResponse } = window.NEALanguage;

  window.NEACoreV1 = {
    PUBLICABLE,
    COGNITIVE_STATES,
    FUNCTIONAL_STATES,
    VISUAL_MODES,
    MOTION_LEVELS,
    INTERACTION_STATES,
    RESPONSE_MODES,
    PROTECTION_STATES,
    PRESENCE_STATES,
    DEFAULT_PATHS,
    createSessionState,
    registerPlanRejection,
    setSessionPreferences,
    INTENTS,
    classifyIntent,
    decideCore,
    loadData,
    buildResponsePlan,
    applyResponseControl,
    renderControlledText,
    applyLanguageGuard: applyOutputLanguageGuard,
    applySpanishOutputGuard,
    applyOutputLanguageGuard,
    formulateApprovedResponse,
    normalizeText,
    isPublicable
  };
})();
