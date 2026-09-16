const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const machinePath = path.join(root, "sabik", "nea-core", "sabik-machine.js");
const statePath = path.join(root, "sabik", "nea-core", "state.js");
const machine = require(machinePath);
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

function expectThrowNoChange(name, state, event, pattern) {
  const before = JSON.stringify(state);
  let threw = false;
  try {
    machine.transitionSabikState(state, event);
  } catch (error) {
    threw = pattern.test(error.message);
  }
  assert(name, threw && JSON.stringify(state) === before, "expected explicit failure without mutating previous state");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function keysOf(value) {
  return Object.keys(value).sort().join(",");
}

function run() {
  const {
    createInitialSabikState,
    transitionSabikState,
    validateSabikState,
    deriveSabikPresentation,
    SABIK_MACHINE
  } = machine;
  const { OPERATION, DIALOGUE, ADAPTATION, SAFETY, VISIBILITY, SPEECH, MOTION, LANGUAGE, EVENTS } = SABIK_MACHINE;

  const expectedKeys = [
    "adaptation",
    "dialogue",
    "language",
    "motion",
    "motion_meta",
    "operation",
    "revision",
    "safety",
    "speech",
    "speech_meta",
    "visibility"
  ].join(",");
  const canonicalScalarKeys = [
    "adaptation",
    "dialogue",
    "language",
    "motion",
    "operation",
    "revision",
    "safety",
    "speech",
    "visibility"
  ].join(",");

  assert(
    "S0-001 pure module imports in Node without browser globals",
    typeof window === "undefined" && typeof createInitialSabikState === "function",
    "sabik-machine.js must not require global.window"
  );

  const browserStateSource = fs.readFileSync(statePath, "utf8");
  assert(
    "S0-002 state.js does not duplicate the S0 contract catalogue",
    !browserStateSource.includes("SABIK_MACHINE"),
    "sabik-machine.js is the only S0 contract source"
  );

  const initial = createInitialSabikState();
  assert(
    "S0-003 public state uses canonical scalar fields plus allowed metadata",
    keysOf(initial) === expectedKeys &&
      initial.operation === OPERATION.BOOTING &&
      initial.dialogue === DIALOGUE.NONE &&
      initial.safety === SAFETY.NORMAL &&
      initial.speech === SPEECH.SILENT &&
      initial.motion === MOTION.OFF &&
      initial.speech_meta.energy === 0 &&
      validateSabikState(initial).ok,
    keysOf(initial)
  );

  const minimalInitial = clone(initial);
  delete minimalInitial.speech_meta;
  delete minimalInitial.motion_meta;
  assert(
    "S0-004 public scalar contract accepts optional metadata omission",
    keysOf(minimalInitial) === canonicalScalarKeys &&
      validateSabikState(minimalInitial).ok &&
      deriveSabikPresentation(minimalInitial).speech_energy === 0 &&
      deriveSabikPresentation(minimalInitial).motion_reduced === false,
    keysOf(minimalInitial)
  );

  const serializedInitial = JSON.stringify(initial);
  assert(
    "S0-005 deprecated public values are absent",
    !/assistant_paused|idle|answering|risk_uncertain|risk_confirmed|speech_starting|speech_paused|reactive|protection|standard/u.test(serializedInitial),
    serializedInitial
  );

  [EVENTS.SUBMIT, EVENTS.PAUSE_ASSISTANT, EVENTS.RESET_SESSION, EVENTS.SPEECH_REQUEST, EVENTS.SPEECH_START].forEach((eventName) => {
    expectThrowNoChange(
      `S0-006 booting rejects ordinary event ${eventName}`,
      initial,
      eventName,
      /Invalid Sabik state transition/u
    );
  });

  const bootError = step(initial, { type: EVENTS.TECHNICAL_ERROR, message: "fallo de arranque" });
  const bootRetry = step(bootError, EVENTS.RETRY);
  const bootReady = step(bootRetry, EVENTS.BOOT_OK);
  assert(
    "S0-007 boot technical error retries to booting before ready",
    bootError.operation === OPERATION.ERROR &&
      bootError.error_meta.origin_operation === OPERATION.BOOTING &&
      bootRetry.operation === OPERATION.BOOTING &&
      bootRetry.motion === MOTION.OFF &&
      !Object.prototype.hasOwnProperty.call(bootRetry, "error_meta") &&
      bootReady.operation === OPERATION.READY,
    `${bootError.operation}/${bootError.error_meta && bootError.error_meta.origin_operation}/${bootRetry.operation}/${bootReady.operation}`
  );

  const ready = step(initial, EVENTS.BOOT_OK);
  assert(
    "S0-008 booting to ready",
    ready.operation === OPERATION.READY && ready.motion === MOTION.AMBIENT && ready.dialogue === DIALOGUE.NONE,
    `${ready.operation}/${ready.motion}/${ready.dialogue}`
  );

  const readySnapshot = JSON.stringify(ready);
  const retrieving = step(ready, EVENTS.SUBMIT);
  const composing = step(retrieving, EVENTS.RETRIEVAL_OK);
  const presentingInfo = step(composing, { type: EVENTS.RESPONSE_READY, dialogue: DIALOGUE.INFORMATION });
  assert(
    "S0-009 ready to retrieving to composing to presenting",
    retrieving.operation === OPERATION.RETRIEVING &&
      retrieving.motion === MOTION.PROCESSING &&
      composing.operation === OPERATION.COMPOSING &&
      composing.motion === MOTION.PROCESSING &&
      presentingInfo.operation === OPERATION.PRESENTING &&
      presentingInfo.dialogue === DIALOGUE.INFORMATION &&
      JSON.stringify(ready) === readySnapshot,
    `${retrieving.operation} -> ${composing.operation} -> ${presentingInfo.operation}/${presentingInfo.dialogue}`
  );

  const ordinaryClarification = step(presentingInfo, EVENTS.ASK_CLARIFICATION);
  const clarificationSubmit = step(ordinaryClarification, EVENTS.SUBMIT);
  assert(
    "S0-010 ordinary clarification submit returns to retrieval without changing safety",
    ordinaryClarification.operation === OPERATION.AWAITING_CLARIFICATION &&
      ordinaryClarification.dialogue === DIALOGUE.CLARIFICATION &&
      clarificationSubmit.operation === OPERATION.RETRIEVING &&
      clarificationSubmit.dialogue === DIALOGUE.CLARIFICATION &&
      clarificationSubmit.safety === SAFETY.NORMAL,
    `${clarificationSubmit.operation}/${clarificationSubmit.dialogue}/${clarificationSubmit.safety}`
  );

  const empty = step(retrieving, EVENTS.RETRIEVAL_EMPTY);
  assert(
    "S0-011 retrieval empty presents insufficient",
    empty.operation === OPERATION.PRESENTING && empty.dialogue === DIALOGUE.INSUFFICIENT,
    `${empty.operation}/${empty.dialogue}`
  );

  const uncertain = step(ready, EVENTS.RISK_UNCERTAIN);
  const uncertainSubmit = step(uncertain, EVENTS.SUBMIT);
  const uncertainReset = step(uncertainSubmit, EVENTS.RESET_SESSION);
  const cleared = step(uncertainReset, EVENTS.RISK_CLEARED);
  assert(
    "S0-012 uncertain safety survives submit and reset until RISK_CLEARED",
    uncertain.safety === SAFETY.UNCERTAIN &&
      uncertain.operation === OPERATION.AWAITING_CLARIFICATION &&
      uncertain.dialogue === DIALOGUE.CLARIFICATION &&
      uncertainSubmit.safety === SAFETY.UNCERTAIN &&
      uncertainSubmit.operation === OPERATION.AWAITING_CLARIFICATION &&
      uncertainReset.safety === SAFETY.UNCERTAIN &&
      cleared.safety === SAFETY.NORMAL &&
      cleared.operation === OPERATION.RETRIEVING &&
      cleared.dialogue === DIALOGUE.CLARIFICATION &&
      cleared.speech === SPEECH.SILENT &&
      cleared.motion === MOTION.PROCESSING,
    `${uncertainSubmit.safety}/${uncertainReset.safety}/${cleared.safety}/${cleared.operation}/${cleared.motion}`
  );

  expectThrowNoChange(
    "S0-013 RISK_CLEARED is rejected from normal without revision change",
    ready,
    EVENTS.RISK_CLEARED,
    /Invalid Sabik state transition/u
  );

  const uncertainPaused = step(uncertain, EVENTS.PAUSE_ASSISTANT);
  const resumedUncertain = step(uncertainPaused, EVENTS.RESUME_ASSISTANT);
  const uncertainError = step(uncertain, { type: EVENTS.TECHNICAL_ERROR, message: "fallo en aclaracion" });
  const uncertainRetry = step(uncertainError, EVENTS.RETRY);
  assert(
    "S0-014 uncertain safety preserves protection across pause, technical error, and retry",
    uncertainPaused.operation === OPERATION.PAUSED &&
      uncertainPaused.dialogue === DIALOGUE.CLARIFICATION &&
      uncertainPaused.safety === SAFETY.UNCERTAIN &&
      uncertainPaused.motion === MOTION.PROTECTION_STATIC &&
      resumedUncertain.operation === OPERATION.AWAITING_CLARIFICATION &&
      resumedUncertain.dialogue === DIALOGUE.CLARIFICATION &&
      resumedUncertain.motion === MOTION.PROTECTION_STATIC &&
      uncertainError.operation === OPERATION.ERROR &&
      uncertainError.dialogue === DIALOGUE.CLARIFICATION &&
      uncertainError.safety === SAFETY.UNCERTAIN &&
      uncertainError.motion === MOTION.PROTECTION_STATIC &&
      uncertainError.error_meta.origin_operation === OPERATION.AWAITING_CLARIFICATION &&
      uncertainRetry.operation === OPERATION.AWAITING_CLARIFICATION &&
      uncertainRetry.dialogue === DIALOGUE.CLARIFICATION &&
      uncertainRetry.safety === SAFETY.UNCERTAIN &&
      uncertainRetry.motion === MOTION.PROTECTION_STATIC,
    `${uncertainPaused.operation}/${uncertainError.operation}/${uncertainRetry.operation}`
  );

  expectThrowNoChange(
    "S0-015 RISK_CLEARED is rejected from paused uncertain without revision change",
    uncertainPaused,
    EVENTS.RISK_CLEARED,
    /Invalid Sabik state transition/u
  );

  const speechRequested = step(presentingInfo, EVENTS.SPEECH_REQUEST);
  const speechStarted = step(speechRequested, EVENTS.SPEECH_START);
  const boundary = step(speechStarted, { type: EVENTS.SPEECH_BOUNDARY, energy: 0.82 });
  assert(
    "S0-016 speech request, real start, and boundary are distinct",
    speechRequested.speech === SPEECH.STARTING &&
      speechRequested.speech_meta.energy === 0 &&
      speechRequested.motion === MOTION.AMBIENT &&
      speechStarted.speech === SPEECH.SPEAKING &&
      speechStarted.motion === MOTION.VOICE_REACTIVE &&
      boundary.speech === SPEECH.SPEAKING &&
      boundary.speech_meta.boundary_count === speechStarted.speech_meta.boundary_count + 1 &&
      boundary.speech_meta.energy === 0.82,
    `${speechRequested.speech}/${speechStarted.speech}/${boundary.speech_meta.energy}`
  );

  const speechPaused = step(boundary, EVENTS.SPEECH_PAUSE);
  const speechResumed = step(speechPaused, EVENTS.SPEECH_RESUME);
  const speechStopped = step(speechResumed, EVENTS.SPEECH_STOP);
  const naturalSpeech = step(step(speechRequested, EVENTS.SPEECH_START), EVENTS.SPEECH_END);
  const speechError = step(step(speechRequested, EVENTS.SPEECH_START), EVENTS.SPEECH_ERROR);
  assert(
    "S0-017 speech pause, resume, stop, end, and error update motion and metadata",
    speechPaused.speech === SPEECH.PAUSED &&
      speechPaused.speech_meta.energy === 0 &&
      speechPaused.motion === MOTION.OFF &&
      speechResumed.speech === SPEECH.SPEAKING &&
      speechResumed.motion === MOTION.VOICE_REACTIVE &&
      speechStopped.speech === SPEECH.ENDED &&
      speechStopped.speech_meta.end_reason === "explicit_stop" &&
      speechStopped.motion === MOTION.AMBIENT &&
      naturalSpeech.speech_meta.end_reason === "natural_end" &&
      speechError.speech === SPEECH.ERROR &&
      speechError.speech_meta.energy === 0 &&
      speechError.motion === MOTION.OFF,
    `${speechPaused.speech}/${speechPaused.motion}/${speechError.motion}`
  );

  const activeRisk = step(boundary, EVENTS.RISK_CONFIRMED);
  const handoff = step(activeRisk, EVENTS.HUMAN_HANDOFF);
  const resetRisk = step(activeRisk, EVENTS.RESET_SESSION);
  const resetHandoff = step(handoff, EVENTS.RESET_SESSION);
  const riskSpeechError = step(activeRisk, EVENTS.SPEECH_ERROR);
  const pausedRisk = step(activeRisk, EVENTS.PAUSE_ASSISTANT);
  const resumedRisk = step(pausedRisk, EVENTS.RESUME_ASSISTANT);
  const pausedHandoff = step(handoff, EVENTS.PAUSE_ASSISTANT);
  const resumedHandoff = step(pausedHandoff, EVENTS.RESUME_ASSISTANT);
  assert(
    "S0-018 confirmed risk preempts active voice and pause/reset preserve protection",
    activeRisk.safety === SAFETY.RISK &&
      activeRisk.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      activeRisk.speech === SPEECH.SILENT &&
      activeRisk.speech_meta.energy === 0 &&
      activeRisk.motion === MOTION.PROTECTION_STATIC &&
      handoff.safety === SAFETY.HUMAN_HANDOFF &&
      resetRisk.safety === SAFETY.RISK &&
      resetRisk.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      resetHandoff.safety === SAFETY.HUMAN_HANDOFF &&
      riskSpeechError.speech === SPEECH.ERROR &&
      riskSpeechError.motion === MOTION.PROTECTION_STATIC &&
      pausedRisk.operation === OPERATION.PAUSED &&
      pausedRisk.motion === MOTION.PROTECTION_STATIC &&
      resumedRisk.operation === OPERATION.PRESENTING &&
      resumedRisk.motion === MOTION.PROTECTION_STATIC &&
      pausedHandoff.operation === OPERATION.PAUSED &&
      pausedHandoff.motion === MOTION.PROTECTION_STATIC &&
      resumedHandoff.operation === OPERATION.PRESENTING &&
      resumedHandoff.motion === MOTION.PROTECTION_STATIC,
    `${activeRisk.safety}/${handoff.safety}/${riskSpeechError.motion}/${pausedRisk.motion}/${pausedHandoff.motion}`
  );

  expectThrowNoChange(
    "S0-019 RISK_CLEARED is rejected from confirmed risk without revision change",
    activeRisk,
    EVENTS.RISK_CLEARED,
    /Invalid Sabik state transition/u
  );

  expectThrowNoChange(
    "S0-020 RISK_CLEARED is rejected from human handoff without revision change",
    handoff,
    EVENTS.RISK_CLEARED,
    /Invalid Sabik state transition/u
  );

  expectThrow(
    "S0-021 ordinary speech is blocked during safety attention",
    () => transitionSabikState(activeRisk, EVENTS.SPEECH_REQUEST),
    /Invalid Sabik state transition/u
  );

  const riskError = step(activeRisk, { type: EVENTS.TECHNICAL_ERROR, message: "fallo durante riesgo" });
  const retryRisk = step(riskError, EVENTS.RETRY);
  assert(
    "S0-022 technical error preserves active protection",
    riskError.operation === OPERATION.ERROR &&
      riskError.safety === SAFETY.RISK &&
      riskError.dialogue === DIALOGUE.HUMAN_HANDOFF &&
      retryRisk.operation === OPERATION.PRESENTING &&
      retryRisk.safety === SAFETY.RISK &&
      retryRisk.motion === MOTION.PROTECTION_STATIC,
    `${riskError.operation}/${riskError.safety}/${retryRisk.operation}`
  );

  const pauseAssistant = step(presentingInfo, EVENTS.PAUSE_ASSISTANT);
  const collapsed = step(pauseAssistant, EVENTS.COLLAPSE);
  const expanded = step(collapsed, EVENTS.EXPAND);
  const resumedAssistant = step(expanded, EVENTS.RESUME_ASSISTANT);
  assert(
    "S0-023 pause is operational and visibility does not change pause",
    pauseAssistant.operation === OPERATION.PAUSED &&
      collapsed.operation === OPERATION.PAUSED &&
      collapsed.visibility === VISIBILITY.COLLAPSED &&
      expanded.operation === OPERATION.PAUSED &&
      resumedAssistant.operation === OPERATION.READY,
    `${collapsed.operation}/${collapsed.visibility} -> ${resumedAssistant.operation}`
  );

  const hidden = step(presentingInfo, EVENTS.HIDE);
  const shown = step(hidden, EVENTS.SHOW);
  assert(
    "S0-024 hide and show only affect visibility",
    hidden.visibility === VISIBILITY.HIDDEN &&
      hidden.operation === OPERATION.PRESENTING &&
      shown.visibility === VISIBILITY.EXPANDED &&
      shown.operation === OPERATION.PRESENTING,
    `${hidden.operation}/${hidden.visibility}`
  );

  const reducedMotion = step(presentingInfo, { type: EVENTS.SET_REDUCED_MOTION, enabled: true });
  const reducedSpeech = step(step(reducedMotion, EVENTS.SPEECH_REQUEST), EVENTS.SPEECH_START);
  const restoredMotion = step(reducedSpeech, { type: EVENTS.SET_REDUCED_MOTION, enabled: false });
  assert(
    "S0-025 voice works with reduced motion and motion recovers explicitly",
    reducedMotion.motion === MOTION.OFF &&
      reducedMotion.motion_meta.reduced === true &&
      reducedSpeech.speech === SPEECH.SPEAKING &&
      reducedSpeech.motion === MOTION.OFF &&
      restoredMotion.motion_meta.reduced === false &&
      restoredMotion.motion === MOTION.VOICE_REACTIVE,
    `${reducedSpeech.speech}/${reducedSpeech.motion}/${restoredMotion.motion}`
  );

  const exactAdaptation = step(ready, {
    type: EVENTS.SET_ADAPTATION,
    response_length: "short",
    max_options: 1,
    question_policy: "low",
    intensity: "low",
    depth: "normal"
  });
  const english = step(exactAdaptation, { type: EVENTS.SET_LANGUAGE, language: "en" });
  assert(
    "S0-026 exact QA payloads update adaptation and language",
    exactAdaptation.adaptation.response_length === "short" &&
      exactAdaptation.adaptation.max_options === 1 &&
      exactAdaptation.adaptation.question_policy === "low" &&
      exactAdaptation.adaptation.intensity === "low" &&
      exactAdaptation.adaptation.depth === "normal" &&
      english.language === LANGUAGE.EN &&
      english.safety === SAFETY.NORMAL,
    JSON.stringify(exactAdaptation.adaptation)
  );

  assert(
    "S0-027 preferences remain adaptation, not diagnosis",
    deriveSabikPresentation(exactAdaptation).labels.no_diagnosis === true && exactAdaptation.safety === SAFETY.NORMAL,
    JSON.stringify(deriveSabikPresentation(exactAdaptation).labels)
  );

  const deterministicA = [EVENTS.SUBMIT, EVENTS.RETRIEVAL_OK, { type: EVENTS.RESPONSE_READY, dialogue: DIALOGUE.PRACTICAL }, EVENTS.SPEECH_REQUEST, EVENTS.SPEECH_START].reduce(step, ready);
  const deterministicB = [EVENTS.SUBMIT, EVENTS.RETRIEVAL_OK, { type: EVENTS.RESPONSE_READY, dialogue: DIALOGUE.PRACTICAL }, EVENTS.SPEECH_REQUEST, EVENTS.SPEECH_START].reduce(step, ready);
  assert(
    "S0-028 same input and event sequence produce same result",
    JSON.stringify(deterministicA) === JSON.stringify(deterministicB),
    "transition must be deterministic"
  );

  expectThrow(
    "S0-029 invalid event fails explicitly",
    () => transitionSabikState(ready, "NOT_A_REAL_EVENT"),
    /Invalid Sabik state event/u
  );

  expectThrow(
    "S0-030 impossible event from state is rejected",
    () => transitionSabikState(ready, EVENTS.RETRIEVAL_OK),
    /Invalid Sabik state transition/u
  );

  const invalidOldOperation = clone(ready);
  invalidOldOperation.operation = "assistant_paused";
  const invalidOldSafety = clone(ready);
  invalidOldSafety.safety = "risk_confirmed";
  const invalidOldSpeech = clone(ready);
  invalidOldSpeech.speech = "speech_paused";
  const invalidReactive = clone(ready);
  invalidReactive.motion = MOTION.VOICE_REACTIVE;
  const invalidRiskDialogue = clone(activeRisk);
  invalidRiskDialogue.dialogue = DIALOGUE.INFORMATION;
  const invalidEnergy = clone(ready);
  invalidEnergy.speech_meta.energy = 1;
  const validPartialErrorMeta = clone(ready);
  validPartialErrorMeta.error_meta = { origin_operation: OPERATION.BOOTING };
  const validEmptyErrorMeta = clone(ready);
  validEmptyErrorMeta.error_meta = {};
  const invalidErrorMetaType = clone(ready);
  invalidErrorMetaType.error_meta = "fallo";
  const invalidErrorMetaOrigin = clone(ready);
  invalidErrorMetaOrigin.error_meta = { origin_operation: "not_real" };
  const invalidErrorMetaMessage = clone(ready);
  invalidErrorMetaMessage.error_meta = { message: 42 };
  const invalidExtra = clone(ready);
  invalidExtra.error = "not public";
  assert(
    "S0-031 validate accepts optional error_meta and rejects invalid metadata",
    validateSabikState(ready).ok === true &&
      validateSabikState(validPartialErrorMeta).ok === true &&
      validateSabikState(validEmptyErrorMeta).ok === true &&
      validateSabikState(invalidErrorMetaType).ok === false &&
      validateSabikState(invalidErrorMetaOrigin).ok === false &&
      validateSabikState(invalidErrorMetaMessage).ok === false,
    "error_meta must be optional, partial, and validated when explicit"
  );

  assert(
    "S0-032 validate rejects stale values and incoherent public states",
    validateSabikState(invalidOldOperation).ok === false &&
      validateSabikState(invalidOldSafety).ok === false &&
      validateSabikState(invalidOldSpeech).ok === false &&
      validateSabikState(invalidReactive).ok === false &&
      validateSabikState(invalidRiskDialogue).ok === false &&
      validateSabikState(invalidEnergy).ok === false &&
      validateSabikState(invalidExtra).ok === false,
    "stale or incoherent state must fail validation"
  );

  const failures = results.filter((item) => !item.ok);
  results.forEach((item) => {
    console.log(`${item.ok ? "PASS" : "FAIL"} ${item.name}${item.detail ? ` - ${item.detail}` : ""}`);
  });
  console.log(`\n${results.length - failures.length}/${results.length} validations passed`);
  if (failures.length) process.exitCode = 1;
}

run();
