# A2 R23 · Continuidad acotada del 25 de septiembre de 2026

Orden de María: «retomalo». Base recuperada y comprobada: cf96e31baac24ac9348ea6c5eea9ac1f79b67f5d, PR #244, rama agent2/sabik-iris-r08-20260924. Se conserva el trabajo y la evidencia R22 sin repetir la auditoría general de 1011 páginas.

## Alcance de esta corrección

Solo pruebas y este registro. No se modifica la interfaz, la biblioteca de pictogramas, escenas, tamaños físicos de impresión, masters, voz, transporte de Sabik, Cloud, secretos, main ni producción. No es una autorización de publicación. La descripción R09 del PR estaba desactualizada respecto a R22.

## Recursos actuales

El run 36048320868 sobre cf96e31 fallaba en scripts/test_resources_current.py al buscar .jg-card en Rutinas imprimibles. La interfaz actual renderiza .im-card, enlaces data-open y botones data-print. También se esperaba un control PNG retirado; la interfaz actual ofrece impresión/guardar PDF. No se añade ni elimina ninguna función del producto.

Corrección guardada en 5735df1501643e4bf52c73fd3a866e38ea662bee: apertura mediante Enter, foco y título en el detalle, existencia de hojas, solicitud de impresión y documento imprimible, PDF y regreso con foco al enlace del catálogo. Se mantienen los casos ES/EN a 1440/320, Juegos, constructor de Rutinas visuales y navegación de idioma. Los fallos ahora conservan el caso, errores JavaScript y una captura.

Validación local: compilación Python y 24 casos de DOM sintético de los helpers (4 positivos y 20 negativos). Estos casos NO son una validación de la web completa. Validación real posterior en Actions: run 36094295742, job 107943147905, construcción y scripts/test_resources_current.py SUCCESS sobre 5735df1.

## Rutinas visuales

El run 36048320881 fallaba esperando 93 entradas con sprite. El catálogo vigente declara 292 entradas de SVG individuales, 11 categorías y BASE /assets/pictogramas/. Se actualiza la prueba para comprobar el número exacto, IDs únicos, textos ES/EN, categorías y existencia/XML de cada SVG con rutas confinadas a esa carpeta. Se conservan por separado las comprobaciones históricas de los 93 símbolos/13 sprites, las atribuciones, los límites de pasos, tamaños de impresión y almacenamiento solo de sesión. No se modifica ningún pictograma.

## Contraste del buscador de apartados

Artefacto histórico 10829222957 (SHA-256 16928eb2f9ef5a26daa540dc1221c24826e4ded25559fd729489c742853d9065): seis revisiones de foco, todas en ig-section-query, sin revisiones de borde ni errores de página. La prueba intentaba enfocar el campo sin abrir su details nativo.

La comprobación abre ahora el buscador mediante Enter antes de medir y exige foco efectivo. Se conserva el umbral anterior de 3:1 y no se excluye el campo. La hoja CSS del producto no se cambia.

Prueba aislada local: CSS exacto (blob a64242833b255143f97a64619c368b600f60316a), Chromium 144, cuatro combinaciones ES/EN y 320/1280; el campo cerrado no recibe foco y al abrir con teclado muestra outline sólido de 3px, rgb(90,73,168). El rectángulo no nulo observado en el antiguo Chromium 140 de Actions NO se reprodujo localmente; no se presenta como una reproducción íntegra de ese entorno.

Las comprobaciones reales de estas dos últimas correcciones deben leerse en los runs del commit que contiene este informe, no inferirse de las pruebas aisladas. Los resultados finales se registran en el PR #244 y en coordinación #237.

## Pendientes preservados

No se declara CI global verde. Quedan fuera de este lote almacenamiento/privacidad y CSP, las revisiones manuales de contraste complejo de R22, los dos recorridos largos de foco que alcanzaron el límite de 260 paradas, lector de pantalla real, móvil físico, escucha de audio, ayudas técnicas y validación con usuarios. No se declara certificación WCAG/ISO, PDF/UA ni braille. Cloud sigue fuera del alcance de A2.
