# I0 · CALIBRATION NO-CONTAMINATION RECORD · V1

## Declaración

La corrida real de calibración V1 no utilizó #173 ni el corpus reservado de validation para construir el ejecutor o seleccionar parámetros.

## Evidencia técnica

El runner:
- carga `tests/development/sabik/i0/development.v0.4.jsonl`;
- carga `tests/calibration/sabik/i0/calibration.v0.4.jsonl`;
- carga el schema v0.4;
- no contiene rutas `tests/evaluation/sabik/i0/validation/**`.

El manifest de ejecución registra:
- `validation_173_used_for_tuning: false`;
- `validation_paths_loaded: []`.

## Accesos de contexto durante esta fase

Antes de fijar el ejecutor se consultaron:
1. metadatos y cuerpo de PR #176, únicamente para comprobar el estado declarado de existencia/no existencia de un ejecutor I0 v0.4;
2. comentarios del issue #174 relacionados con el orden metodológico de calibration/validation.

No se abrieron casos, shards, labels ni resultados del corpus reservado durante esta fase.

## Separación temporal

1. dataset HEAD aceptado y congelado: `08764d2562c445f63a93036e0864f2ca859c1e9f`;
2. ejecutor/configuración congelados antes del sweep: `060d5332e86891abd3c5c853f77bc6d1f2b8d16e`;
3. corrida y evidencia automática: `3abc3c555e48d50323019cbbde0f2e2ecd6687a8`.

No hubo modificación del ejecutor entre 2 y 3.

## Limitación metodológica

El mismo Agente n.º 2 había participado en la preparación V2 de calibration antes de esta fase. La mitigación aplicada fue no consultar de nuevo el dataset calibration durante la construcción del ejecutor de esta corrida y congelar código/configuración antes de ejecutar el sweep. Esta limitación queda declarada para revisión Astra.
