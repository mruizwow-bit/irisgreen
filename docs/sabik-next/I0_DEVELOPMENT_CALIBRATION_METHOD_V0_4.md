# I0 · corpus de desarrollo y calibración independientes · v0.4

## Separación

- development: **400** casos en `tests/development/sabik/i0/`
- calibration: **200** casos en `tests/calibration/sabik/i0/`
- validation #173: **no se incluye**; permanece en PR #176 bajo `tests/evaluation/sabik/i0/validation/`

Development puede consultarse durante implementación. Calibration se usa solo para elegir umbrales. Validation #173 es examen externo y no debe utilizarse para ajustar reglas o umbrales.

## Representación por capas

Cada caso separa contexto, Safety Gate, comandos, resultado, acciones, eventos S0, ejecución, B3, ambigüedad y —solo en calibration cuando aporta valor— expectativa cualitativa de confianza.

No se usan `ASK_CLARIFICATION`, `OUT_OF_SCOPE`, `SAFETY_GATE` ni `MULTI_ACTION_PLAN` como `IntentType`.

## B3

Se respeta `I0_S0_B3_PROJECTION_V0_2.md`:
- PRESENTE: información/listas/aclaración/insufficient/cambios perceptibles;
- ORIENTAR: objetivo o siguiente paso concreto;
- TRANSICIÓN: cambio real de etapa/ruta;
- PAUSA: únicamente pausa funcional de Sabik;
- CONFIRMAR: únicamente confirmación útil de una pérdida/efecto no perceptible.

## Identidad local antes de publicación

Development:
- SHA-256 `a4a4c93b34a7d361a34efeee4bc8b9f7de63e38874d5e8f85f6cb996942f8e13`
- Git blob esperado `ad8d08ed93969fef3f14cc0b132cdac4244feda3`

Calibration:
- SHA-256 `b48fe06091d74608332e7ecb7bbcb817f547cd18a526555ccc4a7de66421d240`
- Git blob esperado `df70f12ec286c8f2ab00a2c10cb3e99743320144`

Schema:
- SHA-256 `9278730161570be4f88824a6b6368d77408d4b2f2304ed08301a453cd0fbdddb`
- Git blob esperado `bdbb6ae3123759e040ee9ab5c5f7c413b646f998`

## Calibración

El harness `tools/calibrate-sabik-i0-thresholds.mjs` barre umbrales y márgenes provisionales para `local_reversible` y `local_with_loss`.

Prioridad:
1. acciones falsas peligrosas;
2. inversión de negaciones;
3. Safety Gate FP/FN;
4. acciones with_loss incorrectas;
5. parámetros incorrectos;
6. aclaraciones innecesarias;
7. abstención excesiva;
8. accuracy global.

Los valores 0.90/0.15 y 0.97/0.20 no se fijan de antemano.

## Anti-contaminación

El detector compara development, calibration y validation:
- exactos/normalización equivalente;
- variante de un token;
- Jaccard >= 0.82;
- solapamiento de trigramas >= 0.80.

Solo reporta sospechosos. No borra ni modifica casos.

Los cuatro contrastes literales exigidos explícitamente por esta orden Astra están en development y etiquetados `astra_required_literal`; si coinciden con validation, el informe debe mostrarlo como solapamiento normativo solicitado, no ocultarlo.

## Alcance

No se implementa Core definitivo. No se ejecuta validation #173 para elegir reglas. No se toca `main`, `sabik-preview`, producción, Netlify, S0, S1, B3, voz ni S2.
