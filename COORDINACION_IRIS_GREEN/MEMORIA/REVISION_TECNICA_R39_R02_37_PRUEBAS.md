# Revisión técnica de R39 · continuidad R02

Fecha: 24/09/2026. Revisor: Astra. Petición: revisar la implementación entregada por Codex, no limitarse a registrar su informe.

## Veredicto

**R39_R02_REVISADO_TECNICAMENTE_CON_OBSERVACION**.

El incremento está construido y la Function está desplegada. La revisión acotada no identifica motivo para rehacer el adaptador, la biblioteca, la cancelación o el empaquetado. Es un candidato válido para continuar. No equivale a HTTP end-to-end aprobado, C17 cerrado, integración frontend o aceptación global.

Hay una observación reproducida sobre el alcance del timeout: empieza después de leer el cuerpo JSON, no al entrar en el handler. No se trata como fallo del motor ni se presume explotable en Netlify; la exposición real depende de cómo la plataforma entrega el cuerpo a la Function.

## 1. Identidad y alcance comprobados

- Fuente revisada: `66b6b551ad055ea9e367ebdff7246b381f4656d3`.
- Tree: `759b5c0d82a023a81d4aae48c6ab3ced26638d83`.
- Comparación con R39 inicial `92f24c8c89e8d429a6936efd962ee3f5dad936f0`: 2 commits, 16 archivos; todos bajo `cloud/n04-r38-library/`. No hay cambios a la web, Motion ni carpetas de Design en ese incremento.
- Netlify consultado directamente: sitio `sabik-asistente`, ID `47b06e68-ff54-4097-8ad8-336b2d71758a`; deploy `6ab4d5047d3729fae7f122aa`; estado `ready`, contexto `deploy-preview`, `published_at=null`.
- Function remota `n04-library-qa`: ruta `/internal/n04/library/search`, runtime `nodejs24.x`, región `us-east-2`.
- Digest remoto: `5655a261f20b68b91c7a9dbc344ee675468ca4f848b1c83c9a976596573c5073`, coincide con el digest comunicado por Codex. No se ha recalculado el ZIP final: en esta revisión solo consta su ruta Windows, no un archivo final accesible.
- Netlify devuelve `commit_ref=null`, `build_id=null`, `has_source_zip=false`. La atribución del artefacto al código depende del expediente de construcción/procedencia y del digest; esos campos de Netlify no prueban por sí solos el HEAD.

## 2. Código leído y conclusiones

### Conexión real a R39
`netlify/functions/n04-library-qa.mjs` importa `createSabikRetrievalForDeployment`, construye una dependencia reutilizable y la entrega a `createQAHandler`. El handler llama a `retrieveForSabik`. Ya no corresponde encargar esa conexión de nuevo.

### Biblioteca conservada
`src/cloud-release.mjs` fija el deploy de biblioteca R38 `6ab4c1a15435b93043ab3f6d` y el timeout de recuperación de 15000 ms. `sabik-retrieval-server.mjs` no toma el deploy de una consulta del usuario. El lector comparte el índice por despliegue/versión y elimina la promesa fallida de la caché para permitir un intento posterior.

El corpus disponible en el paquete R39 inicial se comprobó de nuevo: 2.553.061 bytes; SHA-256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`. El loader real validó su estructura e identidad. No se ha hecho una nueva lectura remota de Blobs en esta revisión.

### Cancelación y tiempo máximo de recuperación
`runRetrievalTask` separa REQUEST_CANCELLED de REQUEST_TIMEOUT, limpia eventos y temporizadores, consume rechazos tardíos y comprueba el vencimiento al completar trabajo síncrono. No pasa la señal al loader compartido. Cancela el interés del consumidor en el resultado, no afirma detener el I/O ni interrumpir JavaScript síncrono.

### Entrada, errores y citas
El handler comprueba el secreto antes de recuperar, acepta POST JSON sin querystring, limita el cuerpo a 2048 bytes, la consulta a 300 caracteres y el resultado a 1–20. Cierra ante activación de AI. Los errores no devuelven mensajes privados ni stack. El adaptador contrasta ID, URL, texto, versión y metadatos con el fragmento original. Las respuestas se marcan no-store.

### Procedencia y paquete
`build-code-provenance.mjs` inventaría los módulos propios de runtime, entrada, lock y configuración; comprueba fuente limpia y registra HEAD/tree. `build.mjs` genera procedencia de código sin volver a generar el manifiesto del corpus. Es una separación correcta. La comprobación de 46 dependencias, imports y eliminación de junction corresponde al informe de Codex; no se ha repetido aquí el empaquetado portable final.

## 3. Pruebas ejecutadas por Astra

Entorno: **Node 22.16.0**, sin red, sin credenciales y sin cambios al repositorio de producto. No se ha ejecutado Node 24 en esta revisión.

Se reutilizaron únicamente módulos del paquete R39 inicial cuya identidad Git coincide con el SHA revisado. Se copiaron los tres módulos nuevos/modificados desde el conector y se verificaron sus blobs antes de ejecutarlos:

| Archivo | Git blob exacto |
|---|---|
| src/library.mjs | 568fdbb7c91b58ff24bbc50c76311ed56b14b641 |
| src/sabik-retrieval.mjs | 91c0a56665694e37ae23a2b3b51e3f2f74c52f16 |
| src/qa-handler.mjs | 6fc3af3581d6636ececb8e6d18f04d8734383b48 |
| src/execution-policy.mjs | bb33d031317be9bdddadbc56714dfcf4e0e7daa7 |
| src/cloud-release.mjs | 8ac65ecd8405aa71e32cca8ae4601c00139c81b8 |

- **25/25**: suite `tests/library.test.mjs` original, sin modificar, blob `448f8e803b1e269559bc2dd464bfa399ec170ea3` coincidente con el HEAD revisado.
- **12/12**: pruebas adicionales de Astra sobre ejecución, cancelación previa, independencia de consumidores, timeout/rechazo tardío, vencimiento síncrono, limpieza de listeners, errores sanitizados, autenticación, guarda AI, límites de entrada y respuesta con citas del corpus exacto.
- **Total: 37 comprobaciones aprobadas**, distintas de las 157 por runtime reportadas por Codex. No sumar ambas ejecuciones de 157 como casos funcionales diferentes.

SHA-256 de los registros locales:
- library-tests.log: `716c1975ac8f287100eb1db238b373af2e2bdb041d38d2c2725ef9e3bac9a2b6`.
- focused-tests.log: `98c001be1026c7e074ca1fc6df046e9fc67c6fc48a1ba09fd8c632b507788898`.
- body-read-probe.json: `ac89b6da312bb2ac5c5a83593984cd3a651f81c727922d753b8fe50323950a9f`.

## 4. OBS-R39-BODY-01 · límite temporal anterior al retrieval

Localización: `src/qa-handler.mjs`, lectura en línea 41 y comienzo de `runRetrievalTask` en línea 47 del HEAD revisado; `readBoundedJson` líneas 16–27.

Reproducción local sobre el handler exacto: cuerpo ReadableStream sin completar y secreto sintético válido, `timeoutMs=15` ms mediante la dependencia de prueba. Tras 75 ms la promesa seguía pendiente. Tras abortar la señal y esperar otros 40 ms seguía pendiente, con cero llamadas al retrieval. Al completar el cuerpo devolvió 503 con REQUEST_CANCELLED. El periodo observado antes de completar el cuerpo fue aproximadamente 116 ms.

**Interpretación:** existe límite de tamaño, pero la lectura del cuerpo no tiene el plazo/cancelación individual de la fase de recuperación. Esto no contradice que el timeout del retrieval funcione. No se ha probado un bloqueo real de HTTP ni una vulnerabilidad de plataforma.

**Corrección puntual recomendada:** si se ofrece un plazo total por petición, acotar también lectura de cuerpo y reaccionar a cancelación del lector, manteniendo la independencia del loader compartido. Si el contrato es deliberadamente retrieval-only, documentarlo y demostrar el límite que aplica la plataforma al cuerpo antes de declarar timeout integral. No otro motor, otra biblioteca o una serie de drafts idénticos.

## 5. Pendientes que el reporte identifica correctamente

1. **HTTP autorizado y lectura cross-deploy desde la Function.** Las lecturas realizadas por Node local no prueban que la identidad de runtime del deploy R39 pueda leer la biblioteca R38. La respuesta de la aplicación debe contener versión/hash/fuentes y diferenciar deploy de código y de biblioteca. Mantener Team Login y la clave existente; no repetir una sonda conocida como denegada.
2. **C17.** Falta evidencia de retención aplicable en la plataforma. Ausencia de logs propios no acredita ese límite.

No se añaden como fallos de R39 la integración de A1/A3 en frontend, la cobertura documental inglesa o voz: están fuera de este incremento backend. Sí siguen pendientes en sus respectivos alcances. Todo contenido público debe seguir entregándose ES+EN; el corpus sellado actual es ES y no se da por traducido. No hay cambio de normativa, activación de inferencia ni nueva autorización de publicación.

## 6. Acción útil siguiente

Codex conserva R39 R02 y atiende OBS-R39-BODY-01 con un ajuste acotado o una aclaración verificable del contrato. Agente 5 puede apoyar el HTTP autorizado y agente 4 aportar evidencia C17, sin sustituir módulos integrados. A1/A3 siguen como trabajo de presentación sobre la web vigente de María/agente 2. No se cambia el reparto ni se vuelve a encargar lo terminado.

Fuentes: comparación GitHub 92f24c8…66b6b551; archivos del HEAD indicado; lectura directa del deploy con conector Netlify; comentario de entrega https://github.com/mruizwow-bit/irisgreen/issues/237#issuecomment-5810021289; pruebas locales descritas. Esta revisión añade evidencia técnica a la recepción documental anterior; no sobrescribe Memoria V106 ni Excel V114.
