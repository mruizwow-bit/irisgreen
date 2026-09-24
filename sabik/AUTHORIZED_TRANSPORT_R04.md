# R04 · Conexión privada de equipo, activación autorizada

Base preservada: R03 `3131d55020057c55567a3457900afc888876de5d`. No cambia el motor, el agrupador A1, el puente ni el panel. La biblioteca R38 y sus citas ES permanecen intactas.

## Qué está construido

`createAuthorizedTransport({cloudOrigin})` devuelve `transport(request,{signal})`, `connect(language)` y `disconnect()`. El transporte devuelve una `Response` para el puente R03. El control existente abre explícitamente una ventana de conexión del Cloud privado; Netlify autentica allí al equipo con su sesión existente. Las ventanas intercambian solamente consulta, cancelación y respuesta mediante un MessageChannel, con origen y WindowProxy exactos, versión y nonce.

La ventana Cloud hace POST del mismo origen a `/internal/n04/team/search`. La Function incorpora en servidor la clave QA existente e invoca el handler R03 sin alterar búsqueda, límites, biblioteca, agrupación ni puntuaciones. No se envía esa clave al navegador. La cookie de Netlify no se lee ni se exporta; el navegador la gestiona exclusivamente para su origen.

Esto es una conexión privada de equipo para comprobar el montaje. **No es la autenticación de visitantes públicos ni hace público Sabik.** La web Iris Green continúa siendo pública. No se presenta la sesión de mantenimiento como autenticación. El servicio público requiere decidir su acceso de consumo por separado; este cambio no activa inferencia, voz ni chat.

## Autorización de activación

María ha autorizado esta activación, registrada en #237, comentario 5819519824, y en la cabecera de la orden R04. Se habilita exclusivamente esta entrada de lectura en un borrador incremental de `sabik-asistente`, manteniendo Team Login para todos los contextos y la clave QA existente sólo en servidor. No crea secretos ni cambia producción. La evidencia de ejecución se registra separadamente de la autorización.

Configuración de ese único borrador:

- `N04_TEAM_TRANSPORT_ENABLED=true`, ausente por defecto (cierre con 503).
- `N04_WEB_ALLOWED_ORIGIN`: origen HTTPS exacto confirmado por A2, permalink `24hex--irisgreen-home.netlify.app` o alias `deploy-preview-N--irisgreen-home.netlify.app`, sin comodines. El alias exacto evita el ciclo de configuración entre dos permalinks nuevos; no permite otros orígenes de esa PR ni de otro proyecto.
- `N04_SMOKE_TOKEN`: secreto existente, por el canal local seguro; nunca en archivos ni conversación.
- Verificar mediante API que Team Login sigue requerido en todos los contextos antes de habilitar. La Function rechaza otro sitio, contexto distinto de deploy-preview y cualquier despliegue publicado. Estas condiciones y los controles CSRF **no sustituyen** la autenticación de Netlify.

Sólo admite consultas de lectura, cuerpo máximo 2.048 bytes heredado de R03, hasta cuatro solicitudes simultáneas por conexión, respuesta máxima 65.536 bytes y cabeceras de respuesta permitidas. No hay historial, almacenamiento de consultas, CORS, reintento automático ni log de contenido. En el DOM privado se conserva únicamente el estado HTTP y las cabeceras de procedencia de la solicitud actual, sin consulta, cuerpo ni credenciales; permite verificar HTTP sin exportar la sesión. Cancelar durante el login libera sólo al consumidor; cancelar una consulta aborta su fetch. Una respuesta tardía no se entrega. Cerrar la conexión cancela solicitudes y puertos. El motor mantiene su caché compartida R03.

## Delta para A2

Base confirmada por A2 en #237, comentario 5814404116: `main@117a53a01bf254054f759e7e08eb06ba06f00d00` (Taller e Intereses). No se edita su rama ni se copian páginas desde Cloud. Si la base avanza, A2 comprueba/aplica nuevamente el parche aditivo sobre su nuevo HEAD.

Reutilizar exactamente el bundle `retrieval-bridge.browser.mjs` y `retrieval-panel.js` de R03. Añadir sólo `authorized-transport.mjs` y este contrato a esos dos componentes si aún no están incorporados. El montaje permanece propiedad de A2. No configurar un origen Cloud hasta tener autorización y evidencia remota; no etiquetar fixtures como conectados.

```js
import { createAuthorizedTransport } from './authorized-transport.mjs';
import { createRetrievalQuery } from './retrieval-bridge.browser.mjs';
const connection = createAuthorizedTransport({ cloudOrigin: approvedCloudOrigin });
const query = createRetrievalQuery({ transport: connection.transport, library: sealedLibrary });
const panel = SabikRetrievalPanel.createRetrievalPanel({ root, query, announcement, language });
// En el control existente y por gesto explícito del usuario:
await connection.connect(language); // es/en, sin micrófono ni audio.
await panel.run({ query: userQuery });
// Al salir o cerrar: panel.cancel(); connection.disconnect();
```

Mantener semántica, foco, Lectura, Newsreader/Atkinson y los masters en el montaje actual de A2. El panel R03 ya conserva citas con `lang=es` y estados ES/EN. La pequeña ventana técnica declara acceso limitado al equipo en ambos idiomas. Si falta conexión o se bloquea la ventana, mantener aviso recuperable y alternativa de navegación; no repetir aperturas automáticamente.

## Evidencia y siguiente ejecución

Las pruebas automatizadas componen ventanas simuladas, MessageChannel, Function local, motor, corpus original y puente. Demuestran el contrato y sus límites; **no acreditan HTTP remoto ni sesión real del transporte**.

Tras autorización: declarar HEAD y cambio antes del nuevo borrador; verificar protección del sitio, configurar origen A2 exacto, abrir conexión desde el control real, ejecutar consulta sintética, comprobar JSON/status, cabeceras de código/biblioteca y citas, cancelar y sustituir consulta. Guardar sólo evidencia saneada. A3 comprueba el montaje ES/EN. El antiguo R03 conserva aparte su POST manual pendiente A5-HTTP-ACTION-01; verificar el nuevo relay no sustituye esa evidencia sobre el despliegue antiguo.

Estado de autorización: AUTORIZADA_ACTIVACION_PRIVADA. Consultar la entrega de activación para los resultados HTTP, transporte y montaje; este contrato no los declara verificados por anticipado. No se declara conformidad global de accesibilidad.
