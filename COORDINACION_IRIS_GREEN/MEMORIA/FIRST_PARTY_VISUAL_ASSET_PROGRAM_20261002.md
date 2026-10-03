# PROGRAMA VISUAL FIRST-PARTY · PRODUCCIÓN POR TANDAS · 02/10/2026

## Autoridad de producto
María decide que Iris Green debe disponer de **arte visual first-party propio** para las experiencias que lo necesitan:
- Intereses;
- Juegos nuevos;
- Sabik cuando su runtime lo requiera;
- Nuevo Rincón / Sala sensorial;
- superficies audiovisuales y portadas de Videoteca cuando corresponda.

La referencia de método es el trabajo ya cerrado para Mar 22:
**dirección visual → masters propios → variantes técnicas → packaging/provenance → integración runtime**.

Esta decisión NO autoriza generación indiscriminada. Se mantiene:
`REUSE APPROVED FIRST-PARTY → NEW ONLY WHERE PRODUCT NEEDS IT`

Las conclusiones previas `NO_NEW_ASSETS_REQUIRED` de Sistema Solar/Exoplanetas/Eclipses significaban que sus V2 mínimos podían construirse técnicamente sin imágenes nuevas. La decisión posterior de María añade un **programa visual first-party de calidad**; no obliga a convertir una simulación factual en una ilustración engañosa.

---

# OWNERS

## Lumen A7 · VISUAL CREATION OWNER
Responsable de:
- dirección visual;
- generación/producción de masters first-party;
- coherencia entre familias;
- selección KEEP/REWORK/DROP visual;
- variantes de estado cuando sean parte del arte;
- HUMAN-QA-ready contact sheets;
- no incrustar texto en masters salvo contrato expreso.

Lumen produce en micro-batches.

## Atlas A1 · ASSET SYSTEMS / PACKAGING OWNER
Responsable de:
- naming canónico;
- canvas/dimensiones;
- RGBA/alpha;
- sRGB;
- safe-crops;
- derivados técnicos;
- hashes;
- manifests;
- provenance;
- Library;
- control de duplicados;
- entregar packs limpios al runtime.

Atlas NO reimagina arte aprobado.

## Senda R59 · PRODUCT/FACTUAL ASSET REQUIREMENTS
Antes de cada tanda de Intereses:
- qué asset hace falta;
- función en producto;
- REAL_DATA / CALCULATION / REPRESENTATION;
- factual descriptors;
- qué NO se puede inferir;
- número de estados;
- prioridad;
- reuse/new.

## Motor A5 · RUNTIME INTEGRATION OWNER
Motor NO crea arte primario.
Integra packs aprobados:
- loaders;
- lazy;
- responsive;
- estados;
- performance;
- fallbacks;
- interaction.

### Restricción temporal
Motor está reservado para:
`NEXO → SABIK_DEFINITIVE_P0`

Regla:
`DO_NOT_INTERRUPT_MOTOR_FOR_RINCON_OR_INTERESTS`

Hasta release explícito de Nexo/Astra:
- no Mar22 runtime;
- no Rincón player;
- no nuevos integrations de assets.

## Eco A6
Audio/media únicamente.
No owner de imagen estática.

## Axioma
QA accesibilidad/estándares después de integración.
No producción visual.

## Nexo
Coordina Sabik P0 y recuperación transversal de la web.
No se duplica su carril.

---

# PIPELINE DE CADA TANDA

`SENDA/PRODUCT REQUIREMENTS`
→ `LUMEN MASTER VISUALS`
→ `ASTRA/MARÍA VISUAL GATE WHEN NEEDED`
→ `ATLAS PACKAGING/PROVENANCE`
→ `MOTOR WAIT OR INTEGRATE WHEN RELEASED`
→ `AXIOMA QA`
→ `MAIN`

WIP visual recomendado:
**3–6 masters por tanda**.

No producir 72 temas en paralelo.
No mezclar versiones visuales de diferentes gates.
No usar composites como asset final salvo que el runtime pida un atlas explícito.

---

# ESTÁNDAR DE MASTER FIRST-PARTY

Por defecto, salvo contrato específico:
- un sujeto/objeto por archivo;
- sin texto ni logos;
- fondo transparente cuando sea útil;
- sRGB;
- canvas estable dentro de una familia;
- pose/encuadre consistentes entre estados;
- separar master artístico de overlays UI;
- first-party;
- provenance real;
- etiqueta pública `Imagen hecha por ordenador` cuando corresponda.

Para ciencia:
- no afirmar que una representación es observación;
- no inventar rasgos desconocidos;
- usar factual descriptors aprobados;
- separar `REAL_DATA`, `CALCULATION`, `SIMULATION/REPRESENTATION`.

---

# TANDAS ACTIVAS / COLA

## BATCH 00 · CIELO HORIZONTE · CIERRE TÉCNICO
Arte/dirección actual:
KEEP.

Owner:
Atlas.

Única tarea:
cerrar `01-cielo-horizonte-observacion-r01`:
- 2560×768;
- RGBA;
- sRGB embebido;
- transparencia superior;
- no deformación;
- safe-crops 16:9 / 3:4 / móvil;
- manifest/hash/provenance.

Gate:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

Lumen solo revisa si Atlas detecta que la adaptación exige reimaginar.

## BATCH 01 · SISTEMA SOLAR · FUNDACIÓN VISUAL

Estado:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_READY_FOR_REVIEW`

Entrada factual:
`INTEREST_02_SOLAR_VISUAL_FACTUAL_ASSET_BRIEF_PASS`

Brief Senda:
- commit `2a387fa0e1294b3a1167e4adcc800bd7419f4cfd`;
- Sol / Mercurio / Venus / Tierra;
- todos `NEW_FIRST_PARTY_MASTER + REPRESENTATION`;
- donors históricos = `REFERENCE_VALIDATION_ONLY`.

Owner visual:
**Lumen A7**

Masters producidos:
1. `b01_sol_master_r03.png`
   - SHA-256 `53b04c7aa84fdb42e3235f52286f2b2082d5eb96b89e2bbddc882ba22d065f63`
2. `b01_mercurio_master_r03.png`
   - SHA-256 `02fee8d50e74b904e1765d79a3c0a52ef5821fa49cdfcdfd264f530cd24613e8`
3. `b01_venus_master_r03.png`
   - SHA-256 `898a591f2de61d53dc3ab108ba30b17af423ab69397f8f89e0ee149d72aa08b8`
4. `b01_tierra_master_r03.png`
   - SHA-256 `5dc40cdabc89b44e75abd0e26d3d961c53e26a118957fd0ea1b5ba54595de25f`

Contrato técnico de los cuatro:
- 1536×1536;
- PNG RGBA;
- alpha real;
- ICC sRGB embebido;
- un cuerpo por archivo;
- disco completo;
- sin fondo espacial;
- sin texto/logos;
- sin escala relativa horneada;
- etiqueta pública futura:
  - ES `Imagen hecha por ordenador`;
  - EN `Computer-made image`.

Dirección factual:
- Sol: blanco/blanco cálido pálido, autoemisivo, sin llamas/corona permanente;
- Mercurio: gris-parduzco, craterizado, sin halo atmosférico visible;
- Venus: crema/marfil, nubes globales opacas, superficie no visible;
- Tierra: vista diurna África + Europa + Atlántico, océanos azules, nubes genéricas, halo azul muy fino.

Proceso:
- intentos generativos exploratorios que incumplían contrato fueron descartados;
- masters finales = render procedural first-party con seeds/config trazables;
- no se copiaron píxeles de los donors del Sistema Solar;
- Tierra usa geometría pública de Natural Earth únicamente como scaffold factual de costa/geografía; el render/composición final es first-party.

Library:
`/Iris Green/First Party Visual/B01 Solar Foundation/`

Incluye:
- 4 masters;
- `B01_SOLAR_FOUNDATION_CONTACT_SHEET_R01.png`
  - SHA-256 `a90fbb973fd7f84b0c9c4afe341a82d67853dee7e4100d48217120f5a8031881`;
- direction note;
- config/seeds;
- provenance;
- manifest.

Gate actual:
`READY_FOR_VISUAL_REVIEW`

Siguiente paso:
**Astra + María + Lumen visual review.**

NO Atlas packaging todavía.
NO Motor.
NO B02.
NO B03.

Después de review:
- KEEP/PASS → Atlas packaging/provenance technical closure;
- REWORK → solo los masters señalados;
- no escalar hasta gate explícito.

## BATCH 02 · SISTEMA SOLAR · RESTO DE PLANETAS
Solo después de Batch 01 visual PASS:
- Marte;
- Júpiter;
- Saturno;
- Urano;
- Neptuno.

No empezar aún.

## BATCH 03 · CONTEXTO SISTEMA SOLAR
Solo tras spec:
- lunas contextuales seleccionadas por Senda;
- cualquier asset de cinturón/anillos si el producto realmente lo pide.

## CIELO
No generar estrellas raster.
HYG/IAU/JPL y constelaciones siguen data/runtime.
Visual first-party aquí = horizonte/atmósfera/overlays no factual, no reemplazo de catálogo astronómico.

## EXOPLANETAS
No representar como fotografía planetas cuya apariencia no se conoce.
Si se generan masters:
- deben clasificarse explícitamente como representación;
- no convertir radio/masa/temperatura estimada en superficie inventada;
- priorizar diagramas/representaciones abstractas first-party.

## ECLIPSES
Priorizar Canvas/SVG/calculation.
No hace falta rasterizar Sol/Luna como si fueran observación.
Cualquier visual nuevo debe quedar marcado como simulación/representación.

## MAR 22
Los 6 PNG mesopelágicos ya están:
KEEP.
No regenerar.
Pendiente integración cuando Motor sea liberado.

## FÓSILES
Arte R2v4:
KEEP.
NO regenerar.

## MINERALES
Pendiente spec técnico de representación multivista.
No producir 75 vistas antes de cerrar técnica/presupuesto.

---

# JUEGOS

## P01/P02/P03
Visual aprobado:
KEEP.
No regenerar.
Restaurar/integrar el set canónico correcto.

## P04
No regenerar masivamente.
Primero resolver cuál es el set final de la cadena sala → golpe/plan.

## P05 · Pesca tranquila
Cuando se construya:
REUSE de Mar22/Vida marina cuando el contrato encaje.
No crear segunda fauna.

## P06 · Mi museo
Debe consumir hallazgos/assets de Intereses.
No crear colección paralela.

## Juegos en sala
Los packs first-party podrán necesitar imágenes propias.
Producción visual solo después de cerrar S1 formato de pack y contenido del primer pack.

---

# NUEVO RINCÓN / SALA SENSORIAL

A1 Pecera:
`RINCON_A1_LUMEN_FINAL_AV_PASS`
→ WAIT MOTOR.

No abrir A3 dentro de la cola audiovisual hasta:
`RINCON_A1_FINAL_PASS`

El programa de imágenes estáticas no altera esa WIP=1.

Para futuras piezas:
Lumen sigue siendo owner visual/audiovisual.
Eco = audio.
Atlas = packaging/provenance si hay assets separados.
Motor = player/runtime cuando sea liberado.

---

# VIDEOTECA

R06 conserva 122 vídeos.
No crear 122 miniaturas a ciegas.

Primero:
- rebase/product gate;
- inventario de posters/thumbs realmente faltantes;
- después tandas first-party si hacen falta.

---

# REGISTRO OBLIGATORIO

Cada tanda deja:
- MEMORIA;
- CONTROL;
- assets en Library;
- manifest/hashes/provenance;
- contacto visual;
- decisión KEEP/REWORK/PASS;
- handoff al siguiente owner.



## Precedencia Senda inmediata

La orden previa:
`INTEREST_05_METEORS_PRODUCT_CONTENT_REUSE_AND_ASSET_BRIEF_PASS`

queda **QUEUED / NO INMEDIATA**.

La siguiente tarea de Senda es:
`INTEREST_02_SOLAR_VISUAL_FACTUAL_ASSET_BRIEF_PASS`

Solo después de entregar ese brief puede continuar el flujo:
`SENDA BRIEF → LUMEN B01 → VISUAL REVIEW → ATLAS PACKAGING`.

Interés 05 se retoma después de cerrar esta dependencia visual del Sistema Solar o cuando Astra lo reasigne expresamente.


## B01 · HUMAN QA VISUAL · RESULTADO 02/10/2026

Estado:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_REWORK_REQUIRED_VISUAL_QUALITY`

La entrega técnica R03 de Lumen cumple:
- 1536×1536;
- RGBA;
- alpha;
- sRGB ICC en los masters canónicos de Library;
- un cuerpo por archivo;
- sin texto/fondo/estrellas;
- factual brief respetado;
- seeds/config/provenance.

Pero NO pasa aún HUMAN QA visual de Astra/María.

Motivos:
- Sol demasiado plano/pálido; falta presencia autoemisiva y granulación perceptible sin caer en “bola naranja en llamas”.
- Mercurio demasiado lavado/plano; la craterización no tiene suficiente relieve/materialidad.
- Venus demasiado uniforme; falta lectura de capa nubosa opaca y volumen atmosférico sin revelar superficie.
- Tierra es reconocible pero todavía parece procedural/simplificada frente al nivel visual esperado.
- la familia no alcanza todavía el acabado premium/E4 que María ha marcado como objetivo global.

Los composites realistas aportados por María se clasifican:
`VISUAL_REFERENCE_ONLY`

No son masters finales porque:
- agrupan varios cuerpos;
- algunos incorporan texto;
- algunos no conservan alpha limpio individual;
- algunos Soles muestran corona/fulguraciones permanentes incompatibles con el brief;
- algunas Tierras cambian el hemisferio/encuadre factual requerido.

### Rework Lumen B01 R04

Crear de nuevo SOLO:
Sol · Mercurio · Venus · Tierra.

Mantener:
- 1536×1536;
- RGBA;
- alpha real;
- sRGB ICC;
- un cuerpo por archivo;
- disco completo;
- sin texto/fondo/estrellas;
- no escala relativa horneada;
- clase `REPRESENTATION`;
- brief factual Senda sin cambios.

Subir calidad:
- materialidad y microrelieve perceptibles;
- iluminación coherente y volumétrica;
- borde/limbo natural;
- profundidad suficiente a 1440 y móvil;
- sin apariencia de esfera plana con ruido.

Sol:
- fotosfera blanca/blanco cálido;
- granulación visible pero controlada;
- autoemisivo;
- glow de borde muy corto;
- NO corona permanente;
- NO grandes prominencias/llamaradas;
- NO patrón “actual” de manchas.

Mercurio:
- gris parduzco;
- relieve/cráteres legibles;
- algunos rayos claros discretos;
- NO cartografía exacta;
- NO atmósfera gruesa.

Venus:
- crema/marfil;
- estructura nubosa sutil pero visible;
- opacidad completa de la superficie;
- NO radar/UV falso color.

Tierra:
- África/Europa/Atlántico;
- océanos azules;
- nubes genéricas;
- halo atmosférico fino;
- NO meteorología actual;
- NO geografía deformada.

Salida nueva:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_R04_READY_FOR_REVIEW`

B02/B03 continúan HOLD.


## B01 · R04 LUMEN · READY FOR REVIEW

Estado:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_R04_READY_FOR_REVIEW`

Entrada:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_REWORK_REQUIRED_VISUAL_QUALITY`

R04 rehace SOLO:
- Sol;
- Mercurio;
- Venus;
- Tierra.

KEEP factual/técnico:
- brief Senda `2a387fa0e1294b3a1167e4adcc800bd7419f4cfd`;
- clase `REPRESENTATION`;
- 1536×1536;
- RGBA + alpha;
- sRGB ICC;
- un cuerpo por archivo;
- disco completo;
- sin texto/logos/estrellas;
- sin escala relativa horneada;
- B02/B03 HOLD.

Library R04:
`/Iris Green/First Party Visual/B01 Solar Foundation/R04 Review/`

Masters R04:
- Sol · `b01_sol_master_r04.png`
  - SHA-256 `051a2611c48c82e9460d1e07f8b8c987d53d41c20f0fe9e58e45b8d9e0aba92f`
- Mercurio · `b01_mercurio_master_r04.png`
  - SHA-256 `91cdc12c1af20c501a41191f9c4f50f150bff8fba1b9fad1fcaf9d496d02e126`
- Venus · `b01_venus_master_r04.png`
  - SHA-256 `dc305bf68a611462655e5a5224034de930c4872ed8dc8a8a4df5b9da97bde878`
- Tierra · `b01_tierra_master_r04.png`
  - SHA-256 `86fbd802104c9e1f906710bde3d696e332f936067227a175f33e4cb36c53d38a`

Contact sheet:
- `B01_SOLAR_FOUNDATION_R04_CONTACT_SHEET.png`
- SHA-256 `1a008508dadcec8d67c5de9699ba5f27c6f17955706711128aed38f0d345bc7f`
- 2400×1800;
- solo review, no asset runtime.

Dirección R04:
- Sol: más granulación/microcontraste y lectura autoemisiva, glow corto; sin corona extensa/prominencias;
- Mercurio: relieve/cráteres/rayos discretos más legibles, gris-parduzco; no cartografía exacta;
- Venus: estructura nubosa crema/marfil más legible, superficie completamente oculta;
- Tierra: África/Europa/Atlántico, relieve/materialidad, océanos azules, nube genérica y halo fino.

Provenance R04:
- Sol/Mercurio/Venus: generación first-party de Lumen + normalización factual/relighting; los composites previos de review NO se adoptan como masters;
- Tierra: render first-party ortográfico con relief scaffold NOAA/NCEI ETOPO1 documentado como public-domain; nube genérica, no meteorología actual; master sigue siendo REPRESENTATION.

Soporte en Library:
- `B01_SOLAR_FOUNDATION_R04_DIRECTION.md`
- `B01_SOLAR_FOUNDATION_R04_MANIFEST.json`
- `B01_SOLAR_FOUNDATION_R04_PROVENANCE.json`

Gate actual:
`READY_FOR_VISUAL_REVIEW_R04`

Siguiente:
**Astra + María + Lumen visual review**.

Atlas:
`WAIT_R04_VISUAL_PASS`

B02/B03:
HOLD.


## B01 R04 · revisión parcial KEEP/REWORK · 03/10/2026

Fuente:
`COORDINACION_IRIS_GREEN/HANDOFFS/FIRST_PARTY_VISUAL_ASSET_PROGRAM_20261002/B01_LUMEN_R04_VISUAL_REVIEW.md`

Commit:
`c7bb3026da341fb4f6a372f2e3404fad02b97b76`

Resultado:
`B01_R04_VISUAL_REWORK_SOL_VENUS_EARTH__MERCURY_KEEP`

Por asset:
- Mercurio → `KEEP_LOCKED`
- Sol → `REWORK`
- Venus → `REWORK`
- Tierra → `REWORK`

No hay PASS global B01 todavía.

### Mercurio
Queda congelado. No regenerar ni "mejorar" mientras no aparezca defecto factual/técnico nuevo.

### Sol
Subir:
- autoemisión;
- granulación;
- profundidad luminosa.

Mantener:
- blanco/blanco cálido;
- sin naranja dominante;
- sin corona permanente;
- sin prominencias;
- sin patrón de manchas actual.

### Venus
Subir:
- lectura de capas nubosas;
- volumen atmosférico.

Mantener:
- opacidad completa de superficie;
- crema/marfil;
- sin radar/UV falso color.

### Tierra
Subir:
- esfericidad convincente;
- integración de relieve;
- profundidad de nubes;
- halo natural.

Mantener:
- África/Europa/Atlántico;
- nubes genéricas;
- no meteorología actual;
- no luces nocturnas/auroras.

### B01 R05
Lumen autorizado a rehacer SOLO:
- Sol
- Venus
- Tierra

Mercurio se reutiliza desde R04.

Gate:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_R05_READY_FOR_REVIEW`

Atlas:
`WAIT_FULL_B01_VISUAL_PASS`

B02/B03:
`HOLD`


## B01 · R05 LUMEN · READY FOR REVIEW · 03/10/2026

Estado:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_R05_READY_FOR_REVIEW`

R04 parcial:
- Mercurio → KEEP_LOCKED;
- Sol → REWORK;
- Venus → REWORK;
- Tierra → REWORK.

R05 rehace únicamente:
- Sol;
- Venus;
- Tierra.

Mercurio sigue con autoridad R04:
`/Iris Green/First Party Visual/B01 Solar Foundation/R04 Review/b01_mercurio_master_r04.png`
SHA-256:
`91cdc12c1af20c501a41191f9c4f50f150bff8fba1b9fad1fcaf9d496d02e126`

Library R05:
`/Iris Green/First Party Visual/B01 Solar Foundation/R05 Review/`

Masters nuevos:
- Sol R05 · `b01_sol_master_r05.png`
  - SHA-256 `2d72a6af1a05403666484b2cf7b46b6b585ccea0049990b001fb254a45be5528`
- Venus R05 · `b01_venus_master_r05.png`
  - SHA-256 `a1311f3f14ba14454964924d06c97f9b92ea6e3d8bf1cbf8bfed40f9a26cbc3f`
- Tierra R05 · `b01_tierra_master_r05.png`
  - SHA-256 `06f69d85c93d3ab5354e834774baa52153e5ca0de2563d197e1a00b1a61c7cf8`

Contact sheet:
`B01_SOLAR_FOUNDATION_R05_CONTACT_SHEET.png`
SHA-256:
`fb32c98d87684bb38a61691f527f83cc938179281335c019548881b71c181596`

Contrato preservado:
- 1536×1536;
- PNG RGBA;
- alpha real;
- sRGB ICC;
- un cuerpo por archivo;
- disco completo;
- sin texto/logos/estrellas/fondo espacial;
- no escala relativa horneada;
- clase `REPRESENTATION`;
- etiqueta pública futura:
  - ES `Imagen hecha por ordenador`;
  - EN `Computer-made image`.

Dirección R05:
- Sol: autoemisión más clara, fotosfera blanco/blanco cálido, granulación visible, glow corto, pequeñas manchas no dominantes; sin corona/prominencias permanentes.
- Venus: bandas/capas nubosas crema-marfil más legibles, volumen atmosférico, superficie totalmente oculta.
- Tierra: África/Europa/Atlántico, materialidad planetaria y nubes con profundidad, halo fino; nubes genéricas, no meteorología actual.
- Mercurio: KEEP R04, no regenerado.

Soporte R05 en Library:
- `B01_SOLAR_FOUNDATION_R05_DIRECTION.md`
- `B01_SOLAR_FOUNDATION_R05_MANIFEST.json`
- `B01_SOLAR_FOUNDATION_R05_PROVENANCE.json`

Gate:
`READY_FOR_VISUAL_REVIEW_R05`

Siguiente:
**Astra + María + Lumen visual review.**

Atlas:
`WAIT_FULL_B01_VISUAL_PASS`

B02:
`HOLD_AFTER_B01`

B03:
`HOLD_FOR_PRODUCT_SPEC`


## SISTEMA SOLAR · CIERRE FINAL 10 MASTERS · 03/10/2026

Gate:
`SOLAR_FOUNDATION_FINAL_10_MASTERS_PASS`

Este bloque SUPERA los estados históricos B01/B02 de review/HOLD para los 10 cuerpos principales.

Referencia visual final aprobada por María:
`Esferas planetarias sobre transparencia-4.png`

SHA-256 referencia:
`5b84bdcd5990284b5d336a37b0d010d95fcb731d10a96661bc87bb08669b23cd`

KEEP visual definitivo:
- Sol;
- Mercurio;
- Venus;
- Tierra;
- Marte;
- Júpiter;
- Saturno;
- Urano;
- Neptuno;
- Plutón.

Library canónica:
`/Iris Green/First Party Visual/Solar Foundation Final/`

Contrato técnico final de los 10 masters:
- 1536×1536;
- PNG RGBA;
- alpha 0–255;
- sRGB ICC embebido;
- fondo transparente;
- un cuerpo por archivo;
- sin texto/fondo/estrellas/logos;
- clase pública `REPRESENTATION`;
- no escala relativa horneada.

Los cuatro derivados de la referencia visual aprobada se exportaron sin rediseño:
- `solar_01_sol_final.png` · `8b060092d09e1100d1d7b4c7dd1b4db093894aba717d9cbc6fd6e066369beace`
- `solar_04_tierra_final.png` · `d09773ebd0774121287370556e01d6d0ea57fa0d4d35295c121325e155c61cac`
- `solar_08_urano_final.png` · `2d4b6b6a262eb933130fc1fa1df5ba6d8aecb5c08ef7fec7d93786ac67b7b76f`
- `solar_09_neptuno_final.png` · `9a85681f33eaca9448176a60b925cafbef2a6613960e58b562e66372071bf4cc`

KEEP reutilizados sin regenerar:
- Mercurio · `592e8f00fbaaece3f02221df3c65d93a50ba07c64473ae171522bd8c7910910f`
- Venus · `a1311f3f14ba14454964924d06c97f9b92ea6e3d8bf1cbf8bfed40f9a26cbc3f`
- Marte · `2da051ee02e9583f1702409f126fd8b8a82810699af425f7e64d70e4474598e9`
- Júpiter · `379c6f0bec39afacc444a9807d01c1f732cfa668e1d5a3670cfc9e036de51a59`
- Saturno · `4b62485a38231ec47363db69208cda3cc94bc73430b21a8d6d579d38fbcc5631`
- Plutón · `428fc88d8a86fe220f7ad53c34dae218fc1601404df8fe6f8b283d2c5f8c8844`

QA técnico:
- BLACK / WHITE / MID-GRAY;
- alpha completo;
- sRGB presente;
- 0 matte técnico;
- 0 componente espurio visible tras limpieza;
- visual de Tierra/Neptuno preservado;
- sin nueva variante artística.

QA:
`SOLAR_FINAL_ALPHA_VALIDATION_BLACK_WHITE_GRAY.png`

Contact sheet final:
`SOLAR_FOUNDATION_FINAL_10_CONTACT_SHEET.png`

SHA-256 contact:
`90a99038ff01d19474bc30f58cfc9112db75f123a3290d3a695d38cde9fa7df9`

Estado de producción visual:
`PASS / CLOSED`

Siguiente owner:
**Atlas A1** solo para packaging/provenance/cierre técnico de asset system.
Atlas NO reimagina arte.

B03 lunas/contexto sigue siendo una línea separada y requiere spec propia; no reabre estos 10 masters.


## B03 · PLANETAS ENANOS + LUNAS · READY FOR REVIEW · 03/10/2026

Entrada factual:
`SOLAR_B03_DWARF_MOONS_FACTUAL_BRIEF_PASS`

Owner gate factual temporal:
Astra / María.

Fuente:
- branch `astra/solar-b03-factual-gate-20261003`;
- HEAD `fb2417106e9cecdaa8c6932d19c1f6b4b4e70e90`;
- handoff `COORDINACION_IRIS_GREEN/HANDOFFS/SOLAR_B03_DWARF_MOONS_FACTUAL_GATE_20261003/HANDOFF.md`.

Selección:
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

Salida Lumen:
`SOLAR_B03_DWARF_MOONS_10_MASTERS_READY_FOR_REVIEW`

Library:
`/Iris Green/First Party Visual/Solar B03 Dwarf Moons Batch 10/`

Contrato de los 10:
- 1536×1536;
- PNG RGBA;
- alpha 0–255;
- sRGB ICC;
- fondo transparente;
- un cuerpo por archivo;
- sin texto/estrellas/logos;
- clase `REPRESENTATION`.

Hashes:
- Ceres · `1376c8fd565ed957d26f4eef0cffa83bb310f26eda888f502a4b6fdce0c0728e`
- Haumea · `4737552211f44d84040e21ff6635e954a6e07680ae306c6f4023c0e399e15c96`
- Makemake · `e46cf63e12ed2a57e80f15b2848c9a84fa652f54fa0f59f074bd0dcd8823812b`
- Eris · `d6b864d0967122744fe8f3cdae3b0160d71bb4ee99079f13c02ba0a5a17927da`
- Luna · `1865a69f612d259a4c62dbb644acd2425d6f0c3605c48908d370ebf0af233b96`
- Io · `49ab24c343e9d7244140f9bdb08f17ecbf7a0f4859395d6fdbb15a6e15181196`
- Europa · `16c2035169f1672d6f3c03f37994a23ff7c863536e17e06de229e0c661a18e1b`
- Ganímedes · `a7f6fffe173f5ecb59033745b159578b99bacf7cee403ddd45a1c03846f895c4`
- Titán · `39613033741c48ecfd2d5e7395ce04aef22197c830ee8e3f6e5c52c25ff37347`
- Encélado · `d0079ecfb7a681d5a94f9596c53f556ea6a2cb98e543844b31dadd7b2f940879`

Contact sheet:
`SOLAR_B03_DWARF_MOONS_10_CONTACT_SHEET.png`

SHA-256:
`e98e1d991f5d369026ce3df313db0d947e2feab544e5f7b3e017509ba64e21b1`

Technical QA:
`SOLAR_B03_ALPHA_VALIDATION_BLACK_WHITE_GRAY.png`

SHA-256:
`278293c1bc832fa761df81a0adf76f4417fb7484e172356b13706c8910e21797`

Resultado técnico:
- alpha 0–255 en 10/10;
- sRGB ICC presente 10/10;
- 1536×1536 10/10;
- componentes espurios de separación eliminados;
- contact sheet = QA only.

Decisiones de prudencia factual aplicadas:
- Haumea: superficie neutralizada; forma alargada conservada; sin anillo horneado;
- Makemake: bajo detalle rojizo-marrón; sin halo atmosférico;
- Eris: pálido y deliberadamente bajo detalle; no copia de Plutón;
- Luna: cara visible/norte-arriba; fase fuera del master;
- Titán: bruma opaca visible-light; superficie no expuesta;
- Encélado: sin pluma dramática;
- Ceres: depósitos brillantes contenidos, no protagonistas.

Estado:
`READY_FOR_VISUAL_REVIEW`

Callisto:
candidato prioritario para la siguiente tanda; NO incluido en B03.

Siguiente:
**Astra + María + Lumen → review de los 10 en contact sheet.**

No review cuerpo por cuerpo.
