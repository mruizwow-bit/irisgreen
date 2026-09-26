# R23 · Addendum de validación y cabecera

25 de septiembre de 2026. Complementa README.md sin reemplazar su registro histórico.

## Resultados reales recibidos

- Recursos: run 36094295742 sobre 5735df1501643e4bf52c73fd3a866e38ea662bee, job 107943147905, SUCCESS. Artefacto 10846747658, SHA-256 ad06d1cb615d1bc689ba4c47546f191169bb9f985880d2c46a60cf8e3930a604. JSON: 12/12 casos ES/EN a 1440/320, apertura y retorno con teclado en Rutinas imprimibles, constructor visual, impresión y cambio de idioma.
- Se inspeccionaron visualmente dos muestras A4 reales de ese artefacto: Rutinas imprimibles ES y EN, generadas a 320 px. Ambas completas. La comprobación estructural de los doce PDF confirma tamaños A4; no se declara PDF/UA ni revisión visual exhaustiva de todos los PDF.
- Rutinas visuales: run 36094700969 sobre f25874faccb34a603aa3b069c7879d01cce286cc, SUCCESS: guard actualizado al catálogo individual de 292 entradas, sin modificarlo.
- Contraste no textual: run 36094701013 sobre f25874faccb34a603aa3b069c7879d01cce286cc, job 107944385613, SUCCESS. Se abre el buscador mediante teclado antes de medir su campo; no se reduce el umbral ni se cambia el CSS.

## Discrepancia de cabecera R09 / diseño posterior

Al avanzar la prueba del montaje, run 36094295736 (job 107943147935) se detuvo en test_iris_corrections_r09.py: /es/recursos/, 1920 px, centros [35.9921875, 94.5, 36, 36]. Recursos ya había pasado. La prueba antigua exigía marca, navegación y controles en una fila.

No se revierte la web para satisfacer esa prueba: el historial identifica cd39aa8ca957a4b1448400be98d0911b35851db6, posterior a R09, con el cambio «structured inner-page header». El CSS vigente declara explícitamente «Páginas interiores: marca y controles arriba, navegación completa debajo». La captura real de Recursos a 1440 px del artefacto 10846434301 muestra esa estructura de dos filas. La evaluación inicial en el chat como un defecto de salto de fila fue prematura y se corrigió tras consultar el historial.

Se actualiza únicamente el guard: conserva la tolerancia de alineación de la primera fila, exige que la navegación quede debajo y dentro de la cabecera, revisa visibilidad y altura mínima de 44 px de cada enlace, rechaza recortes y solapamientos y recorre todos los enlaces con Tab. Las comprobaciones de ancho, tipografía, móvil y páginas de los libros se conservan. Se añade registro de progreso y evidencia del caso que falla para no perder resultados si aparece otro problema.

Compilación local y 24 casos sintéticos del guard (4 positivos y 20 negativos) correctos. Son pruebas aisladas, no una validación del sitio completo. El resultado real del montaje sobre el commit que contiene este addendum debe registrarse en PR #244 y coordinación #237 cuando termine.

No se atribuye una nueva aprobación visual a María ni se declara aceptación del diseño. Este lote sigue modificando solo pruebas e informes. Interfaz, contenido, pictogramas, fuentes, tamaños físicos, masters, voz, Cloud, secretos, main y producción intactos.
