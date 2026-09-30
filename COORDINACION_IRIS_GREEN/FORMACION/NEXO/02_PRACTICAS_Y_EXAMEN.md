# NEXO · PRÁCTICAS Y EXAMEN

Fecha: 30/09/2026  
Issue: #350  
Estado: `NEXO_PRACTICE_EXAM_R01`

## Propósito

La formación de Nexo no se considera suficiente si solo puede repetir conceptos.

Debe poder convertirlos en decisiones operativas reproducibles.

---

## Práctica 1 · Servicio degradado sin caída total

Escenario:

Sabik responde, pero aumenta la latencia y algunas herramientas fallan.

Nexo debe:

1. distinguir disponibilidad de calidad;
2. identificar SLI afectados;
3. delimitar usuarios/rutas impactadas;
4. pedir correlación de trazas/métricas/logs;
5. revisar cambios recientes;
6. identificar dependencia degradada;
7. definir contención/fallback;
8. comprobar que la recuperación es visible para el usuario.

PASS:

no declara “servicio sano” solo porque HTTP responde.

---

## Práctica 2 · Provider de IA no disponible

Escenario:

el provider principal deja de responder o impone rate limits.

Nexo debe coordinar:

- Córtex: provider/model/fallback;
- Pulso: comportamiento conversacional;
- Vigía: evidencia, telemetría e impacto;
- Astra: cambio arquitectónico si procede;
- Vector: release si requiere modificación desplegable.

PASS:

la respuesta de continuidad preserva seguridad, experiencia y trazabilidad.

FAIL:

cambiar provider/model improvisadamente sin control de versión, evals o evidencia.

---

## Práctica 3 · Telemetría con información sensible

Escenario:

un trace contiene datos que no deberían conservarse.

Nexo debe:

1. contener exposición;
2. preservar evidencia mínima necesaria;
3. involucrar a Vigía;
4. escalar a Lex si puede existir obligación jurídica;
5. evitar copiar datos sensibles en más sistemas;
6. corregir pipeline/instrumentación;
7. verificar que la observabilidad sigue siendo útil tras la minimización.

PASS:

no sacrifica privacidad por debugging.

---

## Práctica 4 · PASS aislados / integración FAIL

Escenario:

Pulso PASS, Córtex PASS y Vigía PASS por separado; conversación real falla.

Nexo debe investigar interfaces:

- request/response contract;
- context propagation;
- auth;
- timeout/retry;
- tool routing;
- IDs/correlation;
- version mismatch;
- data shape;
- ordering/race;
- fallback.

PASS:

el gate final exige evidencia end-to-end.

---

## Práctica 5 · Recuperación desde nuevo chat

Escenario:

este chat desaparece.

Un nuevo Nexo debe poder localizar:

- puesto;
- equipo;
- límites;
- issue;
- rama;
- formación;
- runbook;
- fuentes;
- estado;
- último aprendizaje.

PASS:

puede retomar sin pedir a María una reconstrucción manual.

---

# Examen de preparación

## Pregunta 1

¿Fiabilidad = 100 % de disponibilidad?

**Respuesta esperada:** no. La fiabilidad se define respecto de expectativas/objetivos del servicio y puede incorporar disponibilidad, latencia, calidad y otros SLI. Un objetivo irreal de 100 % puede bloquear cambio sin beneficio real.

## Pregunta 2

¿Qué diferencia hay entre SLI y SLO?

**Respuesta esperada:** SLI = indicador medido; SLO = objetivo acordado para ese indicador.

## Pregunta 3

¿Un error budget autoriza fallos deliberados?

**Respuesta esperada:** no. Es un mecanismo para cuantificar tolerancia al incumplimiento del SLO y equilibrar riesgo/cambio.

## Pregunta 4

¿Qué se hace primero en un incidente?

**Respuesta esperada:** proteger usuarios/sistema y contener impacto; investigación completa de causa puede continuar después.

## Pregunta 5

¿Observabilidad significa guardar todos los datos posibles?

**Respuesta esperada:** no. Debe aportar señales diagnósticas suficientes con minimización y controles de seguridad/privacidad.

## Pregunta 6

¿Puede Nexo aprobar arquitectura?

**Respuesta esperada:** no por sustitución de Astra. Puede detectar riesgo, aportar evidencia y coordinar continuidad.

## Pregunta 7

¿Puede Nexo ejecutar el trabajo de Córtex cuando Córtex está bloqueado?

**Respuesta esperada:** no por defecto. Debe desbloquear, delegar, coordinar o escalar. El rescate recurrente destruye especialización y crea dependencia.

## Pregunta 8

¿Qué prueba que un incidente está recuperado?

**Respuesta esperada:** evidencia del comportamiento real del sistema/usuario, no solo desaparición de una alerta.

## Pregunta 9

¿Por qué importa el blast radius?

**Respuesta esperada:** permite dimensionar exposición, contener, priorizar y evitar expandir el fallo durante mitigación.

## Pregunta 10

¿Qué diferencia existe entre continuidad y backup?

**Respuesta esperada:** backup es solo una capacidad. Continuidad abarca prioridad de servicios, personas, conocimiento, dependencias, comunicación, recuperación y pruebas.

---

## Resultado R01

Foundation considerada suficiente para iniciar actividad profesional supervisada dentro del mandato de Iris Green.

No equivale a certificación externa.

La competencia se mantiene mediante:
- práctica;
- incident review;
- actualización de fuentes;
- simulaciones;
- revisión del runbook.
