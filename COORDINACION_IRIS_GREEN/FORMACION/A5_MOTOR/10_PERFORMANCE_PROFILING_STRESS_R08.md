# MOTOR · A5 · ESTUDIO PROFUNDO R08 · PERFORMANCE ENGINEERING, PROFILING Y STRESS

Fecha: 30/09/2026
Amplía: R01–R07
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla profesional

**Performance es comportamiento temporal bajo carga.**

No significa:
- Lighthouse alto;
- 60 FPS una vez;
- “se siente rápido”;
- 0 errores de consola.

Motor debe medir:
- input delay;
- processing;
- presentation;
- frame/render;
- layout/paint;
- CPU;
- memoria;
- recursos;
- sesiones largas;
- dispositivos lentos;
- degradación.

## 2 · INP por fases

Fuentes:
- Chrome DevTools · INP breakdown
  https://developer.chrome.com/docs/performance/insights/inp-breakdown
- web.dev · Optimize INP
  https://web.dev/articles/optimize-inp

Descomposición:
```text
INTERACTION
├─ input delay
├─ processing duration
└─ presentation delay
```

### Input delay alto
otro trabajo bloquea main thread antes de procesar la intención.

### Processing alto
handlers/lógica de la interacción son caros.

### Presentation alto
render/style/layout/paint/composite retrasan el cambio visible.

Regla:
optimizar la fase causal, no “JavaScript” en abstracto.

## 3 · 60 FPS no es un contrato universal

`requestAnimationFrame` sigue la tasa de refresco.

Aproximaciones:
- 60 Hz → 16.7 ms;
- 90 Hz → 11.1 ms;
- 120 Hz → 8.3 ms;
- 144 Hz → 6.9 ms.

No gastar todo el intervalo en JS:
el navegador necesita style/layout/paint/composite.

Regla:
**animar por timestamp y medir en varios refresh rates/perfiles cuando el producto lo requiera.**

## 4 · Long Tasks

Fuente:
- MDN · PerformanceLongTaskTiming
  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming

Una long task ocupa UI thread ≥50 ms.

Impacto:
- input latency;
- event handling latency;
- jank.

Estado:
Limited availability / experimental.

Uso:
diagnóstico progresivo.

No:
gate universal.

## 5 · Long Animation Frames

Fuentes:
- Chrome · Long Animation Frames API
  https://developer.chrome.com/docs/web-platform/long-animation-frames
- MDN · Long animation frame timing
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Long_animation_frame_timing

LoAF mira un problema distinto:
un render completo puede acumular varias tasks antes de presentar frame.

Útil para:
- presentation delay;
- style/layout;
- scripts dentro del frame.

Feature detection:
`PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')`.

## 6 · PerformanceObserver

Fuentes:
- MDN · Performance APIs
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API
- MDN · Performance data
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Performance_data

Entradas relevantes:
- event;
- longtask;
- layout-shift;
- resource;
- navigation;
- paint;
- largest-contentful-paint;
- marks/measures.

Cuidado:
buffers tienen límites.

El callback puede recibir `droppedEntriesCount`.

Regla:
si se perdieron muestras, la medición debe declararlo.

## 7 · User Timing

`performance.mark()` + `performance.measure()`.

Motor debe instrumentar hitos de dominio:

```text
input
calculation-start
calculation-end
render-start
visible-result
```

No llenar timeline con miles de marks por frame.

Medir transacciones humanas relevantes.

## 8 · Resource Timing

Fuentes:
- MDN · Resource Timing
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Resource_timing
- MDN · Navigation and resource timings
  https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Navigation_and_resource_timings

Útil para:
- scripts;
- media;
- models;
- images;
- fetch;
- lazy engines.

Separar:
- descarga;
- parse/eval;
- ejecución.

Un script pequeño puede ser caro de evaluar.
Un asset grande puede no bloquear interacción si está bien diferido.

## 9 · Script evaluation

Fuente:
- web.dev · Script evaluation and long tasks
  https://web.dev/articles/script-evaluation-and-long-tasks

Carga JS implica:
- fetch;
- parse;
- compile;
- execute.

Regla:
“lazy-loaded” no significa gratis.
Puede mover una long task al primer click.

Para motores A5:
medir:
`click Open → code ready → workspace usable`.

## 10 · CSS/style profiling

Fuente:
- Chrome DevTools · CSS selector performance
  https://developer.chrome.com/docs/devtools/performance/selector-stats

Recalculate Style puede contribuir a presentation delay.

No optimizar selectores por folklore.

Medir:
- selector match attempts;
- elapsed;
- DOM size;
- mutaciones que disparan recalc.

Containment puede reducir alcance cuando la arquitectura lo permite.

## 11 · Memoria en sesiones largas

Fuente:
- Chrome DevTools · Fix memory problems
  https://developer.chrome.com/docs/devtools/memory-problems

Tipos:
- leak;
- bloat;
- frequent GC.

Symptoms:
- degradación progresiva;
- pausas GC;
- tab pesada;
- crash móvil.

Prueba Motor:
```text
mount
interact 2–5 min
destroy
repeat xN
heap snapshots
detached nodes
retained size
```

No comparar solo `usedJSHeapSize`.

## 12 · Synthetic vs field

### Lab
Ventajas:
- reproducible;
- failure injection;
- CPU/network throttling;
- exact scenario.

### Field
Ventajas:
- hardware real;
- navegadores reales;
- comportamiento real;
- long tail.

No confundir:
un CI rápido con usuarios reales rápidos.

Vigía conserva ownership de telemetría/privacidad de campo.

Motor define qué señal técnica sería útil.

## 13 · CPU throttling

Chrome recomienda CPU throttling para reproducir interacciones lentas de máquinas menos potentes.

Regla:
un motor creativo debe probarse:
- baseline dev machine;
- throttled CPU;
- software GPU cuando tenga sentido;
- móvil físico/HUMAN QA cuando aplique.

## 14 · Stress scenarios

### Rapid input
100+ pointer moves / repeated keys.

### Resize storm
ventana/orientation/container changes.

### Open/close
panels repeatedly.

### Mount/unmount
N ciclos.

### Long session
10–30 min para media/games/creative tools.

### Background/restore
hide → resume / bfcache.

### Capability fail
worker/GPU/storage unavailable.

### Supersedence
new action before old completes.

## 15 · Performance budgets deben ser contextuales

No inventar un único número para todo Iris Green.

Ejemplos:
- input feedback crítico: debe sentirse inmediato;
- export pesado: puede tardar, pero debe mostrar estado/cancelación;
- 3D calm scene: estabilidad sostenida;
- drawing: pointer-to-paint latency;
- search: typing responsiveness.

Presupuesto:
`TASK + DEVICE CLASS + CONTEXT + USER EXPECTATION`.

## 16 · A5 histórico · gate vs profiling

`scripts/test_r43_a5_advanced_taller.js`:
excellent static contract for:
- no stage persistence;
- engine presence;
- direct input;
- local-only;
- reduced motion CSS.

Pero no mide:
- startup latency;
- pointer-to-paint;
- history cost;
- memory growth;
- resize cost;
- session stability.

R08 añade ese marco.

## 17 · R22 como ejemplo de evidencia honesta

`reports/web-r22/README.md` documenta:
- 2022 browser cases;
- 320/1280;
- axe;
- target size;
- focus;
- SwiftShader;
- no-JS;
- límites explícitos.

Lección profesional:
la evidencia buena declara lo que NO demuestra.

Ejemplos del propio informe:
- SwiftShader ≠ GPU física;
- axe 0 violations ≠ conformidad global;
- automated ≠ screen reader real.

Motor mantiene el mismo estándar epistemológico en performance.

## 18 · Perfil mínimo por motor interactivo

```text
IDENTITY
STATE
STARTUP
FIRST_INTERACTION
WORST_INTERACTION
MAIN_THREAD
RENDER
MEMORY
CLEANUP
BACKGROUND
FAILURE
DEVICE
LIMITS
```

## 19 · Evidence format

Por prueba:

```text
SCENARIO
BUILD/HEAD
BROWSER
DEVICE/EMULATION
CPU/GPU MODE
INPUT
MEASURE
RESULT
LIMIT
RAW EVIDENCE
INTERPRETATION
NOT PROVED
```

No:
“Performance PASS” sin contexto.

## 20 · Regression testing

Comparar:
- candidate vs baseline;
- misma ruta;
- misma interacción;
- mismo hardware/emulation;
- varias repeticiones.

No decidir por una ejecución.

Usar distribución:
- median;
- p75/p95 cuando hay suficientes muestras;
- outliers investigados.

## 21 · RUM privacy boundary

Field instrumentation puede recoger:
- timings;
- device/browser characteristics;
- URLs/context.

Antes:
Vigía + Lex/Axioma según materia.

Motor no añade analytics por necesidad de profiling.

## 22 · Estado R08

Estudiado:
- INP breakdown;
- Long Tasks;
- LoAF;
- PerformanceObserver;
- Resource Timing;
- User Timing;
- CSS profiling;
- memory profiling;
- lab/field;
- stress/regression methodology.

Marcador:
`MOTOR_RUNTIME_PERFORMANCE_PROFILING_STRESS_STUDIED_R08`

No:
- telemetry;
- build;
- product change;
- merge;
- deploy;
- main/production.
