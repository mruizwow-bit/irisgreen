# ASTRA · continuidad y memoria operativa · 02/10/2026

## Regla de preservación obligatoria

Por decisión de María, ningún trabajo de Iris Green se considera correctamente cerrado si solo existe en el chat.

Cada micro-bloque debe dejar trazabilidad recuperable antes de STOP:

1. **GitHub = fuente canónica**
   - issue/comentario con estado;
   - rama + HEAD;
   - CI/run/artifact cuando aplique;
   - decisiones KEEP / REWORK / DROP / PASS / FAIL;
   - límites y siguiente paso.

2. **MEMORIA**
   - registrar lo aprendido, lo decidido y el estado vigente;
   - incluir precedencia/supersession relevante;
   - dejar claro qué NO debe repetirse o reconstruirse;
   - permitir que un chat nuevo recupere el trabajo sin depender del anterior.

3. **CONTROL / evidencia**
   - hashes, manifests, deltas, QA, provenance y resultados técnicos cuando existan;
   - no declarar PASS sin evidencia reproducible.

4. **HANDOFF**
   - cuando el trabajo cambia de owner, sesión o especialidad;
   - incluir base, HEAD, archivos, contratos, blockers y siguiente acción exacta.

5. **Slack**
   - coordinación rápida y checkpoints;
   - nunca sustituye GitHub ni la memoria canónica.

## Flujo vigente

`DISCOVER → REUSE → IMPLEMENT → TEST → MERGE MAIN → CI → CHECKPOINT → STOP`

Reglas:
- `main` = base canónica de integración;
- no dejar un PASS aparcado en una rama si ya está listo para integrar;
- no fusionar ramas históricas completas;
- portar/reconciliar solo el delta válido;
- no abrir el siguiente micro-bloque hasta releer el `main` vivo;
- producto y arte aprobados no se reabren sin motivo concreto;
- cada test debe corresponder al contrato de producto vigente, no a oracles superseded.

## Estado de referencia al registrar esta memoria

### Main
HEAD vivo observado antes de esta actualización documental:
`main@446288495e1423901d4390182bdafe75648d6282`

Recovery #367 ya fusionada y publicada. Los commits documentales posteriores también forman parte de main; releer siempre HEAD antes de reconciliar producto.

### Cielo V2
`INTEREST_01_CIELO_V2_FIRST_VIEWPORT_PASS`

- rama: `motor/cielo-v2-first-viewport-20261002`
- HEAD: `68e42edae6d4bfe9c92b002de403ac87d0353134`
- CI: `37002843142` SUCCESS
- accepted KEEP por Astra
- siguiente: reconciliar contra main vivo → repetir gates → merge → CI
- gate siguiente: `INTEREST_01_CIELO_V2_IN_MAIN_PASS`
- no panorama Atlas todavía
- no ampliar depth
- no tocar 02–07

### Mar 22 · packaging Atlas
`MAR_22_MESO_PACKAGING_PASS`

- rama: `atlas/mar22-meso-packaging-20261002`
- HEAD: `13564c3d4ba747edbdb2297787f0f3c115882351`
- 6 PNG canónicos: pez hacha, pez linterna, calamar de cristal · luz/oscuro
- RGBA 1400×1000 · sRGB · registro [0,0]
- binarios Library: `/Iris Green/Handoffs/Atlas/MAR_22_MESO_PACKAGING_R01/`
- arte aprobado intacto
- accepted KEEP
- Motor retomará Mar 22 solo después de cerrar Cielo V2 → main

### Atlas · siguiente bloque
Solo:
`01-cielo-horizonte-observacion-r01`

Gate:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

No Voyager · no ISS · no Batch 02 · no runtime · no main.

### R44 / Suite5
Owner original: Nexo.
Cobertura temporal vigente: **Motor**, porque Nexo se ha bloqueado.
Astra no duplica el carril y Rincón no interrumpe a Motor.
Estado pendiente:
`R44_SUITE5_TOKEN_CONSUMPTION_QA_PASS`

Debe reconciliarse contra el main vivo antes de integración. Al cerrar, Motor queda disponible para la etapa de player del Nuevo Rincón.


### Senda · Interés 03 · Exoplanetas V2

Aceptado por Astra:
`INTEREST_03_EXOPLANETS_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

Commit de coordinación:
`9d4f1f84b85006759218e605830746a09be9ba32`

Dirección:
`EVIDENCE_FIRST → CHOOSE_A_WORLD → WHAT_WE_KNOW / WHAT_WE_DO_NOT_KNOW → DEPTH_ON_DEMAND`

KEEP:
- subset inicial de 6 mundos;
- 5 métodos de detección;
- snapshot local fechado;
- incertidumbre explícita;
- catálogo completo en depth;
- patrón 3D lazy;
- `NO_NEW_ASSETS_REQUIRED`.

Siguiente micro-bloque de Senda:
**Interés 04 · Eclipses V2**, solo producto/contenido/reuse.

Gate:
`INTEREST_04_ECLIPSES_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

No runtime · no imágenes · no 01–03 · no 05–07 · no main.


### Nuevo Rincón · duración final corregida y reafirmada

María reafirma la decisión final:
`TARGET_DURATION = 5 MINUTES`.

Esto prevalece sobre cualquier mención posterior de 10 minutos como duración de producto.

Aplicación:
- **Pecera**: el master/entrega larga de 10 min puede conservarse como donor/master, pero la pieza de producto final debe ser de ~5 min; no rerenderizar arte aprobado solo para cambiar duración.
- **Mar**: prototipo 30 s → si pasa gate visual/audio, derivar/renderizar versión final de ~5 min.
- **Discos líquidos**: prototipo 30 s → si pasa gate visual/audio, derivar/renderizar versión final de ~5 min.
- audio first-party propio;
- empieza en silencio;
- control accesible propio Activar/Quitar audio;
- quitar audio no detiene la imagen.

Regla:
`10MIN = MASTER/DONOR ONLY WHEN IT EXISTS`
`5MIN = FINAL PRODUCT TARGET`


### Nuevo Rincón · reparto de owners audiovisuales

Owner primario de vídeo/audiovisual:
**Lumen · A7 — Immersive Media & Interactive Audiovisual Engineer**.

Responsabilidades Lumen:
- revisión visual de prototipos;
- KEEP/REWORK visual;
- derivación/render final de piezas aprobadas a ~5 min;
- preservar composición, ritmo visual, cámara y low-stimulation;
- Pecera: derivar desde master/donor sin rerender del arte aprobado.

Owner de audio + media QA:
**Eco · A6 — Voz, Audio & Media Validation**.

Responsabilidades Eco:
- audio first-party;
- normalización/loudness/true peak;
- codec/container/bitrate/sample rate/channels;
- A/V sync;
- faststart/moov;
- range/seek/playback/performance cuando aplique;
- QA binaria final.

Player común:
**Motor · A5**, solo después de media PASS:
- muted inicial;
- control Activar/Quitar audio;
- teclado/touch/foco/Escape;
- NORMAL/REDUCED/NONE;
- lifecycle/cleanup e integración web.

Axioma = accesibilidad/estándares.
Astra = gate de producto/arquitectura.
María = HUMAN QA final.

Orden:
Lumen → Eco → Lumen final 5 min → Eco QA final → Motor → Axioma → Astra/María.

## Principio de continuidad

Si cambia el chat o la sesión:
**leer primero GitHub + esta memoria + issue del carril + main vivo.**
No reconstruir el estado desde conversación ni asumir que una rama antigua sigue siendo la base actual.

### Cielo V2 · HUMAN QA visual

María rechaza el nivel visual del first viewport actual.

Estado:
`INTEREST_01_CIELO_V2_HUMAN_QA_FAIL_VISUAL_QUALITY`

El PASS técnico previo se conserva solo como evidencia funcional. No equivale a PASS de producto.

KEEP:
- datos HYG/IAU/JPL;
- targets/interacción;
- teclado/touch;
- Motion3;
- forced-colors;
- depth lazy;
- no auto-geolocalización.

FAIL visual:
- dashboard/panel de datos;
- sidebar dominante;
- estrellas como burbujas;
- labels como pills;
- horizonte ausente perceptivamente;
- falta atmósfera/profundidad;
- WORLD_SCENE_FIRST no se cumple perceptivamente.

Owner inmediato:
**Prisma A8** para rework de presentación/DOM/CSS/responsive.
Motor no se interrumpe mientras cubre Nexo/Suite5.

Gate:
`INTEREST_01_CIELO_V2_VISUAL_REWORK_READY_FOR_HUMAN_QA`

No merge main antes de HUMAN QA María/Astra.

Memoria específica:
`COORDINACION_IRIS_GREEN/MEMORIA/CIELO_V2_HUMAN_QA_VISUAL_REWORK_20261002.md`

Control:
`COORDINACION_IRIS_GREEN/CONTROL/CIELO_V2_HUMAN_QA_VISUAL_REWORK_20261002.json`
