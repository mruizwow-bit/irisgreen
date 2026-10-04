# AXIOMA · A11Y QA · CIELO R03 · 88 CONSTELACIONES RUNTIME · 04/10/2026

Estado:
`AXIOMA_CONSTELLATIONS_88_A11Y_REWORK_REQUIRED`

Rama:
`motor/space-pack-01-constellations88-20261003`

HEAD:
`9fb188073bd9cefb21cb7ffe582a3bd4cbdd37f4`

CI:
`37112519398` · SUCCESS

Artifact:
`cielo-r03-88-constellations` · ID `11270054546`
Digest:
`sha256:c0c2e582347e7946bd6665c8e2aa93a8d8c1821199db7caa5cd1627b1d2335e9`

Upstream visual:
`NIGHT_SKY_CONSTELLATION_PIPELINE_R03_FINAL_PASS` · KEEP LOCKED.

## Herencia Axioma

La rama está 4 commits por delante de:
`83da84e999f018dd93ccfb09a09f3ab2097a1551`

Por tanto conserva:
- NONE sin drag continuo;
- LOCATE textual con altitud/azimut/dirección;
- teclado/zoom;
- forced-colors;
- B00.

No se reabre R03 visual.

## Integración 88 · PASS

- carga lazy;
- 0 eager requests a depth/index;
- 88 constelaciones;
- 5.070 estrellas locales;
- selector nativo de 88 opciones;
- botón Localizar >=44px;
- focus-visible explícito;
- `EXPLORE → LOCATE → REVEAL`;
- selección revela metadata + altitud/azimut/dirección;
- aria-live/status heredados;
- review SVG/PNG no usados como cards/runtime;
- ES/EN;
- forced-colors;
- 0 external / HTTP / JS errors;
- 0 horizontal overflow en 390/1440 según suite.

## Finding 1 · labels invaden la zona de lectura

REWORK_REQUIRED.

Evidencia manual exacta:
- `cielo-r03-88-390.png`;
- `cielo-r03-88-1440.png`.

En 390:
- un label de constelación aparece sobre la cabecera/pregunta de introducción.

En 1440:
- `Auriga` invade visualmente la pregunta introductoria.

La densidad 88 reutiliza el posicionamiento por centroide y no reserva la zona ocupada por `.skyv2-intro`.

Impacto:
- interferencia con lectura;
- carga cognitiva innecesaria;
- riesgo mayor con texto ampliado;
- control interactivo superpuesto a copy informativo.

Corrección mínima:
1. definir safe-zone de intro/disclosures;
2. no colocar labels dentro de esa región;
3. clamp de labels a límites de escena;
4. si no existe posición segura, ocultar ese hint visual y conservarlo en la lista textual;
5. no mover estrellas ni geometría astronómica.

Marcador:
`CIELO_R03_88_LABEL_SAFE_ZONE_FAIL`

## Finding 2 · 320 no ejecutado en estado full-sky

La suite R03 exacta cubre solo:
- 390;
- 1440.

La orden Axioma exige:
- 320;
- 390;
- 1440.

El primer viewport base sí tiene evidencia 320, pero el nuevo navegador de 88 y el estado full-sky NO.

Estado:
`CIELO_R03_88_320_EVIDENCE_PENDING`

## Finding 3 · zoom de texto no demostrado en full-sky

No hay evidencia ejecutada de:
- texto 200%;
- navegador/ajuste equivalente;
- safe-zone de labels bajo texto ampliado;
- selector 88 + Localizar sin clipping/overflow en ese modo.

Estado:
`CIELO_R03_88_TEXT_ZOOM_EVIDENCE_PENDING`

## Contraste / roles / nombres / estados

PASS para controles nuevos por inspección:
- select nativo con label;
- botón nativo Localizar;
- min-height 44px;
- color usa `var(--ink)` sobre `var(--panel)`;
- focus usa `var(--accent)`, pares ya aprobados en Cielo base;
- forced-colors deja controles visibles;
- estado de carga se expone mediante `role=status`.

SVG alt:
NA en runtime, porque los SVG review R03 no se insertan como contenido runtime.

## Gate

NO emitir todavía PASS.

Rework:
- safe-zone/clamp de labels;
- test full-sky 320;
- test full-sky con texto ampliado.

Después:
`AXIOMA_CONSTELLATIONS_88_A11Y_PASS_READY_FOR_ASTRA`

No R04.
No cambios sobre los 88 masters.
No redraw.
No main.
No deploy.

No equivale a conformidad WCAG global ni certificación.
