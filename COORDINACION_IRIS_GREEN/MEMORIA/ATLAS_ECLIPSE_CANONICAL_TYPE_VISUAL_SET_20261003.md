# ATLAS · ECLIPSE CANONICAL TYPE VISUAL SET · 03/10/2026

Estado:
`ECLIPSE_CANONICAL_TYPE_VISUAL_SET_READY_FOR_REVIEW`

## Autoridad
Revisión Astra:
#370 · comentario `5966236303`.

Decisión:
los 458 eventos NO se convierten en 458 ilustraciones finales.
Se reutiliza un set canónico por tipo/estado.

## Set R01
- eclipse solar total;
- eclipse solar parcial;
- eclipse solar anular;
- eclipse lunar total;
- eclipse lunar parcial;
- eclipse lunar penumbral.

## Técnica
- first-party procedural SVG;
- 1600×1000 viewBox;
- fondo transparente;
- sin texto visible;
- sin mapas;
- sin fecha;
- sin ciudad;
- sin porcentaje;
- sin claim de visibilidad;
- no a escala.

## Epistemología
- visual canónico = REPRESENTATION;
- catálogo 458 = CALCULATION;
- datos publicados IGN/NASA = REAL_DATA cuando se citan.

Reglas:
- `SIMULATION != OBSERVATION`;
- `GEOMETRIC_ECLIPSE_KIND != FULL_VISIBLE_PHASE`.

## Accesibilidad
El arte no hornea texto.
Manifest incluye:
- título ES/EN;
- alternativa breve ES/EN;
- notas de uso.

Así el runtime puede aplicar idioma y semántica sin duplicar el visual.

## Integridad
Cada uno de los 6 SVG tiene SHA-256 en:
`SHA256SUMS.txt`.

## Handoff
`COORDINACION_IRIS_GREEN/HANDOFFS/FIRST_PARTY_VISUAL_ASSET_PROGRAM_20261003/ECLIPSE_CANONICAL_TYPE_VISUAL_SET/`

Incluye:
- 6 SVG;
- contact sheet;
- manifest;
- provenance;
- SHA256SUMS;
- HANDOFF.

## Límites
- 0 runtime;
- 0 main;
- 0 deploy.

Siguiente:
review KEEP/REWORK del set canónico.


---

# R02 · CAMBIOS DEL REVIEW ASTRA APLICADOS

Fuente:
#370 · comentario `5966236303`.

Estado:
`ECLIPSE_CANONICAL_TYPE_VISUAL_SET_READY_FOR_REVIEW`

R01 se conserva como histórico.

## Cambio 1 · geometría + lectura observada

Los seis tipos canónicos se rehacen en R02.

Cada SVG combina:
- geometría lateral genérica;
- inset de lectura del disco observado.

Esto evita que el visual sea solo un esquema abstracto de conos de sombra.

## Cambio 2 · mapping data-driven

Nuevo:
`eclipse-type-visual-map.json`

Dispatch:
`source_domain + kind_es`

Mapeo exacto:
- solar + total → solar total R02;
- solar + parcial → solar parcial R02;
- solar + anular → solar anular R02;
- lunar + total → lunar total R02;
- lunar + parcial → lunar parcial R02;
- lunar + penumbral → lunar penumbral R02.

No se usan fecha, ubicación, porcentaje, contactos, alt/az ni visibilidad para elegir el arte.

## Cambio 3 · secuencias adicionales solo donde aportan aprendizaje

Se crean dos:

- `eclipse-solar-total-phase-sequence-r01.svg`
  - parcial → mayor cobertura → totalidad → salida;
  - corona genérica solo en totalidad.

- `eclipse-lunar-total-phase-sequence-r01.svg`
  - penumbra → parcial → total → parcial → penumbra;
  - cobre genérico solo como representación.

No se crean secuencias redundantes para los seis tipos.

## Cambio 4 · accesibilidad ES/EN preparada

Manifest R02 incorpora:
- título ES/EN;
- alternativa ES/EN por cada visual;
- el SVG no hornea texto visible.

## Integridad R02

SHA-256 actualizado para:
- 6 assets R02;
- 2 secuencias;
- mapping data-driven.

Contact sheet:
`ECLIPSE_CANONICAL_TYPE_VISUAL_SET_CONTACT_SHEET_R02.svg`

## Contrato epistemológico preservado

- catálogo 458 = `CALCULATION`;
- set canónico y secuencias = `REPRESENTATION`;
- datos IGN/NASA publicados = `REAL_DATA` cuando se citan.

Sin:
- fecha horneada;
- ciudad;
- porcentaje;
- mapa event-specific;
- claim de visibilidad local;
- runtime;
- main;
- deploy.

Siguiente:
review R02 KEEP/REWORK.
