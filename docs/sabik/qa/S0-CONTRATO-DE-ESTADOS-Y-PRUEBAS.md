# S0 · Contrato QA de estados y transiciones

**Issue:** #149  
**Implementación revisada:** #146 / PR #161  
**Destino:** `sabik-preview`

## 1. Propósito

Esta especificación define lo que debe demostrar S0 antes de que empiece S1. S0 no cambia deliberadamente la interfaz: crea una máquina de estados pura, serializable y verificable sobre la que después se conectarán panel, voz, movimiento, seguridad y conversación.

## 2. Capas obligatorias

El estado no puede reducirse a una sola cadena. Debe contener capas independientes.

### `operation`

Valores mínimos:

- `booting`
- `ready`
- `retrieving`
- `composing`
- `presenting`
- `awaiting_clarification`
- `paused`
- `error`

### `dialogue`

Valores mínimos:

- `none`
- `information`
- `practical`
- `clarification`
- `accompaniment`
- `correction`
- `insufficient`
- `human_handoff`

### `adaptation`

Objeto mínimo:

```json
{
  "response_length": "normal",
  "max_options": 3,
  "question_policy": "normal",
  "intensity": "normal",
  "depth": "normal"
}
```

### `safety`

Valores mínimos:

- `normal`
- `uncertain`
- `risk`
- `human_handoff`

### `visibility`

Valores mínimos:

- `expanded`
- `collapsed`
- `hidden`

### `speech`

Valores mínimos:

- `silent`
- `starting`
- `speaking`
- `paused`
- `ended`
- `error`

### `motion`

Valores mínimos:

- `off`
- `ambient`
- `processing`
- `voice_reactive`
- `protection_static`

### `language`

Valores mínimos:

- `es`
- `en`

S0 puede declarar `en` aunque el producto inglés no esté completo; lo que no puede hacer es confundir idioma de estado con disponibilidad funcional.

## 3. Forma mínima

```js
{
  operation,
  dialogue,
  adaptation,
  safety,
  visibility,
  speech,
  motion,
  language,
  revision
}
```

`revision` es un entero creciente o identificador equivalente útil para descartar efectos obsoletos. No implica persistencia.

## 4. Interfaz de la máquina

La transición debe ser pura y no lanzar efectos:

```js
const result = transitionSabikState(previousState, event);
```

El resultado puede ser el nuevo estado o una forma explícita como:

```js
{
  state: nextState,
  accepted: true,
  reason: null
}
```

Si un evento no es válido en el estado actual, debe ocurrir una de estas dos cosas, decidida y documentada para todo el sistema:

1. rechazo explícito sin modificar estado;
2. normalización explícita con razón.

No se admite una mutación parcial silenciosa.

## 5. Invariantes bloqueantes

### I-01 · Pureza

La transición no accede a DOM, `window`, `document`, `fetch`, almacenamiento, reloj, voz, música ni red.

### I-02 · Inmutabilidad

El estado recibido no se modifica. El estado devuelto es una nueva estructura o comparte únicamente valores inmutables.

### I-03 · Pausa separada de borrado

`PAUSE_ASSISTANT` no vacía conversación, entrada, respuesta, fuentes ni preferencias. S0 no necesita guardar esos valores; sí debe impedir que el evento represente un reset.

### I-04 · Visibilidad separada de pausa

`COLLAPSE`, `EXPAND` y cualquier transición a `hidden` no cambian `operation: paused` ni lo reanudan.

### I-05 · Reset explícito

Solo `RESET_SESSION` devuelve las capas conversacionales a sus valores iniciales. Las preferencias de presentación que deban sobrevivir a un reset deberán definirse explícitamente; no se decide por accidente mediante clonación parcial.

### I-06 · Voz separada de movimiento

- `SPEECH_START` cambia voz y puede solicitar movimiento `voice_reactive`.
- reducción de movimiento puede mantener `speech: speaking` con `motion: off`.
- detener movimiento no equivale a pausar voz.
- pausar voz lleva energía visual a cero en fases posteriores.

### I-07 · Seguridad prevalente

Con `safety: risk` o `human_handoff`:

- no se inicia una respuesta normal;
- el movimiento no supera `protection_static`;
- una transición decorativa no devuelve seguridad a `normal`;
- solo un evento de seguridad documentado puede reducir el nivel.

### I-08 · Error diferenciado

`TECHNICAL_ERROR` no se representa como `insufficient`. El usuario debe poder distinguir fallo técnico de falta de contenido.

### I-09 · Idioma estable

Un evento no lingüístico no cambia `language`.

### I-10 · Valores cerrados

No quedan valores libres como `espera`, `respuesta`, `correccion` o `procesando` fuera de las constantes aprobadas. Si se necesitan, deben mapearse a las capas definidas.

## 6. Matriz mínima de eventos

| Evento | Estado previo principal | Cambio obligatorio | No debe cambiar |
|---|---|---|---|
| `BOOT_OK` | `booting` | `operation → ready` | idioma, visibilidad |
| `SUBMIT` | `ready` o `presenting` | `operation → retrieving`, revisión aumenta | visibilidad, idioma |
| `RETRIEVAL_OK` | `retrieving` | `operation → composing` | seguridad |
| `RETRIEVAL_EMPTY` | `retrieving` | `operation → presenting`, `dialogue → insufficient` | idioma |
| `RESPONSE_READY` | `composing` | `operation → presenting` | visibilidad |
| `ASK_CLARIFICATION` | `composing`/`presenting` | `operation → awaiting_clarification`, `dialogue → clarification` | sesión reiniciada |
| `PAUSE_ASSISTANT` | estado no terminal | `operation → paused` | visibilidad, idioma, seguridad |
| `RESUME_ASSISTANT` | `paused` | vuelve a estado estable documentado | visibilidad |
| `RESET_SESSION` | estable | capas conversacionales a inicial | preferencia persistente no definida |
| `COLLAPSE` | cualquiera permitido | `visibility → collapsed` | operación, voz, seguridad |
| `EXPAND` | `collapsed`/`hidden` | `visibility → expanded` | operación, voz, seguridad |
| `SPEECH_START` | `presenting` | `speech → starting/speaking` | operación normal, visibilidad |
| `SPEECH_BOUNDARY` | `speaking` | revisión/energía futura; voz sigue | diálogo, seguridad |
| `SPEECH_PAUSE` | `speaking` | `speech → paused` | operación, visibilidad |
| `SPEECH_RESUME` | `speech: paused` | `speech → speaking` | operación |
| `SPEECH_END` | hablando/pausado | `speech → ended` y luego silencio documentado | respuesta |
| `SPEECH_ERROR` | voz activa | `speech → error` | texto y respuesta |
| `RISK_UNCERTAIN` | cualquiera no confirmado | `safety → uncertain`, aclaración | idioma |
| `RISK_CONFIRMED` | cualquiera | `safety → risk`, diálogo de ayuda | visibilidad no solicitada |
| `HUMAN_HANDOFF` | riesgo | `safety/dialogue → human_handoff` | texto de usuario no persiste |
| `TECHNICAL_ERROR` | cualquiera | `operation → error` | seguridad no se rebaja |
| `RETRY` | `error` | estado de reintento documentado | preferencias |

## 7. Casos bloqueantes

Los casos canónicos se publican también en `tests/specs/sabik/s0-transition-cases.json`.

### S0-001 · arranque

```text
initial.booting + BOOT_OK → ready
```

### S0-002 · respuesta normal

```text
ready + SUBMIT → retrieving
retrieving + RETRIEVAL_OK → composing
composing + RESPONSE_READY → presenting
```

### S0-003 · insuficiencia

```text
ready + SUBMIT → retrieving
retrieving + RETRIEVAL_EMPTY → presenting + insufficient
```

### S0-004 · pausa y visibilidad

```text
presenting + PAUSE_ASSISTANT → paused
paused + COLLAPSE → paused + collapsed
paused/collapsed + EXPAND → paused + expanded
paused + RESUME_ASSISTANT → estado reanudado documentado
```

### S0-005 · pausa no es reset

Después de pausar y reanudar, `revision`, idioma, seguridad, adaptación y estado de voz no deben volver silenciosamente a valores iniciales salvo regla expresa.

### S0-006 · voz normal

```text
presenting + SPEECH_START → speaking
speaking + SPEECH_BOUNDARY → speaking
speaking + SPEECH_PAUSE → speech paused
speech paused + SPEECH_RESUME → speaking
speaking + SPEECH_END → ended/silent documentado
```

### S0-007 · voz con movimiento reducido

Partiendo de movimiento apagado, `SPEECH_START` mantiene `motion: off` y permite `speech: speaking`.

### S0-008 · error de voz

`SPEECH_ERROR` no elimina respuesta ni cambia el diálogo a insuficiencia.

### S0-009 · riesgo incierto

`RISK_UNCERTAIN` conduce a seguridad incierta y aclaración; no activa automáticamente derivación humana confirmada.

### S0-010 · riesgo confirmado

`RISK_CONFIRMED` prevalece sobre operación y movimiento normales. Después, `HUMAN_HANDOFF` produce el estado de derivación.

### S0-011 · error técnico durante riesgo

Un error técnico no rebaja `safety: risk` ni sustituye la ayuda humana por un mensaje genérico de fallo.

### S0-012 · reset

`RESET_SESSION` funciona desde `ready`, `presenting`, `paused`, `awaiting_clarification`, `error` y estados de voz finalizados. Si se prohíbe durante riesgo, el rechazo debe ser explícito y probado.

### S0-013 · evento inválido

Ejemplo: `SPEECH_RESUME` desde `silent`. Debe rechazarse sin mutación o normalizarse con razón documentada.

### S0-014 · determinismo

Mismo estado + mismo evento = mismo resultado estructural.

### S0-015 · estado serializable

`JSON.stringify` y clonación segura no pierden información ni funciones, símbolos o nodos DOM.

## 8. Pruebas estáticas

Deben fallar si:

- aparecen cadenas antiguas fuera de un adaptador de compatibilidad documentado;
- la máquina importa o usa DOM/almacenamiento/red;
- falta una constante o capa requerida;
- una capa adopta un valor no registrado;
- `sabik-state.js` conserva una segunda fuente de verdad contradictoria.

## 9. Puerta automática S0

Bloqueante:

1. test específico de máquina en verde;
2. `node tools/test-sabik-page-v7.js` en verde o actualizado únicamente para aceptar el contrato nuevo sin debilitar expectativas;
3. `python3 scripts/build_site.py` en verde;
4. cero cambios deliberados en HTML/CSS/panel/datasets;
5. diff limitado al alcance de #146;
6. todos los casos S0-001 a S0-015 cubiertos.

Informativo:

- cobertura de ramas de la transición;
- tamaño del nuevo módulo;
- lista de adaptadores temporales.

Manual:

- revisión de nombres para evitar inferencias psicológicas;
- comprobación de que los estados permiten S1/S2/S3 sin combinaciones imposibles;
- revisión independiente contra #147 y #148 cuando estén disponibles.

## 10. Resultado de revisión

La revisión de PR #161 debe terminar con uno de estos estados:

- `ACEPTADO_S0`: puede comenzar S1;
- `CAMBIOS_REQUERIDOS`: contrato incompleto o contradictorio;
- `BLOQUEADO_POR_DECISION`: falta una decisión editorial o de diseño que no debe inventar Codex.

No se utilizará «el build pasa» como equivalente de `ACEPTADO_S0`.
