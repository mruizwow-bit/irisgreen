# I0 · CORPUS EXTERNO DE EVALUACIÓN · V0.4

**Issue:** #173  
**Contrato normativo:** `docs/sabik-next/I0_CONTRACTS_V0_4.md`  
**Estado:** `LISTO_PARA_REVISION_DE_CIERRE`

## Identidad exacta

- casos: **313**
- desarrollo: **0**
- validación: **313**
- frases de texto español: **312**
- control de texto inglés: **1**
- manifest Git blob: `b40c80c3028b21d6e7c7a6cfd9dbb49c930de4cd`

El manifest es la identidad canónica del corpus: enumera los 13 shards, sus rangos y sus blobs exactos.

## Separación desarrollo / validación

El corpus vive exclusivamente bajo:

`tests/evaluation/sabik/i0/validation/**`

No existe copia de estos casos bajo `tests/fixtures/**`, directorios de entrenamiento ni conjuntos de desarrollo.  
El manifest marca `training_reuse_prohibited=true`.

## Cobertura

- negaciones críticas: **26**
- ambigüedad: **21**
- Safety Gate: **16**
- gates finales Claude/Astra: **13**
- casos con ejecución esperada: **222**
- casos con no-ejecución esperada: **91**
- salud informativa sin inferencia diagnóstica: incluida
- errores ortográficos: incluidos
- acciones encadenadas: incluidas
- referencias contextuales: incluidas
- URLs / código / acciones externas no autorizadas: incluidas
- locale=en + texto español y control inglés: incluidos

## 13 gates finales

`I0-EVAL-301`–`I0-EVAL-313` cubren expresamente:

1. `RISK_CLEARED` sin reinyectar la frase de riesgo.
2. `postSafetyResolved` una sola vez.
3. «No pares la voz» con speech activo → no `SPEECH_STOP`.
4. `scale=1.15 → large=1.3`.
5. «Más pequeño» desde 1.15 → `normal=1`.
6. reset conserva contraste, espaciado, guía y controles.
7. navegación al final de planes multiacción.
8. aviso cuando una preferencia solo de sesión se perderá al navegar.
9. paso a paso no persistible.
10. exactamente un `ASK_CLARIFICATION`.
11. resultado tardío descartado tras `PAUSE_ASSISTANT`.
12. `excludedContentIds` se limpia al cambiar query.
13. `locale=en` con texto español; además existe control de texto inglés que se abstiene.

## Integridad

Los scripts incluidos verifican:

- estructura/schema;
- IDs únicos y secuenciales;
- blobs de los shards contra el manifest;
- mínimo 300 casos de texto español;
- 13 gates finales;
- ausencia de duplicados exactos;
- ausencia de variantes triviales de un solo token, salvo contrastes intencionales etiquetados.

## Métricas de #174

No existe todavía un ejecutor I0 v0.4 en esta rama documental.  
No se fabrican predicciones copiando las etiquetas esperadas.

Estado actual: `NO_EVALUADO_SIN_EJECUTOR_I0_V0_4`.

`tools/measure-sabik-i0-eval.mjs` queda preparado para medir, sobre predicciones reales:

- tasa de acción falsa por intención;
- inversión en negaciones críticas (objetivo 0);
- tasa de aclaración;
- tasa de abstención;
- calibración por tramo de confianza;
- margen top1-top2;
- Safety Gate por separado;
- lista completa de fallos.
