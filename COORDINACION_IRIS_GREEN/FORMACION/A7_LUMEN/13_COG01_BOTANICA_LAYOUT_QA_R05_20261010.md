# LUMEN · COGNITIVO 01 · LABORATORIO BOTÁNICO Y MÓVIL R05
Fecha: 10/10/2026
Estado: `COGNITIVO_01_R05_BOTANICAL_SCREENING_PASS__ART_VISUAL_REWORK_REQUIRED__NO_R03_CHANGE`

## Origen
La usuaria rechazó R03/R04 por aspecto genérico ajeno a la marca. Orden siguiente: estudiar diseños y especies reales, depurar siluetas, comprobar presentación a 320/390/1440 antes de tocar la implementación.

## Ejecución verificable
- Se creó `r05_siluetas/index.html`: comparador interactivo autónomo NO integrado en R03; permite 4/6/9/12 candidatos, selección accesible por botones, modelo siempre visible, contraste alternativo y ningún dato enviado/guardado.
- `outline_catalog.json`: 12 rutas SVG de ESTUDIO inspiradas en descripción botánica. Ginkgo, roble blanco, sasafrás (2 variantes), tulípero, acebo, sauce, castaño, tilo, arce, haya, hiedra.
- `evaluate_shapes.py`: comparó 66 parejas bajo 24 rotaciones discretas. Peor caso aprox. IoU=0,7761 (roble blanco / acebo). El umbral 0,83 es heurístico técnico, NO test perceptivo.
- `qa_browser.py`: Chromium real con Playwright y `page.set_content`, pues las navegaciones `file://` y `localhost` fueron bloqueadas por la política del entorno.
- Resultado: **90/90** checks de disposición, interacciones, tamaño de targets, contrast toggle, forced-colors simulado, sticky reference y ausencia de errores JS. **4.800** ensayos generados con una coincidencia de ID exacta.
- Breakpoints probados: **320×800, 390×844 y 1440×900**. En 320px el primer par de opciones cabe completo en viewport; con 9/12 hay scroll vertical necesario y se conserva el modelo mediante sticky. No encoger opciones.
- Fuente de identidad: `IRIS_GREEN_INFORME_VISUAL_FORMACION_2026-10-09.pdf` Library, págs. 70, 102-103, 117-118; también documentación Lumen R04; ningún arte ajeno se ha copiado como producto.

## Aspectos NO aprobados
- Estos SVG **no son arte final**: incluso después de dos correcciones de contorno algunas hojas se perciben como símbolos geométricos (ginkgo, arce, acebo, tilo). VISUAL_REWORK_REQUIRED.
- No hay QA perceptivo con personas, validación botánica exacta, prueba táctil física, lector de pantalla completo ni GPU de IrisGreen.
- La integración original R03 NO se ha cambiado, y los fondos R04 rechazados siguen rechazados.
- Rutas de masters en GitHub `img/vineta-hoja.webp`, `img/taller-mesa-mirar.webp` y `img/j1-vera.webp` verificadas por nombre/SHA; no inspeccionados sus píxeles directamente porque GitHub binario devolvió error Unicode. Solo se inspeccionaron referencias embebidas del PDF; no afirmar master aprobado para el juego.

## Fuentes botánicas de observación
- https://arboretum.harvard.edu/plant-bios/ginkgo/
- https://arboretum.harvard.edu/stories/marginalia/
- https://arboretum.harvard.edu/arnoldia-stories/through-the-seasons-with-sassafras/
- https://arboretum.harvard.edu/arnoldia-stories/whats-in-a-leaf/
- https://arboretum.harvard.edu/wp-content/uploads/2023/12/Ilex-Opaca_-Tree-of-the-Month.pdf
- https://www.rhs.org.uk/plants/97712/salix-alba/details
- https://www.rhs.org.uk/plants/18225/tilia-cordata/details
- https://www.rhs.org.uk/prevention-protection/ivy-on-buildings

## Entregables persistidos en Library
`/Iris Green/Handoffs/Lumen/IRIS_GREEN_COG01_R05_ESTUDIO_BOTANICO_MOVIL.zip`.
Incluye HTML, JSON, los scripts reproducibles, informe y QA, capturas del navegador y láminas.

SHA256 del ZIP: `c691faad3747c8fe3e49793f5bb676cd821201abc68b213a2ef8847d3368c215`.

## Próximo gate
El redibujo botánico de las siluetas de estudio debe resolver los parecidos a iconos antes de integrarse en escena; posteriormente se revisa dirección de arte de Faro contra sus masters y se hace HUMAN QA. No declarar visual KEEP por controles automáticos.
