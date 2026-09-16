(() => {
  const PUBLICABLE = "PUBLICABLE";

  const COGNITIVE_STATES = {
    NUCLEO_BASE: "NucleoBase",
    HIPERFOCO: "Hiperfoco",
    SOBRECARGA: "Sobrecarga",
    VINCULO: "Vinculo",
    VOZ_INTERIOR: "VozInterior",
    CREATIVIDAD: "Creatividad"
  };

  const FUNCTIONAL_STATES = {
    AVAILABLE: "Available",
    LISTENING: "Listening",
    PROCESSING: "Processing",
    LEARNING: "Learning",
    CALM: "Calm",
    WAITING: "Waiting"
  };

  const VISUAL_MODES = {
    INVISIBLE: "Invisible",
    ABSTRACTA: "Abstracta",
    COMPANERA_NO_HUMANA: "CompaneraNoHumana",
    HUMANA: "Humana"
  };

  const MOTION_LEVELS = {
    OFF: "Off",
    LOW: "Low",
    SOFT: "Soft"
  };

  const INTERACTION_STATES = {
    BASE: "base",
    EXPLORACION: "exploracion",
    CLARIDAD: "claridad",
    PAUSA: "pausa",
    ERROR: "error",
    CIERRE: "cierre"
  };

  const RESPONSE_MODES = {
    BUSQUEDA: "busqueda",
    PRACTICO: "practico",
    APRENDIZAJE: "aprendizaje",
    REFORMULACION: "reformulacion"
  };

  const PROTECTION_STATES = {
    NORMAL: "normal",
    PRIVACIDAD: "privacidad",
    LIMITES: "limites",
    RIESGO: "riesgo"
  };

  const PRESENCE_STATES = {
    VISIBLE: "visible",
    SUAVE: "suave",
    MINIMA: "minima",
    ESTATICA: "estatica",
    OCULTA: "oculta"
  };

  const SABIK_MACHINE = {
    OPERATIONAL: {
      BOOTING: "booting",
      READY: "ready",
      RETRIEVING: "retrieving",
      COMPOSING: "composing",
      PRESENTING: "presenting",
      AWAITING_CLARIFICATION: "awaiting_clarification",
      ASSISTANT_PAUSED: "assistant_paused",
      ERROR: "error"
    },
    DIALOGUE: {
      IDLE: "idle",
      ANSWERING: "answering",
      AWAITING_CLARIFICATION: "awaiting_clarification",
      INSUFFICIENT: "insufficient",
      HUMAN_HANDOFF: "human_handoff"
    },
    ADAPTATION: {
      STANDARD: "standard",
      LOW_INTENSITY: "low_intensity"
    },
    SAFETY: {
      NORMAL: "normal",
      RISK_UNCERTAIN: "risk_uncertain",
      RISK_CONFIRMED: "risk_confirmed",
      HUMAN_HANDOFF: "human_handoff"
    },
    VISIBILITY: {
      EXPANDED: "expanded",
      COLLAPSED: "collapsed",
      HIDDEN: "hidden"
    },
    VOICE: {
      SILENT: "silent",
      STARTING: "speech_starting",
      SPEAKING: "speaking",
      PAUSED: "speech_paused",
      ENDED: "speech_ended",
      ERROR: "speech_error"
    },
    MOTION: {
      ENABLED: "motion_enabled",
      REDUCED: "motion_reduced",
      PAUSED: "motion_paused"
    },
    LANGUAGE: {
      ES: "es",
      EN: "en"
    },
    EVENTS: {
      BOOT_OK: "BOOT_OK",
      SUBMIT: "SUBMIT",
      RETRIEVAL_OK: "RETRIEVAL_OK",
      RETRIEVAL_EMPTY: "RETRIEVAL_EMPTY",
      RESPONSE_READY: "RESPONSE_READY",
      ASK_CLARIFICATION: "ASK_CLARIFICATION",
      PAUSE_ASSISTANT: "PAUSE_ASSISTANT",
      RESUME_ASSISTANT: "RESUME_ASSISTANT",
      RESET_SESSION: "RESET_SESSION",
      COLLAPSE: "COLLAPSE",
      EXPAND: "EXPAND",
      SPEECH_START: "SPEECH_START",
      SPEECH_BOUNDARY: "SPEECH_BOUNDARY",
      SPEECH_PAUSE: "SPEECH_PAUSE",
      SPEECH_RESUME: "SPEECH_RESUME",
      SPEECH_END: "SPEECH_END",
      SPEECH_ERROR: "SPEECH_ERROR",
      RISK_UNCERTAIN: "RISK_UNCERTAIN",
      RISK_CONFIRMED: "RISK_CONFIRMED",
      HUMAN_HANDOFF: "HUMAN_HANDOFF",
      TECHNICAL_ERROR: "TECHNICAL_ERROR",
      RETRY: "RETRY",
      SET_LOW_INTENSITY: "SET_LOW_INTENSITY",
      SET_RESPONSE_LENGTH: "SET_RESPONSE_LENGTH",
      SET_MAX_OPTIONS: "SET_MAX_OPTIONS",
      SET_QUESTION_POLICY: "SET_QUESTION_POLICY",
      SET_REDUCED_MOTION: "SET_REDUCED_MOTION",
      SET_LANGUAGE: "SET_LANGUAGE",
      HIDE: "HIDE",
      SHOW: "SHOW"
    }
  };

  window.NEACoreState = {
    PUBLICABLE,
    COGNITIVE_STATES,
    FUNCTIONAL_STATES,
    VISUAL_MODES,
    MOTION_LEVELS,
    INTERACTION_STATES,
    RESPONSE_MODES,
    PROTECTION_STATES,
    PRESENCE_STATES,
    SABIK_MACHINE
  };
})();
