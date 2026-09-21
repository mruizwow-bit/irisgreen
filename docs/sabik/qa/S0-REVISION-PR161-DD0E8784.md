# Tercera revalidación S0 · PR #161 · dd0e8784

**Implementación:** `dd0e8784098972287c9ae585661efb328178c1a3`  
**Contrato normativo congelado:** `e69929b4b88128c4c935435987f35532f37d2df0`  
**Base/destino:** `sabik-preview`  
**Veredicto:** `BLOQUEADO_S0`

## Método

QA no reutiliza resultados de ciclos anteriores. Se verificaron los SHA visibles en GitHub y se reconstruyeron los archivos ejecutables S0 a partir del contenido del commit publicado. El entorno de ejecución no pudo clonar el repositorio completo por indisponibilidad de red/DNS hacia GitHub; por ello V7 y `scripts/build_site.py` no se marcan como ejecutados por QA. La ausencia de build Linux `exit 0` sigue siendo bloqueante.

El contrato normativo no se ha modificado para acomodar la implementación.

## Evidencia positiva

- PR #161 apunta a `dd0e8784098972287c9ae585661efb328178c1a3`.
- PR #164 fija `e69929b4b88128c4c935435987f35532f37d2df0` como contrato normativo.
- Diff S0 limitado a cuatro archivos: `sabik/AGENTS.md`, `sabik/S0_STATE_MACHINE.md`, `sabik/nea-core/sabik-machine.js`, `tools/test-sabik-machine-s0.js`.
- Suite propia reconstruida desde el contenido del SHA publicado: **23/23 PASS**.
- Campos públicos `operation`, `dialogue`, `safety`, `visibility`, `speech`, `motion`, `language` son escalares; `revision` es entero; `adaptation` es objeto.
- `awaiting_clarification + normal + SUBMIT` continúa a `retrieving` conservando `dialogue=clarification`.
- `uncertain + SUBMIT` mantiene `uncertain`.
- `RESET_SESSION` conserva `uncertain`, `risk` y `human_handoff`.
- `SPEECH_REQUEST`, `SPEECH_START` y `SPEECH_BOUNDARY` son eventos distintos; `SPEECH_REQUEST` no activa `voice_reactive`.
- movimiento reducido mantiene voz con `motion=off` cuando la preferencia reducida ya forma parte del estado.
- `RISK_CONFIRMED` interrumpe voz ordinaria y fuerza `protection_static`.
- eventos rechazados no mutan la entrada ni incrementan la revisión observable.
- sondas independientes: determinismo, inmutabilidad y serialización → PASS.

## Bloqueo B07-A · `RISK_CLEARED` rebaja estados protegidos

**Caso contractual:** `B07-RISK-CLEARED-FROM-RISK-FORBIDDEN` y `B07-RISK-CLEARED-FROM-HANDOFF-FORBIDDEN`.

**Evidencia:** la implementación acepta:

```js
previous.safety === SAFETY.UNCERTAIN ||
previous.safety === SAFETY.RISK ||
previous.safety === SAFETY.HUMAN_HANDOFF
```

para `RISK_CLEARED`. Las sondas QA observan que `risk + RISK_CLEARED` y `human_handoff + RISK_CLEARED` terminan en `safety=normal`.

**Riesgo:** una protección confirmada puede degradarse mediante un evento reservado exclusivamente a resolver una aclaración incierta.

**Criterio incumplido:** la adenda congelada limita `RISK_CLEARED` a `safety=uncertain`.

**Corrección mínima:** aceptar `RISK_CLEARED` únicamente cuando `previous.safety === uncertain`; rechazar explícitamente desde `normal`, `risk` y `human_handoff` sin cambiar estado ni `revision`.

## Bloqueo B07-B · salida incorrecta de `uncertain + RISK_CLEARED`

**Caso contractual:** `B07-RISK-CLEARED-FROM-UNCERTAIN`.

**Esperado:** `safety=normal`, `operation=retrieving`, `dialogue=clarification`, `speech=silent`, `motion=processing`, conservando el contexto externo de la aclaración.

**Observado:** `safety=normal`, `operation=ready`, `dialogue=none`, `motion=ambient`.

**Riesgo:** la aclaración se resuelve como reinicio de flujo, perdiendo la continuidad contractual de la respuesta ya enviada.

**Corrección mínima:** al despejar incertidumbre, continuar la misma interacción hacia `retrieving/clarification/processing`.

## Bloqueo VOICE-A · pausa de voz no apaga movimiento

**Caso contractual:** `VOICE-SPEECH-PAUSE`.

**Esperado:** `speech=paused`, `motion=off`.

**Observado:** `speech=paused`, `motion=ambient` con movimiento normal.

**Corrección mínima:** `SPEECH_PAUSE` debe fijar `motion=off` independientemente de movimiento reducido.

## Bloqueo VOICE-B · error de voz no apaga movimiento

**Caso contractual:** `VOICE-SPEECH-ERROR`.

**Esperado:** `speech=error`, `motion=off`.

**Observado:** `speech=error`, `motion=ambient` en seguridad normal.

**Corrección mínima:** `SPEECH_ERROR` debe fijar `motion=off`; durante seguridad protegida debe prevalecer `protection_static`.

## Bloqueo B02 residual · metadatos opcionales tratados como obligatorios

La adenda congela `speech_meta` y `motion_meta` como metadatos opcionales. La implementación rechaza cualquier estado canónico que no contenga ambos objetos (`invalid speech_meta`, `invalid motion_meta`). El contrato público no puede depender de que esos metadatos existan si pueden vivir alternativamente en `deriveSabikPresentation()`.

**Corrección mínima:** aceptar la forma pública canónica sin metadatos y normalizarlos internamente, o mover su necesidad fuera de la interfaz pública pura.

## B05 · build completo no demostrado

Para `dd0e8784…` GitHub no muestra workflow runs de pull request ni statuses/checks concluidos. QA tampoco pudo ejecutar el checkout completo Linux porque el entorno no dispone de acceso de red para clonar el repositorio. Por tanto no existe evidencia de `python3 scripts/build_site.py` con `exit 0` sobre este SHA.

Esto permanece **BLOQUEANTE**. La evidencia local Windows anterior no se hereda.

## V7 y fixtures Claude

- Codex declara localmente `node tools/test-sabik-page-v7.js → 28/28`, pero QA no lo marca como PASS independiente en este ciclo porque no pudo reconstruir el checkout completo.
- PR #162 sigue sin una entrega semántica delta revisable integrada en su head; la semántica congelada B06/B07 sí está publicada como coordinación, pero no sustituye la revisión delta requerida para abrir S1.

## Resultado

```text
BLOQUEADO_S0
```

La suite propia verde no compensa fallos de seguridad/voz del contrato ni la ausencia de build reproducible. S1 y S2 continúan cerrados. PR #161 y #164 permanecen draft. `main`, producción y `noindex` no cambian.
