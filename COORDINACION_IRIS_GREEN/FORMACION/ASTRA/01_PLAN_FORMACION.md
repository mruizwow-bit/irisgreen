# ASTRA · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 01/10/2026  
Puesto: Product Quality & Software Architecture Lead  
Estado: `ASTRA_TRAINING_R01_ACTIVE`

## Objetivo

Construir capacidad profesional real para:
- evaluar arquitecturas;
- convertir atributos de calidad en escenarios verificables;
- diseñar gates válidos;
- priorizar pruebas por riesgo;
- detectar falsa confianza en CI;
- revisar sistemas centrados en personas;
- gobernar aceptación técnica previa a HUMAN QA.

## Bloques de estudio

### 1 · Arquitectura y decisiones
- ISO/IEC/IEEE 42010;
- stakeholders, concerns, viewpoints/views;
- Architecture Decision Records;
- dependencias, límites, acoplamiento/cohesión;
- evolución y deuda arquitectónica.

### 2 · Evaluación arquitectónica
- SEI QAW;
- ATAM;
- quality-attribute scenarios;
- sensitivity points;
- trade-off points;
- utility trees;
- tactics.

### 3 · Calidad de producto
- ISO/IEC 25010;
- ISO/IEC 25030;
- ISO/IEC 25023;
- ISO/IEC 25040;
- requisitos, métricas, evaluación y umbrales justificados.

### 4 · Ingeniería de pruebas
- ISO/IEC/IEEE 29119;
- risk-based testing;
- test oracles;
- equivalence/boundary/state-transition/combinatorial techniques;
- regression strategy;
- negative testing.

### 5 · Calidad de los tests
- mutation testing;
- property-based testing;
- contract testing;
- determinismo;
- flaky tests;
- sensibilidad del gate al fallo real.

Pregunta obligatoria:
**si rompo deliberadamente la propiedad, ¿el gate se pone rojo?**

### 6 · Testabilidad como arquitectura
- observability/control points;
- dependency isolation;
- reproducible state;
- fixtures representativos;
- hermeticidad cuando aplique;
- separación entre fallo de producto e infraestructura de prueba.

### 7 · HCI y calidad en uso
- ISO 9241-11;
- ISO 9241-210;
- contexto de uso;
- eficacia/eficiencia/satisfacción;
- investigación y validación con personas;
- HUMAN QA como evidencia distinta.

### 8 · Accesibilidad cognitiva
- WCAG 2.2;
- WCAG-EM 2.0;
- W3C COGA;
- claridad, predictibilidad, control, carga cognitiva y comprensión.
Coordinación normativa obligatoria con Axioma.

### 9 · Reliability y resiliencia
- SRE;
- SLI/SLO/error budgets;
- graceful degradation;
- rollback/canary;
- failure-mode analysis/FMEA;
- recuperación y contención.

### 10 · Observabilidad para aceptación
- traces/metrics/logs;
- journey health;
- evidence quality;
- telemetry minimization;
- coordinación con Vigía.

### 11 · Secure architecture
- NIST SSDF;
- NIST SP 800-160;
- OWASP ASVS;
- threat/risk integration en arquitectura;
- coordinación con Lex/Axioma/Vigía según materia.

### 12 · Frontend/product architecture
- design-system governance;
- CSS/cascade/tokens/component contracts;
- responsive/reflow;
- cross-browser;
- visual regression;
- performance budgets;
- progressive enhancement.

## Prácticas obligatorias antes de declarar foundation PASS

1. Convertir un requisito ambiguo en quality-attribute scenario completo.
2. Diseñar un gate y demostrar que falla mediante fault seeding.
3. Revisar una arquitectura con QAW/ATAM simplificado.
4. Construir una matriz riesgo → técnica de prueba → evidencia.
5. Analizar un falso PASS histórico y corregir el oracle.
6. Hacer FMEA de una dependencia crítica.
7. Diseñar un plan de degradación/rollback.
8. Revisar un journey con evidencia técnica + humana separada.
9. Crear un runbook de aceptación Astra.
10. Examen interno con caso positivo y negativo.

## Formación continua

Ciclo:
`STUDY → PRACTICE → EVIDENCE → REVIEW → UPDATE`.

No existe “formación terminada”.
