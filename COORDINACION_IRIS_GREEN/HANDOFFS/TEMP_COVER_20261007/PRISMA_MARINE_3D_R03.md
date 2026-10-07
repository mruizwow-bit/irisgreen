# RELEVO TEMPORAL · PRISMA → VIDA MARINA 3D R03

Fecha: 2026-10-07
Autoridad: María
Coordinación: Nexo
Motivo: Claude no disponible temporalmente.

## Alcance

Prisma asume temporalmente continuidad de:
`MARINE_3D_R03_CORE_ANIMALS_TRUE_VOLUME`

No cambia su rol permanente.

## Base

Gate:
`MARIA_MARINE_3D_BILLBOARD_PROTOTYPE_LIMIT_REACHED__TRUE_VOLUME_REQUIRED_FOR_CORE_ANIMALS`

## Objetivo inmediato

Construir sólo:
1. pez hacha;
2. pez linterna;
3. calamar cristal;

con volumen 3D real.

## KEEP

No tocar:
- mundo 3D;
- cámara;
- luz/haz;
- profundidad/talud;
- partículas;
- raycast/selección;
- múltiples candidatos;
- NORMAL/REDUCED/NONE;
- lógica R06.1a/R02 válida.

## Rework

Eliminar billboards como cuerpo final.

Cada animal:
- volumen real;
- frontal/lateral/3-4;
- iluminación real;
- raycast sobre volumen;
- movimiento que preserve volumen;
- anatomía respaldada.

Estados:
- TRUE_3D_FACTUAL_REPRESENTATION
- PROVISIONAL_3D_REPRESENTATION
- HOLD_NO_SAFE_3D_MODEL

No inventar anatomía.

## Handoff de vuelta

Cuando Claude vuelva:
- modelos exactos;
- fuentes;
- estado por animal;
- métricas;
- vídeo;
- pendientes.

Estado:
`PRISMA_TEMP_COVER_MARINE_3D_R03_ACTIVE`
