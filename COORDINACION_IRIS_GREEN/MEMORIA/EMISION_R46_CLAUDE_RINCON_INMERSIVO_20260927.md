# R46 · Claude · Rincón tranquilo definitivo · emisión 27/09/2026

Issue: #307  
Estado: `R46_CLAUDE_RINCON_ORDERED`

## Decisión de María

El Rincón tranquilo se reconstruye como una experiencia de producto con tres modos:

1. Respirar / Breathe.
2. Paisajes / Landscapes.
3. Inmersivo / Immersive.

El modo Sonidos deja de ser una entrada principal. Se reutiliza el audio propio ya existente de Iris Green como ambiente opcional en Paisajes e Inmersivo. No se buscan audios externos nuevos.

## Paisajes largos

María corrige explícitamente el criterio anterior: no se aceptan vídeos de dos minutos repetidos.

Gate:
- objetivo 20–30 minutos de experiencia por paisaje;
- presets 10 / 20 / 30 / 60 minutos;
- continuo;
- vídeo largo real o programa de 3–5+ segmentos coherentes con crossfade;
- un clip corto no puede ser el paisaje entero en loop;
- repetición perceptible, salto de cámara/luz o reinicio evidente = HUMAN QA FAIL.

## Inmersivo

Referencia conceptual: Nomad Museo Inmersivo de Madrid, no como contenido copiable sino por el tratamiento envolvente de todo el espacio.

R46 crea cinco salas iniciales:
- Océano de luz;
- Lluvia de cristal;
- Río de luz;
- Aurora lenta;
- Espacio de respiración.

Motor progressive enhancement:
WebGPU/WGSL → WebGL2 → Canvas 2D → estático.

No WebXR obligatorio, no cámara, micrófono, geolocalización, tracking, gamificación ni permisos nuevos.

## Base

- PR #300 ya integrado y se conserva como donante válido.
- PR #303 contiene dos fixes obligatorios que no se pueden perder.
- Design R02 gobierna chrome/material.
- A2 sigue siendo la única puerta de integración.
- Claude no despliega ni toca main/producción.

## Gate

Claude publica `R46_CLAUDE_RINCON_BASE_READ`, construye y entrega:
`R46_CLAUDE_RINCON_REBUILD_READY_FOR_ASTRA`.

Astra revisa → A2 integra → Deploy Preview → María HUMAN QA.

La orden completa está versionada en:
`ORDENES/R46_CLAUDE_RINCON_INMERSIVO/01_CLAUDE.md`.
