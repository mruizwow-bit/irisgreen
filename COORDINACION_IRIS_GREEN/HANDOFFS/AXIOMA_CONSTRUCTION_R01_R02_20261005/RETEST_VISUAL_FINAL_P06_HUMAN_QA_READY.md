# AXIOMA · CONSTRUCCIÓN R01 · R02 · RETEST VISUAL FINAL P06-LEGACY-MATERIALS

Fecha: 05/10/2026

Gate:
`AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA`

## Evidencia exacta auditada

Rama producto:
`prisma/construction-r01-storyboard-r02-20261005`

Build commit:
`73cb445388895978caa598320cf9cf06ed426ba5`

Commit opción local del generador:
`a7299e088eac4d9af9faf6b15e3d568fa64749fa`

HEAD de registro Prisma:
`21c8c0f633beafc672b3caa3ad31b0cc84bcb86c`

Run:
`37318454037 · SUCCESS`

Artifact:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06`

Artifact ID:
`11348661943`

Digest contenedor:
`sha256:5a75aedda48f6d33850ada6cc6f2f83d8fe881edca6bfd8d164bd121f7fb6890`

ZIP interno:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06.zip`

SHA-256 verificado:
`f2d4503945e96941b51f953ed8e3fa6decbf6d5dfe6e53acfa71f6c484082853`

Integridad:
- ZIP test PASS;
- 38 archivos internos;
- manifest: 37/37 archivos/hashes correctos;
- 30 PNG con ICC embebido.

## Retest visual acotado

### P06-A · Madera/Piedra
**PASS FINAL**

Verificación automática:
- 320 overlap badges = 0;
- 390 overlap badges = 0;
- 1440 overlap badges = 0;
- `legacy_material_labels_visible = false`;
- residual máximo fuera de badges = **0 píxeles** en F01–F06 × 320/390/1440.

Verificación visual directa:
- `CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_1440.png` limpio;
- `CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_1440.png` limpio;
- `CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_390.png` limpio;
- `CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_320.png` limpio.

No asoman restos de los textos legacy `Madera` ni `Piedra`.

Marcador:
`P06_A_LEGACY_MATERIAL_LABELS_PASS`

### P06-B · Parcela bloqueada/libre
**PASS — se mantiene cerrado**

- dentro de escena en 320/390/1440;
- legacy de parcela ausente;
- no overlap con `+12 piedra`.

### P06-C · +12 piedra
**PASS — se mantiene cerrado**

- badge contrastante;
- contraste = **12.12:1**;
- sin clipping;
- sin overlap con parcela.

## Estado completo P01–P08

- P01 PASS
- P02 PASS
- P03 PASS
- P04 PASS
- P05 PASS
- P06 PASS
- P07 PASS
- P08 PASS

Resultado:
`8/8 PASS`

## Alcance del gate

Este gate aprueba el **storyboard R02 para HUMAN QA María**.

No autoriza:
- código;
- runtime;
- deploy;
- cambios en main.

No constituye certificación ni declaración de conformidad global del producto.

## Siguiente

`HUMAN QA MARÍA`

Permanece:
`NO CODE · NO RUNTIME · NO MAIN`
