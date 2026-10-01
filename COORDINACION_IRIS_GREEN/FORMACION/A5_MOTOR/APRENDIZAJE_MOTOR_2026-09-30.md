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


---

## Ampliación de aprendizaje · R02

### Scheduling cooperativo

He estudiado:
- `scheduler.yield()`;
- `scheduler.postTask()`;
- Prioritized Task Scheduling;
- `requestIdleCallback()`.

Conclusión:
ninguna de estas capacidades se convierte en baseline de Iris Green solo por ser útil. A 30/09/2026, MDN sigue marcando `scheduler.yield/postTask` y `requestIdleCallback` con disponibilidad limitada.

Uso:
- diseño de prioridades primero;
- feature detection después;
- fallback siempre.

### Event Timing / INP

He estudiado `PerformanceEventTiming` e `interactionId`.

Aprendizaje:
una interacción puede ser una secuencia de eventos y debe medirse como interacción, no solo como duración de un handler aislado.

La especificación Event Timing consultada es Editor's Draft de 19/03/2026, por lo que la trato como trabajo en evolución; las APIs que MDN marca como disponibles se usan como instrumentación, no como criterio normativo de conformidad.

### Long Animation Frames

LoAF permite diagnosticar frames de render >50 ms y atribuir jank con más detalle.

Las interfaces siguen siendo experimentales/de disponibilidad limitada:
instrumentación progresiva, no dependencia.

### bfcache

Cambio importante de modelo mental:

`pagehide != destroy`.

Una página puede congelarse y volver mediante bfcache.
Debo:
- pausar/cerrar recursos adecuados;
- no depender de `unload`;
- restaurar en `pageshow/resume`;
- evitar duplicar conexiones/listeners.

### WebGL context loss

La pérdida de contexto no es un caso “imposible”.
Puede ocurrir por presión o reset de GPU.

Tras `webglcontextrestored`, los recursos antiguos ya no son válidos.
Para declarar resiliencia real hay que inyectar loss/restore y recrear recursos.

### Ownership con AbortSignal

Un controller puede ser lifecycle owner de múltiples listeners y operaciones.

Nueva preferencia de diseño:
`component lifecycle → AbortController → listeners/async work → abort on destroy`.

No usarlo de forma que signals/listeners de larga vida queden retenidos innecesariamente.

### Práctica asíncrona ejecutada

Resultado:
```text
PASS abortable old work stopped and cannot overwrite new intent
PASS non-abortable stale work discarded by ownership revision
RESULT 2/2 async ownership checks passed
```

Esto fija una regla:
**Abort detiene trabajo; revision/ticket protege ownership del resultado.**

### Marcador R02

`MOTOR_RUNTIME_SCHEDULING_LIFECYCLE_RESILIENCE_STUDIED_R02`

Sigo sin declarar certificación externa ni modificación de producto.


---

## Ampliación de aprendizaje · R03 · memoria, seguridad y ownership

### Memoria

El GC no sustituye un lifecycle explícito.

`WeakRef` y `FinalizationRegistry` no se usarán para cleanup crítico.
Workers, audio, GPU, observers, listeners y canales necesitan owner y cierre determinista.

### Resource management

`DisposableStack` / `Symbol.dispose` expresan un modelo útil de ownership, pero a 30/09/2026 siguen sin ser Baseline.

Aplicaré el patrón de adquisición/registro/dispose sin convertir esas APIs en requisito público.

### AbortSignal

Práctica ejecutada:

```text
PASS listener lifecycle via AbortSignal
PASS combined cancellation via AbortSignal.any
RESULT 2/2 cleanup checks passed
```

Nueva preferencia:
un controller por lifecycle/operación cuando simplifique cleanup y cancelación.

`AbortSignal.timeout()` cuenta active time y se pausa en bfcache/suspensión; no es reloj civil.

### Storage

Storage de navegador es best-effort por defecto y puede ser expulsado.

Consecuencia:
IndexedDB/OPFS nunca deben presentarse como permanencia garantizada.

### Cross-origin isolation

Estado de `_headers` leído:
- COOP same-origin;
- sin COEP.

Por tanto no asumir cross-origin isolation.
No añadir COEP solo para acceder a métricas/memoria: puede bloquear recursos externos y exige revisión de arquitectura.

### Lifecycle audit

`tools/escenas-3d/src/index.js` es buen patrón de stop/dispose.

`assets/ig-taller-r42-direct.js` no expone destroy explícito. Es aceptable mientras su lifecycle sea el documento; sería deuda si pasa a montaje/desmontaje dinámico.

### Runtime security

En `assets/runtime/8fe7df74405f3c55.js` observé:
- 2 `new Function`;
- sinks `innerHTML`;
- DOMParser HTML.

La CSP actual mantiene `unsafe-eval`.

No afirmo vulnerabilidad explotable solo por esos patrones.
Sí existe una superficie dinámica que una futura hardening debe reducir y probar.

### Trusted Types

Trusted Types aparece como Baseline 2026.

El Sanitizer API seguro todavía no es Baseline.

Ruta profesional:
inventario → provenance → precompilación/eliminación de dynamic code → política TT → pruebas → posible retirada de unsafe-eval.

### Marcador

`MOTOR_RUNTIME_MEMORY_SECURITY_RESOURCE_OWNERSHIP_STUDIED_R03`

Sin cambios funcionales ni headers.


---

## Ampliación de aprendizaje · R04 · input humano

### Keyboard / IME

Regla:
- `key` para semántica de carácter/layout;
- `code` solo cuando la posición física sea parte de la tarea;
- `keyCode` no se usa en código nuevo.

Atajos que no deben intervenir durante composición deben respetar `isComposing`.

### beforeinput

No garantiza interceptar toda edición ni que todo evento sea cancelable.
IME, autocomplete, spellcheck y password managers requieren `input`/reconciliación adicional según componente.

### Pointer

`pointercancel` forma parte del contrato normal.
`touch-action:none` solo debe vivir en superficies que realmente necesitan apropiarse del gesto.

### Hallazgos QA futuros

1. Sabik Ctrl/Cmd+Enter sin `isComposing`.
2. Undo global del Taller no contempla composición si aparecen editores custom.
3. Juego R40 escucha flechas en `document` mientras play está activo: comprobar foco/scroll/tecnología de apoyo.

No se han declarado bugs sin ejecutar QA de entorno.

Marcador:
`MOTOR_HUMAN_INPUT_IME_PREFERENCES_STUDIED_R04`.

---

## Ampliación de aprendizaje · R05 · compatibilidad y failure injection

### Baseline

Baseline = señal de interoperabilidad, no PASS de producto.

No sustituye:
- a11y;
- performance;
- security;
- webviews;
- dispositivos antiguos;
- assistive technology.

### Storage

`ig-taller-local-data.js`:
- IndexedDB → MemoryBackend cuando no está disponible;
- persistent=false;
- QuotaExceededError → STORAGE_QUOTA.

Patrón positivo:
degradar sin fingir permanencia.

### Workers

`ig-taller-r42-platform.js`:
- rechaza pending en worker error;
- termina worker;
- permite fallback local para Life.

### WebGL

El runtime 3D tiene cleanup fuerte en stop, pero no se observaron listeners explícitos para pérdida/restauración espontánea de contexto.

Práctica futura:
inyectar `WEBGL_lose_context` antes de declarar resiliencia GPU completa.

### bfcache / resize

Test obligatorio futuro:
- restore sin duplicar listeners/workers/audio;
- resize storm sin loop de ResizeObserver.

### Reporting

Reporting API entra en Baseline 2026.
Motor puede hacer runtime reportable; Vigía conserva observabilidad/privacidad/evidencia.

Marcador:
`MOTOR_COMPATIBILITY_FAILURE_INJECTION_STUDIED_R05`.


---

## Ampliación de aprendizaje · R06 · determinismo, replay y relojes

### Tiempo

`performance.now()` es el reloj monotónico de referencia para medición/simulación en navegador.

No usar `Date.now()` para física/frame timing.

### Simulación

Separar:
- lógica;
- render;
- efectos;
- reloj.

Fixed timestep cuando importa reproducibilidad.
Variable timestep cuando basta animación visual.

Proteger contra spiral of death con:
- max delta;
- max catch-up steps;
- background policy.

### Determinismo/replay

Para reproducir:
```
engineVersion
initialState
seed
inputs
ticks/timestamps
capabilities
locale
```

No registrar más datos de los necesarios.

### Undo

Elegir snapshots vs commands/diffs según tamaño y semántica.

No guardar un snapshot enorme por cada `pointermove`.

### Transferables

Transferir un recurso cambia ownership.
El sender puede quedar con buffer detached.

### Media clocks

- vídeo: `requestVideoFrameCallback()`;
- audio: `AudioContext.currentTime` + `getOutputTimestamp()`;
- UI: rAF / performance clock.

No forzar un reloj único para todos.

Marcador:
`MOTOR_DETERMINISM_REPLAY_MEDIA_CLOCKS_STUDIED_R06`.

---

## Ampliación de aprendizaje · R07 · main thread y soak

### Background

rAF y timers pueden pausarse/throttlearse ocultos.

Cada motor define:
- pause;
- logical continue;
- suspend resource;
- reconcile on return.

### Scheduling

`navigator.scheduling.isInputPending()` figura deprecated.

No se añade a código nuevo.

Scheduler moderno:
- útil;
- todavía limitado;
- necesita fallback.

### Presupuesto

No asumir 16.67 ms universal.

120/144 Hz dejan menos tiempo de frame.

### Worker pool

`hardwareConcurrency` es heurística, no orden de crear N workers.

### Audio

AudioContext debe iniciar/resumir desde user activation cuando la política lo exige.

### Soak

Pruebas prolongadas deben detectar:
- listeners;
- memory drift;
- timers;
- workers;
- GPU;
- audio;
- pending work.

Marcador:
`MOTOR_MAIN_THREAD_SOAK_ADAPTIVE_RUNTIME_STUDIED_R07`.

---

## Ampliación de aprendizaje · R08 · componentes y foco

### Custom Elements

Lifecycle:
- connected;
- disconnected;
- adopted;
- attribute changed;
- state-preserving move cuando aplica.

Mount/unmount debe ser idempotente.

### Shadow DOM

Encapsula, pero añade complejidad de:
- focus;
- event retargeting;
- testing;
- styling/a11y.

No usar por estética arquitectónica.

### ElementInternals

Permite que controles custom participen mejor en formularios y accesibilidad.

### Dialog / inert / Popover

Preferir primitivas nativas:
- modal → `<dialog>.showModal()`;
- contenido realmente desactivado → `inert`;
- overlay ligero → Popover API cuando encaja.

Popover API = Baseline 2025 newly available.

Regla:
**runtime sofisticado no justifica reinventar comportamiento que HTML ya resuelve.**

Marcador:
`MOTOR_COMPONENT_LIFECYCLE_FOCUS_TOP_LAYER_STUDIED_R08`.


---

## Ampliación de aprendizaje · R09 · streaming y backpressure

### Backpressure

Un runtime puede degradarse por producir más rápido de lo que consume.

Streams API aporta control de flujo; WebSocket clásico no aporta backpressure automática de recepción.

### Queues

Toda cola de alta frecuencia necesita política:
- latest-wins;
- coalesce;
- drop-oldest;
- block producer;
- reject.

La política depende de semántica.

### Streaming UI

No renderizar cada chunk/tokén individual si eso satura DOM/main thread.
Agrupar actualizaciones conservando orden y semántica.

### cancel vs close

- cancel = consumidor ya no quiere más;
- close = productor terminó limpiamente.

### WebSocket

Vigilar `readyState` y `bufferedAmount`; no enviar ilimitadamente.

### WebSocketStream

Tiene backpressure mediante Streams, pero a 01/10/2026 sigue experimental/no estándar y no es baseline para Iris Green.

### Frontera

Pulso conserva transporte conversacional.
Motor estudia scheduling, render y control de flujo.

Marcador:
`MOTOR_STREAMING_BACKPRESSURE_INCREMENTAL_RUNTIME_STUDIED_R09`.
