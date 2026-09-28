# R53 · Sala 1 Globos de luz · HUMAN QA forma FAIL · 28/09/2026

Issue: #317.

Estado:
`R53_SALA1_GLOBOS_FORM_FAIL_REWORK_REQUIRED`

## HUMAN QA María

Hallazgo raíz:
**las formas actuales no se leen como globos; se leen como deformaciones/blobs.**

Esto coincide con el addendum visual R53 que ya marcaba como FAIL inmediato una sala que pareciera blobs.

## KEEP técnico

- quality manager adaptativo corregido;
- degradación de calidad que preserva composición;
- aprendizaje de iluminación/profundidad;
- renderer común donde aporte.

## REWORK visual

Los cuerpos luminosos deben rehacerse como volúmenes inflables físicos reconocibles:
- esfera/elipsoide como base;
- deformación pequeña y controlada;
- membrana bajo tensión;
- translucidez/opalina;
- espesor;
- luz interna/transmitida;
- variación por escala/color/material/altura, no por deformación arbitraria.

También siguen abiertos:
- arquitectura material;
- composición que explique interacción;
- layout móvil propio 320–390;
- comparación con benchmark E4 global.

## Próximo gate

`R53_SALA1_GLOBOS_E4_R2_READY_FOR_ASTRA_MARIA`

Solo Sala 1.
Otras 5 salas HOLD.
No A2/main/producción.
