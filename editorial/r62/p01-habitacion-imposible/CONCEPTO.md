# R62 · P01 · Habitación imposible · concepto R2

**Estado:** `R62_P01_HABITACION_CONCEPT_R2_READY_FOR_ASTRA`
**Mecánica:** aprobada en R1 (`R62_P01_MECHANIC_PASS`), conservada sin cambios.
**Fecha:** 28/09/2026

Láminas: `gameplay.svg` (principal) y `cambio-de-suelo.svg` (segundo estado).
Capturas a 1440 y 390 en `capturas/`. Generador: `scripts/r62_p01_concepto.py`.

---

## Qué cambió respecto a R1

| # de la revisión | R1 | R2 |
| --- | --- | --- |
| 1 · mostrar la mecánica central | las dos láminas tenían la misma orientación; la segunda enseñaba selección del plinto | lámina 2 es un díptico Estado A / Estado B con la gravedad cambiada de verdad |
| 2 · dirección artística | maqueta isométrica plana | sala cúbica, grano de piedra, velo atmosférico, viñeta, oclusión de contacto, luz de rebote fría, haz por el vano alto |
| 3 · entrada → recorrido → salida | losetas sueltas sin relación legible | vanos rotulados ENTRADA y SALIDA, eje de latón continuo que **toca** los dos vanos, y cota «2,4» sobre el salto que bloquea |
| 4 · selector de suelo | cuatro rombos que parecían un D-pad | cuatro miniaturas del propio cubo, cada una con su cara-suelo sombreada y un chevrón de gravedad debajo |
| 5 · controles de flechas | glifos `↑ ↓ ← →` que salían como cuadrados vacíos | teclas dibujadas en vector, más la palabra «Flechas» |
| 6 · segundo estado dedicado a lo diferencial | gastado en seleccionar el plinto | dedicado entero al cambio de suelo; la selección de pieza pasa a la lámina de construcción, fuera de este entregable |

**Un cambio estructural que no estaba pedido y que resuelve varios puntos a la
vez: la sala es ahora un cubo.** En R1 era una habitación de proporción
arbitraria, y «cualquiera de sus caras puede ser el suelo» había que creérselo.
Con un cubo la regla se ve sola, y además permite que el selector sea una
miniatura de la propia sala en lugar de un mando abstracto.

**Y los cuatro suelos son rotaciones reales, no dibujos distintos.** El
generador define las piezas y los vanos una sola vez en coordenadas de la sala
y les aplica una de cuatro rotaciones propias:

```
d0  identidad                   la cara z=0 hace de suelo
d1  (x,y,z) → (S−z, y, x)       la cara x=0 hace de suelo
d2  (x,y,z) → (x, z, S−y)       la cara y=S hace de suelo
d3  (x,y,z) → (S−x, y, S−z)     la cara z=S hace de suelo
```

Las cuatro tienen determinante +1, así que la sala nunca se espeja. Esto
importa para la revisión: el Estado B **no puede mentir**. Es el Estado A con
otra gravedad, calculado, no ilustrado. Si una pieza queda en un sitio raro, es
que quedaría ahí en el juego.

---

## La mecánica (sin cambios respecto a R1)

La sala es un cubo y cualquiera de sus caras puede hacer de suelo. Elegir otra
cara reorienta la gravedad: las piezas no se mueven ni un milímetro respecto a
la sala, pero lo que era una repisa alta pasa a ser un escalón a ras, una
columna que se alzaba pasa a ser una viga que sobresale de la pared, y un vano
inalcanzable queda a la altura del pie.

A eso se suma recolocar y girar las piezas. El objetivo es que exista un camino
continuo entre las dos aperturas. Casi siempre hay más de una solución. No hay
cronómetro, ni puntuación, ni fallo.

**Bucle:** `observar → mover una pieza o cambiar el suelo → la sala se reordena
y el camino se recalcula a la vista → descubrir que dos cosas que no se tocaban
ahora se tocan → seguir hasta unir las dos aperturas`.

### Qué cuenta la lámina 2

**Estado A.** Entras por el arco, el recorrido corre pegado a dos paredes y
muere al pie del muro de la salida. La cota dice por qué: el vano está 2,4 por
encima, y ninguna pieza colocada así llega.

**Estado B.** Tecla 3. La cara del fondo pasa a ser el suelo. La columna que se
alzaba es ahora una viga que cruza en alto; la escalera es un voladizo; la
repisa fría es un tabique. Y la salida —la misma, no otra— queda a la altura
del pie. El recorrido se rehace por el suelo nuevo y llega.

Nada se ha movido. Sólo ha cambiado qué es «abajo».

---

## Materiales, luz y acabado

Caliza cálida para la arquitectura, caliza clara para las piezas ligeras,
piedra terrosa oscura para las que se manipulan, piedra fría azulada con eje de
latón para el recorrido. Todo sobre un vacío oscuro, para que la sala sea un
objeto iluminado y no una ficha sobre papel.

Una sola luz rasante desde arriba a la izquierda. Sombras proyectadas, también
bajo las piezas que quedan en el aire —que es lo que permite leer su altura—,
oclusión de contacto contra el suelo y en el encuentro de los muros, filo claro
en las aristas que miran a la luz, luz fría de rebote en las que le dan la
espalda, grano de piedra por turbulencia y viñeta.

## Accesibilidad del concepto

Sin cambios respecto a R1, que pasó: teclado completo con `Flechas`, `R`, `1–4`
y `Tab`; arrastre nunca como único camino (seleccionar→destino cubre todo);
objetivos de 44 px y 56 px en modo de controles grandes; `prefers-reduced-motion`
**y** `data-ig-motion="off"`, las dos señales; ningún estado que dependa sólo
del color —el recorrido se distingue por material y por la ranura, la pieza
seleccionada por marco y tiradores, el suelo activo por la cara sombreada del
cubo y su chevrón—; sin flashes; sin pulsación rápida obligatoria.

**Nota de producto que sale de la captura a 390:** el díptico lado a lado es un
formato de revisión, no de producto. En la herramienta, a 320–390 px los dos
estados se ven de uno en uno con el selector debajo, nunca en paralelo.

## Etapas

La etapa cambia la sala de partida, no el aspecto. Infancia arranca con tres
piezas, dos suelos posibles y el recorrido ya iniciado; adolescencia y adultez,
con cinco piezas y los cuatro suelos. Misma paleta, misma arquitectura, mismo
acabado. Sin mascotas, sin ojos, sin infantilizar.

## Riesgo de similitud con IP externa

- **La mecánica es otra.** No se usa la coincidencia de bordes en la proyección
  2D, que es el núcleo de la IP más reconocible del género.
- **Sin personaje.** No hay figura que caminar: ni silueta, ni cámara que la
  siga, ni lenguaje de animación que pueda parecerse.
- **Sin arquitectura firmada.** Un cubo con dos vanos; nada de escaleras
  entrelazadas ni bucles calcados de obra concreta.
- **Selector resuelto.** El rombo de cuatro posiciones que en R1 podía leerse
  como D-pad ha desaparecido; ahora es la propia sala en miniatura.

## Criterio de PASS visual

A 1440 y a 390:

1. Se distinguen las cuatro familias de material a simple vista.
2. Todo volumen tiene sombra, también el que está en el aire.
3. El recorrido se lee sin depender del color, también en `forced-colors`.
4. El cambio de suelo se entiende sin leer el pie de foto.
5. Ningún elemento puede confundirse con obra de terceros.

**Lo que sigue sin cumplirse, y lo digo yo antes de que se descubra
construyendo:** la piedra tiene grano pero no veta ni desgaste, y el haz de luz
es una insinuación, no una atmósfera. Los puntos 1 a 5 los cumple; el listón de
«calidad visual magnífica» del §3 pide además una capa de ilustración —texturas
propias, imperfección, materia— que no sale de geometría calculada en SVG.

Mi recomendación sigue siendo la misma, ahora con la mecánica ya demostrada:
aprobar la lámina como **referencia de composición, mecánica y lenguaje
visual**, y encargar la capa de textura como entregable aparte antes de soltar
a Codex, para que construya contra algo que sí da el listón.
