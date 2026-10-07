# APRENDIZAJE PRISMA · 2026-10-07

Prisma · Frontend Platform & Design Systems Engineer.

Objetivo: consolidar aprendizaje operativo nuevo obtenido después de las revisiones del 06/10, sin sustituir handoffs, issues ni fuentes canónicas de producto.

---

# 1. Web R02 PATCH1/PATCH1.1 · fuente de verdad visual

## 1.1 Un patch documental también puede bloquear HUMAN QA

En PATCH1 el producto visual estaba prácticamente correcto, pero `MANIFEST.pendientes` conservaba un estado antiguo.

Lección:
**si un artefacto declara dos estados incompatibles, la fuente de verdad sigue rota aunque la interfaz esté bien.**

Gate:
`SOURCE_OF_TRUTH_INTERNAL_CONSISTENCY`.

No pasar a HUMAN QA si:
- manifest;
- README;
- estado funcional;
- provenance;
- datos de producto

se contradicen entre sí.

## 1.2 Derivar, no mantener a mano

PATCH1.1 mejora el modelo:
- `PROCEDENCIA.json` se deriva de `datos/imagenes.json`;
- `datos/sitio.json` deja de duplicar ownership de imágenes;
- el generador mide binarios reales;
- hash, tamaño y dimensiones se validan contra el archivo.

Lección:
**todo dato derivable debe generarse desde una única fuente propietaria, no copiarse manualmente a varios archivos.**

Patrón:
`ONE_OWNER → GENERATED_DERIVATIVES → ORACLE`.

## 1.3 Inventario activo ≠ historial

`construccion-vado-390.png` seguía empaquetado aunque ya no tenía colocación.

Nuevo criterio:
- ACTIVE_PACKAGED;
- HISTORICAL_NOT_PACKAGED;
- PROVISIONAL;
- PREVIEW;
- MOOD;
- PLACEHOLDER_DO_NOT_USE.

Un asset histórico puede conservar trazabilidad sin viajar en producción.

Gate:
`PACKAGED_ASSET_MUST_HAVE_ACTIVE_ROLE`.

## 1.4 Medir el binario real

Caso real:
un pictograma declarado como 512×512 medía 850×850.

Lección:
**dimensiones declaradas sin lectura del binario no son evidencia.**

El generador debe fallar si no coincide:
- hash;
- tamaño bytes;
- width/height;
- formato esperado.

---

# 2. Cielo 3D · de demo espacial a arquitectura de producto

## 2.1 3D sólo se justifica si resuelve una limitación real

El piloto R01 demostró una diferencia útil frente al 2D:
- un único cielo continuo;
- giro Orión → Tauro sin selector de campo;
- continuidad espacial;
- selección directa sin retícula perseguida.

Lección:
**3D no es valor por sí mismo. Debe aportar continuidad, orientación o manipulación que el 2D no pueda expresar igual de bien.**

Gate:
`3D_ADDS_PRODUCT_VALUE_NOT_DECORATION`.

## 2.2 No inventar horizonte sin contexto

Sin lugar, fecha y hora, no hay horizonte astronómico contextual válido.

Lección:
**es mejor omitir una referencia que fabricar una transformación aparentemente científica sin datos suficientes.**

## 2.3 Navegación continua necesita control de desorientación

Una esfera continua puede mejorar comprensión espacial, pero también desorientar.

Antes de escalar:
- probar con persona que no conozca Orión;
- observar si descubre drag;
- medir si conserva orientación tras giro;
- comprobar mareo;
- evaluar si necesita ayudas progresivas, no UI permanente.

## 2.4 Pistas y rutas deben ser datos

R02 mueve:
- `orden_saltos`;
- pistas;
- relaciones entre constelaciones

fuera del código de interfaz.

Lección:
**contenido escalable no debe requerir reescribir runtime.**

Patrón:
`ENGINE + DATA_GRAPH + CONTENT`.

## 2.5 Star-hopping debe optimizar seguimiento humano, no sólo distancia

La ruta no tiene que ser el camino angular más corto.

Puede ponderar:
- separación;
- claridad/brillo del ancla;
- continuidad perceptiva;
- conocimiento previo.

Principio:
**la ruta óptima de producto es la más seguible, no necesariamente la geométricamente mínima.**

## 2.6 Ambigüedad: no adivinar

Si dos patrones no tienen ventaja clara:
- no desempatar por proximidad de píxeles;
- no identificar por intuición del sistema;
- ofrecer opciones descritas por posición, sin revelar nombre.

Gate:
`AMBIGUITY_MUST_NOT_AUTOCONFIRM`.

## 2.7 Escalar 12 → 88 no es sólo añadir datos

Antes de 88:
- medir ambigüedad real;
- probar constelaciones grandes/deshilachadas;
- validar rendimiento completo;
- diseñar recorridos humanos por regiones/rutas;
- evitar una cadena de 88 pasos.

Lección:
**completitud de catálogo ≠ diseño de recorrido.**

---

# 3. Vida marina 3D · qué puede probar un billboard

## 3.1 Billboards sirven para validar arquitectura, no volumen

PNG sobre planos orientados a cámara permiten probar:
- espacio continuo;
- profundidad;
- paralaje;
- raycast;
- selección;
- iluminación;
- navegación;
- movimiento.

No demuestran:
- volumen anatómico;
- lectura lateral real;
- rotación corporal;
- oclusión volumétrica.

Estado correcto:
`ARCHITECTURE_VALIDATION`, no `3D_ASSET_VALIDATION`.

## 3.2 Selección directa debe respetar alfa

Raycast contra el plano no basta:
pulsar una esquina transparente no debe seleccionar el animal.

Patrón:
`PLANE_HIT → UV → ALPHA_TEST → SEMANTIC_HIT`.

## 3.3 Igualdad entre ratón y teclado es igualdad de decisión

Si ratón puede elegir entre dos animales iluminados, teclado debe poder cambiar candidato antes de confirmar.

Lección:
**accesibilidad equivalente significa conservar la intención, no sólo ofrecer una tecla Enter.**

## 3.4 Cambiar velocidad no debe teletransportar

Defecto encontrado:
al cambiar Movimiento se reescalaba la trayectoria y los animales saltaban.

Corrección conceptual:
- conservar pose/posición;
- cambiar ritmo del reloj;
- no recalcular el estado espacial desde cero.

Gate:
`SETTING_CHANGE_PRESERVES_WORLD_STATE`.

## 3.5 El haz debe responder a la geometría del nuevo sistema

Copiar 31°/13° del 2D hacía que casi todo quedara iluminado siempre.

Lección:
**parámetros equivalentes por nombre no son equivalentes entre modelos geométricos distintos.**

Hay que recalibrar según:
- FOV;
- distancia;
- tamaño aparente;
- discriminación necesaria.

## 3.6 Comparación A/B debe aislar qué pregunta responde

Láminas equiparadas 2D/3D pueden responder:
`¿se conserva legibilidad?`

No pueden responder:
`¿explorar en 3D aporta más?`

Para esto último hay que probar la escena viva.

---

# 4. El Vado · sistema técnico no equivale a juego

## 4.1 PASS técnico no prueba diversión ni profundidad

El Vado puede tener:
- locomoción;
- inventario;
- recoger;
- colocar;
- puente;
- escalera;
- guardado;
- soporte/alcance;

y seguir siendo demasiado básico.

Lección:
**un conjunto de sistemas funcionales no constituye por sí solo una experiencia jugable.**

Gate nuevo:
`GAMEPLAY_DEPTH_BEFORE_CONTENT_SCALE`.

## 4.2 No convertir el objetivo en una lista de instrucciones

Si la UI dice:
`recoge madera → construye puente → abre caja → coloca escalera → sube`

la experiencia se convierte en obedecer pasos.

Dirección correcta:
`PROBLEMA → EXPLORAR → DESCUBRIR RECURSOS → PROBAR → CONSECUENCIA`.

## 4.3 Vertical slice antes de mapa grande

Antes de escalar:
- al menos dos soluciones sustancialmente distintas;
- materiales con propiedades;
- decisiones reales;
- consecuencias visibles;
- construcción manipulable;
- mundo que responda;
- menos dependencia del HUD.

## 4.4 Animación pesada debe transmitir peso

Un clip llamado `Carry_Heavy_Object_Walk_inplace` puede ser técnicamente compatible y seguir sin servir perceptualmente.

Para objeto pesado deben leerse:
- preparación;
- agarre;
- flexión;
- cambio de centro de masa;
- esfuerzo;
- transferencia;
- locomoción condicionada por carga.

Lección:
**la semántica del nombre del clip no garantiza la semántica percibida.**

Gate:
`ANIMATION_PERCEPTUAL_SEMANTICS_MATCH_ACTION`.

---

# 5. Mar / Pecera · movimiento visual, confort y audio

## 5.1 Movimiento continuo puede ser técnicamente suave y perceptualmente mareante

La prueba de mar mostró:
- desplazamiento demasiado rápido;
- patrones horizontales continuos;
- sensación de cinta;
- necesidad de apartar la vista.

Lección:
**smooth animation ≠ comfortable animation.**

Gate:
`SUSTAINED_VIEWING_COMFORT_30S`.

La escena debe poder observarse al menos 30 s sin inducir:
- mareo;
- fatiga;
- urgencia de apartar la mirada.

## 5.2 Una ola no es una textura trasladada

Para leerse como ola debe existir ciclo perceptivo:
`formación → avance → cresta → rotura/espuma → disipación/retorno`.

Anti-patrón:
mover todas las bandas horizontales a velocidad similar.

Separar escalas:
- swell lento;
- superficie media;
- detalle/espuma local.

## 5.3 Horizonte como ancla perceptiva

En escenas con mucho movimiento:
**el horizonte puede funcionar como referencia estable contra mareo.**

Evitar:
- drift global;
- movimiento de cámara sin necesidad;
- desplazamiento uniforme de todo el campo.

## 5.4 Artefactos de composición rompen la ilusión

Rectángulos translúcidos, bordes de capas o recortes visibles deben tratarse como blocker perceptivo aunque el pipeline “funcione”.

Gate:
`NO_VISIBLE_LAYER_ARTIFACTS`.

## 5.5 Audio y visual deben compartir evento

No basta con tener sonido de mar.

Debe existir correspondencia aproximada:
- llegada;
- rotura;
- espuma;
- retirada.

Usar:
- ambiente continuo suave;
- eventos sin corte;
- crossfade;
- amplitud controlada;
- sincronía perceptual.

Gate:
`AUDIOVISUAL_EVENT_COHERENCE`.

## 5.6 NORMAL también debe ser tranquilo

No reservar confort sólo para REDUCED.

NORMAL:
- movimiento natural y tolerable.

REDUCED:
- menor amplitud/velocidad.

NONE:
- escena válida sin movimiento.

---

# 6. Regla transversal nueva · percepción antes de escala

En Cielo, Vida marina, El Vado y Mar se repite el mismo patrón:

1. el sistema puede estar correcto;
2. las pruebas pueden pasar;
3. el usuario puede seguir percibir:
   - mareo;
   - confusión;
   - artificialidad;
   - falta de juego;
   - semántica incorrecta.

Nueva regla Prisma:

**no escalar una solución hasta que la percepción humana confirme que la intención de producto está realmente presente.**

Cadena:
`TECHNICAL CORRECTNESS → PERCEPTUAL CORRECTNESS → HUMAN QA → SCALE`.

Nunca:
`TECHNICAL PASS → SCALE`.

---

# 7. Anti-patrones añadidos

30. Duplicar manualmente metadatos derivables.
31. Empaquetar assets sin uso activo sólo porque existían antes.
32. Declarar dimensiones sin inspeccionar el binario.
33. Usar 3D como argumento estético sin ventaja funcional.
34. Inventar orientación/horizonte sin datos suficientes.
35. Escalar un catálogo antes de diseñar el recorrido humano.
36. Confundir billboards con validación volumétrica.
37. Ofrecer teclado que confirma pero no permite la misma elección.
38. Recalcular posición al cambiar velocidad/configuración.
39. Reutilizar parámetros 2D en 3D sin recalibración geométrica.
40. Considerar una colección de sistemas funcionales como gameplay suficiente.
41. Revelar la solución completa en el HUD.
42. Dar por válida una animación porque el clip tiene el nombre correcto.
43. Confundir movimiento suave con movimiento confortable.
44. Simular una ola desplazando bandas/texturas como una cinta.
45. Tratar audio y visual como dos loops independientes.
46. Reservar confort sólo para reduced-motion.

---

# 8. Gates añadidos

- `SOURCE_OF_TRUTH_INTERNAL_CONSISTENCY`
- `PACKAGED_ASSET_MUST_HAVE_ACTIVE_ROLE`
- `3D_ADDS_PRODUCT_VALUE_NOT_DECORATION`
- `AMBIGUITY_MUST_NOT_AUTOCONFIRM`
- `SETTING_CHANGE_PRESERVES_WORLD_STATE`
- `GAMEPLAY_DEPTH_BEFORE_CONTENT_SCALE`
- `ANIMATION_PERCEPTUAL_SEMANTICS_MATCH_ACTION`
- `SUSTAINED_VIEWING_COMFORT_30S`
- `NO_VISIBLE_LAYER_ARTIFACTS`
- `AUDIOVISUAL_EVENT_COHERENCE`
- `TECHNICAL_CORRECTNESS_TO_PERCEPTUAL_CORRECTNESS_BEFORE_SCALE`

---

# 9. Estado de validación

Demostrado/observado:
- PATCH1.1 mejora ownership y derivación de datos;
- Cielo 3D aporta continuidad espacial real;
- R02 de Cielo desacopla rutas/pistas de interfaz;
- Vida marina 3D permite validar espacio/paralaje/selección con billboards;
- El Vado sigue necesitando profundidad de juego;
- animación de carga pesada no transmite correctamente la acción;
- la prueba de mar V3 produce movimiento excesivo, artefactos y falta de coherencia audiovisual.

Pendiente:
- HUMAN QA de Cielo R02;
- teléfono físico/AT;
- ambigüedad 88/88;
- constelaciones grandes;
- GPU real para Vida marina 3D;
- decisión 2D vs 3D en Vida marina mediante escena viva;
- vertical slice de El Vado con profundidad real;
- nueva ola/mar con confort sostenido y audio sincronizado.

---

# 10. Gate de formación

`PRISMA_A8_INCREMENTAL_TRAINING_20261007_UPDATED`

No MAIN · no producción · no sustituye gates de Nexo/Axioma/HUMAN QA.
