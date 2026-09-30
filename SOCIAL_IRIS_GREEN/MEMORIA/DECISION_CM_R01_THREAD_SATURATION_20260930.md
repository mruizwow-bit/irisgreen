# MEMORIA · CM R01 · SATURACIÓN DE HILOS · 30/09/2026

## Problema

Se observa que el agente interpreta “continuar conversaciones” como seguir respondiendo repetidamente a la misma persona dentro de la misma publicación durante horas o días.

Esto produce:
- sobre-interacción;
- sensación artificial;
- pérdida de tiempo operativo;
- concentración excesiva en pocas cuentas;
- menos descubrimiento y rotación;
- riesgo de parecer insistente.

## Decisión

Se adopta:

`RESPONDER → CERRAR → CAMBIAR DE CONTEXTO`.

Reglas:
- una intervención sustantiva nueva puede recibir una respuesta;
- agradecimientos/corazones/cierres no se convierten en nuevas preguntas;
- máximo 2 respuestas textuales de Iris en el mismo hilo durante 24 h salvo aclaración necesaria;
- un hilo cerrado no se reabre al día siguiente sin tema nuevo;
- la siguiente interacción con esa persona debe preferir otra publicación futura o un contexto nuevo.

Marcador:
`THREAD_SATURATED_MOVE_ON`.

La fidelización se mide por recurrencia entre momentos distintos, no por longitud de un hilo.
