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

  window.NEACoreState = {
    PUBLICABLE,
    COGNITIVE_STATES,
    FUNCTIONAL_STATES,
    VISUAL_MODES,
    MOTION_LEVELS,
    INTERACTION_STATES,
    RESPONSE_MODES,
    PROTECTION_STATES,
    PRESENCE_STATES
  };
})();
