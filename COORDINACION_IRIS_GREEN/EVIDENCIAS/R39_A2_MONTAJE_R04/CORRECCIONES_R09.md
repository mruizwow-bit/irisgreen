# R09 · correcciones de María realizadas

HEAD 89dcea56abc14d94914d0cb1bd005b902d46a29c, rama agent2/sabik-iris-r08-20260924, PR244.
Deploy READY 6ab5360d1b58030008d2f97a. URL exacta: https://6ab5360d1b58030008d2f97a--irisgreen-home.netlify.app/ (EN: /?lang=en).

Cabecera compartida en una fila; navegación completa a 1920 px, menú compacto cuando el ancho no permite todos los enlaces, sin ocultar accesos ni romper móvil. Portada a todo el ancho con margen 24 px y reparto 2:1 Sabik/contenido (contenido ocupa dos partes). Newsreader para títulos y h1 coherentes; preferencias de fuente de Lectura conservadas. Visores corregidos: se eliminó la coordenada horizontal duplicada de --sprite-y que invalidaba background-position.

Pruebas: 30 combinaciones de página/ancho (1920, 1440, 320), fuente de h1, centrado vertical de cabeceras y portada >95% del ancho. Comparación de píxeles de las 8 hojas interiores de Luma y 7 de Autismo, todas distintas; navegación atrás con teclado y límites. Suite anterior 36 casos navegador y 12 Recursos PASS sobre 0040fc86. Run R09 inicial PASS: https://github.com/mruizwow-bit/irisgreen/actions/runs/36013999167 . Run final: https://github.com/mruizwow-bit/irisgreen/actions/runs/36014321689 . Contraste final PASS. Inspección visual de capturas 1920 y prueba live de portada, Recursos, hoja real de Luma, apertura/cierre del menú compacto con Escape.

Pendiente aceptación de María. Cloud desactivado R04.4; sin merge main ni despliegue producción. Hallazgos de almacenamiento preexistentes sin cambio.
