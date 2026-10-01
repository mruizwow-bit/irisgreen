# MOTOR · A5 · LABORATORIO R61 · CANCEL/RETRY CONTRACT EN SABIK MOTION

Fecha: 01/10/2026
Amplía: R59/R60
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre issue de producto durante Formación.

## 1 · Objetivo

Ejecutar el **blob canónico exacto** de:

`sabik/sabik-motion-r37.js`

y probar carreras/cancelación del controller.

Blob SHA GitHub:
`292742308a9181215767e05ebccd2cb9c71b0e63`.

La reproducción final se ejecutó directamente sobre el contenido devuelto por GitHub, no sobre una copia manual.

## 2 · Pruebas de carreras

Escenarios ejecutados sobre el controller:

1. A lenta → B rápida;
2. cancel durante load;
3. transient final load superseded;
4. late animation finish;
5. load failure.

Resultado inicial:
**5/5 contracts principales protegidos** en el laboratorio.

Fortalezas observadas:
- revision/ticket evita stale apply;
- pending promise se cancela;
- old animation completion no sobrescribe state nuevo;
- asset failure hace fail-soft.

## 3 · Hallazgo adicional

Escenario:

```
state = presente
setSabikState("orientar")
load("orientar") queda pendiente
controller.cancel()
retry setSabikState("orientar")
```

Estado después de cancel:

```json
{
  "state": "presente",
  "requested": "orientar",
  "level": "NORMAL",
  "active": false,
  "hold": false
}
```

Retry:

```json
{
  "unchanged": true,
  "state": "presente"
}
```

Loads:
```json
["orientar"]
```

No hubo segundo load.

## 4 · Causa exacta

`cancel()`:

- incrementa revision;
- cancela animation;
- resuelve pending;
- limpia map;

pero NO hace:
`requested = state`.

Después, el guard al inicio de `setSabikState`:

```js
if (
  next === requested &&
  nextLevel === level &&
  !options.force &&
  Boolean(options.hold) === hold
) return Promise.resolve({unchanged:true,state});
```

ve:
- next = orientar;
- requested = orientar;

y considera la segunda petición unchanged,
aunque `state` sigue siendo presente y el asset orientar nunca se aplicó.

## 5 · Reproducción exacta sobre GitHub

Se ejecutó directamente:

```
fetch_file(sabik/sabik-motion-r37.js)
→ eval exact content
→ createController
→ deferred load
→ cancel
→ retry same state
```

Resultado:

```json
{
  "github_blob_sha": "292742308a9181215767e05ebccd2cb9c71b0e63",
  "beforeCancel": {
    "state": "presente",
    "requested": "orientar"
  },
  "firstResult": {
    "cancelled": true
  },
  "afterCancel": {
    "state": "presente",
    "requested": "orientar"
  },
  "retryResult": {
    "unchanged": true,
    "state": "presente"
  },
  "loads": ["orientar"],
  "applied": []
}
```

**REPRODUCED_ON_CANONICAL_BLOB**.

## 6 · Clasificación

No se clasifica todavía como:
- incident;
- production bug;
- P0/P1;
- user-visible regression.

Clasificación correcta:

`LATENT_CONTROLLER_API_CONTRACT_DEFECT_CONFIRMED`

Porque:
- el método `cancel()` forma parte del objeto público devuelto por `createController`;
- su postcondition deja `requested` desalineado de `state`;
- retry del mismo requested puede no-op incorrectamente.

## 7 · Reachability actual

Se revisó:
`sabik/sabik-web-r01.js`.

El controller se guarda en closure privada.

API pública de `window.SabikWebPresentation` expone:
- render;
- contextChange;
- setSabikState;
- snapshot.

No expone:
- controller.cancel.

`refresh()` usa:
`setSabikState(...force:true,static:true)`.

Rutas normales de `setSabikState`:
invocan `cancel()` internamente,
pero después asignan inmediatamente:
`requested = next`.

Por tanto:

**no se ha demostrado reachability del defecto desde el montaje web actual.**

## 8 · Impacto potencial futuro

Puede manifestarse si:
- otro caller usa directamente `createController().cancel()`;
- el API se expone más adelante;
- un test/utilidad reutiliza controller;
- una integración futura cancela durante load y luego reintenta mismo state.

## 9 · Fix candidate conceptual

No ejecutar durante Formación.

Postcondition razonable de cancel podría ser:

```js
requested = state;
hold = false; // solo si semántica de cancel lo define
```

o modificar el unchanged guard para exigir:
`next === state`
además de `next === requested`.

Pero:
la semántica exacta debe decidirse antes de cambiar.

No aplicar fix desde la práctica.

## 10 · Regression test mínimo futuro

```
start orientar with deferred load
cancel
assert snapshot.state === presente
retry orientar
assert load called second time
resolve
assert state === orientar
```

También:
- cancel active animation;
- cancel transient final load;
- cancel held state;
- refresh after cancel.

## 11 · Handoff correcto

Destino:
**Astra** para priorización/gate.
Motor puede aportar fix cuando se autorice.

No necesita Pulso por defecto:
el hallazgo está en presentation controller API, no transport.

Axioma solo si cambia motion semantics visible.

## 12 · Regla de evidencia aprendida

Antes de escalar:

1. reproduce;
2. verify canonical blob;
3. identify exact invariant;
4. check reachability;
5. separate latent API defect from current product impact.

Eso evita:
- alarmismo;
- fixes prematuros;
- false production claims.

## 13 · Marcadores

`MOTOR_SABIK_CANCEL_RETRY_CANONICAL_REPRO_PASS_R61`

`SABIK_MOTION_CANCEL_REQUESTED_DESYNC_CONFIRMED_LATENT_API_DEFECT`

`CURRENT_WEB_PRESENTATION_REACHABILITY_NOT_ESTABLISHED`

## 14 · Límites

No:
- código productivo;
- issue;
- PR;
- build;
- merge;
- deploy;
- production claim.
