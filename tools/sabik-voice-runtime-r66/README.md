# Sabik R66 private voice runtime

Private execution host for the already-approved Nexo browser contract.

It does **not** contain Sabik model weights, human masters or transcripts.
It refuses to start unless the configured private model files match the exact canonical SHA-256 values expected by the browser client.

Endpoints:
- `GET /sabik-voice/capabilities`
- `POST /sabik-voice/transcribe`
- `POST /sabik-voice/synthesize`

Canonical identities:
- ES `SABIK_ES_R01_FINAL` · `8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291`
- EN `SABIK_EN_R02_FINAL` · `3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df`

## Provenance recovered

The private finalization package proves that both product models are fine-tuned Qwen checkpoints served through `generate_custom_voice`.

Relative to `SABIKVOICE_ROOT`:

ES:
- source `SABIK_ES_SFT_R01/checkpoint-epoch-0`;
- final `FINAL_MODELS/SABIK_ES_R01_FINAL`;
- speaker `sabik_es`;
- language `Spanish`.

EN:
- source `SABIK_EN_SFT_R02_EXACT/checkpoint-epoch-0`;
- final `FINAL_MODELS/SABIK_EN_R02_FINAL`;
- speaker `sabik_en`;
- language `English`.

The verified fixed-audio package independently records the same final IDs, source roles, canonical roles and model/config hashes.

## Private artifact discovery

`discover_private_models.py` hashes candidate files below `SABIKVOICE_ROOT`.

Default private root:
`%USERPROFILE%/SabikVoice`

Default pattern:
`**/model.safetensors`

The canonical hashes are the SHA-256 values of the final `model.safetensors` files.
Folder names are hints; exact hash identity is authority.

## Runtime modes

The host supports:
- `custom_voice` for fine-tuned Qwen3-TTS checkpoints;
- `voice_clone` for Base/ICL checkpoints when needed for another approved artifact.

R66 final Sabik ES and EN are configured as `custom_voice`.
There is no automatic identity fallback.

## Start on the private Windows host

1. Preserve model bytes outside public GitHub.
2. Set `SABIK_STT_ADAPTER_EXE` to the already-approved private ES/EN STT adapter.
3. From this package run:

`powershell -ExecutionPolicy Bypass -File .\start_private_runtime_windows.ps1`

The launcher:
- verifies both canonical model hashes before startup;
- requires both final model directories;
- writes runtime config only to a temporary local file;
- binds to loopback by default;
- disables Uvicorn access logs;
- never downloads, retrains or substitutes a voice.

Manual equivalent:
`uvicorn runtime:app --host 127.0.0.1 --port 8765 --no-access-log`

Put the service behind the same-origin `/sabik-voice` route used by Nexo.

## Privacy / safety behavior

- `Cache-Control: no-store` on capabilities, STT and TTS;
- active-turn audio only;
- ephemeral STT temp file, deleted after the private adapter returns;
- request text/audio are not logged by this host;
- browser/system TTS is never used;
- identity mismatch stops startup;
- no weights or human masters are committed here.

## Static gate

`python scripts/test_eco_r66_private_runtime_static.py`

Expected:
`ECO_R66_PRIVATE_RUNTIME_STATIC_PASS`

The static gate explicitly reports:
- `real_private_weights_exercised=false`;
- `eco_media_validation_pass=false`.

## Final gate

Static/runtime-host readiness is NOT:
`ECO_R66_MEDIA_VALIDATION_PASS`.

That marker requires:
- actual private ES model bytes;
- actual private EN model bytes;
- exact hash match;
- real model load;
- real unseen synthesis ES+EN;
- A6 media matrix;
- real STT/turn chain required by R66.

Final chain:
`ARTEFACTO PRIVADO → ECO_R66_MEDIA_VALIDATION_PASS → NEXO E2E REAL → HUMAN QA MARÍA → MAIN`
