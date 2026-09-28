# R62 · P02 · Terrario vivo · concepto

**Estado:** `R62_P02_TERRARIO_CONCEPT_READY_FOR_ASTRA`
**Fecha:** 28/09/2026

**Este documento fija la mecánica, y la mecánica no ha cambiado.** Lo que sí
ha cambiado es la ejecución visual: el §16 de la norma visual de septiembre
reabrió la calidad, y el rework está en `RENDER-E4.md`, que es donde se dice
qué se hizo, qué se midió y qué sigue corto.

Láminas: `gameplay-{navy,claro}.svg` y `gameplay-movil-{navy,claro}.svg`
(principal, escritorio y móvil, en los dos temas globales) y
`causalidad-{navy,claro}.svg` (segundo estado).
Generador: `scripts/r62_p02_render.py` sobre `scripts/ig_render_e4.py`.
Capturas fuera de la rama, según §19.

---

## 1 · Imagen principal de gameplay

`gameplay.svg`. Un terrario plantado y a medio hacer: loma a la izquierda con
musgo, hondonada a la derecha donde se ha quedado el agua, madera flotada
levantándose del centro, helechos de distintos tamaños escalonados en
profundidad, vegetación colgando desde el borde superior y pared de roca con
repisas al fondo, perdida en bruma. Delante, cortadas por el marco, hojas
grandes y oscuras que establecen el primer plano.

En el centro, **un helecho suspendido sobre su huella**: el elemento que se
está colocando, con el anillo punteado del destino y su sombra en el suelo.

## 2 · Segundo estado / interacción

`causalidad.svg`. Díptico del **mismo encuadre** de la ladera derecha, antes y
después de colocar una roca. Una sola imagen no puede enseñar una causa, así
que van las dos, ampliadas para que el cambio se lea, con la cadena numerada
debajo.

## 3 · Mecánica

La persona elige un elemento de la bandeja —sustrato, piedra, madera, musgo,
planta, agua, refugio— y lo coloca en el terrario. Puede moverlo después,
retirarlo, deshacer y reiniciar. No hay objetivo, ni orden correcto, ni final.

Lo que convierte eso en juguete y no en decoración es que **el sitio importa**.
El terreno tiene relieve: el agua se queda en el punto bajo porque es el punto
bajo. Una roca tapa la luz y proyecta sombra ladera abajo. El suelo en sombra
junto a un charco retiene humedad. El musgo prende donde hay sombra y humedad,
y no prende donde no las hay. Una planta colocada donde le conviene se ve
mejor: color más saturado, hoja orientada hacia la zona que le sirve.

## 4 · Bucle

`colocar → observar la respuesta → combinar → ajustar → seguir construyendo`

Sin cronómetro, puntuación, vidas, ranking, estrellas, monedas, castigos, racha
diaria, obligación de volver ni fracaso irreversible. Una colocación que no
funciona se ve y se cambia.

## 5 · Qué lo hace juguete digital

Hay respuesta del sistema y es observable sin números. La prueba está en la
segunda lámina: una acción, cuatro consecuencias encadenadas, todas visibles en
el propio terrario. No es «arrastra decoración hasta que quede bonito», porque
dos colocaciones distintas del mismo elemento dan resultados distintos.

## 6 · Qué NO es

No es Tamagotchi, ni mascota virtual, ni granja, ni cuidado de animales, ni
simulador de supervivencia, ni examen de biología, ni ficha educativa, ni
cuadro de mandos ambiental, ni colección de barras y porcentajes, ni juego de
recompensas, ni jardín cute. Sin mascotas con ojos, sin caras en las plantas,
sin estética bebé, sin monedas, corazones ni estrellas.

## 7 · Materiales, luz y paleta

Tierra cálida (`#7A6039` → `#2A2016`) contra verdes fríos y profundos
(`#2A6440` → `#6BAA59`), roca gris verdosa, madera `#634C34`, agua
`#12292B` con superficie `#6FAEA6`, y una sola luz cálida `#FFE7B4` entrando
por arriba a la izquierda.

Cuatro recursos hacen el volumen: perspectiva atmosférica —cada elemento lleva
una profundidad que decide escala, contraste y cuánto se mezcla con la bruma—,
hoja en dos tonos con filo de canto, oclusión de contacto bajo cada cosa que se
apoya, y grano sobre todo el conjunto.

El cristal existe pero no estorba: un canto, un reflejo discreto a la izquierda
y condensación sólo donde tiene sentido —arriba, en las zonas frías, y sobre la
zona húmeda nueva en la segunda lámina—.

## 8 · Qué se mueve

Muy poco y muy despacio. La hoja se acomoda al soltarla (~400 ms). El agua se
extiende hasta su nivel en ~900 ms y luego queda quieta, con una ondulación muy
leve cada varios segundos. La condensación aparece progresivamente a lo largo
de minutos. El musgo prende con un crecimiento lento, no con un «pop». Las
hojas reorientan su ángulo a lo largo de segundos, no de golpe.

Nada parpadea, nada rebota, no hay partículas de relleno, no hay movimiento de
fondo obligatorio y nada exige reflejos.

## 9 · Qué hace la persona

Mira, coloca, cambia de sitio, retira, vuelve a mirar. Puede dejarlo a medias y
volver, o no volver. Si selecciona un elemento puede leer, si quiere, qué
necesita y qué modifica; la información es opcional y sale del elemento, nunca
al revés.

## 10 · Controles equivalentes

| | Teclado | Puntero / táctil |
| --- | --- | --- |
| Recorrer la bandeja | `Tab` y flechas | desplazar la bandeja |
| Elegir elemento | `Enter` | tocarlo |
| Elegir lugar | flechas mueven el cursor por el terrario | tocar el sitio |
| Colocar | `Enter` | tocar, **o** arrastrar |
| Mover lo ya colocado | seleccionar y flechas | arrastrar o tocar y tocar destino |
| Retirar | `Supr` | botón en el elemento seleccionado |
| Deshacer / rehacer | `Ctrl+Z` / `Ctrl+Y` | botones |
| Reiniciar | botón, con confirmación | ídem |

El arrastre **nunca** es la única vía: «seleccionar elemento → seleccionar
lugar → colocar» cubre todo. Objetivos de 44 px, y 56 px con
`html[data-ig-controls="big"]`.

**Móvil, desde el principio y no por compresión.** A 320–390 px el terrario
ocupa el ancho completo y la bandeja es una tira horizontal bajo él, con
categorías como pestañas; nunca un panel lateral diminuto y nunca encima del
terrario. Deshacer y reiniciar van fuera del área de juego.

## 11 · Reduced motion

Con `prefers-reduced-motion` **o** `html[data-ig-motion="off"]` —las dos
señales— los acomodos son cortes secos, el agua aparece a su nivel sin
extenderse, la condensación aparece en un paso y el musgo cambia de estado sin
crecer. Sin flashes en ningún modo.

Ningún estado depende sólo del color: la humedad se ve por el **tono y la
textura** del sustrato, la sombra por su forma, el musgo por su silueta y su
grano, la selección por marco y tiradores. En `forced-colors` cada elemento
conserva borde propio y la zona húmeda se marca con trama, no con color.

Si hay audio ambiental: opcional, con control de volumen y silencio, y nunca en
reproducción automática.

## 12 · Adaptación por etapa

Misma identidad visual en todas las edades. Cambia la cantidad de decisiones,
no el aspecto.

Infancia arranca con un terrario parcialmente construido y cinco elementos
—tierra, roca, agua, planta, rama—, relaciones directas y objetos y objetivos
más grandes. Adolescencia y adultez añaden variedad de sustratos, más plantas
con rangos distintos, orientación de la luz, capas y relaciones entre zonas.

Adultez no significa interfaz gris y técnica, e infancia no significa versión
cute. Es el mismo terrario.

## 13 · Riesgo de similitud con IP externa

- **Vista propia.** Frontal a través del cristal, con el terreno en relieve y
  las capas en sección. No es la cámara isométrica ni el encuadre de tres
  cuartos de los productos comerciales del género.
- **Sin personajes.** No hay avatar, ni criatura con cara, ni mascota. Nada que
  pueda parecerse a la silueta de otro producto.
- **Sin interfaz de simulador.** No hay paneles, medidores ni parámetros.
- **Lenguaje visual generado, no trazado.** Toda la geometría sale de las
  funciones del generador con semilla fija; no hay assets de terceros, ni
  stock, ni calco.

La inspiración admisible es sólo la estructura abstracta: construir, observar,
modificar un pequeño ecosistema.

## 14 · Criterio de PASS visual

A 1440 y a 390:

1. Se distinguen primer plano, plano medio y fondo sin esfuerzo.
2. Tierra, roca, madera, musgo, hoja y agua se reconocen como materiales
   distintos, no como manchas de color.
3. Todo lo que se apoya tiene sombra de contacto; nada flota sin querer.
4. El cristal se percibe sin tapar el contenido.
5. La consecuencia de la segunda lámina se entiende sin leer los pies.
6. Ningún elemento puede confundirse con obra de terceros.

---

## Qué simula el sistema y qué es sólo representación

Esto importa para que Codex no construya de más ni prometa de más.

**Simulación real.** Una rejilla gruesa sobre el terrario con dos campos:

- **Luz.** Cada elemento opaco ocupa celdas y resta luz a las celdas que quedan
  detrás en la dirección de la luz. Nada más: sin rebotes, sin difusión.
- **Humedad.** El agua fija humedad máxima en las celdas que ocupa y la reparte
  a las vecinas con caída por distancia. La pendiente del terreno hace que el
  agua busque el punto bajo. La sombra reduce la pérdida. El tipo de sustrato
  multiplica cuánto retiene.

Las plantas y el musgo tienen un rango preferido de luz y de humedad. Lo bien
que la celda encaja con ese rango decide tres cosas visibles: la saturación del
color, el ángulo de las hojas y si el musgo prende o no.

**Sólo representación visual.** La condensación, las ondas del agua, el brillo
húmedo de la roca y el grano del sustrato son adorno: responden al estado pero
no lo calculan. La madera y la piedra no se degradan. No hay ciclo día/noche.

**Lo que NO se simula, y por tanto no se afirma.** No hay fotosíntesis, ni
nutrientes, ni pH, ni temperatura, ni crecimiento real de especies, ni
ecología de poblaciones. Si en el futuro se añade información ecológica real al
seleccionar un elemento, irá con su fuente y separada de lo que el juego
calcula, para que nadie confunda una cosa con la otra.

**La cadena de la segunda lámina, paso a paso.** Es exactamente lo que el
sistema hace, sin metáfora:

1. La roca ocupa celdas y resta luz a las celdas de detrás.
2. Esas celdas quedan en sombra: su pérdida de humedad baja.
3. Como están junto al charco, reciben humedad y ahora la retienen.
4. El musgo tiene un rango de sombra y humedad alta: en esas celdas prende.

---

## Iteraciones del concepto

Cinco pasadas de la versión vectorial, mirando el render cada vez. Se dejan
escritas porque las decisiones de mecánica salieron de aquí y siguen en pie,
aunque la técnica de dibujo se haya sustituido entera. Las vueltas del rework
visual están en `RENDER-E4.md`. Lo que cambió, por si sirve para los
pilotos siguientes:

1. **Primera versión: una caja plana.** El terreno era un plano y el tanque
   estaba vacío dos tercios. Parecía exactamente lo que el §18 dice que hay que
   corregir antes de entregar.
2. **El terreno pasó a tener relieve.** Una curva con loma y hondonada. Ese
   cambio, solo, convirtió una vitrina en un pequeño mundo: ahora el agua se
   queda donde se queda por una razón.
3. **El agua se hundió de verdad.** Antes flotaba como un cuenco; ahora existe
   sólo donde el terreno cae por debajo del nivel.
4. **Se llenó el volumen.** Pared de roca con repisas al fondo, vegetación
   colgando del borde superior, helechos altos. El tanque dejó de estar vacío.
5. **La segunda lámina se rehízo entera.** Era una sola imagen «después» que no
   demostraba nada; ahora es un díptico del mismo encuadre con la cadena
   numerada.
