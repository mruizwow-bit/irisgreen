# ORDEN CANÓNICA · R63 · CLAUDE · RINCÓN · SAKURA

Issue operativo: #328  
Fecha: 29/09/2026

# R63 · CLAUDE · RINCÓN · SAKURA · CERRAR PILOTO REPRODUCIBLE ANTES DE ESCALAR

Fecha: 29/09/2026  
Responsable de construcción/handoff: **Claude**  
Revisión: **Astra**  
Integración web: **A2**  
Aceptación final: **HUMAN QA María**

Estado inicial:
`R63_CLAUDE_RINCON_SAKURA_CANDIDATE_ORDERED`

## 0 · PRECEDENCIA Y MOTIVO

Esta orden versiona la decisión de María del 29/09/2026 registrada en la reselección de salas sensoriales.

La dirección anterior de Globos queda superada:
- **Mundo de globos de luz se retira del catálogo y del generador**;
- no volver a invertir trabajo en convertir impostores planos en masas sólidas grandes;
- Jardín de luz, Papel y viento, Dentro de una nube y Respiración del espacio quedan **CONGELADAS** hasta decisión posterior;
- no empezar Faroles flotantes, Lluvia de luz, Agua y reflejos ni Bosque bioluminiscente en esta orden.

**Sakura ya existe como prototipo. NO se reconstruye desde cero.**

La misión es convertir el prototipo real existente en un candidato:
- reproducible;
- trazable;
- accesible;
- integrable;
- revisable por Astra;
- apto para HUMAN QA de María.

STOP después de Sakura.

## 1 · FUENTE · NO RECONSTRUIR DESDE CAPTURAS

La Biblioteca contiene evidencia del prototipo, incluida:
- `RESELECCION_SALAS_SENSORIALES.md`;
- `sakura_en_la_pagina.png`;
- `sakura_dos_horas.png`.

Estas capturas **NO son fuente de código**.

Tampoco usar como fuente de producto:
- imágenes conceptuales;
- imágenes generadas de referencia;
- `Sala Sensorial Sakura.png`;
- cualquier imagen con watermark;
- screenshots históricos de Globos/R53.

### Gate de fuente

Antes de escribir:
1. localizar el código exacto que produjo Sakura;
2. registrar archivos, hashes y baseline;
3. comprobar que reproduce la evidencia existente.

Si el código exacto no está accesible:
`R63_SAKURA_SOURCE_ARTIFACT_MISSING_BLOCKED`

y **STOP**.

Prohibido reconstruir por aproximación desde una captura.

## 2 · BASE WEB REAL

Astra observó PR #244 vivo en:
`agent2/sabik-iris-r08-20260924@9800661d7b7a085acaf593d9f432b2ec426151b8`

pero A2 sigue avanzando.

Claude debe:
- releer el HEAD/tree A2 justo antes de crear su rama;
- ramificar desde ese HEAD vivo;
- registrar SHA exacto;
- no resetear A2;
- no usar `main` como sustituto: `main` y A2 están divergidos;
- no hacer merge ni deploy propio.

## 3 · KEEP DE SAKURA

Conservar la dirección que ya funciona:
- vista desde debajo de un cerezo;
- lámina de agua quieta/reflejo;
- pétalos pequeños, planos y translúcidos;
- tres capas de profundidad;
- ramas y floración propias;
- ritmo lento;
- first-party;
- sin imágenes externas;
- sin red;
- sin terceros.

No copiar una instalación ni una imagen de referencia.

## 4 · TEMA GLOBAL · ARTE != INTERFAZ

La interfaz del Rincón consume el sistema global de Iris Green.

### Chrome/UI
Usar exclusivamente la hoja canónica de A2:
`assets/ig-global-ui-tokens-2026.css`

NO crear ni convertir en fuente final:
`assets/ig-tokens-2026.css`

LIGHT y DARK NAVY son temas globales de la web.

No elegir tema mediante:
`data-ig-r42-family="quiet"`

cuando el sistema global disponga de `data-ig-theme` o mecanismo canónico equivalente.

### Stage Sakura
El stage es arte.

No repintarlo solo para demostrar que LIGHT/DARK cambió.

La evidencia existente de “tarde / noche” se conserva como **variación artística a revisar**, no se convierte automáticamente en obligación de tema.

Entregar comparación:
- opción A · stage visual estable;
- opción B · tarde/noche actual.

Astra + María deciden cuál queda.

El cambio de tema siempre debe cambiar correctamente:
- chrome;
- texto;
- controles;
- superficies;
- foco;
- bordes.

## 5 · SUPERFICIES DE BAJA ESTIMULACIÓN

Aplicar:
`IRIS_GREEN_LOW_STIMULATION_SURFACE_STANDARD_2026`

Prohibido:
- #FFFFFF como superficie extensa;
- gran panel blanco;
- blanco puro como workspace;
- negro puro dominante.

LIGHT:
- base `#F6F8FB`;
- superficies derivadas de tokens.

DARK NAVY:
- superficies navy por tokens.

Los blancos pequeños pueden existir solo cuando cumplen la excepción del estándar y no crean una placa brillante extensa.

## 6 · TAXONOMÍA GLOBAL DE EDAD

Usar únicamente:
- `AGE_0_12`
- `AGE_13_17`
- `AGE_18_PLUS`
- `ALL_AGES`

`GENERAL` solo puede significar “sin filtro”.

Sakura, como contenido de descubrimiento no sensible, debe declararse mediante la taxonomía vigente y no mediante `INFANCIA/ADOLESCENCIA/ADULTEZ/TRANSVERSAL`.

No pedir DOB, diagnóstico, cuenta ni identidad.

## 7 · MOVIMIENTO · TRES ESTADOS REALES

Sakura debe probar:
- NORMAL;
- REDUCIDO;
- SIN_MOVIMIENTO.

### NORMAL
Movimiento lento y continuo, sin eventos bruscos.

### REDUCIDO
Debe ser perceptiblemente menor:
- menos pétalos;
- menor velocidad;
- menos deriva/paralaje;
- sin cambios sorpresivos.

No vale “la misma escena al 32 %”.

### SIN_MOVIMIENTO
- cero RAF continuo;
- composición estática finalizada;
- no depender de animación para comprender o disfrutar la escena.

Responder en vivo a:
- `prefers-reduced-motion`;
- preferencia Iris Green;
- cambio de ajuste después de montar.

## 8 · PROGRESSIVE ENHANCEMENT / FALLBACK

Documentar y probar los escalones reales del prototipo.

Como mínimo:
- A · renderer principal funcional;
- B · fallback animado simplificado;
- C · fallback de baja carga;
- D · estático finalizado.

No declarar un escalón que no exista.

El fallback debe mantener:
- intención visual;
- contenido ES/EN;
- controles;
- Stop;
- accesibilidad.

## 9 · NADA EMPIEZA SOLO

El Rincón mantiene:
- 0 autoplay;
- 0 movimiento de Sakura antes de acción explícita;
- 0 sonido antes de acción explícita.

Antes de iniciar:
- stage/poster estático;
- nombre y descripción;
- control claro.

Al salir/cambiar escena:
- parar animación;
- liberar recursos;
- parar audio si lo hubiera.

## 10 · AUDIO DE SAKURA

No mezclar:
- música global R60;
- una cama sonora genérica del Rincón;
- audio externo.

En R63 el silencio es válido.

Solo incluir audio si ya existe un sonido **first-party, exclusivo de Sakura**, con procedencia y escucha humana preparada.

Si se incluye:
- OFF hasta acción explícita;
- volumen bajo;
- mute/unmute;
- volumen;
- stop;
- fade;
- una sola fuente;
- parar al cambiar de escena/modo.

## 11 · DOS FIXES R42 QUE NO PUEDEN VOLVER A PERDERSE

PR #303 sigue abierto y no fue integrado en A2.

R63 debe portar semánticamente, sobre el HEAD vivo:
1. clean mode idempotente: no realimentar MutationObserver con toggles redundantes de `body.class`;
2. controles `[hidden]` realmente fuera de render aunque otra regla use `display:flex!important`.

No hacer cherry-pick ciego de #303.
Reimplementar/verificar sobre el código vigente.

## 12 · INTERFAZ GLOBAL · LÍMITE DE RESPONSABILIDAD

A2 posee:
- header global;
- tema global;
- hoja final de tokens;
- propagación R49/R50;
- integración.

Claude NO corrige header global con CSS local de Sakura.

R63 puede:
- consumir contratos globales;
- dejar adaptador local mínimo si es imprescindible;
- documentar dependencia A2.

No modificar Home, Condiciones, Situaciones, Taller, Intereses, Sabik ni Cloud.

## 13 · ACCESIBILIDAD

ES/EN completos.

Obligatorio:
- teclado;
- touch;
- foco visible;
- nombres accesibles;
- targets >=44 px;
- no color-only;
- forced-colors;
- zoom/reflow;
- 320 y 390 sin overflow;
- orientación;
- text spacing;
- reduced motion;
- sin hover esencial;
- pantalla limpia recuperable;
- Escape y restauración de foco cuando corresponda.

No declarar conformidad global por tests automáticos.

## 14 · CAPTURAS Y EVIDENCIA

Las capturas de WebGL vacías quedan prohibidas como evidencia.

`preserveDrawingBuffer` puede activarse en el **harness de QA** para capturar, pero no debe quedar en producción salvo justificación de rendimiento.

Entregar, como mínimo:

### Captura fija
- 1440 ES;
- 1440 EN;
- 390 ES;
- 390 EN.

Para LIGHT y DARK NAVY de chrome.

### Movimiento
Vídeo 15–30 s:
- NORMAL;
- REDUCIDO;
- SIN_MOVIMIENTO (demostrar ausencia de RAF continuo).

### Fallbacks
Evidencia A/B/C/D real.

### Runtime
- 0 request externo;
- 0 autoplay;
- start/stop repetido;
- cambio de escena;
- clean mode;
- fullscreen si aplica;
- liberar listeners/RAF/WebGL/resources.

### Performance
Medir cuando el entorno lo permita:
- frame time/FPS;
- long tasks;
- memoria aproximada;
- downgrade de calidad;
- 1440;
- 390.

Si no existe hardware/entorno razonable:
`PENDING_HARDWARE_QA`
No inventar PASS.

## 15 · HANDOFF REPRODUCIBLE

Entrega obligatoria:
- rama;
- base HEAD/tree;
- HEAD/tree final;
- PR draft dirigido a A2;
- lista exacta de archivos;
- diff;
- hashes;
- manifest;
- pruebas;
- evidencia visual;
- instrucciones de reproducción.

Si el prototipo actual solo existe localmente, materializar exactamente sus fuentes en el handoff antes de refinarlas.

No incluir imágenes de referencia como assets de producto.

## 16 · GATE VISUAL ASTRA

La dirección Sakura pasa a **CONTINUE**, no a aceptación final.

Antes de A2:
Astra comprueba:
- composición;
- profundidad;
- pétalos/ramas;
- reflejo;
- densidad;
- legibilidad móvil;
- baja estimulación;
- diferencia entre arte y chrome;
- ausencia de apariencia de screensaver/demo;
- fallbacks;
- movimiento.

Marcador esperado:
`R63_CLAUDE_SAKURA_REPRODUCIBLE_READY_FOR_ASTRA`

Después:
Astra → A2 → Deploy Preview → HUMAN QA María.

Solo María emite:
`R63_SAKURA_HUMAN_APPROVED_UNLOCK_NEXT_ROOM`

Hasta entonces:
**NO FAROLES. NO LLUVIA DE LUZ. NO AGUA Y REFLEJOS. NO BOSQUE.**

## 17 · CARRILES QUE NO SE TOCAN

- #325 Pecera audiovisual R61 sigue separado;
- R60 Música global sigue separado;
- Sabik/voz/Cloud siguen separados;
- Juegos/Taller/Intereses siguen separados;
- main y producción no se tocan.

---

# BLOQUE NORMATIVO OBLIGATORIO EMBEBIDO

Precedencia: cuando el bloque histórico use etiquetas de etapa antiguas, las sustituye la taxonomía global del 28/09/2026 (`AGE_0_12 / AGE_13_17 / AGE_18_PLUS / ALL_AGES`). El brief de Juegos/Rutinas incluido en el bloque NO amplía el alcance R63; se aplica solo la parte transversal pertinente.

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