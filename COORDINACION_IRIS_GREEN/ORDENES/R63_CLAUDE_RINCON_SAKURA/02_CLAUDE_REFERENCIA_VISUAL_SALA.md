# R63 · CLAUDE · SAKURA · INTEGRAR REFERENCIA VISUAL DE SALA SENSORIAL

Fecha: 29/09/2026  
Issue: #328  
Responsable: Claude  
Revisión: Astra  
Aceptación: HUMAN QA María

Estado:
`R63_SAKURA_VISUAL_REFERENCE_APPROVED`

## Decisión

La referencia aprobada representa **la misma sala sensorial Sakura** en dos climas:
- DARK NAVY;
- LIGHT.

No es un paisaje. No se debe mapear la imagen completa como textura del producto.

## KEEP

- geometría circular;
- óculo;
- pared/proyección envolvente;
- tubo sensorial;
- mobiliario bajo y redondeado;
- esferas de luz;
- cove/aros LED;
- pétalos runtime;
- gobos/reflejos;
- controles/lifecycle;
- LIGHT/NAVY;
- reduced motion;
- fallbacks existentes.

## Proyección Sakura

La floración principal deja de construirse como sellos procedurales.

Crear dos masters first-party coordinados:
- `SAKURA_CANOPY_NAVY`;
- `SAKURA_CANOPY_LIGHT`.

Misma estructura de ramas y racimos. Cambia el clima.

Obligatorio:
- ramas oscuras reconocibles;
- bifurcaciones;
- racimos;
- huecos de fondo;
- profundidad;
- variación de escala;
- sin wallpaper/confeti/patrón repetitivo.

Pared y óculo pueden usar crops diferentes de la MISMA fuente.

## Runtime procedural permitido

- pétalos;
- cove/luz;
- reflejos;
- gobos;
- partículas del tubo;
- movimiento lento.

## Tema

DARK NAVY sigue como estado inicial global.
LIGHT es alternativa.

Chrome consume tokens globales. El stage es arte.

## QA

Entregar:
- referencia vs implementación;
- NAVY y LIGHT;
- 1440 y 390;
- NORMAL / REDUCIDO / SIN_MOVIMIENTO;
- fallbacks B/C/D;
- mismo aspect ratio para comparar;
- comprobar lectura de Sakura + sala sensorial;
- no paisaje, no wallpaper, no confeti.

Marcador:
`R63_SAKURA_VISUAL_REFERENCE_INTEGRATED_READY_FOR_ASTRA`

STOP. No ZIP/push/siguiente sala antes de Astra/HUMAN QA.

## Normativa

No cambia normativa transversal. Consumir:
- visual premium 2026;
- low-stimulation;
- tokens globales;
- taxonomía AGE_*;
- R42/R02;
- marco WCAG/ISO/EN/COGA;
- ES/EN.
