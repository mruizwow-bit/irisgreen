# Órdenes del equipo · continuidad vigente R06

## Claude · cola prioritaria corregida · 30/09/2026

Fuente: `CLAUDE_COLA_VIGENTE_20260930.md`.

No usar selectores/pickers locales con estados anteriores.

Prioridad:
1. R61 Pecera: **preservar/transferir**, no rerender.
2. R62 P03: solo causalidad layout R3 + preservar cadena.
3. R68 Faroles: R2 espacial.
4. R65: sin trabajo de arte; espera HUMAN QA María de 27+9.

Regla:
`PRESERVE → INTEGRATE → ACTIVATE → NEW_WORK`.


## Claude · R62 P03 · causalidad layout R3 · 30/09/2026

Orden: `R62_ASTRA_JUEGOS_6_PILOTOS/06_AURA_P03_QA2_CAUSALITY_LAYOUT_FIX.md` · issue #326.

Estado: `R62_P03_QA_REWORK_2_GAMEPLAY_PASS_CAUSALITY_LAYOUT_FIX_REQUIRED`.

No reabrir gameplay, materiales, tablero ni composición. Corregir únicamente el solapamiento de copy 3/4 en causalidad LIGHT/NAVY; limpiar anclajes offscreen móvil si se toca overlay; ejecutar test P03 y test identidad P01 cuando el árbol correspondiente esté disponible.

Siguiente gate:
`R62_P03_CAUSALITY_LAYOUT_R3_READY_FOR_ASTRA_AURA_MARIA`.


## Agente R59 · Fósiles R2v3 · QA/GOV final · 30/09/2026

Orden: `R59_AGENTE_INTERESES/ADDENDUM_FOSSILS_R2V3_REPRO_QA_GOV_20260930.md` · issue #323.

Estado: `R59_FOSSILS_R2V3_REPRO_CONTRACT_ACCEPTED_QA_NOMINAL_GOV_STILL_BLOCKED`.

No tocar producto ni arte. Corregir únicamente selección/assert de las cuatro capturas nominales y reconciliar ejecutor real vs rama `codex/`. El contrato de reproducibilidad R2v3 se conserva.

Siguiente gate:
`R59_FOSSILS_PILOT_R2V4_NOMINAL_QA_GOV_FIXED_READY_FOR_ASTRA_MARIA`.


## Claude · R61 Pecera · final QA / transfer · 30/09/2026

Orden: `R61_CLAUDE_RINCON_PECERA/05_AURA_FINAL_QA_TRANSFER_PENDING.md` · issue #325.

Estado: `R61_PECERA_10MIN_MASTER_KEEP_FINAL_QA_TRANSFER_PENDING`.

KEEP del máster de 10 min. No rerender visual. Claude debe transferir binarios/build y completar 390/320, NORMAL/REDUCIDO/SIN_MOVIMIENTO, controles, performance o PENDING_HARDWARE_QA, benchmark E4 y decisión de peso basada en medición.

Siguiente gate:
`R61_PECERA_FINAL_PACKAGE_MOBILE_BENCHMARK_QA_READY_FOR_ASTRA_MARIA`.


## Claude · R68 Faroles · direction rework · 30/09/2026

Orden vigente: `R68_CLAUDE_FAROLES/02_AURA_DIRECTION_REWORK.md` · issue #335.

Estado: `R68_FAROLES_DIRECTION_KEEP_SPATIAL_LIGHTING_REWORK_REQUIRED`.

Claude conserva atlas + mecanismo de proyección, pero rehace volumen de nave, material de faroles, caída/localización de luz y densidad visual. No agua primero. Entregar únicamente evidencia R2 acotada y STOP.

Siguiente gate:
`R68_CLAUDE_FAROLES_DIRECTION_R2_READY_FOR_ASTRA_AURA_MARIA`.


## Claude · R42 Contenido R02 · rebase final sobre A2 vivo · 29/09/2026

Orden: `R42_CONTENT_R02_REBASE_CURRENT_A2/01_CLAUDE.md` · issue #302.

Estado: `R42_CONTENT_R02_AUDITED_CURRENT_A2_REBASE_REQUIRED`.

La entrega R02 conserva contenido, child-safe, Investigación 132 y clasificación AGE de A2, pero el ZIP se cerró sobre `9c721a79` y A2 ya está cinco commits por delante en `2fcb193f...`. `scripts/build_site.py` colisiona con R67 Taller shell. Claude debe rebasar de nuevo sobre el HEAD A2 vivo y repetir QA. No ampliar contenido hasta cerrar este gate.


## Claude · R61 Pecera · burbujas PASS / render 10 min · 29/09/2026

Orden: `R61_CLAUDE_RINCON_PECERA/04_ASTRA_BURBUJAS_PASS_RENDER_10MIN.md` · issue #325.

Estado: `R61_PECERA_BUBBLES_PROTOTYPE_HUMAN_APPROVED_RENDER_10MIN_AUTHORIZED`.

Claude puede renderizar el máster ≈10 min y ejecutar remux/QA final. No mover roca, no reabrir composición y no subir densidad por defecto. Tras entregar `R61_PECERA_10MIN_ILLUSTRATED_AV_READY_FOR_ASTRA_MARIA`, STOP para Astra/HUMAN QA.


## Claude · R62 P03 Rutas de luz · HUMAN QA rework · 29/09/2026

Orden: `R62_ASTRA_JUEGOS_6_PILOTOS/05_ASTRA_P03_HUMAN_QA_REWORK.md` · issue #326.

Estado: `R62_P03_HUMAN_QA_REWORK_REQUIRED`.

Claude conserva la mecánica y rehace únicamente la ejecución espacial/lumínica: sala tridimensional, pared/material, interacción física de la luz, bastidor integrado y móvil propio. Siguiente gate: `R62_P03_RUTAS_LUZ_E4_R2_READY_FOR_ASTRA_MARIA`.

P04–P06, Codex, A2, main y producción siguen HOLD.


## Claude · R61 Rincón Pecera · 28/09/2026

Orden: `R61_CLAUDE_RINCON_PECERA/01_CLAUDE.md` · issue #325.

Claude crea solo el piloto Pecera audiovisual ~10 min con audio first-party propio integrado.

Astra revisa → María HUMAN QA → después se decide escalar a Medusas/Mar/Río/Bosque.


## Claude · R60 Música original Iris Green · 28/09/2026

Orden: `R60_CLAUDE_MUSICA_ORIGINAL/01_CLAUDE.md` · issue #324.

Claude demuestra primero pipeline de render original y después crea 4 pilotos cortos. No produce biblioteca masiva sin escucha Astra/María.

A2 integra solo tras gate. María HUMAN QA auditiva final.


## Codex · R59 Intereses · 28/09/2026

Orden: `R59_CODEX_INTERESES/01_CODEX.md` · issue #323.

Codex reestructura 72/72 primero. No construye 72 ni inventa dirección artística. Tras conceptos Astra/María aprobados, construye solo 6 pilotos.

Astra revisa → A2 integra → María HUMAN QA.


## Codex · R57 Juegos · 28/09/2026

Orden: `R57_CODEX_GAMES/01_CODEX.md` · issue #321.

Codex clasifica 297/297 y después construye 6 pilotos solo tras concepto aprobado. No diseña dirección artística; implementa referencias aprobadas por Astra/María.

Astra revisa → A2 integra → María HUMAN QA.


## Claude · R54 Taller visual · 28/09/2026

Orden: `R54_CLAUDE_TALLER_VISUAL/01_CLAUDE.md` · issue #318.

Claude no reescribe los motores R47. Enriquecerá la Home y los interiores para que cada estudio entre por una mini-escena/escena visual, no por iconografía mínima. Infancia recibe dirección visual más inmediata y cálida sin infantilización.

Astra revisa → A2 integra → María HUMAN QA.


## Agente 3 + A2 · R52 Sabik moving presence + voice · 27/09/2026

Issue #315.

A3 restaura desde `sabik-preview@fc5cdfc...` la presencia móvil anterior aprobada, adaptada al panel actual y sin reintroducir la página/semánticas antiguas. A2 integra después la voz final ES/EN y los 30 WAV canónicos.

R37 queda como simplificación intermedia, no como continuidad visual final.


## Agente 9 · R51 Biblioteca Cloud R04 · 27/09/2026

Orden: `R51_A9_SABIK_CLOUD_LIBRARY_R04/01_AGENTE_9.md` · issue #314.

A9 continúa la biblioteca Cloud de Sabik. R03 queda histórica/inmutable; R51 crea R04 con cobertura editorial ampliada y sistema incremental de actualización. Tras R04, cada cambio aprobado de la web debe generar un delta y, si afecta contenido, una nueva versión privada verificada de la biblioteca.

No producción, frontend, voz, secretos ni datos de usuario.


## Agente 8 · R49 interfaz transversal · 27/09/2026

Orden: `R49_A8_INTERFAZ_TRANSVERSAL/01_AGENTE_8.md` · issue #311.

Tras completar #305/PR #310, A8 industrializa R42/R02 para toda Iris Green. Usa perfiles CONTENT/BROWSE/WORKSPACE, common chrome, IGPreferences, IGAudience y child-safe. R46/R47/R48 consumen el sistema sin ceder sus motores/producto a A8.

Gate nuevo de María: no bandas laterales gigantes vacías; reading width y product width son conceptos distintos.


## Claude · R48 Intereses definitivos · 27/09/2026

Orden: `R48_CLAUDE_INTERESES_DEFINITIVOS/01_CLAUDE.md` · issue #309.

Claude conserva las 72 temáticas y 11 grupos, pero reconstruye su coherencia editorial/técnica. A4 R42 es donante, no solución final. Cada interés debe tener una experiencia propia y un subconjunto de datos justificado; mapas y datasets completos solo cuando el propósito lo exija. Design R02 y child-safe son obligatorios.

Astra revisa antes de A2; A2 integra; María hace HUMAN QA.


## Claude · R47 Taller definitivo · 27/09/2026

Orden: `R47_CLAUDE_TALLER_DEFINITIVO/01_CLAUDE.md` · issue #308.

Claude reconstruye 27/27 estudios del Taller como una única generación de aplicaciones creativas. R43 v2 y PR #299 son donantes. Debe aplicar Design R02 al 100 % del Taller, child-safe real SAFE_BY_DEFAULT y arquitectura workspace-first. Astra revisa antes de A2; A2 integra; María hace HUMAN QA.

R44 permanece separado y no autoriza construcción masiva de sus 64 retos.


## Nuevos carriles por decisión de María · 27/09/2026

### Agente 8 · Home nueva + child-safe
Orden: `R45_HOME_CHILD_SAFE/01_AGENTE_8.md` · issue #305.

A8 construye la nueva Home sobre el baseline A2/R42/R02 e implementa child-safe real sobre la nueva arquitectura. No reactiva como parches #294–#297. A2 conserva integración/subida y María HUMAN QA. Voz y Cloud quedan fuera.

### Agente 9 · biblioteca Cloud Sabik
Orden: `R45_SABIK_CLOUD_LIBRARY/01_AGENTE_9.md` · issue #306.

A9 construye el sucesor bilingüe/versionado de la biblioteca R38/R39 sobre el Cloud privado existente `sabik-asistente`, manteniendo R38 inmutable y aplicando child-safe antes de ranking/salida. Tiene autorización para candidato privado, no producción. Voz/audio quedan fuera.

**Orden emitida no acredita acuse ni ejecución.** Los estados iniciales son `R42_A8_HOME_CHILD_SAFE_ORDERED` y `R39_A9_SABIK_CLOUD_LIBRARY_ORDERED`.


## Reasignación por María · 25/09/2026

**Codex está inoperativo según María; el agente 3 asume todos sus pendientes técnicos de Sabik/Cloud junto a sus propias comprobaciones.** Aplicar [R39-A3-CONTINUIDAD-R06](R39_CONTINUIDAD_A3_R06/01_AGENTE_3.md). A3 es el responsable de correlación HTTP, correcciones, integración común y entrega verificable; no esperar a Codex. Ya no está limitado a inspección ni tiene prohibido corregir el panel existente cuando sea necesario. No reconstruir piezas ya entregadas.

A2 conserva web/subidas/frontend y revisión editorial R02; solo las dependencias técnicas puntuales antes dirigidas a Codex se canalizan ahora a A3. Los auxiliares conservan sus órdenes vigentes y entregas realizadas, sin volver a ejecutar órdenes históricas de construcción. La nueva asignación no acredita acuse o ejecución de A3 y no amplía permisos sobre producción, acceso, corpus, voz o Design.

El reparto anterior se conserva abajo como histórico. Todas sus referencias a Codex como integrador/destinatario de pendientes en Sabik quedan sustituidas por A3 conforme a R06. Los requisitos de ES/EN y seguridad permanecen vigentes.

---

# Órdenes vigentes del equipo · apoyo a Codex

Este documento conserva el reparto de apoyo a R39 sobre código ya entregado. No afirma que los agentes hayan recibido o iniciado las órdenes. Antes de escribir, declarar HEAD real, archivos reservados y avance ya existente; entregar solo el incremento pendiente. Codex es el único integrador de archivos compartidos. Las rutas nuevas propuestas no acreditan que sus archivos existan.

## Agente 1 · agrupación de fuentes

Construir el incremento `source-groups.mjs` y su prueba bajo `cloud/n04-r38-library/`, si no existe ya. Agrupar resultados por URL exacta conservando orden de primera aparición, todos los fragment IDs, extractos, versiones y puntuaciones. No cambiar ranking, filtros, corpus, límites ni crear otro validador o motor de citas. Entregar a Codex módulo, prueba y parche pequeño.

**Normativa y ES/EN dentro de esta orden:** aplicar el anexo normativo común según alcance. No introducir copy público sin sus versiones española e inglesa; nombres internos de campos no se traducen. Mantener trazabilidad de fuentes y no inferir diagnóstico. Objetos seguros, sin HTML ejecutable ni pérdida de metadatos necesarios para alternativas accesibles. Las pruebas incluyen consumo equivalente ES/EN; no confundir un corpus español con cobertura documental inglesa. No modificar la web de A2.

## Agente 3 · resultados en el Sabik existente

Construir un componente acotado de resultados compatible con Sabik, recibiendo una función de consulta inyectada. Resultados, vacío, error y cancelación; texto seguro y fuentes reales. No crear otra página, barra, footer, panel de Lectura ni estados B3. Sin credenciales Cloud en navegador. No activar llamada pública por montar el componente. Entregar delta a Codex; A2 conserva el montaje frontend sobre su HEAD vigente.

**Normativa y ES/EN dentro de esta orden:** WCAG 2.2 AA y COGA según la superficie; HTML semántico, teclado, foco visible, nombres accesibles, orden de lectura, contraste, reflujo y anuncios no repetitivos. Respetar tipografía y Lectura existentes. Todos los textos, enlaces descriptivos, ARIA, estados vacíos/errores e instrucciones en ES y EN; idioma correcto y equivalencia de comportamiento. Lenguaje claro, segunda persona, no infantilizante ni diagnóstico. No depender de movimiento o color.

## Agente 4 · cancelación, timeout y evidencia de privacidad

Construir incremento `execution-policy.mjs` y pruebas. Diferenciar cancelación y timeout por solicitante; duración configurada explícitamente; limpiar listeners y temporizadores, ignorar resultados tardíos. No cancelar la carga compartida del índice por la cancelación de un usuario. No afirmar abortar I/O del SDK si solo se descarta el resultado. Conservar contrato R39 y documentar ampliaciones internas necesarias con Codex. Para C17, aportar configuración/retención verificable o dato/permiso exacto faltante; no otra auditoría general.

**Normativa y ES/EN dentro de esta orden:** minimización, ninguna consulta/IP/stack sensible en registros o respuestas. Mensajes públicos de espera, cancelación y error seguros, claros y equivalentes ES/EN. No añadir estados B3 ni spinner para representar esperas. El consumidor debe anunciar cambios de forma accesible y mantener foco. Aplicar requisitos pertinentes del anexo; no declarar retención de plataforma por ausencia de console.log.

## Agente 5 · Function real y runtime

Reutilizar `createSabikRetrievalForDeployment`; conectar el adaptador R39 a la Function interna existente mediante el incremento mínimo acordado con Codex. Preparar empaquetado/provenance de los módulos realmente incluidos y verificar los runtimes pertinentes frente a Node 22.16.0 local y Node 24 declarado en la entrega. No crear otro bootstrap/loader. Preparar un solo candidato Cloud integrado; desplegar exclusivamente el HEAD autorizado por Codex en `sabik-asistente`, nunca en `irisgreen-home`.

**Normativa y ES/EN dentro de esta orden:** conservar Team Login, secreto de Function, validación de entrada y respuesta sanitizada; sin claves en cliente/Git ni debilitación de acceso. Registrar separadamente HTTP real, Blobs remoto y pruebas locales. C17 sigue pendiente sin evidencia. El contrato no debe introducir texto público monolingüe; los mensajes que llegue a mostrar la web necesitan ES/EN. Corpus español inmutable; no atribuirle traducción o cobertura inglesa. Aplicar anexo de construcción y privacidad, sin abrir `/api/chat`, proveedor, embeddings, voz o DNS.

## Agente 6 · voz local fuera de la ruta crítica

Continuar la preparación local ya encomendada sobre las muestras propias de María. Entregar a Codex la herramienta/contrato de validación y empaquetado, conservando originales y decisiones aprobadas. No duplicar diagnóstico local ya realizado, elegir otra voz/ganadora ni subir audio privado a Git. Si falta validación con muestras reales, declararlo. Esta entrega no bloquea biblioteca.

**Normativa y ES/EN dentro de esta orden:** privacidad de voz y consentimiento para usos concretos; sin activación de micrófono, TTS remoto, reproducción automática o sincronía con Motion. Cualquier control, ayuda o error público futuro debe estar en ES y EN y ser accesible por teclado/tecnologías de apoyo. El idioma del audio debe etiquetarse correctamente: voz española no equivale a voz inglesa terminada. La validación sintética no acredita calidad de la voz real. Aplicar el anexo según alcance, sin generar nueva interfaz.

## Agente 7 · una recepción y un registro

Mantener propietarios, acuses y entregas en una cola única. Reutilizar SOURCE/CHANGES/manifiestos existentes y herramienta de verificación si está disponible. Comprobar base/HEAD, archivos permitidos, hashes y colisiones; entregar a Codex parches compatibles. No crear otro sistema documental ni repetir auditorías generales. Codex confirma integración; María/A2 confirman frontend. Actualizar esta carpeta con estado y evidencia sin sobrescribir originales ni aceptar trabajo por silencio.

**Normativa y ES/EN dentro de esta orden:** cada orden emitida debe copiar su bloque aplicable de construcción, accesibilidad, escritura/lectura y ES/EN, no solo enlazar una norma. Rechazar la etiqueta COMPLETO si falta texto inglés público afectado o si se confunden pruebas locales con funcionamiento desplegado. Conservar autoría/licencias y no publicar datos privados. Normas con fuente/edición/aplicabilidad; pendientes explícitos. No modificar producto, desplegar ni dirigir Design.

## Agente 2 y Design · reserva de trabajo

Permanecen con María. Esta centralización no reasigna sus tareas ni autoriza a otros a tocar su rama o sitio. Las entregas a frontend son incrementos sobre la base vigente y cumplen ES/EN y el marco común; ningún candidato antiguo puede sustituir la web actual.

## Anexo común y entrega de todos los agentes

`../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md` completa estas cláusulas: construcción, WCAG/COGA, ISO/EN/UNE según alcance, escritura y lectura clara, medios/descargables, privacidad y atribución. No representa una certificación ni permite ampliar tareas.

Cada entrega: orden y responsable, base/HEAD/tree, archivos, código/prueba/parche, contenido ES/EN afectado, resultados reales, restricciones y evidencia. Estados: RECIBIDA → EN_CONSTRUCCION → ENTREGADA_CON_CODIGO → INTEGRADA → VERIFICADA_EN_SU_ALCANCE; cada transición exige evidencia. Build/READY no significan aceptación humana. No apertura pública, cambio de mantenimiento o activación de conversación/voz.
