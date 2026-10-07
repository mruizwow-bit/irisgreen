# NEXO · ORDEN ACTIVA · VIDA MARINA 3D R03.1 · MORFOLOGÍA, LUZ Y SOURCE-OF-TRUTH

Fecha: 2026-10-07
Autoridad de producto: María
Coordinación: Nexo
Base: Vida marina 3D R03 TRUE VOLUME
Estado de entrada:
`MARINE_3D_R03_TRUE_VOLUME_ARCHITECTURE_PASS__MORPHOLOGY_LIGHTING_AND_SOURCE_SYNC_REWORK_REQUIRED`

## 0. Corrección de gate

R03 demuestra:
`NOT_BILLBOARD_ANYMORE`

Todavía NO demuestra:
`GOOD_FACTUAL_3D_ANIMAL`

Por tanto, no se emite todavía:
`MARINE_3D_R03_CORE_ANIMALS_TRUE_VOLUME_READY_FOR_NEXO_HUMAN_QA`

Antes debe existir R03.1.

## 1. KEEP absoluto

No tocar:
- mundo R02;
- cámara;
- navegación;
- talud;
- nieve marina/detrito;
- partículas;
- múltiples candidatos;
- raycast volumétrico;
- estructura procedural;
- NORMAL/REDUCED/NONE;
- flujo world-first;
- decisión de abandonar billboards.

No volver a PNG/PlaneGeometry como cuerpo.

## 2. Peces · geometría por secciones variables

Problema:
los dos peces tienen volumen matemático, pero siguen leyendo demasiado como:
`perfil lateral + espesor`

Eso NO basta.

### Pez hacha
Estado:
`PROVISIONAL_3D_REPRESENTATION`
+
`CROSS_SECTION_REWORK_REQUIRED`

Construir cuerpo mediante secciones variables a lo largo del eje:
- máxima altura corporal;
- compresión lateral extrema;
- zona cefálica diferenciada;
- quilla ventral;
- estrechamiento progresivo;
- pedúnculo caudal fino;
- transición real hacia cola.

No grosor transversal uniforme.

### Pez linterna
`KEEP_DIRECTION__REWORK_BODY`

Debe ser fusiforme:
- mayor grosor anterior/medio;
- reducción progresiva hacia cola;
- cabeza diferenciada;
- pedúnculo caudal estrecho;
- fotóforos sobre superficie 3D real.

## 3. Calamar · morfología de brazos

Dirección volumétrica KEEP.

Rework:
- brazos menos radiales/uniformes;
- agrupación frontal más anatómica;
- variación razonable de posición/curvatura;
- conservar manto/cabeza/ojos/órganos/aetas que ya aportan volumen.

Mantener:
`examinable=false`
hasta cerrar observable.

No elevar todavía a TRUE factual sin revisión morfológica.

## 4. Iluminación · blocker de producto

Problema:
el revelado visual no puede depender de “el centro entra en el haz → todo el animal aumenta emissive”.

Contrato:
`MOVE_LIGHT → PARTIAL_REVEAL → DARKNESS_RETURNS`

Nuevo gate:
`VISUAL_LIGHTING_MUST_MATCH_OBSERVATION_MASK`

Requisito:
la luz debe recorrer el cuerpo espacialmente.

Permitido:
- MeshStandardMaterial + iluminación física;
- shader/material por posición;
- máscara espacial por vértice/fragmento;
- otra solución físicamente coherente.

Prohibido:
- encendido global del animal por valor del centro;
- emissive global que haga visible todo el cuerpo a la vez.

La percepción visual y el estado lógico de observables deben coincidir.

## 5. PNG · dependencia runtime

Los PNG ya no son cuerpo.

Verificar si el runtime 3D principal todavía:
- carga;
- decodifica;
- preprocesa alpha;
- mantiene en memoria
PNG que no necesita.

Objetivo:
`PNG_NOT_REQUIRED_TO_BUILD_3D_BODY`

Si una ficha/reveal necesita PNG:
- lazy load cuando se abre;
- o dependencia separada explícita.

No pagar carga/memoria de PNG por el cuerpo 3D.

## 6. Source of truth R03

Gate:
`R03_SOURCE_OF_TRUTH_SYNC_REQUIRED`

Eliminar/actualizar contradicciones en:
- README.md;
- KEEP_CHANGE.md;
- LEEME_INTERNO.md;
- cabecera de app/escena3d.js;
- datos3d.js;
- documentación/pruebas R02 que viajen como estado vigente.

No borrar evidencia histórica; marcarla:
`HISTORICAL_R02_BILLBOARD_EVIDENCE`

Pero ningún documento vigente puede seguir afirmando:
“los animales son PNG sobre planos / no son modelos 3D”.

Actualizar:
- release3D.version → R03.1;
- representación por animal;
- estados taxonómicos;
- dependencia PNG real;
- regla de iluminación parcial.

## 7. Taxonomía pez hacha

No refinar a especie “a ojo”.

Gate:
`TAXON_SCOPE_DECISION`

Vías válidas:
A. identificar especie exacta del asset/dato original;
B. mantener representación pedagógica de género `Argyropelecus`, claramente etiquetada.

Hasta entonces:
`PROVISIONAL_3D_REPRESENTATION`

No fijar proporciones/fotóforos específicos de especie como factual.

## 8. Nuevos oráculos

Añadir como mínimo:

- `NON_UNIFORM_BODY_CROSS_SECTION_ORACLE`
- `FRONTAL_LATERAL_VOLUME_DIFFERENCE_ORACLE`
- `PARTIAL_LIGHT_REVEAL_MATCHES_GEOMETRY_ORACLE`
- `ANIMAL_ROOT_DOES_NOT_FACE_CAMERA_ORACLE`
- `PNG_NOT_REQUIRED_TO_BUILD_3D_BODY_ORACLE`
- `R03_SOURCE_OF_TRUTH_NO_BILLBOARD_CLAIMS`
- `REPRESENTATION_STATUS_MATCHES_TAXON_SCOPE`

Y:
`CAMERA_360_NO_CARDBOARD_VIEW_ORACLE`

Este último debe rotar 360° alrededor de cada animal y detectar si alguna vista colapsa a solución de cartón/perfil extruido.

## 9. Evidencia visual R03.1

Regenerar para los 3:
- lateral;
- frontal;
- 3/4;
- oblicuo;
- iluminado parcial;
- oscuridad tras salir del haz.

Entregar además:
- secuencia 360° por animal;
- comparación R03 → R03.1;
- vídeo del haz recorriendo el cuerpo.

## 10. Estados esperados tras R03.1

### Pez hacha
`PROVISIONAL_3D_REPRESENTATION`
hasta TAXON_SCOPE_DECISION.

### Pez linterna
`TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE`
si pasa morfología.

### Calamar cristal
`TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE`
si pasa morfología y observable.

## 11. Entrega

Nuevo paquete:
`VIDA_MARINA_3D_R03_1_TRUE_VOLUME.zip`

Debe incluir:
- runtime completo;
- modelos/procedural;
- datos;
- docs sincronizadas;
- manifests;
- hashes;
- nuevos oráculos;
- resultados;
- 360°;
- 9+ vistas;
- vídeo de luz parcial;
- límites;
- taxon scope.

Gate esperado:
`MARINE_3D_R03_1_MORPHOLOGY_LIGHTING_SOURCE_SYNC_READY_FOR_NEXO`

Después:
Nexo retest real del ZIP → Axioma precheck → HUMAN QA María.

NO MAIN · NO PUBLIC DEPLOY · NO SCALE 200+.
