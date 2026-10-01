# MOTOR · A5 · ESTUDIO PROFUNDO R09 · STREAMING, BACKPRESSURE Y CARGA INCREMENTAL

Fecha: 01/10/2026
Amplía: R01–R08
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla profesional

Un runtime puede fallar aunque cada operación sea rápida si:
**produce datos más rápido de lo que los consume**.

Síntomas:
- memoria creciente;
- cola interminable;
- UI bloqueada;
- mensajes obsoletos;
- latencia que aumenta con el tiempo.

La solución es backpressure, cancelación, límites y ownership.

## 2 · Streams API

Fuentes:
- MDN · Streams API
  https://developer.mozilla.org/en-US/docs/Web/API/Streams_API
- MDN · Streams API concepts
  https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts

Tipos:
- ReadableStream;
- WritableStream;
- TransformStream.

Backpressure:
el consumidor lento propaga una señal hacia el productor para reducir ritmo.

No es solo “streaming”.
Es control de flujo.

## 3 · desiredSize

En un ReadableStream custom:
`controller.desiredSize`

indica cuánta capacidad queda según la queue strategy.

Regla:
un productor custom no debe ignorar permanentemente un desiredSize negativo.

## 4 · Async iteration

Fuente:
- MDN · ReadableStream
  https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream

Patrón:
```
for await (const chunk of stream) {
  await consume(chunk)
}
```

Al salir normalmente de la iteración:
el stream se cancela por defecto.

Si se necesita conservar:
`stream.values({preventCancel:true})`.

Motor debe decidir explícitamente la semántica.

## 5 · cancel vs close

Fuente:
- MDN · ReadableStream.cancel()
  https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/cancel

`cancel()`:
el consumidor ya no necesita datos pendientes.

`close()`:
el productor terminó limpiamente.

No son equivalentes.

## 6 · TransformStream

Fuente:
- MDN · TransformStream
  https://developer.mozilla.org/en-US/docs/Web/API/TransformStream

Widely available desde 2022.

Útil para:
- decode;
- parse incremental;
- filtering;
- buffering;
- framing.

Puede vivir en Worker.

No poner transformaciones pesadas en main thread si bloquean interacción.

## 7 · Fetch streaming

`Response.body` puede ser ReadableStream.

Patrón:
```
fetch(url,{signal})
→ response.body
→ decode
→ parse
→ render incrementally
```

Reglas:
- AbortSignal;
- límite de tamaño;
- parser incremental;
- stale ownership;
- no render por cada byte/chunk pequeño;
- batching.

## 8 · Render batching

Mal:
un DOM update por cada token/chunk.

Mejor:
- acumular durante una pequeña ventana;
- renderizar por frame o lote;
- priorizar input;
- preservar announcement semantics.

Para texto conversacional:
batch visual ≠ batch semántico obligatorio.
Axioma/Pulso deben intervenir en announcements.

## 9 · WebSocket clásico

Fuentes:
- MDN · WebSocket
  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
- MDN · bufferedAmount
  https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/bufferedAmount

WebSocket clásico:
**no implementa backpressure de recepción automáticamente**.

Si llegan mensajes demasiado rápido:
- memoria puede crecer;
- CPU puede saturarse.

Para envío:
`bufferedAmount` indica bytes en cola.

Regla:
no hacer `send()` ilimitado ignorando bufferedAmount/readyState.

## 10 · WebSocketStream

Fuente:
- MDN · WebSocketStream
  https://developer.mozilla.org/en-US/docs/Web/API/WebSocketStream

Ventaja:
Streams + backpressure.

Estado:
experimental / non-standard / soporte limitado.

No usar como baseline público.

## 11 · Cola acotada

Para eventos de alta frecuencia:

```
maxQueue = N
policy =
  latest-wins
  drop-oldest
  block-producer
  coalesce
  reject
```

Elegir por dominio.

Ejemplos:

### pointermove
coalesce/latest wins visual.

### dibujo
no perder stroke significativo; coalesced events o sampling controlado.

### chat token stream
batch/coalesce visual, no reordenar contenido.

### control commands
no drop silencioso.

## 12 · Latest-wins

Útil para:
- resize;
- preview;
- hover;
- filtros;
- búsqueda incremental.

Contrato:
trabajo intermedio puede descartarse si una intención nueva lo supersede.

No usar para:
- guardar;
- comprar;
- enviar;
- comandos irreversibles.

## 13 · Debounce vs throttle vs backpressure

### Debounce
espera silencio.

Bueno:
búsqueda tras escritura.

### Throttle
limita frecuencia.

Bueno:
telemetría visual/resize.

### Backpressure
coordina productor y consumidor.

Bueno:
stream real.

No son intercambiables.

## 14 · Structured data streaming

Un chunk de red no coincide necesariamente con:
- carácter;
- línea;
- JSON;
- mensaje.

Parser debe manejar:
- límites partidos;
- UTF-8 parcial;
- frame incompleto;
- error de framing.

No hacer `JSON.parse(chunk)` si el protocolo no garantiza mensaje completo por chunk.

## 15 · TextDecoderStream

Fuente:
- MDN · TextDecoderStream
  https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream

Útil para:
bytes → texto incremental manteniendo límites multibyte.

Feature detect/fallback según soporte objetivo.

## 16 · Transferable streams

Streams pueden ser transferibles en APIs compatibles.

Ownership y cancelación atraviesan contextos.

No duplicar reader:
un ReadableStream bloqueado tiene un consumidor activo.

## 17 · Error propagation

Pipeline:
`source → transform → sink`.

Si falla transform:
definir:
- cancel upstream;
- abort downstream;
- estado UI;
- retry o no.

Nunca:
catch vacío que deja el pipeline en estado ambiguo.

## 18 · Retries

Retry solo si:
- operación idempotente;
- error transitorio;
- presupuesto limitado;
- cancelación respetada.

Backoff:
- evita thundering herd;
- no bloquear UI.

No reintentar indefinidamente una entrada inválida.

## 19 · Frontera Iris Green

Pulso:
runtime conversacional/transport.

Motor:
scheduling/render/backpressure de interacción.

Vigía:
observabilidad.

Córtex:
modelo/provider.

Vector:
integración/release.

Motor no toma ownership de protocolo conversacional por estudiar streams.

## 20 · Failure injection de streaming

Casos:
1. productor 10× consumidor;
2. stream cancelado a mitad;
3. chunk JSON partido;
4. UTF-8 multibyte partido;
5. consumer throw;
6. reconnect con mensajes viejos;
7. WebSocket bufferedAmount crece;
8. tab background y luego restore.

PASS:
- memoria acotada;
- no reorder;
- cancel real;
- UI responde;
- no stale apply.

## 21 · Estado R09

Estudiado:
- Streams API;
- backpressure;
- async iteration;
- cancel/close;
- transforms;
- fetch streaming;
- batching;
- WebSocket buffers;
- WebSocketStream limits;
- queue policies;
- retry.

Marcador:
`MOTOR_STREAMING_BACKPRESSURE_INCREMENTAL_RUNTIME_STUDIED_R09`

No:
- producto;
- build;
- merge;
- deploy;
- main/producción.
