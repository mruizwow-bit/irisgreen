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

## Private artifact discovery

`discover_private_models.py` hashes every `model.safetensors` below `SABIKVOICE_ROOT` (default `C:\\Users\\mruiz\\SabikVoice`) and only exits 0 if both canonical hashes are found.

Historical evidence identifies EN checkpoints such as:
- `C:\\Users\\mruiz\\SabikVoice\\SABIK_EN_SFT_R02_EXACT\\checkpoint-epoch-0`
- `C:\\Users\\mruiz\\SabikVoice\\SABIK_EN_V1`

These are hints, not authority; hash matching is authority.

## Runtime modes

Per language the private config can select:
- `custom_voice`: fine-tuned Qwen3-TTS checkpoint, `generate_custom_voice`;
- `voice_clone`: Base/ICL checkpoint with private `ref_audio` + exact `ref_text`, `generate_voice_clone`.

No fallback between identities is automatic.

## Start

1. Create a private config from `private-config.example.json` outside public GitHub.
2. Set `SABIK_VOICE_PRIVATE_CONFIG` to that path.
3. Install requirements in an isolated environment.
4. Start with:

`uvicorn runtime:app --host 127.0.0.1 --port 8765`

Put the service behind the same-origin `/sabik-voice` route used by Nexo.

## Privacy / safety behavior

- `Cache-Control: no-store` on capabilities, STT and TTS responses.
- audio is held only in memory / ephemeral temporary files for the active STT call;
- temp input is deleted after the command returns;
- request text/audio are not logged by this runtime;
- STT is a private command adapter and must be supplied by the already-approved STT lane;
- system/browser TTS is never used;
- model identity mismatch stops startup.

## Gate

This code is **not** `ECO_R66_MEDIA_VALIDATION_PASS`.
That marker requires the real private ES+EN model bytes to be found, loaded and exercised through the A6 matrix.
