# PRISMA · MARINE 3D R03.1 · QA CONTRACT

Fecha: 2026-10-07
Estado:
`PRISMA_TEMP_COVER_MARINE_3D_R03_ACTIVE`

Este contrato NO aprueba el producto. Define qué debe pasar R03.1 cuando el runtime local vuelva a estar disponible.

## 1. Objetivo

Validar que el salto desde R03 a R03.1 no se limita a "tener grosor", sino que entrega:

- cuerpos 3D con sección transversal variable;
- orientación corporal independiente de cámara;
- iluminación parcial coherente con el haz;
- raycast sobre geometría real;
- independencia del PNG para construir el cuerpo;
- fuente de verdad sincronizada con el runtime.

## 2. Gates técnicos obligatorios

### VOLUME_GEOMETRY

`NON_UNIFORM_BODY_CROSS_SECTION_ORACLE`

PASA si:
- pez hacha y pez linterna presentan al menos tres secciones longitudinales con radios Y/Z distintos;
- el máximo grosor no es constante a lo largo del eje X;
- el pedúnculo caudal es menor que la sección media;
- frontal y lateral no pueden obtenerse mediante simple extrusión de una misma silueta con profundidad constante.

`FRONTAL_LATERAL_VOLUME_DIFFERENCE_ORACLE`

PASA si:
- área aparente frontal < área lateral para ambos peces;
- profundidad frontal > 0;
- la relación frontal/lateral no es la de una placa de grosor constante;
- 3/4 presenta simultáneamente longitud, altura y profundidad.

### ORIENTATION

`ANIMAL_ROOT_DOES_NOT_FACE_CAMERA_ORACLE`

PASA si:
- cambiar la cámara sin avanzar el reloj NO rota automáticamente la raíz del animal para mirar al observador;
- la orientación depende de trayectoria/estado del animal;
- no aparece lógica `lookAt(camera)` ni yaw derivado de cámara en la raíz.

### LIGHT

`PARTIAL_LIGHT_REVEAL_MATCHES_GEOMETRY_ORACLE`

Caso construido:
- haz intersecta solo extremo anterior/posterior de un animal;
- centro del animal fuera del núcleo;
- parte del cuerpo dentro del haz.

PASA si:
- la zona iluminada cambia visualmente solo donde el haz intersecta superficie;
- una muestra de fragmentos fuera del haz mantiene luminancia de estado oscuro;
- una muestra dentro del haz aumenta luminancia;
- el cuerpo completo NO cambia en bloque por entrar su centro;
- el estado lógico de contexto/observable no contradice la lectura visual.

### PNG DECOUPLING

`PNG_NOT_REQUIRED_TO_BUILD_3D_BODY_ORACLE`

PASA si:
- bloquear las seis rutas PNG no impide que aparezcan los tres cuerpos 3D;
- raycast sigue funcionando;
- iluminación sigue funcionando;
- movimiento sigue funcionando;
- ficha/ayuda puede degradar de forma explícita si necesita imagen auxiliar.

### SOURCE OF TRUTH

`R03_SOURCE_OF_TRUTH_NO_BILLBOARD_CLAIMS`

PASA si no quedan afirmaciones activas de:
- "PNG sobre planos";
- "billboard";
- "no modelos 3D";
- "escorzo mínimo por falta de frontal";

en:
- README;
- datos3d activo;
- interfaz pública;
- handoff R03.1;
- comentarios de código que describan el estado actual.

Se permite historia R02 solo si está marcada como:
`HISTORICAL_R02`
o equivalente.

`REPRESENTATION_STATUS_MATCHES_TAXON_SCOPE`

PASA si:
- Argyropelecus => `PROVISIONAL_3D_REPRESENTATION`;
- Myctophum punctatum => candidato factual, no PASS zoológico automático;
- Teuthowenia pellucida => candidato factual y bloqueo observable preservado;
- ninguna afirmación excede alcance taxonómico documentado.

## 3. HUMAN QA MORFOLÓGICA

Para cada animal entregar:
- lateral;
- frontal;
- 3/4 anterior;
- 3/4 posterior opcional si descubre un defecto.

Preguntas binarias:

1. ¿Sigue pareciendo una lámina gruesa?
2. ¿La vista frontal parece pertenecer al mismo animal que la lateral?
3. ¿La cabeza se integra en el cuerpo sin parecer una esfera añadida?
4. ¿El pedúnculo/cola nace del cuerpo de forma coherente?
5. ¿Las aletas parecen insertadas, no pegadas como triángulos flotantes?
6. ¿Al girar aparece nueva anatomía en vez de solo menos ancho?
7. ¿La silueta sigue siendo reconocible sin depender de fotóforos?

Para calamar añadir:
8. ¿Los ocho brazos se leen como un conjunto anterior, no como radios geométricos?
9. ¿El manto se lee translúcido sin parecer vidrio/plástico?
10. ¿Los órganos visibles parecen representación prudente, no anatomía inventada detallada?

## 4. EVIDENCIA DE LUZ

Entregar por animal un tríptico:
- fuera del haz;
- haz parcial;
- haz centrado.

La comparación debe hacerse con:
- misma cámara;
- misma pose;
- mismo tiempo;
- solo cambia dirección del haz.

Criterio:
`DARK → PARTIAL → REVEALED`
sin salto global de luminancia del animal entero.

## 5. Compatibilidad R02 que no debe romperse

Reejecutar:
- SIN_ERRORES;
- MUNDO-CAPAS;
- OCLUSION-REAL;
- HAZ-DISCRIMINA;
- HAZ-DEJA-SOMBRA;
- MOV-CONSERVA-SELECCION;
- NINGUNO-CONGELA;
- NINGUNO-NO-BLOQUEA;
- HZ-CONTINUIDAD;
- selección múltiple estable;
- confirmación/caducidad;
- panel cerrado de salida;
- recorrido sin panel;
- foco;
- ES/EN;
- sin almacenamiento.

Los asserts específicos de billboards de R02 quedan:
`HISTORICAL_NOT_APPLICABLE_R03_1`.

## 6. Rendimiento

Medir:
- 1440×900;
- 390×844;
- NORMAL;
- REDUCED;
- NONE.

Declarar:
- GPU/backend;
- DPR;
- resolución interna;
- fps p50/p95;
- draw calls;
- triángulos;
- memoria si disponible.

No comparar SwiftShader con Canvas2D como juicio de producto.

## 7. Salida esperada

Solo si todo lo técnico pasa y HUMAN QA morfológica no detecta efecto cartón:

`MARINE_3D_R03_1_CORE_ANIMALS_READY_FOR_NEXO_HUMAN_QA`

Todavía NO significa:
- escala 200+;
- MAIN;
- deploy;
- taxonomía final;
- AT PASS.

## 8. Estado actual

El dispositivo de trabajo `IrisGreen` está OFFLINE.
Por tanto este archivo es contrato de ejecución, no evidencia de ejecución.

Último ZIP verificable:
`VIDA_MARINA_3D_R03_TRUE_VOLUME.zip`

SHA-256:
`7adb4ca755c929bc30f7ee524a09cb68d5c1ba179bbf13c206255701486e31bf`
