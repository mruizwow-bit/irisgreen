# DECISIÓN DE MARÍA · R49 · INTERFAZ R42/R02 TRANSVERSAL

Fecha: 27/09/2026  
Responsable de construcción: **Agente 8**  
Revisión previa: **Astra**  
Puerta única de integración: **A2**  
Aceptación final: **HUMAN QA de María**

## DECISIÓN QUE CAMBIA LA PRECEDENCIA

La nueva interfaz **R42/R02 no es una interfaz de Home**.

Desde esta decisión pasa a ser el **sistema transversal de interfaz de Iris Green**.

Se aplica a todas las áreas públicas de la web, adaptada al tipo de superficie:
- páginas de lectura;
- catálogos;
- directorios;
- datos;
- investigación;
- vídeos;
- recursos;
- herramientas;
- Taller;
- Intereses;
- Rincón;
- Home.

No significa que todas las páginas deban parecer un editor ni que todo lleve cristal.  
Significa que **toda Iris Green comparte el mismo sistema de navegación, materiales, controles, preferencias, responsive, accesibilidad, discovery y lenguaje visual**.

---

# 0. ESTADO DE A8 R42

Entrega #305:
- PR #310;
- rama `agent8/r42-home-child-safe-20260927`;
- HEAD `4769e223dc5e10f2bdd82a508310a929e94a6bb5`;
- tree `7e3db0f4dc4f4c7943f7ce1be266109ca97510c2`;
- marker `R42_A8_HOME_CHILD_SAFE_READY_FOR_A2`.

Se conserva como **piloto/donante válido de Home + child-safe**, pero ya no representa el alcance total de interfaz del sitio.

A8 no rehace #310.  
R49 parte de sus componentes reutilizables y del R02 integrado en A2.

---

# 1. SUPERCEDENCIA DE DESIGN R02

La documentación R02 anterior decía:
`No propagación global antes de HUMAN QA`.

Esa restricción se refería al estado de **piloto** del sistema material.

**Queda supersedida por decisión expresa de María.**

Nueva regla:
- R02 se propaga transversalmente;
- cada familia de superficie conserva su arquitectura;
- HUMAN QA sigue siendo obligatoria antes de producción;
- propagación ≠ autorización de main/producción.

No se reabre el diseño del material R02: se **industrializa**.

---

# 2. BASE REAL

Puerta web:
PR #244 · `agent2/sabik-iris-r08-20260924`.

HEAD observado al emitir:
`bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`.

Árbol observado:
**1.053 archivos HTML**.

Distribución observada aproximada:
- Condiciones ES: 186;
- Conditions EN: 186;
- Situaciones ES: 188;
- Situations EN: 188;
- Vida diaria ES: 49;
- Everyday life EN: 49;
- Datos ES: 50;
- Data EN: 50;
- Taller ES/EN: 27 + 27;
- otras áreas: Home, Videoteca, Investigación, Ayudas, Libros, Recursos, Intereses, Rincón, etc.

**No congelar cifras ni SHA.**  
Releer HEAD/tree e inventario inmediatamente antes de construir.

---

# 3. ARRANQUE OBLIGATORIO

Antes de tocar código:

1. leer esta orden completa;
2. leer #305 / PR #310;
3. leer #301 Design R02;
4. leer #293/#302 child-safe;
5. leer #307 Rincón;
6. leer #308 Taller;
7. leer #309 Intereses;
8. leer #289 A2;
9. leer Control/Memoria;
10. releer A2 HEAD/tree;
11. publicar `R49_A8_TRANSVERSAL_R42_R02_BASE_READ`;
12. construir en la misma sesión;
13. actualizar Memoria + Control al entregar.

---

# 4. NO UNA PLANTILLA ÚNICA · TRES PERFILES DE SUPERFICIE

R42/R02 es un **sistema**, no una plantilla única.

## 4.1 PROFILE CONTENT · lectura

Aplicar a:
- Condiciones;
- Situaciones;
- Vida diaria;
- Datos;
- Investigación;
- Ayudas/Trámites;
- Libros y páginas editoriales;
- páginas informativas/accessibility/privacy/about.

Debe priorizar:
- lectura estable;
- jerarquía;
- fuente/procedencia;
- navegación;
- búsqueda;
- acciones claras.

Estructura:
- header global compacto;
- breadcrumb/contexto;
- título + lede;
- contenido opaco;
- índice/aside solo si aporta;
- fuentes/acciones secundarias;
- footer común.

**NO app shell creativo.**
**NO workspace falso.**
**NO cristal detrás de lectura.**

## 4.2 PROFILE BROWSE · explorar/catálogo

Aplicar a:
- índices Condiciones/Situaciones;
- catálogos;
- Videoteca;
- Recursos/Juegos/Rutinas;
- directorios;
- listados;
- hubs.

Estructura:
- header global;
- búsqueda/filtros;
- resultados/cards;
- acciones/contexto;
- sheets/dialogs en móvil;
- contenido estable;
- chrome R02.

No convertir catálogo en formulario administrativo.

## 4.3 PROFILE WORKSPACE · herramienta

Aplicar a:
- Taller R47;
- Intereses/Cuaderno R48;
- Rincón R46;
- Juegos interactivos;
- herramientas específicas.

Comparte:
- global chrome;
- materiales/tokens;
- preferencias;
- audience;
- child-safe;
- accesibilidad.

Pero el workspace lo gobierna su orden específica.

R49 **NO sustituye** R46/R47/R48.

---

# 5. REGLA TRANSVERSAL DE LAYOUT · NO CINTAS CENTRADAS CON GUTTERS VACÍOS

## Problema que María rechaza

No dejar:
- un contenedor estrecho centrado;
- dos bandas laterales enormes sin función;
- toda la interfaz flotando en una “isla” de 1180 px en pantallas de 1440/1600/1920+;
- stage pequeño aunque haya viewport disponible;
- cards/listados comprimidos en el centro sin razón;
- una experiencia inmersiva con márgenes de web editorial.

El patrón histórico `main{max-width:46rem;margin:0 auto}` sirve para **medida de lectura**, no para gobernar todo el producto.

## Principio

**Reading width != Product width**

La anchura de una línea de lectura puede limitarse.  
La anchura de la superficie de producto debe aprovechar el viewport.

## Desktop

### CONTENT
Usar un grid fluido de página.

Ejemplo conceptual:
`minmax(gutter,1fr) + content/read column + optional context rail + minmax(gutter,1fr)`.

La columna de lectura:
- aproximadamente 65–75ch cuando sea texto continuo;
- NO obliga a que header, hero, índice, fuentes, visuales, tablas o related tengan ese mismo ancho.

En pantallas amplias:
- índice/contexto puede ocupar lateral;
- fuentes/acciones pueden ir en rail;
- visuales/tablas pueden ensancharse;
- no crear aside vacío solo para “rellenar”.

### BROWSE
- ancho fluido;
- cards usan columnas reales;
- filtros/contexto pueden ocupar lateral;
- no max-width fijo heredado de 1180 px como techo universal.

### WORKSPACE
- `max-width:none` por defecto;
- gutters pequeños y fluidos;
- stage/workspace ocupa la mayor parte del viewport útil;
- rail/inspector tienen anchura funcional, no decorativa.

## Rincón
En R46:
- stage debe sentirse grande e inmersivo;
- no “vídeo centrado dentro de una tarjeta estrecha”;
- desktop puede usar casi todo el ancho útil;
- chrome flota/rodea la experiencia sin recortarla;
- Pantalla limpia debe llegar al viewport completo disponible.

## Taller
- workspace domina;
- Estructura/Inspector aprovechan laterales;
- no meter canvas central en una columna editorial.

## Intereses
- atlas/mapa/timeline/galería puede ser wide/full-bleed dentro del layout;
- el texto explicativo mantiene medida legible.

## Anchos de referencia

No fijar una única cifra universal.

Construir tokens semánticos, por ejemplo:
- `--ig-layout-gutter`;
- `--ig-reading-measure`;
- `--ig-content-wide`;
- `--ig-browse-max` si sigue siendo necesario;
- `--ig-workspace-gutter`.

En 1440 px y superiores, una superficie de producto no debe quedarse artificialmente en ~1180 px salvo justificación real.

## Gate visual
Capturas obligatorias:
- 1366×768;
- 1440×900;
- 1600×900;
- 1920×1080;
- 2560×1440;
- 390×844;
- 320×800.

Astra/HUMAN QA debe poder responder:
“¿El espacio lateral tiene una función o es un residuo de max-width?”

Si son dos bandas vacías grandes sin intención -> FAIL.

---

# 6. GLOBAL CHROME · UNA SOLA IRIS GREEN

Construir un sistema común para:

## Header
- marca;
- navegación primaria;
- idioma;
- búsqueda/acceso a búsqueda;
- Lectura/Ajustes;
- selector de etapa cuando proceda;
- mobile menu/drawer;
- current page;
- keyboard/Escape/focus restore.

No coexistencia final de:
- `.hd`;
- `.ig-uh`;
- headers aislados por sección;
como experiencias visualmente distintas.

Puede haber adaptadores legacy durante migración, pero el resultado visible debe ser uno.

## Footer
Un único sistema:
- Sobre Iris Green;
- Accesibilidad/Lectura;
- Privacidad;
- navegación útil;
- idioma correcto.

No footer EN apuntando accidentalmente a ES cuando exista ruta EN.

## Search/discovery
Mismo contrato:
- búsqueda segura;
- autocomplete;
- filtros;
- empty state;
- related/recommendations;
- child-safe antes de render.

## Settings
Mismo sistema:
- tamaño;
- espaciado;
- controles;
- contraste;
- guía;
- lectura en voz alta cuando corresponda;
- reduced motion;
- transparencia Normal/Reduced/Opaque.

Usar `window.IGPreferences`.

No crear storage adicional.

---

# 7. DESIGN R02 · REGLAS TRANSVERSALES

Fuente:
`assets/ig-r42-materials.css`.

Activación:
`body[data-ig-materials="r42"]`.

R49 debe dejar de tratar este atributo como “piloto”.

## Cristal SOLO en chrome
- header;
- nav;
- toolbar;
- filtros;
- docks;
- popovers;
- dialogs;
- sheets;
- controles flotantes.

## Opaco
- texto;
- artículos;
- datos;
- tablas;
- cards de lectura;
- canvas/workspace;
- vídeo;
- imágenes;
- mapas;
- galerías;
- ayudas largas.

No glass-on-glass.

## Preferencias
- Normal;
- Transparencia reducida;
- Opaco;
- system reduced transparency;
- override explícito;
- forced colors;
- reduced motion.

## High contrast
Eliminar dependencia de:
`filter: contrast(...) saturate(...)`
sobre `main`.

No mutar:
- fotos;
- pictogramas;
- vídeo;
- mapas;
- canvas.

Usar tokens/componentes.

---

# 8. HOME #310 · SE CONSERVA

La Home A8 es el primer consumidor completo del sistema.

R49:
- no la vuelve a diseñar desde cero;
- extrae/reutiliza sus patrones compartibles;
- elimina cualquier duplicación Home-only cuando deba ser global.

Elementos reutilizables:
- `IGAudience`;
- `ig-audience.css`;
- child-safe controller;
- búsqueda segura;
- settings/dialog;
- responsive/mobile principles.

Home mantiene su composición de portal.

---

# 9. CONTENIDO PARA… · TRANSVERSAL

El selector:
`Contenido para… / Content for…`

Valores:
- Infancia / Children;
- Adolescencia / Teenagers;
- Adultez / Adults;
- Cualquier edad / Any age.

Sin selección:
`SAFE_BY_DEFAULT`.

## Persistencia
- session-only tras elección explícita;
- no DOB;
- no identidad;
- no diagnóstico;
- no cuenta;
- no perfil oculto.

## UI
No repetir un bloque enorme en cada página.

Debe existir un patrón compacto común:
- header/settings/context bar;
- estado visible cuando cambie contenido;
- acceso sencillo para cambiar.

En páginas donde la etapa no cambia nada, no llenar la interfaz con controles redundantes; el estado global sigue activo para discovery/enlaces.

---

# 10. CHILD-SAFE TRANSVERSAL

La Home no puede ser segura si al navegar a otra área desaparece la protección.

Aplicar el mismo contrato en toda Iris Green:
- `S0_GENERAL`;
- `S1_SENSITIVE`;
- `S2_HIGH_SENSITIVITY`;
- `NORMAL`;
- `INTENTIONAL_ONLY`;
- `SAFE_VARIANT_REQUIRED`.

Filtrar ANTES de:
- autocomplete;
- búsqueda;
- cards;
- related;
- recommendations;
- “también puede interesarte”;
- navegación contextual;
- recursos relacionados.

Full S2:
- fuera del payload inicial default/infancia/adolescencia;
- adultez + acción explícita.

R49 no inventa safe variants: consume el manifest/variantes aprobadas de #302.

---

# 11. ÁREAS OBLIGATORIAS

Cobertura final debe incluir al menos:

### Núcleo editorial
- Home;
- Condiciones;
- Situaciones;
- Vida diaria;
- Datos;
- Investigación.

### Navegación/servicio
- Ayudas/Trámites;
- Libros;
- Videoteca;
- páginas institucionales;
- accesibilidad/lectura/privacidad.

### Recursos
- Recursos;
- Juegos;
- Rutinas;
- descargables/visores cuando sean HTML navegable.

### Experiencias
- Taller;
- Intereses;
- Cuaderno;
- Rincón.

### Sabik
Solo chrome/ubicación del panel cuando corresponda.
No tocar Cloud/voz/retrieval en R49.

---

# 12. COORDINACIÓN CON R46/R47/R48

Claude está reconstruyendo:
- R46 Rincón;
- R47 Taller;
- R48 Intereses.

A8 NO modifica sus motores ni reabre su arquitectura.

R49 construye:
- assets compartidos;
- contrato global;
- adapters;
- build transforms;
- coverage tests.

Claude debe consumir R02/common chrome en sus entregas.

Si hay colisión:
- preferir shared token/adapter;
- no copiar CSS;
- resolver en A2.

Ninguna de las tres áreas queda excluida del gate transversal final.

---

# 13. INDUSTRIALIZACIÓN · NO 1.000 EDICIONES MANUALES

Crear una transformación/build común idempotente, por ejemplo:
- `scripts/apply_r49_transversal_ui.py`;
- manifest de rutas/perfiles;
- tests de cobertura.

Puede mejorar nombres.

Debe:
1. inventariar HTML;
2. clasificar surface profile;
3. insertar assets comunes una sola vez;
4. añadir atributos/body profile;
5. adaptar header/footer;
6. respetar páginas especiales;
7. no duplicar scripts/styles;
8. poder ejecutarse dos veces sin cambiar de nuevo el output;
9. fallar si queda una ruta pública sin clasificar.

## Manifest
Machine-readable:
- route;
- locale;
- profile;
- R02;
- common header;
- common footer;
- audience;
- child-safe;
- owner lane;
- exemption si existe;
- reason.

Gate:
**0 rutas públicas sin clasificación.**

---

# 14. NO COPIAR LA HOME A TODAS LAS PÁGINAS

Prohibido:
- pegar `home-r42-child-safe.css` como layout universal;
- poner el grid Home en artículos;
- meter Sabik aside fijo en todo;
- añadir el selector de etapa como tarjeta enorme en cada ficha;
- convertir documentos en cards por estética;
- convertir workspaces en páginas editoriales.

Home = portal.
Content = lectura.
Browse = exploración.
Workspace = herramienta.

Una identidad, arquitecturas apropiadas.

---

# 15. CHILD-SAFE + RUTAS NUEVAS #302

A8 #305 trabajó sobre el baseline real y documentó:
- 365 safe;
- 7 S2 intencionales actuales;
- 372 metadata adultas;
- Investigación S2 actual;
- `global-395` / TEPT complejo y altas 121–132 todavía ausentes.

R49 debe prepararse para el baseline que integre #302.

No crear rutas fantasma.

Cuando las altas #302 entren:
- consumir manifest 965;
- 16 S2;
- safe variants aprobadas;
- índices safe/intencional/adulto.

La interfaz global no hardcodea conteos.

---

# 16. BILINGÜISMO

ES/EN completo.

R49 debe encontrar y corregir inconsistencias estructurales de navegación que estén dentro de su alcance:
- enlace EN → ES cuando existe EN;
- labels;
- aria-label;
- dialogs;
- settings;
- footer;
- mobile nav.

No traducir nombres propios/fuentes.

No introducir PT-BR como nuevo scope en R49 salvo rutas ya públicas que deban conservarse sin regresión.

---

# 17. ACCESIBILIDAD TRANSVERSAL

Aplicar:
- WCAG 2.2 AA;
- ISO/IEC 40500:2025;
- EN 301 549 según registro;
- ISO 24495-1;
- ISO 9241-171;
- ISO 9241-210;
- ISO 9241-11;
- ISO 9241-112;
- W3C COGA.

Tests:
- teclado;
- foco;
- skip link;
- landmarks;
- heading structure;
- current page;
- 320px;
- 400% zoom donde aplique;
- text spacing;
- forced colors;
- reduced motion;
- reduced transparency;
- screen reader;
- dialogs/popovers focus restore;
- no color único;
- no hover único;
- target size según criterio real WCAG.

No declarar “certificado”.

---

# 18. PERFORMANCE

La propagación no puede añadir:
- app shell JS a 1.000 páginas si no lo necesitan;
- Three/Pixi/MapLibre/etc.;
- Sabik pesado donde no se usa;
- duplicación de CSS.

Common assets:
- pequeños;
- cacheables;
- shared;
- lazy cuando corresponda.

Profile-specific assets:
- solo en su familia.

Medir:
- CSS común;
- JS común;
- HTML delta;
- LCP/INP/CLS muestra;
- páginas de gama media/móvil.

---

# 19. QA DE COBERTURA

## Automático
Inventario real del build:
- total HTML;
- total por profile;
- R02 loaded;
- body profile;
- header/footer;
- IGPreferences;
- audience/safety donde aplique;
- ES/EN parity;
- 0 duplicados;
- 0 public unclassified.

## Muestra visual obligatoria

CONTENT:
- Condición;
- Situación;
- Vida diaria;
- Datos;
- Investigación;
- Ayuda;
- Libro/editorial.

BROWSE:
- Conditions hub;
- Situations hub;
- Vida diaria;
- Datos;
- Videoteca;
- Recursos;
- Juegos;
- Rutinas/directorio.

WORKSPACE:
- Taller;
- Intereses;
- Cuaderno;
- Rincón;
- un juego interactivo.

Cada una:
- 1440×900;
- 1920×1080;
- 390×844;
- 320×800;
- normal/reduced/opaque;
- reduced motion/forced colors en selección representativa.

## Wide-layout QA
Añadir:
- 1600×900;
- 2560×1440.

Gate:
- no gutters laterales gigantes sin función;
- no stage pequeño por max-width heredado;
- reading measure correcto;
- visuales/tablas pueden usar ancho mayor;
- no horizontal scroll de página.

---

# 20. HUMAN QA

A8 no puede declarar final por:
- build PASS;
- conteo de 1.053 rutas;
- “material loaded”;
- screenshots aisladas.

Astra revisa:
- cobertura;
- coherencia;
- layout;
- child-safe;
- colisiones con R46/R47/R48.

A2 integra en una preview.

María valida:
- que se siente como **una única Iris Green**;
- que no está todo centrado en una cinta estrecha;
- que cada área conserva su función;
- que móvil no es desktop apilado;
- que lectura sigue cómoda;
- que workspaces usan el viewport;
- que R02 no invade el contenido.

---

# 21. ENTREGA

Entregar:
- branch;
- base HEAD/tree;
- final HEAD/tree;
- PR;
- route/profile manifest;
- total routes;
- excepciones justificadas;
- shared assets;
- adapters;
- build transform;
- idempotence test;
- coverage test;
- child-safe coverage;
- ES/EN parity;
- wide-layout report;
- 1366/1440/1600/1920/2560 + móvil;
- accessibility;
- performance;
- screenshots;
- memoria/control.

Marcador final:
`R49_A8_TRANSVERSAL_R42_R02_READY_FOR_ASTRA`.

Secuencia:
A8 → Astra → A2 → preview integrada → María HUMAN QA.

No main.  
No producción.  
No deploy propio.  
No tocar Cloud A9.  
No tocar voz Sabik.  
No reescribir motores R46/R47/R48.

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

