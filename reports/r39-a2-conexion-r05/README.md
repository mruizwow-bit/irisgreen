# R39-A2-CONEXION-R05 · Aplicación exacta al montaje vigente

Responsable: A2, por continuidad de María («retomalo») y orden vigente recuperada en coordinación #237. Fecha: 25/09/2026.

## Procedencia y alcance

Orden: `COORDINACION_IRIS_GREEN/ORDENES/R39_CONEXION_REAL_R05/01_AGENTE_2.md`, blob b5b41480d986fb4bebcf1d9eae8bf32e01f34852. Requisitos operativos ES/EN leídos: blob 77a011c1770ac7a7a0940a20c1c0f9dbaf6adbbd.

Base actual: 7b49e95f25318e9e936cf54e959948c6781c1c73, rama agent2/sabik-iris-r08-20260924, PR #244. Se conservan todas las subidas posteriores a d525843. Parche autorizado: `A2_CONNECT.patch`, Git blob a1e5dc958ebaa49e692b61849eea4467063ff2b8, SHA-256 52f4a01fa67d8bdab0ac42ef03940a6eea6ae37c83663171493a916b227e76ce.

Los tres blobs de la base fueron recuperados y verificados antes de ejecutar git apply --check y git apply; ambos exit 0. La hidratación local contiene esos tres archivos exactos, no un checkout/build completo. La representación reconstruida del parche se aceptó solo después de coincidir byte a byte por Git blob con el original recuperado. Comprobación de sintaxis Node correcta.

Delta funcional EXACTO de tres archivos:
- sabik/mount-config.mjs: enabled=true y Cloud autorizado https://6ab56a1ba2f6d83e6fb7b408--sabik-asistente.netlify.app.
- sabik/iris-mount.mjs: ayuda pública 300 caracteres en ES/EN.
- sabik/iris-panel.html: maxlength=300 y ayuda inicial coherente.

El transporte, biblioteca sellada, corpus/citas ES, agrupador, panel de resultados, Motion, masters, voz, secretos, main y producción permanecen sin modificar. No se crea otro Cloud, login, panel ni transporte. No se realizan sondas de acceso ni consultas fingidas.

## Prueba acotada y construcción

Se adapta únicamente la prueba existente scripts/test_iris_brief_r08.py a la activación autorizada. Dentro de sus cuatro casos de portada ES/EN a 1440/320 se comprueban el estado disponible, etiqueta accesible, ayuda exacta y maxlength=300, límite aplicado a pulsaciones nativas, botón deshabilitado al estar vacío y habilitado con texto, Tab hacia Enviar y restablecimiento con teclado/foco. Se conservan las pruebas de Lectura, reduced motion, reflujo e integridad de masters. Se exige cero consultas automáticas al Cloud antes de una acción de envío.

Estos casos no envían ninguna consulta y el resultado registra expresamente query_submitted=false y http_retrieval_verified=false. No prueban resultados/fuentes HTTP ni equivalen a aceptación de la conexión real. El build y el resultado de Actions deben leerse en el commit que contiene esta entrega; se registran en PR #244 y en el acuse #237, comentario 5826899869, junto al único preview de conexión.

Advertencia de registro: apply_iris_brief_r08.py conserva una clave histórica de informe con valor fijo sabik_transport_enabled=false. No se modifica ese generador en esta orden. No usar ese literal como prueba del estado: el archivo mount-config generado se compara con el origen y la UI se comprueba en navegador.

## Evidencia anterior conservada

Antes de activar, la corrección acotada R23 quedó validada en 7b49e95: run 36095235096 SUCCESS (construcción, montaje representativo, Recursos, cabeceras/visores y Taller). R23 no cambió el producto y no supone certificación global. Ver reports/web-r23/.

## Preview y handoff

Único origen web autorizado: https://deploy-preview-244--irisgreen-home.netlify.app. ES: /; EN: /?lang=en. El bot de Netlify y el resultado del build del commit acreditarán el deploy ID; no se inventa en este informe.

Tras publicar HEAD/deploy/origen, A3 conserva sus cinco casos reales pendientes y Codex la correlación HTTP. No se declara MONTADO_CONECTADO_REAL solo por enabled=true o un deploy READY. Tampoco se declaran cerrados C17, almacenamiento/CSP, contraste complejo manual, los dos recorridos largos de foco ni validación con ayudas técnicas/usuarios.

Aplicabilidad normativa de este delta: texto público ES+EN, semántica/teclado/foco/reflujo y respeto de Lectura/movimiento. No cambia requisitos normativos ni se afirma conformidad WCAG/EN/ISO, PDF/UA o braille.
