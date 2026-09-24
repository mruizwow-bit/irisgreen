# R39 R04 · conexión preparada; activación pendiente

Código: `codex/n04-retrieval-r39-20260924@e8a8e9579b64ffbe288e2a85889dbe687210554b`. Base R03 `3131d55020057c55567a3457900afc888876de5d` conservada. Nueve archivos de incremento: transporte cliente, conexión Cloud, wrapper de la Function, build, contrato y pruebas. Motor, lectura de body, A1, puente y panel R03 sin cambios.

## Entrega comprobada

- 256/256 pruebas en Node22.16.0 y 256/256 en Node24.19.0: 227 previas y 29 nuevas. Composición local del transporte con corpus real y handler R03, citas y agrupaciones exactas; cancelación por consumidor, timeout, origen/ventana/nonce, límites de body y respuesta, rechazo de login HTML y ausencia de credenciales en mensajes.
- Build Cloud sobre HEAD limpio; dos ZIP portables auditados, dependencias del lock sin enlaces simbólicos ni corpus incluido. Smoke del ZIP extraído con Node24: entrada desactivada, documento ES/EN y delegación de error de versión con procedencia correcta. Cero llamadas de red en ese smoke.
- Build histórico del sitio PASS y regresión page-v7 28/28. Alcance histórico: sus referencias a anillos NO validan el master nuevo ni se entregan a A2; no hay cambio visual ni restauración del prototipo antiguo.
- A2 confirmó `main@117a53a01bf254054f759e7e08eb06ba06f00d00` en #237, comentario 5814404116; referencia remota coincide. Parche de cuatro adiciones probado en índice aislado y contenido verificado byte a byte. No se modifica ninguna página, rama ni despliegue A2. Puente/A1 compilado y panel reutilizados exactamente desde R03.

## Frontera de acceso

Iris Green es la web pública. `sabik-asistente` es Cloud privado con Team Login. A2 confirma que su web no contiene un endpoint o sesión de consumo Sabik existente. En el navegador actual se ha abierto legítimamente el borrador R03 `6ab504fbf5d403147f6de213`; se ve «Biblioteca N04 · diagnóstico privado» y el distintivo Private. Esto acredita acceso a la página, **no una POST HTTP JSON**. No se exportó cookie ni se repitió la sonda 401.

La propuesta utiliza una ventana explícita del Cloud protegido y MessageChannel con origen y ventana exactos. Desde Cloud, una POST del mismo origen llega a `/internal/n04/team/search`; el servidor reutiliza la clave QA existente para invocar el handler R03. Ninguna credencial se entrega al cliente. La entrada queda desactivada por defecto y rechaza otro sitio, producción, despliegue publicado y CSRF. La sesión de equipo es la autenticación real; las comprobaciones de Origin no se presentan como autenticación.

**Requisito único de activación:** autorización específica de María para habilitar la nueva entrada privada de lectura en un borrador incremental de sabik-asistente, con Team Login conservado en todos los contextos, secreto QA existente sólo en servidor y origen exacto del borrador A2 en una lista permitida. No cambia la protección del sitio, producción ni el acceso de visitantes. La orden R04, punto 4, lo exige para un «proxy/endpoint no contemplado por la arquitectura vigente». El código y su paquete están listos para revisar antes de solicitar esa activación.

No se ha hecho ese despliegue ni se han cambiado variables o secretos. La biblioteca R38 `6ab4c1a15435b93043ab3f6d` permanece sellada: 4.332 fragmentos, versión `n04-es-20260916-56f72c4d3959`, SHA256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`. C17 conserva su cierre acotado; voz e inferencia permanecen fuera.

## Estados separados

| Estado | Evidencia actual |
|---|---|
| IMPLEMENTADO | LOCAL, probado y empaquetado; activación pendiente |
| HTTP_AUTORIZADO_VERIFICADO | PENDIENTE. Acceso de equipo a la página sí; POST JSON remota no. A5-HTTP-ACTION-01 sobre R03 sigue identificada |
| TRANSPORTE_REAL_VERIFICADO | PENDIENTE autorización y ejecución contra Cloud; las ventanas de las pruebas son simuladas |
| MONTADO_VERIFICADO_ES_EN | PENDIENTE A2 y comprobación A3; delta entregado, no montaje atribuido |

## Handoff mínimo

`A2_DELTA/CHANGES.patch` añade sólo `sabik/retrieval-bridge.browser.mjs`, `sabik/retrieval-panel.js`, `sabik/authorized-transport.mjs` y `sabik/AUTHORIZED_TRANSPORT_R04.md`. Incluye hashes y base. Si main avanza, repetir apply --check sin retroceder. A2 conserva el montaje, masters, Newsreader/Atkinson, navegación, Lectura, cabecera y pie; no copiar la web histórica de Cloud. Servir .mjs como JavaScript. No configurar aún un origen Cloud como conectado.

La propuesta privada no resuelve acceso de visitantes públicos; ese contrato no existía en la base consultada. No se declara Sabik público terminado, corpus EN ni certificación global. La UI nueva técnica contiene ES/EN; las citas conservan ES. No audio, PDF, braille o nuevos recursos visuales producidos.

Memoria y control operativos actualizados por ID en la carpeta canónica. Excel original V114 y Memoria original V106 preservados; `CONTROL_MASTER_SYNC_DELTA.csv` permite sincronización sin afirmar que se haya editado el Excel original.
