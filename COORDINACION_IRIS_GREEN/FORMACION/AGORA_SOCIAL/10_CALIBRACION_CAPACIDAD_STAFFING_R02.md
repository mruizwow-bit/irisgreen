# ÁGORA · CALIBRACIÓN DE CAPACIDAD Y STAFFING R02

Fecha: 01/10/2026
Estado: AGORA_CAPACITY_CALIBRATION_R02_TRAINING

## 1 · Objetivo

Detectar necesidad de apoyo antes de que se degrade la relación comunitaria.

No usar:
- número de followers como ratio de staffing;
- sensación de cansancio de un único día como única evidencia;
- objetivo diario de altas como sustituto de capacidad.

## 2 · Métricas de flujo

Por sesión/jornada operativa registrar:

DEMAND_IN
- conversaciones nuevas;
- respuestas entrantes;
- revisiones que vencen;
- nuevos casos de moderación;
- nuevas relaciones aceptadas.

DELIVERY_OUT
- conversaciones cerradas;
- revisiones completadas;
- moderaciones resueltas/escaladas;
- relaciones actualizadas con next step.

WIP
- casos EN_PROGRESO;
- relaciones con acción pendiente.

BACKLOG
- trabajo comprometido pendiente.

AGE
- edad del caso más antiguo;
- mediana/P90 de edad cuando haya volumen suficiente.

## 3 · Señal principal

Demanda sostenida > capacidad de entrega
junto con
backlog creciente + antigüedad creciente
es una señal fuerte de capacidad insuficiente.

Un pico aislado no basta.

## 4 · Calidad como métrica de capacidad

Registrar también:
- respuestas duplicadas;
- contexto perdido;
- comentario demasiado genérico que requiere corrección;
- seguimiento vencido;
- persona que debe repetir información ya dada;
- errores de idioma;
- moderación mal priorizada;
- discovery/listening cancelado repetidamente por atención reactiva.

Si baja calidad aunque el backlog parezca controlado:
la capacidad también puede ser insuficiente.

## 5 · Saturación

No buscar 100 % de utilización.

Necesitamos slack operativo para:
- P0/P1 inesperados;
- leer contexto;
- investigación;
- coordinación;
- descansos tras moderación sensible;
- handoffs;
- revisión de calidad.

Si toda la jornada está comprometida antes de empezar:
no existe capacidad de absorber variabilidad.

## 6 · Línea base antes de umbral

Antes de fijar números:
medir varias jornadas/sesiones comparables.

Para cada tipo de trabajo obtener:
- volumen medio y rango;
- tiempo aproximado de atención;
- tasa de cierre;
- backlog final;
- edad;
- errores/rework.

Después Brújula/María pueden acordar umbrales internos.

## 7 · Trigger de escalado cualitativo

Ágora declara CALIDAD_RELACIONAL_EN_RIESGO cuando existe una tendencia sostenida de una o más:
- DEMAND_IN > DELIVERY_OUT;
- BACKLOG crece;
- AGE crece;
- P2 deja de atenderse en ventanas razonables;
- revisiones vencen;
- QA detecta caída de personalización;
- P0/P1 desplazan de forma permanente toda la relación normal;
- no queda tiempo para listening/discovery;
- trabajo fuera de horario se vuelve estructural.

## 8 · Diagnóstico antes de contratar

Preguntar:
1. ¿falta capacidad humana o hay trabajo duplicado?
2. ¿falta una herramienta de routing/CRM?
3. ¿el problema es moderación sensible?
4. ¿el problema es discovery/listening?
5. ¿hay tareas que deben automatizarse sin tocar la relación?
6. ¿el volumen es temporal o sostenido?

## 9 · Tipo de refuerzo

Según diagnóstico:
- COMMUNITY_RELATIONSHIPS;
- MODERATION_CARE;
- SOCIAL_LISTENING_ANALYTICS;
- DISCOVERY_GROWTH;
- o combinación.

## 10 · Evidencia actual

El seguimiento vigente permite conocer relaciones, próximas revisiones y estado.
Falta una línea base de varias jornadas con tiempos/throughput/backlog age.

Por tanto:
NO hay todavía evidencia suficiente para fijar cuántos Community Managers necesita Iris Green a escala futura.

Sí existe obligación de Ágora de avisar cuando las métricas muestren deterioro.

## 11 · Fuentes

- Kanban University · Official Kanban Guide: WIP, lead time, delivery rate y flujo sostenible.
- Atlassian · backlog growth, median work item age, queues y priority groups.
- Sprout Social · first response, workload y personalización en social care.