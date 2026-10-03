# R59 · SOLAR B02 · BRIEF FACTUAL VISUAL

Fecha: 03/10/2026  
Owner factual: Senda · R59  
Destino: Lumen A7  
Gate: `SOLAR_B02_FACTUAL_BRIEF_PASS`

Alcance:
Marte · Júpiter · Saturno · Urano · Neptuno.

Regla común:
- 1 master por planeta;
- `NEW_FIRST_PARTY_MASTER`;
- clase pública `REPRESENTATION`;
- fondo transparente;
- sin estrellas/texto/logos;
- sin lunas;
- sin escala relativa horneada;
- donors actuales = `REFERENCE_VALIDATION_ONLY`;
- runtime controla escala/posición/movimiento.

## Marte
Estado: `BASE_RUST_NEUTRAL`.

REAL_DATA:
- planeta rocoso;
- polvo/suelo con hierro oxidado;
- apariencia global rojiza, pero con marrones, dorados y tonos tostados;
- atmósfera muy fina;
- cráteres, volcanes, cañones y casquetes polares existen.

REPRESENTATION permitida:
- disco rocoso rojizo-tostado;
- variación de albedo oscura/sutil;
- relieve moderado;
- haze atmosférico muy fino.

NO:
- lava activa;
- tormenta global de polvo como estado permanente;
- casquete polar de tamaño “actual”;
- Olympus Mons/Valles Marineris dibujados como cartografía exacta sin scaffold geográfico;
- cielo/atmósfera gruesa.

## Júpiter
Estado: `BASE_BANDED_NEUTRAL`.

REAL_DATA:
- gigante gaseoso, sin superficie sólida;
- bandas/zones y belts de nubes;
- crema/blanco/tostado/naranja;
- tormentas;
- Gran Mancha Roja es longeva pero cambia de tamaño/color/forma.

REPRESENTATION:
- bandas legibles y volumétricas;
- remolinos moderados;
- Gran Mancha Roja permitida pequeña/moderada para reconocimiento, nunca como geometría “actual”.

NO:
- superficie rocosa;
- patrón exacto de Juno/Hubble copiado;
- GRS sobredimensionada;
- anillos visibles dominantes;
- lunas/sombras.

## Saturno
Estado: `BASE_RINGED_NEUTRAL`.

REAL_DATA:
- gigante gaseoso sin superficie sólida;
- nubes en tonos amarillos, marrones y grises;
- sistema de anillos compuesto sobre todo por hielo y roca/polvo;
- anillos visualmente claros; Cassini Division real.

REPRESENTATION:
- globo amarillo pálido/tostado;
- bandas suaves;
- anillos blancos/gris-hielo;
- Cassini Division legible;
- inclinación de anillos moderada = `REPRESENTATION_COMPOSITION`, no vista actual.

NO:
- lunas;
- sombras de lunas;
- tormenta/hexágono como rasgo frontal obligatorio;
- color oro saturado;
- anillos gruesos/macizos.

## Urano
Estado: `BASE_PALE_BLUE_GREEN`.

REAL_DATA:
- gigante helado sin superficie sólida;
- metano atmosférico produce color azul-verde;
- suele verse relativamente uniforme en visible;
- nubes brillantes existen pero cambian;
- anillos reales, oscuros y finos.

REPRESENTATION:
- disco pálido cian/azul-verde;
- haze uniforme;
- detalle nuboso mínimo.

NO:
- anillos horneados en B02 base;
- tormentas brillantes permanentes;
- superficie;
- azul eléctrico;
- “giro tumbado” convertido en una textura diagonal inventada.

## Neptuno
Estado: `BASE_BLUE_CYAN_NEUTRAL`.

REAL_DATA:
- gigante helado sin superficie sólida;
- metano contribuye al color azul;
- nubes y tormentas son variables;
- dark spots aparecen y desaparecen;
- NASA advierte que el azul muy profundo de muchas imágenes Voyager fue procesado para resaltar detalles; reprocesados modernos muestran Urano y Neptuno más parecidos de lo que se creyó.

REPRESENTATION:
- azul/cian algo más intenso que Urano, pero no cobalt/electric-blue;
- bandas/nubes sutiles;
- pocas nubes altas claras.

NO:
- Great Dark Spot permanente;
- anillos horneados;
- superficie;
- copiar falso color infrarrojo/realzado como visible natural.

## Reuse / prioridad

Los 5:
- `P0`;
- `NEW_FIRST_PARTY_MASTER`;
- 1 estado inicial;
- donors actuales solo validación.

## Fuentes primarias verificadas 03/10/2026

- NASA Science · Mars Facts
- NASA Science · Jupiter Facts
- NASA Science · Saturn Facts
- NASA Science · Uranus Facts
- NASA Science · Neptune Facts

Especialmente importante:
Neptuno no debe heredar el “azul eléctrico Voyager” como color natural por defecto.

Salida:
`SOLAR_B02_FACTUAL_BRIEF_PASS`
