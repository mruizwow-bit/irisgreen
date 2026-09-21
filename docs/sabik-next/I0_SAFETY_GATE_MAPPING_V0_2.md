# I0 · SAFETY GATE → EVENTOS S0 · V0.2

**Fecha:** 20/09/2026  
**Estado:** contrato I0  
**Sustituye:** `I0_SAFETY_GATE_MAPPING_V0_1.md`

## Evidencia histórica

PR #162 documenta S-01…S-07 e incluye el corpus histórico de seguridad de 51 casos. Se usa como regresión, no como runtime normativo.

## Mapeo

| Gate | Evento S0 | Acción ordinaria |
|---|---|---|
| normal | ninguno | permitida según contrato |
| uncertain | RISK_UNCERTAIN | bloqueada |
| confirmed | RISK_CONFIRMED | bloqueada |
| cleared | RISK_CLEARED | bloqueada en ese turno |
| handoff | HUMAN_HANDOFF | bloqueada |

## Reglas de entrada en safety

- el gate corre antes de negación ordinaria;
- analiza la oración completa;
- una negación anterior no anula una señal explícita posterior;
- entrar en protección invalida aclaraciones, confirmaciones y lista de opciones;
- el gate puede separar y conservar únicamente una cláusula ordinaria independiente.

Ejemplo:
- `pon el texto más grande y no quiero seguir`
  - safety: uncertain;
  - cláusula ordinaria separable: `pon el texto más grande`;
  - en el turno inicial no se ejecuta.

## RISK_CLEARED

La respuesta que despeja seguridad:
- solicita `RISK_CLEARED`;
- no ejecuta órdenes ordinarias añadidas a esa misma respuesta.

Después:
- la frase de riesgo original **no se reevalúa** ni se envía al parser ordinario;
- si el gate había separado una cláusula ordinaria independiente, solo esa cláusula entra una vez en `postSafetyResolved`;
- `postSafetyResolved` salta el Safety Gate porque la cláusula ya fue separada antes de la aclaración;
- si no había cláusula ordinaria, se devuelve respuesta abierta sin acción.

Ejemplos:
- `ya no puedo más` → cleared → respuesta sin acción.
- `pon el texto más grande y no quiero seguir` → cleared → procesa una vez `pon el texto más grande`.
- `quiero dejarlo todo` → cleared → nunca se convierte en `DETENER{assistant}`.

## HUMAN_HANDOFF vs human_help normal

`PEDIR_AYUDA_HUMANA` con safety normal no emite HUMAN_HANDOFF.

HUMAN_HANDOFF solo aparece desde flujo safety compatible con S0.

## Umbrales

Los umbrales de intención ordinaria no se aplican al gate.

## Offline

Human help solo disponible si el bundle contiene recurso verificado o fallback editorial aprobado.
