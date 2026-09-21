# I0_EXECUTOR_V3_DEVELOPMENT_READY

**Fecha:** 20/09/2026  
**Coordinación:** Astra  
**PR:** #184  
**Base exacta:** `8ce798447d79eff22caaec15d03105073069e7d8`

## Estado

V3 development ciego completado.

Fuentes utilizadas:
- contratos I0 v0.4;
- schema v0.4;
- documentación normativa;
- development V0.4;
- tests contractuales;
- calibration V2 consumida como `CONSUMED_DIAGNOSTIC_REGRESSION_SET`.

Fuentes reservadas no abiertas ni consultadas:
- PR #183 / corpus calibration V3;
- #173 / validation reservada.

Calibration V3 no fue ejecutada.

## 1. PR y HEAD

- PR nuevo: **#184 · I0 · ejecutor V3 · desarrollo ciego**
- rama: `sabik/i0-executor-v3-development-20260920`
- base: `sabik/i0-executor-v2-20260920`
- base SHA exacta: `8ce798447d79eff22caaec15d03105073069e7d8`
- HEAD de evidencia antes de este documento: `4542de30cdce92c98b5a0dd1885ee56ce4cd3b48`
- estado: OPEN · DRAFT · NO MERGE
- commits antes de este documento: 4
- archivos antes de este documento: 18

## 2. Causas raíz V2-R1 / calibration V2 consumida

### Safety

La cobertura léxica era demasiado estrecha y la precedencia confundía:
- riesgo confirmado;
- incertidumbre;
- resolución posterior;
- petición humana urgente/no urgente.

### Negación

El scope dependía de conjugaciones parciales y podía:
- ejecutar el verbo negado;
- afectar una cláusula positiva;
- perder contraste/corrección;
- fallar en DETENER, ATRAS, preferencias o repeat.

### Multiacción

Las familias dominantes eran:
- matching por substring entre cláusulas;
- cues morfológicos incompletos;
- repeat confundido con atrás/siguiente;
- command plan correcto con acción omitida/extra;
- parámetros opacos que antes se contabilizaban como acción perdida + extra.

### insufficient

La política era correcta una vez detectado el intent, pero human-help normal/offline no estaba clasificado de forma suficientemente general.

## 3. Arquitectura V3

Orden:

`normalización → Safety → estructura de cláusulas → intención → parámetros → contexto → construcción por acción → política → ResultKind/S0/B3`

Se mantiene:
- riesgo por acción;
- navegación al final;
- score heurístico como `evidence_score`, nunca probabilidad;
- nearest-neighbour solo como fallback.

## 4. Safety V3

Reglas por familias:
- contexto explícitamente no personal;
- handoff por recurso humano + peligro/urgencia actual;
- confirmed por urgencia, inminencia, autodaño o peligro actual;
- uncertain por duda/temor + seguridad propia;
- cleared por resolución posterior;
- human-help explícitamente no urgente no activa Safety;
- una construcción `ya no/no es/no hay/no existe` impide reactivar confirmed desde el sintagma negado.

Precedencia:
- cleared posterior cierra riesgo anterior;
- sin cierre posterior, handoff/confirmed prevalecen sobre uncertain.

Resultados:
- development: **400/400 Safety exact**
- regression V2 consumida: **200/200 Safety exact**
- errores conocidos: **0**

## 5. Negación V3

La negación se restringe a fronteras de cláusula:
- puntuación;
- y;
- pero;
- aunque;
- luego;
- después;
- además;
- mientras.

Se modela:
- acción afectada;
- continuación positiva;
- contraste;
- corrección;
- multiacción con una acción negada y otra permitida.

Familias tipadas:
- tamaño de texto;
- movimiento;
- paso a paso;
- vista sencilla;
- ATRAS;
- repeat;
- DETENER.

Resultados:
- development negativos: **4/4**, 0 falsos disparos
- development controles positivos: **4/4**
- regression consumida negativos: **20/20**, 0 falsos disparos
- regression consumida controles positivos disponibles: **0**

## 6. Multiacción V3

Cambios:
- cues con fronteras de palabra;
- segmentación por cláusulas;
- vocabulario morfológico general;
- repeat separado de ATRAS/SIGUIENTE;
- acciones por command;
- navegación al final;
- métrica distingue `wrong parameters` de omitida/extra.

### DEVELOPMENT

- total: 25
- command exact: **25/25**
- action exact: **25/25**
- action exact | command exact: **25/25 = 100%**
- omitidas cuando command exact: **0**
- extra cuando command exact: **0**
- incorrectas cuando command exact: **0**
- errores de orden cuando command exact: **0**
- structural gate: **PASS**
- full exact: 20/25 por el gap ResultKind documentado en búsqueda+acción.

### CALIBRATION V2 CONSUMIDA · REGRESSION ONLY

- total: 15
- command exact: **15/15**
- action exact: **12/15**
- full exact: **12/15**
- action exact | command exact: **12/15 = 80%**
- omitidas cuando command exact: **0**
- extra cuando command exact: **0**
- errores de orden cuando command exact: **0**
- parámetros incorrectos cuando command exact: **3**
- structural gate: **PASS**

Los 3 parameter mismatches son `flowId` opacos no derivables del contexto disponible. No se hardcodean.

## 7. insufficient V3

Condiciones contractuales formalizadas:
1. retrieval válido + resultado vacío;
2. undo sin `lastAction`;
3. human-help normal offline sin recurso/fallback aprobado.

Se amplía el vocabulario general de human-help, no frases concretas.

Resultados:
- development: **3/3 kind + no action + no CONFIRMAR + full contractual + full record**
- regression consumida: **2/2** en las mismas cinco condiciones.

## 8. Clasificación y parámetros

Cambios:
- matching con fronteras de palabra;
- morfología general por intent;
- parsing de cláusulas;
- cues de repetición/navegación separados;
- human-help generalizado;
- contextId actual si existe flujo/contexto;
- canonicalización de query conservada;
- fallback de similitud solo tras reglas contractuales.

## 9. Gaps de contrato/dataset

### flowId opaco

Tres casos regression esperan un `flowId` no incluido en el contexto.

V3 reporta misma action type con parámetro incorrecto. No inventa ni memoriza el ID.

### ResultKind búsqueda + acción

Development y regression consumido asignan distintos ResultKind a estructuras equivalentes.

V3 adopta:
- acción ejecutada → `action_result`;
- búsqueda sin acción → `response`.

Por eso development multiacción conserva command/action 25/25 aunque full exact sea 20/25.

### Canon query

El contrato no define una ontología exhaustiva. Alias futuros deben ser vocabulario general de producto, no excepciones por corpus.

## 10. Tests contractuales nuevos

Suite final CI:

**37/37 PASS**

Incluye:
- Safety directo;
- Safety + acción ordinaria;
- Safety no personal;
- precedencia cleared/confirmed;
- negación simple;
- negación + continuación positiva;
- contraste;
- corrección;
- negación de speech/assistant/back;
- multiacción de 2;
- multiacción de 3;
- riesgos mixtos;
- parcialidad por pérdida real;
- search + action;
- details + repeat;
- step + next;
- insufficient tres familias;
- clarification;
- contexto pendiente;
- unsentText;
- confirmación;
- cancelación;
- referencia deíctica;
- localización;
- navegación final;
- score no probabilístico.

Run final:
- GitHub Actions `35525039169`
- resultado: **SUCCESS**

## 11. Anti-hardcode

**PASS**

Comprobaciones:
- 400 casos development;
- 200 casos regression consumida;
- 450 utterances largas exactas comprobadas;
- 0 coincidencias;
- 0 IDs `I0-DEV-*`;
- 0 IDs `I0-CAL-*`;
- 0 tablas de excepciones caso a caso.

El primer run detectó dos literales heredados de V2; se eliminaron y se sustituyeron por reglas generales de cancelación de confirmación y rechazo de resultado.

## 12. DEVELOPMENT · métricas V3

Casos: **400**

- full exact: **258/400 = 64.50%**
- command exact: **283/400 = 70.75%**
- action exact: **331/400 = 82.75%**
- ResultKind: **346/400 = 86.50%**
- S0: **390/400 = 97.50%**
- B3: **361/400 = 90.25%**
- Safety: **400/400 = 100%**

Clasificación:
- TP 298 · FP 9 · FN 35 · TN 58
- precision **0.97068**
- recall **0.89489**
- F1 **0.93125**

Ejecución:
- TP 187 · FP **6** · FN 26 · TN 181
- precision **0.96891**
- recall **0.87793**
- F1 **0.92118**
- action exact | command exact: **272/283 = 96.11%**

Negación:
- negativos 4/4
- controles positivos 4/4

Insufficient:
- 3/3 full contractual
- 3/3 full record

Multiacción:
- command 25/25
- action 25/25
- full 20/25
- action|command 100%
- omitidas/extra/wrong/orden cuando command exact: 0/0/0/0

## 13. CALIBRATION V2 CONSUMIDA · REGRESSION ONLY

Rol:

**`CONSUMED_DIAGNOSTIC_REGRESSION_SET`**

Casos: **200**

- full exact: **86/200 = 43.00%**
- command exact: **128/200 = 64.00%**
- action exact: **160/200 = 80.00%**
- ResultKind: **145/200 = 72.50%**
- S0: **163/200 = 81.50%**
- B3: **180/200 = 90.00%**
- Safety: **200/200 = 100%**

Clasificación:
- TP 102 · FP 9 · FN 34 · TN 55
- precision **0.91892**
- recall **0.75000**
- F1 **0.82591**

Ejecución:
- TP 59 · FP **10** · FN **10** · TN 121
- precision **0.85507**
- recall **0.85507**
- F1 **0.85507**
- action exact | command exact: **116/128 = 90.63%**

Negación:
- negativos: **20/20**
- falsos disparos: **0**
- controles positivos disponibles: 0

Insufficient:
- **2/2** full contractual
- **2/2** full record

Multiacción:
- command exact **15/15**
- action exact **12/15**
- full exact **12/15**
- action|command **12/15 = 80%**
- omitidas cuando command exact **0**
- extra cuando command exact **0**
- wrong parameters cuando command exact **3**
- order errors cuando command exact **0**

## 14. V2-R1 ↔ V3 · DEVELOPMENT

| Métrica | V2-R1 | V3 |
|---|---:|---:|
| Full exact | 65.00% | 64.50% |
| Command exact | 71.25% | 70.75% |
| Action exact | 82.00% | **82.75%** |
| ResultKind | 86.75% | 86.50% |
| S0 | 97.00% | **97.50%** |
| B3 | 89.50% | **90.25%** |
| Safety | 100% | **100%** |
| Execution FP | 13 | **6** |
| Execution FN | 26 | 26 |
| Execution F1 | 0.90557 | **0.92118** |
| Negative false triggers | 0 | 0 |
| Insufficient | 3/3 | 3/3 |

V3 sacrifica 0.5 pp de full exact y command exact, pero reduce FP de ejecución 13→6 y mejora action exact, S0, B3 y F1 de ejecución.

## 15. V2-R1 ↔ V3 · CONSUMED REGRESSION

| Métrica | V2-R1 | V3 |
|---|---:|---:|
| Full exact | 28.00% | **43.00%** |
| Command exact | 57.50% | **64.00%** |
| Action exact | 72.00% | **80.00%** |
| ResultKind | 65.50% | **72.50%** |
| S0 | 76.00% | **81.50%** |
| B3 | 85.00% | **90.00%** |
| Safety | 95.00% | **100%** |
| Classification F1 | 0.81301 | **0.82591** |
| Execution FP | 20 | **10** |
| Execution FN | 9 | 10 |
| Execution F1 | 0.80537 | **0.85507** |
| Negation | 10/20 | **20/20** |
| Insufficient | 1/2 | **2/2** |
| Multi command exact | 9/15 | **15/15** |
| Multi action exact | 8/15 | **12/15** |
| Multi full exact | 5/15 | **12/15** |

Esta población es regression consumida; no se presenta como evidencia independiente.

## 16. Parámetros actualmente fijos

- `fallback_accept_score_min = 0.34`
- precedencia/resolución Safety;
- scope de negación por cláusula;
- política por acción;
- navegación al final;
- `evidence_score` no probabilístico.

No se seleccionan thresholds nuevos en V3 development.

## 17. Parámetros candidatos a futura calibration

Candidato potencial:
- `fallback_accept_score_min`

Estado:
- parámetro candidato;
- grid V3 **no congelado** todavía;
- no se diseña retrospectivamente desde corpus reservado.

Un segundo freeze será necesario antes de abrir calibration V3.

## 18. Aislamiento

Confirmaciones:

- **PR #183 no fue abierto, leído, listado, buscado ni consultado.**
- **Corpus calibration V3 no fue ejecutado.**
- **#173 no fue abierto ni consultado.**
- **Validation reservada no fue ejecutada.**
- development no modificado.
- calibration V2 consumida no modificada.
- schema no modificado.

Manifest:
- `reserved_calibration_v3_opened=false`
- `reserved_calibration_v3_executed=false`
- `validation_opened=false`
- `validation_executed=false`
- `datasets_modified=false`
- `schema_modified=false`

## 19. Artefactos

SHA-256:
- `comparison-v2-r1-v3.json`: `9b1bdf6cde2e0caa4cc18e59e8f8e70af558f5a72e8d5b74eb205260ce825a43`
- `critical-gates.v3.json`: `adb179766705407937cbad13511fdbe4e27060f58f3f904820199aed9535d12e`
- `errors.development.v3.json`: `d4d2230385e8fcb1f5851714c515e27d15bfec6470f8573c3de4d854db8ec4f5`
- `errors.regression-v2-consumed.v3.json`: `0589127d8b4b09ca872806ecff296ddd88b4a27e756888e710c72964af8f5dfa`
- `metrics.development.v3.json`: `f4c0b942f406598d30b6f8b5569befd231ac031d523bf52873d86e616017e13d`
- `metrics.regression-v2-consumed.v3.json`: `6c70138a6087e6f4c2592e7795c41b4f102cb13de4473f57917fb2d1e02fdc75`
- `predictions.development.v3.jsonl`: `257b680724818ea0ecd72abef9dde48694e49bb54ff0b508568ff53cb268ddf9`
- `predictions.regression-v2-consumed.v3.jsonl`: `9405d0630fd62da7edc5bd68b7c0c64bae80a727d35767026341b4466c5dde57`

## 20. Estado de PR

- PR #184: OPEN · DRAFT · NO MERGE
- PR #180: OPEN · DRAFT · NO MERGE · HEAD histórico intacto `8ce798447d79eff22caaec15d03105073069e7d8`
- PR #177: OPEN · DRAFT · NO MERGE
- #174: OPEN

## Cierre

V3 development queda listo para revisión Astra.

Esta entrega **NO autoriza calibration V3**.
