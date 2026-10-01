# MOTOR · A5 · ESTUDIO PROFUNDO R07 · MAIN THREAD, PRESUPUESTOS Y ESTABILIDAD PROLONGADA

Fecha: 01/10/2026
Amplía: R01–R06
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla profesional

Motor no optimiza “FPS” de forma aislada.

Debe equilibrar:
- respuesta a input;
- tiempo de script;
- layout/paint;
- calidad visual;
- consumo de batería;
- memoria;
- trabajo en background;
- estabilidad durante sesiones largas.

## 2 · requestAnimationFrame y visibilidad

Fuentes:
- MDN · requestAnimationFrame
  https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- MDN · Page Visibility API
  https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

`requestAnimationFrame()`:
- suele seguir la frecuencia de la pantalla;
- se pausa en muchas pestañas ocultas/iframes ocultos;
- es one-shot;
- exige timestamp/delta.

Timers:
- pueden ser throttled en background.

Consecuencia:
**no construir cronómetros o simulaciones que dependan del número de callbacks recibidos.**

## 3 · Background policy explícita

Cada motor debe decidir:

### PAUSE
Ejemplo:
animación puramente visual.

### CONTINUE LOGICALLY
Ejemplo:
temporizador conceptual que debe derivarse de reloj monotónico al volver.

### SUSPEND RESOURCE
Ejemplo:
audio/render pesado que no aporta oculto.

### RECONCILE ON RETURN
Ejemplo:
simulación que no debe ejecutar miles de pasos perdidos.

No dejar esta política emergente a lo que haga el navegador.

## 4 · Scheduling moderno

Fuentes:
- MDN · Scheduler.yield()
  https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield
- MDN · Scheduler.postTask()
  https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/postTask
- MDN · Scheduling.isInputPending()
  https://developer.mozilla.org/en-US/docs/Web/API/Scheduling/isInputPending

A 01/10/2026:
- Scheduler sigue con soporte limitado;
- `navigator.scheduling.isInputPending()` figura **deprecated**.

Regla:
no introducir `isInputPending()` en código nuevo.

Diseñar chunks por presupuesto temporal y ceder regularmente.
Usar Scheduler cuando exista; fallback con task yielding compatible cuando no.

## 5 · Chunking

Patrón conceptual:

```text
deadline = performance.now() + budget
while (work && performance.now() < deadline) {
  processOne()
}
if (work) yield()
```

Presupuesto:
depende de tarea y dispositivo.

No fijar 16.67 ms como “frame universal”:
- 60 Hz ≈ 16.7 ms;
- 120 Hz ≈ 8.3 ms;
- 144 Hz ≈ 6.9 ms.

Además browser/layout/paint también necesitan tiempo.

## 6 · hardwareConcurrency

Fuente:
- MDN · navigator.hardwareConcurrency
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency

Widely available.

Devuelve procesadores lógicos que el user agent expone.
Puede ser menor que el hardware real.

Uso:
heurística para tamaño de worker pool.

No:
`workers = hardwareConcurrency`.

Preferir:
- límite conservador;
- mínimo 1;
- dejar capacidad al main thread;
- medir.

## 7 · Worker pools

Útiles para muchas tareas independientes.

Riesgos:
- demasiados workers;
- memoria;
- oversubscription;
- serialization;
- ordering;
- cancellation;
- cold start.

Contrato:
```
QUEUE
PRIORITY
MAX_WORKERS
CANCEL
OWNERSHIP
RESULT_ORDER
SHUTDOWN
```

Iris Green hoy no necesita un pool genérico por defecto.
Introducirlo solo si un perfil real demuestra cola de cálculo suficiente.

## 8 · User activation y audio

Fuentes:
- MDN · User activation
  https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/User_activation
- MDN · Web Audio best practices
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices
- MDN · AudioContext.resume()
  https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/resume

Audio/Web Audio están sujetos a autoplay policy.

Patrón:
- crear/resumir desde gesto de usuario;
- consultar state;
- `resume()` si suspended;
- manejar rechazo/cierre.

No “desbloquear” audio con trucos invisibles.

## 9 · Estado de AudioContext

Estados relevantes:
- suspended;
- running;
- closed.

Motor debe decidir lifecycle:
- cuándo crear;
- cuándo resume;
- cuándo suspend;
- cuándo close.

Un singleton eterno puede ser correcto para una app de audio.
No debe crearse por cargar una página si nadie pide sonido.

## 10 · estabilidad prolongada

Una prueba de 2 segundos no encuentra:
- acumulación de listeners;
- drift temporal;
- memoria creciente;
- caches;
- timers duplicados;
- GPU resources;
- audio nodes;
- stale pending work.

Para experiencias largas:
- 5 min;
- 10 min;
- 30 min cuando el producto lo justifica.

Medir tendencia, no solo snapshot.

## 11 · Soak testing

Matriz:

```
START
INTERACT
IDLE
BACKGROUND
RESTORE
RESIZE
REPEAT
STOP
RESTART
```

Observar:
- errores;
- memoria;
- frame degradation;
- worker count;
- pending promises;
- AudioContext;
- DOM node growth;
- GPU recovery.

No hace falta automatizar toda percepción.
HUMAN QA sigue siendo necesario para fatiga/sensorial.

## 12 · Instrumentación mínima

Motor puede producir marcas locales:

```js
performance.mark('motor:start')
// work
performance.mark('motor:end')
performance.measure('motor:interaction','motor:start','motor:end')
```

No enviar telemetría por cuenta propia.

Vigía decide captura/retención/privacidad si se instrumenta producción.

## 13 · PerformanceObserver

Fuente:
- MDN · PerformanceObserver
  https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver

Permite observar entradas de performance sin polling.

Motor puede usarlo en:
- test;
- profiling;
- tooling.

Debe feature-detect cada entry type.

## 14 · Long tasks vs LoAF

Long Task:
indica ocupación larga del main thread.

Long Animation Frame:
da contexto de un frame de render lento.

No son equivalentes.

Una UI puede:
- tener script corto pero paint caro;
- tener Long Task sin interacción;
- tener mala INP por scheduling.

Diagnóstico requiere combinar señales.

## 15 · Degradación por carga

Un motor puede adaptar:
- DPR;
- partículas;
- sample count;
- calidad shader;
- frecuencia de updates;
- número de objetos.

No debe degradar:
- semántica;
- capacidad de parar;
- keyboard access;
- información esencial.

## 16 · Calidad adaptativa estable

Evitar oscilación:

```
slow → lower
fast once → do not immediately raise
sustained fast → raise slowly
```

Usar:
- hysteresis;
- ventanas;
- límites.

El runtime 3D actual promedia varios frames antes de cambiar DPR:
patrón razonable.

## 17 · Práctica de arquitectura: worker pool

Ejercicio conceptual:

Hardware expuesto = 8.

Mala decisión:
8 workers pesados + main.

Diseño conservador:
```
maxWorkers = min(4, max(1, hardwareConcurrency - 1))
```

Luego medir.

No canonizar esa fórmula como universal.
Es una heurística inicial.

## 18 · Práctica negativa: hidden tab

Si:
- simulación avanza una unidad por rAF;
- tab queda oculta 60 s;
- rAF se pausa;

al volver el estado temporal es incorrecto.

Soluciones según producto:
- reloj monotónico;
- pause explícita;
- reconcile;
- fixed tick limitado.

## 19 · Estado R07

Estudiado:
- main-thread budgeting;
- background policy;
- scheduling;
- deprecación de isInputPending;
- worker pools;
- autoplay/user activation;
- AudioContext lifecycle;
- soak testing;
- adaptive quality.

Marcador:
`MOTOR_MAIN_THREAD_SOAK_ADAPTIVE_RUNTIME_STUDIED_R07`

No:
- cambios funcionales;
- build;
- merge;
- deploy;
- producción.
