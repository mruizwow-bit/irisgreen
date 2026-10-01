# MOTOR · A5 · ESTUDIO PROFUNDO R31 · EDITORES, IME Y TECLADO VIRTUAL

Fecha: 01/10/2026
Amplía: R01–R30
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Para edición de texto:
preferir controles nativos y capacidades del navegador antes de construir un editor custom.

Orden:
```
textarea/input
→ contenteditable cuando aporta
→ editor custom solo con necesidad real
→ EditContext como progressive enhancement cuando soporte y caso lo justifican
```

## 2 · contenteditable

El navegador aporta:
- caret;
- selection;
- IME;
- clipboard;
- edición;
- accesibilidad base.

Pero Motor sigue siendo responsable de:
- modelo de documento;
- sanitización;
- history;
- selection preservation;
- performance.

No usar contenteditable como almacén canónico si el editor necesita modelo estructurado robusto.

## 3 · beforeinput + getTargetRanges()

Fuente:
- MDN · InputEvent.getTargetRanges()
  https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/getTargetRanges

Widely available desde 2021.

Permite conocer los rangos que una operación de edición afectará en contenteditable.

Útil para:
- model/view reconciliation;
- rich text editor;
- undo;
- validación.

No supone que todos los eventos sean cancelables.

## 4 · inputType

InputEvent.inputType distingue operaciones como:
- insertText;
- deleteContentBackward;
- historyUndo;
- insertFromPaste;
- format*.

Regla:
procesar intención semántica mejor que inferirla desde keydown.

## 5 · IME

Durante composición:
- no normalizar texto agresivamente;
- no re-renderizar destruyendo selección;
- no ejecutar shortcuts que interfieran;
- no autosavear cada estado intermedio si no aporta.

`compositionend` / `isComposing` son parte del contrato.

## 6 · Selection ownership

Un editor tiene dos estados:
- modelo lógico;
- selección/caret.

Una re-renderización puede conservar texto y aun romper la tarea si pierde selection.

Guardar/restaurar:
- anchor/focus;
- direction;
- range;
- mapping model↔DOM.

No usar offsets DOM como IDs persistentes si estructura cambia.

## 7 · EditContext API

Fuentes:
- MDN · EditContext API
  https://developer.mozilla.org/en-US/docs/Web/API/EditContext_API
- MDN · Using EditContext
  https://developer.mozilla.org/en-US/docs/Web/API/EditContext_API/Guide

Estado 01/10/2026:
**Experimental / Limited availability / no Baseline**.

Permite construir editable custom:
- Canvas;
- DOM no contenteditable;
- syntax editor;
- IME support.

El autor debe implementar cosas que input/textarea/contenteditable ya resuelven:
- text model;
- selection;
- bounds;
- character geometry;
- IME formatting.

Regla:
no introducirlo en Iris Green solo por modernidad.

## 8 · Model/View en editor custom

```
MODEL
  text
  selection
  composition
  history
  decorations
↓
VIEW
  DOM/Canvas
```

Input modifica modelo.
Render refleja modelo.

No mutar DOM y luego “adivinar” el modelo si el editor es complejo.

## 9 · VirtualKeyboard API

Fuentes:
- MDN · VirtualKeyboard API
  https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard_API
- MDN · boundingRect
  https://developer.mozilla.org/en-US/docs/Web/API/VirtualKeyboard/boundingRect

Estado:
**Experimental / Limited availability**.

Puede:
- optar por overlay;
- exponer geometría;
- emitir geometrychange.

No cambiar `overlaysContent=true` sin necesidad:
el navegador deja de redimensionar automáticamente y la app adquiere responsabilidad de evitar contenido tapado.

## 10 · Mobile editor layout

Probar:
- teclado aparece;
- caret sigue visible;
- toolbar no tapa texto;
- scroll correcto;
- orientation change;
- visual viewport;
- 320/390 px;
- zoom.

No asumir `100vh` útil con teclado móvil.

## 11 · Autosave y input latency

Autosave no debe:
- serializar documento grande en cada tecla;
- escribir IndexedDB sin batching;
- bloquear main thread;
- mover caret.

Patrón:
```
input
→ immediate model update
→ visual feedback
→ debounce/coalesce autosave
→ worker serialization if genuinely heavy
```

## 12 · Spellcheck/autocomplete/password managers

El navegador puede modificar input por vías distintas a keydown.

Regla:
modelo no depende exclusivamente de keyboard events.

Escuchar `input` como verdad de edición en controles nativos.

## 13 · Clipboard

Paste puede traer:
- texto;
- HTML;
- archivos.

Si el editor acepta rich HTML:
sanitización obligatoria antes de insertar contenido no confiable.

Si solo necesita texto:
preferir plain text.

## 14 · plaintext-only

Cuando soporte objetivo lo permita:
`contenteditable="plaintext-only"` puede reducir superficie rich-text.

No sustituye toda validación/modelado.

## 15 · Performance under load

Prueba:
- documento largo;
- escribir rápido;
- IME;
- selection;
- undo;
- autosave;
- análisis.

Medir:
- INP;
- long tasks;
- caret lag;
- missed input;
- memory.

El editor “funciona” pero con caret atrasado = FAIL de runtime.

## 16 · Syntax highlighting

No rehacer todo DOM por cada tecla.

Opciones:
- incremental;
- visible range;
- worker parse;
- idle/background;
- stale result guard.

Syntax color no debe bloquear input.

## 17 · Undo

Evitar doble historia:
- navegador;
- motor propio.

Si intercepta beforeinput/historyUndo:
definir claramente quién posee undo.

No capturar Ctrl+Z global sin scope.

## 18 · Testing IME real

Automatización ayuda, pero IME necesita también entorno real.

Casos:
- japonés;
- chino;
- coreano;
- dead keys/acentos;
- emoji picker;
- dictado si aplica.

No declarar soporte completo solo por unit tests.

## 19 · Error recovery

Editor debe conservar texto ante:
- autosave fail;
- analysis worker fail;
- syntax highlighter fail.

Feature secundaria no puede destruir contenido principal.

## 20 · Iris Green

Taller Escritura:
si evoluciona hacia editor más rico, Motor debe mantener:
- texto como artefacto principal;
- input nativo/robusto;
- IME;
- undo;
- local save;
- fallback.

No introducir Canvas editor de texto salvo razón excepcional.

## 21 · Estado R31

Estudiado:
- contenteditable;
- getTargetRanges;
- inputType;
- IME;
- selection;
- EditContext;
- VirtualKeyboard;
- autosave/performance;
- editor failure isolation.

Marcador:
`MOTOR_EDITOR_IME_VIRTUAL_KEYBOARD_STUDIED_R31`

No:
- editor nuevo;
- EditContext feature;
- VirtualKeyboard override;
- build;
- merge;
- deploy;
- main/production.
