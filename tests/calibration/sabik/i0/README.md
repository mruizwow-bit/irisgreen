# Sabik I0 · calibration v0.4 · V2

Casos: **200**.

Calibration se usa solo para calibrar umbrales. Validation #173 no está incluido y no se ejecuta para elegir reglas o umbrales.

El harness rechaza el sweep salvo que reciba exactamente **200/200 predicciones**, con IDs únicos, cero extras/faltantes y confidencias finitas.

Cobertura contractual:
- insufficient: **2**;
- multiacción: **15**;
- negación crítica: **20** miembros negativos.

`--self-test-coverage` valida solo el guard de entrada; no genera métricas de modelo ni tuning.
