# R04 · resultados del autor

Base: `CIELO_Y_ESPACIO_R03_1.zip` · SHA256
`ca6dd1527e36782b66466f730a62d7682d3186a9325626f94a6df6f52adc28bd`.

**Todo lo de aquí se ha ejecutado en este entorno.** La versión anterior de este
documento decía que el navegador no se había podido arrancar y que los scripts
de navegador, GPU y memoria «viajaban en el paquete para el retest». Ya no hace
falta: se han ejecutado, y lo que encontraron está abajo, incluido lo que
estaba mal.

## Lo ejecutado

| Banco | Resultado |
|---|---|
| `unitarias.js` (heredado de R03.1) | **23 · 0 fallos** |
| `r04_unitarias.js` (datos de R04) | **7 · 0 fallos** |
| `r04_estaticas.js` (las piezas en su sitio) | **32 · 0 fallos** |
| `r04_accesibilidad.js` (reflujo 400 %, texto 200 %, movimiento) | **2 · 0 fallos** |
| `r04_idiomas.js` (los dos idiomas en pantalla + ISO 24495-1) | **6 · 0 fallos** |
| `r04_integracion.js` (tema del sitio y rastro de error) | **4 · 0 fallos** |
| `navegador.js` (el producto entero) | **17 · 0 fallos** |
| `oraculos-3d.js` (cuerpos 3D reales) | **9 · 0 fallos** |
| `r04_cierres.js` (los ocho de HUMAN QA + la comprobación táctil) | **9 · 0 fallos** |
| `r04_cuerpos.js` (achatamiento, sombras, fase) | **3 · 0 fallos** |
| **Total** | **112 · 0 fallos** |

Corrido entero desde una copia limpia, y comprobado después: **los 417 archivos
siguen byte a byte iguales**. Ejecutar las pruebas no toca el paquete.

Serie larga: `SERIE_10MIN=1 node pruebas/medidas.js` → 121 muestras en 10
minutos con el cielo repintando sin parar, **y con el instrumento comprobado
antes**. El heap va de **6,37 MB a 6,34 MB** tras **34.374 cuadros**, oscilando
entre 5,4 y 9,4 en 82 valores distintos: el diente de sierra del recolector. La
serie entera está en `documentacion/MEDIDAS_HEAP_10MIN.json`. Eso dice que la
memoria no crece sola; no es un perfil de fugas y no dice nada de la memoria de
la GPU.

## Rendimiento · tres pasadas en una máquina

Tres pasadas por ancho, y se publican todas, sin promediar. Milisegundos **entre cuadros
entregados**, medidos con `requestAnimationFrame` tras descartar 12 cuadros de
calentamiento.

**Son una muestra de tres pasadas en una máquina, no el rango de la medida.**
Dicen cuánto ruido hay aquí y nada sobre otra máquina: al revisar esta entrega,
el banco de sombras dio en otro equipo cifras fuera de las de aquí. Lo que
cambia entre máquinas es mayor que lo que cambia entre pasadas.

| ancho | cielo (CPU/cuadro) | Sistema Solar | rodeando a Saturno |
|---|---|---|---|
| 320×568 | 1.08 · 1.11 · 1.05 | 16.66 · 16.67 · 16.94 | 24.72 · 23.33 · 23.61 |
| 390×844 | 1.04 · 0.97 · 1.05 | 17.5 · 16.67 · 17.22 | 34.72 · 34.44 · 34.72 |
| 1440×900 | 1.6 · 1.57 · 1.66 | 30.83 · 31.39 · 32.5 | 66.39 · 68.61 · 68.88 |

Dibuja **ANGLE sobre SwiftShader**, por software: no hay tarjeta y **no se
declara ninguna cifra de GPU**. El camino de `EXT_disjoint_timer_query_webgl2`
viaja en el paquete y se activará donde haya tarjeta.

## Lo de esta vuelta · bilingüe de verdad, lenguaje claro y las dos piezas del sitio

24. **El producto no estaba del todo en inglés, y ninguna prueba lo veía.**
    Siete sitios pintaban datos del catálogo en español: los cuatro códigos de
    visibilidad de las 88 fichas («entera», «parte», «no», «siempre»), su nota,
    las siete citas de Fuentes, la nota de figura de Orión y de Tauro, las dos
    notas de la capa de lluvias, los nueve créditos de las texturas del Sistema
    Solar y dos cuerpos de origen («1566 Ícaro», «3200 Faetón»). Y al revés: el
    significado del nombre sólo salía en español, porque `significado_en` no
    existía en ninguna de las 88. Ahora existe en las 88 y coincide entre ficha
    y catálogo.

25. **Y al escribir el banco aparecieron dos más.** La primera versión medía
    sólo el resumen de la ficha y pasaba en verde. Al abrir las siete caras
    salieron la caja de Fuentes de fuera, que pintaba las citas y la nota del
    cielo en crudo, y la descripción «cómo reconocerlo», que enseñaba su
    derivación en español en las dos versiones. **Un oráculo que no llega donde
    está el problema pasa en verde igual que uno que no existe.**

26. **ISO 24495-1 ya no es «la primera pantalla».** Es todo el texto visible,
    en los dos idiomas, y se comprueban tres indicadores contables: ninguna
    frase de más de 25 palabras, ninguna mayúscula de énfasis, y los diez
    términos técnicos declarados sólo donde se explican. Los tres a cero. Lo
    técnico que se quitó de pantalla —la convención de ejes, la representación
    direccional y la derivación de las descripciones— está íntegro en
    `PROCEDENCIA.md` §8. No se ha borrado ni un dato.

27. **`data-ig-theme`, contra el repo de verdad.** El marco sigue el tema del
    sitio; el cielo no, y la tira de mandos tampoco. Esto último costó una
    captura: la primera versión dejó el rótulo «Orientar y acercar» gris oscuro
    sobre casi negro en tema claro. **Lo vi mirando, no midiendo**, así que
    ahora hay un `G4` que lo mide.

28. **`__IG_SCENE_ERROR__` existe, y me corrijo sobre él.** En la vuelta
    anterior escribí que «el contrato del sitio lo espera». **No es cierto**:
    ese nombre no aparece ni una vez en el repo. Salió del texto de la orden.
    Queda como convención que propone el paquete, dicho así en el propio
    archivo, en el banco y en la documentación.

29. **`node --check` volvió a mentir.** El rastro de error rompió
    `unitarias.js`, que carga `config.js` desde node con `window` a null: la
    comprobación de sintaxis pasaba y el banco no arrancaba. Es la segunda vez
    esta entrega. Se arregla con una guarda, y se apunta.

## Lo que encontró la tercera revisión, y se ha corregido

18. **El panel del Cuaderno se rompía a 320 px con el texto al 200 %.**
    Reproducido aquí con los mismos números: `#panel` con **24 px de barrido
    lateral propio** y `#btn-cerrar-panel` en **53 × 316 px**, saliéndose **7 px**
    de la pantalla —una cinta vertical con una letra por línea, cortada por el
    borde—. Para llegar a él había que bajar **y** arrastrar de lado: scroll en
    dos direcciones, que es lo que prohíbe 1.4.10.

    Y midiendo salió algo que no estaba en el informe: con el texto al 200 %,
    los tres `<select>` de la fila de abajo pedían **368, 485 y 511 px** en una
    pantalla de 320, y se llevaban el documento entero a **535 px**. Ese sí lo
    habría cazado el criterio viejo; no estaba cazado porque nadie medía esa
    pantalla.

    Arreglado: el título del panel cede sitio y el botón de cerrar no se parte;
    los `select` y lo que va en las filas no pueden ser más anchos que su fila.
    Ahora, en las 56 vistas, `#panel.scrollWidth − clientWidth = 0` y ningún
    control se sale del visor.

19. **El criterio de aprobado del oráculo tenía el agujero por el que se coló.**
    `document.scrollWidth <= innerWidth` no ve lo que se traga un
    `overflow:auto`. Ahora se comprueban las tres cosas: documento, contenedores
    con barrido propio y controles fuera del visor.

20. **Se medía una pantalla de siete.** Ahora se miden las siete —portada,
    cielo, cuaderno, describir, fuentes, examinar y capa— en cuatro tamaños de
    ventana por dos tamaños de letra: **56 vistas**.

21. **El 400 % se simulaba con 320×844.** Ahora se mide en **320×256**, que es
    el 400 % de 1280×1024, y la equivalencia va escrita en la salida del banco y
    en el JSON.

22. **El movimiento se medía con un solo mando.** Ahora con tres.

23. **Y arreglar el panel movió el suelo, que rompió otra medida.** Al subir el
    borde del suelo para que no quedara detrás de la tira, el punto donde `C8`
    medía la estrella de abajo —fijado a mano en el 76 % de la altura— cayó
    justo **sobre la silueta del suelo**, donde el fondo se va a negro y el pico
    sobre el fondo salta: la medida dio 89 % cuando el perfil real baja al 60 %.
    No era el producto: la extinción sigue ahí, medida punto a punto da
    126 → 102 → 75 al bajar. Era la sonda, puesta donde ya no hay cielo. Ahora
    el punto de abajo **se calcula** a partir de dónde empieza el suelo y de
    cuánto tapa la tira, en vez de fijarse a ojo, y da 49 %.

### Visto fallar

Un verde que no se ha visto en rojo no vale:

| mutación | resultado |
|---|---|
| revertido el arreglo del panel | **A1 FALLA · exit 1**, y nombra «#panel (24 px)» y «#btn-cerrar-panel (53×316, se sale 7 px)» |
| `REDUCED: 90` → `260` | **A2 FALLA**: la reducción baja al 2,4 % |

Y una mutación que **no mordió**, que también se cuenta: revertir sólo la regla
del encabezado del panel dejó A1 en verde. Medí esa copia aparte y estaba limpia
de verdad —el `max-width` del cuerpo del panel ya bastaba—, así que era una
mutación inválida, no ceguera del oráculo. Queda escrito en la cabecera del
banco, porque una mutación que no muerde se parece mucho a una prueba hueca.

## Lo que encontró la segunda revisión, y se ha corregido

17. **Llamé «rango» a una muestra.** Tres pasadas en una máquina no acotan la
    medida: dicen cuánto ruido hay en esa máquina. Y se comprobó que no la
    acotan — en otro equipo, la mancha mayor de Júpiter salió **15,08–15,22 %**,
    fuera del 13,95–14,45 % que yo había publicado. Y al volver a correrlo aquí
    para esta corrección salió **15.17–15.21 %**: donde salió en el otro equipo y
    fuera de mi propia banda anterior. La muestra de tres pasadas no acotaba ni
    siquiera esta máquina. Las cifras estaban bien medidas; la etiqueta estaba
    mal. Ahora, en sombras y en rendimiento, las pasadas se publican como
    **muestra en una máquina**, con esa frase al lado y con el dato del otro
    equipo escrito.

## Lo que encontró la primera revisión de María, y se ha corregido

11. **Cerrar `WORLD_SCENE_FIRST` dejó los 19 controles por debajo del pliegue**,
    y como el lienzo se queda los gestos (`touch-action: none`), con un dedo no
    se llegaba a ninguno: `scrollY` 0 → 0 tras un arrastre vertical largo.
    Funcionaba con teclado y no en el teléfono, que es donde está la mayoría.
    Ahora hay una **tira** dentro del primer viewport con «Examinar» y los seis
    de orientar, y `C9` lo comprueba con toques de verdad a 320 px. El suelo y
    la extinción se dibujan dentro del cielo visible, no debajo de la tira.
12. **La cifra de sombras del registro no estaba en el paquete**: decía 13 de
    144 instantes y 1,19 %, y la evidencia del propio zip decía 76 y 6,65 %.
    Venía de una ejecución anterior a dos cambios del banco y nunca se
    reconcilió. **Mi error, y del tipo que peor sienta**: un número en el
    documento que va a #323 que su propia evidencia desmiente.
13. **Y el banco de sombras no era estable: 117, 0, 0.** No era física. La
    cámara se colocaba en el lado iluminado **una sola vez**, al empezar el
    barrido; al avanzar la fecha tres días el planeta se iba por su órbita y la
    cámara acababa mirando su noche, donde `n·l` es cero, el sombreador ni entra
    en el bucle de bloqueadores y no hay sombra que medir. Ahora se recoloca en
    cada instante y sale 144 · 144 · 144 en Júpiter y 119 · 118 · 118 en Saturno, de 144 instantes.
14. **El heap de 13,6 MB no medía nada.** Con 42 MB de lastre en el montón,
    `performance.memory` **no se movió**. Se mide con `Runtime.getHeapUsage` por
    CDP, que con ese lastre sube 56,5 MB, y la calibración se publica al lado de
    la serie. Un número que no se mueve en 121 lecturas decía tanto de un
    aparato atascado como de una memoria quieta, y era lo primero.
15. **Ejecutar los bancos machacaba la evidencia entregada.** Ahora escriben en
    `../resultados-<paquete>/`, o donde diga `RESULTADOS=`. Los JSON y las
    capturas del paquete se quedan como están por mucho que se reejecute.
16. **`data-ig-theme` y `__IG_SCENE_ERROR__`** faltaban en la lista de
    integración. Añadidos, con lo que implica cada uno.

## Lo que se encontró al ejecutar la primera vez, y se corrigió entonces

1. **Los dos primeros cierres no estaban cerrados.** El CSS y la documentación
   decían que la escena ocupaba la ventana al abrir, pero al abrir salía la
   portada de texto con cinco contadores. Medido: **0 % de cielo** en el primer
   viewport y **6 textos con cifras**. Ahora se entra directamente al cielo:
   **100 % y 0**. La portada no se ha borrado; está detrás de «Volver a la
   portada».
2. **El botón «Empezar» salía en blanco.** Venía así desde R03.1: un botón
   primario sin una sola letra en mitad de la portada. Era un defecto mío y
   ahora dice «Empezar a explorar», o «Seguir donde lo dejaste» si ya hay
   hallazgos.
3. **La línea de ayuda flotante salía vacía.** Su clave de texto, `ayuda_flota`,
   no existía en `copia.js`, así que el cierre de `WORLD_SCENE_FIRST` se apoyaba
   en una caja sin nada dentro.
4. **La ficha tapaba lo que acabas de encontrar.** Al convertir la barra lateral
   en overlay quedó clavada a la derecha, ignorando el lado que el producto ya
   calculaba. Con el hallazgo a la derecha, la ficha caía encima. Lo detectó
   `N12`, que llevaba desde R02 comprobando justo eso.
5. **Tres oráculos 3D se rompieron con los añadidos de R04**, y los tres eran
   fallos de la *medida*, no del producto: el barrido de `O02` contaba los
   propios bancos; `O04` comprobaba el impacto contra una esfera cuando Júpiter
   ya es un elipsoide; `O06` contaba como dirección un centro de luz tan débil
   que no apunta a ninguna parte. Corregidos los tres oráculos, no el producto.
6. **«Datos de esta vista» estaba escrito a mano en dos archivos** en vez de
   vivir en `copia.js`. Ahora es una clave más, con sus dos idiomas.
7. **El muestreo de diez minutos no estaba donde la orden lo pedía** ni se podía
   ejecutar: era un script suelto que apuntaba a `http://127.0.0.1:8080`, que
   nunca entraba en la escena y que escribía fuera del paquete. Está dentro de
   `pruebas/medidas.js`, entra al cielo y lo mantiene vivo.
8. **El `MANIFEST.json` se había convertido en un índice de archivos** con los
   mismos hashes que `SHA256SUMS.txt`, perdiendo la declaración de la entrega.
   Está reescrito como manifiesto.
9. **Rendimiento mal cronometrado.** La misma escena daba 144 ms en un sitio y
   71 ms en otro. Era la cola del driver en los primeros cuadros: ahora se
   descartan 12 de calentamiento, las dos mediciones coinciden y el script dice
   por qué.
10. **Sombras mutuas más caras de lo necesario.** El sombreador recibía hasta 16
    cuerpos como posibles bloqueadores; ahora sólo entran los que de verdad
    pueden tapar la luz de ese cuerpo. Rodear a Saturno pasó de ~144 ms a ~72 ms
    por cuadro sin cambiar un píxel.

## Conservado de R03.1

`js/cuerpos3d.js` y `js/matriz.js`; la ausencia de `js/esfera3d.js`; los nueve
oráculos 3D y sus JSON; la tabla de los 84 cuerpos; la comparación R03/R03.1 con
su hoja; las capturas y turntables; los límites reales; y el incidente abierto
`UNRESOLVED_FIRST_RUN_FAILURE.md`, que **sigue abierto**: esta entrega no lo
cierra, y la serie de ejecuciones guardadas que pedía su regla aún no existe.

## Lo que no es

No es PASS independiente. No es HUMAN QA. No es prueba en teléfono físico ni con
lector de pantalla real. No hay GPU real medida. **No se emite ningún gate.**
