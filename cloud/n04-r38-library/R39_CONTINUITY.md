# R39 · Continuidad DEC-119 R03

La entrada `n04-library-qa` conserva ruta, autenticación, JSON de entrada `{q, limit?, version?}` y cuerpo de salida R38. Ahora llama a `createSabikRetrievalForDeployment` y al adaptador R39; no se añade otro retrieval ni endpoint. La selección de biblioteca está fijada en `src/cloud-release.mjs`, nunca procede de la petición.

## Ejecución por solicitud

`runRetrievalTask(work, {signal, timeoutMs})` exige un entero positivo de milisegundos (máximo 2147483647). La Function configura **15000 ms en total**, incluyendo lectura del body (máximo 2048 bytes), validación, recuperación y procedencia. El retrieval recibe sólo el tiempo restante. Al terminar, se cancela y libera el reader de esa petición sin esperar al callback subyacente de cancelación; sus rechazos se consumen. Esto acota también un body incompleto o que nunca termina. No se transmite signal al loader compartido: cancelar un consumidor descarta sólo su resultado. La carga puede terminar y servir a otros consumidores. Se limpian listener/timer y se consumen rechazos tardíos. La comprobación monotónica del deadline descarta también resultados de trabajo síncrono que haya impedido ejecutar el timer; no promete interrumpir JavaScript síncrono.

Se mantienen los cuatro códigos públicos del adaptador: `INVALID_RETRIEVAL_QUERY`, `LIBRARY_VERSION_MISMATCH`, `LIBRARY_INTEGRITY_ERROR`, `LIBRARY_UNAVAILABLE`. Los errores internos `REQUEST_CANCELLED`, `REQUEST_TIMEOUT`, `INVALID_EXECUTION_OPTIONS` no cambian el cuerpo HTTP: devuelven 503 `{error:"library_unavailable"}` y una cabecera diagnóstica interna `X-Sabik-Request-Outcome`. No se expone la causa, señal.reason ni consulta. La Function debe estar detrás de Team Login y del token QA existente.

## Procedencia y runtime

- Datos: despliegue sellado `6ab4c1a15435b93043ab3f6d`, versión `n04-es-20260916-56f72c4d3959`. El cuerpo HTTP `build_head` conserva el HEAD del manifiesto R38 y `deploy_id` identifica la Function que atiende.
- Código: `build/code-provenance.json` contiene HEAD/tree limpios, inventario de archivos con SHA256, timeout y biblioteca fijada. Se importa en la Function y queda fuera del directorio estático. `X-Sabik-Code-Head` y `X-Sabik-Library-Deploy` distinguen ambos orígenes.
- El inventario incluye todos los módulos de servidor como conjunto completo; la evidencia del empaquetador identifica aparte el grafo realmente incluido. No se presenta un inventario como prueba de imports.
- Build Node22.16.0; compatibilidad declarada Node22.16.0 y Node24.x. La suite final se ejecuta en ambos runtimes. `NODE_VERSION` no fija el runtime Lambda: debe verificarse éste en los metadatos del candidato. No se cambian variables de sitio para forzarlo.

## Construcción del candidato

1. Confirmar cambios únicamente en este paquete y guardar un commit en la rama R39 existente.
2. Ejecutar `npm test` en ambos runtimes sobre ese SHA. `npm run build` exige el árbol del paquete limpio y genera sólo procedencia del código y el placeholder estático ya existente.
3. Auditar el ZIP de Function y confirmar que contiene R39, execution-policy y procedencia, sin corpus público. Desplegar sólo un borrador en `sabik-asistente`; no usar `--prod` ni cambiar Team Login.
4. Preservar el secreto QA existente: si se necesita transportarlo al borrador, reutilizar exactamente su valor en ámbito de Function de ese deploy; no generar/rotar secretos ni modificar variables del sitio. No incluir credenciales en código, ZIP ni evidencias.
5. No ejecutar `seal:deploy`: es un script histórico de R38, no parte de este incremento. El nuevo código consume el almacén sellado anterior. Conservar ambos despliegues y la rama para rollback; no promover ni eliminar ninguno.

## Comprobaciones y límites

Las suites cubren R38, R39, cancelación/timeout y composición HTTP local con corpus exacto. `probe-retrieval-r39.mjs` prueba lectura remota de Blobs desde Node local; `probe-qa-r39.mjs` comprueba el handler conectado a esa lectura. Ninguno demuestra ejecución HTTP de la Function remota. El empaquetado y el deploy ready tampoco bastan para afirmarla.

La comprobación HTTP autenticada requiere acceso legítimo de equipo y la cabecera QA mediante el procedimiento autorizado. No repetir los accesos previamente denegados, exportar cookies ni desactivar protección. A5 R02 confirma ese límite: no hay nueva prueba HTTP. A4 aporta evidencia de política de retención nativa de Function logs hasta 7 días, aplicable al tipo Serverless Function de este sitio; no prueba borrado físico ni extiende ese plazo a build/deploy, métricas o copias externas. Consultar los informes A4/A5 vigentes en la carpeta documental canónica. No se activa voz, proveedor/modelo, inferencia ni `/api/chat`. La web la integran María y el agente 2.

## Consumo y presentación R03

`sabik/retrieval-bridge.mjs` valida la respuesta de un transporte autorizado inyectado, conserva los nueve campos de cada candidato y llama al `groupSources` A1 aceptado. `sabik/retrieval-panel.js`, recibido de A3 y corregido por Codex con autorización de María, representa los grupos y marca las citas españolas sin mostrar metadatos técnicos como texto público. El contrato, distribución para A2 y límites de transporte están en `sabik/RETRIEVAL_INTEGRATION.md`.
