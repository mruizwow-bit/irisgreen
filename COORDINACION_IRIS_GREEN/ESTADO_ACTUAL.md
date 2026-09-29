## Tokens visuales globales · una sola interfaz · 28/09/2026

**Estado: `IRIS_GREEN_GLOBAL_UI_TOKENS_2026_ADOPTED`.**

María decide que ninguna sección/agente puede elegir su propia paleta.

LIGHT y DARK NAVY son temas globales, no colores por página. Home, CONTENT,
BROWSE, Taller, Intereses, Juegos, Sabik y shell de Rincón consumen los mismos
tokens de fondo, superficies, botones, texto, enlaces, bordes, foco y estados.

El arte/escena sí puede variar.

Norma:
`NORMATIVA/IRIS_GREEN_GLOBAL_UI_TOKENS_2026.md`.

Gate:
`IRIS_GREEN_GLOBAL_VISUAL_TOKENS_UNIFIED_GATE`.


## Superficies de baja estimulación · blanco puro prohibido · 28/09/2026

**Estado: `IRIS_GREEN_LOW_STIMULATION_SURFACE_STANDARD_2026_ADOPTED`.**

María confirma como regla global: `#FFFFFF` no se usa como fondo ni superficie extensa.

R42/R02 contiene una contradicción vigente: `--ig-surface-content:#ffffff`. Home usa canvas `#f6f8fb` pero conserva múltiples superficies blancas puras.

Opaco no significa blanco. Se mantiene contraste WCAG, pero con luminancia controlada y paleta suave/desaturada.

R54: arte 6/6 KEEP; chasis/material de tarjeta se revisa si usa blanco puro.

Norma:
`NORMATIVA/IRIS_GREEN_LOW_STIMULATION_SURFACES_2026.md`.

Gate:
`IRIS_GREEN_NO_PURE_WHITE_SURFACE_GATE`.


## Auditoría child-safe + Cloud R04 · 28/09/2026

**A2: `R51_A2_AGE_FILTER_GLOBAL_FAIL_RECLASSIFICATION_REQUIRED`.**

El selector cambia de estado, pero 223 Situaciones + 226 Condiciones + 62 Vida diaria + 60 Datos están clasificados masivamente como TRANSVERSAL, así que la franja infantil sigue viendo casi todo. El test existente no cubre las 965 fichas una a una.

**A9: `R51_A9_R04_PROGRESS_PASS_AGE_TAXONOMY_RECLASSIFICATION_REQUIRED`.**

R04 está en 5B Rutinas, HEAD `b2c8bec6...`, no sellada. La web A2 sigue usando una biblioteca anterior `n04-es-20260916-56f72...`. R04 hereda la taxonomía legacy y no puede sellarse hasta reclasificar por edad.

Sensibilidad S0/S1/S2 y edad son ejes independientes.

Esperado A2:
`R51_A2_GLOBAL_AGE_FILTER_965_RECLASSIFIED_READY_FOR_ASTRA`.

Esperado A9:
`R51_A9_R04_AGE_TAXONOMY_RECLASSIFIED_READY_FOR_ASTRA`.


## Taxonomía global de edad · rangos explícitos · 28/09/2026

**Estado: `IRIS_GREEN_AGE_TAXONOMY_2026_ADOPTED_GLOBAL`.**

María decide que el cambio es también interno, no solo de copy.

IDs canónicos:
`AGE_0_12` · `AGE_13_17` · `AGE_18_PLUS` · `ALL_AGES`.

`GENERAL` solo significa “sin filtro elegido”.

Se sustituyen como taxonomía canónica: Infancia/Adolescencia/Adultez/Transversal y children/teenagers/adults/any.

Aplica a toda Iris Green, incluido child-safe, search, Sabik y Cloud.

Norma: `NORMATIVA/IRIS_GREEN_AGE_TAXONOMY_2026.md`.


## R52 · Sabik · corrección de precedencia · 28/09/2026

**Estado: `R52_A3_REWORK_NEW_SABIK_WITH_R37_MOTION_REQUIRED` · #315.**

María aclara: R37 es el sistema de movimiento perdido; la identidad visual correcta es el Sabik nuevo ya aprobado en la web.

Contrato correcto:
**Sabik nuevo + motion R37**.

La entrega A3 previa queda superseded como referencia visual, y el checkpoint A2 `5f759464...` no puede considerarse candidato final R52 mientras use la apariencia antigua.

Esperado:
`R52_A3_NEW_SABIK_R37_MOTION_READY_FOR_A2`.

Después A2 integra motion corregido + 30 WAV + preview + HUMAN QA.

No main/producción.


## R59 · Fase 1 · 72/72 content PASS / independence-schema fix · 28/09/2026

**Estado: `R59_ASTRA_PHASE1_72_CONTENT_PASS_INDEPENDENCE_SCHEMA_FIX_REQUIRED` · #323.**

Astra revisa el ZIP real: las 72 decisiones R58 pasan en contenido y dirección. Build/test calidad PASS; test de independencia PASS parcial.

Bloqueo acotado: `needs_map`, `needs_real_data` y `source_pressure` siguen copiándose 72/72 desde el donor y no entran en la huella de independencia. También falta normalizar el schema canónico y corregir marcador/documentación.

No rehacer las 72 experiencias.

Próximo:
`R59_AGENT_INTERESTS_72_RESTRUCTURE_R1_READY_FOR_ASTRA`.

Setas: SIT oficial 91 562 04 20 (24h), solo para posible intoxicación.

No build72/build6/A2/main/producción.


## R62 · P01 Habitación imposible · E4 HUMAN QA APROBADO · 28/09/2026

**Gate: `R62_P01_HABITACION_E4_HUMAN_APPROVED` · #326.**

María aprueba la V3. P01 queda cerrado como primera referencia E4 aprobada de Juegos: mecánica, material, iluminación, arquitectura, desktop, móvil y pipeline híbrido.

Se autoriza únicamente:
`R62_P02_TERRARIO_E4_REWORK_AUTHORIZED`.

P03–P06 y build final siguen HOLD. No A2/main/producción.


## R53 · Sala 1 Globos · proyección corregida · E4 sigue abierto · 28/09/2026

**Estado: `R53_SALA1_GLOBE_PROJECTION_FIX_PASS_E4_REWORK_CONTINUES` · #317.**

Astra revisa la prueba controlada y la sala real: el fallo que hacía que los globos de los extremos se vieran cortados/deformados queda corregido. Las siluetas fuera de eje ya se leen como globos completos.

Gate parcial:
`GLOBE_SILHOUETTE_PROJECTION_PASS`.

No reabrir geometría esférica salvo regresión.

Sigue pendiente E4: membrana/material, arquitectura, interacción visible y composición móvil propia.

Mismo patrón registrado en Cloud/Garden, pero esas salas no se tocan todavía.

Esperado:
`R53_SALA1_GLOBOS_E4_R2_READY_FOR_ASTRA_MARIA`.

Otras 5 salas HOLD. No A2/main/producción.


## R54 · Taller · rebenchmark SEP 2026 · 6 tarjetas PASS Astra · 28/09/2026

**Estado: `R54_ASTRA_6_PILOTS_REBENCHMARK_SEP2026_PASS_HUMAN_QA_PENDING` · #318.**

Astra revisa las seis juntas al tamaño real móvil 240×150 CSS px. Dibujo, Estructuras, Programación, Videojuegos, Mundos y Modelado 3D pasan como estándar homogéneo de arte de tarjeta del launcher.

R54_NORMA mantiene/expande el contrato sync/config y sirve AVIF+WebP 1x/2x con fallback.

Este PASS NO aprueba automáticamente interiores/starters, cromo ni imprimibles.

Pendiente HUMAN QA María. Si aprueba:
`R54_TALLER_CARD_STANDARD_SEP2026_HUMAN_APPROVED_SCALE_21_PLUS_9_AUTHORIZED`.

No A2/main/producción.


## R62 · P01 E4 vuelta 2 · geometría PASS / luz-material-móvil REWORK · 28/09/2026

**Estado: `R62_P01_E4_GEOMETRY_PASS_LIGHTING_MATERIAL_MOBILE_REWORK_REQUIRED` · #326.**

La segunda vuelta resuelve el bloqueo geométrico: despiece de muro, losas, zócalo y articulación arquitectónica ya sacan la escena de la maqueta de prismas.

Queda rework localizado: iluminación de área/rebote/derrame, imperfección material controlada, profundidad de vanos, identidad espacial y layout móvil real.

Esperado:
`R62_P01_VISUAL_E4_R3_READY_FOR_ASTRA_MARIA`.

No P02/P03 todavía. Codex/A2/main/producción HOLD.


## R59 · asignación corregida · Agente activo / Codex HOLD · 28/09/2026

**Estado: `R59_AGENT_ACTIVE_CODEX_HOLD_UNTIL_2026_10_01` · #323.**

María corrige la asignación: Codex está inhabilitado hasta el 01/10/2026 y no ejecuta R59 ahora.

Ejecutor activo: **Agente R59**.

Orden activa:
`COORDINACION_IRIS_GREEN/ORDENES/R59_AGENTE_INTERESES/01_AGENTE.md`

Orden Codex anterior: histórica/pausada.

Gate Fase 1:
`R59_AGENT_INTERESTS_72_RESTRUCTURE_READY_FOR_ASTRA`

Aclaración:
`DONOR_MAY_DERIVE_FROM_R48__R58_DECISIONS_MUST_NOT`.

No esperar a Codex. No trabajo Codex antes del 01/10/2026.


## R53 · Sala 1 Globos de luz · HUMAN QA forma FAIL · 28/09/2026

**Estado: `R53_SALA1_GLOBOS_FORM_FAIL_REWORK_REQUIRED` · #317.**

María identifica el fallo raíz: las formas actuales se leen como deformaciones/blobs, no como globos de luz. Esto coincide con el addendum R53, que ya marcaba blobs como FAIL inmediato.

KEEP técnico: quality manager adaptativo y aprendizaje de iluminación/profundidad.

REWORK: cuerpos inflables reconocibles, arquitectura material, composición que cuente la interacción, móvil vertical propio y comparación E4.

Esperado:
`R53_SALA1_GLOBOS_E4_R2_READY_FOR_ASTRA_MARIA`.

Otras 5 salas HOLD. No A2/main/producción.


## R62 · P01 premium render · técnica PASS / E4 rework · 28/09/2026

**Estado: `R62_P01_RENDER_PIPELINE_PASS_VISUAL_E4_REWORK_REQUIRED` · #326.**

El nuevo pipeline híbrido raster first-party + vector es válido y mejora material, luz, sombra y profundidad.

P01 aún no alcanza E4: falta riqueza geométrica/arquitectónica y el layout 390 sigue siendo desktop miniaturizado.

La norma global ya define:
`IRIS_GREEN_VISUAL_EXECUTION_TARGET_E4_PREMIUM_2026`
y benchmark externo concreto (commit `0e9880bf...`).

Esperado:
`R62_P01_VISUAL_E4_READY_FOR_ASTRA_MARIA`.

No pasar todavía el renderizador a P02. P03/Codex/A2/main/producción HOLD.


## R59 · R48 coordinación v4 · auto-benchmark visual aceptado · 28/09/2026

**Estado: `R59_ASTRA_R48_V4_COORDINATION_ACCEPTED_VISUAL_REWORK_CONFIRMED_V3_ARTIFACT_PENDING` · #323.**

Astra verifica en v4 matriz donor 72/72, checker `completo.py` con exit negativo real y cobertura de /img + CSS url(), y acepta el auto-benchmark visual: 45/45 experiencias R48 construidas quedan `VISUAL_REWORK_REQUIRED` bajo la norma global 2026.

La orden R59 ya hereda explícitamente la normativa visual global (commit `9f1fa2ae...`). R48 queda donor técnico/editorial, no referencia gráfica.

Pendiente solo de artefacto: este ZIP de coordinación no contiene el handoff/overlay v3 completos, así que esos claims standalone no están aún independientemente cerrados.

Codex continúa Fase 1 hacia `R59_CODEX_INTERESTS_72_RESTRUCTURE_READY_FOR_ASTRA`.

No construir 72/6 pilotos. No A2/main/producción.


## GLOBAL · estándar visual móvil septiembre 2026 · 28/09/2026

**Estado: `IRIS_GREEN_VISUAL_STANDARD_SEP_2026_ADOPTED_ROLLING`.**

María adopta un único estándar visual premium 2026 para todo Iris Green: Home, Taller, Juegos, Intereses, Rincón, Recursos y nuevas experiencias.

Normativa:
`COORDINACION_IRIS_GREEN/NORMATIVA/IRIS_GREEN_VISUAL_STANDARD_SEP_2026.md`

La técnica puede ser SVG rico, raster, Canvas, 2.5D, WebGL, WebGPU con fallback o híbrida. Lo obligatorio es el resultado: materialidad, luz, profundidad, composición, atmósfera, microdetalle, identidad, responsive, accesibilidad y rendimiento.

Benchmark móvil: revisar antes de cada gran ola visual/escala y como máximo cada 8 semanas mientras haya trabajo visual activo.

Efectos inmediatos:
- R54 Taller: rebenchmark de los 6 antes de escalar 21+9; sync técnico no basta para autorizar escala.
- R62 P01: mecánica KEEP, visual reabierto.
- R62 P02: mecánica KEEP, visual rework.
- R62 P03: HOLD hasta tener referencia de Juego que pase el estándar.

No A2/main/producción por estos carriles hasta sus gates.


## R62 · P02 Terrario vivo · Astra PASS · 28/09/2026

**Estado: `R62_P02_ASTRA_CONCEPT_PASS_HUMAN_QA_PENDING` · #326.**

Astra revisó patch, concepto, SVG y capturas 1440/390. El generador compila y reproduce ambos SVG byte-identical.

PASS de concepto: mecánica abierta, causalidad luz/humedad, relieve/agua, dirección visual orgánica, simulación delimitada, accesibilidad, etapas, móvil e IP.

Pendiente HUMAN QA de María. Si aprueba: `R62_P02_TERRARIO_CONCEPT_APPROVED` y puede empezar solo P03 · Rutas de luz.

P04–P06 y Codex #321 siguen HOLD.


## R54 · SYNC fuente/output PASS · fingerprint de configuración pendiente · 28/09/2026

**Estado: `R54_ASTRA_SYNC_LOGIC_PASS_RENDER_CONFIG_FINGERPRINT_REQUIRED` · #318.**

Astra revisó el patch real R54_SYNC. Pasa la sincronización de SVG generado + hashes WebP 1x/2x + dimensiones, el hook en build, la prueba source-stale y el fallo limpio de Chromium. No toca visuales.

Queda un único blocker técnico: el manifest registra settings de render/calidad, pero el checker no los compara contra la configuración efectiva actual. Falta fingerprint por escena de settings y prueba negativa de cambio de configuración sin reraster.

Esperado:
`R54_CLAUDE_RASTER_CONFIG_FINGERPRINT_READY_FOR_ASTRA`

No escalar 21+9 todavía. No A2/main/producción.


## R59 · handoff R48 v2 revisado · donor schema PASS / standalone QA REWORK · 28/09/2026

**Estado: `R59_ASTRA_HANDOFF_V2_DONOR_SCHEMA_PASS_STANDALONE_QA_REWORK` · #323.**

La matriz 72/72 v2 ya queda correctamente separada como DONOR R48 y puede usarse como input de Codex Fase 1. Los CSS depth/cards que faltaban en v1 ya están.

Pendiente solo del handoff standalone: `completo.py` no retorna fallo, no cubre todos los assets, faltan el brand symbol/otros WebP referenciados y el generador de matriz no se reproduce desde el handoff porque faltan g03b..g09.

Claude corrige packaging y para en `R59_CLAUDE_HANDOFF_V3_STANDALONE_QA_READY_FOR_ASTRA`.

Codex NO espera: sigue Fase 1 y para en `R59_CODEX_INTERESTS_72_RESTRUCTURE_READY_FOR_ASTRA`.

No construir 72 ni 6 pilotos. No A2/main/producción.


## R60 · Música P1 · HUMAN QA FAIL · 28/09/2026

**Estado: `R60_HUMAN_QA_4_PILOTS_FAIL_REWORK_REQUIRED` · #324.**

María escucha los cuatro pilotos y determina que no funcionan: algunas piezas resultan estridentes desde el inicio y otras presentan dureza/estridencia entre fragmentos o transiciones.

HUMAN QA prevalece sobre métricas y checks automáticos.

M01 REWORK · M02 REWORK · M03 REWORK · M04 REWORK.

Esperado: `R60_CLAUDE_MUSIC_4_PILOTS_R2_READY_FOR_ASTRA_MARIA`.

No largos, A2, sustitución Pixabay, main ni producción.


## R60 · Música P1 · Astra listening review · 28/09/2026

**Estado: `R60_ASTRA_MUSIC_4_PILOTS_LISTENING_REVIEW_READY_FOR_MARIA` · #324.**

Astra escucha los cuatro MP3 y propone: M01 KEEP · M02 KEEP · M03 ADJUST · M04 KEEP.

M03 conserva buena identidad espacial pero necesita reducir/alternar la presencia casi continua de aire/agudos antes de cualquier render largo.

Pendiente HUMAN QA de María por piloto.

No se emite aún `R60_MUSIC_4_PILOTS_APPROVED_FOR_LONG_RENDER`.

No largos, A2, sustitución Pixabay, main ni producción.


## R62 · P01 Habitación imposible · HUMAN QA APROBADO · 28/09/2026

**Gate: `R62_P01_HABITACION_CONCEPT_APPROVED` · #326.**

María aprueba las imágenes R2. P01 queda cerrado como concepto: mecánica, cubo/rotaciones reales, demostración A/B, ruta, selector, dirección visual, etapas y dirección móvil.

La textura/materialidad final de producción queda separada y no reabre el concepto.

Se autoriza únicamente **P02 · Terrario vivo · concepto**.

P03–P06 y Codex #321 siguen HOLD.


## R62 · P01 Habitación imposible R2 · Astra PASS · 28/09/2026

**Estado: `R62_P01_ASTRA_CONCEPT_PASS_HUMAN_QA_PENDING` · #326.**

Astra revisó la R2 real. PASS de concepto: cubo, rotaciones reales, mecánica A/B legible, ruta/entrada/salida, selector de caras y dirección visual.

No es arte final: textura/materialidad de producción queda como entregable separado antes del build final.

Pendiente HUMAN QA de María. Si aprueba: `R62_P01_HABITACION_CONCEPT_APPROVED` y puede empezar P02.

Codex #321 sigue HOLD hasta los seis conceptos.


## R54 · seis pilotos R2 · dirección visual PASS · sync gate pendiente · 28/09/2026

**Estado: `R54_ASTRA_6_PILOTS_DIRECTION_PASS_SYNC_GATE_REQUIRED_BEFORE_SCALE` · #318.**

Astra revisó el patch R2 real y las seis escenas finales. PASS visual 6/6: Dibujo, Estructuras, Programación, Videojuegos, Mundos y Modelado 3D. El listón visual queda fijado para los 21 restantes.

Estructuras: KEEP; el camión rojo no reabre la escena.

Infancia: mismo sitio/proceso creativo, menos densidad y objetos más grandes/claros cuando ayude; nunca «lo mismo más mono».

La escala 21 + 9 sigue HOLD por un único bloqueo técnico: el build exige que existan los WebP 1x/2x, pero no verifica que correspondan al SVG/Python actual. Falta fingerprint/hash fuente→output y test de stale raster.

Esperado: `R54_CLAUDE_RASTER_SOURCE_OUTPUT_SYNC_READY_FOR_ASTRA`.

No A2 R54, main ni producción todavía.


## R62 · P01 Habitación imposible · Astra review · 28/09/2026

**Estado: `R62_P01_MECHANIC_PASS_VISUAL_CONCEPT_REWORK_REQUIRED` · #326.**

La mecánica de cuatro orientaciones de suelo/gravedad se conserva. P01 NO queda aprobado todavía porque las láminas no demuestran visualmente el cambio de suelo y siguen a nivel de blocking.

Correcciones R2: mostrar estado A/B del cambio de suelo, subir materialidad/atmósfera, clarificar entrada→ruta→salida, rediseñar el selector tipo D-pad y corregir los glifos de flechas que renderizan como cuadrados.

Esperado: `R62_P01_HABITACION_CONCEPT_R2_READY_FOR_ASTRA`.

P02 y Codex #321 siguen HOLD.


## R49 · A8 · interfaz R42/R02 transversal lista para Astra · 27/09/2026

## R59 · handoff pilotos R48 revisado · 28/09/2026

**Estado: `R59_ASTRA_HANDOFF_DONOR_ACCEPTED_RESTRUCTURE_STILL_REQUIRED` · #323.**

El ZIP de handoff se acepta como donor, no como cierre P0.

La matriz incluida deriva modos/escenas desde el renderer R48 y keep/rework desde el estado de construcción: 40 construidos = 40 keep; 32 no construidos/previos = 32 rework.

Codex debe hacer la decisión R58 real 72/72 y parar en `R59_CODEX_INTERESTS_72_RESTRUCTURE_READY_FOR_ASTRA`.


## R60 · Música · P0 pipeline aceptado · 28/09/2026

**Estado: `R60_ASTRA_MUSIC_PIPELINE_PROOF_ACCEPTED_P1_AUTHORIZED` · #324.**

P0 técnico PASS: síntesis first-party, reproducible, master/web assets/manifest/medición correctos.

La pieza P0 NO queda congelada como identidad musical. Como posible M01: ADJUST.

Claude queda autorizado a crear únicamente los 4 pilotos cortos M01–M04 y debe parar en `R60_CLAUDE_MUSIC_4_PILOTS_READY_FOR_ASTRA`.

No piezas 10–12 min, no A2, no sustitución de biblioteca externa todavía.


## R62 · Juegos · conceptos 6 pilotos · 28/09/2026

**Estado: `R62_GAMES_6_PILOT_CONCEPTS_ORDERED` · #326.**

Tras aceptar la clasificación 297/297, la siguiente fase es diseñar los 6 pilotos uno a uno con imagen+mecánica antes de que Codex construya.

Orden: Habitación imposible → Terrario vivo → Rutas de luz → Ritmo de colores → Pesca tranquila → Mi museo.

Codex #321 sigue HOLD hasta `R56_PLAY_6_PILOT_CONCEPTS_APPROVED_FOR_CODEX`.


## R57 · Juegos · clasificación 297 aceptada por Astra · 28/09/2026

**Estado: `R57_ASTRA_GAMES_297_CLASSIFICATION_ACCEPTED` · #321.**

Resultado: 260 ROUTINE_PRACTICE · 26 TOOL · 11 GAME · 0 INTEREST_MINIGAME.

Los 11 GAME son todos memoria/parejas; tras 2 merges equivalen a 1 motor + 9 barajas, no a variedad suficiente de juegos.

260 prácticas se preservan para futura migración a Rutinas → Practicar; 154 aún necesitan mapping de rutina destino.

Codex queda HOLD hasta `R56_PLAY_6_PILOT_CONCEPTS_APPROVED_FOR_CODEX`.


## R61 · Rincón · piloto Pecera audiovisual · 28/09/2026

**Estado: `R61_CLAUDE_RINCON_AQUARIUM_AV_PILOT_ORDERED` · #325.**

María aprueba `pecera_acuario.mp4` como donor visual del piloto.

Claude debe convertirla en una escena audiovisual first-party de ~10 min con sonido propio integrado, exclusivo de la Pecera.

0 autoplay. Acción principal `Ver y escuchar`; controles Silenciar/Activar sonido, Volumen, Parar y Pantalla completa.

No construir Medusas/Mar/Río/Bosque hasta HUMAN QA del piloto.


## R54 v2 · Astra review seis pilotos · 28/09/2026

**Estado: `R54_ASTRA_6_PILOTS_PARTIAL_PASS_REWORK_BEFORE_SCALE`.**

Mejora real confirmada. Estructuras, Mundos y Modelado 3D fijan bien la dirección. Dibujo, Programación y Videojuegos deben rehacerse antes de escalar.

También quedan obligatorios: pipeline raster reproducible, 2x/srcset, revisión loading/LCP, cache-busting y build estricto para escenas migradas.

No autorizar 21 restantes ni 9 variantes hasta `R54_CLAUDE_TALLER_VISUAL_6_PILOTS_R2_READY_FOR_ASTRA`.


## R60 · Música original Iris Green · 28/09/2026

**Estado: `R60_CLAUDE_IRIS_MUSIC_ORIGINAL_ORDERED` · #324.**

La biblioteca global actual de 24 pistas externas/Pixabay no es final.

Claude crea pipeline first-party → 4 pilotos cortos → Astra/María escuchan → solo después 4 piezas de 10–12 min.

El reproductor global se conserva. A2 reemplaza la biblioteca únicamente tras aceptación.

Objetivo final: 100 % música Iris Green local/first-party, 0 autoplay, 0 streaming/embeds, 0 crédito Pixabay en runtime.


## R58/R59 · Intereses · reestructuración antes de build · 28/09/2026

**Producto:** `R58_INTERESTS_RESTRUCTURE_AND_PILOTS_ORDERED` · #322  
**Ejecución Codex:** `R59_CODEX_INTERESTS_RESTRUCTURE_ORDERED` · #323

Intereses deja de entrar por datasets/APIs/mapas y pasa a mundos visuales propios + exploración + actividad + colección opcional + información real dosificada.

Codex empieza solo con matriz 72/72. STOP en `R59_CODEX_INTERESTS_72_RESTRUCTURE_READY_FOR_ASTRA`.

Después de conceptos Astra/María aprobados, construye solo 6 pilotos: Mar y peces, Aves, Fósiles, Minerales, Trenes/metro y Espacio.

No escalado antes de `R58_INTERESTS_STANDARD_APPROVED_FOR_SCALE`.


## R57 · Codex Juegos · clasificación 297 primero · 28/09/2026

**Estado: `R57_CODEX_GAMES_CLASSIFICATION_ORDERED`.**

Codex ejecuta R56 #320.

Fase inmediata: clasificar 297/297 como GAME / ROUTINE_PRACTICE / TOOL / INTEREST_MINIGAME, sin borrar ni migrar.

No construye dirección visual final hasta `R56_PLAY_6_PILOT_CONCEPTS_APPROVED_FOR_CODEX`.

Después construirá solo 6 pilotos. No escalado masivo hasta HUMAN QA.


## R56 · Juegos/Recursos/Intereses lúdicos · rediseño Astra · 28/09/2026

**Estado: `R56_ASTRA_GAMES_RESOURCES_PLAY_SYSTEM_DESIGN_FROZEN`.**

Astra rediseña el sistema antes de construir: separar GAME / ROUTINE_PRACTICE / TOOL / INTEREST_MINIGAME.

Rutinas absorbe las prácticas cotidianas mediante `Ver · Practicar · Crear la mía · Imprimir`. Juegos pasa a juego real. Intereses recibe minijuegos solo cuando el tema los justifique. Recursos queda como hub de herramientas prácticas.

Regla transversal: **pilotos → estándar aprobado → escalado**.

Seis pilotos: Habitación imposible, Terrario vivo, Rutas de luz, Ritmo de colores, Pesca tranquila y Mi museo.

No build masivo ni integración A2 hasta aprobar estándar.


## R54 · Taller · calidad gráfica aún no aceptada · 28/09/2026

**Estado: `R54_ASTRA_VISUAL_QUALITY_FAIL_REFINEMENT_REQUIRED`.**

Astra renderiza las 27 escenas reales de R54. Mejora confirmada: ya son escenas y no iconos. Pero el acabado sigue leyendo como vector/infografía educativa plana y no alcanza todavía el nivel gráfico pedido por María.

El gate automático 27/27 PASS solo mide >=15 elementos y <4300 bytes; queda degradado a gate estructural, no artístico.

Antes de tocar 27 de nuevo, Claude entrega 6 pilotos refinados: Dibujo, Estructuras, Programación, Videojuegos, Mundos y Modelado 3D. Calidad > tamaño mínimo de SVG; se permiten assets first-party originales optimizados.

A2 NO integra R54 como cierre visual hasta nuevo Astra PASS.


## R53 · dirección visual final · 6 instalaciones · 28/09/2026

María fija que las Salas se definen por **luz + color + material + volumen + recorrido**, no por efectos digitales.

R53 pasa de 5 a **6 instalaciones**. La sexta queda pendiente de definición final; no se inventa una demo para completar el número.

Gate visual: cada sala debe poder existir físicamente como instalación de museo y funcionar ya en captura fija. Shader/screensaver/fondo procedural/caja negra/cielo/wireframe = FAIL.

Addendum canónico: `MEMORIA/ADDENDUM_R53_6_INSTALACIONES_LUZ_COLOR_MATERIAL_20260928.md`.


## R44 · matriz 64 retos · revisión Astra guardada · 28/09/2026

**Estado: `R44_MATRIZ_64_ASTRA_REVIEWED_CORRECTIONS_REQUIRED_BEFORE_BUILD`.**

La matriz 64/64 queda guardada como base válida, pero NO autoriza construir los 55 retos de Ola A todavía.

Prerequisito: cerrar y aceptar R54.

Antes del build: separar etapa recomendada de audience/safety, auditar 55/55 contra HEAD final, verificar IO real de proyectos cruzados, corregir criterios problemáticos y heredar el contrato visual R54.

Después de R54, Astra reconcilia la matriz y solo entonces propone a María una primera tanda pequeña.


## R54 · Taller · Home e interiores visualmente ricos · 28/09/2026

**Estado: `R54_CLAUDE_TALLER_VISUAL_REBUILD_ORDERED`.**

Astra audita los patches R47 y confirma que muchas tarjetas de Home usan SVG inline demasiado esquemáticos (bloques, líneas, cuadrículas). María fija la regla: **El Taller no puede entrar por iconos; tiene que entrar por escenas.**

#318 conserva motores/27 estudios/child-safe/R42-R02/storage/ES-EN y reconstruye únicamente el lenguaje visual de Home e interiores.

Infancia requiere una experiencia más inmediata, cálida y visual; adolescencia/adultez pueden ser más sobrias, nunca vacías ni iconográficas.

Claude entrega 27/27 visual matrix + before/after + interiores + desktop/móvil. Astra revisa antes de A2.


## R53 · Rincón · ASTRA REVIEW FAIL · 28/09/2026

**Estado: `R53_CLAUDE_RINCON_REBUILD_ORDERED`.**

Astra audita el ZIP R46 de Claude y rechaza el marcador `R46_CLAUDE_RINCON_REBUILD_READY_FOR_ASTRA`.

Fallo raíz: las cinco salas son presets de un único shader/field, no cinco instalaciones con gramática espacial propia. Nube sigue leyendo como cielo; Respiración repite Globos; Jardín/Papel no alcanzan el material buscado.

Además: Salas solo WebGL2 sin Canvas/static fallback, reduced-motion incompleto, audio de Salas ausente pese a documentarse, provenance/ad gate incompletos, QA 112 PASS no cubre producto, claim CSP bloqueante incorrecto porque la base A2 ya permite youtube-nocookie.

#317 conserva Respirar/Paisajes loader/Pantalla limpia/#303/layout y reconstruye únicamente lo necesario. Solo `R53_CLAUDE_RINCON_INSTALLATIONS_READY_FOR_ASTRA` podrá pasar a A2.


## R52 · restaurar Sabik móvil aprobado + voz final · 27/09/2026

**Estado: `R52_SABIK_MOVING_PRESENCE_RESTORE_ORDERED`.**

María aclara que el Sabik anterior ya se movía; solo faltaba la voz. La simplificación R37 posterior (cinco PNG + transiciones cortas + PRESENTE inmóvil) se registra como regresión/intermedio, no continuidad visual final.

Donante móvil exacto:
`sabik-preview@fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`
CSS blob `b38a95b8994de2e20cfb0b8f29e58a69253325a9`.

R52 restaura únicamente la presencia animada por capas sobre el panel actual, sin recuperar shell/retrieval/storage/semánticas antiguas. A3 porta movimiento; A2 integra la voz final ES/EN y los 30 WAV.

Marcadores:
`R52_A3_SABIK_MOVING_PRESENCE_RESTORED_READY_FOR_A2`
→ `R52_A2_SABIK_MOVING_AND_SPEAKING_PREVIEW_READY_FOR_ASTRA`.


## R51 · A9 · Biblioteca Cloud Sabik R04 · 27/09/2026

**Estado: `R51_A9_SABIK_CLOUD_LIBRARY_R04_ORDERED`.**

R03 queda inmutable como base técnica privada verificada. #314 construye R04 con cobertura editorial completa y un updater incremental reproducible.

Regla de María:
**cada cambio aprobado de la web debe reflejarse en una nueva versión de biblioteca sin reconstrucción manual completa.**

Flujo:
`WEB_SOURCE_CHANGE → DELTA → REBUILD_AFECTADO → SAFETY/CITATIONS_QA → NEW_IMMUTABLE_VERSION`.

El updater observa solo el source web canónico aprobado, ignora ramas experimentales, no crea versiones si el cambio es solo UI/CSS/JS sin contenido, y conserva histórico/tombstones.

A9 construye → Astra revisa. No producción.


## R50 · HUMAN QA Home/header global · 27/09/2026

**Estado: `R50_A2_HOME_GLOBAL_HEADER_ISO_COPY_ORDERED`.**

María detecta regresiones en R49/Home: Música ausente, Accesibilidad poco visible, categorías duplicadas en la barra superior y copy negativo que introduce “etiquetas”, “diagnóstico” y “Protección por defecto”.

#313 fija el header global:
**Iris Green · Buscar · Música · Accesibilidad · Contenido · idioma · Explorar**.

Condiciones/Situaciones/Vida diaria/Investigación/Recursos salen de la navegación primaria permanente y permanecen en Home/Buscar/Explorar.

Copy Home ES/EN revisado bajo ISO 24495-1:2023, ISO 9241-112:2025 y COGA. SAFE_BY_DEFAULT continúa técnico, pero el estado público sin selección se llama **General**.

A2 aplica R50 antes de la preview final. A8 no se reabre. No main/producción.


**Estado: `R49_A8_TRANSVERSAL_R42_R02_READY_FOR_ASTRA`.**

A8 completó #311 en rama `agent8/r49-transversal-r42-r02-20260927`. HEAD validado `563ac5f71e4c9c3b19b32ea982a684033ea74f45`, tree `9ee305eb571b590cb59f524b78b0877160f0e284`, PR #312 contra A2 y mergeable al entregar.

Cobertura pública: 1.047 rutas navegables, 0 sin clasificar; CONTENT 948, BROWSE 22, WORKSPACE 77; ES 531 / EN 516. Los 6 HTML restantes hasta los 1.053 fuente son chunks full S2 no navegables. Transform build idempotente, shared chrome R02, búsqueda segura, audience, preferencias y child-safe se aplican transversalmente sin reescribir motores R46/R47/R48.

Regla de layout `READING_WIDTH != PRODUCT_WIDTH` validada en 1366/1440/1600/1920/2560 + 390/320. QA final run `36338047939` SUCCESS, artifact `10937792177`, 95 capturas R49 + 11 Home. Child-safe mantiene 0 full-S2 requests en vistas protegidas y 1 solo tras acción adulta explícita. Tarjeta Iris derivada del full fue retirada del payload inicial S2 y queda gate contra regresión.

Performance delta frente a build sin R49: CONTENT LCP −28 ms / CLS +0.005842; BROWSE +8 ms / −0.07424; WORKSPACE −80 ms / +0.039341. Todos pasan el gate de regresión.

A2 avanzó durante QA a `822092d3ae64d39ab421e766d79a83db93dc031b` y ya integró #310. R49 no se rebasa después del QA para conservar evidencia exacta. Secuencia: **Astra revisa #312 → A2 integra en HEAD vivo → una preview → María HUMAN QA**. No main/producción/deploy A8.

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

## R42 · A8 · Home nueva + child-safe lista para A2 · 27/09/2026

## Sabik voz/audio · cerrado → integración A2 · 27/09/2026

**Estado fuente cerrado: `SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED_HANDOFF_READY`.**
**Estado operativo: `SABIK_AUDIO_R01_A2_INTEGRATION_ORDERED`.**

Artefacto único:
`/SABIK/HANDOFFS/SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`
SHA-256 `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.

30 WAV · 15 ES + 15 EN · 30/30 hashes PASS · 30/30 machine QA PASS.

Copy canónico: `SABIK_COPY_PRODUCCION_R02_20260927`: 40 registros · 25 KEEP · 15 REVISED · 0 HOLD.

No se reabre entrenamiento ni selección de voz. A2 integra copy R02 + assets + control de voz session-only OFF por defecto + cancelación + QA preview.

Marcador esperado: `SABIK_AUDIO_R01_A2_PREVIEW_READY_FOR_ASTRA`.


## Sabik Audio R01 · A2 integration handoff · 27/09/2026

**Estado: `SABIK_AUDIO_R01_A2_INTEGRATION_ORDERED`.**

Voz/audio fijo cerrado y verificado. Artefacto exacto disponible en Library:
`/SABIK/HANDOFFS/SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`
SHA-256 `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.

30 WAV = 15 ES + 15 EN; 30/30 audio/text hashes PASS; 0 clipping.

A2 debe aplicar primero `SABIK_COPY_PRODUCCION_R02_20260927` completo (40 = 25 KEEP + 15 REVISED + 0 HOLD), después montar audio, añadir control de voz ES/EN OFF por defecto de sesión y publicar preview. No retraining/regeneration, no modelos/masters en producto, no main/producción.

Marcador esperado: `SABIK_AUDIO_R01_A2_PREVIEW_READY_FOR_ASTRA`.


## R49 · interfaz R42/R02 transversal · 27/09/2026

**Estado: `R49_A8_TRANSVERSAL_R42_R02_ORDERED`.**

Decisión de María: R42/R02 se aplica a toda Iris Green, no solo Home. #305/#310 se conserva como Home + child-safe y donante válido.

R49 clasifica la web en CONTENT / BROWSE / WORKSPACE y comparte header/footer/materiales/preferencias/audience/child-safe, manteniendo arquitectura apropiada por área.

Regla nueva de layout: `READING_WIDTH != PRODUCT_WIDTH`. No se aceptan interfaces centradas en una banda estrecha con laterales enormes vacíos. Texto largo mantiene medida legible; producto/visual/workspace usa grid fluido y el viewport disponible. Rincón/Taller/Intereses quedan expresamente bajo este gate.

Árbol observado: 1.053 HTML. Propagación por build/manifest idempotente, 0 rutas públicas sin clasificar.

A8 construye → Astra revisa → A2 integra → María HUMAN QA. No main/producción.


## Astra review · A9 Biblioteca Cloud · 27/09/2026

**Estado: `R39_A9_SABIK_CLOUD_LIBRARY_ASTRA_REVIEW_FIX_REQUIRED`.**

A9 entrega arquitectura válida y candidato privado sellado, pero no se cierra por tres bloqueantes:
1. safe variants autoderivadas; algunas usan el mismo texto que el fragmento S2;
2. 2 URLs EN de Datos incorrectas por inferir slug desde título;
3. HTTP de aplicación autenticado tras Team Login no demostrado.

R38 sigue intacto. El candidato R01 puede conservarse como evidencia técnica. A9 debe corregir sobre el mismo carril, crear nueva versión inmutable y devolver `R39_A9_SABIK_CLOUD_LIBRARY_FIX_READY_FOR_ASTRA`.

Cobertura #302 (965 registros / 16 S2) sigue pendiente de sincronización con la nueva web.


**Estado: `R42_A8_HOME_CHILD_SAFE_READY_FOR_A2`.**

A8 ha construido #305 sobre A2 exacto `bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`. Entrega: rama `agent8/r42-home-child-safe-20260927`, HEAD `4769e223dc5e10f2bdd82a508310a929e94a6bb5`, tree `7e3db0f4dc4f4c7943f7ce1be266109ca97510c2`, PR #310 dirigido a la rama A2.

QA final A8: run `36330769828` SUCCESS; artifact `10935572919`. Home ES/EN desktop/móvil, cuatro lentes de etapa, SAFE_BY_DEFAULT, índices de búsqueda separados, full S2 fuera de HTML/payload inicial, safe variants, Adultez con carga full solo tras acción explícita, y cuatro Investigación `INTENTIONAL_ONLY` (#35/#42/#43/#89).

Baseline real: `global-395` y Investigación 121–132 siguen siendo altas R01 del gate editorial #302 y no se inventan en A8. #294–#297 permanecen históricos/pausados.

Siguiente puerta: A2 integra #310 → build/CI → una única Deploy Preview → HUMAN QA María. No main ni producción.

# Estado operativo compartido

## Sabik · Audio Library R01 verificada + handoff A2 listo · 27/09/2026

**Estado: `SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED_HANDOFF_READY`.**

Verificación del ZIP recibido:
- SHA-256 recibido = esperado: `fd6f73544fbd6153c077a302a275b7d893cee4e49104d7140ca7153b2a49eadc`;
- 30/30 hashes de WAV coinciden con el manifest;
- 15 ES + 15 EN;
- machine QA PASS: -16.5 LUFS, peak máximo -1.0 dBFS, 0 clipping;
- limitador: 10/30, reducción máxima 2.774 dB.

Modelos finales registrados:
- EN `SABIK_EN_R02_FINAL`: model SHA `3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df`;
- ES `SABIK_ES_R01_FINAL`: model SHA `8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291`.

Se detectó una inconsistencia solo de metadata en el manifest original: `audio_policy.processing` seguía declarando gain-only aunque 10 entradas usan el limitador fallback ya documentado en `postprocess`. Se creó paquete de handoff verificado con metadata reconciliada, sin alterar los bytes de audio: SHA-256 `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.

Handoff: `HANDOFFS/SABIK_AUDIO_R01_FINAL/README.md`.

Siguiente gate: A2 integra copy R02 + assets de audio en preview, con voz session-only bajo control del usuario, sin autoplay previo, sin doble locución con live regions y sin main/producción hasta HUMAN QA María.

## Sabik · AUDIO LIBRARY R01 FINAL · 27/09/2026

**Estado: `SABIK_AUDIO_LIBRARY_R01_FINAL_MACHINE_QA_PASS_UPLOAD_VERIFY_NEXT`.**

Postproceso final completado sobre 30 locuciones fijas ES/EN:
- 30/30 entradas;
- loudness final uniforme: **-16.5 LUFS**;
- pico máximo: **-1.0 dBFS**;
- clipping: **0**;
- limitador transparente usado solo en 10/30 entradas;
- reducción máxima del limitador: **2.774 dB**;
- manifest SHA-256: `dd4a44d222d6fbbade669a32a705d08fe5601ac11c39911105df8cb37d71d4d9`;
- ZIP SHA-256: `fd6f73544fbd6153c077a302a275b7d893cee4e49104d7140ca7153b2a49eadc`.

La política final mantiene pitch y tempo intactos, sin EQ; gain-only cuando basta y limitador lookahead solo cuando el ceiling de -1 dBFS impide alcanzar -16.5 LUFS.

Siguiente gate: recibir/verificar `SABIK_AUDIO_LIBRARY_R01_FINAL.zip`, registrar los hashes de modelos incluidos en su manifest y preparar handoff de integración A2. No publicar masters humanos ni modelos entrenados en GitHub público.

## Sabik · audio fijo ES/EN · muestra HUMAN QA PASS · 27/09/2026

**Estado: `SABIK_AUDIO_R01_SAMPLE_QA_PASS_FINALIZE_TIMING_NEXT`.**

Muestra de 10 WAV (5 EN + 5 ES) revisada tras síntesis con los modelos finales y política de loudness:
- 0 clipping en los 10;
- loudness integrado: EN ≈ -16.50 a -16.70 LUFS; ES ≈ -16.50 a -17.26 LUFS por techo de pico;
- picos entre -1.00 y -2.48 dBFS;
- identidad/timbre estables y volumen de escucha aprobado.

Único ajuste de postproceso antes de congelar la biblioteca: retirar silencio inicial/final excesivo conservando padding breve. En la muestra, varios EN traen ≈0.31–0.68 s de silencio inicial y ES welcome ≈0.51 s. No es un problema de voz ni exige reentrenamiento.

Siguiente gate: finalización máquina de los 30 WAV con trim de silencio + renormalización gain-only a -16.5 LUFS / pico ≤ -1 dBFS, actualización de hashes/manifests y empaquetado final.

## R48 · Claude · Intereses definitivos · 27/09/2026

**Estado: `R48_CLAUDE_INTERESES_ORDERED`.**

Auditoría de A4 R42 confirma que las 72 temáticas son válidas, pero la arquitectura actual es incoherente: 20 objetivos “todo/todos/todas”, 11 firmas de modos repetidas para 72 temas, canvas procedural genérico usado como experiencia profunda, Design R02 ausente y child-safe sin implementación técnica.

R48 conserva 72/72 y 11 grupos, pero cada interés recibe un contrato propio: pregunta central, acción, renderer, subset/query, profundidad, must_not_load, map_role y child-safe. Regla: fuente de datos != alcance de experiencia.

Mapas solo cuando la localización responde a la pregunta. NASA/GBIF/Wikidata/Met/Natural Earth se consultan de forma focalizada, no como dump universal.

A4 pasa a DONOR_NOT_FINAL. Claude construye → Astra revisa → A2 integra → María HUMAN QA.


## R46 · corrección Paisajes · YouTube embebido, no Pexels · 27/09/2026

**Estado: `R46_CLAUDE_RINCON_YOUTUBE_LANDSCAPES_ADOPTED`.**

María rechaza Pexels/montajes de tomas como fuente principal del Rincón. R46 #307 se corrige para usar preferentemente vídeos largos embebibles de YouTube siguiendo el patrón existente de Videoteca: `youtube-nocookie.com`, iframe solo tras acción, poster local, vídeo silenciado y audio Iris Green separado.

Criterio visual: 30–60+ min, ideal ≥1 h, un único entorno, cámara fija o casi fija, sin montaje turístico, dron, pans/zooms repetidos ni cortes frecuentes. No descargar/rippear/rehostear YouTube.

YouTube puede mostrar anuncios incluso en embeds; cada candidato requiere QA real 20–30 min en sesión limpia/no logueada desktop+móvil. Anuncio/promoción/interrupción = REJECT_CANDIDATE. Pexels no vuelve como fallback automático.


## R47 · Claude · Taller definitivo · 27/09/2026

**Estado: `R47_CLAUDE_TALLER_ORDERED`.**

Auditoría de los paquetes R43/R44 aportados por María confirma:
- 27 estudios visibles, pero 13 R43 + Dibujo piloto + 13 legacy;
- workspace-first incumplido por hero/instrucciones antes de la herramienta;
- Design R02 no integrado;
- child-safe no integrado;
- etapa de vida presente, pero no equivale a child-safe;
- persistencia local documentada de forma contradictoria.

Issue #308 reconstruye 27/27 bajo una sola arquitectura: cinco perfiles de workbench, workspace primero, Estructura + Inspector ligados al proyecto, mobile con bottom dock/sheets, Design R02 100 %, SAFE_BY_DEFAULT y registro child-safe con 0 items discoverables sin clasificar.

R43 v2 y PR #299 son donantes, no solución final. R44 queda separado.

Claude construye → Astra audita → A2 integra → María HUMAN QA. No main/producción/deploy propio.


## Sabik · copy producción R02 refrescado · 27/09/2026

**Estado: `SABIK_COPY_PRODUCCION_R02_AUDIO_CANDIDATE_NEXT`.**

Inventario fijo refrescado contra PR #244 HEAD `bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`: 40 registros, 25 KEEP, 15 REVISED, 0 HOLD. El antiguo HOLD “Bajar intensidad” queda resuelto por código actual: el control fuerza `SIN_MOVIMIENTO`, por lo que el copy revisado pasa a “Desactivar movimiento / Turn off motion”.

Locución propia de Sabik: 15 registros (10 SYSTEM_VOICE + 5 SYSTEM_VOICE_OPTIONAL). Siguiente gate: canonizar hashes locales de modelos finales y generar 30 WAV ES/EN con normalización -16.5 LUFS para HUMAN QA.

## Sabik · ES E0 cerrado + normalización de loudness aprobada · 27/09/2026

**Estado: `SABIK_VOICES_EN_ES_FINAL_LOUDNESS_POLICY_APPROVED`.**

Cierre de voces:
- EN vigente: `SABIK_EN_R02_EXACT_VALIDATED_FINAL`.
- ES vigente: `SABIK_ES_V1 = checkpoint-epoch-0`; E2 queda como alternativo técnico.
- No reentrenar por volumen: el problema de “voz lejana” era de nivel de salida, no de identidad/timbre.

Política de audio aprobada por María tras escucha A/B:
- normalización post-síntesis a **-16.5 LUFS integrados**;
- pico máximo objetivo **≤ -1 dBFS**;
- sin cambio de pitch, velocidad ni timbre;
- sin compresión/EQ como requisito por defecto;
- aplicar a toda `SABIK_AUDIO_LIBRARY` ES/EN.

Pruebas aprobadas:
- EN: -20.93 → -16.50 LUFS, pico final -1.20 dBFS.
- ES: -20.16 → -16.50 LUFS, pico final -1.52 dBFS.

Siguiente fase: cerrar hashes/manifests de ES y retomar `SABIK_COPY_PRODUCCION` + `SABIK_AUDIO_LIBRARY`.

## R39 · A9 Biblioteca Cloud de Sabik · 27/09/2026

**Estado: `R39_A9_SABIK_CLOUD_LIBRARY_READY_FOR_ASTRA`.**

A9 completó #306 sobre R38/R39/R06 sin modificar los 4.332 fragmentos sellados de R38. Candidato Cloud: HEAD `f4d89076b13cc3103bbcf41bbe7dd88718cb9bf0`, tree `a5a5f94fb8cfc5941cdf56e2ae0f2d6b2145f922`; CI `36327674236` SUCCESS (203/203). Biblioteca A9 `sabik-es-en-20260927-r01-a582b153c173`: 1.208 fragmentos, 604 ES + 604 EN, SHA-256 `2a36db04dabd04d5fabdf5e7fc79db9509ebd8657f3daa9dd9886a75d9540da8`, 30 full S2 + 30 safe variants. Seguridad aplicada antes de ranking; adult full S2 solo con intención explícita.

Deploy privado `6ab92e91a3cdab71e281a975` en `sabik-asistente`, `deploy-preview`, `published_at=null`, Team Login all intacto, Node24. Sellado/readback remoto PASS; cold Blobs 339,12 ms. HTTP real sin sesión humana llega al gate Team Login (401); **no** se declara HTTP de aplicación autenticado. C17/retención plataforma sigue PENDING. No producción, DNS, secretos, frontend ni voz.

Registro: `MEMORIA/R39_A9_BIBLIOTECA_CLOUD_20260927.md` y `CONTROL/DELTA_R39_A9_BIBLIOTECA_CLOUD_20260927.json`.

## R46 · Claude · Rincón tranquilo definitivo · 27/09/2026

**Estado: `R46_CLAUDE_RINCON_ORDERED`.**

Issue #307 sustituye como orden de producto vigente del Rincón la interpretación anterior de tres bloques. Nueva arquitectura: **Respirar · Paisajes · Inmersivo**. El audio propio Iris Green se reutiliza dentro de Paisajes/Inmersivo y deja de ser modo principal.

Paisajes: objetivo 20–30 min por experiencia, presets 10/20/30/60 + continuo. No se aceptan loops perceptibles de 1–2 min. Fuente larga o programa multi-segmento con transiciones suaves.

Inmersivo: cinco salas iniciales con progressive enhancement WebGPU/WGSL → WebGL2 → Canvas → estático. Sin cámara/micrófono/geolocalización/tracking/permisos nuevos. PR #300 se conserva; fixes #303 obligatorios.

Claude construye → Astra revisa → A2 integra → María HUMAN QA. No main/producción/deploy propio.


## Sabik · EN R02 exacto validado contra V6_12_T01 · 27/09/2026

**Estado: `SABIK_EN_R02_EXACT_VALIDATED_FINAL`.**

Se reentrena EN usando como referencia ICL exacta `SABIK_EN_V6_12_T01.wav` y se compara el checkpoint R02 de una época contra esa referencia con la misma frase y seed.

Comparación:
- referencia: 6.00 s, F0 mediana ≈209.9 Hz;
- R02 exacto: 5.68 s, F0 mediana ≈201.6 Hz;
- diferencia tonal ≈-0.7 semitonos;
- centroide espectral mediano: referencia ≈1294 Hz, R02 ≈1181 Hz;
- similitud MFCC alineada media ≈0.9938;
- mejora clara frente al E0 anterior en brillo/espectro; identidad y timbre se consideran suficientemente conservados.

Audio de validación: `SABIK_EN_R02_EXACT_COMPARE_V6_12_T01.wav`, SHA-256 `510ee516ce074993a7f4608c0ab174ba7f3e899ac02a4a43dcdbcae575569181`.

Decisión: cerrar EN R02 como voz inglesa entrenada vigente. No reabrir búsqueda ni entrenamiento EN salvo nueva evidencia de producción.

## Nuevos carriles paralelos · Home child-safe + Cloud Sabik · 27/09/2026

**A8:** `R42_A8_HOME_CHILD_SAFE_ORDERED` · issue #305.  
Construirá la nueva interfaz de Home e implantará child-safe real sobre el baseline vigente R42/R02. A2 integra; María valida. #294–#297 permanecen históricos/pausados.

**A9:** `R39_A9_SABIK_CLOUD_LIBRARY_ORDERED` · issue #306.  
Construirá la biblioteca Cloud Sabik bilingüe, versionada y child-safe sobre R38/R39/R06, reutilizando el acceso existente y sin sobrescribir R38. Candidato privado autorizado en `sabik-asistente`; no producción.

**Voz:** continúa entrenándose en carril separado y queda fuera de A8/A9.

Orden emitida != ejecución acreditada; esperar marcadores de lectura/construcción y evidencia.


## Sabik · EN E0 comparado contra referencia exacta V6_12_T01 · 27/09/2026

**Estado: `SABIK_EN_E0_NOT_FINAL_RETRAIN_EXACT_REFERENCE_REQUIRED`.**

Comparación controlada de `SABIK_EN_V1` (E0) contra la referencia exacta elegida `SABIK_EN_V6_12_T01.wav`, misma frase y seed 13001:
- referencia exacta: 6.00 s, F0 mediana ≈209.9 Hz;
- E0: 5.84 s, F0 mediana ≈214.8 Hz;
- diferencia de F0 ≈+0.4 semitonos;
- centroide espectral E0 ≈19.4 % más alto (voz más brillante);
- similitud MFCC media ≈0.987;
- como control, V6_11 sobre la misma frase queda más cerca de V6_12 (≈0.997).

Conclusión: E0 conserva la misma familia/identidad, pero no replica con suficiente fidelidad el matiz exacto de V6_12_T01. Se revoca el cierre de E0 como final. Rehacer **solo** corpus/entrenamiento EN usando V6_12_T01 como referencia ICL exacta. No repetir búsqueda de voz, V4/V6 ni trabajo ES.

## Sabik · referencias vocales exactas confirmadas por María · 27/09/2026

**Estado: `SABIK_VOICE_EXACT_REFERENCES_CONFIRMED`.**

María confirma como referencias exactas de las voces elegidas:
- EN: `SABIK_EN_V6_12_T01.wav` · 24 kHz · 6.00 s · SHA-256 `8dabd1ceb126201822d0ccc431bf5087fb276aa49061945d3a37c23ea1be100b`.
- ES: `SABIK_ES_LONG_REF.wav` / `SABIK_ES_MASTER_V1.wav` · 44.1 kHz · 27.00 s · SHA-256 `c9d18290375d46608d37f65b05788ef552980706161a0eb0e26e2a268059c8fa`.

Corrección de trazabilidad: la elección humana final EN se hizo sobre la familia V6_12 y esta muestra T01 queda como referencia auditiva exacta de identidad. El V4_12 seed 9112 es la referencia padre usada para generar V6_12 y no debe confundirse con el clip exacto que María señala ahora como voz elegida.

No alterar ni sustituir estas dos referencias canónicas. Antes de cualquier nueva fase EN, comparar el modelo entrenado con la referencia exacta V6_12_T01.

## Sabik · QC muestra ES PASS + ref SFT 24 kHz requerida · 27/09/2026

**Estado: `SABIK_ES_REVIEW_QC_PASS_REF24K_PREFLIGHT_NEXT`.**

Muestra estratificada ES de 12 clips (001, 012, 024, 036, 048, 060, 072, 084, 096, 108, 120, 133) revisada:
- 12/12 a 24 kHz;
- clipping: 0;
- RMS medio ≈ -18.55 dB, desviación ≈ 0.38 dB;
- F0 mediana de la muestra ≈ 150.6 Hz; master ES ≈ 147.6 Hz;
- sin tendencia de deriva tonal apreciable a lo largo del corpus;
- similitud cepstral alta frente al master en toda la muestra; ninguna pieza exige descarte.

Antes de SFT se detecta requisito del dataset oficial: `ref_audio` debe estar a 24 kHz. El master canónico ES se conserva intacto a 44.1 kHz; para entrenamiento se creará `SABIK_ES_MASTER_V1_TRAIN_24K.wav` y se actualizará únicamente el campo `ref_audio` en los JSONL, con backups. Después: worst-case preflight sobre las 4 secuencias más largas.

## Sabik · ES audio codes completos · 27/09/2026

**Estado: `SABIK_ES_CODES_133_PASS_REVIEW_NEXT`.**

Preparación segura de audio codes completada para `SABIK_ES_TRAIN_V1`: 133/133 filas, batch efectivo 1, UTF-8 explícito, `train_with_codes.jsonl` generado correctamente y muestra estratificada de 12 WAV creada en `SABIK_ES_TRAIN_V1\REVIEW`. La ejecución terminó con ≈13.82 GiB de VRAM libre.

Siguiente gate: revisión humana/técnica de los 12 WAV antes de preflight SFT ES.

## Sabik · EN V1 canonizado + corpus ES auditado · 27/09/2026

**Estado: `SABIK_EN_V1_CANONICAL_ES_CORPUS_AUDITED_PREPARE_CODES_NEXT`.**

EN:
- `SABIK_EN_V1` canonizado desde `checkpoint-epoch-0`;
- `model.safetensors` SHA-256: `0346413f078b5f0f982974a35641fa3713bad13a71e9bf3237682acb5641e062`;
- `config.json` SHA-256: `6ac9cbf2727344d18fbb4d66ea8274b675f64a14b0737e9e28801181e96c0abd`;
- manifest local: `SABIK_EN_V1_MANIFEST.json`;
- E2 se conserva como checkpoint alternativo.

ES:
- master `SABIK_ES_MASTER_V1.wav`: presente;
- corpus `SABIK_ES_TRAIN_V1`: 133 WAV, 22.56 min, 0 WAV con error;
- `train_raw.jsonl`: 133 líneas;
- `manifest.csv`: presente;
- `train_with_codes.jsonl`: aún no generado;
- `summary.json`: no presente.

Siguiente gate: verificar unicidad de `ref_audio`/rutas del JSONL ES y generar `train_with_codes.jsonl` antes de SFT ES.

## Sabik · checkpoint EN final seleccionado · 27/09/2026

**Estado: `SABIK_EN_V1_CHECKPOINT_E0_SELECTED_CANONICALIZE_NEXT`.**

Comparación de 18 WAV inéditos (6 frases × E0/E1/E2) completada. Selección final:
- **E0 = checkpoint-epoch-0 → SABIK_EN_V1**;
- E2 queda como checkpoint alternativo conservado;
- E1 descartado frente a E0/E2.

Criterios: timbre más cercano al master EN V2, naturalidad, estabilidad de identidad y ritmo. Siguiente gate: copiar E0 a carpeta canónica `SABIK_EN_V1`, calcular hashes/manifest y auditar el corpus ES antes del fine-tuning español.

## Sabik · EN V1 checkpoint final seleccionado · 27/09/2026

**Estado: `SABIK_EN_V1_CHECKPOINT_E0_SELECTED_ES_TRAINING_NEXT`.**

Tras la validación ciega/controlada de 18 WAV inéditos (6 frases × E0/E1/E2), se selecciona `checkpoint-epoch-0` como modelo EN definitivo. Orden final de preferencia: **E0 > E2 > E1**. E2 se conserva como alternativo técnico y no se borra.

Siguiente fase: canonizar `checkpoint-epoch-0` como `SABIK_EN_V1`, registrar hashes locales y pasar al fine-tuning español. No retomar todavía `SABIK_COPY_PRODUCCION` ni `SABIK_AUDIO_LIBRARY`.

## Sabik · SFT EN worst-case preflight PASS · 27/09/2026

**Estado: `SABIK_EN_SFT_WORSTCASE_PASS_FULL_TRAIN_READY`.**

Segundo preflight ejecutado con las 4 muestras de mayor longitud del corpus (81, 76, 71 y 69 audio-code frames), batch 1, acumulación 4, bf16 y SDPA. Pérdidas finitas: 1.5488 / 1.6373 / 1.5973 / 1.5710. Pico CUDA observado: allocated final 10.78 GiB, reserved 18.19 GiB, peak allocated 17.93 GiB. No OOM.

Resultado: el peor caso de longitud pasa un optimizer step real. Se autoriza entrenamiento completo EN con configuración conservadora: batch 1, gradient accumulation 4, lr 2e-6, 3 épocas, checkpoints por época. Evaluar checkpoints antes de fijar modelo final.

## Sabik · SFT EN preflight real PASS con memoria ajustada · 27/09/2026

**Estado: `SABIK_EN_SFT_PREFLIGHT_PASS_MEMORY_TIGHT_WORSTCASE_NEXT`.**

Preflight real ejecutado con `sft_sabik_12hz.py`: batch 1, acumulación 4, bf16, SDPA, 1 optimizer step completo. Pérdidas finitas: 1.6352 / 1.5468 / 1.9357 / 1.8812. Pico CUDA observado: allocated final 10.77 GiB, reserved 18.22 GiB, peak allocated 17.92 GiB. No OOM.

Los avisos SoX, TensorBoard no instalado y `torch_dtype` deprecado no bloquearon el preflight. Por el pico alto no se lanza aún entrenamiento completo: siguiente gate = repetir un optimizer step con los 4 ejemplos de mayor longitud del corpus para validar el peor caso de memoria.

## Sabik · EN audio codes completos · 27/09/2026

**Estado: `SABIK_EN_TRAIN_V1_CODES_READY_SFT_PREFLIGHT_NEXT`.**

`train_with_codes.jsonl` generado correctamente con **160/160** registros mediante el tokenizer oficial Qwen3-TTS 12Hz. Los avisos de symlinks/Xet de Hugging Face no bloquearon la preparación.

Siguiente gate: aplicar el patch local R01 (alineación talker/sub-talker + SDPA), ejecutar **1 optimizer step de preflight sin guardar checkpoint**, medir pico real de VRAM en la RTX 5000 Ada 16 GB y solo después autorizar entrenamiento completo.

## Sabik · corpus EN V1 · QC muestra PASS · 27/09/2026

**Estado: `SABIK_EN_TRAIN_V1_SAMPLE_QC_PASS_PREPARE_CODES_NEXT`.**

Corpus inglés generado completo: 160 clips / 10.36 min. Muestra estratificada 12/12 revisada sin clipping ni deriva acústica progresiva; F0 mediana de muestra ≈193 Hz y ritmo mediano ≈173 ppm. Siguiente gate: extracción de `audio_codes` y preparación de `train_with_codes.jsonl`.

Nota técnica vigente: no lanzar aún el `sft_12hz.py` stock sin resolver los problemas abiertos de alineación de pérdida y el hard-code de FlashAttention2 observados en upstream Qwen3-TTS al 27/09/2026.

## Sabik · master inglés V2 seleccionado · 27/09/2026

**Estado: `SABIK_EN_MASTER_V2_SELECTED_TRAINING_NEXT`.**

María selecciona definitivamente la candidata **12 · seed 9112** tras la comparación V4/V6. Nuevo master canónico:
- `SABIK_EN_MASTER_V2.wav` = copia de `SABIK_EN_REG_V4_12_seed9112.wav`;
- SHA-256 `c5f666cf090d71d81240f6ab0dd514a2da5af082d311cbbcf79dbd2b05794ede`;
- referencia ralentizada 0.88: DESCARTADA por sonido robótico;
- siguiente fase: generar `SABIK_EN_TRAIN_V1`, revisar muestra y hacer fine-tuning EN antes de volver a copy/audio de producción.

## Sabik EN · master V2 seleccionado · 27/09/2026

**Estado: `SABIK_EN_MASTER_V2_SELECTED`.**

María selecciona la candidata **12 · seed 9112** como master inglés definitivo de referencia:
- origen: `SABIK_EN_REG_V4_12_seed9112.wav`;
- nombre canónico local: `SABIK_EN_MASTER_V2.wav`;
- SHA-256: `c5f666cf090d71d81240f6ab0dd514a2da5af082d311cbbcf79dbd2b05794ede`.

La decisión llega tras comparación de 12 generaciones naturales, finalistas conjuntas 02/06/08/10/11/12 y prueba ICL con textos nuevos. La V2 ralentizada queda descartada por sonido robótico.

Texto exacto de referencia ICL:
`Hello. I'm Sabik. I can help you find the information you need. We can go step by step. If something isn't clear, I can explain it in a different way.`

Siguiente gate: generar `SABIK_EN_TRAIN_V1` (160 clips), revisar muestra y ejecutar fine-tuning single-speaker Qwen3-TTS. No volver a copy/audio de producción hasta cerrar primero entrenamiento EN y ES.

Memoria: `MEMORIA/SABIK_EN_MASTER_V2_SELECTION_R01_20260927.md`.  
Control: `CONTROL/DELTA_SABIK_EN_MASTER_V2_SELECTION_R01_20260927.json`.

No publicar master/corpus en GitHub · no producción.

## Sabik · COPY PRODUCCIÓN ES/EN R01 · 27/09/2026

**Estado: `SABIK_COPY_PRODUCCION_R01_EXTRACTED_REVIEWED_PENDING_MARIA`.**

Se audita el copy fijo de Sabik sobre PR #244 HEAD `e8cad400a30d5d4857f9f99b0c1070d786958a8b` sin tocar la rama A2. Inventario R01: **40 registros**; 25 KEEP, 14 REVISED y 1 HOLD. Se separan expresamente locución de sistema, UI, anuncios de lector de pantalla y copy opcional.

Regla vigente: `CORPUS_ENTRENAMIENTO_VOZ` no es copy publicable. `SABIK_AUDIO_LIBRARY` solo podrá generarse desde `SABIK_COPY_PRODUCCION` aprobado o desde contenido editorial canónico de la web con ID, versión y hash. Se excluye antropomorfismo emocional y cualquier inferencia no expresada por la persona.

Queda SUPERSEDIDA la arquitectura de voz/proveedor de `MEMORIA/SABIK_BIBLIOTECA_NARRADA_ES_EN_R01_20260925.md`; se conserva solo como historia. La extracción textual de 25/09 sigue siendo evidencia del HEAD histórico, no catálogo final post-R42.

Registros:
- `MEMORIA/SABIK_COPY_PRODUCCION_R01_20260927.md`
- `CONTROL/SABIK_COPY_PRODUCCION_R01_20260927.csv`
- `CONTROL/SABIK_COPY_PRODUCCION_R01_20260927.json`
- `NORMATIVA/ADDENDUM_SABIK_COPY_PRODUCCION_R01_20260927.md`

Siguiente gate: revisión humana de María del copy revisado; después extracción completa sobre un HEAD A2 congelado post-R42 y generación versionada de audio ES/EN.

No audio generado · no deploy · no main · no modificación de producto.

## Sabik · voz definitiva ES/EN + procedencia registrada · 27/09/2026

**Estado: `SABIK_VOICE_MASTERS_ES_EN_APPROVED_PROVENANCE_REGISTERED`.**

María ha cerrado la búsqueda de voz. Sabik queda con una misma identidad vocal y dos masters lingüísticos separados:
- EN: `SABIK_EN_MASTER_RETEST_01.wav` · SHA-256 `fe58b4af6e89fd15fd631945a8fedfe0b14a225a0dc1689703311d47db412285`;
- ES: `SABIK_ES_MASTER_V1.wav` = copia canónica de `SABIK_ES_LONG_REF.wav` · SHA-256 `c9d18290375d46608d37f65b05788ef552980706161a0eb0e26e2a268059c8fa`.

La fuente humana se registra como voz propia de la titular del proyecto, aportada y autorizada por la propia hablante. Hash de la fuente humana `SABIK_SOURCE_MARIA.wav`: `6545fcad588db96c1d0bce1cd1f2c43cb8cda124627bcccd7fac6075c2dad770`. Los audios humanos y masters no se publican en GitHub.

Sabik ES se validó con Qwen3-TTS Base en ICL (`x_vector_only_mode=False`, idioma Spanish) y un banco de 20 frases variadas: **20/20 aprobadas por María**, manteniendo la misma mujer y español peninsular.

Quedan rechazadas para el master ES:
- OpenVoice como final, por artefactos robóticos;
- RVC EN→ES como arquitectura de español largo, por cambio de voz/acento inglés;
- los 135 outputs del corpus RVC español, que no deben entrenar el master final.

Gobernanza nueva:
- `CORPUS_ENTRENAMIENTO_VOZ` no es copy publicable;
- `SABIK_COPY_PRODUCCION` será la fuente canónica de frases propias del sistema, revisadas ES/EN;
- `SABIK_AUDIO_LIBRARY` se generará solo desde copy aprobado;
- lenguaje de producción sin antropomorfismo emocional ni suposiciones sobre el estado del usuario.

Memoria: `MEMORIA/SABIK_VOZ_MASTERS_ES_EN_PROCEDENCIA_R01_20260927.md`.  
Declaración de procedencia/autorización: `NORMATIVA/DECLARACION_PROCEDENCIA_AUTORIZACION_VOZ_SABIK_R01_20260927.md`.  
Control: `CONTROL/DELTA_SABIK_VOZ_MASTERS_ES_EN_R01_20260927.json`.  
Sync: `CONTROL/CONTROL_MASTER_SYNC_DELTA_SABIK_VOZ_MASTERS_ES_EN_R01_20260927.csv`.  
Evidencia pública sin audio: `EVIDENCIAS/SABIK_VOZ_MASTERS_ES_EN_R01_20260927/`.

## R42 · Agente 1 · Recursos/Juegos/Rutinas por etapas + tecnología · 26/09/2026

**Estado: `R42_A1_LIFE_STAGE_TECH_READY_FOR_A2`.**

PR #298 está READY FOR REVIEW y mergeable sobre A2. HEAD final: `8f68609852ed83d4cf846c0390931b74c18d4cdb`.

A1 amplió el addendum de etapas a una arquitectura tecnológica coherente en todo su carril: Recursos, Juegos, Rutinas imprimibles, Rutinas visuales y Tarjeta Iris. Se usan progressive enhancements actuales (View Transitions, Popover, CSS Anchor Positioning, Container Queries, `content-visibility`, `requestAnimationFrame`) con fallback, reduced motion, forced colors, teclado y foco. No se solicita ni persiste DOB, diagnóstico o perfil de etapa.

QA final del mismo HEAD:
- `Comprobar rutinas visuales` run `36253137816`: SUCCESS.
- `Recursos actuales ES y EN` run `36253137789`: SUCCESS.
- build + navegador ES/EN 1440/320: SUCCESS dentro del gate.

Siguiente puerta: A2 integra #298 en su HEAD vigente y publica preview; HUMAN QA de María sigue siendo obligatoria antes de aceptación perceptiva final.

Registro: `MEMORIA/R42_A1_LIFE_STAGE_TECH_20260926.md` y `CONTROL/DELTA_R42_A1_LIFE_STAGE_TECH_20260926.json`.

A1: **0 merge · 0 deploy · 0 producción**.

---

## R42 · Agente 3 · app shell interactivo terminado y listo para A2 · 26/09/2026

**Estado: `R42_A3_APP_SHELL_BUILD_READY_FOR_A2`.**

A3 ha cerrado #284 en su alcance técnico sobre la base A2 exacta `574356cba3b73dc8477a625d2c6311008260a2d6`, conservando la investigación Web Platform 2026 como criterio de construcción.

Entrega final:
- rama `agent3/r42-app-shell-20260926`;
- HEAD `c9e5c002d65a9efc872e56b18230a6cf08701c31`;
- tree `bbc44f1dbf7682eb2ea17b9c85d3f79a27869f69`;
- PR #290 Ready for review y mergeable;
- 7 archivos; ningún archivo propio de A1/A4/A5/A7 modificado;
- topbar, workspace, rail APG, inspector, command/actions, ayuda, estado y mobile dock/sheet;
- Dibujo: lienzo primero, Retos/propiedades en inspector y Archivo agrupado;
- tecnología progresiva: `@layer`, Container Queries, dialog/Popover, View Transitions con reduced motion, anchor positioning con fallback, forced-colors y prefers-contrast;
- shell transversal/no infantilizante conforme al addendum de etapas, sin exigir diagnóstico ni selección de edad.

QA final sobre el mismo HEAD:
- build 2.195 archivos;
- contrato R42 PASS;
- workflow navegador `36243762051`: SUCCESS;
- 26/26 casos PASS;
- 24 capturas;
- 1440×900, 390×844 y 320×800;
- 0 overflow horizontal en todos los casos;
- Dibujo sin clipping de Retos ni columna vacía;
- móvil sin workspace comprimido;
- Escape/foco y toolbar APG comprobados.

Artefacto: `r42-a3-browser-qa` ID `10906127952`.

A3 inspeccionó capturas representativas finales. Esto no sustituye la HUMAN QA de María ni acredita conformidad global.

Siguiente gate obligatorio: A2 (#289), única puerta a la web, integra #290 con los demás handoffs R42, publica una única preview y devuelve HEAD/tree/deploy/URL. María realiza HUMAN QA sobre esa web antes de cualquier propagación global.

Registros:
- `MEMORIA/R42_A3_TECH_UX_RESEARCH_GATE_20260926.md`
- `MEMORIA/R42_A3_APP_SHELL_ENTREGA_20260926.md`
- `EVIDENCIAS/R42_A3_APP_SHELL_20260926/README.md`
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

## R63 · Claude · Rincón · Sakura · 29/09/2026

**Estado: `R63_CLAUDE_RINCON_SAKURA_CANDIDATE_ORDERED`.**

Issue operativo: **#328**.

La reselección de salas sensoriales ordenada por María el 29/09 sustituye la dirección anterior de Globos en lo que contradiga R63:
- Mundo de globos de luz queda retirado del catálogo/generador;
- Sakura ya existe como prototipo y pasa a cierre reproducible, no a reconstrucción desde capturas;
- Jardín de luz, Papel y viento, Dentro de una nube y Respiración del espacio quedan congeladas;
- Faroles flotantes, Lluvia de luz, Agua y reflejos y Bosque bioluminiscente siguen HOLD hasta HUMAN QA de Sakura;
- R61 Pecera #325 continúa independiente.

Auditoría de entrada:
- A2 PR #244 observado en `9800661d7b7a085acaf593d9f432b2ec426151b8`, pero Claude debe releer el HEAD vivo al arrancar;
- A2 y main están divergidos: no usar main como sustituto ni resetear la web;
- hoja global canónica A2: `assets/ig-global-ui-tokens-2026.css`;
- PR #303 continúa open/draft/no merged y sus dos fixes no están en el runtime A2 actual;
- no se localizó un handoff físico de código Sakura en GitHub/Library, solo memoria y evidencia visual.

Gate de fuente:
si no aparece el código exacto del prototipo, emitir
`R63_SAKURA_SOURCE_ARTIFACT_MISSING_BLOCKED`
y STOP; prohibido recrear Sakura desde screenshots o concept art.

R63 exige source exacto + branch/HEAD/tree + PR draft A2 + ES/EN + 1440/390 + NORMAL/REDUCED/NO_MOTION + fallbacks reales + low-stimulation + tokens globales + taxonomía AGE_* + 0 autoplay + fixes #303 + evidencia/performance.

Marcador Claude:
`R63_CLAUDE_SAKURA_REPRODUCIBLE_READY_FOR_ASTRA`.

Solo María, tras Deploy Preview, puede emitir:
`R63_SAKURA_HUMAN_APPROVED_UNLOCK_NEXT_ROOM`.

Orden: `ORDENES/R63_CLAUDE_RINCON_SAKURA/01_CLAUDE.md`.  
Normativa: `NORMATIVA/ADDENDUM_R63_RINCON_SAKURA_20260929.md`.  
Memoria: `MEMORIA/R63_RINCON_SAKURA_20260929.md`.  
Control: `CONTROL/DELTA_R63_RINCON_SAKURA_20260929.json`.

No main. No producción. No deploy propio.

## 29/09/2026 · R61 / R63 / R64 · cierre de órdenes, memoria y control

### R61 · Pecera ilustrada
Estado: `R61_PECERA_ILLUSTRATED_DIRECTION_PASS_CONTINUE`.

El donor original fija el lenguaje visual: ilustración plana, nítida, saturada y legible. Se descarta la simulación física submarina como dirección principal. Próxima entrega: vídeo ≈10 min, cámara fija, audio first-party exclusivo, NORMAL/REDUCIDO/SIN_MOVIMIENTO, responsive y performance real o `PENDING_HARDWARE_QA`.

Marcador: `R61_PECERA_10MIN_ILLUSTRATED_AV_READY_FOR_ASTRA_MARIA`.

Orden: `ORDENES/R61_CLAUDE_RINCON_PECERA/02_CLAUDE_VIDEO_FINAL_ILUSTRADO.md`.
Control: `CONTROL_MASTER_SYNC_DELTA_R61_PECERA_ILUSTRADA_VIDEO_20260929.csv`.

### R63 · Sakura
Estado: `R63_SAKURA_VISUAL_REFERENCE_APPROVED`.

La referencia aprobada es una sala sensorial circular, misma arquitectura en DARK NAVY y LIGHT. La floración principal pasa a masters first-party coordinados `SAKURA_CANOPY_NAVY` / `SAKURA_CANOPY_LIGHT`; runtime procedural solo para pétalos, luz, reflejos, gobos y partículas.

Marcador: `R63_SAKURA_VISUAL_REFERENCE_INTEGRATED_READY_FOR_ASTRA`.

Orden: `ORDENES/R63_CLAUDE_RINCON_SAKURA/02_CLAUDE_REFERENCIA_VISUAL_SALA.md`.
Control: `CONTROL_MASTER_SYNC_DELTA_R63_SAKURA_VISUAL_20260929.csv`.

### R64 · A2 · Taller R54
Issue: #329.
Estado: `R64_A2_6_CARDS_INTEGRATION_ORDERED`.

Handoff R54 R2 verificado. Arte KEEP 6/6. María autoriza integración y Deploy Preview, NO aceptación final. A2 reconcilia sobre HEAD vivo, conserva Home/header actuales, usa una sola hoja global de tokens, aplica taxonomía AGE_* con compatibilidad legacy temporal y repite QA.

Marcador: `R64_A2_6_CARDS_DEPLOY_PREVIEW_READY_FOR_MARIA`.

Orden: `ORDENES/R64_A2_R54_6_CARDS_PREVIEW/01_AGENTE_2.md`.
Control: `CONTROL_MASTER_SYNC_DELTA_R64_A2_R54_6_CARDS_20260929.csv`.

### Normativa

Ninguna de estas tres órdenes introduce una regla transversal nueva. Se consumen las normas globales vigentes de visual premium, taxonomía de edad, baja estimulación, tokens, R42/R02 y marco WCAG/ISO/EN/COGA. Por tanto NO se abre un addendum normativo artificial para cambios de producto locales.

## R65 · Claude · Taller · 21 tarjetas + 9 AGE_0_12 · 29/09/2026

Issue: #330  
Estado: `R65_WAIT_HUMAN_QA_R64`.

R65 queda preparado pero BLOQUEADO hasta que María revise la Deploy Preview de R64/#329 y emita:

`R64_TALLER_6_CARDS_HUMAN_APPROVED_FINAL_UNLOCK_R65`

Tras desbloqueo:
- KEEP 6/6 pilotos;
- construir exactamente 21 tarjetas restantes;
- construir las 9 variantes AGE_0_12 ya congeladas en R54;
- no redefinir esas 9;
- si no existe una lista canónica única, STOP con `R65_AGE_0_12_VARIANT_SET_NOT_CANONICAL_BLOCKED`;
- trabajar en 7 tandas de 3 estudios;
- mantener target E4 premium 2026;
- mantener pipeline reproducible AVIF/WebP 1x/2x + hashes + render_config_sha256 + build-strict;
- no tocar interiores/starters todavía.

Marcador de entrega:
`R65_CLAUDE_TALLER_21_PLUS_9_READY_FOR_ASTRA`

Orden:
`ORDENES/R65_CLAUDE_TALLER_21_PLUS_9/01_CLAUDE.md`

Control:
`CONTROL_MASTER_SYNC_DELTA_R65_TALLER_21_PLUS_9_20260929.csv`

Normativa: no cambia; consume los canónicos globales vigentes.
