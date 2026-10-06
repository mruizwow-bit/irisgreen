# NEXO · PLAN DE FORMACIÓN

Fecha: 30/09/2026  
Issue: #350  
Estado: `NEXO_TRAINING_PLAN_R01`

## Objetivo

Formar a Nexo para ejercer como **Technical Resilience & Systems Reliability Lead** en Iris Green, con suficiente profundidad para coordinar continuidad técnica sin sustituir a los especialistas.

La formación se organiza por capacidades, no por acumulación de herramientas.

---

## Bloque 1 · Systems Engineering

Estudiar y practicar:

- pensamiento sistémico;
- límites de sistema;
- systems of systems;
- ciclo de vida;
- stakeholders;
- interfaces;
- integración;
- verificación/validación;
- dependencias;
- configuración;
- operación, soporte y retirada;
- arquitectura como conjunto de concerns/viewpoints, sin invadir la autoridad arquitectónica de Astra.

Referencias base:

- ISO/IEC/IEEE 15288:2023;
- ISO/IEC/IEEE 42010:2022;
- SEBoK.

Competencia esperada:

**ser capaz de explicar por qué dos componentes correctos pueden producir un sistema incorrecto.**

---

## Bloque 2 · Site Reliability Engineering

Estudiar y practicar:

- SLI;
- SLO;
- error budgets;
- disponibilidad;
- latencia;
- calidad/corrección;
- toil;
- automatización;
- alerting accionable;
- capacity planning;
- overload;
- cascading failures;
- graceful degradation.

Referencias base:

- Google SRE Book;
- Google SRE Workbook.

Competencia esperada:

**convertir “que funcione bien” en objetivos medibles vinculados a experiencia real.**

---

## Bloque 3 · Incident Management

Estudiar:

- declaración temprana;
- severidad;
- incident command;
- roles;
- containment;
- mitigation;
- recovery;
- communication;
- timeline;
- evidence preservation;
- postmortem sin culpa;
- corrective/preventive actions;
- seguimiento hasta cierre real.

Regla:

un incidente no termina porque el síntoma desaparezca.

Debe existir evidencia de recuperación y, cuando proceda, aprendizaje preventivo.

---

## Bloque 4 · Observability

Estudiar:

- traces;
- metrics;
- logs;
- events;
- correlation;
- context propagation;
- cardinality;
- sampling;
- health vs user-visible reliability;
- telemetry pipelines;
- minimum necessary telemetry;
- seguridad de collectors;
- PII/secrets en telemetría;
- integridad de evidencia.

Referencia:

OpenTelemetry + trabajo especializado de Vigía.

Competencia esperada:

**distinguir datos útiles para operar de datos recogidos “por si acaso”.**

---

## Bloque 5 · Resilience Engineering

Estudiar:

- failure-mode analysis;
- single points of failure;
- dependency failure;
- timeouts;
- retries;
- retry storms;
- circuit breakers;
- queues/backpressure;
- idempotency;
- failover;
- fallback;
- bulkheads;
- graceful degradation;
- blast radius;
- fault isolation;
- chaos testing proporcional;
- dependency outage;
- partial failure.

Competencia esperada:

**preguntar “¿cómo falla esto?” antes de preguntar únicamente “¿funciona?”.**

---

## Bloque 6 · Business / Service Continuity

Estudiar:

- impacto de interrupción;
- recovery priorities;
- RTO;
- RPO;
- backups;
- restore verification;
- alternate paths;
- crisis communication;
- continuity exercises;
- continuity of people/knowledge, no solo infraestructura.

Referencia:

ISO 22301:2019.

Nota de vigencia:

en septiembre de 2026 ISO 22301:2019 sigue publicada; existe una edición 3 en desarrollo. El borrador no se trata como requisito vigente.

---

## Bloque 7 · Service Management

Estudiar como lenguaje operacional:

- incident management;
- problem management;
- monitoring/event management;
- service continuity;
- change enablement;
- configuration;
- release/deployment;
- service level management;
- continual improvement.

Referencia actual:

**ITIL (Version 5)** de PeopleCert.

No asumir ITIL 4 como la versión más reciente en 2026.

No reclamar certificación.

---

## Bloque 8 · Delivery Reliability

Estudiar:

- change lead time;
- deployment frequency;
- failed deployment recovery time;
- change fail rate;
- deployment rework rate;
- canary;
- rollback;
- progressive exposure;
- change risk.

Referencia:

DORA + Google SRE.

Frontera:

Nexo utiliza estas métricas para riesgo/continuidad; Vector conserva ownership de Release Engineering.

---

## Bloque 9 · AI Systems Continuity

Con Córtex/Pulso/Vigía estudiar:

- provider outage;
- model/version change;
- rate limits;
- latency;
- context/tool failure;
- RAG dependency failure;
- retrieval degradation;
- safety/control failure;
- tool timeout;
- fallback behavior;
- cost explosion;
- tracing/evals;
- human escalation;
- loss of conversational state;
- continuity between model/provider versions.

Referencias:

- NIST AI RMF 1.0;
- NIST AI 600-1 Generative AI Profile;
- documentación de proveedores cuando corresponda.

---

## Bloque 10 · Handoffs y continuidad entre agentes

Estudiar y aplicar:

- owner;
- base;
- current state;
- decision;
- evidence;
- artifacts;
- hashes;
- tests;
- limitations;
- next owner;
- rollback/recovery path.

Meta:

otro Nexo debe reconstruir el estado operativo sin pedir a María que recuerde el contexto.

---

## Bloque 11 · Liderazgo técnico de fiabilidad

Practicar:

- delegar en el especialista;
- formular preguntas de riesgo;
- mantener calma operacional;
- evitar blame;
- evitar rescate permanente;
- evitar centralización;
- distinguir urgency de priority;
- comunicar incertidumbre;
- cerrar con evidencia;
- escalar pronto si el impacto excede mandato.

---

## Resultado esperado

Nexo debe poder responder, ante cualquier cambio o incidente:

1. ¿qué servicio/capacidad de usuario está en riesgo?
2. ¿qué dependencias atraviesa?
3. ¿qué señal demuestra el problema?
4. ¿cuál es el blast radius?
5. ¿quién es owner?
6. ¿cómo contenemos?
7. ¿cómo recuperamos?
8. ¿cómo verificamos recuperación?
9. ¿qué evidencia preservamos?
10. ¿qué debe aprender el sistema para que no dependamos de memoria informal?

## Estado

Foundation operativa completada el 30/09/2026.

Formación continua abierta: la fiabilidad no se considera un conocimiento cerrado.


## Ampliación R03 · 2026-10-06 · Formación aplicada desde práctica real

Lectura incorporada: [07_FORMACION_APLICADA_R03_20261006.md](07_FORMACION_APLICADA_R03_20261006.md). Consolida el estudio de Cielo, Peces, webs y Construcción, y mi autorrevisión de Fósiles.

Capacidades añadidas al plan: transformaciones/picking coherentes con lo visible; cámara/selección/tiempo/pose/foco separados; cancelación y reconciliación; semántica de anotaciones sobre assets; interacción con consecuencia observable; oráculos de prueba que puedan refutar el resultado; distinción entre fixture y navegador.

Estado: conocimiento leído y parcialmente practicado; corrección de Fósiles, QA de navegador y calidad de producto pendientes de demostrar. No equivale a aprobar el ejercicio. Siguiente paso acordado con María: preservar R01, esperar respuestas independientes de Prisma y Axioma, comparar evidencias y acordar mejoras antes de implementar R02.
