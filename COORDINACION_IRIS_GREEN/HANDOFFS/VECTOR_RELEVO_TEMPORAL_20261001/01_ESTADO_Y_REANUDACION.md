# VECTOR · A2 · HANDOFF DE RELEVO TEMPORAL POR AGOTAMIENTO DE CHAT

Fecha: 01/10/2026  
Autoridad: María  
Coordinación técnica del relevo: Astra  
Jefatura organizativa: Aura  
Estado: `VECTOR_A2_TEMPORARY_SESSION_REPLACEMENT_READY`

## Motivo

La sesión/chat actual de Vector alcanza repetidamente el límite de conversación.

Consecuencia observada:
- tras un periodo de trabajo reaparece el error de longitud/contexto;
- la sesión pierde continuidad operativa;
- cualquier trabajo que no haya sido preservado en GitHub deja de ser recuperable de forma fiable.

No se clasifica como fallo personal.
Es una incidencia de continuidad de sesión.

## Decisión

Se sustituye **la sesión**, no el puesto.

La plaza sigue siendo:
**Vector · A2 — Web Release & Integration Engineer**.

El relevo temporal ocupa la misma plaza A2.
No existe un segundo Vector trabajando en paralelo.

Regla:
**OLD SESSION PAUSED → HANDOFF CANONICAL → NEW SESSION RESUME GATE → CONTINUE**

El chat antiguo NO debe seguir escribiendo una vez arrancado el relevo.

## Estado verificable al emitir

### A2 vivo
Branch:
`agent2/sabik-iris-r08-20260924`

HEAD:
`8ea50128b490207b4dd5508c3c46692f5be69c87`

### Rama de recovery existente
`vector/full-recovery-all-intake-20261001`

HEAD:
`6f6392f833a4d1d6716ecabec4e192b70d180b0b`

Comparación contra A2:
- merge-base = A2 HEAD `8ea50128...`;
- recovery = 108 commits ahead;
- 0 behind en la comparación observada.

La rama recovery contiene el trabajo R69/recovery acumulado previo, pero **no muestra commits nuevos de producto del 01/10** al emitir este handoff.

No resetearla.
No asumir que representa lo que el chat antiguo estaba intentando hacer hoy.

### Coordinación 01/10 sí registrada

Vector dejó:
- #356 · recovery web integrada;
- orden de carga de paquetes aprobados;
- inventario total de handoffs;
- #358 · revisión experta R65 + R44-A0.

Commit más reciente Vector en coordinación:
`ec6c993229062742473f20334cc2d020511e6165`
`Vector: registrar review experta R65 y R44-A0`.

Esto demuestra coordinación/intake.
NO demuestra cierre técnico del recovery.

## Issues activos

### #356
Estado: OPEN.

Objetivo:
`VECTOR_IRIS_GREEN_FULL_RECOVERY_ALL_PENDING_INTAKE_PREVIEW_READY_FOR_ASTRA_AURA_MARIA`

No consta ese marcador de salida.

No consta preview final de recovery asociada al cierre de #356.

### #358
Estado: OPEN.

Objetivo:
`VECTOR_PACKAGE_REVIEW_R65_R44_READY_FOR_AURA_ASTRA`

Al emitir:
sin respuesta final de Vector.

## Qué NO se considera preservado

Cualquier:
- análisis;
- comando;
- cambio local;
- patch;
- intento;
- decisión;
- integración parcial

que solo exista en el chat antiguo y no esté en GitHub NO se considera evidencia canónica.

No intentar reconstruirlo de memoria.

## Primera tarea del relevo

### 1 · Formación/identidad
Leer:
- `FORMACION/00_EMPIEZA_AQUI.md`
- `FORMACION/A2_VECTOR/00_IDENTIDAD_Y_PUESTO.md`
- `01_PLAN_FORMACION.md`
- `02_PRACTICAS_Y_EXAMEN.md`
- `03_CONTINUIDAD_ENTRE_CHATS.md`
- `04_RUNBOOK_RELEASE_R01.md`
- último `APRENDIZAJE_VECTOR_*.md`
- este handoff.

### 2 · Resume Gate obligatorio
Releer:
- HEAD coordinación vivo;
- A2 vivo;
- recovery branch vivo;
- PR #244;
- PR #341 si continúa;
- #356;
- #358;
- Netlify deploy/preview vigentes;
- Control/Pendientes;
- últimos handoffs recibidos después de este documento.

### 3 · Determinar punto de continuación real

No empezar integrando.

Primero producir:

`VECTOR_RELEVO_RESUME_GATE_REPORT`

con:
- coord SHA;
- A2 SHA;
- recovery SHA;
- PRs;
- deploy IDs;
- qué está ya dentro de recovery;
- qué falta de #356;
- qué falta de #358;
- cualquier commit aparecido desde este handoff.

### 4 · Continuar #358 antes de aplicar R65/R44

R65/R44 están pausados hasta revisión experta.

No aplicar paquetes antes del dictamen.

### 5 · Continuar #356

Después:
- recovery integrada;
- cola aprobada;
- preservación/import;
- build exacto;
- navegador;
- preview aislada;
- handoff a Astra/Aura/María.

## Reglas de continuidad reforzadas

El nuevo Vector debe checkpointar trabajo material con frecuencia.

Como mínimo, después de cada bloque:
- actualizar issue/handoff;
- commit GitHub si existe delta material;
- registrar intento fallido relevante;
- registrar siguiente operación segura.

No esperar al final de una sesión de varias horas.

Regla:
`WORK BLOCK → CHECKPOINT → CONTINUE`.

## Qué hacer cuando el chat se acerque a saturación

Antes de perder contexto:
1. STOP de escritura;
2. commit/preservar todo lo material;
3. actualizar aprendizaje del día;
4. escribir estado exacto;
5. cerrar sesión;
6. abrir nuevo chat;
7. resume gate.

Nunca:
seguir hasta que el cliente fuerce el corte.

## Prohibido

- dos sesiones Vector escribiendo en paralelo;
- resetear A2;
- resetear recovery;
- confiar en memoria del chat anterior;
- asumir trabajo no versionado;
- producción;
- main;
- integrar R65/R44 antes del dictamen #358;
- ocultar gaps bajo un PASS.

## Mensaje de arranque recomendado para el nuevo chat

> Eres el relevo temporal de Vector · A2 — Web Release & Integration Engineer. La sesión anterior quedó pausada por agotamiento de conversación. Empieza leyendo FORMACION/00_EMPIEZA_AQUI.md, FORMACION/A2_VECTOR/, este handoff, #356 y #358. Ejecuta RESUME GATE completo sobre coordinación, A2, recovery, PRs y Netlify. No reconstruyas trabajo del chat anterior. GitHub es la única fuente de verdad. Continúa la misma plaza A2, no trabajas en paralelo con el Vector anterior.

## Marcador

`VECTOR_A2_TEMPORARY_SESSION_REPLACEMENT_READY`
