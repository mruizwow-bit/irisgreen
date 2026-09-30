## R65 · Taller 27 + 9 · HUMAN QA María aprobada · 30/09/2026

Estado:
`R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION`.

María confirma que ya ha revisado el lote final R65 y está OK.

Cierre:
- 27/27 tarjetas base aprobadas;
- 21 nuevas aprobadas;
- KEEP 6/6 intacto;
- 9 variantes `AGE_0_12` aprobadas;
- child-safe visual R65 36/36 se conserva como PASS de arte;
- no más rework ni nueva HUMAN QA de tarjetas;
- el helper opcional no canónico no es gate.

Integración:
- se desbloquea únicamente R67 Fase 3;
- usar assets AVIF/WebP reales + `IGAudience` + shell R67;
- no usar fixture R64, `main.innerHTML` QA ni data URI/base64 final.

No main. No producción. Sin cambio normativo transversal.

## Política de trabajo en equipo R01 · 30/09/2026

Estado:
`TEAM_WORK_POLICY_R01_ADOPTED`.

Regla:
`READ → SOLVE → DOCUMENT → HANDOFF → HELP_NEXT`.

Preservación:
`PRESERVE → INTEGRATE → ACTIVATE → NEW_WORK`.

Desde ahora coordinación registra incidencias operativas observables en:
`CONTROL/INCIDENCIAS_COLABORACION_EQUIPO.csv`.

Categorías:
STATE_DRIFT · DUPLICATED_WORK · DECISION_DUMP · HANDOFF_GAP · SCOPE_DRIFT · PASS_REOPENED_WITHOUT_EVIDENCE · STATUS_INFLATION · TEAM_BLOCKER · TONE_CORRECTION_REQUIRED · RECOVERY_GOOD.

No se registran juicios personales. Cada entrada debe incluir hecho, impacto, corrección, estado, evidencia y aprendizaje.

Norma:
`NORMATIVA/POLITICA_TRABAJO_EQUIPO_R01_20260930.md`.

## R62 · P03 Rutas de luz · QA2 gameplay PASS / causalidad layout fix · 30/09/2026

**Estado: `R62_P03_QA_REWORK_2_GAMEPLAY_PASS_CAUSALITY_LAYOUT_FIX_REQUIRED` · #326.**

Los dos bloqueos principales del rework anterior quedan resueltos a nivel de gameplay:
- tablero/anclajes relevantes legibles;
- destino del divisor y pantalla sur visibles;
- separación material perceptiva mejorada;
- desktop y móvil mantienen dirección propia.

Aura mide banda derecha ≈0,352 × luminancia del centro, coherente con la mejora declarada.

Bloqueo restante:
la lámina de causalidad LIGHT/NAVY tiene solapamiento de texto entre los pasos 3 y 4. No requiere rerender de escena; solo corregir layout/copy del SVG.

La afirmación de P01 byte-identical tras limpieza del motor queda pendiente de ejecución contra el árbol GitHub correcto antes de integración.

Siguiente marcador:
`R62_P03_CAUSALITY_LAYOUT_R3_READY_FOR_ASTRA_AURA_MARIA`.

P04–P06, Codex #321, A2, main y producción: HOLD.

Orden: `ORDENES/R62_ASTRA_JUEGOS_6_PILOTOS/06_AURA_P03_QA2_CAUSALITY_LAYOUT_FIX.md`.

Normativa: sin cambio transversal.

## R59 · Fósiles R2v3 · contrato repro aceptado / QA nominal + GOV bloqueados · 30/09/2026

**Estado: `R59_FOSSILS_R2V3_REPRO_CONTRACT_ACCEPTED_QA_NOMINAL_GOV_STILL_BLOCKED` · #323.**

Producto visual/técnico R2: PASS KEEP. No rerender.

R2v3 cierra materialmente el contrato de reproducibilidad:
- 74 entradas selladas;
- web/fuente/qa/doc;
- verificación de entradas antes de regenerar;
- regeneración en carpeta temporal;
- comparación byte/pixel;
- self-test del contrato;
- sellos QA ligados al digest del manifiesto.

Aura verifica manifest 74/74 y fail-closed real: alterar `fuente/piezas.py` produce exit 2 y nombra el archivo.

Bloqueos restantes:
1. `qa/shots.py` sigue declarando `idx` sin usarlo antes de capturar;
2. `18-hallazgo-trex-diente.png` muestra Iguanodon;
3. GOV-01: informe sigue declarando rama `codex/r59-intereses-fase1` sin reconciliar ejecutor real con Agente R59 activo / Codex HOLD.

Siguiente marcador:
`R59_FOSSILS_PILOT_R2V4_NOMINAL_QA_GOV_FIXED_READY_FOR_ASTRA_MARIA`.

Minerales, A2, main y producción: HOLD.

Normativa: sin cambio transversal.

## R61 · Pecera · máster 10 min KEEP / final QA y transferencia pendientes · 30/09/2026

**Estado: `R61_PECERA_10MIN_MASTER_KEEP_FINAL_QA_TRANSFER_PENDING` · #325.**

Claude entrega informe y hoja QA del vídeo final de 10 min con burbujas. Se conserva el máster: no se reabren roca, composición, burbujas, densidad, saturación, audio, fauna, vegetación ni cámara.

No hay PASS final todavía. Faltan:
- transferencia real del MP4/master/build y verificación de hashes;
- QA móvil 390×844 / 320×800;
- demostrar NORMAL / REDUCIDO / SIN_MOVIMIENTO;
- QA completa de controles;
- performance o `PENDING_HARDWARE_QA`;
- benchmark externo E4;
- decisión de peso basada en medición real de carga/móvil.

El MP4 web declarado pesa 151,2 MB. No degradar el master por defecto; medir y, si hace falta, generar variante web más ligera desde el master.

Siguiente marcador:
`R61_PECERA_FINAL_PACKAGE_MOBILE_BENCHMARK_QA_READY_FOR_ASTRA_MARIA`.

Segunda sala, A2, main y producción: HOLD.

Orden: `ORDENES/R61_CLAUDE_RINCON_PECERA/05_AURA_FINAL_QA_TRANSFER_PENDING.md`.

Normativa: sin cambio transversal.

## R68 · Faroles flotantes · dirección KEEP / rework visual · 30/09/2026

**Estado: `R68_FAROLES_DIRECTION_KEEP_SPATIAL_LIGHTING_REWORK_REQUIRED` · #335.**

El primer prototipo demuestra una identidad propia y un mecanismo válido de faroles + calados + proyección, diferenciado de Sakura. NO pasa todavía HUMAN QA visual.

KEEP:
- atlas de pantallas/calados;
- patrón propio por farol;
- instalación interior;
- luz cálida contenida;
- DARK/LIGHT como climas de chrome.

REWORK:
- volumen arquitectónico;
- faroles como objetos translúcidos con espesor;
- proyección local en charcos/manchas, no papel pintado;
- menos densidad/repetición;
- zonas de penumbra y descanso visual;
- LIGHT menos expuesto.

Precedencia:
NO hacer `agua primero`. Agua/reflejo puede ser apoyo secundario, nunca identidad principal de R68.

Siguiente marcador:
`R68_CLAUDE_FAROLES_DIRECTION_R2_READY_FOR_ASTRA_AURA_MARIA`.

No runtime final, no handoff A2, no main, no producción.
Lluvia de luz / Agua y reflejos / Bosque bioluminiscente siguen HOLD.

Orden: `ORDENES/R68_CLAUDE_FAROLES/02_AURA_DIRECTION_REWORK.md`.

Normativa: sin cambio transversal.

## R42 · Contenido R02 · rebase final sobre A2 vivo requerido · 29/09/2026

**Estado: `R42_CONTENT_R02_AUDITED_CURRENT_A2_REBASE_REQUIRED` · #302.**

El ZIP `iris-green-contenido-R42-20260929.zip` (SHA-256 `aa3649a821da1226dd84bda70f35ee8c8e286cb81c1bd5711af97e71761e8961`) conserva una dirección correcta: 204 páginas nuevas, inventario 226/223/62/60/132/262, clasificación AGE canónica de A2, child-safe, Investigación 132 y guardarraíl exacto.

Pero fue construido sobre A2 `9c721a79`. PR #244 ya está en `2fcb193feaecaa6934e96c14e0eda06d016d0250`, cinco commits por delante. El solapamiento crítico es `scripts/build_site.py`: el HEAD vivo ya incorpora R67 Taller shell y el ZIP aún no.

Por tanto el ZIP actual NO se integra. Claude debe rebasar sobre el HEAD A2 vivo, conservar R67 Taller + child-safe + R51 + Investigación 132 + audit_inventario, regenerar artefactos y repetir baseline/candidato con 0 fallos nuevos.

Trazabilidad a corregir en la misma vuelta:
- NHS England OSA: publicado 16/11/2023, actualizado 16/09/2024;
- WHO Gaming FAQ: sin fecha visible; no usar la noticia separada de 2018 como fecha de la FAQ;
- explicar delta de fuentes R01 66 → R02 60;
- `fuentes.json` se menciona en Memoria pero no está en el ZIP;
- reconciliar “405 URL” con 465 campos anómalos observados / 204 strings raw únicos.

Marcador esperado tras el rebase final:
`R42_CONTENT_R01_REBASED_CHILD_SAFE_READY_FOR_ASTRA`.

Contenido nuevo adicional, A2 integración del ZIP actual, main y producción: HOLD.

Orden: `ORDENES/R42_CONTENT_R02_REBASE_CURRENT_A2/01_CLAUDE.md`.

Normativa: no cambia; se aplican los canónicos vigentes.

## R61 · Pecera · burbujas prototipo PASS · render 10 min autorizado · 29/09/2026

**Estado: `R61_PECERA_BUBBLES_PROTOTYPE_HUMAN_APPROVED_RENDER_10MIN_AUTHORIZED` · #325.**

HUMAN QA aprueba el prototipo de burbujas. KEEP: columna derecha, anillos ilustrados, grosor/velocidad/densidad actuales, oclusiones y composición ya aprobada. No se mueve la roca ni se reabre composición; tampoco se aumenta densidad por defecto.

Se autoriza render completo ≈10 min + remux con audio aprobado + QA final de NORMAL/REDUCIDO/SIN_MOVIMIENTO, 1440/390/320, loop, rendimiento, codec/peso/hashes/provenance.

Siguiente marcador:
`R61_PECERA_10MIN_ILLUSTRATED_AV_READY_FOR_ASTRA_MARIA`.

Después STOP para Astra/HUMAN QA. Segunda sala, A2, main y producción siguen HOLD.

Orden: `ORDENES/R61_CLAUDE_RINCON_PECERA/04_ASTRA_BURBUJAS_PASS_RENDER_10MIN.md`.

Normativa: sin cambio transversal; se consumen las normas vigentes.

## R62 · P03 Rutas de luz · HUMAN QA REWORK · 29/09/2026

**Estado: `R62_P03_HUMAN_QA_REWORK_REQUIRED` · #326.**

La primera propuesta P03 no pasa E4/HUMAN QA. No se lee como sala tridimensional: domina un alzado de muro sin suelo/testeros/volumen suficientes. La pared se percibe como retícula plana; la luz no produce incidencia/contacto/sombra/reflejo legibles; el bastidor vertical añade una segunda cuadrícula en vez de arquitectura.

KEEP: producto Rutas de luz, bucle conectar→desviar→observar→comparar→rehacer, varias soluciones, luz como material, accesibilidad y AGE_*.

REWORK R2: sala espacial real, pared/material menos regular, luz que actúe físicamente sobre superficies, soportes integrados en arquitectura y móvil propio.

Siguiente marcador:
`R62_P03_RUTAS_LUZ_E4_R2_READY_FOR_ASTRA_MARIA`.

P04–P06, Codex #321, A2, main y producción siguen HOLD.

Orden: `ORDENES/R62_ASTRA_JUEGOS_6_PILOTOS/05_ASTRA_P03_HUMAN_QA_REWORK.md`.  
Normativa de aplicación: `NORMATIVA/ADDENDUM_R62_P03_E4_APPLICATION_20260929.md` (sin norma transversal nueva).

## R39 · A9 · Biblioteca Cloud de Sabik · fix Astra R03 · 27/09/2026

**Estado: `R39_A9_SABIK_CLOUD_LIBRARY_FIX_READY_FOR_ASTRA`.**  
**Calificación técnica:** `A9_R03_TECHNICALLY_VERIFIED_PRIVATE`.

A9 ha aplicado el fix acotado pedido por Astra en #306 sin reconstruir R38/R39/R06:
- safe variants: únicamente copy editorial revisado del paquete R42 child-safe `iris-green-contenido-R02-DESIGN-CHILD-SAFE-20260927.zip` (SHA-256 `b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23`), con `SAFETY/safe-variants.json` SHA-256 `4167fe9cf767623c1188b5796297b4f83a89b0c2928a55bcc0f765690bfb3260` y revisión S2 SHA-256 `579c4274d1de97b24ea39f9296ea66d9c61a50b1cad15a0da89e91736cdeab55`;
- 30 full S2 + 30 safe variants; cada variante queda ligada a su `safety_content_id`; igualdad full/safe o aprobación ausente falla cerrado;
- URLs EN de Datos con título duplicado `Employment and autism` corregidas mediante `slug_en`: UK y Australia ya conservan rutas distintas;
- auditoría fail-closed: 1.208 registros de cita / 1.057 URLs únicas / **0 rotas**;
- Investigación EN conserva texto/título EN, pero cita temporalmente la fuente pública existente `/es/investigacion/#estudio-N` porque el snapshot fijado y R42 integrado todavía no tienen `/en/research/`; no se inventa una ruta EN inexistente.

Release inmutable válida:
- HEAD probado/desplegado `be14346d58acbd2c4340149836b9c630feba9279`, tree `500510ea4a49afe9f97eb2b9c8485852e20b2e42`;
- versión `sabik-es-en-20260927-r03-9216eeee6a32`;
- corpus SHA-256 `7335fc9ba4992814ff11698e740d6faca3abc0e160f2d2485c214866884add43`;
- manifest SHA-256 `9dd6a2f1e6458351876a74921d7ed6180ce2660468798a1c5787c047a8bc8a13`;
- 1.208 fragmentos = 604 ES + 604 EN;
- CI `36333077790`: **204/204 PASS**;
- evidence artifact `10936506830`, digest `sha256:035aef4db871cb0483128a05d7f48e7ebcbb6e3297fce6098811997b795b0581`.

Candidato privado:
`6ab943463d8845250907ab42` · `deploy-preview` · READY · `published_at=null`. Netlify confirma Team Login requerido en todos los contextos. R38 sigue intacto (4.332 fragmentos, SHA histórico esperado). Producción, frontend, DNS, Team Login y secretos no se han modificado.

HTTP de aplicación autenticado **sigue PENDING HUMAN QA**: el HTTP externo sin sesión legítima recibe 401 en Team Login, como debe. No se exportan cookies ni credenciales. La cobertura sigue siendo el snapshot técnico 372 catálogo + 49 Datos + 48 Vida diaria + 120 Investigación; no se declara sincronización completa con los 965 registros de #302. `TEPT complejo` sigue ausente del snapshot público fijado y no se inventa.

# Memoria operativa consolidada · Iris Green / Sabik

## Sabik · Audio Library final verificada y preparada para A2 · 27/09/2026

El ZIP final recibido coincide exactamente con el hash declarado `fd6f73544fbd6153c077a302a275b7d893cee4e49104d7140ca7153b2a49eadc`; 30/30 hashes de WAV coinciden con el manifest. EN model `3aec07b8...`; ES model `8100e977...`.

Astra reconcilia una inconsistencia de metadata: el campo heredado `audio_policy.processing=gain_only` no describía el fallback limitador aplicado en 10/30 audios. El paquete verificado corrige solo metadata/procedencia, sin modificar audio, y queda con SHA `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.

A2 debe integrar únicamente el copy fijo R02 y estos assets; voz por control explícito de sesión, no autoplay previo, no doble habla con screen reader/live regions y sin narración dinámica en este lote.

## Sabik · Audio Library R01 final · 27/09/2026

La biblioteca fija ES/EN queda procesada 30/30 con -16.5 LUFS exactos, peak máximo -1.0 dBFS y cero clipping. Diez entradas requirieron limitador lookahead; reducción máxima 2.774 dB, dentro del límite conservador fijado. Manifest SHA-256 `dd4a44d222d6fbbade669a32a705d08fe5601ac11c39911105df8cb37d71d4d9`; ZIP SHA-256 `fd6f73544fbd6153c077a302a275b7d893cee4e49104d7140ca7153b2a49eadc`.

Queda pendiente únicamente recibir el ZIP, verificarlo byte a byte y preparar el handoff de integración web/cloud. No reabrir voz ni loudness salvo evidencia nueva.

## Sabik · audio fijo R01 · muestra QA PASS · 27/09/2026

Diez WAV de revisión (5 por idioma) pasan HUMAN QA acústico: volumen aprobado, 0 clipping y timbre estable. Se detecta únicamente silencio inicial excesivo en varias piezas EN (hasta ~0.68 s) y en ES welcome (~0.51 s). Se corrige en postproceso, no mediante entrenamiento: trim conservador + normalización gain-only a -16.5 LUFS con pico ≤ -1 dBFS.

## Sabik · voces EN/ES cerradas + loudness de producción · 27/09/2026

María aprueba el nivel final de escucha tras normalizar post-síntesis a **-16.5 LUFS integrados** con pico máximo objetivo **≤ -1 dBFS**. La sensación previa de voz lejana se atribuye al nivel de salida (~-20 LUFS), no al entrenamiento.

Voces vigentes:
- EN: R02 exacto validado contra V6_12_T01.
- ES: checkpoint E0 seleccionado como `SABIK_ES_V1`; E2 se conserva como alternativo.

La normalización se incorpora como etapa obligatoria de `SABIK_AUDIO_LIBRARY`, sin alterar pitch, velocidad ni timbre.

## R39 A9 · Biblioteca Cloud bilingüe child-safe · 27/09/2026

Estado vigente: `R39_A9_SABIK_CLOUD_LIBRARY_READY_FOR_ASTRA`.

Se construye y sella una nueva biblioteca ES/EN sobre R38/R39/R06, conservando byte-inmutable R38. Release `sabik-es-en-20260927-r01-a582b153c173`: 1.208 fragmentos (604 ES/604 EN), corpus SHA-256 `2a36db04dabd04d5fabdf5e7fc79db9509ebd8657f3daa9dd9886a75d9540da8`. Fuente pública fijada en `main@ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5`; no lectura de contenido cambiante en runtime.

Child-safe: 30 full S2 y 30 safe variants. DEFAULT/CHILD/TEEN y ADULT sin intención explícita excluyen full S2 antes del índice/ranking; ADULT + intención explícita puede recuperarlo. Las variantes seguras son extractos literales de la fuente fijada. El snapshot público contiene 15 de los 16 temas S2 documentados por R42; TEPT complejo queda fuera y no se inventa.

Candidato Cloud `f4d89076b13cc3103bbcf41bbe7dd88718cb9bf0` / tree `a5a5f94fb8cfc5941cdf56e2ae0f2d6b2145f922`; run `36327674236` SUCCESS 203/203. Deploy privado `6ab92e91a3cdab71e281a975`, `published_at=null`, Team Login all. Sellado y readback remoto PASS; cold Blobs 339,12 ms. HTTP real sin sesión prueba el gate exterior 401; HTTP de aplicación autenticado queda pendiente de sesión legítima humana. C17 sigue PENDING.

No producción, DNS, cambios de Team Login/secretos, frontend, voz, LLM, embeddings ni datos de usuario.

## Sabik · EN R02 exacto cerrado · 27/09/2026

El reentrenamiento EN R02 usa la referencia exacta `SABIK_EN_V6_12_T01.wav`. La comparación final con misma frase/seed da F0 201.6 Hz frente a 209.9 Hz de referencia, centroide mediano 1181 Hz frente a 1294 Hz y similitud MFCC alineada ≈0.9938. La voz conserva la identidad/timbre esperados y corrige la desviación brillante observada en E0.

Resultado: `SABIK_EN_R02_EXACT_VALIDATED_FINAL`. E0 queda histórico. No reabrir EN salvo evidencia nueva de producción.

## Sabik · corrección EN tras comparación con referencia exacta · 27/09/2026

E0 se compara directamente con `SABIK_EN_V6_12_T01.wav` usando la misma frase/seed. La voz conserva la misma familia, pero queda más brillante y algo más rápida; la similitud MFCC media (≈0.987) es inferior incluso a la cercanía V6_11↔V6_12 en la misma frase (≈0.997). Por tanto E0 deja de ser el modelo EN final y pasa a evidencia técnica del primer entrenamiento.

Acción única necesaria: regenerar el corpus inglés con la referencia exacta V6_12_T01 y repetir codes + SFT. Todo el resto del pipeline ya validado se reutiliza.

## Sabik · referencias vocales exactas confirmadas · 27/09/2026

María aporta y confirma los dos archivos exactos que representan las voces elegidas:
- EN: `SABIK_EN_V6_12_T01.wav` · SHA-256 `8dabd1ceb126201822d0ccc431bf5087fb276aa49061945d3a37c23ea1be100b`.
- ES: `SABIK_ES_LONG_REF.wav` (master ES V1) · SHA-256 `c9d18290375d46608d37f65b05788ef552980706161a0eb0e26e2a268059c8fa`.

La referencia V4_12 seed 9112 se mantiene como antecedente técnico de la familia EN, pero la referencia auditiva exacta elegida por María queda fijada en V6_12_T01.

## Sabik · QC ES PASS y referencia SFT 24 kHz · 27/09/2026

La muestra ES 12/12 pasa QA acústico: F0 mediana ≈150.6 Hz frente a master ≈147.6 Hz, RMS estable, 0 clipping y sin deriva progresiva detectable. No se descarta ningún clip de la muestra.

El master ES canónico permanece a 44.1 kHz. Para el dataset SFT se utilizará una copia técnica 24 kHz exclusivamente como `ref_audio`, porque el dataset oficial de Qwen3-TTS exige 24 kHz. Los JSONL se respaldarán antes de actualizar ese campo. Siguiente gate: crear ref 24 kHz y ejecutar worst-case preflight ES.

## Sabik · ES codes completos · 27/09/2026

`SABIK_ES_TRAIN_V1` queda preparado con `train_with_codes.jsonl` completo 133/133 mediante tokenización segura batch 1 y UTF-8. La ejecución terminó con ≈13.82 GiB de VRAM libre y se creó una muestra REVIEW de 12 WAV para QA previo a SFT.

## Sabik · EN V1 canonizado / ES corpus listo para codes · 27/09/2026

`SABIK_EN_V1` queda materialmente canonizado desde E0. Hashes locales fijados: model `0346413f078b5f0f982974a35641fa3713bad13a71e9bf3237682acb5641e062`; config `6ac9cbf2727344d18fbb4d66ea8274b675f64a14b0737e9e28801181e96c0abd`. E2 se conserva como alternativo.

Auditoría del corpus español existente: `SABIK_ES_TRAIN_V1` contiene 133 WAV válidos, 22.56 min, 133 filas en `train_raw.jsonl`, manifest presente y codes aún pendientes. Próximo paso: verificar JSONL ES y preparar audio codes.

## Sabik · EN V1 seleccionado · 27/09/2026

Estado: `SABIK_EN_V1_CHECKPOINT_E0_SELECTED_ES_TRAINING_NEXT`.

Se comparan tres checkpoints del fine-tuning EN sobre seis frases inéditas idénticas y semillas controladas. Resultado final: `checkpoint-epoch-0` seleccionado como `SABIK_EN_V1`; E2 queda como alternativa técnica; E1 se descarta como opción final. El criterio combinado fue conservación de identidad/timbre del master EN V2, naturalidad, ritmo y estabilidad.

Secuencia vigente: canonizar E0 + hashes → auditar corpus ES → preparar codes ES → fine-tuning ES → validar checkpoints ES → solo después retomar copy/audio de producción.

## Sabik · master EN V2 · 27/09/2026

Estado: `SABIK_EN_MASTER_V2_SELECTED_TRAINING_NEXT`.

María selecciona la candidata 12 (seed 9112) como master inglés definitivo para la fase de entrenamiento. `SABIK_EN_MASTER_V2.wav` es copia canónica de `SABIK_EN_REG_V4_12_seed9112.wav`, SHA-256 `c5f666cf090d71d81240f6ab0dd514a2da5af082d311cbbcf79dbd2b05794ede`.

La selección se cierra tras comparar candidatas V4/V6 y contrastar estabilidad, timbre, ritmo y similitud con Sabik ES. La referencia ralentizada 0.88 se descarta por sonido robótico y queda prohibida para corpus/fine-tuning.

Secuencia vigente: generar `SABIK_EN_TRAIN_V1` → revisar muestra → fine-tuning EN → validar con frases inéditas → fine-tuning ES → validación ES → retomar copy/biblioteca de audio de producción.

## Sabik EN · master V2 seleccionado · 27/09/2026

Estado vigente: `SABIK_EN_MASTER_V2_SELECTED`.

María selecciona la candidata 12, seed 9112, SHA-256 `c5f666cf090d71d81240f6ab0dd514a2da5af082d311cbbcf79dbd2b05794ede`, como nuevo master inglés canónico local `SABIK_EN_MASTER_V2.wav`.

El master procede de la identidad inglesa ya aprobada y fue elegido tras búsqueda natural x-vector-only, comparación frente a Sabik ES y validación ICL con frases inéditas. La referencia ralentizada V2 queda descartada.

Se fija el texto exacto de referencia para ICL y se abre `SABIK_EN_TRAIN_V1` como siguiente fase antes del fine-tuning oficial single-speaker de Qwen3-TTS. El corpus acústico sigue separado de `SABIK_COPY_PRODUCCION`.

Ver `MEMORIA/SABIK_EN_MASTER_V2_SELECTION_R01_20260927.md` y `CONTROL/DELTA_SABIK_EN_MASTER_V2_SELECTION_R01_20260927.json`.

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

**Estado: `R42_RINCON_ZIP_AUDIT_A7_A2_ONLY`.**

El ZIP recibido como `Rincon.zip` es en realidad la entrega mixta Design R01 completa:
- SHA-256 `0efd80e61ff489ce4f38a0fd496c934cfad565954130300cfbf90c1574d17309`;
- base `e8cad400...`;
- HEAD interno `d78330bc...`;
- tree `4615b69c...`;
- 103 archivos, +10934/−6062, 5 commits;
- checksums internos íntegros.

**No integrar el bundle completo.**

Separación canónica:
1. Material R01 → superseded por Design R02 ya aprobado; sin acción desde este handoff.
2. **Rincón → único alcance operativo del ZIP:** dos fixes pequeños siguen vigentes y faltan en A7 PR #300: mutación idempotente de clases en Pantalla limpia y `[hidden]{display:none!important}` en acciones.
3. Juegos → fuera de este handoff. Claude está actualizando Juegos en su propio carril; no derivar tareas a A1 ni integrar esos juegos desde `Rincon.zip`.

QA recibido: navegador 111/111, móvil 273/273, axe 36 runs/0 violaciones, checksums PASS. Las capturas Rincón son estructurales/materiales, no sustituyen real-media/HUMAN QA.

**Responsables operativos desde este paquete: A7 porta los dos fixes; A2 integra y valida. Nadie más actualiza Rincón desde `Rincon.zip`.**

Memoria: `MEMORIA/R42_RINCON_ZIP_AUDITORIA_20260927.md`.  
Control: `CONTROL/DELTA_R42_RINCON_ZIP_AUDITORIA_20260927.json`.  
Handoff: `HANDOFFS/R42_RINCON_ZIP_AUDIT/README.md`.
## R42 · Rincon.zip · A7 porta dos fixes · 27/09/2026

**Estado: `R42_RINCON_ZIP_A7_FIXES_READY_FOR_A2`.**

Agente 7 completó el único alcance operativo del ZIP auditado:
1. Pantalla limpia: actualización idempotente de clases mediante `setBodyClass()` para evitar el bucle del `MutationObserver` y el freeze.
2. `sceneTouch[hidden]`: regla específica `display:none!important` para evitar la píldora vacía sin nombre accesible.

Entrega sobre A2 vigente `a0036d541393f103d2dfefd05ec2f66a979f49e2`: branch `agent7/r42-rincon-fix-clean-hidden-r02-20260927`, HEAD `2b5db6dfcffa3c17b375abb4629016fd14cc65a7`, tree `165ac2f3c9f2cc389ef74d67b2b20b414adaf793`, PR #303, precheck `R42_A7_RINCON_TWO_FIXES_PASS`.

ES/EN llevan cache-bust `-d01`. No se modifican audio, escenas, catálogo ni real-media. Siguiente gate: A2 integra #303 y valida en preview.

Memoria: `MEMORIA/R42_RINCON_ZIP_A7_FIXES_20260927.md`.  
Control: `CONTROL/DELTA_R42_RINCON_ZIP_A7_FIXES_20260927.json`.

## R44 · propuesta de nuevos retos del Taller · revisión Astra · 27/09/2026

**Estado: `R44_TALLER_RETOS_PROPOSAL_ASTRA_REVIEWED_PENDING_MARIA`.**

Por instrucción de María, esta revisión **no analiza ni reabre el Taller R43 ni la corrección de Design**. Solo evalúa los nuevos retos propuestos en R44.

Conclusión:
- dirección general buena;
- los 8 proyectos cruzados son la parte más fuerte;
- Animación y Mapas se mantienen como candidatos a estudio;
- MIDI debe entrar primero como capacidad de Música;
- Microcontroladores como capa opcional de Programación/Robótica;
- Voz/radio como perfil/proyecto de audio antes que estudio independiente;
- no cambiar camera/microphone Permissions-Policy por esta propuesta;
- Web MIDI/Web Serial/hardware nunca serán requisito único.

Retos fechados:
- eclipse 02/08/2027: KEEP;
- Beethoven 2027: KEEP;
- Generación del 27 2027: KEEP con guardarraíles de PI;
- PLATO 2027: KEEP como contexto, no dependencia de fecha;
- Falla 150 y Gaudí centenario: reformular a evergreen porque corresponden a 2026;
- Pastizales/Pastores 2026: reformular a proyecto evergreen.

El patch dice 8 retos fechados pero enumera 7 temas; y no incluye los 64 retos individualmente. Antes de autorizar construcción debe entregarse una matriz 64/64 con ID, ES/EN, estudio, etapa, artefacto, API/permisos/hardware, fallback, accesibilidad, PI, ola y criterio de PASS.

Memoria: `MEMORIA/R44_RETOS_TALLER_AUDITORIA_ASTRA_20260927.md`.  
Control: `CONTROL/DELTA_R44_RETOS_TALLER_AUDITORIA_ASTRA_20260927.json`.

## R43 · adaptación Design del Taller · precheck · 27/09/2026

**Estado: `R43_TALLER_DESIGN_ADAPTATION_PRECHECK_PASS_COVERAGE_REQUIRED`.**

Se auditan únicamente los dos paquetes de interfaz recibidos; no se reabre el producto Taller R43.

`Talleer.zip` (SHA-256 `62d338cf6cdd509b9dab6696f1ee6c0aa2c39cd62bcdf465577a40abb8290c89`) conserva byte-idénticos frente al Design R02 aprobado:
- `ig-r42-materials.css` `90a4342b...`;
- `preferencias-lectura.js` `8a3dab4d...`;
- `measure_r42_materials.py` `f65bb50f...`.

Reproducción Astra: 5 Python PASS, Node check PASS, 30/30 mediciones PASS. La integración adicional del R43 es limpia: tokens R02, toolbar de lienzo opaca, sin filtro global, forced-colors/reduced-motion conservados.

`Taller Desing.zip` (SHA-256 `4f2bfec1633d0341bf827bf6136f303be846491295ed05765253370dc8cb3688`) es el Design R01 histórico y no debe usarse.

Corrección pendiente: **cobertura completa del Taller**. La adaptación cubre las 26 páginas de los 13 estudios R43 y el piloto Dibujo, pero no demuestra adaptación de la portada ES/EN ni de todos los estudios legacy aún visibles en el catálogo. Design debe ampliar solo la capa interfaz/material R02 al 100 % de las rutas públicas actuales del Taller, sin tocar motores/contenido/retos.

Marcador esperado:
`R43_TALLER_DESIGN_ADAPTATION_COVERAGE_FIXED_READY_FOR_ASTRA`

Memoria: `MEMORIA/R43_TALLER_DESIGN_ADAPTACION_PRECHECK_20260927.md`.  
Control: `CONTROL/DELTA_R43_TALLER_DESIGN_ADAPTACION_20260927.json`.

## R63 · Rincón · Sakura · 29/09/2026

**Estado vigente: `R63_CLAUDE_RINCON_SAKURA_CANDIDATE_ORDERED`.**

#328 cierra únicamente Sakura como piloto sensorial reproducible. La dirección Globos queda retirada; las cuatro salas R53 restantes quedan congeladas y la nueva tanda potencial no se desbloquea hasta HUMAN QA de Sakura.

Sakura ya está construida como prototipo, pero no se localizó todavía un handoff físico de source en GitHub/Library. Claude debe recuperar/materializar el source exacto; si falta, STOP con `R63_SAKURA_SOURCE_ARTIFACT_MISSING_BLOCKED`, sin reconstruir desde capturas.

El candidato debe partir del A2 vivo, consumir `ig-global-ui-tokens-2026.css`, respetar low-stimulation y taxonomía AGE_*, separar arte de chrome LIGHT/DARK NAVY, portar los dos fixes #303 que siguen sin merge, demostrar ES/EN + 1440/390 + tres estados de movimiento + fallbacks y entregar PR draft a A2.

Secuencia: Claude → Astra → A2 → Deploy Preview → HUMAN QA María. R61 Pecera #325 permanece separado.

Orden: `ORDENES/R63_CLAUDE_RINCON_SAKURA/01_CLAUDE.md`.

## 29/09/2026 · R61 Pecera / R63 Sakura / R64 A2 Taller

**R61:** `R61_PECERA_ILLUSTRATED_DIRECTION_PASS_CONTINUE`. Donor original = lenguaje ilustrado aprobado. Próximo gate: vídeo 10 min + audio propio + 3 estados de movimiento + responsive/performance. Sin segunda escena.

**R63:** `R63_SAKURA_VISUAL_REFERENCE_APPROVED`. Sakura se fija como sala sensorial en dos climas; proyección principal con masters first-party coordinados de dosel, no patrón procedural. Próximo gate: integración visual + QA 1440/390 + B/C/D.

**R64 / #329:** `R64_A2_6_CARDS_INTEGRATION_ORDERED`. Handoff R54 R2 verificado; 6/6 arte aprobado para preview. A2 integra sobre HEAD vivo, usa tokens globales únicos y taxonomía AGE_* y sube Deploy Preview. HUMAN QA final María sigue pendiente.

No hay normativa transversal nueva en estas tres decisiones; se aplican los canónicos ya adoptados.

## R65 · Taller · siguiente ola visual · 29/09/2026 · HISTÓRICO SUPERSEDED

Estado: `R65_WAIT_HUMAN_QA_R64`.

R65 prepara el escalado de 21 tarjetas restantes + 9 variantes AGE_0_12, pero no se ejecuta hasta HUMAN QA final de María sobre la preview R64/#329.

Se congelan las 6 tarjetas piloto como estándar y se conserva `THE_CARD_SHOWS_THE_WORKBENCH_NOT_THE_FINISHED_PRODUCT`.

La ejecución será en 7 tandas de 3 estudios, seguida de las 9 variantes canónicas AGE_0_12: `circuitos`, `arquitectura`, `composicion`, `sintesis-sonido`, `videomapping`, `color`, `fotografia`, `lenguas-inventadas`, `escritura-restricciones`. No se abren interiores ni starters en R65.

Marcador de salida:
`R65_CLAUDE_TALLER_21_PLUS_9_READY_FOR_ASTRA`.

No hay normativa transversal nueva.

## R66 · Sabik conversacional · 29/09/2026

Estado: `R66_A2_SABIK_CONVERSATIONAL_INTEGRATION_ORDERED`.

Sabik Web queda definido como asistente conversacional opcional por voz: voz/texto comparten Core, sesión, safety, correcciones y respuesta. Cloud R04 aporta conocimiento/citas; no es la voz ni el producto de interfaz.

A2 debe reconciliar el Core PRE-#144 con la UI Sabik actual, Motion R37 y R04. Los 30 WAV se conservan para sistema/fallback. La respuesta dinámica hablada usa TTS con identidad Sabik aprobada. Micrófono solo tras gesto, sin escucha permanente, con equivalente textual y sin persistencia de audio/transcripción/chat por defecto.

El candidato R04 parcial puede usarse para preview privada respetando sus HOLDs; el marcador final R66 exige R04 final aceptada y STT/TTS ES/EN reales.

Se adopta normativa específica:
`ADDENDUM_R66_SABIK_CONVERSATIONAL_VOICE_20260929.md`.

Marcadores:
- `R66_A2_SABIK_CONVERSATIONAL_PRIVATE_PREVIEW_READY_FOR_ASTRA`
- `R66_A2_SABIK_ALEXA_STYLE_ES_EN_PREVIEW_READY_FOR_MARIA`.

No main. No producción.

## 29/09/2026 · R62 P02 · Terrario E4 R2

Estado: `R62_P02_E4_SCENE_PASS_CAUSALITY_VISUAL_REWORK_REQUIRED`.

La R2 supera el refinado visual de escena principal: motor, sección frontal, diversidad de follaje, colgantes, roca, móvil y temas globales quedan KEEP.

El gate medido pasa, incluido musgo +37,7 %, pero la revisión humana mantiene un único bloqueo: la cadena causal `roca → sombra → humedad → musgo` aún no se reconoce de un vistazo en el díptico. La siguiente vuelta se limita a recolocar la roca demostrativa y dejar visible la franja de suelo afectada, sin rehacer gameplay.

Marcador:
`R62_P02_TERRARIO_E4_R3_CAUSALITY_READY_FOR_ASTRA_MARIA`.

P03 sigue HOLD.
No cambio normativo.

## R65 · acuse Claude · 29/09/2026

Claude confirma lectura completa de la orden canónica #330 y permanece en `R65_WAIT_HUMAN_QA_R64`: 0 arte tocado, 0 fuentes y 0 renders.

El único unlock sigue siendo `R64_TALLER_6_CARDS_HUMAN_APPROVED_FINAL_UNLOCK_R65`, después de HUMAN QA de María sobre la Deploy Preview #329.

El paquete de coordinación recibido fue rebasado por Claude sobre `818440d3`, contiene 20 commits y SHA-256 `77f03ed2e0d65c07386678d172587fa73bafff0ea41a4d15aec92d83abd63bc9`. Como la rama canónica avanzó después, no se reaplica el paquete completo: se porta solo el acuse R65 sobre el estado vivo.

No hay cambio normativo.

## R63 · Sakura · visual cerrado / runtime pendiente · 29/09/2026

`R63_SAKURA_VISUAL_PASS_RUNTIME_HANDOFF_REQUIRED`.

Visual PASS: la sala sensorial Sakura queda congelada. No se persigue fotorealismo adicional. Falta únicamente cierre de movimiento/fallback/lifecycle/a11y/performance y handoff reproducible.

Claude puede preparar ZIP cuando esos checks pasen; no push propio. A2 integra después de verificación Astra. Siguiente sala solo tras HUMAN QA María.

Marcador: `R63_CLAUDE_SAKURA_RUNTIME_HANDOFF_READY_FOR_ASTRA_A2`.

## R65 · ejecución paralela · 29/09/2026

`R65_PARALLEL_EXECUTION_AUTHORIZED_PENDING_HUMAN_QA_R64`.

R65 deja de esperar a R64. Claude puede continuar inmediatamente las 21 tarjetas restantes en 7 tandas de 3 y después las 9 variantes AGE_0_12.

R64 HUMAN QA bloquea únicamente el cierre/handoff final, no la producción. Las correcciones humanas posteriores se aplican de forma acotada salvo fallo sistémico.

No cambio normativo.

## R61 · Pecera · burbujas visuales · 29/09/2026

La dirección ilustrada sigue PASS/KEEP, pero falta un elemento reconocible del donor: las burbujas visuales. El audio sí las contiene.

Corrección acotada: burbujas ilustradas, pequeñas, lentas y poco densas, con adaptación NORMAL/REDUCIDO/SIN_MOVIMIENTO.

No se autoriza otro render completo de 10 minutos hasta revisar primero un frame y clip corto.

Estado:
`R61_PECERA_ILLUSTRATED_PASS_BUBBLES_VISUAL_REWORK_REQUIRED`.

Marcador:
`R61_PECERA_BUBBLES_VISUAL_READY_FOR_ASTRA_MARIA`.

## R67 · recuperación transversal A2 · 29/09/2026

Prioridad P0.

El estado integrado de A2 no corresponde a los PASS parciales documentados: la web visible conserva shell antiguo, Taller R64 es una pantalla QA sobre R40, Sabik R66 solo tiene BASE READ y el child-safe S2 duro no está conectado al build.

Se abre #333 / R67 para recuperar una única integración coherente en cuatro fases:
shell → child-safe → Taller → Sabik.

Solo cuenta como READY integrado:
`R67_A2_IRIS_GREEN_INTEGRATED_PREVIEW_READY_FOR_MARIA`.

No cambia normativa; hace cumplir contratos ya aprobados.

## R62 P02 · Terrario R3 · Astra PASS · 29/09/2026

`R62_P02_TERRARIO_E4_ASTRA_PASS_HUMAN_QA_PENDING`.

R3 corrige la causalidad visual: roca, sombra, humedad y musgo coinciden espacialmente y el antes/después se entiende sin explicación numerada.

No se pide R4. La escena principal y móvil permanecen KEEP.

Pendiente únicamente HUMAN QA María.

Si aprueba:
`R62_P02_TERRARIO_E4_HUMAN_APPROVED_UNLOCK_P03`.

Nota de paquete: bundle incremental con prerequisite `c119d329...`, a documentar o convertir en autocontenido antes de integración final.

## R65 · Astra PASS 27 + 9 · 29/09/2026

`R65_TALLER_21_PLUS_9_ASTRA_PASS_HUMAN_QA_PENDING`.

R65 completa visualmente 27 tarjetas base + 9 variantes AGE_0_12. KEEP 6/6 intacto y 21 nuevas PASS. Child-safe visual de arte: 36/36.

Patch SHA-256:
`a72d9fd1e53c98d055298d5fd042be7df64c72a49ef922c5c961d18806a44ca5`.

La integración no se entrega directamente a A2: R67 Fase 3 es la única puerta para materializar el Taller definitivo sobre shell/safety ya reparados.

Pendiente HUMAN QA María:
`R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION`.
