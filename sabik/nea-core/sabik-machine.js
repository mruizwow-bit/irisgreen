(() => {
  const { SABIK_MACHINE } = window.NEACoreState;
  const {
    OPERATIONAL,
    DIALOGUE,
    ADAPTATION,
    SAFETY,
    VISIBILITY,
    VOICE,
    MOTION,
    LANGUAGE,
    EVENTS
  } = SABIK_MACHINE;

  const EVENT_VALUES = new Set(Object.values(EVENTS));
  const RESPONSE_LENGTHS = new Set(["normal", "short"]);
  const QUESTION_POLICIES = new Set(["normal", "low", "one_useful_question", "none"]);
  const LANGUAGES = new Set(Object.values(LANGUAGE));

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function eventType(event) {
    return typeof event === "string" ? event : event && event.type;
  }

  function eventValue(event, fallback) {
    return event && typeof event === "object" && Object.prototype.hasOwnProperty.call(event, "value")
      ? event.value
      : fallback;
  }

  function assertEvent(type) {
    if (!EVENT_VALUES.has(type)) {
      throw new Error(`Invalid Sabik state event: ${String(type)}`);
    }
  }

  function assertTransition(condition, type, state) {
    if (!condition) {
      throw new Error(`Invalid Sabik state transition: ${type} from ${state.operational}`);
    }
  }

  function createInitialSabikState(options = {}) {
    return {
      operational: OPERATIONAL.BOOTING,
      dialogue: DIALOGUE.IDLE,
      adaptation: {
        mode: ADAPTATION.STANDARD,
        low_intensity: false,
        response_length: "normal",
        max_options: 3,
        question_policy: "normal"
      },
      safety: SAFETY.NORMAL,
      visibility: VISIBILITY.EXPANDED,
      voice: {
        state: VOICE.SILENT,
        boundary_count: 0,
        energy: 0
      },
      motion: {
        state: options.reduced_motion ? MOTION.REDUCED : MOTION.ENABLED,
        reduced: Boolean(options.reduced_motion)
      },
      language: LANGUAGES.has(options.language) ? options.language : LANGUAGE.ES,
      session_epoch: Number.isInteger(options.session_epoch) ? options.session_epoch : 0,
      error: null,
      last_event: null
    };
  }

  function validateSabikState(state) {
    const errors = [];
    if (!state || typeof state !== "object") errors.push("state must be an object");
    if (state && !Object.values(OPERATIONAL).includes(state.operational)) errors.push("invalid operational");
    if (state && !Object.values(DIALOGUE).includes(state.dialogue)) errors.push("invalid dialogue");
    if (state && !Object.values(SAFETY).includes(state.safety)) errors.push("invalid safety");
    if (state && !Object.values(VISIBILITY).includes(state.visibility)) errors.push("invalid visibility");
    if (state && (!state.voice || !Object.values(VOICE).includes(state.voice.state))) errors.push("invalid voice");
    if (state && (!state.motion || !Object.values(MOTION).includes(state.motion.state))) errors.push("invalid motion");
    if (state && !LANGUAGES.has(state.language)) errors.push("invalid language");
    if (state && (!state.adaptation || !Object.values(ADAPTATION).includes(state.adaptation.mode))) errors.push("invalid adaptation");
    if (state && state.voice && state.voice.state === VOICE.SILENT && state.voice.energy !== 0) {
      errors.push("silent voice must have zero energy");
    }
    if (state && state.safety === SAFETY.HUMAN_HANDOFF && state.dialogue !== DIALOGUE.HUMAN_HANDOFF) {
      errors.push("human handoff safety requires human handoff dialogue");
    }
    return {
      ok: errors.length === 0,
      errors
    };
  }

  function assertValidState(state) {
    const result = validateSabikState(state);
    if (!result.ok) throw new Error(`Invalid Sabik state: ${result.errors.join(", ")}`);
  }

  function deriveSabikPresentation(state) {
    assertValidState(state);
    const safetyPriority = state.safety === SAFETY.RISK_CONFIRMED || state.safety === SAFETY.HUMAN_HANDOFF;
    const hidden = state.visibility === VISIBILITY.HIDDEN;
    const collapsed = state.visibility === VISIBILITY.COLLAPSED;
    const voiceEnergy = state.voice.state === VOICE.SILENT || state.voice.state === VOICE.ENDED
      ? 0
      : state.voice.energy;
    return {
      visible: !hidden,
      collapsed,
      text_available: true,
      safety_priority: safetyPriority,
      dialogue: state.dialogue,
      operational: state.operational,
      voice_state: state.voice.state,
      voice_energy: voiceEnergy,
      motion_state: state.motion.state,
      motion_reduced: state.motion.reduced,
      language: state.language,
      adaptation: {
        low_intensity: state.adaptation.low_intensity,
        response_length: state.adaptation.response_length,
        max_options: state.adaptation.max_options,
        question_policy: state.adaptation.question_policy
      },
      labels: {
        status: safetyPriority ? "human_support_first" : state.operational,
        no_diagnosis: true
      }
    };
  }

  function canRetrieve(state) {
    return state.operational === OPERATIONAL.READY || state.operational === OPERATIONAL.PRESENTING;
  }

  function transitionSabikState(currentState, event) {
    const type = eventType(event);
    assertEvent(type);

    const previous = currentState || createInitialSabikState();
    assertValidState(previous);

    if (type === EVENTS.RESET_SESSION) {
      const reset = createInitialSabikState({
        language: previous.language,
        reduced_motion: previous.motion.reduced,
        session_epoch: previous.session_epoch + 1
      });
      reset.operational = OPERATIONAL.READY;
      reset.last_event = type;
      assertValidState(reset);
      return reset;
    }

    const next = clone(previous);
    next.last_event = type;

    switch (type) {
      case EVENTS.BOOT_OK:
        assertTransition(previous.operational === OPERATIONAL.BOOTING, type, previous);
        next.operational = OPERATIONAL.READY;
        next.dialogue = DIALOGUE.IDLE;
        next.error = null;
        break;

      case EVENTS.SUBMIT:
        assertTransition(canRetrieve(previous), type, previous);
        next.operational = OPERATIONAL.RETRIEVING;
        next.dialogue = DIALOGUE.IDLE;
        next.voice = {
          state: VOICE.SILENT,
          boundary_count: previous.voice.boundary_count,
          energy: 0
        };
        next.error = null;
        break;

      case EVENTS.RETRIEVAL_OK:
        assertTransition(previous.operational === OPERATIONAL.RETRIEVING, type, previous);
        next.operational = OPERATIONAL.COMPOSING;
        next.error = null;
        break;

      case EVENTS.RETRIEVAL_EMPTY:
        assertTransition(previous.operational === OPERATIONAL.RETRIEVING, type, previous);
        next.operational = OPERATIONAL.PRESENTING;
        next.dialogue = DIALOGUE.INSUFFICIENT;
        next.error = null;
        break;

      case EVENTS.RESPONSE_READY:
        assertTransition(previous.operational === OPERATIONAL.COMPOSING, type, previous);
        next.operational = OPERATIONAL.PRESENTING;
        next.dialogue = DIALOGUE.ANSWERING;
        next.error = null;
        break;

      case EVENTS.ASK_CLARIFICATION:
        assertTransition(
          previous.operational === OPERATIONAL.READY ||
            previous.operational === OPERATIONAL.COMPOSING ||
            previous.operational === OPERATIONAL.PRESENTING,
          type,
          previous
        );
        next.operational = OPERATIONAL.AWAITING_CLARIFICATION;
        next.dialogue = DIALOGUE.AWAITING_CLARIFICATION;
        break;

      case EVENTS.PAUSE_ASSISTANT:
        assertTransition(previous.operational !== OPERATIONAL.ERROR, type, previous);
        next.operational = OPERATIONAL.ASSISTANT_PAUSED;
        break;

      case EVENTS.RESUME_ASSISTANT:
        assertTransition(previous.operational === OPERATIONAL.ASSISTANT_PAUSED, type, previous);
        next.operational = OPERATIONAL.READY;
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
        assertTransition(
          previous.operational === OPERATIONAL.PRESENTING ||
            previous.operational === OPERATIONAL.AWAITING_CLARIFICATION,
          type,
          previous
        );
        next.voice.state = VOICE.SPEAKING;
        next.voice.energy = 1;
        break;

      case EVENTS.SPEECH_BOUNDARY:
        assertTransition(previous.voice.state === VOICE.SPEAKING || previous.voice.state === VOICE.STARTING, type, previous);
        next.voice.state = VOICE.SPEAKING;
        next.voice.boundary_count += 1;
        next.voice.energy = Math.max(next.voice.energy, 1);
        break;

      case EVENTS.SPEECH_PAUSE:
        assertTransition(previous.voice.state === VOICE.SPEAKING, type, previous);
        next.voice.state = VOICE.PAUSED;
        next.voice.energy = 0.25;
        break;

      case EVENTS.SPEECH_RESUME:
        assertTransition(previous.voice.state === VOICE.PAUSED, type, previous);
        next.voice.state = VOICE.SPEAKING;
        next.voice.energy = 1;
        break;

      case EVENTS.SPEECH_END:
        assertTransition(previous.voice.state === VOICE.SPEAKING || previous.voice.state === VOICE.PAUSED, type, previous);
        next.voice.state = VOICE.ENDED;
        next.voice.energy = 0;
        break;

      case EVENTS.SPEECH_ERROR:
        next.voice.state = VOICE.ERROR;
        next.voice.energy = 0;
        next.error = {
          layer: "voice",
          message: event && event.message ? String(event.message) : "speech_error"
        };
        break;

      case EVENTS.RISK_UNCERTAIN:
        assertTransition(previous.operational === OPERATIONAL.READY, type, previous);
        next.safety = SAFETY.RISK_UNCERTAIN;
        next.operational = OPERATIONAL.AWAITING_CLARIFICATION;
        next.dialogue = DIALOGUE.AWAITING_CLARIFICATION;
        break;

      case EVENTS.RISK_CONFIRMED:
        assertTransition(previous.operational === OPERATIONAL.READY || previous.safety === SAFETY.RISK_UNCERTAIN, type, previous);
        next.safety = SAFETY.RISK_CONFIRMED;
        break;

      case EVENTS.HUMAN_HANDOFF:
        assertTransition(previous.safety === SAFETY.RISK_CONFIRMED || previous.safety === SAFETY.RISK_UNCERTAIN, type, previous);
        next.safety = SAFETY.HUMAN_HANDOFF;
        next.dialogue = DIALOGUE.HUMAN_HANDOFF;
        next.operational = OPERATIONAL.PRESENTING;
        break;

      case EVENTS.TECHNICAL_ERROR:
        next.operational = OPERATIONAL.ERROR;
        next.error = {
          layer: "operational",
          message: event && event.message ? String(event.message) : "technical_error"
        };
        break;

      case EVENTS.RETRY:
        assertTransition(previous.operational === OPERATIONAL.ERROR, type, previous);
        next.operational = OPERATIONAL.READY;
        next.dialogue = DIALOGUE.IDLE;
        next.error = null;
        break;

      case EVENTS.SET_LOW_INTENSITY:
        next.adaptation.low_intensity = Boolean(eventValue(event, true));
        next.adaptation.mode = next.adaptation.low_intensity ? ADAPTATION.LOW_INTENSITY : ADAPTATION.STANDARD;
        break;

      case EVENTS.SET_RESPONSE_LENGTH: {
        const value = eventValue(event, "normal");
        assertTransition(RESPONSE_LENGTHS.has(value), type, previous);
        next.adaptation.response_length = value;
        break;
      }

      case EVENTS.SET_MAX_OPTIONS: {
        const value = Number(eventValue(event, 3));
        assertTransition(Number.isInteger(value) && value >= 1 && value <= 6, type, previous);
        next.adaptation.max_options = value;
        break;
      }

      case EVENTS.SET_QUESTION_POLICY: {
        const value = eventValue(event, "normal");
        assertTransition(QUESTION_POLICIES.has(value), type, previous);
        next.adaptation.question_policy = value;
        break;
      }

      case EVENTS.SET_REDUCED_MOTION:
        next.motion.reduced = Boolean(eventValue(event, true));
        next.motion.state = next.motion.reduced ? MOTION.REDUCED : MOTION.ENABLED;
        break;

      case EVENTS.SET_LANGUAGE: {
        const value = eventValue(event, LANGUAGE.ES);
        assertTransition(LANGUAGES.has(value), type, previous);
        next.language = value;
        break;
      }

      default:
        throw new Error(`Unhandled Sabik state event: ${type}`);
    }

    assertValidState(next);
    return next;
  }

  window.NEASabikMachine = {
    createInitialSabikState,
    transitionSabikState,
    validateSabikState,
    deriveSabikPresentation,
    SABIK_MACHINE
  };
})();
