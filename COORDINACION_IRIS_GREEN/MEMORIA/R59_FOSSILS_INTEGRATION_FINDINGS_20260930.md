## R59 · Fósiles · hallazgos de integración preservados / misión vigente sin cambio · 30/09/2026

Estado:
`R59_FOSSILS_INTEGRATION_FINDINGS_PRESERVED_QA_GOV_MISSION_UNCHANGED`.

El Agente R59 detecta correctamente varios requisitos que deberán cumplirse cuando Fósiles entre en la web real, pero esos hallazgos NO autorizan a reabrir ahora producto/arte ni a reconstruir el piloto.

### Hallazgos válidos para integración futura

Cuando A2 autorice integrar Fósiles:
- respetar dos rutas públicas separadas ES/EN;
- usar canonical + hreflang + metadata/OG/robots/theme-color;
- consumir shell real de Iris Green, Lectura accesible, Música y controles comunes;
- ubicar assets en rutas del repositorio, no en un paquete plano que requiera colocación manual;
- enlazar la nueva superficie desde índices pertinentes y sitemap si la arquitectura vigente lo requiere;
- entregar paquete `para-irisgreen/` copiable sobre el repositorio, no instrucciones archivo por archivo.

### Correcciones al análisis del agente

1. En A2 vivo `8ea50128b490207b4dd5508c3c46692f5be69c87` **sí existe**:
   `assets/ig-global-ui-tokens-2026.css`.
   Por tanto “esa hoja no existe en esta web” es STATE_DRIFT por inspeccionar una base anterior.

2. `img/intereses/minerales-y-fosiles.svg` existe, pero el nombre de un asset NO redefine por sí solo la taxonomía de producto.
   La orden R59 mantiene Fósiles y Minerales como pilotos separados.
   No fusionar rutas/IDs sin decisión expresa de producto.

3. Las páginas de Intereses actuales sí usan rutas ES/EN y shell completo; la integración futura debe imitar la arquitectura vigente del HEAD vivo, no una copia histórica.

### Misión vigente de R59

Sigue exactamente la orden:
`ORDENES/R59_AGENTE_INTERESES/02_FOSSILS_R2V4_FINAL_QA_GOV.md`.

Único trabajo ahora:
1. QA nominal 4/4;
2. gobernanza ejecutable;
3. GOV-01;
4. paquete final verificable;
5. STOP.

NO:
- rehacer Fósiles para A2;
- tocar índices/sitemap;
- cambiar rutas;
- mover assets al árbol web;
- cambiar tema/shell;
- abrir Minerales.

Los hallazgos de integración quedan documentados para el futuro handoff A2 y no se pierden.

Marcador vigente de salida:
`R59_FOSSILS_PILOT_R2V4_FINAL_QA_GOV_READY_FOR_ASTRA_MARIA`.

No A2.
No main.
No producción.
