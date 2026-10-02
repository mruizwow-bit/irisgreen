# R59 · INTERÉS 02 · SISTEMA SOLAR · BRIEF FACTUAL VISUAL BATCH 01

Fecha: 02/10/2026  
Owner: **Senda · R59**  
Destino: **Lumen A7 · Visual Creation Owner**  
Gate: `INTEREST_02_SOLAR_VISUAL_FACTUAL_ASSET_BRIEF_PASS`

Scope:
- Sol
- Mercurio
- Venus
- Tierra

Este brief precede cualquier generación de Lumen para B01.

No runtime. No imágenes generadas por Senda. No main. No B02/B03. No Interés 05.

---

# 1 · CONTRATO COMÚN B01

## Función de producto

Estos cuatro masters establecen el lenguaje visual first-party para el Sistema Solar V2.

Uso previsto:
- comparación de cuerpos;
- selección/foco individual;
- tarjetas/escena first viewport;
- reutilización posterior en runtime.

No deben codificar:
- distancia al Sol;
- escala relativa entre cuerpos;
- posición orbital;
- fase “actual”;
- fecha;
- trayectoria;
- datos textuales.

El runtime será responsable de escala, posición, movimiento y contexto.

## Clasificación epistemológica

Todos los masters finales B01 serán:

`REPRESENTATION`

No son:
- fotografías;
- observaciones en tiempo real;
- mapas científicos exactos;
- productos de teledetección;
- estado actual del cuerpo.

Pueden basarse en `REAL_DATA` y referencias observacionales, pero el master generado debe etiquetarse públicamente como:
- ES: **Imagen hecha por ordenador**
- EN: **Computer-made image**

## Contrato visual compartido

Obligatorio:
- un cuerpo por master;
- disco completo;
- fondo transparente;
- sin estrellas;
- sin fondo espacial;
- sin texto;
- sin logos;
- sRGB;
- cuerpo centrado;
- margen suficiente para packaging/safe-crop;
- familia visual coherente;
- iluminación de presentación coherente entre los planetas;
- no hornear escala relativa;
- no añadir satélites;
- no añadir anillos donde no existen;
- no añadir auroras, sondas, ciudades, etiquetas ni efectos narrativos;
- no usar brillo “cinematográfico” que oculte la anatomía/atmósfera real;
- no convertir falsos colores científicos en color natural sin indicarlo.

Para Mercurio, Venus y Tierra:
- representación casi de disco completo / iluminación casi frontal;
- sombreado suave únicamente para dar volumen;
- no implicar una fase astronómica actual.

Para el Sol:
- no usar terminador planetario;
- debe leerse como cuerpo autoemisivo.

---

# 2 · SOL

## PURPOSE

Master de referencia de la estrella central.

Debe permitir:
- reconocer inmediatamente que no es un planeta;
- comparar tamaño mediante runtime;
- servir de ancla visual del selector “Tamaño”.

## REAL_DATA

Hechos visuales/físicos que sí pueden informar el master:
- el Sol es una esfera de plasma, no tiene superficie sólida;
- la capa que vemos en luz visible es la fotosfera;
- la fotosfera emite la mayor parte de la luz visible;
- NASA describe esa luz visible como **white light**;
- desde la superficie terrestre puede parecer amarillo por dispersión atmosférica;
- la fotosfera ronda 5.500 °C;
- las manchas solares son regiones temporalmente más frías y oscuras;
- las manchas cambian de número, forma y posición con el tiempo;
- prominencias, fulguraciones y eyecciones son fenómenos variables, no rasgos permanentes.

Fuentes primarias verificadas 02/10/2026:
- NASA Science · Sun Facts: https://science.nasa.gov/sun/facts/
- NASA Science · Heliopedia / Photosphere: https://science.nasa.gov/reference/the-heliopedia/
- NASA Science · Sunspots: https://science.nasa.gov/sun/sunspots/

Donor local:
- `sistema-solar.json` snapshot 24/09/2026.
- `tex/sol.webp` = Solar System Scope / CC BY 4.0.
- `sol.webp` = render Iris Green derivado de ese mapa.

## REPRESENTATION · FACTUAL_DESCRIPTORS

Lumen puede representar:
- disco esférico autoemisivo;
- base **blanca / blanco cálido muy pálido**, no naranja saturado;
- textura fotosférica fina y orgánica;
- granulación visual muy sutil;
- leve oscurecimiento hacia el borde si ayuda a volumen;
- variación tonal tenue en la fotosfera.

Permitido:
- cero manchas solares;
o
- muy pocas manchas pequeñas/no dominantes como señal de actividad genérica.

Preferencia B01:
**sin manchas dominantes** para que el master no congele un “estado actual” concreto.

## NON_INFERABLE / NO MOSTRAR COMO HECHO

No:
- llamar “superficie sólida” a la fotosfera;
- grandes llamaradas permanentes;
- corona blanca extensa alrededor del disco en vista ordinaria;
- arcos/prominencias gigantes por decoración;
- patrón concreto de manchas como “actual”;
- naranja/rojo de filtros científicos presentado como color natural;
- textura de fuego/llamas;
- grietas;
- bordes duros de roca.

## STATES

`BASE_NEUTRAL_VISIBLE_LIGHT` · 1 estado.

No estado “activo” en B01.

## PRIORITY

`P0`

## REUSE / NEW

`NEW_FIRST_PARTY_MASTER`

Donor actual:
`REFERENCE_VALIDATION_ONLY`

No usar el asset actual como input directo ni copiar su textura en el master nuevo.

## REPRESENTATION_LIMITS

- no es observación;
- no es imagen de una fecha;
- no codifica actividad solar actual;
- no representa UV/EUV/rayos X;
- no incluye corona de eclipse.

---

# 3 · MERCURIO

## PURPOSE

Primer planeta rocoso de la familia.

Debe enseñar visualmente:
- cuerpo pequeño/rocoso;
- superficie antigua, muy craterizada;
- ausencia de una atmósfera visible importante.

La escala relativa la aplica runtime.

## REAL_DATA

Hechos permitidos:
- superficie parecida a la Luna por su abundancia de cráteres;
- grandes cuencas de impacto;
- llanuras relativamente suaves;
- acantilados/escarpes relacionados con contracción del planeta;
- color aproximado para el ojo humano: **gris parduzco / greyish-brown**;
- algunos cráteres tienen rayos más brillantes;
- no tiene una atmósfera densa: posee una exosfera muy tenue;
- el hielo polar existe en cráteres permanentemente sombreados, no como casquete blanco visible global.

Fuente primaria verificada 02/10/2026:
- NASA Science · Mercury Facts: https://science.nasa.gov/mercury/facts/

Donor local:
- `tex/mercurio.webp` basado en NASA/JHUAPL/Carnegie · MESSENGER.
- `mercurio.webp` render Iris Green derivado.
- snapshot factual 24/09/2026.

## REPRESENTATION · FACTUAL_DESCRIPTORS

Lumen puede representar:
- esfera rocosa;
- paleta baja en saturación;
- gris medio + matiz marrón muy suave;
- cráteres de tamaños variados;
- algunos rayos de eyección claros;
- zonas de terreno más liso intercaladas;
- relieve discreto, sin exageración;
- borde limpio, sin halo atmosférico visible.

El resultado debe leerse primero como:
**mundo rocoso craterizado y casi sin atmósfera**.

## NON_INFERABLE / NO MOSTRAR COMO HECHO

No:
- rojo tipo Marte;
- superficie naranja incandescente;
- lava visible;
- llamas por cercanía al Sol;
- cielo/halo atmosférico grueso;
- nubes;
- casquetes polares blancos;
- océanos;
- vegetación;
- patrón inventado presentado como mapa exacto;
- cuenca Caloris u otro accidente nombrado si el generador no puede conservar su geografía con fidelidad.

## STATES

`BASE_NEUTRAL` · 1 estado.

## PRIORITY

`P0`

## REUSE / NEW

`NEW_FIRST_PARTY_MASTER`

Donor MESSENGER actual:
`REFERENCE_VALIDATION_ONLY`

No copiar píxeles/textura del donor en el master generado.

## REPRESENTATION_LIMITS

La distribución exacta de cráteres de un master generativo no es cartografía científica.

Debe poder decirse:
“Representación first-party basada en la apariencia global observada por MESSENGER”.

No:
“Mapa real de Mercurio”.

---

# 4 · VENUS

## PURPOSE

Diferenciar un planeta rocoso cuya superficie **no es visible desde el espacio en luz visible** debido a su atmósfera/nubes densas.

Debe contrastar claramente con Mercurio y Tierra.

## REAL_DATA

Hechos permitidos:
- atmósfera muy densa, principalmente CO₂;
- nubes de ácido sulfúrico;
- capa de nubes persistente que oculta la superficie en luz visible;
- NASA muestra/describe Venus como un globo **creamy-colored / cloud-swaddled**;
- las nubes visibles son en gran parte blancas/crema;
- en ultravioleta aparecen patrones con mucho más contraste;
- la superficie rocosa se conoce en gran parte mediante radar, no porque sea visible a través de las nubes en una vista óptica normal.

Fuentes primarias verificadas 02/10/2026:
- NASA Science · Venus Facts: https://science.nasa.gov/venus/venus-facts/
- NASA Science · Venus: https://science.nasa.gov/venus/
- NASA/JPL · Newly-Processed Views of Venus from Mariner 10:
  https://science.nasa.gov/resource/newly-processed-views-of-venus-from-mariner-10/

Donor local:
- `tex/venus.webp` = atmósfera de Venus procesada por Oleg Pluton, vía Stellarium, CC BY 4.0.
- `venus.webp` = render Iris Green derivado.
- snapshot 24/09/2026.

## REPRESENTATION · FACTUAL_DESCRIPTORS

Lumen puede representar:
- globo completamente cubierto por nubes;
- paleta crema / marfil / amarillo muy pálido;
- superficie ópticamente opaca;
- detalle de nubes **sutil**;
- bandas/remolinos de contraste bajo;
- borde ligeramente difuso por atmósfera densa;
- volumen suave.

Debe leerse como:
**planeta cubierto por una capa global de nubes**.

## NON_INFERABLE / NO MOSTRAR COMO HECHO

No:
- terreno volcánico visible a través de las nubes;
- continentes;
- cráteres visibles;
- mapa radar naranja usado como “color real”;
- Venus azul de observaciones UV presentado como natural color;
- volcanes en erupción;
- rayos/tormentas dramáticas;
- vida en las nubes;
- “océanos”;
- detalles de superficie inventados.

## STATES

`BASE_CLOUD_TOPS_NEUTRAL` · 1 estado.

## PRIORITY

`P0`

## REUSE / NEW

`NEW_FIRST_PARTY_MASTER`

Donor Stellarium:
`REFERENCE_VALIDATION_ONLY`

## REPRESENTATION_LIMITS

- representa apariencia global de nubes, no una fotografía;
- no es un mapa meteorológico fechado;
- los patrones concretos de nube del master no deben describirse como observados;
- no representa la topografía oculta.

---

# 5 · TIERRA

## PURPOSE

Cuerpo de referencia humana y visual para la lente “Tamaño”.

Debe ser inmediatamente reconocible pero no convertirse en un “Blue Marble actual” falso.

## REAL_DATA

Hechos permitidos:
- el océano global cubre aproximadamente **71 %** de la superficie;
- desde el espacio la Tierra se ve predominantemente azul;
- nubes de agua visibles como estructuras blancas;
- continentes muestran verdes, marrones/tostados y zonas blancas de hielo/nieve;
- el borde atmosférico puede verse como una capa/haze azulada muy fina;
- la nubosidad y el tiempo cambian continuamente;
- un “Blue Marble” compuesto puede mezclar datos de diferentes momentos.

Fuentes primarias verificadas 02/10/2026:
- NASA Science · Earth Facts: https://science.nasa.gov/earth/facts/
- NASA Science · Earth atmosphere / limb:
  https://science.nasa.gov/mission/webb/science-overview/science-explainers/what-would-earths-atmosphere-look-like-from-the-james-webb-space-telescope/
- NASA Science · Twin Blue Marbles:
  https://science.nasa.gov/resource/twin-blue-marbles/

Donor local:
- `tex/tierra-dia.webp`
- `tex/tierra-noche.webp`
- `tex/tierra-relieve-nubes.webp`
- Solar System Scope / three.js donor · CC BY 4.0.
- `tierra.webp` render Iris Green derivado.
- snapshot 24/09/2026.

## REPRESENTATION · FACTUAL_DESCRIPTORS

Lumen puede representar:
- océanos azul profundo/medio;
- continentes reconocibles y proporcionados;
- tierras verdes/marrones/tostadas;
- hielo/nieve blancos donde corresponda;
- nubes blancas en patrones naturales;
- atmósfera como halo **muy fino** azul;
- esfera completa;
- vista diurna.

Composición canónica B01:
- hemisferio con **África + Europa + Atlántico** reconocibles;
- norte aproximadamente arriba;
- nubosidad suficiente para leer atmósfera, pero sin ocultar por completo la geografía.

Esta elección de hemisferio es `REPRESENTATION_COMPOSITION`, no un “estado actual”.

## NON_INFERABLE / NO MOSTRAR COMO HECHO

No:
- patrón meteorológico presentado como “hoy”;
- huracán concreto salvo fuente/fecha;
- incendios/fuego visible;
- fronteras políticas;
- texto;
- luces de ciudades en el mismo master diurno;
- auroras;
- halo atmosférico enorme;
- continentes deformados/inventados;
- islas ficticias;
- nivel del mar o hielo actual inferido a precisión científica;
- color neón/saturación extrema.

## STATES

`BASE_DAY_NEUTRAL` · 1 estado.

No noche en B01.

## PRIORITY

`P0`

## REUSE / NEW

`NEW_FIRST_PARTY_MASTER`

Donor Solar System Scope:
`REFERENCE_VALIDATION_ONLY`

## REPRESENTATION_LIMITS

- las nubes son representación genérica, no meteorología de una fecha;
- la geografía debe ser reconocible, pero el master no sustituye un mapa;
- no presentar la imagen como fotografía NASA;
- el halo azul se exagera solo lo mínimo necesario para legibilidad.

---

# 6 · TABLA DE SALIDA PARA LUMEN

| Cuerpo | PURPOSE | Clase asset | Estado | Priority | Reuse/New |
|---|---|---|---|---|---|
| Sol | Ancla estelar + comparación | REPRESENTATION | BASE_NEUTRAL_VISIBLE_LIGHT | P0 | NEW |
| Mercurio | Rocoso craterizado / casi sin atmósfera | REPRESENTATION | BASE_NEUTRAL | P0 | NEW |
| Venus | Planeta cubierto por nubes | REPRESENTATION | BASE_CLOUD_TOPS_NEUTRAL | P0 | NEW |
| Tierra | Referencia humana / comparación | REPRESENTATION | BASE_DAY_NEUTRAL | P0 | NEW |

Donors actuales:
**KEEP solo como referencia/validación; no como masters B01.**

---

# 7 · CRITERIOS DE REVISIÓN VISUAL B01

Lumen no debe enviar a review un master si falla cualquiera de estos puntos.

## Sol
- parece estrella autoemisiva;
- blanco/blanco cálido, no esfera naranja en llamas;
- no actividad transitoria dominante;
- no corona de eclipse como borde permanente.

## Mercurio
- gris parduzco;
- craterización creíble;
- sin atmósfera visible;
- no parece Marte o Luna blanca.

## Venus
- superficie completamente oculta;
- crema/nubes;
- no radar/UV disfrazado de color natural;
- no paisaje visible.

## Tierra
- océano azul dominante;
- geografía reconocible;
- nube blanca natural;
- halo fino;
- no meteorología “actual” inventada.

## Familia
- cuatro discos completos;
- composición coherente;
- fondo transparente;
- sin texto;
- sin escala relativa horneada;
- sin elementos extra.

---

# 8 · HANDOFF

Tras este PASS:

`LUMEN B01 STATUS = AUTHORIZED_TO_GENERATE`

Siguiente gate de Lumen:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_READY_FOR_REVIEW`

Lumen produce solo:
- Sol;
- Mercurio;
- Venus;
- Tierra.

Después STOP visual.

B02/B03 siguen HOLD.

Interés 05:
`QUEUED_NOT_IMMEDIATE`.

---

# 9 · ESTADO FINAL

`INTEREST_02_SOLAR_VISUAL_FACTUAL_ASSET_BRIEF_PASS`

Senda STOP.
