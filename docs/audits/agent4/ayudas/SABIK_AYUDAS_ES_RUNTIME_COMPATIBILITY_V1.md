# SABIK_AYUDAS_ES_RUNTIME_COMPATIBILITY_V1

**Base inspeccionada:** \`es/tramites/directorio/index.html\` y \`tramites-datos.json\` en HEAD \`9d4aa750...\`.  
**Estado:** análisis solamente. Runtime sin modificar.

## Forma actual

El runtime actual:

1. carga \`tramites-datos.json\`;
2. selecciona país con \`st.data[st.country]\`;
3. filtra por \`f.terr\` y \`f.cat\`;
4. busca en \`f.name + f.que + f.quien + f.tags + f.cat + f.terr\`;
5. renderiza \`name, terr, cat, que, cuantia, quien, docs, obs, org, fuente\`;
6. mantiene una copia legacy embebida en \`#ig-initial-data\` como fallback.

El dataset candidato I2 usa una envoltura \`id + migration_decision + public_record\`, por lo que **no es sustituto directo** del JSON público actual.

## Compatibilidad campo a campo

| V1.1 | Estado | Motivo / adaptación |
|---|---|---|
| \`id\` | SUPPORTED_NOW | mismo significado; el adaptador debe desenvolver \`public_record\` |
| \`name\` | SUPPORTED_NOW | mismo nombre de campo |
| \`country_code\` | ADDITIVE_SAFE | el runtime actual selecciona país por clave top-level, no por campo de ficha |
| \`country_name\` | ADDITIVE_SAFE | no consumido hoy |
| \`jurisdiction\` | REQUIRES_FILTER_CHANGE | sustituye \`terr\`, usado por filtro y chips |
| \`jurisdiction_level\` | ADDITIVE_SAFE | conserva \`nivel\`; no se consume hoy |
| \`scope\` | ADDITIVE_SAFE | conserva \`ambito\`; no se consume hoy |
| \`category\` | REQUIRES_FILTER_CHANGE | sustituye \`cat\` |
| \`resource_type\` | ADDITIVE_SAFE | nuevo metadato estructurado |
| \`record_kind\` | ADDITIVE_SAFE | nuevo metadato; útil para programa/convocatoria |
| \`status\` | REQUIRES_FILTER_CHANGE | necesario para «Abiertas ahora»; también deberá mostrarse en UI |
| \`program_id\` | ADDITIVE_SAFE | no consumido por renderer actual |
| \`call_id\` | ADDITIVE_SAFE | no consumido por renderer actual |
| \`opens_at\` | REQUIRES_FILTER_CHANGE | participa en «Abiertas ahora» |
| \`closes_at\` | REQUIRES_FILTER_CHANGE | participa en «Abiertas ahora» y «Hasta cuándo» |
| \`official_url\` | REQUIRES_RENDERER_CHANGE | sustituye \`fuente\` |
| \`previous_url\` | ADDITIVE_SAFE | trazabilidad; no debe mostrarse como enlace principal |
| \`reviewed_at\` | REQUIRES_RENDERER_CHANGE | nuevo bloque visible «Revisado el» |
| \`next_review_at\` | REQUIRES_FILTER_CHANGE | gate de vigencia; también visible |
| \`source_authority\` | REQUIRES_RENDERER_CHANGE | sustituye \`org\` |
| \`source_is_primary\` | REQUIRES_FILTER_CHANGE | gate de «Abiertas ahora» |
| \`summary\` | REQUIRES_RENDERER_CHANGE | sustituye \`que\` |
| \`eligibility_summary\` | REQUIRES_RENDERER_CHANGE | sustituye \`quien\` |
| \`what_it_offers\` | REQUIRES_RENDERER_CHANGE | nuevo bloque «Qué ofrece» |
| \`amount_summary\` | REQUIRES_RENDERER_CHANGE | conserva \`cuantia\` |
| \`documents_summary\` | REQUIRES_RENDERER_CHANGE | sustituye \`docs\` |
| \`compatibility_notes\` | REQUIRES_RENDERER_CHANGE | sustituye \`obs\` |
| \`keywords\` | REQUIRES_FILTER_CHANGE | sustituye string \`tags\` por array |

## Cambios técnicos exactos necesarios antes de publicar V1.1

1. **Loader/adaptador de datos:** aceptar la envoltura candidata o producir, en el batch aprobado, objetos públicos V1.1 sin metadatos de gobernanza.
2. **Integración España en el dataset global:** reemplazar únicamente la colección ES aprobada; conservar UK/BR/US/mundo sin reescritura accidental.
3. **Renderer:** cambiar aliases legacy por V1.1 y presentar el orden aprobado: Estado actual → Hasta cuándo → Qué es → Quién puede pedirlo → Qué ofrece → Qué necesitas → Dónde se solicita → Fuente oficial → Revisado el → Próxima revisión.
4. **Filtros territoriales/categoría:** \`terr → jurisdiction\`, \`cat → category\`.
5. **Búsqueda:** usar \`name, summary, eligibility_summary, keywords, category, jurisdiction\`; adaptar \`keywords\` array.
6. **Filtro «Abiertas ahora»:** implementar exactamente el predicado C1-I1 sobre \`status, opens_at, closes_at, source_is_primary, official_url, next_review_at\`.
7. **Batch gate:** solo \`migration_decision = READY\`; las 52 HOLD no entran en publicación automática.
8. **URLs:** aplicar, en operación separada y autorizada, hasta 7 changes técnicamente candidatos; Mallorca sigue bloqueada. Al aplicar: mover old → \`previous_url\`, new → \`official_url\`.
9. **Fallback embebido:** regenerar \`#ig-initial-data\` con el mismo contrato que el loader o introducir un adaptador común; evitar que fetch y fallback usen modelos distintos.
10. **Conteos/metadatos del directorio:** recalcular los conteos que hoy dependen de \`IG_INITIAL._counts\` cuando se cambie la fuente de España.
11. **PROGRAM/CALL:** si la UI expone convocatorias por programa, resolver navegación/agregación usando \`program_id\` y \`call_id\`; no es necesario para leer la ficha básica.
12. **Pruebas:** ejecutar el validador I2 y pruebas de filtros/render antes de sustituir \`tramites-datos.json\`.

Ninguno de estos cambios se ejecuta en C1-I2.
