# SABIK_AYUDAS_ES_LEGACY_MAPPING_V1

**Fase:** C1-I2 · contrato lossless  
**Base congelada:** PR #185 · \`9d4aa750de2d6e6ebdf8c7aa7d450faefb1baac2\`  
**Fuente legacy:** \`es/tramites/directorio/tramites-datos.json\` · blob \`afbdb32f5e060b5b0036a7902766b317794228e5\`  
**Regla:** 0 campos legacy descartados silenciosamente.

## Matriz legacy → V1.1

| Legacy | Destino V1.1 | Transformación | Conservación |
|---|---|---|---|
| \`id\` | \`id\` | copia exacta | exacta |
| \`name\` | \`name\` | copia exacta | exacta |
| \`terr\` | \`jurisdiction\` | copia exacta | exacta |
| \`cat\` | \`category\` | copia exacta | exacta |
| \`country\` | \`country_code\` | mayúsculas ISO-3166-1 alpha-2: \`es → ES\` | reversible; \`country_code.toLowerCase() === country\` |
| \`nivel\` | \`jurisdiction_level\` | copia exacta | exacta |
| \`ambito\` | \`scope\` | copia exacta | exacta |
| \`cuantia\` | \`amount_summary\` | copia exacta | exacta |
| \`cuantia\` | \`what_it_offers\` | espejo controlado durante I2; no añade ni resume | el original sigue íntegro en \`amount_summary\` |
| \`que\` | \`summary\` | copia exacta | exacta |
| \`quien\` | \`eligibility_summary\` | copia exacta | exacta |
| \`docs\` | \`documents_summary\` | copia exacta | exacta |
| \`obs\` | \`compatibility_notes\` | copia exacta | exacta |
| \`org\` | \`source_authority\` | copia exacta | exacta |
| \`fuente\` | \`official_url\` | copia exacta en I2 | exacta; ningún URL change se aplica todavía |
| \`tags\` | \`keywords\` | split por coma + trim; orden conservado | reversible: \`keywords.join(", ") === tags\` en 258/258 |
| \`pais\` | \`country_name\` | copia exacta | exacta |

El corpus ES del blob contiene exactamente esos 16 campos en 258/258 filas. No existe ningún campo legacy adicional sin mapear.

## Metadatos congelados de auditoría → V1.1

| Registro C1-I1 | V1.1 |
|---|---|
| \`tipo_recurso\` | \`resource_type\` |
| \`situacion_actual\` | \`status\` |
| \`fecha_apertura\` | \`opens_at\` en ISO 8601 o null |
| \`fecha_cierre\` | \`closes_at\` en ISO 8601 o null |
| \`fecha_consulta\` | \`reviewed_at\` en ISO 8601 |
| \`proxima_revision\` | \`next_review_at\` en ISO 8601 |
| \`fuente_primaria\` | \`source_is_primary\` boolean |

No se recalculan estados ni decisiones.

## PROGRAM / CALL / RESOURCE

La transformación de \`record_kind\` es mecánica, no una nueva investigación:

- \`PROGRAM\`: \`resource_type = programa\` y no existe señal temporal congelada de convocatoria. Exige \`program_id = id\` y \`call_id = null\`.
- \`CALL\`: estado temporal \`ABIERTO\`, \`CERRADO\`, \`PRÓXIMA CONVOCATORIA\` o \`HISTÓRICO\`, o hay fecha de apertura/cierre. Exige ambos IDs. \`call_id\` conserva el \`id\` legacy; \`program_id\` elimina solo sufijos temporales inequívocos (2026, 2026-27, 2627, etc.). Si no existe sufijo inequívoco, conserva \`id\`.
- \`RESOURCE\`: resto de recursos. En el dataset I2, \`program_id = null\` y \`call_id = null\`. V1.1 permite vincular un RESOURCE a un programa solo cuando exista una relación explícita y gobernada; nunca se infiere en silencio.

Los HOLD no se resuelven con esta clasificación: siguen con su \`migration_decision\` congelada y fuera del batch automático.

## URLs

Los 8 cambios de URL viven en la envoltura de gobernanza del dataset candidato.

- 7: \`TECHNICALLY_CANDIDATE\`.
- Mallorca: \`BLOCKED_MANUAL_RECHECK\`.
- Aplicados en I2: 0.

Por tanto \`official_url\` sigue siendo \`fuente\` legacy y \`previous_url = null\` en las 258 fichas candidatas. Cuando Astra autorice un cambio, la operación será explícita: \`previous_url = old_url\` y \`official_url = new_url\`.
