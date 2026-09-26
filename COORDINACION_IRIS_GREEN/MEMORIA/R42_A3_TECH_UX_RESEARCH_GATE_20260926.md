# Memoria · R42 A3 · Gate tecnológico y UX antes de propagación global · 26/09/2026

## Instrucción vigente de María
Antes de actualizar transversalmente toda Iris Green, Agente 3 debe investigar la tecnología web más actual disponible, contrastarla con la arquitectura real y comprobar que el resultado será intuitivo, interactivo, accesible, bilingüe y adecuado para neurodiversidad.

No se autoriza propagar una capa global únicamente porque CI esté verde o porque use APIs recientes.

## Orden vigente
- Parent: #283 · R42
- A3: #284
- Estado de investigación: `R42_A3_TECH_UX_RESEARCH_GATE_ACTIVE`
- R40/R41 se conservan como evidencia funcional y HUMAN QA; no son aceptación visual global.

## Hallazgos sobre la arquitectura existente
El parche A3 R40 ya demostró que una transformación tardía del build puede introducir navegación y componentes compartidos sin editar cientos de páginas una a una. Sin embargo, su enfoque global no debe propagarse como diseño final:
- el HUMAN QA de R41 documentó exceso de apariencia de documento/formulario;
- el CI del antiguo PR #266 detectó overflow en 320 px;
- la capa antigua usa `prefers-reduced-transparency`, que en septiembre de 2026 sigue sin ser Baseline y no puede ser la única protección contra transparencia.

## Dirección seleccionada
Iris Green conserva su arquitectura canónica multipágina/pre-renderizada y adopta **progressive enhancement**. No se convierte la web completa en SPA ni se introduce React/Vue/Svelte solo por estética.

### Base estable
- HTML semántico y contenido completo antes de JavaScript.
- CSS custom properties + `@layer`.
- Container Queries para componentes.
- CSS Grid/Subgrid.
- `<dialog>` para tareas modales; Popover para acciones no modales.
- `inert` y gestión de foco.
- `prefers-reduced-motion`, `prefers-contrast`, forced-colors y preferencia Iris de baja estimulación.
- Workers/OffscreenCanvas solo donde exista carga gráfica real.
- OPFS/IndexedDB solo para proyectos locales que realmente lo necesiten.

### Mejoras progresivas, nunca requisito único
- View Transitions.
- `@scope`.
- CSS anchor positioning.
- File System Access.
- WebGPU.

### No adoptar globalmente
Navigation API como conversión SPA de Iris Green. En 2026 ya es Baseline Newly Available, pero está orientada a navegación de aplicaciones SPA. La web obtiene más valor preservando rutas, documentos, no-JS y carga por página. Podrá evaluarse solo dentro de un workspace aislado si una prueba demuestra beneficio real.

## Arquitectura de experiencia R42
La web no tendrá un único patrón forzado:
- páginas informativas: **content-first**;
- hubs/catálogos: **find-first / explore-first**;
- Taller y otras herramientas: **workspace-first**;
- Juegos: **play-first**;
- Intereses: **explore-first**;
- Rincón: **stage-first**.

Elementos comunes: cabecera compacta, command/actions, jerarquía primary/secondary/tertiary, panel activo único cuando corresponda, rail/context toolbar, inspector y drawer/sheet. En móvil: composición propia mediante bottom dock/sheet, no escritorio apilado.

## Gate antes de propagación
1. Inventario técnico y cognitivo de la base vigente.
2. Matriz de tecnología con soporte, fallback, beneficio, riesgo y coste.
3. Piloto representativo ES/EN: página informativa + hub/catálogo + workspace + superficie inmersiva.
4. QA 320 px, zoom/reflow, teclado, lector de pantalla, touch, forced colors, contraste, reduced motion, ES/EN y rendimiento.
5. HUMAN QA de María en preview integrada.
6. Corrección.
7. Solo entonces propagación mediante sistema compartido/build.

## Rendimiento
Objetivo de experiencia en campo:
- LCP ≤ 2,5 s;
- INP ≤ 200 ms;
- CLS ≤ 0,1;
medidos al percentil 75 por móvil y escritorio.

Los módulos pesados se cargan por necesidad; no formar un bundle global monolítico.

## Fuentes técnicas contrastadas · consulta 26/09/2026
- Baseline 2026: https://web.dev/baseline/2026
- CSS @layer: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer
- Container Queries: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
- Subgrid: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid
- Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- dialog: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- inert: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert
- View Transitions: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- @scope: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope
- CSS anchor positioning: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-anchor
- OffscreenCanvas: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- OPFS: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
- File System Access picker: https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
- WebGPU: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- Navigation API: https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
- Core Web Vitals: https://web.dev/articles/vitals
- W3C COGA: https://www.w3.org/WAI/WCAG2/supplemental/objectives/o1-understandable/
- WAI-ARIA APG Toolbar: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- USWDS design principles: https://designsystem.digital.gov/design-principles/
- EN 301 549 v4.1.1 update: https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en

## Producto
En este gate no se ha desplegado ni propagado la actualización global. El siguiente artefacto de producto debe ser un piloto R42 aislado sobre la base A2 vigente, no una reactivación del PR R40 #266.
