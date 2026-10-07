# AXIOMA · Sistema Solar R03 · intake y estado del núcleo volumétrico

Fecha: 2026-10-07  
Estado: `AXIOMA_TEMP_COVER_CIELO_ESPACIO_R03_ACTIVE`

## Decisión principal

`SOLAR_R03_TRUE_VOLUME_CORE_KEEP__TARGETED_HARDENING_REQUIRED`

No reconstruir el Sistema Solar desde cero.

El runtime vigente ya usa:
- Three.js local;
- `SphereGeometry` para cuerpos;
- `RingGeometry` para Saturno;
- mallas/raycast reales;
- rotación física desde datos IAU/WGCCRE;
- órbitas desde JPL/MPC;
- escala clara y escala real;
- Tierra con día/noche + shell de nubes;
- texturas locales y documentadas.

## Donor lock

Ver:
`SOLAR_R03_DONOR_LOCK.json`

Bytes bloqueados:
- `assets/ig-sistema-solar-3d.js`;
- controlador original;
- CSS;
- `sistema-solar.json`;
- `cielo-fondo.json`;
- texturas principales.

## Masters visuales

Gate:
`SOLAR_FOUNDATION_FINAL_10_MASTERS_PASS`

Estado:
- 10 masters;
- HUMAN QA María;
- art locked.

Regla R03:
los masters 2D aprobados son referencia visual / assets de producto.
No se convierten automáticamente en textura equirectangular.

Las texturas 3D actuales tienen su propia procedencia y licencia.

## Shape hardening R03

El source canónico usa diámetro ecuatorial para varios planetas y no incluye ejes.

R03 añade, sólo para el renderer 3D:
- Tierra;
- Marte;
- Júpiter;
- Saturno;
- Urano;
- Neptuno.

Fuente externa R03:
NASA/NSSDCA fact sheets, radios ecuatorial/polar y radio volumétrico medio.

El JSON canónico NO se modifica.

Implementación:
1. cargar `solar-r03-shape-overrides.json`;
2. clonar el payload antes de entregarlo al renderer;
3. aplicar `ejes_km`;
4. usar diámetro derivado del radio volumétrico medio sólo en el clon 3D.

Oracle:
`SOLAR_R03_SHAPE_ORACLE.json`

Error máximo reconstruido:
< 0,32 km.

## Sol / Mercurio / Venus

No reciben override de forma en este slice.

- Sol: sphere model.
- Mercurio: sphere retained.
- Venus: sphere retained.

No añadir deformación sin fuente específica seleccionada.

## Anillos

Datos canónicos:
- Júpiter: sí;
- Saturno: sí;
- Urano: sí;
- Neptuno: sí.

Runtime actual:
- Saturno: renderizado con geometría + textura;
- Júpiter: no renderizado;
- Urano: no renderizado;
- Neptuno: no renderizado.

Estado:
`RINGS_NON_SATURN_PENDING_REPRESENTATION_DECISION`

No inventar textura de anillos.
Si se añaden, usar radios documentados y representación procedural/schematic declarada.

## Branch patch

Archivos R03:
- `assets/data/solar-r03-shape-overrides.json`
- `assets/ig-sistema-solar-r03.js`
- `es/intereses/sistema-solar/index.html` → controlador R03

El controlador:
- mantiene D canónico para fichas/tablas/comparador;
- crea un clon sólo para el renderer;
- aplica formas R03 en ese clon;
- preserva órbitas, rotación y texturas originales.

Static gate:
- sintaxis JS: PASS;
- 6/6 overrides válidos;
- HTML carga sólo controlador R03: PASS.

## Pendiente para browser gate

IrisGreen estaba offline al final de este intake.

Cuando vuelva:
- WebGL hardware;
- inspect mesh scales;
- capturas Sol/Mercurio/Venus/Tierra/Júpiter/Saturno/Urano/Neptuno;
- raycast;
- 320/390/1440;
- NORMAL/REDUCED/NONE;
- rendimiento;
- fallback sin WebGL;
- HUMAN QA.

## Próximo paso

1. Browser retest.
2. Decidir anillos Júpiter/Urano/Neptuno.
3. Cerrar Sol + 8 planetas.
4. Pasar a lunas/planetas enanos.

NO MAIN · NO PUBLIC DEPLOY.
