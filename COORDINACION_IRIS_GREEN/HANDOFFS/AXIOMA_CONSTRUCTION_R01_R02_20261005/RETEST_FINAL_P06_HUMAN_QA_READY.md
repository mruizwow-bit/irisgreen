# AXIOMA · CONSTRUCCIÓN R01 · R02 · RETEST FINAL P06

Fecha: 05/10/2026

Gate:
`AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA`

## Evidencia auditada

Rama producto:
`prisma/construction-r01-storyboard-r02-20261005`

Commit P06:
`fef9f3296af3c16501c2f012586be756c21eff2a`

Run:
`37314415335 · SUCCESS`

Artifact:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06`

Artifact ID:
`11346961670`

Digest GitHub artifact:
`sha256:6cd28ca856aa89df17e6b960a101bd9257e623280c9bf44a9e712d59b670c8bf`

ZIP interno:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06.zip`

SHA-256 verificado del ZIP interno:
`75683f08b6393981925fa396f493f60a47093c8d42d5aafbba8d61a66519c868`

`sha256sum -c`:
**PASS**

Contenido:
- 37 entradas declaradas por manifest;
- 37/37 archivos y hashes verificados contra bytes reales;
- 30 PNG;
- 30/30 con ICC embebido;
- 30/30 RGB/RGBA válidos;
- viewports 320 / 390 / 1440 conservados;
- controles/foco/feedback anteriores conservados.

## P06-A · Madera / Piedra

**PASS**

Los badges se calculan por ancho real y gap explícito.

Assertions:

320:
- Madera: x 19.9…69.9
- Piedra: x 75.9…120.9
- overlap = 0

390:
- Madera: x 34.8…84.8
- Piedra: x 91.8…136.8
- overlap = 0

1440:
- Madera: x 240.8…307.8
- Piedra: x 332.8…392.8
- overlap = 0

Inspección visual de contact sheets 320/390:
- ambos labels completos;
- ninguno tapa al otro;
- no invaden controles.

Marcador:
`P06_A_MATERIAL_BADGES_PASS`

## P06-B · Parcela bloqueada / libre

**PASS**

320:
- bloqueada: x 210…312
- libre: x 237…312
- ambas dentro del viewport con margen.

390:
- bloqueada: x 280…382
- libre: x 301.8…376.8
- ambas dentro del viewport.

1440:
- ambas dentro de límites.

`parcel_badge_inside_bounds = true`

Inspección visual:
- texto completo;
- sin truncado;
- variantes bloqueada/libre legibles.

Marcador:
`P06_B_PARCEL_BADGE_PASS`

## P06-C · +12 piedra

**PASS**

El texto ya no se dibuja directamente sobre arena.

Ahora usa badge oscuro y texto claro.

Contraste registrado y recalculado según los colores del patch:
`12.12:1`

Criterio del retest:
`>= 4.5:1`

`plus12_piedra_contrast = 12.12`

Inspección visual F05/F06 320/390/1440:
- badge visible;
- texto legible;
- no introduce clipping.

Marcador:
`P06_C_PLUS12_CONTRAST_PASS`

## Regresión acotada

No se reabre P01–P05/P07–P08.

Se comprobó que el cambio P06 conserva:
- controles touch;
- modo Recorrer/Construir;
- selected;
- focus;
- feedback válido/inválido;
- microsecuencia retirar/dependencias/deshacer;
- matriz NORMAL/REDUCED/NONE + forced-colors.

No se detecta regresión concreta.

## Estado P01–P08

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

Este PASS significa:
**storyboard R02 preparado para HUMAN QA María**.

NO significa:
- código autorizado;
- runtime implementado;
- conformidad global del sitio;
- deploy;
- modificación de main.

Permanece:
`NO CODE · NO RUNTIME · NO MAIN`

Siguiente:
`HUMAN QA MARÍA`.
