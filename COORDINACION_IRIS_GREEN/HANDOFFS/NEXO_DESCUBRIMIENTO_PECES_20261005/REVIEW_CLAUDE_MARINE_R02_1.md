# Nexo · Peces R02_1 · recepción y revisión acotada

Fecha: 2026-10-05. Issue #323.
Estado: NEXO_MARINE_R02_1_KEEP_DIRECTION_TARGETED_SWIM_PATCH_REQUIRED.

María: «este también ha mejorado bastante». Se recoge como valoración positiva de avance; no se convierte automáticamente en HUMAN QA PASS final.

## Artefactos exactos

ZIP: descubrimiento-peces-R02_1.zip
- 27368422 bytes.
- SHA256 85e2c612063d775459fe3e02561170fb2b4c82a38b2f9f96ba1e07b24a4d2c5f.
- Biblioteca libfile_07bfb788779081918d54c32b56d8fbc8.
- CRC correcto; 72/72 entradas del manifest verificadas independientemente.
- Sintaxis app/*.js: 4/4.
- 26 PNG de animales idénticos a rev.1; no se han redibujado los masters.

Vídeo: descubrimiento-peces-R02_1.mp4
- 874115 bytes; SHA256 540faeb43c15ef1360da4c51284b57ddc4c7b5e37c4c5d0bd21b5472f0027512.
- Biblioteca libfile_474de85bf1488191bcf08cf7d55a46a2.
- H.264, 1280×800, 25 fps, 32.64 s.
- Idéntico byte a byte a pruebas/descubrimiento-peces-R02.mp4 dentro del ZIP.
- Nexo ha inspeccionado fotogramas extraídos a intervalos; no declara reproducción perceptual continua ni prueba de navegador.

## KEEP de la dirección

Conservar mundo navegable, separación arrastrar/toque, cruceta principal de cámara, controles de luz dentro del desplegable, pausa/examen y vía accesible. La natación ya tiene deformación por tiras y trayectorias propias en código; no volver al prototipo inmóvil.

El encuadre explícito desde la vía accesible es una solución razonable para observar cuerpos grandes. Puede mantenerse si el control anuncia su función completa, conserva ID/foco y no revela identidad antes de Examinar. La cámara no debe seguir automáticamente a un animal sin esa acción.

El modo equipo, la escena privada de trece y la revalidación factual siguen separados. No ampliar meso-01.

## P01 · Corregir giro y congelación de pose

### Giro que queda atrapado

motor.js, orientacion():
- Interpola con k=0.055 hacia +1 o −1.
- Después fuerza todo valor con magnitud <0.08 a +0.08 o −0.08 según su signo.
- Al intentar cruzar de +0.08 a −1, el siguiente resultado es +0.0206, que vuelve a fijarse en +0.08. Nunca cruza el cero.
- La situación simétrica también existe en la dirección contraria.

Reproducción independiente con la función original extraída, posición de velocidad positiva y anima=true: desde giro=1, tras 180 pasos permanece 0.08; el paso siguiente sigue en 0.08, aunque el objetivo es −1. Es una prueba de lógica en Node, no navegador.

Los fotogramas de la grabación también muestran al animal reducido a una línea vertical durante el recorrido. La secuencia muestreada es consistente con el defecto; la prueba de función establece la causa.

Patch: transición de orientación que llegue realmente al signo de destino, con duración dependiente del tiempo, no del número de llamadas. Evitar que el pez permanezca aplastado. Retest de ambos sentidos y observación del giro en el runtime exacto.

### Pausa cambia el cuerpo en vez de congelarlo

dibujarDeformado() usa una sola tira cuando anima() es false; elimina la onda en lugar de mantener su fase congelada. orientacion() cambia k a 1 al pausar y salta directamente al sentido objetivo.

Reproducción original con el mismo instante t: escala horizontal 0.08 → −1 al pausar; dibujo de 15 tiras → una imagen rígida. No conserva la pose que la persona acaba de examinar.

Patch: separar avance del reloj y evaluación/dibujo de la pose. Pausa manual y Examinar detienen el tiempo y preservan orientación/deformación completas; reanudar continúa desde esa pose. Mismo estado para luz, oscuro y detección. Comprobar también cancelación de transición de cámara pendiente al Examinar, para conservar el encuadre visible.

## P02 · REDUCED no cumple la orden R02

anima() sólo permite normal. Reducido y Ninguno dejan inmóviles los animales. El propio qa4 certifica cero frames en ambos; eso prueba quietud, no el movimiento reducido solicitado.

Orden vigente: NORMAL = natación continua; REDUCED = menor recorrido y amplitud; NONE = quietud. Implementar esa distinción, manteniendo pausa independiente. Los modos no se justifican sólo cambiando la respuesta de la luz.

Actualizar T03: cero frames propios continuos en pausa/NONE; REDUCED puede animar de forma reducida. No mantener una prueba que obligue a incumplir el comportamiento de producto acordado.

## P03 · El botón debe decir que también cambia la vista

La clave llevarVista sigue mostrando «Orientar luz aquí» / «Aim the light here», pero el handler pausa, centra cámara, ajusta zoom y apunta.

Cambiar a «Encuadrar e iluminar» / «Frame and illuminate» (o copy igualmente explícito), con ayuda breve de que estabiliza el encuentro para observar. Anunciar el encuadre aunque el animal ya estuviera parcialmente visible; ahora vistaDesplazada sólo depende de fuera. Mantener nombres neutrales antes del examen.

No retirar el autoencuadre pedido por acción accesible: hacerlo predecible.

## Caché anterior y retest

La limpieza de data-firma al vaciar candidatos está incorporada. Mantener ese arreglo.

Sigue existiendo retorno temprano cuando la firma es igual: verificar y completar la actualización en sitio de posiciones e idioma, con nodos/foco estables mientras nadan los animales. No dar por cerrada toda la orden anterior con la sola invalidación de caché. Retest con dos candidatos, cambio de idioma, movimiento y varios→cero/uno→mismos varios.

Axioma debe retestar el ZIP exacto: giro, pausa de pose y cámara, REDUCED/NONE, encuadre accesible, registro de pares y detección sobre cuerpos animados; teclado/touch, 320/390/1440 y texto al 200%. Verificar suspensión con pestaña oculta; no confundir el throttling del navegador con una política implementada por la app.

Los resultados de pruebas adjuntos son evidencia de Claude. No se ha ejecutado aquí Chromium, lector de pantalla, móvil físico ni prueba de rendimiento. Integridad y análisis de funciones no son PASS de runtime ni de locomoción biológica. Senda/Astra conservan la revisión factual y visual de los trece.

## Entrega siguiente

Patch sobre esta base: P01 giro/pose, P02 movimiento reducido, P03 copy del encuadre y continuidad de candidatos ya solicitada. Conservar diseño, assets, datos de zonas y la navegación que María valora positivamente.

ZIP nuevo con hash/manifest y una grabación breve que muestre giro en ambos sentidos, pausar a mitad de onda, continuar sin salto y diferencia visible NORMAL/REDUCED/NONE. Evitar una nueva ronda de storyboard.

PATCH ACOTADO → AXIOMA RUNTIME EXACTO → HUMAN QA MARÍA.
NO MAIN · NO PUBLIC DEPLOY.
