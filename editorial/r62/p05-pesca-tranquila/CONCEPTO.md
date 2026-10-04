# R62 · P05 · Pesca tranquila · concepto

**Estado:** `R62_P05_PESCA_CONCEPT_READY_FOR_ASTRA_AURA_MARIA`
**Fecha:** 04/10/2026
**Tipo:** juego de lectura e inferencia sobre un sistema visible.
**Generador:** `scripts/r62_p05_render.py` sobre `scripts/ig_render_e4.py`.
El motor no se toca: `test_e4_motor_identico.py` sigue devolviendo las cuatro
láminas de P01 idénticas byte a byte.

Láminas de trabajo: `orilla-trabajo.png`, `profundidad-trabajo.png`.
Las de entrega —`gameplay-{navy,claro}.svg`, `gameplay-movil-*`,
`causalidad-*`— salen cuando este concepto esté aprobado.

---

## 0 · La decisión que ordena todo lo demás

**Aquí no se saca nada del agua.** El objetivo no es cobrar un pez: es
**conseguir que un pez se acerque y se quede a la vista**. No hay captura, no
hay forcejeo, no hay anzuelo clavado, no hay cubo.

Esto no es un adorno ético, es la decisión de diseño de la que salen las demás.
Un juego de pesca convencional tiene su momento de tensión en un
**reflejo** —tirar en el instante justo, pulsar cuando la boya se hunde— y eso
es exactamente lo que este producto no puede pedir. Quitado el reflejo, hay que
poner el juego en otro sitio, y el sitio es **leer el agua antes de decidir**.

De paso resuelve el §2 de la lista de siempre: sin captura no hay fracaso, y
sin fracaso no hace falta consolar a nadie.

## 1 · Imagen principal de gameplay

Un corte frontal de la orilla al atardecer, con **la línea del agua cruzando la
lámina**: un tercio de aire arriba, dos tercios de agua abajo, y las dos cosas
a la vez en el mismo encuadre.

Arriba: el canto de una tabla de embarcadero entrando por abajo a la derecha,
cortado por el marco; un juncal a la izquierda; la orilla de enfrente perdida
en bruma; sol bajo que viene de la izquierda y raso.

En el agua: la boya con su plomo y el cebo colgando a media profundidad, una
rama hundida cubierta de algas desiguales, piedras que van de gruesas junto a
la orilla a finas al fondo, limo con marcas de ondulación, y un herbazal
sumergido a la derecha. El agua tiene **polvo en suspensión** y por ella bajan
dos hojas de luz desde la superficie.

Y tres cosas vivas, a distinta profundidad y cada una con su silueta: el
**rayado del juncal** entre los tallos, el **de fondo** quieto sobre el limo, y
dos **de superficie** pequeños justo bajo la lámina de agua.

En el centro, **el nudo que se está moviendo** por la línea —lo que fija la
profundidad del cebo—, con el anillo punteado de su destino y la marca de la
cota a la que va a quedar.

Lo que hay que ver de un vistazo: dónde está el cebo, a qué profundidad, qué
hay alrededor, y que esa profundidad está a punto de cambiar.

## 2 · Segundo estado / interacción

`causalidad-*.svg`. El mismo encuadre antes y después de mover **una sola
cosa**: el nudo, una mano más abajo.

- **Antes:** el cebo queda a 0,40 m, por encima de la capa templada, a plena
  luz y lejos de cualquier cobijo. Se acercan los dos de superficie.
- **Después:** el cebo queda a 1,15 m, dentro de la sombra de la rama hundida y
  por debajo del salto de temperatura. Los de superficie se quedan donde
  estaban. Sube el de fondo.

No se dibuja: se calcula. Lo que cambia con el nudo es la cota del cebo, y de
la cota salen la luz que le llega, la temperatura de esa capa y si está dentro
de cobijo o no. El pez que viene es el que esas tres cifras favorecen. La
lámina lleva los números al lado, porque un cambio del que no se puede ver la
causa es magia y no mecánica.

## 3 · Mecánica

La persona decide tres cosas, y ninguna es un reflejo:

| Decisión | Cómo se toma |
| --- | --- |
| **Dónde** cae la línea | se elige un punto de la orilla a lo largo del agua |
| **A qué profundidad** cuelga el cebo | se mueve el nudo por la línea |
| **Qué cebo** se pone | tres, y cada uno se hunde distinto |

Y una cuarta que no es una decisión puntual sino una apuesta: **echar un puñado
de migas** en un sitio. Las migas no atraen desde donde caen: hacen una nube
que **la corriente arrastra**, y lo que importa es a dónde llega la nube, no
dónde se echó.

Los tres cebos:

| Cebo | Qué hace en el agua |
| --- | --- |
| **Pluma** | flota; se queda en la lámina y deriva con el viento |
| **Larva** | se hunde despacio y la corriente la lleva mientras baja |
| **Canto de pan mojado** | se hunde recto y se queda en el fondo |

El agua **se modela** y es la que manda: hay una corriente que no es uniforme
—más viva en el centro, remansada en el juncal y detrás de la rama—, la luz se
apaga con la profundidad, y hay un salto de temperatura a 0,85 m: por encima el
agua se ha calentado con el sol de la tarde, por debajo no.

Los tres animales no están colocados a mano ni salen al azar. Cada uno tiene
escritas sus tres preferencias —banda de profundidad, cobijo y temperatura— y
viene a lo que le llega: cebo o nube. El juego **no guarda ninguna solución
esperada**; sólo sabe qué hay en cada punto del agua.

## 4 · Bucle

`mirar el agua → decidir sitio, cebo y profundidad → esperar mirando → ajustar`

La espera es parte del juego y no es una barra de progreso: mientras se espera
**se ve** la larva bajar, la nube de migas estirarse con la corriente, la boya
inclinarse. Hay algo que mirar en todo momento, y eso es lo que sustituye a la
tensión.

Sin cronómetro, sin puntuación, sin vidas, sin racha, sin fracaso. Si no se
acerca nadie, el agua ya ha dicho por qué: la nube se fue para el otro lado o
el cebo se quedó por encima de la capa fría.

## 5 · Qué lo hace juego

Que hay **más de una manera** de conseguir lo mismo, y que ninguna es la
obvia. Medido sobre el agua de la lámina:

- acercar al **de fondo**: cebo de pan en el limo, **o** larva en la vertical
  de la rama dejándola bajar, **o** migas echadas aguas arriba del herbazal
  para que la nube llegue abajo;
- acercar al **rayado del juncal**: sólo dentro del remanso, pero se llega por
  tres sitios distintos de la orilla;
- tener a dos a la vez a la vista: se puede, y pide usar la corriente a favor
  de uno y el cobijo a favor del otro.

Ninguna de esas rutas está en una tabla. Salen de que el agua está modelada. Y
por eso una idea que a nadie se le había ocurrido también funciona.

## 6 · Qué NO es

No es un simulador de pesca. No hay caña que se dobla, ni carrete, ni tensión
de línea, ni «¡picó!», ni tirar en el momento justo, ni pez que se escapa. No
hay colección de capturas, ni récord de tamaño, ni peces legendarios, ni tienda
de aparejos, ni mejoras.

No hay personaje: no se ve a nadie pescando. La tabla del embarcadero y la
línea son todo lo que indica que hay alguien.

Y no es una lección de limnología. El agua se comporta con unas reglas claras
que se parecen a las de verdad lo justo para ser coherentes.

## 7 · Materiales, luz y paleta

Dos mundos separados por una raya, y la raya es el elemento más fuerte de la
lámina.

**Arriba**, aire de atardecer: cielo `#C9A978` bajando a `#8EA3A8` en el
horizonte, bruma en la orilla de enfrente, juncos `#6B6A3C` casi a contraluz,
tabla de embarcadero `#4A3A28` con la veta abierta por el uso y el canto
redondeado de pisarlo.

**Abajo**, agua verde fría: `#1A3A38` en la superficie y `#07171C` al fondo,
limo `#3A3428`, piedras gris verdoso, algas de la rama `#2F4A2A`, herbazal
`#24503A`. La boya es de corcho y madera pintada `#C4603A` —el único rojo de la
lámina, y está arriba, donde hace falta encontrarla—.

La luz es una sola: sol bajo cálido `#FFD79A` por la izquierda. Lo que hace el
volumen son cinco recursos, y cuatro de los cinco están en el agua:

1. **La superficie vista por debajo hace de espejo.** Es lo que de verdad pasa
   mirando desde dentro del agua con un ángulo rasante, y es lo que más dice
   «esto es agua» sin tener que dibujar olas.
2. **Hojas de luz** que bajan desde la lámina y se apagan con la profundidad,
   con el polvo en suspensión haciéndolas desiguales.
3. **Rebote del limo claro** hacia abajo de las cosas: una segunda fuente de
   verdad, no un relleno plano.
4. **Extinción con la profundidad**: el contraste y la saturación caen al
   bajar, y eso coloca cada cosa en su cota sin que haya que escalarla a mano.
5. Arriba, el **contraluz** del juncal y la bruma de la orilla de enfrente.

La imperfección es desigual a propósito: las algas cubren la rama por tramos y
no por igual, las marcas de ondulación del limo se borran donde hay piedras, y
cada piedra tiene su propio desgaste por un hash de su índice.

## 8 · Qué se mueve

Despacio y continuo, que es justo lo contrario de un juego de reflejos.

La lámina de agua ondula muy lentamente. La larva baja en unos ocho segundos.
La nube de migas se estira con la corriente a lo largo de medio minuto. La boya
se inclina cuando algo toca el cebo —un grado o dos, nada de hundirse de
golpe—. Un pez que se acerca tarda tres o cuatro segundos en entrar en el
encuadre y luego se queda quieto, con la aleta moviéndose apenas.

Nada parpadea, nada salta, no hay partículas de relleno, no hay destello al
acertar y no hay sonido obligatorio.

## 9 · Qué hace la persona

Mira el agua. Elige un sitio, un cebo y una profundidad. Echa migas si quiere.
Espera mirando. Cambia lo que quiera cuando quiera: nada está comprometido y no
hay turno que se pierda.

Si selecciona un animal, puede leer sus tres preferencias. Si selecciona un
punto del agua, puede leer su profundidad, su temperatura y si tiene cobijo. La
información es opcional y sale del objeto, no de un panel permanente.

## 10 · Controles equivalentes

| | Teclado | Puntero / táctil |
| --- | --- | --- |
| Recorrer los puntos de orilla | flechas `←` `→` | tocar la orilla |
| Elegir cebo | `Tab` y `Enter` | tocar la bandeja |
| Subir / bajar el nudo | flechas `↑` `↓` | arrastrar el nudo, **o** tocar la cota |
| Echar migas | `M`, y flechas para el sitio | tocar el sitio |
| Mirar algo | `Enter` sobre lo enfocado | tocarlo |
| Recoger y volver a empezar | `R` | botón |
| Deshacer / rehacer | `Ctrl+Z` / `Ctrl+Y` | botones |

El arrastre **nunca** es la única vía: el nudo se puede mover por cotas con las
flechas, y la cota se enseña como marca en la línea. Objetivos de 44 px, 56 px
con `html[data-ig-controls="big"]`, y 60 px en móvil.

Las teclas van **escritas en la propia lámina**, junto a la bandeja de cebos.

## 11 · Estado sin depender del color

1. **La profundidad del cebo se ve en la geometría**: la boya arriba, el plomo
   abajo y el tramo de línea entre los dos. Si el nudo está alto, el tramo es
   corto. No hay que deducirla de ningún número.
2. **Cada animal tiene su silueta y su patrón de trazo**: el rayado del juncal
   lleva barras verticales, el de fondo es ancho y sin marcas, los de
   superficie son finos y van en pareja. Se distinguen en gris.
3. **La nube de migas es una textura**, no un tinte: se ve el grano suspendido
   y se ve hacia dónde se estira.
4. **El cobijo es una sombra de verdad** proyectada por la rama y el herbazal,
   no una zona pintada.
5. **La capa de temperatura se ve** como un cambio de nitidez y de grano en el
   agua a esa cota: por encima, más turbia de calor; por debajo, más limpia.

Y una señal cuantitativa: la inclinación de la boya sigue a lo que toca el
cebo, así que «algo lo está mirando» y «algo lo tiene en la boca» son dos
ángulos distintos.

En `forced-colors` el agua se dibuja como trama con contorno, la línea del
nivel pasa a línea gruesa, cada animal conserva su patrón de trazo y la nube de
migas se dibuja con puntos.

## 12 · Reduced motion

Con `prefers-reduced-motion` **o** `html[data-ig-motion="off"]` —las dos
señales— la superficie deja de ondular, la larva baja en un paso, la nube de
migas aparece ya estirada en su forma final, la boya cambia de ángulo de golpe
y el animal que se acerca aparece ya colocado. Sin flashes en ningún modo.

La espera sigue existiendo, porque la espera es el juego; lo que desaparece es
la animación de la espera.

## 13 · Adaptación por etapa

Misma identidad visual a todas las edades. Cambia la cantidad de decisiones, no
el aspecto.

Infancia: agua somera y sin corriente, un solo animal, dos cebos, sin capa de
temperatura. La relación «más abajo el nudo, más abajo el cebo» es toda la
mecánica, y es suficiente.

Adolescencia y adultez: corriente desigual, capa de temperatura, los tres
animales, migas con deriva, y aguas donde el cobijo bueno está justo donde la
corriente no lleva nada, que es lo que obliga a elegir.

Adultez no significa interfaz técnica, e infancia no significa versión mona. Es
la misma orilla.

## 14 · Riesgo de similitud con IP externa

- **Vista propia.** Corte frontal con la línea del agua cruzando la lámina y
  los dos medios a la vez. Los juegos conocidos del género miran desde arriba,
  desde detrás de quien pesca o desde una barca; ninguno enseña el agua por
  dentro como asunto principal.
- **Sin personajes.** No hay avatar, ni guía, ni criatura con cara.
- **Sin el momento de la pesca.** No hay picada, ni forcejeo, ni captura: lo
  que precisamente identifica al género no está.
- **Animales inventados.** Ni especies reales con su nombre, ni formas
  calcadas: tres siluetas generadas con las funciones del generador.
- **Lenguaje visual generado, no trazado.** Toda la geometría y toda la textura
  salen del generador con semilla fija. No hay assets de terceros, ni stock, ni
  calco.

La inspiración admisible es sólo el principio abstracto: poner algo en un sitio
y esperar mirando.

## 15 · Criterio de PASS visual

A 1440 y a 390:

1. Se entiende que hay aire arriba y agua abajo sin leer nada.
2. La superficie se lee como agua —espejo por debajo, no una raya pintada—.
3. Se ve a qué profundidad está el cebo por la geometría de la línea.
4. Limo, piedra, alga, madera, corcho y junco se reconocen como materiales
   distintos.
5. Los tres animales se distinguen entre sí en gris.
6. La segunda lámina se entiende sin leer los pies.
7. A 390 px es una composición propia y no la de escritorio encogida.
8. Ningún elemento puede confundirse con obra de terceros.

---

## Qué simula el sistema y qué es sólo representación

**Simulación real.** La columna de agua: profundidad punto a punto, corriente
desigual con remansos detrás de los obstáculos, caída de la luz con la
profundidad, salto de temperatura a una cota, hundimiento de cada cebo según su
peso mientras la corriente lo arrastra, y la nube de migas transportada por esa
corriente. Y la decisión de cada animal, que sale de comparar sus tres
preferencias escritas con lo que de verdad hay en el punto donde está el cebo o
donde llega la nube. De ahí salen las rutas múltiples del §5.

**Sólo representación visual.** El polvo en suspensión, las hojas de luz, el
reflejo de la cara interior de la superficie, la ondulación, el grano del agua
templada y el brillo del corcho responden al estado pero no lo calculan. No hay
refracción calculada, ni cáusticas físicas, ni mezcla de temperatura por
convección, ni química del agua.

**Lo que NO se simula, y por tanto no se afirma.** Esto no es un simulador de
pesca ni de ecología acuática, y no se presenta como tal. Los tres animales no
son especies: son tres reglas de juego con forma. Sus preferencias no están
sacadas de ninguna fuente biológica y el juego no dice en ningún sitio que un
pez de verdad haga esto. Si algún día se añade información real sobre fauna de
ribera, irá con su fuente y separada de lo que el juego calcula.

---

## Lo que sigue corto · primera vuelta E4 (04/10/2026)

La lámina de trabajo `orilla-trabajo.png` es una **primera vuelta**, no un PASS.
`scripts/test_r62_p05_p06.py` devuelve **FAIL** y dice exactamente dónde.

**Lo que sí está:** el plano partido se lee —aire arriba, columna de agua
abajo—; las hojas de luz bajan desde la lámina y se apagan; las piedras tienen
relieve y desgaste desigual; la rama lleva las algas por tramos; el aparejo se
lee entero —boya, nudo, sedal, plomo y cebo— y con él la cota a la que cuelga;
y el segundo estado está computado: mover el nudo de 0,40 a 1,15 cambia quién
viene, de `pez-super` a `pez-fondo`.

**Lo que no pasa la medida:**

- **`herbazal` y `limo` quedan a 0,0154 y el mínimo es 0,030.** No es un
  descuido de un color: es estructural. El agua aplana —absorbe el rojo y come
  el contraste—, y debajo hay **cinco** materiales compitiendo en una banda
  estrecha: limo, piedra, alga, madera y hierba. Subir uno acerca otro par: en
  esta vuelta se separaron limo/piedra y alga/madera, y al hacerlo se juntaron
  hierba/limo. La salida no es seguir empujando albedos uno a uno, es rehacer
  la paleta sumergida entera, y probablemente quitar un material del encuadre.

**Lo que ni siquiera se ha intentado todavía:** la nube de migas, la lámina de
causalidad, la composición de móvil, el tema claro, la capa vectorial con las
teclas y el anillo de destino, y el SVG de entrega.

**Lo que una persona tiene que mirar**, porque el test no lo contesta: si la
superficie se lee como agua o como una raya; si el cielo, que hoy es un
degradado liso, aguanta; y si la orilla de enfrente deja de ser una losa.
