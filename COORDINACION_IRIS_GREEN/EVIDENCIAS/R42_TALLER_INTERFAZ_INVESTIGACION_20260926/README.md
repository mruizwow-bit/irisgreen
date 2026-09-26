# Evidencia · investigación intensiva interfaz Taller R42 · 26/09/2026

## Repositorio inspeccionado

### A2 e8cad400
Se inspeccionaron directamente:
- `assets/ig-taller-r42.js`
- `assets/ig-taller-r42-platform.js`
- `assets/ig-taller-local-data.js`
- `assets/ig-taller-r40-tools.js`
- catálogo de 25 estudios
- scripts de build/CSP.

Hallazgos:
- stage persistido en sessionStorage;
- WebGPU solo detección;
- AudioWorklet Blob + fallback silencioso;
- IndexedDB activo por defecto cuando está disponible;
- OPFS implementado;
- ninguna dependencia Three/Pixi/Rapier/Planck/Blockly/CodeMirror/Tone en el árbol.

### PR #299 HEAD 8c1a9cc
Se inspeccionaron:
- `assets/ig-taller-r43-advanced.js`
- `assets/ig-taller-r42.js`
- `assets/ig-taller-r42.css`
- `assets/ig-taller-dibujo.js`
- `scripts/test_r43_a5_advanced_taller.js`
- catálogo.

Hallazgos:
- stage ya no persistido;
- 9 familias avanzadas directas;
- layout desktop 58px / centro / inspector 260–320px;
- móvil con dock inferior + inspector sheet;
- Arquitectura: proyección isométrica Canvas2D;
- música R43: setTimeout;
- no scene tree/layers común;
- no command palette;
- no Rapier/Planck/Three/Pixi;
- accesibilidad de objetos todavía no Mirror DOM/scene semantic model.

## Inventario funcional

25 estudios:
Dibujo; Diseño gráfico y tipografía; Patrones y arte generativo; Pixel art y animación; Color; Cómic y guion gráfico; Estructuras y puentes; Arquitectura y planos; Máquinas e inventos; Circuitos; Papiroflexia y poliedros; Programación; Robótica; Diseño de videojuegos; Simulaciones; Ritmo y secuenciador; Composición; Síntesis y paisajes sonoros; Escritura con restricciones; Mundos; Lenguas inventadas; Juegos de mesa; Fotografía y composición; Moda y textil; Ideas e inventos.

## Correcciones a afirmaciones del documento recibido

- “Blockly 13 pendiente”: corregido; v13 accesible ya está disponible.
- “F. Telefónica no dice creación propia”: corregido; las páginas actuales sí lo dicen.
- “WCAG drag: basta teclado”: corregido; 2.5.7 exige alternativa de puntero sin drag.
- “No hay fuentes de accesibilidad 3D”: corregido; W3C XAUR aporta requisitos espaciales útiles.
- “Scratch 33→60 demuestra no esconder herramientas”: no probado; el dato no sustenta esa regla.
- “18/23 funciones PhET en 10 min”: no verificado en fuente primaria; no usar.
- “Taller prohíbe almacenamiento navegador”: contradice memoria A5 y código actuales; abrir observación y reconciliar.

## Fuentes externas principales

- Figma UI3: https://www.figma.com/blog/our-approach-to-designing-ui3/
- Figma Canvas Accessibility: https://www.figma.com/blog/building-accessibility-into-a-canvas-based-product/
- W3C WCAG Dragging: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
- W3C COGA: https://www.w3.org/TR/coga-usable/
- W3C XAUR: https://www.w3.org/TR/xaur/
- Pixi Accessibility: https://pixijs.com/8.x/guides/components/accessibility
- Blockly Accessibility: https://blockly.com/accessibility
- CodeMirror Tab: https://codemirror.net/examples/tab/
- VS Code UI: https://code.visualstudio.com/docs/editing/getting-started/userinterface
- Three WebGPURenderer: https://threejs.org/manual/pages/webgpurenderer
- Chrome WebGPU 146: https://developer.chrome.com/blog/new-in-webgpu-146
- PhET Research: https://phet.colorado.edu/es/research
- Tone Transport: https://tonejs.github.io/docs/14.7.77/Transport
- AEPD age verification FAQ: https://www.aepd.es/preguntas-frecuentes/10-menores-y-educacion/1-sistemas-de-verificacion-edad/FAQ-1019-que-supone-la-verificacion-de-edad
- ICO age appropriate application: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/3-age-appropriate-application/
- Fundación Telefónica videogames: https://espacio.fundaciontelefonica.com/evento/taller-iniciacion-a-la-programacion-de-videojuegos/
- Fundación Telefónica videomapping: https://espacio.fundaciontelefonica.com/evento/taller-introduccion-al-videomapping/
- Fundación Telefónica 3D: https://espacio.fundaciontelefonica.com/evento/taller-de-impresion-y-modelado-3d-2/

## Límite

Investigación ≠ implementación. No se declara que PR #299 cumpla todavía la arquitectura objetivo.
