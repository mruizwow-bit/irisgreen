# Estado operativo compartido

## R42 · Agente 3 · app shell interactivo listo para A2 · 26/09/2026

**Estado: `R42_A3_APP_SHELL_BUILD_READY_FOR_A2`.**

A3 conserva la investigación Web Platform 2026 como base de construcción y ha entregado el primer sistema común R42 sobre la base A2 exacta `574356cba3b73dc8477a625d2c6311008260a2d6`, sin convertir Iris Green en SPA ni introducir framework por estética.

Entrega:
- rama `agent3/r42-app-shell-20260926`;
- HEAD `85a972a1024de3ad009484463f46620346922b02`;
- tree `dc7163325e54937e99797f77842035ae4f1a80b7`;
- draft PR #290 contra la rama A2;
- app shell común con topbar compacta, workspace, tool rail APG, inspector contextual, command/actions, drawer de ayuda, project/status y mobile dock/sheet;
- Dibujo reorganiza retos/propiedades fuera del camino del lienzo y agrupa Archivo mediante Popover/fallback;
- tecnología aplicada: `@layer`, Container Queries, dialog/Popover, View Transitions solo como enhancement, anchor positioning con fallback, contraste/forced-colors/reduced-motion;
- base opaca; `prefers-reduced-transparency` se usa solo como mejora;
- 0 red, 0 persistencia implícita y 0 `innerHTML` en el shell.

Piloto deliberado antes de propagación: Dibujo, Juegos, Intereses y Rincón, cada uno en ES/EN (8 rutas). La portada y el resto de la web no reciben todavía la inyección R42.

QA final A3: workflow `36242268262` SUCCESS sobre el HEAD final; `8/8 routes present`; contrato `R42 A3 app-shell contract: PASS`; build de 2.195 archivos. La validación incluye `node --check` del JS cuando Node está disponible.

Siguiente gate: A2 integra #290 y publica preview. María realiza HUMAN QA en web (desktop/móvil, reflow 320, jerarquía, foco/teclado, lector de pantalla, zoom, forced-colors, reduced-motion, ES/EN). Solo después se decide la propagación del patrón.

Registros:
- `MEMORIA/R42_A3_TECH_UX_RESEARCH_GATE_20260926.md`
- `MEMORIA/R42_A3_APP_SHELL_ENTREGA_20260926.md`
- `CONTROL/DELTA_R42_A3_TECH_UX_RESEARCH_GATE_20260926.json`
- `CONTROL/DELTA_R42_A3_APP_SHELL_BUILD_20260926.json`
- `NORMATIVA/ADDENDUM_R42_A3_WEB_PLATFORM_20260926.md`

A3: **0 deploy · 0 main · 0 producción**.


## R39 R04 · Cloud privado activo; parche entregado a A2

María confirma que su acceso ya funciona y que no abrió el aviso de login visto en esta continuación; no se trata como bloqueo ni se investiga como tarea nueva.

Codex ha dejado Cloud privado activo en `sabik-asistente` y ha entregado a A2 el parche mínimo de tres archivos sobre su HEAD vigente documentado. Estado operativo: **CLOUD_PRIVADO_ACTIVO · PARCHE_A2_ENTREGADO · PENDIENTE_APLICACION_A2_Y_QA_REAL**.

Siguiente acción única: A2 aplica el parche sobre su HEAD vigente, sin restaurar bases anteriores ni perder subidas, confirma HEAD/deploy/origen; después A3 ejecuta solo los cinco casos reales pendientes (resultados+fuentes, cero resultados, cancelación/sustitución, error/timeout recuperable y `lang=es` de citas en UI EN). No repetir QA de montaje ya acreditada. No nueva autorización, no nuevo Cloud, no nueva investigación de login.

---

## R39 R04 · activación privada autorizada ejecutada

Cloud `6ab56a1ba2f6d83e6fb7b408` READY, privado y no publicado; HEAD `16f1134e56292ca2ee600e77e69012c494f39aaf`, 259/259 por runtime. Team Login all y corpus sellado conservados. GET de la página de conexión accesible con sesión de equipo; POST de búsqueda y transporte desde el formulario A2 pendientes. Delta mínimo de tres archivos probado contra PR244 d5258434, sin modificar su rama. [Entrega y límites](EVIDENCIAS/R39_CODEX_R04_ACTIVACION/INFORME.md). La autorización ya está concedida; no volver a solicitarla. El montaje previo se conserva y no se reabre su QA ya acreditada.

## Última confirmación de María · Sabik montado · 24/09/2026

María comunica: «todo listo, Sabik esta en la web».

**MONTADO_CONFIRMADO_POR_MARIA.** No volver a encargar la subida o reconstrucción de Sabik ni mantener el montaje como no realizado a partir del informe R04 anterior. Se conserva íntegro el trabajo montado con María/agente 2.

Esta confirmación no incluye en el mensaje URL, HEAD, deploy o informe de pruebas nuevos; no se les asigna automáticamente una identidad histórica. Tampoco equivale a autorizar cambios de acceso, abrir producción o activar voz/inferencia. Los estados técnicos anteriores se conservan debajo como evidencia fechada, no como negación de este montaje posterior.

Continuidad: aplicar la orden existente R39-A3-USO-R04 únicamente a las comprobaciones que aún no estén acreditadas sobre la URL/versión montada: consulta y fuentes reales, cancelación/errores, teclado/foco, Lectura, móvil y ES/EN. Si ya existe esa entrega, registrar su evidencia sin repetirla. Codex conserva integración y atiende solo defectos reproducibles; nadie reconstruye panel, motor, agrupación o transporte por esta confirmación. No se acredita aquí ejecución nueva de Astra o de A3 ni cierre HTTP/cross-deploy por mera presencia visual.

Registro de recepción de Astra: consultados este estado compartido y el informe R39_CODEX_R04; no se ejecutaron pruebas ni se modificaron código, despliegues, secretos o permisos. No se declara sincronizado el Excel maestro V114.

---

Actualización anterior: 24/09/2026, entrega R39 R03 de Codex y corrección del panel reasignada expresamente por María. Evidencia local, navegador, paquete y HTTP separadas; no certificación global.

## Resumen de evidencias anteriores al aviso de montaje

| Línea | Última evidencia | Estado y límite | Responsable |
|---|---|---|---|
| Web Iris Green | María confirma subidas e integración con agente 2 | Trabajo de María; no sustituir su rama ni desplegar encima | María + agente 2 |
| Rincón tranquilo A2 R01 | HEAD `7b3a92723da442bbef692ae9780961f58ee1049c`; deploy `6ab4fee488beef00088f5b90`; live QA `35988912524` | Verificado dentro del deploy real ES/EN, escritorio/móvil y reduced motion; PASS en su alcance. Fallos globales restantes no pertenecen al Rincón | María + agente 2 |
| Design / recursos | Adaptación dirigida por María | No reasignar; 130 juegos antiguos fuera; recursos públicos ES/EN y marca de composición | María + Design |
| Taller e Intereses (Claude + A2) | Entrega Claude [R01](MEMORIA/WEB_CLAUDE_TALLER_INTERESES_SISTEMA_SOLAR_R01_20260924.md); PR #242, main `117a53a01bf254054f759e7e08eb06ba06f00d00`; [integración A2](MEMORIA/WEB_A2_TALLER_INTERESES_R06_20260924.md) | INTEGRADO_MAIN_PREVIEW_VERIFICADO: Taller, Intereses a fondo, Cielo nocturno y Sistema Solar ES/EN; Taller adaptado al shell Iris Green. Preview #242 comprobada; 3D real y móvil pendientes. Producción sin publicar | Claude entrega; María + agente 2 integran |
| Motion R37 | c23abd9a3ef082a6ed646b03334fe9031b17af15; deploy 6ab4beac4267a5275ff2feb5 | Candidato montado; revisión visual de María y comprobaciones manuales pendientes | Codex / María |
| Biblioteca R38 | ddd12ed4e002812f5c53e24618c029be9faf9e00; deploy 6ab4c1a15435b93043ab3f6d | Biblioteca sellada conservada, consumida por R39 R02 | Codex |
| R39 continuidad R02 | HEAD 66b6b551ad055ea9e367ebdff7246b381f4656d3; tree 759b5c0d82a023a81d4aae48c6ab3ced26638d83; deploy 6ab4d5047d3729fae7f122aa | Integrado y desplegado como borrador. Revisión técnica previa de Astra con observación OBS-R39-BODY-01; no reconstruir | Codex |
| R39 R03 | HEAD `3131d55020057c55567a3457900afc888876de5d`; deploy `6ab504fbf5d403147f6de213`; 227 pruebas por runtime | Body corregido, puente A1/panel integrado, delta A2 comprobado; HTTP y montaje real pendientes en ese informe anterior | Codex |
| R39 R04 | HEAD `e8a8e9579b64ffbe288e2a85889dbe687210554b`; 256/256 por runtime; delta main A2 `117a53a01bf254054f759e7e08eb06ba06f00d00` | Conexión privada construida localmente y desactivada según informe previo al aviso de María; nueva entrada y HTTP sin acreditar en dicho informe. Montaje posterior confirmado por María arriba. [Informe](EVIDENCIAS/R39_CODEX_R04/INFORME.md) | Codex; A2 monta |
| HTTP protegido | A5 BLOQUEADO_ACCESO_AUTORIZADO; Team Login conservado | A5-HTTP-ACTION-01 contra candidato R03; lectura cross-deploy con identidad runtime pendiente en la evidencia anterior | Codex + apoyo A5 |
| Retención C17 | A4 R02: política nativa Function logs hasta 7 días contrastada | Acotado a logs nativos de Serverless Function; no prueba de borrado físico ni otros tipos de registro | A4 + revisión Codex |
| Voz | Herramientas de validación/paquete local recibidas | Revisión detecta WAV truncado aceptado; corrección local pendiente. Voz no activada y no bloquea R39 | A6 |

## Entregas del equipo: revisión realizada, no solo recepción

Informe completo: [Revisión final de los seis agentes](MEMORIA/REVISION_FINAL_AGENTES_R39_2026-09-24.md).
Evidencia estructurada: [Pruebas y reproducciones](CONTROL/EVIDENCIA_REVISION_AGENTES_R39_2026-09-24.json).

Astra reprodujo **53/53 pruebas originales**: A1 8, A3 14, A4 8, A5 6, A6 9, A7 8. Node22.16.0 y Python3.13.5 según módulo. Son casos unitarios/locales; no Node24, HTTP, navegador real, lector de pantalla o validación perceptiva de voz. Las pruebas negativas adicionales identifican fallos que esos casos no cubrían.

| Agente | Veredicto | Acción restante en la revisión anterior |
|---|---|---|
| A1 | Módulo aceptado integrado en R03 | No reconstruir; consultar aviso posterior de montaje y evidencia de uso |
| A3 | Correcciones asumidas por Codex con autorización de María y verificadas en R03 | Comprobación de uso real R04 y aceptación humana según evidencia vigente; donante original conservado |
| A4 | Código revisado, solución alternativa ya cubierta por Codex | No sustituir execution-policy integrado. Evidencia C17 nativa recibida; ver límites de alcance |
| A5 | Código revisado, transporte alternativo ya cubierto por Codex | No añadir otra capa ni satisfacer gate de build histórico. Ayuda restante: HTTP autorizado según evidencia vigente |
| A6 | Corrección de entrada incompleta necesaria | Rechazar WAV truncado y controlar error de decodificación; no crear paquete válido ni modificar originales |
| A7 | No usar todavía como puerta de aceptación | Verificar contenido real del parche: vacío o alterado no puede ser VALID. Revisar comandos completos y actualizar índice sin confundir bases donantes/destino |

No mezclar implementaciones A4/A5 sobre las ya integradas ni dar por aprobado el verificador A7 por sus ocho casos positivos/negativos originales. Estas correcciones son acotadas; no justifican rehacer el producto ni detener módulos independientes.

## Evidencia R39 R02 conservada

Codex reporta sobre el mismo SHA 157/157 pruebas en Node22.16.0 y 157/157 en Node24.19.0; lecturas reales de Blobs desde Node local sin escrituras; paquete portable y digest remoto `5655a261f20b68b91c7a9dbc344ee675468ca4f848b1c83c9a976596573c5073`.

La revisión técnica anterior de Astra consultó código/diff y deploy Netlify y ejecutó 25 pruebas del motor más 12 adicionales en Node22. Se documenta en [Revisión técnica R39](MEMORIA/REVISION_TECNICA_R39_R02_37_PRUEBAS.md). El ZIP final solo se había recibido como ruta Windows: no se atribuye aquí una verificación independiente de ese archivo. Las 53 de agentes son otro alcance, no una suma de cobertura global.

OBS-R39-BODY-01 corregida en R03 y probada localmente y en paquete: el plazo incluye lectura de body. No se afirma vulnerabilidad Netlify ni cierre de HTTP. Véase [entrega y límites R03](EVIDENCIAS/R39_CODEX_R03/INFORME.md).

## Límites y forma de continuar

Codex conserva composición común e integración Cloud. María/agente 2 reciben únicamente deltas frontend sobre su HEAD vigente. No nuevas páginas, shell, barra, tipografía o Lectura de prototipo. No abrir mantenimiento, fusionar main, cambiar DNS, Team Login, credenciales, proveedor, embeddings, `/api/chat` o voz por esta revisión.

Corpus N04 ES: 4.332 fragmentos/IDs, SHA256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`. Se conserva sellado. No se declara bilingüe por traducir los botones. Aplicar [normativa y ES/EN](NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md) a todas las correcciones públicas.

## Registro único

Actualizar esta misma carpeta por ID y evidencia. Entregas y comunicaciones: https://github.com/mruizwow-bit/irisgreen/issues/237. Se distinguen recibido, revisado, corregido, integrado y verificado en uso. No declarar acuse por emitir la devolución ni volver a registrar como sin acuse a quienes ya entregaron.

Los resultados están en `CONTROL/ESTADO_TRABAJOS.csv` y los addenda de `MEMORIA/`. Esta actualización no sobrescribe la Memoria V106 original ni acredita aplicar el delta al Excel V114. No se altera normativa, se aplican los requisitos ya establecidos.

## Taller F1 · actualización A2 R10

| Línea | Última evidencia | Estado y límite | Responsable |
|---|---|---|---|
| Taller F1, sustitución completa | PR244 HEAD 697a0e2c815f6dd966e221e564c4e1f6e98df7bc; 31/31 Node; build 2047 archivos; [informe](EVIDENCIAS/WEB_A2_TALLER_F1_R10/INFORME.md) | Integrado en candidato ES/EN; QA navegador y preview READY y verificada ES/EN; sin producción | María + agente 2 |

## Taller F1 · continuación A2 R11

Sustitución de portada completa: retirados los 72 retos anteriores. Código f93346772f6e005ecafa2b2b03ff467a105d210a; preview READY y verificada ES/EN. [Registro y límites](MEMORIA/WEB_A2_TALLER_F1_R11_20260924.md).

## Intereses · Exoplanetas A2 R12

Exoplanetas ES/EN integrado en PR244, HEAD 5b0940fa3ab2a91dfd378993042160bd2accbe02; deploy 6ab54084dcb6f500075d3bc3 READY. Búsqueda, filtro y navegación inglesa verificados; fallback sin WebGL comprobado. Sistema Solar ya coincidía con el paquete. Taller F1 preservado. [Evidencia y límites](MEMORIA/WEB_A2_EXOPLANETAS_R12_20260924.md). Sin producción ni main.

## Taller visual · A2 R13

María pide retirar la portada antigua y mostrar imágenes de cada estudio. Implementado ES/EN en PR244, HEAD 9bc3125b3961144e681b074c024a3ab2b89cf2bb. Preview SUCCESS; portada ES revisada visualmente, cinco tarjetas con capturas del paquete F1. [Registro](MEMORIA/WEB_A2_TALLER_VISUAL_R13_20260924.md). Sin producción.

## Rincón tranquilo · integración A2 R14

Actualización R02/R02b del paquete irisgreen-r02-r03-listo_2.zip integrada solo en Rincón ES/EN. HEAD 01df4edd96d7486a72732ff61b4341de1da0c7c8, deploy 6ab5449baa35420008a0dc38 SUCCESS. Ocho escenas propias, trece sonidos generados y retirada de YouTube. Assets versionados tras detectar caché antigua. [Evidencia y límites](MEMORIA/WEB_A2_RINCON_R14_20260924.md). Recursos R03 del ZIP no integrados en esta solicitud.

## Intereses · agrupación R15

Retirado catálogo antiguo del índice ES/EN según capturas de María. Cielo nocturno, Sistema Solar y Exoplanetas bajo El cielo y el espacio. Estructura de once grupos registrada para entregas futuras, sin grupos vacíos públicos. HEAD d0c49fa9a7f51e6cd363e3281818f082132abcb8; deploy 6ab545c25a9e420008fcfec3 SUCCESS. [Registro](MEMORIA/WEB_A2_INTERESES_ESTRUCTURA_R15_20260924.md).

## Videoteca · A2 R16

R04 integrado en PR244: 118 vídeos, 17 temas. Dan Wilkins permanece primero por petición expresa de María; prioridad registrada y comprobada por generador. HEAD b91c4bc7047d8e7793f095c8333ee76ef0c20217. Build correcto; deploy SUCCESS. Navegador confirma 118 vídeos, Dan primero ES/EN y filtro Ceguera con los cuatro nuevos vídeos. [Registro](MEMORIA/WEB_A2_VIDEOTECA_R16_20260924.md).

## Juegos y recursos · A2 R17

Paquete R06 integrado: 252 juegos, 109 rutinas, catálogo A4 y biblioteca visual compartida. HEAD 9ee8ef74e700426623bdc0cc8d69f06575a1af03 en PR244; build correcto, deploy SUCCESS y QA navegador ES/EN verificada en su alcance. Tres juegos nuevos, ningún slug retirado frente al HEAD anterior. [Registro y límites de duplicación](MEMORIA/WEB_A2_RECURSOS_R17_20260924.md).

## Presentación Recursos, Taller y Videoteca · A2 R18

Tarjetas ilustradas ES/EN, retirada del bloque de hojas antiguas y corrección de lectura del catálogo para generar miniaturas locales. HEAD 49b866e42a211445711d6991cd5b649aea35b54a; build local correcto, deploy SUCCESS. Cuatro tarjetas con dibujos, cinco estudios sin bloque antiguo y manifest remoto con 118 imágenes y cero fallos. [Registro](MEMORIA/WEB_A2_VISUAL_MINIATURAS_R18_20260924.md).

## Barra interior y Rincón · A2 R19

Cabecera interior en dos filas y nuevo Rincón: 12 sonidos, ocho miniaturas y bundle compatible WebGL1. HEAD cd39aa8ca957a4b1448400be98d0911b35851db6, build correcto; deploy SUCCESS. Barra completa comprobada en Rincón y Videoteca; 12 sonidos, ocho miniaturas y fallback ES/EN verificados. [Registro](MEMORIA/WEB_A2_BARRA_RINCON_R19_20260924.md).

## Rincon tranquilo · A2 R20

Mejoras 1 a 6 integradas ES/EN en PR244, commit 145cfc43a76f0c1746d45c7158d3f31a784862da. Build y verificación estática PASS. Deploy 6ab566ee SUCCESS; controles ES/EN comprobados en navegador remoto. Interacción 3D, apagado completo y pruebas humanas pendientes. [Registro y límites](MEMORIA/WEB_A2_RINCON_R20_20260924.md).

## Eclipses · A2 R21

Integrados ES/EN en PR244, commit d52584344240deb352f712debd19e9e7ae76bdd2. Build PASS; preview 6ab569d5 SUCCESS. [Registro](MEMORIA/WEB_A2_ECLIPSES_R21_20260924.md).

## WEB-A2 R22 · Accesibilidad y usabilidad
Orden directa de María: auditoría de toda la web y cambios; acceso superior a secciones y funciones; corregir bloqueos y saltos de Intereses. PUBLICADO en preview PR244: cf96e31b, deploy 6ab579b8d1bccb0008720139 READY/SUCCESS. Auditoría automática y verificaciones de interacción documentadas, pendientes manuales conservados. Biblioteca cloud y Sabik excluidos. Registro: MEMORIA/WEB_A2_ACCESIBILIDAD_USABILIDAD_R22_20260924.md.

## R40 · Rincón tranquilo R03 · construcción A7 entregada 26/09/2026

**Estado: `R40_RINCON_R03_FULL_AUDIO_UX_BUILD_READY_FOR_A2`.**

Agente 7 ha terminado la reconstrucción sobre la base A2 exacta `bba503efb24aa15bacfbf1c0d47986420705d3bf`.

Entrega:
- rama `agent7/r40-rincon-r03-20260926`;
- HEAD `ad08841ba563ddda38a3d1dac7ee70421faaf88b`;
- tree `bd75fd67e598aa8b7fb40b400e3d93821b99c2e5`;
- draft PR #270 contra la rama A2;
- 12 sonidos generales first-party rehechos;
- 9 ambientes de escena first-party;
- 9 escenas, incluida Pulpos;
- selector superior único **Vídeos / Sonidos / Bola de relajación** con una sola región activa;
- ES/EN, controles explícitos, crossfade, reduced motion, forced-colors y fallback;
- grabaciones históricas HOLD fuera del runtime R03.

Revisión A7 del código directamente en GitHub: **94/94 comprobaciones estructurales PASS**. Durante esa revisión se corrigieron carga simultánea de controladores anteriores, movimiento prematuro del poster Pulpos, clave Pulpos duplicada y runtime oculto de audios HOLD.

Esto **no es aceptación perceptiva**. Siguiente gate: A2 revisa/integrará el delta en su HEAD vigente, publica Deploy Preview y se realiza escucha y revisión visual humana.

Orden: [R40_RINCON_R03](ORDENES/R40_RINCON_R03/README.md).  
Normativa: [Addendum R03 audio/UX](NORMATIVA/ADDENDUM_R40_RINCON_R03_AUDIO_UX_20260926.md).  
Memoria de entrega: [R40_RINCON_R03_ENTREGA_A7_20260926](MEMORIA/R40_RINCON_R03_ENTREGA_A7_20260926.md).  
Evidencia: [R40_RINCON_R03_A7](EVIDENCIAS/R40_RINCON_R03_A7/README.md).  
Control: [Delta R03](CONTROL/DELTA_R40_RINCON_R03_20260926.json).

## R40 · Rincón R04 · construcción A7 entregada · 26/09/2026

**Estado vigente: `R40_RINCON_R04_REAL_REBUILD_READY_FOR_A2`.**

R04 sustituye R03 después del HUMAN QA FAIL de María. Agente 7 ha completado una reconstrucción audiovisual real sobre la base A2 observada `9ad3cc8116b6c1d237b84f71855f3808e93ddbad`.

Entrega A7:
- rama final `agent7/r40-rincon-r04-final-20260926`;
- HEAD `7f15dd174fc26b7768224896492ff240c5cecdf5`;
- tree `cac62fe72d1a193edc9e31ab9cfa177e5c92ca6d`;
- draft PR #274, mergeable sobre la rama A2 vigente;
- 12 sonidos generales + 9 ambientes de escena renderizados offline como assets first-party;
- 3 sprites AAC-LC, mono, 24 kHz, con SHA-256 verificados;
- motor visual nuevo `assets/rincon-escenas-r04.js` para las nueve escenas;
- reproductor/estado/bola visible arriba antes de catálogo y ajustes;
- selector Vídeos / Sonidos / Bola de relajación con una sola región activa;
- ES/EN, reduced motion, forced-colors, targets cómodos y fallback.

Workflow de generación/QA `36237393274`: SUCCESS. Los blobs de producto del HEAD final son idénticos a los cubiertos por ese run. A7 inspeccionó las seis capturas finales 1440×900 y 390×844 y no observó el defecto R03 de herramienta enterrada.

Esto **no es aceptación perceptiva final**. A2 integra/sube sobre su HEAD vigente; después María/QA escucha los 12 sonidos + 9 ambientes y revisa las 9 escenas en Deploy Preview.

Memoria: `MEMORIA/R40_RINCON_R04_ENTREGA_A7_20260926.md`.  
Evidencia: `EVIDENCIAS/R40_RINCON_R04_A7/`.  
Control: `CONTROL/DELTA_R40_RINCON_R04_20260926.json`.

## R39 R06 · Cloud desplegado · 26/09/2026

**Estado: `R39_R06_CLOUD_READY_WEB_INTEGRATION_PENDING_A2`.**

El candidato R06 `8690e26140f6d513c3592df62bc82b167cbb1d0e` se desplegó correctamente en el Cloud privado `sabik-asistente` como deploy-preview no publicado `6ab7a2cd2cf8dc09d3ae9aca`. El run `36236824712` terminó SUCCESS y Netlify confirma las Functions `n04-library-qa` y `n04-team-transport` en Node24.

La corrección frontend está preparada en PR #272 sobre la base exacta de A2: iframe privado + MessageChannel, nuevo origin exacto y CSP `frame-src`. A2 conserva integración y subida; después se ejecutan las comprobaciones HTTP reales.

Memoria: `MEMORIA/R39_R06_CLOUD_DEPLOY_20260926.md`.  
Control: `CONTROL/DELTA_R39_R06_CLOUD_DEPLOY_20260926.json`.

## R41 · Interactive Product Rebuild · HUMAN QA · 26/09/2026

**Estado vigente: `R41_INTERACTIVE_PRODUCT_REBUILD_REQUIRED`.**

María rechaza visualmente el Taller R40 integrado: las funciones existen, pero la arquitectura sigue siendo documento/formulario y relega el workspace. El reset R41 redefine el gate de producto: workspace-first, direct manipulation, toolbars compactas, inspector contextual, progressive disclosure y mobile específico.

Órdenes:
- A3 #277
- A5 #278
- A1 #279
- A4 #280
- A7 #281
- A2 #282
- A6 voz exclusivamente

#260/#261/#262/#263/#265 quedan superseded visualmente; se conservan como historial/base funcional.

Orden: `ORDENES/R41_INTERACTIVE_PRODUCT_REBUILD/`  
Normativa: `NORMATIVA/ADDENDUM_R41_INTERACTIVE_PRODUCT_DESIGN_20260926.md`  
Memoria: `MEMORIA/R41_HUMAN_QA_DESIGN_RESET_20260926.md`  
Control: `CONTROL/DELTA_R41_INTERACTIVE_PRODUCT_REBUILD_20260926.json`.

## R42 · normativa obligatoria embebida en cada orden · 26/09/2026

**Estado vigente: `R42_EMBEDDED_NORMATIVE_REBUILD_REQUIRED`.**

Por decisión expresa de María, ya no basta con enlazar normativa. El bloque completo aportado (429 líneas) está físicamente copiado dentro de cada orden R42 y versionado como fuente canónica.

Órdenes:
- Parent #283
- A3 #284
- A5 #285
- A1 #286
- A4 #287
- A7 #288
- A2 #289
- A6 continúa voz exclusivamente.

Gate: cada agente publica `R42_NORMATIVA_EMBEBIDA_LEIDA` y construye en la misma sesión. A2 rechaza handoffs sin ese marcador.

R41 #276–#282 queda sustituido. R40/R41 se conserva solo como historia/base funcional, no aceptación visual.

Fuente exacta: `NORMATIVA/BLOQUE_OBLIGATORIO_EMBEBIDO_R42_20260926.txt`.
Addendum: `NORMATIVA/ADDENDUM_R42_ORDEN_CON_NORMATIVA_EMBEBIDA_20260926.md`.
Memoria: `MEMORIA/R42_NORMATIVA_EMBEBIDA_20260926.md`.
Control: `CONTROL/DELTA_R42_NORMATIVA_EMBEBIDA_20260926.json`.


## R42 · Agente 1 · Recursos/Juegos/Rutinas · 26/09/2026

**Estado: `R42_A1_RESOURCES_GAMES_ROUTINES_READY_FOR_A2`.**

Agente 1 ha completado #286 después de publicar `R42_NORMATIVA_EMBEBIDA_LEIDA`.

Entrega técnica:
- branch `agent1/r42-resources-games-routines-ready`;
- HEAD `c88ede84d8f4f88e3a93390d7502e226ba5f4e0d`;
- tree `c8806e6a62ead7c8fa869a2793768d8d7a388f7d`;
- base freeze A2 `52e5f9f02184581a1bfb1878c388ede3d1068c47`;
- 297 juegos: 252 públicos preservados + 45 nuevos;
- experiencia play-first con 9 contextos y filtros etapa/contexto/tipo/habilidad/duración;
- 109 rutinas preservadas, todas con descarga SVG A4, watermark y atribución;
- manifest R42 de juegos y de rutinas;
- no ARASAAC;
- ES/EN completo en el alcance.

Workflow independiente `36241371415`, job `108402384115`: **SUCCESS**.

No es aceptación final: A2 debe integrar/subir una preview única y quedan HUMAN QA de María, móvil/lector de pantalla/zoom/impresión y reconciliación del pin exacto de licencia Mulberry.

Memoria: `MEMORIA/R42_A1_RESOURCES_GAMES_ROUTINES_20260926.md`.  
Control: `CONTROL/DELTA_R42_A1_RESOURCES_GAMES_ROUTINES_20260926.json`.

## R42 · separación por etapas de vida · 26/09/2026

**Estado: `R42_LIFE_STAGE_SEPARATION_ADOPTED`.**

María adopta como criterio de producto la separación/orientación por etapas cuando mejore la utilidad:
- Infancia
- Adolescencia
- Adultez
- Transversal / Cualquier edad

La separación orienta y no excluye: no exige diagnóstico, no obliga a elegir etapa, permite recursos multi-etapa y mantiene una vía transversal cuando proceda. No se duplica por edad si la experiencia no cambia de forma útil y no se infantiliza adolescencia/adultez.

Aplicación prioritaria: Juegos, Rutinas, Taller, Tus intereses, Cuaderno de Campo y recursos prácticos/descargables.

Memoria: `MEMORIA/R42_SEPARACION_ETAPAS_VIDA_20260926.md`.  
Normativa: `NORMATIVA/ADDENDUM_R42_SEPARACION_ETAPAS_VIDA_20260926.md`.  
Control: `CONTROL/DELTA_R42_SEPARACION_ETAPAS_VIDA_20260926.json`.

## R42 · Agente 7 · Rincón tranquilo inmersivo · 26/09/2026

**Estado: `R42_A7_QUIET_SPACE_IMMERSIVE_READY_FOR_A2`.**

Agente 7 completó #288 tras publicar `R42_NORMATIVA_EMBEBIDA_LEIDA` y construir sobre la fuente exacta R04 integrada por A2.

Entrega:
- branch `agent7/r42-quiet-space-immersive-20260926`;
- HEAD `5f804201fcd4fd7c165fa9c5e1f682f3098f75c2`;
- tree `2ec039620eac4f5728daa2fb26e3eaebf34840ed`;
- PR #291 draft;
- precheck remoto `R42_A7_STATIC_CONTRACT_PASS`.

R42 sustituye la estética plana R04 por motor inmersivo WebGL2 first-party con fallback y 12 espacios: nueve categorías reconstruidas más Bosque con niebla, Lago al amanecer y Nubes lentas. El stage domina escritorio/móvil, pantalla limpia recupera controles por interacción/foco y no hay autoplay. ES/EN se mantiene completo.

El audio conserva únicamente el ambiente de Mar R04 expresamente aceptado por María y regenera los demás paisajes tras acción explícita con identidades distintas.

No es aceptación final: A2 integra/sube la preview única y María/QA realiza HUMAN QA visual y auditiva. Un fallo perceptivo devuelve el carril a construcción.

Memoria: `MEMORIA/R42_A7_QUIET_SPACE_IMMERSIVE_20260926.md`.  
Control: `CONTROL/DELTA_R42_A7_QUIET_SPACE_IMMERSIVE_20260926.json`.
