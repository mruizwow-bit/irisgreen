# R04 · runtimes activos y obsoletos

Sistema Solar:
- ACTIVO: `assets/ig-sistema-solar-r04.js`
- ACTIVO: `assets/ig-sistema-solar-3d-r04.js`
- OBSOLETO para estas rutas: `assets/ig-sistema-solar-r03.js`
- OBSOLETO para estas rutas: `assets/ig-sistema-solar-3d-r03.js`
- DONOR histórico intacto: `assets/ig-sistema-solar.js` y `assets/ig-sistema-solar-3d.js`

Las rutas ES/EN de Sistema Solar cargan sólo el controlador R04.

Exoplanetas:
`assets/ig-exoplanetas-3d.js` se conserva como runtime vigente heredado porque R04 no reabre el bloque de exoplanetas; no se crea un segundo renderer paralelo.

Regla: no borrar donors históricos mientras no haya cutover autorizado; evitar que una ruta cargue simultáneamente legacy y R04.
