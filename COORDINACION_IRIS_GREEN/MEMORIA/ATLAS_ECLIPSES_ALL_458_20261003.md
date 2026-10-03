# ATLAS · ECLIPSES · 458 EVENTOS · 46 TANDAS · 03/10/2026

Estado:
`ECLIPSES_ALL_458_READY_FOR_FINAL_REVIEW`

## Orden de María

Producir **todos los eclipses** en tandas de 10 y revisar **solo al final**.

Esta instrucción cambia la cadencia de review para este carril:
- no review por tanda;
- producción continua hasta catálogo completo;
- revisión final única.

## Fuente canónica

`es/intereses/eclipses/eclipses.json`

Git blob:
`11660e752bd4afdc8c227fb610c412024ab80b3c`

Snapshot:
`2026-09-24`

Cálculo:
`astronomy-engine 2.1.19 (Don Cross), MIT`

## Catálogo

Total:
**458**

Solar:
- 228 total;
- 84 parciales;
- 74 totales;
- 70 anulares.

Lunar:
- 230 total;
- 87 totales;
- 58 parciales;
- 85 penumbrales.

Rango:
`2000-01-21T04:43:27Z → 2100-09-04T08:45:54Z`

## Batching

- 46 tandas;
- 01–45: 10 eventos;
- 46: 8 eventos.

Cada tanda:
- JSON trazable;
- SVG procedural de review.

Los SVG son **evidencia/review**, no assets runtime.

## Contrato epistemológico

Registros del snapshot:
`CALCULATION`.

Diagramas:
`REPRESENTATION`.

Hechos IGN/NASA:
`REAL_DATA` solo cuando se citan por separado; no se sustituyen por el snapshot calculado.

Reglas:
- `SIMULATION != OBSERVATION`;
- `GEOMETRIC_ECLIPSE_KIND != FULL_VISIBLE_PHASE`;
- no mapas oficiales inventados;
- no visibilidad local inferida desde dibujo;
- no porcentaje local pintado;
- no skyline/meteorología.

## Handoff

`COORDINACION_IRIS_GREEN/HANDOFFS/FIRST_PARTY_VISUAL_ASSET_PROGRAM_20261003/ECLIPSES_ALL_458/`

Incluye:
- 46 JSON;
- 46 SVG review sheets;
- manifest;
- provenance;
- FINAL_QA;
- FINAL_REVIEW_INDEX;
- HANDOFF.

## QA estructural

PASS:
- 458/458 eventos;
- 46/46 batch JSON;
- 46/46 review SVG;
- 45×10 + 1×8;
- conteos solar/lunar coinciden con source;
- 0 runtime;
- 0 main.

Siguiente:
**revisión final del conjunto completo**.
