# 08 · Revisión de S0 (PR #161)

Implementación revisada: `sabik/s0-state-machine` @ `e8bcedf` («Sabik S0: add pure layered state machine»).
Ficheros: `sabik/nea-core/sabik-machine.js`, `sabik/nea-core/state.js`, `sabik/S0_STATE_MACHINE.md`, `tools/test-sabik-machine-s0.js`, `sabik/AGENTS.md`.
La rama de Codex no se ha modificado: la revisión se hizo en un worktree local de solo lectura.
Casos ejecutables de esta revisión: `tests/fixtures/sabik/review/s0-machine-review.es.json`.

## Veredicto

# BLOQUEADO_S0

Hay 13 secuencias semánticas fallidas verificadas ejecutando `transitionSabikState()`. Estas secuencias amplían y concretan los bloqueos oficiales B02–B04 publicados por QA; no constituyen una taxonomía paralela. Además, la puerta automática de QA (PR #164) no puede evaluar la implementación: el contrato de estado de QA y el de Codex son incompatibles.

## 1. Lo que funciona

- **[H]** `node tools/test-sabik-machine-s0.js` → 22/22. `node tools/test-sabik-page-v7.js` → 28/28.
- **[H]** En el worktree limpio de esta revisión, `python3 scripts/build_site.py` termina con código 0 en Linux. Esta evidencia corresponde únicamente a `e8bcedf`; después de cualquier corrección de Codex el build debe repetirse desde cero. En Windows había fallado por un bloqueo de fichero.
- **[H]** La transición no consulta DOM, red, reloj ni aleatoriedad. Solo lee `window.NEACoreState` al cargar el módulo. Es determinista y no muta la entrada.
- **[H]** La máquina **no contiene estados cognitivos** ni modos visuales antropomórficos. `adaptation` solo admite `standard` / `low_intensity`. Resuelve la raíz de C-06 en el modelo, no en la integración.
- **[H]** Pausar no borra la sesión. Plegar y ocultar no pausan. `RESET_SESSION` es el único evento que incrementa `session_epoch`. Voz y movimiento son capas separadas. `TECHNICAL_ERROR` conserva la seguridad. Los eventos desconocidos lanzan un error.
- **[H]** Se añadieron eventos que faltaban en `AGENTS.md`: `SET_LOW_INTENSITY`, `SET_RESPONSE_LENGTH`, `SET_MAX_OPTIONS`, `SET_QUESTION_POLICY`, `SET_REDUCED_MOTION`, `SET_LANGUAGE`, `HIDE` y `SHOW`.

## 2. Secuencias semánticas bloqueantes

Todas **[H]**, ejecutadas contra `e8bcedf`. Se agrupan bajo los bloqueos oficiales QA B02–B04; las expectativas que todavía requieren decisión humana permanecen marcadas **[P]** o **[E]**.

| ID | Secuencia | Resultado | Invariante afectado |
|---|---|---|---|
| S0R-01 | `BOOT_OK → RISK_UNCERTAIN → SUBMIT` | lanza | La persona no puede contestar la aclaración de seguridad. |
| S0R-02 | `… RESPONSE_READY → ASK_CLARIFICATION → SUBMIT` | lanza | Ninguna aclaración puede contestarse. `awaiting_clarification` solo se abandona con pausa/reanudar, reset o error. |
| S0R-03 | `BOOT_OK → SUBMIT → RISK_UNCERTAIN` | lanza | El riesgo se detecta en el texto enviado, pero la máquina solo lo acepta desde `ready`. |
| S0R-04 | `… RETRIEVAL_OK → RISK_CONFIRMED` | lanza | Ídem desde `composing`. |
| S0R-05 | `… RESPONSE_READY → RISK_CONFIRMED` | lanza | El riesgo no puede declararse en el segundo mensaje de una conversación. |
| S0R-06 | `BOOT_OK → RISK_CONFIRMED → HUMAN_HANDOFF → SUBMIT` | lanza | Tras la derivación humana la conversación queda cerrada. `SUBMIT` pone `dialogue=idle` y la validación exige `human_handoff`. |
| S0R-07 | `… HUMAN_HANDOFF → TECHNICAL_ERROR → RETRY` | lanza; queda en `error` | Error permanente con derivación activa. |
| S0R-08 | `BOOT_OK → RISK_CONFIRMED → RISK_UNCERTAIN` | `safety=risk_uncertain`, `safety_priority=false` | El riesgo confirmado se rebaja. |
| S0R-09 | `… HUMAN_HANDOFF → PAUSE → RESUME → RISK_UNCERTAIN` | `safety=risk_uncertain` | La derivación humana se rebaja. |
| S0R-10 | `PAUSE_ASSISTANT → RESUME_ASSISTANT` | `ready` sin `BOOT_OK` | Sabik se presentaría disponible sin Core cargado. |
| S0R-11 | `RESET_SESSION` desde `booting` | `ready` sin `BOOT_OK` | Ídem. |
| S0R-12 | `TECHNICAL_ERROR → RETRY` desde `booting` | `ready` sin `BOOT_OK` | Ídem; es el caso real de «Sabik no pudo cargar el Core». |
| S0R-13 | `BOOT_OK → RISK_CONFIRMED` | `deriveSabikPresentation().motion_state = motion_enabled` con `safety_priority=true` | «Riesgo prevalece sobre decoración» solo afecta a la etiqueta; el movimiento sigue (hallazgo C-05 sin resolver en el modelo). |

## 3. Fallos mayores

| ID | Resultado | Propuesta **[P]** |
|---|---|---|
| S0R-14 | Reanudar tras pausar una aclaración deja `operational=ready` con `dialogue=awaiting_clarification` | Guardar y restaurar el estado operativo previo a la pausa. |
| S0R-15 | Pausar el asistente mientras habla deja `voice=speaking`, `energy=1` | La pausa del asistente pausa o detiene su voz. |
| S0R-16 | `RETRIEVAL_OK` durante la pausa lanza | Definir si el resultado se descarta o se guarda para reanudar. |
| S0R-17 | `RESET_SESSION` cambia `visibility` a `expanded` y borra `risk_confirmed` | Reset no toca visibilidad. **[E]** Si puede cerrar la capa de seguridad. |
| S0R-18 | Un error técnico durante la pausa la pierde al reintentar | La pausa solo la cambia la persona. |
| S0R-19 | `question_policy="none"` no impide `ASK_CLARIFICATION` | Rechazar aclaraciones no de seguridad con esa política; la aclaración de seguridad sí se permite. |

Menores: S0R-20 (`SET_LOW_INTENSITY` con la cadena `"false"` activa baja intensidad), S0R-21 (voz con el panel oculto, **[E]**), S0R-22 (`en` aceptado sin corpus), S0R-23 (`speech_starting` y `motion_paused` declarados e inalcanzables; exploración exhaustiva de 1644 combinaciones).

## 4. Puerta automática de QA

- **[H]** `node tests/specs/sabik/run-s0-contract.mjs` (rama `sabik/qa-contract` @ `2bb36af`) valida sus fixtures: 40 transiciones, 29 recorridos, 20 casos.
- **[H]** Con `--module …/sabik-machine.js` devuelve **`BLOQUEO_QA_S0: pureza estática incumplida … DOM/global: window`**. El runner espera un módulo ES que exporte `transitionSabikState`; el módulo de Codex es un script de navegador que se registra en `window`.
- **[H]** Aunque se resolviera la carga, los contratos no coinciden:

| Aspecto | QA (#164) | Codex (#161) |
|---|---|---|
| Capa operativa | `operation`; `paused` | `operational`; `assistant_paused` |
| Voz | `speech` (`starting`…) | `voice.state` (`speech_starting`…) |
| Versión | `revision` | `session_epoch` |
| Diálogo | `none`, `information`, `practical`, `clarification`, `accompaniment`, `correction`, `insufficient`, `human_handoff` | `idle`, `answering`, `awaiting_clarification`, `insufficient`, `human_handoff` |
| Seguridad | `uncertain`, `risk` | `risk_uncertain`, `risk_confirmed` |
| Movimiento | `off`, `ambient`, `processing`, `voice_reactive`, `protection_static` | `motion_enabled`, `motion_reduced`, `motion_paused` |
| Adaptación | `intensity`, `depth` | `mode`, `low_intensity` |
| Eventos | `SET_ADAPTATION`, `SPEECH_STOP` | `SET_LOW_INTENSITY`, `SET_RESPONSE_LENGTH`, `SET_MAX_OPTIONS`, `SET_QUESTION_POLICY` |

**[I]** El contrato de QA recoge varios estados que esta revisión echa en falta en la máquina: diálogo de acompañamiento y de corrección, y un movimiento de protección estático.
**[H]** Decisión de coordinación ya fijada: el contrato público de QA #164 y `s0-state-contract.json` son normativos. Codex debe alinear su API pública o aportar una frontera/adaptador puro que los cumpla. Los casos de QA no se modifican para acomodar la implementación (regla 6 del README de fixtures). Claude puede proponer extensiones semánticas, pero no reabre esta autoridad.

## 5. Contraste con el inventario

`tests/fixtures/sabik/review/state-inventory.es.json`, `mapa_a_s0_codex`.

- **Retirados correctamente:** estados cognitivos y modos visuales antropomórficos.
- **Perdidos (sin evento ni estado):**
  - acuse de corrección y «No es esto»;
  - «Buscar por otra vía»;
  - presencia de acompañamiento;
  - fuera de alcance;
  - distinción entre respuesta informativa y práctica;
  - distinción entre fallo de datos y fallo de runtime;
  - salida de la capa de riesgo (respuesta a la aclaración o cierre explícito);
  - origen de una preferencia (persona o sistema).
- **Mezclados:** tras S0R-14 conviven `ready` y `awaiting_clarification`. `HUMAN_HANDOFF` existe a la vez como seguridad y como diálogo, y la validación los acopla, lo que causa S0R-06 y S0R-07.

## 6. ¿Alguna adaptación parece un diagnóstico?

- **[H]** En la máquina, no: no hay estado cognitivo. `labels.no_diagnosis` es una constante declarativa.
- **[H]** El módulo antiguo sigue igual (`sabik-state.js` y `COGNITIVE_STATES` en `state.js`), así que hasta la integración el runtime visible sigue infiriendo `Sobrecarga`, `Hiperfoco` y demás. Es coherente con el alcance de S0.
- **[P]** Para la integración: `SET_LOW_INTENSITY` y el resto de preferencias deben llevar `source: "user"`, y la máquina debe rechazar orígenes inferidos. Añadir una prueba que falle si la capa de riesgo o la recuperación emiten eventos de adaptación.

## 7. Observaciones sobre el propio contrato S0

- `AGENTS.md` pide la secuencia `presenting → assistant_paused → assistant_ready`, pero `assistant_ready` no existe (la prueba usa `ready`).
- La secuencia obligatoria `ready → risk_uncertain → awaiting_clarification` es precisamente la que después no permite contestar (S0R-01). El contrato no exige ningún recorrido de salida.
- `S0_STATE_MACHINE.md` incluye una ruta local de Windows con nombre de usuario. **[E]** Retirarla del documento versionado.
- `S0_STATE_MACHINE.md` está en inglés, mientras el resto de la documentación de fase está en español. **[E]**

## 8. Condiciones para `APTO_PARA_QA_S0`

1. S0R-01 a S0R-13 resueltos, con una prueba por caso.
2. Contrato normativo acordado entre QA y Codex, y `run-s0-contract.mjs --module` en verde, o una excepción documentada por QA.
3. Eventos o estados para las capacidades perdidas del §5, o una decisión explícita de aplazarlas con su fase.
4. `tests/fixtures/sabik/review/s0-machine-review.es.json` reproducido como prueba ejecutable.

## 9. Comentario propuesto para PR #161

> **Revisión semántica (PR #162) · BLOQUEADO_S0**
>
> Gracias: la transición es determinista y no muta la entrada en las rutas probadas, elimina los estados cognitivos y respeta pausa ≠ reset y plegar ≠ pausar. El módulo completo todavía no cumple la frontera pura de QA porque lee y publica mediante `window`. 22/22 y 28/28 en verde; esta revisión obtuvo build con código 0 en un worktree Linux limpio para `e8bcedf`, resultado que debe repetirse tras cualquier nuevo commit.
>
> Bloqueantes verificados contra `e8bcedf` (detalle y secuencias en `docs/sabik/reviews/08-revision-s0.md` y `tests/fixtures/sabik/review/s0-machine-review.es.json` de #162):
> 1. Una aclaración no puede contestarse: `SUBMIT` lanza desde `awaiting_clarification` (S0R-01, S0R-02).
> 2. El riesgo solo puede declararse desde `ready`; lanza desde `retrieving`, `composing` y `presenting` (S0R-03 a S0R-05).
> 3. Tras `HUMAN_HANDOFF`, `SUBMIT` y `RETRY` lanzan: la conversación queda cerrada o en error permanente (S0R-06, S0R-07).
> 4. `RISK_UNCERTAIN` rebaja un riesgo confirmado o una derivación (S0R-08, S0R-09).
> 5. Se llega a `ready` sin `BOOT_OK` mediante pausa/reanudar, reset o error/reintento (S0R-10 a S0R-12).
> 6. `deriveSabikPresentation` mantiene `motion_enabled` con riesgo confirmado (S0R-13).
>
> Además, `run-s0-contract.mjs --module` devuelve `BLOQUEO_QA_S0` (uso de `window`), y los nombres de capas, enumeraciones y eventos no coinciden con el contrato normativo de QA (#164). Codex debe alinear la API pública o aportar un adaptador puro compatible; no se modifican los casos QA para acomodar la implementación.
