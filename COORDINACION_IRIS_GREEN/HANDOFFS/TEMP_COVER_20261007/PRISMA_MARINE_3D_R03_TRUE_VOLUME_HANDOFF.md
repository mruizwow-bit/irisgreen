# PRISMA · VIDA MARINA 3D R03 · TRUE VOLUME · HANDOFF TEMPORAL

Fecha: 2026-10-07
Autoridad: María
Coordinación: Nexo
Estado temporal:
`PRISMA_TEMP_COVER_MARINE_3D_R03_ACTIVE`

## Alcance

Continuidad temporal de:
`MARINE_3D_R03_CORE_ANIMALS_TRUE_VOLUME`

No cambia el puesto permanente de Prisma.

## Base

Gate de entrada:
`MARIA_MARINE_3D_BILLBOARD_PROTOTYPE_LIMIT_REACHED__TRUE_VOLUME_REQUIRED_FOR_CORE_ANIMALS`

Base de producto:
Vida marina 3D R02 WORLD_FIRST.

## KEEP

No se reestructura:
- mundo 3D;
- cámara;
- haz;
- profundidad/talud;
- nieve marina/detrito;
- controles;
- múltiples candidatos;
- NORMAL/REDUCED/NONE;
- lógica válida heredada de R06.1a;
- calamar bloqueado;
- flujo LOCATE/REVEAL.

## Cambio R03

Los PNG dejan de ser el cuerpo del animal.

Se añade una fábrica procedural:
`app/animales3d.js`

Características:
- geometría generada dentro del runtime;
- 0 modelos 3D externos;
- 0 PlaneGeometry como cuerpo animal;
- cuerpos con grosor real;
- normales reales;
- aletas/cola y fotóforos con geometría;
- calamar con manto volumétrico, órganos internos representativos, cabeza, ojos y ocho brazos tubulares curvos;
- raycast recursivo sobre mallas reales;
- orientación corporal por trayectoria, no hacia cámara;
- escala siempre 1/1/1, sin compresión billboard;
- HemisphereLight + SpotLight ligados al mismo haz lógico;
- los seis PNG heredados quedan como referencia/auxiliar, no como geometría final.

## Estado por animal

### Pez hacha

ID:
`prof-pez-hacha`

Taxón heredado:
`Argyropelecus`

Nivel:
género, no especie.

Estado:
`PROVISIONAL_3D_REPRESENTATION`

Motivo:
no se ha cerrado especie exacta; no declarar anatomía específica de especie.

Rasgos representados de forma prudente:
- cuerpo alto/comprimido;
- quilla ventral;
- ojos superiores;
- fotóforos ventrales.

### Pez linterna

ID:
`prof-pez-linterna`

Taxón:
`Myctophum punctatum`

Estado de trabajo:
`TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE`

Rasgos:
- cuerpo alargado/fusiforme;
- ojo grande;
- hileras de fotóforos ventrales/flancos.

### Calamar cristal

ID:
`prof-calamar-cristal`

Taxón:
`Teuthowenia pellucida`

Estado de trabajo:
`TRUE_3D_FACTUAL_REPRESENTATION_CANDIDATE`

Rasgos:
- manto translúcido;
- paquete interno visible;
- cabeza/ojos;
- aletas del manto;
- ocho brazos.

El bloqueo de identificación heredado se conserva:
visible pero no examinable hasta cerrar el observable.

## QA específico R03

Oracle:
`pruebas/r03_volumen.js`

Resultado final:
`15 PASA · 0 FALLA · 3 PENDIENTE`

PASA:
- NO_PLANEGEOMETRY_ANIMALS;
- SIN_ERRORES;
- TRES_RAICES_GROUP;
- CERO_PLANOS;
- PROFUNDIDAD_REAL;
- NORMALES_REALES;
- PNG_NO_ES_CUERPO;
- HACHA_PROVISIONAL;
- LINTERNA_TAXON;
- CALAMAR_TAXON;
- LUZ_SOBRE_NORMALES;
- RAYCAST_VOLUMEN;
- SIN_COMPRESION_BILLBOARD;
- SETTING_NO_TELEPORT;
- CALAMAR_BLOQUEO_KEEP.

Pendiente:
- HUMAN_QA_MORFOLOGIA;
- AT_REAL;
- GPU_REAL.

## Evidencia visual local

Dentro del paquete:
- `pruebas/capturas/R03-volumen-1440.png`
- `pruebas/capturas/R03-volumen-390.png`
- `pruebas/capturas/r03-modelos/CONTACT_R03_MODELOS.jpg`
- nueve vistas: lateral / 3-4 / frontal × tres animales
- `pruebas/autor-r03-volumen.json`

Las vistas confirman frontal/lateral/3-4 distintos; ya no existe el efecto de lámina que gira.

## Paquete local

En Descargas:
`VIDA_MARINA_3D_R03_TRUE_VOLUME.zip`

SHA-256:
`7adb4ca755c929bc30f7ee524a09cb68d5c1ba179bbf13c206255701486e31bf`

82 archivos incluyendo:
`MANIFEST_R03_SHA256.txt`

## Reservas

- Las longitudes heredadas de R02 siguen marcadas como no validadas.
- No presentar esta microescena como escala zoológica certificada.
- Pez hacha sigue provisional hasta cerrar taxón a especie o aprobar explícitamente representación de género.
- Linterna y calamar siguen siendo candidatos hasta HUMAN QA morfológica.
- No confundir 15/15 técnicos con validación zoológica humana.

## Gate propuesto

`MARINE_3D_R03_CORE_ANIMALS_TRUE_VOLUME_READY_FOR_NEXO_HUMAN_QA`

NO MAIN · NO PUBLIC DEPLOY · NO SCALE 200+.

## Handoff de vuelta a Claude

Claude debe continuar desde este estado exacto:
- no reconstruir R02;
- no volver a billboards;
- no sustituir cuerpos procedurales por modelos externos sin nueva decisión;
- conservar el mundo;
- revisar HUMAN QA morfológica;
- resolver únicamente los findings que salgan;
- definir pipeline de escala solo después del PASS humano.
