# R59 · EXOPLANETAS · PRODUCCIÓN CONTINUA B06–B10 · CIERRE 001–100

Fecha: 03/10/2026  
Owner: Senda · R59

Marcador final:

`EXOPLANETS_001_100_ASSIGN_BY_PHYSICS_COMPLETE`

## Política

`ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY`

Pipeline aplicado por tanda:

`10 objetos → clasificación física → reuse/new master → JSON → contact sheet → QA`

Reglas:
- no inventar superficies para cerrar una tanda;
- `UNKNOWN_APPEARANCE_REPRESENTATION` cuando la apariencia no está constreñida;
- `HOLD_NO_SAFE_VISUAL_ASSIGNMENT` cuando corresponde;
- datos científicos fuera del generador visual;
- PSCompPars tratado como composite cuando corresponde;
- masters = `REPRESENTATION`, no observación.

## Estado

- B01–B05: cerradas previamente; no reabiertas.
- B06: `EXOPLANETS_BATCH_06_ASSIGN_BY_PHYSICS_PASS`
- B07: `EXOPLANETS_BATCH_07_ASSIGN_BY_PHYSICS_PASS`
- B08: `EXOPLANETS_BATCH_08_ASSIGN_BY_PHYSICS_PASS`
- B09: `EXOPLANETS_BATCH_09_ASSIGN_BY_PHYSICS_PASS`
- B10: `EXOPLANETS_BATCH_10_ASSIGN_BY_PHYSICS_PASS`

B06–B10:
- technical QA = PASS;
- data QA = PASS;
- epistemic guards = PASS.

## Casos conservadores

- BD+20 594 b → Neptune-like.
- BD-11 4672 c → Neptune-like.
- BEBOP-4 AB b → catálogo Gas Giant, pero se conserva cautela de frontera por masa muy alta.
- Barnard b/c/d/e → familia terrestre/rocosa, pero sin geografía observada;
- CD Cet b → `UNKNOWN_APPEARANCE_REPRESENTATION` por RV-only y ausencia de radio transitado;
- CHXR 73 b → companion de frontera planeta/brown-dwarf, no Júpiter ordinario.

## Salida

Rango 001–100 completo bajo assign-by-physics.

STOP de esta orden.
