# Addendum normativo/técnico · R42 A3 · Web Platform 2026 y gate de propagación · 26/09/2026

Este addendum complementa R42 y el addendum R41. No sustituye WCAG 2.2 AA, ISO/IEC 40500:2025, EN 301 549 aplicable, ISO 24495-1, ISO 9241, W3C COGA ni los requisitos ES/EN.

## 1. Principio
“Más reciente” no equivale a “más adecuado”. Una tecnología entra en Iris Green solo si:
1. resuelve una necesidad observable;
2. mejora o conserva accesibilidad cognitiva, sensorial y técnica;
3. dispone de fallback cuando su soporte no es suficientemente amplio;
4. no degrada lectura, navegación, rendimiento, privacidad o compatibilidad;
5. puede probarse con personas y tecnologías de apoyo.

## 2. Base tecnológica recomendada
Pueden formar parte de la base progresiva por disponibilidad amplia y valor claro:
- CSS cascade layers (`@layer`) para ordenar la cascada y reducir deuda de especificidad/`!important`;
- Container Queries para componentes sensibles a su propio espacio;
- CSS Grid/Subgrid;
- HTML `<dialog>` para modal real;
- `inert` cuando una región debe quedar inactiva;
- `prefers-contrast`, forced-colors y `prefers-reduced-motion`;
- OffscreenCanvas + Web Workers para cargas gráficas demostrablemente pesadas;
- OPFS/IndexedDB para almacenamiento local de proyectos cuando tamaño/rendimiento lo justifique.

## 3. Mejoras recientes con fallback
- Popover API: disponible como Baseline 2025; usar para acciones no modales. Si el fallback es necesario, las acciones esenciales siguen accesibles.
- View Transitions: Baseline 2025; solo transición perceptiva. El cambio de estado debe funcionar sin animación y se anula/reduce cuando la persona solicita menos movimiento.
- CSS `@scope`: Baseline 2026; útil para aislar componentes sin aumentar especificidad. No se usa como única condición para que el estilo básico funcione en clientes más antiguos.
- CSS anchor positioning: Baseline 2026 muy reciente; mejora la colocación de menús/tooltips/inspectores, siempre con posición alternativa.
- Navigation API: Baseline 2026 y orientada a SPA. No justifica convertir la web completa en SPA; evaluación aislada únicamente si un workspace demuestra necesidad.
- WebGPU: disponibilidad limitada; solo mejora opcional sobre WebGL2/Canvas.
- File System Access directo (`showOpenFilePicker`): disponibilidad limitada; siempre conservar input/download/import/export estándar.

## 4. Transparencia y baja estimulación
`prefers-reduced-transparency` sigue con disponibilidad limitada en septiembre de 2026. Por ello:
- nunca es la única vía para obtener una superficie opaca y legible;
- la presentación base debe conservar contraste y legibilidad;
- Iris puede ofrecer una preferencia interna de superficies opacas/baja estimulación;
- la media query del sistema se usa como mejora donde exista.

## 5. Semántica antes que ARIA
Usar HTML nativo cuando exista. Para widgets complejos:
- toolbar con gestión de foco conforme APG;
- tabs con un panel activo, no acumulación de paneles;
- dialog con foco y salida correctos;
- nombres accesibles reales;
- alternativa a drag/drop;
- touch, teclado y screen reader como canales equivalentes.

## 6. Arquitectura cognitiva
W3C COGA recomienda patrones familiares, propósito claro, consistencia visual y relación evidente entre controles y el contenido que modifican. R42 traduce esto a:
- información: content-first;
- búsqueda/catálogo: find/explore-first;
- herramientas: workspace-first;
- juegos: play-first;
- intereses: explore-first;
- Rincón: stage-first;
- secundarios en progressive disclosure, sin esconder acciones esenciales.

## 7. Rendimiento como accesibilidad práctica
La modernización no puede bloquear el hilo principal con una shell global pesada. Objetivo operativo de Core Web Vitals:
- LCP ≤ 2,5 s;
- INP ≤ 200 ms;
- CLS ≤ 0,1;
en percentil 75 móvil y escritorio.

Heavy modules se cargan bajo demanda.

## 8. Gate obligatorio de propagación
Ninguna transformación se aplica a toda la web antes de:
- piloto representativo ES/EN;
- 320 px, zoom/reflow, teclado, touch, lector de pantalla, forced-colors, contraste, movimiento reducido;
- revisión de carga cognitiva y sensorial;
- rendimiento;
- HUMAN QA de María.

CI es necesario, no suficiente.

## 9. Estado de EN 301 549
EN 301 549 v4.1.1 fue publicada en septiembre de 2026 e incorpora WCAG 2.2 como referencia técnica. A fecha de esta revisión, AccessibleEU indica que todavía no es la referencia jurídica armonizada hasta su citación formal en el DOUE; v3.2.1 continúa como referencia armonizada. Iris puede usar v4.1.1 como objetivo técnico sin presentar esa decisión como presunción jurídica de conformidad.

## 10. Fuentes consultadas · 26/09/2026
- https://web.dev/baseline/2026
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid
- https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-anchor
- https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API
- https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
- https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
- https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-contrast
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency
- https://web.dev/articles/vitals
- https://www.w3.org/WAI/WCAG2/supplemental/objectives/o1-understandable/
- https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://designsystem.digital.gov/design-principles/
- https://designsystem.digital.gov/documentation/accessibility/
- https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en
