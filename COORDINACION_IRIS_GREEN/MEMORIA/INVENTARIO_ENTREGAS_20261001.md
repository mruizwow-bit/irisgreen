# Estado comprobado de las entregas · 1 octubre 2026

Este inventario distingue código integrado, disponibilidad en vista previa, diseños y funciones pendientes. La producción principal no ha sido sustituida.

| Entrega | Qué existe | Estado real |
|---|---|---|
| R65 Taller | 27 estudios ES/EN, 9 variantes infantiles | Integrado y comprobado en la vista previa de reparación |
| R44 A0 aislado | 8 fichas guiadas sobre los estudios | Integradas. Empezar lleva al estudio; terminar es una marca manual, no una validación automática del artefacto |
| R44 cadena, HEAD 45fc0a5e | Otro framework para los mismos ocho IDs, sobre el Taller anterior | Conservado en editorial/r44/entrega-cadena-20261001. No se carga como segundo sistema ni se cuenta como ocho retos adicionales |
| R63 Sakura | Sala 3D y texturas | El runtime y ocho imágenes coinciden byte a byte con la entrega. Disponible en Rincón tranquilo, Sakura y salas |
| R61 Pecera final | Vídeo escritorio y móvil, sonido, carteles | Integrado en Rincón tranquilo. Seis medios originales verificados; reproducción manual, silencio, modo suave e imagen fija |
| R62 P01 Habitación imposible | Concepto, renders y generador Python | Diseño conservado; no hay página jugable entregada |
| R62 P02 Terrario vivo | Concepto, renders y generador Python | Diseño conservado; no hay página jugable entregada |
| R62 P03 Rutas de luz | Concepto, renders y simulación/generador Python | Diseño conservado; no hay página jugable entregada |
| R62 P04 Ritmo de colores | Imagen del mecanismo y generador | Propuesta visual; no hay página jugable entregada |
| Sabik nuevo de Nexo | No identificado en estos paquetes | Pendiente de localizar e integrar la entrega exacta. La imagen anterior y voz grabada no equivalen al nuevo Sabik |

## Límites que no se deben ocultar

- La reconciliación de R44 identifica tres retos previos (d1, e6, l6). La interfaz R65 actual no escucha el evento R44 para seleccionar automáticamente esos retos. La entrada guiada al estudio sí existe; la adopción automática no se declara terminada.
- Las cifras generales del catálogo de Juegos no demuestran que los cuatro pilotos R62 estén construidos. Este inventario no certifica cada juego antiguo.
- Los informes y capturas de QA incluidos en paquetes son evidencia de sus autores. Se distinguen de las comprobaciones de integración hechas ahora.

## Procedencia

R62 cadena: 2e559991762aca18b7c62f65f4df83ecfbee519b; bundle SHA256 2f61695b23258409673f072f18104fbf7a48e83e7a526c2d864188e89c175f6e.
R44 cadena: 45fc0a5ea18b57f11e23b8c677cae9ab14aeed4d; bundle SHA256 ff0f98e63ebcacb398413ee9fd5945842d48581c7cdaddeec691d1b2c1f1985a.
Los once paquetes R44/R65 repetidos en Descargas tienen las mismas huellas que los ya recibidos e integrados.
El manifiesto tools/rincon-pecera/manifest.json verifica cada fragmento y cada medio reconstruido. Los originales se publican sin recompresión.
No se aplican las antiguas modificaciones de Home y tokens de la cadena R62 sobre las reparaciones actuales.
