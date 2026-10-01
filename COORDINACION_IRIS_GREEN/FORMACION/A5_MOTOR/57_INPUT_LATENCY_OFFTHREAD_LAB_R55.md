# MOTOR · A5 · LABORATORIO R55 · INPUT LATENCY BAJO CARGA

Fecha: 01/10/2026
Amplía: R08/R20/R31/R54
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Demostrar en navegador la diferencia entre:

A. ejecutar 80 ms de cálculo síncrono dentro de un evento `input`;

B. enviar el mismo orden de trabajo CPU a un Worker y dejar libre el main thread.

Métrica del laboratorio:
tiempo desde inicio del handler hasta el siguiente `requestAnimationFrame`.

No es INP de campo.
No es benchmark de Iris Green.

## 2 · Entorno

- Chromium 144.0.7559.96;
- Playwright;
- documento aislado;
- 5 muestras por escenario;
- Worker generado desde Blob;
- CPU work intencionadamente artificial: busy loop ~80 ms.

Evidence label:
`CHROMIUM_LAB_PASS`.

## 3 · Escenario A · trabajo síncrono

Handler:

```js
input.addEventListener('input', () => {
  const start = performance.now();
  busy(80);
  requestAnimationFrame(() => {
    record(performance.now() - start);
  });
});
```

Resultados ms:

```text
80.4
80.3
80.4
80.3
80.3
```

Mediana:
**80.3 ms**.

Media:
**80.34 ms**.

## 4 · Interpretación A

El main thread no pudo llegar al siguiente frame hasta terminar el trabajo síncrono.

El cálculo estaba dentro del camino crítico:

`input → 80ms CPU → rAF/paint opportunity`.

PASS como demostración de bloqueo.

## 5 · Escenario B · Worker

Handler:

```js
input.addEventListener('input', () => {
  const start = performance.now();
  worker.postMessage(...);
  requestAnimationFrame(() => {
    record(performance.now() - start);
  });
});
```

El Worker ejecutó un busy loop de aproximadamente 80 ms.

Resultados del siguiente rAF en main:

```text
9.9
0.4
0.3
0.2
0.6
```

Mediana:
**0.4 ms**.

Media:
**2.28 ms**.

## 6 · Worker CPU duration

Duraciones observadas ms:

```text
82.1
80.1
80.0
80.0
80.0
```

Mediana:
**80.0 ms**.

Media:
**80.44 ms**.

## 7 · Lección central

El Worker NO hizo el cálculo “gratis”.

El trabajo seguía costando ~80 ms de CPU.

Lo que cambió:
**dejó de bloquear el main thread y el siguiente paint.**

Regla:

```
OFFTHREAD != CHEAPER
OFFTHREAD = DIFFERENT SCHEDULING / ISOLATION
```

## 8 · Por qué importa en editores

Durante escritura:
la persona espera:
- caret;
- glyph;
- selection;
- feedback

inmediatos.

No poner en el handler:
- parser pesado;
- syntax analysis completo;
- export;
- large serialization;
- simulation;
- image processing.

## 9 · Worker no siempre es solución

Costes:
- startup;
- serialization;
- postMessage;
- ownership;
- cancellation;
- queueing;
- memory.

Para trabajo de 0.2 ms:
un Worker puede ser peor.

Adoption gate:
**medir primero.**

## 10 · Input architecture

Preferir:

```
INPUT
→ update small synchronous model
→ paint/feedback
→ enqueue expensive secondary work
→ Worker/chunk
→ stale ownership check
→ apply optional result
```

## 11 · Stale results

Si usuario escribe de nuevo:
análisis viejo puede terminar después.

R02/R28:
- request ID;
- revision;
- cancellation/coalescing.

No aplicar análisis de texto A sobre texto B.

## 12 · Latest-wins

Para:
- preview;
- lint;
- search suggestion;
- syntax analysis

puede ser correcto descartar trabajo intermedio.

Para:
- save;
- export;
- irreversible command

no.

## 13 · Worker backpressure

Si input 10 Hz y Worker tarda 80 ms:
cola puede crecer cerca del límite de estabilidad.

Si input 30 Hz:
producer > consumer.

R28:
- latest-state coalescing;
- bounded queue;
- credit window.

Offthread sin backpressure puede convertir latency en memory queue.

## 14 · Autosave

Autosave:
- debounce/coalesce;
- persistence async;
- no JSON.stringify gigante en cada tecla si mide caro.

Si serialization pesada:
Worker posible.

Pero IndexedDB write ownership y state version deben mantenerse.

## 15 · UI update after Worker

No aplicar resultado inmediatamente si:
- focus changed;
- editor destroyed;
- revision stale;
- result belongs to old document.

Pattern:

```
if (result.revision !== currentRevision) discard
```

## 16 · rAF metric caveat

En 4 muestras Worker:
rAF ocurrió <1 ms después del handler porque se ejecutó cerca del próximo frame opportunity.

Una muestra:
9.9 ms.

Esto es normal:
rAF timing depende de posición dentro del refresh cycle.

Por eso:
no interpretar 0.4 ms como “input latency universal”.

La comparación sí demuestra:
80 ms sync work bloqueó el main thread.

## 17 · Headless caveat

El laboratorio:
- headless Chromium;
- synthetic simple DOM;
- no CSS/layout complejo;
- no real editor.

No extrapolar números absolutos.

## 18 · Real-editor next test

Cuando desarrollo se reanude:

Taller Escritura:
- document sizes;
- actual parser;
- autosave;
- spelling/analysis;
- IME;
- mobile.

Medir:
- input delay;
- processing;
- next paint;
- INP-like Event Timing where available.

## 19 · Accessibility

Offthread analysis must not delay:
- input;
- focus;
- live region essential feedback.

No anunciar cada intermediate worker result.

## 20 · CPU saturation

Muchos Workers también pueden competir por CPU y batería.

A main thread libre no garantiza device cool/efficient.

R25 energy/adaptive quality.

## 21 · Resultados

Checks:
1. sync workload ≈80 ms: PASS.
2. next paint sync delayed ≈80 ms: PASS.
3. worker workload ≈80 ms: PASS.
4. main next paint median <1 ms in lab: PASS.
5. work still consumed CPU: explicitly confirmed.

## 22 · Marcador

`MOTOR_INPUT_LATENCY_OFFTHREAD_LAB_PASS_R55`

## 23 · Límites

No:
- claim de INP real;
- Worker feature change;
- editor change;
- build;
- merge;
- deploy;
- main/production.
