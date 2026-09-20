# I0 · EXECUTOR V2-R1 · PRE-CALIBRATION FREEZE

**Fecha:** 20/09/2026  
**Base:** PR #180 @ `2267aa5e506156139432e53f7dce6707bd697f9c`  
**Estado:** development-only; calibration V2 no autorizada.  
**Freeze funcional V2-R1:** `09e65f789c2b9c811532ac90fc0533db693c2353`

## Objetivo

Eliminar sobreajuste literal de V2, externalizar el único threshold numérico y congelar antes de calibration:
- ejecutor;
- configuración;
- grid;
- métricas;
- scoring/selección;
- tests;
- comando futuro del sweep.

## Resolución de query sin frases específicas

Se eliminan de `resolveSearchQuery()` las tres correspondencias literales observadas en V2.

R1 usa tres mecanismos generales:

### 1. Ausencia en índice

Regla gramatical general:

`<sintagma> que no <figura|aparece|consta|se encuentra|está> en el índice`

se normaliza a:

`<sintagma> no indexado/a/os/as`.

La concordancia se deriva del sustantivo, no de una frase congelada.

### 2. Canon semántico de foco/concentración

Existe un canon conceptual `concentrarme` para vocabulario de:
- concentración;
- concentrarse;
- enfoque;
- foco mental.

No depende de una redacción completa concreta.

### 3. Corrección de referencia deíctica hacia localización

Cuando una orden anterior intenta abrir un tipo de contenido y una cláusula posterior corrige la intención hacia `dónde / ubicación / localización`, el sistema:
1. extrae el sustantivo del referente anterior;
2. genera `<sustantivo> seleccionado/a`;
3. conserva `ENCONTRAR_CONTENIDO{mode:"locate"}`;
4. descarta la navegación previa cuando la cláusula posterior es una corrección.

No existe tabla por frase ni por ID.

## Gap contractual / dataset

Los valores de query del corpus son cadenas canónicas y el contrato I0 v0.4 no define por completo una ontología de canonicalización semántica.

R1 documenta esta limitación. El canon de foco es vocabulario explícito del ejecutor; no se presenta como una derivación obligatoria del contrato. Si futuros conceptos requieren alias canónicos, deberán definirse como vocabulario de producto separado y revisable, no como parches por ejemplo.

## Threshold externo

El ejecutor recibe:

`fallback_accept_score_min`

mediante configuración.

Valor baseline R1:

`0.34`

El código permite suministrar otro valor sin editar el ejecutor.

## Grid congelado

`[0.34, 0.484, 0.700]`

Interpretación:
- 0.34 → baseline V2;
- 0.484 → corte sensible derivado de development;
- 0.700 → corte restrictivo derivado de development.

No se añadirán candidatos después de abrir calibration.

## Selección futura

Archivo:

`tools/sabik-i0-calibration-v2-selection.mjs`

Gates previos a ranking:
- Safety sin errores;
- cero falsos disparos de negación crítica;
- cero fallos en controles positivos;
- insufficient contractual completo;
- multiacción full exact completa.

Ranking posterior:
1. minimizar execution FP en `local_with_loss`;
2. maximizar F1 de ejecución `local_reversible`;
3. maximizar F1 global de ejecución;
4. maximizar full exact;
5. minimizar execution FN;
6. minimizar clarification;
7. minimizar abstention;
8. threshold menor como desempate determinista.

La selección no usa accuracy global como criterio único.

## Métricas congeladas para calibration futura

Cada candidato conservará por separado:
- execution FP;
- execution FN;
- precision;
- recall;
- F1;
- Safety;
- negación;
- multiacción;
- full exact;
- clarification;
- abstention;
- errores por riesgo;
- ResultKind;
- S0;
- B3.

## Mismos 200 casos

El runner futuro:
- exige exactamente 200 casos de calibration;
- exige 200 IDs únicos;
- evalúa los tres thresholds en el mismo orden y sobre los mismos IDs;
- falla si un candidato produce una cobertura diferente.

## Comando futuro congelado

`node tools/run-sabik-i0-calibration-v2.mjs --astra-authorized --config config/sabik/i0/executor-v2-r1.json --output reports/sabik/i0/calibration-v2`

El runner rechaza la ejecución si falta `--astra-authorized`.

Esta orden actual **no ejecuta** ese comando.

## Generalización sintética

Las pruebas añaden redacciones nuevas no copiadas del corpus para:
- contenido ausente del índice;
- concepto foco/concentración;
- corrección deíctica de abrir → localizar;
- los tres valores externos del grid;
- selección futura no basada solo en accuracy.

## Invariantes development

R1 solo se considera congelable si development conserva:
- Safety 400/400;
- negativos críticos 4/4;
- controles positivos 4/4;
- insufficient 3/3;
- multiacción command/action/full 25/25;
- cero hardcodes por ID o por las frases retiradas.


## Development R1 · resultado congelado

Ejecución reproducible del ejecutor funcional `09e65f789c2b9c811532ac90fc0533db693c2353`, usando únicamente development leave-one-out y threshold externo `0.34`.

- full exact: **260/400 = 65,00 %**
- command-plan exact: **285/400 = 71,25 %**
- action-plan exact: **328/400 = 82,00 %**
- ResultKind: **347/400 = 86,75 %**
- S0 events: **388/400 = 97,00 %**
- B3: **358/400 = 89,50 %**
- Safety: **400/400 = 100 %**
- execution FP/FN: **13 / 26**
- execution precision/recall/F1: **0,9350 / 0,87793 / 0,90557**
- action exact condicionado a command exact: **270/285 = 94,74 %**
- clarification: **26/400 = 6,50 %**
- abstention: **11/400 = 2,75 %**

Gates:
- Safety: **400/400**
- negativos críticos: **4/4**, 0 falsos disparos
- controles positivos: **4/4**
- insufficient: **3/3 full record**
- multiacción: **25/25 command · 25/25 action · 25/25 full**
- multiacción omitidas/extra/incorrectas/orden: **0/0/0/0**

## V2 ↔ V2-R1

| Métrica | V2 | V2-R1 |
|---|---:|---:|
| full exact | 61,50 % | **65,00 %** |
| command-plan exact | 67,50 % | **71,25 %** |
| action-plan exact | 82,00 % | **82,00 %** |
| ResultKind | 86,75 % | **86,75 %** |
| S0 events | 96,75 % | **97,00 %** |
| B3 | **90,75 %** | 89,50 % |
| Safety | 100 % | **100 %** |
| execution precision | 0,9350 | **0,9350** |
| execution recall | 0,87793 | **0,87793** |
| execution F1 | 0,90557 | **0,90557** |
| multiacción full | 25/25 | **25/25** |

La retirada del hardcode no provoca regresión global: full exact y command-plan mejoran. Se registra una regresión B3 de **−1,25 puntos porcentuales**. No se introduce una corrección oportunista antes de calibration para ocultarla.

## Sensibilidad development del grid congelado

Población `development_similarity`: **53 scores**.

| threshold | rechazados | aceptados | decisiones distintas frente a 0.34 |
|---:|---:|---:|---:|
| 0.34 | 0 | 53 | 0 |
| 0.484 | 6 | 47 | 6 |
| 0.700 | 14 | 39 | 14 |

Los tres valores se ejecutaron externamente sobre development sin editar el ejecutor. Los cinco gates permanecieron correctos con 0.484 y 0.700.

## Estado de carga

El manifest R1 fija:
- `calibration_loaded=false`
- `validation_loaded=false`

No se ejecutó el runner de calibration V2.
