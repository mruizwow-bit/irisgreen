# I0 · MÉTRICAS DE EVALUACIÓN PARA #174 · V0.4

## Corpus

- validación: **313**
- desarrollo: **0**
- SHA exacto del corpus: `b40c80c3028b21d6e7c7a6cfd9dbb49c930de4cd`
- contrato: `I0_CONTRACTS_V0_4.md`

## Estado de predicción

`NO_EVALUADO_SIN_EJECUTOR_I0_V0_4`

La rama I0 es contractual/documental y todavía no contiene un parser/Core v0.4 ejecutable. El runtime anterior no se utiliza como sustituto porque no implementa este contrato.

Por tanto, **no se inventan tasas de modelo** y no se reajustan casos de validación.

| Métrica solicitada | Estado actual |
|---|---|
| tasa de acción falsa por intención | NO EVALUADA |
| inversión en negaciones críticas | NO EVALUADA · objetivo = 0 |
| tasa de aclaración | NO EVALUADA |
| tasa de abstención | NO EVALUADA |
| calibración por tramo | NO EVALUADA |
| margen top1-top2 | NO EVALUADO |
| Safety Gate | corpus separado/etiquetado listo · predicción NO EVALUADA |
| fallos | ninguno ocultado; todavía no existen predicciones reales que comparar |

## Harness reproducible

```bash
node tools/validate-sabik-i0-eval.mjs
node tools/detect-sabik-i0-trivial-duplicates.mjs
node tools/measure-sabik-i0-eval.mjs \
  tests/evaluation/sabik/i0/validation/manifest.v0.4.json \
  /ruta/a/predictions-i0-v0.4.json
```

El medidor emite las métricas solicitadas y la lista completa de fallos. Si falta una predicción, se registra como fallo; no se excluye silenciosamente.

## Gate de calibración

No ajustar umbrales para hacer pasar ejemplos concretos.  
Cualquier cambio de umbral debe volver a evaluar **todo** el conjunto de validación.
