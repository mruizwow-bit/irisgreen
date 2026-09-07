# Iris Green · Inventario de accesibilidad y aplicación de la devolución

## Actualización · tipografía y espaciados independientes

Ejecución de cierre: **34106026048**, entrada de la rama **7a0a978a09715b6f2cdc91f4b817176075efa53d**. Resultado: 25/25 casos de opciones nuevas, 10/10 comprobaciones reales de teclado y música, 45/45 regresiones de preferencias y 24/24 regresiones de controles y catálogos. El código resultante y los informes se guardan en `ajustes/auditoria-web`; esta actualización no fusiona la propuesta #2 ni publica la web.

Documento atendido: devolución «Se ha pegado el markdown(20260907-085701).md». Se conserva lo ya consolidado y se añaden controles utilizables, no otra auditoría general. Los apartados históricos siguientes documentan tandas anteriores; sus pruebas no se cuentan como repetidas salvo indicación expresa.

### Qué había, qué se incorpora y dónde

Antes existían la tipografía original, un ajuste combinado de espaciado y la redistribución de columnas; no había selectores personales para estas funciones. Ahora el mismo panel de Lectura incorpora un desplegable **«Tipografía, espaciado y anchura»** con seis controles etiquetados:

- Tipografía original o alternativas de tipo Arial, Verdana y Georgia. Se utilizan exclusivamente fuentes disponibles en el dispositivo y familias de sustitución: no se distribuyen ni se solicitan archivos de tipografía. La opción no garantiza la presencia de una fuente concreta ni un beneficio universal para dislexia.
- Cuatro espaciados independientes: letras, palabras, líneas y párrafos. Cada uno admite «Original». Se comprueba que modificar uno conserva los otros.
- Anchura Original, Media o Estrecha. Las líneas se limitan mediante 65ch/48ch sin reducir el tamaño elegido. `ch` es una unidad tipográfica, no una promesa de que quepan exactamente 65 o 48 caracteres de cualquier letra. Las etiquetas breves se ven completas en el móvil.

Los controles están en `assets/preferencias-lectura.js`, su estilo en `assets/preferencias-lectura.css` y su incorporación al panel existente en `assets/interfaz-comun.js`. `es/lectura-accesible/index.html` explica cómo utilizarlos. No se crea un segundo panel ni otro almacén: `ig-a11y` v2 recibe un objeto `text` opcional y validado.

La presentación inicial conserva el diseño anterior. Los ajustes actúan sobre el contenido principal, no sobre la cabecera o los paneles ni mediante filtros de las ilustraciones. Una muestra en el panel permite comparar letra y espaciado. Las opciones se mantienen al recargar, navegar entre tipos de página, cambiar el idioma activo y sincronizar dos pestañas.

**Restablecer estos ajustes** recupera letra, separaciones y anchura originales sin modificar tamaño, contraste u otras preferencias. **Restablecer**, fuera de ese bloque, sigue reiniciando el conjunto de ajustes propios de la web. El botón antiguo de espaciado rápido continúa disponible: aplicar su combinación sustituye las separaciones personalizadas, pero no cambia la tipografía ni la anchura.

### Qué se ha probado realmente

**25/25 opciones y combinaciones.** Veintiún casos en Home, Condiciones, Autismo ES/EN, Vera, Tus intereses y Vídeos a 1440/390/320 píxeles. Se comprueban independencia, valores calculados, nombre de campos, recarga, retorno exacto a la presentación original y ausencia de desbordamiento, combinando letra alternativa, anchura estrecha, separaciones de 0,12em/0,16em/1,5/2em y tamaño incorporado al 150 %. Se añaden un recorrido mediante selectores nativos y teclado con sincronización entre dos pestañas y tres entradas inválidas. No se afirma haber probado todas las combinaciones matemáticamente posibles.

**6/6 recorridos con Tab.** Se recorren 65 pasos de Tab consecutivos, sin asignar foco mediante código, en Home, Condiciones y Vera a 1440/320 píxeles. Se registran los controles visitados y se comprueba que sean visibles y no queden tapados. Es una muestra de esos recorridos, no una afirmación de haber recorrido cada control de las 895 páginas conectadas.

**4/4 casos con una pista reproduciéndose.** En Home y Condiciones a 1440/320 píxeles se inicia mediante teclado la pista local MP3 «Atmósfera». Se utiliza el `play()` real del navegador; se verifica que el tiempo de reproducción avanza antes y después de recoger el panel con Escape y al continuar con Tab hasta provocar su cierre por superposición. El foco se conserva y Pausa detiene la pista. Se comprueba una pista, no todas; no se mide la audibilidad de un altavoz físico. Se mantiene la posición del reproductor abajo a la derecha.

**Regresiones repetidas:** 45 casos de preferencias y 24 de catálogos, secciones y recuperación tras fallo de red. No se sustituye la batería anterior por las pruebas nuevas. Se comprueba además que `buscador.json`, `videoteca-listado.json`, el catálogo de juegos y `cromos.json` permanecen intactos y que ejecutar la migración dos veces no vuelve a cambiar los archivos.

Las pruebas se realizan con Chromium en GitHub Actions sobre `dist`, con dominios externos bloqueados. Las de música sí usan el archivo local real. Las capturas finales de escritorio y móvil se revisan por separado de las comprobaciones automáticas de geometría; se incluyen en el artefacto de esta tanda.

### Fallos del proceso que se conservan en el registro

La primera ejecución 34104337898 guardó por error el resumen de pruebas encima de la referencia visual inicial. Por eso no llegó a comprobar 21 combinaciones; no se contabilizan como aprobadas. Se separaron ambos archivos y se reconstruyó la comparación a partir de los tres archivos compartidos de la misma rama inmediatamente antes de esta tanda, sin reutilizar contenido de webs antiguas.

Otra prueba esperaba que el panel siguiera abierto después de enfocar el selector externo de idioma, aunque la protección contra superposiciones podía recogerlo. Se adaptó el recorrido para volver a abrirlo y comprobar tanto las preferencias como la explicación en inglés; no se eliminó esa comprobación. En la inspección de móvil se acortaron las etiquetas de anchura, que se cortaban dentro del selector; la prueba final mide también el texto elegido, no solo el tamaño del campo.

### Límites que siguen abiertos

Quedan temas completos y fondo opaco, guía utilizable sin ratón, vista centrada, lectura en voz alta avanzada, alternativas textuales de materiales y revisión audiovisual. El panel sigue llegando al 150 %: no se anuncia aquí una prueba real de zoom de navegador al 200 %/400 %. Tampoco se afirma evaluación con lectores de pantalla, braille, control por voz o teléfonos físicos, ni revisión documental adicional de fuentes clínicas.

Evidencia de esta actualización: `reports/text-preferences/after.json`, `base.json`, `baseline-values.json`, `regression-preferences.json`, `regression-controls.json`, `first-after.json`, `first-base.json` y las capturas del artefacto `texto-personalizable-cierre`. El historial previo se mantiene a continuación.

## Versión y resultado
Base revisada: `826925143a934f7ec0a54671922edef249a9e462`. La copia exacta se obtuvo en `cb9e9984ab41a837c5a267693caedc5e9a9533e3`; entre ambas solo se añadió el flujo de exportación. No se utiliza una versión histórica de la web.

La ejecución **34100926075** terminó correctamente. Código e informes resultantes: **596db35592d7bd47aed53c4ffe6e89be9a123815**. Rama `ajustes/auditoria-web`, propuesta #2 todavía en borrador, sin incorporar a `main` ni publicar en `irisgreen.eu`.

Documento atendido: devolución «Se ha pegado el markdown(20260907-080547).md». Sus añadidos se tratan como criterios que comprobar, no como fallos dados por hechos. Se separan implementación, comprobación con un alcance concreto y publicación.

| Batería repetida en esta ejecución | Resultado |
|---|---:|
| Ajustes del sistema, señal de selección y foco bajo paneles | 36/36 |
| Recorrido completo pedido, en tres anchuras | 3/3 |
| Conservación de preferencias | 45/45 |
| Controles interiores y ampliación | 9/9 |
| Catálogos y recuperación de red | 24/24 |

Las pruebas usan Chromium sobre el directorio público generado `dist` en GitHub Actions, con recursos externos bloqueados. Movimiento y colores forzados se emulan mediante el navegador. No equivalen a pruebas de dispositivos físicos, voces reales, lectores de pantalla, líneas braille, control por voz o comprensión con usuarios.

## 1. Adaptaciones de esta tanda

### Reducir movimiento del dispositivo
**Qué había:** los estilos compartidos y el Rincón tranquilo ya incluían `prefers-reduced-motion`. No se afirma que faltara esa adaptación.

**Qué cambia:** el controlador reconoce la preferencia al entrar y cuando cambia durante la visita; el panel explica que está activa. La elección propia de Iris Green permanece separada de la del dispositivo.

**Dónde:** `assets/preferencias-lectura.js` y `assets/preferencias-lectura.css`, en la rama de revisión.

**Prueba y resultado:** ocho páginas a 1440/320 píxeles; cambiar las preferencias emuladas y Restablecer no introducen animaciones ni escriben la elección del sistema como preferencia propia del sitio. En Rincón tranquilo se inicia y detiene la actividad y se comprueban sus tres anillos. Aprobado dentro de los 16 escenarios de sistema.

**Pendiente:** dispositivos físicos, otros motores y servicios de vídeo externos, que este CSS no controla.

### Colores forzados del sistema
**Qué había:** el navegador podía imponer su paleta, pero no existían estas reglas compartidas específicas ni la indicación en el panel.

**Qué cambia:** colores de sistema para superficies, texto, campos, bordes, botones y foco cuando `forced-colors` está activo. No se desactiva la adaptación con `forced-color-adjust:none` ni se aplica un filtro a las ilustraciones.

**Dónde:** archivos de preferencias, sin segundo panel ni tema obligatorio. La presentación predeterminada conserva el cristal y el degradado.

**Prueba y resultado:** colores forzados emulados en escritorio/móvil, durante cambios del sistema y después de restablecer. El panel reconoce el sistema y los controles conservan señales visibles. Revisadas las capturas de Condiciones y Tus intereses a 320 píxeles y Home a 1440 píxeles.

**Pendiente:** paletas personalizadas reales, dispositivos y revisión específica de todos los gráficos y juegos.

### Selección distinguible además del color
**Qué había:** filtros con texto, `aria-pressed` e inversión de fondo/tinta. No se atribuye automáticamente una infracción a la presentación previa: una diferencia suficiente de luminosidad también puede comunicar un estado.

**Qué cambia:** se subraya el texto de los filtros compartidos seleccionados y controles de Lectura activados. Se refuerzan enlaces dentro del texto. No se alteran ilustraciones ni tamaños de botones.

**Dónde:** `assets/preferencias-lectura.css`.

**Prueba y resultado:** ocho secciones —Condiciones, Situaciones, Vídeos, Directorio, Taller, Investigación, Tus intereses y Vida diaria— con colores forzados; también controles de Lectura. Las ocho comprobaciones de selección verifican subrayado y respeto de la paleta.

**Pendiente:** inventario de respuestas, errores, leyendas, gráficos y estados de todos los juegos. Esta tanda no declara toda la web adaptada al daltonismo.

### Foco tapado por paneles
**Qué había:** Música/Lectura no desplazaban el contenido, pero podían quedar encima de un control enfocado fuera del panel. La comparación anterior reproduce doce superposiciones.

**Qué cambia:** el panel se recoge cuando realmente coincide con un control que recibe el foco fuera de él; no roba el foco. Música mantiene su posición inferior derecha y recogerla no llama a pausa. Se incorpora tratamiento para cabecera fija y guía.

**Dónde:** `assets/interfaz-comun.js` y el evento `ig:uncover-focus` de `assets/musica.js`.

**Prueba y resultado:** doce superposiciones dirigidas sobre controles existentes de Home, Condiciones y Tus intereses, a 1440/320 píxeles, con ambos paneles. Se comprueban superposición inicial, cierre posterior, foco conservado y altura del documento intacta. 12/12 aprobadas.

**Actualización posterior:** la tanda de tipografía incorpora seis recorridos reales de 65 pasos con Tab y cuatro pruebas con el MP3 «Atmósfera» reproduciéndose al recoger el panel mediante Escape y por superposición. El tiempo avanza y no se pausa; véase el alcance de esos casos al comienzo del inventario. Siguen pendientes el barrido de todos los controles, las ramas específicas de guía, zoom 200 %/400 %, otras pistas y motores y dispositivos físicos. Los doce casos descritos arriba siguen siendo los casos programáticos de la tanda anterior.

### Recorrido representativo pedido
**Qué había:** persistencia y páginas individuales probadas, pero no esta misma secuencia de enlaces y acciones.

**Qué cambia:** prueba `scripts/test_accessibility_journey.py`, sin crear contenido nuevo ni alterar el estado directamente.

**Dónde:** prueba sobre `dist` de la rama de revisión.

**Prueba y resultado:** Inicio; tamaño 130 % y espaciado elegidos desde Lectura; búsqueda de autismo; abrir ficha; entrar en catálogo y juego de Vera; utilizar un botón alternativo; Tus intereses y filtro Minerales; Rincón tranquilo con iniciar/detener; inglés activo; Volver atrás. En los ocho pasos se conserva la configuración, no hay desbordamiento y no se solicita voz. Tampoco se piden archivos de audio durante el recorrido. 3/3 recorridos aprobados a 1440/390/320 píxeles.

**Pendiente:** ayudas técnicas, dispositivos táctiles reales y más combinaciones. Hacer una elección no sustituye la prueba de partida completa registrada en tandas anteriores.

### Explicación pública de accesibilidad
**Qué había:** promesas demasiado generales sobre teclado, disponibilidad, servidores de voz y ausencia de cambios de maquetación.

**Qué cambia:** se explican los controles presentes, almacenamiento, límites, movimiento/colores del sistema, voz y música. Se retiran las afirmaciones absolutas y no se publican funciones pendientes como existentes.

**Dónde:** `es/lectura-accesible/index.html`, todavía sin publicar.

**Comprobación y resultado:** correspondencia entre las instrucciones, los controladores y las pruebas. La guía distingue la voz por fragmentos de los textos preparados de algunas páginas, y reconoce que no ofrece todavía pausa, continuación o velocidad. No garantiza procesamiento local de todas las voces. Abrir Música no inicia reproducción; Escuchar, elegir pista y Anterior/Siguiente sí son acciones que pueden iniciarla.

**Pendiente:** comprensión con lectores destinatarios y actualización de la explicación tras cada nueva adaptación. No se anuncia certificación WCAG ni prueba con braille.

## 2. Inventario de capacidades existentes y ampliaciones pendientes

Todos los cambios implementados de la tabla están en la rama de revisión, no publicados. Los resultados de tandas anteriores se identifican como tales, sin sumarlos como pruebas nuevas.

| Adaptación | Qué había y qué cambia | Implementación | Prueba y resultado | Otra comprobación o desarrollo pendiente |
|---|---|---|---|---|
| Preferencias comunes | Estado unificado previamente en `ig-a11y` v2; se conserva. | Migración anterior conecta 25 páginas dinámicas y 870 archivos estáticos; no se afirma haber probado 895 páginas individualmente. | 45 escenarios repetidos: restauración, límites, recarga, navegación, pestañas, almacenamiento inválido/bloqueado y Reset. Aprobados. | Más navegadores y visitas reales. |
| Tamaño del contenido | Mismos pasos 100/115/130/150 %, porcentaje y límites. Sin ampliación nueva. | Implementado hasta el 150 % incorporado. | Persistencia, límites y nueve comprobaciones de panel/cromos repetidas. Aprobadas. | Texto al 200 % y zoom de navegador 200 %/400 %. |
| Espaciado actual | Antes había una combinación única; se conserva como ajuste rápido. | Cuatro controles independientes añadidos: letras, palabras, líneas y párrafos; Original por campo y muestra. | 25/25 escenarios nuevos, incluida combinación de 0,12em/0,16em/1,5/2em al 150 %, y regresiones de preferencias/catálogos repetidas. | Más combinaciones y tolerancia a herramientas externas de espaciado; otros motores y zoom real. |
| Tipografía alternativa | El diseño original permanece por defecto. | Selector con Arial, Verdana, Georgia o familias similares disponibles en el dispositivo, sin descargar tipografías. | Alternancia de fuentes, campos etiquetados, teclado, persistencia y retorno al original en la nueva batería. | Disponibilidad de cada fuente en dispositivos físicos, comprensión con usuarios y otras lenguas; no se promete mejora universal por dislexia. |
| Anchura de lectura | Se conserva la redistribución anterior y se añade una elección personal. | Original, Media y Estrecha con límites tipográficos de 65ch/48ch. | Combinación con tipografías, cuatro espaciados y 150 % en siete páginas/tres anchuras; recuperación del original. | Más páginas y combinaciones, zoom real y usuarios. |
| Temas y fondo opaco | Más contraste no es un sistema completo de temas. | Temas completos pendientes; colores forzados del sistema se tratan aparte. | Esta tanda no los da por incorporados. | Temas y contraste sobre los fondos efectivos. |
| Guía de lectura | Sigue al puntero; se añade apartarla del foco. | Básica, sin controles propios de colocación. | Presencia/persistencia en pruebas anteriores. | Control por teclado y botones táctiles, altura/posición y geometría específica del foco. |
| Lectura en voz alta | Fragmentos en fichas y textos preparados en algunas páginas dinámicas. | Existente; sin arranque por recordar preferencias. | Llamadas registradas; cambios de presentación no reinician y navegar no inicia voz. | Pausa, continuación, velocidad, selección, textos largos, voces/errores reales y procesamiento local/remoto. |
| Vista centrada en contenido | No se ocultan fuentes ni instrucciones. | Ampliación pendiente. | No se anuncia incorporada. | Diseño/pruebas sin pérdida de contenido ni de la salida a la vista original. |
| Controles grandes | Texto ampliable y alternativas de Vera/mapa, de tandas previas. | Implementados. | 12 escenarios de los dos juegos en tanda anterior; una alternativa se usa otra vez en el recorrido actual. | Táctiles físicos y todas las zonas restantes. |
| Alternativas a arrastrar | Algunos juegos ya utilizan selección y destino; Vera/mapa tienen alternativas. | Existentes; no cobertura global declarada. | Partidas previas mediante botones/teclado. | Pruebas específicas con puntero táctil sin arrastrar y registro por juego. |
| Control por voz | Existen nombres accesibles; no se ha revisado su concordancia íntegra con las etiquetas visibles. | Parcial, sin validación global. | Fuera de esta batería. | Inventario de nombres, incluidos A+/A−, y prueba real por voz. |
| Lectores de pantalla y braille | HTML con títulos/enlaces/controles y mejoras previas de foco. No hay un interruptor «para ciegos». | Base preparada parcialmente; no certificada. | DOM/teclado, no usuarios con ayudas técnicas. | Lectores de pantalla y líneas braille reales. |
| Juegos y cartas PNG | Reglas e imágenes se conservan. | Funciones previas. | En sus tandas: 52 partidas, 26 colecciones, 13 cartas y 6 casos de texto/teclado. No se repiten íntegros aquí. | Texto equivalente de descargas; alternativas no visuales por actividad sin revelar la solución. |
| Vídeos | 47 miniaturas locales de YouTube con espacio reservado. | Implementadas previamente. | Nueve escenarios de miniaturas en su tanda; catálogo/controles repetidos ahora. | Vimeo, reproducción remota, subtítulos revisados y transcripción descriptiva. |
| Catálogos y búsqueda | Índice compartido y filtros/recuentos reales. | Conservados sin cambios de datos. | 24 escenarios de controles y recuperación repetidos. Aprobados. | Más tareas y comprensión; la prueba técnica no valida contenido. |
| Fuentes y contenido | Revisión documental delimitada de Autismo/TDL y registros parciales. | Sin cambios documentales en esta tanda. | Integridad de catálogos; no nueva validación científica. | Contraste por afirmación y referencias reconocibles por autor/organismo, título, edición/publicación y apartado. Año del documento distinto de fecha de consulta, sin grados ni fechas ficticias. |

## 3. Integridad y errores de la comprobación

La primera ejecución posterior, 34100247598, aprobó 34/36 escenarios. Los dos restantes se detuvieron porque el test trataba `.ring` como un único elemento, cuando existen tres anillos. La prueba final comprueba los tres y conserva los resultados anteriores en `first-tests.json`; no se suprime un requisito para hacer pasar la batería.

Los doce casos iniciales de superposición tenían el panel abierto encima del control; los doce finales lo recogen manteniendo el foco y la altura de la página. Esta mejora no depende de cambiar el sitio habitual del reproductor.

Se comprueba que `buscador.json`, `videoteca-listado.json`, `es/recursos/juegos/juegos-120.json` y `es/intereses/cromos.json` no cambian. La migración es repetible y se comprueba la sintaxis JavaScript.

Los intentos de navegador local en el contenedor fueron bloqueados por el entorno con `ERR_BLOCKED_BY_ADMINISTRATOR`. No se atribuyen esos fallos al sitio ni se utilizan para aprobarlo. Los resultados funcionales de esta entrega proceden de GitHub Actions.

## 4. Evidencia y mantenimiento

- `before.json`: comparación anterior.
- `first-tests.json`: primera comprobación posterior y error de selección de anillos.
- `after.json`: los 36 escenarios de sistema, selección y foco.
- `journey.json`: los tres recorridos por enlaces/controles reales.
- `regression-preferences.json`: 45 escenarios de preferencias.
- `regression-panel-bounds.json`: nueve comprobaciones de paneles/ampliación.
- `regression-controls.json`: 24 escenarios de catálogos/recuperación.
- `first-application.json`: archivos y hashes de la aplicación inicial.

Capturas e informes completos: artefacto `sistema-accesible-resultados` de la ejecución **34100926075**. Los informes no se copian al directorio público `dist`. La página de ayuda es el único texto público modificado y todavía no está desplegado.

Para mantener este inventario, una adaptación nueva debe indicar por separado implementación, prueba, versión y limitaciones. Ni cambiar CSS demuestra uso con braille, ni pasar una batería en la rama de revisión demuestra publicación.
