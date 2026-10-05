# Claude Design · corrección de entrada directa · Cielo y Vida marina

2026-10-05 · Instrucción explícita de María tras la prueba local.

«El círculo con el puntero no funciona, se tiene que poder seleccionar con el ratón directamente un área o punto [...] en ambos [...] las flechas [...] tienen que servir para las flechas del teclado».

## Contrato común obligatorio
- Ratón: clic directamente en el punto o zona de la escena que se quiere seleccionar. La selección nace en la posición pulsada, no en una retícula fija central ni en un círculo que haya que arrastrar sobre el objetivo.
- Arrastrar el fondo mueve la vista. Distinguir clic de arrastre: terminar un arrastre no selecciona, no identifica y no activa Examinar.
- Rueda para zoom sólo cuando el usuario está interactuando con la escena; mantener alternativas y no bloquear el scroll de la página indiscriminadamente.
- Teclado: las teclas físicas de flecha mueven la vista cuando la escena tiene foco. +/− para zoom. No capturar las flechas en campos de texto u otros controles ni globalmente sobre toda la página.
- Selección y confirmación por teclado equivalentes: cursor de selección o recorrido de señales sin revelar nombres antes de tiempo; Enter/Espacio selecciona/confirma según el control con foco. Ayuda breve con nombres claros. El cursor accesible no obliga a usar una retícula con ratón.
- Touch: toque directo selecciona; arrastre navega. Ofrecer alternativa a gestos complejos.
- Las crucetas visibles no son el mecanismo principal de ratón. Si se conservan botones direccionales como alternativa accesible/táctil, quedan en controles secundarios y no sustituyen entrada directa.
- Seleccionar no recentra ni cambia el zoom automáticamente. No identificar por hover.
- Aplicar la transformación real cámara/zoom/tamaño de escena al hit testing: lo pulsado debe coincidir con lo seleccionado.
- Si varios objetivos coinciden en una zona, ofrecer elección contextual sin nombres reveladores ni escoger uno arbitrariamente.
- Mantener foco, feedback accesible, NORMAL/REDUCED/NONE, forced-colors, targets y canon NAVY.

## Cielo
Clic en una zona del cielo la selecciona allí mismo. Marca discreta local y acción Examinar. No exigir desplazar el patrón hasta un círculo central. Mantener EXPLORE → LOCATE → REVEAL: la confirmación semántica permite identificar; la selección inicial no revela automáticamente nombres ni figura completa. Cerrar profundidad conserva encuadre/zoom.
Esta corrección reemplaza la retícula central como interacción principal de ratón del prototipo anterior.

## Vida marina
Mantener natación, navegación y luz aprobadas provisionalmente por María. Clic/toque sobre un punto orienta la luz a ese punto; pulsar un animal visible permite seleccionarlo directamente. No exigir pasar por una lista ni una cruceta para señalarlo.
Examinar sigue respetando visibilidad e iluminación válidas: no revelar ni permitir seleccionar animales invisibles fuera de pantalla. Un punto vacío puede orientar la luz sin identificar nada. Cuando haya varios candidatos válidos, elección contextual.
Conservar Encuadrar e iluminar como ayuda explícita accesible, cuyo movimiento de cámara es deliberado y anunciado; no trasladar ese autoencuadre al clic ordinario.
No pedir a María repetir la prueba de natación por esta corrección de controles.

## Evidencia de aceptación
Demostrar en cada runtime: mover vista arrastrando → pulsar una zona/objetivo fuera del centro → selección en ese lugar → confirmar → conservar cámara.
Repetir con zoom y tras redimensionar; verificar que arrastrar nunca selecciona al soltar. Repetir navegación con flechas físicas, selección y confirmación sólo con teclado; toque directo en móvil.
No declarar el cambio realizado por añadir listeners: entregar ZIP exacto y grabación usando los gestos solicitados. Retest Axioma y prueba María pendientes.

Alcance: orden de patch local para Claude, no modificación realizada aún en los ejecutables de Descargas. No rediseñar áreas ni regenerar assets. NO MAIN · NO PUBLIC DEPLOY. Motor continúa con Sabik.
