# R66 · ECO/A6 · FINAL MODEL PROVENANCE RECOVERED · 03/10/2026

State:
`R66_ECO_FINAL_MODEL_PROVENANCE_RECOVERED`

This document contains metadata only.
No private model weights, human masters or corpus audio are committed.

## Private metadata packages inspected

- `SABIK_ES_SFT_R01.zip`
- `SABIK_ES_CHECKPOINT_VALIDATION_R01.zip`
- `SABIK_FINAL_MODELS_AUDIO_R01.zip`
- `SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`

Private root is represented here as:
`%SABIKVOICE_ROOT%`

No user-specific absolute filesystem path is committed.

## Finalization chain recovered

### ES

Source checkpoint:
`%SABIKVOICE_ROOT%/SABIK_ES_SFT_R01/checkpoint-epoch-0`

Canonical destination:
`%SABIKVOICE_ROOT%/FINAL_MODELS/SABIK_ES_R01_FINAL`

Runtime:
- Qwen3-TTS;
- `generate_custom_voice`;
- speaker `sabik_es`;
- language `Spanish`.

Expected files:
- `config.json`
- `model.safetensors`

Canonical model.safetensors SHA-256:
`8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291`

Canonical config SHA-256:
`6c62a7c419fe2a72c64c51f2e143fc702ba552e12c31ff2bda31feeee1ab5a9e`

### EN

Source checkpoint:
`%SABIKVOICE_ROOT%/SABIK_EN_SFT_R02_EXACT/checkpoint-epoch-0`

Canonical destination:
`%SABIKVOICE_ROOT%/FINAL_MODELS/SABIK_EN_R02_FINAL`

Runtime:
- Qwen3-TTS;
- `generate_custom_voice`;
- speaker `sabik_en`;
- language `English`.

Expected files:
- `config.json`
- `model.safetensors`

Canonical model.safetensors SHA-256:
`3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df`

Canonical config SHA-256:
`6ac9cbf2727344d18fbb4d66ea8274b675f64a14b0737e9e28801181e96c0abd`

## Independent cross-check

The verified fixed-audio handoff embeds the same model provenance in:
- `manifest.json`;
- `VERIFICATION.json`.

It records for both ES and EN:
- final model ID;
- relative canonical role/path;
- source checkpoint role;
- model.safetensors SHA-256;
- config.json SHA-256.

Therefore the model hashes consumed by the Nexo client are confirmed to be the final `model.safetensors` hashes produced by the model-canonization step.

## Runtime consequence

The private runtime configuration no longer needs to guess the ES packaging.

Both final product models use:
`mode=custom_voice`

ES speaker:
`sabik_es`

EN speaker:
`sabik_en`

Historical Base/ICL material remains training/provenance evidence, not the final runtime artifact.

## Remaining blocker

Metadata proves identity but does not expose the private model bytes to this Eco environment.

Still required on the private execution host:
- ES final model directory;
- EN final model directory;
- exact matching `model.safetensors` and `config.json` bytes.

Until those bytes are actually hashed and loaded:
`R66_DYNAMIC_TTS_RUNTIME_ARTIFACT_REQUIRED`

Do not emit:
`ECO_R66_MEDIA_VALIDATION_PASS`

## Final chain

`ARTEFACTO PRIVADO → ECO_R66_MEDIA_VALIDATION_PASS → NEXO E2E REAL → HUMAN QA MARÍA → MAIN`
