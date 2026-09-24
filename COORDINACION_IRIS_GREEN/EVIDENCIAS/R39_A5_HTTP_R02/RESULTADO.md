# R39-A5-HTTP-R02 · Resultado

**Estado:** `BLOQUEADO_ACCESO_AUTORIZADO`

## Identidad comprobada
- Sitio: `sabik-asistente`
- Site ID: `47b06e68-ff54-4097-8ad8-336b2d71758a`
- Candidato vigente: `6ab4d5047d3729fae7f122aa`
- Contexto: `deploy-preview`
- Estado: `ready`, no publicado
- R39/HEAD asociado: `66b6b551ad055ea9e367ebdff7246b381f4656d3`
- Function: `n04-library-qa`
- Ruta: `POST /internal/n04/library/search`
- Runtime: `nodejs24.x`
- Región: `us-east-2`
- Digest remoto: `5655a261f20b68b91c7a9dbc344ee675468ca4f848b1c83c9a976596573c5073`
- Biblioteca fuente fijada server-side: `6ab4c1a15435b93043ab3f6d`
- Corpus: `n04-es-20260916-56f72c4d3959` · SHA-256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`

## Contrato HTTP observado en el HEAD del candidato
El handler vigente exige:
- método `POST`;
- `Content-Type: application/json`;
- segundo gate `x-n04-smoke-token` con la clave QA existente;
- body limitado a `q`, `limit` y `version`;
- Team Login permanece como control exterior;
- respuesta de éxito con `library_version`, `corpus_sha256`, `deploy_id`, `source_git_blob`, `build_head` y `results`;
- cabeceras de correlación `X-Sabik-Code-Head` y `X-Sabik-Library-Deploy`.

La petición sintética saneada está en `PETICION_SANEADA.json`. No contiene clave QA ni cookie.

## Limitación comprobada
Las herramientas autorizadas disponibles permiten leer el deploy, proyecto, usuario y equipo de Netlify. La cuenta conectada figura como **Owner**, y el proyecto exige Team Login para todos los contextos. Sin embargo, no existe en estas herramientas una operación que invoque la URL protegida como la sesión web autenticada de Team Login.

El probe R39 existente `probe-qa-r39.mjs` es local sobre Blobs remotos y declara explícitamente `remote_http_requests: 0`; no acredita la Function HTTP. La sonda anónima que terminó en 401 ya está registrada en #237 y **no se repitió**.

Por tanto:
- no se ejecutó una petición HTTP remota nueva;
- no se reutilizó SDK/local handler como sustituto;
- no se exportaron cookies;
- no se leyó, rotó ni cambió la clave QA;
- no se cambió Team Login;
- no hubo bypass, deploy, DNS ni nuevo draft.

## ÚNICA acción externa faltante · A5-HTTP-ACTION-01
Una persona ya autorizada como miembro/Owner del equipo debe, **en el navegador donde ya haya iniciado sesión en Netlify**, abrir exactamente:

`https://6ab4d5047d3729fae7f122aa--sabik-asistente.netlify.app/`

y, desde esa misma sesión del navegador, ejecutar **una sola** petición `POST` a `/internal/n04/library/search` usando la clave QA existente obtenida por su canal seguro local. La clave puede introducirse localmente mediante un prompt de DevTools para que no aparezca en el comando ni se copie a mensajes. El body sintético debe ser:

```json
{"q":"sobrecarga sensorial","limit":3,"version":"n04-es-20260916-56f72c4d3959"}
```

Registrar únicamente: hora, status, Content-Type, `X-Sabik-Code-Head`, `X-Sabik-Library-Deploy` y cuerpo JSON saneado. **No registrar ni exportar cookie, Authorization o clave QA.** Un 200 de página de login no cuenta; debe ser una respuesta JSON de aplicación. Si la respuesta usa un candidato distinto, detenerse y no reinterpretar esta evidencia.

Esta es la única acción solicitada. No se pide cambiar permisos, Team Login, secretos ni crear otro deploy.

## Idioma y normativa
`NO_APLICA_TEXTO_PUBLICO`: esta entrega es evidencia técnica interna y no publica ayuda ni mensajes de interfaz para usuarios. No se traduce el corpus ES sellado ni se declara biblioteca inglesa. C17 permanece `PENDING` y separado.

