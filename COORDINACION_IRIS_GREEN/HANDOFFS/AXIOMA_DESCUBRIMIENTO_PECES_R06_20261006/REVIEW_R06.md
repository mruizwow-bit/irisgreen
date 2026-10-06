# AXIOMA · DESCUBRIMIENTO PECES R06 · REVIEW

Fecha: 2026-10-06

Estado:
`AXIOMA_MARINE_R06_KEEP_CORE_SCHEMA__PERCEPTUAL_GATE_REWORK_REQUIRED`

## Evidencia exacta

Producto:
`descubrimiento-peces-R06(2).zip`
SHA-256:
`917548b0a710ed2f17a9264e9516a0bd329f86511fe514fc8f5adf52962f6e03`

Interno:
`descubrimiento-peces-R06-interno(2).zip`
SHA-256:
`3d1cfd216adbde27be5d898f63c8d60f44650f93293eee9d402feaec91358bd2`

ZIP test PASS.
Manifest público 34/34 PASS.

La lámina canónica dentro del ZIP interno:
`observables-R06.png`
SHA:
`f8e130ea42928fde48852decd7a5e7f2abcdddc9dcf52ce143d70e0c4442b834`

Nota: el PNG suelto adjunto en chat no es el mismo binario (resolución/hash distintos). Para trazabilidad, la copia canónica debe ser la incluida en el ZIP interno.

## PASS / KEEP

R06 cierra correctamente los findings R05 de motor:
- fase acumulada; 0 px de salto geométrico en cambios de perfil según banco;
- NONE conserva pose/giro/deformación;
- confirmación multiple-candidate contextual y caducable;
- event.repeat no confirma;
- cambio de objetivo por `Otro animal` explícito;
- reanuncio deliberado;
- reflow 200% ampliado a estados abiertos;
- esquema v2 con `bodyContext`, `observables[]`, `revealFacts`, `combinacionObservables`;
- producto con `modoEquipo:false`;
- tap/drag/pointercancel ya corregidos;
- registro local por observable, no solo global;
- lenguaje de QA más honesto: alfa ≠ anatomía.

Estas partes quedan KEEP.

## Finding 1 · Calamar sin observable activo

El calamar declara:
- observable `brazos-al-frente`;
- IoU local con corrección global = 0.8483;
- estado = BLOQUEO_LOCAL;
- `activo:false`.

En `motor.js`, si una pieza tiene 0 observables activos:
`reglaObs = true`.

Por tanto el calamar puede ser examinable con:
`BODY_CONTEXT_THRESHOLD = 35%`
sin cumplir ningún observable.

Esto es coherente como degradación técnica para no bloquear la demo, pero contradice el nuevo contrato conceptual:
`BODY_CONTEXT + OBSERVABLE_FEATURE`.

Decisión Axioma:
`CALAMAR_FEATURE_GATE_DEGRADED`

Antes de usar R06 como plantilla pública:
- corregir el par luz/oscuro de brazos en biblioteca, o
- definir otro observable realmente sustentado por los binarios, o
- mantener el calamar visible como ambiente pero NO examinable, con motivo explícito.

No recomendaría dejarlo examinable solo por contexto corporal.

## Finding 2 · el paquete humanVisibilityQA no filtra estados examinables reales

`pruebas/perceptibilidad.js` recoge casos desde `med.todos` filtrando:
- observable activo;
- `obs !== null`;
- `enVista`;
- contexto mínimo parcial.

Pero NO filtra:
- `c.examinable`;
- estado `deCanto`;
- body context >= 35% para todos los niveles;
- confirmación de que la pose representa la forma a evaluar.

Esto produce ejemplos como el pez hacha en `caso-15/16/17`, donde aparece prácticamente de canto.

El propio motor establece:
`deCanto(giro) => no examinable`.

Así, el material de perceptibilidad puede pedir a una persona valorar la 'silueta alta y aplanada' en una pose que el producto nunca debería aceptar como descubrimiento.

Corrección:
regenerar los casos de perceptibilidad separando dos familias:

A. `VALID_EXAMINABLE_THRESHOLD_CASES`
- contexto >=35%;
- observable alrededor de 50%;
- no de canto;
- en vista;
- misma lógica final de `examinable` salvo variación controlada del umbral.

B. `ADVERSARIAL_NON_EXAMINABLE_CASES`
- de canto;
- poco contexto;
- observable fuera;
- rasgo fuera de viewport.

Las dos familias deben estar etiquetadas internamente, pero las imágenes de HUMAN QA siguen sin copy ni respuesta.

## Finding 3 · Pez hacha activo con registro local en REVIEW

`silueta-alta`:
- IoU local corregido = 0.9381;
- estado = REVISAR;
- `activo:true`.

Puede ser razonable que una banda de contorno sea sensible a grosor de trazo, pero mientras el estado sea REVISAR el observable no debería convertirse en patrón canónico para 200+.

Opciones:
- inspección visual/manual del par en esa región y cierre documentado;
- o estado `PROVISIONAL_ACTIVE_FOR_PROTOTYPE` explícito.

## Finding 4 · Fotóforos detectados por luminancia necesitan validación semántica

El pez linterna mejora claramente:
- 24 centros;
- tolerancia 28 px;
- IoU local 0.9779.

Pero detectar puntos por luminancia en el asset demuestra 'puntos brillantes', no por sí solo 'fotóforos anatómicamente correctos'.

Antes de escalar el algoritmo:
- revisión manual de los centros;
- excluir reflejos/ojos/brillos accidentales;
- conservar procedencia del observable como `ASSET_DERIVED_REPRESENTATION`, no factual automática.

## humanVisibilityQA

Correcto que siga:
`PENDING`

Axioma NO lo convierte en PASS.

Además, debe repetirse con el set corregido de casos válidos antes de pedir una decisión humana sobre 50%.

## Factual / escala

Las tres asignaciones de zona continúan `HEREDADO` y `heredado-sin-revalidar`.

Esto no bloquea el prototipo privado, pero sí bloquea tratar R06 como patrón de publicación masiva.

Antes de escalar:
- taxón;
- talla/definición;
- zona;
- observable;
- revealFacts;
- fuentes;
- estado VERIFIED/HOLD.

## Packaging

Los dos ZIP coinciden con los SHA declarados.

La imagen standalone adjunta no coincide en bytes/resolución con la lámina canónica interna. No es un defecto del ZIP, pero conviene evitar dos archivos llamados igual con identidad distinta.

## Decisión

R06 ya es una base mucho más madura.

No reabrir:
- motor de luz;
- fase;
- confirmación;
- foco;
- reflow;
- esquema observables;
- separación body/observable/reveal.

Sí corregir antes del gate final de observables:
1. política del calamar sin observable activo;
2. regenerar casos de perceptibilidad usando estados examinables reales;
3. cerrar/etiquetar el contorno del hacha en REVIEW;
4. validar manualmente que los 24 puntos del linterna son los fotóforos pretendidos.

Después:
`AXIOMA EXPERT PERCEPTUAL PRECHECK → HUMAN VISIBILITY QA → decidir umbrales → microescena`

Resultado:
`AXIOMA_MARINE_R06_KEEP_CORE_SCHEMA__PERCEPTUAL_GATE_REWORK_REQUIRED`

No main. No deploy. No regenerar assets salvo el par del calamar si se decide corregir biblioteca.