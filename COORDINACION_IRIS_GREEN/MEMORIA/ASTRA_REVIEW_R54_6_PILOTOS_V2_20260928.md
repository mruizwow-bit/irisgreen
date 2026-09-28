# R54 v2 · Astra review 6 pilotos · 28/09/2026

Issue: #318
Estado: `R54_ASTRA_6_PILOTS_PARTIAL_PASS_REWORK_BEFORE_SCALE`

## Resultado

R54 v2 mejora de forma material R54 v1:
- escenas en vez de pictogramas;
- luz;
- material;
- profundidad;
- sombras;
- composición;
- acción visible.

La dirección técnica SVG rico fuente → WebP first-party es válida.

## KEEP / direction pass
- Estructuras
- Mundos (con ajuste para reducir sesgo infantil de criatura)
- Modelado 3D

## REWORK
- Dibujo: protagonista tipo pájaro cute/ficha infantil; mantener mesa/luz/material pero cambiar obra central por creación transversal.
- Programación: todavía edtech infantil por robot con ojos/bloques/meta; mostrar sistema/simulación más sofisticada.
- Videojuegos: prioridad; parece platformer infantil genérico. Mostrar editor/nivel en construcción y creación, no juego casual terminado.

## Gaps técnicos antes de escalar
1. No hay script/paso de raster reproducible versionado en el patch.
2. Solo 640×400: añadir 1280×800/srcset para DPR2.
3. Revisar eager/fetchpriority para primeras tarjetas y medir LCP.
4. CSS modificado sigue con query `?v=r47-1`: actualizar cache-busting.
5. Fallback silencioso a SVG v1 no sirve para cierre: escenas migradas deben ser build-strict.

## Peso
6 WebP = 109,764 B total. Estrategia de raster es viable para 27 con lazy/srcset/presupuesto.

## Gate
No escalar 21 + 9 variantes todavía.

Siguiente marcador:
`R54_CLAUDE_TALLER_VISUAL_6_PILOTS_R2_READY_FOR_ASTRA`.
