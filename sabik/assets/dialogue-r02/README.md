# Sabik Dialogue Library R01

Biblioteca declarativa de diálogo para Sabik.

## Principio

El runtime no debe tratar cada transcripción como una búsqueda.

Flujo:

`STT → intent → slots → pending slot → prompt/reprompt → retrieval/action → response → TTS`

## Archivos

- `dialogue-model.es.json` — intents, patrones, prompts y reprompts ES.
- `dialogue-model.en.json` — intents, patrones, prompts y reprompts EN.
- `dialogue-variables.json` — definición canónica de slots y aspectos.
- `dialogue-tests.es.json` — casos de aceptación ES.
- `dialogue-tests.en.json` — casos de aceptación EN.

## Slots R01

- `topic`
- `aspect`
- `audience`
- `language`
- `input_mode`
- `response_length`
- `last_intent`
- `pending_slot`

## Reglas

1. Una pregunta por turno.
2. Retrieval solo cuando estén completos los slots requeridos.
3. `topic` se mantiene durante la sesión.
4. Turnos sociales nunca llaman a retrieval.
5. Prompts y reprompts son datos, no copy incrustado en el Core.
6. Las variantes se rotan dentro de la sesión.
7. Un fallo de comprensión no debe convertirse automáticamente en “no hay información”.
8. Las fuentes se muestran separadas de la frase hablada.
9. Memoria solo de sesión.
10. No inferir emoción por tono de voz.

## Ejemplo

Entrada:
`Necesito buscar autismo`

Estado:
`intent=search.topic`
`topic=autismo`
`pending_slot=aspect`

Salida:
una variante de `search.ask_aspect`.

Siguiente entrada:
`señales`

Estado:
`intent=information.aspect`
`topic=autismo`
`aspect=signals`

Consulta:
`autismo señales`.