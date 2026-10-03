# PRISMA · CIELO V2 · VISUAL REWORK R01

Fecha: 03/10/2026

## Estado

PASS técnico demostrado:
`INTEREST_01_CIELO_V2_VISUAL_REWORK_TECHNICAL_PASS`

Gate objetivo posterior:
`INTEREST_01_CIELO_V2_VISUAL_REWORK_READY_FOR_HUMAN_QA`

Ese gate **NO se declara todavía**.

## Rama

`prisma/cielo-v2-visual-rework-r01-20261003`

## Qué se ha cambiado

Solo presentación/frontend:
- escena pasa a ocupar el primer viewport;
- se elimina lectura de dashboard;
- no sidebar persistente dominante;
- `En esta vista` pasa a disclosure nativo compacto;
- lugar/fecha/motion/theme pasan a disclosure compacto;
- ficha técnica aparece solo tras interacción;
- hit area de estrellas mantiene 44×44 px;
- punto visible de estrella sigue pequeño/natural;
- labels de constelación sin chrome de pill;
- LIGHT / NAVY;
- 320 / 390 / 1440;
- forced-colors;
- progressive disclosure;
- resolución por proximidad cuando dos hit areas se solapan.

No se han tocado:
- algoritmos astronómicos;
- dataset;
- selección factual;
- state model;
- geolocalización;
- contrato lazy-depth;
- intereses 02–07.

## Evidencia CI

Run con PASS funcional/visual de frontend:
`37099525044`

Job:
`111136161607`

HEAD probado:
`9518ce5a9ce428a9c45b062e0190ed3b921d7f0c`

Resultado:
- donor subset reproducible: PASS;
- syntax: PASS;
- build canónico: PASS;
- QA first viewport: PASS;
- 18/18 browser cases;
- ES/EN;
- 320 / 390 / 1440;
- NORMAL / REDUCED / NONE;
- LIGHT / NAVY;
- forced-colors;
- 18 targets;
- <=5 labels;
- 0 external requests;
- 0 HTTP errors;
- 0 JS errors;
- 0 depth eager requests;
- scene-first: PASS;
- compact disclosures: PASS;
- progressive info: PASS.

Artifact:
`cielo-v2-first-viewport`
ID:
`11265044254`

Artifact digest:
`sha256:c38d945cbd442220574e284981bf1022e572529eac3b1b1ae9a5ef14c4ddf5be`

## Bloqueante HUMAN QA

El horizonte B00 ya tiene gate:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

Master canónico:
`01-cielo-horizonte-observacion-r01.png`

SHA-256:
`f35cb943ca72b254a092c721e8007ddbe4d414ed80d154f287b5eedce57493d0`

Pero el binario aprobado todavía no tiene un **path web canónico empaquetado en el repositorio**.

Prisma ha dejado un slot CSS preparado:
`--skyv2-horizon-image`

Mientras no exista ese path:
- no se inventa URL;
- no se copia otro donor;
- no se declara horizonte conectado;
- no se declara READY_FOR_HUMAN_QA.

## Último commit de precisión de estado

`34c7d5d75181e1fc0792a7815d5c9805f8f9f9ad`

Ese commit cambia el marcador del test para distinguir:
- PASS técnico;
- target HUMAN QA aún bloqueado por integración binaria B00.

CI de ese marcador:
`37101529327` · lanzado; no esperar en chat.

## Siguiente micro-bloque

Cuando exista path binario canónico para B00:
1. enlazar solo el horizonte;
2. comprobar 390/1440 safe-crop;
3. repetir CI;
4. descargar capturas;
5. si PASS, declarar `INTEREST_01_CIELO_V2_VISUAL_REWORK_READY_FOR_HUMAN_QA`;
6. STOP para María/Astra.

No main antes de HUMAN QA.
