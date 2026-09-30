# DECISIÓN · REGISTRO CANÓNICO DE PENDIENTES DE SUBIDA / INTEGRACIÓN · 30/09/2026

## Motivo

La coordinación acumula artefactos locales, handoffs aprobados y productos ya integrados que todavía no están visibles por bloqueos R67.

El término “subido” estaba mezclando cuatro estados distintos:
1. preservado;
2. integrado;
3. activado en preview;
4. publicado en producción.

Esto crea riesgo de:
- perder trabajo local;
- rehacer producto ya integrado;
- dejar handoffs aprobados sin consumir;
- abrir trabajo nuevo mientras se acumulan paquetes.

## Decisión

Se crea una única cola canónica:

- `CONTROL/PENDIENTES_SUBIDA_INTEGRACION.md`
- `CONTROL/PENDIENTES_SUBIDA_INTEGRACION.csv`
- `CONTROL/PENDIENTES_SUBIDA_INTEGRACION.json`

Regla:

`PRESERVE → INTEGRATE → ACTIVATE → NEW_WORK`

Antes de emitir una nueva orden de build, coordinación debe comprobar la cola.

## Hallazgo importante al abrir la cola

Sakura R63 YA está integrado en A2.

Los seis primeros visuales R54 del Taller también están preservados/integrados como arte dentro del Taller real R47.

Lo pendiente no es volver a “subir” esos dos productos, sino:
- reparar R67;
- conseguir build coherente;
- Deploy Preview;
- HUMAN QA;
- producción cuando corresponda.

## Prioridad inmediata de preservación

Riesgo alto por permanecer local:
- R62 P03 Rutas de luz;
- R61 Pecera 10 min;
- R68 Faroles.

Estos artefactos deben materializarse/versionarse antes de seguir acumulando rondas nuevas.

No cambia normativa transversal.
