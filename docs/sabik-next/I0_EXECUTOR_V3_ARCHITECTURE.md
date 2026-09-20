# I0 · EXECUTOR V3 · DEVELOPMENT CIEGO

**Fecha:** 20/09/2026  
**Base exacta:** `8ce798447d79eff22caaec15d03105073069e7d8`  
**Estado:** development + calibration V2 consumida como regression; corpus reservado V3 no abierto.

## Principio

V3 aplica:

`normalización → estructura → intención → parámetros → contexto → política`

Las reglas contractuales inequívocas preceden al fallback por similitud.

El score heurístico continúa llamándose `evidence_score`; no es una probabilidad.

## Causas raíz V2 consumidas

### Safety

V2-R1 reconocía un subconjunto demasiado literal de las familias:
- incertidumbre sobre seguridad propia;
- riesgo inmediato;
- cierre/resolución de riesgo;
- petición humana urgente.

Además, la posición lexical de palabras como «riesgo actual» podía vencer erróneamente a una construcción de cierre que las negaba.

### Negación

La negación dependía de listas parciales de conjugaciones y podía:
- no alcanzar el verbo objetivo;
- propagarse a otra cláusula;
- perder una continuación positiva;
- clasificar el intent correcto pero ejecutar la acción negada.

### Multiacción

Los problemas observados pertenecían a cuatro familias:
- coincidencias por substring entre cláusulas;
- vocabulario morfológico incompleto;
- repetición/continuación confundida con ATRAS/SIGUIENTE;
- diferencia entre acción perdida/extra y parámetro opaco incorrecto.

### insufficient

La política era correcta una vez clasificado el intent, pero el parser no reconocía de forma general suficientes expresiones de human-help normal.

## Safety V3

El gate:
1. descarta contexto explícitamente no personal;
2. reconoce human-handoff por familia «recurso/persona/apoyo/asistencia humana» + peligro/urgencia actual;
3. reconoce confirmed por urgencia, inminencia, autodaño explícito o situación peligrosa actual;
4. reconoce uncertain por duda/preocupación/temor + seguridad propia;
5. reconoce cleared por marcador de resolución posterior;
6. evita que un sintagma de riesgo dentro de «ya no ... riesgo» reactive confirmed.

Precedencia:
- un `cleared` posterior puede cerrar una señal previa;
- sin cierre posterior, handoff/confirmed explícitos prevalecen sobre uncertain;
- una mención humana explícitamente no urgente no activa Safety.

## Negación V3

La negación opera dentro de fronteras de cláusula.

Separadores:
- puntuación;
- y;
- pero;
- aunque;
- luego;
- después;
- además;
- mientras.

V3 mantiene el command semántico y marca únicamente ese command como negado.

Se añadieron familias gramaticales para:
- cambio de texto;
- movimiento;
- paso a paso;
- vista sencilla;
- ATRAS;
- repetición;
- DETENER.

Una acción negada queda `blocked_negation`; otras acciones positivas del mismo turno permanecen.

## Multiacción V3

- máximo 3 commands;
- detección por cues con fronteras de palabra;
- parámetros asociados al command detectado;
- navegación al final;
- política por acción heredada de V2-R1;
- búsqueda + acción conserva ambas capas;
- repeat no genera ATRAS;
- «a continuación» no genera SIGUIENTE por substring;
- command plan correcto no puede perder ni ganar acciones por otra cláusula.

La métrica distingue:
- omitida;
- extra;
- misma action type con parámetros incorrectos.

## insufficient V3

Las condiciones contractuales siguen siendo:

1. búsqueda válida + retrieval vacío → insufficient;
2. DESHACER sin lastAction → insufficient;
3. human-help normal offline sin recurso/fallback aprobado → insufficient.

Se amplía únicamente la **clasificación general** de human-help:
- ayuda humana;
- asistencia humana;
- apoyo humano;
- orientación humana;
- recurso humano;
- contacto con persona/asistencia humana.

No existe excepción por corpus.

## Clasificación / parámetros

Cambios generales:
- cues con fronteras de palabra, evitando substrings accidentales;
- ampliación morfológica de verbos ya pertenecientes a intents contractuales;
- repetición y navegación discriminadas estructuralmente;
- contextId `current` si existe flujo/contexto actual;
- query canonicalization de V2-R1 se conserva;
- nearest-neighbour queda únicamente como fallback.

## Gaps contrato/dataset documentados

### flowId opaco

Tres casos de regression consumido esperan un `flowId` que no está presente en su contexto. El ejecutor puede recuperar correctamente STEP_NEXT, pero no derivar de forma contractual ese identificador opaco.

V3 no memoriza el valor esperado.

La métrica lo registra como **parámetro incorrecto**, no como acción omitida + acción extra.

### ResultKind búsqueda + acción

Development y regression consumido contienen distinto ResultKind esperado para estructuras equivalentes de búsqueda + acción reversible.

El contrato v0.4 enumera ResultKind pero no fija una regla suficiente para resolver esta diferencia.

V3 adopta la regla funcional:
- si hay acción ejecutada → `action_result`;
- búsqueda sin acción → `response`.

La discrepancia de dataset queda documentada, no parcheada.

## Anti-hardcode

El checker automático:
- rechaza IDs `I0-DEV-*`;
- rechaza IDs `I0-CAL-*`;
- compara el ejecutor con utterances largas exactas de development;
- compara con utterances largas de calibration V2 consumida;
- rechaza marcadores de tablas de excepciones caso a caso.

Las enumeraciones legítimas de intents, riesgos y vocabulario contractual no se consideran excepciones.

## Parámetros

Actualmente fijo:
- `fallback_accept_score_min = 0.34`;
- precedencia Safety;
- scope de negación;
- política por acción;
- navegación final.

Posible candidato a futura calibración:
- `fallback_accept_score_min`.

No se define todavía grid V3.

## Aislamiento

Esta fase:
- no ejecuta calibration V3;
- no accede al corpus reservado V3;
- no accede a validation reservada;
- no modifica development;
- no modifica calibration V2 consumida;
- no modifica schema.
