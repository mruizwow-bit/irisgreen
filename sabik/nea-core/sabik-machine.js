const SABIK_MACHINE = {
  OPERATION: {
    BOOTING: "booting",
    READY: "ready",
    RETRIEVING: "retrieving",
    COMPOSING: "composing",
    PRESENTING: "presenting",
    AWAITING_CLARIFICATION: "awaiting_clarification",
    PAUSED: "paused",
    ERROR: "error"
  },
  DIALOGUE: {
    NONE: "none",
    INFORMATION: "information",
    PRACTICAL: "practical",
    CLARIFICATION: "clarification",
    ACCOMPANIMENT: "accompaniment",
    CORRECTION: "correction",
    INSUFFICIENT: "insufficient",
    HUMAN_HANDOFF: "human_handoff"
  },
  SAFETY: {
    NORMAL: "normal",
    UNCERTAIN: "uncertain",
    RISK: "risk",
    HUMAN_HANDOFF: "human_handoff"
  },
  VISIBILITY: {
    EXPANDED: "expanded",
    COLLAPSED: "collapsed",
    HIDDEN: "hidden"
  },
  SPEECH: {
    SILENT: "silent",
    STARTING: "starting",
    SPEAKING: "speaking",
    PAUSED: "paused",
    ENDED: "ended",
    ERROR: "error"
  },
  MOTION: {
    OFF: "off",
    AMBIENT: "ambient",
    PROCESSING: "processing",
    VOICE_REACTIVE: "voice_reactive",
    PROTECTION_STATIC: "protection_static"
  },
  LANGUAGE: {
    ES: "es",
    EN: "en"
  },
  ADAPTATION: {
    INTENSITY: {
      NORMAL: "normal",
      LOW: "low"
    },
    DEPTH: {
      NORMAL: "normal",
      SHORT: "short",
      DETAILED: "detailed"
    },
    RESPONSE_LENGTH: {
      NORMAL: "normal",
      SHORT: "short"
    },
    QUESTION_POLICY: {
      NORMAL: "normal",
      LOW: "low",
      ONE_USEFUL_QUESTION: "one_useful_question",
      NONE: "none"
    }
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
    SPEECH_REQUEST: "SPEECH_REQUEST",
    SPEECH_START: "SPEECH_START",
    SPEECH_BOUNDARY: "SPEECH_BOUNDARY",
    SPEECH_PAUSE: "SPEECH_PAUSE",
    SPEECH_RESUME: "SPEECH_RESUME",
    SPEECH_STOP: "SPEECH_STOP",
    SPEECH_END: "SPEECH_END",
    SPEECH_ERROR: "SPEECH_ERROR",
    RISK_UNCERTAIN: "RISK_UNCERTAIN",
    RISK_CONFIRMED: "RISK_CONFIRMED",
    RISK_CLEARED: "RISK_CLEARED",
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

const { OPERATION, DIALOGUE, SAFETY, VISIBILITY, SPEECH, MOTION, LANGUAGE, ADAPTATION, EVENTS } = SABIK_MACHINE;

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
const RESPONSE_LENGTHS = new Set(Object.values(ADAPTATION.RESPONSE_LENGTH));
const QUESTION_POLICIES = new Set(Object.values(ADAPTATION.QUESTION_POLICY));
const CONTRACT_KEYS = new Set([
  "operation",
  "dialogue",
  "adaptation",
  "safety",
  "visibility",
  "speech",
  "motion",
  "language",
  "revision",
  "speech_meta",
  "motion_meta"
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultSpeechMeta(meta = {}) {
  return {
    energy: typeof meta.energy === "number" ? meta.energy : 0,
    boundary_count: Number.isInteger(meta.boundary_count) ? meta.boundary_count : 0,
    end_reason: hasOwn(meta, "end_reason") ? meta.end_reason : null
  };
}

function defaultMotionMeta(meta = {}) {
  return {
    reduced: Boolean(meta.reduced)
  };
}

function normalizeSabikState(state) {
  const normalized = clone(state);
  normalized.speech_meta = defaultSpeechMeta(normalized.speech_meta);
  normalized.motion_meta = defaultMotionMeta(normalized.motion_meta);
  return normalized;
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

function activeProtection(state) {
  return state.safety === SAFETY.RISK || state.safety === SAFETY.HUMAN_HANDOFF;
}

function safetyAttention(state) {
  return state.safety === SAFETY.UNCERTAIN || activeProtection(state);
}

function ordinaryMotionFor(state, operation = state.operation, speech = state.speech) {
  if (state.safety === SAFETY.UNCERTAIN || activeProtection(state)) return MOTION.PROTECTION_STATIC;
  if (operation === OPERATION.PAUSED) return MOTION.OFF;
  if (defaultMotionMeta(state.motion_meta).reduced) return MOTION.OFF;
  if (speech === SPEECH.SPEAKING) return MOTION.VOICE_REACTIVE;
  if (operation === OPERATION.RETRIEVING || operation === OPERATION.COMPOSING) return MOTION.PROCESSING;
  return MOTION.AMBIENT;
}

function dialogueForSafety(safety) {
  if (safety === SAFETY.UNCERTAIN) return DIALOGUE.CLARIFICATION;
  if (safety === SAFETY.RISK || safety === SAFETY.HUMAN_HANDOFF) return DIALOGUE.HUMAN_HANDOFF;
  return DIALOGUE.NONE;
}

function operationForSafety(safety) {
  if (safety === SAFETY.UNCERTAIN) return OPERATION.AWAITING_CLARIFICATION;
  if (safety === SAFETY.RISK || safety === SAFETY.HUMAN_HANDOFF) return OPERATION.PRESENTING;
  return OPERATION.READY;
}

function createInitialSabikState(options = {}) {
  const reduced = Boolean(options.reduced_motion || options.reducedMotion || options.reduced);
  return {
    operation: OPERATION.BOOTING,
    dialogue: DIALOGUE.NONE,
    adaptation: {
      response_length: ADAPTATION.RESPONSE_LENGTH.NORMAL,
      max_options: 3,
      question_policy: ADAPTATION.QUESTION_POLICY.NORMAL,
      intensity: ADAPTATION.INTENSITY.NORMAL,
      depth: ADAPTATION.DEPTH.NORMAL
    },
    safety: SAFETY.NORMAL,
    visibility: VISIBILITY.EXPANDED,
    speech: SPEECH.SILENT,
    motion: reduced ? MOTION.OFF : MOTION.OFF,
    language: LANGUAGES.has(options.language) ? options.language : LANGUAGE.ES,
    revision: Number.isInteger(options.revision) && options.revision >= 0 ? options.revision : 0,
    speech_meta: {
      energy: 0,
      boundary_count: 0,
      end_reason: null
    },
    motion_meta: {
      reduced
    }
  };
}

function validateSabikState(state) {
  const errors = [];
  if (!state || typeof state !== "object") return { ok: false, errors: ["state must be an object"] };

  Object.keys(state).forEach((key) => {
    if (!CONTRACT_KEYS.has(key)) errors.push(`unexpected public field ${key}`);
  });

  if (!OPERATIONS.has(state.operation)) errors.push("invalid operation");
  if (!DIALOGUES.has(state.dialogue)) errors.push("invalid dialogue");
  if (!SAFETY_VALUES.has(state.safety)) errors.push("invalid safety");
  if (!VISIBILITIES.has(state.visibility)) errors.push("invalid visibility");
  if (!SPEECH_VALUES.has(state.speech)) errors.push("invalid speech");
  if (!MOTION_VALUES.has(state.motion)) errors.push("invalid motion");
  if (!LANGUAGES.has(state.language)) errors.push("invalid language");
  if (!Number.isInteger(state.revision) || state.revision < 0) errors.push("invalid revision");

  if (!state.adaptation || typeof state.adaptation !== "object") {
    errors.push("invalid adaptation");
  } else {
    if (!RESPONSE_LENGTHS.has(state.adaptation.response_length)) errors.push("invalid response_length");
    if (!Number.isInteger(state.adaptation.max_options) || state.adaptation.max_options < 1 || state.adaptation.max_options > 6) errors.push("invalid max_options");
    if (!QUESTION_POLICIES.has(state.adaptation.question_policy)) errors.push("invalid question_policy");
    if (!INTENSITIES.has(state.adaptation.intensity)) errors.push("invalid intensity");
    if (!DEPTHS.has(state.adaptation.depth)) errors.push("invalid depth");
  }

  if (hasOwn(state, "speech_meta") && (!state.speech_meta || typeof state.speech_meta !== "object")) {
    errors.push("invalid speech_meta");
  } else if (hasOwn(state, "speech_meta")) {
    if (typeof state.speech_meta.energy !== "number" || state.speech_meta.energy < 0 || state.speech_meta.energy > 1) errors.push("invalid speech energy");
    if (!Number.isInteger(state.speech_meta.boundary_count) || state.speech_meta.boundary_count < 0) errors.push("invalid speech boundary_count");
  }

  const speechMeta = defaultSpeechMeta(state.speech_meta);
  if (state.speech !== SPEECH.SPEAKING && speechMeta.energy !== 0) errors.push("inactive speech must have zero energy");

  if (hasOwn(state, "motion_meta") && (!state.motion_meta || typeof state.motion_meta !== "object")) {
    errors.push("invalid motion_meta");
  } else if (hasOwn(state, "motion_meta") && typeof state.motion_meta.reduced !== "boolean") {
    errors.push("invalid reduced motion flag");
  }

  if (state.motion === MOTION.VOICE_REACTIVE && state.speech !== SPEECH.SPEAKING) errors.push("voice_reactive motion requires speaking speech");
  if (state.motion === MOTION.VOICE_REACTIVE && safetyAttention(state)) errors.push("voice_reactive motion is not allowed during safety attention");
  if ((state.safety === SAFETY.RISK || state.safety === SAFETY.HUMAN_HANDOFF) && state.dialogue !== DIALOGUE.HUMAN_HANDOFF) {
    errors.push("active safety requires human_handoff dialogue");
  }
  if (state.safety === SAFETY.UNCERTAIN && state.dialogue !== DIALOGUE.CLARIFICATION) errors.push("uncertain safety requires clarification dialogue");
  if (state.safety === SAFETY.NORMAL && state.motion === MOTION.PROTECTION_STATIC) errors.push("protection_static motion requires safety attention");
  if (state.operation === OPERATION.ERROR && state.dialogue === DIALOGUE.INSUFFICIENT) errors.push("technical error cannot be represented as insufficiency");

  return { ok: errors.length === 0, errors };
}

function assertValidState(state) {
  const result = validateSabikState(state);
  if (!result.ok) throw new Error(`Invalid Sabik state: ${result.errors.join(", ")}`);
}

function incrementRevision(state, type) {
  state.revision += 1;
  return state;
}

function withSpeech(next, speech, energy, endReason = null) {
  next.speech_meta = defaultSpeechMeta(next.speech_meta);
  next.speech = speech;
  next.speech_meta.energy = energy;
  next.speech_meta.end_reason = endReason;
}

function stopSpeech(next, reason) {
  withSpeech(next, SPEECH.ENDED, 0, reason);
  next.motion = ordinaryMotionFor(next, next.operation, next.speech);
}

function deriveSabikPresentation(state) {
  assertValidState(state);
  const normalized = normalizeSabikState(state);
  return {
    visible: normalized.visibility !== VISIBILITY.HIDDEN,
    collapsed: normalized.visibility === VISIBILITY.COLLAPSED,
    text_available: true,
    safety_priority: activeProtection(normalized),
    operation: normalized.operation,
    dialogue: normalized.dialogue,
    speech: normalized.speech,
    speech_energy: normalized.speech === SPEECH.SPEAKING ? normalized.speech_meta.energy : 0,
    motion: normalized.motion,
    motion_reduced: normalized.motion_meta.reduced,
    language: normalized.language,
    adaptation: clone(normalized.adaptation),
    labels: {
      status: activeProtection(normalized) ? "human_support_first" : normalized.operation,
      no_diagnosis: true
    }
  };
}

function canSubmit(previous) {
  if (previous.safety === SAFETY.UNCERTAIN) return previous.operation === OPERATION.AWAITING_CLARIFICATION;
  if (activeProtection(previous)) return false;
  return [OPERATION.READY, OPERATION.PRESENTING, OPERATION.AWAITING_CLARIFICATION].includes(previous.operation);
}

function applySafety(next, safety) {
  next.safety = safety;
  next.operation = operationForSafety(safety);
  next.dialogue = dialogueForSafety(safety);
  withSpeech(next, SPEECH.SILENT, 0, safety === SAFETY.NORMAL ? null : "safety_interrupted");
  next.motion = safety === SAFETY.NORMAL ? ordinaryMotionFor(next) : MOTION.PROTECTION_STATIC;
}

function transitionSabikState(currentState, event) {
  const type = eventType(event);
  assertEvent(type);

  const rawPrevious = currentState || createInitialSabikState();
  assertValidState(rawPrevious);
  const previous = normalizeSabikState(rawPrevious);

  const next = clone(previous);
  incrementRevision(next, type);

  switch (type) {
    case EVENTS.BOOT_OK:
      assertTransition(previous.operation === OPERATION.BOOTING, type, previous);
      next.operation = OPERATION.READY;
      next.dialogue = DIALOGUE.NONE;
      next.motion = ordinaryMotionFor(next, OPERATION.READY, next.speech);
      break;

    case EVENTS.SUBMIT:
      assertTransition(canSubmit(previous), type, previous);
      if (previous.safety === SAFETY.UNCERTAIN) {
        next.operation = OPERATION.AWAITING_CLARIFICATION;
        next.dialogue = DIALOGUE.CLARIFICATION;
        next.motion = MOTION.PROTECTION_STATIC;
        withSpeech(next, SPEECH.SILENT, 0, "safety_pending");
        break;
      }
      next.operation = OPERATION.RETRIEVING;
      next.dialogue = previous.operation === OPERATION.AWAITING_CLARIFICATION ? DIALOGUE.CLARIFICATION : DIALOGUE.NONE;
      withSpeech(next, SPEECH.SILENT, 0, null);
      next.motion = ordinaryMotionFor(next, OPERATION.RETRIEVING, next.speech);
      break;

    case EVENTS.RETRIEVAL_OK:
      assertTransition(previous.operation === OPERATION.RETRIEVING, type, previous);
      next.operation = OPERATION.COMPOSING;
      next.motion = ordinaryMotionFor(next, OPERATION.COMPOSING, next.speech);
      break;

    case EVENTS.RETRIEVAL_EMPTY:
      assertTransition(previous.operation === OPERATION.RETRIEVING, type, previous);
      next.operation = OPERATION.PRESENTING;
      next.dialogue = DIALOGUE.INSUFFICIENT;
      next.motion = ordinaryMotionFor(next, OPERATION.PRESENTING, next.speech);
      break;

    case EVENTS.RESPONSE_READY: {
      assertTransition(previous.operation === OPERATION.COMPOSING, type, previous);
      const dialogue = eventValue(event, "dialogue", DIALOGUE.INFORMATION);
      assertTransition(DIALOGUES.has(dialogue) && dialogue !== DIALOGUE.HUMAN_HANDOFF, type, previous);
      next.operation = OPERATION.PRESENTING;
      next.dialogue = dialogue;
      next.motion = ordinaryMotionFor(next, OPERATION.PRESENTING, next.speech);
      break;
    }

    case EVENTS.ASK_CLARIFICATION:
      assertTransition([OPERATION.READY, OPERATION.COMPOSING, OPERATION.PRESENTING].includes(previous.operation), type, previous);
      next.operation = OPERATION.AWAITING_CLARIFICATION;
      next.dialogue = DIALOGUE.CLARIFICATION;
      next.motion = ordinaryMotionFor(next, OPERATION.AWAITING_CLARIFICATION, next.speech);
      break;

    case EVENTS.PAUSE_ASSISTANT:
      assertTransition(previous.operation !== OPERATION.ERROR, type, previous);
      next.operation = OPERATION.PAUSED;
      next.motion = MOTION.OFF;
      withSpeech(next, SPEECH.SILENT, 0, "assistant_pause");
      break;

    case EVENTS.RESUME_ASSISTANT:
      assertTransition(previous.operation === OPERATION.PAUSED, type, previous);
      next.operation = operationForSafety(previous.safety);
      next.dialogue = dialogueForSafety(previous.safety);
      next.motion = previous.safety === SAFETY.NORMAL ? ordinaryMotionFor(next) : MOTION.PROTECTION_STATIC;
      break;

    case EVENTS.RESET_SESSION:
      next.operation = operationForSafety(previous.safety);
      next.dialogue = dialogueForSafety(previous.safety);
      next.visibility = VISIBILITY.EXPANDED;
      withSpeech(next, SPEECH.SILENT, 0, null);
      next.motion = previous.safety === SAFETY.NORMAL ? ordinaryMotionFor(next) : MOTION.PROTECTION_STATIC;
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

    case EVENTS.SPEECH_REQUEST:
      assertTransition(!safetyAttention(previous), type, previous);
      assertTransition([OPERATION.PRESENTING, OPERATION.AWAITING_CLARIFICATION].includes(previous.operation), type, previous);
      withSpeech(next, SPEECH.STARTING, 0, null);
      next.motion = ordinaryMotionFor(next, next.operation, next.speech);
      break;

    case EVENTS.SPEECH_START:
      assertTransition(previous.speech === SPEECH.STARTING, type, previous);
      assertTransition(!safetyAttention(previous), type, previous);
      withSpeech(next, SPEECH.SPEAKING, 0.6, null);
      next.motion = ordinaryMotionFor(next, next.operation, next.speech);
      break;

    case EVENTS.SPEECH_BOUNDARY: {
      assertTransition(previous.speech === SPEECH.SPEAKING, type, previous);
      assertTransition(!safetyAttention(previous), type, previous);
      const energy = Number(eventValue(event, "energy", previous.speech_meta.energy || 1));
      assertTransition(Number.isFinite(energy) && energy >= 0 && energy <= 1, type, previous);
      next.speech_meta.boundary_count += 1;
      next.speech_meta.energy = energy;
      next.motion = ordinaryMotionFor(next, next.operation, next.speech);
      break;
    }

    case EVENTS.SPEECH_PAUSE:
      assertTransition(previous.speech === SPEECH.SPEAKING || previous.speech === SPEECH.STARTING, type, previous);
      withSpeech(next, SPEECH.PAUSED, 0, null);
      next.motion = MOTION.OFF;
      break;

    case EVENTS.SPEECH_RESUME:
      assertTransition(previous.speech === SPEECH.PAUSED, type, previous);
      assertTransition(!safetyAttention(previous), type, previous);
      withSpeech(next, SPEECH.SPEAKING, 0.6, null);
      next.motion = ordinaryMotionFor(next, next.operation, next.speech);
      break;

    case EVENTS.SPEECH_STOP:
      assertTransition([SPEECH.STARTING, SPEECH.SPEAKING, SPEECH.PAUSED].includes(previous.speech), type, previous);
      stopSpeech(next, "explicit_stop");
      break;

    case EVENTS.SPEECH_END:
      assertTransition([SPEECH.STARTING, SPEECH.SPEAKING, SPEECH.PAUSED].includes(previous.speech), type, previous);
      stopSpeech(next, "natural_end");
      break;

    case EVENTS.SPEECH_ERROR:
      withSpeech(next, SPEECH.ERROR, 0, "error");
      next.motion = activeProtection(next) ? MOTION.PROTECTION_STATIC : MOTION.OFF;
      break;

    case EVENTS.RISK_UNCERTAIN:
      assertTransition(previous.safety === SAFETY.NORMAL, type, previous);
      applySafety(next, SAFETY.UNCERTAIN);
      break;

    case EVENTS.RISK_CONFIRMED:
      assertTransition(previous.safety !== SAFETY.HUMAN_HANDOFF, type, previous);
      applySafety(next, SAFETY.RISK);
      break;

    case EVENTS.HUMAN_HANDOFF:
      assertTransition(previous.safety === SAFETY.RISK || previous.safety === SAFETY.UNCERTAIN, type, previous);
      applySafety(next, SAFETY.HUMAN_HANDOFF);
      break;

    case EVENTS.RISK_CLEARED:
      assertTransition(previous.safety === SAFETY.UNCERTAIN, type, previous);
      next.safety = SAFETY.NORMAL;
      next.operation = OPERATION.RETRIEVING;
      next.dialogue = DIALOGUE.CLARIFICATION;
      withSpeech(next, SPEECH.SILENT, 0, null);
      next.motion = MOTION.PROCESSING;
      break;

    case EVENTS.TECHNICAL_ERROR:
      next.operation = OPERATION.ERROR;
      next.dialogue = activeProtection(previous) ? DIALOGUE.HUMAN_HANDOFF : DIALOGUE.NONE;
      withSpeech(next, SPEECH.SILENT, 0, "technical_error");
      next.motion = safetyAttention(previous) ? MOTION.PROTECTION_STATIC : MOTION.OFF;
      break;

    case EVENTS.RETRY:
      assertTransition(previous.operation === OPERATION.ERROR, type, previous);
      next.operation = operationForSafety(previous.safety);
      next.dialogue = dialogueForSafety(previous.safety);
      withSpeech(next, SPEECH.SILENT, 0, null);
      next.motion = previous.safety === SAFETY.NORMAL ? ordinaryMotionFor(next) : MOTION.PROTECTION_STATIC;
      break;

    case EVENTS.SET_ADAPTATION: {
      if (hasOwn(event, "response_length")) {
        assertTransition(RESPONSE_LENGTHS.has(event.response_length), type, previous);
        next.adaptation.response_length = event.response_length;
      }
      if (hasOwn(event, "max_options")) {
        const maxOptions = Number(event.max_options);
        assertTransition(Number.isInteger(maxOptions) && maxOptions >= 1 && maxOptions <= 6, type, previous);
        next.adaptation.max_options = maxOptions;
      }
      if (hasOwn(event, "question_policy")) {
        assertTransition(QUESTION_POLICIES.has(event.question_policy), type, previous);
        next.adaptation.question_policy = event.question_policy;
      }
      if (hasOwn(event, "intensity")) {
        assertTransition(INTENSITIES.has(event.intensity), type, previous);
        next.adaptation.intensity = event.intensity;
      }
      if (hasOwn(event, "depth")) {
        assertTransition(DEPTHS.has(event.depth), type, previous);
        next.adaptation.depth = event.depth;
      }
      break;
    }

    case EVENTS.SET_LOW_INTENSITY: {
      const enabled = Boolean(eventValue(event, "enabled", eventValue(event, "value", true)));
      next.adaptation.intensity = enabled ? ADAPTATION.INTENSITY.LOW : ADAPTATION.INTENSITY.NORMAL;
      break;
    }

    case EVENTS.SET_RESPONSE_LENGTH: {
      const value = eventValue(event, "response_length", eventValue(event, "value", ADAPTATION.RESPONSE_LENGTH.NORMAL));
      assertTransition(RESPONSE_LENGTHS.has(value), type, previous);
      next.adaptation.response_length = value;
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
      const enabled = Boolean(eventValue(event, "enabled", eventValue(event, "value", false)));
      next.motion_meta.reduced = enabled;
      next.motion = safetyAttention(next) ? MOTION.PROTECTION_STATIC : ordinaryMotionFor(next, next.operation, next.speech);
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
