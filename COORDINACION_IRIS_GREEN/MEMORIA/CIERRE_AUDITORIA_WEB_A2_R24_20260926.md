# A2 · cierre de auditoría automática web · 26/09/2026

Orden directa de María: terminar lo pendiente de la auditoría de la web mientras continúa en paralelo la preparación de TinyFish/Netlify.

## Identidad cerrada

- PR web: #244.
- Rama: `agent2/sabik-iris-r08-20260924`.
- HEAD auditado: **`52e5f9f02184581a1bfb1878c388ede3d1068c47`**.
- Base de esta continuación: `82106c874f5e4b612cdb68292b3c3115e040fea6`.
- Resultado de Actions en el HEAD final: **20/20 workflows del PR completados con SUCCESS**.

No se ha hecho merge a main ni despliegue de producción. La conexión Cloud R06 de A3 es un carril separado y no se considera cerrada por esta auditoría web.

## Fallos automáticos que se cerraron

1. **Almacenamiento y privacidad.** El auditor seguía sin reconocer usos actuales y documentados de sessionStorage: idioma de pestaña, marcas efímeras de Rutinas visuales y borrador de Tarjeta Iris. Se mantuvo el principio de lista cerrada y se modelaron expresamente las dos claves dinámicas de Rutinas; no se añadió permiso genérico. Resultado final: 1.072 archivos revisados, 57 llamadas Web Storage, **0 errores**. Run `36224266458` SUCCESS.

2. **CSP / plantillas DC.** El build CSP-safe solo codificaba plantillas dentro de `x-dc`, dejando expresiones crudas en cabecera/controles de siete superficies. Se amplió la transformación únicamente al markup activo fuera de script/noscript. El inventario final tiene **0 páginas con mustache activo**, `unsafe-eval=false` y las **9 superficies DC vigentes** pasan en Chromium. Se corrigió además el gate histórico que aún esperaba 11 superficies retiradas. Run `36224266466` SUCCESS.

3. **Comprobación previa de publicación.** El contrato congelado de indexación seguía en 989 HTML / 982 URLs. La rama vigente contiene 22 páginas públicas nuevas ES/EN ya revisadas (Taller + Exoplanetas/Eclipses), por lo que el contrato real es 1.011 HTML, 990 index/follow, 5 noindex/follow, 16 otros/sin meta y 1.004 URLs de sitemap. No se cambió robots para hacer pasar el test: se actualizó la instantánea deliberada a la salida ya publicada por el build. Run `36224266439` SUCCESS.

4. **Coherencia de Taller, Intereses e Investigación.** El test seguía esperando el catálogo antiguo de retos y el álbum de cromos, y en Investigación usaba un selector de búsqueda ambiguo tras añadirse el buscador de secciones. Se actualizó al Taller actual de ocho estudios, a los cuatro espacios profundos de Intereses y al buscador propio de Investigación. Resultado final: 6 catálogos, 14 casos de otras secciones, 2 recuperaciones de error, **0 fallos** dentro del gate de publicación.

5. **Videoteca.** La prueba confundía el total de vídeos YouTube con la cantidad de miniaturas locales cacheadas. La web vigente tiene 116 pósteres YouTube en ES, 46 miniaturas locales efectivamente utilizadas y 70 fallbacks visibles; se comprueban ambos caminos y que reproducir sigue abriendo el proveedor correcto. Los cinco casos terminan sin fallos. Run de publicación `36224266439` SUCCESS.

6. **Foco largo.** R22 había dejado dos rutas sin completar el ciclo por un límite artificial de 260 Tab. Se elevó el límite del auditor y se integró en el gate de teclado. Resultado final: **26/26 ciclos completos**, 2.322 paradas de foco, **0 candidatos ocultos y 0 errores de página**. Run `36224266464` SUCCESS.

## Matriz final

Los 20 workflows asociados al HEAD 52e5f9f terminaron SUCCESS:
- montaje Iris Green y Sabik R08;
- publicación previa;
- almacenamiento/privacidad;
- CSP;
- teclado/foco;
- axe-core;
- contraste con gradientes;
- contraste no textual;
- tamaño de objetivos;
- orientación;
- audio/movimiento;
- semántica de tablas;
- SEO/idiomas;
- recursos ES/EN;
- rutinas visuales;
- impresión Taller;
- carga Directorio;
- carga diferida Investigación;
- Lighthouse;
- navegador WCAG v2.

Esto cierra **la auditoría automática ejecutable** de esta rama en su alcance actual. No se presenta como certificación legal o normativa.

## Pendientes que no pueden cerrarse honestamente desde CI

Siguen siendo validación humana/física, no fallos automáticos abiertos:
- lector de pantalla real;
- móvil físico;
- escucha real de audio;
- validación con personas usuarias;
- revisión humana de casos `incomplete` de axe y fondos complejos;
- GPU física (WebGL se probó con SwiftShader);
- PDF/UA y braille, si se exige certificación específica de esos artefactos.

Las dos rutas largas de foco **ya no están pendientes**: quedaron cerradas en esta continuación.

## Separación de Sabik R06

A3 mantiene su corrección R06 y A2 mantiene la operación de despliegue. El hallazgo `OBS-A3-R06-FRAME-SRC-01` sobre `frame-src` continúa separado. Ningún resultado de este cierre automático implica que el transporte HTTP real de Sabik esté desplegado o verificado.
