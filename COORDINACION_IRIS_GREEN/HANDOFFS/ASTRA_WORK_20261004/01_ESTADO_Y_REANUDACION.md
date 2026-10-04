# ASTRA → WORK · HANDOFF COMPLETO · 04/10/2026

Estado:
`ASTRA_WORK_HANDOFF_20261004_READY`

Autoridad de producto:
**María**

Objetivo:
reanudar Astra en Work sin reconstruir desde chat.

---

# 0. ORDEN DE ARRANQUE EN WORK

Leer, por este orden:

1. `COORDINACION_IRIS_GREEN/FORMACION/ASTRA/00_IDENTIDAD_Y_PUESTO.md`
2. `COORDINACION_IRIS_GREEN/FORMACION/ASTRA/01_PLAN_FORMACION.md`
3. `COORDINACION_IRIS_GREEN/FORMACION/ASTRA/02_APRENDIZAJE_APLICADO_20261004.md`
4. este handoff;
5. `COORDINACION_IRIS_GREEN/MEMORIA/ASTRA_CONTINUIDAD_20261002.md`;
6. Issue #391;
7. Issue #389;
8. Issue #390;
9. Issue #332;
10. main vivo antes de tocar producto.

No reconstruir desde conversaciones.

---

# 1. REPOS / BASES

## Iris Green web
Repo:
`mruizwow-bit/irisgreen`

Rama canónica:
`main`

HEAD observado al preparar handoff:
`c20fcc73d61c6a965c1bfb28eea7139ec3284d1c`

`main` está protegida.

Producción pública:
permanece bajo política de mantenimiento/cierre; no reabrir por iniciativa de Astra.

Superficie de revisión:
`main-review`.

## Sabik/NEA histórico y patentabilidad
Repo privado:
`mruizwow-bit/NEA`

Astra R02 branch:
`astra/red-team-r02-20261003`

Último handoff Astra R02 conocido:
`PATENTABILITY_AUDIT_PREPUBLIC_R01/10_ASTRA_CORE_R02_CANDIDATE_REGISTER_HANDOFF.md`

## Sabik web histórico / Biblioteca
Repo:
`mruizwow-bit/nea-web-irisgreen`

Nube branch:
`nube/sabik-library-sources-20261004`

Commit verificado:
`873121ad86c416e2f541cefecb04ceca6bf1b3c4`
`Nube: cargar B30 investigación 120 estudios bilingües`.

---

# 2. REGLAS OPERATIVAS QUE NO SE NEGOCIAN

- GitHub = source of truth.
- `main` = base viva para web.
- no reconstruir desde chat;
- no rehacer assets aprobados;
- integrar paquetes aprobados;
- test histórico no manda sobre contrato superseded;
- HUMAN QA María cierra producto;
- Axioma distingue legal/standard/target/good practice;
- Lex decide legal;
- Vigía evidencia/provenance;
- no claims más fuertes que la evidencia.

---

# 3. SABIK HOME · ISSUE #389

Problema HUMAN QA:
Sabik estaba descentrado y los controles eran un caos.

Contrato fijado:
experiencia vertical centrada.

Preservar:
- body canónico;
- canvas 1065×760;
- núcleo/origen;
- orbits/core/particles;
- Core;
- STT/TTS;
- dialogue library.

Primary:
- Enviar;
- Hablar con Sabik.

Contextual:
- Detener;
- Repetir.

Secondary:
- movimiento;
- volumen;
- velocidad;
- reset.

Motor entregó:
`SABIK_HOME_CENTERED_HIERARCHY_R01_READY_FOR_HUMAN_QA`

Implementación referida por Motor:
`a86cb3afcda6e60f0698420b95909cce302ae2dd`

Main avanzó después.

Pendiente según flujo original:
Prisma visual → Axioma → Astra/Nexo → HUMAN QA María.

IMPORTANTE:
antes de cerrar #389 debe reconciliarse con #391 child safety.

---

# 4. CHILD SAFETY · ISSUE #391 · PRIORIDAD P0

Decisión María:
botones de edad obligatorios.
Pero:
`18+ BUTTON != VERIFIED ADULT`.

Normativa:
`COORDINACION_IRIS_GREEN/NORMATIVA/CHILD_SAFETY_AGE_ASSURANCE_R01.md`

Memoria:
`COORDINACION_IRIS_GREEN/MEMORIA/CHILD_SAFETY_MANDATORY_AGE_GATE_R01_20261004.md`

Control:
`COORDINACION_IRIS_GREEN/CONTROL/CHILD_SAFETY_MANDATORY_AGE_GATE_R01_20261004.json`

Regla:
`AGE_SELECTION != ADULT_ACCESS_AUTHORIZATION`

P0:
- AGE_UNSET fresh session;
- mandatory age selection;
- AGE_18_PLUS = claimed only;
- P0 hasAdultAssurance=false;
- 18+ safe-by-default;
- no public S2 full chunks;
- no adult full search catalogue;
- direct full URL 404;
- Sabik text/voice same policy;
- JS/no-JS failure fail closed;
- storage tampering does not grant restricted;
- ALL_AGES routes such as Intereses/Libros remain genuinely available where classified.

Motor latest checkpoint:
HEAD:
`c20fcc73d61c6a965c1bfb28eea7139ec3284d1c`

Motor says implementation P0 is complete, but final CI for that exact HEAD was still queued at last checkpoint.

**Marker NOT YET EMITTED:**
`MOTOR_CHILD_SAFETY_MANDATORY_AGE_GATE_R01_READY_FOR_REVIEW`

Astra Work next action:
1. inspect #391 latest comment/workflows;
2. wait for/verify final marker;
3. adversarially test bypasses;
4. do not accept UI-only protection;
5. verify actual public build has no full restricted payload.

Required gates:
- `AGE_BUTTON_18_PLUS_ALONE_NEVER_UNLOCKS_RESTRICTED_CONTENT`;
- `MANDATORY_AGE_GATE_FAIL_CLOSED_PASS`;
- `SABIK_NO_AGE_GATE_BYPASS_PASS`.

P1 adult assurance:
DO NOT choose provider/mechanism alone.
Needs Lex + Vigía + Axioma first.

---

# 5. SABIK VOICE

Preserve existing approved architecture.

Nexo real-model E2E previously demonstrated:
- Parakeet STT self-hosted;
- Qwen TTS Sabik identities ES/EN;
- no SpeechSynthesis replacement;
- no-store media contract;
- state lifecycle.

Current main-review may not hear voice when private backend/origin is unavailable.

Do NOT interpret backend offline/unconfigured as reason to replace the voice.

Do NOT:
- invent endpoint;
- use generic browser TTS;
- retrain identity;
- publish private voice artifacts.

---

# 6. BIBLIOTECA MAESTRA SABIK · ISSUE #390

Critical correction:
**María already creates the library.**

Latest user-provided live MD:
`SABIK_BIBLIOTECA_MAESTRA_CHECKPOINT_SANEADO (5).md`

Observed size:
~34,762 lines.

State:
EN CONSTRUCCIÓN, incremental, ES/EN.

Key canonical rules in live MD:
- one master checkpoint;
- no reconstruction from memory;
- 372/372 main web catalogue completed;
- no discriminating-question architecture;
- `RESPONDER_PRIMERO · ACLARAR_SOLO_SI_ES_IMPRESCINDIBLE · NUNCA_PERFILAR_MEDIANTE_PREGUNTAS`;
- Sabik = general-purpose/extensible/multimodal;
- Iris Green = specialised source, not boundary;
- static knowledge vs live/dynamic routing separated.

Governance #390:
- María = editorial owner;
- Nube = technical ingestion/maintenance;
- Axioma = ethics/standards gate;
- Vigía = provenance/evidence;
- Lex = legal by exception;
- Córtex = consumer/evals;
- Nexo = E2E.

Do not create a second library.

Note:
this belongs to the **Sabik assistant project**, not “Iris Green web” as a content dump.

Nube source branch verified:
`nube/sabik-library-sources-20261004@873121ad...`
B30.

---

# 7. DISCOVERY CONTRACT

Canonical:
`ENTRY → SEMANTIC ACTION → OBSERVABLE SIGNAL → INFERENCE/IDENTIFICATION → REVEAL → DEPTH`

Rule:
`NO_REVEAL_BEFORE_SEMANTIC_USER_ACTION`

Semantic ≠ drag.

Preserve keyboard/touch/NORMAL/REDUCED/NONE causal equivalence.

Specific patterns:
- Cielo: orient → observe pattern → locate → identify → reveal;
- Exoplanets: signal → evidence/pattern → inference → planet/system;
- Eclipses: time/geometry → observable phase → reveal;
- Meteors: tracks → convergence → radiant;
- Meteorites: features → classification → context.

---

# 8. CIELO NOCTURNO · CURRENT NEXO LANE

Correction:
Cielo has assets/data, but no product prototype that must be preserved.

State:
`PRODUCT_NEW_FROM_ZERO`
`NO_LEGACY_RUNTIME_REUSE`

Reusable:
- star data;
- 88/88 constellation masters;
- line geometry;
- horizon asset;
- manifests/provenance.

Chosen first model:
`CURATED_OBSERVATION_PRESET`

First target:
`ORION`

Storyboard:
6 frames:
1. entry;
2. orient;
3. belt visible;
4. pattern located;
5. Orion revealed;
6. depth.

Before user locates pattern:
no “Orión”, no full lines, no artistic master, no answer arrow.

Runtime blocked:
`NIGHT_SKY_ORION_STORYBOARD_HUMAN_QA_PASS`

Recent canonical commits:
- `172254518a29fdacac75c3bc2af0f28722aed44b` product study;
- `082fb03b1a0a1550663900ab5a7027cb722bcb97` no-runtime control;
- `ef6e37abf74bc6b2fdee9634fa0b50fea0e6f44d` Orion storyboard;
- `e548c1867465bb3d3868a7921951d3f63618d8a3` runtime block.

Astra:
do not authorize code before storyboard HUMAN QA.

---

# 9. PROTOTYPE-FIRST LESSONS

Current project learning:
- Mapa del tesoro: technical base passed; concept discarded by María.
- Habitación imposible: solver/mechanic technically reproducible; UI/product failed HUMAN QA.
- New rule:
  `SCENE_FIRST`
  `DIRECT_MANIPULATION_FIRST`
  `CONTROLS_SECONDARY`
  `ONE_MECHANIC_AT_A_TIME_IN_EARLY_ROOMS`.

General:
`STUDY → STORYBOARD → HUMAN QA → CODE`

Do not scale before first real use.

---

# 10. PATENTABILITY R02 · PRIVATE NEA

Private/prepublication.

Astra docs live on:
`astra/red-team-r02-20261003`.

Core state:
`PAT-NEA-CORE-001 = TECHNICAL_EFFECT_REVIEW_REQUIRED`

Not:
- PATENT_CANDIDATE;
- STRONG_PATENT_CANDIDATE.

Strongest narrow technical interest:
`USER_HARD_LIMIT → USER_INTENSITY → STATE_SPECIFIC_RUNTIME_PARAMETERS`

Later memory:
`CONFIRMED_USER_MEMORY > INFERRED_MEMORY`

Open adversarial question:
does sensory precedence + memory precedence in same conversational loop produce non-obvious technical interaction?

Important negatives:
- full original wiring of some state/intensity composition weakened by Motor evidence;
- memory authority partly later lineage;
- memory→runtime indirect via later model turn;
- durable no-reinference veto not proven;
- per-turn sensitive egress gate before external LLM not proven;
- hard low-demand language post-validation not proven;
- private neural voice later lineage.

Voice:
`IDENTITY_BOUND_FAIL_CLOSED_LOCAL_VOICE_CHANNEL = TECHNICAL_EFFECT_REVIEW_REQUIRED`
narrow only.

Privacy:
`CONSENT_TO_PERSIST != CONSENT_TO_TRANSMIT`.

Main NEA currently contains:
`R02_NEXO_FINAL_ADVERSARIAL_RECONCILIATION.md`

It explicitly says:
**Formal Astra re-pass: NOT YET RECEIVED.**

Therefore Astra Work owes:
**formal final re-pass against final Nube/Motor/Pulso/Vigía matrix**.

Do not attribute Nexo final conclusion to Astra until that is done.

Lex owns legal outcome.

---

# 11. PECES · LIBRARY ASSET STATE

Persistent Library folder:
`/Iris Green/Interés 22 · Vida marina y peces/`

Existing bank previously stored:
9 ZIP groups + INDICE.csv + LEEME_3.md plus later blocks.

## Bloque 15
Old:
`BLOQUE_15_FINAL_10_PNG_1400_TRANSPARENTES(1).zip`
was removed/replaced.

Current active:
`BLOQUE_15_RASTER_10_PNG_1400_TRANSPARENTES(1).zip`

## Bloque 16
A replacement ZIP was uploaded, then María explicitly said:
**NO LO HAGAS, ESTÁ MAL.**

Therefore:
existing previous Bloque 16 remains active.

Later María supplied 10 new individual fish images.
Treat them as **candidate material**, not a confirmed replacement until explicitly confirmed/packaged.

## Bloque 10
María explicitly requested:
“sustituye el bloque 10 de peces por estos”
with 10 individual images.

That replacement was NOT completed before the session shifted.

Work task if María resumes this lane:
- identify current Bloque 10 package;
- preserve metadata/order/species mapping;
- package the exact 10 approved images;
- technical normalize only if requested/required;
- replace current block atomically;
- no duplicate active Block 10.

Do not infer fish identities/order from appearance if the source mapping is not available.

---

# 12. CURRENT DO-NOT-DO LIST

- do not reopen public production;
- do not replace Sabik voice;
- do not redesign Sabik identity;
- do not make 18+ self-declaration unlock restricted content;
- do not publish full restricted chunks;
- do not create second Sabik library;
- do not code Cielo before storyboard HUMAN QA;
- do not rebuild 88 constellation masters;
- do not treat automated accessibility tests as conformity;
- do not promote patent candidate from architecture alone;
- do not convert evidence gap into product failure;
- do not overwrite old/historical evidence without supersession record.

---

# 13. IMMEDIATE PRIORITY WHEN WORK STARTS

1. Read GitHub + this handoff.
2. Refresh `main` HEAD.
3. Inspect #391 latest CI/marker.
4. If Motor emits marker:
   perform Astra child-safety red-team first.
5. Reconcile #389 Sabik visual hierarchy with #391 safety state.
6. Check Axioma/Vigía/Lex outputs if available.
7. Prepare HUMAN QA only after gates.
8. Separately, when requested:
   formal Astra patentability R02 final re-pass.
9. Library/fish lanes only on María instruction; do not mix into Sabik runtime.

---

# 14. HANDOFF MARKER

`ASTRA_WORK_MODE_RESUME_FROM_GITHUB_NOT_CHAT`

`ASTRA_TRAINING_EXPANDED_WITH_20261004_LEARNINGS`

`ASTRA_WORK_HANDOFF_20261004_READY`
