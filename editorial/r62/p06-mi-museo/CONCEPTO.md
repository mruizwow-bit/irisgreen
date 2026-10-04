# R62 · P06 · Mi museo · concepto

**Estado:** `R62_P06_MUSEO_CONCEPT_READY_FOR_ASTRA_AURA_MARIA`
**Fecha:** 04/10/2026
**Tipo:** juego de ordenar y explicar, con una sala que responde.
**Generador:** `scripts/r62_p06_render.py` sobre `scripts/ig_render_e4.py`.
El motor no se toca: `test_e4_motor_identico.py` sigue devolviendo las cuatro
láminas de P01 idénticas byte a byte.

Láminas de trabajo: `sala-trabajo.png`.
Las de entrega —`gameplay-{navy,claro}.svg`, `gameplay-movil-*`,
`causalidad-*`— salen cuando este concepto esté aprobado.

Cierra la serie de seis.

---

## 0 · La decisión que ordena todo lo demás

**La sala responde, pero no corrige.** No hay una colocación correcta que el
juego conozca de antemano y hacia la que empuje. Lo que el juego sabe hacer es
**enseñar las consecuencias** de lo que se ha colocado: por dónde pasa quien
visita, en qué se para, qué se ve antes y qué se ve después, y cuánta luz le
está cayendo encima a cada cosa.

De ahí sale lo que lo hace jugable para quien lo juega y no para quien lo
diseñó: **dos criterios que tiran en direcciones contrarias**. Lo que más se
quiere enseñar pide luz, y la luz es justo lo que no aguanta lo frágil. Un
museo de verdad vive en esa tensión, y es una tensión que se puede ver sin
leer ni una cifra.

## 1 · Imagen principal de gameplay

Una sala pequeña vista casi de frente: suelo de tarima, paramentos de yeso,
una lama de claraboya que entra por la izquierda y cruza el aire hasta el suelo,
y **tres vitrinas** de distinta altura con sus pies de latón.

Dentro de las vitrinas, piezas de una colección: en la primera, tres cantos
pulidos escalonados; en la segunda, una pieza de cerámica partida con su borde
reconstruido; en la tercera, dos láminas de papel montadas de pie, que son lo
frágil de la sala. Cada vitrina lleva su foco orientable arriba, y la tercera lo
tiene **recogido**, apuntando al techo.

En el centro, **la pieza que se está moviendo**: suspendida sobre su hueco, con
el anillo punteado del destino, su sombra en el estante de abajo y la vertical
de caída.

Al fondo, un banco. En el suelo, la **huella de paso** de la última visita
simulada: una traza tenue que entra por la derecha, se detiene dos veces y sale.

Lo que hay que ver de un vistazo: qué hay, cómo está agrupado, dónde da la luz
y que una pieza está a punto de cambiar de sitio.

## 2 · Segundo estado / interacción

`causalidad-*.svg`. El mismo encuadre antes y después de mover **una sola
pieza**: el canto pulido pequeño, de la vitrina de los cantos a la de la
cerámica.

- **Antes:** la agrupación de la primera vitrina se lee por *material* —tres
  piedras— y la huella de paso se detiene una vez, al principio.
- **Después:** la primera vitrina se queda con dos piezas y pierde la serie; la
  segunda pasa a tener piedra y barro juntos, que es una agrupación por *oficio*
  y no por material. La huella de paso cambia: ahora se para en la segunda, y
  más tiempo.

Y el tercer efecto, que es el que enseña la tensión del §0: al mover la pieza
**no cambia la luz**, pero sí cambia a quién le importa. Las dos láminas de
papel siguen en penumbra, y siguen siendo lo que nadie mira.

Está computado: la huella sale de recorrer la sala, no de un guion.

## 3 · Mecánica

Tres cosas se tocan, y ninguna tiene marcha atrás que castigue:

| | Qué se hace |
| --- | --- |
| **Colocar** | sacar una pieza del almacén y ponerla en un hueco de una vitrina |
| **Agrupar** | las piezas que comparten vitrina forman un conjunto, y el conjunto tiene una lectura |
| **Alumbrar** | orientar el foco de cada vitrina y subir o bajar su intensidad |

Cada pieza lleva escritos cuatro rasgos visibles: **material**, **oficio**,
**época** y **fragilidad**. Los tres primeros se ven en la pieza; la fragilidad
se ve en cómo está montada —lo frágil va tumbado, sujeto o de pie sobre un
soporte propio—.

**La lectura de un conjunto se calcula.** Si las piezas de una vitrina comparten
un rasgo y sólo uno, el conjunto se lee por ese rasgo y la etiqueta lo dice. Si
comparten dos, se lee por el más específico. Si no comparten ninguno, la
etiqueta lo dice también, sin reproche: *«aquí hay cosas que no se parecen»*,
que a veces es exactamente lo que alguien quiere montar.

**La visita se simula.** Alguien entra por la derecha y recorre la sala. Se
detiene donde hay algo que **se ve** —que depende de la luz que le llega, del
tamaño de la pieza y de si está tapada por otra— y se queda más donde el
conjunto tiene una lectura clara. De ahí salen la huella del suelo y las
paradas.

**La luz tiene precio.** Cada pieza tiene un límite de luz según su fragilidad.
Pasarse no destruye nada ni da un aviso rojo: la etiqueta de la pieza enseña una
marca de exposición que va subiendo, y el juego lo deja ahí. Es información,
no castigo.

## 4 · Bucle

`mirar la sala → mover una pieza o un foco → ver por dónde pasa la visita →
ajustar`

Sin cronómetro, sin puntuación, sin estrellas, sin «montaje completado». Una
sala a medias es una sala, y se puede dejar y volver.

## 5 · Qué lo hace juego

Que hay más de una manera de que la sala funcione, y que ninguna las gana
todas. Medido sobre las piezas de la lámina —nueve piezas, tres vitrinas,
cuatro rasgos—:

- montar **tres conjuntos con lectura clara**: once repartos distintos;
- que la visita se pare en las tres vitrinas: se puede, pero obliga a subir la
  luz de la tercera, y la tercera es la del papel;
- que nada se pase de su límite de luz **y** la visita se pare tres veces:
  **no se puede con estas nueve piezas**, y eso no es un fallo del montaje: es
  el juego enseñando que hay que elegir.

Esa última línea es la mecánica entera en una frase, y no está escrita en
ninguna tabla: sale de contar.

## 6 · Qué NO es

No es un simulador de gestión: no hay presupuesto, ni visitantes por hora, ni
tienda, ni estrellas de reseña, ni ampliar el museo. No hay tiempo corriendo y
no hay dinero.

No es un juego de decoración: las piezas no se puntúan por combinar, y no hay
«estilo» que desbloquear.

Y no es una lección de museología. El juego usa dos ideas reales —que la luz
degrada y que un conjunto se lee por lo que comparte— porque son buenas reglas
de juego, no para enseñar la profesión.

## 7 · Materiales, luz y paleta

Sala de yeso y madera, de día nublado: paramentos `#2A2824` con el yeso vivo y
sus desconchones, rodapié y tarima de roble `#3A2A1A` con la veta abierta en las
juntas de paso, y el banco del fondo del mismo roble más oscuro.

Las vitrinas son de **vidrio y latón**: montantes de latón mate `#8A6A32`,
vidrio con su canto verde —un vidrio se delata por el canto, no por el
reflejo— y un reflejo largo y tendido en cada luna.

Las piezas traen su propio material: canto de río gris verdoso, cerámica
`#8A4A2E` con el barro visto en la rotura, papel `#C8BA98`.

**Dos luces, y las dos cuentan.** La lama de claraboya entra por arriba a la
izquierda, cálida `#FFE2B0`, y es la que da la forma de la sala: cruza el aire,
cae en la tarima y la dibuja. Los focos de las vitrinas son la segunda fuente,
fríos y cortos, y sólo alumbran lo suyo: por eso una vitrina apagada se queda
en penumbra aunque la sala tenga luz.

Cuatro recursos hacen el volumen: la lama de luz visible en el aire con su
polvo, la sombra de cada vitrina tendida en la tarima, el rebote cálido del
suelo hacia los bajos de las vitrinas, y el reflejo de las lunas, que cambia
con el ángulo y por eso sitúa cada vitrina en su profundidad.

## 8 · Qué se mueve

Casi nada. La pieza que se coloca baja a su hueco en unos 400 ms y se asienta.
El foco gira despacio y el charco de luz se desplaza con él. La huella de la
visita se dibuja de una vez cuando se pide, no se anima paso a paso: una
figura caminando por la sala sería un personaje, y aquí no hay personajes.

El polvo de la lama de luz deriva muy lentamente. Nada parpadea, nada rebota,
no hay destello al colocar bien.

## 9 · Qué hace la persona

Mira la sala. Coge una pieza del almacén, la pone, la cambia de sitio, la
quita. Orienta un foco. Pide ver la visita. Lee lo que dice la etiqueta de un
conjunto, si quiere.

Puede escribir su propia etiqueta encima de la que calcula el juego. Lo que
escribe no se corrige nunca y no se puntúa; es su sala.

## 10 · Controles equivalentes

| | Teclado | Puntero / táctil |
| --- | --- | --- |
| Recorrer el almacén | `Tab` y flechas | tocar la bandeja |
| Elegir pieza | `Enter` | tocarla |
| Recorrer los huecos | flechas | — |
| Colocar | `Enter` | tocar el hueco, **o** arrastrar |
| Retirar | `Supr` | botón en la pieza seleccionada |
| Elegir foco | `F` y flechas | tocar el foco |
| Orientar el foco | flechas `←` `→` | arrastrar el foco, **o** tocar la zona |
| Subir / bajar la luz | `+` / `−` | botones |
| Ver la visita | `V` | botón |
| Escribir etiqueta | `E` | tocar la etiqueta |
| Deshacer / rehacer | `Ctrl+Z` / `Ctrl+Y` | botones |

El arrastre **nunca** es la única vía. Objetivos de 44 px, 56 px con
`html[data-ig-controls="big"]`, y 60 px en móvil. Las teclas van **escritas en
la propia lámina**, junto a la bandeja.

## 11 · Estado sin depender del color

1. **La luz que llega se ve como luz**: hay un charco claro en el estante y un
   degradado en la pieza. No hace falta leer ninguna barra.
2. **La fragilidad se ve en el montaje**: lo frágil va tumbado o sujeto con un
   soporte propio, y eso es forma, no color.
3. **El conjunto se lee por la etiqueta**, que es texto, y por la **separación**:
   las piezas de un mismo conjunto se colocan juntas y alineadas; las que no
   comparten nada quedan sueltas en el estante, y eso se ve.
4. **La huella de la visita es una traza con sus paradas marcadas** como
   círculos de distinto tamaño: geometría, no tono.
5. **La marca de exposición** de una pieza es un arco que se va cerrando, no un
   color que cambia de verde a rojo.

En `forced-colors` las lunas se dibujan con su canto como línea, los charcos de
luz como trama, la huella como línea de puntos y las marcas de exposición como
arcos.

## 12 · Reduced motion

Con `prefers-reduced-motion` **o** `html[data-ig-motion="off"]` —las dos
señales— la pieza aparece colocada sin recorrido, el foco salta a su
orientación, el charco de luz se redibuja de una vez, la huella aparece entera
y el polvo se queda quieto. Sin flashes en ningún modo.

## 13 · Adaptación por etapa

Misma identidad visual a todas las edades. Cambia la cantidad de decisiones, no
el aspecto.

Infancia: una vitrina, cuatro piezas, dos rasgos —material y oficio—, luz fija
y sin límite de exposición. Agrupar y ver que la agrupación tiene nombre es
suficiente juego.

Adolescencia y adultez: tres vitrinas, los cuatro rasgos, focos orientables,
límite de exposición y la visita simulada. Y las nueve piezas del §5, con las
que no se puede tener todo.

Adultez no significa interfaz técnica, e infancia no significa versión mona. Es
la misma sala.

## 14 · Riesgo de similitud con IP externa

- **Vista propia.** Sala casi de frente con sesgo lateral, no isométrica ni en
  perspectiva de primera persona.
- **Sin personajes.** La visita se enseña como huella en el suelo, no como
  figura: no hay avatar, ni visitante dibujado, ni guía.
- **Sin gestión.** No hay dinero, ni tiempo, ni público que se enfada, que es
  justo lo que identifica a los juegos de montar museos.
- **Piezas inventadas.** No hay obra real, ni nombre de artista, ni objeto de
  colección existente: tres familias de piezas generadas con las funciones del
  generador.
- **Lenguaje visual generado, no trazado.** Toda la geometría y toda la textura
  salen del generador con semilla fija. No hay assets de terceros, ni stock, ni
  calco.

La inspiración admisible es sólo el principio abstracto: poner cosas juntas y
que eso signifique algo.

## 15 · Criterio de PASS visual

A 1440 y a 390:

1. Se entiende que es una sala con vitrinas sin leer nada.
2. El vidrio se lee como vidrio —por el canto y por el reflejo tendido—, no
   como un rectángulo claro.
3. Yeso, roble, latón, vidrio, piedra, barro y papel se reconocen como
   materiales distintos.
4. Se ve qué vitrina está alumbrada y cuál no, sin usar el color.
5. La huella de la visita se entiende como recorrido y paradas.
6. La segunda lámina se entiende sin leer los pies.
7. A 390 px es una composición propia y no la de escritorio encogida.
8. Ningún elemento puede confundirse con obra de terceros.

---

## Qué simula el sistema y qué es sólo representación

**Simulación real.** La luz que llega a cada pieza, a partir de la orientación y
la intensidad de su foco y de la distancia; la acumulación de exposición de cada
pieza contra su límite; la lectura de cada conjunto a partir de los rasgos que
comparten sus piezas; y el recorrido de la visita, que sale de qué se ve desde
dónde —luz, tamaño y oclusión— y no de un guion escrito. De ahí salen los once
repartos del §5 y el hecho, contado y no decidido, de que no se pueda tener
todo.

**Sólo representación visual.** El polvo de la lama de claraboya, el reflejo de
las lunas, el canto verde del vidrio y el rebote del suelo responden al estado
pero no lo calculan. No hay fotometría real, ni unidades de lux, ni modelo de
degradación de materiales.

**Lo que NO se simula, y por tanto no se afirma.** Esto no es un simulador de
conservación ni de museografía, y no se presenta como tal. Los límites de luz
de las piezas son reglas de juego con una forma parecida a la de las reales,
no valores sacados de ninguna norma, y el juego no dice en ningún sitio cuántos
lux aguanta un papel de verdad. Si algún día se añade información real de
conservación, irá con su fuente y separada de lo que el juego calcula.

---

## Lo que sigue corto · primera vuelta E4 (04/10/2026)

La lámina de trabajo `sala-trabajo.png` es una **primera vuelta**. En la medida
de `scripts/test_r62_pilotos.py`, P06 **pasa** las tres comprobaciones
automáticas: el par de materiales más parecido —`banco` y `tarima`— queda a
0,0306 sobre un mínimo de 0,030, ninguna casilla de color ocupa más del 9,9 %
de la escena, y quitar la segunda fuente cambia la lámina en 0,0166. El gate
global del test sigue en FAIL **por P05**, no por esto.

**Lo que sí está:** la sala se lee con sus tres vitrinas de alturas distintas;
el latón es un perfil y no una tapa; las piezas se ven, y el barro se distingue
de la piedra y del papel; la lama de claraboya cruza y cae en la tarima; cada
foco proyecta su vara sobre el paramento; la vitrina del papel está en penumbra
con el foco recogido, que es el estado que el concepto quería contar; y la
traza de la visita sale de `visita()`, que se calcula. El segundo estado
también: mover el canto pequeño de la primera vitrina a la segunda cambia las
lecturas de `[material, material, época]` a `[oficio, sin rasgo común, época]`.

**Lo que sigue corto, y lo digo yo porque el test no lo mide:**

- **la urna se lee como mesa con dosel.** Están los pies, el estante y el
  remate, pero falta lo que dice «vitrina»: el canto del vidrio sólo está en
  los dos montantes delanteros, y sin el travesaño de abajo y el costado la
  caja no cierra;
- **la pieza que se está colocando no se distingue** de las colocadas: le falta
  la sombra sobre el estante y la vertical de caída, que es lo que en P02 y P03
  hace que se entienda que algo está en el aire;
- **los tres cantos de la primera vitrina son tres huevos iguales.** La serie
  se lee, pero la variación pieza a pieza es uniforme, que es justo lo que la
  referencia llama patrón en vez de uso;
- la lama de claraboya quema el suelo de la izquierda.

**Lo que ni siquiera se ha intentado:** la lámina de causalidad, la composición
de móvil, el tema claro, la capa vectorial con las etiquetas de conjunto, los
números de parada y las teclas, y el SVG de entrega.
