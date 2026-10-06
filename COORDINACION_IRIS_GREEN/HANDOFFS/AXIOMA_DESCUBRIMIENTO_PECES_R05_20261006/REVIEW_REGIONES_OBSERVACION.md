# AXIOMA · DESCUBRIMIENTO PECES R05 · REVIEW REGIONES DE OBSERVACIÓN

Fecha: 2026-10-06

Estado:
`AXIOMA_MARINE_R05_KEEP_CORE__OBSERVATION_REGIONS_REWORK_REQUIRED`

## Evidencia revisada

Paquete público:
`descubrimiento-peces-R05(1).zip`
SHA-256:
`554b9fd5682cc7222df215efa58f544d13181c6ac62a449b51f7b12753097236`

Paquete interno:
`descubrimiento-peces-R05-interno(1).zip`
SHA-256:
`3cbe3db8c149ab24efc5d2388b2b14da20998791b5ea5ce310155a5e32de8818`

Lámina:
`regiones-de-observacion-R05(1).png`
SHA-256:
`9bcac020f77df9fa7d0d37e841708d8a74df5e1bfecd69e0ed1f5683e1ed4843`

Manifest público:
`34/34 PASS`.

## Correcciones previas que R05 sí cierra

- `modoEquipo:false` en producto.
- Sin Subir/Bajar tramo muertos.
- Toque sin drag apunta aunque dure >420 ms.
- `pointercancel` y `lostpointercapture` cancelan sin apuntar.
- NONE conserva precisión de puntero; la rejilla queda para teclado.
- Reflow 200% ahora comprueba recorte interno en 320/390/1440.
- Focus/candidatos múltiples y registro luz/oscuro mantienen las correcciones previas.

Estas partes quedan KEEP.

## Finding principal · la región debe corresponder exactamente al rasgo que dice probar

El nuevo criterio es:
- >=35% del cuerpo iluminado;
- >=50% de 240 muestras de `muestrasRasgo`.

El enfoque es mejor que un 35% global único.

Pero la semántica de las tres regiones todavía no está igualmente bien resuelta.

### Pez hacha

`rasgo`:
“Su cuerpo es alto y aplanado, y los ojos miran hacia arriba.”

`rasgoRegion.zona = cuerpo`

La caja de rasgo es EXACTAMENTE la misma que `cajaCuerpo`:
`[0.02552, 0.02632, 0.94737, 0.9059]`.

Por tanto la segunda condición no comprueba una región distintiva.
En la práctica convierte el requisito de cobertura general en aproximadamente 50% del cuerpo mediante otro muestreo.

Además no comprueba la segunda mitad del rasgo: `ojos miran hacia arriba`.

Decisión posible:
1. si el rasgo de interacción es la silueta, cambiar el rasgo interactivo a `cuerpo alto y aplanado` y dejar los ojos como dato posterior; o
2. añadir una segunda región/landmark dorsal para los ojos.

### Pez linterna

`rasgo`:
“Su cuerpo es alargado y lleva hileras de puntos luminosos en el vientre.”

`rasgoRegion = vientre`.

Es la mejor de las tres.

La franja sí fuerza a iluminar la zona ventral, pero sigue siendo un rectángulo amplio que incluye tejido/cola además de los fotóforos.

El motor verifica puntos opacos dentro de la caja, no que se hayan observado específicamente los puntos luminosos.

Mejora:
- máscara/polígono curado alrededor de las hileras de fotóforos;
- o landmarks concretos de fotóforos;
- mantener el 35% del cuerpo como contexto.

### Calamar de cristal

`rasgo`:
“Su cuerpo es translúcido y lleva los brazos agrupados al frente.”

`rasgoRegion = frente`.

La caja frontal sí representa brazos/cabeza.

Pero NO comprueba la translucidez del cuerpo, que es una propiedad del manto.

Opciones:
1. usar como rasgo interactivo únicamente `brazos agrupados al frente`; translucidez pasa a reveal; o
2. usar dos observables: `brazos/front` + `manto`.

Además el calamar es precisamente el peor par de registro:
- IoU global corregido ~0.964;
- residuo ~1.09%;
- el README atribuye el resto a las puntas de los brazos.

Eso coincide con la región elegida para observar.

Un IoU global alto puede ocultar un defecto local concentrado en el rasgo.

Nuevo oráculo necesario:
`FEATURE_REGION_LOCAL_REGISTRATION`.

Debe medir el registro luz/oscuro restringido a la región/landmarks de observación, no sólo a la silueta completa.

## Problema de modelo · un solo rectángulo no escala bien

Con 200+ animales, `rasgoRegion: {zona,caja}` se quedará corto.

Muchos rasgos son:
- dos zonas separadas;
- una hilera curva;
- ojos + cuerpo;
- manchas/puntos;
- apéndices finos;
- translucidez distribuida;
- relación entre partes;
- comportamiento, no anatomía.

Recomiendo evolucionar a:

`observables[]`

Cada observable:
- `id`;
- `label`;
- `type`: silhouette / landmark / polygon / photophore / texture / appendage / behavior;
- `geometry`: polygon / point-set / mask / whole-body;
- `requiredFraction`;
- `sourceTrait`;
- `representationStatus`;
- `factualStatus`;
- `localRegistrationQA`;
- `humanVisibilityQA`.

Así una especie puede requerir:
`BODY_SHAPE + EYE_LANDMARK`
o
`VENTRAL_PHOTOPHORES`
sin forzar todo a un rectángulo.

## Oracle perceptual que falta

La propia documentación R05 lo reconoce correctamente:
`el porcentaje no demuestra que el rasgo descrito se vea`.

Por tanto, antes de fijar una región:

`ILLUMINATE_AT_THRESHOLD → HUMAN_CAN_NAME_OR_DESCRIBE_TRAIT_WITHOUT_LABEL`

No hace falta pedir identificación taxonómica.

Ejemplo:
- iluminar justo al 50% permitido;
- ocultar nombre/copy;
- preguntar: `¿qué detalle destaca?`;
- comprobar que el rasgo pretendido es perceptible.

Marcador:
`FEATURE_PERCEPTIBILITY_AT_THRESHOLD_ORACLE`.

## Contrato recomendado

Separar tres cosas:

1. `BODY_CONTEXT_THRESHOLD`
   - cuánto animal debe verse para no examinar una esquina aislada.

2. `OBSERVABLE_FEATURE_THRESHOLD`
   - qué rasgo concreto debe quedar visible.

3. `REVEAL_FACT`
   - datos que se cuentan después y no necesitan formar parte del gate visual.

Esto evita intentar meter una frase completa con varias propiedades dentro de una única región.

## Regiones R05 · decisión

### Pez hacha
`REWORK`
Porque la región de rasgo = cuerpo completo y no prueba ojos.

### Pez linterna
`KEEP_DIRECTION__REFINE_GEOMETRY`
El vientre es correcto, pero conviene pasar de franja rectangular a puntos/máscara de fotóforos.

### Calamar de cristal
`KEEP_ARMS__SPLIT_TRANSLUCENCY`
La región frontal sirve para brazos, pero no para translucidez. Revisar además registro local de puntas.

## Otros dos detalles menores

### Reanuncio live
`avisar()` sigue descartando un mensaje idéntico al anterior.
Una acción repetida iniciada por usuario podría no producir una nueva mutación del live region.

Conviene reanunciar acciones importantes repetidas mediante token/clear-reinsert controlado.

### Versionado
R05 ya corrige `IG_DATOS.version` a R05.
Conviene mantener separados a futuro `productVersion`, `schemaVersion` y `saveVersion` si la estructura se estabiliza.

## Gate recomendado

No rehacer motor.

Patch de datos/oráculos:
1. redefinir rasgo interactivo del pez hacha;
2. refinar fotóforos del pez linterna;
3. separar brazos/translucidez del calamar;
4. añadir `FEATURE_REGION_LOCAL_REGISTRATION`;
5. añadir `FEATURE_PERCEPTIBILITY_AT_THRESHOLD_ORACLE`;
6. convertir el esquema de una sola región hacia `observables[]` antes de escalar a 200+.

Resultado:
`AXIOMA_MARINE_R05_KEEP_CORE__OBSERVATION_REGIONS_REWORK_REQUIRED`