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
