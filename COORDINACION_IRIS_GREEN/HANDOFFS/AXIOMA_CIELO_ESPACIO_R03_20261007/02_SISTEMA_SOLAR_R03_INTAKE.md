# AXIOMA · Sistema Solar R03 · intake del runtime volumétrico

Fecha: 2026-10-07
Estado: `AXIOMA_TEMP_COVER_CIELO_ESPACIO_R03_ACTIVE`

## Base encontrada

Runtime:
- `assets/ig-sistema-solar.js` · shell/UI/fallback accesible.
- `assets/ig-sistema-solar-3d.js` · bundle Three.js 0.186.0 + motor 3D.
- `es/intereses/sistema-solar/sistema-solar.json` · datos/fuentes.
- `es/intereses/sistema-solar/cielo-fondo.json` · cielo de fondo.
- `img/intereses/sistema-solar/tex/` · mapas locales.

## Decisión

**NO REBUILD.**

El runtime actual ya cumple `TRUE_3D_WHERE_OBJECT_HAS_REAL_VOLUME` para el núcleo:
- Sol/planetas/enanos se crean con geometría esférica real;
- lunas seleccionadas con geometría esférica real;
- Saturno usa `RingGeometry`;
- raycast contra malla;
- cámara orbital;
- iluminación solar;
- Tierra con día/noche/nubes;
- Haumea ya usa tres ejes;
- posiciones planetarias calculadas con elementos JPL;
- modo `clara` declarado como no a escala;
- modo `real` conserva tamaño/distancia en la misma proporción;
- fallback sin WebGL mantiene fichas/datos.

## Alcance cargado

Datos:
- 14 cuerpos principales: Sol, 8 planetas, Ceres, Plutón, Haumea, Makemake, Eris.
- 70 lunas documentadas.
- 21 lunas montadas en el runtime 3D actual, incluida la Luna.

Visual aprobado:
- `SOLAR_FOUNDATION_FINAL_10_MASTERS_PASS` · KEEP_LOCKED.
- `SOLAR_B03_DWARF_MOONS_10_MASTERS_FINAL_PASS` · KEEP_LOCKED.

Los PNG aprobados NO se reproyectan como textura trasera de una esfera.
Para el volumen se conservan los mapas equirectangulares documentados de `tex/`.

## Findings R03

### S03-01 · forma planetaria

El motor soporta `datos.ejes`, pero sólo Haumea los aporta.
Por tanto los planetas se dibujan como esferas perfectas.

Esto es perceptualmente relevante en:
- Júpiter;
- Saturno;

y medible también en:
- Mercurio;
- Tierra;
- Marte;
- Urano;
- Neptuno.

Fuentes NASA/NSSDCA:
- Mercury: Req 2440.5 km · Rp 2438.3 km · Rvol 2439.7 km.
- Earth: Req 6378.137 · Rp 6356.752 · Rvol 6371.0.
- Mars: Req 3396.2 · Rp 3376.2 · Rvol 3389.5.
- Jupiter: Req 71492 · Rp 66854 · Rvol 69911.
- Saturn: Req 60268 · Rp 54364 · Rvol 58232.
- Uranus: Req 25559 · Rp 24973 · Rvol 25362.
- Neptune: Req 24764 · Rp 24341 · Rvol 24622.
- Venus: Req = Rp = Rvol = 6051.8.

Patch:
- añadir `ejes` como diámetros [ecuatorial, ecuatorial, polar];
- añadir `diametro_modelo` = 2×radio volumétrico;
- pasar una copia de datos al renderer donde `diametro` se sustituye sólo para la escala geométrica.
- las fichas siguen mostrando el diámetro ecuatorial original.

### S03-02 · anillos

Los datos dicen:
- Júpiter: anillos;
- Saturno: anillos;
- Urano: anillos;
- Neptuno: anillos.

El motor sólo construye físicamente los de Saturno.

No inventar anillos ni texturas:
- Saturno = KEEP.
- Jupiter/Uranus/Neptune = `KNOWN_RING_SYSTEM__NOT_RENDERED_IN_CURRENT_3D` hasta disponer de representación factual y visible apropiada.

No bloquea el primer gate del Sistema Solar principal, pero queda abierto.

### S03-03 · apariencia de enanos

`recreacion=true` en Haumea/Makemake/Eris.

El propio sitio declara mapas imaginados para algunos cuerpos.
B03 se tratará después del bloque principal.

Regla R03:
`OBSERVED/DERIVED_APPEARANCE` o `UNKNOWN_APPEARANCE_REPRESENTATION`.
No presentar cartografía inventada como observada.

### S03-04 · lunas

70 documentadas, 21 montadas en 3D.
Es correcto para el bloque principal.

No escalar lunas todavía:
orden de trabajo = Sistema Solar principal → B03 lunas/planetas enanos.

## Gate actual

`SOLAR_R03_EXISTING_TRUE_3D_CORE_KEEP__SHAPE_DATA_PATCH_REQUIRED`

NO MAIN · NO PUBLIC DEPLOY · NO REGENERATE LOCKED ART.
