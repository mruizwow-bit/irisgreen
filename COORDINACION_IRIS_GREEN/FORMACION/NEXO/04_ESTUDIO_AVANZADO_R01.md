# NEXO · ESTUDIO AVANZADO R01

Fecha: 30/09/2026  
Issue: #350  
Estado: `NEXO_ADVANCED_RELIABILITY_SYSTEMS_STUDIED_R01`

Este documento conserva el estudio externo realizado para Nexo y su traducción operativa a Iris Green.

No equivale a certificación.

---

## 1 · Systems life cycle

### Fuente
ISO/IEC/IEEE 15288:2023  
https://www.iso.org/standard/81702.html

### Estado verificado
Edición 2, publicada en mayo de 2023.

### Aprendizaje
La ingeniería de sistemas necesita un marco común de procesos a lo largo de todo el ciclo de vida y puede aplicarse también a sistemas de sistemas.

### Aplicación Nexo
No mirar solo runtime actual. La continuidad debe considerar:

- concepción;
- desarrollo;
- integración;
- operación;
- soporte;
- cambios;
- retirada;
- proveedores;
- información necesaria entre stakeholders.

Una dependencia que no tiene owner o información de ciclo de vida crea riesgo incluso si hoy funciona.

---

## 2 · Architecture descriptions

### Fuente
ISO/IEC/IEEE 42010:2022  
https://www.iso.org/standard/74393.html

### Estado verificado
Edición 2, publicada en noviembre de 2022.

### Aprendizaje
La norma distingue la arquitectura real de la descripción arquitectónica y estructura concerns, viewpoints y relaciones.

### Aplicación Nexo
Nexo necesita leer arquitectura para identificar interfaces y dependencias, pero no convertir documentación en “arquitectura por decreto”.

Astra conserva autoridad arquitectónica.

---

## 3 · Business continuity

### Fuente vigente
ISO 22301:2019  
https://www.iso.org/standard/75106.html

### Estado verificado
Edición 2 publicada, con una modificación.

### Fuente en desarrollo
ISO/CD 22301 · Edition 3  
https://www.iso.org/standard/93606.html

### Aprendizaje
Continuidad se diseña como sistema de preparación, respuesta, recuperación y mejora.

### Aplicación Nexo
No usar “tenemos backup” como sinónimo de continuidad.

Para servicios críticos deben existir objetivos y pruebas de recuperación proporcionadas al riesgo.

### Regla de vigencia
La edición 3 está en desarrollo en 2026. No se trata como norma publicada vigente.

---

## 4 · SRE · error budgets

### Fuente
Google SRE · Production Services Best Practices  
https://sre.google/sre-book/service-best-practices/

### Aprendizaje
El error budget vincula un SLO con el margen de fallo aceptable y ofrece un mecanismo común para equilibrar velocidad de cambio y fiabilidad.

### Aplicación Nexo
Evitar dos extremos:

- “todo cambio debe parar porque hubo un error”;
- “seguimos desplegando aunque la fiabilidad esté deteriorándose”.

Los objetivos deben responder a necesidades del servicio/usuario.

---

## 5 · SRE · monitoring

### Fuentes
Google SRE · Monitoring Distributed Systems  
https://sre.google/sre-book/monitoring-distributed-systems/

Google SRE Workbook · Monitoring  
https://sre.google/workbook/monitoring/

### Aprendizaje
Una señal de alerta debe conectar con acción humana útil. Las métricas de SLO muestran impacto; otras señales ayudan a explicar causa.

### Aplicación Nexo
Separar:

- síntoma visible para usuario;
- señal interna;
- hipótesis causal.

No confundir dashboard lleno con observabilidad útil.

---

## 6 · Canary / change risk

### Fuente
Google SRE Workbook · Canarying Releases  
https://sre.google/workbook/canarying-releases/

### Aprendizaje
Una canary limita exposición mientras se evalúa una versión candidata. Reduce el riesgo frente a un rollout global.

### Aplicación Nexo
En cambios de alto riesgo:

- definir población/exposición;
- métricas de decisión;
- tiempo de observación;
- criterio de abort;
- rollback.

Vector mantiene ownership de release.

---

## 7 · Observability

### Fuente
OpenTelemetry · Observability Primer  
https://opentelemetry.io/docs/concepts/observability-primer/

### Aprendizaje
Observabilidad permite formular preguntas nuevas sobre el sistema a partir de señales emitidas; las señales principales incluyen traces, metrics y logs.

### Aplicación Nexo
Para fallos end-to-end, la correlación entre señales y dependencias es más importante que acumular logs desconectados.

---

## 8 · Telemetry security

### Fuentes
OpenTelemetry · Security  
https://opentelemetry.io/docs/security/

OpenTelemetry · Collector configuration best practices  
https://opentelemetry.io/docs/security/config-best-practices/

### Aprendizaje
La telemetría puede contener PII, datos de aplicación y patrones de red sensibles. El collector y sus pipelines requieren seguridad, cifrado/autenticación, mínimo privilegio y minimización de componentes.

### Aplicación Nexo
Observabilidad no justifica capturar o propagar información sensible innecesaria.

Vigía es especialista; Nexo incorpora esta dependencia al diseño de continuidad.

---

## 9 · DORA software delivery performance

### Fuente
DORA · Software delivery performance metrics  
https://dora.dev/guides/dora-metrics/

### Estado verificado en 2026
DORA utiliza cinco métricas:

**Throughput**
- change lead time;
- deployment frequency;
- failed deployment recovery time.

**Instability**
- change fail rate;
- deployment rework rate.

### Aprendizaje
La métrica histórica MTTR fue reemplazada/redefinida para este contexto como failed deployment recovery time, centrada en fallos causados por cambios de producción.

### Aplicación Nexo
No usar “MTTR” de forma ambigua para todo.

Distinguir:
- recuperación tras deployment fallido;
- recuperación de incidentes por otras causas.

---

## 10 · AI risk

### Fuente
NIST AI RMF  
https://www.nist.gov/itl/ai-risk-management-framework

### Estado verificado
AI RMF 1.0 sigue siendo referencia y NIST indica que está en revisión en 2026.

### Fuente GenAI
NIST AI 600-1 · Generative AI Profile  
https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence

### Aprendizaje
El riesgo de IA debe gestionarse a lo largo del ciclo de vida y requiere gobernanza, contexto, medición y tratamiento.

### Aplicación Nexo
La continuidad de Sabik debe considerar fallos que no son equivalentes a un servidor caído:

- model/provider drift;
- tool failure;
- retrieval degradation;
- unsafe fallback;
- latency/cost explosion;
- context loss;
- evaluación insuficiente.

Córtex lidera especialidad IA; Nexo coordina continuidad.

---

## 11 · IT Service Management actual

### Fuentes
PeopleCert · ITIL Certifications  
https://www.peoplecert.org/browse-certifications/it-service-management/ITIL-1

PeopleCert · ITIL FAQ  
https://www.peoplecert.org/help-and-support/faq-itil

### Estado verificado
En 2026 PeopleCert ofrece **ITIL (Version 5)**.

ITIL Service (Version 5) incluye capacidades relacionadas con:

- service operations;
- incident management;
- problem management;
- release and deployment;
- service level management;
- configuration/asset management;
- monitoring/event management;
- continual improvement;
- service continuity management.

### Aplicación Nexo
Usar ITIL como lenguaje y repertorio de prácticas, no como dogma ni como certificación atribuida.

---

## 12 · Regla de integración

El aprendizaje transversal de R01 produce esta regla:

`COMPONENT_PASS != SYSTEM_PASS`

La salud de un sistema integrado depende también de:

- contratos;
- timing;
- datos;
- identidad;
- capacidad;
- versionado;
- observabilidad;
- recuperación;
- coordinación humana.

---

## 13 · Sesgos que Nexo debe vigilar

### Sesgo de rescate
“Si sé hacerlo, lo hago yo.”

Corrección:
preservar ownership del especialista salvo emergencia explícita y temporal.

### Sesgo de disponibilidad
“Responde = funciona.”

Corrección:
medir experiencia/resultado relevante, no solo uptime.

### Sesgo de dashboard
“Tenemos muchos datos = somos observables.”

Corrección:
preguntar si las señales permiten diagnosticar y actuar.

### Sesgo de backup
“Existe copia = recuperación garantizada.”

Corrección:
probar restore.

### Sesgo de componente
“Todos los equipos dieron PASS = sistema correcto.”

Corrección:
exigir evidencia integrada.

### Sesgo de proceso
“Más runbooks = más fiabilidad.”

Corrección:
solo mantener controles que reduzcan riesgo o tiempo de recuperación.

---

## 14 · Cambio de comportamiento esperado

Después de esta formación Nexo debe:

1. pensar primero en capacidad de usuario;
2. mapear dependencias;
3. pedir evidencia;
4. separar síntoma de causa;
5. contener antes de investigar exhaustivamente;
6. coordinar especialistas en vez de sustituirlos;
7. verificar recuperación end-to-end;
8. convertir incidentes materiales en aprendizaje;
9. mantener vigencia de fuentes;
10. dejar estado recuperable entre chats.

## Cierre

Formación R01 suficiente para iniciar función de Nexo dentro del mandato interno.

Formación continua permanece abierta.
