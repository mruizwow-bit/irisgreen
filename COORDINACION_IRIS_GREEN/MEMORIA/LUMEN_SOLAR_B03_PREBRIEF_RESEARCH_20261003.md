# LUMEN · SOLAR B03 · PREBRIEF RESEARCH ONLY

Fecha: 03/10/2026
Owner: Lumen · A7

Estado:
`PREBRIEF_RESEARCH_ONLY_NOT_GENERATION_AUTHORIZATION`

Objetivo:
dejar preparada una propuesta de tanda de 10 para que Senda pueda validar/corregir rápidamente el B03 factual.

## Propuesta de 10

Planetas enanos restantes tras Plutón:
1. Ceres
2. Haumea
3. Makemake
4. Eris

Lunas candidatas de alto valor didáctico:
5. Luna
6. Io
7. Europa
8. Ganímedes
9. Titán
10. Encélado

La selección de lunas NO es canónica hasta que Senda la apruebe.

---

## 1 · Ceres

Fuente primaria:
https://science.nasa.gov/dwarf-planets/ceres/facts/
https://science.nasa.gov/mission/dawn/science/ceres/

Conocido:
- único planeta enano del sistema solar interior;
- casi esférico;
- superficie globalmente gris/oscura y muy craterizada;
- existen depósitos/brillos de sales en varios cráteres;
- Dawn cartografió topografía y morfología reales.

Límite visual:
- si se usa un master genérico, NO hacer de Occator/bright spots un rasgo protagonista obligatorio;
- no inventar océano superficial;
- no false-color como color natural.

Clase candidata:
`REPRESENTATION_WITH_STRONG_OBSERVATIONAL_CONSTRAINTS`.

---

## 2 · Haumea

Fuente:
https://science.nasa.gov/dwarf-planets/haumea/

Conocido:
- cuerpo muy alargado/oval por su rotación rápida;
- estructura probablemente rocosa con recubrimiento de hielo;
- NASA indica que se conoce muy poco de la superficie;
- tiene anillo real y dos lunas, pero eso no obliga a hornearlos en master base.

Límite visual duro:
- NO inventar mapas de superficie, manchas detalladas, cráteres o textura específica;
- el master debe ser muy neutro;
- la forma alargada es el rasgo visual más defendible.

Clase candidata:
`UNKNOWN_SURFACE_REPRESENTATION`.

---

## 3 · Makemake

Fuente:
https://science.nasa.gov/dwarf-planets/makemake/

Conocido:
- Kuiper Belt;
- ligeramente menor que Plutón;
- NASA describe apariencia rojiza-marronácea;
- se han detectado metano y etano congelados;
- conocemos muy poco de su estructura;
- puede desarrollar atmósfera muy tenue cerca de perihelio.

Límite:
- no inventar relieve fino/cartografía;
- no convertir posible atmósfera temporal en halo permanente protagonista.

Clase candidata:
`LOW_DETAIL_REDDISH_ICY_REPRESENTATION`.

---

## 4 · Eris

Fuente:
https://science.nasa.gov/dwarf-planets/eris/

Conocido:
- tamaño parecido a Plutón;
- extremadamente frío;
- NASA señala que probablemente tiene superficie rocosa similar a Plutón;
- conocemos muy poco de su estructura;
- su atmósfera puede colapsar/congelarse cuando está lejos del Sol.

Límite:
- no copiar Plutón;
- no inventar Sputnik-like region;
- no hornear atmósfera permanente;
- textura muy contenida.

Clase candidata:
`LOW_CONFIDENCE_ICY_ROCKY_REPRESENTATION`.

---

## 5 · Luna

Fuente:
https://science.nasa.gov/moon/facts/

Conocido:
- superficie observada/cartografiada extensamente;
- cráteres;
- mares basálticos oscuros;
- tierras altas claras;
- no atmósfera gruesa.

Si el producto quiere cara visible:
se puede basar en geografía observacional real.

Límite:
- no inventar patrón;
- no exagerar color;
- separar REAL_DATA scaffold de REPRESENTATION render.

Clase candidata:
`OBSERVATION_CONSTRAINED_REPRESENTATION`.

---

## 6 · Io

Fuente:
https://science.nasa.gov/jupiter/jupiter-moons/io/facts/

Conocido:
- cuerpo rocoso;
- mundo volcánicamente más activo del sistema solar;
- coloración variada asociada a azufre/compuestos y materiales volcánicos;
- superficie se renueva continuamente;
- atmósfera muy fina de SO2.

Límite:
- no mostrar una erupción concreta como estado base;
- no lava/fuentes activas obligatorias;
- no mapa exacto actual.

Clase candidata:
`VOLCANIC_SURFACE_REPRESENTATION_NO_CURRENT_ERUPTION`.

---

## 7 · Europa

Fuente:
https://science.nasa.gov/jupiter/jupiter-moons/europa/europa-facts/

Conocido:
- superficie de hielo de agua;
- muy reflectante;
- fracturas oscuras/rojizo-marrones;
- relativamente pocos cráteres;
- manchas/material rojizo de composición no completamente conocida.

Límite:
- no mostrar océano interno en master superficial;
- no inventar composición exacta del material rojizo;
- no convertir fracturas en mapa arbitrario “actual”.

Clase candidata:
`ICY_FRACTURED_REPRESENTATION`.

---

## 8 · Ganímedes

Fuente:
https://science.nasa.gov/jupiter/jupiter-moons/ganymede/facts/

Conocido:
- luna más grande del sistema solar;
- superficie de hielo;
- dos terrenos principales:
  - regiones oscuras muy craterizadas;
  - terreno más claro con surcos/ridges;
- cráteres con rayos brillantes/oscuros;
- atmósfera muy tenue.

Límite:
- no auroras como rasgo visual base;
- no océano interior visible;
- no mapa exacto inventado.

Clase candidata:
`ICY_DARK_LIGHT_TERRAIN_REPRESENTATION`.

---

## 9 · Titán

Fuente:
https://science.nasa.gov/saturn/moons/titan/facts/

Conocido:
- única luna con atmósfera densa;
- superficie completamente oscurecida visualmente por haze dorado;
- atmósfera rica en nitrógeno con metano;
- lagos/ríos/mares de hidrocarburos existen, pero no son visibles en color natural global a través de la bruma.

Límite duro:
- master visible-light global debe ser esfera dorado-naranja brumosa;
- NO mostrar mapa de lagos/mares como si fuese visible a simple vista;
- no radar/IR false-color como natural.

Clase candidata:
`OPAQUE_HAZE_VISIBLE_LIGHT_REPRESENTATION`.

---

## 10 · Encélado

Fuentes:
https://science.nasa.gov/mission/cassini/science/enceladus/
https://science.nasa.gov/saturn/moons/enceladus/

Conocido:
- pequeño mundo helado;
- superficie extremadamente brillante/blanca;
- zonas antiguas craterizadas y regiones más jóvenes/lisas;
- fracturas polares (“tiger stripes”) reales;
- plumas/geysers reales y activas.

Límite:
- master base NO debe depender de una pluma dramática;
- si se muestran tiger stripes, que no parezca vista cartográfica exacta si no usamos scaffold;
- pluma puede ser estado separado, no necesariamente base.

Clase candidata:
`BRIGHT_ICY_REPRESENTATION_BASE_NO_PLUME`.

---

# Riesgos científicos principales

## Alta confianza visual
- Luna
- Io
- Europa
- Ganímedes
- Titán
- Encélado
- Ceres

## Apariencia limitada / neutralización necesaria
- Haumea
- Makemake
- Eris

Regla:
`UNKNOWN_SURFACE_DETAIL → DO_NOT_INVENT_DETAIL`

Para Haumea/Makemake/Eris, un master premium no debe compensar falta de conocimiento con textura ficticia.

---

# Recomendación a Senda

Validar:
1. si estas 6 lunas son las prioritarias de producto;
2. si Haumea/Makemake/Eris deben:
   - tener master deliberadamente neutro,
   - o quedar HOLD por apariencia insuficientemente constreñida;
3. si Ceres puede usar scaffold observacional Dawn para mayor fidelidad;
4. si Luna debe ser cara visible canónica o vista neutral/observacional específica.

Gate esperado:
`SOLAR_B03_DWARF_MOONS_FACTUAL_BRIEF_PASS`

Hasta ese gate:
**NO IMAGE GENERATION.**
