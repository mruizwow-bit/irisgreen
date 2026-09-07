# Accesibilidad · controles, lectura y música

## Estado
La ejecución 34084738105 terminó correctamente. Los cambios de esta tanda están guardados en el commit 88eef9f1a2f2c784463b770b038c8c67c1e2b781 de `ajustes/auditoria-web`. La propuesta #2 continúa en borrador: no se ha fusionado ni publicado esta tanda.

## Correcciones

### Los dos juegos con zonas pequeñas
«Las cinco cosas que agotan a Vera» y «El mapa del tesoro de casa» conservan las ilustraciones y la geometría original de sus objetos. Debajo se ofrece un desplegable: «Usar botones en lugar de tocar la imagen». Contiene botones equivalentes de al menos 44 × 44 píxeles, separados y que saltan de línea. Usan exactamente las mismas acciones que los objetos del dibujo, no una partida distinta. Se conserva tanto el acceso al juego original como el alternativo.

Se ha probado completar y reiniciar ambas partidas, combinar pulsaciones en la imagen con los botones alternativos y usar Enter y Espacio. El mapa sigue diferenciando las elecciones de menores y adultos. No se han agrandado los rectángulos invisibles unos encima de otros. Las zonas originales siguen siendo pequeñas: la solución es un acceso equivalente de mayor tamaño en la misma página, no afirmar que el dibujo haya cambiado.

### Panel de Lectura
Se ha corregido su salida por el borde izquierdo en pantallas estrechas. Abrirlo con teclado lleva el foco al panel; Escape y el botón de cierre devuelven el foco al control de apertura. El cierre tiene 44 × 44 píxeles. Las seis opciones existentes exponen si están activadas mediante `aria-pressed` y se han probado activándolas y desactivándolas.

Es un panel no modal: Tab permite seguir recorriendo la página. No se encierra a la persona en las opciones de lectura. Se utilizan los controles existentes; no se ha creado un segundo sistema de preferencias.

### Texto ampliado
La ampliación se aplica al contenido, no a toda la cabecera ni a los paneles flotantes. Se han corregido las columnas que desbordaban en móvil con el tamaño máximo incorporado en Lectura. El ajuste de redistribución solo entra en modo de texto ampliado en pantallas estrechas; las rejillas normales no se han cambiado por esta corrección.

En la primera comprobación había desbordamientos de hasta 149 píxeles a 320 píxeles de ancho. La prueba final registra como máximo 1 píxel en los 62 escenarios, dentro de la tolerancia de redondeo de 2 píxeles. Esto verifica la ampliación incorporada en la web, no todos los niveles de zoom del navegador.

### Música y teclado
La barra espaciadora abre el reproductor desde el control de música, sin llevar al visitante al ancla de la home. Escape lo cierra y devuelve el foco. Abrir Lectura cierra visualmente Música, y abrir Música cierra Lectura, evitando paneles superpuestos. El reproductor conserva su posición fija abajo a la derecha y su tamaño compacto.

Al pasar a inglés se actualizan los controles Anterior/Escuchar/Siguiente, la lista, el volumen, la repetición y los créditos, no solo el título. Se reutilizan el panel y el reproductor existentes. No se han cambiado pistas ni se ha activado el selector portugués. En estos escenarios no se solicitan archivos de audio sin pulsar la reproducción.

## Pruebas finales
- **62/62** escenarios de paneles: 25 páginas dinámicas y 6 páginas estáticas, cada una a 1440 y 320 píxeles. Comprobaciones de foco, Escape, seis opciones, tamaño máximo incorporado, límites de pantalla, intercambio Lectura/Música, idioma del reproductor donde existe selector dinámico y navegación móvil con teclado.
- **12/12** escenarios de los dos juegos con controles alternativos: anchos 1440, 390 y 320, en español e inglés. Tamaño, separación, partida completa, reinicio e integridad de los rectángulos del dibujo.
- Regresión de juegos: **52/52** escenarios de partidas, **26/26** comprobaciones de colecciones y **13/13** rutas de cartas. Se ejecutó nuevamente la batería anterior después de los cambios de accesibilidad.
- Regresión adicional de cartas: **6/6** casos de texto largo, descarga y teclado sobre el HTML real.
- Comprobación de sintaxis JavaScript y repetibilidad del generador `prepare_initial_data.py --check` superadas.

Se han revisado las capturas de Lectura a 320 píxeles y de los botones alternativos de los dos juegos. Los informes completos y sus capturas están en el artefacto `accesibilidad-resultados` de la ejecución 34084738105.

## Límites
Las pruebas son locales en Chromium, con servicios externos bloqueados. No son una certificación WCAG ni sustituyen una prueba con lectores de pantalla y personas usuarias. Se ha comprobado la respuesta y el estado de los botones de lectura; no se certifica la calidad o audibilidad de todas las voces del dispositivo. No se han probado en esta tanda todos los navegadores ni el zoom de navegador al 200 % o 400 %.

El contenido de las fichas, las ilustraciones y las reglas de los juegos no se reescriben. Se añade únicamente la instrucción de interfaz del acceso alternativo, con sus traducciones, fuera de los diccionarios existentes. No se publican grados, fechas de revisión ni estados documentales nuevos.

Siguen siendo tareas distintas las dos portadas ausentes de Libros, la comprobación de vídeos externos y la auditoría del despliegue público. Esta tanda no las da por resueltas.

## Evidencia
`before.json`, `first-pass.json`, `before-reflow.json`, `after.json`, `changes.json`, `semantics.json`, `enlarged-text-changes.json`; y las regresiones `../games/games-accessibility.json` y `../games/letter-edge-tests.json`.
