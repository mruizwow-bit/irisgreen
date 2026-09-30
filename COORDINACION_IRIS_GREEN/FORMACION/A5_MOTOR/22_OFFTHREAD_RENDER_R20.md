# MOTOR · A5 · ESTUDIO PROFUNDO R20 · OFF-MAIN-THREAD RENDERING Y OFFSCREENCANVAS

Fecha: 30/09/2026
Amplía: R01–R19
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Mover render a Worker solo cuando:
- main thread está bloqueando input;
- render/cálculo domina perfil;
- arquitectura de mensajes es asumible.

No:
“Worker siempre es más rápido”.

## 2 · OffscreenCanvas

Fuentes:
- MDN · OffscreenCanvas
  https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- MDN · transferControlToOffscreen()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen

Permite:
- crear Canvas sin DOM;
- transferir control de Canvas visible a Worker;
- 2D/WebGL fuera del main thread.

## 3 · Dos patrones distintos

### A · Worker renders preview offscreen
```text
worker:
OffscreenCanvas
→ draw
→ ImageBitmap
→ post transferable

main:
drawImage
→ close bitmap
```

### B · Transfer visible canvas
```text
main:
canvas.transferControlToOffscreen()
→ post canvas to Worker

worker:
getContext
→ own render loop
```

No confundir.

## 4 · Iris Green actual

R42 usa patrón A.

Worker:
- crea OffscreenCanvas;
- pinta preview;
- `transferToImageBitmap()`;
- transfiere bitmap.

Platform:
- recibe bitmap;
- drawImage;
- `b.close()`.

Patrón positivo:
graphics resource lifetime explícito.

No se observa:
- `transferControlToOffscreen()`;
- Worker rAF para surfaces principales.

## 5 · ImageBitmap ownership

Fuente:
- MDN · OffscreenCanvas.transferToImageBitmap()
  https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap

ImageBitmap puede retener recurso gráfico grande.

Debe:
- ser consumido por bitmaprenderer;
- o `close()` tras uso.

No confiar en GC.

A5 actual ya cierra el bitmap.

## 6 · commit() no usar

Fuente:
- MDN · OffscreenCanvasRenderingContext2D.commit()
  https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvasRenderingContext2D/commit

Estado:
**Deprecated / Non-standard**.

No incluir en arquitectura nueva.

La presentación del OffscreenCanvas transferido ocurre por el event loop sin commit manual.

## 7 · Worker requestAnimationFrame

Fuente:
- MDN · DedicatedWorkerGlobalScope.requestAnimationFrame()
  https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/requestAnimationFrame

Dedicated Worker asociado a Window puede usar rAF cuando soportado.

Permite loop:
- timestamp;
- cancelAnimationFrame.

No usar setInterval para render solo porque estamos en Worker.

## 8 · Input sigue en main thread

DOM events:
- pointer;
- keyboard;
- focus

viven en Window/DOM.

Si render está en Worker:
main debe enviar **intención/state**, no cada detalle innecesario.

Ejemplo:
```text
pointer events
→ coalesce/normalize
→ compact message
→ worker state
→ render
```

## 9 · Accessibility sigue en DOM

Mover Canvas a Worker NO mueve:
- semantic grid;
- labels;
- status;
- focus.

DOM accessible model permanece main thread.

Regla:
**render thread y accessibility model son capas diferentes.**

## 10 · Resize

Main conoce:
- CSS size;
- DPR;
- ResizeObserver.

Worker necesita:
```js
{type:"resize", cssWidth, cssHeight, dpr}
```

No leer DOM desde Worker.

Coalesce resize storms.

## 11 · DevicePixelRatio

DPR puede cambiar:
- monitor;
- zoom;
- device.

No asumir fijo desde mount.

Si worker-render:
main comunica nueva backing resolution.

Cap DPR para GPU/memory según producto.

## 12 · Worker message protocol

Versionado:

```js
{protocol:1,type:"input",seq:42,...}
```

Tipos:
- init;
- resize;
- input;
- prefs;
- pause;
- resume;
- destroy.

No enviar funciones/DOM.

## 13 · Ownership

Tras `transferControlToOffscreen()`, Worker posee render del canvas.

Main no puede seguir dibujando con el context anterior.

Diseñar ownership antes de transferir.

No intentar “probar Worker y volver” sin recrear surface si platform no lo permite.

## 14 · Startup failure

Si transfer ya ocurrió y Worker falla:
fallback puede requerir:
- reemplazar Canvas DOM;
- montar Canvas main-thread nuevo;
- static fallback.

Definir **antes** del transfer.

Esto hace patrón A (bitmap preview) menos riesgoso para features pequeñas.

## 15 · Worker crash

R12:
pending work debe reject.

Para render Worker:
- mostrar fallback;
- preservar domain state main/shared;
- opcional restart.

No guardar state únicamente dentro del Worker si pérdida destruye proyecto.

## 16 · Domain ownership

Arquitectura recomendada para editores:
main/domain owner o serializable authoritative state.

Worker puede poseer:
- render cache;
- derived geometry;
- simulation replica.

Si Worker es authority:
necesita snapshots/recovery.

## 17 · Latency budget

Mover render a Worker añade:
- event→message;
- deserialize/clone;
- update;
- render;
- presentation.

Puede mejorar si elimina main-thread contention.

Puede empeorar si:
- demasiados mensajes;
- state enorme;
- copy frecuente.

Medir end-to-end.

## 18 · Transferables

Preferir:
- ArrayBuffer transfer;
- ImageBitmap transfer;
- OffscreenCanvas transfer

cuando ownership lo permite.

No structured-clone megabytes cada pointermove.

## 19 · SharedArrayBuffer

No baseline arquitectónico de Iris Green por aislamiento/costes ya estudiados.

No necesario para empezar off-thread rendering.

Message passing primero.

## 20 · WebGL Worker

OffscreenCanvas puede usar WebGL en Worker.

Necesita igualmente:
- context loss strategy;
- dispose;
- fallback;
- quality adaptation.

Mover contexto no elimina GPU constraints.

## 21 · Background

Worker rAF puede depender de associated Window rendering state.

Aun así:
document visibility/lifecycle lo decide main.

Main envía:
- pause;
- resume.

No dejar Worker consumir CPU oculto por accidente.

## 22 · Testing

### Correctness
main vs worker render representative output.

### Input
rapid pointer/keyboard.

### Latency
pointer→visible.

### Resize
storm/DPR change.

### Failure
worker terminate mid-session.

### Lifecycle
hidden/resume/destroy.

### A11y
DOM model unchanged.

## 23 · Adoption gate

```text
PROFILE SHOWS MAIN-THREAD RENDER BOTTLENECK
+ SERIALIZABLE STATE
+ MESSAGE PROTOCOL
+ FALLBACK AFTER WORKER FAILURE
+ ACCESSIBLE DOM MODEL
+ MEASURED LATENCY WIN
+ MEMORY CLEANUP
```

Si no:
mantener render main thread.

## 24 · Estado R20

Auditoría:
- current R42 preview Offscreen pattern: revisado;
- ImageBitmap close: verificado;
- no visible-canvas transfer actual: verificado.

Estudiado:
- transferControlToOffscreen;
- worker rAF;
- input/resize protocol;
- ownership/failure.

Marcador:
`MOTOR_OFF_MAIN_THREAD_RENDERING_STUDIED_R20`

No:
- canvas transfer;
- worker renderer;
- product change;
- build;
- merge;
- deploy;
- main/production.
