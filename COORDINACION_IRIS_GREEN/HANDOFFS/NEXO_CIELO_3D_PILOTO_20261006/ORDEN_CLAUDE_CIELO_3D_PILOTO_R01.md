# Nexo · Orden a Claude Design · Cielo 3D · piloto R01
Fecha: 2026-10-06. Autorización de María: «vamos con la prueba del 3d de cielo».
Estado: ORDER_READY. No implica prototipo construido ni QA PASS.
NO MAIN · NO PUBLIC DEPLOY · NO MODIFICAR MASTERS.
Trabajar sobre una copia aislada, en rama existente si se usa repositorio; no crear ramas adicionales.

## 1. Objetivo y alcance
Construir un prototipo EJECUTABLE para comprobar si orientar un cielo continuo resulta más intuitivo y cómodo que la experiencia actual. No basta storyboard, vídeo ni canvas de diseño.
Un observador fijo dentro de una esfera celeste, con giro de vista y zoom. No vuelo entre estrellas, traslación del observador, paralaje inventado, planetas decorativos ni paseo espacial.
Primer recorrido: campo de Orión y una zona adyacente con datos existentes, conectados espacialmente sin salto de campo. Seleccionar esa vecina tras leer el inventario real y declarar cuál y por qué. No producir 88 experiencias nuevas.
Es una representación direccional: radio gráfico común no significa igual distancia física de las estrellas.
No se necesita un modelo de Meshy para el cielo. Usar coordenadas y assets astronómicos existentes.

## 2. Intake obligatorio
Base conocida: DESCUBRIMIENTO_CIELO_COMPLETO_R02.zip
SHA256: 581368ff4b2db0208274f3d8cca65f4973b64a4038e4c15b209a8591cd814cfa.
Leer la orden canónica R02.1:
COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CIELO_COMPLETO_R02_20261006/ANALISIS_R02_Y_PATCH_R02_1.md
Si existe un patch posterior, registrar versión/hash y correcciones efectivamente presentes. No afirmar que R02.1 está entregado o aprobado sin comprobarlo.
Usar catálogo, figuras, límites, fichas, fuentes, fuentes tipográficas y masters del paquete. Registrar procedencia y versiones. No sustituir estrellas por puntos aleatorios ni generar nuevas constelaciones.
Si falta el ZIP, pedir ese paquete concreto; el enlace a una orden no sustituye los binarios.
Esta autorización permite el piloto paralelo, antes del cierre de R02.1. No sustituye ese cierre ni permite heredar sus bugs.

## 3. Primera experiencia
Portada: «Empezar a explorar». No nombre ni figura de Orión como spoiler.
Entrada: cielo protagonista, estrellas sin nombres ni líneas, pista «Busca tres estrellas brillantes casi en línea».
Explorar → señalar patrón → localizar → revelar opcionalmente figura → profundizar → volver al mismo lugar.
Localizar muestra el cinturón y entonces su nombre. «Ver la constelación» revela las líneas sobre las mismas estrellas. La ficha utiliza los assets existentes y contenido documentado, sin panel vacío.
El hallazgo actual conserva su contexto. La siguiente pista aparece tras Continuar; no mientras se lee el hallazgo.
Permitir encontrar la vecina fuera de orden, sin forzar una secuencia de acertijos.

## 4. Interacción principal
Ratón: arrastrar orienta la vista; clic directo selecciona la zona o punto señalado; rueda amplía alrededor del punto señalado, con límites.
No mover cámara con hover. No exigir llevar el cielo a una retícula central. No convertir una cruceta de botones en interacción principal del ratón.
Touch: arrastrar orienta; tap selecciona; pinza amplía alrededor de su centro. Distinguir tap/drag por desplazamiento, no descartar pulsación quieta por durar más de 420 ms.
pointercancel cancela sin seleccionar. Pinza→un dedo reinicia el origen del pan, sin salto ni tap residual.
Teclado con escena enfocada: flechas orientan, +/− zoom, Enter examina zona de referencia; ayuda breve y alternativa accesible visibles cuando se necesitan. No interceptar flechas fuera de escena.
Ofrecer controles simples alternativos para zoom y orientación a quien no use drag; secundarios, sin seis botones dominando la experiencia.
Identificar no desplaza cámara, no centra automáticamente ni cambia zoom. Cancelar interpolación pendiente en la posición visible.

## 5. Geometría y evidencia
Transformación única de coordenadas celestes a direcciones 3D, usada por dibujo, selección, marcadores y figuras. Declarar convención de ejes y comprobar orientación con coordenadas reales; evitar cielo espejado.
INPUT_TOLERANCE_PX facilita adquirir un objetivo. EVIDENCE_APERTURE_ANGULAR determina evidencia astronómica. No sumar estrellas por tener pantalla pequeña o target grande.
Definir radio/diámetro angular y política de zoom explícitos. En igual punto, orientación, apertura y evidencia visible: misma decisión a 320/390/1440.
Orión requiere tres estrellas del cinturón visibles y su relación espacial; 1/3 y 2/3 no identifican tres alineadas. Vecina: subpatrón documentado, mínimo propio. No normalizar escasez de evidencia a 100%.
No contar estrellas detrás de cámara, horizonte u oclusiones. Ambigüedad se comunica y permite elegir, sin identificar arbitrariamente.
Horizonte sólo si existe una transformación coherente con el preset. No inventar fecha/hora/lugar ni presentarlo como «tu cielo ahora». Si no hay datos suficientes, usar vista celeste curada sin horizonte factual.

## 6. Confort, formato y canon
Sin giro automático, inercia prolongada, oscilación, balanceo, roll de cámara, giroscopio, sonido automático ni flashes.
NORMAL: orientación controlada sin deriva al soltar.
REDUCED: respuesta reducida sin recorridos largos.
NONE: actualización directa o pasos discretos por acción, sin interpolación; conserva orientación, selección y hallazgos al cambiar modo.
La preferencia no reduce precisión del puntero. La elección explícita prevalece sobre sistema.
Cielo visible prioritario, una pista y acción contextual próxima. Medir intersección real del cielo con viewport; no confundir altura total del canvas con área visible. Objetivo 70% útil sin recortar controles/texto.
En móvil profundidad debajo del cielo; en escritorio panel reservado sin tapar objetivo. Cerrar devuelve mismo encuadre/foco.
NAVY exclusivo:
fondo #0B1A2B; panel #15304A; superficie #1D3D5C; texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA; foco/acento #C3B8FF; bordes #8494A8; separadores #2A4460; botón #DCE8F2 con texto #0B1A2B.
Atkinson Hyperlegible cuerpo 16px/1.6; Newsreader títulos 600/1.2; portada 400,40–56px/1.06. Fuentes locales. ES/EN.
Targets >=44px, foco independiente de selección, anuncios moderados, texto al 200%, forced-colors para interfaz y alternativa operable al canvas. Definir foco al cambiar pantalla y conservarlo en resize.
En móvil debe poder salirse de la escena para desplazar la página; comprobarlo, no cubrir toda la navegación con captura de gestos.

## 7. Rendimiento y degradación
Dependencias locales, sin CDN ni peticiones externas al abrir. Cargar sólo lo necesario para las dos zonas. Medir dispositivo/viewport/DPR/duración y consumo de recursos; no llamar «móvil real» a emulación.
Detener render continuo cuando no hay cambios, al ocultar pestaña y al salir; liberar recursos. No perder estado al pausar.
Si WebGL no funciona o se pierde contexto, mensaje comprensible y recuperación/retorno a la experiencia existente cuando esté incluida. No prometer un fallback que no viaje.
Preferencia de entrega: abrir index.html tras extraer, sin instalación. Si el motor exige servidor, explicar y suministrar un método concreto antes de declarar listo para María; no dejarla resolviendo dependencias.

## 8. Pruebas que deciden el piloto
- Recorrido real sin inyectar cámara: entrar, orientar, clic fuera del centro, localizar, revelar, ficha, volver, llegar a vecina.
- Mismas direcciones/evidencia a 320/390/1440; negativos Orión 1/3,2/3 y positivo3/3.
- Clic lento, cancelación, drag sin selección, pinch→un dedo, rueda anclada, teclado sin ratón.
- NONE y cambio de modo sin salto; salir durante animación/carga sin panel obsoleto.
- Foco pantalla/panel/resize y reflow interno200%, no sólo scrollWidth.
- Dos zonas sin costura ni salto de orientación; estrellas compartidas sin duplicados.
- Separar pruebas unitarias/fixtures, navegador automatizado, dispositivo real y juicio humano.
HUMAN QA María: ¿puedes señalar lo que quieres directamente?, ¿sabes cómo continuar?, ¿orientar resulta cómodo?, ¿aporta frente al actual? No se aprueba 3D sólo por tener más profundidad o pasar tests.

## 9. Entrega
CIELO_3D_PILOTO_R01.zip ejecutable, SHA256 y manifest; README breve; inventario/procedencia; decisiones y pendientes; pruebas reproducibles; vídeo de recorrido real escritorio y móvil claramente etiquetado.
Conservar referencia 2D para comparación, sin sobreescribirla. Capturas derivadas del ejecutable; el canvas es sólo vista previa.
Gate de entrega esperado (no emitido): CLAUDE_SKY_3D_PILOT_R01_READY_FOR_REVIEW.
Después Nexo/Prisma revisión técnica → Axioma interacción/accesibilidad → HUMAN QA María.
No extender a las 88 ni a otros descubrimientos hasta decidir si este piloto aporta.
