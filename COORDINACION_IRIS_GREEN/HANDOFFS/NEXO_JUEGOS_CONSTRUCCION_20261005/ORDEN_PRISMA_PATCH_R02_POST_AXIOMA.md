# NEXO → PRISMA · CONSTRUCCIÓN R02 · PATCH ACOTADO
Fecha: 2026-10-05
Issue: #369
Estado: PATCH_REQUIRED
Gate de origen: `AXIOMA_CONSTRUCTION_R01_R02_REWORK_REQUIRED`

## Fuentes y actualización de memoria
Informe de Axioma:
https://github.com/mruizwow-bit/irisgreen/blob/09c652d54e1a82068cd6e134d0eda594be9b6ee3/COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_CONSTRUCTION_R01_R02_20261005/REVIEW_REAL_PACKAGE.md
Comentario QA: https://github.com/mruizwow-bit/irisgreen/issues/369#issuecomment-5993677720
Entrega accesible: https://github.com/mruizwow-bit/irisgreen/issues/369#issuecomment-5993515321

El pendiente de acceso de RECEPCION_R02_Y_REVISION_PENDIENTE.md queda RESUELTO por la entrega posterior. No volver a pedir el paquete R02 original.
Artifact: https://github.com/mruizwow-bit/irisgreen/actions/runs/37302920832/artifacts/11342176274
SHA-256 ZIP interno auditado por Axioma: `5aa0705b2a186681f223ab50d019ae1c1d167b2f66464001c1d8b2b08c282c1e`.
Digest del contenedor GitHub: `b469c8df6e389b60698987947943dd92d8d4d60de4ec28e5ee5d4e7eb8788526`.
No confundir ambos hashes ni reutilizar el hash anterior declarado 2526a0… para esta entrega.
Nexo ha leído el informe y el registro de entrega; la inspección binaria/visual y los PASS citados corresponden a Axioma.

## Conservar
Trabajar sobre la rama existente `prisma/construction-r01-storyboard-r02-20261005`, leyendo su HEAD vivo antes de modificar.
Conservar concepto, materiales, progresión, apoyo/alcance, soluciones A/B y costes que Axioma ha validado. El informe califica verticalidad como PASS parcial sin contradicción detectada: no elevarlo a validación de runtime.
El personaje 2D sigue siendo placeholder; el FBX femenino queda pendiente de implementación.
No rediseñar el juego ni inventar una tercera solución.

## Trabajo obligatorio de Prisma
| ID | Corrección | Evidencia para retest |
| --- | --- | --- |
| P01 | Reservar espacio al feedback inferior en F03/F04/F06 a 1440. | Texto y bordes íntegros; revisar límites de F01–F06 a 1440 tras el ajuste. |
| P02 | Añadir F01–F06 a 320. | Seis frames individuales con escena, controles y feedback completos, sin clipping horizontal ni targets reducidos. |
| P03 | Sustituir la leyenda móvil por controles touch diseñados como botones. | Al menos un estado de construcción completo en 320 y 390: D-pad, colocar, girar, subir/bajar altura, retirar, deshacer y cancelar; jerarquía clara, sin drag obligatorio. Se dibujan targets, no se implementa runtime. |
| P04 | Ampliar Recorrer/Construir y todos los targets móviles a >=44×44 CSS px como objetivo interno. | Cotas documentadas a escala de viewport para 320/390. |
| P05 | Separar foco y seleccionado. | Selected persistente y outline de foco independiente, incluido foco sobre pieza distinta a la seleccionada; describir conservación/retorno tras colocar, error y deshacer, sin mover foco al feedback. |
| P06 | Corregir contraste de R1/R2 y labels sobre arena. | Texto normal >=4.5:1 conforme al criterio de retest de Axioma; fondo sólido o texto oscuro, identificadores textuales preservados. Registrar colores y medición sobre el fondo real. |
| P07 | Añadir microsecuencia retirada/dependencias/deshacer. | Intento de retirar soporte con dependientes → bloqueo y motivo, sin cambiar piezas/inventario → deshacer una acción válida identificada → estado e inventario restaurados; indicar foco/cursor. No rehacer F01–F06 para esta secuencia. |
| P08 | Documentar NORMAL/REDUCED/NONE y forced-colors. | Matriz por acción/transición y estados visuales de selected/focus, R1/R2, preview válido/inválido y Recorrer/Construir. |

### Matriz de movimiento
NORMAL: desplazamiento y transiciones previstas con feedback textual.
REDUCED: sin cámara flotante ni grandes desplazamientos interpolados; transición breve/no espacial.
NONE: cambio instantáneo, cero movimiento continuo; ninguna información depende de animación.
En los tres modos se conservan reglas, acciones, resultado, feedback y posibilidad de jugar.

Forced-colors: bordes/outline del sistema, texto y estados distinguibles sin depender de colores de marca. Es una especificación visual previa a código; el funcionamiento real se probará posteriormente.

## Entrega
Paquete patch identificado de forma inequívoca y accesible desde #369, conservando trazabilidad al R02 auditado.
Incluir frames corregidos 1440/390, seis nuevos 320, controles/estados y microsecuencias complementarias, matriz, README y manifest actualizados. Los archivos no afectados pueden conservarse y referenciarse inequívocamente.
Adjuntar tabla P01–P08 → filename/frame → evidencia, nuevo hash del ZIP, enlace de artifact o descarga y commit/HEAD.
No entregar únicamente nombre/hash: comprobar que el enlace permite acceder al paquete.
Mejoras no bloqueantes del informe: manifest exhaustivo/hashes por archivo y etiquetado sRGB. No convertirlas en un rediseño o en un gate adicional.

## Retest y siguiente fase
Axioma retesta P01–P08 y comprueba que el patch conserva los elementos aprobados. No reabrir la lógica A/B salvo regresión concreta.
Gate esperado, todavía NO obtenido:
`AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA`.

Secuencia: PATCH R02 → AXIOMA RETEST → HUMAN QA MARÍA.
`NO CODE · NO RUNTIME · NO MAIN`: no implementar juego/HTML ni desplegar. El trabajo autorizado es corregir y exportar el storyboard.
Orión sigue en #323 con su propio estado; esta orden no lo cierra ni sustituye.

## Aprendizaje
Actualizar la memoria al llegar evidencia nueva: el bloqueo de acceso original está resuelto. Separar PASS de lógica del storyboard, accesibilidad pendiente, funcionamiento de runtime y aceptación humana.
