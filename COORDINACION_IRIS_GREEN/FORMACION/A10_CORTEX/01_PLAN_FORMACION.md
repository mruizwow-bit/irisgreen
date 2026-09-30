# CÓRTEX · PLAN DE FORMACIÓN R01

Fecha: 30/09/2026
Issue: #347

Estado:
`A10_CORTEX_TRAINING_ORDERED_NO_PROVIDER_MIGRATION_YET`

## Bloque 1 · Arquitectura Sabik actual

Estudiar antes de proponer nada:
- Core PRE-#144;
- R66;
- biblioteca R04;
- age/safety;
- citas;
- sesiones;
- STT/TTS;
- contrato de privacidad;
- integración actual con Claude API;
- qué pertenece realmente al provider y qué es propio de Sabik.

Salida:
diagrama AS-IS.

## Bloque 2 · OpenAI API vigente

Estudiar fuentes oficiales actuales:
- Responses API;
- Agents API (beta pública 2026);
- Agents SDK;
- tools/function calling;
- file search/retrieval;
- MCP cuando sea pertinente;
- streaming;
- structured outputs;
- background/long-running agents si aplica;
- tracing/observability.

Fuentes:
- https://openai.com/index/new-tools-for-building-agents/
- https://openai.com/index/introducing-the-agents-api/
- documentación vigente en https://platform.openai.com/docs/

Regla:
NO copiar una arquitectura de tutorial.
Comparar contra Sabik real.

## Bloque 3 · Migración de proveedor

Aprender:
- provider abstraction;
- contract tests;
- prompt/instruction portability;
- tool schema compatibility;
- streaming differences;
- error mapping;
- token/context differences;
- cost/latency;
- fallback;
- rollback;
- dual-run/shadow testing cuando proceda.

Objetivo:
Claude actual y OpenAI candidato deben poder compararse sin reescribir Sabik entero.

## Bloque 4 · RAG y Knowledge Engineering

Dominar:
- ingestion vs retrieval;
- chunking;
- metadata;
- hybrid retrieval;
- filters;
- citations;
- provenance;
- stale knowledge;
- deduplication;
- reranking;
- context assembly;
- query rewriting;
- safe variants;
- fail closed.

Regla Iris Green:
Nube mantiene la biblioteca.
Córtex consume el contrato, no crea un segundo corpus.

## Bloque 5 · Context Engineering

Diseñar:
- system instructions;
- developer policy;
- session context;
- user turn;
- retrieved evidence;
- tools;
- memory boundaries;
- token budget;
- truncation/summarization;
- reset.

No almacenar conversación completa por defecto.

## Bloque 6 · Agent Engineering

Estudiar:
- single-agent vs multi-agent;
- cuándo NO usar subagentes;
- tool routing;
- retries;
- idempotency;
- cancellation;
- long-running tasks;
- state;
- guardrails.

No convertir Sabik en una red compleja de agentes sin necesidad.

## Bloque 7 · Evals

Obligatorio antes de migrar.

Crear dataset de evaluación Sabik:
- ES;
- EN;
- factual;
- citations;
- no-result;
- correction;
- follow-up;
- safety;
- AGE_0_12;
- AGE_13_17;
- AGE_18_PLUS;
- S2 intent/no-intent;
- hallucination;
- prompt injection;
- tool failure;
- latency;
- cost.

Métrica:
comparar Claude baseline vs OpenAI candidate.

Nunca migrar porque “suena mejor” en cinco ejemplos.

## Bloque 8 · Seguridad

Estudiar:
- prompt injection;
- tool injection;
- data exfiltration;
- unsafe tool calls;
- secrets;
- PII;
- health/sensitive data;
- logs;
- provider data controls;
- least privilege.

Lex y Vigía revisan obligaciones/evidencia.

## Bloque 9 · LLMOps

Versionar:
- provider;
- model;
- instructions;
- tool schemas;
- retrieval/library version;
- eval dataset;
- eval results;
- thresholds;
- release candidate.

Cada respuesta de producción debe poder vincularse a una configuración identificable.

## Bloque 10 · Aprendizaje de Sabik

“Enseñar” = promover conocimiento aprobado.

Pipeline:

`FUENTE → REVISIÓN → CLASIFICACIÓN → BIBLIOTECA VERSIONADA → RETRIEVAL → CONTEXT → MODELO → EVALS`

No:
`SLACK/CHAT CRUDO → MODELO`.

Diseñar knowledge tiers:
- PUBLIC_KNOWLEDGE
- INTERNAL_KNOWLEDGE
- TEAM_ONLY
- LEGAL_RESTRICTED
- PERSONAL_DATA_PROHIBITED
- CHILD_SAFE
- SOURCE_REQUIRED
- SUPERSEDED

## Entrega de Formación

Crear:
`APRENDIZAJE_CORTEX_2026-09-30.md`.

Debe contener:
1. AS-IS Sabik/Claude;
2. opciones OpenAI;
3. arquitectura TO-BE;
4. frontera Nube/Córtex/Pulso/Vector;
5. riesgos;
6. eval plan;
7. estrategia rollback;
8. propuesta de migración por fases;
9. qué NO migrar todavía.

Marcador:
`A10_CORTEX_LLM_SYSTEMS_FOUNDATION_READY_FOR_REVIEW`.

No producción.
No cambio de provider durante la jornada de Formación.
