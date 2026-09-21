# S0 · contrato QA consolidado de estados y transiciones

**Issue:** #149  
**PR QA:** #164  
**Destino:** `sabik-preview`  
**Estado:** contrato consolidado; una sola fuente ejecutable.

## Autoridad

La única fuente normativa de estados, eventos, payloads y resultados es:

`tests/specs/sabik/s0-state-contract.json`

El contrato anterior `e69929b4b88128c4c935435987f35532f37d2df0` se conserva como evidencia histórica, pero queda sustituido por el commit que contiene esta consolidación porque base y adenda imponían semánticas incompatibles de voz.

`tests/specs/sabik/s0-contract-addendum-b06-b07.json` ya no contiene expectativas propias: solo identifica el subconjunto histórico B06/B07 dentro de la fuente normativa.

## Semántica consolidada

- `createInitialSabikState()` produce `operation=booting`.
- Solo `BOOT_OK` lleva `booting → ready`.
- `SPEECH_REQUEST`: `silent → starting`, energía 0, sin onda.
- `SPEECH_START`: solo desde `starting`; representa `speechSynthesis.onstart`.
- `SPEECH_BOUNDARY`: solo desde `speaking`; actualiza metadatos.
- `SPEECH_PAUSE`: `paused + motion=off`.
- `SPEECH_RESUME`: `speaking + voice_reactive`, o `off` si la preferencia reducida ya está en el estado.
- `SPEECH_STOP`/`SPEECH_END`: `ended + ambient/off`.
- `SPEECH_ERROR`: `error + off`; durante `risk/human_handoff`, `protection_static`.
- La preferencia de movimiento reducido cambia solo con `SET_REDUCED_MOTION {enabled}`; los eventos de voz no llevan `reduced_motion`.
- `speech_meta`, `motion_meta` y `error_meta` son opcionales. Ausencia y parcialidad se normalizan de forma segura; valores explícitamente inválidos se rechazan.
- `RISK_CLEARED` solo se acepta desde `awaiting_clarification + clarification + uncertain`; se rechaza desde `paused`, `normal`, `risk` y `human_handoff`.
- Pausa, reset, error y retry conservan `uncertain`, `risk` y `human_handoff`.
- `SUBMIT` ordinario se rechaza durante `human_handoff`.

## Forma pública obligatoria

`operation`, `dialogue`, `adaptation`, `safety`, `visibility`, `speech`, `motion`, `language`, `revision`.

Metadatos opcionales: `speech_meta`, `motion_meta`, `error_meta`.

## Comprobaciones

```bash
node tests/specs/sabik/validate-s0-contract-consistency.mjs
node tests/specs/sabik/run-s0-contract.mjs
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs
```

La primera debe informar:

```text
PASS
0 contradicciones
0 estados iniciales imposibles
0 referencias rotas
```

Los dos runners sin implementación deben usar las mismas filas consolidadas y no contener expectativas independientes.

## Conteos consolidados

- filas contractuales: **84**
- recorridos canónicos: **32**
- subconjunto histórico B06/B07: **28 filas**
- recorridos B06/B07: **12**

Los antiguos `65 / 37` dejan de ser un objetivo artificial.
