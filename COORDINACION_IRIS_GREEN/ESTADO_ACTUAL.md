# Estado operativo compartido

Fecha del registro: 24/09/2026. Este registro distingue evidencia recibida, código, despliegue y aceptación. No acredita recepción de órdenes por otros agentes sin acuse.

| Línea | Última evidencia de partida | Estado y límite | Responsable |
|---|---|---|---|
| Web Iris Green | María confirma que está subiendo e integrando con el agente 2 | Trabajo activo de María; no sustituir su rama ni desplegar encima | María + agente 2 |
| Design / recursos | María dirige adaptación a la web existente | No reasignar; excluir los 130 juegos antiguos; ES/EN y marca en composiciones | María + Design |
| Motion R37 | c23abd9a3ef082a6ed646b03334fe9031b17af15; deploy 6ab4beac4267a5275ff2feb5 | Candidato montado; no equivale a aceptación visual de María | Codex; revisión de María |
| Biblioteca R38 | ddd12ed4e002812f5c53e24618c029be9faf9e00; deploy 6ab4c1a15435b93043ab3f6d | Motor y almacenamiento de referencia; preservar corpus | Codex |
| Adaptador R39 | 92f24c8c89e8d429a6936efd962ee3f5dad936f0; tree b2f16866493e611fcd5a6fb84b4f18ced0337d6b | Código entregado; el ZIP declara R39_deployed=false. No reconstruir validación/citas/loader. Revalidar HEAD real antes de escribir | Codex |
| HTTP protegido | Entrega R38/R39: 401 HTML anterior a respuesta de aplicación | Ejecución HTTP autenticada no demostrada; no desactivar Team Login | Codex + agente 5 |
| Retención C17 | Sin evidencia suficiente de configuración/retención aplicada en plataforma | Pendiente; ausencia de logs propios no demuestra retención de la plataforma | Agente 4 |
| Voz | Trabajo local de voz propia de María | No activada; no bloquea R39; ninguna grabación privada en Git | Agente 6 |

## Hecho: no volver a construir

R39 ya contiene adaptador, validación de solicitudes, comprobación de citas, errores sanitizados y composición de servidor sobre R38 en `cloud/n04-r38-library/`. No crear una segunda biblioteca `cloud/n04-r39-retrieval/`. La prueba local, una lectura directa de Blobs y la ejecución de la Function vía HTTP son evidencias distintas.

## Ayuda asignada, pendiente de acuse individual

- Agente 1: agrupar fuentes por URL manteniendo fragmentos/citas y orden; no cambiar ranking.
- Agente 3: componente de resultados compatible con el Sabik existente, sin otra página ni secretos del servidor en cliente.
- Agente 4: cancelación y timeout por solicitud, sin afectar la carga compartida; evidencia concreta C17.
- Agente 5: conectar R39 a la Function real y comprobar empaquetado/runtime; preparar un candidato Cloud integrado bajo Codex.
- Agente 6: mantener la preparación local de voz y entregar contrato/paquete, sin activación.
- Agente 7: una recepción de entregas, propietarios de archivos, comprobación de colisiones y sincronización por ID; sin nueva auditoría global.

## Límites que continúan

No apertura pública, main merge, cambio de DNS, activación de `/api/chat`, proveedor, embeddings ni voz. Corpus español N04: 4.332 fragmentos e IDs; SHA-256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`. Mantenerlo inmutable; no afirmar que contiene inglés.

## Cómo actualizar

El responsable añade a la entrega: orden, base/HEAD reales, archivos, pruebas y evidencia, ES/EN afectados, resultado y bloqueo concreto. Agente 7 consolida estado; Codex confirma integración Cloud; María/agente 2 confirman la web. No escribir EN_CONSTRUCCION por el solo hecho de emitir una orden. No escribir TERMINADO por un build o READY de plataforma.
