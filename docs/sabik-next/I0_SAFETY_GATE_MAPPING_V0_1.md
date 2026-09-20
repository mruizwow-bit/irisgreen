# I0 · SAFETY GATE → EVENTOS S0 · V0.1

**Fecha:** 20/09/2026  
**Estado:** referencia contractual

## Evidencia histórica

La revisión de seguridad de PR #162 documentó los fallos S-01…S-07 y contiene:
- `tests/fixtures/sabik/review/safety-corpus.review.es.json` (51 casos);
- `04-seguridad-conversacional.md`;
- evidencia de runtime.

Ese corpus se usa como regresión histórica. No convierte el runtime antiguo en implementación normativa.

## Mapeo

| Gate | Condición | Evento S0 solicitado | Acción ordinaria |
|---|---|---|---|
| normal | sin señal de seguridad | ninguno | permitida según contrato |
| uncertain | señal ambigua | RISK_UNCERTAIN | bloqueada |
| confirmed | señal explícita confirmada | RISK_CONFIRMED | bloqueada |
| cleared | respuesta válida al flujo uncertain | RISK_CLEARED | bloqueada en ese turno |
| handoff | S0 ya en risk/uncertain y política exige derivación | HUMAN_HANDOFF | bloqueada |

## Reglas

- el gate corre antes de negación ordinaria;
- el gate analiza la oración completa y no permite que una negación anterior anule una señal explícita posterior;
- entrar en protección invalida pendientes ordinarios;
- `RISK_CLEARED` no ejecuta órdenes ordinarias añadidas a la misma respuesta;
- tras `RISK_CLEARED`, solo puede reanudarse la solicitud original conservada en memoria;
- `PEDIR_AYUDA_HUMANA` con safety normal no equivale a HUMAN_HANDOFF;
- los umbrales de intención ordinaria no se aplican al gate.

## Dataset offline

`human_help` solo se declara disponible si el bundle contiene:
- recurso verificado aplicable, o
- fallback editorial estático aprobado.

No inventar teléfonos, URLs o territorios.
