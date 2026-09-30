# MOTOR · A5 · ESTUDIO PROFUNDO R11 · GAME LOOPS, TIMESTEP Y SIMULACIÓN DETERMINISTA

Fecha: 30/09/2026
Amplía: R01–R10
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Separar render de simulación

Fuente:
- MDN · Anatomy of a video game
  https://developer.mozilla.org/en-US/docs/Games/Anatomy

Un runtime interactivo puede tener dos relojes:

```text
SIMULATION CLOCK
→ estado autoritativo del mundo

RENDER CLOCK
→ dibuja la mejor representación disponible
```

No tienen por qué avanzar a la misma frecuencia.

## 2 · requestAnimationFrame es reloj de presentación

`requestAnimationFrame()`:
- se alinea con oportunidades de repaint;
- entrega timestamp;
- puede variar con refresh rate;
- normalmente se pausa/throttle en background.

No usar número de frames como tiempo de simulación.

## 3 · Fixed timestep

Patrón:

```text
step = 1 / 60
accumulator += elapsed

while accumulator >= step:
    update(step)
    accumulator -= step

alpha = accumulator / step
render(interpolate(previous, current, alpha))
```

Ventajas:
- reglas físicas/lógicas reciben delta estable;
- reproducibilidad mayor;
- render puede ir a 60/90/120/144 Hz;
- comportamiento no cambia por monitor.

## 4 · Variable timestep

`update(realDelta)`

Puede ser suficiente para:
- movimiento visual simple;
- escenas sin colisiones sensibles;
- animación ambiental.

Riesgos:
- estabilidad numérica;
- resultados distintos según frame history;
- colisiones atravesadas con delta grande;
- dificultad para replay/determinismo.

Regla:
elegir según dominio, no por dogma.

## 5 · Interpolación

Con timestep fijo, render puede ocurrir entre dos estados.

`alpha = accumulator / step`.

Visual:
`display = lerp(previous, current, alpha)`.

La interpolación:
- suaviza;
- no modifica el estado autoritativo;
- puede añadir una latencia visual de un tick según arquitectura.

No interpolar propiedades discretas sin semántica válida.

## 6 · Catch-up y spiral of death

Si una frame tarda mucho:
el acumulador puede pedir muchos updates.

Si cada update cuesta más de lo que se recupera:
```text
lag → more updates → more lag → more updates
```

= spiral of death.

Protecciones:
- máximo de updates por frame;
- cap del elapsed;
- política explícita para gaps grandes;
- degradar calidad visual antes que corromper simulación.

## 7 · Background tabs

Fuente:
- MDN · Page Visibility API
  https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

Browsers normalmente:
- dejan de enviar rAF en tabs ocultas;
- throttle timers.

Por tanto, al volver puede aparecer un gap grande.

Políticas posibles:

### Treat as pause
Single-player/local tool:
- descartar gap;
- conservar estado.

### Catch up bounded
Simulación donde importa avance corto:
- máximo N ticks;
- límite de gap.

### Recover authoritative state
Multiplayer/networked:
- servidor/peer manda.

Iris Green hoy:
la mayoría de Taller es local.
**Pause-on-hidden** suele ser la política más segura salvo requisito contrario.

## 8 · Práctica de timestep ejecutada

Fixed step:
`1/60 s`.

Resultados:

```text
PASS 60Hz render → 60 simulation updates in 1 second
PASS 120Hz render → 60 simulation updates in 1 second
PASS simulation state independent from render frequency
PASS 5s hidden gap treated as pause, not 300-tick catch-up
PASS catch-up cap prevents spiral-of-death behavior
```

Un gap de 5 s a 60 Hz equivaldría a **300 updates** sin protección.

## 9 · Determinismo

Determinismo aproximado de aplicación requiere controlar:
- initial state;
- input order;
- timestep;
- random seed;
- floating-point assumptions;
- external data;
- concurrency ordering.

No prometer bit-exact cross-platform si se depende de:
- floats;
- GPU;
- physics libraries;
- platform-specific math

sin demostrarlo.

## 10 · Randomness

Fuentes:
- MDN · Math.random()
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
- MDN · crypto.getRandomValues()
  https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues

`Math.random()`:
- no permite fijar/resetear seed desde la API;
- no es criptográficamente seguro.

`crypto.getRandomValues()`:
- seguridad/entropía;
- NO sirve para reproducir una simulación por seed.

Para replay/procedural reproducible:
usar PRNG propio/versionado con seed persistida.

## 11 · Auditoría A5 · Pattern

R43 Pattern:
- guarda `seed`;
- evoluciona seed con fórmula determinista;
- no usa `Math.random()`.

Patrón positivo para arte generativo reproducible.

Regla:
persistir también versión del algoritmo si un cambio futuro alteraría el mismo seed.

```text
generator_id
generator_version
seed
parameters
```

## 12 · Auditoría A5 · Simulation

R43 Simulation:
- Game of Life;
- `setTimeout(run, st.speed)`;
- incrementa `steps`;
- no usa rAF;
- no consulta Page Visibility.

Consecuencia conceptual:
el timer representa simultáneamente:
- scheduler;
- simulation clock.

Para una herramienta educativa simple puede funcionar.

Arquitectura más robusta:
- clock lógico separado;
- pause on hidden;
- no “ponerse al día” con cientos de generaciones al volver salvo decisión explícita.

## 13 · Auditoría escenas 3D

`tools/escenas-3d/src/index.js`:
- rAF;
- delta temporal;
- cap `dt <= 0.05`;
- no update/render cuando `document.hidden`.

Esto es apropiado para **experiencia visual ambiental**, no para una simulación que prometa reproducibilidad.

Además `common.js` usa `Math.random()`.

No es defecto:
las escenas calmantes no necesitan necesariamente replay determinista.

Lección:
**determinismo es requisito de dominio, no virtud universal.**

## 14 · Input sampling

Con timestep fijo:
- input puede llegar entre ticks.

Opciones:
- queue events con timestamp;
- aplicar estado actual en próximo tick;
- acumular deltas analógicos.

No leer solo “última tecla” si el orden de eventos importa.

## 15 · Replay

Para reproducir:
guardar:
- seed;
- initial state/version;
- ordered input events;
- logical tick/time.

No guardar cada frame renderizado.

Replay sirve para:
- debugging;
- tutorial;
- determinism test.

No activarlo si añade persistencia no autorizada.

## 16 · Simulation worker

Mover update a Worker puede:
- liberar main thread;
- estabilizar UI.

Pero introduce:
- message latency;
- ownership;
- snapshot transfer;
- rendering sync.

No hace determinista una simulación por sí mismo.

## 17 · Shared memory

SharedArrayBuffer puede reducir copias pero requiere cross-origin isolation y añade complejidad de sincronización.

Iris Green no debe adoptarlo por performance especulativa.

Preferir:
- transferables;
- compact state;
- lower message frequency

antes de shared memory.

## 18 · Physics/network future rule

Si algún Taller futuro incorpora física real-time o multiplayer:
Motor debe definir primero:
- authority;
- tick rate;
- reconciliation;
- prediction;
- rollback;
- network jitter policy.

No reutilizar un loop local sencillo sin rediseño.

## 19 · Game pause semantics

Pause debe congelar:
- simulation time;
- scheduled game updates.

Puede NO congelar:
- UI focus;
- menus;
- accessibility announcements;
- settings.

Separar `GAME_PAUSED` de `PAGE_HIDDEN`.

La página oculta puede inducir pause, pero son conceptos distintos.

## 20 · Testing matrix

### Refresh
- 60 Hz;
- 120 Hz emulado/real cuando posible.

### Jank
- injected 50/100/250 ms stalls.

### Hidden
- 1 s;
- 5 s;
- 60 s.

### CPU
- throttled.

### Determinism
same:
- seed;
- inputs;
- tick count

→ same domain state.

### Different render
60 vs 120 Hz → same domain state.

## 21 · Numeric stability

Nunca usar:
`position += speed`

sin tiempo.

Variable:
`position += speed * dt`.

Fixed:
`position += speed * STEP`.

Para acumuladores largos:
evitar crecer timestamps arbitrariamente si precision empieza a importar.

## 22 · State checksum

Para tests deterministas:
serializar estado canónico estable y hash/checksum.

No incluir:
- timestamps de render;
- DOM refs;
- random runtime metadata.

## 23 · Estado R11

Práctica:
- fixed timestep / hidden gap: **5/5 PASS**.

Auditoría read-only:
- R43 simulation scheduler: revisado;
- R43 seeded pattern: revisado;
- 3D ambient variable-delta model: diferenciado.

Marcador:
`MOTOR_GAME_LOOP_TIMESTEP_DETERMINISM_STUDIED_R11`

No:
- cambio de simulación;
- worker nuevo;
- build;
- merge;
- deploy;
- main/producción.
