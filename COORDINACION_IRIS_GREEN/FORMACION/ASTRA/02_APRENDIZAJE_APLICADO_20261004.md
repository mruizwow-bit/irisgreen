# ASTRA · APRENDIZAJE APLICADO · 04/10/2026

Estado: `ASTRA_APPLIED_LEARNING_20261004`

Este documento añade aprendizaje derivado de trabajo real y supersede interpretaciones anteriores cuando entren en conflicto.

## 1. Sabik · identidad y composición

No confundir:
- identidad visual;
- runtime;
- layout Home;
- controles;
- diálogo/voz.

El Sabik aprobado preserva:
- body canónico;
- núcleo espacial estable;
- órbitas/capas;
- estados reales;
- voz/runtime.

Lección:
un componente puede estar técnicamente presente y ser perceptualmente incorrecto por composición.

Regla:
`PRESERVE_RUNTIME + RECONCILE_PRESENTATION`

No “arreglar” Sabik redibujándolo.

## 2. Control hierarchy

En interfaces neurodiversity-aware:
capacidad completa ≠ todos los controles visibles.

Sabik:
- primary: Enviar + Hablar;
- contextual: Detener/Repetir;
- secondary: volumen, velocidad, movimiento, reset.

Regla:
`SHOW_CONTROL_WHEN_ACTION_IS_RELEVANT`

Esto reduce carga sin retirar capacidad.

## 3. Tests can be wrong

Se detectaron tests que exigían:
- Sabik 220–300 px;
- dos columnas;
- controles históricos visibles.

Cuando el producto aprobado cambió, esos tests dejaron de ser oracles.

Regla:
`UPDATE_TEST_TO_CURRENT_PRODUCT_CONTRACT`
no
`DEGRADE_PRODUCT_TO_PASS_OLD_TEST`.

## 4. Child safety

El hallazgo más importante:

runtime antiguo:
`AGE_18_PLUS → isAdult() → adult-explicit`

Eso mezclaba autodeclaración con autorización.

Nueva arquitectura:
`AGE_SELECTION != ADULT_ACCESS_AUTHORIZATION`

P0:
- AGE_UNSET obligatorio;
- 18+ claimed sigue safe;
- restricted/full no se publica públicamente;
- JS failure/no-JS fail closed;
- Sabik text/voice same gate.

Lección:
**seguridad real debe proteger recursos y rutas, no solo botones.**

## 5. Discovery is causality

Producto Descubrimiento:
`ACTION → CONSEQUENCE → INFORMATION`

El asset no es el descubrimiento.

La acción tiene que pertenecer al fenómeno.

Accesibilidad:
drag/gyro/motion no son requisitos semánticos.

## 6. Cielo

Cielo se corrige como PRODUCT_NEW_FROM_ZERO:
- assets/data sí reutilizables;
- legacy runtime/layout no source of truth;
- first target Orión;
- curated preset;
- no “Orión” antes de localizar cinturón;
- 6-frame storyboard antes de runtime;
- no segunda constelación hasta HUMAN QA.

Lección:
**reusar datos no obliga a reusar interacción.**

## 7. Prototype-first

Mapa del tesoro pasó gates técnicos pero María lo descartó como concepto de juego.

Habitación imposible tuvo solver correcto pero UI/product fail.

Lección:
`TECHNICALLY_SOLVABLE != UNDERSTANDABLE_OR_FUN`

Antes de código nuevo:
storyboard y HUMAN QA.

## 8. Biblioteca Maestra Sabik

María ya construye la Biblioteca.

Astra no debe ordenar “crear otra”.

Gobernanza:
- María = owner editorial;
- Nube = mantenimiento/ingestión;
- Axioma = ethics/standards;
- Vigía = provenance/evidence;
- Lex = legal exception;
- Córtex = consumer/evals;
- Nexo = E2E.

Regla:
`ONE_MASTER_LIBRARY`

No checkpoints paralelos.

## 9. Sabik scope

Sabik es:
- conversational first;
- general-purpose;
- extensible;
- multimodal.

Iris Green es una fuente especializada.

No:
“no hay información en Iris Green” = “no puedo hablar de eso”.

## 10. Patentability red-team

Lecciones:
- arquitectura coordinada puede tener technical effect sin ser inventiva;
- no sumar piezas de generaciones distintas como si coexistieran en una versión;
- original June core vs later voice/memory evolutions;
- broad claim se destruye primero;
- residuo técnico estrecho debe demostrar implementación y sinergia.

PAT-NEA-CORE-001:
`TECHNICAL_EFFECT_REVIEW_REQUIRED`
no patent candidate.

Formal Astra final re-pass contra matriz Nube/Motor/Pulso/Vigía:
**pendiente**.

## 11. Privacy claim discipline

Reglas:
- persistencia y transmisión son gates distintos;
- voice local no implica reasoning local;
- no-store de audio no implica que todo el turno sea local;
- una especificación de veto no prueba tombstone persistente.

## 12. Asset/library handling

No rehacer assets aprobados.

Cuando María dice “sustituye”:
- identificar exactamente el bloque vigente;
- reemplazar sin dejar duplicados activos;
- si María revoca antes de ejecutar, no mutar;
- distinguir candidato recibido de replacement confirmado.

Aplicado a peces:
- Bloque 15 sustituido;
- Bloque 16: último ZIP de replacement fue revocado;
- nuevas imágenes posteriores son candidatas hasta confirmación/packaging;
- Bloque 10 tiene replacement por imágenes solicitado y pendiente de packaging/ingesta.

## 13. Regla de ritmo operacional

Trabajar por micro-bloques porque sesiones largas pueden atascarse.

`SMALL_ACTION → CHECKPOINT → NEXT`

No acumular diez mutaciones antes de informar estado.

## Marcador

`ASTRA_TRAINING_EXPANDED_WITH_20261004_LEARNINGS`
