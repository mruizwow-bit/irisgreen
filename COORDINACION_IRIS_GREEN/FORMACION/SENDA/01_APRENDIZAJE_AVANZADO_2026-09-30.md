# SENDA · IDENTIDAD + APRENDIZAJE AVANZADO · 30/09/2026

## Identidad profesional

Rol de proyecto: **Senda · R59**  
Equipo: **Aura · Operaciones & Conocimiento**

Especialidad profesional de trabajo:
**Interactive Experience Engineer & Creative Technologist**  
**Ingeniería de Experiencias Interactivas y Tecnología Creativa**

Especialización Iris Green:
experiencias web exploratorias, accesibles, visualmente ricas y alimentadas por contenido o datos reales cuidadosamente curados.

Esta denominación describe el trabajo y la formación actuales. No equivale a certificación externa.

Regla profesional:
`PREGUNTA HUMANA → ACCIÓN → INFORMACIÓN NECESARIA → REPRESENTACIÓN → RENDERER → RENDIMIENTO → ALTERNATIVA ACCESIBLE`

Fronteras:
- Astra: arquitectura, calidad y gates;
- Prisma: frontend platform/design systems;
- Motor: runtime general;
- Nube: corpus/retrieval;
- Axioma: estándares/conformidad;
- Lex: obligaciones jurídicas;
- Vector/A2: integración/release;
- María/Croma: dirección de producto/visual cuando corresponda.

Estado:
`SENDA_ADVANCED_INTERACTIVE_EXPERIENCE_TRAINING_IN_PROGRESS`

Este documento conserva la formación realizada antes de agotar el chat.

## 1. Human-Computer Interaction y diseño centrado en las personas

Estudiado:
- ISO 9241-210;
- ISO 9241-110;
- ISO 9241-112:2025;
- W3C COGA;
- UDL 3.0.

Aplicación:
- la tecnología se elige después de comprender tarea, contexto y acción;
- la exploración no debe exigir recordar cómo funciona la interfaz;
- objetivo, estado, progreso y acciones deben poder recuperarse;
- progressive disclosure aplica a todas las edades;
- adultez no significa mostrar más información simultánea.

## 2. Accesibilidad

Base:
- WCAG 2.2 AA;
- ISO/IEC 40500:2025;
- ISO 9241-171:2025;
- WAI-ARIA 1.2 como Recomendación vigente;
- ARIA 1.3 solo como horizonte mientras siga no estable.

Aprendizajes:
- drag necesita alternativa de puntero simple; teclado solo no basta;
- mantener estándar interno Iris >=44 px aunque WCAG 2.2 Target Size Minimum use 24x24 CSS px con excepciones;
- Pointer Events como modelo común mouse/touch/pen;
- touch-action con cuidado; no bloquear zoom globalmente;
- hover nunca como único acceso a información esencial;
- controles complejos no deben crear cientos de tab stops;
- preferir HTML nativo; ARIA implica comportamiento esperado;
- forced colors: dejar actuar al navegador; forced-color-adjust:none solo excepcional;
- Canvas/WebGL no son representación semántica suficiente por sí solos;
- cambios de estado importantes se anuncian; animación decorativa no;
- audio nunca como único canal;
- orientación no se bloquea salvo necesidad esencial;
- texto importante sigue siendo texto real, no textura;
- label visible y accessible name deben coincidir para control por voz;
- evitar presión temporal innecesaria;
- preservar trabajo ante pausa, back y undo.

## 3. Lenguaje claro e internacionalización

Estudiado:
- ISO 24495-1:2023;
- ISO 24495-3:2026 para comunicación científica;
- W3C Internationalization;
- Intl APIs del navegador.

Reglas:
- precisión científica + claridad;
- información relevante, encontrable, comprensible y utilizable;
- ES/EN no se implementan concatenando strings;
- usar lang correcto;
- localizar números, fechas, unidades y rangos;
- no usar banderas para representar idiomas.

## 4. Arquitectura gráfica

Estudiado:
- DOM/SVG/Canvas2D/WebGL/WebGPU;
- Three.js;
- PBR;
- color management;
- glTF 2.0;
- KTX2/Basis;
- Draco;
- OffscreenCanvas/workers.

Reglas:
- usar la técnica más simple capaz de alcanzar E4;
- WebGPU = progressive enhancement, no dependencia única;
- mantener fallback;
- PBR no significa activar todos los efectos;
- color textures y data textures se gestionan de forma distinta;
- contraste se evalúa tras iluminación/tone mapping, no solo sobre color base;
- estado funcional independiente de GPU/DOM;
- probar pérdida de contexto y restauración;
- render bajo demanda si la escena está quieta;
- first interaction también tiene presupuesto (shader compilation/decoding).

## 5. Rendimiento

Medir:
- LCP;
- INP;
- CLS;
- long tasks;
- Resource Timing;
- memoria/VRAM;
- primera interacción;
- transferencia total inicial;
- comportamiento móvil.

Principios:
- presupuesto por piloto, no límite universal;
- adaptar resolución/arte a viewport y DPR;
- no cargar fallbacks/engines ocultos si no se usan;
- textura pequeña en disco puede ocupar mucha memoria GPU;
- lazy load para lo no crítico; no lazy-load del recurso principal de LCP;
- srcset/sizes para raster;
- workers/OffscreenCanvas cuando reduzcan main-thread blocking.

## 6. Datos y fuentes

Regla:
`SOURCE != EXPERIENCE`.

Cada fuente debe declarar:
- autoridad/organismo;
- URL;
- versión;
- fecha de consulta;
- query/subset;
- campos;
- límite;
- live/snapshot;
- fallback;
- licencia;
- atribución;
- refresh;
- provenance.

Estudiado:
- NASA/JPL/Horizons;
- NASA Exoplanet Archive TAP;
- GBIF;
- eBird;
- Macaulay Library;
- WoRMS;
- OBIS;
- Paleobiology Database;
- ICS;
- IMA-CNMNC;
- RRUFF;
- GTFS/GTFS-Realtime/Pathways;
- Wikidata;
- IIIF;
- Natural Earth;
- The Met.

Reglas:
- snapshot curado por defecto cuando los datos cambian poco;
- live solo si aporta;
- no fetch-all;
- no select *;
- respetar rate limits/Retry-After;
- 404/500 no equivalen a excepción fetch; comprobar response.ok;
- timeout/cancelación explícita;
- fallback honesto con fecha de actualización;
- validar estructura en frontera (p.ej. JSON Schema).

## 7. Licencia y procedencia

Distinciones:
- dato;
- fotografía;
- audio;
- vídeo;
- marca/logotipo;
- composición Iris Green.

No comparten licencia automáticamente.

Ejemplos:
- eBird data != Macaulay media;
- NASA factual/media reuse != NASA logos/third-party assets;
- OSM open data != permiso ilimitado de servidores públicos de tiles.

Si un canvas exporta:
- controlar CORS/procedencia de imágenes;
- evitar tainted canvas.

## 8. Resiliencia y seguridad

Estudiado:
- CSP;
- SRI;
- Trusted Types;
- CORS;
- service workers/cache;
- offline/fallback;
- schema validation;
- WebGL context loss;
- WebGPU device loss.

Reglas:
- declarar connect-src/img-src/media-src/worker-src mínimos;
- preferir self-host/bundle cuando sea razonable;
- SRI cuando se use recurso CDN adecuado;
- datos externos se renderizan como texto/atributos seguros;
- no confiar en navigator.onLine como prueba de disponibilidad;
- cache técnica != memoria del usuario;
- cache vieja no se presenta como live;
- persistencia del usuario solo opt-in según contrato R59.

## 9. Ciencia y epistemología

Etiquetas Iris:
- REAL_DATA;
- SIMULATION;
- USER_CREATED;
- FICTIONAL.

Regla:
una simulación alimentada por datos reales sigue siendo SIMULATION.

También:
- comunicar incertidumbre;
- no dar apariencia de certeza falsa;
- versionar autoridad científica;
- ICS chart vigente estudiada: 2026/06;
- JPL Horizons estudiado en versión 4.98e (25/08/2026).

## 10. Visualización accesible

- nunca color-only;
- segunda codificación: forma/patrón/etiqueta/texto;
- mapas/gráficos complejos necesitan explicación estructurada;
- SVG ayuda pero no se confía solo en title/desc;
- no meter toda una explicación compleja en un aria-describedby gigante;
- estados sin resultados / offline / error / cargando son distintos.

## 11. Audio y sonificación

- audio tras acción explícita;
- controlable;
- no información solo sonora;
- espacialización puede enriquecer, nunca ser única forma de localizar;
- sonificación = mapeo de datos a audio, no “sonido real” salvo que lo sea;
- ejemplo estudiado: Hearing Hubble.

## 12. QA

Separar:
- PRODUCT correctness;
- TEST correctness;
- EVIDENCE correctness.

Lección R59 Fósiles:
un screenshot llamado T. rex no demuestra T. rex si el arnés no seleccionó y afirmó el fósil activo.

Prácticas:
- assertions previas;
- negative tests;
- fail nonzero real;
- tests de invariancia/metamorphic;
- sabotajes;
- manifests;
- hashes;
- reproducibilidad;
- byte reproducibility != pixel/semantic reproducibility;
- emular forced-colors/reduced-motion/touch/offline/locale/geolocation;
- Playwright WebKit != Safari real;
- automatización != conformidad total;
- HUMAN QA permanece obligatorio.

## 13. Benchmark visual 2026

Norma canónica:
`IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`.

Estudiados como referencia de nivel, no para copiar:
- National Gallery Imaginarium;
- Igloo Inc;
- FOLLOW.ART;
- Dunes & Stars;
- It's an Ocean World;
- Hearing Hubble.

Aprendizaje:
arte + interacción + función deben integrarse.
La tecnología debe desaparecer detrás de la experiencia.

## 14. Child-safe / ética de interacción

Como buena práctica de producto:
- no autoplay compulsivo;
- no streaks;
- no patrones de retención;
- privacidad por defecto;
- explorar por interés, no retener por diseño.

La aplicabilidad jurídica concreta corresponde a Lex.

## 15. Seis pilotos · fuentes de referencia estudiadas

Mar:
- WoRMS/OBIS;
- sistema, hábitat, profundidad, especies;
- no catálogo exhaustivo.

Aves:
- eBird/GBIF para datos según alcance;
- medios con licencia independiente;
- audio opcional y controlado.

Fósiles:
- PBDB + ICS;
- escala geológica versionada;
- reproducción y procedencia de assets.

Minerales:
- IMA-CNMNC + RRUFF;
- nomenclatura y propiedades verificables;
- multivista/3D solo si el presupuesto real lo permite.

Trenes/metro:
- GTFS Schedule / Realtime / Pathways;
- accesibilidad y topología de estación pueden aportar más que “otro mapa”;
- validar feeds.

Espacio:
- IAU/JPL/NASA;
- JPL APIs no se consumen desde navegador como dependencia ciega;
- snapshot/ingest controlado cuando corresponda;
- 02 Planetas/Sistema Solar separado de 06 Exploración espacial.

## 16. Estado de formación

No certificación externa.

Estado actual:
`FOUNDATION → ADVANCED STUDY → PRACTICE/REVIEW PENDING`.

No se declara “todo estudiado”.
La formación profesional es continua.


## 17. Máquinas de estado, invariantes y pruebas generativas

Estudiado:
- W3C SCXML 1.0 como referencia formal de state machines/statecharts;
- legal state configurations;
- state entry/exit;
- history;
- parallel states;
- deterministic/run-to-completion semantics;
- property-based testing;
- model-based testing.

Aplicación Senda:
- el estado funcional de cada experiencia se define independientemente del renderer;
- cada transición debe tener precondiciones;
- declarar invariantes que nunca deben romperse;
- distinguir estado lógico de estado visual;
- un resize, cambio de tema, locale, reduced motion o pérdida de GPU no altera la verdad funcional;
- tests generativos recorren secuencias de acciones y buscan estados imposibles;
- tests de invariancia comprueban que donor/renderers no contaminan decisiones de producto.

Ejemplos de invariantes:
- Fósiles: no mostrar ficha nominal sin fósil activo correspondiente;
- colección: no duplicar un hallazgo único salvo que el modelo lo permita explícitamente;
- Trenes: una ruta mostrada como conectada debe tener continuidad real en el modelo;
- Espacio: cambiar renderer no cambia selección ni clasificación REAL_DATA/SIMULATION;
- undo/redo debe restaurar estado funcional, no solo apariencia.

## 18. GPU/renderer como recurso reemplazable

WebGL:
- los contextos pueden perderse;
- WEBGL_lose_context permite probar pérdida/restauración;
- tras restauración hay que recrear recursos gráficos.

WebGPU:
- GPUDevice.lost debe gestionarse;
- un nuevo device exige recrear buffers/texturas;
- WebGPU sigue sin ser Baseline universal.

Regla:
`STATE_SURVIVES_RENDERER`.

El renderer es una proyección del estado, no la fuente canónica.

Gate sugerido:
1. iniciar actividad;
2. modificar estado;
3. perder contexto/device;
4. reconstruir;
5. comprobar que selección/progreso/colección siguen idénticos.

## 19. High-DPI y resolución adaptativa

Estudiado:
- devicePixelRatio no debe usarse de forma ingenua;
- ResizeObserver + device-pixel-content-box permite conocer tamaño físico real cuando está disponible;
- presupuesto de framebuffer/VRAM debe depender del tamaño visible;
- se puede reducir resolución interna para estabilidad manteniendo controles/texto nativos nítidos.

Regla:
no renderizar a resolución máxima solo porque el dispositivo tenga DPR alto.

## 20. Wide gamut / HDR

Canvas 2D puede solicitar:
- sRGB;
- Display P3;
- en algunos contextos float16.

Pero varias piezas de este soporte siguen sin ser Baseline universal.

Uso:
- mejora progresiva;
- nunca depender de P3/HDR para distinguir información;
- siempre mantener representación correcta en sRGB;
- QA de contraste y estados en la ruta base.

## 21. Incertidumbre científica y falsa precisión

Estudiado:
- NIST sobre incertidumbre de medición;
- NIST sobre visualización como objeto susceptible de cuantificación/error.

Reglas:
- dato medido, estimación, intervalo, modelo y simulación no se presentan igual;
- no redondear/mostrar más precisión de la que permite la fuente;
- si la incertidumbre cambia la interpretación, debe aparecer en la interfaz o descripción;
- visualización no debe transformar incertidumbre en falsa certeza;
- las decisiones de escala/color/agrupación pueden introducir interpretación y deben documentarse.

## 22. Model-based / property-based QA

Estudiado:
- fast-check property-based testing;
- model-based testing basado en comandos + precondiciones + assertions.

Aplicación:
en vez de probar solo secuencias escogidas a mano:
- generar muchas secuencias válidas;
- comparar sistema con un modelo simplificado;
- reducir el caso que falla hasta una secuencia mínima reproducible.

Especialmente útil para:
- seleccionar/descubrir/guardar/quitar;
- filtros + locale + theme;
- resize durante interacción;
- offline/online;
- undo/redo;
- pérdida/restauración GPU;
- cambio de etapa;
- fuente live → fallback.

## 23. Complejidad visual accesible

Para gráficos, mapas, diagramas y escenas informativas:
- identificación corta;
- explicación extensa de información esencial;
- estructura real cuando existan relaciones/tablas;
- aria-describedby no sustituye una estructura compleja: se lee como texto continuo;
- alternativas complejas deben ser utilizables también por personas con dificultades cognitivas o poco conocimiento del dominio.

## 24. Movimiento e interacción

- reduced motion se aplica a animación activada por interacción cuando no sea esencial;
- una transición instantánea o cambio de opacidad puede reemplazar viajes de cámara;
- dragging necesita alternativa single-pointer;
- teclado y alternativa single-pointer se evalúan por separado.

## 25. Estado de esta ampliación

Estado:
`SENDA_STATE_MODEL_RESILIENCE_UNCERTAINTY_QA_ADVANCED_STUDIED_R03`

No certificación externa.
No cambio de producto.
No build/merge/deploy durante Formación.


## 26. Formación por dominio R04 · contratos de fuente de los seis pilotos

### Mar y peces

Fuentes estudiadas:
- WoRMS;
- OBIS;
- GEBCO 2026.

Aprendizajes:
- OBIS recomienda API/R para subconjuntos pequeños y GeoParquet/AWS para subconjuntos grandes; no paralelizar descargas masivas innecesariamente;
- GEBCO 2026 es un modelo global derivado/interpolado de fuentes heterogéneas;
- GEBCO aporta un TID grid para indicar tipo de fuente subyacente;
- GEBCO no debe tratarse como medición exacta de cada punto ni usarse para navegación;
- la atribución de GEBCO debe conservarse;
- para un mundo marino, profundidad/relieve pueden ser contexto científico, no obligación de mostrar un mapa global.

Regla:
`MODELLED_BATHYMETRY != RAW_MEASUREMENT`.

### Aves

Fuentes estudiadas:
- eBird;
- Macaulay Library.

Aprendizaje central:
los datos de observación y los medios audiovisuales tienen contratos distintos.

- quien aporta foto/sonido/vídeo conserva copyright;
- Macaulay no es un repositorio abierto para reutilización arbitraria de terceros;
- usar un registro de especie no concede automáticamente derecho a usar su foto/canto.

Regla:
`OBSERVATION_LICENSE != MEDIA_LICENSE`.

### Fósiles

Fuentes estudiadas:
- Paleobiology Database;
- International Commission on Stratigraphy.

ICS:
- Chart vigente estudiado: 2026/06;
- varias edades numéricas cambiaron en esa revisión;
- la Chart dispone de datos RDF/SKOS y versiones archivables.

Lección:
- nunca copiar edades geológicas sin versión;
- precisión numérica debe conservar la incertidumbre publicada cuando sea relevante.

PBDB:
- se ha detectado historial/documentación de licencia no completamente uniforme entre fuentes/épocas;
- por tanto Senda no fija de memoria la licencia: debe pinchar la licencia vigente del dataset/API usado y, cuando haya duda jurídica, escalar a Lex.

Regla:
`PIN_VERSION + PIN_LICENSE + PIN_QUERY`.

### Minerales

Fuentes estudiadas:
- IMA-CNMNC;
- RRUFF/IMA Database of Mineral Properties.

Estado factual:
- IMA-CNMNC publica lista maestra actualizada de minerales aprobados en septiembre de 2026;
- RRUFF mantiene propiedades mineralógicas en colaboración con IMA;
- RRUFF está en transición de interfaz/infraestructura, por lo que URLs/endpoints no se asumen eternos.

Reglas:
- nombre/estado de mineral se valida contra IMA-CNMNC vigente;
- propiedades y medios tienen procedencia independiente;
- snapshot versionado cuando el contenido no necesita live.

### Trenes / metro

Fuentes estudiadas:
- GTFS Schedule;
- GTFS Realtime;
- GTFS Pathways;
- validator canónico mantenido por MobilityData.

Aprendizajes:
- Pathways modela interior de estación: pasillos, escaleras, ascensores, niveles, direccionalidad, longitud, pendiente, tiempo y señalización;
- GTFS puede codificar accesibilidad de parada/viaje y text-to-speech;
- campo vacío de accesibilidad significa información ausente, no necesariamente “no accesible”;
- validar el feed antes de consumirlo;
- feeds pueden actualizarse con frecuencia variable.

Regla:
`UNKNOWN_ACCESSIBILITY != INACCESSIBLE`.

Para el piloto:
una estación puede ser una experiencia espacial/wayfinding más rica que un mapa de líneas.

### Espacio

Fuentes estudiadas:
- JPL Horizons;
- NASA media/brand guidance.

Horizons:
- versión estudiada 4.98e, 25/08/2026;
- gran catálogo no implica cargarlo;
- query debe estar acotada por objetivo.

NASA:
- muchos medios pueden reutilizarse para fines informativos/educativos bajo sus guías;
- logos/insignias/identificadores tienen reglas separadas;
- material de terceros alojado por NASA puede conservar copyright de terceros;
- evitar cualquier apariencia de endorsement.

Regla:
`NASA_SOURCE != NASA_BRANDING_RIGHTS`.

### Contrato común de fuente

Antes de integrar una fuente:
1. autoridad;
2. recurso exacto;
3. versión/fecha;
4. query/subset;
5. licencia de datos;
6. licencia de medios;
7. atribución;
8. incertidumbre/limitaciones;
9. live/snapshot;
10. fallback;
11. cambio esperado;
12. responsable de revisión.

## 27. Fuente no es permiso único

Nunca asumir:
- API abierta = medios abiertos;
- datos públicos = logos utilizables;
- mapa abierto = tile service ilimitado;
- fuente científica = precisión infinita;
- campo vacío = “no”;
- versión actual = permanente.

## 28. Estado de ampliación R04

`SENDA_DOMAIN_SOURCE_CONTRACTS_STUDIED_R04`

No certificación externa.
No build/merge/deploy de producto.


## 29. Foco, overlays y paneles de escena

Estudiado:
- WCAG 2.2 2.4.11 Focus Not Obscured (Minimum), AA;
- 2.4.13 Focus Appearance, AAA como objetivo de calidad;
- Focus Visible;
- Content on Hover or Focus.

Reglas:
- ningún HUD, ficha, sticky control o panel puede ocultar completamente el foco;
- preferir foco completamente visible aunque AA permita visibilidad parcial;
- indicador de foco debe conservar contraste real sobre escenas cambiantes;
- overlays abiertos por hover/focus deben ser dismissible, hoverable y persistent;
- Escape puede servir como dismiss cuando corresponda;
- hover no será único mecanismo.

## 30. Descripciones complejas y estructura

Para mundos, mapas, diagramas y gráficos:
- short identification;
- descripción larga accesible;
- relaciones/tablas/jerarquías necesitan estructura semántica real;
- no meter una tabla o jerarquía completa dentro de aria-describedby porque se lineariza;
- cuando una descripción compleja ayuda también a personas con dificultades cognitivas, puede mostrarse como contenido visible para todos.

## 31. Reflow y escenas bidimensionales

WCAG permite excepción 2D para partes cuyo significado/uso exige layout bidimensional.

Interpretación Senda:
- un mapa o escena puede mantener viewport 2D;
- la página completa no queda exenta;
- controles, fichas, texto, fuentes, acciones y alternativas deben seguir funcionando/reflowing;
- no usar la excepción 2D para justificar desktop miniaturizado.

## 32. Speech input y nombres accesibles

Regla:
el nombre accesible contiene la etiqueta visible y preferiblemente empieza por ella.

Aplicación:
si un control muestra “Guardar”, no nombrarlo solo “Añadir observación al cuaderno”.

Objetivo:
compatibilidad con control por voz además de lectores de pantalla.

## 33. Estado R05

`SENDA_FOCUS_OVERLAYS_COMPLEX_DESCRIPTIONS_STUDIED_R05`

No certificación externa.
No producto modificado.


## 34. Profiling real y gates de rendimiento R06

Fuentes estudiadas:
- Chrome DevTools Performance/Rendering/Performance Monitor;
- MDN Event Timing / PerformanceEventTiming;
- MDN Long Animation Frames;
- User Timing API;
- Three.js renderer.info / cleanup/disposal;
- Lighthouse CI assertions y budgets.

### 34.1 Medir interacción real

PerformanceEventTiming permite observar latencia de eventos e investigar interacciones lentas.

INP:
- no se sustituye por “FPS”;
- una escena puede animar bien y responder mal a un click/tap;
- medir inicio de interacción, processing y siguiente paint.

Regla:
`SMOOTH_ANIMATION != RESPONSIVE_INTERACTION`.

### 34.2 Long Animation Frames

Una frame larga >50 ms es señal diagnóstica útil.
Para ~60 fps, el presupuesto teórico por frame ronda 16 ms.

Uso Senda:
- detectar scripts/render/layout que bloquean;
- no convertir 16 ms en dogma universal;
- priorizar estabilidad perceptiva y respuesta de interacción.

### 34.3 User Timing

Instrumentar acciones propias con:
- performance.mark();
- performance.measure();
- nombres semánticos.

Ejemplos de entrenamiento:
- scene-ready;
- first-interaction-ready;
- select-to-visible-feedback;
- open-info-panel;
- switch-locale;
- restore-after-context-loss.

La instrumentación debe medir experiencia, no solo funciones internas.

### 34.4 GPU/render metrics

Three.js WebGLRenderer.info:
- geometries;
- textures;
- programs;
- render calls;
- triangles;
- points;
- lines.

En renderer moderno, Info puede aportar tamaños de memoria rastreados.

Cautela:
- no presentar un contador de engine como medida universal exacta de VRAM del sistema;
- Chrome Rendering stats puede aportar observación específica de GPU/memoria en ese entorno.

### 34.5 Gestión explícita de memoria

Three.js no libera automáticamente todos los recursos GPU al retirar objetos.

Obligatorio cuando corresponda:
- geometry.dispose();
- material.dispose();
- texture.dispose();
- render target/pass disposal;
- limpiar referencias y listeners.

Prueba de fuga:
1. entrar en mundo;
2. cargar recursos;
3. salir/liberar;
4. repetir N veces;
5. renderer.info/memory no debe crecer indefinidamente.

### 34.6 Texturas

Una textura comprimida pequeña en red se expande en memoria.
El manual Three.js ejemplifica que 1024×1024 puede requerir varios MB.

Regla:
`TRANSFER_SIZE != GPU_MEMORY_COST`.

### 34.7 DevTools y móvil

Chrome permite:
- flame chart;
- GPU track;
- FPS/render stats;
- memoria;
- CPU/network throttling.

Pero el throttling de CPU es relativo al equipo anfitrión y NO reproduce fielmente arquitectura móvil.

Gate:
- laboratorio para detectar/regresar;
- dispositivo/navegador real para validar riesgo material.

### 34.8 Performance budgets en CI

Lighthouse CI permite:
- assertions con exit nonzero;
- budgets por tamaño/conteo de recursos;
- múltiples ejecuciones;
- assertions sobre User Timings.

Uso:
- proteger regresiones;
- no sustituir profiling runtime de escenas;
- no declarar experiencia “rápida” por una puntuación agregada única.

### 34.9 Matriz mínima de profiling Senda

Por piloto visual:
1. carga inicial total;
2. LCP;
3. CLS;
4. INP/interacción crítica;
5. User Timing de primera acción;
6. long frames/tasks;
7. draw calls;
8. geometrías/texturas activas;
9. memoria observable disponible;
10. estabilidad tras entrar/salir repetidamente;
11. pérdida/restauración GPU;
12. 390 móvil;
13. 320;
14. desktop;
15. reduced motion;
16. fallback.

### 34.10 Gate de degradación adaptativa

No seleccionar calidad solo por user-agent o deviceMemory.

Preferencia:
- ruta base conservadora;
- medir tamaño/DPR/capacidad;
- escalar calidad;
- degradar si frame/interaction budget se incumple.

Orden de degradación orientativo:
1. resolución interna;
2. detalle secundario;
3. sombras/reflections costosas;
4. post-processing;
5. densidad de objetos;
6. técnica alternativa.

Nunca degradar:
- contenido factual;
- controles;
- foco;
- semántica;
- alternativa accesible.

Estado:
`SENDA_PROFILING_PERFORMANCE_GATES_STUDIED_R06`


## 35. Reproducibilidad de assets y evidencia visual R07

Fuentes estudiadas:
- Playwright visual comparisons;
- reproducible-builds.org;
- SOURCE_DATE_EPOCH;
- GitHub artifact attestations / SLSA provenance.

### 35.1 Cuatro niveles que no deben confundirse

1. **Byte reproducibility**
   - mismo input + entorno produce mismos bytes.

2. **Decoded/pixel equivalence**
   - bytes pueden diferir, pero imagen decodificada cumple igualdad/tolerancia definida.

3. **Perceptual visual regression**
   - apariencia dentro de umbral aceptado para una baseline controlada.

4. **Nominal evidence correctness**
   - la captura muestra exactamente el estado/objeto que su nombre y test afirman.

Un PASS en uno no implica PASS en los otros.

### 35.2 Visual baselines

Playwright advierte que screenshots pueden variar por:
- OS;
- versión;
- settings;
- hardware;
- power state;
- headless/entorno.

Reglas:
- baseline y comparación en entorno controlado;
- fijar browser/toolchain cuando el gate dependa de pixel diff;
- revisar cambios de golden;
- no actualizar snapshots automáticamente para “poner verde” CI;
- desactivar/estabilizar animaciones cuando no formen parte de la prueba;
- documentar tolerancias.

### 35.3 Tolerancias

Playwright permite:
- maxDiffPixels;
- maxDiffPixelRatio;
- threshold perceptivo de pixelmatch.

Regla:
tolerancia debe justificarse.

No usar una tolerancia grande para ocultar:
- arte roto;
- layout drift;
- fuente faltante;
- render distinto.

### 35.4 Build reproducible

Fuentes de variabilidad:
- timestamps;
- timezone;
- locale;
- orden de inputs;
- randomness;
- build path;
- toolchain/codec version;
- metadata de archivos.

SOURCE_DATE_EPOCH permite sustituir tiempo de build volátil por un timestamp reproducible derivado de fuente cuando las herramientas lo soportan.

Aplicación Senda:
- seeds explícitos para procedural;
- orden estable;
- versiones de encoder/generador;
- entorno registrado;
- timestamps no volátiles;
- inputs hashados.

### 35.5 Codec variability

Lección R59:
si bytes de un asset codificado pueden variar entre toolchains:
- o se fija exactamente el entorno/codec para exigir byte identity;
- o se define un contrato explícito de equivalencia decodificada/perceptiva.

Nunca:
documentar pixel fallback y entregar un verificador que solo compare SHA.

`DOCUMENTED_CONTRACT == EXECUTED_CONTRACT`.

### 35.6 Provenance/attestation

GitHub artifact attestations pueden vincular:
- repo;
- workflow;
- commit SHA;
- evento;
- build provenance.

Pero:
- una attestation no garantiza seguridad;
- no garantiza corrección visual;
- no garantiza accesibilidad;
- no sustituye QA.

Frontera:
Senda debe producir inputs/manifests reproducibles.
Vigía/Vector/infra correspondiente conserva ownership de provenance/release cuando aplique.

### 35.7 Manifest

Un manifest útil debe:
- incluir alcance declarado;
- excluir resultados volátiles deliberadamente cuando corresponda;
- identificar algoritmo;
- fallar si inputs cambian;
- estar enlazado con resultados de QA por digest.

No basta:
“74/74 hashes correctos”.

También hay que comprobar:
- que sean los 74 correctos;
- que el arnés correcto los usó;
- que la evidencia prueba la afirmación.

### 35.8 Gate sugerido para asset generado

1. source inputs hash;
2. generator hash/version;
3. toolchain/codec versions;
4. seed;
5. SOURCE_DATE_EPOCH si aplica;
6. output hash;
7. decode validation;
8. dimensions/colorspace;
9. visual regression;
10. accessibility/provenance metadata;
11. nominal assertion;
12. negative test.

Estado:
`SENDA_ASSET_REPRO_VISUAL_EVIDENCE_STUDIED_R07`


## 36. Optimización gráfica profunda R08

Fuentes estudiadas:
- Three.js InstancedMesh;
- Three.js LOD;
- Three.js compileAsync;
- Three.js color management;
- Three.js KTX2Loader;
- Khronos glTF/KTX2.

### 36.1 Instancing

Usar instancing cuando:
- muchos objetos comparten geometría/material;
- solo cambian transformaciones/atributos compatibles.

Beneficio:
- reducir draw calls;
- mejorar throughput del renderer.

No usar por dogma:
- si cada objeto necesita material/semántica/render muy diferente;
- si complica selección/accesibilidad sin beneficio real.

### 36.2 LOD

LOD permite cambiar geometría según distancia.

Reglas:
- nivel de detalle sirve a percepción, no solo a conteo de polígonos;
- usar hysteresis para evitar flicker de cambio;
- probar móviles y zoom;
- no degradar información significativa.

### 36.3 Shader compilation

`compileAsync()` puede precompilar materiales para evitar stutter cuando aparecen por primera vez.

Aplicación:
- precalentar solo escenas/materiales que realmente se usarán pronto;
- no convertir precompilación en descarga masiva de mundos ocultos.

### 36.4 KTX2 / Basis Universal

Ventajas:
- una textura universal;
- transcodificación al formato comprimido soportado por GPU;
- menor transferencia/memoria frente a texturas sin compresión adecuada;
- ETC1S prioriza tamaño;
- UASTC prioriza calidad, útil en normal maps y materiales donde compresión agresiva degrada.

Costes:
- transcoder WASM;
- workers;
- tiempo de transcodificación;
- pipeline de authoring.

Regla:
`COMPRESSED_FOR_GPU != FREE`.

Medir:
- bytes;
- decode/transcode;
- upload;
- memoria;
- calidad.

### 36.5 Color management

Three.js trabaja en Linear-sRGB para iluminación.
Salida de display típicamente sRGB.

Color textures:
- etiquetar sRGB cuando corresponda.

Data textures:
- normal/roughness/etc. no son color y no deben recibir conversión sRGB.

Errores de color-space pueden parecer:
- iluminación incorrecta;
- materiales lavados/oscuros;
- contraste alterado.

Regla:
no “arreglar” un error de color-space subiendo luces.

### 36.6 PBR y extensiones de material

glTF soporta:
- metallic/roughness;
- normal;
- AO;
- emissive;
- clearcoat;
- transmission;
- volume;
- anisotropy;
- iridescence;
- specular;
- sheen;
- IOR;
- etc.

Senda:
usar solo propiedades perceptivamente justificadas.

Ejemplos:
- mineral: anisotropy/IOR/iridescence solo si material real lo requiere;
- agua/cristal: transmission/volume solo si ayuda;
- no apilar efectos para “parecer premium”.

### 36.7 Degradación gráfica

Orden de degradación preferido:
1. DPR/resolución interna;
2. LOD;
3. sombras secundarias;
4. reflections/postFX;
5. densidad decorativa;
6. precision/quality de ciertos materiales;
7. fallback renderer.

No degradar:
- selección;
- significado;
- datos;
- controles;
- foco;
- accesibilidad;
- identificación de estados.

### 36.8 First-interaction readiness

Gate:
una escena no está “lista” solo porque ya se ve.

Comprobar:
- shaders/materiales críticos preparados;
- texturas críticas decodificadas/subidas;
- primera acción sin hitch;
- datos mínimos listos;
- controles activos.

Estado:
`SENDA_GRAPHICS_OPTIMIZATION_PIPELINE_STUDIED_R08`


## 37. Evaluación humana, accesibilidad y usabilidad R09

Fuentes estudiadas:
- W3C WAI · Involving Users in Evaluating Web Accessibility;
- W3C WAI · Involving Users in Web Projects;
- W3C COGA · Making Content Usable;
- COGA usability testing guidance.

### 37.1 Tres preguntas distintas

**Conformance**
¿Cumple criterios/estándares aplicables?

**Usability**
¿La persona puede completar la tarea con eficacia, eficiencia y comprensión razonables?

**Product acceptance**
¿La experiencia cumple la intención de producto y calidad esperada?

No colapsarlas en un único PASS.

### 37.2 Usuarios no sustituyen estándares

Una prueba con personas:
- descubre barreras reales;
- descubre problemas de comprensión;
- descubre fricción no detectable automáticamente.

Pero:
- una persona no representa a un colectivo;
- una muestra pequeña no demuestra conformidad;
- experiencia individual no generaliza a todas las discapacidades.

Regla:
`USER_EVALUATION + CONFORMANCE + EXPERT_REVIEW`.

### 37.3 Estándares no sustituyen usuarios

Una interfaz puede:
- tener roles correctos;
- teclado correcto;
- contraste correcto;

y aun:
- ser confusa;
- exigir demasiada memoria;
- ocultar el objetivo;
- usar lenguaje difícil;
- crear demasiadas decisiones.

Especialmente importante en COGA.

### 37.4 Momento de involucrar usuarios

No esperar al final.

Según W3C:
- ideas tempranas;
- prototipos;
- problemas concretos;
- diseño casi final.

Evaluación informal temprana puede evitar rework costoso.

### 37.5 Pruebas con personas con discapacidad cognitiva/del aprendizaje

Principios:
- el participante no puede “hacerlo mal”;
- puede parar en cualquier momento;
- comprobar que comprende tarea/pregunta;
- observar dónde duda, se ralentiza o se equivoca;
- pedir feedback sobre apoyos útiles;
- evitar presión/vergüenza;
- ética y consentimiento especialmente cuidados.

### 37.6 Qué observar en mundos de Senda

Además de “terminó/no terminó”:
- descubre qué hacer sin explicación extensa;
- puede volver a orientarse;
- recuerda dónde estaba;
- entiende qué cambió;
- diferencia dato real/simulación;
- encuentra información sin sobrecarga;
- puede corregir error;
- usa alternativa al gesto;
- entiende vocabulario;
- sabe cómo salir/volver;
- no se pierde por movimiento/sonido.

### 37.7 Métricas de usability

Posibles:
- task completion;
- errores;
- tiempo con contexto;
- puntos de bloqueo;
- ayuda solicitada;
- backtracking;
- abandono;
- comprensión posterior;
- preferencia cualitativa.

No usar tiempo como ranking de persona.

### 37.8 Human QA de María

HUMAN QA de María:
- aceptación de producto;
- dirección/resultado;
- percepción general;
- gate final según gobernanza Iris Green.

No sustituye:
- test con usuarios representativos;
- revisión Axioma;
- Lex;
- QA técnico.

### 37.9 COGA como guidance

COGA Content Usable:
- guidance suplementaria;
- no requisito adicional automático de conformidad WCAG;
- se usa porque Iris Green busca accesibilidad cognitiva real.

Estado:
`SENDA_HUMAN_EVALUATION_USABILITY_STUDIED_R09`


## 38. Capacidades modernas del navegador R10

Fuentes estudiadas:
- HTML Popover API;
- CSS Anchor Positioning;
- View Transition API.

### 38.1 Popover API

Ventajas:
- top layer;
- light dismiss;
- Escape;
- relación declarativa invoker/popover;
- integración con orden de foco;
- retorno de foco;
- relaciones implícitas aria-details/aria-expanded.

Aplicación Senda:
- fichas contextuales;
- ayudas;
- información breve asociada a un objeto/control;
- paneles no modales.

Preferir API nativa a:
- z-index wars;
- focus management manual;
- listeners globales innecesarios.

Cautelas:
- popover no sustituye dialog modal;
- contenido largo/flujo crítico puede necesitar otra arquitectura;
- probar lector de pantalla/foco real.

### 38.2 CSS Anchor Positioning

Baseline 2026 para piezas relevantes.

Permite:
- anclar panel a elemento;
- position-area;
- anchor();
- fallbacks/position tries según soporte.

Aplicación:
ficha de especie/mineral/estación asociada a un elemento DOM visible.

Regla:
no anclar accesibilidad crítica exclusivamente a soporte nuevo.
Mantener layout fallback.

### 38.3 Canvas/WebGL y anchors

Un píxel/objeto GPU no es un anchor DOM por sí solo.

Si un objeto visual necesita:
- foco;
- popover;
- etiqueta;
- control;

crear representación/overlay DOM correspondiente o mecanismo accesible equivalente.

No usar CSS Anchor Positioning como excusa para convertir todos los objetos 3D en nodos DOM.

### 38.4 View Transitions

View Transition API puede:
- ayudar a mantener contexto;
- reducir percepción de ruptura entre vistas.

Pero puede introducir:
- movimiento;
- confusión de foco;
- reading-position issues;
- live-region behavior extraño si se implementa mal.

Reglas Senda:
- enhancement;
- reduced motion;
- foco explícito cuando cambie contexto;
- no animar por animar;
- skip/fallback funcional.

### 38.5 Native-first

Nueva regla:
antes de implementar un patrón de UI complejo en JS:
1. HTML nativo;
2. CSS moderno con fallback;
3. JS solo para comportamiento no cubierto.

Objetivo:
menos código;
mejor semántica;
menos bugs;
mejor compatibilidad futura.

Estado:
`SENDA_MODERN_BROWSER_NATIVE_UI_STUDIED_R10`


## 39. Mapas interactivos accesibles R11

Fuente principal estudiada:
- MapLibre GL JS API/documentación.

### 39.1 Mapa como componente, no página completa

El mapa nunca será la única vía para:
- encontrar una estación;
- elegir una especie;
- leer un dato;
- comparar resultados;
- completar una tarea.

Debe existir representación estructurada equivalente:
- lista;
- resultados;
- tabla;
- controles;
- descripción.

### 39.2 Cooperative gestures

MapLibre permite `cooperativeGestures`.

Comportamiento:
- desktop: modificador para scroll zoom;
- móvil: dos dedos;
- gesto normal puede mostrar instrucción.

Ventaja:
evita secuestrar scroll de página accidentalmente.

Uso:
evaluar como default cuando el mapa está embebido dentro de una página larga.

### 39.3 Interacciones configurables

Handlers separados:
- scroll zoom;
- drag pan;
- drag rotate;
- keyboard;
- double click zoom;
- touch zoom/rotate.

Regla:
activar solo las interacciones que aportan.

Ejemplo:
mapa contextual LIGHT:
- puede no necesitar rotación/pitch;
- puede no necesitar scroll zoom.

Menos grados de libertad = menor carga cognitiva.

### 39.4 Teclado

MapLibre incluye navegación de mapa por teclado:
- +/- zoom;
- flechas pan;
- Shift + flechas para rotación/pitch.

Senda debe decidir:
- si rotación/pitch tiene sentido;
- si shortcuts interfieren con la página;
- cómo entra/sale foco del mapa;
- cómo se ofrece la misma información fuera del mapa.

### 39.5 Marcadores

Marcador default:
MapLibre gestiona roles/focusability según interactividad.

Custom marker:
la app posee el árbol accesible.

Obligatorio:
- role apropiado;
- nombre;
- tabindex si corresponde;
- activación teclado;
- drag alternative;
- popup/ficha accesible.

### 39.6 Draggable markers

Si un marcador se arrastra:
- pointer drag puede existir;
- debe existir single-pointer alternative;
- teclado cuando corresponda.

MapLibre tiene ejemplos de movimiento de marcador por flechas, pero Senda debe mantener patrón coherente con WCAG y UX Iris.

### 39.7 Attribution

La atribución no es decoración.
Debe conservar:
- fuente de tiles/datos;
- licencias requeridas;
- custom attribution si aplica.

Responsive:
compactar solo cuando el espacio lo requiera;
no eliminar atribución.

### 39.8 Performance de mapa

MapLibre puede exponer Resource Timing de workers si se habilita.

Medir:
- tiles;
- GeoJSON/vector;
- workers;
- fuentes;
- imágenes;
- memoria;
- zoom/pan interaction.

No cargar mapa en portada/tema si no se usa.

### 39.9 Accesibilidad cognitiva

Mapa CENTRAL:
- acción clara;
- instrucciones breves;
- reset/recentrar;
- “volver a vista inicial”;
- evitar pitch/rotación si no aportan;
- leyenda simple;
- selección visible;
- estado fuera del canvas.

Mapa LIGHT:
- preferir estático/limitado si interacción completa no aporta.

### 39.10 Trenes

Para Trenes/metro:
mapa de red no debe absorber:
- señalización;
- conexión espacial;
- wayfinding;
- accesibilidad de estación.

Si la experiencia es “cómo llego/cómo conecto”:
GTFS Pathways + representación espacial/diagrama puede ser más pertinente que mapa geográfico.

Estado:
`SENDA_ACCESSIBLE_INTERACTIVE_MAPS_STUDIED_R11`


## 40. Workers y render off-main-thread R12

Fuentes estudiadas:
- Web Workers;
- OffscreenCanvas;
- transferControlToOffscreen;
- structured clone;
- transferable objects;
- createImageBitmap en workers.

### 40.1 Qué mover a Worker

Buenos candidatos:
- render Canvas/Offscreen;
- simulación;
- geometría/procedural;
- parsing grande;
- transformaciones de datos;
- image preprocessing;
- cálculos que bloquean main thread.

No mover conceptualmente:
- DOM;
- focus management;
- accessible names;
- live regions;
- navegación semántica.

Main thread conserva interfaz accesible.

### 40.2 OffscreenCanvas

`transferControlToOffscreen()`:
- transfiere control del canvas;
- ampliamente disponible desde 2023;
- permite render fuera del main thread.

Cautela:
el canvas debe transferirse antes de crear un contexto incompatible en main.

### 40.3 Structured clone

Puede clonar:
- arrays;
- maps/sets;
- typed arrays;
- blobs;
- ImageData;
- ImageBitmap;
- objetos simples;
- etc.

No:
- functions;
- DOM nodes;
- prototipos/clases completas como comportamiento.

Regla:
mensajes Worker deben usar contratos de datos explícitos.

### 40.4 Transferables

ArrayBuffer:
puede transferirse en vez de copiarse.

Después:
el origen queda detached/no utilizable.

Uso:
- grandes buffers;
- geometría;
- imagen;
- datos binarios.

Regla:
`TRANSFER_MEANS_OWNERSHIP_CHANGE`.

Documentar:
quién posee el buffer en cada estado.

### 40.5 ImageBitmap

Puede crearse en Worker y servir como recurso de imagen eficiente.

Aplicación potencial:
- decode/preprocess;
- sprites;
- composiciones;
- raster generado.

No confundir:
ImageBitmap pipeline con semántica de imagen.
Alt/descripción sigue en DOM.

### 40.6 Worker protocol

Mensajes recomendados:
- type;
- requestId;
- version;
- payload;
- transferable ownership;
- error shape.

Evitar:
objetos implícitos sin schema.

### 40.7 Backpressure

No enviar:
60 mensajes/segundo de estado completo si no hace falta.

Opciones:
- coalescing;
- latest-wins;
- transferable buffers;
- batches;
- event thresholds.

Objetivo:
mover trabajo fuera del main sin saturar message queue.

### 40.8 Error/fallback

Si Worker:
- falla;
- tarda;
- no soporta feature;

fallback:
- ruta main-thread reducida;
- representación estática;
- menor calidad;
- estado preservado.

No:
pantalla vacía.

### 40.9 Accesibilidad

Worker nunca es excusa para:
- ocultar estado;
- perder foco;
- retrasar announcements indefinidamente;
- dibujar texto esencial como píxel.

Patrón:
Worker produce visual/calculation result →
main actualiza state/DOM semántico.

### 40.10 Performance proof

Mover a Worker solo si medición demuestra beneficio.

Medir:
- main-thread time;
- INP;
- messaging overhead;
- transfer/copy;
- Worker CPU;
- first interaction;
- memory.

No:
“Workers son más rápidos” como supuesto universal.

Estado:
`SENDA_WORKERS_OFFMAIN_RENDER_STUDIED_R12`
