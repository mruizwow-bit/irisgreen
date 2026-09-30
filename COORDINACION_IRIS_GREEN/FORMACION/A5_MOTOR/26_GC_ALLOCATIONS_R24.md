# MOTOR · A5 · ESTUDIO PROFUNDO R24 · GC PRESSURE, HOT LOOPS Y RESOURCE REUSE

Fecha: 30/09/2026
Amplía: R01–R23
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · GC automático no significa coste cero

Fuentes:
- MDN · Memory management
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management
- Chrome DevTools · Memory
  https://developer.chrome.com/docs/devtools/memory-problems

JavaScript asigna memoria automáticamente y GC recupera objetos inalcanzables.

Motor sigue siendo responsable de:
- no filtrar referencias;
- no generar basura innecesaria en rutas calientes;
- no mantener caches ilimitadas.

## 2 · Allocation pressure

Una asignación corta no es un problema por sí sola.

Miles por segundo pueden:
- llenar young generation;
- provocar GC frecuentes;
- introducir pausas/jitter;
- aumentar energía.

La importancia depende de:
- engine;
- objeto;
- tasa;
- dispositivo;
- sesión.

Medir.

## 3 · Object pooling: no dogma

Pooling puede ayudar cuando:
- objetos costosos;
- frecuencia extrema;
- profiler muestra GC;
- lifecycle claro.

Puede empeorar:
- código;
- bugs de reset;
- memoria retenida;
- cache locality.

Primero intentar:
- reusable temporaries;
- typed arrays;
- stable buffers.

No crear pools generales sin evidencia.

## 4 · Three.js hot-path temporaries

Patrón:

```js
const tmp = new THREE.Vector3();

function update() {
  tmp.set(...);
}
```

mejor que:
```js
function update() {
  const tmp = new THREE.Vector3(...);
}
```

cuando update corre por frame y el objeto es realmente temporal.

## 5 · Auditoría Acuario

`tools/escenas-3d/src/aquarium.js`.

Dentro de update:
- usa vectores/matrices/quaternions temporales preexistentes;
- `dirV.copy(...)`;
- `tmpM...`;
- `tmpQ...`.

Patrón positivo:
resource reuse en hot loop.

## 6 · Auditoría Río

`tools/escenas-3d/src/river.js`.

Antes de update crea:
- `lm`;
- `lq`;
- `le`;
- `ls`;
- `lp`.

Dentro del loop:
- set/compose;
- no crea matrices/vectores por hoja cada frame.

Patrón positivo.

## 7 · Auditoría Medusas

`tools/escenas-3d/src/jelly.js`.

Dentro de update, por cada medusa:

```js
const up = new THREE.Vector3(0, 1, 0).applyEuler(...)
```

Hay 9 medusas.

Si update coincide con render:
- 60 Hz → 540 Vector3/s;
- 120 Hz → 1080 Vector3/s;
- 144 Hz → 1296 Vector3/s.

Esto NO demuestra jank.

Sí identifica hotspot candidato para allocation profiling.

## 8 · Mejora candidata, no ejecutada

Preasignar un temporal por loop o por medusa:

```js
const up = new THREE.Vector3();

for (...) {
  up.set(0,1,0).applyEuler(...);
  ...
}
```

Solo aplicar si:
- no hay reentrancy que requiera varios valores simultáneos;
- profiler demuestra beneficio o coste trivial de cambio.

## 9 · Poke vs frame

En `jelly.js`, `poke()` crea:
`const P = new THREE.Vector3()`.

Eso ocurre por interacción, no cada frame.

Prioridad menor.

Lección:
**la ubicación temporal de una asignación importa más que su mera existencia.**

## 10 · Arrays y snapshots

R43 usa JSON stringify/parse para clone helper.

Eso:
- asigna string intermedio;
- reconstruye objetos.

Pero ocurre en boundaries de history/commit, no necesariamente cada pointermove.

Antes de sustituir:
medir tamaño/frecuencia.

`structuredClone()` podría soportar más tipos, pero no necesariamente ser más rápido en todo caso.

## 11 · Typed arrays

Para datos numéricos densos:
- Float32Array;
- Uint8Array;
- etc.

Ventajas:
- layout compacto;
- transferencia Worker;
- GPU upload.

No usar para estructuras pequeñas semánticas donde objects son más legibles.

## 12 · Structure of Arrays vs Array of Structures

AoS:
```js
[{x,y,vx,vy}, ...]
```

SoA:
```js
x[]
y[]
vx[]
vy[]
```

SoA puede mejorar:
- iteración numérica;
- transfer;
- SIMD/Wasm/GPU.

Coste:
- legibilidad;
- ergonomía.

Adoptar solo para hot data.

## 13 · Object churn in events

Pointermove:
no crear grandes payloads/event objects extra por sample.

Coalesce:
- latest point;
- typed buffer;
- rAF batch.

Browser ya crea PointerEvent; no duplicar estructuras innecesarias.

## 14 · Closures

Closures no son malas.

Riesgo:
closure larga retiene:
- DOM;
- large arrays;
- scenes.

Cleanup listeners/observers rompe retention chains.

Conecta R03/R06.

## 15 · Strings

Concatenar grandes strings repetidamente puede asignar.

Para UI pequeña:
irrelevante.

Para:
- export;
- logs;
- generated code;
- giant JSON

medir.

## 16 · GPU allocations

JavaScript heap no incluye toda GPU memory.

Texturas/geometrías/materiales necesitan dispose explícito.

A5 3D ya lo hace en stop.

GC de JS no libera necesariamente GPU resource en momento útil.

## 17 · Asset cache

Cache sin límite = leak lógico aunque todos los objetos sean alcanzables “intencionadamente”.

Definir:
- max items;
- max bytes;
- LRU;
- release event

si cache crece con uso.

## 18 · Allocation profiling

Chrome DevTools:
- Allocation instrumentation on timeline;
- Allocation sampling;
- heap snapshots;
- detached DOM.

Prueba:
```text
idle baseline
→ interact 60s
→ stop
→ wait/GC diagnostic
→ compare retained allocations
```

## 19 · GC symptoms

Buscar:
- periodic long frames;
- sawtooth memory;
- increasingly frequent GC;
- allocation stack concentrated in hot function.

No diagnosticar GC solo por “un tirón”.

## 20 · Energy

Asignar/GC/render continuamente también consume batería.

MDN recomienda no mantener timers/animations innecesarios cuando app está background.

Iris Green:
calm experiences deben ser especialmente cuidadosas con trabajo invisible.

## 21 · Reduced motion and compute

Reduced motion puede permitir:
- menos updates;
- menor density;
- lower render frequency

si la función se conserva.

No limitarse a “misma simulación pero CSS sin transform”.

## 22 · 120/144 Hz

Higher refresh rate puede:
- duplicar/triplicar hot-loop frequency.

Una ruta que no molesta a 60 Hz puede asignar mucho más a 144 Hz.

Medir en tiempo, no en “per frame” únicamente.

## 23 · Practical priority

Orden:
1. leak;
2. unbounded retention;
3. per-frame large allocations;
4. unnecessary repeated clones;
5. micro allocation trivia.

No optimizar bytes mientras existe listener leak.

## 24 · Estado R24

Auditoría read-only:
- Acuario hot loop: reuse positivo;
- Río hot loop: reuse positivo;
- Medusas: candidate per-frame allocation identificado;
- R43 snapshot clone: clasificado como boundary, no frame hot path.

Cálculo:
- 540 / 1080 / 1296 Vector3 allocations por segundo a 60/120/144 Hz, si update = render.

Marcador:
`MOTOR_GC_ALLOCATION_HOTLOOP_STUDIED_R24`

No:
- object pool;
- code optimization;
- 3D modification;
- build;
- merge;
- deploy;
- main/production.
