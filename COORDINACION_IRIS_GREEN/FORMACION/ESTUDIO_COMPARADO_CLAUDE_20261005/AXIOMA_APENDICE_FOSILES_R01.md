# AXIOMA · APÉNDICE DE APRENDIZAJE · FÓSILES R01

Fecha: 2026-10-06
Base: análisis y reproducciones de Nexo sobre NEXO_FOSILES_PRACTICA_R01.

Fuentes leídas directamente:
- COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_FOSILES_DESCUBRIMIENTO_20261005/REVISION_NEXO_R01_20261006/ANALISIS_NEXO_R01.md
- REPRODUCTIONS.json
- reproduce.cjs

Artifact estudiado por Nexo:
NEXO_FOSILES_PRACTICA_R01.zip
SHA-256: 21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c

Este apéndice no reejecuta navegador ni convierte la reproducción Node/Canvas de Nexo en QA de navegador. Registra qué demuestran sus reproducciones y qué debe aprender Axioma.

## 1 · Qué demuestran realmente las reproducciones

R00: estado de preparación incoherente. Todas las muestras pueden quedar despejadas mientras solo una región cumple featureVisible. step() anuncia que se puede examinar y examine() lo rechaza.

R01: la identidad puede revelarse aunque la pieza seleccionada esté fuera de la vista. La reproducción mide el borde derecho en x=-295.32 px y aun así se identifica Trilobites.

R02: la herramienta de teclado puede modificar una zona cuyo punto proyectado está fuera de una escena 850×560; punto registrado aprox (1565,622), con 80 celdas de máscara modificadas.

R03: el mensaje útil de preparación se sobrescribe al finalizar el click. La UI llega a «Ya puedes observar los detalles», pero el live/status termina en un mensaje genérico de retirada.

R04: cambiar ES→EN manteniendo modo Despejar deja instrucciones de Explorar/drag, es decir, copy no coherente con el estado activo.

R05: el control «esta zona» no actúa necesariamente sobre el punto elegido. En la reproducción del mamut, el punto despejado queda a ~295.81 unidades del punto seleccionado.

R06: NORMAL/REDUCED/NONE se ofrecen como selector, pero el runtime no consulta esos modos para cámara o dibujo; el control no representa una diferencia funcional propia.

Además, el análisis de Nexo demuestra un problema distinto de semántica de contenido: los tres anclajes anatómicos son generados por proporciones geométricas genéricas del asset y después reciben nombres anatómicos específicos. Que el PNG original esté aprobado no valida la nueva anotación.

## 2 · Aprendizaje Axioma: probar invariantes antes que finalización

El aprendizaje más fuerte de Fósiles es este:

COMPLETION_TESTS_AFTER_INTERACTION_INVARIANTS

El banco anterior comprobaba que se podía terminar el recorrido. Nexo buscó en cambio cosas que nunca deben suceder.

Para Axioma, una experiencia interactiva de descubrimiento debe definir primero invariantes negativas:
- no actuar sobre un objetivo no visible sin una transición explícita;
- no comunicar «listo» si la misma máquina de estado lo rechaza;
- no mover la acción a otra zona cuando el control promete «esta zona»;
- no exponer un setting que no cambia comportamiento;
- no sobrescribir el mensaje de mayor relevancia con un mensaje genérico del mismo gesto;
- no asignar semántica factual a una región solo porque existe un punto geométrico dentro del asset.

## 3 · Nuevos oráculos derivados

### ORACLE A · TARGET_VISIBILITY_INVARIANT
Antes de cualquier acción espacial sobre pieza/punto:
- calcular proyección con cámara actual;
- exigir intersección suficiente con viewport si la acción se presenta como directa;
- si está fuera, bloquear o pedir reencuadre explícito;
- nunca ejecutar silenciosamente fuera de pantalla.

Aplica a ratón, teclado, Paso, Examinar y cualquier helper.

### ORACLE B · SEMANTIC_TARGET_CONSISTENCY
Si el control dice «esta zona», el target efectivo debe corresponder a la zona/punto seleccionado dentro de una tolerancia declarada.

Si el producto quiere avanzar asistidamente a otra región, debe:
- nombrarlo como avance asistido;
- mostrar el destino antes de modificarlo;
- no reutilizar el copy «esta zona».

### ORACLE C · STATE_MESSAGE_CONSISTENCY
Para cada transición:
STATE_BEFORE → ACTION → STATE_AFTER → PRIMARY_MESSAGE

El mensaje primario debe derivar del estado final y no ser contradictorio con la siguiente acción permitida.

Un status secundario no puede sobrescribir, en el mismo ciclo, un cambio de readiness de mayor prioridad.

### ORACLE D · MODE_COPY_PARITY
Después de cualquier cambio de idioma, breakpoint o retorno de modal:
- el modo funcional debe conservarse o cambiar de forma explícita;
- instrucciones, nombres accesibles y ayuda deben describir ese modo actual;
- no basta traducir strings globales.

### ORACLE E · CONTROL_EFFECT_ORACLE
Todo control visible debe tener una consecuencia funcional o perceptual documentada.

Si NORMAL/REDUCED/NONE producen el mismo comportamiento en esa superficie:
- retirar el control;
- o implementar una diferencia real y medible.

Un setting sin efecto añade carga cognitiva y falsa expectativa.

### ORACLE F · ANNOTATION_GROUNDING_ORACLE
Para cada anotación factual sobre un asset:
- anchor definido sobre región observable específica;
- región validada manualmente contra la imagen;
- soporte/losa separados del fósil cuando exista;
- nombre anatómico sustentado por la geometría visible;
- umbral de «visible» justificado por legibilidad, no solo por conveniencia de recorrido.

APPROVED_ASSET != APPROVED_ANNOTATION

## 4 · Qué cambia respecto al estudio anterior de Axioma

Mi estudio anterior ya había concluido:
PROMISE → OBSERVABLE → ORACLE → COUNTEREXAMPLE → EXPERT_TASK → USER_TASK.

Fósiles añade una capa previa más precisa:

INVARIANT → PROMISE → OBSERVABLE → ORACLE → COUNTEREXAMPLE

Porque antes de preguntar «¿se puede completar?» debemos preguntar:
«¿qué cosas serían inaceptables incluso aunque el recorrido termine?»

## 5 · Relación con nuestra formación existente

Esto encaja con lo que Axioma ya tenía:
- ISO/IEC 25010/25040: calidad multidimensional;
- ISO/IEC/IEEE 29119: procesos de testing reproducibles;
- COGA: claridad, predictibilidad, carga y recuperación;
- WCAG 4.1.3: los mensajes de estado deben ser programáticamente comunicables, pero además deben ser correctos;
- WCAG 2.5.7: disponer de teclado no demuestra equivalencia de una alternativa a drag;
- regla interna: un PASS necesita método, evidencia y límites.

La formación no estaba vacía. Faltaba convertir esas ideas en invariantes observables del modelo interactivo.

## 6 · Qué NO demuestra esta revisión

Nexo declara correctamente que no ejecutó navegador real.

Por tanto NO quedan demostrados por reproduce.cjs:
- layout CSS;
- Tab/foco nativo;
- lector de pantalla;
- touch físico;
- reflow;
- percepción continua del borrado;
- facilidad de primera tarea.

Esas capas siguen necesitando navegador/AT/HUMAN QA cuando exista versión corregida.

## 7 · Transferencia práctica para Axioma

Antes de aceptar un banco de pruebas de una experiencia de descubrimiento, Axioma pedirá una tabla:

INVARIANT | COUNTEREXAMPLE | TEST | ORACLE | LIMIT

Ejemplos mínimos para Fósiles:
1. selected target offscreen → acción directa debe FAIL/bloquear;
2. readiness contradiction → test debe FAIL;
3. «esta zona» desplaza > tolerancia → FAIL;
4. idioma cambia en modo brush → copy debe seguir describiendo brush;
5. selector de motion sin delta observable → FAIL de producto/control;
6. anchor anatómico fuera de región validada → FAIL de contenido.

## 8 · Decisión

El análisis de Nexo refuerza una conclusión del estudio Axioma y añade precisión:

END_TO_END_COMPLETION_IS_NOT_ENOUGH

y la nueva regla:

TEST_INVARIANTS_BEFORE_SUCCESS_PATHS

Para experiencias espaciales/descubrimiento:

VISIBLE_TARGET + SEMANTIC_TARGET + STATE_CONSISTENCY + MESSAGE_CONSISTENCY + CONTENT_GROUNDING

deben mantenerse antes de considerar la finalización del recorrido.

Estado:
AXIOMA_FOSSILS_R01_LEARNING_APPENDIX_COMPLETE

No modifica Fósiles R01 ni declara una R02 corregida. No main, no deploy.