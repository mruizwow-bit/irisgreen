# LUMEN · COGNITIVO 01 · INSPECCIÓN DE REFERENCIAS Y SILUETAS

Fecha: 10/10/2026
Estado: COGNITIVO_01_RESEARCH_VISUAL_COMPARISON_DONE__SILHOUETTES_NOT_APPROVED__GAME_UNMODIFIED

## Orden ejecutada
Revisar realmente las referencias de Iris Green/Faro y la legibilidad de máscaras de hojas antes de volver a generar arte. SIN crear otro diseño decorativo, SIN modificar la mecánica R03 y SIN clasificar usuarios por edad.

## Fuentes propias inspeccionadas
- Biblioteca Iris Green: `IRIS_GREEN_INFORME_VISUAL_FORMACION_2026-10-09.pdf` (184 páginas). Se extrajeron imágenes de referencia embebidas (NO los masters de repo): P31 portada pág. 70, P29 escritorio pág. 117, P30 móvil pág. 118, P65 mañana pág. 102, P66 mediodía pág. 103, Vera original pág. 21.
- Contraste con captura R03 aportada por usuaria y captura R04 generada en Chromium.
- Las referencias P29/P30/P31/P65 están etiquetadas como «aprobadas/definitivas según nombre del archivo». No se extrapola aceptación al juego cognitivo 01.
- Se confirmaron rutas GitHub `img/vineta-hoja.webp`, `img/taller-mesa-mirar.webp`, `img/j1-vera.webp`, `img/intereses/flores/`, pero el conector GitHub no permite binarios: **píxeles de esos archivos NO inspeccionados**; no inventar su procedencia ni reutilizabilidad.

## Diagnóstico
La isla Faro de P29/P30/P31/P65 se reconoce por geografía, materiales, escala, coherencia entre estados y función de los objetos. R03/R04 recurrían a árboles vectoriales repetitivos, tarjetas flotantes y paisaje intercambiable: VISUAL_REWORK_REQUIRED. Sustituir solo el bitmap del fondo no resuelve la dirección artística. No añadir mascota, pergaminos, brillos, flores decorativas, halos ni prompts «cozy forest».

## Comprobación de siluetas
Herramienta analítica `estudio_siluetas.py` (en paquete de trabajo, no en web pública): 10 contornos geométricos preliminares LS01-LS10; lámina en canvas de 44, 64 y 80 px; 45 pares comparados por IoU máximo al rotar de 0 a 330 grados cada 30 grados. **Las máscaras son de estudio, no ilustraciones definitivas ni morfología botánica certificada.**

Hallazgos:
| Máscaras | IoU máximo |
|---|---:|
| elíptica / serrada | 0,9338 |
| elíptica / ondulada | 0,9303 |
| serrada / ondulada | 0,9154 |
| ovada / obovada a 180 grados | 0,8725 |

NO usar estas parejas como distractores de distintas clases en tamaños pequeños hasta rediseñar/validar el contorno. Evitar también confundir lóbulos con estrellas radiales.

El botón de 44px NO garantiza que el dibujo sea legible: en el ensayo a canvas de 44px la hoja lanceolada visible ocupa solo 14×35px; a canvas 64px alcanza 22×50px. Probar contenido de 64–80px físicos y presentar variantes de 4/6/9/12 candidatos en 320, 390 y 1440 antes de producción. No mezclar métricas si la presentación cambia sustancialmente.

Ningún IoU es umbral psicofísico validado; falta QA humano con varias personas.

## Hipótesis para futura dirección artística, no aprobada
H1: estación de observación en un lugar real del mundo Faro. Hojas diseñadas tras observación botánica, sobre superficie material coherente con el entorno, no tarjetas flotantes. Modelo siempre visible, estímulo cognitivamente claro, escenario propio detrás. H3: herbario neutral solo como control de legibilidad.

## Evidencia generada y accesible en la conversación
- `LAMINA_REFERENCIAS_IRIS_VS_REWORK.png`
- `LAMINA_SILUETAS_44_64_80.png`
- `MATRIZ_SIMILITUD_GEOMETRICA.csv`
- `DATOS_10_SILUETAS_ESTUDIO.json`
- `12_INSPECCION_VISUAL_Y_CRIBADO_SILUETAS_20261010.md` (documento completo)
- `IRIS_GREEN_COG01_ESTUDIO_VISUAL_VERIFICADO_R01.zip` (paquete de estudios/scripts)

## Gate
Se completa el **estudio comparativo**, NO arte final. No está autorizado declarar VISUAL_KEEP, GAME_PASS, QA perceptivo o publicación. Mantener intacto el juego funcional anterior. Antes de cualquier R05: verificar masters verdaderos, observar formas reales, revisar legibilidad con personas y validar una diana de la misma ronda en 1440/390/320.
