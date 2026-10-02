# MAR 22 · MESOPELÁGICA · PACKAGING ATLAS A1

Estado: `MAR_22_MESO_PACKAGING_PASS`

Arte bloqueado: `MAR_22_MESO_ART_APPROVED_PACKAGING_CONTRACT_LOCKED`

## Alcance cerrado

Solo:
- pez hacha;
- pez linterna;
- calamar de cristal.

Dos estados por especie: `-luz` y `-oscuro`.

## Binarios

Preservados en Library:
`/Iris Green/Handoffs/Atlas/MAR_22_MESO_PACKAGING_R01/`

Destino canónico de integración:
`img/intereses/temas/22-vida-marina/`

## Validación

- PNG RGBA real;
- 1400×1000;
- sRGB ICC;
- un archivo por imagen;
- sin texto visual;
- sin agua, partículas, nieve marina, haz, burbujas o fondo;
- mismo canvas/registro entre estados;
- desplazamiento final entre estados: `[0,0]`;
- SHA-256 en `SHA256SUMS.txt`;
- procedencia en `provenance.json`;
- no anatomía, estilo, color ni iluminación rediseñados.

`recorta.py` no se ejecutó porque el master aprobado ya contenía alfa fiable en las celdas seleccionadas.

## Límite

No se ha empaquetado ninguna de las otras 12 especies.
No Cielo.
No Fósiles.
No runtime.
No main.
No merge.
No deploy.

**STOP.**
