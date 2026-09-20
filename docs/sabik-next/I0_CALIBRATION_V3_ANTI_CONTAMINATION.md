# Sabik I0 · Calibration V3 · Informe anti-contaminación

**Estado:** PASS · BLIND.  
**Gate verificado:** GitHub Actions run `35517453062`.

## Aislamiento de autoría

El corpus V3 se redactó desde `I0_CONTRACTS_V0_4`, el schema I0 v0.4 y documentación normativa. No se abrió código de ejecutor V2/V3 ni se usaron predicciones, métricas o errores de calibration V2 para crear los casos. El corpus anterior no se utilizó como plantilla y queda marcado `CONSUMED_DIAGNOSTIC_ONLY`.

## Control automático de independencia

El checker `tools/check-sabik-i0-calibration-v3-independence.mjs` aplica comparación normalizada, contención, similitud de edición, Dice de 4-gramas, bigramas y tokens de contenido.

Referencias comprobadas automáticamente:
- development consumido;
- calibration V2 consumido;
- validation reservado asociado a `#173`.

Para `#173`, la consulta se realiza únicamente dentro de CI. El checker no imprime textos, labels, resultados, rutas, líneas ni puntuaciones de la referencia reservada. Su salida permitida se limita al estado del gate y, si existe conflicto, a IDs del corpus candidato.

Resultado final del run `35517453062`:
- `candidate_count = 200`;
- `conflict_count = 0`;
- `reserved_validation_checked = true`;
- `conflict_candidate_ids = []`.

Seis candidatos señalados por una iteración ciega anterior fueron sustituidos desde el contrato sin revelar la referencia causante. El corpus final volvió a pasar el gate completo.

## Alcance

El mismo run verificó que la rama no modifica artefactos del ejecutor, configuración de ejecución ni resultados del ejecutor. El nuevo calibration no se ha ejecutado contra ningún ejecutor.
