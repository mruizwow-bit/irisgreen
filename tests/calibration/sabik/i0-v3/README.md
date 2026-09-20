# Sabik I0 · Calibration independiente V3

Estado: **FROZEN_BLIND_READY**.

Este directorio contiene el corpus independiente destinado exclusivamente a la próxima selección del ejecutor V3. Se creó desde `I0_CONTRACTS_V0_4`, el schema I0 v0.4 y la documentación normativa indicada en `manifest.v3.blind.json`.

Reglas del freeze:
- 200 casos, IDs `I0-CAL-3001` a `I0-CAL-3200`;
- no se usó código del ejecutor V2/V3 para redactar o etiquetar casos;
- no se usaron predicciones, métricas ni errores de calibration V2;
- el calibration anterior queda `CONSUMED_DIAGNOSTIC_ONLY`;
- development + calibration V2 se usan únicamente como referencias automáticas de similitud;
- `#173` se consulta únicamente dentro del checker ciego: su contenido no se imprime;
- no se ha ejecutado este corpus contra ningún ejecutor.

Archivos:
- `calibration.v3.blind.jsonl`: corpus congelado;
- `coverage.v3.blind.json`: estadísticas de cobertura;
- `manifest.v3.blind.json`: hashes, fuentes normativas y evidencia del gate;
- `SHA256SUMS.v3.blind`: checksums de los artefactos congelados.
