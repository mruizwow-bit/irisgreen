# AXIOMA · Sistema Solar R03 · reconciliación final del relevo

Fecha: 2026-10-07

Gate:
`SOLAR_R03_STATIC_RECONCILIATION_PASS__BROWSER_HUMAN_QA_PENDING`

## Autoridad activa

Runtime R03:
- `assets/ig-sistema-solar-r03.js`
- `assets/ig-sistema-solar-3d-r03.js`

Datos R03:
- `assets/data/solar-r03-shape-overrides.json`
- `assets/data/solar-r03-appearance-overrides.json`
- `assets/data/solar-r03-rings.json`
- `assets/data/solar-r03-irregular-moon-shapes.json`
- `assets/data/solar-r03-moon-orbits.json`

Oráculos:
- `SOLAR_R03_SHAPE_ORACLE.json`
- `SOLAR_R03_RINGS_ORACLE.json`
- `SOLAR_R03_IRREGULAR_MOONS_ORACLE.json`
- `SOLAR_B03_R03_VOLUME_CONTRACT.json`

## Donors restaurados y bloqueados

Coinciden con `SOLAR_R03_DONOR_LOCK.json`:
- `assets/ig-sistema-solar.js` → blob `05d8bbc0d00c7715f3b96352cfef0d4a10287513`
- `assets/ig-sistema-solar-3d.js` → blob `b6e6b158124f45b497b5e1f547e779f335775655`
- `es/intereses/sistema-solar/sistema-solar.json` → blob `72802030e6df20db4ce8eebbd23eb03ecc9437cd`

Los parches redundantes sobre donors se retiraron.

## Estado funcional

KEEP:
- true volume;
- dos modos de escala explícitos;
- forma planetaria R03;
- Haumea triaxial;
- superficies no observadas neutralizadas;
- anillos procedurales de Júpiter/Urano/Neptuno;
- Saturno conserva anillo texturizado donor;
- 20 lunas con semiejes factuales reconstruidos;
- 10 lunas gap con órbita R03 basada en distancia/periodo canónicos + excentricidad/inclinación documentadas;
- fichas/tablas y fallback sin WebGL.

## Copy

ES/EN actualizado:
las fuentes ilustrativas siguen documentadas, pero el 3D R03 no presenta cartografía imaginada de Haumea/Makemake/Eris como observada.

## Static gate

- `ig-sistema-solar-r03.js`: syntax PASS.
- `ig-sistema-solar-3d-r03.js`: syntax PASS.
- ES carga 1× controlador R03 y 0× controlador legacy.
- EN carga 1× controlador R03 y 0× controlador legacy.
- donor lock 3/3 PASS.

## Pendiente

- Browser hardware retest cuando IrisGreen vuelva a estar online.
- 320/390/1440.
- NORMAL/REDUCED/NONE.
- raycast y focos.
- rendimiento.
- fallback sin WebGL.
- HUMAN QA María.

No reabrir el núcleo sin finding.

Siguiente bloque del relevo:
**Meteoros**.

NO MAIN · NO PUBLIC DEPLOY.
