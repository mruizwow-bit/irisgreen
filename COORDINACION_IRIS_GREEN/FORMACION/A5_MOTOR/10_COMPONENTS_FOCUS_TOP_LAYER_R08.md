# MOTOR · A5 · ESTUDIO PROFUNDO R08 · COMPONENTES, FOCUS Y TOP LAYER

Fecha: 01/10/2026
Amplía: R01–R07
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla profesional

Motor no reinventa:
- modal;
- popover;
- foco;
- inertness;
- formularios;
- lifecycle de componentes;

si HTML/Web Platform ya ofrece una primitiva robusta.

## 2 · Custom Elements lifecycle

Fuente:
- MDN · Using custom elements
  https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

Callbacks relevantes:
- `connectedCallback()`;
- `disconnectedCallback()`;
- `adoptedCallback()`;
- `attributeChangedCallback()`;
- `connectedMoveCallback()` cuando se usa `Element.moveBefore()`.

Regla:
setup pesado preferentemente en `connectedCallback()`, no constructor.

Cleanup:
`disconnectedCallback()`.

Cuidado:
mover un custom element puede disparar disconnect/connect y resetear estado si no se diseña bien.

## 3 · Idempotencia de mount/unmount

Un componente debe tolerar:

```
connect
disconnect
connect
disconnect
```

sin:
- listeners duplicados;
- worker duplicado;
- observer duplicado;
- state corruption;
- audio duplicado.

Patrón:
```
if (mounted) return
mounted = true
setup()
...
if (!mounted) return
mounted = false
cleanup()
```

o lifecycle owner con AbortController/disposable bag.

## 4 · Shadow DOM

Fuente:
- MDN · Shadow DOM
  https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM

Ventajas:
- encapsulación DOM/CSS;
- componente reusable.

Riesgos:
- focus traversal;
- testing;
- styling;
- accessibility relationships;
- portals/top layer;
- eventos retargeted.

Motor no introduce Shadow DOM solo para “ordenar CSS”.

## 5 · delegatesFocus

Fuente:
- MDN · ShadowRoot.delegatesFocus
  https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus

Widely available desde 2021.

Puede enviar focus al primer focusable interno.

Cuidado:
“primer focusable” puede no ser el mejor destino.

Regla:
focus inicial debe seguir intención/tarea, no orden accidental del DOM.

## 6 · ElementInternals

Fuentes:
- MDN · ElementInternals
  https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
- MDN · attachInternals()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals

Widely available desde 2023, con subpartes que pueden variar.

Permite:
- custom elements form-associated;
- validity;
- form value;
- AOM/ARIA defaults.

Regla:
si un control custom pretende comportarse como control HTML real, estudiar `ElementInternals` antes de crear un “pseudo-input” inaccesible.

## 7 · Dialog nativo

Fuentes:
- MDN · <dialog>
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- MDN · showModal()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal

`showModal()`:
- top layer;
- backdrop;
- resto del documento inert;
- Esc suele cerrar.

Reglas:
- botón de cierre visible;
- focus inicial deliberado;
- restaurar focus al invocador cuando proceda;
- no meter formularios complejos sin probar teclado/AT.

## 8 · inert

Fuente:
- MDN · inert
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert

Widely available.

Hace descendientes:
- no focusables;
- no clickable;
- fuera del accessibility tree.

No usar para:
contenido “solo visualmente desactivado” que aún debe poder leerse/explorarse.

## 9 · Popover API

Fuentes:
- MDN · Popover API
  https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- MDN · Using Popover
  https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using

Estado:
**Baseline 2025 newly available**.

Con relación declarativa invoker/popover:
- actualiza orden de foco;
- Escape/light dismiss;
- establece relaciones implícitas de accesibilidad.

Regla:
para menús de ayuda, tooltips interactivos o paneles ligeros, evaluar Popover antes de construir overlay custom.

No confundir popover con modal:
popover no hace inert al resto por defecto.

## 10 · Top layer

Dialog modal y popover viven en top layer.

Beneficios:
- evita muchos problemas de z-index;
- relación más nativa con foco/escape.

Cuidado:
- stacking;
- nested overlays;
- scroll;
- animation;
- browser history si el overlay representa navegación.

## 11 · Focus restoration

Al cerrar overlay:
preferir volver al invocador si:
- sigue conectado;
- sigue focusable;
- no apareció una acción que requiera otro destino.

No guardar solo selector frágil.
Puede guardarse referencia válida, con fallback.

## 12 · Focus trap

Evitar implementar trap manual si `showModal()` resuelve el caso.

Un trap custom suele romper:
- Shift+Tab;
- nested widgets;
- screen reader virtual cursor;
- shadow roots;
- browser shortcuts.

## 13 · Events y Shadow DOM

Eventos pueden ser:
- composed;
- non-composed;
- retargeted.

Motor debe distinguir:
- target interno;
- target visto fuera;
- composedPath().

No usar `event.target` como identidad global sin entender retargeting.

## 14 · Testing de componentes encapsulados

Pruebas:
- mount/unmount repetido;
- move/reparent;
- focus in/out;
- Escape;
- nested shadow;
- disabled/inert;
- AT name/role/state;
- form submission si aplica.

## 15 · Criterio para Iris Green

Prisma puede gobernar componente/patrón visual.

Motor debe aportar:
- lifecycle;
- state;
- focus;
- events;
- cleanup;
- async;
- runtime behavior.

Axioma:
- gate de accesibilidad/estándar.

Astra:
- arquitectura y aceptación técnica.

## 16 · Anti-patrones

### Constructor side effects
crear listeners/workers antes de conectar.

### DOM move = destroy
perder estado al reordenar componente.

### Div modal
recrear manualmente todo showModal/inert/focus.

### Shadow DOM for secrecy
encapsulación no es seguridad.

### ARIA instead of behavior
`aria-modal=true` no hace realmente inert el fondo.

## 17 · Estado R08

Estudiado:
- custom element lifecycle;
- state-preserving moves;
- Shadow DOM focus;
- ElementInternals;
- dialog;
- inert;
- Popover API;
- top layer;
- focus restoration.

Marcador:
`MOTOR_COMPONENT_LIFECYCLE_FOCUS_TOP_LAYER_STUDIED_R08`

No:
- producto;
- build;
- merge;
- deploy;
- main/producción.
