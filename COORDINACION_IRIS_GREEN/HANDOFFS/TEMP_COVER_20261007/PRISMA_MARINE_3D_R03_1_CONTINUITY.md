# PRISMA · MARINE 3D R03.1 · ESTADO DE CONTINUIDAD

Fecha: 2026-10-07
Estado:
`PRISMA_TEMP_COVER_MARINE_3D_R03_ACTIVE`

Base cerrada verificable:
`VIDA_MARINA_3D_R03_TRUE_VOLUME.zip`
SHA-256:
`7adb4ca755c929bc30f7ee524a09cb68d5c1ba179bbf13c206255701486e31bf`

Gate técnico base:
`MARINE_3D_R03_TRUE_VOLUME_ARCHITECTURE_PASS`

## R03.1 · delta ya definido / aplicado localmente antes de desconexión

### 1. Peces · secciones variables
Objetivo:
eliminar la lectura de "perfil extruido con grosor".

Peque hacha:
- sustituir cuerpo extruido por anillos/secciones transversales variables;
- gran altura corporal;
- compresión lateral fuerte;
- quilla ventral;
- transición real a pedúnculo caudal;
- mantener:
  `PROVISIONAL_3D_REPRESENTATION`
  porque Argyropelecus sigue a nivel de género.

Pez linterna:
- sustituir perfil extruido por cuerpo fusiforme por secciones;
- máximo grosor anterior/medio;
- estrechamiento progresivo hacia cola;
- pedúnculo caudal claramente menor.

Implementación local iniciada:
`cuerpoSecciones(...)`
en `app/animales3d.js`.

### 2. Luz · revelado por fragmento

Defecto detectado:
R03 ajustaba emisión usando `valorMascara(m.position)`, es decir, por centro del animal.
Eso podía producir:
`HAZ TOCA CENTRO → ANIMAL ENTERO SE ACLARA`.

Contrato correcto:
`MOVER LUZ → REVELADO PARCIAL SOBRE SUPERFICIE → OSCURIDAD`.

R03.1:
- MeshStandardMaterial conserva normales reales;
- shader se amplía con posición mundial del fragmento;
- cada fragmento calcula la misma máscara del haz:
  - posición de luz;
  - dirección;
  - semiExterior;
  - semiInterior;
  - alcance;
  - núcleo;
- la emisión adicional se aplica localmente al fragmento.

Gate nuevo:
`VISUAL_LIGHTING_MUST_MATCH_OBSERVATION_MASK`.

### 3. PNG · desacoplo de runtime

R03 cargaba aún:
- oscuro;
- luz;
- alfa CPU;

aunque ya no se usaban como cuerpo.

R03.1:
- los PNG permanecen en el paquete como:
  - referencia;
  - procedencia;
  - apoyo 2D/ficha;
- el cuerpo volumétrico NO depende de ellos para:
  - arrancar;
  - construirse;
  - seleccionar;
  - iluminarse.

Objetivo:
`PNG_NOT_REQUIRED_TO_BUILD_3D_BODY`.

### 4. Fuente de verdad · sync obligatorio

R03 cerrado conserva residuos R02:
- README declara billboards;
- KEEP_CHANGE declara billboards;
- LEEME_INTERNO describe límites de billboard;
- `datos3d.js` conserva objeto `billboards`;
- `release3D.version` sigue R02;
- cabecera de `escena3d.js` describe PNG sobre planos.

R03.1 debe:
- eliminar `billboards` como estado activo;
- añadir `volumen3D`;
- versionar como `vida-marina-3D-R03.1`;
- `release3D.version = R03.1`;
- declarar:
  `WORLD_FIRST · SCENE_AS_PRIMARY_INTERFACE · TRUE_VOLUME_CORE_ANIMALS`;
- actualizar README/KEEP_CHANGE/LEEME_INTERNO;
- conservar historia R02 únicamente como historia, no fuente de verdad activa.

Gate:
`R03_SOURCE_OF_TRUTH_SYNC_REQUIRED`.

## QA que debe ejecutarse al reconectar

Mantener oracle R03:
- NO_PLANEGEOMETRY_ANIMALS;
- TRES_RAICES_GROUP;
- CERO_PLANOS;
- PROFUNDIDAD_REAL;
- NORMALES_REALES;
- PNG_NO_ES_CUERPO;
- RAYCAST_VOLUMEN;
- SIN_COMPRESION_BILLBOARD;
- SETTING_NO_TELEPORT;
- CALAMAR_BLOQUEO_KEEP.

Añadir R03.1:
- `NON_UNIFORM_BODY_CROSS_SECTION_ORACLE`;
- `FRONTAL_LATERAL_VOLUME_DIFFERENCE_ORACLE`;
- `PARTIAL_LIGHT_REVEAL_MATCHES_GEOMETRY_ORACLE`;
- `ANIMAL_ROOT_DOES_NOT_FACE_CAMERA_ORACLE`;
- `PNG_NOT_REQUIRED_TO_BUILD_3D_BODY_ORACLE`;
- `R03_SOURCE_OF_TRUTH_NO_BILLBOARD_CLAIMS`;
- `REPRESENTATION_STATUS_MATCHES_TAXON_SCOPE`.

## Evidencia visual requerida

Recrear:
- 1440;
- 390;
- 9 vistas:
  - lateral;
  - 3/4;
  - frontal;
  por cada uno de los tres animales.

Además:
- una secuencia/captura que muestre haz tocando solo una parte del cuerpo,
  demostrando que NO se ilumina el animal entero.

## Estado de red/dispositivo

En el momento de cerrar este registro:
Desktop Commander device:
`IrisGreen`
estado:
`OFFLINE`

Por tanto:
- NO se declara R03.1 empaquetado;
- NO existe SHA R03.1 válido todavía;
- NO se emite READY_FOR_HUMAN_QA;
- el último paquete verificable sigue siendo R03.

## Siguiente acción al reconectar

1. verificar cambios locales existentes;
2. no reconstruir desde cero;
3. terminar source sync;
4. syntax/smoke;
5. oracle R03.1;
6. vistas 1440/390 + 9 vistas;
7. package;
8. SHA;
9. comentario #323;
10. handoff actualizado a Claude.

NO MAIN · NO PUBLIC DEPLOY · NO SCALE 200+.
