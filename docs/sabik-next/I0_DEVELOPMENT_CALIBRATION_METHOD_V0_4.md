# I0 · corpus de development y calibration independientes · v0.4 · V2

## Separación

- development: **400** casos;
- calibration: **200** casos;
- validation #173: **0 casos incluidos**;
- validation #173: no se ejecuta para elegir reglas ni umbrales.

Validation se consultó únicamente por texto durante el control anti-contaminación. Permanece en PR #176 @ `33cd63089416ccdf82fddea4415d3afbec6aa05a`.

## Correcciones Astra V2

### B3

Se aplica `I0_S0_B3_PROJECTION_V0_2.md`:
- `clarification` → PRESENTE;
- `ASK_CLARIFICATION` → PRESENTE;
- `insufficient` → PRESENTE;
- CONFIRMAR solo puede representar un resultado concreto no perceptible cuando el acuse aporta información útil.

Resultado: **0** aclaraciones con CONFIRMAR y **0** usos de CONFIRMAR en el corpus V2.

### Clasificación y ejecución

Se elimina el campo ambiguo `should_execute` y se separan dos expectativas:
- `should_classify`: existe un plan de clasificación válido;
- `should_execute_actions`: existen acciones ordinarias ejecutables.

Esto permite representar correctamente búsquedas, respuestas, controles S0 y otros casos con plan válido pero sin acción ordinaria.

### Negación crítica

`critical_negation` se desdobla en:
- `critical_negation_negative`: miembro negado/contrario;
- `critical_negation_positive_control`: control positivo.

El harness solo cuenta inversión cuando el miembro negativo produce una salida ejecutable prohibida. Un control positivo correcto no se penaliza.

### Multiacción

Cobertura total: **40** casos (**25 development + 15 calibration**).

El harness evalúa el plan completo:
- todos los comandos y sus parámetros;
- orden;
- acciones completas, riesgo y parámetros;
- parcialidad esperada;
- navegación al final;
- eventos S0 y ResultKind.

### Predicciones de calibration

Antes del sweep se exige:
- exactamente **200/200** IDs;
- IDs únicos;
- cero extras;
- cero faltantes;
- `confidence_top1` y `confidence_top2` finitas, en [0,1].

`--self-test-coverage` verifica el guard estructural y confirma 200/200; además prueba que missing, duplicate, extra y non-finite son rechazados. Los registros de esa prueba se derivan del corpus solo para validar el contrato de entrada: **no son predicciones de modelo y no producen tuning**.

### ResultKind insufficient

Cobertura V2:
- development: **3**;
- calibration: **2**.

Incluye búsqueda válida sin fuentes locales, undo sin `lastAction` y human-help sin recurso verificado offline.

### Schema y validator contractual

`i0-layered-case-v0.4.schema.json` usa `oneOf` discriminado:
- **18** variantes de IntentCommand de §5;
- **12** variantes de SabikAction que cubren los 11 tipos de §6 y discriminan RESET por riesgo/alcance.

El validator consume el JSON Schema y además verifica:
- 400/200 exactos e IDs secuenciales;
- parámetros cerrados por intent;
- tipo, riesgo y parámetros por acción;
- proyección B3;
- clasificación ↔ ejecución;
- negación crítica;
- multiacción y navegación al final;
- cobertura `insufficient`;
- manifests, stats, bytes, SHA-256 y Git blob.

Validación contractual V2: **PASS**.

### Anti-contaminación

Resultado ejecutado:
- DEV↔CAL sospechosos: **0**;
- sospechosos no autorizados contra validation: **0**;
- residuales autorizados: **6**, todos ligados a `astra_required_literal`;
- exactos autorizados: **5**;
- variante autorizada: **1**.

## Identidad V2

Development:
- SHA-256 `c388607d55c5c8daef721217e49f01c0dd7e17d81c27af2f6e76f3c44cca97fb`
- Git blob `c4e683f587f539fd59f47044b2bfeff883b1facb`

Calibration:
- SHA-256 `ffc63e76eadbac6e975f9792e906913585bcbf53806d7616dc385481145b373f`
- Git blob `331ab54a31842b0ea04f5816f5f89f2e1b351b68`

Schema:
- SHA-256 `3bbfcd7dfd8473b1a6366a664ddd98d7c94c08dafa6553d7879aa7b693a3edc8`
- Git blob `89ddb4c0145b04ea72b57d70b0fd36517854af1a`

## Alcance

No se implementa Core definitivo. No se toca `main`, `sabik-preview`, producción, Netlify, S0, S1, B3, voz ni S2. #174 permanece abierto y #173 no se usa para tuning.
