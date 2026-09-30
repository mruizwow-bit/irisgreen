# CLAUDE · COLA VIGENTE CORREGIDA · 30/09/2026

Esta corrección supersede cualquier selector/picker local que siga mostrando estados antiguos.

## R65 Taller

HUMAN QA María APROBADA el 30/09/2026.

Estado vigente:
`R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION`

R65 queda cerrado. Claude no tiene más trabajo de arte ni QA aquí.
Siguiente: R67 Fase 3 integra el handoff aprobado.
No crear otra maqueta/helper ni rerender.

## R61 Pecera

NO volver a “render 10 min”.

El render ya existe.

Estado vigente:
`R61_PECERA_10MIN_MASTER_KEEP_FINAL_QA_TRANSFER_PENDING`

Siguiente trabajo:
- preservar/transferir binarios;
- verificar hashes;
- móvil 390/320;
- NORMAL/REDUCIDO/SIN_MOVIMIENTO;
- controles;
- performance o PENDING_HARDWARE_QA;
- benchmark;
- peso/streaming.

No rerender visual.

## R62 P03 Rutas de luz

NO volver a R2 general.

Gameplay/material/tablero ya pasan.

Estado vigente:
`R62_P03_QA_REWORK_2_GAMEPLAY_PASS_CAUSALITY_LAYOUT_FIX_REQUIRED`

Siguiente:
solo corregir layout de causalidad pasos 3/4 + tests.
Marcador:
`R62_P03_CAUSALITY_LAYOUT_R3_READY_FOR_ASTRA_AURA_MARIA`.

## R68 Faroles

NO está simplemente “parallel build authorized pending Sakura”.

Sakura ya está integrada en A2.

Estado vigente Faroles:
`R68_FAROLES_DIRECTION_KEEP_SPATIAL_LIGHTING_REWORK_REQUIRED`

Siguiente:
R2 de dirección espacial según orden 02 de R68.

## PRIORIDAD CLAUDE AHORA

Regla canónica:
`PRESERVE → INTEGRATE → ACTIVATE → NEW_WORK`.

Orden operativo:

1. **R61 Pecera · preservar/transferir paquete final ya renderizado**
   - es el mayor riesgo porque contiene binarios grandes locales;
   - NO gastar otra hora de render.

2. **R62 P03 · cerrar el fix mínimo de causalidad + preservar cadena/bundle**
   - cambio pequeño;
   - evita dejar 51 commits solo en local.

3. **R68 Faroles · continuar R2**
   - después de preservar los dos anteriores.

R65:
espera HUMAN QA María del lote final; Claude no tiene trabajo de arte pendiente.

No usar picker antiguo.
Antes de elegir trabajo, leer:
`CONTROL/PENDIENTES_SUBIDA_INTEGRACION.md`
y
`ORDENES/EQUIPO_VIGENTE.md`.
