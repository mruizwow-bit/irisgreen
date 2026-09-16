const SABIK_MACHINE = {
  OPERATION: {
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
    HUMAN_HANDOFF: "human_handoff",
    ERROR: "error"
  },
  ADAPTATION: {
    INTENSITY: {
      STANDARD: "standard",
      LOW: "low"
    },
    DEPTH: {
      NORMAL: "normal",
      SHORT: "short",
      DETAILED: "detailed"
    },
    QUESTION_POLICY: {
      NORMAL: "normal",
      LOW: "low",
      ONE_USEFUL_QUESTION: "one_useful_question",
      NONE: "none"
    }
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
  SPEECH: {
    SILENT: "silent",
    STARTING: "speech_starting",
    SPEAKING: "speaking",
    PAUSED: "speech_paused",
    ENDED: "speech_ended",
    ERROR: "speech_error"
  },
  MOTION: {
    IDLE: "idle",
    REDUCED: "reduced",
    REACTIVE: "reactive",
    PROTECTION: "protection",
    PAUSED: "paused"
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
    HIDE: "HIDE",
    SHOW: "SHOW",
    SPEECH_START: "SPEECH_START",
    SPEECH_BOUNDARY: "SPEECH_BOUNDARY",
    SPEECH_PAUSE: "SPEECH_PAUSE",
    SPEECH_RESUME: "SPEECH_RESUME",
    SPEECH_STOP: "SPEECH_STOP",
    SPEECH_END: "SPEECH_END",
    SPEECH_ERROR: "SPEECH_ERROR",
    RISK_UNCERTAIN: "RISK_UNCERTAIN",
    RISK_CONFIRMED: "RISK_CONFIRMED",
    HUMAN_HANDOFF: "HUMAN_HANDOFF",
    TECHNICAL_ERROR: "TECHNICAL_ERROR",
    RETRY: "RETRY",
    SET_ADAPTATION: "SET_ADAPTATION",
    SET_LOW_INTENSITY: "SET_LOW_INTENSITY",
    SET_RESPONSE_LENGTH: "SET_RESPONSE_LENGTH",
    SET_MAX_OPTIONS: "SET_MAX_OPTIONS",
    SET_QUESTION_POLICY: "SET_QUESTION_POLICY",
    SET_REDUCED_MOTION: "SET_REDUCED_MOTION",
    SET_LANGUAGE: "SET_LANGUAGE"
  }
};

const { OPERATION, DIALOGUE, ADAPTATION, SAFETY, VISIBILITY, SPEECH, MOTION, LANGUAGE, EVENTS } = SABIK_MACHINE;

const EVENT_VALUES = new Set(Object.values(EVENTS));
const OPERATIONS = new Set(Object.values(OPERATION));
const DIALOGUES = new Set(Object.values(DIALOGUE));
const SAFETY_VALUES = new Set(Object.values(SAFETY));
const VISIBILITIES = new Set(Object.values(VISIBILITY));
const SPEECH_VALUES = new Set(Object.values(SPEECH));
const MOTION_VALUES = new Set(Object.values(MOTION));
const LANGUAGES = new Set(Object.values(LANGUAGE));
const INTENSITIES = new Set(Object.values(ADAPTATION.INTENSITY));
const DEPTHS = new Set(Object.values(ADAPTATION.DEPTH));
const QUESTION_POLICIES = new Set(Object.values(ADAPTATION.QUESTION_POLICY));

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function eventType(event) {
  return typeof event === "string" ? event : event && event.type;
}

function hasOwn(value, key) {
  return value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, key);
}

function eventValue(event, key, fallback) {
  if (hasOwn(event, key)) return event[key];
  if (key !== "value" && hasOwn(event, "value")) return event.value;
  return fallback;
}

function assertEvent(type) {
  if (!EVENT_VALUES.has(type)) throw new Error(`Invalid Sabik state event: ${String(type)}`);
}

function assertTransition(condition, type, state) {
  if (!condition) throw new Error(`Invalid Sabik state transition: ${type} from ${state.operation}`);
}

function activeSafety(state) {
  return state.safety === SAFETY.RISK_CONFIRMED || state.safety === SAFETY.HUMAN_HANDOFF;
}

function safetyForReset(previous) {
  return activeSafety(previous) || previous.safety === SAFETY.RISK_UNCERTAIN ? previous.safety : SAFETY.NORMAL;
}

function dialogueForSafety(safety) {
  if (safety === SAFETY.HUMAN_HANDOFF || safety === SAFETY.RISK_CONFIRMED) return DIALOGUE.HUMAN_HANDOFF;
  if (safety === SAFETY.RISK_UNCERTAIN) return DIALOGUE.AWAITING_CLARIFICATION;
  return DIALOGUE.IDLE;
}

function motionForSafety(safety, reducedMotion) {
  if (safety === SAFETY.RISK_CONFIRMED || safety === SAFETY.HUMAN_HANDOFF) return MOTION.PROTECTION;
  return reducedMotion ? MOTION.REDUCED : MOTION.IDLE;
}

function createInitialSabikState(options = {}) {
  const reducedMotion = Boolean(options.reduced_motion || options.reducedMotion);
  return {
    operation: OPERATION.BOOTING,
    dialogue: DIALOGUE.IDLE,
    adaptation: {
      intensity: ADAPTATION.INTENSITY.STANDARD,
      depth: ADAPTATION.DEPTH.NORMAL,
      response_length: "normal",
      max_options: 3,
      question_policy: ADAPTATION.QUESTION_POLICY.NORMAL
    },
    safety: SAFETY.NORMAL,
    visibility: VISIBILITY.EXPANDED,
    speech: {
      state: SPEECH.SILENT,
      energy: 0,
      boundary_count: 0,
      end_reason: null
    },
    motion: {
      state: reducedMotion ? MOTION.REDUCED : MOTION.IDLE,
      reduced: reducedMotion
    },
    language: LANGUAGES.has(options.language) ? options.language : LANGUAGE.ES,
    revision: Number.isInteger(options.revision) && options.revision >= 0 ? options.revision : 0,
    error: null,
    last_event: null
  };
}

function validateSabikState(state) {
  const errors = [];
  if (!state || typeof state !== "object") {
    return { ok: false, errors: ["state must be an object"] };
  }

  if (!OPERATIONS.has(state.operation)) errors.push("invalid operation");
  if (!DIALOGUES.has(state.dialogue)) errors.push("invalid dialogue");
  if (!SAFETY_VALUES.has(state.safety)) errors.push("invalid safety");
  if (!VISIBILITIES.has(state.visibility)) errors.push("invalid visibility");
  if (!LANGUAGES.has(state.language)) errors.push("invalid language");
  if (!Number.isInteger(state.revision) || state.revision < 0) errors.push("invalid revision");

  if (!state.adaptation || typeof state.adaptation !== "object") {
    errors.push("invalid adaptation");
  } else {
    if (!INTENSITIES.has(state.adaptation.intensity)) errors.push("invalid adaptation intensity");
    if (!DEPTHS.has(state.adaptation.depth)) errors.push("invalid adaptation depth");
    if (!QUESTION_POLICIES.has(state.adaptation.question_policy)) errors.push("invalid question policy");
    if (!Number.isInteger(state.adaptation.max_options) || state.adaptation.max_options < 1 || state.adaptation.max_options > 6) {
      errors.push("invalid max_options");
    }
    if (!['normal', 'short'].includes(state.adaptation.response_length)) errors.push("invalid response_length");
  }

  if (!state.speech || typeof state.speech !== "object") {
    errors.push("invalid speech");
  } else {
    if (!SPEECH_VALUES.has(state.speech.state)) errors.push("invalid speech state");
    if (typeof state.speech.energy !== "number" || state.speech.energy < 0 || state.speech.energy > 1) errors.push("invalid speech energy");
    if (!Number.isInteger(state.speech.boundary_count) || state.speech.boundary_count < 0) errors.push("invalid speech boundary_count");
    if ([SPEECH.SILENT, SPEECH.STARTING, SPEECH.PAUSED, SPEECH.ENDED, SPEECH.ERROR].includes(state.speech.state) && state.speech.energy !== 0) {
      errors.push("inactive speech must have zero energy");
    }
  }

  if (!state.motion || typeof state.motion !== "object") {
    errors.push("invalid motion");
  } else {
    if (!MOTION_VALUES.has(state.motion.state)) errors.push("invalid motion state");
    if (typeof state.motion.reduced !== "boolean") errors.push("invalid reduced motion flag");
    if (state.motion.state === MOTION.REACTIVE && (!state.speech || state.speech.state !== SPEECH.SPEAKING)) {
      errors.push("reactive motion requires active speech");
    }
    if (state.motion.state === MOTION.REACTIVE && [SAFETY.RISK_CONFIRMED, SAFETY.HUMAN_HANDOFF].includes(state.safety)) {
      errors.push("reactive motion is not allowed during active protection");
    }
  }

  if ((state.safety === SAFETY.HUMAN_HANDOFF || state.safety === SAFETY.RISK_CONFIRMED) && state.dialogue !== DIALOGUE.HUMAN_HANDOFF) {
    errors.push("active protection requires human handoff dialogue");
  }
  if (state.operation === OPERATION.ERROR && state.dialogue === DIALOGUE.INSUFFICIENT) {
    errors.push("technical error cannot be represented as insufficiency");
  }

  return { ok: errors.length === 0, errors };
}

function assertValidState(state) {
  const result = validateSabikState(state);
  if (!result.ok) throw new Error(`Invalid Sabik state: ${result.errors.join(", ")}`);
}

function deriveSabikPresentation(state) {
  assertValidState(state);
  const safetyPriority = activeSafety(state);
  const speechEnergy = [SPEECH.SPEAKING].includes(state.speech.state) ? state.speech.energy : 0;
  return {
    visible: state.visibility !== VISIBILITY.HIDDEN,
    collapsed: state.visibility === VISIBILITY.COLLAPSED,
    text_available: true,
    safety_priority: safetyPriority,
    operation: state.operation,
    dialogue: state.dialogue,
    speech_state: state.speech.state,
    speech_energy: speechEnergy,
    motion_state: state.motion.state,
    motion_reduced: state.motion.reduced,
    language: state.language,
    adaptation: clone(state.adaptation),
    labels: {
      status: safetyPriority ? "human_support_first" : state.operation,
      no_diagnosis: true
    }
  };
}

function canSubmit(state) {
  return !activeSafety(state) && [OPERATION.READY, OPERATION.PRESENTING].includes(state.operation);
}

function assertCanStartSpeech(previous, type) {
  assertTransition(!activeSafety(previous), type, previous);
  assertTransition([OPERATION.PRESENTING, OPERATION.AWAITING_CLARIFICATION].includes(previous.operation), type, previous);
}

function stopOrdinarySpeech(next, reason) {
  next.speech = {
    state: SPEECH.ENDED,
    energy: 0,
    boundary_count: next.speech.boundary_count,
    end_reason: reason
  };
}

function incrementRevision(next, type) {
  next.revision += 1;
  next.last_event = type;
}

function transitionSabikState(currentState, event) {
  const type = eventType(event);
  assertEvent(type);

  const previous = currentState || createInitialSabikState();
  assertValidState(previous);

  if (type === EVENTS.RESET_SESSION) {
    const safety = safetyForReset(previous);
    const reset = createInitialSabikState({
      language: previous.language,
      reduced_motion: previous.motion.reduced,
      revision: previous.revision
    });
    reset.operation = safety === SAFETY.NORMAL ? OPERATION.READY : OPERATION.PRESENTING;
    reset.safety = safety;
    reset.dialogue = dialogueForSafety(safety);
    reset.motion.state = motionForSafety(safety, reset.motion.reduced);
    incrementRevision(reset, type);
    assertValidState(reset);
    return reset;
  }

  const next = clone(previous);
  incrementRevision(next, type);

  switch (type) {
    case EVENTS.BOOT_OK:
      assertTransition(previous.operation === OPERATION.BOOTING, type, previous);
      next.operation = OPERATION.READY;
      next.dialogue = DIALOGUE.IDLE;
      next.error = null;
      break;

    case EVENTS.SUBMIT:
      assertTransition(canSubmit(previous), type, previous);
      next.operation = OPERATION.RETRIEVING;
      next.dialogue = DIALOGUE.IDLE;
      next.speech = { state: SPEECH.SILENT, energy: 0, boundary_count: previous.speech.boundary_count, end_reason: null };
      next.motion.state = previous.motion.reduced ? MOTION.REDUCED : MOTION.IDLE;
      next.error = null;
      break;

    case EVENTS.RETRIEVAL_OK:
      assertTransition(previous.operation === OPERATION.RETRIEVING, type, previous);
      next.operation = OPERATION.COMPOSING;
      next.error = null;
      break;

    case EVENTS.RETRIEVAL_EMPTY:
      assertTransition(previous.operation === OPERATION.RETRIEVING, type, previous);
      next.operation = OPERATION.PRESENTING;
      next.dialogue = DIALOGUE.INSUFFICIENT;
      next.error = null;
      break;

    case EVENTS.RESPONSE_READY: {
      assertTransition(previous.operation === OPERATION.COMPOSING, type, previous);
      const dialogue = eventValue(event, "dialogue", DIALOGUE.ANSWERING);
      assertTransition(DIALOGUES.has(dialogue) && dialogue !== DIALOGUE.HUMAN_HANDOFF && dialogue !== DIALOGUE.ERROR, type, previous);
      next.operation = OPERATION.PRESENTING;
      next.dialogue = dialogue;
      next.error = null;
      break;
    }

    case EVENTS.ASK_CLARIFICATION:
      assertTransition([OPERATION.READY, OPERATION.COMPOSING, OPERATION.PRESENTING].includes(previous.operation), type, previous);
      next.operation = OPERATION.AWAITING_CLARIFICATION;
      next.dialogue = DIALOGUE.AWAITING_CLARIFICATION;
      break;

    case EVENTS.PAUSE_ASSISTANT:
      assertTransition(previous.operation !== OPERATION.ERROR, type, previous);
      next.operation = OPERATION.ASSISTANT_PAUSED;
      break;

    case EVENTS.RESUME_ASSISTANT:
      assertTransition(previous.operation === OPERATION.ASSISTANT_PAUSED, type, previous);
      next.operation = activeSafety(previous) ? OPERATION.PRESENTING : OPERATION.READY;
      next.dialogue = dialogueForSafety(previous.safety);
      break;

    case EVENTS.COLLAPSE:
      next.visibility = VISIBILITY.COLLAPSED;
      break;

    case EVENTS.EXPAND:
      assertTransition(previous.visibility === VISIBILITY.COLLAPSED || previous.visibility === VISIBILITY.HIDDEN, type, previous);
      next.visibility = VISIBILITY.EXPANDED;
      break;

    case EVENTS.HIDE:
      next.visibility = VISIBILITY.HIDDEN;
      break;

    case EVENTS.SHOW:
      assertTransition(previous.visibility === VISIBILITY.HIDDEN, type, previous);
      next.visibility = VISIBILITY.EXPANDED;
      break;

    case EVENTS.SPEECH_START:
      assertCanStartSpeech(previous, type);
      next.speech.state = SPEECH.STARTING;
      next.speech.energy = 0;
      next.speech.end_reason = null;
      break;

    case EVENTS.SPEECH_BOUNDARY:
      assertTransition(previous.speech.state === SPEECH.STARTING || previous.speech.state === SPEECH.SPEAKING, type, previous);
      assertTransition(!activeSafety(previous), type, previous);
      next.speech.state = SPEECH.SPEAKING;
      next.speech.boundary_count += 1;
      next.speech.energy = 1;
      break;

    case EVENTS.SPEECH_PAUSE:
      assertTransition(previous.speech.state === SPEECH.SPEAKING, type, previous);
      next.speech.state = SPEECH.PAUSED;
      next.speech.energy = 0;
      break;

    case EVENTS.SPEECH_RESUME:
      assertTransition(previous.speech.state === SPEECH.PAUSED, type, previous);
      assertTransition(!activeSafety(previous), type, previous);
      next.speech.state = SPEECH.SPEAKING;
      next.speech.energy = 1;
      next.speech.end_reason = null;
      break;

    case EVENTS.SPEECH_STOP:
      assertTransition([SPEECH.STARTING, SPEECH.SPEAKING, SPEECH.PAUSED].includes(previous.speech.state), type, previous);
      stopOrdinarySpeech(next, "explicit_stop");
      break;

    case EVENTS.SPEECH_END:
      assertTransition([SPEECH.SPEAKING, SPEECH.PAUSED, SPEECH.STARTING].includes(previous.speech.state), type, previous);
      stopOrdinarySpeech(next, "natural_end");
      break;

    case EVENTS.SPEECH_ERROR:
      next.speech.state = SPEECH.ERROR;
      next.speech.energy = 0;
      next.speech.end_reason = "error";
      next.error = { layer: "speech", message: event && event.message ? String(event.message) : "speech_error" };
      break;

    case EVENTS.RISK_UNCERTAIN:
      assertTransition(previous.safety === SAFETY.NORMAL, type, previous);
      next.safety = SAFETY.RISK_UNCERTAIN;
      next.operation = OPERATION.AWAITING_CLARIFICATION;
      next.dialogue = DIALOGUE.AWAITING_CLARIFICATION;
      next.motion.state = previous.motion.reduced ? MOTION.REDUCED : MOTION.IDLE;
      break;

    case EVENTS.RISK_CONFIRMED:
      assertTransition(previous.safety !== SAFETY.HUMAN_HANDOFF, type, previous);
      next.safety = SAFETY.RISK_CONFIRMED;
      next.operation = OPERATION.PRESENTING;
      next.dialogue = DIALOGUE.HUMAN_HANDOFF;
      next.motion.state = MOTION.PROTECTION;
      next.speech = { state: SPEECH.SILENT, energy: 0, boundary_count: previous.speech.boundary_count, end_reason: "risk_interrupted" };
      next.error = null;
      break;

    case EVENTS.HUMAN_HANDOFF:
      assertTransition(previous.safety === SAFETY.RISK_CONFIRMED || previous.safety === SAFETY.RISK_UNCERTAIN, type, previous);
      next.safety = SAFETY.HUMAN_HANDOFF;
      next.operation = OPERATION.PRESENTING;
      next.dialogue = DIALOGUE.HUMAN_HANDOFF;
      next.motion.state = MOTION.PROTECTION;
      next.speech = { state: SPEECH.SILENT, energy: 0, boundary_count: previous.speech.boundary_count, end_reason: "handoff" };
      break;

    case EVENTS.TECHNICAL_ERROR:
      next.operation = OPERATION.ERROR;
      next.dialogue = activeSafety(previous) ? DIALOGUE.HUMAN_HANDOFF : DIALOGUE.ERROR;
      next.error = { layer: "operation", message: event && event.message ? String(event.message) : "technical_error" };
      if (activeSafety(previous)) {
        next.safety = previous.safety;
        next.motion.state = MOTION.PROTECTION;
      }
      next.speech.energy = 0;
      if (![SPEECH.SILENT, SPEECH.ENDED, SPEECH.ERROR].includes(next.speech.state)) next.speech.state = SPEECH.SILENT;
      break;

    case EVENTS.RETRY:
      assertTransition(previous.operation === OPERATION.ERROR, type, previous);
      next.error = null;
      next.speech = { state: SPEECH.SILENT, energy: 0, boundary_count: previous.speech.boundary_count, end_reason: null };
      if (activeSafety(previous)) {
        next.operation = OPERATION.PRESENTING;
        next.dialogue = DIALOGUE.HUMAN_HANDOFF;
        next.motion.state = MOTION.PROTECTION;
      } else {
        next.operation = OPERATION.READY;
        next.dialogue = DIALOGUE.IDLE;
        next.motion.state = previous.motion.reduced ? MOTION.REDUCED : MOTION.IDLE;
      }
      break;

    case EVENTS.SET_ADAPTATION: {
      const adaptation = hasOwn(event, "adaptation") ? event.adaptation : event;
      if (hasOwn(adaptation, "intensity")) {
        assertTransition(INTENSITIES.has(adaptation.intensity), type, previous);
        next.adaptation.intensity = adaptation.intensity;
      }
      if (hasOwn(adaptation, "depth")) {
        assertTransition(DEPTHS.has(adaptation.depth), type, previous);
        next.adaptation.depth = adaptation.depth;
        next.adaptation.response_length = adaptation.depth === ADAPTATION.DEPTH.SHORT ? "short" : "normal";
      }
      if (hasOwn(adaptation, "max_options")) {
        const value = Number(adaptation.max_options);
        assertTransition(Number.isInteger(value) && value >= 1 && value <= 6, type, previous);
        next.adaptation.max_options = value;
      }
      if (hasOwn(adaptation, "question_policy")) {
        assertTransition(QUESTION_POLICIES.has(adaptation.question_policy), type, previous);
        next.adaptation.question_policy = adaptation.question_policy;
      }
      break;
    }

    case EVENTS.SET_LOW_INTENSITY:
      next.adaptation.intensity = eventValue(event, "enabled", eventValue(event, "value", true)) ? ADAPTATION.INTENSITY.LOW : ADAPTATION.INTENSITY.STANDARD;
      break;

    case EVENTS.SET_RESPONSE_LENGTH: {
      const value = eventValue(event, "response_length", eventValue(event, "value", "normal"));
      assertTransition(["normal", "short"].includes(value), type, previous);
      next.adaptation.response_length = value;
      next.adaptation.depth = value === "short" ? ADAPTATION.DEPTH.SHORT : ADAPTATION.DEPTH.NORMAL;
      break;
    }

    case EVENTS.SET_MAX_OPTIONS: {
      const value = Number(eventValue(event, "max_options", eventValue(event, "value", 3)));
      assertTransition(Number.isInteger(value) && value >= 1 && value <= 6, type, previous);
      next.adaptation.max_options = value;
      break;
    }

    case EVENTS.SET_QUESTION_POLICY: {
      const value = eventValue(event, "question_policy", eventValue(event, "value", ADAPTATION.QUESTION_POLICY.NORMAL));
      assertTransition(QUESTION_POLICIES.has(value), type, previous);
      next.adaptation.question_policy = value;
      break;
    }

    case EVENTS.SET_REDUCED_MOTION: {
      const reduced = Boolean(eventValue(event, "reduced", eventValue(event, "value", true)));
      next.motion.reduced = reduced;
      next.motion.state = activeSafety(previous) ? MOTION.PROTECTION : (reduced ? MOTION.REDUCED : MOTION.IDLE);
      break;
    }

    case EVENTS.SET_LANGUAGE: {
      const language = eventValue(event, "language", eventValue(event, "value", LANGUAGE.ES));
      assertTransition(LANGUAGES.has(language), type, previous);
      next.language = language;
      break;
    }

    default:
      throw new Error(`Unhandled Sabik state event: ${type}`);
  }

  assertValidState(next);
  return next;
}

module.exports = {
  createInitialSabikState,
  transitionSabikState,
  validateSabikState,
  deriveSabikPresentation,
  SABIK_MACHINE
};


