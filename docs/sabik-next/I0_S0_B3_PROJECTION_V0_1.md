# I0 · PROYECCIÓN S0 → B3 · BORRADOR V0.1

**Fecha:** 20/09/2026  
**Estado:** borrador contractual para revisión  
**Fuente de estado:** `sabik/S0_STATE_MACHINE.md`

## 1. Regla principal

S0 y B3 no son dos máquinas equivalentes.

- **S0** describe estado técnico/operativo mediante capas ortogonales.
- **B3** comunica una única función perceptible de presentación.
- B3 se deriva de un estado S0 válido **más el significado de la acción/resultado**.
- B3 nunca altera S0.
- No existe una conversión 1:1 de cada valor S0 a un estado B3.

## 2. Precedencia contractual

1. Si el asistente está en pausa funcional explícita, B3 = **PAUSA**.
2. Si se produce un cambio real y finito de etapa/ruta dentro de Iris, B3 = **TRANSICIÓN** durante ese cambio.
3. Si Sabik señala un objetivo concreto o la siguiente acción útil, B3 = **ORIENTAR**.
4. Si una acción solicitada por la persona termina con un resultado concreto y verificable, B3 = **CONFIRMAR** de forma breve.
5. En cualquier otro caso estable, B3 = **PRESENTE**.

## 3. Estados que NO crean B3 nuevo

Los siguientes hechos no crean estados B3 adicionales:
- `operation = retrieving`;
- `operation = composing`;
- `speech = starting/speaking/paused/ended/error`;
- micrófono activo;
- reproducción de voz;
- error técnico;
- actividad de red;
- cambio de preferencia de movimiento;
- seguridad `uncertain/risk/human_handoff`;
- visibilidad expandida/colapsada/oculta.

Deben comunicarse por texto, controles e indicadores explícitos cuando corresponda.

## 4. Reglas por S0

### operation

| S0 operation | B3 por defecto | Nota |
|---|---|---|
| booting | PRESENTE | sin animación que simule pensamiento |
| ready | PRESENTE | disponibilidad |
| retrieving | PRESENTE | procesamiento técnico no es TRANSICIÓN |
| composing | PRESENTE | procesamiento técnico no es estado B3 |
| presenting | PRESENTE | ORIENTAR/CONFIRMAR dependen del resultado |
| awaiting_clarification | PRESENTE | la pregunta textual comunica la aclaración |
| paused | PAUSA | pausa funcional real |
| error | PRESENTE | error se comunica por texto; no existe B3 ERROR |

### dialogue

`dialogue` no determina por sí solo B3.

- `information`: normalmente PRESENTE.
- `practical`: ORIENTAR solo si señala un objetivo/acción concreta.
- `clarification`: PRESENTE salvo que se señale un control concreto.
- `correction`: CONFIRMAR solo si existe corrección completada y verificable.
- `insufficient`: PRESENTE + texto de insuficiencia.
- `human_handoff`: ORIENTAR solo cuando existe un recurso/acción humana concreta y verificada.

### safety

`safety` tiene prioridad contractual en S0, pero **no crea estados B3 nuevos**.

- `normal`: reglas ordinarias.
- `uncertain`: texto claro de incertidumbre; B3 no representa emoción.
- `risk`: texto/controles de seguridad; B3 no dramatiza.
- `human_handoff`: orientación únicamente si existe un destino humano concreto y verificado.

### speech

La voz es independiente de B3.

- empezar a hablar no cambia automáticamente B3;
- pausar voz no equivale a PAUSA;
- detener voz no equivale a PAUSA;
- error de voz no crea estado B3;
- B3 nunca sigue fonemas, amplitud o energía.

### motion

`motion` modifica la representación, no el significado B3.

- `off`: B3 se muestra de forma estática.
- `ambient`, `processing`, `voice_reactive`, `protection_static`: valores técnicos S0 históricos; la implementación B3 debe respetar el contrato visual vigente y Reduced Motion.
- la preferencia manual Normal/Reducido/Sin movimiento permanece transversal.

## 5. Eventos y proyección esperada

| Evento/resultado | B3 |
|---|---|
| BOOT_OK | PRESENTE |
| SUBMIT | PRESENTE |
| RETRIEVAL_OK | PRESENTE hasta conocer el resultado |
| RETRIEVAL_EMPTY | PRESENTE + insuficiencia textual |
| RESPONSE_READY | PRESENTE / ORIENTAR / CONFIRMAR según semántica |
| ASK_CLARIFICATION | PRESENTE |
| PAUSE_ASSISTANT | PAUSA |
| RESUME_ASSISTANT | retorna a función derivada |
| RESET_SESSION | PRESENTE |
| COLLAPSE / EXPAND | ninguno nuevo |
| SPEECH_* | ninguno nuevo |
| TECHNICAL_ERROR | PRESENTE + error textual |
| RETRY | PRESENTE |
| navegación real entre etapas | TRANSICIÓN |
| preferencia reversible aplicada | CONFIRMAR breve |
| objetivo concreto señalado | ORIENTAR |

## 6. Invariantes I0

- B3 no revela ni infiere estado mental.
- B3 no sustituye texto, foco, controles ni indicadores.
- `prefers-reduced-motion` y la preferencia manual cambian representación, no función.
- una acción puede completarse sin CONFIRMAR visual si la confirmación textual es suficiente; B3 nunca debe convertirse en recompensa.
- TRANSICIÓN exige origen, cambio y destino reales.
- ORIENTAR exige un objetivo concreto.
- PAUSA exige una pausa funcional de Sabik, no silencio ni voz pausada.
- CONFIRMAR exige un resultado concreto.
