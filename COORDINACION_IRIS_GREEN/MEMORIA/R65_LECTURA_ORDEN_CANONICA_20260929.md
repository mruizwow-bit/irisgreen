# R65 · lectura de la orden canónica y espera

Fecha: 29/09/2026 · Claude · issue #330

## Qué he hecho

He leído la orden canónica entera en la rama de coordinación,
`ORDENES/R65_CLAUDE_TALLER_21_PLUS_9/01_CLAUDE.md` (915 líneas), y su hoja de
control `CONTROL/DELTA_R65_TALLER_21_PLUS_9_20260929.json`. No desde un resumen
de chat: desde el documento versionado, que es la regla.

## Estado: no ejecuto

`R65_WAIT_HUMAN_QA_R64`.

El §17 y el `limits` de la hoja de control dicen lo mismo: sin el marcador
`R64_TALLER_6_CARDS_HUMAN_APPROVED_FINAL_UNLOCK_R65`, **no hay render y no hay
escala**. Ese marcador lo emite María después de ver la Deploy Preview de #329,
que integra A2. Así que aquí no se empieza nada de las 21 ni de las 9.

**No he tocado arte. No he creado fuentes nuevas. No he renderizado nada.**

## Lo que sé que tengo que hacer cuando se abra el gate

Resumen operativo, para no releer 915 líneas en frío:

* **21 estudios base**, lista cerrada, en **7 tandas de 3**. Cada tanda cierra su
  ciclo completo —fuente, render 1x/2x, AVIF/WebP, manifest y fingerprints, QA,
  captura a tamaño real, commit limpio, registro en Memoria y Control— antes de
  abrir la siguiente. Si una tanda no pasa, se corrige esa tanda.
* **9 variantes `AGE_0_12`** después, y son las nueve ya identificadas en R54:
  `circuitos`, `arquitectura`, `composicion`, `sintesis-sonido`, `videomapping`,
  `color`, `fotografia`, `lenguas-inventadas`, `escritura-restricciones`.
  Regla: mismo estudio, mismo proceso, misma o mayor calidad; menos densidad,
  objetos mayores, acción más inmediata. **No estética bebé, no mascotas, no
  “lo mismo más mono”, no rebajar detalle.**
* **KEEP 6/6** congelado, y no como plantilla literal: el estándar es igualar
  materia, luz, profundidad, atmósfera, microdetalle y jerarquía a 240×150 CSS,
  no repetir la composición.
* Regla visual: `THE_CARD_SHOWS_THE_WORKBENCH_NOT_THE_FINISHED_PRODUCT`.
* Objetivo: `IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`.
* Pipeline R54 intacto: fuente versionada, raster determinista, cuatro outputs,
  `svg_sha256` o equivalente, hashes, dimensiones, `render_config_sha256`,
  build-strict y prueba negativa de output stale. Si un estudio exige otra
  técnica para llegar a E4, se puede cambiar, pero documentándolo y manteniendo
  los equivalentes de trazabilidad sin romper el checker.
* Salidas esperadas con el contrato actual: 84 + 36 = **120 assets**. Si el
  pipeline cambia la cifra, se documenta el motivo; no se fuerza para cuadrar.
* Performance: las 27 no van eager. Solo las visibles inicialmente; el resto lazy,
  y las variantes de edad sin precargar.
* Taxonomía: solo los cuatro IDs canónicos. R65 **no** reabre la migración de
  URLs, que es de A2.
* Tokens y shell: R65 hace arte de tarjeta y **no** vuelve a abrir el shell
  global. No se toca Home v4, header, theme runtime, `iris-brief-r08.css` ni los
  tokens. Cuando haya cromo en una evidencia, se consume
  `assets/ig-global-ui-tokens-2026.css`, DARK NAVY inicial.
* Fuera de alcance explícito: los 27 interiores, starters, primera pantalla,
  motores, storage, exportaciones y los retos R44. Eso es la orden siguiente.
* Marcador de entrega: `R65_CLAUDE_TALLER_21_PLUS_9_READY_FOR_ASTRA`.
  Después, Claude → Astra. **No A2 todavía, no main, no producción, no deploy.**

## Observación de alcance

El bloque normativo embebido al final de la orden arrastra material de otros
carriles —entre otros, la entrega R03 de Design: biblioteca de juegos, rutinas
descargables, más de 200 juegos—. Eso **no es alcance de R65 ni mío**, y lo dejo
anotado en vez de actuar sobre ello, según la regla de reconciliar con Astra
cuando un documento parece ampliar el alcance fuera de la orden.

## Rebase de la rama

En el momento de esta entrega, la rama remota había avanzado de `3ea7e310` a
`818440d3` con las órdenes R61, R63, R64 y R65. Claude rebasó sus 19 commits
sobre esa cabeza y resolvió los solapamientos de `ESTADO_TRABAJOS.csv`,
`ESTADO_ACTUAL.md` y `ESTADO_CONSOLIDADO.md` conservando ambos lados, sin
marcadores de conflicto.

Este dato se conserva como **histórico de la entrega de Claude**. La rama
canónica puede haber avanzado después y no debe resetearse a `818440d3`.
