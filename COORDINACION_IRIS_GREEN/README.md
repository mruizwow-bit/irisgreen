# Coordinación compartida de Iris Green y Sabik

Esta carpeta reúne la documentación operativa del proyecto. No forma parte de la web publicada. La documentación no autoriza por sí sola cambios de producto, publicación ni activación de servicios.

## Reparto vigente R06 · 25/09/2026 · Codex → Agente 3

**María comunica que Codex está inoperativo y ordena pasar sus pendientes al agente 3.** A3 asume sus cinco comprobaciones reales y toda la continuidad técnica de Codex en Sabik/Cloud: correlación HTTP, correcciones, integración y entrega verificable. No esperar a Codex. Esta disposición sustituye las atribuciones incompatibles anteriores, incluidas las que figuran en el estado/CSV históricos y en la entrega R05.

Orden única: [R39-A3-CONTINUIDAD-R06](ORDENES/R39_CONTINUIDAD_A3_R06/01_AGENTE_3.md). Registro: [Memoria R06](MEMORIA/REASIGNACION_CODEX_A3_R06_20260925.md) y [Control por ID R06](CONTROL/DELTA_REASIGNACION_CODEX_A3_R06_20260925.json). **Reasignada; acuse y ejecución de A3 no acreditados todavía.** A2 conserva la rama/subidas de la web y la revisión editorial R02; las dependencias técnicas puntuales que se dirigían a Codex se entregan ahora a A3. No se transfieren Design ni voz. No se modifica producto o despliegue al emitir esta orden.

## Addendum A2 conservado · 25/09/2026 · R23 y R39-A2-CONEXION-R05

La conexión frontend R05 ya está aplicada en PR #244, HEAD `82106c874f5e4b612cdb68292b3c3115e040fea6`, preview `6ab5fd0246e4910008d918a2` READY. Build y QA de superficie ES/EN correctos; **consulta/fuentes HTTP reales pendientes, ahora a cargo de A3 según R06**, no MONTADO_CONECTADO_REAL. Origen autorizado: `https://deploy-preview-244--irisgreen-home.netlify.app`.

Leer [memoria y evidencia de entrega](MEMORIA/WEB_A2_R23_CONEXION_R05_20260925.md) y [delta de control por ID](CONTROL/DELTA_WEB_A2_R23_CONEXION_R05_20260925.json) junto a R06. El addendum R05 sustituyó el estado «pendiente de aplicar / sin acuse» de R39-A2-CONEXION-R05 y registró el cierre acotado de R23. Su evidencia técnica se conserva; su reparto A3/Codex queda actualizado por R06. El CSV y los originales V106/V114 no se han sobrescrito ni se declaran sincronizados por estos deltas. WEB-CONTENIDO-R02 está recibida, no ejecutada en este lote. Los registros de otros responsables se conservan.

## Leer al empezar

1. La orden y los addenda vigentes R06 anteriores para responsabilidad/continuidad de Sabik; después `ESTADO_ACTUAL.md` para las demás líneas y su evidencia histórica.
2. `NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md`: condiciones obligatorias según alcance.
3. `ORDENES/`: orden vigente de cada responsable, interpretada con la reasignación R06; contiene también los requisitos aplicables y la obligación español/inglés.
4. `MEMORIA/` y `CONTROL/`: decisiones y seguimiento. Los históricos no sustituyen al estado vigente ni a los deltas posteriores por ID.

## Propiedad y trabajo en curso

- María y el agente 2 conservan la web, las subidas y la integración de frontend. Nadie despliega sobre su trabajo ni restablece una copia antigua.
- **El agente 3 asume los pendientes técnicos de Codex en Sabik y biblioteca Cloud.** Continúa desde su trabajo real, sin reconstruir las piezas entregadas. Las correcciones frontend se entregan a A2 sobre su HEAD vigente; no requieren esperar a Codex.
- Design permanece con María. Sus componentes se adaptan a Iris Green, no sustituyen su web.
- Cada auxiliar modifica únicamente sus archivos asignados. Los entregables que dependían del integrador Codex en el alcance R06 pasan a A3. Una orden publicada no acredita que otro agente la haya recibido.

## Regla bilingüe obligatoria

Iris Green es bilingüe: español e inglés. Cada cambio público debe incluir ambos idiomas: texto, navegación, botones, instrucciones, estados, mensajes de error, nombres accesibles, alternativas textuales, ayudas y descargables correspondientes. Las rutas e idiomas existentes se conservan. No se publica como completa una entrega con la versión inglesa pendiente. Un cambio puramente interno puede declararse sin contenido traducible, con justificación concreta.

No se traduce ni modifica silenciosamente el corpus N04 español sellado: la cobertura inglesa exige una versión y procedencia explícitas.

## Actualización de estado

Cada entrega aporta responsable, orden, base y HEAD reales, archivos cambiados, pruebas ejecutadas, resultado y limitaciones, y enlaces a evidencias. Se distinguen código entregado, integración, despliegue y verificación de funcionamiento. Un build correcto o Netlify READY no equivalen a aceptación funcional o visual.

No borrar históricos. No incluir secretos, cookies, grabaciones vocales privadas, conversaciones de usuarios ni copias no autorizadas de normas de pago. La marca Iris Green no sustituye los créditos de terceros.

## Addendum operativo R40 · Rincón R03 · 26/09/2026

Antes de trabajar en Rincón tranquilo, leer:
- `ORDENES/R40_RINCON_R03/README.md`;
- `NORMATIVA/ADDENDUM_R40_RINCON_R03_AUDIO_UX_20260926.md`;
- `MEMORIA/R40_RINCON_R03_DECISION_AUDIO_UX_20260926.md`;
- `CONTROL/DELTA_R40_RINCON_R03_20260926.json`.

#269 es la orden vigente y sustituye #268. A7 construye y A2 es la única puerta de integración/subida. La aceptación es en la web, con revisión auditiva y visual humana.


## R40 Rincón R03 · entrega A7 · 26/09/2026

Construcción A7 terminada y lista para integración A2: `R40_RINCON_R03_FULL_AUDIO_UX_BUILD_READY_FOR_A2`. Ver [memoria](MEMORIA/R40_RINCON_R03_ENTREGA_A7_20260926.md), [evidencia](EVIDENCIAS/R40_RINCON_R03_A7/README.md) y [control](CONTROL/DELTA_R40_RINCON_R03_20260926.json). La aceptación perceptiva permanece pendiente de preview web.

## R40 Rincón R04 · entrega A7 lista para A2

Estado: **`R40_RINCON_R04_REAL_REBUILD_READY_FOR_A2`**.

A7 ha terminado la reconstrucción real de #271. Entrega: PR #274, HEAD `7f15dd174fc26b7768224896492ff240c5cecdf5`. Incluye audio renderizado 12+9, motor visual de 9 escenas, reproductor/sonido/bola arriba y evidencia 1440×900 + 390×844.

Ver:
- `MEMORIA/R40_RINCON_R04_ENTREGA_A7_20260926.md`
- `EVIDENCIAS/R40_RINCON_R04_A7/`
- `CONTROL/DELTA_R40_RINCON_R04_20260926.json`

Aceptación perceptiva pendiente de integración/subida A2 y revisión humana.


## R39 R06 · Cloud listo, integración web pendiente A2

El Cloud R06 está READY en deploy-preview no publicado. La integración frontend está en PR #272 y debe entrar por A2. Ver `MEMORIA/R39_R06_CLOUD_DEPLOY_20260926.md` y `CONTROL/DELTA_R39_R06_CLOUD_DEPLOY_20260926.json`.

Estado: `R39_R06_CLOUD_READY_WEB_INTEGRATION_PENDING_A2`.

## R41 · Interactive Product Rebuild

Reset de diseño tras HUMAN QA. Ver `ORDENES/R41_INTERACTIVE_PRODUCT_REBUILD/`, `NORMATIVA/ADDENDUM_R41_INTERACTIVE_PRODUCT_DESIGN_20260926.md` y `MEMORIA/R41_HUMAN_QA_DESIGN_RESET_20260926.md`.

Estado: `R41_INTERACTIVE_PRODUCT_REBUILD_REQUIRED`.

## R42 · normativa obligatoria embebida

Cada orden R42 copia físicamente el bloque obligatorio completo. Ver `ORDENES/R42_EMBEDDED_NORMATIVE_REBUILD/` y `NORMATIVA/BLOQUE_OBLIGATORIO_EMBEBIDO_R42_20260926.txt`.

Estado: `R42_EMBEDDED_NORMATIVE_REBUILD_REQUIRED`.

## R42 · Child-safe Situaciones/Condiciones

Arquitectura para proteger el descubrimiento incidental de contenido sensible por menores.

- Parent #293
- A4 #294 · clasificar 372 fichas
- A3 #295 · implementar lente/búsqueda/rutas
- A1 #296 · enlaces seguros desde Recursos/Juegos
- A2 #297 · integración y HUMAN QA

Orden: `ORDENES/R42_CHILD_SAFE_CONTENT/`
Normativa: `NORMATIVA/ADDENDUM_R42_PROTECCION_MENORES_CONTENIDO_20260926.md`
Memoria: `MEMORIA/R42_PROTECCION_MENORES_SITUACIONES_CONDICIONES_20260926.md`
Estado: `R42_CHILD_SAFE_CONTENT_ARCHITECTURE_REQUIRED`.
