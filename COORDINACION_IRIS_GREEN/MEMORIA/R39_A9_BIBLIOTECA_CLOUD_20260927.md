# R39 A9 · Biblioteca Cloud de Sabik · fix Astra R03 · 27/09/2026

Estado: `R39_A9_SABIK_CLOUD_LIBRARY_FIX_READY_FOR_ASTRA`.  
Calificación: `A9_R03_TECHNICALLY_VERIFIED_PRIVATE`.

## Motivo del R03

Astra reabrió el cierre R01 en #306 por tres puntos: safe variants autoderivadas, dos URLs EN de Datos construidas desde un título duplicado y HTTP autenticado de aplicación todavía no ejecutado. La arquitectura R38/R39/R06 se conservó.

R01 permanece como evidencia histórica. Un R02 privado intermedio se descartó al detectar que el auditor de citas no propagaba el error a través de `tee` y que se había intentado una ruta EN de Investigación que todavía no existe. La corrección válida se cortó como identidad nueva R03; ninguna identidad anterior fue sobrescrita.

## Fuente child-safe aprobada

Fuente editorial fijada por Astra:
- paquete: `iris-green-contenido-R02-DESIGN-CHILD-SAFE-20260927.zip`;
- paquete SHA-256: `b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23`;
- `SAFETY/safe-variants.json` SHA-256: `4167fe9cf767623c1188b5796297b4f83a89b0c2928a55bcc0f765690bfb3260`;
- `SAFETY/s2-review.csv` SHA-256: `579c4274d1de97b24ea39f9296ea66d9c61a50b1cad15a0da89e91736cdeab55`;
- clasificación: `HUMAN_REVIEWED_S2`;
- 16 registros S2 revisados en la fuente aprobada.

El builder consume `cloud/n04-r38-library/sources/a9-r02-safety/APPROVED_SAFE_VARIANTS_R42.json`. No genera variantes por truncado, `lede` ni primer párrafo. Cada safe variant enlaza su `safety_content_id`; si falta aprobación, el build falla. Los tests exigen copy exacto revisado y rechazan una variante normalizada idéntica al full S2.

El snapshot público fijado para el corpus A9 contiene 15 de los 16 temas revisados; `TEPT complejo / Complex PTSD` no está presente y no se fabrica contenido full para él.

## Release R03

Código probado y desplegado:
- branch: `agent9/r39-cloud-library-r01-20260927`;
- HEAD: `c6735f8956c4f79f1017bd51c269ecf8a88a4ed3`;
- tree: `b142f75cb822f5575c64c9b490c53f9f092946f7`.

Identidad:
- versión: `sabik-es-en-20260927-r03-ee7e3e4a1f4b`;
- corpus SHA-256: `0066243fd682f351752442b6139990661f0bfd1ac36597dc011338444fb5d249`;
- corpus bytes: 1.623.300;
- manifest SHA-256: `a4522eb969ab44df434e972c9fc7b149aade70f41b164bd02c1c3af22a2be25f`;
- source commit: `ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5`;
- source bundle SHA-256: `5307be32bb4627ed19be087f2c92f9cce1e602b7e2fa26b255702ef5f0230683`;
- 1.208 fragmentos = 604 ES + 604 EN;
- 30 full S2 + 30 safe variants.

R38 sigue byte-identificado:
- versión `n04-es-20260916-56f72c4d3959`;
- 4.332 fragmentos;
- SHA-256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`.

## Citas

Se corrige la generación de Datos para usar slug canónico de fuente. Los dos registros EN con título `Employment and autism` quedan:
- `/en/data/employment-and-autism-united-kingdom/`;
- `/en/data/employment-and-autism-australia/`.

El auditor final, ahora con `set -o pipefail`, valida contra el snapshot Git fijado:
- 1.208 registros de cita comprobados;
- 1.057 URLs únicas;
- 0 rotas.

Investigación EN mantiene título/texto EN pero cita la página fuente pública que sí existe: `/es/investigacion/#estudio-N`. No existe todavía `en/research/index.html` en el snapshot fijado ni en la integración R42 comprobada, por lo que no se inventa esa URL.

## QA

GitHub Actions:
- run `36332929849`: SUCCESS;
- 204 tests / 204 PASS / 0 FAIL;
- local cold load: 102,98 ms;
- warm query p95: 0,25 ms;
- heap observado: 20,91 MiB;
- artifact `10935908743`;
- artifact digest `sha256:0d2bdec2f0d076d1281baa1ae7e59e72a3912291d81bf9699da859141bab5c5b`.

Sellado remoto:
- proof `A9_EXPLICIT_DEPLOY_STORE_READBACK_AND_CHILD_SAFE_SEARCH`;
- corpus y manifest `created-and-readback-verified`;
- cold load con red: 456,13 ms.

## Deploy privado

- site: `sabik-asistente`;
- site ID: `47b06e68-ff54-4097-8ad8-336b2d71758a`;
- deploy ID: `6ab942ab91d1122477001cc0`;
- origin: `https://6ab942ab91d1122477001cc0--sabik-asistente.netlify.app`;
- state: `ready`;
- context: `deploy-preview`;
- `published_at=null`;
- Team Login: requerido / all contexts;
- 4 Functions: dos R06 históricas + `sabik-cloud-library-qa` + `sabik-cloud-library-team`;
- Functions Node 24; Blobs `us-east-2`.

La verificación independiente de Netlify confirma el deploy anterior y que el proyecto continúa protegido por Team Login en todos los contextos.

## HTTP / HUMAN QA

HTTP externo real sin sesión humana legítima: 401 en Team Login. Esto confirma el gate exterior.

No se declara todavía HTTP autenticado de aplicación. Ese gate exige una sesión Team Login legítima y se hará como HUMAN QA sin exportar cookies ni secretos:
ES, EN, cero resultados, DEFAULT S2, ADULT sin intención, ADULT + intención explícita, grouping conservando IDs y `Cache-Control: no-store`.

## Cobertura y límites

R03 es un candidato técnico privado, no la biblioteca final sincronizada con los 965 registros de #302. Cobertura fuente actual: 372 catálogo + 49 Datos + 48 Vida diaria + 120 Investigación.

C17/retención de plataforma continúa PENDING. No se modificaron producción, DNS, frontend, voz, Team Login ni secretos; no hay datos de usuario, conversaciones, perfiles, IP ni memoria personal en el corpus.
