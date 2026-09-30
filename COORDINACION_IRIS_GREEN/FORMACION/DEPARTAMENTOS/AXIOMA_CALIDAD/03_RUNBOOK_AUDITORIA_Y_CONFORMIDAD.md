# AXIOMA · RUNBOOK DE AUDITORÍA Y CONFORMIDAD

Fecha: 30/09/2026

## 0 · Resume Gate
Antes de auditar:
1. orden y owner;
2. rama/HEAD/artefacto;
3. superficie exacta;
4. estándar, versión y nivel;
5. decisión más reciente;
6. obligación legal vs objetivo técnico;
7. exclusiones.

Si cambia el estado: reconciliar antes de evaluar.

## 1 · Autoridad
Registrar:
SOURCE · TITLE · VERSION · PUBLICATION_DATE · STATUS · NORMATIVE_OR_INFORMATIVE · APPLICABILITY · OWNER.

No evaluar “WCAG” sin versión ni “ISO” sin número/edición.

## 2 · Alcance
Producto · versión · idioma · rutas/documentos · funcionalidades · plataformas · navegadores · AT · contenido dinámico · exclusiones.

## 3 · Matriz
`REQUIREMENT_ID → SOURCE → SURFACE → EXPECTED → TEST_METHOD → EVIDENCE → RESULT → OWNER → RETEST`

Estados:
PASS · FAIL · PENDING · NOT_TESTED · NA.

NA requiere justificación.

## 4 · Automatización
Usar para scanning, HTML/ARIA checks, contraste, rutas, focus assertions, reflow, text spacing, target size y regresión.
Registrar versión de herramienta.

Nunca:
`AUTOMATED_PASS = ACCESSIBLE`.

## 5 · Revisión manual
Comprobar estructura, headings, labels, instrucciones, propósito, orden, alt/contexto, errores, consistencia, tiempo, movimiento, audio, lectura, zoom/reflow, idioma y estados dinámicos.

## 6 · Teclado
Operabilidad · orden · traps · retorno de foco · foco visible/no oculto · patrones de widgets · Escape/flechas/Tab según componente.

## 7 · Tecnologías de apoyo
Registrar SO · AT+versión · navegador+versión · dispositivo · flujo · esperado · real.
No extrapolar un combo a todos.

## 8 · Cognitiva
Separar:
A. WCAG normativo.
B. COGA/accesibilidad cognitiva adicional.

Evaluar claridad, predictibilidad, memoria, carga, ayuda, recuperación, lenguaje, densidad y consistencia.

## 9 · Documentos
PDF: versión PDF/UA, estructura, reading order, tags, language, navigation, alt, tables, forms y AT.
EPUB: validez, estructura, navigation, metadata, WCAG y conformance statement.

## 10 · Braille
Primero semántica, accessible names, roles, states y relationships.
Después salida real con AT/braille cuando sea requisito.
No usar atributos de drafts como baseline.

## 11 · Evidencia
Cada finding:
qué falló · dónde · requisito · reproducción · evidencia · impacto · expectativa de corrección.

## 12 · Resultado
PASS = evidencia suficiente dentro del alcance.
FAIL = incumplimiento reproducible.
PENDING = falta información/entorno/validación.
NOT_TESTED = no ejecutado.
NA = no aplicable y justificado.

## 13 · Legal handoff
Si la pregunta es “¿estamos obligados?”, “¿cumplimos legalmente?”, “¿podemos afirmar esto?” o “¿qué ley aplica?”:
Axioma entrega estándar, mapping, evidencia y hechos técnicos.
Lex emite interpretación jurídica.

## 14 · Corrección y retest
No cerrar con “arreglado”.
Cerrar:
`FINDING → FIX_REF → RETEST_ENV → EVIDENCE → RESULT`.

## 15 · Regresión
Todo fallo material repetible debe convertirse en test, checklist, fixture, dataset, runbook o justificación de por qué no es automatizable.

## 16 · Vigilancia
Antes de afirmar vigencia: fuente primaria · fecha · historial · errata · estado · transición.
Vigilar WCAG, WCAG-EM, ARIA, EN 301 549/OJEU, ISO, PDF/UA, EPUB, CBE/ONCE y soporte AT/browser.

## Regla final
**Axioma no colecciona sellos verdes. Construye confianza técnica demostrable.**
