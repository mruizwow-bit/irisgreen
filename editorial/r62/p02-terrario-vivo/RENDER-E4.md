# P02 · Terrario vivo · rework visual E4

**Estado:** `R62_P02_TERRARIO_E4_READY_FOR_ASTRA`
**Fecha:** 28/09/2026
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

| Pregunta de la referencia | Medida | P02 | Listón |
| --- | --- | --- | --- |
| ¿La sombra tiene penumbra? | parte de la sombra en valores intermedios | **75 %** | ≥ 30 % |
| ¿La imperfección es desigual? | desviación gruesa ÷ fina del albedo | **1,37** | ≥ 0,45 |
| ¿Alguna superficie grande plana? | mayor región contigua de varianza baja | **4,1 %** | ≤ 12 % · P01 da 2,0 % |
| ¿Hay segunda fuente? | escena alcanzada por el derrame del charco | **59 %** | ≥ 4 % |
| A 390, ¿composición propia? | ventana y rango de cota distintos | sí | distintos |
| ¿Se ve la consecuencia? | musgo con roca vs sin roca, mismo encuadre | **+42 %** | ≥ +15 % |

Dos avisos sobre cómo está medida la tercera, porque las dos formas obvias de
medirla dan números falsos. Sobre el **albedo** da 64 %, y es mentira: la
tierra tiene poco contraste de color y todo su relieve se lo da la luz, que en
el albedo todavía no está. Sobre la **imagen entera sin máscara** P01 da 71 %,
porque su vacío oscuro es liso de verdad; un fondo no es una superficie que
represente materia. Se mide sobre la imagen compuesta y dentro de la escena.

**Lo que el test no mide, y por eso no declara:** si parece un terrario y no
una ficha; si tierra, roca, madera, musgo, hoja y agua se reconocen como
materiales distintos; si algo recuerda a obra de terceros. Es el §14 del
concepto y necesita ojos.

## Pesos

| | WebP suelto | SVG autocontenido |
| --- | --- | --- |
| Escritorio 1180×900 | 287 KB | **257 KB** |
| Móvil 390×730 | 61 KB | **61 KB** |
| Causalidad (dos paneles) | — | **151 KB** |

El raster incrustado va a calidad 76 y no a 90 como en P01. P02 tiene mucho más
detalle de alta frecuencia —follaje, grano, musgo—, y a 90 la lámina de
escritorio se iba a 638 KB. Comparadas a 1440 no se distingue cuál es cuál.

## Lo que sigue corto, dicho sin adornos

No declaro esto a la altura de P01. Tres cosas concretas:

1. **La sección frontal** ocupa la franja baja y se resuelve con poca cosa. La
   medida de superficie plana la deja pasar —4,1 % frente al 12 % del listón—,
   y aun así mirándola creo que es la zona más floja de la lámina. Las dos
   cosas pueden ser verdad a la vez, y es exactamente por eso que la revisión
   humana no la sustituye ningún número. Lo honesto sería darle raíces, grava
   visible y un gradiente propio, o bajar el suelo del vaso para que ocupe
   menos.
2. **El follaje** ya no es papel, pero repite pocas siluetas. Hacen falta dos o
   tres especies más con hoja de otra forma, no sólo de otro tono.
3. **La vegetación colgante** se lee como cadenas contra la pared. Debería
   ramificarse y cruzarse por delante de la escena, no sólo caer.

Ninguna de las tres es un problema del motor: son horas de escena.

## Revisión humana

`R62_P02_TERRARIO_E4_READY_FOR_ASTRA`. Ninguna medida sustituye la revisión, y
en particular las tres pendientes de arriba son juicio, no umbral.
