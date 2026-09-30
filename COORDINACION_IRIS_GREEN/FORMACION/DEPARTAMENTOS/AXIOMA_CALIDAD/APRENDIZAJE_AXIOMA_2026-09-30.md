# APRENDIZAJE_AXIOMA_2026-09-30

Fecha: 30/09/2026
Issue: #345
Referencia Aura: #348
Estado: `FOUNDATION_STUDIED_PRACTICE_PENDING`

## Identidad
- Alias: Axioma
- Puesto: Quality, Accessibility & Standards Lead
- Especialidad: ICT Accessibility, Quality & Standards Engineer / Lead
- Jefatura: María · Dirección

## Fuentes y aprendizaje principal

### WCAG 2.2
https://www.w3.org/TR/WCAG22/
Baseline técnica web de Axioma. La conformidad se evalúa contra requisitos y Success Criteria, no contra un scanner.

### Evaluación W3C
https://www.w3.org/WAI/test-evaluate/
https://www.w3.org/WAI/test-evaluate/tools/selecting/
Las herramientas automáticas ayudan, pero no determinan por sí solas accesibilidad.

### WCAG-EM 2.0
https://www.w3.org/TR/wcag-em-2/
Group Note de 23/07/2026. Método: alcance → exploración → muestra representativa → evaluación → reporte. No añade requisitos WCAG.

### ACT Rules
https://www.w3.org/WAI/standards-guidelines/act/rules/about/
Informativas. Armonizan pruebas; un PASS ACT no equivale a conformidad WCAG.

### WAI-ARIA 1.2 + APG
https://www.w3.org/TR/wai-aria-1.2/
https://www.w3.org/WAI/ARIA/apg/
ARIA 1.2 es Recommendation. Preferir semántica HTML nativa cuando resuelve correctamente el caso.

### COGA
https://www.w3.org/TR/coga-usable/
Orientación suplementaria para necesidades cognitivas y de aprendizaje, incluida neurodiversidad. No es requisito de conformidad WCAG.

### WCAG2ICT
https://www.w3.org/TR/wcag2ict-22/
Group Note de 11/12/2025. Guía informativa para documentos/software no web; no estándar independiente de conformidad.

### EN 301 549
ETSI V4.1.1:
https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf
AccessibleEU:
https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en
V4.1.1 fue publicada en septiembre de 2026 e incorpora WCAG 2.2. AccessibleEU indica que aún no es referencia legal EAA/WAD hasta cita formal en OJEU y mantiene V3.2.1 como referencia de transición. Regla: `LEGAL_BASELINE` separado de `TECHNICAL_TARGET`; la conclusión jurídica corresponde a Lex.

### ISO / calidad / testing
- ISO/IEC 30071-1:2019 — https://www.iso.org/standard/70913.html
- ISO 9241-210:2019 — https://www.iso.org/standard/77520.html
- ISO/IEC 25010:2023 — https://www.iso.org/standard/78176.html
- ISO/IEC 25040:2024 — https://www.iso.org/standard/83467.html
- ISO/IEC/IEEE 29119-2:2021 — https://www.iso.org/standard/79428.html
Aprendizaje: accesibilidad y calidad se diseñan y evalúan durante el ciclo de vida con procesos y evidencia reproducibles.

### PDF/UA
- ISO 14289-1:2014 — https://www.iso.org/standard/64599.html
- ISO 14289-2:2024 — https://www.iso.org/standard/82278.html
La conformidad programática PDF/UA no demuestra por sí sola comprensión o calidad del contenido.

### EPUB
- EPUB 3.3 — https://www.w3.org/TR/epub-33/
- EPUB Accessibility 1.1 — https://www.w3.org/TR/epub-a11y-11/
- EPUB Accessibility 1.2 — https://www.w3.org/TR/epub-a11y-12/
A 30/09/2026: EPUB 3.3 es Recommendation; Accessibility 1.1 es Recommendation; 1.2 es Candidate Recommendation Draft y se trata como transición.

### Braille
CBE/ONCE:
https://www.once.es/servicios-sociales/braille/comision-braille-espanola/documentos-tecnicos/documentos-tecnicos-vigentes
ARIA 1.3:
https://www.w3.org/TR/wai-aria-1.3/
Primero semántica/nombres/roles/estados correctamente expuestos a AT. ARIA 1.3 sigue como Working Draft; sus propiedades braille no son baseline normativa.

## Práctica realizada en Iris Green

Inspección read-only de `main`, HEAD observado:
`ad7ea66254be7be44d7e97b4ca19ae8ac42ba6b5`

Revisados:
- `.github/workflows/auditar-wcag-axe.yml`
- `.github/workflows/comprobar-wcag-teclado.yml`
- `.github/workflows/comprobar-wcag-navegador-v2.yml`
- `scripts/test_system_accessibility.py`
- `scripts/test_keyboard_flows.py`
- `scripts/test_wcag_browser_v2.py`

Hallazgo:
la infraestructura ya separa axe, teclado, navegador, foco, reduced motion, forced colors, reflow y text spacing. Los propios scripts declaran que NO son certificación con lector de pantalla/braille/voz ni prueba completa de conformidad y que la revisión cognitiva/manual queda separada.

Prueba negativa:
CI verde solo prueba los checks ejecutados dentro de su alcance. No autoriza a afirmar “WCAG 2.2 AA completo” ni “producto accesible”.

## Cambio de comportamiento

`SOURCE → VERSION → STATUS → APPLICABILITY → REQUIREMENT → TEST → EVIDENCE → RESULT → RETEST`

Nunca:
`TOOL → GREEN → PASS GLOBAL`

## Límites

No realizado todavía:
- NVDA / VoiceOver / TalkBack reales;
- línea braille real;
- user testing;
- auditoría WCAG completa;
- PDF/UA operativo sobre un documento Iris Green;
- EPUB operativo completo;
- examen/prácticas R01 completas.

No hubo cambios de producto, build ni deploy. No existe certificación externa ni dictamen legal.

## Primeros 15 minutos del siguiente Axioma

1. Leer `FORMACION/00_EMPIEZA_AQUI.md`.
2. Leer `FORMACION/DEPARTAMENTOS/AXIOMA_CALIDAD/`.
3. Leer este aprendizaje.
4. Verificar HEAD de coordinación.
5. Consultar `CONTROL/FORMACION_AGENTES.json`.
6. Fijar estándar + versión + superficie antes de auditar.
7. Verificar transiciones EN 301 549/OJEU y escalar Legal a Lex.
8. No declarar conformidad basándose solo en CI.
9. Preservar findings/retests.
10. Actualizar aprendizaje antes de cerrar si hubo cambio material.
