# I0 · EXECUTOR V2-R1 · PRE-CALIBRATION FREEZE

**Fecha:** 20/09/2026  
**Base:** PR #180 @ `2267aa5e506156139432e53f7dce6707bd697f9c`  
**Estado:** development-only; calibration V2 no autorizada.  
**Freeze funcional V2-R1:** `9a4bbd7f11214bcc8bbd4bd411c44103f4e2b212`

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
