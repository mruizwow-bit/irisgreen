# R40-RINCON-R04 · inventario de archivos visuales y UX

## Motor visual nuevo
- `assets/rincon-escenas-r04.js`
  - implementa las 9 escenas en un motor común first-party Canvas2D;
  - usa `prefers-reduced-motion`/ajuste Iris a través del contrato `reduced()`;
  - no carga red externa;
  - no contiene audio;
  - exporta `window.IGScenesR04`.

## Binding visual
- `assets/rincon-calma.js`
  - deja de cargar `rincon-escenas-3d.js`;
  - carga `rincon-escenas-r04.js`;
  - mantiene el ciclo común de escena, detener, temporizador y equivalente textual.

## Arquitectura y estilo
- `assets/rincon-r04.js`
  - reorganiza físicamente el DOM: reproductor/estado/bola primero;
  - selector compacto después del reproductor;
  - ajustes secundarios en `<details>`;
  - selector móvil;
  - tabs con ArrowLeft/ArrowRight/Home/End;
  - al cambiar de modo detiene la herramienta anterior.
- `assets/rincon-r04.css`
  - diseño escritorio y móvil;
  - targets >=44 px;
  - forced-colors;
  - reduced motion;
  - escena visible en primer viewport;
  - sin `scrollIntoView` para ocultar una mala jerarquía.

## Páginas
- `es/sitio-tranquilo/index.html`
- `en/quiet-space/index.html`

Ambas cargan el mismo sistema R04 con textos equivalentes y copy público sin jerga técnica innecesaria.

## Evidencia
- 1440×900: Vídeos / Sonidos / Bola.
- 390×844: Vídeos / Sonidos / Bola.
- DOM serializado por modo en `docs/r40-a7-build/r04-evidence/dom/`.

## Hallazgos encontrados por A7 durante QA y corregidos
1. evidencia inicial capturaba paneles colapsados;
2. controlador R04 no desocultaba/abría correctamente la superficie;
3. validador DOM tenía un regex defectuoso;
4. `organizeSounds` usaba un elemento único como si fuera NodeList;
5. los controles de filtro heredados ocuparon por error el lugar de “Parar sonido”;
6. copy público exponía “first-party” sin explicación.

Todos fueron corregidos antes del handoff.
