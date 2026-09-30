# MOTOR · A5 · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 30/09/2026
Puesto: Interactive Systems & Web Runtime Engineer

## Principio de estudio

Motor estudia primero especificaciones, organismos técnicos y documentación oficial. No adopta una API porque sea nueva.

Toda tecnología se clasifica como:
- BASE ESTABLE;
- MEJORA PROGRESIVA;
- EXPERIMENTAL/LIMITADA;
- NO NECESARIA.

## Bloque 1 · Runtime del navegador y event loop

Fuentes:
- WHATWG HTML Living Standard · Web application APIs / Event loops
  https://html.spec.whatwg.org/multipage/webappapis.html
- MDN · requestAnimationFrame
  https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

Dominar:
- tasks y microtasks;
- rendering opportunities;
- main thread;
- Promise/microtask starvation;
- requestAnimationFrame;
- frame timestamp;
- refresh rates distintos de 60 Hz;
- background tabs;
- separación input → processing → presentation.

Aplicación Iris Green:
- no usar número fijo de frames como tiempo;
- animación basada en timestamp/delta;
- no meter trabajo pesado en handlers;
- evitar cadenas de microtasks que impidan pintar.

## Bloque 2 · Máquinas de estado y arquitectura event-driven

Fuentes:
- W3C SCXML 1.0
  https://www.w3.org/TR/scxml/
- Código canónico Iris Green:
  `sabik/sabik-motion-r37.js`

Dominar:
- estados explícitos;
- transiciones válidas;
- eventos;
- efectos;
- estados transitorios y estables;
- idempotencia;
- cancelación;
- revisión/ticket para ignorar resultados obsoletos;
- invariantes.

Regla:
**estado visual, estado de dominio y trabajo asíncrono no son lo mismo.**

## Bloque 3 · Concurrencia, cancelación y stale work

Fuentes:
- MDN · AbortController
  https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
- WHATWG event loop.

Dominar:
- AbortController / AbortSignal;
- cancelación real vs “ignorar resultado”;
- sequence IDs/tickets;
- race conditions;
- timeout;
- supersedencia;
- cleanup de Promises pendientes;
- operaciones que no son abortables.

Patrón Motor:
`NEW INTENT → ABORT/INVALIDATE OLD WORK → START NEW WORK → CHECK OWNERSHIP → APPLY`.

## Bloque 4 · Pointer, touch, mouse y stylus

Fuentes:
- W3C Pointer Events Level 3 Recommendation · 30/06/2026
  https://www.w3.org/TR/pointerevents3/
- W3C WCAG 2.2 · input modalities
  https://www.w3.org/TR/WCAG22/
- Understanding Pointer Cancellation
  https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation

Dominar:
- pointerdown/move/up/cancel;
- pointer capture;
- pointerType;
- presión/stylus cuando aporta;
- click como activación device-independent;
- cancelación;
- drag alternativo;
- input concurrente;
- targets y precisión.

Nota:
Pointer Events Level 4 es Working Draft en 2026. No se usa como requisito vigente solo por ser más nuevo.

## Bloque 5 · Teclado y equivalencia semántica

Fuentes:
- WCAG 2.2 · Keyboard Accessible
  https://www.w3.org/WAI/WCAG22/Understanding/keyboard-accessible.html
- HTML nativo y elementos interactivos.

Dominar:
- teclado como canal completo;
- foco;
- Enter/Espacio/flechas cuando corresponda;
- alternativa semántica a Canvas;
- no hacer que Canvas sea el único modelo de interacción;
- restauración de foco;
- no crear keyboard traps.

Motor implementa.
Axioma determina criterio formal de conformidad.

## Bloque 6 · Motion y Web Animations

Fuentes:
- W3C Web Animations
  https://www.w3.org/TR/web-animations/
- MDN Web Animations API
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
- WCAG 2.2 · Animation from Interactions
  https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- C39 prefers-reduced-motion
  https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- MDN prefers-reduced-motion
  https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

Dominar:
- animation lifecycle;
- cancel/finish;
- keyframes;
- duration/easing;
- motion essential vs decorative;
- reduced motion;
- zero-motion path;
- user control.

Regla Iris Green:
**reduced motion no significa “animación algo más rápida”; significa reducir/eliminar movimiento que pueda molestar y conservar la función.**

## Bloque 7 · Canvas 2D y manipulación directa

Fuentes:
- MDN Canvas
  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
- ISO 9241-110:2020
  https://www.iso.org/standard/75258.html
- ISO 9241-112:2025
  https://www.iso.org/standard/87518.html

Dominar:
- resolución CSS vs backing buffer;
- devicePixelRatio con límites;
- redraw;
- hit testing;
- estructura semántica paralela;
- interacción directa;
- feedback inmediato;
- resize;
- cleanup.

Advertencia:
Canvas es un bitmap y no expone por sí solo los objetos dibujados a tecnología de apoyo. Debe existir equivalente accesible cuando la información/acción sea significativa.

## Bloque 8 · Workers y OffscreenCanvas

Fuentes:
- MDN Web Workers
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
- MDN OffscreenCanvas
  https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas

Dominar:
- separar cálculo pesado del main thread;
- postMessage;
- transferables;
- ImageBitmap;
- lifecycle del worker;
- worker failure;
- fallback local;
- coste de serialización;
- cuándo NO compensa un worker.

Regla:
un worker mejora concurrencia, no convierte un algoritmo caro en barato.

## Bloque 9 · WebGL2, GPU y recursos

Fuentes:
- Khronos WebGL 2.0
  https://registry.khronos.org/webgl/specs/latest/2.0/
- MDN WebGL best practices
  https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- MDN webglcontextrestored
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event

Dominar:
- render loop;
- GPU/CPU synchronization;
- draw calls;
- resolución interna;
- VRAM;
- textures/buffers;
- eager disposal;
- context loss;
- restore/recreate resources;
- software renderer;
- low-power choices.

Aplicación:
las escenas Iris Green ya usan DPR cap, adaptación de calidad y disposal explícito. Motor debe conservar esos principios.

## Bloque 10 · WebGPU como capacidad futura, no baseline

Fuente:
- MDN WebGPU
  https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API

Estado estudiado 30/09/2026:
WebGPU sigue figurando como **Limited availability / no Baseline**.

Consecuencia:
- detectar capacidad;
- nunca hacer WebGPU requisito único de una función pública;
- conservar WebGL2/Canvas/DOM fallback;
- adoptar solo con medición y necesidad real.

## Bloque 11 · Rendimiento de interacción

Fuentes:
- web.dev · Interaction to Next Paint
  https://web.dev/articles/inp
- web.dev · Understanding INP
  https://web.dev/codelabs/understanding-inp
- MDN Performance APIs
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API

Dominar:
- input delay;
- processing duration;
- presentation delay;
- long tasks;
- long animation frames;
- PerformanceObserver;
- marks/measures;
- layout/paint cost;
- chunking/yield;
- abort stale work.

Referencia de campo:
INP ≤ 200 ms en p75 se considera umbral de buena capacidad de respuesta en Core Web Vitals.

Motor no convierte ese umbral en garantía universal ni sustituye HUMAN QA perceptivo.

## Bloque 12 · Lifecycle, background y cleanup

Fuentes:
- MDN pagehide
  https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
- MDN Page Lifecycle / visibility concepts.

Dominar:
- visibilitychange;
- pagehide;
- pageshow;
- bfcache;
- background throttling;
- cerrar workers/canales/audio cuando corresponde;
- no depender de unload.

Regla:
elegir evento por semántica; ocultar una pestaña no siempre significa terminar una sesión.

## Bloque 13 · Storage local y concurrencia multi-tab

Fuentes:
- MDN IndexedDB
  https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN Web Locks
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
- MDN BroadcastChannel
  https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
- MDN OPFS
  https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system

Dominar:
- transacciones;
- schema/version;
- cross-tab coordination;
- lock lifetime;
- mensajes same-origin;
- cuotas;
- limpieza;
- diferencia entre user-visible file y OPFS;
- no crear persistencia oculta.

Regla Iris Green:
almacenamiento es decisión de producto/privacidad, no “detalle técnico”.

## Bloque 14 · Audio interactivo

Fuente:
- MDN AudioWorklet
  https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet

Dominar:
- AudioContext;
- user activation;
- resume/suspend;
- AudioWorklet para procesamiento de baja latencia;
- fallback Web Audio;
- evitar trabajo DSP pesado en UI thread.

Frontera:
Motor puede implementar el motor interactivo de una herramienta musical.
Eco/Lumen conservan su especialidad en audio/media según el producto.

## Bloque 15 · Testing de runtime

Fuentes:
- Playwright · Auto-waiting/actionability
  https://playwright.dev/docs/actionability
- Playwright · Emulation
  https://playwright.dev/docs/emulation

Dominar:
- locators;
- actionability;
- auto-retrying assertions;
- teclado;
- pointer/touch;
- viewport;
- reduced motion;
- no-JS;
- software WebGL;
- errores de página;
- screenshots solo como evidencia complementaria.

Regla:
un screenshot no demuestra interacción correcta.

## Bloque 16 · Ergonomía y calidad de sistemas interactivos

Fuentes:
- ISO 9241-11:2018
  https://www.iso.org/standard/63500.html
- ISO 9241-110:2020
  https://www.iso.org/standard/75258.html
- ISO 9241-210:2019
  https://www.iso.org/standard/77520.html
- ISO 9241-112:2025
  https://www.iso.org/standard/87518.html
- ISO/IEC 25010:2023
  https://www.iso.org/standard/78176.html

Aplicación:
Motor no optimiza “efectos”. Optimiza una tarea humana dentro de un contexto de uso:
- efectividad;
- eficiencia;
- satisfacción;
- capacidad de respuesta;
- fiabilidad;
- compatibilidad;
- mantenibilidad;
- interacción comprensible.

## Bloque 17 · Accesibilidad cognitiva como requisito de runtime

Fuentes:
- W3C Cognitive Accessibility
  https://www.w3.org/WAI/cognitive/
- Making Content Usable for People with Cognitive and Learning Disabilities
  https://www.w3.org/TR/coga-usable/

Aplicación:
- evitar movimiento innecesario;
- evitar sorpresas;
- estado visible;
- feedback inmediato;
- controles previsibles;
- capacidad de parar/cancelar;
- conservar tarea en modos reducidos;
- no exigir memoria de pasos invisibles.

COGA es guidance suplementaria; no se presenta como requisito normativo WCAG.

## Resultado R01

Motor debe ser capaz de construir o revisar un runtime y contestar, con evidencia:

`STATE · INPUT · EVENT · ASYNC WORK · CANCEL · RENDER · FALLBACK · CLEANUP · PERFORMANCE · ACCESSIBILITY · TEST`

La formación es continua:
`FOUNDATION → PRACTICE → REVIEW → UPDATE`.
