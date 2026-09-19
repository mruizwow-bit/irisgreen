# 09 · Revisión semántica final de S0 · `3ce023bf`

**Implementación revisada:** `3ce023bf132ae728fce8e402e30eba0fb796edc8` (tree `4b485f8d5aab54cfc3b4fc86c35ea705e64ebe5a`, padre `81b44a5b`), PR #161, con veredicto QA `ACEPTADO_S0`.
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b` (tree `8baf547e`), PR #164. Cierre QA en `485d15a4` (`S0-REVISION-PR161-3CE023BF-CONTRATO-1C3205FB.md`).
**Epic:** #145. **Fecha:** 17/09/2026. **Coordinación:** Astra.

Los informes `00`–`08` permanecen como evidencia de sus SHA antiguos (`efa4ed9`, `e8bcedf`). Este documento no los sustituye ni los reescribe. Leyenda en `00-resumen-y-bloqueantes.md`.

## Veredicto

# SEMANTICA_S0_BLOQUEADA

| Puerta | Resultado sobre `3ce023bf` |
|---|---|
| QA AUTOMÁTICA S0 (PR #164) | `ACEPTADO_S0` |
| PUERTA SEMÁNTICA S0 (este informe) | `SEMANTICA_S0_BLOQUEADA` |
| ESTADO COORDINADO | **S0 NO APTO TODAVÍA PARA ABRIR S1** (S1 cerrado; S2 cerrado) |

El veredicto QA sigue siendo válido: la implementación superó la batería contractual ejecutada sobre los casos que cubre. Esta revisión es una puerta independiente y ha encontrado dos recorridos que esa batería no incluye. Es una **laguna de cobertura**, no un error de QA.

Los **13 bloqueos semánticos históricos** de la revisión sobre `e8bcedf` están **13/13 resueltos** en `3ce023bf` (§3) y **no son la causa** del bloqueo actual. El bloqueo actual se limita a **SB-1 y SB-2**. Las dos contradicciones se reproducen con la máquina pura (`transitionSabikState`) y **no dependen de `sabik-page.js` ni de S1**. Tampoco dependen del panel, del motor conversacional ni de ninguna integración:

- **SB-1 · Puerta de arranque.** Se alcanza el flujo ordinario (`ready`, `retrieving`…) sin `BOOT_OK`. Regla afectada: `rules.boot` («BOOT_OK only booting->ready; boot error RETRY->booting») y la intención de `EV-BOOT-*-FORBIDDEN`.
- **SB-2 · `SPEECH_ERROR` durante `uncertain`.** La máquina emite un estado público que el validador normativo declara imposible: «uncertain exige protection_static».

Ambas tienen una corrección acotada (§4). El veredicto técnico QA `ACEPTADO_S0` no se discute: la matriz congelada no contiene estas secuencias. S1 no debe abrirse sobre esta máquina hasta corregirlas o hasta que Astra decida expresamente otra cosa.

## 1. Estado de partida verificado

| Elemento | Estado observado (09:13 UTC) |
|---|---|
| PR #161 | abierto, borrador, head `3ce023bf`, cuerpo `ACEPTADO_S0` |
| PR #164 | abierto, borrador, head `485d15a4` (evidencia); contrato normativo `1c3205fb` |
| PR #162 | abierto, borrador, head `c00c8d6`. Su cuerpo describe el veredicto histórico sobre `e8bcedf`. El delta sobre `904da381` preparado antes no se publicó y queda superado por este informe. |
| `main` | `fb396a2d`, sin cambios |

## 2. Método

1. **Worktrees de solo lectura** del clon completo Linux ya verificado: `3ce023bf`, `1c3205fb`, `485d15a4` y `c00c8d6`. Todos limpios.
2. **Fuentes:** máquina exacta; `s0-state-contract.json`, `validate-s0-contract-consistency.mjs` y `S0-CONTRATO-DE-ESTADOS-Y-PRUEBAS.md` del contrato; informe QA de cierre; fixtures `s0-machine-review.es.json` de este PR (solo como origen de las secuencias históricas).
3. **Sonda A (anexo).** Las 13 secuencias históricas, traducidas a la API actual, y 43 comprobaciones dirigidas (A–I).
4. **Sonda A, parte 2: exploración en anchura.** Se aplican 42 variantes de evento a todos los estados alcanzables desde el estado inicial, el estado inicial reducido y un estado `presenting` sin `motion_meta` con `motion=off`. Cada salida se valida con `validateState` del contrato, con `validateSabikState` y con invariantes semánticos. La exploración registra si el camino ha pasado por `BOOT_OK`. Cota: no se exploran estados con `speech_meta.boundary_count > 2`, porque ese contador no tiene límite; esos estados sí se comprueban.
   - **Tamaño:** 290 592 estados; 6 459 120 transiciones aceptadas; 5 745 744 rechazos; 9 408 estados no explorados por la cota.
5. **Sonda B (anexo).** Exploración reducida para localizar qué eventos convierten un estado válido para el contrato en uno inválido.

Hashes de la sonda A:
- `sonda-semantica-final.mjs`: `30d3be4a5c4c014f5b0ac6de73fa31bd66f00c42974c1f8e929b79ab2b840c4a`
- resultado: `2352c2a9b228f5bc83d34eb4a91efcab018656da5aec09e036a0e8ebb35eb072`

Hash de la sonda B, `raiz-estado-invalido.mjs`: `6a22c48a1886737855a7885de548849585cb747125482127a988892198eb42ca`

Las pruebas no se han ejecutado con red ni sobre el panel. No se ha modificado runtime, contrato ni fixtures QA.

## 3. Los 13 bloqueos históricos (`e8bcedf`), ejecutados de nuevo

| ID | Estado anterior | Evento | Esperado bajo el contrato actual | Resultado en `3ce023bf` | Estado | Motivo |
|---|---|---|---|---|---|---|
| S0R-01 | `awaiting_clarification` + `uncertain` | `SUBMIT` | aceptar y conservar `uncertain` (B07) | `awaiting_clarification/clarification/uncertain/silent/protection_static`; válido para el contrato: sí | **RESUELTO** | La aclaración de seguridad admite respuesta y mantiene la protección. |
| S0R-02 | `awaiting_clarification` ordinaria | `SUBMIT` | `retrieving/clarification/normal` (B06) | `retrieving/clarification/normal/silent/processing`; válido para el contrato: sí | **RESUELTO** | B06 implementado. |
| S0R-03 | `retrieving` | `RISK_UNCERTAIN` | aceptar; `uncertain` + `protection_static` | `awaiting_clarification/clarification/uncertain/silent/protection_static`; válido para el contrato: sí | **RESUELTO** | El riesgo ya no depende de la operación. |
| S0R-04 | `composing` | `RISK_CONFIRMED` | aceptar; `risk` + `human_handoff` | `presenting/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | **RESUELTO** | Ídem desde `composing`. |
| S0R-05 | `presenting` (segundo mensaje) | `RISK_CONFIRMED` | aceptar (EV-RISK-CONFIRMED) | `presenting/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | **RESUELTO** | Ídem desde `presenting`. |
| S0R-06 | `presenting` + `human_handoff` | `SUBMIT` | sin estado inválido; en protección no hay flujo ordinario | rechazo explícito en `SUBMIT`; entrada intacta: sí | **RESUELTO** | El defecto histórico era un estado inválido. Ahora es un rechazo explícito de `canSubmit` durante la protección. Qué significa «comunicación abierta» durante la derivación queda en S1 (§5). |
| S0R-07 | `error` + `human_handoff` | `RETRY` | `presenting/human_handoff` (EV-RETRY-HANDOFF) | `presenting/human_handoff/human_handoff/silent/protection_static`; válido para el contrato: sí | **RESUELTO** | `dialogueForTechnicalError` conserva la derivación. |
| S0R-08 | `risk` | `RISK_UNCERTAIN` | rechazo sin rebaja | rechazo explícito en `RISK_UNCERTAIN`; entrada intacta: sí | **RESUELTO** | `RISK_UNCERTAIN` solo se acepta desde `normal`. |
| S0R-09 | `human_handoff` tras pausa y reanudación | `RISK_UNCERTAIN` | rechazo sin rebaja | rechazo explícito en `RISK_UNCERTAIN`; entrada intacta: sí | **RESUELTO** | Ídem. |
| S0R-10 | `booting` | `PAUSE_ASSISTANT` → `RESUME_ASSISTANT` | rechazo (EV-BOOT-PAUSE_ASSISTANT-FORBIDDEN) | rechazo explícito en `PAUSE_ASSISTANT`; entrada intacta: sí | **RESUELTO** | `canPause` excluye `booting`. La secuencia afín «error de arranque + reset» sigue abierta (SB-1). |
| S0R-11 | `booting` | `RESET_SESSION` | rechazo (EV-BOOT-RESET_SESSION-FORBIDDEN) | rechazo explícito en `RESET_SESSION`; entrada intacta: sí | **RESUELTO** | Rechazo en `booting`. La variante tras un error de arranque sigue abierta (SB-1). |
| S0R-12 | `error` con origen `booting` | `RETRY` | `booting` (EV-BOOT-RETRY) | `booting/none/normal/silent/off`; válido para el contrato: sí | **RESUELTO** | El caso simple se resuelve. La variante con doble error sigue abierta (SB-1). |
| S0R-13 | `risk` | presentación | `protection_static` | `presenting/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | **RESUELTO** | El movimiento es parte del estado y `applySafety` fija `protection_static`. |

**Recuento:** 13 resueltos · 0 ya no aplican · 0 siguen vigentes. S0R-06 se considera resuelto porque su defecto (un estado inválido) ha desaparecido. La política de protección que sustituye a la conversación se traslada a S1.

## 4. Contradicciones semánticas vigentes

### SB-1 · Se alcanza el flujo ordinario sin `BOOT_OK`

**Regla afectada.** `rules.boot` del contrato y `S0-CONTRATO-DE-ESTADOS-Y-PRUEBAS.md` («Solo `BOOT_OK` lleva `booting → ready`»). Las filas `EV-BOOT-SUBMIT-FORBIDDEN` y `EV-BOOT-RESET_SESSION-FORBIDDEN` muestran la intención: sin Core cargado no hay flujo ordinario ni reinicio que lo sortee.

**Raíz común.** El estado público no conserva «no arrancado» una vez que sale de `booting`. La única memoria es `error_meta.origin_operation`, y se pierde o no se consulta.

Recorridos reproducidos (ninguno debe alcanzar el flujo ordinario sin `BOOT_OK`):

- **A.** `booting → TECHNICAL_ERROR → RESET_SESSION`: no debe alcanzar `ready` sin `BOOT_OK`.
- **B.** `booting → TECHNICAL_ERROR → TECHNICAL_ERROR → RETRY`: no debe alcanzar `ready` sin `BOOT_OK`.
- **C.** `booting → RISK_*` (aclaración de riesgo) `→ RISK_CLEARED`: no debe habilitar el flujo ordinario sin haber superado `BOOT_OK`.

| Vía | Secuencia desde el estado inicial | Resultado |
|---|---|---|
| A · Reset tras error de arranque (sonda A5) | `TECHNICAL_ERROR{boot-failure} → RESET_SESSION` | `ready/none/normal/silent/ambient`; válido para el contrato: sí. `RESET_SESSION` solo rechaza `booting`, no el error de arranque. |
| B · Doble error de arranque (sondas A6, A7) | `TECHNICAL_ERROR → TECHNICAL_ERROR → RETRY → SUBMIT` | `RETRY` da `ready/none/normal/silent/ambient`; válido para el contrato: sí; `SUBMIT` da `retrieving/none/normal/silent/processing`; válido para el contrato: sí. El segundo error sobrescribe `origin_operation` con `error`. |
| C · Riesgo durante el arranque (sondas A8, A9) | `RISK_UNCERTAIN → RISK_CLEARED → RETRIEVAL_OK` | `composing/clarification/normal/silent/processing`; válido para el contrato: sí. `RISK_*` no comprueba `booting`, y `RISK_CLEARED` abre la recuperación. |

En la exploración, las transiciones raíz que salen de `booting` o `error` sin haber pasado por `BOOT_OK` son:
- `RISK_CONFIRMED` (107 064);
- `RISK_UNCERTAIN` (91 944);
- `RESET_SESSION → ready` (91 800);
- `RETRY → ready` (1728), `→ presenting` (1152) y `→ awaiting_clarification` (720).

**Por qué es S0 y no S1.** Es la propia función pura la que declara `ready` sin Core. Un controlador que muestre el control de reinicio durante un error, algo habitual, obtendría un asistente «disponible» que acepta `SUBMIT` sin datos.

**Corrección mínima (propuesta).**
- `RESET_SESSION` y `RETRY` desde un error cuyo origen sea el arranque deben devolver a `booting`.
- `TECHNICAL_ERROR` desde `error` debe conservar el `origin_operation` original.
- `RISK_*` en `booting` debe rechazarse, o `RISK_CLEARED` no debe abrir la recuperación antes de `BOOT_OK`.

**Filas QA sugeridas:** `EV-BOOT-ERROR-RESET`, `EV-BOOT-DOUBLE-ERROR-RETRY`, `EV-BOOT-RISK-*`.

### SB-2 · `SPEECH_ERROR` durante `uncertain` rompe la protección

**Estado y evento.** `safety=uncertain` + `SPEECH_ERROR` → la implementación produce `motion=off`, pero el validador normativo exige `protection_static` durante `uncertain`.

**Regla semántica.** `uncertain` conserva la atención y la protección estática. La prioridad de protección no se limita a `risk` y `human_handoff`: también rige durante la aclaración de seguridad.

**Regla afectada.** `validateState` del contrato («uncertain exige protection_static»). Todas las filas con `uncertain` prescriben `protection_static`, y también lo hace la propia máquina (`ordinaryMotionFor`, `PAUSE_ASSISTANT`, `TECHNICAL_ERROR`, `SET_REDUCED_MOTION`).

**Reproducción (C6).** `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → RISK_UNCERTAIN → SPEECH_ERROR` da `awaiting_clarification/clarification/uncertain/error/off`; válido para el contrato: **NO** (uncertain exige protection_static).

**Causa.** `SPEECH_ERROR` usa `activeProtection` (solo `risk`/`human_handoff`) en lugar de `safetyAttention`.

**Única raíz** (sonda B, transiciones de estado válido a inválido):

| Transición | Casos |
|---|---|
| `SPEECH_ERROR desde awaiting_clarification/uncertain/silent/protection_static` | 160 |
| `SPEECH_ERROR desde paused/uncertain/silent/protection_static` | 40 |
| `SPEECH_ERROR desde error/uncertain/silent/protection_static` | 12 |
| `SPEECH_ERROR desde awaiting_clarification/uncertain/error/protection_static` | 4 |
| `SPEECH_ERROR desde paused/uncertain/error/protection_static` | 2 |
| `SPEECH_ERROR desde error/uncertain/error/protection_static` | 2 |

En la exploración completa hay 31 896 transiciones que producen o mantienen ese estado imposible. El estado persiste con eventos de visibilidad o preferencias hasta el siguiente `SUBMIT`, que lo restaura (C8).

**Por qué es real.** Un error de síntesis que llega tarde, después de que la seguridad interrumpe la voz, es un evento esperable del navegador. **[I]** En Chrome, `speechSynthesis.cancel()` suele emitir `error` con `interrupted` o `canceled`. El resultado es una aclaración de seguridad presentada sin su movimiento de protección.

**Ambigüedad contractual asociada.** `S0-CONTRATO-DE-ESTADOS-Y-PRUEBAS.md` dice «`SPEECH_ERROR`: `error + off`; durante `risk/human_handoff`, `protection_static`» y no menciona `uncertain`. El validador normativo sí resuelve el caso.

**Corrección mínima (propuesta).** `next.motion = safetyAttention(next) ? PROTECTION_STATIC : OFF`, más una fila QA `EV-SPEECH-ERROR-UNCERTAIN` y una aclaración del texto.

## 5. Comprobaciones adicionales (A–J)

| ID | Comprobación | Secuencia | Esperado | Resultado | Clasificación |
|---|---|---|---|---|---|
| A1 | SUBMIT en booting | `SUBMIT` | rechazo | rechazo explícito en `SUBMIT`; entrada intacta: sí | PASS |
| A2 | SPEECH_REQUEST en booting | `SPEECH_REQUEST` | rechazo | rechazo explícito en `SPEECH_REQUEST`; entrada intacta: sí | PASS |
| A3 | BOOT_OK | `BOOT_OK` | `ready` | `ready/none/normal/silent/ambient`; válido para el contrato: sí | PASS |
| A4 | BOOT_OK repetido | `BOOT_OK → BOOT_OK` | rechazo | rechazo explícito en `BOOT_OK`; entrada intacta: sí | PASS |
| A5 | error de arranque y RESET_SESSION | `TECHNICAL_ERROR → RESET_SESSION` | no llegar a `ready` sin `BOOT_OK` | `ready/none/normal/silent/ambient`; válido para el contrato: sí | **FALLA · SB-1** |
| A6 | doble error de arranque y RETRY | `TECHNICAL_ERROR → TECHNICAL_ERROR → RETRY` | `booting` (error de arranque) | `ready/none/normal/silent/ambient`; válido para el contrato: sí | **FALLA · SB-1** |
| A7 | doble error de arranque, RETRY y SUBMIT | `TECHNICAL_ERROR → TECHNICAL_ERROR → RETRY → SUBMIT` | `SUBMIT` rechazado sin Core | `retrieving/none/normal/silent/processing`; válido para el contrato: sí | **FALLA · SB-1** |
| A8 | RISK_UNCERTAIN en booting, RISK_CLEARED y RETRIEVAL_OK | `RISK_UNCERTAIN → RISK_CLEARED → RETRIEVAL_OK` | sin flujo ordinario antes de `BOOT_OK` | `composing/clarification/normal/silent/processing`; válido para el contrato: sí | **FALLA · SB-1** |
| A9 | RISK_CONFIRMED en booting | `RISK_CONFIRMED` | sin salir de `booting` sin `BOOT_OK` | `presenting/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | **FALLA · SB-1** |
| B1 | RISK_CLEARED con uncertain en pausa | `BOOT_OK → RISK_UNCERTAIN → PAUSE_ASSISTANT → RISK_CLEARED` | rechazo (EV-RISK-CLEARED-FROM-PAUSED-UNCERTAIN-FORBIDDEN) | rechazo explícito en `RISK_CLEARED`; entrada intacta: sí | PASS |
| B2 | RISK_CLEARED tras error técnico en uncertain | `BOOT_OK → RISK_UNCERTAIN → TECHNICAL_ERROR → RISK_CLEARED` | rechazo | rechazo explícito en `RISK_CLEARED`; entrada intacta: sí | PASS |
| B3 | ASK_CLARIFICATION durante uncertain | `BOOT_OK → RISK_UNCERTAIN → ASK_CLARIFICATION` | rechazo | rechazo explícito en `ASK_CLARIFICATION`; entrada intacta: sí | PASS |
| C1 | pausa en risk | `BOOT_OK → RISK_CONFIRMED → PAUSE_ASSISTANT` | `paused` + `protection_static` | `paused/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | PASS |
| C2 | reset en human_handoff | `BOOT_OK → RISK_CONFIRMED → HUMAN_HANDOFF → RESET_SESSION` | conserva `human_handoff` | `presenting/human_handoff/human_handoff/silent/protection_static`; válido para el contrato: sí | PASS |
| C3 | error y retry en uncertain | `BOOT_OK → RISK_UNCERTAIN → TECHNICAL_ERROR → RETRY` | conserva `uncertain` | `awaiting_clarification/clarification/uncertain/silent/protection_static`; válido para el contrato: sí | PASS |
| C4 | voz activa interrumpida por RISK_UNCERTAIN | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → RISK_UNCERTAIN` | voz silenciada, `protection_static` | `awaiting_clarification/clarification/uncertain/silent/protection_static`; válido para el contrato: sí | PASS |
| C5 | SPEECH_REQUEST en risk | `BOOT_OK → RISK_CONFIRMED → SPEECH_REQUEST` | rechazo | rechazo explícito en `SPEECH_REQUEST`; entrada intacta: sí | PASS |
| C6 | SPEECH_ERROR tardío tras interrupción por RISK_UNCERTAIN | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → RISK_UNCERTAIN → SPEECH_ERROR` | `uncertain` conserva `protection_static` | `awaiting_clarification/clarification/uncertain/error/off`; válido para el contrato: **NO** (uncertain exige protection_static) | **FALLA · SB-2** |
| C7 | SPEECH_ERROR tardío tras interrupción por RISK_CONFIRMED | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → RISK_CONFIRMED → SPEECH_ERROR` | `protection_static` (EV-SPEECH-ERROR-RISK) | `presenting/human_handoff/risk/error/protection_static`; válido para el contrato: sí | PASS |
| C8 | SPEECH_ERROR en uncertain y SUBMIT | `BOOT_OK → RISK_UNCERTAIN → SPEECH_ERROR → SUBMIT` | recupera `protection_static` | `awaiting_clarification/clarification/uncertain/silent/protection_static`; válido para el contrato: sí | PASS |
| D1 | REQUEST → starting sin ondas | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST` | `starting`, sin ondas | `presenting/information/normal/starting/ambient`; válido para el contrato: sí | PASS |
| D2 | START sin REQUEST | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_START` | rechazo | rechazo explícito en `SPEECH_START`; entrada intacta: sí | PASS |
| D3 | BOUNDARY en starting | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_BOUNDARY` | rechazo | rechazo explícito en `SPEECH_BOUNDARY`; entrada intacta: sí | PASS |
| D4 | voz completa con pausa y reanudación | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → SPEECH_BOUNDARY → SPEECH_PAUSE → SPEECH_RESUME → SPEECH_END` | `ended`, energía 0 | `presenting/information/normal/ended/ambient`; válido para el contrato: sí | PASS |
| D5 | STOP desde paused | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → SPEECH_PAUSE → SPEECH_STOP` | `ended` | `presenting/information/normal/ended/ambient`; válido para el contrato: sí | PASS |
| D6 | error de voz mientras habla | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → SPEECH_ERROR` | `error/off` | `presenting/information/normal/error/off`; válido para el contrato: sí | PASS |
| D7 | BOUNDARY con energía fuera de rango | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → SPEECH_BOUNDARY` | rechazo | rechazo explícito en `SPEECH_BOUNDARY`; entrada intacta: sí | PASS |
| E1 | reducido: voz completa | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → SPEECH_REQUEST → SPEECH_START → SPEECH_BOUNDARY` (inicial reducido) | `speaking` con `off` | `presenting/information/normal/speaking/off`; válido para el contrato: sí | PASS |
| E2 | reducido: RISK_UNCERTAIN y RISK_CLEARED | `BOOT_OK → RISK_UNCERTAIN → RISK_CLEARED` (inicial reducido) | `off` por preferencia reducida | `retrieving/clarification/normal/silent/processing`; válido para el contrato: sí | HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL (N-1) |
| E3 | reducido: RISK_CLEARED y RETRIEVAL_OK | `BOOT_OK → RISK_UNCERTAIN → RISK_CLEARED → RETRIEVAL_OK` (inicial reducido) | `off` | `composing/clarification/normal/silent/off`; válido para el contrato: sí | PASS |
| E4 | sin motion_meta y off: voz | `SPEECH_REQUEST → SPEECH_START` (presenting sin motion_meta, motion=off) | `speaking` con `off` | `presenting/information/normal/speaking/off`; válido para el contrato: sí | PASS |
| E5 | sin motion_meta y off: SUBMIT y RETRIEVAL_OK | `SUBMIT → RETRIEVAL_OK → RESPONSE_READY` (presenting sin motion_meta, motion=off) | `off` | `presenting/information/normal/silent/off`; válido para el contrato: sí | PASS |
| E6 | sin motion_meta y off: RISK_UNCERTAIN, RISK_CLEARED, RETRIEVAL_OK | `RISK_UNCERTAIN → RISK_CLEARED → RETRIEVAL_OK` (presenting sin motion_meta, motion=off) | `processing` tras `RISK_CLEARED` (fila contractual); luego según `ordinaryMotionFor` | `composing/clarification/normal/silent/processing`; válido para el contrato: sí | PASS según contrato (ver N-1) |
| E7 | reducido en risk | `BOOT_OK → RISK_CONFIRMED` (inicial reducido) | `protection_static` prevalece | `presenting/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | PASS |
| F1 | HIDE y SHOW en pausa con riesgo | `BOOT_OK → RISK_CONFIRMED → PAUSE_ASSISTANT → HIDE → SHOW` | solo cambia la visibilidad | `paused/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | PASS |
| F2 | RESET_SESSION con panel plegado | `BOOT_OK → COLLAPSE → RESET_SESSION` | reset según contrato | `ready/none/normal/silent/ambient`; válido para el contrato: sí | PASS; observación N-4 |
| G1 | baja intensidad a través de riesgo, pausa, error, retry y reset | `BOOT_OK → SET_LOW_INTENSITY → RISK_CONFIRMED → PAUSE_ASSISTANT → TECHNICAL_ERROR → RETRY → RESET_SESSION` | `intensity=low` se conserva | `presenting/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | PASS |
| G2 | SET_LOW_INTENSITY con cadena 'false' | `BOOT_OK → SET_LOW_INTENSITY` | valor validado | `ready/none/normal/silent/ambient`; válido para el contrato: sí | Observación N-3 |
| H1 | RETRIEVAL_EMPTY frente a TECHNICAL_ERROR | `BOOT_OK → SUBMIT → RETRIEVAL_EMPTY` | `insufficient` sin error | `presenting/insufficient/normal/silent/ambient`; válido para el contrato: sí | PASS |
| H2 | TECHNICAL_ERROR durante retrieving | `BOOT_OK → SUBMIT → TECHNICAL_ERROR` | `error` sin `insufficient` | `error/none/normal/silent/off`; válido para el contrato: sí | PASS |
| H3 | error técnico durante pausa y retry | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → PAUSE_ASSISTANT → TECHNICAL_ERROR → RETRY` | `ready` (EV-RETRY-NORMAL) | `ready/none/normal/silent/ambient`; válido para el contrato: sí | PASS; observación N-5 |
| I1 | reset normal tras respuesta | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → RESET_SESSION` | `ready`, sesión reiniciada | `ready/none/normal/silent/ambient`; válido para el contrato: sí | PASS |
| I2 | reset en risk | `BOOT_OK → RISK_CONFIRMED → RESET_SESSION` | conserva `risk` | `presenting/human_handoff/risk/silent/protection_static`; válido para el contrato: sí | PASS |

**Resultados de la exploración exhaustiva** (J y resto):

| Invariante | Resultado |
|---|---|
| Un rechazo no modifica el estado ni el evento | 0 violaciones en 5 745 744 rechazos |
| Una transición aceptada incrementa `revision` exactamente en 1 y no muta la entrada | 0 violaciones |
| Estados públicos válidos para el contrato | solo falla SB-2 |
| Estados válidos para la máquina | 0 violaciones |
| `energy = 0` cuando no habla | 0 violaciones |
| `voice_reactive` solo con `speaking` y seguridad `normal` | 0 violaciones |
| Visibilidad sin efecto en otras capas | 0 violaciones |
| Adaptación alterada por eventos que no son `SET_*` | 0 violaciones (baja intensidad se conserva en protección) |
| Error técnico confundido con insuficiencia | 0 violaciones |
| Campos públicos fuera del contrato | 0 (sin estados cognitivos ni etiquetas diagnósticas) |
| Valores declarados inalcanzables | ninguno |
| Movimiento con `reduced=true` en seguridad `normal` | solo tras `RISK_CLEARED` (N-1) |
| `motion=off` sin `motion_meta` reactivado | solo derivado de SB-2 |

### Hallazgos no bloqueantes

- **N-1 · `HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL`.** `RISK_CLEARED` con `motion_meta.reduced=true` da `processing` (E2). La única fila contractual parte de `reduced:false` y prescribe `processing`, sin variante reducida, mientras que la voz sí tiene variantes reducidas. La máquina cumple la salida exacta. Se recomienda que QA fije `off` con preferencia reducida.
- **N-2 · `HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL`.** `speech_meta.end_reason` no tiene enumeración cerrada. Ya lo registró QA.
- **N-3.** `SET_LOW_INTENSITY {enabled: "false"}` activa baja intensidad por coerción (G2). No es un evento del contrato; el controlador S1 debería usar `SET_ADAPTATION`, que sí valida.
- **N-4.** `RESET_SESSION` fuerza `visibility=expanded` (F2). Las filas contractuales parten de `expanded`, así que no hay contradicción.
- **N-5.** Tras un error técnico durante la pausa, `RETRY` devuelve `ready` y la pausa se pierde (H3, conforme a EV-RETRY-NORMAL). `RISK_*` también levanta la pausa. Es una decisión de presentación para S1.
- **N-6.** `RESET_SESSION` conserva las preferencias de adaptación y `error_meta`. `RETRY` conserva `error_meta` por contrato.

### Arrays

Coincide con la evidencia QA: `motion_meta: []` y `error_meta: []` se rechazan. No se reabre.

## 6. Separación S0 / S1

**S0 (máquina pura):** SB-1 y SB-2. Son las únicas contradicciones que impiden aprobar la semántica.

**PENDIENTE_S1** (no reabren S0):
1. `sabik-page.js` aún no consume la máquina. El panel antiguo mezcla Parar, reset y visibilidad (`01`, `02`). `dist` publica `sabik-machine.js` sin uso.
2. **Comunicación durante la derivación:** en protección se rechaza `SUBMIT` (S0R-06). S1 debe mostrar recurso humano y reinicio y explicar la ausencia de entrada de texto. **[E]** Cierre de la derivación dentro de la sesión.
3. Continuidad conversacional entre turnos y seguridad conversacional del motor (`03`, `04`, sobre el runtime antiguo): 17 falsos negativos críticos, falsos positivos, persistencia y «No es esto» sobre riesgo.
4. Recursos humanos: el dataset está vacío y los candidatos 112 y 024 no son publicables (`05`).
5. Foco, regiones vivas, `lang` del panel y anuncios (`02` §8 y §12).
6. Mapeo real de `speechSynthesis` a `SPEECH_REQUEST/START/BOUNDARY/END/ERROR`, incluidos los errores `interrupted`/`canceled` tras `cancel()` (relevante para SB-2).
7. Retirar la inferencia de estados cognitivos del runtime antiguo al integrar (`01` §9).
8. Presentación de pausa tras error o seguridad (N-5), visibilidad al reiniciar (N-4) y validación de preferencias en el controlador (N-3).
9. Índice funcional y datasets (`06`, `07`).

**Para QA (precisión contractual, sin bloqueo):** N-1, N-2 y las filas sugeridas en SB-1 y SB-2.

## 7. Condiciones para `SEMANTICA_S0_APROBADA`

1. SB-1 y SB-2 corregidos en la máquina, con pruebas propias.
2. Las secuencias A5–A9 y C6 de este informe en PASS, y exploración sin estados inválidos para el contrato ni flujo ordinario sin `BOOT_OK`.
3. Puerta QA repetida sobre el nuevo SHA (o decisión expresa de Astra sobre su alcance).

## Anexo A · `sonda-semantica-final.mjs`

<details><summary>Código (SHA-256 30d3be4a…)</summary>

```js
// Sonda semántica final S0 (fuera del repositorio). Uso: node sonda-semantica-final.mjs <maquina.js> <raiz-contrato>
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const [machinePath, qaRoot] = process.argv.slice(2).map((p) => resolve(p));
const M = createRequire(import.meta.url)(machinePath);
const { validateState } = await import(pathToFileURL(resolve(qaRoot, "tests/specs/sabik/validate-s0-contract-consistency.mjs")).href);
const contract = JSON.parse(await readFile(resolve(qaRoot, "tests/specs/sabik/s0-state-contract.json"), "utf8"));
const E = M.SABIK_MACHINE.EVENTS;
const J = (v) => JSON.stringify(v), clone = (v) => JSON.parse(J(v));
const contractOk = (s) => { try { validateState(clone(s), contract, "s"); return null; } catch (e) { return e.message; } };
const brief = (s) => ({ operation: s.operation, dialogue: s.dialogue, safety: s.safety, speech: s.speech, motion: s.motion, visibility: s.visibility, revision: s.revision, reduced: s.motion_meta ? s.motion_meta.reduced : "(sin motion_meta)", intensity: s.adaptation.intensity, energy: s.speech_meta?.energy, error_meta: s.error_meta });
function run(steps, start) {
  let s = start ? clone(start) : M.createInitialSabikState(); const trail = [];
  for (const raw of steps) {
    const ev = typeof raw === "string" ? { type: raw } : raw, before = J(s), evBefore = J(ev);
    try { const n = M.transitionSabikState(s, ev); if (J(s) !== before || J(ev) !== evBefore) return { error: "MUTACION_EN_ACEPTACION" }; s = n; trail.push(ev.type); }
    catch (e) { return { rechazado_en: ev.type, razon: e.message, estado: brief(s), intacto: J(s) === before && J(ev) === evBefore, trail }; }
  }
  const ce = contractOk(s);
  return { final: brief(s), contrato_valido: ce === null, contrato_error: ce, trail };
}
const out = { historicos: [], comprobaciones: [], exploracion: {} };
const B = [E.BOOT_OK], ANS = [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_OK, E.RESPONSE_READY], RISK = [E.BOOT_OK, E.RISK_CONFIRMED], HO = [...RISK, E.HUMAN_HANDOFF];
const H = [
 ["S0R-01", "Contestar la aclaración de seguridad", [E.BOOT_OK, E.RISK_UNCERTAIN, E.SUBMIT], "aceptado; awaiting_clarification/clarification/uncertain (B07)", (r) => r.final && r.final.operation === "awaiting_clarification" && r.final.safety === "uncertain" && r.contrato_valido],
 ["S0R-02", "Contestar una aclaración ordinaria", [...ANS, E.ASK_CLARIFICATION, E.SUBMIT], "aceptado; retrieving/clarification/normal (B06)", (r) => r.final && r.final.operation === "retrieving" && r.final.dialogue === "clarification" && r.contrato_valido],
 ["S0R-03", "RISK_UNCERTAIN durante retrieving", [E.BOOT_OK, E.SUBMIT, E.RISK_UNCERTAIN], "aceptado; uncertain con protection_static", (r) => r.final && r.final.safety === "uncertain" && r.final.motion === "protection_static" && r.contrato_valido],
 ["S0R-04", "RISK_CONFIRMED durante composing", [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_OK, E.RISK_CONFIRMED], "aceptado; presenting/human_handoff/risk", (r) => r.final && r.final.safety === "risk" && r.final.dialogue === "human_handoff" && r.contrato_valido],
 ["S0R-05", "RISK_CONFIRMED durante presenting (segundo mensaje)", [...ANS, E.RISK_CONFIRMED], "aceptado; presenting/human_handoff/risk (EV-RISK-CONFIRMED)", (r) => r.final && r.final.safety === "risk" && r.contrato_valido],
 ["S0R-06", "SUBMIT tras HUMAN_HANDOFF", [...HO, E.SUBMIT], "sin estado inválido: rechazo explícito y limpio (la protección no admite flujo ordinario)", (r) => r.rechazado_en === "SUBMIT" && r.intacto && /transition/.test(r.razon)],
 ["S0R-07", "TECHNICAL_ERROR y RETRY tras HUMAN_HANDOFF", [...HO, { type: E.TECHNICAL_ERROR, code: "resource-load" }, E.RETRY], "presenting/human_handoff/human_handoff/protection_static (EV-RETRY-HANDOFF)", (r) => r.final && r.final.safety === "human_handoff" && r.final.operation === "presenting" && r.contrato_valido],
 ["S0R-08", "RISK_UNCERTAIN desde risk", [...RISK, E.RISK_UNCERTAIN], "rechazo sin cambios (no se rebaja)", (r) => r.rechazado_en === "RISK_UNCERTAIN" && r.intacto && r.estado.safety === "risk"],
 ["S0R-09", "HUMAN_HANDOFF → pausa → reanudar → RISK_UNCERTAIN", [...HO, E.PAUSE_ASSISTANT, E.RESUME_ASSISTANT, E.RISK_UNCERTAIN], "rechazo sin cambios", (r) => r.rechazado_en === "RISK_UNCERTAIN" && r.intacto && r.estado.safety === "human_handoff"],
 ["S0R-10", "PAUSE y RESUME durante booting", [E.PAUSE_ASSISTANT, E.RESUME_ASSISTANT], "PAUSE rechazado en booting (EV-BOOT-PAUSE_ASSISTANT-FORBIDDEN)", (r) => r.rechazado_en === "PAUSE_ASSISTANT" && r.intacto && r.estado.operation === "booting"],
 ["S0R-11", "RESET_SESSION durante booting", [E.RESET_SESSION], "rechazo (EV-BOOT-RESET_SESSION-FORBIDDEN)", (r) => r.rechazado_en === "RESET_SESSION" && r.intacto && r.estado.operation === "booting"],
 ["S0R-12", "TECHNICAL_ERROR y RETRY durante booting", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, E.RETRY], "booting (EV-BOOT-RETRY)", (r) => r.final && r.final.operation === "booting" && r.contrato_valido],
 ["S0R-13", "Movimiento con riesgo confirmado", RISK, "protection_static", (r) => r.final && r.final.motion === "protection_static" && r.contrato_valido],
];
for (const [id, desc, steps, esperado, ok] of H) { const r = run(steps); out.historicos.push({ id, desc, secuencia: steps.map((x) => x.type || x), esperado, resultado: r, veredicto: ok(r) ? "RESUELTO" : "SIGUE_VIGENTE" }); }
const reduced = M.createInitialSabikState({ reduced_motion: true });
const noMeta = (() => { const s = run(ANS).final; const st = M.transitionSabikState(M.transitionSabikState(M.transitionSabikState(M.transitionSabikState(M.createInitialSabikState(), { type: E.BOOT_OK }), { type: E.SUBMIT }), { type: E.RETRIEVAL_OK }), { type: E.RESPONSE_READY }); const c = clone(st); delete c.motion_meta; c.motion = "off"; return c; })();
const C = [
 ["A1", "arranque", "SUBMIT en booting", [E.SUBMIT], null],
 ["A2", "arranque", "SPEECH_REQUEST en booting", [E.SPEECH_REQUEST], null],
 ["A3", "arranque", "BOOT_OK", B, null],
 ["A4", "arranque", "BOOT_OK repetido", [...B, E.BOOT_OK], null],
 ["A5", "arranque", "error de arranque y RESET_SESSION", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, E.RESET_SESSION], null],
 ["A6", "arranque", "doble error de arranque y RETRY", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, { type: E.TECHNICAL_ERROR, code: "dataset-load" }, E.RETRY], null],
 ["A7", "arranque", "doble error de arranque, RETRY y SUBMIT", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, { type: E.TECHNICAL_ERROR, code: "dataset-load" }, E.RETRY, E.SUBMIT], null],
 ["A8", "arranque", "RISK_UNCERTAIN en booting, RISK_CLEARED y RETRIEVAL_OK", [E.RISK_UNCERTAIN, E.RISK_CLEARED, E.RETRIEVAL_OK], null],
 ["A9", "arranque", "RISK_CONFIRMED en booting", [E.RISK_CONFIRMED], null],
 ["B1", "aclaracion", "RISK_CLEARED con uncertain en pausa", [E.BOOT_OK, E.RISK_UNCERTAIN, E.PAUSE_ASSISTANT, E.RISK_CLEARED], null],
 ["B2", "aclaracion", "RISK_CLEARED tras error técnico en uncertain", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.TECHNICAL_ERROR, code: "x" }, E.RISK_CLEARED], null],
 ["B3", "aclaracion", "ASK_CLARIFICATION durante uncertain", [E.BOOT_OK, E.RISK_UNCERTAIN, E.ASK_CLARIFICATION], null],
 ["C1", "seguridad", "pausa en risk", [...RISK, E.PAUSE_ASSISTANT], null],
 ["C2", "seguridad", "reset en human_handoff", [...HO, E.RESET_SESSION], null],
 ["C3", "seguridad", "error y retry en uncertain", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.TECHNICAL_ERROR, code: "x" }, E.RETRY], null],
 ["C4", "seguridad", "voz activa interrumpida por RISK_UNCERTAIN", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.RISK_UNCERTAIN], null],
 ["C5", "seguridad", "SPEECH_REQUEST en risk", [...RISK, E.SPEECH_REQUEST], null],
 ["C6", "seguridad", "SPEECH_ERROR tardío tras interrupción por RISK_UNCERTAIN", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.RISK_UNCERTAIN, { type: E.SPEECH_ERROR, code: "interrupted" }], null],
 ["C7", "seguridad", "SPEECH_ERROR tardío tras interrupción por RISK_CONFIRMED", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.RISK_CONFIRMED, { type: E.SPEECH_ERROR, code: "interrupted" }], null],
 ["C8", "seguridad", "SPEECH_ERROR en uncertain y SUBMIT", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.SPEECH_ERROR, code: "interrupted" }, E.SUBMIT], null],
 ["D1", "voz", "REQUEST → starting sin ondas", [...ANS, E.SPEECH_REQUEST], null],
 ["D2", "voz", "START sin REQUEST", [...ANS, E.SPEECH_START], null],
 ["D3", "voz", "BOUNDARY en starting", [...ANS, E.SPEECH_REQUEST, E.SPEECH_BOUNDARY], null],
 ["D4", "voz", "voz completa con pausa y reanudación", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.SPEECH_BOUNDARY, E.SPEECH_PAUSE, E.SPEECH_RESUME, E.SPEECH_END], null],
 ["D5", "voz", "STOP desde paused", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.SPEECH_PAUSE, E.SPEECH_STOP], null],
 ["D6", "voz", "error de voz mientras habla", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, { type: E.SPEECH_ERROR, code: "x" }], null],
 ["D7", "voz", "BOUNDARY con energía fuera de rango", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, { type: E.SPEECH_BOUNDARY, energy: 2 }], null],
 ["E1", "movimiento", "reducido: voz completa", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.SPEECH_BOUNDARY], reduced],
 ["E2", "movimiento", "reducido: RISK_UNCERTAIN y RISK_CLEARED", [E.BOOT_OK, E.RISK_UNCERTAIN, E.RISK_CLEARED], reduced],
 ["E3", "movimiento", "reducido: RISK_CLEARED y RETRIEVAL_OK", [E.BOOT_OK, E.RISK_UNCERTAIN, E.RISK_CLEARED, E.RETRIEVAL_OK], reduced],
 ["E4", "movimiento", "sin motion_meta y off: voz", [E.SPEECH_REQUEST, E.SPEECH_START], noMeta],
 ["E5", "movimiento", "sin motion_meta y off: SUBMIT y RETRIEVAL_OK", [E.SUBMIT, E.RETRIEVAL_OK, E.RESPONSE_READY], noMeta],
 ["E6", "movimiento", "sin motion_meta y off: RISK_UNCERTAIN, RISK_CLEARED, RETRIEVAL_OK", [E.RISK_UNCERTAIN, E.RISK_CLEARED, E.RETRIEVAL_OK], noMeta],
 ["E7", "movimiento", "reducido en risk", [E.BOOT_OK, E.RISK_CONFIRMED], reduced],
 ["F1", "visibilidad", "HIDE y SHOW en pausa con riesgo", [...RISK, E.PAUSE_ASSISTANT, E.HIDE, E.SHOW], null],
 ["F2", "visibilidad", "RESET_SESSION con panel plegado", [E.BOOT_OK, E.COLLAPSE, E.RESET_SESSION], null],
 ["G1", "adaptacion", "baja intensidad a través de riesgo, pausa, error, retry y reset", [E.BOOT_OK, { type: E.SET_LOW_INTENSITY, enabled: true }, E.RISK_CONFIRMED, E.PAUSE_ASSISTANT, { type: E.TECHNICAL_ERROR, code: "x" }, E.RETRY, E.RESET_SESSION], null],
 ["G2", "adaptacion", "SET_LOW_INTENSITY con cadena 'false'", [E.BOOT_OK, { type: E.SET_LOW_INTENSITY, enabled: "false" }], null],
 ["H1", "error", "RETRIEVAL_EMPTY frente a TECHNICAL_ERROR", [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_EMPTY], null],
 ["H2", "error", "TECHNICAL_ERROR durante retrieving", [E.BOOT_OK, E.SUBMIT, { type: E.TECHNICAL_ERROR, code: "x" }], null],
 ["H3", "error", "error técnico durante pausa y retry", [...ANS, E.PAUSE_ASSISTANT, { type: E.TECHNICAL_ERROR, code: "x" }, E.RETRY], null],
 ["I1", "reset", "reset normal tras respuesta", [...ANS, E.RESET_SESSION], null],
 ["I2", "reset", "reset en risk", [...RISK, E.RESET_SESSION], null],
];
for (const [id, grupo, desc, steps, start] of C) out.comprobaciones.push({ id, grupo, desc, secuencia: steps.map((x) => x.type || x), inicio: start ? (start === reduced ? "inicial reducido" : "presenting sin motion_meta, motion=off") : "inicial", resultado: run(steps, start) });
// Exploración exhaustiva
const EV = [];
for (const t of Object.values(E)) {
  if (t === E.RESPONSE_READY) for (const d of ["information", "practical", "accompaniment", "correction", "clarification", "insufficient"]) EV.push({ type: t, dialogue: d });
  else if (t === E.SET_REDUCED_MOTION || t === E.SET_LOW_INTENSITY) EV.push({ type: t, enabled: true }, { type: t, enabled: false });
  else if (t === E.SET_LANGUAGE) EV.push({ type: t, language: "en" }, { type: t, language: "es" });
  else if (t === E.SET_QUESTION_POLICY) EV.push({ type: t, value: "none" });
  else if (t === E.TECHNICAL_ERROR) EV.push({ type: t, code: "x" });
  else if (t === E.SPEECH_ERROR) EV.push({ type: t, code: "x" });
  else EV.push({ type: t });
}
const key = (s, booted) => J([s.operation, s.dialogue, s.safety, s.visibility, s.speech, s.motion, s.language, s.adaptation, s.motion_meta ?? null, s.speech_meta, s.error_meta ?? null, booted]);
const starts = [[M.createInitialSabikState(), false], [reduced, false], [noMeta, true]];
const seen = new Map(); const q = [];
for (const [s, b] of starts) { const k = key(s, b); if (!seen.has(k)) { seen.set(k, { s, b, via: "inicio" }); q.push(k); } }
const viol = {}; const add = (k, ex) => { (viol[k] ||= { n: 0, ejemplos: [] }).n++; if (viol[k].ejemplos.length < 3) viol[k].ejemplos.push(ex); };
let transiciones = 0, rechazos = 0, acotados = 0;
const ORD = new Set(["ready", "retrieving", "composing", "presenting", "awaiting_clarification", "paused"]);
while (q.length) {
  const k = q.shift(); const { s, b } = seen.get(k);
  for (const ev of EV) {
    const sb = J(s), eb = J(ev); let n;
    try { n = M.transitionSabikState(s, ev); } catch (e) { rechazos++; if (J(s) !== sb || J(ev) !== eb) add("rechazo_muta_entrada", { de: brief(s), ev }); continue; }
    transiciones++;
    if (J(s) !== sb || J(ev) !== eb) add("aceptacion_muta_entrada", { de: brief(s), ev });
    if (n.revision !== s.revision + 1) add("revision_no_+1", { de: brief(s), ev });
    const ce = contractOk(n); if (ce) add(`estado_invalido_para_el_contrato: ${ce.replace(/^s: /, "")}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (!M.validateSabikState(n).ok) add("estado_invalido_para_la_maquina", { de: brief(s), ev: ev.type });
    const nb = b || ev.type === E.BOOT_OK;
    if (!nb && ORD.has(n.operation)) add(`flujo_sin_BOOT_OK: ${ev.type} → ${n.operation}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (n.speech !== "speaking" && n.speech_meta.energy !== 0) add("energia_sin_hablar", { a: brief(n) });
    if (n.motion === "voice_reactive" && (n.speech !== "speaking" || n.safety !== "normal")) add("voice_reactive_incoherente", { a: brief(n) });
    if (n.safety === "normal" && n.motion_meta && n.motion_meta.reduced === true && n.motion !== "off") add(`reducido_con_movimiento: ${ev.type} → ${n.motion}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (n.safety === "normal" && !("motion_meta" in n) && s.motion === "off" && n.motion !== "off") add(`sin_meta_off_reactivado: ${ev.type} → ${n.motion}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (["COLLAPSE", "EXPAND", "HIDE", "SHOW"].includes(ev.type)) { const a = clone(s), c = clone(n); delete a.visibility; delete c.visibility; delete a.revision; delete c.revision; if (J(a) !== J(c)) add("visibilidad_cambia_otras_capas", { ev: ev.type, de: brief(s), a: brief(n) }); }
    if (J(n.adaptation) !== J(s.adaptation) && !ev.type.startsWith("SET_")) add(`adaptacion_alterada_por_${ev.type}`, { de: brief(s), a: brief(n) });
    if (n.operation === "error" && n.dialogue === "insufficient") add("error_confundido_con_insuficiencia", { a: brief(n) });
    if (Object.keys(n).some((x) => !["operation", "dialogue", "adaptation", "safety", "visibility", "speech", "motion", "language", "revision", "speech_meta", "motion_meta", "error_meta"].includes(x))) add("campo_publico_no_contractual", { a: Object.keys(n) });
    if (n.speech_meta.boundary_count > 2) { acotados++; continue; } // cota: boundary_count crece sin límite
    const nk = key(n, nb);
    if (!seen.has(nk)) { seen.set(nk, { s: n, b: nb }); q.push(nk); }
  }
}
const dist = (f) => [...new Set([...seen.values()].map((v) => f(v.s)))].sort();
out.exploracion = { cota: "no se exploran estados con speech_meta.boundary_count > 2 (se comprueban igualmente)", estados_no_explorados_por_cota: acotados, estados: seen.size, transiciones_aceptadas: transiciones, rechazos, eventos_probados: EV.length,
  valores: { operation: dist((s) => s.operation), dialogue: dist((s) => s.dialogue), safety: dist((s) => s.safety), speech: dist((s) => s.speech), motion: dist((s) => s.motion), visibility: dist((s) => s.visibility) },
  inalcanzables: Object.fromEntries(Object.entries({ operation: "OPERATION", dialogue: "DIALOGUE", safety: "SAFETY", speech: "SPEECH", motion: "MOTION", visibility: "VISIBILITY" }).map(([k, c]) => [k, Object.values(M.SABIK_MACHINE[c]).filter((v) => !dist((s) => s[k]).includes(v))])),
  violaciones: viol };
console.log(J(out));

```

</details>

## Anexo B · `raiz-estado-invalido.mjs`

<details><summary>Código (SHA-256 6a22c48a…)</summary>

```js
// Identifica qué eventos llevan de un estado válido para el contrato a uno inválido (exploración reducida).
import { readFile } from "node:fs/promises"; import { resolve } from "node:path"; import { pathToFileURL } from "node:url"; import { createRequire } from "node:module";
const [mp, qa] = process.argv.slice(2).map((p) => resolve(p));
const M = createRequire(import.meta.url)(mp);
const { validateState } = await import(pathToFileURL(resolve(qa, "tests/specs/sabik/validate-s0-contract-consistency.mjs")).href);
const c = JSON.parse(await readFile(resolve(qa, "tests/specs/sabik/s0-state-contract.json"), "utf8"));
const ok = (s) => { try { validateState(JSON.parse(JSON.stringify(s)), c, "s"); return true; } catch { return false; } };
const E = M.SABIK_MACHINE.EVENTS;
const EV = [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_OK, E.RETRIEVAL_EMPTY, E.RESPONSE_READY, E.ASK_CLARIFICATION, E.PAUSE_ASSISTANT, E.RESUME_ASSISTANT, E.RESET_SESSION, E.COLLAPSE, E.SPEECH_REQUEST, E.SPEECH_START, E.SPEECH_PAUSE, E.SPEECH_STOP, E.SPEECH_ERROR, E.RISK_UNCERTAIN, E.RISK_CONFIRMED, E.RISK_CLEARED, E.HUMAN_HANDOFF, E.TECHNICAL_ERROR, E.RETRY].map((t) => ({ type: t }));
EV.push({ type: E.SET_REDUCED_MOTION, enabled: true });
const key = (s) => JSON.stringify([s.operation, s.dialogue, s.safety, s.visibility, s.speech, s.motion, s.motion_meta, s.speech_meta, s.error_meta ?? null]);
const seen = new Map(); const q = []; for (const s of [M.createInitialSabikState(), M.createInitialSabikState({ reduced_motion: true })]) { seen.set(key(s), s); q.push(s); }
const raiz = {}; let validas = 0;
while (q.length) { const s = q.shift(); const sOk = ok(s); if (sOk) validas++;
  for (const ev of EV) { let n; try { n = M.transitionSabikState(s, ev); } catch { continue; }
    if (sOk && !ok(n)) { const k = `${ev.type} desde ${s.operation}/${s.safety}/${s.speech}/${s.motion}`; raiz[k] = (raiz[k] || 0) + 1; }
    const nk = key(n); if (!seen.has(nk) && n.speech_meta.boundary_count <= 2) { seen.set(nk, n); q.push(n); } } }
console.log(JSON.stringify({ estados: seen.size, estados_validos: validas, transiciones_valido_a_invalido: raiz }, null, 1));

```

</details>

Reproducción: `node sonda-semantica-final.mjs <impl>/sabik/nea-core/sabik-machine.js <contrato>` y `node raiz-estado-invalido.mjs <impl>/sabik/nea-core/sabik-machine.js <contrato>` (Node 22; la sonda A tarda unos 4 minutos).
