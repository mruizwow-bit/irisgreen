# R68 · AURA · FAROLES · REWORK DIRIGIDO DE DIRECCIÓN

Fecha: 30/09/2026  
Issue: #335

Estado:

`R68_FAROLES_DIRECTION_KEEP_SPATIAL_LIGHTING_REWORK_REQUIRED`

## Decisión

KEEP del concepto y del mecanismo.

NO PASS del prototipo visual actual.

KEEP:
- atlas de pantallas/calados;
- proyección ligada al patrón propio de cada farol;
- sala interior diferenciada de Sakura;
- luz cálida como material;
- DARK/LIGHT como climas de chrome.

## Fallos

1. La arquitectura se lee como caja/pasillo.
2. Los faroles todavía se leen demasiado planos/geométricos.
3. La proyección se comporta como papel pintado/rejilla en grandes superficies.
4. La escena está demasiado ocupada para Rincón tranquilo.
5. LIGHT está sobreexpuesto.
6. Faltan zonas reales de descanso visual y penumbra.

## Corrección de precedencia

Claude propuso:
`agua primero → nave → patrón → LIGHT`.

No se autoriza ese orden.

R68 prohíbe usar agua/reflejo como identidad principal. La referencia es benchmark de atmósfera/acabado, no plantilla literal.

## Orden R2

1. Volumen de nave primero:
   - sala más ancha;
   - altura;
   - arcos/hornacinas o equivalentes;
   - primer/medio/fondo;
   - zonas de penumbra;
   - eliminar lectura de túnel/caja.

2. Faroles como objetos:
   - reducir cantidad si hace falta;
   - volumen;
   - papel translúcido;
   - borde/espesor;
   - cables discretos;
   - halo contenido.

3. Proyección local:
   - caída fuerte;
   - manchas/charcos de luz;
   - solapamientos limitados;
   - grandes zonas tranquilas sin patrón.

4. Reflejo:
   - opcional;
   - secundario;
   - no identidad principal;
   - no convertir R68 en “Agua y reflejos”.

5. LIGHT:
   - corregir al final;
   - bajar exposición;
   - recuperar materia;
   - conservar sombras.

## Atlas

KEEP como I+D:
- hojas;
- rombos;
- flores;
- grano/puntos;
- líneas;
- ojiva.

No usar todas las familias simultáneamente.
No crear mosaico uniforme.

## Evidencia R2

Entregar únicamente:
- frame 1440 DARK NAVY;
- frame 1440 LIGHT;
- frame 390 DARK NAVY;
- mapa breve de profundidad/zonas tranquilas;
- detalle de un farol mostrando material + calado + proyección local.

Marcador esperado:

`R68_CLAUDE_FAROLES_DIRECTION_R2_READY_FOR_ASTRA_AURA_MARIA`

STOP después.

No runtime final todavía.  
No handoff A2.  
No main.  
No producción.

Lluvia de luz / Agua y reflejos / Bosque bioluminiscente: HOLD.

No cambia normativa transversal.
