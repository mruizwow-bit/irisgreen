# R54 · Astra review visual quality · Taller · 28/09/2026

Issue: #318
Estado: `R54_ASTRA_VISUAL_QUALITY_FAIL_REFINEMENT_REQUIRED`

## Fuente auditada

- `R54_TALLER_VISUAL.patch.gz`
- `COORDINACION_R44_R47_R54.patch.gz`

Astra renderiza las 27 escenas desde `scripts/taller_suite/escenas.py`.

## Resultado

R54 mejora de verdad R47:
- 27 tarjetas ya son escenas, no iconos;
- se entiende la actividad;
- 9 variantes infancia;
- tres starters interiores mejorados.

Pero la calidad final sigue siendo demasiado plana:
- vector educativo;
- formas simples;
- poca profundidad/material/luz;
- paleta demasiado homogénea;
- acabado insuficiente para el estándar visual de María.

## Hallazgo de gate

`build_taller_visual_matrix.py` marca PASS por:
- >=15 elementos;
- <4300 bytes.

Eso es un gate estructural/técnico, no visual.

`27/27 PASS` NO equivale a calidad visual aceptada.

## Nueva regla

Calidad > tamaño mínimo del SVG.

Se permiten assets originales Iris Green:
- SVG rico;
- Canvas;
- snapshot del motor;
- WebP/AVIF;
- raster original;
- composición vector+raster.

No copiar escenas protegidas ni usar stock genérico.

## Pilotos

Antes de rehacer 27:
1. Dibujo
2. Estructuras
3. Programación
4. Videojuegos
5. Mundos
6. Modelado 3D

Método:
`referencia/concepto aprobado -> implementación -> comparación lado a lado -> corrección`.

Marcador intermedio:
`R54_CLAUDE_TALLER_VISUAL_6_PILOTS_READY_FOR_ASTRA`

## Interiores

La entrega R54 cambia directamente solo 3 starters. Los 27 interiores deben pasar el criterio:
`¿la primera pantalla muestra algo que apetece crear?`

## Integración

A2 no integra R54 como cierre visual hasta nuevo PASS Astra.

No main. No producción.
