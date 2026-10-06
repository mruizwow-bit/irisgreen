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


---

## 2026-10-04 · CHILD SAFETY R01 · AGE GATE OBLIGATORIO

Decisión explícita de María: los botones de edad dejan de ser optativos y seleccionar 18+ no puede desbloquear por sí solo contenido completo/restringido.

Regla nueva:

`AGE_SELECTION != ADULT_ACCESS_AUTHORIZATION`

`MANDATORY_AGE_SELECTION + INDEPENDENT_ADULT_ASSURANCE + FAIL_CLOSED`

Hallazgo técnico de Astra en `main`:
- `assets/ig-audience.js` inicia en `GENERAL`;
- `isAdult()` devuelve true cuando `current==='AGE_18_PLUS'`;
- esa autodeclaración se propaga como `adult-explicit`;
- los tests actuales aceptan que 18+ exponga `Ver información completa`.

Esto queda superseded.

Documentación canónica:
- `COORDINACION_IRIS_GREEN/NORMATIVA/CHILD_SAFETY_AGE_ASSURANCE_R01.md`
- `COORDINACION_IRIS_GREEN/CONTROL/CHILD_SAFETY_MANDATORY_AGE_GATE_R01_20261004.json`
- `COORDINACION_IRIS_GREEN/CONTROL/CONTROL_MASTER_SYNC_DELTA_CHILD_SAFETY_R01_20261004.csv`
- `COORDINACION_IRIS_GREEN/MEMORIA/CHILD_SAFETY_MANDATORY_AGE_GATE_R01_20261004.md`

Implementación inmediata: Motor.
Revisión: Axioma + Vigía + Lex.
E2E: Nexo.
Red-team: Astra.
HUMAN QA final: María.


---

## 2026-10-04 · HANDOFF A WORK · FORMACIÓN ASTRA R02

María traslada Astra a Work.

Formación canónica creada:
- `COORDINACION_IRIS_GREEN/FORMACION/ASTRA/00_IDENTIDAD_Y_PUESTO.md`
- `COORDINACION_IRIS_GREEN/FORMACION/ASTRA/01_PLAN_FORMACION.md`
- `COORDINACION_IRIS_GREEN/FORMACION/ASTRA/02_APRENDIZAJE_APLICADO_20261004.md`

Handoff de reanudación:
- `COORDINACION_IRIS_GREEN/HANDOFFS/ASTRA_WORK_20261004/01_ESTADO_Y_REANUDACION.md`

Control:
- `COORDINACION_IRIS_GREEN/CONTROL/ASTRA_WORK_HANDOFF_20261004.json`

Prioridad al entrar en Work:
1. releer main vivo;
2. revisar #391 child safety tras marker Motor;
3. reconciliar #389 Sabik centered hierarchy + #391 safety;
4. no cerrar HUMAN QA por CI;
5. mantener pendiente el formal Astra final re-pass de patentabilidad R02 en repo privado NEA.

Regla:
`ASTRA_WORK_MODE_RESUME_FROM_GITHUB_NOT_CHAT`


## 2026-10-05 · Mar 22 · correcciones ejecutadas por Astra

María autoriza resolver directamente, sin convertirla en mensajera. Entregadas cuatro parejas PNG luz/oscuro: pepino abisal, sifonóforo, pez gota y ctenóforo. Oscuros derivados por ajuste RGB; alfa idéntico por pareja; lado mayor 1400 px y sRGB asignado. Originales preservados. No regenerar por defectos corregibles por transformación determinista.

Paquete: `MAR22_CUATRO_PAREJAS_QA_20261005.zip`, Library `libfile_02629013b13c81919066ee27060d2a59`.

Estado y continuación: `COORDINACION_IRIS_GREEN/HANDOFFS/MAR22_CORRECCIONES_20261005/ESTADO.md`.
Control y hashes: `COORDINACION_IRIS_GREEN/CONTROL/MAR22_CORRECCIONES_20261005.json`.

Inspeccionado prototipo R02_1_2: no contiene estas cuatro parejas. Seis tests de funciones puras pasan; QA gráfica no ejecutada porque falta Chromium y la descarga falló. Composición source-over necesita revisión para alfa semitransparente. NO runtime PASS, NO factual PASS, NO HUMAN QA, NO integración pública.

Bloque 10 sigue sin correspondencia inequívoca de sustituciones; Bloque 16 revocado sigue excluido, sin reemplazo confirmado. Bloque 15 válido conservado. Auditoría existente de 301 registros es cribado, no 301 especies validadas. No crear otra biblioteca maestra. Continuar revisiones científicas y manifiesto existentes.


## 2026-10-05 · precisión de alcance y fósil F02-04

María aclara: continuar prototipo Mar con selección actual; no incorporar ni probar todos los peces ahora. Hallazgo de transparencia queda para comprobar durante pruebas del prototipo, no como bloqueo previo ni orden de ampliar alcance. Las cuatro parejas quedan preparadas.

A petición de terminar fósil pendiente se intentó F02-04 Acanthostega con referencia anatómica ToL de J. Clack, figura 5. Tres generaciones inspeccionadas: primera ambigua; segunda y tercera con siete dedos reconocibles. Rechazadas, sin sustituir original ni declarar cierre. Control: COORDINACION_IRIS_GREEN/CONTROL/FOSILES_ACANTHOSTEGA_20261005.json. Generar una imagen no acredita exactitud anatómica.


## 2026-10-05 · Entrega ZIP Cielo y Vida marina

Se han preparado y guardado ZIP separados: CIELO_IMAGENES_Y_FICHAS_20261005.zip (462 archivos visuales únicos) y VIDA_MARINA_IMAGENES_Y_FICHAS_20261005.zip (652). Incluyen catálogo HTML, inventario CSV/JSON, fuentes y procedencia; versiones y formatos no equivalen a especies. Control: `COORDINACION_IRIS_GREEN/CONTROL/ASTRA_ZIPS_CIELO_VIDA_MARINA_20261005.json`.

Los datos ausentes quedan señalados; no hay nueva aprobación científica. El fichero corregido pez-gota-luz.png está truncado y queda excluido con incidencia; original 19_14_53-1 conservado. Exoplanetas 001–020 no recuperados y HOLD 032/033/040. B16 sigue revocado, B10 pendiente. Prioridad prototipo intacta, sin cambios en runtime o producción.


## 2026-10-06 · Aves: ampliación y prompts de producción

Por orden de María, continuar ilustraciones tras Cielo, Vida marina y Fósiles. Las 36 aves del banco no son el alcance final. Preparada primera ampliación a 100 especies distintas (36 base preservadas + 64 nuevas), en 10 tandas de 10, con 100 prompts completos individuales. Documento: `COORDINACION_IRIS_GREEN/HANDOFFS/ASTRA_AVES_100_20261006/INVENTARIO_Y_PROMPTS.md`; control: `COORDINACION_IRIS_GREEN/CONTROL/ASTRA_AVES_AMPLIACION_100_20261006.json`.

Entrega ZIP con MD, diez TXT de tandas, CSV/JSON y fuentes/cambios. Estado: PROMPTS PREPARADOS, no imágenes generadas ni QA científico global. Conservar originales aprobados. Un ave completa por PNG, alfa real, sin texto ni escenario horneado; NAVY separado en interfaz. Variantes de sexo/edad/plumaje no cuentan como especies nuevas. No bloquear prototipo esperando las 100 ni cambiar runtime/producción.


## 2026-10-06 · Netlify: flujo de revisión exclusivamente desde main

Por orden de María, corregido `.github/workflows/publicar-main-review-netlify.yml` directamente en main, commit `4a91de8`: guard de rama, checkout main, SHA real construido, serialización del alias, CLI 27.11.1/Node 22, resumen deploy ID/URL/SHA y autodespliegue de cambios en workflow. YAML/shell verificados. Ejecución real: https://github.com/mruizwow-bit/irisgreen/actions/runs/37420417204. Control: `COORDINACION_IRIS_GREEN/CONTROL/ASTRA_NETLIFY_MAIN_FIX_20261006.json`.

Mantenimiento público y lock conservados conforme MAINTENANCE_ACTIVE.txt. Los Cancelled Git-linked se explican por ignore=exit 0. No declarar corregida la voz por corregir trazabilidad del deploy. Existe fallo CSP previo en 5af12ca; diagnóstico separado.


## 2026-10-06 · Corrección del disparador duplicado de Netlify

María reitera expresamente: NO publicar main en la web pública; eliminar carriles duplicados. Se conserva una sola fuente main y el alias protegido existente main-review. No crear ramas, sitios ni aliases adicionales.

Commits b107cbb y 2380e29 en el workflow existente: API Netlify PATCH build_settings.stop_builds=true, lectura posterior obligatoria, comprobación de producción bloqueada en mantenimiento y de protecciones de acceso; deploy CLI --no-build para subir el dist construido una sola vez por GitHub Actions. ignore=exit 0 se conserva como defensa si alguien reactiva builds Git.

Primera ejecución 37424315663: PATCH y verificación stop_builds/producción/acceso superados; detenida por comparación global de build_settings. Segunda 37424416202 excluye updated_at del control y está en verificación. Estado final consultable en CONTROL/ASTRA_NETLIFY_MAIN_FIX_20261006.json. No equiparar este trabajo con voz E2E, CSP ni HUMAN QA.

El acceso operativo utiliza la credencial ya configurada en GitHub Actions; no se extrae ni imprime. El conector Netlify disponible no expone updateSite y el navegador separado no tenía sesión; eso no equivale a falta general de acceso al proyecto.
