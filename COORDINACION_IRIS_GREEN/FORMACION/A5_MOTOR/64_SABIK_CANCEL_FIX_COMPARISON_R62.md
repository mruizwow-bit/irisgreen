# MOTOR · A5 · LABORATORIO R62 · COMPARACIÓN DE FIXES PARA CANCEL/RETRY

Fecha: 01/10/2026
Amplía: R61
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No crea PR.
No es aprobación de fix.

## 1 · Objetivo

Comparar dos correcciones mínimas posibles para el defecto confirmado en R61.

Problema:
`cancel()` puede dejar:

```
state = presente
requested = orientar
```

y un retry `orientar` puede devolver `unchanged:true`.

## 2 · Baseline canónico

Archivo:
`sabik/sabik-motion-r37.js`

Blob:
`292742308a9181215767e05ebccd2cb9c71b0e63`

La suite actual:
`tools/test-sabik-motion-r37.js`

cubre:
- matriz 5×5×3;
- interrupción entre acciones;
- stale decode;
- transient states;
- failures;
- reduced motion.

No cubre:
`controller.cancel() → retry same requested state`.

## 3 · Candidate A

Cambio conceptual:

```js
function cancel() {
  ++revision;
  ...
  pending.clear();
  requested = state;
  describe(...);
}
```

Idea:
cancel devuelve la intención solicitada al último estado realmente aplicado.

## 4 · Candidate B

Cambio conceptual:

```js
if (
  next === requested &&
  next === state &&
  nextLevel === level &&
  ...
) return unchanged;
```

Idea:
no considerar unchanged si requested y state divergen.

## 5 · Test de cancel/retry · Candidate A

Después de cancel:

```json
{
  "state":"presente",
  "requested":"presente"
}
```

Retry start:

```json
{
  "state":"presente",
  "requested":"orientar"
}
```

Final:

```json
{
  "state":"orientar",
  "requested":"orientar"
}
```

Loads:
```
orientar
orientar
```

Applied:
```
orientar
```

PASS.

## 6 · Test de cancel/retry · Candidate B

Después de cancel:

```json
{
  "state":"presente",
  "requested":"orientar"
}
```

Retry sí vuelve a cargar y termina correctamente.

PASS funcional de retry.

Pero:
snapshot sigue mostrando una intención solicitada que ya fue cancelada.

La inconsistencia de estado interno permanece hasta la siguiente acción.

## 7 · Regression matrix

Ambos candidatos fueron sometidos a:

- 5 states × 5 states × 3 levels
  = **75 transitions**;
- CONFIRMAR → PRESENTE;
- TRANSICIÓN → destino;
- load failure fail-soft.

Resultados:

### Candidate A
- 75/75 transition matrix PASS;
- transients PASS;
- failure PASS;
- cancel/retry PASS.

### Candidate B
- 75/75 transition matrix PASS;
- transients PASS;
- failure PASS;
- cancel/retry PASS.

## 8 · Diferencia semántica

Candidate B:
arregla el síntoma del retry.

Candidate A:
arregla además la invariante observable de snapshot.

Después de `cancel()`:
`requested` debería representar una intención todavía pendiente/activa.

Si la intención fue cancelada:
mantener `requested=orientar` resulta semánticamente engañoso.

Por eso A tiene mejor coherencia de estado.

## 9 · Invariante propuesta

Para cancel explícita completada:

```
no active animation
no pending request
=> requested === state
```

Excepto si el contrato futuro define explícitamente otro estado como:
- desired target retained for resume.

R37 actual no documenta esa semántica.

## 10 · Hold caveat

No se cambia `hold` en Candidate A.

Motivo:
la semántica de hold tras cancel no está definida con suficiente claridad.

No mezclar dos decisiones en un fix mínimo.

Prueba futura:
- held orientar;
- cancel;
- retry;
- refresh.

## 11 · Transient caveat

Si cancel ocurre después de aplicar:
- confirmar;
- transicion;

pero antes de cargar destino final,
`state` puede ser transitorio.

Candidate A hace:
`requested = state`.

Eso es consistente con “último master aplicado”,
pero no decide si cancel debería:
- freeze transient;
- rollback;
- complete destination.

Esa semántica necesita decisión aparte.

No ampliar fix sin contrato.

## 12 · Recommended candidate for review

No es patch aprobado.

**Candidate A** es el candidato técnico preferible para revisión porque:
- restaura estado interno coherente;
- arregla retry;
- es mínimo;
- 75-transition regression passed;
- no cambia unchanged semantics global.

Astra debe decidir si:
- el API cancel merece soporte;
- se documenta la postcondition;
- se añade regression test.

## 13 · Regression test que falta en suite

Añadir cuando se autorice:

```
const waits = new Map();
const f = fixture(...deferred load...);

const first = f.controller.setSabikState('orientar');
await tick();

f.controller.cancel();
assert((await first).cancelled);

assert.equal(f.controller.snapshot().requested,
             f.controller.snapshot().state);

const retry = f.controller.setSabikState('orientar');
await tick();

assert.equal(loadCount('orientar'), 2);

resolveSecond();
await retry;
assert.equal(f.controller.snapshot().state,'orientar');
```

## 14 · Why not change today

Jornada:
Formación.

Además:
reachability actual del cancel explícito desde `sabik-web-r01.js` no está establecida.

El fix se debe:
- triage;
- autorizar;
- implementar;
- ejecutar suite original;
- browser test;
- integration gate.

## 15 · Resultado

`CANDIDATE_A_RESET_REQUESTED_TO_STATE_PREFERRED_FOR_REVIEW`

`CANDIDATE_B_RETRY_FIXES_SYMPTOM_BUT_LEAVES_STATE_DESYNC`

`BOTH_75_TRANSITION_REGRESSION_PASS`

## 16 · Marcador

`MOTOR_SABIK_CANCEL_FIX_COMPARISON_LAB_PASS_R62`

## 17 · Límites

No:
- product patch;
- issue severity;
- merge;
- deploy;
- release recommendation.
