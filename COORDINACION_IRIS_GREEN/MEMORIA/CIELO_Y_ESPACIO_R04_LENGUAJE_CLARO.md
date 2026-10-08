# CIELO Y ESPACIO · LENGUAJE CLARO · ISO 24495-1

Fecha: 08/10/2026 · cuarta vuelta (R04.5)

## Alcance

**Todo el texto visible del producto, en español y en inglés.** En la vuelta
anterior el alcance era sólo «texto visible de primera pantalla»: eso ya no
basta y queda sustituido por este documento.

El alcance se comprueba sobre pantalla, no sobre el código: `pruebas/r04_idiomas.js`
abre **catorce pantallas en los dos idiomas** —portada, cielo, cuaderno,
describir, fuentes, examinar, capa, y las siete caras de la ficha— y mide el
texto que de verdad se ve, incluidos `aria-label`, `title` y `alt`.

## Qué se mide, y qué no

La norma es de principios: no dice «25 palabras». Lo que el banco mide son
**indicadores declarados**, no la norma:

| indicador | criterio | estado |
|---|---|---|
| frases largas | ninguna frase visible pasa de 25 palabras | 0 |
| énfasis a gritos | ninguna mayúscula sostenida que no sea sigla ni nombre de archivo | 0 |
| jerga sin explicar | 10 términos declarados (ZHR, ascensión recta, declinación, magnitud aparente, WebGL, renderizador, UV, LOD…) sólo pueden salir en una pantalla que los explique | 0 |

**Lo que la norma pide y esto NO comprueba:** que el texto sirva al propósito de
quien lee, que el orden de la información sea el útil, y que las palabras sean
las que esa persona usaría. Eso es juicio humano y sigue abierto. Este documento
no declara conformidad con ISO 24495-1: declara qué indicadores se miden y con
qué resultado.

## Regla

Sujeto + verbo concreto + objeto concreto. Los números y los términos técnicos
no desaparecen: pasan a la ficha, a `documentacion/PROCEDENCIA.md` o a la
evidencia técnica.

## Cambios de la primera vuelta (se mantienen)

| antes | después | a dónde fue el dato |
|---|---|---|
| «Mirando hacia ascensión recta 8.10 h, declinación −2°. La zona de examen abarca 12° de diámetro.» | «Estás mirando esta parte del cielo.» | ficha → «Datos de esta vista» |
| «Mirando el sistema desde …° sobre el plano, girado …°. Acercamiento ×…» | «Estás mirando el Sistema Solar.» | ficha del cuerpo |
| «Rodeando Júpiter desde 17° sobre su ecuador, girado 350°…» | «Estás dando la vuelta a Júpiter. Ahora ves esta cara.» | ficha del cuerpo |
| «Los cuerpos son geometría 3D: una malla de hasta … triángulos…» | no se muestra el renderizador | `LIMITES_REALES.md`, `MEDIDAS_R04.json` |
| «Este navegador no da WebGL, y los cuerpos del Sistema Solar necesitan geometría 3D de verdad…» | «Este navegador no puede mostrar los planetas en 3D. El resto del producto sigue disponible.» | — |

Si el equipo dibuja por software: «Este ordenador dibuja los planetas sin
tarjeta gráfica. Se ven con los bordes menos finos.»

## Cambios de esta vuelta

| antes | después | a dónde fue el dato |
|---|---|---|
| «ecuatorial diestra: x hacia AR 0 h en el ecuador, y hacia AR 6 h, z hacia el polo norte celeste. El observador mira desde DENTRO de la esfera…» | «Miras la esfera desde dentro, como se mira el cielo de verdad. Las coordenadas del catálogo avanzan hacia la izquierda.» | `PROCEDENCIA.md` §8, íntegro |
| «Representación direccional: … El radio gráfico es común y no significa que estén a la misma distancia física…» | «Todas las estrellas se dibujan sobre una misma esfera. El radio es el mismo para todas, así que no dice a qué distancia está cada una.» | `PROCEDENCIA.md` §8, íntegro |
| «rasgos que se pueden ver sin líneas ni instrumento: cuántas estrellas claras hay, si una destaca…» (33 palabras) | «Esta descripción sale de lo que se puede ver sin líneas ni instrumentos.» | `PROCEDENCIA.md` §8, íntegro; y sigue en cada ficha |
| «Hacen falta las TRES, visibles y con esa relación.» | «Tienen que verse las tres, y en esa misma relación.» | — |
| «Dato del catálogo entregado. No es una predicción para una fecha, hora o lugar concretos.» | «Es un dato del catálogo. No es una predicción para una fecha, una hora ni un lugar concretos.» | — |

## Equivalentes en inglés

Todo lo anterior existe en inglés y se comprueba en pantalla. Las frases nuevas:

- «You are looking at this part of the sky.»
- «You are looking at the Solar System.»
- «You are moving around [body]. You can see this side now.»
- «This computer draws the planets without a graphics card. Their edges may look less smooth.»
- «This browser cannot show the planets in 3D. The rest of the product is still available.»
- «You look at the sphere from inside, the way you look at the real sky.»
- «All the stars are drawn on one sphere. The radius is the same for every star, so it does not tell you how far away each one is.»
- «This description comes from what you can see without lines or instruments.»

## Lo que esta vuelta arregló además del lenguaje

Medir el inglés en pantalla destapó que **el producto no estaba del todo en
inglés**: siete sitios pintaban datos del catálogo en español. Está contado en
la cabecera de `pruebas/r04_idiomas.js` y en la nota de registro.
