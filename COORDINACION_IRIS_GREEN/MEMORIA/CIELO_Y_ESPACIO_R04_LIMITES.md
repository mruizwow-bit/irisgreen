# Límites reales de R04

2026-10-07. Lo que esta entrega no puede sostener, dicho antes de que lo
encuentre nadie.

## 1. Dos piezas que la orden daba por hechas y no estaban

### Meteoros · no había tanda canónica

La orden dice «integrar la tanda canónica ya producida». En este entorno **no hay
ni datos ni assets de lluvias de meteoros**: sólo aparece como tarea pendiente de
SENDA en el backlog (`INTEREST_05_METEORS_PRODUCT_CONTENT_REUSE_AND_ASSET_BRIEF_PASS`).

Qué se hizo: construir el bloque con la **lista de trabajo de la IMO**, con su
fuente y su fecha de consulta declaradas, y con su limitación dicha: la web de la
IMO estaba en reconstrucción el día de la consulta, así que los valores vienen de
una compilación y no del PDF original. Está en `datos/meteoros.js`, en el campo
`fuente.limitacion`.

Qué falta: si aparece la tanda aprobada, se sustituyen los datos y los visuales
**sin tocar la experiencia**. El esquema ya está.

### Sistema Solar · los masters first-party de #370 no eran alcanzables

La orden pide integrar los assets first-party aprobados de #370. Viven en una
biblioteca externa (`/Iris Green/First Party Visual/…`) a la que este entorno no
llega. Los handoffs están, los archivos no.

Qué se hizo: usar las **texturas que ya publica irisgreen.eu** —Solar System
Scope, NASA, USGS, Stellarium—, arrastrando su autoría y su licencia al paquete
(`assets/solar/CREDITOS.txt`). Son las mismas que la gente ya ve, así que no hay
salto visual. Tres de ellas son **recreaciones declaradas** (Eris, Haumea,
Makemake): no hay imágenes detalladas de esos cuerpos y se marcan como
representación, no como fotografía.

Qué falta: sustituir las texturas por los masters de #370 cuando estén
disponibles. Es cambiar archivos; ni los datos ni la experiencia dependen de
ello.

## 2. Lo que no se ha probado

1. **Teléfono físico.** Los gestos táctiles van por CDP
   (`Input.dispatchTouchEvent`): reproducen la lógica del gesto, no un teléfono.
   Las cifras de 320 y 390 px son de un navegador de escritorio con el recuadro
   a ese tamaño.
2. **GPU real.** R04 mide el mismo contexto WebGL 2 con
   `EXT_disjoint_timer_query_webgl2` cuando existe. Si la extensión no está
   disponible no se publica cifra GPU. **Aquí no existe**: este contenedor
   resuelve WebGL por software, y lo que se publica es el tiempo entre cuadros
   entregados, que con el Sistema Solar entero va de 28 ms a 320 px a 54 ms a
   1440 px, y sube a unos 68 ms rodeando a Saturno con sus lunas. En un equipo
   con tarjeta serán otras cifras, mejores, y **no se declara cuáles porque no
   se han medido**. La ejecución en una GPU física concreta sigue pendiente.
3. **Lector de pantalla real.** Hay vía descriptiva, `aria-live`, foco
   determinista y recorrido completo con teclado, comprobados como DOM y como
   foco. Nada de eso dice cómo lo lee NVDA, JAWS o VoiceOver. Es de Axioma.
4. **Las 6.366 entradas del catálogo de exoplanetas.** En la esfera sólo están
   las 68 anfitrionas que este paquete dibuja de verdad. Las otras 39 que se ven
   a simple vista quedan fuera porque su estrella está por debajo de la magnitud
   límite del paquete (5,6): no se finge que se pueden señalar.
5. **Las 70 lunas.** Están en los datos y en las fichas. R04 calcula fase orbital media para las 21 con textura. Las otras 49 conservan la representación anterior. Los elementos medios no son una efeméride de alta precisión.
6. **Sesiones largas.** `pruebas/medidas.js` con `SERIE_10MIN=1` muestrea diez
   minutos con el cielo repintando sin parar, y la serie entera se publica en
   `documentacion/MEDIDAS_HEAP_10MIN.json`.

   **Antes hay que comprobar que el instrumento mide, y la primera vez no
   medía.** La serie anterior daba 13,6 MB en las 121 muestras, sin moverse ni
   una décima, y eso no decía que la memoria estuviera quieta: decía que la
   lectura lo estaba. Metiendo 42 MB de lastre en el montón de JavaScript,
   `performance.memory` **no se movió nada** en este navegador. Así que se mide
   con `Runtime.getHeapUsage` por CDP, que con ese mismo lastre sube 56,5 MB y
   vuelve a bajar al recoger la basura. Las dos columnas y su calibración van en
   el archivo.

   Con el aparato comprobado: el heap va de **6,37 MB a 6,34 MB** tras **34.374
   cuadros**, oscilando entre 5,4 y 9,4 en 82 valores distintos, que es el
   diente de sierra del recolector. Eso sí dice que la memoria no crece sola.
   **No** es un perfil de fugas, no dice nada de la memoria de la GPU y no
   sustituye una sesión larga de verdad con alguien usándolo.

## 3. Decisiones que conviene discutir

- **El cielo no tiene horizonte local, fecha ni lugar.** R04 añade una silueta
  de suelo perceptual y profundidad del aire como encuadre. No son una
  transformación altacimutal ni una noche concreta.
- **Reflujo y texto grande, medidos en las siete pantallas.** A 400 % —320×256,
  que es 1280×1024 dividido por cuatro— y con el texto al 200 %, en 56 vistas,
  no desborda el documento, ningún contenedor tiene barrido lateral propio y
  ningún control se sale del visor. Lo que NO cubre esto: cómo suena con un
  lector de pantalla real. Nombres, roles y `aria-live` se inspeccionan solos;
  el orden de lectura, las interrupciones y cómo suena de verdad, no. NVDA,
  JAWS y VoiceOver siguen siendo HUMAN/AT QA, y ningún oráculo los sustituye.
- **El cielo se queda con la ventana entera, y lo que hace falta para jugar va
  encima de él.** La tira con «Examinar» y los seis de orientar está dentro del
  primer viewport porque el lienzo se queda los gestos para orientar
  (`touch-action: none`) y, sin ella, con un dedo no se llegaba a ningún
  control: había 740 px de controles debajo del pliegue y ningún gesto táctil
  los alcanzaba. El suelo y la extinción se dibujan dentro del cielo que se ve,
  no debajo de la tira.
- **La cara de noche de los cuerpos no es negra del todo** (suelo de 0,055). Es
  una licencia de dibujo para que la superficie se siga leyendo; el terminador
  sí es el de la geometría, el que sale de `n·l` con la normal de la malla.
- **Los cuerpos siguen sin relieve ni atmósfera.** R04 aplica achatamiento publicado a Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Las sombras mutuas sólo se calculan al rodear y son consistentes con las posiciones representadas, no predicciones de tránsito.
- **Al rodear un cuerpo se dibuja ese cuerpo y sus lunas, y nada más.** No es
  que el resto desaparezca: es que con las distancias comprimidas tenerlo en el
  cuadro diría que está al lado. La luz sigue saliendo de donde está el Sol
  aunque el Sol no se dibuje.
- **Sin WebGL 2 no hay Sistema Solar.** No se pinta un disco plano en su lugar:
  se dice que falta y el resto del producto sigue funcionando. Es la decisión
  contraria a la de R03, donde el dibujo plano existía y por eso se podía
  confundir con volumen.
- **Las distancias del Sistema Solar van por logaritmo y los radios por
  potencia.** Sin eso no se puede mirar: a escala real, Neptuno queda a treinta
  veces la Tierra y los planetas son invisibles. Declarado como SIMULATION.
- **El desvío de entrada al cielo** (+1,35 h de AR, +15° de declinación) vive desde R04 en `datos/r04_cielo.js`, no como constante de interfaz.
- **Los radiantes no dibujan meteoros cayendo.** Se marca el punto y se cuenta
  la lluvia. Animar meteoros sería inventar una noche concreta.

## Lo que esta vuelta ha medido, y lo que sigue sin medir

- **El producto está en los dos idiomas, y ahora hay quien lo vigile.** Hasta
  esta vuelta ninguna prueba miraba la pantalla en inglés, y por ahí se colaban
  datos del catálogo en español en siete sitios. Se mide comparando contra la
  lista exacta de cadenas que el producto declara españolas, no adivinando el
  idioma: «La Silla Observatory» o «Andromedae» engañarían a un detector.
  **Lo que no se mide: si la traducción es buena.** Que una frase inglesa esté
  bien escrita y suene natural no lo dice ninguna prueba de las que hay aquí.
- **Lenguaje claro: se miden indicadores, no la norma.** ISO 24495-1 es de
  principios. Aquí se comprueban tres cosas contables —frases de más de 25
  palabras, mayúsculas de énfasis, y jerga declarada sin explicar en la misma
  pantalla— y las tres salen a cero. **Que el texto le sirva a quien lee, que
  el orden de la información sea el útil y que las palabras sean las suyas es
  juicio humano y sigue abierto.** Este paquete no declara conformidad con la
  norma.
- **El tema del sitio se sigue, pero el sitio no está delante.** El paquete
  responde a `data-ig-theme` y se ha medido sobre el color pintado. Lo que no
  se ha podido medir es cómo queda dentro del sitio de verdad, con sus hojas de
  estilo cargadas en su orden: tres nombres de variable coinciden con los del
  sitio y quién gana depende de ese orden. Está dicho en
  `R04_INTEGRACION_PENDIENTE.md` §6.
- **`__IG_SCENE_ERROR__` es una convención nuestra, no un contrato del sitio.**
  Ese nombre no aparece hoy en el repo de Iris Green. En la vuelta anterior se
  escribió que el sitio lo esperaba, y era falso.

