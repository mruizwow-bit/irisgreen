# Memoria operativa consolidada · Iris Green / Sabik

Fecha de esta consolidación: 27/09/2026. Es una síntesis operativa identificada como tal; no reemplaza ni modifica los originales históricos V106/V114. El estado de una tarea posterior requiere evidencia nueva. Consultar también `../ESTADO_ACTUAL.md` y el control antes de escribir.

## Sabik · COPY PRODUCCIÓN ES/EN · R01 · 27/09/2026

Estado: `SABIK_COPY_PRODUCCION_R01_EXTRACTED_REVIEWED_PENDING_MARIA`.

Sobre PR #244 HEAD `e8cad400a30d5d4857f9f99b0c1070d786958a8b` se extraen 40 registros del lenguaje fijo/plantillas de Sabik. La revisión editorial mantiene 25, propone 14 revisiones y deja 1 HOLD. El inventario distingue texto de sistema locutable, locución opcional, UI, UI/lector de pantalla y anuncios exclusivos para tecnologías de apoyo.

Queda adoptada la gobernanza:
- entrenamiento vocal y copy de producto son conjuntos distintos;
- solo copy/contenido aprobado alimenta la biblioteca de audio;
- el contenido editorial de Iris Green conserva su fuente canónica y se vincula a audio por ID + versión + hash;
- se excluyen suposiciones emocionales, lenguaje terapéutico, infantilización y antropomorfismo innecesario;
- cada audio futuro conserva master vocal, configuración, hash de texto, hash de audio, versión y estado de vigencia.

El documento histórico de biblioteca narrada del 25/09 queda supersedido en su arquitectura ElevenLabs/dos voces distintas por el cierre de masters Qwen ES/EN del 27/09. No se borra su evidencia histórica.

Ver `MEMORIA/SABIK_COPY_PRODUCCION_R01_20260927.md`, `CONTROL/SABIK_COPY_PRODUCCION_R01_20260927.csv` y `NORMATIVA/ADDENDUM_SABIK_COPY_PRODUCCION_R01_20260927.md`.

## Voz Sabik ES/EN · cierre de identidad y procedencia · 27/09/2026

Estado vigente: `SABIK_VOICE_MASTERS_ES_EN_APPROVED_PROVENANCE_REGISTERED`.

La identidad vocal de Sabik se documenta como derivada de voz propia autorizada de la titular del proyecto. No se publica audio humano en el repositorio; se conservan hashes y trazabilidad. Se adoptan dos masters lingüísticos de una misma identidad: `SABIK_EN_MASTER_RETEST_01.wav` y `SABIK_ES_MASTER_V1.wav`.

El master ES, español peninsular, se ha validado mediante Qwen3-TTS Base ICL y 20/20 frases de control aprobadas por María. La ruta RVC desde el master inglés queda rechazada para español largo por acento inglés/cambio de voz y los 135 outputs de esa ruta no son dataset final.

Se separan formalmente `CORPUS_ENTRENAMIENTO_VOZ` y `SABIK_COPY_PRODUCCION`. Solo el copy de producción revisado podrá alimentar `SABIK_AUDIO_LIBRARY`. El corpus fonético puede contener redacciones no aptas para la web y nunca se promueve automáticamente a producto.

La autorización de la hablante cubre el uso de su voz y derivados dentro de Iris Green/Sabik y sus superficies; las licencias del software/modelos/dependencias siguen siendo un gate separado antes de release.

Ver:
- `MEMORIA/SABIK_VOZ_MASTERS_ES_EN_PROCEDENCIA_R01_20260927.md`
- `NORMATIVA/DECLARACION_PROCEDENCIA_AUTORIZACION_VOZ_SABIK_R01_20260927.md`
- `CONTROL/DELTA_SABIK_VOZ_MASTERS_ES_EN_R01_20260927.json`

## Prioridades y propietarios

María dirige Iris Green. Trabaja directamente con el agente 2 en las subidas e integración de la web y con Design en sus recursos. Codex construye e integra Sabik y biblioteca Cloud; los agentes libres completan incrementos concretos para él. No se interrumpe a A2 ni se reasigna Design. Los auxiliares no publican la web, no sustituyen su rama y no reconstruyen lo que Codex ya entregó.

## Sitios distintos

Frontend: repositorio `mruizwow-bit/irisgreen`, Netlify `irisgreen-home`, Site ID `40042464-343c-4587-b6b7-f6159836e291`, dominio `irisgreen.eu`.

La web no es un proyecto SSO privado: el público ve un despliegue de mantenimiento deliberadamente publicado y bloqueado. El ancla histórica es `6aa99a0d467202094ed9320f`; revalidar su estado antes de cualquier acción autorizada. No abrir la web ni cambiar dominios por centralizar documentos. Los candidatos completos se revisan montados en el mismo proyecto; no crear páginas o proyectos mínimos como sustitutos del sitio real.

Backend/biblioteca: Netlify `sabik-asistente`, Site ID `47b06e68-ff54-4097-8ad8-336b2d71758a`. Mantiene Team Login y es un carril distinto del frontend. No desplegar el backend como toda la web.

## Identidad y construcción

La página de Iris Green existente es la base canónica. Claude/Design aportan módulos, assets, mecánicas y contenido; no reemplazan cabecera, navegación, footer, Lectura, tipografía o funcionalidad por una página autónoma. Una restauración de base histórica solo sirve como referencia; nunca restablecer una web entera antigua sobre las subidas actuales de María.

Petición visual vigente: fondo blanco/cristal claro coherente con Sabik, retirada de la flor del logo. No autoriza cambiar todo el sistema visual. Referencias tipográficas del proyecto: Atkinson Hyperlegible para cuerpo y Newsreader/Georgia para títulos; IG Zero solo ajusta el carácter cero. Conservar CSS y ajustes efectivos de la versión vigente; no distribuir archivos de fuentes.

Sabik Web conserva su familia B3 aprobada y masters; anillos históricos retirados. No volver a poner el eslogan comercial o un rótulo técnico de estado en la interfaz. Movimiento con función cognitiva y no único canal de información.

## Motion R37

Referencia de entrega: rama `codex/sabik-motion-r37-20260924`, HEAD `c23abd9a3ef082a6ed646b03334fe9031b17af15`, tree `327e7c30b12baa829ede070e2f2641a223695fd2`, parent `5ba9bced1569a3748825d7c2ce32247ba9217cb5`.

Cinco estados: PRESENTE, ORIENTAR, TRANSICIÓN, PAUSA, CONFIRMAR. PRESENTE quieto. NORMAL, REDUCIDO y SIN_MOVIMIENTO; reducción del sistema prevalece. Movimiento finito e interrumpible, sin spinner, loops, pulso/respiración, celebración, emoción inferida o sincronía con voz. No EXPLORAR ni sexto estado.

Deploy de la entrega: `6ab4beac4267a5275ff2feb5` en irisgreen-home. Estado aceptado solo como candidato técnico; revisión visual de María y verificaciones manuales pendientes. Los fallos históricos que esperan anillos o voz no justifican restaurar funciones retiradas ni se convierten por silencio en PASS.

## Biblioteca R38 y adaptador R39

R38: HEAD `ddd12ed4e002812f5c53e24618c029be9faf9e00`, tree `75e227251df48b91442bee53213f087934982938`, base de PR234 `32bde31544bb51feb2a00e14e28b5a58d74a5d55`. PR234 se conserva sin reescribir ni fusionar por estos trabajos.

Corpus español sellado: versión `n04-es-20260916-56f72c4d3959`; 2.553.061 bytes; 4.332 fragmentos y 4.332 IDs; SHA256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`; Git blob `0e297c977ce3b688186ca917981458adfd5e5ca3`.

Store deploy-specific con nombre `sabik-n04-corpus`, región de la entrega `us-east-2`, claves `manifest.json` y `versions/<version>/corpus.json`. Loader, índice léxico determinista, citas, caché por deploy/versión y escritura sellada ya existen. No otro motor. El corpus no contiene conversaciones, preferencias, perfiles, audio o datos privados. No modificar ranking o bytes por otra tarea.

Deploy Cloud de referencia R38: `6ab4c1a15435b93043ab3f6d`. Function `n04-library-qa` en POST `/internal/n04/library/search`; Team Login más secreto de Function, nunca clave cliente. La entrega declara Node22.16.0 local y Node24 en ejecución: comprobar compatibilidad, no presumirla.

R39 entregado: `codex/n04-retrieval-r39-20260924`, HEAD `92f24c8c89e8d429a6936efd962ee3f5dad936f0`, tree `b2f16866493e611fcd5a6fb84b4f18ced0337d6b`. Archivos dentro de `cloud/n04-r38-library/`; ya existen `sabik-retrieval.mjs`, `sabik-retrieval-server.mjs`, tipos, validación, citas, errores y composición de servidor. No crear `cloud/n04-r39-retrieval/` para rehacerlos.

El ZIP de la entrega declara `R39_deployed=false`. Una lectura directa de Blobs desde proceso local no prueba HTTP autenticado. Las sondas recibidas dieron 401 HTML antes de respuesta de aplicación. C17 sigue pendiente: no registrar payload propio no demuestra retención de plataforma. No desactivar Team Login, exportar cookies/tokens ni repetir métodos de acceso previamente bloqueados.

## Recursos y descargas

Los 130 juegos antiguos están completamente retirados del programa: no revalidar/rediseñar, migrar, reutilizar ni contar. Las nuevas actividades se diseñan por utilidad real. Los planes de volumen son objetivos, no contenido publicado o aprobado.

Recursos para infancia, adolescencia, adultos y uso transversal, incluidos adultos sin diagnóstico. No requerir diagnóstico ni infantilizar. Pictogramas ya existentes y con licencia/trazabilidad; no inferir aprobación visual de un mapeo candidato. La auditoría histórica distingue 92 rutinas/427 pasos; 405 mapeos candidatos y 22 sin equivalente, no 405 pictogramas finales distintos.

Materiales descargables originales de Iris Green gratuitos, sin paywall. Marca de composición `IRIS GREEN · irisgreen.eu` en páginas y exports, sin flor y sin tapar información. Retener autoría/licencia de pictogramas ajenos; no copiar packs comerciales ni adjudicarse sus ilustraciones. Interfaz pública sin B0/B1/piloto, hashes, reconciliación o referencias internas.

## Bilingüismo y normativa

Todo cambio público debe estar completo en español e inglés: texto, UI, errores, accesibilidad, ayuda, medios y descargables pertinentes. La versión inglesa no es un añadido opcional posterior. Una interfaz inglesa no demuestra corpus inglés; este último requiere una entrega versionada explícita sin alterar N04 sellado.

Cada orden contiene requisitos aplicables de construcción, accesibilidad, escritura y lectura y una cláusula ES/EN. El marco común contiene referencias WCAG/COGA, ISO/EN/UNE/PDF y reglas verificables; ediciones y alcance jurídico deben comprobarse con fuentes oficiales. No heredar certificaciones ni aprobar normas citadas solo en un resumen.

## Qué significa terminado

Separar orden emitida, recibida, construcción, código entregado, integración, despliegue, ejecución real y aceptación humana. Actualizar estado solo con evidencia. No sustituir una entrega utilizable por un informe; no bloquear piezas independientes por una barrera externa distinta. Codex integra Cloud, María/agente2 integran web, agente7 consolida registros. Permanecen cerradas apertura pública, proveedor/modelo, embeddings, `/api/chat` e inferencia conversacional o voz salvo nueva autorización expresa.

## Addendum 26/09/2026 · R40 Rincón R03

Estado vigente: **`R40_RINCON_R03_FULL_AUDIO_UX_BUILD_READY_FOR_A2`**.

A7 termina la reconstrucción exigida por #269 sobre la base A2 `bba503efb24aa15bacfbf1c0d47986420705d3bf` y entrega `agent7/r40-rincon-r03-20260926@ad08841ba563ddda38a3d1dac7ee70421faaf88b` (tree `bd75fd67e598aa8b7fb40b400e3d93821b99c2e5`, draft PR #270).

El delta contiene 12 sonidos generales sintetizados first-party, 9 ambientes de escena, 9 escenas incluida Pulpos, selector superior Vídeos / Sonidos / Bola de relajación, una sola región activa, ES/EN, controles explícitos, crossfade, reduced motion, forced-colors y fallback. Las grabaciones históricas HOLD quedan fuera del runtime R03.

A7 revisó la entrega directamente en GitHub y cerró cuatro defectos detectados durante esa revisión. Precheck estructural final: 94/94 comprobaciones PASS.

No se declara aceptación auditiva/visual. A2 sigue siendo la única puerta a la web y debe integrar/subir; después se exige escucha y revisión visual humana en Deploy Preview.

Registro de decisión: `R40_RINCON_R03_DECISION_AUDIO_UX_20260926.md`. Entrega A7: `R40_RINCON_R03_ENTREGA_A7_20260926.md`. Normativa: `../NORMATIVA/ADDENDUM_R40_RINCON_R03_AUDIO_UX_20260926.md`.

## Addendum 26/09/2026 · R40 Rincón R04

Estado vigente: **`R40_RINCON_R04_REAL_REBUILD_READY_FOR_A2`**.

Tras el HUMAN QA FAIL de R03, A7 completa R04 con una reconstrucción audiovisual real:
- 12 sonidos generales y 9 ambientes renderizados offline first-party;
- tres sprites locales con manifest y hashes;
- motor visual nuevo común para Mar, Lluvia, Río, Noche, Acuario, Tubo, Medusas, Fibra y Pulpos;
- reproductor/estado/bola primero, catálogo después y ajustes secundarios en disclosure;
- selector superior único y equivalente móvil;
- ES/EN, no autoplay, reduced motion, forced-colors y fallback.

Entrega final: `agent7/r40-rincon-r04-final-20260926@7f15dd174fc26b7768224896492ff240c5cecdf5`, tree `cac62fe72d1a193edc9e31ab9cfa177e5c92ca6d`, draft PR #274.

El workflow `36237393274` terminó SUCCESS. A7 verificó que los blobs de producto/audio del HEAD final coinciden con los cubiertos por ese run; los SHA-256 de los tres sprites fueron recalculados y coinciden. También se revisaron visualmente las seis capturas finales 1440×900 y 390×844.

No existe PASS perceptivo todavía. A2 integra/sube; la aceptación exige preview web + escucha y revisión visual humana.

Memoria: `R40_RINCON_R04_ENTREGA_A7_20260926.md`. Evidencia: `../EVIDENCIAS/R40_RINCON_R04_A7/`.

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
- HEAD `92c686e0e57748b4025b192babbe0c79d80cdff7`;
- tree `3225b7b50c2b8b5bcbf578c8b75dd1f61e06e73e`;
- PR #291 draft;
- precheck remoto `R42_A7_STATIC_CONTRACT_PASS`.

R42 sustituye la estética plana R04 por motor inmersivo WebGL2 first-party con fallback y 12 espacios: nueve categorías reconstruidas más Bosque con niebla, Lago al amanecer y Nubes lentas. El stage domina escritorio/móvil, pantalla limpia recupera controles por interacción/foco y no hay autoplay. ES/EN se mantiene completo.

El audio conserva únicamente el ambiente de Mar R04 expresamente aceptado por María y regenera los demás paisajes tras acción explícita con identidades distintas.

No es aceptación final: A2 integra/sube la preview única y María/QA realiza HUMAN QA visual y auditiva. Un fallo perceptivo devuelve el carril a construcción.

Memoria: `MEMORIA/R42_A7_QUIET_SPACE_IMMERSIVE_20260926.md`.  
Control: `CONTROL/DELTA_R42_A7_QUIET_SPACE_IMMERSIVE_20260926.json`.

## R42 · protección de menores en Situaciones/Condiciones · 26/09/2026

**Estado: `R42_CHILD_SAFE_CONTENT_ARCHITECTURE_REQUIRED`.**

María decide extender la separación por etapas a Situaciones y Condiciones para reducir exposición accidental de menores a contenido de alta sensibilidad.

Arquitectura adoptada:
- audiencia: Infancia / Adolescencia / Adultez / Transversal;
- sensibilidad: S0_GENERAL / S1_SENSITIVE / S2_HIGH_SENSITIVITY;
- discovery: NORMAL / INTENTIONAL_ONLY / SAFE_VARIANT_REQUIRED;
- safe-by-default sin selección;
- sin DOB/cuenta/perfil remoto;
- protección de descubrimiento incidental sin ocultar vías seguras de ayuda.

Inventario observado: 185 Condiciones + 187 Situaciones = 372 fichas.

Issues:
- #293 parent
- #294 A4 clasificación
- #295 A3 implementación
- #296 A1 enlaces seguros
- #297 A2 integración/live QA

Normativa: `NORMATIVA/ADDENDUM_R42_PROTECCION_MENORES_CONTENIDO_20260926.md`.  
Memoria: `MEMORIA/R42_PROTECCION_MENORES_SITUACIONES_CONDICIONES_20260926.md`.  
Control: `CONTROL/DELTA_R42_PROTECCION_MENORES_20260926.json`.

## R42 · child-safe diferido hasta terminar la oleada actual · 26/09/2026

**Estado vigente: `R42_CHILD_SAFE_DEFERRED_UNTIL_CURRENT_WORK_COMPLETE`.**

La arquitectura #293–#297 sigue aprobada, pero María decide implementarla después de terminar los trabajos R42 actuales, para no tocar dos veces catálogos, buscador, app shell y enlaces mientras todavía están cambiando.

No ejecutar ahora patches/ramas child-safe.

Reanudar tras:
1. construcción R42 actual terminada;
2. integración A2;
3. preview estable;
4. nuevo baseline HEAD/tree registrado.

Memoria: `MEMORIA/R42_CHILD_SAFE_DEFERRED_20260926.md`.  
Control: `CONTROL/DELTA_R42_CHILD_SAFE_DEFERRED_20260926.json`.

## R42 · Agente 7 · HUMAN QA FAIL · 26/09/2026

**Estado: `R42_A7_HUMAN_QA_FAIL_REBUILD_REQUIRED`.**

María rechaza la preview integrada del Rincón R42: las escenas no alcanzan calidad inmersiva, la interfaz se percibe pobre y existen solapamientos de botones/controles. El gate técnico aislado de A7 no fue suficiente para detectar la composición real con el app shell.

La entrega previa #291 queda superseded como solución aceptable. Próximo paso: reconstrucción sobre el resultado integrado R42 real y nueva HUMAN QA visual/auditiva antes de cierre.
## R42 · Agente 7 · rebuild tras HUMAN QA · 26/09/2026

**Estado: `R42_A7_HQA_REBUILD_READY_FOR_A2`.**

Tras el rechazo de María, A7 reconstruye el Rincón sobre la preview integrada real. El enfoque cambia de shader procedural como visual principal a vídeo natural real y trazable para Mar, Lluvia, Río, Noche, Acuario, Medusas y Pulpos; Tubo de burbujas y Fibra óptica permanecen como escenas sensoriales GPU locales.

Entrega: PR #300 · HEAD `6c312d3fbd2677180a7894159f14b19894fe0eae` · tree `94ae6c72e88b6dc9752c14cfbd3a9c6cb9c16dc5` · base A2 `ab952077464b1348d3da88ee974f9375b3458bc9` · precheck `R42_A7_HQA_REBUILD_STATIC_PASS`.

Se vuelve a nueve escenas curadas, se retiran las tres extras de calidad insuficiente, se eliminan pósteres legacy del stage/selector y se rehace la barra de controles para impedir solapamientos con el app shell. Mobile 760/390, clean mode, reduced motion, Save-Data y fallback incluidos.

PR #291 queda superseded como solución final. El siguiente gate es A2 → preview → HUMAN QA visual/auditiva de María.

## R42 · estudio de cristal subordinado a normativa completa · 26/09/2026

**Estado: `R42_CRYSTAL_STUDY_SUBORDINATE_TO_FULL_NORMATIVE`.**

María confirma que cualquier decisión derivada del estudio de Liquid Glass/glassmorphism debe aplicar toda la normativa Iris Green. El estudio es referencia técnica subordinada, no autoridad paralela.

A3/A5/A1/A4/A7/A2 han recibido el addendum. A2 debe rechazar una integración que cumpla estética/contraste pero incumpla ES/EN, web+móvil, WCAG/ISO/EN/COGA, privacidad, trazabilidad, etapas, lenguaje claro, accesibilidad cognitiva, teclado/foco/zoom/forced-colors/reduced-motion/transparency o HUMAN QA.

Normativa: `NORMATIVA/ADDENDUM_R42_CRISTAL_BAJO_NORMATIVA_COMPLETA_20260926.md`.  
Memoria: `MEMORIA/R42_CRISTAL_NORMATIVA_COMPLETA_20260926.md`.  
Control: `CONTROL/DELTA_R42_CRISTAL_NORMATIVA_COMPLETA_20260926.json`.

## R42 Design · sistema material/cristal · R02 revisado · 27/09/2026

**Estado vigente: `R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2`.**

Astra revisa el paquete R02 `Interfaz(1).zip` (SHA-256 `650b1993c2f780c4b0fffdabfd8ae2524df10bd234e365e5bcbc264fd5f8edd6`) sobre la base A2 todavía exacta `e8cad400a30d5d4857f9f99b0c1070d786958a8b`, tree `827a68fae6596a929e4d246bb47b8494a976e8a3`.

Reproducción Astra:
- Python 4 scripts: PASS;
- `node --check preferencias-lectura.js`: PASS;
- medición analítica: **30/30 PASS**;
- diff final: **+1376/−22**;
- Chromium sintético: inspector/dialog/popover/sheet del Rincón en `#0b1a2b`, opacos y sin backdrop; regresión de fondo efectivo **11,82:1** contra el botón opaco;
- aviso ES/EN de `Más contraste`: PASS sin modificar la elección manual de Transparencia;
- el diff R01→R02 reconstruye los hashes conocidos de R01 en los cinco archivos de código corregidos.

Astra completa la reconciliación que Design no pudo hacer porque los canónicos viven en la rama de coordinación, no en la rama A2. Resultado: **PASS_NO_CODE_CONFLICT**.

El nuevo HOLD de interfaz del Taller se conserva: el piloto R02 sobre Taller/Dibujo valida únicamente material/chrome y NO congela ni acepta la arquitectura del Taller. Tras la arquitectura final del Taller, el material deberá volver a probarse antes de propagación global.

Observaciones no bloqueantes:
- `OBS-R42-DESIGN-R02-DOC-01`: documentos R01 heredados dentro del ZIP conservan texto READY/“entregado A2”; la reentrega R02 + registro canónico Astra los superseden.
- `OBS-R42-DESIGN-R02-EVIDENCE-01`: el script reproduce las mismas 30 filas/valores pero reescribe los informes sin la metadata narrativa del snapshot enriquecido. La salida CI es la evidencia máquina canónica.

A2 puede aplicar R02, crear HEAD/tree y ejecutar `r42-materiales.yml`. Siguen pendientes build real, browser.json, 48 capturas primarias + evidencia adicional del Rincón, Deploy Preview, lector de pantalla, zoom/reflow y HUMAN QA María.

No main · no producción · no propagación global.

Handoff: `HANDOFFS/R42_DESIGN_R02/README.md`.  
Memoria: `MEMORIA/R42_DESIGN_R02_REVISION_ASTRA_20260927.md`.  
Normativa: `NORMATIVA/ADDENDUM_R42_DESIGN_R02_RECONCILIACION_20260927.md`.  
Control: `CONTROL/DELTA_R42_DESIGN_R02_REVISION_ASTRA_20260927.json`.

## R42 · Taller · física y CSP · 26/09/2026

**Estado: `R42_A5_PHYSICS_CSP_DUAL_ENGINE_REQUIRED`.**

Astra verifica que el build público retira `'unsafe-eval'` y deja `script-src 'self' 'unsafe-inline'`, sin `'wasm-unsafe-eval'`. Rapier es WebAssembly y no puede considerarse capacidad garantizada de producción bajo esa política. Planck.js actual es JavaScript/TypeScript 2D y sí funciona con la CSP vigente.

Decisión:
- no modificar ahora la CSP global;
- Planck = backend canónico de producción para física 2D del Taller;
- Rapier = backend opcional/acelerado solo cuando la política efectiva permita WebAssembly;
- ninguna actividad pública puede depender exclusivamente de Rapier;
- si WASM está bloqueado, no debe haber error visible ni estado roto;
- física 3D real reabre la decisión; una vista 3D/isométrica no.

A2 integra A5 sin tocar la CSP y prueba la física con el header final generado por build. Una futura habilitación de `'wasm-unsafe-eval'` exige decisión A2/Astra separada y prueba de la política HTTP efectiva; una segunda CSP más permisiva no anula otra más restrictiva.

Memoria: `MEMORIA/R42_TALLER_FISICA_CSP_DUAL_ENGINE_20260926.md`.  
Normativa: `NORMATIVA/ADDENDUM_R42_TALLER_FISICA_CSP_20260926.md`.  
Control: `CONTROL/DELTA_R42_TALLER_FISICA_CSP_20260926.json`.

## R42 · Taller · investigación intensiva de interfaz · 26/09/2026

**Estado: `R42_TALLER_INTERFACE_RESEARCH_COMPLETE_IMPLEMENTATION_HOLD`.**

Astra ha contrastado el documento de interfaz con el código real de A2 `e8cad400...`, el PR #299 de A5 `8c1a9cc...` y fuentes actuales de Figma, W3C, PhET, Blockly, CodeMirror, Three.js, Chrome, PixiJS, AEPD, ICO y Fundación Telefónica.

Conclusión: se conserva el trabajo útil de #299, pero no se amplía fase 6 todavía. El Taller debe evolucionar hacia **un shell común estable + cinco perfiles de banco de trabajo**, no 25 páginas independientes ni un único motor genérico.

Confirmado en código:
- PR #299 ya elimina persistencia de etapa;
- WebGPU previo era solo detección;
- AudioWorklet usa Blob y cae en silencio;
- no había Three/Pixi/Rapier/Planck/Blockly/CodeMirror/Tone en `e8cad400...`;
- Arquitectura R43 “3D” sigue siendo proyección Canvas2D;
- Ritmo/Composición R43 usan `setTimeout`;
- el shell actual ya tiene workspace/rail/inspector, pero falta Scene/Structure tree, inspector realmente ligado a selección, modelo semántico/Mirror DOM, Actions/command palette y contrato común de zoom/pan.

Correcciones de investigación:
- Blockly v13 accesible ya está disponible;
- Fundación Telefónica sí exige creaciones propias en talleres actuales;
- WCAG 2.5.7 exige alternativa de puntero sin drag además del teclado;
- W3C XAUR aporta base para accesibilidad espacial/3D;
- no se aceptan como evidencia arquitectónica las cifras Scratch 33→60 ni PhET 18/23 en 10 minutos.

Observación abierta:
`OBS-R42-TALLER-STORAGE-01`: el documento recibido dice “sin almacenamiento del navegador”, pero Memoria/Control/código A5 conservan IndexedDB/proyectos locales y OPFS opcional. No añadir persistencia nueva hasta decisión/reconciliación de María.

Arquitectura propuesta: shell común + perfiles Lienzo, Construir/Probar, Timeline, Bloques/Código/Ejecutar y Documento/Sistema de conocimiento; modelo semántico Iris común para renderer, estructura, inspector, accesibilidad, undo/redo, export y tests; etapa de vida efímera y nunca bloqueante; gate final artifact-first + HUMAN QA.

Memoria: `MEMORIA/R42_TALLER_INTERFAZ_INVESTIGACION_INTENSIVA_20260926.md`.  
Evidencia: `EVIDENCIAS/R42_TALLER_INTERFAZ_INVESTIGACION_20260926/README.md`.  
Normativa: `NORMATIVA/ADDENDUM_R42_TALLER_INTERFAZ_ACCESIBLE_20260926.md`.  
Control: `CONTROL/DELTA_R42_TALLER_INTERFAZ_INVESTIGACION_20260926.json`.

## R42 · contenido R01 auditado + child-safe reactivado para nueva web · 27/09/2026

**Estado de fase: `R42_CHILD_SAFE_CONTENT_REACTIVATED_FOR_DESIGN_NEW_WEB`.**  
**Paquete: `R42_CONTENT_R01_AUDITED_READY_FOR_DESIGN_CHILD_SAFE`.**

Por decisión de María, la protección infantil deja de estar diferida para la migración de contenido a la nueva web.

La reactivación es **Design-first**:
- #302 adapta contenido, discovery y variantes seguras al nuevo sistema;
- #294–#297 permanecen pausados como implementaciones del baseline anterior;
- tras revisión Astra de #302 se emitirán deltas nuevos contra el baseline real de la nueva web.

Paquete fuente auditado:
`iris-green-contenido-R01-20260924.zip` · SHA-256 `e44633d2c4707e69276c88728a090212f6d791046cc8dbe38399270f5c29551a`.

Paquete preparado para Design:
`iris-green-contenido-R02-DESIGN-CHILD-SAFE-20260927.zip` · SHA-256 `b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23`.

Auditoría:
- 118 entidades nuevas reales, no 152 fichas;
- 204 HTML = 102 fichas bilingües;
- catálogos: 226 Condiciones, 223 Situaciones, 62 Vida diaria, 60 Datos;
- Investigación 132;
- directorio ES 262;
- 204 páginas nuevas con estructura/fuentes ES/EN correcta;
- 245 enlaces de footer EN→ES: no migrar shell/footer legado;
- 12 `sample_en` + 4 `authors_en` corregidos;
- 4 registros jurídicos normalizados.

Child-safe manifest:
- 965 registros;
- S0 724;
- S1 225;
- S2 16;
- NORMAL 945;
- SAFE_VARIANT_REQUIRED 16;
- INTENTIONAL_ONLY 4.

Regla dura: para DEFAULT/INFANCIA/ADOLESCENCIA, el cuerpo completo S2 no viaja en HTML/payload inicial ni se prefetch/preload. Deep link o búsqueda intencional devuelve variante segura. ADULTEZ carga full solo tras acción explícita.

Esta es protección frente a descubrimiento incidental, no age assurance. No DOB, identidad, cuenta o diagnóstico.

Orden Design: #302.  
Parent: #293.  
Puerta A2: #289.

Memoria: `MEMORIA/R42_CONTENIDO_R01_AUDITORIA_CHILD_SAFE_20260927.md`.  
Normativa: `NORMATIVA/ADDENDUM_R42_CHILD_SAFE_REACTIVADO_NUEVA_WEB_20260927.md`.  
Control: `CONTROL/DELTA_R42_CONTENIDO_R01_AUDITORIA_CHILD_SAFE_20260927.json`.  
Handoff: `HANDOFFS/R42_DESIGN_CONTENT_CHILD_SAFE_R01/README.md`.

## R42 · auditoría Rincon.zip · 27/09/2026

**Estado: `R42_RINCON_ZIP_AUDIT_SPLIT_REQUIRED`.**

El ZIP recibido como `Rincon.zip` es en realidad la entrega mixta Design R01 completa:
- SHA-256 `0efd80e61ff489ce4f38a0fd496c934cfad565954130300cfbf90c1574d17309`;
- base `e8cad400...`;
- HEAD interno `d78330bc...`;
- tree `4615b69c...`;
- 103 archivos, +10934/−6062, 5 commits;
- checksums internos íntegros.

**No integrar el bundle completo.**

Separación canónica:
1. Material R01 → superseded por Design R02 ya aprobado.
2. Rincón → dos fixes pequeños siguen vigentes y faltan en A7 PR #300: mutación idempotente de clases en Pantalla limpia y `[hidden]{display:none!important}` en acciones.
3. Juegos → 13 juegos R03 + 71 pictogramas + fix móvil de foco/cabecera no están en A1 HEAD 297; preservar como lote independiente y pasar por child-safe antes de integración.

QA recibido: navegador 111/111, móvil 273/273, axe 36 runs/0 violaciones, checksums PASS. Las capturas Rincón son estructurales/materiales, no sustituyen real-media/HUMAN QA.

Memoria: `MEMORIA/R42_RINCON_ZIP_AUDITORIA_20260927.md`.  
Control: `CONTROL/DELTA_R42_RINCON_ZIP_AUDITORIA_20260927.json`.  
Handoff: `HANDOFFS/R42_RINCON_ZIP_AUDIT/README.md`.
