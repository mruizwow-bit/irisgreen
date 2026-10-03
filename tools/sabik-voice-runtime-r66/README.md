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

`discover_private_models.py` hashes candidate private files below `SABIKVOICE_ROOT` (default `C:\\Users\\mruiz\\SabikVoice`).

By default it scans `**/model.safetensors`, because the recovered Sabik EN training scripts explicitly used that file. If the canonical SHA was defined over another private file, set `SABIK_MODEL_HASH_PATTERN` to the exact intended target pattern. Folder names are hints; **hash identity is authority**.

Historical evidence identifies EN checkpoints such as:
- `C:\\Users\\mruiz\\SabikVoice\\SABIK_EN_SFT_R02_EXACT\\checkpoint-epoch-0`
- `C:\\Users\\mruiz\\SabikVoice\\SABIK_EN_V1`

Recovered EN inference contract:
- Qwen3-TTS fine-tuned checkpoint;
- `generate_custom_voice`;
- speaker `sabik_en`;
- language `English`;
- non-streaming mode;
- top_k 50 / top_p 1.0 / temperature 0.9 / repetition penalty 1.05.

The recovered finalization package closes the ES packaging question. Both final product models were copied from selected fine-tuned checkpoints and generated with `generate_custom_voice`:
- ES source: `C:\\Users\\mruiz\\SabikVoice\\SABIK_ES_SFT_R01\\checkpoint-epoch-0`;
- EN source: `C:\\Users\\mruiz\\SabikVoice\\SABIK_EN_SFT_R02_EXACT\\checkpoint-epoch-0`;
- ES canonical destination: `C:\\Users\\mruiz\\SabikVoice\\FINAL_MODELS\\SABIK_ES_R01_FINAL`;
- EN canonical destination: `C:\\Users\\mruiz\\SabikVoice\\FINAL_MODELS\\SABIK_EN_R02_FINAL`;
- the canonical model hash is the SHA-256 of each final `model.safetensors`.

Speakers are `sabik_es` and `sabik_en`.

## Runtime modes

Per language the private config can select:
- `custom_voice`: fine-tuned Qwen3-TTS checkpoint, `generate_custom_voice`;
- `voice_clone`: Base/ICL checkpoint with private `ref_audio` + exact `ref_text`, `generate_voice_clone`.

No fallback between identities is automatic.

## Start

1. Create a private config from `private-config.example.json` outside public GitHub.
2. Set `SABIK_VOICE_PRIVATE_CONFIG` to that path.
3. Install requirements in an isolated environment.
4. Start with access logging disabled:

`uvicorn runtime:app --host 127.0.0.1 --port 8765 --no-access-log`

Put the service behind the same-origin `/sabik-voice` route used by Nexo.

## Privacy / safety behavior

- `Cache-Control: no-store` on capabilities, STT and TTS responses;
- audio is held only in memory / ephemeral temporary files for the active STT call;
- temp input is deleted after the command returns;
- request text/audio are not logged by this runtime;
- Uvicorn access logging must remain disabled so application-layer IP/request access lines are not created by this host;
- STT is a private command adapter and must be supplied by the already-approved STT lane;
- system/browser TTS is never used;
- model identity mismatch stops startup.

## Static gate

`python scripts/test_eco_r66_private_runtime_static.py`

Expected:
`ECO_R66_PRIVATE_RUNTIME_STATIC_PASS`

This only validates the host/contract. It explicitly reports:
- `real_private_weights_exercised=false`;
- `eco_media_validation_pass=false`.

## Final gate

This code is **not** `ECO_R66_MEDIA_VALIDATION_PASS`.
That marker requires the real private ES+EN model bytes to be found, loaded and exercised through the A6 matrix.

Final chain:
`ARTEFACTO PRIVADO → ECO_R66_MEDIA_VALIDATION_PASS → NEXO E2E REAL → HUMAN QA MARÍA → MAIN`


## Windows private start gate

`start_private_runtime_windows.ps1`:
1. searches/verifies the two canonical `model.safetensors` hashes;
2. checks both final model directories;
3. requires an already-approved private ES/EN STT adapter via `SABIK_STT_ADAPTER_EXE`;
4. writes the runtime config only to the local temporary directory;
5. starts Uvicorn on loopback with `--no-access-log`.

If model bytes are missing or hashes differ, it stops with:
`R66_DYNAMIC_TTS_RUNTIME_ARTIFACT_REQUIRED`.

It never downloads, retrains or substitutes a model.
