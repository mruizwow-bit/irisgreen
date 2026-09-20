# I0_CALIBRATION_RUN_READY_V1

**Fecha:** 20/09/2026  
**Fase:** I0 · calibración real de umbrales  
**Estado:** corrida completada y auditada; no es validación independiente ni production ready.

## 1. Base congelada

- PR: #177
- dataset HEAD aceptado: `08764d2562c445f63a93036e0864f2ca859c1e9f`
- source commit del ejecutor, previo al sweep: `060d5332e86891abd3c5c853f77bc6d1f2b8d16e`
- results commit automático: `3abc3c555e48d50323019cbbde0f2e2ecd6687a8`
- development: 400 casos
- calibration: 200 casos
- schema: v0.4

SHA-256 congelados:
- development: `c388607d55c5c8daef721217e49f01c0dd7e17d81c27af2f6e76f3c44cca97fb`
- calibration: `ffc63e76eadbac6e975f9792e906913585bcbf53806d7616dc385481145b373f`
- schema: `3bbfcd7dfd8473b1a6366a664ddd98d7c94c08dafa6553d7879aa7b693a3edc8`

Los hashes fueron verificados por el runner antes de ejecutar. Los datasets no se modificaron.

## 2. Ejecución reproducible

Runtime real:
- Node: `v22.23.2`
- Linux x64
- aleatoriedad: no
- seed: no aplica

Comando:

`node tools/run-sabik-i0-calibration-v1.mjs --config config/sabik/i0/calibration-run-v1.json --output reports/sabik/i0/calibration-v1`

GitHub Actions:
- workflow: `Sabik I0 calibration V1`
- run: `35507592859`
- conclusión: **success**

Predicciones reales:
- development: 400/400, 400 IDs únicos
- calibration: 200/200, 200 IDs únicos, 0 faltantes, 0 extras

## 3. Ejecutor congelado antes del sweep

`i0-reference-v1`:
- clasificador nearest-neighbour léxico-contextual;
- entrenamiento: development solamente;
- pesos fijos antes del sweep: texto 0.78, contexto 0.22;
- development evaluado leave-one-out;
- reglas contractuales para Safety Gate, negación, insufficient y construcción de acciones;
- calibration no se usa para crear reglas durante la corrida: solo para evaluar candidatos y seleccionar umbrales.

## 4. Grid y criterio

Candidatos: **1296**.

local_reversible:
- top1: 0.80, 0.85, 0.88, 0.90, 0.92, 0.94
- margin: 0.08, 0.10, 0.12, 0.15, 0.18, 0.20

local_with_loss:
- top1: 0.92, 0.94, 0.96, 0.97, 0.98, 0.99
- margin: 0.12, 0.15, 0.18, 0.20, 0.22, 0.25

classify_floor fijo: 0.70.

Criterio lexicográfico:
1. minimizar falsos positivos de ejecución;
2. minimizar inversiones de negación;
3. minimizar errores de Safety Gate;
4. minimizar errores local_with_loss;
5. minimizar errores del plan de acciones;
6. minimizar aclaraciones innecesarias;
7. minimizar abstenciones;
8. maximizar casos completamente correctos.

Todos los candidatos se conservan en `reports/sabik/i0/calibration-v1/candidates.jsonl`.

## 5. Umbrales seleccionados

- classify_floor: **0.70**
- local_reversible: **top1 0.88 · margin 0.08**
- local_with_loss: **top1 0.92 · margin 0.12**

Score de selección: `[0,1,9,18,67,74,4,-54]`.

### Anomalía de identificabilidad

Hay **216 candidatos empatados** con el mejor score. El dato identifica `local_reversible.top1=0.88`, pero no distingue:
- ningún margin reversible del grid;
- ningún top1 local_with_loss del grid;
- ningún margin local_with_loss del grid.

Los valores 0.08 / 0.92 / 0.12 son el desempate determinista por orden del grid, no evidencia de superioridad estadística. Este hecho queda registrado y no se oculta.

## 6. Development · leave-one-out

Casos: **400**  
Correctos completos: **103**  
Incorrectos completos: **297**  
Accuracy completa: **25.75%**

Clasificación:
- command-plan exact: 254/400 = **63.50%**
- TP 324 · FP 26 · FN 9 · TN 41
- precision **0.9257**
- recall **0.9730**
- F1 **0.9488**

ResultKind:
- exact: 205/400 = **51.25%**

Safety Gate:
- exact por gate: 394/400 = **98.50%**
- binario riesgo/no-riesgo: TP 21 · FP 2 · FN 3 · TN 374
- precision 0.9130 · recall 0.8750 · F1 0.8936

Ejecución:
- action-plan exact: 215/400 = **53.75%**
- TP 43 · FP 1 · FN 170 · TN 186
- precision **0.9773**
- recall **0.2019**
- F1 **0.3346**
- acciones omitidas 202 · extra 15 · incorrectas 13

Decisiones:
- classify 127
- clarify 198
- execute 44
- insufficient 6
- safety 23
- abstain 2

Abstención: **0.50%**  
Aclaración: **49.50%**

Confidence top1:
- min 0.7800 · p10 0.8045 · p50 0.8486 · p90 0.9237 · max 0.9990 · media 0.8571

Margin:
- min 0.25365 · p10 0.25766 · p50 0.26780 · p90 0.35309 · max 0.44300 · media 0.28850

## 7. Calibration

Casos: **200**  
Correctos completos: **54**  
Incorrectos completos: **146**  
Accuracy completa: **27.00%**

Clasificación:
- command-plan exact: 113/200 = **56.50%**
- TP 135 · FP 28 · FN 1 · TN 36
- precision **0.8282**
- recall **0.9926**
- F1 **0.9030**

ResultKind:
- exact: 117/200 = **58.50%**

Safety Gate:
- exact por gate: 191/200 = **95.50%**
- binario riesgo/no-riesgo: TP 14 · FP 0 · FN 6 · TN 180
- precision 1.0000 · recall 0.7000 · F1 0.8235

Ejecución:
- action-plan exact: 133/200 = **66.50%**
- TP 8 · FP 0 · FN 61 · TN 131
- precision **1.0000**
- recall **0.1159**
- F1 **0.2078**
- acciones omitidas 77 · extra 6 · incorrectas 6

Decisiones:
- classify 57
- clarify 113
- execute 8
- insufficient 4
- safety 14
- abstain 4

Abstención: **2.00%**  
Aclaración: **56.50%**

Confidence top1:
- min 0.79009 · p10 0.79560 · p50 0.83500 · p90 0.92300 · max 0.99900 · media 0.84643

Margin:
- min 0.25400 · p10 0.25896 · p50 0.27144 · p90 0.34480 · max 0.44300 · media 0.28974

## 8. Insufficient

Comportamiento contractual específico:
- development: **3/3** detectan insufficient, 3/3 sin acción, 3/3 B3 distinto de CONFIRMAR;
- calibration: **2/2** detectan insufficient, 2/2 sin acción, 2/2 B3 distinto de CONFIRMAR.

Full-record exact incluyendo el command plan: **4/5**.

Único fallo:
- `I0-DEV-0400`: reconoce correctamente `insufficient`, no ejecuta acción y mantiene PRESENTE, pero añade indebidamente `CAMBIAR_MOVIMIENTO` al plan y reformula el query. Se clasifica como fallo de clasificación del registro, no como fallo de la política insufficient.

No se ha corregido el dataset ni el ejecutor tras observar este fallo.

## 9. Negación

Poblaciones separadas:

Negativos:
- development: 4/4 correctos; 0 falsos disparos;
- calibration: 19/20 correctos; **1 falso disparo**;
- total: **23/24** correctos.

Fallo negativo:
- `I0-CAL-0124` «Sigue con la lectura en voz; no la detengas.» → emitió `SPEECH_STOP`.

Controles positivos:
- development: **2/4** correctos; 2 fallos;
- calibration: no contiene controles positivos;
- fallos: `I0-DEV-0253` y `I0-DEV-0257`, ambos convertidos en aclaración/no ejecución.

## 10. Multiacción

Se evalúan como unidades completas.

Development:
- casos 25
- command exact 16/25
- action exact **0/25**
- full exact **0/25**
- acciones omitidas 43
- acciones extra 2
- acciones incorrectas 2
- errores de orden 0

Calibration:
- casos 15
- command exact 12/15
- action exact **0/15**
- full exact **0/15**
- acciones omitidas 25
- acciones extra 2
- acciones incorrectas 2
- errores de orden 0

Total:
- 40 casos
- command exact 28/40
- action exact **0/40**
- full exact **0/40**

No se utiliza una métrica parcial como sustituto del exact match.

## 11. Clasificación y ejecución separadas

La clasificación y la ejecución se contabilizan por separado en todos los artefactos.

En calibration:
- command-plan exact 56.50%;
- action-plan exact 66.50%;
- ejecución binaria con precision 1.00 pero recall 0.1159.

Por tanto, una clasificación correcta con acciones omitidas no se considera éxito completo. La baja ejecución se debe principalmente a una política conservadora de umbral que deriva muchas acciones a aclaración.

## 12. Errores reales

Casos incorrectos completos:
- development: 297
- calibration: 146
- total: **443**

Categorías superpuestas:
- s0_events: 280
- result_kind: 278
- action_omitted: 251
- classification: 233
- b3: 120
- multi_action: 40
- action_extra: 21
- action_wrong: 19
- safety_gate: 15
- negation: 13
- insufficient: 1

Detalle completo y IDs: `reports/sabik/i0/calibration-v1/errors.json`.

## 13. No contaminación

La ejecución automatizada:
- no contiene rutas de validation;
- cargó development, calibration y schema solamente;
- registra `validation_173_used_for_tuning=false`;
- registra `validation_paths_loaded=[]`.

Durante esta fase se consultaron antes de la corrida:
- metadatos/cuerpo de PR #176 para comprobar que no existía un ejecutor I0 v0.4 previo;
- comentarios de #174 sobre estado/metodología.

No se abrieron archivos del corpus reservado, no se consultaron labels de validation y ninguna información de #173 se utilizó para construir el ejecutor ni seleccionar umbrales.

Limitación metodológica declarada: el mismo Agente n.º 2 participó en la preparación V2 del corpus calibration en la fase previa. Para esta corrida, el ejecutor fue fijado en commit separado antes de ejecutar calibration, y no se reabrió el dataset calibration para modificar reglas después del congelado.

## 14. Artefactos de resultados

SHA-256:
- `predictions.development.jsonl`: `6dd2fc7e01f69d496f2d3a2a1b7f02b34c5aa3f88d41ab2f935597245348dbf8`
- `predictions.calibration.jsonl`: `d6527d5eed8551aa4002ff26f0ced0e9455e50e1c5e2bba2a1264ab95dff0953`
- `candidates.jsonl`: `9b80d9d4997a64e2af41894631bcf118ff59beff3a4a66a94f94911f7d62073e`
- `metrics.development.json`: `cc3bd6ada55e71bb56523879ebf31d28129a5d68c377fb301f4963f6b047d8ac`
- `metrics.calibration.json`: `a0ac3ad70c795e47032b76c1489fd6ad696bc3cd0c05c00a55cbf249eb5b52a7`
- `errors.json`: `6e5080f8fb25a43b42adcc9f40f44c91dd6954ff5e2ed7f157fdefde7c1936d5`
- `run-manifest.json`: `8458df3c8cfb7cc929a18077a64362312d359447af712af738048f99d86520e1`
- `summary.json`: `f466dd6dfb5ec0df1b86efbca7da169693a97aa5384b424ae73694eb463dd90b`

## 15. Conclusión de fase

La corrida es reproducible y auditable. No se declara validación final, production ready ni autorización del siguiente gate.

Las métricas muestran fallos graves, especialmente:
- 0/40 multiacción con acción exacta;
- recall de ejecución muy bajo;
- un falso disparo de negación en calibration;
- dos fallos en controles positivos;
- umbrales with_loss y márgenes no identificados por este corpus/sistema.

Estos resultados se conservan sin retuning posterior a la observación.
