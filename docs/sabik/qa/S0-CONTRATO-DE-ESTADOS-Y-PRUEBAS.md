# S0 · Contrato QA de estados, eventos y puerta de salida

**Issue QA:** #149  
**Implementación a revisar:** #146 / PR #161  
**Revisión semántica:** #147 / PR #162  
**Diseño dependiente:** #148 / PR #163  
**Destino:** `sabik-preview`

## 1. Regla de autoridad

Este documento y `tests/specs/sabik/s0-state-contract.json` forman el contrato QA de S0. La implementación debe cumplir el contrato; QA no modifica expectativas para hacer pasar una implementación defectuosa.

Un build verde, una importación correcta o un test aislado en verde no significan que S0 esté aceptado.

## 2. Capas de estado

La máquina usa capas ortogonales, no una enumeración monolítica:

| Capa | Valores contractuales |
|---|---|
| `operation` | `booting`, `ready`, `retrieving`, `composing`, `presenting`, `awaiting_clarification`, `paused`, `error` |
| `dialogue` | `none`, `information`, `practical`, `clarification`, `accompaniment`, `correction`, `insufficient`, `human_handoff` |
| `safety` | `normal`, `uncertain`, `risk`, `human_handoff` |
| `visibility` | `expanded`, `collapsed`, `hidden` |
| `speech` | `silent`, `starting`, `speaking`, `paused`, `ended`, `error` |
| `motion` | `off`, `ambient`, `processing`, `voice_reactive`, `protection_static` |
| `language` | `es`, `en` |

`adaptation` contiene al menos `response_length`, `max_options`, `question_policy`, `intensity` y `depth`. `revision` es un entero no negativo y no implica persistencia.

## 3. Interfaz mínima

La transición contractual es:

```js
transitionSabikState(previousState, event)
```

Para eventos permitidos puede devolver directamente el nuevo estado o `{ state, accepted, reason }`.

Para eventos **prohibidos** el rechazo debe ser explícito: `{ accepted: false, state: previousState, reason }` o una excepción identificable. Devolver silenciosamente el mismo estado sin indicar rechazo no cumple el contrato, porque impide distinguir una no-op válida de una transición inválida.

## 4. Invariantes bloqueantes

1. **Pureza.** La transición no consulta ni modifica DOM, red, almacenamiento, reloj, aleatoriedad, voz ni globals mutables.
2. **Determinismo.** Mismo estado + mismo evento + mismo payload = mismo resultado estructural.
3. **Inmutabilidad.** No muta el estado ni el evento recibidos.
4. **Serialización.** Todo estado válido sobrevive a `JSON.stringify`/`JSON.parse` sin pérdida semántica.
5. **Valores cerrados.** Todas las capas usan únicamente valores registrados.
6. **Pausa ≠ reset.** Pausar no borra sesión, adaptación, idioma ni seguridad.
7. **Visibilidad ≠ pausa.** Plegar, ocultar o expandir no reanuda ni pausa por accidente.
8. **Reset independiente.** `RESET_SESSION` reinicia la sesión ordinaria sin depender del estado visual. Si existe riesgo confirmado, el reset no lo rebaja.
9. **Voz ≠ movimiento.** Voz y movimiento pueden cambiar por separado. Con reducción de movimiento, la voz puede seguir activa con `motion: off`.
10. **Seguridad prevalece.** Riesgo o derivación humana no pueden quedar anulados por eventos decorativos, errores técnicos, voz, visibilidad o reset.
11. **Error técnico ≠ insuficiencia.** Un fallo de carga no se presenta como «no tengo información».
12. **Idioma estable.** Eventos no lingüísticos no cambian `language`.
13. **Sin estados imposibles.** Entre otros: `human_handoff` exige diálogo de derivación; `voice_reactive` exige voz activa; riesgo no admite movimiento reactivo de voz; `error + insufficient` no representa un error técnico.
14. **Doble envío.** Un segundo `SUBMIT` durante `retrieving` se rechaza explícitamente y no crea una segunda sesión, respuesta o revisión silenciosa.
15. **Anuncio único.** El contrato observable de respuesta es una única unidad coherente. Nunca se anuncia palabra por palabra ni token por token.

## 5. Matriz ejecutable

La fuente canónica es `tests/specs/sabik/s0-state-contract.json`. Cada fila declara obligatoriamente:

- estado anterior;
- evento;
- payload;
- estado esperado;
- evento permitido o prohibido;
- controles activos;
- controles desactivados;
- texto visible;
- anuncio accesible;
- foco esperado;
- voz esperada;
- movimiento esperado;
- sesión conservada o reiniciada;
- seguridad esperada.

La matriz incluye tanto recorridos permitidos como rechazos necesarios. Los textos visibles y anuncios usan **tokens semánticos**, no copy editorial final. S1/S2 deberán materializarlos sin alterar su función.

### Eventos cubiertos

La matriz cubre los eventos base de S0 y los eventos necesarios para hacer verificables las capas:

- `BOOT_OK`
- `SUBMIT`
- `RETRIEVAL_OK`
- `RETRIEVAL_EMPTY`
- `RESPONSE_READY`
- `ASK_CLARIFICATION`
- `PAUSE_ASSISTANT`
- `RESUME_ASSISTANT`
- `RESET_SESSION`
- `COLLAPSE`
- `EXPAND`
- `HIDE`
- `SPEECH_START`
- `SPEECH_BOUNDARY`
- `SPEECH_PAUSE`
- `SPEECH_RESUME`
- `SPEECH_STOP`
- `SPEECH_END`
- `SPEECH_ERROR`
- `RISK_UNCERTAIN`
- `RISK_CONFIRMED`
- `HUMAN_HANDOFF`
- `TECHNICAL_ERROR`
- `RETRY`
- `SET_LANGUAGE`
- `SET_ADAPTATION`
- `SET_REDUCED_MOTION`

`SPEECH_STOP` y `SPEECH_END` son distintos: el primero representa una acción explícita de detener; el segundo, fin natural de la locución.

## 6. Recorridos canónicos

`tests/specs/sabik/s0-transition-cases.json` contiene recorridos bloqueantes que combinan filas de la matriz. Deben cubrir, como mínimo:

- arranque;
- respuesta normal;
- recuperación vacía;
- pausa + plegado + expansión;
- ocultar sin alterar pausa;
- reanudar conservando adaptación/idioma/seguridad;
- reset desde pausa;
- reset durante riesgo sin rebajar seguridad;
- voz: iniciar, boundary, pausar, reanudar, detener, terminar y error;
- voz con movimiento reducido;
- texto sin voz;
- riesgo incierto;
- riesgo confirmado;
- derivación humana;
- error técnico normal;
- error técnico durante riesgo;
- reintento;
- doble envío;
- evento fuera de secuencia;
- cambio de idioma;
- adaptación;
- determinismo;
- inmutabilidad;
- serialización;
- ausencia de estados imposibles.

## 7. Runner canónico

`tests/specs/sabik/run-s0-contract.mjs` no importa una ruta de runtime fija. Recibe la implementación por CLI:

```bash
node tests/specs/sabik/run-s0-contract.mjs --module sabik/nea-core/sabik-machine.js
```

Sin `--module`, el runner valida únicamente esquemas, referencias de fixtures y corpus, e imprime `NO_IMPLEMENTATION_EXECUTED`. Ese modo **no** acepta S0.

Con implementación, la puerta automática comprueba:

- pureza observable y patrones estáticos prohibidos;
- determinismo;
- inmutabilidad de estado y evento;
- esquema y valores cerrados;
- transiciones permitidas;
- rechazo explícito de eventos prohibidos;
- invariantes;
- serialización;
- estados imposibles;
- recorridos canónicos completos.

## 8. Revisión de PR #161

Cuando exista implementación:

1. comprobar diff y alcance;
2. ejecutar las pruebas propias de PR #161;
3. ejecutar `node tools/test-sabik-page-v7.js`;
4. ejecutar `python3 scripts/build_site.py`;
5. ejecutar el runner canónico;
6. comprobar pureza, determinismo e invariantes;
7. verificar que ocultar no altera pausa;
8. verificar que reset es independiente y no rebaja seguridad;
9. verificar independencia voz/movimiento;
10. verificar prioridad de seguridad;
11. revisar observaciones semánticas de PR #162;
12. comparar con contrato visual de PR #163 cuando aplique;
13. comprobar que no se han tocado archivos prohibidos.

## 9. Veredicto de S0

QA publicará exactamente uno:

- `ACEPTADO_S0`
- `ACEPTADO_S0_CON_PENDIENTES_NO_BLOQUEANTES`
- `BLOQUEADO_S0`

`ACEPTADO_S0_CON_PENDIENTES_NO_BLOQUEANTES` solo puede usarse cuando todos los criterios bloqueantes están cumplidos y los pendientes están identificados individualmente como no bloqueantes.

Cada bloqueo incluirá:

```text
caso
evidencia
riesgo
criterio incumplido
corrección mínima esperada
```

## 10. Dependencia de S1

S1 permanece cerrado mientras falte cualquiera de estos elementos:

- S0 aceptado por QA;
- revisión semántica de Claude emitida;
- casos canónicos ejecutados contra la implementación;
- ausencia de contradicciones de contrato.

S2, además, no puede empezar sin especificación de Design.

## 11. Estado actual de la puerta

En la revisión inicial de esta rama, PR #161 solo contiene las instrucciones de alcance y todavía no ofrece una implementación de máquina de estados. Por ello no corresponde emitir un veredicto S0 todavía. La puerta se mantiene **pendiente de implementación**, no aprobada ni fallida.
