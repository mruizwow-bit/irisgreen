# NEXO → PRISMA · CONSTRUCCIÓN R02 · PATCH P06-LEGACY-MATERIALS
Actualizado: 2026-10-05 · Issue #369

## Fuente y estado
Informe Axioma: https://github.com/mruizwow-bit/irisgreen/blob/a4a79358fe5ccc10630876d30d8fccced9c8debe/COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_CONSTRUCTION_R01_R02_20261005/RETEST_P06_FINAL_ARTIFACT.md
Comentario: https://github.com/mruizwow-bit/irisgreen/issues/369#issuecomment-5995409728

Gate vigente: `AXIOMA_CONSTRUCTION_R01_R02_P06_REWORK_REQUIRED`.
Artifact auditado por Axioma: `11347511815`; run `37314984917`; build `2696d6a694661815f46cb1edef20bc111818a144`.
ZIP SHA-256: `93cd3d40d24a1d34a262d5cedb91de57f5546d72ac7748c1cb3589c2c3107905`.
Nexo ha leído el informe; las verificaciones del artifact y los PASS corresponden a Axioma.

Cerrados: P01–P05, P07–P08, P06-B (parcela) y P06-C (+12 piedra, 12.12:1).
P06-A: geometría de badges PASS en 320/390/1440; único residuo = texto antiguo Madera/Piedra visible detrás en 1440.
Esta actualización sustituye el alcance anterior de tres correcciones: ahora solo procede eliminar ese residuo.

## Orden exacta
En la rama existente `prisma/construction-r01-storyboard-r02-20261005`, leer HEAD vivo y:
1. Eliminar/enmascarar por completo las labels legacy Madera y Piedra de la base antes de dibujar los badges nuevos, igual que se resolvió el texto legacy de parcela. Si el generador permite omitir esas labels en origen, usar esa opción local. Conservar escena y badges aprobados; no tapar el residuo ampliando indiscriminadamente los badges.
2. Verificar al menos:
   - `CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_1440.png`;
   - `CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_1440.png`.
   Inspeccionar las demás apariciones afectadas por la misma capa en 320/390/1440.
3. Añadir assertion/evidencia `legacy_material_labels_visible == false`, respaldada por inspección de los PNG finales. `material_badges_overlap == 0` por sí sola no cubre este defecto. No dar PASS mediante una constante sin comprobación.
4. Exportar el patch, actualizar manifest/hashes y publicar en #369 enlace accesible al nuevo artifact, commit/HEAD, hash nuevo y relación de frames comprobados.

No rehacer concepto, soluciones A/B, controles, foco, matriz de movimiento ni los puntos cerrados. Retest limitado al residuo y a comprobar que su eliminación no daña las regiones afectadas.

## Secuencia
PATCH P06-LEGACY-MATERIALS → AXIOMA RETEST VISUAL ACOTADO → HUMAN QA MARÍA.
No aplicar READY_FOR_HUMAN_QA al artifact final mientras persista el residuo.
`NO CODE · NO RUNTIME · NO MAIN`: corrección/exportación de storyboard, sin implementación del juego ni despliegue.

## Memoria
Acceso al paquete resuelto. Todos los bloqueantes anteriores están cerrados salvo las dos labels legacy. La ausencia de solapamiento entre badges no demuestra que el texto subyacente haya desaparecido: verificar la composición final, no solo la geometría de la capa nueva.
