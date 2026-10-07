# APRENDIZAJE NEXO · 07/10/2026

## Objetivo

Registrar los fallos y aprendizajes operativos de la jornada para que no se repitan tras un reset de conversación.

## 1. Coordinar no sustituye construir

Fallo observado:
- demasiados mensajes de estado;
- gates declarados sin entrega;
- planes y órdenes usados como sustituto de ejecución;
- María convertida en mensajera.

Aprendizaje:
`STATUS_AS_PROGRESS = INVALID`
`DOCUMENTATION_AS_CAPABILITY = INVALID`
`TESTS_WITHOUT_PRODUCT_AS_DELIVERY = INVALID`

Nexo debe empujar cada carril hasta:
**código/artefacto → prueba → fallo → corrección → entrega**.

## 2. No aceptar gates por texto

Fallo observado:
se aceptó `VECTOR_NEW_WEB_INTEGRATION_READY_FOR_NEXO_HUMAN_QA` sin commit, build, artefacto o preview nuevos.

Corrección:
`NO_EVIDENCE__NO_GATE`

Antes de aceptar READY:
- commit/branch exacto;
- artefacto;
- build;
- pruebas;
- capturas/vídeo cuando corresponda;
- lista de riesgos;
- evidencia de preservación de dependencias.

## 3. GitHub es canon, pero hay que leer el carril correcto

Fallo observado:
se mezcló la auditoría histórica GAMES_14 con Creación/Taller.

Aprendizaje:
- localizar el producto/carril primero;
- leer su fuente canónica;
- no extrapolar un análisis de legacy a un roadmap vigente;
- no mezclar Juegos legacy, Taller, El Vado, Cielo, Vida marina, Rincón o Sabik sin orden explícita.

Regla:
`CANON_FIRST__SCOPE_BEFORE_ACTION`

## 4. Validación técnica no es validación de producto

Fallo observado:
Nexo/Prisma/Axioma dejaron avanzar una web técnicamente coherente pero visual y conceptualmente pobre.

Aprendizaje:
separar siempre:
- TECHNICAL PASS
- ACCESSIBILITY/STANDARDS PASS
- VISUAL/PRODUCT PASS
- HUMAN QA

Un hash verde, un reflow correcto o un test automático no prueban que el producto sea bueno.

## 5. Creación/Taller · recuperar propósito original

Creación no es una escuela ni un catálogo de estudios.

Propósito:
- creatividad de niños, adolescentes y adultos;
- experimentar;
- inventar;
- construir;
- expresarse;
- crear algo propio.

Principio:
`CREATIVITY_FIRST__LEARNING_HAPPENS_THROUGH_MAKING`

Contrato:
`IMAGINE → TOUCH → TRY → CHANGE → DISCOVER → CREATE`

Si hay que estudiar teoría antes de poder crear:
`REWORK_REQUIRED`

“Estudio” puede existir como taxonomía interna, no como experiencia dominante.

## 6. GAME_FIRST no significa minijuego separado

La misión y el modo libre deben usar el mismo motor/proyecto.

La persona:
- actúa en segundos;
- observa consecuencia;
- puede deshacer;
- prueba otra vía;
- termina con un artefacto real del dominio.

No:
- tutorial de botones;
- formulario largo;
- checklist que revele la solución;
- lección previa;
- demo separada del editor real.

## 7. 3D · usar volumen real donde importa

Aprendizaje de Vida marina y Cielo:

No confundir:
- billboard;
- sprite;
- canvas con sombreado volumétrico;
- perfil extruido;
con geometría 3D factual.

Si el objeto tiene volumen físico y explorar sus lados aporta significado:
`TRUE_3D_WHERE_OBJECT_HAS_REAL_VOLUME`

Pero:
`3D_FOR_SPATIAL_MEANING`

No forzar 3D en Dibujo, Escritura o Ritmo si su medio natural es mejor.

## 8. Honestidad de representación científica

Vida marina enseñó:

`GEOMETRY ≠ OBSERVABLE EVIDENCE`

y:

`TRUE_VOLUME_FROM_APPROVED_2D_ASSET ≠ TRUE_ANATOMICAL_3D`

Si la fuente sólo contiene silueta lateral:
- declarar grosor/proporciones como representación;
- no llamarlo anatomía medida;
- no inventar taxón o rasgos;
- usar PROVISIONAL/HOLD cuando corresponda.

## 9. Lo visible y lo medido deben ser el mismo estado

Aprendizaje de iluminación marina:

`VISUAL_STATE == MEASURED_STATE`

No puede existir una máscara visual y otra lógica con fórmulas distintas.

Los parámetros compartidos deben vivir en una única fuente de verdad.

## 10. Source-of-truth también forma parte del producto

Un runtime corregido con README/datos/versiones contradictorias no está cerrado.

Antes de gate:
- runtime;
- datos;
- versión;
- README;
- tests;
- manifests;
- resultados

deben contar la misma realidad.

## 11. Evidencia canónica: no mezclar corridas

No mezclar cifras de diferentes ejecuciones como si fueran una sola.

Si una prueba es no determinista:
- declarar rango;
- fijar regla de selección canónica antes de mirar resultados;
- conservar todas las salidas relevantes.

Un FAIL no capturado:
`UNRESOLVED_FIRST_RUN_FAILURE`
hasta reproducirlo o demostrar que no reaparece bajo protocolo registrado.

## 12. Protección de sistemas integrados

La integración web no es reemplazo ciego.

Especialmente:
`SABIK_IS_PROTECTED_DEPENDENCY`

Antes de integrar:
- mapa de piezas;
- dependencias;
- KEEP/ADD/REPLACE/MERGE/HOLD;
- smoke de Sabik tras cada capa;
- rollback por capa.

No reconstruir trabajo aprobado por comodidad.

## 13. Bloqueo parcial no significa parar

Regla:
`LOCAL_SOURCE_OFFLINE != WORK_STOP`

Si una dependencia concreta está offline:
- avanzar tests;
- arneses;
- matrices;
- wrappers;
- rollback;
- documentación ejecutable;
- cualquier parte independiente.

Pero tampoco convertir preparación infinita en sustituto del build.

## 14. Los agentes se evalúan por capacidad demostrada

Nexo asigna construcción según evidencia de capacidad, no por título.

Si un agente no consigue:
- construir;
- depurar;
- corregir;
- entregar;

su capacidad sigue:
`CAPABILITY_NOT_PROVEN`

y necesita práctica/formación adicional antes de ampliar alcance.

## 15. Lección operativa principal de la jornada

Claude mostró un patrón útil:
**recibir orden → abrir → modificar → probar → corregir → entregar**.

El equipo interno debe aproximarse a ese estándar.

Nexo debe reducir al mínimo:
**analiza → registra → asigna → explica → cambia gate → vuelve a explicar**.

## Gate de aprendizaje

`NEXO_20261007_EXECUTION_PRODUCT_JUDGMENT_LEARNING_RECORDED`

Este documento debe leerse al inicio de una nueva sesión de Nexo antes de coordinar producto.
