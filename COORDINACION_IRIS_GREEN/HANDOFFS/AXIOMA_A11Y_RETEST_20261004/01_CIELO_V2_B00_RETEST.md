# AXIOMA · RETEST A11Y · CIELO V2 + B00 · 04/10/2026

Estado:
`AXIOMA_CIELO_V2_A11Y_REWORK_REQUIRED`

Rama:
`motor/prisma-cover-cielo-b00-20261003`

HEAD auditado:
`83da84e999f018dd93ccfb09a09f3ab2097a1551`

CI:
`37111984409` · SUCCESS

Artifact:
`cielo-v2-first-viewport` · ID `11270063650`
Digest:
`sha256:35d1e1cb91ad14979fb2349a31b48f9faeab994696f181620b0e9e36ccb292f6`

## Findings anteriores · RETEST

### NONE / no-motion
PASS.

El runtime bloquea:
- pointerdown cuando `motion==='none'`;
- pointermove cuando `motion==='none'`.

La navegación permanece disponible mediante botones, teclado y zoom discreto.

Marcador:
`CIELO_V2_NONE_MOTION_RETEST_PASS`

### Equivalente textual LOCATE
PASS.

La ficha/lista exponen ahora:
- altitud;
- azimut;
- dirección cardinal

para estrellas, constelaciones y planetas visibles.

Marcador:
`CIELO_V2_LOCATE_TEXT_EQUIVALENT_RETEST_PASS`

## QA manual + automático

PASS:
- `EXPLORE → LOCATE → REVEAL`;
- ES/EN;
- 320 / 390 / 1440 ejecutados por la suite;
- NORMAL / REDUCED / NONE;
- LIGHT / NAVY;
- forced-colors;
- zoom por botones/teclado/rueda;
- touch/pointer;
- target estrella >=44×44;
- aria-live en panel REVEAL;
- 0 external;
- 0 HTTP errors;
- 0 JS errors;
- B00 KEEP.

## Nuevo finding · labels de constelación en borde

REWORK_REQUIRED.

Evidencia visual del artifact exacto:
`cielo-v2-prisma-scene-390.png`.

En 390 px hay labels de constelación interactivos parcialmente cortados por el borde derecho de la escena.

Causa:
`renderTargets()` posiciona `.skyv2-const-label` por centroide con porcentajes, pero no limita el bounding box final del botón a una safe-zone interior.

Impacto:
- texto visible truncado;
- área interactiva puede quedar parcialmente fuera del viewport de escena;
- empeora con ampliación de texto;
- no es pérdida total de información porque existe la lista equivalente, pero no cumple el nivel de acabado accesible exigido para el control directo.

Corrección mínima:
1. medir/estimar bounding box del label;
2. clamp X/Y con margen seguro interior;
3. no modificar estrellas, geometría ni B00;
4. añadir assertion:
   `all_constellation_label_boxes_inside_scene == true`
   en 320/390/1440;
5. repetir con texto ampliado / zoom de texto.

## Gate

Los dos blockers originales están cerrados, pero el gate final solicitado NO se emite hasta corregir el clipping de labels.

Esperado después:
`AXIOMA_CIELO_V2_A11Y_PASS`

No equivale a conformidad WCAG global ni certificación.
