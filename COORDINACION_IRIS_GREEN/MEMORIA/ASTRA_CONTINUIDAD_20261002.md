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
`main@156b3ee490d1bf59cde15f08bd51db3ce094b14f`

Recovery #367 ya fusionada y publicada.

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
Owner operativo: Nexo.
Astra no duplica el carril.
Estado pendiente:
`R44_SUITE5_TOKEN_CONSUMPTION_QA_PASS`

Debe reconciliarse contra el main vivo antes de integración.

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


## Principio de continuidad

Si cambia el chat o la sesión:
**leer primero GitHub + esta memoria + issue del carril + main vivo.**
No reconstruir el estado desde conversación ni asumir que una rama antigua sigue siendo la base actual.
