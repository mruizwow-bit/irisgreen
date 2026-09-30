# REGISTRO CANÓNICO · PENDIENTE DE SUBIR / INTEGRAR / ACTIVAR

Fecha de creación: 30/09/2026  
Propósito: impedir que entregas aprobadas o trabajo local se pierdan mientras R67/Web/Sabik están en reparación.

## 0. Regla de interpretación

A partir de ahora NO se usa “subido” como palabra ambigua.

Estados separados:

- `LOCAL_AT_RISK`  
  Existe en máquina/chat/patch local, pero todavía no está preservado de forma suficiente en GitHub.

- `PRESERVED_IN_GITHUB`  
  Fuentes/artefactos están guardados en GitHub o en un handoff versionado.

- `READY_FOR_INTEGRATION`  
  Producto aprobado para entrar en la rama A2/R67.

- `INTEGRATED_A2`  
  Ya está fusionado en la rama viva A2. Puede seguir sin verse por build/preview/global integration.

- `ACTIVATION_PREVIEW_PENDING`  
  Está integrado pero falta build limpio / Deploy Preview / HUMAN QA.

- `FIX_BEFORE_INTEGRATION`  
  Producto o evidencia necesita una corrección acotada antes de integrarse.

- `PRODUCTION_HOLD`  
  Nada de esta cola pasa a main/producción sin gate explícito.

## 1. Cola prioritaria

| ID | Producto | Issue | Estado de producto | Preservación | Integración | Siguiente acción |
|---|---|---:|---|---|---|---|
| R63 | Sala sensorial Sakura | #328 | Runtime/handoff PASS Astra | PRESERVED_IN_GITHUB | **INTEGRATED_A2** | Desbloquear R67, 0 external requests, hardware QA, Deploy Preview, HUMAN QA María |
| R54/R47 | Taller · 6 primeros visuales R54 dentro del Taller real R47 | #318 / #329 | KEEP 6/6 + Taller R47 funcional | PRESERVED_IN_GITHUB | **INTEGRATED_A2** | No restaurar fixture R64. Mantener arte R54 dentro de Taller real; desbloquear build R67 |
| R65 | Taller · 27 visuales + 9 variantes AGE_0_12 | #330 | Astra PASS · HUMAN QA pendiente | HANDOFF_IDENTIFIED | PENDING_R67_PHASE3 | HUMAN QA María → gate de integración R67 Fase 3 |
| R62-P03 | Rutas de luz | #326 | Gameplay/material PASS; layout causalidad R3 pendiente | **LOCAL_AT_RISK** | FIX_BEFORE_INTEGRATION | Corregir solo layout causalidad + entregar cadena/bundle completo para preservar |
| R61 | Pecera audiovisual 10 min | #325 | Máster KEEP; QA/transfer pendiente | **LOCAL_BINARY_AT_RISK** | NOT_READY | Transferir MP4/master/build; cerrar móvil/motion/benchmark/performance |
| R59 | Fósiles piloto | #323 | Producto PASS; contrato repro aceptado; QA nominal/GOV pendientes | PACKAGE_IN_CHAT / NOT_FINAL | FIX_BEFORE_INTEGRATION | Corregir 4 capturas nominales + GOV-01; después preservar paquete final |
| R68 | Faroles flotantes | #335 | Dirección KEEP; rework espacial pendiente | **LOCAL_AT_RISK** | NOT_READY | Preservar fuente local cuando haya R2; no integración aún |
| R42-CONTENT | Contenido R02 | #302 | Dirección válida; base A2 obsoleta | PACKAGE_PRESERVED / STALE_BASE | REBASE_REQUIRED | Rebase sobre HEAD A2 vivo; no aplicar ZIP actual |

## 2. Detalle · ya integrados pero no activados como producto final

### R63 · Sakura

Estado verificado en GitHub:

`R63_ASTRA_SAKURA_RUNTIME_HANDOFF_PASS_READY_FOR_A2`

Astra integró el handoff:
- PR #338;
- merge de producto/runtime: `7ac554b85edc256bd85c36271e5e5f6a86ef115a`;
- ajustes posteriores #339 y #340;
- gate R63/Rincón PASS en A2.

Estado operativo:
`INTEGRATED_A2_ACTIVATION_PREVIEW_PENDING`.

Pendiente:
- blocker global R67;
- Google Fonts / 0 external requests;
- `PENDING_HARDWARE_QA`;
- Deploy Preview;
- HUMAN QA María.

**No reconstruir Sakura. No volver a pedir sus fuentes. No revertirla para arreglar R67.**

### R54/R47 · Taller · seis primeros visuales

#329 confirma que la maqueta R64 de HUMAN QA fue retirada.

Checkpoint correcto:
- Taller R47 real;
- 27 estudios;
- ES/EN;
- navegación y motores reales;
- arte R54 de las seis tarjetas integrado como arte;
- sin copy interno R64/HUMAN QA;
- QA específico SUCCESS en `a24cc2e227c7275d17212d9cd72b6e7d1bea7930`.

Estado:
`TALLER_R47_KEEP6_INTEGRATED_A2_GLOBAL_R67_BLOCKED`.

**No volver a subir el fixture R64.**
La fuente válida es Taller R47 + arte R54.

## 3. Detalle · listo para la siguiente integración cuando pase gate

### R65 · Taller 27 + 9

Estado:
`R65_TALLER_21_PLUS_9_ASTRA_PASS_HUMAN_QA_PENDING`.

KEEP:
- 27/27 escenas;
- KEEP 6/6;
- 21 nuevas;
- 9 variantes AGE_0_12;
- assets AVIF/WebP;
- launcher y QA responsive.

Siguiente:
María HUMAN QA.

Si aprueba:
`R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION`

Destino:
R67 Fase 3.

No crear otra maqueta de QA.

## 4. Detalle · material local que corre riesgo de perderse

### R62 P03 · Rutas de luz

Patch conocido:
`r62-p03-rework-qa-2.patch`

SHA-256:
`c19c828099482a7ad2cecb9d90f7f8f01855304ee22ee51bea04f4f62761133b`

Commit local declarado:
`5648a8d5d36056c950d592bf66dd3d0e162b10c6`.

Claude declara 51 commits locales.

Estado producto:
`R62_P03_QA_REWORK_2_GAMEPLAY_PASS_CAUSALITY_LAYOUT_FIX_REQUIRED`.

Riesgo:
el patch actual NO contiene necesariamente toda la cadena fuente anterior.

Acción de preservación:
- obtener bundle completo o patch acumulado desde una base GitHub conocida;
- guardar en handoff versionado;
- después integrar cuando pase causalidad R3.

### R61 · Pecera

Estado:
`R61_PECERA_10MIN_MASTER_KEEP_FINAL_QA_TRANSFER_PENDING`.

Artefactos declarados:
- `pecera_10min.mp4` · 151,2 MB;
- `pecera_bu.mp4` · 321,4 MB;
- audio M4A/Opus;
- poster;
- HTML;
- build.

Riesgo:
los binarios finales siguen en el entorno local/puente de Claude.

Prioridad:
**TRANSFERIR/PRESERVAR antes de cualquier nueva iteración.**

No rerender visual.

### R68 · Faroles

Claude declara 46 commits locales.

Estado:
`R68_FAROLES_DIRECTION_KEEP_SPATIAL_LIGHTING_REWORK_REQUIRED`.

No está listo para integración, pero sí debe evitarse perder su fuente local.

Preservar cuando entregue R2 o si el entorno local corre riesgo.

## 5. Cola de “NO APLICAR TAL CUAL”

### R42 Contenido R02

ZIP:
`iris-green-contenido-R42-20260929.zip`

SHA-256:
`aa3649a821da1226dd84bda70f35ee8c8e286cb81c1bd5711af97e71761e8961`.

No aplicar directamente.

Motivo:
base A2 obsoleta y solapamiento `scripts/build_site.py`.

Conservar como fuente editorial/rebase.

### R59 Fósiles R2v3

Producto visual KEEP.

No integrar todavía:
- QA nominal incorrecta;
- GOV-01 abierto.

Conservar paquete, corregir solo gate restante.

## 6. Regla de operación mientras Astra repara R67

Antes de comenzar trabajo nuevo, comprobar esta cola.

Prioridad:

1. **PRESERVAR LOCAL_AT_RISK**
2. **NO PERDER INTEGRATED_A2**
3. **INTEGRAR READY_FOR_INTEGRATION**
4. **ACTIVAR/PREVIEW**
5. solo después abrir más trabajo

Regla:

`PRESERVE → INTEGRATE → ACTIVATE → NEW_WORK`

No aceptar:
`NEW_WORK → NEW_WORK → NEW_WORK`
mientras existan handoffs aprobados únicamente en local.

## 7. A2 vivo

Rama:
`agent2/sabik-iris-r08-20260924`

HEAD observado al actualizar este registro:
`8ea50128b490207b4dd5508c3c46692f5be69c87`.

El HEAD puede cambiar mientras Astra trabaja.

**Siempre releer HEAD antes de integrar.**

## 8. Main / producción

Todo este registro mantiene:

`NO_MAIN_NO_PRODUCTION_UNTIL_R67_INTEGRATED_PREVIEW_AND_HUMAN_QA`.
