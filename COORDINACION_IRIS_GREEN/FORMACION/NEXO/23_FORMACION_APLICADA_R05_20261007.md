# Nexo · Formación aplicada R05 · 2026-10-07

## Propósito

Integrar el aprendizaje operativo de 2026-10-07 sin confundir documentación con competencia ya demostrada.

Fuentes del aprendizaje:
- Cielo 3D R02 y patch R02.1;
- Vida marina 3D R01/R02;
- El Vado 3D Vera;
- Mar / Rincón A3;
- Creación / Taller y sus cinco vertical slices;
- revisiones independientes de Prisma y Axioma;
- HUMAN QA de María.

## 1. Human QA decide dirección de producto, no conformidad total

Aprendizaje:
una prueba humana puede cerrar una pregunta de producto concreta aunque queden pendientes técnicos.

Ejemplos:
- Cielo 3D fue elegido porque la diferencia percibida frente a 2D era enorme.
- Vida marina 3D fue elegida porque “en 3D se entiende mejor”.

Regla nueva:
**PRODUCT_DIRECTION_SELECTED != FULL_PRODUCT_PASS**

Tras una decisión humana:
- no reabrir la comparación de dirección sin evidencia nueva;
- continuar cerrando defectos concretos dentro de la dirección elegida;
- conservar la alternativa anterior como referencia/rollback cuando proceda;
- no convertir preferencia humana en PASS de accesibilidad, rendimiento, ciencia o escala.

## 2. Rework debe ser proporcional a la evidencia

Aprendizaje de Mar:
una primera lectura amplia pedía rehacer velocidad, ola y audio. Una revisión posterior de los dos MP4 exactos acotó el problema a:
- artefacto rectangular;
- cierre de loop visual;
- comprobación del empalme auditivo.

Regla:
**NO RECONSTRUIR MÁS DE LO QUE LA EVIDENCIA EXIGE.**

Antes de ordenar rework:
1. comparar archivos exactos;
2. separar percepción, defecto técnico y preferencia;
3. identificar el blocker reproducible;
4. superseder órdenes anteriores si nueva evidencia reduce el alcance;
5. conservar KEEP válidos.

## 3. Oráculos: 0 casos observados no significa imposibilidad

Aprendizaje de Vida marina:
un test de histéresis podía pasar con 0 casos reales de dos candidatos. Después apareció un solape real.

Regla:
**0 CASOS OBSERVADOS != IMPOSIBLE**

Un oracle que pretende medir una condición:
- debe exigir que la condición haya ocurrido;
- debe fallar si la precondición no se alcanza;
- distingue fixture sintético de estado real;
- no puede llamar PASS a ausencia de cobertura.

## 4. Evidencia semántica debe existir en el render

Aprendizaje de Cielo 3D R02:
Perseo podía localizarse usando un punto de figura con `estrella=null` que no existía como estrella renderizada.

Regla:
**VISIBLE_RENDERED_POINTS_ONLY**

Si una afirmación de la interfaz dice “has tomado N estrellas”:
- esas N deben existir en el catálogo/render;
- overlay, hit-test, reconocimiento y reveal comparten el mismo conjunto observable;
- una coordenada de figura sin entidad visible no cuenta como evidencia semántica;
- el mínimo semántico no se satisface con puntos fantasma.

## 5. Compatibilidad futura implica preservar bytes

Aprendizaje de Cielo y Vida marina:
ignorar un storage futuro al cargar no basta si la primera interacción lo sobrescribe.

Regla:
**FUTURE_SCHEMA_DETECTED -> READ_ONLY / TEMPORAL SESSION**

Ante versión futura:
- no importar al estado actual;
- no sobrescribir la clave;
- no anunciar guardado si no hubo escritura;
- permitir sesión temporal;
- comprobar bytes before == after tras acciones relevantes.

## 6. 3D es una decisión semántica, no estética

Aprendizajes combinados de Cielo, Vida marina y Creación.

3D ganó cuando aportó:
- continuidad espacial;
- orientación;
- memoria espacial;
- relaciones entre objetos;
- comprensión de “dónde está algo”.

Pero no todo debe convertirse en 3D.

Regla:
`3D_FOR_SPATIAL_MEANING`

Usar 3D cuando mejora:
- orientación;
- volumen;
- física;
- relaciones espaciales;
- navegación.

No forzarlo en:
- dibujo;
- ritmo;
- código textual;
- escritura;
- documentos.

## 7. Mundo/escena como interfaz principal

Aprendizaje de Vida marina 3D:
si el panel domina, la escena deja de ser la experiencia.

Regla:
**WORLD_FIRST / SCENE_AS_PRIMARY_INTERFACE**

Cuando la experiencia es espacial:
- la interacción principal ocurre en el mundo;
- los paneles son apoyo, inspector, ayuda y alternativa accesible;
- la persona debe mirar principalmente la escena;
- la UI no debe contar toda la secuencia.

## 8. Juego real = causalidad, decisiones y consecuencias

Aprendizaje de El Vado:
tener locomoción, inventario, construcción y objetivos no basta para ser juego.

Síntoma detectado:
- flujo lineal;
- objetivos que revelan la solución;
- final “coloca 3 y retira 1”;
- sistemas correctos pero poca decisión.

Regla:
**TECHNICAL_SYSTEMS != GAMEPLAY_DEPTH**

Una experiencia jugable debe permitir:
- descubrir un problema;
- explorar;
- elegir recursos/estrategia;
- probar una solución;
- observar consecuencia;
- corregir;
- continuar.

El criterio de juego no es “tests verdes”, sino consecuencia funcional en el mundo.

## 9. Animación correcta debe comunicar la acción, no sólo seguir huesos

Aprendizaje de Vera:
mano↔objeto coherente y distancia medida no prueban que una animación comunique peso.

`Carry_Heavy_Object_Walk_inplace` quedó excluido de transporte genérico.

Regla:
**KINEMATIC_ATTACHMENT != PERCEPTUAL_ACTION_VALIDITY**

Para heavy lift revisar:
- preparación;
- contacto;
- base de apoyo;
- centro de gravedad;
- esfuerzo;
- manos adecuadas;
- transición lift→carry→place.

No salvar una pose inadecuada teletransportando el objeto a la mano.

## 10. Creación se aprende por consecuencia

Aprendizaje de Creación/Taller:
la unidad básica no debe ser “herramienta”, sino “algo que hacer y una consecuencia”.

Principio:
`CREATION_IS_LEARNED_THROUGH_CONSEQUENCE`

Patrón:
`HACE → VE/OYE/PRUEBA CONSECUENCIA → CAMBIA → VUELVE A PROBAR → CREA ALGO PROPIO`

GAME_FIRST significa causalidad, no puntos/premios.

Decisión:
cinco vertical slices antes de escalar 27:
- Dibujo;
- Estructuras;
- Ritmo;
- Robótica;
- Escritura con restricciones.

Misión y modo libre:
- usan el mismo motor;
- el mismo proyecto;
- el mismo undo/redo;
- el mismo guardado/exportación;
- la misión no es un tutorial separado.

## 11. Escala técnica != escala humana

Aprendizaje de Cielo 3D R02:
un árbol técnico de 88 nodos no es automáticamente una experiencia humana razonable.

Antes de 88/88:
- constelaciones grandes/deshilachadas;
- ambigüedad real;
- rutas humanas;
- rendimiento con catálogo completo.

Regla:
**DATA_SCALE != EXPERIENCE_SCALE**

Escalar contenido requiere diseñar:
- agrupación;
- rutas;
- ayuda progresiva;
- anclas;
- carga cognitiva.

## 12. Evidencia por capa

Mantener separación estricta:

- hash/manifest -> integridad;
- unit test -> lógica;
- browser -> comportamiento de runtime;
- dispositivo físico -> gesto/rendimiento real;
- AT real -> tecnología de apoyo;
- captura/vídeo -> evidencia visual temporal;
- HUMAN QA -> comprensión, preferencia, mareo, satisfacción;
- fuente científica -> afirmación factual;
- revisión de asset -> anatomía/representación;
- benchmark -> rendimiento bajo hardware declarado.

No sustituir una capa por otra.

## 13. Estado de competencia

Documentado:
- principios anteriores;
- órdenes y reconciliaciones aplicadas;
- retests parciales propios en Cielo/Web/artefactos.

Pendiente de demostrar de forma más completa:
- diseño y evaluación de una vertical slice Creación completa;
- validación humana de gameplay profundo en El Vado R02;
- phone/AT real en Cielo 3D R02;
- loop audiovisual de Mar corregido;
- escalado 88/88;
- modelos 3D zoológicos si algún día se autorizan.

No certificación externa.
No PASS global por actualizar esta formación.
