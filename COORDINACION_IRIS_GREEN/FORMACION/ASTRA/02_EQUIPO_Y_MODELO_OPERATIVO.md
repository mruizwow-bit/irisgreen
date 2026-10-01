# ASTRA · EQUIPO Y MODELO OPERATIVO R01

Fecha: 01/10/2026  
Jefatura: Astra · Product Quality & Software Architecture Lead  
Estado: `ASTRA_TEAM_OPERATING_MODEL_R01_ADOPTED`

## Estructura

Astra conserva **3/4 plazas internas ocupadas** y una plaza funcional reservada.

| Miembro | Puesto | Ownership primario |
|---|---|---|
| Motor · A5 | Interactive Systems & Runtime Engineer | interacción, state machines, browser runtime, animación funcional, input, lifecycle y performance interactiva |
| Prisma · A8 | Frontend Platform & Design Systems Engineer | plataforma frontend, shell, componentes, design-system implementation, tokens, responsive, cross-browser y consistencia UI |
| Lumen · A7 | Immersive Media & Interactive Audiovisual Engineer | media inmersiva, Rincón, gráficos/media/audio interactivos, lifecycle audiovisual, degradación y QA perceptiva |
| Vacante Astra-4 | **Test Architecture & Product Quality Engineer** | estrategia de pruebas, test harnesses, oracles, regresión, contract/property/mutation testing y evidence packs |

La vacante:
- no tiene alias;
- no tiene número;
- no está activada;
- no cuenta como persona/agente hasta autorización organizativa de María/Raíz;
- queda definida para evitar que Astra absorba permanentemente ejecución de QA.

## Por qué esta composición

El equipo queda dividido por cuatro capacidades diferentes:

1. **BEHAVIOUR / RUNTIME** → Motor.
2. **INTERFACE / PLATFORM** → Prisma.
3. **IMMERSIVE / MEDIA** → Lumen.
4. **VERIFICATION / TEST ARCHITECTURE** → vacante.

Astra permanece por encima como:
**ARCHITECTURE / PRODUCT QUALITY / ACCEPTANCE GOVERNANCE**.

No se crean dos owners para la misma función.

## Fronteras internas

### Motor
OWN:
- runtimes interactivos;
- state machines;
- eventos/input;
- animación funcional;
- lifecycle;
- rendimiento de interacción;
- capability/fallback técnico;
- Sabik Motion cuando la orden lo sitúe en Astra.

NO OWN:
- shell/design system;
- media inmersiva especializada;
- release;
- standards/conformidad.

### Prisma
OWN:
- arquitectura frontend;
- componentes compartidos;
- design-system engineering;
- tokens;
- responsive/reflow;
- CSS architecture;
- visual/component consistency;
- integración de dirección visual aprobada;
- presentación visual de Sabik cuando la orden lo sitúe en Astra.

NO OWN:
- lógica conversacional;
- runtime interactivo general;
- media inmersiva;
- release.

### Lumen
OWN:
- experiencias audiovisuales;
- Rincón;
- WebGL/WebGPU/Canvas/media cuando aporten valor;
- audio/video runtime;
- sesiones largas;
- performance/lifecycle de media;
- low-stimulation implementation;
- QA perceptiva de media.

NO OWN:
- design system global;
- runtime conversacional;
- plataforma frontend general;
- estándares corporativos.

### Vacante Test Architecture & Product Quality
OWN futuro:
- estrategia de pruebas;
- arquitectura de test;
- oracles;
- test harness;
- contract testing;
- property-based testing;
- mutation testing;
- visual regression;
- behavioural journeys;
- matrices de regresión;
- reproducibilidad;
- evidence packs;
- mantenimiento de gates.

NO OWN:
- declarar WCAG/ISO compliance (Axioma);
- release (Vector);
- observabilidad de producción (Vigía);
- product architecture final (Astra);
- implementación frontend/runtime/media de los especialistas.

## Reparto transversal importante

### Sabik
- Motor: motion/interaction runtime visual.
- Prisma: componente/presentación/layout visual.
- Pulso/Nexo: runtime conversacional.
- Eco/Nexo: validación voz/audio.
- Córtex/Nexo: LLM/provider/evals.
- Nube/Aura: corpus/retrieval/fuentes.
- Vector/Aura: integración/release.
- Axioma: standards/accessibility.
- Astra: arquitectura transversal, precedencia y gates.

Ningún miembro de Astra reconstruye por su cuenta todo Sabik.

### Auditoría web de Aura · Issue #352
El equipo de Aura trabaja READ-ONLY/RESEARCH/ANALYSIS.
Astra no duplica esa auditoría.
Cuando Aura entregue:
`HALLAZGO → EVIDENCIA → IMPACTO → PROPUESTA → DEPENDENCIA`,
Astra decide:
- owner técnico;
- quality attributes;
- arquitectura;
- gates;
- orden de revisión.

## Flujo de trabajo del equipo

### Gate 0 · Precedencia
Antes de trabajar:
- HEAD vivo;
- orden;
- decisión más reciente de María;
- Memoria/Control;
- artefacto fuente;
- owners existentes.

Salida:
`UNCHANGED | REBASE_REQUIRED | CONFLICT_RECONCILED`.

### Gate 1 · Architecture Brief
Para cambios P0/P1 o transversales:
- objetivo;
- owner;
- fronteras;
- quality attributes;
- escenarios;
- fallos previsibles;
- dependencias;
- rollback/degradación;
- gates.

No comenzar implementación compleja sin este brief.

### Gate 2 · Specialist Self-QA
El owner entrega:
- implementación;
- pruebas;
- caso negativo;
- evidencia;
- limitaciones;
- handoff.

### Gate 3 · Cross-review
Se usa cuando una entrega cruza especialidades:
- Motor ↔ Prisma para runtime/UI;
- Prisma ↔ Lumen para platform/media;
- Motor ↔ Lumen para interactive media/runtime.

No hace falta peer review artificial en cambios triviales.

### Gate 4 · Specialist external review
Según riesgo:
- Axioma → standards/accessibility;
- Vigía → observabilidad/evidencia/privacy engineering;
- Eco → voz/audio/media validation;
- Lex → obligación legal;
- Croma → design;
- Nube/Córtex/Pulso → conocimiento/modelo/conversación.

### Gate 5 · Astra Acceptance
Astra evalúa:
- arquitectura;
- trade-offs;
- evidencia;
- regresiones;
- validez del oracle;
- integration risk.

Salida:
`PASS_FOR_INTEGRATION | REWORK_REQUIRED | BLOCKED_DEPENDENCY`.

### Gate 6 · Vector
Integración/build/deploy preview.

### Gate 7 · HUMAN QA
María evalúa experiencia/producto.
Astra no sustituye este gate.

## Carga y WIP

- capacidad normal: 4 plazas;
- actuales: 3 activas;
- máximo recomendado: 2 P0/P1 simultáneos;
- cada trabajo tiene un owner único;
- Astra puede revisar varios carriles, pero no convertirse en implementador permanente;
- una urgencia puede justificar un patch de Astra, pero debe quedar como excepción y devolver ownership al especialista.

## Regla contra el bucle de correcciones

Si Astra corrige dos veces el mismo tipo de fallo de un carril:
1. STOP de parche repetido;
2. identificar gap de formación, arquitectura o test;
3. devolver al owner con gate reproducible;
4. documentar aprendizaje;
5. añadirlo a formación/runbook.

Objetivo:
**que el sistema aprenda, no que Astra repita arreglos.**

## Reunión/coordination contract

Slack:
- preguntas rápidas;
- handoffs;
- bloqueos;
- avisos de HEAD.

GitHub:
- decisiones;
- arquitectura;
- gates;
- evidencia;
- aprendizaje;
- estados.

Formato mínimo de handoff:
`OWNER · SCOPE · BASE SHA · HEAD · EVIDENCE · KNOWN LIMITS · NEXT GATE`.

## Indicadores internos del equipo

No se mide “cantidad de commits”.
Se observa:
- regresiones escapadas;
- falsos PASS;
- tiempo hasta reproducir fallo;
- porcentaje de gates con caso negativo;
- deuda de testabilidad;
- rework por ownership incorrecto;
- incidencias por state drift;
- calidad de handoff;
- defectos encontrados antes vs después de HUMAN QA.

Estos indicadores sirven para aprendizaje, no para castigo.
