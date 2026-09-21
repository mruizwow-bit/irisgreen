# I0_EXECUTOR_V3_R2_GENERALIZATION_READY

**Fecha:** 21/09/2026  
**PR:** #202  
**Estado:** OPEN · DRAFT · NO MERGE

## Identidad

- rama: `sabik/i0-executor-v3-r2-generalization-20260921`
- base exacta R1: `b3daefe4f0cd471c8cc92b35472b51f1840569fa`
- HEAD funcional R2 auditado: `9e63e51226ae22dfe6c176f865518b5d39ea500f`
- run final: `35591505782` · SUCCESS
- artifact: `10634088845 · sabik-i0-executor-v3-r2-generalization`
- artifact ZIP SHA-256: `281c5159a0d1a8565a1805033057d3a31de0c1d704ac01d85dc4f9c928ddae1c`

La rama ya había avanzado dos commits respecto de la base cuando se recibió la orden. Se registró el HEAD remoto antes de continuar y no se hizo force-push.

## Fuentes permitidas

Se utilizaron únicamente:
- contratos/schema/documentación normativa;
- development V0.4;
- calibration V2 consumida como regression;
- agregados de Calibration V3 publicados por Astra en la orden;
- tests sintéticos propios.

No se leyó:
- corpus Calibration V3;
- PR #183;
- resultados detallados V3;
- predicciones/IDs/utterances V3;
- #195;
- Calibration V4;
- rama V4;
- resultados futuros del Agente 5;
- #173 / validation.

## Arquitectura R2

R2 separa expresamente:

`detección Safety → gate protector → planificación`

Si Safety es distinto de `normal`:
- no se generan commands ordinarios;
- no se generan acciones ordinarias;
- solo se proyecta el resultado contractual permitido.

Arquitectura declarada por manifest:
- `no_similarity_fallback=true`
- `no_probability_claims=true`
- `no_id_invention=true`
- `no_query_invention=true`
- multiacción = `compositional_clause_slot_parameter_order`
- ResultKind/S0/B3 = derivación del plan contractual resuelto.

## Safety

Gates obligatorios sobre datasets permitidos:

### Development 400
- Safety errors: **0**
- ordinary command leaks bajo Safety: **0**
- ordinary action leaks bajo Safety: **0**

### Regression V2 consumida 200
- Safety errors: **0**
- ordinary command leaks: **0**
- ordinary action leaks: **0**

No hay regresión de Safety respecto de R1.

## Insufficient

R2 deriva `insufficient` de estado/contexto contractual:
- query obligatorio ausente;
- parámetro obligatorio ausente;
- operación pendiente inexistente;
- flujo/contexto necesario ausente;
- undo sin estado previo;
- human-help incompatible/offline.

Gates:

Development:
- insufficient contractual errors: **0**
- ordinary executions en insufficient: **0**

Regression consumida:
- insufficient contractual errors: **0**
- ordinary executions en insufficient: **0**

## Intenciones

Suite propia cubre sistemáticamente las 18 intents:
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

No se inventan IDs, queries, flowIds, resultIds ni confirmationIds.

## Multiacción

R2 usa parsing composicional por:
- cláusula;
- orden;
- slots;
- parámetros;
- combinación.

La métrica contractual separa acciones realmente scorable de identidades opacas no derivables.

### Development
- casos multiacción: 25
- command exact: **25/25**
- expected actions scorable: **40**
- gaps opacos: **5**
- omitted cuando command exact: **0**
- extra: **0**
- wrong parameters scorable: **0**
- order errors: **0**
- structural gate: **PASS**

### Regression consumida
- command exact contractual: **12**
- gaps opacos documentados: **3**
- omitted scorable: **0**
- extra: **0**
- wrong parameters scorable: **0**
- order errors: **0**
- structural gate: **PASS**

Los gaps opacos son `flowId` no derivables del contexto y se mantienen como gaps contractuales. No se memorizan.

## Negación y controles positivos

Gates contractuales:

Development:
- negative false triggers: **0**
- positive-control failures: **0**

Regression consumida:
- negative false triggers: **0**
- positive-control failures: **0**

Nota de métrica: la métrica base de exactitud de acción marca 3/4 controles positivos en development porque uno requiere un `flowId` opaco. El gate contractual R2 evalúa command/evento y acciones scorable; no exige inventar el ID opaco. No existe inversión semántica en ese control.

## Literal provenance / anti-hardcode

Auditoría:

`docs/sabik-next/I0_V3_R2_LITERAL_PROVENANCE_AUDIT.json`

Conteos:
- CONTRACT_TERM: **208**
- GENERAL_PRODUCT_LEXICON: **23**
- GENERAL_LANGUAGE_RULE: **127**
- CASE_SHAPED_FORBIDDEN: **0**

Adicional:
- clusters: **0**
- phrase tables: **0**
- regex case matches: **0**

Anti-hardcode:
- status: **PASS**
- development inspeccionado: 400
- regression consumida: 200
- natural literals: 336
- exact/short/high-coverage hits: **0**
- regex case hits: **0**

## Suite propia

`I0_V3_R2_TEST_SUITE`

- total: **39**
- passed: **39**
- failed: **0**

Incluye las 18 intents y pruebas de:
- Safety confirmed/uncertain/cleared/handoff/normal;
- bloqueo protector;
- insufficient por query/parámetro/contexto/op. pendiente;
- partialidad por gaps opacos;
- composición multiacción;
- proyección ResultKind/S0/B3.

## Métricas DEVELOPMENT 400

- full exact: **209/400 = 52.25%**
- command exact: **264/400 = 66.00%**
- action exact: **296/400 = 74.00%**
- ResultKind: **278/400 = 69.50%**
- S0: **373/400 = 93.25%**
- B3: **344/400 = 86.00%**
- Safety: **400/400 = 100%**

Clasificación:
- TP 259 · FP 7 · FN 74 · TN 60
- precision **0.97368**
- recall **0.77778**
- F1 **0.86477**

Ejecución:
- TP 134 · FP 3 · FN 79 · TN 184
- precision **0.97810**
- recall **0.62911**
- F1 **0.76571**

Insufficient:
- **3/3 full contractual**
- ejecuciones indebidas: **0**

## Métricas REGRESSION V2 CONSUMIDA 200

- full exact: **83/200 = 41.50%**
- command exact: **127/200 = 63.50%**
- action exact: **159/200 = 79.50%**
- ResultKind: **118/200 = 59.00%**
- S0: **167/200 = 83.50%**
- B3: **168/200 = 84.00%**
- Safety: **200/200 = 100%**

Clasificación:
- TP 82 · FP 2 · FN 54 · TN 62
- precision **0.97619**
- recall **0.60294**
- F1 **0.74545**

Ejecución:
- TP 43 · FP 4 · FN 26 · TN 127
- precision **0.91489**
- recall **0.62319**
- F1 **0.74138**

Insufficient:
- **2/2 full contractual**
- ejecuciones indebidas: **0**

## R1 → R2

### Development
| Métrica | R1 | R2 |
|---|---:|---:|
| Full exact | 59.50% | **52.25%** |
| Command exact | 66.00% | **66.00%** |
| Action exact | 80.50% | **74.00%** |
| ResultKind | 83.00% | **69.50%** |
| S0 | 93.75% | **93.25%** |
| B3 | 89.75% | **86.00%** |
| Safety | 100% | **100%** |
| Classification F1 | 0.91111 | **0.86477** |
| Execution FP | 6 | **3** |
| Execution FN | 33 | **79** |
| Execution F1 | 0.90226 | **0.76571** |

### Regression consumida
| Métrica | R1 | R2 |
|---|---:|---:|
| Full exact | 49.50% | **41.50%** |
| Command exact | 66.00% | **63.50%** |
| Action exact | 81.50% | **79.50%** |
| ResultKind | 77.50% | **59.00%** |
| S0 | 85.00% | **83.50%** |
| B3 | 90.00% | **84.00%** |
| Safety | 100% | **100%** |
| Classification F1 | 0.84553 | **0.74545** |
| Execution FP | 8 | **4** |
| Execution FN | 11 | **26** |
| Execution F1 | 0.85926 | **0.74138** |

R2 es deliberadamente más conservador: reduce FP pero aumenta FN y baja métricas globales. La caída se conserva como evidencia; no se retunea usando Calibration V3/V4.

## Gates R2

Development:
- Safety errors = **0**
- Safety ordinary command leaks = **0**
- Safety ordinary action leaks = **0**
- negative false triggers = **0**
- positive-control failures = **0**
- insufficient contractual errors = **0**
- insufficient ordinary executions = **0**
- multi omitted/extra/wrong/order = **0/0/0/0**
- CASE_SHAPED_FORBIDDEN = **0**

Regression consumida:
- mismos gates = **0**
- CASE_SHAPED_FORBIDDEN = **0**

**PASS**

## Aislamiento

Manifest:
- `reserved_calibration_v3_opened=false`
- `reserved_calibration_v3_executed=false`
- `reserved_calibration_v4_opened=false`
- `reserved_calibration_v4_executed=false`
- `validation_opened=false`
- `validation_executed=false`
- `datasets_modified=false`
- `schema_modified=false`

CI:
- checkout current R2 commit only;
- remote eliminado;
- cero refs remotos;
- tokens vacíos;
- guard contra rutas V3/V4/validation;
- permissions read-only.

Confirmación:
- PR #183 no se abrió;
- #195 no se abrió;
- Calibration V4 no se abrió;
- rama V4 no se abrió;
- #173 no se abrió;
- ningún resultado futuro del Agente 5 fue consultado.

## Inputs

- development SHA-256: `c388607d55c5c8daef721217e49f01c0dd7e17d81c27af2f6e76f3c44cca97fb`
- regression consumida SHA-256: `ffc63e76eadbac6e975f9792e906913585bcbf53806d7616dc385481145b373f`
- schema SHA-256: `3bbfcd7dfd8473b1a6366a664ddd98d7c94c08dafa6553d7879aa7b693a3edc8`

Datasets/schema modificados: **NO**.

## Artefactos

- `critical-gates.v3-r2.json`: `b5c887d1a76dd7e0971dc7c4e02289397901b555218f849fd786199e1b0e7d00`
- `errors.development.v3-r2.json`: `ae50ac78763b576501b06fbafc8744dc699cb05db6ed5799cf40a89e9e8653c2`
- `errors.regression-v2-consumed.v3-r2.json`: `fe7e35da15a91feb198ea4d86678a4f30ca0c60cbfe4706c9a3b9d798d40d97d`
- `manifest.v3-r2.json`: `68951b35186aae776e5b1651846a57a8d383d3ee38db6c3a3ed27d5aa8d325cd`
- `metrics.development.v3-r2.json`: `3f38a038a7cbfd85f6b0427ccad32cf210e6bf238fa9c133af1faa819446efc9`
- `metrics.regression-v2-consumed.v3-r2.json`: `955a16a280b472c52537f5ad48a8ec02588799538755faec83be52c8d2388e8c`
- `opaque-contract-gaps.v3-r2.json`: `bc8ed027d837f83bbf0b57ad3c33e3686b13cb2d412d2992ae996f548ec99d9f`
- `predictions.development.v3-r2.jsonl`: `301689cfa7765e54d43830a1c3d2e1e40c7868c3d72ddc91a82d41a1a93ebdd3`
- `predictions.regression-v2-consumed.v3-r2.jsonl`: `96a4c8951fc60a79c798baf5032bf73babef93ac70814b6b94c6e712834f36a7`

Artifact:
- ID `10634088845`
- SHA-256 ZIP `281c5159a0d1a8565a1805033057d3a31de0c1d704ac01d85dc4f9c928ddae1c`

## Cierre

R2 cumple los gates exigidos antes de V4 sobre datasets permitidos.

No se declara calidad global suficiente ni production-ready; las caídas de recall/full exact quedan visibles para revisión Astra.

**NO MERGE.**  
**NO DEPLOY.**
