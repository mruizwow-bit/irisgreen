# R62 · P01 premium render · Astra review · 28/09/2026

Issue: #326.

Estado:
`R62_P01_RENDER_PIPELINE_PASS_VISUAL_E4_REWORK_REQUIRED`

## Artefactos

- p01-render-1440.png
- p01-render-390.png
- r62-p01-render-premium.patch · sha256 86f101db423a28b1606c98c7ba2f6cb49e746e3a3e11fa6b93c57ab93b60e179
- RENDER-NORMA-SEP-2026.md · sha256 3514d3de1e958eb9415b9206ce6e577af3f87fac7109727c687c0508c20692a7
- iris-claude.bundle · sha256 f50359f495b1d20e5b5c1e20040790961f505bc71ee9d684db328cae9fa599e6

Bundle list-heads coincide con lo reportado, incluido:
`claude/r62-p01-render-premium-20260928` → `1fceac619cad30e29ec216e65070ee5f643f93ce`.

## PASS

El cambio de técnica es correcto:
- raster first-party;
- buffers de material/profundidad/normal;
- texturas procedurales;
- luz y sombras;
- AO;
- materialidad;
- vector encima para UI/texto.

El renderizador deja de ser el techo.

## NO E4 todavía

La escena sigue demasiado basada en prismas y planos grandes.

Falta:
- riqueza geométrica;
- arquitectura secundaria;
- rotura de silueta;
- detalle de vanos;
- materiales más diferenciados;
- suelo/latón más convincente;
- microdetalle con propósito.

## Móvil

La captura 390 demuestra que el arte aguanta, pero NO que el layout final pase.

El desktop está reducido en miniatura:
- controles;
- selector;
- etiquetas;
- ayuda inferior

quedan demasiado pequeños.

Móvil final debe remaquetarse.

## Benchmark externo

La normativa global se actualizó en commit:
`0e9880bf1b898363d491f3711cc244717e76f945`

Nuevo target:
`IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`

Benchmark:
- National Gallery Imaginarium;
- Igloo Inc;
- FOLLOW.ART;
- Dunes & Stars;
- Webby Best Practices 2026.

No se copia estilo: se calibra acabado, integración arte/interacción, función y móvil.

## Siguiente

P01 primero.
No llevar aún el renderizador a P02.
No P03.

Esperado:
`R62_P01_VISUAL_E4_READY_FOR_ASTRA_MARIA`

Codex #321 HOLD.
No A2/main/producción.
