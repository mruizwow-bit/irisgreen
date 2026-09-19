# Matriz de pruebas y puertas S0–S8

**Issue:** #149  
**Regla:** ninguna fase se considera terminada por tener build verde. Toda prueba se clasifica por criticidad y por tipo.

## Leyenda

**Criticidad**

- `BLOQUEANTE`: impide cerrar la fase.
- `INFORMATIVA`: aporta señal, cobertura o diagnóstico; no puede ocultar un bloqueo.
- `MANUAL`: requiere juicio humano o tecnología de asistencia real. Una prueba manual puede ser bloqueante para la salida de una fase aunque no sea automatizable.

**Tipo**

- `UNITARIA`
- `INTEGRACIÓN`
- `NAVEGADOR`
- `AUDITORÍA_ESTÁTICA`
- `RENDIMIENTO`
- `SEGURIDAD`
- `REVISIÓN_EDITORIAL`
- `AT_REAL`

`AT_REAL` significa NVDA, JAWS, VoiceOver, TalkBack o línea braille real. No se sustituye por axe, Lighthouse, Accessibility Tree ni una simulación de eventos.

## S0 · Máquina de estados

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S0-Q01 | Matriz ejecutable: todas las filas tienen esquema completo | BLOQUEANTE | UNITARIA | runner |
| S0-Q02 | Pureza: sin DOM, red, storage, reloj ni aleatoriedad | BLOQUEANTE | UNITARIA / AUDITORÍA_ESTÁTICA | runner + revisión |
| S0-Q03 | Determinismo | BLOQUEANTE | UNITARIA | runner |
| S0-Q04 | Inmutabilidad de estado y evento | BLOQUEANTE | UNITARIA | runner |
| S0-Q05 | Valores cerrados y estado serializable | BLOQUEANTE | UNITARIA | runner |
| S0-Q06 | Eventos prohibidos se rechazan explícitamente | BLOQUEANTE | UNITARIA | runner |
| S0-Q07 | Ocultar/plegar no altera pausa | BLOQUEANTE | UNITARIA | caso canónico |
| S0-Q08 | Reset independiente y sin rebajar riesgo | BLOQUEANTE | UNITARIA / SEGURIDAD | caso canónico |
| S0-Q09 | Voz y movimiento independientes | BLOQUEANTE | UNITARIA | caso canónico |
| S0-Q10 | Seguridad prevalece sobre errores y decoración | BLOQUEANTE | SEGURIDAD | caso canónico |
| S0-Q11 | Diff de PR #161 limitado a alcance permitido | BLOQUEANTE | AUDITORÍA_ESTÁTICA | diff |
| S0-Q12 | Tests propios de S0, test legacy y build | BLOQUEANTE | INTEGRACIÓN | logs |
| S0-Q13 | Cobertura de ramas de transición | INFORMATIVA | UNITARIA | reporte |
| S0-Q14 | Revisión semántica de nombres/capas | MANUAL | REVISIÓN_EDITORIAL | PR #162 |

**Puerta:** S1 no empieza sin aceptación S0, revisión semántica, runner canónico ejecutado y cero contradicciones bloqueantes.

## S1 · Controles, foco y accesibilidad del panel

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S1-Q01 | Solo teclado: abrir, enviar, pausar, reanudar, reset, plegar/expandir | BLOQUEANTE | NAVEGADOR | Playwright/equivalente |
| S1-Q02 | Orden de foco lógico | BLOQUEANTE | NAVEGADOR | traza de foco |
| S1-Q03 | Retorno de foco al control invocador al cerrar/ocultar | BLOQUEANTE | NAVEGADOR | traza |
| S1-Q04 | Foco visible y no oculto por contenido fijo | BLOQUEANTE | NAVEGADOR | captura + inspección |
| S1-Q05 | Semántica/roles/nombres accesibles coherentes | BLOQUEANTE | AUDITORÍA_ESTÁTICA / NAVEGADOR | árbol accesible |
| S1-Q06 | Respuesta insertada como unidad, no por tokens en live region | BLOQUEANTE | NAVEGADOR | MutationObserver de prueba |
| S1-Q07 | NVDA anuncia respuesta una vez y de forma coherente | MANUAL | AT_REAL | protocolo firmado |
| S1-Q08 | JAWS anuncia respuesta una vez y de forma coherente | MANUAL | AT_REAL | protocolo firmado |
| S1-Q09 | VoiceOver macOS/iOS: navegación y anuncio | MANUAL | AT_REAL | protocolo firmado |
| S1-Q10 | TalkBack Android: navegación y anuncio | MANUAL | AT_REAL | protocolo firmado |
| S1-Q11 | Línea braille: foco, etiqueta y respuesta legible | MANUAL | AT_REAL | protocolo firmado |

**Puerta:** las pruebas AT reales no se marcan «pasadas» por inferencia automática.

## S2 · Voz y movimiento

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S2-Q01 | Especificación de Design disponible y sin contradicción con S0/S1 | BLOQUEANTE | REVISIÓN_EDITORIAL | PR #163 |
| S2-Q02 | Voz nunca automática | BLOQUEANTE | NAVEGADOR / SEGURIDAD | test |
| S2-Q03 | Iniciar, pausar, reanudar, detener, fin natural y error | BLOQUEANTE | NAVEGADOR | test |
| S2-Q04 | Ondas quietas cuando Sabik calla | BLOQUEANTE | NAVEGADOR | inspección temporal |
| S2-Q05 | Movimiento reactivo solo mientras hay locución activa | BLOQUEANTE | NAVEGADOR | test |
| S2-Q06 | `prefers-reduced-motion` elimina movimiento sin impedir texto/voz | BLOQUEANTE | NAVEGADOR | emulación |
| S2-Q07 | Preferencia manual de movimiento independiente de voz | BLOQUEANTE | NAVEGADOR | test |
| S2-Q08 | Texto completo disponible aunque TTS falle o esté desactivado | BLOQUEANTE | INTEGRACIÓN | test |
| S2-Q09 | Percepción real de controles de voz con lector | MANUAL | AT_REAL | NVDA/VoiceOver/TalkBack |

## S3 · Seguridad y recursos humanos

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S3-Q01 | Riesgo directo activa prioridad de seguridad | BLOQUEANTE | SEGURIDAD / INTEGRACIÓN | corpus |
| S3-Q02 | Riesgo ambiguo pide aclaración sin afirmar riesgo confirmado | BLOQUEANTE | SEGURIDAD / INTEGRACIÓN | corpus |
| S3-Q03 | Negación explícita evita falso positivo cuando corresponde | BLOQUEANTE | SEGURIDAD / INTEGRACIÓN | corpus |
| S3-Q04 | Coincidencia léxica no basta para activar riesgo | BLOQUEANTE | SEGURIDAD | corpus |
| S3-Q05 | Recursos humanos tienen territorio, autoridad y vigencia verificables | BLOQUEANTE | REVISIÓN_EDITORIAL / SEGURIDAD | ficha de fuente |
| S3-Q06 | No se inventan teléfonos, URLs, territorios ni fechas | BLOQUEANTE | SEGURIDAD | corpus + revisión |
| S3-Q07 | Mensaje de seguridad es claro, breve y no queda oculto por decoración | MANUAL | REVISIÓN_EDITORIAL | revisión |
| S3-Q08 | Cobertura de patrones de riesgo | INFORMATIVA | INTEGRACIÓN | reporte |

## S4 · Contexto, correcciones y degradación

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S4-Q01 | Corrección sustituye hipótesis anterior | BLOQUEANTE | INTEGRACIÓN | corpus |
| S4-Q02 | Negaciones se conservan | BLOQUEANTE | INTEGRACIÓN | corpus |
| S4-Q03 | Contexto de sesión se usa sin historial entre sesiones | BLOQUEANTE | INTEGRACIÓN / SEGURIDAD | test |
| S4-Q04 | Ambigüedad produce aclaración mínima | BLOQUEANTE | INTEGRACIÓN | corpus |
| S4-Q05 | «No me preguntes» evita preguntas no esenciales | BLOQUEANTE | INTEGRACIÓN | corpus |
| S4-Q06 | Error técnico no se convierte en insuficiencia | BLOQUEANTE | INTEGRACIÓN | test |
| S4-Q07 | Entrada larga conserva intención principal | BLOQUEANTE | INTEGRACIÓN | corpus |
| S4-Q08 | Doble envío no duplica respuesta/anuncio | BLOQUEANTE | NAVEGADOR / INTEGRACIÓN | test |
| S4-Q09 | Calidad de la corrección conversacional | MANUAL | REVISIÓN_EDITORIAL | muestra |

## S5 · Contrato local, idioma y datos

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S5-Q01 | Sin API remota de IA ni telemetría conversacional no autorizada | BLOQUEANTE | SEGURIDAD / AUDITORÍA_ESTÁTICA | revisión |
| S5-Q02 | Sin persistencia de mensajes/conceptos/respuestas entre sesiones | BLOQUEANTE | SEGURIDAD / NAVEGADOR | storage inspection |
| S5-Q03 | Cambio de idioma no reinicia sesión | BLOQUEANTE | INTEGRACIÓN | test |
| S5-Q04 | Idioma de respuesta coherente con estado | BLOQUEANTE | INTEGRACIÓN | corpus ES/EN |
| S5-Q05 | Datos opcionales ausentes producen aclaración, no invención | BLOQUEANTE | INTEGRACIÓN | corpus |
| S5-Q06 | Fuentes con territorio/fecha cuando el dato lo exige | BLOQUEANTE | REVISIÓN_EDITORIAL | auditoría |
| S5-Q07 | Datos públicos cargan sin degradar navegación convencional | BLOQUEANTE | NAVEGADOR | test |
| S5-Q08 | Tamaño/tiempo de carga del contrato local | INFORMATIVA | RENDIMIENTO | métricas |

## S6 · Índice funcional y recuperación avanzada

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S6-Q01 | Cobertura por intención del corpus acordado | BLOQUEANTE | INTEGRACIÓN | reporte |
| S6-Q02 | Falsas coincidencias semánticas bajo umbral contractual | BLOQUEANTE | INTEGRACIÓN | corpus negativo |
| S6-Q03 | Consultas respondibles no caen en falso «no tengo información» | BLOQUEANTE | INTEGRACIÓN | métrica separada |
| S6-Q04 | Recuperación respeta idioma/territorio/tipo de fuente | BLOQUEANTE | INTEGRACIÓN | fixtures |
| S6-Q05 | Latencia local en dispositivos objetivo | INFORMATIVA | RENDIMIENTO | percentiles |
| S6-Q06 | Revisión de unidad recuperable e índice | MANUAL | REVISIÓN_EDITORIAL | PR semántica |

## S7 · Composición, incertidumbre y procedencia

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S7-Q01 | Conceptos esperados presentes cuando la evidencia los sostiene | BLOQUEANTE | INTEGRACIÓN | corpus |
| S7-Q02 | Conceptos prohibidos ausentes | BLOQUEANTE | INTEGRACIÓN / SEGURIDAD | corpus |
| S7-Q03 | Incertidumbre se expresa cuando corresponde | BLOQUEANTE | INTEGRACIÓN | corpus |
| S7-Q04 | Procedencia visible y no inventada | BLOQUEANTE | REVISIÓN_EDITORIAL / INTEGRACIÓN | revisión |
| S7-Q05 | Falsa respuesta medida por separado | BLOQUEANTE | INTEGRACIÓN | métrica |
| S7-Q06 | Pertinencia de primera respuesta medida por separado | INFORMATIVA | INTEGRACIÓN / REVISIÓN_EDITORIAL | métrica |
| S7-Q07 | Calidad de claridad y lectura clara | MANUAL | REVISIÓN_EDITORIAL | muestra |

## S8 · Regresión y salida pública

| ID | Prueba | Criticidad | Tipo | Evidencia |
|---|---|---|---|---|
| S8-Q01 | Regresión S0–S7 completa | BLOQUEANTE | INTEGRACIÓN | suite |
| S8-Q02 | Solo teclado y foco en navegadores objetivo | BLOQUEANTE | NAVEGADOR | suite |
| S8-Q03 | 200 % texto, 400 % zoom y 320 CSS px sin pérdida funcional | BLOQUEANTE | NAVEGADOR | capturas + assertions |
| S8-Q04 | Colores forzados y movimiento reducido | BLOQUEANTE | NAVEGADOR | suite |
| S8-Q05 | NVDA/JAWS/VoiceOver/TalkBack | MANUAL | AT_REAL | protocolo |
| S8-Q06 | Línea braille real | MANUAL | AT_REAL | protocolo |
| S8-Q07 | Auditoría de seguridad e integridad | BLOQUEANTE | SEGURIDAD | informe |
| S8-Q08 | Rendimiento sin regresión grave | BLOQUEANTE | RENDIMIENTO | presupuestos |
| S8-Q09 | Revisión editorial final de textos, fuentes y límites | MANUAL | REVISIÓN_EDITORIAL | aprobación |
| S8-Q10 | Declaración/documentación pública actualizada | BLOQUEANTE | REVISIÓN_EDITORIAL | diff |
| S8-Q11 | Decisión explícita separada sobre `noindex` | BLOQUEANTE | REVISIÓN_EDITORIAL / SEGURIDAD | registro de decisión |

## Regla de `noindex`

Ningún PR de implementación puede retirar `noindex` por el mero hecho de completar código. Su retirada requiere una decisión explícita posterior a las puertas de accesibilidad, seguridad, regresión y documentación pública. El estado verde de S8 es condición previa, no autorización automática.
