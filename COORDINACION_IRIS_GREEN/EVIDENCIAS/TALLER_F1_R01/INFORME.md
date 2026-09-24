# TALLER-F1-R01 · Evidencias

Base `main` `117a53a01bf254054f759e7e08eb06ba06f00d00` + `CHANGES.patch` (commit local `0ddc183f6774583bbdd68a0290950bfb5ce1ec98`, no subido). Pruebas hechas sobre `dist` generado con `python3 scripts/build_site.py`, servido en local y abierto con Chromium (Playwright 1.56). Son pruebas locales: no equivalen a despliegue, lector de pantalla ni aceptación humana.

| Comprobación | Resultado | Archivo |
|---|---|---|
| Build del sitio | rc=0; 2176 archivos públicos; 0 eval / new Function | — |
| Pruebas sin navegador | 31/31 | `scripts/taller_estudios/pruebas_node.js` (en el parche) |
| Flujos: dibujo (ratón, teclado, simetría, reto, deshacer, archivo, PNG) | Correcto ES | `pruebas_navegador/t_dibujo.py` |
| Flujos: estructuras (teclado, reto e1 y e7 con tren) | Correcto ES/EN; 44 % y 93 % como en el cálculo | `t_est.py` |
| Flujos: programación (Koch, ¡zas!, error de sintaxis, bucle infinito) | Correcto ES/EN | `t_prog.py` |
| Flujos: robótica (línea en 3 variantes, dos robots) | Correcto ES/EN | `t_rob.py` |
| axe-core 4.13.0, WCAG 2.0–2.2 A/AA, 12 rutas × 2 estados × 2 anchos | 0 violaciones | `AXE_RESULTS.json`, `axe_run.py` |
| Contraste calculado sobre fondos translúcidos | mínimo 4,79:1 | `contrast.py` |
| 320 px + espaciado de texto (1.4.12) | sin desbordamiento en 12 rutas | `adapt.py` |
| Sin JavaScript | los 10 estudios muestran todos los retos | `adapt.py` |
| Colores forzados y movimiento reducido | correcto; prueba de carga sin animación; robot al instante | `adapt.py` |
| Teclado y foco | orden lógico; foco de 3 px; editor de bloques usable solo con teclado | `kb.py`, `kb2.py` |
| Objetivos táctiles | ≥ 44 px (52 px con «Botones más grandes») | `kb.py`, `audit_target_size` |
| Inglés | 0 textos en español en rutas EN con todos los retos abiertos | `en_check.py` |
| Impresión | solo el trabajo; IRIS GREEN · irisgreen.eu en cada página | `pdf2.py` |
| Auditorías del repositorio | almacenamiento: 0 hallazgos del Taller; target size, tablas, autoplay, SEO idiomas, sin JS, privacidad: correctas | — |
| Capturas | 24: 6 páginas × ES/EN × escritorio 1440 y móvil 390 | `capturas/` |

Sin verificar: NVDA/VoiceOver, móvil físico, lápiz digital, preview/producción Netlify.
