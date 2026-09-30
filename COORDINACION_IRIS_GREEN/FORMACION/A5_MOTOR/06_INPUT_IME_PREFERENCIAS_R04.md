# MOTOR · A5 · ESTUDIO PROFUNDO R04 · INPUT HUMANO, IME Y PREFERENCIAS

Fecha: 30/09/2026
Amplía: R01 + R02 + R03
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla profesional

Motor no diseña para “ratón + teclado US”.

Diseña para intención humana a través de:
- teclado con layouts distintos;
- teclado virtual;
- lector/tecnología de apoyo;
- IME;
- touch;
- pen/stylus;
- mouse/trackpad;
- cancelación de gesto;
- preferencias del sistema.

## 2 · KeyboardEvent.key vs code

Fuentes:
- MDN · KeyboardEvent.key
  https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
- MDN · KeyboardEvent.code
  https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
- MDN · KeyboardEvent.keyCode
  https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode

Aprendizaje:

`key`:
- expresa el valor esperado según layout/modificadores;
- es normalmente el correcto para shortcuts de carácter y UI.

`code`:
- expresa posición física;
- no representa el carácter que la persona ve;
- puede ser útil para controles espaciales tipo juego.

`keyCode`:
- deprecated;
- no usar en código nuevo.

Regla:
**si el atajo se explica como “pulsa Z”, usar semántica de key/layout; si la tarea depende de posición física, justificar code.**

## 3 · IME y composición

Fuentes:
- MDN · KeyboardEvent.isComposing
  https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
- MDN · InputEvent.isComposing
  https://developer.mozilla.org/en-US/docs/Web/API/InputEvent
- MDN · composition events / UI Events

IME puede mantener una composición abierta antes de producir el texto final.

Riesgos típicos:
- Enter que envía mientras la persona confirma composición;
- Escape que cierra UI en mitad de edición;
- Ctrl/Cmd shortcut que pisa edición;
- validación que corre sobre texto intermedio.

Patrón:
`if (event.isComposing) return;`
cuando un shortcut no debe intervenir durante composición.

No aplicar ciegamente:
algunos componentes necesitan observar composición para mostrar preview.

## 4 · beforeinput / input

Fuente:
- MDN · beforeinput
  https://developer.mozilla.org/en-US/docs/Web/API/Element/beforeinput_event
- MDN · InputEvent
  https://developer.mozilla.org/en-US/docs/Web/API/InputEvent

`beforeinput` permite conocer/alterar una operación de edición antes de modificar contenido.

Pero:
- no toda modificación dispara beforeinput;
- algunas son no cancelables;
- IME/autocomplete/spellcheck/password manager varían por navegador/OS.

Regla:
**no construir un editor robusto suponiendo que beforeinput intercepta absolutamente toda edición.**

## 5 · Undo/redo y editores

Cuando Motor crea un historial propio:
- no robar Ctrl/Cmd+Z dentro de un input/editor nativo;
- distinguir undo del motor y undo de texto;
- no actuar durante IME;
- respetar foco;
- anunciar resultado cuando corresponda;
- limitar historial y memoria.

Un historial de comandos es mejor que snapshots gigantes si el dominio lo permite, pero la elección depende del motor.

## 6 · Pointer cancellation

Fuentes:
- MDN · pointercancel
  https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event
- MDN · touch-action
  https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- Pointer Events Level 3
  https://www.w3.org/TR/pointerevents3/

`pointercancel` puede aparecer por:
- scroll/pan/zoom;
- cambio de app;
- orientación;
- palm rejection;
- demasiados pointers;
- decisión del navegador.

Toda manipulación debe definir:
`down → move* → up | cancel`.

Cancel no es error excepcional.
Es parte normal del contrato.

## 7 · touch-action

`touch-action` comunica al navegador qué gestos conserva.

`touch-action:none`:
- puede ser correcto en una superficie de dibujo;
- también impide pan/pinch del navegador dentro de esa región.

Regla Iris Green:
aplicarlo solo al área que realmente necesita manipulación directa.

Nunca usarlo como solución global para “que touch funcione”.

## 8 · Passive listeners

Fuentes:
- MDN · addEventListener passive
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
- MDN · wheel
  https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event

Un listener que puede cancelar scroll obliga al navegador a esperar.

Si NO necesita `preventDefault()`:
`passive:true` puede evitar jank.

Si SÍ necesita cancelar:
declarar `passive:false` explícitamente donde el navegador lo requiera.

No confundir:
- wheel;
- scroll;
- pointer.

## 9 · High-frequency pointer

Fuente:
- MDN · PointerEvent.getCoalescedEvents()
  https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents

Para dibujo rápido, el navegador puede agrupar movimientos.

`getCoalescedEvents()` recupera muestras intermedias en navegadores compatibles.

Estado:
Limited availability.

Patrón:
```text
if (event.getCoalescedEvents) samples = event.getCoalescedEvents()
else samples = [event]
```

No procesar más muestras de las que el pipeline de render puede consumir.

## 10 · Estado inerte

Fuente:
- MDN · inert
  https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert

Estado:
widely available desde 2023.

`inert`:
- saca descendientes del tab order;
- impide click/focus;
- los retira del accessibility tree.

Útil para:
- background de un modal;
- panel realmente desactivado.

Peligro:
si contenido debe seguir siendo descubrible/legible, inert puede ocultarlo demasiado.

Regla:
**inert representa indisponibilidad real, no decoración.**

## 11 · Preferencias de usuario

### prefers-reduced-motion
Fuente:
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

Baseline/widely available.

Motor debe responder en runtime cuando la preferencia cambia, si la UI vive suficiente tiempo.

### forced-colors
Fuente:
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors

Widely available.

Motor no debe depender de colores/shadows para el estado interactivo.

### prefers-contrast
Fuente:
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast

Útil cuando soportado.
No sustituye forced-colors ni criterios de contraste.

### prefers-reduced-transparency
Fuente:
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency

Estado 30/09/2026:
Limited availability / experimental.

No convertirlo en baseline.

## 12 · No inferir diagnóstico

Una preferencia del sistema indica una preferencia técnica, no una identidad clínica.

Motor:
- honra reduced motion;
- honra forced colors;
- adapta interacción.

No:
- concluye que la persona “tiene” una condición;
- cambia contenido sensible por inferencia.

## 13 · Auditoría read-only · Taller/Sabik

### A. `assets/ig-taller-r42-direct.js`

Positivo:
- pointerdown/move/up/cancel;
- pointer capture;
- teclado;
- canvas + grid semántica.

CSS:
`.ig42-direct-canvas { touch-action:none }`.

Interpretación:
correcto como patrón para manipulación directa si:
- la superficie necesita capturar gestos;
- existe alternativa teclado;
- no crea una región móvil imposible de atravesar.

Requiere QA touch real.

### B. `assets/ig-taller-estudio.js`

Undo global:
- evita INPUT/TEXTAREA/SELECT salvo opt-in;
- no usa `isComposing`.

Hoy no se observó `contenteditable` en los archivos auditados.

Riesgo futuro:
si aparece editor custom/contenteditable/IME, el shortcut debe endurecerse.

No se declara bug actual solo por esta ausencia.

### C. `sabik/iris-mount.mjs`

Shortcut:
Ctrl/Cmd+Enter → submit.

No comprueba `isComposing`.

Candidato de QA:
- IME japonés/chino/coreano;
- composición de acentos/teclado virtual;
- Ctrl/Cmd+Enter durante composición.

### D. `assets/ig-taller-r40-tools.js`

Juego:
listener de `keydown` en `document` mueve jugador con flechas cuando `state.play`.

No filtra target/foco y no se observa `preventDefault()` en ese handler.

Candidatos de QA:
- foco en botón/control durante play;
- scroll simultáneo al mover;
- flechas desde tecnología de apoyo;
- lifecycle del listener.

No se declara FAIL hasta ejecución de QA real.

## 14 · Prueba negativa que Motor debe saber construir

### IME submit
1. abrir composición;
2. emitir Enter/Ctrl+Enter;
3. comprobar que no se envía antes de `compositionend` si el contrato no lo desea.

### Pointer cancel
1. pointerdown;
2. empezar gesto;
3. disparar/capturar `pointercancel`;
4. asegurar que no queda estado painting/dragging.

### Scroll conflict
1. modo juego;
2. foco fuera del canvas;
3. ArrowDown;
4. observar si juego y página actúan simultáneamente.

### Forced colors
1. activar forced colors;
2. comprobar estado seleccionado/foco/feedback sin depender de sombra/color.

## 15 · Nuevo checklist de input

Antes de PASS:

```text
FOCUS
KEYBOARD_LAYOUT
IME
POINTER
TOUCH
PEN
POINTER_CANCEL
SCROLL_CONFLICT
SHORTCUT_SCOPE
REDUCED_MOTION
FORCED_COLORS
ZOOM
ASSISTIVE_EQUIVALENT
```

## 16 · Estado R04

Auditoría read-only:
- teclado/IME: completada;
- pointer/touch: completada;
- preferencias: estudiadas;
- tres candidatos concretos de QA identificados.

Marcador:
`MOTOR_HUMAN_INPUT_IME_PREFERENCES_STUDIED_R04`

No:
- modificación funcional;
- build;
- merge;
- deploy;
- main/producción.
