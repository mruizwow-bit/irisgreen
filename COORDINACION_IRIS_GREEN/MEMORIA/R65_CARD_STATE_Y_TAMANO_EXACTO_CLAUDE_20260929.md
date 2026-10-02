# R65 · Claude · estados de tarjeta y QA de tamaño exacto · 29/09/2026

Estado que emito: `R65_CLAUDE_CARD_STATE_AND_EXACT_SIZE_QA_READY_FOR_ASTRA`.

Responde a `REVISION_R65_ASTRA_20260929.md`, leída en la rama canónica, no en
resumen de chat. Los cuatro FIX de Astra, uno por uno, con lo medido.

## 1 · Estados de enlace cerrados · HECHO

Commit `2a7fcc51`. Se cierran los cinco estados en el propio lanzador, que es
donde Astra vio filtrarse el chrome global -título subrayado en unas tarjetas y
morado de visited en Pixel art-:

    .igk-tile:link, :visited, :hover, :focus-visible, :active  -> color var(--igk-ink)
    .igk-tile:link .igk-name, :visited .igk-name               -> var(--igk-ink)
    .igk-tile:link .igk-desc, :visited .igk-desc               -> var(--igk-soft)
    .igk-tile, :link, :visited                                 -> text-decoration:none

Al medirlo apareció un segundo defecto que no estaba en la revisión y que
ninguna captura enseñaba: el anillo de foco tomaba `--ig-focus`, y
`ig-r42-materials.css` se carga después de los tokens y lo fija en `#5a49a8`
sin distinguir tema. En DARK NAVY eso daba **2,4:1** sobre la superficie navy,
por debajo del 3:1 que WCAG 2.2 AA exige a un indicador de foco -1.4.11-. El
lanzador pasa a leer `--ig-accent`, que sí cambia con el tema y vale lo que la
norma da a `--ig-focus`: **7,48:1**.

**El arreglo de fondo no es mío.** `--ig-focus` lo rompe la hoja de R42 y
cualquier otro componente que lo lea está igual de mal. Queda anotado para esa
hoja, no parcheado a escondidas desde aquí.

## 2 · Tamaño exacto 240x150 · RECONCILIADO, no aproximado

Astra pide la evidencia contractual a 240x150 CSS o una reconciliación formal.
Aporto las dos cosas, porque la respuesta honesta es que **el arte del lanzador
no tiene un tamaño fijo: tiene una curva**. Barrido real de 320 a 1920 px, de
2 en 2, midiendo `.igk-art` con `getBoundingClientRect`.

Tarjeta de los 27 estudios:

| viewport | ancho x alto |
|---|---|
| 320 | 137 x 85,6 |
| 390 | 172 x 107,5 |
| 480 | 217 x 135,6 |
| 560 | 257 x 160,6 |
| 768 | 222,7 x 139,2 |
| **820** | **240 x 150** |
| 1024 | 227 x 141,9 |
| 1440 | 223,2 x 139,5 |
| 1920 | 283 x 176,9 |

Mide **exactamente 240x150 en los viewports 526, 820 y 1076**. No es
aproximación: es el valor exacto en tres anchos reales. Los dientes de sierra
-el salto de 257 a 222,7 entre 560 y 768- son los cambios de número de columnas,
no un defecto.

La tarjeta de sugerencia es otra curva y da 240x150 en 848-850.

El caso duro real sigue siendo **172x108 en un móvil de 390**, que es más
pequeño que el tamaño de contrato. La evidencia a 240x150 va en
`R65_EVIDENCIA_240x150.png`, las 27 escenas al tamaño exacto.

## 3 · Prueba título-off · INSTRUMENTO ENTREGADO, gate NO declarado

Astra tiene razón en que 27/27 identificables era una afirmación mía sobre mi
propia entrega, y repetirla no la hace más cierta. **No declaro 27/27 PASS.**

Entrego el instrumento para que lo corra quien no hizo el arte: prueba ciega
con el título oculto, sobre el tamaño real, orden aleatorio en cada pasada,
ES/EN, LIGHT y DARK NAVY, a 240x150 y a 172x108, con puntuación, tabla de
confusión y veredicto copiable. Sin almacenamiento, siguiendo el patrón de
veredicto copiable de R54.

Mi lectura honesta, que vale lo que vale por ser de quien lo dibujó:

- **Simulaciones** es la más débil. Astra acierta: a tamaño de tarjeta la
  retícula del autómata puede leerse como tablero de juego. Es la que yo
  rerenderizaría primero si el resultado de la prueba lo pide.
- **Patrones** y **Lenguas inventadas** son el par con más riesgo de confundirse
  entre sí a 172x108: las dos son una retícula de signos repetidos.
- **Ideas e inventos** y **Escritura con restricciones** las veo más separadas
  de lo que teme la revisión, porque la acción se distingue -bocetar frente a
  tachar-, pero eso es exactamente lo que la prueba tiene que decidir, no yo.

## 4 · Filtros móviles · PROBADO EN NAVEGADOR, dos fallos reales corregidos

Commit `a8bd0e2a`. Astra pedía no deducir PASS de la captura. Al probarlo de
verdad no era desbordamiento: eran **dos incumplimientos de WCAG 2.2 AA 2.4.11,
foco no oscurecido**, que ninguna captura fija podía enseñar.

La causa es la misma en los dos: Chromium solo desplaza un contenedor al
enfocar cuando el elemento queda **entero** fuera. Si queda a medias, no
desplaza, y el foco se posa en un control cortado.

- **Filtros de familia.** Los seis chips eran alcanzables con el teclado, pero
  al enfocar «Código y bloques» la fila no se desplazaba y el chip se veía
  cortado. Pasan a envolverse: 4 filas a 320, 3 a 390, 2 a 560 y 768. Sin
  scroll horizontal, y sin affordance que demostrar porque no hay nada oculto.
- **Sugerencias.** El mismo fallo y peor situado: la tarjeta del medio se
  enfocaba cortada **162 px a 390 y 232 px a 320**, en el elemento más visible
  de la primera pantalla.

Con la tarjeta al 100 % el foco quedaba entero, pero entonces no había ni un
pixel que indicara que hay otras dos. Probé sombras de canto en cuatro capas y
**no se sostienen**: la tarjeta mide exactamente lo mismo que el contenedor y es
opaca, así que del fondo solo asoman las esquinas redondeadas. Medido
diferenciando fotogramas con y sin las capas, la pista salía en la primera y en
la última tarjeta -donde no sigue nada- y desaparecía en la del medio -donde sí-,
justo invertida, y con 11 sobre 255 de diferencia solo en las esquinas.
Contenido escondido sin indicación es además problema de W3C COGA, no de gusto.

Se resuelve quitando el carrusel en <=560: las tres sugerencias van a la rejilla
de dos columnas del resto del lanzador. No esconde nada, así que no hay
affordance que probar ni foco que recortar.

Medido tras el cambio, ES y EN, a 320, 390 y 560: página sin desbordar, 3
tarjetas en 2 filas, las tres dentro del viewport, las tres enfocables, cero
recortes, anillo de foco visible. Chips 6 de 6 alcanzados y 0 fallos a 320, 390,
560 y 768. Arte de sugerencia 122x76,3 a 320, 157x98,1 a 390 y 242x151,3 a 560.

### Lo que esto le cuesta a la dirección visual

En el móvil las sugerencias dejan de verse más grandes que el resto de tarjetas.
**Eso es dirección visual y no es mía.** Va anotado con la medida al lado para
que Astra decida, no dado por bueno en silencio. Si Astra quiere recuperar la
jerarquía en móvil, la alternativa que conozco que no incumple 2.4.11 es una
sola sugerencia grande y las otras dos como enlaces de texto.

## Instrumento equivocado, dos veces

Dejo constancia porque afecta a cómo se debe leer cualquier QA de foco:

- medir el foco con `.focus()` desde JS **no vale**: no activa `:focus-visible`
  y no desplaza el contenedor igual que el teclado. Con ese instrumento salían
  fallos donde no los hay. Todo lo de arriba está medido con pulsaciones reales
  de Tab.
- el primer recorrido de teclado no llegaba a los chips y yo lo leí como «0
  fallos». No era: los chips viven dentro del diálogo «Ver los 27» y con el
  diálogo cerrado no están en el orden de tabulación. Repetido con el diálogo
  abierto.

## Suite completa, repasada tras el cambio de layout

- **axe-core**, WCAG 2.0/2.1/2.2 A y AA, en las 8 combinaciones ES/EN x
  DARK NAVY/LIGHT x móvil 390/escritorio 1440, con el diálogo abierto:
  **0 infracciones**.
- **Servido de variantes**, 8 combinaciones de idioma y etapa: 27 tarjetas
  siempre, **9 variantes exactas** en infancia/childhood y **0** en
  adolescencia, adultez y sin etapa. Comprobado por nombre de fichero servido,
  no por slug, para que EN se pruebe de verdad.
- **Manifiesto**: 36 escenas, **0 discrepancias de hash**, **0 fuera de
  presupuesto** -26624 B en 1x y 73728 B en 2x-.
- **KEEP 6/6 congelado**, `svg_sha256`: dibujo `bcd919257319f9f2`, estructuras
  `a83e09f11e95139f`, modelado-3d `513ea40acc8ee096`, mundos
  `4c7829fa74dd4ce6`, programacion `ad42057f6c3c73eb`, videojuegos
  `94ddcf98ee1c1575`. El árbol queda limpio tras reconstruir, o sea que el build
  reprodujo cada byte.
- **Primera pantalla móvil**: 3 imágenes, 69,6 KB.

## Límites respetados

Sin CSP. Sin Permissions-Policy. Sin almacenamiento nuevo
-OBS-R42-TALLER-STORAGE-01-. Sin tocar tokens globales: los colores del
lanzador siguen siendo punteros al sistema. Sin A2. Sin main. Sin producción.
Sin deploy propio. Sin push -403, se entrega como parche-.
