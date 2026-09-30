# SENDA · GAP REVIEW DE FORMACIÓN R01

Fecha: 30/09/2026

Estado:
`SENDA_TRAINING_GAP_REVIEW_R01`

Objetivo:
determinar qué debe seguir estudiando Senda, qué ya está suficientemente cubierto como foundation y qué pertenece a otros especialistas.

---

# 1 · Cobertura suficiente para foundation

## Profesión y fronteras
Cubierto:
- Interactive Experience Engineering;
- Creative Technology;
- límites con Astra/Prisma/Motor/Nube/Axioma/Lex/Vector.

## HCI
Cubierto:
- human-centred design;
- acción antes que tecnología;
- progressive disclosure;
- carga cognitiva;
- reorientación;
- estados y feedback.

## Accesibilidad
Cubierto a nivel de ingeniería Senda:
- WCAG 2.2 patterns relevantes;
- drag alternative;
- teclado/touch/pointer;
- focus;
- forced colors;
- reduced motion;
- orientation/reflow;
- audio alternatives;
- complex images;
- accessible names;
- status messages.

Axioma conserva autoridad de estándares/conformidad.

## Render
Cubierto:
- SVG/Canvas/WebGL/WebGPU;
- PBR;
- color spaces;
- glTF/KTX2;
- instancing;
- LOD;
- shader precompile;
- fallback;
- GPU state separation.

## Performance
Cubierto:
- Core Web Vitals;
- Event Timing;
- User Timing;
- Long Animation Frames;
- render cost;
- memory/resource lifecycle;
- performance budgets;
- lab profiling.

## Datos
Cubierto:
- source contracts;
- live/snapshot;
- rate limiting;
- query budget;
- schemas;
- uncertainty;
- provenance;
- source ≠ experience.

## Dominios R59
Foundation cubierta:
- Mar;
- Aves;
- Fósiles;
- Minerales;
- Trenes/metro;
- Espacio.

No significa expertise científico equivalente a un especialista de dominio.

## QA
Cubierto:
- product/test/evidence correctness;
- negative tests;
- metamorphic tests;
- model-based thinking;
- visual regression;
- manifests;
- reproducibility;
- sabotage/failure testing.

## Resiliencia
Cubierto:
- API errors;
- offline;
- stale data;
- context/device loss architecture;
- persistence boundaries.

## Usability
Cubierto:
- user evaluation vs conformance;
- COGA usability;
- límites de muestras pequeñas;
- ethical testing principles.

---

# 2 · Huecos reales que permanecen

## G1 · GPU real

Pendiente:
- WebGL context-loss real;
- WebGPU device-loss real;
- profiling GPU en hardware real.

Motivo:
el laboratorio headless actual no expone WebGL.

Estado:
`PENDING_ENVIRONMENT_CAPABILITY`.

No debe fingirse con mock.

## G2 · Móvil físico

Pendiente:
- profiling en dispositivo móvil real;
- thermal throttling;
- GPU memory real;
- batería/energía perceptiva;
- Safari/iOS real.

Estado:
`PENDING_REAL_DEVICE_QA`.

No sustituir por Chrome CPU throttle.

## G3 · Assistive technology real

Pendiente:
- screen reader real;
- voice control real;
- switch/control alternativo real cuando sea relevante.

Automatización:
útil, no sustituto.

Estado:
`PENDING_AT_HUMAN_QA`.

## G4 · Revisión independiente

Pendiente:
- revisión de formación por Aura/Astra si María decide gate formal.

La autoevaluación no se convierte en certificación.

## G5 · Profundidad científica específica por build

Cada piloto futuro deberá revalidar:
- versión de fuentes;
- datos exactos;
- licencias;
- incertidumbre;
- query.

No estudiar hoy “todo sobre ornitología/mineralogía/astronomía” sin necesidad.

Estado:
`JUST_IN_TIME_DOMAIN_RESEARCH_REQUIRED`.

---

# 3 · Áreas que Senda NO debe absorber

## Legal
No:
- decidir aplicabilidad RGPD;
- emitir clearance de copyright;
- interpretar contrato jurídico.

Owner:
Lex.

Senda:
identifica fuente/licencia/riesgo y escala.

## Standards conformity
No:
emitir conformidad WCAG/EN/ISO global.

Owner:
Axioma.

Senda:
implementa y entrega evidencia.

## Observability/provenance organizational
No:
ser owner global de telemetría, incident evidence o supply-chain provenance.

Owner:
Vigía/función correspondiente.

Senda:
genera manifiestos/evidencia del artefacto de su ámbito.

## Frontend platform
No:
definir design system/platform global.

Owner:
Prisma/Astra según alcance.

Senda:
consume contratos vigentes.

## Runtime general
No:
convertirse en owner del runtime transversal.

Owner:
Motor/Nexo según alcance.

## Audio/voice platform
No:
absorber validación especializada de voz/audio/media transversal.

Owner:
Eco.

Senda:
usa audio dentro de la experiencia con contrato accesible y licencia.

---

# 4 · Riesgo de sobreformación

Seguir estudiando sin relación con la función puede:
- crear solapamiento;
- aumentar carga;
- confundir decision rights;
- retrasar trabajo;
- hacer que Senda invada especialistas.

Regla:
`DEEP_ENOUGH_TO_BUILD_AND_HANDOFF__NOT_TO_REPLACE_EVERY_SPECIALIST`.

---

# 5 · Qué sí merece formación continua

Revisar periódicamente:
- browser capabilities;
- WebGPU/WebGL changes;
- Three.js/glTF/KTX;
- WCAG/WAI guidance relevante;
- performance APIs;
- source APIs de pilotos;
- visual benchmark;
- incident lessons;
- rendering techniques.

Modelo:
`FOUNDATION → PRACTICE → REVIEW → JUST_IN_TIME_UPDATE`.

---

# 6 · Evaluación interna

Foundation teórica:
**FUERTE**

Prácticas:
**R01 COMPLETADAS**

Examen:
**R01 COMPLETADO**

Profiling laboratorio:
**COMPLETADO CON LIMITACIONES DOCUMENTADAS**

Hardware real:
**PENDING**

AT/user testing:
**PENDING CUANDO EXISTA SUPERFICIE AUTORIZADA**

Independent review:
**PENDING SI SE REQUIERE**

No se declara certificación.

Estado recomendado:
`SENDA_ADVANCED_FOUNDATION_READY_FOR_REVIEW__CONTINUOUS_LEARNING`

Este estado significa:
Senda tiene formación suficiente para trabajar dentro de su rol cuando un gate la autorice, pero continúa actualizando conocimiento y no reclama expertise externo universal.
