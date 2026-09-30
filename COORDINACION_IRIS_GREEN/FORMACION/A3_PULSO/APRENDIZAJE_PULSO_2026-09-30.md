# APRENDIZAJE_PULSO_2026-09-30

## Identidad

- **Alias:** Pulso
- **Agente:** A3
- **Puesto profesional:** Conversational Systems Integration & Runtime Engineer
- **En español:** Ingeniero de Integración y Runtime de Sistemas Conversacionales
- **Área:** Producto & Tecnología
- **Jefatura prevista:** Nexo · Continuidad Técnica & Sistemas
- **Marco de coordinación/formación:** Aura
- **Issue general:** #348

## Qué estudié

### 1 · Runtime conversacional real de Sabik/NEA Web

Repositorio:
mruizwow-bit/nea-web-irisgreen

Snapshot estudiado:
35387c6926ac50882d1137a2f936ffd108f6073c

Leí directamente:
- nea-core/session.js
- nea-core/state.js
- nea-core/sabik-state.js
- nea-core/intent.js
- nea-core/response.js
- nea-v1.html
- test-nea-core-v1.js
- test-nea-v1-ui-interaction.js
- INFORME_PROYECTO_NEA_WEB_IRISGREEN.md

Aprendizaje:
Sabik ya contiene un núcleo de runtime importante. No debo empezar desde “chat = array de mensajes”.

La sesión actual conserva:
- necesidad actual;
- declaraciones;
- negaciones;
- correcciones;
- conceptos activos/vetados;
- fragmentos y tipos de respuesta rechazados;
- preferencias;
- estado cognitivo;
- estado de Sabik;
- privacidad de sesión.

El sistema actual también separa riesgo, recuperación de contenido y formulación.

### 2 · Local-first

El informe de NEA Web define:
- privacidad local-first;
- sin API externa por defecto;
- sin clave de modelo en navegador;
- memoria/historial/preferencias locales y controlables;
- v1 sin coste por conversación;
- salida remota futura como fase separada.

Las pruebas actuales verifican que el Core no contiene proveedores externos ni almacenamiento persistente localStorage/sessionStorage/indexedDB.

Aprendizaje:
**Pulso no debe confundir capacidad de integración con permiso de integración.**

### 3 · OpenAI streaming

Fuente:
https://developers.openai.com/api/docs/guides/streaming-responses

Estudiado:
- Responses permite streaming incremental;
- la guía principal usa SSE;
- existe modo WebSocket persistente para escenarios compatibles.

Aprendizaje:
los eventos OpenAI pertenecen al adaptador de proveedor.
No deben convertirse en el vocabulario interno permanente de Sabik.

### 4 · Anthropic streaming

Fuente:
https://platform.claude.com/docs/en/build-with-claude/streaming

Estudiado:
- SSE;
- message_start;
- content_block_start;
- content_block_delta;
- content_block_stop;
- message_delta;
- message_stop;
- ping;
- error;
- input JSON parcial para tool use;
- nuevos tipos de evento pueden aparecer y deben manejarse de forma tolerante.

Aprendizaje:
si el código de dominio asume un set cerrado de eventos del proveedor, queda frágil.

### 5 · Server-Sent Events

Fuente:
WHATWG HTML Living Standard:
https://html.spec.whatwg.org/multipage/server-sent-events.html

Aprendizaje:
EventSource estandariza recepción server -> client sobre text/event-stream.

SSE es una opción natural cuando el flujo es mayoritariamente servidor -> cliente y no se necesita un canal full-duplex persistente.

### 6 · Cancelación

Fuente:
MDN AbortController:
https://developer.mozilla.org/en-US/docs/Web/API/AbortController

Aprendizaje:
AbortController/AbortSignal permite abortar operaciones asíncronas compatibles, incluyendo fetch, consumo de bodies y streams.

Aplicación:
el botón “Parar” futuro debe conectarse a cancelación/invalidación real y no limitarse a borrar UI.

### 7 · Contratos de eventos

Fuentes:
- AsyncAPI 3.1.0:
  https://www.asyncapi.com/docs/reference/specification/v3.1.0
- JSON Schema Draft 2020-12:
  https://json-schema.org/draft/2020-12

Aprendizaje:
un runtime conversacional serio necesita contratos de mensajes versionados, validados y desacoplados del transporte/proveedor.

Envelope de referencia:
- schema_version;
- event_id;
- conversation_id;
- session_id;
- turn_id;
- sequence;
- kind;
- status;
- timestamps;
- correlation;
- payload.

No es todavía especificación aprobada de Sabik; es criterio de diseño para trabajo futuro.

### 8 · Resiliencia

Fuente:
AWS Builders Library · Timeouts, retries and backoff with jitter:
https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/

Aprendizaje:
- fallos parciales son normales;
- retry puede empeorar sobrecarga;
- retry de operaciones con efecto puede duplicar efectos;
- idempotencia es clave;
- backoff limita presión;
- jitter evita oleadas sincronizadas;
- debe existir presupuesto/límite de retry.

### 9 · Seguridad WebSocket

Fuente:
OWASP WebSocket Security Cheat Sheet:
https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html

Aprendizaje:
WebSocket introduce riesgos propios:
- Cross-Site WebSocket Hijacking;
- autenticación/autorización incompletas;
- inyección;
- DoS por conexiones persistentes;
- huecos de monitorización.

Controles relevantes:
- wss;
- Origin validation;
- auth;
- authorization por operación;
- validación de mensajes;
- size/rate limits;
- timeouts/heartbeat;
- logging seguro.

Conclusión:
WebSocket no es una mejora automática sobre SSE. Añade capacidades y también superficie de riesgo.

### 10 · Observabilidad

Fuentes:
- OpenTelemetry Semantic Conventions:
  https://opentelemetry.io/docs/concepts/semantic-conventions/
- Messaging semantic conventions:
  https://opentelemetry.io/docs/specs/semconv/messaging/

Aprendizaje:
usar nombres/atributos consistentes facilita tracing, métricas y logs.

Precaución:
la documentación de messaging consultada aparece como **Development**. No convertirla en obligación estable sin comprobar su estado en el momento de implementación.

Aplicación Pulso:
medir lifecycle técnico sin capturar conversación sensible por defecto.

### 11 · Accesibilidad conversacional

Fuentes:
- WAI-ARIA 1.2:
  https://www.w3.org/TR/wai-aria/
- W3C COGA · Making Content Usable:
  https://www.w3.org/TR/coga-usable/

Aprendizaje:
role=status es una live region para información de estado; en ARIA 1.2 tiene comportamiento polite/atomic implícito.

COGA recomienda reducir/controlar interrupciones y facilitar pausa/control de contenido que distrae.

Precisión:
COGA Making Content Usable es una W3C Working Group Note, orientación complementaria; no equivale por sí sola a criterio obligatorio de conformidad WCAG.

Aplicación:
- no anunciar cada token de un stream a tecnologías de apoyo;
- status separado de la respuesta;
- actualizaciones significativas;
- no mover foco;
- controles de parar/baja intensidad;
- movimiento reducido.

## Lo que entendí sobre mi oficio

Pulso no es “el programador del chat”.

Pulso es responsable de la coherencia temporal y operativa de la conversación.

Eso significa poder responder:
- ¿qué turno está activo?
- ¿qué evento pertenece a qué turno?
- ¿qué pasa si se cancela?
- ¿qué pasa si el proveedor se corta?
- ¿qué pasa si una herramienta tarda?
- ¿qué pasa si el mismo evento llega dos veces?
- ¿qué pasa si llega tarde?
- ¿qué se puede reintentar?
- ¿qué se registra?
- ¿qué queda local?
- ¿cómo se comporta con lector de pantalla?
- ¿cómo vuelve el sistema a un estado válido después de un fallo?

## Decisiones profesionales que adopto

1. **Provider adapter obligatorio** para cualquier proveedor remoto futuro.
2. **Estado de turno explícito**.
3. **IDs y correlación** para conversación/turno/evento.
4. **Cancelación como primitive**.
5. **Eventos tardíos se invalidan**.
6. **Retries limitados + backoff/jitter**.
7. **Tool calls con idempotencia/protección de efectos**.
8. **Schemas versionados y validados**.
9. **Observabilidad sin contenido sensible por defecto**.
10. **Streaming perceptivo accesible**, no token-spam.
11. **Local-first permanece** hasta decisión explícita.
12. **No cambiar proveedor/modelo desde A3**: coordinación con Córtex.

## Qué practiqué

- reconstrucción del Core actual;
- identificación de estado de sesión;
- identificación del lifecycle actual de UI;
- análisis de “Parar”, “Bajar intensidad”, “No es esto”;
- razonamiento de cancelación;
- razonamiento de retry/idempotencia;
- diseño de un envelope de eventos;
- matriz de pruebas de duplicate/out-of-order/stale/cancel;
- separación de fronteras A3/A10/A9/A4/A6/A2/A5.

## Errores/riesgos de criterio que quiero evitar

### Error 1 · “Chat moderno = WebSocket”
Corrección:
elegir transporte por necesidades reales. SSE/HTTP streaming puede ser suficiente y más simple.

### Error 2 · “Si el usuario pulsa cancelar, oculto la respuesta”
Corrección:
cancelar o invalidar el trabajo en toda la cadena.

### Error 3 · “Timeout = no se ejecutó”
Corrección:
un timeout solo dice que no llegó confirmación a tiempo. Para efectos externos, comprobar idempotencia/estado.

### Error 4 · “Provider events = domain events”
Corrección:
adapter estable.

### Error 5 · “Streaming = actualizar cada token en aria-live”
Corrección:
buffer accesible y anuncios significativos.

### Error 6 · “Logs completos ayudan a depurar”
Corrección:
contenido conversacional puede ser altamente sensible; usar minimización y coordinación con Vigía.

### Error 7 · “He estudiado una API, ya puedo conectarla”
Corrección:
formación no es orden de arquitectura. Sabik sigue local-first hasta decisión aprobada.

## Lo que NO está comprobado hoy

- integración real OpenAI en Sabik;
- integración real Anthropic en Sabik;
- WebSocket real;
- SSE remoto real;
- reconnect real;
- backpressure real;
- multi-tab real;
- AbortController dentro del runtime actual;
- tool calls remotos;
- telemetry pipeline;
- load test;
- chaos test;
- producción;
- conformidad/certificación.

## Estado al cerrar

Base canónica de formación:
- Aura Foundation R01: 652400d81c13f86383164ca6d434421ed84cab5d
- Aura ampliación R02 resuelta: 41a01a5534161da5e4b412dd0c6af424e836a53c

Rama Pulso:
pulso/a3-conversational-systems-runtime-foundation-r01-20260930

Snapshot NEA Web estudiado:
35387c6926ac50882d1137a2f936ffd108f6073c

Producto:
no modificado.

Producción:
no modificada.

Formación:
foundation profesional suficiente para comenzar trabajo A3; aprendizaje continuo obligatorio.

## Primeros 15 minutos del siguiente Pulso

1. Leer 00_IDENTIDAD_Y_PUESTO.md.
2. Leer este aprendizaje.
3. Leer 03_RUNBOOK_CONTINUIDAD.md.
4. Leer PROTOCOLO_NUEVO_CHAT vigente.
5. Verificar organigrama y jefatura vigente.
6. Leer último estado de Aura/Nexo.
7. Leer orden/issue de trabajo.
8. Resolver repo y HEAD real.
9. Leer último delta A3.
10. Comparar con SHA registrado.
11. Identificar el lifecycle afectado.
12. Identificar provider/transport si existe.
13. Identificar privacidad/accesibilidad afectada.
14. Ejecutar primero una prueba read-only o mínima.
15. Solo después modificar.

## Frase de trabajo de Pulso

**La conversación debe seguir siendo correcta incluso cuando llega tarde un evento, se corta una conexión, falla una herramienta o la persona decide parar.**
