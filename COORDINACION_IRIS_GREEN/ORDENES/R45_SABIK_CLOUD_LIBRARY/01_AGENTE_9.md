# R45 · Agente 9 · Biblioteca Cloud Sabik

Fecha: 27/09/2026  
Issue operativo: #306  
Parent Cloud: #237  
Child-safe: #293 + #302

## Decisión
María abre un carril exclusivo para construir la biblioteca Cloud de Sabik. El agente ya dispone del acceso autorizado. No pedir nuevas credenciales ni copiar secretos.

La voz Sabik ES/EN está entrenándose por separado y queda fuera de alcance.

## Baseline
Conservar R38/R39/R06.
- sitio: `sabik-asistente`;
- deploy privado R06: `6ab7a2cd2cf8dc09d3ae9aca`;
- Functions: `n04-library-qa` + `n04-team-transport`;
- corpus sellado: `n04-es-20260916-56f72c4d3959`;
- 4.332 fragmentos;
- Netlify Blobs;
- Team Login.

R38 es inmutable.

## Ejecución
Leer Control, Memoria, normativa, #237, #293, #302 y `cloud/n04-r38-library/`. Publicar `R39_A9_CLOUD_LIBRARY_BASE_READ` y construir.

## Alcance
- sucesor bilingüe ES/EN;
- contenido público/aprobado Iris Green;
- fuente/version/hash/locale/citas reales;
- metadatos audience/sensitivity/discovery;
- contexto de recuperación default/child/teen/adult;
- full S2 bloqueado para default/child/teen; adult requiere intención explícita;
- child-safe antes de ranking/salida;
- server-only;
- no queries/history/profile/IP/user data;
- no voz/audio/masters/corpus de voz;
- no documentos privados NEA;
- sin embeddings/LLM/reranker externo en esta orden;
- nueva versión sellada, nunca overwrite de R38;
- deploy privado autorizado en `sabik-asistente`, no prod;
- Team Login/secretos/DNS sin cambios.

## Entrega
Branch, base/head/tree, manifest, versiones ES/EN, conteos, hashes, tests, performance, evidencia child-safe, deploy privado, HTTP real, limitaciones y memoria/control actualizados.

Marcador:
`R39_A9_SABIK_CLOUD_LIBRARY_READY_FOR_ASTRA`.
