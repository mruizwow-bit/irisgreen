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
Owner visual:
Lumen.

Masters:
1. Sol
2. Mercurio
3. Venus
4. Tierra

Objetivo:
establecer el lenguaje first-party de cuerpos planetarios antes de producir los demás.

Contrato:
- 1 master por cuerpo;
- disco completo;
- sin estrellas/fondo espacial;
- sin texto;
- transparencia;
- iluminación coherente entre los cuatro;
- NO escala relativa horneada: runtime escala;
- factual descriptors de Senda;
- no añadir superficie visible donde la atmósfera la oculta;
- no falsificar detalle no resuelto.

Salida Lumen:
`VISUAL_BATCH_01_SOLAR_FOUNDATION_READY_FOR_REVIEW`

Después STOP visual.
Astra/María/Lumen revisan antes de BATCH 02.

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



---

# BATCH 00 · CIELO HORIZONTE · CIERRE ATLAS

Fecha:
02/10/2026

Estado:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

Asset canónico:
`01-cielo-horizonte-observacion-r01.png`

SHA-256:
`f35cb943ca72b254a092c721e8007ddbe4d414ed80d154f287b5eedce57493d0`

Library:
`/Iris Green/Handoffs/Atlas/INTEREST_01_SKY_HORIZON_ASSET_R01/01-cielo-horizonte-observacion-r01.png`

Handoff GitHub:
`COORDINACION_IRIS_GREEN/HANDOFFS/INTEREST_01_SKY_HORIZON_ASSET_R01/`

Validación:
- 2560×768;
- PNG RGBA;
- sRGB ICC embebido;
- horizonte bajo/medio;
- top 55 % totalmente transparente;
- 70,9357 % del canvas totalmente transparente;
- safe-crop 16:9 PASS;
- safe-crop 3:4 PASS;
- safe-crop móvil 390×844 equivalente PASS;
- 100 % de columnas de los tres crops conservan horizonte;
- sin estrellas;
- sin Luna;
- sin planetas;
- sin aurora;
- sin nubes protagonistas;
- sin personas;
- sin texto;
- sin logos;
- sin landmarks identificables;
- no compite con el cielo procedural.

Provenance:
- dirección de horizonte tomada como referencia artística del donor indicado por María;
- final generado first-party mediante OpenAI image generation en ChatGPT;
- donor no usado como final directo;
- 0 imágenes de terceros embebidas declaradas;
- packaging técnico de Atlas;
- working canvas 2172×724 → escalado uniforme 2560×853 → crop superior 85 px → 2560×768;
- 0 px de crop horizontal;
- sin deformación;
- limpieza de ruido alpha únicamente en valores <=2;
- sin redraw durante packaging.

Runtime:
NO TOCADO.

Main:
NO TOCADO.

Branch:
`atlas/interest01-sky-horizon-asset-r01-20261002`

Decisión:
B00 queda **PASS / KEEP técnico**, preparado para consumo por Motor cuando el runtime sea liberado.

STOP Atlas:
- no Voyager;
- no ISS;
- no Batch 02;
- no otros assets;
- no runtime;
- no main.
