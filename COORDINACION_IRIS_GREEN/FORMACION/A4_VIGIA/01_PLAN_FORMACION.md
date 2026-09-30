# VIGÍA · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 30/09/2026
Issue: #348

Objetivo:
formar a Vigía/A4 para diseñar observabilidad útil y privada, investigar incidentes con disciplina y producir evidencia técnica cuya fuerza probatoria no se exagere.

No es certificación externa.

---

## Bloque 1 · Observabilidad: modelo mental

Fuentes primarias:
- OpenTelemetry Documentation
  https://opentelemetry.io/docs/
- OpenTelemetry Concepts · Signals
  https://opentelemetry.io/docs/concepts/signals/

Dominar:
- traces;
- spans;
- metrics;
- logs;
- events;
- resources;
- context propagation;
- correlación entre señales.

Aprendizaje:
observabilidad no significa acumular datos.
Significa poder inferir el estado interno del sistema a partir de señales diseñadas deliberadamente.

Aplicación Iris Green:
- cada señal debe responder a una pregunta operativa;
- si no sabemos qué pregunta resuelve un dato, no se recoge “por si acaso”;
- correlación > volumen.

---

## Bloque 2 · OpenTelemetry y convenciones semánticas

Fuentes:
- https://opentelemetry.io/docs/concepts/semantic-conventions/
- https://opentelemetry.io/docs/specs/semconv/
- https://opentelemetry.io/docs/collector/

Dominar:
- instrumentación;
- SDK;
- Collector;
- exporters;
- processors;
- semantic conventions;
- resource attributes;
- trace/span IDs;
- propagators;
- sampling.

Aprendizaje:
la interoperabilidad depende de semántica estable, no solo del formato.

Regla:
un log JSON sin esquema coherente no es por sí mismo buena observabilidad.

Aplicación:
si Iris Green adopta OpenTelemetry:
`APP → OTEL SDK/AUTO-INSTRUMENTATION → COLLECTOR → PROCESS/REDACT → EXPORT`

El Collector es un punto apropiado para:
- filtrado;
- redacción;
- enriquecimiento controlado;
- routing;
- sampling;
- enforcement de política.

---

## Bloque 3 · Sampling, cardinalidad y coste

Fuentes:
- OpenTelemetry sampling documentation
  https://opentelemetry.io/docs/concepts/sampling/
- Google SRE
  https://sre.google/

Dominar:
- head sampling;
- tail sampling;
- pérdida deliberada de detalle;
- cardinalidad alta;
- coste/retención;
- sesgo de muestra.

Regla crítica:
**una traza muestreada no es un registro exhaustivo del sistema.**

Consecuencia:
no usar ausencia en traces sampled como prueba concluyente de que un evento no ocurrió.

---

## Bloque 4 · SLI, SLO, error budgets y alerting

Fuentes:
- Google SRE Book
  https://sre.google/sre-book/table-of-contents/
- Google SRE Workbook
  https://sre.google/workbook/table-of-contents/

Dominar:
- SLI;
- SLO;
- error budget;
- disponibilidad;
- latencia;
- errores;
- saturación;
- burn-rate alerting;
- alertas accionables.

Aprendizaje:
una alerta debe señalar una condición que justifica acción.
Alertar por cada anomalía produce fatiga y reduce fiabilidad humana.

Aplicación Sabik:
métricas candidatas:
- disponibilidad del servicio;
- tasa de error;
- latencia;
- tool failures;
- fallos de provider;
- fallos de retrieval;
- timeout;
- rate limiting;
- degradación observable.

La definición final de calidad LLM pertenece a Córtex; Vigía instrumenta y preserva la evidencia operacional.

---

## Bloque 5 · Privacy Engineering

Fuentes:
- NIST IR 8062 · An Introduction to Privacy Engineering and Risk Management
  https://csrc.nist.gov/pubs/ir/8062/final
- NIST Privacy Framework
  https://www.nist.gov/privacy-framework
- EDPB · Data protection by design and by default
  https://www.edpb.europa.eu/

Conceptos:
- predictability;
- manageability;
- disassociability;
- minimización;
- finalidad;
- retención;
- acceso;
- pseudonimización;
- separación de datos.

Regla Vigía:
`NECESIDAD OPERATIVA → DATO MÍNIMO → ACCESO MÍNIMO → RETENCIÓN MÍNIMA`

Vigía diseña técnicamente privacidad en telemetría.
Lex determina obligación jurídica y base legal.

---

## Bloque 6 · Logging seguro

Fuente:
- OWASP Logging Cheat Sheet
  https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html

No registrar directamente salvo necesidad y tratamiento explícitos:
- contraseñas;
- access tokens;
- session IDs;
- claves;
- secrets;
- connection strings;
- datos personales sensibles;
- datos de pago;
- payloads completos innecesarios.

Técnicas:
- remove;
- mask;
- sanitize;
- hash;
- pseudonymize;
- encrypt;
- tokenize.

Aprendizaje:
un sistema de logs puede convertirse en una segunda base de datos sensible si no se gobierna.

---

## Bloque 7 · Observabilidad de IA generativa

Fuentes:
- OpenTelemetry Semantic Conventions for Generative AI
  https://opentelemetry.io/docs/specs/semconv/gen-ai/
- OpenTelemetry registry · GenAI attributes
  https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/

Riesgos:
- prompts contienen PII;
- outputs contienen datos sensibles;
- retrieval queries revelan intención/contexto;
- retrieved documents pueden contener información privada;
- tool arguments pueden incluir secretos o datos personales.

Regla:
**contenido completo de prompt/output NO es telemetría por defecto.**

Preferir cuando baste:
- modelo/provider;
- operación;
- timestamps;
- latencia;
- status/error class;
- token usage agregado;
- tool name;
- trace correlation;
- IDs técnicos no personales.

Captura de contenido:
solo cuando exista propósito claro, control de acceso, minimización, retención definida y encaje validado con Lex/Axioma/Córtex según corresponda.

---

## Bloque 8 · Context propagation y Baggage

Fuente:
- OpenTelemetry Baggage
  https://opentelemetry.io/docs/concepts/signals/baggage/

Aprendizaje:
Baggage puede propagarse entre servicios e incluso acabar en llamadas externas según instrumentación.

Regla:
no colocar en Baggage:
- PII;
- secretos;
- contenido de conversación;
- atributos sensibles;
- tokens.

Baggage es contexto operacional, no almacén.

---

## Bloque 9 · Incident Response

Fuente vigente:
- NIST SP 800-61 Rev. 3 · Incident Response Recommendations and Considerations for Cybersecurity Risk Management
  https://csrc.nist.gov/pubs/sp/800/61/r3/final

Dominar:
- preparación;
- detección;
- análisis;
- respuesta;
- recuperación;
- aprendizaje;
- integración con risk management.

Secuencia operativa Vigía:
`CONTAIN → PRESERVE → RECONSTRUCT → VERIFY → COMMUNICATE → LEARN`

No modificar innecesariamente una fuente antes de preservarla.

---

## Bloque 10 · Gestión de incidentes de seguridad

Fuentes:
- ISO/IEC 27035-1:2023
  https://www.iso.org/standard/78973.html
- familia ISO/IEC 27035

Estudiar:
- principios;
- preparación;
- roles;
- detección/reporting;
- assessment;
- response;
- lessons learned.

Regla:
incidente técnico, incidente de seguridad y brecha de datos no son sinónimos.
Lex determina consecuencias y notificaciones legales.

---

## Bloque 11 · Evidencia digital

Fuentes:
- ISO/IEC 27037:2012 · Guidelines for identification, collection, acquisition and preservation of digital evidence
  https://www.iso.org/standard/44381.html
- ISO/IEC 27043:2015 · Incident investigation principles and processes
  https://www.iso.org/standard/44407.html

Dominar:
- identificación;
- preservación;
- adquisición;
- integridad;
- trazabilidad;
- documentación;
- reproducibilidad;
- chain of custody cuando corresponda.

Aprendizaje:
la evidencia no empieza cuando escribimos el informe.
Empieza cuando preservamos correctamente el estado relevante.

---

## Bloque 12 · Hashes e integridad

Dominar:
- digest criptográfico;
- SHA-256;
- identidad de bytes;
- límites probatorios.

Un hash puede apoyar:
- “estos bytes son iguales”;
- “este artefacto no cambió respecto a este digest”.

Un hash NO demuestra por sí solo:
- quién creó el archivo;
- por qué;
- cuándo existía;
- que sea correcto;
- que haya sido desplegado;
- que el usuario lo haya visto;
- que un proceso haya sido seguro.

---

## Bloque 13 · Timestamps verificables

Fuente:
- RFC 3161 · Time-Stamp Protocol
  https://www.rfc-editor.org/rfc/rfc3161

Aprendizaje:
un timestamp verificable puede aportar evidencia temporal vinculada a un digest.

No confundir:
- fecha del filesystem;
- fecha de commit;
- hora de log;
- timestamp firmado/confiable.

Cada una tiene distinta fuerza.

---

## Bloque 14 · Logs firmados y secuencia

Fuente:
- RFC 5848 · Signed Syslog Messages
  https://www.rfc-editor.org/rfc/rfc5848

Conceptos:
- autenticidad de origen;
- integridad;
- secuencia;
- detección de mensajes ausentes.

Aprendizaje:
la existencia de logs no garantiza inmutabilidad ni completitud.
Debe conocerse el mecanismo de generación, transporte, almacenamiento y protección.

---

## Bloque 15 · Software supply-chain provenance

Fuentes:
- SLSA Specification
  https://slsa.dev/spec/
- SLSA Provenance
  https://slsa.dev/spec/v1.2/provenance

Dominar:
- provenance;
- subject;
- digest;
- builder;
- buildDefinition;
- runDetails;
- verification.

Aprendizaje:
provenance permite responder de dónde sale un artefacto y qué proceso declaró haberlo producido.

No equivale automáticamente a:
- calidad;
- seguridad;
- ausencia de vulnerabilidades;
- HUMAN QA.

---

## Bloque 16 · GitHub Artifact Attestations

Fuente:
- GitHub Docs · Artifact attestations
  https://docs.github.com/en/actions/concepts/security/artifact-attestations

Estudiar:
- attestations;
- build provenance;
- workflow identity;
- repository;
- commit SHA;
- environment;
- verification.

Regla:
una attestation demuestra una afirmación firmada de procedencia.
No convierte el contenido atestado en correcto por definición.

---

## Bloque 17 · Evidencia de release/deploy

Vigía debe poder reconstruir, cuando las herramientas lo permitan:

`SOURCE SHA → BUILD/RUN → ARTIFACT DIGEST → ATTESTATION → DEPLOY ID → PUBLIC RESPONSE → HUMAN QA`

Cada flecha necesita evidencia distinta.

Ejemplo:
CI verde prueba que determinados checks pasaron en un run concreto.
No prueba por sí solo que el sitio público sirva ese mismo artefacto.

---

## Bloque 18 · Observabilidad de terceros

Aplicación:
Netlify, providers IA, CDNs, APIs y servicios externos generan señales propias.

Estudiar:
- qué datos ofrecen;
- qué precisión temporal tienen;
- qué retención;
- qué campos personales incluyen;
- cómo correlacionarlos con señales internas;
- qué garantías de integridad existen.

Regla:
dato de proveedor = evidencia externa con alcance y límites documentados.

---

## Bloque 19 · Seguridad del pipeline de telemetría

Amenazas:
- log injection;
- secret leakage;
- PII leakage;
- spoofing;
- tampering;
- pérdida de eventos;
- duplicación;
- clock skew;
- cardinality explosion;
- denial of service;
- acceso excesivo a dashboards;
- export accidental a terceros.

Controles:
- sanitización;
- RBAC;
- encryption in transit/at rest;
- filtros;
- cuotas;
- retention;
- access logging;
- separación de entornos;
- redacción antes de export;
- revisión de exporters.

---

## Bloque 20 · Formación continua

Revisar periódicamente:
- cambios de OpenTelemetry;
- nuevas semantic conventions;
- NIST;
- ISO aplicables;
- SLSA;
- GitHub Actions/attestations;
- Netlify observability;
- incidentes reales del proyecto;
- cambios en Sabik;
- riesgos de privacidad emergentes.

Modelo:
`FOUNDATION → PRACTICE → INCIDENT LEARNING → UPDATE`

La formación de Vigía nunca se considera “cerrada” de forma permanente.
