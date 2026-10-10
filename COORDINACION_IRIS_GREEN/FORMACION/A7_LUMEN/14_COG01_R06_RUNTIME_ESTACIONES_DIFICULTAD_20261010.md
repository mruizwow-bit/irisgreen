# LUMEN · EL CLARO ESCONDIDO · R06 JUGABLE

**Fecha:** 2026-10-10  
**Estado:** `COG01_R06_FUNCTIONAL_QA_PASS__NEXO_ART_PENDING__NO_WEB_RELEASE`  
**Alcance:** juego cognitivo 01, sin edades. Continuación de la mecánica R03 y los estudios R05/R06. No altera FARO original ni publica en Netlify.

## Entrega persistente

- Biblioteca: `/Iris Green/Handoffs/Lumen/IRIS_GREEN_COG01_EL_CLARO_ESCONDIDO_R06_JUGABLE.zip`
- ZIP SHA-256: `5c9ad558e3257fca23d3cb621ab9769faedd87ad4d5603299aa89d263b1661e7`
- `index.html`: juego autocontenido, ejecutable localmente, sin CDN ni fetch.
- Fuentes incluidas: `index_source.html`, `game.js`, `style.css`, `assets/catalog.js`, 2 JSON de contornos, README, brief de integración, QA y screenshots.
- Capturas desde Chromium en `320×800`, `390×844`, `1440×900` y experto/otoño escritorio.

## Funcionalidad realmente implementada

1. Modos manuales Suave (4 opciones), Media (6), Alta (8), Experta (9), Maestría (12 con dos modelos y tres respuestas); modo Automática separado con siete escalones.
2. La automática comienza con seis opciones y cambia **un eje por paso** (cantidad, similitud o rotación). Se aumenta tras dos aciertos a la primera sin ayuda y se reduce tras dos retos con errores repetidos o ayudas altas. No depende de edad ni cronómetros.
3. Estaciones: primavera, verano, otoño, invierno y mezcla. Paletas por familia botánica, con verdes, amarillos, naranjas, rojos y marrones. Perennes como acebo/hiedra pueden quedar verdes en invierno. La respuesta depende del contorno, no del color.
4. Selección múltiple corregible, revisión tras error, 3 pistas, modelos ampliables, opciones ampliables, pausa y reanudación.
5. Interfaz ES/EN con instrucciones cortas y acciones explícitas siguiendo ISO 24495-1 como pauta editorial. No se declara certificación normativa.
6. Native buttons, touch/teclado, foco, contraste, preferencias NORMAL/REDUCED/NONE. Sin cuenta, ranking ni telemetría. El seguimiento del desempeño reside exclusivamente en memoria volátil de la sesión.

## QA ejecutada (no inferida)

- Sintaxis JS: `node --check` PASS.
- `python qa/qa_r06.py`: **45/45 PASS**.
- `python qa/qa_extended.py`: **17/17 PASS**.
- **4000 conjuntos de retos** válidos comprobados por semillas across 5 dificultades × 5 estaciones.
- Casos: objetivos exactos (1/3), español/inglés, controles, zoom de candidatos, color estacional, modo experto, errores y recuperación de Maestría, 12 rondas y replay, high-contrast, movimiento y forced-colors activable.
- Chromium headless pruebas 320/390/1440; sin scroll horizontal y botones ≥44 px.
- Errores de ejecución JS observados: **0**.
- Sin peticiones externas HTTP(S). Archivo autónomo generado con catálogos embebidos.
- Integridad de ZIP verificada.
- La apertura vía `file://` está bloqueada **por política de este entorno de pruebas**, por eso el test usa `page.set_content` con el HTML autónomo; no se finge haber probado un teléfono físico.

## Importante · arte de Nexo

La usuaria mostró una lámina creada por Nexo con seis hojas ricamente ilustradas (lanceolada, ovada, obovada, cordada, palmada lobulada, pinnada lobulada) **solo para que Lumen la viese**. No se la ha copiado ni recortado como juego, ni se han supuesto masters individuales disponibles.

Los estímulos de esta R06 son **vectores geométricos temporales R05/R06**, claramente etiquetados como estudio. No representan el arte final ni sustituyen a Nexo. `ART_INTEGRATION.md` documenta un futuro adaptador de apariencia por forma y estación, condicionado a masters individuales y QA humanos.

## Bloqueos explícitos

- `VISUAL_HUMAN_QA_PENDING`: la pantalla técnica no demuestra calidad artística del canon Iris.
- `NEXO_MASTER_ASSETS_PENDING`: integrar cuando existan masters válidos, con identidad preservada.
- `PERCEPTUAL_VALIDATION_PENDING`: distractores con alto parecido geométrico pueden ser perceptivamente ambiguos.
- `REAL_TOUCH_QA_PENDING`: no se han probado dispositivos físicos.
- `NO_CLINICAL_CLAIM`: la práctica del juego no mide ni certifica capacidad cognitiva clínica.

**Gate:** `COG01_R06_FUNCTIONAL_QA_PASS__VISUAL_REWORK_PENDING`.

**No se ha tocado la web pública ni ejecutado despliegue.**
