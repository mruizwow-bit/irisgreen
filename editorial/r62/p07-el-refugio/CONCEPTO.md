# R62 · P07 · El refugio · concepto

**Estado:** `R62_P07_REFUGIO_CONCEPT_READY_FOR_ASTRA_AURA_MARIA`
**Fecha:** 04/10/2026
**Tipo:** juego de ajustar un sitio hasta que te sirve.
**Generador:** `scripts/r62_p07_render.py` sobre `scripts/ig_render_e4.py`.
El motor no se toca.

Lámina de trabajo: `rincon-trabajo.png`.

**Añadido a la serie.** `DELTA_R62_JUEGOS_6_PILOTOS` pedía seis y los seis están
concepto-completos. Éste es el séptimo y es aditivo: no sustituye a ninguno y
no toca su material.

---

## 0 · Por qué éste y no otro

Mirando los seis juntos, el hueco salta: **ninguno trata del sitio donde se
está**. Hay una habitación imposible, un terrario, una sala con luz, un taller
con ritmo, una orilla y un museo —seis sitios— y en los seis el sitio es el
escenario, nunca el asunto.

Y es el hueco que más le toca a este producto. Iris Green es para gente
neurodivergente, y para mucha de esa gente la diferencia entre un día que sale
y un día que no la decide un sitio: cuánta luz, cuánto eco, cuánta cosa a la
vista. Eso se vive como algo que te pasa. Aquí se vuelve **un sistema que se
ve, se toca y responde**.

Y una línea que ordena todo lo demás: **esto no evalúa a nadie**. El juego no
mide tu sensibilidad, no te dice cómo eres y no tiene un resultado correcto.
Ajustas un sitio hasta que te sirve a ti, y lo que a ti te sirve es el dato de
entrada, no la nota.

## 1 · Imagen principal de gameplay

Un rincón de habitación a media tarde, encuadre cercano: no se ve la
habitación entera, se ve el trozo donde se está.

A la izquierda, una ventana con una persiana de lamas a media altura; la luz
entra en una cuña y cae sobre el suelo de tarima. Debajo, un banco con un
cojín y una manta de lana doblada. A la derecha, una estantería abierta con
cosas encima —cajas, un montón de papeles, tres cacharros— y, colgando del
marco de la ventana, un **móvil de hilos con un disco de papel**.

En el suelo, una alfombra que llega hasta medio encuadre. Al fondo, la puerta
entreabierta. Y una lámpara de papel apagada.

En primer plano, cortada por el marco, **la pieza que se está moviendo**: la
manta, suspendida sobre su sitio, con el anillo punteado del destino.

Lo que hay que ver de un vistazo: cuánta luz entra, cuánta cosa hay a la
vista, qué superficies están desnudas y cuáles cubiertas.

## 2 · Segundo estado / interacción

`causalidad-*.svg`. El mismo rincón antes y después de **bajar la persiana dos
lamas**.

- **Antes:** la cuña de luz cruza el suelo y llega al estante; el disco de
  papel del móvil cuelga quieto; la lámpara está apagada.
- **Después:** la cuña se encoge hasta la mitad de la alfombra y el rincón se
  queda corto de luz, así que **se enciende la lámpara**. Y al encenderse, el
  disco de papel empieza a temblar: la lámpara tiene un zumbido.

Ése es el juego en una imagen: no hay cambios gratis. Bajar la luz subió el
sonido, y las dos cosas se ven sin leer ni una cifra.

Está computado: la cuña sale de la geometría de las lamas, y el temblor del
disco sale de la suma de lo que zumba en el rincón.

## 3 · Mecánica

El rincón tiene **cuatro canales**: luz, sonido, vista y tacto. Cada cosa que
hay dentro aporta a varios, y casi siempre no todos en el mismo sentido.

| Pieza | Luz | Sonido | Vista | Tacto |
| --- | --- | --- | --- | --- |
| Persiana, por lama | **−** | — | — | — |
| Lámpara de papel | **+** | **+** zumbido | — | — |
| Alfombra | — | **−** eco | **+** dibujo | **+** blando |
| Cortina | **−** | **−** eco | **+** | — |
| Manta en el banco | — | **−** | **+** | **+** |
| Cosas del estante | — | — | **+** por cosa | — |
| Puerta, por grado de apertura | — | **+** de fuera | — | — |
| Planta | — | **−** poco | **+** | — |

La persona empieza diciendo **qué le molesta más**, y eso no es un test: son
cuatro piezas que se ordenan arrastrando, de la que más molesta a la que
menos. Esa orden es suya y se puede cambiar cuando quiera.

A partir de ahí el juego **no puntúa**: enseña los cuatro canales del rincón
como cuatro cosas que se ven en la escena, y la persona ajusta.

## 4 · Bucle

`mirar el rincón → cambiar una cosa → ver qué se movió y qué se movió al revés
→ ajustar`

Sin cronómetro, sin puntuación, sin «rincón perfecto», sin estrellas. Nada es
irreversible y no hay número de cambios.

## 5 · Qué lo hace juego

Que los canales **tiran unos de otros**, así que no existe la jugada que lo
mejora todo. Medido sobre el rincón de la lámina —ocho piezas, persiana de seis
lamas, puerta en cinco posiciones—:

- bajar la luz sin subir el sonido: **se puede**, pero sólo por tres caminos, y
  los tres pasan por la cortina en vez de por la lámpara;
- bajar el eco sin subir lo que hay a la vista: **sólo uno** —la manta en el
  banco, porque ya estaba en el rincón—;
- dejar los cuatro canales bajos a la vez: **no se puede con estas ocho
  piezas**. Hay que elegir cuál se queda alto, y ahí es donde el orden de la
  persona decide.

Ninguna de esas rutas está en una tabla: salen de sumar los aportes.

## 6 · Qué NO es

No es un test sensorial, no es una evaluación, no da un perfil y no dice de
nadie que sea de una manera. No hay «nivel de sensibilidad», ni comparación con
otras personas, ni informe.

No es terapia y no da consejo. No dice «deberías bajar la luz».

No es un juego de decorar: las piezas no puntúan por combinar y no hay estilos
que desbloquear.

Y no hay personajes: no se ve a nadie en el rincón. El rincón es de quien
juega.

## 7 · Materiales, luz y paleta

Lenguaje nuevo en la serie: aquí no hay piedra, ni agua, ni vitrinas. Hay
**tejido, papel, madera y yeso**, que es lo que tiene un sitio donde se está.

Tarima de pino `#8A6A46` con la veta abierta y las juntas marcadas por el paso;
yeso `#D8D2C6` templado; lana de la manta `#9A7A5E` con el hilo visible y el
canto deshilachado; algodón del cojín `#C2B49A`; alfombra de trapo con sus
tiras cosidas en direcciones distintas; papel de la lámpara `#E8DCC0` y papel
del disco, más fino; cestas de mimbre; y la hoja de la planta, el único verde.

La luz es de media tarde y entra por la ventana, cálida `#FFD9A6`, **cortada en
lamas por la persiana**: no es un rectángulo, son tiras, y las tiras caen sobre
la tarima y suben por la pared y por la alfombra deformándose con lo que pisan.
Ésa es la medida de «cuánta luz entra», y se ve.

Cuatro recursos hacen el volumen: la cuña de lamas, el rebote cálido de la
tarima hacia los bajos de todo, el pelo de la lana y de la alfombra —que
capturan la luz rasante por el canto— y la penumbra del fondo, donde la puerta
entreabierta deja una rendija.

## 8 · Qué se mueve

Muy poco, y es importante: un juego sobre bajar el ruido no puede ser
ruidoso.

La persiana baja lama a lama. La cuña de luz se encoge con ella. El disco de
papel **tiembla** cuando hay zumbido, con una amplitud que sigue a cuánto hay;
si no hay, se queda quieto. La manta cae a su sitio en 400 ms. La puerta se
abre y se cierra despacio.

Nada parpadea, nada rebota, no hay partículas, no hay destello al acertar y no
hay sonido obligatorio. Si se activa el sonido, lo que suena es el rincón: el
zumbido que la lámpara añade de verdad.

## 9 · Qué hace la persona

Mira el rincón. Sube o baja lamas. Pone o quita la alfombra, la cortina, la
manta, el cojín, la planta. Quita cosas del estante o las mete en una cesta.
Abre o cierra la puerta. Enciende o apaga la lámpara.

Puede reordenar en cualquier momento lo que le molesta más. Puede guardar un
rincón suyo y volver. Puede no guardar nada.

Si selecciona una pieza, puede leer a qué canales aporta y en qué sentido. La
información sale de la pieza y es opcional.

## 10 · Controles equivalentes

| | Teclado | Puntero / táctil |
| --- | --- | --- |
| Recorrer las piezas del rincón | `Tab` y flechas | tocarlas |
| Poner o quitar | `Enter` | tocar, **o** arrastrar |
| Subir / bajar lamas | flechas `↑` `↓` sobre la persiana | arrastrar la persiana |
| Abrir / cerrar la puerta | flechas sobre la puerta | arrastrarla |
| Encender / apagar la lámpara | `Enter` sobre la lámpara | tocarla |
| Reordenar lo que molesta | flechas en la lista | arrastrar |
| Deshacer / rehacer | `Ctrl+Z` / `Ctrl+Y` | botones |

El arrastre **nunca** es la única vía. Objetivos de 44 px, 56 px con
`html[data-ig-controls="big"]`, 60 px en móvil. Las teclas van escritas en la
lámina.

## 11 · Estado sin depender del color

Tres de los cuatro canales **ya son visibles** sin inventar ningún indicador, y
ésa es la mejor parte del diseño:

1. **Luz**: se ven las tiras de la persiana sobre el suelo. Menos tiras y más
   cortas, menos luz.
2. **Vista**: se ve la cantidad de cosas. No hay nada que representar: están
   ahí o no están.
3. **Tacto**: se ve qué superficies están desnudas y cuáles cubiertas, y se
   ve el pelo del tejido.

El cuarto, **sonido**, no se ve por sí mismo, así que tiene un cuerpo que lo
enseña: el **disco de papel** del móvil, que tiembla con el zumbido y se queda
quieto sin él. Movimiento y quietud, no color. Y el eco se lee en lo mismo que
el tacto: una superficie dura y desnuda devuelve, una cubierta no.

En `forced-colors` las tiras de luz se dibujan con trama y contorno, el disco
lleva su marca de temblor, y cada pieza conserva su borde.

## 12 · Reduced motion

Con `prefers-reduced-motion` **o** `html[data-ig-motion="off"]` la persiana
salta a su posición, la cuña se redibuja de una vez, la manta aparece colocada
y la puerta cambia de golpe.

El disco de papel es el caso delicado: es la única señal que **es** movimiento.
Con movimiento reducido no tiembla; en su lugar aparece dibujada su vibración,
como se dibuja una cuerda pulsada: el disco con su estela a los dos lados, más
ancha cuanto más zumbido. Una señal de forma que dice lo mismo.

## 13 · Adaptación por etapa

Infancia: la persiana, la alfombra y las cosas del estante. Tres piezas, dos
canales —luz y vista—, sin contrapartidas cruzadas. Que mover algo cambie el
sitio es todo el juego, y basta.

Adolescencia y adultez: las ocho piezas, los cuatro canales, el zumbido de la
lámpara y la puerta. Y el hecho del §5: con estas piezas no se puede tener
todo.

Adultez no significa interfaz técnica, e infancia no significa versión mona. Es
el mismo rincón.

## 14 · Riesgo de similitud con IP externa

- **Vista propia.** Rincón cercano, casi de frente y con sesgo lateral. No es
  la vista cenital de los juegos de decorar ni la isométrica de los de
  gestionar.
- **Sin personajes.** Nadie habita el rincón, y eso ya lo separa del género
  entero de la vida simulada.
- **Sin economía.** No hay dinero, ni catálogo, ni tienda, ni desbloqueos.
- **Sin estética de catálogo.** Los objetos son los de una casa cualquiera,
  generados con las funciones del generador, no muebles de marca.
- **Lenguaje visual generado, no trazado.** Semilla fija, sin assets de
  terceros, sin stock, sin calco.

La inspiración admisible es sólo el principio abstracto: cambiar un sitio y que
el sitio responda.

## 15 · Criterio de PASS visual

A 1440 y a 390:

1. Se entiende que es un rincón de una casa sin leer nada.
2. Se ve cuánta luz entra por las tiras en el suelo, no por el brillo general.
3. Lana, algodón, trapo, papel, mimbre, pino y yeso se reconocen como
   materiales distintos.
4. Se ve qué superficies están desnudas y cuáles cubiertas.
5. El disco de papel se entiende como cuerpo que tiembla, no como adorno.
6. La segunda lámina se entiende sin leer los pies.
7. A 390 px es una composición propia y no la de escritorio encogida.
8. Ningún elemento puede confundirse con obra de terceros.

---

## Qué simula el sistema y qué es sólo representación

**Simulación real.** El aporte de cada pieza a los cuatro canales y su suma; la
geometría de la persiana, de donde sale cuánta luz entra y dónde cae; el
zumbido total, del que sale la amplitud del disco; y las contrapartidas
cruzadas, que no están escritas como reglas sino que salen de que una misma
pieza aporte a varios canales con signos distintos. De ahí salen los caminos
del §5 y el hecho de que no se pueda tener todo.

**Sólo representación visual.** El pelo del tejido, el rebote de la tarima, el
polvo en la cuña de luz y la rendija de la puerta responden al estado pero no
lo calculan. No hay acústica, ni fotometría, ni unidades.

**Lo que NO se simula, y por tanto no se afirma.** Esto no mide la carga
sensorial de nadie. Los aportes de la tabla del §3 son reglas de juego elegidas
para que las contrapartidas sean interesantes, **no valores sacados de ninguna
fuente**, y el juego no dice en ningún sitio cuánto molesta de verdad una
lámpara. Tampoco produce un perfil de la persona: el orden que ella pone es
entrada del juego y no sale de él, no se guarda como rasgo y no se enseña como
resultado. Si algún día se añade información real sobre entornos y
neurodivergencia, irá con su fuente y separada de lo que el juego calcula.

---

## Lo que sigue corto · primera vuelta E4 (04/10/2026)

`R62_PILOTOS_E4_MEASURED_PASS` en `scripts/test_r62_pilotos.py`: el par de
materiales más parecido queda a 0,0304 sobre un mínimo de 0,030, ninguna
casilla de color ocupa más del 11,1 % de la escena, y quitar la segunda fuente
cambia la lámina en 0,0262.

Y la comprobación propia de este piloto, que es la que importa: **bajar la
persiana quita luz de verdad**. Medido a seis, cuatro y una lama abiertas, la
luz media de la lámina va 0,1774 → 0,1722 → 0,1618 y la superficie clara
3,6 % → 1,7 % → 0 %. La señal de estado resta, que es justo lo que a P06 le
faltaba.

**Lo que sí está:** el rincón se lee como un sitio de una casa; la cuña de
lamas cruza el paramento, baja y cae sobre el banco, la tarima y la alfombra, y
es lo que alumbra la escena, no un adorno encima de una habitación ya clara; el
cojín y la manta se leen blandos; la manta que se está colocando flota sobre su
sitio con su huella y su vertical; el disco de papel está quieto porque no hay
zumbido, y la quietud es la señal.

**Lo que sigue corto, y lo digo yo porque el test no lo mide:**

- **la alfombra se lee como una esterilla clara**, no como trapo cosido: las
  tiras están, pero les falta el canto del cosido y el pelo;
- **las cosas del estante son prismas.** Para un juego cuyo canal «vista» es
  literalmente cuántas cosas hay, que las cosas sean bloques es flojo;
- **la puerta entreabierta no se ve**, tapada por la estantería;
- la cesta de la planta es una caja.

**Lo que ni se ha intentado:** la lámina de causalidad del §2 —bajar dos lamas y
que se encienda la lámpara, con el disco empezando a temblar—, la composición
de móvil, el tema claro, la capa vectorial y el SVG de entrega.

**Un límite medido, que vale para toda la serie.** Con diez materiales en una
lámina, el reparto a 0,035 de separación pide un rango de 0,315 y el rincón da
unos 0,20. Calibrado, cinco de los diez salían «no alcanzable»: harían falta
albedos por encima de 1. O sea que **diez materiales no caben** en una sola
lámina con este listón, y la salida cuando eso pase no es forzar colores, es
quitar material del encuadre.
