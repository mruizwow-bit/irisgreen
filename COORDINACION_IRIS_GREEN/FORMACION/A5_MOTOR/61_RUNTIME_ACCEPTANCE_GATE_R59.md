# MOTOR · A5 · PRACTICE R59 · RUNTIME ACCEPTANCE GATE Y APLICACIÓN SOBRE A5

Fecha: 01/10/2026  
Amplía: R01–R58  
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.  
No modifica producto.

## 1 · Objetivo

Construir un gate operativo reusable para runtime interactivo y aplicarlo a dos piezas reales de A5:

1. `sabik/sabik-motion-r37.js`
2. `tools/escenas-3d/src/index.js`

El gate NO produce una única palabra “PASS” si existen huecos de entorno.

Estados permitidos:

- `PASS_EVIDENCED`
- `PARTIAL_EVIDENCE`
- `PENDING_ENVIRONMENT`
- `NOT_EVIDENCED`
- `NOT_APPLICABLE`

## 2 · Baseline técnico actual

Fuentes externas vigentes estudiadas:

- WHATWG HTML Living Standard, Web application APIs, actualizado en septiembre de 2026.
- Pointer Events Level 3, W3C Recommendation 30/06/2026.
- WCAG 2.2, W3C Recommendation.
- web.dev INP: objetivo de referencia de campo ≤200 ms en p75, separado en input delay + processing + presentation delay.

Estas fuentes orientan el gate.

No sustituyen:
- Axioma para conformidad;
- HUMAN QA;
- browser/device matrix.

---

# 3 · Gate Motor

Todo runtime se revisa en este orden.

## G01 · DOMAIN STATE

Preguntas:
- ¿qué estado es duradero?
- ¿qué estados/transiciones son válidos?
- ¿hay combinaciones imposibles?

PASS requiere:
estado explícito o invariantes equivalentes.

## G02 · INPUT OWNERSHIP

Preguntas:
- ¿qué input controla la tarea?
- ¿scope correcto?
- ¿keyboard/touch/pointer cuando aplican?
- ¿cancelación?

No aplica a librerías puramente internas sin input directo.

## G03 · ASYNC OWNERSHIP

Preguntas:
- ¿trabajo puede acabar fuera de orden?
- ¿revision/request ID?
- ¿abort si es posible?
- ¿resultado viejo puede aplicar?

## G04 · FAILURE CONTRACT

Debe distinguir:
- cancel;
- unsupported;
- unavailable;
- runtime failure;
- stale result.

No infinito spinner/silent corruption.

## G05 · FALLBACK / PROGRESSIVE ENHANCEMENT

Una capability avanzada no puede ser dependencia silenciosa de la tarea si existe alternativa razonable.

## G06 · LIFECYCLE

Revisar:
- mount/start;
- hidden/background;
- disconnect/remove;
- stop/destroy;
- bfcache cuando aplique.

## G07 · RESOURCE OWNERSHIP

Revisar:
- listeners;
- observers;
- timers/rAF;
- workers;
- audio;
- GPU;
- bitmaps/object URLs.

## G08 · RENDER/TIMING

Revisar:
- timestamp/delta;
- no frame-count assumptions;
- batching;
- resize;
- visual stability.

## G09 · MOTION/SENSORY

Si existe movimiento:
- reduced motion;
- no-motion path cuando proceda;
- stop/cancel;
- no sorpresa sensorial.

## G10 · ACCESSIBILITY IMPLEMENTATION

Motor verifica capacidad técnica:
- keyboard;
- semantic equivalent;
- focus;
- non-pointer route;
- status.

Axioma decide conformidad formal.

## G11 · PERFORMANCE EVIDENCE

Niveles:
- static reasoning;
- synthetic lab;
- browser lab;
- field.

INP/field:
≤200 ms p75 es referencia de experiencia, no unit-test threshold.

## G12 · FAILURE INJECTION

Al menos un fallo material debe poder reproducirse:
- capability absent;
- stale async;
- context loss;
- worker failure;
- storage quota;
- cancel.

## G13 · ENGINE/DEVICE EVIDENCE

Etiquetas:
- Chromium only;
- engine matrix;
- real device.

No extrapolar.

## G14 · TEST EVIDENCE

Distinguir:
- unit;
- synthetic browser;
- integrated preview;
- HUMAN QA.

## G15 · HANDOFF BOUNDARY

¿La conclusión invade:
- Axioma;
- Prisma;
- Pulso;
- Lumen/Eco;
- Vigía;
- Vector;
- Astra?

Si sí:
handoff, no absorción.

---

# 4 · Aplicación A · Sabik Motion R37

Archivo:
`sabik/sabik-motion-r37.js`

Blob SHA observado:
`292742308a9181215767e05ebccd2cb9c71b0e63`

## G01 · Domain state

Estados:
- presente;
- orientar;
- transicion;
- pausa;
- confirmar.

Levels:
- NORMAL;
- REDUCIDO;
- SIN_MOVIMIENTO.

Invalid values:
RangeError.

Estados transitorios no permitidos como destination estable:
guard explícito.

Evidencia previa:
11/11 contract checks.

Estado:
`PASS_EVIDENCED`.

## G02 · Input ownership

Este módulo no captura teclado/pointer.

Recibe intención ya proyectada.

Estado:
`NOT_APPLICABLE`.

Input externo pertenece a caller/panel.

## G03 · Async ownership

Observado:
- revision;
- ticket;
- pending Map;
- cancel incrementa revision;
- ticket check antes de apply;
- pending promises resueltas cancelled.

Strength.

Límite:
`load(next)` no recibe AbortSignal.

Si load es costoso/abortable:
work puede continuar aunque result quede stale.

Estado:
`PARTIAL_EVIDENCE`.

## G04 · Failure contract

Load failure:
- no aplica asset fallido;
- requested vuelve a state;
- resultado puede incluir `assetUnavailable:true`.

Animation API errors:
fallback a complete().

Estado:
`PASS_EVIDENCED`.

## G05 · Fallback

Si:
- duration 0;
- static;
- `element.animate` inexistente;

flujo completa sin animación.

Estado:
`PASS_EVIDENCED`.

## G06 · Lifecycle

Controller expone:
- cancel;
- refresh;
- snapshot.

No posee document lifecycle.

Caller must call cancel/destroy as needed.

Estado:
`PARTIAL_EVIDENCE`.

## G07 · Resource ownership

Owns:
- active Animation;
- pending promises.

Cancel:
- nulls handlers;
- cancel animation;
- resolves pending;
- clears map.

Estado:
`PASS_EVIDENCED`.

## G08 · Render/timing

Motion uses durations/keyframes, not custom frame loop.

No frame-rate assumption inside controller.

Estado:
`PASS_EVIDENCED`.

## G09 · Motion/sensory

Explicit:
- systemReduced;
- REDUCIDO;
- SIN_MOVIMIENTO;
- globalOff;
- lowIntensity.

Safety/risk/error/retrieving/composing project to stable `presente`.

Estado:
`PASS_EVIDENCED`.

## G10 · Accessibility implementation

Module itself:
presentation layer only.

No semantic UI.

Reduced/no-motion supported.

Keyboard/focus belong caller.

Estado:
`PARTIAL_EVIDENCE` at module level.

Formal:
Axioma.

## G11 · Performance

No field performance specific to this controller.

Durations are short.
No proof of field impact.

Estado:
`NOT_EVIDENCED` for field performance.

## G12 · Failure injection

Executed:
- invalid states;
- invalid destination;
- stale ownership conceptual/labs.

No real failing asset/animation browser matrix.

Estado:
`PARTIAL_EVIDENCE`.

## G13 · Engine/device

Current training labs mostly Chromium.
No engine matrix.

Estado:
`PENDING_ENVIRONMENT`.

## G14 · Test evidence

Known:
- unit/isolated contract checks.

No claim:
integrated HUMAN QA from this training.

Estado:
`PARTIAL_EVIDENCE`.

## G15 · Handoff

Motion semantics/perceptual:
Astra/Axioma/HUMAN QA as applicable.

State presentation:
Motor owns runtime.

Status:
`PASS_EVIDENCED`.

## A · Resultado

Sabik Motion R37 no recibe un “PASS total”.

Resultado profesional:

`TECHNICAL_CONTRACT_STRONG__INTEGRATION_ENGINE_FIELD_GAPS_REMAIN`

Fortalezas:
- state;
- revision;
- fallback;
- cleanup;
- reduced/no motion.

Gaps:
- abortability of load;
- engine matrix;
- integrated accessibility/perceptual;
- field performance.

---

# 5 · Aplicación B · 3D Runtime

Archivo:
`tools/escenas-3d/src/index.js`

Blob SHA:
`401b02ad63c174c5b5640a9a0f482dfa23a1dfb1`

## G01 · Domain state

Runtime delegates scene domain to world maker.

Own runtime state:
- alive;
- last/raf;
- adaptive pixel ratio;
- idle timing.

State is simple but mostly implicit variables.

Estado:
`PASS_EVIDENCED` for runtime wrapper.

No conclusion on each world implementation.

## G02 · Input ownership

Exposes:
`poke(x,y)`.

Actual keyboard/touch/semantic controls live outside.

Estado:
`PARTIAL_EVIDENCE`.

## G03 · Async ownership

Main loop is synchronous.

No async load in this wrapper.

State switching/resource loading belongs outside/world makers.

Estado:
`NOT_APPLICABLE` to wrapper's main loop.

## G04 · Failure contract

`supported()` can detect absence of WebGL.

But `start()` itself does not visibly:
- catch renderer creation failure;
- expose structured fallback;
- handle spontaneous context loss.

Estado:
`PARTIAL_EVIDENCE`.

## G05 · Fallback

Module exposes `supported()`.

Fallback implementation is external to this file.

No proof here that every caller provides fallback.

Estado:
`NOT_EVIDENCED` at module boundary.

## G06 · Lifecycle

Positive:
- stop idempotent via alive;
- auto-stop if canvas disconnected;
- hidden tab skips update/render;
- ResizeObserver disconnected.

Estado:
`PASS_EVIDENCED`.

## G07 · Resource ownership

stop:
- cancelAnimationFrame;
- disconnect ResizeObserver;
- traverse scene;
- dispose geometry;
- dispose texture references found in materials;
- dispose materials;
- renderer.dispose;
- forceContextLoss.

Strong explicit cleanup.

Estado:
`PASS_EVIDENCED`.

## G08 · Render/timing

Positive:
- rAF timestamp;
- raw dt;
- dt clamp 0.05;
- hidden pause;
- idle throttling;
- DPR cap;
- adaptive quality based on average frame time.

Estado:
`PASS_EVIDENCED`.

## G09 · Motion/sensory

Runtime forwards:
`opts.reduced()`
to world.update.

No evidence in wrapper that each world honors reduced semantics correctly.

Estado:
`PARTIAL_EVIDENCE`.

Perceptual:
Lumen/HUMAN QA.

## G10 · Accessibility implementation

Canvas/WebGL surface itself has no semantic equivalent here.

Controls/equivalent must live outside.

Estado:
`NOT_EVIDENCED` at module level.

Not necessarily defect:
module is a renderer.

## G11 · Performance

Positive engineering:
- DPR cap 1.75;
- adaptive pixel ratio;
- hidden skip;
- idle throttle.

But no:
- real hardware budget;
- mobile soak;
- p75 field responsiveness.

Estado:
`PARTIAL_EVIDENCE`.

## G12 · Failure injection

R49:
context loss/restore 6/6 in Chromium lab.

R51:
5/5 repeated cycles.

Important:
those labs test platform contract, NOT this Three runtime.

No integrated loss listener observed.

Estado:
`PARTIAL_EVIDENCE`.

## G13 · Engine/device

Current lab:
Chromium + SwiftShader.

No Firefox/WebKit/hardware GPU.

Estado:
`PENDING_ENVIRONMENT`.

## G14 · Test evidence

Existing historical R22 WebGL test:
software renderer route checks.

Training:
context loss labs isolated.

No integrated recovery evidence.

Estado:
`PARTIAL_EVIDENCE`.

## G15 · Handoff

Motor:
runtime/lifecycle/perf.

Lumen:
immersive media/product/perception.

Axioma:
formal a11y criteria.

Astra:
architecture/gate.

Vector:
integrated preview.

Estado:
`PASS_EVIDENCED`.

## B · Resultado

3D wrapper status:

`STRONG_LIFECYCLE_AND_RENDER_LOOP__RESILIENCE_FALLBACK_DEVICE_GAPS_REMAIN`

Strengths:
- time-based loop;
- adaptive DPR;
- hidden behavior;
- cleanup.

Major evidence gaps:
- spontaneous context recovery integrated;
- caller fallback;
- semantic equivalent;
- engine matrix;
- hardware/mobile soak.

---

# 6 · Gate rule

No runtime gets a global PASS from Motor if any required category is:
- NOT_EVIDENCED;
- PENDING_ENVIRONMENT;

unless that category is truly NOT_APPLICABLE.

No “average score”.

A critical missing fallback cannot be compensated by 10 strong categories.

## 7 · Stop conditions

Motor stops release recommendation if:
- stale work can overwrite new intent;
- no path without optional capability;
- resource cleanup unknown in long-lived component;
- failure leaves task irrecoverable;
- accessibility equivalent absent where required;
- evidence claimed beyond tested environment.

## 8 · Performance interpretation

INP field target:
≤200 ms p75 is a useful product responsiveness reference.

Not:
- a component unit gate;
- a guarantee of accessibility;
- a replacement for profiling.

R55:
shows main-thread blocking mechanism, not product INP.

## 9 · WCAG boundary

WCAG 2.2 is current Recommendation.

Motor implements:
- keyboard/fallback/motion/input behavior.

Axioma:
formal success-criterion mapping and conformance.

No self-certification by Motor.

## 10 · Pointer standard boundary

Pointer Events Level 3:
Recommendation 30/06/2026.

Level 4:
Working Draft.

Motor can learn Level 4 but not use draft-only behavior as normative requirement.

## 11 · Result of R59

Reusable gate created:
15 categories.

Applied to:
- Sabik Motion R37;
- 3D runtime wrapper.

Outcome:
neither received false global PASS.

Markers:

`MOTOR_RUNTIME_ACCEPTANCE_GATE_DEFINED_R59`

`SABIK_MOTION_R37_TECHNICAL_CONTRACT_STRONG_ENV_GAPS_REMAIN`

`A5_3D_RUNTIME_STRONG_LIFECYCLE_RESILIENCE_GAPS_REMAIN`

## 12 · Next use

Apply gate when:
- A5 receives new runtime;
- Astra requests technical readiness;
- Vector asks for integration contract;
- incident exposes new failure path.

## 13 · Límites

No:
- release approval;
- conformance certification;
- product issue;
- product code change;
- build;
- merge;
- deploy;
- main/production.
