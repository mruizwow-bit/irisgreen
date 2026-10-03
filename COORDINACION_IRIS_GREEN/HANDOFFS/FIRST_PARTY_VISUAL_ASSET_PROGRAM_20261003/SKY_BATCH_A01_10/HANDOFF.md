# ATLAS · CIELO NOCTURNO · SKY BATCH A01 · READY FOR REVIEW

Gate:
`SKY_BATCH_A01_10_READY_FOR_REVIEW`

Orden canónica:
- Issue #370
- comentario `5965786714`
- `PARALLEL_BATCH_PRODUCTION · DEFAULT_BATCH=10 · REVIEW_PER_BATCH`

## Primera tanda
10 escenas data/procedural, consumiendo la curación existente `cromo=1..10` del dataset Cielo:

1. UMa · Osa Mayor · Ursa Major
2. UMi · Osa Menor · Ursa Minor
3. Cas · Casiopea · Cassiopeia
4. Ori · Orión · Orion
5. CMa · Can Mayor · Canis Major
6. Tau · Tauro · Taurus
7. Gem · Géminis · Gemini
8. Leo · Leo
9. Sco · Escorpio · Scorpius
10. Cyg · Cisne · Cygnus

## Contrato aplicado
- HYG local para RA/Dec, magnitud y B-V.
- Identidad y guías de constelación desde el donor auditado IAU/d3-celestial.
- Magnitud límite de A01: 5.5.
- 2.210 registros de estrella de escena.
- Mínimo 79 / máximo 411 estrellas por escena.
- Cada registro conserva source_index, RA, Dec, magnitud, B-V, designación/nombre cuando existe y categoría de brillo.

## Clasificación
REAL_DATA:
- RA/Dec;
- magnitud aparente;
- B-V;
- nombre/designación;
- identidad de constelación.

CALCULATION:
- selección angular del campo;
- proyección gnomónica local usada en review.

REPRESENTATION:
- tamaño/color del punto;
- estilo de líneas;
- contact sheet.

## Límites respetados
- 0 estrellas inventadas;
- 0 colocación manual;
- 0 catálogo raster;
- 0 figuras mitológicas;
- 0 Luna/planetas horneados;
- horizonte B00 = KEEP_LOCKED;
- 0 runtime;
- 0 main.

## Entregables
- 10 JSON de escena;
- `SKY_BATCH_A01_10.json`;
- `manifest.json`;
- `provenance.json`;
- `SKY_BATCH_A01_10_CONTACT_SHEET.svg`;
- MEMORIA;
- CONTROL/evidencia.

Siguiente:
`PRODUCE → BATCH REVIEW → KEEP/REWORK → NEXT BATCH`

No se inicia A02 antes de review de A01.
