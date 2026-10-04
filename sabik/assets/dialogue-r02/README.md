# Sabik Dialogue Library R02

Biblioteca declarativa de diálogo para Sabik.

## Principio

El runtime no debe tratar cada transcripción como una búsqueda ni convertir la conversación en una entrevista de clasificación.

Flujo:

`STT → intent → contexto explícito/parámetros → retrieval/action → response → TTS`

Regla canónica:

`RESPONDER_PRIMERO · ACLARAR_SOLO_SI_ES_IMPRESCINDIBLE · NUNCA_PERFILAR_MEDIANTE_PREGUNTAS`

## Archivos

- `dialogue-model.es.json` — intents, patrones, prompts y reprompts ES.
- `dialogue-model.en.json` — intents, patrones, prompts y reprompts EN.
- `dialogue-variables.json` — definición canónica de variables conversacionales.
- `dialogue-tests.es.json` — casos de aceptación ES.
- `dialogue-tests.en.json` — casos de aceptación EN.

## Variables conversacionales

`topic` y `aspect` son contexto útil cuando la persona los aporta o cuando pueden recuperarse del turno previo. No son campos que deban completarse mediante interrogatorio.

Los únicos datos que pueden bloquear una acción son `required_parameters` explícitos y realmente imprescindibles para ejecutar una herramienta o acción concreta.

## Reglas

1. Si puede responderse con la información disponible, se responde.
2. No existe mecánica de hueco conversacional pendiente.
3. No existe elicitation general para completar `topic`, `aspect` u otros rasgos de la persona.
4. Una aclaración solo puede pedir un parámetro imprescindible de la acción actual.
5. `topic` puede mantenerse durante la sesión para continuidad.
6. Turnos sociales nunca llaman a retrieval.
7. Prompts y reprompts son datos, no copy incrustado en el Core.
8. Un fallo de comprensión no debe convertirse automáticamente en «no hay información».
9. Las fuentes se muestran separadas de la frase hablada.
10. Memoria solo de sesión por defecto.
11. No inferir emoción, identidad, diagnóstico, estado cognitivo ni necesidad de apoyo mediante tono de voz, pausas o señales pasivas.

## Ejemplo

Entrada:
`Necesito buscar autismo`

Estado:
`intent=search.topic`
`topic=autismo`

Acción:
`retrieve`

Consulta:
`autismo`

Si después la persona escribe `señales`, el contexto puede acotar la consulta a `autismo señales`. Sabik no obliga a elegir ese aspecto antes de responder.
