# I0_EXECUTOR_V2_R1_FROZEN_FOR_CALIBRATION_REVIEW

**Fecha:** 20/09/2026  
**Coordinación:** Astra  
**PR:** #180  
**Base revisada:** `2267aa5e506156139432e53f7dce6707bd697f9c`

## Estado

V2-R1 queda congelado para revisión de Astra antes de cualquier calibration V2.

Esta entrega **no ejecuta calibration V2**, no abre #173, no modifica datasets y no modifica schema.

## HEAD y freeze

- HEAD de evidencia previo a este documento: `68f4e5413cf77932fdd3585dd68d4471fe2e9b4f`
- freeze funcional de ejecutor/config/grid/selección/tests/sweep: `09e65f789c2b9c811532ac90fc0533db693c2353`
- base Astra revisada: `2267aa5e506156139432e53f7dce6707bd697f9c`

Los commits posteriores al freeze funcional solo preservan compatibilidad histórica, restauran evidencia V2 y registran evidencia development R1.

## Diff desde la base Astra

Antes de este documento: 7 commits, 17 archivos.

Cambios R1:
- configuración externa del ejecutor;
- ejecutor sin hardcodes de frase;
- métricas comunes;
- función de scoring/selección futura;
- runner development R1;
- runner futuro calibration V2;
- pruebas de generalización;
- workflow development R1;
- documentación pre-calibration;
- evidencia development R1.

Compatibilidad histórica:
- el runner V2 histórico mantiene su 0.34 local para reproducir su evidencia;
- su workflow se deja manual para impedir que R1 sobrescriba de nuevo la evidencia V2.

No hay cambios bajo:
- `tests/development/sabik/i0/**`
- `tests/calibration/sabik/i0/**`
- `tests/schemas/sabik/i0/**`
- `tests/evaluation/sabik/i0/validation/**`

## Frases específicas eliminadas

El ejecutor no contiene ya:

- `rutina que no figura en el indice`
- `recuperar la concentracion`
- `solo dime donde esta`

Tampoco contiene excepciones `I0-DEV-*` o `I0-CAL-*`.

El CI R1 comprueba esas ausencias de forma automática.

## Mecanismo general sustituto

### Ausencia en índice

Una regla gramatical general reconoce:

`<sintagma> que no <figura|aparece|consta|se encuentra|está> en el índice`

y produce:

`<sintagma> no indexado/a/os/as`

sin depender del ejemplo congelado.

### Canon semántico de foco

Existe un vocabulario conceptual explícito que agrupa concentración, concentrarse, enfoque y foco mental bajo el query canónico `concentrarme`.

Este canon se aplica tanto al query sintácticamente extraído como, cuando no existe extracción, al texto general de la petición de búsqueda.

### Corrección deíctica hacia localización

Cuando una cláusula intenta abrir un contenido y otra posterior corrige la intención a localizarlo:
- se identifica el sustantivo referente;
- se forma `<sustantivo> seleccionado/a`;
- se conserva `ENCONTRAR_CONTENIDO{mode:"locate"}`;
- se elimina la navegación anterior solo cuando existen señales generales de corrección.

## Gap contrato/dataset

El contrato I0 v0.4 no define una ontología exhaustiva para transformar lenguaje natural en todos los strings canónicos de `query`.

Por eso el canon semántico se documenta como vocabulario de producto explícito, no como consecuencia obligatoria del contrato. Futuros alias deberán añadirse como vocabulario revisable, nunca como excepciones para casos concretos.

## Pruebas nuevas

La suite pasa **24/24**.

Nuevas pruebas R1:
- ausencia en índice con una redacción distinta;
- foco/concentración con una redacción distinta;
- corrección deíctica abrir → localizar con una redacción distinta;
- externalización del threshold para 0.34 / 0.484 / 0.700;
- política de selección congelada que demuestra que global accuracy no es el único criterio.

CI final:

- workflow: `Sabik I0 executor V2-R1 development`
- run: `35512761633`
- resultado: **SUCCESS**
- tests: **24 passed · 0 failed**

## Threshold externo

El ejecutor recibe:

`fallback_accept_score_min`

mediante configuración.

Baseline:

`0.34`

No existe ya una constante interna obligatoria en el ejecutor.

Los tres valores fueron ejecutados sobre development sin modificar código:
- 0.34
- 0.484
- 0.700

## Grid congelado

`[0.34, 0.484, 0.700]`

No se añadirán candidatos después de abrir calibration.

Sensibilidad development:

| threshold | rechaza development_similarity | acepta | decisiones distintas frente a 0.34 |
|---:|---:|---:|---:|
| 0.34 | 0 | 53 | 0 |
| 0.484 | 6 | 47 | 6 |
| 0.700 | 14 | 39 | 14 |

## Scoring y selección futura congelados

Antes de abrir calibration quedan fijados:

- `tools/sabik-i0-evaluation-metrics.mjs`
- `tools/sabik-i0-calibration-v2-selection.mjs`
- `tools/run-sabik-i0-calibration-v2.mjs`
- `config/sabik/i0/executor-v2-r1.json`

Hard gates por candidato:
- cero errores Safety;
- cero falsos disparos críticos de negación;
- cero fallos en controles positivos;
- insufficient contractual completo;
- multiacción full exact completa.

Ranking:
1. minimizar execution FP `local_with_loss`;
2. maximizar execution F1 `local_reversible`;
3. maximizar execution F1 global;
4. maximizar full exact;
5. minimizar execution FN;
6. minimizar clarification;
7. minimizar abstention;
8. threshold menor como desempate.

No se selecciona únicamente por accuracy global.

## Comando futuro de calibration

Congelado, pero **NO EJECUTADO**:

`node tools/run-sabik-i0-calibration-v2.mjs --astra-authorized --config config/sabik/i0/executor-v2-r1.json --output reports/sabik/i0/calibration-v2`

El runner falla si no recibe `--astra-authorized`.

En una futura autorización:
- evaluará exactamente los mismos 200 IDs con cada uno de los tres valores;
- verificará hashes de development/calibration;
- exigirá 200 casos y 200 IDs únicos;
- mantendrá las métricas separadas;
- no cargará validation.

## Development V2-R1 · baseline 0.34

Casos: **400**

### Global

- full exact: **260/400 = 65.00 %**
- incorrectos: **140**
- command-plan exact: **285/400 = 71.25 %**
- action-plan exact: **328/400 = 82.00 %**
- ResultKind: **347/400 = 86.75 %**
- S0 events: **388/400 = 97.00 %**
- B3: **358/400 = 89.50 %**
- Safety: **400/400 = 100 %**

### Clasificación

- TP 298
- FP 9
- FN 35
- TN 58
- precision **0.97068**
- recall **0.89489**
- F1 **0.93125**

### Ejecución

- TP 187
- FP 13
- FN 26
- TN 174
- precision **0.93500**
- recall **0.87793**
- F1 **0.90557**
- acciones omitidas **58**
- extra **47**
- incorrectas **29**
- action exact condicionado a command exact: **270/285 = 94.74 %**

### Clarification / abstention

- clarification: **26/400 = 6.50 %**
- abstention: **11/400 = 2.75 %**

### Por riesgo

`local_with_loss`
- execution FP 0
- FN 3
- precision 1.0000
- recall 0.94340
- F1 0.97087

`local_reversible`
- execution FP 0
- FN 23
- precision 1.0000
- recall 0.85161
- F1 0.91986

`mixed`
- FP 0
- FN 0
- precision / recall / F1 = 1 / 1 / 1

`none`
- execution FP 13
- FN 0

## Gates development

Todos PASS:

- Safety: **400/400**
- negativos críticos: **4/4**, 0 falsos disparos
- controles positivos: **4/4**
- insufficient: **3/3 full contractual y full record**
- multiacción command: **25/25**
- multiacción action: **25/25**
- multiacción full: **25/25**
- multiacción omitidas / extra / incorrectas / orden: **0 / 0 / 0 / 0**

## V2 ↔ V2-R1

| Métrica | V2 | V2-R1 | cambio |
|---|---:|---:|---:|
| full exact | 61.50 % | **65.00 %** | +3.50 pp |
| command-plan exact | 67.50 % | **71.25 %** | +3.75 pp |
| action-plan exact | 82.00 % | **82.00 %** | 0 |
| ResultKind | 86.75 % | **86.75 %** | 0 |
| S0 events | 96.75 % | **97.00 %** | +0.25 pp |
| B3 | **90.75 %** | 89.50 % | **−1.25 pp** |
| Safety | 100 % | **100 %** | 0 |
| execution precision | 0.9350 | **0.9350** | 0 |
| execution recall | 0.87793 | **0.87793** | 0 |
| execution F1 | 0.90557 | **0.90557** | 0 |
| multiacción full | 25/25 | **25/25** | 0 |

La regresión B3 se declara explícitamente. No se modifica oportunistamente el ejecutor antes de calibration para eliminarla.

## Threshold smoke development

### 0.484

- full exact: **260/400 = 65.00 %**
- Safety: 400/400
- multiacción: 25/25 command/action/full
- negación: 4/4 + 4/4
- insufficient: 3/3
- execution FP/FN: **13 / 29**
- precision/recall/F1: **0.93401 / 0.86385 / 0.89756**

### 0.700

- full exact: **259/400 = 64.75 %**
- Safety: 400/400
- multiacción: 25/25 command/action/full
- negación: 4/4 + 4/4
- insufficient: 3/3
- execution FP/FN: **13 / 33**
- precision/recall/F1: **0.93264 / 0.84507 / 0.88670**

## Estado de carga

El manifest final registra:

- `calibration_loaded=false`
- `validation_loaded=false`

No se ejecutó calibration V2.

## Artefactos R1

SHA-256:

- `predictions.development.v2-r1.jsonl`: `5a69aadb8d8a925763655ca3c7faa42a763aea6304f54f95756980cbde9d7319`
- `metrics.development.v2-r1.json`: `a7b8c8ca3f202979b2e1d99f98212d24d88085f8e772996ba4da4212e191a961`
- `errors.development.v2-r1.json`: `f174d7ae76ab5f8c1db9afa233a928ab9e6f25c2ee0db750b862a5879ba2e9c9`
- `score-distribution.development.v2-r1.json`: `cac627ab67783c3a9156523edd6208efc01d4bc5b96588ecc067b3e83aec029b`
- `comparison-v2-v2-r1.development.json`: `e411851d13306a70afaa6dc412e6c587f8a2ee595de61e0d071ad653b78154d6`

## Estado de PR/issues

- PR #177: OPEN · DRAFT · NO MERGE · HEAD `04569282ab3637a60ecccb002c8e49b8c4f3cd2a`
- PR #180: OPEN · DRAFT · NO MERGE
- #174: OPEN
- #173: no se abrió ni se consultó durante V2-R1; último estado verificado antes de esta fase: OPEN

## Salida

V2-R1 queda congelado para inspección Astra.

Esta entrega **NO autoriza CALIBRATION_RUN_V2**.

La próxima acción sobre calibration requiere explícitamente:

`ASTRA_AUTHORIZATION · CALIBRATION_RUN_V2`
