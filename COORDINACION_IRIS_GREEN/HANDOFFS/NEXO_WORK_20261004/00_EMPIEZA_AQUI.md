# NEXO · WORK HANDOFF · 00 EMPIEZA AQUÍ

Fecha: 04/10/2026
Rama de transferencia:
`nexo/work-handoff-20261004`

Base al crear la rama:
`main@c20fcc73d61c6a965c1bfb28eea7139ec3284d1c`

## IMPORTANTE

Motor estaba moviendo main durante esta transferencia.

Antes de cualquier escritura en Work:
`FETCH LIVE MAIN → DRIFT CHECK`

GitHub es la fuente canónica.
No reconstruir desde el chat anterior.

---

# 1 · IDENTIDAD NEXO

Puesto:
**Technical Resilience & Systems Reliability Lead**

Issue:
#350

Equipo:
- Pulso A3;
- Vigía A4;
- Eco A6;
- Córtex A10.

Principios:
`COMPONENT_PASS != SYSTEM_PASS`
`TECHNICAL_PASS != PRODUCT_PASS`

Leer:
`COORDINACION_IRIS_GREEN/FORMACION/NEXO/`

---

# 2 · FORMACIÓN

Leer en este orden:

1. `00_IDENTIDAD_Y_PUESTO.md`
2. `01_PLAN_FORMACION.md`
3. `02_PRACTICAS_Y_EXAMEN.md`
4. `03_RUNBOOK_CONTINUIDAD.md`
5. `04_ESTUDIO_AVANZADO_R01.md`
6. `05_BITACORA_2026-09-30.md`
7. `06_ESTUDIO_EXTENDIDO_R02_20261004.md`
8. `APRENDIZAJE_NEXO_2026-09-30.md`
9. `APRENDIZAJE_NEXO_2026-10-04.md`

---

# 3 · SABIK

Motor está con Sabik Web sobre main.

Regla:
`DO_NOT_INTERRUPT_MOTOR`

Estado histórico útil:
- R66 real E2E voz ES/EN llegó a PASS técnico;
- voces HUMAN QA:
  - ES → SABIK_ES_MASTER_V1 / Qwen Base ICL;
  - EN → SABIK_EN_MASTER_V2 seed 9112 / Qwen Base ICL;
- STT Parakeet;
- no SpeechSynthesis;
- sesión de voz continua tras activación explícita.

Pero Sabik sigue evolucionando.
Leer #354 + main vivo + estado actual de Nube/Córtex.

---

# 4 · NUEVA ARQUITECTURA WEB

Canon:
`MEMORIA/NEW_WEB_INFORMATION_ARCHITECTURE_R01_20261004.md`
`CONTROL/NEW_WEB_INFORMATION_ARCHITECTURE_R01_20261004.json`

Objetivo:
`Inicio · Información · Recursos · Juegos · Descubrimiento · Creación · Espacio tranquilo`

Sabik = persistente, no categoría.

FREE ALWAYS:
- Información;
- Recursos;
- Espacio tranquilo.

FREE + PLUS:
- Juegos;
- Descubrimiento;
- Creación.

Subarquitectura:
`AREA LANDING → PARA TODOS | PLUS`

Legacy:
`PRESERVE_FOR_ROLLBACK`

Estado:
`PARALLEL_REBUILD_NO_CUTOVER`

---

# 5 · JUEGOS NUEVOS

Regla:
`ONE GAME → USE → HUMAN QA → FIX/FREEZE → NEXT`

## Mapa del tesoro

`MAPA_TESORO_PRODUCT_CONCEPT_FAIL_DISCARDED`

HUMAN QA María:
no genera suficiente ganas de jugar; se reduce a pulsar habitación y recibir descarte/confirmación.

No rework.
Solo evidencia histórica.

## Habitación imposible

Core idea:
`KEEP`

Runtime R06.1:
`DISCARD_CURRENT_RUNTIME_UI`

Por qué:
- wireframe degradó la dirección R62 bonita;
- interfaz no intuitiva;
- panel de controles domina la escena;
- “anterior/siguiente + flechas” contradice direct manipulation;
- modelo gravedad/orientación híbrido necesitaba estudio.

Docs:
`MEMORIA/HABITACION_IMPOSIBLE_PRODUCT_MECHANIC_STUDY_R01_20261004.md`
`CONTROL/HABITACION_IMPOSIBLE_PRODUCT_MECHANIC_STUDY_R01_20261004.json`

Nueva progresión:
- Sala 1 = orientación, 2 opciones;
- Sala 2 = mover una pieza;
- Sala 3 = combinar;
- Sala 4 = abierta.

Sala 1:
`MEMORIA/HABITACION_ROOM1_FUNCTIONAL_STORYBOARD_R01_20261004.md`
`CONTROL/HABITACION_ROOM1_FUNCTIONAL_STORYBOARD_R01_20261004.json`

Prisma tiene orden:
4 frames × 390/1440.

Gate:
`ROOM1_STORYBOARD_HUMAN_QA_PASS`

NO CODE.
NO SALA 2.
NO CLAUDE.

---

# 6 · TALLER / CREACIÓN · RITMO

R06.1 técnico cerró:
- state machine;
- Stop;
- compare/listen;
- loop;
- ES/EN a11y;
- responsive.

Pero Taller se transforma en **Creación**.

No escalar Ritmo sin:
- nueva página Creación;
- HUMAN QA real;
- encaje Para todos/Plus.

Technical pass no equivale a producto final.

---

# 7 · DESCUBRIMIENTO · CONTRATO GENERAL

`SEMANTIC USER ACTION → OBSERVABLE CONSEQUENCE → INFERENCE/IDENTIFICATION → FACTUAL REVEAL → DEPTH`

Regla:
`NO_REVEAL_BEFORE_SEMANTIC_USER_ACTION`

No:
`ASSET → CARD → TEXT`

NORMAL/REDUCED/NONE preservan causalidad.
Touch/keyboard equivalentes.

---

# 8 · CIELO NOCTURNO

Corrección María:
**no existe prototipo de producto que conservar.**

Producto nuevo desde cero.

Conservar:
- 5.070 estrellas;
- 88/88 constelaciones R03;
- horizonte;
- masters;
- guías/atlas;
- provenance.

No reutilizar runtime/layout viejo como autoridad.

Docs:
`MEMORIA/NIGHT_SKY_DISCOVERY_PRODUCT_STUDY_R01_20261004.md`
`CONTROL/NIGHT_SKY_DISCOVERY_PRODUCT_STUDY_R01_20261004.json`

Primer target:
`ORION`

Modelo:
`CURATED_OBSERVATION_PRESET`

Prompt antes de reveal:
**Busca tres estrellas brillantes casi en línea.**

Bucle:
`ENTRY → ORIENT → OBSERVE PATTERN → LOCATE → IDENTIFY → REVEAL → DEPTH`

Storyboard:
`MEMORIA/NIGHT_SKY_ORION_STORYBOARD_R01_20261004.md`
`CONTROL/NIGHT_SKY_ORION_STORYBOARD_R01_20261004.json`

Prisma:
6 frames × 390/1440.

Gate:
`NIGHT_SKY_ORION_STORYBOARD_HUMAN_QA_PASS`

NO CODE.
NO SECOND CONSTELLATION.

---

# 9 · VIDA MARINA / PECES

El prototipo técnico previo NO debe convertirse automáticamente en patrón final.

Separación anterior:
- Arrecife;
- Bajar al fondo.

Estado técnico anterior útil:
- autoplay eliminado;
- 5 zonas;
- Praya factual HOLD;
- nonlinear scale declarada;
- assets arrecife/profundidad pendientes.

Pero ahora debe reauditarse bajo el contrato nuevo:

`ACTION → OBSERVABLE CONSEQUENCE → REVEAL`

Pregunta central:
¿la persona descubre vida marina actuando/observando el fenómeno, o entra a un catálogo?

No escalar antes de resolver esto.

---

# 10 · RINCÓN / ESPACIO TRANQUILO

Clasificación:
`RELAXING_AUDIOVISUAL_ZONE`

No juego.
No Descubrimiento.

Pecera = prototipo representativo.

## Visual actual

R02:
`KEEP`
preferencia BLUE.

No R03 visual por iniciativa propia.

## Sonido producto

Tras gesto de usuario:
`SOUND_ON_AFTER_USER_ACTIVATION`

Control:
`Quitar sonido / Poner sonido`

No detener/reiniciar vídeo al mutear.

## Evolución audio

Claude Audio R2:
`HUMAN_QA_FAIL`
sonido hueco/submarino y peor mezcla.

OAI R01:
`HUMAN_QA_FAIL_STRESSFUL_STEREO_BACKGROUND`

OAI R02:
`HUMAN_QA_PASS_TO_FULL_RENDER`

Vídeo 40 s:
`PECERA_R02_CLIP_40s_AUDIO_OAI_R02_BUBBLE_DOMINANT.mp4`
SHA:
`5b9ea28406ae024ca6ba0c68cff26d0052325d261988c86063d794da5bd9478f`

Audio:
`PECERA_AUDIO_OAI_R02_BUBBLE_DOMINANT.m4a`
SHA:
`a576f9f4e9c2b2ed42faa80099bd2d8763964b3bfbb7135863d1f2fb3989eb2f`

Dirección aprobada:
- audio original;
- eliminar masa hueca;
- sin cama estéreo continua;
- imagen estéreo estrecha;
- burbujas protagonistas;
- sin LFO/oleaje;
- sin nueva bomba sintética.

## SIGUIENTE ENTREGABLE PECERA

Crear:
`PECERA R02 FULL ~5 MIN`

NO loop del clip 40 s.

Visual:
- R02 blue;
- ~300 s;
- misma cámara/composición;
- no R03.

Audio:
- receta OAI R02 completa ~300 s;
- no loop corto.

Mux:
- H.264 + AAC;
- A/V sync;
- faststart;
- hashes/provenance;
- no recodificar vídeo si no hace falta.

Gate:
`RINCON_PECERA_R02_FULL_5MIN_AV_READY_FOR_MEDIA_QA`

Después:
`ECO_FINAL_MEDIA_QA`

Integración web/common player:
ESPERA liberación de Motor.

## NO CONFUNDIR

Existe un A1 antiguo de 5 min con PASS técnico Lumen/Eco.
NO es la nueva pieza final autorizada.

La dirección actual es:
**R02 visual + OAI R02 audio**.

## Música

Claude Music 01:
FAIL · no melodía perceptible.

Claude Music 02:
melodía perceptible, dirección Rincón FAIL.

Estado:
`STOP_CLAUDE_COMPOSITION`
`HANDOFF_TO_MUSIC_EXPERT`

No Music 03 Claude.

---

# 11 · PAYMENTS

Issue #387.

Arquitectura:
`Stripe Checkout + Billing + Customer Portal + signed webhooks + Netlify Functions`

No claves secretas en GitHub/Slack/chat.

Premium parcial solo:
- Games;
- Discovery;
- Creation.

No live antes de:
`PAYMENTS_TEST_MODE_E2E_PASS`
+
autorización María.

---

# 12 · RAMAS / MAIN

Base de este handoff:
`main@c20fcc73d61c6a965c1bfb28eea7139ec3284d1c`

NO asumir que sigue siendo HEAD.

Motor está moviendo main.

Handoff branch:
`nexo/work-handoff-20261004`

Games branch:
`nexo/new-games-area-r01-20261004`
es histórico/experimental y no autoridad final.

PR #392 quedó cerrado.

---

# 13 · ORDEN DE REANUDACIÓN EN WORK

1. Leer este archivo.
2. Leer formación R02.
3. Leer controles vivos.
4. Fetch main vivo.
5. Identificar carril que María quiere continuar.
6. WIP=1.
7. No ejecutar automáticamente todos los pendientes.
8. Registrar cada decisión material en GitHub.

---

# 14 · PRÓXIMOS GATES DISPONIBLES

Cuando Prisma entregue Habitación:
→ HUMAN QA María Sala 1.

Cuando Prisma entregue Cielo:
→ HUMAN QA María 6 frames.

Cuando se retome Rincón:
→ Pecera R02/OAI R02 full 5 min → Eco.

Cuando Motor quede libre:
→ decidir common player/integración.

Cuando se retome Vida marina:
→ estudio producto desde cero bajo contrato Descubrimiento antes de código/escala.
