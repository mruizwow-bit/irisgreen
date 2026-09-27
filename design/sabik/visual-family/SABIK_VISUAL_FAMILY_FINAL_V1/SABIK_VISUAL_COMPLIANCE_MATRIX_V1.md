# SABIK_VISUAL_COMPLIANCE_MATRIX_V1_R1

Fecha: 20/09/2026

> Esta matriz registra evidencia de la entrega R1. No constituye una declaración global de conformidad del producto. Cada `PASS` queda limitado al activo o texto identificado.

| Norma | Cláusula / criterio | Activo | Comprobación | Resultado | Evidencia / pendiente |
|---|---|---|---|---|---|
| WCAG 2.2 | 1.1.1 Non-text Content | Presencia en UI futura | Cuando la presencia sea informativa, proporcionar alternativa textual programática; si es decorativa, ocultarla a AT. | NOT APPLICABLE | Paquete gráfico estático; verificar en integración UI. |
| WCAG 2.2 | 1.4.1 Use of Color | Cuatro presencias | Existen versiones sin color derivadas del mismo master; el significado funcional no deberá depender solo del color. | PASS | Evidencia técnica de derivación. La discriminación perceptiva final se separa en otra fila. |
| Proyecto Sabik | Diferenciación perceptiva sin color | Cuatro siluetas R1 | Inspeccionar si Matriz/Web/IA/Educa se diferencian suficientemente sin etiquetas, color ni brillo. | PENDING HUMAN TEST | Siluetas corregidas en R1; requiere revisión perceptiva de Astra/usuarios. |
| WCAG 2.2 | 1.4.3 Contrast (Minimum) | Tokens de texto documentados | Contraste de tokens sobre fondos declarados. | PASS | #0B2450/white ≈15.19:1; #294A7A/white ≈8.92:1; white/#0E1D35 ≈16.86:1. Alcance: tokens de documentación. |
| WCAG 2.2 | 1.4.4 Resize Text | UI futura | Comprobar texto a 200 % sin pérdida. | PENDING HUMAN TEST | No existe UI implementada en esta entrega. |
| WCAG 2.2 | 1.4.10 Reflow | UI futura | Comprobar reflow en viewport equivalente a 320 CSS px. | PENDING HUMAN TEST | No existe UI implementada. |
| WCAG 2.2 | 1.4.11 Non-text Contrast | Controles/estados futuros | Verificar contraste de indicadores necesarios para identificar controles/estados. | PENDING HUMAN TEST | Los assets aislados no son controles. |
| WCAG 2.2 | 2.2.2 Pause, Stop, Hide | Animación futura | Movimiento no indispensable y controlable cuando aplique. | NOT APPLICABLE | Fase 2D-R1 estática; requisito para Fase 3. |
| WCAG 2.2 | 2.3.1 Three Flashes or Below Threshold | Animación futura | Evitar destellos peligrosos. | NOT APPLICABLE | Sin animación. |
| WCAG 2.2 | 2.4.7 Focus Visible | UI futura | Foco visible. | NOT APPLICABLE | Sin componentes interactivos. |
| WCAG 2.2 | 2.4.11 Focus Not Obscured (Minimum) | UI futura | Foco no oculto. | NOT APPLICABLE | Sin componentes interactivos. |
| WCAG 2.2 | 4.1.2 Name, Role, Value | Widgets futuros | Preferir HTML nativo; ARIA 1.2 solo cuando sea necesario. | NOT APPLICABLE | Sin widgets. |
| ISO/IEC 40500:2025 | WCAG 2.2 | Producto digital futuro | Aplicar la base WCAG 2.2. | PENDING HUMAN TEST | La familia gráfica no permite evaluar el producto completo. |
| EN 301 549 V4.1.1 (2026-09) | Requisitos web / WCAG 2.2 | Web futura | Evaluar requisitos aplicables sobre implementación. | PENDING HUMAN TEST | No extrapolar publicación técnica a conformidad global del producto. |
| WAI-ARIA 1.2 | First Rule of ARIA | Widgets futuros | Usar HTML semántico antes que ARIA innecesaria. | NOT APPLICABLE | Sin widgets. |
| ISO 9241-171:2025 | Software accessibility | Software futuro | Evaluación de accesibilidad de software en contexto. | PENDING HUMAN TEST | Requiere implementación y tecnologías de apoyo. |
| ISO 9241-210:2019 | Human-centred design | Proceso | Incluir contexto, necesidades y evaluación con usuarios. | PENDING HUMAN TEST | Requiere evidencia del proceso y pruebas. |
| ISO 9241-11:2018 | Usability | Producto futuro | Evaluar eficacia, eficiencia y satisfacción. | PENDING HUMAN TEST | Requiere uso real. |
| ISO 9241-112:2025 | Presentation of information | Activos visuales + producto | Evaluar presentación en contexto de uso. | PENDING HUMAN TEST | La revisión técnica no sustituye evaluación contextual. |
| ISO 9241-125:2017 | Visual presentation | Activos visuales + producto | Evaluar organización/codificación visual en contexto. | PENDING HUMAN TEST | La revisión técnica no demuestra comprensión humana. |
| ISO 24495-1:2023 | Plain language | Sistema verbal oficial | Revisión editorial del texto congelado. | PASS | Alcance exclusivo de los tres textos oficiales y terminología de familia. |
| W3C COGA Content Usable | Objective 3 · alcance editorial | Sistema verbal oficial | Texto breve, directo y orientado a comprensión/uso. | PASS | Alcance solo del sistema verbal evaluado; no del producto completo. |
| W3C COGA Content Usable | Distracciones / apoyo cognitivo | UI futura | Evitar distracciones y movimiento decorativo innecesario. | PENDING HUMAN TEST | Validación en Fase 3/UI. |
| Reglamento (UE) 2024/1689 | Artículo 50.1 | Interacción IA futura | Informar de la interacción con IA cuando corresponda. | NOT APPLICABLE | La familia gráfica aislada no es la primera interacción. |
| ISO 14289-2:2024 | PDF/UA-2 | Guía PDF futura | Si existe PDF, crear documento estructurado y accesible. | NOT APPLICABLE | No se entrega PDF en R1. |
| Proyecto Sabik | Derivación técnica 32 px | Cuatro assets 32 px | Generar correctamente desde el master único. | PASS | Los cuatro PNG de 32 px se regeneran y coinciden por SHA-256. |
| Proyecto Sabik | Percepción a 32 px | Cuatro presencias | Validar identidad suficiente a tamaño real y contexto de uso. | PENDING HUMAN TEST | La existencia del archivo no demuestra percepción humana. |
| Proyecto Sabik | 24 px | Prueba de resistencia | Mantener como prueba, no tamaño estándar. | PASS | Activos incluidos y etiquetados como no estándar. |
| Proyecto Sabik | Reproducibilidad | Masters → derivados | Rebuild limpio y comparación SHA-256. | PASS | `REPRODUCIBILITY_PASS`, 54 archivos comprobados, 0 diferencias. |

Las referencias normativas adoptadas por el proyecto se mantienen sin cambios.