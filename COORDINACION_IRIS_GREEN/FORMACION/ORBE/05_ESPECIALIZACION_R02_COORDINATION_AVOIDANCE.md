# ORBE · ESPECIALIZACIÓN R02 · COORDINATION AVOIDANCE

Fecha: 01/10/2026

## Objetivo
Aprender qué tipos de trabajo concurrente pueden fusionarse sin coordinación y qué decisiones requieren coordinación porque protegen invariantes globales.

## Aprendizajes
- CRDTs: determinadas actualizaciones concurrentes pueden converger de forma determinista.
- CALM: la monotonicidad ayuda a identificar clases de computación que pueden evitar coordinación.
- I-confluence: la coordinación solo puede evitarse cuando estados localmente válidos siguen siendo globalmente válidos al fusionarse.
- Convergencia no implica corrección semántica.
- Append-only, IDs únicos, operation_id y partición por ownership reducen coordinación.
- Ownership único, presupuesto limitado y decisiones mutuamente excluyentes siguen requiriendo coordinación.

Regla R02:
**minimizar coordinación innecesaria y conservar la coordinación que protege invariantes.**

Fuentes: Shapiro et al. / Inria, CALM, UC Berkeley y Bailis et al.

No producto. No build. No merge. No deploy.
