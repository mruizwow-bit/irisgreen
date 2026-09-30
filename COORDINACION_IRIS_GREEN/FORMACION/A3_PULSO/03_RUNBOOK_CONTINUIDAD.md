# PULSO · A3 · RUNBOOK DE CONTINUIDAD ENTRE CHATS

Fecha: 30/09/2026

Objetivo: que un Pulso nuevo recupere identidad, estado técnico y criterio sin depender del chat anterior.

## 1 · Primeros 15 minutos

### Paso 1 · Recuperar identidad

Leer:
1. COORDINACION_IRIS_GREEN/FORMACION/A3_PULSO/00_IDENTIDAD_Y_PUESTO.md
2. COORDINACION_IRIS_GREEN/FORMACION/A3_PULSO/APRENDIZAJE_PULSO_2026-09-30.md
3. COORDINACION_IRIS_GREEN/FORMACION/A3_PULSO/01_PLAN_FORMACION.md
4. COORDINACION_IRIS_GREEN/FORMACION/A3_PULSO/02_PRACTICAS_Y_EVIDENCIA.md
5. este runbook.

Confirmar:
- alias = Pulso;
- agente = A3;
- puesto = Conversational Systems Integration & Runtime Engineer;
- área = Producto & Tecnología;
- jefatura vigente;
- fronteras con Córtex, Nube, Vigía, Eco, Vector y Motor.

### Paso 2 · Recuperar coordinación vigente

Leer:
- organigrama vigente;
- EQUIPO_NOMBRES_PUESTOS vigente;
- PROTOCOLO_NUEVO_CHAT vigente;
- último estado/aprendizaje de Aura;
- último estado de Nexo cuando exista;
- issue/orden concreta.

No usar una memoria del chat como fuente canónica si GitHub contiene una versión posterior.

### Paso 3 · Resolver estado real del trabajo

Antes de tocar código:
1. localizar repositorio correcto;
2. localizar issue;
3. localizar branch;
4. resolver HEAD real;
5. leer último delta/control;
6. comprobar qué está en producción, preview, candidate o HOLD;
7. comparar con el SHA registrado en el último handoff.

Si hay divergencia:
**RECONCILIAR ANTES DE ESCRIBIR.**

## 2 · Preguntas antes de modificar runtime

1. ¿Cuál es la conducta exacta solicitada?
2. ¿Qué parte pertenece a Pulso y cuál a otro especialista?
3. ¿Cuál es el estado de sesión actual?
4. ¿Cuál es el lifecycle del turno?
5. ¿Qué transporte existe?
6. ¿Hay proveedor remoto o sigue local-first?
7. ¿Qué pasa al cancelar?
8. ¿Qué pasa si llegan eventos duplicados?
9. ¿Qué pasa si llegan fuera de orden?
10. ¿Qué pasa si el usuario envía otro turno antes de terminar?
11. ¿Qué pasa con reload/offline/multi-tab?
12. ¿Hay tool calls con efectos?
13. ¿Cómo se evita duplicarlos?
14. ¿Qué datos se registran?
15. ¿Qué necesita lector de pantalla/baja intensidad?
16. ¿Cuál es el test de fallo más peligroso?
17. ¿Cuál es el rollback?

Si una respuesta crítica es desconocida: inspeccionar antes de implementar.

## 3 · Modelo operativo de turno

Todo turno debe tener:
- turn_id;
- estado;
- owner/lifecycle claro;
- timestamp de inicio;
- correlation IDs necesarios;
- política de cancelación;
- estado terminal.

Estados de referencia:
- idle;
- preparing;
- streaming;
- tool_wait;
- tool_running;
- completed;
- cancelled;
- incomplete;
- failed.

No todos son obligatorios en cada implementación. La regla es que las transiciones sean explícitas y testeables.

## 4 · Contrato de eventos

Antes de integrar un stream remoto:
- definir schema interno;
- versionarlo;
- validar payloads;
- definir unknown-event behavior;
- definir deduplicación;
- definir ordering;
- definir terminal events;
- definir error envelope.

Nunca propagar eventos específicos de proveedor directamente por toda la aplicación.

## 5 · Elección de transporte

### SSE / HTTP streaming
Preferir cuando:
- flujo principal es servidor -> cliente;
- simplicidad importa;
- HTTP intermedio/proxies encajan;
- no se necesita canal full-duplex persistente.

### WebSocket
Considerar cuando:
- se necesita comunicación bidireccional persistente;
- múltiples eventos cliente/servidor comparten sesión de baja latencia;
- se puede asumir el coste adicional de seguridad/lifecycle.

No elegir WebSocket solo porque “chat = tiempo real”.

## 6 · Cancelación

Checklist:
- existe AbortController/Signal o mecanismo equivalente;
- UI muestra estado cancelando/cancelado sin dramatizar;
- no aceptar deltas posteriores;
- tool pendiente recibe cancelación si es posible;
- si no es cancelable, resultado tardío no muta el turno;
- recursos se limpian;
- conversación puede continuar.

Test obligatorio:
**cancel -> llega evento tardío -> UI/estado no cambia.**

## 7 · Reintentos

Antes de retry:
- clasificar fallo transitorio/terminal;
- saber si hubo efecto;
- saber si operación es idempotente;
- usar límite;
- backoff;
- jitter;
- evitar retries anidados en varias capas.

Para tools con efectos:
no reintentar automáticamente sin idempotency key o verificación de estado.

## 8 · Concurrencia

Probar:
- doble submit;
- turnos solapados;
- stale callbacks;
- dos tabs;
- reconnect;
- resume;
- out-of-order;
- duplicate event.

Definir quién es el “turno activo” y bajo qué regla puede reemplazarse.

## 9 · Integración de proveedor

Cuando Córtex/arquitectura apruebe proveedor:
1. leer documentación actual;
2. congelar versión/fecha de docs;
3. identificar event model;
4. escribir adapter;
5. mapear eventos -> contrato Sabik;
6. manejar unknown events;
7. validar tool deltas;
8. probar error mid-stream;
9. probar cancel;
10. probar fallback/retry;
11. verificar secreto fuera de cliente.

No cambiar proveedor desde Pulso por iniciativa aislada.

## 10 · Accesibilidad runtime

Checklist:
- status separado de contenido;
- role/status o mecanismo adecuado;
- live region no saturada;
- no mover foco por streaming;
- aria-busy cuando tenga sentido;
- keyboard;
- “Parar” accesible;
- reduced motion;
- baja intensidad;
- mensajes de error claros;
- no interrupciones innecesarias.

Coordinar criterio formal con Axioma.

## 11 · Privacidad y observabilidad

Pulso puede proponer eventos técnicos.
Vigía valida observabilidad/evidencia.

Registrar preferentemente:
- IDs técnicos;
- timings;
- clases de estado/error;
- retry/reconnect;
- provider metadata mínima.

No registrar por defecto:
- prompts;
- respuestas;
- datos de salud;
- secretos;
- contenido sensible.

## 12 · Pruebas mínimas antes de entregar

- unit tests de máquina de estados;
- contract tests de eventos;
- stream normal;
- stream parcial;
- malformed;
- unknown;
- duplicate;
- out-of-order;
- cancel;
- stale;
- timeout;
- retry;
- tool failure;
- tool duplicate;
- accessibility interaction;
- no persistencia indebida;
- no external call accidental cuando el modo sea local-first.

## 13 · Evidencia mínima de entrega

Registrar:
- repo;
- issue;
- branch;
- base SHA;
- final SHA;
- archivos;
- comportamiento anterior;
- comportamiento nuevo;
- contrato/event schema;
- tests;
- fallos simulados;
- privacidad;
- accesibilidad;
- observabilidad;
- integración/deploy sí/no;
- blockers;
- rollback;
- qué NO se tocó.

## 14 · Handoffs

### A Córtex
Enviar:
- necesidades runtime del provider/model;
- event adapter contract;
- tool lifecycle constraints;
- errores/latencia observados.

### A Vigía
Enviar:
- eventos técnicos propuestos;
- campos;
- cardinalidad;
- redacción;
- necesidades de tracing.

### A Eco
Enviar:
- lifecycle de voz/audio;
- estados start/stop/cancel;
- sincronización con turno.

### A Vector
Enviar:
- archivos;
- contratos;
- tests;
- build assumptions;
- runtime config;
- rollback.

### A Motor/Astra
Escalar:
- interacción transversal;
- impactos de runtime general;
- arquitectura o gate.

## 15 · Slack vs GitHub

**Slack**
- coordinación rápida;
- preguntas;
- handoffs;
- disponibilidad;
- avisos de bloqueo.

**GitHub**
- decisiones;
- formación;
- estados;
- evidencia;
- contratos;
- issues;
- commits;
- artefactos canónicos.

No dejar una decisión durable solo en Slack.

Claude y sus agentes externos no entran en Slack interno por defecto.

## 16 · Cierre de chat

Antes de cerrar:
1. actualizar APRENDIZAJE_PULSO_<fecha>.md;
2. registrar última branch/SHA;
3. registrar issue;
4. registrar blockers;
5. registrar siguiente acción;
6. dejar evidencia de pruebas;
7. actualizar delta de control si procede;
8. avisar en Slack si afecta al equipo.

El siguiente Pulso debe poder comenzar sin pedir a María que reconstruya el contexto.

## Frase operativa

**Un chat fiable no es el que responde cuando todo sale bien; es el que conserva un estado correcto cuando la red, el proveedor, una herramienta o el propio usuario interrumpen el flujo.**
