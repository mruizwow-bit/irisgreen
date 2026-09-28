# R54 · rebenchmark SEP 2026 · 6 tarjetas PASS Astra · 28/09/2026

Issue: #318.

Estado:
`R54_ASTRA_6_PILOTS_REBENCHMARK_SEP2026_PASS_HUMAN_QA_PENDING`

## Artefactos
- R54_NORMA.patch · sha256 c54ecf3e945598416f1d9061a5f7c8f49b1a7b918609bf2dc49712ee6c7716db
- R54_NORMA.patch.gz · sha256 e2999d63a995d330fbc6ad9f3dab86915a93384507ac7ea76e1c83a706e9000f
- las_seis_movil · sha256 fc9c097b1046e260d968a6e16ec1d8e1da09387312c2e126b532d9f75d19b12b
- antes_despues · sha256 732664331dca10ccc0daa7f9f62109e3cd5e9307ff6e39aeb49f3bf2ebe28c62

Patch HEAD reportada: 5e302f193fda2a99e0a54ab09589ff488fa7be2b.
Base declarada: 2541351a (R54_CONFIG).

## Visual

PASS 6/6 como arte de tarjeta/launcher a 240×150 CSS px:
- Dibujo PASS;
- Estructuras PASS;
- Programación PASS, pared ambiental como refinamiento no bloqueante;
- Videojuegos PASS tras reducción de densidad;
- Mundos PASS;
- Modelado 3D PASS.

Por primera vez las seis comparten nivel de calidad sin compartir plantilla.

Regla:
`THE_CARD_SHOWS_THE_WORKBENCH_NOT_THE_FINISHED_PRODUCT`

## Técnica

Dirección PASS:
- AVIF 1x/2x + WebP 1x/2x;
- picture con AVIF primero y WebP fallback;
- misma captura por escala;
- build-strict para cuatro outputs;
- contrato sync/config ampliado a cuatro imágenes.

El blocker render-config queda cerrado en esta cadena:
- render_config_sha256 por escena;
- setting stale FAIL;
- render parcial tras cambio global deja los no rerasterizados en FAIL.

Chromium version queda informativa, no dentro de fingerprint.

## Alcance

Este PASS solo fija estándar de tarjeta del launcher.

NO aprueba automáticamente:
- 27 interiores;
- starters;
- cromo del launcher;
- hojas imprimibles.

Pendiente HUMAN QA María.

Si aprueba:
`R54_TALLER_CARD_STANDARD_SEP2026_HUMAN_APPROVED_SCALE_21_PLUS_9_AUTHORIZED`

Luego:
21 tarjetas + 9 infancia → review 27/27 → interiores/starters E4 → otras superficies → A2.

No main/producción.
