# MOTOR · A5 · ESTUDIO PROFUNDO R22 · OBSERVERS, INVALIDATION Y CALLBACK TIMING

Fecha: 30/09/2026
Amplía: R01–R21
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Observer no significa “callback cuando sea”

Las APIs Observer tienen semánticas temporales distintas.

Motor debe conocer:
- qué invalida;
- cuándo se entrega;
- si puede retroalimentar la causa;
- cómo se desconecta;
- qué trabajo se hace dentro del callback.

## 2 · ResizeObserver

Fuentes:
- MDN · ResizeObserver
  https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
- Resize Observer
  https://drafts.csswg.org/resize-observer/

Entrega notificaciones antes de paint.

Si callback cambia layout y vuelve a producir resize:
- style/layout puede reevaluarse;
- pueden generarse nuevas notificaciones.

El navegador evita lockup total limitando el procesamiento y puede emitir:
`ResizeObserver loop completed with undelivered notifications.`

Eso **no arregla el bucle lógico**.

## 3 · Guard de tamaño esperado

Patrón:

```js
const expected = new WeakMap();

const ro = new ResizeObserver(entries => {
  for (const entry of entries) {
    const size = readSize(entry);
    if (expected.get(entry.target) === size) continue;

    const next = calculate(size);
    expected.set(entry.target, next);
    apply(next);
  }
});
```

Solo escribir si la nueva medida representa cambio intencional.

## 4 · Read/write discipline

Dentro de observación:
- leer entradas entregadas;
- calcular;
- evitar cadenas de reads/writes DOM alternadas;
- defer write cuando ayuda a romper feedback.

No aplicar rAF como curita universal:
si la lógica sigue creciendo cada frame, solo hemos convertido el bucle en uno más lento.

## 5 · MutationObserver

Fuente:
- MDN · Using microtasks with queueMicrotask()
  https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide

MutationObserver usa microtask queue.

Consecuencia:
callback pesado puede ejecutarse antes de que browser vuelva al event loop/render.

Regla:
MutationObserver:
- detecta;
- agrega/invalida;
- programa trabajo mayor después.

No:
hacer recomputación completa de aplicación dentro de cada record.

## 6 · Coalescing

Si muchas mutaciones significan:
“estado X está dirty”,

no procesar 100 veces.

Patrón:
```text
notifications
→ dirty flag / pending set
→ one scheduled flush
→ process latest state
```

## 7 · Práctica de batching

100 llamadas `notify()` en el mismo turno.

Scheduler:
- first notify → queueMicrotask(flush);
- siguientes → solo acumulan.

Resultado:

```text
BATCH: 100 notifications
FLUSHES: 1
PROCESSED: 100
PASS
```

## 8 · Práctica de resize feedback

Modelo ingenuo:
```text
observed 100
→ write 110
→ observed 110
→ write 120
...
```

10 iteraciones simuladas → tamaño 200.

Demuestra feedback no convergente.

Guard expected-size:
- primer callback escribe siguiente tamaño;
- segunda observación igual a expected → no vuelve a escribir.

PASS.

## 9 · Resultado práctica R22

```text
PASS microtask coalescing: 100 → 1 flush
PASS naive feedback model demonstrates non-convergence
PASS expected-size guard stops repeated write
RESULT 3/3 observer-model checks passed
```

## 10 · IntersectionObserver

Fuentes:
- MDN · Intersection Observer API
  https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- W3C · Intersection Observer
  https://www.w3.org/TR/intersection-observer/

Widely available desde 2019.

Sirve para:
- lazy load;
- pause offscreen;
- near-viewport prewarm.

Entrega cambios de intersección asíncronamente y permite al navegador optimizar.

No sirve para:
- pixel-perfect overlap exacto;
- reemplazar layout engine.

## 11 · Primer callback de IntersectionObserver

MDN documenta que al llamar `observe()`, callback se ejecuta en el primer ciclo de render aunque el elemento no se haya movido.

Regla:
el callback inicial es **estado inicial**, no necesariamente transición “entró”.

No disparar analytics/animación de “enter” sin distinguirlo.

## 12 · Threshold design

Muchos thresholds:
- más callbacks;
- más complejidad.

Para lazy load:
uno o pocos thresholds suelen bastar.

Para “50 % visible”:
threshold 0.5.

No crear arrays 0..1 cada 1 % si no hay requisito.

## 13 · trackVisibility

IntersectionObserver tiene opciones modernas para visibilidad comprometida.

MDN advierte que tracking de visibility es costoso.

No activarlo para simple lazy load.

## 14 · PerformanceObserver

Fuentes:
- MDN · PerformanceObserver
  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver/PerformanceObserver
- MDN · Performance data
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Performance_data

Usar:
`PerformanceObserver.supportedEntryTypes`
antes de observar entry types opcionales.

## 15 · Buffered entries

`buffered:true` permite recibir entradas previas.

Pero buffers tienen límites.

Ejemplos MDN:
- resource ~250;
- longtask ~200;
- event ~150;
- layout-shift ~150.

El callback inicial puede incluir:
`droppedEntriesCount`.

Regla:
si entries fueron dropped:
**evidencia incompleta**.

No reportar “0 problemas” como si se hubiera observado todo.

## 16 · takeRecords()

Observers pueden exponer records pendientes.

Antes de disconnect:
si esos records son importantes:
- takeRecords;
- process;
- disconnect.

No siempre es necesario; depende del contrato.

## 17 · Observer ownership

Patrón recomendado:

```js
const observers = [];

const ro = new ResizeObserver(...);
observers.push(ro);

function destroy() {
  for (const o of observers) o.disconnect();
}
```

O registrar cleanup en lifecycle owner.

## 18 · Auditoría A5

### R42 direct
- 1 ResizeObserver;
- 1 MutationObserver;
- no disconnect observado en la capa.

### R43 advanced
- 1 ResizeObserver;
- no disconnect observado.

### Sabik mount
- 1 MutationObserver para lang;
- otros componentes gestionan disconnect;
- page-lifetime mount.

### 3D runtime
- 1 ResizeObserver;
- `stop()` hace disconnect.

Patrón más robusto:
3D, porque lifecycle de observer está unido al lifecycle de instancia.

## 19 · Page lifetime vs component lifetime

Si componente vive hasta page unload:
observer sin explicit destroy puede no manifestarse como fuga práctica.

Si hay:
- remount;
- router;
- tabbed workspace;
- virtualized UI

entonces debe haber destroy/unobserve.

La arquitectura futura del Taller debe asumir component lifecycle explícito antes de escalar.

## 20 · Observers y reentrancy

ResizeObserver:
callback puede causar otra observación.

MutationObserver:
callback puede mutar DOM y generar nuevos records.

IntersectionObserver:
callback puede cambiar layout y futuras intersections.

Regla:
**callback debe ser idempotente o convergente**.

## 21 · Invalidation architecture

Preferir:
```text
OBSERVER
→ invalidates domain/render concern
→ scheduler coalesces
→ render/update once
```

No:
```text
OBSERVER A
→ write
→ OBSERVER B
→ write
→ OBSERVER A
...
```

sin reglas.

## 22 · Observer selection

### ResizeObserver
cambio de tamaño del elemento.

### MutationObserver
cambio DOM/attributes/text.

### IntersectionObserver
relación de visibilidad/viewport.

### PerformanceObserver
performance entries.

No usar polling cuando observer estándar resuelve el problema.

## 23 · W3C design principle 2026

Web Platform Design Principles recomienda eventos como base general cuando encajan, y Observer cuando EventTarget no funciona bien o la recursión/semántica hace mejor el patrón Observer.

Lección Motor:
no inventar un observer custom si un evento de dominio explícito basta.

## 24 · Testing matrix

### Resize
- stable size;
- callback writes size;
- rapid resize;
- zero width;
- disconnect.

### Mutation
- batch 100;
- mutation inside callback;
- destroy.

### Intersection
- initial callback;
- enter/exit;
- multiple thresholds;
- unobserve.

### Performance
- unsupported type;
- buffered;
- dropped entries;
- disconnect.

## 25 · Estado R22

Práctica:
**3/3 PASS**.

Auditoría:
- observer ownership A5: revisado;
- 3D stop/disconnect: patrón positivo;
- R42/R43 page-lifetime assumption: documentado.

Marcador:
`MOTOR_OBSERVER_INVALIDATION_CALLBACK_TIMING_STUDIED_R22`

No:
- observer refactor;
- IntersectionObserver nuevo;
- PerformanceObserver product telemetry;
- build;
- merge;
- deploy;
- main/production.
