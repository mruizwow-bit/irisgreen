# ASTRA · SOLAR B03 · DWARF PLANETS + MOONS · FACTUAL GATE

Fecha: 03/10/2026
Owner temporal del gate: Astra
Base: Lumen prebrief commit `a9fcc38dd4ebee997e1568a85dd512bb7568911d`

Gate:
`SOLAR_B03_DWARF_MOONS_FACTUAL_BRIEF_PASS`

## Selección aprobada

1. Ceres
2. Haumea
3. Makemake
4. Eris
5. Luna
6. Io
7. Europa
8. Ganímedes
9. Titán
10. Encélado

La selección de las seis lunas pasa por valor didáctico y diversidad física/visual. Callisto queda candidato prioritario para la siguiente tanda, no descartado.

## Decisiones de representación

### 1 · Ceres
Clase:
`OBSERVATION_CONSTRAINED_REPRESENTATION_WITH_DAWN_SCAFFOLD`

Autorizado:
- usar cartografía/observaciones Dawn como factual scaffold;
- conservar forma global, distribución general de albedo, cráteres y sales como restricciones;
- final first-party, sin logos ni captura raw como textura final obligatoria.

No:
- océano superficial;
- falso color;
- convertir Occator/bright spots en rasgo protagonista obligatorio.

Fuentes:
https://science.nasa.gov/dwarf-planets/ceres/facts/
https://science.nasa.gov/mission/dawn/science/ceres/

### 2 · Haumea
Clase:
`UNKNOWN_SURFACE_ELONGATED_ICY_REPRESENTATION`

Autorizado:
- forma claramente oval/alargada;
- superficie clara/helada muy neutra;
- microtextura mínima.

No:
- mapas, cráteres o manchas inventadas;
- atmósfera visible afirmada;
- anillo horneado en el master base.

El anillo real puede aparecer como estado/overlay separado en producto.

Fuente:
https://science.nasa.gov/dwarf-planets/haumea/

### 3 · Makemake
Clase:
`LOW_DETAIL_REDDISH_BROWN_ICY_REPRESENTATION`

Autorizado:
- tono rojizo-marrón;
- acabado helado de bajo detalle;
- variación tonal suave.

No:
- relieve/cartografía inventada;
- halo atmosférico permanente;
- textura específica que parezca observada.

Fuente:
https://science.nasa.gov/dwarf-planets/makemake/

### 4 · Eris
Clase:
`LOW_CONFIDENCE_PALE_ICY_ROCKY_REPRESENTATION`

Autorizado:
- cuerpo muy frío, claro/pálido;
- detalle superficial muy contenido;
- representación compatible con superficie helada/rocosa sin afirmar mapa.

No:
- copiar Plutón;
- Sputnik-like region;
- atmósfera permanente;
- rasgos geográficos específicos.

Fuente:
https://science.nasa.gov/dwarf-planets/eris/

### 5 · Luna
Clase:
`OBSERVATION_CONSTRAINED_NEARSIDE_MASTER`

Decisión:
- usar cara visible canónica, orientación norte-arriba;
- maria, tierras altas y cráteres basados en geografía observada;
- master full-disk con iluminación neutral suficiente para reconocimiento;
- fase lunar debe ser runtime/state, no quedar horneada como única lectura.

Fuente:
https://science.nasa.gov/moon/facts/

### 6 · Io
Clase:
`OBSERVATION_CONSTRAINED_VOLCANIC_SURFACE_REPRESENTATION`

Autorizado:
- paleta amarilla/rojiza/oscura compatible con azufre/material volcánico;
- superficie volcánica de alto contraste.

No:
- erupción concreta como estado base;
- fuentes de lava obligatorias;
- fingir mapa actualizado exacto.

Fuente:
https://science.nasa.gov/jupiter/jupiter-moons/io/facts/

### 7 · Europa
Clase:
`OBSERVATION_CONSTRAINED_ICY_FRACTURED_REPRESENTATION`

Autorizado:
- hielo claro;
- fracturas lineales oscuras/rojizo-marrones;
- pocos cráteres;
- chaos terrain solo de forma contenida.

No:
- océano interior visible;
- afirmar composición exacta de material rojizo;
- pluma como rasgo base.

Fuente:
https://science.nasa.gov/jupiter/jupiter-moons/europa/europa-facts/

### 8 · Ganímedes
Clase:
`OBSERVATION_CONSTRAINED_ICY_DARK_LIGHT_TERRAIN_REPRESENTATION`

Autorizado:
- regiones oscuras craterizadas;
- regiones claras acanaladas/grooved;
- rayos de cráter discretos.

No:
- auroras;
- océano interior visible;
- mapa inventado.

Fuente:
https://science.nasa.gov/jupiter/jupiter-moons/ganymede/facts/

### 9 · Titán
Clase:
`OPAQUE_HAZE_VISIBLE_LIGHT_REPRESENTATION`

Master base:
- esfera dorado-naranja;
- bruma atmosférica densa;
- superficie NO legible directamente en visible.

No:
- mostrar lagos/mares como si fueran visibles en color natural global;
- radar/IR false-color como natural;
- despejar la atmósfera para enseñar superficie.

Fuente:
https://science.nasa.gov/saturn/moons/titan/facts/

### 10 · Encélado
Clase:
`OBSERVATION_CONSTRAINED_BRIGHT_ICY_BASE_NO_PLUME`

Autorizado:
- superficie blanca/brillante;
- mezcla de terreno craterizado y más liso;
- fracturas polares/tiger stripes discretas.

No:
- pluma dramática como master base;
- océano interior visible;
- cartografía exacta fingida.

Las plumas pueden ser estado/asset separado.

Fuente:
https://science.nasa.gov/saturn/moons/enceladus/

## Reglas transversales

- `KNOWN_GEOMETRY_IS_NOT_PERMISSION_TO_INVENT_SURFACE_DETAIL`
- `UNKNOWN_SURFACE_DETAIL → DO_NOT_INVENT_DETAIL`
- `OBSERVATIONAL_SCAFFOLD_ALLOWED_WHEN_SOURCE_EXISTS`
- `TEMPORARY_OR_TRANSIENT_PHENOMENA_NOT_BAKED_AS_BASE_STATE`
- `VISIBLE_LIGHT_BASE_DOES_NOT_USE_FALSE_COLOR_AS_NATURAL_COLOR`
- `REPRESENTATION_LABEL_REQUIRED_WHERE_APPEARANCE_IS_RECONSTRUCTED`
- 10 masters individuales → 1 contact sheet → review de tanda.
- Sin revisión cuerpo por cuerpo.
- Sin texto horneado en masters.
- Datos y labels fuera del raster.

## Autorización

Lumen queda autorizado a generar B03 bajo este brief.

Salida esperada:
`SOLAR_B03_DWARF_MOONS_10_MASTERS_READY_FOR_REVIEW`

No main.
No deploy.
