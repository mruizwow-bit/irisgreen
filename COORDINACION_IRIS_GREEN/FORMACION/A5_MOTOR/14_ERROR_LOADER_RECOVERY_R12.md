# MOTOR · A5 · ESTUDIO PROFUNDO R12 · ERROR ARCHITECTURE, LOADERS Y RECOVERY

Fecha: 30/09/2026
Amplía: R01–R11
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Error no es una sola categoría

Motor clasifica al menos:

### Cancellation
- user cancel;
- superseded request;
- AbortError;
- pointercancel;
- navigation away.

Normal.
No mostrar como fallo.

### Expected environmental failure
- capability absent;
- quota;
- offline/network;
- worker crash;
- decode failure.

Debe tener fallback/recovery si el producto lo permite.

### Validation/domain error
- invalid project;
- wrong studio;
- unsupported version.

Mensaje claro y preservación del dato.

### Programmer/invariant error
- impossible state;
- TypeError;
- assertion;
- corrupt internal contract.

No ocultar con fallback infinito.
Escalar/evidenciar.

## 2 · Window error vs unhandledrejection

Fuentes:
- MDN · Window error event
  https://developer.mozilla.org/en-US/docs/Web/API/Window/error_event
- MDN · unhandledrejection
  https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
- MDN · rejectionhandled
  https://developer.mozilla.org/en-US/docs/Web/API/Window/rejectionhandled_event

`error`:
errores síncronos/script/resource según contexto.

`unhandledrejection`:
Promise rechazada sin handler.

`rejectionhandled`:
se añadió handler después del unhandled.

Regla:
global handlers son **última red de diagnóstico**, no arquitectura primaria de recuperación.

Cada operación debe manejar su error donde exista contexto suficiente.

## 3 · Worker errors

Workers tienen:
- `error`;
- `messageerror`;
- `unhandledrejection` dentro del Worker.

Una task pending no puede quedar viva si el Worker muere.

Regla:
worker owner mantiene:
`id → resolve/reject`
y al fallo:
- reject all;
- clear;
- terminate;
- mark unavailable;
- fallback/restart según política.

R42 ya aplica gran parte de este patrón.

## 4 · Error.cause

Fuente:
- MDN · Error.cause
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause

Widely available.

Permite añadir contexto sin perder causa:

```js
throw new Error("Workshop engine failed to load", {cause: err});
```

Motor debe conservar:
- capa;
- operación;
- recurso;
- causa.

No concatenar strings hasta perder stack/origen.

## 5 · AggregateError

Fuente:
- MDN · AggregateError
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError

Útil cuando varias operaciones independientes fallan.

Ejemplo:
cargar tres previews opcionales.

No usar AggregateError si existe una única causa encadenada; usar `cause`.

## 6 · Retry policy

Retry solo si:
- operación es idempotente o segura de repetir;
- fallo puede ser transitorio;
- hay límite;
- hay backoff cuando aplica;
- cancelación puede detenerlo.

No retry:
- parse/schema invalid;
- unsupported future version;
- programmer invariant;
- permission denied definitivo

sin nueva acción/condición.

## 7 · Backoff

Patrón general:
```text
attempt 1
wait base + jitter
attempt 2
wait larger
attempt N
terminal degraded/failed
```

No:
retry inmediato infinito.

En UI:
mostrar estado sin inundar anuncios live.

## 8 · Loader como state machine

Estados:

```text
IDLE
LOADING
READY
DEGRADED
FAILED
CANCELLED
```

Transiciones terminales explícitas.

Un loader NO puede quedar en:
`LOADING forever`.

Cada recurso:
- success;
- error;
- timeout/abort;
- fallback.

## 9 · Auditoría A5 loader histórico

PR #299:
`assets/ig-taller-estudio.js`.

Cadena:
```text
paths
→ platform
→ advanced
→ direct
→ shell
```

Se usa principalmente:
`.onload = next`.

Observación:
los scripts insertados de esa cadena no muestran una estrategia uniforme de `onerror`.

`loadShell()` inserta shell sin esperar/confirmar mount mediante callback en esa función.

Hay fallback parcial en `ig-taller-r40-tools.js`:
espera Advanced y tras ~1800 ms puede volver a motor previo.

Conclusión:
existe resiliencia parcial, pero no un contrato único de loader terminal.

No se declara fallo del producto actual porque PR #299 es histórico/no integrado como canónico y faltaría ejecutar entorno completo.

## 10 · Robust loader pattern

```text
loadScript(url, {signal, timeout})
→ Promise
  resolve on load
  reject on error
  reject TimeoutError
  reject AbortError
  cleanup handlers/timer
```

Luego:

```text
try primary
catch expected:
  try fallback
catch fatal:
  FAILED
finally:
  LOADING=false
```

## 11 · Timeout

Timeout no es equivalente a network error.

Puede significar:
- CPU/main-thread block;
- stalled connection;
- browser scheduling;
- resource too slow.

Registrar causa separada.

No usar timeout demasiado agresivo que penalice dispositivos lentos.

## 12 · Cancellation

AbortSignal debe viajar por el loader.

Si el usuario:
- cambia de estudio;
- cierra panel;
- navega

no tiene sentido terminar una carga pesada que ya no posee UI.

## 13 · Práctica de taxonomía ejecutada

Modelo aislado:

```text
PASS AbortError is cancellation, not failure
PASS TimeoutError is retryable policy input
PASS HTTP 503 is retryable
PASS TypeError is fatal/programmer category, not silently retried
RESULT 4/4 error-taxonomy checks passed
```

## 14 · User-facing recovery

Mensaje debe responder:
- qué pasó;
- qué puede hacer;
- si perdió trabajo;
- si la función básica sigue disponible.

No:
“Error 0x…” sin acción.

No:
“Todo bien” si fallback perdió persistencia.

Ejemplo:
`No se ha podido abrir la vista interactiva. Puedes seguir usando la versión básica.`

## 15 · Preserve user work first

Ante fallo de motor:
1. no sobrescribir estado;
2. intentar export/recovery si procede;
3. mantener raw payload;
4. permitir volver a versión anterior/read-only;
5. registrar evidencia.

Nunca reset automático destructivo para “recuperar”.

## 16 · Error boundaries de UI

Aunque el proyecto no use React Error Boundaries en A5 como arquitectura principal, el principio aplica:

**aislar blast radius.**

Un fallo de un estudio no debería romper:
- navegación global;
- guardado de otro estudio;
- Sabik;
- Rincón.

Motor diseña subsistemas con fronteras.

## 17 · Resource errors

`<script>`, `<img>`, media y links pueden emitir `error`.

No todos los errores de recursos burbujean como eventos normales; capturar en elemento o fase adecuada.

Cada recurso crítico lazy-loaded debe tener:
- load;
- error;
- fallback.

## 18 · Promise hygiene

Anti-patrones:
- `.catch(()=>{})`;
- fire-and-forget Promise sin owner;
- async event handler que rechaza sin catch;
- catch que convierte programmer error en success.

Permitido ignorar solo si:
- se ha clasificado;
- no afecta invariant;
- existe comentario/evidencia.

## 19 · Global handlers y privacidad

`unhandledrejection.reason` puede contener datos.

Además, rejections de scripts cross-origin pueden no disparar el evento por razones de privacidad.

Vigía/Lex gobiernan qué se registra/envía.

Motor no serializa automáticamente:
- user input;
- payload;
- stack con datos

a telemetría.

## 20 · Recovery budget

No toda feature merece retry infinito.

Definir:
`MAX_ATTEMPTS / MAX_TIME / FALLBACK / USER_ACTION`.

Una experiencia calmante debe evitar bucles visibles/repetitivos.

## 21 · State reset policy

Reset solo por:
- acción explícita;
- estado irrecuperable declarado;
- migración aprobada con backup.

No como catch-all.

## 22 · Testing matrix

### Script load
- 404;
- timeout;
- syntax error;
- CSP block.

### Worker
- constructor throw;
- runtime error;
- messageerror;
- reject.

### Async
- abort;
- stale;
- timeout;
- retry success;
- retry exhausted.

### User work
- failure after edits;
- export still possible;
- no silent reset.

## 23 · Estado R12

Práctica:
- error taxonomy: **4/4 PASS**.

Auditoría read-only:
- A5 loader chain: revisada;
- Worker error handling: contrastado;
- global/browser error model: estudiado.

Marcador:
`MOTOR_ERROR_ARCHITECTURE_LOADER_RECOVERY_STUDIED_R12`

No:
- loader refactor;
- telemetry;
- product change;
- build;
- merge;
- deploy;
- main/production.
