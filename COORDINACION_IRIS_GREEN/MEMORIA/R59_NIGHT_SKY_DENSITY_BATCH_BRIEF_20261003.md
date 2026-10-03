# R59 · CIELO NOCTURNO · DENSIDAD + BATCH A01

Fecha: 03/10/2026  
Owner: Senda · R59  
Destino: Atlas A1 · data/procedural  
Gate: `NIGHT_SKY_DENSITY_AND_BATCH_BRIEF_PASS`

Objetivo:
que Cielo tenga densidad útil para observar, buscar y reconocer patrones sin convertirse en catálogo de miles de targets.

## Contrato epistemológico

REAL_DATA:
- RA/Dec;
- magnitud aparente;
- índice/color;
- nombres/designaciones;
- pertenencia a constelación;
- líneas/identidades IAU del donor.

CALCULATION:
- proyección a fecha/lugar;
- altura/azimut;
- qué entra en el campo;
- planetas/luna si más adelante se habilitan.

REPRESENTATION:
- tamaño/brillo del punto en pantalla;
- halo de selección;
- línea de constelación;
- horizonte/atmósfera.

No se inventan estrellas.

## Densidad A01

Por escena desktop/tablet:
- campo visual objetivo: 90°–120° aprox.;
- `BASE_STARS = 180–420` estrellas data-backed;
- selección determinista por magnitud + pertenencia a patrones + campo;
- preferencia visual hasta ~mag 5.5 cuando el dataset lo permita;
- `INTERACTIVE_TARGETS = 24–40`;
- `NAMED_STAR_LABELS = 6–12`;
- `CONSTELLATION_LABELS = 3–6`;
- 2–4 constelaciones protagonistas.

Móvil 320/390:
- `BASE_STARS = 120–260`;
- `INTERACTIVE_TARGETS = 12–24`;
- `CONSTELLATION_LABELS = 2–4`;
- conservar siempre las estrellas que forman el patrón protagonista.

Nunca:
- escena de ~20 estrellas como producto final;
- 6000/8920 targets;
- random sampling que cambie entre cargas;
- labels para cada estrella.

## Batch A01 · 10 escenas

1. `SKY_A01_ORION_TAURUS`
   - invierno;
   - Orión + Tauro;
   - Rigel/Betelgeuse/Aldebarán;
   - aprender forma + contraste de color estelar.

2. `SKY_A02_WINTER_HEXAGON_NORTH`
   - Auriga + Géminis + Can Menor;
   - Capella/Castor/Pollux/Procyon;
   - seguir estrellas brillantes entre constelaciones.

3. `SKY_A03_CIRCUMPOLAR_NORTH`
   - Osa Mayor + Osa Menor;
   - Dubhe/Merak → Polaris;
   - orientación norte.

4. `SKY_A04_LEO_VIRGO`
   - primavera;
   - Leo + Virgo;
   - Regulus + Spica;
   - reconocer cambio estacional.

5. `SKY_A05_ARCTURUS_SPRING_ARC`
   - Boyero + Osa Mayor + Virgo;
   - Arcturus;
   - usar una cadena de estrellas para localizar otra figura.

6. `SKY_A06_SUMMER_TRIANGLE`
   - Lira + Cisne + Águila;
   - Vega/Deneb/Altair;
   - asterismo que conecta tres constelaciones.

7. `SKY_A07_SCORPIUS_SAGITTARIUS`
   - verano, horizonte sur;
   - Antares + región de Sagitario;
   - constelaciones bajas desde 40°N; no falsear altura.

8. `SKY_A08_PEGASUS_ANDROMEDA`
   - otoño;
   - Gran Cuadrado + cadena de Andrómeda;
   - patrón geométrico amplio.

9. `SKY_A09_CASSIOPEIA_PERSEUS`
   - otoño/norte;
   - Cassiopeia + Perseus + Andromeda contextual;
   - navegación por formas.

10. `SKY_A10_AUTUMN_SOUTH_FOMALHAUT`
    - Capricornio/Acuario/Pez Austral;
    - Fomalhaut;
    - aprender a reconocer una estrella brillante en un campo menos denso.

## Reglas de producción Atlas

- data/procedural, no imagen pintada;
- manifest por escena;
- mismo snapshot/versión en toda A01;
- semilla/cálculo determinista;
- contact sheet;
- provenance;
- registrar cuántas estrellas base/targets/labels produce cada escena;
- si una escena queda fuera del rango de densidad, justificar por visibilidad real, no rellenar con estrellas falsas.

## Fuentes

- HYG local snapshot para estrellas;
- IAU/WGSN/constellations del donor;
- JPL solo cuando aparezcan planetas y siempre como cálculo aproximado.

Salida:
`NIGHT_SKY_DENSITY_AND_BATCH_BRIEF_PASS`
