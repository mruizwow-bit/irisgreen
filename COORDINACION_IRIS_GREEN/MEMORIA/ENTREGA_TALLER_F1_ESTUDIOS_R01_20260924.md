# TALLER-F1-R01 · Cinco estudios del Taller en español e inglés

Fecha: 24/09/2026 · Responsable: Claude (carril Taller, asignado por María) · Orden: `ORDENES/TALLER_F1/ORDEN_TALLER_F1_CLAUDE.md`
Estado: ENTREGADA_CON_CODIGO · pendiente de integración (María + agente 2) y de revisión visual de María. No publicado.

## Base y entrega

- Base: `main` `117a53a01bf254054f759e7e08eb06ba06f00d00` (PR #242).
- Commit local: rama `taller/f1-estudios-main`, HEAD `0ddc183f6774583bbdd68a0290950bfb5ce1ec98`, tree `60a2a045f5602cd2265b2d6b66cc9bbe7d35c009`. **No subido a GitHub**: esta sesión no tiene permiso de escritura en el repositorio. Se entrega `EVIDENCIAS/TALLER_F1_R01/CHANGES.patch` (se aplica limpio sobre `117a53a`) y el ZIP para subir con GitHub Desktop.
- 36 archivos: 20 nuevos y 5 modificados de la web, más el generador y sus 11 archivos de textos y pruebas (`scripts/`, fuera de la web publicada). Lista con hash en `EVIDENCIAS/TALLER_F1_R01/DELIVERY.json`.

## Qué hay

Portada `/es/taller/` y `/en/workshop/`: nueva sección «Los estudios / The studios» con los cinco estudios, justo después de la imagen, en la versión con JavaScript y en la versión sin JavaScript. Se conservan los 72 retos, los filtros, el reto de la semana y las hojas. Las seis mesas («Prueba aquí mismo») salen de la portada y pasan al estudio de Ideas, como decía el plan.

| Estudio | Rutas | Qué hace | Retos |
|---|---|---|---|
| 1 · Dibujo | `/es/taller/dibujo/` · `/en/workshop/drawing/` | Lienzo vectorial con capas (hasta 12), 8 herramientas (lápiz, tinta, rotulador, pincel suave, goma, línea, rectángulo, elipse), color, opacidad, simetría (espejos, radial, caleidoscopio), guías (cuadrícula, perspectiva de 1 y 2 puntos) con ajuste de líneas, series de hasta 40 hojas, texto alternativo por hoja, PNG con marca | 15 en 6 niveles; el último genera retos sin fin |
| 7 · Estructuras y puentes | `/es/taller/estructuras/` · `/en/workshop/structures/` | Editor de barras en rejilla; maqueta de mesa (palito, listón, hilo) y tamaño real (madera, acero, cable); secciones ×2 y ×3; apoyos en el terreno; cálculo por rigidez con peso propio, calzada, cables tensados, pandeo de Euler y roturas progresivas; peso, coche, camión o tren que cruzan; tabla con la fuerza de cada pieza | 11 en 5 niveles; encargo al azar sin fin |
| 12 · Programación | `/es/taller/programacion/` · `/en/workshop/coding/` | Tortuga que dibuja. Lenguaje propio (español e inglés a la vez), bloques ↔ texto, intérprete sin eval, paso a paso, velocidades, errores con línea, silueta del reto, comprobación de forma y de estructura del programa | 15 en 6 niveles (hasta Koch y fractal propio) |
| 13 · Robótica | `/es/taller/robotica/` · `/en/workshop/robotics/` | Robot con motores y sensores (distancia ×3, suelo ×3, choque, meta, dirección), mismo lenguaje; habitación, aparcar, seguir línea, laberintos conocidos y nuevos cada vez, dos robots a la vez; prueba en N variantes | 9 en 5 niveles |
| 25 · Ideas e inventos | `/es/taller/ideas/` · `/en/workshop/ideas/` | Las seis mesas, método SCAMPER (7 letras) y ficha de invento con coste, medidas y peso, y comprobación automática del encargo | 8 en 4 niveles; encargo al azar sin fin |

Común a todos: modo libre, nivel elegible y reversible, deshacer y rehacer sin límite (Ctrl+Z / Ctrl+Y), guardar y abrir el proyecto en un archivo JSON propio (se valida al abrir), aviso del navegador si se cierra con cambios, imprimir solo el trabajo, teclado completo, texto equivalente de lo que hay en el lienzo, sin puntuación ni ranking, mejor marca solo de la propia sesión y solo en retos de optimización.

## Decisiones de esta entrega

- **Sin almacenamiento del navegador.** El Taller ya no usa `sessionStorage` (antes lo usaban las seis mesas con claves no aprobadas). Todo vive en la página y se guarda en un archivo propio. `audit_privacidad_almacenamiento`: 0 hallazgos del Taller.
- **Cálculo honesto.** Las estructuras usan el método de rigidez con valores aproximados y se dice en la página que no sirve para construir. Calibrado: una celosía Pratt de madera de 12 × 4 m aguanta el tren al 93 % y pesa 2,55 t; con 8 paneles no aguanta. Todos los retos tienen una solución comprobada (ver pruebas).
- **Lenguaje propio seguro.** Léxico, sintaxis e intérprete propios, límite de 200.000 pasos y 200 niveles de recursión. Los programas se guardan como árbol y se muestran en el idioma de la página.
- **Hojas para imprimir.** La marca pasa a ser «IRIS GREEN · irisgreen.eu» y los códigos «TA-01…TA-12» se sustituyen por «Hoja 1…12 / Sheet 1…12» (los anclajes `#ta-01` no cambian).
- **Pie de la portada.** Además del cambio de A2 en #242 (pie dentro de la plantilla), `ig-taller-portada.css` anula la altura fija del runtime (`html, body, #dc-root` al 100 %) que ponía el pie encima del contenido.
- **Generador único.** Las 10 páginas de estudio salen de `python3 scripts/build_taller_estudios.py`. Para cambiar un texto, se cambia en `scripts/taller_estudios/<estudio>.py` (ES y EN juntos; el script falla si falta una clave en un idioma) y se vuelve a generar.

## Pruebas (detalle en `EVIDENCIAS/TALLER_F1_R01/`)

- `build_site.py` correcto sobre `117a53a` + parche: 2176 archivos públicos, 0 eval, auditorías del build correctas; el sitemap generado incluye las 10 rutas nuevas.
- Node: `node scripts/taller_estudios/pruebas_node.js` → 31/31 (estructuras, lenguaje, robótica, soluciones de los retos).
- Navegador (Chromium de Playwright, `dist` servido en local): flujos completos en ES y EN; axe-core 4.13.0 en 12 rutas × 2 estados × escritorio y móvil: 0 violaciones WCAG 2.0–2.2 A/AA; contraste mínimo calculado 4,79:1; 320 px y espaciado de texto sin desbordamiento; 44 px; foco visible de 3 px; colores forzados; movimiento reducido; sin JavaScript se leen todos los retos; recorrido EN sin texto en español; impresión con marca en todas las páginas.
- 24 capturas: 6 páginas × ES/EN × escritorio (1440) y móvil (390).

## No verificado y pendiente

- Lector de pantalla real, dispositivo móvil físico, lápiz digital y despliegue Netlify: sin comprobar.
- Integración: aplicar el ZIP o el parche sobre `117a53a` (María + agente 2) y revisar el preview.
- Siguientes estudios del plan: fase 4 (Máquinas 9, Circuitos 10, Diseño gráfico 2), fase 6 (Ritmo 16, Composición 17, Síntesis 18, Pixel art 4, Videojuegos 14, Simulaciones 15) y fase 7 (3, 5, 6, 8, 11, 19–24). La base común (`ig-taller-estudio.js/.css`) y el lenguaje (`ig-taller-codigo.js`) ya sirven para ellos.

## Avisos para otros carriles (no tocado)

- `audit_privacidad_almacenamiento` sigue fallando por otros archivos: `ig-cielo.js`, `ig-sistema-solar.js` (Intereses), `ig-idioma.js`, `common.js`, `rutinas-visuales.js`, `tarjeta-iris.js`.
- El runtime de plantillas (`assets/runtime/8fe7df74405f3c55.js`, `FULL_PAGE_CSS`) fija la altura a la pantalla en cualquier página que lo use; si otra página pone el pie fuera de la plantilla, el pie saldrá encima del contenido.
- El brief de Design R02 (juegos, rutinas y pictogramas) no forma parte de este carril y no se ha tocado.
