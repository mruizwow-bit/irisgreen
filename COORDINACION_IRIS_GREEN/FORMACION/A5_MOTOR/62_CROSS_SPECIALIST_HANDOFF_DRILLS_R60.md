# MOTOR · A5 · PRÁCTICA R60 · HANDOFFS TÉCNICOS ENTRE ESPECIALISTAS

Fecha: 01/10/2026
Amplía: R48/R56/R58/R59
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre trabajo nuevo.
No es certificación externa.

## 1 · Objetivo

Entrenar cómo entregar un problema a otro especialista sin:
- delegar sin contexto;
- mandar todo el repositorio;
- decidir por el especialista;
- convertir sospecha en bug;
- perder límites de evidencia.

Formato Motor:

```
SUBJECT
WHY_YOU
CURRENT_STATE
EVIDENCE
WHAT_IS_KNOWN
WHAT_IS_UNKNOWN
QUESTION_FOR_SPECIALIST
NOT_REQUESTED
ARTIFACTS
STOP_CONDITION
```

---

# HANDOFF 1 · Sabik shortcut durante IME

## Destino
**Pulso + Axioma**

## Why you
Pulso:
runtime conversacional, turn/session/input integration.

Axioma:
criterio formal de accesibilidad/keyboard/IME implications.

## Current state
Motor synthetic lab R50.

## Evidence
Evento sintético Chromium:
`isComposing=true + Ctrl+Enter`
→ handler equivalente al actual ejecutó `requestSubmit()`.

## Known
El handler actual de `sabik/iris-mount.mjs` no consulta `isComposing`.

## Unknown
- comportamiento IME real por OS/browser;
- impacto real en Sabik integrado;
- requirement formal exacto.

## Question
1. Pulso: ¿el shortcut debe estar inhibido durante composición en el contrato conversacional?
2. Axioma: ¿qué pruebas/criterios necesitamos para teclado/IME?

## Not requested
No pedir:
- fix inmediato;
- cambiar shortcut;
- declarar WCAG FAIL.

## Artifacts
- R50 synthetic input lab;
- `sabik/iris-mount.mjs`.

## Stop condition
No producto hasta test integrado/decisión.

**HANDOFF PASS**.

---

# HANDOFF 2 · WebGL context recovery

## Destino
**Lumen + Astra + Vector**

## Why you
Lumen:
experiencia 3D/media perceptiva.

Astra:
arquitectura/gate técnico.

Vector:
preview/browser integration.

## Current state
Motor R49 + R51:
platform WebGL2 context-loss labs.

## Evidence
- 6/6 first-cycle checks;
- 5/5 repeated cycles;
- old resources invalid after restore;
- new resources valid.

## Known
Current 3D wrapper has:
- strong cleanup;
- no explicit contextlost/restored handlers observed.

## Unknown
- Three.js actual recovery;
- custom material recovery;
- scene assets;
- WebKit/Firefox;
- hardware GPU.

## Question
Astra/Lumen:
¿context recovery debe ser requisito del runtime 3D o basta fallback estático según experiencia?

Vector:
¿qué entorno de preview puede ejecutar loss/recovery integrado?

## Not requested
No pedir:
- añadir listeners ya;
- asumir que Three falla;
- deploy.

## Artifacts
- R49;
- R51;
- R59 gate.

## Stop condition
No issue de producto hasta prueba integrada.

**HANDOFF PASS**.

---

# HANDOFF 3 · Canvas/SVG accessibility

## Destino
**Axioma + Prisma**

## Why you
Axioma:
semántica/conformidad.

Prisma:
component/platform architecture.

## Current state
Motor estudió:
- Canvas direct manipulation;
- semantic grid fallback;
- SVG focus/navigation;
- pointer/keyboard;
- gesture alternatives.

## Evidence
R21/R42/R46/R59.

## Known
Canvas no expone automáticamente object semantics.
SVG sí ofrece DOM nodes but interaction still needs model.

## Unknown
Cuál patrón debe ser estándar transversal para herramientas A5.

## Question
Axioma:
qué minimum operable/semantic contract debe exigirse.

Prisma:
qué pattern reusable conviene:
- DOM overlay;
- parallel semantic grid;
- SVG controls;
- toolbar.

## Not requested
No pedir:
“certifica este canvas”.

## Stop condition
No crear design-system primitive desde A5 sin Prisma.

**HANDOFF PASS**.

---

# HANDOFF 4 · Secuenciador y audio drift

## Destino
**Eco + Astra**

## Current state
Motor R10/R57/R58.

## Evidence
Modelo:
relative main-thread timer puede acumular drift;
AudioContext clock debe ser master cuando precision importa.

## Known
Historical R43 scheduler used relative `setTimeout`.

## Unknown
- integrated current canonical sequencer;
- audible drift;
- target latency;
- sensory quality.

## Question
Eco:
qué temporal/perceptual tolerances y test methodology aplicar.

Astra:
si scheduler musical de precisión entra en acceptance gate del Taller.

## Not requested
No proponer AudioWorklet por defecto.
No llamar “audio roto”.

## Artifacts
- R10;
- architecture drill R57;
- diagnosis R58.

**HANDOFF PASS**.

---

# HANDOFF 5 · Visual stability / component lifecycle

## Destino
**Prisma + Astra**

## Current state
R45 visual stability.
R52 observer/listener lifecycle.

## Evidence
- DOM detach did not automatically deactivate observer/listener while referenced;
- explicit cleanup did;
- async geometry can cause layout shift.

## Known
R42 direct currently has page-lifetime observers and no destroy API.

## Unknown
Whether future frontend platform will:
- remount;
- virtualize;
- hot replace;
- SPA-navigate these tools.

## Question
Prisma:
¿lifecycle transversal seguirá document lifetime o component lifetime?

Astra:
si dynamic mount is planned, should destroy contract become architecture gate?

## Not requested
No refactor current code during training.

**HANDOFF PASS**.

---

# HANDOFF 6 · Runtime telemetry

## Destino
**Vigía**

## Current state
Motor defines local signals:
- stale result;
- context loss;
- worker failure;
- long interaction;
- fallback activation.

## Known
These signals are useful diagnostically.

## Unknown
- collection;
- retention;
- sampling;
- identifiers;
- privacy.

## Question
Vigía:
which runtime signals, if any, should become production evidence and under what minimization rules?

## Not requested
No analytics/telemetry implementation from A5.

## Artifacts
- R08 performance;
- R49/R51 context loss;
- R58 incident drills.

**HANDOFF PASS**.

---

# HANDOFF 7 · Cross-engine evidence

## Destino
**Vector + Astra**

## Current state
R53:
training environment = Chromium only.

## Evidence
No Firefox/WebKit binaries available in lab.

## Known
Many runtime contracts have Chromium evidence.

## Unknown
Engine-specific behavior.

## Question
Vector:
what integrated preview/CI matrix is sustainable for:
- Chromium;
- Firefox;
- WebKit.

Astra:
which runtime surfaces are critical enough to require all engines.

## Not requested
No browser installs/deploy during Training.

**HANDOFF PASS**.

---

# HANDOFF 8 · Sabik network lifecycle

## Destino
**Pulso + Vigía**

## Current state
Motor R32/R34/R58.

## Evidence
`iris-mount` uses pagehide for cancel/disconnect.
Visibility lifecycle not handled in this module.

## Known
pagehide is not final-event guarantee on all mobile kills.

## Unknown
Transport contract:
- connection cost;
- reconnect semantics;
- server session;
- privacy.

## Question
Pulso:
should hidden state pause, preserve, or disconnect transport?

Vigía:
what lifecycle evidence is useful without retaining user content?

## Not requested
No lifecycle rewrite from A5.

**HANDOFF PASS**.

---

# 2 · What makes a handoff good

A good handoff:
- is narrow;
- identifies owner;
- cites evidence;
- distinguishes known/unknown;
- asks a decision;
- says what is NOT being requested;
- preserves stop condition.

A bad handoff:
“Esto parece raro, arréglalo.”

## 3 · Handoff anti-patterns

### Solution dumping
“Pulso, add AbortController.”
Maybe transport already owns one.

### Authority laundering
“Axioma said accessibility.”
Without actual Axioma review.

### Evidence laundering
“WebGL recovery PASS.”
When only Chromium lab passed.

### Scope dumping
“Vector, test everything.”

### Hidden urgency
Calling P0 without impact/evidence.

## 4 · Handoff severity

Motor can describe:
- observed impact;
- reproducibility;
- uncertainty.

Astra/program coordination decides priority where cross-team.

## 5 · Slack vs GitHub

Slack:
- ask;
- clarify;
- quick coordination.

GitHub:
- decision;
- durable evidence;
- accepted handoff;
- state.

No critical decision exists only in Slack.

## 6 · Result

8/8 handoff drills contain:
- correct owner;
- evidence;
- unknowns;
- explicit question;
- non-requested scope;
- stop condition.

Marker:

`MOTOR_CROSS_SPECIALIST_HANDOFF_DRILLS_PASS_R60`

No actual product work opened.
