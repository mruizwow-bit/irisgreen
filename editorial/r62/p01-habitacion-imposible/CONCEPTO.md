# R62 · P01 · Habitación imposible · concepto

**Estado:** propuesta de concepto, pendiente de revisión de Astra y HUMAN QA de María.
**Gate que persigue:** `R62_P01_HABITACION_CONCEPT_APPROVED`
**Fecha:** 28/09/2026

> **Aviso sobre las imágenes.** Las dos láminas adjuntas son SVG autorados en
> `scripts/r62_p01_concepto.py`: geometría axonométrica calculada, materiales,
> sombras proyectadas y oclusión de contacto. Comunican **composición, escala,
> volumen y mecánica**, y sirven para aprobar o rechazar el juego.
> No son la dirección de arte final: están a nivel de *blocking*. Lo que falta
> —ilustración rica, materialidad de piedra, atmósfera— se dice en el punto 14,
> con lo que haría falta para llegar ahí.

---

## 1 · Imagen principal de gameplay

`gameplay.svg` — la sala a media partida. Arco de entrada a ras de suelo en el
muro derecho, vano de salida alto en el izquierdo, y entre ambos las cinco
piezas manipulables: rampa, escalera, columna, plinto y balcón volado. Tres
losetas frías marcan el tramo de camino ya resuelto.

## 2 · Detalle de interacción

`interaccion.svg` — el momento de decidir. El plinto está seleccionado (marco y
tiradores en las cuatro esquinas de su cara superior), el fantasma punteado
muestra dónde caería si se gira, y falta una loseta del camino, marcada por
relieve hundido y ranura, no por color. Abajo, los controles de teclado.

## 3 · Mecánica

La sala tiene cuatro suelos posibles. La persona elige cuál de las caras
interiores hace de suelo y la gravedad se reorienta: nada cambia de sitio, pero
lo que era un alféizar a media altura pasa a ser un escalón a ras, y una rampa
que subía pasa a bajar. A eso se suma recolocar y girar las piezas.

El objetivo es que exista un camino continuo entre las dos aperturas. Casi
siempre hay más de una solución, y algunas usan el cambio de suelo mientras
otras sólo mueven piezas. No hay cronómetro, ni puntuación, ni fallo: una
combinación que no conecta simplemente no conecta, y se ve por qué.

## 4 · Bucle

`observar la sala → mover una pieza o cambiar el suelo → la sala se reordena y
el camino se recalcula a la vista → descubrir que dos cosas que no se tocaban
ahora se tocan → seguir hasta unir las dos aperturas`

## 5 · Qué lo hace juego

La acción principal —reorientar el espacio— es interesante por sí misma y no
practica ninguna tarea cotidiana. El sistema responde: cada cambio reordena
visiblemente qué es transitable. Hay descubrimiento, porque las relaciones
útiles no se ven hasta que se prueban. Y hay razón intrínseca para seguir: la
sala siguiente plantea una imposibilidad distinta.

## 6 · Qué NO es

No es «recoge tu habitación» ni ninguna rutina doméstica: no hay objetos
cotidianos, ni orden correcto, ni tarea que ensayar. Tampoco es el tópico del
género —girar una pieza hasta que dos bordes coinciden en la proyección 2D y se
vuelven transitables—, que es la mecánica central de una IP muy reconocible y
que la orden prohíbe. Aquí la geometría es honesta en cada suelo; lo imposible
es que la sala sea coherente de cuatro maneras incompatibles a la vez.

Y no es un puzle de luz: eso es P03. Aquí la luz es material, no mecánica.

## 7 · Materiales, luz y paleta

Caliza cálida (`#F4E9D6` → `#7C6549`) para la arquitectura y las piezas ligeras.
Piedra oscura terrosa (`#C08F68` → `#54402F`) para columna y plinto, que es lo
que se manipula. Piedra fría azulada (`#CFE1E2` → `#5C7A82`) con ranura de latón
(`#E3C583`) para el camino transitable y el balcón. Todo sobre un vacío oscuro
(`#241F19` → `#0E0C0A`), para que la sala se lea como un objeto iluminado y no
como una ficha sobre papel.

Una sola luz rasante desde arriba a la izquierda: sombras largas proyectadas,
oclusión donde cada volumen toca el suelo, filo claro en las aristas que miran
a la luz, y un haz que entra por el vano alto y cae sobre el suelo.

## 8 · Qué se mueve

Poco y despacio. La pieza seleccionada se desliza de casilla a casilla (unos
180 ms, con salida suave). El giro es un cuarto de vuelta en unos 240 ms. El
cambio de suelo es la única animación grande: la sala rota sobre su eje en unos
600 ms, y es lo que permite entender que nada se ha movido de sitio. El camino
se va encendiendo loseta a loseta, en cascada corta.

Nada parpadea. Nada se mueve solo. No hay bucles de animación de fondo.

## 9 · Qué hace la persona

Elige una pieza, la mueve o la gira, y prueba. Cuando se atasca, cambia el
suelo y vuelve a mirar. Puede deshacer cualquier cantidad de pasos y reiniciar
la sala entera. No hay nada que perder.

## 10 · Controles equivalentes

| | Teclado | Puntero / táctil |
| --- | --- | --- |
| Elegir pieza | `Tab` / `Shift+Tab` recorren las piezas | tocar la pieza |
| Mover | `↑ ↓ ← →` una casilla | arrastrar **o** tocar pieza y luego tocar destino |
| Girar | `R` | botón de giro junto a la pieza seleccionada |
| Cambiar de suelo | `1` `2` `3` `4` | los cuatro rombos del selector |
| Confirmar / soltar | `Enter` | tocar fuera |
| Deshacer | `Ctrl+Z` | botón de deshacer |
| Reiniciar sala | botón, con confirmación | ídem |

El arrastre nunca es el único camino: seleccionar→destino cubre todo. Los
objetivos táctiles son de 44 px, y de 56 px con `html[data-ig-controls="big"]`.
A 320 px la sala se reencuadra y el selector de suelo pasa a una fila bajo el
tablero; no hay desplazamiento horizontal.

## 11 · Reduced motion

Con `prefers-reduced-motion` **o** con `html[data-ig-motion="off"]` —las dos
señales, como ya hace el resto de la casa— los deslizamientos y el giro pasan a
cortes secos, y la rotación de sala se sustituye por un fundido de 120 ms entre
el antes y el después, con el selector de suelo marcando cuál está activo. La
cascada del camino se convierte en encendido simultáneo.

Ningún estado depende sólo de color: el camino se distingue por material y por
la ranura hundida, la pieza seleccionada por marco y tiradores, el suelo activo
por relleno del rombo. En `forced-colors` las piezas conservan borde propio y
la selección pasa a `4px double`, que es el patrón que ya usa Juegos.

## 12 · Adaptación por etapa

La etapa cambia la sala de partida, no el aspecto. Infancia arranca con tres
piezas, un solo suelo alternativo y el camino ya iniciado; adolescencia y
adultez, con cinco piezas y los cuatro suelos. El copy se acorta en infancia.
No hay paleta infantil, ni mascotas, ni ojos: es la misma sala.

## 13 · Riesgo de similitud con IP externa

El riesgo real está en el género. Mitigaciones adoptadas:

- **La mecánica es otra.** No se usa la coincidencia de bordes en la proyección
  2D, que es el núcleo de la IP más reconocible del género.
- **Sin personaje.** No hay figura que caminar, así que no hay silueta, ni
  cámara que la siga, ni lenguaje de animación que pueda parecerse.
- **Sin arquitectura firmada.** Nada de escaleras entrelazadas ni bucles
  imposibles calcados de obra concreta; la sala es un interior ortogonal simple.
- **Paleta propia**, cálida y oscura, lejos del pastel saturado del referente.

Queda por revisar con Astra si el selector de cuatro suelos evoca demasiado
algún mando conocido. Es un rombo de cuatro posiciones; si hay duda, se cambia.

## 14 · Criterio de PASS visual

La lámina pasa cuando, a 1440 y a 390:

1. Se distinguen a simple vista las tres familias de material.
2. Cada volumen tiene sombra proyectada y oclusión de contacto; ninguno flota.
3. El camino se lee sin depender del color, también en `forced-colors`.
4. Ninguna pieza queda ocluida hasta ser irreconocible.
5. No hay ningún elemento que pueda confundirse con obra de terceros.

**Lo que hoy no cumple, y hay que decirlo:** las láminas están a nivel de
blocking. La piedra no tiene grano ni veta, el haz de luz apenas se percibe, y
falta la profundidad atmosférica que separaría el fondo del primer término.
Para llegar al listón de «calidad visual magnífica» que fija el §3 hacen falta
texturas propias y una pasada de ilustración que no sale de geometría
calculada. Eso es trabajo de dirección de arte con herramienta de imagen, no de
un generador de SVG.

Mi recomendación: aprobar o rechazar **la mecánica** con estas láminas, que
para eso sirven, y tratar la dirección de arte como un entregable aparte antes
de soltar a Codex.
