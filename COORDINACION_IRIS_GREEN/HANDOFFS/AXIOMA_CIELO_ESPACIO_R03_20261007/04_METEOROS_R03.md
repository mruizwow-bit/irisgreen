# AXIOMA · Meteoros R03 · contrato y estado

Fecha: 2026-10-07

Gate actual:
`METEOR_SHOWERS_R03_STATIC_READY_FOR_BROWSER_QA`

## Contrato

`EXPLORE SKY/RADIANT → LOCATE → REVEAL ORIGIN/ACTIVITY`

No cards → click → read.

Pregunta central:
- ES: «¿De qué punto del cielo parecen salir estos meteoros?»
- EN: «Where in the sky do these meteors appear to come from?»

## First viewport

- pregunta;
- cielo manipulable;
- trazos representativos;
- número de escena;
- sin nombre de la lluvia;
- sin ficha;
- sin ilustración reveal;
- sin lista de 10 cards.

## REAL_DATA

- estrellas del catálogo local HYG hasta magnitud 5,6;
- RA/Dec del radiante del JSON Atlas/Croma;
- periodo de actividad 2026;
- máximo 2026;
- ZHR de referencia;
- velocidad;
- cuerpo progenitor;
- estado/cautela de la asociación.

## REPRESENTATION

- los trazos generados son trayectorias angulares deterministas sobre la esfera y convergen hacia el radiante real;
- NO son meteoros observados simultáneamente;
- su cantidad NO codifica el ZHR;
- los 10 PNG Croma son escenas ilustradas y aparecen sólo después del reveal.

## Interacción

- drag/touch → orientar;
- rueda/+/− → zoom;
- tap/click/Enter → examinar dirección;
- radio semántico de localización = 7° angular, independiente del viewport;
- después de localizar → Reveal;
- después de revelar → nombre, origen y actividad.

## Movimiento

- NORMAL: seis trazos representativos animados;
- REDUCED: cuatro, movimiento más lento;
- NONE: trayectorias estáticas; localizar/revelar sigue disponible.

## Accesibilidad

- alternativa a drag con botones + teclado;
- descripción equivalente de la posición relativa del radiante;
- live status;
- canvas decorativo/visual, interacción semántica en contenedor;
- targets de control >=44 por CSS;
- forced-colors conserva controles y alternativa textual;
- AT real pendiente.

## Fuentes

Package:
`METEOR_SHOWERS_10_PACKAGED_READY_FOR_RUNTIME`

Atlas commit:
`69199a98e75db50bfdd171b7b3538f2b546b13b7`

Source ZIP SHA-256:
`3397e8bb41fa5209861f0652c5e95ea888ade5be708bfc83e4b9f013fb60efa4`

Factual JSON:
`/assets/data/meteoros/r01/meteor_showers_2026_verified.json`

Masters:
`/img/intereses/meteoros/r01/`

10 PNG + JSON se importaron usando los mismos Git blobs del paquete Atlas.

## Casos epistemológicos

- Southern Delta Aquariids: 96P/Machholz se presenta como asociación sospechada, no hecho cerrado.
- Táuridas: la pieza pública agrupa el complejo; la fila cuantitativa usa la rama sur como única referencia declarada.
- Leónidas: escena anual moderada, no tormenta histórica.
- visual activity tier ≠ ZHR simultáneo literal.

## Archivos R03

- `assets/ig-meteoros-r03.js`
- `assets/ig-meteoros-r03.css`
- `es/intereses/meteoros/index.html`
- `en/interests/meteor-showers/index.html`
- `METEOR_SHOWERS_R03_STATIC_ORACLE.json`

## Pendiente

- browser real 320/390/1440;
- texto 200 %;
- forced-colors en navegador;
- touch físico;
- AT real;
- HUMAN QA;
- integración posterior en shell Cielo y espacio cuando el hub deje de estar congelado.

NO MAIN · NO PUBLIC DEPLOY.
