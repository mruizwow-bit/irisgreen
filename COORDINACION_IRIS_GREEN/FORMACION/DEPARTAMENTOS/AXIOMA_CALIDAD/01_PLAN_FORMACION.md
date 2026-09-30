# AXIOMA · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 30/09/2026
Issue: #345

## Objetivo

Formar a Axioma para transformar normas de accesibilidad y calidad en requisitos, pruebas y evidencia reproducibles sin confundir ley, estándar, guía, borrador u objetivo interno.

## 1 · Gobernanza de estándares

Dominar:
- fuente primaria;
- versión/fecha;
- normative vs informative;
- Recommendation / Note / Draft / Candidate Recommendation;
- supersedencia;
- transición;
- aplicabilidad;
- trazabilidad requisito → prueba → evidencia.

Regla:
una versión más nueva no sustituye automáticamente una referencia jurídica o contractual vigente.

## 2 · WCAG 2.2

Fuente:
https://www.w3.org/TR/WCAG22/

Estado verificado:
W3C Recommendation; publicación vigente indicada por W3C: 12/12/2024.

Dominar:
- Perceivable / Operable / Understandable / Robust;
- A / AA / AAA;
- requisitos de conformidad;
- Success Criteria de WCAG 2.2;
- Understanding y Techniques como apoyo, no sustituto.

Aplicación Iris Green:
baseline técnica web actual: WCAG 2.2 AA salvo decisión documentada diferente.

## 3 · WCAG-EM 2.0

Fuentes:
https://www.w3.org/TR/wcag-em-2/
https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/

Estado:
W3C Group Note, 23/07/2026.

Cinco etapas:
1. definir alcance;
2. explorar producto;
3. seleccionar muestra representativa;
4. evaluar;
5. reportar.

WCAG-EM apoya WCAG; no crea requisitos WCAG nuevos.

## 4 · ACT Rules

Fuentes:
https://www.w3.org/WAI/standards-guidelines/act/
https://www.w3.org/WAI/standards-guidelines/act/rules/about/

Estado:
informativo.

Aprendizaje:
ACT armoniza testing. La base de conformidad sigue siendo el requisito del estándar.

## 5 · WAI-ARIA 1.2 + APG

Fuentes:
https://www.w3.org/TR/wai-aria-1.2/
https://www.w3.org/WAI/ARIA/apg/

Estado:
WAI-ARIA 1.2 = W3C Recommendation 06/06/2023.
APG = guía de patrones/prácticas.

Dominar:
roles, states, properties, accessible name/description, keyboard interaction, focus, widgets, landmarks y accessibility tree.

Regla:
preferir HTML nativo cuando existe una solución adecuada.

Vigilancia:
ARIA 1.3 sigue como Working Draft en 2026; no usarlo como baseline normativa.

## 6 · Accesibilidad cognitiva

Fuente:
https://www.w3.org/TR/coga-usable/

Estado:
W3C Working Group Note, 29/04/2021.

Aprendizaje:
COGA cubre necesidades cognitivas y de aprendizaje, incluida neurodiversidad.
Es orientación suplementaria y no requisito de conformidad WCAG.

Dominar:
lenguaje, estructura, predictibilidad, memoria, atención, ayuda, comprensión, prevención de errores, reducción de carga y pruebas con usuarios.

## 7 · WCAG2ICT

Fuente:
https://www.w3.org/TR/wcag2ict-22/

Estado:
W3C Group Note, 11/12/2025.
Informativa; no estándar independiente de conformidad.

Aplicación:
documentos, software, apps nativas y otros contextos no web.

## 8 · EN 301 549 y transición europea

ETSI:
https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf

AccessibleEU:
https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en

Estado verificado a 30/09/2026:
- EN 301 549 V4.1.1 publicada en 2026-09;
- incorpora WCAG 2.2;
- AccessibleEU indica que todavía no es referencia legal EAA/WAD hasta cita formal en OJEU;
- la referencia de transición indicada sigue siendo V3.2.1, basada en WCAG 2.1 AA.

Regla:
mantener `LEGAL_BASELINE` separado de `TECHNICAL_TARGET`.
Lex confirma la aplicabilidad jurídica.

## 9 · ISO/IEC 30071-1:2019

Fuente:
https://www.iso.org/standard/70913.html

ISO indica confirmación en 2024.
Aprendizaje:
accesibilidad ICT debe integrarse a nivel organizativo y durante desarrollo/mantenimiento.

## 10 · ISO 9241-210:2019

Fuente:
https://www.iso.org/standard/77520.html

ISO indica confirmación en 2025.
Aplicación:
diseño centrado en las personas durante todo el ciclo.

## 11 · Calidad de producto

ISO/IEC 25010:2023:
https://www.iso.org/standard/78176.html

ISO/IEC 25040:2024:
https://www.iso.org/standard/83467.html

Aprendizaje:
calidad de producto es multidimensional; la evaluación debe tener criterios, procesos y evidencia, no reducirse a ausencia de bugs.

## 12 · Procesos de testing

ISO/IEC/IEEE 29119-2:2021:
https://www.iso.org/standard/79428.html

Aprendizaje:
testing profesional requiere procesos gobernados y reproducibles.

## 13 · PDF/UA

PDF/UA-1 · ISO 14289-1:2014:
https://www.iso.org/standard/64599.html

PDF/UA-2 · ISO 14289-2:2024:
https://www.iso.org/standard/82278.html

Aprendizaje:
PDF/UA define accesibilidad programática del PDF.
No demuestra por sí solo comprensibilidad o adecuación del contenido.

## 14 · EPUB accesible

EPUB 3.3:
https://www.w3.org/TR/epub-33/

EPUB Accessibility 1.1:
https://www.w3.org/TR/epub-a11y-11/

EPUB Accessibility 1.2:
https://www.w3.org/TR/epub-a11y-12/

Estado a 30/09/2026:
- EPUB 3.3 = Recommendation 13/01/2026;
- EPUB Accessibility 1.1 = Recommendation 17/10/2024;
- EPUB Accessibility 1.2 = Candidate Recommendation Draft 12/09/2026.

Regla:
1.2 se estudia como transición; no se presenta como Recommendation final.

## 15 · Tecnologías de apoyo

Dominar progresivamente:
- teclado;
- NVDA;
- VoiceOver;
- TalkBack;
- zoom/magnificación;
- high contrast / forced colors;
- reduced motion;
- control por voz cuando corresponda;
- salida braille.

Regla:
emulación de navegador no equivale a dispositivo físico, lector de pantalla o línea braille.

## 16 · Braille

CBE / ONCE:
https://www.once.es/servicios-sociales/braille/comision-braille-espanola/documentos-tecnicos/documentos-tecnicos-vigentes

Aprendizaje:
la Comisión Braille Española mantiene normas/signografías oficiales para braille y materiales en relieve en España.

ARIA 1.3:
https://www.w3.org/TR/wai-aria-1.3/

Incluye trabajo sobre propiedades braille, pero sigue como Working Draft.

Regla:
no crear una “vista braille” artificial.
Primero asegurar estructura, nombres, relaciones y estados expuestos correctamente a AT.

## 17 · Automatización vs evaluación humana

Fuentes:
https://www.w3.org/WAI/test-evaluate/
https://www.w3.org/WAI/test-evaluate/tools/selecting/

Aprendizaje:
las herramientas pueden detectar problemas y apoyar revisión, pero no determinan por sí solas accesibilidad.

Aplicación:
`AUTOMATED → MANUAL → KEYBOARD → AT → COGNITIVE/CONTENT → USER EVIDENCE` cuando proceda.

## 18 · Formación continua

Vigilar:
- nuevas Recommendations W3C;
- EN 301 549 y OJEU;
- revisiones ISO;
- AT/browser;
- ACT Rules;
- COGA;
- EPUB;
- PDF/UA;
- CBE/ONCE;
- lenguaje claro/lectura fácil;
- incidentes y regresiones reales.

Cadena profesional:
`SOURCE → VERSION → STATUS → APPLICABILITY → TEST → EVIDENCE → REVIEW`.
