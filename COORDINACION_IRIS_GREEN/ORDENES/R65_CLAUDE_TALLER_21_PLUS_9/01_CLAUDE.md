# ORDEN CANÓNICA · R65 · CLAUDE · TALLER · 21 + 9

Issue operativo: #330  
Fecha: 29/09/2026

# R65 · CLAUDE · TALLER · ESCALAR 21 TARJETAS RESTANTES + 9 VARIANTES AGE_0_12

Fecha: 29/09/2026  
Autoridad de producto: **María**  
Construcción: **Claude**  
Revisión: **Astra**  
Integración posterior: **A2**  
Aceptación final: **HUMAN QA María**

## ESTADO DE ENTRADA

`R65_WAIT_HUMAN_QA_R64`

Esta orden define el siguiente trabajo del Taller, pero **NO autoriza todavía a ejecutarlo**.

Gate de desbloqueo obligatorio:

`R64_TALLER_6_CARDS_HUMAN_APPROVED_FINAL_UNLOCK_R65`

Ese marcador solo puede emitirlo María después de ver/probar la Deploy Preview de #329.

Sin ese marcador:
**STOP. No render. No escala.**

---

# 1. QUÉ SE CONSERVA

Las seis tarjetas que fijan el estándar quedan congeladas:

1. Dibujo
2. Estructuras
3. Programación
4. Diseño de videojuegos
5. Mundos
6. Modelado 3D

KEEP 6/6.

No rerenderizar, rediseñar ni usarlas como plantilla literal.

Regla visual congelada:

`THE_CARD_SHOWS_THE_WORKBENCH_NOT_THE_FINISHED_PRODUCT`

El estándar no es copiar composición. Es igualar:
- materia;
- iluminación;
- profundidad;
- atmósfera;
- microdetalle;
- jerarquía a 240×150 CSS px;
- acción creativa visible;
- personalidad propia del estudio;
- acabado premium 2026.

---

# 2. LOS 21 ESTUDIOS RESTANTES · LISTA CERRADA

Construir exactamente:

1. Diseño gráfico
2. Pixel Art
3. Cómic
4. Color
5. Patrones y arte generativo
6. Fotografía y composición
7. Moda y textil
8. Ideas e inventos
9. Arquitectura
10. Máquinas e inventos
11. Circuitos
12. Papiroflexia y poliedros
13. Simulaciones
14. Ritmo
15. Composición
16. Síntesis
17. Videomapping
18. Robótica
19. Escritura con restricciones
20. Lenguas inventadas
21. Juegos de mesa

No añadir ni quitar estudios.

---

# 3. 9 VARIANTES AGE_0_12

Construir únicamente las **nueve variantes ya definidas/congeladas en el sistema R54**.

No elegir nueve nuevas por iniciativa propia.

Antes de construir:
- localizar en manifest/registry/handoff R54 el conjunto exacto de 9;
- registrar sus IDs;
- comparar contra Control/Memoria.

Si no existe una única lista canónica o dos fuentes discrepan:

`R65_AGE_0_12_VARIANT_SET_NOT_CANONICAL_BLOCKED`

y STOP para Astra.

## Regla visual AGE_0_12

Mismo estudio.
Mismo proceso creativo.
Misma calidad.

Puede cambiar:
- menos densidad;
- objetos mayores;
- acción más inmediata;
- menos abstracción;
- composición más fácil de leer.

NO:
- estética bebé;
- mascotas/ojos como atajo;
- cartoon genérico;
- “lo mismo más mono”;
- rebajar detalle/calidad.

---

# 4. TRABAJO POR TANDAS PEQUEÑAS

No construir 21 estudios en una sola tanda monolítica.

Trabajar en **7 tandas de 3 estudios**.

Por cada tanda:
1. fuente;
2. render 1x/2x;
3. AVIF/WebP;
4. manifest/fingerprints;
5. QA;
6. captura a tamaño real;
7. checkpoint/commit local limpio;
8. registro en Memoria/Control de progreso.

Si una tanda no pasa, corregir esa tanda antes de abrir la siguiente.

Las 9 variantes AGE_0_12 se producen después de que las 21 base estén técnicamente completas, también en tandas pequeñas.

---

# 5. CALIDAD VISUAL

Aplicar:
`IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`

Cada tarjeta debe funcionar visualmente sin leer el título.

FAIL:
- icono grande;
- pictograma;
- tres formas sobre gradiente;
- infografía educativa;
- plantilla común maquillada;
- escena genérica intercambiable;
- exceso de texto;
- personaje cute como protagonista;
- UI flotante sin entorno/material;
- workbench vacío.

Debe mostrar:
- qué puedo hacer;
- algo ya empezado;
- herramientas/materiales propios;
- acción/proceso;
- luz;
- profundidad;
- composición;
- identidad del estudio.

No hace falta fotorealismo.

---

# 6. DIRECCIÓN POR FAMILIAS

No copiar las seis piloto, pero usar sus principios.

### Visual/composición
Diseño gráfico, Pixel Art, Cómic, Color, Patrones, Fotografía, Moda, Ideas:
- superficie de trabajo;
- material visible;
- obra en proceso;
- herramientas reales del estudio.

### Espacial/construcción
Arquitectura, Máquinas, Circuitos, Papiroflexia, Simulaciones:
- estructura;
- piezas;
- causa/efecto;
- volumen/profundidad;
- estado de construcción o prueba.

### Tiempo/audio
Ritmo, Composición, Síntesis, Videomapping:
- pistas/secuencia;
- playhead o estructura temporal;
- resultado visible;
- materialidad suficiente para no parecer UI administrativa.

### Sistema/código
Robótica:
- sistema físico/digital en construcción;
- sensores/recorrido/componentes;
- resultado visible;
- no mascota.

### Documento/conocimiento
Escritura, Lenguas inventadas, Juegos de mesa:
- páginas/mapas/tableros/componentes;
- relaciones;
- sistema en proceso;
- no simple icono de documento.

---

# 7. PIPELINE REPRODUCIBLE

Mantener el pipeline R54 aprobado:

- fuente versionada;
- raster determinista;
- AVIF 1x/2x;
- WebP 1x/2x;
- `svg_sha256`/fuente equivalente;
- hashes de outputs;
- dimensiones;
- `render_config_sha256`;
- build-strict;
- detección de output stale;
- prueba negativa de settings.

Si la técnica cambia para un estudio porque E4 lo exige:
- documentarlo;
- mantener equivalentes de trazabilidad/hashes;
- no romper el checker global.

No imponer SVG→raster si otra técnica produce mejor resultado y sigue siendo first-party, reproducible y auditable.

---

# 8. SALIDAS ESPERADAS

Si se conserva el contrato actual de cuatro outputs por visual:

### 21 bases
21 × 4 = **84 outputs**

### 9 variantes AGE_0_12
9 × 4 = **36 outputs**

Total nuevo esperado:
**120 assets renderizados**

Si el pipeline cambia el número:
documentar el motivo, no inventar una cifra para hacerla coincidir.

---

# 9. PERFORMANCE

No cargar las 27 tarjetas ricas como eager.

- solo visibles iniciales pueden ser eager/high;
- resto lazy;
- variantes de edad no precargadas innecesariamente;
- AVIF con WebP fallback;
- `srcset/sizes` correctos;
- medir peso total y first viewport.

No 27 WebGL contexts.

---

# 10. TOKENS / SHELL

R65 crea ARTE DE TARJETA.

No vuelve a abrir el shell global.

No tocar:
- Home v4;
- header;
- theme runtime;
- `iris-brief-r08.css`;
- tokens globales.

Cuando exista chrome en una evidencia de QA, consumir:
`assets/ig-global-ui-tokens-2026.css`

DARK NAVY inicial; LIGHT alternativa.

Arte != interfaz.

---

# 11. TAXONOMÍA

Usar únicamente:
- `AGE_0_12`
- `AGE_13_17`
- `AGE_18_PLUS`
- `ALL_AGES`

No emitir:
- Infancia;
- Adolescencia;
- Adultez;
- Cualquier edad;
- Children/Teenagers/Adults/Any age
como IDs internos.

Copy visible ES/EN según normativa canónica.

R65 no reabre la migración URL global de A2.

---

# 12. CHILD-SAFE

Las escenas visuales deben seguir el contenido clasificado del Taller.

No introducir:
- contenido S2 incidental;
- violencia gráfica;
- sexualización;
- texto externo no auditado;
- IP/obra de terceros;
- imágenes stock;
- personajes ajenos.

Las variantes AGE_0_12 pasan child-safe visual antes del gate.

---

# 13. ACCESIBILIDAD

Las tarjetas no sustituyen el texto.

Por cada visual:
- decorativa → `aria-hidden=true` si el texto ya transmite lo necesario;
- informativa → alternativa accesible real.

Comprobar:
- forced colors;
- contrastes del chrome;
- zoom/reflow;
- 320/390;
- no contenido esencial solo en imagen.

No declarar conformidad por axe únicamente.

---

# 14. QA VISUAL OBLIGATORIA

## Por cada una de las 21
Entregar:
- tarjeta 240×150 CSS real;
- 1x;
- 2x;
- LIGHT shell;
- DARK NAVY shell;
- móvil;
- técnica;
- peso;
- elementos;
- por qué representa el estudio;
- comparación con el estándar 6/6.

## 9 AGE_0_12
Además:
- base vs variante;
- qué se simplifica;
- por qué no infantiliza;
- por qué sigue siendo el mismo estudio.

## Matriz final
27/27:
- visual identificado sin título;
- `ICON_ONLY=false`;
- actividad visible;
- diferenciación;
- calidad E4;
- responsive;
- status Astra.

---

# 15. LO QUE R65 NO HACE

NO revisar/refinar todavía:
- interiores 27/27;
- starters;
- primera pantalla del estudio;
- motores;
- storage;
- exportaciones;
- retos R44.

Eso será la siguiente orden del Taller tras el gate visual 27/27.

---

# 16. ENTREGA

Entregar:
- branch/base HEAD/tree;
- final HEAD/tree;
- diff/patch reproducible;
- 21 fuentes;
- 9 variantes canónicas;
- outputs;
- manifest;
- hashes;
- render config;
- QA por tanda;
- matriz 27/27;
- matriz AGE_0_12;
- capturas 1440/390;
- ES/EN;
- peso/performance;
- child-safe visual;
- Memoria;
- Control;
- pendientes.

Marcador:

`R65_CLAUDE_TALLER_21_PLUS_9_READY_FOR_ASTRA`

Después:
Claude → Astra.

NO A2 todavía.
NO main.
NO producción.
NO deploy propio.

---

# 17. GATES

### WAIT inicial
`R65_WAIT_HUMAN_QA_R64`

### Desbloqueo
`R64_TALLER_6_CARDS_HUMAN_APPROVED_FINAL_UNLOCK_R65`

### Entrega Claude
`R65_CLAUDE_TALLER_21_PLUS_9_READY_FOR_ASTRA`

### Después de PASS Astra
se abre una orden separada para:
**27 interiores + starters/primera pantalla E4**.

---

# 18. NORMATIVA

R65 NO introduce normativa transversal nueva.

Consume:
- `IRIS_GREEN_VISUAL_STANDARD_SEP_2026`;
- `IRIS_GREEN_AGE_TAXONOMY_2026`;
- `IRIS_GREEN_LOW_STIMULATION_SURFACES_2026`;
- `IRIS_GREEN_GLOBAL_UI_TOKENS_2026`;
- R42/R02;
- child-safe vigente;
- WCAG/ISO/EN/COGA;
- ES/EN.

# BLOQUE NORMATIVO OBLIGATORIO EMBEBIDO

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
