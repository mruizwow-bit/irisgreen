# R62 · P03 · Rutas de luz · concepto

**Estado:** `R62_P03_RUTAS_LUZ_CONCEPT_READY_FOR_ASTRA`
**Autorización:** `R62_P03_RUTAS_LUZ_CONCEPT_AUTHORIZED`
**Fecha:** 29/09/2026
**Tipo:** puzle de caminos/conexiones.
**Generador:** `scripts/r62_p03_render.py` sobre `scripts/ig_render_e4.py`.
El motor no se toca: P01 sigue idéntico byte a byte.

Láminas: `gameplay-{navy,claro}.svg`, `gameplay-movil-{navy,claro}.svg` y
`causalidad-{navy,claro}.svg`.

---

## 1 · Imagen principal de gameplay

Una sala en penumbra, casi de alzado. Por un postigo abierto en el muro de la
izquierda entra una hoja de luz de tarde que cruza el aire, gira en un espejo
de latón montado en el bastidor y sube hasta una pantalla de papel, que revela
el dibujo que tiene impreso y levanta su banderola.

A media altura hay un segundo espejo sin usar; abajo a la derecha, otra
pantalla apagada esperando. En el centro, **el divisor que se está colocando**,
suspendido sobre su anclaje, con el anillo punteado del destino y la vertical
de caída.

Lo que hay que ver de un vistazo: de dónde sale la luz, por dónde va, dónde
llega, y que hay una pieza a punto de cambiar eso.

## 2 · Segundo estado / interacción

`causalidad-*.svg`. El mismo encuadre antes y después de poner **una** pieza,
el divisor, en el anclaje que la lámina principal estaba señalando.

- **Antes:** el haz llega entero al espejo de arriba y enciende una pantalla.
- **Después:** el divisor parte el haz. Una mitad sigue recto y sube; la otra
  baja, gira y cruza por encima del contrafuerte. Se encienden las dos
  pantallas, **y las dos con menos luz que la única de antes.**

Ese último detalle es el que enseña la regla del juego sin enunciarla: la luz
no se duplica, se reparte. Está computado, no dibujado: a la pantalla del norte
le llegaba 0,94 y ahora le llega 0,45.

## 3 · Mecánica

Hay una sola fuente de luz y no se mueve. Lo que la persona mueve son las
piezas:

| Pieza | Qué hace |
| --- | --- |
| **Espejo** | gira el haz 90°. Dos orientaciones: `/` y `\` |
| **Divisor** | deja pasar la mitad y gira la otra mitad |

Las piezas sólo van en los **anclajes**: los collarines de latón del bastidor
de varillas que recorre la sala de suelo a techo. La rejilla no es una
convención invisible; se ve, y por eso se entiende dónde cabe una pieza y dónde
no.

Los **obstáculos** son de piedra y de hierro: dos contrafuertes y una reja
colgada. No son adorno. Cortan el rayo de verdad, y la reja está justo donde
está para tapar la bajada que a primera vista parece la buena.

La **ruta se calcula**: el haz sale del postigo, rebota en los espejos que haya
puestos con reflexión respecto a la normal de cada uno, se parte en el divisor
y se corta contra lo que encuentre. El juego **no guarda ninguna solución
esperada**. Sólo sabe dónde acaba la luz.

## 4 · Bucle

`mirar → colocar o girar → ver por dónde va ahora → ajustar`

Sin cronómetro, sin puntuación, sin vidas, sin estrellas, sin racha, sin
fracaso irreversible. Una pieza mal puesta se ve y se quita.

## 5 · Qué lo hace juego

Que el sitio y el ángulo importan, y que hay **más de una manera** de acertar.
Medido sobre el tablero de la lámina —35 anclajes, dos orientaciones—:

- encender la pantalla del norte: **más de una ruta distinta**;
- encender las dos a la vez: **diez combinaciones**, y el reparto puede hacerse
  en seis columnas distintas del bastidor.

No están enumeradas en ninguna tabla: salen de trazar. Por eso una solución que
a nadie se le había ocurrido también vale.

## 6 · Qué NO es

No es un juego de láser ni de ciencia ficción. No hay rayo fino, ni neón, ni
destellos, ni objetivo militar, ni puntuación por eficiencia, ni «nivel
completado» con fanfarria. No hay arquitectura imposible ni perspectivas
truncadas: la sala es una sala, con su suelo, su muro y sus vigas.

Tampoco es una lección de óptica. Es un juguete con reglas, y las reglas se
parecen a la luz lo justo para ser coherentes.

## 7 · Materiales, luz y paleta

Sala en penumbra de piedra y madera: muro de sillarejo `#251F1B`, zócalo y
suelo más oscuros, vigas de castaño `#1D1610`. Las piezas son de **latón**
—pulido `#B88B3E` en la hoja, mate en los brazos y las pinzas—, el bastidor de
hierro `#232324`, y las pantallas de **papel** `#D1C6AA`, que al encenderse
suben hasta `#F0E2C2`.

La luz de la sala es baja y rasante. La luz que importa es la que entra por el
postigo, cálida `#FFDA9D`, y **se ve en el aire**: el haz es una lámina de
polvo iluminado, no una línea. Se abre un poco y se apaga con la distancia,
porque el aire se lo come; por eso el tramo largo llega más flojo que el corto.

Cuatro recursos hacen el volumen: la extinción del haz a lo largo del
recorrido, el polvo que lo hace desigual, la oclusión —lo que está delante tapa
el haz sin que haya que ordenarlo a mano— y el resplandor corto donde el haz
muere contra algo.

## 8 · Qué se mueve

Muy poco y muy despacio. El espejo gira en unos 250 ms con un final suave. El
haz **no se anima**: cuando el espejo termina de girar, la ruta ya es la otra.
La pantalla sube de brillo en unos 600 ms y la banderola se levanta con ella.
El polvo del haz deriva muy lentamente, apenas perceptible.

Nada parpadea, nada rebota, no hay partículas de relleno, no hay destellos al
acertar y no hay movimiento de fondo obligatorio.

## 9 · Qué hace la persona

Mira por dónde va la luz. Coge una pieza, la pone en un anclaje, la gira si
hace falta, la quita si no sirve. Puede deshacer, rehacer y reiniciar. Puede
dejarlo a medias y volver.

Si selecciona una pieza puede leer, si quiere, qué hace; la información es
opcional y sale de la pieza.

## 10 · Controles equivalentes

| | Teclado | Puntero / táctil |
| --- | --- | --- |
| Recorrer las piezas | `Tab` y flechas | tocar la bandeja |
| Elegir pieza | `Enter` | tocarla |
| Moverse por los anclajes | flechas | — |
| Colocar | `Enter` | tocar el anclaje, **o** arrastrar |
| Girar lo colocado | `R` | botón en la pieza seleccionada |
| Retirar | `Supr` | botón en la pieza seleccionada |
| Deshacer / rehacer | `Ctrl+Z` / `Ctrl+Y` | botones |
| Reiniciar | botón, con confirmación | ídem |

El arrastre **nunca** es la única vía: «elegir pieza → elegir anclaje →
colocar» cubre todo. Objetivos de 44 px, y 56 px con
`html[data-ig-controls="big"]`; en móvil, 60 px.

Las teclas van **escritas en la propia lámina**, junto a la bandeja. Decir en
un documento que hay teclado y no enseñarlo deja la duda de si es un añadido
posterior.

## 11 · Estado sin depender del color

Esto es lo que más condiciona el diseño, y está resuelto en tres señales
independientes:

1. **El haz se ve.** No hace falta deducir si la luz llega: se ve pasar por el
   aire y se ve morir contra lo que toca.
2. **La pantalla revela su dibujo.** Cada pantalla lleva **una forma distinta**
   impresa —anillos en la del norte, espigas en la del sur— y se ve tenue
   aunque esté apagada, así que se sabe cuál es cuál antes de encenderla. Al
   llegar la luz el dibujo no aparece: se afirma.
3. **La banderola de latón se levanta.** Cambio de forma y de posición, no de
   color.

Y una cuarta, cuantitativa: el brillo de la pantalla sigue a la luz que
recibe, así que «media luz» se ve como media luz.

En `forced-colors` el haz se dibuja como banda con trama y contorno, las
pantallas muestran su dibujo como línea, y cada pieza conserva su borde.

## 12 · Reduced motion

Con `prefers-reduced-motion` **o** `html[data-ig-motion="off"]` —las dos
señales— el giro del espejo es un corte seco, la pantalla cambia de brillo en
un paso, la banderola salta a su posición y el polvo se queda quieto. Sin
flashes en ningún modo.

## 13 · Adaptación por etapa

Misma identidad visual en todas las edades. Cambia la cantidad de decisiones,
no el aspecto.

Infancia arranca con el bastidor reducido —tres columnas, tres alturas—, una
sola pantalla, sólo espejos y sin obstáculos móviles. Adolescencia y adultez
añaden el divisor, más anclajes, dos y tres pantallas, obstáculos que hay que
rodear y tableros donde la luz llega justa y el reparto obliga a elegir.

Adultez no significa interfaz gris y técnica, e infancia no significa versión
cute. Es la misma sala.

## 14 · Riesgo de similitud con IP externa

- **Vista propia.** Casi alzado de una sala con su bastidor, no cámara
  isométrica ni arquitectura imposible ni perspectiva truncada. No se parece al
  encuadre de los productos conocidos del género.
- **Sin personajes.** No hay avatar, ni criatura, ni guía.
- **Sin estética de láser.** La luz es diurna, ancha y polvorienta.
- **Lenguaje visual generado, no trazado.** Toda la geometría y todas las
  texturas salen de las funciones del generador con semilla fija. No hay assets
  de terceros, ni stock, ni calco.

La inspiración admisible es sólo el principio abstracto: llevar algo de un
sitio a otro redirigiéndolo.

## 15 · Criterio de PASS visual

A 1440 y a 390:

1. Se entiende de dónde sale la luz y hacia dónde va sin leer nada.
2. El haz se lee como luz en el aire y no como una línea dibujada encima.
3. Piedra, madera, latón, hierro, papel y vidrio se reconocen como materiales
   distintos.
4. Encendido y apagado se distinguen sin usar el color.
5. La segunda lámina se entiende sin leer los pies.
6. Ningún elemento puede confundirse con obra de terceros.

---

## Qué simula el sistema y qué es sólo representación

**Simulación real.** El trazado del haz: reflexión respecto a la normal del
espejo, reparto en el divisor, corte contra obstáculos y pantallas, y la
intensidad que queda en cada rama. De ahí salen las rutas, las soluciones
múltiples y el brillo de cada pantalla.

**Sólo representación visual.** El polvo, el resplandor donde el haz muere, la
extinción con la distancia y el brillo del latón responden al estado pero no lo
calculan. No hay refracción, ni dispersión, ni color de la luz por longitud de
onda, ni pérdida por ángulo de incidencia.

**Lo que NO se simula, y por tanto no se afirma.** Esto no es un simulador
óptico y no se presenta como tal. El divisor reparte mitad y mitad porque es
una regla clara de juego, no porque se haya modelado un vidrio semirreflectante
real. Si algún día se añade información óptica de verdad al seleccionar una
pieza, irá con su fuente y separada de lo que el juego calcula.
