# MOTOR · A5 · LABORATORIO R64 · RINCÓN FALLBACK 2D RESIZEOBSERVER LIFECYCLE

Fecha: 01/10/2026
Amplía: R52/R63
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No crea issue/PR durante Formación.

## 1 · Objetivo

Seguir la ruta pública real del Rincón y comprobar si los ResizeObserver del fallback 2D se liberan al parar/cambiar escena.

## 2 · Reachability pública

Páginas:
- `es/sitio-tranquilo/index.html`;
- `en/quiet-space/index.html`.

Cargan:
- `assets/rincon-immersive-r42.js`;
- `assets/rincon-calma.js`;
- `assets/rincon-r42.js`.

No cargan directamente:
`assets/rincon-escenas-3d.js`.

Por tanto:
R63 sobre el bundle Three no se trata como prueba del runtime público principal del Rincón actual.

## 3 · Runtime público 3D

`rincon-calma.js` usa:

```
need3d()
→ window.IGScenesR42 || window.IGScenesR04
→ lib.start(...)
```

`rincon-immersive-r42.js` define:
- WebGL2 procedural;
- fallback static2d;
- stop con listener cleanup/ResizeObserver disconnect en su propio handle.

## 4 · Fallback adicional en rincon-calma.js

Si:
- lib unsupported;
- start throws;
- or flow falls back;

`start2d(kind, button)`
se usa para:
- aquarium;
- bubbles;
- octopus special path.

## 5 · Aquarium fallback observer

En aquarium:

```js
var fit = function () {
  var rc = stage.getBoundingClientRect();
  aq.resize(rc.width, rc.height, dpr);
};

fit();

if (window.ResizeObserver)
  new ResizeObserver(fit).observe(stage);

var meA = {last: performance.now()};
scene = meA;
```

Observer:
- no se asigna a variable persistente;
- no se añade a `scene`;
- no tiene `disconnect()`.

## 6 · Generic 2D fallback observer

En branch genérico:

```js
function size() { ... }

size();

if (window.ResizeObserver)
  new ResizeObserver(size).observe(stage);
```

Mismo patrón:
observer sin owner/destructor.

## 7 · stopScene()

```js
function stopScene() {
  cancelAnimationFrame(raf);
  raf = 0;

  if (scene && scene.stop) {
    try { scene.stop(); } catch {}
  }

  scene = null;
  ...
}
```

Aquarium fallback:
`scene = meA` sin `stop`.

Generic:
`scene = me` sin `stop`.

Por tanto:
stopScene no puede desconectar esos observers.

## 8 · ResizeObserver lifetime normative rule

Resize Observer spec:

A ResizeObserver remains alive until BOTH:
1. no scripting references remain;
2. it is not observing any targets.

`observe(stage)` adds stage to observation targets.

`disconnect()` clears observation targets.

Como stage persiste:
perder la variable local NO basta.

## 9 · Browser lab

Chromium 144.0.7559.96.

Se reprodujo el patrón:

```js
function startLikeRincon() {
  function fit(){ calls++; }
  new ResizeObserver(fit).observe(stage);
}

function stopLikeRincon() {
  // no disconnect
}
```

Se ejecutó:
5 starts.

Después del settle:

```
initial calls = 5
starts = 5
```

Resize del mismo stage:

```
calls = 10
delta = +5
```

Simulated stop sin disconnect.
Segundo resize:

```
calls = 15
delta = +5
```

Resultado:
los cinco observers continuaron activos después del stop lógico.

## 10 · Evidence label

`CHROMIUM_LAB_PASS`

+ static reachability from current public code.

No engine matrix.

## 11 · Impact técnico

Cada observer captura su callback closure.

Aquarium callback captura:
- `aq`;
- `dpr`;
- `stage`.

`aq` references its canvas/runtime state.

Generic callback captures:
- `cv`;
- `ctx`;
- `W/H/dpr`;
- `stage`.

Consecuencia posible de repeated fallback entry:
- observers accumulate;
- every stage resize invokes obsolete callbacks;
- detached canvases/state may remain reachable;
- extra CPU/layout work;
- memory retention.

## 12 · Product reachability

Reachable when current public Rincón enters its 2D fallback path for:
- aquarium;
- bubbles.

Triggers can include:
- WebGL2 unavailable;
- shader/link/start failure;
- fallback decision.

This is more likely specifically on constrained/older environments where extra overhead matters.

## 13 · What is NOT proven

Not proven:
- severity;
- user-visible slowdown threshold;
- memory size retained;
- Firefox/WebKit behavior;
- real-device impact;
- frequency in real users.

No P0/P1/P2 assignment by Motor.

## 14 · Classification

`PUBLIC_FALLBACK_RESIZE_OBSERVER_LIFECYCLE_DEFECT_CONFIRMED`

`REPEATED_ENTRY_CAN_ACCUMULATE_ACTIVE_OBSERVERS`

`USER_IMPACT_SEVERITY_NOT_MEASURED`

## 15 · Minimal architecture direction

Not product patch.

Fallback scene handle should own observer:

```js
var ro = new ResizeObserver(fit);
ro.observe(stage);

scene = {
  stop() {
    ro.disconnect();
    ...
  }
};
```

or external lifecycle owner disconnects it.

Same rule for generic 2D fallback.

## 16 · Regression test future

Scenario:

1. force 2D fallback;
2. start aquarium;
3. stop;
4. start aquarium;
5. repeat N times;
6. resize stage once;
7. assert only active scene callback executes.

Also:
- detached canvases not mutated;
- one rAF;
- one observer per active scene.

## 17 · Handoff

Destination:
- Motor: runtime fix when authorized;
- Lumen: Rincón experience ownership;
- Astra: priority/gate;
- Vector: integrated preview test.

No need to involve Pulso/Córtex.

## 18 · Relation to R52

R52 demonstrated generic principle:
detach does not equal cleanup.

R64 demonstrates:
**current public fallback code contains that exact ownership pattern.**

## 19 · Marker

`MOTOR_RINCON_FALLBACK_RESIZEOBSERVER_REPRO_PASS_R64`

`RINCON_PUBLIC_2D_FALLBACK_OBSERVER_ACCUMULATION_CONFIRMED`

## 20 · Límites

No:
- product patch;
- issue severity;
- build;
- merge;
- deploy;
- production claim beyond code reachability.
