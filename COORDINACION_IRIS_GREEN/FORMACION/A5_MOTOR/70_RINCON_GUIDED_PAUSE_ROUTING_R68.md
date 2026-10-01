# MOTOR · A5 · AUDITORÍA R68 · PAUSA GUIADA R42 ENRUTADA A ESCENA INCORRECTA

Fecha: 01/10/2026
Amplía: R66/R67
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre issue/PR durante Formación.

## 1 · Objetivo

Seguir el flujo público de la pausa guiada y verificar qué escena 3D recibe realmente el runtime R42.

## 2 · Ruta pública

Páginas:
- `es/sitio-tranquilo/index.html`;
- `en/quiet-space/index.html`.

Carga:
- `assets/rincon-immersive-r42.js`;
- `assets/rincon-calma.js`.

La pausa pública tiene:
- `#startBreath`;
- `.orbwrap`;
- `#breathBox`.

## 3 · Activación

`rincon-calma.js`:

```js
var sB = $('#startBreath');

if (sB) sB.addEventListener('click', function () {
  pausing = true;
  keepAwake.update();
  startPause3d();
});
```

Por tanto:
el flujo es user-reachable.

## 4 · startPause3d()

Código:

```js
function startPause3d() {
  if (pause3d || !porb) return;

  need3d().then(function (lib) {
    if (pause3d || !lib.supported()) return;

    var wrap = document.createElement('div');
    wrap.className = 'qpause3d';

    var cv = document.createElement('canvas');
    wrap.appendChild(cv);

    porb.parentNode.insertBefore(wrap, porb);
    porb.hidden = true;

    pause3d = lib.start('pause', cv, {
      reduced: reduced,
      phase: pausePhase
    });
  });
}
```

Puntos:
- crea UI visible;
- oculta la esfera original;
- solicita kind `pause`;
- pasa callback `phase`.

## 5 · MAP del runtime R42

Blob público:
`assets/rincon-immersive-r42.js`
SHA observado:
`3da1b681bdb82964148a7e063ff64022f8d01821`.

MAP:

```js
var MAP = {
  sea:0,
  rain:1,
  river:2,
  night:3,
  aquarium:4,
  bubbles:5,
  jellies:6,
  fibre:7,
  octopus:8,
  forest:9,
  dawn:10,
  clouds:11
};
```

**No existe `pause`.**

## 6 · Fallback de kind

`start()`:

```js
var scene = MAP.hasOwnProperty(kind) ? MAP[kind] : 0;
```

Para:
`kind === 'pause'`

`hasOwnProperty('pause') === false`.

Resultado:
`scene = 0`.

## 7 · Scene 0

Fragment shader:

```glsl
if (uScene == 0)
  c = sceneSea(uv, uTime);
else if ...
```

Por tanto:
**la pausa 3D se enruta al shader del Mar**.

No es inferencia visual:
es routing directo del código.

## 8 · opts.phase no consumido

`startPause3d()` pasa:
`phase: pausePhase`.

El runtime R42 `start(kind,canvas,opts)` consume:
- `opts.reduced`;
- `opts.speed`;
- `opts.color`.

No consume:
`opts.phase`.

Las apariciones de la palabra `phase` en el fichero pertenecen a variables matemáticas dentro del shader, no a `opts.phase`.

Resultado:
la guía:
- inhale/exhale;
- progress;
- ritmo 4/6 o 6/6;

no gobierna el render R42.

## 9 · Fallback 2D interno de R42

Si no hay WebGL2:
`static2d(kind,...)`.

Palette map contiene:
- sea;
- rain;
- river;
- night;
- aquarium;
- bubbles;
- jellies;
- fibre;
- octopus;
- forest;
- dawn;
- clouds.

No contiene:
`pause`.

Fallback:
```js
...[kind] || ['#3f8fb4','#0b304b']
```

Así que en no-WebGL:
la pausa recibe un gradiente genérico,
no la guía respiratoria.

## 10 · UI visible

CSS:

```css
.qpause3d {
  width:min(100%,340px);
  aspect-ratio:1/1;
  border-radius:50%;
  overflow:hidden;
  margin:0 auto;
}

.qpause3d canvas {
  display:block;
  width:100%;
  height:100%;
}
```

No es preload oculto.

Es la superficie visual que sustituye:
`.orbwrap`.

## 11 · Original visual hidden

`porb.hidden = true`.

Por tanto:
cuando startPause3d succeeds,
la guía original queda fuera de presentación visual y se muestra qpause3d.

## 12 · Classification

`RINCON_GUIDED_PAUSE_R42_SCENE_ROUTING_DEFECT_CONFIRMED`

`PAUSE_KIND_MISSING_FROM_RUNTIME_MAP`

`PAUSE_PHASE_CALLBACK_IGNORED_BY_R42_RUNTIME`

`ORIGINAL_PAUSE_ORB_HIDDEN_ON_ACTIVATION`

## 13 · User reachability

Current public route:
- open Rincón;
- go to Pausa guiada;
- press Empezar.

If R42 library is supported:
`startPause3d()` runs.

Therefore:
reachability is established statically from public code.

No deployment/browser-integrated screenshot was executed in this training.

Evidence level:
`STATIC_PUBLIC_PATH_CONFIRMED`.

## 14 · Existing tests gap

`tools/test-r42-rincon.js` verifies:
- 12 visual scene buttons;
- R42 engine export;
- MAP of 12 visual scenes;
- reduced-motion CSS;
- forced colors;
- audio.

It contains:
- 0 `startPause3d`;
- 0 `IGRitmo`;
- 0 pause-specific runtime assertions.

HumanQA/two-fixes scripts likewise do not cover this path.

Therefore:
the existing static PASS does not test pause routing.

## 15 · Likely history

The older Three source had a `pause` world maker.

The newer R42 shader MAP has only 12 scene categories.

The controller still calls the older interface:
`lib.start('pause', ..., {phase})`.

This is a likely interface/version-contract mismatch.

This is an engineering interpretation,
not a claim about developer intent.

## 16 · Desired contract question

Lumen/Astra must decide:

### Option A
R42 needs a dedicated pause shader/scene using `phase`.

### Option B
Pausa should retain the existing orb and NOT use immersive runtime.

### Option C
Use a different visual but formally map `pause` and consume phase.

Motor should not choose perceptual design alone.

## 17 · Runtime contract improvement

Engine should not silently map unknown kinds to `sea`.

Safer choices:
- throw `UNKNOWN_SCENE_KIND`;
- return static fallback;
- explicit default only when caller asks default.

Silent default hid the interface mismatch.

## 18 · Regression tests future

### Engine
```
assert.throws/start fallback for unknown kind
```

### Pause
```
start('pause')
→ dedicated pause path
→ phase callback read
```

### Integration
- press Start;
- original/3D visual expected;
- toggle 4/6 vs 6/6;
- verify visual phase tracks rhythm;
- reduced motion;
- stop/restart.

## 19 · Accessibility / sensory boundary

The pause guide is a low-stimulation feature.

Replacing it with an unrelated animated sea is not merely a visual-detail question.

Desired behavior must be reviewed by:
- Lumen;
- Axioma;
- HUMAN QA.

Motor establishes routing defect only.

## 20 · Severity

Not assigned.

Needs:
- integrated preview;
- actual visual verification;
- product intent confirmation.

## 21 · Handoff

- Motor: runtime contract.
- Lumen: pause visual/perceptual behavior.
- Astra: architecture/gate/priority.
- Axioma: accessibility implications.
- Vector: integrated preview.

## 22 · Marker

`MOTOR_RINCON_GUIDED_PAUSE_ROUTING_AUDIT_PASS_R68`

`RINCON_R42_PAUSE_ROUTING_DEFECT_CONFIRMED`

## 23 · Límites

No:
- product patch;
- visual redesign;
- severity;
- build;
- merge;
- deploy.
