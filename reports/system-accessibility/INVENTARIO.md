# Iris Green · Inventario de accesibilidad y aplicación de la devolución

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

**Pendiente:** estas pruebas utilizan foco programático para reproducir la geometría; no son un barrido completo con Tab. Faltan pruebas específicas de las ramas de cabecera/guía, zoom 200 %/400 % y navegadores adicionales. Que recoger Música no pausa se determina por el código de `close(false)`; esta tanda no reproduce una pista durante esa operación.

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
| Espaciado actual | Una opción combina letras, palabras y líneas. | Implementado como combinación, no cuatro controles. | Conservación y combinación con tamaño en regresión/recorrido. Aprobadas. | Cuatro controles independientes y tolerancia conjunta a los valores de espaciado WCAG. |
| Tipografía alternativa | Se mantiene la tipografía actual. | Selector pendiente. | No se anuncia probado. | Licencias, caracteres, carga y comparación; sin prometer una mejora universal por dislexia. |
| Anchura de lectura | Se conserva la redistribución de columnas. | Correcciones existentes; selector personal pendiente. | Paneles/cromos y recorrido representativo. | Selector y combinación con fuentes/espaciados. |
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
