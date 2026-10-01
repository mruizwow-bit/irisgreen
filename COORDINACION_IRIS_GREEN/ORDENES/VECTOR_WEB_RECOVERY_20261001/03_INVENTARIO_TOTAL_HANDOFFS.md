# VECTOR · P0 · INVENTARIO TOTAL DE HANDOFFS Y PAQUETES · 01/10/2026

Issue: #356
Autoridad: María
Coordinación: Aura
Estado: VECTOR_P0_FULL_PENDING_INTAKE_REQUIRED

## Alcance

Vector debe reconciliar TODO paquete/handoff pendiente de:

- Taller;
- Juegos;
- Intereses;
- Rincón;
- Recursos;
- Rutinas;
- Contenido;
- Videoteca;
- Sabik;
- cualquier otro carril registrado en Control.

## Fuentes obligatorias

- CONTROL/PENDIENTES_SUBIDA_INTEGRACION.md
- CONTROL/PENDIENTES_SUBIDA_INTEGRACION.csv
- CONTROL/PENDIENTES_SUBIDA_INTEGRACION.json
- CONTROL/ESTADO_TRABAJOS.csv
- issues/PRs vivos
- ramas/handoffs/artefactos
- últimas decisiones de María/Astra/Aura/Nexo

## Regla de precedencia

ÚLTIMA_DECISIÓN_CANÓNICA
→ estado de producto
→ preservación
→ integración.

No integrar un paquete histórico si una decisión posterior lo supersede.

## Clasificación única por item

- INTEGRATE_NOW
- IMPORT_PRESERVE_NOW
- ALREADY_INTEGRATED_VERIFY
- WAIT_FOR_GATE
- REBASE_REQUIRED
- SUPERSEDED_DO_NOT_INTEGRATE
- MISSING_ARTIFACT_STOP

Nada queda sin decidir.

## Taller

Reconciliar:
- R54/R47 KEEP6;
- R65 27+9;
- R44-A0;
- R42/R43/R47 históricos.

R65:
INTEGRATE_NOW.

R54/R47:
ALREADY_INTEGRATED_VERIFY.

R44:
WAIT_FOR_GATE hasta review/HUMAN QA.

No fixture R64.
No restaurar generaciones viejas.

## Juegos

Reconciliar:
- R56;
- R57;
- R62 P01/P02/P03/P04…;
- paquetes R40/R41/R42 históricos.

R62-P03:
IMPORT_PRESERVE_NOW; no reabrir.

R62-P04:
WAIT_FOR_GATE.

La clasificación 297 de R56/R57 prevalece sobre paquetes históricos de “297 juegos”.
No reinyectar masivamente contenido reclasificado/superseded.

## Intereses

Reconciliar:
- catálogo 72;
- R48;
- R58;
- R59;
- seis pilotos: Mar, Aves, Fósiles, Minerales, Trenes/Metro, Espacio.

Para cada piloto:
- localizar artefacto/handoff;
- última decisión;
- gate;
- ruta ES/EN;
- metadata/canonical/hreflang;
- assets repo;
- índice/sitemap cuando corresponda.

Fósiles:
WAIT_FOR_GATE hasta QA nominal/GOV/paquete final.

R48 donor histórico no entra si fue superseded por R58/R59.

## Rincón

Reconciliar:
- R40;
- R42;
- R46;
- R53;
- R61 Pecera;
- R63 Sakura;
- R68 Faroles.

Sakura:
ALREADY_INTEGRATED_VERIFY.

Pecera:
WAIT_FOR_GATE.

Faroles:
WAIT_FOR_GATE.

No reintroducir generaciones antiguas superseded.

## Recursos / Rutinas

Reconciliar paquetes históricos con R56/R57.

Separar:
- GAME;
- ROUTINE_PRACTICE;
- TOOL;
- INTEREST_MINIGAME.

Integrar solo la generación vigente.

## Contenido

R42-CONTENT:
REBASE_REQUIRED.

No aplicar ZIP stale.

Mantener child-safe hard gate y trazabilidad.

## Videoteca

Determinar:
- último paquete;
- integración real;
- miniaturas;
- ES/EN;
- playback;
- handoffs pendientes.

## Sabik

Mantener funcionalidad actual en recovery.

#354:
seguir owners:
Croma → Prisma/Motor → Axioma → Astra → Vector.

Cloud/voz/transport históricos:
reconciliar con R66/#354/Nexo antes de activar.

## Inventario obligatorio de cierre

Tabla:
ÁREA · ID · PAQUETE/HANDOFF · ÚLTIMA_DECISIÓN · HASH/HEAD · PRESERVACIÓN · INTEGRACIÓN · ACCIÓN_VECTOR · DESTINO · EVIDENCIA

Gate:

VECTOR_IRIS_GREEN_FULL_RECOVERY_ALL_PENDING_INTAKE_PREVIEW_READY_FOR_ASTRA_AURA_MARIA

La preview solo puede salir cuando:
- todos INTEGRATE_NOW estén dentro;
- todos IMPORT_PRESERVE_NOW estén preservados;
- todos ALREADY_INTEGRATED_VERIFY sobrevivan;
- ningún WAIT_FOR_GATE se active;
- ningún SUPERSEDED reaparezca;
- ningún item quede sin clasificación.

No main.
No producción.
No carga ciega.
