# MOTOR · A5 · ESTUDIO PROFUNDO R06 · DETERMINISMO, REPLAY Y SINCRONIZACIÓN TEMPORAL

Fecha: 01/10/2026
Amplía: R01–R05
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Tiempo monotónico

Fuentes:
- MDN · High precision timing
  https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/High_precision_timing
- MDN · performance.now()
  https://developer.mozilla.org/en-US/docs/Web/API/Performance/now

Aprendizaje:
`performance.now()` es monotónico y no se ve afectado por ajustes del reloj del sistema.

Usos correctos:
- frame delta;
- duración de interacción;
- simulación;
- timeout técnico relativo;
- profiling.

No usar `Date.now()` para física o medir frames.

## 2 · Fixed timestep vs variable timestep

Motor distingue:

### Variable timestep
`update(dt)`

Ventajas:
- simple;
- adecuado para animación visual no determinista.

Riesgos:
- simulación puede cambiar según jitter;
- integración numérica depende de dt;
- difícil replay exacto.

### Fixed timestep
Acumulador:
```
acc += frameDelta
while (acc >= STEP) {
  simulate(STEP)
  acc -= STEP
}
render(interpolation)
```

Ventajas:
- simulación más reproducible;
- lógica independiente del refresh rate;
- facilita replay/tests.

Riesgos:
- spiral of death si tarda más que el tiempo simulado;
- requiere clamp/max steps.

Regla:
**animación visual y simulación lógica no tienen por qué usar el mismo reloj.**

## 3 · Spiral of death

Si el sistema intenta “ponerse al día” ejecutando pasos infinitos tras una pausa:
- aumenta carga;
- cada frame tarda más;
- se acumula más atraso.

Protecciones:
- clamp de frame delta;
- máximo de pasos por frame;
- degradar calidad;
- descartar tiempo acumulado no crítico;
- pausar en background.

El runtime 3D actual ya limita `dt` a 0.05 s: patrón defensivo útil.

## 4 · Determinismo

Un motor es determinista si:
mismo estado inicial + mismas entradas + mismo orden + misma semilla → mismo resultado lógico.

Fuentes de no determinismo:
- `Math.random()`;
- tiempo del sistema;
- orden de eventos externos;
- concurrencia;
- floating point;
- frame rate;
- datos externos.

Para tests/replay:
- RNG inyectable;
- seed;
- input log;
- reloj inyectable;
- separar lógica pura de render.

## 5 · Replay como herramienta de debugging

Contrato mínimo de una sesión reproducible:

```
engineVersion
initialState
seed
events[]
timestampsOrTicks
capabilities
locale
```

Replay no tiene que guardar datos personales.
Debe minimizar contenido y registrar solo lo necesario.

Frontera:
Vigía define observabilidad/evidencia persistente.
Motor define qué señales técnicas permiten reproducir un fallo.

## 6 · Command pattern y undo

Para herramientas creativas, un command puede contener:

```
do()
undo()
redo()
serialize?()
```

Ventajas:
- historial compacto;
- semántica clara;
- replay;
- tests;
- operaciones reversibles.

Snapshots completos:
- simples;
- robustos para estados pequeños;
- pueden consumir mucha memoria.

Commands/diffs:
- eficientes;
- más complejos;
- requieren invariantes fuertes.

Regla:
elegir según tamaño/semántica, no por dogma.

## 7 · structuredClone

Fuente:
- MDN · structuredClone()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone

Estado:
widely available desde 2022.

Útil para:
- snapshots de estado serializable;
- aislamiento de test;
- mensajes.

No clona:
- funciones;
- DOM nodes;
- ciertos recursos.

Puede lanzar `DataCloneError`.

No usar para clonar megabytes por cada input sin medir coste.

## 8 · Transferables

Fuente:
- MDN · Transferable objects
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects

Objetos como `ArrayBuffer`, `ImageBitmap`, `OffscreenCanvas`, `VideoFrame` pueden transferirse.

Tras transferir:
el owner anterior pierde acceso al recurso.

Aprendizaje:
**transferir es también una transferencia de ownership.**

Motor debe documentar:
- quién posee antes;
- quién posee después;
- quién destruye/cierra.

## 9 · Worker + render loop

Fuente:
- MDN · DedicatedWorkerGlobalScope.requestAnimationFrame()
  https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/requestAnimationFrame

Estado:
widely available desde 2023 en Dedicated Workers.

Puede combinarse con OffscreenCanvas para render fuera del main thread.

No significa que deba hacerse siempre:
- debugging más complejo;
- input cruza mensajes;
- accessibility sigue en main/DOM;
- lifecycle más complejo.

## 10 · Sincronización de vídeo

Fuente:
- MDN · HTMLVideoElement.requestVideoFrameCallback()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback

Aprendizaje:
`requestVideoFrameCallback()` sigue frames de vídeo reales y su metadata.

Es mejor que rAF para:
- overlays por frame;
- análisis;
- sincronización visual con media.

La callback ocurre al menor ritmo entre:
- frame rate de vídeo;
- capacidad de paint del navegador.

No garantiza sincronía perfecta absoluta.

## 11 · Sincronización de audio

Fuente:
- MDN · AudioContext.getOutputTimestamp()
  https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp

Estado:
widely available desde 2021.

Devuelve:
- `contextTime`;
- `performanceTime`.

Permite relacionar:
reloj de audio ↔ reloj de performance.

Uso:
- estimar cuándo un sample llegó a salida;
- coordinar UI/audio;
- diagnosticar latencia.

No usar `setTimeout` como reloj musical de precisión.

## 12 · Audio scheduling

Fuente:
- MDN · Web Audio API
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

Web Audio usa `AudioContext.currentTime` como reloj de audio.

Para ritmo:
- schedule ahead;
- no depender de timers JS exactos;
- UI puede actualizarse aparte.

Motor:
runtime/scheduling.
Eco/Lumen:
contenido/audio/media según alcance.

## 13 · Práctica conceptual: deterministic engine

Diseño mínimo:

```js
step(state, input, rng, dt) -> nextState
```

Sin:
- DOM;
- Date.now;
- fetch;
- Math.random directo.

Render:
```
render(state)
```

Efectos:
```
effects(prev, next) -> commands
```

Ventaja:
- unit test;
- replay;
- worker;
- server/tooling si fuera necesario.

## 14 · Prueba negativa: refresh rate

Caso:
- 60 Hz;
- 144 Hz.

Un motor que incrementa posición por frame produce diferente velocidad.

Un motor basado en tiempo/ticks mantiene comportamiento temporal.

PASS conceptual.

## 15 · Prueba negativa: snapshot explosion

Si cada movimiento de stylus guarda un snapshot de 5 MB y entran 120 eventos/s:
- 600 MB/s teóricos de snapshots.

Conclusión:
undo debe diseñarse según granularidad real.

Opciones:
- agrupar stroke como un command;
- checkpoint + diffs;
- ring buffer;
- compresión fuera del main thread cuando compense.

## 16 · Prueba negativa: transferred buffer

Tras transferir un `ArrayBuffer` a Worker:
- el buffer original queda detached.

Motor debe evitar:
- doble escritura;
- asumir que el sender conserva datos;
- reutilizar view vieja.

## 17 · Aplicación a Iris Green

### Taller
Motores de:
- pixel;
- dibujo;
- simulación;
- videojuegos;
- ritmo;
- composición;

se benefician de separar:
- estado lógico;
- comandos;
- render;
- side effects.

### Rincón/media
Para media sincronizada:
- vídeo → `requestVideoFrameCallback`;
- audio → reloj de AudioContext;
- UI → rAF/performance clock.

No forzar un solo reloj para todo.

## 18 · Nuevo checklist temporal

```
CLOCK_SOURCE
FIXED_OR_VARIABLE_STEP
MAX_DELTA
MAX_CATCHUP_STEPS
RNG_SEED
INPUT_ORDER
REPLAY_FORMAT
COMMAND_GRANULARITY
TRANSFER_OWNERSHIP
AUDIO_CLOCK
VIDEO_FRAME_CLOCK
BACKGROUND_POLICY
```

## 19 · Estado R06

Estudiado:
- tiempo monotónico;
- fixed timestep;
- determinismo;
- replay;
- command/undo;
- structured clone;
- transferables;
- worker rAF;
- video frame scheduling;
- audio timestamps.

Marcador:
`MOTOR_DETERMINISM_REPLAY_MEDIA_CLOCKS_STUDIED_R06`

No:
- cambio funcional;
- build;
- merge;
- deploy;
- main/producción.
