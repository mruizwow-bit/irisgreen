# R51 · AGENTE 9 · BIBLIOTECA CLOUD SABIK R04 · COBERTURA COMPLETA + SINCRONIZACIÓN INCREMENTAL CONTINUA

Fecha: 27/09/2026  
Responsable: **Agente 9**  
Revisión: **Astra**  
Puerta web posterior: **A2**  
Producción: **NO autorizada**

## DECISIÓN DE MARÍA

R03 no es el final de la biblioteca. Es la base técnica privada verificada.

La biblioteca de Sabik debe seguir creciendo y, una vez construida R04, **cada cambio aprobado de la web debe poder reflejarse automáticamente mediante una actualización incremental versionada**.

Regla nueva:

**CAMBIA LA WEB → SE DETECTA EL DELTA → SE RECONSTRUYE SOLO LO AFECTADO → SE REVALIDA SAFETY/CITAS → SE SELLA UNA NUEVA VERSIÓN INMUTABLE.**

No volver a rehacer la biblioteca completa manualmente para cada cambio.

---

# 0. BASE R03 · NO TOCAR

Estado aceptado como base técnica:
`A9_R03_TECHNICALLY_VERIFIED_PRIVATE`

Versión:
`sabik-es-en-20260927-r03-9216eeee6a32`

- 1.208 fragmentos;
- 604 ES + 604 EN;
- corpus SHA-256 `7335fc9ba4992814ff11698e740d6faca3abc0e160f2d2485c214866884add43`;
- manifest SHA-256 `9dd6a2f1e6458351876a74921d7ed6180ce2660468798a1c5787c047a8bc8a13`;
- 30 full S2 + 30 safe variants;
- 1.057 URLs únicas / 0 rotas;
- 204/204 tests PASS;
- deploy privado `6ab943463d8845250907ab42`;
- R38 intacto.

R03 queda inmutable e histórica.

R51 crea una identidad R04 nueva.

---

# 1. OBJETIVO R04

Construir una biblioteca Sabik:

1. más completa;
2. alineada con el contenido aprobado de la nueva Iris Green;
3. bilingüe cuando exista fuente bilingüe real;
4. child-safe;
5. citable;
6. versionada;
7. incremental;
8. reproducible;
9. actualizable automáticamente ante cambios relevantes de la web;
10. sin datos de usuario.

Principio:

**PUBLIC_SITE != CLOUD_CORPUS**

No todo HTML público debe entrar en el corpus.

---

# 2. FUENTES DE AUTORIDAD

Precedencia:

1. decisiones actuales de María;
2. Control/Memoria canónicos;
3. paquete child-safe #302;
4. HEAD integrado A2 vigente;
5. handoffs finales aprobados;
6. fuente pública original.

## Child-safe canónico

Paquete:
`iris-green-contenido-R02-DESIGN-CHILD-SAFE-20260927.zip`

SHA-256:
`b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23`

Manifest:
- 965 registros;
- S0 724;
- S1 225;
- S2 16;
- NORMAL 945;
- SAFE_VARIANT_REQUIRED 16;
- INTENTIONAL_ONLY 4.

Usar:
- `SAFETY/content-safety-manifest.json`
- `SAFETY/safe-variants.json`
- `SAFETY/s2-review.csv`

No reclasificar S2 ya revisados sin nueva decisión editorial.

---

# 3. ARRANQUE

Antes de construir:

1. leer #306 completo;
2. leer #302/#293;
3. leer #311 R49;
4. leer #313 R50;
5. leer Control/Memoria;
6. releer HEAD A2;
7. publicar:
`R51_A9_CLOUD_LIBRARY_R04_BASE_READ`;
8. construir en la misma sesión.

---

# 4. R04 NO SE SELLA CONTRA UNA WEB INESTABLE

R51 se divide:

## Fase A · adapters + inventario
Empieza ya.

## Fase B · freeze de fuente
Justo antes del corpus:
- HEAD A2 exacto;
- tree;
- manifest de rutas;
- child-safe manifest;
- hashes fuente.

## Fase C · sellado
Crear R04 inmutable.

Nunca leer `main` dinámicamente en runtime.

---

# 5. COBERTURA EDITORIAL OBLIGATORIA

## Condiciones · 226
Incluir contenido editorial útil:
- título;
- resumen;
- explicación;
- señales/apoyos si son editoriales;
- fuentes;
- relaciones aprobadas.

## Situaciones · 223
Fragmentar por:
- situación;
- explicación;
- apoyo;
- fuentes.

## Vida diaria · 62
Contenido práctico curado.

## Datos · 60
Cada fragmento numérico debe mantener:
- población;
- período;
- jurisdicción cuando aplique;
- fuente;
- contexto.

No indexar cifras aisladas sin contexto.

## Investigación · 132
Fragmentar:
- pregunta;
- muestra;
- método;
- resultados;
- limitaciones;
- fuente.

## Ayudas/Trámites · 262 ES
Solo registros con:
- autoridad/fuente;
- territorio;
- vigencia/fecha de revisión;
- URL.

Si no hay EN aprobada:
- no traducir silenciosamente;
- `locale=es`;
- permitir recuperación desde UI EN si el contrato lo acepta;
- cita declara `lang=es`.

---

# 6. RECURSOS, JUEGOS Y RUTINAS

Indexar conocimiento editorial, no estado interactivo.

## Juegos
Incluir:
- título;
- propósito;
- etapa;
- contexto/habilidad;
- instrucciones breves;
- URL.

Excluir:
- score;
- seed;
- eventos;
- estado de partida;
- historial;
- datos del usuario.

## Rutinas
Incluir:
- título;
- contexto;
- pasos textuales;
- etapa;
- formatos;
- URL;
- atribución/licencia cuando corresponda.

No guardar bytes de pictogramas/PDF/PNG dentro del corpus.

---

# 7. INTERESES R48

Indexar:
- título;
- pregunta central;
- explicación curada;
- conceptos;
- fuentes;
- qué se puede explorar;
- URL.

NO indexar:
- dumps NASA/GBIF/Wikidata/Met;
- mapas completos;
- tiles;
- GeoJSON masivo;
- resultados live sin freeze.

Sabik indexa **la explicación curada**, no el dataset bruto.

---

# 8. TALLER R47

Indexar solo:
- qué permite hacer cada estudio;
- herramientas;
- conceptos;
- starters aprobados;
- ayuda;
- formatos de exportación;
- URL.

Excluir:
- proyectos de usuario;
- canvas;
- archivos;
- código de usuario;
- IndexedDB/OPFS;
- historial.

R44 retos solo cuando estén aprobados.

---

# 9. RINCÓN R46

Indexar:
- Respirar;
- Paisajes;
- Inmersivo;
- controles;
- accesibilidad;
- privacidad;
- información editorial/licencias.

Excluir:
- frames;
- shaders;
- partículas;
- estado de sesión;
- URLs temporales de player;
- transcripción redundante de audio.

---

# 10. HOME / R49 / R50

Home aporta navegación, no conocimiento duplicado.

Incluir solo:
- descripción general de Iris Green;
- descripción de áreas cuando ayude a orientar.

R50 prevalece sobre copy anterior.

---

# 11. DEDUPLICACIÓN

Nuevo gate:

- hash de texto normalizado;
- canonical source;
- alternate URLs si procede.

Regla:
**mismo contenido editorial = un fragmento canónico por locale/version**.

Entregar:
- exact duplicates;
- near-duplicate review;
- decisiones.

No embeddings en R51.

---

# 12. CAMBIOS ENTRE VERSIONES

Cada build debe producir un delta:

- ADDED
- MODIFIED
- UNCHANGED
- REMOVED
- SAFETY_CHANGED
- ROUTE_CHANGED
- LOCALE_CHANGED
- SOURCE_CHANGED

## Tombstones
REMOVED:
- queda en historial;
- sale del índice activo;
- conserva provenance.

Nunca borrar releases antiguas.

---

# 13. SCHEMA R04

Cada fragmento:

- `content_id`
- `fragment_id`
- `locale`
- `content_type`
- `title`
- `heading`
- `text`
- `canonical_url`
- `source_type`
- `source_commit`
- `source_version`
- `source_hash`
- `library_version`
- `editorial_status`
- `audience[]`
- `sensitivity`
- `discovery`
- `safe_variant_id`
- `review_reason`
- `published_or_reviewed_at`
- `active`
- `provenance[]`

Opcionales:
- jurisdiction;
- population;
- period;
- source_language;
- artifact_type;
- life_stage;
- context;
- skill.

---

# 14. CITAS

Validar 100 % de URLs canónicas.

No `slug(title)`.

No inventar URL EN.

Resultado citable:
- canonical_url;
- title;
- fragment_id;
- locale;
- library_version;
- source hash/version;
- score.

---

# 15. CHILD-SAFE

Mantener motor R03.

DEFAULT/INFANCIA:
- full S2 fuera del índice;
- safe variant revisada.

ADOLESCENCIA:
- no S2 incidental;
- safe variant ante intención clara.

ADULTEZ:
- full S2 solo con intención explícita.

Si cambia clasificación:
- `SAFETY_CHANGED`;
- rebuild de fragmentos afectados;
- revalidar búsqueda;
- no mantener clasificación anterior por cache.

---

# 16. ACTUALIZACIÓN CONTINUA · REQUISITO NUEVO DE MARÍA

Una vez creada R04, la biblioteca **no puede quedar congelada hasta que alguien recuerde actualizarla**.

A9 debe construir un **updater incremental reproducible**.

## Fuente de cambio

Escuchar cambios del **source web canónico aprobado**, no ramas experimentales.

Durante esta fase:
- source canónico = HEAD A2 que Astra/A2 marque como integrado.

Cuando la web tenga rama/release canónica posterior:
- cambiar la referencia mediante configuración, no reescribir el updater.

## Trigger

Preparar workflow que pueda ejecutarse:

1. automáticamente tras cambios del source canónico;
2. manualmente con `workflow_dispatch` + `source_sha`;
3. desde el pipeline de integración A2 cuando se cierre un lote.

No disparar por cualquier rama de agente.

## Detección

Comparar:
- source_sha anterior;
- source_sha nuevo;
- fingerprints de contenidos;
- manifest child-safe;
- rutas;
- fuentes.

Si no hay cambio editorial relevante:
`NO_CONTENT_CHANGE`
y NO crear una versión inútil.

## Rebuild incremental

Si cambia 1 ficha:
- no volver a procesar todo como obligación;
- regenerar esa ficha y dependencias;
- recalcular índices/manifiestos;
- validar globalmente.

Si cambia:
- safety;
- route;
- fuente;
- locale;
actualizar dependencias correspondientes.

## Nueva versión

Todo cambio relevante produce:
- versión nueva;
- manifest nuevo;
- corpus hash nuevo;
- delta;
- source SHA;
- timestamp;
- readback.

No sobrescribir R04/R05/etc.

---

# 17. PROMOCIÓN VS CONSTRUCCIÓN

Distinguir:

## CANDIDATE_BUILT
Pipeline ha creado corpus candidato.

## CANDIDATE_VERIFIED
Tests + hashes + citas + safety PASS.

## ACTIVE_PRIVATE
Versión activa en Cloud privado.

## PUBLIC/PRODUCTION
FUERA DE R51.

Un cambio web no puede activar automáticamente producción.

Puede generar y validar candidato privado.

La promoción a `ACTIVE_PRIVATE` debe quedar explícita y auditable.

---

# 18. REGISTRO DE DEPENDENCIAS

Crear `library-source-registry.json` con:

- domain;
- route/source file;
- extractor;
- safety source;
- locale;
- update dependency;
- owner;
- last source SHA;
- last library version.

Objetivo:
saber qué parte de biblioteca debe regenerarse cuando cambia un archivo/ruta.

---

# 19. QA DEL UPDATER

Fixtures obligatorios:

1. cambio textual de una Condición;
2. cambio de URL;
3. S1 → S2;
4. S2 safe variant modificada;
5. ficha eliminada;
6. nueva ficha;
7. traducción EN añadida;
8. EN retirada;
9. cambio solo CSS → NO_CONTENT_CHANGE;
10. cambio solo JS de UI → NO_CONTENT_CHANGE;
11. cambio de fuente/cita;
12. título duplicado con rutas distintas.

Probar:
- delta correcto;
- índices correctos;
- tombstone;
- no stale retrieval;
- 0 URL rota;
- safety antes de ranking.

---

# 20. RETENCIÓN / HISTÓRICO

Conservar:
- manifest de cada release;
- corpus hash;
- source SHA;
- delta;
- fecha;
- estado.

No es necesario conservar ilimitadamente todos los blobs de candidatos fallidos; definir política.

Releases verificadas nunca se sobrescriben.

---

# 21. OBSERVABILIDAD SIN DATOS DE USUARIO

Permitido registrar:
- library version;
- build duration;
- fragment counts;
- diff counts;
- test status;
- readback status.

No registrar:
- queries;
- IP;
- usuario;
- respuestas;
- conversación;
- diagnóstico;
- etapa seleccionada individual.

---

# 22. HTTP AUTENTICADO R03/R04

El HUMAN QA autenticado de Team Login sigue pendiente porque no hubo sesión legítima.

No falsificarlo.

R51 debe dejar preparado el mismo test para la próxima sesión legítima:
- ES;
- EN;
- zero result;
- DEFAULT S2;
- ADULT no intent;
- ADULT explicit intent;
- grouping IDs;
- `Cache-Control: no-store`.

El updater no depende de este QA para existir.

---

# 23. C17 / RETENCIÓN PLATAFORMA

Sigue pendiente evidencia de retención de plataforma.

A9:
- documenta lo verificable;
- identifica configuración/permiso faltante;
- no declara PASS por ausencia de logs propios.

---

# 24. PERFORMANCE

R04 debe mantener:
- carga fría razonable;
- warm query baja;
- heap controlado.

El updater debe medir:
- duración full build;
- duración incremental;
- número de fragmentos reconstruidos;
- bytes escritos;
- readback.

Objetivo:
incremental claramente menor que full cuando el delta sea pequeño.

---

# 25. ENTREGA

A9 entrega:

- branch;
- base HEAD/tree;
- final HEAD/tree;
- versión R04;
- source SHA/tree;
- corpus/manifest hashes;
- counts ES/EN;
- coverage por dominio;
- child-safe counts;
- citation audit;
- duplicate audit;
- updater incremental;
- workflow;
- source registry;
- delta schema;
- tombstones;
- fixtures;
- performance full vs incremental;
- candidato privado;
- readback;
- Memoria/Control.

Marcador:

`R51_A9_SABIK_CLOUD_LIBRARY_R04_READY_FOR_ASTRA`

## Handoff futuro

Una vez aceptado R04:

`WEB_SOURCE_CHANGE -> A9_INCREMENTAL_LIBRARY_CANDIDATE`

será el flujo normal de mantenimiento.

No volver a abrir una “reconstrucción total de biblioteca” para cambios ordinarios.

---

# 26. LÍMITES

NO:
- R38 overwrite;
- R03 overwrite;
- producción;
- DNS;
- Team Login changes;
- secretos;
- frontend;
- voz/TTS;
- modelos;
- embeddings;
- LLM reranker;
- datos de usuario;
- queries/logs personales.

---

# BLOQUE NORMATIVO

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

