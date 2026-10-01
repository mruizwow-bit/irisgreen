# MOTOR · A5 · ESTUDIO PROFUNDO R28 · WORKER IPC, MESSAGEPORT Y BACKPRESSURE

Fecha: 01/10/2026
Amplía: R01–R27
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Mensajería entre realms

Fuentes:
- WHATWG HTML Living Standard · structured data / web messaging
  https://html.spec.whatwg.org/multipage/structured-data.html
  https://html.spec.whatwg.org/multipage/web-messaging.html
- MDN · Worker.postMessage()
  https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
- MDN · MessagePort.postMessage()
  https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage

postMessage usa structured clone.

Los mensajes:
- se entregan como eventos;
- no interrumpen una tarea JS que ya está corriendo;
- pueden incluir transferables.

## 2 · Structured clone vs transfer

Clone:
- sender conserva objeto;
- receiver recibe copia lógica.

Transfer:
- ownership pasa al receptor;
- sender ya no puede usar el recurso transferido.

Ejemplos transferables:
- ArrayBuffer;
- MessagePort;
- ImageBitmap;
- OffscreenCanvas;
- Streams transferibles en entornos compatibles.

Regla:
**transfer = cambio de ownership, no optimización transparente.**

## 3 · MessageChannel

Fuente:
- MDN · Channel Messaging API
  https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API

MessageChannel:
- port1;
- port2;
- canal bidireccional dedicado.

Ventaja frente a un bus global:
- scope explícito;
- ownership;
- cierre con port.close();
- puede transferirse a Worker/iframe.

Útil si una instancia necesita un canal privado con un Worker.

## 4 · MessagePort lifecycle

`MessagePort.start()` puede ser necesario cuando se usan listeners por addEventListener en determinados patrones.

`close()`:
- desconecta;
- evita seguir reteniendo canal.

No dejar ports vivos tras destroy.

Conecta R03/R06 lifecycle.

## 5 · DataCloneError

postMessage puede fallar si:
- payload contiene Function;
- DOM node;
- transferable duplicado;
- objeto no cloneable.

Worker protocol debe validar/limitar payload antes de cruzar boundary.

No mandar state arbitrario “porque structuredClone acepta muchas cosas”.

## 6 · Agent clusters y SharedArrayBuffer

WHATWG/MDN:
contextos en agent clusters distintos no pueden compartir SharedArrayBuffer por postMessage.

Service Worker además no comparte agent cluster con cliente.

Regla:
no diseñar IPC suponiendo shared memory universal.

## 7 · Backpressure no viene gratis con postMessage

postMessage no ofrece por sí mismo:
- credit;
- queue length contract;
- slow consumer signal.

Si producer > consumer:
la cola puede crecer.

Especialmente peligroso en:
- pointermove;
- resize;
- sensor-like updates;
- render state snapshots.

## 8 · Práctica de backpressure ejecutada

Modelo:
producer = 1000 updates.
consumer = 1 cada 10 ticks.

### Naive queue
```text
produced: 1000
consumed: 100
remaining: 900
max queue: 900
```

PASS:
demuestra crecimiento de backlog.

### Latest-state coalescing
Cada update sustituye al pendiente anterior.

```text
max queue: 1
```

PASS.

### Credit window
Máximo 4 mensajes en vuelo.

```text
max inflight: 4
```

PASS.

Resultado:
**3/3 IPC backpressure properties PASS.**

## 9 · Elegir política por semántica

### Latest wins
Adecuado:
- cursor position;
- resize size;
- current preference;
- render snapshot.

No adecuado:
- strokes;
- commands;
- transactions;
- audit events.

### Queue every event
Adecuado cuando cada evento importa.

Debe tener:
- bounded queue;
- batching;
- flow control.

### Credit/ack
Consumer confirma:
“puedo aceptar otro”.

Útil para:
- expensive processing;
- frame pipelines;
- chunk streams.

## 10 · Sequence numbers

Mensaje:
```js
{protocol:1, seq:42, type:"resize", payload:{...}}
```

Receiver puede:
- ignorar stale seq;
- detectar gap;
- ordenar si contrato lo exige.

No asumir que seq arregla semantic races automáticamente.

## 11 · Request/response IDs

R42 actual:
```text
id → pending Promise
postMessage({id,type,payload})
worker → {id,result|error}
```

Patrón positivo para RPC simple.

## 12 · Auditoría R42

`assets/ig-taller-r42-platform.js`:
- `seq`;
- pending Map;
- unique id;
- reject pending on worker.onerror;
- delete pending on result.

`assets/workers/ig-taller-r42-worker.js`:
- echoes id;
- returns result/error;
- ImageBitmap transfer.

Buen patrón base.

## 13 · Gap actual potencial

No existe límite explícito de pending tasks.

Hoy workload es pequeño:
- life-step;
- preview.

Si futuro motor empieza a emitir:
- pointer move tasks;
- many previews;
- simulation snapshots

podría crecer pending Map/worker queue.

Regla:
antes de high-frequency IPC:
definir backpressure.

## 14 · Cancellation over IPC

AbortSignal no cruza automáticamente como capacidad de cancelar la tarea remota.

Patrón:
```text
start {id}
cancel {id}
```

Worker mantiene registry de jobs cancelables.

O:
task small enough → finish + ownership invalidation.

No inventar cancellation protocol si workload no lo necesita.

## 15 · Streams API

Fuentes:
- MDN · Streams API concepts
  https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts
- MDN · WritableStream
  https://developer.mozilla.org/en-US/docs/Web/API/WritableStream
- MDN · TransformStream
  https://developer.mozilla.org/en-US/docs/Web/API/TransformStream

Streams incluyen backpressure.

Consumer lento reduce desiredSize / presión hacia producer.

Para datos grandes/continuos:
stream puede ser mejor que miles de postMessage independientes.

## 16 · Transferable streams

WritableStream/TransformStream son transferibles en navegadores compatibles.

No convertirlos en requisito sin matriz de compatibilidad.

Uso potencial:
- encode/decode pipeline;
- large export/import;
- media processing.

No necesario para Life/preview actuales.

## 17 · Batching

Para comandos pequeños:
```text
10 messages × 1 item
```
puede ser peor que:
```text
1 message × 10 items
```

Tradeoff:
- latency;
- throughput.

Batch hasta próximo rAF/tick si semántica lo permite.

## 18 · Transfer cost

ArrayBuffer:
transfer evita copia de backing store.

Pero sender queda detached.

Antes de transfer:
- no habrá lectura posterior;
- ownership documentado.

Para shared read-only config:
clone pequeño puede ser más sencillo.

## 19 · MessageChannel per instance

Si Taller futuro monta múltiples motores:
cada instancia puede tener:
- dedicated Worker;
- or shared Worker + MessagePort per instance.

Tradeoff:
- memory;
- isolation;
- scheduling;
- failure blast radius.

No decidir sin workload.

## 20 · Error protocol

No enviar solo:
`{error:"failed"}`.

Mejor:
```js
{
  id,
  ok:false,
  error:{
    code:"WORKER_TASK_FAILED",
    retryable:false
  }
}
```

No serializar stack/datos sensibles a consumer no confiable.

## 21 · Protocol version

Worker bundle viejo/nuevo puede coexistir durante lazy load/cache.

Mensaje:
`protocol: 1`.

Unknown protocol:
- reject cleanly;
- fallback;
- no guess.

## 22 · Heartbeats

No añadir heartbeat a Worker local solo “por observabilidad”.

Worker local normalmente falla por:
- error event;
- messageerror;
- timeout de task.

Heartbeat añade ruido/CPU.

Usarlo solo si long-running protocol necesita liveness.

## 23 · Timeout

Task RPC puede usar:
- local AbortSignal.timeout;
- ownership invalidation.

Timeout no mata necesariamente compute remoto.

Si compute caro:
enviar cancel.

## 24 · Security

Window.postMessage cross-origin:
- targetOrigin exacto;
- validar event.origin;
- validar schema.

En Worker same-origin:
sigue validando protocol/type.

No usar `*` salvo razón explícita.

## 25 · Testing matrix

### Throughput
producer 1×/10×/100× consumer.

### Ordering
seq monotonic.

### Stale
late response after cancel.

### Worker crash
pending rejected.

### DataCloneError
Function/DOM rejected.

### Transfer
sender detached after transfer.

### Destroy
port.close / worker terminate.

### Protocol
unknown version rejected.

## 26 · Estado R28

Práctica:
**3/3 PASS**:
- naive backlog grows;
- latest-state coalescing bounded to 1;
- credit window bounded to 4.

Auditoría:
- R42 request/response IDs: positivo;
- pending Map sin backpressure: aceptable en workload actual, riesgo futuro si sube frecuencia;
- ImageBitmap transfer ownership: revisado.

Marcador:
`MOTOR_WORKER_IPC_BACKPRESSURE_STUDIED_R28`

No:
- MessageChannel product integration;
- stream protocol;
- worker protocol change;
- build;
- merge;
- deploy;
- main/production.
