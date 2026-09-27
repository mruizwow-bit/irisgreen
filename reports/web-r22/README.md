# Iris Green · R22 · Accesibilidad y acceso a funciones

Orden de María: revisar toda la web, tamaños y accesibilidad; facilitar acceso superior a contenido y funciones; corregir bloqueos y saltos al abrir Intereses. Base d52584344240deb352f712debd19e9e7ae76bdd2, destino preview PR244. La biblioteca cloud y el transporte de Sabik no se modifican.

## Cambios

- Índice desplegable con filtro de secciones en 989 páginas. Lista y enlaces en HTML; filtro progresivo, sin guardar consultas. Etiquetas ES/EN y actualización al cambiar el idioma en la portada. Navegación con teclado, Escape, foco en destino y apertura de detalles ante enlaces internos.
- Rincón: Mirar, Escuchar y Pausa son desplegables nativos. Escuchar incorpora búsqueda por nombre/familia y acceso directo a Música. No inicia reproducción al buscar ni se añaden preferencias guardadas.
- Intereses: espacio estable para las escenas, título fuera de la imagen, sin expansión de anchura tras cargar datos. Planetas/Exoplanetas presentan imagen local y cargan el motor 3D al pulsar Abrir vista interactiva. El cielo se dibuja antes de preparar las tablas secundarias, con nombre accesible desde su creación.
- Rutinas ES/EN y tabla de cifras: regiones desplazables accesibles con teclado. Tarjeta Iris: corrección del mínimo de columna y ancho de la vista previa. Imprimir cromos: desplazamiento dentro de la vista previa, conservando las medidas del papel.
- Contraste de etiquetas/botones en Autismo y Trámites. Botones de ordenar del Sistema Solar con tamaño de 44 × 44 px como mínimo.
- Corregido el enlace al Taller en la navegación de páginas inglesas: lleva a `/en/workshop/`.
- Versiones por contenido de los recursos modificados para evitar servir copias antiguas.

## Evidencia

`summary.json` resume resultados. `evidence.json.gz` contiene el barrido íntegro, los fallos detectados antes de su corrección final, las comprobaciones posteriores, los casos que axe deja incompletos, medidas y resultados. No se borran los hallazgos iniciales.

- Build: 2140 archivos; 1011 HTML. Fuente intacta tras construir.
- Auditoría estructural: 1011 páginas, cero hallazgos de los controles implementados. Comprobación de plantillas sin JS: cero variables sin resolver. Se comprueba además la apertura nativa del Rincón sin JS.
- Navegador: 2022 combinaciones de página y ancho (320/1280), sin desbordamiento del documento ni errores de página. Tras las correcciones y reejecuciones dirigidas, cero infracciones detectadas por axe 4.13.0 (etiquetas WCAG A/AA).
- Los dos catálogos de 6366 exoplanetas se revisan en lotes de 200 filas, conservando cabecera y CSS: 128 lotes ES/EN y dos anchos, cero infracciones automáticas. El barrido estructural y el de geometría también incluyen los documentos completos. El análisis axe monolítico era excesivamente lento; el informe distingue este método.
- Tamaño de objetivos: 48 casos, 6831 controles medidos, cero candidatos pendientes según el algoritmo de tamaño/excepciones del proyecto.
- Foco: 26 casos, 2258 paradas, cero candidatos ocultos. Se completa el ciclo en 24 casos; las dos rutas largas alcanzan el límite de 260 paradas.
- Rincón ES/EN: filtro Música, navegación por teclado, texto al 200 % con espaciado y anchos 320/390/1280, sin desbordamiento en los casos probados.
- Planetas/Exoplanetas ES/EN: arranque real del motor y canvas con SwiftShader, cuatro casos sin errores de página. Es renderizado por software, no prueba de una GPU física.

## Límites

Cero infracciones automáticas no significa conformidad global. Los resultados `incomplete` de axe se conservan y requieren revisión humana, incluidos contrastes con fondos complejos. No se acredita aquí lector de pantalla real, móvil físico, escucha del audio, validación con personas usuarias, PDF/UA ni braille. La ampliación/espaciado y el teclado se ensayan por familias y estados descritos, no en todas las combinaciones posibles. No se certifica cumplimiento legal ni ISO.

Referencia técnica: WCAG 2.2, https://www.w3.org/TR/WCAG22/ ; tamaño mínimo https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum ; espaciado https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html . La normativa operativa del proyecto permanece vigente.

## Repetición

Construir con `python3 scripts/build_site.py`. Ejecutar `audit_accesibilidad.py --root dist`, `audit_sin_js.py --root dist` y `audit_web_r22.py --root dist --browser /ruta/chromium --axe /ruta/axe.min.js`. Para las interacciones, idioma, catálogo y WebGL se incluyen `test_web_r22_*.py`; requieren `IRIS_AUDIT_BROWSER` y, cuando se usa axe, `IRIS_AUDIT_AXE`.

Las auditorías de objetivos y foco reutilizan los algoritmos existentes `audit_target_size.py` y `audit_focus_not_obscured.py`, sirviendo dist y usando el ejecutable de Chromium disponible. Medios externos bloqueados en pruebas locales. Comprobación del preview registrada aparte en coordinación.
