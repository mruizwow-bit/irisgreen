# Juegos en sala · plan

Fecha: 01/10/2026 · Autoría: Claude (construcción) · decisión: María

Plan para una familia de juegos que Iris Green todavía no tiene: los que se
usan **de pie, en un sitio público, en una pantalla que no es tuya**.

## 1 · De dónde sale esto

De una visita de Autismo Sevilla al Museo de la Autonomía de Andalucía, en
Coria del Río, publicada en su Instagram. En la foto, un adulto autista usa un
tótem táctil con un juego de **parejas** —«Descubre las parejas»— cuyas cartas
son contenido del propio museo: la bandera de Andalucía, un lince, piezas de la
casa de Blas Infante.

El kiosco no es nuestro y el plan no lo copia. Lo que interesa es lo que la
publicación deja ver, que son tres cosas:

- **el juego lo pone el sitio**, con su propio contenido, no con contenido
  genérico;
- **hay alguien al lado** —el equipo del museo— que escucha y adapta el
  recorrido sobre la marcha;
- **lo que hizo buena la visita fue hacer**, no mirar.

Eso define una familia de juego distinta de la que tenemos.

## 2 · Qué cambia respecto a un juego de la web

Hoy Iris Green sirve **19 familias de juegos** en `es/recursos/juegos/`, y la
de memoria sola tiene doce variantes —baño, cocina, ropa, higiene, escritorio,
casa, planes, cosas útiles, antes de salir…—. Son juegos para una pantalla
propia, sentada, con tiempo.

Un juego en sala cambia cinco cosas a la vez:

| | En casa | En sala |
|---|---|---|
| Postura | Sentada, con tiempo | De pie, de paso, a veces con cola detrás |
| Pantalla | Tuya | De nadie; la siguiente persona llega en un minuto |
| Estado | Puede recordarte | **No debe recordar nada**; se borra al terminar |
| Contenido | El nuestro | El del sitio: su colección, sus piezas, sus nombres |
| Compañía | Sola | Con alguien al lado que puede ajustar la actividad |

Ninguna de las cinco es un detalle de implementación. Las cinco cambian el
diseño del juego.

## 3 · Las reglas que salen de ahí

1. **Sin cuenta y sin memoria.** Ni login, ni almacenamiento, ni «continuar
   donde lo dejaste». Al acabar o al dejarlo, la pantalla vuelve al principio
   sola. Lo que una persona hizo no puede quedar a la vista de la siguiente.
2. **Sin reloj y sin marcador.** Nadie juega contra el tiempo delante de una
   cola. Ni puntuación, ni ranking, ni «has tardado».
3. **Se puede abandonar a media partida sin consecuencia**, y se nota cómo:
   un botón de volver siempre visible, no escondido en una esquina.
4. **El contenido lo pone el sitio.** El juego es un molde; las cartas, los
   nombres y las imágenes son de la colección. Eso obliga a un formato de
   contenido sencillo que el personal del sitio pueda rellenar sin saber
   programar.
5. **Alguien al lado puede ajustarlo.** Menos cartas, más tiempo, sin sonido,
   más contraste: accesible desde la propia pantalla, en dos toques, sin menú
   de administración ni contraseña.
6. **Un adulto no es un niño.** El mismo juego lo va a usar quien tenga diez
   años y quien tenga cuarenta. Ni voz infantilizada, ni premios de purpurina,
   ni «¡muy bien!». La misma dignidad que pedimos en el resto del sitio.
7. **Funciona sin red.** Un museo tiene wifi malo. Todo local, sin peticiones.
8. **Sin cámara, sin micrófono, sin ubicación.** Ningún permiso nuevo, como en
   todo lo demás.

## 4 · Accesibilidad, que aquí es distinta

Lo que ya aplicamos sigue: objetivo táctil de 44 px, foco visible, movimiento
reducido, colores forzados, nada que dependa sólo del color, reflujo.

Lo que cambia en un tótem:

- **el teclado deja de ser la alternativa**: en una pantalla de pie no hay
  teclado. La alternativa al arrastre tiene que ser **tocar origen y destino**,
  no arrastrar;
- **la altura importa**: lo accionable no puede estar por encima de 1,40 m ni
  por debajo de 0,70 m, porque hay quien juega sentada en silla de ruedas;
- **el objetivo táctil sube a 60 px**, no 44: se toca de pie, a veces con
  temblor, a veces con el dedo de otra persona guiando;
- **el sonido es opcional y empieza apagado**. En una sala con eco, un sonido
  inesperado echa a alguien de la sala.

## 5 · Qué de lo que hay sirve, y qué no

**Sirve el molde, no el contenido.** La familia de memoria es exactamente la
mecánica de la foto, y la tenemos construida y probada doce veces. Lo que no
sirve es nuestro contenido doméstico: un museo no quiere las cartas del baño.

**Hace falta lo que no tenemos:**

- un **formato de contenido de sala** —un archivo que el sitio rellena con sus
  piezas: imagen, nombre en dos idiomas, y nada más—;
- un **modo sala** del motor de juegos: sin estado, con reinicio automático,
  con los ajustes a la vista;
- una **hoja para el sitio**: a qué altura poner la pantalla, qué hacer si se
  cae la red, y cómo dejarla lista antes de abrir. Ya no es una hoja de montaje
  de aparato, porque no hay aparato nuestro.

## 6 · Primera tanda propuesta

Tres juegos, los tres con mecánica ya construida y probada en la web, y los
tres con contenido del sitio:

1. **Parejas.** La de la foto. Es la que mejor aguanta contenido ajeno: dos
   cartas iguales funcionan con cualquier colección.
2. **¿Qué falta aquí?** Una escena de la colección con una pieza quitada. Mira,
   decide, toca. Sin tiempo.
3. **Ordena la historia.** Cuatro momentos de algo que el sitio cuenta, para
   ponerlos en orden. Es el que más enseña del sitio y el que más depende de
   que el contenido esté bien escrito.

No propongo más de tres para la primera tanda: con un sitio real delante se
aprende más que añadiendo moldes.

## 7 · Decidido: esto se queda todo en la web

**María, 01/10/2026.** No hay instalación, no hay tótem nuestro, no hay archivo
que se entregue. Es una página de irisgreen.eu que el sitio abre en la pantalla
que tenga.

Lo que esa decisión resuelve, y es la mitad del plan: desaparece el
mantenimiento de una instalación. Ni dispositivo que se actualiza solo de
madrugada, ni modo kiosco que alguien cierra, ni táctil que se descalibra, ni
batería, ni versión antigua corriendo en una sala que nadie visita. El software
se mantiene como el resto de la web: se despliega una vez y está desplegado en
todas partes.

Lo que esa decisión **crea**, y hay que mirarlo de frente:

1. **La red deja de ser opcional.** Hoy no hay *service worker* en el sitio:
   comprobado, no existe ninguno. Si la página no carga, no hay juego. La
   página de juegos pesa 38 KB, su motor 42 KB y su hoja 25 KB, pero el
   catálogo de datos son 176 KB: 282 KB para arrancar. En un museo con wifi
   mala eso es la diferencia entre jugar y no jugar. Un juego de sala tiene que
   cargar solo lo suyo, no el catálogo entero, y conviene decidir si merece la
   pena un *service worker* para que la segunda visita del día no dependa de la
   red.
2. **Queda abierto de quién es el contenido.** Si las cartas son piezas de la
   colección del sitio, o las alojamos nosotros —y entonces hay derechos,
   revisión editorial y una página por sitio—, o las abre el propio sitio desde
   su equipo con el selector de archivos, sin subida, como ya hace el Taller
   con los proyectos. La segunda vía encaja con la norma que ya tenemos
   («archivos del usuario locales y sin upload por defecto») y no obliga a
   hospedar nada ajeno. La CSP actual es `connect-src 'self'`, así que abrir un
   archivo local funciona y descargarlo de fuera no.
3. **La pantalla sigue siendo compartida.** Que sea web no quita ninguna de las
   ocho reglas del §3: sin cuenta, sin memoria, sin reloj, sin marcador, vuelta
   al inicio sola. Un navegador en una sala es tan de nadie como un tótem.

Lo que sigue sin decidir, y ahora es más pequeño:

- **De quién es el contenido** (punto 2 de arriba), que es la única decisión
  que cambia lo que se construye.
- **Si se ofrece como acompañamiento** —ayudar a un sitio a preparar su
  contenido— o sólo como página pública que cualquiera puede abrir.

## 8 · Secuencia que propongo

| Paso | Qué sale | Qué lo cierra |
|---|---|---|
| S0 | Decidir de quién es el contenido, y carga del juego sin el catálogo entero | María |
| S1 | Formato de contenido de sala + un ejemplo relleno a mano | Que alguien del equipo lo rellene sin ayuda |
| S2 | Modo sala del motor: sin estado, reinicio, ajustes a la vista | QA en una pantalla de pie, no en un portátil |
| S3 | Parejas con contenido de ejemplo | HUMAN QA María |
| S4 | Los otros dos moldes | HUMAN QA María |
| S5 | Hoja para el sitio y prueba en un sitio real | El sitio lo usa un día entero sin nosotros |

Nada de esto toca producción ni el catálogo actual de juegos: es un carril
aparte, como R44 lo es del Taller.

## 9 · Una cosa que conviene no perder de vista

Lo que la publicación destaca no es el juego: es que **había un equipo
dispuesto a escuchar y adaptar**. El software no sustituye eso. Si construimos
esto, se construye para que el personal del sitio tenga algo que ofrecer y
pueda ajustarlo, no para que la pantalla haga su trabajo.
