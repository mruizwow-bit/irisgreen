# R65 · cierre Astra tras QA de estados/tamaño · 29/09/2026

Estado:
`R65_ASTRA_CARD_STATE_EXACT_SIZE_PASS_HUMAN_QA_PENDING`

## Evidencia revisada
- `R65_CARD_STATE_EXACT_SIZE_QA.json`;
- parche producto rearmado SHA-256 `131ed2df0613423e03068ce8742ed5905c470ea8298451f057e4b4da5cc947d2`;
- parche coordinación SHA-256 `7774340c94a7999a6a8a8a05d6437987463bc5e99e6a918704124a6d7b4e5e10`;
- cambios 39/40 y 40/40 del producto;
- revisión independiente Astra de la matriz 27/27 a tamaño móvil, ocultando los títulos.

## Bloqueo 1 · estados de enlace
PASS.
Los cinco estados están cerrados en el lanzador y `:visited` deja de contaminar título/descripcion.
El anillo local pasa a `--ig-accent` y evita el contraste insuficiente de `--ig-focus` en DARK NAVY.

Se abre deuda transversal separada:
`GLOBAL_FOCUS_TOKEN_DARK_NAVY_FIX_REQUIRED`.
No bloquea R65 porque el componente ya tiene foco conforme.

## Bloqueo 2 · 240x150
PASS por reconciliación formal.
240x150 no se trata como tamaño fijo de producto, sino como punto de la curva responsive.
El criterio canónico para este arte queda:
- conservar aspect ratio;
- medir en tamaños reales de uso;
- mobile hard case 390 = ~172x108;
- desktop real ~223x139 en 1280/1440/1600;
- 240x150 sigue siendo evidencia de referencia cuando la curva lo alcanza.

## Bloqueo 3 · título-off 27/27
PASS independiente Astra.

Astra generó una hoja ciega aleatoria a partir de la matriz 27 y revisó sin leer los títulos.
Resultado:
- 26/27 inequívocas;
- Simulaciones es la más débil, pero todavía se distingue de Juegos de mesa porque muestra estado/sistema/regla y secuencia de generaciones, no una partida;
- Patrones y Lenguas inventadas se distinguen suficientemente por repetición visual vs sistema de signos;
- Ideas y Escritura con restricciones se separan claramente.

No se ordena rerender.
Simulaciones queda como punto de vigilancia para HUMAN QA móvil, no blocker.

## Bloqueo 4 · filtros/sugerencias móvil
PASS.
Chips envueltos y 6/6 alcanzables.
Sugerencias en rejilla a <=560:
- 3 visibles;
- 3 enfocables;
- 0 recortes;
- 0 overflow;
- 320/390/560 ES/EN probados.

Decisión Astra sobre jerarquía:
la pérdida de “sugerencia grande” NO bloquea. Se prefiere el layout que no oculta contenido ni foco.
R67 Fase 3 podrá ajustar jerarquía si encuentra una solución igual de accesible, sin reabrir arte R65.

## R65
Los cuatro blockers quedan cerrados.
Mantener KEEP 21 + 9 + KEEP 6/6.
No más rework de arte de tarjeta.

Siguiente puerta:
HUMAN QA María.

Marcador:
`R65_TALLER_21_PLUS_9_ASTRA_PASS_HUMAN_QA_PENDING`

Si María aprueba:
`R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION`

Integración posterior solo por R67 Fase 3.
