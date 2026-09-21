# S0 · quinta revalidación técnica de PR #161

**Implementación:** `8df93fcfc5b047d9f6e7bf9e8c1b48eb2b3299a7`  
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`  
**PR implementación:** #161  
**PR QA:** #164  
**Veredicto:** `BLOQUEADO_S0`

## Entorno QA

```text
Linux 6.18.44 x86_64 GNU/Linux
Python 3.13.5
Node v22.16.0
git 2.47.3
```

## 1. Reconstrucción limpia

Se intentó reconstruir un checkout independiente, sin usar el directorio de Codex:

```bash
git clone --no-checkout https://github.com/mruizwow-bit/irisgreen.git /tmp/irisgreen-origin.git
```

Resultado:

```text
fatal: unable to access 'https://github.com/mruizwow-bit/irisgreen.git/':
Could not resolve host: github.com
```

También se buscó una copia `.git` montada bajo `/mnt/data`, `/workspace`, `/home/oai/share` y `/tmp`; no existe una copia utilizable. Por tanto no se sustituyó el requisito de dos worktrees por un árbol local no verificable.

Los SHA sí se verificaron directamente en GitHub:

```text
PR #161 head = 8df93fcfc5b047d9f6e7bf9e8c1b48eb2b3299a7
contrato normativo = 1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b
```

## 2. Contrato sin implementación

No se reutiliza como ejecución fresca el PASS anterior del contrato. Al no poder materializar el worktree `1c3205fb…`, estos comandos no se marcaron como ejecutados en este ciclo:

```text
node tests/specs/sabik/validate-s0-contract-consistency.mjs -> NO_EJECUTADO
node tests/specs/sabik/run-s0-contract.mjs                  -> NO_EJECUTADO
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs         -> NO_EJECUTADO
```

El SHA contractual se mantiene intacto; no se modificó matriz, recorridos, runners, enumeraciones ni semántica.

## 3. Pruebas propias de la implementación

No se heredan cifras locales de Codex. Al no existir checkout independiente:

```text
node tools/test-sabik-machine-s0.js -> NO_EJECUTADO
node tools/test-sabik-page-v7.js     -> NO_EJECUTADO
```

El cambio `904da381… -> 8df93fc…` declara 36 pruebas propias y corrige los bloqueos B08–B13 del ciclo anterior, pero esa evidencia local no se contabiliza como PASS QA.

## 4. Alcance

La comparación `sabik-preview...8df93fc` en GitHub contiene exclusivamente:

```text
sabik/AGENTS.md
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

El quinto commit `904da381...8df93fc` modifica únicamente:

```text
sabik/S0_STATE_MACHINE.md
sabik/nea-core/sabik-machine.js
tools/test-sabik-machine-s0.js
```

**PASS de alcance.** No aparecen panel, CSS, HTML, datasets, índice, assets, `.github`, `main` ni producción.

## 5. Correcciones del ciclo anterior confirmadas en fuente

El código exacto de `8df93fc` corrige B08–B13 en su núcleo:

- `PAUSE_ASSISTANT` ya usa una lista de operaciones permitidas y no acepta `booting`;
- `RESET_SESSION` rechaza `booting`;
- `TECHNICAL_ERROR` registra el origen de la operación;
- `RETRY` desde error de boot vuelve a `booting`;
- la pausa mantiene `protection_static` durante seguridad activa;
- `TECHNICAL_ERROR` durante `uncertain` conserva `dialogue=clarification`;
- `RISK_CLEARED` exige `awaiting_clarification + clarification + uncertain`;
- `error_meta` ya se admite como campo público opcional.

Estas correcciones no bastan para aceptar la matriz consolidada completa.

## 6. Bloqueo B14 · forma y persistencia de `error_meta` no coinciden con el contrato

### Casos garantizados afectados

```text
EV-BOOT-TECHNICAL-ERROR
EV-TECHNICAL-ERROR-NORMAL
EV-TECHNICAL-ERROR-UNCERTAIN
EV-TECHNICAL-ERROR-RISK
EV-TECHNICAL-ERROR-HANDOFF
EV-SPEECH-ERROR
EV-SPEECH-ERROR-REDUCED
EV-SPEECH-ERROR-RISK
EV-SPEECH-ERROR-HANDOFF
EV-RETRY-NORMAL
EV-RETRY-UNCERTAIN
EV-RETRY-RISK
EV-RETRY-HANDOFF
```

### Estado previo / evento

Las filas de error técnico usan payload contractual `code`, por ejemplo:

```text
booting + TECHNICAL_ERROR {code:"boot-failure"}
presenting + TECHNICAL_ERROR {code:"resource-load"}
```

Las filas de voz usan:

```text
SPEECH_ERROR {code:"voice-unavailable"}
```

### Resultado esperado

El contrato consolidado usa perfiles como:

```text
E0 = {origin_operation:"booting", code:"boot-failure"}
E1 = {layer:"speech", code:"voice-unavailable"}
E2 = {origin_operation:"presenting", code:"resource-load"}
E3 = {origin_operation:"awaiting_clarification", code:"resource-load"}
```

Los estados de retry normal/uncertain/risk/handoff conservan además el `error_meta` contractual correspondiente.

### Resultado obtenido por la implementación

`defaultErrorMeta()` solo conserva:

```text
{origin_operation, message}
```

`TECHNICAL_ERROR` crea `error_meta` con `origin_operation` y `message`, pero no conserva `event.code`.

`SPEECH_ERROR` no crea `error_meta` de voz.

`RETRY` ejecuta `clearErrorMeta(next)`, eliminando `error_meta` también en recorridos cuyo estado esperado lo conserva.

### Invariante afectada

Forma pública y resultados exactos de la matriz normativa; trazabilidad de errores.

### Riesgo

Runtime y QA representan de forma distinta el origen/clase del error. La información necesaria para distinguir error de boot, recurso y voz se pierde o cambia de nombre, y los recorridos posteriores no pueden verificar la misma procedencia.

### Criterio incumplido

El runner normativo compara recursivamente los campos presentes en el estado esperado. Un estado que omite `error_meta.code`/`layer` o elimina `error_meta` no satisface esas filas.

### Corrección mínima esperada

Alinear `error_meta` con los perfiles contractuales vigentes, poblar el metadato de `SPEECH_ERROR` y conservarlo en los reintentos donde la matriz lo exige. Esta observación no constituye una orden de cambio en esta tarea.

## 7. Bloqueo B15 · `motion=off` con metadatos omitidos se reactiva

### Caso

```text
EV-SPEECH-REQUEST-META-OMITTED-OFF
```

### Estado previo

```text
operation=presenting
safety=normal
speech=silent
motion=off
motion_meta ausente
```

### Evento

```text
SPEECH_REQUEST
```

### Resultado esperado

```text
speech=starting
motion=off
```

El contrato consolidado fija la regla conservadora: si `motion=off` y no existe información suficiente para demostrar que puede activarse, se mantiene `off`.

### Resultado obtenido por la implementación

`normalizeSabikState()` crea por defecto:

```text
motion_meta.reduced=false
```

Después `SPEECH_REQUEST` llama a `ordinaryMotionFor()`. Con operación `presenting`, habla aún no iniciada y `reduced=false`, la función devuelve:

```text
motion=ambient
```

### Invariante afectada

Metadatos opcionales y política conservadora de movimiento.

### Riesgo

La omisión válida de metadatos puede reactivar movimiento que el estado público mantenía apagado.

### Criterio incumplido

`EV-SPEECH-REQUEST-META-OMITTED-OFF` exige conservar `off`.

### Corrección mínima esperada

Conservar `motion=off` cuando falta una señal contractual que autorice su reactivación. Esta observación no constituye una orden de cambio en esta tarea.

## 8. Quinta comprobación expresa

### Arranque

Por inspección del SHA exacto:

```text
booting + SUBMIT            -> rechazo
booting + PAUSE_ASSISTANT   -> rechazo
booting + RESET_SESSION     -> rechazo
booting + SPEECH_REQUEST    -> rechazo
```

La transición clona el estado antes de modificarlo; los `assertTransition` ocurren después de incrementar el clon, no el objeto de entrada, por lo que el rechazo no muta el estado original.

### Error/reintento de arranque

La lógica ahora conserva `origin_operation=booting` y `RETRY` devuelve `booting` antes de `BOOT_OK`. Sin embargo B14 impide considerar las filas verdes porque falta el `code` contractual.

### Pausa/reanudación con seguridad

La lógica actual usa prioridad de seguridad para el movimiento y `operationForSafety()/dialogueForSafety()` al reanudar. Las rutas `uncertain`, `risk` y `human_handoff` están alineadas en su núcleo.

### Error técnico durante incertidumbre

`dialogueForTechnicalError()` conserva `clarification`; seguridad y `protection_static` se preservan. B14 sigue afectando el estado esperado por `error_meta`.

### `RISK_CLEARED`

La precondición nueva exige simultáneamente:

```text
safety=uncertain
operation=awaiting_clarification
dialogue=clarification
```

Por tanto `normal`, `risk`, `human_handoff` y `paused+uncertain` se rechazan.

### `error_meta`

```text
sin error_meta             -> aceptado por la frontera
error_meta objeto parcial  -> se normaliza a {origin_operation,message}
error_meta no objeto       -> rechazo
```

La normalización parcial no coincide, no obstante, con los perfiles normativos que usan también `code`/`layer` (B14).

## 9. Pureza e invariantes

Inspección estática del módulo exacto:

- no usa `window`;
- no usa `document`/DOM;
- no usa `fetch`;
- no usa almacenamiento web;
- no usa `Date.now`, `performance.now` ni reloj;
- no usa `Math.random`;
- clona el estado antes de modificarlo;
- no escribe sobre el evento;
- no contiene red/voz real dentro de la transición.

La ejecución dinámica fresca de pureza, determinismo, inmutabilidad y serialización no se marca como PASS porque el módulo no pudo materializarse en un checkout independiente ejecutable.

## 10. Runner consolidado y B06/B07

No se modificó ningún runner. No se contabiliza un verde heredado.

La ejecución con `--module` no pudo realizarse por falta del checkout limpio. Aun así, la comparación directa del código exacto y la matriz exacta demuestra que la puerta automática no puede producir `ACEPTA_PUERTA_AUTOMATICA_S0`: B14 y B15 incumplen filas normativas antes de considerar build/V7.

## 11. Build Linux y Netlify

GitHub no publica workflows ni statuses para `8df93fc…` y el contenedor QA no puede crear el checkout completo. Por tanto:

```text
python3 scripts/build_site.py      -> NO_EJECUTADO
build Linux exit 0                 -> NO_DEMOSTRADO
número de archivos de dist         -> NO_DISPONIBLE
archivo más pesado                 -> NO_DISPONIBLE
ningún archivo >= 49 MB            -> NO_DEMOSTRADO
dist/docs/sabik/qa ausente         -> NO_DEMOSTRADO
dist/docs/sabik/reviews ausente    -> NO_DEMOSTRADO
```

No se realizó deploy.

## 12. Resultado

```text
BLOQUEADO_S0
```

El bloqueo no depende únicamente de la falta de build independiente: el SHA `8df93fc` sigue divergiendo de filas normativas del contrato `1c3205fb` en `error_meta` y en conservación de `motion=off` con metadatos omitidos.

PR #161 y PR #164 permanecen abiertos y en `draft`. El SHA contractual normativo continúa siendo `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`. No se modifica PR #162, PR #163, `main` ni producción; no se abre S1 y no se realiza deploy.
