# S0 · puerta consolidada contra PR #161

**Implementación:** `904da38156fa390c330a02a3b9717cf6d92a3080`  
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`  
**PR implementación:** #161  
**PR QA:** #164  
**Veredicto:** `BLOQUEADO_S0`

## Entorno de QA

```text
Linux 6.18.44 x86_64 GNU/Linux
Python 3.13.5
Node v22.16.0
git 2.47.3
```

## Reconstrucción limpia solicitada

Se intentó crear un checkout independiente desde GitHub, sin utilizar el directorio de Codex:

```bash
git clone --no-checkout https://github.com/mruizwow-bit/irisgreen.git /tmp/irisgreen-origin.git
```

Resultado del entorno Linux de QA:

```text
fatal: unable to access 'https://github.com/mruizwow-bit/irisgreen.git/':
Could not resolve host: github.com
```

También se buscó una copia `.git` ya montada bajo `/mnt/data`, `/home/oai/share`, `/workspace` y `/tmp`; no existe un checkout local reutilizable. Por tanto no se ha sustituido el requisito de dos worktrees por un árbol no verificable.

## SHA verificados en GitHub

PR #161 apunta a:

```text
904da38156fa390c330a02a3b9717cf6d92a3080
```

PR #164 mantiene como SHA contractual normativo:

```text
1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b
```

## Contrato consolidado

La fuente contractual publicada declara:

- 84 filas;
- 32 recorridos;
- subconjunto B06/B07 de 28 filas / 12 recorridos;
- arranque `booting -> BOOT_OK -> ready`;
- `PAUSE_ASSISTANT` y `RESET_SESSION` prohibidos durante `booting`;
- `TECHNICAL_ERROR` en boot con `error_meta.origin_operation=booting` y `RETRY -> booting`;
- pausa durante `uncertain`, `risk` y `human_handoff` conserva `protection_static`;
- `uncertain + TECHNICAL_ERROR` conserva `dialogue=clarification`;
- `RISK_CLEARED` se rechaza desde `paused+uncertain`;
- `error_meta` es metadato público opcional válido.

No se ha modificado el contrato durante esta ejecución.

## Fallos bloqueantes observados en el código exacto de `904da381`

### B08 · Arranque no está cerrado frente a pausa/reset

**casos**

```text
EV-BOOT-PAUSE_ASSISTANT-FORBIDDEN
EV-BOOT-RESET_SESSION-FORBIDDEN
```

**evidencia**

`PAUSE_ASSISTANT` solo rechaza `operation=error`; desde `booting` es aceptado, cambia a `paused`, pone `motion=off` y la transición ya había incrementado `revision`.

`RESET_SESSION` no tiene precondición. Desde `booting + safety=normal` calcula `operationForSafety(normal)=ready`, por lo que permite alcanzar `ready` sin `BOOT_OK`.

**riesgo**

El ciclo de arranque deja de ser una puerta cerrada y eventos ordinarios pueden saltarse `BOOT_OK`.

**criterio incumplido**

Durante `booting`, `PAUSE_ASSISTANT` y `RESET_SESSION` deben rechazarse sin mutación ni incremento de `revision`.

**corrección mínima**

Rechazar explícitamente esos eventos mientras `operation=booting`; ningún evento ordinario puede llevar a `ready` antes de `BOOT_OK`.

### B09 · Error/retry de arranque no conserva el origen

**casos**

```text
EV-BOOT-TECHNICAL-ERROR
EV-BOOT-RETRY
```

**evidencia**

El contrato exige `error_meta.origin_operation=booting`. La implementación no incluye `error_meta` entre `CONTRACT_KEYS`, `TECHNICAL_ERROR` no registra el origen y `RETRY` con `safety=normal` usa `operationForSafety(normal)`, que devuelve `ready`.

**riesgo**

Un fallo de inicialización puede reintentarse como si el arranque hubiera terminado correctamente.

**criterio incumplido**

`booting + TECHNICAL_ERROR -> error(origin_operation=booting)` y ese error + `RETRY -> booting`.

**corrección mínima**

Admitir `error_meta`, guardar el origen de la operación y hacer que `RETRY` restaure `booting` cuando el error nació durante boot.

### B10 · Pausa bajo seguridad apaga la presentación de protección

**casos**

```text
EV-PAUSE-UNCERTAIN
EV-PAUSE-RISK
EV-PAUSE-HANDOFF
```

**evidencia**

La implementación de `PAUSE_ASSISTANT` asigna incondicionalmente `next.motion = MOTION.OFF` después de conservar los demás campos.

**riesgo**

La pausa solicitada por la persona elimina la señal visual estática de protección mientras sigue existiendo incertidumbre/riesgo/handoff.

**criterio incumplido**

La pausa conserva seguridad y `motion=protection_static` durante `uncertain`, `risk` y `human_handoff`.

**corrección mínima**

Calcular el movimiento de pausa con prioridad de seguridad: `protection_static` bajo atención de seguridad y `off` solo en flujo normal.

### B11 · Error técnico durante `uncertain` pierde la aclaración

**caso**

```text
EV-TECHNICAL-ERROR-UNCERTAIN
```

**evidencia**

`TECHNICAL_ERROR` usa:

```text
next.dialogue = activeProtection(previous) ? HUMAN_HANDOFF : NONE
```

`activeProtection()` solo cubre `risk` y `human_handoff`; `uncertain` cae en `dialogue=none`. El contrato exige `dialogue=clarification`, `safety=uncertain`, `speech=silent`, `motion=protection_static`.

**riesgo**

Un fallo técnico borra la semántica de la aclaración de seguridad pendiente.

**criterio incumplido**

El error técnico no puede degradar ni olvidar la capa `uncertain`.

**corrección mínima**

Conservar `dialogue=clarification` cuando `safety=uncertain`; `RETRY` debe volver a `awaiting_clarification`.

### B12 · `RISK_CLEARED` se acepta desde `paused+uncertain`

**caso**

```text
EV-RISK-CLEARED-FROM-PAUSED-UNCERTAIN-FORBIDDEN
```

**evidencia**

La única precondición de `RISK_CLEARED` es:

```text
previous.safety === uncertain
```

No exige `operation=awaiting_clarification`. Desde `paused+uncertain` el evento se acepta y fuerza `retrieving / clarification / normal / processing`.

**riesgo**

Resolver una aclaración de seguridad reanuda silenciosamente una pausa solicitada por la persona.

**criterio incumplido**

`RISK_CLEARED` solo es válido desde `awaiting_clarification + clarification + uncertain`; desde `paused+uncertain` debe rechazarse sin cambio de `revision`.

**corrección mínima**

Añadir la precondición operacional/dialogal completa antes de aceptar el evento.

### B13 · `error_meta` no forma parte de la frontera pública de la implementación

**casos afectados**

```text
EV-BOOT-TECHNICAL-ERROR
EV-TECHNICAL-ERROR-NORMAL
EV-TECHNICAL-ERROR-UNCERTAIN
EV-TECHNICAL-ERROR-RISK
EV-TECHNICAL-ERROR-HANDOFF
```

**evidencia**

El contrato consolidado declara `error_meta` como campo opcional válido y sus estados de error lo utilizan. `904da381` no incluye `error_meta` en `CONTRACT_KEYS`; un estado contractual con ese metadato se rechaza como campo público inesperado.

**riesgo**

El runtime y QA siguen teniendo fronteras públicas distintas para los estados de error.

**criterio incumplido**

Metadatos opcionales ausentes son válidos; presentes y válidos también deben ser aceptados.

**corrección mínima**

Incluir y validar `error_meta` como metadato opcional, sin convertirlo en campo obligatorio.

## Comprobaciones que sí quedan confirmadas por inspección del SHA exacto

- `createInitialSabikState()` parte de `operation=booting`.
- `BOOT_OK` exige `booting`.
- `SUBMIT` no se acepta durante boot.
- `SPEECH_REQUEST` y `SPEECH_START` están separados.
- `SPEECH_BOUNDARY` exige `speech=speaking`.
- `SPEECH_PAUSE -> motion=off`.
- movimiento reducido se almacena en `motion_meta.reduced` y se cambia por `SET_REDUCED_MOTION`.
- `RISK_CLEARED` ya se rechaza desde `normal`, `risk` y `human_handoff`.
- `human_handoff + SUBMIT` queda rechazado por `canSubmit()`.
- el diff de PR #161 permanece limitado a cuatro archivos S0.

Estas observaciones no sustituyen la ejecución de los runners normativos.

## Suite propia y V7

No se heredan los resultados locales de Codex (`27/27`, `28/28`). Debido a la imposibilidad de crear el checkout independiente, en esta ejecución QA figuran como:

```text
node tools/test-sabik-machine-s0.js -> NO_EJECUTADO
node tools/test-sabik-page-v7.js     -> NO_EJECUTADO
```

## Runner consolidado / subconjunto B06-B07

No se marca ningún verde heredado. La ejecución combinada con `--module` no pudo materializarse en el contenedor por la misma ausencia del checkout Git independiente. La comparación directa entre la matriz exacta de `1c3205fb` y el código exacto de `904da381` ya identifica B08-B13, por lo que la puerta automática no puede ser aceptada.

## Alcance de PR #161

`git compare sabik-preview...904da381` en GitHub devuelve exactamente:

```text
sabik/AGENTS.md
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

**PASS de alcance.** No aparecen panel, CSS, HTML, datasets, índice, assets, `.github`, `main` ni producción.

## Build Linux y tamaño de `dist`

No se pudo ejecutar `python3 scripts/build_site.py` porque el árbol completo no puede materializarse en el contenedor Linux. GitHub tampoco expone workflow runs ni statuses para `904da381`.

Por tanto:

```text
build Linux exit 0              -> NO_DEMOSTRADO
número total de archivos dist   -> NO_DISPONIBLE
archivo más pesado              -> NO_DISPONIBLE
ningún archivo >= 49 MB         -> NO_DEMOSTRADO
dist/docs/sabik/qa ausente      -> NO_DEMOSTRADO
dist/docs/sabik/reviews ausente -> NO_DEMOSTRADO
```

La inspección estática previa de `build_site.py` no se contabiliza como PASS de esta puerta.

## Resultado

```text
BLOQUEADO_S0
```

La causa no es únicamente la falta de build independiente. El SHA `904da381` incumple filas bloqueantes del contrato consolidado `1c3205fb` en arranque, pausa bajo seguridad, error técnico durante `uncertain`, `RISK_CLEARED` desde pausa y frontera `error_meta`.

No se modifica el contrato, no se ordenan cambios a Codex en esta tarea, no se toca PR #162, PR #163, `main` ni producción.