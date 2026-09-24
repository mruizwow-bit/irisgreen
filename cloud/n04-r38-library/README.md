# Biblioteca Sabik N04 · R38

Motor de recuperación de documentos públicos, exclusivamente de servidor. Base: PR #234, commit `32bde31544bb51feb2a00e14e28b5a58d74a5d55`. Este subproyecto sustituye al diagnóstico R26 únicamente en el nuevo borrador Cloud; no modifica R26 ni la web Iris Green.

## Fuente y almacenamiento

El build lee `../n04-r26-staging-binding/source/iris-fragments-index.es.json` y verifica sus bytes antes de copiarlos. La fuente permanece en su ubicación y blob originales.

- Versión: `n04-es-20260916-56f72c4d3959`.
- SHA-256: `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`.
- 2.553.061 bytes; 4.332 fragmentos; 4.332 IDs únicos.
- Blob Git: `0e297c977ce3b688186ca917981458adfd5e5ca3`.
- `getDeployStore({name: 'sabik-n04-corpus', region: 'us-east-2', deployID})`.
- Claves: `manifest.json` y `versions/<version>/corpus.json`.

La región coincide con la configuración observada de `sabik-asistente`. El SDK exacto es `@netlify/blobs@11.1.0`. La documentación de [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) distingue los almacenes con nombre y el almacén de despliegue por defecto. El uploader de `@netlify/build` instalado utiliza el segundo. Por ello R38 no presupone que una carpeta `sabik-n04-corpus/` cree un almacén con ese nombre: `seal-deploy.mjs` escribe explícitamente en el mismo almacén con nombre que consulta el runtime y verifica la lectura posterior.

El manifiesto `SABIK_N04_LIBRARY_MANIFEST/1.0` contiene versión, hash, bytes, número de fragmentos e IDs, fecha de origen, fecha de creación, clave, región, almacén, blob de origen, HEAD/tree de build y hash de los tres módulos del motor. El loader rechaza cualquier identidad incorrecta, blob ausente, bytes alterados, duplicados y metadatos no publicables.

## Búsqueda y citas

`loadLibrary(store)` devuelve `searchLibrary({query, limit=5, filters={}, version})`, `getFragment(id)` y el manifiesto inmutable. No expone el corpus al adaptador HTTP.

Índice invertido en memoria: normalización Unicode NFKD, eliminación de marcas, minúsculas y términos completos de letras/números. Búsqueda OR: por cada término encontrado, 100 puntos más presencia en texto (1), título (4), encabezado (3) y conceptos (3). No hay aprendizaje, embeddings ni proveedor. El desempate es por ID ascendente, independiente del locale. La relevancia semántica no se presume; se trata de recuperación léxica inicial.

Filtros exactos sobre metadatos existentes: `source_type`, `editorial_status`, `url` y `concepts` (array de conceptos que deben estar todos presentes). Consulta: 1–300 caracteres, hasta 32 términos; límite: entero 1–20. Versión distinta: error, sin fallback.

Cada resultado incluye `fragment_id`, `snippet` (hasta 480 caracteres originales), `url`, `title`, `heading`, `source_type`, `editorial_status`, `concepts`, `score` y `library_version`. `getFragment` devuelve el registro exacto congelado para consumidores internos. Ninguna cita se inventa ni completa con otra fuente.

## Función de QA

`POST /internal/n04/library/search`, JSON `{ "q": "sobrecarga sensorial", "limit": 5, "version": "n04-es-20260916-56f72c4d3959" }`.

Team Login se mantiene en todos los contextos. Además exige la cabecera `x-n04-smoke-token`, comparada con `N04_SMOKE_TOKEN` mediante comparación de tiempo constante. Si la variable falta, la ruta queda cerrada. No admite consultas por URL, GET de búsqueda, campos adicionales, datos privados ni cuerpos mayores de 2 KiB. No devuelve el corpus, la consulta recibida ni errores internos. Respuestas `no-store`. Si `SABIK_AI_ENABLED` está presente con un valor distinto de `false`, queda cerrada.

La función tiene un único índice cacheado por despliegue/versión, compartido entre llamadas concurrentes de esa instancia. Una carga fallida se descarta para reintento. No se cachean consultas, respuestas ni datos de usuarios. Las instancias frías descargan dos blobs; las llamadas calientes reutilizan el índice. No hay escrituras desde el runtime.

## Publicación inmutable

1. Node 22.16.0 / npm 10.9.2: `npm ci`, `npm test`, `npm run build` desde este directorio.
2. Revisar el manifiesto y crear un borrador en **sabik-asistente**, ID `47b06e68-ff54-4097-8ad8-336b2d71758a`. Nunca usar `--prod`. `netlify deploy --no-build --dir dist` con este `netlify.toml` empaqueta únicamente la función R38.
3. Pasar credenciales sólo mediante entorno de proceso: `NETLIFY_AUTH_TOKEN`, `N04_DEPLOY_ID`. Ejecutar `npm run seal:deploy`.
4. El script comprueba identidad del sitio, Team Login, región, despliegue ready/no publicado; escribe corpus y después manifiesto mediante `onlyIfNew`, con lectura fuerte y hash. Nunca sobrescribe una clave distinta. No hay borrados ni limpieza de versiones.
5. El despliegue falla cerrado mientras no exista un manifiesto válido. Verificar por separado lectura de Blobs y ejecución HTTP detrás de Team Login; una no demuestra la otra.

Una versión nueva requiere otra revisión aprobada y otro despliegue, conservando los anteriores. Los almacenes están ligados al ciclo de vida del despliegue: no son un archivo permanente independiente. Debe conservarse el despliegue asociado y la fuente Git; este trabajo no cambia la política de eliminación de Netlify. El alias `manifest.json` nunca se modifica dentro de un despliegue sellado.

## Privacidad, rendimiento y límites

El código runtime no emite logs. No almacena conversaciones, consultas, perfiles, IP, menores, voz o preferencias. Esto no demuestra la retención de logs de la plataforma: **C17 PENDING**. Falta evidencia de configuración aplicada y retención máxima de siete días antes de aprobar esa condición.

Objetivos locales sobre el corpus exacto: carga e índice <2 s; p95 de 100 búsquedas calientes <50 ms; incremento de heap <128 MiB. Objetivo de lectura fría remota <15 s. Son mediciones de QA, no un SLA ni prueba del p95 de una Function en producción. `evidence/PERFORMANCE.json` registra la medición.

No hay proveedor, modelo, embeddings, voz, conversación ni `/api/chat`. Se entrega el motor para revisión de Astra, antes de conectarlo a inferencia conversacional. Iris Green sigue en mantenimiento.
