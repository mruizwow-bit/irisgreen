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
