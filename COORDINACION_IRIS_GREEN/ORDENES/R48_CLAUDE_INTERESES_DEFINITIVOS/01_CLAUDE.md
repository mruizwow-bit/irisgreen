# ORDEN DE MARÍA · CLAUDE · INTERESES DEFINITIVOS

Fecha: 27/09/2026  
Responsable de construcción: **Claude**  
Revisión previa: **Astra**  
Puerta de integración: **A2**  
Aceptación final: **HUMAN QA de María**

Se conservan las **72 temáticas**. El problema no es el catálogo: es la incoherencia de alcance y experiencia.

R48 reconstruye Intereses + Cuaderno como 72 experiencias curadas, coherentes y distintas. No convierte cada tema en “todo Internet / toda NASA / todos los mapas / todos los registros”.

---

# 0. DIAGNÓSTICO ASTRA SOBRE R42-A4

Fuente actual auditada:
branch `agent4/r42-interests-visual-20260926`.

## Hallazgo 1 · alcance enciclopédico

De 72 intereses, **20 ya están redactados explícitamente como “todo/todos/todas”**:
- todas las estrellas;
- todos los exoplanetas;
- todas las misiones;
- todas las especies;
- todos los volcanes;
- todas las banderas;
- todas las redes de metro;
- todos los aeropuertos;
- todas las señales;
- todas las lenguas;
- todos los sistemas de escritura;
- etc.

Esto empuja al producto a ser un agregador universal en vez de una experiencia curada.

## Hallazgo 2 · 72 temas metidos en 11 firmas de modos

Ejemplos actuales:
- 7 temas cosmos comparten `Explorar | Tiempo | Comparar | Simular`;
- 9 Tierra comparten `Mapa | Capas | Tiempo | Comparar`;
- 11 seres vivos comparten `Observar | Clasificar | Comparar | Escuchar`;
- 9 transporte comparten `Rutas | Mecanismo | Comparar | Simular`.

Compartir infraestructura está bien. Compartir una experiencia genérica que no responde a la temática, no.

## Hallazgo 3 · canvas procedural genérico

`assets/r42-interests.js` genera visuales procedurales por familia.

Puede conservarse para:
- portada;
- preview;
- placeholder/fallback.

NO puede ser la experiencia profunda final de 72 temas.

## Hallazgo 4 · Design R02 no implementado

En los activos auditados:
- `ig-r42-materials`: 0;
- `IGPreferences`: 0;
- `prefers-reduced-transparency`: 0.

## Hallazgo 5 · child-safe no implementado

En los activos/datos auditados:
- `SAFE_BY_DEFAULT`: 0;
- `S2_HIGH_SENSITIVITY`: 0;
- `sensitivity`: 0;
- `discovery`: 0.

Existe un addendum de enlaces child-safe, pero no un contrato técnico aplicado al producto.

## Hallazgo 6 · fuente de datos confundida con producto

Ejemplos:
- NASA Exoplanet Archive puede devolver tablas extensas;
- NASA Eyes explora cientos de cuerpos y >170 misiones;
- GBIF almacena enormes volúmenes de ocurrencias;
- The Met ofrece >492k obras Open Access;
- Wikidata puede consultar enormes grafos.

**Que una fuente tenga millones de datos no autoriza a mostrarlos todos.**

---

# 1. REGLA MAESTRA

## FUENTE DE DATOS ≠ ALCANCE DE LA EXPERIENCIA

Cada interés debe contestar:

1. **¿Qué pregunta concreta viene a explorar la persona?**
2. **¿Qué acción principal puede hacer?**
3. **¿Qué subconjunto mínimo de datos necesita para hacerlo bien?**
4. **¿Qué queda detrás como profundidad/búsqueda bajo demanda?**
5. **¿Qué NO pertenece a esta temática aunque exista en la fuente?**

La experiencia decide el dato.

El dataset NO decide la experiencia.

---

# 2. ARRANQUE OBLIGATORIO

Antes de tocar código:

1. leer esta orden completa;
2. leer Control Maestro;
3. leer Memoria Maestra;
4. leer #287;
5. leer #293/#302 child-safe;
6. leer #301 Design R02;
7. leer #308 R47 para compartir contrato de etapa/storage cuando corresponda;
8. leer la rama A4 actual;
9. releer HEAD/tree A2 vigente;
10. publicar `R48_CLAUDE_INTERESES_BASE_READ`;
11. construir en la misma sesión;
12. actualizar Memoria + Control.

---

# 3. PRECEDENCIA

A4 R42 pasa a estado:
`DONOR_NOT_FINAL`.

Conservar de A4:
- catálogo 72;
- grupos 11;
- rutas ES/EN;
- procedencia;
- READY/HOLD;
- experiencias profundas ya válidas (Cielo, Sistema Solar, Exoplanetas, Eclipses cuando proceda);
- conexiones con Taller;
- Cuaderno base;
- tests útiles.

No conservar como arquitectura final:
- 11 plantillas repetidas;
- canvas genérico como experiencia principal;
- objetivos “todo/todos/todas”;
- mapa como patrón por defecto;
- exposición del universo completo de una API.

---

# 4. CONTRATO DE EXPERIENCIA 72/72 · ANTES DE CODIFICAR

Claude debe crear una matriz machine-readable de 72 filas.

Por interés:

- id;
- título ES;
- título EN;
- grupo;
- **pregunta central**;
- **acción humana principal**;
- renderer principal;
- modos secundarios;
- source(s);
- **subset/query exacto**;
- entidades iniciales;
- profundidad bajo demanda;
- `must_not_load`;
- `map_role = NONE | PRIMARY | SECONDARY`;
- live/snapshot;
- refresh cadence si procede;
- REAL_DATA / SIMULATION / USER_CREATED / FICTIONAL;
- audience[];
- sensitivity;
- discovery;
- safe_variant_id;
- etapa y qué cambia realmente;
- relación con Taller;
- criterio HUMAN QA.

Criterio:
**0 filas sin contrato.**

No construir 72 páginas nuevas antes de que esta matriz exista en el branch.

---

# 5. PRESUPUESTO EDITORIAL DE DATOS

Regla por defecto:
- primer viewport / primera experiencia: **8–24 objetos significativos**;
- listas mayores solo cuando el objeto del interés lo justifique;
- búsqueda bajo demanda para colecciones grandes;
- paginación/virtualización si procede;
- jamás “fetch all” solo porque la API lo permite.

Excepciones válidas:
- tabla periódica: 118 elementos porque el objeto completo ES la tabla;
- una lista finita pequeña cuya completitud sea la experiencia;
- cualquier otra excepción debe documentar por qué “todo” mejora la experiencia.

No usar un número como dogma; usar **carga cognitiva + propósito**.

---

# 6. MAPAS · REGLA DURA

Un mapa solo existe cuando **la localización responde a la pregunta**.

No usar “mapa mundial” porque:
- MapLibre lo permite;
- hay coordenadas disponibles;
- el grupo se llama Tierra;
- la fuente contiene localización.

## `map_role=PRIMARY`
Solo cuando la geografía es la experiencia:
- Mapas y geografía;
- terremotos;
- volcanes cuando se explora ubicación;
- distribución de especies cuando esa es la pregunta;
- estaciones/redes cuando la red espacial es esencial;
- eclipses/ISS cuando la ubicación cambia el resultado.

## `map_role=SECONDARY`
Cuando ayuda pero no domina:
- idiomas;
- castillos;
- monedas;
- fósiles;
- aves.

## `map_role=NONE`
Cuando no aporta:
- mecanismos;
- Rubik;
- programación;
- circuitos;
- fotografía;
- cómic;
- cocina;
- etc.

### Un solo mapa activo
No apilar:
- mapa mundial;
- globo;
- heatmap;
- capas;
- mini-mapas
simultáneamente.

Un renderer geográfico principal y progressive disclosure.

---

# 7. NASA / ESPACIO · CURACIÓN OBLIGATORIA

NASA NO es una categoría única de datos.

## 01 · Cielo nocturno
Pregunta:
`¿Qué puedo ver en el cielo y cómo se relacionan las constelaciones?`

Fuente:
HYG/IAU/atlas astronómico.

NO:
- misiones;
- exoplanetas;
- todo NASA.

## 02 · Sistema Solar
Pregunta:
`¿Cómo se comparan y se mueven los cuerpos principales del Sistema Solar?`

Primario:
- Sol;
- 8 planetas;
- selección de lunas relevantes.

JPL/NASA solo aporta los campos necesarios.

NO:
- todas las misiones;
- todo Mars terrain;
- todo Eyes.

## 03 · Exoplanetas
Pregunta:
`¿Cómo descubrimos planetas fuera del Sistema Solar y qué ejemplos ayudan a entender su diversidad?`

Primera experiencia:
- 12–24 exoplanetas representativos;
- diversidad de método/tamaño/periodo/sistema.

Profundidad:
- búsqueda bajo demanda en NASA Exoplanet Archive;
- query TAP con **columnas explícitas**;
- no `select *` en producción.

NO:
- cargar todos los planetas/estrellas en payload inicial;
- copiar la UI completa de NASA Eyes.

## 04 · Eclipses
Pregunta:
`¿Cuándo y desde dónde se verá el próximo eclipse relevante para mí?`

Default España:
- 2026/2027/2028;
- ubicación manual;
- geolocalización opcional solo tras acción futura autorizada.

NO:
- archivo mundial completo de eclipses como inicio.

## 05 · Lluvias de estrellas
Pregunta:
`¿Qué lluvias importantes puedo observar este año y de dónde parecen venir?`

Primario:
- principales lluvias del año;
- radiante;
- fechas.

## 06 · Exploración espacial
Pregunta:
`¿Qué hitos cambiaron la exploración espacial?`

Primario:
- línea del tiempo curada, ~12–20 hitos;
- no “todas las misiones”.

Profundidad:
- buscar una misión concreta.

## 07 · ISS / satélites
Pregunta:
`¿Cuándo puedo ver la ISS y por qué pasa por ahí?`

Primario:
- ISS;
- ubicación manual;
- explicación orbital.

NO:
- catálogo de todos los satélites.

---

# 8. EJEMPLOS DE CURACIÓN EN OTROS GRUPOS

## Minerales
No “>6.000 minerales en portada”.
Primario:
- sistemas cristalinos;
- 12–24 ejemplos;
- comparar dureza/color/hábito.

Buscar mineral concreto = profundidad.

## Fósiles
Primario:
- línea temporal;
- yacimientos seleccionados de España;
- especies representativas.

PBDB completo queda backend/profundidad.

## Volcanes
Default:
- Canarias + tipos principales;
- 8–16 ejemplos comparables.

“Global” = modo secundario, no globo mundial por defecto.

## Terremotos
Default:
- España reciente/histórica relevante;
- magnitud/profundidad;
- máximo conjunto manejable.

Mundo = toggle secundario con muestra reciente limitada.

## Mapas y geografía
**Aquí sí pertenece el mundo.**
Experiencia:
- proyecciones;
- fronteras/capitales;
- escala;
- capas culturales/físicas.

No duplicar ese globo en otros 20 intereses.

## Banderas
Galería/búsqueda.
No 195 banderas simultáneamente en primer viewport.

## Aves
Default:
- especies frecuentes/representativas de España por hábitat/temporada;
- sonido solo con licencia.

GBIF = consulta filtrada, no mapa mundial de todas las ocurrencias.

## Perros
Primario:
- grupos y diversidad corporal/funcional;
- ejemplos.

Catálogo completo si se mantiene = búsqueda secundaria.

## Metros del mundo
No todas las redes a la vez.

Primario:
- comparar 4–6 redes seleccionadas una a una;
- mapa de la red seleccionada;
- estructura, escala, correspondencias.

Buscar ciudad = profundidad.

## Internet
Primario:
`cómo viaja un mensaje`.

Mapa de cables = secundario.
No mapa mundial gigante como experiencia principal.

## Idiomas del mundo
Primario:
- árbol de familias;
- seleccionar una lengua/familia;
- entonces mostrar su área.

No mapa con “todas las lenguas” simultáneo.

## Historia
No timeline infinito.
Primario:
- elegir periodo/tema;
- timeline acotado;
- profundidad progresiva.

## Mitología
Una tradición/cultura activa cada vez.
No mezclar “todos los dioses del mundo”.

## Pintura y museos
The Met ofrece >492k obras OA.

Iris Green:
- recorrido curado 12–24 obras;
- tema/técnica/artista;
- zoom de detalle;
- buscar obra/artista = profundidad.

Usar IIIF cuando una institución lo ofrezca y tenga sentido.

## Química
La tabla de 118 elementos sí es una excepción coherente:
el conjunto completo es la experiencia.

PubChem NO significa cargar todos los compuestos.

---

# 9. FAMILIAS DE RENDERER, NO PLANTILLAS DE CONTENIDO

Se pueden compartir motores:

- atlas astronómico;
- mapa;
- timeline;
- taxonomía/árbol;
- galería/IIIF;
- mecanismo/cutaway;
- simulador;
- comparador;
- sonido;
- colección;
- laboratorio.

Pero cada interés declara:
- qué renderer usa;
- qué controles tiene;
- qué modos existen;
- qué dato consume.

Prohibido:
un mismo “Probar en el escenario” que solo cambia un número en un canvas genérico.

---

# 10. PORTADA 72

Mantener 11 grupos.

Primer viewport:
- título;
- `Contenido para…`;
- búsqueda;
- 3–5 exploraciones destacadas;
- 11 grupos visuales secundarios;
- Cuaderno de Campo.

No:
- 72 tarjetas;
- tabla completa primero;
- mapa mundial como fondo universal.

El canvas procedural actual puede vivir como ambient/preview, no como contenido factual.

---

# 11. DETALLE DE INTERÉS

Orden:

1. volver/grupo;
2. título + una pregunta;
3. **experiencia primaria inmediatamente**;
4. una acción clara;
5. modos secundarios compactos;
6. “Profundizar”;
7. Fuentes;
8. Taller relacionado;
9. Guardar/colección.

No párrafo genérico:
`Visualización interactiva. Los datos detallados...`

Cada tema escribe copy específico.

---

# 12. DATOS LIVE VS SNAPSHOT

## SNAPSHOT CURADO por defecto
Preferir cuando:
- datos cambian poco;
- fuente es enorme;
- disponibilidad externa puede romper la experiencia;
- child-safe exige revisión;
- licencia/procedencia necesita congelarse.

Registrar:
- query;
- versión;
- fecha;
- hash;
- fuente;
- licencia.

## LIVE solo cuando aporta
Ejemplos:
- terremotos recientes;
- paso ISS;
- tiempo/observación si se aprueba;
- ciertas efemérides.

Live:
- bajo acción;
- fallback;
- timeout;
- caché controlada;
- no dependencia única.

No conectar cada página directamente a una API externa.

---

# 13. FUENTES · QUERY BUDGET

Cada fuente externa declara:
- endpoint;
- campos usados;
- filtros;
- límite;
- cache/snapshot;
- licencia;
- atribución;
- frecuencia;
- fallo/fallback.

## NASA Exoplanet Archive
Usar TAP con columnas explícitas.
No `select *`.
No cargar tablas enteras.

## GBIF
Usar filtros taxonómicos/geográficos concretos.
No intentar recuperar todo el occurrence store.
No paginar ciegamente hasta “tenerlo todo”.

## Wikidata
Queries focalizadas.
El propio WDQS no es adecuado para extraer una proporción sustancial de Wikidata.

## The Met
Curación por departamento/tema/obra.
No cargar 492k items en cliente.

## Natural Earth
Elegir escala/dataset adecuados.
No cargar todas las capas porque sean public domain.

---

# 14. TECNOLOGÍA

## MapLibre GL JS
Sí para experiencias geográficas reales.

No como renderer universal.

Self-host/bundle cuando proceda.
Attribution correcta.
Lazy-load solo en temas con mapa.

## Aladin Lite
Candidato para cielo real.
No cargar en temas no astronómicos.

## WebGPU/Three
Solo donde 3D aporte:
- sistema solar;
- cristales;
- mecanismos/3D;
- relieve.

Fallback WebGL2/Canvas.

## OffscreenCanvas/Workers
Solo donde reduzca bloqueo real.

## IIIF
Preferir para patrimonio/museos cuando la institución lo exponga:
- zoom;
- regiones;
- imágenes de alta calidad;
- atribución.

IIIF v3 estable; v4/3D todavía no es baseline de R48.

## View Transitions
Enhancement opcional; reduced motion anula.

---

# 15. DESIGN R02

100 % de rutas Intereses/Cuaderno deben consumir R02:
- `ig-r42-materials.css`;
- `IGPreferences`;
- Normal/Reduced/Opaque;
- forced colors;
- reduced motion/transparency.

Cristal:
- chrome.

Opaco:
- mapas/atlas/galerías/lectura/datos.

No glass-on-glass.

---

# 16. CHILD-SAFE

Contrato común #293/#302/Home/Taller.

Todo discoverable:
- audience[];
- sensitivity;
- discovery;
- safe_variant_id;
- review_reason.

Sin selección:
`SAFE_BY_DEFAULT`.

Filtrar ANTES de:
- búsqueda;
- autocomplete;
- destacados;
- relacionados;
- Taller link;
- fuentes sugeridas;
- contenido externo.

No inferir edad/diagnóstico.

## Fuentes externas
No convertir búsquedas libres externas en una vía para saltarse child-safe.

En infancia/adolescencia:
- queries predefinidas/curadas;
- resultados sanitizados;
- no recomendaciones externas incidentales sensibles.

---

# 17. ETAPA DE VIDA

Infancia / Adolescencia / Adultez / Cualquier edad.

Etapa cambia:
- scaffolding;
- densidad;
- vocabulario;
- número de controles visibles;
- tipo de pregunta.

No cambia hechos.

No limita herramientas por edad.

No perfil.

---

# 18. CUADERNO DE CAMPO

No convertir Cuaderno en “mapa mundial + formulario”.

Debe ser un workspace de observación.

Una observación puede tener:
- título;
- fecha/hora opcional;
- nota;
- clasificación;
- dibujo/foto local opcional;
- fuente/interés;
- lugar opcional.

## Mapa
Solo aparece si:
- la observación tiene lugar;
- la persona abre “Lugar”.

No geolocalización al entrar.

Default:
- manual;
- sin mapa si no hace falta.

Mantener clases:
- REAL_DATA
- SIMULATION
- USER_CREATED
- FICTIONAL

---

# 19. STORAGE

Compartir contrato R47:

Por defecto:
- memoria de sesión;
- no persistencia oculta.

Guardar:
- export manual.

Conservar localmente:
- opt-in;
- reversible;
- capa compartida;
- no crear storage paralelo A4.

Mi colección tampoco se persiste automáticamente sin elección explícita.

---

# 20. RENDIMIENTO

Portada:
NO cargar:
- MapLibre;
- Aladin;
- Three;
- GBIF;
- NASA;
- IIIF viewers;
- datasets grandes.

Cada tema lazy-load su motor.

Medir:
- JS inicial;
- payload inicial;
- datos externos;
- tiempo a experiencia usable;
- memoria;
- long tasks.

Gate:
**el payload inicial de una temática contiene solo lo necesario para su primera experiencia.**

---

# 21. QA 72/72

Por cada interés:
- ES/EN;
- pregunta central visible;
- renderer correcto;
- dataset subset correcto;
- no “todo” innecesario;
- no mapa innecesario;
- experiencia funcional;
- teclado;
- mobile;
- R02;
- child-safe;
- source/provenance;
- fallback;
- Taller link coherente.

## Auditoría de coherencia
Claude entrega una tabla:
- `WHY_THIS_DATA`;
- `WHY_THIS_RENDERER`;
- `WHY_NOT_MORE`.

Si no puede justificar un mapa/dataset/modo, se elimina.

---

# 22. HUMAN QA

Claude debe explorar de verdad al menos:
- 2 cosmos;
- 2 Tierra;
- 2 seres vivos;
- 2 transporte;
- 1 tecnología;
- 1 lógica;
- 1 lengua;
- 1 historia;
- 1 arte;
- 1 mundos;
- 1 vida diaria;
- Cuaderno.

Astra revisa además la matriz 72/72.

María prueba preview integrada.

Si María ve:
- todos los mapas;
- todos los datos;
- un dataset gigantesco sin propósito;
- la misma experiencia con otro título;
- información abrumadora;
=> FAIL.

---

# 23. ENTREGA

- branch;
- base/head/tree;
- PR;
- matriz 72/72;
- audit old→new;
- datos eliminados y motivo;
- mapas eliminados y motivo;
- queries;
- snapshots;
- manifests;
- Design R02 coverage;
- child-safe registry;
- ES/EN;
- Cuaderno;
- performance;
- QA;
- screenshots;
- memoria/control.

Marcador:
`R48_CLAUDE_INTERESES_REBUILD_READY_FOR_ASTRA`.

Secuencia:
Claude → Astra → A2 → Deploy Preview → María HUMAN QA.

No main.  
No producción.  
No deploy propio.  
No tocar Home A8.  
No tocar Cloud A9.  
No tocar voz Sabik.  
No reabrir R47 Taller salvo enlaces/contrato compartido.

---

# 24. REFERENCIAS DE INVESTIGACIÓN

- NASA Exoplanet Archive TAP:
  https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html
- NASA Eyes:
  https://science.nasa.gov/eyes/
- GBIF API:
  https://techdocs.gbif.org/en/openapi/v1/occurrence
- MapLibre:
  https://maplibre.org/maplibre-gl-js/docs/
- Natural Earth:
  https://www.naturalearthdata.com/
- Wikidata data access:
  https://www.wikidata.org/wiki/Wikidata:Data_access
- The Met Open Access:
  https://www.metmuseum.org/hubs/open-access
- IIIF:
  https://iiif.io/api/

---

# BLOQUE NORMATIVO EMBEBIDO

LEER y dejar memoria actualizada de tu trabajo, con hoja de control https://github.com/mruizwow-bit/irisgreen/tree/coordinacion/iris-green-canonica-20260924/COORDINACION_IRIS_GREEN

La web es bilingüe, así que el inglés tiene que estar perfectamente montado también. La traducción la hacéis vosotros mismos, no se usa otro agente para ello.
Comprobar la configuración de la versión web y de la versión móvil.

MARCO_NORMATIVO_TRANSVERSAL_R01
Fecha: 22/09/2026
Función: referencia transversal derivada de la documentación del proyecto.
Importante: este archivo NO es una nueva orden de producto y NO amplía el alcance de ningún agente.
1. Aclaración de fuente
El archivo histórico llamado NORMATIVA ACTUALIZADA WEB.docx / NORMATIVA ACTUALIZADA WEB(1).docx es en realidad una orden de Astra al Agente n.º 4 sobre Sabik Web que contiene, dentro de esa orden, un marco normativo y de accesibilidad.
Por tanto:
•	sus instrucciones específicas de producto Sabik NO se trasladan automáticamente a Iris, Claude, Design u otros carriles;
•	sus secciones normativas sí se conservan como referencia transversal cuando corresponda;
•	cada agente aplica solo las normas relevantes a su propio alcance;
•	ninguna norma se usa para reabrir un producto o decisión fuera de la orden vigente.
2. Referencias técnicas y de contenido conservadas
Marco mínimo documentado por el proyecto:
•	WCAG 2.2 AA;
•	ISO/IEC 40500:2025 · adopción de WCAG 2.2;
•	EN 301 549 V4.1.1 (2026-09) como objetivo técnico actual;
•	ISO 24495-1:2023 · lenguaje claro;
•	ISO 9241-171:2025 · accesibilidad de software;
•	ISO 9241-210:2019 · diseño centrado en las personas;
•	ISO 9241-11:2018 · usabilidad;
•	ISO 9241-112:2025 · presentación de la información;
•	W3C COGA como capa adicional para discapacidad cognitiva, aprendizaje y neurodiversidad;
•	UNE 153101:2018 EX cuando se produzca Lectura Fácil formal;
•	PDF/UA-2 · ISO 14289-2:2024 para nuevos PDF públicos;
•	Comisión Braille Española para transcripción braille específica.
3. Reglas de contenido y accesibilidad
Aplicar según el recurso:
•	HTML semántico;
•	orden lógico;
•	idioma correcto;
•	nombres accesibles;
•	texto real compatible con tecnologías de apoyo;
•	imágenes clasificadas como decorativas, informativas, funcionales o complejas;
•	alternativa textual apropiada;
•	descripción extensa cuando sea necesaria;
•	datos no solo como imagen;
•	tablas con encabezados reales;
•	transcripción/equivalente textual para audio significativo;
•	subtítulos para vídeo cuando correspondan;
•	audiodescripción cuando corresponda;
•	no usar color como único canal;
•	lenguaje claro sin infantilizar;
•	información principal primero;
•	términos técnicos explicados.
4. Privacidad y minimización
Cuando exista interacción o datos:
•	no pedir datos innecesarios;
•	especial cuidado con salud, discapacidad, diagnóstico, menores, comportamiento y preferencias;
•	no convertir contenidos informativos en mecanismos de recopilación sensible;
•	aplicar RGPD/LOPDGDD cuando corresponda al tratamiento real.
5. Fuentes y trazabilidad
Por cada dato relevante conservar, cuando aplique:
•	fuente;
•	organismo;
•	URL;
•	fecha de publicación;
•	fecha de consulta;
•	jurisdicción;
•	versión;
•	vigencia;
•	última revisión.
Prioridad documental:
1.	legislación y organismos oficiales;
2.	organismos internacionales;
3.	guías oficiales;
4.	universidades;
5.	literatura revisada por pares;
6.	organizaciones profesionales;
7.	asociaciones reconocidas.
Todo trabajo debe quedar:
investigado → documentado → versionado → revisable por Astra.
Ningún gate se aprueba solo con un resumen de chat.
6. Matices jurídicos documentados
La documentación del proyecto registra:
•	EN 301 549 V4.1.1 como objetivo técnico nuevo;
•	a 20/09/2026, pendiente su citación en DOUE como referencia armonizada;
•	V3.2.1 continúa como referencia jurídica armonizada mientras no exista esa citación;
•	Real Decreto 707/2026 sobre accesibilidad cognitiva: preparación normativa, con entrada en vigor indicada por el proyecto para 02/01/2027;
•	el encaje jurídico concreto de cada superficie debe comprobarse, no presumirse.
7. Regla de uso por agentes
Antes de ejecutar:
1.	leer Control Maestro vigente;
2.	leer Memoria Maestra vigente;
3.	leer este marco transversal;
4.	leer la fuente exacta de su carril;
5.	leer su orden actual.
Si una norma o documento parece ampliar el scope fuera de la orden:
STOP y reconciliar con Astra.


pues lo quiero en español e ingles y no quiero que me digas yo no puedo hacerlo, si puedes, porque lo has hecho anteriormente, otra cosa es que es mejor delegar tu trabajo en otros, y yo no funciono asi, tu das el trabajo terminado, tanto en español como en ingles y el ingles lo traduces, porque tambien construyes paginas en ingles. Adaptado a la normativa de isos tanto de adapatabilidad, como de lectura
BRIEF DESIGN R02 · MUCHOS MÁS JUEGOS + RUTINAS DESCARGABLES + PICTOGRAMAS · TODAS LAS EDADES
24/09/2026

AUTORIDAD
DEC-113
DEC-114
DEC-110 / DEC-109 / DEC-024 / DEC-023

REGLA BASE
La web Iris Green existente es la base canónica.
Design adapta sus recursos a Iris Green.
No se sustituye la web por una página de prototipo.

==================================================
1. CAMBIO DE ALCANCE: NO ES SOLO INFANCIA
==================================================

Los recursos deben servir para distintas etapas de vida.

Etiquetas de etapa:
- INFANCIA
- ADOLESCENCIA
- ADULTEZ
- TRANSVERSAL / CUALQUIER EDAD

No se exige diagnóstico para utilizar un recurso.

Incluir explícitamente:
- adolescentes;
- personas adultas diagnosticadas;
- personas adultas sin diagnóstico o sin identificación formal;
- personas que solo buscan apoyo para organización, secuenciación, transiciones,
  sensibilidad sensorial, memoria de trabajo, planificación, motricidad o comunicación.

NO:
- infantilizar la adultez;
- usar estética infantil por defecto;
- presentar un juego como prueba diagnóstica;
- inferir que una persona es neurodivergente por necesitar un apoyo;
- exigir elegir una condición para acceder a una herramienta.

Filtros públicos preferidos:
- etapa de vida;
- contexto;
- habilidad/necesidad;
- duración;
- tipo de actividad.

==================================================
2. INVENTARIO EXISTENTE QUE NO SE PUEDE PERDER
==================================================

Auditoría existente:
- 130 juegos legacy actuales;
- 42 juegos image-first de rutina en backlog actual;
- 92 rutinas;
- 427 pasos;
- 18 mecánicas definidas;
- 405 mapeos candidatos Mulberry;
- 149 ya en el sistema actual;
- 223 ampliables de la misma colección;
- 33 alternativas aproximadas;
- 22 pasos sin equivalente encontrado.

Los 42 juegos actuales NO son el total.
Los 10 B1 NO son el total.
B1/B0/piloto son lenguaje interno y no deben aparecer en interfaz pública.

==================================================
3. OBJETIVO DE CATÁLOGO DE JUEGOS
==================================================

No cerrar el programa con 42 juegos.

Objetivo operativo de la primera biblioteca completa:
AL MENOS 200 juegos/actividades funcionales ÚNICOS tras deduplicar.

Fuente de expansión:
A. crear juegos NUEVOS derivados de las 92 rutinas;
B. reutilizar las 18 mecánicas como patrones funcionales;
C. partir del backlog image-first útil sin quedar limitado por él;
D. crear actividades nuevas para adolescencia, adultez y uso transversal;
E. crear variaciones por contexto/etapa solo cuando la experiencia cambie de verdad;
F. no contar los 427 pasos como 427 juegos;
G. NO usar los 130 juegos retirados como fuente de rediseño o migración.

Cada juego debe tener:
- ID público limpio;
- nombre;
- etapa(s);
- contexto(s);
- habilidad/necesidad;
- mecánica;
- objetivo observable;
- instrucciones muy breves;
- modo imagen-first siempre que sea viable;
- alternativa textual/accesible;
- teclado;
- reduced motion si hay movimiento;
- estado de completado que no dependa solo de color;
- sin lenguaje diagnóstico.

Tipos útiles:
- ordenar secuencias;
- encontrar qué falta;
- elegir el primer paso;
- antes/después;
- clasificar objetos;
- preparar una mochila/bolso;
- elegir ropa según contexto;
- organizar una compra;
- planificar una salida;
- usar transporte;
- preparar una cita o trámite;
- organizar una jornada de estudio/trabajo;
- priorizar tareas;
- dividir una tarea grande;
- detectar una transición;
- ruta visual;
- checklist visual;
- memoria visual;
- busca y encuentra funcional;
- emparejar objeto ↔ acción;
- microsecuencias de motricidad;
- tablero de opciones;
- decisión entre alternativas válidas;
- simulación simple de contexto cotidiano.

==================================================
4. CONTEXTOS OBLIGATORIOS MÁS ALLÁ DE INFANCIA
==================================================

ADOLESCENCIA
- preparar mochila/material;
- cambiar de aula;
- organizar deberes;
- estudiar para examen;
- preparar presentación;
- usar transporte;
- gestionar horarios;
- higiene/cuidado personal;
- preparar ropa;
- comer fuera de casa;
- compras pequeñas;
- pedir ayuda;
- planificar una quedada;
- cambios de plan;
- empezar/terminar una tarea;
- uso equilibrado de pantallas;
- ordenar habitación/material.

ADULTEZ
- salir de casa;
- transporte público;
- orientarse con mapas;
- preparar bolso/mochila de trabajo;
- llegar a una cita;
- hacer una llamada;
- responder un correo;
- preparar una reunión;
- dividir una tarea laboral;
- hacer una compra;
- cocinar;
- limpiar;
- lavar ropa;
- organizar facturas/documentos;
- hacer un trámite;
- preparar una visita o viaje;
- comer fuera;
- planificar descanso;
- volver a casa después de un día exigente;
- cambio inesperado de plan;
- priorizar cuando hay demasiadas tareas;
- preparar ropa y objetos la noche anterior.

ADULTEZ SIN DIAGNÓSTICO
La web no debe etiquetar a la persona.
Los recursos se presentan por necesidad práctica:
"Si esto te cuesta, aquí tienes una forma visual de dividirlo."

==================================================
5. BIBLIOTECA DESCARGABLE DE RUTINAS
==================================================

Las 92 rutinas deben tener una salida pública descargable progresiva.

Formatos por rutina, cuando aplique:
1. A4 completa;
2. tira vertical/horizontal para nevera o pared;
3. tarjetas de pasos;
4. primero → después;
5. checklist visual;
6. versión pantalla;
7. PDF impresión;
8. PNG/JPG de hoja completa;
9. ES;
10. EN cuando la traducción esté aprobada.

No todas las rutinas necesitan todos los formatos, pero cada rutina debe tener
al menos un descargable útil.

La página pública debe mostrar:
- preview;
- pasos;
- descarga;
- fuente/licencia del pictograma;
- etapa/contexto sugerido;
- texto alternativo.

==================================================
6. PICTOGRAMAS
==================================================

Usar primero la auditoría ya hecha.
NO repetir la investigación desde cero.

Fuente principal actual:
Mulberry Symbols.

Prioridad:
1. MATCH_CURRENT_SYSTEM
2. MATCH_CURRENT_SYSTEM_AMPLIABLE
3. POSSIBLE_ALTERNATIVE solo con revisión humana
4. NOT_FOUND → buscar/producir alternativa compatible

No usar ARASAAC en esta línea mientras siga descartado por licencia del proyecto.

Para cada pictograma conservar:
- proveedor;
- ID/nombre;
- enlace fuente;
- enlace preview;
- licencia;
- atribución;
- estado editorial;
- relación con rutina/paso.

==================================================
7. MARCA DE AGUA IRIS GREEN · OBLIGATORIA
==================================================

TODO descargable producido por Iris Green debe llevar marca de agua.

Texto:
IRIS GREEN · irisgreen.eu

No usar la flor antigua.

Aplicar en:
- PDFs;
- hojas A4;
- tiras;
- tarjetas;
- first/then;
- checklists;
- imágenes exportadas;
- composiciones de pictogramas;
- fichas de juego imprimibles.

Ubicación preferida:
- esquina inferior derecha o pie;
- visible al imprimir;
- discreta;
- no cubre información;
- no tapa pictogramas;
- contraste suficiente sin dominar.

En documentos multipágina:
marca en TODAS las páginas.

Para assets de terceros:
la marca de agua identifica la composición/edición Iris Green,
NO sustituye la atribución del autor del pictograma
y NO debe sugerir que Iris Green posee el pictograma original.

Pie de licencia/atribución separado y legible.

==================================================
8. NO PERDER ATRIBUCIÓN
==================================================

Para Mulberry mantener atribución compatible con el expediente del proyecto:
Mulberry Symbols © Garry Paxton 2008-2017, © Steve Lee 2018-2026.
CC BY-SA. mulberrysymbols.org

Hasta cerrar definitivamente la discrepancia de versión de licencia:
- no borrar referencias de licencia;
- mantener source URL por asset;
- mantener trazabilidad en manifest;
- marcar el paquete como pendiente de pin exacto de licencia si procede.

==================================================
9. ARQUITECTURA PÚBLICA
==================================================

La página no debe mostrar inventario técnico.

Eliminar:
- "42 juegos";
- "10 piloto B1";
- "Banco funcional";
- "427/427";
- "mapeo";
- "referencia interna";
- "reconciliación";
- IDs de QA.

La persona debe ver:
- qué quiere hacer;
- para qué sirve;
- cómo empezar;
- descargar si quiere.

==================================================
10. ENTREGA DESIGN
==================================================

Primera entrega R03:
- arquitectura de biblioteca de juegos;
- arquitectura de biblioteca de rutinas descargables;
- sistema de filtros por etapa/contexto/habilidad;
- plantilla de juego Iris Green;
- plantilla de rutina descargable;
- watermark aplicada;
- 20 juegos representativos que demuestren infancia/adolescencia/adultez/transversal;
- 12 rutinas descargables completas como muestra de sistema;
- manifest de pictogramas usados;
- no full-page shell replacement.

Después del visto bueno:
escalar al catálogo completo (>=200 juegos NUEVOS/útiles únicos + 92 rutinas),
sin incorporar ni rediseñar los 130 juegos retirados.
LEER y dejar memoria actualizada de tu trabajo, con hoja de control https://github.com/mruizwow-bit/irisgreen/tree/coordinacion/iris-green-canonica-20260924/COORDINACION_IRIS_GREEN

