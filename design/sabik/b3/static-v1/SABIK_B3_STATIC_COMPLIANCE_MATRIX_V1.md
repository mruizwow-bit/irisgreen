# SABIK_B3_STATIC_COMPLIANCE_MATRIX_V1

No constituye una declaración global de conformidad. Separa verificación técnica de percepción humana.

| Norma | Criterio | Activo | Comprobación | Resultado | Evidencia / pendiente |
|---|---|---|---|---|---|
| WCAG 2.2 | 1.1.1 Non-text Content | Estados B3 en futura UI | El estado funcional debe tener nombre/alternativa textual programática. | PENDING HUMAN TEST | La especificación define señal textual; verificar implementación real. |
| WCAG 2.2 | 1.4.1 Use of Color | 15 keyframes | Cada estado existe en color y monocromo; la operación estructural cambia sin depender solo de color. | PASS | Assets monocromos y gramática estructural incluidos. |
| Proyecto Sabik | Diferenciación perceptiva monocroma | 15 keyframes monocromos | Comprobar que PRESENTE/ORIENTAR/TRANSICIÓN/PAUSA/CONFIRMAR se distinguen en uso real. | PENDING HUMAN TEST | La prueba técnica existe; requiere evaluación perceptiva. |
| WCAG 2.2 | 1.4.3 Contrast (Minimum) | Textos de las láminas/documentación | Tokens de texto oscuro sobre blanco en las láminas. | PASS | Texto principal #0B2450 y secundario #294A7A sobre blanco; contraste ya verificado en familia aceptada. |
| WCAG 2.2 | 1.4.11 Non-text Contrast | Futura UI/controles | La presencia no se usa aquí como límite de control. | NOT APPLICABLE | Evaluar si posteriormente forma parte de un control. |
| WCAG 2.2 | 2.2.2 Pause, Stop, Hide | Fase 3A | No hay animación; PAUSA es un keyframe estático. | NOT APPLICABLE | Motion se diseña en 3B. |
| WCAG 2.2 | 2.3.1 Three Flashes or Below Threshold | Fase 3A | Sin destellos ni animación. | NOT APPLICABLE | Motion futuro deberá conservar esta restricción. |
| WCAG 2.2 | 2.3.3 Animation from Interactions | Fase 3B futura | La función debe sobrevivir a Reduced Motion. | PENDING HUMAN TEST | 3A documenta equivalente estático; implementación futura pendiente. |
| WCAG 2.2 | 2.4.7 Focus Visible | Futura UI | No hay controles interactivos en esta entrega. | NOT APPLICABLE | Verificar en implementación. |
| ISO/IEC 40500:2025 | WCAG 2.2 | Producto digital futuro | Misma base WCAG 2.2. | PENDING HUMAN TEST | No se declara conformidad global del producto. |
| EN 301 549 V4.1.1 | Web / software aplicable | Producto futuro | Evaluar sobre implementación real. | PENDING HUMAN TEST | Fase 3A es diseño estático. |
| ISO 9241-171:2025 | Software accessibility | Producto futuro | Estado comprensible con alternativa textual, estático y Reduced Motion. | PENDING HUMAN TEST | Validación con software/AT pendiente. |
| ISO 9241-210:2019 | Human-centred design | Proceso | Requiere evaluación con personas usuarias. | PENDING HUMAN TEST | No se infiere desde assets. |
| ISO 9241-11:2018 | Usabilidad | Producto futuro | Eficacia/eficiencia/satisfacción en contexto. | PENDING HUMAN TEST | Pendiente prueba de uso. |
| ISO 9241-112:2025 | Presentation of information | Láminas + estados | Función, cambio e invariantes se documentan explícitamente. | PASS | Alcance limitado a la documentación de 3A. |
| ISO 9241-125:2017 | Visual presentation | Keyframes | Una gramática consistente se proyecta sobre las tres presencias. | PASS | Alcance técnico/documental; percepción humana separada. |
| ISO 24495-1:2023 | Plain language | Señales textuales B3 | Frases breves, directas y orientadas a la acción/estado. | PASS | Alcance: microcopy propuesta en esta especificación. |
| W3C COGA Content Usable | Claridad y reducción de distracción | B3 estático | PAUSA reduce actividad; no se crean señales decorativas o emocionales. | PASS | Alcance: contrato de diseño; validar con usuarios posteriormente. |
| Proyecto Sabik | Reduced Motion por diseño | 5 estados | Cada estado tiene representación estática equivalente. | PASS | No hay función que dependa de animación en 3A. |
| Proyecto Sabik | 64 px | 15 keyframes | Generación técnica de todos los estados a 64 px. | PASS | 45? no: 15 PNG color a 64 px generados. |
| Proyecto Sabik | 32 px técnica | 15 keyframes | Generación técnica de todos los estados a 32 px. | PASS | 15 PNG color a 32 px generados. |
| Proyecto Sabik | 32 px percepción | 15 keyframes | Distinguir función a tamaño real. | PENDING HUMAN TEST | No inferir percepción de la existencia del archivo. |
| Proyecto Sabik | Voz separada de B3 | Compatibilidad #163 | No se crea estado B3 de voz. | PASS | Matriz de compatibilidad clasifica voz como VOICE_LAYER. |
| Proyecto Sabik | Safety separada de B3 | Compatibilidad #163 | Riesgo/derivación no generan estados B3 nuevos. | PASS | Matriz de compatibilidad clasifica Safety por separado. |
| Proyecto Sabik | Matriz no es producto | Lámina E | Presencia Matriz solo como origen y control familiar. | PASS | No se generaron estados de Matriz. |