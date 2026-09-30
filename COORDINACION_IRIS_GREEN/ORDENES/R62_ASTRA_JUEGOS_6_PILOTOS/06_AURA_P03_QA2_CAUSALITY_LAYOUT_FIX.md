# R62 · AURA · P03 RUTAS DE LUZ · QA REWORK 2

Fecha: 30/09/2026  
Issue: #326

Estado:

`R62_P03_QA_REWORK_2_GAMEPLAY_PASS_CAUSALITY_LAYOUT_FIX_REQUIRED`

## PASS

Se cierran los dos bloqueos principales de la vuelta anterior.

### Tablero
PASS:
- anclajes relevantes visibles en capa vectorial;
- destino del divisor legible;
- pieza seleccionada clara;
- pantalla sur ya dentro de encuadre;
- no vuelve la retícula completa.

### Materia
PASS acotado:
- hierro se separa de piedra;
- latón/papel legibles;
- vidrio visible en causalidad;
- test de separación añadido con umbral 0,045.

No reabrir:
- gameplay;
- luz;
- materiales;
- tablero;
- composición;
- cámara;
- móvil como concepto.

## BLOQUEO NUEVO · QA de causalidad

Las imágenes antes/después son válidas.

La banda explicativa 1→4 no pasa:
- texto del paso 3 invade columna 4;
- texto del paso 4 se solapa;
- LIGHT y NAVY afectados.

Corrección:
- solo SVG/layout;
- wrap/tspan o copy más corto;
- ancho real por columna;
- 0 solapamientos.

No rerender de escena.

## Móvil · polish

Filtrar anclajes totalmente fuera de viewport y evitar anillo cortado en borde si no es intencional.

No bloquea por sí solo.

## Motor

Claude declara P01 byte-identical tras eliminar código duplicado del motor.

Estado:
`CLAIMED_BY_CLAUDE_PENDING_REPO_EXECUTION`

Verificar antes de integración cuando el árbol/commit esté disponible.

## Siguiente gate

`R62_P03_CAUSALITY_LAYOUT_R3_READY_FOR_ASTRA_AURA_MARIA`

Entregar solo:
- causalidad LIGHT 1440;
- causalidad NAVY 1440;
- test P03;
- test identidad motor cuando sea ejecutable;
- opcional móvil limpio de anclajes fuera de viewport.

STOP.

P04–P06 HOLD.  
Codex #321 HOLD.  
A2 HOLD.  
No main.  
No producción.

No cambia normativa transversal.
