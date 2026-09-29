# PROCEDIMIENTO DE EMISIÓN COMPLETA DE ÓRDENES · 29/09/2026

Estado: `COORDINACION_ORDER_EMISSION_COMPLETE_RECORD_REQUIRED`

## Regla

Una orden operativa de Iris Green NO se considera completamente emitida si queda solo en chat o solo en un issue.

Cada orden nueva o cambio material de una orden existente debe revisar y actualizar, según corresponda:

1. **GitHub Issue**
   - crear issue nuevo si nace carril/ID nuevo;
   - o comentar el issue vigente si es addendum/rework del mismo carril.

2. **ORDEN**
   - documento versionado bajo `COORDINACION_IRIS_GREEN/ORDENES/`;
   - bloque normativo embebido cuando el formato vigente lo exija.

3. **MEMORIA**
   - memoria específica del cambio/orden;
   - actualizar `MEMORIA/ESTADO_CONSOLIDADO.md` si cambia estado operativo vigente.

4. **CONTROL**
   - `DELTA_*.json`;
   - `CONTROL_MASTER_SYNC_DELTA_*.csv` cuando el carril use sincronización de Control Maestro;
   - fila/estado actualizado en `CONTROL/ESTADO_TRABAJOS.csv`.

5. **ESTADO ACTUAL**
   - actualizar `ESTADO_ACTUAL.md` cuando el cambio afecta qué debe ejecutar el siguiente agente, la precedencia o un gate.

6. **NORMATIVA**
   - crear/actualizar documento en `NORMATIVA/` SOLO si cambia una regla transversal real;
   - no convertir una decisión visual/local en normativa global;
   - si no hay cambio normativo, dejarlo explícito en Orden/Memoria/Control.

7. **PRECEDENCIA / HANDOFF**
   - enlazar issue anterior/siguiente cuando cambia responsable;
   - marcar supersedencias y STOPs;
   - registrar hashes/artefactos de handoff cuando existan.

## Regla de consistencia

Los estados y marcadores de Issue, Orden, Memoria y Control deben coincidir.

No declarar:
- READY;
- PASS;
- HANDOFF;
- integración autorizada;

si la documentación canónica no refleja el mismo estado.

## Aplicación inmediata

Esta regla se aplica desde R61/R63/R64 actualizados el 29/09/2026 y a todas las órdenes posteriores.

No modifica normativa de producto. Es procedimiento de coordinación/documentación.
