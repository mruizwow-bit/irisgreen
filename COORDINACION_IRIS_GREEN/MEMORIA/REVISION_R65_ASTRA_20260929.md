# R65 · revisión Astra · Taller 21 + 9 · 29/09/2026

Estado: `R65_ASTRA_VISUAL_DIRECTION_PASS_CARD_STATE_FIX_EXACT_SIZE_GATE_REQUIRED`

## Material revisado

- issue canónico #330;
- patch técnico `R65_TALLER_21_PLUS_9.patch.gz`;
- matriz 27/27 + 9 variantes AGE_0_12;
- auditoría child-safe visual;
- launcher ES/EN, DARK NAVY/LIGHT, escritorio/móvil;
- matrices de tarjetas reales por tandas;
- comparativa base vs AGE_0_12;
- parche de coordinación regenerado del 29/09/2026.

## Lo que pasa

- 27/27 estudios migrados a escena rica.
- 9/9 variantes AGE_0_12 presentes.
- 36 escenas en manifiesto.
- KEEP 6/6 preservado según la entrega.
- Las nueve variantes mantienen el mismo estudio y bajan densidad sin estética bebé.
- La dirección de arte general cumple el cambio pedido en R54/R65: banco de trabajo/proceso, no icono terminado.
- La diversidad entre familias es suficiente para continuar: visual/composición, construcción, tiempo/audio, sistema y documento no usan una plantilla literal única.
- El child-safe visual entregado no declara personajes, caras, mascotas, violencia/S2, sexualización, stock ni IP de terceros.

## Lo que NO cierro todavía

### 1. Estado de enlace/visited inconsistente en títulos

En las capturas reales algunas tarjetas muestran título subrayado y, en Pixel art, color morado/visited. Otras no.

Esto rompe la homogeneidad del componente y demuestra que el chrome global todavía puede filtrarse dentro de la tarjeta. La corrección de hover incluida en R65 no cubre por sí sola todos los estados de enlace.

No requiere rehacer el arte. Requiere cerrar `:link/:visited/:hover/:focus-visible/:active` para que el título mantenga tokens del launcher y contraste AA en DARK NAVY y LIGHT.

### 2. Evidencia de tamaño exacto

La orden #330 pide QA de tarjeta a 240×150 CSS reales. La entrega documenta como tamaño duro 223×140 en escritorio y 172×108 en móvil.

El arte se ve bien en esos tamaños reales del launcher, pero falta la evidencia contractual exacta 240×150 o una reconciliación formal de por qué el tamaño canónico de QA cambia.

No aceptar por aproximación silenciosa.

### 3. Gate “sin título”

La matriz marca 27/27 como identificables sin título, pero eso es una afirmación de la propia entrega.

Visualmente la mayoría son fuertes. La que más riesgo de ambigüedad conserva es **Simulaciones**, porque a tamaño de tarjeta puede confundirse con un tablero/juego. También deben comprobarse sin título **Ideas e inventos**, **Lenguas inventadas** y **Escritura con restricciones** para asegurar que la acción se distingue y no solo la familia material.

No se ordena rerender ahora. Se exige prueba ciega/título oculto sobre el tamaño real antes de declarar 27/27 PASS.

### 4. Launcher móvil: chips fuera de viewport

En 390 los filtros continúan horizontalmente fuera del ancho. Esto puede ser correcto si el carrusel es desplazable, pero la evidencia fija no demuestra affordance, teclado, foco ni que todas las opciones sean alcanzables.

Debe probarse en navegador; no se deduce PASS de la captura.

## AGE_0_12

Dirección PASS.

Las variantes observadas conservan material y proceso, reducen piezas/densidad y agrandan la acción principal. No se ve estética bebé, mascota, ojos ni cartoon genérico.

La aceptación final de AGE_0_12 queda ligada a:
- serving correcto de las 9 variantes;
- comparación base/variante;
- título-off;
- child-safe;
- responsive 390;
- no contenido esencial solo en imagen.

## Performance

La corrección final de lazy/content-visibility es coherente con §9: la propia entrega informa que móvil baja de 328 KB/14 imágenes a 69,6 KB/3 imágenes y escritorio de 347 KB/27 a 185,9 KB/14.

Se acepta la dirección, pero la integración posterior debe volver a medir sobre el HEAD A2 real.

## Decisión Astra

KEEP:
- 21 bases;
- 9 AGE_0_12;
- pipeline reproducible;
- first-party/no stock;
- dirección de arte;
- DARK NAVY/LIGHT;
- ES/EN;
- optimización de carga.

FIX antes de PASS:
1. cerrar todos los estados de enlace de títulos/tarjetas;
2. aportar QA exacta 240×150 o reconciliar formalmente el tamaño canónico;
3. ejecutar prueba título-off en 27/27, con foco especial en Simulaciones/Ideas/Lenguas/Escritura;
4. verificar filtros móviles por interacción real.

No A2 todavía. No main. No producción.

Próximo marcador esperado:
`R65_CLAUDE_CARD_STATE_AND_EXACT_SIZE_QA_READY_FOR_ASTRA`.
