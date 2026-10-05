# Orden Claude Design · Peces · Natación y controles R02

Fecha: 2026-10-05. Coordinación: Nexo. Issue #323.
Estado: PRODUCT_REWORK_REQUIRED_BY_MARIA.
Base: descubrimiento-peces-R01-rev1.zip, SHA256 600a6acffa7bf02b1270f74678a892ef3e5bb9163263099fed4cf33951ec9bd7.

## Decisión de producto de María

María observa que sólo se mueve la luz y exige: «tienen que nadar y los tres botones y las flechas son para lo mismo». Añade: «la pantalla se tiene que poder mover de alguna forma también, sino solo salen los peces que llegan a ese trozo de pantalla». Natación y navegación del entorno son requisitos independientes y obligatorios.

Evidencia: captura image(20261005-155647).png, Biblioteca libfile_ff41cf3cb03c81919c9287e3c583defc. Se ven cuatro flechas junto a «Acerca la luz a una señal» y tres filas «Orientar luz aquí», con posición duplicada dentro de cada fila. Una captura fija no demuestra movimiento o ausencia de movimiento; esa observación procede del uso reportado por María. No está confirmada la identidad del runtime de la captura. El canvas Design y el ZIP son implementaciones diferentes.

Nexo asume la limitación del encargo anterior: excluía peces animados. Esta orden sustituye esa exclusión para la natación del prototipo. TECHNICAL_PASS != PRODUCT_PASS. El patch de caché pendiente sigue siendo necesario, pero ya no basta para cerrar la entrega.

## Experiencia que debe construirse

Entrar en una escena donde los animales nadan, recorrer el entorno moviendo la vista, dirigir la luz, observar una parte del cuerpo y decidir Examinar. Identidad y profundidad aparecen después de esa acción. Se mantienen álbum, conocimiento persistente y regreso a la exploración.

Comenzar con los tres encuentros existentes. No esperar más imágenes, ni ampliar a trece en meso-01. No mezclar hábitats ni presentar asignaciones heredadas como revalidadas.

### Natación visible

- En modo NORMAL, tras la acción de entrar/iniciar exploración, los animales se desplazan con trayectorias continuas y movimiento corporal visible. No dependen de mover el ratón para animarse.
- Cada animal tiene su propio recorrido y fase; no mover el conjunto como una sola lámina. Orientación, avance y articulación deben resultar coherentes visualmente.
- No basta trasladar, balancear, rotar o estirar el PNG completo. Implementar articulación mediante una malla o capas derivadas de los assets existentes, si su geometría lo permite. No redibujar ni sustituir los masters aprobados. Si algún asset no permite una articulación convincente, documentar la limitación exacta y enseñar la prueba; no afirmar natación terminada con un sprite rígido.
- Los tres animales no tienen por qué compartir una animación. Cualquier afirmación de locomoción biológica específica requiere revisión de Senda/Astra; este primer movimiento es una representación ilustrada pendiente de esa revisión.
- Luz y oscuro de cada par usan exactamente la misma transformación, pose y deformación. La máscara de luz opera sobre el cuerpo en su posición actual. Evitar doble silueta y separación entre ambas imágenes.
- La detección de examinable debe usar el cuerpo visible y animado, no la antigua ancla inmóvil. Señales accesibles y posiciones también se actualizan sin reconstruir controles.
- Sin teletransportes visibles al cerrar un recorrido, sin atravesar paneles, sin entradas bruscas. Los encuentros deben permanecer localizables; no convertir la observación en una prueba de reflejos.
- Al pulsar Examinar, pausar la escena y mostrar «Exploración en pausa». Mantener la pose exacta mientras se lee o amplía. Seguir explorando restaura esa escena; respetar una pausa manual previa.
- Pausar/reanudar es una acción visible y accesible. Con pestaña oculta, detener animación. No mantener un bucle de render activo en pausa o NONE.

### Movimiento y accesibilidad

| Estado | Comportamiento |
|---|---|
| NORMAL | Natación continua tras iniciar; control Pausar siempre disponible. |
| REDUCED | Trayectorias cortas y menor desplazamiento corporal, sin aceleraciones bruscas ni movimiento de cámara automático; pausa disponible. |
| NONE | Animales quietos en poses legibles, luz y navegación discretas bajo acción del usuario; mismas posibilidades de encontrar, examinar y aprender. |

Respetar la preferencia de movimiento existente. Sin música, destellos, lluvia de burbujas ni cámara automática añadidos por esta orden. El propósito es observar animales vivos en una escena explorable.

## Controles: una función clara por grupo

Las cuatro flechas de la captura y los tres botones Orientar luz aquí controlan la misma luz: dirección incremental frente a apuntado directo. No describir esas flechas como cámara. El ZIP tiene además controles Vista; eso no demuestra que existan o funcionen en el canvas fotografiado.

Flujo principal:
- Puntero sin arrastrar / toque breve en escena: orientar luz.
- Arrastrar sobre la escena con ratón o dedo: desplazar la vista del entorno. Distinguir tap de arrastre mediante umbral de movimiento; durante el arrastre no disparar apuntado ni Examinar. Al terminar no producir un salto de luz causado por interpretar el mismo gesto como toque.
- Un único grupo principal de cuatro flechas llamado «Mover vista»: alternativa accesible al arrastre. Las flechas del teclado también desplazan la vista sólo cuando la escena tiene el foco; no capturar el teclado fuera de ella.
- Zoom +/− y «Volver al inicio» para recuperar orientación. Sin obligar a pellizcar o usar rueda.
- Examinar: acción semántica sobre un encuentro visible e iluminado.
- Pausar/reanudar: movimiento de los animales.
- Cámara/zoom son obligatorios. Los botones Vista cambian realmente el encuadre, no orientan la luz. No dejar controles sin efecto ni duplicar crucetas en el flujo principal.

### Entorno navegable obligatorio

El mundo tiene extensión mayor que el viewport inicial, con contenido alcanzable más allá de él. En 320, 390 y 1440 se debe poder salir de la vista inicial sin depender de que un animal nade hasta ella. No basta ampliar la misma captura ni desplazar el bloque HTML dentro de la página.

- Separar coordenadas del mundo, cámara y posiciones locales de los animales. Pan y zoom cambian la vista; la natación cambia a cada animal dentro del mismo mundo. No reiniciar trayectorias, descubrimientos o álbum al mover la cámara.
- El encuadre inicial y los límites deben dejar recorrido útil en ambos ejes. Una flecha al límite debe comunicar ese límite; no parecer averiada.
- La cámara permanece donde la coloca la persona; no sigue automáticamente a los peces. Se puede buscar, detenerse, iluminar y examinar.
- Al abrir/cerrar profundidad, conservar cámara, zoom, luz y estado de descubrimiento. Volver al inicio reencuadra explícitamente, sin borrar progreso.
- Ofrecer una referencia espacial discreta y neutral que permita orientarse, sin mapa que revele identidades o rutas hacia animales.
- Con REDUCED/NONE, la vista sigue siendo navegable mediante cambios cortos/discretos. NONE desactiva animación, no la posibilidad de recorrer el entorno.

La alternativa «Explorar con controles» debe ser un panel desplegable accesible desde el inicio, cerrado por defecto en el flujo visual. Mantener sus señales y acciones equivalentes para teclado/lector de pantalla; no eliminarla por ser una alternativa al control espacial.
- Eliminar la repetición del texto de posición dentro de cada fila.
- Mantener nombres neutrales antes de Examinar; no revelar la especie al apuntar.
- Orientar luz aquí apunta a la posición actual del animal y ofrece una oportunidad estable de examinar; no obliga a perseguir un botón ni a pulsar dentro de un tiempo límite.
- Nodos, foco e IDs permanecen estables mientras nadan los animales. No anunciar cada fotograma: informar sólo cambios útiles y acciones.
- Controles táctiles >=44 px, foco visible, Enter/Space, alternativa a arrastre, forced-colors y texto al 200%.

La escena debe recuperar protagonismo. No mantener tres grandes tarjetas de acceso directo ocupando permanentemente el área bajo el mar.

## Canon visual obligatorio

Sólo NAVY; sin selector de tema.

| Elemento | Valor |
|---|---|
| Fondo general | #0B1A2B |
| Paneles | #15304A |
| Superficie secundaria | #1D3D5C |
| Texto principal | #EEF4F8 |
| Texto secundario | #C9D5DD |
| Enlaces | #9FDCEA |
| Acento/foco | #C3B8FF |
| Bordes de controles | #8494A8 |
| Separadores decorativos | #2A4460 |
| Botón principal | Fondo #DCE8F2, texto #0B1A2B |
| Cuerpo | Atkinson Hyperlegible, 1rem, interlineado 1.6 |
| Títulos | Newsreader 600, interlineado 1.2 |
| Portada si corresponde | Newsreader 400, 40–56 px, interlineado 1.06 |
| Introducción si corresponde | Atkinson Hyperlegible, aproximadamente 19 px, interlineado 1.58 |

Conservar fuentes locales y separación de datos/motor/interfaz.

## Entrega y revisión

Entregar prototipo ejecutable actualizado, ZIP con SHA256 y manifest, y una grabación corta tomada de ESE runtime que muestre:
1. Inicio y natación sin mover el puntero.
2. Recorrer desde la vista inicial una zona que estaba fuera de pantalla mediante arrastre y mediante flechas; regresar sin reiniciar el mundo. Probar también zoom.
3. Luz sobre cuerpos que cambian de posición, sin desregistro luz/oscuro.
4. Examinar → pausa legible → profundidad → continuar, conservando encuadre.
5. Pausa manual, REDUCED y NONE, con navegación disponible en todos.
6. Vía espacial y vía alternativa con foco estable; tap y arrastre no se confunden.

La grabación demuestra comportamiento, no sustituye el ejecutable. No ofrecer una animación del canvas como evidencia del ZIP si son runtimes distintos. No basta otra tanda de capturas.

Incluir el patch de candidatos de #323 comentario 5998066305 y sus transiciones varios→cero/uno→mismos varios.

Axioma: QA del ZIP exacto, registro de ambos estados del asset durante natación, foco, examinable actual, reanudación, 320/390/1440, texto 200% y controles con funciones comprobables. Validación factual Senda/Astra continúa en paralelo.

María: comprobar que ve animales nadar, puede recorrer zonas fuera de la vista inicial sin esperar a que lleguen peces, entiende los controles y puede detenerse a observar. La corrección técnica por sí sola no emite aprobación de producto.

Secuencia: CLAUDE IMPLEMENTA R02 → AXIOMA RUNTIME → HUMAN QA MARÍA.
Prototipo aislado autorizado. NO MAIN · NO PUBLIC DEPLOY.
Orden registrada en GitHub; la publicación no activa por sí sola la sesión externa de Claude.
