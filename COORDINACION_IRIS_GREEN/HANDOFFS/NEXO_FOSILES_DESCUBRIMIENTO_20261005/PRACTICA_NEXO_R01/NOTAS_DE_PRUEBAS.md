# Evidencia de Nexo R01 · 2026-10-05

## Ejecutado

1. Sintaxis JavaScript: app.js, model.js, assets/data.js.
2. `node pruebas/model.test.cjs`: seis grupos correctos. Catorce identidades/rutas únicas; máscaras independientes; repetición sin progreso ficticio; los catorce indicios empiezan sin identificación y pueden llegar al umbral; transformaciones inversas; encuadre completo de todas las piezas; límites del mundo.
3. `pruebas/runtime-fixture.cjs`: ejecuta **el app.js entregado** con un DOM mínimo simulado y Canvas nativo. Tres cajas de escena: 286×360, 356×464 y 850×560. No representan una medición del CSS a 320/390/1440.
4. En cada caja se completa la ruta por pasos de los 14 fósiles. No hay identidad antes de despejar y examinar. Se comprueban nombre asociado, guardado sin duplicados, cambio de idioma sin variar la imagen, apertura/cierre de ficha, retorno programado de foco en el simulador, conservación al cambiar de sector y redimensionar. Las imágenes se cargan una vez por ruta: 21 por ejecución.
5. Mover el puntero sin pulsar conserva el dibujo. Arrastrar en Explorar no identifica la pieza. Tras las acciones la cola de render se vacía: el fixture no detecta un bucle autónomo.
6. Inspección de dos renders de **solo el Canvas**: inicio y primer hallazgo. Se ven el indicio parcial y la retirada local alrededor del trilobite. Estos PNG no son capturas de navegador ni demuestran el diseño completo.
7. Comparación binaria de los 14 WebP de fósiles contra la fuente y comprobación de referencias locales del HTML. Manifiesto del paquete verificado tras extraer el ZIP.

El fixture necesita Node y `@napi-rs/canvas` para ejecutarse; la aplicación no necesita Node ni esa dependencia. Opcionalmente `CANVAS_MODULE` puede indicar la ruta al módulo ya instalado. El banco puede ejecutarse desde cualquier carpeta porque resuelve archivos desde `__dirname`.

## Defectos encontrados y corregidos durante la práctica

- El encuadre fijo cortaba piezas altas. Ahora se calcula según las dimensiones de cada pieza y escena.
- El punto de selección antiguo podía sobrevivir al desplazamiento de cámara con teclado. El desplazamiento lo elimina; Enter selecciona el centro actual.
- El zoom de la ficha podía quedar neutralizado por la contracción de flex. La imagen ya no se contrae y su contenedor permite desplazarse.
- La vía por pasos podía despejar una región fuera del encuadre. Ahora pide volver a acercarse al indicio.
- Ayuda quedaba oculta en móvil. El control se conserva y la cabecera permite envolver sus elementos.

## Límites reales

El skill Sites exige el mecanismo control-browser para QA de navegador en este entorno gestionado. No estaba disponible y, siguiendo esa instrucción, no se inició servidor ni se sustituyó por otra automatización de navegador. Esto limita la verificación, no impide entregar el prototipo para probarlo.

Pendientes: apertura real por file://, carga real de fuentes, distribución y scroll a 320/390/1440, zoom de texto 200 %, contraste medido y forced-colors, Tab/Enter reales, Escape y aislamiento real del diálogo, lector de pantalla, táctil, Safari/Firefox, rendimiento móvil y valoración de María.

El fixture no implementa layout ni accesibilidad del navegador. Sus aserciones de foco comprueban llamadas de la aplicación, no navegación Tab nativa. No se afirma cero errores de consola, cero peticiones de terceros medidas ni cero desbordamientos reales: únicamente hay recursos locales y no hay código de acceso a red en la implementación.

## Primera prueba de producto

Abrir index.html tras extraer. Sin leer instrucciones técnicas: ¿se entiende dónde actuar?, ¿retirar cobertura produce un resultado claro?, ¿se distingue mover la vista de despejar?, ¿el hallazgo despierta interés por observarlo de cerca? Probar después una pieza alta y un ala; completar por teclado un hallazgo; cambiar de sector y volver.

La vía por pasos tarda entre 4 y 21 pulsaciones según la forma. Puede resultar repetitiva en las alas; queda como cuestión concreta de producto, no como un PASS porque sea alcanzable.

Estado: NEXO_FOSSILS_PRACTICE_R01_DELIVERED_BROWSER_QA_PENDING.
