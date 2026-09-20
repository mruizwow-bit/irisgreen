# SABIK_AYUDAS_ES_VALIDATION_REPORT_V1

**Fase:** C1-I2  
**Fecha:** 20/09/2026  
**Fuente congelada:** HEAD \`9d4aa750de2d6e6ebdf8c7aa7d450faefb1baac2\`

## Resultado

**PASS · 0 errores**

- Dataset candidato: **258/258**.
- Registros V1.1 válidos: **258/258**.
- READY válidos: **206/206**.
- HOLD preservados: **52/52**.
- Decisiones: 206 READY · 28 HOLD_MODELING · 21 HOLD_VERIFY · 2 HOLD_DUPLICATE · 1 HOLD_HISTORICAL.
- Pérdida de \`cuantia\`: **0**.
- Pérdida de \`obs\`: **0**.
- Pérdida de \`tags\`: **0**.
- Pérdida de \`fuente\`: **0**.
- Cambios semánticos silenciosos detectados en campos legacy mapeados: **0**.
- IDs duplicados: **0**.
- Fechas no ISO tras transformación: **0**.
- «Abiertas ahora»: **16/16**.
- URL governance: **7 TECHNICALLY_CANDIDATE + 1 BLOCKED_MANUAL_RECHECK + 0 aplicadas**.
- NEW_RESOURCE_PROPOSAL filtrados del corpus principal: **5/5**; incluidos: **0**.

Validador reproducible: \`validate-sabik-ayudas-candidate-v1.mjs\`.

El validador lee el JSON legacy, el registro congelado, schema V1.1, dataset candidato, changeset de URLs y propuestas nuevas. No participa en el build ni modifica producción.
