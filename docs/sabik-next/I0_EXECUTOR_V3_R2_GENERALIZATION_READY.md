# I0_EXECUTOR_V3_R2_GENERALIZATION_READY

**Fecha:** 21/09/2026  
**PR:** #202  
**Estado:** OPEN · DRAFT · NO MERGE · NO DEPLOY

## Identidad

- rama: `sabik/i0-executor-v3-r2-generalization-20260921`
- base exacta R1: `b3daefe4f0cd471c8cc92b35472b51f1840569fa`
- HEAD funcional R2 final auditado: `ef66b5dfc1d7aaf6ba802ee128e4a57595986d0f`
- PR #184: congelado; no se continuó
- PR #202: abierto y en draft

El run `35591505782` y el artifact `10634088845` pertenecen al HEAD funcional anterior `9e63e51226ae22dfe6c176f865518b5d39ea500f`. Se conservan como evidencia histórica, pero **no** se utilizan para certificar este HEAD final.

La verificación final descrita aquí se reejecutó sobre el código del HEAD funcional final con las fuentes permitidas del repositorio.

## Fuentes permitidas

Se utilizaron únicamente:

- contratos/schema/documentación normativa;
- development V0.4;
- calibration V2 consumida como regression;
- agregados de Calibration V3 publicados por Astra en #200;
- tests sintéticos propios.

No se leyó ni utilizó:

- corpus Calibration V3;
- PR #183;
- resultados detallados, predicciones, IDs, utterances, discrepancias o artifact V3;
- #195;
- Calibration V4;
- rama V4;
- resultados de Agente 5 sobre V4;
- #173 / validation.

## Arquitectura R2

R2 separa expresamente:

`detección Safety → gate protector → planificación`

Si Safety es distinto de `normal`:

- no se generan commands ordinarios;
- no se generan acciones ordinarias;
- solo se proyecta el resultado contractual permitido.

Propiedades:

- `no_similarity_fallback=true`
- `no_probability_claims=true`
- `no_id_invention=true`
- `no_query_invention=true`
- multiacción composicional por cláusula, slots, parámetros y orden;
- ResultKind / S0 / B3 derivados del plan contractual resuelto.

## Correcciones finales de revisión

La revisión del HEAD inicialmente marcado READY detectó y corrigió tres defectos generales:

1. **Safety personal directa sin palabra de urgencia.**  
   Formas estructurales de peligro personal directo ya no requieren además un marcador como «inmediato» para activar el gate protector.

2. **No invención de identificadores opacos en negación.**  
   Una orden negada de repetición sin contexto ya no fabrica `contextId:"current"`. Sin ID real no se sintetiza ningún identificador ni se ejecuta acción.

3. **Gaps opacos y multiacción.**  
   La ausencia de una ruta de navegación opaca se registra como `contract_gap`. Una acción independiente y válida del mismo turno puede continuar; si no existe ninguna acción ejecutable, el resultado es `insufficient` con cero acciones.

Se añadió además una regresión sintética para contexto educativo no personal con una declaración explícita de seguridad, evitando convertirlo en un gate protector.

## Safety

### Development · 400

- Safety exact: **400/400 = 100%**
- Safety errors: **0**
- ordinary command leaks bajo Safety: **0**
- ordinary action leaks bajo Safety: **0**

### Regression V2 consumida · 200

- Safety exact: **200/200 = 100%**
- Safety errors: **0**
- ordinary command leaks: **0**
- ordinary action leaks: **0**

No hay regresión de Safety respecto de R1.

## Insufficient

`insufficient` deriva de ausencia contractual de contexto, parámetro obligatorio, operación pendiente o estado compatible.

### Development

- expected insufficient: **3**
- full contractual: **3/3**
- ejecuciones ordinarias en insufficient: **0**

### Regression V2 consumida

- expected insufficient: **2**
- full contractual: **2/2**
- ejecuciones ordinarias en insufficient: **0**

## Intenciones

La suite propia cubre sistemáticamente las 18 intenciones:

1. ENCONTRAR_CONTENIDO
2. ABRIR_CONTENIDO
3. CAMBIAR_TAMANO_TEXTO
4. CAMBIAR_MOVIMIENTO
5. CAMBIAR_PASO_A_PASO
6. CAMBIAR_VISTA_SENCILLA
7. CAMBIAR_DETALLES
8. SIGUIENTE
9. ATRAS
10. REPETIR_INDICACION
11. RESTABLECER_PREFERENCIAS
12. CONFIRMAR_ACCION
13. CANCELAR
14. DESHACER_ULTIMA_ACCION
15. RECHAZAR_RESULTADO
16. OTRA_VIA
17. DETENER
18. PEDIR_AYUDA_HUMANA

No se inventan IDs, queries, flowIds, resultIds, confirmationIds, contentIds ni rutas.

## Multiacción

### Development

- casos multiacción: **25**
- command exact: **25/25**
- expected actions scorable: **40**
- gaps opacos: **5**
- omitted cuando command exact: **0**
- extra: **0**
- wrong parameters: **0**
- order errors: **0**

### Regression V2 consumida

- casos multiacción: **15**
- command exact contractual: **12**
- expected actions scorable cuando command exact: **18**
- gaps opacos: **3**
- omitted cuando command exact: **0**
- extra: **0**
- wrong parameters: **0**
- order errors: **0**

Los gaps medidos en estos datasets son `opaque_flow_id`. La suite sintética añade cobertura específica de `missing_navigation_route`.

## Negación y controles positivos

### Development

- negative false triggers: **0**
- positive-control failures: **0**

### Regression V2 consumida

- negative false triggers: **0**
- positive-control failures: **0**

## Literal provenance / anti-hardcode

Auditoría:

`docs/sabik-next/I0_V3_R2_LITERAL_PROVENANCE_AUDIT.json`

Conteos:

- CONTRACT_TERM: **208**
- GENERAL_PRODUCT_LEXICON: **23**
- GENERAL_LANGUAGE_RULE: **127**
- CASE_SHAPED_FORBIDDEN: **0**

Adicional:

- consecutive clusters: **0**
- phrase tables: **0**
- regex case matches: **0**
- natural literals checked: **336**
- exact/short/high-coverage hits: **0**
- anti-hardcode: **PASS**

## Suite propia

`I0_V3_R2_TEST_SUITE`

- total: **46**
- passed: **46**
- failed: **0**

Incluye:

- las 18 intents;
- Safety `confirmed / uncertain / cleared / handoff / normal`;
- peligro personal directo sin marcador de urgencia;
- contexto no personal con declaración explícita de seguridad;
- bloqueo de planificación ordinaria bajo protección;
- insufficient por query, parámetro, contexto y operación pendiente;
- no invención de ID en repetición negada;
- gaps opacos parciales;
- ruta opaca ausente con y sin acción independiente;
- multiacción y orden;
- ResultKind / S0 / B3.

## Métricas permitidas · DEVELOPMENT 400

- full exact: **209/400 = 52.25%**
- command exact: **264/400 = 66.00%**
- action exact: **296/400 = 74.00%**
- ResultKind: **279/400 = 69.75%**
- S0: **372/400 = 93.00%**
- B3: **344/400 = 86.00%**
- Safety: **400/400 = 100%**

Clasificación:

- TP **259** · FP **7** · FN **74** · TN **60**
- precision **0.97368**
- recall **0.77778**
- F1 **0.86477**

Ejecución:

- TP **134** · FP **3** · FN **79** · TN **184**
- precision **0.97810**
- recall **0.62911**
- F1 **0.76571**

## Métricas permitidas · REGRESSION V2 CONSUMIDA 200

- full exact: **83/200 = 41.50%**
- command exact: **126/200 = 63.00%**
- action exact: **159/200 = 79.50%**
- ResultKind: **119/200 = 59.50%**
- S0: **167/200 = 83.50%**
- B3: **168/200 = 84.00%**
- Safety: **200/200 = 100%**

Clasificación:

- TP **81** · FP **2** · FN **55** · TN **62**
- precision **0.97590**
- recall **0.59559**
- F1 **0.73973**

Ejecución:

- TP **43** · FP **4** · FN **26** · TN **127**
- precision **0.91489**
- recall **0.62319**
- F1 **0.74138**

## R1 → R2

### Development

| Métrica | R1 | R2 |
|---|---:|---:|
| Full exact | 59.50% | **52.25%** |
| Command exact | 66.00% | **66.00%** |
| Action exact | 80.50% | **74.00%** |
| ResultKind | 83.00% | **69.75%** |
| S0 | 93.75% | **93.00%** |
| B3 | 89.75% | **86.00%** |
| Safety | 100% | **100%** |
| Classification F1 | 0.91111 | **0.86477** |
| Execution FP | 6 | **3** |
| Execution FN | 33 | **79** |
| Execution F1 | 0.90226 | **0.76571** |

### Regression V2 consumida

| Métrica | R1 | R2 |
|---|---:|---:|
| Full exact | 49.50% | **41.50%** |
| Command exact | 66.00% | **63.00%** |
| Action exact | 81.50% | **79.50%** |
| ResultKind | 77.50% | **59.50%** |
| S0 | 85.00% | **83.50%** |
| B3 | 90.00% | **84.00%** |
| Safety | 100% | **100%** |
| Classification F1 | 0.84553 | **0.73973** |
| Execution FP | 8 | **4** |
| Execution FN | 11 | **26** |
| Execution F1 | 0.85926 | **0.74138** |

R2 es más conservador: reduce falsos positivos de ejecución y preserva los gates contractuales, a costa de recall y exactitud global. La caída se mantiene visible; no se retunea con V3 ni V4.

## Gates R2 finales

Development:

- Safety errors = **0**
- Safety ordinary command leaks = **0**
- Safety ordinary action leaks = **0**
- negative false triggers = **0**
- positive-control failures = **0**
- insufficient contractual errors = **0**
- insufficient ordinary executions = **0**
- multi omitted / extra / wrong / order = **0 / 0 / 0 / 0**
- CASE_SHAPED_FORBIDDEN = **0**

Regression V2 consumida:

- mismos gates contractuales = **0**
- CASE_SHAPED_FORBIDDEN = **0**

**PASS**

## Diff respecto de R1

La rama está **ahead** de la base y no está detrás.

Archivos R2 modificados respecto de la base:

1. `.github/workflows/sabik-i0-executor-v3-r2-generalization.yml`
2. `config/sabik/i0/executor-v3-r2-generalization.json`
3. `docs/sabik-next/I0_EXECUTOR_V3_R2_ARCHITECTURE.md`
4. `docs/sabik-next/I0_EXECUTOR_V3_R2_GENERALIZATION_READY.md`
5. `docs/sabik-next/I0_V3_R2_LITERAL_PROVENANCE_AUDIT.json`
6. `tools/audit-sabik-i0-v3-r2-literal-provenance.mjs`
7. `tools/run-sabik-i0-v3-r2-generalization.mjs`
8. `tools/sabik-i0-executor-v3-r2.mjs`
9. `tools/sabik-i0-v3-r2-evaluation-metrics.mjs`
10. `tools/test-sabik-i0-executor-v3-r2.mjs`
11. `tools/test-sabik-i0-v3-r2-antihardcode.mjs`

Datasets/schema modificados: **NO**.

## Aislamiento

Comprobado:

- no referencias runtime a `api.github.com` ni `github.com`;
- no referencias runtime a `tests/evaluation/`;
- no rutas runtime a Calibration V3;
- no rutas runtime a Calibration V4;
- datasets y schema sin cambios;
- PR #183 no abierto;
- #195 no abierto;
- Calibration V4 no abierta;
- rama V4 no abierta;
- #173 / validation no abierto.

Confirmación del Agente 2:

- acceso a corpus V3: **0**
- acceso a resultados detallados V3: **0**
- acceso a Calibration V4: **0**
- acceso a resultados de Agente 5 V4: **0**

## Cierre

`I0_EXECUTOR_V3_R2_GENERALIZATION_READY`

R2 cumple los gates exigidos antes de V4 sobre los datasets permitidos y mantiene `CASE_SHAPED_FORBIDDEN=0`.

No se declara production-ready ni calidad global suficiente. Las métricas globales inferiores a R1 quedan expuestas para decisión de Astra.

**NO MERGE.**  
**NO DEPLOY.**
