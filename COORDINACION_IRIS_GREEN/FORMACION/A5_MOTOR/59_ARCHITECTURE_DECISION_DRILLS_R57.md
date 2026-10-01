# MOTOR · A5 · PRÁCTICA R57 · ARCHITECTURE DECISION DRILLS

Fecha: 01/10/2026
Amplía: R01–R56
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No es certificación externa.

## Objetivo

Demostrar criterio técnico integrado, no conocimiento aislado de APIs.

Para cada escenario responder:

```
TASK
STATE
SURFACE
INPUT
ASYNC
PERFORMANCE
FALLBACK
ACCESSIBILITY
FAILURE TEST
WHY NOT MORE COMPLEX
HANDOFF
```

---

# ESCENARIO 1 · Mapa interactivo educativo con ~300 puntos

## Task
Explorar lugares/puntos, seleccionar uno y leer información.

## Decisión

### Surface
**SVG + DOM list/controls**.

Razón:
- 300 objetos es moderado;
- cada punto puede ser nodo semántico/interactivo;
- transforms/zoom manejables;
- hit targets ampliables;
- CSS/DOM event model útil.

### State
```
selectedId
viewTransform
filter
keyboardActiveId
```

### Input
- click/tap;
- keyboard;
- optional pan/zoom;
- +/-/reset;
- pinch como enhancement, no única vía.

### Async
Datos precargados o fetch con revision/AbortSignal.

### Performance
No WebGL inicialmente.

Medir node/style cost antes de escalar.

### Fallback
Lista HTML completa + enlaces.

### Accessibility
- nombre de cada punto;
- list equivalent;
- roving tabindex si patrón lo justifica;
- single-pointer alternatives.

### Failure tests
- SVG unsupported unlikely but semantic list remains;
- resize;
- zoom;
- filter stale;
- keyboard.

### Why not Canvas/WebGL
Canvas obligaría a reconstruir semántica/hit testing.
WebGL sería sobreingeniería para 300 puntos.

### Handoff
Prisma/Croma visual.
Axioma semantics.
Atlas data/assets.

**DECISION PASS**.

---

# ESCENARIO 2 · Pixel editor 64×64

## Task
Pintar pixels, borrar, undo/redo, export.

## Surface
**Canvas2D** para visual/editor.

Modelo lógico:
typed/grid state separado del bitmap.

## Input
- pointer/touch;
- keyboard grid/controls;
- pointercancel;
- optional pen.

## State
```
pixels
tool
color
cursor
history
dirty
```

## Undo
Command/stroke grouping o snapshots compactos.

64×64:
snapshots todavía razonables si medidos.

## Worker
No por defecto.

Worker solo para:
- expensive export/filter;
- large preview.

## Fallback
Semantic grid/control path for keyboard/AT.

## Export
Blob → object URL → revoke.

## Failure
- cancel mid-stroke;
- file import invalid;
- resize/DPR;
- undo after import.

## Why not WebGL
No necesidad de GPU complexity.

**DECISION PASS**.

---

# ESCENARIO 3 · Game of Life 20×12

## Task
Toggle cells, step/run, speed.

## State
Pure logical grid.

## Surface
DOM grid or Canvas depending UI density.

For 240 cells:
**DOM buttons can remain viable** and semantically strong.

Canvas enhancement optional.

## Compute
JavaScript.

No Wasm.
No GPU.

Worker:
only if simulation scale becomes much larger or concurrent work measured.

## Timing
Fixed logical timestep.

UI render decoupled from simulation clock.

## Accessibility
- keyboard;
- pause/step;
- status;
- no color-only cell state.

## Failure
- hidden tab;
- rapid pause/run;
- stale worker if introduced.

## Why not Worker now
240 cells is tiny.

**DECISION PASS**.

---

# ESCENARIO 4 · Pecera audiovisual 10 minutos

Dos posibles implementations deben separarse.

## A · Pre-rendered audiovisual asset

Use:
**HTMLVideoElement + audio track in media**.

Why:
- browser buffering;
- A/V sync;
- hardware decode;
- controls/lifecycle.

Do NOT use WebCodecs for plain playback.

MediaCapabilities can inform source choice when valuable.

## B · Generative 3D scene

Use:
**WebGL/Three** only if generative benefit justifies it.

Contract:
- explicit play/start;
- reduced motion;
- static/poster fallback;
- hidden pause;
- adaptive DPR;
- context loss recovery;
- stop/dispose.

Audio:
separate clock/media ownership coordinated with Lumen/Eco.

## Accessibility
controls outside canvas, DOM.

## Failure
- decode fail;
- context lost;
- GPU slow;
- background;
- audio blocked.

## Why not force generative
Pre-rendered video may be more stable, power-efficient and predictable.

## Handoff
Lumen perceptual/media.
Eco audio/media validation.
Astra gate.

**DECISION PASS**.

---

# ESCENARIO 5 · Panel Sabik conversacional

## Surface
**Semantic DOM**.

Not Canvas.
Not SVG.

## State
```
idle
connecting
retrieving
rendering
error
cancelled
```

Domain state separate from visual motion.

## Async
- AbortController;
- revision/request ID;
- stale result guard;
- timeout taxonomy;
- streaming backpressure/batching.

## Input
textarea/form.
IME-aware shortcuts.

## Output
DOM text/results.
Live region only for useful status, not token spam.

## Motion
optional presentation layer.
Reduced/no motion.

## Failure
- cancel;
- network error;
- timeout;
- old response;
- hidden/pagehide;
- reconnect.

## Why not framework-heavy custom runtime
Native forms/DOM already solve semantics.

## Handoff
Pulso transport.
Nube retrieval.
Córtex model.
Axioma accessibility.
Vigía observability.

**DECISION PASS**.

---

# ESCENARIO 6 · Music sequencer

## Surface
DOM controls + Canvas/SVG timeline if visual density needs it.

## State
pattern + BPM + playhead logical.

## Master clock
**AudioContext.currentTime**.

Do not use setTimeout as musical clock.

## Scheduler
lookahead:
program events onto audio timeline.

## Visual
rAF reads audio clock.

## AudioWorklet
Only for custom DSP/synthesis needing audio thread.

Not necessary for basic scheduling if Web Audio nodes suffice.

## Worker
Not master clock.
May do analysis/export.

## Accessibility
- pattern keyboard editing;
- visual playhead;
- essential state not audio-only;
- stop/pause explicit.

## Failure
- AudioContext suspended;
- background;
- BPM change;
- stop while events scheduled.

## Handoff
Eco audio validation.
Axioma a11y.

**DECISION PASS**.

---

# ESCENARIO 7 · Página de 500 recursos

## Base
**semantic HTML**.

## Optimization sequence

1. server/static HTML;
2. responsive layout;
3. lazy images;
4. content-visibility:auto on expensive distant sections if measured;
5. search/filter efficient;
6. only then JS virtualization if truly necessary.

## Why not virtualization first
Can break:
- find-in-page;
- focus;
- AT;
- print;
- deep linking.

## State
filter/query only.

## Worker
Maybe for heavy full-text index, not simple filter.

## Failure
No-JS content remains discoverable where product requires.

## Handoff
Atlas content/data.
Prisma layout.
Axioma semantics.

**DECISION PASS**.

---

# ESCENARIO 8 · Abrir/guardar proyecto del Taller

## Base open
`<input type=file>`.

Works broadly.

## Enhancement
File System Access:
- showOpenFilePicker;
- showSaveFilePicker
when supported.

## Drag/drop
Optional.
Never only method.

## Import pipeline
```
select
→ size check
→ read
→ parse
→ schema/version
→ validate domain
→ candidate
→ atomic commit
```

## Storage
IDB for authorized local persistence.
Memory fallback must say non-persistent.

## Failure
- cancel;
- too large;
- invalid JSON;
- wrong studio/version;
- quota;
- storage unavailable.

## Security
Never execute file content.

## Why not OPFS as canonical by default
Hidden origin-private storage is not equivalent to user-owned export.

**DECISION PASS**.

---

# ESCENARIO 9 · Arquitectura 2D + vista 3D

## Split responsibilities

### 2D plan
SVG or Canvas.

If walls are moderate and need semantic selection:
**SVG candidate**.

If direct freeform/dense drawing dominates:
Canvas.

### 3D
WebGL/Three.

## Shared state
Domain model:
```
walls[]
selectedId
camera/view
```

2D and 3D render from same model.

Do NOT make Canvas pixels canonical state.

## Async
3D resources separate.

## Failure
If WebGL fails:
2D editor still works.

## Accessibility
Core architecture edit should remain operable without 3D.

## Why not “everything WebGL”
3D failure must not destroy plan editing.

**DECISION PASS**.

---

# ESCENARIO 10 · Live preview generated from heavy simulation

## Task
User edits parameters; preview recalculates.

## Architecture
Main:
- input/model;
- UI;
- latest revision.

Worker:
- simulation.

Protocol:
```
revision
params
cancel/supersede
result
```

Queue:
latest-wins.

## Render
Canvas/ImageBitmap.

Worker may render OffscreenCanvas if measured benefit.

## Backpressure
At most one/few in flight.
Discard stale.

## Failure
Worker crash → local/basic fallback or error state.

## Why not synchronous
R55 demonstrates main-thread impact of heavy CPU.

**DECISION PASS**.

---

# Cross-scenario principles

## Choose DOM when
semantics/controls/text dominate.

## Choose SVG when
moderate vector objects + semantics/transforms.

## Choose Canvas when
dense direct graphics and custom draw loop.

## Choose WebGL when
GPU rendering materially needed.

## Choose WebGPU when
measured use-case + fallback, not novelty.

## Choose Worker when
measured CPU work blocks main and protocol cost is justified.

## Choose Wasm when
profiled compute bottleneck + measured gain + toolchain owner.

## Choose native HTML first
for:
- buttons;
- forms;
- dialog;
- popover;
- file input;
- video/audio playback.

# Exam questions answered by drills

1. Does Motor pick the newest API?
**No.**

2. Does GPU automatically mean better product?
**No.**

3. Does Worker make compute cheaper?
**No. It changes scheduling/isolation.**

4. Is Canvas state canonical?
**Prefer domain state separate.**

5. Is fallback an afterthought?
**No. It is part of architecture.**

6. Can Motor decide legal/accessibility conformance?
**No. Axioma/Lex as applicable.**

7. Can Motor self-deploy?
**No. Vector.**

# Resultado

10/10 scenarios have:
- primary architecture;
- fallback;
- input;
- state;
- failures;
- boundary;
- rejected overengineering.

Marker:

`MOTOR_ARCHITECTURE_DECISION_DRILLS_PASS_R57`

No product/build/merge/deploy.
