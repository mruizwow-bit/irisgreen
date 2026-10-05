# Claude Design · corrección de entrada directa · SÓLO CIELO

2026-10-05 · Aclaración final de María: «Vida marina lo hace, en Cielo no» y «flechas para teclado no para ratón».

Esta revisión sustituye la orden anterior en este mismo archivo y corrige el alcance del comentario #323/6000213227. El nombre del archivo se conserva para no romper el enlace. NO hay encargo de modificar Vida marina: María confirma que su manejo directo ya funciona.

## Fallo observado por María
La interacción de Cielo obliga a manejar un círculo/retícula para escoger lo que se quiere observar. Resulta incómoda, produce mareo y dificulta acertar la selección. Es un fallo de producto; no se resuelve simplemente cambiando el tamaño del círculo o la velocidad.

## Entrada requerida en Cielo
- Ratón: clic directo sobre el punto o zona deseados. La selección se sitúa exactamente allí. No mover un círculo con el puntero ni desplazar el cielo para introducir el objetivo en una retícula central.
- Cielo quieto mientras se apunta. Mover el puntero no mueve cámara ni retícula.
- Arrastrar el fondo mueve la vista voluntariamente. Al soltar se detiene sin inercia añadida. Separar clic de arrastre: soltar un arrastre no selecciona ni examina.
- Seleccionar no recentra, no hace pan y no cambia zoom. Marca local discreta y acción Examinar. No mantener un círculo grande como herramienta principal.
- Flechas = teclas físicas del teclado, NO botones de flechas que haya que pulsar con el ratón. Retirar la cruceta de flechas del flujo principal visible.
- Las teclas físicas mueven la vista sólo con la escena enfocada; no secuestrar flechas en otros controles. Ofrecer selección y confirmación equivalentes por teclado, con ayuda breve.
- +/− para zoom. Mantener controles accesibles de zoom; no confundir la corrección de flechas con eliminar todas las alternativas accesibles.
- Touch: toque directo selecciona y arrastre mueve vista. Si se necesita alternativa a arrastrar, ofrecerla de forma secundaria con nombres claros, sin volver a convertir una cruceta pulsable en el manejo principal.
- Hit testing correcto tras pan, zoom y resize: lo señalado coincide con lo seleccionado. Si hay varios objetivos posibles, elección contextual sin revelar nombres.
- Mantener EXPLORE → LOCATE → REVEAL: seleccionar una zona no identifica automáticamente. Examinar confirma el hallazgo; después se accede a figura e información.
- Conservar NORMAL/REDUCED/NONE, foco, feedback accesible, forced-colors y canon NAVY. No activar movimiento innecesario para seleccionar.

## Vida marina
KEEP de la interacción actual. No tocar ratón, luz, natación ni cámara por esta orden. Pendientes propios de retest/expansión se gestionan aparte.

## Entrega y aceptación
ZIP de Cielo corregido, hash y grabación: ratón señala un lugar fuera del centro → clic selecciona ese lugar sin mover el cielo → Examinar. Demostrar aparte arrastre voluntario y flechas físicas de teclado. Probar zoom/resize, teclado y touch. Cerrar información conserva cámara y selección.
María debe poder escoger lo que quiere sin perseguir un círculo ni sufrir desplazamientos inducidos.
Esta es una orden pendiente de implementación; los ZIP de Descargas aún no están corregidos. NO MAIN · NO PUBLIC DEPLOY. Motor sigue con Sabik.
