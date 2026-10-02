# SABIK DEFINITIVO · BASELINE P0-A · 2026-10-02

Base de reconciliación: `main@6ce4531f0b3b19e099c3e7b7c2ce36a19ab918fa`
Rama: `nexo/sabik-definitive-p0a-20261002`
Issue: #354 · recovery #363 · auditoría #369

## Decisión

Este directorio preserva **sin reinterpretar** el visual aprobado de Sabik con núcleo central.

Fuente exacta del donor:
`nexo/sabik-codex-layer-handoff-r01-20261001`

Cuerpo canónico:
`sabik/assets/web-r01/web_presente.png`
Git blob:
`c18d8f2aae53c281e02baeeac0ccd832acca4ecb`

Geometría KEEP:
- canvas 1065 × 760;
- núcleo/transform-origin (530,359);
- body bbox x=176 y=8 w=690 h=642;
- z-order 10/20/30/40/50/60.

Estados visuales:
`idle | listening | processing | speaking | degraded`

Regla:
`MOTION = SYSTEM_STATE_COMMUNICATION, NOT DECORATION`

## Qué queda preservado aquí

- órbitas traseras exactas;
- anillos del núcleo;
- luz del núcleo;
- partículas delanteras;
- manifest de geometría/capas;
- CSS/JS donor;
- README de contrato.

No es todavía el runtime final: el donor visual no debe decidir estados por temporizadores.

## Resume gate contra main

El main observado conserva:
- runtime conversacional local/cloud;
- R37 motion;
- cinco masters Web R01;
- voz R01 de mensajes fijos;
- NORMAL / REDUCIDO / SIN_MOVIMIENTO;
- ES/EN de interfaz.

Pero el main todavía NO puede declararse “Sabik definitivo” porque:
1. el visual aprobado por capas no está montado en el runtime vivo;
2. `audio-r01.mjs` reproduce mensajes fijos WAV, no una respuesta conversacional dinámica completa;
3. no existe STT/micrófono conectado en el runtime actual;
4. `speaking`/ `listening` definitivos deben venir de eventos reales, no de foco/timers.

## Próximo bloque

Integrar este visual exacto con el runtime vivo y conectar estados semánticos reales.
Motor puede asumir el lifecycle interactivo/voz; Nexo mantiene contrato, continuidad, rollback y E2E.

No rediseñar.
No sustituir el cuerpo canónico.
No declarar PASS solo por apariencia.
