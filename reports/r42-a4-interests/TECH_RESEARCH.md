# R42-A4 · investigación tecnológica y UX aplicada · 26/09/2026

## Dirección de producto
R42 sustituye la UI documental R40. Intereses se construye explore-first: stage visual antes que párrafos/listas/filtros. Cuaderno es workspace. Etapas de vida: Infancia / Adolescencia / Adultez / Cualquier edad; orientan profundidad, no bloquean contenido.

## Tecnología adoptada ahora
- MPA/pre-render + progressive enhancement; compatible con A3.
- Canvas 2D first-party para visuales procedurales accesibles con equivalente textual.
- CSS @layer + Container Queries + Grid; sin blur masivo.
- native dialog para búsqueda/fuentes/colección.
- View Transitions feature-detected para cambios de modo; reduced motion las anula.
- Geolocation solo por acción explícita, reducción inmediata a 0,1° y cero envío.
- Screen Wake Lock opcional en Cuaderno.
- Web Audio existente solo opt-in.
- storage no se duplica: se consume adapter compartido A5 y existe fallback de sesión.

## Tecnología investigada y NO usada como requisito
- WebGPU: no Baseline; Three.js WebGPURenderer puede caer a WebGL2. Reservado para módulos 3D que lo justifiquen.
- WebXR: disponibilidad limitada/experimental; futuro enhancement de astronomía/3D con fallback convencional y XAUR.
- Cesium/3D Tiles: muy potente para geoespacial masivo/Gaussian splats, pero añadir cloud/dependencia no está justificado para el primer rebuild A4.
- MapLibre: candidato serio para mapa/globo real self-hosted; esta entrega evita meter una dependencia nueva antes de HUMAN QA.
- Background Sync/periodic sync: no Baseline y además contradice el objetivo local/offline sin tracking del Cuaderno.

## Referencias actuales
- https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API
- https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- https://threejs.org/manual/pages/webgpurenderer
- https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://maplibre.org/maplibre-gl-js/docs/examples/
- https://science.nasa.gov/eyes/
- https://science.nasa.gov/blogs/eyes/2026/09/03/nasas-eyes-software-august-release-notes/
- https://ssd-api.jpl.nasa.gov/doc/horizons.html
- https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html
- https://exoplanetarchive.ipac.caltech.edu/docs/exonews_archive.html
- https://sky.esa.int/esasky-tap/tap
- https://www.w3.org/WAI/research/user-requirements/
- https://www.w3.org/WAI/WCAG2/supplemental/objectives/o8-personalization/
- https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API

## Edad/etapa
NASA organiza recursos por K-4, 5-8, 9-12, Higher Education e Informal Education; Iris Green usa las cuatro etapas canónicas R42 y mantiene cambio libre. La etapa no es diagnóstico ni edad verificada.
