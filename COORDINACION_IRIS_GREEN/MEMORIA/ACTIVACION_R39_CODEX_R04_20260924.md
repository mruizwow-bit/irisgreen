# R39 R04 · Cloud privado activado; consulta montada pendiente

Autorización de María: [#237, comentario 5819519824](https://github.com/mruizwow-bit/irisgreen/issues/237#issuecomment-5819519824). La orden R04 vigente ya permite esta activación; no requiere repetir la aprobación.

## Resultado

Un único borrador incremental de `sabik-asistente`, `6ab56a1ba2f6d83e6fb7b408`, está READY y no publicado: https://6ab56a1ba2f6d83e6fb7b408--sabik-asistente.netlify.app. Código `16f1134e56292ca2ee600e77e69012c494f39aaf`, tree `7e423e53ef52c0c8b6c970545f9370c4a38e7c03`, rama `codex/n04-retrieval-r39-20260924`.

Se activó la entrada privada existente con la clave QA anterior únicamente en servidor y un solo origen Web permitido: `https://deploy-preview-244--irisgreen-home.netlify.app`. Se conserva Team Login en todos los contextos. No se modificaron las variables del sitio, credenciales, producción, protección ni biblioteca. Las opciones de activación pertenecen exclusivamente al nuevo deploy.

La apertura de `/sabik-connect?lang=es` en el navegador con la sesión de equipo existente muestra la página «Conexión privada de Sabik» y el distintivo Private. Acredita acceso legítimo al GET de la Function. **Todavía no acredita una POST de búsqueda ni transporte desde el formulario montado.** No se exportaron cookies ni se repitieron sondas 401.

## Composición y comprobaciones

Motor, body reader, agrupación A1, puente y panel R03 conservados. El incremento sobre R04 e8a8e957 adapta la validación al alias exacto de PR244 y añade marcadores DOM efímeros de estado HTTP/procedencia para observar una consulta real. No guardan consultas, respuestas ni credenciales. El transporte cliente sigue idéntico.

259/259 pruebas en Node22.16.0 y 259/259 en Node24.19.0. Build limpio, empaquetado portable y hashes de ambas Functions comprobados contra Netlify; runtime remoto `nodejs24.x`. Estas pruebas locales y el estado READY no equivalen a HTTP de búsqueda aprobado.

La inspección inicial posterior al deploy encontró el campo compacto `r` de Netlify en vez de `runtime_version`; el despliegue y las comparaciones de integridad/protección ya habían terminado correctamente. Se corrigió el lector de metadatos y se repitió solo la inspección. **No hubo segundo despliegue.**

R38 conservado: deploy `6ab4c1a15435b93043ab3f6d`, 4.332 fragmentos, versión `n04-es-20260916-56f72c4d3959`, SHA256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`, blob `0e297c977ce3b688186ca917981458adfd5e5ca3`. Cero escrituras del corpus. R03 `6ab504fbf5d403147f6de213` y producción web `6aa99a0d467202094ed9320f` permanecen.

## Entrega mínima a A2

Base vigente comprobada: PR244, `agent2/sabik-iris-r08-20260924@d52584344240deb352f712debd19e9e7ae76bdd2`. `A2_CONNECT.patch` contiene únicamente:

- `sabik/mount-config.mjs`: `enabled:true`, origen Cloud del nuevo borrador.
- `sabik/iris-mount.mjs`: ayuda ES/EN de 300 caracteres, coherente con el contrato de búsqueda.
- `sabik/iris-panel.html`: límite y ayuda de 300 caracteres.

Aplicación comprobada en índice aislado y resultado verificado byte a byte. Codex no modificó la rama A2 ni desplegó la web. A2 aplica el delta en su HEAD vigente, sin restaurar bases anteriores, y devuelve HEAD/deploy/origen. Si su rama vuelve a avanzar, repetir `git apply --check` antes de aplicar. Conservar todas las subidas posteriores.

El alias exacto de PR244 resuelve la dependencia circular entre dos permalinks de deploy. Su pertenencia al candidato A2, rama, commit y estado READY se verificó directamente en Netlify sobre la versión anterior 145cfc43. Después Git confirmó el avance compatible d5258434. Se pidió también acuse explícito a A2; aún no recibido al registrar esta entrega. No se presenta ese acuse como obtenido ni se admite un comodín de origen.

## Estados separados

| Estado | Evidencia |
|---|---|
| IMPLEMENTADO | Integrado, probado, empaquetado y desplegado en Cloud privado |
| GET_CLOUD_AUTORIZADO | Página de conexión servida en sesión legítima de equipo |
| HTTP_AUTORIZADO_VERIFICADO | PENDIENTE POST real de búsqueda |
| TRANSPORTE_REAL_VERIFICADO | PENDIENTE activar configuración A2 y consulta desde su formulario |
| MONTADO_VERIFICADO_ES_EN | Montaje previo acreditado por María/A2; conexión real ES/EN pendiente |

A3 conserva únicamente cinco comprobaciones pendientes: resultados/fuentes, vacío, cancelación o sustitución real, error recuperable/timeout real y citas `lang=es` en interfaz EN. No repetir montaje, teclado/foco, Lectura, móvil o movimiento reducido ya acreditados salvo regresión concreta.

No se afirma acceso público, corpus inglés, voz, inferencia conversacional ni cierre global. A5-HTTP-ACTION-01 sigue referida al borrador histórico R03; la evidencia nueva de R04 se registra separadamente.

Memoria y control compartidos actualizados por ID; Excel V114 y Memoria V106 originales preservados. `CONTROL_MASTER_SYNC_DELTA.csv` es un delta para sincronizar, no una afirmación de edición del Excel original.
