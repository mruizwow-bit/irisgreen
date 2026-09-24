# WEB-A2 · R22 · Auditoría y usabilidad

Orden directa de María: revisar toda la web y los cambios por accesibilidad y tamaño; facilitar acceso a funciones mediante buscador superior y despliegue de secciones. Incidencia añadida: bloqueos y saltos de imágenes al abrir Intereses (estrellas/planetas). Autorizados cambios web ES/EN y preview PR244. Biblioteca en la nube/Sabik quedan fuera.

Base: d52584344240deb352f712debd19e9e7ae76bdd2. Estado: PREVIEW PUBLICADO Y VERIFICADO EN EL ALCANCE DOCUMENTADO. No se acredita conformidad global.

Primera evidencia: build base correcto, auditoría estructural 1011 páginas sin fallos. Muestra de navegador detecta nombre ausente durante arranque del canvas del cielo; se corrige nombre inicial. La escena cambia de anchura por JavaScript y el Rincón apila sus funciones; correcciones en curso.

Plan: índice de secciones progresivo ES/EN, actividades del Rincón desplegables nativas, escena con espacio reservado y carga 3D bajo demanda, pruebas globales y por familias en navegador, registro de límites y publicación de preview. Normativa vigente conservada. Lectores de pantalla reales, dispositivos físicos y validación con usuarios se distinguirán de automatización.

## Entrega técnica

Commit web: 0449fd1e21a624f46938603e076ee70f59e4990e, PR244. Netlify inició 6ab578a37e3ce700084d569a. Publicación y comprobación del preview en curso.

- 1011 HTML, 2140 archivos construidos. Estructura y plantillas sin JS sin hallazgos.
- 2022 casos de navegador (320/1280), sin desbordamiento del documento ni errores de página. Cero infracciones axe tras correcciones/recomprobaciones. Catálogos de 6366 exoplanetas por idioma comprobados además en 128 lotes, conservando cabeceras y CSS; cero infracciones automáticas.
- 48 casos de tamaño, 6831 objetivos y cero candidatos. 26 casos de foco, 2258 paradas y cero candidatos; ciclo completo en 24 casos, límite de 260 paradas en dos rutas largas.
- Rincón ES/EN con acceso directo a Música, filtro, teclado, texto ampliado y lectura sin JS. Índice superior en 989 páginas; traducción al cambiar idioma en portada comprobada.
- Planetas/Exoplanetas ES/EN: imagen inicial y motor bajo demanda. Cuatro arranques comprobados con SwiftShader, sin errores. Cielo con dimensiones estables y nombre accesible inicial.
- Corregidos scroll por teclado de rutinas/tabla, contrastes de Autismo/Trámites, desbordamientos Tarjeta Iris/impresión y controles de ordenar.

Evidencia versionada en la rama web: reports/web-r22/README.md, summary.json y evidence.json.gz (incluye resultados incompletos de axe y hallazgos previos, no solo resumen). Scripts de repetición en scripts/test_web_r22_*.py y audit_web_r22.py.

No se declara conformidad global WCAG/ISO/legal. Pendientes: contraste complejo que axe no resuelve, lector de pantalla real, móvil/GPU físicos, escucha y validación humana. PDF/UA/braille fuera de esta modificación de HTML. Biblioteca cloud, conexión y backend de Sabik intactos.

## Comprobación del primer preview

Netlify 6ab578a37e3ce700084d569a pasó a READY para 0449fd1e. En el alias PR244 se comprobó Rincón ES/EN, apertura de Escuchar y filtro Música/Music. En Planetas EN se comprobó imagen local cargada y botón de entrada; el navegador cloud sin WebGL muestra el fallback explicativo y mantiene las fichas. El arranque 3D real consta en las pruebas locales con SwiftShader.

Revisión final de enlaces: el menú inglés de algunas páginas enviaba al Taller español. Corregido en cf96e31baac24ac9348ea6c5eea9ac1f79b67f5d; las 497 páginas inglesas construidas quedan sin href al Taller español. Build nuevamente correcto. Deploy final 6ab579b8d1bccb0008720139 en proceso.

## Cierre del montaje

Deploy final **6ab579b8d1bccb0008720139**, commit **cf96e31baac24ac9348ea6c5eea9ac1f79b67f5d**: Netlify READY y estado GitHub SUCCESS. URL de prueba: https://deploy-preview-244--irisgreen-home.netlify.app/ . Se comprobó en navegador el Rincón inglés del despliegue final, el buscador traducido y el enlace The workshop → /en/workshop/. El primer preview de esta misma entrega ya acreditó los filtros ES/EN y el fallback de Planetas; el último delta solo corrige enlaces ingleses.

No se publica producción ni se modifica el servicio cloud. Los pendientes manuales arriba indicados siguen abiertos y no se presentan como PASS.
