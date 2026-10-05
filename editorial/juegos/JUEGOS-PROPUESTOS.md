# Juegos propuestos · Iris Green

Fecha: 05/10/2026 · Autoría: Claude · Decide: María

**Segunda versión.** La primera listaba siete juegos. María: «eso no son
juegos», y tenía razón. Contados con la vara de verdad, **son juegos dos**. Los
otros cinco eran juguetes con una tabla de «objetivo / reglas / feedback»
encima, que es precisamente lo que el encargo prohíbe: paneles disfrazados.

Este documento corrige eso: dice cuáles son juegos, cuáles no, y qué le falta
exactamente a cada uno que no lo es.

---

## 1 · La vara

Un juego, aquí, tiene estas cuatro cosas. No son opinables y no hace falta
ninguna más:

1. **El sistema plantea un problema.** No «haz lo que quieras»: hay algo que
   está sin resolver y se nota al llegar.
2. **Se ve el «todavía no».** El estado sin resolver es visible, no es una
   sensación.
3. **Hay jugadas, y combinan.** Pocas reglas que se cruzan, de donde salen
   soluciones que nadie enumeró.
4. **El sistema reconoce que ya está.** Hay un momento de resolver, y lo dice
   el sistema, no la persona.

**Nada de esto pide cronómetro, puntuación, vidas ni rachas.** Ése fue mi error
de origen: escribí los siete pilotos bajo «sin prisa, sin puntos, sin fracaso»
y de paso me cargué el desafío, que es otra cosa. Se puede tener un problema
que resolver sin tener prisa por resolverlo. Habitación imposible lo demuestra.

### Lo que ya existe y por qué no entra

El catálogo actual tiene **297 piezas** llamadas «juegos». Medido sobre
`assets/data/juegos-iris-data.js`: sus nueve categorías son ámbitos de la vida
diaria —Mañana y noche 43, Casa 42, Higiene 36, Salir 36, Comidas 31, Cuidarse
30, Estudio 29, Vestirse 25, Tiempo 25— y sus cinco tipos son **ordenar pasos,
elegir, clasificar, planificar, memoria**.

Nueve ámbitos domésticos y cinco operaciones de ficha. Por la vara del §1,
ninguna de las 297 es un juego: son ejercicios de pictograma. Hacen su trabajo;
sólo no son esto.

---

## 2 · Son juegos · 2

### J01 · Habitación imposible

Una sala cúbica donde **cualquier cara puede ser el suelo**. Al girar la sala,
lo que era pared se pisa, y las piezas caen hacia el nuevo suelo.

- **El problema:** entrada y salida no están unidas, y se ve que no lo están.
- **El todavía no:** el camino se corta a la vista, antes de la salida.
- **Las jugadas:** cuatro orientaciones × mover una pieza. Se cruzan: el nivel
  está elegido para que **con el suelo 1 no haya camino y sólo el 4 lo abra**.
- **Resolver:** el camino se enciende y el sistema dice «la entrada y la salida
  están unidas».

Estado: `R62_P01_HABITACION_E4_HUMAN_APPROVED`, **con prototipo jugable**. Es el
patrón al que se tienen que parecer los demás.

### J03 · Rutas de luz

Una hoja de luz entra por un postigo y hay que llevarla a donde no llega, con
espejos y divisores montados en un bastidor.

- **El problema:** hay pantallas apagadas y una sola fuente que no se mueve.
- **El todavía no:** el haz se ve en el aire y se ve morir contra lo que toca.
- **Las jugadas:** espejo (gira 90°, dos orientaciones) y divisor (reparte
  mitad y mitad). Y una regla que hace el juego: **la luz no se duplica, se
  reparte**, así que encender dos cuesta brillo en las dos.
- **Resolver:** la pantalla se enciende con el brillo que le llega, y hay
  **diez** combinaciones distintas para encender las dos.

Estado: concepto completo y láminas, pasado por dos vueltas de QA humano.

---

## 3 · No son juegos todavía · 5

A los cinco les falta **lo mismo**: un problema que el sistema plantee y sepa
reconocer resuelto. Los cinco tienen ya el sistema modelado, que es la parte
cara; lo que falta es el encargo. Por eso no los tiro: los convierto.

| | Qué es hoy | Qué le falta | Conversión propuesta |
|---|---|---|---|
| **J02 · Terrario vivo** | plantar un terrario a gusto | no hay nada sin resolver | **Un terrario que va mal.** Llegas y algo se está muriendo. La causa está en el sistema —sombra, drenaje, humedad— y se arregla con lo que hay en la bandeja. Diagnosticar y arreglar sí es un problema |
| **J04 · Ritmo de colores** | caja de música para trastear | nada que conseguir | **Repite lo que suena.** El barrilete toca un patrón; el tuyo está vacío. Poner las piedras donde van es un puzle de oído, y el sistema sabe cuándo coincide |
| **J05 · Pesca tranquila** | esperar a ver qué se acerca | el objetivo lo pones tú, o sea ninguno | **Te piden uno.** «Haz que suba el de fondo.» Y el agua lo pone difícil: sólo sube si la nube de migas llega a la hoya o si el cebo baja de la termoclina. Eso ya estaba modelado y yo lo disolví en «venga el que venga» |
| **J06 · Mi museo** | colocar piezas a gusto | ídem | **Un encargo imposible de cumplir del todo.** Ya lo tiene medido: con las nueve piezas **no se puede** parar la visita en las tres vitrinas sin pasarse de luz en el papel. El juego es decidir qué sacrificas, y el sistema enseña las consecuencias |
| **J07 · El refugio** | ajustar un rincón | lo escribí yo: «hasta que te sirva» no es objetivo | **Deja este rincón listo para algo.** Para leer una hora, para que entre alguien a quien molesta el ruido. Con las ocho piezas los cuatro canales no bajan a la vez: hay que elegir |

Fíjate en el patrón: **en cuatro de los cinco, el problema ya estaba dentro del
sistema y yo lo quité al escribir el concepto.** En J05 y J06 incluso lo tenía
contado —las rutas, el «no se puede»— y lo dejé como curiosidad en vez de como
el juego.

---

## 4 · Los de sala

Para una pantalla pública, con contenido del sitio que la pone. Plan en
`editorial/juegos-en-sala/PLAN.md`.

| | ¿Pasa la vara? |
|---|---|
| **Parejas** | Sí, el más simple de todos, pero tiene problema, todavía-no y resolución |
| **¿Qué falta aquí?** | Sí, justo: hay algo que falta y el sistema sabe qué era |
| **Ordena la historia** | **No.** «Ordenar pasos» es uno de los cinco tipos de ficha del §1. Es un pictograma con fotos de museo |

---

## 5 · Lo que no es un juego y no pasa nada

**Mapa del tesoro de casa** (prototipo 1 del paquete). Marcas qué habitaciones
te calman y cuáles te cargan. Está bien hecho y sirve, pero no hay nada sin
resolver: es un mapa personal. Si entra en Juegos, entra con el mismo argumento
con el que entrarían las 297.

**Los retos del Taller.** Son puertas a un instrumento. Gamificarlos los
estropearía, y su listón es otro.

---

## 6 · Lo que hay que decidir

1. **¿Se aprueban las cinco conversiones del §3?** Son cinco encargos nuevos
   sobre sistemas ya modelados: no hay que rehacer la mecánica, hay que
   ponerle un problema delante y un reconocimiento detrás.
2. **Progresión.** Seis de los siete conceptos llevan escrito «sin niveles, sin
   progresión». Si progresión significa *tablero que se complica y piezas
   nuevas*, J01 y J03 ya la tienen y los demás la tendrían con la conversión.
   Si significa otra cosa, dilo antes de la auditoría.

Mientras tanto, la cuenta honrada de este documento es: **dos juegos, cinco
sistemas esperando un problema, y 297 fichas que no son esto.**

---

## 7 · Dónde está cada cosa

| | Concepto | Generador | Estado de lámina |
|---|---|---|---|
| J01 | `editorial/r62/p01-habitacion-imposible/CONCEPTO.md` | `scripts/r62_p01_render.py` | aprobada |
| J02 | `editorial/r62/p02-terrario-vivo/CONCEPTO.md` | `scripts/r62_p02_render.py` | E4 R3 |
| J03 | `editorial/r62/p03-rutas-de-luz/CONCEPTO.md` | `scripts/r62_p03_render.py` | QA2 |
| J04 | **falta el concepto escrito** | `scripts/r62_p04_render.py` | de trabajo |
| J05 | `editorial/r62/p05-pesca-tranquila/CONCEPTO.md` | `scripts/r62_p05_render.py` | de trabajo |
| J06 | `editorial/r62/p06-mi-museo/CONCEPTO.md` | `scripts/r62_p06_render.py` | de trabajo |
| J07 | `editorial/r62/p07-el-refugio/CONCEPTO.md` | `scripts/r62_p07_render.py` | de trabajo |

Medida común de J05, J06 y J07: `scripts/test_r62_pilotos.py`, gate
`R62_PILOTOS_E4_MEASURED_PASS`.

**Jugable hoy: sólo J01.** De los otros seis hay concepto y lámina —el sistema
definido y medido—, no juego construido.
