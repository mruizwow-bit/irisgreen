# Nexo · Claude Design · Juegos R01_1 · revisión de entrega
Fecha: 2026-10-05
Seguimiento: #369
Responsable de la corrección: Claude Design.

## Resultado
NEXO_CLAUDE_DESIGN_GAMES_R01_1_EXPORT_PATCH_REQUIRED

Se conserva la dirección visual. Esta revisión no solicita rehacer la portada ni el juego. El paquete incluye ahora evidencia visual, pero necesita una corrección acotada de exportación y dependencias antes de cerrar la entrega reproducible.

## Artifact revisado
- Archivo: CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_1(1).zip
- Tamaño: 6231027 bytes.
- SHA256: f74425dc8604327ae309e37fabb3ad8a6ad10f4d21605bb3fa6aa70dda3dcf3d
- Referencia persistente: libfile_a429283aa424819180ceed85341b80f2.
- ZIP íntegro; 18 frames editables, 18 PNG y cuatro WOFF2 con licencias.
- Inspección visual: J01 a 390 y 320, S01 menú a 390 y S04 ficha a 1440.
- Inspección estática de los 18 editables. No ejecución en navegador por Nexo. No se declara revisión visual completa de los 18 frames ni PASS de accesibilidad interactiva.

## Correcciones conservadas
- NAVY, Atkinson Hyperlegible y Newsreader presentes; interlineados explícitos.
- Marca textual Iris Green; retirado el símbolo provisional.
- Documentación de foco actualizada a #C3B8FF.
- PNG reales disponibles y jerarquía legible en las cuatro muestras revisadas, sin recorte evidente del contenido de producto en esas muestras.
- Ficha honesta: Jugar no disponible todavía.
- Las líneas de viewport y cajas magenta son anotaciones de revisión, no UI final.

## Orden de patch de exportación
1. Corregir el bloque CSS de los 18 .dc.html: contienen @font-face y reglas CSS dentro de helmet, un cierre </style>, pero ninguna apertura <style>. Entregar el formato editable válido. Si el renderer nativo transforma el documento, documentar esa transformación; la exportación debe poder reproducir las capturas.
2. Resolver fuentes locales: los 18 archivos siguen apuntando a /_blob/<id> aunque los WOFF2 están en fonts/. Entregar referencias locales ya resueltas para la copia portable; no dejar al receptor la sustitución manual de URLs.
3. Resolver ./support.js, referenciado en los 18 archivos y ausente del ZIP. Incluirlo si es necesario o retirar la referencia si no lo es. Declarar el renderer requerido por el formato nativo. Esto no autoriza código de producto ni un runtime.
4. Verificar la reproducción desde el ZIP final extraído, sin depender de blobs de la sesión original. Adjuntar evidencia del render y regenerar manifest/hashes.
5. Aclarar la evidencia de color: los PNG no incluyen ICC ni chunk sRGB detectable. No se afirma que sus colores sean incorrectos; incorporar perfil/metadatos sRGB para hacer explícita la declaración del README.
6. Retirar del README la dependencia de María para un logotipo nuevo. Para esta entrega la marca textual Iris Green es suficiente.

## Pendientes de integración, sin rediseño
- Sustituir la reserva de imagen por un frame existente aprobado de Construcción R02, obtenido del artifact canónico de Prisma. No inventar arte ni modificar las soluciones del juego. Si el asset no es accesible, registrar la referencia y el impedimento concreto.
- Conectar la tipografía al canon del sitio en implementación, incluido IG Zero; su ausencia en estos editables no se convierte aquí en un nuevo bloqueo visual.
- Mantener pendientes explícitos la clasificación Para todos/Plus y condiciones de acceso, sin inventarlas.
- Observación no bloqueante: en 320 el primer viewport queda ocupado por introducción y reserva de imagen; revisar su altura cuando se coloque la imagen real para acercar los accesos.

## Entrega y secuencia
ZIP corregido + editables + fuentes/dependencias resueltas + PNG + README + manifest.
PATCH DE EXPORTACIÓN → VERIFICACIÓN DE ENTREGA → AXIOMA → HUMAN QA MARÍA.

Esta orden afecta exclusivamente al diseño del área web de Juegos de Claude Design. Prisma conserva su autorización separada para el prototipo jugable de Construcción. Claude Rincón y Eco siguen con Pecera/audio. No modificar main, desplegar ni integrar producción. Registrar el nuevo artifact en #369 con su hash.

No mezclar ni mergear completa la rama de coordinación, que contiene trabajos anteriores fuera de este alcance.
