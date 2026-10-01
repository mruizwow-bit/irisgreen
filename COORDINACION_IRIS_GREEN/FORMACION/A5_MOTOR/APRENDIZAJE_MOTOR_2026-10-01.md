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


### R40 · High-fidelity pointer input

Estudiado:
- Pointer Events Level 3 Recommendation 30/06/2026;
- boundary con Level 4 Working Draft;
- pointerrawupdate;
- getCoalescedEvents;
- getPredictedEvents;
- pen geometry;
- speculative rendering;
- input backpressure.

Práctica:
240 Hz input vs 60 Hz paint → modelo de batching 4:1.

Regla:
**predicted events sirven para preview especulativa, nunca como estado definitivo sin reconciliación.**

Marcador:
`MOTOR_HIGH_FIDELITY_POINTER_LATENCY_STUDIED_R40`.

### R41 · Canvas text y font loading

Estudiado:
- CSS Font Loading API;
- FontFaceSet;
- document.fonts;
- FontFaceSet.load/ready;
- measureText;
- TextMetrics;
- baselines;
- font failure;
- worker font loading.

Práctica aislada:
misma cadena a 48 px:
- font A ~635.94 px;
- font B ~509.38 px;
- diferencia ~19.9 %.

Regla:
**medir Canvas antes de la font real puede dejar geometría/hitboxes incorrectos.**

Marcador:
`MOTOR_CANVAS_TEXT_FONT_LOADING_STUDIED_R41`.

### R42 · SVG interactivo

Estudiado:
- SVG coordinate systems;
- getScreenCTM/getCTM;
- DOMMatrix inverse;
- getBBox;
- SVG pointer-events;
- focus;
- event delegation;
- zoom/pan;
- accessibility boundary.

Práctica:
matriz scale(2,1.5)+translate(100,50):
screen (300,200) → SVG (100,100) PASS.

Regla:
**convertir pointer mediante CTM inversa, no con ratio rect/viewBox simplista cuando hay transforms.**

Marcador:
`MOTOR_INTERACTIVE_SVG_COORDINATES_STUDIED_R42`.

### R43 · Image decode y bitmap ownership

Estudiado:
- HTMLImageElement.decode;
- decoding hint;
- createImageBitmap;
- Worker image preparation;
- ImageBitmap.close;
- bitmaprenderer ownership;
- decoded memory budget;
- tainted canvas;
- cache/backpressure.

Práctica:
- 4096×4096 RGBA8 ≈ 64 MiB;
- 10×1024×1024 RGBA8 ≈ 40 MiB.

Auditoría:
Worker R42 transfiere ImageBitmap y receiver lo cierra tras drawImage: patrón positivo.

Marcador:
`MOTOR_IMAGE_DECODE_BITMAP_OWNERSHIP_STUDIED_R43`.

### R44 · Scroll-driven runtime

Estudiado:
- Scroll-driven Animations;
- ScrollTimeline/ViewTimeline;
- CSS timeline syntax;
- reduced motion;
- rAF scroll fallback;
- layout thrash;
- sensory safety.

Práctica:
rango 100→500:
scroll 250 → progress 0.375 PASS.

Estado:
ScrollTimeline/ViewTimeline siguen Limited availability.

Marcador:
`MOTOR_SCROLL_DRIVEN_RUNTIME_STUDIED_R44`.

### R45 · Visual stability

Estudiado:
- CLS;
- session windows;
- LayoutShift API;
- attribution;
- font/image causes;
- focus/pointer stability;
- async UI geometry.

Práctica:
impact .25 × distance .10 → layout shift .025 PASS.

Regla:
**“no cuenta en CLS” no equivale a “buena UX”; foco y puntero también deben permanecer estables.**

Marcador:
`MOTOR_VISUAL_STABILITY_LAYOUT_SHIFT_STUDIED_R45`.

### R46 · Gestos multipunto y wheel

Estudiado:
- WCAG 2.5.1 Pointer Gestures;
- pinch;
- multi-pointer lifecycle;
- center-preserving zoom;
- WheelEvent;
- deltaMode;
- trackpad/browser zoom boundary;
- inertia.

Práctica:
- distancia 100→150 = scale 1.5;
- center (150,100)→(165,90) = pan (+15,-10).

Regla:
**pinch/rotate/swipe requieren alternativa de simple pointer cuando el gesto no es esencial.**

Marcador:
`MOTOR_MULTIPOINT_GESTURES_WHEEL_STUDIED_R46`.

## Continuidad actualizada

Último bloque completado:
**R46**.

Estado:
`ACTIVE_CONTINUOUS_LEARNING`.

Antes de R47:
1. comprobar state drift;
2. no repetir R01–R46;
3. abrir solo hueco material;
4. Slack para coordinación; GitHub para evidencia;
5. 0 producto/build/merge/deploy mientras siga Formación.


### R47 · CSS containment y content-visibility

Estudiado:
- CSS Containment;
- content-visibility:auto;
- contain-intrinsic-size;
- focus/AT implications;
- virtualization boundary.

Práctica Chromium:
contenido offscreen bajo content-visibility:auto siguió siendo focalizable y el navegador lo llevó a vista.

Marcador:
`MOTOR_CSS_CONTAINMENT_CONTENT_VISIBILITY_STUDIED_R47`.

### R48 · Runtime review profesional

Revisión real sobre 7 archivos A5.

Clasificación:
- strengths;
- QA candidates;
- architectural conditions;
- no convertir observación en bug.

Resultado:
fortalezas confirmadas y próximos tests definidos.

Marcador:
`MOTOR_RUNTIME_REVIEW_EVIDENCE_CLASSIFICATION_R48`.

### R49 · WebGL context loss lab

Laboratorio WebGL2 Chromium/SwiftShader:
- lost;
- restored;
- old resource invalid;
- fresh resource valid;
- API healthy after restore.

Resultado:
**6/6 PASS**.

Marcador:
`MOTOR_WEBGL_CONTEXT_LOSS_RECOVERY_LAB_PASS_R49`.

### R50 · Synthetic input contracts

Laboratorio aislado Chromium:

Sabik-like handler:
- `isComposing=true`;
- Ctrl+Enter;
- requestSubmit ejecutado.

Game-like global arrow handler:
- focus fuera;
- ArrowDown;
- movement logic ejecutada;
- no se demostró scroll conflict.

Resultado:
evidencia sintética, no bug integrado.

Marcador:
`MOTOR_SYNTHETIC_INPUT_CONTRACT_LAB_PASS_R50`.

### R51 · WebGL recovery repetido

Cinco ciclos consecutivos:
- lost/restored 5/5;
- old buffer invalid 5/5;
- fresh buffer valid 5/5;
- getError=0 5/5.

Marcador:
`MOTOR_WEBGL_REPEATED_CONTEXT_RECOVERY_LAB_PASS_R51`.

### R52 · Observer/listener lifecycle

Laboratorio Chromium:
- MutationObserver siguió tras detach mientras node seguía vivo;
- listener siguió tras detach;
- reattach siguió activo;
- disconnect/AbortSignal detuvieron callbacks.

Resultado:
**4/4 PASS**.

No se afirma memory leak current.

Marcador:
`MOTOR_OBSERVER_LISTENER_LIFECYCLE_LAB_PASS_R52`.

### R53 · Cross-browser evidence boundary

Inventario del entorno:
- Chromium disponible;
- Firefox no;
- WebKit no;
- Playwright browser cache vacío.

Regla:
**Chromium lab PASS != cross-browser PASS.**

Marcador:
`MOTOR_CROSS_BROWSER_EVIDENCE_BOUNDARY_REVIEWED_R53`.

## Continuidad actualizada

Último bloque completado:
**R53**.

Estado:
`ACTIVE_CONTINUOUS_LEARNING`.

Evidencia reciente debe etiquetarse por nivel:
- UNIT_PASS;
- SYNTHETIC_BROWSER_PASS;
- CHROMIUM_LAB_PASS;
- ENGINE_MATRIX_PASS;
- REAL_DEVICE_PASS;
- INTEGRATION_PASS;
- HUMAN_QA_PASS.

Antes de R54:
1. comprobar state drift;
2. no repetir R01–R53;
3. abrir solo hueco material;
4. mantener límites de evidencia;
5. Slack para coordinación; GitHub para canon;
6. 0 producto/build/merge/deploy durante Formación.


### R54 · Canvas2D state/readback

Laboratorio Chromium:
- context attributes quedan fijados en primera adquisición;
- default willReadFrequently=false;
- configured willReadFrequently=true;
- alpha=false verificado;
- reset() restauró globalAlpha=1 y limpió buffer;
- Path2D disponible.

Regla:
**willReadFrequently es workload-specific; no una optimización universal.**

Marcador:
`MOTOR_CANVAS2D_STATE_READBACK_LAB_PASS_R54`.

### R55 · Input latency bajo carga

Laboratorio Chromium:
- 80 ms sync work dentro de input → next paint median ~80.3 ms;
- ~80 ms CPU en Worker → main next-paint median ~0.4 ms;
- Worker CPU siguió costando ~80 ms.

Regla:
**off-thread no hace compute más barato; lo saca del camino crítico del main thread.**

Marcador:
`MOTOR_INPUT_LATENCY_OFFTHREAD_LAB_PASS_R55`.

### R56 · Maturity/scope gap review

Conclusión:
R01–R55 cubren foundation horizontal avanzada.

Nueva fase:
`SCENARIO → DECISION → PRACTICE → EVIDENCE → REVIEW`.

Remaining gaps reales:
- engine matrix;
- real IME/mobile;
- hardware GPU;
- integrated context recovery;
- AT;
- product soak/field evidence.

Marcador:
`MOTOR_ADVANCED_FOUNDATION_GAP_REVIEW_R56`.

### R57 · Architecture decision drills

10 escenarios resueltos:
- mapa;
- pixel editor;
- simulation;
- aquarium;
- Sabik;
- sequencer;
- resource page;
- file projects;
- architecture 2D/3D;
- heavy live preview.

Resultado:
**10/10 decision drills PASS**.

Marcador:
`MOTOR_ARCHITECTURE_DECISION_DRILLS_PASS_R57`.

### R58 · Incident diagnosis drills

12 incidentes:
- editor lag;
- black 3D restore;
- stale Sabik response;
- bad file import;
- mobile keyboard;
- audio drift;
- multitab conflict;
- battery;
- focus after modal;
- progressive canvas slowdown;
- layout jump;
- Chrome/Safari mismatch.

Cada uno:
- evidence;
- hypotheses;
- discriminating test;
- containment;
- owner.

Resultado:
**12/12 diagnosis drills PASS**.

Marcador:
`MOTOR_INCIDENT_DIAGNOSIS_DRILLS_PASS_R58`.

## Continuidad actualizada

Último bloque:
**R58**.

Estado:
`ADVANCED_FOUNDATION_ACTIVE_CONTINUOUS_LEARNING`.

Siguiente fase:
- continuar prácticas/escenarios;
- no ampliar APIs horizontalmente salvo laguna material;
- elevar niveles de evidencia cuando entorno lo permita.

Límites aún abiertos:
- Firefox/WebKit;
- real IME;
- mobile hardware;
- assistive technology;
- integrated product QA;
- HUMAN QA.

Slack:
Motor conectado al canal general.
GitHub:
fuente canónica.

No product/build/merge/deploy durante Formación.
