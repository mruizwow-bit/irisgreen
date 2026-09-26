# Memoria · R42 Design · sistema material/cristal · 26/09/2026

## Decisión
Design queda activado para construir el sistema visual/material común de Iris Green a partir del estudio técnico de cristal, pero bajo toda la normativa vigente.

## Issue
- #301 · R42-DESIGN-R01

## Base observada al emitir
- rama A2: `agent2/sabik-iris-r08-20260924`
- HEAD: `e8cad400a30d5d4857f9f99b0c1070d786958a8b`
- tree: `827a68fae6596a929e4d246bb47b8494a976e8a3`
- A3 app shell #290 ya integrado.

Design debe releer A2 antes de escribir porque la rama sigue en movimiento.

## Alcance
- sistema semántico de materiales/tokens;
- cristal solo en chrome interactivo;
- contenido de lectura estable/opaco;
- no glass-on-glass;
- variantes light/dark/opaque;
- control manual de transparencia integrado en IGPreferences;
- reduced transparency + fallback sin backdrop-filter;
- forced colors;
- reduced motion;
- sustituir high contrast basado en filter global por tokens;
- border token solo donde la frontera sea funcional;
- medición real de alpha/contraste;
- piloto real: navegación, Taller/Dibujo, Juegos, Rincón, Intereses.

## Corrección normativa del estudio
No afirmar que todo botón con borde <3:1 incumple WCAG 1.4.11. Evaluar contraste no textual según la función perceptiva del componente.

## Integración
Design trabaja en rama propia. A2 integra y despliega. No propagación global hasta HUMAN QA de María.

## Precheck de entrega R01

La arquitectura entregada se conserva, pero el gate cambia a:

`R42_DESIGN_PACKAGE_PRECHECK_PASS_CORRECTIONS_REQUIRED`

Correcciones antes de A2:
1. reconciliar contra Estado/Memoria/Control canónicos actuales y addenda R42 vigentes;
2. hacer dark/opaco el chrome temporal del Rincón (dialog, inspector, sheets/paneles);
3. corregir el medidor para usar el fondo efectivo real por ancestros + composición alfa.

Ajustes menores: margen del texto deshabilitado hacia 4,8–5:1 y estado comprensible cuando Más contraste impone opacidad.

Las 48 capturas son CI estructural/material; la validación perceptiva real sigue en Deploy Preview A2 + HUMAN QA María.

Orden de corrección: `../ORDENES/R42_DESIGN_CRYSTAL_R01/02_CORRECCIONES_PRECHECK_20260926.md`.  
Addendum: `../NORMATIVA/ADDENDUM_R42_DESIGN_CRYSTAL_PRECHECK_20260926.md`.  
Detalle de revisión: `R42_DESIGN_R01_PRECHECK_CORRECCIONES_20260926.md`.

Estado vigente: `R42_DESIGN_PACKAGE_PRECHECK_PASS_CORRECTIONS_REQUIRED`.
