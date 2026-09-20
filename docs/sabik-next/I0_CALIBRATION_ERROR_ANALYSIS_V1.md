# I0 · CALIBRATION ERROR ANALYSIS · V1

**Fuente:** corrida `35507592859` sobre source commit `060d5332e86891abd3c5c853f77bc6d1f2b8d16e`.

## Resumen

Errores de exactitud completa:
- development: 297/400;
- calibration: 146/200;
- total: 443/600.

Las categorías se solapan; un caso puede aparecer en varias.

| Categoría | Total |
|---|---:|
| s0_events | 280 |
| result_kind | 278 |
| action_omitted | 251 |
| classification | 233 |
| b3 | 120 |
| multi_action | 40 |
| action_extra | 21 |
| action_wrong | 19 |
| safety_gate | 15 |
| negation | 13 |
| insufficient | 1 |

## Causas observables principales

### Acción omitida / política demasiado conservadora

Es el fallo dominante de ejecución. En calibration hay 61 falsos negativos de ejecución y 0 falsos positivos; en development hay 170 falsos negativos y 1 falso positivo. El umbral seleccionado protege contra acciones falsas pero deriva una gran parte de acciones correctas a aclaración.

### Multiacción

Los 40 casos fallan el exact match de acciones:
- development: 0/25;
- calibration: 0/15.

El command plan completo sí se reconoce en 28/40, pero esto no se contabiliza como éxito de ejecución.

### ResultKind y S0

La derivación a aclaración produce numerosas discrepancias:
- ResultKind incorrecto: 195 development + 83 calibration;
- S0 events incorrectos: 195 development + 85 calibration.

### Safety Gate

Errores:
- development: 6 errores de gate;
- calibration: 9 errores de gate.

Binario riesgo/no-riesgo:
- development: TP 21, FP 2, FN 3, TN 374;
- calibration: TP 14, FP 0, FN 6, TN 180.

### Negación

Negativos:
- 23/24 sin disparo prohibido;
- único falso disparo: `I0-CAL-0124` → `SPEECH_STOP`.

Controles positivos:
- 2/4 correctos;
- `I0-DEV-0253` y `I0-DEV-0257` no ejecutan la acción esperada.

### Insufficient

La política específica identifica 5/5 casos, no inventa acciones y nunca usa CONFIRMAR.

`I0-DEV-0400` no es full exact porque el command plan añade un comando extra; por eso aparece como error de registro aunque la conducta insufficient sea correcta.

### Confidence

La distribución de margen queda completamente por encima de 0.25:
- development min 0.25365;
- calibration min 0.25400.

Por eso ninguno de los margins candidatos discrimina resultados en esta corrida. Los parámetros `local_with_loss` tampoco modifican el score en el mejor grupo: hay 216 empates.

## Disciplina post-run

No se corrige ningún caso, regla, parámetro ni ejemplo a partir de este análisis. Cualquier cambio futuro deberá ser una fase posterior, explícita y separada de esta evidencia congelada.
