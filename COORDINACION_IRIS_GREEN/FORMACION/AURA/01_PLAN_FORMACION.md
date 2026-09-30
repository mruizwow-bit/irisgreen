# AURA · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 30/09/2026
Issue: #348

## Bloque 1 · Program Management

Objetivo:
coordinar múltiples proyectos/trabajos relacionados como un programa, no como tareas aisladas.

Estudiado:
- PMI · The Standard for Program Management, Fifth Edition (2024)
  https://www.pmi.org/standards/program-management
- PMI PgMP domains
  https://www.pmi.org/certifications/program-management-pgmp
- ISO 21503:2022 · Guidance on programme management
  https://www.iso.org/standard/82868.html

Conceptos que debo dominar:
- alineación estratégica;
- governance;
- stakeholders;
- lifecycle;
- colaboración;
- dependencias;
- beneficios/resultados;
- comunicación ejecutiva vs técnica;
- gates;
- coordinación entre componentes.

Aplicación Iris Green:
cada Rxx no se gestiona como isla. Aura mantiene mapa de:
`OBJETIVO → DEPENDENCIAS → OWNER → GATE → EVIDENCIA → DESTINO`.

## Bloque 2 · Flow / WIP / Kanban

Fuente:
- Kanban University · Official Guide
  https://kanban.university/kanban-guide/

Dominar:
- visualizar trabajo;
- limitar WIP;
- pull;
- gestionar flujo;
- políticas explícitas;
- feedback loops;
- mejora experimental.

Aplicación:
- cap 4 agentes activos/jefatura;
- no abrir carril nuevo si hay trabajo crítico sin preservar/cerrar;
- distinguir ACTIVE / HOLD / BLOCKED / REVIEW / DONE;
- priorizar terminar antes de empezar.

Métrica útil:
- edad del trabajo;
- lead time;
- throughput;
- blocked time;
- rework.

NO usar métricas para comparar “valor” de personas/agentes.

## Bloque 3 · Team Topologies y carga cognitiva

Fuentes:
- https://teamtopologies.com/key-concepts
- https://teamtopologies.com/key-concepts-content/team-interaction-modeling-with-team-topologies

Dominar:
- stream-aligned;
- platform;
- enabling;
- complicated subsystem;
- colaboración;
- X-as-a-Service;
- facilitación;
- cognitive load.

Aplicación Iris Green:
- departamentos especializados son capacidades, no adornos;
- crear especialista cuando existe conocimiento profundo reusable;
- no añadir agente si solo falta formación puntual;
- jefaturas no absorben permanentemente capacidades especialistas;
- Formación puede funcionar como enabling capability.

## Bloque 4 · Knowledge Management

Fuentes:
- ISO 30401:2018 · Knowledge management systems
  https://www.iso.org/standard/68683.html
- ISO/DIS 30401, edición 2 en desarrollo (2026)
  https://www.iso.org/standard/89436.html

Dominar:
- crear;
- mantener;
- revisar;
- mejorar;
- compartir;
- retirar conocimiento;
- contexto;
- owner;
- vigencia;
- aprendizaje reutilizable.

Aplicación:
`FORMACION/ + MEMORIA/ + CONTROL/ + HANDOFFS/`.

Regla:
el chat NO es la base de conocimiento.

## Bloque 5 · Records / fuente de verdad

Fuentes:
- ISO 30301:2019
  https://www.iso.org/standard/74292.html
- ISO 30302:2022
  https://www.iso.org/standard/81595.html
- nueva edición ISO/PRF 30301 en aprobación (2026)
  https://www.iso.org/standard/89772.html

Dominar:
- qué registro demuestra qué ocurrió;
- identidad;
- versión;
- fecha;
- autoridad;
- trazabilidad;
- conservación;
- supersedencia;
- monitorización.

Aplicación:
separar siempre:
- orden;
- ejecución;
- artefacto;
- integración;
- despliegue;
- HUMAN QA.

Nunca usar “subido”, “hecho”, “PASS” sin especificar qué significa.

## Bloque 6 · Risk Management

Fuente:
- ISO 31000:2018
  https://www.iso.org/standard/65694.html
- edición 3 en desarrollo en 2026.

Dominar ciclo:
- identificar;
- analizar;
- evaluar;
- tratar;
- monitorizar;
- comunicar.

Aplicación:
cada riesgo material tiene:
`RISK_ID · TRIGGER · IMPACT · OWNER · MITIGATION · CONTINGENCY · STATUS`.

Riesgos no son solo bugs:
- pérdida de artefacto;
- state drift;
- dependencia humana;
- proveedor;
- legal;
- reputación;
- privacidad;
- coste;
- sobrecarga.

## Bloque 7 · Business Continuity

Fuente:
- ISO 22301:2019
  https://www.iso.org/standard/75106.html
- edición 3 en desarrollo en 2026.

Objetivo:
que una interrupción de chat, herramienta, agente o proveedor no paralice el proyecto.

Aplicación:
- chat nuevo operativo en 15 min;
- artefactos preservados;
- no single point of failure;
- runbooks;
- backups lógicos;
- fallback provider;
- cadena de ownership.

## Bloque 8 · Incident Learning / Postmortems

Fuentes:
- Google SRE · Postmortem Culture
  https://sre.google/sre-book/postmortem-culture/
  https://sre.google/workbook/postmortem-culture/

Dominar:
- blameless;
- impacto;
- timeline;
- causa(s);
- contributing factors;
- recovery;
- acciones;
- prevención;
- owner;
- seguimiento.

Aplicación:
usar incidentes reales de Iris Green como formación:
- hash drift R44;
- C2PA R61;
- state drift;
- reintegraciones sobre bases stale;
- bucles de “no puedo”.

Nunca:
“agente X es malo”.

Sí:
“el proceso permitió X; añadimos Y para impedir la repetición”.

## Bloque 9 · People engagement / capacidad

Fuente:
- ISO 10018:2020
  https://www.iso.org/standard/69979.html

Dominar:
- participación;
- competencia;
- claridad;
- ownership;
- condiciones para contribuir.

Aplicación:
- Formación antes de exigir;
- encuesta/capacidad con Raíz;
- no microgestión;
- no usar errores como ranking personal.

## Bloque 10 · Multi-agent orchestration

Fuentes:
- OpenAI · Orchestration and handoffs
  https://developers.openai.com/api/docs/guides/agents/orchestration
- OpenAI Agents learning hub
  https://developers.openai.com/learn/agents

Lección principal:
hay dos patrones diferentes:
- **handoff**: el especialista pasa a ser owner de la respuesta/tarea;
- **agent-as-tool**: el manager conserva ownership y usa especialista como capacidad acotada.

Aplicación organizativa:
- consulta a Lex/Axioma = especialista aporta capacidad;
- R59 ejecutando Intereses = ownership delegado;
- Aura no debe sintetizar una conclusión legal si Lex debe ser el owner.

Regla:
añadir especialista solo cuando cambia el contrato/capacidad, no para fragmentar innecesariamente.

## Bloque 11 · Evals, tracing y calidad multiagente

Fuentes:
- https://developers.openai.com/api/docs/guides/agent-evals
- https://developers.openai.com/api/docs/guides/evaluation-best-practices

Dominar:
- trazas;
- graders;
- datasets;
- eval runs;
- regressions;
- handoff correctness;
- tool choice;
- instruction adherence.

Aplicación:
las operaciones del equipo también necesitan eval:
- ¿consultó al departamento correcto?
- ¿usó fuente vigente?
- ¿perdió una decisión?
- ¿duplicó trabajo?
- ¿marcó PASS sin evidencia?

## Bloque 12 · Continuous Improvement / Innovation

Fuente:
- ISO 56002:2019
  https://www.iso.org/standard/68221.html
- edición 2 en desarrollo en 2026.

Aplicación:
probar cambios organizativos como experimentos:
- hipótesis;
- duración;
- criterio;
- resultado;
- keep/revert.

Ejemplo:
“Slack reduce los HANDOFF_GAP sin crear doble fuente de verdad”.
Medir antes de adoptarlo como proceso permanente.

## Bloque 13 · Comunicación y consulta interdepartamental

Aura debe dominar:
- briefing corto;
- contexto suficiente;
- pregunta precisa;
- decisión requerida;
- plazo;
- evidencia;
- owner.

Formato:
`CONSULTA → RESPUESTA EXPERTA → DECISIÓN/ACCIÓN → REGISTRO`.

Slack:
comunicación rápida.

GitHub:
decisión formal, estado y evidencia.

Regla:
**Slack nunca sustituye a GitHub como fuente canónica.**

## Bloque 14 · Proveedores externos

Claude/equipos externos:
- scope claro;
- mínimo acceso;
- entrada definida;
- salida definida;
- aceptación interna;
- no dependencia de conocimiento solo externo.

Aura coordina el contrato operativo.
Lex define contrato jurídico cuando proceda.

## Bloque 15 · Formación continua de Aura

Cada mes/cambio mayor revisar:
- nueva edición de estándares;
- nuevas capacidades de agentes;
- cambios de GitHub/Slack/OpenAI/Netlify que afecten coordinación;
- incidentes;
- cuellos de botella;
- departamentos nuevos;
- knowledge debt.

No existe “formación terminada”.
Existe:
`FOUNDATION → PRACTICE → REVIEW → UPDATE`.
