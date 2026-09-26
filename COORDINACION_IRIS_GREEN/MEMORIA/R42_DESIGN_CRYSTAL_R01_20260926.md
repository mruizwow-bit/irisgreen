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

Estado: `R42_DESIGN_CRYSTAL_SYSTEM_BUILD_ACTIVE`.
