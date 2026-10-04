# LUMEN · INTERÉS 22 · VIDA MARINA Y PECES · CONTRATO VISUAL / EXPERIENCIA

Fecha: 04/10/2026
Owner visual: **Lumen · A7**
Fuente de producto: María
Issue canónica: #323

Estado:
`INTEREST_22_LIGHT_REVEAL_VISUAL_CONTRACT_PASS`

## Frase central

**En Fósiles cavas para encontrar. Aquí alumbras para ver.**

La diferencia estructural es obligatoria:

- Fósiles = descubrimiento irreversible; lo excavado queda visible.
- Vida marina = revelado temporal; al salir del haz, la oscuridad vuelve.

No convertir esta experiencia en:
- Fósiles con agua;
- acuario con peces en loop;
- barra de profundidad con iconos;
- cards → click → read.

## Mundo

Una columna de agua vertical dividida en cinco zonas:

1. epipelágica · 0–200 m
2. mesopelágica · 200–1000 m
3. batipelágica · 1000–4000 m
4. abisopelágica · 4000–6000 m
5. hadal · 6000–11 000 m

La profundidad debe expresarse visualmente, no solo en copy.

Variables de producto dadas por María:
- luz disponible;
- pérdida de color;
- presión;
- temperatura.

Estas variables son datos/runtime.
Lumen no debe hornearlas como números/texto dentro del raster.

## Gesto principal

`MOVE_LIGHT → REVEAL → DARKNESS_RETURNS`

La persona mueve una linterna de cono ancho.

Dentro del haz:
- se revela el cuerpo.

Fuera del haz:
- vuelve a oscuridad.

En borde de haz:
- iluminación parcial continua.

Regla:
`NO_BINARY_CREATURE_ON_OFF`

La iluminación parcial debe producirse por máscara/mezcla espacial de estados, no por encendido discreto del sprite.

## Reutilización mesopelágica existente

Paquete:
`MAR_22_MESO_PACKAGING_PASS`

Tres especies KEEP_LOCKED:
- pez hacha;
- pez linterna;
- calamar de cristal.

Cada una ya dispone de:
- `*-luz.png`
- `*-oscuro.png`

Contrato existente:
- mismo canvas;
- misma pose;
- mismo tamaño;
- mismo centro;
- desplazamiento final [0,0].

Esto es exactamente compatible con iluminación píxel-a-píxel mediante máscara del haz.

NO reabrir:
- anatomía;
- estilo;
- color;
- iluminación artística;
- geometría.

## Qué pertenece a runtime, NO al asset

Motor/código debe resolver:
- agua;
- gradiente/absorción de luz por profundidad;
- cambio de zona;
- oscuridad real;
- cono de linterna;
- máscara parcial por píxel;
- escala relativa por tamaño real;
- composición de criaturas;
- bioluminiscencia fija;
- lista accesible de luces detectadas;
- teclado;
- touch;
- motion modes;
- carga lazy por zona.

No hornear en imágenes:
- agua;
- haz;
- nieve/partículas;
- burbujas;
- profundidad numérica;
- presión;
- temperatura;
- texto;
- UI.

## Bioluminiscencia

Debe funcionar como llamada visual fija en la oscuridad.

Principio:
`BIOLUMINESCENCE_IS_SIGNAL_NOT_ANIMATION`

- fotóforos fijos;
- bulbos/luz propia fija;
- no parpadeo;
- no pulso autónomo;
- no movimiento automático.

Puede ser parte visible del estado oscuro cuando factual/visualmente corresponda.

## NO MOVIMIENTO AUTOMÁTICO

Contrato duro de producto:
`USER_ACTION_ONLY_VISUAL_CHANGE`

No:
- agua ondulando;
- peces nadando en loop;
- partículas cayendo;
- bioluminiscencia titilando;
- cámara moviéndose;
- drift automático.

La escena cambia solo por:
- mover haz;
- cambiar zona;
- seleccionar/detectar;
- acción explícita equivalente.

## Motion

NORMAL:
- respuesta directa al movimiento del haz;
- sin autoplay.

REDUCED:
- sin transición decorativa entre zonas;
- respuesta inmediata/discreta.

NONE:
- tampoco debe introducir movimiento continuo;
- acceso por pasos/teclado/lista detectada debe preservar toda la información.

## Teclado / alternativa al barrido

La persona no debe depender de barrer a ciegas.

Obligatorio:
- flechas = mover haz;
- arriba/abajo = cambiar zona;
- lista DOM de luces/criaturas detectadas;
- acción para saltar directamente a cada señal;
- foco visible;
- no precisión fina como reto.

## Haz

`WIDE_BEAM_NOT_PRECISION_POINTER`

El cono debe ser ancho.
El desafío es descubrir/acudir, no acertar a un target pequeño.

## Edad

Taxonomía canónica:
- AGE_0_12;
- AGE_13_17;
- AGE_18_PLUS;
- ALL_AGES.

Producto fijado por María:

AGE_0_12:
- 1 criatura por zona;
- haz más ancho;
- ficha inicial mínima: identidad + profundidad.

AGE_13_17:
- 2–3 criaturas por zona;
- ficha completa.

AGE_18_PLUS / ALL_AGES:
- todas las criaturas disponibles de la zona;
- más poblado, NO más dashboard;
- progressive disclosure sigue aplicando.

No:
- esconder herramientas;
- alterar hechos;
- infantilizar;
- hacer adultez = todo visible simultáneamente.

## Colección

No Cuaderno.

Contrato:
`THEMATIC_DEPTH_ALBUM`

Una lámina de las cinco zonas.
Encontrar criatura rellena su hueco.

La colección comunica:
**quién vive a cada profundidad**.

No almacenar datos personales.
No storage propio obligatorio para la experiencia base si el contrato global lo prohíbe.

## Escala corporal

Las criaturas deben colocarse a tamaño relativo real cuando exista dato aprobado.

El runtime ya tiene API `lengthCm`.

NO inventar tamaños en arte.
NO variar escala por dramatismo.

Datos ya localizados en el carril mesopelágico:
- pez hacha: 6 cm;
- pez linterna: 8 cm;
- calamar de cristal: 20 cm.

Cualquier tamaño adicional requiere contenido/fuente aprobada.

## Asset gaps actuales

Cobertura cerrada hoy:
- mesopelágica: 3 especies × luz/oscuro = 6 PNG KEEP_LOCKED.

El producto completo de cinco zonas necesita especies aprobadas en:
- epipelágica;
- batipelágica;
- abisopelágica;
- hadal;
- y, según densidad final por edad, posible ampliación mesopelágica.

El histórico indica que existían “otras 12 especies” previstas, pero no están empaquetadas ni autorizadas en el contrato vivo actual.

Regla:
`DO_NOT_GENERATE_UNSCOPED_12`

Antes de nueva producción:
- lista canónica de especies;
- zona;
- tamaño real;
- bioluminiscencia sí/no;
- factual visual descriptors;
- estados necesarios;
- source/provenance.

Lumen no inventa esa lista.

## Contrato de nuevos assets

Para cada especie nueva que sí se autorice:

- una toma canónica individual;
- fondo transparente;
- sin agua/fondo/partículas/haz/texto;
- estado `luz` master;
- estado `oscuro` derivado de la MISMA geometría cuando haga falta;
- mismo canvas/centro/pose/escala;
- 0 px de desplazamiento;
- sRGB;
- alpha limpio;
- morfología factual;
- menor resolución observacional → menor detalle, no fantasía;
- sin miedo/fauces/acecho como dirección visual.

## Safety / tono

`DEPTH_IS_WONDER_NOT_HORROR`

No:
- fauces como protagonista;
- acecho;
- depredación;
- susto;
- horror abisal.

Sí:
- curiosidad;
- extrañeza biológica;
- escala real;
- adaptación;
- luz propia;
- oscuridad como medio, no amenaza.

## Decisión Lumen

KEEP:
- dinámica propuesta por María;
- 5 zonas;
- gesto de linterna;
- oscuridad real;
- revelado temporal;
- bioluminiscencia fija;
- escala real;
- álbum temático;
- 6 PNG mesopelágicos ya aprobados.

DROP / NO HACER:
- acuario;
- peces en autoplay;
- profundidad como slider de iconos;
- dashboard;
- Fósiles acuático;
- assets con agua/haz horneados;
- regeneración de mesopelágicos aprobados.

## Siguiente dependencia

Para Lumen:
`INTEREST_22_REMAINING_SPECIES_FACTUAL_ASSET_BRIEF`

Debe contener únicamente las especies faltantes reales y sus descriptores.

Para Motor:
actualizar el contrato/runtime para reflejar:
`MOVE_LIGHT → REVEAL → DARKNESS_RETURNS`
y eliminar cualquier comportamiento autónomo incompatible.

Lumen no toca runtime.
Motor no rediseña assets.

