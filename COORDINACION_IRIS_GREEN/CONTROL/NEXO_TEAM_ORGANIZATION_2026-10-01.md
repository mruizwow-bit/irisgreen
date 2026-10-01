# NEXO · ORGANIZACIÓN DEL EQUIPO · 2026-10-01

Issue: #353  
Rama: `nexo/equipo-continuidad-audit-r01-20261001`  
Estado: `NEXO_TEAM_ORGANIZED_READ_ONLY_AUDIT_R01`

## 1 · Objetivo

Organizar a Pulso, Vigía, Eco y Córtex como un único equipo de **Continuidad Técnica & Sistemas**, con especialidades separadas y una capa común de fiabilidad de extremo a extremo.

Dirección de María para la jornada:
- analizar la web real;
- detectar problemas;
- estudiar avances tecnológicos actuales relevantes;
- proponer mejoras;
- favorecer experiencias visuales, intuitivas e innovadoras;
- revisar Sabik y el problema perceptivo/funcional de Sabik Motion;
- mantener rigor, accesibilidad, privacidad y calidad.

Regla vigente:
**READ-ONLY / RESEARCH / ANALYSIS. NO PRODUCT CHANGES TODAVÍA.**

---

## 2 · Estado del equipo

### Pulso · A3
Estado:
foundation profesional preservada.

Fuente:
- rama `pulso/a3-conversational-systems-runtime-foundation-r01-20260930`;
- aprendizaje `COORDINACION_IRIS_GREEN/FORMACION/A3_PULSO/APRENDIZAJE_PULSO_2026-09-30.md`.

Especialidad:
**Conversational Systems Integration & Runtime Engineer**.

### Vigía · A4
Estado:
foundation profesional preservada.

Fuente:
- rama `formacion/a4-vigia-r01-20260930`;
- aprendizaje `COORDINACION_IRIS_GREEN/FORMACION/A4_VIGIA/APRENDIZAJE_VIGIA_2026-09-30.md`.

Especialidad:
**Observability & Reliability Engineer**, con foco en Privacy Engineering, Incident Evidence y Digital Provenance.

### Eco · A6
Estado:
formación avanzada R03 y continuidad preservadas.

Fuente:
- rama `eco/a6-advanced-r03-dsp-realtime-20261001`;
- aprendizaje `COORDINACION_IRIS_GREEN/FORMACION/A6_ECO/APRENDIZAJE_ECO_2026-10-01_R03.md`;
- cierre `COORDINACION_IRIS_GREEN/FORMACION/A6_ECO/11_CIERRE_CONTINUIDAD_20261001.md`.

Especialidad:
**Voice, Audio & Media Quality / Validation Engineering**.

Pendientes honestos ya declarados por Eco:
- hardware real;
- iOS/Android;
- Bluetooth;
- WebRTC degradado/TURN;
- STT/TTS Sabik real.

### Córtex · A10
Estado:
rol, plan y prácticas publicados; cierre final de aprendizaje/continuidad todavía no verificado por Aura.

Fuente actual:
- Issue #347;
- `COORDINACION_IRIS_GREEN/FORMACION/A10_CORTEX/`.

Especialidad:
**LLM / Generative AI Systems Engineer**.

Gate:
antes de asumir un nuevo carril operativo debe preservar:
- `APRENDIZAJE_CORTEX...`;
- cierre/continuidad;
- rama/HEAD verificables.

Esto no cuestiona su especialidad; evita perder su formación al cambiar de chat.

---

## 3 · Reparto de trabajo de hoy

### PULSO · Carril A · Runtime conversacional

Pregunta central:

**¿Puede Sabik mantener una conversación estable, recuperable y accesible cuando sesiones, streaming, tools, voz o provider se degradan?**

Revisar:
- lifecycle de sesión/turno;
- estados y transiciones;
- streaming;
- cancel/reconnect;
- concurrencia;
- idempotencia;
- contratos de eventos;
- tool lifecycle;
- integración frontend ↔ runtime ↔ provider/model ↔ voz;
- fallbacks;
- errores parciales;
- pérdida de estado;
- accesibilidad del runtime;
- dependencia con Sabik Motion solo donde Motion dependa del estado conversacional.

Salida:
`RUNTIME_GAP · CONTRACT_RISK · STATE_LIFECYCLE · RESILIENCE · INTEGRATION_DEPENDENCY · PROPOSAL`

Frontera:
no elige modelo/provider ni arquitectura RAG.

---

### VIGÍA · Carril B · Observabilidad, privacidad y evidencia

Pregunta central:

**Si Sabik o una parte crítica de la web falla, ¿podemos demostrar qué pasó sin invadir la privacidad del usuario?**

Revisar:
- traces;
- metrics;
- logs;
- events;
- correlation IDs;
- diagnósticos end-to-end;
- evidencia de fallos actuales;
- reconstrucción de incidentes;
- PII/secrets;
- minimización;
- retención técnica necesaria;
- provenance;
- evidencias de PASS/FAIL;
- observabilidad de Motion, voz y tool calls;
- alertabilidad y runbooks.

Salida:
`EVIDENCE_GAP · OBSERVABILITY_GAP · PRIVACY_RISK · INCIDENTABILITY · PROVENANCE · PROPOSAL`

Frontera:
Lex decide obligaciones jurídicas; Vigía aporta evidencia/ingeniería.

---

### ECO · Carril C · Voz, audio y media

Pregunta central:

**¿La capa de voz/media puede servir a personas con perfiles comunicativos y sensoriales distintos de forma estable y comprensible?**

Revisar:
- voz actual/futura de Sabik;
- STT/TTS;
- latencia;
- endpointing;
- barge-in;
- jitter;
- WebRTC;
- codecs/containers;
- media playback;
- rutas de entrada/salida;
- calidad perceptual;
- baja estimulación;
- audio cues;
- acceso no verbal apoyado por componentes visuales/media;
- mobile/browser;
- fallback texto/visual;
- integración Pulso ↔ Eco ↔ Córtex.

Salida:
`MEDIA_GAP · VOICE_RISK · REALTIME_RISK · ACCESSIBILITY · PERCEPTUAL_QUALITY · PROPOSAL · HARDWARE_PENDING`

Frontera:
no afirmar hardware PASS sin prueba real.

---

### CÓRTEX · Carril D · IA generativa / provider / context

Gate 0:
cerrar y preservar su formación.

Después:

Pregunta central:

**¿Cómo debe desacoplarse y evaluarse el cerebro de Sabik para mejorar calidad sin hacer que todo el sistema dependa opacamente de un único provider?**

Revisar:
- AS-IS Claude;
- provider abstraction;
- OpenAI vigente como opción futura;
- tools/function calling;
- context;
- RAG consumption desde Nube;
- evals;
- tracing;
- model selection;
- latency/cost;
- safety;
- failure modes;
- rollback;
- migration por fases;
- diseño de API propia de Sabik como capa de producto;
- diferencia entre “API propia” y “modelo propio/self-hosted”.

Salida:
`MODEL_PROVIDER_GAP · CONTEXT_RISK · TOOLING · EVAL_GAP · COST_LATENCY · MIGRATION_RISK · PROPOSAL`

Frontera:
no migración de provider ni producción hoy.

---

## 4 · Interfaces obligatorias

### Pulso ↔ Córtex
Contrato entre:
- runtime;
- provider/model;
- tool requests;
- context;
- cancellation;
- streaming;
- errors/fallbacks.

### Pulso ↔ Eco
Contrato entre:
- estado conversacional;
- micrófono;
- STT;
- turn-taking;
- TTS;
- interruption/barge-in;
- fallback texto.

### Pulso ↔ Vigía
Contrato entre:
- eventos de runtime;
- IDs;
- errores;
- traces;
- privacidad.

### Córtex ↔ Vigía
Contrato entre:
- model/tool traces;
- eval evidence;
- latency/cost;
- sensitive context;
- provider incidents.

### Eco ↔ Vigía
Contrato entre:
- media diagnostics;
- WebRTC;
- device/route failures;
- evidencia sin capturar contenido sensible innecesario.

### Eco ↔ Córtex
Contrato entre:
- STT input;
- generated response;
- TTS output;
- latency budget;
- failure/fallback.

---

## 5 · Handoffs externos

### Astra
- decisiones arquitectónicas;
- gates;
- prioridades técnicas que alteren arquitectura.

### Aura
- dependencias entre equipos;
- WIP global;
- planificación NOW/NEXT/LATER.

### Vector
- integración/release/preview;
- ningún cambio del equipo Nexo se integra directamente.

### Nube
- corpus;
- fuentes;
- retrieval library;
- knowledge provenance.

### Motor
- runtime interactivo/visual cuando el problema sea Motion o interacción no conversacional.

### Prisma
- frontend platform/design-system/runtime de interfaz.

### Lumen
- media inmersiva/perceptiva donde corresponda.

### Axioma
- accesibilidad/standards y controles verificables.

### Lex
- obligaciones jurídicas, privacidad/legal, contratos/proveedores.

---

## 6 · Prioridad operativa

### NOW
1. Pulso: mapa runtime/dependencias/fallos.
2. Vigía: capacidad de evidencia/diagnóstico y riesgos de privacidad.
3. Eco: voz/media y rutas accesibles, con pendientes hardware separados.
4. Córtex: cerrar continuidad; después AS-IS + opciones de arquitectura, sin migrar.

### NEXT
Nexo cruza los cuatro resultados para detectar:
- SPOF;
- interfaces rotas;
- dependencias no observables;
- fallbacks ausentes;
- gaps SLI/SLO;
- cambios con alto blast radius.

### LATER
Solo tras decisión de María/Astra/Aura:
- prototipos;
- cambios de arquitectura;
- provider migration;
- nuevos pipelines;
- instrumentación;
- fixes;
- previews.

---

## 7 · Formato único de entrega

Cada hallazgo:

`HALLAZGO · EVIDENCIA · IMPACTO · PROPUESTA · DEPENDENCIA · PRIORIDAD SUGERIDA`

Reglas:
- separar hecho de hipótesis;
- no inventar severidad;
- no inventar PASS;
- indicar evidencia faltante;
- distinguir quick win de cambio estructural;
- toda propuesta debe decir qué especialista/área necesita.

---

## 8 · WIP

Equipo 4/4.

Regla:
**1 carril activo por especialista.**

No segundo carril hasta cerrar:
- evidencia;
- salida;
- dependencia;
- siguiente owner.

Nexo no reasigna trabajo solo para mantener a todos ocupados.

---

## 9 · Criterio de éxito de la auditoría

La auditoría será útil si permite contestar:

1. ¿qué partes de Sabik/web son frágiles?
2. ¿qué fallos no podemos observar?
3. ¿qué rutas carecen de fallback?
4. ¿qué experiencia no es accesible o comprensible?
5. ¿qué depende demasiado de un proveedor/componente?
6. ¿qué problemas son locales y cuáles sistémicos?
7. ¿qué debemos arreglar antes de innovar?
8. ¿qué innovación puede añadirse sin comprometer fiabilidad?
9. ¿qué requiere HUMAN QA?
10. ¿qué debe quedar en NOW, NEXT y LATER?

## Principio

`COMPONENT_PASS != SYSTEM_PASS`

Nexo evaluará el sistema integrado, no la suma de cuatro informes.
