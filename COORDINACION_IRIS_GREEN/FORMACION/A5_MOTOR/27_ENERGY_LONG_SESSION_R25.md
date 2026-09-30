# MOTOR · A5 · ESTUDIO PROFUNDO R25 · ENERGY, LONG SESSIONS Y ADAPTIVE QUALITY

Fecha: 30/09/2026
Amplía: R01–R24
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Performance también es energía

Una interfaz puede:
- no jankear;
- pero gastar CPU/GPU innecesariamente;
- calentar móvil;
- consumir batería.

Especialmente relevante en:
- Rincón;
- escenas calmantes;
- audio largo;
- simulaciones abiertas.

## 2 · Background

Fuentes:
- MDN · Page Visibility API
  https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- MDN · requestAnimationFrame
  https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

Browsers:
- suelen pausar rAF en tabs ocultas;
- throttle timers.

Motor no depende solo del throttling automático.

Al hidden:
- pause simulations/media work cuando proceda;
- stop expensive custom loops;
- retain domain state.

## 3 · Audit 3D

`tools/escenas-3d/src/index.js`:

- rAF loop;
- `if (!document.hidden)`;
- idle update throttled;
- `powerPreference:'low-power'`;
- adaptive pixel ratio;
- DPR cap.

Patrones positivos para experiencia larga.

## 4 · Adaptive resolution

Current:
si average frame interval empeora:
reduce DPR interno.

Eso mantiene:
- CSS size;
- scene composition;

y sacrifica nitidez antes de frame stability.

Regla:
**degradar resolución antes que interacción**, cuando producto lo permita.

## 5 · Hysteresis

Adaptive quality no debe oscilar:
```text
1.0 → .8 → 1.0 → .8 every second
```

Necesita:
- ventana;
- thresholds separados;
- cooldown;
- bounded levels.

El runtime actual ya usa ventana y diferencia thresholds.

Buen patrón.

## 6 · Reduced motion != low power

Son señales distintas.

### Reduced motion
preferencia sensorial.

### Low-power adaptation
capacidad/carga.

No inferir una de otra.

Una persona puede querer:
- motion normal en dispositivo lento;
- no motion en dispositivo potente.

## 7 · Low intensity Iris Green

Sabik tiene lowIntensity además de reduced motion.

Regla:
control explícito del producto puede tener precedencia sobre heurística técnica.

No cambiar experiencia sensorial silenciosamente por “benchmark” si afecta significado.

## 8 · hardwareConcurrency

Fuente:
- MDN · navigator.hardwareConcurrency
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency

Widely available.

Puede devolver número reducido por user agent.

Uso:
orientar worker pool.

No:
“8 cores = high-end device”.

## 9 · Worker pool sizing

No crear:
`hardwareConcurrency` workers automáticamente.

Reserva:
- main/browser;
- audio;
- OS.

Para jobs CPU:
```text
min(problem parallelism, conservative cap)
```

Benchmark.

Iris Green hoy usa dedicated Worker simple, no pool.

Correcto para workload actual.

## 10 · Device Memory

Fuente:
- MDN · Device Memory API
  https://developer.mozilla.org/en-US/docs/Web/API/Device_Memory_API

Limited availability.

Valor aproximado/coarse.

No baseline.

No degradar experiencia crítica solo porque API reporta “low memory”.

Usar como hint secundario si se adopta.

## 11 · Network Information

Fuentes:
- MDN · Navigator.connection
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection
- MDN · NetworkInformation.saveData
  https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData

Limited availability.

Puede informar:
- effectiveType;
- downlink;
- rtt;
- saveData.

No baseline.

No decidir contenido esencial únicamente con esto.

## 12 · Save-Data

`saveData=true` representa preferencia explícita de reducir datos.

Cuando disponible:
respetar para:
- evitar preload pesado;
- elegir media ligera;
- defer optional scenes.

Fallback:
producto sigue usable sin API.

## 13 · prefers-reduced-data

Fuente:
- MDN · prefers-reduced-data
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-data

Estado 30/09/2026:
Limited / experimental; MDN advierte soporte inexistente en user agents actuales.

No utilizar como baseline.

## 14 · Video scheduling

Fuente:
- MDN · requestVideoFrameCallback()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback

Baseline 2024 / newly available.

Para procesamiento por frame:
- callback al presentar frame de video;
- frecuencia sigue video, no display.

Ejemplo:
video 25 fps en display 60 → ~25 callbacks.

Más eficiente que rAF 60 para trabajo que solo necesita cada video frame.

## 15 · requestVideoFrameCallback no es audio clock

Puede llegar un v-sync tarde.

Para AV exacto:
- media timestamps;
- Web Audio/media timing;
- producto específico.

No convertir rVFC en reloj musical.

## 16 · Cancel callback

`cancelVideoFrameCallback(id)`.

Lifecycle:
- stop;
- unmount;
- source change

debe cancelar.

## 17 · Long sessions

Test:
- 10 min;
- 30 min;
- 60 min cuando producto lo requiere.

Medir:
- CPU trend;
- memory;
- GC;
- FPS/frame interval;
- audio glitches;
- thermal/battery proxy en dispositivo físico.

No hacer 60-min CI por cada commit.
Use scheduled/manual profiling.

## 18 · Thermal throttling

Browser JS no expone temperatura portable.

Detectar indirectamente:
- performance degradation;
- frame time;
- reduced throughput.

No inferir “device overheating” como hecho.

## 19 · Idle scenes

Si escena está visualmente estable:
- lower update rate;
- stop procedural noise;
- update only when needed.

A5 3D tiene concepto `idle`/phase que puede saltar renders por ~400 ms.

Patrón útil.

## 20 · Event-driven vs continuous

No usar rAF infinito si UI solo cambia por:
- input;
- resize;
- data update.

Canvas editor:
redraw on invalidation.

3D scene:
continuous loop justified.

## 21 · Audio

AudioWorklet continúa aunque UI render sea reducido si audio activo.

No bajar sample behavior arbitrariamente por reduced motion.

Stop audio cuando usuario/visibility contract lo exige.

## 22 · Quality tiers

Ejemplo conceptual:

```text
FULL
- DPR 1.75
- density 100%

MEDIUM
- DPR 1.2
- density 70%

LOW
- DPR .8
- density 40%

STATIC
- still image / semantic content
```

No fijar estos números sin QA.

Cada downgrade debe preservar tarea/sensory contract.

## 23 · User control beats hidden heuristic

Si producto ofrece:
- “bajar intensidad”;
- “sin movimiento”;

la persona debe poder elegir.

Heurística no debe volver a subir por encima de preferencia explícita.

## 24 · Resource release in hidden

No destruir todo al hidden:
volver podría ser costoso.

Política:
- pause immediately;
- release expensive optional resources after longer inactivity si medido;
- restore gracefully.

No implementar timeout de release sin necesidad.

## 25 · Monitoring boundary

Motor puede definir:
- frame interval;
- worker load;
- memory trend.

Vigía decide telemetría real y privacidad.

No fingerprinting con hardware signals.

## 26 · Testing matrix

### Visible/hidden
- 5s;
- 1m;
- resume.

### Refresh
60/120.

### CPU
throttled.

### Quality
adaptive downgrade/upgrade.

### Preference
reduced motion;
low intensity.

### Network
optional media with saveData where supported.

### Long
10–60 min manual.

## 27 · Estado R25

Auditoría:
- 3D visibility/low-power/adaptive DPR: patrones positivos;
- current Worker count simple: appropriate;
- network/device hints not currently required.

Estudiado:
- hardwareConcurrency;
- Device Memory;
- Network Information/saveData;
- reduced-data limitations;
- requestVideoFrameCallback;
- long-session energy.

Marcador:
`MOTOR_ENERGY_LONG_SESSION_ADAPTIVE_QUALITY_STUDIED_R25`

No:
- quality policy change;
- media change;
- hardware heuristics;
- telemetry;
- build;
- merge;
- deploy;
- main/production.
