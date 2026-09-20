# SABIK_VISUAL_COMPLIANCE_MATRIX_V1

Fecha: 20/09/2026

> Esta matriz registra evidencia de esta entrega. No equivale a una declaración global de conformidad WCAG/ISO del producto. Los requisitos que dependen de interacción, tecnologías de apoyo o pruebas con usuarios se mantienen como `PENDING HUMAN TEST` o `NOT APPLICABLE` en la fase estática.

| Norma | Cláusula / criterio | Activo | Comprobación | Resultado | Evidencia / pendiente |
|---|---|---|---|---|---|
| WCAG 2.2 | 1.1.1 Non-text Content | Familia visual en UI | Si la presencia transmite información, requiere alternativa textual; arte puramente decorativo puede ocultarse a AT. | NOT APPLICABLE | La entrega actual es un paquete estático; requisito registrado para integración UI. |
| WCAG 2.2 | 1.4.1 Use of Color | Web / IA / Educa / Matriz | La diferenciación estructural existe en monocromo y silueta; el significado no debe depender solo del color. | PASS | Activos monocromos y siluetas derivados de la misma geometría. |
| WCAG 2.2 | 1.4.3 Contrast (Minimum) | Textos de documentación | Contraste calculado de tokens de texto sobre fondos documentados. | PASS | #0B2450/white 15.19:1; #294A7A/white 8.92:1; white/#0E1D35 16.86:1. |
| WCAG 2.2 | 1.4.4 Resize Text | Interfaz futura | Comprobar textos a 200 % sin pérdida. | PENDING HUMAN TEST | No hay interfaz implementada en esta entrega. |
| WCAG 2.2 | 1.4.10 Reflow | Interfaz futura | Comprobar reflow sin scroll bidimensional indebido. | PENDING HUMAN TEST | No hay interfaz implementada en esta entrega. |
| WCAG 2.2 | 1.4.11 Non-text Contrast | Controles/estados futuros | Cuando la presencia sea parte de un control/estado, verificar contraste de límites/indicadores. | PENDING HUMAN TEST | Los activos actuales no constituyen controles. |
| WCAG 2.2 | 2.2.2 Pause, Stop, Hide | Animación futura | El movimiento no debe ser indispensable y debe poder detenerse cuando el criterio aplique. | NOT APPLICABLE | Fase actual estática; requisito bloqueante para Fase 3. |
| WCAG 2.2 | 2.3.1 Three Flashes or Below Threshold | Animación futura | Evitar destellos peligrosos. | NOT APPLICABLE | No hay animación en la entrega actual. |
| WCAG 2.2 | 2.4.7 Focus Visible | Componentes interactivos futuros | Foco visible para teclado. | NOT APPLICABLE | No hay controles interactivos en la entrega actual. |
| WCAG 2.2 | 2.4.11 Focus Not Obscured (Minimum) | Componentes interactivos futuros | El foco no debe quedar oculto. | NOT APPLICABLE | No hay controles interactivos en la entrega actual. |
| WCAG 2.2 | 4.1.2 Name, Role, Value | Componentes personalizados futuros | Usar HTML semántico; ARIA solo cuando sea necesario y con nombre/rol/valor correctos. | NOT APPLICABLE | No hay componentes implementados. |
| ISO/IEC 40500:2025 | WCAG 2.2 | Producto digital futuro | Aplicar la misma base de criterios WCAG 2.2. | PENDING HUMAN TEST | Evaluación completa requiere producto funcionando. |
| EN 301 549 V4.1.1 (2026-09) | 9.1–9.4 Web / WCAG 2.2 | Web futura | Usar WCAG 2.2 para requisitos web. | PENDING HUMAN TEST | La entrega visual no permite evaluar todas las precondiciones ni pruebas web. |
| EN 301 549 V4.1.1 (2026-09) | 9.7 User preferences | Web futura | No bloquear preferencias de usuario relevantes. | PENDING HUMAN TEST | Debe comprobarse en implementación. |
| WAI-ARIA 1.2 | First Rule of ARIA / roles-states-properties | Componentes personalizados futuros | Preferir HTML nativo antes que ARIA. | NOT APPLICABLE | Sin widgets interactivos en esta fase. |
| ISO 9241-171:2025 | Software accessibility | Software futuro | Evaluar accesibilidad para un rango amplio de capacidades. | PENDING HUMAN TEST | Requiere implementación y evaluación con tecnologías de apoyo. |
| ISO 9241-210:2019 | Human-centred design | Proceso | Incluir necesidades, contexto y evaluación con usuarios. | PENDING HUMAN TEST | Debe evidenciarse con pruebas de usuario. |
| ISO 9241-11:2018 | Usability | Producto/servicio | Evaluar eficacia, eficiencia y satisfacción en contexto de uso. | PENDING HUMAN TEST | Requiere prueba de uso real. |
| ISO 9241-112:2025 | Principles for presentation of information | Presentación | Aplicar principios de percepción y comprensión. | PENDING HUMAN TEST | Falta validación humana contextual. |
| ISO 9241-125:2017 | Guidance on visual presentation | Presentación visual | Organizar/codificar información teniendo en cuenta percepción y memoria. | PENDING HUMAN TEST | La comprensión contextual exige evaluación. |
| ISO 24495-1:2023 | Plain language | Sistema verbal | Usar textos fáciles de encontrar, entender y usar; redacción oficial congelada. | PASS | Sistema verbal aprobado y directo. |
| W3C COGA Content Usable | Objective 3 | Textos/explicaciones | Usar contenido claro y fácil de entender. | PASS | Sistema verbal oficial breve y directo; no sustituye test con usuarios. |
| W3C COGA Content Usable | Objective 5 | Interfaz futura | Evitar distracciones y movimiento decorativo innecesario. | PENDING HUMAN TEST | Validación pertenece a integración/UI. |
| Reglamento (UE) 2024/1689 | Artículo 50.1 y 50.5 | Interacción IA futura | Informar de forma clara y accesible de que se interactúa con IA cuando corresponda. | NOT APPLICABLE | La familia visual no es la interfaz de primera interacción. |
| ISO 14289-2:2024 | PDF/UA-2 | Guía PDF futura | Si se publica PDF, construirlo como documento PDF accesible y estructurado. | NOT APPLICABLE | No se entrega PDF en este paquete. |
| Proyecto Sabik | Reduced Motion | Fase 3 B3 | Variante reducida y equivalente estática. | NOT APPLICABLE | Fase 2D es estática. |
| Proyecto Sabik | 32 px mínimo recomendado | Cuatro presencias | Preparar 64/40/32; mantener 24 como prueba no estándar. | PASS | Derivados generados desde el mismo master. |
| Proyecto Sabik | Diferenciación sin color | Cuatro presencias | Distinguir Matriz/Web/IA/Educa por estructura, no solo color. | PASS | Monocromos y siluetas incluidos; IA sin órbitas/trazos añadidos. |

## Fuentes verificadas

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- ISO/IEC 40500:2025: https://www.iso.org/standard/91029.html
- ETSI EN 301 549 V4.1.1: https://www.etsi.org/technical-groups/hf/
- ISO 9241-171:2025: https://www.iso.org/standard/86308.html
- ISO 9241-210:2019: https://www.iso.org/standard/77520.html
- ISO 9241-11:2018: https://www.iso.org/standard/63500.html
- ISO 9241-112:2025: https://www.iso.org/standard/87518.html
- ISO 9241-125:2017: https://www.iso.org/standard/64839.html
- ISO 24495-1:2023: https://www.iso.org/standard/78907.html
- W3C COGA: https://www.w3.org/TR/coga-usable/
- Reglamento (UE) 2024/1689, artículo 50: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- ISO 14289-2:2024: https://www.iso.org/standard/82278.html

## Nota jurídica/técnica

EN 301 549 V4.1.1 figura publicada por ETSI en 2026-09. La matriz la usa como referencia técnica del proyecto; la condición jurídica de una norma armonizada depende de la citación aplicable y no se infiere de esta matriz.