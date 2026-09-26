# Evidencia · R42 A3 App Shell · QA final · 26/09/2026

## Identidad
- Orden: #284
- PR: #290
- Base A2: `574356cba3b73dc8477a625d2c6311008260a2d6`
- HEAD A3: `c9e5c002d65a9efc872e56b18230a6cf08701c31`
- tree: `bbc44f1dbf7682eb2ea17b9c85d3f79a27869f69`

## Build / navegador
- Workflow final: `36243762051`
- Job: SUCCESS
- Build: 2.195 archivos
- Contrato R42: PASS
- Browser: 26/26 PASS
- Capturas: 24
- Artifact: `10906127952 · r42-a3-browser-qa`

## Cobertura
8 rutas ES/EN probadas en:
- 1440×900
- 390×844
- 320×800

Comprobado automáticamente:
- shell montado y familia/idioma correctos;
- un H1 visible;
- 0 overflow horizontal de documento;
- workspace/stage en primer viewport;
- desktop rail vertical;
- móvil/reflow dock horizontal;
- workspace móvil con anchura útil mínima;
- Dibujo: inspector real, lienzo primero, Archivo agrupado, sin recorte de Retos ni columna vacía;
- Escape/cierre y restauración de foco;
- toolbar con roving tabindex.

## Correcciones nacidas del QA
El ciclo de navegador detectó y corrigió antes del cierre:
1. búsqueda incorrecta de nodos movidos al inspector;
2. conflicto de Escape entre diálogo R42 y overlay global de Lectura;
3. breakpoint demasiado alto que convertía 1024 px en shell móvil;
4. inspector vacío consumiendo espacio en familias sin contexto inicial;
5. workspace móvil comprimido a ~50–64 px por especificidad;
6. Dibujo con columna legacy vacía y Retos recortados por la prioridad del CSS unlayered.

## Inspección de capturas
A3 revisó las capturas finales representativas:
- Dibujo ES desktop y móvil;
- Juegos ES móvil;
- Intereses ES desktop;
- Rincón ES desktop y móvil.

No se observó en esas capturas el recorte anterior ni el workspace comprimido. Esto es evidencia técnica de A3, no aceptación perceptiva de María.

## Límites
- No HUMAN QA final.
- No lector de pantalla ni móvil físico.
- No certificación WCAG/EN/ISO.
- No deploy de A3.
- La integración y preview única pertenecen exclusivamente a A2 (#289).
