# I0_EXECUTOR_V3_R1_DECONTAMINATED_READY

**Fecha:** 21/09/2026  
**PR:** #184  
**Estado:** OPEN · DRAFT · NO MERGE

## Identidad

- HEAD protegido de referencia: `aa04938d46b720cff66bd22077012c22c0048739`
- HEAD funcional R1 auditado: `b7ce012edfddd914c52043f9c6f3ee422883bc1a`
- base de PR #184: `8ce798447d79eff22caaec15d03105073069e7d8`
- run final: `35561413926` · SUCCESS
- artifact: `10622770032 · sabik-i0-executor-v3-r1-development`
- artifact ZIP SHA-256: `b6406447786154c42e28c0e9fbfa5fe44e19f6cdf79a9da437c99a9ab1292291`

El HEAD remoto había avanzado respecto de `aa04938d...`; se registró y se continuó sin force-push ni sobrescritura.

## Decontaminación

Se eliminó la tabla de frases de `noCommandResult()`.

La aclaración se resuelve ahora por estado faltante:
- deíctico sin referente;
- acción/cambio genérico sin dimensión;
- parámetro genérico sin dimensión;
- confirmación sin `pendingConfirmation`;
- rechazo sin resultado previo;
- navegación sin flujo o ruta previa;
- alternativa sin `lastQuery`.

Confirmación y rechazo ya no fabrican IDs por defecto.

Se eliminaron además literales heredados con forma de utterance y listas de redacciones; no se desplazaron a otro archivo.

## any()

La función `any()` tenía el escape de regex corrupto.

R1:
- escapa metacaracteres;
- usa fronteras Unicode de letras/números;
- tiene prueba explícita para `.`, `+`, `?` y `[ ]`.

## Auditoría de procedencia literal

Archivo:

`docs/sabik-next/I0_V3_LITERAL_PROVENANCE_AUDIT.json`

Resultado:

- CONTRACT_TERM: **186**
- GENERAL_PRODUCT_LEXICON: **23**
- GENERAL_LANGUAGE_RULE: **134**
- CASE_SHAPED_FORBIDDEN: **0**

Controles adicionales:
- clusters consecutivos: **0**
- phrase tables: **0**
- regex near-verbatim: **0**

## Anti-hardcode V2

Resultado: **PASS**

- development inspeccionado: 400
- regression consumida inspeccionada: 200
- natural literals comprobados: 319
- exact/short/high-coverage fragment hits: **0**
- regex case hits: **0**
- IDs de corpus / tablas por ID: **0**

Detecta:
- frases completas de cualquier longitud;
- frases cortas con alta cobertura;
- fragmentos largos;
- equivalencia normalizada sin mayúsculas/puntuación/diacríticos;
- clusters de casos consecutivos;
- arrays que se comportan como phrase tables;
- regexes near-verbatim;
- marcadores de tablas/excepciones por caso/redacción.

## Tests estructurales

Suite final: **52/52 PASS**

Incluye paraphrases nuevos para:
- ambigüedad;
- deíctico sin referente;
- acción genérica sin parámetro;
- cambio genérico sin dimensión;
- confirmación sin operación pendiente;
- rechazo sin resultado;
- cancelación;
- navegación sin flujo;
- navegación de página sin ruta previa;
- alternativa sin búsqueda previa.

Incluye contraejemplos con contexto suficiente para evitar sobreaclaración.

## Aislamiento CI

El workflow V3-R1:
- usa checkout shallow de un único commit;
- `fetch-depth: 1`;
- `fetch-tags: false`;
- `persist-credentials: false`;
- elimina `origin` antes de ejecutar;
- exige cero refs remotos/pull;
- deja `GH_TOKEN` y `GITHUB_TOKEN` vacíos;
- verifica ausencia de rutas reservadas;
- tiene permisos `contents: read`;
- no hace commits automáticos.

El isolation guard final: **PASS**.

No se abrió ni ejecutó Calibration V3.
No se abrió #183.
No se abrió #173.
No se usó el corpus del Agente 5.
No se leyó ningún resultado futuro del Agente 5.

## Inputs congelados

- development: 400 · SHA-256 `c388607d55c5c8daef721217e49f01c0dd7e17d81c27af2f6e76f3c44cca97fb`
- regression V2 consumida: 200 · SHA-256 `ffc63e76eadbac6e975f9792e906913585bcbf53806d7616dc385481145b373f`
- schema: SHA-256 `3bbfcd7dfd8473b1a6366a664ddd98d7c94c08dafa6553d7879aa7b693a3edc8`

Datasets/schema modificados: **NO**.

## Métricas DEVELOPMENT · antes V3 → después V3-R1

| Métrica | V3 | V3-R1 |
|---|---:|---:|
| Full exact | 258/400 · 64.50% | **238/400 · 59.50%** |
| Command exact | 283/400 · 70.75% | **264/400 · 66.00%** |
| Action exact | 331/400 · 82.75% | **322/400 · 80.50%** |
| ResultKind | 346/400 · 86.50% | **332/400 · 83.00%** |
| S0 | 390/400 · 97.50% | **375/400 · 93.75%** |
| B3 | 361/400 · 90.25% | **359/400 · 89.75%** |
| Safety | 400/400 | **400/400** |
| Classification F1 | 0.93125 | **0.91111** |
| Execution FP | 6 | **6** |
| Execution FN | 26 | **33** |
| Execution F1 | 0.92118 | **0.90226** |
| Action exact | command exact | 272/283 · 96.11% | **253/264 · 95.83%** |

La caída se acepta como coste explícito de eliminar sobreajuste.

Gates críticos:
- Safety errors: **0**
- negativos false triggers: **0**
- controles positivos failures: **0**
- insufficient contract errors: **0**
- multi omitidas/extra/orden con command exact: **0/0/0**
- multi wrong parameters con command exact: **0**

Multiacción:
- command exact: 22/25
- action exact: 22/25
- full exact: 17/25
- cuando command es exacto: **22/22 action exact = 100%**

## Métricas REGRESSION V2 CONSUMIDA · antes V3 → después V3-R1

| Métrica | V3 | V3-R1 |
|---|---:|---:|
| Full exact | 86/200 · 43.00% | **99/200 · 49.50%** |
| Command exact | 128/200 · 64.00% | **132/200 · 66.00%** |
| Action exact | 160/200 · 80.00% | **163/200 · 81.50%** |
| ResultKind | 145/200 · 72.50% | **155/200 · 77.50%** |
| S0 | 163/200 · 81.50% | **170/200 · 85.00%** |
| B3 | 180/200 · 90.00% | **180/200 · 90.00%** |
| Safety | 200/200 | **200/200** |
| Classification F1 | 0.82591 | **0.84553** |
| Execution FP | 10 | **8** |
| Execution FN | 10 | **11** |
| Execution F1 | 0.85507 | **0.85926** |
| Action exact | command exact | 116/128 · 90.63% | **120/132 · 90.91%** |

Gates críticos:
- Safety errors: **0**
- negative false triggers: **0**
- positive control failures: **0**
- insufficient contract errors: **0**
- multi omitidas/extra/orden con command exact: **0/0/0**
- multi wrong parameters con command exact: **3**

Los tres wrong-parameter son el gap contractual ya documentado de `flowId` opaco. No se memorizaron.

## Artifact SHA-256

- `comparison-v3-v3-r1.json`: `790a605dd8e36beaf77f9511242097559bcf48aee673c1c92d6cc6272626964d`
- `critical-gates.v3-r1.json`: `adb179766705407937cbad13511fdbe4e27060f58f3f904820199aed9535d12e`
- `errors.development.v3-r1.json`: `f4419e86915c10d9d7e8b00db1d27406c313c72ae265e22409511ee155aef5c0`
- `errors.regression-v2-consumed.v3-r1.json`: `bdf0e4334c82279cd7a32e9c35cdab74a3e6ecba03e24589ef5a3e6671a3b611`
- `manifest.v3-r1.json`: `109e2f2a4c497ac8bc8f47ca1b2653648fca66466fece73a9ee82ed26d861fc8`
- `metrics.development.v3-r1.json`: `038819e984c3922191e04f5d1085c213f5a896fb90d6394cfffc4b3ff61a268f`
- `metrics.regression-v2-consumed.v3-r1.json`: `7f0a2c1b714680020c2447a70118a59ebdb224fec4357edfb7d9aeeb9b73411c`
- `predictions.development.v3-r1.jsonl`: `8277940b530036ec4e99f053734a3ece4db4dc786b4a1b9aa3844cd03a898392`
- `predictions.regression-v2-consumed.v3-r1.jsonl`: `37398b3e6aef30f3b76e23f582644a387b59828a7a2eae69b2fe4922e45d71f6`
- `I0_V3_LITERAL_PROVENANCE_AUDIT.json`: `957399a0272cf64b7479018ca71c55638d14cbbf0e6cd0edcddbc94dc81d0337`

## Cierre

- Calibration V3: **NO ejecutada**
- #183: **NO abierto**
- #173: **NO abierto**
- grid V3: **NO congelado**
- merge: **NO**

V3-R1 queda decontaminado y listo para revisión Astra.
