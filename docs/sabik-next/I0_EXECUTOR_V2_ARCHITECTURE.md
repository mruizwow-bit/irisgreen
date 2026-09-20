# I0 · EXECUTOR V2 · ARQUITECTURA DEVELOPMENT-ONLY

**Fecha:** 20/09/2026  
**Base:** `04569282ab3637a60ecccb002c8e49b8c4f3cd2a`  
**Estado:** corrección estructural previa a cualquier nueva calibración

## Alcance

Esta fase no ejecuta calibration ni validation.

Fuentes permitidas:
- contrato I0 v0.4;
- proyección S0/B3;
- development congelado;
- métricas agregadas de la corrida V1;
- pruebas sintéticas derivadas del contrato.

No se modifica:
- development;
- calibration;
- schema;
- validation #173.

## Causas raíz de V1

### 1. Riesgo global del plan

V1 reducía todas las acciones del turno a una sola clase:
- `local_reversible`; o
- `local_with_loss`.

Una acción with_loss elevaba el plan completo y la política decidía «todas o ninguna».

### 2. Construcción y política mezcladas

Una baja decisión de ejecución podía convertir un command plan correcto en un action plan vacío.

### 3. Multiacción

La clasificación podía reconocer varios comandos, pero la decisión global de threshold eliminaba acciones válidas. V1 obtuvo 0/40 action exact.

### 4. Negación

La negación se trataba demasiado cerca del turno completo. V2 la liga al comando/acción correspondiente.

### 5. Score mal denominado

V1 exponía valores como `confidence` aunque provenían de una heurística de similitud. V2 los denomina `evidence_score`. No representan probabilidad.

### 6. Margin inerte

El margin V1 observado nunca entró en la zona del grid. V2 elimina top1-top2 margin del diseño actual.

## Pipeline V2

```text
texto
  ↓
Safety Gate contractual
  ↓
clasificación de comandos
  ↓
resolución de parámetros
  ↓
construcción de acciones por comando
  ↓
política por acción
  ↓
orden contractual
  ↓
ResultKind + S0 + B3
```

Las cuatro capas se registran por separado:

1. **clasificación**: command plan;
2. **construcción**: action proposal;
3. **política**: decisión individual por acción;
4. **interacción**: result kind, eventos y B3.

## Representación por acción

Cada acción conserva:

```json
{
  "origin_command_index": 0,
  "intent": "CAMBIAR_MOVIMIENTO",
  "parameters": {"motion": "reduced"},
  "risk": "local_reversible",
  "score": 1,
  "score_kind": "contract_exact",
  "decision": "execute",
  "reason": "clear_independent_reversible",
  "action": {}
}
```

## Política por riesgo

### local_reversible

Si el comando está resuelto de forma inequívoca:
- se ejecuta;
- no se bloquea porque otra acción del mismo plan sea with_loss;
- no se aplica un threshold global al plan.

### local_with_loss

Se evalúa individualmente.

Bloqueos contractuales:
- `unsentText=true`;
- `pendingClarification`;
- clasificación fallback no resuelta explícitamente.

Una acción with_loss bloqueada no elimina una reversible independiente.

### Confirmación pendiente

`CONFIRMAR_ACCION` ejecuta exactamente la acción tipada almacenada en `pendingConfirmation`.

## Multiacción

- máximo 3 comandos;
- acción construida por comando;
- política por acción;
- acciones reversibles independientes sobreviven a un bloqueo de otra acción;
- navegación se ordena al final;
- una acción omitida por política queda registrada como `blocked_*`, no desaparece silenciosamente.

## Negación

La clasificación conserva el comando semántico y marca su alcance con `negated=true`.

Ejemplo:

`No reduzcas el movimiento`

se representa como comando `CAMBIAR_MOVIMIENTO{reduced}` negado, con:
- acción propuesta conocida;
- decisión `blocked_negation`;
- cero ejecución.

Esto evita resolver negación haciendo pasivo todo el turno.

## Safety

Safety se evalúa antes del parser ordinario.

Un gate no-normal:
- produce cero comandos ordinarios;
- produce cero acciones ordinarias;
- emite exclusivamente el evento S0 contractual;
- no pasa por política de acciones.

## Insufficient

Se conserva como regla contractual previa a la ejecución:
- retrieval vacío;
- undo sin `lastAction`;
- human-help offline sin recurso/fallback verificado.

Resultado:
- `insufficient`;
- cero acciones;
- B3 `PRESENTE`.

## Score V2

Nombre: **evidence_score**.

Semántica:
- fuerza de evidencia del parser o similitud de fallback;
- rango normalizado para diagnóstico;
- **no es probabilidad**;
- no se presenta como confidence calibrada.

Tipos:
- `contract_exact`;
- `contract_context`;
- `contract_correction`;
- `development_similarity`;
- `development_context_resolution`.

## Parámetros fijos

Por contrato, no calibrables:
- precedencia Safety;
- alcance de negación;
- ejecución de reversible inequívoca;
- bloqueo with_loss por pérdida real;
- navegación al final;
- separación classification/construction/policy/result.

## Parámetro provisional potencialmente calibrable

`fallback_accept_score_min = 0.34`

Se usa únicamente para decidir si el fallback development puede producir un command plan.

No se calibrará en esta fase.

El runner development:
1. medirá la distribución de scores fallback;
2. generará candidatos basados en cuantiles reales;
3. calculará cuántas decisiones cambiaría cada candidato;
4. no elegirá un valor nuevo.

Un parámetro con cero cambios de decisión se declarará inerte y no será candidato de una futura corrida.

## Pruebas contractuales

`tools/test-sabik-i0-executor-v2.mjs` cubre:
- reversible simple;
- with_loss;
- reversible + reversible;
- reversible + with_loss;
- navegación al final;
- parcialidad permitida;
- parcialidad bloqueada;
- negación;
- positivo de negación;
- insufficient;
- Safety;
- aclaración;
- lastAction;
- pendingClarification;
- unsentText;
- confirmación;
- capability boundary;
- contexto de seguridad no personal;
- semántica de score.

Estas pruebas no contienen casos de calibration y no sustituyen al corpus development.
