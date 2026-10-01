# MOTOR · A5 · ESTUDIO PROFUNDO R47 · CSS CONTAINMENT Y CONTENT-VISIBILITY

Fecha: 01/10/2026
Amplía: R01–R46
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Antes de virtualizar DOM con JavaScript:
preguntar si el navegador puede ahorrar render mediante CSS containment.

Pero:
**optimizar render no puede cambiar la semántica ni hacer que el contenido desaparezca para quien navega con teclado/AT.**

## 2 · CSS Containment

Fuentes:
- MDN · Using CSS containment
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using
- W3C · CSS Containment Module Level 1
  https://www.w3.org/TR/css-contain-1/

Level 1 es Recommendation desde 25/06/2024.

Containment puede limitar el impacto del subtree en:
- layout;
- paint;
- style;
- size.

## 3 · contain

Valores/combinaciones:
- layout;
- paint;
- style;
- size;
- inline-size;
- content;
- strict.

`contain: content` evita size containment y suele ser más seguro que `strict`.

`strict` incluye size containment y puede colapsar un elemento si no tiene tamaño definido.

Regla:
no usar `contain: strict` como “performance switch” global.

## 4 · content-visibility

Fuente:
- MDN · content-visibility
  https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility

Estado 01/10/2026:
**Baseline 2024 newly available**.

Valores:
- visible;
- auto;
- hidden.

`auto` permite al browser saltarse rendering work de contenido fuera de vista.

## 5 · Accessibility de auto

MDN documenta que contenido offscreen bajo:
`content-visibility:auto`
permanece:
- en DOM;
- en accessibility tree.

Eso permite optimización sin retirar semántica.

Pero:
cross-browser/AT behavior real sigue necesitando QA.

No usar una nota de MDN como sustituto de pruebas con AT.

## 6 · hidden no es auto

`content-visibility:hidden`:
oculta rendering del subtree preservando parte del estado de render.

No asumir misma semántica de accesibilidad que auto.

Si contenido debe estar realmente no disponible:
elegir primitive según semántica:
- hidden;
- inert;
- display none;
- dialog/popover state;
- aria-hidden solo cuando corresponde.

Axioma decide criterios de accesibilidad.

## 7 · contain-intrinsic-size

Fuente:
- MDN · contain-intrinsic-size
  https://developer.mozilla.org/en-US/docs/Web/CSS/contain-intrinsic-size

Widely available desde 2023.

Proporciona tamaño usado cuando size containment omite contenido real.

Patrón:
```css
section {
  content-visibility: auto;
  contain-intrinsic-size: auto 500px;
}
```

`auto <length>` puede recordar el tamaño real después de renderizar.

## 8 · Placeholder size

Estimación muy baja:
contenido entra → página crece → scroll/layout jump.

Estimación demasiado alta:
espacio vacío excesivo.

`auto <length>` reduce el problema tras primera medición.

R45 visual stability conecta directamente.

## 9 · contentvisibilityautostatechange

Fuente:
- MDN · content-visibility
  https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility

Evento:
`contentvisibilityautostatechange`

Puede indicar si rendering work está siendo skipped.

Uso potencial:
- pausar canvas;
- pausar expensive visualization;
- suspender render loop offscreen.

No:
usar como señal de que elemento “no existe” o “usuario no puede navegarlo”.

## 10 · Canvas integration

Si canvas está dentro de section con content-visibility:auto:
cuando skip:
puede ser razonable detener:
- rAF;
- expensive redraw;
- GPU updates.

Al volver:
- reconcile state;
- redraw;
- no reinicializar dominio.

## 11 · IntersectionObserver vs content-visibility

IntersectionObserver:
JS signal about intersection.

content-visibility:
rendering optimization declarative.

Pueden coexistir.

No usar IO solo para recrear lo que CSS ya puede hacer.

## 12 · Virtualization

JS virtualization:
- elimina/reusa DOM nodes;
- más compleja;
- afecta focus/search/AT;
- requiere state mapping.

content-visibility:
- mantiene DOM;
- browser decide skip render.

Para listas moderadas/largas:
probar CSS antes de virtualización completa.

## 13 · Find-in-page

Contenido offscreen bajo auto permanece en DOM y puede participar en búsqueda/navegación según navegador.

Una virtualización que elimina nodos puede romper find-in-page.

Esto es una ventaja potencial de CSS containment.

Probar en browsers objetivo.

## 14 · Focus

Práctica aislada Chromium:
- section top inicial: 3000 px;
- `content-visibility:auto`;
- `contain-intrinsic-size:auto 400px`;
- button interno fuera de viewport.

Resultados:
- CSS.supports(content-visibility:auto) = true;
- CSS.supports(contain-intrinsic-size:auto 400px) = true;
- button recibió focus;
- browser scrollY pasó a 2490;
- section top quedó ~510 px en viewport.

PASS en ese entorno.

Qué demuestra:
el contenido auto-skipped pudo volverse relevante al foco.

Qué NO demuestra:
- Firefox/WebKit;
- screen reader;
- todos los layouts.

## 15 · Container queries boundary

A5 actual ya usa `container-type` en algunas capas.

Container queries:
layout/responsive design.

Containment:
render isolation/performance.

No confundir objetivos aunque compartan conceptos de containment.

Prisma lidera platform/design-system implications.

## 16 · Layout isolation

`contain: layout` puede cambiar:
- containing block;
- stacking/formatting contexts;
- positioning behavior.

No añadir sin comprobar positioned descendants.

## 17 · Paint containment

`contain: paint` puede clippear paint fuera del bounds del element.

Riesgo:
- shadows;
- tooltips;
- focus rings;
- transformed children.

No aplicar a control interactivo si corta foco visible.

## 18 · Size containment

Element size deja de depender de descendants.

Si no hay size/intrinsic size:
puede colapsar.

Esto no es bug del browser:
es la semántica de containment.

## 19 · Style containment

No es scoped CSS como Shadow DOM/@scope.

Principalmente limita efectos como counters.

No usar pensando que evita style leakage general.

## 20 · content-visibility + dynamic height

Contenido puede cambiar mientras offscreen.

Al volver:
remembered intrinsic size puede cambiar.

Test:
- async data;
- language change;
- font load;
- expanded details.

R45 layout stability.

## 21 · Long pages

Candidato:
- recursos;
- catálogos;
- artículos con muchas secciones;
- paneles largos.

No usar en:
- pequeños componentes;
- encima de la fold crítica;
- elementos cuyo render inmediato es necesario.

## 22 · Sabik

Panel de conversación:
contenido dinámico reciente debe permanecer responsive.

No aplicar auto indiscriminadamente al historial/resultados si:
- focus;
- live region;
- announcements;
- search/copy

pueden verse afectados.

Pulso/Axioma participan.

## 23 · Accessibility traps

### focus ring clipped
paint containment.

### hidden semantic mismatch
usar hidden/aria incorrectamente.

### skipped live updates
AT behavior debe probarse.

### reading order
DOM sigue mandando.

Performance optimization no justifica cambiar orden semántico.

## 24 · Current A5 audit

CSS revisado:
- `assets/ig-taller-r42.css`;
- `assets/ig-taller-r40.css`;
- `sabik/iris-mount.css`.

No se encontraron:
- content-visibility;
- contain-intrinsic-size;
- contain declarations.

Sí existe container-type en R42/Sabik CSS.

Conclusión:
no existe deuda current de content-visibility.

No introducir durante Formación.

## 25 · Testing

### keyboard
Tab into offscreen section.

### AT
screen reader navigation/search.

### find-in-page
result offscreen.

### dynamic content
height changes.

### focus ring
not clipped.

### sticky/positioned
containment semantics.

### print
content all available.

### reduced motion
not directly related but ensure no hidden reveal motion.

## 26 · Performance validation

No asumir mejora.

Medir:
- style;
- layout;
- paint;
- memory;
- scroll;
- interaction.

Para página corta:
puede no aportar.

## 27 · Fallback

Si no soportado:
browser render normal.

Eso es excelente progressive enhancement:
no requiere JS fallback para contenido.

## 28 · Adoption gate

```
LONG/EXPENSIVE SUBTREE
+ SEMANTICS PRESERVED
+ INTRINSIC SIZE
+ FOCUS TEST
+ AT TEST
+ NO PAINT CLIPPING
+ MEASURED BENEFIT
+ STATIC FALLBACK
```

## 29 · Estado R47

Estudiado:
- CSS containment;
- content-visibility;
- contain-intrinsic-size;
- accessibility semantics;
- focus;
- Canvas pause integration;
- virtualization boundary.

Práctica:
Chromium offscreen focus/content-visibility PASS.

Auditoría:
A5 no usa current content-visibility.

Marcador:
`MOTOR_CSS_CONTAINMENT_CONTENT_VISIBILITY_STUDIED_R47`

No:
- CSS optimization product;
- virtualization change;
- build;
- merge;
- deploy;
- main/production.
