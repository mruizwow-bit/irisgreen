# R66 · ECO/A6 · DYNAMIC TTS RUNTIME ARTIFACT GATE · 03/10/2026

Owner: **Eco · A6 — Voice, Audio & Media Validation**  
Upstream client owner: **Nexo**  
Issue: **#332**  
Cross-reference: **#354**  
Base client:
`nexo/sabik-voice-runtime-recovery-20261002@914d2edc6341f17a99dc289045f5d057e93b0465`

State:

`R66_DYNAMIC_TTS_RUNTIME_ARTIFACT_REQUIRED`

Eco substate:

`R66_ECO_PRIVATE_MODEL_BYTES_NOT_ACCESSIBLE`

## 1 · What is already closed

Nexo client contract is accepted and MUST NOT be reopened:

`SABIK_VOICE_CLIENT_CONTRACT_PASS`

Browser client already expects same-origin:

- `GET /sabik-voice/capabilities`
- `POST /sabik-voice/transcribe`
- `POST /sabik-voice/synthesize`

Dynamic browser/system TTS is forbidden.

No:
- `window.speechSynthesis`;
- `SpeechSynthesisUtterance`;
- generic narrator voice;
- replacement commercial voice;
- retraining;
- identity regeneration.

## 2 · Canonical dynamic voice identities

### ES

Model ID:
`SABIK_ES_R01_FINAL`

Expected model SHA-256:
`8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291`

### EN

Model ID:
`SABIK_EN_R02_FINAL`

Expected model SHA-256:
`3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df`

Reference selection/provenance remains Issue #172.

Human masters / private models MUST NOT be committed to public GitHub.

## 3 · Search performed by Eco

Eco checked accessible ChatGPT Library / conversation surfaces.

### /SABIK/HANDOFFS

Found:
`SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`

This is the 30-WAV fixed/system/fallback library.

It is NOT the dynamic TTS runtime/model artifact.

Also present:
- fixed WAV bridge fragments;
- one fixed welcome WAV;
- visual/cloud handoffs.

Not found:
- `SABIK_ES_R01_FINAL` model artifact;
- `SABIK_EN_R02_FINAL` model artifact;
- `model.safetensors`;
- `adapter_model.safetensors`;
- `pytorch_model.bin`;
- private executable dynamic TTS package;
- private live endpoint serving the two final identities.

Search by the exact model IDs and hashes also returned no private Library file.

Therefore Eco cannot honestly execute the final real-weight matrix yet.

## 4 · What the missing private artifact may be

Eco does NOT assume a storage format.

Acceptable handoff is either:

### A · private local model/runtime bundle

Must identify:
- ES artifact path;
- EN artifact path;
- exact byte/hash target to verify for each canonical SHA;
- runtime/loader type;
- engine/version;
- config;
- dependencies/lock;
- startup command;
- hardware expectation;
- provenance/license references.

or

### B · private service endpoint

Must expose an authenticated/private endpoint or same-origin adapter that proves it is serving exactly:
- `SABIK_ES_R01_FINAL`;
- `SABIK_EN_R02_FINAL`;

and returns the exact expected hashes in capabilities.

No model weights need to pass through GitHub if service identity can be verified securely.

## 5 · Qwen3-TTS runtime compatibility note

Official Qwen3-TTS exposes:
- `Qwen3TTSModel.from_pretrained(local_directory_or_model_id)`;
- Base voice-clone inference through `generate_voice_clone(...)`;
- local/private model directories are supported.

This confirms a private self-hosted runtime is technically viable.

This note does NOT prove the final Sabik artifacts are Hugging Face-compatible directories.
Eco will not guess their packaging.

Primary references:
- https://github.com/QwenLM/Qwen3-TTS
- https://github.com/QwenLM/Qwen3-TTS/blob/main/examples/test_model_12hz_base.py

## 6 · Runtime service acceptance contract

When the private artifact is available, Eco requires:

### /capabilities

Schema:
`iris-green/sabik-voice-runtime/v1`

Must report:
- `privacy.no_store=true`;
- `privacy.persist_audio=false`;
- `privacy.persist_transcript=false`;
- STT self-hosted ES+EN;
- TTS ES self-hosted with exact model ID + SHA;
- TTS EN self-hosted with exact model ID + SHA.

Mismatch:
FAIL CLOSED.

### /synthesize

Request:
- text;
- locale `es|en`;
- canonical model_id.

Response:
- `audio/wav`;
- `Cache-Control: no-store`;
- no persistence;
- sanitized errors;
- no fallback to generic/system voice.

### /transcribe

Final service must satisfy the already-adopted Nexo contract:
- active-turn audio only;
- ES/EN;
- no persistence;
- no transcript logging by default;
- cancellation discards late result.

## 7 · Validation immediately after artifact arrival

Run:
`COORDINACION_IRIS_GREEN/FORMACION/A6_ECO/07_MATRIZ_VALIDACION_SABIK_R66.md`

Minimum real-model checks:

### Identity
- ES ID/SHA exact;
- EN ID/SHA exact;
- mismatched identity fails closed.

### Dynamic TTS ES
- unseen text;
- short + medium + long;
- first-audio latency;
- complete duration;
- playback;
- stop;
- repeat;
- no clipping/glitches;
- pronunciation/naturalness HUMAN QA sample.

### Dynamic TTS EN
Same matrix.

### Language
- ES→EN cancels old synthesis;
- EN→ES cancels old synthesis;
- never mixed-language silently.

### Full turn
mic → STT → same submitTurn → visible response/sources → dynamic Sabik TTS.

### Privacy
- no audio/transcript/response persistence by default;
- `Cache-Control: no-store`;
- cancellation cleanup;
- no content in application logs.

### Accessibility
- text always remains available;
- voice failure leaves text;
- no autoplay;
- stop/cancel accessible;
- no requirement for motion.

## 8 · Gate logic

Do NOT emit:
`ECO_R66_MEDIA_VALIDATION_PASS`

until real canonical ES+EN artifacts are executed.

Current honest state remains:

`R66_DYNAMIC_TTS_RUNTIME_ARTIFACT_REQUIRED`

Reason:
`PRIVATE_FINAL_MODEL_OR_ENDPOINT_BYTES_NOT_ACCESSIBLE_TO_ECO`

This is NOT:
- a client bug;
- a request to retrain;
- a request to regenerate;
- a request to use a substitute voice.

## 9 · Exact handoff needed to unblock Eco

Provide privately one of:

1. the executable ES+EN runtime/model bundle, or
2. a private endpoint serving both canonical model IDs/hashes.

No human master or model weight should be committed to public GitHub.

Once available:

`PRIVATE ARTIFACT → ECO R66 MATRIX → ECO_R66_MEDIA_VALIDATION_PASS → NEXO REAL-MODEL E2E → HUMAN QA MARÍA → RECONCILE MAIN`

No main before that gate.
Maintenance banner remains.
