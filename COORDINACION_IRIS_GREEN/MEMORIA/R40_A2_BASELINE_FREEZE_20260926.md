# R40 · A2 freeze/handoff de la base web · 26/09/2026

Estado: **R40_BASELINE_A2_FROZEN_READY**

## Identidad exacta

- Rama de origen: `agent2/sabik-iris-r08-20260924`.
- HEAD congelado: `52e5f9f02184581a1bfb1878c388ede3d1068c47`.
- Tree: `a341d2053fee62d3f7cd3522c74618b1a090a0dc`.
- Parent inmediato: `a4bd7bc416de10b50cf74277ae6cff0f09679ad9`.
- Base de PR #244: `main@2e17ed3ae02e23a4fd734b00c10f843d14a19d4d`.
- Referencia de freeze: `freeze/r40-a2-web-baseline-20260926` → exactamente el HEAD anterior.
- PR histórico de trabajo: #244, abierto/draft y no fusionado.

La rama de origen fue comprobada antes de congelar y seguía exactamente en el HEAD anterior, sin commits posteriores. La referencia de freeze se creó sin añadir commits ni modificar producto.

## Alcance congelado

El freeze cubre el tree completo `a341d205...`, no una selección parcial. Por tanto congela como punto de partida R40:
- superficies públicas ES/EN y portada;
- Taller, Intereses, Recursos, Juegos y Rincón tranquilo tal como existen en ese tree;
- navegación, Lectura, buscadores/filtros, tarjetas, visores y rutas actuales;
- assets, imágenes, audio existente y datos ya presentes;
- configuración pública Netlify del repositorio (`netlify.toml`, `_headers`, `_redirects`, robots/sitemaps);
- frontend Sabik que ya forma parte de la base web hasta R05;
- scripts, tests, workflows y guardarraíles que dieron el cierre automático de #244;
- informes/documentación ya contenidos en el mismo tree.

La identidad raíz relevante del tree incluye `.github/`, `assets/`, `audio/`, `docs/`, `editorial/`, `en/`, `es/`, `img/`, `reports/`, `sabik/`, `scripts/`, `tools/` y los archivos públicos/configuración de raíz. R40 debe partir de la referencia de freeze o del SHA exacto, nunca de una revisión histórica anterior.

## Matriz de workflows del mismo HEAD

20/20 workflows de PR asociados a `52e5f9f...` terminaron SUCCESS:

1. Auditar WCAG semántica de tablas — run 36224266462.
2. Comprobar almacenamiento y privacidad — 36224266458.
3. Comprobar carga diferida de Investigación — 36224266482.
4. Comprobar WCAG orientación — 36224266474.
5. Auditar WCAG tamaño de objetivos — 36224266475.
6. Auditar WCAG audio y movimiento — 36224266430.
7. Auditar WCAG contraste no textual — 36224266521.
8. Comprobar rutinas visuales — 36224266449.
9. Comprobar SEO e idiomas — 36224266501.
10. Comprobar carga del Directorio — 36224266508.
11. Comprobar impresión del Taller — 36224266523.
12. Recursos actuales ES y EN — 36224266520.
13. Auditar WCAG con axe-core — 36224266469.
14. Comprobar CSP — 36224266466.
15. Comprobar WCAG en navegador v2 — 36224266500.
16. Auditar WCAG contraste con gradientes — 36224266448.
17. Medir rendimiento Lighthouse — 36224266479.
18. Comprobar WCAG flujos de teclado — 36224266464.
19. Comprobación previa de publicación — 36224266439.
20. Iris Green y Sabik R08 — 36224266495.

Evidencia destacada del cierre: 26/26 ciclos de foco, 2.322 paradas, 0 candidatos ocultos y 0 errores de página; almacenamiento 0 errores; CSP con 0 plantillas activas y 9 superficies DC vigentes probadas.

## Validaciones manuales aún pendientes

No forman parte de un PASS automático y no deben heredarse como si estuvieran completadas:
- lector de pantalla real;
- móvil físico;
- escucha humana del audio;
- validación con personas usuarias;
- revisión humana de casos `incomplete`/fondos complejos;
- GPU física (WebGL automático usa SwiftShader);
- PDF/UA y braille, si R40 requiere certificación específica;
- zoom nativo 200/400 y juicio cognitivo/naturalidad cuando el contrato R40 los pida expresamente.

## Fuera del freeze / carriles separados

No están cerrados ni autorizados por este handoff:
- Sabik R06 / transporte HTTP real / Cloud y su despliegue privado;
- PR #245/#246 y `OBS-A3-R06-FRAME-SRC-01`;
- voz, TTS, voice runtime, prompts de voz;
- secretos, Team Login o variables Cloud;
- merge a `main`;
- deploy de producción;
- cualquier implementación R40 posterior.

## Handoff R40

- #255 A3: crear rama nueva desde `freeze/r40-a2-web-baseline-20260926` o desde el SHA exacto; no desde la rama móvil de A2.
- #256 A1: usar esta identidad como baseline de comparación y después validar exactamente el HEAD/tree candidato que entregue A3.
- #258 A5: baseline de referencia; esperar interfaces estables de #255 antes de tocar capa local.
- #259 A7: baseline de referencia histórica P0; no implementar P2 hasta superar el gate que exige su propia orden.

Este documento congela identidad y alcance. No implementa R40.
