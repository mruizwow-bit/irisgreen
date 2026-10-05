# PRISMA · CONSTRUCCIÓN R02 · PATCH P06-LEGACY-MATERIALS

Fecha: 2026-10-05  
Issue: #369  
Orden: comentario `5995462455`  
Estado: `PRISMA_CONSTRUCTION_R01_R02_P06_LEGACY_MATERIALS_READY_FOR_AXIOMA_RETEST`

## Alcance

Únicamente el residuo de **Madera/Piedra** detectado por Axioma.

P06-B, P06-C y P01–P05/P07–P08 permanecen cerrados. No se reabren concepto, soluciones A/B, costes, apoyo/alcance, controles, foco, motion ni player proxy.

## Corrección

El generador base conserva su comportamiento por defecto, pero incorpora una opción local:
`hide_legacy_material_labels=False`.

El patch P06 la activa únicamente para su render:
`hide_legacy_material_labels=True`.

Así las labels antiguas **Madera** y **Piedra** no se dibujan desde origen antes de los badges nuevos. No se amplían los badges para ocultarlas.

## Evidencia pixel-a-pixel

`P06_ASSERTIONS.json` compara:
- base con labels legacy;
- base limpia sin labels;
- PNG final del patch.

Resultado:
- `legacy_material_labels_visible = false`;
- residual máximo fuera de los badges nuevos = **0 píxeles**;
- F01–F06 comprobados;
- 320 / 390 / 1440 comprobados.

Se conservan además:
- `material_badges_overlap = 0`;
- `parcel_badge_inside_bounds = true`;
- `+12 piedra = 12.12:1`.

## Inspección visual final

Revisados explícitamente:
- `CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_1440.png`;
- `CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_1440.png`;
- `CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_390.png`;
- `CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_320.png`.

No se observan restos de los textos legacy Madera/Piedra ni regresiones en los badges ya aprobados.

## Artifact final

Build commit: `73cb445388895978caa598320cf9cf06ed426ba5`  
Opción base local: `a7299e088eac4d9af9faf6b15e3d568fa64749fa`

Run: `37318454037 · SUCCESS`  
Artifact ID: `11348661943`  
Artifact: `PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06`

ZIP interno:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06.zip`

SHA-256 ZIP:
`f2d4503945e96941b51f953ed8e3fa6decbf6d5dfe6e53acfa71f6c484082853`

Digest contenedor GitHub:
`sha256:5a75aedda48f6d33850ada6cc6f2f83d8fe881edca6bfd8d164bd121f7fb6890`

## Siguiente

`AXIOMA RETEST VISUAL ACOTADO → HUMAN QA MARÍA`

El gate `AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA` todavía no se declara.

`NO CODE · NO RUNTIME · NO MAIN`
