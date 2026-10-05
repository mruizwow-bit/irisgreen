# Nexo · Cielo Orión interactivo R01 · recepción y patch acotado

Fecha: 2026-10-05. Issue #323.
Estado: NEXO_SKY_ORION_R01_RECEIVED_TARGETED_PATCH_REQUIRED.
Autor de implementación: Claude Design. Nexo revisa integridad, código, geometría y capturas entregadas; Axioma debe verificar el runtime real.

## Paquete exacto

- CIELO_ORION_INTERACTIVO_R01.zip
- SHA256: 1e33f4ba03e22670fb56444e34a4709f147e374ef0cb935ef8b08ff561604931
- 6795305 bytes.
- Biblioteca: libfile_28e4e444a1408191b3f1154261ef8095.
- 42 archivos; 41/41 hashes verificados tras extraer, excluido el manifest. CRC correcto.
- Sintaxis JS: 5/5.
- JSON estelar, provenance_A01.json, horizonte y referencia de profundidad idénticos byte a byte al handoff.
- Los tres WOFF2 embebidos en base64 coinciden con los tres binarios sueltos.
- Round-trip de datos-cielo.js contra JSON: coincide. Filtro: 161 estrellas.

El registro no equivale a adjuntar el ZIP a GitHub. Otra sesión necesita recibir este binario y verificar su hash.

## KEEP

- Prototipo ejecutable aislado, datos/motor/interfaz separados, NAVY, archivos y fuentes locales.
- Pan, zoom, retícula central fija y examen explícito. No traslado de la mecánica de linterna de Peces.
- Identificación del cinturón separada de la acción de revelar Orión completo.
- Transformación compartida por estrellas y líneas; selección usa las coordenadas transformadas.
- Orientación corregida respecto al raster R02. Comprobación geométrica independiente: Betelgeuse a la izquierda y arriba de Rigel en la convención norte-arriba usada por el prototipo. JSON intacto. No volver al espejo por continuidad de capturas; no selector de espejo.
- Campo finito, sin repetir estrellas ni añadir una segunda constelación.
- Panel inferior en flujo en móvil: conservar esa solución si permite observar el patrón y leer; no imponer superposición que lo tape.
- NONE mantiene las acciones. No bucle de animación continuo en reposo por diseño del código.
- Capturas entregadas de entrada 1440 y reveal 390 inspeccionadas; no son capturas renderizadas independientemente por Nexo.

La orientación queda registrada aquí como aclaración de la orden tras la consulta mostrada por María. Referencia astronómica consultada previamente: ESA CESAR, https://cesar.esa.int/upload/201911/10-12_yr_constellations_last.pdf. Norte-arriba es una convención de representación; no se afirma que ésa sea la orientación instantánea de cualquier observador. Se mantiene CURATED_OBSERVATION_PRESET.

## P01 · Cámara aún animándose al identificar

Defecto confirmado en la lógica original. examinar() no cancela irA() ni sus callbacks pendientes. Si se pulsa Enter durante un desplazamiento cuando el patrón está en la retícula, se identifica y la cámara continúa avanzando.

Reproducción independiente en Node: funciones originales irA/cancelarAnimacion/examinar, motor y datos originales, cola requestAnimationFrame controlada y presentación sustituida por funciones vacías. Es una prueba de lógica, NO una ejecución de navegador.

- Animación NORMAL de 260 ms.
- Examinar en t=80 ms: etapa pasa a localizada, sigue un frame pendiente.
- u al identificar: 0.023837355484751938.
- u tras completar el callback: 0.037110000000000004.
- v y zoom no cambian; u sí cambia después de identificar.

Patch: congelar la transformación exactamente en la posición visible de la acción y cancelar el movimiento pendiente antes de evaluar/fijar el hallazgo. No saltar al destino final. Aplicar la misma consistencia al reveal y apertura de profundidad si hay movimiento en curso. Reanudar navegación únicamente con una nueva acción.

Retest: NORMAL y REDUCED, Enter durante pan y zoom; tras identificar/revelar no queda animación pendiente y cámara/zoom permanecen idénticos al fotograma examinado.

## P02 · Foco del botón Examinar

pintarMensaje() oculta btn-examinar al identificar. Si la persona lo activó con teclado, el control enfocado desaparece y el código no asigna continuidad de foco. La ruta Enter desde escenario no cubre este caso.

Patch: cuando la acción viene del botón que va a ocultarse, llevar el foco de forma deliberada a «Ver Orión completo» ya visible o a un destino estable equivalente. Si se examina con Enter desde el escenario, conservar allí el foco salvo razón explícita de producto. No robar foco durante simples cambios de texto.

Axioma debe confirmar el comportamiento real: Tab hasta el botón, Enter/Space para examinar, siguiente paso y cierre de profundidad, sin focus() de ayuda ni click() de DOM en el banco. La rama defectuosa se identifica por lectura de código; Nexo no declara haber reproducido pérdida de foco en navegador.

## P03 · Composición móvil

La entrega declara 61% a 390 y 51% a 320 frente al área de experiencia sin cabecera. Son métricas del autor, no medición independiente. El 70% era un objetivo de diseño y no autoriza reducir legibilidad o targets.

Patch de composición: compactar espacios y agrupar idioma/movimiento/fuentes/reinicio en opciones accesibles desplegables; conservar objetivo, cielo, navegación y Examinar como flujo principal. No reducir el cuerpo por debajo del canon ni targets <44 px. A 200% de texto se mantiene reflow y scroll vertical; no perseguir un porcentaje a costa de acceso.

Definir y reportar una única métrica para el estado de exploración y la parte de cielo realmente visible en el primer viewport. El cociente cielo/documento sin cabecera usado en el informe no equivale por sí solo a cielo visible/viewport útil. Comparar las mismas medidas antes/después a 320×568 y 390×844. Una altura CSS mayor por sí sola no demuestra mejor composición.

No rehacer astronomía, assets o interacción por este ajuste. Mantener panel inferior si ayuda a conservar el patrón.

## Evidencia y banco de pruebas

33/33 son resultados entregados por Claude, no 33 verificaciones independientes de Nexo.

Limitaciones concretas del banco:
- RAIZ está fijada a /home/claude/build/CIELO_ORION_INTERACTIVO_R01 y el navegador a una ruta de su entorno. Hacer RAIZ relativa a __dirname y permitir configurar el ejecutable para poder repetirlo tras extraer.
- LLEVAR escribe directamente IG_DEBUG.estado.camara; sirve como fixture geométrico, no prueba que alguien encuentre el patrón mediante los controles.
- T08 usa focus(), KeyboardEvent sintético y click() DOM en parte del flujo. No demuestra recorrido completo con teclado real. Conservarlo como prueba de lógica, añadir recorrido con page.keyboard sin teletransportar cámara.
- T09b llama «inmediato» a haber cambiado algo tras 20 ms, no a haber acabado la transición. No prueba que NORMAL y REDUCED sean iguales a NONE. Medir progreso y finalización separados.
- Texto raíz a 32px no equivale a zoom de navegador al 200%; no afirmar que sea universalmente más exigente.
- La decisión de fuentes base64 es válida para portabilidad local; limitar el diagnóstico sobre bloqueo de fuentes a la configuración de Chromium realmente probada, sin generalizar a todo Chrome/file://.

Sin repetir aquí: navegador real, lector de pantalla, teléfono físico, Safari/Firefox y rendimiento modesto. En esta sesión no hay un binario Chromium local disponible para repetir el banco.

## Entrega siguiente

Claude: patch P01/P02, composición P03 y banco portable; ZIP nuevo con hash/manifest y evidencia de los casos exactos. Preservar datos, assets, orientación, NAVY y fuentes.

Axioma: recibir binario exacto, retest de esos casos y cadena explorar → localizar → identificar → revelar → profundidad → volver. Comprobar también correspondencia entre lo visible y lo descrito por la vía accesible.

María: probar el producto real. No se emite HUMAN QA PASS desde capturas o tests.

Secuencia: PATCH ACOTADO → AXIOMA RUNTIME → HUMAN QA MARÍA.
NO MAIN · NO PUBLIC DEPLOY · NO SECOND CONSTELLATION.
