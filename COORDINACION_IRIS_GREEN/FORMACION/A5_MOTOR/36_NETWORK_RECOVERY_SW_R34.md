# MOTOR · A5 · ESTUDIO PROFUNDO R34 · OFFLINE, RED RECUPERABLE Y SERVICE WORKERS

Fecha: 01/10/2026
Amplía: R01–R33
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

“Online/offline” no es un booleano fiable de disponibilidad de servicio.

Motor debe distinguir:

```
NETWORK_HINT
DNS/ROUTE
TLS
HTTP
APPLICATION RESPONSE
SERVICE AVAILABILITY
STALE CACHE
USER CANCEL
TIMEOUT
```

## 2 · navigator.onLine

Fuente:
- MDN · Navigator.onLine
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine

`navigator.onLine` usa heurísticas del navegador/OS.

Puede ser:
- true con LAN pero sin Internet;
- false por condiciones locales aun cuando algunos recursos sean alcanzables.

Regla:
**usar onLine como pista de UI, nunca como autoridad para habilitar/deshabilitar una función crítica.**

## 3 · online/offline events

Fuentes:
- MDN · online
  https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event
- MDN · offline
  https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event

Indican cambio de la heurística de red.

No indican:
- disponibilidad de irisgreen.eu;
- disponibilidad de Cloud;
- autenticación;
- éxito de una request.

Al evento `online`:
no enviar automáticamente una cola irreversible sin reconciliar.

## 4 · Fetch error taxonomy

Fuentes:
- MDN · fetch()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
- MDN · Using Fetch
  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

`fetch()`:
- normalmente resuelve incluso con HTTP 404/500;
- hay que comprobar `response.ok` / status;
- rechaza ante errores de red/policy/URL/etc.

Errores relevantes:
- AbortError;
- TimeoutError si proviene de AbortSignal.timeout;
- TypeError para varias clases de fallo.

Regla:
**HTTP error ≠ network error.**

## 5 · Error message vs retry policy

No decidir retry por texto del error.

Clasificar por:
- method;
- idempotency;
- status;
- abort reason;
- timeout;
- network rejection;
- user intent.

GET idempotente:
puede admitir retry limitado.

POST/action:
solo si protocolo/idempotency key lo permite.

## 6 · Timeout

Fuente:
- MDN · AbortSignal.timeout()
  https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static

Timeout:
- no significa offline;
- no significa servidor caído;
- puede ser congestión/carga.

No mostrar:
“No tienes Internet”
solo por TimeoutError.

## 7 · Retry con backoff

Patrón:
```
attempt
if transient && budget remains:
  wait exponential+jitter
  retry
else:
  surface recoverable state
```

Criterios:
- límite de intentos;
- user cancel gana;
- nueva intención supersede;
- lifecycle hidden puede pausar;
- no retry infinito.

## 8 · Offline queue

Una cola offline de acciones añade:
- persistence;
- replay;
- order;
- deduplication;
- conflicts;
- privacy.

No añadir una “cola automática” por comodidad.

Para una acción que modifica estado remoto:
necesita contrato con owner del servicio.

## 9 · Read-only cache

Más sencillo:
contenido read-only cacheado.

Aun así distinguir:
- fresh;
- stale;
- missing;
- invalidated.

Mostrar si la información puede estar desactualizada cuando sea relevante.

## 10 · Service Worker lifecycle

Fuentes:
- MDN · Service Worker API
  https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- MDN · Using Service Workers
  https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

Lifecycle:
```
download
→ install
→ installed/waiting
→ activating
→ activated
→ redundant
```

Una versión nueva puede quedar waiting mientras clientes usan la vieja.

## 11 · Version split

Con service worker:
página A puede estar bajo versión antigua;
página B bajo nueva tras activación/claim.

Riesgo:
HTML/JS/data schema incompatibles.

Regla:
**cache/runtime versioning es un contrato, no solo nombres de archivos.**

## 12 · skipWaiting()

Fuente:
- MDN · skipWaiting()
  https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting

Fuerza worker waiting a activar antes.

No usar por reflejo.

Puede hacer que:
- página cargada con assets/version vieja
- quede controlada por lógica nueva.

Solo si versión nueva es compatible con clientes abiertos o existe estrategia de reload.

## 13 · clients.claim()

Fuente:
- MDN · Clients.claim()
  https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim

Permite al SW activo controlar clientes ya abiertos.

Mismo riesgo:
mezcla de lifecycle/version.

Regla:
`skipWaiting + clients.claim` es una decisión de actualización, no boilerplate universal.

## 14 · install / activate

`install`:
preparar recursos.

`activate`:
limpiar cachés/versiones antiguas.

`event.waitUntil()` extiende lifecycle hasta que el trabajo termine.

No borrar caché vieja durante install si la versión activa todavía la necesita.

## 15 · Cache versioning

Patrón:
```
CACHE_vN
install new
activate
delete only known obsolete caches
```

No:
`caches.keys().forEach(delete everything)`
sin ownership.

Puede haber otras apps/features same-origin.

## 16 · Stale cache

Estrategias:
- cache-first;
- network-first;
- stale-while-revalidate;
- network-only;
- cache-only.

Elegir por semántica.

### Contenido educativo versionado
cache-first puede ser razonable si immutable.

### información que cambia
network-first/SWR con freshness.

### acciones
network.

No una estrategia global.

## 17 · Service Worker performance

SW puede añadir startup/coste en fetch.

No adoptar PWA/offline porque “es moderno”.

Medir:
- first load;
- repeat load;
- update;
- storage;
- failure.

## 18 · Current Iris Green audit

Búsqueda actual del repositorio:
- no se encontraron referencias `serviceWorker`;
- no se encontraron `navigator.onLine`.

Conclusión:
no existe service worker canónico que Motor deba mantener hoy.

No se propone introducirlo durante Formación.

## 19 · Sabik/transport

Para una consulta:
network recovery debe distinguir:
- user cancelled;
- transport unavailable;
- network error;
- server error;
- stale response;
- new query superseded.

Pulso conserva ownership del transporte conversacional.
Motor aporta runtime interaction/recovery patterns.

## 20 · Offline UX

Nunca:
- spinner infinito;
- botón bloqueado para siempre;
- borrar input;
- repetir request sin aviso.

Preferir:
- conservar consulta/estado;
- mensaje claro;
- retry;
- fallback a recursos locales cuando exista.

## 21 · Network change during operation

Si se pierde conexión:
- abort puede no ser inmediato;
- fetch puede tardar en fallar.

Nueva intención:
AbortSignal independiente del estado online.

Si vuelve:
no aplicar automáticamente respuesta vieja.

## 22 · Testing

### offline before request
context offline.

### offline mid-request
interrumpir route.

### HTTP 500
fetch resuelve; UI debe detectar !ok.

### timeout
TimeoutError, no offline assumption.

### reconnect
user initiates retry o política autorizada.

### stale response
revision prevents overwrite.

### cache stale
version/freshness visible.

## 23 · Playwright

Puede emular offline a nivel de contexto según configuración/API.

También puede:
- route abort;
- fulfill 500;
- delay response.

Así se prueban clases distintas, no solo “internet off”.

## 24 · Failure labels

```
NETWORK_HINT_OFFLINE
NETWORK_REQUEST_FAILED
HTTP_ERROR
TIMEOUT
ABORT_USER
ABORT_SUPERSEDED
STALE_RESULT
CACHE_STALE
SERVICE_UNAVAILABLE
```

No colapsarlas todas en:
`ERROR`.

## 25 · Estado R34

Estudiado:
- onLine limits;
- fetch error taxonomy;
- retry/backoff;
- offline queues;
- Service Worker lifecycle;
- version split;
- skipWaiting/claim;
- cache strategies;
- offline testing.

Auditoría:
- sin Service Worker actual;
- sin onLine current code.

Marcador:
`MOTOR_NETWORK_RECOVERY_SERVICE_WORKER_STUDIED_R34`

No:
- Service Worker;
- cache offline;
- retry product;
- transport change;
- build;
- merge;
- deploy;
- main/production.
