# I0_CALIBRATION_DATA_V3_BLIND_READY

**Estado:** congelado para revisión de Astra.

Corpus: 200 casos nuevos e independientes.  
SHA-256 del corpus: `2dd9d24a01f99c763a7ad4db7fe2000fc28568162fbebb5599c012e2afde4f6f`.

Gates completados:
- schema: PASS;
- 18 intenciones cubiertas;
- Safety Gate, negación, positivos, `insufficient`, ambigüedad, correcciones y contexto cubiertos;
- `local_reversible` y `local_with_loss` cubiertos;
- multiacción: 33 casos;
- negativos críticos: 42 casos;
- `insufficient`: 20 casos;
- independencia frente a development + calibration V2 + validation reservado: PASS, 0 conflictos;
- cambios en ejecutor/config/resultados: ninguno.

No se ha ejecutado el corpus contra ningún ejecutor. La fase `I0_EXECUTOR_V3_DEVELOPMENT` queda fuera del alcance de esta entrega y requiere autorización posterior de Astra.
