# Nexo · recepción del patch Cielo Orión R01

Fecha: 2026-10-05
Issue: #323
Estado: NEXO_SKY_ORION_R01_PATCH_READY_FOR_AXIOMA
Rama documental: nexo/new-games-area-r01-20261004
No es un gate de Axioma ni HUMAN QA PASS.

## Artifact exacto

- Adjunto: CIELO_ORION_INTERACTIVO_R01(1).zip
- SHA256: 2e036ce4c3e3984be09d2c0ba630470f2129be49738960ec070bffa756d0026c
- Tamaño: 6 874 681 bytes.
- Library: libfile_d950b1c4f6bc8191a470f80a1e97f08b
- Archivo recibido: file_00000000bb408243947998afad97f0b2
- 42 archivos; 41/41 entradas de MANIFEST_SHA256.txt verificadas independientemente.
- ZIP CRC correcto. Sintaxis de 5 JS del producto y del banco: 6/6.
- Sustituye para revisión al ZIP 1e33f4ba03e22670fb56444e34a4709f147e374ef0cb935ef8b08ff561604931.

## Resultado de recepción

KEEP. Los tres cambios solicitados están implementados; se retira el bloqueo de entrega a Claude y se pasa a retest independiente de Axioma. No se solicita otro rediseño.

P01 — Cámara:
congelarCamara cancela el RAF pendiente en la posición interpolada visible; examinar y revelar la invocan antes de resolver la acción.
Nexo ejecutó las funciones originales extraídas del ZIP en Node, con RAF controlado y DOM/geometría simulados: cuatro casos, Examinar/Revelar × pan/zoom a 80 ms. En los cuatro, cámara idéntica antes/después y cero callbacks pendientes. Esto verifica la cancelación lógica, no sustituye el navegador ni prueba la geometría real.

P02 — Foco:
examinar('boton') lleva el foco a btn-revelar cuando se oculta Examinar; examinar('escenario') lo conserva en el escenario. La zona incorrecta retorna antes de mover el foco. Wiring de click/Enter revisado. Claude aporta T16a/b/c con teclado real; Nexo no ha reejecutado esas pruebas en navegador.

P03 — Móvil:
preset en cabecera, espacios compactados, etiqueta Idioma visualmente oculta pero conservada como nombre del grupo, escenario a clamp(300px,68vh,720px). El canon CSS y las fuentes son byte a byte idénticos al R01 anterior.
Capturas entregadas inspeccionadas: 390-despues-de-identificar y 320-antes-de-identificar. Cielo protagonista, panel móvil debajo y canon NAVY conservados. En 320×568 Examinar empieza al borde inferior y requiere scroll; queda como observación de HUMAN QA, no un nuevo bloqueo automático.
Los porcentajes publicados son medidas de Claude, no mediciones de Nexo. Distinguen viewport, viewport sin cabecera y documento sin cabecera. El 93 % a 320 no implica que ese porcentaje del cielo esté visible simultáneamente: la escena rebasa el viewport. El 58 % del documento tampoco equivale al objetivo del viewport. No se fuerzan porcentajes reduciendo texto o controles.

## KEEP comprobado por comparación binaria

Sin cambios en motor.js, config.js, datos-cielo.js, copia.js, JSON astronómico, procedencia, assets originales, licencias, canon NAVY ni fuentes incrustadas. Se mantienen inversión de ejes, etapas de identificación/reveal y materiales existentes. No hay segunda constelación.

## Banco y alcance de evidencia

- resultados.json entregado: 41/41 OK, evidencia del autor Claude.
- RAIZ resuelta desde __dirname; Chromium Playwright por defecto, PW_CHROMIUM opcional.
- Recorrido principal de teclado usa page.keyboard (Tab, flechas, Enter, Espacio, Escape), sin escribir IG_DEBUG.estado.camara.
- El resto del banco conserva clicks programáticos y lecturas internas; no debe describirse todo el banco como interacción humana.
- T15a prueba congelación durante pan desde la entrada, por tanto no cubre por sí solo una identificación acertada en tránsito ni zoom.
- T15b prueba reinicio, aunque el comentario anterior del script menciona revelar. No es evidencia de reveal durante transición.
- Axioma debe cubrir explícitamente identificación correcta y reveal durante pan y zoom en navegador; continuidad de foco; móvil y reflow.
- El 200 % entregado aumenta font-size raíz, no equivale al zoom del navegador ni demuestra que sea universalmente más exigente.
- Nexo no ha ejecutado Chromium ni el banco de navegador. No se declara conformidad de accesibilidad.

## Siguiente orden

Axioma: retestar el ZIP de este SHA exacto. Revisar las correcciones señaladas, completar los casos de cámara de arriba y comprobar teclado, foco, reflow y ausencia de revelación prematura.
María: después del retest, probar el ejecutable real; valorar si explorar/encontrar/identificar/revelar se entiende, y acceso a Examinar en móvil.
Lector de pantalla real, dispositivo táctil real, Firefox/Safari y rendimiento modesto siguen sin evidencia aportada.

Secuencia: AXIOMA EXACT ZIP RUNTIME RETEST → HUMAN QA MARÍA.
Se mantiene autorización del prototipo aislado. NO MAIN · NO PUBLIC DEPLOY · NO SECOND CONSTELLATION.
