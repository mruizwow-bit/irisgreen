# R39 A9 · Biblioteca Cloud de Sabik · cierre técnico · 27/09/2026

Estado: `R39_A9_SABIK_CLOUD_LIBRARY_READY_FOR_ASTRA`.

## Base y candidato

- Issue: #306.
- Rama de construcción: `agent9/r39-cloud-library-r01-20260927`.
- Base R06: HEAD `8690e26140f6d513c3592df62bc82b167cbb1d0e`, tree `d257910de08519359d805b1f0b53599595174bdb`.
- Candidato Cloud desplegado y probado: HEAD `f4d89076b13cc3103bbcf41bbe7dd88718cb9bf0`, tree `a5a5f94fb8cfc5941cdf56e2ae0f2d6b2145f922`.
- CI final: run `36327674236` SUCCESS, 203/203 tests.
- Evidencia GitHub Actions: artifact `10934885561`, digest `sha256:9e6e954f3e5e1c09c9fed6d9aba53f6cfba8dabedb0668798f8c219f957f8277`.

## R38 preservado

La biblioteca histórica R38 permanece inmutable:
- versión `n04-es-20260916-56f72c4d3959`;
- 4.332 fragmentos / 4.332 IDs;
- SHA-256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`.

A9 no modificó `src/library.mjs`, `src/qa-handler.mjs`, `src/team-transport-handler.mjs`, `src/cloud-connection.mjs`, `netlify/functions/n04-library-qa.mjs`, `netlify/functions/n04-team-transport.mjs` ni `scripts/seal-deploy.mjs`.

## Biblioteca A9

Fuente fijada: contenido público trazable de Iris Green en `main@ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5`, copiado como snapshot inmutable dentro de `cloud/n04-r38-library/sources/a9-r01/`.

Identidad final:
- versión: `sabik-es-en-20260927-r01-a582b153c173`;
- corpus SHA-256: `2a36db04dabd04d5fabdf5e7fc79db9509ebd8657f3daa9dd9886a75d9540da8`;
- bytes: 1.583.119;
- fragmentos: 1.208;
- ES: 604;
- EN: 604;
- source bundle SHA-256: `a582b153c173f397ee40e105f09cdcdaf424599984fcf742157adc819b5d2647`;
- manifest SHA-256: `0197ee5c8c3ed418dfd4ad364822b7f628608e8dd666b6773faeb4ddc9dcb502`.

Cobertura fijada por esta release: Condiciones/Situaciones, Datos, Vida diaria e Investigación disponibles en el snapshot público. La release no lee `main` en runtime.

## Child-safe

- 30 fragmentos full S2 = 15 temas bilingües.
- 30 safe variants enlazadas.
- DEFAULT / CHILD / TEEN: full S2 queda fuera del índice antes de ranking.
- ADULT sin intención explícita: full S2 queda fuera.
- ADULT + intención explícita: puede recuperar full S2.
- Las safe variants son extractos literales de la fuente pública fijada; A9 no redacta ni traduce nuevo contenido de seguridad.
- No se pide DOB, edad, identidad ni diagnóstico.

La documentación R42 enumera 16 temas S2. `TEPT complejo` no existe en el snapshot público fijado y no se inventó. El paquete R42 R02 completo de 965 registros no estaba materializado como fuente accesible en este carril; queda como limitación de cobertura, no como falsa inclusión.

## Citas y recuperación

Cada resultado conserva fragment ID, content ID, locale, URL real, title/heading, library version, source version, source SHA-256 y score. ES y EN se indexan por separado y no se mezclan silenciosamente. La agrupación por fuente conserva todos los fragment IDs.

No hay embeddings, LLM, proveedor externo, reranker, conversación ni `/api/chat`.

## Rendimiento

Medición local Node 22.16.0:
- cold load: 111,51 ms;
- warm query p95 (100 búsquedas): 0,30 ms;
- heap usado observado: 63,12 MiB.

Lectura remota real de Netlify Blobs durante el sellado:
- cold load con red: 339,12 ms;
- consultas de comprobación: 0,04–0,65 ms tras carga.

Estas cifras son QA del candidato, no SLA de producción.

## Cloud privado

Netlify site: `sabik-asistente`, Site ID `47b06e68-ff54-4097-8ad8-336b2d71758a`.

Deploy A9:
- ID `6ab92e91a3cdab71e281a975`;
- origin `https://6ab92e91a3cdab71e281a975--sabik-asistente.netlify.app`;
- state `ready`;
- context `deploy-preview`;
- `published_at=null`;
- Team Login: true / all contexts;
- runtime Functions: Node 24, us-east-2;
- 4 Functions: las dos R06 históricas + `sabik-cloud-library-qa` + puente privado A9 `sabik-cloud-library-team`.

El sellado escribió exclusivamente:
- `cloud-library/versions/<version>/corpus.json`;
- `cloud-library/manifest.json`;

corpus y manifest quedaron `created-and-readback-verified` con lectura fuerte. No se borró ni sobrescribió R38.

## HTTP y límites honestos

Se ejecutó HTTP real contra el origin A9. Sin exportar cookies/sesiones, Netlify Team Login respondió 401 antes de la aplicación: el gate exterior privado queda demostrado.

No se declara todavía una respuesta HTTP **de aplicación autenticada** desde una sesión humana de Team Login. La ruta server-only A9 para ese QA existe y está probada localmente, pero la sesión humana no se exporta a CI. Esta limitación se mantiene explícita para Astra.

C17/retención de plataforma sigue PENDING: ausencia de logs propios no prueba retención cero de Netlify.

## Invariantes finales

- 0 producción;
- 0 DNS;
- 0 cambios de Team Login;
- 0 lectura/copia/cambio de secretos;
- 0 frontend;
- 0 voz/TTS/masters/audio;
- 0 datos de usuario, conversaciones, perfiles, IP o memoria personal en el corpus.
