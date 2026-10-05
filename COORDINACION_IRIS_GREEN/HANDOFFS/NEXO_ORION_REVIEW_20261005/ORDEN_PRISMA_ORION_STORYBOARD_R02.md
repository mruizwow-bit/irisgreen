# PRISMA · DESCUBRIMIENTO · ORIÓN · CORRECCIÓN STORYBOARD R02
Fecha: 2026-10-05. Emisor Nexo. Autorización María: publicar esta orden en GitHub.
Issue de producto: #323. Alcance exclusivo Cielo nocturno / primera experiencia / Orión.
## Fuente canónica
COORDINACION_IRIS_GREEN/MEMORIA/NIGHT_SKY_ORION_STORYBOARD_R01_20261004.md, commit ef6e37abf74bc6b2fdee9634fa0b50fea0e6f44d.
Control COORDINACION_IRIS_GREEN/CONTROL/NIGHT_SKY_ORION_STORYBOARD_R01_20261004.json, commit e548c1867465bb3d3868a7921951d3f63618d8a3.
Revisión Nexo: REVIEW.md y RETEST_UPLOAD_3.md en esta carpeta.
Entregas revisadas: ZIP R01 y R01 (3), con 16 archivos internos idénticos. Contact sheets adjuntos confirman mismos problemas. No pedir a María otra copia de esa entrega.
## Objetivo
Conservar seis estados y contrato ENTRAR → ORIENTAR → OBSERVAR PATRÓN → LOCALIZAR → IDENTIFICAR → REVELAR → PROFUNDIZAR.
NO_REVEAL_BEFORE_SEMANTIC_USER_ACTION.
Corregir composición, continuidad y controles. No rediseñar producto ni producir astronomía nueva.
## Correcciones obligatorias
1. F01-F04: eliminar grandes regiones geométricas oscuras y halos que cubren o destacan una silueta sobre estrellas. Entregar campo limpio y legible. No intentar tapar líneas de una imagen aplanada creando manchas.
2. Usar datos/capas limpias existentes. Si falta una base limpia reutilizable, identificar exactamente el recurso faltante y presentar solución a Nexo antes de inventar geometría o estrellas. Reutilizar assets aprobados; no modificar masters originales.
3. F03-F05: idéntica base estelar, encuadre, escala y posiciones. F04 añade solo marcas/línea del cinturón; F05 añade líneas completas de Orión. No reemplazar fondo al revelar.
4. F01-F03: sin “Orión”, nombres de estrellas, figura completa, flechas dirigidas, radar o resaltado automático. Prompt: “Busca tres estrellas brillantes casi en línea.”
5. F03: retícula discreta representa la zona que examina el usuario. Cuando el storyboard ilustre selección correcta, las tres estrellas deben quedar dentro de esa región. No retícula que siga o señale automáticamente la respuesta.
6. F04: “Has encontrado tres estrellas alineadas.” Después: “Es el cinturón de Orión.”
7. 390: corregir botón izquierda recortado; todos los controles completos y dentro del viewport, separados de zona de lectura/selección. Targets previstos >=44px; foco y selected diferentes.
8. F05: bottom sheet parcial390 / panel estrecho1440; conservar cielo protagonista. F06: material existente de profundidad; retorno a misma orientación/estado; control de cerrar explícito.
## Restricciones
CURATED_OBSERVATION_PRESET; no “tu cielo ahora”; no fecha/hora/lugar/azimut/altura inventados.
El storyboard no demuestra precisión astronómica: declarar procedencia de cada capa y qué queda pendiente de dataset/preset.
Sin runtime, HTML, segunda constelación, catálogo88, atlas wallpaper o cambios main.
NORMAL/REDUCED/NONE previstos con misma causalidad, no certificar comportamiento mediante imágenes.
## Entrega
NIGHT_SKY_ORION_STORYBOARD_R02.zip: seis frames390 + seis1440, IDs F01-F06; dos contact sheets; README con assets/capas/procedencia, cambios y pendientes.
Añadir comparación F03/F04/F05 que permita verificar continuidad; explicación de controles teclado/touch y adaptación320 sin exigir otro set completo.
Comprobar los 12 frames individualmente antes de entregar: sin manchas, recortes, texto solapado ni revelado temprano.
Registrar rama/commit/archivos y enlace de entrega #323; responder a esta orden con estado real.
Gate de entrega: PRISMA_NIGHT_SKY_ORION_STORYBOARD_R02_READY_FOR_REVIEW.
## Después
STOP. Nexo revisión de correcciones; Axioma accesibilidad/claridad del storyboard; HUMAN QA María.
NIGHT_SKY_ORION_STORYBOARD_HUMAN_QA_PASS requiere aprobación explícita de María.
REWORK_BEFORE_CODE permanece hasta superar el gate. No empezar runtime por publicar esta orden.
Esta orden está alojada en rama existente Nexo por continuidad; no mezclar ni mergear su runtime de Juegos rechazado a main.
