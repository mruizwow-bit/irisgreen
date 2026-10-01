# MOTOR · A5 · GAP REVIEW R56 · MADUREZ, FRONTERAS Y SIGUIENTE FASE DE FORMACIÓN

Fecha: 01/10/2026
Cobertura revisada: R01–R55
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Por qué existe este gap review

Una formación madura no mejora por acumular indefinidamente nombres de APIs.

R01–R55 ya cubren:
- fundamentos;
- arquitectura;
- failure modes;
- browser platform;
- rendering;
- input;
- media;
- storage;
- performance;
- security;
- lifecycle;
- múltiples laboratorios.

A partir de aquí:
**más amplitud tiene rendimiento decreciente.**

Nueva fase:
`SCENARIO → DECISION → PRACTICE → EVIDENCE → REVIEW`.

## 2 · Cobertura consolidada de Motor

### Runtime fundamentals
- event loop;
- tasks/microtasks;
- state machines;
- events;
- async ownership;
- cancellation;
- reentrancy.

### Input
- keyboard;
- IME;
- pointer/touch/pen;
- pointer cancel;
- high-fidelity pointer;
- multipoint gestures;
- gamepad;
- device motion/sensors;
- privileged input.

### Rendering
- DOM;
- Canvas2D;
- SVG;
- WebGL;
- WebGPU boundary;
- OffscreenCanvas;
- fonts;
- image decode;
- color pipeline;
- scroll-driven animation.

### Concurrency
- Workers;
- MessageChannel;
- backpressure;
- queues;
- transferables;
- SharedArrayBuffer boundary;
- locks/multitab.

### Media
- audio clocks;
- AudioWorklet;
- video frame scheduling;
- MediaCapabilities;
- WebCodecs boundary;
- bitmap/frame ownership.

### Storage / files
- IndexedDB;
- OPFS;
- quotas;
- File API;
- File System Access;
- import/export;
- Clipboard;
- drag/drop.

### Lifecycle
- visibility;
- pagehide/pageshow;
- bfcache;
- mobile interruption;
- prerender;
- component mount/unmount;
- resource cleanup.

### Performance
- INP decomposition;
- Long Tasks/LoAF;
- main-thread budgets;
- worker isolation;
- GC/allocation;
- energy;
- adaptive quality;
- visual stability/CLS;
- CSS containment.

### Compatibility
- Baseline;
- capability detection;
- failure injection;
- progressive enhancement;
- cross-browser evidence boundaries.

### Security runtime
- CSP/dynamic code;
- Trusted Types;
- DOM sinks;
- cross-origin messaging;
- iframe sandbox;
- permissions/user activation.

### Testing
- Playwright concepts;
- synthetic browser labs;
- GPU failure injection;
- soak/stress methodology;
- evidence labels.

## 3 · Evidencia práctica ya ejecutada

Entre otras:

### State/motion
- 11/11 contract checks.

### Async ownership
- 2/2 cancellation/revision checks.

### Listener lifecycle
- AbortSignal cleanup lab.

### WebGL
- context loss/restore 6/6;
- repeated recovery 5/5 cycles.

### Input contracts
- IME synthetic shortcut;
- global arrow scope synthetic.

### DOM lifecycle
- observers/listeners detach/reinsert/cleanup 4/4.

### Canvas
- font geometry practice;
- context attributes/reset lab.

### Performance
- sync 80 ms vs Worker:
  next-paint median ~80.3 ms vs ~0.4 ms.

### Geometry
- SVG inverse transform;
- pinch center/scale;
- scroll timeline progress.

## 4 · Evidencia que NO existe todavía

### Engine matrix
No Firefox/WebKit runtime available in current lab.

### Real IME
No CJK/mobile IME integrated test.

### Real mobile
No physical:
- iOS;
- Android;
- virtual keyboard;
- app kill;
- thermal/battery.

### Hardware GPU
WebGL labs use SwiftShader.

### Integrated context loss
No Three.js/Iris scene context-loss test.

### Assistive technology
No:
- NVDA;
- JAWS;
- VoiceOver;
- TalkBack
lab owned by Motor.

### Long product soak
No 30–60 min integrated A5 product soak.

### Field performance
No RUM/real-user INP/CLS under Motor authority.

## 5 · Fronteras profesionales · no absorber

### Prisma · A8
Owns:
- frontend platform;
- design system;
- component architecture at platform level;
- visual component conventions.

Motor:
behavior/runtime inside agreed platform.

### Lumen · A7
Owns:
- immersive media product;
- audiovisual experience;
- perceptual media direction.

Motor:
runtime/pipeline/scheduling when requested.

### Eco · A6
Owns:
- audio/media validation;
- DSP/quality;
- voice/media QA.

Motor:
interactive audio runtime.

### Pulso · A3
Owns:
- conversational connection/runtime transport;
- session/turn integration.

Motor:
browser interaction/render around it.

### Córtex · A10
Owns:
- model/provider;
- agents;
- RAG consumption;
- context/evals/LLMOps.

Motor:
no model selection.

### Nube · A9
Owns:
- corpus/retrieval/sources/citations.

### Vigía · A4
Owns:
- observability;
- privacy;
- incident evidence;
- telemetry governance.

Motor:
local instrumentation contract, not production telemetry policy.

### Axioma
Owns:
- standards interpretation;
- conformance;
- accessibility PASS/FAIL criteria.

Motor:
implementation + technical evidence.

### Vector · A2
Owns:
- integration;
- release;
- preview/deploy.

Motor:
never self-deploys.

### Atlas · A1
Owns:
- content systems/assets/publishing.

### Astra
Owns:
- architecture across product;
- QA/gates;
- technical acceptance.

## 6 · Remaining gaps that are truly Motor

The remaining high-value gaps are **environment/application dependent**, not missing API theory.

1. real-device input lab;
2. real IME lab;
3. engine matrix;
4. integrated GPU recovery;
5. dynamic mount leak/heap profile;
6. product soak;
7. capability-failure matrix in integrated preview;
8. latency profile under actual A5 workload;
9. context restoration with Three custom resources;
10. editor under real large document.

## 7 · Gaps that require collaboration

### Motor + Axioma
- keyboard/AT integrated QA;
- pointer cancellation semantics;
- gesture alternatives;
- Canvas/SVG accessibility.

### Motor + Pulso
- Sabik lifecycle;
- streaming/backpressure;
- mobile disconnect/reconnect;
- stale result ownership.

### Motor + Lumen/Eco
- audiovisual clocks;
- media decode/power;
- long-session sensory/perceptual QA.

### Motor + Vigía
- performance telemetry/RUM;
- error evidence;
- privacy-preserving diagnostics.

### Motor + Prisma
- component lifecycle;
- overlays/top layer;
- visual stability;
- containment.

### Motor + Vector
- engine/browser preview matrix;
- CSP/runtime integration;
- release artifact.

## 8 · Stop list · no more horizontal study by default

No abrir bloques nuevos solo por encontrar:
- otra experimental API;
- otra CSS property;
- otro browser proposal.

Abrir Rxx solo si:
1. resuelve una laguna de responsabilidad A5;
2. cambia una decisión técnica;
3. prepara un escenario probable de Iris Green;
4. produce práctica/evidence.

## 9 · Nueva estrategia de Formación

### Phase A · completed
Breadth/foundation.

### Phase B · current
Scenario drills.

### Phase C
Integrated labs cuando desarrollo/entorno lo permita.

### Phase D
Review after incidents/new platform changes.

## 10 · Competency model

Motor debe poder responder a un problema con:

```
INTENT
→ DOMAIN STATE
→ INPUT
→ EVENTS
→ ASYNC OWNERSHIP
→ SCHEDULING
→ RENDER SURFACE
→ RESOURCE OWNERSHIP
→ FALLBACK
→ ACCESSIBILITY
→ PERFORMANCE
→ FAILURE INJECTION
→ EVIDENCE
→ HANDOFF
```

Si no puede:
estudia esa laguna.

## 11 · Evidence maturity levels

### L0 · Read
Documentación leída.

### L1 · Explain
Puede explicar.

### L2 · Synthetic practice
Modelo/unit/synthetic.

### L3 · Browser lab
Ejecución real en engine.

### L4 · Engine matrix
Multiple engines.

### L5 · Real device
Hardware/OS.

### L6 · Integrated preview
Producto real en preview.

### L7 · Human QA
Perceptivo/operativo.

No llamar “dominio completo” a L1/L2.

## 12 · Estado actual estimado

Muchos dominios:
L1–L3.

Algunos:
solo L1/L2 por entorno.

Pocos:
L4–L7, porque jornada es Formación y no producto.

Esto es normal y debe permanecer explícito.

## 13 · ¿Está Motor “formado”?

Sí para una **foundation profesional interna avanzada**:
- sabe límites;
- sabe buscar;
- sabe practicar;
- sabe no sobreafirmar;
- deja continuidad.

No:
- certificado externo;
- experto omnisciente;
- sustituto de especialistas;
- “terminado para siempre”.

Estado:
`ADVANCED_FOUNDATION_ACTIVE_CONTINUOUS_LEARNING`.

## 14 · Siguiente tipo de trabajo formativo

No otra API.

Hacer:
**architecture decision drills**.

Escenarios:
- mapa;
- editor;
- escena 3D;
- simulación;
- Sabik panel;
- audio tool;
- long list;
- offline/import.

En cada uno:
elegir arquitectura y justificar tradeoffs.

## 15 · Marcador

`MOTOR_ADVANCED_FOUNDATION_GAP_REVIEW_R56`

## 16 · Límites

No:
- certificación;
- claim de cross-browser;
- producto;
- build;
- merge;
- deploy;
- main/production.
