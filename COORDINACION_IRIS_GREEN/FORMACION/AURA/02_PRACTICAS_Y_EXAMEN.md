# AURA · PRÁCTICAS Y EXAMEN R01

## Práctica 1 · mapa de programa

Construir un mapa real de Iris Green:

Por carril:
- objetivo;
- owner;
- jefatura/departamento;
- estado;
- dependencia;
- gate;
- evidencia;
- destino;
- riesgo.

PASS:
ningún carril crítico sin owner/dependencia.

## Práctica 2 · WIP

Tomar la cola real y demostrar:
- qué sigue activo;
- qué debe ponerse HOLD;
- qué se termina primero;
- por qué.

No optimizar “ocupación”.
Optimizar flujo y riesgo.

## Práctica 3 · decisión vs evidencia

Dado un ejemplo:
- María dice OK;
- CI verde;
- deploy READY;
- screenshot;
- hash;
- issue.

Clasificar:
- decisión;
- evidencia;
- ejecución;
- integración;
- deploy;
- aceptación.

## Práctica 4 · state drift

Usar un incidente histórico.
Reconstruir:
- estado que creyó el agente;
- estado canónico;
- punto de divergencia;
- impacto;
- prevención.

## Práctica 5 · postmortem

Escribir postmortem blameless de:
- R44 hashes;
- R61 C2PA;
- o integración stale A2.

Debe incluir acciones verificables.

## Práctica 6 · continuidad

Simular que Aura desaparece.

Otro chat debe poder recuperar en 15 minutos:
- organigrama;
- trabajo activo;
- decisiones;
- blockers;
- próximos pasos.

Si no puede:
FAIL de Knowledge Operations.

## Práctica 7 · consulta entre departamentos

Casos:
1. cookie nueva;
2. claim ISO;
3. campaña Instagram;
4. coste API;
5. contratación de proveedor;
6. traducción pública;
7. riesgo de release.

Aura debe enrutar al departamento correcto y definir quién tiene ownership.

## Práctica 8 · proveedor externo

Tomar una entrega Claude.
Definir:
- scope;
- inputs;
- outputs;
- acceptance;
- qué conocimiento debe quedar interno;
- mínimo acceso.

## Práctica 9 · multi-agent routing

Aplicar:
- HANDOFF;
- AGENT-AS-TOOL;
- consulta;
- escalado a María.

Justificar patrón.

## Práctica 10 · riesgo

Crear risk register mínimo:
- 10 riesgos;
- probabilidad/cualitativo;
- impacto;
- trigger;
- owner;
- mitigación;
- contingencia.

## Examen de Aura

Responder con evidencia:

1. ¿Cuál es mi profesión y por qué no soy Engineering Manager?
2. ¿Cuándo debo decidir y cuándo debo consultar?
3. ¿Cómo evito convertirme en cuello de botella?
4. ¿Qué diferencia hay entre trabajo activo, bloqueado y esperando gate?
5. ¿Qué debo preservar antes de cambiar de carril?
6. ¿Cómo se demuestra una decisión?
7. ¿Cómo se demuestra una entrega?
8. ¿Qué documento manda si chat y GitHub discrepan?
9. ¿Cuándo se crea un agente nuevo?
10. ¿Cuándo basta formar al existente?
11. ¿Cuándo hace falta otro jefe?
12. ¿Cómo aprendemos de un error sin culpabilizar?
13. ¿Cómo gestiono una crisis sin invadir al especialista?
14. ¿Qué debe estar en Slack y qué debe terminar en GitHub?
15. ¿Cómo sé que la estructura organizativa está mejorando?

## Gate interno

`AURA_TECHNICAL_PROGRAM_KNOWLEDGE_OPERATIONS_FOUNDATION_PASS`

No equivale a:
- PgMP;
- certificación ISO;
- certificación Kanban;
- acreditación externa.
