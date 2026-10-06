# AXIOMA · FÓSILES R02 · PILOTO 3 · REVISIÓN INDEPENDIENTE

Fecha: 2026-10-06

Gate:
`AXIOMA_FOSSILS_R02_PILOT_3_READY_FOR_HUMAN_QA`

## Artifact exacto

Rama producto:
`prisma/fosiles-r02-piloto-3-20261006`

Runtime HEAD:
`be7c36076381a6a91aa83df30c1379db8918c415`

Run original:
`37426798610 · SUCCESS`

Artifact original auditado:
`11394214546`

ZIP interno:
`PRISMA_FOSILES_R02_PILOTO_3.zip`

SHA-256:
`af3c5cd5f884787076508f6aa6a04385821cc2c0062d2632fa94a59b9fba62b7`

Tamaño:
`1.241.325 bytes`

Integridad Axioma:
- ZIP test PASS;
- 36 archivos;
- manifest 35/35 hashes contra bytes reales PASS;
- QA_BROWSER.json del artifact = PASS.

## Reproducción de CI

Axioma relanzó el mismo job sobre el mismo HEAD.

Rerun job:
`112157118092 · SUCCESS`

Browser QA volvió a PASS:
- Trilobite ratón;
- Dimetrodon alternativa sin drag;
- Meganeura teclado/DOM;
- R01/R02/R04/R05/R06;
- pointercancel;
- Tab/Space;
- forced-colors;
- 320/390/1440;
- texto 200%;
- targets >=44.

El ZIP del rerun tiene otro SHA (`419b6c...`) porque el empaquetado conserva timestamps distintos. Axioma extrajo ambos y comparó el payload: los 36 archivos de producto son byte a byte iguales. No es bit-reproducible como ZIP, pero sí reproducible en contenido.

## Navegador Axioma sobre bytes exactos

El Chromium del harness Axioma bloquea navegación file:// por política administrativa. Para la comprobación independiente se cargaron exactamente los archivos extraídos mediante un origen local simulado sin red. Esto prueba DOM/CSS/JS/canvas; no se presenta como segunda prueba del origen file://.

### Reflow

320 / 390 / 1440:
- 0 overflow horizontal;
- 200%: 0 clipping interno detectado en texto/controles de la first view;
- diálogo Ayuda a 200% usa scroll interno y permanece dentro del viewport.

### Flujo Trilobite

Tras despeje local:
- observable = true;
- identifiable = true;
- Cuaderno = 0/3;
- status = `Los rasgos necesarios están visibles. Puedes revelar el contexto.`

Tras Observar + Revelar:
- Cuaderno = 1/3;
- identidad = Trilobites;
- contexto visible.

Esto confirma independientemente la corrección del contador visual.

### Regiones QA

`qa/*.svg` existe únicamente como evidencia.

El runtime (`index.html`, `app.js`, `model.js`, `pilot-data.js`, `style.css`) no referencia `qa/` ni carga esos overlays.

El rectángulo discontinuo que puede aparecer tras `Guiarme` es una ayuda solicitada explícitamente por la persona; no es la overlay técnica permanente de QA.

## Findings no bloqueantes antes de escalar

### NOTE-01 · Dos live regions polite

El DOM contiene:
- `#sceneState` con role=status + aria-live=polite;
- `#live` con role=status + aria-live=polite.

`say()` escribe el mismo mensaje en ambos.

Esto puede producir anuncios duplicados según lector de pantalla.

No se declara FAIL sin AT real, pero antes de escalar/release conviene consolidar en una sola live region o probar NVDA/VoiceOver.

Estado:
`AT_DUPLICATE_STATUS_PENDING_REAL_SCREEN_READER`

### NOTE-02 · Primera tarea móvil

Medición Axioma first view:
- 320: la escena comienza aprox en y=481 px; los controles principales empiezan debajo del primer viewport de 720 px;
- 390: patrón equivalente; se ve parte suficiente de la escena, pero los controles quedan bajo fold.

El centro del fósil/indicio sí entra en el primer viewport y el click directo produce feedback visual (punto de trabajo).

No bloqueo: es exactamente una pregunta de HUMAN QA.

María debe abrir 320 sin instrucciones externas y comprobar:
1. si entiende que puede tocar el indicio;
2. si desplaza naturalmente para llegar a Explorar/Despejar;
3. si entiende la secuencia Señalar → Despejar → Observar → Revelar;
4. si `Guiarme` se percibe como ayuda opcional, no como ruta obligatoria.

Marcador:
`FOSSILS_R02_FIRST_TASK_MOBILE_HUMAN_CHECK`

### NOTE-03 · Cierre del tercer encuentro

En 3/3, `Siguiente encuentro` queda disabled. No hay un estado textual específico de `Piloto completado`.

No afecta a las tres rutas, pero antes de escalar conviene decidir un cierre explícito:
- `Ver cuaderno`;
- `Has completado los 3 encuentros`;
- o retorno a mapa/colección.

## Foco / estructura / forced colors

PASS dentro del alcance ejecutado:
- controles nativos;
- foco visible;
- selected mediante aria-pressed;
- modal nativo con retorno de foco en flujo probado;
- targets >=44;
- forced-colors conserva escena/control/selected;
- ES/EN conserva modo.

## Ciencia / contenido

El piloto R02 mejora el R01:
- regiones manuales, no proporcionales genéricas;
- observación antes de identidad;
- copy limita inferencias;
- fuentes por los tres encuentros.

Axioma no eleva esto a validación paleontológica completa de los otros once fósiles.

Antes de extender a 14, cada nuevo encuentro necesita:
`ANCHOR/REGION MANUAL → SOURCE SUPPORT → VISIBLE FEATURE → INVARIANT TEST → HUMAN PERCEPTIBILITY`.

No copiar una región genérica a los once restantes.

## Decisión de gate

No encuentro un blocker técnico/reproducible que justifique devolver este piloto antes de que María lo pruebe.

Por tanto:
`AXIOMA_FOSSILS_R02_PILOT_3_READY_FOR_HUMAN_QA`

Pero NO se autoriza todavía extensión a 14.

Secuencia:
`HUMAN QA MARÍA · 3 ENCUENTROS → DECISIÓN DE PATRÓN → SI PASS, EXTENSIÓN CURADA A 14`

Fuera de alcance de este gate:
- lector de pantalla real;
- teléfono físico;
- Safari/Firefox;
- validación factual de los 11 no pilotados;
- main/deploy.

`NO MAIN · NO PUBLIC DEPLOY · NO SABIK`