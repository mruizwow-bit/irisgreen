# MOTOR · A5 · ESTUDIO PROFUNDO R42 · SVG INTERACTIVO, HIT TESTING Y COORDENADAS

Fecha: 01/10/2026
Amplía: R01–R41
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

SVG no es “Canvas con tags”.

En SVG:
- cada figura puede ser un nodo DOM;
- puede recibir foco/eventos;
- tiene transformaciones propias;
- hit testing depende de geometría/pintura;
- el viewBox crea un espacio de coordenadas diferente al viewport CSS.

Motor debe usar las primitivas SVG/DOM antes de inventar hit testing manual.

## 2 · Estado de especificación

Fuentes:
- W3C · Scalable Vector Graphics (SVG) 2
  https://www.w3.org/TR/SVG2/
- MDN · SVGGraphicsElement
  https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement

SVG 2 sigue asociado a Candidate Recommendation Snapshot histórico, aunque muchas APIs concretas están ampliamente interoperables.

Regla:
- usar soporte real/API estable;
- no afirmar “SVG 2 completo = estándar final implementado”.

## 3 · SVGGraphicsElement.getScreenCTM()

Fuente:
- MDN · getScreenCTM()
  https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement/getScreenCTM

Widely available.

Devuelve DOMMatrix que transforma:
**coordenadas locales SVG → coordenadas del viewport/screen SVG**.

Para mapear pointer clientX/clientY al espacio SVG:
invertir la matriz.

Patrón:
```js
const m = element.getScreenCTM();
if (!m) return;
const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
```

No calcular manualmente con width/viewBox si existen transforms anidados.

## 4 · Práctica de transformación

Modelo aislado:

Matriz:
- scale X = 2;
- scale Y = 1.5;
- translate = (100,50).

Punto screen:
`(300,200)`.

Aplicando matriz inversa:
`(100,100)` en sistema SVG.

PASS.

Qué demuestra:
la inversión de la CTM resuelve escala+traslación.

Qué NO demuestra:
- navegador real;
- transforms CSS externos;
- nested SVG completo.

Esos casos se prueban en runtime.

## 5 · getCTM vs getScreenCTM

### getCTM()
local → viewport SVG.

### getScreenCTM()
local → viewport/screen document.

Para pointer client coordinates:
normalmente getScreenCTM es la referencia útil.

No mezclar espacios.

## 6 · getBBox()

Fuente:
- MDN · SVGGraphicsElement
  https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement

`getBBox()`:
bounding box en user space SVG.

No equivale a:
`getBoundingClientRect()`.

El segundo:
rectángulo CSS/viewport tras transformaciones/layout.

Elegir según el espacio del cálculo.

## 7 · DOMPoint / DOMMatrix

Usar:
- DOMPoint;
- DOMMatrix;
- inverse();
- matrixTransform().

Evitar:
arrays de seis números sin tipo/semántica si las APIs nativas resuelven el contrato.

## 8 · pointer-events en SVG

Fuentes:
- MDN · SVG pointer-events
  https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/pointer-events
- MDN · CSS pointer-events
  https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events

SVG permite valores específicos:
- visiblePainted;
- visibleFill;
- visibleStroke;
- painted;
- fill;
- stroke;
- bounding-box;
- none;
etc., con soporte que puede variar por valor.

Regla:
hit target puede depender de:
- fill;
- stroke;
- visibility;
- pointer-events.

No asumir “bbox visual = clickable”.

## 9 · pointer-events:none

Hace que el elemento no sea target de pointer.

Pero eventos de descendientes pueden seguir atravesando el ancestor durante bubbling/capture.

No interpretar:
`pointer-events:none` = “listener jamás corre”.

## 10 · Thin strokes

Una línea visual de 1–2 px puede ser difícil de seleccionar.

No aumentar solo el stroke visible si cambia diseño.

Patrón:
- path visible;
- hit path transparente/anchura mayor;
- mismo dato/owner.

Pero:
hit target debe seguir semántica y no solaparse de forma confusa.

## 11 · Event delegation

SVG es DOM.

Puede usar:
```
svg.addEventListener('click', e => {
  const target = e.target.closest('[data-node-id]');
})
```

Ventajas:
- menos listeners;
- nodos dinámicos.

Cuidado:
- <use>;
- shadow-like instance trees;
- event target semantics;
- nested links.

Probar la estructura real.

## 12 · <use>

`<use>` instancia contenido referenciado.

Puede complicar:
- target;
- styling;
- accessibility;
- ownership.

No basar lógica crítica en asumir que event.target será siempre el nodo fuente original.

Si la interacción importa:
usar IDs/data en wrapper/instance controlada.

## 13 · Focus

MDN expone:
- SVGElement.tabIndex;
- SVGElement.focus();
- SVGElement.blur().

Elementos naturalmente interactivos:
- links;
- elementos con tabindex.

Regla:
si una forma actúa como botón/control:
preferir semántica nativa HTML cuando sea posible.

Si SVG debe ser interactivo:
- foco visible;
- keyboard;
- role/name/state correctos;
- target suficiente.

Axioma conserva criterio formal.

## 14 · SVG accessibility draft caution

Fuente:
- W3C · SVG Accessibility API Mappings draft 24/09/2026
  https://www.w3.org/TR/svg-aam-1.0/

El propio borrador advierte que contiene información desactualizada/errores y no debe implementarse como referencia final.

Regla:
Motor NO usa ese draft como criterio normativo.

Para conformidad:
Axioma + estándares estables + comportamiento AT real.

## 15 · Keyboard navigation

SVG 2 alinea foco con modelo HTML en gran parte:
- links;
- tabindex;
- programmatic focus.

Pero un diagrama complejo no se vuelve accesible automáticamente por poner tabindex en 100 paths.

Necesita:
- modelo de navegación;
- agrupación;
- relación semántica;
- instrucciones mínimas.

## 16 · Roving tabindex

Para un conjunto de nodos:
un único item con tabindex=0;
resto -1;
flechas cambian active/focus.

Puede reducir tab stops.

Aplicable:
- mapas;
- grafos;
- paletas.

No usar si patrón esperado es lista/links normal.

## 17 · Hit testing con transforms

No convertir pointer así:
```
x = (clientX - left) / rect.width * viewBoxWidth
```
si existen:
- preserveAspectRatio;
- nested transforms;
- rotated groups;
- CSS transforms.

getScreenCTM().inverse() es más robusto.

## 18 · preserveAspectRatio

viewBox puede:
- meet;
- slice;
- align xMin/xMid/xMax y Y.

Eso introduce letterboxing/cropping.

Rect-ratio simple puede dar coordenadas erróneas.

## 19 · Zoom/pan

Modelar:
- transform view state;
- content state separado.

No mutar cada path si basta un group transform.

Para zoom:
- clamp;
- keyboard controls;
- reset;
- no wheel-only.

## 20 · Wheel

Wheel zoom:
- no único control;
- puede competir con page scroll;
- preventDefault requiere decisión/passive.

Preferir:
- botones +/-;
- reset;
- pinch cuando aplique;
- keyboard.

## 21 · pointer capture

Pointer Events funciona sobre SVG elements.

Para drag:
- pointerdown;
- setPointerCapture;
- move;
- up/cancel/lostcapture.

Mismo contrato R04/R40.

## 22 · Paths and geometry

Para editar path:
no parsear el atributo `d` con regex ingenuas.

SVG path grammar permite:
- comandos;
- signos;
- exponentes;
- compact syntax.

Si se necesita edición:
usar modelo geométrico propio/serialización robusta.

## 23 · DOM size

Miles de SVG nodes:
- layout/style/event cost.

Canvas/WebGL puede ser mejor para visualización masiva.

Regla de elección:

### SVG
pocos/miles moderados de objetos semánticos/editables.

### Canvas
muchos pixels/objetos con draw loop.

### WebGL
grandes escenas/render GPU.

No existe “mejor” universal.

## 24 · Current Iris Green audit

Búsquedas:
- `createElementNS`: sin resultado canónico;
- `getScreenCTM`: sin resultado;
- `SVGPoint`: sin resultado.

Conclusión:
Iris Green usa SVG como recurso/pictograma, pero A5 no tiene hoy un runtime SVG interactivo identificado.

No introducirlo durante Formación.

## 25 · Potential Iris Green use cases

Futuros:
- mapas interactivos;
- circuitos;
- diagramas;
- conexiones;
- arquitectura 2D;
- timelines vectoriales.

Antes de Canvas/WebGL:
evaluar si SVG DOM resuelve mejor accesibilidad/edición.

## 26 · Failure cases

### matrix null
element not rendered/disconnected.

### zero/non-invertible transform
inverse puede fallar.

### target overlap
z-order/pointer-events.

### resize
CTM cambia.

### bfcache/restore
geometry recalculated.

### font/text changes
bbox changes.

No cachear CTM/bbox indefinidamente.

## 27 · Testing

### transforms
translate/scale/rotate/nested.

### preserveAspectRatio
meet/slice.

### pointer
click/drag/cancel.

### keyboard
tab/arrows/action.

### zoom
buttons/wheel/touch.

### resize
coordinate mapping stable.

### forced colors
interactive state remains visible.

### AT
name/role/state when semantic.

## 28 · Performance

Medir:
- node count;
- style recalculation;
- pointer handler;
- mutation cost.

No migrar a Canvas por intuición si SVG ya cumple presupuesto.

## 29 · Adoption gate

```
SVG FITS DATA MODEL
+ COORDINATE CONTRACT
+ POINTER/FIND TARGET
+ KEYBOARD MODEL
+ ACCESSIBLE SEMANTICS
+ TRANSFORM TESTS
+ NODE COUNT BUDGET
```

## 30 · Estado R42

Estudiado:
- SVG coordinate spaces;
- getScreenCTM/getCTM;
- DOMMatrix inverse;
- getBBox;
- pointer-events;
- focus;
- delegation;
- accessibility boundary;
- zoom/pan/performance.

Práctica:
- affine inverse mapping PASS.

Auditoría:
- sin runtime SVG interactivo A5 actual.

Marcador:
`MOTOR_INTERACTIVE_SVG_COORDINATES_STUDIED_R42`

No:
- mapa SVG;
- interactive SVG feature;
- build;
- merge;
- deploy;
- main/production.
