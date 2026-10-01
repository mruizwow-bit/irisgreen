# MOTOR · A5 · PRACTICE R66 · ACCEPTANCE GATE SOBRE RUNTIME PÚBLICO RINCÓN R42

Fecha: 01/10/2026
Amplía: R59/R64/R65
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No sustituye revisión Astra/Lumen/Axioma.
No es certificación externa.

## 1 · Objetivo

Aplicar el gate R59 al runtime **realmente cargado por las páginas públicas**:

- `assets/rincon-immersive-r42.js`
- `assets/rincon-calma.js`

y no al motor Three fuente/histórico.

## 2 · Ruta pública verificada

ES:
`es/sitio-tranquilo/index.html`

EN:
`en/quiet-space/index.html`

Ambas cargan:
- `preferencias-lectura.js`;
- `rincon-immersive-r42.js`;
- `rincon-calma.js`;
- `rincon-r42.js`.

Motor público:
`window.IGScenesR42`.

Version string:
`R42_A7_IMMERSIVE_WEBGL2`.

## 3 · G01 DOMAIN STATE

Runtime state:
- alive;
- raf;
- time;
- pointer/target;
- dimensions/DPR.

Scene ID:
MAP fixed 12 scenes.

Domain state is lightweight and mostly local.

Status:
`PASS_EVIDENCED`.

No conclusion on broader Rincón controller state.

## 4 · G02 INPUT OWNERSHIP

WebGL runtime:
- pointermove;
- pointerleave;
- passive listeners.

Controller provides DOM buttons and controls.

Canvas:
role=img + aria-label set by controller.

Strength:
input/controls not hidden inside canvas only.

Status:
`PARTIAL_EVIDENCE`.

Keyboard/control semantics belong controller/Axioma.

## 5 · G03 ASYNC OWNERSHIP

Runtime `start()` is synchronous after library load.

`rincon-calma.js` async loader uses token:

```
var token = {};
startScene.token = token;

need3d().then(function(lib){
  if (startScene.token !== token || !cv3.isConnected) return;
  ...
});
```

This protects stale scene load.

Status:
`PASS_EVIDENCED`.

## 6 · G04 FAILURE CONTRACT

Primary runtime:
- no WebGL2 → `static2d`;
- shader compile/link failure → `static2d`;
- outer loader/start failure in calm → `start2d`.

This is genuine fail-soft architecture.

Status:
`PASS_EVIDENCED`.

Known fallback lifecycle defect:
R64 observer accumulation.

Therefore:
failure path exists but has lifecycle debt.

Status nuance:
`PASS_WITH_CONFIRMED_FALLBACK_DEFECT`.

## 7 · G05 FALLBACK

There are two layers:

### Engine fallback
`rincon-immersive-r42.js static2d()`.

Its `stop()` disconnects ResizeObserver.

### Controller fallback
`rincon-calma.js start2d()`.

Aquarium/generic branches create unowned ResizeObservers.

R64 confirms repeated fallback entry can accumulate active observers.

Status:
`PARTIAL_EVIDENCE_WITH_CONFIRMED_DEFECT`.

## 8 · G06 LIFECYCLE

Positive:
- `stop3d()` calls scene3d.stop() and nulls handle;
- pagehide stops scene/3d/pause/audio-related state;
- R42 WebGL stop removes pointer listeners and disconnects its ResizeObserver.

Negative:
- dynamic reduced motion resume defect R65;
- controller fallback observer defect R64.

Status:
`PARTIAL_EVIDENCE_WITH_CONFIRMED_DEFECTS`.

## 9 · G07 RESOURCE OWNERSHIP

WebGL R42:
- program deleted;
- VAO deleted;
- ResizeObserver disconnected;
- listeners removed;
- rAF cancelled.

Shader handles:
not explicitly deleted after link.

MDN WebGL best practices recommends deleting shader handles once no longer needed.

GC can eventually mark/delete shader objects, so this is not classified as a leak.

Status:
`PARTIAL_EVIDENCE`.

Controller fallback observers:
R64 confirmed missing ownership.

## 10 · G08 RENDER/TIMING

Strengths:
- rAF;
- dt clamp .05;
- DPR cap 1.6;
- pointer interpolation;
- procedural GPU render.

No adaptive DPR in this R42 engine.
Context option requests:
`powerPreference:'high-performance'`,
`desynchronized:true`.

These are hints, not guarantees.

No hardware/mobile budget evidence in Motor training.

Status:
`PARTIAL_EVIDENCE`.

## 11 · G09 MOTION/SENSORY

Positive:
`reduced()` stops time progression and scheduling.

Static frame:
preserves scene without continuous motion.

Confirmed defect:
when reduced returns to false,
there is no explicit self-resume signal.

R65:
dynamic transition is asymmetric.

Status:
`PARTIAL_EVIDENCE_WITH_CONFIRMED_RESUME_DEFECT`.

Desired perceptual policy remains Lumen/Axioma/HUMAN QA.

## 12 · G10 ACCESSIBILITY IMPLEMENTATION

Public UI:
- scene choices are buttons;
- actions are buttons;
- canvas role=img;
- aria-label;
- reduced motion control exists;
- no autoplay by scene selection alone.

Static tests verify:
- reduced-motion CSS present;
- forced-colors CSS present.

Not proven here:
- full keyboard flow;
- screen reader experience;
- AT behavior of active scene;
- motion criterion.

Status:
`PARTIAL_EVIDENCE`.

Axioma owns formal conformance.

## 13 · G11 PERFORMANCE EVIDENCE

Positive architecture:
- single fullscreen triangle;
- shader procedural;
- DPR cap;
- no network in engine.

Potential cost:
fragment shader full-stage;
high-performance GPU preference;
continuous rAF while not reduced.

Not Motor-evidenced:
- mobile GPU;
- battery;
- thermal;
- hardware soak;
- field responsiveness.

Status:
`PENDING_ENVIRONMENT`.

## 14 · G12 FAILURE INJECTION

Evidenced:
- synthetic no-WebGL/fallback architecture by code.
- platform-level WebGL context loss R49/R51.

Not integrated:
- R42 context loss.

Important:
R42 registers no:
- webglcontextlost;
- webglcontextrestored.

MDN:
after WebGL restoration, prior resources are invalid and must be recreated.

Therefore:
integrated resilience to spontaneous context loss is not evidenced.

Status:
`NOT_EVIDENCED` for context recovery.

## 15 · G13 ENGINE/DEVICE

Motor environment:
Chromium only.

No:
- Firefox;
- WebKit;
- real iOS/Android;
- hardware GPU.

Status:
`PENDING_ENVIRONMENT`.

## 16 · G14 TEST EVIDENCE

Existing:
`tools/test-r42-rincon.js`

It verifies statically:
- route assets;
- 12 scene buttons;
- runtime export;
- scene map;
- CSS reduced motion;
- CSS forced colors;
- audio export/explicit-action marker.

It does NOT test:
- ResizeObserver cleanup;
- runtime stop;
- dynamic reduced-motion changes;
- context loss;
- pointer behavior;
- WebGL recovery.

R64/R65 fill part of the lifecycle gap.

Status:
`PARTIAL_EVIDENCE`.

## 17 · G15 HANDOFF BOUNDARY

Motor:
runtime/scheduler/resource ownership.

Lumen:
desired immersive/sensory experience.

Axioma:
formal accessibility.

Astra:
acceptance/architecture priority.

Vector:
integrated preview/engine matrix.

Status:
`PASS_EVIDENCED`.

## 18 · Confirmed strengths

1. Progressive WebGL2 → static2d fallback.
2. Stale async scene token.
3. rAF time-based rendering.
4. dt clamp.
5. DPR cap.
6. explicit 3D handle stop.
7. pointer listener cleanup.
8. engine ResizeObserver cleanup.
9. program/VAO deletion.
10. DOM controls outside canvas.
11. no autoplay by mere page load.
12. reduced mode produces static frame.

## 19 · Confirmed defects from training

### R64
Controller 2D fallback:
unowned ResizeObservers accumulate.

### R65
Dynamic reduced motion:
normal → reduce works;
reduce → normal does not self-resume.

No severity assigned.

## 20 · Unproven resilience gaps

- spontaneous WebGL context loss;
- multi-engine behavior;
- real mobile lifecycle;
- hardware GPU performance;
- AT integration;
- long session energy.

## 21 · Overall result

Motor does **not** issue global PASS.

Result:

`RINCON_R42_PUBLIC_RUNTIME_STRONG_PROGRESSIVE_BASE__LIFECYCLE_DEFECTS_AND_ENV_GAPS_REMAIN`

This means:
- architecture has several strong patterns;
- two concrete lifecycle defects are evidenced;
- some critical resilience claims remain untested.

## 22 · Why static PASS was not wrong

`R42_A7_QUIET_SPACE_STATIC_PASS`
proves its declared static contract.

It does not claim:
- runtime lifecycle PASS;
- context recovery;
- dynamic preference transitions.

R64/R65 therefore extend evidence rather than invalidate unrelated static checks.

## 23 · Next integrated gate

When product work resumes:

1. force WebGL unavailable;
2. enter/exit 2D fallback repeatedly;
3. count observers;
4. toggle site reduced motion on/off with active WebGL scene;
5. inject context loss;
6. test stop/restart;
7. run on Chromium/Firefox/WebKit;
8. real mobile;
9. HUMAN QA.

## 24 · Marker

`MOTOR_RINCON_R42_PUBLIC_RUNTIME_GATE_APPLIED_R66`

## 25 · Límites

No:
- release recommendation;
- severity;
- patch;
- issue;
- build;
- merge;
- deploy;
- production change.
