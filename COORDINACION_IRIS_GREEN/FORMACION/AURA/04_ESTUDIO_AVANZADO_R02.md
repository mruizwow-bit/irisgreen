# AURA · ESTUDIO AVANZADO R02

Fecha: 30/09/2026
Issue: #348

Este bloque amplía la foundation R01.
No es certificación.

## 1 · Governance

Fuente:
- ISO 21505:2017 · Guidance on governance
  https://www.iso.org/standard/63578.html

Aprendizaje:
gobernar no es ejecutar cada proyecto.
Es establecer:
- autoridad;
- supervisión;
- decisiones;
- assurance;
- accountability;
- relación entre sponsor, steering/gates y equipos.

Aplicación Iris Green:
- María = Dirección/Product Owner;
- jefaturas = governance operativa dentro de mandato;
- especialistas = autoridad funcional;
- HUMAN QA = gate humano;
- GitHub = registro de decisiones/evidencia.

Mejora:
crear más adelante una **matriz de decision rights**, no solo organigrama.

## 2 · Portfolio Management

Fuente:
- ISO 21504:2022
  https://committee.iso.org/sites/tc258/home/projects/published/iso-21504.html

Aprendizaje:
un portfolio no es simplemente una lista de trabajos: sirve para seleccionar y equilibrar proyectos/programas según estrategia y capacidad.

Aplicación:
Iris Green necesita separar:
- NOW;
- NEXT;
- HOLD;
- RESEARCH;
- FOUNDATION;
- MONETIZATION_FUTURE.

No todos los trabajos técnicamente posibles deben estar activos.

## 3 · Post-project / post-programme evaluation

Fuente:
- ISO 21513:2026
  https://www.iso.org/standard/63585.html

Aprendizaje:
una evaluación posterior no pregunta solo “¿terminó?”.
Evalúa:
- objetivos;
- resultados reales;
- beneficios;
- expectativas futuras;
- eficacia de gobernanza/gestión.

Aplicación:
cuando un Rxx cierre de verdad:
crear evaluación ligera:
`OBJECTIVE / OUTCOME / BENEFIT / GOVERNANCE / LESSON / FOLLOW-UP`.

No usar en microtareas; proporcionalidad.

## 4 · Systems Thinking

Fuente:
- SEBoK v2.14 / Systems Thinking
  https://sebokwiki.org/wiki/What_is_Systems_Thinking%3F
  https://sebokwiki.org/wiki/Guide_to_the_Systems_Engineering_Body_of_Knowledge_(SEBoK)

Aprendizaje:
los resultados del sistema pueden emerger de interacciones, no de una sola pieza.

Aplicación directa:
- A PASS + B PASS ≠ integración PASS;
- agente competente + mala coordinación = sistema fallido;
- demasiadas capas de QA pueden crear latencia y drift;
- más agentes puede aumentar, no reducir, complejidad.

Aura debe buscar:
- límites del sistema;
- dependencias;
- feedback loops;
- efectos secundarios;
- puntos únicos de fallo.

## 5 · Professional Facilitation

Fuente:
- International Association of Facilitators · Core Competencies
  https://iaf-world.org/the-iaf-core-competencies/

Competencias estudiadas:
- crear relaciones colaborativas;
- diseñar procesos adecuados;
- sostener participación;
- guiar hacia resultados útiles;
- mantener conocimiento profesional;
- actitud profesional.

Aplicación:
cuando dos departamentos discrepan:
Aura NO impone una respuesta por jerarquía.
Facilita:
1. pregunta;
2. hechos;
3. mandato de cada departamento;
4. alternativas;
5. criterio;
6. decisión del owner correcto.

## 6 · Collaborative Business Relationships / proveedores

Fuente:
- ISO 44001:2017
  https://www.iso.org/standard/72798.html
- edición 2 DIS en desarrollo en 2026.

Aprendizaje:
las relaciones externas necesitan gestión explícita, no informalidad.

Aplicación Claude/subcontratas:
- alcance;
- interfaces;
- información mínima;
- entregables;
- acceptance;
- IP/licencias;
- confidencialidad/Legal;
- salida/handoff;
- continuidad si proveedor desaparece.

Aura gestiona operación.
Lex gestiona encaje jurídico.

## 7 · AI Governance / AI Risk

Fuente:
- NIST AI RMF 1.0
  https://www.nist.gov/itl/ai-risk-management-framework
- Core: Govern / Map / Measure / Manage
  https://airc.nist.gov/airmf-resources/airmf/5-sec-core/

Aprendizaje:
la gobernanza de IA es transversal y continua.
No basta “modelo funciona”.

Aplicación:
para agentes internos y Sabik:
- GOVERN: roles/policies/accountability;
- MAP: contexto/usuarios/impactos;
- MEASURE: evals/risk/evidence;
- MANAGE: priorizar/tratar/monitorizar.

Aura coordina.
Córtex/Vigía/Axioma/Lex ejecutan su parte experta.

## 8 · Team capacity como diseño sistémico

Fuentes:
- Team Topologies;
- Kanban.

Aprendizaje:
sobrecargar equipos produce más coordinación, más contexto y peor flujo.

Aplicación:
cap 4 no se usa como dogma numérico.
Se valida con:
- WIP real;
- feedback;
- bloqueos;
- revisión;
- context switching;
- necesidad de jefatura adicional.

## 9 · Qué cambia en Aura tras R02

### Antes
“repartir trabajo y vigilar estados”.

### Después
**diseñar un sistema operativo de trabajo** que:
- mantiene estrategia;
- limita WIP;
- asigna autoridad;
- conserva conocimiento;
- gestiona riesgos;
- aprende de incidentes;
- coordina proveedores;
- facilita desacuerdos;
- evalúa resultados;
- adapta estructura.

## 10 · Nuevos artefactos que propongo para más adelante

No crear durante esta jornada salvo decisión de María:

1. `RISK_REGISTER.md`
2. `DECISION_RIGHTS_MATRIX.md`
3. `PORTFOLIO_NOW_NEXT_HOLD.md`
4. `POSTMORTEMS/`
5. `POST_PROGRAMME_EVALUATIONS/`
6. `DEPARTMENT_CONSULTATION_PROTOCOL.md`
7. `SUPPLIER_HANDOFF_STANDARD.md`
8. `AI_GOVERNANCE_MAP.md`

La propuesta se revisará con María antes de añadir burocracia.
