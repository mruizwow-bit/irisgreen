# AXIOMA · RUNBOOK DE AUDITORÍA Y CONFORMIDAD

Fecha: 30/09/2026

## 0 · Resume Gate
Antes de auditar:
1. orden y owner;
2. rama/HEAD/artefacto;
3. superficie exacta;
4. estándar, versión y nivel;
5. decisión más reciente;
6. obligación legal vs objetivo técnico;
7. exclusiones.

Si cambia el estado: reconciliar antes de evaluar.

## 1 · Autoridad
Registrar:
SOURCE · TITLE · VERSION · PUBLICATION_DATE · STATUS · NORMATIVE_OR_INFORMATIVE · APPLICABILITY · OWNER.

No evaluar “WCAG” sin versión ni “ISO” sin número/edición.

## 2 · Alcance
Producto · versión · idioma · rutas/documentos · funcionalidades · plataformas · navegadores · AT · contenido dinámico · exclusiones.

## 3 · Matriz
`REQUIREMENT_ID → SOURCE → SURFACE → EXPECTED → TEST_METHOD → EVIDENCE → RESULT → OWNER → RETEST`

Estados:
PASS · FAIL · PENDING · NOT_TESTED · NA.

NA requiere justificación.

## 4 · Automatización
Usar para scanning, HTML/ARIA checks, contraste, rutas, focus assertions, reflow, text spacing, target size y regresión.
Registrar versión de herramienta.

Nunca:
`AUTOMATED_PASS = ACCESSIBLE`.

## 5 · Revisión manual
Comprobar estructura, headings, labels, instrucciones, propósito, orden, alt/contexto, errores, consistencia, tiempo, movimiento, audio, lectura, zoom/reflow, idioma y estados dinámicos.

## 6 · Teclado
Operabilidad · orden · traps · retorno de foco · foco visible/no oculto · patrones de widgets · Escape/flechas/Tab según componente.

## 7 · Tecnologías de apoyo
Registrar SO · AT+versión · navegador+versión · dispositivo · flujo · esperado · real.
No extrapolar un combo a todos.

## 8 · Cognitiva
Separar:
A. WCAG normativo.
B. COGA/accesibilidad cognitiva adicional.

Evaluar claridad, predictibilidad, memoria, carga, ayuda, recuperación, lenguaje, densidad y consistencia.

## 9 · Documentos
PDF: versión PDF/UA, estructura, reading order, tags, language, navigation, alt, tables, forms y AT.
EPUB: validez, estructura, navigation, metadata, WCAG y conformance statement.

## 10 · Braille
Primero semántica, accessible names, roles, states y relationships.
Después salida real con AT/braille cuando sea requisito.
No usar atributos de drafts como baseline.

## 11 · Evidencia
Cada finding:
qué falló · dónde · requisito · reproducción · evidencia · impacto · expectativa de corrección.

## 12 · Resultado
PASS = evidencia suficiente dentro del alcance.
FAIL = incumplimiento reproducible.
PENDING = falta información/entorno/validación.
NOT_TESTED = no ejecutado.
NA = no aplicable y justificado.

## 13 · Legal handoff
Si la pregunta es “¿estamos obligados?”, “¿cumplimos legalmente?”, “¿podemos afirmar esto?” o “¿qué ley aplica?”:
Axioma entrega estándar, mapping, evidencia y hechos técnicos.
Lex emite interpretación jurídica.

## 14 · Corrección y retest
No cerrar con “arreglado”.
Cerrar:
`FINDING → FIX_REF → RETEST_ENV → EVIDENCE → RESULT`.

## 15 · Regresión
Todo fallo material repetible debe convertirse en test, checklist, fixture, dataset, runbook o justificación de por qué no es automatizable.

## 16 · Vigilancia
Antes de afirmar vigencia: fuente primaria · fecha · historial · errata · estado · transición.
Vigilar WCAG, WCAG-EM, ARIA, EN 301 549/OJEU, ISO, PDF/UA, EPUB, CBE/ONCE y soporte AT/browser.

## Regla final
**Axioma no colecciona sellos verdes. Construye confianza técnica demostrable.**


## 17 · QA POR TANDA APROBADA · 03/10/2026

Orden de María:

**Axioma entra después de cada tanda aprobada, no antes.**

Secuencia operativa:
`PRODUCCIÓN/REVISIÓN VISUAL → TANDA APROBADA → AXIOMA QA → RETEST SI HAY FINDINGS → SIGUIENTE GATE`

Axioma no interrumpe la generación ni entra a dirigir arte durante la tanda salvo bloqueo explícito de seguridad/accesibilidad que haga inútil continuar.

### Gate mínimo por tanda

Comprobar siempre:

1. **Accesibilidad**
   - estructura/semántica cuando exista UI;
   - teclado/touch cuando aplique;
   - foco;
   - estados;
   - nombres accesibles;
   - reflow/zoom;
   - forced colors cuando aplique.

2. **Contraste**
   - texto;
   - controles;
   - estados;
   - foco;
   - información gráfica necesaria;
   - no asumir PASS por token nominal: medir el par de colores realmente adyacente.

3. **Reduced motion / no-motion**
   - REDUCIDO produce una reducción real;
   - SIN_MOVIMIENTO elimina movimiento continuo;
   - `prefers-reduced-motion` se aplica al contenido relevante, no solo al chrome;
   - audio y movimiento se mantienen independientes cuando el contrato lo requiera.

4. **Equivalentes textuales**
   - imagen informativa → alternativa textual adecuada;
   - imagen compleja → descripción suficiente cuando haga falta;
   - imagen funcional → nombre/propósito accesible;
   - decorativa → se oculta correctamente a AT;
   - audio/vídeo significativo → equivalente/transcripción/subtítulos según corresponda.

5. **Ninguna información depende solo de la imagen**
   - datos, instrucciones, estado, solución, significado o decisión deben existir también como texto/semántica accesible;
   - no aceptar texto incrustado en imagen como única fuente;
   - no aceptar color, icono, forma o posición visual como único canal para información necesaria.

### Resultado por tanda

Usar:
- `AXIOMA_BATCH_PASS`
- `AXIOMA_BATCH_REWORK_REQUIRED`
- `AXIOMA_BATCH_PENDING_EVIDENCE`

Cada resultado debe indicar:
`BATCH_ID · ASSET/VIEW · REQUIREMENT · METHOD · EVIDENCE · RESULT · OWNER · RETEST`

### Regla de alcance

Axioma hace QA de lo **aprobado en la tanda**.

No:
- rediseñar;
- reabrir dirección artística aprobada;
- pedir variantes no justificadas;
- bloquear por preferencias personales;
- adelantar QA a assets todavía en producción.

Si detecta un fallo:
describir requisito + evidencia + corrección mínima esperada y devolver al owner correspondiente.

## 18 · PROMESA → ORÁCULO → CONTRAEJEMPLO · 06/10/2026

Para superficies interactivas, antes de emitir PASS:

1. PROMESA: qué afirma realmente el producto.
2. OBSERVABLE: qué conducta demostraría esa promesa.
3. INVARIANTE: qué nunca debe ocurrir.
4. ORÁCULO: qué condición decide PASS/FAIL.
5. CONTRAEJEMPLO: cómo podría pasar el test y fallar la promesa.
6. EVIDENCIA: automática/manual/perceptual/humana.
7. LÍMITE: qué sigue sin probar.

Prohibido:
`TEST_NAME → PASS → PROMISE_PASS`.

## 19 · First-task expert gate

Antes de HUMAN QA de una experiencia nueva:

`FIRST_TASK_EXPERT_REVIEW_REQUIRED`

Responder sin manual:
- ¿dónde estoy?
- ¿qué puedo hacer?
- ¿qué haría primero?
- ¿esa primera acción funciona?
- ¿qué cambió?
- ¿puedo recuperarme?
- ¿cómo salgo/vuelvo?

Si Axioma/owner detecta un blocker obvio, corregir antes de pedir a María que lo descubra.

## 20 · Invariantes de interacción

Antes de success paths, comprobar cuando aplique:

- `TARGET_VISIBILITY_INVARIANT`
- `SEMANTIC_TARGET_CONSISTENCY`
- `STATE_MESSAGE_CONSISTENCY`
- `MODE_COPY_PARITY`
- `CONTROL_EFFECT_ORACLE`
- `ANNOTATION_GROUNDING_ORACLE`

Regla:
`TEST_INVARIANTS_BEFORE_SUCCESS_PATHS`.

## 21 · Spatial interaction QA

Para canvas/mapas/cielo/mundos:

- render space;
- interaction space;
- pan/zoom;
- hit testing;
- click vs drag;
- pointercancel;
- picking;
- projection;
- camera continuity;
- z/height cues;
- offscreen targets.

Regla:
`MODEL_STATE → RENDER_MAPPING → PERCEIVED_CONSEQUENCE`.

## 22 · Temporal/perceptual QA

No cerrar movimiento por estado final únicamente.

Comprobar:
- fase;
- saltos de transición;
- pose;
- trayectoria;
- cámara;
- velocidad/amplitud;
- NONE sin movimiento continuo;
- continuidad de foco/input.

Regla:
`PIXELS_CHANGED != PERCEPTUAL_MOTION_PASS`.

## 23 · Reflow ampliado

No basta:
`document.scrollWidth <= innerWidth`.

Añadir:
`REFLOW_INTERNAL_CLIP_ORACLE`

Comprobar:
- overflow documento;
- clipping interno;
- texto 200%;
- dialogs;
- grids/listas dinámicas;
- overlays;
- controles y contenido tapado.

## 24 · Observables científicos

Cuando una interacción dependa de un rasgo:

Separar:
- body context;
- observable feature;
- reveal fact.

Comprobar:
- grounding factual;
- geometría;
- registro local;
- perceptibilidad humana.

Nuevos estados:
- VERIFIED;
- PROVISIONAL;
- HOLD / BLOCKED;
- UNKNOWN.

Un rasgo bloqueado no se convierte automáticamente en regla satisfecha.

## 25 · Clases de evidencia y paquetes

Clasificar:
- VISUAL_SPEC;
- STATIC_REVIEW;
- NAVIGABLE_PROTOTYPE;
- INTERACTIVE_RUNTIME;
- INTEGRATED_PRODUCT.

No confundir:
- screenshots con runtime;
- portable con navegable;
- artifact SUCCESS con browser QA;
- container SHA con ZIP interno;
- payload reproducible con ZIP bit-reproducible.

## 26 · Gate de escala

Antes de replicar un patrón a decenas/cientos:

`SMALL_REPRESENTATIVE_SAMPLE → EXPERT_QA → PERCEPTUAL_QA → HUMAN_FIRST_USE → PERFORMANCE → SCALE_DECISION`

No:
`ONE_PROTOTYPE_PASS → MASS_SCALE`.

Si el contenido es científico, añadir:
`FACTUAL_MATRIX → OBSERVABLES → SOURCES → HOLD/VERIFIED`.

## Regla final ampliada

**Axioma no valida sólo que el sistema llegue al estado correcto. Valida, dentro del alcance probado, que la persona pueda provocar, percibir y comprender la consecuencia prometida, y que el oráculo utilizado mida realmente esa promesa.**
