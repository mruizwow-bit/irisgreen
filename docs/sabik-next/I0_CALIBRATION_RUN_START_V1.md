# I0 · CALIBRATION RUN START · V1

**Fecha:** 20/09/2026  
**Estado:** BASE_CONGELADA_ANTES_DE_TUNING

## Base congelada

- PR #177
- dataset HEAD: `08764d2562c445f63a93036e0864f2ca859c1e9f`
- development: **400** · SHA-256 `c388607d55c5c8daef721217e49f01c0dd7e17d81c27af2f6e76f3c44cca97fb`
- calibration: **200** · SHA-256 `ffc63e76eadbac6e975f9792e906913585bcbf53806d7616dc385481145b373f`
- schema v0.4 · SHA-256 `3bbfcd7dfd8473b1a6366a664ddd98d7c94c08dafa6553d7879aa7b693a3edc8`

Los 600 casos quedan congelados. No se modifican después de observar resultados.

## Ejecutor congelado

- versión: `i0-reference-v1`
- tipo: clasificador léxico-contextual nearest-neighbour + reglas contractuales;
- entrenamiento: **development solamente**;
- development: evaluación **leave-one-out**;
- calibration: labels usadas únicamente para selección de umbrales y métricas;
- #173 / validation: **prohibido para tuning**;
- aleatoriedad: ninguna; seed no aplica.

## Configuración inicial

- peso de texto: 0.78
- peso de contexto: 0.22
- classify floor fijo: 0.70

## Grid aprobado

- local_reversible top1: 0.80, 0.85, 0.88, 0.90, 0.92, 0.94
- local_reversible margin: 0.08, 0.10, 0.12, 0.15, 0.18, 0.20
- local_with_loss top1: 0.92, 0.94, 0.96, 0.97, 0.98, 0.99
- local_with_loss margin: 0.12, 0.15, 0.18, 0.20, 0.22, 0.25
- combinaciones: **1296**

## Comando reproducible

`node tools/run-sabik-i0-calibration-v1.mjs --config config/sabik/i0/calibration-run-v1.json --output reports/sabik/i0/calibration-v1`

El runner no contiene ni abre rutas de validation.
