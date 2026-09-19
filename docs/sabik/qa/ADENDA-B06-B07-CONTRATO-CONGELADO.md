# Adenda B06/B07 · estado histórico tras consolidación

La adenda publicada en el contrato `e69929b4b88128c4c935435987f35532f37d2df0` cerró ambigüedades reales de aclaración, seguridad y voz, pero coexistió con filas antiguas incompatibles del contrato base.

## Estado actual

**Histórica, no normativa por separado.**

La semántica válida vive exclusivamente en:

`tests/specs/sabik/s0-state-contract.json`

El archivo `tests/specs/sabik/s0-contract-addendum-b06-b07.json` es ahora un índice de subconjunto. No contiene estados esperados, payloads ni resultados propios.

El runner `run-s0-addendum-b06-b07.mjs` lee las filas y recorridos de la misma fuente consolidada que `run-s0-contract.mjs`.

## Qué se conserva de B06/B07

- respuesta a aclaración normal continúa el mismo contexto;
- `uncertain + SUBMIT` no rebaja incertidumbre;
- `RISK_CONFIRMED` y `RISK_CLEARED` resuelven explícitamente la aclaración;
- `RISK_CLEARED` no funciona desde `paused`, `normal`, `risk` ni `human_handoff`;
- `SPEECH_REQUEST`, `SPEECH_START` y `SPEECH_BOUNDARY` son eventos distintos;
- pausa/error de voz apagan movimiento ordinario;
- riesgo/handoff mantienen `protection_static`;
- movimiento reducido es preferencia de estado y se cambia solo con `SET_REDUCED_MOTION`.

## Evidencia histórica

`e69929b4…` queda conservado en el historial del PR #164 como evidencia del defecto que motivó esta consolidación. No debe utilizarse como contrato normativo para nuevos ciclos.
