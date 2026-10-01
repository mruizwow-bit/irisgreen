# APRENDIZAJE_MOTOR_2026-10-01

## Contexto

Se produjo una interrupción de conexión de la interfaz de ChatGPT mientras Motor continuaba la jornada de Formación.

La continuidad se recuperó desde GitHub, no desde memoria del chat.

## Fuente canónica recuperada

Repositorio:
`mruizwow-bit/irisgreen`

Rama:
`formacion/a5-motor-runtime-r01-20260930`

Base de Formación Aura:
`41a01a5534161da5e4b412dd0c6af424e836a53c`

Al recuperar estado tras el corte:
- rama 34 commits ahead de la base;
- 0 detrás en la comparación observada;
- 31 archivos de Formación A5 registrados antes de reanudar.

Hallazgo importante:
la UI se había quedado mostrando actividad alrededor de R23/R24, pero GitHub ya conservaba también R24–R27.

## Formación recuperada tras el corte

Confirmados en GitHub:
- R24 · GC pressure, hot loops y resource reuse;
- R25 · Energy, long sessions y adaptive quality;
- R26 · WebGL pipeline, color y GPU profiling;
- R27 · Progressive enhancement y resilient HTML.

No reconstruir estos bloques desde conversación.

## Formación añadida después de recuperar

### R28 · Worker IPC, MessagePort y backpressure

Estudiado:
- structured clone;
- transferables;
- MessageChannel/MessagePort;
- postMessage ownership;
- Streams/backpressure;
- sequence/request IDs;
- cancellation protocol;
- worker queue growth.

Práctica:
- naive producer/consumer → queue max 900;
- latest-state coalescing → max pending 1;
- credit window → max inflight 4.

Resultado:
`3/3 PASS`.

Marcador:
`MOTOR_WORKER_IPC_BACKPRESSURE_STUDIED_R28`

### R29 · Gamepad, Pointer Lock, Fullscreen y Orientation

Estudiado:
- Gamepad polling y lifecycle;
- deadzones;
- button edges;
- disconnect;
- haptics limitations;
- Pointer Lock;
- raw movement;
- Fullscreen activation/policy;
- orientation lock limitations;
- focus/permissions.

Práctica deadzone:
`4/4 PASS`.

Marcador:
`MOTOR_GAMEPAD_IMMERSIVE_INPUT_STUDIED_R29`

## Continuidad aprendida

Regla confirmada por incidente real:

`CHAT/CONNECTION LOSS ≠ KNOWLEDGE LOSS`

si:
- cada aprendizaje material se persiste;
- la rama queda identificada;
- el siguiente chat lee GitHub antes de reconstruir;
- no se depende de la lista visual de acciones de la UI como fuente de verdad.

## Error de documentación ocurrido

Durante R29 un carácter de marcado causó SyntaxError en el script que construía el texto para GitHub.

Impacto:
- 0 producto;
- 0 pérdida de investigación;
- 0 cambio funcional;
- solo falló el primer intento de crear el documento.

Corrección:
- se reconstruyó el contenido de la nota como lista de líneas;
- commit posterior correcto.

Aprendizaje:
separar claramente errores de la herramienta de documentación de errores del runtime estudiado.

## Estado de jornada

Continúa Formación.

No realizado:
- build de producto;
- merge;
- deploy;
- main;
- producción;
- feature nueva.

## Siguiente línea de estudio

Continuar desde R29, no desde R23.

Candidatos inmediatos de especialización:
1. media decoding/capabilities y frame pipelines;
2. workers/messages con cancellation protocol más avanzado;
3. Canvas text/font metrics e internacionalización visual;
4. input latency en editors under load;
5. browser lifecycle/mobile interruptions;
6. testing de degradación por capability matrix.

## Primeros 10 minutos del siguiente Motor

1. leer este archivo;
2. confirmar rama;
3. listar A5_MOTOR;
4. comprobar último bloque R29;
5. leer solo el bloque siguiente que vaya a ampliar;
6. no repetir R01–R29;
7. mantener 0 producto mientras siga la Jornada de Formación.

## Formación añadida después de R29

### R30 · Media capabilities, decoding y frame pipelines

Estudiado:
- MediaCapabilities;
- `decodingInfo()` / `encodingInfo()`;
- `supported / smooth / powerEfficient`;
- WebCodecs como capa de bajo nivel;
- `VideoFrame` lifecycle;
- `encodeQueueSize / decodeQueueSize`;
- frame drop policy;
- backpressure de media.

Aprendizaje central:
**soportado no significa fluido ni eficiente**.

Para playback normal:
HTMLMediaElement primero.
WebCodecs solo cuando se necesita control frame-level.

Marcador:
`MOTOR_MEDIA_CAPABILITIES_FRAME_PIPELINES_STUDIED_R30`.

### R31 · Editores, IME y teclado virtual

Estudiado:
- contenteditable;
- `beforeinput`;
- `getTargetRanges()`;
- `inputType`;
- selección/caret;
- IME;
- EditContext API;
- VirtualKeyboard API;
- autosave bajo carga;
- undo ownership.

Estado:
- EditContext: experimental / limited;
- VirtualKeyboard: experimental / limited.

Regla:
**textarea/input/contenteditable siguen siendo la base preferida salvo necesidad real de editor custom.**

Marcador:
`MOTOR_EDITOR_IME_VIRTUAL_KEYBOARD_STUDIED_R31`.

## Continuidad actualizada

Último bloque completado:
**R31**.

Siguiente Motor:
1. continuar desde R31;
2. no repetir R01–R31;
3. revisar GitHub por state drift antes de crear R32;
4. mantener jornada de Formación sin producto.


## Formación añadida después de R31

### R32 · Mobile lifecycle, suspensión y restauración

Estudiado:
- visibilitychange;
- pagehide/pageshow;
- beforeunload/unload;
- bfcache;
- VisualViewport;
- deviceMemory;
- Network Information;
- Save-Data;
- Wake Lock;
- app-kill móvil.

Hallazgo:
`pagehide` no es garantía final en móvil.
`visibilitychange → hidden` es una señal más fiable para checkpoint/suspensión.

Auditoría:
- Sabik usa pagehide para cancelar/disconnect;
- Taller usa beforeunload para dirty warning;
- 3D evita update cuando document.hidden y clampa dt al volver.

Marcador:
`MOTOR_MOBILE_LIFECYCLE_SUSPEND_RESTORE_STUDIED_R32`.

### R33 · Capability matrix y degradación

Estudiado:
- @supports/CSS.supports;
- HTMLScriptElement.supports;
- static vs operational capability;
- Playwright projects;
- browser/device emulation;
- addInitScript browser API mocks;
- absent/failure injection.

Regla:
**feature detection sin test del fallback no basta.**

Observación:
R22 evidence estudiada usa Chromium explícitamente; no se extrapola a Firefox/WebKit.

Marcador:
`MOTOR_CAPABILITY_MATRIX_DEGRADATION_TESTING_STUDIED_R33`.

### R34 · Network recovery y Service Workers

Estudiado:
- navigator.onLine limitations;
- online/offline events;
- fetch error taxonomy;
- retry/backoff;
- offline queues;
- Service Worker install/wait/activate;
- skipWaiting/clients.claim;
- cache versioning/strategies.

Auditoría:
- no serviceWorker actual en repo;
- no navigator.onLine actual.

Regla:
**onLine es hint, no prueba de Internet.**

Marcador:
`MOTOR_NETWORK_RECOVERY_SERVICE_WORKER_STUDIED_R34`.

### R35 · Navigation y View Transitions

Estudiado:
- Document.startViewTransition Baseline 2025;
- ready/finished;
- types Baseline 2026;
- Navigation API pieces Baseline 2026;
- intercept/canIntercept;
- focus/scroll/history;
- bfcache interaction.

Auditoría:
A5 transition actual conserva update funcional cuando API falta o reduced motion está activo.

Marcador:
`MOTOR_NAVIGATION_VIEW_TRANSITIONS_STUDIED_R35`.

### R36 · Prerender y startup seguro

Estudiado:
- Speculation Rules;
- prefetch vs prerender;
- document.prerendering;
- prerenderingchange;
- activationStart;
- startup tiers;
- speculative side effects;
- CSP.

Regla:
**script executing ≠ user viewing.**

No iniciar efectos sensibles solo por mount/DOMContentLoaded si la arquitectura puede prerenderizar.

Marcador:
`MOTOR_PRERENDER_SPECULATIVE_STARTUP_STUDIED_R36`.

### R37 · Cross-origin messaging y sandbox

Estudiado:
- Window.postMessage;
- targetOrigin;
- origin/source validation;
- protocol schemas;
- MessageChannel/MessagePort;
- transfer ownership;
- iframe sandbox;
- opaque origins;
- confused deputy.

Auditoría:
no se encontraron usos actuales de postMessage en repo.

Regla:
**cross-origin message = untrusted input hasta validar origin/source/schema/state.**

Marcador:
`MOTOR_CROSS_ORIGIN_MESSAGING_SANDBOX_STUDIED_R37`.

## Continuidad actualizada · 01/10/2026

Último bloque:
**R37**.

Antes de R38:
1. leer este aprendizaje;
2. listar carpeta A5_MOTOR;
3. comprobar state drift;
4. no repetir R01–R37;
5. abrir solo un hueco material;
6. mantener 0 producto mientras continúe Formación.


### R38 · File I/O, Drag & Drop y Clipboard

Estudiado:
- File / Blob;
- Blob.text() vs FileReader;
- límites de tamaño;
- validación de esquema;
- object URLs;
- HTML Drag & Drop;
- DataTransfer;
- getAsFile / getAsFileSystemHandle;
- Clipboard API;
- import atómico;
- alternativa accesible al drag.

Auditoría A5:
- Taller ya limita tamaño antes de leer;
- valida JSON/formato/estudio;
- File System Access es mejora progresiva;
- AbortError del picker se trata como cancelación;
- no hay dropzone actual que mantener.

Regla:
**archivo local = input no confiable hasta validar contenido y esquema; accept solo orienta el selector.**

Marcador:
`MOTOR_FILE_IO_DRAG_DROP_CLIPBOARD_STUDIED_R38`.

## Continuidad actualizada

Último bloque completado:
**R38**.

Estado:
`ACTIVE_CONTINUOUS_LEARNING`.

La formación NO está cerrada mientras María siga indicando continuar.

Antes del siguiente bloque:
1. comprobar state drift;
2. leer aprendizaje 2026-10-01;
3. no repetir R01–R38;
4. abrir solo hueco material;
5. mantener 0 producto/build/merge/deploy.


### R39 · Sensores y Motion Actuation

Estudiado:
- DeviceOrientationEvent;
- DeviceMotionEvent;
- requestPermission;
- Generic Sensor;
- deadzone/hysteresis;
- sensor lifecycle;
- privacy;
- screen orientation vs device orientation;
- WCAG 2.5.4 Motion Actuation.

Auditoría A5:
no se encontraron usos actuales de DeviceOrientation, DeviceMotion, Accelerometer ni Gyroscope.

Regla:
**sensor data no es intención humana hasta pasar por un contrato de interacción; toda función por movimiento necesita alternativa UI y capacidad de desactivarse cuando aplique.**

Marcador:
`MOTOR_SENSOR_MOTION_ACTUATION_STUDIED_R39`.

## Continuidad actualizada tras conexión Slack

Último bloque completado:
**R39**.

Estado:
`ACTIVE_CONTINUOUS_LEARNING`.

Motor ya está conectado a:
`#general-sabik-ia-technology`.

Aura fue informada de que la formación sigue activa y que el HEAD no debe tratarse como cierre final hasta nueva decisión de María.

Antes de R40:
1. comprobar state drift;
2. no repetir R01–R39;
3. abrir solo hueco material;
4. mantener Slack para coordinación y GitHub para evidencia;
5. mantener 0 producto/build/merge/deploy.
