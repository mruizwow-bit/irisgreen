# HANDOFF · INTERÉS 22 · VIDA MARINA · LIGHT REVEAL

Owner de producto: María
Owner visual: Lumen A7
Owner runtime: Motor A5
Issue: #323

Gate:
`INTEREST_22_LIGHT_REVEAL_VISUAL_CONTRACT_PASS`

## Mecánica
`MOVE_LIGHT → REVEAL → DARKNESS_RETURNS`

No excavación.
No acuario.
No autoplay.
No slider de profundidad.

## Reuse inmediato
Paquete:
`MAR_22_MESO_PACKAGING_PASS`

KEEP_LOCKED:
- pez hacha luz/oscuro;
- pez linterna luz/oscuro;
- calamar de cristal luz/oscuro.

Los pares ya comparten geometría y registro; sirven para mezcla espacial dentro del haz.

## Motor
Debe implementar:
- oscuridad real;
- linterna ancha;
- revelado parcial por máscara;
- bioluminiscencia fija;
- 5 zonas;
- navegación teclado/touch;
- lista accesible de señales;
- age density;
- album state;
- sin movimiento automático.

## Lumen
No regenerar los 6 mesopelágicos.

No generar las “12 restantes” hasta recibir:
`INTEREST_22_REMAINING_SPECIES_FACTUAL_ASSET_BRIEF`

Ese brief debe fijar especie, zona, tamaño, bioluminiscencia y factual visual descriptors.

## Visual tone
`DEPTH_IS_WONDER_NOT_HORROR`

No fauces/acecho/depredación como lenguaje visual.

## Separación
Datos de profundidad/luz/presión/temperatura = runtime/content.
No texto ni números en raster.

