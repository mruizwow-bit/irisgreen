# CLAUDE DESIGN · CONSTRUCCIÓN · NUEVO PROTOTIPO JUGABLE

María ha probado «El taller de las islas» y lo rechaza como producto: «eso no es un juego». El PASS técnico anterior no es aprobación de diversión, presentación ni experiencia. No maquilles la cuadrícula actual.

## Objetivo
Crear un pequeño juego de construcción que apetezca jugar: explorar un lugar, obtener materiales, construir algo propio, usar lo construido y abrir nuevas posibilidades. Pertenece a Juegos: no es una rutina educativa, una ficha de recursos, Descubrimiento ni una experiencia sensorial.

Dragon Quest Builders es una referencia de la relación personaje–mundo–construcción, no un encargo de copiar sus personajes, arte, interfaz o escala.

## Entrega autorizada
Implementa un prototipo real, con una escena completa y un recorrido de unos 5–10 minutos, más construcción libre al terminar. Código y runtime autorizados para esta prueba local. No entregues otro storyboard o una imagen con botones. NO MAIN · NO PUBLIC DEPLOY. Motor sigue con Sabik.

## Mundo y presentación
Un pequeño archipiélago o enclave costero con dos orillas, agua, materiales, un lugar interesante al otro lado y una terraza elevada. Volumen y alturas legibles mediante una escena 3D o una representación isométrica con profundidad real en la lectura. Personaje femenino reconocible, que camina, gira y realiza acciones; no un marcador de posición.
La escena ocupa el espacio principal. Materiales y construcciones deben parecer madera, piedra, plataformas y escaleras. La cuadrícula aparece sólo al construir y de forma discreta. Retira R1/R2, coordenadas y etiquetas de depuración de la vista de juego.
No sustituyas el juego por una imagen de fondo: el personaje recorre las superficies que construye y los cambios tienen consecuencias visibles. Usa recursos existentes adecuados; si falta arte, declara qué es provisional. No afirmes que una silueta abstracta es el arte terminado.

## Bucle jugable de esta prueba
1. Entrar y empezar en una sola acción. Objetivo breve: «Llega a la terraza y crea allí tu refugio». Mostrar el lugar en el mundo sin resolver el camino.
2. Caminar y recoger madera y piedra de elementos reconocibles. Interacción breve, sin repetir trabajo de recolección para alargar artificialmente.
3. Elegir por dónde cruzar y construir. Deben existir al menos dos soluciones viables, con diferencias de recorrido o consumo; el juego no exige una secuencia exacta de casillas.
4. Atravesar físicamente lo construido. Abrir la caja del otro lado aporta materiales y desbloquea escaleras. Explicar ese desbloqueo por su consecuencia, sin una pantalla de premios arbitrarios.
5. Construir una subida utilizable y llegar a la terraza.
6. Construir allí algo propio: suelo, paredes y una entrada que el personaje pueda atravesar. Dejar variar forma y disposición; no finalizar obligando a copiar una plantilla.
7. Poder seguir construyendo, modificar y guardar. Sin cronómetro obligatorio, daño ni pérdida irreversible de materiales en esta primera prueba.

Conservar de la base anterior lo útil y probado: costes, inventario, apoyo, alcance, colisiones, retirada con dependencias, devolución, deshacer y guardado. Es una referencia de lógica; no obliga a conservar su interfaz o su representación. Si cambias reglas, documenta el cambio y vuelve a probarlo.

## Manipulación directa
Ratón: seleccionar una pieza en una barra compacta, apuntar sobre el terreno, ver una previsualización y pulsar para colocar. Girar antes de colocar; cancelar con Escape. Retirar y deshacer visibles.
Touch: tocar para seleccionar la ubicación y confirmar con un botón claro; no depender de hover, clic derecho o arrastre obligatorio.
Teclado: caminar, seleccionar piezas, mover el cursor de construcción, girar, colocar, cancelar y deshacer. Las flechas actúan según el modo, que debe verse claramente.
Cámara: permitir recorrer el escenario y acercar/alejar; distinguir gesto de cámara de colocación. No moverla sola mientras se confirma una pieza.
Toda colocación inválida muestra la causa junto al preview, con texto e indicador que no dependa sólo del color. No destruir una construcción que sostiene otra sin resolver antes sus dependencias.

## Interfaz
Inventario compacto, barra de piezas y ayuda contextual breve. Ayuda completa bajo un botón; no llenar la pantalla de instrucciones. Diferenciar «Recorrer» y «Construir» sin duplicar controles.
El bucle debe entenderse jugando: no exigir leer un manual ni utilizar paneles de coordenadas.

## Canon Iris Green obligatorio
Sólo NAVY, sin selector de tema:
- Fondo general #0B1A2B; paneles #15304A; superficie secundaria #1D3D5C.
- Texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA.
- Foco/acento #C3B8FF; bordes de controles #8494A8; separadores #2A4460.
- Botón principal #DCE8F2, texto #0B1A2B.
- Cuerpo Atkinson Hyperlegible local, 16 px, interlineado 1.6.
- Títulos Newsreader local, peso 600, interlineado 1.2.
- Portada Newsreader 400, 40–56 px adaptables, interlineado 1.06.
- Introducción Atkinson ~19 px, interlineado 1.58.
El canon corresponde a página, paneles, textos y controles. El mundo conserva colores legibles de sus materiales. Sin modales blancos como los del prototipo rechazado.

## Accesibilidad y movimiento
320/390/1440, texto al 200 %, botones de al menos 44 px, foco independiente de selected, nombres accesibles y feedback textual. NORMAL / REDUCED / NONE: reducir o eliminar animación ornamental y transiciones sin impedir caminar, construir o entender el estado. Forced-colors y alternativa textual operable para las acciones y el estado del mundo. Sin sonido obligatorio ni reproducción sonora automática.

## Entrega y evidencia
ZIP autónomo con index.html, recursos y fuentes locales; sin instalación ni servicios externos. El ZIP es la versión canónica y debe coincidir con el lienzo.
Incluye README breve, controles, reglas, limitaciones, SHA-256 y manifest. Graba una partida real: obtener materiales → construir → cruzar → conseguir escaleras → subir → construir y modificar el refugio.
Comprueba las dos soluciones, una colocación inválida, retirada con dependencias, deshacer, guardado, teclado y versión móvil; distingue lo probado de lo pendiente.
Antes de entregar pregúntate: ¿se entiende qué puedo hacer?, ¿mis construcciones cambian el mundo?, ¿tengo decisiones reales?, ¿apetece seguir construyendo?
Siguiente: revisión técnica Axioma y HUMAN QA María sobre el ejecutable. Ningún banco automático declara que el juego sea divertido.
