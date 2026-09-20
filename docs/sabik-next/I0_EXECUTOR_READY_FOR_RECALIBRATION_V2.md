# I0_EXECUTOR_READY_FOR_RECALIBRATION_V2

**Fecha:** 20/09/2026  
**Fase:** I0 · corrección estructural del ejecutor V2  
**Estado:** development-only completo; pendiente de revisión Astra antes de cualquier nueva calibración.

## 1. Nuevo PR

- PR: **#180 · I0 · corrección estructural del ejecutor V2**
- rama: `sabik/i0-executor-v2-20260920`
- estado: **OPEN · DRAFT · NO MERGE**
- apilado sobre la rama de PR #177.

## 2. HEAD

Commit fuente ejecutado por el run final development-only `35508837589`:

`f19f2ce987af3fb2308dfda2a115e088a97e6aac`

Commit automático de evidencia generado por ese run:

`a1666fcfb0788d2c8a178704b94b45cf29b22f07`

La documentación final se añade después mediante commits exclusivamente documentales, sin modificar código ni volver a ejecutar development.

## 3. Base exacta

`04569282ab3637a60ecccb002c8e49b8c4f3cd2a`

Ese commit continúa siendo la evidencia congelada de `CALIBRATION_RUN_V1`.

PR #177 permanece exactamente en ese HEAD, OPEN/DRAFT/NO MERGE.

## 4. Archivos de la fase

Antes de este informe, el diff apilado contiene 11 archivos:

1. `.github/workflows/sabik-i0-executor-v2-development.yml`
2. `docs/sabik-next/I0_EXECUTOR_V2_ARCHITECTURE.md`
3. `reports/sabik/i0/executor-v2-development/comparison-v1-v2.development.json`
4. `reports/sabik/i0/executor-v2-development/errors.development.v2.json`
5. `reports/sabik/i0/executor-v2-development/manifest.development.v2.json`
6. `reports/sabik/i0/executor-v2-development/metrics.development.v2.json`
7. `reports/sabik/i0/executor-v2-development/predictions.development.v2.jsonl`
8. `reports/sabik/i0/executor-v2-development/score-distribution.development.v2.json`
9. `tools/run-sabik-i0-development-v2.mjs`
10. `tools/sabik-i0-executor-v2.mjs`
11. `tools/test-sabik-i0-executor-v2.mjs`

Este informe será el archivo 12.

No se modifican:
- `tests/development/sabik/i0/**`;
- `tests/calibration/sabik/i0/**`;
- `tests/schemas/sabik/i0/**`;
- `tests/evaluation/sabik/i0/validation/**`.

Development congelado:
SHA-256 `c388607d55c5c8daef721217e49f01c0dd7e17d81c27af2f6e76f3c44cca97fb`.

## 5. Arquitectura anterior

V1 hacía:

```text
turno
→ command plan
→ construcción de todas las acciones
→ reducción de todo el plan a una sola clase de riesgo
→ un threshold global
→ ejecutar todas / aclarar todas / ejecutar ninguna
```

Si una sola acción era `local_with_loss`, todo el plan quedaba gobernado por ese riesgo.

Además:
- clasificación y ejecución estaban acopladas;
- una decisión conservadora podía vaciar un command plan correcto;
- `confidence` era en realidad una similitud heurística;
- `margin` no podía cambiar ninguna decisión en V1.

## 6. Causas raíz identificadas

1. **Riesgo global de plan** en vez de riesgo por acción.
2. **Política all-or-nothing** en multiacción.
3. **Mezcla classification / construction / policy / interaction**.
4. **Negación con alcance insuficientemente localizado**.
5. **Safety con prioridades léxicas no totalmente contractuales**.
6. **Score de similitud llamado confidence** sin semántica probabilística.
7. **Margin inerte** presentado como calibrable.
8. **Selección V1 demasiado conservadora**, que reducía falsos positivos a costa de 170 FN de ejecución en development.

## 7. Arquitectura corregida

V2 separa:

```text
Safety Gate
→ clasificación de command plan
→ resolución de parámetros
→ construcción de action proposals
→ política por acción
→ orden contractual
→ ResultKind / S0 / B3
```

Las cuatro capas quedan explícitas:

A. clasificación  
B. construcción  
C. política de riesgo  
D. resultado de interacción

Una mala evidencia de ejecución ya no destruye una clasificación válida y una acción bloqueada no elimina otras acciones independientes permitidas.

## 8. Política por acción

Cada propuesta conserva:

- `origin_command_index`;
- intent;
- parámetros;
- riesgo;
- `evidence_score`;
- `score_kind`;
- decisión;
- motivo;
- acción tipada.

### local_reversible

Una acción reversible inequívoca se ejecuta de forma independiente.

No se convierte en `local_with_loss` porque otra acción del mismo turno lo sea.

### local_with_loss

Se evalúa de forma individual.

Bloqueos contractuales implementados:
- `unsentText=true`;
- `pendingClarification`;
- fallback semántico no resuelto explícitamente.

La acción bloqueada se conserva en `action_decisions` con motivo; no desaparece silenciosamente.

### Confirmación

`CONFIRMAR_ACCION` recupera y ejecuta exactamente la acción tipada de `pendingConfirmation`.

## 9. Tratamiento multiacción

V2:

1. clasifica hasta 3 comandos;
2. mantiene su orden;
3. resuelve parámetros individualmente;
4. construye una acción por comando cuando corresponde;
5. aplica riesgo por acción;
6. permite parcialidad únicamente según contrato;
7. ordena navegación al final;
8. registra acciones bloqueadas por política;
9. no usa una decisión global para vaciar el plan.

Resultado development final:

- casos multiacción: **25**
- command exact: **25/25**
- action exact: **25/25**
- full exact: **25/25**
- acciones omitidas: **0**
- extra: **0**
- incorrectas: **0**
- errores de orden: **0**
- **action exact condicionado a command exact: 25/25 = 100 %**

El patrón V1 `command-plan correcto → action-plan vacío` desaparece en esta población.

## 10. Tratamiento de negación

La negación se liga al comando/acción correspondiente.

Un comando negado:
- puede seguir siendo clasificado;
- conserva su semántica;
- genera una propuesta conocida;
- la política marca `blocked_negation`;
- no ejecuta esa acción;
- no vuelve pasivo el resto del turno.

Se corrigió también el alcance para que una construcción como `sin avanzar y repite...` no niegue retrospectivamente otros comandos.

Development crítico:
- negativos: **4/4**
- falsos disparos: **0**
- controles positivos: **4/4**
- fallos positivos: **0**

No queda ninguna inversión crítica conocida en los controles congelados.

## 11. Tratamiento Safety

Safety se ejecuta **antes** de la semántica ordinaria.

Orden contractual V2:
1. contexto explícitamente no personal;
2. handoff;
3. confirmed;
4. uncertain;
5. cleared;
6. normal.

Un gate no-normal:
- produce cero comandos ordinarios;
- produce cero acciones ordinarias;
- emite el evento S0 correspondiente.

Development final:
- Safety Gate exact: **400/400 = 100 %**

No queda ningún caso Safety development conocido que llegue a ejecución ordinaria como normal.

## 12. Tratamiento `insufficient`

Se conservan las tres familias:
- búsqueda válida sin resultados;
- undo sin `lastAction`;
- human-help offline sin recurso/fallback aprobado.

Resultado:
- kind correcto: **3/3**
- sin acción inventada: **3/3**
- B3 distinto de CONFIRMAR: **3/3**
- full contractual: **3/3**
- full record: **3/3**

DEV-0400 queda también full exact mediante resolución general de búsqueda, sin excepción por ID.

## 13. Semántica de score / confidence

V2 elimina la interpretación probabilística.

Nombre:

**`evidence_score`**

Semántica:
- fuerza de evidencia contractual o similitud de fallback;
- valor diagnóstico;
- **no es probabilidad**;
- no se reporta como confidence calibrada.

Tipos:
- `contract_exact`;
- `contract_context`;
- `contract_correction`;
- `development_similarity`;
- `development_context_resolution`;
- `development_fallback`.

V2 elimina:
- top1/top2 probabilísticos aparentes;
- `margin` como parámetro de calibración;
- threshold global de riesgo de plan.

## 14. Parámetros fijos

Quedan **FIJOS por contrato/diseño**, no calibrables:

- precedencia Safety;
- alcance semántico de negación;
- ejecución de reversible independiente inequívoca;
- bloqueo `local_with_loss` por `unsentText`;
- bloqueo `local_with_loss` por `pendingClarification`;
- navegación al final;
- separación classification / construction / policy / result.

`fallback_accept_score_min = 0.34` permanece fijo/provisional durante development V2.

**No se declara calibrado.**

## 15. Parámetros realmente calibrables

Solo se conserva como candidato futuro:

`fallback_accept_score_min`

Aplica exclusivamente a `development_similarity`, no a reglas contractuales ni a resolución de contexto.

Candidatos development que sí cambian decisiones:

- **0.484**
- **0.700**

Sensibilidad respecto del provisional 0.34:

| candidato | fallback rechazados | aceptados | decisiones que cambiarían |
|---:|---:|---:|---:|
| 0.484 | 6 | 70 | 6 |
| 0.700 | 14 | 62 | 14 |

Por tanto el parámetro tiene capacidad real de discriminación y puede someterse a una futura calibration, si Astra la autoriza.

## 16. Distribución development usada para futuros grids

### `development_similarity` — población relevante para fallback

- n: **76**
- min: **0.3784**
- p10: **0.48447**
- p25: **0.7000**
- p50: **0.7000**
- p75: **0.7000**
- p90: **0.7000**
- max: **0.7000**
- media: **0.66641**

### Resolución de contexto — registrada aparte, no usada para el threshold anterior

- n: **29**
- min: **0.05509**
- p10: **0.1950**
- p25: **0.26033**
- p50: **0.30268**
- p75: **0.32367**
- p90: **0.39340**
- max: **0.4190**
- media: **0.29514**

La separación evita repetir el defecto V1 de calibrar parámetros sobre una distribución incapaz de modificar decisiones.

## 17. Pruebas contractuales añadidas

`tools/test-sabik-i0-executor-v2.mjs`

**19/19 PASS**.

Cobertura:
1. reversible simple;
2. with_loss;
3. reversible + reversible;
4. reversible + with_loss;
5. navegación al final;
6. parcialidad permitida;
7. parcialidad bloqueada;
8. negación;
9. positivo de negación;
10. insufficient;
11. Safety;
12. aclaración;
13. lastAction;
14. undo sin lastAction;
15. pendingClarification;
16. pendingConfirmation;
17. capability boundary;
18. Safety en contexto no personal;
19. semántica de score no probabilística.

Son pruebas sintéticas derivadas del contrato; no contienen casos de calibration ni validation.

Workflow final development-only:

`35508837589` · **SUCCESS**

Además verifica:
- development/schema sin cambios;
- sintaxis;
- tests;
- ausencia de rutas calibration/validation en runtime V2.

## 18. Métricas completas development V2

Dataset: **400 casos · leave-one-out**

### Global

- full exact: **246/400 = 61.50 %**
- incorrectos: **154**

### Clasificación

- command-plan exact: **270/400 = 67.50 %**
- TP 297
- FP 8
- FN 36
- TN 59
- precision **0.97377**
- recall **0.89189**
- F1 **0.93103**

### Construcción / ejecución

- action-plan exact: **328/400 = 82.00 %**
- TP 187
- FP 13
- FN 26
- TN 174
- precision **0.93500**
- recall **0.87793**
- F1 **0.90557**
- acciones omitidas: **58**
- acciones extra: **47**
- acciones incorrectas: **29**
- action exact condicionado a command exact: **255/270 = 94.44 %**

### ResultKind

- **347/400 = 86.75 %**

### S0 events

- **387/400 = 96.75 %**

### B3

- **363/400 = 90.75 %**

### Safety

- **400/400 = 100 %**

### Por clase de riesgo

**local_with_loss**
- casos 53
- command exact 50/53
- action exact 50/53
- full exact 50/53
- execution precision 1.0000
- recall 0.94340
- F1 0.97087

**local_reversible**
- casos 155
- command exact 108/155
- action exact 99/155
- full exact 99/155
- execution precision 1.0000
- recall 0.85161
- F1 0.91986

**mixed**
- casos 5
- command/action/full exact **5/5**
- execution precision/recall/F1 **1.0 / 1.0 / 1.0**

**none**
- casos 187
- action exact 174/187
- 13 falsos positivos de ejecución asociados a errores de clasificación ordinaria; quedan documentados para una fase posterior y no se han corregido usando calibration.

### Multiacción

- 25/25 command exact
- 25/25 action exact
- 25/25 full exact
- 0 omitidas
- 0 extra
- 0 incorrectas
- 0 errores de orden
- action exact | command exact: **100 %**

### Negación crítica

- negativos: **4/4**
- falsos disparos: **0**
- positivos: **4/4**
- fallos: **0**

### Insufficient

- **3/3 full contractual**
- **3/3 full record**

## 19. Comparación development V1 ↔ V2

| Métrica | V1 | V2 |
|---|---:|---:|
| full exact | 25.75 % | **61.50 %** |
| command-plan exact | 63.50 % | **67.50 %** |
| action-plan exact | 53.75 % | **82.00 %** |
| ResultKind | 51.25 % | **86.75 %** |
| S0 events | 51.25 % | **96.75 %** |
| B3 | 79.50 % | **90.75 %** |
| Safety | 98.50 % | **100 %** |
| execution precision | 0.9773 | 0.9350 |
| execution recall | 0.2019 | **0.8779** |
| execution F1 | 0.3346 | **0.9056** |
| multi action exact | 0/25 | **25/25** |
| multi full exact | 0/25 | **25/25** |
| negativos críticos | 4/4 | **4/4** |
| positivos críticos | 2/4 | **4/4** |
| insufficient contractual | 3/3 | **3/3** |

El aumento de recall no se oculta detrás de accuracy: execution FP pasa de 1 a 13. Es deuda real de clasificación ordinaria y permanece documentada. No se ha usado calibration para reducirla.

## 20. Calibration no se volvió a ejecutar

Confirmación explícita:

**NO se volvió a ejecutar calibration.**

Evidencia:
- el workflow V2 carga exclusivamente development;
- `manifest.development.v2.json` registra `calibration_loaded: false`;
- el workflow incluye un guard que falla si el runtime V2 contiene rutas de calibration/evaluation;
- todos los resultados V2 proceden de `development.v0.4.jsonl`;
- no se ha realizado ningún sweep V2.

Esta entrega **NO autoriza CALIBRATION_RUN_V2**.

## 21. #173 / validation

Confirmación explícita:

**#173 no se abrió ni se utilizó durante esta fase.**

No se cargó:
- ningún shard de validation;
- ningún label de validation;
- ninguna predicción de validation;
- ninguna métrica de validation.

`manifest.development.v2.json` registra:

- `validation_loaded: false`

El guard de CI prohíbe rutas de evaluation en el runtime V2.

## Artefactos development V2

SHA-256:

- `predictions.development.v2.jsonl`  
  `eaff309997fd0d9acc19d1e2f23ecd27614383ebd55d6f7d34f08832e1c89e1c`
- `metrics.development.v2.json`  
  `b8d8bf047e733ec8d11ff2a2cead614cfcb4dae5f26d6212f6c7dac7c2856c36`
- `errors.development.v2.json`  
  `795ba2db33a30d7276af4eb38f84277eedb00b0d01a66a7d7448a4c58ec5ebc3`
- `score-distribution.development.v2.json`  
  `6968f758e1bfdf99d389537847f2496f2a2b25520e7fdb9f045f2e3b744c4aab`
- `comparison-v1-v2.development.json`  
  `406cb09dc52c3fe4e77510fa0a19f6d1249daf9029aef5b9281e02a578d9b855`

## Estado de salida

- PR #177: evidencia V1 intacta y congelada.
- PR #180: V2 development-only, DRAFT.
- development/calibration/schema: sin cambios.
- calibration V2: **NO ejecutada**.
- validation #173: **NO utilizada**.
- merge: **NO**.

La decisión sobre una futura `CALIBRATION_RUN_V2` corresponde exclusivamente a Astra.
