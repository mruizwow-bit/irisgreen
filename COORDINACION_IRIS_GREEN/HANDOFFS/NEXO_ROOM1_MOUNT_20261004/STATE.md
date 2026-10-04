# NEXO · Sala 1 · montaje en Area de Juegos

2026-10-04 · WIP=1 · rama nexo/new-games-area-r01-20261004

## Decisión
María aprueba en Work la candidata Comparativa de interfaz para puzzle espacial-3 y ordena montarla en la página de Juegos existente.
Gate de storyboard: ROOM1_STORYBOARD_HUMAN_QA_PASS.
Axioma: AXIOMA_IMPOSSIBLE_ROOM_SALA1_STORYBOARD_READY_FOR_HUMAN_QA, commit 5b9b566d9c31b0b05dae3f79536f9811d7c743b0.
SHA-256 imagen aprobada: 1bc2962ba307b122fc119b49ad57e05a7296bb91019969f1556b2451ece2f788.
Esta decisión sustituye el onboarding anterior de dos miniaturas por cuatro orientaciones con nombres Arriba/Derecha/Abajo/Izquierda.

## Realidad
- /es/juegos/ enlaza a /es/juegos/habitacion-imposible/.
- Sustituido runtime descartado; Sala 2 no implementada.
- Escena aprobada intacta, mostrada por ventanas SVG del storyboard original.
- Estados initial/selected/blocked/connected/solved, selección reversible, reinicio y cancelación del temporizador.
- Tras conectar, acción explícita Ir a la salida resuelve Sala 1.
- CTA de cierre vuelve a Juegos porque no hay Sala 2 autorizada. No se simula una siguiente sala inexistente.
- ES/EN, botones nativos >=44px, Enter/Space, aria-pressed, foco independiente, aria-live polite, motion Normal/Reducido/None y forced-colors.

## Evidencia
Prueba Chromium del montaje local 320/390/1440: PASS.
Comprobados enlace desde Juegos, tres elecciones no conectadas, elección Arriba conectada, salida, reinicio, idioma, Space/Enter, conservación de foco, tamaños de targets, ausencia de overflow y errores JS, reduced-motion/forced-colors.
Revisión visual screenshot móvil 390 realizada. Retest con texto al 200% en 320/390/1440 PASS de overflow; corregido ancho del selector de idioma y separación del indicador selected.
No constituye conformidad WCAG ni PASS Axioma de implementación.

## Límite material
Este montaje es un prototipo interactivo basado en escenas estáticas aprobadas; NO es un render de reorientación física. El solver geométrico canónico calcula la conectividad después de cada orientación; la ilustración utiliza ventanas estáticas del storyboard. No declarar la mecánica física final validada desde este montaje.
Se necesita HUMAN QA del montaje y decisión sobre representación física antes de declarar producto final.

## Publicación
Workflow aislado de revisión con alias games-room1; sin --prod. Preserva main y el trabajo de Motor.
No fusionar toda esta rama histórica a main: reconciliar solo archivos de esta entrega después de QA.
