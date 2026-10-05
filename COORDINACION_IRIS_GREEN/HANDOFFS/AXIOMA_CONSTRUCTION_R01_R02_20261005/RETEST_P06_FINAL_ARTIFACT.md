# AXIOMA · CONSTRUCCIÓN R01 · R02 · RETEST P06 FINAL ARTIFACT

Fecha: 05/10/2026

Estado:
`AXIOMA_CONSTRUCTION_R01_R02_P06_REWORK_REQUIRED`

## Evidencia exacta

Rama:
`prisma/construction-r01-storyboard-r02-20261005`

Build commit:
`2696d6a694661815f46cb1edef20bc111818a144`

HEAD de registro Prisma:
`9e84d9005cb6ee9fc9cbe3d03f44c077a243b89c`

Run:
`37314984917 · SUCCESS`

Artifact:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06`

Artifact ID:
`11347511815`

Digest GitHub artifact:
`sha256:2927ad27b210c42755c04880cd7f926ffe50464b4b1ed20e4aacbf6baa0257fd`

ZIP interno:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06.zip`

SHA-256 verificado:
`93cd3d40d24a1d34a262d5cedb91de57f5546d72ac7748c1cb3589c2c3107905`

Integridad:
- `sha256sum -c` PASS;
- `unzip -t` PASS;
- 38 archivos internos;
- manifest: 37/37 archivos + hashes correctos;
- 30 PNG con ICC embebido.

## P06-A · geometría de badges Madera/Piedra

**PASS geométrico, FAIL visual final.**

La geometría nueva sí cumple:
- 320: overlap badge/badge = 0;
- 390: overlap badge/badge = 0;
- 1440: overlap badge/badge = 0.

Pero en 1440 los textos legacy del R02 base:
- `Madera`;
- `Piedra`;

siguen dibujados detrás de los badges nuevos y asoman parcialmente a la derecha.

Verificado visualmente en:
- `CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_1440.png`;
- `CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_1440.png`.

El resultado visible es equivalente a:
- badge nuevo “Madera” + resto legacy “a”;
- badge nuevo “Piedra” + resto legacy “edra”.

Por tanto:
`material_badges_overlap == 0`
es cierto, pero **no demuestra ausencia de copy legacy ni ausencia de duplicado visual**.

Además, el legacy conserva el par original:
- texto claro `(245,249,253)`;
- arena `(228,200,147)`;
- contraste ≈ **1.53:1**.

### Corrección exacta

Enmascarar/eliminar los textos legacy `Madera` y `Piedra` antes de dibujar los badges P06, igual que ya se hizo con `Parcela bloqueada/libre`.

Añadir assertion/evidencia:
- `legacy_material_labels_visible == false`;
- inspección visual 320/390/1440;
- no depender únicamente de `material_badges_overlap`.

## P06-B · Parcela bloqueada/libre

**PASS**

- 320: dentro de escena;
- 390: dentro de escena;
- 1440: dentro de escena;
- legacy parcel text enmascarado;
- no overlap con `+12 piedra`.

## P06-C · +12 piedra

**PASS**

- badge oscuro;
- contraste medido/recalculado: **12.12:1**;
- no overlap con parcela;
- visible en 320/390/1440.

## Estado de los ocho puntos

P01 PASS
P02 PASS
P03 PASS
P04 PASS
P05 PASS
P06 **REWORK SOLO POR LEGACY MATERIAL LABELS 1440**
P07 PASS
P08 PASS

No se reabre nada más.

## Secuencia

`PATCH P06-LEGACY-MATERIALS → AXIOMA RETEST VISUAL ACOTADO → HUMAN QA MARÍA`

El gate previo:
`AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA`
NO se aplica a este artifact final hasta cerrar este residuo.

`NO CODE · NO RUNTIME · NO MAIN`.
