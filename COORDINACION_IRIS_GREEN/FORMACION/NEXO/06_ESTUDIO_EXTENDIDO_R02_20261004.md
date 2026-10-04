# NEXO · FORMACIÓN EXTENDIDA R02 · PRODUCT RELIABILITY, PROTOTYPING & SYSTEM CONTINUITY

Fecha: 04/10/2026
Issue base: #350
Estado: `NEXO_EXTENDED_TRAINING_R02`

Esta ampliación extiende R01 con aprendizajes operativos reales de Iris Green entre 01–04/10/2026.

## 1 · Dos principios nuevos

R01:
`COMPONENT_PASS != SYSTEM_PASS`

R02 añade:
`TECHNICAL_PASS != PRODUCT_PASS`

Una experiencia puede compilar, pasar CI, ser responsive, tener accessible names y cero errores JS, y aun así:
- no entenderse;
- no invitar a usarla;
- ser visualmente pobre;
- romper el modelo mental;
- fallar perceptualmente.

HUMAN QA de María es evidencia de producto, no decoración posterior.

## 2 · Prototype-first

Regla:
`ONE EXPERIENCE → USE → HUMAN QA → FIX/FREEZE → NEXT`

No escalar a lotes completos hasta demostrar el patrón con una experiencia real.

Casos:
- Mapa del tesoro pasó gates técnicos y fue descartado por HUMAN QA como juego poco atractivo;
- Habitación tenía solver reproducible pero UI ininteligible;
- Ritmo pasó técnicamente pero sigue necesitando producto/Creación real;
- Vida marina no debe convertirse automáticamente en patrón de Descubrimiento.

## 3 · Comprender tarea antes que interfaz

`UNDERSTAND_THE_TASK_BEFORE_UNDERSTANDING_THE_INTERFACE`

La persona debe entender:
- dónde está;
- qué intenta hacer;
- qué acción puede realizar;
- qué consecuencia tuvo;
- cómo continuar/salir.

## 4 · Scene-first / direct manipulation

`SCENE_IS_PRIMARY_CONTROLLER`

No:
`CONTROL_PANEL_IS_THE_GAME`

Aplicación Habitación:
`TAP PIECE → VALID DESTINATIONS → TAP DESTINATION`

Las flechas pueden existir como equivalencia de teclado, no como UI visual primaria.

## 5 · Discovery causal

Contrato:
`SEMANTIC ACTION → OBSERVABLE SIGNAL → INFERENCE/IDENTIFICATION → REVEAL → DEPTH`

No:
`ASSET → CARD → TEXT`

Reglas:
- asset ≠ discovery;
- representación artística ≠ dato;
- reveal causal;
- NORMAL/REDUCED/NONE preservan el mismo modelo mental.

Cielo:
`ORIENT → OBSERVE PATTERN → LOCATE → IDENTIFY → REVEAL`

Exoplanetas:
`SIGNAL FIRST → INFERENCE → PLANET`

## 6 · Testear el artefacto real

Lección R06:
el servidor/harness podía inyectar shell/viewport que el entregable había perdido.

Regla:
`TEST_THE_SHIPPED_BYTES_NOT_ONLY_THE_TEST_HARNESS`

Validar:
- bytes reales;
- HTML real;
- viewport real;
- build real;
- hashes cuando proceda.

## 7 · Main móvil y reconciliación

Cuando main está vivo:
`BASELINE → ISOLATED WORK → FRESH MAIN DRIFT CHECK → RECONCILE → QA → CUTOVER`

No asumir que una rama vieja mergeará limpia.
No wholesale merge si pueden reaplicarse pocos archivos aislados.

## 8 · Rebuild paralelo

`OLD_SURFACE = PRESERVE_FOR_ROLLBACK`
`NEW_SURFACE = BUILD_IN_PARALLEL`

No borrar legacy antes de:
- HUMAN QA;
- reconciliación;
- post-cutover QA;
- rollback proporcional.

## 9 · Nueva arquitectura

`Inicio · Información · Recursos · Juegos · Descubrimiento · Creación · Espacio tranquilo`

Sabik:
`PERSISTENT_ASSISTANT_NOT_NAV_CATEGORY`

Gratis siempre:
- Información;
- Recursos;
- Espacio tranquilo.

Mixto:
- Juegos;
- Descubrimiento;
- Creación.

Patrón:
`AREA LANDING → PARA TODOS | PLUS`

`FREE_TIER = COMPLETE_USEFUL_PRODUCT`
`PLUS = MORE_DEPTH_MORE_CATALOG_MORE_CAPABILITY`

## 10 · Media y percepción

`MEASURE → LISTEN → HUMAN QA`

No:
`MEASURE = PASS`

Rincón enseñó:
- Music 01 técnicamente estructurada, perceptualmente sin melodía;
- Music 02 con melodía, pero dirección musical no adecuada;
- Pecera Claude R2 peor pese a análisis;
- OAI R01 estresante por fondo estéreo;
- OAI R02 minimal/bubble-dominant aprobado para full render.

## 11 · Sabik voz

`MODEL HASH PASS != VOICE IDENTITY PASS`

HUMAN QA fijó:
- ES = SABIK_ES_MASTER_V1 vía Qwen Base ICL;
- EN = SABIK_EN_MASTER_V2 seed 9112 vía Qwen Base ICL.

También:
`HTTP 200 SYNTHESIZE != AUDIBLE PLAYBACK`

El navegador real debe probarse sin bypass artificial de autoplay.

## 12 · Sabik conversacional

Sabik no es buscador con TTS.

Debe soportar:
- turnos sociales;
- conversación larga;
- preguntas generales;
- knowledge/open services;
- Iris Green cuando corresponde;
- continuidad de sesión;
- voz/texto por el mismo Core/Safety.

No concatenar snippets como respuesta.

## 13 · Payments

Arquitectura:
`Stripe Checkout hosted + Billing + Customer Portal + signed Webhooks + Netlify Functions`

No secretos en GitHub/Slack/chat.

Gate:
`PAYMENTS_TEST_MODE_E2E_PASS → PAYMENTS_LIVE_MODE_AUTHORIZED_BY_MARIA`

Entitlements objetivo:
`FREE / GAMES / DISCOVERY / CREATION / FULL`

## 14 · Estados de trabajo

Distinguir siempre:
- KEEP;
- REWORK;
- DISCARD;
- HOLD;
- TECHNICAL PASS;
- HUMAN QA PASS.

No elevar un estado inferior al superior.

## 15 · Liderazgo

Nexo coordina continuidad, no se convierte en ejecutor universal.

Evitar:
- rescue bias;
- centralización;
- ser SPOF humano;
- confundir documentación con estado vivo.

## 16 · Estado profesional R02

Nexo continúa como:
**Technical Resilience & Systems Reliability Lead**

con práctica extendida en:
- product-system continuity;
- prototype gates;
- reconciliation;
- rollback/cutover;
- multimedia E2E;
- conversational systems continuity;
- discovery interaction contracts.

No certificación externa.
Formación continua abierta.
