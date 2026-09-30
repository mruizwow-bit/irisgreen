# MOTOR · A5 · ESTUDIO PROFUNDO R16 · MULTI-TAB, INDEXEDDB UPGRADES Y LOCKING

Fecha: 30/09/2026
Amplía: R01–R15
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Una pestaña no es el sistema entero

Un origen puede tener simultáneamente:
- varias tabs;
- windows;
- iframes;
- Workers.

Estado local compartido requiere coordinación explícita.

## 2 · Web Locks

Fuentes:
- MDN · Web Locks API
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API
- MDN · LockManager.request()
  https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request

Baseline / widely available desde 2022.
Secure context.

Permite locks:
- exclusive;
- shared;
- ifAvailable;
- AbortSignal.

## 3 · Locks son advisory

Web Locks funciona solo si todos los participantes respetan el mismo protocolo/nombre.

No protege IndexedDB de código que ignora el lock.

Regla:
`lock name` = parte del contrato interno.

Versionarlo/documentarlo.

## 4 · Deadlock

Puede ocurrir si:

```text
Tab 1: holds A → waits B
Tab 2: holds B → waits A
```

Protecciones:
- no nesting;
- orden canónico;
- timeout/AbortSignal;
- locks más gruesos cuando simplifique.

No usar `steal:true` como solución habitual:
MDN advierte que el código anterior puede seguir ejecutándose y chocar con el nuevo owner.

## 5 · Práctica de lock ordering

Modelo waits-for:

```text
PASS unordered nested locks form deadlock cycle
PASS canonical lock order removes cycle
RESULT 2/2 lock-order checks passed
```

## 6 · IndexedDB version upgrades

Fuentes:
- MDN · IDBDatabase versionchange
  https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/versionchange_event
- MDN · IDBOpenDBRequest blocked
  https://developer.mozilla.org/en-US/docs/Web/API/IDBOpenDBRequest/blocked_event

Cuando una tab pide DB version nueva:
- otras conexiones reciben `versionchange`;
- mientras sigan abiertas, upgrade queda `blocked`.

Patrón profesional:

```js
db.onversionchange = () => {
  db.close();
  showUpdateNeeded();
};
```

## 7 · Auditoría Iris Green

`assets/ig-taller-local-data.js`.

Actual:
- `DB_VERSION=1`;
- `onupgradeneeded`;
- `req.onblocked` → reject;
- NO `db.onversionchange`;
- NO `db.close()` observado.

Interpretación:
mientras no exista upgrade concurrente, no implica fallo.

**Antes de DB_VERSION=2**, debe diseñarse lifecycle cross-tab.

## 8 · blocked no cancela mágicamente el open

`blocked` informa que una conexión antigua impide avanzar.

Rechazar una Promise de aplicación no equivale necesariamente a cancelar el request IDB subyacente.

Regla:
no modelar:
`onblocked → request muerto`.

Gestionar explícitamente:
- UI;
- retry;
- old tabs;
- connection lifecycle.

## 9 · Upgrade UX

Si otra tab bloquea:
mensaje:
“Hay otra pestaña de Iris Green abierta. Ciérrala o actualízala para completar la actualización.”

No:
- spinner infinito;
- borrar DB;
- retry frenético.

## 10 · BroadcastChannel

Fuentes:
- MDN · Broadcast Channel API
  https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API

Same-origin + same storage partition.
Structured clone.

Uso:
- invalidación;
- refresh;
- notification;
- leader coordination.

No es:
- persistent log;
- reliable durable queue.

Una tab cerrada no recibe mensajes perdidos.

## 11 · Protocol version

Mensajes actuales R42:
```js
{ type, detail }
```

Si el protocolo crece:

```js
{
  protocol: 2,
  type: "...",
  entity: "...",
  revision: 17,
  detail: ...
}
```

Unknown protocol:
ignorar/refresh, no ejecutar a ciegas.

## 12 · Channel lifecycle

`BroadcastChannel.close()` libera conexión.

R42 platform mantiene channel singleton por lifetime de página.

Correcto si:
- platform = page lifetime.

Si aparece mount/unmount independiente:
definir close/ref-count.

## 13 · Auditoría subscription

Local data:
- llama `platform.subscribe(render)`;
- subscribe devuelve unsubscribe;
- caller no conserva unsubscribe;
- añade listener document `ig:r42-local-change`.

De nuevo:
page-lifetime architecture lo tolera.

Dynamic remount:
requerir cleanup.

Conecta con R06 lifecycle ownership.

## 14 · Revision + lock

R40 ya usa:
- Web Lock cuando disponible;
- expectedRevision.

Son capas distintas:

### Lock
reduce concurrent critical section.

### Revision
detecta stale writer incluso si locking falló/no existe.

Patrón robusto:
**coordination + optimistic conflict detection.**

## 15 · Fallback lock actual

R42 fallback de `withLock` usa Map/Promises dentro de la misma instancia JS.

Eso serializa tareas de esa página.

NO coordina:
- otra tab;
- otro Worker;
- otra instancia.

Regla:
no etiquetar fallback como “multi-tab lock”.

## 16 · Conflict UX

Si `PROJECT_REVISION_CONFLICT`:

No:
“Storage error”.

Mejor:
- proyecto cambió en otra pestaña;
- recargar;
- duplicar;
- comparar/guardar copia.

No sobrescribir automáticamente.

## 17 · Leader election

Web Locks puede implementar:
una tab obtiene lock `leader`.

Pero antes preguntar:
¿necesitamos leader?

Iris Green local-only:
quizá no.

No añadir arquitectura distribuida innecesaria.

## 18 · Lock granularity

Muy fino:
- overhead;
- complexity.

Muy grueso:
- bloquea operaciones independientes.

R40 usa nombres por proyecto:
`project-<id>`.

Buena dirección:
conflictos se aíslan por entidad.

## 19 · Transaction boundaries

El lock no reemplaza transacción IndexedDB.

Persistencia:
`readwrite transaction`
debe contener la atomicidad DB.

No:
lock → múltiples transacciones separadas si se promete atomicidad conjunta sin protocolo.

## 20 · Cross-tab test matrix

### Save/save
dos tabs misma revision.

Esperado:
una gana;
otra conflict.

### Save/delete
política explícita.

### Upgrade
tab A v1 abierta;
tab B intenta v2.

Esperado:
A recibe versionchange;
cierra;
B upgrade.

### Broadcast
save A → B refresca.

### Closed B
mensajes perdidos → al volver, lee DB canónica.

### Lock abort
tab espera lock;
navega → AbortSignal.

## 21 · Update compatibility

Durante despliegue:
puede haber tab con JS viejo + tab con JS nuevo.

Project/schema/protocol deben tolerar ventana de convivencia.

No asumir atomicidad del deploy sobre clientes ya abiertos.

## 22 · bfcache + DB

Una página en bfcache puede mantener recursos según navegador/lifecycle.

Antes de schema upgrade:
probar:
- pagehide persisted;
- DB connection;
- restore.

No basar upgrade solo en unload.

## 23 · Estado R16

Práctica:
- lock ordering: **2/2 PASS**.

Auditoría:
- IDB versionchange handling: gap futuro identificado;
- blocked handling: revisado;
- BroadcastChannel lifecycle/protocol: revisado;
- revision + lock layers: comprendidos.

Marcador:
`MOTOR_MULTITAB_IDB_LOCKING_STUDIED_R16`

No:
- DB_VERSION change;
- close handler;
- protocol change;
- build;
- merge;
- deploy;
- main/production.
