const path = require("path");

const root = path.resolve(__dirname, "..");
const machine = require(path.join(root, "sabik", "nea-core", "sabik-machine.js"));
const results = [];

function assert(name, condition, detail = "") {
  results.push({ name, ok: Boolean(condition), detail });
}

function step(state, event) {
  return machine.transitionSabikState(state, event);
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
  const {
    createInitialSabikState,
    transitionSabikState,
    validateSabikState,
    deriveSabikPresentation,
    SABIK_MACHINE
  } = machine;
  const { OPERATION, DIALOGUE, ADAPTATION, SAFETY, VISIBILITY, SPEECH, MOTION, EVENTS } = SABIK_MACHINE;

  assert(
    "S0-001 machine imports in Node without browser globals",
    typeof window === "undefined" && typeof createInitialSabikState === "function",
    "pure module must not require global.window"
  );

  const booting = createInitialSabikState();
  const booted = step(booting, EVENTS.BOOT_OK);
  assert(
    "S0-002 booting to ready",
    booting.operation === OPERATION.BOOTING &&
      booted.operation === OPERATION.READY &&
      validateSabikState(booted).ok,
    `${booting.operation} -> ${booted.operation}`
  );

  const readySnapshot = JSON.stringify(booted);
  const retrieving = step(booted, EVENTS.SUBMIT);
  const composing = step(retrieving, EVENTS.RETRIEVAL_OK);
  const presenting = step(composing, { type: EVENTS.RESPONSE_READY, dialogue: DIALOGUE.ANSWERING });
  assert(
    "S0-003 ready to retrieving to composing to presenting",
    retrieving.operation === OPERATION.RETRIEVING &&
      composing.operation === OPERATION.COMPOSING &&
      presenting.operation === OPERATION.PRESENTING &&
      presenting.dialogue === DIALOGUE.ANSWERING &&
      JSON.stringify(booted) === readySnapshot,
    `${retrieving.operation} -> ${composing.operation} -> ${presenting.operation}`
  );

  const speechStarting = step(presenting, EVENTS.SPEECH_START);
  const speaking = step(speechStarting, EVENTS.SPEECH_BOUNDARY);
  const speechPaused = step(speaking, EVENTS.SPEECH_PAUSE);
  const speechResumed = step(speechPaused, EVENTS.SPEECH_RESUME);
  const speechEnded = step(speechResumed, EVENTS.SPEECH_END);
  assert(
    "S0-004 presenting to speech_starting to speaking to speech_paused to speaking to speech_ended",
    speechStarting.speech.state === SPEECH.STARTING &&
      speechStarting.speech.energy === 0 &&
      speaking.speech.state === SPEECH.SPEAKING &&
      speechPaused.speech.state === SPEECH.PAUSED &&
      speechPaused.speech.energy === 0 &&
      speechResumed.speech.state === SPEECH.SPEAKING &&
      speechEnded.speech.state === SPEECH.ENDED &&
      speechEnded.speech.end_reason === "natural_end" &&
      deriveSabikPresentation(speechEnded).speech_energy === 0,
    `${speechStarting.speech.state} -> ${speaking.speech.state} -> ${speechPaused.speech.state} -> ${speechEnded.speech.state}`
  );

  const stopped = step(speaking, EVENTS.SPEECH_STOP);
  assert(
    "S0-005 speech stop and natural end are distinct",
    stopped.speech.state === SPEECH.ENDED &&
      stopped.speech.energy === 0 &&
      stopped.speech.end_reason === "explicit_stop" &&
      speechEnded.speech.end_reason === "natural_end",
    `${stopped.speech.end_reason}/${speechEnded.speech.end_reason}`
  );

  const assistantPaused = step(presenting, EVENTS.PAUSE_ASSISTANT);
  const assistantReady = step(assistantPaused, EVENTS.RESUME_ASSISTANT);
  assert(
    "S0-006 presenting to assistant_paused to ready",
    assistantPaused.operation === OPERATION.ASSISTANT_PAUSED &&
      assistantReady.operation === OPERATION.READY &&
      assistantReady.revision === assistantPaused.revision + 1,
    `${assistantPaused.operation} -> ${assistantReady.operation}`
  );

  const collapsed = step(assistantPaused, EVENTS.COLLAPSE);
  const expanded = step(collapsed, EVENTS.EXPAND);
  const pausedAgain = step(expanded, EVENTS.PAUSE_ASSISTANT);
  assert(
    "S0-007 assistant_paused to collapsed to expanded to assistant_paused",
    collapsed.operation === OPERATION.ASSISTANT_PAUSED &&
      collapsed.visibility === VISIBILITY.COLLAPSED &&
      expanded.operation === OPERATION.ASSISTANT_PAUSED &&
      expanded.visibility === VISIBILITY.EXPANDED &&
      pausedAgain.operation === OPERATION.ASSISTANT_PAUSED,
    `${collapsed.operation}/${collapsed.visibility} -> ${expanded.operation}/${expanded.visibility}`
  );

  const hidden = step(presenting, EVENTS.HIDE);
  const shown = step(hidden, EVENTS.SHOW);
  assert(
    "S0-008 hidden is only visibility and does not pause",
    hidden.visibility === VISIBILITY.HIDDEN &&
      hidden.operation === OPERATION.PRESENTING &&
      shown.visibility === VISIBILITY.EXPANDED &&
      shown.operation === OPERATION.PRESENTING,
    `${hidden.operation}/${hidden.visibility} -> ${shown.operation}/${shown.visibility}`
  );

  const riskUncertain = step(booted, EVENTS.RISK_UNCERTAIN);
  assert(
    "S0-009 ready to risk_uncertain to awaiting_clarification",
    riskUncertain.safety === SAFETY.RISK_UNCERTAIN &&
      riskUncertain.operation === OPERATION.AWAITING_CLARIFICATION &&
      riskUncertain.dialogue === DIALOGUE.AWAITING_CLARIFICATION,
    `${riskUncertain.safety}/${riskUncertain.operation}`
  );

  const riskConfirmed = step(booted, EVENTS.RISK_CONFIRMED);
  const humanHandoff = step(riskConfirmed, EVENTS.HUMAN_HANDOFF);
  assert(
    "S0-010 ready to risk_confirmed to human_handoff",
    riskConfirmed.safety === SAFETY.RISK_CONFIRMED &&
      riskConfirmed.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      humanHandoff.safety === SAFETY.HUMAN_HANDOFF &&
      humanHandoff.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      deriveSabikPresentation(humanHandoff).safety_priority === true,
    `${riskConfirmed.safety} -> ${humanHandoff.safety}`
  );

  const activeRisk = step(speaking, EVENTS.RISK_CONFIRMED);
  assert(
    "S0-011 risk confirmed preempts active presentation and speech",
    activeRisk.safety === SAFETY.RISK_CONFIRMED &&
      activeRisk.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      activeRisk.speech.state === SPEECH.SILENT &&
      activeRisk.speech.energy === 0 &&
      activeRisk.motion.state === MOTION.PROTECTION,
    `${activeRisk.safety}/${activeRisk.dialogue}/${activeRisk.speech.state}/${activeRisk.motion.state}`
  );

  expectThrow(
    "S0-012 ordinary speech is blocked during active protection",
    () => transitionSabikState(activeRisk, EVENTS.SPEECH_START),
    /Invalid Sabik state transition/u
  );

  const retrievingError = step(retrieving, { type: EVENTS.TECHNICAL_ERROR, message: "fallo local" });
  const retryReady = step(retrievingError, EVENTS.RETRY);
  assert(
    "S0-013 retrieving to error to retry to ready",
    retrievingError.operation === OPERATION.ERROR &&
      retrievingError.dialogue === DIALOGUE.ERROR &&
      retrievingError.error.message === "fallo local" &&
      retryReady.operation === OPERATION.READY &&
      retryReady.error === null,
    `${retrievingError.operation} -> ${retryReady.operation}`
  );

  const resetOrdinary = step(presenting, EVENTS.RESET_SESSION);
  const resetRisk = step(activeRisk, EVENTS.RESET_SESSION);
  const resetHandoff = step(humanHandoff, EVENTS.RESET_SESSION);
  assert(
    "S0-014 reset preserves confirmed protection and handoff",
    resetOrdinary.safety === SAFETY.NORMAL &&
      resetOrdinary.operation === OPERATION.READY &&
      resetRisk.safety === SAFETY.RISK_CONFIRMED &&
      resetRisk.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      resetRisk.motion.state === MOTION.PROTECTION &&
      resetHandoff.safety === SAFETY.HUMAN_HANDOFF &&
      resetHandoff.dialogue === DIALOGUE.HUMAN_HANDOFF,
    `${resetRisk.safety}/${resetHandoff.safety}`
  );

  const reducedMotion = step(presenting, { type: EVENTS.SET_REDUCED_MOTION, reduced: true });
  const speakingReduced = step(step(reducedMotion, EVENTS.SPEECH_START), EVENTS.SPEECH_BOUNDARY);
  assert(
    "S0-015 voice works with reduced motion",
    speakingReduced.motion.state === MOTION.REDUCED &&
      speakingReduced.motion.reduced === true &&
      speakingReduced.speech.state === SPEECH.SPEAKING &&
      deriveSabikPresentation(speakingReduced).text_available === true,
    `${speakingReduced.motion.state}/${speakingReduced.speech.state}`
  );

  const riskError = step(riskConfirmed, { type: EVENTS.TECHNICAL_ERROR, message: "fallo durante riesgo" });
  const retryRisk = step(riskError, EVENTS.RETRY);
  assert(
    "S0-016 technical error preserves active protection",
    riskError.operation === OPERATION.ERROR &&
      riskError.safety === SAFETY.RISK_CONFIRMED &&
      retryRisk.operation === OPERATION.PRESENTING &&
      retryRisk.safety === SAFETY.RISK_CONFIRMED &&
      retryRisk.dialogue === DIALOGUE.HUMAN_HANDOFF,
    `${riskError.operation}/${riskError.safety}`
  );

  const empty = step(retrieving, EVENTS.RETRIEVAL_EMPTY);
  const clarification = step(presenting, EVENTS.ASK_CLARIFICATION);
  const speechError = step(speaking, { type: EVENTS.SPEECH_ERROR, message: "voz no disponible" });
  assert(
    "S0-017 retrieval empty, clarification, and speech error are explicit states",
    empty.operation === OPERATION.PRESENTING &&
      empty.dialogue === DIALOGUE.INSUFFICIENT &&
      clarification.operation === OPERATION.AWAITING_CLARIFICATION &&
      clarification.dialogue === DIALOGUE.AWAITING_CLARIFICATION &&
      speechError.speech.state === SPEECH.ERROR &&
      speechError.speech.energy === 0 &&
      speechError.error.layer === "speech",
    `${empty.dialogue}/${clarification.operation}/${speechError.speech.state}`
  );

  const reducedOnly = step(booted, { type: EVENTS.SET_REDUCED_MOTION, reduced: true });
  assert(
    "S0-018 motion cannot declare that Sabik is speaking",
    reducedOnly.motion.state === MOTION.REDUCED &&
      reducedOnly.speech.state === SPEECH.SILENT &&
      deriveSabikPresentation(reducedOnly).speech_energy === 0,
    `${reducedOnly.motion.state}/${reducedOnly.speech.state}`
  );

  assert(
    "S0-019 confirmed risk overrides presentation decoration",
    deriveSabikPresentation(riskConfirmed).safety_priority === true &&
      deriveSabikPresentation(riskConfirmed).labels.status === "human_support_first",
    JSON.stringify(deriveSabikPresentation(riskConfirmed).labels)
  );

  const adaptation = step(booted, {
    type: EVENTS.SET_ADAPTATION,
    adaptation: {
      intensity: ADAPTATION.INTENSITY.LOW,
      depth: ADAPTATION.DEPTH.SHORT,
      max_options: 1,
      question_policy: ADAPTATION.QUESTION_POLICY.ONE_USEFUL_QUESTION
    }
  });
  const presentationForAdaptation = deriveSabikPresentation(adaptation);
  assert(
    "S0-020 NEA preferences remain adaptation, not diagnosis",
    adaptation.adaptation.intensity === ADAPTATION.INTENSITY.LOW &&
      adaptation.adaptation.depth === ADAPTATION.DEPTH.SHORT &&
      adaptation.safety === SAFETY.NORMAL &&
      presentationForAdaptation.labels.no_diagnosis === true &&
      presentationForAdaptation.adaptation.max_options === 1,
    JSON.stringify(presentationForAdaptation.adaptation)
  );

  const english = step(booted, { type: EVENTS.SET_LANGUAGE, language: "en" });
  assert(
    "S0-021 language is an independent layer",
    english.language === "en" &&
      english.operation === booted.operation &&
      english.safety === booted.safety,
    `${english.language}/${english.operation}`
  );

  const boundary = step(speechStarting, EVENTS.SPEECH_BOUNDARY);
  assert(
    "S0-022 speech boundary updates speech only",
    boundary.speech.boundary_count === speechStarting.speech.boundary_count + 1 &&
      boundary.motion.state === speechStarting.motion.state &&
      boundary.operation === speechStarting.operation,
    `${boundary.speech.boundary_count}`
  );

  const deterministicA = runPath(booted, [
    EVENTS.SUBMIT,
    EVENTS.RETRIEVAL_OK,
    { type: EVENTS.RESPONSE_READY, dialogue: DIALOGUE.ANSWERING },
    EVENTS.SPEECH_START,
    EVENTS.SPEECH_BOUNDARY,
    EVENTS.SPEECH_PAUSE
  ]);
  const deterministicB = runPath(booted, [
    EVENTS.SUBMIT,
    EVENTS.RETRIEVAL_OK,
    { type: EVENTS.RESPONSE_READY, dialogue: DIALOGUE.ANSWERING },
    EVENTS.SPEECH_START,
    EVENTS.SPEECH_BOUNDARY,
    EVENTS.SPEECH_PAUSE
  ]);
  assert(
    "S0-023 same input and event produce same result",
    JSON.stringify(deterministicA) === JSON.stringify(deterministicB),
    "transition must be deterministic"
  );

  expectThrow(
    "S0-024 invalid event fails explicitly",
    () => transitionSabikState(booted, "NOT_A_REAL_EVENT"),
    /Invalid Sabik state event/u
  );

  expectThrow(
    "S0-025 impossible event from state is rejected",
    () => transitionSabikState(booted, EVENTS.RETRIEVAL_OK),
    /Invalid Sabik state transition/u
  );

  const invalidSpeechEnergy = createInitialSabikState();
  invalidSpeechEnergy.speech.energy = 1;
  const invalidAdaptation = createInitialSabikState();
  delete invalidAdaptation.adaptation.depth;
  const invalidRevision = createInitialSabikState();
  invalidRevision.revision = -1;
  const invalidReactive = createInitialSabikState();
  invalidReactive.motion.state = MOTION.REACTIVE;
  const invalidReactiveRisk = cloneForTest(activeRisk);
  invalidReactiveRisk.motion.state = MOTION.REACTIVE;
  const invalidErrorAsInsufficient = cloneForTest(retrievingError);
  invalidErrorAsInsufficient.dialogue = DIALOGUE.INSUFFICIENT;
  assert(
    "S0-026 validate rejects incoherent canonical states",
    validateSabikState(invalidSpeechEnergy).ok === false &&
      validateSabikState(invalidAdaptation).ok === false &&
      validateSabikState(invalidRevision).ok === false &&
      validateSabikState(invalidReactive).ok === false &&
      validateSabikState(invalidReactiveRisk).ok === false &&
      validateSabikState(invalidErrorAsInsufficient).ok === false,
    "validation must reject malformed layers"
  );

  const failures = results.filter((item) => !item.ok);
  results.forEach((item) => {
    console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}${item.detail ? ` - ${item.detail}` : ""}`);
  });
  console.log(`\n${results.length - failures.length}/${results.length} validations passed`);
  if (failures.length) process.exitCode = 1;
}

function cloneForTest(value) {
  return JSON.parse(JSON.stringify(value));
}

run();
