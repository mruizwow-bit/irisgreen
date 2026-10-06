# APRENDIZAJE_AXIOMA_2026-10-06

Fecha: 06/10/2026  
Área: Calidad, Accesibilidad & Standards  
Estado: `AMPLIACION_FORMACION_CONTINUA_ESTUDIADA__PRACTICA_EN_CURSO`

## Propósito

Incorporar a la formación de Axioma lo aprendido mediante revisión real de:

- Cielo nocturno / Orión y Cielo completo;
- Descubrimiento Vida marina / Peces R03–R06;
- Fósiles R01 y piloto R02;
- Construcción playable;
- áreas web Juegos y Descubrimiento;
- estudios comparados de Claude / Prisma / Nexo.

No sustituye la foundation anterior. La amplía.

---

## 1 · Regla central nueva

La evaluación de una superficie interactiva ya no se formula únicamente como:

`REQUISITO → TEST → PASS`

Se amplía a:

`PROMESA → OBSERVABLE → INVARIANTE → ORÁCULO → CONTRAEJEMPLO → EXPERT_TASK → USER_TASK`

Y para evidencias:

`OBSERVATION → ORACLE_SCOPE → EVIDENCE → LIMIT → RESULT`

Nunca:

`TEST_NAME → PASS → PROMISE_PASS`

---

## 2 · Ingeniería de oráculos

Aprendizaje:
un test puede ejecutarse perfectamente y usar un oráculo insuficiente.

Axioma debe dominar progresivamente:

- oracle problem;
- invariants;
- model-based testing;
- metamorphic testing;
- differential testing;
- counterexample design;
- partial / human oracles.

### Ejemplos demostrados

#### Reflow
Viejo:
`document.scrollWidth <= innerWidth`

Problema:
puede pasar con clipping interno vertical/horizontal.

Nuevo:
`REFLOW_INTERNAL_CLIP_ORACLE`

Debe cubrir:
- overflow documento;
- clipping interno;
- texto 200 %;
- controles fuera de viewport;
- overlays/obscuring;
- estados dinámicos, no solo first view.

#### Altura espacial
Viejo:
`state.z == 3`

Problema:
el estado puede ser correcto sin altura visible.

Nuevo:
`SPATIAL_Z_VISIBILITY_ORACLE`

Debe comprobar:
- proyección;
- oclusión;
- desplazamiento/cue de profundidad;
- consecuencia visual de z.

#### Movimiento
Viejo:
“muchos píxeles cambian”.

Problema:
puede ser flicker/deformación sin locomoción legible.

Nuevo:
`TEMPORAL_COHERENCE_ORACLE`

Combina:
- trayectoria;
- centroide;
- orientación;
- pose;
- velocidad;
- deformación;
- revisión perceptual.

---

## 3 · Invariantes antes que rutas de éxito

Aprendizaje de Fósiles R01:

`TEST_INVARIANTS_BEFORE_SUCCESS_PATHS`

Antes de comprobar “se puede completar”, comprobar qué nunca debe ocurrir:

- actuar sobre objetivo fuera de viewport;
- actuar sobre una zona distinta a la nombrada;
- publicar un mensaje que contradice el estado;
- ofrecer un control sin efecto;
- cambiar idioma y dejar copy de otro modo;
- usar una anotación no sustentada por el asset.

Nuevos oráculos:

- `TARGET_VISIBILITY_INVARIANT`
- `SEMANTIC_TARGET_CONSISTENCY`
- `STATE_MESSAGE_CONSISTENCY`
- `MODE_COPY_PARITY`
- `CONTROL_EFFECT_ORACLE`
- `ANNOTATION_GROUNDING_ORACLE`

Regla:
`APPROVED_ASSET != APPROVED_ANNOTATION`

---

## 4 · QA de interacción espacial

Axioma necesita comprender y auditar:

- coordinate transforms;
- pan / zoom;
- hit testing;
- click vs drag;
- picking;
- projection;
- occlusion;
- z / height representation;
- camera invariants;
- render space vs interaction space.

Reglas:

`VISIBLE_TARGET != HIT_TARGET` es un defecto posible.

`MODEL_STATE → RENDER_MAPPING → PERCEIVED_CONSEQUENCE` debe mantenerse.

Para experiencias de descubrimiento:

`POINT → SELECT`
`DRAG → PAN`
`EXAMINE → IDENTIFY`
`REVEAL → DEPTH`

No convertir una alternativa accesible de teclado en metáfora principal universal para ratón/touch.

---

## 5 · Continuidad cognitiva y cámara

La cámara forma parte del estado cognitivo.

Cuando una persona examina/revela:

- conservar el encuadre actual;
- cancelar destinos antiguos;
- evitar saltos tardíos;
- preservar foco;
- mantener causalidad visible.

Nuevo concepto de QA:

`ACTION_CAUSALITY`

Registrar:
- qué estaba mirando;
- qué acción hizo;
- qué cambió;
- qué permaneció estable.

---

## 6 · Interacción por intención

Aprendizaje de Vida marina:

No evaluar solo “hay handlers”.

Evaluar:

`INTENT → GESTURE → STATE_CHANGE → VISIBLE CONSEQUENCE`

Ejemplos:
- tap/click corto = seleccionar/orientar;
- drag = mover vista;
- pointercancel = cancelar, nunca ejecutar;
- teclado = alternativa con la misma intención;
- no-motion no debe reducir precisión del puntero.

---

## 7 · Motion / pose / camera / input / focus

Las superficies animadas no tienen un único estado de “movimiento”.

Matriz nueva:

`TIME · POSE · CAMERA · INPUT · FOCUS`

En NORMAL / REDUCED / NONE comprobar:

- ritmo;
- amplitud;
- pose;
- continuidad de fase;
- cámara;
- foco;
- input;
- ausencia de movimiento continuo en NONE.

Hallazgo R06:
cambiar frecuencia sin fase acumulada puede producir saltos instantáneos aunque el centro final coincida.

Nueva pregunta:
“¿qué ocurre en el fotograma de transición?”, no solo “¿dónde termina?”.

---

## 8 · Observables y perceptibilidad

Para rasgos visuales de animales/fósiles:

Separar:

`BODY_CONTEXT_THRESHOLD`
`OBSERVABLE_FEATURE_THRESHOLD`
`REVEAL_FACT`

No usar una frase completa como una sola caja geométrica.

Evolución recomendada:

`observables[]`

Cada observable puede declarar:
- id;
- label;
- type;
- geometry;
- threshold;
- sourceTrait;
- factualStatus;
- representationStatus;
- localRegistrationQA;
- humanVisibilityQA.

Tipos posibles:
- silhouette;
- landmark;
- polygon;
- point-set;
- photophore;
- texture;
- appendage;
- behavior.

Nuevos oráculos:

- `FEATURE_REGION_LOCAL_REGISTRATION`
- `FEATURE_PERCEPTIBILITY_AT_THRESHOLD_ORACLE`

Regla:
un IoU global alto no demuestra registro local en el rasgo.

Regla:
un porcentaje geométrico no demuestra que una persona perciba el rasgo.

---

## 9 · Grounding factual y representación

Distinguir siempre:

- dato factual;
- representación derivada;
- heurística de asset;
- decisión de interacción;
- unknown/hold.

Ejemplos:
- luminancia detectada ≠ fotóforo anatómicamente validado;
- región rectangular ≠ rasgo anatómico;
- constelación IAU ≠ figura de líneas oficial;
- asset aprobado ≠ anotación aprobada.

Para observables científicos:
`SOURCE_TRAIT → GEOMETRY → LOCAL_QA → HUMAN_PERCEPTIBILITY`

---

## 10 · Cielo nocturno

Aprendizajes:

### Proyección
La proyección debe ajustarse al FOV.
No asumir que una proyección válida para 27° sirve para 69°.

### Chunks técnicos ≠ UX
Los 12 campos pueden servir para streaming/indexado.
No deben convertirse necesariamente en 12 destinos de usuario.

Regla:
`ONE_SKY__STREAMED_TILES`

### Coverage ≠ specificity
Que las 88 constelaciones sean localizables no demuestra que el reconocimiento sea específico.

Nuevos oráculos:
- `SKY_DISCOVERY_SPECIFICITY_ORACLE`
- `CONSTELLATION_CONFUSION_MATRIX`

### Aprendizaje observacional
Usar:
- landmarks;
- asterismos;
- estrellas ancla;
- star-hopping;
- relación con Vía Láctea;
- vecinos ya descubiertos.

No depender de 88 pistas templadas casi iguales.

### Secuencia
Mantener:
`EXPLORE → LOCATE → REVEAL → DEPTH`

No colapsar LOCATE/REVEAL automáticamente.

### Cielo limpio
`CLEAN_SKY_IS_DEFAULT`

Evitar acumular decenas de figuras permanentemente.

---

## 11 · Mundo marino 200+

No escalar:
`MOVE_LIGHT → REVEAL`
como único loop 200+ veces.

Reglas adoptadas:

`BUILD_HABITAT_DRIVEN_DISCOVERY_SYSTEM`
`BEHAVIOR_DRIVES_ENCOUNTER_VARIETY`
`WORLD_IS_PRIMARY_INTERFACE`
`FACTUAL_ECOLOGY_NOT_AESTHETIC_RANDOMIZATION`

Macrohábitats / microhábitats deben guiar:
- ambiente;
- refugio;
- comportamiento;
- señal de descubrimiento.

Arquetipos de encuentro posibles:
- visible swimmer;
- crevice peek;
- under ledge;
- sand camouflage;
- vegetation hide;
- school;
- cleaning station;
- feeding/grazing;
- quiet/wait reveal;
- light signal;
- open-water pass;
- habitat relationship.

No asignar por estética.

Metadata futura:
- habitat_primary;
- microhabitat;
- depth_range;
- sociality;
- shelter;
- concealment;
- locomotion;
- feeding;
- detection cues;
- encounter archetypes;
- source refs.

---

## 12 · Motion y Presence separados

Nueva distinción:

`MOTION = NORMAL / REDUCED / NONE`

`PRESENCE = LOW / NORMAL / HIGH`

Motion controla movimiento.
Presence controla densidad ambiental:
- peces de fondo;
- partículas;
- vegetación;
- microvida;
- densidad visual.

Permite mundo rico sin obligar a estimulación alta.

---

## 13 · Primera tarea y HUMAN QA

Nueva obligación antes de María:

`FIRST_TASK_EXPERT_REVIEW_REQUIRED`

Preguntas:
1. ¿Dónde estoy?
2. ¿Qué puedo hacer?
3. ¿Qué haría primero sin instrucciones?
4. ¿La primera acción espontánea funciona?
5. ¿Qué consecuencia veo?
6. ¿Puedo recuperarme?
7. ¿Cómo salgo/vuelvo?

Si la revisión experta detecta bloqueo obvio:
no usar HUMAN QA como detector básico.

Registro HUMAN QA:

`INTENCIÓN → PRIMERA_ACCIÓN → CONSECUENCIA_PERCIBIDA → INTERPRETACIÓN → RECUPERACIÓN`

No primar con instrucciones de control salvo necesidad.

Una persona no demuestra representatividad poblacional ni conformidad global.

---

## 14 · Evidencia por clase de entregable

Clasificar antes de auditar:

- `VISUAL_SPEC`
- `STATIC_REVIEW`
- `NAVIGABLE_PROTOTYPE`
- `INTERACTIVE_RUNTIME`
- `INTEGRATED_PRODUCT`

Tres screenshots 320/390/1440 pueden ser:
`FRAME_RESPONSIVE_SPEC`

No equivalen a:
`RUNTIME_REFLOW_EVIDENCE`.

“Portable” tampoco equivale automáticamente a flujo navegable completo.

---

## 15 · HTML nativo y overlays

Aprendizaje web:

Preferir estructura nativa:
- header;
- nav;
- main;
- footer;
- links;
- buttons;
- dialog;
- skip link.

Para overlays:

`UI_STATE = VISUAL + FOCUS + SEMANTICS + BACKGROUND + EXIT`

Comprobar:
- focus entry;
- containment;
- Escape;
- background inertness;
- return focus;
- resize/breakpoint while open.

---

## 16 · Live regions y mensajes

ARIA live no corrige un mensaje incorrecto.

Preguntas:
- ¿el mensaje describe el estado final?
- ¿otro mensaje del mismo gesto lo sobrescribe?
- ¿dos live regions duplican el anuncio?
- ¿acciones repetidas importantes pueden reanunciarse?

Regla:
`STATE_AFTER → PRIMARY_MESSAGE`

No:
`EVENT → generic message`

---

## 17 · Escalado científico

Antes de escalar una plantilla a decenas/cientos:

- validar 1 microescena/3–10 objetos representativos;
- cubrir morfologías distintas;
- cubrir interacciones distintas;
- validar datos y observables;
- medir móvil real;
- medir rendimiento/memoria;
- comprobar perceptibilidad humana;
- then scale.

No:
`ONE_GREEN_PROTOTYPE → MASS_PRODUCTION`

---

## 18 · Paquetes y reproducibilidad

Distinguir:
- SHA del container artifact;
- SHA del ZIP interno;
- hashes del manifest;
- igualdad byte a byte del payload;
- reproducibilidad bit-exact del ZIP.

Un rerun puede producir ZIP distinto por timestamps y payload idéntico.

No confundir:
`BIT_REPRODUCIBLE_PACKAGE`
con
`CONTENT_REPRODUCIBLE_PACKAGE`.

---

## 19 · Fuentes estudiadas en esta ampliación

- W3C WCAG / Understanding;
- W3C COGA Usable;
- W3C Evaluating Web Accessibility;
- W3C Involving Users in Evaluation;
- IAU constellations/boundaries;
- NASA skywatching / asterisms;
- Calabretta & Greisen celestial projections / FITS WCS;
- HEALPix;
- FishBase ecology;
- NOAA habitats / kelp / reef / deep-sea;
- Smithsonian Ocean seagrass / mangrove;
- Monterey Bay Aquarium habitat/behavior;
- Nielsen Norman Group direct manipulation;
- software testing oracle literature.

---

## 20 · Nueva cadena profesional ampliada

Base anterior:
`SOURCE → VERSION → STATUS → APPLICABILITY → TEST → EVIDENCE → REVIEW`

Ampliación para sistemas interactivos:
`SOURCE → PROMISE → INVARIANT → OBSERVABLE → ORACLE → COUNTEREXAMPLE → EXPERT_TASK → EVIDENCE → HUMAN_TASK → RESULT → RETEST`

Regla final nueva:

**Axioma no valida sólo que el sistema pueda llegar al estado correcto. Debe comprobar que la persona puede percibir, comprender y provocar correctamente la consecuencia prometida, dentro del alcance realmente probado.**

## Referencias internas

- `FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/AXIOMA_ESTUDIO_INDEPENDIENTE.md`
- `.../AXIOMA_APENDICE_FOSILES_R01.md`
- `.../AXIOMA_MARINE_200_PLUS_WORLD_RESEARCH.md`
- `HANDOFFS/AXIOMA_DESCUBRIMIENTO_PECES_R05_20261006/REVIEW_REGIONES_OBSERVACION.md`
- `HANDOFFS/AXIOMA_DESCUBRIMIENTO_PECES_R06_20261006/REVIEW_R06.md`
- `HANDOFFS/AXIOMA_CIELO_COMPLETO_R01_20261006/ANALISIS_MEJORAS_INTERACCION_FORMATO.md`
