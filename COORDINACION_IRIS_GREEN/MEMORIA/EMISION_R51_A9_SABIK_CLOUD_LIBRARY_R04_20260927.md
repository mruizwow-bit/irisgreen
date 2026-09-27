# R51 · A9 · Biblioteca Cloud Sabik R04 · 27/09/2026

Issue: #314
Estado: `R51_A9_SABIK_CLOUD_LIBRARY_R04_ORDERED`

## Decisión

R03 queda como base técnica privada verificada e inmutable.

R51 construye R04 con dos objetivos:
1. cobertura editorial mucho más completa;
2. mantenimiento incremental permanente.

## Regla de mantenimiento

`WEB_SOURCE_CHANGE -> DELTA -> REBUILD_AFECTADO -> SAFETY/CITATIONS_QA -> NEW_IMMUTABLE_LIBRARY_VERSION`

Una vez creada R04, la biblioteca no se actualiza manualmente “cuando alguien se acuerde”.

El updater debe:
- observar el source web canónico aprobado;
- ignorar ramas experimentales;
- detectar cambios por fingerprint/source SHA;
- no crear versión si solo cambia CSS/JS de UI sin contenido;
- regenerar únicamente fichas/dependencias afectadas cuando el delta sea pequeño;
- recalcular índices/manifiestos;
- ejecutar QA global de safety/citas;
- producir nueva versión inmutable;
- conservar histórico y tombstones.

## Cobertura R04

Preparar/indexar conocimiento editorial de:
- 226 Condiciones;
- 223 Situaciones;
- 62 Vida diaria;
- 60 Datos;
- 132 Investigación;
- 262 Ayudas/Trámites ES;
- Recursos/Juegos/Rutinas como conocimiento de uso;
- Intereses R48 como explicación curada, nunca datasets completos;
- Taller R47 como conocimiento de herramientas, nunca proyectos de usuario;
- Rincón R46 como guía/controles/accesibilidad, nunca frames/shaders/estado;
- Home/R49/R50 solo orientación no duplicada.

## Child-safe

Fuente canónica #302:
965 registros · 16 S2.

R51 mantiene:
- safe variants revisadas;
- S2 filtrado antes de ranking;
- default/child/teen sin full incidental;
- adult full solo con intención explícita.

## Versionado

R03 no se sobrescribe.
R04 y posteriores son versiones nuevas.

Estados:
- CANDIDATE_BUILT
- CANDIDATE_VERIFIED
- ACTIVE_PRIVATE
- PUBLIC/PRODUCTION fuera de R51.

## Entrega

`R51_A9_SABIK_CLOUD_LIBRARY_R04_READY_FOR_ASTRA`

Después de aceptar R04, el flujo normal será:
`WEB_SOURCE_CHANGE -> A9_INCREMENTAL_LIBRARY_CANDIDATE`.

Orden completa:
`ORDENES/R51_A9_SABIK_CLOUD_LIBRARY_R04/01_AGENTE_9.md`.
