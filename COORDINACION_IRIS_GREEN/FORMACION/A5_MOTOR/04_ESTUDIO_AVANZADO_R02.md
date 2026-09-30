# MOTOR · A5 · ESTUDIO AVANZADO R02

Fecha: 30/09/2026  
Amplía: Foundation R01  
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.

## 1 · Cooperative scheduling

Fuentes:
- MDN · Scheduler.yield()
  https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield
- MDN · Scheduler.postTask()
  https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask
- MDN · Prioritized Task Scheduling API
  https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API

Estado estudiado 30/09/2026:
`scheduler.yield()` y `scheduler.postTask()` aparecen como **Limited availability / no Baseline**.

Aprendizaje:
- un trabajo largo debe cooperar con el navegador;
- `yield()` permite ceder el main thread y continuar después;
- `postTask()` añade prioridad, delay y cancelación;
- no deben ser dependencia única;
- feature detection + fallback siguen siendo obligatorios.

Regla:
**si una interacción necesita respuesta inmediata, no encadenar trabajo no urgente delante del siguiente paint.**

## 2 · Background/idle work

Fuente:
- MDN · requestIdleCallback()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback

Estado:
también tiene disponibilidad limitada.

Aprendizaje:
- usar para trabajo de baja prioridad;
- no usar como garantía temporal;
- si el trabajo es obligatorio, debe existir estrategia de timeout/fallback;
- no confundir “idle” con “rápido”.

## 3 · Event Timing e INP de diagnóstico

Fuentes:
- W3C Event Timing API · Editor's Draft 19/03/2026
  https://w3c.github.io/event-timing/
- MDN · PerformanceEventTiming
  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming
- MDN · PerformanceEventTiming.interactionId
  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceEventTiming/interactionId

Aprendizaje:
- `PerformanceEventTiming` permite observar latencia de eventos;
- `interactionId` agrupa eventos de una misma interacción, por ejemplo pointerdown/up/click;
- sirve para localizar input delay / processing / presentation;
- la especificación W3C consultada es Editor's Draft, por tanto no se trata como estándar final de conformidad.

Estado útil:
MDN marca `PerformanceEventTiming` / `interactionId` como Baseline 2025 en navegadores modernos, pero equipos antiguos pueden quedar fuera.

## 4 · Long Animation Frames

Fuente:
- MDN · Long animation frame timing
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Long_animation_frame_timing

Aprendizaje:
- una LoAF es una actualización de render retrasada más de 50 ms;
- permite localizar scripts/partes de frame que contribuyen a jank;
- las interfaces específicas de LoAF siguen documentadas como experimentales / disponibilidad limitada.

Uso correcto:
diagnóstico progresivo.

No:
gate único que falle en navegadores sin API.

## 5 · Lifecycle y bfcache

Fuentes:
- web.dev · Back/forward cache · actualizado 02/07/2026
  https://web.dev/articles/bfcache
- MDN · pageshow
  https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event

Aprendizaje:
bfcache puede congelar una página y restaurarla sin reconstrucción completa.

Motor debe distinguir:
- carga inicial;
- pagehide;
- pagehide `persisted`;
- pageshow;
- pageshow `persisted`;
- visibility;
- freeze/resume cuando exista.

Regla:
**pagehide no siempre significa destruir; pageshow puede significar restaurar.**

Evitar:
`unload` como base del lifecycle.

Al entrar en bfcache puede ser necesario:
- cerrar conexiones;
- pausar loops;
- desconectar observers;
- liberar recursos no compatibles.

Al restaurar:
- reabrir/reconectar sin duplicar.

## 6 · WebGL context loss como caso normal de resiliencia

Fuentes:
- MDN · webglcontextlost
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
- MDN · webglcontextrestored
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event
- MDN · WEBGL_lose_context
  https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context

Aprendizaje:
una pérdida de contexto puede ocurrir por presión GPU, cambio de GPU o reset.

Tras restauración:
las texturas, buffers y recursos WebGL previos ya no son válidos.
La aplicación debe recrear estado/recursos.

Práctica futura obligatoria antes de afirmar resiliencia GPU:
1. `loseContext()`;
2. observar `webglcontextlost`;
3. detener render;
4. `restoreContext()`;
5. observar `webglcontextrestored`;
6. recrear recursos;
7. comprobar interacción.

## 7 · Resource ownership con AbortSignal

Fuentes:
- MDN · EventTarget / DOM events
  https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events
- MDN · AbortSignal
  https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal

Aprendizaje:
un `AbortController` puede ser owner de:
- fetch;
- listeners;
- tareas propias;
- timeout lógico cuando se compone con signals.

Patrón:
`component controller → signal → todos los listeners/ops → abort en destroy`.

Ventaja:
cleanup coherente y menos riesgo de listeners huérfanos.

Cuidado:
`{once:true}` solo elimina el listener si el evento ocurre.
Una señal combinada o de larga vida puede retener listeners añadidos por aplicación; limpiar en `finally` cuando proceda.

## 8 · Async ownership · práctica ejecutada

Se ejecutó una práctica aislada sin tocar producto.

Caso A:
- intención A tarda 50 ms;
- llega B tras 10 ms;
- B supersede A;
- A recibe abort;
- solo B puede aplicarse.

Resultado:
`PASS abortable old work stopped and cannot overwrite new intent`.

Caso B:
- trabajo C no abortable;
- llega D;
- D termina primero;
- C termina después;
- ticket/revision detecta C como stale.

Resultado:
`PASS non-abortable stale work discarded by ownership revision`.

Resultado total:
`2/2 async ownership checks passed`.

Lección:
**Abort + ownership revision resuelven problemas distintos y se complementan.**

## 9 · Presupuesto de main thread

Motor debe clasificar trabajo:

### User-blocking
Necesario para feedback inmediato de la interacción.

### User-visible
Necesario para completar la experiencia, pero puede esperar al feedback crítico.

### Background
Previews, precálculo o housekeeping que no debe retrasar input.

No convertir estas etiquetas en una dependencia directa de `scheduler.postTask()`; son primero una herramienta de diseño.

## 10 · Fail-soft runtime

Una experiencia debe definir una escalera de degradación:

`FULL → REDUCED → BASIC → STATIC/SEMANTIC`

Ejemplos:
- WebGPU → WebGL2 → Canvas/DOM;
- Worker+Offscreen → Worker calculation → main-thread chunked fallback;
- animated state → reduced motion → no-motion state;
- Canvas editor → semantic controls;
- AudioWorklet → Web Audio fallback;
- 3D scene → still visual + text/control equivalent cuando proceda.

El fallback no es “versión rota”.
Debe conservar la tarea central.

## 11 · Nueva regla de rendimiento

No optimizar solo el promedio.

Comprobar:
- peor interacción relevante;
- dispositivo lento;
- cola de trabajo;
- ráfagas;
- resize;
- hidden/restored;
- input durante render;
- cancelación durante carga.

## 12 · Qué cambia en Motor tras R02

Antes:
“hacer que la interacción funcione”.

Después:
**diseñar ownership temporal del runtime**:
- quién posee estado;
- quién posee trabajo;
- cuándo una intención supersede otra;
- qué prioridad tiene;
- cuándo cede;
- qué se congela;
- qué se restaura;
- qué recurso se destruye;
- qué fallback preserva la tarea.

## Estado R02

Marcador interno:
`MOTOR_RUNTIME_SCHEDULING_LIFECYCLE_RESILIENCE_STUDIED_R02`

No equivale a certificación externa.
No modifica producto.
