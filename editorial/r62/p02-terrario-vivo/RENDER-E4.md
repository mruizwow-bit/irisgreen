# P02 · Terrario vivo · rework visual E4

**Estado:** `R62_P02_TERRARIO_E4_R3_READY_FOR_ASTRA_MARIA`
**R1:** `R62_P02_E4_ENGINE_PASS_VISUAL_REFINEMENT_REQUIRED` · motor aceptado
**R2:** `R62_P02_E4_SCENE_PASS_CAUSALITY_VISUAL_REWORK_REQUIRED` · escena aceptada
**Fecha:** 29/09/2026
**Generador:** `scripts/r62_p02_render.py` sobre `scripts/ig_render_e4.py`
**Mecánica:** sin cambios. `CONCEPTO.md` sigue siendo la fuente; el §16 de la
norma visual reabre la calidad visual, no el diseño.

---

## Qué era y qué es

Era ilustración vectorial: rellenos planos, hojas de dos tonos, sombras
dibujadas a mano. Contra las cinco preguntas de `REFERENCIA-E4` fallaba las
cinco, y la primera lámina lo enseñaba sin discusión.

Ahora pasa por el mismo motor que P01. Lo que cambia respecto a P01 es lo que
la referencia dice que **no** se hereda: cámara, materiales y luz. P02 es
frontal y húmedo.

## De dónde sale el volumen

El terreno **es** una función de altura, no un dibujo de un terreno, y de ahí
cuelga la mecánica entera:

| | Cómo se obtiene |
| --- | --- |
| El agua se queda en el punto bajo | existe donde el terreno cae por debajo de la cota, no donde se dibuja |
| Las rocas hacen bulto | son domos **sumados** a la misma función de altura, así que el relieve las incluye y el agua las rodea |
| La roca da sombra ladera abajo | marcha de rayo contra el búfer de profundidad, no una elipse |
| El suelo en sombra retiene humedad | tinte por distancia al charco y por sombra de roca |
| El musgo prende donde hay sombra y humedad | su recorte **es** esa condición: donde no se cumple, no hay musgo |

La segunda lámina no ilustra la cadena: la ejecuta. Los dos paneles corren el
mismo generador y lo único que cambia entre ellos es una entrada más en la
lista de rocas. La sombra, la humedad y el musgo salen solos.

## Lo que hubo que añadir al motor

Tres piezas, todas por necesidad de esta lámina y todas con P01 idéntico byte a
byte después (`scripts/test_e4_motor_identico.py`):

1. **Rasterizado de relieve** (`blit_heightfield`). El rasterizador de
   paralelogramos no vale para un terreno: una celda con las cuatro esquinas a
   distinta altura no es plana. Trocearlo en escalones da bancales. Con cámara
   frontal ortográfica sale más corto marchar en profundidad y quedarse con el
   primer corte, afinado por bisección.
2. **Recorte por función** (`alpha`) y **dibujo por pieza** (`modula`) en el
   rasterizador de caras. Con eso una hoja es un cuadrilátero recortado por su
   perfil y con su nervio dibujado, sin teselar nada.
3. **Curva de contraste** en la composición. El tonemap de P01 comprime mucho,
   que es lo que quiere una sala de piedra con una entrada de luz fuerte y no
   lo que quiere una escena de sombra donde todo el rango útil está junto.

## Los errores que costaron más, por si sirven para P03

**La textura estirada en las faldas.** Muestrear el terreno por (x, y) parece
lo natural y funciona mientras el terreno sea tendido. En la falda de un canto
la superficie avanza mucho en profundidad para moverse poco en pantalla, la
textura se estira y salen chorreones verticales. Triplanar por el peso de la
normal, igual que en las caras.

**El vector de vista.** Lo puse a `(0, −1, 0)`, que parece obvio en una cámara
frontal y es falso: un desplazamiento no mueve el píxel si `dz = −rise·dy`, así
que el observador está en `(0, −1, rise)`. Con el valor falso el Fresnel del
agua daba 1 en toda la lámina y el charco era un espejo opaco.

**El agua como superficie.** Pintarla como cara opaca daba una mancha de color.
Tratarla como lámina tampoco bastaba: la ladera del fondo del charco no está
sumergida —está por encima del nivel— pero se ve a través de toda la columna de
agua, y salía seca e iluminada, con una banda pálida en medio del charco. Lo
que funciona es integrar el trozo de rayo que va por dentro del agua. De ahí
salen solos el borde claro, el centro oscuro y el rojo apagándose antes que el
verde.

**La hoja plana.** Las dos mitades de una hoja plana reciben exactamente la
misma luz y el ojo lo lee como papel. Doblada por el nervio, una mitad va hacia
la luz y la otra a la sombra.

**El especular sobre albedo oscuro.** El término especular no va teñido por el
albedo —es correcto— pero con un lóbulo ancho convierte una hoja oscura en
chapa gris. Hubo que bajarlo y subir la rugosidad del follaje.

## Medido contra la referencia

`scripts/test_r62_p02_e4.py`. El listón de la tercera sale de medir igual la
lámina aprobada de P01, que es lo único que evita inventarse un umbral.

| Pregunta | Medida | P02 R2 | Listón |
| --- | --- | --- | --- |
| ¿La sombra tiene penumbra? | parte de la sombra en valores intermedios | **73 %** | ≥ 30 % |
| ¿La imperfección es desigual? | desviación gruesa ÷ fina del albedo | **1,27** | ≥ 0,45 |
| ¿Alguna superficie grande plana? | mayor región contigua de varianza baja | **4,4 %** | ≤ 12 % · P01 da 2,0 % |
| ¿Hay segunda fuente? | escena alcanzada por el derrame del charco | **58 %** | ≥ 4 % |
| A 390, ¿composición propia? | ventana y cota distintas de las de escritorio | sí | distintas |

Y las cuatro que añade la R2, una por punto del rework que admite número:

| Punto del R2 | Medida | P02 R2 | Listón |
| --- | --- | --- | --- |
| Variedad de follaje | familias sobre el terreno · reparto de la mayor | **4 · 31 %** | ≥ 3 · ≤ 45 % |
| Colgantes ramificadas | ramas hijas por planta · sin ramificar | **3 a 6 · 0** | ≤ 1 sin ramificar |
| La roca nueva pertenece | su luminancia ÷ la de la escena | **1,64×** | ≤ 2,2× |
| La bandeja tiene nombres | etiqueta visible en móvil + `<title>` en las dos | 7 de 7 | todos |
| Se ve la consecuencia | musgo con roca vs sin roca, en el encuadre que se enseña | **+279 %** | ≥ +15 % |
| Cuánto cambia el panel | píxeles que cambian entre ANTES y DESPUÉS | **16 %** | ≥ 4 % |
| Dónde cae ese cambio | parte del cambio dentro de la roca y su sombra | **84 %** | ≥ 55 % |

Dos avisos sobre cómo está medida la de superficie plana, porque las dos formas
obvias dan números falsos. Sobre el **albedo** da 64 %, y es mentira: la tierra
tiene poco contraste de color y todo su relieve se lo da la luz, que en el
albedo todavía no está. Sobre la **imagen entera sin máscara** P01 da 71 %,
porque su vacío oscuro es liso de verdad; un fondo no es una superficie que
represente materia. Se mide sobre la imagen compuesta y dentro de la escena.

El del musgo cuenta **las dos capas**. Contar sólo el establecido se dejaba
fuera dos tercios del efecto: es el musgo joven el que se dispara en la sombra
de la roca (+65 % frente a +22 %).

**Lo que el test no mide, y por eso no declara:** si parece un terrario y no una
ficha; si los seis materiales se reconocen como materia distinta; **si la cadena
se entiende de un vistazo**; si algo recuerda a obra de terceros. El R2 lo dice
explícito y tiene razón: el porcentaje de musgo es evidencia técnica y no
sustituye la percepción.

## Pesos

| | WebP suelto | SVG autocontenido |
| --- | --- | --- |
| Escritorio 1180×900 | 287 KB | **257 KB** |
| Móvil 390×730 | 61 KB | **61 KB** |
| Causalidad (dos paneles) | — | **151 KB** |

El raster incrustado va a calidad 76 y no a 90 como en P01. P02 tiene mucho más
detalle de alta frecuencia —follaje, grano, musgo—, y a 90 la lámina de
escritorio se iba a 638 KB. Comparadas a 1440 no se distingue cuál es cuál.

## R2 · los seis puntos del refinamiento

El motor queda como estaba: la R2 dice KEEP y no lo he tocado. Todo lo de abajo
es escena. P01 sigue idéntico byte a byte.

### 1 · Sección frontal

No se arreglaba con más ruido; le faltaba **estructura**. Ahora los límites
entre capas ondulan en vez de ser rectas, la grava lleva cantos con su propio
relieve fingido —aclarar el cuarto que mira a la luz, hundir el opuesto—, la
arena tiene grano más fino, y bajan raíces desde las plantas que están cerca
del cristal. Sigue el nivel freático, que ya estaba y no es adorno.

Además ocupa menos: el encuadre sube de 1,46 a 1,62, que era la otra salida que
la orden dejaba abierta.

**Me pasé a la primera.** Saqué tres o cuatro raíces por cada planta cercana al
frente y el resultado fue una hilera de puntadas verticales de lado a lado: un
patrón, o sea exactamente el ruido gratuito que la orden prohíbe. Quedaron una
de cada tres plantas, una o dos raíces cada una, más largas, más torcidas y más
oscuras.

### 2 · Variedad de follaje

Tres familias nuevas, con silueta distinta y no sólo con otro tono:

| Familia | Qué la distingue a distancia |
| --- | --- |
| **cinta** | hojas largas y estrechas que arquean y se vencen |
| **redonda** | discos sobre peciolo, a distintas alturas |
| **cojín** | montículo bajo de hojas diminutas, sin estructura visible |

El reparto **no va por turnos**. Alternar familias no arregla «estrella +
helecho + estrella + helecho»: lo cambia por otro patrón. La familia la decide
un ruido de baja frecuencia sobre el terreno, así que las especies salen
agrupadas y los límites entre manchas son irregulares, que es como se ve un
plantado real. Sobre las 52 posiciones sale 16 redonda, 15 mata, 12 cojín,
9 cinta.

### 3 · Vegetación colgante

Eran cuerdas porque eran tres cosas a la vez: una vertical sin ramificar,
grosor constante y todas a la misma profundidad. Ahora el tallo avanza por
tramos con la dirección girando, ramifica hasta dos niveles, echa hojas
alternas, el grueso cae con el recorrido y **cada colgante tiene su propia
profundidad**, repartidas de 0,55 a 3,35: las de delante cruzan por encima de
las plantas del suelo.

Aquí también me pasé de frenada: al engordar el tallo se convirtió en un listón
de madera clara visto de frente. Dos caras en vez de una, mucho más fino y
oscuro —es tallo tierno a la sombra, no una estaca—, y más hojas.

### 4 · La cadena, a simple vista

Dos cambios, los dos en el cálculo y no en el dibujo:

- **el segundo eslabón se ve.** La sombra de la roca pesaba 0,42 sobre la
  humedad del sustrato y ahora pesa 0,78, y el tono mojado se enfría: tierra
  húmeda y en sombra no es sólo tierra más oscura, también pierde el rojo;
- **el musgo tiene dos densidades.** Una capa establecida con su umbral y otra
  de musgo joven, más claro, con un umbral más alto, así que sólo sale en el
  corazón de la zona favorable. Con una sola capa el musgo estaba o no estaba y
  el ojo sólo registraba el contorno; con dos hay gradiente, que es lo que hace
  visible un cambio de microentorno.

Medido en el mismo encuadre del díptico: musgo establecido **+22 %**, musgo
joven **+65 %**, total **+39 %**.

### 5 · La roca nueva

La primera corrección fue la equivocada: la hice más oscura y más pulida
pensando en el brillo mojado, y quedó peor —un domo liso con especular ancho es
una mancha blanca—. Midiendo, el problema no era el brillo: su difuso valía lo
mismo que el del sustrato. Era el **color**. Era gris neutra en un mundo verde
y marrón, así que saltaba por saturación y no por luminosidad.

Lleva verde y tierra dentro, material propio de piedra mojada —más oscura que
la seca, porque el agua le rellena el microrrelieve— y algo menos de altura.
Sigue identificándose como nueva por la silueta limpia y porque el musgo
todavía no la ha alcanzado, no por ser más clara. Medida: **1,x veces** la
luminancia de la escena, con el listón en 2,2.

### 6 · Bandeja móvil

El nombre va en tres sitios y por tres motivos distintos:

1. **etiqueta dentro de la casilla**, a 8,5 px, mientras quepa legible;
2. **`<title>` en cada casilla**, siempre, quepa o no la etiqueta — es el nombre
   accesible y no depende de que haya sitio en pantalla;
3. **nombre del seleccionado**, grande y fuera de la bandeja, que contesta «¿qué
   estoy colocando?» sin tener que localizar qué casilla está marcada.

Se mantienen los objetivos de 60 px, la tira horizontal, el mundo como
protagonista y los controles fuera del stage. La séptima casilla asoma cortada:
la tira se desplaza, y eso lo dice ella sola.

## R3 · que la cadena se vea

La R2 aceptó la escena y rechazó la causalidad, y el diagnóstico era el
correcto: el `+38 %` era evidencia técnica y la lámina no la enseñaba. Mirando
el díptico anterior, lo que fallaba era el **primer eslabón**.

### La sombra que decidía el musgo no era la sombra que se veía

El musgo prendía donde una elipse dibujada a mano decía que había sombra, con
su desplazamiento puesto a ojo junto a cada roca. Como número funcionaba —el
musgo cambiaba, y bastante—; como imagen no, porque la mancha de musgo no
tenía nada que ver con la sombra que el render dibujaba. La persona veía dos
cosas sueltas en el mismo sitio, no una consecuencia.

Ahora la sombra se calcula marchando hacia la luz contra el propio terreno.
Como las rocas están sumadas a la función de altura, una roca tapa la luz sin
tratarla aparte: es el mismo cálculo que hace que una loma se dé sombra a sí
misma. Y el sustrato usa **la misma** función para oscurecerse.

El efecto es el que importa: **la mancha de musgo tiene la forma de la sombra**,
y la tierra oscurecida también. Tres cosas que antes eran aproximaciones
distintas ahora coinciden en el sitio, y esa coincidencia es lo que se lee sin
explicación.

### La roca estaba donde su sombra no servía

Medio metida en el charco, su sombra caía sobre el agua. El primer eslabón
—«tapa la luz que llegaba a la ladera»— no tenía ladera donde caer, y sin él la
cadena empieza con un hueco. Ahora está en ladera abierta con suelo seco por
donde cae la sombra, y cerca del charco, que es lo que sostiene el tercero.

También era demasiado pequeña. Con la luz a unos 38°, una roca de 0,60 proyecta
0,75 de sombra: del tamaño de la propia roca, o sea invisible como
consecuencia. A 0,96 la sombra pasa del metro. Probé 1,25 y era peor por el
otro lado: la roca dominaba el panel y tapaba lo que había antes, con lo que el
«antes» dejaba de poder compararse con el «después».

### La roca y su sombra se fundían en una sola mancha

Tres vueltas hicieron falta aquí, y las tres las tuve que medir porque el ojo
me engañaba en las dos direcciones.

Primero salía blanquecina. Medido: su difuso valía **lo mismo** que el del
sustrato, con el mismo albedo; la diferencia era sólo la luz, porque un domo
convexo mira a la clave y casi no tiene oclusión mientras la tierra de
alrededor está en sombra o de canto. Correcto físicamente, y aun así se leía
como tiza, porque era una forma grande, clara y lisa.

Bajarle el albedo la volvió una mancha oscura indistinguible de su propia
sombra, que es el error contrario y peor: mataba el segundo eslabón.

Lo que funciona no es el tono medio sino **la estructura interna**: banda
mineral, agua que escurre desde la cima y oscurece por donde cae, y la corona
más clara que la base —que además es verdad, una piedra en una orilla está
mojada abajo y se seca hacia arriba—. Corona iluminada contra suelo oscuro:
así la roca se separa de su sombra y las dos se leen.

### El musgo nuevo no destacaba del suelo

Medido, el musgo joven salía **más oscuro** que el sustrato. Cambiaba el color
y no la claridad, y a esa escala el ojo lee antes la claridad. Sube de tono: el
musgo recién prendido de verdad es amarillo verdoso y más claro que la
hojarasca de al lado.

### El encuadre

Ceñido a donde pasa el cambio. Con el encuadre ancho los dos paneles estaban
dominados por lo que no cambia —las colgantes, el helecho grande, el charco— y
la diferencia quedaba en una esquina.

### Lo que dicen los números ahora

| | R2 | R3 |
| --- | --- | --- |
| Musgo con roca vs sin roca, en el encuadre que se enseña | +13 % | **+279 %** |
| Parte del panel que cambia | — | **16 %** |
| Parte de ese cambio que cae donde está la roca y su sombra | — | **84 %** |

El segundo y el tercero son la medida nueva, y el tercero es el que de verdad
dice algo: un cambio grande repartido por todo el panel no se lee como
consecuencia de nada; concentrado donde cae la sombra, sí. Aun así **sigue sin
medir si se entiende de un vistazo**, que es juicio y por eso vuelve a
revisión.

## Lo que sigue corto, dicho sin adornos

Los tres de la R1 y los seis de la R2 están hechos. Lo que veo flojo ahora:

1. **La pared del fondo** es la superficie continua más grande de la lámina y
   se resuelve con textura y bruma. Funciona porque está lejos y tapada, pero
   si el encuadre cambiara quedaría al descubierto.
2. **El agua no se mueve.** Tiene destellos y absorción, y con eso se lee como
   agua quieta. En lámina fija no hay más que hacer, pero conviene no olvidar
   que el concepto describe una ondulación muy leve.
3. **La condensación del cristal** casi no se percibe. O sube un poco o sobra.
4. **El render tarda casi media hora por lámina de escritorio.** La sombra
   geométrica la usan tres pasadas —sustrato, musgo establecido y musgo
   joven— y cada una la recalcula entera. Cachearla por lámina sería una
   ganancia grande y no cambiaría ni un píxel. No lo he hecho porque tocaba
   entregar, no optimizar.

Ninguna es problema del motor.

## Reproducibilidad

El `.webp` de disco y el incrustado en el SVG son los mismos bytes: una sola
codificación. Antes el suelto iba a 92 y el incrustado a 76, y entonces rehacer
la capa vectorial desde el `.webp` metía una generación más de compresión y la
lámina salía parecida pero no idéntica. `scripts/r62_p02_overlay.py` rehace
sólo el chrome sin volver a rasterizar —veinte minutos por lámina— y ahora da
exactamente lo mismo que el render completo.

## Revisión humana

`R62_P02_TERRARIO_E4_READY_FOR_ASTRA`. Ninguna medida sustituye la revisión, y
en particular las tres pendientes de arriba son juicio, no umbral.
