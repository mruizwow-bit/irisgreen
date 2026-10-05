# Nexo · Área Juegos · R01_3 · frame incorporado

Fecha: 2026-10-05. Issue #369.
Estado: NEXO_CLAUDE_DESIGN_GAMES_R01_3_FRAME_INTEGRATED_READY_FOR_AXIOMA.

## Identidad

Archivo: CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3.zip.
SHA256: 6dc3e7e94804357f85daaf538a65a27a1afbc60e0498f92ee492324db6fa2af5.
Tamaño: 7750089 bytes.
Biblioteca: libfile_8398f67e6ac481919e0b29806df3e903.

CRC correcto y sidecar SHA256 coincidente.
Recuento real: 75 archivos dentro del ZIP, 74/74 entradas de HASHES.txt y 73/73 hashes en MANIFEST.json. La diferencia obedece a las exclusiones de los archivos de inventario; el mensaje de entrega decía 74 archivos. Corrección documental de recuento, no defecto que requiera regenerar este ZIP.

## Verificación independiente

- Ejecutado tools/verificar_entrega.py sobre la extracción: 16/16.
- HASHES.txt: 74/74.
- Manifest: 73/73.
- Los tres PNG F01 OBJETIVO 1440/390/320 se comparan además con los binarios recuperados del artifact final 11348661943: 3/3 idénticos.
- Procedencia correcta: run 37318454037, artifact 11348661943, inner ZIP f2d4503945e96941b51f953ed8e3fa6decbf6d5dfe6e53acfa71f6c484082853, QA commit 8ab82d7bef0054c46ae365be3ea62494a5970060.
- Fuente: AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA. Es el gate del storyboard fuente; no equivale a aprobar toda la web ni el juego ejecutable.
- PNG 1440 integrado en los once frames señalados de J01/J02/J03/S04/S05; variantes pequeñas incluidas como referencia.
- Se conserva estado inicial sin cruce resuelto. Copy Vista del prototipo. S04 conserva Jugar · no disponible todavía.
- NAVY y estructura de exportación se conservan. No se abre otra corrección del style/fonts/support.js ya resuelta en R01_2.

## Revisión visual

Inspeccionadas portadas J01 320 y 1440 dentro del ZIP y el adjunto 320.
Se ven ambas orillas, caja y parcela bloqueada. La imagen no aparece recortada ni deformada en esas muestras.

Los adjuntos sueltos no son binariamente idénticos a los PNG del ZIP:
- 320: adjunto 504×2048 RGBA; ZIP 640×2600 RGB.
- 1440: adjunto 2048×1649 RGBA; ZIP 2880×2320 RGB.
No usar los hashes de uno para identificar el otro. Para QA canónica manda el paquete y sus PNG; no se trata esta diferencia de tamaño/formato como defecto del paquete.

En 320, «Elige por dónde entrar» queda antes de la marca del primer viewport, pero el CTA Entrar queda más abajo. Mantenerlo como punto concreto de HUMAN QA: comprobar si María entiende dónde entrar y encuentra el acceso con scroll. No se ordena otra ronda de diseño por esta observación ni se exige recortar la imagen aprobada.

Las marcas de viewport, reserva Sabik y notas son anotaciones del entregable de diseño. No deben aparecer como texto de producto cuando se implemente la página.

## Límites de la evidencia

Repetir el verificador no equivale a repetir el render. Su comprobación de overflow consulta RENDER_EVIDENCE.md; no abre un navegador. Contar style tags no demuestra validez completa de CSS. Los tests de ausencia de determinadas cadenas tampoco son certificación de accesibilidad ni de funcionamiento.

No se ha renderizado de nuevo Chromium en esta sesión. Se han verificado estructura, hashes, script estático y muestras visuales entregadas.

La entrega sigue siendo diseño del área Juegos, con HTML editable/portable y capturas. No demuestra una web integrada con navegación funcional ni sustituye el runtime jugable que lleva Prisma por separado.

## Siguiente paso

Incorporación del frame: CERRADA en esta revisión.
No pedir a Claude que vuelva a traer, redibujar o insertar la imagen.

Axioma: revisar este ZIP exacto, portable, composición, nombres/alt, contraste, lectura a 320/390/1440 y anotaciones separadas del producto. Distinguir lo estático de lo que sólo puede validarse al implementar el runtime.

Después HUMAN QA MARÍA sobre área Juegos; verificar facilidad de acceso a categorías a 320 y comprensión de Vista del prototipo.

No reabrir assets, no activar Jugar ni pagos, no mezclar con la autorización separada del prototipo Construcción.
NO MAIN · NO PUBLIC DEPLOY.

Registro canónico publicado. No implica activación automática de sesiones externas ni que el binario esté adjunto a GitHub.
