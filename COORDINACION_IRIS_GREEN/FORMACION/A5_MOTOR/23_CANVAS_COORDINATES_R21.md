
# MOTOR · A5 · ESTUDIO PROFUNDO R21 · CANVAS COORDINATES, DPR, ZOOM Y HIT TESTING

Fecha: 30/09/2026
Amplía: R01–R20
Puesto: Interactive Systems & Web Runtime Engineer

No es certificación externa.
No modifica producto.

## 1 · Un puntero puede existir en varios espacios

Fuente:
- MDN · Coordinate systems
  https://developer.mozilla.org/en-US/docs/Web/API/CSSOM_view_API/Coordinate_systems

Sistemas:
- screen;
- page;
- viewport/client;
- offset;
- Canvas backing store;
- world/model coordinates.

Regla:
toda función geométrica debe declarar input space y output space.

## 2 · client coordinates

clientX/clientY son relativos al viewport.
getBoundingClientRect() también usa viewport.

Por eso combinan bien:

client normalized = (client - rect origin) / rect size.

Scroll no rompe esta relación porque ambos usan viewport.

## 3 · page / offset / screen

pageX/pageY son relativos al documento completo.
No combinarlos con getBoundingClientRect sin convertir espacios.

offsetX/offsetY dependen del target y su padding edge; event delegation puede cambiar el target.

screenX/screenY viven en screen/global UI space y no son coordenadas Canvas normales.

## 4 · CSS size vs backing size

Canvas tiene:
- tamaño visual en CSS pixels;
- canvas.width/height como backing store.

Mapping profesional:

x = (clientX - rect.left) * canvas.width / rect.width
y = (clientY - rect.top) * canvas.height / rect.height

## 5 · Práctica ejecutada

Casos:
1. DPR 2, CSS 500×300 y backing 1000×600: centro → centro.
2. Client y rect en viewport: scroll-compatible.
3. CSS resize a 250×150: mismo punto normalizado → mismo backing.
4. Entrada subpixel 0.25 CSS px a escala 2 → 0.5 backing px.

Resultado:
4/4 coordinate checks PASS.

## 6 · Auditoría A5 R42 direct

assets/ig-taller-r42-direct.js usa:
- getBoundingClientRect;
- clientX/clientY;
- normalización;
- clamp.

Patrón positivo para grid.

## 7 · Auditoría R43 advanced

Helper pxy convierte:
client/rect → canvas.width/height.

Patrón correcto para CSS → backing.

## 8 · CSS transforms

getBoundingClientRect devuelve bounding box axis-aligned.

Con rotate/skew/transform complejo, una regla de tres puede no invertir la transformación real.

Para transforms complejos:
- DOMMatrix;
- inverse;
- transformPoint.

No añadirlo cuando solo hay scale normal.

## 9 · DPR changes

devicePixelRatio puede cambiar por:
- monitor;
- zoom;
- entorno.

No asumir DPR fijo en sesiones largas si la nitidez depende de él.

## 10 · DPR cap

A5 usa caps aproximados:
- Canvas R42/R43: 2;
- 3D: 1.75 + adaptación.

Razonamiento:
DPR alto multiplica píxeles, memoria y GPU.

Regla:
calidad visual vs coste, no native DPR siempre.

## 11 · devicePixelContentBoxSize

Fuente:
- MDN · ResizeObserverEntry.devicePixelContentBoxSize
  https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/devicePixelContentBoxSize

Permite tamaño en device pixels.

Estado 30/09/2026:
Limited availability / no Baseline.

Puede ayudar a pixel-perfect rendering, pero necesita fallback.

## 12 · Zoom

Zoom modifica relaciones CSS/device pixels.

El mapping normalizado client→rect sigue siendo robusto para hit testing simple.

Probar:
- 100%;
- 200%;
- 400% cuando aplique.

## 13 · movementX

Fuente:
- MDN · MouseEvent.movementX
  https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX

Aunque aparece Baseline 2026, MDN advierte que unidades pueden variar entre browser/OS.

Para drag normal:
preferir delta de clientX/clientY previos.

Pointer Lock es otro contrato.

## 14 · Hit boundaries

Definir:
- floor;
- round;
- clamp.

En grid:
floor(normalized * cols) y clamp a cols-1.

A5 ya clampa.

## 15 · Pointer capture

Durante drag, el puntero puede salir del Canvas.

setPointerCapture mantiene el stream.

R42 direct ya lo usa.

Patrón positivo.

## 16 · Multiple pointers

Un boolean down global no basta si entra multitouch real.

Definir:
- primary pointer;
- pointerId;
- secondary policy.

No añadir multitouch sin necesidad de producto.

## 17 · Pressure

PointerEvent.pressure es normalizado cuando está disponible.

No asumir stylus solo por pressure.
Usar pointerType.

Dibujo debe conservar mouse/touch/keyboard equivalents.

## 18 · World coordinates

Para escena 2D/3D:

client
→ normalized canvas
→ normalized device coordinate
→ camera/world
→ domain hit

Guardar domain coordinate, no clientX.

## 19 · Accessibility

Hit testing visual no sustituye:
- keyboard cursor;
- semantic controls;
- status.

Misma tarea esencial sin puntero.

## 20 · Testing matrix

- scroll;
- CSS resize;
- DPR 1/1.5/2/3;
- zoom;
- boundaries;
- pointer capture;
- touch/stylus;
- resize durante drag;
- transforms si se introducen.

## 21 · Estado R21

Práctica:
4/4 PASS.

Auditoría:
- R42 mapping positivo;
- R43 mapping positivo;
- DPR caps comprendidos.

Marcador:
MOTOR_CANVAS_COORDINATE_DPR_HITTEST_STUDIED_R21

No:
- coordinate refactor;
- DOMMatrix introduction;
- DPR change;
- product build;
- merge;
- deploy;
- main/production.
