# MOTOR · A5 · ESTUDIO PROFUNDO R18 · EVENT ARCHITECTURE, CUSTOM EVENTS Y REENTRANCY

Fecha: 30/09/2026
Amplía: R01–R17
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · EventTarget es una frontera de runtime

Un evento contiene:
- type;
- target;
- currentTarget;
- phase;
- default action;
- propagation;
- payload si CustomEvent.

No es solo “llamar callbacks”.

## 2 · dispatchEvent es síncrono

Un listener puede ejecutarse durante la operación que emite el evento.

Riesgo:
```text
mutate half state
→ dispatch
  → listener reads half state
  → listener reenters producer
→ finish mutation
```

Regla:
**publicar eventos después de restaurar invariantes.**

Si se necesita defer:
- queueMicrotask;
- scheduler/task;
- Promise turn

según semántica.

No diferir automáticamente todos los eventos.

## 3 · Práctica de reentrancy

Modelo:

```text
phase = mutating
dispatch sync
listener sees mutating
phase = done
```

Resultado:
PASS: demuestra que dispatch puede observar estado intermedio.

Lección:
event emission point es parte de la arquitectura de estado.

## 4 · Capture / target / bubble

Fuente:
- MDN · addEventListener()
  https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

Fases:
- capture;
- target;
- bubble.

Event delegation depende de bubbling.

No añadir capture listeners globales salvo necesidad real.

## 5 · stopPropagation no cancela default

Fuente:
- MDN · stopPropagation()
  https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation

`stopPropagation()`:
detiene recorrido.

NO:
- evita acción por defecto;
- detiene otros listeners del mismo target.

Para default:
`preventDefault()`.

Para listeners restantes:
`stopImmediatePropagation()`.

## 6 · Listener options

`addEventListener(type, fn, { ... })`:

### once
auto-remove tras primera invocación.

### passive
promete no llamar preventDefault.

### signal
owner de lifecycle.

### capture
fase de captura.

Motor declara intención explícita.

## 7 · CustomEvent

Usar para eventos de dominio DOM:
```js
new CustomEvent("ig:project-saved", {
  detail: {...},
  bubbles: true
})
```

No usar un evento genérico:
`"changed"`.

Namespacing:
`ig:<subsystem>:<event>`.

## 8 · Payload contract

Si un evento cruza subsistemas:

```js
detail: {
  protocol: 1,
  entityId,
  revision,
  ...
}
```

No pasar:
- DOM internals;
- giant mutable state;
- secret data.

## 9 · Mutable detail

CustomEvent.detail puede contener objetos.

Dentro del mismo realm, consumidores pueden observar/mutar la misma referencia.

Regla:
para contrato público:
- payload pequeño;
- immutable by convention;
- clone/freeze si riesgo lo justifica.

No deep-clone por rutina si cuesta demasiado.

## 10 · Protocol practice

Práctica:
- protocol 1 → handled;
- protocol unknown → ignored safely.

**2 checks PASS** dentro de práctica total R18 3/3.

No interpretar unknown payload con guesses.

## 11 · Shadow DOM composed

Fuentes:
- MDN · Event.composed
  https://developer.mozilla.org/en-US/docs/Web/API/Event/composed
- MDN · composedPath()
  https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath

Un evento custom NO cruza automáticamente Shadow DOM si no se crea con:
`composed:true`.

Para propagación desde shadow:
normalmente también `bubbles:true`.

Regla:
cross-shadow event = decisión de API pública.

No marcar todo composed.

## 12 · Event retargeting

Shadow DOM puede retargetear `event.target`.

Si se necesita conocer path:
`event.composedPath()`.

No depender de internals de closed shadow.

## 13 · Auditoría A5 local data

`assets/ig-taller-local-data.js`.

Emite:
`CustomEvent('ig:r42-local-change',{detail:{type,detail}})`.

Además BroadcastChannel publica el mismo cambio.

Fortaleza:
separa notification de storage.

Evolución:
si protocolo crece:
- version;
- entity;
- revision.

## 14 · Auditoría R43

R43 emite:
`ig:r43-advanced-ready`.

Uso:
informar que motor avanzado está disponible.

R40 tools también hace fallback por tiempo/event state.

Regla:
ready event debe representar una condición durable:
si un consumidor se monta después, también necesita poder consultar:
`isReady()`.

Event-only readiness puede perderse para listeners tardíos.

## 15 · Events vs state query

### Event
“algo ocurrió”.

### State query
“cómo está ahora”.

No usar evento como única fuente para estado durable.

Patrón:
```text
isReady()
+ ready event
```

## 16 · Event storms

Pointer/input/resize pueden emitir alta frecuencia.

No disparar CustomEvent de dominio por cada sample si consumidores solo necesitan estado final.

Coalesce:
- rAF;
- batch;
- transaction commit.

## 17 · Backpressure

DOM events no ofrecen backpressure automático.

Un listener lento bloquea dispatch síncrono.

Para streams pesados:
- queue;
- Worker;
- MessageChannel;
- async iterator

según necesidad.

## 18 · Reentrancy guard

Opciones:
- state machine;
- transaction flag;
- queue next action;
- idempotent handlers.

No usar global boolean arbitrario sin definir qué se hace con la acción reentrante:
- reject;
- queue;
- coalesce.

## 19 · preventDefault contract

Si un custom event es cancelable:
productor debe comprobar:
`dispatchEvent()` return / `defaultPrevented`.

No declarar `cancelable:true` si no existe default action que cancelar.

## 20 · Error handling

Excepción dentro de listener no debe convertirse en estado parcialmente aplicado.

Publicar después de commit reduce daño.

Para critical event bus:
aislar consumidores si corresponde.

No envolver todo listener en catch vacío.

## 21 · Event naming

Evitar nombres que colisionen con DOM:
- change;
- input;
- error.

Preferir namespace:
- ig:r42-local-change;
- ig:r43-advanced-ready.

A5 ya sigue esta dirección.

## 22 · Listener cleanup

Preferir:
```js
const controller = new AbortController();
target.addEventListener(type, fn, {signal:controller.signal});
...
controller.abort();
```

Conecta con R03 lifecycle.

## 23 · Testing

### Order
capture → target → bubble.

### Reentrancy
listener dispatches same event.

### Cancel
defaultPrevented.

### Teardown
after abort no calls.

### Shadow
composed false/true.

### Late subscriber
state query still works.

### Storm
1000 updates coalesced if contract allows.

## 24 · Estado R18

Práctica:
**3/3 PASS**:
- synchronous reentrancy demonstrated;
- known protocol handled;
- unknown protocol safely ignored.

Auditoría:
- local-change event;
- advanced-ready event;
- lifecycle/public state relationship.

Marcador:
`MOTOR_EVENT_ARCHITECTURE_REENTRANCY_STUDIED_R18`

No:
- event protocol changes;
- Shadow DOM migration;
- product change;
- build;
- merge;
- deploy;
- main/production.
