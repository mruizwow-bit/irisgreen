# R04 · Conexión privada de equipo, activación autorizada

Base preservada: R03 `3131d55020057c55567a3457900afc888876de5d`. No cambia el motor, el agrupador A1, el puente ni el panel. La biblioteca R38 y sus citas ES permanecen intactas.

## Qué está construido

`createAuthorizedTransport({cloudOrigin})` devuelve `transport(request,{signal})`, `connect(language)` y `disconnect()`. El transporte devuelve una `Response` para el puente R03. Tras reproducirse en R06 que Team Login deja `window.opener === null`, la conexión deja de depender del popup: el control crea un iframe oculto del Cloud privado. El documento Cloud autenticado usa `window.parent` y `MessageChannel` con origen y WindowProxy exactos, versión y nonce. El iframe sólo puede existir bajo el origen exacto autorizado por `N04_WEB_ALLOWED_ORIGIN`; no se amplía a producción ni a otros previews.

La ventana Cloud hace POST del mismo origen a `/internal/n04/team/search`. La Function incorpora en servidor la clave QA existente e invoca el handler R03 sin alterar búsqueda, límites, biblioteca, agrupación ni puntuaciones. No se envía esa clave al navegador. La cookie de Netlify no se lee ni se exporta; el navegador la gestiona exclusivamente para su origen.

Esto es una conexión privada de equipo para comprobar el montaje. **No es la autenticación de visitantes públicos ni hace público Sabik.** La web Iris Green continúa siendo pública. No se presenta la sesión de mantenimiento como autenticación. El servicio público requiere decidir su acceso de consumo por separado; este cambio no activa inferencia, voz ni chat.

## Autorización de activación

María ha autorizado esta activación, registrada en #237, comentario 5819519824, y en la cabecera de la orden R04. Se habilita exclusivamente esta entrada de lectura en un borrador incremental de `sabik-asistente`, manteniendo Team Login para todos los contextos y la clave QA existente sólo en servidor. No crea secretos ni cambia producción. La evidencia de ejecución se registra separadamente de la autorización.

Configuración de ese único borrador:

- `N04_TEAM_TRANSPORT_ENABLED=true`, ausente por defecto (cierre con 503).
- `N04_WEB_ALLOWED_ORIGIN`: origen HTTPS exacto confirmado por A2, permalink `24hex--irisgreen-home.netlify.app` o alias `deploy-preview-N--irisgreen-home.netlify.app`, sin comodines. El alias exacto evita el ciclo de configuración entre dos permalinks nuevos; no permite otros orígenes de esa PR ni de otro proyecto.
- `N04_SMOKE_TOKEN`: secreto existente, por el canal local seguro; nunca en archivos ni conversación.
- Verificar mediante API que Team Login sigue requerido en todos los contextos antes de habilitar. La Function rechaza otro sitio, contexto distinto de deploy-preview y cualquier despliegue publicado. Estas condiciones y los controles CSRF **no sustituyen** la autenticación de Netlify.

Sólo admite consultas de lectura, cuerpo máximo 2.048 bytes heredado de R03, hasta cuatro solicitudes simultáneas por conexión, respuesta máxima 65.536 bytes y cabeceras de respuesta permitidas. No hay historial, almacenamiento de consultas, CORS, reintento automático ni log de contenido. En el DOM privado se conserva únicamente el estado HTTP y las cabeceras de procedencia de la solicitud actual, sin consulta, cuerpo ni credenciales; permite verificar HTTP sin exportar la sesión. Cancelar durante la conexión libera sólo al consumidor; cancelar una consulta aborta su fetch. Una respuesta tardía no se entrega. `disconnect()` elimina el iframe, cancela solicitudes y cierra puertos. El motor mantiene su caché compartida R03. Si la sesión Team Login ha caducado, el iframe no se convierte en una vía de autenticación alternativa: la conexión falla de forma recuperable y el miembro del equipo debe volver a autenticarse por la vía normal de Netlify.

## Delta para A2

Base confirmada por A2 en #237, comentario 5814404116: `main@117a53a01bf254054f759e7e08eb06ba06f00d00` (Taller e Intereses). No se edita su rama ni se copian páginas desde Cloud. Si la base avanza, A2 comprueba/aplica nuevamente el parche aditivo sobre su nuevo HEAD.

Reutilizar exactamente el bundle `retrieval-bridge.browser.mjs` y `retrieval-panel.js` de R03. Añadir sólo `authorized-transport.mjs` y este contrato a esos dos componentes si aún no están incorporados. El montaje permanece propiedad de A2. No configurar un origen Cloud hasta tener autorización y evidencia remota; no etiquetar fixtures como conectados.

```js
import { createAuthorizedTransport } from './authorized-transport.mjs';
import { createRetrievalQuery } from './retrieval-bridge.browser.mjs';
const connection = createAuthorizedTransport({ cloudOrigin: approvedCloudOrigin });
const query = createRetrievalQuery({ transport: connection.transport, library: sealedLibrary });
const panel = SabikRetrievalPanel.createRetrievalPanel({ root, query, announcement, language });
// En el control existente:
await connection.connect(language); // iframe privado es/en, sin micrófono ni audio.
await panel.run({ query: userQuery });
// Al salir o cerrar: panel.cancel(); connection.disconnect();
```

Mantener semántica, foco, Lectura, Newsreader/Atkinson y los masters en el montaje actual de A2. El panel R03 ya conserva citas con `lang=es` y estados ES/EN. El documento técnico Cloud sigue declarando acceso limitado al equipo en ambos idiomas, aunque en la conexión normal R06 se carga embebido y oculto. Si falta sesión o conexión, mantener aviso recuperable y alternativa de navegación; no abrir popups ni repetir autenticaciones automáticamente.

## Evidencia y siguiente ejecución

Las pruebas automatizadas componen iframe/parent con `opener=null`, MessageChannel, Function local, motor, corpus original y puente. Reproducen el defecto R06 anterior y verifican que el handshake ya no depende de `window.opener`. Demuestran el contrato y sus límites; **no acreditan HTTP remoto ni sesión real del transporte**.

Tras autorización: declarar HEAD y cambio antes del nuevo borrador; verificar protección del sitio, configurar origen A2 exacto, abrir conexión desde el control real, ejecutar consulta sintética, comprobar JSON/status, cabeceras de código/biblioteca y citas, cancelar y sustituir consulta. Guardar sólo evidencia saneada. A3 comprueba el montaje ES/EN. El antiguo R03 conserva aparte su POST manual pendiente A5-HTTP-ACTION-01; verificar el nuevo relay no sustituye esa evidencia sobre el despliegue antiguo.

Estado de autorización: AUTORIZADA_ACTIVACION_PRIVADA. Consultar la entrega de activación para los resultados HTTP, transporte y montaje; este contrato no los declara verificados por anticipado. No se declara conformidad global de accesibilidad.


## Corrección R06 · opener nulo

Reproducción humana autenticada de María el 25/09/2026: desde el alias autorizado de PR #244, la página Cloud final cargó con `N04_WEB_ALLOWED_ORIGIN` correcto y scripts presentes, pero `window.opener === null` en dos intentos consecutivos. El transporte anterior quedó detenido en «Conectando con Iris Green…».

La corrección R06:
- no cambia endpoints, corpus, ranking, secretos ni Team Login;
- sustituye únicamente el enlace popup/opener por iframe/parent;
- elimina `X-Frame-Options: DENY` solo en `/sabik-connect`;
- fija CSP `frame-ancestors` al origen exacto ya validado en servidor;
- mantiene `default-src 'none'`, `script-src 'self'`, `connect-src 'self'`, `base-uri 'none'` y `form-action 'none'`;
- deja el resto del Cloud no embebible por defecto; no añade CORS ni acceso anónimo.

La corrección necesita un único borrador privado nuevo únicamente si la revisión y pruebas de la rama R06 pasan. A2 recibe solo el delta de `sabik/authorized-transport.mjs` sobre su HEAD vigente.
