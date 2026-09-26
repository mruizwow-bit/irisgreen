# R41 · Interactive Product Rebuild · 26/09/2026

Estado canónico: `R41_INTERACTIVE_PRODUCT_REBUILD_REQUIRED`

## Motivo
María ha rechazado visualmente el Taller R40 integrado: funcionalmente existen 25 estudios y capa local, pero la experiencia sigue siendo documento/formulario, no aplicación creativa moderna. El mismo riesgo afecta a Juegos, Intereses y Rincón.

## Issues operativos
- Parent: #276
- A3: #277 · app shell + sistema interactivo común
- A5: #278 · Taller canvas-first
- A1: #279 · Recursos/Juegos play-first
- A4: #280 · Intereses/Cuaderno visual explorer
- A7: #281 · Rincón inmersivo
- A2: #282 · integración/subida + HUMAN QA

A6 permanece con la voz de Sabik.

## Regla
Construir → entregar patch → A2 integrar/subir → revisar en web → corregir → A2 reintegrar/subir.

Los R40 #260/#261/#262/#263/#265 quedan superseded visualmente. Se conservan como historial/base funcional, no como diseño aceptado.

## Referencias
- Figma UI3: trabajo/canvas en el centro, paneles colapsables/redimensionables, toolbar compacta, Actions.
- tldraw: canvas-first, toolbars adaptables, shortcuts, paneles de estilos.
- WAI-ARIA APG: toolbar/tabs/disclosure.
- MDN: Container Queries, Popover, Dialog, View Transitions, OffscreenCanvas, File System/OPFS, WebGPU con fallback.

Normativa: `NORMATIVA/ADDENDUM_R41_INTERACTIVE_PRODUCT_DESIGN_20260926.md`
Memoria: `MEMORIA/R41_HUMAN_QA_DESIGN_RESET_20260926.md`
Control: `CONTROL/DELTA_R41_INTERACTIVE_PRODUCT_REBUILD_20260926.json`
