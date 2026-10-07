# LUMEN · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 30/09/2026
Agente: A7
Jefatura: Astra
Puesto profesional: Immersive Media & Interactive Audiovisual Engineer
Estado: LUMEN_IMMERSIVE_MEDIA_FOUNDATION_STUDIED_R01

## Regla de estudio

Prioridad de fuentes:
1. estándares y especificaciones oficiales;
2. organismos internacionales;
3. documentación oficial de plataforma/proveedor;
4. literatura académica y HCI;
5. documentación técnica reputada;
6. ejemplos profesionales, nunca como sustituto de lo anterior.

Distinguir siempre:
- estándar publicado;
- Candidate Recommendation / Working Draft;
- nota informativa;
- técnica de WCAG;
- objetivo interno de Iris Green;
- decisión de producto;
- capacidad realmente integrada.

No convertir un draft en obligación vigente.

---

## Bloque 1 · Arquitectura de inmersión web y progressive enhancement

Fuentes:
- W3C WebGPU · Candidate Recommendation Draft, 15/09/2026
  https://www.w3.org/TR/webgpu/
- W3C WGSL · Candidate Recommendation Draft, 21/09/2026
  https://www.w3.org/TR/WGSL/
- W3C WebXR Device API · Candidate Recommendation Draft, 09/06/2026
  https://www.w3.org/TR/webxr/

Dominar:
- diferencia entre API gráfica y experiencia de producto;
- detección de capacidades;
- pipeline gráfico;
- shaders;
- buffers/textures;
- límites y errores;
- pérdida de contexto;
- progressive enhancement;
- degradación A/B/C/D;
- cuándo NO usar WebGPU.

Regla Iris Green:
WebGPU puede ser Tier A, pero nunca un requisito para entrar al Rincón.
WebXR se estudia como tecnología adyacente/futura, no como gate del producto actual.

Prueba profesional:
si WebGPU no existe o falla, la persona sigue teniendo una experiencia completa mediante WebGL2, Canvas o estático.

---

## Bloque 2 · Gráficos en tiempo real y composición perceptiva

Dominar:
- sistema de coordenadas;
- matrices/view/projection;
- perspectiva;
- profundidad;
- capas;
- alpha/blending;
- luminancia y contraste;
- partículas;
- ruido procedural;
- caústicas;
- campos suaves;
- iluminación;
- continuidad espacial;
- composición en vertical y horizontal;
- estabilidad temporal.

Aplicación:
una “sala” no es un canvas grande.
Debe existir una composición que produzca sensación de espacio sin convertirla en cámara de juego.

Evitar:
- cámara nerviosa;
- parallax agresivo;
- flashes;
- cambios bruscos;
- high-frequency noise;
- densidad excesiva;
- movimiento que reclama atención;
- loops visuales cortos y reconocibles.

---

## Bloque 3 · Frame pacing, lifecycle GPU y rendimiento

Dominar:
- requestAnimationFrame;
- Page Visibility;
- pause/resume;
- frame time;
- FPS como señal parcial;
- long tasks;
- memory pressure;
- resolución efectiva;
- devicePixelRatio;
- calidad adaptativa;
- dispose de buffers/texturas;
- no mantener dos escenas GPU vivas sin necesidad;
- background suspension;
- thermal/power awareness.

Criterio:
“60 FPS” no es un objetivo universal.
La meta es movimiento estable acorde al estímulo diseñado, sin consumir más recursos de los necesarios.

Evidencia:
- frame-time representativo;
- degradaciones;
- tamaño de canvas;
- memoria aproximada cuando sea medible;
- recursos liberados al cambiar de modo;
- comportamiento background/foreground.

---

## Bloque 4 · HTML Media como baseline

Fuente:
- WHATWG HTML Living Standard · media
  https://html.spec.whatwg.org/multipage/media.html

Dominar:
- video/audio;
- source/track;
- poster;
- preload;
- loading;
- muted;
- controls;
- playsinline;
- reproducción explícita;
- estados ready;
- errores;
- pausa;
- finalización;
- tracks y alternativas.

Lección:
native video es baseline.
WebCodecs o procesamiento de frames solo entra si existe una necesidad concreta.

Regla:
nada de media de calma debe arrancar al entrar a la página.

---

## Bloque 5 · Selección adaptativa de media

Fuente:
- W3C Media Capabilities · Working Draft, 09/06/2026
  https://www.w3.org/TR/media-capabilities/

Dominar:
- decodingInfo;
- supported;
- smooth;
- powerEfficient;
- selección por capacidad real;
- no selección por user-agent string;
- resolución/bitrate;
- fallback de codec;
- Save-Data;
- conexiones limitadas.

Aplicación:
si existen varias fuentes locales, elegir la opción soportada y razonable para el dispositivo.
No descargar programas largos antes de una acción explícita.

---

## Bloque 6 · Sesiones multimedia largas

Fuente:
- W3C Media Session · Working Draft, 05/06/2026
  https://www.w3.org/TR/mediasession/

Estudiar:
- metadata;
- acciones play/pause;
- integración con controles de plataforma;
- media keys;
- lifecycle móvil;
- cuándo aporta valor y cuándo añade superficie innecesaria.

Aplicación potencial:
sesiones de 20–60 minutos.
No incorporar Media Session por moda; hacerlo solo si mejora control y continuidad.

---

## Bloque 7 · Web Audio e ingeniería de sonido interactivo

Fuentes:
- W3C Web Audio API · Recommendation, 17/06/2021
  https://www.w3.org/TR/webaudio/
- Web Audio API 1.1 · Working Draft, 22/09/2026
  https://www.w3.org/TR/webaudio-1.1/

Dominar:
- AudioContext;
- audio graph;
- GainNode;
- AudioBuffer;
- automation;
- ramps;
- fades;
- loops;
- filtros con propósito;
- AudioWorklet cuando sea necesario;
- PannerNode y spatial audio solo cuando aporten;
- mono/estéreo y accesibilidad;
- suspensión y cierre de contextos.

Reglas del Rincón:
- volumen inicial conservador;
- fade-in/fade-out;
- nada empieza solo;
- no mezclar capas sin propósito;
- no usar espacialización como decoración;
- silencio es una opción válida.

---

## Bloque 8 · Loudness, true peak y escucha segura

Fuentes:
- ITU-R BS.1770-5 · 11/2023 · en vigor
  https://www.itu.int/rec/R-REC-BS.1770-5-202311-I
- EBU R 128 v5 · 21/11/2023
  https://tech.ebu.ch/publications/r128
- ITU-T H.870 v2 · 03/2022 · en vigor
  https://www.itu.int/rec/T-REC-H.870-202203-I/en
- ITU-T H.872 · 10/2024 · en vigor
  https://www.itu.int/rec/T-REC-H.872-202410-I/en

Dominar:
- LUFS;
- loudness integrado;
- loudness range;
- true peak;
- headroom;
- nivel vs duración;
- limitaciones de medir una web que no conoce la calibración física de auriculares/altavoces.

Matiz obligatorio:
EBU R128 es una referencia de broadcast, no un target automático del Rincón.
H.870 define escucha segura para sistemas personales; la web por sí sola no conoce SPL real del dispositivo, por lo que no se debe declarar cumplimiento sin una implementación y medición adecuadas.

Uso profesional:
medir consistencia, evitar picos y sorpresas, conservar margen y proporcionar control.

---

## Bloque 9 · Accesibilidad de media

Fuentes:
- WCAG 2.2
  https://www.w3.org/TR/wcag/
- W3C WAI · Making Audio and Video Media Accessible
  https://www.w3.org/WAI/media/av/

Dominar:
- audio control;
- pause/stop/hide;
- flashes;
- time-based media;
- captions;
- transcripts;
- descriptions;
- player accessible;
- keyboard;
- focus;
- names;
- status updates;
- no interferencia con lector de pantalla.

Matiz:
un vídeo puramente ambiental puede requerir una estrategia distinta de un vídeo informativo.
La alternativa debe conservar el propósito real, no añadir contenido ficticio.

---

## Bloque 10 · Accesibilidad cognitiva y control sensorial

Fuente:
- W3C COGA · Making Content Usable for People with Cognitive and Learning Disabilities
  https://www.w3.org/TR/coga-usable/

Dominar:
- reducir interrupciones;
- permitir control de ruido, movimiento y contenido;
- entorno simple;
- pausa fácil;
- cambios iniciados por la persona;
- caminos críticos cortos;
- controles predecibles;
- personalización.

Regla:
COGA es guía suplementaria, no equivalencia automática a conformidad WCAG.

Aplicación:
el Rincón no puede ser una experiencia “relajante” que quite control a la persona.

---

## Bloque 11 · Motion, transparency y preferencias del sistema

Fuentes:
- W3C Media Queries Level 5
  https://www.w3.org/TR/mediaqueries-5/
- W3C Technique C39
  https://www.w3.org/WAI/WCAG22/Techniques/css/C39

Dominar:
- prefers-reduced-motion;
- prefers-reduced-transparency;
- prefers-contrast cuando aplique;
- forced colors;
- diferencia entre preferencia del sistema y ajuste explícito del producto.

Regla:
si la persona elige explícitamente un nivel, ese estado debe ser comprensible y reversible.
Si no elige, respetar preferencia del sistema.

El modo “Sin movimiento” no es “animación muy lenta”.
Es un estado terminado sin animación continua.

---

## Bloque 12 · XR Accessibility como conocimiento adyacente

Fuente:
- W3C XR Accessibility User Requirements · Note
  https://www.w3.org/TR/xaur/

Estudiar:
- personalización;
- multimodalidad;
- motion-agnostic interactions;
- controles remapeables;
- mute de contenido no crítico;
- velocidad configurable;
- start/stop claros;
- evitar sickness triggers;
- mono audio;
- alternativas textuales;
- accesibilidad de immersive environments.

Matiz:
XAUR es una Working Group Note de requisitos de usuario, no un estándar normativo.
WebXR no forma parte del gate actual del Rincón.

---

## Bloque 13 · Diseño centrado en las personas y usabilidad

Fuentes:
- ISO 9241-210:2019 · confirmada vigente en 2025
  https://www.iso.org/standard/77520.html
- ISO 9241-11:2018 · confirmada vigente en 2023
  https://www.iso.org/standard/63500.html
- ISO 9241-112:2025
  https://www.iso.org/standard/87518.html
- ISO 9241-171:2025
  https://www.iso.org/standard/86308.html

Dominar:
- contexto de uso;
- objetivos/personas sin estereotipos;
- participación/evaluación con personas;
- eficacia, eficiencia y satisfacción;
- presentación de información visual/auditiva/táctil;
- accesibilidad de software para capacidades físicas, sensoriales y cognitivas diversas.

Aplicación:
HUMAN QA no es un último vistazo estético.
Es evidencia de uso real que complementa pruebas técnicas.

---

## Bloque 14 · Calidad de producto

Fuente:
- ISO/IEC 25010:2023
  https://www.iso.org/standard/78176.html

Dominar:
usar el modelo de calidad para pensar en el producto de forma completa:
- adecuación funcional;
- eficiencia de rendimiento;
- compatibilidad;
- capacidad de interacción;
- fiabilidad;
- seguridad;
- mantenibilidad;
- flexibilidad;
- seguridad operacional/safety cuando corresponda al modelo aplicable.

Aplicación:
una escena que “funciona” pero se atasca, consume recursos tras salir o no degrada bien no alcanza calidad de producto.

No declarar conformidad ISO por usar el modelo como referencia.

---

## Bloque 15 · Plain language y bilingüismo

Fuente:
- ISO 24495-1:2023
  https://www.iso.org/standard/78907.html

Dominar:
- texto que la persona puede encontrar, entender y usar;
- instrucciones breves;
- nombres de controles claros;
- ES/EN completos;
- evitar jerga técnica pública;
- no infantilizar;
- no hacer claims terapéuticos.

Aplicación:
“Empezar / Pausar / Parar / Pantalla limpia” es mejor que explicar el motor.
La tecnología pertenece a documentación/evidencia, no al primer viewport.

---

## Bloque 16 · YouTube y media de terceros

Fuentes:
- Google/YouTube · Embedded Players and Player Parameters
  https://developers.google.com/youtube/player_parameters
- Google/YouTube · IFrame Player API
  https://developers.google.com/youtube/iframe_api_reference

Dominar:
- iframe;
- enablejsapi;
- origin;
- playsinline;
- mute;
- controles;
- limitaciones de rel;
- errores;
- carga;
- privacidad;
- dependencia del proveedor.

Aplicación Iris Green:
- no iframe antes de acción cuando esa es la política del producto;
- no preconnect por defecto;
- youtube-nocookie según decisión vigente;
- reproductor silenciado;
- audio Iris Green separado;
- fallback si el embed falla;
- candidato rechazado si publicidad/interrupciones rompe la experiencia;
- no descargar/rippear/rehostear YouTube.

Lección:
la documentación oficial confirma que autoplay puede implicar recopilación/compartición de datos al cargar. Control explícito y carga diferida son decisiones de producto con efecto técnico y de privacidad.

---

## Bloque 17 · Curación de paisajes largos

Dominar:
- continuidad visual;
- una sola localización coherente;
- cámara fija/casi fija;
- duración;
- cortes;
- saltos de luminancia;
- loops;
- overlays;
- anuncios;
- eventos llamativos;
- estabilidad de audio;
- observación prolongada.

Gate:
un paisaje candidato no se aprueba por resolución ni bitrate.
Debe poder permanecer 20–60 minutos sin reclamar atención indebidamente.

Prueba mínima histórica de #307:
- 20 min playa;
- 20 min río;
- 20 min lluvia;
- registrar interrupciones, loop, buffering y cambios perceptibles.

---

## Bloque 18 · Responsive immersive composition

Dominar:
- stage-first;
- mobile composition;
- safe areas;
- bottom dock/sheet;
- relación de aspecto;
- 320 px;
- zoom/reflow;
- vertical recomposition;
- pointer/touch;
- teclado equivalente;
- clean screen;
- Escape/salida recuperable.

Regla:
móvil no es “desktop recortado”.

---

## Bloque 19 · QA técnico + QA perceptivo

QA automático:
- sintaxis/build;
- ES/EN;
- rutas;
- no overflow;
- teclado/foco;
- Escape;
- ARIA;
- reduced motion;
- reduced transparency;
- forced colors;
- Save-Data;
- background pause;
- cambio de modos;
- audio/video no autoplay;
- fallback;
- cleanup.

QA perceptivo:
- calidad visual;
- continuidad;
- confort;
- control;
- densidad;
- velocidad;
- audio/hiss/picos;
- loops;
- publicidad;
- composición integrada;
- escritorio y móvil;
- sesiones reales largas.

Regla:
hash/CI demuestra identidad y tests.
No demuestra calma ni inmersión.

---

## Bloque 20 · Método de trabajo de Lumen

Antes de construir:
1. leer orden vigente;
2. leer Control/Memoria;
3. comprobar HEAD real;
4. estudiar superficie integrada;
5. identificar dueño de shell/design/runtime/audio/standards;
6. definir experiencia y fallbacks;
7. definir señales de fracaso antes de programar.

Durante:
1. progressive enhancement;
2. estados explícitos;
3. cleanup;
4. observabilidad técnica sin telemetría conductual innecesaria;
5. ES/EN;
6. accesibilidad desde arquitectura.

Antes de entregar:
1. pruebas automáticas;
2. pruebas negativas;
3. pruebas de capability/fallback;
4. performance;
5. HUMAN QA propia;
6. evidencia;
7. handoff a Astra/A2 según orden.

---

## Formación continua

Revisar:
- cambios de WebGPU/WGSL;
- evolución Web Audio;
- Media Capabilities;
- Media Session;
- soporte real de media queries de preferencias;
- políticas de YouTube/embeds;
- nuevos incidentes del Rincón;
- cambios de normativa coordinados con Axioma/Lex.

No existe “formación terminada”.
Ciclo:
FOUNDATION → PRACTICE → PERCEPTUAL QA → REVIEW → UPDATE.
