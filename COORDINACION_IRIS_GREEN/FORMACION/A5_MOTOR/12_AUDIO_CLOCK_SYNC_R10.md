# MOTOR · A5 · ESTUDIO PROFUNDO R10 · AUDIO INTERACTIVO, RELOJES Y SINCRONIZACIÓN

Fecha: 30/09/2026
Amplía: R01–R09
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
Motor diseña runtime temporal/interactivo.
Eco/Lumen conservan especialidad de audio/media de producto según alcance.

## 1 · Regla principal

**El reloj del main thread no es un reloj musical preciso.**

Timers JS:
- pueden retrasarse;
- compiten con trabajo de UI;
- se throttlean;
- acumulan deriva si el siguiente evento se programa relativo al callback anterior.

Web Audio tiene una timeline propia:
`AudioContext.currentTime`.

## 2 · AudioContext.currentTime

Fuente:
- MDN · BaseAudioContext.currentTime
  https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/currentTime

Widely available.

Propiedades:
- tiempo en segundos;
- ligado a frames/sample blocks de audio;
- separado de `Date.now()`;
- se detiene cuando context está suspended.

A 44.1 kHz, un quantum de 128 frames ≈ 2.9 ms.
A 48 kHz ≈ 2.7 ms.

Regla:
eventos musicales deben referenciar esta timeline cuando se necesita precisión.

## 3 · AudioParam scheduling

Fuentes:
- MDN · AudioParam
  https://developer.mozilla.org/en-US/docs/Web/API/AudioParam
- MDN · setValueAtTime
  https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setValueAtTime
- MDN · setTargetAtTime
  https://developer.mozilla.org/en-US/docs/Web/API/AudioParam/setTargetAtTime

Permite programar:
- valor exacto;
- ramps;
- envelopes;
- cancelación de eventos futuros.

Regla:
automatización temporal → AudioParam methods.

No:
cambiar `.value` desde `setTimeout` para secuencias precisas.

## 4 · AudioWorklet

Fuentes:
- MDN · AudioWorkletNode
  https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletNode
- MDN · AudioWorkletGlobalScope.currentTime
  https://developer.mozilla.org/en-US/docs/Web/API/AudioWorkletGlobalScope/currentTime

Widely available desde 2021; procesamiento custom requiere secure context.

El processor corre en audio rendering thread.

Uso:
- DSP;
- síntesis;
- procesamiento sample/block accurate.

No usar AudioWorklet para lógica visual general.

## 5 · User activation / autoplay

Fuente:
- MDN · Web Audio best practices
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices

Regla práctica:
crear/reanudar audio a partir de un gesto de usuario.

Iris Green:
- ningún sonido debe empezar al cargar;
- Play/escuchar es acción explícita;
- pausa/stop/mute deben ser claros según producto.

## 6 · Latencia

Fuentes:
- MDN · AudioContext.baseLatency
  https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/baseLatency
- MDN · AudioContext.outputLatency
  https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/outputLatency

`baseLatency`:
processing → host audio subsystem.

`outputLatency`:
estimación host → output device.

`outputLatency` figura Baseline 2025/newly available.

Bluetooth puede añadir latencia significativa.

Regla:
en herramientas interactivas:
- medir si se necesita sync;
- no prometer “latencia X” universal;
- hardware importa.

## 7 · latencyHint

`new AudioContext({latencyHint:'interactive'})` solicita baja latencia.

El navegador puede ignorarlo.

Comprobar `baseLatency`.

No abrir múltiples contexts por herramienta sin necesidad.

## 8 · Auditoría A5 R43

Motor histórico:
`assets/ig-taller-r43-advanced.js`.

Ritmo/Composición:
```text
tick()
→ tocar notas inmediatas
→ incrementar playhead
→ draw()
→ setTimeout(next, 60000/BPM/4)
```

Esto crea un scheduler **relativo al main thread**.

Riesgos:
- GC;
- resize;
- style/layout;
- otra interacción;
- tab/background;
- CPU lenta

pueden retrasar tick y acumular deriva.

No se declara bug de producto final:
PR #299 era reconstrucción/prototipo y no está integrado como estado canónico actual.

Sí se establece aprendizaje arquitectónico.

## 9 · Scheduler musical profesional

Patrón:

```text
audioStart = audioContext.currentTime
stepDuration = 60 / BPM / subdivisions

lookahead timer (main thread)
  → programa eventos futuros en audio timeline
  → nunca usa arrival time como beat time

audio event:
  scheduledAt = audioStart + stepIndex * stepDuration

visual rAF:
  → lee audioContext.currentTime
  → deriva playhead visual
```

Timer de JS actúa como **planificador**, no como reloj maestro.

## 10 · Lookahead

No programar todo un proyecto infinito de golpe.

Usar ventana:
- programar próximos ~50–200 ms según herramienta;
- despertar scheduler con suficiente frecuencia;
- tolerar jitter del wake-up porque los eventos ya quedan programados en AudioContext.

Valores concretos se miden; no dogma.

## 11 · BPM change

Si BPM cambia:
no mezclar:
- eventos ya programados;
- nuevos periodos

sin definir boundary.

Opciones:
- cambio desde próximo beat/bar;
- cancelar futuro y reprogramar;
- recalcular fase.

La UI debe declarar comportamiento.

## 12 · Stop

Stop debe:
- cancelar scheduler JS;
- cancelar eventos futuros;
- detener/disconnect sources si procede;
- resetear playhead lógico;
- no dejar AudioNodes huérfanos.

Para AudioParam:
`cancelScheduledValues()` / `cancelAndHoldAtTime()` cuando corresponda.

## 13 · Pause vs Stop

### Pause
conserva posición/estado.

### Stop
vuelve a inicio según producto.

No usar la misma variable booleana si semánticas divergen.

## 14 · AudioContext lifecycle

Estados:
- suspended;
- running;
- closed.

Motor debe reaccionar:
- tab/background;
- device changes;
- user activation;
- context interruption donde navegador lo exponga.

No asumir que `resume()` siempre reproduce instantáneamente.

## 15 · Visual sync

El playhead visual no debe dirigir audio.

Audio clock = master.

Visual:
```text
position = floor((audioNow - startTime) / stepDuration)
```

Si un frame visual se pierde:
audio sigue a tiempo;
siguiente frame salta a posición correcta.

## 16 · Práctica de reloj ejecutada

Modelo aislado:

Un scheduler relativo recibe delays:
`[0,0,35,0,0,20,0,0]` ms.

Resultado:

```text
PASS relative timer model accumulates 55ms drift after delayed handlers
PASS absolute audio-clock deadlines stay phase-locked
PASS visual playhead can derive position from master clock instead of tick count
RESULT 3/3 clock-model checks passed
```

## 17 · AudioWorklet actual del Taller

`assets/ig-taller-r42-platform.js`:
- intenta AudioWorklet;
- fallback a oscillator/gain Web Audio;
- resume context si suspended;
- cada tone se envía por MessagePort.

Patrón positivo:
capability + fallback.

Limitación para secuenciador:
mensaje inmediato no equivale a evento futuro sample-accurate.

Evolución futura:
aceptar `when` en audio clock o scheduler nativo dentro del worklet.

## 18 · Sensory safety

Runtime técnico debe evitar:
- clicks/pops;
- saltos de gain;
- picos inesperados;
- autoplay;
- loops imposibles de parar.

Ramps cortos en gain pueden evitar discontinuidades.

La definición perceptiva final se coordina con Eco/Lumen y HUMAN QA.

## 19 · Audio testing

### Funcional
- play;
- pause;
- stop;
- BPM;
- mute;
- change pattern.

### Temporal
- 1 min;
- 5 min;
- 10 min;
- drift vs expected beat.

### Load
- CPU throttling;
- resize while playing;
- pointer drawing simultaneously.

### Lifecycle
- tab hidden;
- resume;
- bfcache;
- audio device/hardware where practical.

### A11y
- keyboard;
- status;
- no dependence on hearing alone for essential state.

## 20 · Output latency

Si visual debe coincidir con lo que llega físicamente al oído:
considerar `outputLatency`.

No compensar ciegamente:
- estimación;
- device dependent;
- support/version.

## 21 · Performance boundary

Audio glitches pueden provenir de:
- main thread scheduling;
- audio thread overload;
- too many nodes;
- GC allocations around messages;
- hardware.

Instrumentar por capa.

## 22 · Estado R10

Práctica:
- clock model: **3/3 PASS**.

Auditoría read-only:
- R43 sequencer temporal model: completada;
- R42 AudioWorklet fallback: revisado.

Marcador:
`MOTOR_INTERACTIVE_AUDIO_CLOCK_SYNC_STUDIED_R10`

No:
- cambio de secuenciador;
- audio nuevo;
- build;
- merge;
- deploy;
- main/producción.
