# NEXO → PRISMA · CONSTRUCCIÓN R02 · SOLO PATCH P06
Fecha: 2026-10-05 · Issue #369

Fuente: [retest Axioma](https://github.com/mruizwow-bit/irisgreen/blob/e0a93506ec60a023cdd467bee7629c60b1abdd3a/COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_CONSTRUCTION_R01_R02_20261005/RETEST_PATCH_P01_P08.md).
Comentario: https://github.com/mruizwow-bit/irisgreen/issues/369#issuecomment-5994380359

## Estado vigente
`AXIOMA_CONSTRUCTION_R01_R02_PATCH_REWORK_REQUIRED`.
P01, P02, P03, P04, P05, P07 y P08 pasan dentro del alcance de storyboard/especificación indicado por Axioma. P06 es el único pendiente.
Esta orden reduce el alcance de ORDEN_PRISMA_PATCH_R02_POST_AXIOMA.md; no repetir los ocho puntos.
Conservar concepto, A/B, costes, apoyo/alcance, player proxy, modelo touch y matriz de movimiento.

Evidencia auditada por Axioma: artifact `11343313636`, run `37305550352`, patch commit `e54acc4f44c030daa7fd2c3706fededb134763ca`, HEAD de estado `760b7137034516c4cd1bde995dbbcb0a853f0d98`.
ZIP verificado: `7fbca66968681a463d3035de30b5c9c80a839318f7b79f5e8f58e830e2f9bad7`.
36/36 archivos y 30/30 PNG RGBA con ICC, según el informe. Nexo ha leído ese informe; no atribuye a esta recepción una nueva inspección binaria propia.

## Corrección exacta
Trabajar sobre HEAD vivo de la rama existente `prisma/construction-r01-storyboard-r02-20261005`.

1. **Madera/Piedra:** recolocar las dos badges para que sus rectángulos completos, incluido texto, no se solapen en 320/390. Usar ancho real del texto y separación explícita; evitar que un cambio tape escena, controles u otra etiqueta.
2. **Parcela bloqueada/libre:** mantener ambas variantes completas dentro del área visible de escena en 320/390, con margen interior. Calcular ancho real y limitar la posición a los límites disponibles, sin truncar el estado.
3. **+12 piedra:** aplicar badge contrastante o texto oscuro sobre superficie clara en F05/F06 y cualquier otra aparición. Alcanzar >=4.5:1 según el criterio de Axioma y registrar ese par real en CONTRAST_MEASUREMENTS.json.

## Evidencia y retest acotado
Añadir/verificar los tres controles pedidos por Axioma:
- `material_badges_overlap == 0`;
- `parcel_badge_inside_bounds == true`;
- `+12 piedra contrast >= 4.5:1`.

Comprobar 320/390/1440 en las apariciones afectadas, incluidas las dos variantes bloqueada/libre. Entregar PNG finales para inspección visual además de las mediciones; comprobar que el cambio local conserva controles, foco y feedback ya aprobados. No reabrir la matriz completa sin una regresión concreta.

Publicar en #369 el paquete patch accesible, commit/HEAD, nuevo SHA-256, manifest actualizado y tabla P06-A/B/C → frame/archivo → evidencia. Conservar trazabilidad al patch anterior y no reutilizar su hash para los bytes nuevos.

## Secuencia y límites
PATCH P06 → AXIOMA RETEST P06 → HUMAN QA MARÍA.
El gate READY_FOR_HUMAN_QA sigue pendiente.
`NO CODE · NO RUNTIME · NO MAIN`: esta orden corrige/exporta storyboard; no autoriza implementar el juego ni desplegarlo.
Orión conserva su propia línea en #323.

## Memoria
El bloqueo de acceso está resuelto. Siete puntos están cerrados por el retest; queda solo layout/contraste de tres etiquetas. La mejora de contraste debe comprobarse junto con encaje y solapamientos en cada viewport, porque añadir fondos puede introducir recortes nuevos.
