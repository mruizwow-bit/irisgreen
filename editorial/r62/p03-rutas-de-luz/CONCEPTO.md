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

---

## Rework de QA humano (R62_P03_HUMAN_QA_REWORK_REQUIRED)

Cuatro defectos señalados, cuatro correcciones. Lo que se cambió y por qué.

### 1 · «No se lee como una sala»

Era cierto y la causa era geométrica, no de iluminación. La cámara frontal
proyectaba `x → ox + x·u` sin que la profundidad tocara la horizontal, y con
eso **un plano de x constante —un testero— proyecta sobre una recta**: los
testeros estaban dibujados desde el principio y era imposible verlos. Ninguna
cantidad de luz iba a arreglar eso.

La cámara `Frontal` acepta ahora un `skew` que desplaza lateralmente lo que se
aleja. Con `skew = 0.26` los testeros se abren, el suelo se aleja de verdad y
la sala tiene retorno. El valor por defecto es `0`, que es exactamente lo que
P01 y P02 aprobados tienen dibujado: `test_e4_motor_identico.py` sigue dando
las cuatro láminas de P01 **idénticas byte a byte**. El motor se ha extendido,
no se ha cambiado.

Con el volumen a la vista se corrigió además el encuadre: anclado por abajo en
vez de centrado. Centrando, cuando la sala no cabía se recortaba por los dos
lados y lo primero que se iba era el suelo, que es justo lo que hacía falta.

### 2 · «El muro es una retícula casi perfecta»

Revoco arriba, sillarejo abajo, con el límite entre los dos irregular
(`_perfil_zocalo`: dos senos de distinto período más ruido) y tres calas de
revoco perdido por donde asoma la piedra. El muro dejó de tener una sola
textura y un solo ritmo.

### 3 · «La luz no actúa»

Dos mitades, y sólo tenía diagnosticada una.

La primera: **nada proyectaba sombra sobre el muro**. La causa era la marcha de
sombras en espacio de pantalla, que tiene alcance finito en el mundo (~3,5
unidades), contra una separación plano de juego → muro de más de 3 m. El muro
pasó de y = 4,2 a y = 2,6.

La segunda: **el haz pasaba a un palmo de la pared sin iluminarla**. El plano
de juego estaba en mitad de la sala; se ha acercado al muro (`HAZ_Y0, HAZ_Y1 =
1,98 / 2,50`) y ahora el haz roza el muro, lo ilumina a lo largo de todo su
recorrido y cada pieza tira su sombra corta detrás. Un haz que ilumina algo
deja de ser una barra pintada encima.

### 4 · «El bastidor es ruido»

Las siete varillas verticales de suelo a techo se fueron. Lo que se probó
después, y falló, queda anotado porque explica el resultado:

- **Brazos en voladizo con placa contra el muro.** Treinta y cinco placas
  oscuras repartidas por la rejilla volvían a dibujar la cuadrícula.
- **Brazos largos.** Con el plano de juego en mitad de la sala cada brazo
  tiraba una sombra larga, y treinta y cinco sombras iguales en diagonal eran
  otra vez una retícula, ahora de sombras.

Lo que quedó: una ménsula corta y oscura por anclaje, y **latón sólo donde hay
pieza montada**. Un anclaje vacío es un agujero en el muro, no una joya: si
todos brillan igual, el tablero no dice dónde está montado nada.

### Encuadres rehechos

Móvil y causalidad pedían hasta z = 7,45 y z = 7,55 de una sala que ahora mide
6,6 de alto: el tercio superior de ambas láminas era techo vacío. Además la
lámina de causalidad cortaba por el borde la pantalla del sur, que es
precisamente la que se enciende y lo único que esa lámina viene a demostrar.
Las dos ventanas están rehechas contra la sala que hay.

### Lo que sigue corto

- Los anclajes vacíos han quedado **muy** callados. Se lee mejor como imagen y
  peor como tablero: en producción habrá que darles un estado de foco al pasar
  la pieza por encima, no más brillo permanente.
- El testero de la derecha se ve poco; el encuadre lo deja casi de canto.
- La sala no tiene nada que la feche ni que diga para qué sirve. Es un volumen
  correcto y todavía anónimo.

---

## Segundo rework de QA (62_P03_ASTRA_REWORK_PARTIAL_PASS_TWO_VISUAL_BLOCKERS_REMAIN)

### Bloqueo 1 · El tablero no se leía

Los anclajes vacíos habían quedado tan callados que se leían como clavos o
desconchones. Dos intentos de arreglarlo **dentro del render** fallaron, y los
dos por la misma razón:

- **Hueco oscuro con brocal iluminado arriba.** Salieron treinta y cinco setas.
  Con la luz cayendo desde la izquierda alta, lo que se ilumina dentro de un
  agujero es su pared de abajo; el filo claro arriba convierte el hueco en
  bulto.
- **Hueco pintado con el hierro nuevo, que es oscuro y frío.** Treinta y cinco
  puntos negros regulares: la cuadrícula otra vez, ahora dentro de la obra.

A veinte píxeles y sobre piedra con grano, ningún dibujo plano sobre el muro se
lee como agujero. Y el problema estaba mal planteado: **dónde se puede montar
una pieza no es materia, es información de juego**, y por el §6 de la norma va
en la capa vectorial, que además es donde se le puede garantizar contraste. En
el muro queda sólo un hueco de piedra en sombra, muy callado.

En vector van **los anclajes que pisa el haz**, no los treinta y cinco. Marcando
los treinta y cinco el tablero se lee perfectamente y la lámina se convierte en
una retícula de anillos encima de la sala: el defecto de la vuelta anterior,
otra vez, ahora en lila. Un espejo puesto donde no pasa la luz no hace nada, así
que los sitios que importan son los que el haz toca. Es menos ruido y además
enseña la regla. Cada marca lleva halo oscuro bajo el trazo de acento: un token
garantiza contraste contra el fondo de su tema, nunca contra la obra.

La pantalla del sur estaba en x = 10,18 y acababa justo en el muro, con su
banderola ya fuera del encuadre, enterrada en un testero sin luz. Se ha metido
a 9,52. El testero dejó de ser una losa negra al entrar el relleno (abajo): la
banda derecha pasó de 0,30 a 0,36 veces la luminancia del centro.

### Bloqueo 2 · Todo era la misma materia

Aquí lo que falló primero fue la medida. «Si piedra, madera, latón, hierro,
papel y vidrio se distinguen» estaba en `no_medido`, o sea que nunca se
comprobó. Medido por familia de material sobre la imagen compuesta, el hierro
salía a 0,264 de luminancia contra 0,203 de la piedra: **más claro que la
piedra**, y a 0,002 del papel. La reja de hierro se leía como un relieve
tallado en la pared, y con razón.

Y bajarle el albedo lo empeoraba. La causa: **el especular de este motor no va
multiplicado por el albedo**. A rugosidad media el exponente del brillo cae y
el material se cubre de un velo gris que no responde a lo oscuro que sea. Con
el albedo bajado de 0,135 a 0,046 el hierro salió *más claro*, no más oscuro.
Lo que lo arregla es la rugosidad —0,20, brillo concentrado— más `spec_k` de
0,46 a 0,30.

La niebla hacía la otra mitad: con `fog_k` 0,52 todo lo lejano converge al
mismo tono. Baja a 0,38.

Y faltaba una segunda luz. Con una sola clave y ambiente hemisférico, todo lo
que no mira a la luz cae al mismo gris. `shade` acepta ahora un `fill`
direccional sin sombra —un relleno frío desde el lado contrario— que no es una
fuente sino el resto de la sala. Por defecto `None`; P01 sigue idéntico byte a
byte.

Además, el canto del divisor se pintaba de latón mate, así que el vidrio no
llegaba a verse en ninguna lámina: 35 píxeles de vidrio en toda la escena.

**Medido, antes → después** (distancia RGB entre familias, sobre la imagen
compuesta):

| | antes | después |
|---|---|---|
| peor par | 0,002 (hierro/papel) | 0,054 (madera/hierro) |
| segundo par | — | 0,070 (piedra/hierro) |
| hierro | 0,264 | 0,159 |
| piedra | 0,203 | 0,201 |
| madera | 0,162 | 0,172 |

La prueba mide ahora esta separación y falla por debajo de 0,045.

### Lo que sigue corto

- 0,054 entre madera y hierro es poco. La sala es oscura a propósito —el asunto
  es la luz en el aire— y esa oscuridad comprime la materia. Está mejor, no
  resuelto.
- Los huecos vacíos siguen dibujando un patrón regular en la zona de revoco, más
  visible de lo que querría.
- El vidrio se lee en la lámina de causalidad y apenas en la de gameplay, donde
  la pieza en mano cae sobre un fondo claro.

### De paso: 419 líneas muertas en el motor

`ig_render_e4.py` tenía duplicado todo el bloque de `box` a `blit_heightfield`:
dos copias, la segunda tapando a la primera. Venía de un empalme mío mal
cortado. Borrada la copia muerta, de 1.178 líneas a 774, con P01 idéntico byte
a byte antes y después.
