# APRENDIZAJE_MOTOR_2026-09-30

## Identidad

- Alias: **Motor**
- Agente: **A5**
- Puesto profesional: **Interactive Systems & Web Runtime Engineer**
- En español: **Ingeniero/a de Sistemas Interactivos y Runtime Web**
- Jefatura: **Astra · Calidad de Producto, Arquitectura y Gates**
- Alcance actual: runtime de navegador, interacción, estado, concurrencia, input, render, motion, performance, fallback y QA técnico de interacción.

Referencia de coordinación:
- Issue #348;
- Aura Foundation R01;
- Aura Ampliación R02.

---

## Qué estudié

### Browser runtime
- WHATWG HTML Living Standard · Web application APIs / event loops
  https://html.spec.whatwg.org/multipage/webappapis.html
- MDN · requestAnimationFrame
  https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

Conceptos:
tasks, microtasks, rendering, main thread, timestamps, refresh rates, background.

### Estado y eventos
- W3C · SCXML 1.0
  https://www.w3.org/TR/scxml/

Conceptos:
state machines, eventos, transiciones, estados estables/transitorios, invariantes.

### Cancelación
- MDN · AbortController
  https://developer.mozilla.org/en-US/docs/Web/API/AbortController

Conceptos:
abortar trabajo vs invalidar resultados obsoletos.

### Input
- W3C · Pointer Events Level 3 · Recommendation 30 June 2026
  https://www.w3.org/TR/pointerevents3/
- W3C · WCAG 2.2
  https://www.w3.org/TR/WCAG22/

Conceptos:
pointer events, cancelación, teclado, drag alternatives.

Nota:
Pointer Events Level 4 consultado como Working Draft; no lo trato como requisito vigente.

### Motion
- W3C · Web Animations
  https://www.w3.org/TR/web-animations/
- WCAG 2.2 · Animation from Interactions
  https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- C39 · prefers-reduced-motion
  https://www.w3.org/WAI/WCAG22/Techniques/css/C39

Conceptos:
animation lifecycle, cancel, reduced motion, función sin movimiento no esencial.

### Canvas / Workers
- MDN · Canvas
  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas
- MDN · Web Workers
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API
- MDN · OffscreenCanvas
  https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas

Conceptos:
main-thread isolation, transferables, fallback, semantic alternative.

### GPU
- Khronos · WebGL 2.0 Specification
  https://registry.khronos.org/webgl/specs/latest/2.0/
- MDN · WebGL best practices
  https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices
- MDN · WebGPU
  https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API

Conceptos:
resource lifetime, VRAM, sync, back buffer, context loss, progressive enhancement.

Estado 30/09/2026:
WebGPU sigue documentado como disponibilidad limitada/no Baseline; no será dependencia única.

### Performance
- web.dev · Interaction to Next Paint
  https://web.dev/articles/inp
- MDN · Performance APIs
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API

Conceptos:
input delay, processing, presentation, long tasks, field responsiveness.

Referencia:
INP ≤200 ms en p75 = rango “good” de Core Web Vitals.

### Lifecycle/storage
- MDN · pagehide
  https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
- MDN · IndexedDB
  https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- MDN · Web Locks
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
- MDN · BroadcastChannel
  https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel
- MDN · OPFS
  https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system

Conceptos:
lifecycle, bfcache, same-origin coordination, storage ownership.

### Audio interactivo
- MDN · AudioWorklet
  https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet

Conceptos:
procesamiento de audio separado del UI thread y fallback Web Audio.

### QA
- Playwright · Actionability
  https://playwright.dev/docs/actionability
- Playwright · Emulation
  https://playwright.dev/docs/emulation

Conceptos:
auto-wait, locators, assertions, emulación de reduced motion, viewports.

### Ergonomía y calidad
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

Conceptos:
contexto de uso, principios de interacción, HCD, presentación de información, calidad de producto software.

### Cognición
- W3C Cognitive Accessibility
  https://www.w3.org/WAI/cognitive/
- COGA Making Content Usable
  https://www.w3.org/TR/coga-usable/

Conceptos:
previsibilidad, carga cognitiva, feedback, evitar sorpresas y movimiento innecesario.

COGA se usa como guidance suplementaria, no como requisito de conformidad WCAG.

---

## Lo explico con mis palabras

Un runtime interactivo es una cadena de responsabilidad:

`INTENCIÓN → INPUT → EVENTO → ESTADO → TRABAJO → RENDER → FEEDBACK → CLEANUP`.

Cada eslabón puede fallar.

Mi trabajo no termina cuando “se ve”.
Tengo que saber:
- quién posee el estado;
- qué entrada lo cambia;
- qué trabajo puede quedar viejo;
- cómo se cancela;
- qué ocurre sin una capacidad avanzada;
- qué se anuncia/ve;
- cómo termina;
- qué recursos quedan vivos;
- cómo se comporta en un dispositivo lento.

La regla que más cambia mi comportamiento es:

**ignorar un resultado viejo y cancelar el trabajo viejo son dos operaciones distintas.**

---

## Qué practiqué en Iris Green

Repositorio:
`mruizwow-bit/irisgreen`

Producto observado read-only:
HEAD de main consultado durante formación:
`ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5`

Base documental de Formación:
Aura R02:
`41a01a5534161da5e4b412dd0c6af424e836a53c`

Rama de Formación:
`formacion/a5-motor-runtime-r01-20260930`

### Ejercicio 1 · Sabik motion
Archivo:
`sabik/sabik-motion-r37.js`

Resultado:
**11/11 checks PASS** en ejecución aislada.

Incluyó:
- normal;
- system reduced;
- low intensity;
- risk;
- correction;
- context;
- confirmation;
- no movement;
- normal animation;
- invalid state;
- invalid stable destination.

### Ejercicio 2 · GPU runtime
Auditado:
`tools/escenas-3d/src/index.js`

Aprendido:
- rAF temporal;
- dt clamp;
- DPR cap;
- adaptación;
- ResizeObserver;
- cleanup GPU.

### Ejercicio 3 · direct manipulation
Auditado:
`assets/ig-taller-r42-direct.js`

Aprendido:
- pointer + keyboard;
- Canvas + semantic grid;
- necesidad de revisar down-event según semántica de Pointer Cancellation.

### Ejercicio 4 · worker platform
Auditado:
- `assets/ig-taller-r42-platform.js`;
- `assets/workers/ig-taller-r42-worker.js`.

Aprendido:
- worker no es “gratis”;
- fallback importa;
- WebGPU es opcional;
- un lock local de Promises no reemplaza Web Locks cross-tab.

### Ejercicio 5 · QA
Auditado:
- `scripts/test_web_r22_interactions.py`;
- `scripts/test_web_r22_webgl.py`.

Aprendido:
- probar capability absent;
- reduced motion;
- no-JS;
- software rendering;
- keyboard;
- error de página;
- múltiples viewports.

---

## Pruebas negativas

1. estado Sabik inexistente → `RangeError`.
2. destino transitorio usado como estable → `RangeError`.
3. razonamiento de stale async:
   resultado antiguo no puede aplicarse después de una intención nueva.
4. razonamiento de refresh rate:
   pasos por frame producirían distinta velocidad en 60/120/144 Hz.
5. razonamiento de capability:
   WebGPU ausente no puede inutilizar una función pública.
6. razonamiento cross-tab:
   mutex en memoria local no sustituye un lock de origen entre pestañas.

---

## Errores propios / sesgos que vigilaré

### 1 · Feature bias
Error:
usar una API avanzada porque existe.

Corrección:
problema → medida → soporte → fallback → beneficio.

### 2 · Visual PASS bias
Error:
“se ve bien” = runtime correcto.

Corrección:
estado + input + cancelación + fallo + performance + cleanup + HUMAN QA.

### 3 · Stale = cancelled
Error:
creer que ignorar el resultado ahorra el trabajo.

Corrección:
AbortSignal real cuando sea posible + ticket de ownership.

### 4 · 60 Hz bias
Error:
pensar en frames fijos.

Corrección:
timestamp/delta.

### 5 · Pointer = mouse
Error:
diseñar solo para ratón.

Corrección:
Pointer Events + teclado + semántica de activación.

### 6 · Canvas = UI completa
Error:
poner toda la interacción solo dentro del bitmap.

Corrección:
equivalente semántico/operable.

---

## Runbook

Creado:
`COORDINACION_IRIS_GREEN/FORMACION/A5_MOTOR/03_RUNBOOK_RUNTIME.md`

Principio:
`STATE · INPUT · EVENT · ASYNC · CANCEL · RENDER · FALLBACK · CLEANUP · PERFORMANCE · TEST`.

---

## Límites

Todavía NO declaro comprobado:
- matriz real de dispositivos móviles físicos;
- lector de pantalla real sobre todos los motores;
- pérdida/restauración WebGL inyectada en cada escena;
- telemetría de campo INP del producto público;
- adopción de WebGPU en producto;
- resiliencia de todos los workers históricos;
- performance perceptiva de todas las experiencias largas.

Esos puntos requieren pruebas de entorno/producto, no lectura.

---

## Estado al cerrar esta formación R01

Formación:
`MOTOR_INTERACTIVE_SYSTEMS_WEB_RUNTIME_FOUNDATION_STUDIED_R01`

No se ha hecho:
- build de producto;
- render nuevo;
- merge;
- deploy;
- main/producción;
- modificación funcional de Iris Green.

Se ha hecho:
- estudio externo;
- auditoría read-only;
- práctica aislada;
- identidad profesional;
- plan;
- examen;
- runbook;
- aprendizaje persistente.

---

## Los primeros 15 minutos del siguiente Motor

1. confirmar A5/Astra;
2. leer 00/01/02/03 y este aprendizaje;
3. recuperar orden vigente;
4. confirmar repo/branch/HEAD/base;
5. dibujar contrato de interacción;
6. crear matriz de capacidades/fallback;
7. elegir una prueba negativa;
8. solo entonces tocar runtime.

No reconstruir esta formación desde el chat.
