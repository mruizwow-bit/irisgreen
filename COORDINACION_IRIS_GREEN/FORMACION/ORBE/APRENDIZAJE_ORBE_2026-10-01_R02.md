# APRENDIZAJE_ORBE_2026-10-01_R02

Estado: `ORBE_ADVANCED_R02_COORDINATION_AVOIDANCE_STUDIED`

## Aprendizaje nuevo
- no todo trabajo concurrente necesita coordinación;
- CRDTs muestran cómo diseñar convergencia;
- CALM vincula monotonicidad y coordination-free consistency;
- I-confluence obliga a comprobar invariantes después del merge;
- convergencia no garantiza corrección semántica;
- append-only, IDs y partición por ownership pueden reducir coordinación;
- decisiones críticas no deben usar last-writer-wins por defecto.

Regla:
**no minimizar coordinación como objetivo; minimizar la innecesaria y preservar la que protege invariantes.**

## Próximo estudio
Semantic merge policies, escrow/bounded counters, causal consistency, coordination locality y compactación de estado.

No producto. No build. No merge. No deploy.
