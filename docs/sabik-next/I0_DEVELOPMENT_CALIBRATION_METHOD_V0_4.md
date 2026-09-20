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

## Identidad congelada tras el gate anti-contaminación

Development:
- SHA-256 `6503fe8ab88dc8e51156e9803f19e2ba2c4fa060a88597cf81821d8d43670376`
- Git blob esperado `2b36308392835db8e3eb71693e325978dc31818c`

Calibration:
- SHA-256 `b1b6087e2947790e183ddcc929cc520be607102db6a917967f331066f21a8981`
- Git blob esperado `517a6591c90f88479979c0f2b860d9ab53c2dc55`

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

Solo reporta sospechosos. No borra automáticamente ningún caso.

Durante la preparación inicial se detectaron 19 coincidencias exactas contra #173:
- 5 corresponden a contrastes literales que la orden Astra actual exige expresamente y se conservan etiquetados `astra_required_literal`;
- 14 coincidencias accidentales se revisaron manualmente y se sustituyeron por escenarios/formulaciones nuevas antes de congelar estos hashes.

Esta revisión fue exclusivamente de anti-contaminación, antes de cualquier ejecución de modelo: no se utilizaron errores de validation ni se ajustaron reglas/umbrales.

## Alcance

No se implementa Core definitivo. No se ejecuta validation #173 para elegir reglas. No se toca `main`, `sabik-preview`, producción, Netlify, S0, S1, B3, voz ni S2.
