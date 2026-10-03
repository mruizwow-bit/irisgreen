# NEXO · R66 · REAL-MODEL E2E PASS · 03/10/2026

Gate:

`NEXO_R66_REAL_MODEL_E2E_PASS`

Client branch:

`nexo/sabik-voice-runtime-recovery-20261002`

Client HEAD:

`a2904df9acf344bf3587cc88bae93da9c830a9b0`

Upstream prerequisite:

`ECO_R66_MEDIA_VALIDATION_PASS`

## Real services used

- browser / same-origin E2E proxy: `127.0.0.1:8890`
- canonical Qwen TTS runtime: real ES + EN models
- STT runtime: `nvidia/parakeet-tdt-0.6b-v3` on CPU
- no SpeechSynthesis
- no generic narrator
- no mock voice service

## ES spoken turn

PASS.

Observed chain:

`idle → listening → idle → processing → idle → speaking → idle`

STT:
- HTTP 200
- `Cache-Control: no-store, max-age=0`
- real transcript returned
- real transcript placed into Sabik input

Core/UI:
- visible answer present
- 1 visible source
- same Sabik conversational path

TTS:
- HTTP 200
- `Cache-Control: no-store, max-age=0`
- real canonical Sabik ES model

Responsive:
- 320×800: no horizontal overflow
- 390×844: no horizontal overflow
- 1440×900: no horizontal overflow

JS/browser errors:
- none

## EN spoken turn

PASS.

Observed chain:

`idle → listening → idle → processing → idle → speaking → idle`

STT:
- HTTP 200
- `Cache-Control: no-store, max-age=0`
- real transcript returned
- real transcript placed into Sabik input

Core/UI:
- visible answer present
- 1 visible source
- same Sabik conversational path

TTS:
- HTTP 200
- `Cache-Control: no-store, max-age=0`
- real canonical Sabik EN model

Responsive:
- 320×800: no horizontal overflow
- 390×844: no horizontal overflow
- 1440×900: no horizontal overflow

JS/browser errors:
- none

## Evidence summary

Final local report:

`R66_NEXO_E2E/reports/nexo-r66-real-e2e/report.json`

Report fields:
- `passed=true`
- `spoken_turns=2`
- `real_browser_mediarecorder=true`
- `real_stt_service=true`
- `real_qwen_tts_models=true`
- `mock_voice_service=false`

The final rerun was executed after the 320px containment fix at client HEAD `a2904df9...`.

## Decision

Nexo closes the real-model E2E gate.

No main.
No production.
No maintenance removal.

Next and only next gate:

`HUMAN QA MARÍA`

Canonical chain now:

`ECO_R66_MEDIA_VALIDATION_PASS → NEXO_R66_REAL_MODEL_E2E_PASS → HUMAN QA MARÍA → MAIN`
