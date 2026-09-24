# Auditoría y corrección · Juegos, Rutinas imprimibles y Rutinas visuales · R06 · 24/09/2026

Sustituye en el repositorio a lo publicado en R05. Mismas rutas ES/EN, misma cabecera, CSS, Lectura y pie.

## Lo que se encontró y cómo queda

| # | Recurso | Hallazgo | Corrección |
|---|---|---|---|
| 1 | Juegos e imprimibles | 33 juegos y 28 rutinas repetían el mismo dibujo en pasos distintos (p. ej. tres zapatos iguales, cuatro cremalleras iguales). Quien no lee no podía distinguirlos. | 84 pasos reasignados. 53 a dibujos que ya teníamos y no se usaban (cremallera 1-2-3, botones 1-2-3, contenedores de papel, plástico y vidrio, orgánico, taparse, parada, llegar, cambio, ticket, cesta de la compra…). 31 a variantes con distintivo (▶ abrir · ■ cerrar · ↑ coger · ↓ guardar · ✓ comprobar · ojo mirar · 1-2-3). **Ningún juego ni rutina repite dibujo.** Comprobado en las 109 rutinas y en todas las fases de los 252 juegos. |
| 2 | Imprimibles | Dibujos que no correspondían al paso: tarjeta bancaria para «Validar el billete», vaso para «Llenar la botella», «trabajar» para «Hacer uno». | Cambiados a validar-billete, botella y empezar. |
| 3 | Rutinas imprimibles | Era un configurador (elegir rutina → formato → opciones), no una colección de hojas para imprimir. | Rehecha como catálogo de hojas A4 con miniatura real de cada hoja y botón **Imprimir** directo en cada tarjeta. Cuatro tipos: **Rutinas paso a paso** (109, en cuatro formas: hoja de pasos, lista para marcar, tira para la nevera y tarjetas de la rutina), **Tarjetas para recortar** (9 temas, 12 por hoja, con línea de corte), **Tableros** (Primero → Después · Primero, luego, después · Por hacer / Hecho · Mañana, tarde, noche · Mi semana) y **Packs completos** (13). Blanco y negro para ahorrar tinta. Línea «Rutina de: ____» opcional. |
| 4 | Juegos | 6 rutinas imprimibles sin juego. | 3 juegos nuevos (afeitarse, cocinar una receta, limpiar la casa) y 3 enlazados a juegos que ya existían. 252 juegos; las 109 rutinas tienen juego. |
| 5 | Rutinas visuales | Biblioteca propia de 93 pictogramas en 13 sprites, aparte de la carpeta común. Faltaban Dormir, Estudiar y Trabajar. | La herramienta usa ya /assets/pictogramas/, la misma carpeta que Juegos e imprimibles: **292 pictogramas en once categorías**, con nombre de concepto y no de paso. Los 6 que solo existían dentro de los sprites se han sacado a SVG sueltos (mulberry-rutinas-extra/). Se abre por Higiene, no con todo. |
| 6 | Rutinas visuales | Las rutinas imprimibles no se podían adaptar. | Botón «Cambiarla en Rutinas visuales» en cada rutina: abre el constructor con sus pasos cargados (?rutina=…). |
| 7 | Rutinas visuales | No enlazaba a Juegos ni a Rutinas imprimibles. | Enlaces en la página, en ES y EN. |
| 8 | Los tres | Licencia Mulberry escrita de tres formas; el manifiesto decía «versión pendiente de fijar». | Una sola atribución en páginas, hojas, manifiesto y NOTICE: CC BY-SA 4.0. |

## Qué no cambia
- Las 109 rutinas, sus 427+ pasos y sus textos ES/EN.
- Contar y pagar (ruta actual del repositorio).
- Los 299 SVG publicados en R05: no se tocan, se añaden 37.

## Queda anotado
- 158 de los dibujos se usan en más de un paso con frases distintas («Guardar», «Guardarlo», «Guardar el resto»). Es el mismo concepto con otra frase y se deja así; dentro de una hoja ya nunca se repiten.
- /assets/mulberry-rutinas/ (13 sprites) deja de usarse. Se puede borrar del repositorio después de publicar R06.
- No se afirma conformidad PDF/UA: la hoja se imprime desde el navegador. Cada hoja tiene al lado su lista de pasos en texto (HTML equivalente).
- Comprobado con la herramienta: carga, filtros, detalle, cambio de formato, tableros y constructor. Falta la prueba de impresión real en papel.
