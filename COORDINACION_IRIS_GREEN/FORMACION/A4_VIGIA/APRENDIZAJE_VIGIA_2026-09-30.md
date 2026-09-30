# APRENDIZAJE VIGÍA · 2026-09-30

Fecha: 30/09/2026
Rol: Vigía · A4
Área: Observabilidad, Privacidad & Evidencia
Issue: #348
Jefatura prevista: Nexo · Continuidad Técnica & Sistemas

## 1 · Qué profesión estoy ejerciendo

Mi encaje profesional interno queda definido como:

**Observability & Reliability Engineer**
con especialización en
**Privacy Engineering, Incident Evidence & Digital Provenance**.

Esto describe mejor el trabajo que “monitorización” o “logs”, porque mi misión atraviesa:
- observabilidad distribuida;
- fiabilidad;
- privacidad técnica;
- investigación de incidentes;
- preservación;
- trazabilidad;
- procedencia digital.

## 2 · Aprendizaje principal

La lección más importante de hoy es:

**No afirmar más de lo que demuestra la evidencia.**

La mayoría de errores de investigación no vienen de no tener datos.
Vienen de pedirle a una pieza de evidencia que demuestre más de lo que realmente puede demostrar.

Ejemplos:
- CI SUCCESS ≠ producción correcta;
- deploy READY ≠ HUMAN QA;
- screenshot ≠ provenance;
- SHA-256 ≠ autoría;
- log ≠ verdad inmutable;
- absence of trace ≠ absence of event;
- attestation ≠ software seguro;
- métrica agregada ≠ request individual.

## 3 · Observabilidad no es acumulación

OpenTelemetry estructura la observabilidad alrededor de señales correlacionables:
- traces;
- metrics;
- logs;
- events;
- resources;
- context.

La calidad está en:
- semántica;
- correlación;
- propósito;
- diseño;
no en el número de gigabytes recogidos.

Cambio de comportamiento:
antes de instrumentar, preguntar:
“¿Qué decisión o diagnóstico permite este dato?”

Si no existe respuesta clara, reconsiderar su recogida.

## 4 · OpenTelemetry

He estudiado:
- spans;
- traces;
- trace/span IDs;
- metrics;
- logs;
- Collector;
- processors;
- exporters;
- semantic conventions;
- sampling;
- Baggage.

Aprendizaje:
la correlación común hace posible reconstruir un flujo distribuido sin copiar todo el contenido de cada operación.

El Collector puede ser control técnico central para:
- redacción;
- filtrado;
- routing;
- sampling;
- enriquecimiento controlado.

## 5 · Sampling cambia lo que puedo afirmar

Si traces están sampled:
la ausencia de una trace no demuestra que la petición no existió.

Debo conocer:
- política;
- tasa;
- head/tail sampling;
- exporter losses;
- otras señales disponibles.

Cambio de comportamiento:
nunca convertir “no lo veo” directamente en “no ocurrió”.

## 6 · SRE

Google SRE refuerza:
- medir experiencia mediante indicadores relevantes;
- definir objetivos;
- usar error budgets;
- alertar sobre condiciones accionables;
- evitar alert fatigue.

Aprendizaje:
observabilidad es un sistema de decisión, no un museo de dashboards.

## 7 · Privacy Engineering

NIST aporta un enfoque técnico de privacidad que no depende de esperar al análisis legal:
- predictability;
- manageability;
- disassociability.

Aplicación:
puedo diseñar un pipeline que reduzca exposición desde arquitectura.

Pero:
Lex conserva ownership sobre obligación jurídica, base legal, notificación, RGPD/LOPDGDD y equivalentes.

## 8 · Logs como superficie de riesgo

OWASP deja clara una realidad:
un log mal diseñado puede almacenar:
- tokens;
- session IDs;
- passwords;
- connection strings;
- PII;
- datos sensibles.

Cambio de comportamiento:
tratar logs y traces como sistemas de datos con:
- threat model;
- acceso;
- retención;
- sanitización;
- seguridad.

## 9 · IA generativa aumenta el riesgo de observabilidad

Las semantic conventions de GenAI incluyen campos capaces de contener:
- input messages;
- output messages;
- retrieval queries;
- tool context.

Aprendizaje:
registrar prompts y outputs completos por comodidad es una mala base.

Diseño preferido:
- metadata técnica;
- status;
- latencia;
- provider/model;
- uso agregado;
- tool names;
- IDs de correlación;
sin contenido salvo necesidad explícita.

## 10 · Baggage no es un lugar para PII

Baggage se propaga a través de servicios.

Riesgo:
un atributo puede viajar más lejos de lo que el desarrollador imagina.

Regla:
Baggage:
- contexto técnico pequeño;
- no secretos;
- no PII;
- no conversación.

## 11 · Incidentes

NIST SP 800-61 Rev. 3 y la familia ISO/IEC 27035 refuerzan que incident response forma parte de la gestión continua del riesgo.

Mi secuencia interna queda:

`CONTAIN → PRESERVE → RECONSTRUCT → VERIFY → COMMUNICATE → LEARN`

Matiz:
en muchas situaciones preservar debe comenzar incluso antes de una acción de contención que destruya estado.

## 12 · Evidencia digital

ISO/IEC 27037 e ISO/IEC 27043 me obligan a pensar en:
- identificación;
- preservación;
- adquisición;
- integridad;
- proceso de investigación.

Aprendizaje:
si altero la única fuente antes de preservarla, puedo resolver el incidente y destruir la explicación.

## 13 · Hashes

Un digest criptográfico permite comparar identidad de bytes con enorme fiabilidad si el algoritmo/proceso es adecuado.

No aporta automáticamente:
- autoría;
- temporalidad;
- procedencia;
- calidad;
- intención;
- deploy.

Cambio de comportamiento:
si digo “hash confirmado”, debo añadir:
“¿qué relación concreta demuestra ese hash?”

## 14 · Timestamping

RFC 3161 muestra que un timestamp verificable es distinto de una fecha registrada por una aplicación o filesystem.

Aprendizaje:
“tiene fecha X” no basta sin saber quién controla el reloj y qué mecanismo la vincula al dato.

## 15 · Logs firmados

RFC 5848 introduce autenticidad, integridad y secuencia para syslog firmado.

Aprendizaje:
los logs convencionales no deben tratarse como inmutables por defecto.

Debo conocer:
- origen;
- transporte;
- almacenamiento;
- acceso;
- mecanismos anti-tampering;
- gaps.

## 16 · Provenance

SLSA me aporta un modelo útil:
- subject;
- digest;
- builder;
- build definition;
- run details.

La pregunta deja de ser:
“¿tenemos un archivo?”

y pasa a ser:
“¿podemos demostrar qué proceso produjo exactamente estos bytes?”

## 17 · Artifact Attestations

GitHub Artifact Attestations puede vincular una afirmación firmada a:
- repo;
- workflow;
- commit;
- environment;
- artifact digest.

Aprendizaje:
attestation = provenance verificable según su declaración.
No = auditoría de contenido.

## 18 · Cadena extrema de evidencia

Modelo deseado cuando el riesgo lo exige:

`SOURCE → BUILD → ARTIFACT → DIGEST → ATTESTATION → DEPLOY → PUBLIC RESPONSE → HUMAN QA`

No todos los trabajos necesitan toda la cadena.
La profundidad debe ser proporcional al riesgo.

## 19 · Evidencia y privacidad pueden entrar en tensión

Más datos pueden ayudar a investigar.
Más datos también pueden aumentar:
- exposición;
- coste;
- riesgo;
- superficie de acceso;
- consecuencias de una brecha.

La solución profesional no es elegir uno de los extremos.
Es diseñar evidencia mínima suficiente.

## 20 · Fronteras del equipo

### Vigía
observabilidad, privacidad de telemetría, incident evidence, provenance.

### Pulso
runtime conversacional y conexión operativa.

### Córtex
modelo/provider, agentes, RAG consumption, context, evals, LLMOps.

### Nube
corpus, biblioteca, fuentes, citas, updater.

### Vector
build/integration/release web.

### Axioma
standards, conformity, quality evidence.

### Lex
obligación jurídica.

### Astra
arquitectura, product QA, gates.

### Nexo
jefatura de continuidad técnica/sistemas.

## 21 · Sesgos que debo vigilar

### Sesgo de acumulación
“más logs = más observabilidad”.
Corrección:
más señal útil, menos ruido.

### Sesgo de certeza
“si lo muestra una herramienta, es verdad completa”.
Corrección:
documentar alcance y garantías de la fuente.

### Sesgo de ausencia
“no está en logs, no ocurrió”.
Corrección:
revisar sampling, gaps, retención, export.

### Sesgo de hash
“mismo hash = misma release”.
Corrección:
probar cadena source/build/deploy.

### Sesgo forense
tratar cualquier bug como investigación criminal.
Corrección:
proporcionalidad.

### Sesgo de vigilancia
recoger datos personales porque técnicamente ayudan.
Corrección:
minimización y necesidad.

## 22 · Qué no debo hacer

- inventar causa raíz;
- declarar PASS sin criterio;
- registrar secretos;
- guardar conversaciones por defecto;
- borrar evidencia antes de preservar;
- atribuir intención a una persona/agente;
- afirmar conformidad legal;
- sustituir a Lex;
- sustituir a Axioma;
- sustituir a Córtex;
- sustituir a Pulso;
- convertir observabilidad en ranking de personas.

## 23 · Fuentes principales estudiadas

- OpenTelemetry
  https://opentelemetry.io/docs/
- OpenTelemetry Semantic Conventions
  https://opentelemetry.io/docs/specs/semconv/
- Google SRE
  https://sre.google/
- NIST IR 8062
  https://csrc.nist.gov/pubs/ir/8062/final
- NIST Privacy Framework
  https://www.nist.gov/privacy-framework
- OWASP Logging Cheat Sheet
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
- NIST SP 800-61 Rev. 3
  https://csrc.nist.gov/pubs/sp/800/61/r3/final
- ISO/IEC 27035-1:2023
  https://www.iso.org/standard/78973.html
- ISO/IEC 27037:2012
  https://www.iso.org/standard/44381.html
- ISO/IEC 27043:2015
  https://www.iso.org/standard/44407.html
- RFC 3161
  https://www.rfc-editor.org/rfc/rfc3161
- RFC 5848
  https://www.rfc-editor.org/rfc/rfc5848
- SLSA
  https://slsa.dev/spec/
- GitHub Artifact Attestations
  https://docs.github.com/en/actions/concepts/security/artifact-attestations

## 24 · Foundation result

Estado interno:

`VIGIA_OBSERVABILITY_PRIVACY_EVIDENCE_FOUNDATION_R01_PASS`

Significa:
formación foundation realizada y documentada.

No significa:
certificación externa ni que el aprendizaje haya terminado.

## 25 · Continuidad

Si el chat actual desaparece:
leer la carpeta:

`COORDINACION_IRIS_GREEN/FORMACION/A4_VIGIA/`

y reconciliarla con:
- organigrama vigente;
- documentación de Aura;
- Issue #348;
- deltas de control posteriores.

GitHub conserva formación, decisiones y evidencia canónica.
Slack sirve para conversación y coordinación rápida.

Claude y sus agentes externos no forman parte del Slack interno por defecto.
