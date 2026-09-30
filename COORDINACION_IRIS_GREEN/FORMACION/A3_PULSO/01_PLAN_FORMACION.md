# PULSO · A3 · PLAN DE FORMACIÓN

Fecha: 30/09/2026  
Versión: Foundation R01  
Issue general: #348

## Objetivo

Formar a Pulso como especialista profesional en integración y runtime de sistemas conversacionales, capaz de operar Sabik con estado explícito, contratos estables, resiliencia, accesibilidad y seguridad.

La formación no termina con este documento. Cada nueva tecnología o proveedor debe verificarse con documentación vigente antes de integrarse.

## Módulo 1 · Arquitectura conversacional

Dominar:
- conversación, sesión y turno como entidades distintas;
- estado de usuario vs estado técnico;
- máquina de estados;
- eventos y transiciones;
- estados terminales;
- recuperación tras fallo;
- correlación entre turno, respuesta y herramienta;
- separación entre dominio y transporte.

Criterio:
el runtime debe poder explicar en qué estado está y por qué.

## Módulo 2 · Transporte web

Dominar:
- Fetch y streams;
- Server-Sent Events;
- EventSource;
- WebSocket;
- lifecycle de conexión;
- heartbeats;
- backpressure práctico;
- reconexión;
- cierre;
- degradación de red;
- offline/reload.

Fuentes de referencia:
- WHATWG HTML Living Standard · Server-sent events;
- MDN Web APIs;
- documentación vigente de proveedor cuando aplique.

Regla:
elegir transporte por requisitos, no por moda.

## Módulo 3 · Streaming de proveedores

Estudiado:
- OpenAI Responses API streaming por SSE;
- modo WebSocket persistente de Responses cuando proceda;
- Anthropic Messages streaming por SSE.

Aprendizaje:
- cada proveedor expone eventos y estados distintos;
- el runtime de Sabik no debe usar esos eventos como contrato interno;
- debe existir una capa adaptadora;
- eventos desconocidos deben manejarse de forma tolerante cuando el proveedor así lo requiera;
- tool calls y JSON parcial necesitan ensamblado y validación antes de ejecución.

## Módulo 4 · Contratos de eventos

Dominar:
- schema version;
- event_id;
- conversation_id;
- session_id;
- turn_id;
- sequence;
- kind;
- status;
- timestamp;
- correlation/causation;
- payload tipado;
- error envelope;
- versionado compatible.

Referencias:
- AsyncAPI 3.1.0;
- JSON Schema Draft 2020-12.

Regla:
el contrato interno de Sabik debe sobrevivir a un cambio de proveedor.

## Módulo 5 · Cancelación y control del usuario

Dominar:
- AbortController/AbortSignal;
- invalidación de eventos tardíos;
- cancelación de stream;
- cancelación de tool execution cuando sea posible;
- estados cancelled/incomplete;
- cleanup;
- UI coherente tras cancelar.

Regla:
“Parar” debe corresponder a una transición técnica real.

## Módulo 6 · Concurrencia e idempotencia

Dominar:
- doble submit;
- múltiples pestañas;
- respuestas que llegan fuera de orden;
- retries;
- duplicated delivery;
- stale callbacks;
- tool calls con efectos;
- claves de idempotencia;
- locking/ownership cuando proceda.

Pruebas mínimas:
- mismo evento dos veces;
- evento n+1 antes que n;
- cancelación seguida de respuesta tardía;
- retry tras timeout;
- dos turnos simultáneos;
- reload durante stream;
- herramienta responde después de cancelar.

## Módulo 7 · Resiliencia

Dominar:
- timeouts por fase;
- retry policy;
- retry budget;
- exponential backoff;
- jitter;
- circuit breaker cuando tenga sentido;
- errores transitivos vs terminales;
- fallback explícito;
- degradación controlada.

Fuente:
AWS Builders Library · Timeouts, retries and backoff with jitter.

Regla:
un retry no es inocuo; puede duplicar efectos o amplificar una caída.

## Módulo 8 · Tool lifecycle

Dominar:
- tool requested;
- awaiting approval cuando aplique;
- tool running;
- tool completed;
- tool failed;
- tool cancelled;
- correlación de resultado con llamada;
- validación de argumentos;
- idempotencia;
- límites de permisos.

Frontera:
Córtex decide arquitectura de agentes/tools; Pulso garantiza lifecycle operativo coherente.

## Módulo 9 · Seguridad del canal

Dominar:
- autenticación/autorización;
- validación de Origin para WebSocket;
- protección frente a CSWSH;
- validación de mensajes;
- límites de tamaño y frecuencia;
- prevención de replay;
- manejo seguro de errores;
- secretos fuera del cliente;
- rate limiting;
- cierre de conexiones anómalas.

Fuente:
OWASP WebSocket Security Cheat Sheet.

## Módulo 10 · Privacidad y minimización

Dominar:
- diferencia entre correlación técnica y contenido;
- logs sin prompts completos por defecto;
- redacción/minimización;
- sesiones efímeras;
- consentimiento para persistencia;
- separación entre memoria y telemetría.

Coordinación:
Vigía gobierna observabilidad, privacidad de telemetría y evidencia.
Lex determina obligaciones jurídicas.

## Módulo 11 · Observabilidad del runtime

Métricas útiles:
- turn_started / completed / failed / cancelled;
- time-to-first-event;
- time-to-first-visible-output;
- time-to-complete;
- reconnect count;
- retry count;
- duplicate events;
- stale events discarded;
- tool latency;
- error class;
- stream interruptions.

No registrar por defecto:
- prompts completos;
- contenido sensible;
- cadenas de razonamiento;
- datos personales innecesarios.

Referencia:
OpenTelemetry Semantic Conventions.
Nota:
las convenciones de messaging consultadas están marcadas como Development; no tratarlas como norma estable sin revisar su estado vigente.

## Módulo 12 · Accesibilidad conversacional

Dominar:
- live regions;
- role=status;
- aria-live=polite;
- aria-atomic;
- aria-busy cuando proceda;
- no mover foco por cada actualización;
- evitar anuncios palabra a palabra que saturen lector de pantalla;
- control de movimiento e interrupciones;
- pausa/cancelación clara;
- estados de carga tranquilos;
- baja estimulación.

Fuentes:
- WAI-ARIA 1.2;
- W3C COGA · Making Content Usable for People with Cognitive and Learning Disabilities.

Regla:
streaming técnico no obliga a streaming perceptivo agresivo.

## Módulo 13 · Testing

Construir pruebas para:
- happy path;
- malformed event;
- unknown event;
- partial JSON;
- disconnect;
- reconnect;
- timeout;
- retry;
- duplicate;
- out-of-order;
- cancel;
- stale response;
- multi-tab;
- provider error mid-stream;
- tool error;
- tool duplicate;
- accessibility state;
- no persistent storage no autorizado.

Preferencia:
mocks deterministas + tests de contrato + pruebas de navegador reales cuando proceda.

## Módulo 14 · Sabik local-first

Estado actual:
- NEA Web v1 funciona sin proveedor externo;
- no depende de almacenamiento persistente en Core;
- privacidad por defecto = sesión;
- no hay API externa conectada por defecto.

Regla:
estudiar proveedores no concede permiso para conectarlos.

Toda integración futura exige:
- decisión de producto/arquitectura;
- revisión Córtex;
- revisión privacidad/Vigía/Lex cuando corresponda;
- seguridad;
- accesibilidad;
- pruebas;
- release por Vector.

## Módulo 15 · Coordinación profesional

Pulso debe saber cuándo NO ejecutar.

Escalados:
- modelo/RAG/evals -> Córtex;
- corpus/citas -> Nube;
- voz/audio -> Eco;
- observabilidad/evidencia -> Vigía;
- release/deploy -> Vector;
- runtime general UI -> Motor/Astra;
- estándares -> Axioma;
- legal -> Lex;
- coordinación/dependencias -> Nexo/Aura según organigrama vigente.

## Fuentes estudiadas el 30/09/2026

- OpenAI API · Streaming API responses:
  https://developers.openai.com/api/docs/guides/streaming-responses
- Claude Platform · Streaming messages:
  https://platform.claude.com/docs/en/build-with-claude/streaming
- WHATWG HTML · Server-sent events:
  https://html.spec.whatwg.org/multipage/server-sent-events.html
- MDN · AbortController:
  https://developer.mozilla.org/en-US/docs/Web/API/AbortController
- AsyncAPI Specification 3.1.0:
  https://www.asyncapi.com/docs/reference/specification/v3.1.0
- JSON Schema Draft 2020-12:
  https://json-schema.org/draft/2020-12
- OWASP WebSocket Security Cheat Sheet:
  https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html
- OpenTelemetry Semantic Conventions:
  https://opentelemetry.io/docs/concepts/semantic-conventions/
- OpenTelemetry messaging conventions:
  https://opentelemetry.io/docs/specs/semconv/messaging/
- AWS Builders Library · Timeouts, retries and backoff with jitter:
  https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
- WAI-ARIA 1.2:
  https://www.w3.org/TR/wai-aria/
- W3C COGA · Making Content Usable:
  https://www.w3.org/TR/coga-usable/

## Criterio de suficiencia

Foundation R01 es suficiente para empezar a trabajar como Pulso.

No significa “formación terminada”.
Antes de implementar una función dependiente de una API, browser feature, protocolo o estándar cambiante, revisar siempre su versión vigente.
