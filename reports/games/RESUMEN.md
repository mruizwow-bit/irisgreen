# Tanda de juegos · resultados

## Estado
Correcciones guardadas en `ajustes/auditoria-web`. La ejecución 34060945286 terminó correctamente. No se ha fusionado la propuesta ni publicado esta tanda en producción.

## Resultado de las pruebas
- 52 de 52 partidas interactivas comprobadas: los 13 juegos a 1440, 390 y 320 píxeles en español, y a 390 píxeles en inglés. Se comprueba llegar al final, las imágenes, ausencia de desbordamiento y reiniciar donde existe ese control. «Cada cerebro, su camino» permite cambiar de caminos y no tiene botón de reinicio.
- 26 de 26 comprobaciones de colección: las 13 familias a 1440 y 320 píxeles, con sus diez fichas y pestañas visibles.
- Las 130 referencias de imágenes de las fichas apuntan a 92 archivos distintos. Todos están presentes, son imágenes válidas y cargan en las pruebas. El catálogo `juegos-120.json` sigue intacto; contiene 130 juegos, pese a conservar ese nombre de archivo por compatibilidad.
- 13 de 13 rutas de cartas comprobadas individualmente: formulario correspondiente, descarga PNG y cierre con Escape.
- 6 de 6 pruebas adicionales sobre el HTML real: cartas en español e inglés a 1440, 390 y 320 píxeles; conservación de las entradas probadas, incluida una cadena de 120 caracteres sin espacios; cambio entre cartas; Tab/Mayús+Tab dentro del diálogo; Escape y devolución del foco al botón que lo abrió.

Las partidas se realizaron mediante eventos de botones y teclado. No se alteró directamente el estado del juego para simular que se había completado. Para localizar controles repetidos, el servidor de la batería principal añade exclusivamente atributos de selección de prueba. La batería adicional de cartas utiliza el HTML sin esa instrumentación.

## Cambios aplicados
1. «Cada cerebro, su camino» y «Palabra misteriosa» pasan a una columna en pantallas estrechas. Antes tenían desbordamientos de 81 y 156 píxeles, respectivamente, en la prueba de 320 píxeles.
2. En «¿Dónde se fue la energía?», los siete días quedan separados bajo la misma ilustración en móvil. Domingo ya no intercepta el botón de Sábado. La presentación de escritorio y el tablero original se conservan.
3. En «La cena de los planes», cada participante conserva sus propias tres necesidades. Una misma necesidad puede ser elegida por varias personas sin quitarle la carta a otra. Se ha comprobado con cuatro participantes; la finalización espera a los cuatro y el botón de añadir se desactiva en el límite ya existente de cuatro personas.
4. Las cartas se pueden cerrar con Escape, mantienen el foco dentro del diálogo y lo devuelven al control de apertura. Cambiar el fragmento de la dirección abre la carta correcta. La exportación usa la medida real del texto y permite dividir palabras largas sin perder el texto probado.
5. Se ha corregido el cruce de idiomas en Energía: las explicaciones inglesas y portuguesas estaban repetidas dentro del bloque español. Se han colocado en su idioma conservando literalmente esas explicaciones. Además se han traducido al español diez nombres breves de objetos que estaban en portugués dentro de `es.tokens`; están enumerados en `language-repairs.json`. No se ha activado el selector público portugués.
6. El título del índice de la colección muestra «130 juegos, 13 bloques», calculado desde el catálogo real.

No se han sustituido ilustraciones ni reescrito las fichas de las colecciones. Las verificaciones de integridad se conservan en `repairs.json`, con la excepción explícita de la reparación de idioma registrada por separado.

## Límites y pendientes
- Son pruebas locales en Chromium, con servicios externos bloqueados. No equivalen a una certificación de accesibilidad ni a métricas del despliegue público.
- Los materiales de las colecciones se verifican como fichas e imágenes, no como 130 partidas digitales.
- Siguen anotadas zonas táctiles inferiores a 44 píxeles en «Las cinco cosas que agotan a Vera» y el balcón de «El mapa del tesoro de casa». Las partidas se completan, pero el tamaño de esas zonas no forma parte de la aprobación funcional y requiere un ajuste de accesibilidad específico que no solape los objetos de la ilustración.
- Esta tanda no cierra la verificación de vídeos externos, contenido documental ni las dos portadas ausentes de Libros detectadas anteriormente.
- La primera prueba de descarga reutilizaba el primer diálogo al cambiar únicamente el fragmento de la dirección. Ese resultado inicial NO demuestra 13 cartas distintas. La prueba final lo corrige: navega de forma independiente, registra cada título y comprueba también el cambio de fragmento en la prueba adicional.

## Evidencia
`games-before.json`, `games-after-first-pass.json`, `games-after.json`, `letter-edge-tests.json`, `repairs.json` y `language-repairs.json`. Las capturas y las descargas de prueba se conservan en el artefacto `juegos-evidencia` de la ejecución 34060945286.
