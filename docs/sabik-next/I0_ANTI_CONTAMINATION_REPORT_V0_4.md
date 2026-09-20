# I0 · informe anti-contaminación development / calibration / validation · V2

**Contrato:** I0 v0.4  
**Validation comparado únicamente por texto:** PR #176 @ `33cd63089416ccdf82fddea4415d3afbec6aa05a`  
**Development:** 400 casos  
**Calibration:** 200 casos  
**Validation:** 313 casos

## Resultado final

- sospechosos antes de la revisión Astra: **81**;
- sospechosos finales: **6**;
- development↔calibration sospechosos: **0**;
- sospechosos no autorizados: **0**;
- coincidencias exactas/normalizadas autorizadas: **5**;
- variante no exacta autorizada: **1**.

Los **29** pares development↔calibration de la revisión inicial se revisaron y ya no queda ninguno por encima de los umbrales del detector.

Los **52** pares development/calibration↔validation se revisaron manualmente usando únicamente los textos para detectar contaminación. No se usaron etiquetas esperadas, fallos ni métricas de #173 y no se ejecutó #173 para tuning. Los sospechosos no literales se reescribieron desde `I0_CONTRACTS_V0_4.md`.

## Residuales autorizados

| Tipo | Development | Validation | Motivo |
|---|---|---|---|
| exacto | I0-DEV-0251 · «Amplía el texto.» | I0-EVAL-021 | `astra_required_literal` |
| exacto | I0-DEV-0252 · «No amplíes el texto.» | I0-EVAL-181 | `astra_required_literal` |
| exacto | I0-DEV-0253 · «Vuelve atrás.» | I0-EVAL-081 | `astra_required_literal` |
| exacto | I0-DEV-0254 · «No vuelvas atrás.» | I0-EVAL-194 | `astra_required_literal` |
| variante de un token | I0-DEV-0257 · «Quita el movimiento.» | I0-EVAL-031 · «Reduce el movimiento.» | el caso development forma parte del contraste `astra_required_literal` |
| exacto | I0-DEV-0258 · «No quites el movimiento.» | I0-EVAL-184 | `astra_required_literal` |

## Criterio

El detector usa coincidencia exacta/normalizada, variante de un token, Jaccard >= 0.82 y solapamiento de trigramas >= 0.80.

Resultado ejecutado sobre los blobs V2: **PASS_NO_UNREVIEWED**.
