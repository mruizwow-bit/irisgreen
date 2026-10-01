# MOTOR · A5 · PRÁCTICA R58 · INCIDENT DIAGNOSIS DRILLS

Fecha: 01/10/2026
Amplía: R01–R57
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No es certificación externa.

## Objetivo

Entrenar diagnóstico antes de corrección.

Para cada incidente:

```
SYMPTOM
DO NOT ASSUME
FIRST EVIDENCE
HYPOTHESES
DISCRIMINATING TEST
LIKELY OWNER
SAFE CONTAINMENT
PERMANENT FIX GATE
```

---

# INCIDENTE 1 · “Al escribir, el editor se queda pegado”

## Síntoma
Caret/texto responde tarde al teclear.

## No asumir
“No es suficiente CPU”.

## Primera evidencia
- input handler duration;
- next paint delay;
- Long Tasks;
- profiler;
- worker queue;
- document size.

## Hipótesis
1. parser completo en input handler;
2. JSON serialization/autosave;
3. layout/reflow;
4. syntax DOM replacement;
5. worker results aplicados demasiado frecuentemente.

## Test discriminante
Desactivar cada secondary task sin tocar input model.

Si latency desaparece:
culprit isolated.

R55:
80 ms sync work bloquea next paint; Worker separa scheduling.

## Owner
Motor.

Prisma if component/platform rendering architecture involved.

## Containment
Disable non-essential analysis/highlighting.

Never disable basic editing.

**DIAGNOSIS PASS**.

---

# INCIDENTE 2 · “La escena 3D queda negra al volver de otra app”

## No asumir
“Three.js bug”.

## Evidence
- webglcontextlost/restored;
- console;
- renderer info;
- visibility/pagehide;
- resource handles;
- scene domain state.

## Hypotheses
1. context lost and resources not recreated;
2. renderer stopped and no resume;
3. canvas resized 0;
4. stale scene owner;
5. shader/program compile fail.

## Discriminating tests
- WEBGL_lose_context lab/integration;
- inspect canvas size;
- fresh simple clear after restore;
- verify generation/resource registry.

R49/R51 demonstrate platform loss/recovery.

## Containment
Static/poster fallback + DOM controls.

## Owner
Motor runtime.
Lumen product experience.
Astra gate.

**DIAGNOSIS PASS**.

---

# INCIDENTE 3 · “Después de cancelar una consulta Sabik, aparece la respuesta anterior”

## No asumir
“Cloud devolvió mal”.

## Evidence
- request/turn ID;
- serial/revision;
- AbortSignal reason;
- timestamp ordering;
- panel state.

## Hypotheses
1. old async result applied;
2. cancel only visual, not transport;
3. duplicate handler;
4. reconnect replay;
5. state mismatch between Pulso/Motor UI.

## Discriminating test
A slow → cancel → B fast → A arrives late.

Assert:
A can never mutate B.

## Existing strength
iris-mount serial/ticket checks observed.

Need verify full transport chain with Pulso.

## Owner
Motor UI + Pulso transport.

**DIAGNOSIS PASS**.

---

# INCIDENTE 4 · “Un proyecto importado rompe el Taller”

## No asumir
“El JSON estaba corrupto”.

## Evidence
- file size;
- parse result;
- schema/version;
- estudio;
- migration;
- state before/after;
- transaction boundary.

## Hypotheses
1. malformed JSON;
2. valid JSON invalid schema;
3. old version;
4. wrong studio;
5. huge/pathological values;
6. partial mutation before validation.

## Test
Use corpus:
- valid;
- malformed;
- wrong version;
- oversized;
- unexpected Unicode;
- deeply nested/edge values.

## Containment
Reject candidate before commit.
Preserve previous state.

## Owner
Motor + Atlas for format/content-system contract.

**DIAGNOSIS PASS**.

---

# INCIDENTE 5 · “En móvil, el botón queda tapado por el teclado”

## No asumir
“viewport CSS bug”.

## Evidence
- layout viewport;
- visualViewport;
- focus target;
- keyboard appearance;
- fixed/sticky bars;
- orientation.

## Hypotheses
1. 100vh layout;
2. bottom fixed control;
3. no scrollIntoView/caret strategy;
4. VirtualKeyboard overlay mode;
5. safe-area issue.

## Test
Physical mobile preferred.
Emulation only partial.

## Containment
Allow scroll and native layout behavior.
Do not lock viewport.

## Owner
Motor runtime + Prisma layout.

**DIAGNOSIS PASS**.

---

# INCIDENTE 6 · “El audio del secuenciador se va desfasando”

## No asumir
“AudioWorklet is needed”.

## Evidence
- scheduling clock;
- setTimeout jitter;
- AudioContext.currentTime;
- output latency;
- CPU load;
- tab visibility.

## Hypotheses
1. relative JS timer drives beat;
2. event scheduled on callback arrival;
3. visual playhead drives audio;
4. background throttling;
5. device latency interpreted as drift.

## Test
Compare:
expected absolute audio deadline vs actual event times over 1/5/10 min.

## Permanent architecture
Audio clock master + lookahead scheduler.

## Owner
Motor timing + Eco audio validation.

**DIAGNOSIS PASS**.

---

# INCIDENTE 7 · “Dos pestañas sobrescriben el mismo proyecto”

## No asumir
“IndexedDB lost data”.

## Evidence
- transaction timestamps;
- project revision/version;
- Web Lock acquisition;
- BroadcastChannel events;
- last writer;
- tab IDs local-only.

## Hypotheses
1. no serialization;
2. local mutex used instead of cross-tab lock;
3. stale read then write;
4. broadcast missed/late;
5. same key no conflict policy.

## Test
Two contexts:
- read v1;
- A edits;
- B edits;
- write interleaving.

## Architecture
Web Locks + revision/conflict detection.
BroadcastChannel for notification, not mutual exclusion.

## Owner
Motor local runtime.
Vigía only if diagnostic evidence persisted.

**DIAGNOSIS PASS**.

---

# INCIDENTE 8 · “La página consume mucha batería estando abierta”

## No asumir
“WebGL is expensive, remove it”.

## Evidence
- visibility;
- rAF rate;
- CPU/GPU;
- media playback;
- workers;
- AudioContext;
- DPR;
- resize loop;
- idle updates.

## Hypotheses
1. rendering hidden;
2. DPR too high;
3. particle/object count;
4. worker busy loop;
5. audio context active;
6. decode loop;
7. repeated observer invalidation.

## Test
Measure:
visible vs hidden;
normal vs reduced/adaptive;
quality levels.

## Existing positive
current 3D loop skips updates when document.hidden and adapts DPR.

## Owner
Motor performance + Lumen/Eco where media.

**DIAGNOSIS PASS**.

---

# INCIDENTE 9 · “Al cerrar un modal, el teclado parece perdido”

## Evidence
- document.activeElement;
- invoker still connected;
- dialog/top layer;
- inert;
- DOM removal timing.

## Hypotheses
1. no focus restoration;
2. invoker replaced;
3. focus sent to body;
4. nested overlay conflict.

## Test
Open via keyboard → close via:
- button;
- Escape;
- submit/action.

Check focus.

## Architecture
Native dialog/popover where semantic.

## Owner
Motor behavior + Prisma component + Axioma QA.

**DIAGNOSIS PASS**.

---

# INCIDENTE 10 · “Un canvas funciona bien al principio y cada vez va más lento”

## Evidence
- node/resource counts;
- listeners;
- observers;
- pending rAF;
- GPU resources;
- ImageBitmap cache;
- history;
- allocations/GC.

## Hypotheses
1. duplicate render loops;
2. no destroy on remount;
3. observer/listener retention;
4. image bitmap not closed;
5. undo history unbounded;
6. per-frame allocation.

## Test
Repeated:
mount/use/destroy ×100.
Compare callback count and memory trend.

R52:
DOM detach alone does not equal listener/observer cleanup.

## Containment
Stop secondary effects, preserve state/export.

## Owner
Motor.

**DIAGNOSIS PASS**.

---

# INCIDENTE 11 · “La UI salta justo cuando intento pulsar”

## Evidence
- LayoutShift entries when available;
- image/font load;
- dynamic region;
- pointerdown/up target;
- focus.

## Hypotheses
- missing dimensions;
- font swap;
- error/status block changes height;
- panel injected before content.

## Test
Delay assets intentionally.
Track target positions.

## Architecture
Reserve geometry; stable status region.

## Owner
Motor + Prisma.

**DIAGNOSIS PASS**.

---

# INCIDENTE 12 · “Funciona en Chrome, falla en Safari”

## No asumir
“Safari is broken”.

## Evidence
- exact engine/version;
- feature support;
- operation error;
- fallback path;
- policy/permission.

## Classification
- unsupported;
- blocked;
- implementation bug;
- product fallback bug.

## Test
Same contract on WebKit/real Safari.

Current training environment:
no WebKit available.

Therefore:
cannot diagnose empirically today.

## Owner
Motor + Vector test environment.
Astra prioritizes.

**DIAGNOSIS PASS**.

---

# Diagnostic rules extracted

## Rule A · symptom != cause
“lag” may be CPU, layout, GPU, queue, network, storage.

## Rule B · disable secondary feature before rewriting core
Preserve user's main task.

## Rule C · reproduce with smallest discriminating test
Not full rewrite.

## Rule D · collect enough evidence, not every metric
Evidence must discriminate hypotheses.

## Rule E · owner matters
Do not fix Pulso/Lumen/Prisma layers from A5 without handoff.

## Rule F · negative result is evidence
If context loss test passes, move to next hypothesis.

## Rule G · rollback/containment is not permanent fix
Keep distinction.

# Result

12/12 incident drills produce:
- hypotheses;
- discriminating tests;
- containment;
- owner.

Marker:
`MOTOR_INCIDENT_DIAGNOSIS_DRILLS_PASS_R58`

No product/build/merge/deploy.
