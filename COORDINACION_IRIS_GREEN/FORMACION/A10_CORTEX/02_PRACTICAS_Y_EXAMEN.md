# CÓRTEX · PRÁCTICAS Y EXAMEN

## Práctica 1 · AS-IS

Mapear:
Claude API → Sabik Core → Retrieval → Safety → Response → Voice.

Separar qué componentes dependen del provider.

## Práctica 2 · Provider adapter

En diseño/repositorio temporal:
definir interfaz neutral:
- generate;
- stream;
- tool calls;
- cancel;
- errors;
- usage;
- trace id.

Sin modificar producción.

## Práctica 3 · Eval baseline

Construir dataset mínimo reproducible con respuestas esperadas/criterios.
Ejecutar baseline actual.

## Práctica 4 · OpenAI candidate

Probar candidato aislado con el mismo dataset.
No cambiar UI.

## Práctica 5 · RAG

Demostrar:
- cita correcta;
- fuente inexistente → no inventar;
- S2 filtrado;
- stale version detectada;
- no-result recuperable.

## Práctica 6 · Injection

Probar ataques de instrucciones dentro de documentos/usuarios.
El conocimiento recuperado no debe poder sustituir instrucciones de sistema.

## Examen

Responder con evidencia:
1. ¿Qué parte de Sabik cambia al sustituir Claude por OpenAI?
2. ¿Qué parte NO debe cambiar?
3. ¿Qué API de OpenAI conviene y por qué?
4. ¿Cómo se compara calidad sin sesgo anecdótico?
5. ¿Cómo revierte la migración en minutos?
6. ¿Cómo sabemos qué conocimiento vio el modelo?
7. ¿Cómo evitamos que Slack se convierta en conocimiento automático?
8. ¿Qué logs necesitamos y cuáles están prohibidos?
9. ¿Cómo se versiona una configuración LLM?
10. ¿Qué gate bloquea producción?
