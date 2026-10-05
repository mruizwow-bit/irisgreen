# Nexo · Peces R02_1_2_1 · cierre de residuos A/B

Fecha: 2026-10-05 · Issue #323
Estado: NEXO_MARINE_R02_1_2_1_PATCH_READY_FOR_AXIOMA

## Artifact exacto recibido

- Nombre adjunto: descubrimiento-peces-R02_1_2_1.zip. Versión interna declarada por Claude: R02_1_2.
- SHA256: a5a39e5d5de8369cfb0bf392dbeab6d20c66720128c094b5261517466f729717
- Tamaño: 27 807 530 bytes.
- Library: libfile_342c41a079e88191af22e39aed69ceb5
- File ID: file_000000002ad08210b4a0d5bca50da7e5
- 77 archivos; 76/76 entradas del manifest verificadas independientemente; ZIP CRC correcto.
- Sintaxis JS producto: 4/4.
- 26/26 PNG de animales idénticos a la entrega anterior.

Vídeo:
- descubrimiento-peces-R02_1_2_1.mp4
- SHA256: d47f5d4d520328657112a8410409bffb09b18290e9aeed6290c07b6e314b26ad
- Library: libfile_f1a6b634f04881918e82565c36b99879
- 1 307 269 bytes; 40.16 s; H.264 1280×800, 25 fps.
- Idéntico byte a byte al vídeo interno. La revisión de recepción verifica identidad y metadatos; no declara valoración perceptual de esta grabación.

## A · Cámara: corrección confirmada en lógica

detenerCamara cancela animCam conservando estado.camara.
pausar(true) lo ejecuta antes del retorno temprano; congelar(true), usado por Examinar, también lo ejecuta.
Reproducción independiente Nexo con funciones originales del ZIP, RAF controlado y dibujo/DOM simulados:
- Pan × Pausar, Pausar estando ya pausado, Congelar: 3/3.
- Zoom × las mismas tres acciones: 3/3.
- Interrupción a 80 ms: cámara idéntica antes/después, animCam=null y cero callbacks pendientes.
- Reanudar en los seis casos no revive el destino.
Valores de fixture: pan x=0.5666666666666667 se conserva; zoom=1.0555555555555556 se conserva.
Resultado A: CLOSED_AT_LOGIC_RETEST, pendiente de comprobación del recorrido en navegador por Axioma.

## B · Candidatos múltiples: corrección confirmada en lógica

pintarCandidatos reconcilia nodos por ID y refresca siempre texto/aria-label; aplicarIdioma llama también a pintarCandidatos.
Reproducción independiente con función original y DOM mínimo:
- Dos candidatos con mismos IDs, ES→EN y posición izquierda→derecha: ambos botones conservan identidad y actualizan texto/nombre accesible.
- Secuencia 2→0→2: 2,0,2 botones; sin residuo de firma.
Resultado B: CLOSED_AT_LOGIC_RETEST.
Conservar nodos es una condición para conservar foco, pero este doble no certifica foco del navegador.

Se acepta la aclaración de Claude: cambiar idioma mediante un diálogo mueve legítimamente el foco al modal y lo devuelve a su disparador al cerrar. El criterio es que un refresco de la rejilla no destruya el control enfocado, no impedir la gestión de foco del modal.
El copy simplificado ES/EN queda KEEP.

## Regresión limitada y evidencia

Banco qa-funciones-node.js ejecutado por Nexo: 6/6 PASA (giro, suelo de dibujo, de canto, perfiles y onda).
Se mantienen natación corregida, REDUCED propio, pose congelada y encuadre explícito.
Se conserva escena, navegación, diseño y assets. No se solicita otro rediseño ni un tercer patch a Claude en esta recepción.

Claude entrega ocho suites y resultados de navegador. Son evidencia del autor:
- Nexo NO ha ejecutado Playwright/Chromium en este retest.
- qa-camara-y-candidatos prueba zoom desde la interfaz, reanudación y dos candidatos; el caso de resize comprueba estructura del texto y nodos/foco, no compara por sí solo una posición anterior y posterior distinta. El cambio efectivo de posición sí fue comprobado aquí en lógica.
- Su ejecutor usa una ruta Chromium propia y no propaga todos los fallos como exit code. Axioma debe inspeccionar resultados/assertions, no inferir PASS sólo por salida cero.
- No equiparar estas pruebas a conformidad global.

## Siguiente orden Axioma

Retestar el artifact SHA a5a39e5d5de8369cfb0bf392dbeab6d20c66720128c094b5261517466f729717.
Prioridad: A/B en navegador, pan y zoom interrumpidos por Pausar/Examinar, estado ya pausado, Continuar sin destino resucitado, dos candidatos reales con cambio de idioma/posición y foco estable.
Conservar el alcance de la QA funcional vigente. Distinguir cobertura real de lector de pantalla, táctil, navegadores y rendimiento.
Emitir su propio gate; este informe no es AXIOMA PASS.

Después HUMAN QA MARÍA: percepción de natación, exploración del entorno, luz y facilidad de identificar.
No se declara HUMAN QA PASS.

## Coordinación de integración

María informa el 2026-10-05 que las imágenes de Cielo y Peces están terminadas. Sustituye el antiguo pendiente de 40; disponibilidad de producción no equivale a validación factual/visual de cada paquete.
El área Descubrimiento (portada, Para todos, Plus y fichas) la crea Claude Design según orden 6c2170874269cff439fe44bf2e70218b2c25a69c; Prisma integra y conecta el runtime final.
La expansión del catálogo se hace tras validar el prototipo, con manifiestos y asignación correcta a hábitat/zona; sin regenerar assets ni introducir todo en mesopelágico.

AXIOMA EXACT ZIP RUNTIME RETEST → HUMAN QA MARÍA → integración según orden vigente.
NO MAIN · NO PUBLIC DEPLOY.
