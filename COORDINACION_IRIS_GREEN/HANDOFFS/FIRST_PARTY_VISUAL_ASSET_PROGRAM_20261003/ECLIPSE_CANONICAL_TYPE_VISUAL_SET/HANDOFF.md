# ATLAS · ECLIPSE CANONICAL TYPE VISUAL SET · R02 REWORK

Gate:
`ECLIPSE_CANONICAL_TYPE_VISUAL_SET_READY_FOR_REVIEW`

Este R02 aplica los cambios de producto del review Astra:
#370 comentario `5966236303`.

## CAMBIOS APLICADOS

### 1 · Seis tipos canónicos rehechos
Cada tipo tiene ahora:
- geometría lateral genérica;
- lectura complementaria del disco observado;
- sin fecha/ciudad/porcentaje;
- sin mapa event-specific;
- no a escala.

Tipos:
1. solar total;
2. solar parcial;
3. solar anular;
4. lunar total;
5. lunar parcial;
6. lunar penumbral.

### 2 · Dispatch data-driven explícito
`eclipse-type-visual-map.json`

Clave:
`source_domain + kind_es`

El catálogo de 458 eventos selecciona visual por tipo.
No usa fecha, lat/lon, porcentaje, contactos, alt/az o visibilidad para escoger el arte.

### 3 · Diagramas adicionales solo donde aportan aprendizaje
Se añaden SOLO:
- secuencia genérica de eclipse solar total;
- secuencia genérica de eclipse lunar total.

No se generan secuencias redundantes para los seis tipos.

### 4 · ES/EN
Manifest R02 incluye título y alternativa ES/EN para los seis assets.

## RELACIÓN CON CATÁLOGO
- 458 eventos = `CALCULATION`;
- seis visuales + dos secuencias = `REPRESENTATION`;
- publicación IGN/NASA = `REAL_DATA` cuando se cite.

## INTEGRIDAD
Ver:
`SHA256SUMS.txt`

## HISTÓRICO
R01 permanece como histórico.
R02 es el candidato canónico actual.

## LÍMITES
- 0 runtime;
- 0 main;
- 0 deploy.

Estado:
`READY_FOR_REVIEW_R02`
