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


## STT selected for R66

After target-hardware validation on IrisGreen, the executable STT choice for this R66 media runtime is:

- model: `nvidia/parakeet-tdt-0.6b-v3`;
- official model snapshot used for validation: `541d1f99c6b0c3cd0b11a95167540bb8edefd82b`;
- model.safetensors SHA-256: `3a2026366188c8c68598edbbff92f8d11590a08e0ae2e6775544e7b07d6a5e11`;
- config SHA-256: `e747b85e1bdfd300c8b8ac63bac8dd5221f8fe9bc275b48d06c735fcd6971b6e`;
- device: CPU;
- Transformers: `5.18.0`;
- license: CC BY 4.0 (see official NVIDIA/Hugging Face model card).

Why Parakeet:
- local 12-utterance ES/EN bank mean raw WER: 6.03%;
- Whisper Base comparison on the same bank: 8.54%;
- clean semantic gate: PASS;
- 20 dB SNR noise gate: PASS;
- ES↔EN code-switch gate: PASS;
- acronym, negation, date semantics and project proper nouns covered.

The closed project-brand correction only maps observed variants:
`Sabick / Savick / Sabyck → Sabik`.
No open-ended autocorrect is used.

## Persistent STT sidecar

Do not reload the 0.6B ASR model for every turn.

Run the STT environment separately:

```powershell
python -m uvicorn stt_parakeet_service:app --host 127.0.0.1 --port 8876 --no-access-log
```

The sidecar:
- preloads Parakeet once;
- binds loopback only;
- accepts only the runtime's own `%TEMP%/sabik-stt-*/turn*` files;
- exposes `/health` and `/transcribe-path`;
- returns `Cache-Control: no-store`;
- applies only the closed Sabik brand correction.

The main runtime invokes `stt_parakeet_adapter.py`, which is a lightweight loopback client.

Set `SABIK_STT_SIDECAR_URL` only if a different private loopback port is needed.

Target-hardware measurements:
- per-turn STT before sidecar: approximately 9–11 s end-to-end;
- persistent sidecar: ES 0.495 s end-to-end;
- persistent sidecar: EN 0.434 s end-to-end;
- residual `sabik-stt-*` temp directories after request: 0.

## Two isolated Python environments

Keep TTS and STT dependencies isolated.

TTS:
- Qwen runtime environment;
- `qwen-tts==0.1.1`;
- its pinned `transformers==4.57.3`.

STT:
- `requirements-stt.txt`;
- `transformers==5.18.0`;
- Parakeet CPU.

Do not upgrade the Qwen TTS environment to the STT Transformers version.
