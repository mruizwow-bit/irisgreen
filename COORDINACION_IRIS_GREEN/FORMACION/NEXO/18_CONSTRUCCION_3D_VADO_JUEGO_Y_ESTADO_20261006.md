# Nexo · Formación 18 · Construcción 3D, juego y estado
2026-10-06

Práctica: iris-green-3d-vado.zip, SHA256 308c370ef5b2dfce69fa8e0f7865d957390aa40a290d8f46145eb2a99fc1e59c.
Estudio completo y reproducciones: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CONSTRUCTION_3D_VADO_20261006/, rama nexo/new-games-area-r01-20261004, commit 18207efd9b07ddab68ac626a5624a7e346196bed.
Método: código, capturas del autor y funciones originales en Node/Three sin navegador ni GPU. No atribuirme partida real ni validación perceptual.

## Lo que el ejemplo enseña y que debo incorporar
- Un mundo de alturas por columna y piezas discretas permite un prototipo 3D recorrible sin física pesada. Diferenciar ese modelo de un terreno voxel completamente editable.
- BufferGeometry agrupada y un personaje jerárquico de primitivas pueden bastar para demostrar volumen, herramientas y locomoción. No cambiar de motor para resolver un problema de producto.
- El raycast devuelve dos intenciones diferentes: superficie impactada y espacio adyacente de colocación. Retirar usa la primera, construir la segunda.
- En un juego web, los eventos globales pueden anular controles DOM aunque todos tengan nombres, foco visible y tamaño correcto. Verificar intención/efecto por contexto, también ajustes y alternativa textual.
- Deshacer no es invertir una resta. Debe reconciliar personaje, apoyo, inventario, ocupación, progreso y navegación.
- Cargar exige validación temporal y aplicación atómica. Fallar no debe haber destruido ya la partida.
- Un contador de acciones acredita entrenamiento de controles, no construcción útil. Reproduje final completo con parcela vacía.
- Dragon Quest Builders aporta la relación entre materiales, exploración, obra y uso del asentamiento. La transferencia adecuada es una construcción que abre posibilidades y puede ser habitada.
- Townscaper aporta acabado derivado de adyacencias. Transferir remates cosméticos sin sustituir las decisiones de juego ni alterar reglas ocultamente.
- Accesibilidad debe conservar intención y libertad mediante entradas alternativas, ayudas opcionales y cámara controlable; no reducir el juego a rutinas.
- Un script con teclas reales y cursor inyectado es evidencia mixta. Su alcance debe declararse. Una captura con clipping no queda absuelta por ausencia de scroll horizontal.
- Medir geometría no equivale a medir GPU. El coste JavaScript de un frame no demuestra fluidez. Investigar dt, render, sombras y latencia en equipo real.

## Cambio en mi criterio de aceptación
Separar representación 3D, consistencia de reglas y valor de juego.
Para la siguiente escena, comprobar: dos construcciones distintas sirven, la obra abre un acceso real, un personaje puede usarla, guardar la conserva y la persona quiere modificarla o continuar.
No exigir una solución geométrica única ni confundir completar una lista con diversión.

## Fuentes consultadas
- Nintendo/Square Enix, Dragon Quest Builders 2: https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/DRAGON-QUEST-BUILDERS-2-1514364.html
- Townscaper oficial: https://www.townscapergame.com/
- Microsoft XAG 107: https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107
- W3C APG Button/Radio: https://www.w3.org/WAI/ARIA/apg/patterns/button/ y https://www.w3.org/WAI/ARIA/apg/patterns/radio/
- Three manual: https://threejs.org/manual/pages/rendering-on-demand.html y https://threejs.org/manual/pages/optimize-lots-of-objects.html
