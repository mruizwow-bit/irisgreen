# ATLAS · SKY_BATCH_A01_10 · CIELO NOCTURNO DATA/PROCEDURAL

Fecha: 03/10/2026  
Owner: Atlas A1  
Orden: #370 · comentario `5965786714`  
Gate: `SKY_BATCH_A01_10_READY_FOR_REVIEW`

## Resultado

Primera tanda de 10 escenas de cielo construidas desde datos ya auditados.

Selección:
`cromo 1..10` del dataset canónico de Cielo.

- 01 · UMa · Osa Mayor · Ursa Major · 199 estrellas · radio 36.373°
- 02 · UMi · Osa Menor · Ursa Minor · 129 estrellas · radio 26.83°
- 03 · Cas · Casiopea · Cassiopeia · 264 estrellas · radio 33.914°
- 04 · Ori · Orión · Orion · 247 estrellas · radio 27.599°
- 05 · CMa · Can Mayor · Canis Major · 168 estrellas · radio 22.517°
- 06 · Tau · Tauro · Taurus · 411 estrellas · radio 40.407°
- 07 · Gem · Géminis · Gemini · 79 estrellas · radio 18.074°
- 08 · Leo · Leo · Leo · 140 estrellas · radio 29.669°
- 09 · Sco · Escorpio · Scorpius · 342 estrellas · radio 34.318°
- 10 · Cyg · Cisne · Cygnus · 231 estrellas · radio 29.346°

## Densidad

- límite de magnitud: 5.5;
- total de registros de estrella en escenas: 2210;
- mínimo por escena: 79;
- máximo por escena: 411;
- no se reduce el producto a una demo de 20 estrellas.

## Trazabilidad

Cada estrella conserva:
- `source_index`;
- RA;
- Dec;
- magnitud aparente;
- B-V;
- constelación fuente;
- designación;
- nombre cuando existe;
- distancia/tipo espectral cuando existen;
- categoría de brillo;
- coordenadas proyectadas de review.

Fuente:
`es/intereses/cielo/cielo.json`

Git blob fuente:
`f8594587d14c0ac51f33e424507c08be0429b680`

Fuentes declaradas por el snapshot:
- HYG Database v4.1, David Nash (astronexus), CC BY-SA 4.0
- IAU Working Group on Star Names (WGSN), lista compilada por Cora Schneck (iau-star-names), MIT
- Líneas, límites y nombres de d3-celestial, Olaf Frohn, BSD-3-Clause; límites oficiales de la IAU (Delporte, 1930)

## Clasificación

REAL_DATA:
RA/Dec, magnitud, B-V, nombres/designaciones e identidad de constelación.

CALCULATION:
selección angular y proyección gnomónica local para review.

REPRESENTATION:
tamaño/color de punto, líneas de ayuda y composición de contact sheet.

## Reglas respetadas

- 0 estrellas inventadas;
- 0 colocación manual de estrellas;
- 0 catálogo raster;
- 0 figuras mitológicas;
- 0 Luna/planetas horneados;
- horizonte B00 no modificado;
- 0 runtime;
- 0 main.

## Entregables

`COORDINACION_IRIS_GREEN/HANDOFFS/FIRST_PARTY_VISUAL_ASSET_PROGRAM_20261003/SKY_BATCH_A01_10/`

Incluye:
- 10 JSON de escena;
- batch summary;
- manifest;
- provenance;
- contact sheet SVG;
- handoff.

Estado:
`READY_FOR_REVIEW`

Siguiente:
review KEEP/REWORK antes de A02.
