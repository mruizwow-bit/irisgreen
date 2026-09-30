# LUMEN · FIABILIDAD, RENDIMIENTO Y RECUPERACIÓN R03

Fecha: 30/09/2026
Agente: A7
Puesto: Immersive Media & Interactive Audiovisual Engineer
Estado: ADVANCED_STUDY_R03_RELIABILITY_PERFORMANCE

## 1 · Principio
Una experiencia inmersiva no está terminada porque arranque bien.

Debe comportarse correctamente cuando:
- la GPU pierde contexto o dispositivo;
- una pestaña pasa a background;
- el navegador interrumpe audio;
- el dispositivo tiene menor capacidad;
- un frame se alarga;
- una API moderna no existe;
- la red es limitada;
- el usuario cambia de modo muchas veces;
- la sesión dura decenas de minutos.

Fiabilidad significa degradar, recuperar o parar de forma controlada sin dejar una pantalla vacía, recursos huérfanos o controles bloqueados.

## 2 · WebGPU · device loss y errores

Fuentes:
- W3C WebGPU
  https://www.w3.org/TR/webgpu/
- MDN GPUDevice.lost
  https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/lost
- MDN GPUShaderModule.getCompilationInfo
  https://developer.mozilla.org/en-US/docs/Web/API/GPUShaderModule/getCompilationInfo
- MDN GPUDevice.pushErrorScope / popErrorScope / uncapturederror

Aprendizaje:
- WebGPU valida muchas operaciones de forma asíncrona;
- un device puede perderse incluso tras una solicitud válida;
- `device.lost` es una Promise de lifecycle, no un log decorativo;
- shader compilation info permite revisar mensajes de compilación;
- los error scopes sirven para capturar errores conocidos;
- `uncapturederror` es red de seguridad, no sustituto de manejo explícito.

Regla Lumen:
si Tier A pierde el GPUDevice durante una sesión, el motor debe tener una política explícita:
1. detener el loop afectado;
2. preservar el estado lógico que sea seguro preservar;
3. liberar recursos inválidos;
4. reintentar una sola vez solo si tiene sentido;
5. si no, bajar a Tier B/C/D;
6. comunicar al controlador el cambio de tier;
7. no dejar canvas congelado o negro.

## 3 · Hallazgo en Respirar

Código observado:
`assets/rincon-r46-breath.js`.

El Tier A:
- solicita adapter low-power;
- crea GPUDevice;
- escucha `dev.lost`;
- marca un booleano `lost=true`;
- `draw()` deja de dibujar si se perdió el device.

No observé una transición runtime automática del Tier A al B/C/D después de una pérdida durante la sesión.

Esto NO se corrige durante Formación.
Se registra como:
`RELIABILITY_GAP_CANDIDATE_WEBGPU_RUNTIME_LOSS`.

Práctica futura:
forzar pérdida/destrucción controlada y comprobar si la UX queda congelada; diseñar fallback dinámico si el hallazgo se confirma en runtime real.

## 4 · WebGL · context loss / restore

Fuentes:
- MDN webglcontextlost
- MDN webglcontextrestored
- MDN WEBGL_lose_context
- MDN WebGL best practices

Aprendizaje:
- WebGL context loss es una condición real;
- al restaurarse, buffers, texturas y otros recursos anteriores ya no son válidos;
- el estado gráfico debe reinicializarse;
- WEBGL_lose_context permite simular pérdida/restauración para QA;
- liberar objetos de forma temprana y controlar presupuesto de VRAM son buenas prácticas.

Hallazgo en código observado:
- el runtime usa `WEBGL_lose_context` al destruir voluntariamente;
- no observé listeners explícitos de `webglcontextlost` / `webglcontextrestored` en los módulos revisados.

Estado:
`RELIABILITY_GAP_CANDIDATE_WEBGL_CONTEXT_LOSS`.

No se declara bug hasta reproducirlo/priorizarlo en ejecución real.

## 5 · Page Visibility y background

Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

La Page Visibility API es ampliamente disponible.

Aplicación:
- detener trabajo continuo cuando el documento está hidden;
- no quemar GPU/CPU en background;
- conservar si la sesión estaba activa;
- decidir cuidadosamente si se reanuda automáticamente.

Código vivo:
- Respirar pausa al ocultarse y reanuda solo si fue auto-pausado;
- Salas detiene rAF al ocultarse y lo recupera cuando vuelve visible;
- el controlador también detiene recursos en pagehide.

Lección:
esto es una buena base de lifecycle y debe conservarse en futuras reconstrucciones.

## 6 · AudioContext lifecycle e interrupciones

Fuentes:
- MDN AudioContext.suspend()
- MDN AudioContext.resume()
- MDN BaseAudioContext.state

Aprendizaje:
- `suspend()` detiene progresión del contexto y puede reducir CPU/batería/acceso a hardware;
- `resume()` reactiva;
- además de running/suspended/closed puede existir estado interrupted en plataformas que lo exponen;
- interrupciones externas como llamadas o cambios de hardware deben considerarse.

Código observado:
`assets/rincon-audio-r42.js`
- crea un AudioContext reutilizable;
- reanuda si está suspended;
- no observé una política global de `suspend()` cuando ya no hay ningún sonido activo.

Estado:
`RESOURCE_EFFICIENCY_REVIEW_CANDIDATE_AUDIO_CONTEXT_IDLE`.

No se presupone que mantener el contexto sea incorrecto; se debe perfilar y probar consumo/lifecycle antes de cambiarlo.

## 7 · Frame pacing y main-thread responsiveness

Fuentes:
- W3C Long Animation Frames API · FPWD 28/04/2026
  https://www.w3.org/TR/long-animation-frames/
- W3C Event Timing API · WD 19/03/2026
  https://www.w3.org/TR/event-timing/
- W3C Web Performance 2026 charter

Aprendizaje:
- un frame largo puede estar formado por varias tareas menores y aun así producir jank;
- LoAF observa el frame completo y puede aportar atribución de scripts;
- Event Timing estudia latencia de eventos de interacción;
- LoAF sigue experimental/limited availability;
- el charter 2026 indica que Long Tasks será retirado del WG por implementación limitada y el trabajo evoluciona.

Regla:
- no hacer de Long Tasks ni LoAF un requisito universal;
- feature-detect;
- usar LoAF como diagnóstico cuando exista;
- conservar medición propia de frame-time y prueba humana;
- no introducir telemetría conductual solo por medir rendimiento.

## 8 · requestVideoFrameCallback

Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback

Estado:
Baseline 2024 en navegadores actuales, pero pueden existir dispositivos/navegadores antiguos.

Uso correcto:
- readiness de vídeo local;
- sincronización de procesamiento con frames reales;
- análisis/frame processing cuando exista necesidad.

No usar:
- para controlar un iframe de YouTube al que no se tiene acceso al elemento video interno;
- como sustituto de player events;
- si no aporta valor.

Fallback:
eventos HTML media / timeupdate / loadeddata según necesidad.

## 9 · Media Capabilities

Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/MediaCapabilities/decodingInfo

`decodingInfo()` permite consultar:
- supported;
- smooth;
- powerEfficient.

Regla:
si Iris Green aloja múltiples encodes locales, usar información de capacidad para escoger, cuando esté disponible.

No interpretar:
- smooth=true como garantía absoluta;
- powerEfficient=true como medición de batería real;
- ausencia de API como incapacidad.

## 10 · OffscreenCanvas y Workers

Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/transferControlToOffscreen

OffscreenCanvas puede mover trabajo de dibujo a un Worker y transferControlToOffscreen está ampliamente disponible en navegadores modernos.

Regla Lumen:
NO mover rendering a Worker por moda.

Solo si:
1. profiling muestra bloqueo relevante del main thread;
2. la arquitectura puede aislar rendering sin complicar accesibilidad/control;
3. hay fallback;
4. lifecycle del worker queda definido;
5. la mejora es medible.

## 11 · Save-Data / Network Information

Fuentes:
- MDN NetworkInformation.saveData
- MDN Navigator.connection
- Save-Data header

Hallazgo:
estas señales tienen disponibilidad limitada.

Regla:
- si saveData=true, respetarlo;
- si la API no existe, NO concluir que la persona acepta alto consumo;
- la ausencia de señal es desconocimiento, no permiso;
- mantener carga bajo acción explícita como baseline de producto;
- ofrecer fallback/poster independientemente de Network Information API.

## 12 · WebGPU powerPreference

Fuente:
W3C WebGPU / MDN GPU.requestAdapter.

`powerPreference: "low-power"` es una pista.
No garantiza GPU concreta ni consumo.

El agente de usuario puede escoger otra opción por:
- batería;
- pantallas;
- configuración del sistema;
- hardware;
- política del navegador.

Regla:
medir resultado, no convertir la hint en claim de eficiencia.

## 13 · Compatibilidad no equivale a calidad

MDN Baseline ayuda a saber disponibilidad transversal, pero no sustituye:
- accesibilidad;
- rendimiento;
- hardware antiguo;
- WebViews;
- tecnologías de apoyo;
- QA perceptiva.

Aplicación:
una API “widely available” sigue necesitando pruebas del producto.

## 14 · Práctica R03 · GPU loss

### WebGL
1. arrancar sala;
2. obtener extensión WEBGL_lose_context en build de prueba;
3. loseContext();
4. comprobar UX;
5. restoreContext();
6. comprobar reinicialización;
7. repetir;
8. observar fugas/estado.

PASS futuro:
no crash, no loop, no pantalla indefinidamente negra; fallback o recuperación documentada.

### WebGPU
1. arrancar Respirar en Tier A;
2. provocar device loss controlado en harness/test;
3. verificar que controller recibe señal;
4. verificar stop;
5. bajar de tier;
6. conservar controles;
7. registrar motivo técnico sin exponer detalles innecesarios.

## 15 · Práctica R03 · jank

Inyectar carga controlada en QA:
- 60–120ms;
- interacción simultánea con Pausa/Parar;
- observar respuesta;
- medir frame-time;
- recoger LoAF solo si soportado.

PASS:
los controles no quedan atrapados por una carga gráfica sostenida.

## 16 · Práctica R03 · audio lifecycle

Casos:
- sonido → parar;
- sonido → cambiar modo;
- sonido → background;
- sonido → interrupción externa;
- volver;
- 30 ciclos start/stop.

Medir:
- AudioContext.state;
- nodos vivos;
- fuentes vivas;
- CPU aproximada;
- duplicación;
- clicks/pops.

Decidir después si suspender el contexto global en idle aporta beneficio sin degradar UX.

## 17 · Práctica R03 · red/datos

Casos:
- saveData=true;
- API ausente;
- embed falla;
- red lenta;
- offline después de poster;
- cambio de modo antes de que el iframe esté ready.

PASS:
nunca se bloquea el resto del Rincón por una dependencia de red.

## 18 · Investigación de VIMS · método de evaluación

Literatura revisada:
- SSQ es ampliamente usado para simulator/cybersickness;
- VRSQ fue diseñado para síntomas VR y se centra en oculomotor + disorientation;
- trabajos recientes recuerdan limitaciones del SSQ en VR y su factor structure.

Regla de Lumen:
el Rincón web 2D/no-HMD NO adopta SSQ/VRSQ automáticamente como instrumento validado para su contexto.

Uso posible:
- vocabulario de síntomas para diseñar HUMAN QA voluntaria;
- eyestrain;
- dificultad de enfoque;
- mareo;
- dolor de cabeza;
- desorientación;
- náusea.

Si se convierte en estudio con personas:
definir protocolo con Dirección, Axioma y, si procede, revisión ética/profesional; no improvisar un “test clínico”.

Fuentes de estudio:
- revisión sistemática reciente de cybersickness;
- literatura SSQ/VRSQ accesible en PubMed Central.

## 19 · Hallazgos del código vivo en R03

Confirmados documentalmente en la rama web observada:
1. Respirar sí implementa Tier A WebGPU.
2. Salas observadas empiezan en WebGL2.
3. WebGPU de Respirar escucha device.lost pero no observé fallback dinámico posterior a una pérdida en sesión.
4. Los módulos WebGL observados no muestran manejo explícito de contextlost/restored.
5. Page Visibility sí está integrada en Breath/Rooms.
6. AudioContext se reutiliza y resume; no observé suspend global en idle.
7. Save-Data se usa como hard stop de paisaje, pero esa señal no está disponible en todos los navegadores.

Estos hallazgos son formación/evidencia.
No son cambios de producto.
No se les asigna severidad hasta reproducir y priorizar con Astra.

## 20 · Estado

Completado:
- estudio de recovery GPU;
- lifecycle de audio;
- background;
- frame pacing;
- APIs de performance;
- OffscreenCanvas;
- media frame callbacks;
- Media Capabilities;
- data saving;
- evaluación de VIMS;
- contraste con código vivo.

Pendiente:
- ejecutar harnesses reales;
- device QA;
- profiling;
- pruebas largas;
- HUMAN QA perceptiva.

Estado:
`ADVANCED_STUDY_R03_RELIABILITY_PERFORMANCE_PRACTICE_PENDING`.
