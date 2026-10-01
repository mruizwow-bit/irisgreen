# MOTOR · A5 · LABORATORIO R52 · LIFECYCLE DE OBSERVERS Y LISTENERS

Fecha: 01/10/2026
Amplía: R48/R50/R51
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Comprobar una condición arquitectónica de R48:

> retirar una UI del DOM no equivale necesariamente a destruir sus observers/listeners si los objetos siguen vivos.

Esto es relevante para:
`assets/ig-taller-r42-direct.js`,
donde cada upgrade crea:
- MutationObserver;
- ResizeObserver;
- listeners pointer/keyboard;

sin exponer hoy un `destroy()`.

## 2 · Entorno aislado

- Chromium 144.0.7559.96;
- Playwright;
- DOM mínimo;
- MutationObserver real;
- ResizeObserver real;
- EventTarget listener real con AbortSignal.

No se ejecutó Iris Green integrada.

## 3 · Secuencia

1. crear wrapper + button;
2. montar en DOM;
3. observar button con MutationObserver;
4. observar wrapper con ResizeObserver;
5. añadir click listener con AbortSignal;
6. mutar attribute;
7. retirar wrapper del DOM;
8. mutar button aún referenciado;
9. hacer click while detached;
10. reinsertar wrapper;
11. mutar/click otra vez;
12. disconnect observers + abort signal;
13. mutar/click después de cleanup.

## 4 · Resultado

```json
{
  "mounted": {
    "mutationCalls": 1,
    "clickCalls": 0,
    "resizeCalls": 1
  },
  "detached": {
    "mutationCalls": 2,
    "clickCalls": 1,
    "resizeCalls": 1,
    "isConnected": false
  },
  "reattached": {
    "mutationCalls": 3,
    "clickCalls": 2,
    "resizeCalls": 1,
    "isConnected": true
  },
  "cleaned": {
    "mutationCalls": 3,
    "clickCalls": 2,
    "resizeCalls": 1
  }
}
```

## 5 · PASS · MutationObserver sigue vivo tras detach

Antes:
`mutationCalls = 1`.

Tras retirar wrapper y mutar button:
`mutationCalls = 2`.

PASS.

Demuestra:
**DOM removal no desconecta automáticamente un MutationObserver de un nodo que sigue vivo/referenciado.**

## 6 · PASS · Event listener sigue vivo tras detach

Button detached:
`button.click()` incrementó:
`clickCalls 0 → 1`.

Tras reattach:
`1 → 2`.

PASS.

Demuestra:
**listener pertenece al EventTarget, no a su presencia actual en el documento.**

## 7 · PASS · explicit cleanup

Después de:
- `mo.disconnect()`;
- `ro.disconnect()`;
- `ac.abort()`;

nueva mutación/click no incrementó contadores.

PASS.

Demuestra:
cleanup explícito corta ownership activo.

## 8 · ResizeObserver caveat

`resizeCalls` se mantuvo en 1 durante detach/reattach en este laboratorio.

No significa:
- observer automáticamente desconectado;
- que no pueda volver a notificar ante cambios de size/layout;
- que no retenga relaciones internas.

No existe introspección simple `isObserved()`.

Por tanto:
no se usa ese contador para afirmar leak/no-leak.

## 9 · Qué NO demuestra

No prueba una fuga de memoria en A5.

Para fuga real se necesitaría:
- mount/unmount repetido del runtime real;
- liberar referencias externas;
- GC/heap observation;
- comprobar retención de nodes/closures;
- comparar tendencias.

Un ciclo referenciado puede ser recolectable si todo el grafo queda inalcanzable.

## 10 · Qué sí demuestra para arquitectura

Si una UI:
- se retira;
- pero algún owner conserva referencia;
- o puede reinsertarse/reutilizarse;

sus observers/listeners seguirán activos salvo cleanup explícito.

Por eso un componente dinámico necesita:
```
mount()
destroy()
```
o lifecycle owner equivalente.

## 11 · Aplicación a R42 direct

Current code:
- `var obs = new MutationObserver(...)`;
- `new ResizeObserver(fit).observe(wrap)`;
- listeners sobre canvas;
- no destroy retornado.

Mientras:
lifecycle = página/estudio completo,
puede ser aceptable.

Si evoluciona a:
- SPA;
- hot replacement;
- repeated mount;
- virtualization;
- panel dynamic;

R52 indica que debe añadirse ownership explícito.

## 12 · Better pattern

Concepto:

```js
function mount() {
  const ac = new AbortController();
  const mo = new MutationObserver(...);
  const ro = new ResizeObserver(...);

  // listeners with signal
  // observers

  return function destroy() {
    ac.abort();
    mo.disconnect();
    ro.disconnect();
    cancelAnimationFrame(pendingRaf);
  };
}
```

No aplicar hoy sin necesidad de producto.

## 13 · AbortSignal advantage

Un controller puede retirar muchos listeners con una sola acción.

No cubre automáticamente:
- MutationObserver;
- ResizeObserver;
- Worker;
- GPU resources.

Esos requieren su dispose específico.

## 14 · Lifecycle ownership table

| Resource | Cleanup |
|---|---|
| event listener | AbortSignal/removeEventListener |
| MutationObserver | disconnect |
| ResizeObserver | disconnect |
| rAF | cancelAnimationFrame |
| timer | clearTimeout/clearInterval |
| Worker | terminate/protocol shutdown |
| MessagePort | close |
| AudioContext | suspend/close per owner |
| WebGL resource | dispose/delete/rebuild |
| object URL | revokeObjectURL |

## 15 · Mount idempotence

Un `enhance()` que evita doble mount mediante dataset flag ayuda.

Pero:
si subtree se elimina y crea uno nuevo:
el flag del antiguo no gobierna el nuevo.

Dynamic architecture necesita lifecycle explícito, no solo “already enhanced”.

## 16 · Testing futuro A5 real

Cuando exista dynamic mount:

1. mount 100×;
2. destroy 100×;
3. count:
   - callbacks;
   - listeners where observable;
   - observers via instrumentation;
   - DOM nodes;
   - heap trend;
4. trigger input;
5. comprobar un solo reaction.

## 17 · Resultados

Checks:
1. MutationObserver after detach: PASS.
2. listener after detach: PASS.
3. behavior after reattach: PASS.
4. explicit disconnect/abort stops callbacks: PASS.

**4/4 PASS.**

## 18 · Marcador

`MOTOR_OBSERVER_LISTENER_LIFECYCLE_LAB_PASS_R52`

## 19 · Límites

No:
- leak claim;
- product issue;
- destroy API product change;
- build;
- merge;
- deploy;
- main/production.
