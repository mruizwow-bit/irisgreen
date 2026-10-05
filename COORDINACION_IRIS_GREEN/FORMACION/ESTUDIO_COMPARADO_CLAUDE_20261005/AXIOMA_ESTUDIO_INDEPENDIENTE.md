# AXIOMA · ESTUDIO INDEPENDIENTE · CIELO / PECES / CREACIÓN DE WEBS

Fecha: 2026-10-05
Encargo: María
Naturaleza: aprendizaje y transferencia, no auditoría de aprobación ni búsqueda de culpables.

Estado: AXIOMA_ESTUDIO_COMPARADO_CLAUDE_20261005_COMPLETE

## 0 · Pregunta de trabajo

La pregunta no es «¿quién hizo mejor el trabajo?».

La pregunta es: ¿qué decisiones concretas consiguieron que una experiencia se sintiera más comprensible, directa y coherente; qué sabía ya Axioma; qué no aplicó; qué no sabía comprobar todavía; y cómo cambia su práctica desde ahora?

Este informe no sustituye HUMAN QA, revisión de conformidad, producto/arquitectura de Astra, implementación de Prisma/Motor ni interpretación jurídica de Lex. No modifica producto, main, Sabik ni despliegues.

## 1 · Bases exactas y clases de evidencia

### Cielo
CIELO_ORION_INTERACTIVO_R01(1).zip
SHA-256: 2e036ce4c3e3984be09d2c0ba630470f2129be49738960ec070bffa756d0026c
Verificación propia: ZIP íntegro y 41/41 hashes de manifest PASS.

### Peces
descubrimiento-peces-R02_1_2_1.zip
SHA-256: a5a39e5d5de8369cfb0bf392dbeab6d20c66720128c094b5261517466f729717
Verificación propia: ZIP leído y 76 entradas hash reales verificadas.

### Descubrimiento web
DESCUBRIMIENTO_AREA_NAVEGABLE_R01_1.zip
SHA-256: d0ef4877a09e892cf219afdb90089a44cad83b181544b2f70df7972c815b04e3
Verificación propia: ZIP leído y 38 entradas hash reales verificadas.

### Construcción Prisma · comparación
PRISMA_CONSTRUCTION_PLAYABLE_R01.zip
SHA-256: e2370c5e6e71177412f66623077e8f66fc47b03b98985a40b6e89fb59b958b2a
Origen: artifact 11355916345 · run 37334312861 · HEAD 139622ffab3153d73f807bfec51c5710d474e875.

### Juegos visual Claude · comparación web/diseño
CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3.zip
SHA-256: 6dc3e7e94804357f85daaf538a65a27a1afbc60e0498f92ee492324db6fa2af5
Se estudia como proceso de frame/exportación. No se confunde con runtime jugable.

### Clases de evidencia
1. LECTURA_DIRECTA: código, HTML, CSS, scripts, manifests y bancos.
2. EJECUCIÓN_AXIOMA: ejercicios y contraejemplos en copia aislada.
3. EVIDENCIA_AUTOR: resultados entregados por autor sin atribuirlos a una ejecución propia.
4. HIPÓTESIS_PERCEPTUAL: «parece nadar», «invita a explorar», «se entiende a la primera»; requieren observación humana.

Las correcciones posteriores que María ha validado en Cielo/Peces permanecen KEEP. Los fallos de estas bases históricas se usan para aprender y no se reabren como defectos actuales.

## 2 · Comparación con la formación canónica de Axioma

Formación leída:
- FORMACION/DEPARTAMENTOS/AXIOMA_CALIDAD/00_IDENTIDAD_Y_MISION.md
- 01_PLAN_FORMACION.md
- 02_PRACTICAS_Y_EXAMEN.md
- 03_RUNBOOK_AUDITORIA_Y_CONFORMIDAD.md
- APRENDIZAJE_AXIOMA_2026-09-30.md

### 2.1 Lo que Axioma ya sabía

Ya estaba documentado:
- AUTOMATED_PASS != ACCESSIBLE.
- Una prueba necesita alcance y límites.
- WCAG no cubre toda la experiencia cognitiva.
- COGA exige claridad, memoria, predictibilidad, densidad y recuperación.
- ISO 9241-210 orienta al diseño centrado en las personas.
- ISO/IEC 25010/25040 impiden reducir calidad a ausencia de bugs.
- Revisión manual y evidencia humana complementan automatización.
- No extrapolar emulación a experiencia real.
- Todo fallo material repetible debería convertirse en test, fixture, checklist u oráculo mejor.

Conclusión: el problema principal no fue desconocer que hacía falta revisión humana.

### 2.2 Lo que no aplicamos con suficiente rigor

Faltó convertir el conocimiento en una cadena previa y explícita:

PROMESA DE PRODUCTO → COMPORTAMIENTO OBSERVABLE → ORÁCULO → CONTRAEJEMPLO → EVIDENCIA HUMANA

Con frecuencia se hizo:

REQUISITO TÉCNICO → TEST → PASS

y después el nombre del test sonó más amplio que lo realmente observado.

Ejemplo: «texto 200 % sin pérdida» no puede equivaler únicamente a document.scrollWidth <= innerWidth. Eso observa overflow horizontal del documento; no clipping vertical, overflow interno, overlays, contenido tapado ni comprensión de la tarea.

El propio estado fundacional era FOUNDATION_STUDIED_PRACTICE_PENDING. Este estudio confirma que esa etiqueta era correcta.

# 3 · CIELO

Base: CIELO_ORION_INTERACTIVO_R01(1).zip
Archivos principales: js/motor.js, js/interfaz.js, pruebas/banco-de-pruebas.js, datos/sky-a01-04-ori.json.

## 3.1 Reconocimiento matemático correcto no equivale a gesto utilizable

Pregunta: ¿la persona puede realizar la intención natural «señalar algo que veo en el cielo» sin traducirla mentalmente a una retícula central?

Evidencia necesaria: input real ratón/touch, hit testing con cámara actual, distinción click/tap vs drag, ausencia de recentrado no solicitado y resultado localizable sin spoiler.

Aserción existente: el banco demuestra que el cinturón puede entrar en la región central, examinarRegion() reconoce el patrón, existe una ruta real de flechas y Enter permite examinar.

Alcance real: demuestra la matemática de reconocimiento y la ruta teclado-retícula. No demuestra que el gesto primario con ratón/touch corresponda a la intención espontánea de señalar.

Lectura directa de la base histórica: pointerdown/pointermove gobiernan arrastre de cámara; no existe selección directa de una estrella/zona visible mediante click como verbo primario; la identificación está acoplada a la región central.

Contraejemplo AX-EX-01 ejecutado:
1. Orión se llevó a condición reconocible.
2. examinarAhora().coincide = true.
3. Click directo sobre una estrella real del cinturón: la etapa siguió «observando».
4. Enter con escena enfocada: la etapa pasó a «localizada».

Resultado: el oráculo retícula/teclado PASS mientras el gesto de señalamiento directo estaba ausente.

Punto ciego: el banco respondía «¿puede llegar matemáticamente a una configuración reconocible?». La pregunta de producto era «¿la primera acción que una persona intenta produce la consecuencia esperada?».

Técnica adecuada: DIRECT_POINT_SELECTION_ORACLE. Bajo pan/zoom: click/tap corto sobre target visible selecciona; drag mueve cámara y no selecciona; seleccionar no identifica automáticamente; no hay salto de cámara; teclado conserva equivalencia.

Decisión a adoptar: POINT→SELECT, DRAG→PAN, EXAMINE→IDENTIFY, REVEAL→DEPTH.
Decisión a evitar: convertir la alternativa accesible de teclado/retícula en única metáfora de interacción para todas las modalidades.

## 3.2 El estado de cámara es parte de la continuidad cognitiva

Pregunta: ¿la persona conserva la referencia espacial que acaba de construir cuando examina o revela?

La evidencia adecuada incluye posición/zoom inmediatamente antes y después, callbacks pendientes, retorno de foco y ausencia de salto tardío.

Las correcciones posteriores incorporaron congelación/cancelación de cámara y continuidad de foco. El aprendizaje no es solo «animación correcta»: es continuidad de atención y causalidad de acción.

Para interfaces espaciales Axioma debe auditar ACTION_CAUSALITY: qué estaba mirando, qué hizo, qué cambió y qué permaneció estable.

## 3.3 No-spoiler y profundidad progresiva

La separación observar → localizar → identificar → revelar reduce sobrecarga y mantiene propósito. Axioma ya conocía progressive disclosure por COGA, pero no lo convertía siempre en criterio de secuencia de tarea.

Nueva pregunta: no solo «¿el texto existe?», sino «¿aparece en el momento cognitivo correcto?»

# 4 · PECES

Base: descubrimiento-peces-R02_1_2_1.zip
Archivos principales: app/motor.js, app/interfaz.js y bancos de movimiento/cámara/candidatos.

## 4.1 El input expresa intención

La implementación separa movimiento corto/tap para orientar luz, drag sobre umbral para desplazar vista, teclado para vista y teclas/modificadores para luz.

Esto modela intención, no solo eventos.

Transferencia: INTENT → GESTURE → STATE_CHANGE → VISIBLE CONSEQUENCE. Axioma no debe limitarse a comprobar EVENT_HANDLER_EXISTS.

## 4.2 Dibujar y detectar deben compartir geometría

El motor combina transformación, orientación, deformación, viewport, máscara de luz, alpha útil, umbral visible y descarte edge-on. La detección no usa una caja abstracta desconectada del dibujo.

Aprendizaje: en interfaces gráficas ricas Axioma debe comprobar coherencia entre RENDER SPACE e INTERACTION SPACE. Aplica a peces, estrellas, mapas, construcción, drag/drop, canvas y WebGL.

## 4.3 Reloj, pose y cámara son estados distintos

El motor separa tiempo de animación, pose, cámara, pausa y encuadre. Eso permite pausar sin borrar pose, congelar cámara y continuar sin revivir un destino antiguo.

Nueva matriz de motion para Axioma: TIME · POSE · CAMERA · INPUT · FOCUS.

## 4.4 «Hay movimiento» no significa «parece nadar»

Pregunta: ¿la animación comunica locomoción biológica reconocible?

Aserción existente: un banco mide cambio de píxeles entre frames y distingue NORMAL/REDUCED/NONE.

Alcance real: demuestra cambio, reducción y quietud. No demuestra que el movimiento se perciba como natación.

Contraejemplo AX-EX-03:
- píxeles cambiados = 5261;
- desplazamiento del centroide = 0.044 px.

El oráculo de cambio de píxeles da PASS. La promesa «se desplaza/nada» no queda demostrada. Un oráculo temporal/coherente da FAIL.

Técnica correcta: combinar trayectoria de centroide, continuidad de orientación, límites de deformación, velocidad/aceleración, pose y revisión perceptual humana continua.

## 4.5 Identidad DOM estable protege foco

La reconciliación de candidatos por ID conserva nodos al cambiar idioma, posición, copy o estado. Esto evita reconstruir todo el subtree y perder foco.

Regla transferida: STABLE_IDENTITY → UPDATE_IN_PLACE → FOCUS_CONTINUITY.

# 5 · CREACIÓN DE WEBS

Base principal: DESCUBRIMIENTO_AREA_NAVEGABLE_R01_1.zip.
Comparación visual: CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3.zip.

## 5.1 HTML nativo reduce deuda de accesibilidad

La web usa header, nav, main, footer, skip link, links reales y controles con función nativa. Una tarjeta navegable es un enlace completo; el pseudo-CTA visual no crea un botón anidado.

Aprendizaje: muchas veces la accesibilidad fuerte nace de modelar correctamente la acción, no de añadir ARIA después. Esto ya estaba en formación Axioma; debe exigirse antes como criterio de arquitectura interactiva.

## 5.2 Un overlay es una transición, no una captura

El menú móvil gestiona aria-expanded, fondo, inert, aria-hidden, foco inicial, Tab/Shift+Tab, Escape y retorno de foco.

Regla: UI_STATE = VISUAL + FOCUS + SEMANTICS + BACKGROUND + EXIT.

Una captura solo prueba la primera dimensión.

## 5.3 Layout fluido no equivale a tener tres screenshots

Juegos R01_3 aporta frames separados 320/390/1440. Eso sirve como especificación visual, no demuestra un solo DOM, reflow continuo, breakpoints, foco, navegación o interacción.

Descubrimiento, en cambio, usa Grid/Flex, minmax(0,1fr), wrapping, anchuras fluidas, fuentes locales y tokens.

Nueva etiqueta de evidencia:
- FRAME_RESPONSIVE_SPEC
- RUNTIME_REFLOW_EVIDENCE

No promover una a la otra.

## 5.4 El nombre del test no es el oráculo

Una prueba puede llamarse «texto 200 % sin pérdida» y limitarse a document.scrollWidth <= innerWidth.

Contraejemplo AX-EX-02 ejecutado:
- viewport = 320;
- document.scrollWidth = 320 → viejo PASS;
- elemento visible scrollHeight = 497;
- clientHeight = 68;
- overflow = hidden.

Hay pérdida real vertical sin overflow horizontal.

Oracle mejorado REFLOW_INTERNAL_CLIP_ORACLE:
1. documento sin overflow horizontal;
2. controles dentro del viewport;
3. descendientes visibles sin clipping interno horizontal/vertical;
4. overlays/obscuring;
5. 200 % en los estados relevantes.

El fixture que pasaba antes da FAIL con el oracle nuevo.

## 5.5 Packaging portable necesita una frontera honesta

Claude separa editable/canvas, portable, PNG review, recursos locales, exportadores y verificador. Es una buena práctica de handoff.

Pero «portable» no implica «flujo navegable completo».

Clases que Axioma debe exigir:
- VISUAL_SPEC
- STATIC_REVIEW
- NAVIGABLE_PROTOTYPE
- INTERACTIVE_RUNTIME
- INTEGRATED_PRODUCT.

# 6 · CONSTRUCCIÓN PRISMA COMO CONTRAEJEMPLO DE REPRESENTACIÓN

No se estudia para culpar a Prisma. Se usa porque separa muy bien regla correcta de representación insuficiente.

## 6.1 Lo que estaba bien

El código demuestra costes, apoyo, alcance, colocación válida, retirada segura, dependencias, refund, undo, save, live status, touch/keyboard y Browser CI. Ese conocimiento se conserva.

## 6.2 El punto ciego

El estado tiene z, pero cellRect(x,y) proyecta x/y; z no crea desplazamiento visual equivalente. El player puede terminar en z3 y el test puede afirmar z3 mientras el mundo sigue leyendo como cuadrícula plana.

Contraejemplo AX-EX-04:
- oracle viejo final player.z == 3 → PASS;
- renderer plano modelado: diferencia visible z1→z3 = 0 px;
- SPATIAL_Z_VISIBILITY_ORACLE → FAIL;
- fixture con proyección vertical: delta = 56 px → PASS.

Aprendizaje: una variable correcta no demuestra su representación. Para experiencias espaciales MODEL_STATE → RENDER_MAPPING → PERCEIVED_CONSEQUENCE deben estar conectados.

# 7 · Cuatro contraejemplos obligatorios

Resultados machine-readable: AXIOMA_EJERCICIOS_ORACULOS_RESULTADOS.json.

AX-EX-01 Cielo: retícula/reconocimiento/Enter PASS; click directo natural ausente.
AX-EX-02 Web: scrollWidth PASS; contenido interno vertical recortado.
AX-EX-03 Peces: 5261 píxeles cambian; centroide 0.044 px; no prueba natación.
AX-EX-04 Construcción: z=3 PASS; consecuencia visual vertical 0 px.

# 8 · Dos oráculos mejorados demostrados

## REFLOW_INTERNAL_CLIP_ORACLE

Antes: document.scrollWidth <= innerWidth.
Ahora: overflow de documento + clipping interno horizontal/vertical + controles fuera de viewport + contenido oculto + overlays en estados relevantes.

Demostración: fixture viejo PASS; nuevo FAIL.

## SPATIAL_Z_VISIBILITY_ORACLE

Antes: state.z == expected.
Ahora: si el producto presenta altura visual, mismo x/y en z distintas debe producir desplazamiento, oclusión, escala o cue de profundidad definido.

Demostración: flat renderer FAIL; projected fixture PASS.

# 9 · Protocolo nuevo de observación de primera tarea

Esto no sustituye user testing; evita que María vuelva a descubrir carencias básicas que una revisión experta podía detectar.

## Antes de María

Axioma/owner debe responder:
1. ¿Dónde estoy?
2. ¿Qué puedo hacer?
3. ¿Qué haría primero una persona sin instrucciones?
4. ¿La primera acción espontánea funciona?
5. ¿Qué consecuencia visible produce?
6. ¿Puedo recuperarme de un error?
7. ¿Cómo salgo/vuelvo?

Si el experto ya detecta un bloqueo obvio, no usar a María como detector básico.

## HUMAN QA sin priming

Registrar:
INTENCIÓN → PRIMERA ACCIÓN ESPONTÁNEA → CONSECUENCIA PERCIBIDA → INTERPRETACIÓN → RECUPERACIÓN

Campos:
- qué cree que puede hacer;
- primer gesto;
- tiempo/pasos hasta primera acción significativa;
- qué cree que cambió;
- si reconoce éxito/error;
- si busca Ayuda;
- si puede volver/salir/reiniciar;
- frases textuales de confusión;
- dispositivo/contexto.

Ejemplo Cielo: «Explora el cielo y mira si encuentras algo interesante». No decir «mete Orión en el círculo».
Ejemplo Peces: «Explora y descubre un animal». Observar luz, drag, señal, examen y retorno de oscuridad.
Ejemplo Web: «Entra en el descubrimiento que te interese». Observar jerarquía, menú, tarjeta y retorno.

Una sesión con María no demuestra conformidad ni representatividad poblacional. Sí aporta evidencia decisiva sobre intención de producto y comprensión espontánea.

# 10 · Qué adopta Axioma

## De Cielo
Adoptar: estados progresivos, no-spoiler, congelación de cámara, contexto estable.
No copiar: retícula central como única metáfora cuando apuntar directamente es natural.

## De Peces
Adoptar: input por intención, render/hit-testing en geometría compartida, separación time/pose/camera, nodos dinámicos estables.
No copiar: cambio de píxeles como prueba suficiente de una cualidad perceptual.

## De Web
Adoptar: HTML nativo, overlays como máquinas de estado, layout fluido, tokens/fuentes locales, fronteras honestas de paquete.
No copiar: títulos de prueba más amplios que assertions, ni frames como sustituto de runtime.

## De Construcción Prisma
Adoptar: invariantes, retirada segura, undo, Browser CI y estados accesibles.
No repetir: confundir z lógico con volumen visible, ruta completada con mundo convincente o PASS técnico con preparación de producto.

# 11 · Práctica dominada / no aplicada / formación nueva

## Ya dominada
Disciplina de evidencia y límites. AUTOMATED_PASS != ACCESSIBLE ya estaba documentado y Axioma sabe verificar bytes, reproducir findings, retestar commits y declarar límites.

## Sabíamos la teoría, pero no se aplicó a tiempo
COGA + ISO 9241-210 + calidad multidimensional ya estaban estudiados. Faltó convertirlos en FIRST_TASK_EXPERT_REVIEW_REQUIRED antes de enviar producto a María.

Construcción lo demuestra: rutas y accesibilidad podían pasar mientras el mundo no materializaba el juego esperado.

## Formación nueva necesaria

### A · TEST_ORACLE_ENGINEERING_FOR_INTERACTIVE_SYSTEMS
Oracle problem, model-based oracles, invariants, metamorphic testing, differential testing, counterexample design y human/partial oracles.

### B · SPATIAL_INTERACTION_QA
Coordinate transforms, pan/zoom, hit testing, click vs drag, picking, occlusion, projection, z/height representation y camera invariants.

### C · TEMPORAL_AND_PERCEPTUAL_QA
Trayectoria, pose continuity, temporal coherence, speed/amplitude, camera/subject separation y perceptual review.

### D · TASK_BASED_FIRST_USE_OBSERVATION
Evitar priming, task success, recuperación, think-aloud con cautela, límites de muestra y triangulación con expertos/standards.

Axioma no necesita convertirse en implementador de motores. Necesita saber qué observar, cómo falsar una promesa y cuándo el oráculo debe ser humano.

# 12 · Fuentes externas estudiadas

W3C Evaluating Web Accessibility:
https://www.w3.org/WAI/test-evaluate/

W3C Involving Users in Evaluating Web Accessibility:
https://www.w3.org/WAI/test-evaluate/involving-users/

W3C COGA Usable:
https://www.w3.org/TR/coga-usable/

IEEE · The Oracle Problem in Software Testing: A Survey:
DOI 10.1109/TSE.2014.2372785

Aprendizaje combinado: herramientas y conformidad técnica no sustituyen evaluación humana; usuarios pueden revelar barreras de uso que la revisión de conformidad no encuentra; la revisión experta debe retirar antes obstáculos obvios; un test puede ejecutarse perfectamente y usar un oracle insuficiente.

# 13 · Cambio operativo de Axioma

Antes de aprobar una superficie interactiva, añadir:

PROMISE → OBSERVABLE → ORACLE → COUNTEREXAMPLE → EXPERT_TASK → USER_TASK

No todos los pasos requieren automatización.

Checklist:
1. Promesa: ¿qué afirma realmente el producto?
2. Observable: ¿qué tendría que suceder?
3. Oracle: ¿qué medida decide PASS?
4. Counterexample: ¿qué podría hacer pasar el test sin cumplir la promesa?
5. Expert task: ¿Axioma completa la primera tarea sin manual?
6. Human task: ¿una persona no autora hace lo esperado espontáneamente?

Regla de reporte:
No usar TEST_NAME → PASS → PROMISE_PASS.
Usar OBSERVATION → ORACLE_SCOPE → EVIDENCE → LIMIT → RESULT.

# 14 · Decisión final

Lo que faltó comprender no fue principalmente más WCAG.

Faltó dominar mejor la relación entre intención, representación, interacción y oracle.

Lo que faltó aplicar: ya conocíamos evaluación humana, COGA, calidad multidimensional y límites de automatización. No se aplicó suficientemente pronto como pregunta de primera tarea, contraejemplo, gate de representación y oracle perceptual.

Claude aporta ejemplos concretos útiles de estado progresivo, continuidad de cámara, input por intención, reconciliación estable, web nativa y packaging explícito; también tiene límites que no deben copiarse.

Prisma aporta invariantes sólidos, apoyo, coste, undo, save y Browser CI; la lección es conectar esas reglas con mundo, representación, affordance y consecuencia visible.

Nuevas reglas Axioma:
ACCESSIBLE_CONTROL != COMPREHENSIBLE_TASK
CORRECT_STATE != CORRECT_REPRESENTATION
REAL_INPUT_TEST != RIGHT_PRODUCT_ORACLE
HUMAN_QA != SUBSTITUTE_FOR_EXPERT_REVIEW

Cadena adoptada:
STANDARD + TASK + REPRESENTATION + INTERACTION + ORACLE + COUNTEREXAMPLE + HUMAN_EVIDENCE

Resultado:
AXIOMA_INDEPENDENT_STUDY_COMPLETE__TRANSFER_ACTIONS_DEFINED

Siguiente: Prisma entrega su estudio individual; Nexo contrasta ambos; se incorpora al currículo lo demostrado; los nuevos oráculos se aplican al siguiente trabajo sin pedir a María repetir rechazos conocidos.