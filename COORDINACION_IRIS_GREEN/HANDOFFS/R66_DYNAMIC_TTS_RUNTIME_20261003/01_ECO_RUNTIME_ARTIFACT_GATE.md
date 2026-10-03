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


## 10 · Cadena final canónica fijada por María · 03/10/2026

`ARTEFACTO PRIVADO → ECO_R66_MEDIA_VALIDATION_PASS → NEXO E2E REAL → HUMAN QA MARÍA → MAIN`

Esta cadena sustituye cualquier formulación anterior que intercale pasos no autorizados entre estos gates.

Reglas:
- Eco no emite PASS sin ejecutar el artefacto privado real ES+EN;
- Nexo realiza el E2E real únicamente después del PASS de Eco;
- María realiza HUMAN QA después del E2E real;
- MAIN solo después de HUMAN QA;
- no SpeechSynthesis, no voz sustituta, no reentrenamiento.


## 11 · Trabajo ejecutado por Eco tras el gate de Nexo

Eco ha continuado la orden sin reabrir el cliente.

Paquete creado:
`tools/sabik-voice-runtime-r66/`

Archivos:
- `runtime.py`
- `discover_private_models.py`
- `private-config.example.json`
- `requirements.txt`
- `README.md`

Gate estático:
`scripts/test_eco_r66_private_runtime_static.py`

Workflow aislado:
`.github/workflows/eco-r66-private-runtime-static.yml`

CI:
- run `37099787794`
- resultado: **SUCCESS**
- gate: `ECO_R66_PRIVATE_RUNTIME_STATIC_PASS`
- `real_private_weights_exercised=false`
- `eco_media_validation_pass=false`
- `fail_closed_identity=true`
- `system_tts_fallback=false`

## 12 · Runtime privado preparado

El host implementa el contrato ya aceptado por Nexo:

- `GET /sabik-voice/capabilities`
- `POST /sabik-voice/transcribe`
- `POST /sabik-voice/synthesize`

Propiedades:
- mismo schema `iris-green/sabik-voice-runtime/v1`;
- IDs/hashes ES+EN fijados;
- `Cache-Control: no-store`;
- sin SpeechSynthesis/system TTS;
- sin fallback de identidad;
- rechazo de model_id incorrecto;
- startup fail-closed si falta path/hash/config;
- audio STT temporal y limpieza;
- adapter STT privado desacoplado;
- acceso del host recomendado en loopback + `--no-access-log`.

El runtime soporta dos formas Qwen reales:
1. `custom_voice` → checkpoint fine-tuned + speaker;
2. `voice_clone` → Base/ICL + referencia privada exacta.

No decide automáticamente cuál corresponde a cada idioma.

## 13 · Evidencia privada recuperada

La búsqueda posterior recuperó metadatos de entrenamiento que no estaban en GitHub:

### EN

Hoja maestra:
- `SABIK_EN_V1` seleccionado;
- `checkpoint-epoch-0`;
- E0 > E2 > E1;
- corpus 160 clips / 621,76 s;
- configuración SFT batch 1 / grad accumulation 4 / bf16 / SDPA / lr 2e-6.

Script privado recuperado:
`sabik_en_retrain_exact_r02.py`

Rutas históricas:
- root `%SABIKVOICE_ROOT%`;
- `SABIK_EN_SFT_R02_EXACT\checkpoint-epoch-0`;
- `SABIK_EN_V1`.

El script comprueba `model.safetensors` y carga el checkpoint con:
- `Qwen3TTSModel.from_pretrained(...)`;
- `generate_custom_voice(...)`;
- speaker `sabik_en`;
- language `English`.

Esto justifica que la plantilla EN use `custom_voice`.

### ES

La evidencia accesible confirma la ruta anterior aprobada:
- Qwen3-TTS Base 1.7B;
- ICL;
- `x_vector_only_mode=False`;
- master ES canónico;
- español peninsular;
- 20/20 HUMAN PASS.

Pero esa evidencia anterior NO demuestra el empaquetado posterior de:
`SABIK_ES_R01_FINAL`.

Por eso la plantilla ES queda deliberadamente sin elegir entre:
- `custom_voice`;
- `voice_clone`.

Eco no inventa esa transición.

## 14 · Descubrimiento local por hash

`discover_private_models.py` puede ejecutarse directamente en la máquina histórica de entrenamiento.

Default:
`SABIKVOICE_ROOT=%SABIKVOICE_ROOT%`

Patrón default:
`**/model.safetensors`

Puede cambiarse únicamente si la definición canónica del SHA apunta a otro archivo:
`SABIK_MODEL_HASH_PATTERN`.

Regla:
**el nombre de la carpeta NO prueba identidad; el hash es autoridad.**

El descubridor no copia ni sube pesos.

## 15 · Estado después del trabajo Eco

Nuevo subestado:

`R66_ECO_RUNTIME_HOST_READY_PRIVATE_CANONICAL_WEIGHTS_REQUIRED`

Se conserva el bloqueo superior:

`R66_DYNAMIC_TTS_RUNTIME_ARTIFACT_REQUIRED`

Porque Eco todavía NO ha podido:
- localizar ambos bytes canónicos;
- verificar ambos hashes contra el target privado real;
- cargar ambos modelos finales;
- sintetizar ES+EN reales;
- ejecutar la matriz completa.

Por tanto sigue prohibido emitir:
`ECO_R66_MEDIA_VALIDATION_PASS`.

## 16 · Próxima acción automática cuando aparezcan los pesos

1. ejecutar descubridor/manifest privado;
2. confirmar hash ES exacto;
3. confirmar hash EN exacto;
4. fijar modo ES según artefacto real;
5. arrancar runtime privado;
6. comprobar `/capabilities`;
7. síntesis inédita ES;
8. síntesis inédita EN;
9. STT/turno completo;
10. ejecutar matriz A6 R66;
11. si todo pasa:
   `ECO_R66_MEDIA_VALIDATION_PASS`.

Después, sin etapa adicional:

`NEXO E2E REAL → HUMAN QA MARÍA → MAIN`.


## 17 · Final-model provenance cross-check

Recovered finalization metadata and the already-verified 30-WAV package independently agree on the two product models.

ES:
- model ID `SABIK_ES_R01_FINAL`;
- source `SABIK_ES_SFT_R01/checkpoint-epoch-0`;
- final role `FINAL_MODELS/SABIK_ES_R01_FINAL`;
- speaker `sabik_es`;
- model.safetensors SHA `8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291`;
- config SHA `6c62a7c419fe2a72c64c51f2e143fc702ba552e12c31ff2bda31feeee1ab5a9e`.

EN:
- model ID `SABIK_EN_R02_FINAL`;
- source `SABIK_EN_SFT_R02_EXACT/checkpoint-epoch-0`;
- final role `FINAL_MODELS/SABIK_EN_R02_FINAL`;
- speaker `sabik_en`;
- model.safetensors SHA `3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df`;
- config SHA `6ac9cbf2727344d18fbb4d66ea8274b675f64a14b0737e9e28801181e96c0abd`.

Both final models are therefore configured as:
`custom_voice`.

Evidence-only companion:
`COORDINACION_IRIS_GREEN/HANDOFFS/R66_DYNAMIC_TTS_RUNTIME_20261003/02_ECO_FINAL_MODEL_PROVENANCE_RECOVERED.md`.

Remaining blocker is no longer model identity/packaging research.
It is execution access:
- private ES bytes;
- private EN bytes;
- approved private STT adapter;
- real A6 matrix.
