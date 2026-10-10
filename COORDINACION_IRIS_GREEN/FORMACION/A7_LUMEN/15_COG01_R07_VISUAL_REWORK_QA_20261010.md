# LUMEN · COGNITIVO 01 · R07 ARTE Y RUNTIME DE REVISIÓN

Fecha: 10/10/2026  
Estado: `COG01_R07_FUNCTIONAL_VERIFIED__VISUAL_HUMAN_REVIEW_REQUIRED__NEXO_MASTERS_NOT_INTEGRATED`.

## Causa
La usuaria rechazó visualmente la R06 porque se mostraban iconos verdes de forma estrellada, demasiado pequeños, y opciones ocupando la primera pantalla. La acción correctiva fue trabajar sobre la R06 funcional, sin alterar el requisito de dificultad individual (sin edades), estaciones, versión ES/EN, ISO 24495-1, teclado/touch/ratón, pausa y privacidad.

## Acciones reales
- Se extrajeron seis hojas con nervaduras y bordes de la **lámina de Nexo facilitada por la usuaria**. Esta extracción es solo referencia/prototipo, NO masters aislados originales ni aprobación artística.
- Banco de 6 familias × 8 variantes morfológicas × 6 tratamientos cromáticos = **288 WebP** (3,242,018 bytes); verde primavera/verano, amarillo, naranja, rojo, marrón. Los cambios de estación NO son una afirmación de especie.
- Runtime R07 mantiene 4/6/8/9/12 opciones (Suave, Media, Alta, Experta, Maestría) + automática; en Maestría 3 respuestas para 2 modelos; el color no es una pista. Se corrigió la ampliación automática a 8 opciones que antes podía generar solo 6.
- Interfaz reorganizada: configuración colapsada en «Opciones», referencia visible durante el scroll, dos muestras ampliadas en móvil, tarjetas grandes y sin superposición del botón de reinicio sobre respuestas.
- `index.html` autónomo, 4,379,495 bytes, imágenes codificadas dentro; `index_local.html` de desarrollo con sprites en assets; ambos offline.
- No se creó otra portada ni imagen genérica. No Netlify. No alteración de producción.

## QA de verdad
- Chromium y Playwright: `qa_r07.py` **55/55**; 4500 ensayos generados y validados, 320×800, 390×844, 1440×900, controles >=44px, sin overflow horizontal, opciones, zoom, pausa, idiomas, alta/experta/maestría, ayudas, contraste.
- Chromium: `qa_end_to_end.py` **18/18**; doce rondas completas, revisión tras error, cierre/reinicio, forced-colors y reduced motion.
- `node --check game.js` PASS. Verificación ZIP: PASS. Hashes internos `SHA256SUMS.txt`.
- Capturas reales Chromium: `captura_R07_320.png`, `captura_R07_390.png`, `captura_R07_1440.png`.
- No hay validación perceptiva infantil/adulta del banco de hojas, ni pruebas de lector de pantalla hardware, ni validación GPU física móvil. No declarar HUMAN QA PASS o publicación.

## Entrega
Paquete `IRIS_GREEN_COG01_EL_CLARO_ESCONDIDO_R07_JUGABLE.zip`  
SHA-256: `99609710d60e863f583580cda65ebb7030ac323b75218f6e15d5923a33cd83dc`  
Library: `/Iris Green/Handoffs/Lumen/IRIS_GREEN_COG01_EL_CLARO_ESCONDIDO_R07_JUGABLE.zip`.

## Gate pendiente
Recibir masters separados de Nexo; sustituir solo los recortes provisionales sin tocar la mecánica; validar perceptivamente contornos expertos y revisar la composición en HUMAN QA antes de declarar VISUAL_KEEP.
