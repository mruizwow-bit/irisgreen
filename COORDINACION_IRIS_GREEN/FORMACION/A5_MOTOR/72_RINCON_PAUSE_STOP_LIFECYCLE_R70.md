# MOTOR · A5 · AUDITORÍA R70 · PAUSA GUIADA · STOP NO DETIENE RUNTIME 3D

Fecha: 01/10/2026
Amplía: R68
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre issue/PR durante Formación.

## 1 · Objetivo

Comprobar el lifecycle completo de la superficie 3D de Pausa guiada:

`Empezar → Parar → Empezar`.

Pregunta:

> ¿el botón público Parar detiene y libera el runtime 3D de la pausa?

## 2 · Creación de pause3d

`rincon-calma.js`:

```js
var pause3d = null;

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

Effects:
- visible qpause3d inserted;
- original orb hidden;
- runtime handle stored in `pause3d`.

## 3 · Empezar

```js
startBreath.addEventListener('click', function () {
  pausing = true;
  keepAwake.update();
  startPause3d();
});
```

First start:
creates runtime.

Later starts:
`if (pause3d) return`.

So the same instance remains.

## 4 · Parar handler in rincon-calma

```js
stopBreath.addEventListener('click', function () {
  pausing = false;
  keepAwake.update();
});
```

It does NOT:
- pause3d.stop();
- pause3d = null;
- remove qpause3d;
- porb.hidden = false.

## 5 · Inline page stop handler

Current ES/EN pages also attach stop behavior:

```js
stopBreath.onclick = () => {
  breathBox.classList.remove('ig-guiding');
  running = false;
  clearTimeout(timer);
  breathBox.classList.remove('breathing');
  breathLabel.textContent = 'Preparado...';
};
```

This stops:
- CSS/orb guidance timer;
- breathing class.

It does NOT know about `pause3d`.

Therefore:
both stop handlers leave 3D runtime alive.

## 6 · Only pause3d.stop() occurrence

Search result:

```js
window.addEventListener('pagehide', function () {
  stopScene();
  stop3d();

  if (pause3d) {
    pause3d.stop();
    pause3d = null;
  }

  ...
});
```

Thus:
**pause3d cleanup only occurs when page hides/navigates away.**

## 7 · Original orb restoration

Search:
`porb.hidden`

Only assignment:
```js
porb.hidden = true;
```

There is no:
`porb.hidden = false`
inside rincon-calma.

So after first 3D pause activation:
the original orb remains hidden for page lifetime.

## 8 · qpause3d removal

Search:
`.qpause3d`
only creation/styling path.

No:
- wrap.remove();
- qpause3d.remove();
- DOM cleanup in Stop.

The wrapper remains until:
- page navigation;
- external DOM replacement not identified.

## 9 · Runtime behavior after Parar

Current R42 runtime:
`lib.start('pause')`
actually maps to scene 0 = Sea (R68).

Its draw loop:
continues scheduling rAF while:
`!reduced()`.

`stopBreath` does not:
- call its stop;
- change its alive;
- cancel rAF.

Therefore under normal motion preference:
**the WebGL canvas continues rendering after public Parar.**

This conclusion follows directly from current code paths.

## 10 · Reduced motion nuance

If reduced motion is active:
R42 may already have stopped its rAF.

But that does not fix lifecycle:
- instance remains;
- wrapper remains;
- original orb remains hidden;
- handle remains non-null.

R65 also shows resume asymmetry if preference changes.

## 11 · Public semantics

Button label:
- ES: `Parar`
- EN: `Stop`.

A user can reasonably expect the pause guide/visual activity to stop.

Current implementation:
- text/timer stops;
- R42 runtime remains alive.

Classification:
**control semantics and runtime lifecycle diverge.**

## 12 · Classification

`RINCON_GUIDED_PAUSE_3D_STOP_LIFECYCLE_DEFECT_CONFIRMED`

Subfindings:

`PAUSE3D_NOT_STOPPED_BY_STOP_CONTROL`

`PAUSE3D_HANDLE_PERSISTS_UNTIL_PAGEHIDE`

`ORIGINAL_ORB_NOT_RESTORED_AFTER_3D_START`

`QPAUSE3D_WRAPPER_NOT_REMOVED_BY_STOP`

## 13 · Relationship with R68

R68:
`pause` routes to Sea and phase is ignored.

R70:
even after pressing Stop,
that runtime remains active.

Together:

```
Start pause
→ hides intended orb
→ starts unrelated Sea shader
→ Stop guide
→ Sea shader continues
```

under normal motion.

This is a compound lifecycle/interface mismatch.

## 14 · Existing tests

R42 static/humanqa tests do not contain:
- `startPause3d`;
- `pause3d`;
- pause runtime stop assertions.

No regression guard exists for this flow in inspected tests.

## 15 · Desired contract question

Lumen/Astra/Axioma must decide:

### If 3D pause is desired
Parar should:
- stop/freeze according to product semantics;
- restore/restart correctly;
- phase track guidance.

### If original orb is desired
Do not replace it with R42 runtime.

Motor should not select the visual design.

## 16 · Minimal lifecycle pattern

Not a patch.

Conceptual:

```js
function stopPause3d() {
  if (pause3d) {
    pause3d.stop();
    pause3d = null;
  }

  if (pauseWrap) pauseWrap.remove();
  porb.hidden = false;
}
```

But:
if desired semantics are “pause visual remains as still frame”,
the implementation may differ.

Need product decision first.

## 17 · Regression test future

1. click Start;
2. assert one pause runtime active;
3. click Stop;
4. assert:
   - runtime stops/freeze according to contract;
   - no active rAF if stop means stop;
   - expected visual restored;
5. click Start again;
6. assert exactly one runtime;
7. repeat 5×.

Also:
- reduced motion;
- pagehide;
- clean screen;
- mobile.

## 18 · Accessibility/sensory boundary

A Stop control that leaves motion active can matter for:
- predictability;
- sensory comfort;
- control over animation.

Motor documents runtime mismatch.

Axioma decides formal criteria.
Lumen/HUMAN QA decide perceptual acceptance.

## 19 · Severity

Not assigned by Motor.

Needs:
- integrated visual reproduction;
- product intent confirmation;
- user impact.

## 20 · Handoff

- Motor: lifecycle.
- Lumen: pause visual/behavior.
- Axioma: control/motion implications.
- Astra: gate/priority.
- Vector: integrated preview.

## 21 · Marker

`MOTOR_RINCON_PAUSE_STOP_LIFECYCLE_AUDIT_PASS_R70`

`RINCON_PAUSE3D_STOP_DEFECT_CONFIRMED`

## 22 · Límites

No:
- product patch;
- severity;
- visual redesign;
- build;
- merge;
- deploy.
