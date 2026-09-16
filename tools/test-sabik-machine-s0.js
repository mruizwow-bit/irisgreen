const path = require("path");

const root = path.resolve(__dirname, "..");
const results = [];

function assert(name, condition, detail = "") {
  results.push({ name, ok: Boolean(condition), detail });
}

function loadMachine() {
  global.window = global;
  require(path.join(root, "sabik", "nea-core", "state.js"));
  require(path.join(root, "sabik", "nea-core", "sabik-machine.js"));
}

function step(state, event) {
  return window.NEASabikMachine.transitionSabikState(state, event);
}

function expectThrow(name, fn, pattern) {
  let threw = false;
  try {
    fn();
  } catch (error) {
    threw = pattern.test(error.message);
  }
  assert(name, threw, "expected explicit failure");
}

function runPath(initial, events) {
  return events.reduce((state, event) => step(state, event), initial);
}

function run() {
  loadMachine();

  const {
    createInitialSabikState,
    transitionSabikState,
    validateSabikState,
    deriveSabikPresentation,
    SABIK_MACHINE
  } = window.NEASabikMachine;
  const { OPERATIONAL, DIALOGUE, ADAPTATION, SAFETY, VISIBILITY, VOICE, MOTION, EVENTS } = SABIK_MACHINE;

  const booting = createInitialSabikState();
  const booted = step(booting, EVENTS.BOOT_OK);
  assert(
    "S0-001 booting to ready",
    booting.operational === OPERATIONAL.BOOTING &&
      booted.operational === OPERATIONAL.READY &&
      validateSabikState(booted).ok,
    `${booting.operational} -> ${booted.operational}`
  );

  const readySnapshot = JSON.stringify(booted);
  const retrieving = step(booted, EVENTS.SUBMIT);
  const composing = step(retrieving, EVENTS.RETRIEVAL_OK);
  const presenting = step(composing, EVENTS.RESPONSE_READY);
  assert(
    "S0-002 ready to retrieving to composing to presenting",
    retrieving.operational === OPERATIONAL.RETRIEVING &&
      composing.operational === OPERATIONAL.COMPOSING &&
      presenting.operational === OPERATIONAL.PRESENTING &&
      presenting.dialogue === DIALOGUE.ANSWERING &&
      JSON.stringify(booted) === readySnapshot,
    `${retrieving.operational} -> ${composing.operational} -> ${presenting.operational}`
  );

  const speaking = step(presenting, EVENTS.SPEECH_START);
  const speechPaused = step(speaking, EVENTS.SPEECH_PAUSE);
  const speechResumed = step(speechPaused, EVENTS.SPEECH_RESUME);
  const speechEnded = step(speechResumed, EVENTS.SPEECH_END);
  assert(
    "S0-003 presenting to speaking to speech_paused to speaking to speech_ended",
    speaking.voice.state === VOICE.SPEAKING &&
      speechPaused.voice.state === VOICE.PAUSED &&
      speechResumed.voice.state === VOICE.SPEAKING &&
      speechEnded.voice.state === VOICE.ENDED &&
      deriveSabikPresentation(speechEnded).voice_energy === 0,
    `${speaking.voice.state} -> ${speechPaused.voice.state} -> ${speechResumed.voice.state} -> ${speechEnded.voice.state}`
  );

  const assistantPaused = step(presenting, EVENTS.PAUSE_ASSISTANT);
  const assistantReady = step(assistantPaused, EVENTS.RESUME_ASSISTANT);
  assert(
    "S0-004 presenting to assistant_paused to ready",
    assistantPaused.operational === OPERATIONAL.ASSISTANT_PAUSED &&
      assistantReady.operational === OPERATIONAL.READY &&
      assistantReady.session_epoch === assistantPaused.session_epoch,
    `${assistantPaused.operational} -> ${assistantReady.operational}`
  );

  const collapsed = step(assistantPaused, EVENTS.COLLAPSE);
  const expanded = step(collapsed, EVENTS.EXPAND);
  const pausedAgain = step(expanded, EVENTS.PAUSE_ASSISTANT);
  assert(
    "S0-005 assistant_paused to collapsed to expanded to assistant_paused",
    collapsed.operational === OPERATIONAL.ASSISTANT_PAUSED &&
      collapsed.visibility === VISIBILITY.COLLAPSED &&
      expanded.operational === OPERATIONAL.ASSISTANT_PAUSED &&
      expanded.visibility === VISIBILITY.EXPANDED &&
      pausedAgain.operational === OPERATIONAL.ASSISTANT_PAUSED,
    `${collapsed.operational}/${collapsed.visibility} -> ${expanded.operational}/${expanded.visibility}`
  );

  const hidden = step(presenting, EVENTS.HIDE);
  const shown = step(hidden, EVENTS.SHOW);
  assert(
    "S0-006 hidden is only visibility and does not pause",
    hidden.visibility === VISIBILITY.HIDDEN &&
      hidden.operational === OPERATIONAL.PRESENTING &&
      shown.visibility === VISIBILITY.EXPANDED &&
      shown.operational === OPERATIONAL.PRESENTING,
    `${hidden.operational}/${hidden.visibility} -> ${shown.operational}/${shown.visibility}`
  );

  const riskUncertain = step(booted, EVENTS.RISK_UNCERTAIN);
  assert(
    "S0-007 ready to risk_uncertain to awaiting_clarification",
    riskUncertain.safety === SAFETY.RISK_UNCERTAIN &&
      riskUncertain.operational === OPERATIONAL.AWAITING_CLARIFICATION &&
      riskUncertain.dialogue === DIALOGUE.AWAITING_CLARIFICATION,
    `${riskUncertain.safety}/${riskUncertain.operational}`
  );

  const riskConfirmed = step(booted, EVENTS.RISK_CONFIRMED);
  const humanHandoff = step(riskConfirmed, EVENTS.HUMAN_HANDOFF);
  assert(
    "S0-008 ready to risk_confirmed to human_handoff",
    riskConfirmed.safety === SAFETY.RISK_CONFIRMED &&
      humanHandoff.safety === SAFETY.HUMAN_HANDOFF &&
      humanHandoff.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      deriveSabikPresentation(humanHandoff).safety_priority === true,
    `${riskConfirmed.safety} -> ${humanHandoff.safety}`
  );

  const retrievingError = step(retrieving, { type: EVENTS.TECHNICAL_ERROR, message: "fallo local" });
  const retryReady = step(retrievingError, EVENTS.RETRY);
  assert(
    "S0-009 retrieving to error to retry to ready",
    retrievingError.operational === OPERATIONAL.ERROR &&
      retrievingError.error.message === "fallo local" &&
      retryReady.operational === OPERATIONAL.READY &&
      retryReady.error === null,
    `${retrievingError.operational} -> ${retryReady.operational}`
  );

  const stableStates = [
    booted,
    presenting,
    assistantPaused,
    riskUncertain,
    humanHandoff,
    retrievingError,
    speechEnded
  ];
  assert(
    "S0-010 reset from stable states is the only session eraser",
    stableStates.every((state) => {
      const reset = step(state, EVENTS.RESET_SESSION);
      return reset.operational === OPERATIONAL.READY &&
        reset.session_epoch === state.session_epoch + 1 &&
        reset.visibility === VISIBILITY.EXPANDED &&
        reset.voice.state === VOICE.SILENT &&
        reset.safety === SAFETY.NORMAL;
    }) &&
      step(assistantPaused, EVENTS.RESUME_ASSISTANT).session_epoch === assistantPaused.session_epoch,
    "reset increments session_epoch; resume does not"
  );

  const reducedMotion = step(presenting, { type: EVENTS.SET_REDUCED_MOTION, value: true });
  const speakingReduced = step(reducedMotion, EVENTS.SPEECH_START);
  assert(
    "S0-011 voice works with reduced motion",
    speakingReduced.motion.state === MOTION.REDUCED &&
      speakingReduced.motion.reduced === true &&
      speakingReduced.voice.state === VOICE.SPEAKING &&
      deriveSabikPresentation(speakingReduced).text_available === true,
    `${speakingReduced.motion.state}/${speakingReduced.voice.state}`
  );

  const riskError = step(riskConfirmed, { type: EVENTS.TECHNICAL_ERROR, message: "fallo durante riesgo" });
  assert(
    "S0-012 technical error preserves active protection",
    riskError.operational === OPERATIONAL.ERROR &&
      riskError.safety === SAFETY.RISK_CONFIRMED &&
      riskError.error.message === "fallo durante riesgo",
    `${riskError.operational}/${riskError.safety}`
  );

  const empty = step(retrieving, EVENTS.RETRIEVAL_EMPTY);
  const clarification = step(presenting, EVENTS.ASK_CLARIFICATION);
  const speechError = step(speaking, { type: EVENTS.SPEECH_ERROR, message: "voz no disponible" });
  assert(
    "S0-013 retrieval empty, clarification, and speech error are explicit states",
    empty.operational === OPERATIONAL.PRESENTING &&
      empty.dialogue === DIALOGUE.INSUFFICIENT &&
      clarification.operational === OPERATIONAL.AWAITING_CLARIFICATION &&
      clarification.dialogue === DIALOGUE.AWAITING_CLARIFICATION &&
      speechError.voice.state === VOICE.ERROR &&
      speechError.error.layer === "voice",
    `${empty.dialogue}/${clarification.operational}/${speechError.voice.state}`
  );

  const reducedOnly = step(booted, { type: EVENTS.SET_REDUCED_MOTION, value: true });
  assert(
    "S0-014 motion cannot declare that Sabik is speaking",
    reducedOnly.motion.state === MOTION.REDUCED &&
      reducedOnly.voice.state === VOICE.SILENT &&
      deriveSabikPresentation(reducedOnly).voice_energy === 0,
    `${reducedOnly.motion.state}/${reducedOnly.voice.state}`
  );

  assert(
    "S0-015 confirmed risk overrides presentation decoration",
    deriveSabikPresentation(riskConfirmed).safety_priority === true &&
      deriveSabikPresentation(riskConfirmed).labels.status === "human_support_first",
    JSON.stringify(deriveSabikPresentation(riskConfirmed).labels)
  );

  const low = step(booted, { type: EVENTS.SET_LOW_INTENSITY, value: true });
  const short = step(low, { type: EVENTS.SET_RESPONSE_LENGTH, value: "short" });
  const maxOptions = step(short, { type: EVENTS.SET_MAX_OPTIONS, value: 1 });
  const questionPolicy = step(maxOptions, { type: EVENTS.SET_QUESTION_POLICY, value: "one_useful_question" });
  const presentation = deriveSabikPresentation(questionPolicy);
  assert(
    "S0-016 NEA preferences remain adaptation, not diagnosis",
    questionPolicy.adaptation.mode === ADAPTATION.LOW_INTENSITY &&
      questionPolicy.safety === SAFETY.NORMAL &&
      presentation.labels.no_diagnosis === true &&
      presentation.adaptation.response_length === "short" &&
      presentation.adaptation.max_options === 1,
    JSON.stringify(presentation.adaptation)
  );

  const english = step(booted, { type: EVENTS.SET_LANGUAGE, value: "en" });
  assert(
    "S0-017 language is an independent layer",
    english.language === "en" &&
      english.operational === booted.operational &&
      english.safety === booted.safety,
    `${english.language}/${english.operational}`
  );

  const boundary = step(speaking, EVENTS.SPEECH_BOUNDARY);
  assert(
    "S0-018 speech boundary updates voice only",
    boundary.voice.boundary_count === speaking.voice.boundary_count + 1 &&
      boundary.motion.state === speaking.motion.state &&
      boundary.operational === speaking.operational,
    `${boundary.voice.boundary_count}`
  );

  const deterministicA = runPath(booted, [
    EVENTS.SUBMIT,
    EVENTS.RETRIEVAL_OK,
    EVENTS.RESPONSE_READY,
    EVENTS.SPEECH_START,
    EVENTS.SPEECH_PAUSE
  ]);
  const deterministicB = runPath(booted, [
    EVENTS.SUBMIT,
    EVENTS.RETRIEVAL_OK,
    EVENTS.RESPONSE_READY,
    EVENTS.SPEECH_START,
    EVENTS.SPEECH_PAUSE
  ]);
  assert(
    "S0-019 same input and event produce same result",
    JSON.stringify(deterministicA) === JSON.stringify(deterministicB),
    "transition must be deterministic"
  );

  expectThrow(
    "S0-020 invalid event fails explicitly",
    () => transitionSabikState(booted, "NOT_A_REAL_EVENT"),
    /Invalid Sabik state event/u
  );

  expectThrow(
    "S0-021 impossible event from state is rejected",
    () => transitionSabikState(booted, EVENTS.RETRIEVAL_OK),
    /Invalid Sabik state transition/u
  );

  const invalidSilent = createInitialSabikState();
  invalidSilent.voice.energy = 1;
  assert(
    "S0-022 invalid silent voice energy is rejected",
    validateSabikState(invalidSilent).ok === false,
    validateSabikState(invalidSilent).errors.join(", ")
  );

  const failures = results.filter((item) => !item.ok);
  results.forEach((item) => {
    console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}${item.detail ? ` - ${item.detail}` : ""}`);
  });
  console.log(`\n${results.length - failures.length}/${results.length} validations passed`);
  if (failures.length) process.exitCode = 1;
}

run();
