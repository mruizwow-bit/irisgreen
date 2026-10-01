# R61 · RINCÓN · PECERA · PAQUETE FINAL CON MÓVIL, BENCHMARK Y QA

Fecha: 29/09/2026
Carril: R61 (Rincón · Pecera)
Órdenes aplicadas: `ORDEN · R61/RINCÓN/PECERA · CAMBIO DE DIRECCIÓN VISUAL`
y el rework de burbujas `R61_PECERA_ILLUSTRATED_PASS_BUBBLES_VISUAL_REWORK_REQUIRED`
Normativa: `IRIS_GREEN_VISUAL_STANDARD_SEP_2026_ADOPTED_ROLLING`
Tokens: `IRIS_GREEN_GLOBAL_UI_TOKENS_2026_ADOPTED`
Marcador: `61_PECERA_FINAL_PACKAGE_MOBILE_BENCHMARK_QA_READY_FOR_ASTRA_MARIA`

Esta entrega **sustituye** al paquete de las 10:31, que no llevaba burbujas.

---

## 1. QUÉ SE ENTREGA

| archivo | peso | qué es |
|---|---|---|
| `pecera_10min.mp4` | 151,2 MB | escena web, 1280×720 · 24 fps · H.264 High · 1882 kbps + AAC 129 kbps |
| `pecera_audio_10min.m4a` | 9,3 MB | banda sonora sola, para el modo sólo-sonido |
| `pecera_audio_10min.opus` | 6,1 MB | misma banda, formato alternativo |
| `pecera_poster.jpg` | 0,2 MB | póster = fotograma 0 (diferencia 2,88/255, solo del JPEG) |
| `pecera_10min_movil.mp4` | 54,0 MB | escena móvil, 512×640 · 4:5 · 618 kbps + AAC 97 kbps |
| `pecera_poster_movil.jpg` | 37 KB | póster del recorte móvil |
| `pecera.html` | 11 KB | reproductor bilingüe ES/EN |
| `pecera_bu.mp4` (máster) | 321,4 MB | máster CRF 20, para recodificar sin volver a renderizar |

Todo es de primera parte: el vídeo se generó fotograma a fotograma con código
propio y el sonido se sintetizó desde modelos físicos propios. No hay stock,
ni samples, ni material de terceros.

## 2. LO QUE CAMBIA RESPECTO A LA ENTREGA ANTERIOR

Sólo las burbujas. La escena, la fauna, las plantas, la composición, las
cáusticas, el sonido y el reproductor son los mismos que pasaron revisión.

El fallo era más básico de lo que sugería el marcador: **no había ninguna
burbuja visual**. La banda sonora tenía una columna de burbujas paneada a la
derecha y en pantalla no ocurría nada en ese sitio.

## 3. LAS BURBUJAS: MEDIDAS, NO INVENTADAS

Recorté la columna del donante (`pecera_acuario.mp4`, x 1080–1180) y analicé
sus 384 fotogramas. Todos los parámetros del sistema salen de ahí.

| | donante | pecera |
|---|---|---|
| alfa del anillo | 0,286 | 0,264 |
| grosor del trazo | 2,43 px | 2,38 px |
| radio mediano | 4,5 px | 3,9 px |
| radio p90 | 7,0 px | 7,4 px |
| velocidad de ascenso | 72 px/s | 72 px/s |
| densidad | ~9 /100 px | 7,8 /100 px |

El radio se midió sobre **2.287 burbujas aisladas**, descartando los cúmulos
fundidos que una primera medición contaba como una sola burbuja grande. Esa
corrección importó: con la medición mala las dibujé un 35 % más grandes de la
cuenta y se notaba al comparar contra el donante.

Son **anillos**, no discos: trazo blanco con antialias de un píxel, interior
transparente, un reflejo plano arriba a la izquierda, y un segundo arco
interior en las mayores. Sin desenfoque y sin degradado, que es lo que les da
el filo plano del lenguaje ilustrado.

Respetan la profundidad: las plantas y las rocas más cercanas las tapan, y
añadí un búfer de profundidad de la fauna para que un pez por delante también
las tape y uno por detrás no.

## 4. DOS DEFECTOS QUE ENCONTRÉ MIDIENDO Y CORREGÍ

**Cerco oscuro.** El realce de filo dejaba una caída de −0,061 alrededor de
cada anillo, que el donante no tiene. Ese realce existe para recuperar el filo
que quita el remap del vaivén de las plantas; las burbujas no pasan por ese
remap, así que tampoco tienen por qué pasar por el realce. Moví su dibujado
detrás. Medido de nuevo: **0 píxeles con caída**.

**Columna mal colocada.** Estaba en x=1160. Medí, para cada franja vertical del
encuadre, qué parte del trayecto cruza fondo claro (donde un anillo blanco
pierde contraste). x=1100 es la mejor de todo el cuadro: **3,2 %** frente al
5,2 % de donde la había puesto. Allí sale de detrás de la roca derecha, que
hace de fuente implícita, y sube por agua oscura.

## 5. LOS 10 MINUTOS SIN BUCLE

Medido sobre el vídeo final, no sobre la teoría:

- el par de fotogramas más parecido separados por más de 20 s está a **2,28 ×**
  la distancia entre fotogramas contiguos. Un bucle daría ≈1,0.
- diferencia entre contiguos: media 2,353, máximo 4,654 (2,0 × la media)
  → sin saltos ni cortes.
- luminancia: recorrido de **1,38 niveles sobre 255** en los 600 segundos;
  salto medio 0,099, máximo 0,525.
- parpadeo: alternancia de signo 0,54 (0,50 = azar), autocorrelación −0,08
  → sin flashes ni parpadeo.

La columna de burbujas está viva y distinta durante los diez minutos:

| minuto | 0 | 2 | 5 | 8 | 10 |
|---|---|---|---|---|---|
| burbujas en el tramo de agua abierta | 21 | 35 | 32 | 25 | 38 |

## 6. SONIDO

Sin cambios respecto a la versión aprobada. Sintetizado, no grabado: burbujas
con modelo de Minnaert, cuerpo de agua con ruido conformado, y movimientos
lentos con periodos inconmensurables.

- sonoridad integrada: **−23,2 LUFS**
- rango de sonoridad: 2,6 LU
- pico real: −9,4 dBFS

**Relación entre lo que se ve y lo que se oye:** se emiten 6,5 burbujas por
segundo y se oyen unas 1,6. Es lo que pasa de verdad en el agua — sólo las
mayores suenan — pero conviene que conste que es una decisión, no un descuadre.

## 7. REPRODUCTOR · ACCESIBILIDAD

- **nada arranca solo**: sin autoplay, sin precarga, sin sonido de entrada.
- el póster es el fotograma 0, así que la imagen fija coincide con el primer
  fotograma y no hay salto al dar a empezar.
- tres modos: normal, suave, y sólo imagen.
- silenciar es independiente de parar.
- texto alternativo descriptivo en ES y EN.

**Gate §9:** barrido hecho sobre el HTML completo. Fuera del bloque `:root` de
tokens no queda ningún color de interfaz escrito a mano. `#FFFFFF` no es
superficie extensa en LIGHT, `#000000` no es fondo en DARK NAVY.

## 8. FIDELIDAD CONTRA EL DONANTE

| medida | donante | pecera | |
|---|---|---|---|
| detalle fino (desviación del paso alto) | 0,0252 | 0,0260 | **1,03 ×** |
| reparto de energía en banda alta | 6,1 % | 3,7 % | 0,61 × |
| saturación media | 0,540 | 0,473 | 0,88 × |
| luminosidad media | 0,402 | 0,450 | 1,12 × |

Las dos primeras filas no se contradicen. La cantidad **absoluta** de detalle
fino iguala al donante; lo que baja es su **porcentaje**, porque la escena
ilustrada tiene más superficie plana y por tanto más energía en banda baja.
Es consecuencia del lenguaje que se aprobó, no un defecto de ejecución.

## 9. MÓVIL 320–390 (estándar visual móvil §12)

Hasta ahora esto estaba pendiente y lo decía en cada entrega. Ya no.

**No es el escritorio estrechado.** A 520 px o menos el encuadre cambia de 16:9
a 4:5 y se sirve un vídeo distinto, recortado, no el ancho reducido a una tira.

La ventana del recorte se eligió midiendo, no a ojo. Para cada franja vertical
del encuadre medí cuánta arena desnuda queda en el tercio inferior, cuánto
material duro (roca y madera) entra, cuánta vegetación, y si cae dentro la
columna de burbujas. Gana **x 704–1216, y 0–640**: es la que menos arena vacía
deja (0,581) conservando la mayor proporción de roca y madera (0,162) y la
columna. Recortar también por arriba empeora: sube la arena al 0,745.

El recorte sale del máster que guardamos, sin volver a renderizar.

| | escritorio | móvil |
|---|---|---|
| resolución | 1280×720 | 512×640 |
| formato | 16:9 | 4:5 |
| bitrate | 1882 kbps | 618 kbps |
| peso | 151,2 MB | **54,0 MB** (−64 %) |
| póster | 173 KB | 37 KB |

El vídeo móvil pasa su propio QA: par más parecido a 2,19 × la distancia entre
contiguos (sin bucle), máximo/media 2,2 (sin saltos), alternancia 0,56 y
autocorrelación −0,13 (sin parpadeo).

## 10. VERIFICACIÓN EN NAVEGADOR REAL

Chromium, con el reproductor real y los archivos reales, a 320, 360, 390 y
1440 px, en LIGHT y DARK NAVY.

| ancho | desbordamiento | marco | aspecto | asset elegido | botones < 44 px | errores |
|---|---|---|---|---|---|---|
| 320 | 0 | 296×370 | 0,800 | móvil | ninguno | ninguno |
| 360 | 0 | 336×420 | 0,800 | móvil | ninguno | ninguno |
| 390 | 0 | 362×453 | 0,800 | móvil | ninguno | ninguno |
| 1440 | 0 | 968×545 | 1,778 | escritorio | ninguno | ninguno |

Tokens comprobados en el navegador: LIGHT da fondo `#F6F8FB` y texto `#17395C`;
DARK NAVY da `#0B1A2B` y `#EEF4F8`. El anillo de foco mide `#5A49A8`, que es
`--ig-focus`. Ninguno inventado por la página.

**Comportamiento, medido pulsando de verdad** (con un clip en VP9, porque el
Chromium de pruebas no trae H.264 ni AAC — `canPlayType` devuelve vacío para
los dos; el vídeo entregado sí es H.264 y se reproduce en navegadores normales):

- en reposo: `paused`, `currentTime` 0, `preload="none"`, autoplay desactivado.
  **Nada arranca solo.**
- al pulsar: el tiempo avanza a 2,49 s, decodifica 512×640, volumen 0,28.
- silenciar: `muted` true y el tiempo sigue avanzando a 3,73 s.
  **Silenciar no detiene la escena.**
- modo suave: velocidad 0,7 y la pista de sonido aparte arranca — el sonido no
  se deforma al ralentizar la imagen.
- solo imagen: sin sonido por ninguna de las dos vías, volumen deshabilitado.
- parar: `paused`, tiempo a 0, vuelve el póster.

**Accesibilidad, medida:**

- orden de tabulación desde la carga: ES → EN → Ver y escuchar → Volumen →
  Pantalla completa → Modo suave → Solo imagen. Los botones deshabilitados
  (Silenciar, Parar) se saltan correctamente.
- objetivos táctiles: ningún botón por debajo de 44 px de alto o ancho.
- `forced-colors`: la página adopta la paleta del sistema (texto negro, fondo
  blanco, bordes negros) y no desborda.
- zoom al 200 % y texto del usuario al 200 %: desbordamiento horizontal 0 a 320 px.
- `prefers-reduced-motion`: las transiciones de los botones pasan a 0 s.

## 11. GATE VISUAL §15 · LAS DIEZ PREGUNTAS

Con medidas, no con adjetivos. Micro-detalle = desviación del brillo tras
quitar el gradiente suave; tonos = escalones distintos sobre 64 niveles.

| superficie | micro-detalle | tonos distintos |
|---|---|---|
| roca | 0,0963 | 23 / 64 |
| vegetación | 0,0931 | 23 / 64 |
| madera | 0,0834 | 17 / 64 |
| sustrato | 0,0519 | 16 / 64 |
| pared del fondo | 0,0437 | 16 / 64 |

1. **¿Parece terminado?** Sí. 10 min sin bucle verificado, sonido propio,
   reproductor bilingüe, móvil propio, sin errores de consola.
2. **¿Tiene materia real o formas planas?** Materia. Ninguna superficie se
   resuelve con un color plano: la más lisa —la pared del fondo— conserva 16
   tonos distintos. La vegetación tiene 39 matices y 21 niveles de valor, así
   que no hay una hoja clonada como relleno, que es lo que §6 prohíbe.
3. **¿La luz construye volumen?** Sí, por sombreado en escalones, sombras de
   contacto, cáusticas en dos niveles sobre el sustrato y haces diagonales.
   **No** por medios ópticos físicos: eso lo prohíbe expresamente la orden de
   cambio de dirección.
4. **¿Hay profundidad?** Sí. Cuatro capas medibles entre z 0,273 y 0,660, con
   solapamiento real: las plantas y rocas tapan las burbujas y a los peces, y
   un pez por delante tapa la columna.
5. **¿La composición cuenta la acción?** Sí: masa a la izquierda, claro
   central, acento a la derecha, y la columna de burbujas marcando el foco.
6. **¿Se siente propio de Iris Green?** Paleta medida del donante aprobado,
   tokens globales en el chrome, ritmo lento, sin sobresaltos.
7. **¿Está al nivel de producto premium actual?** Es donde tengo dudas
   honestas. Ver la pregunta 10.
8. **¿Mantiene ese nivel en móvil?** Sí, y ahora está medido: composición
   propia a 4:5, asset un 64 % más ligero, cero desbordamiento, objetivos
   táctiles correctos en los tres anchos.
9. **¿Respeta accesibilidad y rendimiento?** Accesibilidad sí, medida arriba.
   Rendimiento **a medias**: hay asset ligero para móvil y `preload="none"`,
   pero 151,2 MB en escritorio sigue siendo mucho para una página.
10. **¿Se ha comparado con el benchmark externo vigente?** Sí, por fin, y hace
    falta decir qué es: §4 de la norma **no nombra un producto externo**, fija
    siete principios. Contra ellos:

| principio §4 | estado |
|---|---|
| luz que construye volumen | **sí**, en lenguaje ilustrado |
| materiales diferenciados | **sí**, 5 familias con micro-detalle distinto |
| geometría y superficies con imperfección | **sí**, silueta irregular de rocas, grano, variación por hoja |
| alta estabilidad visual | **sí**, 1,38 niveles de recorrido en 600 s, sin parpadeo |
| profundidad convincente | **parcial**, por capas y solapamiento, no por óptica |
| atmósfera | **no** |
| detalle suficiente para evitar aspecto plano | **en conflicto** |

Los dos últimos **no son fallos de ejecución: son el choque entre dos
documentos tuyos**. §4 pide atmósfera y suficiente detalle para no parecer
plano; la orden de cambio de dirección prohíbe expresamente niebla volumétrica,
profundidad de campo, desenfoque y acabado blando, y pide plano y nítido. No
puedo cumplir los dos a la vez y no me corresponde elegir. Lo dejo declarado
para que lo resuelvas.

Por eso **no me autoapruebo el gate**. Preguntas 1 a 6 y 8 en sí; la 9 a
medias; la 7 y la 10 dependen de esa decisión tuya.

## 12. LO QUE SIGO SIN DAR POR BUENO

1. **El choque entre §4 y la orden de dirección visual**, arriba. Es lo único
   que impide un PASS limpio.
2. **El tramo bajo de la columna de burbujas cruza la roca gris clara**, donde
   el anillo blanco pierde contraste. Arreglarlo toca una composición ya
   aprobada.
3. **Densidad de burbujas 7,8 frente a ~9** del donante y **saturación un 12 %
   por debajo**. Las dejo así a propósito: el destino es Rincón tranquilo.
4. **Peso de escritorio 151,2 MB.** El móvil ya baja a 54,0 MB. Para el
   escritorio hacen falta instrucciones: aceptarlo, aflojar el microdetalle de
   la arena, o servir dos calidades también ahí.
5. **Sin versión WebM/VP9.** §5 y §14 la permitirían y pesaría menos, pero es
   otro render largo y no lo abro sin que me lo pidas.

## 13. HUELLAS SHA-256

```
70e11f73d2d5b9b8a2783d32464a71552d6ba908c5527a7e8de3802f4e28bc17  pecera_10min.mp4
9651e67b4f8c61885fffa9e85dcaa1f41f9ac8003d2f5b530e166dbde2a8a5f3  pecera_10min_movil.mp4
a96d9248aa3d4dab2471e5aa5565531f84961a825b0698227fbaa6ee86999fcd  pecera_audio_10min.m4a
1ec4c04597464da2ae79c79d81f9a4c2591e153407e92cec396a840cabc3ba9e  pecera_audio_10min.opus
98f50e59932ec3fbd1218ce30a9c57419b11d1542766ac92d0061d5749c25250  pecera_poster.jpg
8e721ab40feebee551218225bc9193181f15c9004192a0c9e4c40c5a30895186  pecera_poster_movil.jpg
418c56f91a16feea24ddbb4f935bd6ee57b011cf584138e47635f38745cd3b79  pecera.html
5fe20fa38311525512e3c1a4efee240092b988edd3384967405cf41f1a51fdd2  pecera_bu.mp4
```

## 14. CÓDIGO

Todo el código va en `build/`. De esta pasada no cambia ningún módulo de
render: el recorte móvil sale del máster con `ffmpeg`, sin volver a renderizar,
que es para lo que servía guardarlo. Lo que cambia es `pecera.html`, con la
composición propia de móvil, la elección de asset por ancho y los objetivos
táctiles.

## 15. ESTADO

`61_PECERA_FINAL_PACKAGE_MOBILE_BENCHMARK_QA_READY_FOR_ASTRA_MARIA`

Gate §15 **no autoaprobado**: preguntas 1–6 y 8 en sí, la 9 a medias, y la 7 y
la 10 pendientes de que resuelvas el choque entre §4 de la norma y la orden de
cambio de dirección visual.

**STOP.** No toco Sala 2–6, ni A2 (en HOLD por la corrupción de CSS de la
Home), ni main, ni producción.
